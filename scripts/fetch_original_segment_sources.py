"""Cache official original-song metadata and paragraph text for incomplete timings.
No audio is downloaded; cache errors separately from confirmed 404 responses.
"""
import concurrent.futures, json, os, sys, urllib.request, urllib.error
from song_vocal_segment_audit import Paragraphs
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODES={'vi':'VT','ko':'KO','en':'E','zh':'CH','zh_cn':'CHS','ja':'J','de':'X','fr':'F','pl':'P','cs':'B','hu':'H','id':'IN'}
def read(p):
    with open(os.path.join(ROOT,p),encoding='utf-8') as f:return json.load(f)
def write(p,data):
    with open(os.path.join(ROOT,p),'w',encoding='utf-8') as f:json.dump(data,f,ensure_ascii=False)
def get(url):
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=20) as f:return {'status':f.status,'url':f.url,'body':f.read().decode('utf-8')}
        except urllib.error.HTTPError as e:
            if e.code==404:return {'status':404,'url':url,'body':''}
        except Exception as e:err=str(e)
    return {'status':0,'url':url,'body':'','error':locals().get('err','request failed')}
def main():
    audio=read('jw_extraction/other_media_cache.json'); video=read('jw_extraction/video_cues_cache.json')
    base=read('jw_original_songs_ko_vi.json')['songs']
    jobs=[]
    for s in base:
        for lang in ['vi','ko']:
            k=f'osg:{s["track"]}:{CODES[lang]}'
            if k not in audio or s['track'] in [18,24,112,117]:jobs.append((s['track'],lang))
    def metadata(job):
        n,l=job;c=CODES[l];url=f'https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&fileformat=MP3&alllangs=0&pub=osg&track={n}&langwritten={c}'
        r=get(url);return f'osg:{n}:{c}',json.loads(r['body']) if r['status']==200 else None
    with concurrent.futures.ThreadPoolExecutor(8) as pool:
        for k,d in pool.map(metadata,jobs):
            if d is not None:audio[k]=d
    write('jw_extraction/other_media_cache.json',audio)
    report=json.load(open(sys.argv[1],encoding='utf-8'))
    targets={(int(r['song'].split('-')[1]),r['lang']) for r in report if r['buttons']<r['rows']}
    targets|={(s['track'],'vi') for s in base if not s.get('vi',{}).get('lines')}
    targets|={(n,l) for n in [31,32,34,35,39,40,41] for l in CODES}
    dest='jw_extraction/original_paragraph_cache.json'
    out=read(dest) if os.path.exists(os.path.join(ROOT,dest)) else {}
    def paragraphs(job):
        n,l=job;c=CODES[l];key=f'osg:{n}:{c}'
        f=next(iter((audio.get(key,{}).get('files',{}).get(c,{}).get('MP3')or[])),None)
        doc=(f or {}).get('markers',{});doc=doc or {};docid=doc.get('documentId')
        # A video's finder page may not contain lyrics. The audio document remains authoritative.
        url=f'https://www.jw.org/finder?wtlocale={c}&docid={docid}' if docid else f'https://www.jw.org/finder?wtlocale={c}&lank=pub-osg_{n}_VIDEO'
        r=get(url);p=Paragraphs();p.feed(r['body']) if r['status']==200 else None
        from import_song_languages import parse_page
        title,sections=parse_page(r['body']) if r['status']==200 else ('',[])
        return key,{'status':r['status'],'url':r['url'],'checksum':(f or {}).get('file',{}).get('checksum'),'documentId':docid,'paragraphs':p.out,'title':title,'sections':sections}
    jobs=[j for j in sorted(targets) if f'osg:{j[0]}:{CODES[j[1]]}' not in out]
    with concurrent.futures.ThreadPoolExecutor(8) as pool:
        for k,d in pool.map(paragraphs,jobs):out[k]=d
    write(dest,out)
    print('Official paragraphs:',len(out),'with lyrics:',sum(bool(x['sections']) for x in out.values()),'errors:',sum(x['status']==0 for x in out.values()))
if __name__=='__main__':main()
