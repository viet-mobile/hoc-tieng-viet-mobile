// [복습] [플래시카드] 총 반복 횟수 1 / 2 / 3: a card is played exactly N times (the answer is said N times), then the next card, never the same card again.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8998;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PROFILES = [
  {name: 'windows-chrome', apple: false, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'},
  {name: 'iphone-safari', apple: true, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'},
];
const engine = apple => `(() => {
  const APPLE = ${apple}, STALE_MS = APPLE ? 700 : 0, LATE_END_MS = APPLE ? 400 : 0, DROP_MS = APPLE ? 150 : 0;
  const cfg = window.__fakeCfg = {noEndNth: 0, dropSpeakNth: [], lateEndAfterCancelMs: 0, voices: [], charMs: 8};
  const log = window.__tts = []; const vc = [];
  let cur = null, queue = [], lastCancel = -1e9, staleUntil = 0, timers = [], started = 0, spoken = 0, stuck = false;
  const synth = {
    get speaking() { return !!cur || stuck || Date.now() < staleUntil; }, get pending() { return queue.length > 0; }, paused: false,
    getVoices() { return cfg.voices.slice(); }, addEventListener(t, f) { if (t === 'voiceschanged') vc.push(f); }, removeEventListener() {}, pause() {}, resume() {},
    set onvoiceschanged(f) { vc.push(f); }, get onvoiceschanged() { return null; },
    cancel() { lastCancel = Date.now(); log.push({ev: 'cancel', t: Date.now(), playing: cur && cur.text}); queue = []; timers.forEach(clearTimeout); timers = []; stuck = false;
      if (cur) { const u = cur; cur = null; staleUntil = Date.now() + (APPLE ? 300 : 0);
        setTimeout(() => u.onerror && u.onerror({error: 'interrupted'}), 5);
        if (cfg.lateEndAfterCancelMs) setTimeout(() => { log.push({ev: 'late-end', text: u.text, t: Date.now()}); u.onend && u.onend(); }, cfg.lateEndAfterCancelMs); } },
    speak(u) {
      spoken++;
      log.push({ev: 'speak', n: spoken, text: u.text, lang: u.lang, voice: u.voice ? u.voice.name : null, t: Date.now()});
      if (cfg.dropSpeakNth.indexOf(spoken) >= 0) { log.push({ev: 'ignored', text: u.text, t: Date.now()}); return; }
      if (Date.now() - lastCancel < DROP_MS) { log.push({ev: 'dropped', text: u.text, t: Date.now()}); return; }
      queue.push(u); if (!cur && !stuck) next();
    }
  };
  function next() {
    const u = queue.shift(); if (!u) return; cur = u;
    timers.push(setTimeout(() => {
      started++; log.push({ev: 'start', text: u.text, lang: u.lang, voice: u.voice ? u.voice.name : null, t: Date.now()}); u.onstart && u.onstart();
      if (cfg.noEndNth && started === cfg.noEndNth) { stuck = true; log.push({ev: 'stuck', text: u.text, t: Date.now()}); return; }
      timers.push(setTimeout(() => {
        log.push({ev: 'end', text: u.text, t: Date.now()}); cur = null; staleUntil = Date.now() + STALE_MS;
        timers.push(setTimeout(() => u.onend && u.onend(), LATE_END_MS)); next();
      }, Math.max(250, String(u.text).length * cfg.charMs)));
    }, 40));
  }
  window.__fireVoicesChanged = () => vc.slice().forEach(f => f());
  Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.rate = 1; this.voice = null; };
})();`;


const failures = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) failures.push(m); };
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'flash-total-one-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable'); await cdp.send('Network.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 1000, deviceScaleFactor: 1, mobile: false});
    const errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text));
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); if (r.exceptionDetails) errs.push('eval ' + ((r.exceptionDetails.exception || {}).description || '').slice(0, 200)); return r.result.value; };
    let script = null;
    const load = async (prof, auto) => {
      if (script) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: script});
      const init = `try{localStorage.clear();localStorage.setItem('vn-app-vi-repeat','2');localStorage.setItem('vn-app-auto-adv',${JSON.stringify(JSON.stringify(auto))});}catch(e){}`;
      script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `if(!sessionStorage.getItem('__ft')){sessionStorage.setItem('__ft','1');${init}}` + engine(prof.apple)})).identifier;
      await cdp.send('Network.setUserAgentOverride', {userAgent: prof.ua});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await E("sessionStorage.removeItem('__ft')"); await sleep(900);
      await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
      await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1}); await sleep(100);
    };
    // the flashcard of the vocabulary (short cards), a fresh card whose log starts with its own first utterance
    const OPEN = `(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang('ko');await sleep(200);
      document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(500);document.querySelector('.subtab-btn[data-review="vocab"]').click();await sleep(500);
      const fb=document.querySelector('.study-mode-btn[data-mode="flash"]');if(fb.getAttribute('aria-selected')!=='true')fb.click();await sleep(400);
      const sel=document.getElementById('auto-advance-seconds'); return !!document.getElementById('flash-card');})()`;
    const cardNo = `(()=>{const p=document.querySelector('.study-progress');return p?parseInt(p.textContent,10):0;})()`;
    const front = `(()=>{const e=document.querySelector('#flash-card .study-flash-vi');return e?e.textContent:null;})()`;
    const TAB = sub => `document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(500);document.querySelector('.subtab-btn[data-review="vocab"]').click();await sleep(400);${sub === 'rhyme' ? `document.querySelector('[data-review-scope="rhyme"]').click();await sleep(600);` : ''}
      const fb=document.querySelector('.study-mode-btn[data-mode="flash"]');if(fb&&fb.getAttribute('aria-selected')!=='true')fb.click();await sleep(400);`;
    for (const prof of PROFILES) {
      for (const sub of (process.env.FT_SUB ? process.env.FT_SUB.split(',') : ['vocab', 'rhyme'])) {
        for (const N of (process.env.FT_N ? process.env.FT_N.split(',').map(Number) : [1, 2, 3])) {
          await load(prof, {enabled: true, nextOnCorrect: false, seconds: 0.3, cardRepeats: N});
          // record, per card shown, every utterance said while it was on screen
          const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang('ko');await sleep(200);${TAB(sub)}
            document.getElementById('flash-next').click(); await sleep(60); window.__tts.length = 0;
            const cards=[]; let cur=null; const t0=Date.now();
            while(Date.now()-t0<${N * 14000 + 14000 + (process.env.FT_CARDS ? 6000 * process.env.FT_CARDS : 0)} && cards.length<${process.env.FT_CARDS||5}){
              const p=document.querySelector('.study-progress'), no=p?parseInt(p.textContent,10):0, nTts=window.__tts.filter(x=>x.ev==='speak').length;
              if(no && (!cur || cur.no!==no)){ cur={no, from:nTts, ex:!!document.querySelector('#flash-card .study-flash-example')}; cards.push(cur); }
              await sleep(30);
              if(cur){ cur.to=window.__tts.filter(x=>x.ev==='speak').length; }
            }
            const sp=window.__tts.filter(x=>x.ev==='speak');
            return cards.map(c=>({no:c.no, ex:c.ex, texts:sp.slice(c.from,c.to).map(x=>x.lang+':'+x.text.slice(0,16))}));})()`);
          if (process.env.FT_DEBUG) console.log(prof.name, sub, N, JSON.stringify(r));
          const done = r.slice(1, -1);   // the first card started before the log, the last is not finished
          const nko = c => c.texts.filter(t => t.startsWith('ko')).length;
          ok(done.length >= 2, `${prof.name} ${sub} total ${N}: cards advanced ${r.map(c => c.no)}`);
          ok(r.every((c, i) => i === 0 || c.no === r[i - 1].no + 1), `${prof.name} ${sub} total ${N}: the cards come one after the other ${r.map(c => c.no)}`);
          const k1 = sub === 'vocab' ? 1 : null;
          if (k1) ok(done.every(c => nko(c) === N * (c.ex ? 2 : 1)), `${prof.name} ${sub} total ${N}: exactly ${N} plays (meaning said ${done.map(nko)}, example cards ${done.map(c => c.ex ? 1 : 0)})`);
          else ok(done.every(c => nko(c) > 0 && nko(c) % N === 0 && (N === 1 || nko(c) / N <= 2)), `${prof.name} ${sub} total ${N}: whole plays only ${done.map(nko)}`);
          if (sub === 'rhyme' && N === 1) ok(done.every(c => nko(c) <= 2), `${prof.name} rhyme total 1: gloss + example meaning once each ${done.map(nko)}`);
        }
      }
      ok(!errs.length, `${prof.name}: errors ${errs.join(' | ').slice(0, 300)}`); errs.length = 0;
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- FLASHCARD TOTAL REPEAT (1 MEANS 1 CYCLE) TEST FAILED ---'); process.exit(1); }
  console.log('--- FLASHCARD TOTAL REPEAT (1 MEANS 1 CYCLE) TEST PASSED ---');
})();
