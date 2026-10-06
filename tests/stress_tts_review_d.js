// Diagnostic (not part of the release gate): the D scenario of test_tts_sequence.js -- the 복습 flashcard with 반복 2 + 자동 넘김 1 s,
// card after card -- repeated N times per profile on a fresh page, with every engine event and every page timer recorded, and each
// failure classified:
//   A missing utterance   B duplicate / repeated utterance   C wrong order   D auto-advance too early
//   E only late (sequence right, after the window)   F harness (the fake engine dropped / lost something)   G product state race
//   node tests/stress_tts_review_d.js --runs 100 --profiles windows-chrome,iphone-safari [--dist /path/to/dist] [--port 8941]
//   --gap 200 rewrites VI_REPEAT_GAP_MS in the (copied) dist for the 50 ms vs 200 ms comparison
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const RUNS = +arg('runs', 20), PORT = +arg('port', 8941), DIST = arg('dist', path.resolve(__dirname, '..', 'dist'));
const PROFILES_WANTED = arg('profiles', 'windows-chrome,windows-edge,android-chrome,macos-safari,iphone-safari,ipad-safari').split(',');
const OUT = arg('out', '');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const src = fs.readFileSync(path.join(__dirname, 'test_tts_sequence.js'), 'utf8');
const engine = eval('(' + src.slice(src.indexOf('const engine = apple =>') + 'const engine = '.length, src.indexOf('const failures = [];')).replace(/;\s*$/, '') + ')');
const PROFILES = eval(src.slice(src.indexOf('const PROFILES = ') + 'const PROFILES = '.length, src.indexOf('// window.__fakeCfg is read live')).replace(/;\s*$/, ''));
// every page timer of 1..5000 ms is recorded (scheduled / fired) next to the engine events
const TIMERS = `(()=>{const st=window.setTimeout.bind(window);window.__timers=[];window.setTimeout=function(f,d,...a){const id={d:d|0,t:Date.now()};
  if(id.d>=1&&id.d<=5000){window.__timers.push({ev:'timer+',d:id.d,t:id.t});return st(function(){window.__timers.push({ev:'timer!',d:id.d,t:Date.now()});return typeof f==='function'?f.apply(this,arguments):undefined;},d,...a);}
  return st(f,d,...a);};})();`;
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', DIST], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'tts-d-stress-' + process.pid)], {stdio: 'ignore'});
  const summary = [];
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable'); await cdp.send('Network.enable');
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); return r.result.value; };
    let script = null;
    for (const prof of PROFILES.filter(p => PROFILES_WANTED.includes(p.name))) {
      const res = {profile: prof.name, runs: 0, pass: 0, fail: 0, signatures: {}, examples: {}};
      for (let run = 0; run < RUNS; run++) {
        if (script) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: script});
        const init = `try{localStorage.clear();localStorage.setItem('vn-app-vi-repeat','2');localStorage.setItem('vn-app-auto-adv',${JSON.stringify(JSON.stringify({enabled: true, nextOnCorrect: false, seconds: 1}))});}catch(e){}`;
        script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `if(!sessionStorage.getItem('__d')){sessionStorage.setItem('__d','1');${init}}` + TIMERS + engine(prof.apple)})).identifier;
        await cdp.send('Network.setUserAgentOverride', {userAgent: prof.ua});
        await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
        for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
        await E("sessionStorage.removeItem('__d')"); await sleep(900);
        await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
        await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1}); await sleep(100);
        const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
          const cardNo=()=>{const p=document.querySelector('.study-progress');return p?parseInt(p.textContent,10):0;};
          window.__tts.length=0; window.__timers.length=0; const t0=Date.now();
          window.setLang('ko');await sleep(200);document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(600);
          const fb=document.querySelector('.study-mode-btn[data-mode="flash"]'); if(fb && fb.getAttribute('aria-selected')!=='true') fb.click(); await sleep(400);
          const card0=cardNo(); let w=0; const koRuns=()=>{let n=0,prev='';for(const x of window.__tts.filter(x=>x.ev==='start')){if(x.lang==='ko-KR'&&prev!=='ko-KR')n++;prev=x.lang;}return n;};   // Korean RUNS (a long meaning is several utterances)
          while(koRuns()<2&&w<25000){await sleep(100);w+=100;} await sleep(300);
          const cards=[]; return {t0, log:window.__tts.slice(), timers:window.__timers.slice(), card0, card1:cardNo()};})()`);
        res.runs++;
        const log = r.log || [], t0 = r.t0;
        const starts = log.filter(x => x.ev === 'start'), dK = starts.findIndex(x => x.lang === 'ko-KR');
        const sd = starts.slice(Math.max(0, dK - 2)).map(x => x.lang).join(',');
        const lastEnd = dK >= 0 ? log.filter(x => x.ev === 'end' && x.t < starts[dK].t).pop() : null;
        const gapKo = lastEnd ? starts[dK].t - lastEnd.t : -1;
        const rawPass = dK >= 2 && /^vi-VN,vi-VN,ko-KR,vi-VN,vi-VN,ko-KR/.test(sd) && gapKo >= 900 && gapKo <= 2600 && r.card1 >= r.card0 + 1 && !log.some(x => x.ev === 'dropped');
        // the assertion of test_tts_sequence.js D (chunk-aware: a text over 160 characters is several utterances per run)
        const runs = []; starts.forEach(x => { const q = runs[runs.length - 1]; if (q && q.lang === x.lang) q.items.push(x.text); else runs.push({lang: x.lang, items: [x.text]}); });
        const viRunOk = q => q.lang === 'vi-VN' && q.items.length % 2 === 0 && q.items.slice(0, q.items.length / 2).join('|') === q.items.slice(q.items.length / 2).join('|');
        const koRunOk = q => q.lang === 'ko-KR' && q.items.every((x, i) => i === 0 || x !== q.items[i - 1]);
        const pass = dK >= 2 && runs.length >= 4 && viRunOk(runs[0]) && koRunOk(runs[1]) && viRunOk(runs[2]) && koRunOk(runs[3]) && gapKo >= 900 && gapKo <= 2600 && r.card1 >= r.card0 + 1 && !log.some(x => x.ev === 'dropped');
        if (!rawPass) res.rawFail = (res.rawFail || 0) + 1;   // what the old fixed-count assertion would have said
        const longText = starts.some(x => String(x.text).length > 100);
        if (!rawPass && pass) res.chunkedOnly = (res.chunkedOnly || 0) + 1;
        if (pass) { res.pass++; continue; }
        res.fail++;
        // classification
        const speaks = log.filter(x => x.ev === 'speak'), kinds = speaks.map(x => x.lang === 'ko-KR' ? 'K' : 'V');
        let sig;
        if (log.some(x => x.ev === 'dropped' || x.ev === 'ignored' || x.ev === 'stuck' || x.ev === 'late-end')) sig = 'F harness: fake engine ' + [...new Set(log.filter(x => ['dropped', 'ignored', 'stuck', 'late-end'].includes(x.ev)).map(x => x.ev))].join('+');
        else if (/K,?K/.test(kinds.join(',')) || speaks.some((x, i) => i && x.text === speaks[i - 1].text && x.lang === 'ko-KR')) sig = 'B duplicate: ' + kinds.join('') + (r.card1 === r.card0 ? ' (card did not advance)' : '');
        else if (dK < 2) sig = 'A missing: ' + kinds.join('');
        else if (!/^vi-VN,vi-VN,ko-KR/.test(sd)) sig = 'C order: ' + sd;
        else if (gapKo < 900 && gapKo >= 0) sig = 'D auto-advance early: ' + gapKo + ' ms';
        else if (gapKo > 2600) sig = 'E late: ' + gapKo + ' ms';
        else sig = 'G state race: ' + sd + ' card ' + r.card0 + '->' + r.card1;
        res.signatures[sig] = (res.signatures[sig] || 0) + 1;
        if (!res.examples[sig]) res.examples[sig] = {sd, gapKo, card0: r.card0, card1: r.card1,
          events: log.filter(x => x.ev !== 'ok').map(x => [x.ev, x.t - t0, String(x.text || '').slice(0, 14), x.lang || '', x.playing ? 'playing' : ''].join(' ')),
          timers: (r.timers || []).map(x => [x.ev, x.d, x.t - t0].join(' '))};
      }
      res.rate = (100 * res.fail / res.runs).toFixed(1) + '%';
      console.log(JSON.stringify({profile: res.profile, runs: res.runs, pass: res.pass, fail: res.fail, rate: res.rate, oldAssertionFails: res.rawFail || 0, oldFailsOnlyBecauseOfChunking: res.chunkedOnly || 0, signatures: res.signatures}));
      summary.push(res);
    }
  } finally { chrome.kill(); server.kill(); }
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(summary, null, 1));
})();
