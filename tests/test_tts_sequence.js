// One serial speech engine on every platform, and the Apple WebKit failure modes (run build_app.py / assemble_app.py first).
// Fake Web Speech engines with the user agents of Windows Chrome, Windows Edge, Android Chrome, macOS Safari, iPhone Safari
// and iPad Safari. The Apple engines also keep `speaking` true after an end, send onend late and drop a speak() right after
// cancel() (as tests/test_tts_behavior.js does); here the engine can in addition lose an onend for good, drop a speak()
// without a trace, report no voices at first, and send late events of cancelled utterances.
//   A. 전체 듣기: an utterance whose onend never comes (engine stuck) -> watchdog, the sequence goes on, nothing is said twice
//   B. no voices at first, then voiceschanged: later utterances get a voice of their own language (Apple), none before
//   C. no Korean voice at all: ko-KR utterance without a voice (never the Vietnamese one)
//   D. 복습 flashcard, 반복 2 + 자동 넘김 (default 1 s): VI VI -> 1 s -> KO -> next card, card after card, one move per card
//   E. mute matrix (Korean UI, 반복 2): VI+KO / only KO / only VI / none -- exact utterances, the card still moves on
//   F. stale callbacks: a late onend of a cancelled run does not touch the new one
//   G. no speak() in the same tick as a cancel() (it waits SPEECH_CANCEL_SETTLE_MS)
//   H. an utterance the engine drops without a trace is spoken once more, then skipped; the sequence is not lost
//   I. 복습 UI: no [정답 시 다음 문제] on the flashcard (still there in the other modes); 자동 넘김 offers 1초 and defaults to it
//   K. the gaps of a repeated bilingual read-all: repeat ~50 ms, Vietnamese -> target ~120 ms, row ~200 ms (measured from the real end)
//   M. [복습] [플래시카드] 반복 듣기: Vietnamese repeats chained at once (no timer, no cancel), the pause before the answer is only 자동 넘김
//   J. a manual next during the auto-advance wait cancels the timer (one move only); Apple: the page going to the background
//      ends the speech and nothing comes back by itself
// The fake engines are not Safari: the real iPhone / iPad / Mac check stays open (docs/pre_production_checklist.md).
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8793;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PROFILES = [
  {name: 'windows-chrome', apple: false, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'},
  {name: 'windows-edge', apple: false, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0'},
  {name: 'android-chrome', apple: false, ua: 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36'},
  {name: 'macos-safari', apple: true, ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'},
  {name: 'iphone-safari', apple: true, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'},
  {name: 'ipad-safari', apple: true, ua: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'},
];
// window.__fakeCfg is read live, so a scenario can change the engine's behaviour while the page runs.
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
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'tts-seq-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '').slice(0, 200)));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async (expr, gesture = true) => {
      const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: gesture});
      if (r.exceptionDetails) errs.push('evaluate ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text).slice(0, 300));
      return r.result.value;
    };
    let script = null;
    const load = async (prof, storage) => {
      if (script) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: script});
      const init = `try{localStorage.clear();${Object.entries(storage || {}).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(v)});`).join('')}}catch(e){}`;
      script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `if(!sessionStorage.getItem('__ttsinit')){sessionStorage.setItem('__ttsinit','1');${init}}` + engine(prof.apple)})).identifier;
      await cdp.send('Network.enable');
      await cdp.send('Network.setUserAgentOverride', {userAgent: prof.ua});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'", false)) break; await sleep(250); }
      await E("sessionStorage.removeItem('__ttsinit')", false);
      await sleep(900);
      // the learner's first tap: a real (trusted) mouse press in an empty corner arms the page's speech session on Apple
      await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
      await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1});
      await sleep(100);
    };
    const AUTO = (sec = 1) => JSON.stringify({enabled: true, nextOnCorrect: false, seconds: sec});
    // opens the 복습 flashcards (Korean UI) and returns once the first card is on screen
    const openFlash = `(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
      window.setLang('ko');await sleep(200);
      document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(600);
      const fb=document.querySelector('.study-mode-btn[data-mode="flash"]'); if(fb && fb.getAttribute('aria-selected')!=='true') fb.click(); await sleep(400);
      return !!document.getElementById('flash-card');})()`;
    const starts = log => (log || []).filter(x => x.ev === 'start');
    const cardNo = `(()=>{const p=document.querySelector('.study-progress');return p?parseInt(p.textContent,10):0;})()`;

    const only = (process.env.TTS_PROFILE || '').split(',').filter(Boolean);
    for (const prof of PROFILES.filter(p => !only.length || only.includes(p.name))) {
      const n = prof.name;
      errs = [];

      // ---- A. a lost onend: watchdog, the sequence goes on, nothing twice (전체 듣기) ----
      await load(prof);
      const rA = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('en');await sleep(300);
        document.querySelector('.tab-btn[data-tab="wizard"]').click();await sleep(300);
        document.querySelector('.subtab-btn[data-wizard="daily"]').click();await sleep(700);
        const reg=window.__READALL_REGISTRY;
        const btn=[...document.querySelectorAll('#panel-wizard .read-all-btn')].filter(b=>b.offsetParent).find(b=>{const e=reg[b.dataset.readall];return e&&e.length>=3&&e.length<=6&&e.every(x=>x.vi&&x.mean);});
        const entries=reg[btn.dataset.readall];
        window.__fakeCfg.noEndNth=2;   // the 2nd utterance (the first meaning) starts and never ends
        window.__tts.length=0; btn.click(); let w=0; while(btn.dataset.playing==='true'&&w<60000){await sleep(250);w+=250;}
        return {entries, log:window.__tts.slice(), playing:btn.dataset.playing, waited:w};})()`)) || {};
      const sa = starts(rA.log), want = [];
      (rA.entries || []).forEach(e => { want.push(e.vi); want.push(e.mean); });
      const norm = t => String(t).replace(/[-–]/g, ' ').replace(/\s+/g, ' ').slice(0, 5);
      let ka = 0; sa.forEach(s => { if (ka < want.length && norm(s.text) === norm(want[ka])) ka++; });
      ok(want.length && ka === want.length && rA.playing === 'false', `${n} A: 전체 듣기 went on after a lost onend: heard ${ka}/${want.length} playing=${rA.playing} waited=${rA.waited}`);
      const cnt = {}; sa.forEach(s => { cnt[s.text] = (cnt[s.text] || 0) + 1; });
      ok(!Object.values(cnt).some(v => v > 1), `${n} A: nothing said twice ${JSON.stringify(cnt)}`);

      // ---- G. never a speak() in the same tick as a cancel() ----
      const gl = rA.log || [];
      let tight = 0; gl.forEach((x, i) => { if (x.ev === 'speak') { const c = gl.slice(0, i).filter(y => y.ev === 'cancel').pop(); if (c && x.t - c.t < (prof.apple ? 250 : 20)) tight++; } });
      ok(tight === 0, `${n} G: ${tight} speak() right after a cancel()`);

      // ---- B. no voices at first, then voiceschanged ----
      await load(prof);
      const rB = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);
        document.querySelector('.subtab-btn[data-sentence="pdf"]').click();await sleep(700);
        const btns=[...document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')].filter(b=>b.offsetParent);
        window.__tts.length=0; btns[0].click(); await sleep(1500);
        const before=window.__tts.filter(x=>x.ev==='speak').slice();
        window.__fakeCfg.voices=[{name:'Linh',lang:'vi-VN',voiceURI:'linh',localService:true,default:true},{name:'Yuna',lang:'ko-KR',voiceURI:'yuna',localService:true,default:true}];
        window.__fireVoicesChanged(); await sleep(300);
        window.__tts.length=0; btns[1].click(); await sleep(1500);
        const after=window.__tts.filter(x=>x.ev==='speak').slice();
        return {before, after};})()`)) || {};
      ok((rB.before || []).length >= 1 && rB.before.every(x => x.lang === 'vi-VN' && x.voice === null), `${n} B: no voices yet -> vi-VN, no voice ${JSON.stringify(rB.before)}`);
      ok((rB.after || []).length >= 1 && rB.after.every(x => x.lang === 'vi-VN' && (prof.apple ? x.voice === 'Linh' : (x.voice === null || x.voice === 'Linh'))), `${n} B: after voiceschanged ${JSON.stringify(rB.after)}`);

      // ---- C. no Korean voice: ko-KR without a voice, never the Vietnamese one ----
      await load(prof, {'vn-app-auto-adv': AUTO(1)});
      await E(`window.__fakeCfg.voices=[{name:'Linh',lang:'vi-VN',voiceURI:'linh',localService:true,default:true}]; window.__fireVoicesChanged(); 0`, false);
      const rC = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.__tts.length=0; const ok=await (${openFlash}); let w=0; while(!window.__tts.some(x=>x.ev==='speak'&&x.lang==='ko-KR')&&w<25000){await sleep(100);w+=100;} await sleep(300);
        return window.__tts.filter(x=>x.ev==='speak').map(x=>({lang:x.lang,voice:x.voice}));})()`)) || [];
      ok(rC.some(x => x.lang === 'ko-KR') && rC.filter(x => x.lang === 'ko-KR').every(x => x.voice === null) && rC.filter(x => x.lang === 'vi-VN').every(x => x.voice === 'Linh' || x.voice === null), `${n} C: ko-KR without a voice ${JSON.stringify(rC.slice(0, 6))}`);

      // ---- D. flashcard: 반복 2 + 자동 넘김 (1 s) card after card ----
      await load(prof, {'vn-app-vi-repeat': '2', 'vn-app-auto-adv': AUTO(1)});
      const rD = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.__tts.length=0; await (${openFlash}); const card0=${cardNo}; let w=0; const koRuns=()=>{let n=0,prev='';for(const x of window.__tts.filter(x=>x.ev==='start')){if(x.lang==='ko-KR'&&prev!=='ko-KR')n++;prev=x.lang;}return n;}; while(koRuns()<2&&w<25000){await sleep(100);w+=100;} await sleep(300);   // two Korean RUNS (a long meaning is several utterances)
        return {log:window.__tts.slice(), card0, card1:${cardNo}};})()`)) || {};
      if (process.env.TTS_DEBUG) console.log(n, 'D speak/cancel:', JSON.stringify((rD.log || []).filter(x => x.ev === 'speak' || x.ev === 'cancel').map(x => [x.ev, String(x.text || '').slice(0, 24), x.lang])));
      const dl = rD.log || [], dStarts = starts(dl), dK = dStarts.findIndex(x => x.lang === 'ko-KR');
      // A card is one run of Vietnamese (the text x 반복 2) then one run of Korean. A text longer than SPEECH_CHUNK_MAX (160) is spoken a
      // sentence at a time, so a long card of the shuffled deck has several utterances per run: the runs are judged, not a fixed count.
      const dRunsOf = list => { const runs = []; list.forEach(x => { const q = runs[runs.length - 1]; if (q && q.lang === x.lang) q.items.push(x.text); else runs.push({lang: x.lang, items: [x.text]}); }); return runs; };
      const dRuns = dRunsOf(dStarts.slice(dK >= 2 ? 0 : 0));
      const viRunOk = r => r.lang === 'vi-VN' && r.items.length % 2 === 0 && r.items.slice(0, r.items.length / 2).join('|') === r.items.slice(r.items.length / 2).join('|');
      const koRunOk = r => r.lang === 'ko-KR' && r.items.every((x, i) => i === 0 || x !== r.items[i - 1]);
      const sd = dRuns.slice(0, 5).map(r => r.lang.slice(0, 2) + 'x' + r.items.length).join(',');
      ok(dK >= 2 && dRuns.length >= 4 && viRunOk(dRuns[0]) && koRunOk(dRuns[1]) && viRunOk(dRuns[2]) && koRunOk(dRuns[3]), `${n} D: card = Vietnamese x2 then Korean once, card after card: ${sd}`);
      const lastEndBeforeKo = dK >= 0 ? dl.filter(x => x.ev === 'end' && x.t < dStarts[dK].t).pop() : null;
      const gapKo = lastEndBeforeKo ? dStarts[dK].t - lastEndBeforeKo.t : -1;
      ok(gapKo >= 900 && gapKo <= 2600, `${n} D: 1 s between the last Vietnamese and the Korean: ${gapKo} ms`);
      ok(rD.card1 >= rD.card0 + 1 && !dl.some(x => x.ev === 'dropped'), `${n} D: cards moved on ${rD.card0} -> ${rD.card1}`);

      // ---- E. mute matrix (Korean UI, 반복 2) ----
      const cases = [['', 'vi-VN,vi-VN,ko-KR'], ['meaning', 'vi-VN,vi-VN'], ['vi', 'ko-KR'], ['both', '']];
      for (const [scope, expect] of cases) {
        await load(prof, {'vn-app-vi-repeat': '2', 'vn-app-auto-adv': AUTO(1), 'vn-app-mute-scope': scope});
        const rE = (await E(`(async()=>{const prof_apple=${prof.apple};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
          window.__tts.length=0; await (${openFlash}); const c0=${cardNo}; let w=0; while(${cardNo}<=c0&&w<25000){await sleep(100);w+=100;} await sleep(300);
          return {log:window.__tts.slice(), c0, c1:${cardNo}};})()`)) || {};
        // the first card only: everything spoken before the card moved on (up to its KO / VI)
        const allStarts = starts(rE.log).map(x => x.lang);
        // the first card's utterances; a first card that the page started twice leaves one cancelled Vietnamese start in front
        const kIdx = allStarts.indexOf('ko-KR');
        const got = (scope === '' && kIdx >= 0) ? allStarts.slice(Math.max(0, kIdx - 2)) : allStarts;
        const firstCard = expect === '' ? got.length === 0 : got.join(',').startsWith(expect);
        ok(firstCard, `${n} E: mute="${scope}" expected ${expect || 'nothing'} got ${got.slice(0, 7)}`);
        ok(rE.c1 >= rE.c0 + 1, `${n} E: mute="${scope}" the card still moves on ${rE.c0} -> ${rE.c1}`);
        if (scope === 'both') ok((rE.log || []).filter(x => x.ev === 'speak').length === 0, `${n} E: both muted -> no speak()`);
        if (scope === 'vi') ok(got.every(l => l === 'ko-KR'), `${n} E: only Korean ${got}`);
        if (scope === 'meaning') ok(got.every(l => l === 'vi-VN'), `${n} E: only Vietnamese ${got}`);
      }

      // ---- F. a late onend of a cancelled run does not touch the new one ----
      await load(prof, {'vn-app-vi-repeat': '2'});
      const rF = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);
        document.querySelector('.subtab-btn[data-sentence="pdf"]').click();await sleep(700);
        const btns=[...document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')].filter(b=>b.offsetParent);
        window.__fakeCfg.lateEndAfterCancelMs=450;
        window.__tts.length=0; btns[0].click(); await sleep(120); btns[1].click(); const bt=btns[1].dataset.speak.slice(0,8); let w=0; while(window.__tts.filter(x=>x.ev==='start'&&x.text.slice(0,8)===bt).length<2&&w<25000){await sleep(100);w+=100;} await sleep(700);
        const log=window.__tts.slice(), b=btns[1].dataset.speak.slice(0,8), a=btns[0].dataset.speak.slice(0,8);
        return {bStarts:log.filter(x=>x.ev==='start'&&x.text.slice(0,8)===b).length, aEnds:log.filter(x=>x.ev==='end'&&x.text.slice(0,8)===a).length,
          late:log.filter(x=>x.ev==='late-end').length, aAfter:log.filter(x=>x.ev==='start'&&x.text.slice(0,8)===a).length};})()`)) || {};
      ok(rF.bStarts === 2 && rF.aAfter <= 1 && rF.aEnds <= 1, `${n} F: new run read twice, old run not back ${JSON.stringify(rF)}`);

      // ---- H. a speak() the engine drops without a trace: once more, then skipped ----
      await load(prof);
      const rH = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('en');await sleep(300);
        document.querySelector('.tab-btn[data-tab="wizard"]').click();await sleep(300);
        document.querySelector('.subtab-btn[data-wizard="daily"]').click();await sleep(700);
        const reg=window.__READALL_REGISTRY;
        const btn=[...document.querySelectorAll('#panel-wizard .read-all-btn')].filter(b=>b.offsetParent).find(b=>{const e=reg[b.dataset.readall];return e&&e.length>=3&&e.length<=6&&e.every(x=>x.vi&&x.mean);});
        const entries=reg[btn.dataset.readall];
        window.__fakeCfg.dropSpeakNth=[1,2,5];   // the first utterance (both tries) and a later one (first try) vanish
        window.__tts.length=0; btn.click(); let w=0; while(btn.dataset.playing==='true'&&w<90000){await sleep(250);w+=250;}
        return {entries, log:window.__tts.slice(), playing:btn.dataset.playing};})()`)) || {};
      const sh = starts(rH.log), spokenH = (rH.log || []).filter(x => x.ev === 'speak');
      ok(rH.playing === 'false' && sh.length >= (rH.entries || []).length * 2 - 1 && spokenH.length >= sh.length + 2, `${n} H: dropped utterances do not lose the sequence (started ${sh.length}, speak() ${spokenH.length}, playing=${rH.playing})`);
      const firstText = spokenH[0] && spokenH[0].text;
      ok(spokenH.filter(x => x.text === firstText).length === 2, `${n} H: the dropped first utterance was tried exactly twice`);

      // ---- I. 복습 UI: no [정답 시 다음 문제] on the flashcard; 1초 offered and default ----
      await load(prof);
      const rI = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(600);
        const out={};
        document.querySelector('.study-mode-btn[data-mode="flash"]').click(); await sleep(400);
        out.flashToggle=!!document.getElementById('auto-next-correct-toggle');
        const sel=document.getElementById('auto-advance-seconds'); out.opts=[...sel.options].map(o=>o.value).join(','); out.def=sel.value;
        for (const m of ['look','mcq','order','type']) { const b=document.querySelector('.study-mode-btn[data-mode="'+m+'"]'); if(!b) continue; b.click(); await sleep(400); out[m]=!!document.getElementById('auto-next-correct-toggle'); }
        document.querySelector('.study-mode-btn[data-mode="flash"]').click(); await sleep(300);
        out.flashAgain=!!document.getElementById('auto-next-correct-toggle');
        return out;})()`)) || {};
      ok(rI.flashToggle === false && rI.flashAgain === false, `${n} I: no 정답 시 다음 문제 on the flashcard ${JSON.stringify(rI)}`);
      ok(rI.look === true && rI.order === true && rI.type === true, `${n} I: still there in the other modes ${JSON.stringify(rI)}`);
      ok(/^0\.3,0\.5,1,3,5,8,10,15$/.test(rI.opts || '') && rI.def === '1', `${n} I: 자동 넘김 1초 default ${rI.opts} / ${rI.def}`);
      // a saved valid choice is kept; a saved invalid one falls back to 1 s
      await load(prof, {'vn-app-auto-adv': JSON.stringify({enabled: false, nextOnCorrect: false, seconds: 8})});
      const keep = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(500);return document.getElementById('auto-advance-seconds').value;})()`);
      await load(prof, {'vn-app-auto-adv': JSON.stringify({enabled: false, nextOnCorrect: false, seconds: 7})});
      const bad = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(500);return document.getElementById('auto-advance-seconds').value;})()`);
      ok(keep === '8' && bad === '1', `${n} I: saved choice kept (${keep}), invalid -> 1 (${bad})`);

      // ---- J. a manual next during the wait cancels the timer; Apple: background ends the speech ----
      await load(prof, {'vn-app-auto-adv': AUTO(3)});
      const rJ = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        await (${openFlash}); const c0=${cardNo};
        let w=0; while(!window.__tts.some(x=>x.ev==='end')&&w<4000){await sleep(50);w+=50;}
        await sleep(800); document.getElementById('flash-next').click(); await sleep(300); const c1=${cardNo};
        window.__tts.length=0; await sleep(2300);   // the old timer (3 s after the first card's audio) would fire here
        const mid=${cardNo}; await sleep(3500);
        return {c0,c1,mid,end:${cardNo}};})()`)) || {};
      ok(rJ.c1 === rJ.c0 + 1 && rJ.mid === rJ.c1 && rJ.end <= rJ.c1 + 1, `${n} J: the old auto timer does not move the learner again ${JSON.stringify(rJ)}`);
      if (prof.apple) {
        await load(prof);
        const rJ2 = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
          window.setLang('ko');await sleep(200);
          document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);
          document.querySelector('.subtab-btn[data-sentence="pdf"]').click();await sleep(700);
          const btns=[...document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')].filter(b=>b.offsetParent);
          window.__fakeCfg.lateEndAfterCancelMs=300; window.__tts.length=0; btns[0].click(); await sleep(500);
          Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true}); document.dispatchEvent(new Event('visibilitychange'));
          const hideAt=Date.now(); await sleep(3000);
          return {startsAfter:window.__tts.filter(x=>x.ev==='start'&&x.t>hideAt+80).length, cancelled:window.__tts.some(x=>x.ev==='cancel'&&x.t>=hideAt-5)};})()`)) || {};
        ok(rJ2.startsAfter === 0 && rJ2.cancelled, `${n} J: Apple page in the background ends the speech ${JSON.stringify(rJ2)}`);
      }
      // ---- K. the gaps of a repeated, bilingual read-all (Original song 116, Korean UI, 반복 3): repeat ~200 ms, language ~300 ms, row ~300 ms ----
      // measured from the engine's end to the next speak(): the timer only starts after the utterance has really finished
      await load(prof, {'vn-app-vi-repeat': '3'});
      const rK = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('ko');await sleep(250);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(200);
        document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(300);
        document.querySelector('.song-kind-tabs [data-songkind="original"]').click();await sleep(300);
        document.querySelector('.song-acc[data-song-id="osg-116"] .song-acc-head').click();await sleep(250);
        const btn=document.querySelector('.song-acc[data-song-id="osg-116"] .song-full-links button.read-all-btn');
        window.__tts.length=0; btn.click();
        for(let i=0;i<400&&window.__tts.filter(x=>x.ev==='end').length<9;i++) await sleep(50);
        const log=window.__tts.slice(); btn.click(); await sleep(100); return {log, repeat:localStorage.getItem('vn-app-vi-repeat')};})()`)) || {};
      {
        const ev = (rK.log || []).filter(x => x.ev === 'speak' || x.ev === 'end');
        const spk = ev.filter(x => x.ev === 'speak'), gaps = [];
        // gap i = engine end of utterance i -> speak() of utterance i+1 (Apple engines send onend 400 ms after the end: subtracted)
        for (let i = 0; i + 1 < spk.length; i++) {
          const end = ev.find(x => x.ev === 'end' && x.text === spk[i].text && x.t >= spk[i].t);
          gaps.push(end ? spk[i + 1].t - end.t - (prof.apple ? 400 : 0) : null);
        }
        const langs = spk.map(x => x.lang);
        console.log(`${n} K gaps (ms) repeat/repeat/language/row/repeat/repeat/language: ${gaps.slice(0, 7)}`);
        // VI VI VI KO VI VI VI KO ...: utterances 0-2 Vietnamese, 3 Korean, 4-6 Vietnamese, 7 Korean
        ok(langs.slice(0, 8).join() === 'vi-VN,vi-VN,vi-VN,ko-KR,vi-VN,vi-VN,vi-VN,ko-KR' && new Set(spk.slice(0, 8).map(x => x.text)).size === 4,
          `${n} K: VI x3 then KO once, row after row (${langs.slice(0, 8)})`);
        const mac = /Macintosh|Mac OS X/.test(prof.ua);   // (headless has no touch points: an iPhone UA is a desktop Mac to the page, as in the test's own fake)
        const inR = (v, lo, hi) => v !== null && v >= lo && v <= hi;
        ok(inR(gaps[0], 30, 250) && inR(gaps[1], 30, 250) && inR(gaps[4], 30, 250) && inR(gaps[5], 30, 250), `${n} K: repeat gap ~50 ms (was 450, then 200): ${gaps.slice(0, 6)}`);
        ok(inR(gaps[2], mac ? 40 : 90, 330) && inR(gaps[6], mac ? 40 : 90, 330), `${n} K: Vietnamese -> Korean gap ~120 ms (macOS desktop keeps its 60): ${gaps[2]} / ${gaps[6]}`);
        ok(inR(gaps[3], 150, 380), `${n} K: Korean -> next row gap ~200 ms: ${gaps[3]}`);
        ok(rK.repeat === '3' && !(rK.log || []).some(x => x.ev === 'dropped' || x.ev === 'ignored'), `${n} K: no dropped utterance`);
      }
      // ---- L. 자동 넘김 총 반복 횟수 (flashcard only, 1-10): a card is played N times in all, then the next card ----
      await load(prof, {'vn-app-auto-adv': JSON.stringify({enabled: true, nextOnCorrect: false, seconds: 1, cardRepeats: 3})});
      const rL = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const o={};
        await (${openFlash});
        document.querySelector('.subtab-btn[data-review="vocab"]').click(); await sleep(500);   // short words: one utterance each
        const fb2=document.querySelector('.study-mode-btn[data-mode="flash"]'); if(fb2.getAttribute('aria-selected')!=='true') fb2.click(); await sleep(300);
        window.__tts.length=0; document.getElementById('flash-next').click(); await sleep(60);   // a fresh card: its first play starts the log
        const sel=()=>document.getElementById('auto-card-repeats');
        o.opts=sel()?[...sel().options].map(x=>x.value).join():null; o.value=sel()&&sel().value; o.disabled=sel()&&sel().disabled;
        o.label=sel()&&sel().getAttribute('aria-label');
        for(let i=0;i<900&&window.__tts.filter(x=>x.ev==='speak').length<14;i++) await sleep(40);
        o.speaks=window.__tts.filter(x=>x.ev==='speak').map(x=>x.text);
        // another mode: no such control
        document.querySelector('.study-mode-btn[data-mode="look"]').click(); await sleep(400);
        o.inLook=!!document.getElementById('auto-card-repeats');
        document.querySelector('.study-mode-btn[data-mode="flash"]').click(); await sleep(400);
        o.back=!!document.getElementById('auto-card-repeats');
        return o;})()`)) || {};
      ok(rL.opts === '1,2,3,4,5,6,7,8,9,10' && rL.value === '3' && rL.disabled === false && /\S/.test(rL.label || ''), `${n} L: the control offers 1-10, saved 3, enabled with 자동 넘김 ${JSON.stringify([rL.opts, rL.value, rL.disabled])}`);
      const sp = rL.speaks || [];
      // card 1 played three times (VI, KO [, example VI, example KO of a 한자음 card]) x3, then a different card
      const P = sp.indexOf(sp[0], 1);   // one play = up to the second time its first utterance comes
      ok(P >= 2 && sp.length > 3 * P && sp.slice(0, 3 * P).every((x, i) => x === sp[i % P]) && sp[3 * P] !== sp[0],
        `${n} L: one card is played 3 times in all (${P} utterances each), then the next card ${JSON.stringify(sp.slice(0, 3 * P + 1))}`);
      ok(rL.inLook === false && rL.back === true, `${n} L: only on the flashcard (look ${rL.inLook}, flash ${rL.back})`);
      await load(prof, {'vn-app-auto-adv': JSON.stringify({enabled: false, nextOnCorrect: false, seconds: 1, cardRepeats: 4})});
      const rL2 = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        await (${openFlash});
        const sel=document.getElementById('auto-card-repeats'); const o={disabled:sel.disabled,value:sel.value};
        const a=document.getElementById('auto-advance-toggle'); a.checked=true; a.dispatchEvent(new Event('change',{bubbles:true})); await sleep(100);
        o.enabled=!document.getElementById('auto-card-repeats').disabled;
        const s2=document.getElementById('auto-card-repeats'); s2.value='10'; s2.dispatchEvent(new Event('change',{bubbles:true})); await sleep(100);
        o.saved=JSON.parse(localStorage.getItem('vn-app-auto-adv')).cardRepeats; return o;})()`)) || {};
      ok(rL2.disabled === true && rL2.value === '4' && rL2.enabled === true && rL2.saved === 10, `${n} L: disabled while 자동 넘김 is off, enabled with it, the choice is saved ${JSON.stringify(rL2)}`);
      // ---- M. [복습] [플래시카드] 반복 듣기: Vietnamese repeats chained at once (0 ms timer), no cancel between them; the pause before the answer is only 자동 넘김 ----
      await load(prof, {'vn-app-vi-repeat': '3', 'vn-app-auto-adv': JSON.stringify({enabled: true, nextOnCorrect: false, seconds: 0.5, cardRepeats: 1})});
      const rM = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        await (${openFlash});
        document.querySelector('.subtab-btn[data-review="vocab"]').click(); await sleep(500);
        const fb=document.querySelector('.study-mode-btn[data-mode="flash"]'); if(fb.getAttribute('aria-selected')!=='true') fb.click(); await sleep(300);
        window.__tts.length=0; document.getElementById('flash-next').click();
        for(let i=0;i<500&&window.__tts.filter(x=>x.ev==='end').length<4;i++) await sleep(40);
        await sleep(200);
        return {log:window.__tts.slice(), opts:[...document.getElementById('auto-advance-seconds').options].map(o=>o.value).join()};})()`)) || {};
      {
        const ev = (rM.log || []), spk = ev.filter(x => x.ev === 'speak'), ends = ev.filter(x => x.ev === 'end');
        const adj = (a, b) => b && a ? b.t - a.t - (prof.apple ? 400 : 0) : null;   // Apple engines send onend 400 ms late in this fake
        const g01 = adj(ends[0], spk[1]), g12 = adj(ends[1], spk[2]), lang = adj(ends[2], spk[3]);
        ok(spk.length >= 4 && spk[0].lang === 'vi-VN' && spk[1].text === spk[0].text && spk[2].text === spk[0].text && spk[3].lang !== 'vi-VN', `${n} M: VI VI VI, then the meaning ${JSON.stringify(spk.slice(0, 4).map(x => x.text + '/' + x.lang))}`);
        ok(g01 !== null && g01 <= (prof.apple ? 140 : 25) && g12 <= (prof.apple ? 140 : 25), `${n} M: VI -> VI gap ${g01} / ${g12} ms (no timer; Apple keeps its 90 ms engine floor)`);
        ok(!ev.slice(ev.indexOf(spk[0]), ev.indexOf(spk[2]) + 1).some(x => x.ev === 'cancel'), `${n} M: no cancel() between the repetitions`);
        ok(lang !== null && lang >= 400 && lang <= 900, `${n} M: question -> answer pause is the 자동 넘김 wait (0.5 s): ${lang} ms`);
        ok(/^0\.3,0\.5,1,/.test(rM.opts || ''), `${n} M: 자동 넘김 offers 0.3 s and 0.5 s ${rM.opts}`);
        console.log(`${n} M gaps (ms): VI-VI ${g01}/${g12}, question->answer ${lang}`);
      }
      ok(!errs.length, `${n}: errors ${errs.join(' | ').slice(0, 400)}`);
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- TTS SEQUENCE TEST FAILED ---'); process.exit(1); }
  console.log('--- TTS SEQUENCE TEST PASSED ---');
})();
