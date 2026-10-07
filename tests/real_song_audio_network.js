// OPTIONAL network test (not in the default release gate): the real jw.org API + the real MP3 in headless Chrome.
//   node tests/real_song_audio_network.js   -- for a few songs/languages: buttons appear, ▶ plays the line's own part and stops at its end.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const PORT = 8985, sleep = ms => new Promise(r => setTimeout(r, ms));
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
    for (const lang of ['ko', 'ja', 'en', 'cs']) {
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(800);
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang(${JSON.stringify(lang)});await sleep(300);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(800);
        for(let i=0;i<60&&!document.querySelector('[data-seg-kind="kingdom"] .song-seg-btn');i++) await sleep(250);
        const out={n:document.querySelectorAll('[data-seg-kind="kingdom"] .song-seg-btn[data-seg="play"]').length};
        const key=(document.querySelector('[data-seg-kind="kingdom"] .song-seg-btn[data-seg-id$="|vi"]')||{dataset:{}}).dataset.segId;
        const info=await window.__songSeg.resolve('kingdom','1','vi'); out.marks=info&&info.marks.length; out.m3=info&&info.marks[2];
        const b=document.querySelectorAll('[data-seg-kind="kingdom"] .song-seg-btn[data-seg="play"][data-seg-id$="|vi"]')[2]; if(!b) return out;
        const t0=performance.now(); b.click(); let started=0,stopped=0;
        for(let i=0;i<200;i++){ await sleep(50); const a=window.__songSeg.audio(); if(a&&!a.paused&&!started) started=a.currentTime; if(a&&a.paused&&started&&!stopped){stopped=a.currentTime;break;} }
        out.started=started; out.stoppedAt=stopped; return out;})()`);
      console.log(lang, JSON.stringify(r));
      if (!(r.n > 0)) bad++;
      if (r.m3 && r.stoppedAt) { const err = r.stoppedAt * 1000 - r.m3.e; console.log('  end error ms:', err.toFixed(0)); if (Math.abs(err) > 250) bad++; }
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(bad ? 'NETWORK TEST: PROBLEMS' : 'NETWORK TEST OK'); process.exit(bad ? 1 : 0);
})();
