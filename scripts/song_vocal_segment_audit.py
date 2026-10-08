"""Audit official vocal sources against the official document's paragraph text.
Run normally for fresh API answers; --cache reuses raw responses (including failures).
Vietnamese analysis is imported only from checksum-bound, gated candidates. Uncertain interlude/outro boundaries fail closed.
"""
import concurrent.futures as futures
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys
import unicodedata
import urllib.error
import urllib.request
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODES = {"vi":"VT", "cs":"B", "zh_cn":"CHS", "zh":"CH", "en":"E", "fr":"F", "de":"X", "hu":"H", "id":"IN", "ja":"J", "ko":"KO", "pl":"P"}
API = 'https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&fileformat=MP3&alllangs=0&pub=%s&track=%d&langwritten=%s'
CACHE_DIR = os.path.join(ROOT, 'jw_extraction', 'vocal_verified_cache')
STRUCT = re.compile(r'^\s*(\(.*\)|（.*）|[\[【].*[\]】]|\d+\s*[.．。]?|[※＊*].*)\s*$')

def norm(text):
    return re.sub(r'\s+', ' ', re.sub(r'^\s*\d+[.．。]\s*', '', unicodedata.normalize('NFC', text).translate(str.maketrans({'‘':"'",'’':"'",'“':'"','”':'"'})))).strip()

def request(url):
    path = os.path.join(CACHE_DIR, hashlib.sha256(url.encode()).hexdigest() + '.json')
    if '--cache' in sys.argv and os.path.exists(path):
        return json.load(open(path, encoding='utf-8'))
    result = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'}), timeout=25) as response:
                result = {'status':response.status, 'url':response.url, 'body':response.read().decode('utf-8')}
            break
        except urllib.error.HTTPError as error:
            result = {'status':error.code, 'url':url, 'body':''}
            if error.code == 404: break
        except Exception as error:
            result = {'status':0, 'url':url, 'body':'', 'error':str(error)}
    with open(path, 'w', encoding='utf-8') as stream: json.dump(result, stream, ensure_ascii=False)
    return result

