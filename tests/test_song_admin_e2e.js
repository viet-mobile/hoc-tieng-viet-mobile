// -*- coding: utf-8 -*-
/**
 * Real-browser end-to-end test of the SECTION G song editor (Chrome via CDP): admin edits an 오리지널 송 in the UI (lyrics, recording URL,
 * line times), saves a draft, publishes; the public site then shows the edited line with ▶ ↻ buttons on that language's rows;
 * unpublish returns the build's own data. Derived from test_regional_e2e.js (same server / worker / browser harness).
 *
 * A local HTTP server plays Cloudflare Pages: the SHIPPED dist/<region>/_worker.js bundle handles /admin and /api/*
 * (SQLite-backed D1, real schema), everything else is served from dist/<region>/ through env.ASSETS.fetch.
 * Chrome resolves jeonju.test / ulsan.test to 127.0.0.1 so the public site's live-data hydration is active
 * (it is intentionally off on localhost). Nothing here touches a production D1.
 *
 * Flow: public Jeonju parity (static vs hydrated) -> admin login -> change the period -> preview -> apply ->
 * public site shows the new session plan -> rollback -> ULSAN still "일정 미정". Fails on any console error / CSP violation.
 */
const PLATFORM = require('./helpers/platform');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { makeRegionWorker, USERS, REPO_ROOT } = require('./helpers/regional_env');

const PORT = 8120;
const CDP_PORT = 9343;
const CHROME_PATH = PLATFORM.CHROME;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.css': 'text/css' };

