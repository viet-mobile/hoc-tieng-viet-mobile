// Real cached JW metadata and actual rendered controls; no external media requests.
const {spawn}=require('node:child_process'),path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const PLATFORM=require('./helpers/platform'),{CDPClient}=require('./test_browser_runtime');
const {audit,ROOT,read}=require('../scripts/original_segments_audit');
const PORT=8993,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const tracks=[9,13,14,15,16,17,18,19,23,24,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,112,117];
const audio=Object.fromEntries(Object.entries(read('jw_extraction/other_media_cache.json')).filter(([k])=>k.startsWith('osg:')&&tracks.includes(+k.split(':')[1])));
const video=Object.fromEntries(Object.entries(read('jw_extraction/video_cues_cache.json')).filter(([k])=>/^pub-osg_/.test(k)&&tracks.includes(+k.split('_')[1])));
const mock=`(()=>{const audio=${JSON.stringify(audio)},video=${JSON.stringify(video)};const original=window.fetch.bind(window);
window.fetch=(u,o)=>{u=String(u);let m;
 if(u.includes('/apis/pub-media/')){const p=new URL(u).searchParams,key=p.get('pub')+':'+p.get('track')+':'+p.get('langwritten');return Promise.resolve({ok:true,status:200,json:async()=>audio[key]||{files:{}}});}
 if((m=/media-items\\/(\\w+)\\/(pub-osg_\\d+_VIDEO)/.exec(u))){const v=video[m[2]+'|'+m[1]],code=m[1],key=m[2];return Promise.resolve({ok:true,status:200,json:async()=>({language:{languageCode:code},media:v&&v.media?[{languageAgnosticNaturalKey:key,naturalKey:key+'_'+code+'_r360P',files:[{label:'360p',mimetype:'video/mp4',checksum:v.checksum,duration:v.duration,progressiveDownloadURL:v.url,subtitles:v.vtt?{url:'https://cfp2.jw-cdn.org/audit-vtt/'+key+'/'+code}:null}]}]:[]})});}
 if((m=/audit-vtt\\/(pub-osg_\\d+_VIDEO)\\/(\\w+)/.exec(u)))return Promise.resolve({ok:true,status:200,text:async()=>video[m[1]+'|'+m[2]].vtt});
 return original(u,o);};})();`;
(async()=>{
 const server=spawn(PLATFORM.PYTHON,['-m','http.server',String(PORT),'--directory',path.join(ROOT,'dist')],{stdio:'ignore'});
 const chrome=spawn(PLATFORM.CHROME,['--headless=new','--remote-debugging-port='+ (PORT+1000),'--no-first-run','--user-data-dir='+path.join(PLATFORM.TMP,'original-segments-'+process.pid)],{stdio:'ignore'});
 let client;
 try{
  let tabs;for(let i=0;i<80&&!tabs;i++){try{tabs=await(await fetch(`http://127.0.0.1:${PORT+1000}/json/list`)).json();}catch{await sleep(250);}}
  client=new CDPClient(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await client.connect();await client.send('Runtime.enable');await client.send('Page.enable');
  const errors=[];client.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.text));
  await client.send('Page.addScriptToEvaluateOnNewDocument',{source:mock});
  await client.send('Page.navigate',{url:`http://127.0.0.1:${PORT}/jw/index.html`});
  const evalJS=async expression=>{const r=await client.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  for(let i=0;i<240;i++){if(await evalJS("document.readyState==='complete'&&typeof window.setLang==='function'"))break;await sleep(250);}
  const expected=audit();let checks=0;
  for(const lang of ['ko','en','ja','zh','zh_cn','de','fr','pl','cs','hu','id']){
   await evalJS(`window.setLang(${JSON.stringify(lang)});document.querySelector('[data-tab="sentence"]').click();document.querySelector('[data-sentence="song"]').click();document.querySelector('[data-songkind="original"]').click();`);
   await sleep(150);
   await evalJS(`(()=>{for(const track of ${JSON.stringify(tracks)}){const head=document.querySelector('.song-acc[data-song-id="osg-'+track+'"] .song-acc-head');if(head&&head.getAttribute('aria-expanded')==='false')head.click();}})()`);
   await sleep(1800);
   const actual=await evalJS(`(()=>{const out=[];for(const track of ${JSON.stringify(tracks)}){const card=document.querySelector('.song-acc[data-song-id="osg-'+track+'"]');for(const [lang,sel]of [['vi','.lyric-vi-row'],[${JSON.stringify(lang)},'.lyric-target-row']])out.push({song:'osg-'+track,lang,buttons:card.querySelectorAll(sel+' .song-seg-btn[data-seg="play"]').length});}return out;})()`);
   for(const row of actual){const want=expected.find(x=>x.song===row.song&&x.lang===row.lang);assert.equal(row.buttons,want?.buttons||0,`${lang} view: ${row.song} ${row.lang}`);checks++;}
   if(lang==='ko'){
    const links=await evalJS(`(()=>{const out={};for(const n of [18,112,117])out[n]=[...document.querySelectorAll('.song-acc[data-song-id="osg-'+n+'"] .song-title-link-group a')].map(a=>a.href);return out;})()`);
    for(const n of [18,112,117]){assert.ok(links[n].some(u=>u.includes('pub-osg_'+n+'_AUDIO')&&u.includes('wtlocale=KO')));checks++;}
   }
  }
  assert.deepEqual(errors,[]);console.log(`${checks} original-song rendered timing / language / AUDIO badge checks passed; console exceptions 0`);
 }finally{client?.close();chrome.kill();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
