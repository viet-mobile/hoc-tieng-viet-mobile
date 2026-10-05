// [노래] > [오리지널 송] / [여호와의 친구가 되세요]: the bilingual row mode (run build_app.py / assemble_app.py first).
//   - no hard-coded Korean: in every UI locale the target title / lyrics / TTS locale are that locale's own data, never Korean
//     (the source files hold vi + ko only: every other locale shows the Vietnamese lyrics and a "not available" note);
//   - row pairing: every lyric row is .lyric-unit = Vietnamese line, then the target line; no line of either language lost;
//   - 전체 듣기 plan = the rows in the shown order: Vietnamese x repeat count, then the target ONCE (fake speech engine);
//   - 묵음 matrix (VI / target / both) x repeat 1,2,3;
//   - OSG 1 is an AUDIO (pub-osg_1_AUDIO), never the pub-osg_1_VIDEO link.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8781;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SITE_ARG = process.argv.find(a => a.startsWith('--sites='));   // e.g. --sites=jeonju/ (the short release gate)
const SITES = (SITE_ARG ? SITE_ARG.slice(8) : (process.env.SITES || 'jeonju/,jw/,ulsan/')).split(',');
const LOCALES = ['vi', 'cs', 'zh_cn', 'zh', 'en', 'fr', 'de', 'hu', 'id', 'ja', 'ko', 'pl'];
const TTS_TAG = {vi: 'vi-VN', cs: 'cs-CZ', zh_cn: 'zh-CN', zh: 'zh-TW', en: 'en-US', fr: 'fr-FR', de: 'de-DE', hu: 'hu-HU', id: 'id-ID', ja: 'ja-JP', ko: 'ko-KR', pl: 'pl-PL'};
const ORIGINAL = ['osg-1', 'osg-116', 'osg-117'], KIDS = ['pk-special-0', 'pkon-17', 'pkon-35'];
const FAKE_TTS = `(() => {
  const log = []; window.__ttsLog = log;
  const synth = { speaking: false, pending: false, paused: false, getVoices() { return []; }, addEventListener() {}, removeEventListener() {},
    pause() {}, resume() {}, cancel() {},
    speak(u) { log.push({ text: u.text, lang: u.lang }); setTimeout(() => { u.onstart && u.onstart(); setTimeout(() => u.onend && u.onend(), 5); }, 2); } };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.voice = null; };
})();`;

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'song-bilingual-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Network.enable');
    await cdp.send('Network.setUserAgentOverride', {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0'});
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: FAKE_TTS});
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '')));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async expr => { const x = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); if (x.exceptionDetails) errs.push('eval ' + ((x.exceptionDetails.exception || {}).description || x.exceptionDetails.text).slice(0, 200)); return x.result.value; };
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1000, height: 900, deviceScaleFactor: 1, mobile: false});

    // One song card of a locale: header, badges, lyric rows (in DOM order), read-all registry entries.
    const PROBE = `window.__probe = async (locale, kind, id) => {
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      window.setLang(locale); await sleep(120);
      document.querySelector('.tab-btn[data-tab="sentence"]').click(); await sleep(60);
      document.querySelector('.subtab-btn[data-sentence="song"]').click(); await sleep(100);
      document.querySelector('.song-kind-tabs [data-songkind="' + kind + '"]').click(); await sleep(100);
      const root = document.getElementById(kind === 'original' ? 'song-original-root' : 'song-kids-root');
      let card = root.querySelector('.song-acc[data-song-id="' + id + '"]');
      if (card.querySelector('.song-acc-head').getAttribute('aria-expanded') !== 'true') { card.querySelector('.song-acc-head').click(); await sleep(60); card = root.querySelector('.song-acc[data-song-id="' + id + '"]'); }
      const units = [...card.querySelectorAll('.song-lyric-rows > .lyric-unit')];
      return {
        head: card.querySelector('.song-acc-titles').innerText, headLangs: [...card.querySelectorAll('.song-acc-titles [lang]')].map(x => x.lang),
        badges: [...card.querySelectorAll('.song-acc-headrow .jw-org-badge')].map(a => ({href: a.href, text: a.textContent, aria: a.getAttribute('aria-label'), lang: a.dataset.jwLang, kind: a.dataset.mediaKind})),
        body: card.querySelector('.song-acc-body').innerText,
        order: [...card.querySelectorAll('.song-lyric-rows > *')].map(x => x.className.indexOf('lyric-unit') >= 0 ? [...x.children].map(c => c.className.split(' ')[0]).join('+') : 'marker'),
        units: units.map(u => ({vi: (u.querySelector('.lyric-vi') || {}).textContent || '', target: (u.querySelector('.lyric-target') || {}).textContent || '',
          targetLang: (u.querySelector('.lyric-target') || {}).lang || '', viBtn: !!u.querySelector('.lyric-vi-row .speak-btn'), tBtn: !!u.querySelector('.lyric-target-row .speak-btn')})),
        markers: [...card.querySelectorAll('.song-lyric-rows > .lyric-section-marker')].map(m => m.textContent),
        links: [...card.querySelectorAll('.song-full-link')].map(a => a.href),
        readAll: !!card.querySelector('.song-full-links button.read-all-btn')
      };
    };`;

    for (const site of SITES) {
      errs = [];
      const n = site.replace('/', '');
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site}index.html`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(600);
      await E(PROBE);

      // ---- locale matrix ----
      const koRows = {};
      for (const loc of LOCALES) {
        for (const [kind, ids] of [['original', ORIGINAL], ['kids', KIDS]]) {
          for (const id of ids) {
            const r = await E(`window.__probe('${loc}','${kind}','${id}')`);
            const tag = n + ' ' + loc + ' ' + id;
            if (!r || !r.units) { ok(false, tag + ': probe failed ' + JSON.stringify(r)); continue; }
            const vi = loc === 'vi', ko = loc === 'ko';
            if (ko) koRows[id] = r;
            const allText = r.head + '\n' + r.body + '\n' + r.units.map(u => u.target).join('\n');
            if (!ko) ok(!/[가-힣]/.test(allText), tag + ': Korean text in a non-Korean locale: ' + (allText.match(/[가-힣]+/) || [''])[0]);
            if (ko) ok(r.units.some(u => u.target) && r.units.every(u => !u.target || u.targetLang === 'ko') && /[가-힣]/.test(r.head), tag + ': Korean data in the Korean UI');
            else ok(r.units.every(u => !u.target), tag + ': no target line when the locale has no data (' + loc + ')');
            ok(r.units.every(u => !u.tBtn || u.target) && r.units.every(u => !u.viBtn || u.vi), tag + ': listen buttons belong to a line');
            ok(!r.headLangs.includes('ko') || ko, tag + ': ko-lang title in ' + loc);
            // badges: only of a language the page shows, never the Korean one outside the Korean UI
            ok(r.badges.every(b => b.text === 'JW.ORG' && /srcid=jwlshare/.test(b.href) && /wtlocale=/.test(b.href) && /(lank|docid)=/.test(b.href)), tag + ': badges ' + JSON.stringify(r.badges));
            ok(r.badges.every(b => b.lang === 'vi' || b.lang === loc) && (ko || r.badges.every(b => !/wtlocale=KO/.test(b.href))), tag + ': badge language ' + JSON.stringify(r.badges.map(b => b.lang)));
            // row order: unit = vi row, then the target row (never "all vi, then all target")
            ok(r.order.every(o => o === 'marker' || o === 'lyric-vi-row' || o === 'lyric-target-row' || o === 'lyric-vi-row+lyric-target-row'), tag + ': row order ' + [...new Set(r.order)]);
          }
        }
      }
      // the Korean UI: exact pairing, no line lost
      for (const id of ['osg-116', 'pkon-35', 'pk-special-0', 'pkon-17']) {
        const r = koRows[id], kind = id.startsWith('osg') ? 'ORIGINAL_SONGS' : 'CHILDREN_SONGS';
        const d = await E(`(()=>{const s=${kind}.find(x=>x.id==='${id}');const f=a=>a.filter(l=>l.trim()&&!/^\\s*\\([^()]*\\)\\s*$/.test(l));return {vi:f(s.vi.lines),ko:f(s.ko.lines),viMk:s.vi.lines.filter(l=>/^\\s*\\([^()]*\\)\\s*$/.test(l)).length,koMk:s.ko.lines.filter(l=>/^\\s*\\([^()]*\\)\\s*$/.test(l)).length};})()`);
        ok(r.units.map(u => u.vi).filter(Boolean).join('|') === d.vi.join('|'), n + ' ' + id + ': every Vietnamese line, in order (' + r.units.filter(u => u.vi).length + '/' + d.vi.length + ')');
        ok(r.units.map(u => u.target).filter(Boolean).join('|') === d.ko.join('|'), n + ' ' + id + ': every Korean line, in order (' + r.units.filter(u => u.target).length + '/' + d.ko.length + ')');
        ok(r.units.filter(u => u.vi && u.target).length >= Math.min(d.vi.length, d.ko.length) * 0.5, n + ' ' + id + ': most lines are paired ' + r.units.filter(u => u.vi && u.target).length);
        ok(r.markers.length >= Math.max(d.viMk, d.koMk) - 0 && r.markers.length <= d.viMk + d.koMk, n + ' ' + id + ': markers kept ' + r.markers.length);
        ok(r.order.some(o => o === 'lyric-vi-row+lyric-target-row'), n + ' ' + id + ': vi/target rows are one unit');
      }
      {
        const r = koRows['osg-116'];
        const first = r.units[0];
        ok(first.vi && first.target && first.viBtn && first.tBtn, n + ': OSG 116 first row = VI + target with buttons');
        // aligned by section: the first "(코러스)" marker row carries the Vietnamese and the Korean marker together
        ok(r.markers.some(m => /ĐIỆP KHÚC/.test(m) && /코러스/.test(m)), n + ': a chorus marker row holds both languages ' + r.markers.slice(0, 3));
      }

      // ---- OSG 1: AUDIO, never VIDEO ----
      {
        const d = await E(`(()=>{const s=ORIGINAL_SONGS[0];return {id:s.id,media:s.media,koUrl:s.ko.url,viAvail:s.vi.available,json:JSON.stringify(ORIGINAL_SONGS.filter(x=>x.track!==1).map(x=>x.media||null).filter(Boolean))};})()`);
        ok(d.id === 'osg-1' && JSON.stringify(d.media) === JSON.stringify({ko: {kind: 'AUDIO', mediaKey: 'pub-osg_1_AUDIO'}}) && d.koUrl === '' && d.viAvail === false && d.json === '[]',
          n + ': OSG 1 data is kind AUDIO + media key, only in the language it exists (ko); no other song has it ' + JSON.stringify(d));
        for (const loc of LOCALES) {
          const r = await E(`window.__probe('${loc}','original','osg-1')`);
          if (!r || !r.badges) { ok(false, n + ' OSG 1 ' + loc + ': probe failed ' + errs.slice(-1)); continue; }
          const exp = loc === 'ko' ? ['https://www.jw.org/finder?srcid=jwlshare&wtlocale=KO&lank=pub-osg_1_AUDIO'] : [];
          ok(JSON.stringify(r.badges.map(b => b.href)) === JSON.stringify(exp), n + ' OSG 1 ' + loc + ' badges ' + JSON.stringify(r.badges.map(b => b.href)));
          ok(r.badges.every(b => b.kind === 'song-audio' && b.text === 'JW.ORG' && /^JW\.ORG — /.test(b.aria) && !/VIDEO/.test(b.href) && !/(비디오|동영상|영상|Video|video)/.test(b.aria)), n + ' OSG 1 ' + loc + ' audio badge ' + JSON.stringify(r.badges));
          ok(r.links.every(h => !/VIDEO/.test(h)), n + ' OSG 1 ' + loc + ' no video link in the body ' + r.links);
          if (loc === 'ko') ok(/오디오/.test(r.badges[0].aria), n + ': OSG 1 aria says audio ' + r.badges[0].aria);
        }
        // the navy badge style
        await E(`window.__probe('ko','original','osg-1')`);
        const css = await E(`(()=>{const a=document.querySelector('.song-acc[data-song-id="osg-1"] .jw-org-badge');const c=getComputedStyle(a);return {bg:c.backgroundColor,color:c.color,r:[c.borderTopLeftRadius,c.borderTopRightRadius,c.borderBottomRightRadius,c.borderBottomLeftRadius],after:!!a.closest('.song-acc-headrow').querySelector('.song-acc-head')};})()`);
        ok(css && css.after && /rgb\(\s*(\d+),\s*(\d+),\s*(\d+)/.test(css.bg) && css.color === 'rgb(255, 255, 255)', n + ': OSG 1 badge is the common navy JW.ORG badge ' + JSON.stringify(css));
      }

      // ---- 전체 듣기 plan: Vietnamese xN, target once; 묵음 matrix ----
      for (const [kind, id] of [['original', 'osg-116'], ['kids', 'pkon-35']]) {
        for (const rep of [1, 2, 3]) {
          for (const mute of ['none', 'vi', 'meaning', 'both']) {
            const tag = n + ' ' + id + ' repeat ' + rep + ' mute ' + mute;
            const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
              window.setLang('ko');await sleep(60);
              await window.__probe('ko','${kind}','${id}');
              const root=document.getElementById('${kind === 'original' ? 'song-original-root' : 'song-kids-root'}');
              const sel=root.querySelector('.repeat-count-select');sel.value='${rep}';sel.dispatchEvent(new Event('change',{bubbles:true}));await sleep(30);
              const t=root.querySelector('.mute-autoplay-toggle'), s=root.querySelector('.mute-scope-select');
              const want='${mute}';
              if(want==='none'){ if(t.checked){t.checked=false;t.dispatchEvent(new Event('change',{bubbles:true}));} }
              else { if(!t.checked){t.checked=true;t.dispatchEvent(new Event('change',{bubbles:true}));} await sleep(30);
                const s2=document.getElementById('${kind === 'original' ? 'song-original-root' : 'song-kids-root'}').querySelector('.mute-scope-select'); s2.value=want; s2.dispatchEvent(new Event('change',{bubbles:true})); }
              await sleep(80);
              await window.__probe('ko','${kind}','${id}');
              const card=root.querySelector('.song-acc[data-song-id="${id}"]');
              const btn=card.querySelector('.song-full-links button.read-all-btn');
              const out={btn:!!btn, rep:root.querySelector('.repeat-count-select').value};
              if(btn){ const reg=window.__READALL_REGISTRY[btn.dataset.readall]; out.reg=reg.slice(0,3); out.regN=reg.length; window.__ttsLog.length=0; btn.click();
                for(let i=0;i<300&&window.__ttsLog.length<14;i++) await sleep(20);
                out.log=window.__ttsLog.slice(); btn.click(); await sleep(60); }
              return out;})()`);
            if (!r) { ok(false, tag + ': evaluation failed'); continue; }
            ok(r.rep === String(rep), tag + ': repeat select');
            if (mute === 'both') { ok(!r.btn, tag + ': both muted -> empty plan, no read-all button'); continue; }
            ok(r.btn && r.reg.length >= 2, tag + ': read-all button + plan');
            if (!r.btn) continue;
            // groups of consecutive same-language items
            const groups = [];
            r.log.forEach(it => { const g = groups[groups.length - 1]; if (g && g.lang === it.lang) { g.items.push(it.text); } else groups.push({lang: it.lang, items: [it.text]}); });
            const norm = s => String(s).replace(/\s+/g, '');
            const exp = [];
            r.reg.slice(0, 2).forEach(e => {
              if (e.vi) exp.push({lang: 'vi-VN', text: norm(e.vi).repeat(rep)});
              if (e.mean) exp.push({lang: 'ko-KR', text: norm(e.mean)});
            });
            ok(mute !== 'vi' || r.reg.every(e => !e.vi), tag + ': Vietnamese silenced in the plan');
            ok(mute !== 'meaning' || r.reg.every(e => !e.mean), tag + ': target silenced in the plan');
            let good = groups.length >= exp.length;
            if (mute === 'none') for (let i = 0; good && i < exp.length - 1; i++) good = groups[i].lang === exp[i].lang && norm(groups[i].items.join('')) === exp[i].text;
            else { const flat = norm(r.log.map(x => x.text).join('')), want = exp.map(x => x.text).join(''); good = flat.startsWith(want.slice(0, Math.min(want.length, 60))) && flat.indexOf(exp[0].text) === 0; }
            ok(good, tag + ': sequence ' + JSON.stringify(groups.slice(0, exp.length)) + ' vs ' + JSON.stringify(exp));
            if (mute === 'none') {
              // Vietnamese xN then the target once: the ko group is exactly one pass of the target text, never repeated
              ok(groups.every((g, gi) => g.lang !== 'ko-KR' || !r.reg[groups.slice(0, gi).filter(x => x.lang === 'ko-KR').length] || norm(g.items.join('')) === norm(r.reg[groups.slice(0, gi).filter(x => x.lang === 'ko-KR').length].mean)), tag + ': target once');
              ok(groups.length >= 3 && groups[0].lang === 'vi-VN' && groups[1].lang === 'ko-KR' && groups[2].lang === 'vi-VN', tag + ': VI, TARGET, VI, ... alternate');
            }
            if (mute === 'vi') ok(r.log.every(i => i.lang === 'ko-KR'), tag + ': only the target is spoken');
            if (mute === 'meaning') ok(r.log.every(i => i.lang === 'vi-VN'), tag + ': only Vietnamese is spoken');
          }
        }
      }
      // reset the shared preferences
      await E(`(()=>{try{localStorage.clear();}catch(e){}})()`);
      ok(errs.length === 0, n + ': browser errors ' + errs.slice(0, 3).join(' | '));
    }
  } finally {
    try { chrome.kill(); } catch (e) { /* no-op */ }
    try { server.kill(); } catch (e) { /* no-op */ }
  }
  console.log('checks run: ' + checks);
  if (failures.length) { failures.slice(0, 60).forEach(f => console.log('  [FAIL] ' + f)); console.log('--- SONG BILINGUAL READING TEST FAILED (' + failures.length + ') ---'); process.exit(1); }
  console.log('--- SONG BILINGUAL READING TEST PASSED ---');
})().catch(e => { console.error(e); process.exit(1); });
