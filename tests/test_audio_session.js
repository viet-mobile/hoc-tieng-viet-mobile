// The audio session of iOS / iPadOS (run build_app.py / assemble_app.py first): with the ringer switch on "silent" the speech is only
// heard from a PLAYBACK session. Mock navigator.audioSession + the fake speech engine, one shared order log (window.__tts):
//   - iPhone / iPad: type "playback" is assigned BEFORE the first utterance is handed to the engine, and only once (never cycled)
//   - no audioSession API: the speech works as before
//   - an assignment that throws never stops the speech
//   - macOS Safari, Windows, Android: the session is not touched at all
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8987;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = {
  iphone: ['iphone', true, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'],
  ipad: ['ipad', true, 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'],
  mac: ['mac', true, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'],
  win: ['win', false, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'],
  android: ['android', false, 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36'],
};
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


// mode: 'ok' (assignable, logs into window.__tts), 'throws' (the setter throws), 'none' (no navigator.audioSession)
const MOCK = mode => mode === 'none' ? '' : `(() => { const log = window.__tts; let t = 'auto';
  const as = { get type() { return t; }, get state() { return 'inactive'; }, addEventListener() {}, set type(v) { ${mode === 'throws' ? "log.push({ev: 'audioSession-throw', v}); throw new Error('refused');" : "log.push({ev: 'audioSession', v, t: Date.now()}); t = v;"} } };
  Object.defineProperty(navigator, 'audioSession', { value: as, configurable: true }); })();`;
const failures = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) failures.push(m); };
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'audio-session-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable'); await cdp.send('Network.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 1000, deviceScaleFactor: 1, mobile: false});
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '').slice(0, 160)));
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); if (r.exceptionDetails) errs.push('eval ' + ((r.exceptionDetails.exception || {}).description || '').slice(0, 160)); return r.result.value; };
    let script = null;
    for (const [key, [name, apple, ua]] of Object.entries(UA)) {
      for (const mode of (name === 'iphone' || name === 'ipad') ? ['ok', 'none', 'throws'] : ['ok']) {
        errs = [];
        if (script) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: script});
        script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: engine(apple) + MOCK(mode)})).identifier;
        await cdp.send('Network.setUserAgentOverride', {userAgent: ua});
        await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
        for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
        await sleep(900);
        // the learner's first real tap, then a listen button (speech run)
        await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
        await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1}); await sleep(150);
        const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang('ko');await sleep(200);
          document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="pdf"]').click();await sleep(700);
          for(let i=window.__tts.length-1;i>=0;i--) if(window.__tts[i].ev!=='audioSession') window.__tts.splice(i,1);
          const b=[...document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')].filter(x=>x.offsetParent)[0]; b.click();
          for(let i=0;i<100&&!window.__tts.some(x=>x.ev==='speak');i++) await sleep(40); await sleep(200);
          const first=window.__tts.slice();
          // a second and a third run: the session is not set again
          document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')[1].click(); await sleep(700);
          document.querySelectorAll('#panel-sentence .speak-btn[data-speak]')[0].click(); await sleep(700);
          return {first, all:window.__tts.slice(), type:navigator.audioSession&&navigator.audioSession.type};})()`);
        const tag = `${name} audioSession ${mode}`;
        const ev = r.all || [], iOS = name === 'iphone' || name === 'ipad';
        const idxPlay = ev.findIndex(x => x.ev === 'audioSession' && x.v === 'playback'), idxSpeak = ev.findIndex(x => x.ev === 'speak');
        ok(idxSpeak >= 0, `${tag}: the speech still starts`);
        if (iOS && mode === 'ok') {
          ok(idxPlay >= 0 && idxSpeak >= 0 && ev.every(x => x.ev !== 'audioSession' || x.v === 'playback') && r.type === 'playback', `${tag}: playback assigned ${JSON.stringify(ev.filter(x => x.ev === 'audioSession').map(x => x.v))}, final ${r.type}`);
          ok(ev.filter(x => x.ev === 'audioSession').length <= 1, `${tag}: assigned at most once while it stays playback (no cycling): ${ev.filter(x => x.ev === 'audioSession').length}`);
          ok(idxPlay < 0 || idxPlay < idxSpeak, `${tag}: the assignment comes before the first utterance`);
        } else if (iOS && mode === 'throws') {
          ok(!errs.length, `${tag}: a refused assignment is caught (${errs.join(' | ').slice(0, 200)})`);
        } else if (iOS && mode === 'none') {
          ok(!errs.length, `${tag}: no API, no error`);
        } else {
          ok(!ev.some(x => x.ev === 'audioSession'), `${tag}: the session is not touched`);
        }
      }
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- AUDIO SESSION TEST FAILED ---'); process.exit(1); }
  console.log('--- AUDIO SESSION TEST PASSED ---');
})();
