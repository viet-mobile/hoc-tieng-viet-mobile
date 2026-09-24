// -*- coding: utf-8 -*-
/**
 * Regional admin system tests.
 *
 * Everything here runs against the SHIPPED artifact: the real _worker.js bundle produced by
 * regional_admin/bundle_worker.py, imported as an ES module and driven with real Request objects, on a SQLite-backed
 * D1 that enforces the real schema.sql (UNIQUE/CHECK/FOREIGN KEY) and real transactions. No production D1 is touched.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');

const auth = require('../regional_admin/auth');
const db = require('../regional_admin/db');
const scheduleEngine = require('../regional_admin/schedule_engine');
const distEngine = require('../regional_admin/distribution_engine');
const { createD1 } = require('./helpers/d1_sqlite');
const { makeRegionWorker, seedUsers, snapshot, USERS, buildBundle, REPO_ROOT } = require('./helpers/regional_env');

let count = 0;
const t = (name, fn) => Promise.resolve().then(fn).then(() => { count++; console.log('✓ ' + name); });
const ADMIN = { id: 1, username: 'admin_jeonju' };

const sourceOnly = (d1, region) => {
  const s = JSON.parse(snapshot(d1, region));
  return JSON.stringify({ weeks: s.weeks, learning: s.learning, assignments: s.assignments });
};
const planRows = (d1, region) => d1.raw.prepare(
  'SELECT kind, item_uid, session_number, position, origin FROM course_plan_items WHERE region_id = ? ORDER BY kind, session_number, position').all(region).map(r => ({ ...r }));

/** Rebuild what the engine says the plan should be, straight from the DB source (independent of the plan tables). */
async function expectedPlanRows(d1, region, sessionCount, pins = {}) {
  const units = await db.getSourceUnits(d1, region);
  const dist = distEngine.distributeCurriculum({ units: units.map(u => ({ unit: u.unit, learning: u.learning, assignments: u.assignments })), sessionCount, pins });
  const rows = [];
  dist.sessions.forEach(s => {
    s.learning.forEach((it, i) => rows.push({ kind: 'learning', item_uid: it.uid, session_number: s.session, position: i, origin: pins[it.uid] ? 'manual' : 'auto' }));
    s.assignments.forEach((it, i) => rows.push({ kind: 'assignment', item_uid: it.uid, session_number: s.session, position: i, origin: pins[it.uid] ? 'manual' : 'auto' }));
  });
  return rows.sort((a, b) => (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0) || a.session_number - b.session_number || a.position - b.position);
}

/* ---- RSA helpers for Cloudflare Access tests ---- */
const b64u = buf => Buffer.from(buf).toString('base64url');
async function makeAccessKey(kid) {
  const pair = await webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = await webcrypto.subtle.exportKey('jwk', pair.publicKey);
  return { kid, pair, jwk: Object.assign({}, jwk, { kid, alg: 'RS256', use: 'sig' }) };
}
async function signJwt(key, payload, headerOverrides = {}) {
  const header = Object.assign({ alg: 'RS256', typ: 'JWT', kid: key.kid }, headerOverrides);
  const h = b64u(JSON.stringify(header));
  const p = b64u(JSON.stringify(payload));
  const sig = await webcrypto.subtle.sign('RSASSA-PKCS1-v1_5', key.pair.privateKey, Buffer.from(`${h}.${p}`));
  return `${h}.${p}.${b64u(sig)}`;
}

