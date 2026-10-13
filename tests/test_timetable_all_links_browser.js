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
  await E("window.setLang('ko');document.querySelector('[data-tab=\"curriculum\"]').click()");await sleep(700);
  const audit=await E(`(()=>{const rows=[...document.querySelectorAll('.curr-plan-row')];return {missing:rows.filter(r=>!r.querySelector('.curr-link-btn')).map(r=>r.textContent),buttons:[...document.querySelectorAll('.curr-plan .curr-link-btn')].map((b,index)=>({index,data:{...b.dataset},text:b.closest('.curr-plan-row').querySelector('.curr-plan-n').textContent}))};})()`);
  assert.deepEqual(audit.missing,[],'Every timetable row has a shortcut');
  const unique=[...new Map(audit.buttons.map(b=>[JSON.stringify(b.data),b])).values()];let checked=0;
  for(const b of unique){
   await E(`document.querySelector('[data-tab="curriculum"]').click();document.querySelectorAll('.curr-plan .curr-link-btn')[${b.index}].click()`);await sleep(35);
   if(b.data.planAction){
    assert(await E(`(()=>{const b=document.querySelectorAll('.curr-plan .curr-link-btn')[${b.index}];return b.dataset.planAction==='homework'?b.closest('.group-card').querySelector('.curr-assign-card')?.dataset.open==='true'||!!b.closest('.curr-plan-row').querySelector('.curr-plan-instructions'):!!b.closest('.curr-plan-row').querySelector('.curr-plan-instructions');})()`),b.text);
   }else{
    if(b.data.gotoAnchor)assert(await E(`!!document.querySelector('[data-anchor="${b.data.gotoAnchor}"]')`),`${b.text}: ${b.data.gotoAnchor}`);
    else {
     const attr=b.data.gotoSubattr==='curriculum'&&['song','prayer'].includes(b.data.gotoSubval)?'sentence':b.data.gotoSubattr;
     let val=b.data.gotoSubval;if(attr==='pron'&&['alphabet','vowels','consonants'].includes(val))val='jamo';if(attr==='pron'&&val==='tonepairs')val='tones';if(attr==='vocab'&&['basic','freq','theo','names'].includes(val))val='words';
     assert(await E(`!!document.querySelector('.subtab-btn[data-${attr}="${val}"][aria-selected="true"]')`),b.text);
    }
    if(b.data.gotoVrStart!==undefined)assert(await E(`!!document.querySelector('.vocab-focus-banner')`),b.text);
   }checked++;
  }
  await E("window.setLang('vi');document.querySelector('[data-tab=\"curriculum\"]').click()");await sleep(200);
  assert.equal(await E("[...document.querySelectorAll('.curr-plan-row')].filter(r=>!r.querySelector('.curr-link-btn')).length"),0);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
  await E("const p=document.querySelector('.curr-plan');p.closest('.group-card').dataset.open='true';p.open=true");
  assert(await E('document.documentElement.scrollWidth<=window.innerWidth+1'));
  assert.deepEqual(errors,[]);console.log(`${audit.buttons.length} timetable shortcuts, ${checked} distinct destinations verified; Vietnamese, phone layout, runtime errors 0.`);
 }finally{cdp?.close();chrome.kill();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
