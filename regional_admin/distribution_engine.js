// -*- coding: utf-8 -*-
/**
 * Curriculum Distribution Engine (pure functions, no I/O)
 *
 * SOURCE CURRICULUM = the authoritative total learning load, stored as ordered "units" (today: 16). Each unit owns an
 * ordered list of atomic learning items and an ordered list of atomic assignment items. Atoms are never split.
 * SESSION PLAN      = the instructional sessions produced by schedule_engine.js (count N is derived from dates).
 * DISTRIBUTION      = this file: a deterministic mapping  source atoms -> session numbers.
 *
 * distributeCurriculum({ units, sessionCount, pins }) -> { sessions: [{ session, units, learning, assignments }], ... }
 *   units:        [{ unit, learning: [{uid,...}], assignments: [{uid,...}] }] in source order
 *   sessionCount: N >= 1 (N < 1 => status 'no-sessions', nothing is distributed and nothing is lost)
 *   pins:         { uid: sessionNumber } administrator overrides; pinned atoms go to that session (clamped into 1..N)
 *                 and are excluded from the automatic distribution of the remaining atoms.
 *
 * Algorithm (both streams use the same session allocation, each stream is partitioned independently)
 *   N == M (units)  -> identity: session k receives exactly unit k (this is what keeps JEONJU's authored timeline).
 *   N <  M          -> whole units are grouped: session s gets units [floor(s*M/N), floor((s+1)*M/N)); every session
 *                      gets at least one unit and group sizes differ by at most one (16 -> 8 gives 2 units each).
 *   N >  M          -> every unit keeps >= 1 session; the N-M extra sessions go, one at a time, to the unit with the
 *                      highest items-per-session ratio (ties: earliest unit) while that unit still has more atoms than
 *                      sessions; if every unit is saturated the remaining sessions are spread by the same ratio rule
 *                      and simply carry a lighter (possibly empty) load. Inside a unit the atoms are cut into the
 *                      unit's sessions as evenly as possible with ceil(j*n/c) boundaries, preserving order.
 * Guarantees (asserted by verifyDistribution and the tests): every atom appears exactly once per stream; the order of
 * non-pinned atoms across sessions equals the source order; nothing is fabricated or split.
 *
 * NOTE: app_logic.js embeds the code between the SHARED-DISTRIBUTION-ENGINE markers verbatim (public site) and
 * admin_ui.js injects the same functions into /admin; tests fail if the copies diverge.
 */

var ASSIGNMENT_DAY_ORDER = ['월', '화', '수', '목', '금'];
var ASSIGNMENT_CATEGORY_ORDER = ['review', 'preview', 'vocab'];

/** Canonical assignment order inside one unit: day (월..금), category (review, preview, vocab), then sort_order. */
function orderAssignments(list) {
  return list.map(function (it, i) { return { it: it, i: i }; }).sort(function (a, b) {
    var da = ASSIGNMENT_DAY_ORDER.indexOf(a.it.day), db = ASSIGNMENT_DAY_ORDER.indexOf(b.it.day);
    if (da !== db) return da - db;
    var ca = ASSIGNMENT_CATEGORY_ORDER.indexOf(a.it.category), cb = ASSIGNMENT_CATEGORY_ORDER.indexOf(b.it.category);
    if (ca !== cb) return ca - cb;
    var sa = a.it.sort_order === undefined ? a.i : a.it.sort_order, sb = b.it.sort_order === undefined ? b.i : b.it.sort_order;
    return sa - sb || a.i - b.i;
  }).map(function (x) { return x.it; });
}

function distCeilBound(n, parts, j) {
  return Math.floor((j * n + parts - 1) / parts);
}

