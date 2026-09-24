// -*- coding: utf-8 -*-
/**
 * Minimal Cloudflare D1 stand-in backed by node:sqlite (real SQLite: real UNIQUE/CHECK/FOREIGN KEY
 * enforcement and real transactions), so tests exercise regional_admin/db.js against the real schema.sql.
 *
 * Supported D1 surface: prepare(sql).bind(...).first() / .all() / .run(), and batch([stmts]) which runs all
 * statements in ONE transaction (rolled back completely if any statement throws) - the D1 guarantee.
 *
 * Fault injection for atomicity tests: set `d1.fault = (sql, params, callIndex) => boolean`; when it
 * returns true the statement throws instead of executing.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { DatabaseSync } = require('node:sqlite');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function normalizeParams(params) {
  return params.map(p => (p === undefined ? null : p));
}

function createD1({ schema = true, seed = false } = {}) {
  const raw = new DatabaseSync(':memory:');
  raw.exec('PRAGMA foreign_keys = ON');
  if (schema) raw.exec(fs.readFileSync(path.join(REPO_ROOT, 'regional_admin', 'schema.sql'), 'utf8'));
  if (seed) raw.exec(generateSeedSql());

  const d1 = { raw, fault: null, calls: 0, commits: [] }; // commits: call counter value at each successful batch commit

  function isRead(sql) {
    return /^\s*(SELECT|WITH|PRAGMA)/i.test(sql);
  }

  function execute(sql, params, mode) {
    d1.calls += 1;
    if (d1.fault && d1.fault(sql, params, d1.calls)) throw new Error('injected D1 failure');
    const stmt = raw.prepare(sql);
    const p = normalizeParams(params);
    if (mode === 'first') {
      const row = stmt.get(...p);
      return row ? { ...row } : null;
    }
    if (mode === 'all' || (mode === 'batch' && isRead(sql))) {
      return { results: stmt.all(...p).map(r => ({ ...r })), success: true, meta: {} };
    }
    const info = stmt.run(...p);
    return { results: [], success: true, meta: { changes: Number(info.changes), last_row_id: Number(info.lastInsertRowid) } };
  }

  function makeStatement(sql, params) {
    return {
      _sql: sql,
      _params: params,
      bind: (...args) => makeStatement(sql, args),
      first: async () => execute(sql, params, 'first'),
      all: async () => execute(sql, params, 'all'),
      run: async () => execute(sql, params, 'run'),
    };
  }

  d1.prepare = sql => makeStatement(sql, []);
  d1.batch = async statements => {
    raw.exec('BEGIN');
    try {
      const out = statements.map(s => execute(s._sql, s._params, 'batch'));
      raw.exec('COMMIT');
      d1.commits.push(d1.calls);
      return out;
    } catch (err) {
      raw.exec('ROLLBACK');
      throw err;
    }
  };
  return d1;
}

/** The exact SQL scripts/seed_jeonju_d1.py would emit (content only, no credentials). */
function generateSeedSql() {
  const res = spawnSync(
    'python',
    ['-c', 'import sys; sys.path.insert(0, "."); from scripts.seed_jeonju_d1 import generate_seed_sql; sys.stdout.buffer.write(generate_seed_sql().encode("utf-8"))'],
    { cwd: REPO_ROOT, encoding: 'buffer', maxBuffer: 64 * 1024 * 1024 }
  );
  if (res.status !== 0) throw new Error('seed generation failed: ' + res.stderr.toString('utf8'));
  return res.stdout.toString('utf8');
}

module.exports = { createD1, generateSeedSql, REPO_ROOT };
