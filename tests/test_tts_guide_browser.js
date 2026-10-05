// [발음] > [설정] guide in the built sites (run build_app.py / assemble_app.py --site all first):
//   - every site shows "no sound?" (KakaoTalk) help first, then the five device cards, each with its speed/pitch part;
//     only JEONJU adds the home-screen card -- in all 12 UI languages, without raw markup or stray Hangul;
//   - the help card opens by itself inside KakaoTalk (user agent "KAKAOTALK") and stays closed elsewhere;
//   - no horizontal overflow at 390 / 430 / 1280 px in light and dark, no console or page errors.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8761;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SITES = ['', 'jw/', 'jeonju/', 'ulsan/', 'jw-study-english/', 'jw-study-chinese/', 'jw-study-indonesian/', 'jw-study-japanese/', 'jw-study-korean/'];
const LANGS = ['ko', 'vi', 'en', 'ja', 'zh', 'zh_cn', 'cs', 'de', 'fr', 'hu', 'id', 'pl'];
const DEVICES = ['samsung', 'android', 'ios', 'mac', 'windows'];
const ALLOWED_HANGUL = ['다른 브라우저로 열기', '2026-2027 전주 베트남어 학습반'];
const UA_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const UA_KAKAO = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 KAKAOTALK 10.8.0';

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'tts-guide-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true})).result.value;
    const open = async (site, ua) => {
      await cdp.send('Emulation.setUserAgentOverride', {userAgent: ua});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site}index.html`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(400);
    };
    const settings = lang => E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
      window.setLang(${JSON.stringify(lang)});await sleep(200);
      const tab=document.querySelector('.tab-btn[data-tab="pron"]');if(tab){tab.click();await sleep(200);}
      const sb=document.querySelector('.subtab-btn[data-pron="settings"]');if(sb){sb.click();await sleep(200);}
      const cards=[...document.querySelectorAll('[data-tts]')].filter(c=>c.getClientRects().length);
      const helpOpen=cards.length&&cards[0].getAttribute('data-open');
      cards.forEach(c=>c.setAttribute('data-open','true'));await sleep(120);
      const txt=cards.map(c=>c.innerText).join('\\n');
      return {ids:cards.map(c=>c.getAttribute('data-tts')),helpOpen,
        tune:cards.filter(c=>DEVICE_IDS.includes(c.getAttribute('data-tts'))&&c.querySelector('h4')).length,
        raw:/\\*\\*|\\{langs\\}|\\{site\\}|\\{url\\}|undefined|\\[object|NaN/.test(txt+cards.map(c=>c.innerHTML).join('')),
        hangul:txt.match(/[\\uac00-\\ud7a3][\\uac00-\\ud7a3 ]*[\\uac00-\\ud7a3]|[\\uac00-\\ud7a3]/g)||[],
        overflow:document.documentElement.scrollWidth>innerWidth+1};})()`.replace('DEVICE_IDS', JSON.stringify(DEVICES)));

    for (const site of SITES) {
      const name = site || 'general';
      const expected = ['help'].concat(site === 'jeonju/' ? ['home'] : [], DEVICES);
      errs = [];
      await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
      await cdp.send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: 'light'}]});
      await open(site, UA_SAFARI);
      for (const lang of LANGS) {
        const v = await settings(lang);
        ok(v && JSON.stringify(v.ids) === JSON.stringify(expected), `${name}/${lang}: cards ${v && JSON.stringify(v.ids)}`);
        ok(v && v.tune === DEVICES.length, `${name}/${lang}: speed/pitch part in ${v && v.tune} of 5 device cards`);
        ok(v && !v.raw, `${name}/${lang}: raw markup or placeholder`);
        ok(v && v.helpOpen === 'false', `${name}/${lang}: help card open outside KakaoTalk`);
        if (lang !== 'ko') {
          const stray = (v ? v.hangul : []).filter(h => !ALLOWED_HANGUL.some(a => a.includes(h)));
          ok(!stray.length, `${name}/${lang}: Hangul ${JSON.stringify(stray.slice(0, 3))}`);
        }
        ok(v && !v.overflow, `${name}/${lang}: overflow at 390px`);
      }
      for (const [w, h, mobile] of [[390, 844, true], [430, 932, true], [1280, 900, false]]) for (const theme of ['light', 'dark']) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: 1, mobile});
        await cdp.send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: theme}]});
        const v = await settings('ko');
        ok(v && !v.overflow, `${name}: overflow at ${w}px ${theme}`);
      }
      ok(!errs.length, `${name}: errors ${JSON.stringify(errs.slice(0, 3))}`);
    }
    // Inside KakaoTalk the help card is already open (first card, before any click).
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
    for (const site of ['', 'jeonju/', 'jw-study-english/']) {
      await open(site, UA_KAKAO);
      const v = await settings('ko');
      ok(v && v.ids[0] === 'help' && v.helpOpen === 'true', `${site || 'general'}: help card not open inside KakaoTalk (${v && v.helpOpen})`);
    }
    cdp.close();
  } finally {
    chrome.kill();
    server.kill();
  }
  console.log(`checks run: ${checks}`);
  if (failures.length) {
    failures.slice(0, 40).forEach(f => console.log('FAIL: ' + f));
    process.exit(1);
  }
  console.log('--- TTS GUIDE BROWSER TESTS PASSED ---');
})();
