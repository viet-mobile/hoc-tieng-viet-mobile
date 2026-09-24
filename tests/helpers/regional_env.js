// -*- coding: utf-8 -*-
/**
 * Test harness for the regional worker: builds the REAL _worker.js bundle (regional_admin/bundle_worker.py), imports it
 * as an ES module exactly like Cloudflare would, and drives it with real Request objects against a SQLite-backed D1.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');
const { createD1, REPO_ROOT } = require('./d1_sqlite');
const auth = require('../../regional_admin/auth');

const bundleCache = {};

function buildBundle(region) {
  if (!bundleCache[region]) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'regional-worker-'));
    const file = path.join(dir, `_worker_${region}.mjs`);
    const res = spawnSync('python', [path.join('regional_admin', 'bundle_worker.py'), '--region', region, '--out', file], { cwd: REPO_ROOT, encoding: 'utf8' });
    if (res.status !== 0) throw new Error('bundle build failed: ' + res.stderr);
    bundleCache[region] = file;
  }
  return bundleCache[region];
}

async function importBundle(file) {
  const mod = await import(pathToFileURL(file).href + '?t=' + Date.now() + Math.random());
  return mod.default;
}

function makeAssets() {
  const assets = { seen: [], fetch: async req => {
    const u = new URL(req.url);
    assets.seen.push(u.pathname);
    if (u.pathname === '/nope.css') return new Response('Not Found', { status: 404 });
    return new Response('ASSET:' + u.pathname, { status: 200 });
  } };
  return assets;
}

const USERS = {
  jeonju: { username: 'admin_jeonju', password: 'Jeonju-Test-Pass-1!', region: 'jeonju', email: 'Admin.Jeonju@example.org' },
  ulsan: { username: 'admin_ulsan', password: 'Ulsan-Test-Pass-1!', region: 'ulsan', email: 'admin.ulsan@example.org' },
  super: { username: 'superadmin', password: 'Super-Test-Pass-1!', region: '*', email: 'super@example.org' },
};

async function seedUsers(d1) {
  for (const u of Object.values(USERS)) {
    const hash = await auth.hashPassword(u.password);
    d1.raw.prepare('INSERT INTO admin_users (username, password_hash, email, allowed_region, is_active) VALUES (?, ?, ?, ?, 1)')
      .run(u.username, hash, u.email, u.region);
  }
}

/** A worker for `region` on `d1` (seeded SQLite by default) with helpers to call it. */
async function makeRegionWorker(region, { d1, extraEnv = {}, users = true } = {}) {
  d1 = d1 || createD1({ seed: true });
  if (users) await seedUsers(d1);
  const worker = await importBundle(buildBundle(region));
  const assets = makeAssets();
  const env = Object.assign({ DB: d1, ASSETS: assets }, extraEnv);
  const origin = `https://${region}.hoc.tieng.viet.mobile`;

  async function call(method, pathname, opts = {}) {
    const headers = Object.assign({}, opts.headers || {});
    if (opts.origin !== null) headers['Origin'] = opts.origin || origin;
    if (opts.cookie) headers['Cookie'] = opts.cookie;
    if (opts.csrf) headers['X-CSRF-Token'] = opts.csrf;
    if (opts.ip) headers['cf-connecting-ip'] = opts.ip;
    let body;
    if (opts.json !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(opts.json);
    } else if (opts.rawBody !== undefined) {
      body = opts.rawBody;
    }
    const req = new Request(origin + pathname, { method, headers, body });
    const res = await worker.fetch(req, env, {});
    let data = null;
    const ct = res.headers.get('Content-Type') || '';
    if (ct.includes('json')) data = await res.clone().json();
    return { res, status: res.status, data, text: () => res.clone().text() };
  }

  async function login(user, opts = {}) {
    const r = await call('POST', '/api/auth/login', Object.assign({ json: { username: user.username, password: user.password } }, opts));
    if (r.status !== 200) throw new Error(`login failed (${r.status}): ${JSON.stringify(r.data)}`);
    const cookie = r.res.headers.get('Set-Cookie').split(';')[0];
    return { cookie, csrf: r.data.csrfToken, response: r };
  }

  return { worker, env, d1, assets, call, login, origin, region };
}

function canon(value) {
  if (Array.isArray(value)) return value.map(canon);
  if (value && typeof value === 'object') return Object.keys(value).sort().reduce((o, k) => { o[k] = canon(value[k]); return o; }, {});
  return value;
}

/**
 * Snapshot of everything a regional mutation may touch, minus volatile columns (timestamps, applied_by), for
 * "nothing changed" / "restored exactly" assertions. Pass {audit: true} to include the audit-log row count.
 */
function snapshot(d1, region, { audit = false } = {}) {
  const q = (sql, ...p) => d1.raw.prepare(sql).all(...p).map(r => ({ ...r }));
  const plan = q('SELECT config_json, session_count FROM course_plans WHERE region_id = ?', region)
    .map(r => ({ config: canon(JSON.parse(r.config_json)), session_count: r.session_count }));
  const out = {
    settings: q('SELECT preliminary_meeting_date, course_start_date, course_end_date, interval_days, meeting_weekday, welcome_title, welcome_body FROM regional_settings WHERE region_id = ?', region),
    cancellations: q('SELECT date, reason FROM class_cancellations WHERE region_id = ? ORDER BY date', region),
    weeks: q('SELECT week_number, title_ko, title_en, note_ko, note_en FROM curriculum_weeks WHERE region_id = ? ORDER BY week_number', region),
    learning: q('SELECT uid, week_number, sort_order, text_ko, text_en, page, link_json FROM curriculum_learning_items WHERE region_id = ? ORDER BY week_number, sort_order', region),
    assignments: q('SELECT uid, week_number, day_name, category, sort_order, text_ko, text_en, link_json FROM curriculum_assignment_items WHERE region_id = ? ORDER BY week_number, day_name, category, sort_order', region),
    plan,
    planItems: q('SELECT kind, item_uid, session_number, position, origin FROM course_plan_items WHERE region_id = ? ORDER BY kind, session_number, position, item_uid', region),
  };
  if (audit) out.audit = q('SELECT COUNT(*) AS n FROM audit_logs WHERE region_id = ?', region);
  return JSON.stringify(out);
}

module.exports = { buildBundle, importBundle, makeRegionWorker, seedUsers, snapshot, USERS, makeAssets, REPO_ROOT };
