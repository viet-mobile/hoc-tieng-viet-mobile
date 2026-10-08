// User-authorized shared intervals select each locale's children recording even when general choir exists.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('app_logic.js','utf8');
const section=source.slice(source.indexOf('  var SONG_SEG_API ='),source.indexOf('  var songSeg ='));
const data=vm.createContext({});vm.runInContext(fs.readFileSync('song_vocal_segments.js','utf8'),data);
const manuals=JSON.parse(fs.readFileSync('scripts/data/vi_vocal_manual_segments.json'));
const manual=manuals['46'];
const codes={vi:'VT',ko:'KO',ja:'J',en:'E',cs:'B',zh:'CH',zh_cn:'CHS',de:'X',fr:'F',hu:'H',id:'IN',pl:'P'};
let checks=0;
async function run(lang,mode='ok',track=46) {
 const proof=data.KINGDOM_VOCAL_SEGMENTS[track+'|'+lang],calls=[];
 const ctx=vm.createContext({KINGDOM_VOCAL_SEGMENTS:data.KINGDOM_VOCAL_SEGMENTS,songJwLocale:l=>[codes[l]],fetch:async url=>{
  calls.push(url);if(mode==='offline')throw Error('offline');
  return {ok:mode!=='missing',status:mode==='missing'?404:200,json:async()=>({language:{languageCode:mode==='wrong-language'?'VT_WRONG':codes[lang]},media:[{naturalKey:'pub-pksjj_'+track+'_'+codes[lang]+'_VIDEO',languageAgnosticNaturalKey:'pub-pksjj_'+track+'_VIDEO',files:[{label:'360p',mimetype:'video/mp4',duration:mode==='short'?1:proof.duration,checksum:mode==='changed'?'changed':proof.checksum,progressiveDownloadURL:'https://cfp2.jw-cdn.org/song.mp4'}]}]})};
 }});vm.runInContext(section,ctx);return {info:await ctx.songSegResolve('kingdom',track,lang),calls,proof};
}
(async()=>{
 for(const track of Object.keys(manuals).filter(k=>manuals[k].applyLearnerChildren!==false).map(Number)) for(const lang of Object.keys(codes)) {
  const r=await run(lang,'ok',track);assert.equal(r.info.src,'pksjj');assert.equal(r.info.marks.length,manuals[track].lines.length);
  assert.deepEqual(Array.from(r.info.marks,l=>[l.s,l.e]),manuals[track].lines.map(l=>[l.s,l.e]));
  assert.equal(r.calls.length,1);assert.ok(r.calls[0].includes('/'+codes[lang]+'/pub-pksjj_'+track+'_VIDEO'));
  assert.ok(r.proof.lines.every(l=>l.text&&l.enabled));checks++;
 }
 for(const track of Object.keys(manuals).filter(k=>manuals[k].applyLearnerChildren!==false).map(Number)) for(const mode of ['offline','missing','changed','wrong-language','short']) {const r=await run('ko',mode,track);assert.equal(r.info.marks,null);assert.equal(r.calls.length,1);checks++;}
 assert.equal(manual.lines[3].e,57000);assert.equal(manual.lines[4].s,64000);assert.equal(manual.lines[7].e,106000);checks++;
 console.log(checks+' shared children timing / locale identity checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
