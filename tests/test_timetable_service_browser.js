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
  let checked=0;
  for(const lang of ['ko','vi']){
   await E(`window.setLang('${lang}');document.querySelector('[data-tab="curriculum"]').click()`);await sleep(500);
   const rows=await E(`(()=>{const out=[];for(const card of document.querySelectorAll('[data-syl]')){const plan=card.querySelector('.curr-plan');if(!plan)continue;const week=Number(card.dataset.syl.replace(/^(wk|s)/,''));if(!week)continue;for(const kind of ['open','close']){const planRows=[...plan.querySelectorAll('.curr-plan-row')];const row=kind==='open'?planRows[0]:planRows[planRows.length-1];const button=row?.querySelector('.curr-link-btn');const expected='song-'+REGIONAL_SCHEDULE.songs[String(week)][kind==='open'?0:1].match(/[0-9]+/)[0];const prayer=REGIONAL_SCHEDULE.prayers[String(week)][kind==='open'?0:1];out.push({week,kind,text:row?.textContent,anchor:button?.dataset.gotoAnchor,expected,person:'${lang}'==='ko'?prayer[0]:((CLASS_ROSTER.flatMap(g=>g.members).find(m=>m[0]===prayer[0])||[])[2]||prayer[0])});}}return out;})()`);
   assert.equal(rows.length,32);
   for(const row of rows){assert.equal(row.anchor,row.expected);assert(row.text.includes(row.person));checked++;}
   for(const row of rows){
    await E(`document.querySelector('[data-tab="curriculum"]').click();document.querySelector('[data-syl="${fixture?'s':'wk'}${row.week}"] .curr-plan [data-goto-anchor="${row.anchor}"]').click()`);await sleep(60);
    assert(await E(`!!document.querySelector('[data-anchor="${row.anchor}"]')`),`${lang} ${row.week} ${row.kind} song target`);
   }
  }
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
  await E("document.querySelector('[data-tab=\"curriculum\"]').click();const p=document.querySelector('.curr-plan');p.closest('.group-card').dataset.open='true';p.open=true");await sleep(100);
  assert(await E('document.documentElement.scrollWidth<=window.innerWidth+1'));
  assert.deepEqual(errors,[]);console.log(`${checked} timetable service rows verified in Korean/Vietnamese, all song shortcuts, phone layout; runtime errors 0.`);
 }finally{cdp?.close();chrome.kill();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
