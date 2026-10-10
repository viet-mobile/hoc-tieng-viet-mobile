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
  // cfg.none['pub:track:code'] = that recording does not exist; cfg.skew[...] = +n sung markers; cfg.noMarkers[...]; cfg.interlude[...] = one
  // line holds a 40 s interlude; cfg.seekTo = where a seek lands instead of its target (a broken seek); cfg.nomarks99 = no pid-99 markers
  const cfg = window.__segCfg = {none: {}, skew: {}, noMarkers: {}, interlude: {}, outro99: {}, dropPid: {}, doubleLine: {}, mp3Zero: {}, video: {}, seekTo: null, dur: 0.4, step: 0.5};
  const realFetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    if(String(u).includes('/apis/mediator/')) {
      const mm = /media-items\\/(\\w+)\\/(pub-[a-z0-9_]+_VIDEO)/.exec(String(u)), v = mm && cfg.video[mm[2] + ':' + mm[1]];
      if (!v) return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({media:[]})});
      const [, code, key] = mm;
      return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({language:{languageCode:code},media:[{languageAgnosticNaturalKey:key,naturalKey:key+'_'+code+'_r360P',title:'t',duration:300,
        files:[{label:'360p',mimetype:'video/mp4',checksum:'vid1',duration:300,progressiveDownloadURL:'https://cfp2.jw-cdn.org/v/'+key+'_'+code+'.mp4',subtitles:v.vtt?{url:'https://cfp2.jw-cdn.org/vtt/'+key+'/'+code+'.vtt'}:null}]}]})});
    }
    if(String(u).includes('/vtt/')) {
      const mm = /vtt\\/(pub-[a-z0-9_]+_VIDEO)\\/(\\w+)\\.vtt/.exec(String(u)), v = cfg.video[mm[1] + ':' + mm[2]], key = mm[1], code = mm[2];
      const pub = key.split('_')[0].slice(4), track = key.split('_')[1];
      const kind = pub === 'osg' ? 'original' : 'children', bkey = pub === 'osg' ? 'osg-' + track : pub === 'pkon' ? 'pkon-' + track : 'pk-special-0';
      const box = document.querySelector('[data-seg-kind="' + kind + '"][data-seg-key="' + bkey + '"]');
      const sel = code === 'VT' ? '.lyric-vi-row .lyric-vi' : '.lyric-target-row .lyric-target';
      const texts = box ? [...box.querySelectorAll(sel)].filter(e => SING(e.textContent)).map(e => e.textContent.trim()) : [];
      const f = x => { const h = Math.floor(x / 3600), mi = Math.floor(x % 3600 / 60), s = x % 60; return String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0') + ':' + s.toFixed(3).padStart(6, '0'); };
      let t = v.start, out = 'WEBVTT\\r\\n\\r\\n', i = 0;
      while (i < texts.length) { const g = (v.groups || []).find(g => g[0] === i); const n = g ? g.length : 1; const lines = texts.slice(i, i + n).map((x, k) => (v.alter || {})[i + k] || x);
        if ((v.split || []).includes(i)) { const w = lines[0].split(' '), h = Math.ceil(w.length / 2);   // the subtitle shows this page line as two cues
          out += f(t) + ' --> ' + f(t + v.dur) + ' line:90% position:50% align:center\\r\\n' + w.slice(0, h).join(' ') + '\\r\\n\\r\\n'; t += v.dur + 0.1;
          out += f(t) + ' --> ' + f(t + v.dur) + ' line:90% position:50% align:center\\r\\n' + w.slice(h).join(' ') + '\\r\\n\\r\\n'; t += v.dur + 0.1; i += 1; continue; }
        out += f(t) + ' --> ' + f(t + v.dur * n) + ' line:90% position:50% align:center\\r\\n' + lines.join('\\r\\n') + '\\r\\n\\r\\n'; t += v.dur * n + 0.1; i += n; }
      return Promise.resolve({ok:true,status:200,text:()=>Promise.resolve(out)});
    }
    const m = /pub-media\\/GETPUBMEDIALINKS.*pub=(\\w+)&track=(\\d+)&langwritten=(\\w+)/.exec(String(u));
    if (!m) return realFetch(u, o);
    const [, pub, track, code] = m, key = pub + ':' + track + ':' + code;
    window.__segFetch = (window.__segFetch || []).concat(key);
    const kind = pub === 'sjjc' || pub === 'pksjj' || pub === 'sjjm' || pub === 'sjji' ? 'kingdom' : pub === 'osg' ? 'original' : 'children';
    const bkey = kind === 'kingdom' ? track : pub === 'osg' ? 'osg-' + track : pub === 'pkon' ? 'pkon-' + track : 'pk-special-0';
    const box = document.querySelector('[data-seg-kind="' + kind + '"][data-seg-key="' + bkey + '"]');
    const sel = code === 'VT' ? '.lyric-vi-row .lyric-vi' : '.lyric-target-row .lyric-target';
    const n = box ? [...box.querySelectorAll(sel)].filter(e => SING(e.textContent)).length : 0;
    // the Meetings edition exists everywhere (it must never be chosen); sjjc / pksjj exist unless cfg.none says otherwise; by default
    // the children's recording has no markers (as on jw.org) and sjjc has markers
    const exists = pub === 'sjjm' ? true : !cfg.none[key] && n > 0 && !(pub === 'pksjj' && cfg.none['pksjj:*']);
    if (!exists) return Promise.resolve({ok: true, json: () => Promise.resolve({files: {}})});
    const f = x => { const h = Math.floor(x / 3600), mi = Math.floor(x % 3600 / 60), s = x % 60; return String(h).padStart(2, '0') + ':' + String(mi).padStart(2, '0') + ':' + s.toFixed(3).padStart(6, '0'); };
    let markers = null;
    const hasMarkers = pub === 'pksjj' ? !!cfg.pksjjMarkers : !cfg.noMarkers[key];
    if (hasMarkers) {
      const cnt = n + (cfg.skew[key] || 0); markers = []; let t = cfg.mp3Zero[key] ? 0 : 1 + (pub === 'sjjm' ? 100 : 0);   // sjjm times are far away: a wrong source is visible
      for (let i = 0; i < cnt; i++) {
        if (i === 2 && !cfg.nomarks99 && kind === 'kingdom') { markers.push({startTime: f(t), duration: f(3), mepsParagraphId: 99}); t += 3; }   // an interlude (non-vocal) between line 2 and 3
        const d = (cfg.interlude[key] && i === 1) ? 40 : (cfg.doubleLine[key] === i ? cfg.dur * 2.2 : cfg.dur);
        if (cfg.dropPid[key] !== 4 + i) markers.push({startTime: f(t), duration: f(d), mepsParagraphId: 4 + i});   // dropPid: the recording has no marker of that paragraph
        t += d; t = Math.round((t + (cfg.step - cfg.dur)) * 1000) / 1000;
      }
      if (kind === 'kingdom' || cfg.outro99[key]) markers.push({startTime: f(t), duration: f(2), mepsParagraphId: 99});   // the outro
    }
    // Synthetic same-recording paragraph proof: only for the mocked player test.
    const locale = code === 'VT' ? 'vi' : ({KO:'ko',J:'ja',E:'en'})[code];
    const texts = box ? [...box.querySelectorAll(sel)].filter(e => SING(e.textContent)).map(e => e.textContent.normalize('NFC').replace(/[‘’]/g, String.fromCharCode(39)).replace(/[“”]/g,String.fromCharCode(34)).replace(/^\\s*\\d+[.．。]\\s*/, '').replace(/\\s+/g,' ').trim()) : [];
    const proof = (markers || []).map((m,i) => ({s:0,e:0,m:i,pid:m.mepsParagraphId})).filter(m => m.pid !== 99);
    const toMs = x => { const [h,m,se]=x.split(':').map(Number);return Math.round((h*3600+m*60+se)*1000); };
    proof.forEach((m,i) => { m.s=toMs(markers[m.m].startTime);m.e=m.s+toMs(markers[m.m].duration);m.text=texts[i];m.enabled=true;if(cfg.interlude[key]&&i===1){m.enabled=false;m.long=40;} });
    if(kind==='kingdom' && typeof KINGDOM_VOCAL_SEGMENTS !== 'undefined') KINGDOM_VOCAL_SEGMENTS[track+'|'+locale]={mediaKey:'pub-'+pub+'_'+track+'_AUDIO',checksum:'fixture',documentId:123,signature:(markers||[]).map(m=>[m.startTime,m.duration,m.mepsParagraphId]),lines:proof};
    const files = {}; files[code] = {MP3: [{pub,track:+track,file: {checksum:'fixture',url: 'https://cfp2.jw-cdn.org/a/t/' + pub + '_' + code + '_' + track + '.mp3'}, markers: markers ? {markers,hash:'fixture',documentId:123,mepsLanguageSpoken:code,mepsLanguageWritten:code} : null, duration: 300}]};
    return Promise.resolve({ok: true, json: () => Promise.resolve({files})});
  };
  // an <audio> that behaves like a streamed MP3: metadata 15 ms after load(), seekable over the whole file then, a seek lands 5 ms later
  // (at cfg.seekTo when set: a broken seek), currentTime advances in real time while playing; everything is logged into window.__aud
  window.__aud = [];
  window.Audio = function () {
    const L = {}; let t = 0, since = 0, src = ''; let loaded = false;
    const fire = n => (L[n] || []).slice().forEach(f => f());
    const a = { paused: true, muted: false, readyState: 0, ended: false, preload: '', onerror: null,
      get src() { return src; }, set src(v) { src = v; loaded = false; a.readyState = 0; t = 0; window.__aud.push({ev: 'src', v, t: Date.now()}); },
      load() { window.__aud.push({ev: 'load', t: Date.now()}); setTimeout(() => { if (loaded) return; loaded = true; a.readyState = 1; fire('loadedmetadata'); setTimeout(() => { a.readyState = 4; fire('canplay'); fire('progress'); }, 10); }, 15); },
      get seekable() { return loaded ? {length: 1, start: () => 0, end: () => 300} : {length: 0}; },
      get currentTime() { return a.paused ? t : t + (performance.now() - since) / 1000; },
      set currentTime(v) { if (!loaded) { window.__aud.push({ev: 'seek-before-metadata', v, t: Date.now()}); t = 0; return; }
        const land = cfg.seekTo != null ? cfg.seekTo : v; t = land; since = performance.now(); window.__aud.push({ev: 'seek', v, land, t: Date.now()}); setTimeout(() => fire('seeked'), 5); },
      play() { window.__aud.push({ev: 'play', at: a.currentTime, ready: a.readyState, t: Date.now()}); if (!loaded) return Promise.reject(new Error('not loaded'));
        if (a.paused) { a.paused = false; since = performance.now(); } return Promise.resolve(); },
      pause() { if (!a.paused) { t = a.currentTime; a.paused = true; window.__aud.push({ev: 'pause', at: t, t: Date.now()}); } },
      addEventListener(n, f) { (L[n] = L[n] || []).push(f); }, removeEventListener(n, f) { L[n] = (L[n] || []).filter(x => x !== f); } };
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
    // the data's user-supplied children tables (manualChildrenOverride) go through jw.org's mediator, which this mock does not serve: they are
    // dropped here so the kingdom cases exercise the shared source / marker / player logic with the mock's own proofs
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: engine(true) + "Object.defineProperty(window, 'KINGDOM_VI_VOCAL_SOURCE_MAP', {get(){return null;},set(){},configurable:true});" +
      "(function(){var store={};Object.defineProperty(window,'KINGDOM_VOCAL_SEGMENTS',{get(){return store;},set(v){for(var k in v){if(!v[k].manualChildrenOverride)store[k]=v[k];}},configurable:true});})();" + MOCK});
    const errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '').slice(0, 160)));
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); if (r.exceptionDetails) errs.push('eval ' + ((r.exceptionDetails.exception || {}).description || '').slice(0, 200)); return r.result.value; };
    let cfgScript = null;
    // the saved place keeps everything but the [노래] screen (a reload comes back to it; here every case must start on 왕국 노래 1 again):
    // a pagehide listener registered after the page's own removes it from what the page saves as it is left
    const FORGET_SONG_PLACE = () => E("window.addEventListener('pagehide', () => { try { const k = 'vn-app-last-place-v1', p = JSON.parse(localStorage.getItem(k)); delete p.songs; localStorage.setItem(k, JSON.stringify(p)); } catch (e) { /* none */ } }); 1").catch(() => 0);
    const NAV = async (cfgJs) => {
      if (cfgScript) { await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: cfgScript}); cfgScript = null; }
      if (cfgJs) cfgScript = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: cfgJs})).identifier;
      await FORGET_SONG_PLACE(); await cdp.send('Page.navigate', {url: 'about:blank'}); await new Promise(r => setTimeout(r, 200));   // the page saves the [노래] screen it leaves; these cases start on 왕국 노래 1 again
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(800);
      await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
      await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1}); await sleep(150);
    };
    // the mock's timeline of a song: line k (0-based, pid-99 markers left out) starts at 1 + 0.5k, plus a 3 s interlude before line 3
    const START = k => 1 + 0.5 * k + (k >= 2 ? 3 : 0), TGT = k => (START(k) - 0).toFixed(2);
    const OPEN = (lang, cfgJs) => `(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang(${JSON.stringify(lang)});await sleep(300);${cfgJs || ''}
      document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(900);
      const box=document.querySelector('[data-seg-kind="kingdom"]'); for(let i=0;i<40&&box&&!box.querySelector('.song-seg-btn');i++) await sleep(50); await sleep(100); return 1;})()`;
    const HELP = `const tts=()=>window.__tts.filter(x=>x.ev==='speak').length, aud=()=>window.__aud, box=()=>document.querySelector('[data-seg-kind="kingdom"]'),
      btns=(sel)=>[...(box()||document).querySelectorAll('.song-seg-btn'+(sel||''))], ev=()=>aud().map(x=>x.ev+(x.ev==='seek'?':'+x.v.toFixed(2)+'>'+x.land.toFixed(2):x.ev==='play'?':'+x.at.toFixed(2)+'/r'+x.ready:x.ev==='pause'?':'+x.at.toFixed(2):x.ev==='src'?':'+x.v.split('/').pop():'')),
      untilPaused=async(ms)=>{const t0=Date.now();while(Date.now()-t0<ms&&!(window.__audio&&window.__audio.paused)) await sleep(20);};`;
    for (const lang of ['ko', 'ja']) {
      await NAV();
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const o={};const lang=${JSON.stringify(lang)};await (${OPEN(lang)});${HELP}
        // 1. song 1: a ▶ ↻ pair on every singable line of each language, from the VOCALS recording (sjjc); the Meetings edition is never asked for
        o.viRows=[...box().querySelectorAll('.lyric-vi-row')].filter(r=>r.querySelector('.song-seg-btn')).length;
        o.tgtRows=[...box().querySelectorAll('.lyric-target-row')].filter(r=>r.querySelector('.song-seg-btn')).length;
        o.fetched=(window.__segFetch||[]).slice(); o.srcs=[...new Set(btns().map(b=>b.dataset.segSrc+'/'+b.dataset.segKey))];
        o.ids=btns('[data-seg="play"][data-seg-id$="|vi"]').map(b=>b.dataset.segI).join(','); o.markerIdx=btns('[data-seg="play"][data-seg-id$="|vi"]').map(b=>+b.dataset.segM);
        // 2. lines 1, 2, 3 in a row (▶ each, waiting for its end): three different parts, each played from its own seek, never from 0
        const t0=tts(); o.three=[];
        for (const k of [0,1,2]) { aud().length=0; btns('[data-seg="play"][data-seg-id$="|vi"]')[k].click(); await sleep(150); await untilPaused(3000); await sleep(50); o.three.push(ev()); }
        o.ttsAfterPlay=tts()-t0; o.pressedAfter=document.querySelectorAll('.song-seg-btn.is-playing').length;
        // 3. repeat of line 2: the same part again and again (seek, seeked, play each cycle), aria-pressed while it runs
        aud().length=0; const l2=btns('[data-seg="loop"][data-seg-id$="|vi"]')[1]; l2.click(); await sleep(2200);
        o.loopPressed=l2.getAttribute('aria-pressed'); o.loop=ev(); o.unit=!!l2.closest('.lyric-unit').classList.contains('song-seg-active');
        // 4. another line while looping: the loop ends at once, only the new line follows
        aud().length=0; btns('[data-seg="play"][data-seg-id$="|vi"]')[5].click(); await sleep(150);
        o.afterSwitch={pressed:l2.getAttribute('aria-pressed'),ev:ev()}; await untilPaused(3000);
        // 5. stop with the same button, then a tab move ends a loop
        const l4=btns('[data-seg="loop"][data-seg-id$="|vi"]')[3]; l4.click(); await sleep(700); l4.click(); await sleep(100);
        o.stopBtn={pressed:l4.getAttribute('aria-pressed'),paused:window.__audio.paused};
        l4.click(); await sleep(500);
        document.querySelector('.subtab-btn[data-sentence="pdf"]').click(); await sleep(200);
        o.afterTab={paused:window.__audio.paused,pressed:document.querySelectorAll('.song-seg-btn[aria-pressed="true"]').length};
        document.querySelector('.subtab-btn[data-sentence="song"]').click(); await sleep(700);
        // a speech button ends the music and speaks; the page going hidden ends the music
        btns('[data-seg="loop"][data-seg-id$="|vi"]')[0].click(); await sleep(400);
        const sp=[...box().querySelectorAll('.speak-btn[data-speak]')][4]; const tb=tts(); sp.click(); await sleep(1800);
        o.ttsEndsMusic={paused:window.__audio.paused,tts:tts()-tb};
        btns('[data-seg="loop"][data-seg-id$="|vi"]')[0].click(); await sleep(400);
        Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true}); document.dispatchEvent(new Event('visibilitychange')); await sleep(100);
        o.afterHidden=window.__audio.paused; Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true});
        // 6. song 2 has repeated choruses: every sung line keeps its own marker index
        // a song with a repeated chorus whose Vietnamese has no user-supplied children table (that path asks jw.org's mediator, not mocked here)
        const cand=SONGS_DATA.find(s=>s.number>1&&s.lines.some(l=>/ĐIỆP KHÚC/.test(l.vi||''))&&!((typeof KINGDOM_VOCAL_SEGMENTS!=='undefined'&&KINGDOM_VOCAL_SEGMENTS[s.number+'|vi'])||{}).manualChildrenOverride);
        const r2=[...document.querySelectorAll('#curr-songs-root .song-list-row')].find(r=>r.dataset.songNum===String(cand.number)); if(r2){ r2.click(); await sleep(900);}
        const v2=btns('[data-seg="play"][data-seg-id$="|vi"]'); o.song2={song:cand.number, n:v2.length, idx:v2.map(b=>+b.dataset.segI), unique:new Set(v2.map(b=>b.dataset.segM)).size, lines:cand.lines.filter(l=>l.vi&&l.vi.trim().charAt(0)!=='(').length};
        return o;})()`);
      if (!r || !r.fetched) throw Error(JSON.stringify({r,errs}));
      const tag = `kingdom ${lang}`;
      ok(r.viRows >= 12, `${tag}: a ▶ ↻ pair on every singable Vietnamese line (${r.viRows})`);
      if (lang === 'ko') ok(r.tgtRows === r.viRows, `${tag}: and on every target line (${r.tgtRows} / ${r.viRows})`);
      ok(r.fetched.some(x => x.startsWith('sjjc:1:VT')) && r.fetched.some(x => x.startsWith('sjjc:1:' + (lang === 'ko' ? 'KO' : 'J'))), `${tag}: each language asked for its own VOCALS recording ${JSON.stringify(r.fetched)}`);
      ok(!r.fetched.some(x => /^(sjjm|sjji):/.test(x)), `${tag}: the Meetings / Instrumental editions are never a source ${JSON.stringify(r.fetched)}`);
      ok(r.srcs.every(x => x.startsWith('sjjc/pub-sjjc_1_AUDIO') || x.startsWith('sjjc/pub-sjjc_2_AUDIO')), `${tag}: the buttons carry their source (sjjc, its media key) ${JSON.stringify(r.srcs)}`);
      ok(r.ids === Array.from({length: r.viRows}, (_, i) => i).join(','), `${tag}: line index = lyric occurrence order ${r.ids}`);
      ok(r.markerIdx[2] === 3 && r.markerIdx[1] === 1, `${tag}: the interlude marker (pid 99) is skipped: line 3 is official marker 3 ${JSON.stringify(r.markerIdx.slice(0, 4))}`);
      const seeks = r.three.map(e => e.filter(x => x.startsWith('seek:')).map(x => x.split(':')[1].split('>')[0]));
      ok(seeks[0][0] === TGT(0) && seeks[1][0] === TGT(1) && seeks[2][0] === TGT(2), `${tag}: lines 1, 2, 3 seek to three different parts ${JSON.stringify(seeks)} (want ${TGT(0)}, ${TGT(1)}, ${TGT(2)})`);
      ok(r.three[0][0].startsWith('src:') && r.three[0][0].includes('sjjc_VT_1.mp3') && r.three[0][1] === 'load', `${tag}: the Vietnamese line plays the Vietnamese VOCALS file, loaded first ${JSON.stringify(r.three[0])}`);
      ok(r.three.every(e => !e.some(x => x === 'seek-before-metadata')), `${tag}: no seek before the metadata ${JSON.stringify(r.three[0])}`);
      ok(r.three.every(e => { const iS = e.findIndex(x => x.startsWith('seek:')), iP = e.findIndex(x => x.startsWith('play:')); return iS >= 0 && iP > iS; }), `${tag}: seek, seeked, then play ${JSON.stringify(r.three[1])}`);
      ok(r.three.every((e, k) => e.filter(x => x.startsWith('play:')).every(x => Math.abs(parseFloat(x.split(':')[1]) - parseFloat(TGT(k))) < 0.06)), `${tag}: every play starts at its line's seek target, never at 0 ${JSON.stringify(r.three.map(e => e.filter(x => x.startsWith('play:'))))}`);
      ok(r.three.every((e, k) => { const pz = e.find(x => x.startsWith('pause:')); return pz && Math.abs(parseFloat(pz.split(':')[1]) - (START(k) + 0.4)) < 0.12; }), `${tag}: each stops at the end of its own marker ${JSON.stringify(r.three.map(e => e.find(x => x.startsWith('pause:'))))}`);
      ok(r.three[1].length <= 4 && !r.three[1].some(x => x === 'load'), `${tag}: a second line of the same file only seeks (no reload) ${JSON.stringify(r.three[1])}`);
      ok(r.ttsAfterPlay === 0, `${tag}: no speech at all (${r.ttsAfterPlay})`);
      ok(r.pressedAfter === 0, `${tag}: a single play ends by itself (${r.pressedAfter} still marked)`);
      ok(r.loopPressed === 'true' && r.unit, `${tag}: the repeat button shows it runs (aria-pressed ${r.loopPressed}, unit marked ${r.unit})`);
      const loopSeeks = r.loop.filter(x => x.startsWith('seek:')), loopPlays = r.loop.filter(x => x.startsWith('play:'));
      ok(loopSeeks.length >= 3 && loopSeeks.every(x => x.startsWith('seek:' + TGT(1))) && loopPlays.length === loopSeeks.length && loopPlays.every(x => Math.abs(parseFloat(x.split(':')[1]) - parseFloat(TGT(1))) < 0.06), `${tag}: the same part again and again, seek then play each cycle ${JSON.stringify(r.loop)}`);
      ok(r.afterSwitch.pressed === 'false' && r.afterSwitch.ev.some(x => x.startsWith('seek:' + TGT(5))) && !r.afterSwitch.ev.some(x => x.startsWith('seek:' + TGT(1))), `${tag}: another line ends the loop at once and plays only itself ${JSON.stringify(r.afterSwitch)}`);
      ok(r.stopBtn.pressed === 'false' && r.stopBtn.paused, `${tag}: the same button stops the repeat ${JSON.stringify(r.stopBtn)}`);
      ok(r.afterTab.paused && r.afterTab.pressed === 0, `${tag}: a tab move ends the music ${JSON.stringify(r.afterTab)}`);
      ok(r.ttsEndsMusic.paused && r.ttsEndsMusic.tts >= 1, `${tag}: a speech button ends the music and speaks ${JSON.stringify(r.ttsEndsMusic)}`);
      ok(r.afterHidden === true, `${tag}: the page going hidden ends the music`);
      ok(r.song2.n >= 12 && r.song2.n === r.song2.lines && r.song2.unique === r.song2.n && r.song2.idx.every((x, i) => x === i), `${tag}: song ${r.song2.song} (repeated chorus) keeps one marker per sung line ${JSON.stringify(r.song2)}`);
      ok(!errs.length, `${tag}: errors ${errs.join(' | ').slice(0, 300)}`); errs.length = 0;
    }
    // source priority and the fail-closed cases, each on a fresh page (a recording is resolved once per page)
    const CASES = [
      ['pksjj fallback with markers', "window.__segCfg.none['sjjc:1:VT']=true;window.__segCfg.pksjjMarkers=true;", q => ok(q.vi > 0 && q.viSrc === 'pksjj/pub-pksjj_1_AUDIO' && q.koSrc === 'sjjc/pub-sjjc_1_AUDIO' && q.fetched.includes('pksjj:1:VT') && !q.fetched.includes('pksjj:1:KO'), `no VOCALS in Vietnamese -> the CHILDREN recording, Korean keeps VOCALS; the children's one is only asked for when needed ${JSON.stringify(q)}`)],
      // (the Korean row is not asserted in the next two cases: once Vietnamese falls to the children's recording, the learner languages follow the
      // user-authorized children-choir tables, which this mock does not serve)
      ['pksjj fallback without markers (as on jw.org)', "window.__segCfg.none['sjjc:1:VT']=true;", q => ok(q.vi === 0 && q.fetched.includes('pksjj:1:VT'), `the children's recording without markers gives no Vietnamese button, no timing is guessed ${JSON.stringify(q)}`)],
      ['no vocal recording at all', "window.__segCfg.none['sjjc:1:VT']=true;window.__segCfg.none['pksjj:1:VT']=true;", q => ok(q.vi === 0 && !q.fetched.some(x => x.startsWith('sjjm')), `no sung recording -> no button (the Meetings edition is not used instead) ${JSON.stringify(q)}`)],
      ['marker count off by one', "window.__segCfg.skew['sjjc:1:KO']=1;", q => ok(q.vi > 0 && q.ko === 0, `one sung marker too many in Korean -> no Korean button, no trimming ${JSON.stringify(q)}`)],
      ['a line that holds an interlude', "window.__segCfg.interlude['sjjc:1:KO']=true;", q => ok(q.vi > 0 && q.ko === q.vi - 1 && q.koMissing === '1', `a 40 s "line" (an interlude inside its marker) -> that Korean line alone has no button ${JSON.stringify(q)}`)],
      ['no markers on the vocals', "window.__segCfg.noMarkers['sjjc:1:KO']=true;", q => ok(q.vi > 0 && q.ko === 0 && !q.fetched.includes('pksjj:1:KO'), `VOCALS without markers -> no button and no fall-through to the children's recording ${JSON.stringify(q)}`)],
    ];
    for (const [name, cfgJs, check] of CASES) {
      await NAV(cfgJs);
      const q = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));await (${OPEN('ko')});${HELP}
        const src=sel=>{const b=btns(sel)[0];return b?b.dataset.segSrc+'/'+b.dataset.segKey:null;};
        const koRows=[...box().querySelectorAll('.lyric-target-row')].filter(r=>r.querySelector('.lyric-target')&&r.querySelector('.lyric-target').textContent.trim()&&!/^\\s*(\\(.*\\)|\\d+\\s*[.．。]?)\\s*$/.test(r.querySelector('.lyric-target').textContent.trim()));
        return {koMissing:koRows.map((r,i)=>r.querySelector('.song-seg-btn')?null:i).filter(x=>x!==null).join(','), vi:btns('[data-seg="play"][data-seg-id$="|vi"]').length, ko:btns('[data-seg="play"][data-seg-id$="|ko"]').length, viSrc:src('[data-seg-id$="|vi"]'), koSrc:src('[data-seg-id$="|ko"]'), fetched:(window.__segFetch||[]).slice()};})()`);
      check(q);
      ok(!errs.length, `${name}: errors ${errs.join(' | ').slice(0, 300)}`); errs.length = 0;
    }
    // a seek that does not land (the engine answers 0): checked after seeked, tried once more, then NO play (never the intro instead)
    await NAV();
    const z = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));await (${OPEN('ko')});${HELP}
      window.__segCfg.seekTo=0; aud().length=0; btns('[data-seg="play"][data-seg-id$="|vi"]')[2].click(); await sleep(1200);
      const o={ev:ev(), marked:document.querySelectorAll('.song-seg-btn.is-playing').length, paused:window.__audio.paused};
      // the engine works again: a later tap plays normally
      window.__segCfg.seekTo=null; aud().length=0; btns('[data-seg="play"][data-seg-id$="|vi"]')[2].click(); await sleep(400); o.after=ev(); return o;})()`);
    ok(z.ev.filter(x => x.startsWith('seek:')).length === 2 && !z.ev.some(x => x.startsWith('play:')) && z.marked === 0 && z.paused, `a seek that lands at 0 is tried twice and never played ${JSON.stringify(z.ev)}`);
    ok(z.after.some(x => x.startsWith('play:' + TGT(2).slice(0, 3))), `the next tap plays normally ${JSON.stringify(z.after)}`);
    // a stale callback: line 1 tapped, then line 3 before the file's metadata arrived -> only line 3 is seeked and played
    await NAV();
    const st = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));await (${OPEN('ko')});${HELP}
      aud().length=0; btns('[data-seg="play"][data-seg-id$="|vi"]')[0].click(); await sleep(3); btns('[data-seg="play"][data-seg-id$="|vi"]')[2].click(); await sleep(700);
      return {ev:ev(), state:window.__songSeg.state()};})()`);
    ok(st.ev.filter(x => x.startsWith('seek:')).every(x => x.startsWith('seek:' + TGT(2))) && st.ev.filter(x => x.startsWith('play:')).length === 1 && st.ev.some(x => x.startsWith('play:' + TGT(2).slice(0, 3))), `the first line's callbacks are stale: only the third line is seeked and played ${JSON.stringify(st.ev)}`);
    ok(!errs.length, `errors ${errs.join(' | ').slice(0, 300)}`); errs.length = 0;
    // collections 2 and 3, a mismatch and a missing recording: no button and no speech
    await FORGET_SONG_PLACE(); await cdp.send('Page.navigate', {url: 'about:blank'}); await new Promise(r => setTimeout(r, 200));   // the page saves the [노래] screen it leaves; these cases start on 왕국 노래 1 again
    await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
    for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
    await sleep(800);
    await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
    await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1}); await sleep(150);
    const q = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const o={};window.setLang('ko');await sleep(300);const tts0=window.__tts.filter(x=>x.ev==='speak').length;
      const SINGX=t=>{t=String(t||'').trim();return !!t&&!/^\\s*(\\(.*\\)|（.*）|\\d+\\s*[.．。]?)\\s*$/.test(t);}; const aud=()=>window.__aud;
      document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(800);
      const tabs=[...document.querySelectorAll('.song-kind-tabs [role="tab"]')];
      window.__segCfg.skew['osg:1:KO']=1;   // the Korean recording of original 1 has one marker too many
      window.__segCfg.none['pkon:1:VT']=true;
      tabs[1].click();await sleep(400);const oroot=document.getElementById('song-original-root');
      oroot.querySelector('.song-acc[data-song-id="osg-1"] .song-acc-head').click();await sleep(1000);
      const ob=oroot.querySelector('.song-acc[data-song-id="osg-1"]'); o.osg1={vi:ob.querySelectorAll('.lyric-vi-row .song-seg-btn').length, ko:ob.querySelectorAll('.lyric-target-row .song-seg-btn').length, rows:ob.querySelectorAll('.song-lyric-line').length};
      window.__segCfg.outro99['osg:117:VT']=true; window.__segCfg.outro99['osg:117:KO']=true;
      oroot.querySelector('.song-acc[data-song-id="osg-117"] .song-acc-head').click();await sleep(1000);
      const o117=oroot.querySelector('.song-acc[data-song-id="osg-117"]'); o.osg117={vi:o117.querySelectorAll('.lyric-vi-row .song-seg-btn').length, ko:o117.querySelectorAll('.lyric-target-row .song-seg-btn').length, rows:o117.querySelectorAll('.song-lyric-line').length};
      // osg-116 Vietnamese: the video's official cues agree with the MP3 markers (same spans) -> the MP3 markers stay (finer, one per line)
      window.__segCfg.video['pub-osg_116_VIDEO:VT']={start:1,dur:0.4,vtt:true};
      // osg-116: the Korean recording has no marker of paragraph 7 (line 4) and sings lines 6+7 as one -> those lines have no button, the rest do
      window.__segCfg.dropPid['osg:116:KO']=7; window.__segCfg.doubleLine['osg:116:KO']=5;
      oroot.querySelector('.song-acc[data-song-id="osg-116"] .song-acc-head').click();await sleep(1200);
      const o116=oroot.querySelector('.song-acc[data-song-id="osg-116"]'); const koRows116=[...o116.querySelectorAll('.lyric-target-row')].filter(r=>r.querySelector('.lyric-target')&&r.querySelector('.lyric-target').textContent.trim()&&r.querySelector('.lyric-target').textContent.trim().charAt(0)!=='(');
      o.osg116={vi:o116.querySelectorAll('.lyric-vi-row .song-seg-btn[data-seg=play]').length, ko:o116.querySelectorAll('.lyric-target-row .song-seg-btn[data-seg=play]').length, rows:koRows116.length,
        koMissing:koRows116.map((r,i)=>r.querySelector('.song-seg-btn')?null:i+1).filter(Boolean).join(','), koLine5m:(koRows116[4].querySelector('.song-seg-btn')||{dataset:{}}).dataset.segM, aligned:(window.__songSeg.info['original|osg-116|ko']||{}).alignedBy,
        viUrl:(window.__songSeg.info['original|osg-116|vi']||{}).url, viTiming:(window.__songSeg.info['original|osg-116|vi']||{}).timing||'mp3-markers', viCues:!!((window.__songSeg.info['original|osg-116|vi']||{}).video)};
      // pkon-35: MP3 markers one per line but timed to nothing (1-2 s "lines" from 0:00) while the video's official cues start at 9.78 s and hold
      // lines 1+2 and 3+4 together -> the cues win, played from the video; those grouped lines have no button; a cue whose words differ shows them
      window.__segCfg.mp3Zero['pkon:35:VT']=true; window.__segCfg.mp3Zero['pkon:35:KO']=true;
      window.__segCfg.video['pub-pkon_35_VIDEO:VT']={start:9.78,dur:2.0,groups:[[0,1],[2,3]],alter:{4:'LỜI HÁT KHÁC của dòng năm'},vtt:true};
      // (after the user's merge every line of 35 is one cue of two lines in the subtitle -> the mock groups them in pairs as the real VTT does)
      window.__segCfg.video['pub-pkon_35_VIDEO:KO']={start:9.38,dur:2.0,vtt:true};
      // pk-special-0 (pub-pk_3_*): the MP3 has no markers; the Vietnamese video has cues, the Korean video none
      window.__segCfg.noMarkers['pk:3:VT']=true; window.__segCfg.noMarkers['pk:3:KO']=true;
      window.__segCfg.video['pub-pk_3_VIDEO:VT']={start:9.23,dur:3.0,split:[1],vtt:true}; window.__segCfg.video['pub-pk_3_VIDEO:KO']={start:9.23,dur:3.0,vtt:false};
      tabs[2].click();await sleep(400);const kroot=document.getElementById('song-kids-root');
      for (const id of ['pk-special-0','pkon-1','pkon-35']) { kroot.querySelector('.song-acc[data-song-id="'+id+'"] .song-acc-head').click(); await sleep(1000); }
      const cnt=(id,s)=>kroot.querySelector('.song-acc[data-song-id="'+id+'"]').querySelectorAll(s).length;
      const inf=id=>window.__songSeg.info['children|'+id+'|vi']||{}; const k35=kroot.querySelector('.song-acc[data-song-id="pkon-35"]');
      const viRows35=[...k35.querySelectorAll('.lyric-vi-row')].filter(r=>SINGX(r.querySelector('.lyric-vi').textContent));
      const sp0m=(inf('pk-special-0').marks||[]); const sp0k=(window.__songSeg.info['children|pk-special-0|ko']||{}); const sp0km=sp0k.marks||[];
      window.__segCfg.video['pub-pkon_19_VIDEO:VT']={start:7.5,dur:3.0,vtt:true}; window.__segCfg.video['pub-pkon_19_VIDEO:KO']={start:7.5,dur:3.0,vtt:false};
      kroot.querySelector('.song-acc[data-song-id="pkon-19"] .song-acc-head').click(); await sleep(1200);
      const k19=kroot.querySelector('.song-acc[data-song-id="pkon-19"]'), k19i=window.__songSeg.info['children|pkon-19|ko']||{}, k19m=k19i.marks||[];
      o.k19={ko:cnt('pkon-19','.lyric-target-row .song-seg-btn[data-seg=play]'), rows:cnt('pkon-19','.song-lyric-line'), copied:k19i.copiedLines, l1:k19m[0]&&{s:k19m[0].s,url:k19m[0].url,from:k19m[0].copiedFrom}, l3:k19m[2]&&{s:k19m[2].s,url:k19m[2].url||null}};
      o.kids={sp0:{vi:cnt('pk-special-0','.lyric-vi-row .song-seg-btn[data-seg=play]'),ko:cnt('pk-special-0','.lyric-target-row .song-seg-btn[data-seg=play]'),rows:cnt('pk-special-0','.song-lyric-line'),timing:inf('pk-special-0').timing,url:inf('pk-special-0').url,fetched:(window.__segFetch||[]).filter(x=>x.startsWith('pk:')),
          koCopied:sp0k.copiedLines, koL1:sp0km[0]&&{s:sp0km[0].s,url:sp0km[0].url,from:sp0km[0].copiedFrom}, viL1:sp0m[0]&&sp0m[0].s,
          line2:sp0m[1]&&{s:sp0m[1].s,e:sp0m[1].e}, line3:sp0m[2]&&{s:sp0m[2].s,e:sp0m[2].e}},
        p1:{vi:cnt('pkon-1','.lyric-vi-row .song-seg-btn'),ko:cnt('pkon-1','.lyric-target-row .song-seg-btn')},
        p35:{vi:cnt('pkon-35','.lyric-vi-row .song-seg-btn[data-seg=play]'),ko:cnt('pkon-35','.lyric-target-row .song-seg-btn[data-seg=play]'),rows:viRows35.length,timing:inf('pkon-35').timing,rejected:inf('pkon-35').mp3Rejected,url:inf('pkon-35').url,
          missing:viRows35.map((r,i)=>r.querySelector('.song-seg-btn')?null:i+1).filter(Boolean).join(','), alt:(k35.querySelector('.song-children-lyric')||{}).textContent, altCount:k35.querySelectorAll('.song-children-lyric').length,
          m:(inf('pkon-35').marks||[]).slice(0,5).map(x=>x&&[x.s,x.e,x.group||0,x.m]), reason:inf('pkon-35').reason, counts:inf('pkon-35').counts, koTiming:(window.__songSeg.info['children|pkon-35|ko']||{}).timing}};
      // ▶ on the 2nd line of pkon-35 (Vietnamese), sung inside the first cue of two lines: the video's audio, seeked to that cue
      aud().length=0; k35.querySelectorAll('.lyric-vi-row .song-seg-btn[data-seg=play]')[1].click(); await sleep(300); o.kids.p35.play=aud().map(x=>x.ev+(x.ev==='src'?':'+x.v.split('/').pop():x.ev==='seek'?':'+x.v.toFixed(2):x.ev==='play'?':'+x.at.toFixed(2):''));
      o.tts=window.__tts.filter(x=>x.ev==='speak').length-tts0; o.ttsTexts=window.__tts.filter(x=>x.ev==='speak').map(x=>x.text.slice(0,30)); o.overflow=document.documentElement.scrollWidth>innerWidth;
      return o;})()`);
    ok(q.osg1.rows > 0 && q.osg1.ko === 0, `original 1: the Korean recording with a wrong marker count has no button (no timing guessed) ${JSON.stringify(q.osg1)}`);
    ok(q.osg116.vi === q.osg116.rows && q.osg116.ko === q.osg116.rows - 2 && q.osg116.koMissing === '4,6' && q.osg116.aligned === 'paragraph-id' && q.osg116.koLine5m === '3', `original 116: Korean markers not one per line -> aligned by paragraph id with the Vietnamese line order, own markers; lines 4 (no marker) and 6 (sung with 7) have no button ${JSON.stringify(q.osg116)}`);
    ok(q.osg117.rows > 0 && q.osg117.vi === 2 * q.osg117.rows && q.osg117.ko === 2 * q.osg117.rows, `original 117: the outro marker (pid 99) is no line, every sung line has its button ${JSON.stringify(q.osg117)}`);
    ok(q.kids.p1.vi === 0 && q.kids.p1.ko > 0, `children 1: the missing Vietnamese recording gives no button, no speech stands in ${JSON.stringify(q.kids.p1)}`);
    ok(q.osg116.viCues && q.osg116.viTiming === 'mp3-markers' && /\.mp3$/.test(q.osg116.viUrl) && q.osg116.vi === q.osg116.rows, `original 116 Vietnamese: cues that agree with the MP3 markers leave the MP3 markers in place ${JSON.stringify({cues: q.osg116.viCues, t: q.osg116.viTiming, url: q.osg116.viUrl, vi: q.osg116.vi})}`);
    const p35 = q.kids.p35;
    ok(p35.timing === 'video-cues' && /pub-pkon_35_VIDEO_VT\.mp4$/.test(p35.url) && p35.m[0] && p35.m[0][0] === 9780 && p35.m[0][1] === 13780 && p35.m[1][0] === 9780 && p35.m[2][0] === 13880 && p35.m[3][0] === 13880 && p35.m[4][0] === 17980, `children 35: MP3 markers from 0:00 of 0.4 s are not timings of this recording -> dropped; the lines come from the video's cues (lines 1+2 share the first cue, 3+4 the second) ${JSON.stringify({timing: p35.timing, url: p35.url, m: p35.m, reason: p35.reason})}`);
    ok(p35.vi === p35.rows && p35.missing === '' && p35.counts && p35.counts.ok === p35.rows - 1 && p35.counts.sub === 1, `children 35: every line has a button; a line inside a two-line cue plays that cue; one line sung with other words ${JSON.stringify({vi: p35.vi, rows: p35.rows, missing: p35.missing, counts: {ok: p35.counts.ok, sub: p35.counts.sub, grouped: p35.counts.grouped, unsure: p35.counts.unsure}})}`);
    ok(p35.altCount === 1 && /LỜI HÁT KHÁC/.test(p35.alt || ''), `children 35: a cue whose words differ from the text shows the sung words under the line ${JSON.stringify({alt: p35.alt, n: p35.altCount})}`);
    ok(p35.koTiming === 'video-cues' && p35.ko === p35.rows, `children 35 Korean: cues one per line -> every line, from the video ${JSON.stringify({ko: p35.ko, rows: p35.rows, t: p35.koTiming})}`);
    ok(p35.play && p35.play[0] === 'src:pub-pkon_35_VIDEO_VT.mp4' && p35.play.some(x => x.startsWith('seek:9.78')) && p35.play.some(x => x.startsWith('play:9.78')), `children 35: ▶ on line 2 seeks the video's audio to its cue (9.78 s) and plays there ${JSON.stringify(p35.play)}`);
    ok(q.kids.sp0.timing === 'video-cues' && q.kids.sp0.vi === q.kids.sp0.rows && q.kids.sp0.fetched.includes('pk:3:VT'), `children special 0: pub-pk track 3 (the data's own media key); no MP3 markers -> the Vietnamese video's cues ${JSON.stringify({t: q.kids.sp0.timing, vi: q.kids.sp0.vi, rows: q.kids.sp0.rows, fetched: q.kids.sp0.fetched})}`);
    ok(q.kids.sp0.ko === q.kids.sp0.rows && q.kids.sp0.koCopied === q.kids.sp0.rows && q.kids.sp0.koL1 && q.kids.sp0.koL1.from === 'vi' && q.kids.sp0.koL1.s === q.kids.sp0.viL1 && /pub-pk_3_VIDEO_KO\.mp4$/.test(q.kids.sp0.koL1.url), `children special 0 Korean (no subtitles): every line at the Vietnamese cue times, played from the Korean video (SONG_TIMING_COPY) ${JSON.stringify({ko: q.kids.sp0.ko, copied: q.kids.sp0.koCopied, l1: q.kids.sp0.koL1, viL1: q.kids.sp0.viL1})}`);
    ok(q.k19.ko === q.k19.rows && q.k19.copied === 2 && q.k19.l1 && q.k19.l1.from === 'vi' && q.k19.l1.s === 7500 && /pub-pkon_19_VIDEO_KO\.mp4$/.test(q.k19.l1.url) && q.k19.l3 && q.k19.l3.url === null, `children 19 Korean: lines 1-2 at the Vietnamese times on the Korean video, the other lines on the Korean MP3's own markers ${JSON.stringify(q.k19)}`);
    ok(q.kids.sp0.line2 && q.kids.sp0.line2.s === 9230 + 3100 && q.kids.sp0.line2.e === 9230 + 3100 + 3000 + 100 + 3000 && q.kids.sp0.line3 && q.kids.sp0.line3.s === 9230 + 3100 * 3, `children special 0: a page line the subtitle shows as two cues spans both cues ${JSON.stringify({l2: q.kids.sp0.line2, l3: q.kids.sp0.line3})}`);
    ok(q.tts === 0, `no speech was used anywhere (${q.tts}) ${JSON.stringify(q.ttsTexts)}`);
    ok(!q.overflow, 'no horizontal overflow');
    // widths: no overlap between a line's text and its buttons, no horizontal overflow
    await FORGET_SONG_PLACE(); await cdp.send('Page.navigate', {url: 'about:blank'}); await new Promise(r => setTimeout(r, 200));   // the page saves the [노래] screen it leaves; these cases start on 왕국 노래 1 again
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
      if (w === 1280) {
        const st = await E(`(()=>{const rows=[...document.querySelectorAll('.lyric-vi-row')].filter(r=>r.querySelector('.phrase-star'));
          return {n:rows.length, starFirst:rows.filter(r=>{const k=[...r.children];return k.indexOf(r.querySelector('.phrase-star'))<k.indexOf(r.querySelector('.speak-btn'));}).length,
            order:rows[0]?[...rows[0].children].map(c=>c.className.split(' ')[0]).join(' > '):''};})()`);
        ok(st.n > 0 && st.starFirst === st.n, `a song row: ★ (phrase book) comes before the speaker, then the music buttons (${st.order}; ${st.starFirst}/${st.n})`);
      }
    }
    ok(!errs.length, `errors ${errs.join(' | ').slice(0, 300)}`);
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- SONG AUDIO SEGMENTS TEST FAILED ---'); process.exit(1); }
  console.log('--- SONG AUDIO SEGMENTS TEST PASSED ---');
})();
