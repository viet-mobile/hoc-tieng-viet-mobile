// -*- coding: utf-8 -*-
/**
 * Regional Schedule Engine (pure functions, no I/O)
 *
 * Definitions
 * - Class opportunity: a calendar date on which a class COULD be held: courseStartDate, then every
 *   intervalDays (7 = weekly, 14 = fortnightly) up to and including courseEndDate.
 * - Cancellation: a stored (date, reason) that matches a class opportunity. It consumes the opportunity but
 *   NOT any curriculum progress.
 * - Instructional session: a class opportunity that is not cancelled. Sessions are numbered 1..N in date order.
 *   N is DERIVED (opportunities - matching cancellations); it is never typed in and never fixed at 16.
 *
 * States
 * - 'unconfigured': courseStartDate or courseEndDate missing (e.g. ULSAN before it is scheduled). No dates, no slots.
 * - 'invalid':      malformed date, end before start, or absurdly long period (errors[] says why). No slots.
 * - 'configured':   slots[] lists every opportunity in date order. end === start is valid (one opportunity).
 *                   instructionalSessions may be 0 when every opportunity is cancelled.
 *
 * Cancellation rules (deterministic)
 * - (Case L) duplicate dates collapse to the first one; the server also rejects them (UNIQUE(region_id, date)).
 * - (Case D) date before courseStartDate           -> ignored, reported in preCourseCancellations.
 * - (Case P) date after courseEndDate              -> ignored, reported in postCourseCancellations.
 * - (Case K) date inside the period that is not an opportunity (wrong weekday / off the interval grid)
 *            -> ignored, reported in unalignedCancellations.
 *   The server rejects adding such dates while a period is configured; if the period is edited later, existing rows
 *   may become invalid and are then kept but ignored + flagged, never silently altering the curriculum distribution.
 *
 * NOTE: app_logic.js embeds the code between the SHARED-SCHEDULE-ENGINE markers verbatim, and admin_ui.js injects the
 * same functions into /admin; tests/test_schedule_engine.js fails if the app_logic.js copy diverges.
 */

function addDays(isoDateStr, days) {
  var d = new Date(isoDateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  var yyyy = d.getUTCFullYear();
  var mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  var dd = String(d.getUTCDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

function getDayOfWeek(isoDateStr) {
  var d = new Date(isoDateStr + 'T00:00:00Z');
  return d.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

/** Real calendar date, YYYY-MM-DD, year 2000-2100 (rejects 2026-02-30, 2026-13-01 ...). */
function isRealIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  var y = Number(value.slice(0, 4));
  if (y < 2000 || y > 2100) return false;
  var d = new Date(value + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function daysBetween(fromIso, toIso) {
  return Math.round((new Date(toIso + 'T00:00:00Z').getTime() - new Date(fromIso + 'T00:00:00Z').getTime()) / 86400000);
}

/**
 * Classify a cancellation date against a course period.
 * Returns 'ok' | 'unconfigured' | 'invalid-period' | 'bad-date' | 'before' | 'after' | 'unaligned'.
 */
function classifyCancellationDate(options, date) {
  var start = options.courseStartDate || null;
  var end = options.courseEndDate || null;
  var interval = options.intervalDays === 14 ? 14 : 7;
  if (!isRealIsoDate(date)) return 'bad-date';
  if (!start || !end) return 'unconfigured';
  if (!isRealIsoDate(start) || !isRealIsoDate(end) || end < start) return 'invalid-period';
  if (date < start) return 'before';
  if (date > end) return 'after';
  return daysBetween(start, date) % interval === 0 ? 'ok' : 'unaligned';
}

function calculateRegionalSchedule(options) {
  var MAX_OPPORTUNITIES = 200;
  var preliminaryMeetingDate = options.preliminaryMeetingDate || null;
  var courseStartDate = options.courseStartDate || null;
  var courseEndDate = options.courseEndDate || null;
  var intervalDays = options.intervalDays === 14 ? 14 : 7;

  // Case L: collapse duplicate cancellation dates (first wins), then order by date.
  var seen = {};
  var duplicateCount = 0;
  var cancellations = [];
  (options.cancellations || []).forEach(function (c) {
    if (!c || !c.date) return;
    if (seen[c.date]) { duplicateCount++; return; }
    seen[c.date] = true;
    cancellations.push({ date: c.date, reason: c.reason || '휴강' });
  });
  cancellations.sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); });

  var base = {
    status: 'unconfigured',
    errors: [],
    preliminaryMeeting: preliminaryMeetingDate ? { date: preliminaryMeetingDate, calculatedDate: preliminaryMeetingDate.replace(/-/g, '/'), title: '예비 모임' } : null,
    courseStartDate: courseStartDate,
    courseEndDate: courseEndDate,
    intervalDays: intervalDays,
    calendarOpportunities: 0,
    cancellationCount: 0,
    instructionalSessions: 0,
    completionDate: null,
    slots: [],
    unalignedCancellations: [],
    preCourseCancellations: [],
    postCourseCancellations: [],
    duplicateCancellationsDiscarded: duplicateCount
  };

  if (!courseStartDate || !courseEndDate) return base;

  if (!isRealIsoDate(courseStartDate) || !isRealIsoDate(courseEndDate)) {
    base.status = 'invalid';
    base.errors.push('bad-date');
    return base;
  }
  if (courseEndDate < courseStartDate) {
    base.status = 'invalid';
    base.errors.push('end-before-start');
    return base;
  }
  if (Math.floor(daysBetween(courseStartDate, courseEndDate) / intervalDays) + 1 > MAX_OPPORTUNITIES) {
    base.status = 'invalid';
    base.errors.push('too-long');
    return base;
  }

  var applied = {};
  cancellations.forEach(function (c) {
    var kind = classifyCancellationDate({ courseStartDate: courseStartDate, courseEndDate: courseEndDate, intervalDays: intervalDays }, c.date);
    if (kind === 'ok') applied[c.date] = c.reason;
    else if (kind === 'before') base.preCourseCancellations.push({ date: c.date, reason: c.reason });
    else if (kind === 'after') base.postCourseCancellations.push({ date: c.date, reason: c.reason });
    else base.unalignedCancellations.push({ date: c.date, reason: c.reason });
  });

  var session = 0;
  for (var d = courseStartDate; d <= courseEndDate; d = addDays(d, intervalDays)) {
    base.calendarOpportunities++;
    if (applied[d] !== undefined) {
      base.cancellationCount++;
      base.slots.push({ type: 'cancellation', date: d, calculatedDate: d.replace(/-/g, '/'), reason: applied[d], session: null, week: null });
    } else {
      session++;
      base.completionDate = d;
      // `week` is a legacy alias of `session` kept for the fixed-16 renderer.
      base.slots.push({ type: 'instructional', session: session, week: session, date: d, calculatedDate: d.replace(/-/g, '/') });
    }
  }
  base.instructionalSessions = session;
  base.status = 'configured';
  return base;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addDays: addDays,
    getDayOfWeek: getDayOfWeek,
    isRealIsoDate: isRealIsoDate,
    daysBetween: daysBetween,
    classifyCancellationDate: classifyCancellationDate,
    calculateRegionalSchedule: calculateRegionalSchedule
  };
}
