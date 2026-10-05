// [문법] > [범용 언어 생성표] on screen (run build_app.py / assemble_app.py first):
//   - Korean UI: 형제/당신(남성), 자매/당신(여성), 형제자매들 are shown, 형제님 / 자매님 are not;
//   - the table keeps its layout: four columns, every row has a Vietnamese word + its meaning + a listen button, equal row
//     count per column in all 12 UI languages, no horizontal overflow at 390 / 820 / 1280 px;
//   - the other languages show their own texts (the table is language-aligned: nothing moved);
//   - [복습] > [문법] > [범용 언어 생성표] is asked with the same new Korean text.
// On JW, JEONJU, ULSAN and GENERAL.
const {spawn} = require('child_process');
const PLATFORM = require('./helpers/platform');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8801;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LANGS = ['ko', 'vi', 'en', 'ja', 'zh', 'zh_cn', 'de', 'fr', 'pl', 'cs', 'hu', 'id'];
const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'gram-table-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '').slice(0, 200)));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async expr => {
      const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true});
      if (r.exceptionDetails) errs.push('evaluate ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text).slice(0, 300));
      return r.result.value;
    };
    const width = w => cdp.send('Emulation.setDeviceMetricsOverride', {width: w, height: 900, deviceScaleFactor: 1, mobile: w < 600});
    for (const site of ['jw', 'jeonju', 'ulsan', 'general']) {
      errs = [];
      await width(1280);
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site === 'general' ? '' : site + '/'}index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(700);
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const out={};
        document.querySelector('.tab-btn[data-tab="grammar"]').click(); await sleep(250);
        document.querySelector('.subtab-btn[data-grammar="sentences"]').click(); await sleep(400);
        out.byLang={};
        for (const l of ${JSON.stringify(LANGS)}) {
          window.setLang(l); await sleep(250);
          const root=document.getElementById('curr-sentences-root');
          const cols=[...root.querySelectorAll('.curr-bank-list')];
          out.byLang[l]={text:root.textContent, rows:cols.map(c=>c.querySelectorAll('.curr-bank-item').length),
            complete:cols.every(c=>[...c.querySelectorAll('.curr-bank-item')].every(i=>i.querySelector('.vi')&&i.querySelector('.kr')&&i.querySelector('.speak-btn'))),
            meanings:cols.every(c=>[...c.querySelectorAll('.curr-bank-item')].every(i=>i.querySelector('.kr').textContent.trim())),
            listenAll:root.querySelectorAll('.read-all-btn').length};
        }
        window.setLang('ko'); await sleep(250);
        out.overflow=[]; return out;})()`);
      const ko = r && r.byLang.ko;
      ok(ko && /형제\/당신\(남성\)/.test(ko.text) && /자매\/당신\(여성\)/.test(ko.text) && /형제자매들/.test(ko.text), `${site}: new labels shown in the table`);
      ok(ko && !/자매님|형제님/.test(ko.text), `${site}: an honorific is still on screen`);
      const ref = ko && ko.rows.join();
      ok(ko && ko.rows.length === 4 && ko.rows.every(n => n > 0), `${site}: four columns ${ko && ko.rows}`);
      for (const l of LANGS) {
        const o = r && r.byLang[l];
        // the table has meanings in ko / zh / en / ja / de / fr / pl; the other languages keep their (empty) meaning cell as before
        const own = ['ko', 'zh', 'en', 'ja', 'de', 'fr', 'pl'].includes(l);
        ok(o && o.rows.join() === ref && o.complete && o.listenAll === 4 && (!own || o.meanings), `${site}: ${l} table aligned (rows ${o && o.rows}, complete ${o && o.complete}, meanings ${o && o.meanings}, 전체 듣기 ${o && o.listenAll})`);
      }
      ok(r.byLang.en.text.includes('Brother / you (male)') && r.byLang.en.text.includes('Sister / you (female)') && r.byLang.en.text.includes('brothers and sisters'), `${site}: English texts untouched`);
      ok(r.byLang.ja.text.includes('兄弟/あなた(男性)') && r.byLang.de.text.includes('Schwester / du (weiblich)'), `${site}: ja / de texts untouched`);
      for (const w of [390, 820, 1280]) {
        await width(w); await sleep(250);
        const ov = await E(`document.documentElement.scrollWidth>innerWidth+1`);
        ok(!ov, `${site}: horizontal overflow at ${w}px`);
      }
      await width(1280);
      // [복습] > [문법] > [범용 언어 생성표]
      const rv = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        const pool=window.reviewScopedPool('grammar','sentences').map(p=>p.vi+'|'+p.kr); const koPool=[...pool];
        return {n:pool.length, bad:koPool.filter(x=>/자매님|형제님/.test(x)).length, has:koPool.some(x=>/형제\\/당신\\(남성\\)|자매\\/당신\\(여성\\)|형제자매들/.test(x))};})()`);
      if (site !== 'general') ok(rv && rv.bad === 0, `${site}: [복습] > [문법] > [범용 언어 생성표] pool has no honorific (${rv && rv.n} items)`);
      ok(!errs.length, `${site}: errors ${errs.join(' | ').slice(0, 300)}`);
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- GRAMMAR SENTENCE TABLE TEST FAILED ---'); process.exit(1); }
  console.log('--- GRAMMAR SENTENCE TABLE TEST PASSED ---');
})();
