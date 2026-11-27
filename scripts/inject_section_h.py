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

section_h_code = """

  /* ---------------- SECTION H: Christian Life and Ministry Meeting Assignments (생활과 봉사 집회 임명) ---------------- */

  var DEFAULT_MWB_MEMBERS = """ + json.dumps(default_members, ensure_ascii=False) + """;
  var DEFAULT_MWB_PROGRAMS = """ + json.dumps(slim_weeks, ensure_ascii=False) + """;

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

  function formatMember(m) {
    if (!m) return '';
    return m.ko + ' (' + m.vi + ', ' + m.call + ')';
  }

  function canPairMembers(m1, m2) {
    if (!m1 || !m2 || m1.ko === m2.ko) return false;
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
      var weekAssigned = {};

      function pickCandidate(candList, roleName) {
        var available = candList.filter(function (c) { return !weekAssigned[c.ko]; });
        if (!available.length) available = candList.slice();
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
          roleCounts[chosen.ko][roleName] = ((roleCounts[chosen.ko] && roleCounts[chosen.ko][roleName]) || 0) + 1;
        }
        return chosen;
      }

      // 1. Chairman
      var chairCands = roster.filter(function (m) { return m.roles && m.roles.chairman; });
      var chosenChair = pickCandidate(chairCands, 'chairman');
      if (chosenChair) assignments[sDate + '-chairman'] = formatMember(chosenChair);

      // 2. 10-min Talk (Item 1)
      var talkCands = roster.filter(function (m) { return m.roles && m.roles.talk10; });
      var chosenTalk = pickCandidate(talkCands, 'talk10');
      if (chosenTalk) assignments[sDate + '-item-1-speaker'] = formatMember(chosenTalk);

      // 3. CBS Conductor
      var cbsCondCands = roster.filter(function (m) { return m.roles && m.roles.cbsCond; });
      var chosenCbsCond = pickCandidate(cbsCondCands, 'cbsCond');
      if (chosenCbsCond) assignments[sDate + '-cbs-conductor'] = formatMember(chosenCbsCond);

      // 4. CBS Reader
      var cbsReadCands = roster.filter(function (m) { return m.roles && m.roles.cbsRead; });
      var chosenCbsRead = pickCandidate(cbsReadCands, 'cbsRead');
      if (chosenCbsRead) assignments[sDate + '-cbs-reader'] = formatMember(chosenCbsRead);

      // 5. Gems (Item 2)
      var gemsCands = roster.filter(function (m) { return m.roles && m.roles.gems; });
      var chosenGems = pickCandidate(gemsCands, 'gems');
      if (chosenGems) assignments[sDate + '-item-2-speaker'] = formatMember(chosenGems);

      // 6. Bible Reading (Item 3)
      var readingCands = roster.filter(function (m) { return m.roles && m.roles.reading; });
      var chosenReading = pickCandidate(readingCands, 'reading');
      if (chosenReading) assignments[sDate + '-item-3-student'] = formatMember(chosenReading);

      // 7. Ministry items (Section 2)
      (prog.items || []).forEach(function (it) {
        if (it.section === 2) {
          var tKo = (it.title && it.title.ko) || '';
          var tVi = (it.title && it.title.vi) || '';
          var isTalk = (tKo.indexOf('연설') >= 0 || tVi.indexOf('Bài giảng') >= 0);
          if (isTalk) {
            var brotherCands = roster.filter(function (m) { return m.gender === 'M'; });
            var sp = pickCandidate(brotherCands, 'ministry_talk');
            if (sp) assignments[sDate + '-item-' + it.num + '-student'] = formatMember(sp);
          } else {
            var ministryCands = roster.filter(function (m) { return m.roles && m.roles.ministry; });
            var st = pickCandidate(ministryCands, 'ministry');
            if (st) {
              assignments[sDate + '-item-' + it.num + '-student'] = formatMember(st);

              var availAssts = roster.filter(function (m) {
                return !weekAssigned[m.ko] && canPairMembers(st, m);
              });
              if (!availAssts.length) {
                availAssts = roster.filter(function (m) {
                  return m.ko !== st.ko && canPairMembers(st, m);
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
                roleCounts[asst.ko]['ministry'] = ((roleCounts[asst.ko] && roleCounts[asst.ko]['ministry']) || 0) + 1;
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

    var subTabNav = '<div style="display:flex;gap:8px;margin-bottom:14px;">' +
      '<button type="button" class="btn ' + (state.mwbSubTab === 'schedule' ? 'btn-primary' : 'btn-secondary') + '" data-act="mwb-subtab" data-subtab="schedule">📅 주차별 배정표 (11주간)</button>' +
      '<button type="button" class="btn ' + (state.mwbSubTab === 'roster' ? 'btn-primary' : 'btn-secondary') + '" data-act="mwb-subtab" data-subtab="roster">👥 성원 명단 및 역할 자격 (' + roster.length + '명)</button>' +
      '<button type="button" class="btn btn-primary" data-act="mwb-auto-assign" style="margin-left:auto;background:#059669;border-color:#059669;color:#fff;font-weight:700;">⚡ 자동 배정 실행 (Auto-Assign)</button>' +
      '</div>';

    var headerCard = '<div class="card">' +
      '<div class="card-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">' +
      '<span>📖 그리스도인 생활과 봉사 집회 임명 관리 (Lối sống và thánh chức)</span>' +
      '<span class="tag tag-active" style="background:#e0f2fe;color:#0369a1;font-weight:600;">2026-12-07 ~ 2027-02-15 (11주간)</span>' +
      '</div>' +
      '<p class="help-text" style="margin-bottom:12px;">동일 주간 중복 임명 금지(1인 1임명 우선), 2인 짝 과제 파트너 순환, 가족 짝 규칙(부부·부모자녀 첫방문 가능, 그 외 동성 짝) 및 전체 성원 공평 분배 알고리즘이 적용됩니다.</p>' +
      subTabNav +
      '</div>';

    if (state.mwbSubTab === 'roster') {
      var rosterHtml = renderMwbRosterTab(roster, memberCounts);
      c.innerHTML = headerCard + rosterHtml;
    } else {
      var scheduleHtml = renderMwbScheduleTab(programs, roster, assignments, memberCounts);
      c.innerHTML = headerCard + scheduleHtml;
    }
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

      return '<tr>' +
        '<td><strong>' + esc(m.ko) + '</strong><br><span style="font-size:12px;color:var(--ink-soft);">' + esc(m.vi) + ' (' + esc(m.call) + ')</span></td>' +
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
      '<th>성명 (한/베)</th><th>성별</th><th>가족 관계</th>' +
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
            '<td>Diễn giả (10분 연설)</td>' +
            '<td>' + personSelect(sDate + '-item-1-speaker', t10Val, 'talk10', true) + '</td>' +
            '<td></td></tr>';
        } else if (num === 2) {
          var gemsVal = assignments[sDate + '-item-2-speaker'] || it.speaker || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Người hướng dẫn (영적 보물)</td>' +
            '<td>' + personSelect(sDate + '-item-2-speaker', gemsVal, 'gems', true) + '</td>' +
            '<td></td></tr>';
        } else if (num === 3) {
          var rdVal = assignments[sDate + '-item-3-student'] || it.assignee || '';
          rowsHtml += '<tr>' +
            '<td><span class="tag" style="background:#ecfdf5;color:#047857;">' + secName + '</span> ' + num + '. ' + esc(tVi) + '<br><span style="font-size:12px;color:var(--ink-soft);">' + esc(tKo) + '</span></td>' +
            '<td>Người đọc (성경 낭독)</td>' +
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
            '<td>회중 성서 연구 (Chủ tọa/Người đọc)</td>' +
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

# 1. Update TABS
old_tabs = """  var TABS = [
    ['schedule', 'SECTION A — 수업 기간'],
    ['cancellations', 'SECTION B — 휴강 관리'],
    ['curriculum', 'SECTION C — 원본 커리큘럼'],
    ['plan', 'SECTION D — 회차 배정'],
    ['audit', 'SECTION E — 변경 이력 & 복구'],
    ['songs', 'SECTION G — 노래 편집·게시']
  ];"""

new_tabs = """  var TABS = [
    ['schedule', 'SECTION A — 수업 기간'],
    ['cancellations', 'SECTION B — 휴강 관리'],
    ['curriculum', 'SECTION C — 원본 커리큘럼'],
    ['plan', 'SECTION D — 회차 배정'],
    ['audit', 'SECTION E — 변경 이력 & 복구'],
    ['songs', 'SECTION G — 노래 편집·게시'],
    ['mwb', 'SECTION H — 생활과 봉사 집회 임명']
  ];"""

client_code = client_code.replace(old_tabs, new_tabs)

# 2. Update renderTab
old_rendertab = """    else if (state.tab === 'songs') window.SongsAdmin.render(c, { api: api, esc: esc, toast: toast });
    else if (state.tab === 'guide') renderGuide(c);"""

new_rendertab = """    else if (state.tab === 'songs') window.SongsAdmin.render(c, { api: api, esc: esc, toast: toast });
    else if (state.tab === 'guide') renderGuide(c);
    else if (state.tab === 'mwb') renderMwb(c);"""

client_code = client_code.replace(old_rendertab, new_rendertab)

# 3. Add event handlers into click listener and change listener
old_click_switch = """      case 'restore': restore(id); break;
      case 'plan-apply': applyPlan(t.getAttribute('data-token'), t.getAttribute('data-from'), t.getAttribute('data-to')); break;"""

new_click_switch = """      case 'restore': restore(id); break;
      case 'plan-apply': applyPlan(t.getAttribute('data-token'), t.getAttribute('data-from'), t.getAttribute('data-to')); break;
      case 'mwb-subtab':
        state.mwbSubTab = t.getAttribute('data-subtab');
        renderTab();
        break;
      case 'mwb-auto-assign':
        var resCounts = executeAutoAssignment();
        toast('11주차 집회 임명 자동 배정이 완료되었습니다!');
        renderTab();
        break;
      case 'mwb-add-member':
        state.mwbShowAdd = true;
        state.mwbEditingIdx = undefined;
        renderTab();
        break;
      case 'mwb-edit-member':
        state.mwbEditingIdx = +t.getAttribute('data-idx');
        state.mwbShowAdd = true;
        renderTab();
        break;
      case 'mwb-cancel-member':
        state.mwbShowAdd = false;
        state.mwbEditingIdx = undefined;
        renderTab();
        break;
      case 'mwb-save-member':
        var editIdx = t.getAttribute('data-idx');
        var ko = ($('mwb-in-ko') && $('mwb-in-ko').value.trim()) || '';
        var vi = ($('mwb-in-vi') && $('mwb-in-vi').value.trim()) || '';
        var call = ($('mwb-in-call') && $('mwb-in-call').value.trim()) || '';
        var gender = ($('mwb-in-gender') && $('mwb-in-gender').value) || 'M';
        var spouse = ($('mwb-in-spouse') && $('mwb-in-spouse').value.trim()) || undefined;
        var pOfRaw = ($('mwb-in-parentOf') && $('mwb-in-parentOf').value.trim()) || '';
        var pOf = pOfRaw ? pOfRaw.split(',').map(function(s){return s.trim();}).filter(Boolean) : undefined;
        if (!ko) { toast('한국어 성명을 입력해주세요.', true); break; }
        var curRoster = getMwbRoster();
        if (editIdx !== '' && curRoster[+editIdx]) {
          var targetMem = curRoster[+editIdx];
          targetMem.ko = ko; targetMem.vi = vi; targetMem.call = call; targetMem.gender = gender;
          if (spouse) targetMem.spouse = spouse; else delete targetMem.spouse;
          if (pOf && pOf.length) targetMem.parentOf = pOf; else delete targetMem.parentOf;
        } else {
          curRoster.push({
            ko: ko, vi: vi, call: call, gender: gender,
            spouse: spouse, parentOf: pOf,
            roles: { ministry: 1, prayer: gender === 'M' ? 1 : 0, gems: gender === 'M' ? 1 : 0, reading: gender === 'M' ? 1 : 0 }
          });
        }
        saveMwbRoster(curRoster);
        state.mwbShowAdd = false;
        state.mwbEditingIdx = undefined;
        toast('성원 정보가 저장되었습니다.');
        renderTab();
        break;
      case 'mwb-del-member':
        var delIdx = +t.getAttribute('data-idx');
        var curRoster2 = getMwbRoster();
        if (curRoster2[delIdx]) {
          if (confirm(curRoster2[delIdx].ko + ' 성원을 명단에서 삭제하시겠습니까?')) {
            curRoster2.splice(delIdx, 1);
            saveMwbRoster(curRoster2);
            toast('삭제되었습니다.');
            renderTab();
          }
        }
        break;
      case 'mwb-reset-roster':
        if (confirm('성원 명단을 초기 33명 기본값으로 복원하시겠습니까?')) {
          localStorage.removeItem('jeonju_mwb_roster');
          toast('성원 명단이 기본값으로 복원되었습니다.');
          renderTab();
        }
        break;
      case 'mwb-reset-assign':
        if (confirm('배정표를 기본 자동 배정 값으로 복원하시겠습니까?')) {
          localStorage.removeItem('jeonju_mwb_assignments');
          executeAutoAssignment();
          toast('배정표가 기본값으로 복원되었습니다.');
          renderTab();
        }
        break;"""

client_code = client_code.replace(old_click_switch, new_click_switch)

# 4. Add change listener for mwb-assign-change and mwb-role-toggle
old_change = """  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t && t.getAttribute && t.getAttribute('data-f') === 'pin') pinItem(t.getAttribute('data-uid'), t.value);"""

new_change = """  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t && t.getAttribute && t.getAttribute('data-f') === 'pin') pinItem(t.getAttribute('data-uid'), t.value);
    if (t && t.getAttribute && t.getAttribute('data-act') === 'mwb-assign-change') {
      var sKey = t.getAttribute('data-slot-key');
      var sVal = t.value.trim();
      var mwbMap = getMwbAssignmentsMap();
      if (sVal) mwbMap[sKey] = sVal;
      else delete mwbMap[sKey];
      saveMwbAssignmentsMap(mwbMap);
      toast('임명이 변경되었습니다: ' + (sVal || '(미정)'));
    }
    if (t && t.getAttribute && t.getAttribute('data-act') === 'mwb-role-toggle') {
      var mIdx = +t.getAttribute('data-member-idx');
      var rName = t.getAttribute('data-role');
      var rList = getMwbRoster();
      if (rList[mIdx]) {
        if (!rList[mIdx].roles) rList[mIdx].roles = {};
        rList[mIdx].roles[rName] = t.checked ? 1 : 0;
        saveMwbRoster(rList);
        toast('자격이 변경되었습니다.');
      }
    }"""

client_code = client_code.replace(old_change, new_change)

# 5. Insert section_h_code before closing IIFE
last_paren = client_code.rfind('})();')
client_code = client_code[:last_paren] + section_h_code + "\n})();\n"

with open('regional_admin/admin_client.js', 'w', encoding='utf-8') as f:
    f.write(client_code)

print("Injected Section H into regional_admin/admin_client.js successfully!")
