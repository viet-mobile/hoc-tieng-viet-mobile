// JW.ORG links: one strict policy (run build_app.py / assemble_app.py first).
//   - the validator isAllowedJwOrgShareUrl(): only https://www.jw.org/finder?srcid=jwlshare&wtlocale=<code>&lank=<media key> (or &docid=
//     for a publication page) is allowed; article / locale-path / CDN / redirect / finder-without-srcid-or-wtlocale addresses are rejected;
//   - jwOrgBadgeHtml() fails closed (invalid url -> "") and renders the navy "JW.ORG" badge with aria-label / title / data-media-kind;
//   - the built pages contain no jw.org address that is not a jwlshare finder link; every clickable jw.org <a> of every publication view
//     (Enjoy Life Forever, Love People, Watchtower, Kingdom / Original / Children's songs) passes the validator;
//   - 왕국 노래 164 in Japanese: the song video, JW choir audio and JW choir video badges, with the exact addresses;
//   - the choir (osg) track of a song is an explicit verified table, never computed from the song number;
//   - the badge text is never read aloud.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8781;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SITES = ['jw/', 'jeonju/', 'ulsan/'];
const FAKE_TTS = `(() => {
  const log = []; window.__ttsLog = log;
  const synth = { speaking: false, pending: false, paused: false, getVoices() { return []; }, addEventListener() {}, removeEventListener() {},
    pause() {}, resume() {}, cancel() {},
    speak(u) { log.push({ text: u.text, lang: u.lang }); setTimeout(() => { u.onstart && u.onstart(); setTimeout(() => u.onend && u.onend(), 20); }, 5); } };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; this.lang = ''; this.voice = null; };
})();`;
const FINDER = 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=';
const J164 = {video: FINDER + 'J&lank=pub-sjjm_164_VIDEO', audio: FINDER + 'J&lank=pub-osg_126_AUDIO', choirVideo: FINDER + 'J&lank=pub-osg_126_VIDEO'};

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

