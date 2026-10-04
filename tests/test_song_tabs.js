// [문장] > [노래] tabs in the built sites (run build_app.py / assemble_app.py first):
//   - three tabs (왕국 노래 / 오리지널 송 / 어린이 노래), 왕국 노래 selected by default, 163 kingdom songs unchanged;
//   - 117 original songs (OSG 1-117) and 36 children's songs (0-35, with the pk special song 0), straight from the JSON;
//   - folding cards: closed by default, lyrics rendered only when open, aria-expanded / aria-controls;
//   - full-song links are the JSON's jw.org links (OSG 116, pk 0, PKON 35); none for a missing language;
//   - a line's listen button speaks it (Vietnamese vi-VN, Korean ko-KR) without the verse number; "(코러스)" / "(ĐIỆP KHÚC)"
//     labels have none;
//   - search per tab; a curriculum song link still opens the kingdom tab; no overflow at 390 / 820 / 1280 px; no errors.
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8771;
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

const failures = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) failures.push(msg); };

(async () => {
  const server = spawn('python', ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run', '--user-data-dir=' + path.resolve(process.env.TEMP || '.', 'song-tabs-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {source: FAKE_TTS});
    let errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push('exception ' + e.exceptionDetails.text + ' ' + ((e.exceptionDetails.exception || {}).description || '')));
    cdp.on('Runtime.consoleAPICalled', e => { if (e.type === 'error') errs.push('console ' + e.args.map(a => a.value || a.description).join(' ')); });
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true})).result.value;
    const width = async w => cdp.send('Emulation.setDeviceMetricsOverride', {width: w, height: 900, deviceScaleFactor: 1, mobile: w < 600});

    for (const site of SITES) {
      errs = [];
      await width(1280);
      await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/${site}index.html`});
      for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'")) break; await sleep(250); }
      await sleep(600);
      const r = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};
        window.setLang('ko');await sleep(200);
        document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(200);
        document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(600);
        const tabs=[...document.querySelectorAll('.song-kind-tabs [role="tab"]')];
        out.tabs=tabs.map(t=>t.textContent.trim()); out.selected=tabs.filter(t=>t.getAttribute('aria-selected')==='true').map(t=>t.dataset.songkind);
        out.kingdomVisible=!document.getElementById('curr-songs-root').hidden; out.kingdomCount=(window.SONGS_DATA||SONGS_DATA).length;
        out.kingdomNums=SONGS_DATA.map(s=>s.number); out.kingdomPickers=document.querySelectorAll('#curr-songs-root .song-list-row').length;
        out.orig=ORIGINAL_SONGS.map(s=>s.track); out.kids=CHILDREN_SONGS.map(s=>s.track);
        out.origIds=new Set(ORIGINAL_SONGS.map(s=>s.id)).size; out.kidsIds=new Set(CHILDREN_SONGS.map(s=>s.id)).size;
        out.koTitles=ORIGINAL_SONGS.concat(CHILDREN_SONGS).every(s=>s.ko.title);
        // original songs
        tabs[1].click();await sleep(300);
        const oroot=document.getElementById('song-original-root');
        out.origVisible=!oroot.hidden&&document.getElementById('curr-songs-root').hidden;
        out.origCards=oroot.querySelectorAll('.song-acc').length; out.origBodiesRendered=oroot.querySelectorAll('.song-acc-body .song-line').length;
        const c116=oroot.querySelector('.song-acc[data-song-id="osg-116"]');const h=c116.querySelector('.song-acc-head');
        out.h116=h.innerText; out.h116exp=h.getAttribute('aria-expanded'); out.h116ctl=!!document.getElementById(h.getAttribute('aria-controls'));
        h.click();await sleep(150);
        const c=oroot.querySelector('.song-acc[data-song-id="osg-116"]');
        out.open116=c.querySelector('.song-acc-head').getAttribute('aria-expanded'); out.lines116=c.querySelectorAll('.song-line').length;
        out.links116=[...c.querySelectorAll('.song-full-link')].map(a=>a.href+' '+a.target+' '+a.rel);
        out.labels116=[...c.querySelectorAll('.song-line-label')].map(x=>x.textContent);
        out.labelBtns=[...c.querySelectorAll('.song-line')].filter(l=>/^\\s*\\([^()]*\\)\\s*$/.test(l.textContent)).length;
        window.__ttsLog.length=0;
        const viBtn=c.querySelector('.song-lyric-col[lang="vi"] .speak-btn'), koBtn=c.querySelector('.song-lyric-col[lang="ko"] .speak-btn');
        out.viLine=viBtn.closest('.song-line').textContent; viBtn.click(); await sleep(400);
        out.koLine=koBtn.closest('.song-line').textContent; koBtn.click(); await sleep(400);
        out.tts=window.__ttsLog.slice();
        out.aria=[viBtn.getAttribute('aria-label'),koBtn.getAttribute('aria-label')];
        c.querySelector('.song-acc-head').click();await sleep(150);
        out.closed116=oroot.querySelector('.song-acc[data-song-id="osg-116"] .song-acc-head').getAttribute('aria-expanded')+'/'+oroot.querySelectorAll('.song-acc[data-song-id="osg-116"] .song-line').length;
        // a song without Vietnamese
        const noVi=ORIGINAL_SONGS.find(s=>!s.vi.title&&s.ko.url); // (osg-1 has neither: its Korean link is not on jw.org)
        oroot.querySelector('.song-acc[data-song-id="'+noVi.id+'"] .song-acc-head').click();await sleep(150);
        const cn=oroot.querySelector('.song-acc[data-song-id="'+noVi.id+'"]');
        out.noVi={missing:!!cn.querySelector('.song-acc-missing'),viMsg:!!cn.querySelector('.song-lyric-col[lang="vi"] .song-lyric-missing'),viLink:[...cn.querySelectorAll('.song-full-link')].map(a=>a.textContent),koLines:cn.querySelectorAll('.song-lyric-col[lang="ko"] .song-line').length};
        oroot.querySelector('.song-acc[data-song-id="osg-117"] .song-acc-head').click();await sleep(150);
        out.lines117=oroot.querySelectorAll('.song-acc[data-song-id="osg-117"] .song-line').length;
        out.links117=oroot.querySelectorAll('.song-acc[data-song-id="osg-117"] .song-full-link').length;
        // search
        const inp=oroot.querySelector('.song-kind-search'); inp.value='여전히 소중한'; inp.dispatchEvent(new Event('input',{bubbles:true}));await sleep(100);
        out.search=[...oroot.querySelectorAll('.song-acc')].map(x=>x.dataset.songId); inp.value=''; inp.dispatchEvent(new Event('input',{bubbles:true}));
        // children's songs
        tabs[2].click();await sleep(300);
        const kroot=document.getElementById('song-kids-root');
        out.kidCards=kroot.querySelectorAll('.song-acc').length;
        for (const id of ['pk-special-0','pkon-35']) { kroot.querySelector('.song-acc[data-song-id="'+id+'"] .song-acc-head').click(); await sleep(150); }
        const k0=kroot.querySelector('.song-acc[data-song-id="pk-special-0"]'), k35=kroot.querySelector('.song-acc[data-song-id="pkon-35"]');
        out.k0=k0.querySelector('.song-acc-head').innerText; out.k0links=[...k0.querySelectorAll('.song-full-link')].map(a=>a.href);
        out.k35=k35.querySelector('.song-acc-head').innerText; out.k35links=[...k35.querySelectorAll('.song-full-link')].map(a=>a.href);
        out.kidGapBtns=[...kroot.querySelectorAll('.song-stanza-gap .speak-btn')].length;
        const kNoLyr=CHILDREN_SONGS.find(s=>s.vi.title&&!s.vi.lines.length);
        if (kNoLyr){ kroot.querySelector('.song-acc[data-song-id="'+kNoLyr.id+'"] .song-acc-head').click(); await sleep(150);
          out.kNoLyr=!!kroot.querySelector('.song-acc[data-song-id="'+kNoLyr.id+'"] .song-lyric-col[lang="vi"] .song-lyric-missing'); } else out.kNoLyr='none';
        // other language, and back to the kingdom tab through a curriculum song link
        window.setLang('en');await sleep(300);
        out.enTabs=[...document.querySelectorAll('.song-kind-tabs [role="tab"]')].map(t=>t.textContent.trim());
        out.kidsStillSelected=document.querySelector('.song-kind-tabs [data-songkind="kids"]').getAttribute('aria-selected');
        // a [과정] song link (JEONJU / ULSAN class cards) opens the kingdom tab at that song
        document.querySelector('.tab-btn[data-tab="curriculum"]').click();await sleep(400);
        document.querySelectorAll('[data-open]').forEach(c=>c.dataset.open='true');await sleep(100);
        const sl=[...document.querySelectorAll('.curr-link-btn[data-goto-anchor^="song-"]')][0];
        out.songLink=sl?sl.dataset.gotoAnchor:null;
        if(sl){ sl.click(); await sleep(500); }
        out.backKingdom=!document.getElementById('curr-songs-root').hidden&&document.getElementById('song-kids-root').hidden;
        out.kingdomDetail=(document.querySelector('#curr-songs-root .song-detail-number-badge')||{}).textContent;
        return out;})()`);
      const n = site.replace('/', '');
      if (!r) { ok(false, n + ': evaluation failed'); continue; }
      ok(JSON.stringify(r.tabs) === JSON.stringify(['왕국 노래', '오리지널 송', '어린이 노래']), n + ': tabs ' + r.tabs);
      ok(r.selected.join() === 'kingdom' && r.kingdomVisible, n + ': default tab ' + r.selected);
      ok(r.kingdomCount === 163 && r.kingdomNums.join() === Array.from({length: 163}, (_, i) => i + 1).join(), n + ': kingdom songs 1-163');
      ok(r.kingdomPickers === 163, n + ': kingdom picker rows ' + r.kingdomPickers);
      ok(r.orig.length === 117 && r.orig.join() === Array.from({length: 117}, (_, i) => i + 1).join() && r.origIds === 117, n + ': original 1-117');
      ok(r.kids.length === 36 && r.kids.join() === Array.from({length: 36}, (_, i) => i).join() && r.kidsIds === 36, n + ': children 0-35');
      ok(r.koTitles, n + ': every Korean title present');
      ok(r.origVisible && r.origCards === 117 && r.origBodiesRendered === 0, n + ': original list closed ' + r.origCards + '/' + r.origBodiesRendered);
      ok(/116/.test(r.h116) && /Anh em còn quý giá hơn nhiều/.test(r.h116) && /여전히 소중한 그대/.test(r.h116), n + ': OSG 116 header ' + r.h116);
      ok(r.h116exp === 'false' && r.h116ctl && r.open116 === 'true' && r.lines116 > 10, n + ': OSG 116 folding');
      ok(r.links116.length === 2 && r.links116[0].includes('wtlocale=VT&lank=pub-osg_116_VIDEO') && r.links116[1].includes('wtlocale=KO&lank=pub-osg_116_VIDEO') &&
        r.links116.every(x => x.includes('_blank noopener noreferrer')), n + ': OSG 116 links ' + r.links116);
      ok(r.labels116.length > 0 && r.labelBtns === 0, n + ': structure labels without buttons');
      ok(r.tts.length === 2 && r.tts[0].lang === 'vi-VN' && r.tts[1].lang === 'ko-KR' && !/^\s*\d+\./.test(r.tts[0].text) && !/^\s*\d+\./.test(r.tts[1].text) &&
        r.viLine.indexOf(r.tts[0].text.slice(0, 6)) >= 0, n + ': line listen ' + JSON.stringify(r.tts) + ' / ' + r.viLine);
      ok(r.aria.join() === '베트남어 구절 듣기,한국어 구절 듣기', n + ': aria ' + r.aria);
      ok(r.closed116 === 'false/0', n + ': closing removes the lyrics ' + r.closed116);
      ok(r.noVi.missing && r.noVi.viMsg && r.noVi.viLink.length === 1 && r.noVi.koLines > 0, n + ': song without Vietnamese ' + JSON.stringify(r.noVi));
      ok(r.lines117 > 5 && r.links117 === 0, n + ': OSG 117 (lyrics, no link: not on jw.org) ' + r.links117);
      ok(r.search.join() === 'osg-116', n + ': search ' + r.search);
      ok(r.kidCards === 36, n + ': children cards ' + r.kidCards);
      ok(/Cầu nguyện mọi lúc/.test(r.k0) && /언제나 기도할 거예요/.test(r.k0) && r.k0links.length === 2 && r.k0links.every(u => u.includes('pub-pk_3_VIDEO')), n + ': kid 0 ' + r.k0links);
      ok(/Đức Giê-hô-va có thật/.test(r.k35) && /여호와를 볼 수 있어요/.test(r.k35) && r.k35links.length === 2 &&
        r.k35links[0].includes('wtlocale=VT&lank=pub-pkon_35_VIDEO') && r.k35links[1].includes('wtlocale=KO&lank=pub-pkon_35_VIDEO'), n + ': kid 35 ' + r.k35links);
      ok(r.kidGapBtns === 0, n + ': no button on a stanza gap');
      ok(r.kNoLyr === true, n + ': kid song with a Vietnamese title but no lyrics ' + r.kNoLyr);
      ok(JSON.stringify(r.enTabs) === JSON.stringify(['Kingdom Songs', 'Original Songs', 'Children’s Songs']) && r.kidsStillSelected === 'true', n + ': English tabs ' + r.enTabs);
      if (r.songLink) ok(r.backKingdom && (r.kingdomDetail || '').indexOf(r.songLink.replace('song-', '')) === 0, n + ': curriculum song link ' + r.songLink + ' opens the kingdom tab ' + r.kingdomDetail);
      for (const w of [390, 820, 1280]) {
        await width(w); await sleep(250);
        const o = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const res=[];
          for (const k of ['original','kids']) { document.querySelector('.song-kind-tabs [data-songkind="'+k+'"]').click(); await sleep(200);
            res.push(document.documentElement.scrollWidth>innerWidth+1); }
          return res;})()`);
        ok(o && !o.some(Boolean), n + ': overflow at ' + w + 'px');
      }
      ok(!errs.length, n + ': errors ' + errs.join(' | ').slice(0, 300));
    }
    cdp.close();
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failures.length) { failures.forEach(f => console.error('  [FAIL] ' + f)); console.error('--- SONG TABS TEST FAILED ---'); process.exit(1); }
  console.log('--- SONG TABS TEST PASSED ---');
})();
