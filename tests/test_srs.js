// Spaced repetition (run build_app.py / assemble_app.py first):
//   - [복습] > [간격 복습]: words added from an [어휘] range come back on first + 1, 7 and 28 days (local calendar dates,
//     also across month/year ends and DST changes), the longest overdue first; a late review never schedules the next
//     one before tomorrow; adding a word again keeps its first date; reviewing a card that is not due changes nothing;
//     a broken store reads as empty; no other localStorage key is touched;
//   - the [과정] homework reviews each day's vocabulary on the next study day, one week later (same weekday) and four
//     weeks later (same weekday); no errors.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8773;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const BOOT = `(() => {
  const log = []; window.__ttsLog = log;
  const synth = { speaking: false, pending: false, paused: false, getVoices() { return []; }, addEventListener() {}, removeEventListener() {},
    pause() {}, resume() {}, cancel() { log.push({cancel: true}); },
    speak(u) { log.push({ text: u.text, lang: u.lang }); setTimeout(() => { u.onstart && u.onstart(); setTimeout(() => u.onend && u.onend(), 20); }, 5); } };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.voice = null; };
  window.__COURSE_CAPTURE = { hw: {}, cls: {} };
})();`;

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), msg + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b));

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'srs-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: BOOT});
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '')));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async expr => {
      const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true});
      if (r.exceptionDetails) throw new Error(((r.exceptionDetails.exception || {}).description) || r.exceptionDetails.text);
      return r.result.value;
    };
    const open = async site => {
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site}index.html`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'&&!!window.__srs")) break; await sleep(250); }
      await sleep(600);
    };

    // ---- date math, in two time zones (New York has a DST change on 2026-03-08 and 2026-11-01) ----
    for (const tz of ['Asia/Seoul', 'America/New_York']) {
      await cdp.send('Emulation.setTimezoneOverride', {timezoneId: tz});
      await open('jeonju/');
      const r = await E(`(()=>{const S=window.__srs,out={};
        const at=(iso,h)=>{const p=iso.split('-');window.__srsNow=()=>new Date(+p[0],+p[1]-1,+p[2],h===undefined?23:h,30);};
        localStorage.setItem('vn-app-prefs-probe','keep'); const before=Object.keys(localStorage).filter(k=>k!==S.key).sort().map(k=>k+'='+localStorage.getItem(k));
        localStorage.removeItem(S.key);
        out.add=[S.addDays('2026-01-31',1),S.addDays('2026-12-31',1),S.addDays('2026-03-07',1),S.addDays('2026-03-07',28),S.addDays('2026-10-31',1),S.addDays('2028-02-28',1)];
        // studied late in the evening, so a UTC date would already be the next day in Seoul (or the same in New York)
        at('2026-03-07',23); out.added=S.record([{vi:'Xin chào',kr:'안녕하세요'},{vi:'  xin   CHÀO ',kr:'dup'},{vi:'cảm ơn',kr:'감사합니다'}]);
        const w=()=>JSON.parse(localStorage.getItem(S.key)).words;
        out.e0=w()['xin chào'];
        out.notDue=S.review('xin chào');
        at('2026-03-08',0); out.dueDay1=S.state().due.map(e=>e.vi);
        out.r1=S.review('Xin chào'); out.again=S.review('Xin chào'); out.e1=w()['xin chào'];
        at('2026-03-14',12); out.notYet=S.state().due.map(e=>e.vi);
        at('2026-03-15',12); out.r2=S.review('xin chào'); out.e2=w()['xin chào'];
        // a late review: due 03-08, done 03-20 -> +7 (03-14) has passed, so the next is tomorrow, not in the past
        at('2026-03-20',9); out.late=S.review('cảm ơn'); out.eLate=w()['cảm ơn'];
        // a second study day of the same word keeps the first date
        out.reAdd=S.record([{vi:'XIN CHÀO',kr:'x'}]); out.firstKept=w()['xin chào'].first;
        at('2026-04-04',8); out.r3=S.review('xin chào'); out.e3=w()['xin chào'];
        // overdue order: the oldest due date first
        at('2026-05-01',10); S.record([{vi:'một',kr:'1'}]); at('2026-04-20',10); S.record([{vi:'hai',kr:'2'}]); at('2026-04-25',10); S.record([{vi:'ba',kr:'3'}]);
        at('2026-06-01',10); const st=S.state(); out.order=st.due.map(e=>e.vi+'@'+e.next); out.counts=[st.due.length,st.waiting.length,st.finished,st.total];
        localStorage.setItem(S.key,'{broken'); out.broken=S.state().total;
        localStorage.removeItem(S.key);
        out.othersKept=JSON.stringify(Object.keys(localStorage).filter(k=>k!==S.key).sort().map(k=>k+'='+localStorage.getItem(k)))===JSON.stringify(before);
        localStorage.removeItem('vn-app-prefs-probe'); delete window.__srsNow; return out;})()`);
      eq(r.add, ['2026-02-01', '2027-01-01', '2026-03-08', '2026-04-04', '2026-11-01', '2028-02-29'], tz + ' addDays');
      eq(r.added, 2, tz + ' duplicate spelling recorded once');
      eq([r.e0.first, r.e0.next, r.e0.stage, r.e0.last, r.e0.kr], ['2026-03-07', '2026-03-08', 0, null, '안녕하세요'], tz + ' new word');
      eq(r.notDue, false, tz + ' review before the due date is ignored');
      eq(r.dueDay1, ['Xin chào', 'cảm ơn'], tz + ' due at local midnight of +1');
      eq([r.r1, r.again], [true, false], tz + ' one review per due date');
      eq([r.e1.stage, r.e1.last, r.e1.next, r.e1.done], [1, '2026-03-08', '2026-03-14', [{stage: 1, date: '2026-03-08'}]], tz + ' after +1');
      eq(r.notYet, ['cảm ơn', 'Xin chào'], tz + ' +7 due on first+7, behind the still-unreviewed +1 word');
      eq([r.r2, r.e2.stage, r.e2.next], [true, 2, '2026-04-04'], tz + ' after +7 (late by a day): +28 from the first date');
      eq([r.late, r.eLate.stage, r.eLate.next], [true, 1, '2026-03-21'], tz + ' late review: next not before tomorrow');
      eq([r.reAdd, r.firstKept], [0, '2026-03-07'], tz + ' re-adding keeps the first date');
      eq([r.r3, r.e3.stage, r.e3.next, r.e3.done.map(d => d.date)], [true, 3, null, ['2026-03-08', '2026-03-15', '2026-04-04']], tz + ' after +28: finished');
      eq(r.order, ['cảm ơn@2026-03-21', 'hai@2026-04-21', 'ba@2026-04-26', 'một@2026-05-02'], tz + ' overdue oldest first');
      eq(r.counts, [4, 0, 1, 5], tz + ' due / waiting / finished / total');
      eq(r.broken, 0, tz + ' broken store reads as empty');
      ok(r.othersKept, tz + ' other localStorage keys untouched');
    }
    await cdp.send('Emulation.setTimezoneOverride', {timezoneId: 'Asia/Seoul'});

    // ---- [어휘] range -> 간격 복습 -> [복습] flashcards ----
    for (const site of ['jeonju/', 'jw/']) {
      errs = [];
      await open(site);
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)),S=window.__srs,out={};
        const at=iso=>{const p=iso.split('-');window.__srsNow=()=>new Date(+p[0],+p[1]-1,+p[2],10,0);};
        localStorage.removeItem(S.key); window.setLang('ko'); await sleep(200); at('2026-10-05');
        document.querySelector('.tab-btn[data-tab="curriculum"]').click(); await sleep(500);
        const go=[...document.querySelectorAll('.curr-link-btn[data-goto-tab="vocab"][data-goto-vr-start]')].find(b=>b.dataset.gotoSubval!=='wt');
        out.hasGo=!!go; if(!go) return out;
        go.click(); await sleep(500);
        const add=document.querySelector('.vocab-focus-srs'); out.hasAdd=!!add; if(!add) return out;
        const pool=window.__vocabScopedPool(); out.poolLen=pool.length;
        add.click(); await sleep(100); out.addDisabled=add.disabled; out.addLabel=add.textContent;
        let st=S.state(); out.after=[st.due.length,st.waiting.length,st.total,st.waiting[0]&&st.waiting[0].next];
        // the next day: everything is due
        at('2026-10-06');
        document.querySelector('.tab-btn[data-tab="review"]').click(); await sleep(200);
        document.querySelector('.subtab-btn[data-review="srs"]').click(); await sleep(400);
        out.status=document.querySelector('.srs-status').innerText;
        out.subscopeHidden=document.getElementById('review-subscope')?document.getElementById('review-subscope').style.display==='none':true;
        const ss=window.__studyState; out.mode=ss.mode; out.tab=ss.tabKey;
        out.deck=ss.deck.map(x=>x.vi); out.due=S.state().due.map(e=>e.vi); out.meanings=ss.deck.filter(x=>x.kr).length;
        window.__ttsLog.length=0;
        document.getElementById('flash-card').click(); await sleep(200);
        const first=ss.deck[0].vi; const w=JSON.parse(localStorage.getItem(S.key)).words[first.normalize('NFC').toLowerCase().replace(/\\s+/g,' ').trim()];
        out.reviewed=[w.stage,w.next,w.last]; out.status2=document.querySelector('.srs-status').innerText;
        document.getElementById('flash-next').click(); await sleep(200);
        out.nextIdx=ss.idx;
        // 오늘 복습 완료: every due word moves to +7
        document.querySelector('.srs-done-all').click(); await sleep(300);
        st=S.state(); out.afterAll=[st.due.length,st.waiting.length,st.waiting[0]&&st.waiting[0].next];
        out.empty=document.getElementById('study-body').innerText;
        window.setLang('vi'); await sleep(300);
        out.viTab=document.querySelector('.subtab-btn[data-review="srs"]').textContent;
        window.setLang('ko'); localStorage.removeItem(S.key); delete window.__srsNow; return out;})()`);
      ok(r.hasGo && r.hasAdd, site + ' course vocab link opens a range with 간격 복습에 추가: ' + JSON.stringify(r));
      if (r.hasAdd) {
        ok(r.poolLen > 0, site + ' scoped pool not empty');
        ok(r.addDisabled && r.addLabel.includes('간격 복습에 추가됨'), site + ' add button confirms: ' + r.addLabel);
        ok(r.after[2] > 0 && r.after[2] <= r.poolLen && r.after[0] === 0 && r.after[3] === '2026-10-06', site + ' recorded, due tomorrow: ' + JSON.stringify(r.after));
        ok(r.status.includes('오늘 복습할 단어 ' + r.after[2]) && r.status.includes('밀린 것부터'), site + ' status: ' + r.status);
        ok(r.subscopeHidden, site + ' no scope dropdowns for 간격 복습');
        eq([r.tab, r.mode], ['srs', 'flash'], site + ' opens flashcards');
        eq(r.deck, r.due, site + ' deck keeps the due order');
        ok(r.meanings === r.deck.length, site + ' every card has a meaning');
        eq(r.reviewed, [1, '2026-10-12', '2026-10-06'], site + ' revealing a card reviews it');
        ok(r.status2.includes('오늘 복습할 단어 ' + (r.after[2] - 1)), site + ' status updates: ' + r.status2);
        eq(r.nextIdx, 1, site + ' next card (its audio stop is covered by test_tts_behavior.js)');
        eq(r.afterAll, [0, r.after[2], '2026-10-12'], site + ' 오늘 복습 완료');
        ok(r.empty.includes('오늘 복습할 단어가 없어요'), site + ' empty message: ' + r.empty);
        eq(r.viTab, 'Ôn cách quãng', site + ' Vietnamese label');
      }
      ok(!errs.length, site + ' errors: ' + errs.join(' | '));
    }

    // ---- [과정] homework: +1 study day / +1 week / +4 weeks ----
    await open('jeonju/');
    const hw = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
      window.setLang('ko'); await sleep(200); document.querySelector('.tab-btn[data-tab="curriculum"]').click(); await sleep(800);
      return window.__COURSE_CAPTURE.vocab;})()`);
    const weeks = Object.keys(hw).map(Number).sort((a, b) => a - b);
    eq(weeks, weeks.map((_, i) => i), 'every homework week captured');
    const key = l => l && l.vocabRange ? l.subVal + ':' + l.vocabRange.start + '-' + l.vocabRange.end : null;
    const previewAt = {}, spaced = [];
    weeks.forEach(wi => hw[wi].days.forEach((d, i) => {
      (d.previews || []).forEach(it => { const k = key(it.link); if (k && it.link.tab === 'vocab' && it.link.subVal !== 'wt') previewAt[k] = {wi, i}; });
      (d.reviews || []).forEach(it => { if (it._spaced) spaced.push({k: key(it.link), step: it._spaced, wi, i, ko: it.text.ko}); });
    }));
    ok(spaced.length > 0 && Object.keys(previewAt).length > 0, 'course homework has spaced vocab reviews: ' + spaced.length);
    const steps = {1: 0, 5: 0, 20: 0};
    spaced.forEach(s => {
      steps[s.step]++;
      const p = previewAt[s.k];
      ok(!!p, 'spaced review of a previewed range: ' + s.k);
      if (!p) return;
      const label = {1: '다음 학습일 복습', 5: '1주 뒤 복습', 20: '4주 뒤 복습'}[s.step];
      ok(s.ko.endsWith(' · ' + label), 'label ' + s.ko);
      // homework week h, day i is study day 5h + i (breaks included): exactly 1, 5 and 20 study days later
      eq((s.wi - p.wi) * 5 + (s.i - p.i), s.step, `+${s.step} study days ` + JSON.stringify([s, p]));
      if (s.step > 1) eq(s.i, p.i, 'same weekday ' + s.k);
    });
    ok(steps[1] > 0 && steps[5] > 0 && steps[20] > 0, 'all three steps occur: ' + JSON.stringify(steps));
    // every previewed range comes back once per step unless that day is past the course end
    const maxDay = weeks.length * 5 - 1;
    Object.entries(previewAt).forEach(([k, p]) => [1, 5, 20].forEach(st => { if (p.wi * 5 + p.i + st <= maxDay) ok(spaced.some(s => s.k === k && s.step === st), `range ${k} reviewed at +${st}`); }));
    // each previewed range comes back at most once per step
    const seen = new Set(), dup = spaced.filter(s => { const k = s.k + '#' + s.step; if (seen.has(k)) return true; seen.add(k); return false; });
    eq(dup.length, 0, 'no duplicate spaced reviews');
    ok(!errs.length, 'course errors: ' + errs.join(' | '));
  } catch (e) {
    failures.push('crash ' + (e.stack || e));
  } finally {
    chrome.kill(); server.kill();
  }
  console.log(`srs: ${checks} checks, ${failures.length} failures`);
  failures.forEach(f => console.log('FAIL ' + f));
  process.exit(failures.length ? 1 : 0);
})();
