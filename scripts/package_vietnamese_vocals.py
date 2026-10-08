"""Gate candidate boundaries; never release a candidate solely because alignment completed."""
import json,os,re,shutil,hashlib
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));W=os.environ['VOCAL_WORK']
sources=json.load(open(W+'/vi-selected-sources.json'));proofs={}
for key,source in sources.items():
 d=json.load(open(W+'/vi-alignments/'+key+'.json'))
 assert d['checksum']==source['checksum'] and d['mediaKey']==source['mediaKey'], 'candidate recording changed'
 lines=d['lines']
 for i,line in enumerate(lines):
  line['text']=re.sub(r'^\s*\d+[.．。]\s*','',line['text']).translate(str.maketrans({'‘':"'",'’':"'",'“':'"','”':'"'})).strip()
  line['text']=re.sub(r'\s+',' ',line['text'])
  if not line['enabled']:continue
  anchor=line.get('caption_anchor'); exact=anchor and anchor['exact']
  if i+1<len(lines) and lines[i+1]['s']>line['s']:line['e']=min(line['e'],lines[i+1]['s'])
  limit=.55 if anchor else .65
  if not exact and (line['confidence']<limit or line['e']-line['s']>12000):
   line['enabled']=False;line['reason']='vocal_boundary_requires_review'
  if line['s']<0 or line['e']<=line['s'] or line['e']>d['duration']*1000:
   line['enabled']=False;line['reason']='invalid_vocal_boundary'
 proofs[key]={'src':source['src'],'mediaKey':source['mediaKey'],'format':'MP4' if source['kind']=='video' else 'MP3','checksum':source['checksum'],'timingMethod':d['method'],'duration':d['duration'],'url':source['url'],'general_audio_exists':source['general_audio_exists'],'general_video_exists':source['general_video_exists'],'model':d['model'],'lines':lines}
json.dump(proofs,open(R+'/scripts/data/vi_vocal_segments.json','w'),ensure_ascii=False,indent=2)
print('tracks',len(proofs),'active',sum(any(x['enabled'] for x in p['lines']) for p in proofs.values()),'lines',sum(x['enabled'] for p in proofs.values() for x in p['lines']))
print('held tracks',[k for k,p in proofs.items() if not any(x['enabled'] for x in p['lines'])])
