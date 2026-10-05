// Watchtower-only vocabulary (the study words that are not in the general [단어] list: tags only WT / 행누) in [복습]:
//   - not in [복습] > [어휘] > 전체 (cs / hu / id / zh_cn have no meaning for them, so they must not be asked there);
//   - all of them in [복습] > [어휘] > [파수대] (order / dictation always, meaning modes where the language has a meaning);
//   - still found by the [단어] search and its WT filter; a due spaced-review word shows the current language's meaning;
//   - the same entry everywhere: no second record, the spaced-review key is the word itself.
// Languages: ko, vi, cs, hu, id, zh_cn, fr, de, pl (plus en for the spaced-review meaning). Run build_app.py / assemble_app.py first.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8797;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'wt-iso-' + process.pid)], {stdio: 'ignore'});
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
    let script = null;
    const load = async storage => {
      if (script) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: script});
      const seed = `try{localStorage.clear();${Object.entries(storage || {}).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(v)});`).join('')}}catch(e){}`;
      script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `if(!sessionStorage.getItem('__wi')){sessionStorage.setItem('__wi','1');${seed}}`})).identifier;
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=${Date.now()}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await E("sessionStorage.removeItem('__wi')");
      await sleep(800);
    };
    const SEEN = JSON.stringify({tab: 'vocab', subtabs: {}, scrollY: 0});
    const key = `(x=>String(x).normalize('NFC').toLowerCase().replace(/\\s+/g,' ').trim())`;

    // an existing-looking Watchtower-only word to use for the spaced-review check: first WT-only entry with ko + en meanings
    await load({'vn-app-last-place-v1': SEEN});
    const facts = await E(`(()=>{const k=${key};
      const only=UNIFIED_WORDS.filter(w=>(w.tags||[]).length&&w.tags.every(t=>t==='WT'||t==='행누'));
      const withMean=only.find(w=>w.kr&&w.kr.ko&&w.kr.en);
      const cur=new Set(WATCHTOWER_VOCAB.flatMap(wk=>wk.words.map(w=>k(w.vi))));
      // the other [어휘] lists (not UNIFIED_WORDS) may spell a word the same way ("Đất Hứa"): that is their own entry, not a leak
      const other=new Set(); const add=v=>{ if(v) other.add(k(v)); };
      (typeof RHYME_GROUPS!=='undefined'?RHYME_GROUPS:[]).forEach(g=>g.families.forEach(f=>f.words.forEach(w=>{add(w.word); add(w.example);})));
      (typeof WORD_ORDER_REVERSED_EXTRA!=='undefined'?WORD_ORDER_REVERSED_EXTRA:[]).forEach(w=>{add(w.word); add(w.example);});
      (typeof VOCAB_GROUPS!=='undefined'?VOCAB_GROUPS:[]).forEach(g=>g.words.forEach(w=>add(w.word)));
      (typeof VOCAB_CHAIN!=='undefined'?VOCAB_CHAIN:[]).forEach(w=>add(w.word));
      (typeof VOCAB_THEO!=='undefined'?VOCAB_THEO:[]).forEach(w=>add(w.word));
      (typeof FREQ_VOCAB!=='undefined'?FREQ_VOCAB:[]).forEach(w=>add(w.vi));
      (typeof BIBLE_NAMES!=='undefined'?BIBLE_NAMES:[]).forEach(w=>add(w.vi));
      (typeof BASIC_WORD_GROUPS!=='undefined'?BASIC_WORD_GROUPS:[]).forEach(g=>g.words.forEach(w=>add(w.vi)));
      (typeof ANTONYM_PAIRS!=='undefined'?ANTONYM_PAIRS:[]).forEach(p=>{add(p.vi1); add(p.vi2);});
      (typeof DIALECT_WORDS!=='undefined'?DIALECT_WORDS:[]).forEach(d=>{add(d.north.replace(/[/].*$/,'')); add(d.south.replace(/[/].*$/,''));});
      return {other:[...other], onlyKeys:only.map(w=>k(w.vi)), n:only.length, probe:withMean?{vi:withMean.vi,ko:withMean.kr.ko,en:withMean.kr.en}:null, curated:[...cur], total:UNIFIED_WORDS.length,
        keys:new Set(UNIFIED_WORDS.map(w=>k(w.vi))).size};})()`);
    ok(facts.n >= 800 && facts.probe, `Watchtower-only words in [단어]: ${facts.n}`);
    const onlySet = new Set(facts.onlyKeys), otherList = new Set(facts.other);

    for (const lang of ['ko', 'vi', 'cs', 'hu', 'id', 'zh_cn', 'fr', 'de', 'pl']) {
      await E(`window.setLang('${lang}')`);
      await sleep(300);
      const r = await E(`(()=>{const k=${key};
        const pools={}; ['mcq','order','flash'].forEach(m=>{pools['all_'+m]=window.reviewModePool('vocab','all',m).map(p=>k(p.vi)); pools['wt_'+m]=window.reviewModePool('vocab','wt',m).map(p=>k(p.vi));});
        return pools;})()`);
      const leak = ['mcq', 'order', 'flash'].map(m => r['all_' + m].filter(x => onlySet.has(x) && !otherList.has(x)));
      ok(leak.every(a => a.length === 0), `${lang}: Watchtower-only words in [복습] > [어휘] > 전체: ${JSON.stringify(leak.map(a => a.slice(0, 3)))}`);
      const wtOrder = new Set(r.wt_order);
      ok(facts.curated.every(c => wtOrder.has(c)), `${lang}: every Watchtower word in [복습] > [어휘] > [파수대] (order): ${wtOrder.size}/${facts.curated.length}`);
      ok(facts.onlyKeys.every(c => wtOrder.has(c)), `${lang}: the ${facts.n} Watchtower-only words included`);
      // meaning modes: only words with this language's meaning (ko has them all; cs / hu / id / zh_cn have the 823 new words')
      if (lang === 'ko') ok(r.wt_mcq.length >= 1000, `ko: meaning modes of [파수대]: ${r.wt_mcq.length}`);
      if (['cs', 'hu', 'id', 'zh_cn', 'fr', 'de', 'pl'].includes(lang)) {
        ok(r.wt_mcq.length >= 800 && r.wt_flash.length >= 800, `${lang}: meaning modes of [파수대] ask ${r.wt_mcq.length} / ${r.wt_flash.length} words`);
        const probe = await E(`(()=>{const p=window.reviewModePool('vocab','wt','mcq').find(x=>x.vi==='anh em đồng đạo'); return p&&p.kr;})()`);
        ok(probe === ({cs: 'spoluvěřící', hu: 'hittárs', id: 'rekan seiman', zh_cn: '信仰上的弟兄姊妹', fr: 'compagnon chrétien', de: 'Glaubensbruder', pl: 'współwyznawca'})[lang], `${lang}: "anh em đồng đạo" is asked with its own ${lang} meaning: ${probe}`);
      }
      // on screen: [복습] > [어휘] > [파수대] opens without an error and shows a card or the "no meaning in this language" notice
      const ui = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        document.querySelector('.tab-btn[data-tab="review"]').click(); await sleep(300);
        document.querySelector('.subtab-btn[data-review="vocab"]').click(); await sleep(300);
        const b=document.querySelector('[data-review-scope="wt"]'); if(!b) return {btn:false}; b.click(); await sleep(500);
        const body=document.getElementById('study-body')||document.querySelector('#panel-review');
        return {btn:true, card:!!document.querySelector('.study-flash-card, .study-mcq-q, .study-order, .study-type'), empty:!!document.querySelector('.study-empty'), text:(document.querySelector('.study-empty')||{}).textContent||''};})()`);
      // Vietnamese is the studied language itself: it has no meaning mode anywhere (the notice points to 어순 배열 / 받아쓰기)
      ok(ui.btn && (lang === 'vi' ? ui.empty : (ui.card && !ui.empty)), `${lang}: [복습] > [어휘] > [파수대] ${lang === 'vi' ? 'shows the no-meaning notice' : 'shows a card'} ${JSON.stringify(ui)}`);
      // search + WT filter in [단어]
      const sr = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
        document.querySelector('.tab-btn[data-tab="vocab"]').click(); await sleep(250); document.querySelector('.subtab-btn[data-vocab="words"]').click(); await sleep(400);
        const q=document.getElementById('vocab-search'); q.value=${JSON.stringify(facts.probe.vi)}; q.dispatchEvent(new Event('input',{bubbles:true})); await sleep(400);
        const found=[...document.querySelectorAll('#vocab-root .bible-word')].map(x=>x.textContent.trim().toLowerCase());
        const tagged=!!document.querySelector('#vocab-root .word-tag-pill.tag-k-wt');
        q.value=''; q.dispatchEvent(new Event('input',{bubbles:true})); await sleep(200);
        return {found, tagged};})()`);
      ok(sr.found.includes(facts.probe.vi.toLowerCase()) && sr.tagged, `${lang}: [단어] search finds the Watchtower-only word "${facts.probe.vi}" with its WT tag ${JSON.stringify(sr)}`);
    }

    // spaced review: a due Watchtower-only word studied in Korean shows the English meaning under the English UI
    const today = new Date();
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(today.getTime() - 86400000), weekAgo = new Date(today.getTime() - 8 * 86400000);
    const k0 = facts.probe.vi.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
    const srs = {v: 1, words: {[k0]: {vi: facts.probe.vi, kr: facts.probe.ko, first: iso(weekAgo), last: iso(weekAgo), stage: 0, done: [], next: iso(yesterday)}}};
    await load({'vn-app-last-place-v1': SEEN, 'vn-app-srs-v1': JSON.stringify(srs)});
    const due = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); window.setLang('en'); await sleep(300);
      document.querySelector('.tab-btn[data-tab="review"]').click(); await sleep(300);
      document.querySelector('.subtab-btn[data-review="srs"]').click(); await sleep(600);
      const pool=(window.__studyState||{}).pool||[]; const it=pool.find(p=>p.vi===${JSON.stringify(facts.probe.vi)});
      const saved=JSON.parse(localStorage.getItem('vn-app-srs-v1')||'{}');
      return {n:pool.length, kr:it&&it.kr, keys:Object.keys((saved&&saved.words)||{})};})()`);
    ok(due.kr === facts.probe.en && due.keys.length === 1 && due.keys[0] === k0, `spaced review: due Watchtower-only word in English: "${due.kr}" (expected "${facts.probe.en}"), key kept ${JSON.stringify(due.keys)}`);

    ok(!errs.length, `errors ${errs.join(' | ').slice(0, 400)}`);
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- WT REVIEW ISOLATION TEST FAILED ---'); process.exit(1); }
  console.log('--- WT REVIEW ISOLATION TEST PASSED ---');
})();
