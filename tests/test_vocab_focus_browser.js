const {spawn}=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const PLATFORM=require('./helpers/platform'),{CDPClient}=require('./test_browser_runtime');
const ROOT=path.resolve(__dirname,'..'),PORT=8996,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const fixtureArg=process.argv.find(a=>a.startsWith('--live-fixture='));
const fixture=fixtureArg?JSON.parse(require('fs').readFileSync(fixtureArg.slice('--live-fixture='.length),'utf8')):null;
(async()=>{
 const server=spawn(PLATFORM.PYTHON,['-m','http.server',String(PORT),'--directory',path.join(ROOT,'dist')],{stdio:'ignore'});
 const chrome=spawn(PLATFORM.CHROME,['--headless=new','--remote-debugging-port='+(PORT+1000),'--no-first-run','--host-resolver-rules=MAP course-timetable.test 127.0.0.1','--no-proxy-server','--user-data-dir='+path.join(PLATFORM.TMP,'timetable-'+process.pid)],{stdio:'ignore'});
 let cdp;
 try{
  let tabs;for(let i=0;i<80&&!tabs;i++){try{tabs=await(await fetch(`http://127.0.0.1:${PORT+1000}/json/list`)).json();}catch{await sleep(250);}}
  cdp=new CDPClient(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await cdp.connect();await cdp.send('Runtime.enable');await cdp.send('Page.enable');
  const errors=[];cdp.on('Runtime.exceptionThrown',e=>errors.push(e.exceptionDetails.exception?.description||e.exceptionDetails.text));
  await cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:`const timetableFixture=${JSON.stringify(fixture)};const timetableFetch=window.fetch.bind(window);window.fetch=(u,o)=>String(u).includes('/api/regional/curriculum')&&timetableFixture?Promise.resolve({ok:true,status:200,json:async()=>timetableFixture}):String(u).includes('/api/regional/')?Promise.resolve({ok:false,status:404,json:async()=>({})}):timetableFetch(u,o);`});
  await cdp.send('Page.navigate',{url:`http://${fixture?'course-timetable.test':'127.0.0.1'}:${PORT}/jeonju/index.html`});
  const E=async expression=>{const r=await cdp.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  for(let i=0;i<240;i++){if(await E("document.readyState==='complete'&&typeof window.setLang==='function'"))break;await sleep(250);}
  await E("window.setLang('ko');document.querySelector('[data-tab=\"curriculum\"]').click()");await sleep(600);
  const ranges=await E("[...document.querySelectorAll('.curr-link-btn[data-goto-subval=\"rhyme\"]')].filter(b=>Number(b.dataset.gotoVrEnd)-Number(b.dataset.gotoVrStart)===34).map(b=>({start:b.dataset.gotoVrStart,end:b.dataset.gotoVrEnd}))");
  const unique=[...new Map(ranges.map(r=>[r.start,r])).values()];assert(unique.length>=5);
  for(const r of unique){
   await E(`document.querySelector('[data-tab="curriculum"]').click();[...document.querySelectorAll('.curr-link-btn[data-goto-subval="rhyme"]')].find(b=>b.dataset.gotoVrStart==='${r.start}'&&b.dataset.gotoVrEnd==='${r.end}').click()`);await sleep(100);
   assert.equal(await E('window.__vocabScopedPool().length'),34);
   await E("document.querySelector('.vocab-focus-scoped-review').click()");await sleep(100);
   const text=await E("document.querySelector('#study-body .study-progress').textContent");assert(/\/ 34$/.test(text),JSON.stringify({r,text}));
   // the scoped review game keeps the studied order (never shuffled)
   const expected=await E("window.__vocabScopedPool().map(x=>x.vi)");const seen=[];
   for(let i=0;i<8;i++){seen.push(await E("document.querySelector('#study-body .study-flash-vi').textContent.trim()"));await E("document.querySelector('#flash-next').click()");await sleep(30);}
   assert.deepEqual(seen,expected.slice(0,8),'flash cards in studied order');
  }
  await E("window.setLang('vi');document.querySelector('[data-tab=\"vocab\"]').click();document.querySelector('[data-vocab=\"rhyme\"]').click()");await sleep(100);
  const titles=await E("[...document.querySelectorAll('#vocab-root .group-head .syl')].map(e=>e.textContent)");assert.equal(titles.length,7);assert(titles.every(t=>t.trim()&&!/[가-힣]/.test(t)));
  await E("document.querySelector('[data-vocab=\"wt\"]').click()");await sleep(100);
  const dates=await E("[...document.querySelectorAll('#vocab-root .wt-date')].map(e=>e.textContent)");assert.equal(dates.length,24);assert(dates.every(t=>t.includes('tháng')));
  for(const week of [21,22,23,24])assert.equal(await E(`[...document.querySelectorAll('#vocab-root [data-syl="wt${week}"] [data-wt-word]')].length`),50);
  assert.deepEqual(errors,[]);console.log(`${unique.length} actual homework shortcuts → scoped review games: all 34 records; runtime errors 0.`);
 }finally{cdp?.close();chrome.kill();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
