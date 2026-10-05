// [발음] > [성조] "베트남어 성조 ↔ 중국어(표준중국어) 성조 대응": each correspondence (단평성 ↔ 1성, ...) is a card that
// starts folded and opens / folds on its header, even though it sits inside another open card
// (template.html: `.group-card[data-open="false"] > .group-body`). Run build_app.py / assemble_app.py first.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8771;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'tone-zh-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
    for (const site of ['', 'jw/', 'jeonju/', 'ulsan/']) {
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site}index.html`});
      for (let i = 0; i < 240; i++) {
        const r = await cdp.send('Runtime.evaluate', {expression: "document.readyState==='complete'&&typeof window.setLang==='function'", returnByValue: true});
        if (r.result.value) break;
        await sleep(250);
      }
      await sleep(400);
      const v = (await cdp.send('Runtime.evaluate', {awaitPromise: true, returnByValue: true, expression: `(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        document.querySelector('.tab-btn[data-tab="pron"]').click();await sleep(200);
        document.querySelector('.subtab-btn[data-pron="tones"]').click();await sleep(300);
        const cards=[...document.querySelectorAll('[data-tonezh]')];
        const shown=c=>c.querySelector(':scope > .group-body').offsetHeight>0;
        const states=[];
        for(const c of cards){const head=c.querySelector('.group-head');const s=[shown(c)];head.click();await sleep(60);s.push(shown(c));head.click();await sleep(60);s.push(shown(c));states.push(s);}
        return {count:cards.length,states,nested:cards.every(c=>!!c.parentElement.closest('.group-card[data-open="true"]'))};})()`})).result.value;
      const name = site || 'general';
      ok(v && v.count === 9, `${name}: ${v && v.count} correspondence cards`);
      (v ? v.states : []).forEach((s, i) => ok(JSON.stringify(s) === '[false,true,false]', `${name}: card ${i} folded/open/folded = ${JSON.stringify(s)}`));
    }
    cdp.close();
  } finally {
    chrome.kill();
    server.kill();
  }
  console.log(`checks run: ${checks}`);
  if (failures.length) {
    failures.forEach(f => console.log('FAIL: ' + f));
    process.exit(1);
  }
  console.log('--- TONE CORRESPONDENCE FOLDING TESTS PASSED ---');
})();
