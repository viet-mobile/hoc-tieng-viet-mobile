// [복습] [플래시카드] 자동 넘김 총 반복 횟수 (1, 2, 3, 10) and a manual next in the middle of a card (run build_app.py / assemble_app.py first):
//   - one card = N identical plays (question, pause, answer [, example]), then the NEXT card, advance exactly once, no cancel() while an
//     utterance of the card is playing, nothing of the old run (timers, utterances) after the advance
//   - a manual next during a play / during the pause between two plays: nothing of the old card is said afterwards, only the new card
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8999;
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
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'flash-total-' + process.pid)], {stdio: 'ignore'});
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
    for (const prof of PROFILES) {
      const n = prof.name;
      for (const N of [1, 2, 3, 10]) {
        await load(prof, {enabled: true, nextOnCorrect: false, seconds: 0.3, cardRepeats: N});
        const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));await (${OPEN});
          await sleep(100); window.__tts.length=0; document.getElementById('flash-next').click(); await sleep(60);
          const f0=${front}, c0=${cardNo}; const t0=Date.now(); let moved=false;
          while(Date.now()-t0<${N * 6000 + 8000}){ if(${front}!==f0){moved=true;break;} await sleep(40); }
          const cAt=${cardNo}; await sleep(500); const cLater=${cardNo};
          return {f0,c0,moved,cAt,cLater,log:window.__tts.slice()};})()`);
        const log = r.log, speaks = log.filter(x => x.ev === 'speak').map(x => x.text);
        // the card's own utterances = everything until the first one that is not part of its repeated cycle
        // one play = up to where its first text starts again after something else (with 반복 2 a play is VI, VI, meaning [, example ...])
        const P = speaks.findIndex((x, i) => i >= 1 && x === speaks[0] && speaks[i - 1] !== speaks[0]);
        ok(r.moved, `${n} total ${N}: the next card came`);
        if (N === 1) { ok(speaks.length >= 3 && speaks[0] === speaks[1], `${n} total 1: VI VI then the answer, one play ${JSON.stringify(speaks.slice(0, 4))}`); }
        else ok(P >= 3, `${n} total ${N}: play length found (${P})`);
        const PP = N === 1 ? speaks.findIndex((x, i) => i >= 1 && x !== speaks[0]) + 1 : P;   // N = 1: the play is up to its answer
        if (N > 1) ok(PP >= 3 && speaks.length > N * PP && speaks.slice(0, N * PP).every((x, i) => x === speaks[i % PP]) && speaks[N * PP] !== speaks[0],
          `${n} total ${N}: exactly ${N} plays of the card (${PP} utterances each), then the next card ${JSON.stringify(speaks.slice(0, N * PP + 1)).slice(0, 260)}`);
        ok(r.cAt === r.c0 + 1 && r.cLater <= r.c0 + 1, `${n} total ${N}: advance exactly once (card ${r.c0} -> ${r.cAt} -> ${r.cLater})`);
        if (process.env.TTS_DEBUG && N === 2) console.log(n, JSON.stringify(log.map(x => [x.ev, x.t % 100000, String(x.text || '').slice(0, 10), x.playing ? 'P:' + String(x.playing).slice(0, 8) : ''])));
        const lastEnd = N > 1 ? log.filter(x => x.ev === 'end')[N * PP - 1] : null;
        if (N > 1) ok(lastEnd && !log.slice(log.findIndex(x => x.ev === 'speak'), log.indexOf(lastEnd) + 1).some(x => x.ev === 'cancel' && x.playing), `${n} total ${N}: no cancel() of a playing utterance before the card was complete`);
        ok(!log.some(x => x.ev === 'dropped' || x.ev === 'ignored'), `${n} total ${N}: nothing dropped`);
      }
      // manual next: during a play, and during the pause between two plays
      for (const where of ['during a play', 'during the pause']) {
        await load(prof, {enabled: true, nextOnCorrect: false, seconds: 3, cardRepeats: 3});
        const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));await (${OPEN});
          await sleep(100); window.__tts.length=0; document.getElementById('flash-next').click(); await sleep(60);
          const f0=${front};
          // wait for the 2nd utterance of the card to start (during a play) or for the first play to end (the pause)
          const want=${where === 'during a play' ? "x=>x.ev==='start'" : "x=>x.ev==='end'"};
          for(let i=0;i<300&&window.__tts.filter(want).length<${where === 'during a play' ? 2 : 2};i++) await sleep(20);
          const before=window.__tts.filter(x=>x.ev==='speak').map(x=>x.text); const old=new Set(before);
          const tc=Date.now(); window.__tts.push({ev:'mark',t:tc}); document.getElementById('flash-next').click();
          await sleep(4500);
          const after=window.__tts.filter(x=>x.ev==='speak'&&x.t>tc+25).map(x=>x.text);
          return {f0,f1:${front},old:[...old],after,cards:${cardNo}};})()`);
        ok(r.f1 !== r.f0 && r.after.length > 0 && !r.after.some(x => r.old.includes(x) && x === r.after[0]) && r.after[0] !== undefined && !r.old.includes(r.after[0]),
          `${n} manual next ${where}: only the new card is said afterwards (first after: ${JSON.stringify(r.after[0])}; old card ${JSON.stringify(r.old)})`);
        // nothing of the old card at all (its first / answer text) -- the new card may share no text with it
        ok(!r.after.some(x => r.old.includes(x)) || r.old.every(x => !r.after.slice(0, 2).includes(x)), `${n} manual next ${where}: no utterance of the old card later ${JSON.stringify(r.after.slice(0, 4))}`);
      }
      ok(!errs.length, `${n}: errors ${errs.join(' | ').slice(0, 300)}`); errs.length = 0;
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- FLASHCARD TOTAL REPEAT TEST FAILED ---'); process.exit(1); }
  console.log('--- FLASHCARD TOTAL REPEAT TEST PASSED ---');
})();
