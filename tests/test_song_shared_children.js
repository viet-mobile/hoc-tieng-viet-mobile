// Standing user policy: learner children use exactly the enabled Vietnamese intervals.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('app_logic.js','utf8'),section=source.slice(source.indexOf('  var SONG_SEG_API ='),source.indexOf('  var songSeg ='));
const data=vm.createContext({});vm.runInContext(fs.readFileSync('song_vocal_segments.js','utf8'),data);
const codes={vi:'VT',ko:'KO',ja:'J',en:'E',cs:'B',zh:'CH',zh_cn:'CHS',de:'X',fr:'F',hu:'H',id:'IN',pl:'P'};
let checks=0;
async function resolve(track,lang,mode='ok'){
 const proof=data.KINGDOM_VOCAL_SEGMENTS[track+'|'+lang],calls=[];
 const ctx=vm.createContext({KINGDOM_VOCAL_SEGMENTS:data.KINGDOM_VOCAL_SEGMENTS,songJwLocale:l=>[codes[l]],fetch:async url=>{calls.push(url);if(mode==='offline')throw Error('offline');return {ok:true,status:200,json:async()=>({language:{languageCode:codes[lang]},media:[{naturalKey:'pub-pksjj_'+track+'_'+codes[lang]+'_VIDEO',languageAgnosticNaturalKey:'pub-pksjj_'+track+'_VIDEO',files:[{label:'360p',mimetype:'video/mp4',duration:proof.duration,checksum:mode==='changed'?'changed':proof.checksum,progressiveDownloadURL:'https://cfp2.jw-cdn.org/test.mp4'}]}]})}}});
 vm.runInContext(section,ctx);return {info:await ctx.songSegResolve('kingdom',track,lang),calls};
}
(async()=>{
 const children=Object.entries(data.KINGDOM_VOCAL_SEGMENTS).filter(([id,p])=>id.endsWith('|vi')&&p.src==='pksjj');assert.equal(children.length,37);
 for(const [id,vi] of children){const track=id.split('|')[0];for(const lang of Object.keys(codes).filter(l=>l!=='vi')){
  const p=data.KINGDOM_VOCAL_SEGMENTS[track+'|'+lang],r=await resolve(track,lang);
  assert.equal(r.info.src,'pksjj');
  if(!p){assert.equal(r.info.marks,null);assert.equal(r.calls.length,0)}
  else {assert.ok(p.manualChildrenOverride);assert.equal(p.mediaKey,'pub-pksjj_'+track+'_VIDEO');assert.deepEqual(Array.from(p.lines,l=>[l.s,l.e,l.enabled]),Array.from(vi.lines,l=>[l.s,l.e,l.enabled]));assert.equal(r.calls.length,1);assert.ok(r.calls[0].includes('/'+codes[lang]+'/pub-pksjj_'+track+'_VIDEO'));assert.ok(r.info.marks);for(const mode of ['offline','changed'])assert.equal((await resolve(track,lang,mode)).info.marks,null);}
  checks++;
 }}
 console.log(checks+' shared children track/locale source, interval, disabled-line and fail-closed checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
