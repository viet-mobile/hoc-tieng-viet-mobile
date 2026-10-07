// OPTIONAL network test (not in the default release gate): the real jw.org API + the real MP3 in headless Chrome, on the local build
// (SITE=https://jeonju.hoc.tieng.viet.mobile/ node tests/real_song_audio_network.js for production; SONGS=1:ko,164:ja,... picks the songs).
// For representative songs / languages: which recording was chosen (sjjc / pksjj / none), and for lines 1, 2, 3 of the Vietnamese and the
// UI-language rows: requested start, the position the play really started at, the position it stopped at -- three different parts, none at 0.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const PORT = 8985, sleep = ms => new Promise(r => setTimeout(r, ms));
const SITE = process.env.SITE || `http://127.0.0.1:${PORT}/jeonju/index.html`;
const SONGS = process.env.SONGS ? process.env.SONGS.split(',').map(x => { const [n, l] = x.split(':'); return [+n, l]; }) : [[1, 'ko'], [1, 'ja'], [28, 'ko'], [74, 'ko'], [151, 'ko'], [152, 'ko'], [155, 'ko'], [164, 'ko'], [5, 'en'], [1, 'en']];
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(__dirname, '..', 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--autoplay-policy=no-user-gesture-required', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'song-net-' + process.pid)], {stdio: 'ignore'});
  let bad = 0;
  try {
    let targets; for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 1000, deviceScaleFactor: 1, mobile: false});
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true})).result.value;
    for (const [num, lang] of SONGS) {
      await cdp.send('Page.navigate', {url: `${SITE}${SITE.includes('?') ? '&' : '?'}fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(800);
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang(${JSON.stringify(lang)});await sleep(300);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(800);
        const row=[...document.querySelectorAll('#curr-songs-root .song-list-row')].find(r=>r.dataset.songNum===${JSON.stringify(String(num))}); if(row){row.click();await sleep(600);}
        const box=document.querySelector('[data-seg-kind="kingdom"]');
        for(let i=0;i<80&&!(window.__songSeg.info['kingdom|${num}|vi']!==undefined&&window.__songSeg.info['kingdom|${num}|${lang}']!==undefined);i++) await sleep(100); await sleep(200);
        const out={song:${num},lang:${JSON.stringify(lang)},rows:{}};
        for (const L of ['vi',${JSON.stringify(lang)}]) {
          const info=window.__songSeg.info['kingdom|${num}|'+L]; const bs=[...box.querySelectorAll('.song-seg-btn[data-seg="play"][data-seg-id$="|'+L+'"]')];
          const o={src:info?info.src:'none',reason:info?(info.marks?'':info.reason||(''+(info.marks&&info.marks.length)+' vs rows')):'no recording',buttons:bs.length,lines:[]};
          for (const k of [0,1,2]) { const b=bs[k]; if(!b) continue; const mark=info.marks[+b.dataset.segI];
            b.click(); let started=0,stopped=0; const t0=Date.now();
            while(Date.now()-t0<25000){ await sleep(30); const a=window.__songSeg.audio(); if(a&&!a.paused&&!started) started=a.currentTime; if(started&&a.paused){stopped=a.currentTime;break;} }
            o.lines.push({want:+(mark.s/1000).toFixed(3),end:+(mark.e/1000).toFixed(3),started:+started.toFixed(3),stopped:+stopped.toFixed(3)}); }
          out.rows[L]=o; }
        return out;})()`);
      console.log(JSON.stringify(r));
      for (const L of Object.keys(r.rows)) {
        const o = r.rows[L];
        if (o.buttons === 0) continue;
        if (/^(sjjm|sjji)$/.test(o.src)) { bad++; console.log('  FAIL: a non-vocal source', L, o.src); }
        const starts = o.lines.map(x => x.started);
        if (new Set(starts.map(x => x.toFixed(1))).size !== o.lines.length) { bad++; console.log('  FAIL: lines 1/2/3 do not start at three different parts', L, starts); }
        for (const x of o.lines) {
          if (x.started < 0.5 || Math.abs(x.started - (x.want - 0.04)) > 0.3) { bad++; console.log('  FAIL: start', L, x); }
          if (Math.abs(x.stopped - x.end) > 0.25) { bad++; console.log('  FAIL: end', L, x); }
        }
      }
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(bad ? 'NETWORK TEST: PROBLEMS ' + bad : 'NETWORK TEST OK'); process.exit(bad ? 1 : 0);
})();
