"""Reproduce CTC candidates (not automatic release approval).
Requires PyAV, numpy, torch, transformers. Set VOCAL_WORK to a private directory
containing vi-selected-sources.json / media; VOCAL_MODEL to the local model.
Model: nguyenvulebinh/wav2vec2-base-vietnamese-250h, CC-BY-NC, revision
69e9000591623e5a4fc2f502407860bcdc0de0b2. No model or media is rehosted.
Candidate timestamps remain tied to the selected file checksum. Release gates
are documented in docs/vietnamese_vocal_segments.md.
"""
import os,sys,json,re,time,unicodedata,hashlib
import numpy as np
import av
import torch
from transformers import Wav2Vec2ForCTC
WORK=os.path.dirname(os.path.abspath(__file__))
WORK=os.environ.get('VOCAL_WORK',WORK)
MODEL=os.environ.get('VOCAL_MODEL',WORK+'/alignment-model')
torch.set_num_threads(4);torch.set_num_interop_threads(1)
print('loading model',flush=True)
model=Wav2Vec2ForCTC.from_pretrained(MODEL,local_files_only=True).eval()
vocab=json.load(open(MODEL+'/vocab.json'));blank=vocab['<pad>']

def waveform(path):
 c=av.open(path);r=av.AudioResampler(format='fltp',layout='mono',rate=16000);parts=[]
 for frame in c.decode(audio=0):
  for f in r.resample(frame):parts.append(f.to_ndarray().reshape(-1))
 for f in r.resample(None):parts.append(f.to_ndarray().reshape(-1))
 return np.concatenate(parts)

def emissions(audio):
 outputs=[];times=[];step=6*16000
 for core in range(0,len(audio),step):
  lo=max(0,core-16000);hi=min(len(audio),core+step+16000)
  x=audio[lo:hi];x=(x-x.mean())/np.sqrt(x.var()+1e-7)
  with torch.inference_mode():p=model(torch.from_numpy(x.copy()).unsqueeze(0)).logits[0].log_softmax(-1).cpu().numpy()
  ts=lo/16000+np.arange(len(p))*0.02+0.0125
  use=(ts>=core/16000)&(ts<min(len(audio),core+step)/16000)
  outputs.append(p[use]);times.extend(ts[use])
 return np.concatenate(outputs),np.array(times)

def text_chars(lines):
 tokens=[];spans=[]
 for text in lines:
  text=re.sub(r'^\s*\d+[.．。]\s*','',unicodedata.normalize('NFC',text).lower())
  chars=re.sub(r'[^\w\s]',' ',text);chars=re.sub(r'\s+',' ',chars).strip().replace(' ','|')
  unknown=[x for x in chars if x not in vocab]
  if unknown:raise ValueError('unknown letters '+repr(unknown))
  start=len(tokens);tokens.extend(vocab[x] for x in chars);spans.append((start,len(tokens)))
  tokens.append(vocab['|'])
 return tokens[:-1],spans

def anchors(vtt, lyrics):
    if not vtt: return [None] * len(lyrics)
    import html
    cues=[]
    for block in re.split(r'\r?\n\s*\r?\n',vtt):
        match=re.search(r'(\d+:\d+:\d+\.\d+) --> (\d+:\d+:\d+\.\d+)[^\n]*\n(.*)',block,re.S)
        if not match: continue
        def stamp(s):
            h,m,se=map(float,s.split(':'));return h*3600+m*60+se
        text=html.unescape(re.sub(r'<[^>]+>','',match[3]))
        text=''.join(c for c in unicodedata.normalize('NFC',text).lower() if c.isalpha())
        if text: cues.append((stamp(match[1]),stamp(match[2]),text))
    letters=''; owners=[]
    for i,cue in enumerate(cues): letters+=cue[2];owners.extend([i]*len(cue[2]))
    cursor=0;result=[]
    for text in lyrics:
        text=''.join(c for c in unicodedata.normalize('NFC',text).lower() if c.isalpha())
        at=letters.find(text,cursor)
        if at < 0: result.append(None); continue
        first,last=owners[at],owners[at+len(text)-1]
        result.append({'s':cues[first][0],'e':cues[last][1], 'exact':at==(sum(len(c[2]) for c in cues[:first])) and at+len(text)==sum(len(c[2]) for c in cues[:last+1]),'cue_start':first,'cue_end':last})
        cursor=at+len(text)
    return result