// ---------- static checks (no browser) ----------
function allowed(url) { // the same rule as app_logic.js isAllowedJwOrgShareUrl, for the build scan
  let u; try { u = new URL(url); } catch (e) { return false; }
  if (u.protocol !== 'https:' || (u.hostname !== 'www.jw.org' && u.hostname !== 'jw.org') || u.pathname !== '/finder') return false;
  const q = u.searchParams;
  return q.get('srcid') === 'jwlshare' && !!q.get('wtlocale') && !!(q.get('lank') || q.get('docid'));
}
function staticChecks() {
  // no arithmetic mapping between a 왕국 노래 number and an osg track (164 -> 126 is a table entry, not "number - 38")
  const sources = ['app_logic.js', 'build_app.py', 'song_media_data.py', 'scripts/song_choir_media.py', 'scripts/song_full_media.py', 'template.html']
    .map(f => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')]);
  for (const [f, text] of sources) {
    const code = text.split('\n').filter(l => !/^\s*(\/\/|#|\*|")/.test(l)).join('\n');
    ok(!/\b(track|number|num|n|sel\.number)\s*-\s*38\b/.test(code), f + ': no "number - 38" style osg mapping');
    ok(!/osg[^\n]{0,80}\b(number|track|num)\s*[-+*\/]\s*\d+/.test(code), f + ': no osg track computed from a number');
    ok(!/\b(number|track|num)\s*[-+*\/]\s*\d+[^\n]{0,80}osg/.test(code), f + ': no osg track computed from a number (2)');
  }
  const data = fs.readFileSync(path.join(ROOT, 'song_media_data.py'), 'utf8');
  const tbl = {};
  const m = data.match(/"tracks": \{([^}]*)\}/);
  for (const [, a, b] of (m ? m[1] : '').matchAll(/(\d+):\s*(\d+)/g)) tbl[a] = +b;
  ok(JSON.stringify(tbl) === JSON.stringify({152: 40, 153: 50, 154: 60, 155: 72, 156: 75, 159: 100, 162: 109, 164: 126}), 'CHOIR_OSG.tracks is the explicit verified table: ' + JSON.stringify(tbl));
  ok(Object.entries(tbl).filter(([a, b]) => +a - 38 === b).length === 1, 'the table is not a formula (only 164 happens to satisfy number - 38)');

  // the built pages: every jw.org address is a jwlshare finder link (or the "...wtlocale=" prefix a link is built from)
  const bad = [], seen = new Set();
  let pages = 0, found = 0;
  const files = [];
  (function walk(d) { for (const e of fs.readdirSync(d, {withFileTypes: true})) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (/\.(html|js|json|webmanifest)$/.test(e.name)) files.push(f); } })(path.join(ROOT, 'dist'));
  for (const f of files) {
    const site = path.relative(path.join(ROOT, 'dist'), f);
    pages++;
    const html = fs.readFileSync(f, 'utf8');
    for (const [url] of html.matchAll(/https?:\/\/(?:[\w-]+\.)*jw\.org[^\s"'<>\\)]*/g)) {
      found++;
      if (url === FINDER.slice(0, -1) || url === FINDER || url === 'https://www.jw.org/finder') continue; // the template prefixes in app_logic.js
      if (!allowed(url) && !seen.has(url)) { seen.add(url); bad.push(site + ' ' + url.slice(0, 110)); }
    }
  }
  ok(pages >= 20, 'built files scanned: ' + pages);
  ok(bad.length === 0, 'built pages: jw.org addresses that are not jwlshare finder links (' + bad.length + '): ' + bad.slice(0, 5).join(' | '));
  return found;
}

(async () => {
  const foundUrls = staticChecks();
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'jw-badges-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    // the speech checks follow the serial engine of a desktop Windows browser, whatever machine runs the test
    await cdp.send('Network.enable');
    await cdp.send('Network.setUserAgentOverride', {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36 Edg/129.0'});
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: FAKE_TTS});
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '')));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true})).result.value;
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 1280, height: 900, deviceScaleFactor: 1, mobile: false});

    for (const site of SITES) {
      errs = [];
      const n = site.replace('/', '');
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site}index.html`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.isAllowedJwOrgShareUrl==='function'")) break; await sleep(250); }
      await sleep(600);

      // ---- the validator and the badge helper ----
      const v = await E(`(()=>{const f=window.isAllowedJwOrgShareUrl; const r={};
        const bad=['https://www.jw.org/vi/thu-vien/bai-hat/x','https://www.jw.org/ko/라이브러리/음악-노래/y','https://www.jw.org/finder?wtlocale=J&lank=pub-sjjm_164_VIDEO',
          'https://www.jw.org/finder?srcid=jwlshare&lank=pub-sjjm_164_VIDEO','https://www.jw.org/finder?srcid=jwlshare&wtlocale=J','https://www.jw.org/finder?srcid=other&wtlocale=J&lank=a',
          'https://www.jw.org/finder?srcid=jwlshare&wtlocale=&lank=a','http://www.jw.org/finder?srcid=jwlshare&wtlocale=J&lank=a','https://example.com/finder?srcid=jwlshare&wtlocale=J&lank=a',
          'https://www.jw.org.evil.example/finder?srcid=jwlshare&wtlocale=J&lank=a','https://cfp2.jw-cdn.org/a/3ba679/2/o/sjjm_J_164_r240P.mp4','https://wol.jw.org/finder?srcid=jwlshare&wtlocale=J&lank=a',
          'https://www.jw.org/finder/?srcid=jwlshare&wtlocale=J&lank=a','https://www.jw.org/en/finder?srcid=jwlshare&wtlocale=J&lank=a','https://www.jw.org/ja/%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%83%BC/x/','https://www.jw.org/finder?srcid=jwlshare&wtlocale=J&lank=','https://www.jw.org/finder?srcid=jwlshare&wtlocale=J&docid=','javascript:alert(1)','https://user:pw@www.jw.org/finder?srcid=jwlshare&wtlocale=J&lank=a',
          '','not a url',null,undefined,42,{}];
        r.rejected=bad.map(u=>f(u));
        const good=['${J164.video}','${J164.audio}','${J164.choirVideo}','https://www.jw.org/finder?wtlocale=J&srcid=jwlshare&lank=pub-osg_126_VIDEO','https://jw.org/finder?srcid=jwlshare&wtlocale=VT&prefer=lang&docid=1102021201',
          '${FINDER}KO&lank=pub-pk_3_VIDEO'];
        r.allowed=good.map(u=>f(u));
        r.badgeBad=window.jwOrgBadgeHtml('https://www.jw.org/vi/thu-vien/bai-hat/x',{kind:'song-video'})+'|'+window.jwOrgBadgeHtml('',{})+'|'+window.jwOrgBadgeHtml(null);
        const d=document.createElement('div'); d.innerHTML=window.jwOrgBadgeHtml('${J164.video}',{kind:'song-video',lang:'ja'}); const a=d.querySelector('a');
        r.badge={n:d.children.length,text:a.textContent,cls:a.className,kind:a.dataset.mediaKind,lang:a.dataset.jwLang,href:a.getAttribute('href'),target:a.target,rel:a.rel};
        return r;})()`);
      ok(v && v.rejected.every(x => x === false), `${n}: validator rejects every bad address ${v && JSON.stringify(v.rejected)}`);
      ok(v && v.allowed.every(x => x === true), `${n}: validator allows the finder share links ${v && JSON.stringify(v.allowed)}`);
      ok(v && v.badgeBad === '||', `${n}: badge helper fails closed ("${v && v.badgeBad}")`);
      ok(v && v.badge.n === 1 && v.badge.text === 'JW.ORG' && v.badge.cls === 'jw-org-badge' && v.badge.kind === 'song-video' && v.badge.lang === 'ja' && v.badge.href === J164.video &&
        v.badge.target === '_blank' && /noopener/.test(v.badge.rel) && /noreferrer/.test(v.badge.rel), `${n}: badge markup ${v && JSON.stringify(v.badge)}`);

      // ---- 왕국 노래: titles and their badges ----
      const k = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(200);
        document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(500);
        document.querySelector('.song-kind-tabs [data-songkind="kingdom"]').click();await sleep(200);
        const open=async num=>{document.getElementById('song-picker-open-btn').click();await sleep(150);
          document.querySelector('.song-grid-chip[data-song-num="'+num+'"]').click();await sleep(250);};
        const snap=()=>{const card=document.getElementById('song-detail-card');
          const line=sel=>{const el=card.querySelector(sel);return {title:el.querySelector('.song-detail-vi-title,.song-detail-target-title').textContent,
            badges:[...el.querySelectorAll('a.jw-org-badge')].map(a=>({href:a.getAttribute('href'),text:a.textContent,kind:a.dataset.mediaKind,lang:a.dataset.jwLang,aria:a.getAttribute('aria-label'),title:a.getAttribute('title'),target:a.target,rel:a.rel}))};};
          return {vi:line('.song-detail-title-line-vi'),target:line('.song-detail-title-line-target'),
            others:[...card.querySelectorAll('a[href*="jw.org"]')].filter(a=>!a.closest('.song-detail-title-line')).map(a=>a.getAttribute('href'))};};
        await open(164); window.setLang('ja');await sleep(300); out.ja164=snap();
        window.setLang('ko');await sleep(300); out.ko164=snap();
        window.setLang('vi');await sleep(300); out.vi164=snap();
        window.setLang('ja');await sleep(300);
        await open(163); out.ja163=snap();
        await open(152); out.ja152=snap();
        await open(1); out.ja1=snap();
        // the badge text is never read aloud: 전체 듣기 of 164
        await open(164); window.__ttsLog.length=0;
        const ra=document.querySelector('#song-detail-card .song-detail-nav .read-all-btn'); out.hasReadAll=!!ra;
        if (ra) { ra.click(); await sleep(2500); }
        out.spoken=window.__ttsLog.map(x=>x.text);
        out.speakAttrs=[...document.querySelectorAll('#song-detail-card [data-speak],#song-detail-card [data-speak-ko],#song-detail-card [data-speak-meaning]')].map(b=>b.getAttribute('data-speak')||b.getAttribute('data-speak-ko')||b.getAttribute('data-speak-meaning'));
        window.setLang('ko');await sleep(200);
        return out;})()`);
      ok(!!k, n + ': kingdom evaluation');
      if (k) {
        const j = k.ja164;
        ok(j.target.title === '私はあなたに頼る', `${n}: 164 JA title ${j.target.title}`);
        ok(JSON.stringify(j.target.badges.map(b => b.href)) === JSON.stringify([J164.video, J164.audio, J164.choirVideo]), `${n}: 164 JA badges after the title, in order: song video, choir audio, choir video ${JSON.stringify(j.target.badges.map(b => b.href))}`);
        ok(JSON.stringify(j.target.badges.map(b => b.kind)) === JSON.stringify(['song-video', 'choir-audio', 'choir-video']) && j.target.badges.every(b => b.text === 'JW.ORG' && b.lang === 'ja' && b.target === '_blank' && /noopener/.test(b.rel)),
          `${n}: 164 JA badge kinds / text / rel ${JSON.stringify(j.target.badges.map(b => [b.kind, b.text]))}`);
        ok(j.target.badges.every(b => /^JW\.ORG — \S/.test(b.aria) && b.title && b.aria === 'JW.ORG — ' + b.title) && new Set(j.target.badges.map(b => b.title)).size === 3, `${n}: 164 JA tooltips / aria-labels differ per kind ${JSON.stringify(j.target.badges.map(b => b.aria))}`);
        ok(j.target.badges.map(b => b.title).join('|') === '歌のビデオ|JW合唱の音声|JW合唱のビデオ', `${n}: 164 JA tooltips are in the UI language ${j.target.badges.map(b => b.title)}`);
        const ko = k.ko164.target.badges;
        ok(ko.map(b => b.title).join('|') === '노래 영상|JW 합창 오디오|JW 합창 비디오' && ko.map(b => b.aria).join('|') === 'JW.ORG — 노래 영상|JW.ORG — JW 합창 오디오|JW.ORG — JW 합창 비디오', `${n}: 164 KO tooltips ${JSON.stringify(ko.map(b => b.aria))}`);
        ok(ko.map(b => b.href).join('|') === [FINDER + 'KO&lank=pub-sjjm_164_VIDEO', FINDER + 'KO&lank=pub-osg_126_AUDIO', FINDER + 'KO&lank=pub-osg_126_VIDEO'].join('|'), `${n}: 164 KO addresses`);
        // Vietnamese: the song video of 164 is not on jw.org yet -> no video badge; the choir ones are
        ok(k.vi164.vi.badges.map(b => b.kind).join() === 'choir-audio,choir-video' && k.vi164.vi.badges.every(b => /wtlocale=VT&lank=pub-osg_126_/.test(b.href)), `${n}: 164 VI badges: no song video (unpublished), choir audio + video ${JSON.stringify(k.vi164.vi.badges.map(b => b.href))}`);
        ok(k.vi164.target.badges.length === 0, `${n}: Vietnamese UI has no second (target) badge line`);
        ok(k.ja164.vi.badges.map(b => b.kind).join() === 'choir-audio,choir-video', `${n}: 164 under JA UI: the Vietnamese title carries only the Vietnamese choir badges`);
        // other songs: only what is verified
        ok(k.ja163.target.badges.map(b => b.kind).join() === 'song-video' && k.ja163.target.badges[0].href === FINDER + 'J&lank=pub-sjjm_163_VIDEO', `${n}: 163 JA: song video only, no choir badge ${JSON.stringify(k.ja163.target.badges.map(b => b.href))}`);
        ok(k.ja1.target.badges.map(b => b.kind).join() === 'song-video' && k.ja1.vi.badges.map(b => b.kind).join() === 'song-video', `${n}: song 1: song video badges only`);
        ok(k.ja152.target.badges.map(b => b.href).join('|') === [FINDER + 'J&lank=pub-sjjm_152_VIDEO', FINDER + 'J&lank=pub-osg_40_AUDIO', FINDER + 'J&lank=pub-osg_40_VIDEO'].join('|'), `${n}: 152 JA: osg_40 (table entry) ${JSON.stringify(k.ja152.target.badges.map(b => b.href))}`);
        const allB = ['ja164', 'ko164', 'vi164', 'ja163', 'ja152', 'ja1'].flatMap(x => k[x].vi.badges.concat(k[x].target.badges));
        ok(allB.length > 15 && allB.every(b => allowed(b.href) && /lank=pub-(sjjm|osg)_\d+_(VIDEO|AUDIO)$/.test(b.href) && b.text === 'JW.ORG'), `${n}: every song title badge is an allowed share link with the visible text JW.ORG`);
        ok(k.hasReadAll && k.spoken.length > 3 && !k.spoken.some(t => /JW\.?\s?ORG/i.test(t)), `${n}: 전체 듣기 of 164 speaks ${k.spoken.length} items, none of them "JW.ORG"`);
        ok(k.speakAttrs.length > 20 && !k.speakAttrs.some(t => /JW\.?\s?ORG/i.test(t)), `${n}: no listen button of the song contains JW.ORG (${k.speakAttrs.length} buttons)`);
      }

      // ---- 오리지널 송 / 어린이 노래 ----
      const o = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};
        const rows=root=>[...root.querySelectorAll('.song-acc-headrow .jw-title-badges a.jw-org-badge')].map(a=>({lang:a.dataset.jwLang,a:a.getAttribute('href'),kind:a.dataset.mediaKind,text:a.textContent}));
        const struct=card=>{const hr=card.querySelector('.song-acc-headrow'),b=hr.querySelector('.song-acc-head'),w=hr.querySelector('.jw-title-badges'),a=w&&w.querySelector('a');
          return {kids:[...hr.children].map(x=>x.tagName+'.'+x.className.split(' ')[0]),inBtn:card.querySelectorAll('button a').length,anchorInBtn:!!(a&&a.closest('button')),gap:a?Math.round(a.getBoundingClientRect().left-b.getBoundingClientRect().right):null,sameLine:a?Math.abs(a.getBoundingClientRect().top-b.getBoundingClientRect().top)<40:false,bodyRow:card.querySelectorAll('.song-acc-body .jw-badge-row').length};};
        document.querySelector('.song-kind-tabs [data-songkind="original"]').click();await sleep(250);
        let root=document.getElementById('song-original-root');
        const c=root.querySelector('.song-acc[data-song-id="osg-116"]'); c.querySelector('.song-acc-head').click();await sleep(150);
        const c2=root.querySelector('.song-acc[data-song-id="osg-116"]');
        out.osg116={struct:struct(c2),badges:rows(c2),buttons:[...c2.querySelectorAll('.song-full-link')].map(a=>a.getAttribute('href')),json:ORIGINAL_SONGS.find(s=>s.id==='osg-116')};
        document.querySelector('.song-kind-tabs [data-songkind="kids"]').click();await sleep(250);
        root=document.getElementById('song-kids-root');
        for (const id of ['pk-special-0','pkon-35']) root.querySelector('.song-acc[data-song-id="'+id+'"] .song-acc-head').click(), await sleep(150);
        out.kid0struct=struct(root.querySelector('.song-acc[data-song-id="pk-special-0"]'));out.kid0=rows(root.querySelector('.song-acc[data-song-id="pk-special-0"]')); out.kid35=rows(root.querySelector('.song-acc[data-song-id="pkon-35"]'));
        out.kidAll=[...root.querySelectorAll('a[href*="jw.org"]')].map(a=>a.getAttribute('href'));
        out.origAll=(()=>{document.querySelector('.song-kind-tabs [data-songkind="original"]').click();return [...document.getElementById('song-original-root').querySelectorAll('a[href*="jw.org"]')].map(a=>a.getAttribute('href'));})();
        return out;})()`);
      ok(!!o, n + ': original / children evaluation');
      if (o) {
        const js = o.osg116.json;
        const want = ['vi', 'ko'].filter(l => js[l].url && js[l].available).map(l => js[l].url);
        ok(want.length >= 1 && JSON.stringify(o.osg116.badges.map(b => b.a)) === JSON.stringify(want) && JSON.stringify(o.osg116.buttons) === JSON.stringify(want) && o.osg116.badges.every(b => b.text === 'JW.ORG' && b.kind === 'song-video'),
          `${n}: OSG 116 badges = the JSON's finder links ${JSON.stringify(o.osg116.badges.map(b => b.a))}`);
        const st = [o.osg116.struct, o.kid0struct];
        ok(st.every(x => x.kids.join() === 'BUTTON.song-acc-head,SPAN.jw-title-badges' && !x.anchorInBtn && x.inBtn === 0 && x.bodyRow === 0), `${n}: Original / Children head row = title button + badge sibling (no link inside a button, no badge row in the body) ${JSON.stringify(st)}`);
        ok(st.every(x => x.sameLine && x.gap >= 0 && x.gap <= 24), `${n}: the badge follows the title directly (gap ${st.map(x => x.gap)} px)`);
        ok(o.kid0.map(b => b.a).includes(FINDER + 'KO&lank=pub-pk_3_VIDEO') && o.kid0.every(b => allowed(b.a)), `${n}: children 0 keeps the pk_3 finder link ${JSON.stringify(o.kid0.map(b => b.a))}`);
        ok(o.kid35.length >= 1 && o.kid35.every(b => allowed(b.a) && /lank=pub-pkon_35_VIDEO$/.test(b.a)), `${n}: children 35 ${JSON.stringify(o.kid35.map(b => b.a))}`);
        ok(o.kidAll.concat(o.origAll).length >= 4 && o.kidAll.concat(o.origAll).every(allowed), `${n}: every clickable jw.org link of the Original / Children tabs is allowed`);
      }

      // ---- 행복한 삶을 영원히 / 사람들을 사랑하고 제자로 / 파수대 ----
      const p = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};
        const grab=pre=>{document.querySelectorAll('[data-open]').forEach(c=>c.dataset.open='true');
          const cards=[...document.querySelectorAll('.group-card[data-syl^="'+pre+'"]')];
          const first=cards.find(c=>c.querySelector('.jw-title-badges'));
          const geo=first?(()=>{const hr=first.querySelector('.group-head-row'),b=hr.querySelector('.group-head'),a=hr.querySelector('.jw-title-badges a');return {kids:[...hr.children].map(x=>x.tagName+'.'+x.className.split(' ')[0]),gap:Math.round(a.getBoundingClientRect().left-b.getBoundingClientRect().right),sameLine:Math.abs(a.getBoundingClientRect().top-b.getBoundingClientRect().top)<60,inBtn:hr.querySelectorAll('button a').length};})():null;
          return {geo,bodyRows:cards.filter(c=>c.querySelector('.group-body .jw-badge-row')).length,rows:[...document.querySelectorAll('.group-card[data-syl^="'+pre+'"] .group-head-row.has-jw-badges > .jw-title-badges > a.jw-org-badge')].map(a=>({h:a.getAttribute('href'),t:a.textContent,k:a.dataset.mediaKind,l:a.dataset.jwLang})),
            links:[...document.querySelectorAll('a[href*="jw.org"]')].map(a=>a.getAttribute('href')), oldStyle:document.querySelectorAll('.song-jw-links a:not(.jw-org-badge)').length};};
        window.setLang('ja');await sleep(300);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(300);
        for (const sub of ['lff','lpd','wt']) { document.querySelector('.subtab-btn[data-sentence="'+sub+'"]').click();await sleep(600); out[sub]=grab(sub); }
        document.querySelector('.tab-btn[data-tab="vocab"]').click();await sleep(300);
        const wtBtn=document.querySelector('.subtab-btn[data-vocab="wt"]'); if (wtBtn) { wtBtn.click();await sleep(800); out.vwt=grab('wt'); }
        window.setLang('ko');await sleep(200);
        return out;})()`);
      ok(!!p, n + ': publication views evaluation');
      if (p) {
        const lffBad = p.lff.rows.filter(b => !(allowed(b.h) && b.t === 'JW.ORG' && b.k === 'publication' && /docid=11020212\d\d$|docid=11020213\d\d$/.test(b.h)));
        ok(p.lff.rows.length >= 100 && lffBad.length === 0, `${n}: 행복한 삶을 영원히: ${p.lff.rows.length} JW.ORG badges, all finder share links ${JSON.stringify(lffBad.slice(0, 3))}`);
        ok(p.lff.rows.some(b => b.h === 'https://www.jw.org/finder?srcid=jwlshare&wtlocale=VT&prefer=lang&docid=1102021201') && p.lff.rows.some(b => b.l === 'ja' && /wtlocale=J&/.test(b.h)), `${n}: lesson 1 has its Vietnamese and Japanese badge`);
        ok(p.lpd.rows.length >= 20 && p.lpd.rows.every(b => allowed(b.h) && b.t === 'JW.ORG') && p.lpd.rows.some(b => /docid=1102023301$/.test(b.h)), `${n}: 사람들을 사랑하고 제자로: ${p.lpd.rows.length} badges`);
        ok(p.vwt && p.vwt.rows.length >= 4 && p.vwt.rows.every(b => allowed(b.h) && b.t === 'JW.ORG') && p.vwt.rows.some(b => /wtlocale=VT&prefer=lang&docid=2026445$/.test(b.h)), `${n}: 파수대: ${p.vwt && p.vwt.rows.length} badges, all finder share links`);
        for (const key of ['lff', 'lpd', 'wt', 'vwt']) {
          if (!p[key]) continue;
          const g = p[key].geo;
          ok(g && /^BUTTON\.group-head,SPAN\.jw-title-badges(,\w+\.read-all-btn)?$/.test(g.kids.join()) && g.inBtn === 0 && p[key].bodyRows === 0, `${n}: ${key}: header row = title button + badge sibling, no link inside the button, no badge row in the body ${g && g.kids}`);
          ok(g && g.sameLine && g.gap >= 0 && g.gap <= 24, `${n}: ${key}: the badge follows the title directly (gap ${g && g.gap} px)`);
          ok(p[key].links.every(allowed) && p[key].oldStyle === 0, `${n}: ${key}: every clickable jw.org link is an allowed share link (${p[key].links.filter(x => !allowed(x)).slice(0, 3)})`);
        }
      }
      ok(!errs.length, n + ': errors ' + errs.join(' | ').slice(0, 300));
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  ok(foundUrls > 100, 'the built pages were scanned (' + foundUrls + ' jw.org addresses)');
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- JW.ORG BADGES TEST FAILED ---'); process.exit(1); }
  console.log('--- JW.ORG BADGES TEST PASSED ---');
})();
