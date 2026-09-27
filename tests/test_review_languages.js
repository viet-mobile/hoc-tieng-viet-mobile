// [복습] language matrix: 12 UI languages x review categories, on the 4 Vietnamese profiles and the 5 JW Study
// sites (run build_app.py/assemble_app.py --profile all first).
//
// Vietnamese profiles (review language policy in app_logic.js, REVIEW_MODE_NEEDS):
//   - a TRANSLATION_REQUIRED pool (플래시카드/보기/듣기) holds only items with a meaning, and that meaning is the
//     item's own text in the UI language -- never Korean in another language, never anything in Vietnamese
//     (the studied language itself) except language-neutral answers (numbers, letters, the 호칭 table);
//   - a TARGET_ONLY pool (어순 배열/받아쓰기) keeps every item, with or without a meaning;
//   - real items from the shipped data are asked in their language (cs/zh_cn/hu/id/vi asserted by name);
//   - on screen, a card shows exactly that language's meaning.
// JW Study sites: per language, source and mode the review shows exactly the rows the data allows, recall asks
// with the row's own UI-language text, and listen/order never depend on a translation.
const {spawn} = require('child_process');
const path = require('path');
const assert = require('assert');
const {CDPClient} = require('./test_browser_runtime');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const LANGS = ['vi', 'cs', 'zh_cn', 'zh', 'en', 'fr', 'de', 'hu', 'id', 'ja', 'ko', 'pl'];
const VN_PROFILES = ['general', 'jw', 'jeonju', 'ulsan'];
const JW_SITES = ['jw_study_english', 'jw_study_chinese', 'jw_study_indonesian', 'jw_study_japanese', 'jw_study_korean'];