function distributeCurriculum(options) {
  var units = options.units || [];
  var N = Math.floor(Number(options.sessionCount) || 0);
  var pins = options.pins || {};
  var M = units.length;

  var result = { status: 'ok', sessionCount: N, unitCount: M, identity: false, sessions: [], clampedPins: [], ignoredPins: [] };

  // Stream order index per uid; duplicate uids would make "exactly once" meaningless, so refuse them.
  var order = {}, known = {}, count = 0;
  units.forEach(function (u) {
    (u.learning || []).concat(u.assignments || []).forEach(function (it) {
      if (!it || it.uid === undefined || it.uid === null) throw new Error('distribution: every source item needs a uid');
      if (known[it.uid]) throw new Error('distribution: duplicate item uid ' + it.uid);
      known[it.uid] = true;
      order[it.uid] = count++;
    });
  });

  if (N < 1) {
    result.status = 'no-sessions';
    return result;
  }

  var pinned = {};
  Object.keys(pins).forEach(function (uid) {
    if (known[uid]) pinned[uid] = true; else result.ignoredPins.push(uid);
  });

  var auto = units.map(function (u) {
    return {
      unit: u.unit,
      learning: (u.learning || []).filter(function (it) { return !pinned[it.uid]; }),
      assignments: (u.assignments || []).filter(function (it) { return !pinned[it.uid]; })
    };
  });

  var sessions = [];
  for (var s = 0; s < N; s++) sessions.push({ session: s + 1, units: [], learning: [], assignments: [] });

  if (M > 0 && N <= M) {
    for (var g = 0; g < N; g++) {
      var from = Math.floor(g * M / N), to = Math.floor((g + 1) * M / N);
      for (var k = from; k < to; k++) {
        sessions[g].units.push(auto[k].unit);
        sessions[g].learning = sessions[g].learning.concat(auto[k].learning);
        sessions[g].assignments = sessions[g].assignments.concat(auto[k].assignments);
      }
    }
  } else if (M > 0) {
    var c = auto.map(function () { return 1; });
    var weight = auto.map(function (u) { return u.learning.length + u.assignments.length; });
    var cap = auto.map(function (u) { return Math.max(1, u.learning.length, u.assignments.length); });
    for (var extra = 0; extra < N - M; extra++) {
      var best = -1, kk;
      for (kk = 0; kk < M; kk++) {
        if (c[kk] < cap[kk] && (best < 0 || weight[kk] * c[best] > weight[best] * c[kk])) best = kk;
      }
      if (best < 0) {
        for (kk = 0; kk < M; kk++) {
          if (best < 0 || weight[kk] * c[best] > weight[best] * c[kk]) best = kk;
        }
      }
      c[best]++;
    }
    var next = 0;
    for (var u = 0; u < M; u++) {
      for (var j = 0; j < c[u]; j++) {
        var sess = sessions[next++];
        sess.units.push(auto[u].unit);
        sess.learning = auto[u].learning.slice(distCeilBound(auto[u].learning.length, c[u], j), distCeilBound(auto[u].learning.length, c[u], j + 1));
        sess.assignments = auto[u].assignments.slice(distCeilBound(auto[u].assignments.length, c[u], j), distCeilBound(auto[u].assignments.length, c[u], j + 1));
      }
    }
  }

  // Administrator overrides: place pinned atoms, then restore source order inside each session.
  var hasPins = false;
  units.forEach(function (u) {
    ['learning', 'assignments'].forEach(function (stream) {
      (u[stream] || []).forEach(function (it) {
        if (!pinned[it.uid]) return;
        var target = Math.floor(Number(pins[it.uid]));
        var clamped = Math.min(Math.max(isNaN(target) ? 1 : target, 1), N);
        if (clamped !== target) result.clampedPins.push({ uid: it.uid, requested: pins[it.uid], placed: clamped });
        sessions[clamped - 1][stream].push(it);
        hasPins = true;
      });
    });
  });
  if (hasPins) {
    sessions.forEach(function (sx) {
      sx.learning.sort(function (a, b) { return order[a.uid] - order[b.uid]; });
      sx.assignments.sort(function (a, b) { return order[a.uid] - order[b.uid]; });
    });
  }

  result.sessions = sessions;
  result.identity = !hasPins && M > 0 && N === M;
  return result;
}

/**
 * Independent check of a distribution against its source. Returns a list of problems (empty = valid):
 * missing / duplicated atoms per stream, and order violations among non-pinned atoms.
 */
function verifyDistribution(units, dist, pins) {
  var problems = [];
  var pinned = pins || {};
  ['learning', 'assignments'].forEach(function (stream) {
    var source = [];
    units.forEach(function (u) { source = source.concat(u[stream] || []); });
    var placed = [];
    dist.sessions.forEach(function (s) { placed = placed.concat(s[stream]); });
    var seen = {};
    placed.forEach(function (it) {
      if (seen[it.uid]) problems.push(stream + ': duplicate ' + it.uid);
      seen[it.uid] = true;
    });
    source.forEach(function (it) {
      if (!seen[it.uid]) problems.push(stream + ': missing ' + it.uid);
    });
    if (placed.length !== source.length) problems.push(stream + ': count ' + placed.length + ' != ' + source.length);
    var srcAuto = source.filter(function (it) { return !pinned[it.uid]; }).map(function (it) { return it.uid; });
    var placedAuto = placed.filter(function (it) { return !pinned[it.uid]; }).map(function (it) { return it.uid; });
    if (srcAuto.join('|') !== placedAuto.join('|')) problems.push(stream + ': order differs from source');
  });
  return problems;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    orderAssignments: orderAssignments,
    distributeCurriculum: distributeCurriculum,
    verifyDistribution: verifyDistribution,
    ASSIGNMENT_DAY_ORDER: ASSIGNMENT_DAY_ORDER,
    ASSIGNMENT_CATEGORY_ORDER: ASSIGNMENT_CATEGORY_ORDER
  };
}
