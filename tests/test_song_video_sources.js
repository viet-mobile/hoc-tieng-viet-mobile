const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const s=fs.readFileSync('app_logic.js','utf8'),section=s.slice(s.indexOf('  var SONG_SEG_API ='),s.indexOf('  var songSeg ='));
let checks=0;
async function run({track=1,adult=false,video=false,badHash=false,error=false}={}){
 const calls=[],map=JSON.parse(fs.readFileSync('scripts/data/kingdom_vi_vocal_sources.json'));
 const key=map[track].video,src=key.split('-')[1].split('_')[0];
 const proof={src,format:'MP4',mediaKey:key,checksum:badHash?'changed':'abc',lines:[{s:10000,e:13000,text:'test',enabled:true}]};
 const ctx=vm.createContext({songJwLocale:()=>['VT'],KINGDOM_VI_VOCAL_SOURCE_MAP:map,KINGDOM_VOCAL_SEGMENTS:{[track+'|vi']:proof},fetch:async url=>{
  calls.push(url);if(error)throw Error('offline');
  if(url.includes('GETPUB'))return {ok:true,status:200,json:async()=>({files:{VT:{MP3:adult?[{pub:'sjjc',track,file:{url:'https://cfp2.jw-cdn.org/a.mp3',checksum:'abc'}}]:[]}}})};
  const k=url.split('/VT/')[1].split('?')[0],exists=k===key||(video&&k===`pub-sjjc_${track}_VIDEO`);
  return {ok:true,status:200,json:async()=>({language:{languageCode:'VT'},media:exists?[{languageAgnosticNaturalKey:k,naturalKey:k+'_VT_',files:[{label:'360p',mimetype:'video/mp4',checksum:'abc',progressiveDownloadURL:'https://cfp2.jw-cdn.org/a.mp4'}]}]:[]})};
 }});vm.runInContext(section,ctx);return {info:await ctx.songSegResolve('kingdom',track,'vi'),calls};
}
(async()=>{
 let r=await run();assert.equal(r.info.src,'pksjj');assert.ok(r.info.marks);checks++;
 for(const option of [{adult:true},{video:true},{error:true},{badHash:true}]){r=await run(option);assert.equal(r.info.marks,null);if(!option.badHash)assert.ok(!r.calls.some(x=>x.includes('pub-pksjj')));checks++;}
 for(const track of [141,163,164]){r=await run({track});assert.ok(r.info.marks);assert.ok(!r.calls.some(x=>x.includes('pksjj')));checks++;}
 const data=vm.createContext({});vm.runInContext(fs.readFileSync('song_vocal_segments.js','utf8'),data);
 const songs=new Function(fs.readFileSync('songs_data.js','utf8')+';return SONGS_DATA')();
 const normalize=t=>t.normalize('NFC').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/^\s*\d+[.．。]\s*/,'').replace(/\s+/g,' ').trim();
 const p=JSON.parse(fs.readFileSync('scripts/data/vi_vocal_segments.json'));assert.equal(Object.keys(p).length,54);
 for(const [track,proof] of Object.entries(p)){
  const fixes=data.KINGDOM_VI_LYRIC_FIXES[track]||[];
  const lyrics=songs.find(x=>String(x.number)===track).lines.map(x=>x.vi).filter(x=>x?.trim()&&!/^\s*(\(.*\)|\d+[.．。]?)\s*$/.test(x));
  assert.equal(lyrics.length,proof.lines.length);
  lyrics.forEach((text,i)=>{for(const [a,b]of fixes)text=text.split(a).join(b);assert.equal(normalize(text),proof.lines[i].text,track+':'+i);});
  assert.ok(!['sjjm','sjji'].includes(proof.src));assert.ok(proof.checksum);assert.ok(proof.lines.length);
  if(proof.src==='pksjj'&&!proof.manualChildrenOverride)assert.ok(!proof.general_audio_exists&&!proof.general_video_exists);
  let end=0;for(const l of proof.lines){if(!l.enabled)continue;assert.ok(l.s>=end&&l.e>l.s&&l.e<=proof.duration*1000);end=l.e;}checks++;
 }
 console.log(`${checks} video source / manifest checks passed`);
})().catch(e=>{console.error(e);process.exitCode=1;});