// Runs in the page of a Vietnamese profile.
async function vietnameseMatrix(LANGS) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];
  const check = (ok, msg) => { if (!ok) errors.push(msg); };
  const SCOPES = { pron: ['all', 'alphabet', 'tones', 'tonepairs', 'nsdiff'], bible: ['all', 'books', 'numbers', 'time', 'days', 'months'],
    wizard: ['all', 'main', 'reftable', 'talks', 'neighbor', 'daily'], vocab: ['all', 'rhyme', 'orderrev', 'groups', 'basic', 'antonym', 'freq', 'theo', 'names', 'chain', 'dialect'],
    sentence: ['all', 'lff', 'lpd', 'wt'], grammar: ['all', 'lessons', 'special', 'sentences'], song: ['all'] };
  // Answers that are not translations of the Vietnamese text: digits, alphabet letters, the 호칭 table's UI text.
  const NEUTRAL = { 'bible|numbers': 1, 'pron|alphabet': 1, 'wizard|reftable': 1, 'bible|all': 1, 'wizard|all': 1 };
  const keys = [...document.querySelectorAll('.subtab-btn[data-review]')].map(b => b.dataset.review);
  check(window.REVIEW_MODE_NEEDS && window.REVIEW_MODE_NEEDS.order === 'TARGET_ONLY' && window.REVIEW_MODE_NEEDS.type === 'TARGET_ONLY' &&
    ['flash', 'look', 'mcq'].every(m => window.REVIEW_MODE_NEEDS[m] === 'TRANSLATION_REQUIRED'), 'REVIEW_MODE_NEEDS');
  const counts = {};
  for (const lang of LANGS) {
    window.setLang(lang); await sleep(40);
    for (const key of keys) for (const scope of SCOPES[key] || ['all']) {
      const tr = window.reviewModePool(key, scope, 'mcq');
      const to = window.reviewModePool(key, scope, 'order');
      counts[lang + '|' + key + '|' + scope] = [tr.length, to.length];
      check(to.length >= tr.length, lang + ' ' + key + '/' + scope + ': target-only pool smaller than translation pool');
      check(tr.every(it => it.kr && it.kr.trim()), lang + ' ' + key + '/' + scope + ': item without meaning in a translation-required pool');
      if (lang !== 'ko' && key + '|' + scope !== 'pron|alphabet') {
        // Korean text where this language's is expected (a zh/ja line with a stray Hangul typo is still that
        // language's own line: "神에는名前があります。" in LPD's Japanese).
        const own = /^(zh|zh_cn|ja)$/.test(lang) ? /[\u3040-\u30ff\u4e00-\u9fff]/ : null;
        const kor = tr.filter(it => /[가-힣]/.test(it.kr) && !(own && own.test(it.kr)));
        check(!kor.length, lang + ' ' + key + '/' + scope + ': Korean meaning ' + (kor[0] && kor[0].kr));
      }
      if (lang === 'vi' && !NEUTRAL[key + '|' + scope]) check(!tr.length, 'vi ' + key + '/' + scope + ': a Vietnamese "meaning" of Vietnamese');
      if (lang === 'vi' && key + '|' + scope === 'wizard|all') check(tr.length === window.reviewModePool('wizard', 'reftable', 'mcq').length, 'vi wizard/all beyond the 호칭 table');
      check(!tr.concat(to).some(it => /\{\{[A-Z_]+\}\}/.test(it.vi + ' ' + it.kr)), lang + ' ' + key + '/' + scope + ': unfilled {{TOKEN}}');
    }
    const n = k => (counts[lang + '|' + k] || [0, 0]);
    // Material exists in every language: the target-only modes are never empty.
    ['vocab|all', 'grammar|all', 'pron|all'].forEach(k => { if (counts[lang + '|' + k]) check(n(k)[1] > 0, lang + ' ' + k + ': no target-only item'); });
    if (keys.includes('sentence')) ['sentence|all', 'sentence|lff', 'sentence|lpd', 'sentence|wt'].forEach(k => check(n(k)[1] > 0, lang + ' ' + k + ': no target-only item'));
    if (lang !== 'vi' && keys.includes('sentence')) check(n('sentence|all')[0] > 0, lang + ' sentence/all: no question with a meaning');
    if (lang !== 'vi' && keys.includes('song')) check(n('song|all')[0] > 0, lang + ' song/all: no question with a meaning');
  }
  // Real fixtures: a word and a sentence that have a meaning in the language are asked with exactly it.
  const fixtures = {};
  for (const lang of LANGS) {
    window.setLang(lang); await sleep(40);
    const words = window.reviewModePool('vocab', 'all', 'mcq');
    const w = (typeof UNIFIED_WORDS !== 'undefined' ? UNIFIED_WORDS : []).find(u => lang !== 'vi' && u.kr && u.kr[lang] && !words.some(p => p.vi === u.vi && p.kr !== u.kr[lang]));
    if (lang === 'vi') check(!words.length, 'vi: word review asks a Vietnamese meaning');
    else {
      check(!!w, lang + ': no UNIFIED_WORDS fixture with a ' + lang + ' meaning');
      if (w) { check(words.some(p => p.vi === w.vi && p.kr === w.kr[lang]), lang + ': word ' + w.vi + ' not asked with its ' + lang + ' meaning'); fixtures[lang] = { word: w.vi, meaning: w.kr[lang] }; }
    }
    if (typeof LFF_CONVERSATIONS !== 'undefined' && document.querySelector('.subtab-btn[data-review="sentence"]')) {
      const single = t => t && !/[.?!。？！][”"’)]*\s+\S/.test(t.trim().replace(/[.?!。？！]["”’)]*$/, ''));
      let line = null;
      LFF_CONVERSATIONS.some(r => r.lines.some(l => { if (l.vi && single(l.vi) && single(l[lang]) && l.vi.split(/\s+/).length >= 4 && !/[(:]/.test(l.vi)) { line = l; return true; } return false; }));
      const pool = window.reviewModePool('sentence', 'lff', lang === 'vi' ? 'order' : 'mcq');
      if (line && lang !== 'vi') {
        check(pool.some(p => p.kr === line[lang].trim()), lang + ': LFF sentence "' + line.vi + '" not asked with its ' + lang + ' translation');
        fixtures[lang] = Object.assign(fixtures[lang] || {}, { sentence: line.vi, translation: line[lang] });
      }
      if (lang === 'vi') check(pool.length > 0, 'vi: LFF sentences missing from 어순 배열');
    }
  }
  // cs / zh_cn / hu / id: the one word the word list has in these languages ("anh"), asked with exactly it.
  if (typeof UNIFIED_WORDS !== 'undefined') {
    const anh = UNIFIED_WORDS.find(u => u.vi === 'anh');
    for (const lang of ['cs', 'zh_cn', 'hu', 'id']) {
      window.setLang(lang); await sleep(40);
      const words = window.reviewModePool('vocab', 'all', 'mcq');
      check(anh && anh.kr[lang] && words.some(p => p.vi === 'anh' && p.kr === anh.kr[lang]), lang + ': "anh" not asked with its ' + lang + ' meaning');
      check(words.every(p => UNIFIED_WORDS.some(u => u.vi === p.vi && u.kr && u.kr[lang] === p.kr)), lang + ': a word meaning not from this language');
    }
  }
  // On screen: [복습] > [어휘] > 플래시카드 in cs shows the Czech meaning; [문장] > 보기 in each language shows its own.
  document.querySelector('.tab-btn[data-tab="review"]').click(); await sleep(40);
  window.setLang('cs'); await sleep(60);
  document.querySelector('.subtab-btn[data-review="vocab"]').click(); await sleep(60);
  document.querySelector('.study-mode-btn[data-mode="flash"]').click(); await sleep(60);
  const flashKr = document.getElementById('flash-kr');
  const anh = typeof UNIFIED_WORDS !== 'undefined' && UNIFIED_WORDS.find(u => u.vi === 'anh');
  check(flashKr && anh && flashKr.textContent.trim() === anh.kr.cs, 'cs 어휘 플래시카드 does not show the Czech meaning: ' + (flashKr && flashKr.textContent));
  if (document.querySelector('.subtab-btn[data-review="sentence"]')) {
    for (const lang of LANGS) {
      window.setLang(lang); await sleep(60);
      document.querySelector('.subtab-btn[data-review="sentence"]').click(); await sleep(40);
      document.querySelector('.study-mode-btn[data-mode="look"]').click(); await sleep(60);
      const choices = [...document.querySelectorAll('#look-choices .study-mcq-choice')].map(b => b.textContent.trim());
      const valid = new Set(window.reviewModePool('sentence', 'all', 'look').map(p => p.kr));
      if (lang === 'vi') check(!choices.length && !!document.querySelector('.study-empty'), 'vi 보기: expected the no-meaning note');
      else check(choices.length >= 2 && choices.every(c => valid.has(c)), lang + ' 보기: choices not this language\'s meanings');
      document.querySelector('.study-mode-btn[data-mode="order"]').click(); await sleep(60);
      check(document.querySelectorAll('#order-bank .study-chip').length > 0, lang + ' 어순 배열: no question');
    }
  }
  return { errors, fixtures, counts };
}

