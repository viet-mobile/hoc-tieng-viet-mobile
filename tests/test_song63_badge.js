// [오리지널 송] 63: the JW.ORG badges of its Vietnamese and Korean titles (their VIDEO links do not exist on jw.org, the official AUDIO does):
// exact strict share hrefs, only for languages that have the media, no <a> inside a <button>. Run build_app.py / assemble_app.py first.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const PORT = 8971, sleep = ms => new Promise(r => setTimeout(r, ms));
const F = 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=';
const failures = []; let checks = 0; const ok = (c, m) => { checks++; if (!c) failures.push(m); };
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(__dirname, '..', 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'b63-' + process.pid)], {stdio: 'ignore'});
  try {
    let t; for (let i = 0; i < 40 && !t; i++) { try { t = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(t.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true})).result.value;
    await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
    for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
    await sleep(800);
    const CODE = {ko: 'KO', ja: 'J', en: 'E', cs: 'B', vi: 'VT'};
    for (const lang of ['ko', 'ja', 'en']) {
      const r = await E(`(async()=>{const s=ms=>new Promise(r=>setTimeout(r,ms));window.setLang(${JSON.stringify(lang)});await s(300);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await s(300);document.querySelector('.subtab-btn[data-sentence="song"]').click();await s(500);
        [...document.querySelectorAll('.song-kind-tabs [role="tab"]')][1].click();await s(300);
        const card=document.querySelector('.song-acc[data-song-id="osg-63"]'); const row=card.querySelector('.song-acc-headrow');
        const links=[...row.querySelectorAll('a')].map(a=>({href:a.getAttribute('href'),text:a.textContent.trim(),inButton:!!a.closest('button')}));
        return {links,fullLinks:[...document.querySelectorAll('.song-acc[data-song-id="osg-63"] .song-full-link')].length};})()`);
      const tag = 'osg-63 ' + lang;
      const want = [F + 'VT&lank=pub-osg_63_AUDIO'].concat(lang === 'vi' ? [] : [F + CODE[lang] + '&lank=pub-osg_63_AUDIO']);
      ok(r.links.map(l => l.href).join('|') === want.join('|'), `${tag}: badges ${JSON.stringify(r.links.map(l => l.href))} want ${JSON.stringify(want)}`);
      ok(r.links.every(l => l.text === 'JW.ORG' && !l.inButton), `${tag}: text JW.ORG, no <a> inside a <button>`);
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- SONG 63 BADGE TEST FAILED ---'); process.exit(1); }
  console.log('--- SONG 63 BADGE TEST PASSED ---');
})();
