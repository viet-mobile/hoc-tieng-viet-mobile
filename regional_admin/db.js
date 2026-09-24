// -*- coding: utf-8 -*-
/**
 * Regional Admin Database Access Layer for Cloudflare D1
 *
 * Model (see schema.sql): SOURCE curriculum (16 units of atomic items with stable uids) is separate from the COURSE
 * CONFIGURATION (start/end/interval + cancellations, from which the number of instructional sessions is derived) and
 * from the ACTIVE PLAN (course_plans + course_plan_items: item -> session mapping, origin auto|manual).
 *
 * Invariants
 * - Every mutation that touches more than one row runs in ONE db.batch() (D1 executes a batch as a single
 *   transaction) together with its audit-log row: a failure leaves neither partial data nor an audit entry.
 *   There is deliberately NO non-atomic fallback.
 * - Ordering columns are contiguous per list and protected by UNIQUE indexes, so no duplicate/missing positions.
 * - Editing dates/cancellations NEVER changes the active plan. Only an explicit apply (preview token must match),
 *   a pin change, or a restore does.
 * - Source edits never rewrite the plan except to drop plan rows of items that no longer exist (no orphans); items
 *   that are new since the last apply are shown in the last session until the next apply (nothing is lost).
 * - updateCurriculumWeek(): an `undefined` key is left untouched, `null` clears it, an array/object replaces it.
 */

const scheduleEngine = require('./schedule_engine');
const distributionEngine = require('./distribution_engine');

const DAY_NAMES = ['월', '화', '수', '목', '금'];
const ASSIGNMENT_CATEGORIES = ['review', 'preview', 'vocab'];
const WEEKDAY_LABELS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const LIMITS = {
  reason: 200,
  title: 200,
  note: 1000,
  text: 1000,
  page: 100,
  link: 1000,
  weekday: 40,
  welcomeTitle: 200,
  welcomeParagraph: 2000,
  welcomeParagraphs: 20,
  itemsPerWeek: 60,
  itemsPerDayCategory: 30,
};

class ValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ValidationError';
    this.status = status;
  }
}

function notFound(message) {
  return new ValidationError(message, 404);
}

/* ---------------- helpers ---------------- */

const isRealIsoDate = scheduleEngine.isRealIsoDate;

function optionalDate(value, label) {
  if (value === undefined || value === null || value === '') return null;
  if (!isRealIsoDate(value)) {
    throw new ValidationError(`${label} 형식이 올바르지 않습니다 (실제 존재하는 날짜, YYYY-MM-DD 필요).`);
  }
  return value;
}

function cleanString(value, max, label, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) throw new ValidationError(`${label}은(는) 필수 입력 항목입니다.`);
    return null;
  }
  if (typeof value !== 'string') throw new ValidationError(`${label} 형식이 올바르지 않습니다.`);
  const t = value.trim();
  if (!t) {
    if (required) throw new ValidationError(`${label}은(는) 필수 입력 항목입니다.`);
    return null;
  }
  if (t.length > max) throw new ValidationError(`${label}은(는) ${max}자 이내여야 합니다.`);
  return t;
}

/** Accepts "text" or {ko, en}; returns {ko, en} (ko may be '' when absent). */
function normalizeText(value, label) {
  if (value === undefined || value === null) return { ko: '', en: null };
  if (typeof value === 'string') return { ko: cleanString(value, LIMITS.text, label) || '', en: null };
  if (typeof value !== 'object') throw new ValidationError(`${label} 형식이 올바르지 않습니다.`);
  return {
    ko: cleanString(value.ko, LIMITS.text, label) || '',
    en: cleanString(value.en, LIMITS.text, label + '(en)'),
  };
}

function normalizeLink(link) {
  if (link === undefined || link === null) return null;
  if (typeof link !== 'object') throw new ValidationError('링크 형식이 올바르지 않습니다.');
  const s = JSON.stringify(link);
  if (s.length > LIMITS.link) throw new ValidationError('링크 데이터가 너무 깁니다.');
  return s;
}

function isConstraintError(err) {
  return !!(err && /UNIQUE|constraint/i.test(String(err.message || err)));
}

