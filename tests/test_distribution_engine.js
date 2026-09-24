// -*- coding: utf-8 -*-
/**
 * Curriculum distribution engine tests (regional_admin/distribution_engine.js).
 * Invariants asserted for every session count: nothing lost, nothing duplicated, source order stable, atoms never split.
 */
const assert = require('assert');
const { distributeCurriculum, verifyDistribution, orderAssignments } = require('../regional_admin/distribution_engine');
const { createD1 } = require('./helpers/d1_sqlite');
const db = require('../regional_admin/db');

let n = 0;
const t = (name, fn) => Promise.resolve().then(fn).then(() => { n++; console.log('✓ ' + name); });

function makeUnits(M, learningCount, assignmentCount) {
  return Array.from({ length: M }, (_, k) => ({
    unit: k + 1,
    learning: Array.from({ length: learningCount(k) }, (_, i) => ({ uid: `L${k + 1}-${i}`, unit: k + 1 })),
    assignments: Array.from({ length: assignmentCount(k) }, (_, i) => ({ uid: `A${k + 1}-${i}`, unit: k + 1 })),
  }));
}
const uids = list => list.map(x => x.uid);
function flatten(dist, stream) { return dist.sessions.reduce((acc, s) => acc.concat(s[stream]), []); }
function sourceSeq(units, stream) { return units.reduce((acc, u) => acc.concat(u[stream]), []); }

/** The core invariants, restated independently of verifyDistribution. */
function assertInvariants(units, dist, N, label = '') {
  assert.strictEqual(dist.sessions.length, N, `${label} session count`);
  for (const stream of ['learning', 'assignments']) {
    assert.deepStrictEqual(uids(flatten(dist, stream)), uids(sourceSeq(units, stream)), `${label} ${stream}: flatten(sessions) must equal the source sequence`);
    const seen = new Set(uids(flatten(dist, stream)));
    assert.strictEqual(seen.size, sourceSeq(units, stream).length, `${label} ${stream}: duplicate or missing ids`);
  }
  assert.deepStrictEqual(verifyDistribution(units, dist, {}), [], `${label} verifyDistribution`);
  dist.sessions.forEach((s, i) => assert.strictEqual(s.session, i + 1));
}

const SESSION_COUNTS = [1, 5, 8, 12, 16, 20, 30];

