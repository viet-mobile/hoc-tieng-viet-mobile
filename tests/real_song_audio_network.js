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
  const audit=require('../song_vocal_segment_audit_report.json');
  const measured = new Set();
  const results = [];
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
      const already = [...measured];
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang(${JSON.stringify(lang)});await sleep(300);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(800);
        const row=[...document.querySelectorAll('#curr-songs-root .song-list-row')].find(r=>r.dataset.songNum===${JSON.stringify(String(num))}); if(row){row.click();await sleep(600);}
        const box=document.querySelector('[data-seg-kind="kingdom"]');
        for(let i=0;i<80&&!(window.__songSeg.info['kingdom|${num}|vi']!==undefined&&window.__songSeg.info['kingdom|${num}|${lang}']!==undefined);i++) await sleep(100); await sleep(200);
        const measured=${JSON.stringify(already)}; const out={song:${num},lang:${JSON.stringify(lang)},rows:{}};
        for (const L of [...new Set(${JSON.stringify(process.env.LOCALES ? process.env.LOCALES.split(',') : null)} || ['vi',${JSON.stringify(lang)}])]) {
          const info=window.__songSeg.info['kingdom|${num}|'+L]; const bs=[...box.querySelectorAll('.song-seg-btn[data-seg="play"][data-seg-id$="|'+L+'"]')];
          const o={src:info?info.src:'none',reason:info?(info.marks?'':info.reason||(''+(info.marks&&info.marks.length)+' vs rows')):'no recording',buttons:bs.length,lines:[]};
          for (const k of (measured.includes('${num}|'+L) ? [] : ${process.env.ALL_LINES==='1' ? 'bs.map((_,i)=>i)' : '[0,1,2]'})) { const b=bs[k]; if(!b) continue; const mark=info.marks[+b.dataset.segI];
            b.click(); let started=null,stopped=null; const t0=Date.now();
            while(Date.now()-t0<25000){ await sleep(30); const a=window.__songSeg.audio(); if(a&&!a.paused&&started===null) { started=a.currentTime; if(${process.env.FAST_BOUNDARY === '1'}) a.currentTime=mark.e/1000-0.25; } if(started!==null&&a.paused){stopped=a.currentTime;break;} }
            o.lines.push({want:+(mark.s/1000).toFixed(3),end:+(mark.e/1000).toFixed(3),started:started===null?null:+started.toFixed(3),stopped:stopped===null?null:+stopped.toFixed(3)}); }
          if (${Number(process.env.REPEAT_CYCLES||0)} && (L==='vi' || ${process.env.REPEAT_ALL==='1'}) && bs.length) {
            const b=box.querySelector('.song-seg-btn[data-seg="loop"][data-seg-id$="|'+L+'"][data-seg-i="'+bs[0].dataset.segI+'"]');
            const mark=info.marks[+b.dataset.segI];b.click();const starts=[];let prior=Infinity;
            const deadline=Date.now()+(${Number(process.env.REPEAT_CYCLES||0)}*(mark.e-mark.s+250)+40000);
            while(Date.now()<deadline&&starts.length<${Number(process.env.REPEAT_CYCLES||0)}) {
              await sleep(20);const a=window.__songSeg.audio();if(a&&!a.paused){if(a.currentTime<prior-0.2)starts.push(a.currentTime);prior=a.currentTime;}
            }
            b.click();o.repeat={starts,stopped:window.__songSeg.audio().paused,want:mark.s/1000};
          }
          out.rows[L]=o; }
        return out;})()`);
      results.push(r); console.log(JSON.stringify(r));
      for (const L of Object.keys(r.rows)) measured.add(num+'|'+L);
      for (const L of Object.keys(r.rows)) {
        const o = r.rows[L];
        const expected=audit.rows.find(x=>x.track===num&&x.locale===L);
        if(expected && o.buttons!==expected.buttons){bad++;console.log('FAIL button count',num,L,o.buttons,expected.buttons);}
        if (o.buttons === 0) continue;
        if (/^(sjjm|sjji)$/.test(o.src)) { bad++; console.log('  FAIL: a non-vocal source', L, o.src); }
        if(o.repeat && (o.repeat.starts.length!==Number(process.env.REPEAT_CYCLES)||!o.repeat.stopped||o.repeat.starts.some(x=>Math.abs(x-o.repeat.want)>.1))){bad++;console.log('FAIL repeat',o.repeat);}
        const starts = o.lines.map(x => x.started===null ? -1 : x.started);
        if (new Set(starts.map(x => x.toFixed(1))).size !== o.lines.length) { bad++; console.log('  FAIL: lines 1/2/3 do not start at three different parts', L, starts); }
        for (const x of o.lines) {
          if (x.started === null || Math.abs(x.started - x.want) > 0.1) { bad++; console.log('  FAIL: start', L, x); }
          if (x.stopped === null || Math.abs(x.stopped - x.end) > 0.25) { bad++; console.log('  FAIL: end', L, x); }
        }
      }
    }
    if (process.env.REPORT) require('fs').writeFileSync(process.env.REPORT,JSON.stringify({acceleratedEndCheck:process.env.FAST_BOUNDARY==='1',results,failures:bad},null,2));
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(bad ? 'NETWORK TEST: PROBLEMS ' + bad : 'NETWORK TEST OK'); process.exit(bad ? 1 : 0);
})();
