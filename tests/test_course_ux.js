// JEONJU learning UX (run build_app.py / assemble_app.py first):
//   1. opening the site lands on today's place in [과정]: Mon-Fri the homework week's weekday, Sat/Sun the week's card; the
//      date is the Korean calendar date; a link to somewhere else, another site or a first visit keeps its own place;
//   2. a week's Watchtower words are split over Monday-Friday (N/5, the first N%5 days one longer, in order); the lines of
//      [과정] show the real count and open exactly that day's words in [어휘] > [파수대]; the whole week stays reachable;
//   3. [어휘] > [파수대] shows the words, [문장] > [파수대] the example sentences; [복습] follows the same split;
//   4. [문장] > [대역 읽기] has 반복 듣기 and 묵음 like [복습], and 전체 듣기 plays accordingly (one serial speech engine).
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8795;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = {
  win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0',
  android: 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
};
const FAKE_TTS = apple => `(() => {
  const log = window.__tts = []; let cur = null, timers = [], lastCancel = -1e9;
  const synth = { get speaking() { return !!cur; }, pending: false, paused: false, getVoices() { return []; }, addEventListener() {}, removeEventListener() {}, pause() {}, resume() {},
    cancel() { lastCancel = Date.now(); timers.forEach(clearTimeout); timers = []; if (cur) { const u = cur; cur = null; setTimeout(() => u.onerror && u.onerror({error: 'interrupted'}), 5); } },
    speak(u) { log.push({ev: 'speak', text: u.text, lang: u.lang, t: Date.now()}); if (${apple} && Date.now() - lastCancel < 150) return; cur = u;
      timers.push(setTimeout(() => { log.push({ev: 'start', text: u.text, lang: u.lang}); u.onstart && u.onstart();
        timers.push(setTimeout(() => { cur = null; u.onend && u.onend(); }, 120)); }, 20)); } };
  Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.rate = 1; this.voice = null; };
})();`;

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'course-ux-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Network.enable');
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '').slice(0, 200)));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async (expr, gesture = true) => {
      const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: gesture});
      if (r.exceptionDetails) errs.push('evaluate ' + ((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text).slice(0, 300));
      return r.result.value;
    };
    let script = null;
    // opts: site, storage (localStorage seed, once per load), nowMs (fake Date.now), hash/query, ua, apple
    const load = async o => {
      if (script) await cdp.send('Page.removeScriptToEvaluateOnNewDocument', {identifier: script});
      const seed = `try{localStorage.clear();${Object.entries(o.storage || {}).map(([k, v]) => `localStorage.setItem(${JSON.stringify(k)},${JSON.stringify(v)});`).join('')}}catch(e){}`;
      const fake = o.nowMs ? `(()=>{const T=${o.nowMs};Date.now=()=>T;})();` : '';
      const src = `if(!sessionStorage.getItem('__cuinit')){sessionStorage.setItem('__cuinit','1');${seed}}` + fake + FAKE_TTS(!!o.apple);
      script = (await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: src})).identifier;
      await cdp.send('Network.setUserAgentOverride', {userAgent: o.ua || UA.win});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${o.site || 'jeonju'}/index.html${o.query || (o.hash ? '?fresh=' + Date.now() : '')}${o.hash || ''}`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'", false)) break; await sleep(250); }
      await E("sessionStorage.removeItem('__cuinit')", false);
      await sleep(900);
    };
    const SEEN = JSON.stringify({tab: 'vocab', subtabs: {}, scrollY: 0});   // a returning visitor's saved place
    const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const addDays = (isoDate, n) => { const d = new Date(isoDate + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
    const kstNoon = isoDate => Date.parse(isoDate + 'T03:00:00Z');   // 12:00 in Seoul

    // ============ 1. date helpers (pure) ============
    await load({storage: {'vn-app-last-place-v1': SEEN}});
    const pure = await E(`(()=>{const w=window.__courseWeekOf, t=window.__courseTodayIso, o={};
      ['2026-10-05','2026-10-09','2026-10-10','2026-10-11','2026-10-12','2026-12-31','2027-01-01','2027-01-03','2027-01-04','2028-02-29','2028-03-01','2026-10-31','2026-11-01','2026-11-02'].forEach(d=>o[d]=w(d));
      o.utcPrev=t(Date.UTC(2026,9,5,15,30)); o.utcSame=t(Date.UTC(2026,9,5,14,30)); o.newYear=t(Date.UTC(2026,11,31,15,0)); o.leap=t(Date.UTC(2028,1,28,15,30)); o.kstLate=t(Date.UTC(2026,9,5,23,59)); return o;})()`, false);
    const exp = {'2026-10-05': ['2026-10-05', 0], '2026-10-09': ['2026-10-05', 4], '2026-10-10': ['2026-10-05', -1], '2026-10-11': ['2026-10-05', -1], '2026-10-12': ['2026-10-12', 0],
      '2026-12-31': ['2026-12-28', 3], '2027-01-01': ['2026-12-28', 4], '2027-01-03': ['2026-12-28', -1], '2027-01-04': ['2027-01-04', 0], '2028-02-29': ['2028-02-28', 1],
      '2028-03-01': ['2028-02-28', 2], '2026-10-31': ['2026-10-26', -1], '2026-11-01': ['2026-10-26', -1], '2026-11-02': ['2026-11-02', 0]};
    for (const [d, [m, day]] of Object.entries(exp)) ok(pure && pure[d].monday === m && pure[d].day === day, `week of ${d}: ${JSON.stringify(pure && pure[d])} expected ${m}/${day}`);
    ok(pure && pure.utcPrev === '2026-10-06' && pure.utcSame === '2026-10-05' && pure.newYear === '2027-01-01' && pure.leap === '2028-02-29' && pure.kstLate === '2026-10-06',
      `Korean calendar date from the instant: ${JSON.stringify(pure && [pure.utcPrev, pure.utcSame, pure.newYear, pure.leap, pure.kstLate])}`);
    const mondays = await E(`[...document.querySelectorAll('#panel-curriculum .curr-assign-card[data-hw-monday]')].map(c=>c.dataset.hwMonday).filter(Boolean)`, false);
    ok(mondays && mondays.length >= 18, `homework cards with a Monday: ${mondays && mondays.length}`);
    const sorted = [...new Set(mondays)].sort();
    const picks = [sorted[0], sorted[Math.floor(sorted.length / 2)], sorted[sorted.length - 1]];

    // ============ 1b. landing: Monday..Sunday of a few weeks ============
    const NAMES = ['월', '화', '수', '목', '금'];
    for (const M of picks) {
      for (let off = 0; off < 7; off++) {
        const day = addDays(M, off);
        await load({storage: {'vn-app-last-place-v1': SEEN}, nowMs: kstNoon(day)});
        const r = await E(`(()=>{const c=document.querySelector('#panel-curriculum .curr-assign-card.curr-today-week'), d=document.querySelector('#panel-curriculum .curr-today');
          return {tab:document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab, monday:c&&c.dataset.hwMonday, open:c&&c.dataset.open, day:d&&d.dataset.day, dayCard:d&&d.closest('.curr-assign-card').dataset.hwMonday,
            groupOpen:!!(c&&c.closest('.group-card')&&c.closest('.group-card').dataset.open==='true')};})()`, false) || {};
        const weekday = off < 5 ? NAMES[off] : null;
        ok(r.tab === 'curriculum' && r.monday === M && r.open === 'true' && (weekday ? r.day === weekday && r.dayCard === M : !r.day),
          `${day} (+${off}) lands on ${M} ${weekday || 'week card'}: ${JSON.stringify(r)}`);
      }
    }
    // the Korean date, not the UTC one: 00:30 KST on a Tuesday is still Monday in UTC
    {
      const tue = addDays(picks[1], 1), at = Date.parse(tue + 'T00:30:00+09:00');
      await load({storage: {'vn-app-last-place-v1': SEEN}, nowMs: at});
      const d = await E(`(document.querySelector('#panel-curriculum .curr-today')||{dataset:{}}).dataset.day`, false);
      ok(d === '화', `00:30 KST Tuesday (Monday in UTC) lands on 화: ${d}`);
      const sun = addDays(picks[1], 6), at2 = Date.parse(sun + 'T23:59:00+09:00');
      await load({storage: {'vn-app-last-place-v1': SEEN}, nowMs: at2});
      const w2 = await E(`(document.querySelector('#panel-curriculum .curr-assign-card.curr-today-week')||{dataset:{}}).dataset.hwMonday`, false);
      ok(w2 === picks[1], `Sunday 23:59 KST stays in its Monday-start week: ${w2}`);
    }
    // ============ 1c. no landing: a link, another site, a first visit; no forcing back ============
    const mid = kstNoon(addDays(picks[1], 2));
    for (const [label, o] of [['hash', {hash: '#song-12'}], ['query', {query: '?review=1'}]]) {
      await load(Object.assign({storage: {'vn-app-last-place-v1': SEEN}, nowMs: mid}, o));
      const t = await E(`document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab`, false);
      ok(t === 'vocab', `a link with a ${label} keeps its place (saved place), got ${t}`);
    }
    await load({storage: {'vn-app-last-place-v1': SEEN}, nowMs: mid, query: '?fresh=1'});
    ok(await E(`document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab`, false) === 'curriculum', 'a harmless query still lands');
    await load({site: 'ulsan', storage: {'vn-app-last-place-v1': SEEN}, nowMs: mid});
    ok(await E(`document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab`, false) === 'vocab', 'ULSAN keeps its saved place (no landing)');
    await load({site: 'jw', storage: {'vn-app-last-place-v1': SEEN}, nowMs: mid});
    ok(await E(`document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab`, false) === 'vocab', 'JW keeps its saved place (no landing)');
    await load({storage: {}, nowMs: mid});
    ok(await E(`document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab`, false) === 'pron', 'a first visit still opens the voice set-up guide ([발음] > [설정])');
    await load({storage: {'vn-app-last-place-v1': SEEN}, nowMs: Date.parse('2030-01-02T03:00:00Z')});
    ok(await E(`document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab`, false) === 'vocab', 'a date outside the course keeps the saved place');
    await load({storage: {'vn-app-last-place-v1': SEEN}, nowMs: mid});
    await E(`(async()=>{document.querySelector('.tab-btn[data-tab="vocab"]').click(); await new Promise(r=>setTimeout(r,2500));})()`, false);
    ok(await E(`document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab`, false) === 'vocab', 'after the landing the learner can go anywhere and stays there');

    // ============ 2. daily Watchtower split ============
    await load({storage: {'vn-app-last-place-v1': SEEN}});
    const split = await E(`(()=>{const o={}; [50,52,48,43,5,3,47,23,30,39,38,0,1,4,7,1127].forEach(n=>o[n]=window.__wtDaySplit(n)); return o;})()`, false);
    const want = {50: [10, 10, 10, 10, 10], 52: [11, 11, 10, 10, 10], 48: [10, 10, 10, 9, 9], 43: [9, 9, 9, 8, 8], 5: [1, 1, 1, 1, 1], 3: [1, 1, 1, 0, 0]};
    for (const [n, sizes] of Object.entries(want)) ok(JSON.stringify(split[n].map(p => p[1] - p[0])) === JSON.stringify(sizes), `split of ${n}: ${JSON.stringify(split[n])}`);
    for (const [n, parts] of Object.entries(split)) {
      const N = +n, sizes = parts.map(p => p[1] - p[0]);
      ok(parts[0][0] === 0 && parts[4][1] === N && parts.every((p, i) => i === 0 || p[0] === parts[i - 1][1]) && Math.max(...sizes) - Math.min(...sizes) <= (N ? 1 : 0),
        `split of ${n} is consecutive, complete, even (<=1): ${JSON.stringify(sizes)}`);
    }
    // every Watchtower line of [과정]: the real count, the stored range, the collection's own split
    await E(`window.setLang('ko'); 0`, false);
    const lines = await E(`(()=>{const flat=[]; WATCHTOWER_VOCAB.forEach((wk,wi)=>wk.words.forEach(w=>flat.push({wi,vi:w.vi})));
      const starts=[]; let p=0; WATCHTOWER_VOCAB.forEach(wk=>{starts.push(p); p+=wk.words.length;});
      const rows=[...document.querySelectorAll('#panel-curriculum .curr-assign-row')].map(r=>{const m=/오늘의 파수대 어휘 (\\d+)개 학습/.exec(r.textContent); const b=r.querySelector('.curr-link-btn');
        return m?{n:+m[1],s:+b.dataset.gotoVrStart,e:+b.dataset.gotoVrEnd,tab:b.dataset.gotoTab,sub:b.dataset.gotoSubval,card:r.closest('.curr-assign-card').dataset.hwMonday||'',day:r.closest('.curr-assign-day-group').dataset.day}:null;}).filter(Boolean);
      return {rows, starts, lens:WATCHTOWER_VOCAB.map(wk=>wk.words.length)};})()`, false);
    ok(lines && lines.rows.length >= 60, `Watchtower lines in [과정]: ${lines && lines.rows.length}`);
    // the review week's lines open a review (no slice): they keep their text; every other line is a slice of [어휘] > [파수대]
    const reviewRows = lines.rows.filter(r => r.tab === 'review');
    lines.rows = lines.rows.filter(r => r.tab !== 'review');
    ok(reviewRows.every(r => r.n === 10), `review-week lines keep their text (${reviewRows.length})`);
    const nSeen = new Set(lines.rows.map(r => r.n));
    ok([...nSeen].some(n => n !== 10) && lines.rows.every(r => r.n === r.e - r.s && r.tab === 'vocab' && r.sub === 'wt'), `real counts, to [어휘] > [파수대]: ${[...nSeen]}`);
    // group per week (consecutive lines of one card): partition of one collection
    const weeks = []; let curW = null;
    lines.rows.forEach(r => { if (!curW || curW.card !== r.card || r.s < curW.rows[curW.rows.length - 1].s) { curW = {card: r.card, rows: []}; weeks.push(curW); } curW.rows.push(r); });
    let weeksOk = 0;
    for (const w of weeks) {
      const S = w.rows[0].s, ci = lines.starts.indexOf(S);
      if (ci < 0 || w.rows.length !== 5) continue;
      const N = lines.lens[ci], sz = [];
      let pos = S;
      const parts = w.rows.every(r => { const good = r.s === pos; pos = r.e; return good; });
      const wantSizes = split[N] ? split[N].map(p => p[1] - p[0]) : null;
      if (parts && pos === S + N && (!wantSizes || JSON.stringify(w.rows.map(r => r.n)) === JSON.stringify(wantSizes))) weeksOk++;
      else failures.push(`a week of [과정] lines (${w.card}) does not partition collection ${ci + 1} (N=${N}): ${JSON.stringify(w.rows.map(r => [r.s, r.e, r.n]))}`);
    }
    checks++;
    ok(weeksOk >= 12, `weeks whose 5 daily lines partition a whole collection exactly: ${weeksOk}/${weeks.length}`);
    ok(new Set(weeks.map(w => w.rows.map(r => r.n).join())).size >= 3, `the weeks differ (not all 10s): ${[...new Set(weeks.map(w => w.rows.map(r => r.n).join()))].slice(0, 5)}`);
    // the same line in 12 languages carries the same number
    const langs = ['ko', 'vi', 'en', 'ja', 'zh', 'zh_cn', 'de', 'fr', 'pl', 'cs', 'hu', 'id'];
    const probe = lines.rows.find(r => r.n !== 10) || lines.rows[0];
    const perLang = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const out={};
      for (const l of ${JSON.stringify(langs)}) { window.setLang(l); await sleep(300);
        const b=[...document.querySelectorAll('#panel-curriculum .curr-link-btn')].find(x=>x.dataset.gotoVrStart==='${probe.s}'&&x.dataset.gotoVrEnd==='${probe.e}'&&x.dataset.gotoSubval==='wt');
        out[l]=b?b.closest('.curr-assign-row').querySelector('.curr-assign-text').textContent:null; }
      window.setLang('ko'); return out;})()`, false);
    for (const l of langs) ok(perLang && perLang[l] && perLang[l].includes(String(probe.n)) && (probe.n === 10 || !/\b10\b|10개|10個|10个/.test(perLang[l])), `${l}: "${perLang && perLang[l]}" shows ${probe.n}`);

    // ============ 2b. shortcut opens exactly that day ============
    const samples = [lines.rows.reduce((a, b) => (b.n < a.n ? b : a)), lines.rows.reduce((a, b) => (b.n > a.n ? b : a)), probe].filter((r, i, a) => a.findIndex(x => x.s === r.s) === i);
    for (const r of samples) {
      await load({storage: {'vn-app-last-place-v1': SEEN}});
      await E(`window.setLang('ko'); document.querySelector('.tab-btn[data-tab="curriculum"]').click(); 0`, false);
      const res = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); await sleep(300);
        const b=[...document.querySelectorAll('#panel-curriculum .curr-link-btn')].find(x=>x.dataset.gotoVrStart==='${r.s}'&&x.dataset.gotoVrEnd==='${r.e}'&&x.dataset.gotoSubval==='wt'); b.click(); await sleep(500);
        const flat=[]; WATCHTOWER_VOCAB.forEach(wk=>wk.words.forEach(w=>flat.push(w.vi)));
        const rows=[...document.querySelectorAll('#vocab-root .rhyme-word-row .rw-word')].map(x=>x.textContent);
        const out={tab:document.querySelector('.tab-btn[aria-selected="true"]').dataset.tab, sub:document.querySelector('.subtab-btn[data-vocab][aria-selected="true"]').dataset.vocab, rows, want:flat.slice(${r.s},${r.e}),
          banner:(document.querySelector('#vocab-root .vocab-focus-banner')||{}).textContent||'', sentences:document.querySelectorAll('#vocab-root .rhyme-word-ex').length};
        document.querySelector('#vocab-root .vocab-focus-clear').click(); await sleep(400);
        out.allRows=document.querySelectorAll('#vocab-root .rhyme-word-row').length; out.allCards=document.querySelectorAll('#vocab-root .group-card').length; out.total=flat.length; out.weeks=WATCHTOWER_VOCAB.length;
        return out;})()`, false) || {};
      ok(res.tab === 'vocab' && res.sub === 'wt' && res.rows.length === r.n && JSON.stringify(res.rows) === JSON.stringify(res.want) && res.sentences === 0,
        `shortcut of ${r.n} words (${r.s}-${r.e}): ${JSON.stringify([res.tab, res.sub, res.rows && res.rows.length])}`);
      ok(res.allRows === res.total && res.allCards === res.weeks, `전체 보기: the whole study (${res.allRows}/${res.total} words, ${res.allCards}/${res.weeks} weeks)`);
    }

    // ============ 3. words in [어휘], sentences in [문장], [복습] follows ============
    await load({storage: {'vn-app-last-place-v1': SEEN}});
    const split3 = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const o={}; window.setLang('ko');
      o.vocabBtn=!!document.querySelector('.subtab-btn[data-vocab="wt"]');
      document.querySelector('.tab-btn[data-tab="vocab"]').click(); await sleep(200); document.querySelector('.subtab-btn[data-vocab="wt"]').click(); await sleep(500);
      o.wRows=document.querySelectorAll('#vocab-root .rhyme-word-row .rw-word').length; o.wEx=document.querySelectorAll('#vocab-root .rhyme-word-ex').length;
      o.wReadAll=[...document.querySelectorAll('#vocab-root .read-all-btn')].length;
      const q=document.getElementById('vocab-search'); q.value='cung cấp'; q.dispatchEvent(new Event('input',{bubbles:true})); await sleep(300);
      o.wSearch=[...document.querySelectorAll('#vocab-root .rw-word')].map(x=>x.textContent); q.value=''; q.dispatchEvent(new Event('input',{bubbles:true}));
      document.querySelector('.tab-btn[data-tab="sentence"]').click(); await sleep(200); document.querySelector('.subtab-btn[data-sentence="wt"]').click(); await sleep(500);
      o.sRows=document.querySelectorAll('#curr-wt-root .rhyme-word-row').length; o.sWords=document.querySelectorAll('#curr-wt-root .rw-word').length; o.sEx=document.querySelectorAll('#curr-wt-root .rhyme-word-ex').length;
      const ws=document.getElementById('wt-search'); ws.value='thức ăn thiêng liêng'; ws.dispatchEvent(new Event('input',{bubbles:true})); await sleep(300);
      o.sSearchEx=[...document.querySelectorAll('#curr-wt-root .rhyme-word-ex .vn')].map(x=>x.textContent); ws.value=''; ws.dispatchEvent(new Event('input',{bubbles:true}));
      o.expectWords=WATCHTOWER_VOCAB.reduce((a,wk)=>a+wk.words.length,0); o.expectSent=WATCHTOWER_VOCAB.reduce((a,wk)=>a+wk.words.filter(w=>w.example&&w.example_mean).length,0);
      // [복습]
      const words=window.reviewScopedPool('vocab','wt'), sents=window.reviewScopedPool('sentence','wt');
      const wordSet=new Set(WATCHTOWER_VOCAB.flatMap(wk=>wk.words.map(w=>w.vi))), exSet=new Set(WATCHTOWER_VOCAB.flatMap(wk=>wk.words.map(w=>w.example)));
      o.rvWords=words.length; o.rvWordsAllWords=words.every(x=>wordSet.has(x.vi)); o.rvSent=sents.length; o.rvSentAllExamples=sents.every(x=>[...exSet].some(e=>e===x.vi||e.indexOf(x.vi)>=0)||true);
      o.rvSentNoWord=sents.filter(x=>wordSet.has(x.vi)&&!exSet.has(x.vi)).length;
      document.querySelector('.tab-btn[data-tab="review"]').click(); await sleep(400);
      document.querySelector('.subtab-btn[data-review="vocab"]').click(); await sleep(400);
      o.rvScopeVocab=!!document.querySelector('#study-scope-row [data-review-scope="wt"], [data-review-scope="wt"]');
      const sb=document.querySelector('[data-review-scope="wt"]'); if(sb){ sb.click(); await sleep(400); }
      o.rvVocabCard=(document.querySelector('.study-flash-vi')||{}).textContent; o.rvVocabIsWord=wordSet.has(o.rvVocabCard);
      document.querySelector('.subtab-btn[data-review="sentence"]').click(); await sleep(400);
      const sb2=document.querySelector('[data-review-scope="wt"]'); if(sb2){ sb2.click(); await sleep(400); }
      o.rvSentCard=(document.querySelector('.study-flash-vi')||{}).textContent; o.rvSentIsWord=wordSet.has(o.rvSentCard);
      return o;})()`, false) || {};
    ok(split3.vocabBtn, '[어휘] has the [파수대] subtab');
    ok(split3.wRows === split3.expectWords && split3.wEx === 0, `[어휘] > [파수대]: ${split3.wRows}/${split3.expectWords} words and no sentences (${split3.wEx})`);
    ok(split3.wSearch && split3.wSearch.length >= 1 && split3.wSearch.every(w => /cung cấp/i.test(w)), `[어휘] > [파수대] search by word: ${JSON.stringify(split3.wSearch)}`);
    ok(split3.sRows === split3.expectSent && split3.sWords === 0 && split3.sEx === split3.expectSent, `[문장] > [파수대]: ${split3.sRows} sentence rows, ${split3.sWords} words (expected ${split3.expectSent}, 0)`);
    ok(split3.sSearchEx && split3.sSearchEx.length >= 1 && split3.sSearchEx.every(x => /thức ăn thiêng liêng/i.test(x)), `[문장] > [파수대] search by sentence: ${JSON.stringify(split3.sSearchEx)}`);
    ok(split3.rvWords > 1000 && split3.rvWordsAllWords && split3.rvSent > 1000 && split3.rvSentNoWord === 0, `[복습] pools: words ${split3.rvWords} (all study words: ${split3.rvWordsAllWords}), sentences ${split3.rvSent} (words inside: ${split3.rvSentNoWord})`);
    ok(split3.rvScopeVocab && split3.rvVocabIsWord && !split3.rvSentIsWord, `[복습] > [어휘] > [파수대] quizzes words (${split3.rvVocabCard}); [문장] > [파수대] sentences (${split3.rvSentCard})`);
    // GENERAL has no Watchtower
    await load({site: 'general', storage: {'vn-app-last-place-v1': SEEN}});
    ok(await E(`!document.querySelector('.subtab-btn[data-vocab="wt"]')`, false), 'GENERAL has no [어휘] > [파수대]');

    // SRS identity: studying a day's words registers the same word keys
    await load({storage: {'vn-app-last-place-v1': SEEN}});
    const srs = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
      document.querySelector('.tab-btn[data-tab="curriculum"]').click(); await sleep(300);
      const b=[...document.querySelectorAll('#panel-curriculum .curr-link-btn')].find(x=>x.dataset.gotoSubval==='wt'); const s=+b.dataset.gotoVrStart, e=+b.dataset.gotoVrEnd; b.click(); await sleep(500);
      document.querySelector('#vocab-root .vocab-focus-srs').click(); await sleep(300);
      const flat=[]; WATCHTOWER_VOCAB.forEach(wk=>wk.words.forEach(w=>flat.push(w.vi)));
      const saved=JSON.parse(localStorage.getItem('vn-app-srs-v1')||'{}'), keys=Object.keys((saved&&saved.words)||{});
      const norm=x=>x.normalize('NFC').toLowerCase().replace(/\\s+/g,' ').trim();
      return {n:e-s, want:[...new Set(flat.slice(s,e).map(norm))], keys};})()`, false) || {};
    ok(srs.want && srs.want.length > 0 && srs.want.every(k => srs.keys.includes(k)) && srs.keys.length === srs.want.length, `daily words enter the spaced review under their own word key (${srs.keys && srs.keys.length}/${srs.want && srs.want.length})`);

    // ============ 4. [대역 읽기]: 반복 듣기 + 묵음 ============
    for (const [name, ua, apple] of [['windows', UA.win, false], ['android', UA.android, false], ['iphone', UA.iphone, true]]) {
      for (const rep of [1, 2, 3]) {
        for (const scope of ['', 'meaning', 'vi', 'both']) {
          await load({ua, apple, storage: {'vn-app-last-place-v1': SEEN, 'vn-app-vi-repeat': String(rep), 'vn-app-mute-scope': scope}});
          await cdp.send('Input.dispatchMouseEvent', {type: 'mousePressed', x: 2, y: 2, button: 'left', clickCount: 1});
          await cdp.send('Input.dispatchMouseEvent', {type: 'mouseReleased', x: 2, y: 2, button: 'left', clickCount: 1});
          const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); window.setLang('ko');
            document.querySelector('.tab-btn[data-tab="sentence"]').click(); await sleep(200); document.querySelector('.subtab-btn[data-sentence="reader"]').click(); await sleep(500);
            const root=document.getElementById('bilingual-reader-root'), o={};
            o.repeat=(root.querySelector('.repeat-count-select')||{}).value; o.toggle=!!root.querySelector('.mute-autoplay-toggle'); o.scopeOpts=[...root.querySelectorAll('.mute-scope-select option')].map(x=>x.textContent).join('/');
            o.checked=!!(root.querySelector('.mute-autoplay-toggle')||{}).checked; o.sel=(root.querySelector('.mute-scope-select')||{}).value;
            const btn=root.querySelector('.reader-toolbar .read-all-btn'); o.hasBtn=!!btn; o.entries=btn?window.__READALL_REGISTRY[btn.dataset.readall].length:0;
            if (btn) { window.__tts.length=0; const first=window.__READALL_REGISTRY[btn.dataset.readall][0]; o.first=first; btn.click(); let w=0; while(!window.__tts.some(x=>x.ev==='start'&&x.t===undefined)&&w<0){w++;}
              await sleep(4500); btn.dataset.playing==='true' && btn.click(); o.log=window.__tts.filter(x=>x.ev==='start').map(x=>x.lang).slice(0,8); o.texts=window.__tts.filter(x=>x.ev==='start').map(x=>x.text.slice(0,12)).slice(0,8); }
            return o;})()`) || {};
          const tag = `${name} repeat=${rep} mute="${scope}"`;
          ok(r.repeat === String(rep) && r.toggle && r.scopeOpts === '한/베/베한', `${tag}: controls (repeat ${r.repeat}, options ${r.scopeOpts})`);
          ok(r.checked === !!scope && (!scope || r.sel === scope), `${tag}: mute state shown (${r.checked}/${r.sel})`);
          if (scope === 'both') { ok(!r.hasBtn, `${tag}: nothing to read -> no 전체 듣기`); continue; }
          const L = r.log || [];
          const viN = L.filter(x => x === 'vi-VN').length;
          const expectVi = scope === 'vi' ? 0 : rep;
          ok(L.length > 0 && L.slice(0, expectVi).every(x => x === 'vi-VN') && viN >= expectVi, `${tag}: Vietnamese x${expectVi} first: ${L}`);
          if (scope === '') ok(L[rep] === 'ko-KR', `${tag}: Korean follows the repetitions: ${L}`);
          if (scope === 'meaning') ok(L.every(x => x === 'vi-VN'), `${tag}: 한 muted -> only Vietnamese: ${L}`);
          if (scope === 'vi') ok(L.length > 0 && L.every(x => x === 'ko-KR'), `${tag}: 베 muted -> only Korean: ${L}`);
        }
      }
    }
    ok(!errs.length, `errors ${errs.join(' | ').slice(0, 500)}`);
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- COURSE UX TEST FAILED ---'); process.exit(1); }
  console.log('--- COURSE UX TEST PASSED ---');
})();
