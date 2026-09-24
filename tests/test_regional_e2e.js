// -*- coding: utf-8 -*-
/**
 * Real-browser end-to-end test of the regional system (Chrome via CDP, 390px viewport).
 *
 * A local HTTP server plays Cloudflare Pages: the SHIPPED dist/<region>/_worker.js bundle handles /admin and /api/*
 * (SQLite-backed D1, real schema), everything else is served from dist/<region>/ through env.ASSETS.fetch.
 * Chrome resolves jeonju.test / ulsan.test to 127.0.0.1 so the public site's live-data hydration is active
 * (it is intentionally off on localhost). Nothing here touches a production D1.
 *
 * Flow: public Jeonju parity (static vs hydrated) -> admin login -> change the period -> preview -> apply ->
 * public site shows the new session plan -> rollback -> ULSAN still "일정 미정". Fails on any console error / CSP violation.
 */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { makeRegionWorker, USERS, REPO_ROOT } = require('./helpers/regional_env');

const PORT = 8110;
const CDP_PORT = 9333;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
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
    '--host-resolver-rules=MAP jeonju.test 127.0.0.1,MAP ulsan.test 127.0.0.1', '--user-data-dir=' + path.join(process.env.TEMP || '.', 'regional_e2e_profile'),
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

  try {
    /* ---------- 1. public JEONJU: static rendering == hydrated rendering (parity), in ko and en ---------- */
    for (const lang of ['ko', 'en']) {
      await setLangOn(`http://localhost:${PORT}/`, lang);
      const staticHtml = await courseHtml();
      await setLangOn(`http://jeonju.test:${PORT}/`, lang);
      await hydrationDone();
      const liveHtml = await courseHtml();
      ok(staticHtml.length > 5000, `static ${lang} course html rendered`);
      ok(staticHtml === liveHtml, `JEONJU (${lang}): hydrated public course section must equal the static rendering byte for byte`);
      const info = await cardInfo();
      ok(info.sessions.length === 16 && info.cancels.length === 3, `JEONJU (${lang}) shows 16 sessions + 3 cancellations, got ${info.sessions.length}/${info.cancels.length}`);
      ok(!info.overflow, `no horizontal overflow (${lang})`);
      if (lang === 'ko') {
        ok(/^2026\/10\/10 - 1주$/.test(info.sessions[0]), 'first card badge is "2026/10/10 - 1주", got ' + info.sessions[0]);
        ok(/2027\/2\/13|2027\/02\/13/.test(info.sessions[15]) && /총복습/.test(info.sessions[15]), 'last card is the 2027/02/13 총복습, got ' + info.sessions[15]);
      }
    }
    await E(`localStorage.removeItem('vn-app-lang')`);

    /* ---------- 2. admin: login, period, preview, apply ---------- */
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.getElementById('login-form')`, 'login form');
    ok(!(await E(`document.body.innerText.includes('undefined')`)), 'login page has no "undefined"');
    await E(`document.getElementById('login-username').value = ${JSON.stringify(USERS.jeonju.username)}; document.getElementById('login-password').value = ${JSON.stringify(USERS.jeonju.password)}; document.querySelector('#login-form button[type=submit]').click()`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin app after login');
    await waitFor(`!!document.getElementById('course-summary')`, 'summary');
    let summary = await E(`document.getElementById('course-summary').innerText`);
    ok(/19회/.test(summary) && /3회/.test(summary) && /16회/.test(summary), 'summary shows 19 opportunities / 3 cancellations / 16 sessions: ' + summary.replace(/\s+/g, ' '));
    ok(!/undefined|NaN|\[object/.test(await E(`document.body.innerText`)), 'no undefined/NaN in admin UI');
    ok(await E(`document.getElementById('sett-end').value`) === '2027-02-13', 'end date field shows 2027-02-13');
    ok(!(await E(`document.body.innerText.includes('적용되지 않은')`)), 'no pending banner before any change');

    // live recalculation while typing (no save yet)
    await E(`(function(){ var e = document.getElementById('sett-end'); e.value = '2026-12-12'; e.dispatchEvent(new Event('input', {bubbles:true})); })()`);
    summary = await E(`document.getElementById('course-summary').innerText`);
    ok(/10회/.test(summary) && /2회/.test(summary) && /8회/.test(summary), 'live summary for end 2026-12-12 = 10 / 2 / 8: ' + summary.replace(/\s+/g, ' '));
    await E(`(function(){ var e = document.getElementById('sett-end'); e.value = '2026-12-01'; e.dispatchEvent(new Event('input', {bubbles:true})); document.getElementById('sett-start').value = '2026-12-05'; document.getElementById('sett-start').dispatchEvent(new Event('input', {bubbles:true})); })()`);
    ok(/종료일이 시작일보다 빠릅니다/.test(await E(`document.getElementById('course-summary').innerText`)), 'end < start is flagged in the UI');
    await E(`(function(){ document.getElementById('sett-start').value = '2026-10-10'; document.getElementById('sett-start').dispatchEvent(new Event('input', {bubbles:true})); var e = document.getElementById('sett-end'); e.value = '2026-12-12'; e.dispatchEvent(new Event('input', {bubbles:true})); })()`);
    await E(`document.querySelector('#settings-form button[type=submit]').click()`);
    await waitFor(`document.body.innerText.includes('적용되지 않은')`, 'pending-change banner after saving');

    // public site is unchanged until apply
    // (checked below after the apply); now preview + apply
    await E(`document.querySelector('[data-act="tab"][data-tab="plan"]').click()`);
    await waitFor(`document.body.innerText.includes('자동 재배정 미리보기')`, 'plan tab');
    const planText = await E(`document.getElementById('tab-content').innerText`);
    ok(/16회차 → 8회차/.test(planText), 'preview announces 16회차 → 8회차');
    ok(/1회차 — 2026-10-10/.test(planText), 'preview lists 1회차 — 2026-10-10');
    ok(!/undefined|NaN|\[object/.test(planText), 'no undefined in plan preview');
    // public still shows the applied plan (16)
    await goto(`http://jeonju.test:${PORT}/`);
    await hydrationDone();
    ok((await (async () => { await courseHtml(); return cardInfo(); })()).sessions.length === 16, 'public site still shows 16 sessions before apply');

    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin (session cookie)');
    await E(`document.querySelector('[data-act="tab"][data-tab="plan"]').click()`);
    await waitFor(`!!document.querySelector('[data-act="plan-apply"]') && !document.querySelector('[data-act="plan-apply"]').disabled`, 'enabled apply button');
    await E(`document.querySelector('[data-act="plan-apply"]').click()`); // confirm() dialog auto-accepted
    await waitFor(`document.body.innerText.includes('현재 적용된 배정 (8회차)')`, 'applied 8-session plan');

    /* ---------- 3. public site now shows the generated 8-session plan ---------- */
    await goto(`http://jeonju.test:${PORT}/`);
    await hydrationDone();
    await courseHtml();
    let info = await cardInfo();
    ok(info.sessions.length === 8, `public shows 8 sessions after apply, got ${info.sessions.length}`);
    ok(info.cancels.length === 2, `public shows the 2 in-period cancellations, got ${info.cancels.length}`);
    ok(info.sessions[0] === '2026/10/10 - 1회차' && info.sessions[7] === '2026/12/12 - 8회차', 'session badges are "N회차" with dates: ' + JSON.stringify([info.sessions[0], info.sessions[7]]));
    ok(!(await E(`document.getElementById('curr-week16-root').innerText`)).match(/undefined|NaN/), 'no undefined in public course');
    const firstCardItems = await E(`document.querySelector('#curr-week16-root .group-card[data-syl="s1"] .curr-item-list').children.length`);
    ok(firstCardItems > 5, 'session 1 carries its share of learning items (' + firstCardItems + ')');
    ok(await E(`!!document.querySelector('#curr-week16-root .group-card[data-syl="s1"] .curr-assign-card')`), 'session 1 carries weekly assignments');
    ok(!info.overflow, 'no overflow at 390px');
    await E(`localStorage.setItem('vn-app-lang', 'en')`);
    await goto(`http://jeonju.test:${PORT}/`);
    await hydrationDone();
    await courseHtml();
    info = await cardInfo();
    ok(info.sessions[0] === '2026/10/10 - Session 1', 'English session badge: ' + info.sessions[0]);
    const tabLabel = await E(`document.querySelector('.tab-btn[data-tab="curriculum"]').getAttribute('aria-label') || document.querySelector('.tab-btn[data-tab="curriculum"]').textContent`);
    ok(tabLabel === 'Course', 'the course tab is labelled duration-neutrally, got ' + tabLabel);
    ok(await E(`!document.querySelector('#panel-curriculum .subtab-row')`), 'the course panel has no subtab row');
    await E(`localStorage.removeItem('vn-app-lang')`);
    ok((await E(`(function(){ localStorage.setItem('vn-app-lang','ko'); return 1; })()`)) === 1, 'reset language');
    await goto(`http://jeonju.test:${PORT}/`);
    ok((await E(`document.querySelector('.tab-btn[data-tab="curriculum"]').textContent`)) === '과정', 'Korean tab label is 과정');

    /* ---------- 4. rollback from the admin UI restores the 16-session public plan ---------- */
    await goto(`http://jeonju.test:${PORT}/admin`);
    await waitFor(`!!document.querySelector('.tabs-nav')`, 'admin again');
    await E(`document.querySelector('[data-act="tab"][data-tab="audit"]').click()`);
    await waitFor(`document.querySelectorAll('#tab-content tbody tr').length > 0`, 'audit rows');
    const clicked = await E(`(function(){ var rows = [].slice.call(document.querySelectorAll('#tab-content tbody tr')); var r = rows.filter(function(x){ return x.innerText.indexOf('회차 배정 적용') >= 0; })[0]; if (!r) return false; r.querySelector('[data-act="restore"]').click(); return true; })()`);
    ok(clicked, 'audit log lists the apply action with a restore button');
    await waitFor(`document.body.innerText.includes('성공적으로 복구되었습니다') || document.getElementById('toast-success').textContent.includes('복구')`, 'restore toast');
    await sleep(500);
    await goto(`http://jeonju.test:${PORT}/`);
    await hydrationDone();
    await courseHtml();
    info = await cardInfo();
    ok(info.sessions.length === 16 && info.cancels.length === 3, `after rollback the public site shows 16 sessions + 3 cancellations again, got ${info.sessions.length}/${info.cancels.length}`);
    ok(/^2026\/10\/10 - 1주$/.test(info.sessions[0]), 'rolled-back public card badge is the original one');

    /* ---------- 5. ULSAN stays unconfigured: 일정 미정 / 자료 미정, no fabricated rows ---------- */
    await goto(`http://ulsan.test:${PORT}/`);
    await hydrationDone();
    await courseHtml();
    info = await cardInfo();
    ok(info.sessions.length === 0 && info.cancels.length === 0 && info.unconfigured === 1, `ULSAN shows exactly one 일정 미정 card, got ${JSON.stringify(info)}`);
    const ulsanText = await E(`document.getElementById('curr-week16-root').innerText`);
    ok(/일정 미정/.test(ulsanText) && /자료 미정/.test(ulsanText), 'ULSAN text shows 일정 미정 / 자료 미정');
    ok(!/2026|2027|1주|16주/.test(ulsanText.replace(/2026-2027/g, '')), 'no Jeonju dates / 16-row table in ULSAN: ' + ulsanText.slice(0, 200).replace(/\s+/g, ' '));
    ok((await E(`document.getElementById('app-title').textContent`)) === '2026-2027 울산 베트남어 학습반', 'ULSAN H1');

    // ULSAN admin: cross-region login is refused in the real UI
    await goto(`http://ulsan.test:${PORT}/admin`);
    await waitFor(`!!document.getElementById('login-form')`, 'ulsan login form');
    await E(`document.getElementById('login-username').value = ${JSON.stringify(USERS.jeonju.username)}; document.getElementById('login-password').value = ${JSON.stringify(USERS.jeonju.password)}; document.querySelector('#login-form button[type=submit]').click()`);
    await waitFor(`document.getElementById('toast-error').style.display === 'block'`, 'cross-region rejection toast');
    ok(await E(`!document.querySelector('.tabs-nav')`), 'a Jeonju admin cannot enter the Ulsan admin');
  } catch (err) {
    failures.push('EXCEPTION: ' + err.message);
  }

  // Ignored: the deliberate 401/403 probes and the browser's automatic /favicon.ico request (the app ships none).
  const relevant = failures.filter(f => !/Failed to load resource: the server responded with a status of 40[13]/.test(f) && !/favicon\.ico/.test(f));
  console.log(`checks run: ${checks}`);
  ws.close(); chrome.kill(); server.close();
  if (relevant.length) {
    console.error('FAILURES:\n - ' + relevant.join('\n - '));
    process.exit(1);
  }
  console.log('--- REGIONAL END-TO-END BROWSER TEST PASSED ---');
  process.exit(0);
})().catch(err => { console.error('Test failure:', err); process.exit(1); });