// Runs in the page of a JW Study site.
async function jwMatrix(LANGS) {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const errors = [];
  const FIELD = TARGET_SITE.field;
  const tok = t => { t = String(t).trim().replace(/^\d+\.\s+/, ''); return TARGET_SITE.tokenizer === 'han_char' ? (t.match(/\p{Script=Han}|[A-Za-z0-9Ａ-Ｚａ-ｚ０-９]+(?:[:.,][0-9０-９]+)*/gu) || []) : t.split(/\s+/).filter(Boolean); };
  for (const lang of LANGS) {
    window.setLang(lang); await sleep(40);
    document.querySelector('.tab-btn[data-tab="review"]').click(); await sleep(40);
    if (!document.getElementById('tg-rv-source')) { errors.push(lang + ': review panel not rendered'); continue; }
    const modes = [...document.querySelectorAll('[data-tg-mode]')].map(b => b.dataset.tgMode);
    if (lang !== FIELD && !modes.includes('recall')) errors.push(lang + ': recall missing');
    if (TARGET_SITE.features.includes('word_order') !== modes.includes('order')) errors.push(lang + ': word order mode does not follow the site');
    for (const src of ['all'].concat(TARGET_CORPUS.map(s => s.id))) {
      const sel = document.getElementById('tg-rv-source'); sel.value = src; sel.dispatchEvent(new Event('change')); await sleep(20);
      for (const mode of modes) {
        document.querySelector('[data-tg-mode="' + mode + '"]').click(); await sleep(20);
        const shown = Number(((document.querySelector('.tg-count') || {}).textContent || '0 / 0').split('/')[1]);
        let expected = 0; const texts = new Set();
        TARGET_CORPUS.forEach(s => { if (src !== 'all' && s.id !== src) return; s.units.forEach(u => u.rows.forEach(row => {
          const t = String(row[FIELD] || '').trim();
          if (t.length < 4 || !/\p{L}/u.test(t)) return;
          const tr = lang === FIELD ? null : (row[lang] || null);
          if (mode === 'recall' && !tr) return;
          if (mode === 'order') { const k = tok(t).length; if (TARGET_SITE.tokenizer === 'han_char' ? (k < 4 || k > 16) : (k < 3 || k > 12)) return; }
          else if (t.length > 220) return;
          expected++; if (tr) texts.add(tr);
        })); });
        if (shown !== expected) errors.push(lang + '/' + src + '/' + mode + ': shown ' + shown + ', data ' + expected);
        if (mode !== 'recall' && src === 'all' && !shown) errors.push(lang + '/' + mode + ': no question without a translation requirement');
        if (mode === 'recall' && shown) {
          for (let i = 0; i < Math.min(shown, 3); i++) {
            const prompt = document.querySelector('.tg-prompt').textContent.trim();
            if (!texts.has(prompt)) errors.push(lang + '/' + src + ': recall prompt is not a ' + lang + ' text: ' + prompt.slice(0, 40));
            document.getElementById('tg-next').click(); await sleep(10);
          }
        }
      }
    }
  }
  return { errors };
}

