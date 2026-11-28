# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.abspath('.'))
import json
import re

with open('jeonju_mwb_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'json\.loads\(\'\'\'(.*?)\'\'\'\)', text, re.DOTALL)
weeks = json.loads(m.group(1))

slim_weeks = []
for w in weeks:
    sw = {
        'meta': w['meta'],
        'date': w['date'],
        'reading': w['reading'],
        'songs': w.get('songs', []),
        'chairman': w.get('chairman'),
        'opening_prayer': w.get('opening_prayer'),
        'closing_prayer': w.get('closing_prayer'),
        'items': []
    }
    for it in w.get('items', []):
        sw['items'].append({
            'num': it.get('num'),
            'section': it.get('section'),
            'title': it.get('title'),
            'isStudent': it.get('isStudent'),
            'isCbs': it.get('isCbs'),
            'speaker': it.get('speaker'),
            'assignee': it.get('assignee'),
            'assistant': it.get('assistant'),
            'conductor': it.get('conductor'),
            'reader': it.get('reader')
        })
    slim_weeks.append(sw)

from scripts.mwb_assigner import (
    MEMBERS, CHAIRMAN_CANDIDATES, PRAYER_CANDIDATES, TALK10_CANDIDATES,
    GEMS_CANDIDATES, READING_CANDIDATES, CBS_CONDUCTOR_CANDIDATES, CBS_READER_CANDIDATES
)

default_members = []
for m in MEMBERS:
    entry = {
        'ko': m['ko'],
        'vi': m['vi'],
        'call': m['call'],
        'gender': m['gender'],
        'roles': {
            'chairman': 1 if m['ko'] in CHAIRMAN_CANDIDATES else 0,
            'prayer': 1 if m['ko'] in PRAYER_CANDIDATES else 0,
            'talk10': 1 if m['ko'] in TALK10_CANDIDATES else 0,
            'gems': 1 if m['ko'] in GEMS_CANDIDATES else 0,
            'reading': 1 if m['ko'] in READING_CANDIDATES else 0,
            'ministry': 1,
            'cbsCond': 1 if m['ko'] in CBS_CONDUCTOR_CANDIDATES else 0,
            'cbsRead': 1 if m['ko'] in CBS_READER_CANDIDATES else 0
        }
    }
    if m.get('spouse'):
        entry['spouse'] = m['spouse']
    if m.get('children'):
        entry['parentOf'] = m['children']
    if m.get('parents'):
        entry['childOf'] = m['parents']
    default_members.append(entry)

from scripts.inspect_jeonju_schedule import weekend_list as default_weekend_meetings

section_h_code = """

  /* ---------------- SECTION H: Christian Life and Ministry Meeting Assignments (생활과 봉사 집회 임명 & 주말 모임) ---------------- */

  var DEFAULT_MWB_MEMBERS = """ + json.dumps(default_members, ensure_ascii=False) + """;
  var DEFAULT_MWB_PROGRAMS = """ + json.dumps(slim_weeks, ensure_ascii=False) + """;
  var DEFAULT_WEEKEND_PROGRAMS = """ + json.dumps(default_weekend_meetings, ensure_ascii=False) + """;

  var STUDENTS_KO = {
    '김재윤': 1, '오호경': 1, '김종배': 1, '최미순': 1, '박정환': 1, '원혜진': 1, '박유나': 1,
    '박철현': 1, '이서희': 1, '이수연': 1, '이종명': 1, '이주옥': 1, '이제희': 1, '이제아': 1,
    '최영주': 1, '한상현': 1, '한도희': 1, '서주연': 1, '한정우': 1, '유계화': 1, '김동주': 1
  };

  function getMwbPrograms() {
    return (typeof window !== 'undefined' && window.JEONJU_MWB_PROGRAMS && window.JEONJU_MWB_PROGRAMS.length)
      ? window.JEONJU_MWB_PROGRAMS
      : DEFAULT_MWB_PROGRAMS;
  }

  function getMwbRoster() {
    try {
      var raw = localStorage.getItem('jeonju_mwb_roster');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return JSON.parse(JSON.stringify(DEFAULT_MWB_MEMBERS));
  }

  function saveMwbRoster(list) {
    try {
      localStorage.setItem('jeonju_mwb_roster', JSON.stringify(list));
    } catch(e) {}
  }

  function getMwbAssignmentsMap() {
    try {
      var raw = localStorage.getItem('jeonju_mwb_assignments');
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function saveMwbAssignmentsMap(map) {
    try {
      localStorage.setItem('jeonju_mwb_assignments', JSON.stringify(map));
    } catch(e) {}
  }

  function getWeekendAssignmentsMap() {
    try {
      var raw = localStorage.getItem('jeonju_weekend_assignments');
      return raw ? JSON.parse(raw) : {};
    } catch(e) { return {}; }
  }

  function saveWeekendAssignmentsMap(map) {
    try {
      localStorage.setItem('jeonju_weekend_assignments', JSON.stringify(map));
    } catch(e) {}
  }

  function getEffectiveWeekendSchedule() {
    var map = getWeekendAssignmentsMap();
    return DEFAULT_WEEKEND_PROGRAMS.map(function (item) {
      var dStr = (item.year || 2026) + '-' + String(item.month).padStart(2, '0') + '-' + String(item.day).padStart(2, '0');
      var row = JSON.parse(JSON.stringify(item));
      if (map[dStr + '-chairman'] !== undefined) row.chairman = map[dStr + '-chairman'];
      if (map[dStr + '-wtConductor'] !== undefined) row.wtConductor = map[dStr + '-wtConductor'];
      if (map[dStr + '-wtReader'] !== undefined) row.wtReader = map[dStr + '-wtReader'];
      if (map[dStr + '-closing'] !== undefined) row.closing = map[dStr + '-closing'];
      return row;
    });
  }

  function formatMember(m) {
    if (!m) return '';
    var suffix = (m.gender === 'M') ? '형제' : '자매';
    return m.call + '(' + m.ko + ' ' + suffix + ')';
  }

  function canPairMembers(m1, m2, isStart) {
    if (!m1 || !m2 || m1.ko === m2.ko) return false;
    if (!isStart) {
      return m1.gender === m2.gender;
    }
    if (m1.gender === m2.gender) return true;
    if (m1.spouse === m2.ko || m2.spouse === m1.ko) return true;
    if ((m1.parentOf || []).indexOf(m2.ko) >= 0 || (m2.parentOf || []).indexOf(m1.ko) >= 0) return true;
    if ((m1.childOf || []).indexOf(m2.ko) >= 0 || (m2.childOf || []).indexOf(m1.ko) >= 0) return true;
    return false;
  }

  function executeAutoAssignment() {
    var roster = getMwbRoster();
    var programs = getMwbPrograms();
    var counts = {};
    var roleCounts = {};
    var usedPairs = {};

    roster.forEach(function (m) {
      counts[m.ko] = 0;
      roleCounts[m.ko] = {};
    });

    var assignments = getMwbAssignmentsMap();

    programs.forEach(function (prog) {
      var meta = prog.meta || {};
      var sDate = meta.startDate;
      var isDecember = (sDate.indexOf('2026-12') === 0);
      var availPool = isDecember
        ? roster.filter(function (m) { return !STUDENTS_KO[m.ko]; })
        : roster;

      var weekAssigned = {};

      function pickCandidate(candList, roleName) {
        var cands = candList.filter(function (c) {
          return availPool.some(function (ap) { return ap.ko === c.ko; });
        });
        var available = cands.filter(function (c) { return !weekAssigned[c.ko]; });
        if (!available.length) available = cands.slice();
        available.sort(function (a, b) {
          var ca = counts[a.ko] || 0;
          var cb = counts[b.ko] || 0;
          if (ca !== cb) return ca - cb;
          var rca = (roleCounts[a.ko] && roleCounts[a.ko][roleName]) || 0;
          var rcb = (roleCounts[b.ko] && roleCounts[b.ko][roleName]) || 0;
          return rca - rcb;
        });
        var chosen = available[0];
        if (chosen) {
          weekAssigned[chosen.ko] = true;
          counts[chosen.ko] = (counts[chosen.ko] || 0) + 1;
          if (!roleCounts[chosen.ko]) roleCounts[chosen.ko] = {};
          roleCounts[chosen.ko][roleName] = (roleCounts[chosen.ko][roleName] || 0) + 1;
        }
        return chosen;
      }

      // 1. Chairman
      var chairCands = roster.filter(function (m) { return m.roles && m.roles.chairman; });
      var chosenChair = pickCandidate(chairCands, 'chairman');
      if (chosenChair) assignments[sDate + '-chairman'] = formatMember(chosenChair);

      // 2. CBS Conductor
      var cbsCondCands = roster.filter(function (m) { return m.roles && m.roles.cbsCond; });
      var chosenCbsCond = pickCandidate(cbsCondCands, 'cbsCond');
      if (chosenCbsCond) assignments[sDate + '-cbs-conductor'] = formatMember(chosenCbsCond);

      // 3. CBS Reader
      var cbsReadCands = roster.filter(function (m) { return m.roles && m.roles.cbsRead; });
      var chosenCbsRead = pickCandidate(cbsReadCands, 'cbsRead');
      if (chosenCbsRead) assignments[sDate + '-cbs-reader'] = formatMember(chosenCbsRead);

      // 4. Talk 10
      var talkCands = roster.filter(function (m) { return m.roles && m.roles.talk10; });
      var chosenTalk = pickCandidate(talkCands, 'talk10');
      if (chosenTalk) assignments[sDate + '-item-1-speaker'] = formatMember(chosenTalk);

      // 5. Gems
      var gemsCands = roster.filter(function (m) { return m.roles && m.roles.gems; });
      var chosenGems = pickCandidate(gemsCands, 'gems');
      if (chosenGems) assignments[sDate + '-item-2-speaker'] = formatMember(chosenGems);

      // 6. Reading
      var readingCands = roster.filter(function (m) { return m.roles && m.roles.reading; });
      var chosenReading = pickCandidate(readingCands, 'reading');
      if (chosenReading) assignments[sDate + '-item-3-student'] = formatMember(chosenReading);

      // 7. Ministry items (Section 2)
      (prog.items || []).forEach(function (it) {
        if (it.section === 2) {
          var tKo = (it.title && it.title.ko) || '';
          var tVi = (it.title && it.title.vi) || '';
          var isTalk = (tKo.indexOf('연설') >= 0 || tVi.indexOf('Bài giảng') >= 0);
          var isStart = (tKo.indexOf('대화 시작하기') >= 0 || tKo.indexOf('첫방문') >= 0 || tVi.indexOf('Bắt đầu') >= 0);

          if (isTalk) {
            var brotherCands = availPool.filter(function (m) { return m.gender === 'M'; });
            var sp = pickCandidate(brotherCands, 'ministry_talk');
            if (sp) assignments[sDate + '-item-' + it.num + '-student'] = formatMember(sp);
          } else {
            var ministryCands = availPool.filter(function (m) { return m.roles && m.roles.ministry; });
            var st = pickCandidate(ministryCands, 'ministry');
            if (st) {
              assignments[sDate + '-item-' + it.num + '-student'] = formatMember(st);

              var availAssts = availPool.filter(function (m) {
                return !weekAssigned[m.ko] && canPairMembers(st, m, isStart);
              });
              if (!availAssts.length) {
                availAssts = availPool.filter(function (m) {
                  return m.ko !== st.ko && canPairMembers(st, m, isStart);
                });
              }

              availAssts.sort(function (a, b) {
                var pKeyA = [st.ko, a.ko].sort().join(':');
                var pKeyB = [st.ko, b.ko].sort().join(':');
                var usedA = usedPairs[pKeyA] ? 1 : 0;
                var usedB = usedPairs[pKeyB] ? 1 : 0;
                if (usedA !== usedB) return usedA - usedB;
                var ca = counts[a.ko] || 0;
                var cb = counts[b.ko] || 0;
                return ca - cb;
              });

              var asst = availAssts[0];
              if (asst) {
                weekAssigned[asst.ko] = true;
                counts[asst.ko] = (counts[asst.ko] || 0) + 1;
                if (!roleCounts[asst.ko]) roleCounts[asst.ko] = {};
                roleCounts[asst.ko]['ministry'] = (roleCounts[asst.ko]['ministry'] || 0) + 1;
                usedPairs[[st.ko, asst.ko].sort().join(':')] = true;
                assignments[sDate + '-item-' + it.num + '-assistant'] = formatMember(asst);
              }
            }
          }
        }
      });

      // 8. Opening Prayer
      var prayerCands = roster.filter(function (m) { return m.roles && m.roles.prayer; });
      var chosenOpenPrayer = pickCandidate(prayerCands, 'prayer');
      if (chosenOpenPrayer) assignments[sDate + '-open-prayer'] = formatMember(chosenOpenPrayer);

      // 9. Closing Prayer
      var chosenClosePrayer = pickCandidate(prayerCands, 'prayer');
      if (chosenClosePrayer) assignments[sDate + '-close-prayer'] = formatMember(chosenClosePrayer);
    });

    saveMwbAssignmentsMap(assignments);
    return counts;
  }

  function renderMwb(c) {
    if (!state.mwbSubTab) state.mwbSubTab = 'schedule';
    var roster = getMwbRoster();
    var programs = getMwbPrograms();
    var assignments = getMwbAssignmentsMap();

    // Calculate participation stats
    var memberCounts = {};
    roster.forEach(function (m) { memberCounts[m.ko] = 0; });
    Object.keys(assignments).forEach(function (k) {
      var val = assignments[k] || '';
      roster.forEach(function (m) {
        if (val.indexOf(m.ko) >= 0) memberCounts[m.ko] = (memberCounts[m.ko] || 0) + 1;
      });
    });

    var subTabNav = '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center;">' +
      '<button type="button" class="btn ' + (state.mwbSubTab === 'schedule' ? 'btn-primary' : 'btn-secondary') + '" data-act="mwb-subtab" data-subtab="schedule">📅 주중 모임 배정표 (화요일 MWB 11주)</button>' +
      '<button type="button" class="btn ' + (state.mwbSubTab === 'weekend' ? 'btn-primary' : 'btn-secondary') + '" data-act="mwb-subtab" data-subtab="weekend">☀️ 주말 모임 배정표 (일요일 11주)</button>' +
      '<button type="button" class="btn ' + (state.mwbSubTab === 'roster' ? 'btn-primary' : 'btn-secondary') + '" data-act="mwb-subtab" data-subtab="roster">👥 성원 명단 및 역할 자격 (' + roster.length + '명)</button>' +
      '<a href="https://jeonju.nhom.tieng.viet.mobile" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="margin-left:auto;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">🌐 전주 집단 집회 일정 사이트 ↗</a>' +
      (state.mwbSubTab === 'schedule' ? '<button type="button" class="btn btn-primary" data-act="mwb-auto-assign" style="background:#059669;border-color:#059669;color:#fff;font-weight:700;">⚡ 주중 자동 배정 실행</button>' : '') +
      '</div>';

    var headerCard = '<div class="card">' +
      '<div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">' +
      '<span>📖 전주 베트남어 집단 집회 일정 및 임명 관리 (Lối sống và thánh chức & Cuối tuần)</span>' +
      '<span class="tag tag-active" style="background:#e0f2fe;color:#0369a1;font-weight:600;">2026-12-08 ~ 2027-02-21 (11주간)</span>' +
      '</div>' +
      '<p class="help-text" style="margin-bottom:12px;">' +
      '<strong>집회 일시:</strong> 매주 화요일 저녁 7:30 (그리스도인 생활과 봉사) · 매주 일요일 오후 4:00 (공개강연 & 파수대 연구)<br>' +
      '12월(4주간)은 학생을 제외하고 교사/봉사자가 임명을 수행하며, 2027년 1월부터 학생 임명이 시작됩니다. ' +
      '일요일 집회는 JW 스트림 공개강연과 anh Bình(김한빈 형제) 파수대 사회를 기본으로 하며 관리자 모드에서 수정·저장할 수 있습니다.' +
      '</p>' +
      subTabNav +
      '</div>';

    if (state.mwbSubTab === 'roster') {
      var rosterHtml = renderMwbRosterTab(roster, memberCounts);
      c.innerHTML = headerCard + rosterHtml;
    } else if (state.mwbSubTab === 'weekend') {
      var weekendHtml = renderMwbWeekendTab(roster, getWeekendAssignmentsMap());
      c.innerHTML = headerCard + weekendHtml;
    } else {
      var scheduleHtml = renderMwbScheduleTab(programs, roster, assignments, memberCounts);
      c.innerHTML = headerCard + scheduleHtml;
    }
  }

  function renderMwbWeekendTab(roster, weekendMap) {
    function weekendSelect(slotKey, currentVal, filterRole) {
      var opts = '<option value="">-- 미정 (선택/삭제) --</option>';
      roster.forEach(function (m) {
        if (m.gender !== 'M') return; // Brothers only for weekend chairman/reader/prayer
        if (filterRole && (!m.roles || !m.roles[filterRole])) return;
        var formatted = formatMember(m);
        var sel = (currentVal === formatted || currentVal.indexOf(m.ko) >= 0) ? ' selected' : '';
        opts += '<option value="' + esc(formatted) + '"' + sel + '>' + esc(formatted) + '</option>';
      });
      return '<div style="display:flex;gap:6px;align-items:center;">' +
        '<select class="form-control" style="font-size:12px;padding:3px 6px;height:auto;max-width:240px;" data-act="mwb-weekend-change" data-slot-key="' + esc(slotKey) + '">' + opts + '</select>' +
        (currentVal ? '<button type="button" class="btn move-btn" style="color:var(--danger);font-size:11px;" data-act="mwb-weekend-clear" data-slot-key="' + esc(slotKey) + '" title="비우기/삭제">✕</button>' : '') +
        '</div>';
    }

    var cards = DEFAULT_WEEKEND_PROGRAMS.map(function (item, idx) {
      var dStr = (item.year || 2026) + '-' + String(item.month).padStart(2, '0') + '-' + String(item.day).padStart(2, '0');
      var chairVal = (weekendMap[dStr + '-chairman'] !== undefined) ? weekendMap[dStr + '-chairman'] : (item.chairman || '');
      var wtCondVal = (weekendMap[dStr + '-wtConductor'] !== undefined) ? weekendMap[dStr + '-wtConductor'] : (item.wtConductor || 'anh Bình(김한빈 형제)');
      var wtReadVal = (weekendMap[dStr + '-wtReader'] !== undefined) ? weekendMap[dStr + '-wtReader'] : (item.wtReader || '');
      var closeVal = (weekendMap[dStr + '-closing'] !== undefined) ? weekendMap[dStr + '-closing'] : (item.closing || '');

      return '<div class="card" style="margin-bottom:14px;border-left:4px solid #10b981;">' +
        '<div class="card-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">' +
        '<span>☀️ 제 ' + (idx + 1) + '주차: <strong>' + (item.year || 2026) + '년 ' + item.month + '월 ' + item.day + '일 (일요일 오후 4:00)</strong> — Chủ Nhật ' + item.day + '/' + item.month + ' 16:00</span>' +
        '<span class="tag tag-active" style="background:#d1fae5;color:#065f46;font-weight:700;">' + dStr + '</span>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
        '<table class="table" style="font-size:13px;">' +
        '<thead><tr><th style="width:24%;">순서 및 프로그램</th><th style="width:30%;">세부 내용 / 연제</th><th>담당자 (배정 / 수정 / 삭제)</th></tr></thead>' +
        '<tbody>' +
        '<tr>' +
        '<td><strong>공개강연 사회 및 (시작) 기도</strong><br><span style="font-size:12px;color:var(--ink-soft);">Chủ tọa và cầu nguyện mở đầu</span></td>' +
        '<td>사회 진행 및 개회 기도</td>' +
        '<td>' + weekendSelect(dStr + '-chairman', chairVal, 'prayer') + '</td>' +
        '</tr>' +
        '<tr style="background:#f8fafc;">' +
        '<td><strong>공개강연 (Bài giảng công cộng)</strong></td>' +
        '<td><span class="tag" style="background:#e0f2fe;color:#0369a1;font-weight:700;">JW 스트림 연설 시청</span> (Xem bài giảng trên JW Stream)</td>' +
        '<td style="font-size:12px;color:var(--ink-soft);">(JW 스트림 방송 연설)</td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>파수대 연구 사회 (Điều khiển Tháp Canh)</strong></td>' +
        '<td>파수대 기사 사회</td>' +
        '<td>' + weekendSelect(dStr + '-wtConductor', wtCondVal, 'chairman') + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>파수대 연구 낭독 (Đọc Tháp Canh)</strong></td>' +
        '<td>파수대 본문 낭독</td>' +
        '<td>' + weekendSelect(dStr + '-wtReader', wtReadVal, 'reading') + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>(마치는) 기도 (Cầu nguyện kết thúc)</strong></td>' +
        '<td>폐회 기도</td>' +
        '<td>' + weekendSelect(dStr + '-closing', closeVal, 'prayer') + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table></div></div>';
    }).join('');

    return '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
      '<div><strong>전체 11주차 일요일 주말 모임 계획표</strong> (공개강연 & 파수대 연구)</div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button type="button" class="btn btn-primary" data-act="mwb-export-weekend">📋 주말 일정 JSON 복사</button>' +
      '<button type="button" class="btn btn-secondary" data-act="mwb-reset-weekend">기본값 복원</button>' +
      '</div></div>' + cards;
  }

  function renderMwbRosterTab(roster, counts) {
    var editIdx = state.mwbEditingIdx;
    var formHtml = '';
    if (state.mwbShowAdd || editIdx !== undefined) {
      var mem = (editIdx !== undefined && roster[editIdx]) ? roster[editIdx] : { ko: '', vi: '', call: 'anh', gender: 'M', roles: { ministry: 1 } };
      formHtml = '<div class="card" style="border:2px solid var(--primary);background:#f8fafc;margin-bottom:16px;">' +
        '<div class="card-title">' + (editIdx !== undefined ? '성원 정보 수정' : '신규 성원 추가') + '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:12px;">' +
        '<div><label style="font-size:12px;font-weight:600;">한국어 성명</label><input type="text" id="mwb-in-ko" class="form-control" value="' + esc(mem.ko) + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">베트남어 이름</label><input type="text" id="mwb-in-vi" class="form-control" value="' + esc(mem.vi) + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">호칭 (anh/chị/em)</label><input type="text" id="mwb-in-call" class="form-control" value="' + esc(mem.call) + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">성별</label><select id="mwb-in-gender" class="form-control"><option value="M"' + (mem.gender === 'M' ? ' selected' : '') + '>형제 (M)</option><option value="F"' + (mem.gender === 'F' ? ' selected' : '') + '>자매 (F)</option></select></div>' +
        '<div><label style="font-size:12px;font-weight:600;">배우자 성명 (선택)</label><input type="text" id="mwb-in-spouse" class="form-control" value="' + esc(mem.spouse || '') + '"></div>' +
        '<div><label style="font-size:12px;font-weight:600;">자녀 성명 (쉼표 구분)</label><input type="text" id="mwb-in-parentOf" class="form-control" value="' + esc((mem.parentOf || []).join(',')) + '"></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;">' +
        '<button type="button" class="btn btn-primary" data-act="mwb-save-member" data-idx="' + (editIdx !== undefined ? editIdx : '') + '">저장</button>' +
        '<button type="button" class="btn btn-secondary" data-act="mwb-cancel-member">취소</button>' +
        '</div></div>';
    }

    var rows = roster.map(function (m, idx) {
      var r = m.roles || {};
      var rel = [];
      if (m.spouse) rel.push('배우자: ' + m.spouse);
      if (m.parentOf && m.parentOf.length) rel.push('자녀: ' + m.parentOf.join(','));
      if (m.childOf && m.childOf.length) rel.push('부모: ' + m.childOf.join(','));
      var relText = rel.join(' · ') || '-';
      var isStu = !!STUDENTS_KO[m.ko];

      return '<tr>' +
        '<td><strong>' + esc(formatMember(m)) + '</strong><br><span style="font-size:12px;' + (isStu ? 'color:#0284c7;' : 'color:#059669;') + '">' + (isStu ? '학습반 학생 (1월부터 배정)' : '교사/봉사자 (12월부터 배정)') + '</span></td>' +
        '<td><span class="tag ' + (m.gender === 'M' ? 'tag-active' : 'tag-cancel') + '">' + (m.gender === 'M' ? '형제' : '자매') + '</span></td>' +
        '<td style="font-size:12px;color:var(--ink-soft);">' + esc(relText) + '</td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="chairman"' + (r.chairman ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="prayer"' + (r.prayer ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="talk10"' + (r.talk10 ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="gems"' + (r.gems ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="reading"' + (r.reading ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="ministry"' + (r.ministry ? ' checked' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="cbsCond"' + (r.cbsCond ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><input type="checkbox" data-act="mwb-role-toggle" data-member-idx="' + idx + '" data-role="cbsRead"' + (r.cbsRead ? ' checked' : '') + (m.gender === 'F' ? ' disabled' : '') + '></td>' +
        '<td style="text-align:center;"><span class="badge" style="background:#f1f5f9;font-weight:700;">' + (counts[m.ko] || 0) + '회</span></td>' +
        '<td>' +
        '<button type="button" class="btn move-btn" data-act="mwb-edit-member" data-idx="' + idx + '">수정</button> ' +
        '<button type="button" class="btn move-btn" style="color:var(--danger);" data-act="mwb-del-member" data-idx="' + idx + '">삭제</button>' +
        '</td>' +
        '</tr>';
    }).join('');

    return formHtml + '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
      '<div class="card-title" style="margin:0;">성원 자격 및 가족 관계 명단 (' + roster.length + '명)</div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button type="button" class="btn btn-primary" data-act="mwb-add-member">➕ 성원 추가</button>' +
      '<button type="button" class="btn btn-secondary" data-act="mwb-reset-roster">초기 명단 복원</button>' +
      '</div></div>' +
      '<div style="overflow-x:auto;">' +
      '<table class="table" style="font-size:13px;">' +
      '<thead><tr>' +
      '<th>성명 (호칭·이름)</th><th>성별</th><th>가족 관계</th>' +
      '<th>사회</th><th>기도</th><th>10분</th><th>보물</th><th>낭독</th><th>봉사</th><th>회중사회</th><th>회중낭독</th>' +
      '<th>배정수</th><th>관리</th>' +
      '</tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table></div></div>';
  }

  function renderMwbScheduleTab(programs, roster, assignments, counts) {
    function personSelect(slotKey, currentVal, filterRole, brotherOnly) {
      var opts = '<option value="">-- 미정 --</option>';
      roster.forEach(function (m) {
        if (brotherOnly && m.gender !== 'M') return;
        if (filterRole && (!m.roles || !m.roles[filterRole])) return;
        var formatted = formatMember(m);
        var sel = (currentVal === formatted || currentVal.indexOf(m.ko) >= 0) ? ' selected' : '';
        opts += '<option value="' + esc(formatted) + '"' + sel + '>' + esc(formatted) + '</option>';
      });
      return '<select class="form-control" style="font-size:12px;padding:3px 6px;height:auto;max-width:260px;" data-act="mwb-assign-change" data-slot-key="' + esc(slotKey) + '">' + opts + '</select>';
    }

    var cards = programs.map(function (prog, pIdx) {
      var meta = prog.meta || {};
      var sDate = meta.startDate;
      var d = prog.date || {};
      var rd = prog.reading || {};

      var chairVal = assignments[sDate + '-chairman'] || prog.chairman || '';
      var openPrVal = assignments[sDate + '-open-prayer'] || prog.opening_prayer || '';
      var closePrVal = assignments[sDate + '-close-prayer'] || prog.closing_prayer || '';

      var rowsHtml = '';

      // Officer row
      rowsHtml += '<tr style="background:#f0fdf4;">' +
        '<td colspan="2"><strong>Chủ tọa (집회 사회자)</strong></td>' +
        '<td>' + personSelect(sDate + '-chairman', chairVal, 'chairman', true) + '</td>' +
        '<td></td></tr>';
      rowsHtml += '<tr style="background:#f0fdf4;">' +
        '<td colspan="2"><strong>Cầu nguyện mở đầu (시작 기도)</strong></td>' +
        '<td>' + personSelect(sDate + '-open-prayer', openPrVal, 'prayer', true) + '</td>' +
        '<td></td></tr>';

      (prog.items || []).forEach(function (it) {
        var num = it.num;
        var tKo = (it.title && it.title.ko) || '';
        var tVi = (it.title && it.title.vi) || '';
        var secName = it.section === 1 ? '💎 보물' : (it.section === 2 ? '🌾 봉사' : '🐑 생활');

        if (num === 1) {
          var t10Val = assignments[sDate + '-item-1-speaker'] || it.speaker || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Anh diễn giả (연설자)</td>' +
            '<td>' + personSelect(sDate + '-item-1-speaker', t10Val, 'talk10', true) + '</td>' +
            '<td></td></tr>';
        } else if (num === 2) {
          var gemsVal = assignments[sDate + '-item-2-speaker'] || it.speaker || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Anh điều khiển (사회자)</td>' +
            '<td>' + personSelect(sDate + '-item-2-speaker', gemsVal, 'gems', true) + '</td>' +
            '<td></td></tr>';
        } else if (num === 3) {
          var rdVal = assignments[sDate + '-item-3-student'] || it.assignee || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Anh đọc (낭독자)</td>' +
            '<td>' + personSelect(sDate + '-item-3-student', rdVal, 'reading', true) + '</td>' +
            '<td></td></tr>';
        } else if (it.section === 2) {
          var isTalk = (tKo.indexOf('연설') >= 0 || tVi.indexOf('Bài giảng') >= 0);
          var stVal = assignments[sDate + '-item-' + num + '-student'] || it.assignee || '';
          var asstVal = assignments[sDate + '-item-' + num + '-assistant'] || it.assistant || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#fef3c7;color:#b45309;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>' + (isTalk ? 'Bài giảng (연설)' : 'Học viên (학생)') + '</td>' +
            '<td>' + personSelect(sDate + '-item-' + num + '-student', stVal, 'ministry', isTalk) + '</td>' +
            '<td>' + (isTalk ? '-' : personSelect(sDate + '-item-' + num + '-assistant', asstVal, 'ministry', false)) + '</td></tr>';
        } else if (it.isCbs) {
          var condVal = assignments[sDate + '-cbs-conductor'] || it.conductor || '';
          var cbsRdVal = assignments[sDate + '-cbs-reader'] || it.reader || '';
          rowsHtml += '<tr style="background:#faf5ff;">' +
            '<td><span class="tag" style="background:#f3e8ff;color:#7e22ce;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>회중 성서 연구 (Anh điều khiển/Anh đọc)</td>' +
            '<td>사회: ' + personSelect(sDate + '-cbs-conductor', condVal, 'cbsCond', true) + '</td>' +
            '<td>낭독: ' + personSelect(sDate + '-cbs-reader', cbsRdVal, 'cbsRead', true) + '</td></tr>';
        }
      });

      rowsHtml += '<tr style="background:#f0fdf4;">' +
        '<td colspan="2"><strong>Cầu nguyện kết thúc (마치는 기도)</strong></td>' +
        '<td>' + personSelect(sDate + '-close-prayer', closePrVal, 'prayer', true) + '</td>' +
        '<td></td></tr>';

      return '<div class="card" style="margin-bottom:16px;">' +
        '<div class="card-title" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">' +
        '<span>📅 ' + esc(d.vi || '') + ' (' + esc(d.ko || '') + ') — <span style="font-weight:400;color:var(--ink-soft);">' + esc(rd.vi || '') + '</span></span>' +
        '<span class="tag tag-active" style="background:#dcfce7;color:#166534;">' + sDate + '</span>' +
        '</div>' +
        '<div style="overflow-x:auto;">' +
        '<table class="table" style="font-size:13px;">' +
        '<thead><tr><th>순서 및 항목</th><th>역할</th><th>담당자 (배정자)</th><th>보조자 / 낭독자</th></tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
        '</table></div></div>';
    }).join('');

    return '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">' +
      '<div><strong>전체 11주차 집회 임명표</strong> (총 ' + programs.length + '주간)</div>' +
      '<button type="button" class="btn btn-secondary" data-act="mwb-reset-assign">기본 배정 복원</button>' +
      '</div>' + cards;
  }
"""

with open('regional_admin/admin_client.js', 'r', encoding='utf-8') as f:
    client_code = f.read()

# Add event listeners for weekend actions if not present
if "case 'mwb-weekend-clear':" not in client_code:
    weekend_listeners = """      case 'mwb-weekend-clear':
        var clrKey = t.getAttribute('data-slot-key');
        var wMapClr = getWeekendAssignmentsMap();
        delete wMapClr[clrKey];
        saveWeekendAssignmentsMap(wMapClr);
        toast('임명이 비워졌습니다 (기본값 또는 미정).');
        renderTab();
        break;
      case 'mwb-reset-weekend':
        if (confirm('일요일 주말 모임 임명을 초기 기본값으로 복원하시겠습니까?')) {
          localStorage.removeItem('jeonju_weekend_assignments');
          toast('주말 모임 임명이 기본값으로 복원되었습니다.');
          renderTab();
        }
        break;
      case 'mwb-export-weekend':
        var wExport = getEffectiveWeekendSchedule();
        var jsonText = JSON.stringify(wExport, null, 2);
        try {
          navigator.clipboard.writeText(jsonText).then(function() {
            toast('주말 모임 일정 JSON 데이터가 클립보드에 복사되었습니다!');
          });
        } catch(e) {
          prompt('아래 JSON 데이터를 복사하세요:', jsonText);
        }
        break;"""
    client_code = client_code.replace("case 'mwb-reset-assign':", weekend_listeners + "\n      case 'mwb-reset-assign':")

# Add change listener for mwb-weekend-change if not present
if "data-act') === 'mwb-weekend-change'" not in client_code:
    weekend_change_listener = """    if (t && t.getAttribute && t.getAttribute('data-act') === 'mwb-weekend-change') {
      var wKey = t.getAttribute('data-slot-key');
      var wVal = t.value.trim();
      var wMap = getWeekendAssignmentsMap();
      if (wVal) wMap[wKey] = wVal;
      else delete wMap[wKey];
      saveWeekendAssignmentsMap(wMap);
      toast('주말 임명이 변경되었습니다: ' + (wVal || '(미정)'));
    }
"""
    client_code = client_code.replace(
        "if (t && t.getAttribute && t.getAttribute('data-act') === 'mwb-role-toggle')",
        weekend_change_listener + "    if (t && t.getAttribute && t.getAttribute('data-act') === 'mwb-role-toggle')"
    )

# Replace Section H in client_code
idx_sec_h = client_code.find('/* ---------------- SECTION H:')
if idx_sec_h != -1:
    last_paren = client_code.rfind('})();')
    client_code = client_code[:idx_sec_h] + section_h_code.strip() + "\n})();\n"
else:
    last_paren = client_code.rfind('})();')
    client_code = client_code[:last_paren] + section_h_code.strip() + "\n})();\n"

with open('regional_admin/admin_client.js', 'w', encoding='utf-8') as f:
    f.write(client_code)

print("Updated scripts/inject_section_h.py and regional_admin/admin_client.js successfully!")
