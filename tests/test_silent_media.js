// iPhone / iPad with the ringer switch on silent: a playing (silent, looping) <audio> element keeps the page in the media-playback session.
// Started inside the tap that starts speech, kept while speech runs, paused ~5 s after the last run, never on desktop / Android.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const PORT = Number(process.env.SILENT_MEDIA_PORT || 8745), sleep = ms => new Promise(r => setTimeout(r, ms));
const UAS = {
  iphone: ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'iPhone'],
  windows: ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', 'Win32'],
  android: ['Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36', 'Linux armv8l'],
};
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(__dirname, '..', 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--autoplay-policy=no-user-gesture-required', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'silentmedia-' + process.pid)], {stdio: 'ignore'});
  let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } else console.log('ok  ', m); };
  try {
    let targets; for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: false});
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true})).result.value;
    for (const [name, [ua, platform]] of Object.entries(UAS)) {
      await cdp.send('Emulation.setUserAgentOverride', {userAgent: ua, platform});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(900);
      await E(`(async()=>{window.setLang('ko');await new Promise(r=>setTimeout(r,300));window.speechSynthesis.speak=function(u){};window.speechSynthesis.cancel=function(){};
        document.querySelector('.tab-btn[data-tab="pron"]').click();await new Promise(r=>setTimeout(r,400));
        document.querySelector('.subtab-btn[data-pron="settings"]').click();await new Promise(r=>setTimeout(r,400));
        document.querySelector('.tts-rate-try').click();await new Promise(r=>setTimeout(r,700));return 1;})()`);
      const during = await E(`(function(){var a=window.__silentMedia;return a?{exists:true,paused:a.paused,loop:a.loop,src:a.src.slice(0,22)}:{exists:false};})()`);
      if (name === 'iphone') {
        ok(during.exists && !during.paused && during.loop && /^data:audio\/wav/.test(during.src), `iphone: a silent looping audio element plays while speech runs ${JSON.stringify(during)}`);
        await E(`document.querySelector('.tab-btn[data-tab="curriculum"]').click()`);   // ends the run
        await sleep(5600);
        const after = await E('window.__silentMedia.paused');
        ok(after === true, 'iphone: paused again ~5 s after the last run');
        // the helper can be switched off in 발음 > 설정: no playing element for a run any more
        await E(`localStorage.setItem('vn-app-silent-media','off');document.querySelector('.tts-rate-try').click();0`);
        await sleep(600);
        ok((await E('window.__silentMedia.paused')) === true, 'iphone: helper switched off -> the element stays paused');
        await E(`localStorage.removeItem('vn-app-silent-media');0`);
        const box = await E(`!!document.querySelector('.tts-silent-toggle')`);
        ok(box === true, 'iphone: the helper toggle is in the settings');
      } else {
        ok(!during.exists, `${name}: no silent media element at all ${JSON.stringify(during)}`);
        ok(!(await E(`!!document.querySelector('.tts-silent-toggle')`)), `${name}: no helper toggle`);
      }
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(bad ? 'SILENT MEDIA TEST: PROBLEMS ' + bad : 'SILENT MEDIA TEST OK'); process.exit(bad ? 1 : 0);
})();