async function main() {
  const server = spawn('python', ['-m', 'http.server', '8095', '--directory', 'dist'], {stdio: 'ignore'});
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9229', '--no-first-run',
    '--user-data-dir=' + path.resolve('scratch', 'review-languages-' + process.pid),
  ], {stdio: 'ignore'});
  let cdp;
  const failures = [];
  try {
    let targets;
    for (let i = 0; i < 40; i++) {
      try { targets = await (await fetch('http://127.0.0.1:9229/json/list')).json(); break; }
      catch { await sleep(250); }
    }
    assert(targets, 'Chrome DevTools unavailable');
    cdp = new CDPClient(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
    const pageErrors = [];
    cdp.on('Runtime.exceptionThrown', e => pageErrors.push(e.exceptionDetails.text));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') pageErrors.push(e.args.map(a => a.value || a.description).join(' ')); });
    for (const site of VN_PROFILES.concat(JW_SITES)) {
      const dir = site === 'general' ? '' : site.replace(/_/g, '-') + '/';
      await cdp.send('Page.navigate', {url: 'http://127.0.0.1:8095/' + dir + 'index.html'});
      const vn = VN_PROFILES.includes(site);
      let ready = false;
      for (let i = 0; i < 160; i++) {
        const r = await cdp.send('Runtime.evaluate', {expression: `document.readyState === 'complete' && typeof window.setLang === 'function' && ${vn ? "typeof window.reviewModePool === 'function'" : "typeof TARGET_SITE !== 'undefined' && !!document.querySelector('.tab-btn[data-tab=\"review\"]')"}`, returnByValue: true});
        if (r.result.value) { ready = true; break; }
        await sleep(250);
      }
      assert(ready, site + ': page did not initialize');
      const fn = vn ? vietnameseMatrix : jwMatrix;
      const r = await cdp.send('Runtime.evaluate', {expression: `(${fn.toString()})(${JSON.stringify(LANGS)})`, awaitPromise: true, returnByValue: true});
      assert(!r.exceptionDetails, site + ': ' + JSON.stringify(r.exceptionDetails));
      const res = r.result.value;
      console.log((res.errors.length ? 'FAIL ' : 'PASS ') + site + (res.fixtures ? ' fixtures ' + JSON.stringify({cs: res.fixtures.cs, zh_cn: res.fixtures.zh_cn}) : ''));
      res.errors.slice(0, 10).forEach(e => console.log('   ' + e));
      failures.push(...res.errors.map(e => site + ': ' + e));
    }
    assert.deepStrictEqual(pageErrors, [], 'console/page errors');
    assert.deepStrictEqual(failures, []);
    console.log('--- REVIEW LANGUAGE MATRIX PASSED ---');
  } finally {
    if (cdp) cdp.close();
    chrome.kill();
    server.kill();
  }
}
main().catch(error => { console.error(error.message || error); process.exitCode = 1; });
