// 발음 > 설정 > 읽기 속도: only the slider of THIS device's operating system is shown and applied; stored in the browser; applied to the
// Vietnamese utterance only (default rate 0.92 x the factor), never to the meaning / translation voices; reset; kept after a reload.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const PORT = Number(process.env.TTS_RATE_PORT || 8935), sleep = ms => new Promise(r => setTimeout(r, ms));
const DEVICES = [
  ['windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', 'Win32'],
  ['mac', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', 'MacIntel'],
  ['ios', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'iPhone'],
  ['android', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36', 'Linux armv8l'],
];
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(__dirname, '..', 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'ttsrate-' + process.pid)], {stdio: 'ignore'});
  let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } else console.log('ok  ', m); };
  try {
    let targets; for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 600, height: 1000, deviceScaleFactor: 1, mobile: false});
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true})).result.value;
    const load = async () => { await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html`}); for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); } await sleep(900); };
    const openSettings = () => E(`(async()=>{window.setLang('ko');await new Promise(r=>setTimeout(r,300));document.querySelector('.tab-btn[data-tab="pron"]').click();await new Promise(r=>setTimeout(r,300));
      document.querySelector('.subtab-btn[data-pron="settings"]').click();await new Promise(r=>setTimeout(r,500));return 1;})()`);
    const setSlider = (os, v) => E(`(function(){var s=document.querySelector('.tts-rate-row[data-os="${os}"] .tts-rate-slider');s.value=${v};s.dispatchEvent(new Event('input',{bubbles:true}));return document.querySelector('.tts-rate-row[data-os="${os}"] .tts-rate-val').textContent;})()`);
    const tryRate = () => E(`(async()=>{window.__spoken=[];window.speechSynthesis.speak=function(u){window.__spoken.push(u.rate);};window.speechSynthesis.cancel=function(){};
      document.querySelector('.tts-rate-try').click();await new Promise(r=>setTimeout(r,1200));return window.__spoken[0];})()`);
    for (const [os, ua, platform] of DEVICES) {
      await cdp.send('Emulation.setUserAgentOverride', {userAgent: ua, platform});
      await load(); await E("localStorage.removeItem('vn-app-tts-rate-v1')"); await load(); await openSettings();
      const rows = await E(`[...document.querySelectorAll('.tts-rate-row')].map(r=>r.dataset.os)`);
      ok(JSON.stringify(rows) === JSON.stringify([os]), `${os}: only this device's system is shown ${JSON.stringify(rows)}`);
      ok(await E('window.__ttsRates.os()') === os, `${os}: detected`);
      const d = await tryRate();
      ok(Math.abs(d - 0.92) < 1e-6, `${os}: default rate 0.92 (${d})`);
      ok(await setSlider(os, 1.3) === '1.30', `${os}: value shown`);
      const r1 = await tryRate();
      ok(Math.abs(r1 - 0.92 * 1.3) < 1e-6, `${os}: slider 1.30 -> Vietnamese rate ${r1}`);
      const meaning = await E(`(async()=>{window.__spoken=[];window.speechSynthesis.speak=function(u){window.__spoken.push(u.rate);};window.__ttsRates.speak({text:'안녕하세요', lang:'ko-KR'});await new Promise(r=>setTimeout(r,900));return window.__spoken[0];})()`);
      ok(meaning === 1, `${os}: the meaning voice keeps its own rate (${meaning})`);
      const other = DEVICES.find(x => x[0] !== os)[0];
      await E(`(function(){var o=JSON.parse(localStorage.getItem('vn-app-tts-rate-v1'));o['${other}']=0.6;localStorage.setItem('vn-app-tts-rate-v1',JSON.stringify(o));})()`);
      await load(); await openSettings();
      const r2 = await tryRate();
      ok(Math.abs(r2 - 0.92 * 1.3) < 1e-6, `${os}: another system's stored value changes nothing here (${r2})`);
      ok(await E(`document.querySelector('.tts-rate-row[data-os="${os}"] .tts-rate-val').textContent`) === '1.30', `${os}: value kept after a reload`);
      await E(`document.querySelector('.tts-rate-row[data-os="${os}"] .tts-rate-reset').click()`);
      ok(Math.abs((await tryRate()) - 0.92) < 1e-6, `${os}: reset -> default`);
      ok(await E('document.documentElement.scrollWidth<=innerWidth'), `${os}: no horizontal overflow`);
    }
    await cdp.send('Emulation.setUserAgentOverride', {userAgent: DEVICES[0][1], platform: 'Win32'});
    await load(); await E("localStorage.setItem('vn-app-tts-rate-v1','{\"windows\":9,\"mac\":\"x\"}')"); await load(); await openSettings();
    ok(await E('window.__ttsRates.factor()') === 1, 'an out-of-range / non-numeric stored value is ignored');
    await E(`window.setLang('en');1`); await sleep(500);
    const h4 = await E(`[...document.querySelectorAll('#panel-pron h4')].map(h=>h.textContent)`);
    ok(h4.indexOf('Reading speed') >= 0, 'English UI: heading translated');
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(bad ? 'TTS RATE TEST: PROBLEMS ' + bad : 'TTS RATE TEST OK'); process.exit(bad ? 1 : 0);
})();
