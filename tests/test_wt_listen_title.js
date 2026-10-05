// Watchtower [전체 듣기] ([문장] > [파수대] and [어휘] > [파수대]) begins with the article's title (run build_app.py /
// assemble_app.py first):
//   - every week card of the whole Watchtower data: its read-all list starts with [title in Vietnamese, title in the UI
//     language] taken from WATCHTOWER_VOCAB (not from the page), then the body; the title is not repeated;
//   - 묵음: a silenced language is left out of the title as of the body; both silenced -> nothing to play;
//   - playing: title VI (vi-VN), title KO (ko-KR), then the body in its usual order; stopping leaves no speech behind and
//     playing again starts with the title; the same on an Apple user agent (one serial speech engine).
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8799;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = {
  win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
};
const FAKE_TTS = apple => `(() => {
  const log = window.__tts = []; let cur = null, timers = [], lastCancel = -1e9;
  const synth = { get speaking() { return !!cur; }, pending: false, paused: false, getVoices() { return []; }, addEventListener() {}, removeEventListener() {}, pause() {}, resume() {},
    cancel() { lastCancel = Date.now(); timers.forEach(clearTimeout); timers = []; if (cur) { const u = cur; cur = null; setTimeout(() => u.onerror && u.onerror({error: 'interrupted'}), 5); } },
    speak(u) { log.push({ev: 'speak', text: u.text, lang: u.lang, t: Date.now()}); if (${apple} && Date.now() - lastCancel < 150) return; cur = u;
      timers.push(setTimeout(() => { log.push({ev: 'start', text: u.text, lang: u.lang, t: Date.now()}); u.onstart && u.onstart();
        timers.push(setTimeout(() => { cur = null; u.onend && u.onend(); }, 90)); }, 20)); } };
  Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.rate = 1; this.voice = null; };
})();`;

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'wt-title-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Network.enable');
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '').slice(0, 200)));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async expr => {
      const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true});
      if (r.exceptionDetails) errs.push('evaluate ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text).slice(0, 300));
      return r.result.value;
    };
    let script = null;
    const load = async (storage, ua, apple) => {
      if (script) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: script});
      const seed = `try{localStorage.clear();${Object.entries(storage || {}).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(v)});`).join('')}}catch(e){}`;
      script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `if(!sessionStorage.getItem('__wl')){sessionStorage.setItem('__wl','1');${seed}}` + FAKE_TTS(!!apple)})).identifier;
      await cdp.send('Network.setUserAgentOverride', {userAgent: ua || UA.win});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await E("sessionStorage.removeItem('__wl')");
      await sleep(800);
      await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
      await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1});
      await sleep(100);
    };
    const SEEN = JSON.stringify({tab: 'vocab', subtabs: {}, scrollY: 0});
    const VIEWS = {sentences: `document.querySelector('.tab-btn[data-tab="sentence"]').click(); await sleep(200); document.querySelector('.subtab-btn[data-sentence="wt"]').click(); await sleep(500);`,
      words: `document.querySelector('.tab-btn[data-tab="vocab"]').click(); await sleep(200); document.querySelector('.subtab-btn[data-vocab="wt"]').click(); await sleep(500);`};
    const ROOT_OF = {sentences: '#curr-wt-root', words: '#vocab-root'};

    // ---- the read-all lists of all 24 weeks: both views, several UI languages, every mute scope ----
    for (const scope of ['', 'meaning', 'vi', 'both']) {
      await load({'vn-app-last-place-v1': SEEN, 'vn-app-mute-scope': scope});
      for (const view of Object.keys(VIEWS)) {
        for (const lang of ['ko', 'en', 'cs', 'vi']) {
          const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); window.setLang('${lang}'); await sleep(200); ${VIEWS[view]}
            const cards=[...document.querySelectorAll('${ROOT_OF[view]} .group-card')], out=[];
            cards.forEach(c=>{const b=c.querySelector('.read-all-btn'); out.push({week:c.dataset.syl, entries:b?window.__READALL_REGISTRY[b.dataset.readall]:null});});
            const titles={}; WATCHTOWER_VOCAB.forEach(wk=>{titles['wt'+wk.week]={vi:wk.article_title.vi, own:'${lang}'==='vi'?'':(wk.article_title['${lang}']||'')};});
            return {out,titles};})()`);
          const tag = `[${view}] ${lang} mute="${scope}"`;
          ok(r && r.out.length === 24, `${tag}: ${r && r.out.length} week cards`);
          let bad = 0, dupe = 0, noBtn = 0;
          for (const c of (r && r.out) || []) {
            const t = r.titles[c.week];
            if (!c.entries) { noBtn++; continue; }
            const [a, b] = [c.entries[0], c.entries[1]];
            const wantVi = scope === 'vi' || scope === 'both' ? '' : t.vi;
            const wantOwn = scope === 'meaning' || scope === 'both' ? '' : t.own;
            if (!a || (a.vi || '') !== wantVi || (a.mean || '') !== wantOwn) bad++;
            // the second entry must not repeat the title
            if (b && a && a.vi && b.vi === a.vi) dupe++;
            // a silenced language is nowhere in the list
            if (scope === 'vi' && c.entries.some(e => e.vi)) bad++;
            if (scope === 'meaning' && c.entries.some(e => e.mean)) bad++;
          }
          // Vietnamese UI + Vietnamese silenced: the UI language has no text of its own, so nothing is left to play
          if (scope === 'both' || (lang === 'vi' && scope === 'vi')) ok(noBtn === 24, `${tag}: both silenced -> no 전체 듣기 (${noBtn}/24 without)`);
          else { ok(bad === 0 && noBtn === 0, `${tag}: title first in ${24 - bad - noBtn}/24 (bad ${bad}, no button ${noBtn})`); ok(dupe === 0, `${tag}: title repeated in ${dupe} weeks`); }
        }
      }
    }

    // ---- playing: title VI, title KO, then the body; stop; play again; the Apple user agent too ----
    for (const [name, ua, apple] of [['windows', UA.win, false], ['iphone', UA.iphone, true]]) {
      for (const view of Object.keys(VIEWS)) {
        await load({'vn-app-last-place-v1': SEEN}, ua, apple);
        const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); window.setLang('ko'); await sleep(200); ${VIEWS[view]}
          const card=document.querySelector('${ROOT_OF[view]} .group-card[data-syl="wt6"]')||document.querySelector('${ROOT_OF[view]} .group-card'); const wk=WATCHTOWER_VOCAB.find(w=>'wt'+w.week===card.dataset.syl);
          const btn=card.querySelector('.read-all-btn'), entries=window.__READALL_REGISTRY[btn.dataset.readall];
          const starts=()=>window.__tts.filter(x=>x.ev==='start').map(x=>[x.lang,x.text]);
          window.__tts.length=0; btn.click(); await sleep(2600); const first=starts().slice(0,6);
          btn.click(); await sleep(300); const stoppedAt=Date.now(); const n=starts().length; await sleep(1500); const after=starts().length-n;
          window.__tts.length=0; btn.click(); await sleep(1500); const again=starts().slice(0,3); btn.click();
          return {first, titleVi:wk.article_title.vi, titleKo:wk.article_title.ko, body0:entries[2], after, again};})()`);
        const tag = `${name} [${view}]`;
        const norm = x => String(x || '').replace(/[-–]/g, ' ').replace(/\s+/g, ' ').slice(0, 14);
        ok(r && r.first.length >= 4 && r.first[0][0] === 'vi-VN' && norm(r.first[0][1]) === norm(r.titleVi) && r.first[1][0] === 'ko-KR' && norm(r.first[1][1]) === norm(r.titleKo) && r.first[2][0] === 'vi-VN' && r.first[3][0] === 'ko-KR',
          `${tag}: title VI, title KO, body VI, body KO: ${JSON.stringify(r && r.first.map(x => [x[0], x[1].slice(0, 12)]))}`);
        ok(r && norm(r.first[2] && r.first[2][1]) !== norm(r.titleVi), `${tag}: the body does not repeat the title`);
        ok(r && r.after === 0, `${tag}: speech after stop: ${r && r.after}`);
        ok(r && r.again.length >= 2 && r.again[0][0] === 'vi-VN' && norm(r.again[0][1]) === norm(r.titleVi) && r.again[1][0] === 'ko-KR' && norm(r.again[1][1]) === norm(r.titleKo), `${tag}: playing again starts with the title: ${JSON.stringify(r && r.again.map(x => [x[0], x[1].slice(0, 12)]))}`);
      }
    }
    // silenced Korean -> the Vietnamese title first, no Korean at all; silenced Vietnamese -> the Korean title first
    for (const [scope, firstLang, onlyLang] of [['meaning', 'vi-VN', 'vi-VN'], ['vi', 'ko-KR', 'ko-KR']]) {
      await load({'vn-app-last-place-v1': SEEN, 'vn-app-mute-scope': scope});
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); window.setLang('ko'); await sleep(200); ${VIEWS.sentences}
        const btn=document.querySelector('#curr-wt-root .group-card .read-all-btn'); window.__tts.length=0; btn.click(); await sleep(2200); btn.click();
        return window.__tts.filter(x=>x.ev==='start').map(x=>x.lang);})()`);
      ok(r && r.length >= 2 && r[0] === firstLang && r.every(l => l === onlyLang), `mute "${scope}": only ${onlyLang}, ${firstLang} first: ${JSON.stringify(r && r.slice(0, 6))}`);
    }
    ok(!errs.length, `errors ${errs.join(' | ').slice(0, 400)}`);
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- WT LISTEN TITLE TEST FAILED ---'); process.exit(1); }
  console.log('--- WT LISTEN TITLE TEST PASSED ---');
})();