function staticAssets(region) {
  return {
    fetch: async req => {
      let p = decodeURIComponent(new URL(req.url).pathname);
      if (p === '/') p = '/index.html';
      const file = path.join(REPO_ROOT, 'dist', region, p);
      if (!file.startsWith(path.join(REPO_ROOT, 'dist', region)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return new Response('Not Found', { status: 404 });
      return new Response(fs.readFileSync(file), { status: 200, headers: { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' } });
    },
  };
}

async function startServer(workers) {
  const server = http.createServer(async (req, res) => {
    try {
      const host = req.headers.host || '';
      const region = host.startsWith('ulsan') ? 'ulsan' : 'jeonju';
      const w = workers[region];
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const headers = {};
      for (const k of ['origin', 'cookie', 'content-type', 'x-csrf-token', 'sec-fetch-site', 'accept']) if (req.headers[k]) headers[k] = req.headers[k];
      const request = new Request(`http://${host}${req.url}`, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const out = await w.worker.fetch(request, w.env, {});
      const outHeaders = {};
      out.headers.forEach((v, k) => { outHeaders[k] = v; });
      // The browser talks plain http to this test server; production cookies are `Secure` (asserted in test_regional_admin.js).
      const setCookie = out.headers.get('Set-Cookie');
      if (setCookie) outHeaders['set-cookie'] = setCookie.replace(/;\s*Secure/i, '');
      res.writeHead(out.status, outHeaders);
      res.end(Buffer.from(await out.arrayBuffer()));
    } catch (err) {
      console.error('server error', err);
      res.writeHead(500); res.end('server error');
    }
  });
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  return server;
}

(async () => {
  for (const r of ['jeonju', 'ulsan']) assert(fs.existsSync(path.join(REPO_ROOT, 'dist', r, '_worker.js')), `dist/${r} missing: run python assemble_app.py first`);
  const workers = { jeonju: await makeRegionWorker('jeonju'), ulsan: await makeRegionWorker('ulsan') };
  for (const r of ['jeonju', 'ulsan']) workers[r].env.ASSETS = staticAssets(r);
  const server = await startServer(workers);

  const chrome = spawn(CHROME_PATH, [
    '--headless=new', `--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', '--disable-gpu', '--no-first-run', '--window-size=390,844',
    '--host-resolver-rules=MAP jeonju.test 127.0.0.1,MAP ulsan.test 127.0.0.1', '--user-data-dir=' + path.join(PLATFORM.TMP, 'song_admin_e2e_profile'),
  ], { stdio: 'ignore' });
  const getJson = url => new Promise((res, rej) => http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej));
  for (let i = 0; i < 50; i++) { await sleep(300); try { const v = await getJson(`http://127.0.0.1:${CDP_PORT}/json/version`); if (v.webSocketDebuggerUrl) break; } catch (e) { /* not up yet */ } }
  const list = await getJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });
  let id = 1;
  const pending = new Map();
  const events = [];
  const failures = [];
  ws.onmessage = m => {
    const j = JSON.parse(m.data);
    if (j.id && pending.has(j.id)) { pending.get(j.id)(j.result || j.error); pending.delete(j.id); } else if (j.method) events.push(j);
    if (j.method === 'Runtime.exceptionThrown') failures.push('exception: ' + JSON.stringify(j.params.exceptionDetails).slice(0, 300));
    if (j.method === 'Runtime.consoleAPICalled' && j.params.type === 'error') failures.push('console.error: ' + JSON.stringify(j.params.args.map(a => a.value || a.description)).slice(0, 300));
    if (j.method === 'Log.entryAdded' && j.params.entry.level === 'error') failures.push('log: ' + j.params.entry.text + ' ' + (j.params.entry.url || ''));
    if (j.method === 'Page.javascriptDialogOpening') send('Page.handleJavaScriptDialog', { accept: true });
  };
  const send = (method, params = {}) => new Promise(r => { const i = id++; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const E = async expr => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('eval failed: ' + JSON.stringify(r.exceptionDetails).slice(0, 400) + ' :: ' + expr.slice(0, 120));
    return r.result && r.result.value;
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });

  const waitFor = async (expr, what, ms = 15000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { try { if (await E(expr)) return; } catch (e) { /* page navigating */ } await sleep(100); }
    throw new Error('timeout waiting for ' + what + ' :: ' + expr.slice(0, 160));
  };
  const goto = async url => { await send('Page.navigate', { url }); await sleep(300); await waitFor("document.readyState === 'complete'", 'load ' + url); };
  const hydrationDone = async () => {
    // wait until the live-data request has finished (the fetch is only made on non-localhost hosts)
    await waitFor(`performance.getEntriesByType('resource').some(function(r){ return r.name.indexOf('/api/regional/curriculum') >= 0 && r.responseEnd > 0; })`, 'hydration response');
    await sleep(400);
  };
  const setLangOn = async (url, lang) => {
    await goto(url);
    await E(`localStorage.setItem('vn-app-lang', ${JSON.stringify(lang)})`);
    await goto(url);
  };
  const courseHtml = async () => {
    await E(`document.querySelector('.tab-btn[data-tab="curriculum"]').click()`);
    await waitFor(`document.getElementById('curr-week16-root') && document.getElementById('curr-week16-root').children.length > 0`, 'course cards');
    return E(`document.getElementById('curr-week16-root').innerHTML`);
  };
  const cardInfo = () => E(`(function(){
    var root = document.getElementById('curr-week16-root');
    var cards = [].slice.call(root.querySelectorAll('.group-card'));
    return { sessions: cards.filter(function(c){ return !/^cancel-|^unconfigured/.test(c.getAttribute('data-syl')||'') }).map(function(c){ return c.querySelector('.curr-week-badge').textContent; }),
             cancels: cards.filter(function(c){ return /^cancel-/.test(c.getAttribute('data-syl')||'') }).map(function(c){ return c.querySelector('.curr-week-badge').textContent; }),
             unconfigured: cards.filter(function(c){ return /^unconfigured/.test(c.getAttribute('data-syl')||'') }).length,
             overflow: document.documentElement.scrollWidth > window.innerWidth };
  })()`);
  let checks = 0;
  const ok = (cond, msg) => { checks++; if (!cond) failures.push('FAIL: ' + msg); };
  const rules = require('../regional_admin/song_rules');
  const baseline = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'dist', 'jeonju', 'songs_baseline.json'), 'utf8')).songs;
  const song = baseline.find(s => s.key === 'osg-5');
  const koLines = song.lines.ko, sungKo = koLines.filter(rules.isSingable);
  const URL_OK = 'https://download-a.akamaihd.jw-cdn.org/test/osg_KO_005.mp3';

  const openSongPublic = async (lang) => {
    await send('Page.navigate', { url: `http://jeonju.test:${PORT}/` }); await sleep(300);
    await waitFor("document.readyState === 'complete' && typeof window.setLang === 'function'", 'public page');
    await E(`localStorage.setItem('vn-app-lang', ${JSON.stringify(lang)})`);
    await send('Page.navigate', { url: `http://jeonju.test:${PORT}/` }); await sleep(300);
    await waitFor("document.readyState === 'complete' && typeof window.setLang === 'function'", 'public page again');
    await waitFor(`performance.getEntriesByType('resource').some(function(r){ return r.name.indexOf('/api/regional/songs') >= 0 && r.responseEnd > 0; })`, 'songs response');
    await sleep(500);
    await E(`(async function(){ var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms);});};
      document.querySelector('.tab-btn[data-tab="sentence"]').click(); await sleep(300);
      document.querySelector('.subtab-btn[data-sentence="song"]').click(); await sleep(600);
      [].slice.call(document.querySelectorAll('.song-kind-tabs [role="tab"]'))[1].click(); await sleep(500);
      var h = document.querySelector('.song-acc[data-song-id="osg-5"] .song-acc-head'); if (h && h.getAttribute('aria-expanded') !== 'true') { h.click(); } await sleep(900); return 1; })()`);
  };
  const koRows = () => E(`[].slice.call(document.querySelectorAll('.song-acc[data-song-id="osg-5"] .lyric-target')).map(function(e){return e.textContent;})`);
  const koButtons = () => E(`document.querySelectorAll('.song-acc[data-song-id="osg-5"] .song-seg-btn[data-seg="play"][data-seg-id$="|ko"]').length`);

  try {
    /* ---------- 1. admin: songs tab lists the baseline; open osg-5 ---------- */
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.getElementById('login-form')`, 'login form');
    await E(`localStorage.removeItem('admin-view'); localStorage.removeItem('admin-songs-view');`);
    await E(`document.getElementById('login-username').value = ${JSON.stringify(USERS.jeonju.username)}; document.getElementById('login-password').value = ${JSON.stringify(USERS.jeonju.password)}; document.querySelector('#login-form button[type=submit]').click()`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin app');
    await E(`document.querySelector('[data-act="tab"][data-tab="songs"]').click()`);
    await waitFor(`document.querySelectorAll('#tab-content .sg-table tbody tr').length > 100`, 'song list');
    ok(true, 'song list rendered');
    await E(`document.querySelector('[data-sg="kind"][data-kind="original"]').click()`);
    await waitFor(`!!document.querySelector('[data-sg="open"][data-key="osg-5"]')`, 'osg-5 row');
    await E(`document.querySelector('[data-sg="open"][data-key="osg-5"]').click()`);
    await waitFor(`!!document.querySelector('textarea[data-sg-f="t"]')`, 'editor');
    await E(`document.querySelector('[data-sg="lang"][data-lang="ko"]').click()`);
    await waitFor(`document.querySelectorAll('textarea[data-sg-f="t"]').length === ${koLines.length}`, 'ko lines');
    ok(await E(`document.querySelector('textarea[data-sg-f="t"]').value`) === koLines[0], 'editor starts from the build text');

    /* ---------- 1a. a reload shows the screen it was reloaded on ---------- */
    await send('Page.navigate', { url: `http://jeonju.test:${PORT}/admin` }); await sleep(300);
    await waitFor(`document.readyState === 'complete' && !!document.querySelector('.tabs-nav')`, 'admin after reload');
    await waitFor(`!!document.querySelector('textarea[data-sg-f="t"]')`, 'song editor restored');
    ok(await E(`document.querySelector('.tab-item.active').getAttribute('data-tab')`) === 'songs', 'reload keeps the songs tab');
    ok(await E(`document.querySelector('.sg-langs .active').getAttribute('data-lang')`) === 'ko', 'reload keeps the open language');
    ok(await E(`document.querySelectorAll('textarea[data-sg-f="t"]').length`) === koLines.length, 'reload keeps the open song (osg-5)');
    await E(`document.querySelector('[data-act="tab"][data-tab="audit"]').click()`);
    await send('Page.navigate', { url: `http://jeonju.test:${PORT}/admin` }); await sleep(300);
    await waitFor(`document.readyState === 'complete' && !!document.querySelector('.tabs-nav')`, 'admin after reload 2');
    ok(await E(`document.querySelector('.tab-item.active').getAttribute('data-tab')`) === 'audit', 'reload keeps the audit tab');
    await E(`document.querySelector('[data-act="tab"][data-tab="songs"]').click()`);
    await waitFor(`!!document.querySelector('textarea[data-sg-f="t"]')`, 'song editor back');

    /* ---------- 1b. split and merge keep the line list and the times consistent ---------- */
    const splitAt = koLines.findIndex(l => rules.isSingable(l) && / /.test(l));
    const cutPos = koLines[splitAt].indexOf(' ');
    await E(`(function(){ var ta = document.querySelectorAll('textarea[data-sg-f="t"]')[${splitAt}]; ta.focus(); ta.setSelectionRange(${cutPos}, ${cutPos}); })()`);
    await E(`document.querySelector('[data-sg="split"][data-i="${splitAt}"]').click()`);
    await waitFor(`document.querySelectorAll('textarea[data-sg-f="t"]').length === ${koLines.length + 1}`, 'split adds a line');
    ok(await E(`document.querySelectorAll('input[data-sg-f="s"]').length`) === sungKo.length + 1, 'the split-off sung line gets its own time fields');
    await E(`document.querySelector('[data-sg="merge"][data-i="${splitAt}"]').click()`);
    await waitFor(`document.querySelectorAll('textarea[data-sg-f="t"]').length === ${koLines.length}`, 'merge removes a line');
    ok(await E(`document.querySelectorAll('textarea[data-sg-f="t"]')[${splitAt}].value`) === koLines[splitAt], 'split + merge gives the original text back');

    /* ---------- 2. edit: text of line 1, recording URL, times of every sung line; save draft ---------- */
    const firstSung = koLines.findIndex(rules.isSingable);
    const NEW_TEXT = koLines[firstSung] + ' (수정됨)';
    await E(`(function(){
      var ta = document.querySelectorAll('textarea[data-sg-f="t"]')[${firstSung}]; ta.value = ${JSON.stringify(NEW_TEXT)}; ta.dispatchEvent(new Event('input', {bubbles:true}));
      var u = document.querySelector('input[data-sg-f="url"]'); u.value = ${JSON.stringify(URL_OK)}; u.dispatchEvent(new Event('input', {bubbles:true}));
      var k = 0;
      [].slice.call(document.querySelectorAll('input[data-sg-f="s"]')).forEach(function(inp, n){ inp.value = String(10 + n * 3); inp.dispatchEvent(new Event('input', {bubbles:true})); });
      [].slice.call(document.querySelectorAll('input[data-sg-f="e"]')).forEach(function(inp, n){ inp.value = String(12.5 + n * 3); inp.dispatchEvent(new Event('input', {bubbles:true})); });
    })()`);
    await E(`document.querySelector('[data-sg="save"]').click()`);
    await waitFor(`document.getElementById('toast-success').textContent.includes('초안을 저장')`, 'draft saved toast');
    await waitFor(`!document.querySelector('[data-sg="publish"]').disabled`, 'publish enabled after save');
    // before publishing: the public site shows the build text, no ko buttons
    await openSongPublic('ko');
    ok((await koRows()).indexOf(NEW_TEXT) < 0, 'draft is not public');
    const before = await koButtons();

    /* ---------- 3. publish: the public site applies the edit with its own times ---------- */
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin again');
    await E(`document.querySelector('[data-act="tab"][data-tab="songs"]').click()`);
    await E(`(function(){ var b = document.querySelector('[data-sg="back"]'); if (b) b.click(); })()`);
    await waitFor(`!!document.querySelector('[data-sg="kind"]')`, 'songs');
    await E(`document.querySelector('[data-sg="kind"][data-kind="original"]').click()`);
    await waitFor(`!!document.querySelector('[data-sg="open"][data-key="osg-5"]')`, 'osg-5 row again');
    await E(`document.querySelector('[data-sg="open"][data-key="osg-5"]').click()`);
    await waitFor(`!!document.querySelector('[data-sg="publish"]') && !document.querySelector('[data-sg="publish"]').disabled`, 'publish button');
    await E(`document.querySelector('[data-sg="publish"]').click()`);
    await waitFor(`document.getElementById('toast-success').textContent.includes('게시했습니다')`, 'published toast');
    await openSongPublic('ko');
    const rows = await koRows();
    ok(rows.indexOf(NEW_TEXT) >= 0, 'public shows the edited line: ' + JSON.stringify(rows.slice(0, 3)));
    await waitFor(`document.querySelectorAll('.song-acc[data-song-id="osg-5"] .song-seg-btn[data-seg="play"][data-seg-id$="|ko"]').length === ${sungKo.length}`, 'one ▶ per sung ko line', 8000);
    ok(true, 'ko ▶ buttons = sung lines (' + sungKo.length + ')');
    const info = await E(`(function(){ var i = window.__songSeg.info['original|osg-5|ko']; return i && { src: i.src, url: i.url, s0: i.marks[0] && i.marks[0].s, e0: i.marks[0] && i.marks[0].e, n: i.marks.length }; })()`);
    ok(info && info.src === 'admin' && info.url === URL_OK && info.s0 === 10000 && info.e0 === 12500 && info.n === sungKo.length, 'admin times drive the player: ' + JSON.stringify(info));
    const viInfo = await E(`(function(){ var i = window.__songSeg.info['original|osg-5|vi']; return i ? i.src : null; })()`);
    ok(viInfo !== 'admin', 'a language the edit does not touch keeps the build timing (' + viInfo + ')');

    /* ---------- 4. unpublish through the UI: the build's own data returns ---------- */
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin 3');
    await E(`document.querySelector('[data-act="tab"][data-tab="songs"]').click()`);
    await E(`(function(){ var b = document.querySelector('[data-sg="back"]'); if (b) b.click(); })()`);
    await waitFor(`!!document.querySelector('[data-sg="kind"]')`, 'songs 3');
    await E(`document.querySelector('[data-sg="kind"][data-kind="original"]').click()`);
    await waitFor(`!!document.querySelector('[data-sg="open"][data-key="osg-5"]')`, 'osg-5 row 3');
    await E(`document.querySelector('[data-sg="open"][data-key="osg-5"]').click()`);
    await waitFor(`!!document.querySelector('[data-sg="unpublish"]') && !document.querySelector('[data-sg="unpublish"]').disabled`, 'unpublish enabled');
    await E(`document.querySelector('[data-sg="unpublish"]').click()`);
    await waitFor(`document.getElementById('toast-success').textContent.includes('게시를 취소')`, 'unpublished toast');
    await openSongPublic('ko');
    ok((await koRows()).indexOf(NEW_TEXT) < 0, 'after unpublish the build text is back');
    await sleep(1500);
    ok(!(await E(`(function(){ var i = window.__songSeg.info['original|osg-5|ko']; return !!(i && i.admin); })()`)), 'after unpublish the ko timing is not the admin edit any more (buttons now: ' + (await koButtons()) + ', before: ' + before + ')');

    /* ---------- 5. a NEW song (API as the page would send it) is public after publish and removed after unpublish ---------- */
    const apiCall = (method, url, body) => E(`(async function(){ var r = await fetch(${JSON.stringify(url)}, {method:${JSON.stringify(method)}, credentials:'same-origin', headers:{'Content-Type':'application/json','X-CSRF-Token':window.__ADMIN_BOOT.csrfToken}, body: ${JSON.stringify(JSON.stringify(body || {}))}}); return {status:r.status, data: await r.json()}; })()`);
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin 4');
    const created = await apiCall('PUT', '/api/admin/songs/original%3Aosg-118', { baseVersion: 0, edit: { v: 1, kind: 'original', key: 'osg-118', isNew: true, number: 118, titles: { ko: '새 시험 노래', vi: 'Bài thử' }, langs: { ko: { lines: ['(코러스)', '첫째 줄', '둘째 줄'] } } } });
    ok(created.status === 200, 'new song draft saved: ' + JSON.stringify(created));
    ok((await apiCall('POST', '/api/admin/songs/original%3Aosg-118/publish', { baseVersion: created.data.version })).status === 200, 'new song published');
    await openSongPublic('ko');
    const newHead = await E(`!!document.querySelector('.song-acc[data-song-id="osg-118"]')`);
    ok(newHead, 'the new song is listed on the public site');
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin 5');
    ok((await apiCall('POST', '/api/admin/songs/original%3Aosg-118/unpublish', {})).status === 200, 'new song unpublished');
    await openSongPublic('ko');
    ok(!(await E(`!!document.querySelector('.song-acc[data-song-id="osg-118"]')`)), 'the new song is gone after unpublish');

    /* ---------- 6. a 왕국 노래 edit: Vietnamese row text + ko title, applied to the rendered song, undone by unpublish ---------- */
    const kingdom = baseline.find(x => x.kind === 'kingdom' && x.key === '1');
    const viRows = kingdom.lines.vi.slice(), EDITED_VI = viRows[1] + ' (sửa)';
    viRows[1] = EDITED_VI;
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin 6');
    const kSave = await apiCall('PUT', '/api/admin/songs/kingdom%3A1', { baseVersion: 0, edit: { v: 1, kind: 'kingdom', key: '1', number: 1, titles: { ko: '시험 제목' }, langs: { vi: { lines: viRows } } } });
    ok(kSave.status === 200, 'kingdom draft saved: ' + JSON.stringify(kSave.data).slice(0, 200));
    ok((await apiCall('POST', '/api/admin/songs/kingdom%3A1/publish', { baseVersion: kSave.data.version })).status === 200, 'kingdom edit published');
    const kingdomView = () => E(`(async function(){ var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms);});};
      document.querySelector('.tab-btn[data-tab="sentence"]').click(); await sleep(300);
      document.querySelector('.subtab-btn[data-sentence="song"]').click(); await sleep(900);
      return { vi: [].slice.call(document.querySelectorAll('#curr-songs-root .lyric-vi')).map(function(e){return e.textContent;}), title: (document.querySelector('#curr-songs-root .song-detail-target-title')||{}).textContent }; })()`);
    await send('Page.navigate', { url: `http://jeonju.test:${PORT}/` }); await sleep(300);
    await waitFor("document.readyState === 'complete' && typeof window.setLang === 'function'", 'public (kingdom)');
    await E(`localStorage.setItem('vn-app-lang','ko')`);
    await send('Page.navigate', { url: `http://jeonju.test:${PORT}/` }); await sleep(300);
    await waitFor("document.readyState === 'complete' && typeof window.setLang === 'function'", 'public (kingdom) 2');
    await waitFor(`performance.getEntriesByType('resource').some(function(r){ return r.name.indexOf('/api/regional/songs') >= 0 && r.responseEnd > 0; })`, 'songs response (kingdom)');
    await sleep(600);
    let kv = await kingdomView();
    ok(kv.vi.indexOf(EDITED_VI) >= 0 && kv.title === '시험 제목', 'public 왕국 노래 1 shows the edited row and title: ' + JSON.stringify([kv.title, kv.vi.slice(0, 3)]));
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin 7');
    ok((await apiCall('POST', '/api/admin/songs/kingdom%3A1/unpublish', {})).status === 200, 'kingdom edit unpublished');
    await send('Page.navigate', { url: `http://jeonju.test:${PORT}/` }); await sleep(300);
    await waitFor("document.readyState === 'complete' && typeof window.setLang === 'function'", 'public (kingdom) 3');
    await waitFor(`performance.getEntriesByType('resource').some(function(r){ return r.name.indexOf('/api/regional/songs') >= 0 && r.responseEnd > 0; })`, 'songs response (kingdom) 3');
    await sleep(600);
    kv = await kingdomView();
    ok(kv.vi.indexOf(EDITED_VI) < 0 && kv.title !== '시험 제목', 'after unpublish 왕국 노래 1 is the build\'s again: ' + JSON.stringify(kv.title));
  } catch (err) {
    failures.push('EXCEPTION: ' + err.message);
  }

  const relevant = failures.filter(f => !/Failed to load resource: the server responded with a status of 40[13]/.test(f) && !/favicon\.ico/.test(f) && !/jw-cdn|b\.jw-cdn|ERR_NAME_NOT_RESOLVED|ERR_INTERNET|ERR_CONNECTION/.test(f));
  console.log(`checks run: ${checks}`);
  ws.close(); chrome.kill(); server.close();
  if (relevant.length) {
    console.error('FAILURES:\n - ' + relevant.join('\n - '));
    process.exit(1);
  }
  console.log('--- SONG ADMIN END-TO-END BROWSER TEST PASSED ---');
  process.exit(0);
})().catch(err => { console.error('Test failure:', err); process.exit(1); });