(async () => {
  const synthetic = makeUnits(16, k => 3 + (k * 7) % 9, k => 6 + (k * 5) % 11);

  await t('invariants hold for 1, 5, 8, 12, 16, 20 and 30 sessions (and 200)', () => {
    for (const N of [...SESSION_COUNTS, 200]) assertInvariants(synthetic, distributeCurriculum({ units: synthetic, sessionCount: N }), N, `N=${N}`);
  });

  await t('N == number of source units is the identity mapping (JEONJU parity)', () => {
    const d = distributeCurriculum({ units: synthetic, sessionCount: 16 });
    assert.strictEqual(d.identity, true);
    d.sessions.forEach((s, i) => {
      assert.deepStrictEqual(s.units, [i + 1]);
      assert.deepStrictEqual(uids(s.learning), uids(synthetic[i].learning));
      assert.deepStrictEqual(uids(s.assignments), uids(synthetic[i].assignments));
    });
  });

  await t('shorter course: 16 source units over 8 sessions = 2 whole units per session, in order', () => {
    const d = distributeCurriculum({ units: synthetic, sessionCount: 8 });
    d.sessions.forEach((s, i) => assert.deepStrictEqual(s.units, [2 * i + 1, 2 * i + 2]));
    assert.strictEqual(d.identity, false);
    // 12 sessions: every session has 1 or 2 units, consecutive, covering 1..16 exactly once
    const d12 = distributeCurriculum({ units: synthetic, sessionCount: 12 });
    const cover = d12.sessions.reduce((a, s) => a.concat(s.units), []);
    assert.deepStrictEqual(cover, Array.from({ length: 16 }, (_, i) => i + 1));
    d12.sessions.forEach(s => assert(s.units.length === 1 || s.units.length === 2));
    // 1 session gets everything
    const d1 = distributeCurriculum({ units: synthetic, sessionCount: 1 });
    assert.strictEqual(d1.sessions[0].units.length, 16);
  });

  await t('longer course: sessions never mix two units, every unit keeps >= 1 session, load stays balanced', () => {
    for (const N of [17, 20, 24, 30, 40]) {
      const d = distributeCurriculum({ units: synthetic, sessionCount: N });
      d.sessions.forEach(s => assert.strictEqual(s.units.length, 1, `N=${N}`));
      const per = {};
      d.sessions.forEach(s => { per[s.units[0]] = (per[s.units[0]] || 0) + 1; });
      for (let u = 1; u <= 16; u++) assert(per[u] >= 1, `unit ${u} lost its session at N=${N}`);
      // atoms of a unit are spread as evenly as possible over its sessions
      for (let u = 1; u <= 16; u++) {
        const sizes = d.sessions.filter(s => s.units[0] === u).map(s => s.learning.length);
        assert(Math.max(...sizes) - Math.min(...sizes) <= 1, `learning of unit ${u} unbalanced at N=${N}: ${sizes}`);
      }
      assertInvariants(synthetic, d, N, `N=${N}`);
    }
  });

  await t('no session hoards the load: max session size stays within 2x the ideal for N<=16 and N=20/30', () => {
    const total = sourceSeq(synthetic, 'learning').length;
    for (const N of [5, 8, 12, 20, 30]) {
      const d = distributeCurriculum({ units: synthetic, sessionCount: N });
      const biggest = Math.max(...d.sessions.map(s => s.learning.length));
      assert(biggest <= Math.max(2 * Math.ceil(total / N), 12), `N=${N}: session with ${biggest} of ${total}`);
    }
  });

  await t('course-length transitions 16 -> 8 -> 16 -> 20 -> 12 -> 1: nothing lost, nothing duplicated, order stable, deterministic', () => {
    let previous = null;
    for (const N of [16, 8, 16, 20, 12, 1]) {
      const d = distributeCurriculum({ units: synthetic, sessionCount: N });
      assertInvariants(synthetic, d, N, `to ${N}`);
      // recomputing from the same source is byte-identical (the source is never mutated by distribution)
      assert.strictEqual(JSON.stringify(distributeCurriculum({ units: synthetic, sessionCount: N })), JSON.stringify(d));
      if (previous === 16 && N === 16) assert.strictEqual(d.identity, true);
      previous = N;
    }
    assert.strictEqual(synthetic[0].learning.length, 3); // input untouched
  });

  await t('more sessions than atomic items: no content invented or split, some sessions are simply lighter', () => {
    const tiny = makeUnits(4, () => 1, k => (k === 0 ? 2 : 0));
    for (const N of [5, 8, 30, 200]) {
      const d = distributeCurriculum({ units: tiny, sessionCount: N });
      assertInvariants(tiny, d, N, `tiny N=${N}`);
      assert(d.sessions.every(s => s.learning.length <= 1 && s.assignments.length <= 1), 'atoms must not be grouped when sessions are plentiful');
    }
    const d = distributeCurriculum({ units: tiny, sessionCount: 200 });
    assert(d.sessions.some(s => s.learning.length === 0 && s.assignments.length === 0), 'some sessions must be empty');
  });

  await t('empty source (ULSAN before authoring) and zero sessions never divide by zero or lose data', () => {
    const empty = makeUnits(16, () => 0, () => 0);
    for (const N of [1, 7, 16, 25]) assertInvariants(empty, distributeCurriculum({ units: empty, sessionCount: N }), N, 'empty');
    for (const N of [0, -3, NaN, undefined, null]) {
      const d = distributeCurriculum({ units: synthetic, sessionCount: N });
      assert.strictEqual(d.status, 'no-sessions');
      assert.deepStrictEqual(d.sessions, []);
    }
    assert.deepStrictEqual(distributeCurriculum({ units: [], sessionCount: 3 }).sessions.map(s => s.learning.length), [0, 0, 0]);
  });

  await t('duplicate or missing uids are refused (exactly-once would be meaningless)', () => {
    const dup = makeUnits(2, () => 2, () => 0);
    dup[1].learning[0].uid = dup[0].learning[0].uid;
    assert.throws(() => distributeCurriculum({ units: dup, sessionCount: 2 }), /duplicate item uid/);
    assert.throws(() => distributeCurriculum({ units: [{ unit: 1, learning: [{}], assignments: [] }], sessionCount: 1 }), /needs a uid/);
  });

  await t('administrator pins: pinned atoms land where asked, the rest keeps source order, all atoms placed once', () => {
    const units = makeUnits(6, () => 4, () => 3);
    const pins = { 'L1-0': 6, 'A6-2': 1, 'L3-3': 99, 'ghost': 2 };
    const d = distributeCurriculum({ units, sessionCount: 6, pins });
    assert(uids(d.sessions[5].learning).includes('L1-0'));
    assert(uids(d.sessions[0].assignments).includes('A6-2'));
    assert(uids(d.sessions[5].learning).includes('L3-3'), 'out-of-range pin is clamped to the last session');
    assert.deepStrictEqual(d.clampedPins.map(x => x.uid), ['L3-3']);
    assert.deepStrictEqual(d.ignoredPins, ['ghost']);
    assert.deepStrictEqual(verifyDistribution(units, d, pins), []);
    assert.strictEqual(d.identity, false);
    // non-pinned learning atoms appear in source order
    const rest = uids(flatten(d, 'learning')).filter(u => !pins[u]);
    assert.deepStrictEqual(rest, uids(sourceSeq(units, 'learning')).filter(u => !pins[u]));
  });

  await t('randomised sources (seeded): invariants hold for every session count 1..40', () => {
    let seed = 20261010;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
    for (let round = 0; round < 60; round++) {
      const M = 1 + Math.floor(rnd() * 20);
      const units = makeUnits(M, () => Math.floor(rnd() * 9), () => Math.floor(rnd() * 14));
      const N = 1 + Math.floor(rnd() * 40);
      assertInvariants(units, distributeCurriculum({ units, sessionCount: N }), N, `round ${round} M=${M} N=${N}`);
    }
  });

  await t('assignment order is canonical: day 월..금, then review/preview/vocab, then stored order', () => {
    const shuffled = [
      { uid: 'x1', day: '화', category: 'vocab', sort_order: 0 }, { uid: 'x2', day: '월', category: 'vocab', sort_order: 1 },
      { uid: 'x3', day: '월', category: 'review', sort_order: 0 }, { uid: 'x4', day: '월', category: 'vocab', sort_order: 0 },
      { uid: 'x5', day: '화', category: 'review', sort_order: 0 }, { uid: 'x6', day: '월', category: 'preview', sort_order: 0 },
    ];
    assert.deepStrictEqual(uids(orderAssignments(shuffled)), ['x3', 'x6', 'x4', 'x2', 'x5', 'x1']);
  });

  await t('REAL JEONJU SOURCE (seeded D1): invariants for 1/5/8/12/16/20/30 sessions; 16 = identity to the authored units', async () => {
    const d1 = createD1({ seed: true });
    const units = await db.getSourceUnits(d1, 'jeonju');
    assert.strictEqual(units.length, 16);
    const learningTotal = sourceSeq(units, 'learning').length;
    const assignTotal = sourceSeq(units, 'assignments').length;
    assert(learningTotal > 100 && assignTotal > 150, `unexpectedly small source: ${learningTotal}/${assignTotal}`);
    for (const N of SESSION_COUNTS) assertInvariants(units, distributeCurriculum({ units, sessionCount: N }), N, `jeonju N=${N}`);
    const d16 = distributeCurriculum({ units, sessionCount: 16 });
    assert.strictEqual(d16.identity, true);
    d16.sessions.forEach((s, i) => assert.deepStrictEqual(uids(s.learning), uids(units[i].learning)));
    // ids are the documented, deterministic ones
    assert.strictEqual(units[0].learning[0].uid, 'L01-000');
    assert.strictEqual(units[0].assignments[0].uid, 'A01-000');
  });

  console.log(`--- ALL ${n} DISTRIBUTION ENGINE TESTS PASSED ---`);
})().catch(err => { console.error('Test failure:', err); process.exit(1); });