function randomUid(prefix) {
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  return prefix + '-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

function parseJson(text, fallback = null) {
  if (!text) return fallback;
  try { return JSON.parse(text); } catch (e) { return fallback; }
}

/* ---------------- audit / atomic ---------------- */

function auditStatement(db, regionId, user, action, details) {
  const detailsStr = typeof details === 'string' ? details : JSON.stringify(details);
  return db.prepare(
    `INSERT INTO audit_logs (region_id, user_id, username, action, details)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(regionId, user ? user.id : null, user ? user.username : 'system', action, detailsStr);
}

async function runAtomic(db, statements) {
  if (!db || typeof db.batch !== 'function') {
    throw new Error('Atomic D1 batch support is required for regional admin mutations.');
  }
  return db.batch(statements);
}

async function logAudit(db, regionId, user, action, details) {
  try {
    await auditStatement(db, regionId, user, action, details).run();
  } catch (e) {
    console.error('Failed to write audit log:', e);
  }
}

/* ---------------- course configuration (settings) ---------------- */

async function getRegionalSettings(db, regionId) {
  const row = await db.prepare(
    "SELECT preliminary_meeting_date, course_start_date, course_end_date, interval_days, meeting_weekday, welcome_title, welcome_body, updated_at FROM regional_settings WHERE region_id = ?"
  ).bind(regionId).first();

  if (!row) {
    return {
      preliminaryMeetingDate: null,
      courseStartDate: null,
      courseEndDate: null,
      intervalDays: 7,
      meetingWeekday: '매주 토요일',
      welcomeTitle: null,
      welcomeBody: null,
      updatedAt: null,
    };
  }
  return {
    preliminaryMeetingDate: row.preliminary_meeting_date,
    courseStartDate: row.course_start_date,
    courseEndDate: row.course_end_date,
    intervalDays: row.interval_days === 14 ? 14 : 7,
    meetingWeekday: row.meeting_weekday,
    welcomeTitle: row.welcome_title,
    welcomeBody: parseJson(row.welcome_body),
    updatedAt: row.updated_at,
  };
}

const PERIOD_ERRORS = {
  'end-before-start': '과정 종료일은 시작일보다 빠를 수 없습니다.',
  'too-long': '과정 기간이 너무 깁니다 (수업 기회 최대 200회).',
  'bad-date': '과정 시작일/종료일 형식이 올바르지 않습니다.',
};

async function updateRegionalSettings(db, regionId, settings, user, auditAction = 'update_settings') {
  if (!settings || typeof settings !== 'object') throw new ValidationError('요청 본문이 올바르지 않습니다.');
  const current = await getRegionalSettings(db, regionId);

  // PUT semantics: a key that is `undefined` keeps the current value, `null`/'' clears it.
  const pick = (key, fallback) => (settings[key] === undefined ? fallback : settings[key]);
  const prelimDate = optionalDate(pick('preliminaryMeetingDate', current.preliminaryMeetingDate), '예비 모임 날짜');
  const startDate = optionalDate(pick('courseStartDate', current.courseStartDate), '과정 시작일');
  const endDate = optionalDate(pick('courseEndDate', current.courseEndDate), '과정 종료일');
  let interval = current.intervalDays;
  if (settings.intervalDays !== undefined && settings.intervalDays !== null) {
    interval = Number(settings.intervalDays);
    if (interval !== 7 && interval !== 14) throw new ValidationError('수업 주기는 매주(7일) 또는 격주(14일)여야 합니다.');
  }
  if (prelimDate && startDate && prelimDate > startDate) {
    throw new ValidationError('예비 모임 날짜는 과정 시작일보다 늦을 수 없습니다.');
  }
  if (startDate && endDate) {
    const check = scheduleEngine.calculateRegionalSchedule({ courseStartDate: startDate, courseEndDate: endDate, intervalDays: interval });
    if (check.status === 'invalid') throw new ValidationError(PERIOD_ERRORS[check.errors[0]] || '과정 기간이 올바르지 않습니다.');
  }
  const weekday = settings.meetingWeekday === undefined
    ? current.meetingWeekday
    : (cleanString(settings.meetingWeekday, LIMITS.weekday, '수업 요일') || '매주 토요일');
  const title = settings.welcomeTitle === undefined ? current.welcomeTitle : cleanString(settings.welcomeTitle, LIMITS.welcomeTitle, '환영 제목');

  let bodyStr = current.welcomeBody ? JSON.stringify(current.welcomeBody) : null;
  if (settings.welcomeBody !== undefined) {
    bodyStr = null;
    if (settings.welcomeBody !== null) {
      if (!Array.isArray(settings.welcomeBody) || settings.welcomeBody.length > LIMITS.welcomeParagraphs) {
        throw new ValidationError('환영 문구 형식이 올바르지 않습니다.');
      }
      const paragraphs = settings.welcomeBody.map(p => {
        if (typeof p !== 'string' || p.length > LIMITS.welcomeParagraph) {
          throw new ValidationError('환영 문구 형식이 올바르지 않습니다.');
        }
        return p;
      });
      bodyStr = JSON.stringify(paragraphs);
    }
  }

  await runAtomic(db, [
    db.prepare(
      `INSERT INTO regional_settings (region_id, preliminary_meeting_date, course_start_date, course_end_date, interval_days, meeting_weekday, welcome_title, welcome_body, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(region_id) DO UPDATE SET
         preliminary_meeting_date = excluded.preliminary_meeting_date,
         course_start_date = excluded.course_start_date,
         course_end_date = excluded.course_end_date,
         interval_days = excluded.interval_days,
         meeting_weekday = excluded.meeting_weekday,
         welcome_title = excluded.welcome_title,
         welcome_body = excluded.welcome_body,
         updated_at = CURRENT_TIMESTAMP`
    ).bind(regionId, prelimDate, startDate, endDate, interval, weekday, title, bodyStr),
    auditStatement(db, regionId, user, auditAction, {
      before: current,
      after: {
        preliminaryMeetingDate: prelimDate,
        courseStartDate: startDate,
        courseEndDate: endDate,
        intervalDays: interval,
        meetingWeekday: weekday,
        welcomeTitle: title,
        welcomeBody: bodyStr ? JSON.parse(bodyStr) : null,
      },
    }),
  ]);

  return await getRegionalSettings(db, regionId);
}

/* ---------------- cancellations ---------------- */

async function getCancellations(db, regionId) {
  const result = await db.prepare(
    "SELECT id, date, reason, created_at FROM class_cancellations WHERE region_id = ? ORDER BY date ASC"
  ).bind(regionId).all();
  return result.results || [];
}

function readCancellationInput(data) {
  if (!data || typeof data !== 'object') throw new ValidationError('요청 본문이 올바르지 않습니다.');
  const date = typeof data.date === 'string' ? data.date.trim() : data.date;
  if (!isRealIsoDate(date)) {
    throw new ValidationError('휴강 날짜 형식이 올바르지 않습니다 (실제 존재하는 날짜, YYYY-MM-DD 필요).');
  }
  const reason = cleanString(data.reason, LIMITS.reason, '휴강 사유', { required: true });
  return { date, reason };
}

/**
 * A cancellation must be a scheduled class opportunity of the configured course period (start, start+interval, ...,
 * up to and including the end date). Anything else is rejected here; rows that become invalid because the period is
 * edited later are kept but ignored and flagged by the schedule engine.
 */
async function assertValidCancellationDate(db, regionId, date) {
  const s = await getRegionalSettings(db, regionId);
  const kind = scheduleEngine.classifyCancellationDate(s, date);
  const messages = {
    'unconfigured': '휴강을 등록하려면 먼저 과정 시작일과 종료일을 설정하세요.',
    'invalid-period': '과정 기간 설정이 올바르지 않아 휴강을 등록할 수 없습니다.',
    'before': `휴강 일자는 과정 시작일(${s.courseStartDate}) 이후여야 합니다.`,
    'after': `휴강 일자는 과정 종료일(${s.courseEndDate}) 이전이어야 합니다.`,
  };
  if (messages[kind]) throw new ValidationError(messages[kind]);
  if (kind === 'unaligned') {
    const day = WEEKDAY_LABELS[scheduleEngine.getDayOfWeek(s.courseStartDate)];
    throw new ValidationError(
      `휴강 일자는 수업 일정(시작일 ${s.courseStartDate} 기준 ${s.intervalDays === 14 ? '격주' : '매주'} ${day})에 해당하는 날짜여야 합니다.`
    );
  }
}

async function addCancellation(db, regionId, data, user, auditAction = 'add_cancellation') {
  const { date, reason } = readCancellationInput(data);

  // Case L (documented): one cancellation per date, enforced here and by UNIQUE(region_id, date).
  const duplicate = await db.prepare(
    "SELECT id FROM class_cancellations WHERE region_id = ? AND date = ?"
  ).bind(regionId, date).first();
  if (duplicate) {
    throw new ValidationError(`해당 일자(${date})에 이미 등록된 휴강 일정이 존재합니다.`);
  }
  await assertValidCancellationDate(db, regionId, date);

  try {
    await runAtomic(db, [
      db.prepare("INSERT INTO class_cancellations (region_id, date, reason) VALUES (?, ?, ?)").bind(regionId, date, reason),
      auditStatement(db, regionId, user, auditAction, { added: { date, reason } }),
    ]);
  } catch (err) {
    if (isConstraintError(err)) throw new ValidationError(`해당 일자(${date})에 이미 등록된 휴강 일정이 존재합니다.`);
    throw err;
  }
  return await getCancellations(db, regionId);
}

async function updateCancellation(db, regionId, id, data, user, auditAction = 'update_cancellation') {
  const { date, reason } = readCancellationInput(data);

  const existing = await db.prepare(
    "SELECT id, date, reason FROM class_cancellations WHERE id = ? AND region_id = ?"
  ).bind(id, regionId).first();
  if (!existing) throw notFound('해당 휴강 일자를 찾을 수 없습니다.');

  const duplicate = await db.prepare(
    "SELECT id FROM class_cancellations WHERE region_id = ? AND date = ? AND id != ?"
  ).bind(regionId, date, id).first();
  if (duplicate) {
    throw new ValidationError(`해당 일자(${date})에 이미 등록된 다른 휴강 일정이 존재합니다.`);
  }
  await assertValidCancellationDate(db, regionId, date);

  try {
    await runAtomic(db, [
      db.prepare("UPDATE class_cancellations SET date = ?, reason = ? WHERE id = ? AND region_id = ?").bind(date, reason, id, regionId),
      auditStatement(db, regionId, user, auditAction, {
        before: { id: existing.id, date: existing.date, reason: existing.reason },
        after: { date, reason },
      }),
    ]);
  } catch (err) {
    if (isConstraintError(err)) throw new ValidationError(`해당 일자(${date})에 이미 등록된 다른 휴강 일정이 존재합니다.`);
    throw err;
  }
  return await getCancellations(db, regionId);
}

async function deleteCancellation(db, regionId, id, user, auditAction = 'delete_cancellation') {
  const existing = await db.prepare(
    "SELECT id, date, reason FROM class_cancellations WHERE id = ? AND region_id = ?"
  ).bind(id, regionId).first();
  if (!existing) throw notFound('해당 휴강 일자를 찾을 수 없습니다.');

  await runAtomic(db, [
    db.prepare("DELETE FROM class_cancellations WHERE id = ? AND region_id = ?").bind(id, regionId),
    auditStatement(db, regionId, user, auditAction, {
      deleted: { id: existing.id, date: existing.date, reason: existing.reason },
    }),
  ]);
  return await getCancellations(db, regionId);
}

/* ---------------- source curriculum ---------------- */

function parseLink(json) {
  return parseJson(json);
}

async function getCurriculum(db, regionId) {
  const weeksResult = await db.prepare(
    "SELECT week_number, title_ko, title_en, note_ko, note_en FROM curriculum_weeks WHERE region_id = ? ORDER BY week_number ASC"
  ).bind(regionId).all();
  const weeks = weeksResult.results || [];

  const itemsResult = await db.prepare(
    "SELECT uid, week_number, sort_order, text_ko, text_en, page, link_json FROM curriculum_learning_items WHERE region_id = ? ORDER BY week_number ASC, sort_order ASC"
  ).bind(regionId).all();
  const items = itemsResult.results || [];

  const assignsResult = await db.prepare(
    "SELECT uid, week_number, day_name, category, sort_order, text_ko, text_en, link_json FROM curriculum_assignment_items WHERE region_id = ? ORDER BY week_number ASC, day_name ASC, sort_order ASC"
  ).bind(regionId).all();
  const assignments = assignsResult.results || [];

  const weekList = [];
  for (let w = 1; w <= 16; w++) {
    const weekMeta = weeks.find(item => item.week_number === w) || {};
    const weekItems = items.filter(it => it.week_number === w).map(it => ({
      uid: it.uid,
      text: { ko: it.text_ko, en: it.text_en },
      page: it.page || null,
      link: parseLink(it.link_json),
    }));

    const weekAssigns = assignments.filter(a => a.week_number === w);
    let assignObj = null;
    if (weekAssigns.length > 0) {
      const mapRows = (rows, cat) => rows
        .filter(r => r.category === cat)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(r => ({ uid: r.uid, text: { ko: r.text_ko, en: r.text_en }, link: parseLink(r.link_json) }));
      const days = DAY_NAMES.map(day => {
        const dayRows = weekAssigns.filter(r => r.day_name === day);
        return {
          day: { ko: day + '요일' },
          reviews: mapRows(dayRows, 'review'),
          previews: mapRows(dayRows, 'preview'),
          vocab: mapRows(dayRows, 'vocab'),
        };
      });
      assignObj = { week: w, days };
    }

    weekList.push({
      week: w,
      title: weekMeta.title_ko ? { ko: weekMeta.title_ko, en: weekMeta.title_en } : null,
      note: weekMeta.note_ko ? { ko: weekMeta.note_ko, en: weekMeta.note_en } : null,
      items: weekItems,
      assignments: assignObj,
    });
  }
  return weekList;
}

/** Source curriculum as ordered units of atomic items (canonical order), the input of the distribution engine. */
async function getSourceUnits(db, regionId) {
  const weeks = await getCurriculum(db, regionId);
  return weeks.map(w => {
    const learning = w.items.map(it => ({
      uid: it.uid, unit: w.week, kind: 'learning', text: it.text, page: it.page, link: it.link,
    }));
    const flat = [];
    if (w.assignments) {
      w.assignments.days.forEach(d => {
        const day = d.day.ko.replace('요일', '');
        [['review', d.reviews], ['preview', d.previews], ['vocab', d.vocab]].forEach(([category, list]) => {
          list.forEach((it, i) => flat.push({
            uid: it.uid, unit: w.week, kind: 'assignment', day, category, sort_order: i, text: it.text, link: it.link,
          }));
        });
      });
    }
    return {
      unit: w.week,
      title: w.title,
      note: w.note,
      learning,
      assignments: distributionEngine.orderAssignments(flat),
    };
  });
}

function buildLearningItemRows(items) {
  if (!Array.isArray(items)) throw new ValidationError('학습 내용 목록 형식이 올바르지 않습니다.');
  if (items.length > LIMITS.itemsPerWeek) {
    throw new ValidationError(`학습 내용은 주차당 최대 ${LIMITS.itemsPerWeek}개까지 등록할 수 있습니다.`);
  }
  const rows = [];
  for (const it of items) {
    if (!it || typeof it !== 'object') throw new ValidationError('학습 내용 항목 형식이 올바르지 않습니다.');
    const text = normalizeText(it.text, '학습 내용');
    if (!text.ko) continue; // blank rows are dropped; the remaining order stays contiguous
    rows.push({
      uid: normalizeUid(it.uid, 'L'),
      textKo: text.ko,
      textEn: text.en,
      page: it.page === undefined || it.page === null || it.page === '' ? null : cleanString(String(it.page), LIMITS.page, '페이지'),
      linkJson: normalizeLink(it.link),
    });
  }
  return rows;
}

function normalizeUid(uid, prefix) {
  if (uid === undefined || uid === null || uid === '') return randomUid(prefix);
  if (typeof uid !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(uid)) throw new ValidationError('항목 식별자 형식이 올바르지 않습니다.');
  return uid;
}

function buildAssignmentRows(assignments) {
  if (typeof assignments !== 'object' || !Array.isArray(assignments.days)) {
    throw new ValidationError('과제 데이터 형식이 올바르지 않습니다.');
  }
  const rows = [];
  const seenDays = new Set();
  const groups = [['review', 'reviews'], ['preview', 'previews'], ['vocab', 'vocab']];
  for (const dayObj of assignments.days) {
    if (!dayObj || typeof dayObj !== 'object') throw new ValidationError('과제 요일 형식이 올바르지 않습니다.');
    const rawDay = typeof dayObj.day === 'string' ? dayObj.day : (dayObj.day && dayObj.day.ko);
    const dayName = typeof rawDay === 'string' ? rawDay.replace('요일', '').trim() : '';
    if (!DAY_NAMES.includes(dayName)) throw new ValidationError('과제 요일은 월~금 중 하나여야 합니다.');
    if (seenDays.has(dayName)) throw new ValidationError(`과제 요일이 중복되었습니다: ${dayName}`);
    seenDays.add(dayName);
    for (const [cat, key] of groups) {
      const list = dayObj[key] === undefined || dayObj[key] === null ? [] : dayObj[key];
      if (!Array.isArray(list) || list.length > LIMITS.itemsPerDayCategory) {
        throw new ValidationError('과제 목록 형식이 올바르지 않습니다.');
      }
      let order = 0;
      for (const it of list) {
        if (!it || typeof it !== 'object') throw new ValidationError('과제 항목 형식이 올바르지 않습니다.');
        const text = normalizeText(it.text, '과제 내용');
        if (!text.ko) continue;
        rows.push({ uid: normalizeUid(it.uid, 'A'), dayName, cat, order: order++, textKo: text.ko, textEn: text.en, linkJson: normalizeLink(it.link) });
      }
    }
  }
  return rows;
}

/**
 * Replace one source unit's title/note and (when supplied) its learning items and assignments as ONE atomic batch.
 * Reordering is expressed by sending the items in their new order; positions are re-numbered 0..n-1. Items keep their
 * uid when the client echoes it back. Plan rows of items that no longer exist are dropped in the same batch.
 */
async function updateCurriculumWeek(db, regionId, weekNumber, data, user, auditAction = 'update_curriculum') {
  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 16) {
    throw new ValidationError('주차는 1~16 사이여야 합니다.');
  }
  if (!data || typeof data !== 'object') throw new ValidationError('요청 본문이 올바르지 않습니다.');

  const titleText = normalizeText(data.title, '주차 제목');
  const noteText = normalizeText(data.note, '참고 사항');
  if (titleText.ko.length > LIMITS.title) throw new ValidationError('주차 제목이 너무 깁니다.');
  if (noteText.ko.length > LIMITS.note) throw new ValidationError('참고 사항이 너무 깁니다.');

  const itemRows = data.items === undefined ? undefined : (data.items === null ? [] : buildLearningItemRows(data.items));
  const assignRows = data.assignments === undefined ? undefined : (data.assignments === null ? [] : buildAssignmentRows(data.assignments));

  const seenUids = new Set();
  for (const r of [...(itemRows || []), ...(assignRows || [])]) {
    if (seenUids.has(r.uid)) throw new ValidationError('항목 식별자가 중복되었습니다.');
    seenUids.add(r.uid);
  }

  const beforeWeek = (await getCurriculum(db, regionId)).find(w => w.week === weekNumber);

  const statements = [
    db.prepare(
      `INSERT INTO curriculum_weeks (region_id, week_number, title_ko, title_en, note_ko, note_en, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(region_id, week_number) DO UPDATE SET
         title_ko = excluded.title_ko,
         title_en = excluded.title_en,
         note_ko = excluded.note_ko,
         note_en = excluded.note_en,
         updated_at = CURRENT_TIMESTAMP`
    ).bind(regionId, weekNumber, titleText.ko || null, titleText.en, noteText.ko || null, noteText.en),
  ];

  if (itemRows !== undefined) {
    statements.push(db.prepare("DELETE FROM curriculum_learning_items WHERE region_id = ? AND week_number = ?").bind(regionId, weekNumber));
    itemRows.forEach((r, idx) => {
      statements.push(
        db.prepare(
          `INSERT INTO curriculum_learning_items (uid, region_id, week_number, sort_order, text_ko, text_en, page, link_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(r.uid, regionId, weekNumber, idx, r.textKo, r.textEn, r.page, r.linkJson)
      );
    });
  }

  if (assignRows !== undefined) {
    statements.push(db.prepare("DELETE FROM curriculum_assignment_items WHERE region_id = ? AND week_number = ?").bind(regionId, weekNumber));
    for (const r of assignRows) {
      statements.push(
        db.prepare(
          `INSERT INTO curriculum_assignment_items (uid, region_id, week_number, day_name, category, sort_order, text_ko, text_en, link_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(r.uid, regionId, weekNumber, r.dayName, r.cat, r.order, r.textKo, r.textEn, r.linkJson)
      );
    }
  }

  // No orphans: plan rows whose source item is gone are removed in the same transaction.
  statements.push(db.prepare(
    `DELETE FROM course_plan_items WHERE region_id = ? AND (
       (kind = 'learning' AND item_uid NOT IN (SELECT uid FROM curriculum_learning_items WHERE region_id = ?)) OR
       (kind = 'assignment' AND item_uid NOT IN (SELECT uid FROM curriculum_assignment_items WHERE region_id = ?)))`
  ).bind(regionId, regionId, regionId));

  statements.push(auditStatement(db, regionId, user, auditAction, {
    week: weekNumber,
    before: beforeWeek,
    after: {
      title: titleText.ko || null,
      note: noteText.ko || null,
      itemCount: itemRows === undefined ? null : itemRows.length,
      assignmentCount: assignRows === undefined ? null : assignRows.length,
    },
  }));

  try {
    // All-or-nothing: D1 rolls the whole batch back if any statement (e.g. a UNIQUE violation) fails.
    await runAtomic(db, statements);
  } catch (err) {
    if (isConstraintError(err)) throw new ValidationError('항목 식별자 또는 순서가 충돌하여 저장하지 못했습니다. 페이지를 새로고침해 주세요.');
    throw err;
  }
  return await getCurriculum(db, regionId);
}

/* ---------------- course plan: configuration -> sessions -> distribution ---------------- */

function configFrom(settings, cancellations) {
  return {
    preliminaryMeetingDate: settings.preliminaryMeetingDate || null,
    courseStartDate: settings.courseStartDate || null,
    courseEndDate: settings.courseEndDate || null,
    intervalDays: settings.intervalDays === 14 ? 14 : 7,
    cancellations: cancellations.map(c => ({ date: c.date, reason: c.reason })),
  };
}

/** Fixed key order/shape so configs compare and hash identically no matter who serialised them. */
function normalizeConfig(c) {
  c = c || {};
  return {
    preliminaryMeetingDate: c.preliminaryMeetingDate || null,
    courseStartDate: c.courseStartDate || null,
    courseEndDate: c.courseEndDate || null,
    intervalDays: c.intervalDays === 14 ? 14 : 7,
    cancellations: (c.cancellations || []).map(x => ({ date: x.date, reason: x.reason })),
  };
}

function canonRows(rows) {
  return rows.slice().sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0) || a[2] - b[2] || a[3] - b[3]);
}

function scheduleOf(config) {
  return scheduleEngine.calculateRegionalSchedule(config);
}

async function getActivePlan(db, regionId) {
  const head = await db.prepare(
    "SELECT config_json, session_count, applied_at, applied_by FROM course_plans WHERE region_id = ?"
  ).bind(regionId).first();
  if (!head) return null;
  const rows = (await db.prepare(
    "SELECT kind, item_uid, session_number, position, origin FROM course_plan_items WHERE region_id = ? ORDER BY kind, session_number, position"
  ).bind(regionId).all()).results || [];
  return {
    config: normalizeConfig(parseJson(head.config_json, {})),
    sessionCount: head.session_count,
    appliedAt: head.applied_at,
    appliedBy: head.applied_by,
    items: rows,
  };
}

function planSnapshot(plan) {
  if (!plan) return null;
  return {
    config: plan.config,
    sessionCount: plan.sessionCount,
    items: plan.items.map(r => [r.kind, r.item_uid, r.session_number, r.position, r.origin]),
  };
}

function manualPins(plan) {
  const pins = {};
  if (plan) plan.items.forEach(r => { if (r.origin === 'manual') pins[r.item_uid] = r.session_number; });
  return pins;
}

/** Statements that atomically replace the active plan (header + all item rows). rows: [kind, uid, session, position, origin]. */
function planWriteStatements(db, regionId, config, sessionCount, rows, appliedBy) {
  const statements = [
    db.prepare("DELETE FROM course_plan_items WHERE region_id = ?").bind(regionId),
    db.prepare(
      `INSERT INTO course_plans (region_id, config_json, session_count, applied_at, applied_by)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)
       ON CONFLICT(region_id) DO UPDATE SET
         config_json = excluded.config_json,
         session_count = excluded.session_count,
         applied_at = CURRENT_TIMESTAMP,
         applied_by = excluded.applied_by`
    ).bind(regionId, JSON.stringify(config), sessionCount, appliedBy || null),
  ];
  // Multi-row INSERTs (<= 15 rows x 6 params, under D1's 100-parameter limit) keep the batch small.
  for (let i = 0; i < rows.length; i += 15) {
    const chunk = rows.slice(i, i + 15);
    const params = [];
    chunk.forEach(([kind, uid, session, position, origin]) => params.push(regionId, kind, uid, session, position, origin));
    statements.push(db.prepare(
      'INSERT INTO course_plan_items (region_id, kind, item_uid, session_number, position, origin) VALUES ' +
      chunk.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')
    ).bind(...params));
  }
  return statements;
}

function distributionRows(dist, pins) {
  const rows = [];
  dist.sessions.forEach(s => {
    s.learning.forEach((it, pos) => rows.push(['learning', it.uid, s.session, pos, pins[it.uid] !== undefined ? 'manual' : 'auto']));
    s.assignments.forEach((it, pos) => rows.push(['assignment', it.uid, s.session, pos, pins[it.uid] !== undefined ? 'manual' : 'auto']));
  });
  return rows;
}

function distributeUnits(units, sessionCount, pins) {
  const engineUnits = units.map(u => ({ unit: u.unit, learning: u.learning, assignments: u.assignments }));
  const dist = distributionEngine.distributeCurriculum({ units: engineUnits, sessionCount, pins });
  const problems = distributionEngine.verifyDistribution(engineUnits, dist, pins);
  if (problems.length) throw new Error('Distribution invariant violated: ' + problems.slice(0, 5).join('; '));
  return dist;
}

function itemLookup(units) {
  const lookup = {};
  units.forEach(u => {
    u.learning.forEach(it => { lookup[it.uid] = { kind: 'learning', unit: u.unit, ko: it.text.ko }; });
    u.assignments.forEach(it => { lookup[it.uid] = { kind: 'assignment', unit: u.unit, ko: it.text.ko, day: it.day, category: it.category }; });
  });
  return lookup;
}

/**
 * PREVIEW: what applying the CURRENT configuration would produce. Pure read; nothing is written. `token` binds the
 * proposal (configuration + exact mapping) so apply can refuse if anything changed after the admin looked at it.
 */
async function buildProposal(db, regionId) {
  const [settings, cancellations, units, active] = await Promise.all([
    getRegionalSettings(db, regionId),
    getCancellations(db, regionId),
    getSourceUnits(db, regionId),
    getActivePlan(db, regionId),
  ]);
  const config = configFrom(settings, cancellations);
  const schedule = scheduleOf(config);
  const pins = manualPins(active);
  const sessionDates = schedule.slots.filter(s => s.type === 'instructional').map(s => s.date);

  let dist = null;
  let sessions = [];
  if (schedule.status === 'configured' && schedule.instructionalSessions > 0) {
    dist = distributeUnits(units, schedule.instructionalSessions, pins);
    sessions = dist.sessions.map(s => ({
      session: s.session,
      date: sessionDates[s.session - 1],
      units: s.units,
      learning: s.learning.map(it => it.uid),
      assignments: s.assignments.map(it => it.uid),
    }));
  }

  const rows = dist ? distributionRows(dist, pins) : [];
  const activeRows = active ? active.items.map(r => [r.kind, r.item_uid, r.session_number, r.position, r.origin]) : [];
  const sameMapping = !!active && JSON.stringify(canonRows(activeRows)) === JSON.stringify(canonRows(rows)) &&
    JSON.stringify(active.config) === JSON.stringify(config);
  const token = await sha256Hex(JSON.stringify({ config, rows, count: schedule.instructionalSessions }));

  return {
    token,
    config,
    schedule: {
      status: schedule.status,
      errors: schedule.errors,
      calendarOpportunities: schedule.calendarOpportunities,
      cancellationCount: schedule.cancellationCount,
      instructionalSessions: schedule.instructionalSessions,
      completionDate: schedule.completionDate,
      unalignedCancellations: schedule.unalignedCancellations,
      preCourseCancellations: schedule.preCourseCancellations,
      postCourseCancellations: schedule.postCourseCancellations,
      slots: schedule.slots.map(s => ({ type: s.type, date: s.date, session: s.session, reason: s.reason })),
    },
    previous: active ? { sessionCount: active.sessionCount, appliedAt: active.appliedAt, appliedBy: active.appliedBy, config: active.config } : null,
    proposed: { status: dist ? 'ok' : (schedule.status === 'configured' ? 'no-sessions' : schedule.status), sessionCount: schedule.instructionalSessions, sessions },
    clampedPins: dist ? dist.clampedPins : [],
    changed: !sameMapping,
    canApply: !!dist,
    items: itemLookup(units),
  };
}

/** Active plan expanded for display/consumption: sessions with item uids; unplaced (new) source items ride in the last session. */
async function resolveActivePlan(db, regionId, units) {
  const active = await getActivePlan(db, regionId);
  if (!active) return null;
  const src = units || await getSourceUnits(db, regionId);
  const schedule = scheduleOf(active.config);
  const dates = schedule.slots.filter(s => s.type === 'instructional').map(s => s.date);
  const sessions = [];
  for (let n = 1; n <= active.sessionCount; n++) {
    sessions.push({ session: n, date: dates[n - 1] || null, learning: [], assignments: [] });
  }
  const placed = { learning: new Set(), assignment: new Set() };
  active.items.forEach(r => {
    const s = sessions[r.session_number - 1];
    if (!s) return; // cannot happen with a consistent plan; ignored rather than crashing the public page
    (r.kind === 'learning' ? s.learning : s.assignments).push({ uid: r.item_uid, position: r.position });
    placed[r.kind].add(r.item_uid);
  });
  sessions.forEach(s => {
    s.learning = s.learning.sort((a, b) => a.position - b.position).map(x => x.uid);
    s.assignments = s.assignments.sort((a, b) => a.position - b.position).map(x => x.uid);
  });
  const unplaced = { learning: [], assignments: [] };
  src.forEach(u => {
    u.learning.forEach(it => { if (!placed.learning.has(it.uid)) unplaced.learning.push(it.uid); });
    u.assignments.forEach(it => { if (!placed.assignment.has(it.uid)) unplaced.assignments.push(it.uid); });
  });
  if (sessions.length) {
    const last = sessions[sessions.length - 1];
    last.learning = last.learning.concat(unplaced.learning);
    last.assignments = last.assignments.concat(unplaced.assignments);
  }
  return {
    config: active.config,
    sessionCount: active.sessionCount,
    appliedAt: active.appliedAt,
    appliedBy: active.appliedBy,
    manualPins: manualPins(active),
    unplaced,
    sessions,
  };
}

/** Everything the admin UI needs in one call. */
async function getPlanState(db, regionId) {
  const proposal = await buildProposal(db, regionId);
  const units = await getSourceUnits(db, regionId);
  const active = await resolveActivePlan(db, regionId, units);
  return { proposal, active };
}

/** Public, read-only payload for the regional site (source + live configuration + active plan). */
async function getPublicPlan(db, regionId) {
  const [settings, cancellations, units] = await Promise.all([
    getRegionalSettings(db, regionId),
    getCancellations(db, regionId),
    getSourceUnits(db, regionId),
  ]);
  const active = await resolveActivePlan(db, regionId, units);
  const config = configFrom(settings, cancellations);
  const configured = !!(active ? active.config.courseStartDate && active.config.courseEndDate : config.courseStartDate && config.courseEndDate);
  return {
    region: regionId,
    status: configured ? 'configured' : 'unconfigured',
    config: active ? active.config : config,
    plan: active ? { sessionCount: active.sessionCount, appliedAt: active.appliedAt, sessions: active.sessions, unplaced: active.unplaced } : null,
    source: {
      units: units.map(u => ({
        unit: u.unit,
        title: u.title,
        note: u.note,
        learning: u.learning.map(it => ({ uid: it.uid, text: it.text, page: it.page, link: it.link })),
        assignments: u.assignments.map(it => ({ uid: it.uid, day: it.day, category: it.category, text: it.text, link: it.link })),
      })),
    },
  };
}

/** EXPLICIT APPLY: recompute the proposal, require the preview token, then replace the active plan atomically. */
async function applyPlan(db, regionId, body, user) {
  if (!body || typeof body !== 'object' || typeof body.token !== 'string') {
    throw new ValidationError('적용하려면 미리보기 확인 토큰이 필요합니다.');
  }
  const proposal = await buildProposal(db, regionId);
  if (body.token !== proposal.token) {
    throw new ValidationError('미리보기 이후 설정이 변경되었습니다. 미리보기를 다시 확인한 뒤 적용해 주세요.', 409);
  }
  if (proposal.schedule.status === 'invalid') {
    throw new ValidationError(PERIOD_ERRORS[proposal.schedule.errors[0]] || '과정 기간이 올바르지 않습니다.');
  }
  if (!proposal.canApply) {
    throw new ValidationError('수업 일정이 설정되지 않았거나 수업 가능한 회차가 없어 재배정할 수 없습니다.');
  }

  const active = await getActivePlan(db, regionId);
  const units = await getSourceUnits(db, regionId);
  const pins = manualPins(active);
  const dist = distributeUnits(units, proposal.proposed.sessionCount, pins);

  await runAtomic(db, [
    ...planWriteStatements(db, regionId, proposal.config, proposal.proposed.sessionCount, distributionRows(dist, pins), user && user.username),
    auditStatement(db, regionId, user, 'apply_plan', {
      before: planSnapshot(active),
      after: { config: proposal.config, sessionCount: proposal.proposed.sessionCount },
      previousSessionCount: active ? active.sessionCount : null,
      newSessionCount: proposal.proposed.sessionCount,
    }),
  ]);
  return await getPlanState(db, regionId);
}

/**
 * Administrator override: pin an item to a session (or unpin with session = null). The remaining items are
 * redistributed automatically around the pins using the ACTIVE plan's configuration.
 */
async function setPlanPin(db, regionId, body, user) {
  if (!body || typeof body.uid !== 'string') throw new ValidationError('항목 식별자가 필요합니다.');
  const active = await getActivePlan(db, regionId);
  if (!active) throw new ValidationError('먼저 재배정을 적용해야 회차를 지정할 수 있습니다.');
  const units = await getSourceUnits(db, regionId);
  if (!itemLookup(units)[body.uid]) throw notFound('해당 항목을 찾을 수 없습니다.');

  const pins = manualPins(active);
  if (body.session === null || body.session === undefined) {
    delete pins[body.uid];
  } else {
    const s = Number(body.session);
    if (!Number.isInteger(s) || s < 1 || s > active.sessionCount) {
      throw new ValidationError(`회차는 1~${active.sessionCount} 사이여야 합니다.`);
    }
    pins[body.uid] = s;
  }
  const dist = distributeUnits(units, active.sessionCount, pins);
  await runAtomic(db, [
    ...planWriteStatements(db, regionId, active.config, active.sessionCount, distributionRows(dist, pins), user && user.username),
    auditStatement(db, regionId, user, 'update_plan_pin', {
      before: planSnapshot(active),
      after: { uid: body.uid, session: body.session === undefined ? null : body.session },
    }),
  ]);
  return await getPlanState(db, regionId);
}

/** Restore a prior plan snapshot: draft configuration (settings + cancellations) and plan rows, one transaction. */
async function restorePlanSnapshot(db, regionId, snapshot, user, auditDetails, restoreDraft) {
  const statements = [];
  if (snapshot) {
    const c = normalizeConfig(snapshot.config);
    if (restoreDraft) statements.push(
      db.prepare(
        `INSERT INTO regional_settings (region_id, preliminary_meeting_date, course_start_date, course_end_date, interval_days, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(region_id) DO UPDATE SET
           preliminary_meeting_date = excluded.preliminary_meeting_date,
           course_start_date = excluded.course_start_date,
           course_end_date = excluded.course_end_date,
           interval_days = excluded.interval_days,
           updated_at = CURRENT_TIMESTAMP`
      ).bind(regionId, c.preliminaryMeetingDate || null, c.courseStartDate || null, c.courseEndDate || null, c.intervalDays === 14 ? 14 : 7),
      db.prepare("DELETE FROM class_cancellations WHERE region_id = ?").bind(regionId)
    );
    if (restoreDraft) (c.cancellations || []).forEach(x => statements.push(
      db.prepare("INSERT INTO class_cancellations (region_id, date, reason) VALUES (?, ?, ?)").bind(regionId, x.date, x.reason)
    ));
    // Only items that still exist in the source can be re-placed (no orphans).
    const units = await getSourceUnits(db, regionId);
    const lookup = itemLookup(units);
    const rows = snapshot.items.filter(r => lookup[r[1]]);
    statements.push(...planWriteStatements(db, regionId, c, snapshot.sessionCount, rows, user && user.username));
  } else {
    statements.push(
      db.prepare("DELETE FROM course_plan_items WHERE region_id = ?").bind(regionId),
      db.prepare("DELETE FROM course_plans WHERE region_id = ?").bind(regionId)
    );
  }
  statements.push(auditStatement(db, regionId, user, 'restore_version', auditDetails));
  await runAtomic(db, statements);
}

/* ---------------- audit / restore ---------------- */

async function getAuditLogs(db, regionId, limit = 50) {
  const n = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
  const result = await db.prepare(
    "SELECT id, region_id, user_id, username, action, details, created_at FROM audit_logs WHERE region_id = ? ORDER BY created_at DESC, id DESC LIMIT ?"
  ).bind(regionId, n).all();
  return result.results || [];
}

/**
 * Undo one logged change. Supported: update_settings, add/update/delete_cancellation, update_curriculum,
 * apply_plan, update_plan_pin. Restores go through the normal validated/atomic writers and are audited as `restore_version`.
 * Restoring apply_plan / update_plan_pin brings back the previous configuration AND distribution together.
 */
async function restoreAuditSnapshot(db, regionId, logId, user) {
  const log = await db.prepare(
    "SELECT id, action, details FROM audit_logs WHERE id = ? AND region_id = ?"
  ).bind(logId, regionId).first();
  if (!log) throw notFound('해당 이력을 찾을 수 없습니다.');

  const details = parseJson(log.details);
  if (!details) throw new ValidationError('이 기록은 복구할 수 없습니다.');

  switch (log.action) {
    case 'update_settings': {
      if (!details.before) throw new ValidationError('이 기록에는 이전 복구 스냅샷이 존재하지 않습니다.');
      await updateRegionalSettings(db, regionId, details.before, user, 'restore_version');
      break;
    }
    case 'add_cancellation': {
      const added = details.added;
      if (!added || !added.date) throw new ValidationError('이 기록에는 이전 복구 스냅샷이 존재하지 않습니다.');
      const row = await db.prepare("SELECT id FROM class_cancellations WHERE region_id = ? AND date = ?").bind(regionId, added.date).first();
      if (!row) throw new ValidationError('이미 삭제된 휴강 일자입니다.');
      await deleteCancellation(db, regionId, row.id, user, 'restore_version');
      break;
    }
    case 'delete_cancellation': {
      const deleted = details.deleted;
      if (!deleted || !deleted.date) throw new ValidationError('이 기록에는 이전 복구 스냅샷이 존재하지 않습니다.');
      await addCancellation(db, regionId, { date: deleted.date, reason: deleted.reason }, user, 'restore_version');
      break;
    }
    case 'update_cancellation': {
      const before = details.before;
      if (!before || !before.date) throw new ValidationError('이 기록에는 이전 복구 스냅샷이 존재하지 않습니다.');
      const row = await db.prepare("SELECT id FROM class_cancellations WHERE id = ? AND region_id = ?").bind(before.id, regionId).first();
      if (row) {
        await updateCancellation(db, regionId, row.id, { date: before.date, reason: before.reason }, user, 'restore_version');
      } else {
        await addCancellation(db, regionId, { date: before.date, reason: before.reason }, user, 'restore_version');
      }
      break;
    }
    case 'update_curriculum': {
      if (!details.week || !details.before) throw new ValidationError('이 기록에는 이전 복구 스냅샷이 존재하지 않습니다.');
      const b = details.before;
      await updateCurriculumWeek(db, regionId, details.week, {
        title: b.title, note: b.note, items: b.items || [], assignments: b.assignments || null,
      }, user, 'restore_version');
      break;
    }
    case 'apply_plan':
    case 'update_plan_pin': {
      if (!Object.prototype.hasOwnProperty.call(details, 'before')) {
        throw new ValidationError('이 기록에는 이전 복구 스냅샷이 존재하지 않습니다.');
      }
      const restoredCount = details.before ? details.before.sessionCount : null;
      await restorePlanSnapshot(db, regionId, details.before, user, {
        restoredFromLogId: logId,
        action: log.action,
        restoredSessionCount: restoredCount,
      }, log.action === 'apply_plan');
      break;
    }
    default:
      throw new ValidationError('이 유형의 기록은 복구할 수 없습니다.');
  }

  return { success: true, restoredAction: log.action };
}

module.exports = {
  ValidationError,
  DAY_NAMES,
  ASSIGNMENT_CATEGORIES,
  isRealIsoDate,
  getRegionalSettings,
  updateRegionalSettings,
  getCancellations,
  addCancellation,
  updateCancellation,
  deleteCancellation,
  getCurriculum,
  getSourceUnits,
  updateCurriculumWeek,
  getActivePlan,
  buildProposal,
  getPlanState,
  getPublicPlan,
  applyPlan,
  setPlanPin,
  getAuditLogs,
  restoreAuditSnapshot,
  logAudit,
};
