import sys, re

with open("app_logic.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update isAllowedJwOrgShareUrl
target1 = 'return !!(q.get("lank") || q.get("docid"));'
repl1 = 'return !!(q.get("lank") || q.get("docid") || (q.get("pub") && q.get("bible")));'
assert target1 in code, "Target 1 not found"
code = code.replace(target1, repl1, 1)

# 2. Add Scripture Popup and Formatting Functions above jwBadgeKindLabels
target2 = '  // What a badge is for (tooltip / aria-label; the visible text is always just "JW.ORG").\n  function jwBadgeKindLabels() {'

scripture_funcs = '''  // --- Scripture Citations and Mini Popup Modal ---
  var cachedBibleCitationRegex = null;
  function getBibleCitationRegex() {
    if (cachedBibleCitationRegex) return cachedBibleCitationRegex;
    if (typeof BIBLE_CITED_VERSES === "undefined" || !BIBLE_CITED_VERSES.aliases) return null;
    var keys = Object.keys(BIBLE_CITED_VERSES.aliases).sort(function (a, b) { return b.length - a.length; });
    var esc = keys.map(function (a) { return a.replace(/[\\^$*+?.()|[\\]{}\\\\/]/g, "\\\\$&"); }).join("|");
    try {
      cachedBibleCitationRegex = new RegExp("(^|[^\\\\p{L}\\\\p{M}\\\\d_])(" + esc + ")\\\\s+(\\\\d+)(?:\\\\s*:\\\\s*([\\\\d\\\\s,–~-]+(?:\\\\b|\\\\d)))?", "gui");
    } catch (e) {
      cachedBibleCitationRegex = null;
    }
    return cachedBibleCitationRegex;
  }

  function formatScriptureHtml(html) {
    if (!html || typeof html !== "string") return html;
    var re = getBibleCitationRegex();
    if (!re) return html;
    var parts = html.split(/(<[^>]+>)/g);
    for (var i = 0; i < parts.length; i += 2) {
      if (!parts[i]) continue;
      parts[i] = parts[i].replace(re, function (match, pre, book, ch, vs) {
        var citation = (book + " " + ch + (vs ? ":" + vs.trim() : "")).trim();
        return (pre || "") + '<span class="scripture-badge" data-scripture-ref="' + escapeAttr(citation) + '" role="button" tabindex="0">' + escapeHtml(citation) + '</span>';
      });
    }
    return parts.join("");
  }

  var ONE_CHAPTER_BOOKS = [31, 57, 63, 64, 65];

  function parseScriptureRef(refStr) {
    if (!refStr || typeof refStr !== "string") return null;
    var s = refStr.trim().replace(/^[\\(\\[\\{\\s“"\'\\.,—]+|[\\)\\]\\}\\s“"\'\\.,—]+$/g, "");
    var m = s.match(/^([123]\\s+[^\\d:]+|[^\\d:]+)\\s+(\\d+)(?:\\s*:\\s*(.*))?$/);
    if (!m) return null;
    var bNameRaw = m[1].trim();
    var chNum = parseInt(m[2], 10);
    var vPart = m[3] ? m[3].trim() : "";

    if (typeof BIBLE_CITED_VERSES === "undefined") return null;
    var aliases = BIBLE_CITED_VERSES.aliases || {};
    var bNum = aliases[bNameRaw.toLowerCase()];
    if (!bNum) {
      bNum = aliases[bNameRaw.toLowerCase().replace(/-/g, " ").replace(/\\s+/g, " ").trim()];
    }
    if (!bNum) return null;

    var chapter = chNum;
    var verses = [];
    if (ONE_CHAPTER_BOOKS.indexOf(bNum) >= 0 && !vPart) {
      chapter = 1;
      verses = [chNum];
    } else if (vPart) {
      var parts = vPart.split(/[,;、]/);
      parts.forEach(function (p) {
        p = p.trim();
        if (!p) return;
        var mRange = p.match(/^(\\d+)\\s*[-–~]\\s*(\\d+)$/);
        if (mRange) {
          var start = parseInt(mRange[1], 10), end = parseInt(mRange[2], 10);
          if (start <= end && end - start <= 50) {
            for (var v = start; v <= end; v++) verses.push(v);
          }
        } else {
          var mSingle = p.match(/^(\\d+)/);
          if (mSingle) verses.push(parseInt(mSingle[1], 10));
        }
      });
      verses = Array.from(new Set(verses)).sort(function (a, b) { return a - b; });
    } else {
      verses = [1];
    }

    return {
      book: bNum,
      chapter: chapter,
      verses: verses,
      raw: refStr
    };
  }

  // 12 Standard Languages (GEMINI.md standard order A~L)
  var SCRIPTURE_STD_LANGS = [
    { code: "vi", letter: "A", name: "Tiếng Việt", wt: "VT" },
    { code: "cs", letter: "B", name: "Čeština", wt: "B" },
    { code: "zh_cn", letter: "C", name: "简体中文", wt: "CHS" },
    { code: "zh", letter: "D", name: "繁體中文", wt: "CH" },
    { code: "en", letter: "E", name: "English", wt: "E" },
    { code: "fr", letter: "F", name: "Français", wt: "F" },
    { code: "de", letter: "G", name: "Deutsch", wt: "X" },
    { code: "hu", letter: "H", name: "Magyar", wt: "H" },
    { code: "id", letter: "I", name: "Bahasa Indonesia", wt: "IN" },
    { code: "ja", letter: "J", name: "日本語", wt: "J" },
    { code: "ko", letter: "K", name: "한국어", wt: "KO" },
    { code: "pl", letter: "L", name: "Polski", wt: "P" }
  ];

  var activeScriptureModal = null;

  function closeScripturePopup() {
    if (activeScriptureModal) {
      activeScriptureModal.remove();
      activeScriptureModal = null;
    }
  }

  function openScripturePopup(refStr) {
    closeScripturePopup();
    if (typeof BIBLE_CITED_VERSES === "undefined") return;
    var parsed = parseScriptureRef(refStr);
    if (!parsed) return;

    var bNum = parsed.book;
    var chapter = parsed.chapter;
    var verses = parsed.verses;

    var selTargetLang = (currentLang && currentLang !== "vi") ? currentLang : "ko";
    if (!SCRIPTURE_STD_LANGS.some(function (l) { return l.code === selTargetLang; })) {
      selTargetLang = "ko";
    }

    var backdrop = document.createElement("div");
    backdrop.className = "scripture-popup-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");

    var card = document.createElement("div");
    card.className = "scripture-popup-card";

    function padZero(n, width) {
      var s = String(n);
      while (s.length < width) s = "0" + s;
      return s;
    }

    function getJwShareUrl(langCode) {
      var langObj = SCRIPTURE_STD_LANGS.find(function (l) { return l.code === langCode; }) || SCRIPTURE_STD_LANGS[0];
      var wtLocale = langObj.wt || "VT";
      var firstV = verses[0] || 1;
      var bibleCode = padZero(bNum, 2) + padZero(chapter, 3) + padZero(firstV, 3);
      return "https://www.jw.org/finder?srcid=jwlshare&wtlocale=" + wtLocale + "&prefer=lang&pub=nwt&bible=" + bibleCode;
    }

    function renderModalContent() {
      var viBookName = (BIBLE_CITED_VERSES.books["vi"] && BIBLE_CITED_VERSES.books["vi"][String(bNum)]) || ("Sách " + bNum);
      var targetLangObj = SCRIPTURE_STD_LANGS.find(function (l) { return l.code === selTargetLang; }) || SCRIPTURE_STD_LANGS[10];
      var targetBookName = (BIBLE_CITED_VERSES.books[selTargetLang] && BIBLE_CITED_VERSES.books[selTargetLang][String(bNum)]) || viBookName;

      var versesText = verses.length > 1 ? (verses[0] + "-" + verses[verses.length - 1]) : String(verses[0] || 1);
      if (verses.length > 1 && (verses[verses.length - 1] - verses[0] + 1 !== verses.length)) {
        versesText = verses.join(", ");
      }
      var viTitleRef = viBookName + " " + chapter + ":" + versesText;
      var targetTitleRef = targetBookName + " " + chapter + ":" + versesText;

      var viLines = [];
      var viFullSpeech = [];
      verses.forEach(function (v) {
        var key = bNum + ":" + chapter + ":" + v;
        var vData = BIBLE_CITED_VERSES.verses[key];
        var text = (vData && vData["vi"]) || "";
        if (text) {
          viLines.push('<div class="scripture-verse-line"><span class="scripture-vnum">' + v + '</span>' + escapeHtml(text) + '</div>');
          viFullSpeech.push(text);
        }
      });
      if (!viLines.length) {
        viLines.push('<div class="scripture-verse-line">' + escapeHtml(refStr) + '</div>');
      }

      var targetLines = [];
      var targetFullSpeech = [];
      verses.forEach(function (v) {
        var key = bNum + ":" + chapter + ":" + v;
        var vData = BIBLE_CITED_VERSES.verses[key];
        var text = (vData && vData[selTargetLang]) || "";
        if (text) {
          targetLines.push('<div class="scripture-verse-line"><span class="scripture-vnum">' + v + '</span>' + escapeHtml(text) + '</div>');
          targetFullSpeech.push(text);
        }
      });
      if (!targetLines.length) {
        targetLines.push('<div class="scripture-verse-line" style="color:var(--ink-muted); font-style:italic;">' + TU("해당 언어의 성구 본문은 아래 JW.ORG 바로가기에서 확인할 수 있습니다.") + '</div>');
      }

      var jwUrl = getJwShareUrl(selTargetLang);

      var langPillsHtml = SCRIPTURE_STD_LANGS.map(function (l) {
        var isSelected = l.code === selTargetLang;
        return '<button type="button" class="scripture-lang-pill" data-sc-lang="' + l.code + '" aria-selected="' + (isSelected ? "true" : "false") + '">' +
          l.letter + ': ' + escapeHtml(l.name) + '</button>';
      }).join("");

      var html = '<div class="scripture-popup-head">' +
        '<h3 class="scripture-popup-title"><span>📖</span> ' + escapeHtml(viTitleRef) + ' <span style="font-size:0.85em;color:var(--ink-muted);font-weight:normal;">/ ' + escapeHtml(targetTitleRef) + '</span></h3>' +
        '<button type="button" class="scripture-popup-close" aria-label="' + TU("닫기") + '">✕</button>' +
        '</div>' +
        '<div class="scripture-lang-bar">' + langPillsHtml + '</div>' +
        '<div class="scripture-popup-body">' +
          '<div class="scripture-section">' +
            '<div class="scripture-section-head">' +
              '<span>A: Tiếng Việt (신세계역)</span>' +
              '<button type="button" class="speak-btn sc-speak-vi" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '</div>' +
            '<div class="scripture-box box-vi scripture-vi vn" lang="vi">' + viLines.join("") + '</div>' +
            '<div class="scripture-hint">' + TU("💡 베트남어 단어를 터치하면 발음과 뜻을 확인할 수 있습니다.") + '</div>' +
          '</div>' +
          '<div class="scripture-section">' +
            '<div class="scripture-section-head">' +
              '<span>' + targetLangObj.letter + ': ' + escapeHtml(targetLangObj.name) + ' (' + TU("신세계역") + ')</span>' +
              (targetFullSpeech.length ? '<button type="button" class="speak-btn sc-speak-target" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' : '') +
            '</div>' +
            '<div class="scripture-box box-target">' + targetLines.join("") + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="scripture-popup-foot">' +
          '<button type="button" class="btn btn-secondary btn-sm sc-btn-dismiss">' + TU("닫기") + '</button>' +
          '<a class="btn-jw-scripture" href="' + escapeAttr(jwUrl) + '" target="_blank" rel="noopener noreferrer">JW.ORG ' + escapeHtml(targetLangObj.name) + ' 바로가기 ↗</a>' +
        '</div>';

      card.innerHTML = html;

      card.querySelector(".scripture-popup-close").addEventListener("click", closeScripturePopup);
      card.querySelector(".sc-btn-dismiss").addEventListener("click", closeScripturePopup);

      var viSpeakBtn = card.querySelector(".sc-speak-vi");
      if (viSpeakBtn) {
        viSpeakBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          speak(viFullSpeech.join(" "));
        });
      }

      var targetSpeakBtn = card.querySelector(".sc-speak-target");
      if (targetSpeakBtn) {
        targetSpeakBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          try {
            var tag = READALL_LANG_TAG[selTargetLang] || "en-US";
            robustSpeak({ text: targetFullSpeech.join(" "), lang: tag });
          } catch (err) {}
        });
      }

      card.querySelectorAll(".scripture-lang-pill").forEach(function (pill) {
        pill.addEventListener("click", function (e) {
          e.stopPropagation();
          selTargetLang = pill.dataset.scLang;
          renderModalContent();
        });
      });
    }

    renderModalContent();
    backdrop.appendChild(card);

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeScripturePopup();
    });

    document.body.appendChild(backdrop);
    activeScriptureModal = backdrop;
  }

'''

assert target2 in code, "Target 2 not found"
code = code.replace(target2, scripture_funcs + target2, 1)

# 3. Bilingual Reader
target3 = 'html += \'<div class="reader-row"><div class="reader-text"><div class="vn reader-vi">\' + escapeHtml(p[0]) + \'</div>\' +\n        (p[1] ? \'<div class="reader-tr">\' + escapeHtml(p[1]) + \'</div>\' : \'\') + \'</div>\' +'
repl3 = 'html += \'<div class="reader-row"><div class="reader-text"><div class="vn reader-vi">\' + formatScriptureHtml(escapeHtml(p[0])) + \'</div>\' +\n        (p[1] ? \'<div class="reader-tr">\' + formatScriptureHtml(escapeHtml(p[1])) + \'</div>\' : \'\') + \'</div>\' +'
assert target3 in code, "Target 3 not found"
code = code.replace(target3, repl3, 1)

# 4. Neighbor conversations
target4 = '<div class="talk-body"><div class="talk-vi">\' + escapeHtml(l.vi) +\n          \'<button class="speak-btn" data-speak="\' + escapeAttr(l.vi) + \'" aria-label="\' + TU("발음 듣기") + \'"><svg class="speaker-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></button></div>\' +\n          \'<div class="talk-kr"><span class="talk-kr-text">\' + escapeHtml(l.kr) + \'</span>\''
# Let's match target4 more flexibly
idx4 = code.find('neighborWhoLabel(l.who))')
assert idx4 != -1, "neighborWhoLabel not found"
sub4 = code[idx4:idx4+700]
sub4_new = sub4.replace("escapeHtml(l.vi)", "formatScriptureHtml(escapeHtml(l.vi))", 1)
sub4_new = sub4_new.replace("escapeHtml(l.kr)", "formatScriptureHtml(escapeHtml(l.kr))", 1)
code = code[:idx4] + sub4_new + code[idx4+700:]

# 5. Daily conversations
idx5 = code.find('dailyWhoLabel(t.who))')
assert idx5 != -1, "dailyWhoLabel not found"
sub5 = code[idx5:idx5+700]
sub5_new = sub5.replace("escapeHtml(t.vi)", "formatScriptureHtml(escapeHtml(t.vi))", 1)
sub5_new = sub5_new.replace("escapeHtml(t.kr)", "formatScriptureHtml(escapeHtml(t.kr))", 1)
code = code[:idx5] + sub5_new + code[idx5+700:]

# 6. Curr Lff
idx6 = code.find('renderCurrLff(q)')
assert idx6 != -1, "renderCurrLff not found"
idx6_loop = code.find('lineUnits.forEach(function (l) {', idx6)
sub6 = code[idx6_loop:idx6_loop+600]
sub6_new = sub6.replace("escapeHtml(l.vi)", "formatScriptureHtml(escapeHtml(l.vi))", 1)
sub6_new = sub6_new.replace("escapeHtml(l.kr)", "formatScriptureHtml(escapeHtml(l.kr))", 1)
code = code[:idx6_loop] + sub6_new + code[idx6_loop+600:]

# 7. Curr Lpd
idx7 = code.find('renderCurrLpd()')
assert idx7 != -1, "renderCurrLpd not found"
idx7_loop = code.find('lineUnits.forEach(function (l) {', idx7)
sub7 = code[idx7_loop:idx7_loop+600]
sub7_new = sub7.replace("escapeHtml(l.vi)", "formatScriptureHtml(escapeHtml(l.vi))", 1)
sub7_new = sub7_new.replace("escapeHtml(l.kr)", "formatScriptureHtml(escapeHtml(l.kr))", 1)
code = code[:idx7_loop] + sub7_new + code[idx7_loop+600:]

# 8. Vocab Watchtower examples
target8 = '<div class="rhyme-word-ex"><span class="vn">\' + escapeHtml(wtExampleVi(w)) + \'</span>\''
repl8 = '<div class="rhyme-word-ex"><span class="vn">\' + formatScriptureHtml(escapeHtml(wtExampleVi(w))) + \'</span>\''
assert target8 in code, "Target 8 not found"
code = code.replace(target8, repl8, 1)

target8_m = '(w.example_mean ? \'<div class="rhyme-word-ex-mean">\' + escapeHtml(T(w.example_mean)) + \'</div>\' : \'\')'
repl8_m = '(w.example_mean ? \'<div class="rhyme-word-ex-mean">\' + formatScriptureHtml(escapeHtml(T(w.example_mean))) + \'</div>\' : \'\')'
assert target8_m in code, "Target 8_m not found"
code = code.replace(target8_m, repl8_m, 1)

# 9. Song detail scriptures
target9 = '(viScripture ? \'<div class="song-detail-vi-scripture vn">\' + escapeHtml(viScripture) + \'</div>\' : \'\') +\n        (targetScripture ? \'<div class="song-detail-target-scripture">\' + escapeHtml(targetScripture) + \'</div>\' : \'\')'
repl9 = '(viScripture ? \'<div class="song-detail-vi-scripture vn">\' + formatScriptureHtml(escapeHtml(viScripture)) + \'</div>\' : \'\') +\n        (targetScripture ? \'<div class="song-detail-target-scripture">\' + formatScriptureHtml(escapeHtml(targetScripture)) + \'</div>\' : \'\')'
assert target9 in code, "Target 9 not found"
code = code.replace(target9, repl9, 1)

# 10. Document click handler
target10 = '''  document.addEventListener("click", function (e) {
    if (lyricWordPop && e.target.closest && !e.target.closest(".lyric-word-pop")) lyricWordClose();
    if (currentLang !== "ko" || !e.target.closest) return;
    if (e.target.closest("button, a, input, select, textarea, .speak-btn, .phrase-star, .phrase-del, .curr-link-btn, .jw-link, .dict-link, .reading-btn, .lff-part-head, .group-head, .subtab-btn, .tab-btn, .nav-item, .pill-btn, .btn, .icon-btn")) return;
    if (e.target.closest(".talk-kr, .reader-tr, .card-translation, .rhyme-word-ex-mean, .rw-gloss, .song-target-row, .lyric-target, .lyric-target-row, .pdf-sent-num, .target-lang, .target-translation, .tr-text, .tr-row")) return;
    if (window.getSelection && String(window.getSelection()).length) return;
    var el = e.target.closest(".lyric-vi, .talk-vi, .reader-vi, .pdf-sent-head, .rhyme-word-ex, .rhyme-word-main, .bilingual-title-vi, .wt-article-vi, .lff-title-vi, .lpd-title-vi, .vocab-vi, .word-vi, .term-vi, .example-vi, .curr-item-vi, .curr-text-vi, .curr-title-vi, .curr-item-text, .conv-vi, .dial-vi, .grammar-vi, .grammar-ex-vi, .pattern-vi, .sb-vi, .scripture-vi, .verse-vi, [lang='vi'], .vn, .vietnamese-text") || e.target;
    var word = lyricWordAt(el, e.clientX, e.clientY);
    if (!word) return;
    var dict = vietWordDictionary(), key = lyricWordKey(word.text);
    var isLyric = !!(el.closest && el.closest(".lyric-vi"));
    if (isLyric || (dict && dict.meaning && dict.meaning[key])) {
      lyricWordShow(word);
    }
  });'''

repl10 = '''  document.addEventListener("click", function (e) {
    if (lyricWordPop && e.target.closest && !e.target.closest(".lyric-word-pop")) lyricWordClose();
    if (!e.target.closest) return;
    var scBadge = e.target.closest(".scripture-badge");
    if (scBadge) {
      e.preventDefault();
      var ref = scBadge.dataset.scriptureRef || scBadge.textContent.trim();
      openScripturePopup(ref);
      return;
    }
    if (currentLang !== "ko" && !e.target.closest(".scripture-vi, .verse-vi")) return;
    if (e.target.closest("button, a, input, select, textarea, .speak-btn, .phrase-star, .phrase-del, .curr-link-btn, .jw-link, .dict-link, .reading-btn, .lff-part-head, .group-head, .subtab-btn, .tab-btn, .nav-item, .pill-btn, .btn, .icon-btn")) return;
    if (e.target.closest(".talk-kr, .reader-tr, .card-translation, .rhyme-word-ex-mean, .rw-gloss, .song-target-row, .lyric-target, .lyric-target-row, .pdf-sent-num, .target-lang, .target-translation, .tr-text, .tr-row, .box-target")) return;
    if (window.getSelection && String(window.getSelection()).length) return;
    var el = e.target.closest(".lyric-vi, .talk-vi, .reader-vi, .pdf-sent-head, .rhyme-word-ex, .rhyme-word-main, .bilingual-title-vi, .wt-article-vi, .lff-title-vi, .lpd-title-vi, .vocab-vi, .word-vi, .term-vi, .example-vi, .curr-item-vi, .curr-text-vi, .curr-title-vi, .curr-item-text, .conv-vi, .dial-vi, .grammar-vi, .grammar-ex-vi, .pattern-vi, .sb-vi, .scripture-vi, .verse-vi, [lang='vi'], .vn, .vietnamese-text") || e.target;
    var word = lyricWordAt(el, e.clientX, e.clientY);
    if (!word) return;
    var dict = vietWordDictionary(), key = lyricWordKey(word.text);
    var isLyricOrScripture = !!(el.closest && el.closest(".lyric-vi, .scripture-vi, .verse-vi"));
    if (isLyricOrScripture || (dict && dict.meaning && dict.meaning[key])) {
      lyricWordShow(word);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && activeScriptureModal) {
      closeScripturePopup();
    }
  });'''

assert target10 in code, "Target 10 not found"
code = code.replace(target10, repl10, 1)

# 11. Window exports
target11 = '  window.lyricWordClose = lyricWordClose;'
repl11 = '''  window.lyricWordClose = lyricWordClose;
  window.openScripturePopup = openScripturePopup;
  window.closeScripturePopup = closeScripturePopup;
  window.formatScriptureHtml = formatScriptureHtml;
  window.parseScriptureRef = parseScriptureRef;'''
assert target11 in code, "Target 11 not found"
code = code.replace(target11, repl11, 1)

with open("app_logic.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully patched app_logic.js!")