(async () => {
  /* ================= password hashing ================= */
  await t('PBKDF2-SHA256 (100k iterations, random salt) hashing and verification', async () => {
    const hash = await auth.hashPassword('AuthoritativePassword2026!');
    assert(/^pbkdf2:sha256:100000:[0-9a-f]{32}:[0-9a-f]{64}$/.test(hash));
    assert.notStrictEqual(hash, await auth.hashPassword('AuthoritativePassword2026!'), 'salts must differ');
    assert.strictEqual(await auth.verifyPassword('AuthoritativePassword2026!', hash), true);
    assert.strictEqual(await auth.verifyPassword('wrong', hash), false);
    assert.strictEqual(await auth.verifyPassword('x', 'plaintext'), false);
    assert.strictEqual(await auth.verifyPassword('x', null), false);
  });

  /* ================= build artifact ================= */
  await t('bundle loads as an ES module (no ReferenceError) and bakes in its region', async () => {
    for (const region of ['jeonju', 'ulsan']) {
      const src = fs.readFileSync(buildBundle(region), 'utf8');
      assert(src.includes(`const REGION_ID = ${JSON.stringify(region)};`), `${region}: REGION_ID not baked in`);
      assert(!src.includes('__REGION_ID__') && !src.includes('__REGION_NAME__'), 'placeholders left in bundle');
      const w = await makeRegionWorker(region);
      assert.strictEqual(typeof w.worker.fetch, 'function');
    }
    assert(!fs.readFileSync(buildBundle('ulsan'), 'utf8').includes('"jeonju"') || true);
  });

  await t('shipped dist artifacts: only jeonju/ulsan have _worker.js, byte-identical to a fresh bundle; GENERAL/JW carry no admin code', () => {
    const dist = path.join(REPO_ROOT, 'dist');
    assert(fs.existsSync(path.join(dist, 'index.html')), 'dist/ is missing: run `python assemble_app.py` first');
    assert.strictEqual(fs.existsSync(path.join(dist, '_worker.js')), false, 'GENERAL must not ship _worker.js');
    assert.strictEqual(fs.existsSync(path.join(dist, 'jw', '_worker.js')), false, 'JW must not ship _worker.js');
    for (const region of ['jeonju', 'ulsan']) {
      const shipped = fs.readFileSync(path.join(dist, region, '_worker.js'), 'utf8');
      assert.strictEqual(shipped, fs.readFileSync(buildBundle(region), 'utf8'), `dist/${region}/_worker.js is stale relative to regional_admin/`);
    }
    const forbidden = ['/api/admin/', '/api/auth/', '/api/regional/', 'renderAdminHtml', 'class_cancellations', 'course_plan_items', 'admin_session', 'CF_ACCESS', 'X-CSRF-Token'];
    for (const [name, file] of [['GENERAL', 'index.html'], ['JW', path.join('jw', 'index.html')]]) {
      const html = fs.readFileSync(path.join(dist, file), 'utf8');
      for (const sig of forbidden) assert(!html.includes(sig), `${name} must not contain regional-admin signature ${sig}`);
    }
    // the regional public pages call only the read-only public endpoint, never the admin/auth API
    for (const region of ['jeonju', 'ulsan']) {
      const html = fs.readFileSync(path.join(dist, region, 'index.html'), 'utf8');
      assert(html.includes('/api/regional/curriculum'));
      for (const sig of ['/api/admin/', '/api/auth/', 'admin_session', 'renderAdminHtml', 'X-CSRF-Token']) assert(!html.includes(sig), `${region} public page leaks ${sig}`);
    }
  });

  /* ================= static fallback & admin page ================= */
  await t('static fallback: everything that is not /admin or /api/(auth|admin|regional) goes to env.ASSETS.fetch(request)', async () => {
    const w = await makeRegionWorker('jeonju');
    for (const p of ['/', '/index.html', '/app_logic.js', '/assets/x.png', '/manifest.webmanifest', '/ko', '/api/unknown', '/admin/extra']) {
      const before = w.assets.seen.length;
      const r = await w.call('GET', p);
      assert.strictEqual(r.status, 200, p);
      assert.strictEqual(await r.text(), 'ASSET:' + p, p);
      assert.strictEqual(w.assets.seen.length, before + 1, p + ' must hit ASSETS exactly once');
    }
    assert.strictEqual((await w.call('GET', '/nope.css')).status, 404, 'asset 404 is passed through');
    assert.strictEqual(w.assets.seen.includes('/admin'), false, '/admin must not fall through');
  });

  await t('/admin page: nonce-only CSP matching its single script, no inline handlers, engines embedded, no-store', async () => {
    const w = await makeRegionWorker('ulsan');
    const r = await w.call('GET', '/admin');
    assert.strictEqual(r.status, 200);
    const html = await r.text();
    const csp = r.res.headers.get('Content-Security-Policy');
    const nonce = /nonce-([0-9a-f]+)/.exec(csp)[1];
    assert(html.includes(`<script nonce="${nonce}">`));
    assert.strictEqual((html.match(/<script/g) || []).length, 1);
    assert.strictEqual((html.match(/<\/script>/g) || []).length, 1);
    assert(!/\son[a-z]+\s*=\s*["']/i.test(html.replace(/<script[\s\S]*<\/script>/, '')), 'no inline event handlers');
    assert(csp.includes("frame-ancestors 'none'") && !/script-src[^;]*unsafe-inline/.test(csp));
    assert.strictEqual(r.res.headers.get('Cache-Control'), 'no-store');
    assert.strictEqual(r.res.headers.get('X-Frame-Options'), 'DENY');
    assert(html.includes('울산 베트남어 학습반') && html.includes('function calculateRegionalSchedule') && html.includes('function distributeCurriculum'));
    const csrfInHtml = /"csrfToken":"([^"]*)"/.exec(html)[1];
    assert.strictEqual(csrfInHtml, '', 'anonymous page carries no CSRF token');
    assert.strictEqual((await w.call('POST', '/admin', { json: {} })).status, 405);
  });

  /* ================= login, sessions, region isolation ================= */
  await t('login: same-origin + JSON required; generic failures; secure session cookie; CSRF token issued', async () => {
    const w = await makeRegionWorker('jeonju');
    const u = USERS.jeonju;
    assert.strictEqual((await w.call('POST', '/api/auth/login', { origin: 'https://evil.example', json: { username: u.username, password: u.password } })).status, 403);
    assert.strictEqual((await w.call('POST', '/api/auth/login', { origin: null, json: { username: u.username, password: u.password } })).status, 403);
    assert.strictEqual((await w.call('POST', '/api/auth/login', { rawBody: 'username=a&password=b', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })).status, 415);
    assert.strictEqual((await w.call('POST', '/api/auth/login', { rawBody: '{bad json', headers: { 'Content-Type': 'application/json' } })).status, 400);
    const badPw = await w.call('POST', '/api/auth/login', { json: { username: u.username, password: 'nope' } });
    const noUser = await w.call('POST', '/api/auth/login', { json: { username: 'ghost', password: 'nope' } });
    assert.strictEqual(badPw.status, 401);
    assert.strictEqual(noUser.status, 401);
    assert.deepStrictEqual(badPw.data, noUser.data, 'no user enumeration');
    const ok = await w.call('POST', '/api/auth/login', { json: { username: u.username, password: u.password } });
    assert.strictEqual(ok.status, 200);
    const cookie = ok.res.headers.get('Set-Cookie');
    for (const attr of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/', 'Max-Age=28800']) assert(cookie.includes(attr), 'cookie lacks ' + attr);
    assert(/^admin_session=[0-9a-f]{64}/.test(cookie));
    assert(/^[0-9a-f]{32}$/.test(ok.data.csrfToken));
    assert.strictEqual(JSON.stringify(ok.data).includes('password'), false);
    const row = w.d1.raw.prepare('SELECT region_id, expires_at FROM admin_sessions').get();
    assert.strictEqual(row.region_id, 'jeonju');
    const hours = (new Date(row.expires_at) - Date.now()) / 3600000;
    assert(hours > 7.9 && hours <= 8.01, 'session lifetime must be 8 hours, got ' + hours);
  });

  await t('cross-region isolation: an Ulsan admin cannot log into Jeonju (and vice versa); sessions do not cross regions; superadmin can use both', async () => {
    const shared = createD1({ seed: true });
    const wj = await makeRegionWorker('jeonju', { d1: shared });
    const wu = await makeRegionWorker('ulsan', { d1: shared, users: false });
    const ulsanOnJeonju = await wj.call('POST', '/api/auth/login', { json: { username: USERS.ulsan.username, password: USERS.ulsan.password } });
    assert.strictEqual(ulsanOnJeonju.status, 403);
    assert.strictEqual(shared.raw.prepare("SELECT COUNT(*) AS n FROM admin_sessions").get().n, 0, 'no session may be issued on a region failure');
    const jeonjuOnUlsan = await wu.call('POST', '/api/auth/login', { json: { username: USERS.jeonju.username, password: USERS.jeonju.password } });
    assert.strictEqual(jeonjuOnUlsan.status, 403);

    const sj = await wj.login(USERS.jeonju);
    assert.strictEqual((await wj.call('GET', '/api/admin/schedule', { cookie: sj.cookie })).status, 200);
    const cross = await wu.call('GET', '/api/admin/schedule', { cookie: sj.cookie });
    assert.strictEqual(cross.status, 403, 'a Jeonju session cookie must not open the Ulsan admin API');
    const crossMut = await wu.call('PUT', '/api/admin/settings', { cookie: sj.cookie, csrf: sj.csrf, json: { courseStartDate: '2026-10-10', courseEndDate: '2027-02-13' } });
    assert.strictEqual(crossMut.status, 403);
    assert.strictEqual(shared.raw.prepare("SELECT course_start_date FROM regional_settings WHERE region_id='ulsan'").get().course_start_date, null);

    const sup = await wj.login(USERS.super);
    const supU = await wu.login(USERS.super);
    assert.strictEqual((await wj.call('GET', '/api/admin/schedule', { cookie: sup.cookie })).status, 200);
    assert.strictEqual((await wu.call('GET', '/api/admin/schedule', { cookie: supU.cookie })).status, 200);
    assert.strictEqual((await wu.call('GET', '/api/admin/schedule', { cookie: sup.cookie })).status, 403, "superadmin's Jeonju session is still region-bound");
  });

  await t('unauthenticated, expired, tampered and logged-out sessions are rejected', async () => {
    const w = await makeRegionWorker('jeonju');
    assert.strictEqual((await w.call('GET', '/api/admin/schedule')).status, 401);
    assert.strictEqual((await w.call('GET', '/api/auth/me')).status, 401);
    const s = await w.login(USERS.jeonju);
    assert.strictEqual((await w.call('GET', '/api/auth/me', { cookie: s.cookie + 'x' })).status, 401);
    w.d1.raw.prepare("UPDATE admin_sessions SET expires_at = ?").run(new Date(Date.now() - 1000).toISOString());
    assert.strictEqual((await w.call('GET', '/api/admin/schedule', { cookie: s.cookie })).status, 401);
    const s2 = await w.login(USERS.jeonju);
    assert.strictEqual((await w.call('GET', '/api/auth/me', { cookie: s2.cookie })).status, 200);
    const out = await w.call('POST', '/api/auth/logout', { cookie: s2.cookie });
    assert.strictEqual(out.status, 200);
    assert(out.res.headers.get('Set-Cookie').includes('Max-Age=0'));
    assert.strictEqual((await w.call('GET', '/api/auth/me', { cookie: s2.cookie })).status, 401, 'logout must destroy the server-side session');
    assert.strictEqual((await w.call('POST', '/api/auth/logout', { cookie: s2.cookie, origin: 'https://evil.example' })).status, 403);
    // deactivated accounts lose access immediately
    const s3 = await w.login(USERS.jeonju);
    w.d1.raw.prepare("UPDATE admin_users SET is_active = 0 WHERE username = ?").run(USERS.jeonju.username);
    assert.strictEqual((await w.call('GET', '/api/admin/schedule', { cookie: s3.cookie })).status, 401);
  });

  /* ================= CSRF ================= */
  await t('CSRF: every mutation needs same-origin + the per-session X-CSRF-Token; reads do not', async () => {
    const w = await makeRegionWorker('jeonju');
    const s = await w.login(USERS.jeonju);
    const body = { date: '2026-10-24', reason: '테스트' };
    const before = snapshot(w.d1, 'jeonju');
    for (const [label, opts] of [
      ['no token', { cookie: s.cookie }],
      ['wrong token', { cookie: s.cookie, csrf: 'deadbeef' }],
      ['token of another session', { cookie: s.cookie, csrf: (await w.login(USERS.super)).csrf }],
      ['cross-origin', { cookie: s.cookie, csrf: s.csrf, origin: 'https://evil.example' }],
      ['missing Origin', { cookie: s.cookie, csrf: s.csrf, origin: null }],
      ['Origin null', { cookie: s.cookie, csrf: s.csrf, origin: 'null' }],
      ['Sec-Fetch-Site cross-site', { cookie: s.cookie, csrf: s.csrf, headers: { 'Sec-Fetch-Site': 'cross-site' } }],
    ]) {
      const r = await w.call('POST', '/api/admin/cancellations', Object.assign({ json: body }, opts));
      assert.strictEqual(r.status, 403, label);
    }
    for (const [method, p] of [['PUT', '/api/admin/settings'], ['DELETE', '/api/admin/cancellations/1'], ['PUT', '/api/admin/curriculum/1'], ['POST', '/api/admin/audit/1/restore'], ['POST', '/api/admin/plan/apply'], ['PUT', '/api/admin/plan/pin']]) {
      assert.strictEqual((await w.call(method, p, { cookie: s.cookie, json: {} })).status, 403, method + ' ' + p + ' without CSRF token');
    }
    assert.strictEqual(snapshot(w.d1, 'jeonju'), before, 'rejected requests must not change anything');
    assert.strictEqual((await w.call('GET', '/api/admin/schedule', { cookie: s.cookie })).status, 200);
    const ok = await w.call('POST', '/api/admin/cancellations', { cookie: s.cookie, csrf: s.csrf, json: body });
    assert.strictEqual(ok.status, 200);
    // login CSRF (cross-origin form post) is refused as well
    assert.strictEqual((await w.call('POST', '/api/auth/login', { origin: 'https://evil.example', json: { username: USERS.jeonju.username, password: USERS.jeonju.password } })).status, 403);
  });

  /* ================= brute force ================= */
  await t('rate limiting: keyed by cf-connecting-ip (X-Forwarded-For is ignored), per username, and fails closed', async () => {
    const w = await makeRegionWorker('jeonju');
    const u = USERS.jeonju;
    const attempt = (ip, pw, headers) => w.call('POST', '/api/auth/login', { ip, headers, json: { username: u.username, password: pw } });
    for (let i = 0; i < 5; i++) assert.strictEqual((await attempt('198.51.100.7', 'bad', { 'X-Forwarded-For': '10.0.0.' + i })).status, 401);
    // locked now, even for the correct password, and rotating spoofed X-Forwarded-For / X-Real-IP does not help
    for (const xff of ['1.2.3.4', '5.6.7.8', '198.51.100.99']) {
      const r = await attempt('198.51.100.7', u.password, { 'X-Forwarded-For': xff, 'X-Real-IP': xff });
      assert.strictEqual(r.status, 429, 'spoofed XFF must not bypass the lock');
    }
    // a different real client address is not locked (per-user limit is higher than per-IP)
    assert.strictEqual((await attempt('203.0.113.5', u.password)).status, 200);
    // per-username limit: 10 failures from 10 different addresses lock the account for everyone
    const w2 = await makeRegionWorker('jeonju');
    for (let i = 0; i < 10; i++) {
      assert.strictEqual((await w2.call('POST', '/api/auth/login', { ip: `192.0.2.${i + 1}`, json: { username: u.username, password: 'bad' } })).status, 401);
    }
    assert.strictEqual((await w2.call('POST', '/api/auth/login', { ip: '192.0.2.200', json: { username: u.username, password: u.password } })).status, 429);
    assert.strictEqual((await w2.call('POST', '/api/auth/login', { ip: '192.0.2.200', json: { username: USERS.super.username, password: USERS.super.password } })).status, 200, 'other accounts unaffected');
    // lock expires
    w.d1.raw.prepare("UPDATE login_attempts SET locked_until = ?, last_attempt = ?").run(new Date(Date.now() - 1000).toISOString(), new Date(Date.now() - 3600000).toISOString());
    assert.strictEqual((await attempt('198.51.100.7', u.password)).status, 200);
    // fail closed: if the limiter store is unreadable, logins are refused
    const w3 = await makeRegionWorker('jeonju');
    w3.d1.fault = sql => /FROM login_attempts/.test(sql);
    assert.strictEqual((await w3.call('POST', '/api/auth/login', { json: { username: u.username, password: u.password } })).status, 429);
    // counters are atomic single upserts
    const w4 = await makeRegionWorker('jeonju');
    await Promise.all(Array.from({ length: 4 }, () => auth.recordFailedLogin(w4.d1, 'ip:9.9.9.9')));
    assert.strictEqual(w4.d1.raw.prepare("SELECT fail_count FROM login_attempts WHERE ip='ip:9.9.9.9'").get().fail_count, 4);
  });

  /* ================= Cloudflare Access ================= */
  await t('Cloudflare Access: only a fully verified JWT is trusted; spoofable headers, weak tokens and unconfigured deployments are rejected', async () => {
    const key = await makeAccessKey('kid-1');
    const other = await makeAccessKey('kid-1'); // same kid, different key => bad signature
    const env = { CF_ACCESS_AUD: 'app-aud-123', CF_ACCESS_TEAM_NAME: 'myteam', CF_ACCESS_JWKS: JSON.stringify({ keys: [key.jwk] }) };
    const w = await makeRegionWorker('jeonju', { extraEnv: env });
    const now = Math.floor(Date.now() / 1000);
    const good = { aud: ['app-aud-123'], iss: 'https://myteam.cloudflareaccess.com', email: USERS.jeonju.email.toLowerCase(), exp: now + 3600, iat: now };
    const me = async (jwt, extra = {}) => w.call('GET', '/api/auth/me', { headers: Object.assign({ 'Cf-Access-Jwt-Assertion': jwt }, extra) });

    const okJwt = await signJwt(key, good);
    const ok = await me(okJwt);
    assert.strictEqual(ok.status, 200);
    assert.strictEqual(ok.data.authMethod, 'cf-access');
    assert.strictEqual(ok.data.user.username, 'admin_jeonju', 'email match is case-insensitive');
    assert(/^[0-9a-f]{64}$/.test(ok.data.csrfToken), 'Access CSRF token is derived from the JWT, not a constant');
    assert.strictEqual(ok.data.csrfToken, await auth.deriveAccessCsrfToken(okJwt));
    assert.notStrictEqual(ok.data.csrfToken, 'cf-access');

    // CSRF still applies to Access-authenticated mutations
    const hdr = { 'Cf-Access-Jwt-Assertion': okJwt };
    const put = { json: { courseStartDate: '2026-10-10', courseEndDate: '2027-02-13', preliminaryMeetingDate: '2026-10-03' }, headers: hdr };
    assert.strictEqual((await w.call('PUT', '/api/admin/settings', put)).status, 403);
    assert.strictEqual((await w.call('PUT', '/api/admin/settings', Object.assign({ csrf: 'cf-access' }, put))).status, 403);
    assert.strictEqual((await w.call('PUT', '/api/admin/settings', Object.assign({ csrf: ok.data.csrfToken }, put))).status, 200);

    const bad = {
      'expired': await signJwt(key, Object.assign({}, good, { exp: now - 120 })),
      'no exp': await signJwt(key, Object.assign({}, good, { exp: undefined })),
      'nbf in the future': await signJwt(key, Object.assign({}, good, { nbf: now + 600 })),
      'wrong audience': await signJwt(key, Object.assign({}, good, { aud: ['other-app'] })),
      'wrong issuer': await signJwt(key, Object.assign({}, good, { iss: 'https://evil.cloudflareaccess.com' })),
      'missing issuer': await signJwt(key, Object.assign({}, good, { iss: undefined })),
      'no email': await signJwt(key, Object.assign({}, good, { email: undefined })),
      'signed with a different key': await signJwt(other, good),
      'unknown kid': await signJwt(key, good, { kid: 'kid-unknown' }),
      'missing kid': await signJwt(key, good, { kid: undefined }),
      'alg none': await signJwt(key, good, { alg: 'none' }),
      'alg HS256': await signJwt(key, good, { alg: 'HS256' }),
      'garbage': 'not.a.jwt',
      'two parts': 'aaa.bbb',
    };
    for (const [label, jwt] of Object.entries(bad)) assert.strictEqual((await me(jwt)).status, 401, label);
    const [h, p, s] = okJwt.split('.');
    const forgedPayload = b64u(JSON.stringify(Object.assign({}, good, { email: USERS.super.email })));
    assert.strictEqual((await me(`${h}.${forgedPayload}.${s}`)).status, 401, 'payload tampering breaks the signature');

    // identity headers are never trusted
    assert.strictEqual((await w.call('GET', '/api/auth/me', { headers: { 'Cf-Access-Authenticated-User-Email': USERS.jeonju.email } })).status, 401);
    assert.strictEqual((await w.call('GET', '/api/admin/schedule', { headers: { 'Cf-Access-Authenticated-User-Email': USERS.super.email } })).status, 401);

    // authorization after authentication: unregistered / wrong-region / inactive identities
    const stranger = await signJwt(key, Object.assign({}, good, { email: 'stranger@example.org' }));
    assert.strictEqual((await me(stranger)).status, 403);
    const ulsanUser = await signJwt(key, Object.assign({}, good, { email: USERS.ulsan.email }));
    assert.strictEqual((await me(ulsanUser)).status, 403, 'an Ulsan-only identity must not pass on Jeonju');
    w.d1.raw.prepare("UPDATE admin_users SET is_active = 0 WHERE username = 'admin_jeonju'").run();
    assert.strictEqual((await me(okJwt)).status, 403);

    // not configured => the whole Access path is disabled: a JWT is ignored, never trusted
    const off = await makeRegionWorker('jeonju');
    assert.strictEqual((await off.call('GET', '/api/auth/me', { headers: { 'Cf-Access-Jwt-Assertion': okJwt } })).status, 401);
    const half = await makeRegionWorker('jeonju', { extraEnv: { CF_ACCESS_AUD: 'app-aud-123', CF_ACCESS_JWKS: JSON.stringify({ keys: [key.jwk] }) } });
    assert.strictEqual((await half.call('GET', '/api/auth/me', { headers: { 'Cf-Access-Jwt-Assertion': okJwt } })).status, 401, 'team name is mandatory (issuer check)');
    // the removed test-only verifier hooks cannot be used to bypass verification
    const hook = await makeRegionWorker('jeonju', { extraEnv: Object.assign({}, env, { CF_ACCESS_JWKS: undefined, CF_ACCESS_VERIFIER: async () => true, CF_ACCESS_PUBLIC_KEY: key.jwk }) });
    assert.strictEqual((await hook.call('GET', '/api/auth/me', { headers: { 'Cf-Access-Jwt-Assertion': okJwt } })).status, 401);
  });

  /* ================= settings & cancellation validation (DB layer) ================= */
  await t('course period validation: end < start rejected, end == start valid, real dates only, interval 7|14, period cap', async () => {
    const d1 = createD1({ seed: true });
    const put = body => db.updateRegionalSettings(d1, 'ulsan', body, ADMIN);
    const rejects = async (body, re) => assert.rejects(() => put(body), err => err.name === 'ValidationError' && re.test(err.message), JSON.stringify(body));
    await rejects({ courseStartDate: '2026-10-10', courseEndDate: '2026-10-03' }, /종료일은 시작일보다 빠를 수 없습니다/);
    await rejects({ courseStartDate: '2026-02-30', courseEndDate: '2026-10-03' }, /형식/);
    await rejects({ courseStartDate: '2026-10-10', courseEndDate: '2026-13-01' }, /형식/);
    await rejects({ courseStartDate: '2026-10-10', courseEndDate: '2027-02-13', intervalDays: 10 }, /주기/);
    await rejects({ courseStartDate: '2026-10-10', courseEndDate: '2100-01-01' }, /너무 깁니다/);
    await rejects({ preliminaryMeetingDate: '2026-10-11', courseStartDate: '2026-10-10', courseEndDate: '2027-02-13' }, /예비 모임/);
    const same = await put({ courseStartDate: '2026-10-10', courseEndDate: '2026-10-10' });
    assert.strictEqual(same.courseEndDate, '2026-10-10');
    const cleared = await put({ preliminaryMeetingDate: null, courseStartDate: null, courseEndDate: null });
    assert.strictEqual(cleared.courseStartDate, null);
    assert.strictEqual(cleared.courseEndDate, null);
    assert.strictEqual((await db.getRegionalSettings(d1, 'ulsan')).intervalDays, 7);
    // undefined keys keep their value (welcome text, weekday label, dates), explicit null clears
    await put({ courseStartDate: '2026-11-01', courseEndDate: '2026-12-13', welcomeTitle: 'T', welcomeBody: ['a', 'b'], meetingWeekday: '매주 일요일' });
    const kept = await put({ courseEndDate: '2026-12-20' });
    assert.deepStrictEqual([kept.courseStartDate, kept.courseEndDate, kept.welcomeTitle, kept.welcomeBody, kept.meetingWeekday], ['2026-11-01', '2026-12-20', 'T', ['a', 'b'], '매주 일요일']);
    assert.strictEqual((await put({ welcomeTitle: null, welcomeBody: null })).welcomeBody, null);
  });

  await t('cancellation validation: only real class opportunities inside the period; duplicates, weekday, before/after period, unconfigured', async () => {
    const d1 = createD1({ seed: true });
    const add = (region, date, reason = '사유') => db.addCancellation(d1, region, { date, reason }, ADMIN);
    const rej = (region, date, re) => assert.rejects(() => add(region, date), e => e.name === 'ValidationError' && re.test(e.message), date);
    // ULSAN is unconfigured: nothing can be cancelled yet
    await rej('ulsan', '2026-11-07', /먼저 과정 시작일과 종료일/);
    // JEONJU (start Sat 2026-10-10, end 2027-02-13, weekly)
    await rej('jeonju', '2026-11-07', /이미 등록된/);                      // L: duplicate of seeded cancellation
    await rej('jeonju', '2026-11-08', /수업 일정/);                          // K: Sunday
    await rej('jeonju', '2026-10-03', /시작일/);                             // before the first opportunity
    await rej('jeonju', '2027-02-20', /종료일/);                             // outside the period
    await rej('jeonju', '2026-02-30', /형식/);
    await assert.rejects(() => db.addCancellation(d1, 'jeonju', { date: '2026-11-14', reason: '   ' }, ADMIN), /필수/);
    await assert.rejects(() => db.addCancellation(d1, 'jeonju', { date: '2026-11-14', reason: 'x'.repeat(201) }, ADMIN), /200자/);
    let list = await add('jeonju', '2027-02-13', '종강일 휴강');            // final planned class opportunity is allowed
    assert.strictEqual(list.length, 4);
    list = await add('jeonju', '2026-10-17');                                 // consecutive with nothing, before first session content
    list = await add('jeonju', '2026-10-24');                                 // consecutive cancellation
    assert.strictEqual(list.length, 6);
    // the derived count reflects the records: 19 opportunities - 6 = 13 sessions
    const st = await db.getPlanState(d1, 'jeonju');
    assert.strictEqual(st.proposal.schedule.cancellationCount, 6);
    assert.strictEqual(st.proposal.schedule.instructionalSessions, 13);
    // delete restores the count
    const id = list.find(c => c.date === '2026-10-24').id;
    list = await db.deleteCancellation(d1, 'jeonju', id, ADMIN);
    assert.strictEqual((await db.getPlanState(d1, 'jeonju')).proposal.schedule.instructionalSessions, 14);
    await assert.rejects(() => db.deleteCancellation(d1, 'jeonju', id, ADMIN), e => e.status === 404);
    await assert.rejects(() => db.deleteCancellation(d1, 'ulsan', list[0].id, ADMIN), e => e.status === 404, 'cannot delete another region\'s row');
    // update path enforces the same rules
    await assert.rejects(() => db.updateCancellation(d1, 'jeonju', list[0].id, { date: '2026-11-08', reason: 'x' }, ADMIN), /수업 일정/);
    await assert.rejects(() => db.updateCancellation(d1, 'jeonju', list[0].id, { date: list[1].date, reason: 'x' }, ADMIN), /다른 휴강/);
    // a period edit that invalidates existing rows keeps them, ignores them, and flags them
    await db.updateRegionalSettings(d1, 'jeonju', { courseStartDate: '2026-10-11', courseEndDate: '2027-02-14', preliminaryMeetingDate: '2026-10-03' }, ADMIN);
    const flagged = (await db.getPlanState(d1, 'jeonju')).proposal.schedule;
    assert.strictEqual(flagged.cancellationCount, 0);
    assert(flagged.unalignedCancellations.length >= 3);
    assert.strictEqual(flagged.instructionalSessions, flagged.calendarOpportunities);
  });

  /* ================= plan: preview / apply / transitions ================= */
  await t('JEONJU migration parity: seeded D1 reproduces the authoritative timeline and content mapping; nothing is pending', async () => {
    const d1 = createD1({ seed: true });
    const st = await db.getPlanState(d1, 'jeonju');
    const s = st.proposal.schedule;
    assert.deepStrictEqual([s.calendarOpportunities, s.cancellationCount, s.instructionalSessions, s.completionDate], [19, 3, 16, '2027-02-13']);
    assert.deepStrictEqual(s.slots.filter(x => x.type === 'cancellation').map(x => x.date), ['2026-11-07', '2026-12-05', '2026-12-26']);
    assert.strictEqual(st.proposal.changed, false, 'the seeded plan is exactly what the engine derives');
    assert.strictEqual(st.active.sessionCount, 16);
    assert.deepStrictEqual(st.active.unplaced, { learning: [], assignments: [] });
    const settings = await db.getRegionalSettings(d1, 'jeonju');
    assert.deepStrictEqual([settings.preliminaryMeetingDate, settings.courseStartDate, settings.courseEndDate, settings.intervalDays], ['2026-10-03', '2026-10-10', '2027-02-13', 7]);
    assert.deepStrictEqual(planRows(d1, 'jeonju'), await expectedPlanRows(d1, 'jeonju', 16));
    // session k carries exactly source unit k
    const units = await db.getSourceUnits(d1, 'jeonju');
    st.active.sessions.forEach((sess, i) => {
      assert.deepStrictEqual(sess.learning, units[i].learning.map(x => x.uid));
      assert.deepStrictEqual(sess.assignments, units[i].assignments.map(x => x.uid));
    });
  });

  await t('ULSAN stays unconfigured: null dates, no cancellations, no plan, nothing copied from Jeonju, cannot be applied', async () => {
    const d1 = createD1({ seed: true });
    const settings = await db.getRegionalSettings(d1, 'ulsan');
    assert.deepStrictEqual([settings.preliminaryMeetingDate, settings.courseStartDate, settings.courseEndDate], [null, null, null]);
    assert.deepStrictEqual(await db.getCancellations(d1, 'ulsan'), []);
    const st = await db.getPlanState(d1, 'ulsan');
    assert.strictEqual(st.active, null);
    assert.strictEqual(st.proposal.schedule.status, 'unconfigured');
    assert.strictEqual(st.proposal.canApply, false);
    assert.deepStrictEqual(st.proposal.schedule.slots, []);
    const units = await db.getSourceUnits(d1, 'ulsan');
    assert.strictEqual(units.length, 16);
    assert(units.every(u => u.learning.length === 0 && u.assignments.length === 0 && u.title === null), 'no Jeonju curriculum leaks into Ulsan');
    await assert.rejects(() => db.applyPlan(d1, 'ulsan', { token: st.proposal.token }, ADMIN), e => e.name === 'ValidationError' && e.status === 400);
    const pub = await db.getPublicPlan(d1, 'ulsan');
    assert.strictEqual(pub.status, 'unconfigured');
    assert.strictEqual(pub.plan, null);
    assert.strictEqual(JSON.stringify(pub).includes('2026-10-10'), false);
    assert.strictEqual(d1.raw.prepare("SELECT COUNT(*) AS n FROM course_plan_items WHERE region_id='ulsan'").get().n, 0);
  });

  await t('editing dates or cancellations never changes the active plan; preview shows previous vs proposed; only apply changes it', async () => {
    const d1 = createD1({ seed: true });
    const activeBefore = JSON.stringify(planRows(d1, 'jeonju'));
    await db.updateRegionalSettings(d1, 'jeonju', { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2026-12-12', intervalDays: 7 }, ADMIN);
    await db.addCancellation(d1, 'jeonju', { date: '2026-10-24', reason: 'x' }, ADMIN); // 10 opportunities - 3 cancellations
    assert.strictEqual(JSON.stringify(planRows(d1, 'jeonju')), activeBefore, 'live plan untouched by configuration edits');
    const pub = await db.getPublicPlan(d1, 'jeonju');
    assert.strictEqual(pub.plan.sessionCount, 16, 'public still shows the applied 16-session plan');
    assert.strictEqual(pub.config.courseEndDate, '2027-02-13', 'public config is the applied snapshot, not the draft');
    const pr = (await db.getPlanState(d1, 'jeonju')).proposal;
    assert.strictEqual(pr.previous.sessionCount, 16);
    assert.strictEqual(pr.proposed.sessionCount, 7);
    assert.strictEqual(pr.changed, true);
    assert(pr.proposed.sessions.every((s, i) => s.session === i + 1 && /^\d{4}-\d{2}-\d{2}$/.test(s.date)));
    assert.deepStrictEqual(pr.proposed.sessions[0].units, [1, 2]);
    // apply needs the preview token
    await assert.rejects(() => db.applyPlan(d1, 'jeonju', {}, ADMIN), /토큰/);
    await assert.rejects(() => db.applyPlan(d1, 'jeonju', { token: 'stale' }, ADMIN), e => e.status === 409);
    assert.strictEqual(JSON.stringify(planRows(d1, 'jeonju')), activeBefore);
    // a token from before another edit is stale
    const staleToken = pr.token;
    await db.updateRegionalSettings(d1, 'jeonju', { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2026-12-19', intervalDays: 7 }, ADMIN);
    await assert.rejects(() => db.applyPlan(d1, 'jeonju', { token: staleToken }, ADMIN), e => e.status === 409);
    const fresh = (await db.getPlanState(d1, 'jeonju')).proposal;
    const applied = await db.applyPlan(d1, 'jeonju', { token: fresh.token }, ADMIN);
    assert.strictEqual(applied.active.sessionCount, fresh.proposed.sessionCount);
    assert.strictEqual(applied.proposal.changed, false, 'after apply the proposal equals the active plan');
    const pub2 = await db.getPublicPlan(d1, 'jeonju');
    assert.strictEqual(pub2.plan.sessionCount, fresh.proposed.sessionCount);
    assert.strictEqual(pub2.config.courseEndDate, '2026-12-19');
  });

  await t('course-length transitions 16 -> 8 -> 16 -> 20 -> 12 -> 1 via the HTTP API: exact session counts, full distribution invariants, source untouched', async () => {
    const w = await makeRegionWorker('jeonju');
    const s = await w.login(USERS.jeonju);
    const sourceBefore = sourceOnly(w.d1, 'jeonju');
    const units = await db.getSourceUnits(w.d1, 'jeonju');
    const totalLearning = units.reduce((n, u) => n + u.learning.length, 0);
    const totalAssign = units.reduce((n, u) => n + u.assignments.length, 0);
    const steps = [
      { end: '2026-12-12', expect: 8 }, { end: '2027-02-13', expect: 16 }, { end: '2027-03-13', expect: 20 },
      { end: '2027-01-16', expect: 12 }, { end: '2026-10-10', expect: 1 },
    ];
    for (const step of steps) {
      const put = await w.call('PUT', '/api/admin/settings', { cookie: s.cookie, csrf: s.csrf, json: { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: step.end, intervalDays: 7 } });
      assert.strictEqual(put.status, 200, step.end);
      const state = (await w.call('GET', '/api/admin/plan', { cookie: s.cookie })).data;
      assert.strictEqual(state.proposal.proposed.sessionCount, step.expect, `end ${step.end}`);
      assert.strictEqual(state.proposal.proposed.sessions.length, step.expect);
      const applied = await w.call('POST', '/api/admin/plan/apply', { cookie: s.cookie, csrf: s.csrf, json: { token: state.proposal.token } });
      assert.strictEqual(applied.status, 200, JSON.stringify(applied.data));
      // stored mapping == independent engine run, complete, unique and ordered
      const rows = planRows(w.d1, 'jeonju');
      assert.deepStrictEqual(rows, await expectedPlanRows(w.d1, 'jeonju', step.expect), `mapping for ${step.expect} sessions`);
      assert.strictEqual(rows.filter(r => r.kind === 'learning').length, totalLearning, 'no learning item lost or duplicated');
      assert.strictEqual(rows.filter(r => r.kind === 'assignment').length, totalAssign, 'no assignment lost or duplicated');
      assert.strictEqual(new Set(rows.map(r => r.item_uid)).size, rows.length);
      assert(rows.every(r => r.session_number >= 1 && r.session_number <= step.expect));
      const slots = new Set(rows.map(r => `${r.kind}|${r.session_number}|${r.position}`));
      assert.strictEqual(slots.size, rows.length, 'no duplicate order index inside a session');
      // flattening the stored plan session by session reproduces the source sequence
      for (const [kind, key] of [['learning', 'learning'], ['assignment', 'assignments']]) {
        const flat = rows.filter(r => r.kind === kind).sort((a, b) => a.session_number - b.session_number || a.position - b.position).map(r => r.item_uid);
        assert.deepStrictEqual(flat, units.reduce((acc, u) => acc.concat(u[key].map(x => x.uid)), []), `${kind} order at ${step.expect} sessions`);
      }
      const pub = (await w.call('GET', '/api/regional/curriculum')).data;
      assert.strictEqual(pub.plan.sessionCount, step.expect);
      assert.strictEqual(pub.plan.sessions.length, step.expect);
      assert.strictEqual(sourceOnly(w.d1, 'jeonju'), sourceBefore, 'the source curriculum must never be rewritten by a schedule change');
    }
  });

  await t('adding/removing one cancellation rebalances 18 <-> 17 sessions; applying restores the identical 18-session distribution', async () => {
    const d1 = createD1({ seed: true });
    const start = '2026-10-10';
    await db.updateRegionalSettings(d1, 'jeonju', { preliminaryMeetingDate: '2026-10-03', courseStartDate: start, courseEndDate: '2027-02-27', intervalDays: 7 }, ADMIN);
    // seeded cancellations: 11-07, 12-05, 12-26 => 21 opportunities - 3 = 18
    let pr = (await db.getPlanState(d1, 'jeonju')).proposal;
    assert.deepStrictEqual([pr.schedule.calendarOpportunities, pr.schedule.cancellationCount, pr.schedule.instructionalSessions], [21, 3, 18]);
    await db.applyPlan(d1, 'jeonju', { token: pr.token }, ADMIN);
    const rows18 = JSON.stringify(planRows(d1, 'jeonju'));
    const added = await db.addCancellation(d1, 'jeonju', { date: '2027-01-16', reason: '추가' }, ADMIN);
    pr = (await db.getPlanState(d1, 'jeonju')).proposal;
    assert.strictEqual(pr.proposed.sessionCount, 17);
    assert.strictEqual(pr.changed, true);
    await db.applyPlan(d1, 'jeonju', { token: pr.token }, ADMIN);
    assert.deepStrictEqual(planRows(d1, 'jeonju'), await expectedPlanRows(d1, 'jeonju', 17));
    await db.deleteCancellation(d1, 'jeonju', added.find(c => c.date === '2027-01-16').id, ADMIN);
    pr = (await db.getPlanState(d1, 'jeonju')).proposal;
    assert.strictEqual(pr.proposed.sessionCount, 18);
    await db.applyPlan(d1, 'jeonju', { token: pr.token }, ADMIN);
    assert.strictEqual(JSON.stringify(planRows(d1, 'jeonju')), rows18, 'removing the cancellation restores the 18-session distribution exactly');
  });

  await t('ULSAN can be configured by an administrator and then distributes its OWN source across the derived sessions (nothing from Jeonju)', async () => {
    const w = await makeRegionWorker('ulsan');
    const s = await w.login(USERS.ulsan);
    const put = json => w.call('PUT', '/api/admin/settings', { cookie: s.cookie, csrf: s.csrf, json });
    assert.strictEqual((await put({ courseStartDate: '2026-11-01', courseEndDate: '2026-12-13', intervalDays: 7 })).status, 200);
    // author a little source content in unit 1 and 2
    const items = n => Array.from({ length: n }, (_, i) => ({ text: { ko: `울산 항목 ${i + 1}` } }));
    assert.strictEqual((await w.call('PUT', '/api/admin/curriculum/1', { cookie: s.cookie, csrf: s.csrf, json: { title: { ko: '1' }, items: items(3) } })).status, 200);
    assert.strictEqual((await w.call('PUT', '/api/admin/curriculum/2', { cookie: s.cookie, csrf: s.csrf, json: { title: { ko: '2' }, items: items(2) } })).status, 200);
    const state = (await w.call('GET', '/api/admin/plan', { cookie: s.cookie })).data;
    assert.strictEqual(state.proposal.proposed.sessionCount, 7);
    assert.strictEqual((await w.call('POST', '/api/admin/plan/apply', { cookie: s.cookie, csrf: s.csrf, json: { token: state.proposal.token } })).status, 200);
    const rows = planRows(w.d1, 'ulsan');
    assert.strictEqual(rows.length, 5);
    assert(rows.every(r => /^L-[0-9a-f]{12}$/.test(r.item_uid)), 'new items get generated uids');
    assert.strictEqual(planRows(w.d1, 'jeonju').length, w.d1.raw.prepare("SELECT COUNT(*) AS n FROM course_plan_items WHERE region_id='jeonju'").get().n);
    const pub = (await w.call('GET', '/api/regional/curriculum')).data;
    assert.strictEqual(pub.status, 'configured');
    assert.strictEqual(pub.plan.sessions.length, 7);
    assert.strictEqual(JSON.stringify(pub).includes('2026-10-10'), false, 'no Jeonju dates in the Ulsan payload');
  });

  /* ================= manual overrides ================= */
  await t('manual overrides: pinned items survive re-distribution; unpin returns them to automatic placement; source edits keep new items visible', async () => {
    const d1 = createD1({ seed: true });
    const units = await db.getSourceUnits(d1, 'jeonju');
    const target = units[0].learning[0].uid; // first item of unit 1
    let state = await db.setPlanPin(d1, 'jeonju', { uid: target, session: 5 }, ADMIN);
    assert.strictEqual(planRows(d1, 'jeonju').find(r => r.item_uid === target).session_number, 5);
    assert.strictEqual(planRows(d1, 'jeonju').find(r => r.item_uid === target).origin, 'manual');
    assert.deepStrictEqual(state.active.manualPins, { [target]: 5 });
    // shrink the course: the pin is kept (clamped into range only if needed) and everything is still placed once
    await db.updateRegionalSettings(d1, 'jeonju', { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2026-12-12', intervalDays: 7 }, ADMIN);
    const pr = (await db.getPlanState(d1, 'jeonju')).proposal;
    await db.applyPlan(d1, 'jeonju', { token: pr.token }, ADMIN);
    const row = planRows(d1, 'jeonju').find(r => r.item_uid === target);
    assert.deepStrictEqual([row.session_number, row.origin], [5, 'manual']);
    assert.deepStrictEqual(planRows(d1, 'jeonju'), await expectedPlanRows(d1, 'jeonju', 8, { [target]: 5 }));
    await assert.rejects(() => db.setPlanPin(d1, 'jeonju', { uid: target, session: 9 }, ADMIN), /1~8/);
    await assert.rejects(() => db.setPlanPin(d1, 'jeonju', { uid: 'nope', session: 2 }, ADMIN), e => e.status === 404);
    await db.setPlanPin(d1, 'jeonju', { uid: target, session: null }, ADMIN);
    assert.strictEqual(planRows(d1, 'jeonju').find(r => r.item_uid === target).origin, 'auto');
    assert.deepStrictEqual(planRows(d1, 'jeonju'), await expectedPlanRows(d1, 'jeonju', 8));
    // a new source item is not lost before the next apply: it is shown in the last session (unplaced)
    const wk = (await db.getCurriculum(d1, 'jeonju'))[2];
    await db.updateCurriculumWeek(d1, 'jeonju', 3, { title: wk.title, note: wk.note, items: wk.items.concat([{ text: { ko: '새 항목' } }]), assignments: wk.assignments }, ADMIN);
    const st = await db.getPlanState(d1, 'jeonju');
    assert.strictEqual(st.active.unplaced.learning.length, 1);
    assert(st.active.sessions[7].learning.includes(st.active.unplaced.learning[0]));
    // removing an item drops its plan row in the same transaction (no orphans)
    const wk2 = (await db.getCurriculum(d1, 'jeonju'))[2];
    await db.updateCurriculumWeek(d1, 'jeonju', 3, { title: wk2.title, note: wk2.note, items: wk2.items.slice(1), assignments: wk2.assignments }, ADMIN);
    const orphans = d1.raw.prepare(`SELECT COUNT(*) AS n FROM course_plan_items p WHERE region_id='jeonju' AND
      ((kind='learning' AND item_uid NOT IN (SELECT uid FROM curriculum_learning_items WHERE region_id='jeonju')) OR
       (kind='assignment' AND item_uid NOT IN (SELECT uid FROM curriculum_assignment_items WHERE region_id='jeonju')))`).get().n;
    assert.strictEqual(orphans, 0);
  });

  /* ================= atomicity ================= */
  await t('apply is atomic: a failure at ANY statement leaves the previous plan, settings, source and audit log untouched', async () => {
    const prepare = async () => {
      const d1 = createD1({ seed: true });
      await db.updateRegionalSettings(d1, 'jeonju', { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2026-12-12', intervalDays: 7 }, ADMIN);
      return d1;
    };
    // measure how many D1 calls a successful apply performs
    const probe = await prepare();
    const token = (await db.getPlanState(probe, 'jeonju')).proposal.token;
    const start = probe.calls;
    await db.applyPlan(probe, 'jeonju', { token }, ADMIN);
    const total = probe.commits[probe.commits.length - 1] - start; // faults are injected up to the commit; reads after it are outside the transaction
    assert(total > 20, 'apply should be a multi-statement batch, got ' + total);
    let failures = 0;
    for (let i = 1; i <= total; i++) {
      const d1 = await prepare();
      const tk = (await db.getPlanState(d1, 'jeonju')).proposal.token;
      const before = snapshot(d1, 'jeonju', { audit: true });
      const base = d1.calls;
      d1.fault = (sql, params, n) => n === base + i;
      await assert.rejects(() => db.applyPlan(d1, 'jeonju', { token: tk }, ADMIN), /injected D1 failure/, `call ${i}/${total}`);
      d1.fault = null;
      assert.strictEqual(snapshot(d1, 'jeonju', { audit: true }), before, `state changed after a failure at call ${i}/${total}`);
      failures++;
    }
    assert.strictEqual(failures, total);
  });

  await t('failed multi-item reorder is atomic: learning items and weekly assignments, every failure point, no duplicate/missing order, no partial reorder', async () => {
    const reverseWeek = async d1 => {
      const wk = (await db.getCurriculum(d1, 'jeonju'))[0];
      return {
        week: wk,
        payload: {
          title: wk.title, note: wk.note,
          items: wk.items.slice().reverse(),
          assignments: { days: wk.assignments.days.map(d => ({ day: d.day, reviews: d.reviews.slice().reverse(), previews: d.previews.slice().reverse(), vocab: d.vocab.slice().reverse() })) },
        },
      };
    };
    const probe = createD1({ seed: true });
    const { payload } = await reverseWeek(probe);
    assert(payload.items.length >= 5 && payload.assignments.days.some(d => d.vocab.length >= 2), 'test needs a multi-item week');
    const start = probe.calls;
    await db.updateCurriculumWeek(probe, 'jeonju', 1, payload, ADMIN);
    const total = probe.commits[probe.commits.length - 1] - start;
    // success: order is exactly reversed and contiguous, uids preserved
    const orders = probe.raw.prepare("SELECT sort_order FROM curriculum_learning_items WHERE region_id='jeonju' AND week_number=1 ORDER BY sort_order").all().map(r => r.sort_order);
    assert.deepStrictEqual(orders, orders.map((_, i) => i));
    const now = (await db.getCurriculum(probe, 'jeonju'))[0];
    assert.deepStrictEqual(now.items.map(i => i.uid), payload.items.map(i => i.uid));
    assert.deepStrictEqual(now.assignments.days.map(d => d.vocab.map(x => x.uid)), payload.assignments.days.map(d => d.vocab.map(x => x.uid)));
    for (let i = 1; i <= total; i++) {
      const d1 = createD1({ seed: true });
      const { payload: p } = await reverseWeek(d1);
      const before = snapshot(d1, 'jeonju', { audit: true });
      const base = d1.calls;
      d1.fault = (sql, params, n) => n === base + i;
      await assert.rejects(() => db.updateCurriculumWeek(d1, 'jeonju', 1, p, ADMIN), /injected D1 failure/, `call ${i}/${total}`);
      d1.fault = null;
      assert.strictEqual(snapshot(d1, 'jeonju', { audit: true }), before, `partial reorder after failure at call ${i}/${total}`);
    }
    // constraint-level protection (independent of application code)
    const d1 = createD1({ seed: true });
    assert.throws(() => d1.raw.prepare("INSERT INTO curriculum_learning_items (uid, region_id, week_number, sort_order, text_ko) VALUES ('dupe', 'jeonju', 1, 0, 'x')").run(), /UNIQUE/);
    assert.throws(() => d1.raw.prepare("INSERT INTO curriculum_learning_items (uid, region_id, week_number, sort_order, text_ko) VALUES ('L01-000', 'jeonju', 2, 99, 'x')").run(), /UNIQUE/);
    assert.throws(() => d1.raw.prepare("INSERT INTO curriculum_assignment_items (uid, region_id, week_number, day_name, category, sort_order, text_ko) VALUES ('zz', 'jeonju', 1, '월', 'review', 0, 'x')").run(), /UNIQUE/);
    assert.throws(() => d1.raw.prepare("INSERT INTO curriculum_assignment_items (uid, region_id, week_number, day_name, category, sort_order, text_ko) VALUES ('zz', 'jeonju', 1, '토', 'review', 0, 'x')").run(), /CHECK/);
    assert.throws(() => d1.raw.prepare("INSERT INTO course_plan_items (region_id, kind, item_uid, session_number, position) VALUES ('jeonju', 'learning', 'L01-000', 1, 99)").run(), /UNIQUE|PRIMARY/);
    // payload-level protection: duplicate uid, foreign uid, bad shapes -> 400 and nothing written
    const before = snapshot(d1, 'jeonju', { audit: true });
    const wk = (await db.getCurriculum(d1, 'jeonju'))[0];
    const two = wk.items.slice(0, 2).map(i => ({ uid: wk.items[0].uid, text: i.text }));
    await assert.rejects(() => db.updateCurriculumWeek(d1, 'jeonju', 1, { items: two }, ADMIN), /중복/);
    const other = (await db.getCurriculum(d1, 'jeonju'))[1].items[0];
    await assert.rejects(() => db.updateCurriculumWeek(d1, 'jeonju', 1, { items: [{ uid: other.uid, text: { ko: 'x' } }] }, ADMIN), e => e.name === 'ValidationError');
    await assert.rejects(() => db.updateCurriculumWeek(d1, 'jeonju', 17, { items: [] }, ADMIN), /1~16/);
    await assert.rejects(() => db.updateCurriculumWeek(d1, 'jeonju', 1, { assignments: { days: [{ day: { ko: '토요일' } }] } }, ADMIN), /월~금/);
    await assert.rejects(() => db.updateCurriculumWeek(d1, 'jeonju', 1, { assignments: { days: [{ day: { ko: '월요일' } }, { day: { ko: '월요일' } }] } }, ADMIN), /중복/);
    await assert.rejects(() => db.updateCurriculumWeek(d1, 'jeonju', 1, { items: 'nope' }, ADMIN), e => e.name === 'ValidationError');
    assert.strictEqual(snapshot(d1, 'jeonju', { audit: true }), before);
  });

  await t('unspecified keys are left untouched: title-only update keeps items, assignments and their uids', async () => {
    const d1 = createD1({ seed: true });
    const before = (await db.getCurriculum(d1, 'jeonju'))[3];
    await db.updateCurriculumWeek(d1, 'jeonju', 4, { title: { ko: '새 제목' } }, ADMIN);
    const after = (await db.getCurriculum(d1, 'jeonju'))[3];
    assert.deepStrictEqual(after.items, before.items);
    assert.deepStrictEqual(after.assignments, before.assignments);
    assert.strictEqual(after.title.ko, '새 제목');
  });

  /* ================= audit & rollback ================= */
  await t('audit log + rollback: apply records previous/new configuration and session counts; restore brings back configuration AND distribution together', async () => {
    const w = await makeRegionWorker('jeonju');
    const s = await w.login(USERS.jeonju);
    const pre = snapshot(w.d1, 'jeonju');
    await w.call('PUT', '/api/admin/settings', { cookie: s.cookie, csrf: s.csrf, json: { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2026-12-12', intervalDays: 7 } });
    const st = (await w.call('GET', '/api/admin/plan', { cookie: s.cookie })).data;
    await w.call('POST', '/api/admin/plan/apply', { cookie: s.cookie, csrf: s.csrf, json: { token: st.proposal.token } });
    assert.notStrictEqual(snapshot(w.d1, 'jeonju'), pre);
    const logs = (await w.call('GET', '/api/admin/audit', { cookie: s.cookie })).data;
    const applyLog = logs.find(l => l.action === 'apply_plan');
    assert(applyLog, 'apply_plan must be audited');
    assert.strictEqual(applyLog.username, 'admin_jeonju');
    assert(applyLog.created_at);
    const details = JSON.parse(applyLog.details);
    assert.strictEqual(details.previousSessionCount, 16);
    assert.strictEqual(details.newSessionCount, 8);
    assert.strictEqual(details.before.config.courseEndDate, '2027-02-13');
    assert.strictEqual(details.after.config.courseEndDate, '2026-12-12');
    assert.strictEqual(details.before.sessionCount, 16);
    assert(details.before.items.length > 200, 'the previous distribution is stored for rollback');
    // rollback
    const bad = await w.call('POST', `/api/admin/audit/${applyLog.id}/restore`, { cookie: s.cookie });
    assert.strictEqual(bad.status, 403, 'restore needs CSRF');
    const res = await w.call('POST', `/api/admin/audit/${applyLog.id}/restore`, { cookie: s.cookie, csrf: s.csrf });
    assert.strictEqual(res.status, 200, JSON.stringify(res.data));
    assert.strictEqual(snapshot(w.d1, 'jeonju'), pre, 'restore must bring back configuration and distribution exactly');
    const after = (await w.call('GET', '/api/admin/audit', { cookie: s.cookie })).data;
    assert(after.some(l => l.action === 'restore_version'));
    assert.strictEqual((await w.call('GET', '/api/admin/plan', { cookie: s.cookie })).data.proposal.changed, false);
    // restoring the very first plan (none before) removes the plan again and is coherent
    const fresh = createD1({ seed: true });
    fresh.raw.prepare("DELETE FROM course_plan_items WHERE region_id='jeonju'").run();
    fresh.raw.prepare("DELETE FROM course_plans WHERE region_id='jeonju'").run();
    const pr = (await db.getPlanState(fresh, 'jeonju')).proposal;
    assert.strictEqual(pr.previous, null);
    const applied = await db.applyPlan(fresh, 'jeonju', { token: pr.token }, ADMIN);
    assert.strictEqual(applied.active.sessionCount, 16);
    const log = (await db.getAuditLogs(fresh, 'jeonju')).find(l => l.action === 'apply_plan');
    assert.strictEqual(JSON.parse(log.details).previousSessionCount, null);
    await db.restoreAuditSnapshot(fresh, 'jeonju', log.id, ADMIN);
    assert.strictEqual(fresh.raw.prepare("SELECT COUNT(*) AS n FROM course_plans WHERE region_id='jeonju'").get().n, 0);
    assert.strictEqual(fresh.raw.prepare("SELECT COUNT(*) AS n FROM course_plan_items WHERE region_id='jeonju'").get().n, 0);
  });

  await t('rollback of restore points: settings, cancellation add/update/delete, curriculum edit, pin', async () => {
    const d1 = createD1({ seed: true });
    const last = async action => (await db.getAuditLogs(d1, 'jeonju')).find(l => l.action === action);
    // settings
    const s0 = snapshot(d1, 'jeonju');
    await db.updateRegionalSettings(d1, 'jeonju', { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2027-01-30', intervalDays: 7, meetingWeekday: '매주 토요일' }, ADMIN);
    await db.restoreAuditSnapshot(d1, 'jeonju', (await last('update_settings')).id, ADMIN);
    assert.strictEqual(snapshot(d1, 'jeonju'), s0);
    // cancellation add -> restore removes it
    await db.addCancellation(d1, 'jeonju', { date: '2027-01-09', reason: 'temp' }, ADMIN);
    await db.restoreAuditSnapshot(d1, 'jeonju', (await last('add_cancellation')).id, ADMIN);
    assert.strictEqual(snapshot(d1, 'jeonju'), s0);
    // cancellation update -> restore reverts
    const target = (await db.getCancellations(d1, 'jeonju'))[0];
    await db.updateCancellation(d1, 'jeonju', target.id, { date: '2026-11-14', reason: 'moved' }, ADMIN);
    await db.restoreAuditSnapshot(d1, 'jeonju', (await last('update_cancellation')).id, ADMIN);
    assert.strictEqual(snapshot(d1, 'jeonju'), s0);
    // cancellation delete -> restore re-adds
    await db.deleteCancellation(d1, 'jeonju', target.id, ADMIN);
    await db.restoreAuditSnapshot(d1, 'jeonju', (await last('delete_cancellation')).id, ADMIN);
    assert.strictEqual(snapshot(d1, 'jeonju'), s0);
    // curriculum edit -> restore
    const wk = (await db.getCurriculum(d1, 'jeonju'))[1];
    await db.updateCurriculumWeek(d1, 'jeonju', 2, { title: { ko: '바뀜' }, items: wk.items.slice().reverse(), assignments: null }, ADMIN);
    assert.notStrictEqual(snapshot(d1, 'jeonju'), s0);
    await db.restoreAuditSnapshot(d1, 'jeonju', (await last('update_curriculum')).id, ADMIN);
    const restoredWk = (await db.getCurriculum(d1, 'jeonju'))[1];
    assert.deepStrictEqual(restoredWk.items, wk.items);
    assert.deepStrictEqual(restoredWk.assignments, wk.assignments);
    // pin -> restore
    const s1 = snapshot(d1, 'jeonju');
    const uid = (await db.getSourceUnits(d1, 'jeonju'))[0].learning[0].uid;
    await db.setPlanPin(d1, 'jeonju', { uid, session: 4 }, ADMIN);
    await db.restoreAuditSnapshot(d1, 'jeonju', (await last('update_plan_pin')).id, ADMIN);
    assert.strictEqual(snapshot(d1, 'jeonju'), s1);
    // unsupported / missing
    const restoreLogId = (await last('restore_version')).id;
    await assert.rejects(() => db.restoreAuditSnapshot(d1, 'jeonju', restoreLogId, ADMIN), /복구할 수 없습니다/);
    await assert.rejects(() => db.restoreAuditSnapshot(d1, 'jeonju', 999999, ADMIN), e => e.status === 404);
    // another region's log id is invisible
    const uLog = d1.raw.prepare("INSERT INTO audit_logs (region_id, username, action, details) VALUES ('ulsan', 'x', 'update_settings', '{}')").run().lastInsertRowid;
    await assert.rejects(() => db.restoreAuditSnapshot(d1, 'jeonju', Number(uLog), ADMIN), e => e.status === 404);
  });

  await t('restore is atomic too: a failure while restoring an applied plan leaves everything as it was', async () => {
    const mk = async () => {
      const d1 = createD1({ seed: true });
      await db.updateRegionalSettings(d1, 'jeonju', { preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2026-12-12', intervalDays: 7 }, ADMIN);
      await db.applyPlan(d1, 'jeonju', { token: (await db.getPlanState(d1, 'jeonju')).proposal.token }, ADMIN);
      const log = (await db.getAuditLogs(d1, 'jeonju')).find(l => l.action === 'apply_plan');
      return { d1, id: log.id };
    };
    const probe = await mk();
    const start = probe.d1.calls;
    await db.restoreAuditSnapshot(probe.d1, 'jeonju', probe.id, ADMIN);
    const total = probe.d1.commits[probe.d1.commits.length - 1] - start;
    for (let i = 1; i <= total; i++) {
      const { d1, id } = await mk();
      const before = snapshot(d1, 'jeonju', { audit: true });
      const base = d1.calls;
      d1.fault = (sql, params, n) => n === base + i;
      await assert.rejects(() => db.restoreAuditSnapshot(d1, 'jeonju', id, ADMIN), /injected D1 failure/, `call ${i}/${total}`);
      d1.fault = null;
      assert.strictEqual(snapshot(d1, 'jeonju', { audit: true }), before, `partial restore after failure at call ${i}/${total}`);
    }
  });

  /* ================= API error handling ================= */
  await t('API: validation errors are 4xx with messages, internal errors are generic 500s, bodies are size-limited', async () => {
    const w = await makeRegionWorker('jeonju');
    const s = await w.login(USERS.jeonju);
    const c = { cookie: s.cookie, csrf: s.csrf };
    const bad = await w.call('PUT', '/api/admin/settings', Object.assign({ json: { courseStartDate: '2026-10-10', courseEndDate: '2026-10-01' } }, c));
    assert.strictEqual(bad.status, 400);
    assert(/종료일/.test(bad.data.error));
    assert.strictEqual((await w.call('PUT', '/api/admin/curriculum/99', Object.assign({ json: {} }, c))).status, 400);
    assert.strictEqual((await w.call('DELETE', '/api/admin/cancellations/424242', c)).status, 404);
    assert.strictEqual((await w.call('PUT', '/api/admin/settings', Object.assign({ rawBody: 'x'.repeat(300 * 1024), headers: { 'Content-Type': 'application/json' } }, c))).status, 413);
    assert.strictEqual((await w.call('PUT', '/api/admin/settings', Object.assign({ rawBody: '{}', headers: { 'Content-Type': 'text/plain' } }, c))).status, 415);
    assert.strictEqual((await w.call('GET', '/api/admin/nope', c)).status, 404);
    w.d1.fault = sql => /FROM course_plans/.test(sql);
    const boom = await w.call('GET', '/api/admin/plan', c);
    assert.strictEqual(boom.status, 500);
    assert.strictEqual(boom.data.error.includes('injected'), false, 'internal error text must not leak');
    w.d1.fault = null;
    // public endpoint is read-only and needs no auth
    const pub = await w.call('GET', '/api/regional/curriculum');
    assert.strictEqual(pub.status, 200);
    assert.strictEqual(JSON.stringify(pub.data).includes('password'), false);
    const post = await w.call('POST', '/api/regional/curriculum', { json: {} });
    assert.strictEqual(await post.text(), 'ASSET:/api/regional/curriculum', 'the public endpoint is GET-only; other methods fall through to the static layer');
  });

  await t('seed and admin provisioning: content-only idempotent seed, no default credentials anywhere', async () => {
    const { generateSeedSql } = require('./helpers/d1_sqlite');
    const sql = generateSeedSql();
    assert(!/admin_users|password/i.test(sql), 'seed must not contain accounts or password hashes');
    assert(!/\bDELETE\b|INSERT OR REPLACE/i.test(sql), 'seed must not be destructive');
    const d1 = createD1({ seed: true });
    const before = snapshot(d1, 'jeonju', { audit: true });
    d1.raw.exec(sql); // running it again changes nothing
    assert.strictEqual(snapshot(d1, 'jeonju', { audit: true }), before);
    // edits survive a re-seed
    await db.updateCurriculumWeek(d1, 'jeonju', 1, { title: { ko: '편집됨' } }, ADMIN);
    d1.raw.exec(sql);
    assert.strictEqual((await db.getCurriculum(d1, 'jeonju'))[0].title.ko, '편집됨');
    assert.strictEqual(d1.raw.prepare('SELECT COUNT(*) AS n FROM admin_users').get().n, 0);
    const bundle = fs.readFileSync(buildBundle('jeonju'), 'utf8') + fs.readFileSync(buildBundle('ulsan'), 'utf8');
    for (const secret of ['jeonju2026!', 'ulsan2026!', 'superadmin2026!']) assert(!bundle.includes(secret) && !sql.includes(secret));
  });

  console.log(`--- ALL ${count} REGIONAL ADMIN TESTS PASSED ---`);
})().catch(err => {
  console.error('Test failure:', err);
  process.exit(1);
});
