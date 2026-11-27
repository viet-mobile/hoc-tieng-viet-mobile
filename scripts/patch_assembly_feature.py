with open("app_logic.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add cancellation reason translation for 천안 다언어 순회대회
target1 = '"군산 한국어 순회대회": {"vi": "Hội nghị vòng quanh tiếng Hàn Gunsan",'
repl1 = '''"천안 다언어 순회대회": {"vi": "Hội nghị vòng quanh đa ngôn ngữ Cheonan", "cs": "Vícejazyčný krajský sjezd v Čchonanu", "zh_cn": "天安多语种分区大会", "zh": "天安多語種分區大會", "en": "Cheonan Multilingual Circuit Assembly", "fr": "Assemblée de circonscription multilingue de Cheonan", "de": "Mehrsprachiger Kreiskongress Cheonan", "hu": "Cshonani többnyelvű körzetkongresszus", "id": "Kebaktian wilayah multibahasa Cheonan", "ja": "天安多言語巡回大会", "pl": "Wielojęzyczne zgromadzenie obwodowe w Cheonan"},
    "군산 한국어 순회대회": {"vi": "Hội nghị vòng quanh tiếng Hàn Gunsan",'''

assert target1 in code, "Target 1 not found"
code = code.replace(target1, repl1, 1)

# 2. Add renderCircuitAssemblyHtml function above function jwBadgeKindLabels
target2 = '  // --- Scripture Citations and Mini Popup Modal ---'

assembly_func = '''  // --- Circuit Assembly Program & Review Questions ---
  function renderCircuitAssemblyHtml(assembly, dateStr) {
    if (!assembly) return "";
    var isVi = assembly.primary_lang === "vi";

    var themeText = isVi ? assembly.theme.vi : assembly.theme.ko;
    var subThemeText = isVi ? assembly.theme.ko : assembly.theme.vi;
    var scriptureText = isVi ? (assembly.theme.scripture || "") : (assembly.theme.scripture || "");
    var scriptureBadge = typeof formatScriptureHtml === "function" ? formatScriptureHtml(escapeHtml(scriptureText)) : escapeHtml(scriptureText);

    var html = '<div class="curr-assembly-box">';

    // 1. Header Banner
    html += '<div class="assembly-banner">' +
      '<div class="assembly-badge-row">' +
        '<span class="assembly-loc-badge">📍 ' + escapeHtml(T(assembly.title) || assembly.location) + '</span>' +
      '</div>' +
      '<div class="assembly-theme-row">' +
        '<span class="assembly-theme-label">' + (isVi ? 'Chủ đề' : TU('주제')) + ':</span> ' +
        '<span class="assembly-theme-title' + (isVi ? ' vn' : '') + '"' + (isVi ? ' lang="vi"' : '') + '>' + escapeHtml(themeText) + '</span> ' +
        (scriptureBadge ? '<span class="assembly-theme-sc">' + scriptureBadge + '</span>' : '') +
        '<button type="button" class="speak-btn sc-speak-btn" data-speak="' + escapeAttr(themeText) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
      '</div>' +
      (subThemeText ? '<div class="assembly-subtheme-row">' + escapeHtml(subThemeText) + '</div>' : '') +
    '</div>';

    // 2. Official JW.ORG Links
    if (assembly.links) {
      html += '<div class="assembly-links-row">';
      if (assembly.links.program) {
        html += '<a class="btn-jw-scripture assembly-link-btn" href="' + escapeAttr(assembly.links.program) + '" target="_blank" rel="noopener noreferrer">' +
          '<span>📖</span> JW.ORG ' + TU("순회대회 프로그램") + ' ↗</a>';
      }
      if (assembly.links.questions) {
        html += '<a class="btn-jw-scripture assembly-link-btn" href="' + escapeAttr(assembly.links.questions) + '" target="_blank" rel="noopener noreferrer">' +
          '<span>❓</span> JW.ORG ' + TU("복습 질문") + ' ↗</a>';
      }
      html += '</div>';
    }

    // 3. Program Schedule
    html += '<div class="assembly-section">' +
      '<div class="assembly-sec-head"><span>🗓️ ' + TU("순회대회 프로그램") + '</span></div>' +
      '<div class="assembly-schedule-wrap">';

    (assembly.schedule || []).forEach(function (sec) {
      var secTitle = isVi ? (sec.section.vi || sec.section) : (sec.section.ko || sec.section);
      html += '<div class="assembly-sub-head">' + escapeHtml(secTitle) + '</div><div class="assembly-items-list">';
      (sec.items || []).forEach(function (item) {
        var itemMain = isVi ? item.vi : item.ko;
        var itemSub = isVi ? item.ko : item.vi;
        var songLink = "";
        if (item.songNum) {
          songLink = '<span class="assembly-song-pill" data-song-num="' + item.songNum + '" role="button" tabindex="0">🎵 ' + item.songNum + (isVi ? '' : TU('번')) + '</span>';
        }
        var formattedMain = typeof formatScriptureHtml === "function" ? formatScriptureHtml(escapeHtml(itemMain)) : escapeHtml(itemMain);
        html += '<div class="assembly-row' + (item.type === "symposium" ? ' symposium-head' : '') + '">' +
          '<span class="assembly-time">' + escapeHtml(item.time) + '</span>' +
          '<div class="assembly-item-body">' +
            '<div class="assembly-item-main' + (isVi ? ' vn' : '') + '"' + (isVi ? ' lang="vi"' : '') + '>' +
              formattedMain +
              (songLink ? ' ' + songLink : '') +
              '<button type="button" class="speak-btn" data-speak="' + escapeAttr(itemMain) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '</div>' +
            (itemSub && itemSub !== itemMain ? '<div class="assembly-item-sub">' + escapeHtml(itemSub) + '</div>' : '');

        if (item.parts && item.parts.length) {
          html += '<div class="assembly-symposium-parts">';
          item.parts.forEach(function (p) {
            var pMain = isVi ? p.vi : p.ko;
            var pSub = isVi ? p.ko : p.vi;
            html += '<div class="assembly-symposium-part">' +
              '<span class="assembly-part-dot">•</span> ' +
              '<span class="assembly-part-text' + (isVi ? ' vn' : '') + '"' + (isVi ? ' lang="vi"' : '') + '>' + escapeHtml(pMain) + '</span>' +
              '<button type="button" class="speak-btn" data-speak="' + escapeAttr(pMain) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
              (pSub ? '<span class="assembly-part-sub">(' + escapeHtml(pSub) + ')</span>' : '') +
            '</div>';
          });
          html += '</div>';
        }

        html += '</div></div>';
      });
      html += '</div>';
    });
    html += '</div></div>';

    // 4. Review Questions
    html += '<div class="assembly-section">' +
      '<div class="assembly-sec-head"><span>❓ ' + TU("복습 질문") + '</span></div>' +
      '<div class="assembly-questions-list">';

    (assembly.questions || []).forEach(function (q) {
      var qMain = isVi ? q.vi : q.ko;
      var qSub = isVi ? q.ko : q.vi;
      var formattedMain = typeof formatScriptureHtml === "function" ? formatScriptureHtml(escapeHtml(qMain)) : escapeHtml(qMain);
      var formattedSub = typeof formatScriptureHtml === "function" ? formatScriptureHtml(escapeHtml(qSub)) : escapeHtml(qSub);

      html += '<div class="assembly-q-card">' +
        '<div class="assembly-q-row">' +
          '<span class="assembly-q-badge">' + q.num + '</span>' +
          '<div class="assembly-q-body">' +
            '<div class="assembly-q-main' + (isVi ? ' vn' : '') + '"' + (isVi ? ' lang="vi"' : '') + '>' +
              formattedMain +
              '<button type="button" class="speak-btn" data-speak="' + escapeAttr(qMain) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '</div>' +
            (qSub && qSub !== qMain ? '<div class="assembly-q-sub">' + formattedSub + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    });

    html += '</div></div>';

    html += '</div>';
    return html;
  }

'''

assert target2 in code, "Target 2 not found"
code = code.replace(target2, assembly_func + target2, 1)

# 3. Integrate into Regional Cancellation Slots
target3 = """        html += '<div class="group-card curr-vacation-card" data-open="false" data-syl="cancel-' + slot.date + '">' +
          '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(slot.calculatedDate + " " + (cancellationReasonLabel(slot.reason) || TU("휴강"))) + '</span></span>' +
          currChev() + '</button>' +
          '<div class="group-body"><div class="curr-item-list">' +
          '<div class="curr-item-row"><div class="curr-item-text" style="color:var(--warm); font-weight:600;">' + TU("휴강") + ': ' + escapeHtml(cancellationReasonLabel(slot.reason)) + '</div></div>' +
          '</div>' + cancelAssignCard + '</div></div>';
        return;"""

repl3 = """        var assemblyHtml = "";
        if (typeof CIRCUIT_ASSEMBLY_PROGRAMS !== "undefined" && CIRCUIT_ASSEMBLY_PROGRAMS && CIRCUIT_ASSEMBLY_PROGRAMS[slot.date]) {
          assemblyHtml = renderCircuitAssemblyHtml(CIRCUIT_ASSEMBLY_PROGRAMS[slot.date], slot.calculatedDate);
        }

        html += '<div class="group-card curr-vacation-card" data-open="false" data-syl="cancel-' + slot.date + '">' +
          '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(slot.calculatedDate + " " + (cancellationReasonLabel(slot.reason) || TU("휴강"))) + '</span></span>' +
          currChev() + '</button>' +
          '<div class="group-body"><div class="curr-item-list">' +
          '<div class="curr-item-row"><div class="curr-item-text" style="color:var(--warm); font-weight:600;">' + TU("휴강") + ': ' + escapeHtml(cancellationReasonLabel(slot.reason)) + '</div></div>' +
          '</div>' + assemblyHtml + cancelAssignCard + '</div></div>';
        return;"""

assert target3 in code, "Target 3 not found"
code = code.replace(target3, repl3, 1)

# 4. Integrate into standard JW course break slots (w.vacation)
target4 = """        curriculumDisplayItems(w).forEach(function (it) {
          html += '<div class="curr-item-row"><div class="curr-item-text">' + escapeHtml(curriculumItemText(it, w.week)) +
            (it.page ? '<span class="curr-item-page">p.' + it.page + '</span>' : '') + '</div>' +
            currLinkBtn(curriculumLinkForWeek(it.link, w.week)) + '</div>';
        });
        html += '</div>';"""

repl4 = """        curriculumDisplayItems(w).forEach(function (it) {
          html += '<div class="curr-item-row"><div class="curr-item-text">' + escapeHtml(curriculumItemText(it, w.week)) +
            (it.page ? '<span class="curr-item-page">p.' + it.page + '</span>' : '') + '</div>' +
            currLinkBtn(curriculumLinkForWeek(it.link, w.week)) + '</div>';
        });
        html += '</div>';
        if (w.vacation && typeof CIRCUIT_ASSEMBLY_PROGRAMS !== "undefined" && CIRCUIT_ASSEMBLY_PROGRAMS) {
          var wAsm = (w.week === -2.5) ? CIRCUIT_ASSEMBLY_PROGRAMS["2026-12-05"] : ((w.week === -3.5) ? CIRCUIT_ASSEMBLY_PROGRAMS["2026-11-28"] : null);
          if (wAsm) html += renderCircuitAssemblyHtml(wAsm);
        }"""

assert target4 in code, "Target 4 not found"
code = code.replace(target4, repl4, 1)

# 5. Handle Song Pill click
target5 = '    var scBadge = e.target.closest(".scripture-badge");'
repl5 = '''    var songPill = e.target.closest(".assembly-song-pill");
    if (songPill) {
      e.preventDefault();
      var sNum = songPill.dataset.songNum;
      if (sNum) {
        var sBtn = document.querySelector('.tab-btn[data-tab="song"], .nav-item[data-tab="song"]');
        if (sBtn) sBtn.click();
        if (typeof selectKingdomSong === "function") selectKingdomSong(Number(sNum));
      }
      return;
    }
    var scBadge = e.target.closest(".scripture-badge");'''

assert target5 in code, "Target 5 not found"
code = code.replace(target5, repl5, 1)

# 6. Window export
target6 = '  window.parseScriptureRef = parseScriptureRef;'
repl6 = '''  window.parseScriptureRef = parseScriptureRef;
  window.renderCircuitAssemblyHtml = renderCircuitAssemblyHtml;'''

assert target6 in code, "Target 6 not found"
code = code.replace(target6, repl6, 1)

with open("app_logic.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully patched app_logic.js with circuit assembly feature!")
