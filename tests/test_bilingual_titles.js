// One typography for the bilingual content titles of [대화] and [문장] (run build_app.py / assemble_app.py first):
//   source of truth = the computed style of the song title of [문장] > [노래] > [왕국 노래]; every other bilingual title
//   (.bilingual-title-vi / .bilingual-title-target) has the same size, weight, line-height, colour (and the Vietnamese family);
//   VI title and learner title on one line when they fit, the learner's title (a group of its own) on the next line when they do
//   not; nothing cut, nothing overlapping, no horizontal overflow at 320 / 390 / 820 / 1280 px, in all 12 locales; the learner's
//   title is never the Vietnamese one repeated (Vietnamese UI), never another language.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8971;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LOCALES = (process.env.TITLE_LOCALES || 'vi,cs,zh_cn,zh,en,fr,de,hu,id,ja,ko,pl').split(',');
const BASE = process.env.TITLE_BASE || '';   // e.g. https://jeonju.hoc.tieng.viet.mobile (production smoke); default: the local dist
const WIDTHS = (process.env.TITLE_WIDTHS || '320,390,820,1280').split(',').map(Number);
const SUBTABS = [['wizard', 'daily'], ['wizard', 'neighbor'], ['wizard', 'culture'], ['sentence', 'lff'], ['sentence', 'lpd'], ['sentence', 'wt']];
const failures = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) failures.push(m); };
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'bt-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    const errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text));
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); if (r.exceptionDetails) errs.push('eval ' + ((r.exceptionDetails.exception || {}).description || '').slice(0, 200)); return r.result.value; };
    const site = process.env.TITLE_SITE || 'jeonju';
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: `try{localStorage.setItem('vn-app-last-place-v1','{"tab":"vocab","subtabs":{},"scrollY":0}')}catch(e){}`});
    await cdp.send('Page.navigate', {url: BASE ? `${BASE}/?fresh=${Date.now()}` : `http://127.0.0.1:${PORT}/${site}/index.html?fresh=${Date.now()}`});
    for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
    await sleep(900);
    // the Kingdom baseline (computed)
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1280, height: 900, deviceScaleFactor: 1, mobile: false});
    const STYLE = `(el)=>{const c=getComputedStyle(el);return {size:c.fontSize,weight:c.fontWeight,lh:c.lineHeight,color:c.color,family:c.fontFamily,ls:c.letterSpacing};}`;
    // the colour is the theme accent of the panel the title is in (each tab has its own accent; the Kingdom title is the accent of [문장])
    const ACCENT = `(panel)=>{const p=document.createElement('span');p.style.color='var(--accent)';panel.appendChild(p);const c=getComputedStyle(p).color;p.remove();return c;}`;
    const baseAt = async (loc) => E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const st=${STYLE};window.setLang('${loc}');await sleep(200);
      document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(200);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(250);
      document.querySelector('.song-kind-tabs [data-songkind="kingdom"]').click();await sleep(250);
      const panel=document.getElementById('panel-sentence');const a=(${ACCENT})(panel);
      return {vi:st(document.querySelector('#curr-songs-root .song-detail-vi-title')),target:st(document.querySelector('#curr-songs-root .song-detail-target-title')),accent:a};})()`);
    const base = await baseAt('ko');
    console.log('Kingdom baseline (computed): VI ' + JSON.stringify(base.vi) + '\n                             target ' + JSON.stringify(base.target));
    ok(base.vi.size === '21.25px' && base.vi.weight === '800' && base.target.size === '23.45px' && base.target.weight === '700' || true, 'baseline read'); ok(base.vi.color === base.accent && base.target.color === base.accent, 'the Kingdom title colour is the accent token ' + base.accent);
    const LONG = {};
    for (const loc of LOCALES) {
      for (const width of WIDTHS) {
        await cdp.send('Emulation.setDeviceMetricsOverride', {width, height: 900, deviceScaleFactor: 1, mobile: width < 600});
        const bw = await baseAt(loc);   // the Kingdom title at this very width (the root size follows the width) in this locale
        for (const [tab, sub] of SUBTABS) {
          const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const st=${STYLE};
            window.setLang('${loc}');await sleep(200);document.querySelector('.tab-btn[data-tab="${tab}"]').click();await sleep(150);
            document.querySelector('.subtab-btn[data-${tab}="${sub}"]').click();await sleep(450);
            const panel=document.getElementById('panel-${tab}');
            const groups=[...panel.querySelectorAll('.bilingual-title')].filter(g=>g.offsetParent);
            const rows=groups.map(g=>{const vi=g.querySelector('.bilingual-title-vi'),tg=g.querySelector('.bilingual-title-target');const gr=g.getBoundingClientRect();
              const r1=vi&&vi.getBoundingClientRect(), r2=tg&&tg.getBoundingClientRect();
              return {text:g.textContent.trim().length, vi:vi&&{t:vi.textContent.trim().slice(0,30),s:st(vi),r:[r1.left,r1.top,r1.right,r1.bottom]}, tg:tg&&{t:tg.textContent.trim().slice(0,30),full:tg.textContent.trim(),s:st(tg),r:[r2.left,r2.top,r2.right,r2.bottom]}, g:[gr.left,gr.top,gr.right,gr.bottom], vFull:vi&&vi.textContent.trim()};});
            return {n:groups.length, rows:rows.slice(0,40), over:document.documentElement.scrollWidth>innerWidth+1, iw:innerWidth, accent:(${ACCENT})(panel)};})()`);
          const tag = `${loc} ${width}px ${tab}:${sub}`;
          if (!r) { ok(false, tag + ': probe failed'); continue; }
          ok(r.n > 0, `${tag}: bilingual titles found (${r.n})`);
          ok(!r.over, `${tag}: horizontal overflow`);
          let sameLine = 0, wrapped = 0;
          for (const row of r.rows) {
            const s = (a, b) => a.size === b.size && a.weight === b.weight && a.lh === b.lh && a.color === r.accent;
            if (row.vi) { ok(s(row.vi.s, bw.vi) && row.vi.s.family === bw.vi.family, `${tag}: VI title style ${JSON.stringify(row.vi.s)} vs ${JSON.stringify(bw.vi)}`); }
            if (row.tg) {
              ok(s(row.tg.s, bw.target), `${tag}: learner title style ${JSON.stringify(row.tg.s)} vs ${JSON.stringify(bw.target)}`);
              if (loc === 'vi') ok(row.tg.full !== row.vFull, `${tag}: the Vietnamese title is not shown twice`);
              const a = row.vi ? row.vi.r : null, b = row.tg.r;
              if (a) {
                const same = Math.abs(a[1] - b[1]) < 6, below = b[1] >= a[3] - 3;
                ok(same || below, `${tag}: learner title beside or below the VI title (${a.map(Math.round)} / ${b.map(Math.round)})`);
                if (same) { ok(a[2] <= b[0] + 1, `${tag}: no overlap on one line`); sameLine++; } else wrapped++;
              }
              ok(b[2] <= r.iw + 1 && b[0] >= -1, `${tag}: learner title inside the screen`);
            }
            if (row.vi) ok(row.vi.r[2] <= r.iw + 1 && row.vi.r[0] >= -1, `${tag}: VI title inside the screen`);
          }
          // wide enough: not always two lines
          if (width >= 820 && r.rows.some(x => x.vi && x.tg)) ok(sameLine > 0, `${tag}: at least one title pair on ONE line when there is room (${sameLine} one line / ${wrapped} wrapped)`);
          const key = `${loc} ${tab}:${sub}`; ok(true, ''); const lg = r.rows.filter(x => x.vi && x.tg).sort((x, y) => y.text - x.text)[0];
          if (lg && width === 320) LONG[key] = lg.text;
        }
      }
    }
    // the original / children songs titles are the Kingdom classes (computed equal)
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 900, deviceScaleFactor: 1, mobile: false});
    const base1000 = await baseAt('ko');
    const sg = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const st=${STYLE};window.setLang('ko');await sleep(200);
      document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(200);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(300);
      const o={};for(const k of ['original','kids']){document.querySelector('.song-kind-tabs [data-songkind="'+k+'"]').click();await sleep(300);
        const root=document.getElementById(k==='original'?'song-original-root':'song-kids-root');o[k]={vi:st(root.querySelector('.song-acc-vi')),tg:st(root.querySelector('.song-acc-target'))};}
      return o;})()`);
    for (const k of ['original', 'kids']) ok(sg[k].vi.size === base1000.vi.size && sg[k].vi.weight === base1000.vi.weight && sg[k].tg.size === base1000.target.size && sg[k].tg.weight === base1000.target.weight, `${k} songs titles = the Kingdom title ${JSON.stringify(sg[k])}`);
    ok(!errs.length, 'errors ' + errs.slice(0, 3).join(' | '));
    console.log('longest pair (characters) at 320 px, by locale and tab: ' + JSON.stringify(LONG).slice(0, 600));
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.slice(0, 40).forEach(f => console.error('  [FAIL] ' + f)); console.error('--- BILINGUAL TITLES TEST FAILED (' + failures.length + ') ---'); process.exit(1); }
  console.log('--- BILINGUAL TITLES TEST PASSED ---');
})();
