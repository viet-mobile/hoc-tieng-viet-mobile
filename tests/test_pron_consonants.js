// [발음] > [차이] "Korean and Vietnamese consonants compared" (pronunciation_comparison CONSONANTS) in the four Vietnamese
// sites (run build_app.py / assemble_app.py --site all first):
//   - inside the Korean-and-Vietnamese section: one folding part with the five topic cards (closed, fold on click);
//     the s/x and ch/tr topics show the regional cards and example words;
//   - every UI language shows its own text: Hangul syllables only in Korean (the jamo compared, e.g. ㅉ, are subject
//     matter), no English stand-in, zh_cn different from zh; the IPA ([pʰ] [f] [ʂ] [ʈ] [tɕaː] ...) is intact;
//   - example words are spoken in Vietnamese (the IPA note is never spoken);
//   - 390 / 430 / 1280 px, light and dark: no horizontal overflow; no console or page errors;
//   - [남북 발음] d/gi/r, s/x and ch/tr: filled in all 12 UI languages, the same IPA facts as above, no "exactly the
//     same" absolutes or one-to-one Korean letters, no overflow;
//   - the other [발음] subtabs still render.
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8781;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LANGS = ['ko', 'vi', 'en', 'ja', 'zh', 'zh_cn', 'cs', 'de', 'fr', 'hu', 'id', 'pl'];
const TOPICS = ['laryngeal', 'ph', 'palatal', 'chtr', 'sx'];
const IPA = ['[pʰ]', '[f]', '[ɗ]', '[x]', '[ɣ]', '[ʂ]', '[ʈ]', '[ʈʂ]', '[tɕaː]', '[ʈaː]', '[caː]'];
const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn('python', ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(process.env.TEMP || '.', 'pron-cons-' + process.pid)], {stdio: 'ignore'});
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
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true}); return r.result.value; };

    for (const site of ['', 'jw/', 'jeonju/', 'ulsan/']) {
      const name = site || 'general';
      errs = [];
      await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
      await cdp.send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: 'light'}]});
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site}index.html`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(400);
      // capture what speech synthesis is asked to say (the page's own speak() builds the utterance)
      await E(`(function(){window.__spoken=[];if(window.speechSynthesis){window.speechSynthesis.speak=function(u){window.__spoken.push({text:u.text,lang:u.lang});};}return 1;})()`);
      const texts = {};
      for (const lang of LANGS) {
        const v = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
          window.setLang(${JSON.stringify(lang)});await sleep(200);
          document.querySelector('.tab-btn[data-tab="pron"]').click();await sleep(150);
          document.querySelector('.subtab-btn[data-pron="diff"]').click();await sleep(250);
          const cons=PRON_COMPARISON.langs[${JSON.stringify(lang)}].sections.ko.consonants;
          const pane=document.getElementById('pron-diff-pane');
          const part=[...pane.querySelectorAll('.pron-cmp-part')].find(c=>c.querySelector(':scope > .group-head-row .pron-cmp-title').textContent===cons.title);
          if(!part)return {missing:true};
          const topics=[...part.querySelectorAll(':scope > .group-body > .pron-cmp-part')];
          const closed=topics.map(t=>t.dataset.open);
          const shown=el=>el.querySelector(':scope > .group-body').offsetHeight>0;
          const section=part.parentElement.closest('.group-card');section.dataset.open='true';  // the Korean section starts closed outside the Korean UI
          part.querySelector(':scope > .group-head-row .group-head').click();await sleep(60);
          const fold=[];
          for(const t of topics){const h=t.querySelector(':scope > .group-head-row .group-head');const s=[shown(t)];h.click();await sleep(40);s.push(shown(t));fold.push(s);}
          const text=part.innerText;
          const chtr=topics[3],sx=topics[4];
          const speak=[...part.querySelectorAll('.ns-examples [data-speak]')].map(b=>b.dataset.speak);
          window.__spoken=[];const b=chtr.querySelector('.ns-examples [data-speak]');b.click();await sleep(80);
          const said=window.__spoken.slice();
          const out={n:topics.length,titles:topics.map(t=>t.querySelector('.pron-cmp-title').textContent),closed,fold,text,
            sxCards:sx.querySelectorAll('.ns-card').length,sxRows:sx.querySelectorAll('.ns-card .ns-row').length,
            chtrCards:[...chtr.querySelectorAll('.ns-card .ns-title')].map(x=>x.textContent),chtrRows:chtr.querySelectorAll('.ns-card .ns-row').length,
            speak,said,overflow:document.documentElement.scrollWidth>innerWidth+1};
          part.querySelector(':scope > .group-head-row .group-head').click();return out;})()`);
        const tag = `${name}/${lang}`;
        if (!v || v.missing) { ok(false, `${tag}: consonant part missing`); continue; }
        texts[lang] = v.text;
        ok(v.n === TOPICS.length, `${tag}: ${v.n} topic cards`);
        ok(v.closed.every(x => x === 'false'), `${tag}: topic cards should start closed ${v.closed}`);
        ok(v.fold.every(s => s[0] === false && s[1] === true), `${tag}: topic folding ${JSON.stringify(v.fold)}`);
        ok(v.sxCards === 2 && v.sxRows === 4, `${tag}: s/x cards ${v.sxCards}/${v.sxRows}`);
        ok(JSON.stringify(v.chtrCards) === '["ch","tr"]' && v.chtrRows === 4, `${tag}: ch/tr cards ${v.chtrCards} rows ${v.chtrRows}`);
        ok(JSON.stringify(v.speak) === '["trà","chà","sinh","xinh"]', `${tag}: example speak buttons ${JSON.stringify(v.speak)}`);
        ok(v.said.length >= 1 && v.said.every(u => u.text === 'trà' && /^vi/i.test(u.lang || '')), `${tag}: example spoken as ${JSON.stringify(v.said)}`);
        ok(!/undefined|null|\[object|NaN/.test(v.text), `${tag}: raw value in text`);
        IPA.forEach(sym => ok(v.text.includes(sym), `${tag}: IPA ${sym} missing`));
        const syllables = (v.text.match(/[\uac00-\ud7a3]/g) || []).length;
        ok(lang === 'ko' ? syllables > 100 : syllables === 0, `${tag}: ${syllables} Hangul syllables`);
        ok(!v.overflow, `${tag}: overflow at 390px`);
      }
      LANGS.filter(l => l !== 'en' && texts[l] && texts.en).forEach(l => ok(texts[l] !== texts.en, `${name}/${l}: same text as English`));
      ok(texts.zh && texts.zh_cn && texts.zh !== texts.zh_cn, `${name}: zh_cn shows the zh text`);
      // widths / themes with every consonant card open
      for (const [w, h, mobile] of [[390, 844, true], [430, 932, true], [1280, 900, false]]) for (const theme of ['light', 'dark']) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: 1, mobile});
        await cdp.send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: theme}]});
        for (const lang of ['ko', 'de', 'zh_cn']) {
          const over = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang(${JSON.stringify(lang)});await sleep(200);
            document.querySelector('.tab-btn[data-tab="pron"]').click();await sleep(120);document.querySelector('.subtab-btn[data-pron="diff"]').click();await sleep(200);
            document.querySelectorAll('#pron-diff-pane .group-card').forEach(c=>c.dataset.open='true');await sleep(120);
            return document.documentElement.scrollWidth>innerWidth+1||[...document.querySelectorAll('#pron-diff-pane .ns-card')].some(c=>c.scrollWidth>c.clientWidth+1);})()`);
          ok(!over, `${name}: overflow at ${w}px ${theme} (${lang})`);
        }
      }
      // [남북 발음]: the d/gi/r, s/x and ch/tr cards say the same as the [차이] consonant cards, in every UI language
      const nsTexts = {};
      for (const lang of LANGS) {
        const v = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
          window.setLang(${JSON.stringify(lang)});await sleep(200);
          document.querySelector('.tab-btn[data-tab="pron"]').click();await sleep(120);
          document.querySelector('.subtab-btn[data-pron="nsdiff"]').click();await sleep(200);
          const cards=[...document.querySelectorAll('#pron-nsdiff-pane .ns-card')].slice(0,3);
          return cards.map(c=>({title:c.querySelector('.ns-title').textContent,
            desc:[...c.querySelectorAll(':scope > .ns-row .ns-desc')].map(d=>d.textContent),
            means:[...c.querySelectorAll('.ns-ex-mean')].map(m=>m.textContent),
            speak:[...c.querySelectorAll('[data-speak]')].map(b=>b.dataset.speak)}));})()`);
        const tag = `${name}/${lang} [남북 발음]`;
        ok(v && v.map(c => c.title).join('|') === 'd-, gi-, r-|s-, x-|ch-, tr-', `${tag}: cards ${v && v.map(c => c.title)}`);
        if (!v) continue;
        nsTexts[lang] = JSON.stringify(v.map(c => c.desc));
        v.forEach(c => {
          ok(c.desc.length === 2 && c.desc.every(d => d.trim().length > 10), `${tag} ${c.title}: empty description ${JSON.stringify(c.desc)}`);
          ok(c.means.length && c.means.every(m => m.trim()), `${tag} ${c.title}: empty example meaning`);
          ok(c.speak.length && c.speak.every(w => /^[A-Za-zÀ-ỹĐđ -]+$/.test(w)), `${tag} ${c.title}: speak ${c.speak}`);
          const all = c.desc.join(' ');
          ok(!/undefined|null|\[object/.test(all), `${tag} ${c.title}: raw value`);
          ok(!/똑같이|exactly the same|völlig gleich|identique|identycznie|完全相同|完全に同じ/.test(all), `${tag} ${c.title}: absolute wording "${all.slice(0, 60)}"`);
          if (lang !== 'ko') ok(!/[가-힣]/.test(all), `${tag} ${c.title}: Hangul outside Korean`);
        });
        const [dgr, sx, chtr] = v.map(c => c.desc);
        // the same facts as [차이]: North s/x [s]; South x [s] vs s [ʂ]; North ch/tr [c]~[tɕ]; South ch [c] vs tr [ʈ]; North d/gi/r [z], South d/gi [j]
        ok(sx[0].includes('[s]') && sx[1].includes('[s]') && sx[1].includes('[ʂ]'), `${tag}: s/x IPA ${JSON.stringify(sx)}`);
        ok(chtr[0].includes('[c]~[tɕ]') && chtr[1].includes('[c]') && chtr[1].includes('[ʈ]'), `${tag}: ch/tr IPA ${JSON.stringify(chtr)}`);
        ok(dgr[0].includes('[z]') && dgr[1].includes('[j]'), `${tag}: d/gi/r IPA ${JSON.stringify(dgr)}`);
        ok(!/ㅉ'처럼|ㅅ\(ㅆ\)'처럼/.test(JSON.stringify(v)), `${tag}: one-to-one Korean letter wording`);
      }
      LANGS.filter(l => l !== 'en' && nsTexts[l]).forEach(l => ok(nsTexts[l] !== nsTexts.en, `${name}/${l} [남북 발음]: same text as English`));
      ok(nsTexts.zh && nsTexts.zh_cn && nsTexts.zh !== nsTexts.zh_cn, `${name} [남북 발음]: zh_cn shows the zh text`);
      for (const [w, h, mobile] of [[390, 844, true], [430, 932, true], [1280, 900, false]]) for (const theme of ['light', 'dark']) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: 1, mobile});
        await cdp.send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-color-scheme', value: theme}]});
        for (const lang of ['ko', 'de', 'vi', 'hu']) {
          const over = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang(${JSON.stringify(lang)});await sleep(200);
            document.querySelector('.tab-btn[data-tab="pron"]').click();await sleep(120);document.querySelector('.subtab-btn[data-pron="nsdiff"]').click();await sleep(200);
            return document.documentElement.scrollWidth>innerWidth+1||[...document.querySelectorAll('#pron-nsdiff-pane .ns-card')].some(c=>c.scrollWidth>c.clientWidth+1);})()`);
          ok(!over, `${name} [남북 발음]: overflow at ${w}px ${theme} (${lang})`);
        }
      }
      await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
      // the other [발음] subtabs still render
      const subs = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="pron"]').click();await sleep(120);const out={};
        for(const b of [...document.querySelectorAll('.subtab-btn[data-pron]')]){b.click();await sleep(150);const pane=document.getElementById('pron-'+b.dataset.pron+'-pane');out[b.dataset.pron]=pane?pane.innerText.trim().length:-1;}
        return out;})()`);
      Object.entries(subs || {}).forEach(([k, n]) => ok(n > 50, `${name}: [발음] > ${k} is empty (${n})`));
      ok(!errs.length, `${name}: errors ${JSON.stringify(errs.slice(0, 3))}`);
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
  console.log('--- PRONUNCIATION CONSONANT COMPARISON TESTS PASSED ---');
})();
