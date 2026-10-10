// A reload of the public site comes back to the screen it was on: tab, subtab, [노래] collection, the 왕국 노래 shown, the open cards.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const PORT = Number(process.env.RELOAD_TEST_PORT || 8995), sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(__dirname, '..', 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'reload-place-' + process.pid)], {stdio: 'ignore'});
  let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } else console.log('ok  ', m); };
  try {
    let targets; for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 1000, deviceScaleFactor: 1, mobile: false});
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true})).result.value;
    const load = async url => { await cdp.send('Page.navigate', {url}); for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); } await sleep(1200); };
    const state = () => E(`(function(){ var a=document.querySelector('.tab-btn[aria-selected="true"]'); var kind=document.querySelector('.song-kind-tabs [aria-selected="true"]');
      return { tab: a&&a.dataset.tab, sub: (document.querySelector('.subtab-btn[data-sentence][aria-selected="true"]')||{dataset:{}}).dataset.sentence,
        kind: kind&&kind.dataset.songkind, open: [].slice.call(document.querySelectorAll('.song-acc-head[aria-expanded="true"]')).map(function(h){return h.closest('.song-acc').dataset.songId;}),
        kingdom: (document.querySelector('#curr-songs-root .song-detail-number-badge')||{}).textContent }; })()`);
    for (const site of ['jeonju', 'jw']) {
      const url = `http://${site === 'jeonju' ? '127.0.0.1' : 'localhost'}:${PORT}/${site === 'jeonju' ? 'jeonju/' : 'jw/'}index.html`;   // own origin each: localStorage is per origin
      await load(url); await E("localStorage.clear()"); await load(url);
      await E(`(async function(){ var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms);});};
        document.querySelector('.tab-btn[data-tab="sentence"]').click(); await sleep(300);
        document.querySelector('.subtab-btn[data-sentence="song"]').click(); await sleep(700);
        document.getElementById('song-bar-next').click(); await sleep(500);
        [].slice.call(document.querySelectorAll('.song-kind-tabs [role="tab"]'))[1].click(); await sleep(500);
        ['osg-5','osg-23'].forEach(function(id){ var h=document.querySelector('.song-acc[data-song-id="'+id+'"] .song-acc-head'); if(h) h.click(); }); await sleep(600); return 1; })()`);
      const before = await state();
      ok(before.tab === 'sentence' && before.sub === 'song' && before.kind === 'original' && before.open.length === 2, site + ' before reload ' + JSON.stringify(before));
      await sleep(300);
      await cdp.send('Page.reload', {ignoreCache: false});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(1500);
      const after = await state();
      ok(after.tab === 'sentence' && after.sub === 'song', site + ' reload keeps the tab and subtab ' + JSON.stringify(after));
      ok(after.kind === 'original', site + ' reload keeps the collection');
      ok(JSON.stringify(after.open.slice().sort()) === JSON.stringify(['osg-23', 'osg-5']), site + ' reload keeps the open cards ' + JSON.stringify(after.open));
      await E(`[].slice.call(document.querySelectorAll('.song-kind-tabs [role="tab"]'))[0].click()`); await sleep(500);
      const k = await state();
      ok(/^2/.test(String(k.kingdom || '')), site + ' reload keeps the 왕국 노래 shown (' + k.kingdom + ')');
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(bad ? 'RELOAD PLACE TEST: PROBLEMS ' + bad : 'RELOAD PLACE TEST OK'); process.exit(bad ? 1 : 0);
})();
