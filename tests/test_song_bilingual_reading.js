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
      window.setLang(locale); await sleep(250);
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
        groups: [...card.querySelectorAll('.song-acc-titles > .song-title-link-group')].map(g => [...g.children].map(c => c.tagName.toLowerCase() + (c.lang ? ':' + c.lang : '') + (c.classList.contains('jw-org-badge') ? ':badge:' + c.dataset.jwLang : ''))),
        nest: card.querySelectorAll('button a, a button, a a').length, headButtons: card.querySelectorAll('.song-acc-headrow button').length,
        btnName: card.querySelector('.song-acc-head').getAttribute('aria-label'),
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

      // ---- locale matrix: every locale shows ITS OWN data (never Korean outside the Korean UI) ----
      const JWCODE = {vi: 'VT', ko: 'KO', en: 'E', zh: 'CH', ja: 'J', de: 'X', fr: 'F', pl: 'P', cs: 'B', hu: 'H', id: 'IN', zh_cn: 'CHS'};
      const cov = await E(`(()=>{const o={};for(const s of ORIGINAL_SONGS.concat(CHILDREN_SONGS)){for(const l of ${JSON.stringify(LOCALES)}){const d=s.languages[l]||null; const c=(o[l]=o[l]||{n:0,total:0}); c.total++; if(d&&d.available) c.n++;}} return o;})()`);
      console.log(n + ' coverage (songs with official lyrics in the language): ' + LOCALES.map(l => l + ' ' + cov[l].n + '/' + cov[l].total).join(', '));
      ok(cov.vi.n >= 120 && cov.ko.n === 153 && LOCALES.filter(l => l !== 'vi' && l !== 'ko').every(l => cov[l].n >= 120), n + ': real data for every language ' + JSON.stringify(cov));
      const DATA = (kind, id, loc) => `(()=>{const s=${kind === 'original' ? 'ORIGINAL_SONGS' : 'CHILDREN_SONGS'}.find(x=>x.id==='${id}'); const g=l=>{const d=s.languages[l]||null; if(!d||!d.available) return null;
        const isLabel=x=>/^\\s*\\([^()]*\\)\\s*$/.test(x);
        const lines=d.lines?d.lines.filter(x=>x.trim()&&!isLabel(x)):d.sections.flatMap(q=>q.lines);
        const labels=d.lines?d.lines.filter(isLabel).length:d.sections.filter(q=>q.label).length;
        return {title:d.title,lines,labels,media:(s.media&&s.media['${loc}'])||null};};
        return {vi:g('vi'),t:g('${loc}')};})()`;
      const koRows = {};
      for (const loc of LOCALES) {
        for (const [kind, ids] of [['original', ORIGINAL], ['kids', KIDS]]) {
          for (const id of ids) {
            const r = await E(`window.__probe('${loc}','${kind}','${id}')`);
            const D = await E(DATA(kind, id, loc));
            const tag = n + ' ' + loc + ' ' + id;
            if (!r || !r.units || !D) { ok(false, tag + ': probe failed ' + JSON.stringify(r)); continue; }
            const vi = loc === 'vi', ko = loc === 'ko';
            if (ko) koRows[id] = r;
            const T = vi ? null : D.t;
            const allText = r.head + '\n' + r.units.map(u => u.target).join('\n');
            if (!ko) ok(!/[가-힣]/.test(allText), tag + ': Korean text in a non-Korean locale: ' + (allText.match(/[가-힣]+/) || [''])[0]);
            // the target lines: exactly this locale's data, in order, in its language, nothing when it has none
            const tLines = r.units.map(u => u.target).filter(Boolean);
            if (T) {
              ok(tLines.join('|') === T.lines.join('|'), tag + ': every ' + loc + ' line, in order (' + tLines.length + '/' + T.lines.length + ')');
              ok(r.units.every(u => !u.target || u.targetLang === loc) && r.headLangs.includes(loc) && r.head.includes(T.title), tag + ': ' + loc + ' title / lang attributes ' + r.head);
              ok(r.units.every(u => !u.target || u.tBtn), tag + ': a listen button on every ' + loc + ' line');
            } else {
              ok(tLines.length === 0 && !r.headLangs.includes(loc === 'vi' ? 'none' : loc), tag + ': no ' + loc + ' data -> no target line, no other language in its place');
              if (!vi) ok(/\S/.test(r.body) && r.body.split('\n').some(x => x.length > 8) && r.units.every(u => !u.target), tag + ': a note instead');
            }
            // Vietnamese: all its lines, in order
            ok(r.units.map(u => u.vi).filter(Boolean).join('|') === (D.vi ? D.vi.lines.join('|') : ''), tag + ': every Vietnamese line, in order');
            ok(r.units.every(u => !u.tBtn || u.target) && r.units.every(u => !u.viBtn || u.vi), tag + ': listen buttons belong to a line');
            // pairing: rows hold both languages wherever both have a line (most of a song), markers kept
            if (T && D.vi) {
              const both = r.units.filter(u => u.vi && u.target).length;
              ok(both >= Math.min(D.vi.lines.length, T.lines.length) * 0.5, tag + ': most lines are paired (' + both + ')');
              ok(r.markers.length >= Math.max(D.vi.labels, T.labels) && r.markers.length <= D.vi.labels + T.labels, tag + ': markers kept ' + r.markers.length + ' (' + D.vi.labels + '/' + T.labels + ')');
              ok(r.order.some(o => o === 'lyric-vi-row+lyric-target-row'), tag + ': vi/target rows are one unit');
            }
            // badges: strict share links of the shown languages, with the language's own JW code and media key
            ok(r.badges.every(b => b.text === 'JW.ORG' && /srcid=jwlshare/.test(b.href) && /wtlocale=/.test(b.href) && /lank=/.test(b.href)), tag + ': badges ' + JSON.stringify(r.badges));
            ok(r.badges.every(b => b.lang === 'vi' || b.lang === loc) && (ko || r.badges.every(b => !/wtlocale=KO/.test(b.href))), tag + ': badge language ' + JSON.stringify(r.badges.map(b => b.lang)));
            const tb = r.badges.find(b => b.lang === loc && !vi);
            if (T && T.media) ok(tb && tb.href === `https://www.jw.org/finder?srcid=jwlshare&wtlocale=${JWCODE[loc]}&lank=${T.media.mediaKey}`, tag + ': target badge ' + (tb && tb.href));
            else ok(!tb, tag + ': no target badge without media');
            // header: "VI title [JW.ORG] TARGET title [JW.ORG]": each title is followed by its own badge, in one group; no nesting of controls
            const want = [['span:vi'].concat(r.badges.some(b => b.lang === 'vi') ? ['a:badge:vi'] : [])];
            if (T && T.title) want.push(['span:' + loc].concat(tb ? ['a:badge:' + loc] : []));
            const viMissing = !D.vi || !D.vi.title;
            ok(r.nest === 0 && r.headButtons === 1 && /\S/.test(r.btnName || ''), tag + ': one toggle button, no <button><a> nesting ' + r.nest + '/' + r.headButtons);
            ok(JSON.stringify(viMissing ? r.groups.slice(1) : r.groups) === JSON.stringify(viMissing ? want.slice(1) : want), tag + ': title-badge groups ' + JSON.stringify(r.groups) + ' vs ' + JSON.stringify(want));
            // (a .song-children-lyric under a Vietnamese row = the words the recording sings when they differ from the text; it is part of that row)
            ok(r.order.map(o => o.replace(/\+song-children-lyric/g, '')).every(o => o === 'marker' || o === 'lyric-vi-row' || o === 'lyric-target-row' || o === 'lyric-vi-row+lyric-target-row'), tag + ': row order ' + [...new Set(r.order)]);
          }
        }
      }
      {
        const r = koRows['osg-116'], first = r.units[0];
        ok(first.vi && first.target && first.viBtn && first.tBtn, n + ': OSG 116 first row = VI + target with buttons');
        ok(r.markers.some(m => /ĐIỆP KHÚC/.test(m) && /코러스/.test(m)), n + ': a chorus marker row holds both languages ' + r.markers.slice(0, 3));
        // an imported language: its chorus label sits in the row of the Vietnamese one
        const en = await E(`window.__probe('en','original','osg-116')`);
        ok(en.markers.some(m => /ĐIỆP KHÚC/.test(m) && /CHORUS/i.test(m)), n + ': English chorus label next to the Vietnamese one ' + en.markers.slice(0, 3));
      }
      // clicking a title toggles the card; clicking its badge does not; the toggle button is the keyboard control
      {
        const t = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); await window.__probe('ko','original','osg-116');
          const root=document.getElementById('song-original-root'); const q=()=>root.querySelector('.song-acc[data-song-id="osg-116"]');
          const st=()=>q().querySelector('.song-acc-head').getAttribute('aria-expanded');
          const a=st(); q().querySelector('.song-acc-target').click(); await sleep(60); const b=st();
          q().querySelector('.song-acc-vi').click(); await sleep(60); const c=st();
          const badge=q().querySelector('.jw-org-badge'); badge.addEventListener('click',e=>e.preventDefault(),{once:true}); badge.click(); await sleep(60); const d=st();
          q().querySelector('.song-acc-head').click(); await sleep(60); const e2=st();
          return [a,b,c,d,e2, document.activeElement && document.activeElement.className];})()`);
        ok(t && t.slice(0, 5).join() === 'true,false,true,true,false', n + ': title click toggles, badge click does not, button toggles ' + JSON.stringify(t));
      }

      // ---- OSG 1: AUDIO (pub-osg_1_AUDIO), never VIDEO, in every language that has the song ----
      {
        const d = await E(`(()=>{const s=ORIGINAL_SONGS[0];const m=s.media||{};const has=l=>!!(s.languages[l]&&s.languages[l].available&&(s.languages[l].lines||s.languages[l].sections));
          return {id:s.id,media:m,langs:${JSON.stringify(LOCALES)}.filter(has),other:ORIGINAL_SONGS.slice(1).concat(CHILDREN_SONGS).filter(x=>x.media&&Object.values(x.media).some(v=>v.mediaKey==='pub-osg_1_AUDIO')).length,
            urls:${JSON.stringify(LOCALES)}.map(l=>s.languages[l]?s.languages[l].url:'').join('')};})()`);
        const mk = Object.keys(d.media);
        ok(d.id === 'osg-1' && mk.length >= 9 && mk.every(l => d.media[l].kind === 'AUDIO' && d.media[l].mediaKey === 'pub-osg_1_AUDIO' && d.langs.includes(l)) && mk.includes('ko') && !mk.includes('vi') && d.other === 0 && d.urls === '',
          n + ': OSG 1 is kind AUDIO + media key in ' + mk.join(',') + ' (languages with lyrics: ' + d.langs.join(',') + ')');
        for (const loc of LOCALES) {
          const r = await E(`window.__probe('${loc}','original','osg-1')`);
          if (!r || !r.badges) { ok(false, n + ' OSG 1 ' + loc + ': probe failed ' + errs.slice(-1)); continue; }
          const exp = loc !== 'vi' && d.media[loc] ? [`https://www.jw.org/finder?srcid=jwlshare&wtlocale=${JWCODE[loc]}&lank=pub-osg_1_AUDIO`] : [];
          ok(JSON.stringify(r.badges.map(b => b.href)) === JSON.stringify(exp), n + ' OSG 1 ' + loc + ' badges ' + JSON.stringify(r.badges.map(b => b.href)));
          ok(r.badges.every(b => b.kind === 'song-audio' && b.text === 'JW.ORG' && /^JW\.ORG — /.test(b.aria) && !/VIDEO/.test(b.href) && !/(비디오|동영상|영상|Video|video)/.test(b.aria)), n + ' OSG 1 ' + loc + ' audio badge ' + JSON.stringify(r.badges));
          ok(r.links.every(h => !/VIDEO/.test(h)), n + ' OSG 1 ' + loc + ' no video link in the body ' + r.links);
          if (loc === 'ko') ok(r.badges.length === 1 && r.badges[0].href === 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=KO&lank=pub-osg_1_AUDIO' && /오디오/.test(r.badges[0].aria), n + ': OSG 1 KO exact + aria says audio ' + JSON.stringify(r.badges));
        }
        await E(`window.__probe('ko','original','osg-1')`);
        const css = await E(`(()=>{const a=document.querySelector('.song-acc[data-song-id="osg-1"] .jw-org-badge');const c=getComputedStyle(a);return {bg:c.backgroundColor,color:c.color,r:[c.borderTopLeftRadius,c.borderTopRightRadius,c.borderBottomRightRadius,c.borderBottomLeftRadius],after:!!a.closest('.song-title-link-group').querySelector('.song-acc-target')};})()`);
        ok(css && css.after && css.bg === 'rgb(11, 42, 91)' && css.color === 'rgb(255, 255, 255)' && css.r.join() === '6px,0px,6px,0px', n + ': OSG 1 badge is the common navy JW.ORG badge ' + JSON.stringify(css));
      }

      // ---- every locale reads its own language: VI x2, then the target once, in the locale's TTS tag ----
      for (const loc of LOCALES.filter(l => l !== 'vi')) {
        for (const [kind, id] of [['original', 'osg-116'], ['kids', 'pkon-35']]) {
          const tag = n + ' ' + loc + ' ' + id + ' read-all';
          const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms)); localStorage.clear();
            await window.__probe('${loc}','${kind}','${id}');
            const root=document.getElementById('${kind === 'original' ? 'song-original-root' : 'song-kids-root'}');
            const sel=root.querySelector('.repeat-count-select'); sel.value='2'; sel.dispatchEvent(new Event('change',{bubbles:true})); await sleep(30);
            await window.__probe('${loc}','${kind}','${id}');
            const btn=root.querySelector('.song-acc[data-song-id="${id}"] .song-full-links button.read-all-btn'); if(!btn) return {btn:false};
            const reg=window.__READALL_REGISTRY[btn.dataset.readall]; window.__ttsLog.length=0; btn.click();
            for(let i=0;i<300&&window.__ttsLog.length<10;i++) await sleep(20);
            const log=window.__ttsLog.slice(); btn.click(); await sleep(60); return {btn:true,log,reg:reg.slice(0,2)};})()`);
          const D = await E(DATA(kind, id, loc));
          if (!D.t) { ok(!r || !r.btn || r.log.every(x => x.lang === 'vi-VN'), tag + ': no ' + loc + ' data -> only Vietnamese is read'); continue; }
          const L = (r && r.log) || [];
          const g = []; L.forEach(x => { const q = g[g.length - 1]; if (q && q.lang === x.lang) q.items.push(x.text); else g.push({lang: x.lang, items: [x.text]}); });
          const half = g[0] ? g[0].items.length / 2 : 0;
          ok(r && r.btn && g.length >= 2 && g[0].lang === 'vi-VN' && Number.isInteger(half) && g[0].items.slice(0, half).join('|') === g[0].items.slice(half).join('|') && g[1].lang === TTS_TAG[loc],
            tag + ': VI twice, then the target once in ' + TTS_TAG[loc] + ' ' + JSON.stringify(g.map(x => x.lang + 'x' + x.items.length)));
        }
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
              if(btn){ const reg=window.__READALL_REGISTRY[btn.dataset.readall]; out.reg=reg.slice(0,3); out.regN=reg.length; out.prep={}; reg.slice(0,3).forEach(e=>{ if(e.vi&&window.__prepareSpeechText) out.prep[e.vi]=window.__prepareSpeechText(e.vi); }); window.__ttsLog.length=0; btn.click();
                for(let i=0;i<300&&window.__ttsLog.length<14;i++) await sleep(20);
                out.log=window.__ttsLog.slice(); btn.click(); await sleep(60); }
              return out;})()`);
            if (!r) { ok(false, tag + ': evaluation failed'); continue; }
            ok(r.rep === String(rep), tag + ': repeat select (' + JSON.stringify({rep: r.rep, btn: r.btn, regN: r.regN}) + ')');
            if (mute === 'both') { ok(!r.btn, tag + ': both muted -> empty plan, no read-all button'); continue; }
            ok(r.btn && r.reg.length >= 2, tag + ': read-all button + plan');
            if (!r.btn) continue;
            // groups of consecutive same-language items
            const groups = [];
            r.log.forEach(it => { const g = groups[groups.length - 1]; if (g && g.lang === it.lang) { g.items.push(it.text); } else groups.push({lang: it.lang, items: [it.text]}); });
            const norm = s => String(s).replace(/\s+/g, '');
            const exp = [];
            r.reg.slice(0, 2).forEach(e => {
              if (e.vi) exp.push({lang: 'vi-VN', text: norm(r.prep ? r.prep[e.vi] || e.vi : e.vi).repeat(rep)});   // the spoken form (speech respellings such as gian -> zan)
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
