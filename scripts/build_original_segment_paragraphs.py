"""Package cached official OSG paragraph text, bound to recording and marker signature.
Refresh source caches with fetch_original_segment_sources.py first.
The marker metadata's hash is retained separately: some VT metadata uses an older
marker hash. The attached API signature and current audio checksum both must match.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
CODES={'VT':'vi','KO':'ko','E':'en','CH':'zh','CHS':'zh_cn','J':'ja','X':'de','F':'fr','P':'pl','B':'cs','H':'hu','IN':'id'}
def main():
    audio=json.loads((ROOT/'jw_extraction/other_media_cache.json').read_text())
    cache=json.loads((ROOT/'jw_extraction/original_paragraph_cache.json').read_text())
    out={}
    for key,entry in cache.items():
        _,track,code=key.split(':')
        file=next(iter(audio.get(key,{}).get('files',{}).get(code,{}).get('MP3',[])),None)
        meta=(file or {}).get('markers') or {}
        if not file or not meta.get('documentId') or not meta.get('markers') or entry['status']!=200 or entry.get('checksum')!=file['file']['checksum']:continue
        paragraphs={str(m['mepsParagraphId']):entry['paragraphs'].get(str(m['mepsParagraphId'])) for m in meta['markers'] if m.get('mepsParagraphId')!=99}
        if not any(paragraphs.values()):continue
        out[f'osg-{track}|{CODES[code]}']={'checksum':file['file']['checksum'],'markerHash':meta.get('hash'),'documentId':meta['documentId'],
          'signature':[[m['startTime'],m['duration'],m['mepsParagraphId']] for m in meta['markers']],'paragraphs':paragraphs}
    (ROOT/'scripts/data/original_segment_paragraphs.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))+'\n')
    print('Packaged',len(out),'official paragraph maps')
if __name__=='__main__':main()
