// [노래] the REAL music of one lyric line (run build_app.py / assemble_app.py first), jw.org's official audio + official markers -- never TTS.
// Mocked: jw.org's media API (fetch), the <audio> element (Audio) and the speech engine, so nothing leaves the machine:
//   - ▶ ↻ exist only where the language's marker count equals the singable lines on screen (no timing is guessed, no TTS stands in)
//   - ▶ seeks to the line's own marker of the right language's file, plays and stops at its end; no speechSynthesis call
//   - ↻ plays the same part again and again until stopped; the button says so (aria-pressed)
//   - another line / a TTS button / a tab move / the page hidden ends it at once; song-chorus lines keep their own marker (occurrence index)
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8986;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
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


const MOCK = `(() => {
  const SING = t => { t = String(t || '').trim(); return !!t && !/^\\s*(\\(.*\\)|（.*）|[\\[【].*[\\]】]|\\d+\\s*[.．。]?|[※＊*].*)\\s*$/.test(t); };
  const cfg = window.__segCfg = {skew: {}, none: {}, dur: 0.4, step: 0.5};   // skew['pub:track:code'] = +n markers; none[...] = no file
  const realFetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const m = /pub-media\\/GETPUBMEDIALINKS.*pub=(\\w+)&track=(\\d+)&langwritten=(\\w+)/.exec(String(u));
    if (!m) return realFetch(u, o);
    const [, pub, track, code] = m, key = pub + ':' + track + ':' + code;
    window.__segFetch = (window.__segFetch || []).concat(key);
    const kind = pub === 'sjjm' ? 'kingdom' : pub === 'osg' ? 'original' : 'children';
    const bkey = kind === 'kingdom' ? track : pub === 'osg' ? 'osg-' + track : pub === 'pkon' ? 'pkon-' + track : 'pk-special-0';
    const box = document.querySelector('[data-seg-kind="' + kind + '"][data-seg-key="' + bkey + '"]');
    const sel = code === 'VT' ? '.lyric-vi-row .lyric-vi' : '.lyric-target-row .lyric-target';
    const n = box ? [...box.querySelectorAll(sel)].filter(e => SING(e.textContent)).length : 0;
    if (cfg.none[key] || !n) return Promise.resolve({ok: true, json: () => Promise.resolve({files: {}})});
    const cnt = n + (cfg.skew[key] || 0), marks = [];
    for (let i = 0; i < cnt; i++) { const st = 1 + cfg.step * i; const f = x => { const h = Math.floor(x / 3600), mi = Math.floor(x % 3600 / 60), s = x % 60; return String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0') + ':' + s.toFixed(3).padStart(6, '0'); };
      marks.push({startTime: f(st), duration: f(cfg.dur), mepsParagraphId: 4 + i}); }
    const files = {}; files[code] = {MP3: [{file: {url: 'https://cfp2.jw-cdn.org/a/t/' + pub + '_' + code + '_' + track + '.mp3'}, markers: {markers: marks}, duration: 300}]};
    return Promise.resolve({ok: true, json: () => Promise.resolve({files})});
  };
  window.__aud = [];
  window.Audio = function () {
    const L = {}; let t = 0, since = 0, src = '', attrs = {};
    const a = { paused: true, muted: false, readyState: 0, ended: false, preload: '', onerror: null,
      get src() { return src; }, set src(v) { src = v; a.readyState = 0; window.__aud.push({ev: 'src', v, t: Date.now()}); setTimeout(() => { a.readyState = 4; (L.loadedmetadata || []).slice().forEach(f => f()); }, 15); },
      get currentTime() { return a.paused ? t : t + (performance.now() - since) / 1000; },
      set currentTime(v) { t = v; since = performance.now(); window.__aud.push({ev: 'seek', v, t: Date.now()}); setTimeout(() => (L.seeked || []).slice().forEach(f => f()), 5); },
      play() { window.__aud.push({ev: 'play', muted: a.muted, t: Date.now()}); if (a.paused) { a.paused = false; since = performance.now(); } return Promise.resolve(); },
      pause() { if (!a.paused) { t = a.currentTime; a.paused = true; window.__aud.push({ev: 'pause', at: t, t: Date.now()}); } },
      addEventListener(n, f) { (L[n] = L[n] || []).push(f); }, removeEventListener(n, f) { L[n] = (L[n] || []).filter(x => x !== f); },
      setAttribute(k, v) { attrs[k] = v; }, getAttribute(k) { return attrs[k] == null ? null : attrs[k]; } };
    window.__audio = a; return a;
  };
})();`;
const failures = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) failures.push(m); };
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'song-seg-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable'); await cdp.send('Network.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 1000, deviceScaleFactor: 1, mobile: false});
    await cdp.send('Network.setUserAgentOverride', {userAgent: UA});
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: engine(true) + MOCK});
    const errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '').slice(0, 160)));
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); if (r.exceptionDetails) errs.push('eval ' + ((r.exceptionDetails.exception || {}).description || '').slice(0, 200)); return r.result.value; };
    for (const lang of ['ko', 'ja']) {
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(800);
      await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
      await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1}); await sleep(150);
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const o={};const lang=${JSON.stringify(lang)};
        window.setLang(lang);await sleep(300);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(900);
        const tts=()=>window.__tts.filter(x=>x.ev==='speak').length, aud=()=>window.__aud;
        const box=()=>document.querySelector('[data-seg-kind="kingdom"]');
        const btns=(sel)=>[...(box()||document).querySelectorAll('.song-seg-btn'+(sel||''))];
        // 1. kingdom song 1: buttons on vi and target rows (the mock gives exactly as many markers as singable lines)
        const rowsVi=[...box().querySelectorAll('.lyric-vi-row')].filter(r=>r.querySelector('.song-seg-btn')).length;
        o.viRows=rowsVi; o.tgtRows=[...box().querySelectorAll('.lyric-target-row')].filter(r=>r.querySelector('.song-seg-btn')).length;
        o.fetched=(window.__segFetch||[]).slice();
        o.ids=btns('[data-seg="play"][data-seg-id$="|vi"]').map(b=>b.dataset.segI).join(',');
        // 2. one play of vi line 3 (index 2): its own marker (start 1+0.5*2 = 2.0 s), ends at its end (2.4 s), no TTS
        const b3=btns('[data-seg="play"][data-seg-id$="|vi"]')[2]; const t0=tts(); aud().length=0;
        b3.click(); await sleep(900);
        o.play=aud().map(x=>x.ev+(x.v!==undefined?':'+(typeof x.v==='number'?x.v.toFixed(2):x.v.split('/').pop()):'')+(x.at!==undefined?':'+x.at.toFixed(2):''));
        o.ttsAfterPlay=tts()-t0; o.pressedAfter=document.querySelectorAll('.song-seg-btn.is-playing').length;
        // 3. repeat of line 2 (index 1): same part again and again, aria-pressed while it runs
        aud().length=0; const l2=btns('[data-seg="loop"][data-seg-id$="|vi"]')[1]; l2.click(); await sleep(1700);
        o.loopPressed=l2.getAttribute('aria-pressed'); o.loopSeeks=aud().filter(x=>x.ev==='seek').map(x=>x.v.toFixed(2)); o.unit=!!l2.closest('.lyric-unit').classList.contains('song-seg-active');
        // 4. another line while looping: the loop ends at once, only the new line follows
        aud().length=0; btns('[data-seg="play"][data-seg-id$="|vi"]')[5].click(); await sleep(150);
        o.afterSwitch={pressed:l2.getAttribute('aria-pressed'),seeks:aud().filter(x=>x.ev==='seek').map(x=>x.v.toFixed(2))}; await sleep(900);
        // 5. stop with the same button, then tab move ends a loop
        const l4=btns('[data-seg="loop"][data-seg-id$="|vi"]')[3]; l4.click(); await sleep(700); l4.click(); await sleep(100);
        o.stopBtn={pressed:l4.getAttribute('aria-pressed'),paused:window.__audio.paused};
        btns('[data-seg="loop"][data-seg-id$="|vi"]')[3].click(); await sleep(500);
        const sw=document.querySelector('.subtab-btn[data-sentence="pdf"]'); sw.click(); await sleep(200);
        o.afterTab={paused:window.__audio.paused,pressed:document.querySelectorAll('.song-seg-btn[aria-pressed="true"]').length};
        document.querySelector('.subtab-btn[data-sentence="song"]').click(); await sleep(700);
        // TTS button ends the music (and the music ends TTS)
        btns('[data-seg="loop"][data-seg-id$="|vi"]')[0].click(); await sleep(400);
        const sp=[...box().querySelectorAll('.speak-btn[data-speak]')][4]; const tb=tts(); sp.click(); await sleep(1800);
        o.ttsEndsMusic={paused:window.__audio.paused,tts:tts()-tb,log:(window.__ttsDebug||[]).slice(-4)};
        // page hidden ends a loop
        btns('[data-seg="loop"][data-seg-id$="|vi"]')[0].click(); await sleep(400);
        Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true}); document.dispatchEvent(new Event('visibilitychange')); await sleep(100);
        o.afterHidden=window.__audio.paused; Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
        // 6. song 2 has repeated choruses: every sung line keeps its own marker index
        const nums=[...document.querySelectorAll('#curr-songs-root .song-list-row')]; const r2=nums.find(r=>r.dataset.songNum==='2'); if(r2){ r2.click(); await sleep(900);} 
        const v2=btns('[data-seg="play"][data-seg-id$="|vi"]'); o.song2={n:v2.length, idx:v2.map(b=>+b.dataset.segI), unique:new Set(v2.map(b=>b.dataset.segI)).size};
        return o;})()`);
      const tag = `kingdom ${lang}`;
      ok(r.viRows >= 12 && r.viRows === r.song2 ? false : r.viRows >= 12, `${tag}: a ▶ ↻ pair on every singable Vietnamese line (${r.viRows})`);
      if (lang === 'ko') ok(r.tgtRows === r.viRows, `${tag}: and on every target line (${r.tgtRows} / ${r.viRows})`);
      ok((r.fetched || []).some(x => x.startsWith('sjjm:1:VT')) && (lang === 'ko' ? r.fetched.some(x => x.startsWith('sjjm:1:KO')) : r.fetched.some(x => x.startsWith('sjjm:1:J'))), `${tag}: each language asked for its own recording ${JSON.stringify(r.fetched)}`);
      ok(r.ids === Array.from({length: r.viRows}, (_, i) => i).join(','), `${tag}: marker index = lyric occurrence order ${r.ids}`);
      ok(r.play[0].startsWith('src:') && r.play[0].includes('sjjm_VT_1.mp3'), `${tag}: the Vietnamese line plays the Vietnamese file ${JSON.stringify(r.play)}`);
      ok(r.play.some(x => x === 'seek:1.96'), `${tag}: seeks to the line's own marker (2.0 s - pre-roll) ${JSON.stringify(r.play)}`);
      const pz = r.play.find(x => x.startsWith('pause:'));
      ok(pz && Math.abs(parseFloat(pz.split(':')[1]) - 2.4) < 0.12, `${tag}: stops at the end of the marker (2.4 s) ${pz}`);
      ok(r.ttsAfterPlay === 0, `${tag}: no speech at all (${r.ttsAfterPlay})`);
      ok(r.pressedAfter === 0, `${tag}: a single play ends by itself (${r.pressedAfter} still marked)`);
      ok(r.loopPressed === 'true' && r.unit, `${tag}: the repeat button shows it runs (aria-pressed ${r.loopPressed}, unit marked ${r.unit})`);
      ok(r.loopSeeks.length >= 2 && r.loopSeeks.every(x => x === '1.46'), `${tag}: the same part again and again ${JSON.stringify(r.loopSeeks)}`);
      ok(r.afterSwitch.pressed === 'false' && r.afterSwitch.seeks.length >= 1 && r.afterSwitch.seeks.every(x => x === '3.46'), `${tag}: another line ends the loop at once and plays only itself ${JSON.stringify(r.afterSwitch)}`);
      ok(r.stopBtn.pressed === 'false' && r.stopBtn.paused, `${tag}: the same button stops the repeat ${JSON.stringify(r.stopBtn)}`);
      ok(r.afterTab.paused && r.afterTab.pressed === 0, `${tag}: a tab move ends the music ${JSON.stringify(r.afterTab)}`);
      ok(r.afterHidden === true, `${tag}: the page going hidden ends the music`);
      ok(r.ttsEndsMusic.paused && r.ttsEndsMusic.tts >= 1, `${tag}: a speech button ends the music and speaks ${JSON.stringify(r.ttsEndsMusic)}`);
      ok(r.song2.n >= 20 && r.song2.unique === r.song2.n && r.song2.idx.every((x, i) => x === i), `${tag}: song 2 (repeated chorus) keeps one index per sung line ${JSON.stringify(r.song2)}`);
      ok(!errs.length, `${tag}: errors ${errs.join(' | ').slice(0, 300)}`); errs.length = 0;
    }
    // collections 2 and 3, a mismatch and a missing recording: no button and no speech
    await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
    for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
    await sleep(800);
    await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
    await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1}); await sleep(150);
    const q = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const o={};window.setLang('ko');await sleep(300);const tts0=window.__tts.filter(x=>x.ev==='speak').length;
      document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(800);
      const tabs=[...document.querySelectorAll('.song-kind-tabs [role="tab"]')];
      window.__segCfg.skew['osg:1:KO']=1;   // the Korean recording of original 1 has one marker too many
      window.__segCfg.none['pkon:1:VT']=true;
      tabs[1].click();await sleep(400);const oroot=document.getElementById('song-original-root');
      oroot.querySelector('.song-acc[data-song-id="osg-1"] .song-acc-head').click();await sleep(1000);
      const ob=oroot.querySelector('.song-acc[data-song-id="osg-1"]'); o.osg1={vi:ob.querySelectorAll('.lyric-vi-row .song-seg-btn').length, ko:ob.querySelectorAll('.lyric-target-row .song-seg-btn').length, rows:ob.querySelectorAll('.song-lyric-line').length};
      oroot.querySelector('.song-acc[data-song-id="osg-116"] .song-acc-head').click();await sleep(1000);
      const o116=oroot.querySelector('.song-acc[data-song-id="osg-116"]'); o.osg116={vi:o116.querySelectorAll('.lyric-vi-row .song-seg-btn').length, ko:o116.querySelectorAll('.lyric-target-row .song-seg-btn').length};
      tabs[2].click();await sleep(400);const kroot=document.getElementById('song-kids-root');
      for (const id of ['pk-special-0','pkon-1','pkon-35']) { kroot.querySelector('.song-acc[data-song-id="'+id+'"] .song-acc-head').click(); await sleep(1000); }
      const cnt=(id,s)=>kroot.querySelector('.song-acc[data-song-id="'+id+'"]').querySelectorAll(s).length;
      o.kids={sp0:{vi:cnt('pk-special-0','.lyric-vi-row .song-seg-btn'),ko:cnt('pk-special-0','.lyric-target-row .song-seg-btn')}, p1:{vi:cnt('pkon-1','.lyric-vi-row .song-seg-btn'),ko:cnt('pkon-1','.lyric-target-row .song-seg-btn')}, p35:{vi:cnt('pkon-35','.lyric-vi-row .song-seg-btn'),ko:cnt('pkon-35','.lyric-target-row .song-seg-btn')}};
      o.tts=window.__tts.filter(x=>x.ev==='speak').length-tts0; o.ttsTexts=window.__tts.filter(x=>x.ev==='speak').map(x=>x.text.slice(0,30)); o.overflow=document.documentElement.scrollWidth>innerWidth;
      return o;})()`);
    ok(q.osg1.rows > 0 && q.osg1.ko === 0, `original 1: the Korean recording with a wrong marker count has no button (no timing guessed) ${JSON.stringify(q.osg1)}`);
    ok(q.osg116.vi > 0 && q.osg116.ko > 0, `original 116: both languages ${JSON.stringify(q.osg116)}`);
    ok(q.kids.p1.vi === 0 && q.kids.p1.ko > 0, `children 1: the missing Vietnamese recording gives no button, no speech stands in ${JSON.stringify(q.kids.p1)}`);
    ok(q.kids.sp0.vi > 0 && q.kids.p35.vi > 0, `children special 0 / 35 ${JSON.stringify(q.kids)}`);
    ok(q.tts === 0, `no speech was used anywhere (${q.tts}) ${JSON.stringify(q.ttsTexts)}`);
    ok(!q.overflow, 'no horizontal overflow');
    // widths: no overlap between a line's text and its buttons, no horizontal overflow
    await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
    for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
    await sleep(800);
    await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang('ko');await sleep(300);document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(1200);return 1})()`);
    for (const w of [320, 390, 820, 1280]) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {width: w, height: 900, deviceScaleFactor: 1, mobile: w < 500});
      await sleep(400);
      const g = await E(`(()=>{const hit=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;let overlap=0,rows=0;
        document.querySelectorAll('.lyric-vi-row, .lyric-target-row').forEach(r=>{const items=[...r.children].map(c=>c.getBoundingClientRect());if(!r.querySelector('.song-seg-btn'))return;rows++;
          for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++)if(hit(items[i],items[j]))overlap++;});
        return {rows,overlap,overflow:document.documentElement.scrollWidth>innerWidth,textW:Math.round(document.querySelector('.lyric-vi-row .lyric-vi').getBoundingClientRect().width)};})()`);
      ok(g.rows > 0 && g.overlap === 0 && !g.overflow, `width ${w}: buttons beside the text, nothing overlaps, no horizontal overflow ${JSON.stringify(g)}`);
    }
    ok(!errs.length, `errors ${errs.join(' | ').slice(0, 300)}`);
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- SONG AUDIO SEGMENTS TEST FAILED ---'); process.exit(1); }
  console.log('--- SONG AUDIO SEGMENTS TEST PASSED ---');
})();
