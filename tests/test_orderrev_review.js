// [복습][어휘][어순반대]: each word is three steps -- syllable + its gloss, syllable + its gloss, compound + meaning -- shown on the card and
// read in that order; the hanja in parentheses is shown but never read.
const {spawn}=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const PLATFORM=require('./helpers/platform'),{CDPClient}=require('./test_browser_runtime');
const ROOT=path.resolve(__dirname,'..'),PORT=8981,sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const server=spawn(PLATFORM.PYTHON,['-m','http.server',String(PORT),'--directory',path.join(ROOT,'dist')],{stdio:'ignore'});
 const chrome=spawn(PLATFORM.CHROME,['--headless=new','--remote-debugging-port='+(PORT+1000),'--no-first-run','--user-data-dir='+path.join(PLATFORM.TMP,'orv-'+process.pid)],{stdio:'ignore'});
 let cdp;
 try{
  let tabs;for(let i=0;i<80&&!tabs;i++){try{tabs=await(await fetch(`http://127.0.0.1:${PORT+1000}/json/list`)).json();}catch{await sleep(250);}}
  cdp=new CDPClient(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await cdp.connect();await cdp.send('Runtime.enable');await cdp.send('Page.enable');
  const errors=[];cdp.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.exception?.description||e.exceptionDetails.text));
  await cdp.send('Page.navigate',{url:`http://127.0.0.1:${PORT}/jeonju/index.html`});
  const E=async x=>{const r=await cdp.send('Runtime.evaluate',{expression:x,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  for(let i=0;i<240;i++){if(await E("document.readyState==='complete'&&typeof window.setLang==='function'"))break;await sleep(250);}
  await E("window.setLang('ko');document.querySelector('[data-tab=\"review\"]').click()");await sleep(500);
  await E("document.querySelector('.subtab-btn[data-review=\"vocab\"]').click()");await sleep(300);
  await E(`document.querySelector('[data-review-scope="orderrev"]').click()`);await sleep(500);
  assert(/\/ \d+$/.test(await E("document.querySelector('#study-body .study-progress').textContent")));
  await E(`window.__said=[];window.speechSynthesis.cancel=function(){};window.speechSynthesis.speak=function(u){window.__said.push(u.lang+':'+u.text);setTimeout(function(){u.onstart&&u.onstart({});u.onend&&u.onend({});},5);};`);
  for(const t of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type:t,x:5,y:5,button:'left',clickCount:1});   // a real tap arms speech
  await E("document.getElementById('flash-card').click()");await sleep(2500);
  const card=await E("({front:document.querySelector('.study-flash-vi').textContent.trim(),steps:[...document.querySelectorAll('.study-flash-step')].map(s=>[s.querySelector('.study-flash-step-vi').textContent,s.querySelector('.study-flash-step-kr').textContent])})");
  assert.equal(card.steps.length,3);
  assert.equal(card.steps[2][0],card.front,'the compound is the third step');
  assert(/\([一-鿿]\)$/.test(card.steps[0][1])&&/\([一-鿿]\)$/.test(card.steps[1][1]),'hanja shown in parentheses');
  const said=await E('window.__said');
  assert.equal(said.length,6,JSON.stringify(said));
  assert.deepEqual(said.map(s=>s.split(':')[0]),['vi-VN','ko-KR','vi-VN','ko-KR','vi-VN','ko-KR']);
  assert.deepEqual(said.filter((s,i)=>i%2===0).map(s=>s.slice(6)),card.steps.map(s=>s[0]));
  assert(said.every(s=>!/[一-鿿]/.test(s)&&!/[()]/.test(s)),'hanja is never read');
  assert.deepEqual(errors,[]);console.log('어순반대 review card: three steps shown and read in order, hanja not read; runtime errors 0.');
 }finally{cdp?.close();chrome.kill();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
