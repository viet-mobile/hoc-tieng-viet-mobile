// -*- coding: utf-8 -*-
/**
 * Schedule engine tests (regional_admin/schedule_engine.js): session count is DERIVED from the configured period
 * (start, end, interval) and the cancellation records; it is never fixed at 16.
 *
 * Cases A-L are the original edge cases, restated for the end-date model; M-Q cover the generalisation.
 * Every expected date list below is computed by an independent naive routine (expectedSessions) or hard-coded from the
 * authoritative Jeonju timeline, never by the engine under test.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const engine = require('../regional_admin/schedule_engine');

const { calculateRegionalSchedule, classifyCancellationDate, isRealIsoDate, addDays } = engine;

// ---- independent oracle ------------------------------------------------------------------------------------------
function utc(iso) { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d); }
function iso(ms) { return new Date(ms).toISOString().slice(0, 10); }
function expectedSessions(start, end, intervalDays, cancelled) {
  const skip = new Set(cancelled);
  const out = [];
  let opportunities = 0;
  for (let t = utc(start); t <= utc(end); t += intervalDays * 86400000) {
    opportunities++;
    if (!skip.has(iso(t))) out.push(iso(t));
  }
  return { opportunities, sessions: out };
}
function run(cfg) {
  return calculateRegionalSchedule(Object.assign({ intervalDays: 7 }, cfg));
}
function sessionDates(res) { return res.slots.filter(s => s.type === 'instructional').map(s => s.date); }
function cancelDates(res) { return res.slots.filter(s => s.type === 'cancellation').map(s => s.date); }
function check(res, start, end, cancels, interval = 7) {
  const exp = expectedSessions(start, end, interval, cancels);
  assert.deepStrictEqual(sessionDates(res), exp.sessions);
  assert.strictEqual(res.calendarOpportunities, exp.opportunities);
  assert.strictEqual(res.instructionalSessions, exp.sessions.length);
  assert.strictEqual(res.cancellationCount, exp.opportunities - exp.sessions.length);
  assert.strictEqual(res.instructionalSessions + res.cancellationCount, res.calendarOpportunities);
  res.slots.filter(s => s.type === 'instructional').forEach((s, i) => assert.strictEqual(s.session, i + 1));
}

const START = '2026-10-10'; // Saturday
const END = '2027-01-16';   // 15 weekly opportunities
const R = (cancellations, extra = {}) => run(Object.assign({ courseStartDate: START, courseEndDate: END, cancellations }, extra));

let n = 0;
const t = (name, fn) => { fn(); n++; console.log('✓ ' + name); };

t('A. no cancellations: sessions == calendar opportunities', () => {
  const r = R([]);
  assert.strictEqual(r.status, 'configured');
  assert.strictEqual(r.instructionalSessions, 15);
  check(r, START, END, []);
  assert.strictEqual(r.completionDate, END);
});

t('B. one cancellation removes exactly one session and does not consume curriculum progress', () => {
  const r = R([{ date: '2026-10-24', reason: '방학' }]);
  check(r, START, END, ['2026-10-24']);
  assert.strictEqual(r.instructionalSessions, 14);
  assert.strictEqual(r.cancellationCount, 1);
  const slot = r.slots.find(s => s.type === 'cancellation');
  assert.strictEqual(slot.reason, '방학');
  assert.strictEqual(slot.session, null);
});

t('C. consecutive cancellations', () => {
  const c = ['2026-10-24', '2026-10-31'];
  const r = R(c.map(date => ({ date, reason: 'x' })));
  check(r, START, END, c);
  assert.strictEqual(r.instructionalSessions, 13);
  // sessions 2 and 3 are the ones before/after the gap
  assert.deepStrictEqual(sessionDates(r).slice(1, 4), ['2026-10-17', '2026-11-07', '2026-11-14']);
});

t('D. cancellation before the first class opportunity is ignored and reported, never shifts sessions', () => {
  const r = R([{ date: '2026-10-03', reason: '예비' }]);
  check(r, START, END, []);
  assert.deepStrictEqual(r.preCourseCancellations.map(x => x.date), ['2026-10-03']);
  assert.strictEqual(r.cancellationCount, 0);
});

t('E. cancellation between sessions shifts later dates, earlier dates stay', () => {
  const base = R([]);
  const r = R([{ date: '2026-11-14', reason: 'x' }]);
  check(r, START, END, ['2026-11-14']);
  assert.deepStrictEqual(sessionDates(r).slice(0, 5), sessionDates(base).slice(0, 5));
  assert.strictEqual(sessionDates(r)[5], '2026-11-21');
});

t('F. cancellation on the final class opportunity (the end date)', () => {
  const r = R([{ date: END, reason: '종강일 휴강' }]);
  check(r, START, END, [END]);
  assert.strictEqual(r.instructionalSessions, 14);
  assert.strictEqual(r.completionDate, '2027-01-09'); // last instructional date moves back
  assert.strictEqual(r.slots[r.slots.length - 1].type, 'cancellation');
});

t('G. cancellation immediately before the final opportunity', () => {
  const r = R([{ date: '2027-01-09', reason: 'x' }]);
  check(r, START, END, ['2027-01-09']);
  assert.strictEqual(r.completionDate, END);
  assert.strictEqual(r.instructionalSessions, 14);
});

t('H. deleting a cancellation restores the previous schedule exactly', () => {
  const withC = R([{ date: '2026-11-07', reason: 'x' }]);
  const without = R([]);
  assert.strictEqual(withC.instructionalSessions, 14);
  assert.strictEqual(without.instructionalSessions, 15);
  assert.deepStrictEqual(without, R([]));
  check(without, START, END, []);
});

t('I. changing the start date re-bases every date (and can invalidate old cancellations)', () => {
  const r = run({ courseStartDate: '2026-10-17', courseEndDate: END, cancellations: [{ date: '2026-11-07', reason: 'x' }] });
  check(r, '2026-10-17', END, ['2026-11-07']);
  assert.strictEqual(sessionDates(r)[0], '2026-10-17');
  const shifted = run({ courseStartDate: '2026-10-11', courseEndDate: '2027-01-17', cancellations: [{ date: '2026-11-07', reason: 'x' }] });
  assert.deepStrictEqual(shifted.unalignedCancellations.map(x => x.date), ['2026-11-07']); // Sunday grid: Saturday date no longer valid
  assert.strictEqual(shifted.cancellationCount, 0);
});

t('J. unconfigured (ULSAN): null/partial start or end -> no dates, no slots, no fabricated schedule', () => {
  for (const cfg of [{}, { courseStartDate: null, courseEndDate: null }, { courseStartDate: START }, { courseEndDate: END }, { courseStartDate: '', courseEndDate: '' }]) {
    const r = run(Object.assign({ cancellations: [{ date: '2026-11-07', reason: 'x' }] }, cfg));
    assert.strictEqual(r.status, 'unconfigured');
    assert.deepStrictEqual(r.slots, []);
    assert.strictEqual(r.instructionalSessions, 0);
    assert.strictEqual(r.completionDate, null);
  }
});

t('K. cancellation on a non-class weekday is ignored, reported, and never alters the count', () => {
  const r = R([{ date: '2026-11-08', reason: '일요일' }]); // Sunday
  check(r, START, END, []);
  assert.deepStrictEqual(r.unalignedCancellations.map(x => x.date), ['2026-11-08']);
  assert.strictEqual(classifyCancellationDate({ courseStartDate: START, courseEndDate: END }, '2026-11-08'), 'unaligned');
  assert.strictEqual(classifyCancellationDate({ courseStartDate: START, courseEndDate: END }, '2026-11-07'), 'ok');
});

t('L. duplicate cancellation date collapses to the first; counted once', () => {
  const r = R([{ date: '2026-11-07', reason: 'first' }, { date: '2026-11-07', reason: 'second' }]);
  check(r, START, END, ['2026-11-07']);
  assert.strictEqual(r.duplicateCancellationsDiscarded, 1);
  assert.strictEqual(r.slots.find(s => s.type === 'cancellation').reason, 'first');
});

t('M. cancellation outside the course period (after the end) is ignored and reported', () => {
  const r = R([{ date: '2027-01-23', reason: 'late' }]);
  check(r, START, END, []);
  assert.deepStrictEqual(r.postCourseCancellations.map(x => x.date), ['2027-01-23']);
});

t('N. end date validation', () => {
  const before = run({ courseStartDate: END, courseEndDate: START });
  assert.strictEqual(before.status, 'invalid');
  assert.deepStrictEqual(before.errors, ['end-before-start']);
  assert.deepStrictEqual(before.slots, []);
  const same = run({ courseStartDate: START, courseEndDate: START });
  assert.strictEqual(same.status, 'configured');
  assert.strictEqual(same.calendarOpportunities, 1);
  assert.strictEqual(same.instructionalSessions, 1);
  const sameCancelled = run({ courseStartDate: START, courseEndDate: START, cancellations: [{ date: START, reason: 'x' }] });
  assert.strictEqual(sameCancelled.status, 'configured');
  assert.strictEqual(sameCancelled.instructionalSessions, 0); // nothing to distribute; no crash
  assert.strictEqual(sameCancelled.completionDate, null);
  assert.strictEqual(run({ courseStartDate: '2026-02-30', courseEndDate: END }).status, 'invalid');
  assert.strictEqual(run({ courseStartDate: START, courseEndDate: '2100-12-31' }).errors[0], 'too-long');
});

t('O. fortnightly classes: grid is start + 14k; off-grid weeks are unaligned', () => {
  const r = run({ courseStartDate: START, courseEndDate: END, intervalDays: 14, cancellations: [{ date: '2026-10-24', reason: 'x' }, { date: '2026-10-17', reason: 'off-grid' }] });
  check(r, START, END, ['2026-10-24'], 14);
  assert.deepStrictEqual(r.unalignedCancellations.map(x => x.date), ['2026-10-17']);
  assert.strictEqual(r.intervalDays, 14);
});

t('P. JEONJU authoritative timeline: 19 opportunities - 3 cancellations = 16 sessions ending 2027-02-13', () => {
  const cancels = [
    { date: '2026-11-07', reason: '방학' },
    { date: '2026-12-05', reason: '천안 베트남어 순회대회 파이오니아 모임' },
    { date: '2026-12-26', reason: '군산 한국어 순회대회' },
  ];
  const r = run({ preliminaryMeetingDate: '2026-10-03', courseStartDate: '2026-10-10', courseEndDate: '2027-02-13', cancellations: cancels });
  const authoritative = ['2026-10-10', '2026-10-17', '2026-10-24', '2026-10-31', '2026-11-14', '2026-11-21', '2026-11-28', '2026-12-12',
    '2026-12-19', '2027-01-02', '2027-01-09', '2027-01-16', '2027-01-23', '2027-01-30', '2027-02-06', '2027-02-13'];
  assert.deepStrictEqual(sessionDates(r), authoritative);
  assert.deepStrictEqual(cancelDates(r), ['2026-11-07', '2026-12-05', '2026-12-26']);
  assert.strictEqual(r.calendarOpportunities, 19);
  assert.strictEqual(r.cancellationCount, 3);
  assert.strictEqual(r.instructionalSessions, 16);
  assert.strictEqual(r.completionDate, '2027-02-13');
  assert.strictEqual(r.preliminaryMeeting.date, '2026-10-03');
  assert.strictEqual(r.slots.length, 19);
  // dates strictly increasing, consecutive slots exactly 7 days apart
  for (let i = 1; i < r.slots.length; i++) assert.strictEqual(utc(r.slots[i].date) - utc(r.slots[i - 1].date), 7 * 86400000);
});

t('Q. session count follows period length (8, 12, 16, 20, 30 sessions from a weekly period)', () => {
  for (const sessions of [1, 8, 12, 16, 20, 30]) {
    const end = addDays(START, 7 * (sessions - 1));
    const r = run({ courseStartDate: START, courseEndDate: end, cancellations: [] });
    assert.strictEqual(r.instructionalSessions, sessions);
    check(r, START, end, []);
  }
  // adding a cancellation to an 18-session course leaves 17; deleting it restores 18
  const end18 = addDays(START, 7 * 17);
  const c = [{ date: addDays(START, 7 * 5), reason: 'x' }];
  assert.strictEqual(run({ courseStartDate: START, courseEndDate: end18, cancellations: [] }).instructionalSessions, 18);
  assert.strictEqual(run({ courseStartDate: START, courseEndDate: end18, cancellations: c }).instructionalSessions, 17);
  assert.strictEqual(run({ courseStartDate: START, courseEndDate: end18, cancellations: [] }).instructionalSessions, 18);
});

t('date validation helper', () => {
  for (const ok of ['2026-02-28', '2028-02-29', '2000-01-01']) assert.strictEqual(isRealIsoDate(ok), true, ok);
  for (const bad of ['2026-02-30', '2026-13-01', '2026-00-10', '26-01-01', '2026-1-1', '1999-12-31', '2101-01-01', null, undefined, 20261010, '']) {
    assert.strictEqual(isRealIsoDate(bad), false, String(bad));
  }
});

t('engine is timezone independent (UTC arithmetic only)', () => {
  const r1 = R([{ date: '2026-11-07', reason: 'x' }]);
  const saved = process.env.TZ;
  process.env.TZ = 'Pacific/Kiritimati';
  const r2 = R([{ date: '2026-11-07', reason: 'x' }]);
  process.env.TZ = saved === undefined ? '' : saved;
  assert.deepStrictEqual(r1, r2);
});

t('app_logic.js embeds a verbatim copy of the schedule and distribution engines', () => {
  const root = path.dirname(__dirname);
  const app = fs.readFileSync(path.join(root, 'app_logic.js'), 'utf8');
  const grab = (name) => {
    const s = app.indexOf(`/* BEGIN SHARED-${name}-ENGINE`);
    assert(s >= 0, `missing BEGIN marker for ${name}`);
    const start = app.indexOf('\n', s) + 1;
    const end = app.indexOf(`/* END SHARED-${name}-ENGINE */`);
    assert(end > start, `missing END marker for ${name}`);
    return app.slice(start, end).replace(/\r\n/g, '\n').trimEnd();
  };
  const body = (file, from) => {
    const src = fs.readFileSync(path.join(root, 'regional_admin', file), 'utf8').replace(/\r\n/g, '\n');
    return src.slice(src.indexOf(from), src.indexOf('if (typeof module')).trimEnd();
  };
  assert.strictEqual(grab('SCHEDULE'), body('schedule_engine.js', 'function addDays'), 'schedule engine copy in app_logic.js diverged');
  assert.strictEqual(grab('DISTRIBUTION'), body('distribution_engine.js', 'var ASSIGNMENT_DAY_ORDER'), 'distribution engine copy in app_logic.js diverged');
});

console.log(`--- ALL ${n} SCHEDULE ENGINE TESTS PASSED ---`);
