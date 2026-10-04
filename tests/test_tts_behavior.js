// Speech behaviour of the built JEONJU site under fake Web Speech engines that mimic each platform
// (run build_app.py / assemble_app.py first). Per profile -- Windows Chrome, Android Chrome, macOS Safari, iOS Safari:
//   - Apple: nothing is spoken before the first tap (opening the page on [복습] does not read a card out);
//   - the first tap on a listen button plays it, in vi-VN;
//   - rapid taps on several buttons: only the last phrase is still read at the end, nothing plays twice;
//   - with 반복 2, tapping another phrase between the repetitions does not bring the old one back;
//   - changing tab stops a running 전체 듣기; leaving the page (pagehide) stops speech;
//   - 전체 듣기 reads Vietnamese then the meaning in the UI language, in order, to the end;
//   - 복습 flashcards: the next card stops the previous card's audio even when its own audio is muted;
//   - song lines: Vietnamese in vi-VN and Korean in ko-KR whatever the UI language;
//   - no console errors or exceptions.
// The Apple engine keeps `speaking` true for a while after the end, sends onend late and drops a speak() issued just
// after cancel() -- the behaviours behind the earlier "전체 듣기 stops after the first sentence" reports.
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8791;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PROFILES = [
  {name: 'windows-chrome', apple: false, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0'},
  {name: 'android-chrome', apple: false, ua: 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36'},
  {name: 'macos-safari', apple: true, ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'},
  {name: 'ios-safari', apple: true, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'},
];
const engine = apple => `(() => {
  const APPLE = ${apple}, STALE_MS = APPLE ? 700 : 0, LATE_END_MS = APPLE ? 400 : 0, DROP_MS = APPLE ? 150 : 0, CHAR_MS = 10;
  const log = []; window.__tts = log;
  let cur = null, queue = [], lastCancel = -1e9, staleUntil = 0, timers = [];
  const synth = {
    get speaking() { return !!cur || Date.now() < staleUntil; }, get pending() { return queue.length > 0; }, paused: false,
    getVoices() { return []; }, addEventListener() {}, removeEventListener() {}, pause() {}, resume() {},
    cancel() { lastCancel = Date.now(); log.push({ev: 'cancel', t: Date.now(), playing: cur && cur.text}); queue = []; timers.forEach(clearTimeout); timers = [];
      if (cur) { const u = cur; cur = null; staleUntil = Date.now() + (APPLE ? 300 : 0); setTimeout(() => u.onerror && u.onerror({error: 'interrupted'}), 5); } },
    speak(u) {
      log.push({ev: 'speak', text: u.text, lang: u.lang, t: Date.now()});
      if (Date.now() - lastCancel < DROP_MS) { log.push({ev: 'dropped', text: u.text, t: Date.now()}); return; }
      queue.push(u); if (!cur) next();
    }
  };
  function next() {
    const u = queue.shift(); if (!u) return; cur = u;
    timers.push(setTimeout(() => {
      log.push({ev: 'start', text: u.text, lang: u.lang, t: Date.now()}); u.onstart && u.onstart();
      timers.push(setTimeout(() => {
        log.push({ev: 'end', text: u.text, t: Date.now()}); cur = null; staleUntil = Date.now() + STALE_MS;
        timers.push(setTimeout(() => u.onend && u.onend(), LATE_END_MS)); next();
      }, Math.max(250, String(u.text).length * CHAR_MS)));
    }, 40));
  }
  Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.rate = 1; this.voice = null; };
})();`;

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn('python', ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(process.env.TEMP || '.', 'tts-beh-' + process.pid)], {stdio: 'ignore'});
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
    // userGesture: the page sees the evaluation as a tap (navigator.userActivation), as a real click would be
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
    };
    const starts = log => (log || []).filter(x => x.ev === 'start');

    for (const prof of PROFILES) {
      const n = prof.name;
      errs = [];
      // ---- load straight onto [복습] (no tap yet) ----
      await load(prof, {'vn-app-last-place-v1': JSON.stringify({tab: 'review', subtabs: {}, scrollY: 0})});
      const pre = await E('window.__tts.filter(x=>x.ev==="speak").length', false);
      if (prof.apple) ok(pre === 0, `${n}: spoke ${pre} times before the first tap`);

      // ---- first tap, rapid taps ----
      const r1 = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);
        document.querySelector('.subtab-btn[data-sentence="pdf"]').click();await sleep(700);
        const btns=[...document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')].filter(b=>b.offsetParent);
        window.__tts.length=0; btns[0].click(); await sleep(1500);
        const first=window.__tts.slice(), firstText=btns[0].dataset.speak;
        window.__tts.length=0; const picked=btns.slice(1,6); picked.forEach(b=>b.click()); await sleep(2500);
        return {first, firstText, rapid:window.__tts.slice(), lastText:picked[picked.length-1].dataset.speak, count:btns.length};})()`);
      if (process.env.TTS_DEBUG) console.log(n, 'pre', pre, JSON.stringify(r1).slice(0, 300), errs.join(' | ').slice(0, 300));
      if (!r1 || !r1.first) { ok(false, `${n}: listen-button scenario did not run ${errs.join(' | ').slice(0, 300)}`); continue; }
      const f = starts(r1.first);
      ok(f.length >= 1 && f[0].lang === 'vi-VN' && r1.first.filter(x => x.ev === 'dropped').length === 0, `${n}: first tap ${JSON.stringify(r1.first.slice(0, 4))}`);
      const rs = starts(r1.rapid);
      const lastStart = rs[rs.length - 1];
      ok(lastStart && lastStart.text.slice(0, 8) === r1.lastText.trim().slice(0, 8) && r1.rapid.some(x => x.ev === 'end' && x.text === lastStart.text),
        `${n}: rapid taps end on the last phrase ${JSON.stringify(rs.map(x => x.text.slice(0, 10)))}`);
      const dup = {}; rs.forEach(x => { dup[x.text] = (dup[x.text] || 0) + 1; });
      ok(!Object.values(dup).some(v => v > 1), `${n}: rapid taps replayed a phrase ${JSON.stringify(dup)}`);

      // ---- 전체 듣기 reads to the end, in order; then a tab change stops it ----
      const r2 = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('en');await sleep(300);
        document.querySelector('.tab-btn[data-tab="wizard"]').click();await sleep(300);
        document.querySelector('.subtab-btn[data-wizard="daily"]').click();await sleep(700);
        const reg=window.__READALL_REGISTRY;
        const btn=[...document.querySelectorAll('#panel-wizard .read-all-btn')].filter(b=>b.offsetParent).find(b=>{const e=reg[b.dataset.readall];return e&&e.length>=3&&e.length<=8&&e.every(x=>x.vi&&x.mean);});
        const entries=reg[btn.dataset.readall];
        window.__tts.length=0; btn.click(); let w=0; while(btn.dataset.playing==='true'&&w<40000){await sleep(250);w+=250;}
        const full=window.__tts.slice(), stillPlaying=btn.dataset.playing;
        const big=[...document.querySelectorAll('#panel-wizard .read-all-btn')].find(b=>(reg[b.dataset.readall]||[]).length>=8)||btn;
        window.__tts.length=0; big.click(); await sleep(1200);
        const tabAt=Date.now(); document.querySelector('.tab-btn[data-tab="vocab"]').click(); await sleep(2500);
        const after=window.__tts.filter(x=>x.ev==='start'&&x.t>tabAt+80).length, cancelled=window.__tts.some(x=>x.ev==='cancel'&&x.t>=tabAt-5);
        return {entries, full, stillPlaying, after, cancelled, bigPlaying:big.dataset.playing};})()`)) || {};
      const fs = starts(r2.full);
      const expected = []; (r2.entries || []).forEach(e => { expected.push(['vi', e.vi]); expected.push(['en', e.mean]); });
      let k = 0; fs.forEach(s => { if (k < expected.length && s.text.replace(/\s+/g, ' ').slice(0, 5) === expected[k][1].replace(/[-–]/g, ' ').replace(/\s+/g, ' ').slice(0, 5)) k++; });
      ok(expected.length && k === expected.length && r2.stillPlaying === 'false', `${n}: 전체 듣기 heard ${k}/${expected.length} in order (playing=${r2.stillPlaying})`);
      ok(fs.filter(s => /[a-z]/i.test(s.text) && s.lang).every(s => s.lang === 'vi-VN' || s.lang === 'en-US'), `${n}: 전체 듣기 languages ${[...new Set(fs.map(s => s.lang))]}`);
      ok(fs.filter((s, i) => i % 2 === 1).every(s => s.lang === 'en-US'), `${n}: meanings read in the UI language`);
      ok(r2.after === 0 && r2.cancelled && r2.bigPlaying === 'false', `${n}: tab change stops 전체 듣기 (after=${r2.after}, cancelled=${r2.cancelled})`);

      // ---- 복습 flashcards: next card with Vietnamese muted stops the previous card's meaning ----
      const r3 = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="review"]').click();await sleep(600);
        const fb=document.querySelector('.study-mode-btn[data-mode="flash"]'); if(fb) fb.click(); await sleep(500);
        const card=document.getElementById('flash-card'); if(!card) return {err:'no card'};
        window.__tts.length=0; card.click(); await sleep(150);
        const playingAtNext=window.speechSynthesis.speaking;
        const nextAt=Date.now(); document.getElementById('flash-next').click(); await sleep(2500);
        const log=window.__tts.slice();
        return {playingAtNext, nextAt, log, cancelled: log.some(x=>x.ev==='cancel'&&x.t>=nextAt-5),
          oldContinued: log.some(x=>x.ev==='end'&&x.t>nextAt+60&&log.find(y=>y.ev==='start'&&y.t<nextAt&&y.text===x.text))};})()`)) || {};
      ok(r3 && !r3.err && r3.cancelled && !r3.oldContinued, `${n}: flashcard next stops the previous card ${JSON.stringify(r3 && (r3.err || {cancelled: r3.cancelled, cont: r3.oldContinued}))}`);

      // ---- song lines: Vietnamese vi-VN, Korean ko-KR under an English UI ----
      const r4 = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('en');await sleep(200);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(200);
        document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(400);
        document.querySelector('.song-kind-tabs [data-songkind="original"]').click();await sleep(300);
        document.querySelector('.song-acc[data-song-id="osg-116"] .song-acc-head').click();await sleep(200);
        const c=document.querySelector('.song-acc[data-song-id="osg-116"]');
        window.__tts.length=0; c.querySelector('.song-lyric-col[lang="vi"] .speak-btn').click(); await sleep(1500);
        c.querySelector('.song-lyric-col[lang="ko"] .speak-btn').click(); await sleep(1500);
        return window.__tts.filter(x=>x.ev==='start').map(x=>x.lang);})()`)) || {};
      ok(JSON.stringify(r4) === '["vi-VN","ko-KR"]', `${n}: song line languages ${JSON.stringify(r4)}`);

      // ---- 반복 2: another phrase between repetitions does not bring the old one back; pagehide stops ----
      await load(prof, {'vn-app-vi-repeat': '2'});
      const r5 = (await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);
        document.querySelector('.subtab-btn[data-sentence="pdf"]').click();await sleep(700);
        const btns=[...document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')].filter(b=>b.offsetParent);
        window.__tts.length=0; btns[0].click();
        let w=0; while(!window.__tts.some(x=>x.ev==='end')&&w<5000){await sleep(20);w+=20;}
        const at=Date.now(); btns[1].click(); await sleep(3000);
        const log=window.__tts.slice(), a=btns[0].dataset.speak.slice(0,8);
        const oldAgain=log.filter(x=>x.ev==='start'&&x.t>at&&x.text.slice(0,8)===a).length;
        const bReps=log.filter(x=>x.ev==='start'&&x.t>at&&x.text.slice(0,8)===btns[1].dataset.speak.slice(0,8)).length;
        window.__tts.length=0; btns[2].click(); await sleep(500); window.dispatchEvent(new Event('pagehide')); const ph=Date.now(); await sleep(2000);
        const afterHide=window.__tts.filter(x=>x.ev==='start'&&x.t>ph+80).length;
        return {oldAgain, bReps, afterHide};})()`)) || {};
      ok(r5.oldAgain === 0 && r5.bReps === 2, `${n}: repetition after a new tap (old again ${r5.oldAgain}, new reps ${r5.bReps})`);
      ok(r5.afterHide === 0, `${n}: pagehide stops speech (${r5.afterHide} starts after)`);
      ok(!errs.length, `${n}: errors ${errs.join(' | ').slice(0, 400)}`);
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- TTS BEHAVIOUR TEST FAILED ---'); process.exit(1); }
  console.log('--- TTS BEHAVIOUR TEST PASSED ---');
})();
