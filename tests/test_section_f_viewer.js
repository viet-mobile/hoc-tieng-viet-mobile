// -*- coding: utf-8 -*-
/**
 * SECTION F (교사용 지도서) read-only account (admin_users.role = 'section_f_viewer').
 *
 * 1. Worker (the shipped bundle, SQLite D1 with the real schema): the viewer logs in; every /api/admin/* route
 *    (sections A-E, reads and writes, with a valid CSRF token) is 403 and changes nothing; the /admin page embeds the
 *    guide for the viewer and for admins but not for an anonymous visitor; logout ends the session; full admins and
 *    the superadmin keep every route; an unknown role is refused by the schema; the migration turns an old database's
 *    accounts into 'admin'; scripts/create_admin_user.py --role section_f_viewer writes a working hash and no password.
 * 2. Browser (Chrome via CDP, the worker behind a local server): the viewer sees only SECTION F, in Korean and in
 *    Vietnamese; an admin still sees SECTIONS A-F; no console errors.
 * Nothing here touches a production D1. Test passwords only; the real account's password is never in the repo.
 */
const PLATFORM = require('./helpers/platform');
const { spawn, spawnSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const auth = require('../regional_admin/auth');
const { createD1 } = require('./helpers/d1_sqlite');
const { makeRegionWorker, snapshot, USERS, REPO_ROOT } = require('./helpers/regional_env');

const VIEWER = { username: 'sectionf.viewer-test', password: 'Viewer-Test-Pass-1!' };
const PORT = 8112;
const CDP_PORT = 9335;
const CHROME_PATH = PLATFORM.CHROME;
const sleep = ms => new Promise(r => setTimeout(r, ms));

let count = 0;
const t = (name, fn) => Promise.resolve().then(fn).then(() => { count++; console.log('✓ ' + name); });

async function addViewer(d1, region = '*') {
  d1.raw.prepare("INSERT INTO admin_users (username, password_hash, allowed_region, role, is_active) VALUES (?, ?, ?, 'section_f_viewer', 1)")
    .run(VIEWER.username, await auth.hashPassword(VIEWER.password), region);
}
const bootOf = html => JSON.parse(/window\.__ADMIN_BOOT = (.*);\n/.exec(html)[1]);

// every admin route: [method, path, body]
const ROUTES = [
  ['GET', '/api/admin/schedule'], ['GET', '/api/admin/cancellations'], ['GET', '/api/admin/curriculum'], ['GET', '/api/admin/plan'],
  ['GET', '/api/admin/audit'],
  ['PUT', '/api/admin/settings', { courseStartDate: '2026-10-10', courseEndDate: '2027-02-13', intervalDays: 7 }],
  ['POST', '/api/admin/cancellations', { date: '2026-11-14', reason: 'x' }],
  ['PUT', '/api/admin/cancellations/1', { date: '2026-11-14', reason: 'x' }], ['DELETE', '/api/admin/cancellations/1'],
  ['PUT', '/api/admin/curriculum/1', { title: { ko: 'x' } }], ['POST', '/api/admin/plan/apply', { token: 'x' }],
  ['PUT', '/api/admin/plan/pin', { uid: 'x', session: 1 }], ['POST', '/api/admin/audit/1/restore'],
  ['GET', '/api/admin/guide'], ['PUT', '/api/admin/guide', { title: 'x' }], ['POST', '/api/admin/section-f', {}],
];

(async () => {
  /* ================= worker ================= */
  await t('viewer logs in (role in the response and /api/auth/me) on both regions with allowed_region *', async () => {
    const shared = createD1({ seed: true });
    const wj = await makeRegionWorker('jeonju', { d1: shared });
    const wu = await makeRegionWorker('ulsan', { d1: shared, users: false });
    await addViewer(shared);
    for (const w of [wj, wu]) {
      const s = await w.login(VIEWER);
      assert.strictEqual(s.response.data.user.role, 'section_f_viewer');
      const me = await w.call('GET', '/api/auth/me', { cookie: s.cookie });
      assert.strictEqual(me.status, 200);
      assert.strictEqual(me.data.user.role, 'section_f_viewer');
    }
    const bad = await wj.call('POST', '/api/auth/login', { json: { username: VIEWER.username, password: 'wrong-password' } });
    assert.strictEqual(bad.status, 401);
  });

  await t('viewer: every /api/admin/* route (sections A-E and any SECTION F write) is 403 and the database is unchanged', async () => {
    const w = await makeRegionWorker('jeonju');
    await addViewer(w.d1);
    const s = await w.login(VIEWER);
    const before = snapshot(w.d1, 'jeonju', { audit: true });
    for (const [method, p, json] of ROUTES) {
      const r = await w.call(method, p, { cookie: s.cookie, csrf: s.csrf, json });
      assert.strictEqual(r.status, 403, `${method} ${p} -> ${r.status}`);
      assert(!JSON.stringify(r.data).includes('settings') && !JSON.stringify(r.data).includes('curriculum'), 'no data in the refusal');
    }
    assert.strictEqual(snapshot(w.d1, 'jeonju', { audit: true }), before);
    // a Bearer token is the same session: also refused
    const token = decodeURIComponent(s.cookie.split('=')[1]);
    assert.strictEqual((await w.call('GET', '/api/admin/schedule', { headers: { Authorization: 'Bearer ' + token } })).status, 403);
  });

  await t('/admin page: guide (Korean + Vietnamese text) for the viewer and admins, none for an anonymous visitor', async () => {
    const w = await makeRegionWorker('jeonju');
    await addViewer(w.d1);
    const anon = bootOf(await (await w.call('GET', '/admin')).text());
    assert.strictEqual(anon.guide, null);
    assert.deepStrictEqual([anon.role, anon.courseVi, anon.liveI18n], [null, {}, []]);
    const sv = await w.login(VIEWER);
    const html = await (await w.call('GET', '/admin', { cookie: sv.cookie })).text();
    const vb = bootOf(html);
    assert.strictEqual(vb.role, 'section_f_viewer');
    assert(vb.guide && vb.guide.units.length >= 16 && vb.guide.title.startsWith('교사용 지도서'), 'Korean guide');
    assert(vb.guide.viText[vb.guide.title], 'Vietnamese guide text');
    for (const u of [USERS.jeonju, USERS.super]) {
      const sa = await w.login(u);
      const ab = bootOf(await (await w.call('GET', '/admin', { cookie: sa.cookie })).text());
      assert.strictEqual(ab.role, 'admin');
      assert.deepStrictEqual(ab.guide, vb.guide);
    }
  });

  await t('no SECTION F text anywhere in the payload served without a login (HTML, boot JSON, scripts); all of it after a login', async () => {
    // Every text of the guide (Korean and Vietnamese) that is not also a label of the admin page's own code
    // (e.g. "교사용 지도서" in the tab name); checked raw and JSON-escaped, over the whole response body.
    const guide = require('../regional_admin/teaching_guide.json').jeonju;
    const code = ['admin_client.js', 'admin_ui.js', 'schedule_engine.js', 'distribution_engine.js']
      .map(f => fs.readFileSync(path.join(REPO_ROOT, 'regional_admin', f), 'utf8')).join('\n');
    const texts = new Set();
    (function walk(v) {
      if (typeof v === 'string') { const s = v.trim(); if (s.length >= 6 && !code.includes(s)) texts.add(s); }
      else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { walk(k); walk(x); });
    })(guide);
    assert(texts.size > 300, 'guide texts to look for: ' + texts.size);
    const forms = s => [s, JSON.stringify(s).slice(1, -1), JSON.stringify(s).slice(1, -1).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')];
    const leaked = body => [...texts].filter(s => forms(s).some(f => body.includes(f)));
    const w = await makeRegionWorker('jeonju');
    await addViewer(w.d1, 'jeonju');
    const bodies = {};
    bodies.anonymous = await (await w.call('GET', '/admin')).text();
    bodies.head = await (await w.call('HEAD', '/admin')).text();
    bodies.badCookie = await (await w.call('GET', '/admin', { cookie: 'admin_session=' + 'a'.repeat(64) })).text();
    await w.call('POST', '/api/auth/login', { json: { username: VIEWER.username, password: 'wrong-password' } });
    bodies.afterFailedLogin = await (await w.call('GET', '/admin')).text();
    const s = await w.login(VIEWER);
    const signedIn = await (await w.call('GET', '/admin', { cookie: s.cookie })).text();
    await w.call('POST', '/api/auth/logout', { cookie: s.cookie });
    bodies.afterLogout = await (await w.call('GET', '/admin', { cookie: s.cookie })).text();
    for (const [name, body] of Object.entries(bodies)) {
      if (name !== 'head') assert(body.includes('window.__ADMIN_BOOT') && body.includes('<script'), name + ': a real admin page');
      const l = leaked(body);
      assert.deepStrictEqual(l.slice(0, 5), [], `${name}: ${l.length} SECTION F texts in the response`);
      if (name !== 'head') assert.strictEqual(bootOf(body).guide, null, name + ': boot.guide');
    }
    // (the public student [과정] shows each week's methods and student materials by design; not checked here)
    // signed in: the whole guide is there
    assert.strictEqual(leaked(signedIn).length, texts.size, 'signed-in page carries every guide text');
    assert.deepStrictEqual(bootOf(signedIn).guide, guide);
  });

  await t('full admins keep every section (reads and writes); the superadmin too', async () => {
    const w = await makeRegionWorker('jeonju');
    await addViewer(w.d1);
    for (const u of [USERS.jeonju, USERS.super]) {
      const s = await w.login(u);
      for (const p of ['/api/admin/schedule', '/api/admin/cancellations', '/api/admin/curriculum', '/api/admin/plan', '/api/admin/audit']) {
        assert.strictEqual((await w.call('GET', p, { cookie: s.cookie })).status, 200, u.username + ' ' + p);
      }
      const add = await w.call('POST', '/api/admin/cancellations', { cookie: s.cookie, csrf: s.csrf, json: { date: u === USERS.super ? '2026-11-21' : '2026-11-14', reason: '테스트' } });
      assert.strictEqual(add.status, 200, u.username + ' write: ' + JSON.stringify(add.data));
      assert.strictEqual((await w.call('GET', '/api/auth/me', { cookie: s.cookie })).data.user.role, 'admin');
    }
  });

  await t('viewer logout ends the session', async () => {
    const w = await makeRegionWorker('jeonju');
    await addViewer(w.d1);
    const s = await w.login(VIEWER);
    const out = await w.call('POST', '/api/auth/logout', { cookie: s.cookie });
    assert.strictEqual(out.status, 200);
    assert(out.res.headers.get('Set-Cookie').includes('Max-Age=0'));
    assert.strictEqual((await w.call('GET', '/api/auth/me', { cookie: s.cookie })).status, 401);
    assert.strictEqual(bootOf(await (await w.call('GET', '/admin', { cookie: s.cookie })).text()).guide, null);
  });

  await t('viewer region: a jeonju-only viewer is refused on Ulsan', async () => {
    const shared = createD1({ seed: true });
    const wj = await makeRegionWorker('jeonju', { d1: shared });
    const wu = await makeRegionWorker('ulsan', { d1: shared, users: false });
    await addViewer(shared, 'jeonju');
    await wj.login(VIEWER);
    assert.strictEqual((await wu.call('POST', '/api/auth/login', { json: VIEWER })).status, 403);
  });

  await t('fail closed: the schema refuses an unknown role; a row that still has one cannot log in or use a session', async () => {
    const w = await makeRegionWorker('jeonju');
    assert.throws(() => w.d1.raw.prepare("INSERT INTO admin_users (username, password_hash, allowed_region, role) VALUES ('x', 'h', '*', 'superuser')").run(), /CHECK/);
    // simulate a row written outside the schema's CHECK (e.g. a database without it)
    await addViewer(w.d1);
    const s = await w.login(VIEWER);
    w.d1.raw.exec('PRAGMA ignore_check_constraints = ON');
    w.d1.raw.prepare("UPDATE admin_users SET role = 'superuser' WHERE username = ?").run(VIEWER.username);
    assert.strictEqual((await w.call('GET', '/api/auth/me', { cookie: s.cookie })).status, 403);
    assert.strictEqual((await w.call('GET', '/api/admin/schedule', { cookie: s.cookie })).status, 403);
    assert.strictEqual((await w.call('POST', '/api/auth/login', { json: VIEWER })).status, 403);
    assert.strictEqual(bootOf(await (await w.call('GET', '/admin', { cookie: s.cookie })).text()).guide, null);
  });

  await t('migration 0001: an old database keeps every account as admin and gains the role column', async () => {
    const oldSchema = fs.readFileSync(path.join(REPO_ROOT, 'regional_admin', 'schema.sql'), 'utf8')
      .replace(/\n    role TEXT[^\n]*\n(\s+--[^\n]*\n)+/, '\n');
    assert(!/\brole TEXT/.test(oldSchema), 'old schema built');
    const d1 = createD1({ schema: false });
    d1.raw.exec(oldSchema);
    d1.raw.prepare("INSERT INTO admin_users (username, password_hash, allowed_region) VALUES ('old_admin', 'h', 'jeonju')").run();
    d1.raw.exec(fs.readFileSync(path.join(REPO_ROOT, 'regional_admin', 'migrations', '0001_admin_role.sql'), 'utf8'));
    assert.strictEqual(d1.raw.prepare("SELECT role FROM admin_users WHERE username = 'old_admin'").get().role, 'admin');
    assert.throws(() => d1.raw.prepare("UPDATE admin_users SET role = 'x'").run(), /CHECK/);
  });

  await t('create_admin_user.py --role section_f_viewer: working PBKDF2 hash, no password in the SQL; admin SQL unchanged', async () => {
    const run = (args, pw) => spawnSync(PLATFORM.PYTHON, [path.join('scripts', 'create_admin_user.py'), ...args, '--password-env', 'SF_TEST_PW'],
      { cwd: REPO_ROOT, encoding: 'utf8', env: Object.assign({}, process.env, { SF_TEST_PW: pw }) });
    const r = run(['--username', 'sectionf.assistant', '--region', 'jeonju', '--role', 'section_f_viewer'], VIEWER.password);
    assert.strictEqual(r.status, 0, r.stderr);
    assert(!r.stdout.includes(VIEWER.password));
    assert(/^INSERT INTO admin_users \(username, password_hash, email, allowed_region, role, is_active\) VALUES \('sectionf\.assistant', 'pbkdf2:sha256:100000:[0-9a-f]{32}:[0-9a-f]{64}', NULL, 'jeonju', 'section_f_viewer', 1\);\r?\n$/.test(r.stdout), r.stdout);
    const d1 = createD1({ seed: true });
    d1.raw.exec(r.stdout);
    const row = d1.raw.prepare("SELECT password_hash, role FROM admin_users WHERE username = 'sectionf.assistant'").get();
    assert.strictEqual(row.role, 'section_f_viewer');
    assert.strictEqual(await auth.verifyPassword(VIEWER.password, row.password_hash), true);
    const a = run(['--username', 'kim', '--region', 'jeonju'], VIEWER.password);
    assert(/^INSERT INTO admin_users \(username, password_hash, email, allowed_region, is_active\) VALUES \('kim', /.test(a.stdout), a.stdout);
    assert.strictEqual(run(['--username', 'x1x', '--region', 'jeonju', '--role', 'owner'], VIEWER.password).status, 2);
  });

  await t('no account password of the real viewer anywhere in the repository sources or the bundles', () => {
    // The real password was given only in the chat; nothing that ships may contain an account hash or a password literal.
    const files = ['regional_admin/worker.js', 'regional_admin/auth.js', 'regional_admin/admin_ui.js', 'regional_admin/admin_client.js',
      'regional_admin/schema.sql', 'regional_admin/seed.sql', 'regional_admin/migrations/0001_admin_role.sql', 'dist/jeonju/_worker.js', 'dist/ulsan/_worker.js'];
    for (const f of files) {
      const s = fs.readFileSync(path.join(REPO_ROOT, f), 'utf8');
      assert(!/pbkdf2:sha256:100000:[0-9a-f]{32}:[0-9a-f]{64}/.test(s), f + ' contains a password hash');
      assert(!s.includes('sectionf.assistant'), f + ' contains the account');
    }
  });

  /* ================= browser ================= */
  await t('browser: the viewer sees only SECTION F in Korean and Vietnamese; an admin still sees A-F; logout', async () => {
    const w = await makeRegionWorker('jeonju');
    await addViewer(w.d1);
    const server = http.createServer(async (req, res) => {
      try {
        const chunks = [];
        for await (const c of req) chunks.push(c);
        const headers = {};
        for (const k of ['origin', 'cookie', 'content-type', 'x-csrf-token', 'sec-fetch-site', 'accept']) if (req.headers[k]) headers[k] = req.headers[k];
        const out = await w.worker.fetch(new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers,
          body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) }), w.env, {});
        const h = {};
        out.headers.forEach((v, k) => { h[k] = v; });
        // plain http in this test: drop Secure (asserted in test_regional_admin.js)
        if (out.headers.get('Set-Cookie')) h['set-cookie'] = out.headers.get('Set-Cookie').replace(/;\s*Secure/i, '');
        res.writeHead(out.status, h);
        res.end(Buffer.from(await out.arrayBuffer()));
      } catch (e) { res.writeHead(500); res.end(String(e)); }
    });
    await new Promise(r => server.listen(PORT, '127.0.0.1', r));
    const chrome = spawn(CHROME_PATH, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, '--remote-allow-origins=*', '--disable-gpu', '--no-first-run',
      '--host-resolver-rules=MAP jeonju.test 127.0.0.1', '--user-data-dir=' + path.join(PLATFORM.TMP, 'section_f_profile_' + process.pid)], { stdio: 'ignore' });
    const getJson = url => new Promise((res, rej) => http.get(url, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej));
    const errors = [];
    let ws;
    try {
      let list;
      for (let i = 0; i < 50 && !list; i++) { await sleep(300); try { list = await getJson(`http://127.0.0.1:${CDP_PORT}/json/list`); } catch (e) { /* not up yet */ } }
      ws = new WebSocket(list.find(x => x.type === 'page').webSocketDebuggerUrl);
      await new Promise(r => { ws.onopen = r; });
      let id = 1;
      const pending = new Map();
      ws.onmessage = m => {
        const j = JSON.parse(m.data);
        if (j.id && pending.has(j.id)) { pending.get(j.id)(j.result || j.error); pending.delete(j.id); }
        if (j.method === 'Runtime.exceptionThrown') errors.push('exception: ' + JSON.stringify(j.params.exceptionDetails).slice(0, 300));
        if (j.method === 'Runtime.consoleAPICalled' && j.params.type === 'error') errors.push('console.error: ' + JSON.stringify(j.params.args.map(a => a.value || a.description)).slice(0, 300));
        if (j.method === 'Log.entryAdded' && j.params.entry.level === 'error' && !/status of 40[13]|favicon/.test(j.params.entry.text + j.params.entry.url)) errors.push('log: ' + j.params.entry.text);
      };
      const send = (method, params = {}) => new Promise(r => { const i = id++; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
      const E = async expr => {
        const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
        if (r.exceptionDetails) throw new Error('eval failed: ' + JSON.stringify(r.exceptionDetails).slice(0, 300));
        return r.result && r.result.value;
      };
      const waitFor = async (expr, what) => {
        for (let i = 0; i < 150; i++) { try { if (await E(expr)) return; } catch (e) { /* navigating */ } await sleep(100); }
        throw new Error('timeout waiting for ' + what);
      };
      const ADMIN_URL = `http://jeonju.test:${PORT}/admin`;
      const goto = async () => { await send('Page.navigate', { url: ADMIN_URL }); await sleep(300); await waitFor("document.readyState === 'complete'", 'load'); };
      const login = async u => {
        await goto();
        await waitFor(`!!document.getElementById('login-form')`, 'login form');
        await E(`document.getElementById('login-username').value = ${JSON.stringify(u.username)}; document.getElementById('login-password').value = ${JSON.stringify(u.password)}; document.querySelector('#login-form button[type=submit]').click()`);
        await waitFor(`!!document.querySelector('.tabs-nav')`, 'tabs after login');
        await sleep(300);
      };
      const tabs = () => E(`[].map.call(document.querySelectorAll('.tabs-nav .tab-item'), function (b) { return b.textContent; })`);
      await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');

      // anonymous: no guide in the page
      await goto();
      await E(`localStorage.setItem('admin-lang', 'ko')`);
      assert.strictEqual(await E('window.__ADMIN_BOOT.guide'), null);

      // viewer, Korean
      await login(VIEWER);
      assert.deepStrictEqual(await tabs(), ['SECTION F — 교사용 지도서']);
      const ko = await E(`document.getElementById('tab-content').innerText`);
      assert(ko.includes('주별 지도 계획') && ko.includes('교수법 16가지') && /1주/.test(ko), 'Korean guide: ' + ko.slice(0, 120));
      assert(/SECTION F 읽기 전용/.test(await E(`document.getElementById('user-info').innerText`)));
      assert.strictEqual(await E(`document.querySelectorAll('#tab-content input, #tab-content textarea, #tab-content select, #tab-content [data-act="restore"]').length`), 0, 'no editing controls');
      // a forged tab click does nothing
      await E(`(function(){ var b = document.createElement('button'); b.setAttribute('data-act', 'tab'); b.setAttribute('data-tab', 'schedule'); document.body.appendChild(b); b.click(); })()`);
      await sleep(200);
      assert.deepStrictEqual(await tabs(), ['SECTION F — 교사용 지도서']);
      assert(!(await E(`!!document.getElementById('sett-start')`)), 'SECTION A form not rendered');
      // the page's own API calls for sections A-E are refused by the server
      const apiStatus = await E(`fetch('/api/admin/schedule', { credentials: 'same-origin' }).then(function (r) { return r.status; })`);
      assert.strictEqual(apiStatus, 403);

      // viewer, Vietnamese (language select -> reload)
      await E(`(function(){ var s = document.getElementById('lang-select'); s.value = 'vi'; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
      await sleep(500);
      await waitFor(`document.readyState === 'complete' && !!document.querySelector('.tabs-nav')`, 'vi reload');
      await sleep(300);
      assert.deepStrictEqual(await tabs(), ['PHẦN F — Sách hướng dẫn giáo viên']);
      const vi = await E(`document.getElementById('tab-content').innerText`);
      assert(vi.includes('Hướng dẫn cho giáo viên — Áp dụng Teaching Method #1–#16'), 'Vietnamese guide title: ' + vi.slice(0, 200));
      assert(/Tuần 1/.test(vi), 'Vietnamese week labels');
      assert(/PHẦN F \(chỉ đọc\)/.test(await E(`document.getElementById('user-info').innerText`)));
      // back to Korean
      await E(`(function(){ var s = document.getElementById('lang-select'); s.value = 'ko'; s.dispatchEvent(new Event('change', { bubbles: true })); })()`);
      await sleep(500);
      await waitFor(`document.readyState === 'complete' && !!document.querySelector('.tabs-nav')`, 'ko reload');
      await sleep(300);
      assert.deepStrictEqual(await tabs(), ['SECTION F — 교사용 지도서']);

      // logout
      await E(`document.getElementById('logout-btn').click()`);
      await sleep(500);
      await waitFor(`document.readyState === 'complete' && !!document.getElementById('login-form')`, 'login form after logout');
      assert.strictEqual(await E('window.__ADMIN_BOOT.guide'), null);

      // admin: all six sections
      await login(USERS.jeonju);
      assert.deepStrictEqual(await tabs(), ['SECTION A — 수업 기간', 'SECTION B — 휴강 관리', 'SECTION C — 원본 커리큘럼', 'SECTION D — 회차 배정',
        'SECTION E — 변경 이력 & 복구', 'SECTION F — 교사용 지도서']);
      assert(await E(`!!document.getElementById('sett-start')`), 'admin sees SECTION A form');
      assert(/관리자님/.test(await E(`document.getElementById('user-info').innerText`)));
      await E(`document.getElementById('logout-btn').click()`);
      await sleep(500);
    } finally {
      if (ws) ws.close();
      chrome.kill(); server.close();
    }
    assert.deepStrictEqual(errors, [], 'browser errors');
  });

  console.log(`--- ALL ${count} SECTION F VIEWER TESTS PASSED ---`);
})().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