def align(p,times,lyrics,bounds=None):
 tokens,spans=text_chars(lyrics);tokens=np.array(tokens,dtype=np.int32);state=np.full(2*len(tokens)+1,blank,dtype=np.int32);state[1::2]=tokens
 T,S=len(p),len(state);allowed=np.zeros(S,dtype=bool);allowed[3::2]=state[3::2]!=state[1:-2:2]
 prev=np.full(S,-np.inf,dtype=np.float32);prev[0]=0
 mins=np.full(S,-np.inf);maxs=np.full(S,np.inf)
 if bounds:
  for (start,end),bound in zip(spans,bounds):
   if not bound:continue
   mins[2*start+1:2*end]=bound['s']-0.15
   maxs[2*start+1:2*end]=bound['e']+0.15
 
 back=np.zeros((T,S),dtype=np.uint8)
 for t in range(T):
  stay=prev;advance=np.r_[-np.inf,prev[:-1]];skip=np.r_[[-np.inf,-np.inf],prev[:-2]];skip[~allowed]=-np.inf
  choices=np.stack([stay,advance,skip]);which=choices.argmax(axis=0).astype(np.uint8)
  back[t]=which;prev=np.max(choices,axis=0)+p[t,state]
  prev[(times[t]<mins)|(times[t]>maxs)]=-np.inf
 # Trailing instrumental and additional repeats may stay in the final blank.
 s=S-1 if prev[-1]>=prev[-2] else S-2;path=np.empty(T,dtype=np.int32)
 for t in range(T-1,-1,-1):path[t]=s;s-=int(back[t,s])
 if s not in [0,-1]:raise ValueError('incomplete alignment')
 chars=[]
 for i,token in enumerate(tokens):
  frames=np.flatnonzero(path==2*i+1)
  if not len(frames):raise ValueError('unmatched character')
  probabilities=np.exp(p[frames,token]);peak=float(probabilities.max())
  voiced=frames[probabilities>=max(0.025,peak*0.15)]
  if not len(voiced):voiced=frames[[int(probabilities.argmax())]]
  chars.append({'s':float(times[voiced[0]]-0.0125),'e':float(times[voiced[-1]]+0.0075),'score':peak})
 result=[]
 for i,(start,end) in enumerate(spans):
  c=chars[start:end];scores=[x['score'] for x in c]
  result.append({'s':round(c[0]['s']*1000),'e':round(c[-1]['e']*1000),'text':lyrics[i], 'confidence':round(float(np.mean(scores)),4),'min_char_score':round(min(scores),4),'m':i,'pid':None,'enabled':True,'reason':'video_vocal_ctc_alignment'})
 return result

if __name__=='__main__':
 selected=json.load(open(WORK+'/vi-selected-sources.json'))
 tracks=[int(x) for x in sys.argv[1:]] or sorted(map(int,selected))
 for track in tracks:
  d=selected[str(track)];
  if track == 100:d['lyrics']=[text.replace('đồ bao','đổ bao') for text in d['lyrics']]
  out=WORK+'/vi-alignments/'+str(track)+'.json';os.makedirs(os.path.dirname(out),exist_ok=True)
  if os.path.exists(out):continue
  start=time.time()
  if hashlib.md5(open(d['local_path'],'rb').read()).hexdigest()!=d['checksum']:raise ValueError('recording checksum mismatch')
  a=waveform(d['local_path']);p,t=emissions(a)
  omitted={26:list(range(4,9)),76:list(range(8,12))}.get(track,[])
  actual=[text for i,text in enumerate(d['lyrics']) if i not in omitted]
  bounds=anchors(d.get('vtt'),actual)
  actual_lines=align(p,t,actual,bounds)
  lines=[];idx=0
  for i,text in enumerate(d['lyrics']):
   if i in omitted:
    lines.append({'s':0,'e':0,'m':i,'pid':None,'text':text,'enabled':False,'confidence':0,'reason':'lyric_occurrence_omitted_in_selected_recording'})
   else:
    line=actual_lines[idx];bound=bounds[idx];idx+=1
    line['m']=i
    if bound:
     line['caption_anchor']=bound
     if bound['exact']:
      line['s']=round(bound['s']*1000);line['e']=round(bound['e']*1000);line['reason']='official_video_lyric_cues'
    lines.append(line)
  inverse={v:k for k,v in vocab.items()};ids=p.argmax(1);decoded=[];last=None
  for x in ids:
   if x!=last and x!=blank:decoded.append(inverse[int(x)])
   last=x
  result={'track':track,'mediaKey':d['mediaKey'],'checksum':d['checksum'],'method':'vietnamese_ctc_same_recording','model':json.load(open(MODEL+'/provenance.json')),'duration':len(a)/16000,'lines':lines,'asr_transcript':''.join(decoded).replace('|',' '),'runtime_s':round(time.time()-start,2)}
  json.dump(result,open(out,'w'),ensure_ascii=False,indent=2)
  print(track,result['runtime_s'],'seconds',[(x['s'],x['e'],x['confidence']) for x in lines[:4]],'min',min(x['confidence'] for x in lines),flush=True)