class Paragraphs(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pid = None
        self.skip = 0
        self.out = {}
        self.text = ''
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'p' and attrs.get('data-pid', '').isdigit():
            self.pid = int(attrs['data-pid']); self.text = ''
        if tag in ('rt','rp') or (tag == 'span' and 'txtSrcBullet' in attrs.get('class','')): self.skip += 1
        if tag == 'br' and self.pid is not None: self.text += ' '
    def handle_endtag(self, tag):
        if tag in ('rt','rp','span') and self.skip: self.skip -= 1
        if tag == 'p' and self.pid is not None:
            self.out[self.pid] = norm(self.text); self.pid = None
    def handle_data(self, data):
        if self.pid is not None and not self.skip: self.text += data

def mapping():
    sources = json.load(open(os.path.join(ROOT,'scripts/data/kingdom_vi_vocal_sources.json'), encoding='utf-8'))
    return {int(key):value['audio'] for key,value in sources.items() if value.get('audio')}


def merge_vietnamese(report, manifest):
    path = os.path.join(ROOT,'scripts/data/vi_vocal_segments.json')
    if not os.path.exists(path): return
    proofs = json.load(open(path, encoding='utf-8'))
    from apply_vocal_manual_segments import apply_manual
    apply_manual(proofs,ROOT)
    for row in report:
        key = str(row['track'])
        if row['locale'] != 'vi' or key not in proofs: continue
        proof = proofs[key]
        row.update(selected_source=proof['src'],media_key=proof['mediaKey'],format=proof['format'],checksum=proof['checksum'],url=proof['url'],timing_method=proof['timingMethod'],lines=proof['lines'],buttons=sum(line['enabled'] for line in proof['lines']),general_audio_exists=proof['general_audio_exists'],general_video_exists=proof['general_video_exists'])
        row['disabled_line_reasons'] = {reason:sum(line['reason']==reason for line in proof['lines'] if not line['enabled']) for reason in {line['reason'] for line in proof['lines'] if not line['enabled']}}
        row['active'] = row['buttons'] > 0
        row['reason'] = ('user_supplied_line_boundaries' if proof['timingMethod']=='user_supplied_same_recording_line_boundaries' else 'same_recording_vocal_analysis') if row['active'] else 'vocal_boundary_requires_review'
        if proof['format']=='MP4':row['marker_count']=0
        manifest[key+'|vi'] = proof



def merge_manual_children(report, manifest, rows):
    """Explicit user permission: reuse supplied children times across learner locales.
    Never substitute Vietnamese audio or a general choir for a missing local children video.
    All Vietnamese children recordings select learner children with the same gated intervals.
    """
    children = [(identity.split('|')[0],proof) for identity,proof in list(manifest.items()) if identity.endswith('|vi') and proof['src']=='pksjj']
    urls = ['https://b.jw-cdn.org/apis/mediator/v1/media-items/'+code+'/pub-pksjj_'+key+'_VIDEO?clientType=www' for key,vi in children for locale,code in CODES.items() if locale != 'vi']
    # Independent locale identities can be fetched concurrently; the merge remains ordered.
    with futures.ThreadPoolExecutor(max_workers=8) as pool:
        responses = dict(zip(urls, pool.map(request, urls)))
    for key, vi in children:
        override = vi
        if vi.get('format') != 'MP4' or vi['mediaKey'] != 'pub-pksjj_'+key+'_VIDEO': continue
        for row in report:
            if str(row['track']) != key: continue
            locale = row['locale']
            if locale == 'vi': continue
            row.update(selected_source='pksjj',media_key='pub-pksjj_'+key+'_VIDEO',format='MP4',marker_count=0,active=False,buttons=0,lines=[],reason='children_video_unavailable',timing_method='user_authorized_shared_children_line_boundaries')
            row['default_source_probes'] = row.pop('source_probes', [])
            for field in ('document_id','metadata_hash','official_lyrics_url','sung_marker_count'):
                row.pop(field,None)
            row['manual_children_override'] = True
            manifest.pop(key+'|'+locale,None)
            response = responses['https://b.jw-cdn.org/apis/mediator/v1/media-items/'+CODES[locale]+'/'+row['media_key']+'?clientType=www']
            row['source_probes'] = [{'source':'pksjj','media_key':row['media_key'],'http_status':response['status']}]
            if response['status'] != 200:
                if response['status'] != 404: row['reason']='children_video_request_failed'
                continue
            data = json.loads(response['body'])
            if data.get('language',{}).get('languageCode') != CODES[locale]:
                row['reason']='children_video_language_mismatch';continue
            media = next((m for m in data.get('media',[]) if m.get('languageAgnosticNaturalKey')==row['media_key'] and '_'+CODES[locale]+'_' in m.get('naturalKey','')),None)
            file = next((f for f in (media or {}).get('files',[]) if f.get('label')=='360p' and f.get('mimetype')=='video/mp4'),None)
            if not file or not file.get('checksum') or not re.match(r'^https://[a-z0-9.-]+\.jw-cdn\.org/',file.get('progressiveDownloadURL','')):continue
            lyrics = rows[int(key)][locale]
            if len(lyrics) != len(override['lines']):
                row['reason']='manual_children_line_count_mismatch';continue
            if file.get('duration',0)*1000 < max((line['e'] for line in override['lines'] if line['enabled']), default=0):
                row['reason']='manual_children_times_exceed_duration';continue
            lines = [dict(s=t['s'],e=t['e'],m=i,pid=None,text=norm(text),enabled=t['enabled'],reason='user_authorized_shared_children_line_boundaries' if t['enabled'] else 'vietnamese_line_unverified') for i,(text,t) in enumerate(zip(lyrics,override['lines']))]
            proof = dict(src='pksjj',mediaKey=row['media_key'],format='MP4',checksum=file['checksum'],duration=file['duration'],url=file['progressiveDownloadURL'],timingMethod=row['timing_method'],timingSource='User authorized identical Vietnamese children choir intervals for each learner own children recording, 2026-10-08; Vietnamese timing method: '+vi['timingMethod'],manualChildrenOverride=True,lines=lines)
            manifest[key+'|'+locale]=proof
            buttons=sum(line['enabled'] for line in lines)
            row.update(checksum=proof['checksum'],url=proof['url'],lines=lines,active=buttons>0,buttons=buttons,reason='user_authorized_shared_children_line_boundaries' if buttons else 'vietnamese_vocal_boundary_requires_review',disabled_line_reasons={'vietnamese_line_unverified':len(lines)-buttons} if buttons<len(lines) else {})


def write_manifest(manifest, table):
    sources = json.load(open(os.path.join(ROOT,'scripts/data/kingdom_vi_vocal_sources.json'), encoding='utf-8'))
    fixes = {96:[['chỉ;','chi;']],100:[['†a','ta'],['đồ bao','đổ bao']],124:[['cạnh ngoài.','cạnh ngài.']],137:[['quỹ trọng','quý trọng']]}
    with open(os.path.join(ROOT,'song_vocal_segments.js'),'w',encoding='utf-8') as stream:
        stream.write('// Generated same-recording official cues / vocal alignment; uncertain lines disabled.\n')
        for name,data in [('KINGDOM_VI_VOCAL_SOURCES',table),('KINGDOM_VI_VOCAL_SOURCE_MAP',sources),('KINGDOM_VI_LYRIC_FIXES',fixes),('KINGDOM_VOCAL_SEGMENTS',manifest)]:
            stream.write('var '+name+' = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')

def ms(value):
    match = re.fullmatch(r'(\d+):(\d+):(\d+(?:\.\d+)?)', str(value))
    return round((int(match[1])*3600+int(match[2])*60+float(match[3]))*1000) if match else None

def media(pub, track, code):
    response = request(API % (pub,track,code))
    if response['status'] == 404: return None, 'absent'
    if response['status'] != 200: return None, 'source_request_failed'
    try:
        files = json.loads(response['body']).get('files',{}).get(code,{}).get('MP3',[])
        file = next((f for f in files if f.get('pub') == pub and f.get('track') == track and re.match(r'^https://[a-z0-9.-]+\.jw-cdn\.org/',f.get('file',{}).get('url',''))), None)
        return file, 'available' if file else 'absent'
    except (ValueError, TypeError): return None, 'invalid_response'

def audit(job, rows, table):
    track, locale = job; code = CODES[locale]
    expected = table.get(track) if locale == 'vi' else None
    candidates = [('sjjc',track), ('pksjj',track)]
    if expected and track != 164:
        mapped = re.fullmatch(r'pub-(sjjc|pksjj)_(\d+)_AUDIO', expected)
        if not mapped or int(mapped[2]) != track: raise ValueError('Invalid attachment media mapping')
        candidates = [('sjjc',int(mapped[2])), ('pksjj',int(mapped[2]))]
    # The explicit Vietnamese exception refers to a different official publication/track.
    if locale == 'vi' and track == 164: candidates = [('osg',126)]
    selected = None; probes = []
    for pub, audio_track in candidates:
        selected, state = media(pub, audio_track, code)
        probes.append({'source':pub, 'track':audio_track, 'state':state})
        if selected or state != 'absent': break  # a network failure is not evidence of absence
    row = {'track':track, 'locale':locale, 'jw':code, 'attachment_media_key':expected,
           'selected_source':pub if selected else None, 'media_key':f'pub-{pub}_{audio_track}_AUDIO' if selected else None,
           'source_probes':probes, 'marker_count':0, 'singable_line_count':len(rows[track][locale]), 'active':False, 'buttons':0, 'reason':'no_vocal_source', 'lines':[]}
    if not selected:
        if state != 'absent': row['reason'] = state
        return row, None
    meta = selected.get('markers') or {}; markers = meta.get('markers') or []
    row['marker_count'] = len(markers)
    row['url'] = selected['file']['url']
    row['document_id'] = meta.get('documentId')
    row['checksum'] = selected['file'].get('checksum')
    row['metadata_hash'] = meta.get('hash')
    if not markers: row['reason'] = 'no_official_timed_metadata'; return row, None
    if meta.get('mepsLanguageSpoken') != code or meta.get('mepsLanguageWritten') != code:
        row['reason'] = 'metadata_locale_mismatch'; return row, None
    if meta.get('hash') != row['checksum']:
        row['reason'] = 'metadata_audio_hash_mismatch'; return row, None
    docid = meta.get('documentId')
    if not docid: row['reason'] = 'missing_official_document'; return row, None
    url = f'https://www.jw.org/finder?wtlocale={code}&docid={docid}&srcid=jwlshare'
    document = request(url)
    row['official_lyrics_url'] = document['url']
    if document['status'] != 200: row['reason'] = 'official_lyrics_request_failed'; return row, None
    parser = Paragraphs(); parser.feed(document['body'])
    sung = []; previous_end = -1
    for index, marker in enumerate(markers):
        start, duration = ms(marker.get('startTime')), ms(marker.get('duration'))
        if start is None or duration is None or duration <= 0 or start < previous_end or (marker.get('mepsParagraphId') != 99 and start + duration > round(selected.get('duration',0)*1000)):
            row['reason'] = 'invalid_or_overlapping_markers'; return row, None
        previous_end = start+duration
        if marker.get('mepsParagraphId') == 99: continue
        text = parser.out.get(marker.get('mepsParagraphId'))
        if not text or STRUCT.fullmatch(text): row['reason'] = 'marker_paragraph_not_lyric'; return row, None
        sung.append({'s':start,'e':start+duration,'m':index,'pid':marker['mepsParagraphId'],'text':text})
    row['sung_marker_count'] = len(sung)
    lyrics = rows[track][locale]
    if len(sung) != len(lyrics): row['reason'] = 'paragraph_line_count_mismatch'; return row, None
    if any(mark['text'] != norm(text) for mark,text in zip(sung,lyrics)):
        row['reason'] = 'official_paragraph_text_mismatch'; return row, None
    durations = sorted(mark['e']-mark['s'] for mark in sung)
    median = durations[len(durations)//2] if durations else 0
    for mark in sung:
        following = markers[mark['m']+1] if mark['m']+1 < len(markers) else None
        # A paragraph marker does not locate the end of voice inside a stanza-ending span.
        # Hold the entire span, never invent a shorter end from its duration.
        reason = 'verified_official_paragraph'
        if following is None or following.get('mepsParagraphId') == 99: reason = 'vocal_end_before_interlude_or_outro_unproven'
        elif mark['e']-mark['s'] > 15000 and mark['e']-mark['s'] > median*2.5: reason = 'possible_embedded_instrumental_span'
        mark['enabled'] = reason == 'verified_official_paragraph'
        mark['reason'] = reason
    row['lines'] = sung
    row['buttons'] = sum(mark['enabled'] for mark in sung)
    row['active'] = row['buttons'] > 0
    row['reason'] = 'verified_official_paragraphs' if row['active'] else 'no_proven_vocal_only_boundary'
    signature = [[m.get('startTime'),m.get('duration'),m.get('mepsParagraphId')] for m in markers]
    entry = {'src':pub,'mediaKey':row['media_key'],'checksum':row['checksum'], 'documentId':docid, 'signature':signature,'lines':sung}
    return row, entry

def main():
    os.makedirs(CACHE_DIR, exist_ok=True)
    table = mapping()
    source = subprocess.check_output(['node','-e',"const s=require('fs').readFileSync('songs_data.js','utf8');process.stdout.write(JSON.stringify(new Function(s+';return SONGS_DATA;')()))"], cwd=ROOT, text=True)
    rows = {song['number']:{locale:[line[locale].strip() for line in song['lines'] if line.get(locale,'').strip() and not STRUCT.fullmatch(line[locale].strip())] for locale in CODES} for song in json.loads(source)}
    report = []; manifest = {}
    jobs = [(track,locale) for track in sorted(rows) for locale in CODES]
    with futures.ThreadPoolExecutor(10) as pool:
        for count,(row, entry) in enumerate(pool.map(lambda job:audit(job,rows,table),jobs),1):
            report.append(row)
            if entry: manifest[f"{row['track']}|{row['locale']}"] = entry
            if count % 100 == 0: print(f'{count}/{len(jobs)} audited', flush=True)
    merge_vietnamese(report, manifest)
    merge_manual_children(report, manifest, rows)
    totals = {locale:{'active_tracks':sum(r['active'] for r in report if r['locale']==locale), 'enabled_lines':sum(r['buttons'] for r in report if r['locale']==locale)} for locale in CODES}
    output = {'generated':datetime.datetime.now(datetime.timezone.utc).isoformat(), 'fresh_network': '--cache' not in sys.argv, 'base_commit':'c7e3a3d', 'source_priority':['general_choir_audio_or_video','pksjj'], 'manual_children_priority': 'All Vietnamese pksjj selections require each learner own children recording with identical gated Vietnamese times; manual Vietnamese children overrides also apply', 'explicit_exceptions':{'141|vi':'pub-pksjj_141_VIDEO (user-selected; attachment jwbon mapping retained for provenance)','163|vi':'pub-jwbcov26_1_VIDEO','164|vi':['pub-osg_126_AUDIO','pub-osg_126_VIDEO']}, 'attachment_sha256':hashlib.sha256(open(os.path.join(ROOT,'scripts/data/kingdom_vi_vocal_sources.txt'),'rb').read()).hexdigest(), 'vi_source_mapping':json.load(open(os.path.join(ROOT,'scripts/data/kingdom_vi_vocal_sources.json'),encoding='utf-8')), 'totals':totals,'rows':report}
    with open(os.path.join(ROOT,'song_vocal_segment_audit_report.json'),'w',encoding='utf-8') as stream: json.dump(output,stream,ensure_ascii=False,indent=2)
    write_manifest(manifest, table)
    print(json.dumps(totals,ensure_ascii=False),flush=True)

if __name__ == '__main__': main()
