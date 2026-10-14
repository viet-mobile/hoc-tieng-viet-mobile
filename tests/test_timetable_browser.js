const {spawn}=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const PLATFORM=require('./helpers/platform'),{CDPClient}=require('./test_browser_runtime');
const GUIDE=JSON.parse(require('fs').readFileSync(path.resolve(__dirname,'..','regional_admin','teaching_guide.json'),'utf8')).jeonju;const ROOT=path.resolve(__dirname,'..'),PORT=8996,sleep=ms=>new Promise(r=>setTimeout(r,ms));
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
   const result=await E(`(()=>{const out=[];for(const card of document.querySelectorAll('[data-syl]')){const plan=card.querySelector('.curr-plan');if(!plan||!plan.querySelector('[data-plan-kind]'))continue;out.push({week:Number(card.dataset.syl.replace(/^(wk|s)/,'')),summary:plan.querySelector('summary').textContent,rows:[...plan.querySelectorAll('[data-plan-kind]')].map(row=>({kind:row.dataset.planKind,part:Number(row.dataset.planPart),time:row.querySelector('.curr-plan-t').textContent,text:row.querySelector('.curr-plan-n').textContent})),text:plan.textContent});}return out;})()`);
   if(result.length!==15)console.log(await E("({errors:"+JSON.stringify(errors)+",plans:document.querySelectorAll('.curr-plan').length,cards:document.querySelectorAll('[data-syl]').length,guide:typeof JEONJU_TEACHING_GUIDE})"));
   assert.equal(result.length,15,`${lang}: 15 timetable classes`);
   for(const card of result){
    const general=card.rows.filter(r=>r.kind==='course-vocab'),wt=card.rows.filter(r=>r.kind==='watchtower-vocab');
    const plan=GUIDE.units.find(u=>u.unit===card.week).timePlan;let at=0;const exp={'course-vocab':[],'watchtower-vocab':[]};
    for(const p of plan){const f=n=>Number.isInteger(n)?String(n):String(n);if(p[5]&&p[5].kind)exp[p[5].kind].push(f(at)+'–'+f(at+p[1]));at+=p[1];}
    assert.deepEqual(general.map(r=>r.time),exp['course-vocab']);
    assert.deepEqual(wt.map(r=>r.time),exp['watchtower-vocab']);
    assert.deepEqual(general.map(r=>r.part),[0,1,2,3,4]);
    if(card.week<=4){
     const has34=general.every(r=>lang==='ko'?/\(34개\)/.test(r.text):/\(34 từ\)/.test(r.text));
     if(!has34)console.log({lang,week:card.week,general:general.map(r=>r.text)});
     assert(has34);
    }
    if(lang==='vi')assert(!/[가-힣]/.test(card.text),`Vietnamese timetable week ${card.week}`);
    assert(/(A 강사|GV A)/.test(card.summary)&&/(보조자|Trợ giảng)/.test(card.summary),'four-owner totals');checked++;
   }
   if(lang==='vi'){
    const blanks=await E("[...document.querySelectorAll('.curr-assign-text')].filter(e=>!e.textContent.trim()).length");
    assert.equal(blanks,0,'Vietnamese weekly assignments have no blank labels');
   }
  }
  // Long Vietnamese category/range labels must still fit a phone screen.
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
  await E("(()=>{const plan=document.querySelector('.curr-plan');const card=plan.closest('.group-card');if(card?.dataset.open==='false')card.querySelector('.group-head').click();plan.open=true;})()");await sleep(200);
  assert(await E('document.documentElement.scrollWidth<=window.innerWidth+1'));
  assert.deepEqual(errors,[]);console.log(`${checked} rendered timetable checks passed: all five ranges, durations, owner totals, Vietnamese, phone layout; runtime exceptions 0.`);
 }finally{cdp?.close();chrome.kill();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
