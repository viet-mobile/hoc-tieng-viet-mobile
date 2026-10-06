// [한자음] flashcards read the card's EXAMPLE too (run build_app.py / assemble_app.py first):
//   headword (Vietnamese x repeat) -> its meaning once -> example (Vietnamese x repeat) -> example meaning once,
//   on the flashcard of BOTH ways in: [과정] > ... > [바로가기] > [학습 범위내 복습 게임] and [복습] > [어휘] > [한자음].
//   - the card front says the headword (as before); the back (flip / the 자동 넘김 reveal) says meaning + example; the replay of a
//     revealed card says the whole card: ca -> 노래 가 -> ca sĩ -> 가수
//   - data-driven from RHYME_GROUPS (no word is special); VI repeat only, meanings once; 묵음 matrix; an example without a meaning in
//     the UI language is read without one (cs / hu / id / zh_cn have none today), never in another language
//   - 자동 넘김 moves on only after the example meaning was said; a manual next cancels the rest of the card
//   - the data audit is printed (total / examples / meanings per language)
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8797;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PROFILES = [
  {name: 'windows-chrome', apple: false, ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'},
  {name: 'macos-safari', apple: true, ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'},
];
const TAG = {vi: 'vi-VN', cs: 'cs-CZ', zh_cn: 'zh-CN', zh: 'zh-TW', en: 'en-US', fr: 'fr-FR', de: 'de-DE', hu: 'hu-HU', id: 'id-ID', ja: 'ja-JP', ko: 'ko-KR', pl: 'pl-PL'};
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
// (the speech text prepares "a/b" as "a, b" and drops the hanja note in parentheses)
const clean = s => String(s || '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s*\/\s*/g, ', ').replace(/\s+/g, ' ').trim();

(async () => {
  const static_src = fs.readFileSync(path.join(ROOT, 'app_logic.js'), 'utf8');
  // no word is special: no comparison of a headword with a literal in the flashcard speech code
  const code = static_src.slice(static_src.indexOf('function hanjaBackItems'), static_src.indexOf('function revealFlash'));
  ok(code.length > 200 && !/["']ca["']|["']ca sĩ["']/.test(code) && !/===\s*["'][a-zà-ỹ ]+["']/i.test(code.replace(/"(vi|ko|zh)"/g, '')), 'the 한자음 speech code has no special-cased word');

  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'hanja-tts-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable'); await cdp.send('Page.enable'); await cdp.send('Network.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 1000, deviceScaleFactor: 1, mobile: false});
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
      script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `if(!sessionStorage.getItem('__hvinit')){sessionStorage.setItem('__hvinit','1');${init}}` + engine(prof.apple)})).identifier;
      await cdp.send('Network.setUserAgentOverride', {userAgent: prof.ua});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'", false)) break; await sleep(250); }
      await E("sessionStorage.removeItem('__hvinit')", false);
      await sleep(900);
      await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
      await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1});
      await sleep(100);
      await E(HELPERS, false);
    };
    // in-page helpers: routes, the card on screen, settings through the page's own controls
    const HELPERS = `window.__hv = {
      sleep: ms => new Promise(r => setTimeout(r, ms)),
      front() { const e = document.querySelector('#flash-card .study-flash-vi'); return e ? e.textContent : null; },
      async setting(scope, rep, auto) {      // scope: '' | vi | meaning | both; rep 1-10; auto: bool (자동 넘김, 1 s)
        const root = document.getElementById('study-auto-row');
        let sel = root.querySelector('.repeat-count-select'); if (sel && sel.value !== String(rep)) { sel.value = String(rep); sel.dispatchEvent(new Event('change', {bubbles: true})); await this.sleep(40); }
        let t = document.getElementById('study-auto-row').querySelector('.mute-autoplay-toggle');
        if (!scope) { if (t.checked) { t.checked = false; t.dispatchEvent(new Event('change', {bubbles: true})); } }
        else { if (!t.checked) { t.checked = true; t.dispatchEvent(new Event('change', {bubbles: true})); await this.sleep(40); }
          const s = document.getElementById('study-auto-row').querySelector('.mute-scope-select'); s.value = scope; s.dispatchEvent(new Event('change', {bubbles: true})); }
        await this.sleep(40);
        const a = document.getElementById('auto-advance-toggle'); if (a && a.checked !== !!auto) { a.checked = !!auto; a.dispatchEvent(new Event('change', {bubbles: true})); }
        await this.sleep(40);
      },
      async openReview() {
        document.querySelector('.tab-btn[data-tab="review"]').click(); await this.sleep(500);
        document.querySelector('.subtab-btn[data-review="vocab"]').click(); await this.sleep(400);
        document.querySelector('[data-review-scope="rhyme"]').click(); await this.sleep(600);
        const fb = document.querySelector('.study-mode-btn[data-mode="flash"]'); if (fb.getAttribute('aria-selected') !== 'true') fb.click(); await this.sleep(300);
        return !!document.getElementById('flash-card');
      },
      async openCourse() {
        document.querySelector('.tab-btn[data-tab="curriculum"]').click(); await this.sleep(500);
        const b = [...document.querySelectorAll('.curr-link-btn[data-goto-subval="rhyme"]')].find(x => x.dataset.gotoVrStart === '0'); b.click(); await this.sleep(700);
        const g = document.querySelector('.vocab-focus-scoped-review'); if (!g) return false; g.click(); await this.sleep(700);
        const fb = document.querySelector('.study-mode-btn[data-mode="flash"]'); if (fb && fb.getAttribute('aria-selected') !== 'true') fb.click(); await this.sleep(300);
        return !!document.getElementById('flash-card');
      },
      async seek(word) { for (let i = 0; i < 700; i++) { if (this.front() === word) return true; document.getElementById('flash-next').click(); await this.sleep(8); } return false; },
      flip() { document.getElementById('flash-card').click(); },
      back() { const e = document.getElementById('flash-kr'); return e && e.style.display !== 'none'; }
    };`;
    const texts = log => (log || []).filter(x => x.ev === 'speak' || x.ev === 'dropped').map(x => x.text);
    const spoken = log => (log || []).filter(x => x.ev === 'speak').map(x => ({text: x.text, lang: x.lang}));
    const wait = async (cond, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await E(cond, false)) return true; await sleep(40); } return false; };

    // ---------- the data audit ----------
    await load(PROFILES[0]);
    const audit = await E(`(()=>{const L=['ko','zh','zh_cn','en','ja','de','fr','pl','cs','hu','id'];const words=[];RHYME_GROUPS.forEach(g=>g.families.forEach(f=>f.words.forEach(w=>words.push(w))));
      const seen=new Set(), uniq=words.filter(w=>!seen.has(w.word)&&seen.add(w.word));
      const o={total:words.length,unique:uniq.length,withExample:words.filter(w=>w.example&&String(w.example).trim()).length,perLang:{},fields:Object.keys(words[0])};
      L.forEach(l=>{o.perLang[l]={gloss:uniq.filter(w=>w.gloss&&w.gloss[l]).length,exMeaning:uniq.filter(w=>w.example_mean&&w.example_mean[l]).length,both:uniq.filter(w=>w.gloss&&w.gloss[l]&&w.example_mean&&w.example_mean[l]).length};});
      o.words=uniq.map(w=>({word:w.word,hanja:w.hanja,gloss:w.gloss,example:w.example,example_mean:w.example_mean}));return o;})()`, false);
    console.log('한자음 data: fields ' + audit.fields.join(',') + '; ' + audit.total + ' records (' + audit.unique + ' distinct headwords), with example ' + audit.withExample + ', without ' + (audit.total - audit.withExample));
    for (const [l, c] of Object.entries(audit.perLang)) console.log('  ' + l + ': meaning ' + c.gloss + '/' + audit.unique + ', example meaning ' + c.exMeaning + '/' + audit.unique + ', both ' + c.both + ', headword meaning without example meaning ' + (c.gloss - c.both));
    ok(audit.total === 313 && audit.withExample === 313 && Object.values(audit.perLang).every(c => c.both === audit.unique), 'every 한자음 record has an example, and every language (ko zh zh_cn en ja de fr pl cs hu id) has the meaning of the headword AND of the example');
    const W = Object.fromEntries(audit.words.map(w => [w.word, w]));
    // what a card of `word` must say in `loc`, with the settings (rep, mute): the card's own record only
    const plan = (word, loc, rep, mute, full) => {
      const w = W[word], gl = clean(w.gloss[loc]), em = w.example_mean && w.example_mean[loc] ? clean(w.example_mean[loc]) : '';
      const mv = mute === 'vi' || mute === 'both', mm = mute === 'meaning' || mute === 'both', out = [];
      const vi = t => { if (!mv) for (let i = 0; i < rep; i++) out.push({text: t, lang: 'vi-VN'}); };
      const mean = t => { if (!mm && t) out.push({text: t, lang: TAG[loc]}); };
      if (full) vi(word);
      mean(gl); vi(w.example); mean(em);
      return out;
    };
    const eq = (got, want) => got.length === want.length && got.every((g, i) => clean(g.text) === clean(want[i].text) && g.lang === want[i].lang);
    const fmt = a => a.map(x => x.text).join(' → ');

    for (const prof of PROFILES) {
      const n = prof.name;
      const apple = prof.apple;
      for (const route of ['review', 'course']) {
        errs = [];
        await load(prof, {'vn-app-auto-adv': JSON.stringify({enabled: false, nextOnCorrect: false, seconds: 1})});
        await E(`window.setLang('ko')`, false); await sleep(200);
        ok(await E(route === 'review' ? 'window.__hv.openReview()' : 'window.__hv.openCourse()'), `${n} ${route}: the 한자음 flashcard opens`);
        await E(`window.__hv.setting('both', 1, false)`);   // silent while looking for the card
        ok(await E(`window.__hv.seek('ca')`), `${n} ${route}: the card "ca" is in the deck`);
        ok((await E(`document.getElementById('flash-kr').textContent`, false)).startsWith('노래 가(歌)'), `${n} ${route}: the card shows the Korean meaning of its record`);
        ok(await E(`(()=>{const e=document.querySelector('#flash-kr .study-flash-example');return !!e&&e.textContent==='ca sĩ가수(歌手)';})()`, false), `${n} ${route}: the back of the card shows the example: ca sĩ / 가수`);
        // ---- manual: flip says meaning + example; replay says the whole card ----
        for (const rep of [1, 2, 3]) {
          await E(`window.__hv.setting('', ${rep}, false)`);
          // the front is not re-said by a flip; make the card fresh again (hide) then flip
          if (await E('window.__hv.back()', false)) { await E('window.__hv.flip()'); await sleep(100); }
          await E('window.__tts.length=0; window.__hv.flip()'); await sleep(150);
          await wait(`window.__tts.filter(x=>x.ev==='end').length>=${rep + 3}`);
          await sleep(300);
          const flip = spoken(await E('window.__tts.slice()', false));
          ok(eq(flip, plan('ca', 'ko', rep, '', false)), `${n} ${route} repeat ${rep} flip: ${fmt(flip)}`);
          await E('window.__tts.length=0; document.getElementById("flash-replay").click()'); await sleep(150);
          await wait(`window.__tts.filter(x=>x.ev==='end').length>=${2 * rep + 2}`);
          await sleep(300);
          const full = spoken(await E('window.__tts.slice()', false));
          ok(eq(full, plan('ca', 'ko', rep, '', true)), `${n} ${route} repeat ${rep} whole card: ${fmt(full)}`);
          if (rep <= 2 && !apple) console.log(`${n} ${route} ca repeat ${rep}: ${fmt(full)}`);
          if (rep === 3) {
            // the gaps of the whole card (engine end -> next speak), flashcard profile: 0 / 60 / 120 ms (Apple: +90 ms engine floor, onend 400 ms late in the fake)
            const lg = await E('window.__tts.slice()', false), sp2 = lg.filter(x => x.ev === 'speak'), en2 = lg.filter(x => x.ev === 'end');
            const gp = sp2.slice(1).map((x, i) => en2[i] ? x.t - en2[i].t - (apple ? 400 : 0) : null);
            // ca ca ca | 노래 가 | ca sĩ ca sĩ ca sĩ | 가수  ->  VI-VI, VI-VI, VI->meaning, meaning->example, ex-ex, ex-ex, ex->meaning
            const lim = (a, b) => gp[a] !== null && gp[a] <= b;
            ok(sp2.length === 8 && lim(0, apple ? 140 : 25) && lim(1, apple ? 140 : 25) && lim(2, apple ? 160 : 90) && lim(3, apple ? 200 : 150) && lim(4, apple ? 140 : 25) && lim(5, apple ? 140 : 25) && lim(6, apple ? 160 : 90),
              `${n} ${route} repeat 3: gaps ca-ca ${gp[0]}/${gp[1]}, ca->meaning ${gp[2]}, meaning->example ${gp[3]}, ca sĩ-ca sĩ ${gp[4]}/${gp[5]}, ca sĩ->meaning ${gp[6]} ms`);
            if (!apple && route === 'review') console.log(`${n} ca repeat 3 gaps (ms): ${gp.join(', ')}`);
          }
          if (route === 'review' && !apple) ok(full.filter(x => x.text === 'ca').length === rep && full.filter(x => x.text === 'ca sĩ').length === rep && full.filter(x => x.lang === 'ko-KR').length === 2, `${n} ${route} repeat ${rep}: Vietnamese x${rep}, each meaning once`);
        }
        // ---- mute matrix (repeat 2, whole card) ----
        for (const mute of ['', 'vi', 'meaning', 'both']) {
          await E(`window.__hv.setting('${mute}', 2, false)`);
          await E('window.__tts.length=0; document.getElementById("flash-replay").click()'); await sleep(150);
          const want = plan('ca', 'ko', 2, mute, true);
          if (want.length) await wait(`window.__tts.filter(x=>x.ev==='end').length>=${want.length}`);
          await sleep(500);
          const got = spoken(await E('window.__tts.slice()', false));
          ok(eq(got, want), `${n} ${route} mute "${mute || 'none'}": ${fmt(got) || '(nothing)'}`);
        }
        // ---- auto advance: the card before "ca" -> ca: front, 1 s, back (meaning, example, example meaning), THEN the next card ----
        if (route === 'review' || !apple) {
          for (const rep of [1, 2]) {
            await E(`window.__hv.setting('both', 1, false)`);
            await E(`window.__hv.seek('ca')`);
            await E(`document.getElementById('flash-prev').click()`); await sleep(100);
            await E(`window.__hv.setting('', ${rep}, true)`);
            const before = await E('window.__hv.front()', false);
            await E('window.__tts.length=0; window.__t0=Date.now(); document.getElementById("flash-next").click()');
            // wait for the card to change away from "ca" again (the whole plan has been said)
            let moved = false; const t0 = Date.now();
            while (Date.now() - t0 < 30000) { const f = await E('window.__hv.front()', false); if (f !== 'ca' && f !== before) { moved = true; break; } await sleep(30); }
            const movedAt = Date.now();
            const log = await E('window.__tts.slice()', false);
            const idxCa = log.findIndex(x => x.ev === 'speak' && x.text === 'ca');
            const run = log.filter(x => x.ev === 'speak');
            const sp = spoken(log), want = plan('ca', 'ko', rep, '', true);
            // the first speech belongs to the card before "ca"? no: it was only navigated TO; its own front is "ca"
            ok(moved && eq(sp.slice(0, want.length), want), `${n} ${route} auto, repeat ${rep}: ca → 노래 → ca sĩ → 가수 as one card: ${fmt(sp.slice(0, want.length + 2))}`);
            const ends = log.filter(x => x.ev === 'end'), lastEnd = ends[want.length - 1];
            const cancelledWhilePlaying = log.slice(0, log.findIndex(x => x.ev === 'end' && x === lastEnd) + 1).some(x => x.ev === 'cancel' && x.playing);
            ok(lastEnd && !cancelledWhilePlaying, `${n} ${route} auto, repeat ${rep}: nothing cut off before the example meaning ended`);
            // the 자동 넘김 pause (1 s) sits between the front and the meaning, as before; the card changes only after the last end
            const frontEnd = ends[rep - 1], meaning = run[rep];
            ok(frontEnd && meaning && meaning.t - frontEnd.t >= 800, `${n} ${route} auto, repeat ${rep}: 1 s pause between the question and the answer (${meaning && frontEnd ? meaning.t - frontEnd.t : '?'} ms)`);
            ok(lastEnd && (apple || movedAt >= lastEnd.t - 5), `${n} ${route} auto, repeat ${rep}: the next card comes after the last utterance ended`);
          }
        }
        // ---- manual next in the middle of the example ----
        if (route === 'review') {
          await E(`window.__hv.setting('both', 1, false)`); await E(`window.__hv.seek('ca')`);
          await E(`window.__hv.setting('', 3, false)`);
          if (!(await E('window.__hv.back()', false))) { await E('window.__hv.flip()'); await sleep(50); }
          await E('window.__tts.length=0; document.getElementById("flash-replay").click()');
          await wait(`window.__tts.filter(x=>x.ev==='speak'&&x.text==='ca sĩ').length>=1`);
          await E('window.__tts.push({ev:"mark",t:Date.now()}); document.getElementById("flash-next").click()');
          const markT = (await E('window.__tts.find(x=>x.ev==="mark").t', false));
          await sleep(apple ? 2500 : 1800);
          const after = (await E('window.__tts.slice()', false)).filter(x => x.ev === 'speak' && x.t > markT + 20);
          ok(!after.some(x => x.text === 'ca sĩ' || x.text === '가수'), `${n}: a manual next in the example cancels the rest (later: ${after.map(x => x.text).join(' / ') || 'nothing'})`);
        }
        ok(!errs.length, `${n} ${route}: errors ${errs.join(' | ').slice(0, 300)}`);
      }

      // ---------- other words, other learner languages (review route, whole card, repeat 2) ----------
      if (apple) continue;
      const sample = ['ca', 'đa', ...audit.words.filter((_, i) => i % 53 === 7).map(w => w.word)].filter((w, i, a) => a.indexOf(w) === i).slice(0, 7);
      for (const loc of ['ko', 'ja', 'en', 'zh', 'cs', 'hu', 'id', 'zh_cn']) {
        await load(prof, {'vn-app-auto-adv': JSON.stringify({enabled: false, nextOnCorrect: false, seconds: 1})});
        await E(`window.setLang('${loc}')`, false); await sleep(250);
        await E('window.__hv.openReview()');
        await E(`window.__hv.setting('both', 1, false)`);
        const got = [];
        for (const word of sample) {
          const found = await E(`window.__hv.seek(${JSON.stringify(word)})`);
          ok(found, `${loc}: the card "${word}" is in the deck`);
          if (!found) continue;
          await E(`window.__hv.setting('', 2, false)`);
          if (await E('window.__hv.back()', false)) { await E('window.__hv.flip()'); await sleep(60); }
          await E('window.__tts.length=0; window.__hv.flip()'); await sleep(100);
          const w = plan(word, loc, 2, '', false);
          await wait(`window.__tts.filter(x=>x.ev==='end').length>=${w.length}`); await sleep(300);
          const flip = spoken(await E('window.__tts.slice()', false));
          ok(eq(flip, w), `${loc} "${word}" back: ${fmt(flip)}  (want ${fmt(w)})`);
          const shown = await E(`(()=>{const e=document.querySelector('#flash-kr .study-flash-example');return e?[...e.children].map(c=>c.textContent):null;})()`, false);
          const wantShown = [W[word].example].concat(W[word].example_mean && W[word].example_mean[loc] ? [clean(W[word].example_mean[loc]).replace(/, /g, '/')] : []);
          if (loc === 'ko' && word === 'đa') ok(shown && shown[1] === '다과(多科)·종합진료', `ko "đa": the example reads "다과(多科)·종합진료" on the card: ${JSON.stringify(shown)}`);
          const shownKr = (shown && shown[1] || '').replace(/\([^)]*\)/g, '').replace(/\s+/g, '');
          ok(shown && shown[0] === W[word].example && shownKr === ((W[word].example_mean && W[word].example_mean[loc]) || '').replace(/\s+/g, ''), `${loc} "${word}": the card shows its example ${JSON.stringify(shown)}`);
          await E('window.__tts.length=0; document.getElementById("flash-replay").click()'); await sleep(100);
          const wf = plan(word, loc, 2, '', true);
          await wait(`window.__tts.filter(x=>x.ev==='end').length>=${wf.length}`); await sleep(300);
          const full = spoken(await E('window.__tts.slice()', false));
          ok(eq(full, wf), `${loc} "${word}" whole card: ${fmt(full)}  (want ${fmt(wf)})`);
          ok(full.every(x => x.lang === 'vi-VN' || x.lang === TAG[loc]) && (loc !== 'cs' || !full.some(x => x.lang === 'ko-KR')), `${loc} "${word}": only Vietnamese and ${TAG[loc]} (no other language)`);
          got.push(word + ':' + full.length);
          await E(`window.__hv.setting('both', 1, false)`);
        }
        if (loc === 'cs') ok(plan('ca', 'cs', 1, '', true).length === 4 && plan('ca', 'cs', 1, '', true).every(x => x.lang === 'vi-VN' || x.lang === 'cs-CZ'), 'cs: headword, meaning, example, example meaning -- all in Czech now');
        console.log(`${loc}: ${got.join(' ')}`);
        ok(!errs.length, `${loc}: errors ${errs.join(' | ').slice(0, 300)}`);
        errs = [];
      }
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.slice(0, 40).forEach(f => console.error('  [FAIL] ' + f)); console.error('--- HANJA VOCAB TTS TEST FAILED (' + failures.length + ') ---'); process.exit(1); }
  console.log('--- HANJA VOCAB TTS TEST PASSED ---');
})();
