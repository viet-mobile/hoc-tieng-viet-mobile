// -*- coding: utf-8 -*-
/**
 * Regional admin single-page client (runs in the browser; embedded into /admin by admin_ui.js).
 *
 * - Globals provided by admin_ui.js before this file: window.__ADMIN_BOOT ({regionId, regionName, csrfToken})
 *   and calculateRegionalSchedule() (the SAME function the public site uses, from schedule_engine.js).
 * - No inline event handlers: everything is wired through delegated listeners (data-act / data-f),
 *   so the page can run under a nonce-only script CSP.
 * - Every string that comes from the server or the user goes through esc() before it is put in HTML.
 * - Every state-changing request carries X-CSRF-Token.
 */
(function () {
  'use strict';

  var boot = window.__ADMIN_BOOT || {};
  var DAYS = ['월', '화', '수', '목', '금'];
  var CATS = [['reviews', '복습'], ['previews', '예습'], ['vocab', '어휘']];
  var ACTION_LABELS = {
    update_settings: '기본 일정 변경',
    add_cancellation: '휴강 추가',
    update_cancellation: '휴강 수정',
    delete_cancellation: '휴강 삭제',
    update_curriculum: '원본 커리큘럼 수정',
    apply_plan: '회차 배정 적용',
    update_plan_pin: '항목 회차 지정',
    restore_version: '이전 버전 복구'
  };
  var RESTORABLE = { update_settings: 1, add_cancellation: 1, update_cancellation: 1, delete_cancellation: 1, update_curriculum: 1, apply_plan: 1, update_plan_pin: 1 };

  var state = {
    user: null,
    tab: 'schedule',
    settings: null,
    cancellations: [],
    curriculum: [],
    week: 1,
    edit: null,
    dirty: false,
    editingCancel: null,
    plan: null
  };

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function $(id) { return document.getElementById(id); }

  var toastTimer = null;
  function toast(msg, isError) {
    var el = $(isError ? 'toast-error' : 'toast-success');
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.display = 'none'; }, 3500);
  }

  function api(method, url, body) {
    var opts = { method: method, headers: {}, credentials: 'same-origin' };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    if (method !== 'GET' && boot.csrfToken) opts.headers['X-CSRF-Token'] = boot.csrfToken;
    return fetch(url, opts).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        return { ok: res.ok, status: res.status, data: data };
      });
    });
  }

  function errText(r, fallback) {
    return (r && r.data && r.data.error) || fallback;
  }

  /* ---------------- bootstrap / auth ---------------- */

  function init() {
    api('GET', '/api/auth/me').then(function (r) {
      if (!r.ok) { renderLogin(); return; }
      state.user = r.data.user;
      if (r.data.csrfToken) boot.csrfToken = r.data.csrfToken;
      $('user-info').textContent = state.user.username + ' 관리자님';
      $('logout-btn').style.display = 'inline-block';
      return loadData().then(renderApp);
    }).catch(renderLogin);
  }

  function loadData() {
    return Promise.all([
      api('GET', '/api/admin/schedule'),
      api('GET', '/api/admin/curriculum'),
      api('GET', '/api/admin/plan')
    ]).then(function (rs) {
      if (rs[0].ok) {
        state.settings = rs[0].data.settings;
        state.cancellations = rs[0].data.cancellations || [];
      }
      if (rs[1].ok) state.curriculum = rs[1].data;
      if (rs[2].ok) state.plan = rs[2].data;
      resetEdit();
    });
  }

  function renderLogin() {
    $('user-info').textContent = '';
    $('logout-btn').style.display = 'none';
    $('app-container').innerHTML =
      '<div class="login-box">' +
      '<h2 style="font-size:20px;font-weight:800;margin-bottom:8px;text-align:center;">' + esc(boot.regionName) + ' 관리자 로그인</h2>' +
      '<p style="color:var(--ink-soft);font-size:13px;margin-bottom:20px;text-align:center;">' + esc(boot.regionName) + ' 지역 관리 권한을 가진 계정으로 로그인하세요.</p>' +
      '<form id="login-form">' +
      '<div class="form-group"><label for="login-username">아이디</label><input type="text" id="login-username" class="form-control" required autocomplete="username"></div>' +
      '<div class="form-group"><label for="login-password">비밀번호</label><input type="password" id="login-password" class="form-control" required autocomplete="current-password"></div>' +
      '<button type="submit" class="btn btn-primary" style="width:100%;padding:10px;margin-top:10px;">로그인</button>' +
      '</form></div>';
  }

  function handleLogin(form) {
    var u = $('login-username').value.trim();
    var p = $('login-password').value;
    api('POST', '/api/auth/login', { username: u, password: p }).then(function (r) {
      if (r.ok) {
        if (r.data.csrfToken) boot.csrfToken = r.data.csrfToken;
        toast('로그인되었습니다.');
        init();
      } else {
        toast(errText(r, '로그인 실패'), true);
      }
    }).catch(function () { toast('서버 연결 실패', true); });
  }

  function handleLogout() {
    api('POST', '/api/auth/logout').then(function () { location.reload(); });
  }

  /* ---------------- layout ---------------- */

  var TABS = [
    ['schedule', 'SECTION A — 수업 기간'],
    ['cancellations', 'SECTION B — 휴강 관리'],
    ['curriculum', 'SECTION C — 원본 커리큘럼'],
    ['plan', 'SECTION D — 회차 배정'],
    ['audit', 'SECTION E — 변경 이력 & 복구']
  ];

  function renderApp() {
    var nav = TABS.map(function (t) {
      return '<button type="button" class="tab-item' + (state.tab === t[0] ? ' active' : '') + '" data-act="tab" data-tab="' + t[0] + '">' + esc(t[1]) + '</button>';
    }).join('');
    $('app-container').innerHTML = pendingBanner() + '<nav class="tabs-nav">' + nav + '</nav><div id="tab-content"></div>';
    renderTab();
  }

  function renderTab() {
    var c = $('tab-content');
    if (!c) return;
    if (state.tab === 'schedule') renderSchedule(c);
    else if (state.tab === 'cancellations') renderCancellations(c);
    else if (state.tab === 'curriculum') renderCurriculum(c);
    else if (state.tab === 'plan') renderPlan(c);
    else if (state.tab === 'audit') renderAudit(c);
  }

  function pendingBanner() {
    var pr = state.plan && state.plan.proposal;
    if (!pr || !pr.changed || !pr.canApply) return '';
    return '<div class="unconfigured-banner"><div><strong>적용되지 않은 일정/배정 변경</strong>이 있습니다. 공개 사이트에는 아직 반영되지 않았습니다. ' +
      '<a href="#" data-act="tab" data-tab="plan">SECTION D — 회차 배정</a>에서 미리보기를 확인한 뒤 적용하세요.</div></div>';
  }

  function confirmDiscard() {
    if (!state.dirty) return true;
    if (window.confirm('저장하지 않은 변경사항이 있습니다. 버리고 이동할까요?')) { state.dirty = false; return true; }
    return false;
  }

  /* ---------------- SECTION A: course period ---------------- */

  function formValues() {
    var iv = $('sett-interval');
    return {
      preliminaryMeetingDate: ($('sett-prelim') && $('sett-prelim').value) || null,
      courseStartDate: ($('sett-start') && $('sett-start').value) || null,
      courseEndDate: ($('sett-end') && $('sett-end').value) || null,
      intervalDays: iv ? Number(iv.value) : 7
    };
  }

  function scheduleWith(values) {
    return calculateRegionalSchedule({
      preliminaryMeetingDate: values.preliminaryMeetingDate,
      courseStartDate: values.courseStartDate,
      courseEndDate: values.courseEndDate,
      intervalDays: values.intervalDays,
      cancellations: state.cancellations
    });
  }

  var PERIOD_MESSAGES = {
    'end-before-start': '종료일이 시작일보다 빠릅니다.',
    'too-long': '기간이 너무 깁니다 (수업 기회 최대 200회).',
    'bad-date': '날짜 형식이 올바르지 않습니다.'
  };

  /** Derived numbers only: nothing here is typed in, and the cancellation count comes from the actual records. */
  function summaryHtml(values) {
    var sch = scheduleWith(values);
    if (sch.status === 'unconfigured') {
      return '<div class="preview-box" style="color:var(--ink-faint);">시작일과 종료일을 입력하면 수업 회차가 자동으로 계산됩니다. (일정 미정)</div>';
    }
    if (sch.status === 'invalid') {
      return '<div class="preview-box" style="color:var(--danger);">' + esc(PERIOD_MESSAGES[sch.errors[0]] || '수업 기간이 올바르지 않습니다.') + '</div>';
    }
    var ignored = sch.unalignedCancellations.length + sch.preCourseCancellations.length + sch.postCourseCancellations.length;
    return '<div class="preview-box"><div style="font-weight:700;margin-bottom:8px;color:var(--primary);">자동 계산 결과</div>' +
      '<table class="table"><tbody>' +
      '<tr><th>수업 기간</th><td>' + esc(sch.courseStartDate) + ' ~ ' + esc(sch.courseEndDate) + ' (' + (sch.intervalDays === 14 ? '격주' : '매주') + ')</td></tr>' +
      '<tr><th>달력상 수업 기회</th><td>' + sch.calendarOpportunities + '회</td></tr>' +
      '<tr><th>휴강 횟수</th><td>' + sch.cancellationCount + '회' + (ignored ? ' <span class="help-text">(수업 일정에 해당하지 않아 반영되지 않은 휴강 ' + ignored + '건 별도)</span>' : '') + '</td></tr>' +
      '<tr><th>실제 수업 회차</th><td><strong>' + sch.instructionalSessions + '회</strong>' + (sch.completionDate ? ' (마지막 수업 ' + esc(sch.completionDate) + ')' : '') + '</td></tr>' +
      '</tbody></table></div>';
  }

  function renderSchedule(c) {
    var s = state.settings || {};
    var banner = (s.courseStartDate && s.courseEndDate) ? '' :
      '<div class="unconfigured-banner"><div>현재 <strong>일정 미정</strong> 상태입니다. 시작일과 종료일이 설정되기 전까지 공개 사이트에는 날짜가 표시되지 않고 \'일정 미정\'이 유지됩니다.</div></div>';
    c.innerHTML = banner +
      '<div class="card"><div class="card-title">수업 기간 설정</div>' +
      '<form id="settings-form">' +
      '<div class="form-group"><label for="sett-prelim">예비 모임 일자</label><input type="date" id="sett-prelim" class="form-control" value="' + esc(s.preliminaryMeetingDate || '') + '">' +
      '<div class="help-text">수업 시작 전 예비 모임 날짜. 미정이면 비워두세요. 과정 시작일보다 늦을 수 없습니다.</div></div>' +
      '<div class="form-group"><label for="sett-start">과정 시작일 (첫 수업일)</label><input type="date" id="sett-start" class="form-control" value="' + esc(s.courseStartDate || '') + '"></div>' +
      '<div class="form-group"><label for="sett-end">과정 종료일 (마지막 수업 가능일)</label><input type="date" id="sett-end" class="form-control" value="' + esc(s.courseEndDate || '') + '">' +
      '<div class="help-text">수업 회차(예: 16주)를 직접 입력하지 않습니다. 시작일~종료일과 휴강일로 회차가 자동 계산되고, 전체 학습 분량이 그 회차에 맞게 배분됩니다.</div></div>' +
      '<div class="form-group"><label for="sett-interval">수업 주기</label><select id="sett-interval" class="form-control">' +
      '<option value="7"' + (s.intervalDays !== 14 ? ' selected' : '') + '>매주 (시작일과 같은 요일)</option>' +
      '<option value="14"' + (s.intervalDays === 14 ? ' selected' : '') + '>격주</option></select></div>' +
      '<div class="form-group"><label for="sett-weekday">수업 요일 / 설명</label><input type="text" id="sett-weekday" class="form-control" maxlength="40" value="' + esc(s.meetingWeekday || '매주 토요일') + '"></div>' +
      '<div id="course-summary">' + summaryHtml(formValuesFrom(s)) + '</div>' +
      '<p class="help-text" style="margin:10px 0;">저장하면 설정만 바뀝니다. 공개 사이트의 회차 배정은 <strong>SECTION D — 회차 배정</strong>에서 미리보기를 확인하고 \'적용\'해야 바뀝니다.</p>' +
      '<button type="submit" class="btn btn-primary">설정 저장</button></form></div>';
  }

  function formValuesFrom(s) {
    return { preliminaryMeetingDate: s.preliminaryMeetingDate || null, courseStartDate: s.courseStartDate || null, courseEndDate: s.courseEndDate || null, intervalDays: s.intervalDays === 14 ? 14 : 7 };
  }

  function refreshSummary() {
    var box = $('course-summary');
    if (box) box.innerHTML = summaryHtml(formValues());
  }

  function saveSettings() {
    var cur = state.settings || {};
    var v = formValues();
    api('PUT', '/api/admin/settings', {
      preliminaryMeetingDate: v.preliminaryMeetingDate,
      courseStartDate: v.courseStartDate,
      courseEndDate: v.courseEndDate,
      intervalDays: v.intervalDays,
      meetingWeekday: $('sett-weekday').value || '매주 토요일',
      welcomeTitle: cur.welcomeTitle || null,
      welcomeBody: cur.welcomeBody || null
    }).then(function (r) {
      if (r.ok) { toast('수업 기간이 저장되었습니다. 회차 배정은 미리보기 후 적용해 주세요.'); return reloadAll(); }
      toast(errText(r, '저장 실패'), true);
    }).catch(function () { toast('요청 중 오류가 발생했습니다.', true); });
  }

  function reloadAll() {
    return loadData().then(renderApp);
  }

  /* ---------------- SECTION B: cancellations ---------------- */

  function scheduleFor(s) {
    return scheduleWith(formValuesFrom(s));
  }

  function cancellationStatus(sch) {
    var flagged = {};
    sch.unalignedCancellations.forEach(function (x) { flagged[x.date] = '수업 일정(요일/주기)에 해당하지 않아 무시됨'; });
    sch.preCourseCancellations.forEach(function (x) { flagged[x.date] = '과정 시작일 이전이라 무시됨'; });
    sch.postCourseCancellations.forEach(function (x) { flagged[x.date] = '과정 종료일 이후라 무시됨'; });
    return flagged;
  }

  function renderCancellations(c) {
    var s = state.settings || {};
    var cancels = state.cancellations || [];
    var flagged = cancellationStatus(scheduleFor(s));
    var rows = cancels.map(function (x) {
      if (state.editingCancel === x.id) {
        return '<tr><td><input type="date" class="form-control" id="cedit-date" value="' + esc(x.date) + '"></td>' +
          '<td><input type="text" class="form-control" id="cedit-reason" maxlength="200" value="' + esc(x.reason) + '"></td>' +
          '<td><button type="button" class="btn btn-primary move-btn" data-act="cancel-save" data-id="' + x.id + '">저장</button> ' +
          '<button type="button" class="btn move-btn" data-act="cancel-edit-stop">취소</button></td></tr>';
      }
      return '<tr><td><strong>' + esc(x.date) + '</strong>' + (flagged[x.date] ? '<div class="help-text" style="color:var(--danger);">' + esc(flagged[x.date]) + '</div>' : '') + '</td><td>' + esc(x.reason) + '</td>' +
        '<td><button type="button" class="btn move-btn" data-act="cancel-edit" data-id="' + x.id + '">수정</button> ' +
        '<button type="button" class="btn btn-danger move-btn" data-act="cancel-delete" data-id="' + x.id + '">삭제</button></td></tr>';
    }).join('');

    var preview;
    var sch = scheduleFor(s);
    if (sch.status === 'configured') {
      preview = summaryHtml(formValuesFrom(s)) +
        '<div class="preview-box"><div style="font-weight:700;margin-bottom:6px;color:var(--primary);">회차 자동 재계산 미리보기</div>' +
        '<div class="preview-timeline">' + sch.slots.map(function (slot) {
          return slot.type === 'cancellation'
            ? '<div class="preview-item cancellation"><span>' + esc(slot.date) + ' [휴강]</span><span>' + esc(slot.reason) + '</span></div>'
            : '<div class="preview-item"><span>' + esc(slot.date) + '</span><span>' + slot.session + '회차</span></div>';
        }).join('') + '</div></div>';
    } else {
      preview = '<div class="preview-box" style="color:var(--ink-faint);">수업 기간(시작일·종료일)이 설정되지 않아 일정을 미리볼 수 없습니다. SECTION A에서 먼저 입력해주세요.</div>';
    }

    c.innerHTML =
      '<div class="card"><div class="card-title">휴강 추가</div>' +
      '<form id="cancel-form" style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;">' +
      '<div class="form-group" style="margin-bottom:0;flex:1;min-width:180px;"><label for="cancel-date">휴강 일자</label><input type="date" id="cancel-date" class="form-control" required></div>' +
      '<div class="form-group" style="margin-bottom:0;flex:2;min-width:240px;"><label for="cancel-reason">휴강 사유 (필수)</label><input type="text" id="cancel-reason" class="form-control" maxlength="200" placeholder="예: 순회대회, 명절, 방학 등" required></div>' +
      '<button type="submit" class="btn btn-primary" style="height:38px;">휴강 추가</button></form>' +
      '<div class="help-text">휴강 일자는 수업 기간 안의 실제 수업일(시작일과 같은 요일/주기)이어야 하며 같은 날짜를 두 번 등록할 수 없습니다. 휴강은 수업 기회는 소모하지만 학습 진도는 소모하지 않습니다. 휴강 횟수는 이 목록에서 자동으로 계산됩니다.</div></div>' +
      '<div class="card"><div class="card-title">등록된 휴강 목록</div>' +
      (cancels.length === 0 ? '<p style="color:var(--ink-faint);">등록된 휴강 일자가 없습니다.</p>' :
        '<table class="table"><thead><tr><th>일자</th><th>사유</th><th>관리</th></tr></thead><tbody>' + rows + '</tbody></table>') +
      preview + '</div>';
  }

  function addCancellation() {
    api('POST', '/api/admin/cancellations', { date: $('cancel-date').value, reason: $('cancel-reason').value.trim() }).then(function (r) {
      if (r.ok) { toast('휴강 일자가 추가되었습니다. 회차 수가 자동 재계산되었습니다 (배정은 SECTION D에서 적용).'); return reloadAll(); }
      toast(errText(r, '추가 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  function saveCancellationEdit(id) {
    api('PUT', '/api/admin/cancellations/' + id, { date: $('cedit-date').value, reason: $('cedit-reason').value.trim() }).then(function (r) {
      if (r.ok) { state.editingCancel = null; toast('휴강 정보가 수정되었습니다.'); return reloadAll(); }
      toast(errText(r, '수정 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  function deleteCancellation(id) {
    if (!window.confirm('이 휴강 일자를 삭제하시겠습니까? 삭제 시 이후 일정이 다시 앞당겨집니다.')) return;
    api('DELETE', '/api/admin/cancellations/' + id).then(function (r) {
      if (r.ok) { toast('휴강 일자가 삭제되었습니다.'); return reloadAll(); }
      toast(errText(r, '삭제 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  /* ---------------- SECTION C: curriculum ---------------- */

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function normText(t) {
    if (typeof t === 'string') return { ko: t, en: null };
    return { ko: (t && t.ko) || '', en: (t && t.en) || null };
  }

  /** Working copy of the selected week. Keeps each item's link and (unchanged) English text. */
  function resetEdit() {
    var w = (state.curriculum || []).filter(function (x) { return x.week === state.week; })[0] || { week: state.week };
    var days = DAYS.map(function (d) {
      var src = ((w.assignments && w.assignments.days) || []).filter(function (x) {
        return x.day && x.day.ko && x.day.ko.replace('요일', '') === d;
      })[0] || {};
      var out = { day: d };
      CATS.forEach(function (cat) {
        out[cat[0]] = (src[cat[0]] || []).map(function (it) {
          return { uid: it.uid, text: normText(it.text), link: it.link || null, _ko: normText(it.text).ko };
        });
      });
      return out;
    });
    state.edit = {
      title: normText(w.title),
      note: normText(w.note),
      items: (w.items || []).map(function (it) {
        return { uid: it.uid, text: normText(it.text), page: it.page || '', link: it.link || null, _ko: normText(it.text).ko };
      }),
      days: days
    };
    state.dirty = false;
  }

  function rowHtml(kind, idx, it, extra) {
    var attrs = ' data-i="' + idx + '"' + (extra || '');
    var page = kind === 'item'
      ? '<input type="text" class="form-control" style="max-width:100px;" data-f="item-page"' + attrs + ' value="' + esc(it.page || '') + '" placeholder="페이지" maxlength="100" aria-label="페이지">'
      : '';
    return '<div class="item-row">' +
      '<input type="text" class="form-control" data-f="' + kind + '-text"' + attrs + ' value="' + esc(it.text.ko) + '" maxlength="1000" placeholder="내용" aria-label="내용">' +
      page +
      '<button type="button" class="btn move-btn" data-act="' + kind + '-up"' + attrs + ' aria-label="위로 이동">▲</button>' +
      '<button type="button" class="btn move-btn" data-act="' + kind + '-down"' + attrs + ' aria-label="아래로 이동">▼</button>' +
      '<button type="button" class="btn btn-danger move-btn" data-act="' + kind + '-del"' + attrs + ' aria-label="삭제">✕</button></div>';
  }

  function renderCurriculum(c) {
    var e = state.edit;
    var nav = '<div class="week-nav-grid">';
    for (var w = 1; w <= 16; w++) {
      nav += '<button type="button" class="week-nav-btn' + (w === state.week ? ' active' : '') + '" data-act="week" data-w="' + w + '">' + w + '주</button>';
    }
    nav += '</div>';

    var items = e.items.map(function (it, i) { return rowHtml('item', i, it); }).join('') ||
      '<p style="color:var(--ink-faint);font-size:13px;">등록된 학습 내용이 없습니다.</p>';

    var assign = e.days.map(function (day, di) {
      var cats = CATS.map(function (cat) {
        var list = day[cat[0]].map(function (it, i) {
          return rowHtml('a', i, it, ' data-d="' + di + '" data-c="' + cat[0] + '"');
        }).join('');
        return '<div style="margin:8px 0 10px 8px;"><div style="font-weight:600;font-size:12px;color:var(--ink-soft);margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;">' +
          '<span>' + cat[1] + '</span><button type="button" class="btn move-btn" data-act="a-add" data-d="' + di + '" data-c="' + cat[0] + '">+ 추가</button></div>' + list + '</div>';
      }).join('');
      return '<details><summary style="cursor:pointer;font-weight:700;padding:6px 0;">' + day.day + '요일 과제</summary>' + cats + '</details>';
    }).join('');

    c.innerHTML =
      '<div class="card"><div class="card-title">원본 커리큘럼 단위 선택 (1 ~ 16)</div>' + nav +
      '<p class="help-text">여기는 전체 학습 분량(원본 커리큘럼)입니다. 실제 수업 회차 수와 무관하며, 일정이 바뀌어도 이 내용은 바뀌지 않습니다. 회차별 배정은 SECTION D에서 자동 계산됩니다.</p></div>' +
      '<div class="card"><div class="card-title">원본 단위 ' + state.week + ' — 학습 자료 및 수행 과제 편집' + (state.dirty ? ' <span class="tag tag-cancel">저장 안 됨</span>' : '') + '</div>' +
      '<form id="week-form">' +
      '<div class="form-group"><label for="week-title">단위 제목</label><input type="text" id="week-title" class="form-control" data-f="title" maxlength="200" value="' + esc(e.title.ko) + '"></div>' +
      '<div class="form-group"><label for="week-note">참고 사항 (Note)</label><input type="text" id="week-note" class="form-control" data-f="note" maxlength="1000" value="' + esc(e.note.ko) + '"></div>' +
      '<div style="font-weight:700;margin:18px 0 8px;display:flex;justify-content:space-between;align-items:center;"><span>학습 내용 목록</span>' +
      '<button type="button" class="btn btn-primary move-btn" data-act="item-add">+ 항목 추가</button></div>' +
      '<div id="items-list">' + items + '</div>' +
      '<div style="font-weight:700;margin:22px 0 4px;">요일별 과제</div>' + assign +
      '<p class="help-text">위/아래 버튼으로 순서를 바꾼 뒤 저장하면 전체 순서가 한 번에(모두 성공하거나 모두 취소) 저장됩니다. 텍스트를 수정한 항목의 영어 번역은 비워지며, 링크는 유지됩니다.</p>' +
      '<button type="submit" class="btn btn-primary" style="margin-top:14px;">원본 단위 ' + state.week + ' 저장</button></form></div>';
  }

  function listFor(t) {
    var d = t.getAttribute('data-d');
    if (d !== null && d !== undefined && t.hasAttribute('data-c')) return state.edit.days[+d][t.getAttribute('data-c')];
    return state.edit.items;
  }

  function editText(rec, value) {
    rec.text.ko = value;
    if (value !== rec._ko) rec.text.en = null; // the English text belonged to the previous Korean text
  }

  function move(list, i, dir) {
    var j = i + dir;
    if (j < 0 || j >= list.length) return;
    var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    state.dirty = true;
    renderTab();
  }

  function payloadItem(it, withPage) {
    var out = { text: { ko: it.text.ko.trim(), en: it.text.en || null }, link: it.link || null };
    if (it.uid) out.uid = it.uid;
    if (withPage) out.page = (it.page || '').trim() || null;
    return out;
  }

  function saveWeek() {
    var e = state.edit;
    var payload = {
      title: { ko: e.title.ko.trim(), en: e.title.en || null },
      note: { ko: e.note.ko.trim(), en: e.note.en || null },
      items: e.items.filter(function (it) { return it.text.ko.trim(); }).map(function (it) { return payloadItem(it, true); }),
      assignments: {
        days: e.days.map(function (d) {
          var o = { day: { ko: d.day + '요일' } };
          CATS.forEach(function (cat) {
            o[cat[0]] = d[cat[0]].filter(function (it) { return it.text.ko.trim(); }).map(function (it) { return payloadItem(it, false); });
          });
          return o;
        })
      }
    };
    api('PUT', '/api/admin/curriculum/' + state.week, payload).then(function (r) {
      if (r.ok) { toast('원본 단위 ' + state.week + '이(가) 저장되었습니다. 새 항목은 SECTION D에서 재배정할 때까지 마지막 회차에 표시됩니다.'); state.dirty = false; return reloadAll(); }
      toast(errText(r, '저장 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  /* ---------------- SECTION D: session distribution (preview / apply) ---------------- */

  function itemLabel(lookup, uid) {
    var it = lookup[uid];
    if (!it) return esc(uid);
    var tag = it.kind === 'assignment' ? ' <span class="tag tag-active">' + esc((it.day || '') + ' ' + ({ review: '복습', preview: '예습', vocab: '어휘' }[it.category] || '')) + '</span>' : '';
    return esc(it.ko) + tag;
  }

  function sessionCard(sess, lookup, withPins, maxSession, pins) {
    var learn = sess.learning.map(function (uid) { return '<li>' + itemLabel(lookup, uid) + pinControl(uid, withPins, maxSession, pins) + '</li>'; }).join('');
    var assign = sess.assignments.map(function (uid) { return '<li>' + itemLabel(lookup, uid) + pinControl(uid, withPins, maxSession, pins) + '</li>'; }).join('');
    return '<details class="preview-item" style="display:block;">' +
      '<summary style="cursor:pointer;font-weight:700;">' + sess.session + '회차' + (sess.date ? ' — ' + esc(sess.date) : '') +
      ' <span class="help-text">(학습 자료 ' + sess.learning.length + ' · 수행 과제 ' + sess.assignments.length + ')</span></summary>' +
      '<div style="margin:6px 0 0 8px;"><div style="font-weight:600;font-size:12px;">학습 자료</div>' + (learn ? '<ul style="margin-left:18px;">' + learn + '</ul>' : '<p class="help-text">없음</p>') +
      '<div style="font-weight:600;font-size:12px;margin-top:6px;">수행 과제</div>' + (assign ? '<ul style="margin-left:18px;">' + assign + '</ul>' : '<p class="help-text">없음</p>') + '</div></details>';
  }

  function pinControl(uid, withPins, maxSession, pins) {
    if (!withPins) return '';
    var opts = '';
    for (var n = 1; n <= maxSession; n++) opts += '<option value="' + n + '"' + (pins[uid] === n ? ' selected' : '') + '>' + n + '회차</option>';
    return ' <select class="form-control" style="width:auto;display:inline-block;padding:2px 4px;font-size:12px;" data-f="pin" data-uid="' + esc(uid) + '" aria-label="회차 지정"><option value="">자동</option>' + opts + '</select>' +
      (pins[uid] ? ' <span class="tag tag-cancel">수동</span>' : '');
  }

  function renderPlan(c) {
    var st = state.plan;
    if (!st) { c.innerHTML = '<div class="card">배정 정보를 불러오지 못했습니다.</div>'; return; }
    var pr = st.proposal, act = st.active, sch = pr.schedule;
    var head;
    if (sch.status === 'unconfigured') {
      head = '<div class="unconfigured-banner"><div>수업 기간(시작일·종료일)이 설정되지 않았습니다. 공개 사이트에는 \'일정 미정\'이 표시됩니다.</div></div>';
    } else if (sch.status === 'invalid') {
      head = '<div class="unconfigured-banner"><div>수업 기간이 올바르지 않습니다: ' + esc(PERIOD_MESSAGES[sch.errors[0]] || '') + '</div></div>';
    } else {
      head = '';
    }
    var prevCount = act ? act.sessionCount : null;
    var compare = '<div class="preview-box"><table class="table"><tbody>' +
      '<tr><th>현재 적용됨</th><td>' + (act ? act.sessionCount + '회차 (' + esc(act.config.courseStartDate) + ' ~ ' + esc(act.config.courseEndDate) + ', ' + esc(act.appliedAt || '') + ' ' + esc(act.appliedBy || '') + ')' : '적용된 배정 없음') + '</td></tr>' +
      '<tr><th>제안 (미리보기)</th><td><strong>' + pr.proposed.sessionCount + '회차</strong> — 수업 기회 ' + sch.calendarOpportunities + ' − 휴강 ' + sch.cancellationCount + '</td></tr>' +
      '<tr><th>변경 여부</th><td>' + (pr.changed ? '<span class="tag tag-cancel">변경됨 — 적용 필요</span>' : '<span class="tag tag-active">현재 적용본과 동일</span>') + '</td></tr>' +
      '</tbody></table>' +
      (prevCount !== null && prevCount !== pr.proposed.sessionCount ? '<p style="margin-top:8px;font-weight:700;color:var(--danger);">적용하면 ' + prevCount + '회차 → ' + pr.proposed.sessionCount + '회차로 재배정됩니다.</p>' : '') +
      (pr.clampedPins.length ? '<p class="help-text" style="color:var(--danger);">수동 지정 ' + pr.clampedPins.length + '건이 회차 범위를 벗어나 가장 가까운 회차로 조정됩니다.</p>' : '') +
      '<button type="button" class="btn btn-primary" data-act="plan-apply" data-token="' + esc(pr.token) + '" data-from="' + (prevCount === null ? '' : prevCount) + '" data-to="' + pr.proposed.sessionCount + '"' + ((pr.canApply && pr.changed) ? '' : ' disabled') + '>적용</button>' +
      '<span class="help-text" style="margin-left:8px;">적용 전에는 공개 사이트가 바뀌지 않습니다. 원본 커리큘럼은 절대 수정되지 않습니다.</span></div>';

    var proposed = pr.proposed.sessions.length
      ? '<div class="preview-timeline" style="max-height:none;">' + pr.proposed.sessions.map(function (x) { return sessionCard(x, pr.items, false); }).join('') + '</div>'
      : '<p class="help-text">배정할 회차가 없습니다.</p>';

    var current = '';
    if (act) {
      var pins = act.manualPins || {};
      var note = act.unplaced && (act.unplaced.learning.length + act.unplaced.assignments.length)
        ? '<p class="help-text" style="color:var(--danger);">원본에 새로 추가된 항목 ' + (act.unplaced.learning.length + act.unplaced.assignments.length) + '개가 마지막 회차에 임시로 표시됩니다. 위의 \'적용\'으로 재배정하세요.</p>' : '';
      current = '<div class="card"><div class="card-title">현재 적용된 배정 (' + act.sessionCount + '회차)</div>' + note +
        '<p class="help-text">항목 옆 선택으로 특정 회차에 수동 지정할 수 있습니다. 수동 지정 항목은 이후 자동 재배정에서도 유지됩니다(회차 범위를 벗어나면 조정).</p>' +
        '<div class="preview-timeline" style="max-height:none;">' + act.sessions.map(function (x) { return sessionCard(x, pr.items, true, act.sessionCount, pins); }).join('') + '</div></div>';
    }

    c.innerHTML = head +
      '<div class="card"><div class="card-title">자동 재배정 미리보기</div>' + summaryHtml(formValuesFrom(state.settings || {})) + compare +
      '<div style="font-weight:700;margin:14px 0 6px;">제안된 회차별 배정</div>' + proposed + '</div>' + current;
  }

  function applyPlan(token, from, to) {
    var msg = (from ? from + '회차 → ' + to + '회차로' : to + '회차로') + ' 공개 사이트의 회차 배정을 교체합니다. 계속할까요?';
    if (!window.confirm(msg)) return;
    api('POST', '/api/admin/plan/apply', { token: token }).then(function (r) {
      if (r.ok) { toast('회차 배정이 적용되었습니다.'); return reloadAll(); }
      toast(errText(r, '적용 실패'), true);
      if (r.status === 409) return reloadAll();
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  function pinItem(uid, value) {
    api('PUT', '/api/admin/plan/pin', { uid: uid, session: value ? Number(value) : null }).then(function (r) {
      if (r.ok) { toast(value ? '회차가 지정되었습니다.' : '자동 배정으로 되돌렸습니다.'); return reloadAll(); }
      toast(errText(r, '지정 실패'), true);
    }).catch(function () { toast('요청 중 오류 발생', true); });
  }

  /* ---------------- SECTION E: audit ---------------- */

  function renderAudit(c) {
    c.innerHTML = '<div class="card"><div class="card-title">변경 이력 불러오는 중...</div></div>';
    api('GET', '/api/admin/audit').then(function (r) {
      if (!r.ok) throw new Error('audit');
      var logs = r.data;
      var body = logs.length === 0 ? '<p style="color:var(--ink-faint);">기록된 변경 이력이 없습니다.</p>' :
        '<table class="table"><thead><tr><th>일시</th><th>관리자</th><th>작업</th><th>상세 요약</th><th>복구</th></tr></thead><tbody>' +
        logs.map(function (l) {
          return '<tr><td>' + esc(l.created_at) + '</td><td><strong>' + esc(l.username) + '</strong></td>' +
            '<td><span class="tag tag-active">' + esc(ACTION_LABELS[l.action] || l.action) + '</span></td>' +
            '<td style="font-size:12px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(String(l.details || '').slice(0, 200)) + '</td>' +
            '<td>' + (RESTORABLE[l.action] ? '<button type="button" class="btn move-btn" data-act="restore" data-id="' + esc(l.id) + '">복구</button>' : '') + '</td></tr>';
        }).join('') + '</tbody></table>';
      c.innerHTML = '<div class="card"><div class="card-title">변경 이력 (Audit Log & Restore)</div>' +
        '<p style="color:var(--ink-soft);font-size:13px;margin-bottom:14px;">모든 일정 및 커리큘럼 변경이 기록됩니다. 복구하면 해당 변경이 일어나기 전 상태로 되돌립니다.</p>' + body + '</div>';
    }).catch(function () {
      c.innerHTML = '<div class="card"><div style="color:var(--danger);">변경 이력을 불러오지 못했습니다.</div></div>';
    });
  }

  function restore(id) {
    if (!window.confirm('이 변경을 되돌리시겠습니까? 현재 값이 덮어씌워집니다.')) return;
    api('POST', '/api/admin/audit/' + id + '/restore').then(function (r) {
      if (r.ok) { toast('성공적으로 복구되었습니다.'); return reloadAll(); }
      toast(errText(r, '복구 실패'), true);
    }).catch(function () { toast('복구 중 오류 발생', true); });
  }

  /* ---------------- events ---------------- */

  document.addEventListener('submit', function (ev) {
    var id = ev.target && ev.target.id;
    if (!id) return;
    ev.preventDefault();
    if (id === 'login-form') handleLogin(ev.target);
    else if (id === 'settings-form') saveSettings();
    else if (id === 'cancel-form') addCancellation();
    else if (id === 'week-form') saveWeek();
  });

  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t && t.getAttribute && t.getAttribute('data-f') === 'pin') pinItem(t.getAttribute('data-uid'), t.value);
  });

  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t && t.id && /^sett-(prelim|start|end|interval)$/.test(t.id)) { refreshSummary(); return; }
    var f = t && t.getAttribute && t.getAttribute('data-f');
    if (!f || !state.edit || f === 'pin') return;
    var wasDirty = state.dirty;
    state.dirty = true;
    if (f === 'title') state.edit.title.ko = t.value;
    else if (f === 'note') state.edit.note.ko = t.value;
    else if (f === 'item-text' || f === 'a-text') editText(listFor(t)[+t.getAttribute('data-i')], t.value);
    else if (f === 'item-page') listFor(t)[+t.getAttribute('data-i')].page = t.value;
    if (!wasDirty) {
      var badge = document.querySelector('#week-form') && document.querySelector('#week-form').parentNode.querySelector('.card-title');
      if (badge && !badge.querySelector('.tag')) badge.insertAdjacentHTML('beforeend', ' <span class="tag tag-cancel">저장 안 됨</span>');
    }
  });

  document.addEventListener('click', function (ev) {
    var t = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');
    var i = +t.getAttribute('data-i');
    var id = t.getAttribute('data-id');
    switch (act) {
      case 'logout': handleLogout(); break;
      case 'tab':
        if (!confirmDiscard()) break;
        state.tab = t.getAttribute('data-tab');
        if (state.tab === 'curriculum') resetEdit();
        renderApp();
        break;
      case 'week':
        if (!confirmDiscard()) break;
        state.week = +t.getAttribute('data-w');
        resetEdit();
        renderTab();
        break;
      case 'cancel-edit': state.editingCancel = +id; renderTab(); break;
      case 'cancel-edit-stop': state.editingCancel = null; renderTab(); break;
      case 'cancel-save': saveCancellationEdit(+id); break;
      case 'cancel-delete': deleteCancellation(+id); break;
      case 'item-add':
        state.edit.items.push({ text: { ko: '', en: null }, page: '', link: null, _ko: '' });
        state.dirty = true; renderTab(); break;
      case 'item-up': move(state.edit.items, i, -1); break;
      case 'item-down': move(state.edit.items, i, 1); break;
      case 'item-del': state.edit.items.splice(i, 1); state.dirty = true; renderTab(); break;
      case 'a-add':
        state.edit.days[+t.getAttribute('data-d')][t.getAttribute('data-c')].push({ text: { ko: '', en: null }, link: null, _ko: '' });
        state.dirty = true; renderTab(); break;
      case 'a-up': move(listFor(t), i, -1); break;
      case 'a-down': move(listFor(t), i, 1); break;
      case 'a-del': listFor(t).splice(i, 1); state.dirty = true; renderTab(); break;
      case 'restore': restore(id); break;
      case 'plan-apply': applyPlan(t.getAttribute('data-token'), t.getAttribute('data-from'), t.getAttribute('data-to')); break;
    }
  });

  window.addEventListener('DOMContentLoaded', init);
})();
