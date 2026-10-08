// Pure resolver checks use the production functions and real-format official metadata.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app_logic.js','utf8');
const section = source.slice(source.indexOf('  var SONG_SEG_API ='),source.indexOf('  var songSeg ='));
const mark = {startTime:'00:00:10.000',duration:'00:00:03.000',mepsParagraphId:4};
const file = {pub:'sjjc',track:40,file:{url:'https://cfp2.jw-cdn.org/a/test.mp3',checksum:'abc'},markers:{hash:'abc',documentId:123,mepsLanguageWritten:'VT',mepsLanguageSpoken:'VT',markers:[mark]}};
const proof = {mediaKey:'pub-sjjc_40_AUDIO',checksum:'abc',documentId:123,signature:[[mark.startTime,mark.duration,4]],lines:[{s:10000,e:13000,m:0,pid:4,text:'Lời hát',enabled:true}]};
let checks=0;
async function resolve({f=file,p=proof,status=200,throwFetch=false,track=40,locale='vi'}={}) {
 const calls=[];
 const context=vm.createContext({console,KINGDOM_VI_VOCAL_SOURCES:{1:'pub-pksjj_1_AUDIO',40:'pub-sjjc_40_AUDIO',164:'pub-osg_126_AUDIO'},KINGDOM_VOCAL_SEGMENTS:{'40|vi':p},songJwLocale:lang=>[lang==='vi'?'VT':'KO'],fetch:async url=>{calls.push(url);if(throwFetch)throw Error('offline');return {ok:status===200,status,json:async()=>({files:{VT:{MP3:f?[f]:[]}}})};}});
 vm.runInContext(section,context);
 const info=await context.songSegResolve('kingdom',track,locale);
 return {info,calls,context};
}
(async()=>{
 let r=await resolve();assert.equal(r.info.marks[0].text,'Lời hát');checks++;
 for(const field of ['hash','documentId','mepsLanguageSpoken','mepsLanguageWritten']) {
  const f=structuredClone(file);f.markers[field]='wrong';r=await resolve({f});assert.equal(r.info.marks,null,field);checks++;
 }
 let f=structuredClone(file);f.markers.markers[0].startTime='00:00:00.000';r=await resolve({f});assert.equal(r.info.marks,null);checks++;
 r=await resolve({p:null});assert.equal(r.info.marks,null);checks++;
 r=await resolve({status:503});assert.equal(r.info.marks,null);assert.equal(r.calls.length,1);checks++;
 r=await resolve({throwFetch:true});assert.equal(r.calls.length,1);checks++;
 r=await resolve({f:null});assert.equal(r.calls.length,3); // general video absence checked before missing choir falls back to children
 checks++;
 r=await resolve({track:164,f:null});assert.ok(r.calls[0].includes('pub=osg&track=126&langwritten=VT'));assert.equal(r.calls.length,1);checks++;
 r=await resolve({track:1,f:null});assert.ok(r.calls[0].includes('pub=sjjc'));assert.ok(r.calls[2].includes('pub=pksjj'));checks++;
 r=await resolve({track:165});assert.equal(r.calls.length,0);checks++;
 assert.equal(r.context.songSegText('1. Lời hát'),'Lời hát');checks++;
 console.log(`${checks} vocal validation checks passed`);
})().catch(error=>{console.error(error);process.exitCode=1;});
