(function () {
  "use strict";

  /* ---------------- language switching (ko / zh-TW / en / ja / de / fr / pl / cs / hu) ---------------- */
  // currentLang drives which translation is shown for any {ko,zh,en,ja,de,fr,pl,cs,hu}-shaped
  // content field. Content not yet converted to that shape is left as a plain string, and T()
  // below returns it unchanged in every language -- this lets the multi-language rollout happen
  // field-by-field across the app without ever breaking anything not yet converted.
  // NOTE: cs/hu are common-infrastructure-only for now (this switch, the UI dictionary fallback
  // chain, html lang, system-language detection, path entry points, compact mobile tab labels).
  // No I18N_UI dictionary entries or content-data cs/hu fields have been added yet -- until they
  // are, cs/hu mode falls back to Korean throughout the app via T()/TU()'s existing fallback
  // chains, exactly like a not-yet-translated field does in any other language mode.
  var VALID_LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"];
  // With no saved preference yet (first visit, or localStorage unavailable), use the
  // device/browser's system language: Korean -> ko, Chinese -> zh, Japanese -> ja, German -> de,
  // French -> fr, Polish -> pl, Czech -> cs, Hungarian -> hu, and English plus every other
  // system language (including ones this app has no UI for) -> en.
  function detectSystemLang() {
    try {
      var navLang = String(
        (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || ""
      ).toLowerCase();
      var languageCode = navLang.split(/[-_]/)[0];
      if (languageCode === "vi") return "vi";
      if (languageCode === "cs") return "cs";
      if (languageCode === "zh") {
        if (/-(cn|hans|sg)/i.test(navLang)) return "zh_cn";
        return "zh";
      }
      if (languageCode === "en") return "en";
      if (languageCode === "fr") return "fr";
      if (languageCode === "de") return "de";
      if (languageCode === "hu") return "hu";
      if (languageCode === "id") return "id";
      if (languageCode === "ja") return "ja";
      if (languageCode === "ko") return "ko";
      if (languageCode === "pl") return "pl";
    } catch (e) { /* no-op: navigator unavailable */ }
    return "en";
  }
  // A first path segment of /ko, /en, /zt, /ja, /de, /fr, /pl, /cs, or /hu (see _redirects, which
  // rewrites each of these paths to this same page) picks the language mode directly, ahead of
  // any saved preference -- this is what lets hoc.tieng.viet.mobile/ko etc. work as direct entry points.
  var PATH_LANG_MAP = {
    vi: "vi",
    cs: "cs",
    zh_cn: "zh_cn",
    cn: "zh_cn",
    zh: "zh",
    zt: "zh",
    en: "en",
    fr: "fr",
    de: "de",
    hu: "hu",
    id: "id",
    ja: "ja",
    ko: "ko",
    pl: "pl"
  };
  function detectLangFromPath() {
    try {
      var seg = (String(window.location.pathname || "").split("/")[1] || "").toLowerCase();
      if (Object.prototype.hasOwnProperty.call(PATH_LANG_MAP, seg)) return PATH_LANG_MAP[seg];
    } catch (e) { /* no-op: location unavailable */ }
    return null;
  }
  var langFromPath = detectLangFromPath();
  var currentLang = langFromPath || (function () {
    try {
      var saved = window.localStorage && window.localStorage.getItem("vn-app-lang");
      if (VALID_LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) { /* no-op: localStorage unavailable */ }
    return detectSystemLang();
  })();
  if (langFromPath) {
    try { window.localStorage && window.localStorage.setItem("vn-app-lang", langFromPath); } catch (e) { /* no-op */ }
  }
  // Browser-tab title per language (same wording as the "베트남어 학습반" I18N_UI entry below) --
  // kept as its own small map, rather than reading I18N_UI, so it's available before I18N_UI is
  // defined and so document.title can be set immediately, before the rest of the app boots.
  // SITE_TITLE_BY_LANG (assemble_app.py's build_site_identity_prelude, defined just above this
  // script when present) overrides this per-site -- e.g. JW's own "JW 베트남어 학습" wording --
  // so the browser-tab title tracks the site actually being served, not just the shared default.
  var TITLE_BY_LANG = typeof SITE_TITLE_BY_LANG !== "undefined" ? SITE_TITLE_BY_LANG : {
    vi: "Học tiếng Việt",
    cs: "Studium vietnamštiny",
    zh_cn: "越南语学习",
    zh: "越南語學習",
    en: "Vietnamese Learning",
    fr: "Apprentissage du vietnamien",
    de: "Vietnamesisch lernen",
    hu: "Vietnami nyelvtanulás",
    id: "Belajar Bahasa Vietnam",
    ja: "ベトナム語学習",
    ko: "베트남어 학습",
    pl: "Nauka wietnamskiego"
  };
  try { document.title = TITLE_BY_LANG[currentLang] || document.title; } catch (e) { /* no-op */ }
  // Languages added after most curated (non-Excel-full) datasets were authored -- those datasets
  // only ever have ko/vi/zh/en/ja fields, so a plain field[currentLang] lookup always misses for
  // these 5 and used to fall through to field.ko, silently showing Korean as if it were the
  // selected language's translation. T() still falls back to ko for the *original* 4 (zh/en/ja
  // missing a single field within an otherwise-covered object, e.g. some LFF_CONVERSATIONS
  // lines), since that gap is a real, isolated content omission rather than "this language was
  // never supported here."
  var T_EXTENDED_LANGS_NO_FALLBACK = ["vi", "cs", "zh_cn", "fr", "de", "hu", "id", "pl"];
  function T(field) {
    if (field === null || field === undefined) return field;
    if (typeof field === "string") return field;
    // A key that's *present* (even as "" or null) means this field explicitly has no content in
    // that language -- normalize to "" for the renderer rather than cascade to Korean or let a
    // raw null through. Only a genuinely *missing* key (undefined) falls through below.
    var v = field[currentLang];
    if (v !== undefined) return v || "";
    if (T_EXTENDED_LANGS_NO_FALLBACK.indexOf(currentLang) >= 0) return "";
    return field.ko || field.cs || field.zh_cn || field.zh || field.en || field.fr || field.de || field.hu || field.id || field.ja || field.pl || "";
  }
  // T()'s graceful Korean fallback is exactly right for CONTENT DISPLAY (an untranslated field
  // should still show something rather than go blank), but it's wrong for review pools: a field
  // that has no zh/en/ja/de/fr/pl/cs/hu entry yet (e.g. some LFF_CONVERSATIONS lines are missing
  // 'zh' entirely) would otherwise offer a Korean-language flashcard/multiple-choice option while
  // the UI is in a non-Korean mode. Tstrict() returns null instead of silently falling back to a
  // different language, so review-pool builders can skip that item in this language rather than
  // leak it. ko itself is always "available" (either field.ko or, for not-yet-multilingual
  // content, the plain string IS the Korean text).
  // Shared by the "group-card" title header markup (LFF/daily/neighbor conversations): the
  // "· <translation>" suffix after the Vietnamese title. Now that T() can return "" for a
  // language a curated (non-Excel-full) dataset never covers, this keeps that gap from showing
  // as a bare, dangling "· " with nothing after it.
  function titleTrSpan(title) {
    var tr = T(title);
    return tr ? ' <span class="lff-title-translation">· ' + escapeHtml(tr) + '</span>' : '';
  }
  function Tstrict(field) {
    if (field === null || field === undefined) return null;
    if (typeof field === "string") return currentLang === "ko" ? field : null;
    // A present-but-empty "ko" means "no Korean translation" (never substitute another language for it).
    if (currentLang === "ko" && Object.prototype.hasOwnProperty.call(field, "ko")) return field.ko || null;
    if (currentLang === "ko") return field.ko || field.cs || field.zh_cn || field.zh || field.en || field.fr || field.de || field.hu || field.id || field.ja || field.pl || null;
    return field[currentLang] || null;
  }
  var LANG_CHANGE_LISTENERS = [];
  function onLangChange(fn) { LANG_CHANGE_LISTENERS.push(fn); }
  window.setLang = setLang; // hook used by tests/test_browser_runtime.js
  // GENERAL PDF learning material: the example character "Se-ho / 세호" is presented as "Min-su / 민수".
  (function renameGeneralPdfCharacters() {
    if (typeof GENERAL_PDF === "undefined" || !GENERAL_PDF) return;
    var fix = function (v) {
      if (typeof v === "string") return v.replace(/Se-ho/g, "Min-su").replace(/세호/g, "민수");
      if (Array.isArray(v)) { for (var i = 0; i < v.length; i++) v[i] = fix(v[i]); return v; }
      if (v && typeof v === "object") { Object.keys(v).forEach(function (k) { if (k !== "sources" && k !== "id") v[k] = fix(v[k]); }); }
      return v;
    };
    ["words", "sentences", "grammar"].forEach(function (k) { if (GENERAL_PDF[k]) fix(GENERAL_PDF[k]); });
    // [문장] Korean meanings: one form per address word and no bracketed notes
    // (형/오빠 -> 형, 누나/언니 -> 언니, 나(형/오빠) -> 형, 나(누나/언니) -> 언니, 저(동생) -> 저, "(...)" removed).
    var simplifyKo = function (s) {
      return s
        .replace(/나\(형\/오빠\)/g, "형").replace(/나\(누나\/언니\)/g, "언니").replace(/저\(동생\)/g, "저")
        .replace(/형([가-힣]*)\s*\/\s*오빠([가-힣]*)/g, function (m, p1, p2) { return "형" + (p1 || p2); })
        .replace(/누나[가-힣]*\s*\/\s*언니/g, "언니")
        .replace(/\s*\([^()]*\)/g, "")
        .replace(/\s+([?!.,])/g, "$1").trim();
    };
    (GENERAL_PDF.sentences || []).forEach(function (r) {
      if (r.translations && typeof r.translations.ko === "string") r.translations.ko = simplifyKo(r.translations.ko);
    });
  })();
  function setLang(lang) {
    if (VALID_LANGS.indexOf(lang) < 0) return;
    currentLang = lang;
    try { window.localStorage && window.localStorage.setItem("vn-app-lang", lang); } catch (e) { /* no-op */ }
    var htmlLang = lang === "vi" ? "vi" : lang === "cs" ? "cs" : lang === "zh_cn" ? "zh-Hans" : lang === "zh" ? "zh-Hant" : lang === "en" ? "en" : lang === "fr" ? "fr" : lang === "de" ? "de" : lang === "hu" ? "hu" : lang === "id" ? "id" : lang === "ja" ? "ja" : lang === "ko" ? "ko" : lang === "pl" ? "pl" : "en";
    document.documentElement.setAttribute("lang", htmlLang);
    if (document.body) document.body.setAttribute("data-app-lang", lang);
    try { document.title = TITLE_BY_LANG[lang] || document.title; } catch (e) { /* no-op */ }
    LANG_CHANGE_LISTENERS.forEach(function (fn) { try { fn(lang); } catch (e) { /* no-op */ } });
  }

  /* ---------------- pastel droplet slot assignment ---------------- */
  // Every nav box/button (top tabs, every subtab row, study-mode tabs, the language switch, and
  // the 다시 담기/다음 문제/확인 foot-btn action row every study mode ends with) gets one hue
  // from a fixed 10-color rotation -- 자주/분홍/주황/노랑/연두/민트/하늘/파랑/네이비/보라,
  // wrapping back to the 1st color after the 10th -- via a data-pastel="1".."10" attribute that
  // template.html's [data-pastel] rules turn into --pastel-rgb (see the "Pastel droplet
  // buttons" CSS section). Slots are handed out in document order and, once given, never
  // revisited -- see pastelSlotCounter below -- so a button's color stays stable across
  // re-renders. A MutationObserver keeps re-scanning for newly-created buttons this app renders
  // on demand (the wizard's per-conversation stage pills, review's per-category scope tabs, each
  // study mode's own foot-btn row) that didn't exist yet at the previous scan; already-assigned
  // elements are skipped instantly.
  var PASTEL_SLOT_COUNT = 10;
  var PASTEL_SLOT_SELECTOR = ".tab-btn, .subtab-btn, .study-mode-btn, .foot-btn";
  var pastelSlotCounter = 0;
  function assignPastelSlots() {
    document.querySelectorAll(PASTEL_SLOT_SELECTOR).forEach(function (el) {
      if (el.hasAttribute("data-pastel")) return;
      pastelSlotCounter += 1;
      el.setAttribute("data-pastel", String(((pastelSlotCounter - 1) % PASTEL_SLOT_COUNT) + 1));
    });
  }
  assignPastelSlots();
  if (typeof MutationObserver !== "undefined" && document.body) {
    var pastelScanQueued = false;
    var pastelObserver = new MutationObserver(function () {
      if (pastelScanQueued) return;
      pastelScanQueued = true;
      (window.requestAnimationFrame || window.setTimeout)(function () {
        pastelScanQueued = false;
        assignPastelSlots();
      });
    });
    pastelObserver.observe(document.body, { childList: true, subtree: true });
  }

  // I18N_UI: translations for static UI chrome (labels, headings, help text, buttons) that live
  // as literal Korean text in template.html or as literal Korean strings in this file, keyed by
  // the exact Korean source string (so no separate semantic key has to be invented or kept in
  // sync by hand). TU() looks a string up here; if it's not (yet) in the dictionary it falls
  // back to returning the Korean unchanged, same "never breaks, just shows Korean until
  // translated" philosophy as T() above -- this lets translation coverage grow incrementally.
  var I18N_UI = {
    "이전 곡": {"vi": "Bài trước", "cs": "Předchozí píseň", "zh_cn": "上一首", "zh": "上一首", "en": "Previous Song", "fr": "Chant précédent", "de": "Vorheriges Lied", "hu": "Előző ének", "id": "Lagu Sebelumnya", "ja": "前の曲", "pl": "Poprzednia pieśń"},
    "다음 곡": {"vi": "Bài tiếp", "cs": "Další píseň", "zh_cn": "下一首", "zh": "下一首", "en": "Next Song", "fr": "Chant suivant", "de": "Nächstes Lied", "hu": "Következő ének", "id": "Lagu Berikutnya", "ja": "次の曲", "pl": "Następna pieśń"},
    "방향 전환": {"vi": "Đổi chiều", "cs": "Změnit směr", "zh_cn": "切换方向", "zh": "切換方向", "en": "Switch Direction", "fr": "Inverser la direction", "de": "Richtung wechseln", "hu": "Irányváltás", "id": "Tukar Arah", "ja": "方向切替", "pl": "Zmień kierunek"},
    "의미": {"vi": "Ý nghĩa", "cs": "Význam", "zh_cn": "意思", "zh": "意思", "en": "Meaning", "fr": "Sens", "de": "Bedeutung", "hu": "Jelentés", "id": "Arti", "ja": "意味", "pl": "Znaczenie"},
    "눌러서 베트남어 보기": {"vi": "Bấm để xem tiếng Việt", "cs": "Klepnutím zobrazit vietnamštinu", "zh_cn": "点击查看越南语", "zh": "點擊查看越南語", "en": "Tap to see Vietnamese", "fr": "Appuyer pour voir le vietnamien", "de": "Tippen für Vietnamesisch", "hu": "Koppintson a vietnámihoz", "id": "Ketuk untuk Bahasa Vietnam", "ja": "タップしてベトナム語を見る", "pl": "Dotknij, aby zobaczyć wietnamski"},
    "전체 듣기": {"vi": "Nghe tất cả", "cs": "Přehrát vše", "zh_cn": "全部播放", "zh": "全部播放", "en": "Play all", "fr": "Tout écouter", "de": "Alles abspielen", "hu": "Összes lejátszása", "id": "Putar Semua", "ja": "すべて再生", "pl": "Odtwórz wszystko"},
    "정지": {"vi": "Dừng", "cs": "Zastavit", "zh_cn": "停止", "zh": "停止", "en": "Stop", "fr": "Arrêter", "de": "Stopp", "hu": "Leállítás", "id": "Berhenti", "ja": "停止", "pl": "Zatrzymaj"},
    "자동 넘김": {"vi": "Tự động chuyển", "cs": "Automatické přehrávání", "zh_cn": "自动切换", "zh": "自動切換", "en": "Auto-play", "fr": "Défilement auto", "de": "Automatisch weiter", "hu": "Automatikus léptetés", "id": "Lanjut Otomatis", "ja": "自動送り", "pl": "Automatyczne przewijanie"},
    "정답 시 다음 문제": {"vi": "Đúng thì qua câu tiếp", "cs": "Při správné odpovědi na další otázku", "zh_cn": "答对后下一题", "zh": "答對後下一題", "en": "Next question when correct", "fr": "Question suivante si correct", "de": "Bei richtiger Antwort weiter", "hu": "Helyes válasz esetén következő kérdés", "id": "Lanjut jika Benar", "ja": "正解で次の問題", "pl": "Następne pytanie po poprawnej odpowiedzi"},
    "반복 듣기": {"vi": "Nghe lặp lại", "cs": "Opakovat", "zh_cn": "重复播放", "zh": "重複播放", "en": "Repeat", "fr": "Répéter l'écoute", "de": "Wiederholen", "hu": "Ismétlés", "id": "Ulangi", "ja": "繰り返し再生", "pl": "Powtarzaj odtwarzanie"},
    "묵음": {"vi": "Tắt tiếng", "cs": "Ztlumit", "zh_cn": "静音", "zh": "靜音", "en": "Mute", "fr": "Muet", "de": "Stumm", "hu": "Némítás", "id": "Bisu", "ja": "ミュート", "pl": "Wyciszenie"},
    "첫만남": {"vi": "Lần gặp đầu", "cs": "První rozhovor", "zh_cn": "初次见面", "zh": "初次見面", "en": "First Meeting", "fr": "Premier contact", "de": "Erstes Gespräch", "hu": "Első beszélgetés", "id": "Pertemuan Pertama", "ja": "初対面", "pl": "Pierwsza rozmowa"},
    "다음 문제": {"vi": "Câu tiếp theo", "cs": "Další otázka", "zh_cn": "下一题", "zh": "下一題", "en": "Next question", "fr": "Question suivante", "de": "Nächste Frage", "hu": "Következő kérdés", "id": "Pertanyaan Berikutnya", "ja": "次の問題", "pl": "Następne pytanie"},
    "파수대 주차 선택": {"cs": "Vybrat týden Strážné věže", "zh_cn": "选择守望台周次", "zh": "選擇守望台週次", "en": "Select Watchtower Week", "fr": "Choisir la semaine de La Tour de Garde", "de": "Wachtturm-Woche wählen", "hu": "Őrtorony-hét kiválasztása", "id": "Pilih Minggu Menara Pengawal", "ja": "ものみの塔の週を選択", "pl": "Wybierz tydzień Strażnicy"},
    "주차": {"cs": "Týden", "zh_cn": "周", "zh": "週", "en": "Week", "fr": "Semaine", "hu": "Hét", "id": "Minggu ke-", "ja": "週目", "pl": "Tydzień"},
    "초": {"cs": "s", "zh_cn": "秒", "zh": "秒", "en": "s", "fr": "s", "de": "s", "hu": "mp", "id": "dtk", "ja": "秒", "pl": "s"},
    "회": {"cs": "krát", "zh_cn": "次", "zh": "次", "en": "time", "fr": "fois", "de": "Mal", "hu": "alkalom", "id": "kali", "ja": "回", "pl": "razy"},
    "베트남어 반복 듣기 횟수": {"cs": "Počet opakování vietnamštiny", "zh_cn": "越南语重复播放次数", "zh": "越南語重複播放次數", "en": "Vietnamese repeat count", "fr": "Nombre de répétitions audio en vietnamien", "de": "Wiederholungen des vietnamesischen Audios", "hu": "Vietnámi ismétlések száma", "id": "Jumlah pengulangan bahasa Vietnam", "ja": "ベトナム語の繰り返し再生回数", "pl": "Liczba powtórzeń nagrania wietnamskiego"},
    "발음 듣기 버튼을 누르면 베트남어를 몇 번 반복해서 들려줄지 선택하세요.": {"cs": "Vyberte, kolikrát se má vietnamský text zopakovat po stisknutí tlačítka poslechu.", "zh_cn": "选择按下发音按钮时，越南语要重复播放几次。", "zh": "選擇按下發音按鈕時，越南語要重複播放幾次。", "en": "Choose how many times Vietnamese audio repeats each time you press a listen button.", "fr": "Choisissez combien de fois répéter l'audio vietnamien lorsque vous appuyez sur le bouton d'écoute.", "de": "Wählen Sie, wie oft das vietnamesische Audio beim Tippen auf die Audio-Schaltfläche wiederholt werden soll.", "hu": "Válassza ki, hányszor ismétlődjön meg a vietnámi szöveg a meghallgatás gomb megnyomásakor.", "id": "Pilih berapa kali audio bahasa Vietnam diulang setiap kali menekan tombol dengarkan.", "ja": "発音を聞くボタンを押したときに、ベトナム語を何回繰り返して再生するか選んでください。", "pl": "Wybierz, ile razy ma być powtórzone nagranie wietnamskie po naciśnięciu przycisku odsłuchu."},
    "베트남어 성조 ↔ 중국어(표준중국어) 성조 대응": {"cs": "Korespondence vietnamských a mandarínských tónů", "zh_cn": "越南语声调 ↔ 中文（普通话）声调对应", "zh": "越南語聲調 ↔ 中文（普通話）聲調對應", "en": "Vietnamese Tone ↔ Mandarin Chinese Tone Correspondence", "fr": "Correspondance des tons : vietnamien ↔ mandarin standard", "de": "Vietnamesische Töne ↔ Mandarin-Töne Entsprechung", "hu": "Vietnámi tónusok és a mandarin tónusok megfelelése", "id": "Kesesuaian Nada Vietnam ↔ Mandarin", "ja": "ベトナム語の声調 ↔ 中国語（普通話）の声調対応", "pl": "Odpowiedniość tonów: wietnamski ↔ standardowy mandaryński"},
    "위의 한자음 전체 어휘에서, 베트남어 성조와 그에 대응하는 한자의 표준중국어(보통화) 성조 조합을 추출해 분류했어요. 같은 베트남어 성조라도 한자의 옛 중국어 성모(자음의 청탁)에 따라 표준중국어 성조가 갈리는 경우가 있어요.": {"cs": "Z výše uvedené sino-vietnamské slovní zásoby byly extrahovány a roztříděny kombinace vietnamských tónů a odpovídajících tónů standardní mandarínštiny (pchu-tchung-chua).", "zh_cn": "从以上汉字音的全部词汇中，撷取并分类了越南语声调与对应汉字的标准中文（普通话）声调组合。即使是相同的越南语声调，也会因该汉字古汉语声母的清浊不同，而对应到不同的普通话声调。", "zh": "從以上漢字音的全部詞彙中，擷取並分類了越南語聲調與對應漢字的標準中文（普通話）聲調組合。即使是相同的越南語聲調，也會因該漢字古漢語聲母的清濁不同，而對應到不同的普通話聲調。", "en": "This extracts and categorizes, from every word in the Sino-Vietnamese readings above, the pairing of each Vietnamese tone with the Standard Mandarin (Putonghua) tone of its corresponding hanzi. Even the same Vietnamese tone can correspond to different Mandarin tones, depending on whether the character's Old Chinese initial consonant was voiced or voiceless.", "fr": "Cette section extrait et catégorise, à partir de tous les mots sino-vietnamiens ci-dessus, les combinaisons entre chaque ton vietnamien et le ton mandarin correspondant du sinogramme. Pour un même ton vietnamien, le ton mandarin peut varier selon le voisement de la consonne initiale en chinois archaïque.", "de": "Hier werden aus allen obigen sino-vietnamesischen Wörtern die Kombinationen aus vietnamesischem Ton und dem entsprechenden Mandarin-Ton des Schriftzeichens extrahiert und kategorisiert. Selbst beim gleichen vietnamesischen Ton kann der Mandarin-Ton je nach Stimmhaftigkeit des altchinesischen Anlauts variieren.", "hu": "A fenti sino-vietnámi szókincsből kinyertük és osztályoztuk a vietnámi tónusok és a megfelelő standard mandarin (putonghua) tónusok kombinációit.", "id": "Dari seluruh kosakata Sino-Vietnam di atas, kombinasi nada bahasa Vietnam dan nada Mandarin Standar (Putonghua) yang sesuai diekstrak dan diklasifikasikan.", "ja": "上の漢字音の全語彙から、ベトナム語の声調とそれに対応する漢字の標準中国語（普通話）の声調の組み合わせを抽出し、分類しました。同じベトナム語の声調でも、その漢字の古い中国語の声母（子音の清濁）によって、対応する普通話の声調が異なる場合があります。", "pl": "Ta sekcja wyodrębnia i kategoryzuje powiązania między każdym tonem wietnamskim a odpowiadającym mu tonem mandaryńskim ze wszystkich powyższych słów sino-wietnamskich. Nawet przy tym samym tonie wietnamskim ton mandaryński może się różnić w zależności od dźwięczności spółgłoski w języku starochińskim."},
    "이 어휘 목록에는 해당하는 사례가 아직 없어요.": {"cs": "V tomto seznamu slovní zásoby zatím nejsou žádné odpovídající příklady.", "zh_cn": "这份词汇表中目前还没有符合的例子。", "zh": "這份詞彙表中目前還沒有符合的例子。", "en": "There are no matching examples in this word list yet.", "fr": "Il n'y a pas encore d'exemple correspondant dans cette liste de vocabulaire.", "de": "In dieser Wortliste gibt es noch keine passenden Beispiele.", "hu": "Ebben a szókincslistában még nincsenek megfelelő példák.", "id": "Belum ada contoh yang cocok dalam daftar kosakata ini.", "ja": "この語彙リストには、該当する例がまだありません。", "pl": "Na tej liście słów nie ma jeszcze odpowiednich przykładów."},
    "개": {"cs": "", "zh_cn": "个", "zh": "個", "en": "", "fr": "", "de": "", "hu": "", "id": "", "ja": "個", "pl": ""},
    "베트남어 학습": {"vi": "Học tiếng Việt", "cs": "Studium vietnamštiny", "zh_cn": "越南语学习", "zh": "越南語學習", "en": "Vietnamese Learning", "fr": "Apprentissage du vietnamien", "de": "Vietnamesisch lernen", "hu": "Vietnami nyelvtanulás", "id": "Belajar Bahasa Vietnam", "ja": "ベトナム語学習", "ko": "베트남어 학습", "pl": "Nauka wietnamskiego"},
    "JW 베트남어 학습": {"vi": "JW Học tiếng Việt", "cs": "JW Studium vietnamštiny", "zh_cn": "JW 越南语学习", "zh": "JW學習越南語", "en": "JW Vietnamese Learning", "fr": "JW Apprentissage du vietnamien", "de": "JW Vietnamesisch lernen", "hu": "JW Vietnami nyelvtanulás", "id": "JW Belajar Bahasa Vietnam", "ja": "JW 베트남어 학습", "ko": "JW 베트남어 학습", "pl": "JW Nauka wietnamskiego"},
    "베트남어 학습반": {"vi": "Lớp học tiếng Việt", "cs": "Kurz vietnamštiny", "zh_cn": "越南语学习班", "zh": "越南語學習班", "en": "Vietnamese Language Course", "fr": "Cours de vietnamien", "de": "Vietnamesisch-Sprachkurs", "hu": "Vietnámi nyelvtanfolyam", "id": "Kursus Bahasa Vietnam", "ja": "ベトナム語訓練コース", "pl": "Kurs języka wietnamskiego"},
    "한국어": {"vi": "Tiếng Hàn", "zh_cn": "한국어", "zh": "한국어", "en": "한국어", "fr": "한국어", "de": "한국어", "id": "Bahasa Korea", "ja": "한국어", "pl": "한국어"},
    "교과": {"vi": "Giáo trình", "cs": "Učební plán", "zh_cn": "教材", "zh": "教材", "en": "Curriculum", "fr": "Cours", "de": "Lehrplan", "hu": "Tanterv", "id": "Kursus", "ja": "教材", "pl": "Kurs"},
    "발음": {"vi": "Phát âm", "cs": "Výslovnost", "zh_cn": "发音", "zh": "發音", "en": "Phonics", "fr": "Prononciation", "de": "Aussprache", "hu": "Kiejtés", "id": "Pelafalan", "ja": "発音", "pl": "Wymowa"},
    "성경": {"vi": "Kinh Thánh", "cs": "Bible", "zh_cn": "圣经", "zh": "聖經", "en": "Bible", "fr": "Bible", "de": "Bibel", "hu": "Biblia", "id": "Alkitab", "ja": "聖書", "pl": "Biblia"},
    "전주 학습반": {"cs": "Kurz Jeonju", "zh_cn": "全州越南语班", "zh": "全州越南語班", "en": "Jeonju Class", "fr": "Cours de Jeonju", "de": "Jeonju-Kurs", "hu": "Jeonju tanfolyam", "ja": "チョンジュ学習班", "pl": "Kurs w Jeonju"},
    "울산 학습반": {"vi": "Lớp học Ulsan", "cs": "Kurz Ulsan", "zh_cn": "蔚山越南语班", "zh": "蔚山越南語班", "en": "Ulsan Class", "fr": "Cours d'Ulsan", "de": "Ulsan-Kurs", "hu": "Ulsan tanfolyam", "id": "Kelas Ulsan", "ja": "ウルサン学習班", "ko": "울산 학습반", "pl": "Kurs w Ulsan"},
    "자료 미정": {"cs": "Materiál zatím neurčen", "zh_cn": "教材待定", "zh": "教材待定", "en": "Material TBD", "fr": "Contenu à venir", "de": "Material noch offen", "hu": "Anyag még nincs meghatározva", "ja": "資料未定", "pl": "Materiał nieustalony"},
    "대화": {"vi": "Hội thoại", "cs": "Rozhovory", "zh_cn": "对话", "zh": "對話", "en": "Talks", "fr": "Dialogue", "de": "Dialog", "hu": "Beszélgetések", "id": "Percakapan", "ja": "会話", "pl": "Rozmowy"},
    "단어": {"vi": "Từ vựng", "cs": "Slova", "zh_cn": "词汇", "zh": "詞彙", "en": "Words", "fr": "Mots", "de": "Wörter", "hu": "Szavak", "id": "Kata", "ja": "語彙", "pl": "Słowa"},
    "어휘": {"vi": "Từ vựng", "cs": "Slovní zásoba", "zh_cn": "词汇", "zh": "詞彙", "en": "Words", "fr": "Vocabulaire", "de": "Wortschatz", "hu": "Szókincs", "id": "Kosakata", "ja": "語彙", "pl": "Słownictwo"},
    "문장": {"vi": "Mẫu câu", "cs": "Věty", "zh_cn": "句子", "zh": "句子", "en": "Clauses", "fr": "Phrases", "de": "Satz", "hu": "Mondatok", "id": "Kalimat", "ja": "文", "pl": "Zdania"},
    "문법": {"vi": "Ngữ pháp", "cs": "Gramatika", "zh_cn": "文法", "zh": "文法", "en": "Usage", "fr": "Grammaire", "de": "Grammatik", "hu": "Nyelvtan", "id": "Tata Bahasa", "ja": "文法", "pl": "Gramatyka"},
    "복습": {"vi": "Ôn tập", "cs": "Opakování", "zh_cn": "复习", "zh": "複習", "en": "Review", "fr": "Révision", "de": "Wiederholung", "hu": "Áttekintés", "id": "Ulasan", "ja": "復習", "pl": "Powtórka"},
    "예습": {"cs": "Příprava", "zh_cn": "预习", "zh": "預習", "en": "Preview", "fr": "Aperçu", "de": "Vorschau", "hu": "Előzetes áttekintés", "id": "Pratinjau", "ja": "予習", "pl": "Zapowiedź"},
    "주간 수행 과제": {"cs": "Týdenní úkol", "zh_cn": "每周学习作业", "zh": "每週學習作業", "en": "Weekly Assignment", "fr": "Tâche hebdomadaire", "de": "Wöchentliche Aufgaben", "hu": "Heti feladat", "id": "Tugas Mingguan", "ja": "週間の課題", "pl": "Zadanie tygodniowe"},
    "시간": {"cs": "Čas", "zh_cn": "时间", "zh": "時間", "en": "Time", "fr": "Heure", "de": "Uhrzeit", "hu": "Idő", "id": "Waktu", "ja": "時間", "pl": "Czas"},
    "요일, 날짜": {"cs": "Dny v týdnu, datum", "zh_cn": "星期、日期", "zh": "星期、日期", "en": "Days, Dates", "fr": "Jours et dates", "de": "Wochentage, Datum", "hu": "Napok, dátumok", "id": "Hari, Tanggal", "ja": "曜日、日付", "pl": "Dni i daty"},
    "달, 계절": {"cs": "Měsíce, roční období", "zh_cn": "月份、季节", "zh": "月份、季節", "en": "Months, Seasons", "fr": "Mois et saisons", "de": "Monate, Jahreszeiten", "hu": "Hónapok, évszakok", "id": "Bulan, Musim", "ja": "月、季節", "pl": "Miesiące i pory roku"},
    "시": {"cs": "Hodin", "zh_cn": "点", "zh": "點", "en": "Hours", "fr": "Heures", "de": "Uhr", "hu": "Óra", "id": "Jam", "ja": "時", "pl": "Godzina"},
    "시간대": {"cs": "Části dne", "zh_cn": "时段", "zh": "時段", "en": "Times of Day", "fr": "Moments de la journée", "de": "Tageszeiten", "hu": "Napszakok", "id": "Waktu Hari", "ja": "時間帯", "pl": "Pory dnia"},
    "시간 표현 예시": {"cs": "Příklady vyjádření času", "zh_cn": "时间表达范例", "zh": "時間表達範例", "en": "Time Expression Examples", "fr": "Exemples d'expressions de temps", "de": "Beispiele für Zeitangaben", "hu": "Időkifejezések példái", "id": "Contoh Ungkapan Waktu", "ja": "時間表現の例", "pl": "Przykłady określeń czasu"},
    "오늘 학습할 범위": {"cs": "Rozsah dnešního studia", "zh_cn": "今天要学习的范围", "zh": "今天要學習的範圍", "en": "Today's study range", "fr": "Programme d'étude d'aujourd'hui", "de": "Heutiger Lernbereich", "hu": "A mai tanulmányozási anyag", "id": "Materi Belajar Hari Ini", "ja": "今日学習する範囲", "pl": "Dzisiejszy zakres nauki"},
    "전체 보기": {"cs": "Zobrazit vše", "zh_cn": "查看全部", "zh": "查看全部", "en": "Show all", "fr": "Tout afficher", "de": "Alle anzeigen", "hu": "Összes megtekintése", "id": "Lihat Semua", "ja": "すべて見る", "pl": "Pokaż wszystko"},
    "학습반 교과 자료": {"zh_cn": "学习班教材资料", "zh": "學習班教材資料", "en": "Class Curriculum Materials", "fr": "Supports du cours de langue", "de": "Unterrichtsmaterialien", "ja": "学習会教材資料", "pl": "Materiały kursu językowego"},
    "16주 과정 목차, 베트남 문화 이야기, 기도와 노래까지 — 학습반 교재의 자료를 모아 뒀어요. 제공 연설은 대화 탭, 성경 인명 사전·기본 단어는 어휘 탭, 범용 언어 생성표·문법 특강은 문법 탭에 있어요.": {"zh_cn": "从16周课程目录、越南文化故事，到祷告与歌曲——这里收集了学习班教材的所有资料。提供见证的内容在「对话」分页，圣经人名辞典和基本词汇在「词汇」分页，通用语言生成表和文法特別课程在「文法」分页。", "zh": "從16週課程目錄、越南文化故事，到禱告與歌曲——這裡收集了學習班教材的所有資料。提供見證的內容在「對話」分頁，聖經人名辭典和基本詞彙在「詞彙」分頁，通用語言生成表和文法特別課程在「文法」分頁。", "en": "From the 16-week course outline and stories about Vietnamese culture to prayers and songs — all the class materials are gathered here. The offer talks are under the Dialogue tab, the Bible name dictionary and basic vocabulary are under the Vocabulary tab, and the general sentence-pattern chart and grammar features are under the Grammar tab.", "fr": "Du programme de cours en 16 semaines aux récits culturels vietnamiens, prières et cantiques : tous les supports pédagogiques sont réunis ici. Les présentations modèles sont sous l'onglet Dialogue, le dictionnaire des noms bibliques et le vocabulaire de base sous Vocabulaire, et le tableau de génération de phrases sous Grammaire.", "de": "Vom Inhaltsverzeichnis des 16-Wochen-Kurses über vietnamesische Kultur bis hin zu Gebeten und Liedern – alle Kursmaterialien sind hier versammelt. Gesprächsvorschläge finden sich im Tab Dialog, das biblische Namenslexikon und Grundwörter im Tab Wortschatz, die Satzbautabelle und Grammatiklektionen im Tab Grammatik.", "ja": "16週間コースの目次、ベトナムの文化についての話、祈りと歌まで――学習会教材の資料がここにまとめられています。提供のことばは「会話」タブに、聖書人名辞典と基本単語は「語彙」タブに、汎用文型表と文法特別レッスンは「文法」タブにあります。", "pl": "Od spisu treści 16-tygodniowego kursu, przez opisy wietnamskiej kultury, po modlitwy i pieśni — zebrano tu wszystkie materiały kursowe. Wzory rozmów znajdują się w zakładce Rozmowy, słownik imion biblijnych i podstawowe słownictwo w Słownictwie, a tabela tworzenia zdań w Gramatyce."},
    "과정": {"vi": "Khóa học", "cs": "Kurz", "zh_cn": "课程", "zh": "課程", "en": "Course", "fr": "Cours", "de": "Kurs", "hu": "Kurzus", "id": "Kursus", "ja": "コース", "pl": "Kurs"},
    "20주 과정": {"vi": "Khóa học 20 tuần", "cs": "20týdenní kurz", "zh_cn": "20周课程", "zh": "20週課程", "en": "20-Week Course", "fr": "Programme de 20 semaines", "de": "20-Wochen-Kurs", "hu": "20 hetes kurzus", "id": "Kursus 20 minggu", "ja": "20週間コース", "pl": "Kurs 20-tygodniowy"},
    "학습 과정": {"vi": "Khóa học", "cs": "Studijní kurz", "zh_cn": "学习课程", "zh": "學習課程", "en": "Study Course", "fr": "Cours d’étude", "de": "Lernkurs", "hu": "Tanulmányi kurzus", "id": "Kursus belajar", "ja": "学習コース", "pl": "Kurs nauki"},
    "일정 미정": {"vi": "Chưa xác định lịch", "cs": "Rozvrh dosud nestanoven", "zh_cn": "日程未定", "zh": "日程未定", "en": "Schedule TBD", "fr": "Calendrier à déterminer", "de": "Termin noch offen", "hu": "Időbeosztás még nincs meghatározva", "id": "Jadwal belum ditentukan", "ja": "日程未定", "pl": "Harmonogram do ustalenia"},
    "자료 미정": {"vi": "Chưa xác định tài liệu", "cs": "Materiál dosud nestanoven", "zh_cn": "教材资料未定", "zh": "教材資料未定", "en": "Material TBD", "fr": "Support à déterminer", "de": "Material noch offen", "hu": "Tananyag még nincs meghatározva", "id": "Materi belum ditentukan", "ja": "資料未定", "pl": "Materiały do ustalenia"},
    "휴강": {"vi": "Nghỉ học", "cs": "Výuka se nekoná", "zh_cn": "休课", "zh": "停課", "en": "No Class", "fr": "Pas de cours", "de": "Unterrichtsausfall", "hu": "Nincs tanítás", "id": "Libur kelas", "ja": "休講", "pl": "Brak zajęć"},
    "총복습": {"vi": "Tổng ôn tập", "cs": "Celkové opakování", "zh_cn": "总复习", "zh": "總複習", "en": "Comprehensive Review", "fr": "Révision générale", "de": "Gesamtwiederholung", "hu": "Összefoglaló ismétlés", "id": "Tinjauan menyeluruh", "ja": "総復習", "pl": "Powtórzenie całościowe"},
    "예비 모임": {"vi": "Buổi gặp mặt chuẩn bị", "cs": "Přípravné setkání", "zh_cn": "预备聚会", "zh": "預備聚會", "en": "Preliminary Meeting", "fr": "Réunion préparatoire", "de": "Vorbereitungstreffen", "hu": "Előkészítő találkozó", "id": "Pertemuan persiapan", "ja": "予備の集まり", "pl": "Spotkanie wstępne"},
    "문화": {"vi": "Văn hóa", "cs": "Kultura", "zh_cn": "文化", "zh": "文化", "en": "Culture", "fr": "Culture", "de": "Kultur", "hu": "Kultúra", "id": "Budaya", "ja": "文化", "pl": "Kultura"},
    "노래": {"vi": "Bài hát", "cs": "Písně", "zh_cn": "诗歌", "zh": "詩歌", "en": "Songs", "fr": "Chants", "de": "Lieder", "hu": "Énekek", "id": "Lagu", "ja": "歌", "pl": "Pieśni"},
    "기도": {"cs": "Modlitba", "zh_cn": "祷告", "zh": "禱告", "en": "Prayer", "fr": "Prière", "de": "Gebet", "hu": "Ima", "id": "Doa", "ja": "祈り", "pl": "Modlitwa"},
    "노래·기도": {"zh_cn": "歌曲‧祷告", "zh": "歌曲‧禱告", "en": "Songs & Prayer", "fr": "Chants et prières", "de": "Lieder & Gebet", "ja": "歌・祈り", "pl": "Pieśni i modlitwy"},
    "사용설명": {"zh_cn": "使用说明", "zh": "使用說明", "en": "Usage Guide", "fr": "Guide d'utilisation", "de": "Anleitung", "ja": "使い方ガイド", "pl": "Instrukcja obsługi"},
    "공통 기능": {"cs": "Společné funkce", "zh_cn": "通用功能", "zh": "通用功能", "en": "Common Features", "fr": "Fonctions communes", "de": "Allgemeine Funktionen", "hu": "Közös funkciók", "id": "Fitur Umum", "ja": "共通機能", "pl": "Wspólne funkcje"},
    "베트남 사람을 만났을 때": {"zh_cn": "遇到越南人的时候", "zh": "遇到越南人的時候", "en": "When You Meet a Vietnamese Person", "fr": "Rencontrer une personne vietnamienne", "de": "Wenn Sie einer vietnamesischen Person begegnen", "ja": "ベトナム人に会ったとき", "pl": "Gdy spotkasz osobę z Wietnamu"},
    "몇 가지만 답하면, 첫인사부터 자기소개·연락처 교환·재방문·집회 초대·성서 연구 사회까지 실제로 쓸 수 있는 베트남어 대화문을 보여 드려요.": {"zh_cn": "只要回答几个问题，就能看到从打招呼、自我介绍、交换联络方式，到重访、邀请聚会、主持圣经研究都能实际使用的越南语对话。", "zh": "只要回答幾個問題，就能看到從打招呼、自我介紹、交換聯絡方式，到重訪、邀請聚會、主持聖經研究都能實際使用的越南語對話。", "en": "Answer just a few questions and you'll get real Vietnamese dialogues you can use — from the first greeting and self-introduction to exchanging contact info, callbacks, meeting invitations, and even conducting a Bible study.", "fr": "Répondez simplement à quelques questions pour obtenir des dialogues réels en vietnamien : des premières salutations à la présentation de soi, l'échange de coordonnées, les nouvelles visites, l'invitation aux réunions et la conduite d'un cours biblique.", "de": "Beantworten Sie ein paar kurze Fragen, und Sie erhalten praktische vietnamesische Dialoge – von der Begrüßung und Vorstellung über den Kontakttausch, Rückbesuche und Zusammenkunftseinladungen bis hin zum Leiten eines Bibelstudiums.", "ja": "いくつか質問に答えるだけで、最初のあいさつから自己紹介・連絡先交換・再訪問・集会への招待・聖書研究の司会まで、実際に使えるベトナム語の会話文をご紹介します。", "pl": "Odpowiedz na kilka pytań, aby otrzymać praktyczne dialogi po wietnamsku — od powitania i przedstawienia się, przez wymianę kontaktów, odwiedziny ponowne i zaproszenie na zebranie, aż po prowadzenie studium biblijnego."},
    "복습 게임으로 연습하기": {"zh_cn": "用复习游戏来练习", "zh": "用複習遊戲來練習", "en": "Practice with Review Games", "fr": "S'entraîner avec les jeux de révision", "de": "Mit Wiederholungsspielen üben", "ja": "復習ゲームで練習する", "pl": "Ćwicz z grami powtórkowymi"},
    "전체 범위 복습 게임": {"zh_cn": "全范围复习游戏", "zh": "全範圍複習遊戲", "en": "Review Game (All Vocabulary)", "fr": "Jeu de révision (tout le vocabulaire)", "de": "Wiederholungsspiel (Gesamter Wortschatz)", "ja": "全範囲の復習ゲーム", "pl": "Gra powtórkowa (całe słownictwo)"},
    "학습 범위내 복습 게임": {"cs": "Hra na opakování v rozsahu", "zh_cn": "本范围复习游戏", "zh": "本範圍複習遊戲", "en": "Review Game (This Range Only)", "fr": "Jeu de révision (cette sélection)", "de": "Wiederholungsspiel (Nur dieser Bereich)", "hu": "Áttekintő játék ezen a tartományon", "id": "Permainan Ulasan dalam Cakupan", "ja": "この範囲だけの復習ゲーム", "pl": "Gra powtórkowa (tylko ten zakres)"},
    "호칭": {"cs": "Oslovení", "zh_cn": "称呼", "zh": "稱呼", "en": "Terms of Address", "fr": "Termes d'adresse", "de": "Anredeformen", "hu": "Megszólítások", "id": "Panggilan", "ja": "呼び方", "pl": "Formy grzecznościowe"},
    "제공 연설": {"vi": "Bài giảng mẫu", "cs": "Vzorové rozhovory", "zh_cn": "提供见证", "zh": "提供見證", "en": "Offer Talks", "fr": "Présentations modèles", "de": "Gesprächsvorschläge", "hu": "Beszédminták", "id": "Khotbah Contoh", "ja": "提供のことば", "pl": "Wzory rozmów"},
    "참여자 정보": {"cs": "Informace o účastníkovi", "zh_cn": "参与者资讯", "zh": "參與者資訊", "en": "Participant Info", "fr": "Informations sur les interlocuteurs", "de": "Teilnehmer-Info", "hu": "Résztvevő adatai", "id": "Informasi Peserta", "ja": "参加者情報", "pl": "Informacje o rozmówcach"},
    "(입력하면 대화·제공 연설에 자동 반영돼요)": {"cs": "(při zadání se automaticky promítne do rozhovorů)", "zh_cn": "（输入后会自动套用到对话与提供见证）", "zh": "（輸入後會自動套用到對話與提供見證）", "en": "(Enter these and they'll automatically apply to Dialogue and Offer Talks)", "fr": "(Ces informations s'appliquent automatiquement aux dialogues et présentations)", "de": "(Wird automatisch in Dialoge und Gesprächsvorschläge übernommen)", "hu": "(megadás esetén automatikusan megjelenik a beszélgetésekben)", "id": "(jika diisi, akan otomatis diterapkan ke percakapan)", "ja": "（入力すると会話・提供のことばに自動的に反映されます）", "pl": "(Wprowadzone dane automatycznie dostosują dialogi i wzory rozmów)"},
    "나": {"cs": "Já", "zh_cn": "我", "zh": "我", "en": "Me", "fr": "Moi", "de": "Ich", "hu": "Én", "id": "Saya", "ja": "自分", "pl": "Ja"},
    "한국어 이름": {"cs": "Jméno", "zh_cn": "中文姓名", "zh": "中文姓名", "en": "Name", "fr": "Nom", "de": "Name", "hu": "Név", "id": "Nama", "ja": "日本語の名前", "pl": "Imię"},
    "베트남어 이름": {"cs": "Vietnamské jméno", "zh_cn": "越南语姓名", "zh": "越南語姓名", "en": "Vietnamese Name", "fr": "Nom vietnamien", "de": "Vietnamesischer Name", "hu": "Vietnámi név", "id": "Nama Vietnam", "ja": "ベトナム語の名前", "pl": "Wietnamskie imię"},
    "성별": {"cs": "Pohlaví", "zh_cn": "性別", "zh": "性別", "en": "Gender", "fr": "Genre", "de": "Geschlecht", "hu": "Nem", "id": "Jenis Kelamin", "ja": "性別", "pl": "Płeć"},
    "형제": {"cs": "Bratr", "zh_cn": "弟兄", "zh": "弟兄", "en": "Brother", "fr": "Frère", "de": "Bruder", "hu": "Testvér", "id": "Saudara", "ja": "兄弟", "pl": "Brat"},
    "자매": {"cs": "Sestra", "zh_cn": "姐妹", "zh": "姐妹", "en": "Sister", "fr": "Sœur", "de": "Schwester", "hu": "Testvérnő", "id": "Saudari", "ja": "姉妹", "pl": "Siostra"},
    "나이": {"cs": "Věk", "zh_cn": "年龄", "zh": "年齡", "en": "Age", "fr": "Âge", "de": "Alter", "hu": "Életkor", "id": "Usia", "ja": "年齢", "pl": "Wiek"},
    "전화번호": {"cs": "Telefonní číslo", "zh_cn": "电话号碼", "zh": "電話號碼", "en": "Phone Number", "fr": "Numéro de téléphone", "de": "Telefonnummer", "hu": "Telefonszám", "id": "Nomor Telepon", "ja": "電話番号", "pl": "Numer telefonu"},
    "결혼": {"cs": "Sňatek", "zh_cn": "婚姻状况", "zh": "婚姻狀況", "en": "Marital Status", "fr": "État civil", "de": "Familienstand", "hu": "Házasság", "id": "Pernikahan", "ja": "結婚", "pl": "Stan cywilny"},
    "미혼": {"cs": "Svobodný/á", "zh_cn": "未婚", "zh": "未婚", "en": "Single", "fr": "Célibataire", "de": "Ledig", "hu": "Egyedülálló", "id": "Belum Menikah", "ja": "未婚", "pl": "Stan wolny"},
    "기혼": {"cs": "Ženatý/Vdaná", "zh_cn": "已婚", "zh": "已婚", "en": "Married", "fr": "Marié(e)", "de": "Verheiratet", "hu": "Házas", "id": "Menikah", "ja": "既婚", "pl": "W związku małżeńskim"},
    "봉사짝": {"cs": "Spolupracovník ve službě", "zh_cn": "传道夥伴", "zh": "傳道夥伴", "en": "Ministry Companion", "fr": "Compagnon de prédication", "de": "Dienstpartner", "hu": "Szolgálati társ", "id": "Rekan Dinas", "ja": "奉仕の相手", "pl": "Współgłosiciel"},
    "베트남어를 잘하는 형제·자매": {"cs": "Bratr nebo sestra plynně hovořící vietnamsky", "zh_cn": "越南语流利的弟兄姐妹", "zh": "越南語流利的弟兄姐妹", "en": "A brother or sister who speaks Vietnamese well", "fr": "Un frère ou une sœur qui parle bien vietnamien", "de": "Ein Bruder / eine Schwester mit guten Vietnamesischkenntnissen", "hu": "Vietnámiul jól beszélő testvér vagy testvérnő", "id": "Saudara/saudari yang lancar berbahasa Vietnam", "ja": "ベトナム語が上手な兄弟姉妹", "pl": "Brat lub siostra dobrze mówiący po wietnamsku"},
    "상대방의 이름은?": {"cs": "Jaké je jméno druhé osoby?", "zh_cn": "对方的名字是？", "zh": "對方的名字是？", "en": "What is the other person's name?", "fr": "Quel est le nom de l'interlocuteur ?", "de": "Wie heißt die andere Person?", "hu": "Mi a másik fél neve?", "id": "Siapa nama lawan bicara?", "ja": "相手の名前は？", "pl": "Jak ma na imię rozmówca?"},
    "상대방의 성별은?": {"cs": "Jaké je pohlaví druhé osoby?", "zh_cn": "对方的性別是？", "zh": "對方的性別是？", "en": "What is the other person's gender?", "fr": "Quel est le genre de l'interlocuteur ?", "de": "Welches Geschlecht hat die andere Person?", "hu": "Milyen nemű a másik fél?", "id": "Apa jenis kelamin lawan bicara?", "ja": "相手の性別は？", "pl": "Jakiej płci jest rozmówca?"},
    "남성": {"cs": "Muž", "zh_cn": "男性", "zh": "男性", "en": "Male", "fr": "Homme", "de": "Männlich", "hu": "Férfi", "id": "Pria", "ja": "男性", "pl": "Mężczyzna"},
    "여성": {"cs": "Žena", "zh_cn": "女性", "zh": "女性", "en": "Female", "fr": "Femme", "de": "Weiblich", "hu": "Nő", "id": "Wanita", "ja": "女性", "pl": "Kobieta"},
    "상대방의 나이는 나와 비교하면?": {"cs": "Jaký je věk druhé osoby v porovnání s vámi?", "zh_cn": "对方的年龄跟我相比？", "zh": "對方的年齡跟我相比？", "en": "How does the other person's age compare to yours?", "fr": "Quel est l'âge de l'interlocuteur par rapport au vôtre ?", "de": "Wie ist das Alter im Vergleich zu Ihnen?", "hu": "Milyen a másik fél kora Önhöz képest?", "id": "Bagaimana usia lawan bicara dibanding Anda?", "ja": "相手の年齢は自分と比べてどうですか？", "pl": "Ile lat ma rozmówca w porównaniu z Tobą?"},
    "나보다 어림 — 동생뻘": {"cs": "Mladší než já — jako mladší bratr/sestra", "zh_cn": "比我小——像弟妹一样", "zh": "比我小——像弟妹一樣", "en": "Younger than me — like a younger sibling", "fr": "Plus jeune que moi — comme un petit frère/petite sœur", "de": "Jünger als ich – wie ein jüngeres Geschwister", "hu": "Fiatalabb nálam — mint egy fiatalabb testvér", "id": "Lebih muda dari saya — seusia adik", "ja": "自分より年下 — 弟や妹のような存在", "pl": "Młodszy ode mnie — jak młodszy brat/młodsza siostra"},
    "나와 비슷함 — 동갑": {"cs": "Podobný věk — stejně staří", "zh_cn": "跟我差不多——同年龄", "zh": "跟我差不多——同年齡", "en": "About the same as me — peers", "fr": "À peu près du même âge — pairs", "de": "Etwa mein Alter – gleichaltrig", "hu": "Hasonló korú — egykorúak", "id": "Sebaya — seusia", "ja": "自分と同じくらい — 同い年", "pl": "W podobnym wieku — rówieśnik"},
    "나보다 많음 — 형·오빠·누나·언니뻘": {"cs": "Starší než já — jako starší bratr/sestra", "zh_cn": "比我大——像哥哥姐姐一样", "zh": "比我大——像哥哥姐姐一樣", "en": "Older than me — like an older sibling", "fr": "Plus âgé que moi — comme un grand frère/grande sœur", "de": "Älter als ich – wie ein älteres Geschwister", "hu": "Idősebb nálam — mint egy idősebb testvér", "id": "Lebih tua dari saya — seusia kakak", "ja": "自分より年上 — 兄や姉のような存在", "pl": "Starszy ode mnie — jak starszy brat/starsza siostra"},
    "나보다 훨씬 많음 — 삼촌·이모뻘": {"cs": "Mnohem starší než já — ve věku strýce/tety", "zh_cn": "比我大很多——像叔叔阿姨一样", "zh": "比我大很多——像叔叔阿姨一樣", "en": "Much older than me — like an aunt or uncle", "fr": "Bien plus âgé que moi — de l'âge d'un oncle/d'une tante", "de": "Viel älter als ich – wie Onkel/Tante", "hu": "Sokkal idősebb nálam — mint egy nagybácsi/nagynéni", "id": "Jauh lebih tua dari saya — seusia paman/bibi", "ja": "自分よりずっと年上 — おじやおばのような存在", "pl": "Dużo starszy ode mnie — jak wujek/ciocia"},
    "내 부모님보다는 젊은 분": {"cs": "Mladší než moji rodiče", "zh_cn": "比我父母年轻的长辈", "zh": "比我父母年輕的長輩", "en": "Younger than my parents", "fr": "Plus jeune que mes parents", "de": "Jünger als meine Eltern", "hu": "Fiatalabb, mint a szüleim", "id": "Lebih muda dari orang tua saya", "ja": "自分の両親より若い方", "pl": "Młodszy od moich rodziców"},
    "내 부모님 또래이거나 더 많음": {"cs": "Věk mých rodičů nebo starší", "zh_cn": "跟我父母差不多或更年长", "zh": "跟我父母差不多或更年長", "en": "About my parents' age or older", "fr": "De l'âge de mes parents ou plus âgé", "de": "Im Alter meiner Eltern oder älter", "hu": "Szüleim korabeli vagy idősebb", "id": "Sebaya orang tua saya atau lebih tua", "ja": "自分の両親と同じ世代か、それ以上", "pl": "W wieku moich rodziców lub starszy"},
    "내가 상대방의 삼촌, 이모뻘": {"cs": "Jsem ve věku jejich strýce či tety", "zh_cn": "我像对方的叔叔、阿姨一样", "zh": "我像對方的叔叔、阿姨一樣", "en": "I'm like an aunt or uncle to them", "fr": "Je suis de l'âge d'un oncle ou d'une tante pour lui/elle", "de": "Ich bin im Onkel-/Tanten-Alter der Person", "hu": "Nagybácsi/nagynéni korú vagyok hozzájuk képest", "id": "Saya sebaya paman/bibi mereka", "ja": "自分が相手にとっておじやおばのような存在", "pl": "Jestem w wieku wujka/cioci dla rozmówcy"},
    "내가 상대보다 훨씬 연장자": {"cs": "Jsem mnohem starší než oni", "zh_cn": "我比对方年长很多", "zh": "我比對方年長很多", "en": "I'm much older than them", "fr": "Je suis bien plus âgé que la personne", "de": "Ich bin viel älter als die Person", "hu": "Sokkal idősebb vagyok náluk", "id": "Saya jauh lebih tua dari mereka", "ja": "自分が相手よりずっと年上", "pl": "Jestem znacznie starszy od rozmówcy"},
    "내가 상대방의 부모보다 나이가 많음": {"cs": "Jsem starší než jejich rodiče", "zh_cn": "我比对方的父母年长", "zh": "我比對方的父母年長", "en": "I'm older than their parents", "fr": "Je suis plus âgé que ses parents", "de": "Ich bin älter als die Eltern der Person", "hu": "Idősebb vagyok a szüleinél", "id": "Saya lebih tua dari orang tua mereka", "ja": "自分が相手の両親より年上", "pl": "Jestem starszy od jego/jej rodziców"},
    "처음 만나서 나이를 잘 모름": {"cs": "První setkání, věk není znám", "zh_cn": "初次见面，不太清楚年龄", "zh": "初次見面，不太清楚年齡", "en": "Just met, don't know their age well", "fr": "Premier contact, âge inconnu", "de": "Erstes Treffen, Alter unbekannt", "hu": "Első találkozás, ismeretlen életkor", "id": "Pertama bertemu, belum tahu usia", "ja": "初対面で、年齢がよくわからない", "pl": "Pierwsze spotkanie, wiek nieznany"},
    "아직 친하지 않아 거리를 두고 예의를 차릴 때": {"cs": "Když se ještě dobře neznáte a zachováváte zdvořilý odstup", "zh_cn": "还不熟，需要保持距离、有礼貌相待时", "zh": "還不熟，需要保持距離、有禮貌相待時", "en": "Not close yet, so keeping a polite distance", "fr": "Pas encore familiers, distance polie", "de": "Noch distanziert, höflicher Abstand", "hu": "Amikor még nem ismerik egymást jól, és udvarias távolságot tartanak", "id": "Saat belum akrab dan menjaga jarak sopan", "ja": "まだ親しくなく、距離を置いて丁寧に接するとき", "pl": "Jeszcze nie blisko, uprzejmy dystans"},
    "상대방의 연령대는요?": {"cs": "Přibližný věk druhé osoby?", "zh_cn": "对方大概是哪个年龄层？", "zh": "對方大概是哪個年齡層？", "en": "What's the other person's approximate age range?", "fr": "Quelle est la tranche d'âge approximative de l'interlocuteur ?", "de": "Welche Altersgruppe hat die andere Person?", "hu": "Körülbelül milyen korú a másik fél?", "id": "Kira-kira berapa usia lawan bicara?", "ja": "相手の年齢層は？", "pl": "W jakim przybliżonym wieku jest rozmówca?"},
    "20~30대로 보임": {"cs": "Vypadá na 20–30 let", "zh_cn": "看起来20～30多岁", "zh": "看起來20～30多歲", "en": "Looks to be in their 20s–30s", "fr": "Semble avoir entre 20 et 30 ans", "de": "Scheint in den 20ern bis 30ern zu sein", "hu": "20–30 évesnek tűnik", "id": "Tampak berusia 20–30an", "ja": "20～30代に見える", "pl": "Wygląda na 20–30 lat"},
    "40~70대로 보임": {"cs": "Vypadá na 40–70 let", "zh_cn": "看起来40～70多岁", "zh": "看起來40～70多歲", "en": "Looks to be in their 40s–70s", "fr": "Semble avoir entre 40 et 70 ans", "de": "Scheint in den 40ern bis 70ern zu sein", "hu": "40–70 évesnek tűnik", "id": "Tampak berusia 40–70an", "ja": "40～70代に見える", "pl": "Wygląda na 40–70 lat"},
    "80대 이상으로 보임": {"cs": "Vypadá na 80 a více let", "zh_cn": "看起来80岁以上", "zh": "看起來80歲以上", "en": "Looks to be 80 or older", "fr": "Semble avoir 80 ans ou plus", "de": "Scheint 80 Jahre oder älter zu sein", "hu": "80 év felettinek tűnik", "id": "Tampak berusia 80 ke atas", "ja": "80代以上に見える", "pl": "Wygląda na 80 lat lub więcej"},
    "베트남인은 상대방과 친해질 생각이 전혀 없는 경우가 아니라면 신속히 통성명하고, 나이를 묻고, 상대방과 나의 나이 차이에 따른 호칭을 사용하는 것이 아주 일상적이에요. 계속 \"나\"·\"tôi\"라는 단어를 사용한다면 상대방과 친해지기 어려워요.": {"zh_cn": "越南人只要不是完全不想跟对方熟识，通常都会很快互相报上姓名、询问年龄，并依照彼此的年龄差距使用相应的称呼，这是非常普遍的做法。如果一直使用「我」·「tôi」这个字，会很难跟对方拉近距离。", "zh": "越南人只要不是完全不想跟對方熟識，通常都會很快互相報上姓名、詢問年齡，並依照彼此的年齡差距使用相應的稱呼，這是非常普遍的做法。如果一直使用「我」·「tôi」這個字，會很難跟對方拉近距離。", "en": "Unless a Vietnamese person has no interest at all in getting to know someone, it's very common for them to quickly exchange names, ask each other's age, and then use the term of address that fits their age difference. If you keep using the plain word for \"I\" Ã¢ÂÂ \"tÃÂ´i\" Ã¢ÂÂ it's hard to grow close to the other person.", "fr": "Pour les Vietnamiens, il est très naturel d'échanger rapidement les noms, de demander l'âge et d'utiliser les termes d'adresse adaptés à la différence d'âge — sauf si l'on ne souhaite aucun lien. Continuer à utiliser le pronom neutre « tôi » rend difficile l'établissement d'une relation chaleureuse.", "de": "Für Vietnamesen ist es ganz alltäglich, sich schnell vorzustellen, nach dem Alter zu fragen und je nach Altersunterschied passende Anredeformen zu verwenden – es sei denn, man möchte überhaupt keinen Kontakt aufbauen. Wenn man stets nur das neutrale „tôi“ (ich) verwendet, ist es schwer, eine herzliche Beziehung aufzubauen.", "ja": "ベトナムの人は、相手と親しくなるつもりが全くない場合でない限り、すぐに名前を名乗り合い、年齢を尋ね合い、お互いの年齢差に応じた呼び方を使うのがとても一般的です。ずっと「私」・「tôi」という言葉を使い続けると、相手と親しくなりにくくなります。", "pl": "Dla Wietnamczyków bardzo naturalne jest szybkie przedstawienie się, zapytanie o wiek i używanie form grzecznościowych dopasowanych do różnicy wieku — chyba że nie chce się nawiązywać kontaktu. Ciągłe używanie neutralnego zaimka „tôi” (ja) utrudnia nawiązanie ciepłych relacji."},
    "상대방은 베트남 어느 지역 사람인가요?": {"cs": "Ze které oblasti Vietnamu druhá osoba pochází?", "zh_cn": "对方是越南哪个地区的人？", "zh": "對方是越南哪個地區的人？", "en": "Which region of Vietnam is the other person from?", "fr": "De quelle région du Vietnam est l'interlocuteur ?", "de": "Aus welcher Region Vietnams stammt die Person?", "hu": "Vietnám melyik részéről származik a másik fél?", "id": "Dari wilayah Vietnam mana lawan bicara Anda berasal?", "ja": "相手はベトナムのどの地域の方ですか？", "pl": "Z jakiego regionu Wietnamu pochodzi rozmówca?"},
    "북부": {"vi": "Miền Bắc", "cs": "Sever", "zh_cn": "北部", "zh": "北部", "en": "North", "fr": "Nord", "de": "Norden", "hu": "Észak", "id": "Utara", "ja": "北部", "pl": "Północ"},
    "하노이 등": {"cs": "Hanoj a okolí", "zh_cn": "河内等地", "zh": "河內等地", "en": "Hanoi, etc.", "fr": "Hanoï, etc.", "de": "Hanoi usw.", "hu": "Hanoi stb.", "id": "Hanoi, dll.", "ja": "ハノイなど", "pl": "Hanoi itd."},
    "(남)": {"cs": "(muž)", "zh_cn": "（南部）", "zh": "（南部）", "en": "(south)", "fr": "(Sud)", "de": "(Süd)", "hu": "(férfi)", "id": "(pria)", "ja": "（南部）", "pl": "(Południe)"},
    "남부": {"vi": "Miền Nam", "cs": "Jih", "zh_cn": "南部", "zh": "南部", "en": "South", "fr": "Sud", "de": "Süden", "hu": "Dél", "id": "Selatan", "ja": "南部", "pl": "Południe"},
    "호찌민 등": {"cs": "Ho Či Minovo Město a okolí", "zh_cn": "胡志明市等地", "zh": "胡志明市等地", "en": "Ho Chi Minh City, etc.", "fr": "Hô Chi Minh, etc.", "de": "Ho-Chi-Minh-Stadt usw.", "hu": "Ho Si Minh-város stb.", "id": "Kota Ho Chi Minh, dll.", "ja": "ホーチミンなど", "pl": "Ho Chi Minh itd."},
    "상황별 호칭을 한눈에 확인할 수 있어요. 굵은 글씨가 상대를 부르는 말, 그 옆이 나를 가리키는 말입니다.": {"cs": "Přehled oslovení pro každou situaci. Tučně je oslovení druhé osoby, vedle něj označení sebe sama.", "zh_cn": "可以一目瞭然地查看各种情境下的称呼。粗体字是称呼对方的用语，旁边是称呼自己的用语。", "zh": "可以一目瞭然地查看各種情境下的稱呼。粗體字是稱呼對方的用語，旁邊是稱呼自己的用語。", "en": "See the terms of address for every situation at a glance. The bold word is what you call the other person; next to it is what you call yourself.", "fr": "Visualisez d'un coup d'œil les termes d'adresse selon la situation. En gras le terme pour s'adresser à autrui, à côté celui pour se désigner soi-même.", "de": "Hier sehen Sie die Anredeformen für jede Situation auf einen Blick. Fettgedruckt ist die Anrede für das Gegenüber, daneben die Selbstbezeichnung.", "hu": "Tekintse át a helyzetnek megfelelő megszólításokat. A félkövér szöveg a másikat szólítja meg, mellette a saját magára utaló szó.", "id": "Lihat sebutan untuk setiap situasi sekilas. Huruf tebal adalah panggilan untuk orang lain, di sebelahnya untuk diri sendiri.", "ja": "状況別の呼び方が一目でわかります。太字が相手を呼ぶ言葉、その横が自分を指す言葉です。", "pl": "Przejrzyste zestawienie form adresatywnych w zależności od sytuacji. Pogrubione to zwrot do rozmówcy, obok zwrot o sobie."},
    "아래에서 나와 상대방의 관계를 선택하면, 제공 연설 대화문 속 \"저는(tôi)\"·\"당신은(bạn)\" 표현이 실제 상황에 맞는 호칭으로 자동으로 바뀌어요. 아직 선택하지 않았다면 원문 그대로 tôi·bạn으로 표시돼요.": {"zh_cn": "在下面选择我和对方的关系后，提供见证对话中的「我(tôi)」·「您(bạn)」用语就会自动换成符合实际情境的称呼。如果还没选择，就会维持原文的 tôi·bạn。", "zh": "在下面選擇我和對方的關係後，提供見證對話中的「我(tôi)」·「您(bạn)」用語就會自動換成符合實際情境的稱呼。如果還沒選擇，就會維持原文的 tôi·bạn。", "en": "Choose the relationship between you and the other person below, and the words \"I (tÃÂ´i)\" and \"you (bÃ¡ÂºÂ¡n)\" in the offer-talk dialogue will automatically switch to the terms of address that fit the actual situation. Until you choose, they'll stay as the original tÃÂ´i and bÃ¡ÂºÂ¡n.", "fr": "Choisissez la relation entre vous et l'interlocuteur ci-dessous pour que les pronoms « tôi » (je) et « bạn » (vous) dans les présentations modèles s'adaptent automatiquement. Tant qu'aucun choix n'est fait, le texte d'origine tôi/bạn est conservé.", "de": "Wenn Sie unten die Beziehung zwischen Ihnen und der Person auswählen, werden Ausdrücke wie „ich (tôi)“ und „Sie/du (bạn)“ im Gesprächsvorschlag automatisch durch die situationsgerechte Anrede ersetzt. Bis dahin bleibt der Originaltext tôi/bạn.", "ja": "下で自分と相手の関係を選ぶと、提供トークの会話文にある「私は(tôi)」・「あなたは(bạn)」という表現が、実際の状況に合った呼び方に自動的に変わります。まだ選択していない場合は、原文のまま tôi・bạn と表示されます。", "pl": "Wybierz poniżej relację między Tobą a rozmówcą, aby zaimki „tôi” (ja) i „bạn” (pan/pani) we wzorach rozmów automatycznie dostosowały się do sytuacji. Jeśli nie dokonasz wyboru, pozostaną oryginalne formy tôi i bạn."},
    "나는 어느 쪽인가요?": {"zh_cn": "我是哪一边？", "zh": "我是哪一邊？", "en": "Which side are you on?", "fr": "Quelle est votre situation ?", "de": "Welche Rolle haben Sie?", "ja": "自分はどちらですか？", "pl": "Jaka jest Twoja rola?"},
    "다시 선택": {"cs": "Zvolit znovu", "zh_cn": "重新选择", "zh": "重新選擇", "en": "Choose Again", "fr": "Choisir à nouveau", "de": "Erneut auswählen", "hu": "Újraválasztás", "id": "Pilih Ulang", "ja": "選び直す", "pl": "Wybierz ponownie"},
    "베트남어 어휘": {"zh_cn": "越南语词汇", "zh": "越南語詞彙", "en": "Vietnamese Vocabulary", "fr": "Vocabulaire vietnamien", "de": "Vietnamesischer Wortschatz", "ja": "ベトナム語彙", "pl": "Słownictwo wietnamskie"},
    "한자어 대응표, 신권 용어, 자주 사용하는 단어까지 어휘 학습 자료를 한곳에 모았어요. 한국 한자음과 대응하는 경우가 많아, 알고 나면 새 단어를 훨씬 쉽게 외울 수 있어요.": {"zh_cn": "从汉字对应表、圣工用语，到常用单字，词汇学习资料都集中在这里。", "zh": "從漢字對應表、聖工用語，到常用單字，詞彙學習資料都集中在這裡。", "en": "Hanja-cognate charts, theocratic terms, and common everyday words — all the vocabulary material is gathered in one place.", "fr": "Tableaux de correspondance sino-vietnamiens, vocabulaire théocratique et mots fréquents du quotidien : toutes les ressources lexicales réunies au même endroit.", "de": "Entsprechungstabellen, theokratische Begriffe und häufige Wörter des Alltags – alle Wortschatzmaterialien an einem Ort.", "ja": "漢字語対応表や神権用語から、よく使う単語まで、語彙学習の資料をここに集めました。日本語の漢字音と対応することが多く、覚えると新しい単語をぐっと覚えやすくなります。", "pl": "Tabele odpowiedników sino-wietnamskich, słownictwo teokratyczne i popularne słowa codzienne — wszystkie materiały leksykalne w jednym miejscu."},
    "한자음": {"cs": "Sino-vietnamština", "zh_cn": "汉字音", "zh": "漢字音", "en": "Sino-Vietnamese", "fr": "Sino-vietnamien", "de": "Sino-Vietnamesisch", "hu": "Sino-vietnámi", "id": "Sino-Vietnam", "ja": "漢越音", "pl": "Sino-wietnamski"},
    "동일음": {"cs": "Homofony", "zh_cn": "同音字", "zh": "同音字", "en": "Same Sound", "fr": "Homophones", "de": "Gleichlautend", "hu": "Azonos hangzás", "id": "Homofon", "ja": "同音", "pl": "Homofony"},
    "기본": {"cs": "Základní", "zh_cn": "基本", "zh": "基本", "en": "Base", "fr": "Bases", "de": "Grundlagen", "hu": "Alapvető", "id": "Dasar", "ja": "基本", "pl": "Podstawowe"},
    "반의": {"cs": "Antonyma", "zh_cn": "反义", "zh": "反義", "en": "Antonyms", "fr": "Antonymes", "de": "Gegenteile", "hu": "Ellentétek", "id": "Antonim", "ja": "反意語", "pl": "Antonimy"},
    "상용": {"cs": "Běžné", "zh_cn": "常用", "zh": "常用", "en": "Frequent", "fr": "Fréquent", "de": "Häufig", "hu": "Gyakori", "id": "Umum", "ja": "常用", "pl": "Częste"},
    "신권": {"cs": "Teokratické", "zh_cn": "属灵词汇", "zh": "屬靈詞彙", "en": "Theocratic", "fr": "Théocratique", "de": "Theokratisch", "hu": "Teokratikus", "id": "Teokratis", "ja": "神権", "pl": "Teokratyczne"},
    "인명": {"cs": "Jména", "zh_cn": "人名", "zh": "人名", "en": "Names", "fr": "Noms", "de": "Namen", "hu": "Nevek", "id": "Nama", "ja": "人名", "pl": "Imiona"},
    "끝말": {"cs": "Slovní řetězec", "zh_cn": "字尾", "zh": "字尾", "en": "Word Chain", "fr": "Chaîne de mots", "de": "Wortketten", "hu": "Szólánc", "id": "Rantai Kata", "ja": "しりとり", "pl": "Łańcuch słów"},
    "남북 단어": {"cs": "Severní/jižní slova", "zh_cn": "南北用词", "zh": "南北用詞", "en": "North/South Words", "fr": "Mots Nord/Sud", "de": "Nord/Süd-Wörter", "hu": "Északi/déli szavak", "id": "Kata Utara/Selatan", "ja": "南北の単語", "pl": "Północ/Południe"},
    "파수대": {"cs": "Strážná věž", "zh_cn": "守望台", "zh": "守望台", "en": "Watchtower", "fr": "La Tour de Garde", "de": "Wachtturm", "hu": "Őrtorony", "id": "Menara Pengawal", "ja": "ものみの塔", "pl": "Strażnica"},
    "다운로드 필요": {"cs": "Nutno stáhnout", "zh_cn": "需要下载", "zh": "需要下載", "en": "Download needed", "fr": "Téléchargement requis", "de": "Download erforderlich", "hu": "Letöltés szükséges", "id": "Perlu Unduhan", "ja": "ダウンロードが必要", "pl": "Wymaga pobrania"},
    "다운로드 필요라고 표시된 음성은 아직 이 기기에 설치돼 있지 않아요. 설정 > 손쉬운 사용 > 읽기 및 말하기(또는 콘텐츠 말하기) > 음성에서 해당 언어를 찾아 다운로드하면 선택할 수 있어요.": {"cs": "Hlasy označené jako „Nutno stáhnout“ nejsou v zařízení nainstalovány. Přejděte do Nastavení > Zpřístupnění > Předčítání obsahu > Hlasy a stáhněte je.", "zh_cn": "标示「需要下载」的语音尚未安装在此装置上。请到 设定 > 辅助使用 > 朗读内容（或内容朗读）> 语音，找到该语言并下载后即可选用。", "zh": "標示「需要下載」的語音尚未安裝在此裝置上。請到 設定 > 輔助使用 > 朗讀內容（或內容朗讀）> 語音，找到該語言並下載後即可選用。", "en": "Voices marked \"Download needed\" aren't installed on this device yet. Go to Settings > Accessibility > Spoken Content > Voices, find that language, and download the voice to select it.", "fr": "Les voix marquées « Téléchargement requis » ne sont pas encore installées sur cet appareil. Allez dans Réglages > Accessibilité > Contenu énoncé > Voix, trouvez cette langue et téléchargez la voix pour pouvoir la sélectionner.", "de": "Stimmen mit dem Hinweis „Download erforderlich“ sind noch nicht auf diesem Gerät installiert. Gehen Sie zu Einstellungen > Bedienungshilfen > Gesprochene Inhalte > Stimmen, suchen Sie die Sprache und laden Sie die Stimme herunter.", "hu": "A „Letöltés szükséges” jelzésű hangok nincsenek telepítve. Lépjen a Beállítások > Kisegítő lehetőségek > Beszéd > Hangok menübe és töltse le őket.", "id": "Suara bertanda 'Perlu Unduhan' belum terpasang di perangkat. Buka Pengaturan > Aksesibilitas > Konten Lisan > Suara untuk mengunduhnya.", "ja": "「ダウンロードが必要」と表示されている音声は、まだこの端末にインストールされていません。設定 > アクセシビリティ > 読み上げコンテンツ（または「コンテンツの読み上げ」）> 声 でその言語を探してダウンロードすると選択できます。", "pl": "Głosy oznaczone jako „Wymaga pobrania” nie są jeszcze zainstalowane na tym urządzeniu. Przejdź do Ustawienia > Dostępność > Zawartość mówiona > Głosy, znajdź język i pobierz głos."},
    "이미 기기에 다운로드한 음성인데도 여기에 보이지 않는다면, 이 브라우저 앱을 완전히 종료했다가 다시 열거나 기기를 재시작해 보세요. 특히 '고품질' 음성은 iOS/사파리에서 바로 인식되지 않는 경우가 있어요.": {"cs": "Pokud se stažený hlas nezobrazuje, zkuste prohlížeč úplně zavřít a znovu otevřít nebo restartovat zařízení. Zejména hlasy v 'vysoké kvalitě' nemusí být v iOS/Safari ihned rozpoznány.", "zh_cn": "如果已在装置上下载的语音却没有出现在这里,请试着完全关闭此浏览器 App 后重新开启,或重新启动装置。尤其是「高品质」语音,有时在 iOS／Safari 上不会立即被辨识。", "zh": "如果已在裝置上下載的語音卻沒有出現在這裡,請試著完全關閉此瀏覽器 App 後重新開啟,或重新啟動裝置。尤其是「高品質」語音,有時在 iOS／Safari 上不會立即被辨識。", "en": "If a voice you've already downloaded on this device doesn't show up here, try fully quitting and reopening this browser app, or restarting the device. \"Enhanced\"/\"Premium\" voices in particular sometimes aren't recognized right away on iOS/Safari.", "fr": "Si une voix déjà téléchargée n'apparaît pas ici, quittez complètement et rouvrez cette application de navigation, ou redémarrez l'appareil. Les voix de haute qualité ne sont parfois pas reconnues immédiatement sous iOS/Safari.", "de": "Wenn eine bereits heruntergeladene Stimme hier nicht angezeigt wird, schließen Sie den Browser vollständig und öffnen Sie ihn erneut oder starten Sie das Gerät neu. Besonders hochwertige Stimmen werden unter iOS/Safari manchmal nicht sofort erkannt.", "hu": "Ha a már letöltött hang nem jelenik meg, zárja be teljesen és nyissa meg újra a böngészőt, vagy indítsa újra a készüléket. Különösen a 'kiváló minőségű' hangok esetén fordulhat elő, hogy az iOS/Safari nem ismeri fel azonnal.", "id": "Jika suara yang sudah diunduh tidak muncul di sini, coba tutup sepenuhnya lalu buka kembali aplikasi browser atau mulai ulang perangkat. Terutama suara 'kualitas tinggi' terkadang tidak langsung dikenali di iOS/Safari.", "ja": "端末にすでにダウンロード済みの音声がここに表示されない場合は、このブラウザアプリを完全に終了してから開き直すか、端末を再起動してみてください。特に「高品質」の音声は、iOS/Safariですぐには認識されないことがあります。", "pl": "Jeśli pobrany głos nie wyświetla się tutaj, zamknij całkowicie przeglądarkę i otwórz ją ponownie lub zrestartuj urządzenie. Głosy ulepszone/premium w systemie iOS/Safari bywają rozpoznawane z opóźnieniem."},
    "이웃 사람과의 대화": {"vi": "Trò chuyện với người lân cận", "cs": "Rozhovor se sousedem", "zh_cn": "耶和华见证人是怎样跟人讨论圣经的", "zh": "耶和華見證人是怎樣跟人討論聖經的", "en": "Conversation with a neighbor", "fr": "Conversations avec le prochain", "de": "Gespräche über die Bibel", "hu": "Beszélgetés a felebaráttal", "id": "Percakapan dengan Tetangga", "ja": "聖書についての話し合い", "pl": "Rozmowy o Biblii z ludźmi"},
    "여호와의 증인이 이웃집을 방문해 성경에 관해 나누는 실제 대화문 11편이에요. 집주인의 말은 원문 그대로, 전도인의 말 속 성경 인용은 최신 개정판 신세계역과 대조해 두었어요.": {"cs": "11 skutečných rozhovorů, které svědkové Jehovovi vedou u dveří se sousedy o Bibli. Slova majitele domu jsou ponechána v původním znění; biblické verše citované zvěstovatelem jsou porovnány s revidovaným Překladem nového světa.", "zh_cn": "这里收录了11篇耶和华见证人实际到访邻居家中，一起讨论圣经的对话。屋主的话都保留原文，而传道员话中引用的圣经经文，已对照最新修訂版新世界译本核对过。", "zh": "這裡收錄了11篇耶和華見證人實際到訪鄰居家中，一起討論聖經的對話。屋主的話都保留原文，而傳道員話中引用的聖經經文，已對照最新修訂版新世界譯本核對過。", "en": "Here are 11 real conversations Jehovah's Witnesses have with a neighbor at the door about the Bible. The householder's own words are kept exactly as published; Bible verses quoted in the publisher's lines have been checked against the current (Revised Edition) New World Translation.", "fr": "Voici 11 conversations réelles que les Témoins de Jéhovah ont avec un voisin au sujet de la Bible. Les propos de l'interlocuteur sont reproduits fidèlement ; les versets bibliques cités par le proclamateur ont été vérifiés d'après la Traduction du monde nouveau révisée.", "de": "Hier sind 11 Gespräche, die Jehovas Zeugen an der Haustür über die Bibel führen. Die Worte des Wohnungsinhabers sind originalgetreu wiedergegeben; Bibelzitate des Verkündigers wurden mit der revidierten Neuen-Welt-Übersetzung abgeglichen.", "hu": "11 valós beszélgetés, amelyet Jehova Tanúi folytatnak az ajtóban a felebarátjukkal a Bibliáról. A házigazda szavai az eredeti formában maradtak; a hírnök által idézett bibliaversek az Új világ fordítás átdolgozott kiadásával lettek összevetve.", "id": "11 percakapan nyata Saksi-Saksi Yehuwa dengan tetangga di pintu tentang Alkitab. Kata-kata tuan rumah dipertahankan seperti aslinya; ayat-ayat Alkitab yang dikutip penyiar telah dicocokkan dengan Terjemahan Dunia Baru edisi revisi.", "ja": "エホバの証人が近所の人を訪問して聖書について話し合う、実際の会話11編です。家の人の言葉は原文のまま、伝道者の言葉の中の聖書の引用は最新の改訂版新世界訳と対照してあります。", "pl": "Oto 11 autentycznych rozmów o Biblii prowadzonych przez Świadków Jehowy przy drzwiach. Słowa domownika zachowano w oryginalnym brzmieniu, a wersety cytowane przez głosiciela zweryfikowano ze zrewidowanym Pismem Świętym w Przekładzie Nowego Świata."},
    "전도인": {"cs": "Zvěstovatel", "zh_cn": "传道员", "zh": "傳道員", "en": "Publisher", "fr": "Proclamateur", "de": "Verkündiger", "hu": "Hírnök", "id": "Penyiar", "ja": "伝道者", "pl": "Głosiciel"},
    "집주인": {"cs": "Majitel domu", "zh_cn": "屋主", "zh": "屋主", "en": "Householder", "fr": "Interlocuteur", "de": "Wohnungsinhaber", "hu": "Családfő", "id": "Tuan Rumah", "ja": "家の人", "pl": "Domownik"},
    "북": {"zh_cn": "北", "zh": "北", "en": "N", "fr": "N", "de": "N", "ja": "北", "pl": "Północ"},
    "남": {"zh_cn": "南", "zh": "南", "en": "S", "fr": "S", "de": "S", "ja": "南", "pl": "Południe"},
    "이 주의 파수대 연구 기사에서 뽑은 어휘예요. 예문과 예문의 뜻도 함께 보여줘요.": {"cs": "Slovní zásoba vybraná ze studijního článku Strážné věže pro tento týden. Uvedena je i vzorová věta a její význam.", "zh_cn": "这是从本周守望台研读文章中挑选的词汇。也一并显示例句和例句的意思。", "zh": "這是從本週守望台研讀文章中挑選的詞彙。也一併顯示例句和例句的意思。", "en": "Vocabulary selected from this week's Watchtower Study article. The example sentence and its meaning are shown together too.", "fr": "Vocabulaire extrait de l'article d'étude de La Tour de Garde de cette semaine, avec phrases d'exemple et traduction.", "de": "Ausgewählter Wortschatz aus dem Wachtturm-Studienartikel dieser Woche, samt Beispielsatz und Übersetzung.", "hu": "Az e heti Őrtorony-tanulmányozási cikkből kiválasztott szókincs. A példamondat és annak jelentése is megjelenik.", "id": "Kosakata yang dipilih dari artikel Pelajaran Menara Pengawal minggu ini. Kalimat contoh beserta artinya juga ditampilkan bersama.", "ja": "今週のものみの塔研究記事から選んだ語彙です。例文と例文の意味も一緒に示します。", "pl": "Słownictwo wybrane z artykułu do studium ze Strażnicy na ten tydzień wraz z przykładowymi zdaniami i ich znaczeniem."},
    "발음·성조·문자 기초": {"zh_cn": "发音‧声调‧文字基础", "zh": "發音‧聲調‧文字基礎", "en": "Pronunciation, Tone & Alphabet Basics", "fr": "Bases de prononciation, tons et alphabet", "de": "Grundlagen zu Aussprache, Tönen und Schrift", "ja": "発音・声調・文字の基礎", "pl": "Podstawy wymowy, tonów i alfabetu"},
    "베트남어를 처음 배우는 분을 위한 기초 발음표예요. 16주 학습반 교재를 바탕으로 정리했습니다.": {"zh_cn": "这是为初学越南语的人准备的基础发音表，根据16周学习班教材整理而成。", "zh": "這是為初學越南語的人準備的基礎發音表，根據16週學習班教材整理而成。", "en": "A basic pronunciation chart for those just starting to learn Vietnamese, compiled from the 16-week class materials.", "fr": "Tableau phonétique de base pour les débutants en vietnamien, compilé à partir des manuels du cours de 16 semaines.", "de": "Eine Ausspracheübersicht für Einsteiger, zusammengestellt auf Grundlage des 16-Wochen-Kurses.", "ja": "ベトナム語を初めて学ぶ方のための基礎発音表です。16週学習班の教材を基に作成しました。", "pl": "Podstawowa tabela wymowy dla osób rozpoczynających naukę wietnamskiego, opracowana na podstawie materiałów 16-tygodniowego kursu."},
    "설정": {"vi": "Cài đặt", "cs": "Nastavení", "zh_cn": "设定", "zh": "設定", "en": "Setup", "fr": "Paramètres", "de": "Einstellungen", "hu": "Beállítások", "id": "Pengaturan", "ja": "設定", "pl": "Ustawienia"},
    "문자": {"cs": "Písmeno", "zh_cn": "文字", "zh": "文字", "en": "Alphabet", "fr": "Alphabet", "de": "Buchstaben", "hu": "Betű", "id": "Huruf", "ja": "文字", "pl": "Litery"},
    "모음": {"cs": "Samohlásky", "zh_cn": "母音", "zh": "母音", "en": "Vowels", "fr": "Voyelles", "de": "Vokale", "hu": "Magánhangzók", "id": "Vokal", "ja": "母音", "pl": "Samogłoski"},
    "자음": {"cs": "Souhlásky", "zh_cn": "子音", "zh": "子音", "en": "Consonants", "fr": "Consonnes", "de": "Konsonanten", "hu": "Mássalhangzók", "id": "Konsonan", "ja": "子音", "pl": "Spółgłoski"},
    "성조": {"vi": "Thanh điệu", "cs": "Tóny", "zh_cn": "声调", "zh": "聲調", "en": "Tones", "fr": "Tons", "de": "Töne", "hu": "Tónusok", "id": "Nada", "ja": "声調", "pl": "Tony"},
    "연속 성조": {"cs": "Dvojice tónů", "zh_cn": "声调组合", "zh": "聲調組合", "en": "Tone Pairs", "fr": "Paires de tons", "de": "Tonkombinationen", "hu": "Tónuspárok", "id": "Pasangan Nada", "ja": "声調の組み合わせ", "pl": "Pary tonów"},
    "남북 발음": {"cs": "Severní/jižní výslovnost", "zh_cn": "南北发音", "zh": "南北發音", "en": "North/South Pronunciation", "fr": "Prononciation Nord/Sud", "de": "Nord/Süd-Aussprache", "hu": "Északi/déli kiejtés", "id": "Pelafalan Utara/Selatan", "ja": "南北の発音", "pl": "Wymowa Północ/Południe"},
    "성경 책 이름 · 숫자 읽기": {"zh_cn": "圣经书卷名称‧数字读法", "zh": "聖經書卷名稱‧數字讀法", "en": "Bible Book Names & Number Reading", "fr": "Noms des livres bibliques et lecture des nombres", "de": "Bibelbuchnamen & Zahlen lesen", "ja": "聖書の書名・数字の読み方", "pl": "Nazwy ksiąg biblijnych i odczytywanie liczb"},
    "신세계역 성경의 베트남어와 한국어 책 이름을 나란히 두고 발음을 들어 보세요. 숫자 탭에는 1~100, 1,000~10억까지 숫자 읽는 법이 있어요.": {"zh_cn": "把《新世界译本》圣经的越南语和中文书卷名称并列，听听看发音。「数字」分页里有1～100、1,000～10亿的读法。", "zh": "把《新世界譯本》聖經的越南語和中文書卷名稱並列，聽聽看發音。「數字」分頁裡有1～100、1,000～10億的讀法。", "en": "See the Vietnamese and English New World Translation Bible book names side by side and listen to the pronunciation. The Numbers tab covers how to read 1–100 and 1,000 to 1 billion.", "fr": "Comparez les noms des livres bibliques de la Traduction du monde nouveau en vietnamien et en français, et écoutez leur prononciation. L'onglet Nombres explique comment lire de 1 à 100 et de 1 000 à 1 milliard.", "de": "Vergleichen Sie die vietnamesischen und deutschen Bibelbuchnamen der Neuen-Welt-Übersetzung nebeneinander und hören Sie die Aussprache. Im Tab Zahlen lernen Sie Zahlen von 1 bis 100 und von 1.000 bis 1 Milliarde.", "ja": "「新世界訳」聖書のベトナム語と日本語の書名を並べて表示し、発音を聞くことができます。「数字」タブには1～100、1,000～10億までの数字の読み方があります。", "pl": "Zestawienie nazw ksiąg biblijnych z Przekładu Nowego Świata po wietnamsku i polsku z możliwością odsłuchu wymowy. W zakładce Liczby znajduje się odczytywanie od 1 do 100 oraz od 1000 do 1 miliarda."},
    "숫자": {"vi": "Chữ số", "cs": "Čísla", "zh_cn": "数字", "zh": "數字", "en": "Numbers", "fr": "Nombres", "de": "Zahlen", "hu": "Számok", "id": "Angka", "ja": "数字", "pl": "Liczby"},
    "달과 요일": {"zh_cn": "月份与星期", "zh": "月份與星期", "en": "Months & Days", "fr": "Mois et jours", "de": "Monate & Wochentage", "ja": "月と曜日", "pl": "Miesiące i dni"},
    "문법 및 작문 연습": {"zh_cn": "文法与造句练习", "zh": "文法與造句練習", "en": "Grammar & Sentence Practice", "fr": "Exercices de grammaire et de phrases", "de": "Grammatik & Satzbau-Übungen", "ja": "文法・作文練習", "pl": "Ćwiczenia gramatyczne i tworzenie zdań"},
    "가장 짧은 문장에서 시작해 한 단어씩 늘려 가며, 한국어와 베트남어의 어순 차이를 몸에 익혀요.": {"zh_cn": "从最短的句子开始，一个字一个字地增加，亲身体会中文和越南语语序的差异。", "zh": "從最短的句子開始，一個字一個字地增加，親身體會中文和越南語語序的差異。", "en": "Start with the shortest sentences and add one word at a time, so you get a feel for the word-order differences between your language and Vietnamese.", "fr": "Commencez par des phrases très courtes et ajoutez un mot à la fois pour vous familiariser avec l'ordre des mots en vietnamien.", "de": "Beginnen Sie mit kurzen Sätzen und erweitern Sie sie Schritt für Schritt, um ein Gefühl für die vietnamesische Wortstellung zu entwickeln.", "ja": "一番短い文から始めて、一語ずつ増やしながら、日本語とベトナム語の語順の違いを体で覚えましょう。", "pl": "Zacznij od najkrótszych zdań i dodawaj po jednym słowie, aby oswoić się z wietnamskim szykiem wyrazów."},
    "예문": {"vi": "Câu ví dụ", "cs": "Příklady", "zh_cn": "例句", "zh": "例句", "en": "Examples", "fr": "Exemples", "de": "Beispielsätze", "hu": "Példák", "id": "Contoh Kalimat", "ja": "例文", "pl": "Przykłady"},
    "특강": {"vi": "Chuyên đề", "cs": "Zvláštní témata", "zh_cn": "特別课程", "zh": "特別課程", "en": "Special Topics", "fr": "Cours spécial", "de": "Besondere Themen", "hu": "Különleges témák", "id": "Kuliah Khusus", "ja": "特別講座", "pl": "Lekcja specjalna"},
    "범용 언어 생성표": {"cs": "Univerzální tabulka vět", "zh_cn": "通用语言生成表", "zh": "通用語言生成表", "en": "General Sentence Chart", "fr": "Tableau de génération de phrases", "de": "Satzbautabelle", "hu": "Általános mondattáblázat", "id": "Tabel Pembentukan Kalimat", "ja": "汎用文生成表", "pl": "Tabela tworzenia zdań"},
    "문장 생성기": {"cs": "Generátor vět", "zh_cn": "造句產生器", "zh": "造句產生器", "en": "Sentence Builder", "fr": "Générateur de phrases", "de": "Satzgenerator", "hu": "Mondatgenerátor", "id": "Pembuat Kalimat", "ja": "文章ジェネレーター", "pl": "Generator zdań"},
    "단어를 카테고리별로 골라 보세요. 비워 두면(선택 안 함) 그 부분 없이 문장이 만들어져요. 완성을 누르면 한국어 어순에서 베트남어 어순으로 단어가 자동으로 움직이는 걸 볼 수 있어요.": {"cs": "Vyberte slova podle kategorií. Pokud některé pole necháte prázdné, věta se vytvoří bez něj. Po dokončení uvidíte, jak se slova automaticky přesunou do vietnamského slovosledu.", "zh_cn": "请依类別挑选单字。如果留白（不选）就会做出没有那个部分的句子。按下完成后，可以看到单字自动从原本的语序移动到越南语语序。", "zh": "請依類別挑選單字。如果留白（不選）就會做出沒有那個部分的句子。按下完成後，可以看到單字自動從原本的語序移動到越南語語序。", "en": "Pick words by category. Leave a category blank and the sentence is built without that part. Press Done to see the words automatically move from your language's word order into Vietnamese word order.", "fr": "Sélectionnez des mots par catégorie. Si vous laissez un champ vide, la phrase est formée sans cet élément. Appuyez sur Générer pour voir les mots s'agencer automatiquement dans l'ordre de la syntaxe vietnamienne.", "de": "Wählen Sie Wörter nach Kategorien. Wenn Sie eine Kategorie leer lassen, wird der Satz ohne diesen Teil gebildet. Tippen Sie auf Fertig, um zu sehen, wie sich die Wörter automatisch in die vietnamesische Wortstellung bewegen.", "hu": "Válasszon szavakat kategóriánként. Ha üresen hagyja, a mondat a nélkül jön létre. A befejezés gombra kattintva láthatja, ahogy a szavak automatikusan vietnámi szórendre váltanak.", "id": "Pilih kata berdasarkan kategori. Jika dikosongkan, kalimat akan dibuat tanpanya. Tekan selesai untuk melihat kata-kata berpindah ke susunan bahasa Vietnam secara otomatis.", "ja": "カテゴリーごとに単語を選んでください。空欄のまま（選択しない）にすると、その部分を除いた文が作られます。「完成」を押すと、日本語の語順からベトナム語の語順へ単語が自動的に移動する様子を見ることができます。", "pl": "Wybierz słowa według kategorii. Pozostawienie pola pustego utworzy zdanie bez tego elementu. Naciśnij Generuj, aby zobaczyć, jak słowa układają się w wietnamskim szyku."},
    "문장 만들기": {"cs": "Vytvořit větu", "zh_cn": "造句", "zh": "造句", "en": "Build a Sentence", "fr": "Générer la phrase", "de": "Satzbau-Übung", "hu": "Mondat létrehozása", "id": "Buat Kalimat", "ja": "文章を作る", "pl": "Utwórz zdanie"},
    "복습 게임": {"zh_cn": "复习游戏", "zh": "複習遊戲", "en": "Review Games", "fr": "Jeux de révision", "de": "Wiederholungsspiele", "ja": "復習ゲーム", "pl": "Gry powtórkowe"},
    "플래시카드·보기·듣기·어순 배열·받아쓰기로 배운 내용을 복습하세요. 아래에서 복습할 영역을 먼저 골라 보세요.": {"zh_cn": "透过字卡、阅读、听力、排列语序、听写来复习所学内容。请先在下面选择要复习的范围。", "zh": "透過字卡、閱讀、聽力、排列語序、聽寫來複習所學內容。請先在下面選擇要複習的範圍。", "en": "Review what you've learned with flashcards, reading, listening, word-order arrangement, and dictation. First pick which area to review below.", "fr": "Révisez ce que vous avez appris grâce aux cartes mémoire, à la lecture, à l'écoute, à l'ordonnancement des mots et à la dictée. Choisissez d'abord le domaine à réviser ci-dessous.", "de": "Wiederholen Sie das Gelernte mit Karteikarten, Lesen, Hören, Wortstellung und Diktat. Wählen Sie unten zuerst den Lernbereich aus.", "ja": "フラッシュカード、読解、聞き取り、語順並べ替え、書き取りで学んだ内容を復習しましょう。まず下から復習する分野を選んでください。", "pl": "Powtarzaj materiał za pomocą fiszek, czytania, słuchania, układania szyku i dyktanda. Wybierz poniżej zakres powtórki."},
    "플래시카드": {"vi": "Thẻ ghi nhớ", "cs": "Kartičky", "zh_cn": "字卡", "zh": "字卡", "en": "Flashcards", "fr": "Cartes", "de": "Karteikarten", "hu": "Kártyák", "id": "Kartu Kilas", "ja": "フラッシュカード", "pl": "Fiszki"},
    "보기": {"vi": "Lựa chọn", "cs": "Čtení", "zh_cn": "阅读", "zh": "閱讀", "en": "Reading", "fr": "Voir", "de": "Ansehen", "hu": "Olvasás", "id": "Pilihan", "ja": "読解", "pl": "Podgląd"},
    "듣기": {"vi": "Nghe", "cs": "Poslech", "zh_cn": "听力", "zh": "聽力", "en": "Listening", "fr": "Écoute", "de": "Hören", "hu": "Hallgatás", "id": "Mendengarkan", "ja": "聞き取り", "pl": "Słuchanie"},
    "어순 배열": {"vi": "Sắp xếp từ", "cs": "Slovosled", "zh_cn": "排列语序", "zh": "排列語序", "en": "Word Order", "fr": "Ordre des mots", "de": "Wortstellung", "hu": "Szórend", "id": "Susun Urutan Kata", "ja": "語順並べ替え", "pl": "Szyk wyrazów"},
    "받아쓰기": {"vi": "Chính tả", "cs": "Diktát", "zh_cn": "听写", "zh": "聽寫", "en": "Dictation", "fr": "Dictée", "de": "Diktat", "hu": "Diktálás", "id": "Dikte", "ja": "書き取り", "pl": "Dyktando"},
    "언어 선택 / 選擇語言 / Language": {"cs": "Výběr jazyka / Language", "zh_cn": "언어 선택 / 选择语言 / Language", "zh": "언어 선택 / 選擇語言 / Language", "en": "언어 선택 / 選擇語言 / Language", "fr": "언어 선택 / 選擇語言 / Language / Sprachauswahl / Choix de langue", "de": "언어 선택 / 選擇語言 / Language / Sprachauswahl", "hu": "Nyelvválasztás / Language", "id": "Pilih Bahasa / Language", "ja": "언어 선택 / 選擇語言 / Language", "pl": "언어 선택 / 選擇語言 / Language / Sprachauswahl / Choix de langue / Wybór języka"},
    "주요 메뉴": {"vi": "Menu chính", "cs": "Hlavní menu", "zh_cn": "主要选单", "zh": "主要選單", "en": "Main Menu", "fr": "Menu principal", "de": "Hauptmenü", "hu": "Főmenü", "id": "Menu Utama", "ja": "メインメニュー", "pl": "Główne menu"},
    "베트남어 단어나 한국어 뜻으로 검색": {"cs": "Hledat vietnamské slovo nebo význam", "zh_cn": "用越南语单字或中文意思搜寻", "zh": "用越南語單字或中文意思搜尋", "en": "Search by Vietnamese word or English meaning", "fr": "Rechercher par mot vietnamien ou sens en français", "de": "Nach vietnamesischem Wort oder Bedeutung suchen", "hu": "Keresés vietnámi szóra vagy jelentésre", "id": "Cari kata Vietnam atau artinya", "ja": "ベトナム語の単語または日本語の意味で検索", "pl": "Szukaj według wietnamskiego słowa lub znaczenia"},
    "성경책 이름으로 검색 (베트남어·한국어)": {"cs": "Hledat podle názvu biblické knihy", "zh_cn": "用圣经书卷名称搜寻（越南语‧中文）", "zh": "用聖經書卷名稱搜尋（越南語‧中文）", "en": "Search by Bible book name (Vietnamese/English)", "fr": "Rechercher un livre biblique (vietnamien/français)", "de": "Nach Bibelbuch suchen (Vietnamesisch/Deutsch)", "hu": "Keresés bibliai könyv neve szerint", "id": "Cari berdasarkan nama kitab Alkitab", "ja": "聖書の書名で検索（ベトナム語・日本語）", "pl": "Szukaj księgi biblijnej (wietnamski/polski)"},
    "문법 특강 검색 (베트남어·한국어)": {"cs": "Hledat v mluvnických tématech", "zh_cn": "搜寻文法特別课程（越南语‧中文）", "zh": "搜尋文法特別課程（越南語‧中文）", "en": "Search grammar topics (Vietnamese/English)", "fr": "Rechercher dans les leçons de grammaire (vietnamien/français)", "de": "Nach Grammatikthemen suchen", "hu": "Keresés a nyelvtani témákban", "id": "Cari topik tata bahasa", "ja": "文法特別講座を検索（ベトナム語・日本語）", "pl": "Szukaj w lekcjach gramatyki (wietnamski/polski)"},
    "예: ": {"cs": "např. ", "zh_cn": "例：", "zh": "例：", "en": "e.g. ", "fr": "ex. : ", "de": "z. B. ", "hu": "pl. ", "id": "contoh: ", "ja": "例：", "pl": "np. "},
    "예: 예나": {"cs": "např. Anna", "zh_cn": "例：雅婷", "zh": "例：雅婷", "en": "e.g. Amy", "fr": "ex. : Sarah", "de": "z. B. Anna", "hu": "pl. Anna", "id": "contoh: Anita", "ja": "例：花子", "pl": "np. Anna"},
    "예: Trang Thanh": {"cs": "např. Trang Thanh", "zh_cn": "例：Trang Thanh", "zh": "例：Trang Thanh", "en": "e.g. Trang Thanh", "fr": "ex. : Trang Thanh", "de": "z. B. Trang Thanh", "hu": "pl. Trang Thanh", "id": "contoh: Trang Thanh", "ja": "例：Trang Thanh", "pl": "np. Trang Thanh"},
    "예: 25": {"cs": "např. 25", "zh_cn": "例：25", "zh": "例：25", "en": "e.g. 25", "fr": "ex. : 25", "de": "z. B. 25", "hu": "pl. 25", "id": "contoh: 25", "ja": "例：25", "pl": "np. 25"},
    "예: 민수": {"cs": "např. Petr", "zh_cn": "例：志豪", "zh": "例：志豪", "en": "e.g. Michael", "fr": "ex. : Thomas", "de": "z. B. Michael", "hu": "pl. Péter", "id": "contoh: Michael", "ja": "例：太郎", "pl": "np. Michał"},
    "예: Minh": {"cs": "např. Minh", "zh_cn": "例：Minh", "zh": "例：Minh", "en": "e.g. Minh", "fr": "ex. : Minh", "de": "z. B. Minh", "hu": "pl. Minh", "id": "contoh: Minh", "ja": "例：Minh", "pl": "np. Minh"},
    "예: 30": {"cs": "např. 30", "zh_cn": "例：30", "zh": "例：30", "en": "e.g. 30", "fr": "ex. : 30", "de": "z. B. 30", "hu": "pl. 30", "id": "contoh: 30", "ja": "例：30", "pl": "np. 30"},
    "예: 김철수": {"cs": "např. Jan Novák", "zh_cn": "例：王大明", "zh": "例：王大明", "en": "e.g. John Smith", "fr": "ex. : Jean Dupont", "de": "z. B. Thomas Weber", "hu": "pl. Kovács János", "id": "contoh: Budi Santoso", "ja": "例：山田太郎", "pl": "np. Jan Kowalski"},
    "예: Long": {"cs": "např. Long", "zh_cn": "例：Long", "zh": "例：Long", "en": "e.g. Long", "fr": "ex. : Long", "de": "z. B. Long", "hu": "pl. Long", "id": "contoh: Long", "ja": "例：Long", "pl": "np. Long"},
    "예: 45": {"cs": "např. 45", "zh_cn": "例：45", "zh": "例：45", "en": "e.g. 45", "fr": "ex. : 45", "de": "z. B. 45", "hu": "pl. 45", "id": "contoh: 45", "ja": "例：45", "pl": "np. 45"},
    "예: 박영희": {"cs": "např. Marie Nováková", "zh_cn": "例：林美惠", "zh": "例：林美惠", "en": "e.g. Sarah Johnson", "fr": "ex. : Marie Martin", "de": "z. B. Sarah Müller", "hu": "pl. Kiss Éva", "id": "contoh: Siti Aminah", "ja": "例：山田花子", "pl": "np. Maria Nowak"},
    "예: Hoa": {"cs": "např. Hoa", "zh_cn": "例：Hoa", "zh": "例：Hoa", "en": "e.g. Hoa", "fr": "ex. : Hoa", "de": "z. B. Hoa", "hu": "pl. Hoa", "id": "contoh: Hoa", "ja": "例：Hoa", "pl": "np. Hoa"},
    "예: 40": {"cs": "např. 40", "zh_cn": "例：40", "zh": "例：40", "en": "e.g. 40", "fr": "ex. : 40", "de": "z. B. 40", "hu": "pl. 40", "id": "contoh: 40", "ja": "例：40", "pl": "np. 40"},
    "동생뻘": {"zh_cn": "弟妹辈", "zh": "弟妹輩", "en": "like a younger sibling", "fr": "comme un petit frère/petite sœur", "de": "wie ein jüngeres Geschwister", "ja": "弟・妹くらい", "pl": "jak młodsze rodzeństwo"},
    "동갑": {"zh_cn": "同辈", "zh": "同輩", "en": "peer", "fr": "du même âge (pairs)", "de": "gleichaltrig", "ja": "同い年", "pl": "rówieśnik"},
    "형·오빠·누나·언니뻘": {"zh_cn": "哥哥姐姐辈", "zh": "哥哥姐姐輩", "en": "like an older sibling", "fr": "comme un grand frère/grande sœur", "de": "wie ein älteres Geschwister", "ja": "兄・姉くらい", "pl": "jak starsze rodzeństwo"},
    "삼촌·이모뻘(상대가 연장자)": {"zh_cn": "叔叔阿姨辈（对方年长）", "zh": "叔叔阿姨輩（對方年長）", "en": "like an aunt/uncle (they're older)", "fr": "comme un oncle/tante (interlocuteur plus âgé)", "de": "wie Onkel/Tante (Gegenüber ist älter)", "ja": "おじ・おばくらい（相手が年上）", "pl": "jak wujek/ciocia (rozmówca starszy)"},
    "부모님 또래 이상(상대가 연장자)": {"zh_cn": "父母辈以上（对方年长）", "zh": "父母輩以上（對方年長）", "en": "parents' age or older (they're older)", "fr": "de l'âge des parents ou plus âgé", "de": "im Alter der Eltern oder älter", "ja": "親世代以上（相手が年上）", "pl": "w wieku rodziców lub starszy"},
    "삼촌·이모뻘(내가 연장자)": {"zh_cn": "叔叔阿姨辈（我年长）", "zh": "叔叔阿姨輩（我年長）", "en": "like an aunt/uncle (I'm older)", "fr": "comme un oncle/tante (je suis plus âgé)", "de": "wie Onkel/Tante (ich bin älter)", "ja": "おじ・おばくらい（自分が年上）", "pl": "jak wujek/ciocia (ja jestem starszy)"},
    "부모님뻘(내가 연장자)": {"zh_cn": "父母辈（我年长）", "zh": "父母輩（我年長）", "en": "parents' age (I'm older)", "fr": "de l'âge des parents (je suis plus âgé)", "de": "im Alter der Eltern (ich bin älter)", "ja": "親世代くらい（自分が年上）", "pl": "w wieku rodziców (ja jestem starszy)"},
    "초면·예의를 갖춤": {"zh_cn": "初次见面‧有礼貌", "zh": "初次見面‧有禮貌", "en": "first meeting, polite", "fr": "premier contact, poli", "de": "Erstes Treffen, höflich", "ja": "初対面・丁寧に", "pl": "pierwsze spotkanie, uprzejmie"},
    "형·오빠": {"zh_cn": "哥哥", "zh": "哥哥", "en": "older brother", "fr": "grand frère", "de": "älterer Bruder", "ja": "兄", "pl": "starszy brat"},
    "누나·언니": {"zh_cn": "姐姐", "zh": "姐姐", "en": "older sister", "fr": "grande sœur", "de": "ältere Schwester", "ja": "姉", "pl": "starsza siostra"},
    "조카뻘": {"zh_cn": "晚辈（侄辈）", "zh": "晚輩（姪輩）", "en": "like a niece/nephew", "fr": "comme un neveu/une nièce", "de": "wie Nichte/Neffe", "ja": "甥・姪くらい", "pl": "jak bratanek/siostrzenica"},
    "자녀뻘(남부)": {"zh_cn": "晚辈（南部，子女辈）", "zh": "晚輩（南部，子女輩）", "en": "like one's child (South)", "fr": "comme son enfant (Sud)", "de": "im Alter eines Kindes (Süden)", "ja": "子どもくらい（南部）", "pl": "jak dziecko (Południe)"},
    "삼촌·아저씨뻘": {"zh_cn": "叔叔‧大叔辈", "zh": "叔叔‧大叔輩", "en": "like an uncle", "fr": "comme un oncle / homme d'âge mûr", "de": "wie ein Onkel / Herr mittleren Alters", "ja": "おじさんくらい", "pl": "jak wujek / pan w średnim wieku"},
    "이모·고모·아주머니뻘": {"zh_cn": "阿姨‧姑姑辈", "zh": "阿姨‧姑姑輩", "en": "like an aunt", "fr": "comme une tante / femme d'âge mûr", "de": "wie eine Tante / Dame mittleren Alters", "ja": "おばさんくらい", "pl": "jak ciocia / pani w średnim wieku"},
    "큰아버지·큰어머니뻘 어르신": {"zh_cn": "伯父‧伯母辈长者", "zh": "伯父‧伯母輩長者", "en": "like a respected elder (uncle/aunt)", "fr": "personne âgée très respectée (aîné)", "de": "wie ein hochgeachteter älterer Onkel / Tante", "ja": "伯父・伯母くらいの年配の方", "pl": "starsza osoba darzona szacunkiem"},
    "나(또래·북부)": {"zh_cn": "我（同辈‧北部）", "zh": "我（同輩‧北部）", "en": "I (peer, North)", "fr": "moi (pairs, Nord)", "de": "ich (gleichaltrig, Norden)", "ja": "私（同い年・北部）", "pl": "ja (rówieśnik, Północ)"},
    "너(또래·북부)": {"zh_cn": "你（同辈‧北部）", "zh": "你（同輩‧北部）", "en": "you (peer, North)", "fr": "toi (pairs, Nord)", "de": "du (gleichaltrig, Norden)", "ja": "あなた（同い年・北部）", "pl": "ty (rówieśnik, Północ)"},
    "나(또래·남부)": {"zh_cn": "我（同辈‧南部）", "zh": "我（同輩‧南部）", "en": "I (peer, South)", "fr": "moi (pairs, Sud)", "de": "ich (gleichaltrig, Süden)", "ja": "私（同い年・南部）", "pl": "ja (rówieśnik, Południe)"},
    "너(또래·남부)": {"zh_cn": "你（同辈‧南部）", "zh": "你（同輩‧南部）", "en": "you (peer, South)", "fr": "toi (pairs, Sud)", "de": "du (gleichaltrig, Süden)", "ja": "あなた（同い年・南部）", "pl": "ty (rówieśnik, Południe)"},
    "나(중립·예의)": {"zh_cn": "我（中立‧礼貌）", "zh": "我（中立‧禮貌）", "en": "I (neutral, polite)", "fr": "moi (neutre, poli)", "de": "ich (neutral, höflich)", "ja": "私（中立・丁寧）", "pl": "ja (neutralnie, uprzejmie)"},
    "나보다 어린 사람 — 동생뻘": {"zh_cn": "比我小的人——弟妹辈", "zh": "比我小的人——弟妹輩", "en": "Someone younger than me — like a younger sibling", "fr": "Plus jeune que moi — comme un petit frère/petite sœur", "de": "Jünger als ich – wie ein jüngeres Geschwister", "ja": "自分より年下の人 — 弟・妹くらい", "pl": "Osoba młodsza ode mnie — jak młodsze rodzeństwo"},
    "나와 동갑 — 원자료에 없어 새로 구성": {"zh_cn": "跟我同辈——原始资料没有，另行编写", "zh": "跟我同輩——原始資料沒有，另行編寫", "en": "My peers — not in the original material, newly composed", "fr": "Du même âge — pairs (adapté pour les apprenants)", "de": "Gleichaltrig mit mir – neu zusammengestellt", "ja": "私と同い年 — 元の資料にないため、新たに作成", "pl": "Rówieśnicy — zestawienie dla uczących się"},
    "나보다 손위 — 형·오빠·누나·언니뻘": {"zh_cn": "比我年长的人——哥哥姐姐辈", "zh": "比我年長的人——哥哥姐姐輩", "en": "Someone older than me — like an older sibling", "fr": "Plus âgé que moi — comme un grand frère/grande sœur", "de": "Älter als ich – wie ein älteres Geschwister", "ja": "私より年上 — 兄や姉にあたる人", "pl": "Osoba starsza ode mnie — jak starsze rodzeństwo"},
    "삼촌·이모뻘 — 내 아버지·어머니보다는 젊은 분(상대가 연장자)": {"zh_cn": "叔叔阿姨辈——比我父母年轻的长辈（对方年长）", "zh": "叔叔阿姨輩——比我父母年輕的長輩（對方年長）", "en": "Like an aunt/uncle — younger than my parents (they're older)", "fr": "Comme un oncle/une tante — plus jeune que mes parents (interlocuteur plus âgé)", "de": "Wie Onkel/Tante – jünger als meine Eltern (Gegenüber ist älter)", "ja": "おじ・おばにあたる方 — 私の父母より若い方（相手が年上）", "pl": "W wieku wujka/cioci — młodszy od moich rodziców (rozmówca starszy)"},
    "부모님 또래이거나 더 많으신 분(상대가 연장자)": {"zh_cn": "跟父母同辈或更年长（对方年长）", "zh": "跟父母同輩或更年長（對方年長）", "en": "About my parents' age or older (they're older)", "fr": "De l'âge de mes parents ou plus âgé (interlocuteur plus âgé)", "de": "Im Alter meiner Eltern oder älter (Gegenüber ist älter)", "ja": "両親と同世代か、それ以上の方（相手が年上）", "pl": "W wieku moich rodziców lub starszy (rozmówca starszy)"},
    "삼촌·이모뻘 — 내가 상대방보다 훨씬 연장자": {"zh_cn": "叔叔阿姨辈——我比对方年长很多", "zh": "叔叔阿姨輩——我比對方年長很多", "en": "Like an aunt/uncle — I'm much older than them", "fr": "Comme un oncle/une tante — je suis bien plus âgé", "de": "Wie Onkel/Tante – ich bin viel älter als das Gegenüber", "ja": "おじ・おばにあたる方 — 私が相手よりずっと年上", "pl": "W wieku wujka/cioci — jestem znacznie starszy"},
    "내가 상대방 부모보다 나이가 많음": {"zh_cn": "我比对方的父母年长", "zh": "我比對方的父母年長", "en": "I'm older than their parents", "fr": "Je suis plus âgé que ses parents", "de": "Ich bin älter als die Eltern der Person", "ja": "私が相手の親より年上", "pl": "Jestem starszy od rodziców rozmówcy"},
    "내가 형제일 때": {"zh_cn": "我是弟兄时", "zh": "我是弟兄時", "en": "When I'm a brother", "fr": "Quand je suis un frère", "de": "Wenn ich ein Bruder bin", "ja": "私が兄弟の場合", "pl": "Gdy jestem bratem"},
    "내가 자매일 때": {"zh_cn": "我是姐妹时", "zh": "我是姐妹時", "en": "When I'm a sister", "fr": "Quand je suis une sœur", "de": "Wenn ich eine Schwester bin", "ja": "私が姉妹の場合", "pl": "Gdy jestem siostrą"},
    "상대가 남성일 때": {"zh_cn": "对方是男性时", "zh": "對方是男性時", "en": "When they're male", "fr": "Quand l'interlocuteur est un homme", "de": "Wenn die Person männlich ist", "ja": "相手が男性の場合", "pl": "Gdy rozmówca jest mężczyzną"},
    "상대가 여성일 때": {"zh_cn": "对方是女性时", "zh": "對方是女性時", "en": "When they're female", "fr": "Quand l'interlocuteur est une femme", "de": "Wenn die Person weiblich ist", "ja": "相手が女性の場合", "pl": "Gdy rozmówca jest kobietą"},
    "상대가 남성 · 북부": {"zh_cn": "对方是男性‧北部", "zh": "對方是男性‧北部", "en": "Male, North", "fr": "Homme, Nord", "de": "Männlich, Norden", "ja": "相手が男性・北部", "pl": "Mężczyzna, Północ"},
    "상대가 남성 · 남부": {"zh_cn": "对方是男性‧南部", "zh": "對方是男性‧南部", "en": "Male, South", "fr": "Homme, Sud", "de": "Männlich, Süden", "ja": "相手が男性・南部", "pl": "Mężczyzna, Południe"},
    "상대가 여성 · 북부": {"zh_cn": "对方是女性‧北部", "zh": "對方是女性‧北部", "en": "Female, North", "fr": "Femme, Nord", "de": "Weiblich, Norden", "ja": "相手が女性・北部", "pl": "Kobieta, Północ"},
    "상대가 여성 · 남부": {"zh_cn": "对方是女性‧南部", "zh": "對方是女性‧南部", "en": "Female, South", "fr": "Femme, Sud", "de": "Weiblich, Süden", "ja": "相手が女性・南部", "pl": "Kobieta, Południe"},
    "내가 남성 · 북부": {"zh_cn": "我是男性‧北部", "zh": "我是男性‧北部", "en": "I'm male, North", "fr": "Je suis un homme, Nord", "de": "Ich bin männlich, Norden", "ja": "私が男性・北部", "pl": "Jestem mężczyzną, Północ"},
    "내가 남성 · 남부": {"zh_cn": "我是男性‧南部", "zh": "我是男性‧南部", "en": "I'm male, South", "fr": "Je suis un homme, Sud", "de": "Ich bin männlich, Süden", "ja": "私が男性・南部", "pl": "Jestem mężczyzną, Południe"},
    "내가 여성 · 북부": {"zh_cn": "我是女性‧北部", "zh": "我是女性‧北部", "en": "I'm female, North", "fr": "Je suis une femme, Nord", "de": "Ich bin weiblich, Norden", "ja": "私が女性・北部", "pl": "Jestem kobietą, Północ"},
    "내가 여성 · 남부": {"zh_cn": "我是女性‧南部", "zh": "我是女性‧南部", "en": "I'm female, South", "fr": "Je suis une femme, Sud", "de": "Ich bin weiblich, Süden", "ja": "私が女性・南部", "pl": "Jestem kobietą, Południe"},
    "상대가 20~30대 남성": {"zh_cn": "对方是20～30多岁男性", "zh": "對方是20～30多歲男性", "en": "Male, 20s–30s", "fr": "Homme, 20–30 ans", "de": "Männlich, 20er–30er Jahre", "ja": "相手が20~30代の男性", "pl": "Mężczyzna, 20–30 lat"},
    "상대가 20~30대 여성": {"zh_cn": "对方是20～30多岁女性", "zh": "對方是20～30多歲女性", "en": "Female, 20s–30s", "fr": "Femme, 20–30 ans", "de": "Weiblich, 20er–30er Jahre", "ja": "相手が20~30代の女性", "pl": "Kobieta, 20–30 lat"},
    "상대가 40~70대 남성": {"zh_cn": "对方是40～70多岁男性", "zh": "對方是40～70多歲男性", "en": "Male, 40s–70s", "fr": "Homme, 40–70 ans", "de": "Männlich, 40er–70er Jahre", "ja": "相手が40~70代の男性", "pl": "Mężczyzna, 40–70 lat"},
    "상대가 40~70대 여성": {"zh_cn": "对方是40～70多岁女性", "zh": "對方是40～70多歲女性", "en": "Female, 40s–70s", "fr": "Femme, 40–70 ans", "de": "Weiblich, 40er–70er Jahre", "ja": "相手が40~70代の女性", "pl": "Kobieta, 40–70 lat"},
    "상대가 80대 이상": {"zh_cn": "对方是80岁以上", "zh": "對方是80歲以上", "en": "80 or older", "fr": "80 ans ou plus", "de": "80 Jahre oder älter", "ja": "相手が80代以上", "pl": "80 lat lub więcej"},
    "상대를 부를 때": {"cs": "Při oslovení druhé osoby", "zh_cn": "称呼对方时", "zh": "稱呼對方時", "en": "When addressing them", "fr": "Pour s'adresser à l'interlocuteur", "de": "Anrede für das Gegenüber", "hu": "A másik fél megszólításakor", "id": "Saat memanggil lawan bicara", "ja": "相手を呼ぶとき", "pl": "Zwrot do rozmówcy"},
    "나를 가리킬 때": {"cs": "Když mluvím o sobě", "zh_cn": "称呼自己时", "zh": "稱呼自己時", "en": "When referring to yourself", "fr": "Pour se désigner soi-même", "de": "Selbstbezeichnung (Ich)", "hu": "Amikor magamra utalok", "id": "Saat merujuk diri sendiri", "ja": "自分を指すとき", "pl": "Określenie siebie"},
    "문장 끝: ": {"cs": "Konec věty: ", "zh_cn": "句尾：", "zh": "句尾：", "en": "End of sentence: ", "fr": "Fin de phrase : ", "de": "Satzende: ", "hu": "Mondat vége: ", "id": "Akhir kalimat: ", "ja": "文末: ", "pl": "Koniec zdania: "},
    "대답 시작: ": {"cs": "Začátek odpovědi: ", "zh_cn": "回答开头：", "zh": "回答開頭：", "en": "Start of reply: ", "fr": "Début de réponse : ", "de": "Antwortbeginn: ", "hu": "Válasz kezdete: ", "id": "Awal tanggapan: ", "ja": "返事の始め: ", "pl": "Początek odpowiedzi: "},
    "<b>ạ</b> (존대)": {"zh_cn": "<b>ạ</b>（敬语）", "zh": "<b>ạ</b>（敬語）", "en": "<b>ạ</b> (polite)", "fr": "<b>ạ</b> (poli)", "de": "<b>ạ</b> (höflich)", "ja": "<b>ạ</b>（敬語）", "pl": "<b>ạ</b> (uprzejmie)"},
    "<b>없음</b> (편하게)": {"zh_cn": "<b>没有</b>（随意）", "zh": "<b>沒有</b>（隨意）", "en": "<b>None</b> (casual)", "fr": "<b>Aucun</b> (familier)", "de": "<b>Keine</b> (umgangssprachlich)", "ja": "<b>なし</b>（気軽に）", "pl": "<b>Brak</b> (swobodnie)"},
    "<b>없음</b>": {"zh_cn": "<b>没有</b>", "zh": "<b>沒有</b>", "en": "<b>None</b>", "fr": "<b>Aucun</b>", "de": "<b>Keine</b>", "ja": "<b>なし</b>", "pl": "<b>Brak</b>"},
    "<b>dạ</b> (네)": {"zh_cn": "<b>dạ</b>（是）", "zh": "<b>dạ</b>（是）", "en": "<b>dạ</b> (yes)", "fr": "<b>dạ</b> (oui)", "de": "<b>dạ</b> (ja)", "ja": "<b>dạ</b>（はい）", "pl": "<b>dạ</b> (tak)"},
    "발음 듣기": {"vi": "Nghe phát âm", "cs": "Poslechnout výslovnost", "zh_cn": "播放发音", "zh": "播放發音", "en": "Play pronunciation", "fr": "Écouter la prononciation", "de": "Aussprache anhören", "hu": "Kiejtés meghallgatása", "id": "Dengar Lafal", "ja": "発音を聞く", "pl": "Odsłuchaj wymowę"},
    "눌러서 뜻 보기": {"cs": "Klepnutím zobrazit význam", "zh_cn": "点一下看意思", "zh": "點一下看意思", "en": "Tap to reveal meaning", "fr": "Appuyer pour afficher le sens", "de": "Tippen für Bedeutung", "hu": "Koppintson a jelentéshez", "id": "Ketuk untuk melihat arti", "ja": "タップして意味を見る", "pl": "Dotknij, aby zobaczyć znaczenie"},
    "눌러서 가리기": {"cs": "Klepnutím skrýt", "zh_cn": "点一下遮住", "zh": "點一下遮住", "en": "Tap to hide", "fr": "Appuyer pour masquer", "de": "Tippen zum Verbergen", "hu": "Koppintson az elrejtéshez", "id": "Ketuk untuk menyembunyikan", "ja": "タップして隠す", "pl": "Dotknij, aby ukryć"},
    "남성 형제": {"zh_cn": "男性弟兄", "zh": "男性弟兄", "en": "a brother", "fr": "un frère", "de": "ein Bruder", "ja": "男性の兄弟", "pl": "brat"},
    "여성 자매": {"zh_cn": "女性姐妹", "zh": "女性姐妹", "en": "a sister", "fr": "une sœur", "de": "eine Schwester", "ja": "女性の姉妹", "pl": "siostra"},
    "장로 형제": {"zh_cn": "长老弟兄", "zh": "長老弟兄", "en": "Elder Brother", "fr": "un ancien", "de": "ein Ältester", "ja": "長老の兄弟", "pl": "starszy zboru"},
    "파이오니아 자매": {"zh_cn": "先驱姐妹", "zh": "先驅姐妹", "en": "Pioneer Sister", "fr": "une pionnière", "de": "eine Pionierschwester", "ja": "開拓者の姉妹", "pl": "pionierka"},
    "이성과의 만남이에요. 인사와 소개 후에는 같은 성별의 동료(": {"cs": "Setkání s osobou opačného pohlaví. Po pozdravu a představení předejte kontakt spolupracovníkovi stejného pohlaví (", "zh_cn": "这是异性会面。打过招呼、做完自我介绍后，最好把联络方式转交给同性別的同伴（", "zh": "這是異性會面。打過招呼、做完自我介紹後，最好把聯絡方式轉交給同性別的同伴（", "en": "This is a meeting with someone of the opposite sex. After greeting and introducing yourself, it's best to hand off contact info to a same-gender companion (", "fr": "Il s'agit d'une rencontre avec une personne du sexe opposé. Après les salutations et la présentation, il est préférable de transmettre les coordonnées à un compagnon du même sexe (", "de": "Dies ist ein Treffen mit einer Person des anderen Geschlechts. Nach der Begrüßung und Vorstellung empfiehlt es sich, die Kontaktdaten an einen gleichgeschlechtlichen Dienstpartner (", "hu": "Találkozás ellenkező nemű személlyel. Üdvözlés és bemutatkozás után adja át a kapcsolatot egy azonos nemű társnak (", "id": "Pertemuan dengan lawan jenis. Setelah menyapa dan memperkenalkan diri, serahkan kontak ke rekan yang berjenis kelamin sama (", "ja": "異性との面会です。挨拶と自己紹介を済ませたら、同性の奉仕の仲間（", "pl": "To spotkanie z osobą przeciwnej płci. Po powitaniu i przedstawieniu się warto przekazać kontakt współpracownikowi tej samej płci ("},
    ")에게 연락처를 전달하고, 재방문·성서 연구는 그 동료와 함께 진행하는 것이 좋아요.": {"cs": ") a opětovné návštěvy a biblická studia vést společně s tímto spolupracovníkem.", "zh_cn": "），并和该同伴一起进行重访和圣经研究。", "zh": "），並和該同伴一起進行重訪和聖經研究。", "en": ") and have that person join you for the callback and Bible study.", "fr": ") et d'effectuer les nouvelles visites et le cours biblique avec ce compagnon.", "de": ") weiterzugeben und Rückbesuche sowie das Bibelstudium gemeinsam durchzuführen.", "hu": "), és az újralátogatásokat és a bibliatanulmányozást vele együtt érdemes folytatni.", "id": ") dan melanjutkan kunjungan kembali serta pelajaran Alkitab bersama rekan tersebut.", "ja": "）に連絡先を渡し、再訪問・聖書研究はその仲間と一緒に行うとよいでしょう。", "pl": ") i prowadzić odwiedziny ponowne oraz studium biblijne razem z nim."},
    "봉사짝 호칭: ": {"cs": "Oslovení spolupracovníka: ", "zh_cn": "传道夥伴称呼：", "zh": "傳道夥伴稱呼：", "en": "Companion's term of address: ", "fr": "Terme d'adresse du compagnon : ", "de": "Anrede des Dienstpartners: ", "hu": "Szolgálati társ megszólítása: ", "id": "Panggilan rekan: ", "ja": "奉仕の仲間の呼び方： ", "pl": "Forma do współgłosiciela: "},
    "이전 단계": {"cs": "Předchozí krok", "zh_cn": "上一步", "zh": "上一步", "en": "Previous", "fr": "Étape précédente", "de": "Vorheriger Schritt", "hu": "Előző lépés", "id": "Langkah Sebelumnya", "ja": "前へ", "pl": "Poprzedni krok"},
    "다음 단계": {"cs": "Další krok", "zh_cn": "下一步", "zh": "下一步", "en": "Next", "fr": "Étape suivante", "de": "Nächster Schritt", "hu": "Következő lépés", "id": "Langkah Berikutnya", "ja": "次へ", "pl": "Następny krok"},
    "아직 참여자 정보가 입력되지 않았어요. 입력하면 위 대화문의 이름·전화번호·나이·호칭이 자동으로 채워져요.": {"cs": "Zatím nebyly zadány žádné informace o účastníkovi. Po jejich vyplnění se jméno, telefonní číslo, věk a oslovení ve výše uvedeném dialogu doplní automaticky.", "zh_cn": "还没输入参与者资讯。输入后，上面对话中的姓名‧电话号碼‧年龄‧称呼会自动填入。", "zh": "還沒輸入參與者資訊。輸入後，上面對話中的姓名‧電話號碼‧年齡‧稱呼會自動填入。", "en": "No participant info entered yet. Fill it in and the name, phone number, age, and terms of address in the dialogue above will fill in automatically.", "fr": "Les informations sur les interlocuteurs n'ont pas encore été saisies. Une fois renseignées, le nom, le numéro de téléphone, l'âge et les formules d'adresse dans les dialogues s'adapteront automatiquement.", "de": "Noch keine Teilnehmerdaten eingegeben. Nach der Eingabe werden Name, Telefonnummer, Alter und Anredeformen oben automatisch ausgefüllt.", "hu": "Még nincsenek megadva a résztvevő adatai. Ha kitölti, a fenti beszélgetésben a név, telefonszám, életkor és megszólítás automatikusan kitöltődik.", "id": "Belum ada informasi peserta yang dimasukkan. Jika diisi, nama, nomor telepon, usia, dan panggilan dalam percakapan di atas akan terisi otomatis.", "ja": "まだ参加者情報が入力されていません。入力すると、上の会話文の名前・電話番号・年齢・呼び方が自動的に入力されます。", "pl": "Nie wprowadzono jeszcze informacji o rozmówcach. Po ich podaniu imię, numer telefonu, wiek i formy grzecznościowe w dialogu uzupełnią się automatycznie."},
    "대화 탭에서 참여자 정보 입력하기 →": {"cs": "Zadat informace o účastníkovi na kartě Rozhovory →", "zh_cn": "到「对话」分页输入参与者资讯 →", "zh": "到「對話」分頁輸入參與者資訊 →", "en": "Enter participant info in the Dialogue tab →", "fr": "Saisir les informations sous l'onglet Dialogue →", "de": "Teilnehmerdaten im Tab Dialog eingeben →", "hu": "Résztvevő adatainak megadása a Beszélgetések lapon →", "id": "Masukkan info peserta di tab Percakapan →", "ja": "「会話」タブで参加者情報を入力する →", "pl": "Wprowadź informacje w zakładce Rozmowy →"},
    "대화 탭에서 참여자 정보 수정하기 →": {"cs": "Upravit informace o účastníkovi na kartě Rozhovory →", "zh_cn": "到「对话」分页修改参与者资讯 →", "zh": "到「對話」分頁修改參與者資訊 →", "en": "Edit participant info in the Dialogue tab →", "fr": "Modifier les informations sous l'onglet Dialogue →", "de": "Teilnehmerdaten im Tab Dialog bearbeiten →", "hu": "Résztvevő adatainak szerkesztése a Beszélgetések lapon →", "id": "Ubah info peserta di tab Percakapan →", "ja": "「会話」タブで参加者情報を編集する →", "pl": "Edytuj informacje w zakładce Rozmowy →"},
    "이름 미입력": {"cs": "Jméno nezadáno", "zh_cn": "尚未输入姓名", "zh": "尚未輸入姓名", "en": "No name entered", "fr": "Nom non renseigné", "de": "Kein Name eingegeben", "hu": "Nincs megadva név", "id": "Nama belum diisi", "ja": "名前未入力", "pl": "Brak imienia"},
    "호칭 ": {"cs": "Oslovení: ", "zh_cn": "称呼 ", "zh": "稱呼 ", "en": "Address: ", "fr": "Adresse : ", "de": "Anrede: ", "hu": "Megszólítás: ", "id": "Panggilan: ", "ja": "呼び方 ", "pl": "Forma: "},
    "세": {"cs": " let", "zh_cn": "岁", "zh": "歲", "en": " y/o", "fr": " ans", "de": " Jahre", "hu": " éves", "id": " thn", "ja": "歳", "pl": " lat"},
    "이전 카드": {"cs": "Předchozí karta", "zh_cn": "上一张卡片", "zh": "上一張卡片", "en": "Previous card", "fr": "Carte précédente", "de": "Vorherige Karte", "hu": "Előző kártya", "id": "Kartu Sebelumnya", "ja": "前のカード", "pl": "Poprzednia karta"},
    "다시 듣기": {"cs": "Přehrát znovu", "zh_cn": "重新播放", "zh": "重新播放", "en": "Play again", "fr": "Réécouter", "de": "Erneut anhören", "hu": "Újrahallgatás", "id": "Putar Ulang", "ja": "もう一度聞く", "pl": "Odtwórz ponownie"},
    "섞기": {"cs": "Zamíchat", "zh_cn": "洗牌", "zh": "洗牌", "en": "Shuffle", "fr": "Mélanger", "de": "Mischen", "hu": "Keverés", "id": "Acak", "ja": "シャッフル", "pl": "Wymieszaj"},
    "다음 카드": {"cs": "Další karta", "zh_cn": "下一张卡片", "zh": "下一張卡片", "en": "Next card", "fr": "Carte suivante", "de": "Nächste Karte", "hu": "Következő kártya", "id": "Kartu Berikutnya", "ja": "次のカード", "pl": "Następna karta"},
    "듣고 알맞은 뜻을 고르세요": {"cs": "Poslechněte si a vyberte správný význam", "zh_cn": "听发音，选出正确的意思", "zh": "聽發音，選出正確的意思", "en": "Listen and choose the correct meaning", "fr": "Écoutez et choisissez le bon sens", "de": "Hören und die richtige Bedeutung wählen", "hu": "Hallgassa meg és válassza ki a helyes jelentést", "id": "Dengarkan dan pilih arti yang benar", "ja": "聞いて正しい意味を選んでください", "pl": "Posłuchaj i wybierz właściwe znaczenie"},
    "보고 알맞은 뜻을 고르세요": {"cs": "Podívejte se na slovo a vyberte správný význam", "zh_cn": "看单字，选出正确的意思", "zh": "看單字，選出正確的意思", "en": "Look at the word and choose the correct meaning", "fr": "Regardez le mot et choisissez le bon sens", "de": "Wort ansehen und die richtige Bedeutung wählen", "hu": "Nézze meg a szót, és válassza ki a helyes jelentést", "id": "Lihat kata dan pilih arti yang benar", "ja": "見て正しい意味を選んでください", "pl": "Spójrz na słowo i wybierz właściwe znaczenie"},
    "다음 문제 →": {"cs": "Další otázka →", "zh_cn": "下一题 →", "zh": "下一題 →", "en": "Next →", "fr": "Question suivante →", "de": "Nächste Frage →", "hu": "Következő kérdés →", "id": "Pertanyaan Berikutnya →", "ja": "次の問題 →", "pl": "Następne pytanie →"},
    "다시 담기": {"vi": "Thêm lại", "cs": "Obnovit", "zh_cn": "重新排列", "zh": "重新排列", "en": "Reset", "fr": "Remettre", "de": "Wiederholen", "hu": "Visszaállítás", "id": "Simpan Lagi", "ja": "リセット", "pl": "Powtórz"},
    "정답이에요! 🎉": {"cs": "Správně! 🎉", "zh_cn": "答对了！🎉", "zh": "答對了！🎉", "en": "Correct! 🎉", "fr": "Bonne réponse ! 🎉", "de": "Richtig! 🎉", "hu": "Helyes! 🎉", "id": "Benar! 🎉", "ja": "正解です！🎉", "pl": "Prawidłowo! 🎉"},
    "순서가 달라요. 다시 시도해 보세요.": {"cs": "Špatný slovosled — zkuste to znovu.", "zh_cn": "顺序不对，请再试一次。", "zh": "順序不對，請再試一次。", "en": "Wrong order — try again.", "fr": "L'ordre n'est pas correct. Réessayez.", "de": "Falsche Reihenfolge – bitte noch einmal versuchen.", "hu": "Helytelen sorrend — próbálja újra.", "id": "Urutan salah — coba lagi.", "ja": "順序が違います。もう一度試してください。", "pl": "Nieprawidłowa kolejność — spróbuj ponownie."},
    "정답: ": {"cs": "Odpověď: ", "zh_cn": "正确答案：", "zh": "正確答案：", "en": "Answer: ", "fr": "Réponse : ", "de": "Richtige Antwort: ", "hu": "Válasz: ", "id": "Jawaban: ", "ja": "正解： ", "pl": "Odpowiedź: "},
    "확인": {"vi": "Xác nhận", "cs": "Potvrdit", "zh_cn": "确认", "zh": "確認", "en": "Check", "fr": "Vérifier", "de": "Bestätigen", "hu": "Megerősítés", "id": "Konfirmasi", "ja": "確認", "pl": "Sprawdź"},
    "다시 확인해 보세요.": {"cs": "Zkontrolujte to znovu.", "zh_cn": "请再检查一次。", "zh": "請再檢查一次。", "en": "Check again.", "fr": "Vérifiez à nouveau.", "de": "Bitte noch einmal prüfen.", "hu": "Ellenőrizze újra.", "id": "Periksa kembali.", "ja": "もう一度確認してください。", "pl": "Sprawdź ponownie."},
    "이 탭에는 아직 복습할 자료가 없어요.": {"cs": "Na této kartě zatím nejsou žádné materiály k opakování.", "zh_cn": "这个分页还没有可复习的资料。", "zh": "這個分頁還沒有可複習的資料。", "en": "There's no material to review in this tab yet.", "fr": "Il n'y a pas encore de contenu à réviser sous cet onglet.", "de": "In diesem Tab gibt es noch kein Material zum Wiederholen.", "hu": "Ezen a lapon még nincs ismétlendő anyag.", "id": "Belum ada materi untuk diulas di tab ini.", "ja": "このタブにはまだ復習する内容がありません。", "pl": "W tej zakładce nie ma jeszcze materiałów do powtórki."},
    "010-0000-0000": {"cs": "010-0000-0000", "zh_cn": "0900-000-000", "zh": "0900-000-000", "en": "010-0000-0000", "fr": "010-0000-0000", "de": "010-0000-0000", "hu": "010-0000-0000", "id": "010-0000-0000", "ja": "0X0-0000-0000", "pl": "010-0000-0000"},
    "대화 탭에서 선택한 나와 상대방의 관계에 따라, 제공 연설 대화문 속 \"저는(tôi)\"·\"당신은(bạn)\" 표현이 실제 상황에 맞는 호칭으로 자동으로 바뀌어요. 아직 선택하지 않았다면 원문 그대로 tôi·bạn으로 표시돼요.": {"zh_cn": "「提供演讲」对话文中的「我是(tôi)」‧「您是(bạn)」会依照您在〔对话〕分页中选择的双方关系，自动换成符合实际情况的称呼。若尚未选择，则会维持原文显示为 tôi‧bạn。", "zh": "「提供演講」對話文中的「我是(tôi)」‧「您是(bạn)」會依照您在〔對話〕分頁中選擇的雙方關係，自動換成符合實際情況的稱呼。若尚未選擇，則會維持原文顯示為 tôi‧bạn。", "en": "Based on the relationship you selected in the [Dialogue] tab, the \"I (tÃÂ´i)\" / \"you (bÃ¡ÂºÂ¡n)\" expressions in the offer-talk dialogue automatically change to the appropriate terms of address for that situation. If nothing has been selected yet, they stay as the original tÃÂ´i/bÃ¡ÂºÂ¡n.", "fr": "Selon la relation choisie sous l'onglet Dialogue, les expressions « tôi » (je) et « bạn » (vous) dans les présentations modèles sont automatiquement remplacées par les termes adaptés. Si aucun choix n'a été fait, les termes originaux tôi et bạn sont conservés.", "de": "Je nach der im Tab [Dialog] gewählten Beziehung zwischen Ihnen und der Person werden die Ausdrücke „ich (tôi)“ und „Sie/du (bạn)“ im Gesprächsvorschlag automatisch an die reale Situation angepasst. Wurde noch nichts ausgewählt, bleibt die Originalanzeige tôi/bạn.", "ja": "「会話」タブで選択した自分と相手の関係に応じて、提供トークの会話文にある「私は(tôi)」・「あなたは(bạn)」という表現が、実際の状況に合った呼び方に自動的に変わります。まだ選択していない場合は、原文のまま tôi・bạn と表示されます。", "pl": "W zależności od relacji wybranej w zakładce Rozmowy, zaimki „tôi” i „bạn” we wzorach rozmów automatycznie zmienią się na właściwe formy grzecznościowe."},
    "현재 대화문: 상대를 부를 때 “": {"cs": "Aktuální dialog: oslovení druhé osoby „", "zh_cn": "目前对话文：称呼对方时用「", "zh": "目前對話文：稱呼對方時用「", "en": "Current dialogue: addressing the other person as \"", "fr": "Dialogue actuel : s'adresser à l'interlocuteur avec « ", "de": "Aktueller Dialog: Anrede für das Gegenüber „", "hu": "Jelenlegi beszélgetés: a másik megszólítása: „", "id": "Percakapan saat ini: memanggil lawan bicara: “", "ja": "現在の会話文：相手を呼ぶときは「", "pl": "Bieżący dialog: zwracanie się do rozmówcy jako „"},
    "”, 나를 가리킬 때 “": {"cs": "“, pro sebe „", "zh_cn": "」，称呼自己时用「", "zh": "」，稱呼自己時用「", "en": "\", and referring to yourself as \"", "fr": " », et se désigner soi-même avec « ", "de": "“, Selbstbezeichnung „", "hu": "”, saját magára: „", "id": "”, untuk diri sendiri: “", "ja": "」、自分を指すときは「", "pl": "”, a określanie siebie jako „"},
    "” 로 표시돼요.": {"cs": "“ se zobrazí.", "zh_cn": "」来显示。", "zh": "」來顯示。", "en": "\".", "fr": " ».", "de": "“.", "hu": "” formában jelenik meg.", "id": "” ditampilkan.", "ja": "」と表示されます。", "pl": "”."},
    "<p class=\"p-desc\">iOS/iPadOS의 내장 기능을 사용하면 별도의 앱 설치 없이 베트남어 텍스트를 읽게 할 수 있어요.</p><h4>1단계: 베트남어 TTS 음성 다운로드하기</h4><ol><li>설정 앱을 엽니다.</li><li><b>손쉬운 사용</b> 메뉴로 이동합니다.</li><li><b>읽기 및 말하기</b>(또는 iOS 버전에 따라 <b>콘텐츠 말하기</b>)를 선택합니다.</li><li><b>음성</b>을 탭합니다.</li><li>스크롤을 내려 <b>베트남어</b>를 선택합니다.</li><li>원하는 목소리(예: Linh) 옆의 구름 모양(다운로드) 아이콘을 눌러 음성 데이터를 다운로드합니다. ‘고품질’ 버전을 다운로드하면 훨씬 자연스러운 AI 음성으로 들을 수 있어요.</li></ol><h4>2단계: 화면의 베트남어 텍스트 읽히기 (사용 방법)</h4><p class=\"p-desc\">다운로드가 완료되면 다음 두 가지 방법으로 베트남어를 읽게 만들 수 있어요. 동일하게 설정 &gt; 손쉬운 사용 &gt; 콘텐츠 말하기 메뉴에서 활성화할 수 있습니다.</p><h4>방법 A: 선택 항목 말하기 (추천)</h4><ol><li>설정 방법: ‘선택 항목 말하기’ 기능을 켭니다.</li><li>사용 방법: 웹서핑이나 텍스트 앱에서 베트남어 단어·문장을 길게 눌러 블록을 지정한 후, 팝업 메뉴에서 ‘말하기’를 누르면 베트남어로 읽어줘요.</li></ol><h4>방법 B: 화면 말하기</h4><ol><li>설정 방법: ‘화면 말하기’ 기능을 켭니다.</li><li>사용 방법: 베트남어로 된 뉴스나 전자책 화면에서 두 손가락으로 화면 상단에서 아래로 쓸어내리면 화면 전체의 텍스트를 자동으로 인식해 처음부터 끝까지 읽어줘요.</li></ol>": {"zh_cn": "<p class=\"p-desc\">Ã¤Â½Â¿Ã§ÂÂ¨ iOS/iPadOS Ã§ÂÂÃ¥ÂÂÃ¥Â»ÂºÃ¥ÂÂÃ¨ÂÂ½,Ã¤Â¸ÂÃ©ÂÂÃ¨Â¦ÂÃ¥ÂÂ¦Ã¥Â¤ÂÃ¥Â®ÂÃ¨Â£Â App,Ã¥Â°Â±Ã¨ÂÂ½Ã¨Â®Â©Ã¨Â£ÂÃ§Â½Â®Ã¦ÂÂÃ¨Â¯Â»Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂÃ¥Â­ÂÃ£ÂÂ</p><h4>Ã¦Â­Â¥Ã©Â©ÂÃ¤Â¸Â:Ã¤Â¸ÂÃ¨Â½Â½Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­ TTS Ã¨Â¯Â­Ã©ÂÂ³</h4><ol><li>Ã¥Â¼ÂÃ¥ÂÂ¯Ã£ÂÂÃ¨Â®Â¾Ã¥Â®ÂÃ£ÂÂAppÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾Â<b>Ã¨Â¾ÂÃ¥ÂÂ©Ã¤Â½Â¿Ã§ÂÂ¨</b>Ã©ÂÂÃ¥ÂÂÃ£ÂÂ</li><li>Ã©ÂÂÃ¦ÂÂ©<b>Ã¦ÂÂÃ¨Â¯Â»Ã¥ÂÂÃ¥Â®Â¹</b>(Ã¤Â¾Â iOS Ã§ÂÂÃ¦ÂÂ¬Ã¤Â¸ÂÃ¥ÂÂ,Ã¤ÂºÂ¦Ã¥ÂÂ¯Ã¨ÂÂ½Ã¦ÂÂ¾Ã§Â¤ÂºÃ¤Â¸Âº<b>Ã¨Â®Â²Ã¥ÂÂºÃ¥ÂÂÃ¥Â®Â¹</b>)Ã£ÂÂ</li><li>Ã§ÂÂ¹Ã¤Â¸ÂÃ¤Â¸Â<b>Ã¨Â¯Â­Ã©ÂÂ³</b>Ã£ÂÂ</li><li>Ã¥Â¾ÂÃ¤Â¸ÂÃ¦ÂÂ²Ã¥ÂÂ¨Ã¥Â¹Â¶Ã©ÂÂÃ¦ÂÂ©<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­</b>Ã£ÂÂ</li><li>Ã§ÂÂ¹Ã©ÂÂÃ¦ÂÂ³Ã¨Â¦ÂÃ§ÂÂÃ¨Â¯Â­Ã©ÂÂ³(Ã¤Â¾ÂÃ¥Â¦Â Linh)Ã¦ÂÂÃ¨Â¾Â¹Ã§ÂÂÃ©ÂÂ²Ã¦ÂÂµ(Ã¤Â¸ÂÃ¨Â½Â½)Ã¥ÂÂ¾Ã§Â¤Âº,Ã¥ÂÂ³Ã¥ÂÂ¯Ã¤Â¸ÂÃ¨Â½Â½Ã¨Â¯Â­Ã©ÂÂ³Ã¨ÂµÂÃ¦ÂÂÃ£ÂÂÃ¨ÂÂ¥Ã¤Â¸ÂÃ¨Â½Â½Ã£ÂÂÃ©Â«ÂÃ¥ÂÂÃ¨Â´Â¨Ã£ÂÂÃ§ÂÂÃ¦ÂÂ¬,Ã¥Â°Â±Ã¨ÂÂ½Ã¥ÂÂ¬Ã¥ÂÂ°Ã¦ÂÂ´Ã¨ÂÂªÃ§ÂÂ¶Ã§ÂÂ AI Ã¨Â¯Â­Ã©ÂÂ³Ã£ÂÂ</li></ol><h4>Ã¦Â­Â¥Ã©Â©ÂÃ¤ÂºÂ:Ã¨Â®Â©Ã¨ÂÂ¢Ã¥Â¹ÂÃ¤Â¸ÂÃ§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂÃ¥Â­ÂÃ¨Â¢Â«Ã¦ÂÂÃ¨Â¯Â»Ã¥ÂÂºÃ¦ÂÂ¥(Ã¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂ¹Ã¦Â³Â)</h4><p class=\"p-desc\">Ã¤Â¸ÂÃ¨Â½Â½Ã¥Â®ÂÃ¦ÂÂÃ¥ÂÂ,Ã¥ÂÂ¯Ã¤Â»Â¥Ã©ÂÂÃ¨Â¿ÂÃ¤Â»Â¥Ã¤Â¸ÂÃ¤Â¸Â¤Ã§Â§ÂÃ¦ÂÂ¹Ã¥Â¼ÂÃ¨Â®Â©Ã¨Â£ÂÃ§Â½Â®Ã¦ÂÂÃ¨Â¯Â»Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã£ÂÂÃ¨Â¿ÂÃ¤Â¸Â¤Ã©Â¡Â¹Ã¥ÂÂÃ¨ÂÂ½Ã¥ÂÂÃ¦Â Â·Ã¥ÂÂ¯Ã¥ÂÂ¨Ã£ÂÂÃ¨Â®Â¾Ã¥Â®Â &gt; Ã¨Â¾ÂÃ¥ÂÂ©Ã¤Â½Â¿Ã§ÂÂ¨ &gt; Ã¨Â®Â²Ã¥ÂÂºÃ¥ÂÂÃ¥Â®Â¹Ã£ÂÂÃ©ÂÂÃ¥ÂÂÃ¤Â¸Â­Ã¥Â¼ÂÃ¥ÂÂ¯Ã£ÂÂ</p><h4>Ã¦ÂÂ¹Ã¦Â³Â A:Ã¦ÂÂÃ¨Â¯Â»Ã¦ÂÂÃ©ÂÂÃ©Â¡Â¹Ã§ÂÂ®(Ã¦ÂÂ¨Ã¨ÂÂ¦)</h4><ol><li>Ã¨Â®Â¾Ã¥Â®ÂÃ¦ÂÂ¹Ã¦Â³Â:Ã¥Â¼ÂÃ¥ÂÂ¯Ã£ÂÂÃ¦ÂÂÃ¨Â¯Â»Ã¦ÂÂÃ©ÂÂÃ©Â¡Â¹Ã§ÂÂ®Ã£ÂÂÃ¥ÂÂÃ¨ÂÂ½Ã£ÂÂ</li><li>Ã¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂ¹Ã¦Â³Â:Ã¥ÂÂ¨Ã¦ÂµÂÃ¨Â§ÂÃ§Â½ÂÃ©Â¡ÂµÃ¦ÂÂÃ¦ÂÂÃ¥Â­Â App Ã¦ÂÂ¶,Ã©ÂÂ¿Ã¦ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¥ÂÂÃ¥Â­ÂÃ¦ÂÂÃ¥ÂÂ¥Ã¥Â­ÂÃ¤Â»Â¥Ã©ÂÂÃ¥ÂÂÃ¨ÂÂÃ¥ÂÂ´,Ã¦ÂÂ¥Ã§ÂÂÃ¥ÂÂ¨Ã¥Â½ÂÃ¥ÂÂºÃ¥Â¼ÂÃ©ÂÂÃ¥ÂÂÃ¤Â¸Â­Ã§ÂÂ¹Ã©ÂÂÃ£ÂÂÃ¦ÂÂÃ¨Â¯Â»Ã£ÂÂ,Ã¥ÂÂ³Ã¥ÂÂ¯Ã¥ÂÂ¬Ã¥ÂÂ°Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂÃ¨Â¯Â»Ã£ÂÂ</li></ol><h4>Ã¦ÂÂ¹Ã¦Â³Â B:Ã¦ÂÂÃ¨Â¯Â»Ã¨ÂÂ¢Ã¥Â¹Â</h4><ol><li>Ã¨Â®Â¾Ã¥Â®ÂÃ¦ÂÂ¹Ã¦Â³Â:Ã¥Â¼ÂÃ¥ÂÂ¯Ã£ÂÂÃ¦ÂÂÃ¨Â¯Â»Ã¨ÂÂ¢Ã¥Â¹ÂÃ£ÂÂÃ¥ÂÂÃ¨ÂÂ½Ã£ÂÂ</li><li>Ã¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂ¹Ã¦Â³Â:Ã¥ÂÂ¨Ã¦ÂÂ¾Ã§Â¤ÂºÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂ°Ã¨ÂÂÃ¦ÂÂÃ§ÂÂµÃ¥Â­ÂÃ¤Â¹Â¦Ã§ÂÂÃ§ÂÂ»Ã©ÂÂ¢Ã¤Â¸Â,Ã§ÂÂ¨Ã¤Â¸Â¤Ã¦Â Â¹Ã¦ÂÂÃ¦ÂÂÃ¤Â»ÂÃ¨ÂÂ¢Ã¥Â¹ÂÃ©Â ÂÃ§Â«Â¯Ã¥ÂÂÃ¤Â¸ÂÃ¦Â»ÂÃ¥ÂÂ¨,Ã§Â³Â»Ã§Â»ÂÃ¥Â°Â±Ã¤Â¼ÂÃ¨ÂÂªÃ¥ÂÂ¨Ã¨Â¾Â¨Ã¨Â¯ÂÃ¦ÂÂ´Ã¤Â¸ÂªÃ§ÂÂ»Ã©ÂÂ¢Ã§ÂÂÃ¦ÂÂÃ¥Â­Â,Ã¥Â¹Â¶Ã¤Â»ÂÃ¥Â¤Â´Ã¥ÂÂ°Ã¥Â°Â¾Ã¦ÂÂÃ¨Â¯Â»Ã¥ÂÂºÃ¦ÂÂ¥Ã£ÂÂ</li></ol>", "zh": "<p class=\"p-desc\">Ã¤Â½Â¿Ã§ÂÂ¨ iOS/iPadOS Ã§ÂÂÃ¥ÂÂ§Ã¥Â»ÂºÃ¥ÂÂÃ¨ÂÂ½,Ã¤Â¸ÂÃ©ÂÂÃ¨Â¦ÂÃ¥ÂÂ¦Ã¥Â¤ÂÃ¥Â®ÂÃ¨Â£Â App,Ã¥Â°Â±Ã¨ÂÂ½Ã¨Â®ÂÃ¨Â£ÂÃ§Â½Â®Ã¦ÂÂÃ¨Â®ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂÃ¥Â­ÂÃ£ÂÂ</p><h4>Ã¦Â­Â¥Ã©Â©ÂÃ¤Â¸Â:Ã¤Â¸ÂÃ¨Â¼ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ TTS Ã¨ÂªÂÃ©ÂÂ³</h4><ol><li>Ã©ÂÂÃ¥ÂÂÃ£ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ£ÂÂAppÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾Â<b>Ã¨Â¼ÂÃ¥ÂÂ©Ã¤Â½Â¿Ã§ÂÂ¨</b>Ã©ÂÂ¸Ã¥ÂÂ®Ã£ÂÂ</li><li>Ã©ÂÂ¸Ã¦ÂÂ<b>Ã¦ÂÂÃ¨Â®ÂÃ¥ÂÂ§Ã¥Â®Â¹</b>(Ã¤Â¾Â iOS Ã§ÂÂÃ¦ÂÂ¬Ã¤Â¸ÂÃ¥ÂÂ,Ã¤ÂºÂ¦Ã¥ÂÂ¯Ã¨ÂÂ½Ã©Â¡Â¯Ã§Â¤ÂºÃ§ÂÂº<b>Ã¨Â¬ÂÃ¥ÂÂºÃ¥ÂÂ§Ã¥Â®Â¹</b>)Ã£ÂÂ</li><li>Ã©Â»ÂÃ¤Â¸ÂÃ¤Â¸Â<b>Ã¨ÂªÂÃ©ÂÂ³</b>Ã£ÂÂ</li><li>Ã¥Â¾ÂÃ¤Â¸ÂÃ¦ÂÂ²Ã¥ÂÂÃ¤Â¸Â¦Ã©ÂÂ¸Ã¦ÂÂ<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ</b>Ã£ÂÂ</li><li>Ã©Â»ÂÃ©ÂÂ¸Ã¦ÂÂ³Ã¨Â¦ÂÃ§ÂÂÃ¨ÂªÂÃ©ÂÂ³(Ã¤Â¾ÂÃ¥Â¦Â Linh)Ã¦ÂÂÃ©ÂÂÃ§ÂÂÃ©ÂÂ²Ã¦ÂÂµ(Ã¤Â¸ÂÃ¨Â¼Â)Ã¥ÂÂÃ§Â¤Âº,Ã¥ÂÂ³Ã¥ÂÂ¯Ã¤Â¸ÂÃ¨Â¼ÂÃ¨ÂªÂÃ©ÂÂ³Ã¨Â³ÂÃ¦ÂÂÃ£ÂÂÃ¨ÂÂ¥Ã¤Â¸ÂÃ¨Â¼ÂÃ£ÂÂÃ©Â«ÂÃ¥ÂÂÃ¨Â³ÂªÃ£ÂÂÃ§ÂÂÃ¦ÂÂ¬,Ã¥Â°Â±Ã¨ÂÂ½Ã¨ÂÂ½Ã¥ÂÂ°Ã¦ÂÂ´Ã¨ÂÂªÃ§ÂÂ¶Ã§ÂÂ AI Ã¨ÂªÂÃ©ÂÂ³Ã£ÂÂ</li></ol><h4>Ã¦Â­Â¥Ã©Â©ÂÃ¤ÂºÂ:Ã¨Â®ÂÃ¨ÂÂ¢Ã¥Â¹ÂÃ¤Â¸ÂÃ§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂÃ¥Â­ÂÃ¨Â¢Â«Ã¦ÂÂÃ¨Â®ÂÃ¥ÂÂºÃ¤Â¾Â(Ã¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂ¹Ã¦Â³Â)</h4><p class=\"p-desc\">Ã¤Â¸ÂÃ¨Â¼ÂÃ¥Â®ÂÃ¦ÂÂÃ¥Â¾Â,Ã¥ÂÂ¯Ã¤Â»Â¥Ã©ÂÂÃ©ÂÂÃ¤Â»Â¥Ã¤Â¸ÂÃ¥ÂÂ©Ã§Â¨Â®Ã¦ÂÂ¹Ã¥Â¼ÂÃ¨Â®ÂÃ¨Â£ÂÃ§Â½Â®Ã¦ÂÂÃ¨Â®ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ£ÂÂÃ©ÂÂÃ¥ÂÂ©Ã©Â ÂÃ¥ÂÂÃ¨ÂÂ½Ã¥ÂÂÃ¦Â¨Â£Ã¥ÂÂ¯Ã¥ÂÂ¨Ã£ÂÂÃ¨Â¨Â­Ã¥Â®Â &gt; Ã¨Â¼ÂÃ¥ÂÂ©Ã¤Â½Â¿Ã§ÂÂ¨ &gt; Ã¨Â¬ÂÃ¥ÂÂºÃ¥ÂÂ§Ã¥Â®Â¹Ã£ÂÂÃ©ÂÂ¸Ã¥ÂÂ®Ã¤Â¸Â­Ã©ÂÂÃ¥ÂÂÃ£ÂÂ</p><h4>Ã¦ÂÂ¹Ã¦Â³Â A:Ã¦ÂÂÃ¨Â®ÂÃ¦ÂÂÃ©ÂÂ¸Ã©Â ÂÃ§ÂÂ®(Ã¦ÂÂ¨Ã¨ÂÂ¦)</h4><ol><li>Ã¨Â¨Â­Ã¥Â®ÂÃ¦ÂÂ¹Ã¦Â³Â:Ã©ÂÂÃ¥ÂÂÃ£ÂÂÃ¦ÂÂÃ¨Â®ÂÃ¦ÂÂÃ©ÂÂ¸Ã©Â ÂÃ§ÂÂ®Ã£ÂÂÃ¥ÂÂÃ¨ÂÂ½Ã£ÂÂ</li><li>Ã¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂ¹Ã¦Â³Â:Ã¥ÂÂ¨Ã§ÂÂÃ¨Â¦Â½Ã§Â¶Â²Ã©Â ÂÃ¦ÂÂÃ¦ÂÂÃ¥Â­Â App Ã¦ÂÂ,Ã©ÂÂ·Ã¦ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¥ÂÂ®Ã¥Â­ÂÃ¦ÂÂÃ¥ÂÂ¥Ã¥Â­ÂÃ¤Â»Â¥Ã©ÂÂ¸Ã¥ÂÂÃ§Â¯ÂÃ¥ÂÂ,Ã¦ÂÂ¥Ã¨ÂÂÃ¥ÂÂ¨Ã¥Â½ÂÃ¥ÂÂºÃ¥Â¼ÂÃ©ÂÂ¸Ã¥ÂÂ®Ã¤Â¸Â­Ã©Â»ÂÃ©ÂÂ¸Ã£ÂÂÃ¦ÂÂÃ¨Â®ÂÃ£ÂÂ,Ã¥ÂÂ³Ã¥ÂÂ¯Ã¨ÂÂ½Ã¥ÂÂ°Ã¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂÃ¨Â®ÂÃ£ÂÂ</li></ol><h4>Ã¦ÂÂ¹Ã¦Â³Â B:Ã¦ÂÂÃ¨Â®ÂÃ¨ÂÂ¢Ã¥Â¹Â</h4><ol><li>Ã¨Â¨Â­Ã¥Â®ÂÃ¦ÂÂ¹Ã¦Â³Â:Ã©ÂÂÃ¥ÂÂÃ£ÂÂÃ¦ÂÂÃ¨Â®ÂÃ¨ÂÂ¢Ã¥Â¹ÂÃ£ÂÂÃ¥ÂÂÃ¨ÂÂ½Ã£ÂÂ</li><li>Ã¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂ¹Ã¦Â³Â:Ã¥ÂÂ¨Ã©Â¡Â¯Ã§Â¤ÂºÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂ°Ã¨ÂÂÃ¦ÂÂÃ©ÂÂ»Ã¥Â­ÂÃ¦ÂÂ¸Ã§ÂÂÃ§ÂÂ«Ã©ÂÂ¢Ã¤Â¸Â,Ã§ÂÂ¨Ã¥ÂÂ©Ã¦Â Â¹Ã¦ÂÂÃ¦ÂÂÃ¥Â¾ÂÃ¨ÂÂ¢Ã¥Â¹ÂÃ©Â ÂÃ§Â«Â¯Ã¥ÂÂÃ¤Â¸ÂÃ¦Â»ÂÃ¥ÂÂ,Ã§Â³Â»Ã§ÂµÂ±Ã¥Â°Â±Ã¦ÂÂÃ¨ÂÂªÃ¥ÂÂÃ¨Â¾Â¨Ã¨Â­ÂÃ¦ÂÂ´Ã¥ÂÂÃ§ÂÂ«Ã©ÂÂ¢Ã§ÂÂÃ¦ÂÂÃ¥Â­Â,Ã¤Â¸Â¦Ã¥Â¾ÂÃ©Â Â­Ã¥ÂÂ°Ã¥Â°Â¾Ã¦ÂÂÃ¨Â®ÂÃ¥ÂÂºÃ¤Â¾ÂÃ£ÂÂ</li></ol>", "en": "<p class=\"p-desc\">You can use the built-in features of iOS/iPadOS to have Vietnamese text read aloud, without installing a separate app.</p><h4>Step 1: Download a Vietnamese TTS Voice</h4><ol><li>Open the Settings app.</li><li>Go to the <b>Accessibility</b> menu.</li><li>Select <b>Spoken Content</b> (or <b>Speak Screen &amp; Content</b>, depending on your iOS version).</li><li>Tap <b>Voices</b>.</li><li>Scroll down and select <b>Vietnamese</b>.</li><li>Tap the cloud (download) icon next to the voice you want (e.g., Linh) to download the voice data. Downloading the \"Premium\" (high-quality) version gives you a much more natural-sounding AI voice.</li></ol><h4>Step 2: Have On-Screen Vietnamese Text Read Aloud (How to Use)</h4><p class=\"p-desc\">Once the download is complete, there are two ways to have Vietnamese read aloud. Both can also be turned on from Settings &gt; Accessibility &gt; Spoken Content.</p><h4>Method A: Speak Selection (Recommended)</h4><ol><li>Setup: Turn on the \"Speak Selection\" feature.</li><li>How to use: While browsing the web or using a text app, press and hold a Vietnamese word or sentence to select it, then tap \"Speak\" in the pop-up menu to hear it read aloud in Vietnamese.</li></ol><h4>Method B: Speak Screen</h4><ol><li>Setup: Turn on the \"Speak Screen\" feature.</li><li>How to use: On a screen showing Vietnamese news or an e-book, swipe down from the top of the screen with two fingers, and all the text on screen will be automatically recognized and read aloud from start to finish.</li></ol>", "fr": "<p class=\"p-desc\">Vous pouvez utiliser les fonctionnalitÃÂ©s intÃÂ©grÃÂ©es d'iOS/iPadOS pour faire lire du texte vietnamien ÃÂ  voix haute sans installer d'application tierce.</p><h4>ÃÂtape 1 : TÃÂ©lÃÂ©charger une voix TTS vietnamienne</h4><ol><li>Ouvrez l'application <b>RÃÂ©glages</b>.</li><li>Allez dans le menu <b>AccessibilitÃÂ©</b>.</li><li>SÃÂ©lectionnez <b>Contenu ÃÂ©noncÃÂ©</b>.</li><li>Touchez <b>Voix</b>.</li><li>Faites dÃÂ©filer vers le bas et sÃÂ©lectionnez <b>Vietnamien</b>.</li><li>Touchez l'icÃÂ´ne de nuage (tÃÂ©lÃÂ©chargement) ÃÂ  cÃÂ´tÃÂ© de la voix souhaitÃÂ©e (ex. : Linh) pour installer les donnÃÂ©es vocales. La version de haute qualitÃÂ© offre une voix beaucoup plus naturelle.</li></ol><h4>ÃÂtape 2 : Faire lire le texte vietnamien ÃÂ  l'ÃÂ©cran</h4><p class=\"p-desc\">Une fois le tÃÂ©lÃÂ©chargement terminÃÂ©, deux options s'offrent ÃÂ  vous :</p><h4>MÃÂ©thode A : ÃÂnoncer la sÃÂ©lection (RecommandÃÂ©)</h4><ol><li>Activez ÃÂ« ÃÂnoncer la sÃÂ©lection ÃÂ».</li><li>SÃÂ©lectionnez un mot ou une phrase en vietnamien sur une page web ou dans une application, puis touchez ÃÂ« ÃÂnoncer ÃÂ» dans le menu contextuel.</li></ol><h4>MÃÂ©thode B : ÃÂnoncer le contenu de l'ÃÂ©cran</h4><ol><li>Activez ÃÂ« ÃÂnoncer le contenu de l'ÃÂ©cran ÃÂ».</li><li>Faites glisser deux doigts depuis le haut de l'ÃÂ©cran vers le bas pour lire tout le texte affichÃÂ©.</li></ol>", "de": "<p class=\"p-desc\">Mit den integrierten Funktionen von iOS/iPadOS kÃÂ¶nnen Sie sich vietnamesischen Text vorlesen lassen, ohne eine separate App zu installieren.</p><h4>Schritt 1: Vietnamesische TTS-Stimme herunterladen</h4><ol><li>ÃÂffnen Sie die App <b>Einstellungen</b>.</li><li>Gehen Sie zum MenÃÂ¼ <b>Bedienungshilfen</b>.</li><li>WÃÂ¤hlen Sie <b>Gesprochene Inhalte</b>.</li><li>Tippen Sie auf <b>Stimmen</b>.</li><li>Scrollen Sie nach unten und wÃÂ¤hlen Sie <b>Vietnamesisch</b>.</li><li>Tippen Sie auf das Wolkensymbol (Download) neben der gewÃÂ¼nschten Stimme (z. B. Linh), um die Sprachdaten herunterzuladen. Die Ã¢ÂÂErweiterteÃ¢ÂÂ Version bietet eine besonders natÃÂ¼rliche Stimme.</li></ol><h4>Schritt 2: Vietnamesischen Text auf dem Bildschirm vorlesen lassen</h4><p class=\"p-desc\">Nach dem Download gibt es zwei MÃÂ¶glichkeiten zum Vorlesen. Beide lassen sich unter Einstellungen &gt; Bedienungshilfen &gt; Gesprochene Inhalte aktivieren.</p><h4>Methode A: Auswahl vorlesen (Empfohlen)</h4><ol><li>Einrichtung: Aktivieren Sie Ã¢ÂÂAuswahl vorlesenÃ¢ÂÂ.</li><li>Verwendung: Halten Sie beim Surfen oder in Text-Apps ein vietnamesisches Wort oder einen Satz gedrÃÂ¼ckt, um den Text auszuwÃÂ¤hlen, und tippen Sie im MenÃÂ¼ auf Ã¢ÂÂSprechenÃ¢ÂÂ.</li></ol><h4>Methode B: Bildschirminhalt sprechen</h4><ol><li>Einrichtung: Aktivieren Sie Ã¢ÂÂBildschirminhalt sprechenÃ¢ÂÂ.</li><li>Verwendung: Streichen Sie mit zwei Fingern vom oberen Bildschirmrand nach unten, um den gesamten Text auf dem Bildschirm vorlesen zu lassen.</li></ol>", "ja": "<p class=\"p-desc\">iOS/iPadOSÃ£ÂÂ®Ã¥ÂÂÃ¨ÂÂµÃ¦Â©ÂÃ¨ÂÂ½Ã£ÂÂÃ¤Â½Â¿Ã£ÂÂÃ£ÂÂ°Ã£ÂÂÃ¥ÂÂ¥Ã©ÂÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</p><h4>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ1:Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®TTSÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ</h4><ol><li>Ã£ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ£ÂÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ©ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li><b>Ã£ÂÂ¢Ã£ÂÂ¯Ã£ÂÂ»Ã£ÂÂ·Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂ£</b>Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ«Ã§Â§Â»Ã¥ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li><b>Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂ³Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ³Ã£ÂÂ</b>(iOSÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ¸Ã£ÂÂ§Ã£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ£Ã£ÂÂ¦Ã£ÂÂ¯<b>Ã£ÂÂ³Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ³Ã£ÂÂÃ£ÂÂ®Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂ</b>)Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li><b>Ã¥Â£Â°</b>Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¤Â¸ÂÃ£ÂÂ«Ã£ÂÂ¹Ã£ÂÂ¯Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¦<b>Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂ</b>Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¤Â½Â¿Ã§ÂÂ¨Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ©ÂÂ³Ã¥Â£Â°(Ã¤Â¾Â:Linh)Ã£ÂÂ®Ã¦Â¨ÂªÃ£ÂÂ«Ã£ÂÂÃ£ÂÂÃ©ÂÂ²Ã£ÂÂ®Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ¯(Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂ)Ã£ÂÂ¢Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ©Â«ÂÃ¥ÂÂÃ¨Â³ÂªÃ£ÂÂÃ§ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ¨ÂÂªÃ§ÂÂ¶Ã£ÂÂªAIÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂ§Ã¨ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol><h4>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ2:Ã§ÂÂ»Ã©ÂÂ¢Ã¤Â¸ÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ(Ã¤Â½Â¿Ã£ÂÂÃ¦ÂÂ¹)</h4><p class=\"p-desc\">Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ¥Â®ÂÃ¤ÂºÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ¦Â¬Â¡Ã£ÂÂ®2Ã£ÂÂ¤Ã£ÂÂ®Ã¦ÂÂ¹Ã¦Â³ÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂÃ£ÂÂ©Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂÃ¨Â¨Â­Ã¥Â®Â &gt; Ã£ÂÂ¢Ã£ÂÂ¯Ã£ÂÂ»Ã£ÂÂ·Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂ£ &gt; Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂ³Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ³Ã£ÂÂÃ£ÂÂ®Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ¦ÂÂÃ¥ÂÂ¹Ã£ÂÂ«Ã£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</p><h4>Ã¦ÂÂ¹Ã¦Â³ÂA:Ã©ÂÂ¸Ã¦ÂÂÃ©Â ÂÃ§ÂÂ®Ã£ÂÂ®Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂ(Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ)</h4><ol><li>Ã¨Â¨Â­Ã¥Â®ÂÃ¦ÂÂ¹Ã¦Â³Â:Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ©Â ÂÃ§ÂÂ®Ã£ÂÂ®Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ¦Â©ÂÃ¨ÂÂ½Ã£ÂÂÃ£ÂÂªÃ£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¤Â½Â¿Ã£ÂÂÃ¦ÂÂ¹:Ã£ÂÂ¦Ã£ÂÂ§Ã£ÂÂÃ£ÂÂµÃ£ÂÂ¤Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂªÃ£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã¥ÂÂÃ¨ÂªÂÃ£ÂÂÃ¦ÂÂÃ§Â«Â Ã£ÂÂÃ©ÂÂ·Ã¦ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂÃ£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ§Ã£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ§Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol><h4>Ã¦ÂÂ¹Ã¦Â³ÂB:Ã§ÂÂ»Ã©ÂÂ¢Ã£ÂÂ®Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂ</h4><ol><li>Ã¨Â¨Â­Ã¥Â®ÂÃ¦ÂÂ¹Ã¦Â³Â:Ã£ÂÂÃ§ÂÂ»Ã©ÂÂ¢Ã£ÂÂ®Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ¦Â©ÂÃ¨ÂÂ½Ã£ÂÂÃ£ÂÂªÃ£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¤Â½Â¿Ã£ÂÂÃ¦ÂÂ¹:Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ¹Ã£ÂÂÃ©ÂÂ»Ã¥Â­ÂÃ¦ÂÂ¸Ã§Â±ÂÃ£ÂÂÃ¨Â¡Â¨Ã§Â¤ÂºÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ§ÂÂ»Ã©ÂÂ¢Ã£ÂÂ§Ã£ÂÂ2Ã¦ÂÂ¬Ã¦ÂÂÃ£ÂÂ§Ã§ÂÂ»Ã©ÂÂ¢Ã£ÂÂ®Ã¤Â¸ÂÃ§Â«Â¯Ã£ÂÂÃ£ÂÂÃ¤Â¸ÂÃ£ÂÂ¸Ã£ÂÂ¹Ã£ÂÂ¯Ã£ÂÂ¤Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ§ÂÂ»Ã©ÂÂ¢Ã¥ÂÂ¨Ã¤Â½ÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ¨ÂÂªÃ¥ÂÂÃ§ÂÂÃ£ÂÂ«Ã¨ÂªÂÃ¨Â­ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ¦ÂÂÃ¥ÂÂÃ£ÂÂÃ£ÂÂÃ¦ÂÂÃ¥Â¾ÂÃ£ÂÂ¾Ã£ÂÂ§Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol>", "pl": "<p class=\"p-desc\">DziÃÂki wbudowanym funkcjom iOS/iPadOS moÃÂ¼esz sÃÂuchaÃÂ czytanego tekstu wietnamskiego bez instalowania dodatkowych aplikacji.</p><h4>Krok 1: Pobierz gÃÂos syntezatora mowy (TTS) dla wietnamskiego</h4><ol><li>OtwÃÂ³rz aplikacjÃÂ <b>Ustawienia</b>.</li><li>PrzejdÃÂº do menu <b>DostÃÂpnoÃÂÃÂ</b>.</li><li>Wybierz <b>ZawartoÃÂÃÂ mÃÂ³wiona</b>.</li><li>Dotknij <b>GÃÂosy</b>.</li><li>PrzewiÃÂ w dÃÂ³ÃÂ i wybierz <b>Wietnamski</b>.</li><li>Dotknij ikony chmury (pobieranie) obok wybranego gÃÂosu (np. Linh). Wersja ulepszona zapewnia bardziej naturalny gÃÂos.</li></ol><h4>Krok 2: Odczytywanie tekstu z ekranu</h4><p class=\"p-desc\">Po pobraniu moÃÂ¼esz korzystaÃÂ z dwÃÂ³ch metod odczytu tekstu:</p><h4>Metoda A: Przeczytaj zaznaczone (Zalecane)</h4><ol><li>WÃÂÃÂcz funkcjÃÂ Ã¢ÂÂPrzeczytaj zaznaczoneÃ¢ÂÂ.</li><li>Zaznacz tekst wietnamski w przeglÃÂdarce i dotknij Ã¢ÂÂMÃÂ³wÃ¢ÂÂ w menu podrÃÂcznym.</li></ol><h4>Metoda B: Przeczytaj ekran</h4><ol><li>WÃÂÃÂcz funkcjÃÂ Ã¢ÂÂPrzeczytaj ekranÃ¢ÂÂ.</li><li>PrzesuÃÂ dwoma palcami od gÃÂ³ry ekranu w dÃÂ³ÃÂ, aby odczytaÃÂ caÃÂÃÂ zawartoÃÂÃÂ ekranu.</li></ol>"},
    "<h4>1. Google 음성 엔진에서 베트남어 추가 (공통)</h4><p class=\"p-desc\">대부분의 안드로이드 기기에 내장된 구글 엔진에 베트남어 음성 팩을 다운로드하는 방법이에요.</p><ol><li>스마트폰 <b>설정</b> 앱을 엽니다.</li><li><b>접근성</b> ➡️ <b>텍스트 음성 변환 출력</b>(또는 ‘글자 읽어주기’) 메뉴로 이동합니다.</li><li>기본 엔진이 <b>Google 음성 인식 및 합성</b>(또는 Speech Services by Google)으로 선택되어 있는지 확인합니다.</li><li>기본 엔진 옆에 있는 <b>설정(톱니바퀴 아이콘)</b>을 누릅니다.</li><li><b>음성 데이터 설치</b>를 선택합니다.</li><li>목록에서 <b>베트남어</b>(또는 Vietnamese)를 찾아 다운로드 버튼을 누릅니다.</li><li>다운로드가 완료되면 뒤로 돌아와 <b>언어</b>를 <b>베트남어</b>로 지정합니다.</li></ol><h4>2. 삼성 갤럭시 기기에서 베트남어 추가</h4><p class=\"p-desc\">삼성 갤럭시 스마트폰을 사용 중이라면 삼성 전용 고품질 베트남어 TTS를 추가할 수 있어요.</p><ol><li>스마트폰 <b>설정</b> 앱을 엽니다.</li><li><b>일반</b> ➡️ <b>글자 읽어주기</b>(또는 텍스트 음성 변환) 메뉴로 이동합니다.</li><li>기본 엔진을 <b>삼성 TTS 엔진</b>으로 설정합니다.</li><li>엔진 옆의 <b>설정(톱니바퀴 아이콘)</b>을 누릅니다.</li><li><b>음성 데이터 설치</b>를 누르고 목록에서 <b>베트남어</b>를 찾아 다운로드합니다.</li></ol><div class=\"tts-tip\">※ 갤럭시 스토어에서 직접 Samsung TTS Vietnamese Voice 팩을 검색해 설치할 수도 있어요.</div>": {"zh_cn": "<h4>1. Ã¥ÂÂ¨ Google Ã¨Â¯Â­Ã©ÂÂ³Ã¥Â¼ÂÃ¦ÂÂÃ¤Â¸Â­Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­(Ã©ÂÂÃ§ÂÂ¨)</h4><p class=\"p-desc\">Ã¥Â¤Â§Ã¥Â¤ÂÃ¦ÂÂ° Android Ã¨Â£ÂÃ§Â½Â®Ã¥ÂÂÃ¥Â»ÂºÃ§ÂÂ Google Ã¥Â¼ÂÃ¦ÂÂÃ©ÂÂ½Ã¥ÂÂ¯Ã¤Â»Â¥Ã¤Â¸ÂÃ¨Â½Â½Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¨Â¯Â­Ã©ÂÂ³Ã¥ÂÂ,Ã¦ÂÂ¹Ã¦Â³ÂÃ¥Â¦ÂÃ¤Â¸ÂÃ£ÂÂ</p><ol><li>Ã¥Â¼ÂÃ¥ÂÂ¯Ã¦ÂÂÃ¦ÂÂºÃ§ÂÂ<b>Ã¨Â®Â¾Ã¥Â®Â</b> AppÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾Â<b>Ã¥ÂÂÃ¥ÂÂ©Ã¥Â·Â¥Ã¥ÂÂ·</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Ã¦ÂÂÃ¥Â­ÂÃ¨Â½Â¬Ã¨Â¯Â­Ã©ÂÂ³Ã¨Â¾ÂÃ¥ÂÂº</b>(Ã¦ÂÂÃ§Â§Â°Ã£ÂÂÃ¨Â¯Â»Ã¥ÂÂºÃ¦ÂÂÃ¥Â­ÂÃ£ÂÂ)Ã©ÂÂÃ¥ÂÂÃ£ÂÂ</li><li>Ã§Â¡Â®Ã¨Â®Â¤Ã©Â¢ÂÃ¨Â®Â¾Ã¥Â¼ÂÃ¦ÂÂÃ¦ÂÂ¯Ã¥ÂÂ¦Ã¤Â¸Âº<b>Google Ã¨Â¯Â­Ã©ÂÂ³Ã¨Â¾Â¨Ã¨Â¯ÂÃ¤Â¸ÂÃ¥ÂÂÃ¦ÂÂ</b>(Ã¦ÂÂ Speech Services by Google)Ã£ÂÂ</li><li>Ã§ÂÂ¹Ã©ÂÂÃ©Â¢ÂÃ¨Â®Â¾Ã¥Â¼ÂÃ¦ÂÂÃ¦ÂÂÃ§ÂÂ<b>Ã¨Â®Â¾Ã¥Â®Â(Ã©Â½ÂÃ¨Â¼ÂªÃ¥ÂÂ¾Ã§Â¤Âº)</b>Ã£ÂÂ</li><li>Ã©ÂÂÃ¦ÂÂ©<b>Ã¥Â®ÂÃ¨Â£ÂÃ¨Â¯Â­Ã©ÂÂ³Ã¨ÂµÂÃ¦ÂÂ</b>Ã£ÂÂ</li><li>Ã¥ÂÂ¨Ã¦Â¸ÂÃ¥ÂÂÃ¤Â¸Â­Ã¦ÂÂ¾Ã¥ÂÂ°<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­</b>(Vietnamese)Ã¥Â¹Â¶Ã§ÂÂ¹Ã©ÂÂÃ¤Â¸ÂÃ¨Â½Â½Ã¦ÂÂÃ©ÂÂ®Ã£ÂÂ</li><li>Ã¤Â¸ÂÃ¨Â½Â½Ã¥Â®ÂÃ¦ÂÂÃ¥ÂÂÃ¨Â¿ÂÃ¥ÂÂÃ¤Â¸ÂÃ¤Â¸ÂÃ©Â¡Âµ,Ã¥Â°Â<b>Ã¨Â¯Â­Ã¨Â¨Â</b>Ã¨Â®Â¾Ã¥Â®ÂÃ¤Â¸Âº<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­</b>Ã£ÂÂ</li></ol><h4>2. Ã¥ÂÂ¨Ã¤Â¸ÂÃ¦ÂÂ Galaxy Ã¨Â£ÂÃ§Â½Â®Ã¤Â¸Â­Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­</h4><p class=\"p-desc\">Ã¥Â¦ÂÃ¦ÂÂÃ¦ÂÂ¨Ã¤Â½Â¿Ã§ÂÂ¨Ã§ÂÂÃ¦ÂÂ¯Ã¤Â¸ÂÃ¦ÂÂ Galaxy Ã¦ÂÂÃ¦ÂÂº,Ã¥ÂÂ¯Ã¤Â»Â¥Ã©Â¡ÂÃ¥Â¤ÂÃ¦ÂÂ°Ã¥Â¢ÂÃ¤Â¸ÂÃ¦ÂÂÃ¥Â°ÂÃ¥Â±ÂÃ§ÂÂÃ©Â«ÂÃ¥ÂÂÃ¨Â´Â¨Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­ TTSÃ£ÂÂ</p><ol><li>Ã¥Â¼ÂÃ¥ÂÂ¯Ã¦ÂÂÃ¦ÂÂºÃ§ÂÂ<b>Ã¨Â®Â¾Ã¥Â®Â</b> AppÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾Â<b>Ã¤Â¸ÂÃ¨ÂÂ¬</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Ã¨Â¯Â»Ã¥ÂÂºÃ¦ÂÂÃ¥Â­Â</b>(Ã¦ÂÂÃ¦ÂÂÃ¥Â­ÂÃ¨Â½Â¬Ã¨Â¯Â­Ã©ÂÂ³)Ã©ÂÂÃ¥ÂÂÃ£ÂÂ</li><li>Ã¥Â°ÂÃ©Â¢ÂÃ¨Â®Â¾Ã¥Â¼ÂÃ¦ÂÂÃ¨Â®Â¾Ã¥Â®ÂÃ¤Â¸Âº<b>Ã¤Â¸ÂÃ¦ÂÂ TTS Ã¥Â¼ÂÃ¦ÂÂ</b>Ã£ÂÂ</li><li>Ã§ÂÂ¹Ã©ÂÂÃ¥Â¼ÂÃ¦ÂÂÃ¦ÂÂÃ§ÂÂ<b>Ã¨Â®Â¾Ã¥Â®Â(Ã©Â½ÂÃ¨Â¼ÂªÃ¥ÂÂ¾Ã§Â¤Âº)</b>Ã£ÂÂ</li><li>Ã§ÂÂ¹Ã©ÂÂ<b>Ã¥Â®ÂÃ¨Â£ÂÃ¨Â¯Â­Ã©ÂÂ³Ã¨ÂµÂÃ¦ÂÂ</b>,Ã¥ÂÂ¨Ã¦Â¸ÂÃ¥ÂÂÃ¤Â¸Â­Ã¦ÂÂ¾Ã¥ÂÂ°<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­</b>Ã¥Â¹Â¶Ã¤Â¸ÂÃ¨Â½Â½Ã£ÂÂ</li></ol><div class=\"tts-tip\">Ã¢ÂÂ» Ã¦ÂÂ¨Ã¤Â¹ÂÃ¥ÂÂ¯Ã¤Â»Â¥Ã§ÂÂ´Ã¦ÂÂ¥Ã¥ÂÂ¨ Galaxy Store Ã¤Â¸Â­Ã¦ÂÂÃ¥Â¯Â» Samsung TTS Vietnamese Voice Ã¨Â¯Â­Ã©ÂÂ³Ã¥ÂÂÃ¥Â¹Â¶Ã¥Â®ÂÃ¨Â£ÂÃ£ÂÂ</div>", "zh": "<h4>1. Ã¥ÂÂ¨ Google Ã¨ÂªÂÃ©ÂÂ³Ã¥Â¼ÂÃ¦ÂÂÃ¤Â¸Â­Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ(Ã©ÂÂÃ§ÂÂ¨)</h4><p class=\"p-desc\">Ã¥Â¤Â§Ã¥Â¤ÂÃ¦ÂÂ¸ Android Ã¨Â£ÂÃ§Â½Â®Ã¥ÂÂ§Ã¥Â»ÂºÃ§ÂÂ Google Ã¥Â¼ÂÃ¦ÂÂÃ©ÂÂ½Ã¥ÂÂ¯Ã¤Â»Â¥Ã¤Â¸ÂÃ¨Â¼ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¨ÂªÂÃ©ÂÂ³Ã¥ÂÂ,Ã¦ÂÂ¹Ã¦Â³ÂÃ¥Â¦ÂÃ¤Â¸ÂÃ£ÂÂ</p><ol><li>Ã©ÂÂÃ¥ÂÂÃ¦ÂÂÃ¦Â©ÂÃ§ÂÂ<b>Ã¨Â¨Â­Ã¥Â®Â</b> AppÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾Â<b>Ã¥ÂÂÃ¥ÂÂ©Ã¥Â·Â¥Ã¥ÂÂ·</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Ã¦ÂÂÃ¥Â­ÂÃ¨Â½ÂÃ¨ÂªÂÃ©ÂÂ³Ã¨Â¼Â¸Ã¥ÂÂº</b>(Ã¦ÂÂÃ§Â¨Â±Ã£ÂÂÃ¨Â®ÂÃ¥ÂÂºÃ¦ÂÂÃ¥Â­ÂÃ£ÂÂ)Ã©ÂÂ¸Ã¥ÂÂ®Ã£ÂÂ</li><li>Ã§Â¢ÂºÃ¨ÂªÂÃ©Â ÂÃ¨Â¨Â­Ã¥Â¼ÂÃ¦ÂÂÃ¦ÂÂ¯Ã¥ÂÂ¦Ã§ÂÂº<b>Google Ã¨ÂªÂÃ©ÂÂ³Ã¨Â¾Â¨Ã¨Â­ÂÃ¨ÂÂÃ¥ÂÂÃ¦ÂÂ</b>(Ã¦ÂÂ Speech Services by Google)Ã£ÂÂ</li><li>Ã©Â»ÂÃ©ÂÂ¸Ã©Â ÂÃ¨Â¨Â­Ã¥Â¼ÂÃ¦ÂÂÃ¦ÂÂÃ§ÂÂ<b>Ã¨Â¨Â­Ã¥Â®Â(Ã©Â½ÂÃ¨Â¼ÂªÃ¥ÂÂÃ§Â¤Âº)</b>Ã£ÂÂ</li><li>Ã©ÂÂ¸Ã¦ÂÂ<b>Ã¥Â®ÂÃ¨Â£ÂÃ¨ÂªÂÃ©ÂÂ³Ã¨Â³ÂÃ¦ÂÂ</b>Ã£ÂÂ</li><li>Ã¥ÂÂ¨Ã¦Â¸ÂÃ¥ÂÂ®Ã¤Â¸Â­Ã¦ÂÂ¾Ã¥ÂÂ°<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ</b>(Vietnamese)Ã¤Â¸Â¦Ã©Â»ÂÃ©ÂÂ¸Ã¤Â¸ÂÃ¨Â¼ÂÃ¦ÂÂÃ©ÂÂÃ£ÂÂ</li><li>Ã¤Â¸ÂÃ¨Â¼ÂÃ¥Â®ÂÃ¦ÂÂÃ¥Â¾ÂÃ¨Â¿ÂÃ¥ÂÂÃ¤Â¸ÂÃ¤Â¸ÂÃ©Â Â,Ã¥Â°Â<b>Ã¨ÂªÂÃ¨Â¨Â</b>Ã¨Â¨Â­Ã¥Â®ÂÃ§ÂÂº<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ</b>Ã£ÂÂ</li></ol><h4>2. Ã¥ÂÂ¨Ã¤Â¸ÂÃ¦ÂÂ Galaxy Ã¨Â£ÂÃ§Â½Â®Ã¤Â¸Â­Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ</h4><p class=\"p-desc\">Ã¥Â¦ÂÃ¦ÂÂÃ¦ÂÂ¨Ã¤Â½Â¿Ã§ÂÂ¨Ã§ÂÂÃ¦ÂÂ¯Ã¤Â¸ÂÃ¦ÂÂ Galaxy Ã¦ÂÂÃ¦Â©Â,Ã¥ÂÂ¯Ã¤Â»Â¥Ã©Â¡ÂÃ¥Â¤ÂÃ¦ÂÂ°Ã¥Â¢ÂÃ¤Â¸ÂÃ¦ÂÂÃ¥Â°ÂÃ¥Â±Â¬Ã§ÂÂÃ©Â«ÂÃ¥ÂÂÃ¨Â³ÂªÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ TTSÃ£ÂÂ</p><ol><li>Ã©ÂÂÃ¥ÂÂÃ¦ÂÂÃ¦Â©ÂÃ§ÂÂ<b>Ã¨Â¨Â­Ã¥Â®Â</b> AppÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾Â<b>Ã¤Â¸ÂÃ¨ÂÂ¬</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Ã¨Â®ÂÃ¥ÂÂºÃ¦ÂÂÃ¥Â­Â</b>(Ã¦ÂÂÃ¦ÂÂÃ¥Â­ÂÃ¨Â½ÂÃ¨ÂªÂÃ©ÂÂ³)Ã©ÂÂ¸Ã¥ÂÂ®Ã£ÂÂ</li><li>Ã¥Â°ÂÃ©Â ÂÃ¨Â¨Â­Ã¥Â¼ÂÃ¦ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ§ÂÂº<b>Ã¤Â¸ÂÃ¦ÂÂ TTS Ã¥Â¼ÂÃ¦ÂÂ</b>Ã£ÂÂ</li><li>Ã©Â»ÂÃ©ÂÂ¸Ã¥Â¼ÂÃ¦ÂÂÃ¦ÂÂÃ§ÂÂ<b>Ã¨Â¨Â­Ã¥Â®Â(Ã©Â½ÂÃ¨Â¼ÂªÃ¥ÂÂÃ§Â¤Âº)</b>Ã£ÂÂ</li><li>Ã©Â»ÂÃ©ÂÂ¸<b>Ã¥Â®ÂÃ¨Â£ÂÃ¨ÂªÂÃ©ÂÂ³Ã¨Â³ÂÃ¦ÂÂ</b>,Ã¥ÂÂ¨Ã¦Â¸ÂÃ¥ÂÂ®Ã¤Â¸Â­Ã¦ÂÂ¾Ã¥ÂÂ°<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ</b>Ã¤Â¸Â¦Ã¤Â¸ÂÃ¨Â¼ÂÃ£ÂÂ</li></ol><div class=\"tts-tip\">Ã¢ÂÂ» Ã¦ÂÂ¨Ã¤Â¹ÂÃ¥ÂÂ¯Ã¤Â»Â¥Ã§ÂÂ´Ã¦ÂÂ¥Ã¥ÂÂ¨ Galaxy Store Ã¤Â¸Â­Ã¦ÂÂÃ¥Â°Â Samsung TTS Vietnamese Voice Ã¨ÂªÂÃ©ÂÂ³Ã¥ÂÂÃ¤Â¸Â¦Ã¥Â®ÂÃ¨Â£ÂÃ£ÂÂ</div>", "en": "<h4>1. Add Vietnamese in the Google Speech Engine (Common)</h4><p class=\"p-desc\">Here's how to download the Vietnamese voice pack for the Google engine built into most Android devices.</p><ol><li>Open the <b>Settings</b> app on your phone.</li><li>Go to <b>Accessibility</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Text-to-speech output</b> menu.</li><li>Check that the default engine is set to <b>Google Speech Recognition and Synthesis</b> (or Speech Services by Google).</li><li>Tap the <b>Settings (gear icon)</b> next to the default engine.</li><li>Select <b>Install voice data</b>.</li><li>Find <b>Vietnamese</b> in the list and tap the download button.</li><li>Once the download finishes, go back and set the <b>Language</b> to <b>Vietnamese</b>.</li></ol><h4>2. Add Vietnamese on a Samsung Galaxy Device</h4><p class=\"p-desc\">If you're using a Samsung Galaxy phone, you can add Samsung's own high-quality Vietnamese TTS.</p><ol><li>Open the <b>Settings</b> app on your phone.</li><li>Go to <b>General</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Text-to-speech</b> (or Read out text) menu.</li><li>Set the default engine to <b>Samsung TTS engine</b>.</li><li>Tap <b>Settings (gear icon)</b> next to the engine.</li><li>Tap <b>Install voice data</b> and find <b>Vietnamese</b> in the list to download it.</li></ol><div class=\"tts-tip\">Ã¢ÂÂ» You can also search for and install the Samsung TTS Vietnamese Voice pack directly from the Galaxy Store.</div>", "fr": "<h4>1. Ajouter le vietnamien dans le moteur vocal Google (Android en gÃÂ©nÃÂ©ral)</h4><p class=\"p-desc\">Voici comment tÃÂ©lÃÂ©charger le pack vocal vietnamien pour le moteur Google intÃÂ©grÃÂ© ÃÂ  la plupart des appareils Android.</p><ol><li>Ouvrez l'application <b>ParamÃÂ¨tres</b> de votre tÃÂ©lÃÂ©phone.</li><li>Allez dans <b>AccessibilitÃÂ©</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Sortie de synthÃÂ¨se vocale</b>.</li><li>VÃÂ©rifiez que le moteur prÃÂ©fÃÂ©rÃÂ© est <b>Reconnaissance et synthÃÂ¨se vocales Google</b>.</li><li>Appuyez sur l'icÃÂ´ne d'engrenage (paramÃÂ¨tres) ÃÂ  cÃÂ´tÃÂ© du moteur.</li><li>SÃÂ©lectionnez <b>Installer les donnÃÂ©es vocales</b>.</li><li>Recherchez <b>Vietnamien</b> dans la liste et appuyez sur TÃÂ©lÃÂ©charger.</li><li>Une fois tÃÂ©lÃÂ©chargÃÂ©, revenez en arriÃÂ¨re et rÃÂ©glez la langue sur <b>Vietnamien</b>.</li></ol><h4>2. Ajouter le vietnamien sur les appareils Samsung Galaxy</h4><p class=\"p-desc\">Si vous utilisez un smartphone Samsung Galaxy, vous pouvez installer la voix TTS vietnamienne haute dÃÂ©finition de Samsung.</p><ol><li>Ouvrez <b>ParamÃÂ¨tres</b>.</li><li>Allez dans <b>Gestion globale</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>SynthÃÂ¨se vocale</b>.</li><li>DÃÂ©finissez le moteur prÃÂ©fÃÂ©rÃÂ© sur <b>Moteur de synthÃÂ¨se vocale Samsung</b>.</li><li>Appuyez sur l'engrenage ÃÂ  cÃÂ´tÃÂ© du moteur.</li><li>Appuyez sur <b>Installer les donnÃÂ©es vocales</b> et tÃÂ©lÃÂ©chargez le vietnamien.</li></ol>", "de": "<h4>1. Vietnamesisch zur Google-Sprachausgabe hinzufÃÂ¼gen (Allgemein)</h4><p class=\"p-desc\">So laden Sie das vietnamesische Sprachpaket fÃÂ¼r die Google-Engine auf den meisten Android-GerÃÂ¤ten herunter.</p><ol><li>ÃÂffnen Sie die App <b>Einstellungen</b>.</li><li>Gehen Sie zu <b>Bedienungshilfen</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Text-in-Sprache-Ausgabe</b>.</li><li>Stellen Sie sicher, dass als bevorzugte Engine <b>Google Sprachausgabe</b> eingestellt ist.</li><li>Tippen Sie auf das <b>Zahnrad-Symbol</b> neben der Engine.</li><li>WÃÂ¤hlen Sie <b>Sprachdaten installieren</b>.</li><li>Suchen Sie in der Liste nach <b>Vietnamesisch</b> und tippen Sie auf Herunterladen.</li><li>Gehen Sie nach dem Download zurÃÂ¼ck und wÃÂ¤hlen Sie als Sprache <b>Vietnamesisch</b>.</li></ol><h4>2. Vietnamesisch auf Samsung-Galaxy-GerÃÂ¤ten hinzufÃÂ¼gen</h4><p class=\"p-desc\">Auf Samsung Galaxy-Smartphones kÃÂ¶nnen Sie die hochwertige Samsung-eigene vietnamesische TTS-Stimme hinzufÃÂ¼gen.</p><ol><li>ÃÂffnen Sie <b>Einstellungen</b>.</li><li>Gehen Sie zu <b>Allgemeine Verwaltung</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Text-zu-Sprache</b>.</li><li>WÃÂ¤hlen Sie als bevorzugte Engine <b>Samsung Text-zu-Sprache-Engine</b>.</li><li>Tippen Sie auf das <b>Zahnrad-Symbol</b> neben der Engine.</li><li>Tippen Sie auf <b>Sprachdaten installieren</b> und laden Sie <b>Vietnamesisch</b> herunter.</li></ol><div class=\"tts-tip\">Ã¢ÂÂ» Sie kÃÂ¶nnen das Sprachpaket Ã¢ÂÂSamsung TTS Vietnamese VoiceÃ¢ÂÂ auch direkt im Galaxy Store suchen und installieren.</div>", "ja": "<h4>1. GoogleÃ£ÂÂ®Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂ¨Ã£ÂÂ³Ã£ÂÂ¸Ã£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ¨Â¿Â½Ã¥ÂÂ (Ã¥ÂÂ±Ã©ÂÂ)</h4><p class=\"p-desc\">Ã£ÂÂ»Ã£ÂÂ¨Ã£ÂÂÃ£ÂÂ©Ã£ÂÂ®AndroidÃ§Â«Â¯Ã¦ÂÂ«Ã£ÂÂ«Ã¥ÂÂÃ¨ÂÂµÃ£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂGoogleÃ£ÂÂ¨Ã£ÂÂ³Ã£ÂÂ¸Ã£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ¦ÂÂ¹Ã¦Â³ÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ</p><ol><li>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ©Ã£ÂÂ³Ã£ÂÂ®<b>Ã¨Â¨Â­Ã¥Â®Â</b>Ã£ÂÂ¢Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ©ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li><b>Ã£ÂÂ¦Ã£ÂÂ¼Ã£ÂÂ¶Ã£ÂÂ¼Ã¨Â£ÂÃ¥ÂÂ©</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Ã£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂ®Ã¥ÂÂºÃ¥ÂÂ</b>(Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ¦Â©ÂÃ¨ÂÂ½Ã£ÂÂ)Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ«Ã§Â§Â»Ã¥ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂÃ£ÂÂ©Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¨Ã£ÂÂ³Ã£ÂÂ¸Ã£ÂÂ³Ã£ÂÂ<b>GoogleÃ©ÂÂ³Ã¥Â£Â°Ã¨ÂªÂÃ¨Â­ÂÃ£ÂÂ¨Ã¥ÂÂÃ¦ÂÂ</b>(Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¯ Speech Services by Google)Ã£ÂÂ«Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ§Â¢ÂºÃ¨ÂªÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂÃ£ÂÂ©Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¨Ã£ÂÂ³Ã£ÂÂ¸Ã£ÂÂ³Ã£ÂÂ®Ã¦Â¨ÂªÃ£ÂÂ«Ã£ÂÂÃ£ÂÂ<b>Ã¨Â¨Â­Ã¥Â®Â(Ã¦Â­Â¯Ã¨Â»ÂÃ£ÂÂ¢Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ³)</b>Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li><b>Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ¿Ã£ÂÂ®Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«</b>Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂªÃ£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ<b>Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂ</b>(Vietnamese)Ã£ÂÂÃ¦ÂÂ¢Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ¿Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ¥Â®ÂÃ¤ÂºÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ¦ÂÂ»Ã£ÂÂÃ£ÂÂ<b>Ã¨Â¨ÂÃ¨ÂªÂ</b>Ã£ÂÂ<b>Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂ</b>Ã£ÂÂ«Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol><h4>2. Samsung GalaxyÃ§Â«Â¯Ã¦ÂÂ«Ã£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã£ÂÂÃ£ÂÂ</h4><p class=\"p-desc\">Samsung GalaxyÃ£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ©Ã£ÂÂ³Ã£ÂÂÃ£ÂÂÃ¤Â½Â¿Ã£ÂÂÃ£ÂÂ®Ã¥Â Â´Ã¥ÂÂÃ£ÂÂSamsungÃ§ÂÂ¬Ã¨ÂÂªÃ£ÂÂ®Ã©Â«ÂÃ¥ÂÂÃ¨Â³ÂªÃ£ÂÂªÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂTTSÃ£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</p><ol><li>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ©Ã£ÂÂ³Ã£ÂÂ®<b>Ã¨Â¨Â­Ã¥Â®Â</b>Ã£ÂÂ¢Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ©ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li><b>Ã¤Â¸ÂÃ¨ÂÂ¬</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ¦Â©ÂÃ¨ÂÂ½</b>(Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂ)Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ«Ã§Â§Â»Ã¥ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂÃ£ÂÂ©Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¨Ã£ÂÂ³Ã£ÂÂ¸Ã£ÂÂ³Ã£ÂÂ<b>Samsung TTSÃ£ÂÂ¨Ã£ÂÂ³Ã£ÂÂ¸Ã£ÂÂ³</b>Ã£ÂÂ«Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂ¨Ã£ÂÂ³Ã£ÂÂ¸Ã£ÂÂ³Ã£ÂÂ®Ã¦Â¨ÂªÃ£ÂÂ«Ã£ÂÂÃ£ÂÂ<b>Ã¨Â¨Â­Ã¥Â®Â(Ã¦Â­Â¯Ã¨Â»ÂÃ£ÂÂ¢Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ³)</b>Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li><b>Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ¿Ã£ÂÂ®Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«</b>Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂªÃ£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ<b>Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂ</b>Ã£ÂÂÃ¦ÂÂ¢Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol><div class=\"tts-tip\">Ã¢ÂÂ» Galaxy StoreÃ£ÂÂ§Ã§ÂÂ´Ã¦ÂÂ¥Samsung TTS Vietnamese VoiceÃ£ÂÂÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ¦Â¤ÂÃ§Â´Â¢Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</div>", "pl": "<h4>1. Dodawanie wietnamskiego w syntezatorze mowy Google (Android)</h4><p class=\"p-desc\">Instrukcja pobierania pakietu mowy wietnamskiej dla silnika Google.</p><ol><li>OtwÃÂ³rz <b>Ustawienia</b> w telefonie.</li><li>PrzejdÃÂº do <b>UÃÂatwienia dostÃÂpu</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Zamiana tekstu na mowÃÂ</b>.</li><li>Upewnij siÃÂ, ÃÂ¼e preferowanym mechanizmem sÃÂ <b>UsÃÂugi mowy Google</b>.</li><li>Dotknij ikony koÃÂa zÃÂbatego obok mechanizmu.</li><li>Wybierz <b>Zainstaluj dane gÃÂosowe</b>.</li><li>ZnajdÃÂº <b>Wietnamski</b> i pobierz go.</li></ol><h4>2. Dodawanie wietnamskiego na urzÃÂdzeniach Samsung Galaxy</h4><p class=\"p-desc\">Na telefonach Samsung Galaxy moÃÂ¼esz zainstalowaÃÂ wysokiej jakoÃÂci gÃÂos Samsung.</p><ol><li>OtwÃÂ³rz <b>Ustawienia</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>ZarzÃÂdzanie ogÃÂ³lne</b> Ã¢ÂÂ¡Ã¯Â¸Â <b>Zamiana tekstu na mowÃÂ</b>.</li><li>Ustaw preferowany mechanizm na <b>Mechanizm zamiany tekstu na mowÃÂ Samsung</b>.</li><li>Dotknij koÃÂa zÃÂbatego i zainstaluj dane gÃÂosowe dla jÃÂzyka wietnamskiego.</li></ol>"},
    "<p class=\"p-desc\">별도의 프로그램 설치 없이 Mac 시스템 설정에서 바로 다운로드할 수 있어요.</p><h4>1단계: 베트남어 TTS 음성 추가하기</h4><ol><li>Mac 화면 왼쪽 상단의 Apple 메뉴( ) &gt; <b>시스템 설정</b>을 선택합니다.</li><li>사이드바에서 <b>손쉬운 사용</b>을 클릭한 뒤, <b>읽기 및 말하기</b>(또는 macOS 버전에 따라 <b>콘텐츠 말하기</b>)를 선택합니다.</li><li>‘시스템 음성’ 오른쪽에 있는 ⓘ(정보) 버튼 또는 팝업 메뉴를 클릭합니다.</li><li>왼쪽 언어 목록에서 <b>베트남어(Vietnamese)</b>를 찾아 선택합니다.</li><li>원하는 음성(예: Linh 등) 옆의 구름 모양 다운로드 아이콘을 클릭하여 설치합니다.</li><li>다운로드가 완료되면 <b>완료</b>(또는 승인)를 누릅니다.</li></ol><h4>2단계: 시스템 말하기 언어 변경하기</h4><ol><li>‘읽기 및 말하기’ 설정 화면으로 돌아와 ‘시스템 말하기 언어’ 팝업 메뉴를 베트남어로 변경합니다.</li><li>‘시스템 음성’ 메뉴에서 방금 다운로드한 베트남어 음성을 지정합니다.</li><li>아래의 ‘선택 항목 말하기’ 토글을 켜서 활성화합니다.</li></ol><h4>3단계: 단축키로 베트남어 텍스트 읽기</h4><ol><li>웹페이지나 문서에서 베트남어 텍스트를 마우스로 드래그하여 블록 지정(선택)합니다.</li><li>키보드 단축키인 <b>Option + Esc</b>를 동시에 누르면 선택한 베트남어가 원어민 발음으로 재생돼요. (중단하고 싶을 때 다시 누르면 멈춰요.)</li></ol>": {"zh_cn": "<p class=\"p-desc\">Ã¤Â¸ÂÃ©ÂÂÃ¨Â¦ÂÃ¥ÂÂ¦Ã¥Â¤ÂÃ¥Â®ÂÃ¨Â£ÂÃ§Â¨ÂÃ¥Â¼ÂÃ¯Â¼ÂÃ§ÂÂ´Ã¦ÂÂ¥Ã¥ÂÂ¨ Mac Ã§ÂÂÃ§Â³Â»Ã§Â»ÂÃ¨Â®Â¾Ã¥Â®ÂÃ¤Â¸Â­Ã¥ÂÂ³Ã¥ÂÂ¯Ã¤Â¸ÂÃ¨Â½Â½Ã£ÂÂ</p><h4>Ã§Â¬Â¬1Ã¦Â­Â¥Ã¯Â¼ÂÃ¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­ TTS Ã¨Â¯Â­Ã©ÂÂ³</h4><ol><li>Ã§ÂÂ¹Ã©ÂÂ Mac Ã§ÂÂ»Ã©ÂÂ¢Ã¥Â·Â¦Ã¤Â¸ÂÃ¨Â§ÂÃ§ÂÂ Apple Ã©ÂÂÃ¥ÂÂ( ) &gt; <b>Ã§Â³Â»Ã§Â»ÂÃ¨Â®Â¾Ã¥Â®Â</b>Ã£ÂÂ</li><li>Ã¥ÂÂ¨Ã¥ÂÂ´Ã¨Â¾Â¹Ã¦Â ÂÃ§ÂÂ¹Ã©ÂÂ<b>Ã¨Â¾ÂÃ¥ÂÂ©Ã¤Â½Â¿Ã§ÂÂ¨</b>Ã¯Â¼ÂÃ¦ÂÂ¥Ã§ÂÂÃ©ÂÂÃ¦ÂÂ©<b>Ã¦ÂÂÃ¨Â¯Â»Ã¥ÂÂÃ¥Â®Â¹</b>(Ã¤Â¾Â macOS Ã§ÂÂÃ¦ÂÂ¬Ã¤Â¸ÂÃ¥ÂÂÃ¯Â¼ÂÃ¥ÂÂ¯Ã¨ÂÂ½Ã¦ÂÂ¾Ã§Â¤ÂºÃ¤Â¸Âº<b>Ã¨Â¯Â­Ã©ÂÂ³</b>)Ã£ÂÂ</li><li>Ã§ÂÂ¹Ã©ÂÂÃ£ÂÂÃ§Â³Â»Ã§Â»ÂÃ¨Â¯Â­Ã©ÂÂ³Ã£ÂÂÃ¥ÂÂ³Ã¥ÂÂ´Ã§ÂÂ Ã¢ÂÂ(Ã¨ÂµÂÃ¨Â®Â¯)Ã¦ÂÂÃ©ÂÂ®Ã¦ÂÂÃ¥Â½ÂÃ¥ÂÂºÃ¥Â¼ÂÃ©ÂÂÃ¥ÂÂÃ£ÂÂ</li><li>Ã¥ÂÂ¨Ã¥Â·Â¦Ã¥ÂÂ´Ã¨Â¯Â­Ã¨Â¨ÂÃ¦Â¸ÂÃ¥ÂÂÃ¤Â¸Â­Ã¦ÂÂ¾Ã¥ÂÂ°Ã¥Â¹Â¶Ã©ÂÂÃ¦ÂÂ©<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­(Vietnamese)</b>Ã£ÂÂ</li><li>Ã§ÂÂ¹Ã©ÂÂÃ¦ÂÂ³Ã¨Â¦ÂÃ§ÂÂÃ¨Â¯Â­Ã©ÂÂ³(Ã¤Â¾ÂÃ¥Â¦Â Linh Ã§Â­Â)Ã¦ÂÂÃ§ÂÂÃ©ÂÂ²Ã¦ÂÂµÃ¤Â¸ÂÃ¨Â½Â½Ã¥ÂÂ¾Ã§Â¤ÂºÃ¨Â¿ÂÃ¨Â¡ÂÃ¥Â®ÂÃ¨Â£ÂÃ£ÂÂ</li><li>Ã¤Â¸ÂÃ¨Â½Â½Ã¥Â®ÂÃ¦ÂÂÃ¥ÂÂÃ¦ÂÂÃ¤Â¸Â<b>Ã¥Â®ÂÃ¦ÂÂ</b>(Ã¦ÂÂÃ¦Â Â¸Ã¥ÂÂ)Ã£ÂÂ</li></ol><h4>Ã§Â¬Â¬2Ã¦Â­Â¥Ã¯Â¼ÂÃ¥ÂÂÃ¦ÂÂ´Ã§Â³Â»Ã§Â»ÂÃ¦ÂÂÃ¨Â¯Â»Ã¨Â¯Â­Ã¨Â¨Â</h4><ol><li>Ã¨Â¿ÂÃ¥ÂÂÃ£ÂÂÃ¦ÂÂÃ¨Â¯Â»Ã¥ÂÂÃ¥Â®Â¹Ã£ÂÂÃ¨Â®Â¾Ã¥Â®ÂÃ§ÂÂ»Ã©ÂÂ¢Ã¯Â¼ÂÃ¥Â°ÂÃ£ÂÂÃ§Â³Â»Ã§Â»ÂÃ¦ÂÂÃ¨Â¯Â»Ã¨Â¯Â­Ã¨Â¨ÂÃ£ÂÂÃ¥Â½ÂÃ¥ÂÂºÃ¥Â¼ÂÃ©ÂÂÃ¥ÂÂÃ¥ÂÂÃ¦ÂÂ´Ã¤Â¸ÂºÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã£ÂÂ</li><li>Ã¥ÂÂ¨Ã£ÂÂÃ§Â³Â»Ã§Â»ÂÃ¨Â¯Â­Ã©ÂÂ³Ã£ÂÂÃ©ÂÂÃ¥ÂÂÃ¤Â¸Â­Ã¯Â¼ÂÃ¦ÂÂÃ¥Â®ÂÃ¥ÂÂÃ¥ÂÂÃ¤Â¸ÂÃ¨Â½Â½Ã§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¨Â¯Â­Ã©ÂÂ³Ã£ÂÂ</li><li>Ã¥Â¼ÂÃ¥ÂÂ¯Ã¤Â¸ÂÃ¦ÂÂ¹Ã§ÂÂÃ£ÂÂÃ¦ÂÂÃ¨Â¯Â»Ã¦ÂÂÃ©ÂÂÃ¨ÂÂÃ¥ÂÂ´Ã£ÂÂÃ¥ÂÂÃ¦ÂÂ¢Ã¥Â¼ÂÃ¥ÂÂ³Ã¤Â»Â¥Ã¥ÂÂ¯Ã§ÂÂ¨Ã¦Â­Â¤Ã¥ÂÂÃ¨ÂÂ½Ã£ÂÂ</li></ol><h4>Ã§Â¬Â¬3Ã¦Â­Â¥Ã¯Â¼ÂÃ¤Â½Â¿Ã§ÂÂ¨Ã¥Â¿Â«Ã©ÂÂÃ©ÂÂ®Ã¦ÂÂÃ¨Â¯Â»Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂÃ¥Â­Â</h4><ol><li>Ã¥ÂÂ¨Ã§Â½ÂÃ©Â¡ÂµÃ¦ÂÂÃ¦ÂÂÃ¤Â»Â¶Ã¤Â¸Â­Ã§ÂÂ¨Ã¦Â»ÂÃ©Â¼Â Ã¦ÂÂÃ¦ÂÂ³Ã©ÂÂÃ¥ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂÃ¥Â­ÂÃ£ÂÂ</li><li>Ã¥ÂÂÃ¦ÂÂ¶Ã¦ÂÂÃ¤Â¸ÂÃ©ÂÂ®Ã§ÂÂÃ¥Â¿Â«Ã©ÂÂÃ©ÂÂ®<b>Option + Esc</b>Ã¯Â¼ÂÃ¥ÂÂ³Ã¥ÂÂ¯Ã¤Â»Â¥Ã¦Â¯ÂÃ¨Â¯Â­Ã¥ÂÂÃ©ÂÂ³Ã¦ÂÂÃ¨Â¯Â»Ã¦ÂÂÃ©ÂÂÃ§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂÃ¥Â­ÂÃ£ÂÂ(Ã¦ÂÂ³Ã¨Â¦ÂÃ¥ÂÂÃ¦Â­Â¢Ã¦ÂÂ¶Ã¥ÂÂÃ¦ÂÂÃ¤Â¸ÂÃ¦Â¬Â¡Ã¥ÂÂ³Ã¥ÂÂ¯Ã¥ÂÂÃ¦Â­Â¢Ã£ÂÂ)</li></ol>", "zh": "<p class=\"p-desc\">Ã¤Â¸ÂÃ©ÂÂÃ¨Â¦ÂÃ¥ÂÂ¦Ã¥Â¤ÂÃ¥Â®ÂÃ¨Â£ÂÃ§Â¨ÂÃ¥Â¼ÂÃ¯Â¼ÂÃ§ÂÂ´Ã¦ÂÂ¥Ã¥ÂÂ¨ Mac Ã§ÂÂÃ§Â³Â»Ã§ÂµÂ±Ã¨Â¨Â­Ã¥Â®ÂÃ¤Â¸Â­Ã¥ÂÂ³Ã¥ÂÂ¯Ã¤Â¸ÂÃ¨Â¼ÂÃ£ÂÂ</p><h4>Ã§Â¬Â¬1Ã¦Â­Â¥Ã¯Â¼ÂÃ¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ TTS Ã¨ÂªÂÃ©ÂÂ³</h4><ol><li>Ã©Â»ÂÃ©ÂÂ¸ Mac Ã§ÂÂ«Ã©ÂÂ¢Ã¥Â·Â¦Ã¤Â¸ÂÃ¨Â§ÂÃ§ÂÂ Apple Ã©ÂÂ¸Ã¥ÂÂ®( ) &gt; <b>Ã§Â³Â»Ã§ÂµÂ±Ã¨Â¨Â­Ã¥Â®Â</b>Ã£ÂÂ</li><li>Ã¥ÂÂ¨Ã¥ÂÂ´Ã©ÂÂÃ¦Â¬ÂÃ©Â»ÂÃ©ÂÂ¸<b>Ã¨Â¼ÂÃ¥ÂÂ©Ã¤Â½Â¿Ã§ÂÂ¨</b>Ã¯Â¼ÂÃ¦ÂÂ¥Ã¨ÂÂÃ©ÂÂ¸Ã¦ÂÂ<b>Ã¦ÂÂÃ¨Â®ÂÃ¥ÂÂ§Ã¥Â®Â¹</b>(Ã¤Â¾Â macOS Ã§ÂÂÃ¦ÂÂ¬Ã¤Â¸ÂÃ¥ÂÂÃ¯Â¼ÂÃ¥ÂÂ¯Ã¨ÂÂ½Ã©Â¡Â¯Ã§Â¤ÂºÃ§ÂÂº<b>Ã¨ÂªÂÃ©ÂÂ³</b>)Ã£ÂÂ</li><li>Ã©Â»ÂÃ©ÂÂ¸Ã£ÂÂÃ§Â³Â»Ã§ÂµÂ±Ã¨ÂªÂÃ©ÂÂ³Ã£ÂÂÃ¥ÂÂ³Ã¥ÂÂ´Ã§ÂÂ Ã¢ÂÂ(Ã¨Â³ÂÃ¨Â¨Â)Ã¦ÂÂÃ©ÂÂÃ¦ÂÂÃ¥Â½ÂÃ¥ÂÂºÃ¥Â¼ÂÃ©ÂÂ¸Ã¥ÂÂ®Ã£ÂÂ</li><li>Ã¥ÂÂ¨Ã¥Â·Â¦Ã¥ÂÂ´Ã¨ÂªÂÃ¨Â¨ÂÃ¦Â¸ÂÃ¥ÂÂ®Ã¤Â¸Â­Ã¦ÂÂ¾Ã¥ÂÂ°Ã¤Â¸Â¦Ã©ÂÂ¸Ã¦ÂÂ<b>Ã¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ(Vietnamese)</b>Ã£ÂÂ</li><li>Ã©Â»ÂÃ©ÂÂ¸Ã¦ÂÂ³Ã¨Â¦ÂÃ§ÂÂÃ¨ÂªÂÃ©ÂÂ³(Ã¤Â¾ÂÃ¥Â¦Â Linh Ã§Â­Â)Ã¦ÂÂÃ§ÂÂÃ©ÂÂ²Ã¦ÂÂµÃ¤Â¸ÂÃ¨Â¼ÂÃ¥ÂÂÃ§Â¤ÂºÃ©ÂÂ²Ã¨Â¡ÂÃ¥Â®ÂÃ¨Â£ÂÃ£ÂÂ</li><li>Ã¤Â¸ÂÃ¨Â¼ÂÃ¥Â®ÂÃ¦ÂÂÃ¥Â¾ÂÃ¦ÂÂÃ¤Â¸Â<b>Ã¥Â®ÂÃ¦ÂÂ</b>(Ã¦ÂÂÃ¦Â Â¸Ã¥ÂÂ)Ã£ÂÂ</li></ol><h4>Ã§Â¬Â¬2Ã¦Â­Â¥Ã¯Â¼ÂÃ¨Â®ÂÃ¦ÂÂ´Ã§Â³Â»Ã§ÂµÂ±Ã¦ÂÂÃ¨Â®ÂÃ¨ÂªÂÃ¨Â¨Â</h4><ol><li>Ã¨Â¿ÂÃ¥ÂÂÃ£ÂÂÃ¦ÂÂÃ¨Â®ÂÃ¥ÂÂ§Ã¥Â®Â¹Ã£ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ§ÂÂ«Ã©ÂÂ¢Ã¯Â¼ÂÃ¥Â°ÂÃ£ÂÂÃ§Â³Â»Ã§ÂµÂ±Ã¦ÂÂÃ¨Â®ÂÃ¨ÂªÂÃ¨Â¨ÂÃ£ÂÂÃ¥Â½ÂÃ¥ÂÂºÃ¥Â¼ÂÃ©ÂÂ¸Ã¥ÂÂ®Ã¨Â®ÂÃ¦ÂÂ´Ã§ÂÂºÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ£ÂÂ</li><li>Ã¥ÂÂ¨Ã£ÂÂÃ§Â³Â»Ã§ÂµÂ±Ã¨ÂªÂÃ©ÂÂ³Ã£ÂÂÃ©ÂÂ¸Ã¥ÂÂ®Ã¤Â¸Â­Ã¯Â¼ÂÃ¦ÂÂÃ¥Â®ÂÃ¥ÂÂÃ¥ÂÂÃ¤Â¸ÂÃ¨Â¼ÂÃ§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¨ÂªÂÃ©ÂÂ³Ã£ÂÂ</li><li>Ã©ÂÂÃ¥ÂÂÃ¤Â¸ÂÃ¦ÂÂ¹Ã§ÂÂÃ£ÂÂÃ¦ÂÂÃ¨Â®ÂÃ¦ÂÂÃ©ÂÂ¸Ã§Â¯ÂÃ¥ÂÂÃ£ÂÂÃ¥ÂÂÃ¦ÂÂÃ©ÂÂÃ©ÂÂÃ¤Â»Â¥Ã¥ÂÂÃ§ÂÂ¨Ã¦Â­Â¤Ã¥ÂÂÃ¨ÂÂ½Ã£ÂÂ</li></ol><h4>Ã§Â¬Â¬3Ã¦Â­Â¥Ã¯Â¼ÂÃ¤Â½Â¿Ã§ÂÂ¨Ã¥Â¿Â«Ã©ÂÂÃ©ÂÂµÃ¦ÂÂÃ¨Â®ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂÃ¥Â­Â</h4><ol><li>Ã¥ÂÂ¨Ã§Â¶Â²Ã©Â ÂÃ¦ÂÂÃ¦ÂÂÃ¤Â»Â¶Ã¤Â¸Â­Ã§ÂÂ¨Ã¦Â»ÂÃ©Â¼Â Ã¦ÂÂÃ¦ÂÂ³Ã©ÂÂ¸Ã¥ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂÃ¥Â­ÂÃ£ÂÂ</li><li>Ã¥ÂÂÃ¦ÂÂÃ¦ÂÂÃ¤Â¸ÂÃ©ÂÂµÃ§ÂÂ¤Ã¥Â¿Â«Ã©ÂÂÃ©ÂÂµ<b>Option + Esc</b>Ã¯Â¼ÂÃ¥ÂÂ³Ã¥ÂÂ¯Ã¤Â»Â¥Ã¦Â¯ÂÃ¨ÂªÂÃ§ÂÂ¼Ã©ÂÂ³Ã¦ÂÂÃ¨Â®ÂÃ¦ÂÂÃ©ÂÂ¸Ã§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂÃ¥Â­ÂÃ£ÂÂ(Ã¦ÂÂ³Ã¨Â¦ÂÃ¥ÂÂÃ¦Â­Â¢Ã¦ÂÂÃ¥ÂÂÃ¦ÂÂÃ¤Â¸ÂÃ¦Â¬Â¡Ã¥ÂÂ³Ã¥ÂÂ¯Ã¥ÂÂÃ¦Â­Â¢Ã£ÂÂ)</li></ol>", "en": "<p class=\"p-desc\">No separate app needs to be installed Ã¢ÂÂ you can download it directly from Mac System Settings.</p><h4>Step 1: Add a Vietnamese TTS Voice</h4><ol><li>Click the Apple menu ( ) at the top-left of your Mac screen &gt; select <b>System Settings</b>.</li><li>Click <b>Accessibility</b> in the sidebar, then select <b>Spoken Content</b> (or <b>Speech</b>, depending on your macOS version).</li><li>Click the Ã¢ÂÂ (info) button or pop-up menu next to \"System Voice.\"</li><li>Find and select <b>Vietnamese</b> in the language list on the left.</li><li>Click the cloud download icon next to the voice you want (e.g., Linh) to install it.</li><li>Once the download finishes, click <b>Done</b> (or Approve).</li></ol><h4>Step 2: Change the System Speaking Language</h4><ol><li>Return to the Spoken Content settings screen and change the \"System voice\" language pop-up menu to Vietnamese.</li><li>In the \"System Voice\" menu, select the Vietnamese voice you just downloaded.</li><li>Turn on the \"Speak Selection\" toggle below to enable it.</li></ol><h4>Step 3: Use a Keyboard Shortcut to Read Vietnamese Text Aloud</h4><ol><li>Drag with your mouse to select (highlight) Vietnamese text on a webpage or document.</li><li>Press the keyboard shortcut <b>Option + Esc</b> at the same time to hear the selected Vietnamese text read aloud in a native pronunciation. (Press it again to stop.)</li></ol>", "fr": "<p class=\"p-desc\">Vous pouvez tÃÂ©lÃÂ©charger les voix directement dans les RÃÂ©glages SystÃÂ¨me de votre Mac sans logiciel tiers.</p><h4>ÃÂtape 1 : Ajouter une voix TTS vietnamienne</h4><ol><li>Cliquez sur le menu Apple ( ) &gt; <b>RÃÂ©glages SystÃÂ¨me</b>.</li><li>Dans la barre latÃÂ©rale, cliquez sur <b>AccessibilitÃÂ©</b> puis sur <b>Contenu ÃÂ©noncÃÂ©</b>.</li><li>Cliquez sur le bouton Ã¢ÂÂ ou le menu dÃÂ©roulant ÃÂ  cÃÂ´tÃÂ© de ÃÂ« Voix du systÃÂ¨me ÃÂ».</li><li>SÃÂ©lectionnez <b>Vietnamien</b> dans la liste des langues ÃÂ  gauche.</li><li>Cliquez sur l'icÃÂ´ne de nuage ÃÂ  cÃÂ´tÃÂ© de la voix souhaitÃÂ©e (ex. : Linh) pour l'installer.</li><li>Cliquez sur <b>TerminÃÂ©</b>.</li></ol><h4>ÃÂtape 2 : Configurer la voix du systÃÂ¨me</h4><ol><li>RÃÂ©glez la voix du systÃÂ¨me sur la voix vietnamienne tÃÂ©lÃÂ©chargÃÂ©e.</li><li>Activez l'option ÃÂ« ÃÂnoncer la sÃÂ©lection ÃÂ».</li></ol><h4>ÃÂtape 3 : Raccourci clavier pour la lecture</h4><ol><li>SÃÂ©lectionnez du texte vietnamien avec votre souris.</li><li>Appuyez sur <b>Option + ÃÂchap</b> pour lancer la lecture vocale. Appuyez ÃÂ  nouveau pour arrÃÂªter.</li></ol>", "de": "<p class=\"p-desc\">Sie kÃÂ¶nnen vietnamesische Stimmen direkt in den Mac-Systemeinstellungen herunterladen, ohne zusÃÂ¤tzliche Software zu installieren.</p><h4>Schritt 1: Vietnamesische TTS-Stimme hinzufÃÂ¼gen</h4><ol><li>WÃÂ¤hlen Sie das Apple-MenÃÂ¼ ( ) &gt; <b>Systemeinstellungen</b>.</li><li>Klicken Sie in der Seitenleiste auf <b>Bedienungshilfen</b> und dann auf <b>Gesprochene Inhalte</b>.</li><li>Klicken Sie auf das Ã¢ÂÂ-Symbol oder das MenÃÂ¼ neben Ã¢ÂÂSystemstimmeÃ¢ÂÂ.</li><li>WÃÂ¤hlen Sie in der Sprachenliste <b>Vietnamesisch</b> aus.</li><li>Klicken Sie auf das Download-Symbol neben der gewÃÂ¼nschten Stimme (z. B. Linh), um sie zu installieren.</li><li>Klicken Sie nach Abschluss auf <b>Fertig</b>.</li></ol><h4>Schritt 2: Sprachausgabe konfigurieren</h4><ol><li>WÃÂ¤hlen Sie als Systemstimme die heruntergeladene vietnamesische Stimme aus.</li><li>Aktivieren Sie die Option Ã¢ÂÂAuswahl sprechenÃ¢ÂÂ.</li></ol><h4>Schritt 3: Text per Kurzbefehl vorlesen</h4><ol><li>Markieren Sie vietnamesischen Text auf einer Webseite oder in einem Dokument.</li><li>DrÃÂ¼cken Sie <b>Wahltaste (Option) + Esc</b>, um den Text anzuhÃÂ¶ren. Ein erneuter Tastendruck stoppt die Wiedergabe.</li></ol>", "ja": "<p class=\"p-desc\">Ã¥ÂÂ¥Ã©ÂÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã£ÂÂÃ£ÂÂÃ¥Â¿ÂÃ¨Â¦ÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂMacÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ·Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ§ÂÂ´Ã¦ÂÂ¥Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</p><h4>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ1Ã¯Â¼ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®TTSÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã£ÂÂÃ£ÂÂ</h4><ol><li>MacÃ§ÂÂ»Ã©ÂÂ¢Ã¥Â·Â¦Ã¤Â¸ÂÃ£ÂÂ®AppleÃ£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼( )&gt;<b>Ã£ÂÂ·Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ Ã¨Â¨Â­Ã¥Â®Â</b>Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂµÃ£ÂÂ¤Ã£ÂÂÃ£ÂÂÃ£ÂÂ¼Ã£ÂÂ§<b>Ã£ÂÂ¢Ã£ÂÂ¯Ã£ÂÂ»Ã£ÂÂ·Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂ£</b>Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ<b>Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂ³Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ³Ã£ÂÂ</b>(macOSÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ¸Ã£ÂÂ§Ã£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ£Ã£ÂÂ¦Ã£ÂÂ¯<b>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ</b>)Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂ·Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ Ã£ÂÂ®Ã¥Â£Â°Ã£ÂÂÃ£ÂÂ®Ã¥ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ Ã¢ÂÂ(Ã¦ÂÂÃ¥Â Â±)Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂ³Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂÃ£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¥Â·Â¦Ã¥ÂÂ´Ã£ÂÂ®Ã¨Â¨ÂÃ¨ÂªÂÃ£ÂÂªÃ£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ<b>Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂ(Vietnamese)</b>Ã£ÂÂÃ¦ÂÂ¢Ã£ÂÂÃ£ÂÂ¦Ã©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¤Â½Â¿Ã§ÂÂ¨Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ©ÂÂ³Ã¥Â£Â°(Ã¤Â¾ÂÃ¯Â¼ÂLinhÃ£ÂÂªÃ£ÂÂ©)Ã£ÂÂ®Ã¦Â¨ÂªÃ£ÂÂ«Ã£ÂÂÃ£ÂÂÃ©ÂÂ²Ã¥Â½Â¢Ã£ÂÂ®Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ¢Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ¥Â®ÂÃ¤ÂºÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ<b>Ã¥Â®ÂÃ¤ÂºÂ</b>(Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¯Ã¦ÂÂ¿Ã¨ÂªÂ)Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol><h4>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ2Ã¯Â¼ÂÃ£ÂÂ·Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ Ã£ÂÂ®Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ¨Â¨ÂÃ¨ÂªÂÃ£ÂÂÃ¥Â¤ÂÃ¦ÂÂ´Ã£ÂÂÃ£ÂÂ</h4><ol><li>Ã£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂ³Ã£ÂÂ³Ã£ÂÂÃ£ÂÂ³Ã£ÂÂÃ£ÂÂÃ£ÂÂ®Ã¨Â¨Â­Ã¥Â®ÂÃ§ÂÂ»Ã©ÂÂ¢Ã£ÂÂ«Ã¦ÂÂ»Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ·Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ Ã£ÂÂ®Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ¨Â¨ÂÃ¨ÂªÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂÃ£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ«Ã¥Â¤ÂÃ¦ÂÂ´Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂ·Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ Ã£ÂÂ®Ã¥Â£Â°Ã£ÂÂÃ£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ§Ã£ÂÂÃ¥ÂÂÃ£ÂÂ»Ã£ÂÂ©Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ¦ÂÂÃ¥Â®ÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¤Â¸ÂÃ£ÂÂ«Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ©Â ÂÃ§ÂÂ®Ã£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ°Ã£ÂÂ«Ã£ÂÂÃ£ÂÂªÃ£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¦Ã¦ÂÂÃ¥ÂÂ¹Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol><h4>Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂ3Ã¯Â¼ÂÃ£ÂÂ·Ã£ÂÂ§Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ«Ã£ÂÂÃ£ÂÂÃ£ÂÂ­Ã£ÂÂ¼Ã£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂ</h4><ol><li>WebÃ£ÂÂÃ£ÂÂ¼Ã£ÂÂ¸Ã£ÂÂÃ¦ÂÂÃ¦ÂÂ¸Ã£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ¹Ã£ÂÂ§Ã£ÂÂÃ£ÂÂ©Ã£ÂÂÃ£ÂÂ°Ã£ÂÂÃ£ÂÂ¦Ã©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂÃ£ÂÂ·Ã£ÂÂ§Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ«Ã£ÂÂÃ£ÂÂ<b>Option + Esc</b>Ã£ÂÂÃ¥ÂÂÃ¦ÂÂÃ£ÂÂ«Ã¦ÂÂ¼Ã£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¤Ã£ÂÂÃ£ÂÂ£Ã£ÂÂÃ§ÂÂºÃ©ÂÂ³Ã£ÂÂ§Ã¥ÂÂÃ§ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ(Ã¥ÂÂÃ¦Â­Â¢Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂÃ¤Â¸ÂÃ¥ÂºÂ¦Ã¦ÂÂ¼Ã£ÂÂÃ£ÂÂ¨Ã¦Â­Â¢Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ)</li></ol>", "pl": "<p class=\"p-desc\">MoÃÂ¼esz pobraÃÂ gÃÂosy wietnamskie bezpoÃÂrednio w Ustawieniach systemowych komputera Mac.</p><h4>Krok 1: Dodaj gÃÂos wietnamski</h4><ol><li>Wybierz menu Apple Ã¯Â£Â¿ &gt; <b>Ustawienia systemowe</b>.</li><li>Kliknij <b>DostÃÂpnoÃÂÃÂ</b>, a nastÃÂpnie <b>ZawartoÃÂÃÂ mÃÂ³wiona</b>.</li><li>Wybierz jÃÂzyk <b>Wietnamski</b> i pobierz preferowany gÃÂos.</li><li>WÃÂÃÂcz funkcjÃÂ Ã¢ÂÂMÃÂ³w zaznaczoneÃ¢ÂÂ.</li><li>Zaznacz tekst wietnamski i naciÃÂnij skrÃÂ³t <b>Option + Esc</b>, aby odsÃÂuchaÃÂ wymowÃÂ.</li></ol>"},
    "<h4>⚙️ Windows 11에서 베트남어 TTS 추가하기</h4><ol><li>설정 열기: 키보드에서 <b>Win + I</b> 단축키를 누릅니다.</li><li>음성 메뉴 이동: 왼쪽 메뉴에서 <b>시간 및 언어</b> ➔ 오른쪽에서 <b>음성</b>을 클릭합니다.</li><li>음성 추가: ‘음성 관리’ 항목에 있는 <b>음성 추가</b> 버튼을 누릅니다.</li><li>베트남어 설치: 검색창에 베트남어를 검색해 선택한 후, <b>추가</b>(또는 설치) 버튼을 누르면 다운로드가 시작돼요.</li><li>기본 음성 설정: 다운로드가 끝나면 상단의 ‘음성 선택’ 드롭다운 메뉴에서 설치된 베트남어 음성을 기본값으로 지정할 수 있어요.</li></ol><h4>⚙️ Windows 10에서 베트남어 TTS 추가하기</h4><ol><li>설정 열기: <b>Win + I</b> 단축키를 누릅니다.</li><li>언어 메뉴 이동: <b>시간 및 언어</b> ➔ 왼쪽의 <b>지역 및 언어</b>(또는 언어) 메뉴를 클릭합니다.</li><li>기본 설정 언어 추가: ‘기본 설정 언어’ 아래의 <b>언어 추가</b>를 클릭합니다.</li><li>베트남어 팩 선택: 베트남어(Tiếng Việt)를 검색하여 선택합니다. 이때 반드시 TTS 아이콘(마이크·말풍선 모양)이 포함되어 있는지 확인하고 ‘다음’을 누릅니다.</li><li>TTS 기능 설치: 기본 기능인 ‘텍스트 음성 변환(TTS)’이 체크된 상태로 <b>설치</b>를 누르면 완료돼요.</li></ol><h4>💡 설치 후 팁 및 확인 사항</h4><div class=\"tts-tip\">설정 반영: 음성 팩 설치를 마친 후에는 사용 중이던 텍스트 리더 프로그램이나 설정 앱을 종료 후 다시 실행해야 베트남어 음성이 정상적으로 표시돼요.</div><div class=\"tts-tip\">간편하게 읽기 실행: 윈도우 기본 돋보기 기능(Win + +)을 켜고 Ctrl + Alt + 마우스 좌클릭을 활용하면 원하는 베트남어 텍스트를 바로 TTS 음성으로 들을 수 있어요. 다만 아쉽게도 윈도우에서 지원하는 “자연스러운 음성” 목록에는 베트남어가 없어서, 윈도우를 사용할 경우 베트남어 TTS 음성이 좀 부자연스럽게 느껴질 수 있어요.</div>": {"zh_cn": "<h4>Ã¢ÂÂÃ¯Â¸Â Ã¥ÂÂ¨ Windows 11 Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­ TTS Ã¨Â¯Â­Ã©ÂÂ³</h4><ol><li>Ã¥Â¼ÂÃ¥ÂÂ¯Ã¨Â®Â¾Ã¥Â®ÂÃ¯Â¼ÂÃ¥ÂÂ¨Ã©ÂÂ®Ã§ÂÂÃ¤Â¸ÂÃ¦ÂÂÃ¤Â¸Â <b>Win + I</b> Ã¥Â¿Â«Ã¦ÂÂ·Ã©ÂÂ®Ã£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾ÂÃ¨Â¯Â­Ã©ÂÂ³Ã©ÂÂÃ¥ÂÂÃ¯Â¼ÂÃ¥ÂÂ¨Ã¥Â·Â¦Ã¥ÂÂ´Ã©ÂÂÃ¥ÂÂÃ§ÂÂ¹Ã©ÂÂ <b>Ã¦ÂÂ¶Ã©ÂÂ´Ã¤Â¸ÂÃ¨Â¯Â­Ã¨Â¨Â</b> Ã¢ÂÂ Ã¥ÂÂÃ¤ÂºÂÃ¥ÂÂ³Ã¥ÂÂ´Ã§ÂÂ¹Ã©ÂÂ <b>Ã¨Â¯Â­Ã©ÂÂ³</b>Ã£ÂÂ</li><li>Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¯Â­Ã©ÂÂ³Ã¯Â¼ÂÃ¥ÂÂ¨Ã¢ÂÂÃ¨Â¯Â­Ã©ÂÂ³Ã§Â®Â¡Ã§ÂÂÃ¢ÂÂÃ©Â¡Â¹Ã§ÂÂ®Ã¤Â¸Â­Ã¦ÂÂÃ¤Â¸Â <b>Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¯Â­Ã©ÂÂ³</b> Ã¦ÂÂÃ©ÂÂ®Ã£ÂÂ</li><li>Ã¥Â®ÂÃ¨Â£ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¯Â¼ÂÃ¥ÂÂ¨Ã¦ÂÂÃ¥Â¯Â»Ã¦Â ÂÃ¦ÂÂÃ¥Â¯Â»Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¥Â¹Â¶Ã©ÂÂÃ¥ÂÂÃ¥ÂÂÃ¯Â¼ÂÃ¦ÂÂÃ¤Â¸Â <b>Ã¦ÂÂ°Ã¥Â¢Â</b>Ã¯Â¼ÂÃ¦ÂÂÃ¥Â®ÂÃ¨Â£ÂÃ¯Â¼ÂÃ¦ÂÂÃ©ÂÂ®Ã¥ÂÂ³Ã¥ÂÂ¯Ã¥Â¼ÂÃ¥Â§ÂÃ¤Â¸ÂÃ¨Â½Â½Ã£ÂÂ</li><li>Ã¨Â®Â¾Ã¥Â®ÂÃ¤Â¸ÂºÃ©Â¢ÂÃ¨Â®Â¾Ã¨Â¯Â­Ã©ÂÂ³Ã¯Â¼ÂÃ¤Â¸ÂÃ¨Â½Â½Ã¥Â®ÂÃ¦ÂÂÃ¥ÂÂÃ¯Â¼ÂÃ¥ÂÂ¯Ã¥ÂÂ¨Ã¤Â¸ÂÃ¦ÂÂ¹Ã¢ÂÂÃ©ÂÂÃ¦ÂÂ©Ã¨Â¯Â­Ã©ÂÂ³Ã¢ÂÂÃ¤Â¸ÂÃ¦ÂÂÃ©ÂÂÃ¥ÂÂÃ¤Â¸Â­Ã¯Â¼ÂÃ¥Â°ÂÃ¥Â·Â²Ã¥Â®ÂÃ¨Â£ÂÃ§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¨Â¯Â­Ã©ÂÂ³Ã¨Â®Â¾Ã¤Â¸ÂºÃ©Â¢ÂÃ¨Â®Â¾Ã¥ÂÂ¼Ã£ÂÂ</li></ol><h4>Ã¢ÂÂÃ¯Â¸Â Ã¥ÂÂ¨ Windows 10 Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­ TTS Ã¨Â¯Â­Ã©ÂÂ³</h4><ol><li>Ã¥Â¼ÂÃ¥ÂÂ¯Ã¨Â®Â¾Ã¥Â®ÂÃ¯Â¼ÂÃ¦ÂÂÃ¤Â¸Â <b>Win + I</b> Ã¥Â¿Â«Ã¦ÂÂ·Ã©ÂÂ®Ã£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾ÂÃ¨Â¯Â­Ã¨Â¨ÂÃ©ÂÂÃ¥ÂÂÃ¯Â¼ÂÃ§ÂÂ¹Ã©ÂÂ <b>Ã¦ÂÂ¶Ã©ÂÂ´Ã¤Â¸ÂÃ¨Â¯Â­Ã¨Â¨Â</b> Ã¢ÂÂ Ã¥Â·Â¦Ã¥ÂÂ´Ã§ÂÂ <b>Ã¥ÂÂ°Ã¥ÂÂºÃ¤Â¸ÂÃ¨Â¯Â­Ã¨Â¨Â</b>Ã¯Â¼ÂÃ¦ÂÂÃ¨Â¯Â­Ã¨Â¨ÂÃ¯Â¼ÂÃ©ÂÂÃ¥ÂÂÃ£ÂÂ</li><li>Ã¦ÂÂ°Ã¥Â¢ÂÃ¦ÂÂ¯Ã§ÂÂ¨Ã¨Â¯Â­Ã¨Â¨ÂÃ¯Â¼ÂÃ¥ÂÂ¨Ã¢ÂÂÃ¦ÂÂ¯Ã§ÂÂ¨Ã¨Â¯Â­Ã¨Â¨ÂÃ¢ÂÂÃ¤Â¸ÂÃ¦ÂÂ¹Ã§ÂÂ¹Ã©ÂÂ <b>Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¯Â­Ã¨Â¨Â</b>Ã£ÂÂ</li><li>Ã©ÂÂÃ¦ÂÂ©Ã¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¨Â¯Â­Ã¨Â¨ÂÃ¥Â¥ÂÃ¤Â»Â¶Ã¯Â¼ÂÃ¦ÂÂÃ¥Â¯Â»Ã¥Â¹Â¶Ã©ÂÂÃ¥ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¯Â¼ÂTiÃ¡ÂºÂ¿ng ViÃ¡Â»ÂtÃ¯Â¼ÂÃ£ÂÂÃ¦Â­Â¤Ã¦ÂÂ¶Ã¨Â¯Â·Ã¥ÂÂ¡Ã¥Â¿ÂÃ§Â¡Â®Ã¨Â®Â¤Ã¥Â·Â²Ã¥ÂÂÃ¥ÂÂ« TTS Ã¥ÂÂ¾Ã§Â¤ÂºÃ¯Â¼ÂÃ©ÂºÂ¥Ã¥ÂÂÃ©Â£ÂÃ¢ÂÂ§Ã¨Â¯Â­Ã©ÂÂ³Ã¦Â¡ÂÃ¥ÂÂ¾Ã¦Â¡ÂÃ¯Â¼ÂÃ¯Â¼ÂÃ¥ÂÂÃ¦ÂÂÃ¤Â¸ÂÃ¢ÂÂÃ¤Â¸ÂÃ¤Â¸ÂÃ¦Â­Â¥Ã¢ÂÂÃ£ÂÂ</li><li>Ã¥Â®ÂÃ¨Â£Â TTS Ã¥ÂÂÃ¨ÂÂ½Ã¯Â¼ÂÃ¥ÂÂ¨Ã©Â¢ÂÃ¨Â®Â¾Ã¥ÂÂ¾Ã©ÂÂÃ¢ÂÂÃ¦ÂÂÃ¥Â­ÂÃ¨Â½Â¬Ã¨Â¯Â­Ã©ÂÂ³Ã¯Â¼ÂTTSÃ¯Â¼ÂÃ¢ÂÂÃ¥ÂÂÃ¨ÂÂ½Ã§ÂÂÃ§ÂÂ¶Ã¦ÂÂÃ¤Â¸ÂÃ¦ÂÂÃ¤Â¸Â <b>Ã¥Â®ÂÃ¨Â£Â</b> Ã¥ÂÂ³Ã¥Â®ÂÃ¦ÂÂÃ£ÂÂ</li></ol><h4>Ã°ÂÂÂ¡ Ã¥Â®ÂÃ¨Â£ÂÃ¥ÂÂÃ§ÂÂÃ¦ÂÂÃ§Â¤ÂºÃ¤Â¸ÂÃ§Â¡Â®Ã¨Â®Â¤Ã¤ÂºÂÃ©Â¡Â¹</h4><div class=\"tts-tip\">Ã¥Â¥ÂÃ§ÂÂ¨Ã¨Â®Â¾Ã¥Â®ÂÃ¯Â¼ÂÃ¥Â®ÂÃ¦ÂÂÃ¨Â¯Â­Ã©ÂÂ³Ã¥Â¥ÂÃ¤Â»Â¶Ã¥Â®ÂÃ¨Â£ÂÃ¥ÂÂÃ¯Â¼ÂÃ©Â¡Â»Ã¥ÂÂÃ¥ÂÂ³Ã©ÂÂ­Ã¥ÂÂÃ©ÂÂÃ¦ÂÂ°Ã¥Â¼ÂÃ¥ÂÂ¯Ã¥ÂÂÃ¦ÂÂ¬Ã¤Â½Â¿Ã§ÂÂ¨Ã¤Â¸Â­Ã§ÂÂÃ¦ÂÂÃ¥Â­ÂÃ©ÂÂÃ¨Â¯Â»Ã§Â¨ÂÃ¥Â¼ÂÃ¦ÂÂÃ¨Â®Â¾Ã¥Â®ÂÃ¥ÂºÂÃ§ÂÂ¨Ã§Â¨ÂÃ¥Â¼ÂÃ¯Â¼ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¨Â¯Â­Ã©ÂÂ³Ã¦ÂÂÃ¤Â¼ÂÃ¦Â­Â£Ã¥Â¸Â¸Ã¦ÂÂ¾Ã§Â¤ÂºÃ£ÂÂ</div><div class=\"tts-tip\">Ã¨Â½Â»Ã©Â¬ÂÃ¦ÂÂÃ¨Â¯Â»Ã¯Â¼ÂÃ¥Â¼ÂÃ¥ÂÂ¯ Windows Ã¥ÂÂÃ¥Â»ÂºÃ§ÂÂÃ¦ÂÂ¾Ã¥Â¤Â§Ã©ÂÂ¡Ã¥ÂÂÃ¨ÂÂ½Ã¯Â¼ÂWin + +Ã¯Â¼ÂÃ¯Â¼ÂÃ¥Â¹Â¶Ã¦ÂÂ­Ã©ÂÂ Ctrl + Alt + Ã¦Â»ÂÃ©Â¼Â Ã¥Â·Â¦Ã©ÂÂ®Ã§ÂÂ¹Ã¥ÂÂ»Ã¯Â¼ÂÃ¥ÂÂ³Ã¥ÂÂ¯Ã§Â«ÂÃ¥ÂÂ³Ã¤Â»Â¥ TTS Ã¨Â¯Â­Ã©ÂÂ³Ã¦ÂÂÃ¨Â¯Â»Ã¦ÂÂÃ©ÂÂÃ§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¦ÂÂÃ¥Â­ÂÃ£ÂÂÃ¤Â¸ÂÃ¨Â¿ÂÃ¥ÂÂ¯Ã¦ÂÂÃ§ÂÂÃ¦ÂÂ¯Ã¯Â¼ÂWindows Ã¦ÂÂ¯Ã¦ÂÂ´Ã§ÂÂÃ¢ÂÂÃ¨ÂÂªÃ§ÂÂ¶Ã¨Â¯Â­Ã©ÂÂ³Ã¢ÂÂÃ¦Â¸ÂÃ¥ÂÂÃ¤Â¸Â­Ã¥Â¹Â¶Ã¦Â²Â¡Ã¦ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­Ã¯Â¼ÂÃ¥ÂÂ Ã¦Â­Â¤Ã¥ÂÂ¨ Windows Ã¤Â¸ÂÃ¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂ¶Ã¯Â¼ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨Â¯Â­ TTS Ã¨Â¯Â­Ã©ÂÂ³Ã¥ÂÂ¯Ã¨ÂÂ½Ã¤Â¼ÂÃ¥ÂÂ¬Ã¨ÂµÂ·Ã¦ÂÂ¥Ã§ÂÂ¥Ã¦ÂÂ¾Ã¤Â¸ÂÃ¨ÂÂªÃ§ÂÂ¶Ã£ÂÂ</div>", "zh": "<h4>Ã¢ÂÂÃ¯Â¸Â Ã¥ÂÂ¨ Windows 11 Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ TTS Ã¨ÂªÂÃ©ÂÂ³</h4><ol><li>Ã©ÂÂÃ¥ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ¯Â¼ÂÃ¥ÂÂ¨Ã©ÂÂµÃ§ÂÂ¤Ã¤Â¸ÂÃ¦ÂÂÃ¤Â¸Â <b>Win + I</b> Ã¥Â¿Â«Ã¦ÂÂ·Ã©ÂÂµÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾ÂÃ¨ÂªÂÃ©ÂÂ³Ã©ÂÂ¸Ã¥ÂÂ®Ã¯Â¼ÂÃ¥ÂÂ¨Ã¥Â·Â¦Ã¥ÂÂ´Ã©ÂÂ¸Ã¥ÂÂ®Ã©Â»ÂÃ©ÂÂ¸ <b>Ã¦ÂÂÃ©ÂÂÃ¨ÂÂÃ¨ÂªÂÃ¨Â¨Â</b> Ã¢ÂÂ Ã¥ÂÂÃ¦ÂÂ¼Ã¥ÂÂ³Ã¥ÂÂ´Ã©Â»ÂÃ©ÂÂ¸ <b>Ã¨ÂªÂÃ©ÂÂ³</b>Ã£ÂÂ</li><li>Ã¦ÂÂ°Ã¥Â¢ÂÃ¨ÂªÂÃ©ÂÂ³Ã¯Â¼ÂÃ¥ÂÂ¨Ã¢ÂÂÃ¨ÂªÂÃ©ÂÂ³Ã§Â®Â¡Ã§ÂÂÃ¢ÂÂÃ©Â ÂÃ§ÂÂ®Ã¤Â¸Â­Ã¦ÂÂÃ¤Â¸Â <b>Ã¦ÂÂ°Ã¥Â¢ÂÃ¨ÂªÂÃ©ÂÂ³</b> Ã¦ÂÂÃ©ÂÂÃ£ÂÂ</li><li>Ã¥Â®ÂÃ¨Â£ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¯Â¼ÂÃ¥ÂÂ¨Ã¦ÂÂÃ¥Â°ÂÃ¦Â¬ÂÃ¦ÂÂÃ¥Â°ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¤Â¸Â¦Ã©ÂÂ¸Ã¥ÂÂÃ¥Â¾ÂÃ¯Â¼ÂÃ¦ÂÂÃ¤Â¸Â <b>Ã¦ÂÂ°Ã¥Â¢Â</b>Ã¯Â¼ÂÃ¦ÂÂÃ¥Â®ÂÃ¨Â£ÂÃ¯Â¼ÂÃ¦ÂÂÃ©ÂÂÃ¥ÂÂ³Ã¥ÂÂ¯Ã©ÂÂÃ¥Â§ÂÃ¤Â¸ÂÃ¨Â¼ÂÃ£ÂÂ</li><li>Ã¨Â¨Â­Ã¥Â®ÂÃ§ÂÂºÃ©Â ÂÃ¨Â¨Â­Ã¨ÂªÂÃ©ÂÂ³Ã¯Â¼ÂÃ¤Â¸ÂÃ¨Â¼ÂÃ¥Â®ÂÃ¦ÂÂÃ¥Â¾ÂÃ¯Â¼ÂÃ¥ÂÂ¯Ã¥ÂÂ¨Ã¤Â¸ÂÃ¦ÂÂ¹Ã¢ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ¨ÂªÂÃ©ÂÂ³Ã¢ÂÂÃ¤Â¸ÂÃ¦ÂÂÃ©ÂÂ¸Ã¥ÂÂ®Ã¤Â¸Â­Ã¯Â¼ÂÃ¥Â°ÂÃ¥Â·Â²Ã¥Â®ÂÃ¨Â£ÂÃ§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¨ÂªÂÃ©ÂÂ³Ã¨Â¨Â­Ã§ÂÂºÃ©Â ÂÃ¨Â¨Â­Ã¥ÂÂ¼Ã£ÂÂ</li></ol><h4>Ã¢ÂÂÃ¯Â¸Â Ã¥ÂÂ¨ Windows 10 Ã¦ÂÂ°Ã¥Â¢ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ TTS Ã¨ÂªÂÃ©ÂÂ³</h4><ol><li>Ã©ÂÂÃ¥ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ¯Â¼ÂÃ¦ÂÂÃ¤Â¸Â <b>Win + I</b> Ã¥Â¿Â«Ã¦ÂÂ·Ã©ÂÂµÃ£ÂÂ</li><li>Ã¥ÂÂÃ¥Â¾ÂÃ¨ÂªÂÃ¨Â¨ÂÃ©ÂÂ¸Ã¥ÂÂ®Ã¯Â¼ÂÃ©Â»ÂÃ©ÂÂ¸ <b>Ã¦ÂÂÃ©ÂÂÃ¨ÂÂÃ¨ÂªÂÃ¨Â¨Â</b> Ã¢ÂÂ Ã¥Â·Â¦Ã¥ÂÂ´Ã§ÂÂ <b>Ã¥ÂÂ°Ã¥ÂÂÃ¨ÂÂÃ¨ÂªÂÃ¨Â¨Â</b>Ã¯Â¼ÂÃ¦ÂÂÃ¨ÂªÂÃ¨Â¨ÂÃ¯Â¼ÂÃ©ÂÂ¸Ã¥ÂÂ®Ã£ÂÂ</li><li>Ã¦ÂÂ°Ã¥Â¢ÂÃ¦ÂÂ£Ã§ÂÂ¨Ã¨ÂªÂÃ¨Â¨ÂÃ¯Â¼ÂÃ¥ÂÂ¨Ã¢ÂÂÃ¦ÂÂ£Ã§ÂÂ¨Ã¨ÂªÂÃ¨Â¨ÂÃ¢ÂÂÃ¤Â¸ÂÃ¦ÂÂ¹Ã©Â»ÂÃ©ÂÂ¸ <b>Ã¦ÂÂ°Ã¥Â¢ÂÃ¨ÂªÂÃ¨Â¨Â</b>Ã£ÂÂ</li><li>Ã©ÂÂ¸Ã¦ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¨ÂªÂÃ¨Â¨ÂÃ¥Â¥ÂÃ¤Â»Â¶Ã¯Â¼ÂÃ¦ÂÂÃ¥Â°ÂÃ¤Â¸Â¦Ã©ÂÂ¸Ã¥ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¯Â¼ÂTiÃ¡ÂºÂ¿ng ViÃ¡Â»ÂtÃ¯Â¼ÂÃ£ÂÂÃ¦Â­Â¤Ã¦ÂÂÃ¨Â«ÂÃ¥ÂÂÃ¥Â¿ÂÃ§Â¢ÂºÃ¨ÂªÂÃ¥Â·Â²Ã¥ÂÂÃ¥ÂÂ« TTS Ã¥ÂÂÃ§Â¤ÂºÃ¯Â¼ÂÃ©ÂºÂ¥Ã¥ÂÂÃ©Â¢Â¨Ã¢ÂÂ§Ã¨ÂªÂÃ©ÂÂ³Ã¦Â¡ÂÃ¥ÂÂÃ¦Â¡ÂÃ¯Â¼ÂÃ¯Â¼ÂÃ¥ÂÂÃ¦ÂÂÃ¤Â¸ÂÃ¢ÂÂÃ¤Â¸ÂÃ¤Â¸ÂÃ¦Â­Â¥Ã¢ÂÂÃ£ÂÂ</li><li>Ã¥Â®ÂÃ¨Â£Â TTS Ã¥ÂÂÃ¨ÂÂ½Ã¯Â¼ÂÃ¥ÂÂ¨Ã©Â ÂÃ¨Â¨Â­Ã¥ÂÂ¾Ã©ÂÂ¸Ã¢ÂÂÃ¦ÂÂÃ¥Â­ÂÃ¨Â½ÂÃ¨ÂªÂÃ©ÂÂ³Ã¯Â¼ÂTTSÃ¯Â¼ÂÃ¢ÂÂÃ¥ÂÂÃ¨ÂÂ½Ã§ÂÂÃ§ÂÂÃ¦ÂÂÃ¤Â¸ÂÃ¦ÂÂÃ¤Â¸Â <b>Ã¥Â®ÂÃ¨Â£Â</b> Ã¥ÂÂ³Ã¥Â®ÂÃ¦ÂÂÃ£ÂÂ</li></ol><h4>Ã°ÂÂÂ¡ Ã¥Â®ÂÃ¨Â£ÂÃ¥Â¾ÂÃ§ÂÂÃ¦ÂÂÃ§Â¤ÂºÃ¨ÂÂÃ§Â¢ÂºÃ¨ÂªÂÃ¤ÂºÂÃ©Â Â</h4><div class=\"tts-tip\">Ã¥Â¥ÂÃ§ÂÂ¨Ã¨Â¨Â­Ã¥Â®ÂÃ¯Â¼ÂÃ¥Â®ÂÃ¦ÂÂÃ¨ÂªÂÃ©ÂÂ³Ã¥Â¥ÂÃ¤Â»Â¶Ã¥Â®ÂÃ¨Â£ÂÃ¥Â¾ÂÃ¯Â¼ÂÃ©Â ÂÃ¥ÂÂÃ©ÂÂÃ©ÂÂÃ¥ÂÂÃ©ÂÂÃ¦ÂÂ°Ã©ÂÂÃ¥ÂÂÃ¥ÂÂÃ¦ÂÂ¬Ã¤Â½Â¿Ã§ÂÂ¨Ã¤Â¸Â­Ã§ÂÂÃ¦ÂÂÃ¥Â­ÂÃ©ÂÂ±Ã¨Â®ÂÃ§Â¨ÂÃ¥Â¼ÂÃ¦ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ¦ÂÂÃ§ÂÂ¨Ã§Â¨ÂÃ¥Â¼ÂÃ¯Â¼ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¨ÂªÂÃ©ÂÂ³Ã¦ÂÂÃ¦ÂÂÃ¦Â­Â£Ã¥Â¸Â¸Ã©Â¡Â¯Ã§Â¤ÂºÃ£ÂÂ</div><div class=\"tts-tip\">Ã¨Â¼ÂÃ©Â¬ÂÃ¦ÂÂÃ¨Â®ÂÃ¯Â¼ÂÃ©ÂÂÃ¥ÂÂ Windows Ã¥ÂÂ§Ã¥Â»ÂºÃ§ÂÂÃ¦ÂÂ¾Ã¥Â¤Â§Ã©ÂÂ¡Ã¥ÂÂÃ¨ÂÂ½Ã¯Â¼ÂWin + +Ã¯Â¼ÂÃ¯Â¼ÂÃ¤Â¸Â¦Ã¦ÂÂ­Ã©ÂÂ Ctrl + Alt + Ã¦Â»ÂÃ©Â¼Â Ã¥Â·Â¦Ã©ÂÂµÃ©Â»ÂÃ¦ÂÂÃ¯Â¼ÂÃ¥ÂÂ³Ã¥ÂÂ¯Ã§Â«ÂÃ¥ÂÂ³Ã¤Â»Â¥ TTS Ã¨ÂªÂÃ©ÂÂ³Ã¦ÂÂÃ¨Â®ÂÃ¦ÂÂÃ©ÂÂ¸Ã§ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¦ÂÂÃ¥Â­ÂÃ£ÂÂÃ¤Â¸ÂÃ©ÂÂÃ¥ÂÂ¯Ã¦ÂÂÃ§ÂÂÃ¦ÂÂ¯Ã¯Â¼ÂWindows Ã¦ÂÂ¯Ã¦ÂÂ´Ã§ÂÂÃ¢ÂÂÃ¨ÂÂªÃ§ÂÂ¶Ã¨ÂªÂÃ©ÂÂ³Ã¢ÂÂÃ¦Â¸ÂÃ¥ÂÂ®Ã¤Â¸Â­Ã¤Â¸Â¦Ã¦Â²ÂÃ¦ÂÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂÃ¯Â¼ÂÃ¥ÂÂ Ã¦Â­Â¤Ã¥ÂÂ¨ Windows Ã¤Â¸ÂÃ¤Â½Â¿Ã§ÂÂ¨Ã¦ÂÂÃ¯Â¼ÂÃ¨Â¶ÂÃ¥ÂÂÃ¨ÂªÂ TTS Ã¨ÂªÂÃ©ÂÂ³Ã¥ÂÂ¯Ã¨ÂÂ½Ã¦ÂÂÃ¨ÂÂ½Ã¨ÂµÂ·Ã¤Â¾ÂÃ§ÂÂ¥Ã©Â¡Â¯Ã¤Â¸ÂÃ¨ÂÂªÃ§ÂÂ¶Ã£ÂÂ</div>", "en": "<h4>Ã¢ÂÂÃ¯Â¸Â Adding Vietnamese TTS Voices in Windows 11</h4><ol><li>Open Settings: Press <b>Win + I</b> on your keyboard.</li><li>Go to the Speech menu: In the left menu, click <b>Time & language</b> Ã¢ÂÂ then click <b>Speech</b> on the right.</li><li>Add a voice: Under Ã¢ÂÂManage voices,Ã¢ÂÂ click the <b>Add voices</b> button.</li><li>Install Vietnamese: Search for Vietnamese in the search box, select it, then click <b>Add</b> (or Install) to start the download.</li><li>Set the default voice: Once the download finishes, you can set the installed Vietnamese voice as the default in the Ã¢ÂÂChoose a voiceÃ¢ÂÂ dropdown menu at the top.</li></ol><h4>Ã¢ÂÂÃ¯Â¸Â Adding Vietnamese TTS Voices in Windows 10</h4><ol><li>Open Settings: Press <b>Win + I</b>.</li><li>Go to the language menu: Click <b>Time & language</b> Ã¢ÂÂ then <b>Region & language</b> (or Language) on the left.</li><li>Add a preferred language: Under Ã¢ÂÂPreferred languages,Ã¢ÂÂ click <b>Add a language</b>.</li><li>Choose the Vietnamese language pack: Search for and select Vietnamese (TiÃ¡ÂºÂ¿ng ViÃ¡Â»Ât). Make sure the TTS icon (a microphone/speech-bubble icon) is included, then click Ã¢ÂÂNext.Ã¢ÂÂ</li><li>Install the TTS feature: With the default Ã¢ÂÂText-to-SpeechÃ¢ÂÂ feature checked, click <b>Install</b> to finish.</li></ol><h4>Ã°ÂÂÂ¡ Tips and Things to Check After Installation</h4><div class=\"tts-tip\">Apply the settings: After installing a voice pack, close and reopen whatever text-reader program or Settings app you were using Ã¢ÂÂ the Vietnamese voice will only show up correctly after that.</div><div class=\"tts-tip\">Quick reading shortcut: Turn on WindowsÃ¢ÂÂ built-in Magnifier (Win + +), then hold Ctrl + Alt and left-click your mouse to instantly hear the selected Vietnamese text read aloud in TTS. Unfortunately, Vietnamese isnÃ¢ÂÂt included in the Ã¢ÂÂNatural voicesÃ¢ÂÂ list Windows supports, so Vietnamese TTS voices on Windows may sound a bit less natural.</div>", "fr": "<h4>⚙️ Ajouter la synthèse vocale vietnamienne sous Windows 11</h4><ol><li>Ouvrez les Paramètres : appuyez sur <b>Win + I</b>.</li><li>Allez dans <b>Heure et langue</b> ➔ <b>Voix</b>.</li><li>Sous « Gérer les voix », cliquez sur <b>Ajouter des voix</b>.</li><li>Recherchez le vietnamien et cliquez sur <b>Ajouter</b>.</li><li>Définissez la voix par défaut dans le menu déroulant en haut.</li></ol><h4>⚙️ Ajouter la synthèse vocale vietnamienne sous Windows 10</h4><ol><li>Appuyez sur <b>Win + I</b>.</li><li>Allez dans <b>Heure et langue</b> ➔ <b>Région et langue</b>.</li><li>Cliquez sur <b>Ajouter une langue</b> sous « Langues préférées ».</li><li>Sélectionnez le vietnamien (avec l'icône TTS) et installez-le.</li></ol>", "de": "<h4>Ã¢ÂÂÃ¯Â¸Â Vietnamesische TTS unter Windows 11 hinzufÃÂ¼gen</h4><ol><li>Einstellungen ÃÂ¶ffnen: DrÃÂ¼cken Sie <b>Win + I</b>.</li><li>Zum SprachmenÃÂ¼: Klicken Sie auf <b>Zeit und Sprache</b> Ã¢ÂÂ <b>Sprachausgabe</b>.</li><li>Stimme hinzufÃÂ¼gen: Klicken Sie unter Ã¢ÂÂStimmen verwaltenÃ¢ÂÂ auf <b>Stimmen hinzufÃÂ¼gen</b>.</li><li>Vietnamesisch installieren: Suchen Sie nach Vietnamesisch und klicken Sie auf <b>HinzufÃÂ¼gen</b>.</li><li>Standardstimme festlegen: WÃÂ¤hlen Sie oben die installierte vietnamesische Stimme aus.</li></ol><h4>Ã¢ÂÂÃ¯Â¸Â Vietnamesische TTS unter Windows 10 hinzufÃÂ¼gen</h4><ol><li>Einstellungen ÃÂ¶ffnen: DrÃÂ¼cken Sie <b>Win + I</b>.</li><li>Klicken Sie auf <b>Zeit und Sprache</b> Ã¢ÂÂ <b>Region und Sprache</b>.</li><li>Klicken Sie unter Ã¢ÂÂBevorzugte SprachenÃ¢ÂÂ auf <b>Sprache hinzufÃÂ¼gen</b>.</li><li>WÃÂ¤hlen Sie Vietnamesisch (mit TTS-Symbol) aus und klicken Sie auf <b>Installieren</b>.</li></ol><h4>Ã°ÂÂÂ¡ Hinweise nach der Installation</h4><div class=\"tts-tip\">Einstellungen ÃÂ¼bernehmen: Starten Sie den Browser oder die Sprach-App nach der Installation neu.</div><div class=\"tts-tip\">Schnellvorlesefunktion: Mit der Windows-Bildschirmlupe (Win + +) und Strg + Alt + Linksklick kÃÂ¶nnen Sie markierten Text direkt vorlesen lassen.</div>", "ja": "<h4>Ã¢ÂÂÃ¯Â¸Â Windows 11Ã£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®TTSÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã£ÂÂÃ£ÂÂ</h4><ol><li>Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂÃ©ÂÂÃ£ÂÂÃ¯Â¼ÂÃ£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂÃ£ÂÂ§ <b>Win + I</b> Ã£ÂÂÃ¦ÂÂ¼Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ¸Ã§Â§Â»Ã¥ÂÂÃ¯Â¼ÂÃ¥Â·Â¦Ã¥ÂÂ´Ã£ÂÂ®Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ§ <b>Ã¦ÂÂÃ¥ÂÂ»Ã£ÂÂ¨Ã¨Â¨ÂÃ¨ÂªÂ</b> Ã¢ÂÂ Ã¥ÂÂ³Ã¥ÂÂ´Ã£ÂÂ® <b>Ã©ÂÂ³Ã¥Â£Â°</b> Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã¯Â¼ÂÃ¢ÂÂÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂ®Ã§Â®Â¡Ã§ÂÂÃ¢ÂÂÃ©Â ÂÃ§ÂÂ®Ã£ÂÂ«Ã£ÂÂÃ£ÂÂ <b>Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂ®Ã¨Â¿Â½Ã¥ÂÂ </b> Ã£ÂÂÃ£ÂÂ¿Ã£ÂÂ³Ã£ÂÂÃ¦ÂÂ¼Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã¯Â¼ÂÃ¦Â¤ÂÃ§Â´Â¢Ã¦Â¬ÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ¦Â¤ÂÃ§Â´Â¢Ã£ÂÂÃ£ÂÂ¦Ã©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂÃ¥Â¾ÂÃ£ÂÂ<b>Ã¨Â¿Â½Ã¥ÂÂ </b>Ã¯Â¼ÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã¯Â¼ÂÃ£ÂÂÃ£ÂÂ¿Ã£ÂÂ³Ã£ÂÂÃ¦ÂÂ¼Ã£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ¥Â§ÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¦ÂÂ¢Ã¥Â®ÂÃ£ÂÂ®Ã©ÂÂ³Ã¥Â£Â°Ã£ÂÂ«Ã¨Â¨Â­Ã¥Â®ÂÃ¯Â¼ÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ­Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ¥Â®ÂÃ¤ÂºÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ¤Â¸ÂÃ©ÂÂ¨Ã£ÂÂ®Ã¢ÂÂÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ¢ÂÂÃ£ÂÂÃ£ÂÂ­Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ³Ã£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ§Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ¦ÂÂ¢Ã¥Â®ÂÃ£ÂÂ«Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li></ol><h4>Ã¢ÂÂÃ¯Â¸Â Windows 10Ã£ÂÂ§Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®TTSÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã£ÂÂÃ£ÂÂ</h4><ol><li>Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂÃ©ÂÂÃ£ÂÂÃ¯Â¼Â<b>Win + I</b> Ã£ÂÂÃ¦ÂÂ¼Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¨Â¨ÂÃ¨ÂªÂÃ£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂ¸Ã§Â§Â»Ã¥ÂÂÃ¯Â¼Â<b>Ã¦ÂÂÃ¥ÂÂ»Ã£ÂÂ¨Ã¨Â¨ÂÃ¨ÂªÂ</b> Ã¢ÂÂ Ã¥Â·Â¦Ã¥ÂÂ´Ã£ÂÂ® <b>Ã¥ÂÂ°Ã¥ÂÂÃ£ÂÂ¨Ã¨Â¨ÂÃ¨ÂªÂ</b>Ã¯Â¼ÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ¯Ã¨Â¨ÂÃ¨ÂªÂÃ¯Â¼ÂÃ£ÂÂ¡Ã£ÂÂÃ£ÂÂ¥Ã£ÂÂ¼Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã¥ÂÂªÃ¥ÂÂÃ£ÂÂÃ£ÂÂÃ¨Â¨ÂÃ¨ÂªÂÃ£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã¯Â¼ÂÃ¢ÂÂÃ¥ÂÂªÃ¥ÂÂÃ£ÂÂÃ£ÂÂÃ¨Â¨ÂÃ¨ÂªÂÃ¢ÂÂÃ£ÂÂ®Ã¤Â¸ÂÃ£ÂÂ«Ã£ÂÂÃ£ÂÂ <b>Ã¨Â¨ÂÃ¨ÂªÂÃ£ÂÂÃ¨Â¿Â½Ã¥ÂÂ Ã£ÂÂÃ£ÂÂ</b> Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ¯Â¼ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ¯Â¼ÂTiÃ¡ÂºÂ¿ng ViÃ¡Â»ÂtÃ¯Â¼ÂÃ£ÂÂÃ¦Â¤ÂÃ§Â´Â¢Ã£ÂÂÃ£ÂÂ¦Ã©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ®Ã©ÂÂÃ£ÂÂÃ¥Â¿ÂÃ£ÂÂTTSÃ£ÂÂ¢Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ³Ã¯Â¼ÂÃ£ÂÂÃ£ÂÂ¤Ã£ÂÂ¯Ã£ÂÂ»Ã¥ÂÂ¹Ã£ÂÂÃ¥ÂÂºÃ£ÂÂÃ£ÂÂ®Ã¥Â½Â¢Ã¯Â¼ÂÃ£ÂÂÃ¥ÂÂ«Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ§Â¢ÂºÃ¨ÂªÂÃ£ÂÂÃ£ÂÂÃ¢ÂÂÃ¦Â¬Â¡Ã£ÂÂ¸Ã¢ÂÂÃ£ÂÂÃ¦ÂÂ¼Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</li><li>TTSÃ¦Â©ÂÃ¨ÂÂ½Ã£ÂÂÃ£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã¯Â¼ÂÃ¦ÂÂ¢Ã¥Â®ÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂÃ¢ÂÂÃ©ÂÂ³Ã¥Â£Â°Ã¥ÂÂÃ¦ÂÂ(TTS)Ã¢ÂÂÃ¦Â©ÂÃ¨ÂÂ½Ã£ÂÂÃ£ÂÂÃ£ÂÂ®Ã£ÂÂ¾Ã£ÂÂ¾Ã£ÂÂ« <b>Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«</b> Ã£ÂÂÃ¦ÂÂ¼Ã£ÂÂÃ£ÂÂ°Ã¥Â®ÂÃ¤ÂºÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ</li></ol><h4>Ã°ÂÂÂ¡ Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã¥Â¾ÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ³Ã£ÂÂÃ£ÂÂ¨Ã§Â¢ÂºÃ¨ÂªÂÃ¤ÂºÂÃ©Â Â</h4><div class=\"tts-tip\">Ã¨Â¨Â­Ã¥Â®ÂÃ£ÂÂ®Ã¥ÂÂÃ¦ÂÂ Ã¯Â¼ÂÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂ®Ã£ÂÂ¤Ã£ÂÂ³Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂ¼Ã£ÂÂ«Ã£ÂÂÃ¥Â®ÂÃ¤ÂºÂÃ£ÂÂÃ£ÂÂÃ¥Â¾ÂÃ£ÂÂ¯Ã£ÂÂÃ¤Â½Â¿Ã§ÂÂ¨Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ­Ã£ÂÂ°Ã£ÂÂ©Ã£ÂÂ Ã£ÂÂÃ¨Â¨Â­Ã¥Â®ÂÃ£ÂÂ¢Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ¤Â¸ÂÃ¥ÂºÂ¦Ã§ÂµÂÃ¤ÂºÂÃ£ÂÂÃ£ÂÂ¦Ã¥ÂÂÃ¨ÂµÂ·Ã¥ÂÂÃ£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ¦Â­Â£Ã£ÂÂÃ£ÂÂÃ¨Â¡Â¨Ã§Â¤ÂºÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂÃ£ÂÂ</div><div class=\"tts-tip\">Ã¦ÂÂÃ¨Â»Â½Ã£ÂÂ«Ã¨ÂªÂ­Ã£ÂÂ¿Ã¤Â¸ÂÃ£ÂÂÃ£ÂÂÃ¯Â¼ÂWindowsÃ¦Â¨ÂÃ¦ÂºÂÃ£ÂÂ®Ã¦ÂÂ¡Ã¥Â¤Â§Ã©ÂÂ¡Ã¦Â©ÂÃ¨ÂÂ½Ã¯Â¼ÂWin + +Ã¯Â¼ÂÃ£ÂÂÃ£ÂÂªÃ£ÂÂ³Ã£ÂÂ«Ã£ÂÂÃ£ÂÂCtrl + Alt Ã£ÂÂÃ¦ÂÂ¼Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¦Ã£ÂÂ¹Ã£ÂÂ§Ã¥Â·Â¦Ã£ÂÂ¯Ã£ÂÂªÃ£ÂÂÃ£ÂÂ¯Ã£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ©ÂÂ¸Ã¦ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®Ã£ÂÂÃ£ÂÂ­Ã£ÂÂ¹Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ«TTSÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂ§Ã¨ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂ§Ã£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã£ÂÂÃ¦Â®ÂÃ¥Â¿ÂµÃ£ÂÂªÃ£ÂÂÃ£ÂÂÃ£ÂÂWindowsÃ£ÂÂÃ£ÂÂµÃ£ÂÂÃ£ÂÂ¼Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ¢ÂÂÃ¨ÂÂªÃ§ÂÂ¶Ã£ÂÂªÃ©ÂÂ³Ã¥Â£Â°Ã¢ÂÂÃ£ÂÂªÃ£ÂÂ¹Ã£ÂÂÃ£ÂÂ«Ã£ÂÂ¯Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂÃ¥ÂÂ«Ã£ÂÂ¾Ã£ÂÂÃ£ÂÂ¦Ã£ÂÂÃ£ÂÂªÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂWindowsÃ¤Â¸ÂÃ£ÂÂ§Ã£ÂÂ¯Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ Ã¨ÂªÂÃ£ÂÂ®TTSÃ©ÂÂ³Ã¥Â£Â°Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ¤Â¸ÂÃ¨ÂÂªÃ§ÂÂ¶Ã£ÂÂ«Ã¨ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¨Ã£ÂÂÃ£ÂÂÃ£ÂÂÃ£ÂÂ¾Ã£ÂÂÃ£ÂÂ</div>", "pl": "<h4>⚙️ Dodawanie głosu wietnamskiego w systemie Windows</h4><ol><li>Naciśnij <b>Win + I</b>, aby otworzyć Ustawienia.</li><li>Przejdź do <b>Czas i język</b> ➔ <b>Mowa</b>.</li><li>W sekcji „Zarządzaj głosami” kliknij <b>Dodaj głosy</b> i wyszukaj język wietnamski.</li><li>Po zainstalowaniu wybierz pobrany głos jako domyślny.</li></ol>"},
    "발음 듣기 목소리": {"cs": "Hlas pro výslovnost", "zh_cn": "发音语音设定", "zh": "發音語音設定", "en": "Pronunciation Playback Voice", "fr": "Voix pour la prononciation", "de": "Stimme für Aussprache", "hu": "Kiejtés felolvasó hangja", "id": "Suara Pelafalan", "ja": "発音再生の音声", "pl": "Głos do odtwarzania wymowy"},
    "베트남어를 읽어줄 목소리를 3종류 중에서 고를 수 있어요: 북부 베트남어, 남부 베트남어, 현재 언어 모드(한국어·中文·English·日本語)의 TTS. 지금 실제로 사용할 지역은 아래 북부/남부 토글로 골라요.": {"zh_cn": "可以从3种语音中选择朗读越南语的声音：北部越南语、南部越南语，以及目前语言模式（한국어·中文·English·日本语）的TTS。实际要使用的地区请在下方的北部/南部切换钮中选择。", "zh": "可以從3種語音中選擇朗讀越南語的聲音：北部越南語、南部越南語，以及目前語言模式（한국어·中文·English·日本語）的TTS。實際要使用的地區請在下方的北部/南部切換鈕中選擇。", "en": "You can choose from 3 kinds of voice to read Vietnamese: Northern Vietnamese, Southern Vietnamese, and the TTS of the current language mode (한국어·中文·English·日本語). Pick which region is actually used with the North/South toggle below.", "fr": "Vous pouvez choisir parmi 3 types de voix : vietnamien du Nord, vietnamien du Sud, et la voix TTS de la langue de l'interface. La région active se sélectionne avec le bouton Nord/Sud.", "de": "Sie können zwischen 3 Stimmenarten wählen: Nord-Vietnamesisch, Süd-Vietnamesisch und die TTS-Stimme des aktuellen Sprachmodus (Koreanisch/Chinesisch/Englisch/Japanisch/Deutsch). Die aktuell verwendete Region wählen Sie mit dem Nord/Süd-Schalter.", "ja": "ベトナム語を読み上げる声を3種類から選べます：北部ベトナム語、南部ベトナム語、現在の言語モード（한국어·中文·English·日本語）のTTS。実際に使う地域は下の北部/南部トグルで選びます。", "pl": "Możesz wybrać spośród 3 rodzajów głosów: wietnamski północny, wietnamski południowy oraz syntezator mowy w języku interfejsu. Aktywny region wybiera się przełącznikiem Północ/Południe."},
    "지금 사용할 지역": {"cs": "Aktuálně používaná oblast", "zh_cn": "目前使用的地区", "zh": "目前使用的地區", "en": "Region in use now", "fr": "Région actuellement utilisée", "de": "Aktuell verwendete Region", "hu": "Jelenleg használt régió", "id": "Wilayah yang digunakan saat ini", "ja": "現在使用する地域", "pl": "Aktualnie używany region"},
    "언어 모드": {"cs": "Jazykový režim", "zh_cn": "语言模式", "zh": "語言模式", "en": "Language mode", "fr": "Langue de l'interface", "de": "Sprachmodus", "hu": "Nyelvi mód", "id": "Mode Bahasa", "ja": "言語モード", "pl": "Język interfejsu"},
    "기기별 베트남어 음성(TTS) 추가 방법": {"cs": "Jak přidat vietnamský hlas (TTS) podle zařízení", "zh_cn": "各装置新增越南语语音（TTS）的方法", "zh": "各裝置新增越南語語音（TTS）的方法", "en": "How to Add Vietnamese Voices (TTS) by Device", "fr": "Comment ajouter des voix vietnamiennes (TTS) par appareil", "de": "Vietnamesische Sprachausgabe (TTS) auf Geräten hinzufügen", "hu": "Vietnámi hang (TTS) hozzáadása eszközönként", "id": "Cara Menambahkan Suara Vietnam (TTS) per Perangkat", "ja": "機器別ベトナム語音声（TTS）の追加方法", "pl": "Jak dodać głosy wietnamskie (TTS) na urządzeniach"},
    "이 학습반 화면의 발음 듣기 버튼은 기기·브라우저에 이미 설치된 베트남어 음성을 사용해요. 아래 기기별 안내를 따라 베트남어 음성을 미리 설치해 두면, 이 화면뿐 아니라 휴대폰·컴퓨터의 다른 앱에서도 베트남어 텍스트를 원어민 발음으로 들을 수 있어요. 항목을 눌러 펼쳐 보세요.": {"cs": "Tlačítko poslechu výslovnosti na této obrazovce používá vietnamský hlas nainstalovaný ve vašem zařízení nebo prohlížeči. Postupujte podle níže uvedených pokynů pro jednotlivá zařízení a nainstalujte si vietnamský hlas předem. Klepnutím rozbalte jednotlivé položky.", "zh_cn": "本学习班画面上的发音播放按钮，使用的是装置或浏览器中已安装的越南语语音。依照下方各装置的说明事先安装越南语语音后，不只在这个画面，在手机、电脑的其他应用程式中也能以母语人士发音听到越南语文字。点选项目即可展开查看。", "zh": "本學習班畫面上的發音播放按鈕，使用的是裝置或瀏覽器中已安裝的越南語語音。依照下方各裝置的說明事先安裝越南語語音後，不只在這個畫面，在手機、電腦的其他應用程式中也能以母語人士發音聽到越南語文字。點選項目即可展開查看。", "en": "The pronunciation playback button on this class screen uses a Vietnamese voice already installed on your device or browser. If you install a Vietnamese voice ahead of time by following the device-specific guides below, you'll be able to hear Vietnamese text read in a native voice not only here, but also in other apps on your phone or computer. Tap an item to expand it.", "fr": "Les boutons d'écoute utilisent les voix vietnamiennes installées sur votre appareil ou votre navigateur. Suivez les instructions ci-dessous pour installer une voix afin de profiter d'une prononciation naturelle partout.", "de": "Die Aussprache-Schaltflächen in diesem Kurs nutzen die auf Ihrem Gerät oder im Browser installierten vietnamesischen Stimmen. Wenn Sie vorab eine vietnamesische Stimme installieren, können Sie vietnamesische Texte überall in natürlicher Aussprache anhören.", "hu": "A kiejtés-meghallgatás gomb a készülékére vagy böngészőjébe telepített vietnámi hangot használja. Kövesse az alábbi útmutatót a vietnámi hang telepítéséhez. Koppintson egy elemre a kibontásához.", "id": "Tombol dengarkan pelafalan di layar ini menggunakan suara bahasa Vietnam yang terpasang di perangkat atau browser Anda. Ikuti petunjuk untuk memasang suara terlebih dahulu. Ketuk item untuk membukanya.", "ja": "この学習会画面の発音再生ボタンは、機器・ブラウザにすでにインストールされているベトナム語の音声を使用します。以下の機器別ガイドに従ってベトナム語の音声を事前にインストールしておくと、この画面だけでなく、スマートフォンやパソコンの他のアプリでもベトナム語のテキストをネイティブの発音で聞くことができます。項目をタップして開いてみてください。", "pl": "Przyciski odsłuchu korzystają z głosów wietnamskich zainstalowanych na Twoim urządzeniu. Postępuj zgodnie z instrukcjami, aby zainstalować głos i słuchać naturalnej wymowy."},
    "아이폰 · 아이패드 (iOS/iPadOS)": {"cs": "iPhone / iPad (iOS/iPadOS)", "zh_cn": "iPhone・iPad（iOS/iPadOS）", "zh": "iPhone・iPad（iOS/iPadOS）", "en": "iPhone / iPad (iOS/iPadOS)", "fr": "iPhone / iPad (iOS/iPadOS)", "de": "iPhone / iPad (iOS/iPadOS)", "hu": "iPhone / iPad (iOS/iPadOS)", "id": "iPhone / iPad (iOS/iPadOS)", "ja": "iPhone・iPad（iOS/iPadOS）", "pl": "iPhone / iPad (iOS/iPadOS)"},
    "안드로이드 (Android)": {"cs": "Android", "zh_cn": "Android（安卓）", "zh": "Android（安卓）", "en": "Android", "fr": "Android", "de": "Android", "hu": "Android", "id": "Android", "ja": "Android（アンドロイド）", "pl": "Android"},
    "글자를 눌러 발음을 들어 보세요.": {"cs": "Klepnutím na písmeno si poslechněte výslovnost.", "zh_cn": "点选字母即可听发音。", "zh": "點選字母即可聽發音。", "en": "Tap a letter to hear its pronunciation.", "fr": "Appuyez sur une lettre pour écouter sa prononciation.", "de": "Tippen Sie auf einen Buchstaben, um die Aussprache zu hören.", "hu": "Koppintson a betűre a kiejtés meghallgatásához.", "id": "Ketuk huruf untuk mendengarkan pelafalan.", "ja": "文字をタップして発音を聞いてみましょう。", "pl": "Dotknij litery, aby usłyszeć jej wymowę."},
    "베트남어 문자": {"zh_cn": "越南语文字", "zh": "越南語文字", "en": "Vietnamese Alphabet", "fr": "Alphabet vietnamien", "de": "Vietnamesisches Alphabet", "ja": "ベトナム語の文字", "pl": "Alfabet wietnamski"},
    "베트남어 문자의 명칭": {"cs": "Názvy vietnamských písmen", "zh_cn": "越南语文字的名称", "zh": "越南語文字的名稱", "en": "Names of the Vietnamese Letters", "fr": "Noms des lettres vietnamiennes", "de": "Bezeichnungen der vietnamesischen Buchstaben", "hu": "A vietnámi betűk elnevezése", "id": "Nama-Nama Huruf Vietnam", "ja": "ベトナム語の文字の名称", "pl": "Nazwy liter wietnamskich"},
    "자음을 읽을 때는 보통 자음 뒤에 ơ 모음을 붙여서 읽습니다. (예: b → bơ)": {"cs": "Při hlasitém čtení souhlásky se za ni obvykle přidává samohláska ơ. (např. b → bơ)", "zh_cn": "念子音时，通常会在子音后面加上母音 ơ 来念。（例：b → bơ）", "zh": "唸子音時，通常會在子音後面加上母音 ơ 來唸。（例：b → bơ）", "en": "When reading a consonant aloud, the vowel ơ is usually added after it. (e.g. b → bơ)", "fr": "Pour prononcer une consonne isolée, on ajoute généralement la voyelle ơ après elle (ex. : b → bơ).", "de": "Beim Aussprechen von Konsonanten wird üblicherweise der Vokal ơ angehängt (z. B. b → bơ).", "hu": "Mássalhangzó kiejtésekor általában egy ơ magánhangzót teszünk mögé. (pl. b → bơ)", "id": "Saat membaca konsonan dengan lantang, vokal ơ biasanya ditambahkan di belakangnya. (contoh: b → bơ)", "ja": "子音を読むときは、通常子音の後に母音 ơ を付けて読みます。（例：b → bơ）", "pl": "Czytając pojedynczą spółgłoskę, zazwyczaj dodaje się po niej samogłoskę ơ (np. b → bơ)."},
    "모음 발음 — 단모음": {"cs": "Výslovnost samohlásek — jednoduché samohlásky", "zh_cn": "母音发音——单母音", "zh": "母音發音——單母音", "en": "Vowel Pronunciation — Single Vowels", "fr": "Prononciation des voyelles — Voyelles simples", "de": "Vokalaussprache — Einfache Vokale", "hu": "Magánhangzók kiejtése — egyszerű magánhangzók", "id": "Pelafalan Vokal — Vokal Tunggal", "ja": "母音の発音 — 単母音", "pl": "Wymowa samogłosek — Samogłoski pojedyncze"},
    "모음 발음 — 복모음": {"cs": "Výslovnost samohlásek — složené samohlásky", "zh_cn": "母音发音——复合母音", "zh": "母音發音——複合母音", "en": "Vowel Pronunciation — Diphthongs", "fr": "Prononciation des voyelles — Diphtongues", "de": "Vokalaussprache — Diphthonge", "hu": "Magánhangzók kiejtése — összetett magánhangzók", "id": "Pelafalan Vokal — Vokal Majemuk", "ja": "母音の発音 — 複合母音", "pl": "Wymowa samogłosek — Dwugłoski"},
    "자음 발음 — 단자음": {"cs": "Výslovnost souhlásek — jednoduché souhlásky", "zh_cn": "子音发音——单子音", "zh": "子音發音——單子音", "en": "Consonant Pronunciation — Single Consonants", "fr": "Prononciation des consonnes — Consonnes simples", "de": "Konsonantenaussprache — Einfache Konsonanten", "hu": "Mássalhangzók kiejtése — egyszerű mássalhangzók", "id": "Pelafalan Konsonan — Konsonan Tunggal", "ja": "子音の発音 — 単子音", "pl": "Wymowa spółgłosek — Spółgłoski pojedyncze"},
    "자음 발음 — 복자음": {"cs": "Výslovnost souhlásek — spřežky", "zh_cn": "子音发音——复合子音", "zh": "子音發音——複合子音", "en": "Consonant Pronunciation — Consonant Clusters", "fr": "Prononciation des consonnes — Groupes de consonnes", "de": "Konsonantenaussprache — Konsonantenverbindungen", "hu": "Mássalhangzók kiejtése — összetett mássalhangzók", "id": "Pelafalan Konsonan — Konsonan Ganda", "ja": "子音の発音 — 複合子音", "pl": "Wymowa spółgłosek — Zbitki spółgłoskowe"},
    "성조 (6개)": {"cs": "Tóny (6)", "zh_cn": "声调（6个）", "zh": "聲調（6個）", "en": "Tones (6)", "fr": "Tons (6)", "de": "Töne (6)", "hu": "Tónusok (6)", "id": "Nada (6)", "ja": "声調（6つ）", "pl": "Tony (6)"},
    "베트남어에는 음의 높낮이를 구별하는 6개의 성조가 있어요. 같은 글자라도 성조에 따라 완전히 다른 단어가 됩니다.": {"cs": "Vietnamština má 6 tónů rozlišujících výšku hlasu. Stejná písmena mají podle tónu zcela odlišný význam.", "zh_cn": "越南语有6个用来区分音高的声调。就算是同一个字母，依声调不同也会变成完全不同的单字。", "zh": "越南語有6個用來區分音高的聲調。就算是同一個字母，依聲調不同也會變成完全不同的單字。", "en": "Vietnamese has six tones that distinguish pitch. Even the same letters can become completely different words depending on the tone.", "fr": "Le vietnamien compte six tons qui distinguent la hauteur musicale. Les mêmes lettres forment des mots entièrement différents selon le ton.", "de": "Im Vietnamesischen gibt es 6 Töne, die die Tonhöhe bestimmen. Dieselben Buchstaben ergeben je nach Ton völlig unterschiedliche Wörter.", "hu": "A vietnámi nyelvben 6 hangmagasság-megkülönböztető tónus létezik. Ugyanaz a szó tónustól függően teljesen mást jelenthet.", "id": "Bahasa Vietnam memiliki 6 nada yang membedakan tinggi nada. Huruf yang sama dapat menjadi kata yang berbeda tergantung nadanya.", "ja": "ベトナム語には音の高低を区別する6つの声調があります。同じ文字でも声調によって全く違う単語になります。", "pl": "W języku wietnamskim występuje 6 tonów różnicujących wysokość głosu. Te same litery tworzą zupełnie inne słowa w zależności od tonu."},
    "성조 조합 연습 (36가지)": {"cs": "Cvičení kombinací tónů (36 kombinací)", "zh_cn": "声调组合练习（36种）", "zh": "聲調組合練習（36種）", "en": "Tone Combination Practice (36 Combinations)", "fr": "Pratique des combinaisons de tons (36 combinaisons)", "de": "Tonkombinationen üben (36 Paare)", "hu": "Tónuskombinációk gyakorlása (36 változat)", "id": "Latihan Kombinasi Nada (36 Variasi)", "ja": "声調の組み合わせ練習（36通り）", "pl": "Ćwiczenie kombinacji tonów (36 par)"},
    "두 음절의 성조를 조합하면 6×6 = 36가지 경우가 나와요. 앞 음절의 성조별로 묶었으니 눌러서 열어 보고, 실생활에서 자주 쓰는 단어로 성조 조합을 듣고 연습해 보세요.": {"cs": "Kombinací tónů dvou slabik získáte 6×6 = 36 možných dvojic. Jsou seskupeny podle tónu první slabiky.", "zh_cn": "将两个音节的声调组合起来，会有6×6＝36种情况。已依前一音节的声调分组，点选展开查看，并用日常生活中常用的单字聆听、练习声调组合吧。", "zh": "將兩個音節的聲調組合起來，會有6×6＝36種情況。已依前一音節的聲調分組，點選展開查看，並用日常生活中常用的單字聆聽、練習聲調組合吧。", "en": "Combining the tones of two syllables gives you 6×6 = 36 possible pairs. They're grouped by the first syllable's tone — tap to expand each group, and listen to and practice the tone combinations using words commonly used in everyday life.", "fr": "En combinant les tons de deux syllabes, on obtient 6×6 = 36 possibilités. Regroupées par le ton de la première syllabe, ouvrez chaque groupe pour écouter et pratiquer avec des mots de la vie courante.", "de": "Die Kombination zweier Silbentöne ergibt 6×6 = 36 Möglichkeiten. Sie sind nach dem Ton der ersten Silbe gruppiert – öffnen Sie jede Gruppe und üben Sie mit Wörtern aus dem Alltag.", "hu": "Két szótag tónusainak kombinálásával 6×6 = 36 lehetséges pár jön létre. Az első szótag tónusa szerint vannak csoportosítva.", "id": "Menggabungkan nada dua suku kata menghasilkan 6×6 = 36 pasangan. Dikelompokkan berdasarkan nada suku kata pertama.", "ja": "2つの音節の声調を組み合わせると、6×6＝36通りになります。前の音節の声調ごとにまとめてあるので、タップして開き、日常生活でよく使う単語で声調の組み合わせを聞いて練習してみましょう。", "pl": "Kombinacja tonów dwóch sylab daje 6×6 = 36 możliwości. Pogrupowano je według tonu pierwszej sylaby — rozwiń grupy, aby słuchać i ćwiczyć popularne słowa z życia codziennego."},
    "북부 발음과 남부 발음의 차이": {"cs": "Rozdíly mezi severní a jižní výslovností", "zh_cn": "北部发音与南部发音的差异", "zh": "北部發音與南部發音的差異", "en": "Differences Between Northern and Southern Pronunciation", "fr": "Différences de prononciation entre Nord et Sud", "de": "Unterschiede zwischen Nord- und Südaussprache", "hu": "Az északi és déli kiejtés közötti különbségek", "id": "Perbedaan Pelafalan Utara dan Selatan", "ja": "北部発音と南部発音の違い", "pl": "Różnice w wymowie między Północą a Południem"},
    "같은 글자라도 지역에 따라 소리가 달라지는 대표적인 5가지 경우예요. 북부(하노이)와 남부(호찌민)를 비교해 보세요.": {"cs": "Pět typických případů, kdy se stejná písmena vyslovují v různých oblastech odlišně. Porovnejte sever (Hanoj) a jih (Ho Či Minovo Město).", "zh_cn": "这是同一个字母却因地区不同而发音不同的5个代表性例子。请比较北部（河内）与南部（胡志明市）的发音。", "zh": "這是同一個字母卻因地區不同而發音不同的5個代表性例子。請比較北部（河內）與南部（胡志明市）的發音。", "en": "These are five representative cases where the same letters are pronounced differently depending on the region. Compare the Northern (Hanoi) and Southern (Ho Chi Minh City) pronunciations.", "fr": "Voici 5 cas typiques où les mêmes lettres se prononcent différemment selon la région. Comparez le Nord (Hanoï) et le Sud (Hô Chi Minh-Ville).", "de": "Dies sind fünf typische Fälle, in denen dieselben Buchstaben je nach Region unterschiedlich ausgesprochen werden. Vergleichen Sie Norden (Hanoi) und Süden (Ho-Chi-Minh-Stadt).", "hu": "Öt tipikus eset, amikor ugyanaz a betű régiónként eltérően hangzik. Hasonlítsa össze az északi (Hanoi) és a déli (Ho Si Minh-város) kiejtést.", "id": "Lima kasus umum di mana huruf yang sama diucapkan berbeda tergantung wilayah. Bandingkan wilayah Utara (Hanoi) dan Selatan (Ho Chi Minh).", "ja": "同じ文字でも地域によって発音が異なる代表的な5つの例です。北部（ハノイ）と南部（ホーチミン）を比較してみましょう。", "pl": "Oto 5 typowych przypadków, gdy te same litery brzmią inaczej w zależności od regionu. Porównaj Północ (Hanoi) i Południe (Ho Chi Minh)."},
    "바로가기": {"cs": "Přejít", "zh_cn": "前往", "zh": "前往", "en": "Go", "fr": "Accéder", "de": "Direkt zu", "hu": "Ugrás", "id": "Buka", "ja": "移動", "pl": "Przejdź"},
    "주": {"cs": "Týden", "zh_cn": "周", "zh": "週", "en": "Week", "fr": "Semaine", "de": "Woche", "hu": "Hét", "id": "Minggu", "ja": "週", "pl": "Tydzień"},
    "모든 대화를 구성하는 기본 단어": {"cs": "Základní slova tvořící každý rozhovor", "zh_cn": "构成所有对话的基本单字", "zh": "構成所有對話的基本單字", "en": "Basic Words That Make Up Every Dialogue", "fr": "Mots de base composant chaque dialogue", "de": "Grundlegende Wörter aller Dialoge", "hu": "Alapszavak, amelyek minden beszélgetést felépítenek", "id": "Kata Dasar Pembentuk Setiap Percakapan", "ja": "すべての会話を構成する基本単語", "pl": "Podstawowe słowa tworzące każdy dialog"},
    "반의어": {"cs": "Antonyma", "zh_cn": "反义词", "zh": "反義詞", "en": "Antonyms", "fr": "Antonymes", "de": "Antonyme (Gegenteile)", "hu": "Ellentétek", "id": "Antonim", "ja": "反意語", "pl": "Antonimy"},
    "주어": {"cs": "Podmět", "zh_cn": "主词", "zh": "主詞", "en": "Subjects", "fr": "Sujets", "de": "Subjekt", "hu": "Alany", "id": "Subjek", "ja": "主語", "pl": "Podmioty"},
    "조동사 등": {"cs": "Pomocná slovesa apod.", "zh_cn": "助动词等", "zh": "助動詞等", "en": "Modals, etc.", "fr": "Verbes auxiliaires / Modaux", "de": "Modalverben usw.", "hu": "Segédigék stb.", "id": "Kata Kerja Bantu, dll.", "ja": "助動詞など", "pl": "Czasowniki posiłkowe i modalne"},
    "동사": {"cs": "Sloveso", "zh_cn": "动词", "zh": "動詞", "en": "Verbs", "fr": "Verbes", "de": "Verben", "hu": "Ige", "id": "Kata Kerja", "ja": "動詞", "pl": "Czasowniki"},
    "장소 (ở ~)": {"cs": "Místo (ở ~)", "zh_cn": "地点（ở ~）", "zh": "地點（ở ~）", "en": "Places (ở ~)", "fr": "Lieux (ở ~)", "de": "Orte (ở ~)", "hu": "Hely (ở ~)", "id": "Tempat (ở ~)", "ja": "場所（ở ~）", "pl": "Miejsca (ở ~)"},
    "유인물 8단계 구성": {"zh_cn": "讲义8阶段结构", "zh": "講義8階段結構", "en": "8-Stage Handout Structure", "fr": "Structure du document en 8 étapes", "de": "8-stufiger Aufbau des Handzettels", "ja": "配布資料の8段階構成", "pl": "8-etapowa struktura materiałów"},
    "줄": {"zh_cn": "列", "zh": "列", "en": " rows", "fr": " lignes", "de": " Zeilen", "ja": "行", "pl": " wierszy"},
    "칸": {"zh_cn": "栏", "zh": "欄", "en": " cols", "fr": " colonnes", "de": " Spalten", "ja": "マス", "pl": " kolumn"},
    "연결사": {"cs": "Spojovací výrazy", "zh_cn": "连接词", "zh": "連接詞", "en": "Connectives", "fr": "Conjonctions", "de": "Bindewörter (Konjunktionen)", "hu": "Kötőszavak", "id": "Penghubung", "ja": "接続詞", "pl": "Spójniki"},
    "움직임을 나타내는 동사": {"cs": "Slovesa pohybu", "zh_cn": "表示动作的动词", "zh": "表示動作的動詞", "en": "Verbs of Movement", "fr": "Verbes de mouvement", "de": "Verben der Bewegung", "hu": "Mozgást kifejező igék", "id": "Kata Kerja Gerak", "ja": "動きを表す動詞", "pl": "Czasowniki ruchu"},
    "위치 전치사": {"cs": "Předložky místa", "zh_cn": "位置介系词", "zh": "位置介系詞", "en": "Location Prepositions", "fr": "Prépositions de lieu", "de": "Präpositionen des Ortes", "hu": "Helyhatározó elöljárók", "id": "Preposisi Tempat", "ja": "位置を表す前置詞", "pl": "Przyimki miejsca"},
    "길찾기 대화문": {"cs": "Dialogy pro orientaci a hledání cesty", "zh_cn": "问路对话", "zh": "問路對話", "en": "Asking-for-Directions Dialogue", "fr": "Dialogues pour demander son chemin", "de": "Wegbeschreibungs-Dialoge", "hu": "Útbaigazítási beszélgetések", "id": "Percakapan Petunjuk Arah", "ja": "道案内の会話文", "pl": "Dialogi dotyczące pytania o drogę"},
    "A–Z 문법 사전": {"cs": "Mluvnický slovník A–Z", "zh_cn": "A–Z 文法辞典", "zh": "A–Z 文法辭典", "en": "A–Z Grammar Dictionary", "fr": "Dictionnaire de grammaire de A à Z", "de": "A–Z Grammatiklexikon", "hu": "A–Z nyelvtani szótár", "id": "Kamus Tata Bahasa A–Z", "ja": "A–Z 文法辞典", "pl": "Leksykon gramatyczny od A do Z"},
    "왕국 노래": {"cs": "Písně Království", "zh_cn": "王国诗歌", "zh": "王國詩歌", "en": "Kingdom Songs", "fr": "Cantiques du Royaume", "de": "Königreichslieder", "hu": "Királyság-énekek", "id": "Lagu Kerajaan", "ja": "王国の歌", "pl": "Pieśni Królestwa"},
    "번": {"cs": "×", "zh_cn": "首", "zh": "首", "en": "", "fr": "", "de": "", "hu": "×", "id": "×", "ja": "番", "pl": ""},
    "기도 준비하기": {"cs": "Příprava k modlitbě", "zh_cn": "准备祷告", "zh": "準備禱告", "en": "Preparing a Prayer", "fr": "Préparer une prière", "de": "Ein Gebet vorbereiten", "hu": "Felkészülés az imára", "id": "Mempersiapkan Doa", "ja": "祈りを準備する", "pl": "Przygotowanie modlitwy"},
    "맞음": {"cs": "Správně", "zh_cn": "答对", "zh": "答對", "en": "correct", "fr": "correct", "de": "Richtig", "hu": "Helyes", "id": "Benar", "ja": "正解", "pl": "Prawidłowo"},
    "베트남어로 입력하세요": {"cs": "Zadejte ve vietnamštině", "zh_cn": "请输入越南语", "zh": "請輸入越南語", "en": "Type it in Vietnamese", "fr": "Écrivez en vietnamien", "de": "Auf Vietnamesisch eingeben", "hu": "Írja be vietnámiul", "id": "Ketik dalam bahasa Vietnam", "ja": "ベトナム語で入力してください", "pl": "Wpisz po wietnamsku"},
    "단어별 뜻": {"cs": "Význam jednotlivých slov", "zh_cn": "逐字翻译", "zh": "逐字翻譯", "en": "Word-by-Word Meaning", "fr": "Sens mot à mot", "de": "Bedeutung der einzelnen Wörter", "hu": "Szavankénti jelentés", "id": "Arti Kata demi Kata", "ja": "単語ごとの意味", "pl": "Znaczenie słowo po słowie"},
    "문장 뜻: ": {"cs": "Význam věty: ", "zh_cn": "句子意思：", "zh": "句子意思：", "en": "Sentence meaning: ", "fr": "Sens de la phrase : ", "de": "Satzbedeutung: ", "hu": "Mondat jelentése: ", "id": "Arti kalimat: ", "ja": "文の意味：", "pl": "Znaczenie zdania: "},
    "한국어라면 이 순서예요": {"cs": "V češtině by to bylo v tomto pořadí", "zh_cn": "如果是中文，语序是这样", "zh": "如果是中文，語序是這樣", "en": "In English, the order would be this", "fr": "En français, l'ordre serait le suivant", "de": "In deutscher Wortstellung wäre es so", "hu": "A szórend így alakulna", "id": "Urutan susunan kalimat", "ja": "日本語ならこの順番です", "pl": "W języku polskim szyk wyglądałby tak"},
    "베트남어는 이 순서로 이동해요!": {"cs": "Ve vietnamštině se posouvá v tomto pořadí!", "zh_cn": "越南语会变成这个顺序！", "zh": "越南語會變成這個順序！", "en": "In Vietnamese, it moves to this order!", "fr": "En vietnamien, les mots s'agencent dans cet ordre !", "de": "Im Vietnamesischen wechselt es in diese Reihenfolge!", "hu": "A vietnámiban ebbe a sorrendbe kerül!", "id": "Dalam bahasa Vietnam, kata berpindah ke urutan ini!", "ja": "ベトナム語ではこの順番に変わります！", "pl": "W wietnamskim słowa przestawiają się w taki szyk!"},
    "동생": {"zh_cn": "弟妹", "zh": "弟妹", "en": "Younger Sibling", "fr": "Petit frère / Petite sœur", "de": "Jüngeres Geschwister", "ja": "弟・妹", "pl": "Młodsze rodzeństwo"},
    "초면 · 나이를 잘 모르고 아직 친하지 않아 거리를 둘 때": {"zh_cn": "初次见面，不太清楚年龄，还不熟悉，保持一定距离时", "zh": "初次見面，不太清楚年齡，還不熟悉，保持一定距離時", "en": "First meeting, don't know their age well, not yet close, keeping a respectful distance", "fr": "Premier contact, âge inconnu, pas encore familiers, politesse", "de": "Erstes Treffen, Alter unbekannt, respektvoller Abstand", "ja": "初対面で年齢がよく分からず、まだ親しくないため距離を置くとき", "pl": "Pierwsze spotkanie, wiek nieznany, uprzejmy dystans"},
    "검색 결과가 없어요.": {"cs": "Žádné výsledky vyhledávání.", "zh_cn": "没有搜寻结果。", "zh": "沒有搜尋結果。", "en": "No results found.", "fr": "Aucun résultat trouvé.", "de": "Keine Suchergebnisse.", "hu": "Nincs találat.", "id": "Tidak ada hasil pencarian.", "ja": "検索結果がありません。", "pl": "Brak wyników wyszukiwania."},
    "사전어순(베트남어 알파벳순)으로 정리했어요. 한자어에서 온 단어는 괄호 안에 한자를 표시했습니다.": {"cs": "Seřazeno podle abecedy. U slov sino-vietnamského původu jsou znaky uvedeny v závorce.", "zh_cn": "依字典顺序（越南语字母顺序）排列。源自汉字词的单字，括号内会标示汉字。", "zh": "依字典順序（越南語字母順序）排列。源自漢字詞的單字，括號內會標示漢字。", "en": "Sorted in dictionary order (Vietnamese alphabetical order). Words derived from Sino-Vietnamese show the Chinese characters in parentheses.", "fr": "Classé par ordre alphabétique vietnamien. Les mots d'origine sino-vietnamienne indiquent les sinogrammes entre parenthèses.", "de": "In Wörterbuchreihenfolge (vietnamesisches Alphabet) sortiert. Aus dem Sino-Vietnamesischen stammende Wörter zeigen die Schriftzeichen in Klammern.", "hu": "Szótári (vietnámi ábécé) sorrendben rendezve. A sino-vietnámi eredetű szavaknál a karakterek zárójelben szerepelnek.", "id": "Disusun berdasarkan urutan abjad kamus bahasa Vietnam. Kata asal Sino-Vietnam menampilkan karakternya dalam tanda kurung.", "ja": "辞書順（ベトナム語アルファベット順）に整理しました。漢語由来の単語は括弧内に漢字を表示しています。", "pl": "Uporządkowano w kolejności alfabetycznej języka wietnamskiego. Przy słowach pochodzenia sino-wietnamskiego podano znaki chińskie w nawiasach."},
    "총 ": {"cs": "Celkem ", "zh_cn": "共 ", "zh": "共 ", "en": "", "fr": "Total : ", "de": "Insgesamt ", "hu": "Összesen ", "id": "Total ", "ja": "全 ", "pl": "Razem: "},
    "개 단어 중 ": {"cs": " slov z celkových ", "zh_cn": "个单字中，", "zh": "個單字中，", "en": " of ", "fr": " sur ", "de": " von ", "hu": " szó a(z) ", "id": " kata dari ", "ja": "語中、", "pl": " z "},
    "개 검색됨": {"cs": " nalezeno", "zh_cn": "个符合搜寻", "zh": "個符合搜尋", "en": " matched", "fr": " mots trouvés", "de": " Wörter gefunden", "hu": " találat", "id": " ditemukan", "ja": "件ヒット", "pl": " znalezionych słów"},
    "4음절 이상 결합어는 그것을 이루는 기본 단어를 먼저 보여준 뒤에 나옵니다.": {"cs": "U víceslabičných slov se nejprve zobrazí základní slova, ze kterých se skládají.", "zh_cn": "4音节以上的组合词，会先显示组成它的基本单字，然后才出现该组合词。", "zh": "4音節以上的組合詞，會先顯示組成它的基本單字，然後才出現該組合詞。", "en": "Compound words of four or more syllables are shown after first introducing the basic words that make them up.", "fr": "Les mots composés de 4 syllabes ou plus sont présentés après avoir introduit leurs termes de base.", "de": "Zusammengesetzte Wörter ab vier Silben werden nach ihren Grundbestandteilen aufgeführt.", "hu": "A négyszótagos vagy hosszabb összetett szavaknál először az alapszavak jelennek meg.", "id": "Untuk kata majemuk 4 suku kata atau lebih, kata dasar pembentuknya akan ditampilkan lebih dahulu.", "ja": "4音節以上の合成語は、それを構成する基本単語を先に示してから出てきます。", "pl": "Słowa złożone z 4 lub więcej sylab są prezentowane po przedstawieniu ich słów składowych."},
    "결합어": {"cs": "Složená slova", "zh_cn": "组合词", "zh": "組合詞", "en": "Compound", "fr": "Mots composés", "de": "Komposita", "hu": "Összetett szavak", "id": "Kata Majemuk", "ja": "合成語", "pl": "Wyrazy złożone"},
    "개 단어": {"cs": " slov", "zh_cn": "个单字", "zh": "個單字", "en": " words", "fr": " mots", "de": " Wörter", "hu": " szó", "id": " kata", "ja": "語", "pl": " słów"},
    "베트남어 한자어 음절을 받침(끝소리)별로 묶고, 그 받침이 한국 한자음의 어떤 받침과 대응하는지 보여줘요. 안에서 다시 모음별(운) 그룹으로 나누어, 하나의 기본 단어에서 여러 파생 단어의 한국 한자음을 함께 익힐 수 있어요.": {"cs": "Seskupuje sino-vietnamské slabiky podle koncové hlásky a ukazuje vzájemné korespondence.", "zh_cn": "依越南语汉字词音节的收尾音分组，并显示该收尾音对应到中文汉字音的哪个收尾音。组内再依母音（韵）细分，让您能从一个基本词汇一起熟悉多个衍生词的中文汉字音。", "zh": "依越南語漢字詞音節的收尾音分組，並顯示該收尾音對應到中文漢字音的哪個收尾音。組內再依母音（韻）細分，讓您能從一個基本詞彙一起熟悉多個衍生詞的中文漢字音。", "en": "Groups Sino-Vietnamese syllables by their final sound, and shows which final sound in the Chinese reading it corresponds to. Within each group, they're further divided by vowel (rhyme), so you can learn the Chinese readings of several derived words together from one basic word.", "fr": "Regroupe les syllabes sino-vietnamiennes par consonne finale et montre les correspondances phonétiques.", "de": "Gruppiert sino-vietnamesische Silben nach Endlauten und zeigt Entsprechungen auf.", "hu": "A sino-vietnámi szótagokat végződésük szerint csoportosítja, és bemutatja a megfeleléseket.", "id": "Mengelompokkan suku kata Sino-Vietnam berdasarkan bunyi akhirnya dan menunjukkan kesesuaian bunyinya.", "ja": "ベトナム語の漢語音節を語末音別にまとめ、その語末音が中国語の漢字音のどの語末音に対応するかを示します。中ではさらに母音（韻）別のグループに分け、1つの基本単語から複数の派生語の中国語漢字音をまとめて覚えられます。", "pl": "Grupuje sylaby sino-wietnamskie według spółgłoski końcowej i pokazuje odpowiedniości fonetyczne."},
    "[어순반대]": {"cs": "[Obrácený slovosled]", "zh_cn": "［语序相反］", "zh": "［語序相反］", "en": "[reversed order]", "fr": "[ordre inversé]", "de": "[Umgekehrte Wortstellung]", "hu": "[Fordított szórend]", "id": "[Urutan Terbalik]", "ja": "［語順が逆］", "pl": "[odwrócony szyk]"},
    "어순반대": {"cs": "Obrácený slovosled", "zh_cn": "语序相反", "zh": "語序相反", "en": "Reversed Order", "fr": "Ordre inversé", "de": "Umgekehrte Wortstellung", "hu": "Fordított szórend", "id": "Urutan Terbalik", "ja": "語順が逆", "pl": "Odwrócony szyk"},
    "베트남어 한자어 중, 한국어·중국어·일본어의 한자 어순과 베트남어 어순이 서로 반대인 단어들을 모았어요.": {"cs": "Sbírka sino-vietnamských slov, jejichž vietnamský slovosled je obrácený.", "zh_cn": "收录了越南语汉字词中，韩文·中文·日文的汉字语序与越南语语序相反的单字。", "zh": "收錄了越南語漢字詞中，韓文·中文·日文的漢字語序與越南語語序相反的單字。", "en": "Collects Sino-Vietnamese words whose Vietnamese syllable order is reversed compared to the hanja/hanzi/kanji order used in Korean, Chinese, and Japanese.", "fr": "Rassemble les mots sino-vietnamiens dont l'ordre des syllabes est inversé par rapport au chinois, coréen et japonais.", "de": "Sino-vietnamesische Wörter, deren Silbenreihenfolge im Vietnamesischen umgekehrt ist.", "hu": "Olyan sino-vietnámi szavak gyűjteménye, amelyek szórendje fordított.", "id": "Kumpulan kata Sino-Vietnam yang urutan suku katanya terbalik.", "ja": "ベトナム語の漢語のうち、韓国語・中国語・日本語の漢字語順とベトナム語の語順が逆になっている単語を集めました。", "pl": "Zbiór słów sino-wietnamskich, w których kolejność sylab jest odwrotna niż w językach chińskim, koreańskim i japońskim."},
    "구약 (39권)": {"cs": "Starý zákon (39 knih)", "zh_cn": "旧约（39卷）", "zh": "舊約（39卷）", "en": "Old Testament (39 Books)", "fr": "Écritures hébraïques (39 livres)", "de": "Hebräische Schriften (39 Bücher)", "hu": "Héber-arámi iratok (39 könyv)", "id": "Perjanjian Lama (39 Kitab)", "ja": "旧約（39巻）", "pl": "Pisma Hebrajskie (39 ksiąg)"},
    "신약 (27권)": {"cs": "Nový zákon (27 knih)", "zh_cn": "新约（27卷）", "zh": "新約（27卷）", "en": "New Testament (27 Books)", "fr": "Écritures grecques chrétiennes (27 livres)", "de": "Christliche Griechische Schriften (27 Bücher)", "hu": "Keresztény Görög Iratok (27 könyv)", "id": "Perjanjian Baru (27 Kitab)", "ja": "新約（27巻）", "pl": "Chrześcijańskie Pisma Greckie (27 ksiąg)"},
    "숫자 읽기 — 1~10": {"cs": "Čtení čísel — 1–10", "zh_cn": "数字读法 — 1～10", "zh": "數字讀法 — 1～10", "en": "Reading Numbers — 1–10", "fr": "Lecture des nombres — 1–10", "de": "Zahlen lesen — 1–10", "hu": "Számok olvasása — 1–10", "id": "Membaca Angka — 1–10", "ja": "数字の読み方 — 1〜10", "pl": "Odczytywanie liczb — 1–10"},
    "숫자 읽기 — 11~19": {"cs": "Čtení čísel — 11–19", "zh_cn": "数字读法 — 11～19", "zh": "數字讀法 — 11～19", "en": "Reading Numbers — 11–19", "fr": "Lecture des nombres — 11–19", "de": "Zahlen lesen — 11–19", "hu": "Számok olvasása — 11–19", "id": "Membaca Angka — 11–19", "ja": "数字の読み方 — 11〜19", "pl": "Odczytywanie liczb — 11–19"},
    "숫자 읽기 — 20~100": {"cs": "Čtení čísel — 20–100", "zh_cn": "数字读法 — 20～100", "zh": "數字讀法 — 20～100", "en": "Reading Numbers — 20–100", "fr": "Lecture des nombres — 20–100", "de": "Zahlen lesen — 20–100", "hu": "Számok olvasása — 20–100", "id": "Membaca Angka — 20–100", "ja": "数字の読み方 — 20〜100", "pl": "Odczytywanie liczb — 20–100"},
    "숫자 읽기 — 200~900": {"cs": "Čtení čísel — 200–900", "zh_cn": "数字读法 — 200～900", "zh": "數字讀法 — 200～900", "en": "Reading Numbers — 200–900", "fr": "Lecture des nombres — 200–900", "de": "Zahlen lesen — 200–900", "hu": "Számok olvasása — 200–900", "id": "Membaca Angka — 200–900", "ja": "数字の読み方 — 200〜900", "pl": "Odczytywanie liczb — 200–900"},
    "숫자 읽기 — 1,000 ~ 10억": {"cs": "Čtení čísel — 1 000 až 1 miliarda", "zh_cn": "数字读法 — 1,000～10亿", "zh": "數字讀法 — 1,000～10億", "en": "Reading Numbers — 1,000–1 Billion", "fr": "Lecture des nombres — 1 000 à 1 milliard", "de": "Zahlen lesen — 1.000–1 Milliarde", "hu": "Számok olvasása — 1 000-től 1 milliárdig", "id": "Membaca Angka — 1.000 hingga 1 Miliar", "ja": "数字の読み方 — 1,000〜10億", "pl": "Odczytywanie liczb — 1000 do 1 miliarda"},
    "숫자 표기법 — 마침표와 쉼표": {"cs": "Zápis čísel — tečky a čárky", "zh_cn": "数字书写方式 — 句点与逗号", "zh": "數字書寫方式 — 句點與逗號", "en": "Number Formatting — Periods and Commas", "fr": "Notation des nombres — Point et virgule", "de": "Zahlenformatierung — Punkt und Komma", "hu": "Számformátum — pontok és vesszők", "id": "Format Angka — Titik dan Koma", "ja": "数字の表記法 — ピリオドとコンマ", "pl": "Zapis liczb — Kropka i przecinek"},
    "월 (달)": {"cs": "Měsíce", "zh_cn": "月份", "zh": "月份", "en": "Months", "fr": "Mois", "de": "Monate", "hu": "Hónapok", "id": "Bulan", "ja": "月", "pl": "Miesiące"},
    "요일": {"cs": "Dny v týdnu", "zh_cn": "星期", "zh": "星期", "en": "Days of the Week", "fr": "Jours de la semaine", "de": "Wochentage", "hu": "A hét napjai", "id": "Hari dalam Seminggu", "ja": "曜日", "pl": "Dni tygodnia"},
    "날짜": {"cs": "Datum", "zh_cn": "日期", "zh": "日期", "en": "Dates", "fr": "Date", "de": "Datum", "hu": "Dátum", "id": "Tanggal", "ja": "日付", "pl": "Data"},
    "계절": {"cs": "Roční období", "zh_cn": "季节", "zh": "季節", "en": "Seasons", "fr": "Saisons", "de": "Jahreszeiten", "hu": "Évszakok", "id": "Musim", "ja": "季節", "pl": "Pory roku"},
    "연도 읽는 법 — lẻ와 không trăm": {"cs": "Čtení letopočtů — lẻ a không trăm", "zh_cn": "年份的读法 — lẻ 和 không trăm", "zh": "年份的讀法 — lẻ 和 không trăm", "en": "Reading Years — lẻ and không trăm", "fr": "Lecture des années — lẻ et không trăm", "de": "Jahreszahlen lesen — lẻ und không trăm", "hu": "Évszámok olvasása — lẻ és không trăm", "id": "Membaca Tahun — lẻ dan không trăm", "ja": "年の読み方 — lẻ と không trăm", "pl": "Odczytywanie lat — lẻ i không trăm"},
    "이 경우, 호칭이 북부·남부에 따라 달라져요.": {"cs": "V tomto případě se oslovení liší mezi severem a jihem.", "zh_cn": "在这种情况下，称呼会因北部、南部而有所不同。", "zh": "在這種情況下，稱呼會因北部、南部而有所不同。", "en": "In this case, the term of address differs between the North and the South.", "fr": "Dans ce cas, la formule d'adresse varie entre le Nord et le Sud.", "de": "In diesem Fall unterscheidet sich die Anrede zwischen Norden und Süden.", "hu": "Ebben az esetben a megszólítás északon és délen eltérő.", "id": "Dalam kasus ini, sebutan berbeda antara wilayah Utara dan Selatan.", "ja": "この場合、呼び方が北部・南部で異なります。", "pl": "W tym przypadku forma grzecznościowa różni się między Północą a Południem."},
    "이 브라우저에서는 베트남어 음성을 찾을 수 없어요. 기본 음성으로 재생을 시도합니다.": {"cs": "V tomto prohlížeči nebyl nalezen žádný vietnamský hlas. Přehrávání se pokusí použít výchozí hlas.", "zh_cn": "此浏览器找不到越南语语音，将尝试以预设语音播放。", "zh": "此瀏覽器找不到越南語語音，將嘗試以預設語音播放。", "en": "No Vietnamese voice was found in this browser. Playback will be attempted with the default voice.", "fr": "Aucune voix vietnamienne n'a été trouvée dans ce navigateur. Tentative de lecture avec la voix par défaut.", "de": "In diesem Browser wurde keine vietnamesische Stimme gefunden. Es wird versucht, mit der Standardstimme abzuspielen.", "hu": "Ebben a böngészőben nem található vietnámi hang. A lejátszás az alapértelmezett hanggal kísérli meg.", "id": "Tidak ada suara bahasa Vietnam di browser ini. Pemutaran akan dicoba dengan suara default.", "ja": "このブラウザではベトナム語の音声が見つかりません。デフォルトの音声で再生を試みます。", "pl": "W tej przeglądarce nie znaleziono wietnamskiego głosu. Nastąpi próba odtworzenia głosem domyślnym."},
    "발음 듣기에 사용할 목소리를 선택하세요. (기기·브라우저에 설치된 베트남어 음성만 표시돼요)": {"zh_cn": "请选择用于发音播放的语音。（仅显示装置、浏览器中已安装的越南语语音）", "zh": "請選擇用於發音播放的語音。（僅顯示裝置、瀏覽器中已安裝的越南語語音）", "en": "Choose a voice for pronunciation playback. (Only Vietnamese voices installed on your device/browser are shown)", "fr": "Choisissez la voix pour la prononciation. (Seules les voix vietnamiennes installées s'affichent)", "de": "Wählen Sie eine Stimme für die Aussprache. (Es werden nur installierte vietnamesische Stimmen angezeigt)", "ja": "発音再生に使う声を選んでください。（機器・ブラウザにインストール済みのベトナム語の声のみ表示されます）", "pl": "Wybierz głos do odsłuchu wymowy. (Wyświetlane są tylko głosy zainstalowane na urządzeniu)"},
    "뜻·해석 읽기 목소리": {"cs": "Hlas pro čtení významu/překladu", "zh_cn": "词义、翻译朗读语音", "zh": "詞義、翻譯朗讀語音", "en": "Meaning/Translation Voice", "fr": "Voix pour le sens et la traduction", "de": "Stimme für Bedeutung/Übersetzung", "hu": "Jelentést/fordítást felolvasó hang", "id": "Suara Pembacaan Arti/Terjemahan", "ja": "意味・訳読み上げの声", "pl": "Głos do odczytu znaczenia i tłumaczenia"},
    "전체 듣기에서 단어 뜻이나 문장 해석도 함께 읽어드려요. 아래에서 현재 언어 모드(한국어·中文·English·日本語)로 읽어줄 목소리를 선택하세요.": {"cs": "Funkce „Přehrát vše“ přečte také význam slova nebo překlad věty. Níže vyberte hlas, který bude číst v aktuálním jazykovém režimu.", "zh_cn": "在「全部朗读」中，也会一并朗读词义或例句翻译。请在下方选择要用目前语言模式（韩文・中文・English・日本语）朗读的语音。", "zh": "在「全部朗讀」中，也會一併朗讀詞義或例句翻譯。請在下方選擇要用目前語言模式（韓文・中文・English・日本語）朗讀的語音。", "en": "\"Read All\" also reads the word's meaning or the sentence's translation aloud. Choose below which voice should read it in the current language mode (Korean/Chinese/English/Japanese).", "fr": "« Tout écouter » lit également le sens du mot ou la traduction de la phrase. Choisissez ci-dessous la voix correspondant à la langue de l'interface.", "de": "Beim Vorlesen wird auch die Bedeutung oder Übersetzung vorgelesen. Wählen Sie unten eine Stimme im aktuellen Sprachmodus aus.", "hu": "Az „Összes lejátszása” a szó jelentését vagy a mondat fordítását is felolvassa. Válassza ki alább a kívánt hangot.", "id": "Fitur 'Putar Semua' juga membacakan arti kata atau terjemahan kalimat. Pilih suara di bawah ini untuk membaca dalam mode bahasa saat ini.", "ja": "「全部読み上げ」では、単語の意味や文の訳も一緒に読み上げます。下で、現在の言語モード（韓国語・中国語・English・日本語）で読み上げる声を選んでください。", "pl": "Opcja „Odtwórz wszystko” odczytuje także znaczenie słowa lub tłumaczenie zdania. Wybierz poniżej głos dla bieżącego języka interfejsu."},
    "이 브라우저에서는 현재 언어 모드의 음성을 찾을 수 없어요. 뜻·해석 읽기는 기본 음성으로 재생을 시도합니다.": {"cs": "V tomto prohlížeči nebyl nalezen hlas odpovídající aktuálnímu jazykovému režimu. Čtení významu/překladu se pokusí použít výchozí hlas.", "zh_cn": "此浏览器找不到符合目前语言模式的语音，词义、翻译朗读将尝试以预设语音播放。", "zh": "此瀏覽器找不到符合目前語言模式的語音，詞義、翻譯朗讀將嘗試以預設語音播放。", "en": "No voice matching the current language mode was found in this browser. Meaning/translation playback will be attempted with the default voice.", "fr": "Aucune voix correspondant à la langue de l'interface n'a été trouvée. Lecture de la traduction avec la voix par défaut.", "de": "In diesem Browser wurde keine Stimme für den aktuellen Sprachmodus gefunden. Die Bedeutung bzw. Übersetzung wird mit der Standardstimme abgespielt.", "hu": "Ebben a böngészőben nem található az aktuális nyelvi módnak megfelelő hang. A jelentés/fordítás felolvasása az alapértelmezett hanggal kísérli meg.", "id": "Tidak ada suara yang cocok dengan mode bahasa saat ini di browser ini. Pembacaan arti/terjemahan akan dicoba dengan suara default.", "ja": "このブラウザでは現在の言語モードに合う音声が見つかりません。意味・訳の読み上げはデフォルトの音声で再生を試みます。", "pl": "W tej przeglądarce nie znaleziono głosu dla bieżącego języka. Tłumaczenie zostanie odczytane głosem domyślnym."},
    "전체 듣기에서 베트남어 다음에 단어 뜻이나 문장 해석을 읽어줄 때 사용할 목소리를 선택하세요. (기기·브라우저에 설치된, 현재 언어 모드에 맞는 음성만 표시돼요)": {"cs": "Vyberte hlas pro čtení významu slova nebo překladu věty po vietnamštině při funkci „Přehrát vše“. (Zobrazují se pouze hlasy nainstalované v zařízení odpovídající aktuálnímu jazyku)", "zh_cn": "请选择「全部朗读」中，念完越南语后接着朗读词义或例句翻译时使用的语音。（仅显示装置、浏览器中已安装、符合目前语言模式的语音）", "zh": "請選擇「全部朗讀」中，唸完越南語後接著朗讀詞義或例句翻譯時使用的語音。（僅顯示裝置、瀏覽器中已安裝、符合目前語言模式的語音）", "en": "Choose the voice used to read the word's meaning or the sentence's translation right after the Vietnamese, during \"Read All\". (Only voices installed on your device/browser that match the current language mode are shown)", "fr": "Choisissez la voix qui lira la traduction après le vietnamien lors de l'écoute globale.", "de": "Wählen Sie die Stimme, die beim Vorlesen nach dem Vietnamesischen die Bedeutung oder Übersetzung vorliest. (Es werden nur Stimmen angezeigt, die zum aktuellen Sprachmodus passen)", "hu": "Válassza ki a vietnámi utáni jelentés/fordítás felolvasásához használandó hangot. (Csak a készülékre telepített, az aktuális nyelvi módnak megfelelő hangok jelennek meg)", "id": "Pilih suara yang digunakan untuk membaca arti kata atau terjemahan tepat setelah bahasa Vietnam saat 'Putar Semua'. (Hanya suara yang terpasang di perangkat yang cocok dengan mode bahasa saat ini yang ditampilkan)", "ja": "「全部読み上げ」でベトナム語の後に単語の意味や文の訳を読み上げる際に使う声を選んでください。（機器・ブラウザにインストール済みの、現在の言語モードに合う声のみ表示されます）", "pl": "Wybierz głos, który odczyta tłumaczenie po tekście wietnamskim podczas pełnego odtwarzania."},
    "여성 추정": {"cs": "Pravděpodobně žena", "zh_cn": "推测为女性", "zh": "推測為女性", "en": "likely female", "fr": "vraisemblablement femme", "de": "vermutlich weiblich", "hu": "Valószínűleg nő", "id": "Kemungkinan wanita", "ja": "女性と推定", "pl": "prawdopodobnie kobieta"},
    "남성 추정": {"cs": "Pravděpodobně muž", "zh_cn": "推测为男性", "zh": "推測為男性", "en": "likely male", "fr": "vraisemblablement homme", "de": "vermutlich männlich", "hu": "Valószínűleg férfi", "id": "Kemungkinan pria", "ja": "男性と推定", "pl": "prawdopodobnie mężczyzna"},
    "한국어 뜻 가리고 연습하기": {"cs": "Cvičit se skrytým významem", "zh_cn": "遮住中文意思来练习", "zh": "遮住中文意思來練習", "en": "Practice with the Meaning Hidden", "fr": "S'entraîner en masquant la traduction", "de": "Bedeutung verdecken und üben", "hu": "Gyakorlás a jelentés elrejtésével", "id": "Latihan dengan menyembunyikan arti", "ja": "日本語の意味を隠して練習する", "pl": "Ćwicz z ukrytym znaczeniem"},
    "상대": {"cs": "Druhá osoba", "zh_cn": "对方", "zh": "對方", "en": "Them", "fr": "Interlocuteur", "de": "Gegenüber", "hu": "Másik fél", "id": "Lawan bicara", "ja": "相手", "pl": "Rozmówca"},
    "문장 종류": {"cs": "Druh věty", "zh_cn": "句子种类", "zh": "句子種類", "en": "Sentence Type", "fr": "Type de phrase", "de": "Satzart", "hu": "Mondatfajta", "id": "Jenis Kalimat", "ja": "文の種類", "pl": "Typ zdania"},
    "의문사 선택": {"cs": "Výběr tázacího zájmena", "zh_cn": "选择疑问词", "zh": "選擇疑問詞", "en": "Choose a Wh-word", "fr": "Choisir un mot interrogatif", "de": "Fragewort auswählen", "hu": "Kérdőszó kiválasztása", "id": "Pilih Kata Tanya", "ja": "疑問詞を選択", "pl": "Wybierz zaimek pytający"},
    "접속어 (문장 앞에 붙는 연결어)": {"cs": "Spojka (spojovací výraz na začátku věty)", "zh_cn": "连接词（放在句子前面的连接语）", "zh": "連接詞（放在句子前面的連接語）", "en": "Connective (linking word before the sentence)", "fr": "Conjonction (mot de liaison en tête de phrase)", "de": "Bindewort (vorangestellte Konjunktion)", "hu": "Kötőszó (összekötő szó a mondat elején)", "id": "Konjungsi (kata hubung di awal kalimat)", "ja": "接続語（文頭につく接続語）", "pl": "Spójnik (słowo łączące na początku zdania)"},
    "사용 안 함": {"cs": "Nepoužito", "zh_cn": "不使用", "zh": "不使用", "en": "Not used", "fr": "Non utilisé", "de": "Nicht verwendet", "hu": "Nincs használatban", "id": "Tidak digunakan", "ja": "使用しない", "pl": "Nie używaj"},
    "예: Sau khi": {"zh_cn": "例：Sau khi", "zh": "例：Sau khi", "en": "e.g. Sau khi", "fr": "ex. : Sau khi", "de": "z. B. Sau khi", "ja": "例：Sau khi", "pl": "np. Sau khi"},
    "예: 그 후에": {"zh_cn": "例：之后", "zh": "例：之後", "en": "e.g. after that", "fr": "ex. : après cela", "de": "z. B. danach", "ja": "例：その後に", "pl": "np. potem, po tym"},
    "주어 (의문사 'ai(누가)'를 쓸 때처럼 주어가 필요 없으면 '사용 안 함')": {"cs": "Podmět (pokud není potřeba, jako u tázacího zájmena 'ai' (kdo), zvolte 'Nepoužito')", "zh_cn": "主语（像使用疑问词 'ai(谁)' 时那样不需要主语时，选「不使用」）", "zh": "主語（像使用疑問詞 'ai(誰)' 時那樣不需要主語時，選「不使用」）", "en": "Subject (choose \"Not used\" when no subject is needed, like when using the wh-word 'ai' (who))", "fr": "Sujet (choisissez « Non utilisé » si aucun sujet n'est nécessaire, ex. avec « ai » [qui])", "de": "Subjekt (wenn kein Subjekt benötigt wird, wählen Sie „Nicht verwendet“)", "hu": "Alany (ha nincs szükség alanyra, például az 'ai' (ki) kérdőszónál, válassza a 'Nincs használatban' opciót)", "id": "Subjek (pilih 'Tidak digunakan' jika tidak perlu subjek, seperti kata tanya 'ai' (siapa))", "ja": "主語（疑問詞「ai（誰）」を使うときのように主語が要らない場合は「使用しない」）", "pl": "Podmiot (wybierz „Nie używaj”, gdy podmiot nie jest potrzebny, np. przy zaimku 'ai' [kto])"},
    "예: học viên mới": {"zh_cn": "例：học viên mới", "zh": "例：học viên mới", "en": "e.g. học viên mới", "fr": "ex. : học viên mới", "de": "z. B. học viên mới", "ja": "例：học viên mới", "pl": "np. học viên mới"},
    "예: 새 학습자": {"zh_cn": "例：新学习者", "zh": "例：新學習者", "en": "e.g. new student", "fr": "ex. : nouvel étudiant de la Bible", "de": "z. B. neuer Bibelschüler", "ja": "例：新しい学習者", "pl": "np. nowy zainteresowany"},
    "보조동사": {"cs": "Pomocné sloveso", "zh_cn": "辅助动词", "zh": "輔助動詞", "en": "Auxiliary Verb", "fr": "Verbe auxiliaire / Modal", "de": "Hilfsverb / Modalverb", "hu": "Segédige", "id": "Kata Kerja Bantu", "ja": "補助動詞", "pl": "Czasownik posiłkowy / modalny"},
    "직접 입력": {"cs": "Vlastní zadání", "zh_cn": "手动输入", "zh": "手動輸入", "en": "Custom input", "fr": "Saisie personnalisée", "de": "Eigene Eingabe", "hu": "Egyéni bevitel", "id": "Input manual", "ja": "直接入力", "pl": "Wpisz własny"},
    "예: định": {"cs": "např. định", "zh_cn": "例：định", "zh": "例：định", "en": "e.g. định", "fr": "ex. : định", "de": "z. B. định", "hu": "pl. định", "id": "contoh: định", "ja": "例：định", "pl": "np. định"},
    "예: ~할 예정이다": {"cs": "např. plánovat dělat ~", "zh_cn": "例：打算~", "zh": "例：打算~", "en": "e.g. plan to ~", "fr": "ex. : avoir l'intention de ~", "de": "z. B. vorhaben zu ~", "hu": "pl. tervezi, hogy ~", "id": "contoh: berencana untuk ~", "ja": "例：~する予定だ", "pl": "np. planować ~"},
    "뜻 패턴: ~하고 싶다": {"cs": "Vzorec významu: chtít ~", "zh_cn": "意思模式：想要~", "zh": "意思模式：想要~", "en": "Meaning pattern: want to ~", "fr": "Modèle de sens : vouloir ~", "de": "Bedeutungsmuster: möchten ~", "hu": "Jelentésminta: szeretne ~", "id": "Pola arti: ingin ~", "ja": "意味パターン：~したい", "pl": "Wzorzec znaczeniowy: chcieć ~"},
    "~해야 하다": {"cs": "muset dělat ~", "zh_cn": "必须~", "zh": "必須~", "en": "must ~", "fr": "devoir ~", "de": "müssen ~", "hu": "kell csinálni ~", "id": "harus melakukan ~", "ja": "~しなければならない", "pl": "musieć ~"},
    "~할 수 있다": {"cs": "moci dělat ~", "zh_cn": "能~", "zh": "能~", "en": "can ~", "fr": "pouvoir ~", "de": "können ~", "hu": "tud csinálni ~", "id": "bisa melakukan ~", "ja": "~することができる", "pl": "móc / potrafić ~"},
    "~할 수 없다": {"cs": "nemoci dělat ~", "zh_cn": "不能~", "zh": "不能~", "en": "cannot ~", "fr": "ne pas pouvoir ~", "de": "nicht können ~", "hu": "nem tud csinálni ~", "id": "tidak bisa melakukan ~", "ja": "~することができない", "pl": "nie móc ~"},
    "~하는 게 좋다": {"cs": "je lepší dělat ~", "zh_cn": "最好~", "zh": "最好~", "en": "should ~", "fr": "il vaut mieux ~", "de": "sollten ~", "hu": "jobb, ha ~", "id": "sebaiknya ~", "ja": "~したほうがいい", "pl": "lepiej zrobić ~"},
    "~할 것이다(미래)": {"cs": "bude dělat (budoucnost)", "zh_cn": "将要~（未来）", "zh": "將要~（未來）", "en": "will ~ (future)", "fr": "futur (va ~ / fera ~)", "de": "werden ~ (Zukunft)", "hu": "fog csinálni (jövő idő)", "id": "akan (masa depan)", "ja": "~するだろう（未来）", "pl": "czas przyszły (będzie ~)"},
    "~했다(과거)": {"cs": "dělal (minulost)", "zh_cn": "~了（过去）", "zh": "~了（過去）", "en": "~ed (past)", "fr": "passé (a fait ~)", "de": "hat ~t (Vergangenheit)", "hu": "csinált (múlt idő)", "id": "sudah melakukan (lampau)", "ja": "~した（過去）", "pl": "czas przeszły (zrobił ~)"},
    "~하는 중이다": {"cs": "právě dělat ~", "zh_cn": "正在~", "zh": "正在~", "en": "be ~ing", "fr": "en train de ~", "de": "gerade dabei sein zu ~", "hu": "éppen csinál ~", "id": "sedang melakukan ~", "ja": "~している", "pl": "w trakcie robienia ~"},
    "~할 필요가 있다": {"cs": "je třeba dělat ~", "zh_cn": "需要~", "zh": "需要~", "en": "need to ~", "fr": "avoir besoin de ~", "de": "brauchen zu ~", "hu": "szükséges csinálni ~", "id": "perlu melakukan ~", "ja": "~する必要がある", "pl": "potrzebować ~"},
    "~하는 것을 좋아하다": {"cs": "rád dělat ~", "zh_cn": "喜欢~", "zh": "喜歡~", "en": "like to ~", "fr": "aimer ~", "de": "gerne tun ~", "hu": "szeret csinálni ~", "id": "suka melakukan ~", "ja": "~するのが好き", "pl": "lubić robić ~"},
    "~해라(명령)": {"cs": "dělej! (rozkaz)", "zh_cn": "~吧（命令）", "zh": "~吧（命令）", "en": "~! (imperative)", "fr": "impératif (fais ~ !)", "de": "Mach ~! (Befehl)", "hu": "csináld! (felszólítás)", "id": "lakukan! (perintah)", "ja": "~しなさい（命令）", "pl": "tryb rozkazujący (zrób ~!)"},
    "가장 뜻이 비슷한 패턴을 골라야 문장이 올바르게 만들어져요.": {"zh_cn": "要选择意思最相近的模式，句子才会正确生成。", "zh": "要選擇意思最相近的模式，句子才會正確生成。", "en": "Pick the pattern closest in meaning so the sentence is generated correctly.", "fr": "Choisissez le modèle le plus proche du sens souhaité pour que la phrase soit générée correctement.", "de": "Wählen Sie das Muster mit der ähnlichsten Bedeutung, damit der Satz korrekt gebildet wird.", "ja": "意味が一番近いパターンを選ぶと、正しい文が作られます。", "pl": "Wybierz wzorzec najbliższy znaczeniowo, aby zdanie zostało utworzone poprawnie."},
    "동사 (베트남어는 형용사만으로도 문장이 완성돼요. 예: Trời lạnh. 날씨가 춥다.)": {"cs": "Sloveso (ve vietnamštině může větu tvořit i samotné přídavné jméno. Např. Trời lạnh. — Je zima.)", "zh_cn": "动词（越南语光用形容词也能完成句子。例：Trời lạnh. 天气冷。）", "zh": "動詞（越南語光用形容詞也能完成句子。例：Trời lạnh. 天氣冷。）", "en": "Verb (Vietnamese can form a complete sentence with just an adjective. e.g. Trời lạnh. — It's cold.)", "fr": "Verbe (en vietnamien, un adjectif suffit souvent à former une phrase complète, ex. : Trời lạnh. — Il fait froid.)", "de": "Verb (im Vietnamesischen reicht oft schon ein Adjektiv für einen vollständigen Satz, z. B. Trời lạnh. — Das Wetter ist kalt.)", "hu": "Ige (a vietnámiban a mondat pusztán melléknévvel is teljes lehet. Pl. Trời lạnh. — Hideg van.)", "id": "Kata kerja (bahasa Vietnam dapat membentuk kalimat hanya dengan kata sifat. Contoh: Trời lạnh. — Cuaca dingin.)", "ja": "動詞（ベトナム語は形容詞だけでも文が完成します。例：Trời lạnh. 天気が寒い。）", "pl": "Czasownik (w wietnamskim sam przymiotnik może tworzyć pełne zdanie, np. Trời lạnh. — Jest zimno.)"},
    "사용 안 함 (형용사만으로 문장 완성)": {"cs": "Nepoužito (věta tvořena pouze přídavným jménem)", "zh_cn": "不使用（只用形容词完成句子）", "zh": "不使用（只用形容詞完成句子）", "en": "Not used (sentence completed with adjective only)", "fr": "Non utilisé (phrase formée avec l'adjectif seul)", "de": "Nicht verwendet (Satz nur mit Adjektiv)", "hu": "Nincs használatban (a mondat csak melléknévvel egészül ki)", "id": "Tidak digunakan (kalimat lengkap hanya dengan kata sifat)", "ja": "使用しない（形容詞だけで文を完成）", "pl": "Nie używaj (zdanie tylko z przymiotnikiem)"},
    "예: nấu": {"cs": "např. nấu", "zh_cn": "例：nấu", "zh": "例：nấu", "en": "e.g. nấu", "fr": "ex. : nấu", "de": "z. B. nấu", "hu": "pl. nấu", "id": "contoh: nấu", "ja": "例：nấu", "pl": "np. nấu"},
    "사전형, 예: 요리하다": {"cs": "základní tvar, např. vařit", "zh_cn": "辞典形，例：요리하다", "zh": "辭典形，例：요리하다", "en": "dictionary form, e.g. 요리하다", "fr": "forme du dictionnaire, ex. : cuisiner", "de": "Grundform, z. B. kochen", "hu": "szótári alak, pl. főz", "id": "bentuk kamus, misal: memasak", "ja": "辞書形、例：요리하다", "pl": "forma słownikowa, np. gotować"},
    "자동사 (목적어 없음)": {"cs": "Nepřechodné (bez předmětu)", "zh_cn": "不及物动词（无受词）", "zh": "不及物動詞（無受詞）", "en": "Intransitive (no object)", "fr": "Intransitif (sans complément d'objet)", "de": "Intransitiv (kein Objekt)", "hu": "Tárgyatlan (nincs tárgy)", "id": "Intransitif (tanpa objek)", "ja": "自動詞（目的語なし）", "pl": "Nieprzechodni (bez dopełnienia)"},
    "타동사 (목적어 있음)": {"cs": "Přechodné (s předmětem)", "zh_cn": "及物动词（有受词）", "zh": "及物動詞（有受詞）", "en": "Transitive (has object)", "fr": "Transitif (avec complément d'objet)", "de": "Transitiv (mit Objekt)", "hu": "Tárgyas (van tárgy)", "id": "Transitif (dengan objek)", "ja": "他動詞（目的語あり）", "pl": "Przechodni (z dopełnieniem)"},
    "과거형(선택, 비우면 자동생성) 예: 요리했": {"cs": "minulý čas (volitelné, generuje se automaticky)", "zh_cn": "过去式（可选，留空则自动生成）例：요리했", "zh": "過去式（可選，留空則自動生成）例：요리했", "en": "past form (optional, auto-generated if left blank) e.g. 요리했", "fr": "forme passée (facultatif), ex. : a cuisiné", "de": "Vergangenheitsform (optional), z. B. kochte", "hu": "múlt idő (választható, automatikus)", "id": "bentuk lampau (opsional, otomatis jika kosong)", "ja": "過去形（任意、空欄なら自動生成）例：요리했", "pl": "forma przeszła (opcjonalnie), np. gotował"},
    "목적어 (타동사를 골랐을 때만 적용돼요)": {"cs": "Předmět (platí pouze při volbě přechodného slovesa)", "zh_cn": "受词（只有选了及物动词才会套用）", "zh": "受詞（只有選了及物動詞才會套用）", "en": "Object (applies only when a transitive verb is chosen)", "fr": "Objet (s'applique uniquement avec un verbe transitif)", "de": "Objekt (nur bei transitiven Verben wirksam)", "hu": "Tárgy (csak tárgyas ige választása esetén érvényes)", "id": "Objek (hanya berlaku jika kata kerja transitif dipilih)", "ja": "目的語（他動詞を選んだときのみ適用）", "pl": "Dopełnienie (dotyczy tylko czasowników przechodnich)"},
    "예: bức thư": {"zh_cn": "例：bức thư", "zh": "例：bức thư", "en": "e.g. bức thư", "fr": "ex. : bức thư", "de": "z. B. bức thư", "ja": "例：bức thư", "pl": "np. bức thư"},
    "예: 편지": {"zh_cn": "例：信", "zh": "例：信", "en": "e.g. letter", "fr": "ex. : lettre", "de": "z. B. Brief", "ja": "例：手紙", "pl": "np. list"},
    "명사 (동사로 'là(이다)'를 골랐을 때, 주어를 설명하는 명사예요: 주어+là+명사)": {"cs": "Podstatné jméno (při volbě slovesa 'là' (být) toto jméno popisuje podmět: podmět + là + jméno)", "zh_cn": "名词（选了动词 'là(是)' 时，用来说明主语的名词：主语+là+名词）", "zh": "名詞（選了動詞 'là(是)' 時，用來說明主語的名詞：主語+là+名詞）", "en": "Noun (when the verb 'là' (be) is chosen, this noun describes the subject: subject + là + noun)", "fr": "Nom (avec le verbe « là » [être], nom attribut du sujet : sujet + là + nom)", "de": "Nomen (wenn als Verb „là“ (sein) gewählt wurde: Subjekt + là + Nomen)", "hu": "Főnév (ha a 'là' (lenni) igét választja, ez a főnév írja le az alanyt: alany + là + főnév)", "id": "Kata benda (ketika kata kerja 'là' (adalah) dipilih, kata benda ini menerangkan subjek: subjek + là + kata benda)", "ja": "名詞（動詞「là（だ）」を選んだとき、主語を説明する名詞：主語+là+名詞）", "pl": "Rzeczownik (przy czasowniku „là” [być]: podmiot + là + rzeczownik)"},
    "예: người tiên phong": {"zh_cn": "例：người tiên phong", "zh": "例：người tiên phong", "en": "e.g. người tiên phong", "fr": "ex. : người tiên phong", "de": "z. B. người tiên phong", "ja": "例：người tiên phong", "pl": "np. người tiên phong"},
    "예: 파이오니아": {"zh_cn": "例：先锋", "zh": "例：先鋒", "en": "e.g. pioneer", "fr": "ex. : pionnier", "de": "z. B. Pionier", "ja": "例：開拓者", "pl": "np. pionier"},
    "전치사 (với 등)": {"cs": "Předložka (với apod.)", "zh_cn": "介系词（với 等）", "zh": "介係詞（với 等）", "en": "Preposition (với etc.)", "fr": "Préposition (với etc.)", "de": "Präposition (với usw.)", "hu": "Elöljárószó (với stb.)", "id": "Preposisi (với dll.)", "ja": "前置詞（với など）", "pl": "Przyimek (với itd.)"},
    "예: với anh trai": {"zh_cn": "例：với anh trai", "zh": "例：với anh trai", "en": "e.g. với anh trai", "fr": "ex. : với anh trai", "de": "z. B. với anh trai", "ja": "例：với anh trai", "pl": "np. với anh trai"},
    "예: 형과": {"zh_cn": "例：跟哥哥", "zh": "例：跟哥哥", "en": "e.g. with older brother", "fr": "ex. : avec le grand frère", "de": "z. B. mit dem älteren Bruder", "ja": "例：兄と", "pl": "np. ze starszym bratem"},
    "형용사 (목적어·명사가 있으면 그것을, 없으면 명사 주어를 꾸며요)": {"cs": "Přídavné jméno (rozvíjí předmět/podstatné jméno, jinak podmět)", "zh_cn": "形容词（若有受词·名词就修饰它，没有的话就修饰名词主语）", "zh": "形容詞（若有受詞·名詞就修飾它，沒有的話就修飾名詞主語）", "en": "Adjective (modifies the object/noun if present, otherwise the noun subject)", "fr": "Adjectif (qualifie l'objet/le nom, ou le sujet nominal sinon)", "de": "Adjektiv (beschreibt das Objekt/Nomen oder das Subjekt)", "hu": "Melléknév (a tárgyat/főnevet módosítja, ha van, egyébként az alanyt)", "id": "Kata sifat (menerangkan objek/kata benda jika ada, jika tidak menerangkan subjek)", "ja": "形容詞（目的語・名詞があればそれを、なければ名詞主語を修飾）", "pl": "Przymiotnik (określa dopełnienie/rzeczownik lub podmiot)"},
    "예: vui": {"cs": "např. vui", "zh_cn": "例：vui", "zh": "例：vui", "en": "e.g. vui", "fr": "ex. : vui", "de": "z. B. vui", "hu": "pl. vui", "id": "contoh: vui", "ja": "例：vui", "pl": "np. vui"},
    "사전형, 예: 기쁘다": {"cs": "základní tvar, např. mít radost", "zh_cn": "辞典形，例：기쁘다", "zh": "辭典形，例：기쁘다", "en": "dictionary form, e.g. 기쁘다", "fr": "forme du dictionnaire, ex. : être joyeux", "de": "Grundform, z. B. erfreut sein", "hu": "szótári alak, pl. örül", "id": "bentuk kamus, misal: senang", "ja": "辞書形、例：기쁘다", "pl": "forma słownikowa, np. radosny"},
    "관형사형(선택) 예: 기쁜": {"cs": "přívlastkový tvar (volitelné)", "zh_cn": "冠形词形（可选）例：기쁜", "zh": "冠形詞形（可選）例：기쁜", "en": "attributive form (optional) e.g. 기쁜", "fr": "forme épithète (facultatif), ex. : joyeux", "de": "Attributiv (optional), z. B. erfreut", "hu": "melléknévi alak (választható)", "id": "bentuk atributif (opsional)", "ja": "連体形（任意）例：기쁜", "pl": "forma przydawkowa (opcjonalnie), np. radosny"},
    "과거형(선택) 예: 기뻤": {"cs": "minulý čas (volitelné)", "zh_cn": "过去式（可选）例：기뻤", "zh": "過去式（可選）例：기뻤", "en": "past form (optional) e.g. 기뻤", "fr": "forme passée (facultatif), ex. : était joyeux", "de": "Vergangenheit (optional), z. B. war erfreut", "hu": "múlt idő (választható)", "id": "bentuk lampau (opsional)", "ja": "過去形（任意）例：기뻤", "pl": "forma przeszła (opcjonalnie), np. był radosny"},
    "상태부사 (어떻게)": {"cs": "Příslovce způsobu (jak)", "zh_cn": "状态副词（怎么样）", "zh": "狀態副詞（怎麼樣）", "en": "Adverb of manner (how)", "fr": "Adverbe de manière (comment)", "de": "Modaladverb (wie)", "hu": "Módhatározó (hogyan)", "id": "Keterangan cara (bagaimana)", "ja": "様態副詞（どのように）", "pl": "Przysłówek sposobu (jak)"},
    "예: lặng lẽ": {"zh_cn": "例：lặng lẽ", "zh": "例：lặng lẽ", "en": "e.g. lặng lẽ", "fr": "ex. : lặng lẽ", "de": "z. B. lặng lẽ", "ja": "例：lặng lẽ", "pl": "np. lặng lẽ"},
    "예: 조용히": {"zh_cn": "例：安静地", "zh": "例：安靜地", "en": "e.g. quietly", "fr": "ex. : silencieusement", "de": "z. B. leise", "ja": "例：静かに", "pl": "np. cicho"},
    "장소부사 (어디에서·어디로) — 장소 명사만 입력하면 동사에 맞는 ở/đến이 자동으로 붙어요": {"cs": "Příslovce místa (kde/kam) — stačí zadat název místa, ở/đến se doplní automaticky podle slovesa", "zh_cn": "地点副词（在哪里·去哪里）— 只要输入地点名词，系统会依动词自动加上 ở/đến", "zh": "地點副詞（在哪裡·去哪裡）— 只要輸入地點名詞，系統會依動詞自動加上 ở/đến", "en": "Place adverb (where at / where to) — just enter the place noun; ở/đến is added automatically to match the verb", "fr": "Adverbe de lieu (où / vers où) — saisissez seulement le nom de lieu ; ở/đến s'ajoute automatiquement selon le verbe", "de": "Lokaladverb (wo/wohin) — geben Sie nur das Ortsnomen ein; ở/đến wird passend zum Verb ergänzt", "hu": "Helyhatározó (hol/hová) — csak írja be a helyet, az ở/đến automatikusan illeszkedik az igéhez", "id": "Keterangan tempat (di mana / ke mana) — cukup masukkan tempat, ở/đến otomatis disesuaikan dengan kata kerja", "ja": "場所副詞（どこで・どこへ）— 場所の名詞だけ入力すれば、動詞に合わせて ở/đến が自動で付きます", "pl": "Przysłówek miejsca (gdzie/dokąd) — wpisz tylko nazwę miejsca; ở/đến doda się automatycznie"},
    "장소 명사만, 예: thư viện": {"zh_cn": "只要地点名词，例：thư viện", "zh": "只要地點名詞，例：thư viện", "en": "place noun only, e.g. thư viện", "fr": "nom de lieu seul, ex. : thư viện", "de": "Nur das Ortsnomen, z. B. thư viện", "ja": "場所の名詞だけ、例：thư viện", "pl": "sama nazwa miejsca, np. thư viện"},
    "예: 도서관": {"zh_cn": "例：图书馆", "zh": "例：圖書館", "en": "e.g. library", "fr": "ex. : bibliothèque", "de": "z. B. Bibliothek", "ja": "例：図書館", "pl": "np. biblioteka"},
    "시간부사 (언제)": {"cs": "Příslovce času (kdy)", "zh_cn": "时间副词（何时）", "zh": "時間副詞（何時）", "en": "Adverb of time (when)", "fr": "Adverbe de temps (quand)", "de": "Temporaladverb (wann)", "hu": "Időhatározó (mikor)", "id": "Keterangan waktu (kapan)", "ja": "時間副詞（いつ）", "pl": "Przysłówek czasu (kiedy)"},
    "예: tuần sau": {"zh_cn": "例：tuần sau", "zh": "例：tuần sau", "en": "e.g. tuần sau", "fr": "ex. : tuần sau", "de": "z. B. tuần sau", "ja": "例：tuần sau", "pl": "np. tuần sau"},
    "예: 다음 주": {"zh_cn": "例：下周", "zh": "例：下週", "en": "e.g. next week", "fr": "ex. : la semaine prochaine", "de": "z. B. nächste Woche", "ja": "例：来週", "pl": "np. w przyszłym tygodniu"},
    "자동사": {"cs": "Nepřechodné sloveso", "zh_cn": "不及物动词", "zh": "不及物動詞", "en": "Intransitive", "fr": "Intransitif", "de": "Intransitiv", "hu": "Tárgyatlan ige", "id": "Intransitif", "ja": "自動詞", "pl": "Czasownik nieprzechodni"},
    "타동사": {"cs": "Přechodné sloveso", "zh_cn": "及物动词", "zh": "及物動詞", "en": "Transitive", "fr": "Transitif", "de": "Transitiv", "hu": "Tárgyas ige", "id": "Transitif", "ja": "他動詞", "pl": "Czasownik przechodni"},
    "대명사": {"cs": "Zájmeno", "zh_cn": "代名词", "zh": "代名詞", "en": "Pronoun", "fr": "Pronom", "de": "Pronomen", "hu": "Névmás", "id": "Kata Ganti", "ja": "代名詞", "pl": "Zaimek"},
    "명사": {"cs": "Podstatné jméno", "zh_cn": "名词", "zh": "名詞", "en": "Noun", "fr": "Nom", "de": "Nomen", "hu": "Főnév", "id": "Kata Benda", "ja": "名詞", "pl": "Rzeczownik"},
    "직접 입력한 동사·형용사·보조동사는 활용이 적용되지 않고, 입력한 뜻 그대로 문장에 표시돼요.": {"zh_cn": "手动输入的动词·形容词·辅助动词不会套用词形变化，会直接以您输入的意思显示在句子里。", "zh": "手動輸入的動詞·形容詞·輔助動詞不會套用詞形變化，會直接以您輸入的意思顯示在句子裡。", "en": "Custom verbs, adjectives, and auxiliary verbs are not conjugated — they appear in the sentence exactly as the meaning you typed.", "fr": "Les verbes, adjectifs et modaux saisis manuellement ne sont pas fléchis et apparaissent exactement tels que saisis.", "de": "Selbst eingegebene Verben, Adjektive und Modalverben werden nicht gebeugt, sondern genau wie eingegeben im Satz angezeigt.", "ja": "直接入力した動詞・形容詞・補助動詞には活用が適用されず、入力した意味がそのまま文に表示されます。", "pl": "Wpisane własne czasowniki, przymiotniki i modale nie podlegają odmianie i pojawiają się dokładnie w podanej formie."},
    "가족 호칭 가계도": {"cs": "Rodokmen rodinných oslovení", "zh_cn": "家族称谓家谱图", "zh": "家族稱謂家譜圖", "en": "Family Address-Term Tree", "fr": "Arbre généalogique des termes de parenté", "de": "Stammbaum der familiären Anredeformen", "hu": "Családi megszólítások fája", "id": "Bagan Sebutan Keluarga", "ja": "家族の呼び方系図", "pl": "Drzewo genealogiczne form pokrewieństwa"},
    "직계 4대(증조부모~증손주)와 혼인으로 맺어지는 사돈 쪽 호칭을 하나의 가계도로 정리했어요.": {"cs": "Přehledný rodokmen pokrývající čtyři přímé generace (od pradraodičů po pravnoučata) a příbuzenské vztahy vzniklé sňatkem.", "zh_cn": "把直系四代（曾祖父母~曾孙）以及因婚姻而形成的亲家称谓整理成一张家谱图。", "zh": "把直系四代（曾祖父母~曾孫）以及因婚姻而形成的親家稱謂整理成一張家譜圖。", "en": "One family tree covering four direct generations (great-grandparents to great-grandchildren) plus the in-law terms that come with marriage.", "fr": "Un arbre généalogique complet couvrant 4 générations directes (des arrière-grands-parents aux arrière-petits-enfants) ainsi que les liens par alliance.", "de": "Ein Stammbaum über 4 Generationen (Urgroßeltern bis Urenkel) samt angeheirateten Verwandten.", "hu": "Egyetlen családfa, amely négy közvetlen generációt (dédszülőktől a dédunokákig) és a házassággal létrejött rokoni megszólításokat mutatja be.", "id": "Satu bagan silsilah keluarga yang mencakup empat generasi langsung (buyut hingga cicit) serta sebutan kekerabatan melalui pernikahan.", "ja": "直系四代（曾祖父母~ひ孫）と、結婚によってできる姻戚の呼び方を一つの家系図にまとめました。", "pl": "Jedno drzewo genealogiczne obejmujące 4 pokolenia w linii prostej (od pradziadków do prawnuków) oraz powinowatych."},
    "혼인으로 맺어지는 사돈 쪽 호칭": {"cs": "Příbuzenská oslovení vzniklá sňatkem", "zh_cn": "因婚姻而形成的亲家称谓", "zh": "因婚姻而形成的親家稱謂", "en": "In-law terms formed through marriage", "fr": "Termes de parenté par alliance (beaux-parents, belle-famille)", "de": "Angeheiratete Verwandtschaft", "hu": "Házasság révén létrejött rokoni megszólítások", "id": "Sebutan kekerabatan yang terbentuk melalui pernikahan", "ja": "結婚で結ばれる姻戚の呼び方", "pl": "Nazwy pokrewieństwa przez małżeństwo (powinowaci)"},
    "증조부모": {"zh_cn": "曾祖父母", "zh": "曾祖父母", "en": "Great-grandparents", "fr": "Arrière-grands-parents", "de": "Urgroßeltern", "ja": "曾祖父母", "pl": "Pradziadkowie"},
    "조부모": {"zh_cn": "祖父母", "zh": "祖父母", "en": "Grandparents", "fr": "Grands-parents", "de": "Großeltern", "ja": "祖父母", "pl": "Dziadkowie"},
    "부모": {"zh_cn": "父母", "zh": "父母", "en": "Parents", "fr": "Parents", "de": "Eltern", "ja": "両親", "pl": "Rodzice"},
    "나·형제자매·배우자": {"zh_cn": "我‧兄弟姊妹‧配偶", "zh": "我‧兄弟姊妹‧配偶", "en": "Me, siblings & spouse", "fr": "Moi, frères et sœurs, conjoint", "de": "Ich, Geschwister & Ehepartner", "ja": "私・兄弟姉妹・配偶者", "pl": "Ja, rodzeństwo i współmałżonek"},
    "자녀": {"zh_cn": "子女", "zh": "子女", "en": "Children", "fr": "Enfants", "de": "Kinder", "ja": "子ども", "pl": "Dzieci"},
    "손주": {"zh_cn": "孙子女", "zh": "孫子女", "en": "Grandchildren", "fr": "Petits-enfants", "de": "Enkel", "ja": "孫", "pl": "Wnuki"},
    "증손주": {"zh_cn": "曾孙子女", "zh": "曾孫子女", "en": "Great-grandchildren", "fr": "Arrière-petits-enfants", "de": "Urenkel", "ja": "ひ孫", "pl": "Prawnuki"},
    "친가(아버지 쪽)": {"zh_cn": "父系（父亲那边）", "zh": "父系（父親那邊）", "en": "Paternal side (father's side)", "fr": "Côté paternel", "de": "Väterlicherseits", "ja": "父方（父の実家）", "pl": "Po mieczu (od strony ojca)"},
    "외가(어머니 쪽)": {"zh_cn": "母系（母亲那边）", "zh": "母系（母親那邊）", "en": "Maternal side (mother's side)", "fr": "Côté maternel", "de": "Mütterlicherseits", "ja": "母方（母の実家）", "pl": "Po kądzieli (od strony matki)"},
    "형제자매": {"zh_cn": "兄弟姊妹", "zh": "兄弟姊妹", "en": "Siblings", "fr": "Frères et sœurs", "de": "Geschwister", "ja": "兄弟姉妹", "pl": "Rodzeństwo"},
    "배우자": {"zh_cn": "配偶", "zh": "配偶", "en": "Spouse", "fr": "Conjoint", "de": "Ehepartner", "ja": "配偶者", "pl": "Współmałżonek"},
    "며느리·사위": {"zh_cn": "媳妇‧女婿", "zh": "媳婦‧女婿", "en": "Children's spouses", "fr": "Belle-fille / Gendre", "de": "Schwiegerkinder", "ja": "嫁・婿", "pl": "Synowa / Zięć"},
    "친손(아들의 자녀)": {"zh_cn": "孙（儿子的子女）", "zh": "孫（兒子的子女）", "en": "Grandchildren via son", "fr": "Petits-enfants (par le fils)", "de": "Enkel (über den Sohn)", "ja": "息子の子（内孫）", "pl": "Wnuki (od syna)"},
    "외손(딸의 자녀)": {"zh_cn": "外孙（女儿的子女）", "zh": "外孫（女兒的子女）", "en": "Grandchildren via daughter", "fr": "Petits-enfants (par la fille)", "de": "Enkel (über die Tochter)", "ja": "娘の子（外孫）", "pl": "Wnuki (od córki)"},
    "친증손(아들 쪽 손주의 자녀)": {"zh_cn": "曾孙（儿子那边孙子女的子女）", "zh": "曾孫（兒子那邊孫子女的子女）", "en": "Great-grandchildren via son's line", "fr": "Arrière-petits-enfants (lignée du fils)", "de": "Urenkel (Linie des Sohnes)", "ja": "息子側のひ孫", "pl": "Prawnuki (z linii syna)"},
    "외증손(딸 쪽 손주의 자녀)": {"zh_cn": "外曾孙（女儿那边孙子女的子女）", "zh": "外曾孫（女兒那邊孫子女的子女）", "en": "Great-grandchildren via daughter's line", "fr": "Arrière-petits-enfants (lignée de la fille)", "de": "Urenkel (Linie der Tochter)", "ja": "娘側のひ孫", "pl": "Prawnuki (z linii córki)"},
    "배우자의 부모님": {"zh_cn": "配偶的父母", "zh": "配偶的父母", "en": "Spouse's parents", "fr": "Beaux-parents", "de": "Schwiegereltern", "ja": "配偶者の両親", "pl": "Teściowie"},
    "남편의 부모(아내 입장)": {"zh_cn": "丈夫的父母（妻子的立场）", "zh": "丈夫的父母（妻子的立場）", "en": "Husband's parents (from the wife's side)", "fr": "Parents du mari (du point de vue de l'épouse)", "de": "Schwiegereltern (aus Sicht der Ehefrau)", "ja": "夫の両親（妻の立場）", "pl": "Rodzice męża (z punktu widzenia żony)"},
    "아내의 부모(남편 입장)": {"zh_cn": "妻子的父母（丈夫的立场）", "zh": "妻子的父母（丈夫的立場）", "en": "Wife's parents (from the husband's side)", "fr": "Parents de l'épouse (du point de vue du mari)", "de": "Schwiegereltern (aus Sicht des Ehemanns)", "ja": "妻の両親（夫の立場）", "pl": "Rodzice żony (z punktu widzenia męża)"},
    "배우자의 형제자매": {"zh_cn": "配偶的兄弟姊妹", "zh": "配偶的兄弟姊妹", "en": "Spouse's siblings", "fr": "Beaux-frères et belles-sœurs", "de": "Geschwister des Ehepartners", "ja": "配偶者の兄弟姉妹", "pl": "Rodzeństwo współmałżonka (szwagrowie/szwagierki)"},
    "남편의 형제자매(아내 입장)": {"zh_cn": "丈夫的兄弟姊妹（妻子的立场）", "zh": "丈夫的兄弟姊妹（妻子的立場）", "en": "Husband's siblings (from the wife's side)", "fr": "Frères et sœurs du mari (du point de vue de l'épouse)", "de": "Schwäger/Schwägerinnen (aus Sicht der Ehefrau)", "ja": "夫の兄弟姉妹（妻の立場）", "pl": "Rodzeństwo męża (z punktu widzenia żony)"},
    "아내의 형제자매(남편 입장)": {"zh_cn": "妻子的兄弟姊妹（丈夫的立场）", "zh": "妻子的兄弟姊妹（丈夫的立場）", "en": "Wife's siblings (from the husband's side)", "fr": "Frères et sœurs de l'épouse (du point de vue du mari)", "de": "Schwäger/Schwägerinnen (aus Sicht des Ehemanns)", "ja": "妻の兄弟姉妹（夫の立場）", "pl": "Rodzeństwo żony (z punktu widzenia męża)"},
    "형제자매의 배우자": {"zh_cn": "兄弟姊妹的配偶", "zh": "兄弟姊妹的配偶", "en": "Siblings' spouses", "fr": "Conjoints des frères et sœurs", "de": "Ehepartner der Geschwister", "ja": "兄弟姉妹の配偶者", "pl": "Współmałżonkowie rodzeństwa"},
    "오빠·남동생의 아내": {"zh_cn": "哥哥‧弟弟的妻子", "zh": "哥哥‧弟弟的妻子", "en": "Older/younger brother's wife", "fr": "Épouse du frère (belle-sœur)", "de": "Ehefrau des Bruders (Schwägerin)", "ja": "兄・弟の妻", "pl": "Żona brata (bratowa)"},
    "언니·여동생의 남편": {"zh_cn": "姊姊‧妹妹的丈夫", "zh": "姊姊‧妹妹的丈夫", "en": "Older/younger sister's husband", "fr": "Époux de la sœur (beau-frère)", "de": "Ehemann der Schwester (Schwager)", "ja": "姉・妹の夫", "pl": "Mąż siostry (szwagier)"},
    "자녀의 배우자 쪽 부모": {"zh_cn": "子女配偶的父母", "zh": "子女配偶的父母", "en": "Children's spouses' parents", "fr": "Parents du gendre ou de la belle-fille (co-beaux-parents)", "de": "Eltern des Schwiegerkindes", "ja": "子どもの配偶者の両親", "pl": "Rodzice zięcia lub synowej (współteściowie)"},
    "사돈": {"zh_cn": "亲家", "zh": "親家", "en": "Co-parents-in-law", "fr": "Co-beaux-parents", "de": "Gegenschwiegereltern", "ja": "サドン（子の配偶者の親同士）", "pl": "Współteściowie"},
    "증조할아버지": {"zh_cn": "曾祖父", "zh": "曾祖父", "en": "Great-grandfather (paternal)", "fr": "Arrière-grand-père (paternel)", "de": "Urgroßvater (väterlicherseits)", "ja": "曾祖父（父方）", "pl": "Pradziadek (ze strony ojca)"},
    "증조할머니": {"zh_cn": "曾祖母", "zh": "曾祖母", "en": "Great-grandmother (paternal)", "fr": "Arrière-grand-mère (paternelle)", "de": "Urgroßmutter (väterlicherseits)", "ja": "曾祖母（父方）", "pl": "Prababcia (ze strony ojca)"},
    "외증조할아버지": {"zh_cn": "外曾祖父", "zh": "外曾祖父", "en": "Great-grandfather (maternal)", "fr": "Arrière-grand-père (maternel)", "de": "Urgroßvater (mütterlicherseits)", "ja": "曾祖父（母方）", "pl": "Pradziadek (ze strony matki)"},
    "외증조할머니": {"zh_cn": "外曾祖母", "zh": "外曾祖母", "en": "Great-grandmother (maternal)", "fr": "Arrière-grand-mère (maternelle)", "de": "Urgroßmutter (mütterlicherseits)", "ja": "曾祖母（母方）", "pl": "Prababcia (ze strony matki)"},
    "할아버지": {"zh_cn": "爷爷", "zh": "爺爺", "en": "Grandfather (paternal)", "fr": "Grand-père (paternel)", "de": "Großvater (väterlicherseits)", "ja": "祖父（父方）", "pl": "Dziadek (ze strony ojca)"},
    "할머니": {"zh_cn": "奶奶", "zh": "奶奶", "en": "Grandmother (paternal)", "fr": "Grand-mère (paternelle)", "de": "Großmutter (väterlicherseits)", "ja": "祖母（父方）", "pl": "Babcia (ze strony ojca)"},
    "외할아버지": {"zh_cn": "外公", "zh": "外公", "en": "Grandfather (maternal)", "fr": "Grand-père (maternel)", "de": "Großvater (mütterlicherseits)", "ja": "祖父（母方）", "pl": "Dziadek (ze strony matki)"},
    "외할머니": {"zh_cn": "外婆", "zh": "外婆", "en": "Grandmother (maternal)", "fr": "Grand-mère (maternelle)", "de": "Großmutter (mütterlicherseits)", "ja": "祖母（母方）", "pl": "Babcia (ze strony matki)"},
    "아버지": {"zh_cn": "父亲", "zh": "父親", "en": "Father", "fr": "Père", "de": "Vater", "ja": "父", "pl": "Ojciec"},
    "어머니": {"zh_cn": "母亲", "zh": "母親", "en": "Mother", "fr": "Mère", "de": "Mutter", "ja": "母", "pl": "Matka"},
    "남동생": {"zh_cn": "弟弟", "zh": "弟弟", "en": "Younger brother", "fr": "Petit frère", "de": "Jüngerer Bruder", "ja": "弟", "pl": "Młodszy brat"},
    "여동생": {"zh_cn": "妹妹", "zh": "妹妹", "en": "Younger sister", "fr": "Petite sœur", "de": "Jüngere Schwester", "ja": "妹", "pl": "Młodsza siostra"},
    "남편": {"zh_cn": "丈夫", "zh": "丈夫", "en": "Husband", "fr": "Mari", "de": "Ehemann", "ja": "夫", "pl": "Mąż"},
    "아내": {"zh_cn": "妻子", "zh": "妻子", "en": "Wife", "fr": "Femme (épouse)", "de": "Ehefrau", "ja": "妻", "pl": "Żona"},
    "아들": {"zh_cn": "儿子", "zh": "兒子", "en": "Son", "fr": "Fils", "de": "Sohn", "ja": "息子", "pl": "Syn"},
    "딸": {"zh_cn": "女儿", "zh": "女兒", "en": "Daughter", "fr": "Fille", "de": "Tochter", "ja": "娘", "pl": "Córka"},
    "며느리": {"zh_cn": "媳妇", "zh": "媳婦", "en": "Daughter-in-law", "fr": "Belle-fille", "de": "Schwiegertochter", "ja": "嫁（息子の妻）", "pl": "Synowa"},
    "사위": {"zh_cn": "女婿", "zh": "女婿", "en": "Son-in-law", "fr": "Gendre", "de": "Schwiegersohn", "ja": "婿（娘の夫）", "pl": "Zięć"},
    "친손자": {"zh_cn": "孙子", "zh": "孫子", "en": "Grandson (via son)", "fr": "Petit-fils (par le fils)", "de": "Enkelsohn (vom Sohn)", "ja": "孫息子（内孫）", "pl": "Wnuk (od syna)"},
    "친손녀": {"zh_cn": "孙女", "zh": "孫女", "en": "Granddaughter (via son)", "fr": "Petite-fille (par le fils)", "de": "Enkeltochter (vom Sohn)", "ja": "孫娘（内孫）", "pl": "Wnuczka (od syna)"},
    "외손자": {"zh_cn": "外孙", "zh": "外孫", "en": "Grandson (via daughter)", "fr": "Petit-fils (par la fille)", "de": "Enkelsohn (von der Tochter)", "ja": "孫息子（外孫）", "pl": "Wnuk (od córki)"},
    "외손녀": {"zh_cn": "外孙女", "zh": "外孫女", "en": "Granddaughter (via daughter)", "fr": "Petite-fille (par la fille)", "de": "Enkeltochter (von der Tochter)", "ja": "孫娘（外孫）", "pl": "Wnuczka (od córki)"},
    "친증손자": {"zh_cn": "曾孙", "zh": "曾孫", "en": "Great-grandson (son's line)", "fr": "Arrière-petit-fils (par le fils)", "de": "Urenkel (vom Sohn)", "ja": "ひ孫息子（内系）", "pl": "Prawnuk (z linii syna)"},
    "친증손녀": {"zh_cn": "曾孙女", "zh": "曾孫女", "en": "Great-granddaughter (son's line)", "fr": "Arrière-petite-fille (par le fils)", "de": "Urenkelin (vom Sohn)", "ja": "ひ孫娘（内系）", "pl": "Prawnuczka (z linii syna)"},
    "외증손자": {"zh_cn": "外曾孙", "zh": "外曾孫", "en": "Great-grandson (daughter's line)", "fr": "Arrière-petit-fils (par la fille)", "de": "Urenkel (von der Tochter)", "ja": "ひ孫息子（外系）", "pl": "Prawnuk (z linii córki)"},
    "외증손녀": {"zh_cn": "外曾孙女", "zh": "外曾孫女", "en": "Great-granddaughter (daughter's line)", "fr": "Arrière-petite-fille (par la fille)", "de": "Urenkelin (von der Tochter)", "ja": "ひ孫娘（外系）", "pl": "Prawnuczka (z linii córki)"},
    "시아버지(남편의 아버지)": {"zh_cn": "公公（丈夫的父亲）", "zh": "公公（丈夫的父親）", "en": "Father-in-law (husband's father)", "fr": "Beau-père (père du mari)", "de": "Schwiegervater (Vater des Ehemanns)", "ja": "義父（夫の父）", "pl": "Teść (ojciec męża)"},
    "시어머니(남편의 어머니)": {"zh_cn": "婆婆（丈夫的母亲）", "zh": "婆婆（丈夫的母親）", "en": "Mother-in-law (husband's mother)", "fr": "Belle-mère (mère du mari)", "de": "Schwiegermutter (Mutter des Ehemanns)", "ja": "義母（夫の母）", "pl": "Teściowa (matka męża)"},
    "장인(아내의 아버지)": {"zh_cn": "岳父（妻子的父亲）", "zh": "岳父（妻子的父親）", "en": "Father-in-law (wife's father)", "fr": "Beau-père (père de la femme)", "de": "Schwiegervater (Vater der Ehefrau)", "ja": "義父（妻の父）", "pl": "Teść (ojciec żony)"},
    "장모(아내의 어머니)": {"zh_cn": "岳母（妻子的母亲）", "zh": "岳母（妻子的母親）", "en": "Mother-in-law (wife's mother)", "fr": "Belle-mère (mère de la femme)", "de": "Schwiegermutter (Mutter der Ehefrau)", "ja": "義母（妻の母）", "pl": "Teściowa (matka żony)"},
    "아주버님(남편의 형)": {"zh_cn": "大伯（丈夫的哥哥）", "zh": "大伯（丈夫的哥哥）", "en": "Husband's older brother", "fr": "Beau-frère (grand frère du mari)", "de": "Älterer Bruder des Ehemanns (Schwager)", "ja": "夫の兄", "pl": "Szwagier (starszy brat męża)"},
    "손위 시누이(남편의 누나)": {"zh_cn": "大姑（丈夫的姊姊）", "zh": "大姑（丈夫的姊姊）", "en": "Husband's older sister", "fr": "Belle-sœur (grande sœur du mari)", "de": "Ältere Schwester des Ehemanns (Schwägerin)", "ja": "夫の姉", "pl": "Szwagierka (starsza siostra męża)"},
    "시동생(남편의 남동생)": {"zh_cn": "小叔（丈夫的弟弟）", "zh": "小叔（丈夫的弟弟）", "en": "Husband's younger brother", "fr": "Beau-frère (petit frère du mari)", "de": "Jüngerer Bruder des Ehemanns (Schwager)", "ja": "夫の弟", "pl": "Szwagier (młodszy brat męża)"},
    "손아래 시누이(남편의 여동생)": {"zh_cn": "小姑（丈夫的妹妹）", "zh": "小姑（丈夫的妹妹）", "en": "Husband's younger sister", "fr": "Belle-sœur (petite sœur du mari)", "de": "Jüngere Schwester des Ehemanns (Schwägerin)", "ja": "夫の妹", "pl": "Szwagierka (młodsza siostra męża)"},
    "손위 처남(아내의 오빠)": {"zh_cn": "大舅子（妻子的哥哥）", "zh": "大舅子（妻子的哥哥）", "en": "Wife's older brother", "fr": "Beau-frère (grand frère de la femme)", "de": "Älterer Bruder der Ehefrau (Schwager)", "ja": "妻の兄", "pl": "Szwagier (starszy brat żony)"},
    "처형(아내의 언니)": {"zh_cn": "大姨子（妻子的姊姊）", "zh": "大姨子（妻子的姊姊）", "en": "Wife's older sister", "fr": "Belle-sœur (grande sœur de la femme)", "de": "Ältere Schwester der Ehefrau (Schwägerin)", "ja": "妻の姉", "pl": "Szwagierka (starsza siostra żony)"},
    "손아래 처남(아내의 남동생)": {"zh_cn": "小舅子（妻子的弟弟）", "zh": "小舅子（妻子的弟弟）", "en": "Wife's younger brother", "fr": "Beau-frère (petit frère de la femme)", "de": "Jüngerer Bruder der Ehefrau (Schwager)", "ja": "妻の弟", "pl": "Szwagier (młodszy brat żony)"},
    "처제(아내의 여동생)": {"zh_cn": "小姨子（妻子的妹妹）", "zh": "小姨子（妻子的妹妹）", "en": "Wife's younger sister", "fr": "Belle-sœur (petite sœur de la femme)", "de": "Jüngere Schwester der Ehefrau (Schwägerin)", "ja": "妻の妹", "pl": "Szwagierka (młodsza siostra żony)"},
    "올케(오빠의 아내)": {"zh_cn": "嫂子（哥哥的妻子）", "zh": "嫂子（哥哥的妻子）", "en": "Older brother's wife", "fr": "Belle-sœur (épouse du grand frère)", "de": "Ehefrau des älteren Bruders", "ja": "兄の妻", "pl": "Bratowa (żona starszego brata)"},
    "올케(남동생의 아내)": {"zh_cn": "弟妹（弟弟的妻子）", "zh": "弟妹（弟弟的妻子）", "en": "Younger brother's wife", "fr": "Belle-sœur (épouse du petit frère)", "de": "Ehefrau des jüngeren Bruders", "ja": "弟の妻", "pl": "Bratowa (żona młodszego brata)"},
    "형부(언니의 남편)": {"zh_cn": "姊夫（姊姊的丈夫）", "zh": "姊夫（姊姊的丈夫）", "en": "Older sister's husband", "fr": "Beau-frère (mari de la grande sœur)", "de": "Ehemann der älteren Schwester", "ja": "姉の夫", "pl": "Szwagier (mąż starszej siostry)"},
    "제부(여동생의 남편)": {"zh_cn": "妹夫（妹妹的丈夫）", "zh": "妹夫（妹妹的丈夫）", "en": "Younger sister's husband", "fr": "Beau-frère (mari de la petite sœur)", "de": "Ehemann der jüngeren Schwester", "ja": "妹の夫", "pl": "Szwagier (mąż młodszej siostry)"},
    "사돈(자녀 배우자의 부모)": {"zh_cn": "亲家（子女配偶的父母）", "zh": "親家（子女配偶的父母）", "en": "Co-parents-in-law (child's spouse's parents)", "fr": "Co-beaux-parents (parents du conjoint de son enfant)", "de": "Eltern des Schwiegerkindes", "ja": "サドン（子の配偶者の親）", "pl": "Współteściowie"},
    "사돈을 맺다": {"zh_cn": "结为亲家", "zh": "結為親家", "en": "To become co-parents-in-law", "fr": "S'allier par le mariage de ses enfants", "de": "Verschwägert werden", "ja": "サドン（姻戚）の関係を結ぶ", "pl": "Spokrewnić się przez ślub dzieci"},
    "사돈어른(바깥사돈)": {"zh_cn": "亲家公（男方亲家）", "zh": "親家公（男方親家）", "en": "Male co-parent-in-law", "fr": "Co-beau-père", "de": "Schwiegerkindsvater", "ja": "男性側の親家（サドンの夫）", "pl": "Współteść"},
    "안사돈": {"zh_cn": "亲家母（女方亲家）", "zh": "親家母（女方親家）", "en": "Female co-parent-in-law", "fr": "Co-belle-mère", "de": "Schwiegerkindsmutter", "ja": "女性側の親家（サドンの妻）", "pl": "Współteściowa"},
    "제3자에게 말할 때": {"zh_cn": "对第三者提起时", "zh": "對第三者提起時", "en": "When mentioning them to someone else", "fr": "En parlant à un tiers", "de": "Beim Sprechen über Dritte", "ja": "第三者に話すとき", "pl": "W rozmowie z osobą trzecią"},
    "직접 호칭할 때": {"zh_cn": "直接称呼时", "zh": "直接稱呼時", "en": "When addressing them directly", "fr": "En s'adressant directement", "de": "Bei direkter Anrede", "ja": "直接呼びかけるとき", "pl": "W bezpośrednim zwrocie"},
    "행복한 삶을 영원히": {"cs": "Radujte se ze života navždy!", "zh_cn": "永远享受美好的生命", "zh": "永遠享受美好的生命", "en": "Enjoy Life Forever", "fr": "Vivez pour toujours !", "de": "Glücklich – für immer", "hu": "Boldog élet most és mindörökké!", "id": "Hidup Bahagia Selamanya!", "ja": "いつまでも幸せに暮らせます", "pl": "Już zawsze ciesz się życiem!"},
    "\"행복한 삶을 영원히 누리십시오!\" 성경 공부 과정의 본문 문장이에요. 각 과의 토론 질문과 본문을 실제 발행물 그대로 5개 언어로 대조해 두었어요. 동영상 안내와 \"더 찾아보기\" 자료는 포함하지 않아요.": {"zh_cn": "「永远享受美好的生命！」圣经课程的正文。每一课的讨论问题和正文都依照原文，以5种语言对照收录。不包含影片提示和「更多精彩内容」的资料。", "zh": "「永遠享受美好的生命！」聖經課程的正文。每一課的討論問題和正文都依照原文，以5種語言對照收錄。不包含影片提示和「更多精彩內容」的資料。", "en": "The body text of the \"Enjoy Life Forever!\" Bible course. Each lesson's discussion questions and text are given exactly as published, aligned across 5 languages. Video cues and the \"Explore\" section are not included.", "fr": "Texte principal du cours biblique « Vivez pour toujours ! ». Les questions de discussion et les paragraphes de chaque leçon sont mis en regard en plusieurs langues selon la publication officielle.", "de": "Der Text des Bibelkurses „Glücklich – für immer!“. Die Diskussionsfragen und Absätze jeder Lektion sind wie in der Publikation in verschiedenen Sprachen gegenübergestellt.", "ja": "「いつまでも幸せに暮らせます！」聖書研究コースの本文です。各課の話し合いの質問と本文は、実際の出版物どおりに5つの言語で対照してあります。動画の案内と「見てみよう」の資料は含まれていません。", "pl": "Tekst główny kursu biblijnego „Już zawsze ciesz się życiem!”. Pytania do dyskusji i akapity każdej lekcji zestawiono w różnych językach zgodnie z oficjalną publikacją."},
    "부": {"zh_cn": "部分", "zh": "部分", "en": "Part", "fr": "Partie", "de": "Teil", "ja": "部", "pl": "Część"},
    "베트남어 문장이나 뜻으로 검색": {"cs": "Hledat vietnamskou větu nebo význam", "zh_cn": "用越南语句子或意思搜寻", "zh": "用越南語句子或意思搜尋", "en": "Search by Vietnamese sentence or meaning", "fr": "Rechercher par phrase vietnamienne ou sens", "de": "Nach vietnamesischem Satz oder Bedeutung suchen", "hu": "Keresés vietnámi mondatra vagy jelentésre", "id": "Cari kalimat Vietnam atau artinya", "ja": "ベトナム語の文や意味で検索", "pl": "Szukaj wietnamskiego zdania lub znaczenia"},
    "나는 준비가 되었는가?": {"zh_cn": "我准备好了嗎？", "zh": "我準備好了嗎？", "en": "Am I Ready?", "fr": "Suis-je prêt ?", "de": "Bin ich bereit?", "ja": "準備はできていますか", "pl": "Czy jesteś gotowy?"},
    "사람들을 사랑하고 제자로": {"cs": "Mějte rádi lidi a pomáhejte jim stát se učedníky", "zh_cn": "用愛心帮助人成为基督徒", "zh": "用愛心幫助人成為基督徒", "en": "Love People—Make Disciples", "fr": "Aimez les gens, faites des disciples", "de": "Menschen lieben – Jünger machen", "hu": "Szeressük az embereket, és tegyük őket tanítványokká", "id": "Kasihi Orang dan Buatlah Murid", "ja": "愛を込めて弟子を育てる", "pl": "Kochaj ludzi — pozyskuj uczniów"},
    "\"사람들을 사랑하고 제자로 삼으십시오\" 소책자에서 뽑은 과별 대표 예문이에요. 1~12과와 부록 가·나·다에서 각 5~8개씩 골라 5개 언어로 대조해 두었어요. 전체 본문이 아니라 학습용으로 엄선한 예문이에요.": {"zh_cn": "从「用愛心帮助人成为基督徒」小册子中，每课精选5~8个代表例句，共12课加上附录A、B、C，以5种语言对照。这不是全文，而是为学习精选的例句。", "zh": "從「用愛心幫助人成為基督徒」小冊子中，每課精選5~8個代表例句，共12課加上附錄A、B、C，以5種語言對照。這不是全文，而是為學習精選的例句。", "en": "A handful of representative example sentences (5-8 per lesson) selected from the \"Love PeopleÃ¢ÂÂMake Disciples\" brochureÃ¢ÂÂLessons 1-12 plus Appendices A, B, CÃ¢ÂÂaligned across 5 languages. This is a small curated selection for study, not the full text.", "fr": "Sélection de phrases d'exemple représentatives de la brochure « Aimez les gens, faites des disciples » (leçons 1 à 12 et annexes A, B, C) en plusieurs langues.", "de": "Ausgewählte Beispielsätze aus der Broschüre „Menschen lieben – Jünger machen“ (Lektionen 1–12 und Anhang A, B, C) in verschiedenen Sprachen.", "ja": "「愛を込めて弟子を育てる」小冊子から選んだ、各課の代表的な例文です。レッスン1~12と付録a・b・cから5~8個ずつ選び、5つの言語で対照してあります。全文ではなく、学習用に厳選した例文です。", "pl": "Wybrane przykładowe zdania z broszury „Kochaj ludzi — pozyskuj uczniów” (lekcje 1–12 i dodatki A, B, C) w różnych językach."},
    "부록": {"zh_cn": "附录", "zh": "附錄", "en": "Appendix", "fr": "Annexe", "de": "Anhang", "ja": "付録", "pl": "Dodatek"},
    "노래 선택": {"cs": "Vybrat píseň", "zh_cn": "选择诗歌", "zh": "選擇詩歌", "en": "Select Song", "fr": "Choisir un chant", "de": "Lied auswählen", "hu": "Ének kiválasztása", "id": "Pilih Lagu", "ja": "歌の選択", "pl": "Wybierz pieśń"},
    "바둑판": {"cs": "Mřížka", "zh_cn": "网格", "zh": "網格", "en": "Grid", "fr": "Grille", "de": "Kacheln", "hu": "Rács", "id": "Kisi", "ja": "グリッド", "pl": "Kafelki"},
    "목록": {"cs": "Seznam", "zh_cn": "列表", "zh": "列表", "en": "List", "fr": "Liste", "de": "Liste", "hu": "Lista", "id": "Daftar", "ja": "一覧", "pl": "Lista"},
    "곡 번호 또는 제목 검색... (예: 12 또는 사랑)": {"cs": "Hledat číslo písně nebo název... (např. 12 nebo láska)", "zh_cn": "搜寻歌曲编号或标题... (例: 12 或 愛)", "zh": "搜尋歌曲編號或標題... (例: 12 或 愛)", "en": "Search song number or title... (e.g. 12 or Love)", "fr": "Rechercher le numéro ou le titre du chant... (ex. : 12 ou Amour)", "de": "Liednummer oder Titel suchen... (z. B. 12 oder Liebe)", "hu": "Keresés énekszám vagy cím alapján... (pl. 12 vagy szeretet)", "id": "Cari nomor atau judul lagu... (contoh: 12 atau kasih)", "ja": "番号や曲名で検索... (例: 12 または 愛)", "pl": "Szukaj numeru lub tytułu pieśni... (np. 12 lub Miłość)"},
    "검색 결과가 없습니다.": {"cs": "Nebyly nalezeny žádné výsledky.", "zh_cn": "找不到搜寻结果。", "zh": "找不到搜尋結果。", "en": "No results found.", "fr": "Aucun résultat trouvé.", "de": "Keine Suchergebnisse.", "hu": "Nincs találat.", "id": "Tidak ada hasil pencarian.", "ja": "検索結果がありません。", "pl": "Brak wyników wyszukiwania."},
    "닫기": {"vi": "Đóng", "cs": "Zavřít", "zh_cn": "关闭", "zh": "關閉", "en": "Close", "fr": "Fermer", "de": "Schließen", "hu": "Bezárás", "id": "Tutup", "ja": "閉じる", "pl": "Zamknij"},
    "전체": {"cs": "Vše", "zh_cn": "全部", "zh": "全部", "en": "All", "fr": "Tous", "de": "Alle", "hu": "Összes", "id": "Semua", "ja": "すべて", "pl": "Wszystkie"},
    "번역 언어": {"vi": "Ngôn ngữ dịch", "cs": "Jazyk překladu", "zh_cn": "翻译语言", "zh": "翻譯語言", "en": "Translation language", "fr": "Langue de traduction", "de": "Übersetzungssprache", "hu": "Fordítási nyelv", "id": "Bahasa Terjemahan", "ja": "翻訳言語", "pl": "Język tłumaczenia"},
    "이전": {"cs": "Předchozí", "zh_cn": "上一个", "zh": "上一個", "en": "Previous", "fr": "Précédent", "de": "Zurück", "hu": "Előző", "id": "Sebelumnya", "ja": "前へ", "pl": "Poprzedni"},
    "다음": {"cs": "Další", "zh_cn": "下一个", "zh": "下一個", "en": "Next", "fr": "Suivant", "de": "Weiter", "hu": "Következő", "id": "Berikutnya", "ja": "次へ", "pl": "Następny"},
    "왼쪽으로 이동": {"cs": "Posunout doleva", "zh_cn": "向左移动", "zh": "向左移動", "en": "Move left", "fr": "Déplacer vers la gauche", "de": "Nach links verschieben", "hu": "Mozgatás balra", "id": "Pindah ke kiri", "ja": "左へ移動", "pl": "Przesuń w lewo"},
    "오른쪽으로 이동": {"cs": "Posunout doprava", "zh_cn": "向右移动", "zh": "向右移動", "en": "Move right", "fr": "Déplacer vers la droite", "de": "Nach rechts verschieben", "hu": "Mozgatás jobbra", "id": "Pindah ke kanan", "ja": "右へ移動", "pl": "Przesuń w prawo"},
    "\"행복한 삶을 영원히 누리십시오!\" 교재의 엑셀 원본 자료를 그대로 옮긴 콘텐츠예요. 72개 항목(1~60과·부별 복습·미디어 자료·참조 자료 등)을 10개 언어로 대조할 수 있어요. [문장] 탭의 같은 이름 콘텐츠와는 다른, 더 완전한 원문 자료예요.": {"zh_cn": "这是「尽情享受人生！」教材Excel原始资料的完整内容，涵蓋72个项目（第1~60课、各部复习、多媒体资料、参考资料等），可对照10种语言。与[句子]分页中同名内容不同，这是更完整的原始资料。", "zh": "這是「盡情享受人生！」教材Excel原始資料的完整內容，涵蓋72個項目（第1~60課、各部複習、多媒體資料、參考資料等），可對照10種語言。與[句子]分頁中同名內容不同，這是更完整的原始資料。", "en": "The full Excel source data of the \"Enjoy Life Forever!\" course, covering all 72 items (Lessons 1Ã¢ÂÂ60, section reviews, media, endnotes, etc.) aligned across 10 languages. This is a more complete source than the same-named content under the [Sentence] tab.", "fr": "Les données source Excel complètes du cours « Jouissez de la vie à jamais ! », couvrant les 72 éléments (leçons 1 à 60, révisions de section, contenus multimédias, notes, etc.) alignés sur 10 langues. Il s'agit d'une source plus complète que le contenu du même nom dans l'onglet [Phrases].", "de": "Die vollständigen Excel-Quelldaten des Kurses „Genieße das Leben für immer!“ mit allen 72 Einheiten (Lektionen 1–60, Teil-Wiederholungen, Medien, Anmerkungen usw.) in 10 Sprachen. Dies ist eine vollständigere Quelle als der gleichnamige Inhalt im Tab [Sätze].", "ja": "「幸せな人生を永遠に」教材のExcel原本データをそのまま収録したコンテンツです。72項目（1～60課・各部の復習・メディア資料・参照資料など）を10言語で対照できます。［文章］タブの同名コンテンツとは異なる、より完全な原本資料です。", "pl": "Pełne dane źródłowe z arkusza Excel dla kursu „Ciesz się życiem na zawsze!”, obejmujące wszystkie 72 pozycje (lekcje 1–60, powtórki poszczególnych części, materiały multimedialne, przypisy itd.) zestawione w 10 językach. To pełniejsze źródło niż treść o tej samej nazwie w zakładce [Zdania]."},
    "일반 문법": {"vi": "Ngữ pháp chung", "cs": "Obecná gramatika", "zh_cn": "一般语法", "zh": "一般文法", "en": "General Grammar", "fr": "Grammaire générale", "de": "Allgemeine Grammatik", "hu": "Általános nyelvtan", "id": "Tata bahasa umum", "ja": "一般文法", "pl": "Gramatyka ogólna"},
    "일상 생활": {"vi": "Đời sống hàng ngày", "cs": "Každodenní život", "zh_cn": "日常生活", "zh": "日常生活", "en": "Daily Life", "fr": "Vie quotidienne", "de": "Tägliches Leben", "hu": "Mindennapi élet", "id": "Kehidupan Sehari-hari", "ja": "日常生活", "pl": "Życie codzienne"},
    "등장 빈도": {"vi": "Tần suất xuất hiện", "cs": "Frekvence výskytu", "zh_cn": "出现频率", "zh": "出現頻率", "en": "Frequency of Occurrence", "fr": "Fréquence d'apparition", "de": "Vorkommenshäufigkeit", "hu": "Előfordulási gyakoriság", "id": "Frekuensi Kemunculan", "ja": "出現頻度", "pl": "Częstość występowania"},
    "JW 출처 빈도": {"vi": "Tần suất nguồn JW", "cs": "Frekvence zdrojů JW", "zh_cn": "JW出处频率", "zh": "JW出處頻率", "en": "JW Source Frequency", "fr": "Fréquence source JW", "de": "JW-Quellenhäufigkeit", "hu": "JW forrás gyakoriság", "id": "Frekuensi Sumber JW", "ja": "JW出典頻度", "pl": "Częstość źródła JW"},
    "빈도: ": {"vi": "Tần suất: ", "cs": "Frekvence: ", "zh_cn": "词频: ", "zh": "詞頻: ", "en": "Freq: ", "fr": "Fréq : ", "de": "Häufigkeit: ", "hu": "Gyakoriság: ", "id": "Frekuensi: ", "ja": "頻度: ", "pl": "Częstość: "},
    "빈도가 많은 순": {"vi": "Theo tần suất giảm dần", "cs": "Podle frekvence", "zh_cn": "按词频由高到低", "zh": "按詞頻由高到低", "en": "By Frequency (High to Low)", "fr": "Par ordre de fréquence", "de": "Nach Häufigkeit", "hu": "Gyakoriság szerint", "id": "Urutkan Frekuensi Tertinggi", "ja": "頻度順", "pl": "Według częstości"},
    "영원히": {"vi": "Mãi mãi", "cs": "Navždy", "zh_cn": "永远", "zh": "永遠", "en": "Forever", "fr": "Pour toujours", "de": "Für immer", "hu": "Örökké", "id": "Selamanya", "ja": "永遠に", "pl": "Na zawsze"},
    "반의어:": {"vi": "Từ trái nghĩa:", "cs": "Antonymum:", "zh_cn": "反义词:", "zh": "反義詞:", "en": "Antonym:", "fr": "Antonyme :", "de": "Gegenteil:", "hu": "Ellentét:", "id": "Antonim:", "ja": "対義語:", "pl": "Antonim:"},
    "더 보기": {"vi": "Xem thêm", "cs": "Zobrazit více", "zh_cn": "查看更多", "zh": "查看更多", "en": "Show more", "fr": "Afficher plus", "de": "Mehr anzeigen", "hu": "Továbbiak", "id": "Lihat lebih banyak", "ja": "もっと見る", "pl": "Pokaż więcej"},
    "지우기": {"vi": "Xóa", "cs": "Vymazat", "zh_cn": "清除", "zh": "清除", "en": "Clear", "fr": "Effacer", "de": "Löschen", "hu": "Törlés", "id": "Hapus", "ja": "クリア", "pl": "Wyczyść"},
    "행복한 삶을 영원히(전체)": {"vi": "Vui sống mãi mãi! (Toàn bộ)", "cs": "Radujte se ze života navždy! (Celé)", "zh_cn": "永远享受美好的生命（全书）", "zh": "永遠享受美好的生命（全書）", "en": "Enjoy Life Forever! (Full)", "fr": "Vivez pour toujours ! (Complet)", "de": "Glücklich – für immer (Vollständig)", "hu": "Boldog élet most és mindörökké! (Teljes)", "id": "Hidup Bahagia Selamanya! (Lengkap)", "ja": "幸せな人生を永遠に（全体）", "pl": "Ciesz się życiem na zawsze! (Pełne)"},
    "사람들을 사랑하고 제자로(전체)": {"vi": "Yêu thương người khác (Toàn bộ)", "cs": "Mějte rádi lidi (Celé)", "zh_cn": "用爱心帮助人成为基督徒（全书）", "zh": "用愛心幫助人成為基督徒（全書）", "en": "Love People—Make Disciples (Full)", "fr": "Aimez les gens (Complet)", "de": "Menschen lieben – Jünger machen (Vollständig)", "hu": "Szeressük az embereket (Teljes)", "id": "Kasihi Orang—Buatlah Murid (Lengkap)", "ja": "人々を愛し弟子とする（全体）", "pl": "Kochaj ludzi i pomagaj im (Pełne)"},
    "파수대(전체)": {"vi": "Tháp Canh (Toàn bộ)", "cs": "Strážná věž (Celé)", "zh_cn": "守望台（全文）", "zh": "守望台（全文）", "en": "Watchtower (Full)", "fr": "Tour de Garde (Complet)", "de": "Wachtturm (Vollständig)", "hu": "Őrtorony (Teljes)", "id": "Menara Pengawal (Lengkap)", "ja": "ものみの塔（全体）", "pl": "Strażnica (Pełne)"},
    "자모": {"vi": "Bảng chữ cái", "cs": "Abeceda", "zh_cn": "字母", "zh": "字母", "en": "Alphabet", "fr": "Alphabet", "de": "Alphabet", "hu": "Ábécé", "id": "Alfabet", "ja": "字母", "pl": "Alfabet"},
    "단자음": {"cs": "Jednoduché souhlásky", "hu": "Egyszerű mássalhangzók", "id": "Konsonan Tunggal"},
    "복자음": {"cs": "Spřežky", "hu": "Összetett mássalhangzók", "id": "Konsonan Ganda"},
    "단모음": {"cs": "Jednoduché samohlásky", "hu": "Egyszerű magánhangzók", "id": "Vokal Tunggal"},
    "이중모음": {"cs": "Dvojhlásky", "hu": "Kettőshangzók", "id": "Diftong"},
    "삼중모음": {"cs": "Trojhlásky", "hu": "Hármashangzók", "id": "Triftong"},
    "기초 핵심 문형 (A1/A2)": {"vi": "Mẫu câu cốt lõi cơ bản (A1/A2)", "cs": "Základní větné vzorce (A1/A2)", "zh_cn": "基础核心句型 (A1/A2)", "zh": "基礎核心句型 (A1/A2)", "en": "Basic Core Sentence Patterns (A1/A2)", "fr": "Structures de phrases de base (A1/A2)", "de": "Grundlegende Satzmuster (A1/A2)", "hu": "Alapvető mondatminták (A1/A2)", "id": "Pola Kalimat Inti Dasar (A1/A2)", "ja": "基礎コア文型 (A1/A2)", "pl": "Podstawowe wzorce zdań (A1/A2)"},
    "일상 회화": {"vi": "Hội thoại hàng ngày", "cs": "Běžná konverzace", "zh_cn": "日常会话", "zh": "日常對話", "en": "Everyday Conversation", "fr": "Conversation quotidienne", "de": "Alltagsgespräche", "hu": "Mindennapi beszélgetés", "id": "Percakapan Sehari-hari", "ja": "日常会話", "pl": "Codzienne rozmowy"},
    "선택됨. 다른 단어를 눌러 위치 교환": {"vi": "Đã chọn. Chạm từ khác để hoán đổi vị trí", "cs": "Vybráno. Klepnutím na jiné slovo prohoďte pozici", "zh_cn": "已选中。点击其他词语交换位置", "zh": "已選取。點擊其他詞語交換位置", "en": "Selected. Tap another word to swap positions", "fr": "Sélectionné. Touchez un autre mot pour échanger", "de": "Ausgewählt. Anderes Wort antippen zum Tauschen", "hu": "Kijelölve. Másik szóra koppintva cserélje fel a helyüket", "id": "Dipilih. Ketuk kata lain untuk bertukar posisi", "ja": "選択中。他の単語をタップして位置を入れ替え", "pl": "Zaznaczono. Dotknij innego słowa, aby zamienić miejscami"},
    "선택하여 문장에 배치": {"vi": "Chọn để đưa vào câu", "cs": "Vyberte pro umístění do věty", "zh_cn": "选中以放入句子", "zh": "選取以放入句子", "en": "Select to place in sentence", "fr": "Sélectionner pour placer dans la phrase", "de": "Auswählen, um im Satz zu platzieren", "hu": "Kiválasztás a mondatba helyezéshez", "id": "Pilih untuk ditempatkan dalam kalimat", "ja": "選択して文章に配置", "pl": "Wybierz, aby wstawić do zdania"},
    "일시정지": {"cs": "Pozastavit", "hu": "Szünet", "id": "Jeda"},
    "재생": {"cs": "Přehrát", "hu": "Lejátszás", "id": "Putar"},
    "정답 확인": {"cs": "Zkontrolovat odpověď", "hu": "Válasz ellenőrzése", "id": "Periksa Jawaban"},
    "다시 시도": {"cs": "Zkusit znovu", "hu": "Újrapróbálkozás", "id": "Coba Lagi"},
    "실제 출처 예문": {"vi": "Câu ví dụ thực tế", "cs": "Příklady ze zdrojů", "zh_cn": "实际出处例句", "zh": "實際出處例句", "en": "Actual Source Examples", "fr": "Exemples de sources réelles", "de": "Authentische Beispielsätze", "hu": "Hiteles forrásmondatok", "id": "Contoh Sumber Asli", "ja": "実際の出典例文", "pl": "Przykłady ze źródeł"},
    "핵심 포인트: ": {"vi": "Điểm cốt lõi: ", "cs": "Klíčový bod: ", "zh_cn": "核心要点: ", "zh": "核心要點: ", "en": "Key Point: ", "fr": "Point clé : ", "de": "Hauptpunkt: ", "hu": "Kulcsfontosságú pont: ", "id": "Poin Kunci: ", "ja": "要点: ", "pl": "Kluczowy punkt: "},
    "목적어": {"cs": "Předmět", "hu": "Tárgy", "id": "Objek"},
    "목적어 (명사)": {"cs": "Předmět (podstatné jméno)", "hu": "Tárgy (főnév)", "id": "Objek (kata benda)"},
    "형용사": {"cs": "Přídavné jméno", "hu": "Melléknév", "id": "Kata Sifat"},
    "장소": {"cs": "Místo", "hu": "Hely", "id": "Tempat"},
    "부정어/시제 (동사 앞에 붙는 말)": {"cs": "Zápor/čas (výraz před slovesem)", "hu": "Tagadás/igeidő (ige előtti szó)", "id": "Negasi/kala (kata sebelum kata kerja)"},
    "조동사/기타 (동사 앞뒤에 붙는 말)": {"cs": "Pomocné sloveso/ostatní (před či za slovesem)", "hu": "Segédige/egyéb (ige előtt vagy után)", "id": "Kata bantu/lainnya (sebelum atau sesudah kata kerja)"},
    "기타 수식어": {"cs": "Ostatní přívlastky", "hu": "Egyéb módosítók", "id": "Modifikator Lainnya"},
    "어순 팁": {"cs": "Tip ke slovosledu", "hu": "Szórendi tipp", "id": "Tips Susunan Kata"},
    "어순 팁:": {"cs": "Tip ke slovosledu:", "hu": "Szórendi tipp:", "id": "Tips Susunan Kata:"},
    "모음 발음 — 이중모음": {"cs": "Výslovnost samohlásek — dvojhlásky", "hu": "Magánhangzók kiejtése — kettőshangzók", "id": "Pelafalan Vokal — Diftong"},
    "모음 발음 — 삼중모음": {"cs": "Výslovnost samohlásek — trojhlásky", "hu": "Magánhangzók kiejtése — hármashangzók", "id": "Pelafalan Vokal — Triftong"},
    "예: Trung": {"cs": "např. Trung", "zh_cn": "例如：Trung", "hu": "pl. Trung", "id": "contoh: Trung", "pl": "np. Trung"},
    "예: 동식": {"cs": "např. Dongsik", "zh_cn": "例如：东植", "hu": "pl. Dongsik", "id": "contoh: Dongsik", "pl": "np. Dongsik"},
    "파수대 연구 기사에서 뽑은 예문이에요. 매주 학습한 어휘가 포함된 문장과 그 뜻을 보여줘요.": {"cs": "Příklady vět vybrané ze studijních článků Strážné věže. Zobrazují se věty obsahující probranou slovní zásobu a jejich význam.", "zh_cn": "选自《守望台》研究文章的例句。展示包含每周所学词汇的句子及其含义。", "hu": "Az Őrtorony-tanulmányozási cikkekből kiválasztott példamondatok. Bemutatja a heti tanult szókincset tartalmazó mondatokat és azok jelentését.", "id": "Kalimat contoh yang dipilih dari artikel Pelajaran Menara Pengawal. Menampilkan kalimat yang memuat kosakata yang dipelajari setiap minggu beserta artinya.", "pl": "Przykładowe zdania wybrane z artykułów do studium w Strażnicy. Pokazuje zdania zawierające słownictwo poznane w danym tygodniu wraz z ich znaczeniem."},
    "파수대 연구 기사의 엑셀 원본 자료를 그대로 옮긴 콘텐츠예요. 현재 확정된 주차만 12개 언어로 대조할 수 있어요. 아직 원고가 준비되지 않은 미래 주차는 표시하지 않아요. 옆의 [파수대] 탭(5개 언어, 단어 학습용 예문만 선별한 버전)과는 다른, 더 완전한 원문 자료예요.": {"cs": "Kompletní data z původního souboru aplikace Excel pro studijní články Strážné věže. V 12 jazycích lze porovnávat pouze aktuálně potvrzené týdny.", "zh_cn": "《守望台》研究文章Excel原始资料的完整内容。仅当前确定的周次可在12种语言间对照。", "hu": "Az Őrtorony-tanulmányozási cikkek eredeti Excel-fájljának teljes tartalma. 12 nyelven tekinthető meg az eddig megerősített hetek anyaga.", "id": "Konten lengkap dari data sumber Excel asli untuk artikel pelajaran Menara Pengawal. Hanya minggu yang sudah dikonfirmasi saat ini yang dapat dibandingkan dalam 12 bahasa.", "pl": "Pełna treść oryginalnych danych programu Excel artykułów do studium w Strażnicy. W 12 językach można zestawiać tylko aktualnie potwierdzone tygodnie."},
    "\"베트남어 일상 회화\" 교재 1~13과의 실제 회화문 21편이에요. 베트남어·한국어는 교재 원문 그대로이며, 중국어·영어·일본어는 자연스러운 회화체로 옮겼어요.": {"cs": "21 skutečných konverzačních lekcí z lekcí 1–13 učebnice „Vietnamská běžná konverzace“. Texty jsou věrné originálu.", "zh_cn": "选自《越南语日常会话》教材第1~13课的21篇实际对话。越南语和韩语保持教材原样，中文、英语、日语转译为自然口语体。", "hu": "21 valós beszélgetés a „Vietnámi mindennapi beszélgetés” tankönyv 1–13. leckéjéből. A szövegek hűek az eredetihez.", "id": "21 teks percakapan nyata dari Bab 1–13 buku pelajaran 'Percakapan Sehari-hari Bahasa Vietnam'.", "pl": "21 autentycznych dialogów z lekcji 1–13 podręcznika „Wietnamskie rozmowy codzienne”. Teksty są wierne oryginałowi."},
    "\"사람들을 사랑하고 제자로 삼으십시오\" 소책자에서 뽑은 과별 대표 예문이에요. 1~12과와 부록 가·나·다에서 각 5~8개씩 골라 5개 언어로 대조해 두었어요. 전체 본문이 아니라 학습용으로 엄선한 예문이에요.": {"cs": "Reprezentativní příklady z brožury „Mějte rádi lidi a pomáhejte jim stát se učedníky“ vybrané z lekcí 1–12 a dodatků A, B, C.", "zh_cn": "选自《用爱心帮助人成为基督徒》册子的各课代表例句。从第1~12课和附录一、二、三中精选，并以多种语言对照。", "hu": "Kiemelt példamondatok a „Szeressük az embereket, és tegyük őket tanítványokká” füzet 1–12. leckéjéből és az A, B, C függelékekből.", "id": "Contoh kalimat perwakilan per bab yang dipilih dari brosur 'Kasihi Orang dan Buatlah Murid' Bab 1–12 dan Lampiran A, B, C.", "pl": "Reprezentatywne przykłady z broszury „Kochaj ludzi i pomagaj im stawać się uczniami” wybrane z lekcji 1–12 i dodatków A, B, C."},
    "\"사람들을 사랑하고 제자로 삼으십시오\" 소책자의 엑셀 원본 자료를 그대로 옮긴 콘텐츠예요. 1~12과와 부록 가·나·다를 12개 언어로 대조할 수 있어요. 옆의 [사람들을 사랑하고 제자로] 탭(5개 언어, 과별 대표 예문만 선별한 버전)과는 다른, 더 완전한 원문 자료예요.": {"cs": "Kompletní data z původního souboru aplikace Excel pro brožuru „Mějte rádi lidi a pomáhejte jim stát se učedníky“. Všech 12 lekcí a dodatků lze porovnávat v 12 jazycích.", "zh_cn": "《用爱心帮助人成为基督徒》册子Excel原始资料的完整内容。第1~12课和附录一、二、三可在12种语言间对照。", "hu": "A „Szeressük az embereket, és tegyük őket tanítványokká” füzet eredeti Excel-fájljának teljes tartalma. Mind a 12 lecke és a függelékek 12 nyelven vethetők össze.", "id": "Konten lengkap dari data sumber Excel asli brosur 'Kasihi Orang dan Buatlah Murid'. Bab 1–12 dan Lampiran A, B, C dapat dibandingkan dalam 12 bahasa.", "pl": "Pełna treść oryginalnych danych programu Excel broszury „Kochaj ludzi i pomagaj im stawać się uczniami”. Wszystkie 12 lekcji i dodatki zestawione w 12 językach."},
    "\"행복한 삶을 영원히 누리십시오!\" 성경 공부 과정의 본문 문장이에요. 각 과의 토론 질문과 본문을 실제 발행물 그대로 5개 언어로 대조해 두었어요. 동영상 안내와 \"더 찾아보기\" 자료는 포함하지 않아요.": {"cs": "Věty z textu biblického kurzu „Radujte se ze života navždy!“. Otázky k rozboru a hlavní text jsou porovnány ve více jazycích tak, jak byly vydány.", "zh_cn": "《永远享受美好的生命！》圣经课程的正文句子。各课的讨论问题和正文均按出版物原文在多语种间对照。", "hu": "Mondatok a „Boldog élet most és mindörökké!” bibliatanulmányozási kurzusból. A megbeszélési kérdések és a főszöveg több nyelven van összehasonlítva.", "id": "Kalimat dari teks kursus pelajaran Alkitab 'Hidup Bahagia Selamanya!'. Pertanyaan diskusi dan teks utama disandingkan dalam berbagai bahasa persis seperti publikasi asli.", "pl": "Zdania z tekstu kursu biblijnego „Ciesz się życiem na zawsze!”. Pytania do dyskusji i tekst główny zestawione w wielu językach."},
    "대화 탭에서 선택한 나와 상대방의 관계에 따라, 제공 연설 대화문 속 \"저는(tôi)\"·\"당신은(bạn)\" 표현이 실제 상황에 맞는 호칭으로 자동으로 바뀌어요. 아직 선택하지 않았다면 원문 그대로 tôi·bạn으로 표시돼요.": {"cs": "Podle vztahu zvoleného na kartě Rozhovory se výrazy „já (tôi)“ a „vy (bạn)“ ve vzorových rozhovorech automaticky změní na vhodné oslovení pro danou situaci.", "zh_cn": "根据在对话标签中选择的我与对方的关系，提供见证对话中的“我(tôi)”和“你(bạn)”会自动替换为符合实际情况的称呼。", "hu": "A Beszélgetések lapon kiválasztott kapcsolat alapján a minta-beszélgetésekben az „én (tôi)” és „te (bạn)” kifejezések automatikusan a helyzetnek megfelelő megszólításra váltanak.", "id": "Sesuai dengan hubungan yang dipilih di tab Percakapan, ungkapan 'saya (tôi)' dan 'Anda (bạn)' dalam contoh percakapan akan otomatis berubah menjadi sebutan yang tepat.", "pl": "W zależności od relacji wybranej w zakładce Rozmowy, wyrażenia „ja (tôi)” i „ty (bạn)” w dialogach wzorcowych automatycznie zmieniają się na odpowiednie formy."},
    "베트남의 문화, 음식, 풍습, 일상생활에 대한 유용한 이야기예요.": {"cs": "Užitečné informace o vietnamské kultuře, jídle, zvycích a každodenním životě.", "zh_cn": "关于越南文化、美食、习俗和日常生活的实用知识介绍。", "hu": "Hasznos történetek a vietnámi kultúráról, ételekről, szokásokról és a mindennapi életről.", "id": "Kisah dan informasi bermanfaat tentang budaya, makanan, adat istiadat, dan kehidupan sehari-hari di Vietnam.", "pl": "Przydatne informacje o kulturze, jedzeniu, zwyczajach i życiu codziennym w Wietnamie."},
    "베트남인은 상대방과 친해질 생각이 전혀 없는 경우가 아니라면 신속히 통성명하고, 나이를 묻고, 상대방과 나의 나이 차이에 따른 호칭을 사용하는 것이 아주 일상적이에요. 계속 \"나\"·\"tôi\"라는 단어를 사용한다면 상대방과 친해지기 어려워요.": {"cs": "Ve Vietnamu je zcela běžné si rychle vyměnit jména, zeptat se na věk a používat oslovení podle věkového rozdílu. Neustálé používání slova „já / tôi“ může bránit sblížení.", "zh_cn": "除非完全没有与对方拉近关系的打算，否则越南人通常会迅速通报姓名、询问年龄，并根据双方年龄差距使用相应的称谓。", "hu": "Vietnámban nagyon megszokott, hogy gyorsan bemutatkoznak, megkérdezik egymás életkorát, és a korkülönbségnek megfelelő megszólítást használják. A „tôi” (én) szó folyamatos használata gátolhatja a közeledést.", "id": "Di Vietnam, bertukar nama, menanyakan usia, dan menggunakan sebutan kekerabatan sesuai perbedaan usia adalah hal yang sangat lumrah.", "pl": "Wietnamczycy powszechnie wymieniają się imionami, pytają o wiek i używają form grzecznościowych zależnych od różnicy wieku."},
    "(여)": {"cs": "(žena)", "hu": "(nő)", "id": "(wanita)"},
    "글자 수": {"cs": "Počet písmen", "hu": "Karakterszám", "id": "Jumlah Huruf"},
    "글자순": {"cs": "Abecedně", "hu": "Betűrendben", "id": "Urutan Huruf"},
    "기본 순서": {"cs": "Výchozí pořadí", "hu": "Alapértelmezett sorrend", "id": "Urutan Standar"},
    "나이대": {"cs": "Věková skupina", "hu": "Korosztály", "id": "Kelompok Usia"},
    "내가 상대방보다 나이가 적음 (동생뻘)": {"cs": "Jsem mladší než druhá osoba (jako mladší sourozenec)", "hu": "Fiatalabb vagyok a másik félnél (mint egy fiatalabb testvér)", "id": "Saya lebih muda dari lawan bicara (seusia adik)"},
    "내가 상대방보다 약간 연장자 (형·누나·오빠·언니뻘)": {"cs": "Jsem o něco starší než druhá osoba (jako starší bratr/sestra)", "hu": "Kissé idősebb vagyok a másik félnél (mint egy idősebb testvér)", "id": "Saya sedikit lebih tua dari lawan bicara (seusia kakak)"},
    "\"행복한 삶을 영원히 누리십시오!\" 교재의 엑셀 원본 자료를 그대로 옮긴 콘텐츠예요. 72개 항목(1~60과·부별 복습·미디어 자료·참조 자료 등)을 12개 언어로 대조할 수 있어요. 옆의 [행복한 삶을 영원히] 탭(5개 언어, 문장 단위로 나눈 버전)과는 다른, 더 완전한 원문 자료예요.": {"cs": "Kompletní data z původního souboru aplikace Excel pro učebnici „Radujte se ze života navždy!“. Všech 72 položek lze porovnávat ve 12 jazycích.", "zh_cn": "《永远享受美好的生命！》教材Excel原始资料的完整内容。72个项目可在12种语言间对照。", "hu": "A „Boldog élet most és mindörökké!” tankönyv eredeti Excel-fájljának teljes tartalma. Mind a 72 tétel összevethető 12 nyelven.", "id": "Konten lengkap dari data sumber Excel asli buku pelajaran 'Hidup Bahagia Selamanya!'. Semua 72 materi dapat dibandingkan dalam 12 bahasa.", "pl": "Pełna treść oryginalnych danych programu Excel podręcznika „Ciesz się życiem na zawsze!”. Wszystkie 72 pozycje zestawione w 12 językach."},
    "\"베트남어 일상 회화\" 교재 1~13과의 실제 회화문 21편이에요. 베트남어·한국어는 교재 원문 그대로이며, 중국어·영어·일본어는 자연스러운 회화체로 옮겼어요.": {"cs": "21 skutečných konverzačních lekcí z lekcí 1–13 učebnice „Vietnamská běžná konverzace“. Texty jsou věrné originálu.", "zh_cn": "选自《越南语日常会话》教材第1~13课的21篇实际对话。越南语和韩语保持教材原样，中文、英语、日语转译为自然口语体。", "hu": "21 valós beszélgetés a „Vietnámi mindennapi beszélgetés” tankönyv 1–13. leckéjéből. A szövegek hűek az eredetihez.", "id": "21 teks percakapan nyata dari Bab 1–13 buku pelajaran 'Percakapan Sehari-hari Bahasa Vietnam'.", "pl": "21 autentycznych dialogów z lekcji 1–13 podręcznika „Wietnamskie rozmowy codzienne”. Teksty są wierne oryginałowi."},
    "\"사람들을 사랑하고 제자로 삼으십시오\" 소책자에서 뽑은 과별 대표 예문이에요. 1~12과와 부록 가·나·다에서 각 5~8개씩 골라 5개 언어로 대조해 두었어요. 전체 본문이 아니라 학습용으로 엄선한 예문이에요.": {"cs": "Reprezentativní příklady z brožury „Mějte rádi lidi a pomáhejte jim stát se učedníky“ vybrané z lekcí 1–12 a dodatků A, B, C.", "zh_cn": "选自《用爱心帮助人成为基督徒》册子的各课代表例句。从第1~12课和附录一、二、三中精选，并以多种语言对照。", "hu": "Kiemelt példamondatok a „Szeressük az embereket, és tegyük őket tanítványokká” füzet 1–12. leckéjéből és az A, B, C függelékekből.", "id": "Contoh kalimat perwakilan per bab yang dipilih dari brosur 'Kasihi Orang dan Buatlah Murid' Bab 1–12 dan Lampiran A, B, C.", "pl": "Reprezentatywne przykłady z broszury „Kochaj ludzi i pomagaj im stawać się uczniami” wybrane z lekcji 1–12 i dodatków A, B, C."},
    "\"사람들을 사랑하고 제자로 삼으십시오\" 소책자의 엑셀 원본 자료를 그대로 옮긴 콘텐츠예요. 1~12과와 부록 가·나·다를 12개 언어로 대조할 수 있어요. 옆의 [사람들을 사랑하고 제자로] 탭(5개 언어, 과별 대표 예문만 선별한 버전)과는 다른, 더 완전한 원문 자료예요.": {"cs": "Kompletní data z původního souboru aplikace Excel pro brožuru „Mějte rádi lidi a pomáhejte jim stát se učedníky“. Všech 12 lekcí a dodatků lze porovnávat v 12 jazycích.", "zh_cn": "《用爱心帮助人成为基督徒》册子Excel原始资料的完整内容。第1~12课和附录一、二、三可在12种语言间对照。", "hu": "A „Szeressük az embereket, és tegyük őket tanítványokká” füzet eredeti Excel-fájljának teljes tartalma. Mind a 12 lecke és a függelékek 12 nyelven vethetők össze.", "id": "Konten lengkap dari data sumber Excel asli brosur 'Kasihi Orang dan Buatlah Murid'. Bab 1–12 dan Lampiran A, B, C dapat dibandingkan dalam 12 bahasa.", "pl": "Pełna treść oryginalnych danych programu Excel broszury „Kochaj ludzi i pomagaj im stawać się uczniami”. Wszystkie 12 lekcji i dodatki zestawione w 12 językach."},
    "\"행복한 삶을 영원히 누리십시오!\" 성경 공부 과정의 본문 문장이에요. 각 과의 토론 질문과 본문을 실제 발행물 그대로 5개 언어로 대조해 두었어요. 동영상 안내와 \"더 찾아보기\" 자료는 포함하지 않아요.": {"cs": "Věty z textu biblického kurzu „Radujte se ze života navždy!“. Otázky k rozboru a hlavní text jsou porovnány ve více jazycích tak, jak byly vydány.", "zh_cn": "《永远享受美好的生命！》圣经课程的正文句子。各课的讨论问题和正文均按出版物原文在多语种间对照。", "hu": "Mondatok a „Boldog élet most és mindörökké!” bibliatanulmányozási kurzusból. A megbeszélési kérdések és a főszöveg több nyelven van összehasonlítva.", "id": "Kalimat dari teks kursus pelajaran Alkitab 'Hidup Bahagia Selamanya!'. Pertanyaan diskusi dan teks utama disandingkan dalam berbagai bahasa persis seperti publikasi asli.", "pl": "Zdania z tekstu kursu biblijnego „Ciesz się życiem na zawsze!”. Pytania do dyskusji i tekst główny zestawione w wielu językach."},
    "대화 탭에서 선택한 나와 상대방의 관계에 따라, 제공 연설 대화문 속 \"저는(tôi)\"·\"당신은(bạn)\" 표현이 실제 상황에 맞는 호칭으로 자동으로 바뀌어요. 아직 선택하지 않았다면 원문 그대로 tôi·bạn으로 표시돼요.": {"cs": "Podle vztahu zvoleného na kartě Rozhovory se výrazy „já (tôi)“ a „vy (bạn)“ ve vzorových rozhovorech automaticky změní na vhodné oslovení pro danou situaci.", "zh_cn": "根据在对话标签中选择的我与对方的关系，提供见证对话中的“我(tôi)”和“你(bạn)”会自动替换为符合实际情况的称呼。", "hu": "A Beszélgetések lapon kiválasztott kapcsolat alapján a minta-beszélgetésekben az „én (tôi)” és „te (bạn)” kifejezések automatikusan a helyzetnek megfelelő megszólításra váltanak.", "id": "Sesuai dengan hubungan yang dipilih di tab Percakapan, ungkapan 'saya (tôi)' dan 'Anda (bạn)' dalam contoh percakapan akan otomatis berubah menjadi sebutan yang tepat.", "pl": "W zależności od relacji wybranej w zakładce Rozmowy, wyrażenia „ja (tôi)” i „ty (bạn)” w dialogach wzorcowych automatycznie zmieniają się na odpowiednie formy."},
    "베트남인은 상대방과 친해질 생각이 전혀 없는 경우가 아니라면 신속히 통성명하고, 나이를 묻고, 상대방과 나의 나이 차이에 따른 호칭을 사용하는 것이 아주 일상적이에요. 계속 \"나\"·\"tôi\"라는 단어를 사용한다면 상대방과 친해지기 어려워요.": {"cs": "Ve Vietnamu je zcela běžné si rychle vyměnit jména, zeptat se na věk a používat oslovení podle věkového rozdílu. Neustálé používání slova „já / tôi“ může bránit sblížení.", "zh_cn": "除非完全没有与对方拉近关系的打算，否则越南人通常会迅速通报姓名、询问年龄，并根据双方年龄差距使用相应的称谓。", "hu": "Vietnámban nagyon megszokott, hogy gyorsan bemutatkoznak, megkérdezik egymás életkorát, és a korkülönbségnek megfelelő megszólítást használják. A „tôi” (én) szó folyamatos használata gátolhatja a közeledést.", "id": "Di Vietnam, bertukar nama, menanyakan usia, dan menggunakan sebutan kekerabatan sesuai perbedaan usia adalah hal yang sangat lumrah.", "pl": "Wietnamczycy powszechnie wymieniają się imionami, pytają o wiek i używają form grzecznościowych zależnych od różnicy wieku."},
    "\"행복한 삶을 영원히 누리십시오!\" 교재의 엑셀 원본 자료를 그대로 옮긴 콘텐츠예요. 72개 항목(1~60과·부별 복습·미디어 자료·참조 자료 등)을 12개 언어로 대조할 수 있어요. 옆의 [행복한 삶을 영원히] 탭(5개 언어, 문장 단위로 나눈 버전)과는 다른, 더 완전한 원문 자료예요.": {"cs": "Kompletní data z původního souboru aplikace Excel pro učebnici „Radujte se ze života navždy!“. Všech 72 položek lze porovnávat ve 12 jazycích.", "zh_cn": "《永远享受美好的生命！》教材Excel原始资料的完整内容。72个项目可在12种语言间对照。", "hu": "A „Boldog élet most és mindörökké!” tankönyv eredeti Excel-fájljának teljes tartalma. Mind a 72 tétel összevethető 12 nyelven.", "id": "Konten lengkap dari data sumber Excel asli buku pelajaran 'Hidup Bahagia Selamanya!'. Semua 72 materi dapat dibandingkan dalam 12 bahasa.", "pl": "Pełna treść oryginalnych danych programu Excel podręcznika „Ciesz się życiem na zawsze!”. Wszystkie 72 pozycje zestawione w 12 językach."}

  };
  function TU(ko) {
    if (!ko) return ko;
    // I18N_UI entries store only {zh, en} -- the dictionary KEY itself is the Korean text, so
    // there's no redundant .ko field on the entry. Going through T() would still "work" for
    // zh/en, but T()'s fallback chain (field[currentLang] || field.ko || field.zh || ...) would
    // silently fall through to .zh when currentLang is "ko" (since .ko is never set), showing
    // Chinese in Korean mode. So ko is handled directly here instead of delegating to T().
    if (currentLang === "ko") return ko;
    var entry = I18N_UI[ko];
    if (!entry) return ko;
    // A couple of entries deliberately translate to "" (e.g. "번"/"총 " have no natural English
    // equivalent word at all -- the sentence they're spliced into just omits that word). Using
    // `|| ko` here would silently show the Korean word instead of nothing in exactly those
    // cases, so only fall back to `ko` when the language key is missing from the entry entirely,
    // not when it's present-but-intentionally-blank.
    return Object.prototype.hasOwnProperty.call(entry, currentLang) ? entry[currentLang] : ko;
  }

  // Vietnamese dictionary-order string comparator (사전 순서/알파벳 순서 정렬용) -- letters first,
  // ACROSS THE WHOLE WORD, using the 29-letter Vietnamese alphabet (a,ă,â,b,c,d,đ,e,ê,g,h,i,k,l,
  // m,n,o,ô,ơ,p,q,r,s,t,u,ư,v,x,y -- NOT the old-style digraph blocks like ch/gi/ng/ph/th/tr,
  // matching the modern "standard" Unicode CLDR vi collation, not the old "traditional" one), and
  // only once every letter of both words has been compared does a tone-mark difference break a
  // tie (ngang < huyền < hỏi < ngã < sắc < nặng, per the same CLDR vi standard collation). This
  // two-level (letters-then-tones) comparison matters: a naive per-character (letter+tone)
  // comparison would let an EARLY tone difference wrongly outrank a LATER base-letter difference
  // (e.g. would sort "ai" before "ác" because of ác's tone mark on its first letter, when "ác"
  // correctly belongs before "ai" since c < i at the second letter, tone aside).
  var VI_LETTER_ORDER = ['a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n',
    'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'];
  var VI_LETTER_RANK = {};
  VI_LETTER_ORDER.forEach(function (ch, i) { VI_LETTER_RANK[ch] = i; });
  var VI_TONE_RANK = { "̀": 1, "̉": 2, "̃": 3, "́": 4, "̣": 5 }; // huyền hỏi ngã sắc nặng
  var VI_MOD_MARK = { "̆": "breve", "̂": "circumflex", "̛": "horn" }; // ă / â,ê,ô / ơ,ư

  function viCharKey(ch) {
    var lower = ch.toLowerCase();
    if (lower === "đ") return [VI_LETTER_RANK["đ"], 0];
    if (/^[a-z]$/.test(lower)) {
      return Object.prototype.hasOwnProperty.call(VI_LETTER_RANK, lower) ? [VI_LETTER_RANK[lower], 0] : [100 + lower.charCodeAt(0), 0];
    }
    var decomposed = lower.normalize("NFD");
    var base = null, tone = 0, mod = null;
    for (var i = 0; i < decomposed.length; i++) {
      var c = decomposed[i];
      if (Object.prototype.hasOwnProperty.call(VI_TONE_RANK, c)) tone = VI_TONE_RANK[c];
      else if (Object.prototype.hasOwnProperty.call(VI_MOD_MARK, c)) mod = VI_MOD_MARK[c];
      else if (/^[a-z]$/.test(c)) base = c;
    }
    if (base === null) return null; // punctuation/space/etc -- not a letter at all
    var letter = base;
    if (mod === "breve" && base === "a") letter = "ă";
    else if (mod === "circumflex") { if (base === "a") letter = "â"; else if (base === "e") letter = "ê"; else if (base === "o") letter = "ô"; }
    else if (mod === "horn") { if (base === "o") letter = "ơ"; else if (base === "u") letter = "ư"; }
    return Object.prototype.hasOwnProperty.call(VI_LETTER_RANK, letter) ? [VI_LETTER_RANK[letter], tone] : [100 + letter.charCodeAt(0), tone];
  }

  function viWordKey(word) {
    var letters = [], tones = [];
    for (var i = 0; i < word.length; i++) {
      var ck = viCharKey(word[i]);
      letters.push(ck ? ck[0] : -1);
      tones.push(ck ? ck[1] : -1);
    }
    return [letters, tones];
  }

  function viCompareRankArrays(a, b) {
    var len = Math.max(a.length, b.length);
    for (var i = 0; i < len; i++) {
      var av = i < a.length ? a[i] : -Infinity, bv = i < b.length ? b[i] : -Infinity; // shorter (prefix) word sorts first
      if (av !== bv) return av < bv ? -1 : 1;
    }
    return 0;
  }

  // Vietnamese dictionary-order comparator for Array.prototype.sort -- e.g. list.sort(function
  // (a, b) { return viCompare(a.vi, b.vi); }).
  function viCompare(wordA, wordB) {
    var ka = viWordKey(wordA), kb = viWordKey(wordB);
    var letterCmp = viCompareRankArrays(ka[0], kb[0]);
    return letterCmp !== 0 ? letterCmp : viCompareRankArrays(ka[1], kb[1]);
  }

  // [어순반대] 탭의 alt_order_word ("그 단어를 어순만 뒤집은 형태로도 씀"이라고 표시할 대상 단어,
  // 예: diệu kỳ의 wd.alt_order_word === "kỳ diệu") 하나로부터, currentLang에 맞는 문구를 조립한다.
  // 데이터 파일에는 단어 자체만 저장돼 있고("kỳ diệu"), "...도 씀"/"also used as ..."/"也用..."/
  // "...も使う" 같은 둘러싸는 말은 여기서 언어별로 붙인다 -- 예전에는 이 문구 전체("kỳ diệu도 씀")가
  // 한국어로 데이터에 그대로 박혀 있어서 중국어/영어/일본어 모드에서도 한국어가 그대로 노출됐다.
  function altOrderNoteText(word) {
    if (!word) return "";
    if (currentLang === "zh") return "也用 " + word;
    if (currentLang === "en") return "also used as " + word;
    if (currentLang === "ja") return word + "も使う";
    if (currentLang === "de") return "auch verwendet als " + word;
    if (currentLang === "fr") return "s'utilise aussi comme " + word;
    if (currentLang === "pl") return "używane także jako " + word;
    return word + "도 씀";
  }

  // Applies TU() to every static template.html element tagged with data-i18n (text content) or
  // data-i18n-<attr> (an attribute value) -- run once at startup and again on every language
  // switch so static chrome (tab labels, headings, help paragraphs, placeholders...) follows
  // currentLang just like data-driven content does via T().
  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = TU(el.getAttribute("data-i18n"));
    });
    ["aria-label", "placeholder", "title", "alt"].forEach(function (attr) {
      document.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        el.setAttribute(attr, TU(el.getAttribute("data-i18n-" + attr)));
      });
    });
  }
  applyStaticI18n();
  onLangChange(applyStaticI18n);

  // Site-specific header override: SITE_H1_BY_LANG (assemble_app.py's build_site_identity_prelude,
  // defined before this script runs, when this site has a per-language header) must win over
  // applyStaticI18n()'s generic data-i18n lookup above, both at boot and on every later language
  // switch -- registered right after applyStaticI18n so it always runs last. Sites with no
  // per-language header (e.g. jeonju) leave SITE_H1_BY_LANG undefined, so this is a no-op there
  // and #app-title just keeps whatever apply_site_identity() already set in the static HTML.
  function applySiteH1Override() {
    if (typeof SITE_H1_BY_LANG === "undefined") return;
    var h1El = document.getElementById("app-title");
    if (!h1El) return;
    h1El.textContent = SITE_H1_BY_LANG[currentLang] || SITE_H1_BY_LANG.ko || h1El.textContent;
  }
  applySiteH1Override();
  onLangChange(applySiteH1Override);

  // Profile cross-link dynamic text override: GENERAL profile cross-link switches across all 12
  // languages, while JW profile cross-link stays fixed in Korean, and JEONJU profile has none.
  function applySiteCrossLink() {
    if (typeof SITE_CROSS_LINK === "undefined" || !SITE_CROSS_LINK) return;
    var crossLinkEl = document.getElementById("site-cross-link");
    if (!crossLinkEl) return;
    if (SITE_CROSS_LINK.url) crossLinkEl.href = SITE_CROSS_LINK.url;
    if (SITE_CROSS_LINK.text_by_lang) {
      crossLinkEl.textContent = SITE_CROSS_LINK.text_by_lang[currentLang] || SITE_CROSS_LINK.text_by_lang.ko || crossLinkEl.textContent;
    } else if (SITE_CROSS_LINK.text) {
      crossLinkEl.textContent = SITE_CROSS_LINK.text;
    }
  }
  applySiteCrossLink();
  onLangChange(applySiteCrossLink);

  // Use short, readable English, German, French, and Polish names when primary tabs share a narrow row.
  // The full translation remains available to assistive technology and on wider screens.
  (function () {
    var shortNamesByLang = {
      en: { curriculum: "Course", pron: "Phonics", bible: "Bible", wizard: "Talks", vocab: "Words", sentence: "Clauses", grammar: "Usage", review: "Review" },
      de: { curriculum: "Kurs", pron: "Laut", bible: "Bibel", wizard: "Dialog", vocab: "Wörter", sentence: "Satz", grammar: "Gramm.", review: "Wdh." },
      fr: { curriculum: "Cours", pron: "Sons", bible: "Bible", wizard: "Dialog", vocab: "Mots", sentence: "Phrase", grammar: "Gramm.", review: "Rév." },
      pl: { curriculum: "Kurs", pron: "Wymowa", bible: "Biblia", wizard: "Rozm.", vocab: "Słowa", sentence: "Zdanie", grammar: "Gram.", review: "Powt." },
      cs: { curriculum: "Kurz", pron: "Výsl.", bible: "Bible", wizard: "Dialog", vocab: "Slova", sentence: "Věta", grammar: "Gram.", review: "Opak." },
      // Hungarian compound words run long (e.g. "nyelvtan", "ismétlés") -- abbreviated more
      // aggressively than cs/de/pl here so the 8-tab row still fits without horizontal scroll
      // at 320-390px (verified with Playwright; en's own long words needed a dedicated
      // body[data-app-lang="en"] font-size override elsewhere to fit, which this avoids).
      hu: { curriculum: "Kurzus", pron: "Kiejt.", bible: "Biblia", wizard: "Beszéd", vocab: "Szavak", sentence: "Mondat", grammar: "Nytan", review: "Ism." },
      id: { curriculum: "Kursus", pron: "Lafal", bible: "Alkitab", wizard: "Dialog", vocab: "Kata", sentence: "Kalimat", grammar: "Tata B.", review: "Ulas" },
      vi: { curriculum: "Khóa học", pron: "Phát âm", bible: "K.Thánh", wizard: "H.Thoại", vocab: "Từ vựng", sentence: "Mẫu câu", grammar: "Ngữ pháp", review: "Ôn tập" }
    };
    var shortReviewByLang = {
      en: { song: "Songs", pron: "Phonics", bible: "Bible", wizard: "Talks", vocab: "Words", sentence: "Clauses", grammar: "Usage" },
      de: { song: "Lieder", pron: "Laut", bible: "Bibel", wizard: "Dialog", vocab: "Wörter", sentence: "Satz", grammar: "Gramm." },
      fr: { song: "Chants", pron: "Sons", bible: "Bible", wizard: "Dialog", vocab: "Mots", sentence: "Phrase", grammar: "Gramm." },
      pl: { song: "Pieśni", pron: "Wymowa", bible: "Biblia", wizard: "Rozm.", vocab: "Słowa", sentence: "Zdanie", grammar: "Gram." },
      cs: { song: "Písně", pron: "Výsl.", bible: "Bible", wizard: "Dialog", vocab: "Slova", sentence: "Věta", grammar: "Gram." },
      hu: { song: "Dalok", pron: "Kiejt.", bible: "Biblia", wizard: "Beszéd", vocab: "Szavak", sentence: "Mondat", grammar: "Nytan" },
      id: { song: "Lagu", pron: "Lafal", bible: "Alkitab", wizard: "Dialog", vocab: "Kata", sentence: "Kalimat", grammar: "Tata B." },
      vi: { song: "Bài hát", pron: "Phát âm", bible: "K.Thánh", wizard: "H.Thoại", vocab: "Từ vựng", sentence: "Mẫu câu", grammar: "Ngữ pháp" }
    };
    // shortNamesByLang/shortReviewByLang below are keyed by tab id ("bible", "curriculum", ...),
    // not by the button's current data-i18n text, and assume each id always carries its
    // original JW-profile label. GENERAL overrides two of those labels at assemble time
    // (bible -> "숫자", curriculum -> "문화", see assemble_app.py's
    // apply_general_label_overrides) -- ORIGINAL_I18N_KEY records what data-i18n was for each id
    // *before* any such override, so the compact lookup can detect "this button's label was
    // overridden" and fall back to the (already-correct, TU()-translated) full name instead of
    // silently re-injecting the stale hardcoded short label.
    var ORIGINAL_I18N_KEY = { bible: "성경", curriculum: "과정" };
    function syncPrimaryTabLabels() {
      var compact = (currentLang === "en" || currentLang === "de" || currentLang === "fr" || currentLang === "pl" || currentLang === "cs" || currentLang === "hu" || currentLang === "id" || currentLang === "vi") && window.innerWidth < 1000;
      var shortMap = shortNamesByLang[currentLang] || {};
      document.querySelectorAll(".tabs .tab-btn").forEach(function (btn) {
        var fullName = TU(btn.getAttribute("data-i18n"));
        var relabeled = ORIGINAL_I18N_KEY[btn.dataset.tab] && ORIGINAL_I18N_KEY[btn.dataset.tab] !== btn.getAttribute("data-i18n");
        btn.textContent = (compact && !relabeled) ? (shortMap[btn.dataset.tab] || fullName) : fullName;
        if (compact) btn.setAttribute("aria-label", fullName);
        else btn.removeAttribute("aria-label");
      });
      var reviewMap = shortReviewByLang[currentLang] || {};
      document.querySelectorAll("#panel-review > .subtab-row:first-child .subtab-btn").forEach(function (btn) {
        var fullName = TU(btn.getAttribute("data-i18n"));
        var relabeled = ORIGINAL_I18N_KEY[btn.dataset.review] && ORIGINAL_I18N_KEY[btn.dataset.review] !== btn.getAttribute("data-i18n");
        btn.textContent = (compact && !relabeled) ? (reviewMap[btn.dataset.review] || fullName) : fullName;
        if (compact) btn.setAttribute("aria-label", fullName);
        else btn.removeAttribute("aria-label");
      });
    }
    syncPrimaryTabLabels();
    onLangChange(syncPrimaryTabLabels);
    window.addEventListener("resize", syncPrimaryTabLabels);
  })();

  // Separate UI display order for language selector dropdown (never derived from canonical data order)
  var UI_LANG_DISPLAY_ORDER = [
    { code: "ko", label: "한국어" },
    { code: "ja", label: "日本語" },
    { code: "zh", label: "繁體中文" },
    { code: "zh_cn", label: "简体中文" },
    { code: "cs", label: "Čeština" },
    { code: "de", label: "Deutsch" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "id", label: "Indonesia" },
    { code: "hu", label: "Magyar" },
    { code: "pl", label: "Polski" },
    { code: "vi", label: "Tiếng Việt" },
  ];
  window.UI_LANG_DISPLAY_ORDER = UI_LANG_DISPLAY_ORDER;

  // Language switch dropdown (ko, ja, zh, zh_cn, cs, de, en, fr, id, hu, pl, vi).
  // Reflects currentLang (restored from localStorage) both at startup and after every switch.
  (function bindLangSwitch() {
    var selectEl = document.getElementById("lang-select");
    if (selectEl) {
      selectEl.addEventListener("change", function () {
        setLang(selectEl.value);
      });
    }
    function sync(lang) {
      if (selectEl && selectEl.value !== lang) {
        selectEl.value = lang;
      }
    }
    sync(currentLang);
    document.documentElement.setAttribute(
      "lang",
      currentLang === "vi" ? "vi" : currentLang === "cs" ? "cs" : currentLang === "zh_cn" ? "zh-Hans" : currentLang === "zh" ? "zh-Hant" : currentLang === "en" ? "en" : currentLang === "fr" ? "fr" : currentLang === "de" ? "de" : currentLang === "hu" ? "hu" : currentLang === "id" ? "id" : currentLang === "ja" ? "ja" : currentLang === "ko" ? "ko" : currentLang === "pl" ? "pl" : "en"
    );
    if (document.body) document.body.setAttribute("data-app-lang", currentLang);
    onLangChange(sync);
  })();

  /* ---------------- static labels ---------------- */
  var REL_LABEL = {
    younger_sibling: "동생뻘",
    peer: "동갑",
    older_sibling: "형·오빠·누나·언니뻘",
    younger_than_parent: "삼촌·이모뻘(상대가 연장자)",
    older_than_parent: "부모님 또래 이상(상대가 연장자)",
    elder_uncle_aunt: "삼촌·이모뻘(내가 연장자)",
    elder_parent_age: "부모님뻘(내가 연장자)",
    stranger_polite: "초면·예의를 갖춤"
  };
  var TERM_MEAN = {
    anh: "형·오빠", "chị": "누나·언니", em: "동생",
    "cháu": "조카뻘", con: "자녀뻘(남부)",
    "chú": "삼촌·아저씨뻘", "cô": "이모·고모·아주머니뻘", "bác": "큰아버지·큰어머니뻘 어르신",
    "tớ": "나(또래·북부)", "cậu": "너(또래·북부)",
    "mình": "나(또래·남부)", "bạn": "너(또래·남부)",
    "tôi": "나(중립·예의)"
  };

  var REF_TABLE = [
    {
      title: "나보다 어린 사람 — 동생뻘",
      rows: [
        { cond: "내가 형제일 때", listener: "em", self: "anh" },
        { cond: "내가 자매일 때", listener: "em", self: "chị" }
      ]
    },
    {
      title: "나와 동갑 — 원자료에 없어 새로 구성",
      rows: [
        { cond: "북부", listener: "cậu", self: "tớ" },
        { cond: "남부", listener: "bạn", self: "mình" }
      ]
    },
    {
      title: "나보다 손위 — 형·오빠·누나·언니뻘",
      rows: [
        { cond: "상대가 남성일 때", listener: "anh", self: "em" },
        { cond: "상대가 여성일 때", listener: "chị", self: "em" }
      ]
    },
    {
      title: "삼촌·이모뻘 — 내 아버지·어머니보다는 젊은 분(상대가 연장자)",
      rows: [
        { cond: "상대가 남성 · 북부", listener: "chú", self: "cháu" },
        { cond: "상대가 남성 · 남부", listener: "chú", self: "con" },
        { cond: "상대가 여성 · 북부", listener: "cô", self: "cháu" },
        { cond: "상대가 여성 · 남부", listener: "cô", self: "con" }
      ]
    },
    {
      title: "부모님 또래이거나 더 많으신 분(상대가 연장자)",
      rows: [
        { cond: "북부", listener: "bác", self: "cháu" },
        { cond: "남부", listener: "bác", self: "con" }
      ]
    },
    {
      title: "삼촌·이모뻘 — 내가 상대방보다 훨씬 연장자",
      rows: [
        { cond: "내가 남성 · 북부", listener: "cháu", self: "chú" },
        { cond: "내가 남성 · 남부", listener: "con", self: "chú" },
        { cond: "내가 여성 · 북부", listener: "cháu", self: "cô" },
        { cond: "내가 여성 · 남부", listener: "con", self: "cô" }
      ]
    },
    {
      title: "내가 상대방 부모보다 나이가 많음",
      rows: [
        { cond: "북부", listener: "cháu", self: "bác" },
        { cond: "남부", listener: "con", self: "bác" }
      ]
    },
    {
      title: "초면 · 나이를 잘 모르고 아직 친하지 않아 거리를 둘 때",
      rows: [
        { cond: "상대가 20~30대 남성", listener: "anh", self: "tôi" },
        { cond: "상대가 20~30대 여성", listener: "chị", self: "tôi" },
        { cond: "상대가 40~70대 남성", listener: "chú", self: "tôi" },
        { cond: "상대가 40~70대 여성", listener: "cô", self: "tôi" },
        { cond: "상대가 80대 이상", listener: "bác", self: "tôi" }
      ]
    }
  ];

  // Family-tree data for the 호칭 탭's "가족 호칭 가계도" section: the direct vertical line from
  // great-grandparents down to great-grandchildren (Korean-style "4대" counting -- ego is
  // generation 1, great-grandparent/great-grandchild is generation 4), plus a second tree of
  // in-law terms that come with marriage (사돈 쪽 호칭). Each generation is a small array of
  // "groups" (paternal/maternal split, etc.), each group a list of { ko, vi, viSouth? } members.
  // me:true marks the single "나" node, which has no Vietnamese term of its own.
  var FAMILY_TREE = [
    {
      label: "증조부모",
      groups: [
        { label: "친가(아버지 쪽)", members: [
          { ko: "증조할아버지", vi: "ông cố nội" },
          { ko: "증조할머니", vi: "bà cố nội" }
        ] },
        { label: "외가(어머니 쪽)", members: [
          { ko: "외증조할아버지", vi: "ông cố ngoại" },
          { ko: "외증조할머니", vi: "bà cố ngoại" }
        ] }
      ]
    },
    {
      label: "조부모",
      groups: [
        { label: "친가(아버지 쪽)", members: [
          { ko: "할아버지", vi: "ông nội" },
          { ko: "할머니", vi: "bà nội" }
        ] },
        { label: "외가(어머니 쪽)", members: [
          { ko: "외할아버지", vi: "ông ngoại" },
          { ko: "외할머니", vi: "bà ngoại" }
        ] }
      ]
    },
    {
      label: "부모",
      groups: [
        { label: "부모", members: [
          { ko: "아버지", vi: "bố", viSouth: "ba" },
          { ko: "어머니", vi: "mẹ", viSouth: "má" }
        ] }
      ]
    },
    {
      label: "나·형제자매·배우자",
      groups: [
        { label: "나", isMe: true, members: [ { ko: "나", me: true } ] },
        { label: "형제자매", members: [
          { ko: "형·오빠", vi: "anh trai" },
          { ko: "누나·언니", vi: "chị gái" },
          { ko: "남동생", vi: "em trai" },
          { ko: "여동생", vi: "em gái" }
        ] },
        { label: "배우자", members: [
          { ko: "남편", vi: "chồng" },
          { ko: "아내", vi: "vợ" }
        ] }
      ]
    },
    {
      label: "자녀",
      groups: [
        { label: "자녀", members: [
          { ko: "아들", vi: "con trai" },
          { ko: "딸", vi: "con gái" }
        ] },
        { label: "며느리·사위", members: [
          { ko: "며느리", vi: "con dâu" },
          { ko: "사위", vi: "con rể" }
        ] }
      ]
    },
    {
      label: "손주",
      groups: [
        { label: "친손(아들의 자녀)", members: [
          { ko: "친손자", vi: "cháu nội trai" },
          { ko: "친손녀", vi: "cháu nội gái" }
        ] },
        { label: "외손(딸의 자녀)", members: [
          { ko: "외손자", vi: "cháu ngoại trai" },
          { ko: "외손녀", vi: "cháu ngoại gái" }
        ] }
      ]
    },
    {
      label: "증손주",
      groups: [
        { label: "친증손(아들 쪽 손주의 자녀)", members: [
          { ko: "친증손자", vi: "chắt nội trai" },
          { ko: "친증손녀", vi: "chắt nội gái" }
        ] },
        { label: "외증손(딸 쪽 손주의 자녀)", members: [
          { ko: "외증손자", vi: "chắt ngoại trai" },
          { ko: "외증손녀", vi: "chắt ngoại gái" }
        ] }
      ]
    }
  ];

  var FAMILY_INLAW = [
    {
      label: "배우자의 부모님",
      groups: [
        { label: "남편의 부모(아내 입장)", members: [
          { ko: "시아버지(남편의 아버지)", vi: "bố chồng" },
          { ko: "시어머니(남편의 어머니)", vi: "mẹ chồng" }
        ] },
        { label: "아내의 부모(남편 입장)", members: [
          { ko: "장인(아내의 아버지)", vi: "bố vợ" },
          { ko: "장모(아내의 어머니)", vi: "mẹ vợ" }
        ] }
      ]
    },
    {
      label: "배우자의 형제자매",
      groups: [
        { label: "남편의 형제자매(아내 입장)", members: [
          { ko: "아주버님(남편의 형)", vi: "anh chồng" },
          { ko: "손위 시누이(남편의 누나)", vi: "chị chồng" },
          { ko: "시동생(남편의 남동생)", vi: "em chồng trai" },
          { ko: "손아래 시누이(남편의 여동생)", vi: "em chồng gái" }
        ] },
        { label: "아내의 형제자매(남편 입장)", members: [
          { ko: "손위 처남(아내의 오빠)", vi: "anh vợ" },
          { ko: "처형(아내의 언니)", vi: "chị vợ" },
          { ko: "손아래 처남(아내의 남동생)", vi: "em vợ trai" },
          { ko: "처제(아내의 여동생)", vi: "em vợ gái" }
        ] }
      ]
    },
    {
      label: "형제자매의 배우자",
      groups: [
        { label: "오빠·남동생의 아내", members: [
          { ko: "올케(오빠의 아내)", vi: "chị dâu" },
          { ko: "올케(남동생의 아내)", vi: "em dâu" }
        ] },
        { label: "언니·여동생의 남편", members: [
          { ko: "형부(언니의 남편)", vi: "anh rể" },
          { ko: "제부(여동생의 남편)", vi: "em rể" }
        ] }
      ]
    },
    {
      label: "자녀의 배우자 쪽 부모",
      groups: [
        { label: "사돈", members: [
          { ko: "사돈(자녀 배우자의 부모)", vi: "thông gia", viSouth: "sui gia" },
          { ko: "사돈을 맺다", vi: "thông gia", viSouth: "làm sui" },
          { ko: "사돈어른(바깥사돈)", forms: [
            { label: "제3자에게 말할 때", vi: "ông thông gia" },
            { label: "직접 호칭할 때", vi: "anh sui" }
          ] },
          { ko: "안사돈", forms: [
            { label: "제3자에게 말할 때", vi: "bà thông gia" },
            { label: "직접 호칭할 때", vi: "chị sui" }
          ] }
        ] }
      ]
    }
  ];

  /* ---------------- helpers ---------------- */
  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Appends the Vietnamese tone name in parentheses -- e.g. "단평성(thanh ngang)" -- after a
  // translated tone-category label, wherever one of the 6 tone names (or a "T1 + T2" pairing of
  // them) is shown: the 성조 tab's 6-tone list, the 연속 성조 tab's tone-pair group headers, and
  // the 성조 대응 (Vietnamese-tone <-> Mandarin-tone) section. Keyed off each label dict's own
  // 'ko' value (stable across UI languages, since translated text alone can't be mapped back to
  // a tone) rather than needing every one of TONES/TONE_PAIRS/TONE_ZH_CORR's data shapes to also
  // carry a raw tone-key field.
  var TONE_VI_NAME = { "단평성": "ngang", "상성": "sắc", "장평성": "huyền", "회성": "hỏi", "거성": "ngã", "하성": "nặng" };
  function toneNameWithVi(krDict) {
    var label = T(krDict);
    var vi = krDict && TONE_VI_NAME[krDict.ko];
    return vi ? label + "(thanh " + vi + ")" : label;
  }

  // Unicode-aware whole-word replace: plain \b fails on Vietnamese words that end in an
  // accented letter (e.g. "tớ"), since JS \b only recognizes ASCII [A-Za-z0-9_] as "word"
  // characters. Using \p{L} lookaround instead makes the boundary check accent-correct.
  function wordReplace(text, from, to) {
    if (!text || !from) return text;
    var re = new RegExp("(?<![\\p{L}])" + escapeRegex(from) + "(?![\\p{L}])", "gu");
    return text.replace(re, to);
  }

  // The "ạ" politeness particle only ever belongs to the cháu-addressing-chú/cô/bác
  // scenario, and only in its north ("cháu") form -- the south ("con") form drops it.
  // Every other category already has no ạ in its source text, so this is a safe no-op there.
  function stripA(text) {
    if (!text) return text;
    return text.replace(/\sạ(?=[!?.,]|\s|$)/gu, "");
  }

  // Swaps a case's north-canonical address terms for their south-Vietnam equivalents
  // (e.g. cháu->con, or for peers both cậu->bạn and tớ->mình at once).
  function applyRegionText(text, c, region) {
    if (!text || region !== "south") return text;
    var out = text;
    if (c.self_term_south) {
      out = wordReplace(out, capitalize(c.self_term), capitalize(c.self_term_south));
      out = wordReplace(out, c.self_term, c.self_term_south);
    }
    if (c.listener_term_south) {
      out = wordReplace(out, capitalize(c.listener_term), capitalize(c.listener_term_south));
      out = wordReplace(out, c.listener_term, c.listener_term_south);
    }
    return out;
  }

  // Swaps the built-in placeholder names for the ones the user typed in, if any. viet=true
  // substitutes the Vietnamese-spelled name (used in Vietnamese sentences, same in every UI
  // language since the Vietnamese text itself never changes); otherwise the name is
  // substituted into the CURRENT reference language's own placeholder pair, since each
  // language's reference text uses its own placeholder names (동주/수지 in ko, 志明/春嬌 in
  // zh, John/Mary in en, 太郎/花子 in ja) and each is stored separately so switching languages
  // doesn't leave a Korean name sitting inside an English sentence or vice versa.
  var userNameByLang = { ko: "", zh: "", en: "", ja: "" };
  var userNameVi = "";
  var REF_NAME_PLACEHOLDERS = {
    ko: ["수지", "동주"],
    zh: ["春嬌", "志明"],
    en: ["Mary", "John"],
    ja: ["花子", "太郎"]
  };

  // Minimal standalone batchim (받침) check for a Korean string's last syllable, used only to
  // pick the right allomorph (야/이야, 예요/이에요) when a user-typed name is substituted into
  // the ko placeholder text below. This duplicates the fuller decomposeHangul/hasBatchimStr
  // pair defined inside the sentence-builder IIFE further down the file (search
  // "function hasBatchimStr") rather than sharing it, since that copy is private to its own
  // closure and this substitution runs long before it in file order.
  function nameHasBatchim(str) {
    if (!str) return false;
    var code = str.charCodeAt(str.length - 1) - 0xAC00;
    if (code < 0 || code > 11171) return false; // not a precomposed Hangul syllable
    return code % 28 !== 0;
  }

  function applyNameText(text, viet) {
    if (!text) return text;
    var out = text;
    if (userNameVi) {
      // The Vietnamese placeholder also appears in word-by-word glosses, regardless
      // of the active UI language. Keep it aligned with the spoken sentence.
      out = wordReplace(out, "Suji", userNameVi);
      out = wordReplace(out, "Đông-ju", userNameVi);
    }
    if (!viet) {
      var myName = userNameByLang[currentLang];
      if (myName) {
        var placeholders = REF_NAME_PLACEHOLDERS[currentLang] || [];
        placeholders.forEach(function (ph) {
          if (currentLang === "ko") {
            // Korean particles attach directly to the name with no space (e.g. "동주는",
            // "동주예요"), so a \p{L}-boundary check never matches -- every neighboring
            // character is also a letter. A plain substring replace is safe here since these
            // are full 2-syllable placeholder names, not fragments likely to collide with
            // other Korean text. The placeholder names (동주/수지) both end with no batchim, so
            // the source text was written assuming the batchim-less allomorph (야/예요) --
            // when the user's own name ends WITH a batchim (e.g. "이주복"), that allomorph is
            // wrong ("이주복야"/"이주복예요") and must switch to 이야/이에요.
            var hb = nameHasBatchim(myName);
            out = out.split(ph + "예요").join(myName + (hb ? "이에요" : "예요"));
            out = out.split(ph + "야").join(myName + (hb ? "이야" : "야"));
            out = out.split(ph).join(myName);
          } else {
            out = wordReplace(out, ph, myName);
          }
        });
      }
    }
    return out;
  }

  // Companion (봉사짝) name substitution -- swaps the wizard's hardcoded placeholder names
  // "Mai" (female companion; viet/zh/en/ja text) / "마이" (its Korean transliteration) and
  // "Bình" (male companion) / "빈" for the user's own companion's name from
  // peopleState.companion, once one has been entered on the people-profile card. Scoped to the
  // specific case IDs whose "함께 방문" stage set actually introduces a ministry companion by
  // that name -- case s6 deliberately excluded even though its text also contains "Chị Mai",
  // because there "Mai" is coincidentally ALSO the ministry CONTACT's own self-introduced name
  // (reply.name === "Mai" throughout every stage of s6), so a blanket substitution would
  // incorrectly rename the contact along with the companion. s8 has the same "Mai"-named
  // contact but no companion-introduction stage at all, so it was never in scope to begin with.
  var COMPANION_CASES = {
    s2: 1, s3: 1, s7: 1, s10: 1, s11: 1, s14: 1, s15: 1, s18: 1, s19: 1, s22: 1, s24: 1, s26: 1, s28: 1
  };
  function applyCompanionText(text, viet, caseId) {
    if (!text || !COMPANION_CASES[caseId]) return text;
    var out = text;
    var comp = peopleState.companion;
    if (viet || currentLang !== "ko") {
      var compVi = (comp.nameVi || "").trim();
      if (compVi) {
        if (viet) {
          // Third-person introductions of the companion ("chị Mai", "anh Bình") should use
          // whichever honorific actually fits the LISTENER's age relative to the companion --
          // not the fixed "chị"/"anh" baked into the source text, which only ever reflected the
          // companion's own gender (chị=Mai/female, anh=Bình/male), never any age relationship.
          // Falls through to the plain name swap below (leaving the original "chị"/"anh") until
          // enough people-profile info is entered to compute a listener-facing term.
          var listenerInfo = computeCompanionTermForListener();
          if (listenerInfo) {
            out = out.replace(/\bChị Mai\b/g, capitalize(listenerInfo.term) + " " + compVi);
            out = out.replace(/\bchị Mai\b/g, listenerInfo.term + " " + compVi);
            out = out.replace(/\bAnh Bình\b/g, capitalize(listenerInfo.term) + " " + compVi);
            out = out.replace(/\banh Bình\b/g, listenerInfo.term + " " + compVi);
          }
        }
        // Anything left over -- a bare "Mai"/"Bình" (no listener term available yet, or inside
        // the companion's own self-introduction "Chị tên là Mai.", where the leading "Chị" is
        // HER OWN self-reference rather than a title assigned to her by someone else, so it's
        // intentionally left alone) -- just gets the plain name swapped in. Also covers the zh/
        // en/ja renderings, which keep "Mai"/"Bình" as a literal Latin name (in zh/ja it sits
        // directly against a CJK/kana character with no space, e.g. "Mai姐", so a plain
        // substring swap is used rather than a \p{L}-boundary-aware wordReplace, which would
        // never match there).
        out = out.split("Mai").join(compVi);
        out = out.split("Bình").join(compVi);
      }
    } else {
      var compKr = (comp.nameKr || "").trim();
      if (compKr) {
        out = out.split("마이").join(compKr);
        out = out.split("빈").join(compKr);
      }
    }
    return out;
  }

  // Same substitution applied to the raw (always-Korean) stage-name keys used for the
  // stage-pill nav labels and stage-title heading (e.g. "마이 자매 번호 전달"). These keys have
  // no I18N_UI translation entries, so TU() already just echoes them back verbatim in every UI
  // language -- meaning a single Korean-text substitution here covers all languages uniformly.
  function applyCompanionStageName(name, caseId) {
    if (!COMPANION_CASES[caseId]) return name;
    var compKr = (peopleState.companion.nameKr || "").trim();
    if (!compKr) return name;
    return name.split("마이").join(compKr).split("빈").join(compKr);
  }
  function displayStageName(name, caseId) {
    var label = name.replace(/^\d+\.\s*/, "");
    if (label === "번외: 하느님의 이름과 소망") return "집회 초대";
    return applyCompanionStageName(label, caseId);
  }

  /* -------- text-to-speech voice selection -------- */
  // "발음 듣기 목소리" now offers 3 kinds of voice: a Northern-Vietnamese voice, a Southern-
  // Vietnamese voice, and the current UI-language's own voice (selectedLangVoiceURI below,
  // already used for 전체 듣기's meaning/translation half). Browsers rarely label installed
  // Vietnamese voices by region, so both dialect slots are picked from the same detected
  // Vietnamese voice list -- the learner assigns whichever installed voice they want to each
  // role. activeDialect picks which of the two is actually used whenever the app speaks
  // Vietnamese; it's a single global toggle (persisted), so switching it in 설정 also takes
  // effect in 문법·복습 and everywhere else speak()/읽기 is used.
  var selectedViVoiceURI = { north: null, south: null };
  var availableViVoices = [];
  var activeDialect = "north";
  try {
    var savedDialect = window.localStorage && window.localStorage.getItem("vn-app-dialect");
    if (savedDialect === "north" || savedDialect === "south") activeDialect = savedDialect;
  } catch (eDialect) { /* no-op */ }
  function saveDialectPref() {
    try { window.localStorage && window.localStorage.setItem("vn-app-dialect", activeDialect); } catch (e) { /* no-op */ }
  }
  function currentViVoice() {
    // A north/south switch is meaningful only when this browser exposes both
    // region-labelled voices. Otherwise let vi-VN use the browser's default.
    if (!pickAutoViVoice("north") || !pickAutoViVoice("south")) return null;
    var key = selectedViVoiceURI[activeDialect];
    if (!key) return null;
    return availableViVoices.filter(function (x) { return voiceMatchKey(x) === key; })[0] || null;
  }
  // Any number of dialect-toggle widgets (설정, 문법, 복습) can be on screen; each one that wants
  // to render itself calls renderDialectToggle(itsOwnRoot) once and is auto-kept in sync with the
  // others (any of them changing activeDialect re-renders every registered widget).
  var DIALECT_CHANGE_LISTENERS = [];
  function onDialectChange(fn) { DIALECT_CHANGE_LISTENERS.push(fn); }
  function renderDialectToggle(root) {
    if (!root) return;
    var html = '<div class="dialect-toggle" role="tablist">' +
      '<button type="button" class="dialect-toggle-btn" data-dialect="north" aria-selected="' + (activeDialect === "north" ? "true" : "false") + '">' + TU("북부") + '</button>' +
      '<button type="button" class="dialect-toggle-btn" data-dialect="south" aria-selected="' + (activeDialect === "south" ? "true" : "false") + '">' + TU("남부") + '</button>' +
      '</div>';
    root.innerHTML = html;
    root.querySelectorAll(".dialect-toggle-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        if (activeDialect === b.dataset.dialect) return;
        activeDialect = b.dataset.dialect;
        saveDialectPref();
        DIALECT_CHANGE_LISTENERS.forEach(function (fn) { fn(activeDialect); });
      });
    });
  }

  // "베트남어 반복 듣기 횟수" -- a separate, likewise-persisted global setting controlling how
  // many times in a row speak() (every individual 발음 듣기 button throughout the app, plus
  // 전체 듣기's Vietnamese half via playReadAllNext()) reads a Vietnamese phrase before moving
  // on, for learners who want extra repetition without re-tapping the listen button each time.
  // One shared global, same single-setting-with-multiple-synced-widgets pattern as activeDialect
  // above -- adjusting it from 발음 설정 or 복습 keeps both widgets (and every actual playback)
  // in sync.
  var VI_REPEAT_OPTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var viRepeatCount = 1;
  try {
    var savedViRepeat = parseInt(window.localStorage && window.localStorage.getItem("vn-app-vi-repeat"), 10);
    if (VI_REPEAT_OPTS.indexOf(savedViRepeat) >= 0) viRepeatCount = savedViRepeat;
  } catch (eViRepeat) { /* no-op */ }
  function saveViRepeatPref() {
    try { window.localStorage && window.localStorage.setItem("vn-app-vi-repeat", String(viRepeatCount)); } catch (e) { /* no-op */ }
  }
  // English pluralizes ("1 time" / "2 times") while ko/zh/ja simply suffix the number with the
  // counter word (1회/1次/1回) -- same "number word order differs by language" issue weekBadge()
  // handles for "N주" elsewhere in this file.
  function repeatCountLabel(n) {
    if (currentLang === "en") return n + " " + TU("회") + (n === 1 ? "" : "s");
    return n + TU("회");
  }
  var VI_REPEAT_CHANGE_LISTENERS = [];
  function onViRepeatChange(fn) { VI_REPEAT_CHANGE_LISTENERS.push(fn); }
  function renderViRepeatToggle(root) {
    if (!root) return;
    var html = '<select class="repeat-count-select" aria-label="' + TU("베트남어 반복 듣기 횟수") + '">' +
      VI_REPEAT_OPTS.map(function (n) {
        return '<option value="' + n + '"' + (viRepeatCount === n ? " selected" : "") + '>' + repeatCountLabel(n) + '</option>';
      }).join("") +
      '</select>';
    root.innerHTML = html;
    root.querySelector(".repeat-count-select").addEventListener("change", function (e) {
      var n = parseInt(e.target.value, 10);
      if (viRepeatCount === n) return;
      viRepeatCount = n;
      saveViRepeatPref();
      VI_REPEAT_CHANGE_LISTENERS.forEach(function (fn) { fn(viRepeatCount); });
    });
  }
  // Every widget instance (발음 설정, 복습) re-renders whenever the setting changes from ANY of
  // them, or the UI language changes (the "N회"/"N times" labels are translated) -- same
  // multi-widget-sync approach as renderAllDialectToggles() below.
  function renderAllViRepeatToggles() {
    ["repeat-toggle-settings", "repeat-toggle-review"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) renderViRepeatToggle(el);
    });
  }
  onViRepeatChange(renderAllViRepeatToggles);
  onLangChange(renderAllViRepeatToggles);

  // "전체 듣기" (read-all) can also read a word's meaning / a sentence's translation right after
  // the Vietnamese, in whichever UI language mode (ko/zh/en/ja) is currently active -- this is a
  // SEPARATE voice from the Vietnamese one above, picked per UI language and remembered across a
  // language switch (selectedLangVoiceURI is keyed by lang so switching ko->en->ko keeps both
  // choices). Not persisted to localStorage, matching selectedVoiceURI's existing in-memory-only
  // behavior.
  var selectedLangVoiceURI = {};
  var availableLangVoices = [];
  var LANG_BCP47_PREFIX = { vi: "vi", cs: "cs", zh_cn: "zh", zh: "zh", en: "en", fr: "fr", de: "de", hu: "hu", id: "id", ja: "ja", ko: "ko", pl: "pl" };

  // Apple's iOS/macOS "novelty" voices (Eddy, Flo, Grandma, Grandpa, Reed, Rocko, Sandy, Shelley)
  // apply cartoonish pitch/rate effects that make them unsuitable for reading study content aloud,
  // and they show up under every language's voice list, not just English -- so they're filtered
  // out here, once, for both the Vietnamese picker and every language-mode picker, rather than at
  // each call site. Matched on a leading word so a quality suffix like "Eddy (Enhanced)" still hits.
  var NOVELTY_VOICE_NAMES = ["Eddy", "Flo", "Grandma", "Grandpa", "Reed", "Rocko", "Sandy", "Shelley"];
  var NOVELTY_VOICE_RE = new RegExp("^(" + NOVELTY_VOICE_NAMES.join("|") + ")(\\b|$)", "i");
  function isNoveltyVoice(v) { return NOVELTY_VOICE_RE.test(v.name || ""); }

  // A stable, collision-proof identifier for a detected voice, used as both the radio <input>
  // value and the selectedViVoiceURI/selectedLangVoiceURI storage key. voiceURI ALONE is not
  // safe for this on every platform: iOS/iPadOS Safari is known to report an empty or
  // NON-unique voiceURI for some voices -- notably, a voice's standard-quality and "고품질"
  // (Enhanced/Premium) tiers can share the exact same voiceURI while only their .name differs.
  // When two radio inputs in the same picker end up with the identical value, the browser's
  // native "only one radio per name can be checked" rule silently resolves the visible
  // selection to whichever one happens to be last in DOM order -- NOT whichever one the learner
  // actually clicked -- which is exactly the "can't select anything except what's already
  // selected" symptom reported for the 발음 > 설정 voice pickers. Folding name+lang into the key
  // guarantees two differently-named voices never collide, even when voiceURI itself is blank
  // or duplicated.
  function voiceMatchKey(v) {
    return (v.voiceURI || "") + "||" + (v.name || "") + "||" + (v.lang || "");
  }

  function refreshVoices() {
    try {
      if (!("speechSynthesis" in window)) return;
      var all = window.speechSynthesis.getVoices().filter(function (v) { return !isNoveltyVoice(v); });
      availableViVoices = all.filter(function (v) {
        return /^vi(-|_|$)/i.test(v.lang);
      });
      var prefix = LANG_BCP47_PREFIX[currentLang] || "en";
      availableLangVoices = all.filter(function (v) {
        return new RegExp("^" + prefix + "(-|_|$)", "i").test(v.lang);
      });
      renderVoicePicker();
      renderLangVoicePicker();
    } catch (e) { /* no-op */ }
  }
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
    // iOS/iPadOS Safari doesn't always fire "voiceschanged" once every installed voice is
    // actually ready -- some downloaded (including "고품질"/Enhanced) voices only show up in
    // getVoices() a moment after the page loads, with no event marking that moment. A few
    // cheap re-checks over the first several seconds catch that late arrival without needing
    // the learner to do anything (re-render is a no-op if the list hasn't actually changed).
    [800, 2000, 4000].forEach(function (ms) { setTimeout(refreshVoices, ms); });
  }
  // Re-filter availableLangVoices (and re-render its picker) whenever the UI language changes,
  // since which installed voices count as "matching" depends on currentLang.
  onLangChange(function () { refreshVoices(); });

  function guessGender(name) {
    var n = name.toLowerCase();
    if (/(nữ|female|hoaimy|linh|mai|lan|thu|huong|nu\b)/.test(n)) return "female";
    if (/(nam\b|male|namminh|minh|quan|hung|nguyen)/.test(n)) return "male";
    return null;
  }

  // Most installed Vietnamese voices aren't labeled by region at all, so the learner has to pick
  // one for north/south themselves -- but iOS/Safari IS an exception: its Korean-locale voice
  // list actually names each Vietnamese voice after the real-world city its accent is modeled on
  // (e.g. "베트남어(하노이, 베트남) 음성 1/2" for the northern accent, "베트남어(껀터, 베트남)
  // 음성 3/4" for the southern one -- Cần Thơ is a major Mekong Delta city, i.e. a genuinely
  // southern accent, unlike most of this app's other voice-name heuristics which are just gender
  // guesses). Where a name like that is present, auto-select it as that dialect's default instead
  // of falling back to "first voice in the list" for both dialects (which used to mean north and
  // south defaulted to the very same voice until the learner manually fixed it).
  var VI_REGION_NAME_HINTS = {
    north: ["하노이", "ha noi", "hà nội", "hanoi"],
    south: ["껀터", "can tho", "cần thơ"]
  };
  function pickAutoViVoice(dialect) {
    var hints = VI_REGION_NAME_HINTS[dialect];
    if (!hints) return null;
    var match = availableViVoices.filter(function (v) {
      var n = v.name.toLowerCase();
      return hints.some(function (h) { return n.indexOf(h) >= 0; });
    })[0];
    return match || null;
  }

  // Known Vietnamese Siri voice names (iOS, system language set to Korean -- see the comment on
  // VI_REGION_NAME_HINTS above) that speechSynthesis.getVoices() only reports once the learner has
  // actually downloaded them in 설정 > 손쉬운 사용 > 음성, same "detected on-device only"
  // limitation LANG_VOICE_REFERENCE below works around for the language-mode picker. Listing them
  // here even when undetected lets the north/south pickers show these as selectable-once-installed
  // "다운로드 필요" placeholders, so a learner who currently has just one Vietnamese voice (e.g.
  // "Linh (고품질)") can discover and go install a genuinely different Vietnamese voice for the
  // other dialect slot, instead of the picker silently offering nothing else. Split north/south so
  // each picker only advertises the placeholders for its own region.
  var VI_VOICE_REFERENCE = {
    north: ["베트남어(하노이, 베트남) 음성 1", "베트남어(하노이, 베트남) 음성 2"],
    south: ["베트남어(껀터, 베트남) 음성 3", "베트남어(껀터, 베트남) 음성 4"]
  };

  // Renders one dialect's (north/south) Vietnamese voice picker, from the same detected-voice
  // list -- installed voices are almost never labeled by region, so the learner assigns whichever
  // one they want to each role (unless pickAutoViVoice() above found a region-named match to use
  // as the default). Only Vietnamese-tagged voices are ever listed here (unlike the language-mode
  // picker, this one never mixes in other languages) -- known-but-not-yet-downloaded Vietnamese
  // voices are still shown, disabled and tagged "다운로드 필요", via VI_VOICE_REFERENCE above.
  function renderViVoicePicker(dialect) {
    var root = document.getElementById("voice-picker-" + dialect);
    if (!root) return;
    var ref = VI_VOICE_REFERENCE[dialect] || [];
    if (!availableViVoices.length && !ref.length) {
      root.innerHTML = '<p class="p-desc">' + TU("이 브라우저에서는 베트남어 음성을 찾을 수 없어요. 기본 음성으로 재생을 시도합니다.") + '</p>';
      return;
    }
    var autoVoice = pickAutoViVoice(dialect);
    var sel = selectedViVoiceURI[dialect] || (autoVoice && voiceMatchKey(autoVoice)) || (availableViVoices[0] && voiceMatchKey(availableViVoices[0]));
    var html = '<div class="voice-grid">';
    availableViVoices.forEach(function (v) {
      var key = voiceMatchKey(v);
      var checked = sel === key;
      var g = guessGender(v.name);
      var tag = g === "female" ? TU("여성 추정") : g === "male" ? TU("남성 추정") : "";
      html += '<label class="voice-opt"><input type="radio" name="voice-pick-' + dialect + '" value="' + escapeAttr(key) + '" ' + (checked ? "checked" : "") + '>' +
        '<span class="vname">' + escapeHtml(v.name) + '</span><span class="vmeta">' + escapeHtml(v.lang) + (tag ? " · " + tag : "") + '</span></label>';
    });
    var detectedNames = availableViVoices.map(function (v) { return v.name; });
    var missing = ref.filter(function (nm) { return detectedNames.indexOf(nm) < 0; });
    missing.forEach(function (nm) {
      html += '<label class="voice-opt voice-opt-missing"><input type="radio" disabled>' +
        '<span class="vname">' + escapeHtml(nm) + '</span><span class="vmeta voice-missing-tag">' + TU("다운로드 필요") + '</span></label>';
    });
    html += '</div>';
    if (missing.length) {
      html += '<p class="p-desc voice-download-note">' + TU("다운로드 필요라고 표시된 음성은 아직 이 기기에 설치돼 있지 않아요. 설정 > 손쉬운 사용 > 읽기 및 말하기(또는 콘텐츠 말하기) > 음성에서 해당 언어를 찾아 다운로드하면 선택할 수 있어요.") + '</p>';
    }
    html += '<p class="p-desc voice-download-note">' + TU("이미 기기에 다운로드한 음성인데도 여기에 보이지 않는다면, 이 브라우저 앱을 완전히 종료했다가 다시 열거나 기기를 재시작해 보세요. 특히 '고품질' 음성은 iOS/사파리에서 바로 인식되지 않는 경우가 있어요.") + '</p>';
    root.innerHTML = html;
    if (!selectedViVoiceURI[dialect] && sel) selectedViVoiceURI[dialect] = sel;
    root.querySelectorAll('input[name="voice-pick-' + dialect + '"]:not([disabled])').forEach(function (r) {
      r.addEventListener("change", function () { selectedViVoiceURI[dialect] = r.value; });
    });
  }
  function renderVoicePicker() {
    var regionSettings = document.getElementById("vi-region-settings");
    var hasRegionalVoices = !!(pickAutoViVoice("north") && pickAutoViVoice("south"));
    if (regionSettings) regionSettings.hidden = !hasRegionalVoices;
    if (!hasRegionalVoices) return;
    renderViVoicePicker("north");
    renderViVoicePicker("south");
    renderAllDialectToggles();
  }
  // Every dialect-toggle widget on the page (설정, 문법, 복습) shares one activeDialect, so they
  // all need to stay in sync: re-render all three whenever activeDialect changes (via any one of
  // them) or the UI language changes (their 북부/남부 labels are translated).
  function renderAllDialectToggles() {
    ["dialect-toggle-settings", "dialect-toggle-grammar", "dialect-toggle-review"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) renderDialectToggle(el);
    });
  }
  onDialectChange(renderAllDialectToggles);
  onLangChange(renderAllDialectToggles);
  renderAllDialectToggles();
  renderAllViRepeatToggles();

  // Reference list of every voice name iOS's Settings > 손쉬운 사용(접근성) > 읽기 및 말하기 >
  // 음성 screen offers to pick from for a given UI language -- NOT just the ones this browser
  // happens to have detected via speechSynthesis.getVoices() (that API only ever reports voices
  // already downloaded on-device, so it can't tell us about ones the user hasn't installed yet).
  // Keyed by currentLang. Only "ko" is populated for now (from the exact iOS voice list the user
  // gave us); zh/en/ja fall back to showing only detected voices, same as before this feature,
  // rather than risk listing fabricated/unverified voice names as if they were real.
  var LANG_VOICE_REFERENCE = {
    ko: ["민수", "민수(고품질)", "소라", "소라(고품질)", "수현", "수현(고품질)", "유나", "유나(고품질)", "유나(프리미엄)", "지안", "지안(고품질)", "지안(프리미엄)"]
  };

  // Mirrors renderVoicePicker() above, but for the "meaning / translation" voice that reads the
  // current UI language after each Vietnamese phrase during 전체 듣기 (see playReadAllNext()).
  // Shows every voice this language could offer (LANG_VOICE_REFERENCE ∪ actually-detected voices),
  // with reference-only entries (known to exist, but not yet installed on this device) shown
  // disabled and tagged "다운로드 필요" rather than hidden, so the learner knows they can go get it.
  function renderLangVoicePicker() {
    var root = document.getElementById("voice-picker-lang");
    if (!root) return;
    var section = document.getElementById("language-voice-settings");
    if (section) section.hidden = availableLangVoices.length < 2;
    if (availableLangVoices.length < 2) return;
    var ref = LANG_VOICE_REFERENCE[currentLang] || [];
    if (!availableLangVoices.length && !ref.length) {
      root.innerHTML = '<p class="p-desc">' + TU("이 브라우저에서는 현재 언어 모드의 음성을 찾을 수 없어요. 뜻·해석 읽기는 기본 음성으로 재생을 시도합니다.") + '</p>';
      return;
    }
    var sel = selectedLangVoiceURI[currentLang];
    var html = '<p class="p-desc">' + TU("전체 듣기에서 베트남어 다음에 단어 뜻이나 문장 해석을 읽어줄 때 사용할 목소리를 선택하세요. (기기·브라우저에 설치된, 현재 언어 모드에 맞는 음성만 표시돼요)") + '</p><div class="voice-grid">';
    availableLangVoices.forEach(function (v, i) {
      var key = voiceMatchKey(v);
      var checked = sel === key || (!sel && i === 0);
      html += '<label class="voice-opt"><input type="radio" name="voice-pick-lang" value="' + escapeAttr(key) + '" ' + (checked ? "checked" : "") + '>' +
        '<span class="vname">' + escapeHtml(v.name) + '</span><span class="vmeta">' + escapeHtml(v.lang) + '</span></label>';
    });
    var detectedNames = availableLangVoices.map(function (v) { return v.name; });
    var missing = ref.filter(function (nm) { return detectedNames.indexOf(nm) < 0; });
    missing.forEach(function (nm) {
      html += '<label class="voice-opt voice-opt-missing"><input type="radio" disabled>' +
        '<span class="vname">' + escapeHtml(nm) + '</span><span class="vmeta voice-missing-tag">' + TU("다운로드 필요") + '</span></label>';
    });
    html += '</div>';
    if (missing.length) {
      html += '<p class="p-desc voice-download-note">' + TU("다운로드 필요라고 표시된 음성은 아직 이 기기에 설치돼 있지 않아요. 설정 > 손쉬운 사용 > 읽기 및 말하기(또는 콘텐츠 말하기) > 음성에서 해당 언어를 찾아 다운로드하면 선택할 수 있어요.") + '</p>';
    }
    html += '<p class="p-desc voice-download-note">' + TU("이미 기기에 다운로드한 음성인데도 여기에 보이지 않는다면, 이 브라우저 앱을 완전히 종료했다가 다시 열거나 기기를 재시작해 보세요. 특히 '고품질' 음성은 iOS/사파리에서 바로 인식되지 않는 경우가 있어요.") + '</p>';
    root.innerHTML = html;
    if (!sel && availableLangVoices[0]) selectedLangVoiceURI[currentLang] = voiceMatchKey(availableLangVoices[0]);
    root.querySelectorAll('input[name="voice-pick-lang"]:not([disabled])').forEach(function (r) {
      r.addEventListener("change", function () { selectedLangVoiceURI[currentLang] = r.value; });
    });
  }

  // "/" between two alternatives or synonyms (e.g. "담보/보장하다", "Dạ, được. / Dạ, không được.")
  // reads badly through TTS in every language this app speaks -- most voices spell out the
  // character itself ("슬래시"/"slash"/"斜線"/"スラッシュ") instead of treating it as a separator.
  // A comma reads naturally as a brief pause between the alternatives, so both prepareSpeechText()
  // (Vietnamese, below) and prepareMeaningSpeechText() (meaning/translation text, used by
  // speakMeaning()/playReadAllMeaning()) swap it in via this shared helper before speaking --
  // only the spoken utterance changes; the slash shown on screen is untouched.
  function stripSlashForSpeech(text) {
    return String(text).replace(/\s*\/\s*/g, ", ");
  }
  // "Sáng thế 1:1"-style chapter:verse notation reads badly through TTS (the bare colon
  // trips most Vietnamese voices) -- spelling out chương/câu around the numbers fixes the
  // audio without touching what's shown on screen (only speak()'s utterance text runs
  // through this, never the DOM).
  function prepareSpeechText(text) {
    if (!text) return text;
    var out = stripSlashForSpeech(text.trim());
    // A bare single letter/syllable with nothing else in the utterance -- a lone tone-mark
    // syllable like "á" (성조 탭), a single-letter alphabet name like "a"/"ư" (문자 탭), or a
    // word like "ý" (어휘 탭 한자음 意/뜻) -- trips many Vietnamese TTS voices' "spell out a
    // single character" heuristic: they read the LETTER NAME plus its tone mark's name
    // ("a sắc"/"y sắc") instead of just the sound/word itself. A trailing period pushes the
    // engine into normal sentence-level reading (it's silent, so the spoken sound itself is
    // unaffected) without needing to touch how the text is displayed on screen.
    if (out.length === 1) out = out + ".";
    // The same "spell out a single character" heuristic above also fires on a bare, untoned "y"
    // syllable even when it ISN'T the whole utterance -- words like "y tế", "y học", "y tá",
    // "y sĩ", "y phục" (동일음 탭) still have many Vietnamese TTS voices read that first syllable
    // as the alphabet letter name instead of the vowel sound. "y" standing alone is pronounced
    // identically to "i" in Vietnamese, so swapping it in for speech only (never for the text
    // shown on screen) sidesteps the heuristic without changing how the word sounds. Scoped to a
    // whole-token "y"/"Y" (flanked by whitespace or the string's edges) so it never touches "y"
    // that's part of a larger syllable like "yêu"/"quy", or a toned form like "ý"/"quý" (a
    // different character). JS's \b treats Vietnamese diacritic letters as non-word characters,
    // so \b alone would wrongly fire inside e.g. "yêu" (between "y" and "ê"); explicit
    // whitespace/string-edge lookarounds avoid that false match.
    out = out.replace(/(^|\s)y(?=\s|$)/g, "$1i").replace(/(^|\s)Y(?=\s|$)/g, "$1I");
    // Hyphenated foreign proper nouns (people/place names, Bible book names) transliterated into
    // Vietnamese syllable-by-syllable -- "Giê-hô-va", "Giê-su", "Lê-vi", "Ki-tô" and the like --
    // read unnaturally with a hard pause on every hyphen. Vietnamese TTS reads these smoothly
    // once the hyphens are gone, same as if the syllables were simply space-separated; a hyphen
    // that already has spacing around it (a real dash, not a name-joiner) is left alone.
    out = out.replace(/([^\s-])-(?=[^\s-])/g, "$1 ");
    out = out.replace(/(\d+)\s*:\s*(\d+(?:[\s,、–~-]+\d+)*)/g, "chương $1 câu $2");
    // In Vietnamese, "donate" (as in donate.jw.org) is an English borrowing. Vietnamese TTS
    // voices default to reading "donate" with Vietnamese phonetic rules ("đô-na-te"),
    // which sounds completely wrong. Translating "donate" to Vietnamese phonetic "đô nết"
    // forces the English reading across all Vietnamese TTS engines.
    out = out.replace(/\bdonate\.jw\.org\b/gi, "đô nết chấm gi vê kép chấm o rờ gờ");
    out = out.replace(/\bdonate\b/gi, "đô nết");
    // "jw.org"/"JW" have no native Vietnamese pronunciation, so most TTS voices default to
    // reading them the English way ("jay double-u dot o-r-g"). J and W aren't in the
    // Vietnamese alphabet either, so Vietnamese speakers spell them out with the standard
    // borrowed letter names (j -> "gi", w -> "vê kép"), giving "gi vê kép chấm o rờ gờ" and
    // "gi vê kép" -- read one letter at a time, the way a Vietnamese speaker actually says it.
    // "r" is read as the bare letter sound "rờ" (without the "e-" prefix used on the 문자 탭's
    // own alphabet reference table) since that's the more natural, commonly-heard way of
    // reading it aloud in a spelled-out word like this. Only the spoken utterance changes
    // here; the text shown on screen (jw.org / JW) is untouched.
    out = out.replace(/jw\.org/gi, "gi vê kép chấm o rờ gờ");
    out = out.replace(/\bJW\b/gi, "gi vê kép");
    return out;
  }

  var speakRetryTimer = null;
  // Gap between repetitions of the same phrase, when viRepeatCount > 1 (see below) -- long
  // enough to sound like a deliberate re-read rather than a stutter, short enough not to feel
  // like a stall.
  var VI_REPEAT_GAP_MS = 450;
  // Speaks opts.text (opts.lang/opts.rate/opts.voice optional) and calls onDone exactly once,
  // whether speech finishes normally, errors, or isn't available at all. Shared by every speech
  // call in the app -- individual speak-btns (via speakOnce below) AND 전체 듣기's chained
  // Vietnamese/meaning steps (playReadAllVi/playReadAllMeaning) -- because the workaround below
  // isn't just a Chrome desktop quirk: iOS/iPadOS/Android/macOS WebKit has the same "silently
  // swallows the next speak() call" failure mode, and it's *worse* for a chained sequence, since
  // each step's speak() call happens from inside the previous utterance's onend handler rather
  // than a fresh user gesture. Before this was unified, 전체 듣기 called synth.speak() directly
  // with none of this protection, so on those platforms the very first entry played fine (a
  // clean synth state) and every entry after it was dropped silently -- 전체 듣기 looked like it
  // read one sentence and then went permanently silent, while individual speak-btns (already
  // routed through this same defense) kept working. Resetting paused/speaking state before each
  // call, and deferring the actual speak() by a tick after cancel(), works around the known race
  // where speak() issued synchronously right after cancel() is dropped; the follow-up check
  // retries once if the engine never actually started.
  window.__activeUtterances = window.__activeUtterances || [];
  function robustSpeak(opts, onDone) {
    try {
      if (!("speechSynthesis" in window) || !opts || !opts.text) { if (onDone) onDone(); return; }
      var synth = window.speechSynthesis;
      if (speakRetryTimer) { clearTimeout(speakRetryTimer); speakRetryTimer = null; }
      var doneCalled = false;
      var watchdogTimer = null;
      var currentU = null;

      function callDone() {
        if (doneCalled) return;
        doneCalled = true;
        if (watchdogTimer) { clearTimeout(watchdogTimer); watchdogTimer = null; }
        if (currentU) {
          var idx = window.__activeUtterances.indexOf(currentU);
          if (idx !== -1) window.__activeUtterances.splice(idx, 1);
          currentU = null;
        }
        if (onDone) onDone();
      }

      var textLen = (opts.text ? String(opts.text).length : 10);
      var estMs = Math.max(3500, textLen * 160);
      watchdogTimer = setTimeout(callDone, estMs);

      try { if (synth.paused) synth.resume(); } catch (e1) { /* no-op */ }
      var hadActiveSpeech = false;
      try {
        if (synth.speaking || synth.pending) {
          hadActiveSpeech = true;
          synth.cancel();
        }
      } catch (eCancel) { /* no-op */ }

      var buildUtterance = function () {
        var u = new SpeechSynthesisUtterance(opts.text);
        if (opts.lang) u.lang = opts.lang;
        if (opts.rate) u.rate = opts.rate;
        if (opts.voice) { u.voice = opts.voice; u.lang = opts.voice.lang; }
        u.onend = callDone;
        u.onerror = callDone;
        window.__activeUtterances.push(u);
        return u;
      };

      var delay = hadActiveSpeech ? 30 : 10;
      speakRetryTimer = setTimeout(function () {
        speakRetryTimer = null;
        try {
          currentU = buildUtterance();
          var started = false;
          currentU.onstart = function () { started = true; };
          synth.speak(currentU);
          setTimeout(function () {
            if (started || synth.speaking || !("speechSynthesis" in window) || doneCalled) return;
            try {
              synth.cancel();
              currentU = buildUtterance();
              synth.speak(currentU);
            } catch (e3) { callDone(); }
          }, 350);
        } catch (e2) { callDone(); /* no-op: speech not available */ }
      }, delay);
    } catch (e) { if (onDone) onDone(); /* no-op: speech not available */ }
  }
  // Speaks text ONE time (Vietnamese, current speak-voice) and calls onOnceDone when that single
  // utterance finishes -- the original body of speak() before 베트남어 반복 듣기 횟수 was added;
  // speak() below wraps this in a repeat loop.
  function speakOnce(text, onOnceDone) {
    robustSpeak({ text: prepareSpeechText(text), lang: "vi-VN", rate: 0.92, voice: currentViVoice() }, onOnceDone);
  }
  // onDone (optional): called once after every repetition finishes, or immediately if speech
  // isn't available at all -- lets callers (복습's auto-advance) chain "speak, then move on"
  // without guessing at a fixed delay. Never called twice. Repeats the phrase viRepeatCount
  // times in a row (설정 > 발음 설정 / 복습's "베트남어 반복 듣기 횟수"), back-to-back with a short
  // pause between reps, before finally calling onDone -- every speak-btn throughout the app goes
  // through this one function, so the setting takes effect everywhere Vietnamese is read aloud
  // (전체 듣기's own Vietnamese step is handled separately by playReadAllNext(), since it chains
  // through a shared token/state object rather than a plain callback).
  function speak(text, onDone, _repsLeft) {
    if (readAllState.id) stopReadAllSequence();
    var repsLeft = (typeof _repsLeft === "number" && _repsLeft > 0) ? _repsLeft : viRepeatCount;
    speakOnce(text, function () {
      if (repsLeft > 1) {
        setTimeout(function () { speak(text, onDone, repsLeft - 1); }, VI_REPEAT_GAP_MS);
      } else if (onDone) onDone();
    });
  }

  // Korean 뜻 text often annotates a Sino-Korean word with its hanja in parentheses right after
  // it, e.g. "결정(決定)하다", "인본(印本), 인쇄본" -- useful to read on screen, but almost every
  // TTS voice either spells the hanja out character-by-character or stays silent/garbled on it,
  // so it reads badly aloud. Strips any "(...)" group made up entirely of hanja (CJK ideographs)
  // before speaking -- only in 한국어 mode, since that's the only language this annotation
  // convention appears in; the parenthesized text shown on screen is untouched.
  function stripHanjaParensForSpeech(text) {
    if (currentLang !== "ko") return text;
    return String(text).replace(/\s*\([\u3400-\u9FFF\uF900-\uFAFF]+\)/g, "");
  }
  // Shared by speakMeaning() and playReadAllMeaning(): the same "/" -> ", " swap
  // prepareSpeechText() applies for Vietnamese (see stripSlashForSpeech() above), so meaning/
  // translation text like "담보/보장하다" is read as a natural pause instead of the word "slash".
  // A scripture citation's "N:M" (chapter:verse) reads badly if a TTS engine speaks the colon
  // literally or mistakes it for a clock time -- e.g. Korean "디모데 후서 3:16" should be heard as
  // "디모데 후서 3장 16절", not "디모데 후서 삼 콜론 십육" or "세 시 십육 분". Meaning text is
  // already resolved to currentLang by T(), so every "N:M" can be rewritten in place using that
  // language's own chapter/verse phrasing.
  // Sino-Korean reading of an integer ("5" -> "오", "119" -> "백십구") -- see
  // expandScriptureVersesForSpeech() below for why this matters for 장/절.
  var SINO_KOREAN_DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  var SINO_KOREAN_UNITS = ["", "십", "백", "천"];
  function sinoKoreanNumber(n) {
    n = Math.floor(Math.abs(Number(n) || 0));
    if (n === 0) return "영";
    var s = String(n);
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var d = Number(s[i]);
      var place = s.length - i - 1;
      if (d === 0) continue;
      out += (place > 0 && d === 1) ? SINO_KOREAN_UNITS[place] : SINO_KOREAN_DIGITS[d] + SINO_KOREAN_UNITS[place];
    }
    return out;
  }
  var SCRIPTURE_VERSE_TEMPLATE = {
    ko: function (ch, vs) {
      var chKo = sinoKoreanNumber(ch);
      var vsKo = vs.replace(/\d+/g, function (d) { return sinoKoreanNumber(d); });
      return chKo + "장 " + vsKo + "절";
    },
    zh: function (ch, vs) { return ch + "章" + vs + "節"; },
    ja: function (ch, vs) { return ch + "章" + vs + "節"; },
    en: function (ch, vs) {
      var isPlural = /[\s,–~-]/.test(vs);
      return "chapter " + ch + ", " + (isPlural ? "verses " : "verse ") + vs;
    }
  };
  function expandScriptureVersesForSpeech(text) {
    var tpl = SCRIPTURE_VERSE_TEMPLATE[currentLang];
    if (tpl && text) {
      text = String(text).replace(/(\d+):(\d+(?:[\s,、–~-]+\d+)*)/g, function (m, ch, vs) { return tpl(ch, vs); });
    }
    if (currentLang === "ko" && text) {
      // A Bible chapter/verse count ("3장", "16절") is always read with Sino-Korean numerals in
      // real usage -- "삼장", never the native-Korean "세장" -- but Korean TTS engines don't
      // reliably know that on their own and can default to native-Korean counting instead (the
      // way they would for an object counter like 개/마리/명). Spelling the digits out as Hangul
      // forces the correct reading, both for the "N장 M절" built just above and any bare
      // "책이름 N장" mention already written that way in the source text.
      text = String(text).replace(/(\d+)(장|절)/g, function (m, num, unit) { return sinoKoreanNumber(num) + unit; });
    }
    return text;
  }
  function prepareMeaningSpeechText(text) {
    if (!text) return text;
    var t = expandScriptureVersesForSpeech(stripHanjaParensForSpeech(stripSlashForSpeech(String(text).trim())));
    if (currentLang === "ko") {
      // Age/generation counters ("10대", "20대" etc.) are read Sino-Korean ("십대", "이십대"),
      // not native-Korean ("열 대").
      t = t.replace(/(\d+)대/g, function (m, n) { return sinoKoreanNumber(n) + "대"; });
    }
    return t;
  }
  // Reads text (a meaning/translation, already resolved to the current UI language) in that
  // language's own voice/voiceURI (selectedLangVoiceURI, same picker 전체 듣기 uses) -- a
  // standalone counterpart to speak()'s Vietnamese reading, used by 복습's auto-advance to read a
  // revealed answer's meaning aloud before moving to the next question.
  function speakMeaning(text, onDone) {
    try {
      if (!text || !("speechSynthesis" in window)) { if (onDone) onDone(); return; }
      if (readAllState.id) stopReadAllSequence();
      var lv = selectedLangVoiceURI[currentLang];
      var voice = lv ? availableLangVoices.filter(function (x) { return voiceMatchKey(x) === lv; })[0] : null;
      var done = false;
      function finish() { if (done) return; done = true; if (onDone) onDone(); }
      // robustSpeak() (not a bare cancel()+speak()) matters here specifically: 복습's category
      // switch can fire two speakMeaning() calls back to back (e.g. the default-landing category
      // and a same-tick restoreLastPlace() replay onto a different saved category -- see
      // selectCategory()'s own comment). A plain cancel() immediately followed by speak() is the
      // same Chrome race speakOnce()/전체 듣기 already had to work around: the two calls can end
      // up both audible instead of the second cleanly replacing the first, which is what made an
      // 어순 배열 prompt sometimes carry on into an unrelated sentence never shown on screen.
      robustSpeak({ text: prepareMeaningSpeechText(text), lang: READALL_LANG_TAG[currentLang] || "en-US", voice: voice }, finish);
      setTimeout(finish, 6000);
    } catch (e) { if (onDone) onDone(); }
  }

  function speakIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>';
  }
  function stopIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>';
  }

  /* ---------------- "전체 듣기" (read-all) sequential playback ---------------- */
  // Lets one button read every Vietnamese phrase of a category in order -- a rhyme family, a
  // tone-pair card, a whole vocab subtab, etc. Each render function that wants this just calls
  // readAllButtonHtml(texts) while building its HTML string; the returned button carries a
  // data-readall id that indexes into READALL_REGISTRY (populated fresh on every render/re-
  // render, so a language switch's full re-render simply replaces the old entries -- stale ids
  // from the previous render are just never clicked again). A single capture-phase document
  // listener (registered once, below) handles every button's click, so no render function has
  // to wire its own listener or worry about stopPropagation against a parent .group-head's own
  // collapse-toggle click handler.
  //
  // Playback itself chains SpeechSynthesisUtterances one at a time via onend/onerror rather
  // than relying on the browser's own utterance queue (speak() elsewhere always cancel()s
  // first, which is unreliable to queue against, and some mobile browsers drop queued
  // utterances silently when backgrounded).
  var READALL_REGISTRY = {};
  window.__READALL_REGISTRY = READALL_REGISTRY;
  var readAllCounter = 0;
  var readAllState = { id: null, texts: [], idx: -1, btn: null, token: 0 };

  // An entry is either a plain Vietnamese string (legacy call sites -- Vietnamese only, no
  // meaning/translation follow-up) or a [viText, meaningText] pair (meaningText already resolved
  // to the current UI language, e.g. via T(it.gloss)) -- normalized here to a single {vi, mean}
  // shape so playReadAllNext() doesn't need to branch on the caller's original format.
  function normalizeReadAllEntry(t) {
    if (t === null || t === undefined) return null;
    var vi, mean;
    if (Array.isArray(t)) { vi = t[0]; mean = t[1]; } else { vi = t; mean = null; }
    vi = vi ? String(vi).trim() : "";
    mean = mean ? String(mean).trim() : "";
    if (!vi) return null;
    return { vi: vi, mean: mean || null };
  }

  function registerReadAll(texts) {
    var clean = (texts || []).map(normalizeReadAllEntry).filter(Boolean);
    var id = "ra" + (readAllCounter++);
    READALL_REGISTRY[id] = clean;
    return id;
  }

  // texts: array of Vietnamese strings, OR [viText, meaningText] pairs, to read in order -- when
  // a pair's meaning is present, 전체 듣기 reads it (in the current UI language's voice) right
  // after the Vietnamese, before moving to the next entry. label: optional TU() key overriding
  // the default "전체 듣기" button text (rarely needed). Returns "" (renders nothing) when
  // there's nothing to read, so callers can splice this straight into their HTML string.
  function readAllButtonHtml(texts, label) {
    var id = registerReadAll(texts);
    if (!READALL_REGISTRY[id].length) return "";
    return '<button type="button" class="read-all-btn" data-readall="' + id + '" data-playing="false" aria-label="' + escapeAttr(TU(label || "전체 듣기")) + '">' +
      '<span class="ra-icon">' + speakIcon() + '</span><span class="ra-label">' + escapeHtml(TU(label || "전체 듣기")) + '</span></button>';
  }

  function setReadAllBtnPlaying(btn, playing) {
    if (!btn) return;
    btn.dataset.playing = playing ? "true" : "false";
    var iconEl = btn.querySelector(".ra-icon");
    var labelEl = btn.querySelector(".ra-label");
    if (iconEl) iconEl.innerHTML = playing ? stopIcon() : speakIcon();
    if (labelEl) labelEl.textContent = playing ? TU("정지") : TU("전체 듣기");
  }

  // iOS/iPadOS Safari has a long-standing WebKit bug where speechSynthesis silently stalls
  // partway through a queue of chained utterances -- 전체 듣기 reads only the first entry, then
  // falls permanently silent with no error event to react to. Nudging pause()+resume() every
  // few seconds while a sequence is playing resets WebKit's internal watchdog and keeps it
  // going; harmless elsewhere (Windows/desktop, which the user confirms isn't affected, simply
  // pause/resume an utterance that was never at risk of stalling). Android Chrome/WebView is the
  // opposite: its pause()/resume() pair is itself unreliable and can leave speechSynthesis
  // permanently paused (resume() silently failing to un-pause), which is indistinguishable from
  // the very stall this nudge exists to prevent -- 전체 듣기 read the first entry's Vietnamese
  // and meaning fine, then went silent forever right around the first 5s nudge. Since Android
  // doesn't have WebKit's stall bug in the first place, the fix is simply to never nudge there.
  var IS_MOBILE_UA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "") ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var readAllKeepAliveTimer = null;
  function startReadAllKeepAlive() {
    stopReadAllKeepAlive();
    if (!("speechSynthesis" in window) || IS_MOBILE_UA) return;
    readAllKeepAliveTimer = setInterval(function () {
      if (!readAllState.id) { stopReadAllKeepAlive(); return; }
      try {
        var synth = window.speechSynthesis;
        if (synth.speaking) { synth.pause(); synth.resume(); }
      } catch (e) { /* no-op */ }
    }, 5000);
  }
  function stopReadAllKeepAlive() {
    if (readAllKeepAliveTimer) { clearInterval(readAllKeepAliveTimer); readAllKeepAliveTimer = null; }
  }
  function stopReadAllSequence() {
    stopReadAllKeepAlive();
    if (readAllState.btn) setReadAllBtnPlaying(readAllState.btn, false);
    readAllState = { id: null, texts: [], idx: -1, btn: null, token: readAllState.token + 1 };
    window.__activeUtterances = [];
    try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
  }

  var READALL_LANG_TAG = { vi: "vi-VN", cs: "cs-CZ", zh_cn: "zh-CN", zh: "zh-TW", en: "en-US", fr: "fr-FR", de: "de-DE", hu: "hu-HU", id: "id-ID", ja: "ja-JP", ko: "ko-KR", pl: "pl-PL" };

  function playReadAllNext(token) {
    if (token !== readAllState.token) return; // a newer sequence (or a stop) superseded this one
    readAllState.idx++;
    if (readAllState.idx >= readAllState.texts.length) { stopReadAllSequence(); return; }
    var entry = readAllState.texts[readAllState.idx];
    playReadAllVi(token, entry, viRepeatCount);
  }

  // Speaks entry.vi, repeating it viRepeatCount times (설정 > 발음 설정 / 복습's "베트남어 반복
  // 듣기 횟수") before moving on to entry.mean -- same repeat count 전체 듣기's Vietnamese step
  // honors as every individual speak-btn's speak() call does, kept as its own chained-token
  // function here (rather than reusing speak()) since 전체 듣기 threads its own token/state
  // object through the whole sequence instead of a plain onDone callback.
  function playReadAllVi(token, entry, repsLeft) {
    if (token !== readAllState.token) return;
    var advance = function () {
      if (token !== readAllState.token) return;
      if (repsLeft > 1) setTimeout(function () { playReadAllVi(token, entry, repsLeft - 1); }, VI_REPEAT_GAP_MS);
      else setTimeout(function () { playReadAllMeaning(token, entry); }, 300);
    };
    robustSpeak({ text: prepareSpeechText(entry.vi), lang: "vi-VN", rate: 0.92, voice: currentViVoice() }, advance);
  }

  // Reads entry.mean (the word's meaning / the sentence's translation, already resolved to the
  // current UI language) in that language's own voice, then advances to the next entry -- or
  // just advances immediately when this entry carries no meaning (legacy plain-string entries).
  function playReadAllMeaning(token, entry) {
    if (token !== readAllState.token) return;
    if (!entry.mean) { playReadAllNext(token); return; }
    var lang = READALL_LANG_TAG[currentLang] || "en-US";
    var voice = null;
    var lv = selectedLangVoiceURI[currentLang];
    if (lv) voice = availableLangVoices.filter(function (x) { return voiceMatchKey(x) === lv; })[0] || null;
    var next = function () {
      if (token === readAllState.token) setTimeout(function () { playReadAllNext(token); }, 300);
    };
    robustSpeak({ text: prepareMeaningSpeechText(entry.mean), lang: lang, voice: voice }, next);
  }

  function startReadAllSequence(id, btn) {
    var texts = READALL_REGISTRY[id] || [];
    if (!texts.length) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        if (!window.__globalAudioCtx) window.__globalAudioCtx = new AC();
        if (window.__globalAudioCtx.state === "suspended") window.__globalAudioCtx.resume();
      }
    } catch (e0) { /* no-op */ }
    try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e1) { /* no-op */ }
    if (speakRetryTimer) { clearTimeout(speakRetryTimer); speakRetryTimer = null; }
    var token = readAllState.token + 1;
    readAllState = { id: id, texts: texts, idx: -1, btn: btn, token: token };
    setReadAllBtnPlaying(btn, true);
    startReadAllKeepAlive();
    playReadAllNext(token);
  }

  // Capture phase: fires before any nearer-ancestor click handler (e.g. a .group-head card's
  // own collapse-toggle listener), so clicking a read-all button placed next to that header
  // never also toggles the card open/closed.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".read-all-btn");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if (readAllState.btn === btn && readAllState.id === btn.dataset.readall) { stopReadAllSequence(); return; }
    startReadAllSequence(btn.dataset.readall, btn);
  }, true);

  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  /* ---------------- sticky tabbar height (feeds --tabbar-h so the subtab row sticks right below it) ---------------- */
  (function () {
    var tabbarEl = document.querySelector(".tabbar");
    if (!tabbarEl) return;
    function syncTabbarHeight() {
      var h = tabbarEl.getBoundingClientRect().height;
      if (h > 0) document.documentElement.style.setProperty("--tabbar-h", h + "px");
    }
    syncTabbarHeight();
    window.addEventListener("resize", syncTabbarHeight);
    window.addEventListener("orientationchange", syncTabbarHeight);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncTabbarHeight).catch(function () { /* no-op */ });
    }
    setTimeout(syncTabbarHeight, 300);
  })();

  /* ---------------- tabs ---------------- */
  var tabButtons = document.querySelectorAll(".tab-btn");
  var appRoot = document.querySelector(".app");
  var panels = { curriculum: document.getElementById("panel-curriculum"), wizard: document.getElementById("panel-wizard"), vocab: document.getElementById("panel-vocab"), sentence: document.getElementById("panel-sentence"), pron: document.getElementById("panel-pron"), bible: document.getElementById("panel-bible"), grammar: document.getElementById("panel-grammar"), review: document.getElementById("panel-review") };
  // Remember each tab's scroll position so switching away and back doesn't lose your place.
  // Direct tab-bar clicks restore the remembered position (or top, on a first visit);
  // programmatic jumps (goToTab / goToReview, used by 바로가기 shortcut buttons) intentionally
  // land at the top instead, since those are meant to show specific new content, not resume
  // a spot the user left on their own.
  var tabScrollPos = {};
  var LAST_PLACE_STORAGE_KEY = "vn-app-last-place-v1";
  var lastPlaceState = {
    tab: "review",
    subtabs: {},
    scrollY: 0
  };

  function saveLastPlace() {
    try {
      if (!window.localStorage) return;
      var activeTab = (appRoot && appRoot.dataset.activeTab) || "review";
      lastPlaceState.tab = activeTab;
      lastPlaceState.scrollY = window.scrollY || 0;
      window.localStorage.setItem(LAST_PLACE_STORAGE_KEY, JSON.stringify(lastPlaceState));
    } catch (e) { /* no-op */ }
  }

  function recordSubtab(group, val) {
    if (!lastPlaceState.subtabs) lastPlaceState.subtabs = {};
    lastPlaceState.subtabs[group] = val;
    saveLastPlace();
  }

  function activateTab(tab, restoreScroll) {
    if (!panels[tab]) return;
    var prevTab = appRoot ? appRoot.dataset.activeTab : null;
    if (prevTab) tabScrollPos[prevTab] = window.scrollY;
    tabButtons.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.tab === tab ? "true" : "false"); });
    Object.keys(panels).forEach(function (k) { if (panels[k]) panels[k].classList.remove("active"); });
    panels[tab].classList.add("active");
    if (appRoot) appRoot.dataset.activeTab = tab;
    // Keep the selected item visible in the horizontally scrolling phone menu.
    var activeButton = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
    if (activeButton && activeButton.parentElement) {
      var menu = activeButton.parentElement;
      var itemRect = activeButton.getBoundingClientRect();
      var menuRect = menu.getBoundingClientRect();
      if (itemRect.left < menuRect.left) menu.scrollLeft += itemRect.left - menuRect.left;
      else if (itemRect.right > menuRect.right) menu.scrollLeft += itemRect.right - menuRect.right;
    }
    var targetTop = (restoreScroll && tabScrollPos.hasOwnProperty(tab)) ? tabScrollPos[tab] : 0;
    window.scrollTo({ top: targetTop, behavior: "instant" in window ? "instant" : "auto" });
    saveLastPlace();
  }
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { activateTab(btn.dataset.tab, true); });
  });

  // Track subtab selections across all groups
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".subtab-btn");
    if (!btn) return;
    ["wizard", "curriculum", "vocab", "sentence", "pron", "bible", "grammar", "review"].forEach(function (group) {
      if (btn.dataset[group]) {
        recordSubtab(group, btn.dataset[group]);
      }
    });
  });

  var lastPlaceScrollTimer = null;
  window.addEventListener("scroll", function () {
    if (lastPlaceScrollTimer) clearTimeout(lastPlaceScrollTimer);
    lastPlaceScrollTimer = setTimeout(saveLastPlace, 400);
  }, { passive: true });
  window.addEventListener("beforeunload", saveLastPlace);

  // Shared selection state for the WIZARD (대화 subtab) -- declared here (ahead of the WIZARD
  // section below, where it used to live) because renderCurrTalks() is invoked once,
  // synchronously, by the subtab-switch IIFE immediately following this comment, before that
  // section's own `var` initializers would otherwise run. 제공 연설 (offer talks) used to have
  // its own separate talksState with its own duplicate set of relationship questions, but that
  // duplicated exactly what's already asked in the 대화 subtab -- so 제공 연설 now just reads
  // this same `state` directly instead (see renderCurrTalks() below), and bindChoiceGroup()
  // further down re-renders the talks pane on every change so it always stays in sync.
  var state = { speaker: null, listener_gender: null, rel: null, region: null, ageBracket: null };

  // Profile data for 나·봉사짝·장로 형제·파이오니아 자매, shared by both 대화 and 제공 연설 --
  // declared here for the same reason as `state` above (renderCurrTalks() reads it
  // synchronously before the rest of the file's `var` initializers run). "me.gender" is its
  // own field (brother/sister) rather than reusing state.speaker, since it
  // must stay meaningful even when neither wizard selector has been touched yet. "married" is
  // stored as the string "0" (미혼) or "1" (기혼) to match the mini-toggle button's data-val.
  var peopleState = {
    me: { gender: null, age: null, phone: "", married: null },
    // region has no UI toggle of its own (봉사짝's honorific doesn't need to distinguish
    // north/south the way the wizard's own listener does) -- defaults to "north" so
    // computeCompanionTerm() below still resolves a term.
    companion: { nameKr: "", nameVi: "", gender: null, age: null, phone: "", married: null, region: "north" },
    elder: { nameKr: "", nameVi: "", age: null, phone: "" },
    pioneer: { nameKr: "", nameVi: "", age: null, phone: "" },
    listener: { nameKr: "", nameVi: "" }
  };

  /* ---------------- 상대방 호칭 및 변형 헬퍼 (LPD / LFF / 이웃 대화 공유) ---------------- */
  function getLpdListenerTerm() {
    var talkCase = typeof findCaseForState === "function" ? findCaseForState(state) : null;
    if (talkCase) return termWord(talkCase.listener_term, talkCase.listener_term_south, state.region);
    if (typeof findCaseForState === "function") {
      var fbSpeaker = state.speaker || (peopleState.me && peopleState.me.gender === "sister" ? "sister" : "brother");
      var fbCase = findCaseForState({
        speaker: fbSpeaker,
        listener_gender: state.listener_gender || "male",
        rel: state.rel || "older_than_parent",
        region: state.region || "north",
        ageBracket: state.ageBracket || "4070"
      });
      if (fbCase) return termWord(fbCase.listener_term, fbCase.listener_term_south, state.region || "north");
    }
    return "ông";
  }

  function lpdRecordLabel(rec) {
    if (rec.kind === "lesson") return "Bài " + (rec.num < 10 ? "0" + rec.num : String(rec.num));
    return "Phụ lục " + rec.num;
  }

  function isLpdInformalListener(term) {
    return /^(?:cháu|con|em|cậu|bạn)$/i.test(term || "");
  }

  function applyLpdListenerTerm(text, term) {
    if (!text) return text;
    var t = term || getLpdListenerTerm();
    var termCap = capitalize(t);
    return text.replace(/([“"'\s]|^)Ông(?=\s+có\s+bao\s+giờ(?:\s|$))/g, "$1" + termCap);
  }

  /* ---------------- 행복한 삶을 영원히 (LFF) 호칭 변형 ("친구" 뜻 제외) ---------------- */
  function applyLffListenerTerms(text) {
    if (!text || typeof text !== "string") return text;
    var term = getLpdListenerTerm();
    if (!term || term.toLowerCase() === "bạn") return text;
    var termCap = capitalize(term);
    var termLow = term.toLowerCase();

    // Note: exclusion checks below use (?![\p{L}]) instead of a trailing \b wherever the
    // guarded word can end in a Vietnamese diacritic vowel (e.g. "bè") -- JS's \b only treats
    // ASCII [A-Za-z0-9_] as "word" characters, so \b silently fails to match right after a
    // letter like "è"/"ì" when followed by whitespace/punctuation (both sides read as non-word,
    // so there's no boundary transition). That previously let "bạn bè" ("friends") slip through
    // and get wrongly replaced as if "bạn" were the 2nd-person pronoun.
    return text.replace(/\b([Bb]ạn)\b/g, function (match, word, offset, fullStr) {
      var before = fullStr.slice(0, offset);
      var after = fullStr.slice(offset + match.length);

      // 1. Followed by friend-related words
      if (/^\s+(?:bè|thân|xấu|thật|thiết|cùng\s+(?:phòng|lớp|lứa)|đời|ngài)(?![\p{L}])/iu.test(after)) return match;
      if (/^\s+tốt(?!\s+đẹp)(?![\p{L}])/iu.test(after)) return match;
      if (/^\s+của\s+(?:ngài|Đức\s+Giê-hô-va|Đức\s+Chúa\s+Trời|Chúa|một\s+người|ai|nhau|ông)(?![\p{L}])/iu.test(after)) return match;
      if (/^\s+và\s+Đấng\s+Tạo\s+Hóa(?![\p{L}])/iu.test(after)) return match;

      // 2. Preceded by friend-related context
      if (/\b(?:(?:những|các|một)\s+)?người\s+$/i.test(before)) return match;
      if (/\btình\s+$/i.test(before)) return match;
      if (/\b(?:kết|chọn|tìm|trở\s+thành)\s+$/i.test(before)) return match;
      if (/\blàm\s+$/i.test(before) && /^\s+(?:với|cùng)(?![\p{L}])/iu.test(after)) return match;
      if (/\bxem\s+(?:chúng\s+ta|họ|mình)\s+là\s+$/i.test(before)) return match;
      if (/\bkhông\s+có\s+$/i.test(before) && (/^\s*[”".!,?]/.test(after) || /^\s+(?:bè|thân|tốt)(?![\p{L}])/iu.test(after))) return match;

      return (word === "Bạn") ? termCap : termLow;
    });
  }

  /* ---------------- [일상 회화] 1·2인칭 대명사: [첫만남] 설정에 맞춰 변형 ----------------
     In each two-person conversation the Korean character (Tuấn, or Mi-na when Tuấn is absent) stands for the learner
     ("나" in [첫만남]) and the other speaker for the conversation partner. DAILY_PRONOUN_ROLES lists, per speaker, the
     pronouns that speaker uses for themselves (self) and for the other person (addr), read from the source dialogue.
     With a [첫만남] case configured: learner self -> self_term, learner addr -> listener_term; partner self ->
     listener_term, partner addr -> self_term. Conversations with fixed social roles (shop, restaurant, teacher, doctor)
     or three speakers are not listed and stay as written. Nouns such as "em gái", "anh ấy", "các bạn" are never touched. */
  var DAILY_PRONOUN_ROLES = {
    "daily-01": { learner: "Tuấn", speakers: { "Tuấn": { self: ["anh"], addr: ["em"] }, "Minh": { self: ["em"], addr: ["anh"] } } },
    "daily-02": { learner: "Tuấn", speakers: { "Tuấn": { self: ["tôi"], addr: ["chị"] }, "Trang": { self: ["em"], addr: ["anh"] } } },
    "daily-04": { learner: "Tuấn", speakers: { "Tuấn": { self: ["anh"], addr: ["em"] }, "Trang": { self: ["em"], addr: ["anh"] } } },
    "daily-05": { learner: "Tuấn", speakers: { "Tuấn": { self: ["anh"], addr: ["em"] }, "Trang": { self: ["em"], addr: ["anh"] } } },
    "daily-06": { learner: "Mi-na", speakers: { "Mi-na": { self: [], addr: ["em"] }, "Minh": { self: ["em"], addr: [] } } },
    "daily-07": { learner: "Mi-na", speakers: { "Mi-na": { self: [], addr: [] }, "Thuý": { self: ["em"], addr: ["chị"] } } },
    "daily-10": { learner: "Mi-na", speakers: { "Mi-na": { self: ["chị"], addr: ["em"] }, "Trang": { self: ["em"], addr: ["chị"] } } },
    "daily-12": { learner: "Tuấn", speakers: { "Tuấn": { self: [], addr: ["chị"] }, "Lan": { self: ["chị"], addr: [] } } },
    "daily-13": { learner: "Tuấn", speakers: { "Tuấn": { self: ["em"], addr: ["chị"] }, "Lan": { self: [], addr: ["em"] } } },
    "daily-14": { learner: "Tuấn", speakers: { "Tuấn": { self: [], addr: ["em"] }, "Minh": { self: ["em"], addr: [] } } },
    "daily-15": { learner: "Tuấn", speakers: { "Tuấn": { self: ["anh"], addr: ["em"] }, "Minh": { self: ["em"], addr: ["anh"] } } },
    "daily-17": { learner: "Mi-na", speakers: { "Mi-na": { self: ["chị"], addr: [] }, "Trang": { self: [], addr: ["chị"] } } },
    "daily-18": { learner: "Tuấn", speakers: { "Tuấn": { self: ["anh"], addr: ["em"] }, "Trang": { self: ["em"], addr: ["anh"] } } },
    "daily-19": { learner: "Mi-na", speakers: { "Mi-na": { self: ["chị"], addr: [] }, "Trang": { self: [], addr: [] } } },
    "daily-20": { learner: "Tuấn", speakers: { "Tuấn": { self: ["anh"], addr: ["em"] }, "Trang": { self: [], addr: ["anh"] } } }
  };
  // The [첫만남] relationship as {self, addr} words, or null while it is not configured (text then stays as written).
  function firstMeetingPronouns() {
    var c = typeof findCaseForState === "function" ? findCaseForState(state) : null;
    if (!c) return null;
    return {
      self: termWord(c.self_term, c.self_term_south, state.region),
      addr: termWord(c.listener_term, c.listener_term_south, state.region)
    };
  }
  // target: [lowercaseReplacement, capitalizedReplacement]
  function replacePronounWords(text, words, target) {
    if (!text || !words || !words.length || !target) return text;
    var re = new RegExp("(?<![\\p{L}])(" + words.join("|") + ")(?![\\p{L}])", "giu");
    return text.replace(re, function (m, w, offset, full) {
      var before = full.slice(0, offset), after = full.slice(offset + m.length);
      // not a personal pronoun here: "em gái", "anh ấy", "con trai", "chị em", plural "các/những/chúng ..."
      if (/^\s+(?:ấy|gái|trai|họ|ruột|em|chị)(?![\p{L}])/iu.test(after)) return m;
      if (/(?:các|những|chúng|hai|mấy)\s+$/iu.test(before)) return m;
      return m[0] !== m[0].toLowerCase() ? target[1] : target[0];
    });
  }
  // Two-step swap through placeholders so "anh"->"em" and "em"->"anh" in the same sentence do not collide.
  function applyDailyPronouns(conv, turn) {
    var roles = conv && DAILY_PRONOUN_ROLES[conv.id];
    var terms = roles ? firstMeetingPronouns() : null;
    if (!terms || !turn || !turn.vi) return turn ? turn.vi : "";
    var who = turn.who && turn.who.vi;
    var mine = roles.speakers[who];
    if (!mine) return turn.vi;
    var isLearner = who === roles.learner;
    var selfTarget = isLearner ? terms.self : terms.addr;
    var addrTarget = isLearner ? terms.addr : terms.self;
    var out = replacePronounWords(turn.vi, mine.self, ["\u0001", "\u0003"]);
    out = replacePronounWords(out, mine.addr, ["\u0002", "\u0004"]);
    return out.replace(/\u0001/g, selfTarget.toLowerCase()).replace(/\u0003/g, capitalize(selfTarget))
      .replace(/\u0002/g, addrTarget.toLowerCase()).replace(/\u0004/g, capitalize(addrTarget));
  }

  /* ---------------- 이웃 사람과의 대화 호칭 및 이름 변형 ---------------- */
  var KNOWN_NEIGHBOR_NAMES_RE = "(?:Trung|Sương|Giang|Dũng|Dương|An|Vy|Tín)";

  function applyNeighborTermsVi(text) {
    if (!text || typeof text !== "string") return text;
    var term = getLpdListenerTerm();
    var termCap = capitalize(term);
    var termLow = term.toLowerCase();
    var customNameVi = (peopleState.listener && peopleState.listener.nameVi) ? peopleState.listener.nameVi.trim() : "";

    var nameRegex = new RegExp("\\b(Anh|Chị|anh|chị)\\s+" + KNOWN_NEIGHBOR_NAMES_RE + "\\b", "g");
    text = text.replace(nameRegex, function (m, pTerm) {
      var isCap = pTerm[0] === pTerm[0].toUpperCase();
      var t = isCap ? termCap : termLow;
      if (customNameVi) return t + " " + customNameVi;
      return m.replace(/^(Anh|Chị|anh|chị)/, t);
    });

    if (customNameVi) {
      text = text.replace(new RegExp("\\b(Tôi\\s+(?:tên|là))\\s+" + KNOWN_NEIGHBOR_NAMES_RE + "\\b", "g"), "$1 " + customNameVi);
    }

    // (?<![\p{L}])/(?![\p{L}]) instead of \b: plain \b never matches right after "Chị"/"chị"
    // (JS's \b only treats ASCII letters as "word" characters, so the accented "ị" reads as
    // non-word on both sides of a following space/comma/period, i.e. no boundary) -- this left
    // "Chị"/"chị" permanently unable to be swapped for the chosen listener term.
    text = text.replace(/(?<![\p{L}])(Anh|Chị|anh|chị)(?![\p{L}])/gu, function (m, pTerm, offset, fullStr) {
      var after = fullStr.slice(offset + m.length);
      if (/^\s+ấy\b/.test(after)) return m;
      var isCap = pTerm[0] === pTerm[0].toUpperCase();
      return isCap ? termCap : termLow;
    });

    return text;
  }

  function applyNeighborTermsMeaning(meaning, lang) {
    if (!meaning || typeof meaning !== "string") return meaning;
    var checkLang = lang || currentLang;
    if (checkLang === "ko") {
      var customNameKr = (peopleState.listener && peopleState.listener.nameKr) ? peopleState.listener.nameKr.trim() : "";
      if (customNameKr) {
        meaning = meaning.replace(/(?:최영철|성식|지연|민혜림|기철|정숙)\s*씨/g, customNameKr + " 씨");
        meaning = meaning.replace(/저는\s+민혜림이에요/g, "저는 " + customNameKr + "이에요");
        meaning = meaning.replace(/이정숙이라고\s+해요/g, customNameKr + "(이)라고 해요");
      }
    }
    return meaning;
  }

  var LPD_KO_INFORMAL_MAP = {
    "지금 일어나고 있는 일들과 사람들이 나타내는 태도를 보면 이 세상에 곧 변화가 있을 것임을 알 수 있습니다.": "지금 일어나고 있는 일들과 사람들이 나타내는 태도를 보면 이 세상에 곧 변화가 있을 것임을 알 수 있어.",
    "지구는 결코 멸망되지 않을 것입니다.": "지구는 결코 멸망되지 않을 거야.",
    "환경 문제가 해결되고 땅이 낙원이 될 것입니다.": "환경 문제가 해결되고 땅이 낙원이 될 거야.",
    "모든 사람이 아프지 않고 건강해질 것입니다.": "모든 사람이 아프지 않고 건강해질 거야.",
    "죽지 않고 땅에서 영원히 살게 될 것입니다.": "죽지 않고 땅에서 영원히 살게 될 거야.",
    "남편은 “자신을 사랑하듯이 아내를 사랑”해야 합니다.": "남편은 “자신을 사랑하듯이 아내를 사랑”해야 해.",
    "아내는 남편을 깊이 존경해야 합니다.": "아내는 남편을 깊이 존경해야 해.",
    "남편과 아내는 서로에게 충실해야 합니다.": "남편과 아내는 서로에게 충실해야 해.",
    "부모를 존경하고 부모의 말에 순종하는 자녀는 행복하고 성공적인 삶을 살게 됩니다.": "부모를 존경하고 부모의 말에 순종하는 자녀는 행복하고 성공적인 삶을 살게 돼.",
    "하느님에게는 이름이 있습니다.": "하느님에게는 이름이 있어.",
    "하느님은 우리에게 중요한 소식을 알려 주셨습니다.": "하느님은 우리에게 중요한 소식을 알려 주셨어.",
    "하느님은 공정하시고 편견이 없으십니다.": "하느님은 공정하시고 편견이 없으셔.",
    "하느님은 우리를 돕고 싶어 하십니다.": "하느님은 우리를 돕고 싶어 하셔.",
    "하느님은 우리가 그분에게 기도하기를 바라십니다.": "하느님은 우리가 그분에게 기도하기를 바라셔.",
    "성경은 기도하는 방법을 알려 줍니다.": "성경은 기도하는 방법을 알려 줘.",
    "우리는 자주 기도해야 합니다.": "우리는 자주 기도해야 해.",
    "예수는 훌륭한 선생님이셨으며 그분의 가르침은 오늘날 우리에게도 도움이 됩니다.": "예수는 훌륭한 선생님이셨으며 그분의 가르침은 오늘날 우리에게도 도움이 돼.",
    "예수는 오늘날 일어나는 일들을 예언했습니다.": "예수는 오늘날 일어나는 일들을 예언했어.",
    "예수는 하느님의 아들입니다.": "예수는 하느님의 아들이야.",
    "예수는 전능한 하느님이 아닙니다.": "예수는 전능한 하느님이 아니야.",
    "하느님의 왕국은 하늘에 있는 실제 정부입니다.": "하느님의 왕국은 하늘에 있는 실제 정부야.",
    "앞으로는 인간 정부가 아니라 하느님의 왕국이 온 땅을 다스릴 것입니다.": "앞으로는 인간 정부가 아니라 하느님의 왕국이 온 땅을 다스릴 거야.",
    "하느님의 왕국만이 인류가 겪고 있는 모든 문제를 해결할 수 있습니다.": "하느님의 왕국만이 인류가 겪고 있는 모든 문제를 해결할 수 있어.",
    "우리가 겪는 고난은 하느님 때문이 아닙니다.": "우리가 겪는 고난은 하느님 때문이 아니야.",
    "이 세상은 사탄이 통치하고 있습니다.": "이 세상은 사탄이 통치하고 있어.",
    "하느님은 우리가 고난을 겪을 때 도와주고 싶어 하십니다.": "하느님은 우리가 고난을 겪을 때 도와주고 싶어 하셔.",
    "하느님이 곧 모든 고난을 없애실 것입니다.": "하느님이 곧 모든 고난을 없애실 거야.",
    "죽은 사람은 의식이 없으며 고통도 느끼지 못합니다.": "죽은 사람은 의식이 없으며 고통도 느끼지 못해.",
    "죽은 사람은 우리에게 도움을 주거나 해를 끼칠 수 없습니다.": "죽은 사람은 우리에게 도움을 주거나 해를 끼칠 수 없어.",
    "사망한 가족과 친구들이 부활될 것입니다.": "사망한 가족과 친구들이 부활될 거야.",
    "“더 이상 죽음이 없을 것입니다.”": "“더 이상 죽음이 없을 거야.”",
    "모든 종교를 하느님이 좋아하시는 것은 아닙니다.": "모든 종교를 하느님이 좋아하시는 것은 아니야.",
    "하느님은 위선을 싫어하십니다.": "하느님은 위선을 싫어하셔.",
    "진정한 사랑을 보이는 종교가 참종교입니다.": "진정한 사랑을 보이는 종교가 참종교야."
  };
  var LPD_KO_POLITE_MAP = {};
  Object.keys(LPD_KO_INFORMAL_MAP).forEach(function (k) { LPD_KO_POLITE_MAP[LPD_KO_INFORMAL_MAP[k]] = k; });

  var LPD_JA_POLITE_MAP = {
    "今起きていることや世の中の様子を見ると，もうすぐ世界が大きく変わることが分かる。": "今起きていることや世の中の様子を見ると，もうすぐ世界が大きく変わることが分かります。",
    "地球が滅びることはない。": "地球が滅びることはありません。",
    "環境問題はなくなる。": "環境問題はなくなります。",
    "全ての人が健康になる。": "全ての人が健康になります。",
    "地球でいつまでも幸せに暮らせる。": "地球でいつまでも幸せに暮らせます。",
    "夫が「自分を愛するように妻を愛」することは大切。": "夫が「自分を愛するように妻を愛」することは大切です。",
    "妻が夫に心から敬意を払うことは大切。": "妻が夫に心から敬意を払うことは大切です。",
    "結婚の絆を大切にする夫婦はうまくいく。": "結婚の絆を大切にする夫婦はうまくいきます。",
    "親を敬って言うことを聞く子供は幸せになれる。": "親を敬って言うことを聞く子供は幸せになれます。",
    "神には名前がある。": "神에는名前があります。",
    "神は人間に自分の考えを伝えている。": "神は人間に自分の考えを伝えています。",
    "神は誰に対しても公平。": "神は誰に対しても公平です。",
    "神は私たちのことを助けたいと思っている。": "神は私たちのことを助けたいと思っています。",
    "神は私たちの祈りを聞きたいと思っている。": "神は私たちの祈りを聞きたいと思っています。",
    "聖書を読むと，どう祈ったらいいかが分かる。": "聖書を読むと，どう祈ったらいいかが分かります。",
    "何度も祈ることは大切。": "何度も祈ることは大切です。",
    "イエスのアドバイスは今でも役に立つ。": "イエスのアドバイスは今でも役に立ちます。",
    "イエスが予告した通りのことが今起きている。": "イエスが予告した通りのことが今起きています。",
    "イエスは神の子。": "イエスは神の子です。",
    "イエスは神ではない。": "イエスは神ではありません。",
    "神は地球を治めるために王国をつくった。天に政府がある。": "神は地球を治めるために王国をつくりました。天に政府があります。",
    "人間の政府はなくなり，神の王国の政府が世界中を治めるようになる。": "人間の政府はなくなり，神の王国の政府が世界中を治めるようになります。",
    "世の中のいろいろな問題を全て解決できるのは，神の王国だけ。": "世の中のいろいろな問題を全て解決できるのは，神の王国だけです。",
    "神が私たちを苦しめることはない。": "神が私たちを苦しめることはありません。",
    "サタンが世界を支配している。": "サタンが世界を支配しています。",
    "私たちが苦しいとき，神は助けたいと思っている。": "私たちが苦しいとき，神は助けたいと思っています。",
    "神は間もなく全ての苦しみをなくす。": "神は間もなく全ての苦しみをなくします。",
    "死んだ人は何も考えたり感じたりしない。苦しむこともない。": "死んだ人は何も考えたり感じたりしません。苦しむこともありません。",
    "死んだ人は私たちを助けることはできず，何か悪さをすることもない。": "死んだ人は私たちを助けることはできず，何か悪さをすることもありません。",
    "亡くなった人は生き返る。": "亡くなった人は生き返ります。",
    "「死はなくな[る]」。": "「死はなくなります」。",
    "全ての宗教が神から見て良いものというわけではない。": "全ての宗教が神から見て良いものというわけではありません。",
    "宗教の名の下に行われる偽善は神に許されない。": "宗教の名の下に行われる偽善は神に許されません。",
    "正しい宗教は，皆が愛を表しているかどうかで見分けられる。": "正しい宗教は，皆が愛を表しているかどうかで見分けられます。"
  };
  var LPD_JA_INFORMAL_MAP = {};
  Object.keys(LPD_JA_POLITE_MAP).forEach(function (k) { LPD_JA_INFORMAL_MAP[LPD_JA_POLITE_MAP[k]] = k; });

  function applyLpdTerms(line) {
    if (!line) return { vi: "", kr: "" };
    var term = getLpdListenerTerm();
    var isInformal = isLpdInformalListener(term);
    var vi = line.vi;
    var isQuestion = vi && vi.indexOf("có bao giờ") >= 0;
    if (isQuestion) {
      vi = applyLpdListenerTerm(vi, term);
    }
    var meaning = T(line);
    var koInformal = (typeof LPD_KO_INFORMAL_MAP !== "undefined" && LPD_KO_INFORMAL_MAP) || {};
    var koPolite = (typeof LPD_KO_POLITE_MAP !== "undefined" && LPD_KO_POLITE_MAP) || {};
    var jaInformal = (typeof LPD_JA_INFORMAL_MAP !== "undefined" && LPD_JA_INFORMAL_MAP) || {};
    var jaPolite = (typeof LPD_JA_POLITE_MAP !== "undefined" && LPD_JA_POLITE_MAP) || {};

    if (currentLang === "ko") {
      if (isQuestion) {
        if (isInformal) {
          meaning = meaning.replace(/들어 보신 적 있나요\?$/, "들어 본 적 있니?");
        } else {
          meaning = meaning.replace(/들어 본 적 있니\?$/, "들어 보신 적 있나요?");
        }
      } else {
        if (isInformal) {
          meaning = koInformal[meaning] || meaning;
        } else {
          meaning = koPolite[meaning] || meaning;
        }
      }
    } else if (currentLang === "ja") {
      if (isQuestion) {
        if (isInformal) {
          meaning = meaning.replace(/^「こんなことをお聞きになったことがありますか(?:\?|？)?」/, "こんなこと聞いたことある。");
          Object.keys(jaInformal).forEach(function (politeSt) {
            if (meaning.indexOf(politeSt) >= 0) {
              meaning = meaning.replace(politeSt, jaInformal[politeSt]);
            }
          });
        } else {
          meaning = meaning.replace(/^こんなこと聞いたことある[。.]?/, "「こんなことをお聞きになったことがありますか?」");
          Object.keys(jaPolite).forEach(function (casualSt) {
            if (meaning.indexOf(casualSt) >= 0) {
              meaning = meaning.replace(casualSt, jaPolite[casualSt]);
            }
          });
        }
      } else {
        if (isInformal) {
          meaning = jaInformal[meaning] || meaning;
        } else {
          meaning = jaPolite[meaning] || meaning;
        }
      }
    }
    return { vi: vi, kr: meaning };
  }

  /* ---------------- 호칭·대화 subtab (베트남 사람을 만났을 때 / 전체 호칭표 / 제공 연설) ---------------- */
  (function () {
    var panes = {
      main: document.getElementById("wizard-main-pane"),
      reftable: document.getElementById("wizard-reftable-pane"),
      daily: document.getElementById("wizard-daily-pane"),
      talks: document.getElementById("wizard-talks-pane"),
      neighbor: document.getElementById("wizard-neighbor-pane"),
      culture: document.getElementById("wizard-culture-pane"),
    };
    var btns = document.querySelectorAll(".subtab-btn[data-wizard]");
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");
        Object.keys(panes).forEach(function (k) { if (panes[k]) panes[k].style.display = k === btn.dataset.wizard ? "" : "none"; });
        if (btn.dataset.wizard === "talks") renderCurrTalks();
        if (btn.dataset.wizard === "neighbor") renderCurrNeighbor();
        if (btn.dataset.wizard === "daily") renderCurrDaily();
        if (btn.dataset.wizard === "culture") renderCurrCulture();
      });
    });
    renderCurrTalks();
    renderCurrNeighbor();
    renderCurrDaily();
    renderCurrCulture();
  })();

  /* ---------------- 문장 subtab (행복한 삶을 영원히 / 사람들을 사랑하고 제자로 / 파수대 / 노래 / 기도 / (전체) 원문 뷰어 3종) ---------------- */
  // These source-backed views deliberately do not use t()/meaning fallbacks for
  // learning content. A missing translation stays missing in every UI language.
  function renderGeneralPdf() {
    if (typeof GENERAL_PDF === "undefined") return;

    function stripControls(str) {
      if (!str) return "";
      return str.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
    }

    // 1. Sentences ([문장] > [일상 생활])
    var sentRoot = document.getElementById("pdf-sentences-root");
    if (sentRoot) {
      sentRoot.replaceChildren();
      var sentRows = GENERAL_PDF.sentences || [];
      var readAllSentences = readAllButtonHtml(sentRows.filter(function (r) { return r.vi; }).map(function (r) {
        return [r.vi, (r.translations && r.translations[currentLang]) || ""];
      }));
      if (readAllSentences) {
        var raBar = document.createElement("div");
        raBar.className = "chain-note";
        raBar.style.cssText = "display:flex;justify-content:flex-end;align-items:center;gap:8px;";
        raBar.innerHTML = readAllSentences;
        sentRoot.appendChild(raBar);
      }
      sentRows.forEach(function (row) {
        var card = document.createElement("article");
        card.className = "curr-card";
        if (row.id) card.dataset.pdfId = row.id;

        var headerRow = document.createElement("div");
        headerRow.style.cssText = "display:flex;align-items:flex-start;justify-content:space-between;gap:8px;";

        var viText = document.createElement("div");
        viText.className = "vn font-bold";
        viText.style.cssText = "font-size:1.05rem;line-height:1.45;color:var(--ink);";
        viText.textContent = row.vi || "";
        headerRow.appendChild(viText);

        if (row.vi) {
          var speakBtn = document.createElement("button");
          speakBtn.className = "speak-btn";
          speakBtn.setAttribute("data-speak", row.vi);
          speakBtn.setAttribute("aria-label", TU("발음 듣기"));
          speakBtn.innerHTML = speakIcon();
          speakBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            speakText(row.vi, "vi");
          });
          headerRow.appendChild(speakBtn);
        }
        card.appendChild(headerRow);

        var translated = row.translations && row.translations[currentLang];
        if (translated) {
          var transDiv = document.createElement("div");
          transDiv.className = "card-translation";
          transDiv.style.cssText = "color:var(--ink-soft);font-size:0.9rem;margin-top:6px;line-height:1.4;";
          transDiv.textContent = translated;
          transDiv.lang = currentLang;
          card.appendChild(transDiv);
        }
        sentRoot.appendChild(card);
      });
    }

    // 2. Grammar ([문법] > [일반 문법])
    var gramRoot = document.getElementById("pdf-grammar-root");
    if (gramRoot) {
      gramRoot.replaceChildren();
      var gramRows = GENERAL_PDF.grammar || [];

      function cleanPdfLines(raw) {
        if (!raw) return [];
        var text = stripControls(raw);
        var rawLines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
        while (rawLines.length && !rawLines[0].trim()) rawLines.shift();
        while (rawLines.length && !rawLines[rawLines.length - 1].trim()) rawLines.pop();

        var cleaned = [];
        rawLines.forEach(function (line) {
          var s = line.trim();
          if (!s) return;
          if (/^문법·표현\s*\d+/.test(s)) return;
          if (/^핵심\s*표현\s*\d+.*?\d+\s*-\s*\d+/.test(s)) return;
          if (/^말하기\s*\d+.*?\d+\s*-\s*\d+/.test(s)) return;
          if (/^\d{2}\s*-\s*\d{2}$/.test(s)) return;
          if (/Bài\s+\d+.*?\d+$/.test(s) || /\|\s*\d+\s*\|\s*·/.test(s)) return;
          if (/베트남어\s+(?:읽기|가르치기와\s*배우기).*?·\s*\d+$/.test(s)) return;
          if (/^\d{1,3}$/.test(s)) return;
          if (/\|\s*\d{1,3}\s*$/.test(s)) return;

          var norm = line.replace(/[ \t]{4,}/g, "   ").trimEnd();
          cleaned.push(norm);
        });
        while (cleaned.length && !cleaned[cleaned.length - 1].trim()) cleaned.pop();
        return cleaned;
      }

      function parseSubsections(lines) {
        var sections = [];
        var cur = { title: null, lines: [] };
        var subheadRe = /^\s*(\d+)[\.\s]+([가-힣A-Za-z].*)$/;

        lines.forEach(function (l) {
          var s = l.trim();
          var m = subheadRe.exec(s);
          if (m && s.length < 60 && !/^[A-Z]\s+/.test(s) && !s.startsWith("19") && !s.startsWith("20")) {
            if (cur.title || cur.lines.some(function (x) { return x.trim(); })) {
              sections.push(cur);
            }
            cur = { title: m[1] + ". " + m[2].trim(), lines: [] };
          } else {
            cur.lines.push(l);
          }
        });
        if (cur.title || cur.lines.some(function (x) { return x.trim(); })) {
          sections.push(cur);
        }
        return sections;
      }

      // Vietnamese sentences inside a mixed Vietnamese/Korean source line. Pieces are Hangul-free text split at column
      // gaps (3+ spaces) and list/speaker markers (❶ Ⓐ ① • |); a piece counts when it has at least two Latin words and
      // either a Vietnamese diacritic or three or more words. A word glued to a Korean particle ("Chào는") is dropped,
      // leading markers are not read aloud, and pattern notation (+ ~ = _) is skipped.
      var VI_WORD_RE = /[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]+/g;
      var VI_DIACRITIC_RE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
      function viRunsOf(line) {
        var runs = [];
        var re = /(?:(?!\s{3})[^\uAC00-\uD7A3\u3130-\u318F\u1100-\u11FF❶-❿①-⑳Ⓐ-Ⓩⓐ-ⓩ•|])+/g, m;
        while ((m = re.exec(line))) {
          var seg = m[0], segStart = m.index, segEnd = segStart + seg.length;
          if (segEnd < line.length && /[\uAC00-\uD7A3]/.test(line[segEnd]) && /\S$/.test(seg)) {
            seg = seg.slice(0, seg.search(/\S+$/));
          }
          var lead = seg.match(/^[\s\-–·*>⇒→()\[\]0-9.:,;'"‘’“”~!?]*(?:[A-Z](?=\s{2,}|\s*[:.)]\s))?[\s:.)]*/);
          var o = lead ? lead[0].length : 0;
          var text = seg.slice(o).replace(/[\s\/(\[,;:~‘“]+$/, "");
          var words = text.match(VI_WORD_RE) || [];
          if (/[+~=_]/.test(text) || words.length < 2 || !(VI_DIACRITIC_RE.test(text) || words.length >= 3)) continue;
          runs.push({ start: segStart + o, end: segStart + o + text.length, text: text });
        }
        return runs;
      }
      function speakButton(text) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "speak-btn pdf-inline-speak";
        b.setAttribute("aria-label", TU("발음 듣기"));
        b.innerHTML = speakIcon();
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          speak(text);
        });
        return b;
      }
      function viTextsOf(lines) {
        var out = [];
        lines.forEach(function (line) {
          if (line.trim().startsWith("단어")) return;
          viRunsOf(line).forEach(function (r) { out.push(r.text); });
        });
        return out;
      }

      function renderLinesTo(container, lines) {
        lines.forEach(function (line) {
          var s = line.trim();
          if (!s) return;
          if (s.startsWith("단어") && s.length > 2) {
            var vBox = document.createElement("div");
            vBox.className = "pdf-vocab-box";
            var vBadge = document.createElement("span");
            vBadge.className = "pdf-vocab-badge";
            vBadge.textContent = TU("단어");
            vBox.appendChild(vBadge);
            var vText = document.createElement("span");
            vText.className = "pdf-vocab-text";
            vText.textContent = s.substring(2).trim();
            vBox.appendChild(vText);
            container.appendChild(vBox);
          } else {
            var lineDiv = document.createElement("div");
            lineDiv.style.cssText = "margin-bottom:4px;white-space:pre-wrap;word-break:break-word;";
            var pos = 0;
            viRunsOf(line).forEach(function (r) {
              lineDiv.appendChild(document.createTextNode(line.slice(pos, r.end)));
              lineDiv.appendChild(speakButton(r.text));
              pos = r.end;
            });
            lineDiv.appendChild(document.createTextNode(line.slice(pos)));
            container.appendChild(lineDiv);
          }
        });
      }

      gramRows.forEach(function (row) {
        var cleanedLines = cleanPdfLines(row.original);
        if (!cleanedLines.length) return;
        var sections = parseSubsections(cleanedLines);

        sections.forEach(function (sec) {
          if (sec.title) {
            var details = document.createElement("details");
            details.className = "pdf-subheading-group";
            details.open = true;
            if (row.id) details.dataset.pdfId = row.id;

            var summary = document.createElement("summary");
            summary.className = "pdf-subheading-summary";
            var titleSpan = document.createElement("span");
            titleSpan.textContent = sec.title;
            var chevSpan = document.createElement("span");
            chevSpan.className = "chev";
            chevSpan.textContent = "▾";
            summary.appendChild(titleSpan);
            var readAll = readAllButtonHtml(viTextsOf(sec.lines));
            if (readAll) {
              var raWrap = document.createElement("span");
              raWrap.className = "pdf-readall";
              raWrap.innerHTML = readAll;
              summary.appendChild(raWrap);
            }
            summary.appendChild(chevSpan);
            details.appendChild(summary);

            var body = document.createElement("div");
            body.className = "pdf-subheading-body";
            renderLinesTo(body, sec.lines);
            details.appendChild(body);

            gramRoot.appendChild(details);
          } else {
            var card = document.createElement("article");
            card.className = "curr-card";
            if (row.id) card.dataset.pdfId = row.id;
            renderLinesTo(card, sec.lines);
            gramRoot.appendChild(card);
          }
        });
      });
    }
  }
  renderGeneralPdf();
  onLangChange(renderGeneralPdf);
  (function () {
    var panes = {
      pdf: document.getElementById("sentence-pdf-pane"),
      lff: document.getElementById("sentence-lff-pane"),
      lpd: document.getElementById("sentence-lpd-pane"),
      wt: document.getElementById("sentence-wt-pane"),
      song: document.getElementById("sentence-song-pane"),
      prayer: document.getElementById("sentence-prayer-pane"),
      lff2: document.getElementById("sentence-lff2-pane"),
      lpd2: document.getElementById("sentence-lpd2-pane"),
      wt2: document.getElementById("sentence-wt2-pane"),
    };
    var btns = document.querySelectorAll(".subtab-btn[data-sentence]");
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");
        Object.keys(panes).forEach(function (k) { if (panes[k]) panes[k].style.display = k === btn.dataset.sentence ? "" : "none"; });
        vocabFocus = null;
        if (btn.dataset.sentence === "pdf") renderGeneralPdf();
        if (btn.dataset.sentence === "lpd") renderCurrLpd();
        if (btn.dataset.sentence === "wt") renderCurrWt();
        if (btn.dataset.sentence === "lff") renderCurrLff();
        if (btn.dataset.sentence === "song") renderCurrSongs();
        if (btn.dataset.sentence === "prayer") renderCurrPrayer();
        // initLff2/initLpd2/initWt2 are defined further down the file (their state is set up via
        // `var` initializers that haven't run yet this early in the script), so they're only ever
        // invoked lazily here on click -- never eagerly alongside the other renderCurr* calls
        // below, which read plain top-level `const`s already available from data_block.js.
        if (btn.dataset.sentence === "lff2") initLff2();
        if (btn.dataset.sentence === "lpd2") initLpd2();
        if (btn.dataset.sentence === "wt2") initWt2();
      });
    });
    renderCurrLff();
    renderCurrLpd();
    renderCurrWt();
    renderCurrSongs();
    renderCurrPrayer();
    if (btns.length === 1) {
      // Only one subtab left (GENERAL): show its content directly under [문장] and drop the lone subtab button.
      btns[0].click();
      var onlyRow = btns[0].closest(".subtab-row");
      if (onlyRow) onlyRow.style.display = "none";
    }
  })();

  /* ================= WIZARD ================= */
  var practiceMode = false;
  var currentStageIdx = 0;

  // Determine (once) which rel values actually have a north/south wording difference,
  // by scanning the built-in case data rather than hard-coding a list.
  var REL_HAS_REGION_DIFF = {};
  CASES.forEach(function (c) {
    if (c.self_term_south || c.listener_term_south) REL_HAS_REGION_DIFF[c.rel] = true;
  });

  function bindChoiceGroup(groupId, key) {
    var group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll(".choice-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll(".choice-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        state[key] = btn.dataset.val;
        if (key === "rel") {
          state.ageBracket = null;
          var abGroup = document.getElementById("q-agebracket");
          if (abGroup) {
            abGroup.querySelectorAll(".choice-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
            abGroup.closest(".qgroup").style.display = (btn.dataset.val === "stranger_polite") ? "" : "none";
          }
        }
        currentStageIdx = 0;
        regionNote();
        renderResult();
        // 제공 연설, LPD, 이웃 대화, LFF reads this same shared `state` --
        // keep it in sync live, not just when its own subtab is opened.
        renderCurrTalks();
        renderCurrLpd();
        renderCurrNeighbor();
        renderCurrLff();
        savePeopleState();
      });
    });
  }
  bindChoiceGroup("q-gender", "listener_gender");
  bindChoiceGroup("q-rel", "rel");
  bindChoiceGroup("q-agebracket", "ageBracket");
  bindChoiceGroup("q-region", "region");

  var nameKrInput = document.getElementById("input-name-kr");
  var nameViInput = document.getElementById("input-name-vi");
  if (nameKrInput) {
    nameKrInput.addEventListener("input", function () {
      userNameByLang[currentLang] = nameKrInput.value.trim();
      if (currentCase) renderStageBody(currentCase);
      renderCurrTalks();
      savePeopleState();
    });
    // The field holds a separate name per UI language (동주/志明/John-style placeholder swap
    // only makes sense within one language), so switching languages must repopulate it from
    // that language's own stored value rather than leaving the previous language's text showing.
    onLangChange(function (lang) {
      nameKrInput.value = userNameByLang[lang] || "";
      if (currentCase) renderStageBody(currentCase);
      renderCurrTalks();
      renderCurrNeighbor();
    });
  }
  if (nameViInput) {
    nameViInput.addEventListener("input", function () {
      userNameVi = nameViInput.value.trim();
      if (currentCase) renderStageBody(currentCase);
      renderCurrTalks();
      savePeopleState();
    });
  }

  /* -------- 참여자 정보 (나·봉사짝·장로 형제·파이오니아 자매) -------- */
  function onPeopleChange() {
    updateCompanionTermNote();
    updateCompanionNoteInPlace();
    renderCurrTalks();
    renderCurrLpd();
    renderCurrNeighbor();
    renderCurrLff();
    savePeopleState();
  }
  function bindMiniToggle(groupId, target, key) {
    var group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll(".mini-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll(".mini-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        target[key] = btn.dataset.val;
        onPeopleChange();
      });
    });
  }
  function bindPeopleField(id, target, key, isNumber) {
    var input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", function () {
      var v = input.value.trim();
      if (isNumber) {
        target[key] = v === "" ? null : parseInt(v, 10);
      } else {
        target[key] = v;
      }
      onPeopleChange();
    });
  }
  function updateCompanionTermNote() {
    var noteEl = document.getElementById("people-comp-term-note");
    if (!noteEl) return;
    var info = computeCompanionTerm();
    if (!info) { noteEl.style.display = "none"; noteEl.textContent = ""; return; }
    var name = peopleState.companion.nameVi || peopleState.companion.nameKr || "";
    noteEl.style.display = "";
    noteEl.textContent = TU("봉사짝 호칭: ") + capitalize(info.term) + (name ? " " + name : "") + " (" + TU(REL_LABEL[info.rel] || "") + ")";
  }

  bindMiniToggle("people-me-gender", peopleState.me, "gender");
  // "나는 어느 쪽인가요?" (formerly the wizard's own Q1) now lives here as the "나" card's
  // gender toggle, so a click here also drives the main wizard's own state.speaker directly.
  (function () {
    var group = document.getElementById("people-me-gender");
    if (!group) return;
    group.querySelectorAll(".mini-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.speaker = btn.dataset.val;
        currentStageIdx = 0;
        regionNote();
        renderResult();
        renderCurrTalks();
        renderCurrLpd();
        renderCurrNeighbor();
        renderCurrLff();
        savePeopleState();
      });
    });
  })();
  bindPeopleField("people-me-age", peopleState.me, "age", true);
  bindPeopleField("people-me-phone", peopleState.me, "phone", false);
  bindMiniToggle("people-me-married", peopleState.me, "married");

  bindPeopleField("people-comp-namekr", peopleState.companion, "nameKr", false);
  bindPeopleField("people-comp-namevi", peopleState.companion, "nameVi", false);
  bindMiniToggle("people-comp-gender", peopleState.companion, "gender");
  bindPeopleField("people-comp-age", peopleState.companion, "age", true);
  bindPeopleField("people-comp-phone", peopleState.companion, "phone", false);
  bindMiniToggle("people-comp-married", peopleState.companion, "married");

  bindPeopleField("people-elder-namekr", peopleState.elder, "nameKr", false);
  bindPeopleField("people-elder-namevi", peopleState.elder, "nameVi", false);
  bindPeopleField("people-elder-age", peopleState.elder, "age", true);
  bindPeopleField("people-elder-phone", peopleState.elder, "phone", false);

  bindPeopleField("people-pioneer-namekr", peopleState.pioneer, "nameKr", false);
  bindPeopleField("people-pioneer-namevi", peopleState.pioneer, "nameVi", false);
  bindPeopleField("people-pioneer-age", peopleState.pioneer, "age", true);
  bindPeopleField("people-pioneer-phone", peopleState.pioneer, "phone", false);

  bindPeopleField("people-listener-namekr", peopleState.listener, "nameKr", false);
  bindPeopleField("people-listener-namevi", peopleState.listener, "nameVi", false);

  updateCompanionTermNote();

  /* -------- 대화 탭 정보 저장 (localStorage) --------
     학습자가 [대화] 탭에서 한 번 입력한 대화 상대 정보(호칭 질문 답, 참여자 정보 카드의
     이름/성별/나이/전화번호/기혼여부, 내 이름 입력란)가 페이지를 새로고침하거나 다시 방문해도
     유지되도록, 값이 바뀔 때마다 저장하고 앱 시작 시 복원한다. 저장/복원 모두 localStorage가
     없는 환경(사생활 보호 모드 등)에서도 조용히 실패하고 앱은 정상 동작해야 한다. */
  var PEOPLE_STORAGE_KEY = "vn-app-people-v1";
  function savePeopleState() {
    try {
      if (!window.localStorage) return;
      window.localStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify({
        state: state,
        peopleState: peopleState,
        userNameByLang: userNameByLang,
        userNameVi: userNameVi
      }));
    } catch (e) { /* no-op: localStorage unavailable */ }
  }
  function loadPeopleState() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(PEOPLE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function setChoiceGroupUI(groupId, val) {
    if (val === null || val === undefined) return;
    var group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll(".choice-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.val === val));
    });
  }
  function setMiniToggleUI(groupId, val) {
    if (val === null || val === undefined) return;
    var group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll(".mini-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.val === val));
    });
  }
  function setFieldValue(id, val) {
    if (val === null || val === undefined) return;
    var el = document.getElementById(id);
    if (el) el.value = val;
  }

  // Set once restorePeopleState() (below) has actually applied saved data, so that the final
  // render-trigger step at the very bottom of this file knows whether to run. The trigger has
  // to be deferred all the way to the end of the script (rather than firing right here) because
  // renderResult() can walk into code -- e.g. chungTaCompound()'s use of SENIOR_JUNIOR_KEYS --
  // that lives in a `var` declared further down the file: at THIS point in execution that var
  // is only hoisted (undefined), not yet assigned, so calling renderResult() this early would
  // throw. Restoring the plain state/DOM values here is safe either way since none of that
  // touches those later-defined vars.
  var hadSavedPeopleState = false;
  (function restorePeopleState() {
    var saved = loadPeopleState();
    if (!saved) return;

    if (saved.state) {
      state.speaker = saved.state.speaker || state.speaker;
      state.listener_gender = saved.state.listener_gender || null;
      state.rel = saved.state.rel || null;
      state.region = saved.state.region || null;
      state.ageBracket = saved.state.ageBracket || null;
    }
    if (saved.peopleState) {
      ["me", "companion", "elder", "pioneer", "listener"].forEach(function (k) {
        if (!saved.peopleState[k]) return;
        Object.keys(saved.peopleState[k]).forEach(function (f) {
          peopleState[k][f] = saved.peopleState[k][f];
        });
      });
    }
    if (saved.userNameByLang) {
      VALID_LANGS.forEach(function (l) {
        if (typeof saved.userNameByLang[l] === "string") userNameByLang[l] = saved.userNameByLang[l];
      });
    }
    if (typeof saved.userNameVi === "string") userNameVi = saved.userNameVi;

    // reflect the restored values back into the DOM controls (buttons/inputs) themselves --
    // the state objects above only drive rendering, the widgets need their own visual update.
    setChoiceGroupUI("q-gender", state.listener_gender);
    setChoiceGroupUI("q-rel", state.rel);
    setChoiceGroupUI("q-region", state.region);
    if (state.rel === "stranger_polite") {
      var abGroupEl = document.getElementById("q-agebracket");
      if (abGroupEl) {
        var qgroupEl = abGroupEl.closest(".qgroup");
        if (qgroupEl) qgroupEl.style.display = "";
        setChoiceGroupUI("q-agebracket", state.ageBracket);
      }
    }
    setMiniToggleUI("people-me-gender", peopleState.me.gender);
    setMiniToggleUI("people-me-married", peopleState.me.married);
    setMiniToggleUI("people-comp-gender", peopleState.companion.gender);
    setMiniToggleUI("people-comp-married", peopleState.companion.married);

    setFieldValue("people-me-age", peopleState.me.age);
    setFieldValue("people-me-phone", peopleState.me.phone);
    setFieldValue("people-comp-namekr", peopleState.companion.nameKr);
    setFieldValue("people-comp-namevi", peopleState.companion.nameVi);
    setFieldValue("people-comp-age", peopleState.companion.age);
    setFieldValue("people-comp-phone", peopleState.companion.phone);
    setFieldValue("people-elder-namekr", peopleState.elder.nameKr);
    setFieldValue("people-elder-namevi", peopleState.elder.nameVi);
    setFieldValue("people-elder-age", peopleState.elder.age);
    setFieldValue("people-elder-phone", peopleState.elder.phone);
    setFieldValue("people-pioneer-namekr", peopleState.pioneer.nameKr);
    setFieldValue("people-pioneer-namevi", peopleState.pioneer.nameVi);
    setFieldValue("people-pioneer-age", peopleState.pioneer.age);
    setFieldValue("people-pioneer-phone", peopleState.pioneer.phone);

    if (peopleState.listener) {
      setFieldValue("people-listener-namekr", peopleState.listener.nameKr);
      setFieldValue("people-listener-namevi", peopleState.listener.nameVi);
    }

    if (nameKrInput) nameKrInput.value = userNameByLang[currentLang] || "";
    if (nameViInput) nameViInput.value = userNameVi || "";

    hadSavedPeopleState = true;
  })();

  function findCaseForState(st) {
    if (!st || !st.speaker || !st.listener_gender || !st.rel) return null;
    if (st.rel === "stranger_polite" && !st.ageBracket) return null;
    for (var i = 0; i < CASES.length; i++) {
      var c = CASES[i];
      if (c.speaker !== st.speaker || c.listener_gender !== st.listener_gender || c.rel !== st.rel) continue;
      if (st.rel === "stranger_polite" && c.age_bracket !== st.ageBracket) continue;
      return c;
    }
    return null;
  }

  function findCase() { return findCaseForState(state); }

  function regionNoteFor(st, elId) {
    var noteEl = document.getElementById(elId);
    if (!noteEl) return;
    if (REL_HAS_REGION_DIFF[st.rel]) {
      noteEl.textContent = TU("이 경우, 호칭이 북부·남부에 따라 달라져요.");
    } else {
      noteEl.textContent = "";
    }
  }

  function regionNote() { regionNoteFor(state, "region-note"); }

  function termWord(term, southTerm, region) {
    if (region === "south" && southTerm) return southTerm;
    return term;
  }

  /* -------- 봉사짝 나이 차이 -> 베트남어 호칭 (anh/chị<->em, chú/cô<->cháu/con, bác<->cháu/con) -------- */
  // Bands per the congregation's guidance: <16 years apart uses the sibling terms, 16-31 uses
  // the chú/cô<->cháu(con) terms, 32+ uses bác<->cháu(con). Reuses the same `rel` vocabulary as
  // the main wizard so the existing CASES lookup table supplies the actual Vietnamese words.
  function deriveCompanionRel(myAge, companionAge) {
    if (myAge == null || companionAge == null || isNaN(myAge) || isNaN(companionAge)) return null;
    var diff = Math.abs(myAge - companionAge);
    var iAmOlder = myAge > companionAge;
    if (diff < 16) return iAmOlder ? "younger_sibling" : "older_sibling";
    if (diff < 32) return iAmOlder ? "elder_uncle_aunt" : "younger_than_parent";
    return iAmOlder ? "elder_parent_age" : "older_than_parent";
  }

  // Representative age for the "상대방" side of a 제공 연설 dialogue, derived from the selected
  // rel/ageBracket and my own age -- used only as a plausible practice number for {{LISTENER_AGE}},
  // not a claim of anyone's real age. Deltas are the midpoints of each rel band above.
  var REL_AGE_DELTA = {
    younger_sibling: -8, older_sibling: 8,
    younger_than_parent: 24, elder_uncle_aunt: -24,
    older_than_parent: 40, elder_parent_age: -40,
    peer: 0
  };
  function representativeAge(rel, ageBracket, myAge) {
    if (myAge == null || isNaN(myAge)) return null;
    if (rel === "stranger_polite") {
      if (ageBracket === "2030") return 28;
      if (ageBracket === "4070") return 55;
      if (ageBracket === "80+") return 85;
      return myAge;
    }
    var delta = REL_AGE_DELTA.hasOwnProperty(rel) ? REL_AGE_DELTA[rel] : 0;
    var age = myAge + delta;
    return age < 15 ? 15 : age;
  }

  // "Chúng ta" (우리) -> a warmer paired term (anh em mình, chú cháu mình, ...) whenever the
  // rel implies a clear senior/junior pairing -- peer and stranger_polite have no such pairing
  // so "Chúng ta" is left as-is for those. Word order is always senior-term-first.
  var SENIOR_JUNIOR_KEYS = {
    younger_sibling: ["self", "listener"],
    older_sibling: ["listener", "self"],
    younger_than_parent: ["listener", "self"],
    elder_uncle_aunt: ["self", "listener"],
    older_than_parent: ["listener", "self"],
    elder_parent_age: ["self", "listener"]
  };
  function chungTaCompound(c, region) {
    var keys = c && SENIOR_JUNIOR_KEYS[c.rel];
    if (!keys) return null;
    function termFor(key) {
      return key === "self" ? termWord(c.self_term, c.self_term_south, region) : termWord(c.listener_term, c.listener_term_south, region);
    }
    return capitalize(termFor(keys[0])) + " " + termFor(keys[1]) + " mình";
  }
  function applyChungTa(text, c, region) {
    if (!text || !c) return text;
    var compound = chungTaCompound(c, region);
    if (!compound) return text;
    var lowerCompound = compound.charAt(0).toLowerCase() + compound.slice(1);
    var out = wordReplace(text, "Chúng ta", compound);
    out = wordReplace(out, "chúng ta", lowerCompound);
    return out;
  }

  // Vietnamese honorific I should use for my 봉사짝, based on our age difference -- reuses the
  // main CASES lookup, treating the companion as the "listener" side of that relationship.
  function computeCompanionTerm() {
    var me = peopleState.me, comp = peopleState.companion;
    if (!me.gender || !comp.gender || !comp.region || me.age == null || comp.age == null || isNaN(me.age) || isNaN(comp.age)) return null;
    var rel = deriveCompanionRel(me.age, comp.age);
    if (!rel) return null;
    var listenerGender = comp.gender === "brother" ? "male" : "female";
    var c = findCaseForState({ speaker: me.gender, listener_gender: listenerGender, rel: rel, region: comp.region });
    if (!c) return null;
    return { term: termWord(c.listener_term, c.listener_term_south, comp.region), rel: rel, c: c };
  }

  // Vietnamese honorific the LISTENER (상대방) should use for my 봉사짝 -- based on the age
  // difference BETWEEN THEM, not between me and my companion. Introducing a third person mid-
  // conversation ("Đây là chị Thu Hằng.", "{{COMPANION}} sẽ liên lạc với...") should use
  // whichever term actually fits how the person being introduced TO would naturally address the
  // person being introduced, so this reuses representativeAge() (already used for
  // {{LISTENER_AGE}}) to turn the wizard's own rel/ageBracket selection into a plausible age for
  // 상대방, then compares that to the companion's own age exactly like deriveCompanionRel() does
  // for the me<->companion pairing above. Falls back to null (caller keeps the original literal
  // "chị"/"anh" wording) whenever there isn't enough information yet -- no listener relation
  // chosen in 대화 탭, or no companion gender/age entered.
  function computeCompanionTermForListener() {
    var me = peopleState.me, comp = peopleState.companion;
    if (!comp.gender || comp.age == null || isNaN(comp.age)) return null;
    if (!state.listener_gender || !state.rel || !state.region) return null;
    if (state.rel === "stranger_polite" && !state.ageBracket) return null;
    var listenerAge = representativeAge(state.rel, state.ageBracket, me.age);
    if (listenerAge == null) return null;
    var rel = deriveCompanionRel(listenerAge, comp.age);
    if (!rel) return null;
    var listenerAsSpeaker = state.listener_gender === "male" ? "brother" : "sister";
    var compAsListener = comp.gender === "brother" ? "male" : "female";
    var c = findCaseForState({ speaker: listenerAsSpeaker, listener_gender: compAsListener, rel: rel, region: state.region });
    if (!c) return null;
    return { term: termWord(c.listener_term, c.listener_term_south, state.region), rel: rel, c: c };
  }

  // Korean "당신" ("you") is a stilted, rarely-used pronoun in real speech -- Koreans normally
  // address someone by whichever relational noun fits the age gap (형/오빠/누나/언니/동생/삼촌/
  // 이모/아버님/어머님...) the same way Vietnamese has no neutral word for "you" either. peer and
  // stranger_polite are left alone -- staying with a neutral, fully-polite register for a peer
  // or an age-unknown stranger is completely natural in Korean, unlike Vietnamese's mandatory
  // address term, so there's nothing awkward to fix there.
  function koreanListenerAddressNoun() {
    var rel = state.rel;
    if (!rel || rel === "peer" || rel === "stranger_polite") return null;
    var listenerMale = state.listener_gender === "male";
    var meIsSister = peopleState.me.gender === "sister";
    if (rel === "younger_sibling") return "동생";
    if (rel === "older_sibling") return listenerMale ? (meIsSister ? "오빠" : "형") : (meIsSister ? "언니" : "누나");
    if (rel === "younger_than_parent" || rel === "elder_uncle_aunt") return listenerMale ? "삼촌" : "이모";
    if (rel === "older_than_parent" || rel === "elder_parent_age") return listenerMale ? "아버님" : "어머님";
    return null;
  }
  // Swaps 제공 연설's literal "당신은" placeholder for that noun (with the correct 은/는
  // particle, via the same batchim check used for user-name substitution above). Only ever
  // touches Korean-language text -- the zh/en/ja translations already read naturally without
  // this and are left untouched.
  function applyKoreanRelTerms(text) {
    if (!text || currentLang !== "ko") return text;
    var noun = koreanListenerAddressNoun();
    if (!noun) return text;
    var particle = nameHasBatchim(noun) ? "은" : "는";
    return text.split("당신은").join(noun + particle);
  }

  // Who to hand a cross-gender interest's contact info to: my 봉사짝 when they're the opposite
  // gender from me (so same gender as the interest), otherwise the elder brother / pioneer
  // sister on file, matched to the interest's own gender.
  function companionHandoffInfo() {
    var me = peopleState.me, comp = peopleState.companion;
    if (me.gender && comp.gender && me.gender !== comp.gender && (comp.nameVi || comp.nameKr || comp.phone)) {
      return { name: comp.nameVi || comp.nameKr, phone: comp.phone || "", role: "companion" };
    }
    if (state.listener_gender === "male") {
      var e = peopleState.elder;
      if (e.nameVi || e.nameKr || e.phone) return { name: e.nameVi || e.nameKr, phone: e.phone || "", role: "elder" };
    }
    if (state.listener_gender === "female") {
      var p = peopleState.pioneer;
      if (p.nameVi || p.nameKr || p.phone) return { name: p.nameVi || p.nameKr, phone: p.phone || "", role: "pioneer" };
    }
    return null;
  }

  // Resolves {{MY_NAME}}/{{COMPANION}}/{{MY_PHONE}}/{{MY_AGE}}/{{LISTENER_AGE}}/{{MARITAL_A}}
  // placeholder tokens inside 제공 연설 lines. isKr picks the Korean-facing value (Korean name,
  // same digits/phone) vs the Vietnamese-facing value (Vietnamese name, honorific+name). Every
  // token falls back to the same literal wording the talk originally had, so a user who hasn't
  // filled in their profile yet sees no regression at all.
  function applyPeopleTalkTokens(text, isKr) {
    if (!text) return text;
    var out = text;
    if (out.indexOf("{{MY_NAME}}") >= 0) {
      var nameVal = isKr ? (userNameByLang[currentLang] || "_________") : (userNameVi || "__________");
      out = out.split("{{MY_NAME}}").join(nameVal);
    }
    if (out.indexOf("{{COMPANION}}") >= 0) {
      var compVal;
      if (isKr) {
        compVal = peopleState.companion.nameKr || "_________";
      } else {
        // computeCompanionTermForListener(), not computeCompanionTerm() -- this token is always
        // spoken BY me TO the householder, introducing my companion, so the honorific needs to
        // fit how the HOUSEHOLDER would address my companion (their age gap), not how I would.
        var info = computeCompanionTermForListener();
        var compNameVi = peopleState.companion.nameVi || peopleState.companion.nameKr;
        // Lower-case term, not capitalize() -- every talk line that carries this token embeds
        // it mid-sentence (e.g. "Đây là {{COMPANION}}."), never at the very start, so a
        // forced-capital term ("Chị Thu Hằng") would be wrong there. If a future line ever
        // needs this token at a sentence's start, capitalize it in that template text itself
        // (the way MY_NAME-less lines already do for tôi/bạn) rather than baking a capital in here.
        compVal = (info && compNameVi) ? (info.term + " " + compNameVi) : (compNameVi || "__________");
      }
      out = out.split("{{COMPANION}}").join(compVal);
    }
    if (out.indexOf("{{MY_PHONE}}") >= 0) {
      out = out.split("{{MY_PHONE}}").join(peopleState.me.phone || "○○○-○○○○-○○○○");
    }
    if (out.indexOf("{{MY_AGE}}") >= 0) {
      var myAgeVal = (peopleState.me.age != null && !isNaN(peopleState.me.age)) ? String(peopleState.me.age) : "25";
      out = out.split("{{MY_AGE}}").join(myAgeVal);
    }
    if (out.indexOf("{{LISTENER_AGE}}") >= 0) {
      var la = representativeAge(state.rel, state.ageBracket, peopleState.me.age);
      out = out.split("{{LISTENER_AGE}}").join(la != null ? String(la) : "28");
    }
    if (out.indexOf("{{MARITAL_A}}") >= 0) {
      var maritalVal;
      if (peopleState.me.married === "1") {
        maritalVal = isKr ? "이미 결혼했어요." : "Rồi. Tôi đã lập gia đình rồi.";
      } else {
        maritalVal = isKr ? "아직 결혼하지 않았어요." : "Chưa. Tôi chưa lập gia đình.";
      }
      out = out.split("{{MARITAL_A}}").join(maritalVal);
    }
    return out;
  }

  // Companion-note wording (대화 탭) -- reused both when the result card is first built and
  // when it needs a live update after a people-profile field changes, without re-rendering
  // (and re-scrolling to) the whole result card.
  function companionNoteText() {
    var companionGenderLabel = TU(state.listener_gender === "male" ? "남성 형제" : "여성 자매");
    var handoff = companionHandoffInfo();
    var detail = companionGenderLabel;
    if (handoff) {
      var who = TU(handoff.role === "elder" ? "장로 형제" : handoff.role === "pioneer" ? "파이오니아 자매" : "봉사짝");
      detail = who + (handoff.name ? " " + handoff.name : "") + (handoff.phone ? " (" + handoff.phone + ")" : "");
    }
    return TU("이성과의 만남이에요. 인사와 소개 후에는 같은 성별의 동료(") + detail + TU(")에게 연락처를 전달하고, 재방문·성서 연구는 그 동료와 함께 진행하는 것이 좋아요.");
  }
  function updateCompanionNoteInPlace() {
    var noteEl = document.querySelector("#result-wrap .companion-note span");
    if (!noteEl || !currentCase) return;
    noteEl.textContent = companionNoteText();
  }

  var currentCase = null;
  function renderResult() {
    var wrap = document.getElementById("result-wrap");
    var c = findCase();
    currentCase = c;
    if (!c) { wrap.innerHTML = ""; return; }

    var selfDisplay = termWord(c.self_term, c.self_term_south, state.region);
    var listenerDisplay = termWord(c.listener_term, c.listener_term_south, state.region);
    var speakerLabel = TU(state.speaker === "brother" ? "형제" : "자매");
    var regionLabel = TU(state.region === "north" ? "북부" : "남부");
    var relLabel = TU(REL_LABEL[c.rel]);
    var usesA = (c.rel === "younger_than_parent" || c.rel === "older_than_parent");

    var html = '';
    html += '<div class="result-card">';
    html += '  <div class="result-top">';
    html += '    <div class="result-badges">';
    html += '      <span class="badge">' + speakerLabel + ' → ' + TU(state.listener_gender === "male" ? "남성" : "여성") + '</span>';
    html += '      <span class="badge">' + relLabel + '</span>';
    html += '      <span class="badge ' + (state.region === "north" ? "north" : "south") + '">' + regionLabel + '</span>';
    html += '    </div>';
    html += '    <button class="reset-link" id="reset-btn">' + TU("다시 선택") + '</button>';
    html += '  </div>';
    html += '  <div class="term-pair">';
    html += '    <div class="term-box"><div class="who">' + TU("상대를 부를 때") + '</div><div class="word vn">' + listenerDisplay + '</div><div class="mean">' + TU(TERM_MEAN[listenerDisplay] || '') + '</div></div>';
    html += '    <div class="term-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>';
    html += '    <div class="term-box"><div class="who">' + TU("나를 가리킬 때") + '</div><div class="word vn">' + selfDisplay + '</div><div class="mean">' + TU(TERM_MEAN[selfDisplay] || '') + '</div></div>';
    html += '  </div>';
    html += '  <div class="politeness-row">';
    html += '    <div class="politeness-item">' + TU("문장 끝: ") + (usesA && state.region === "north" ? TU('<b>ạ</b> (존대)') : TU('<b>없음</b> (편하게)')) + '</div>';
    html += '    <div class="politeness-item">' + TU("대답 시작: ") + (usesA ? TU('<b>dạ</b> (네)') : TU('<b>없음</b>')) + '</div>';
    html += '  </div>';
    if (!c.same_sex) {
      html += '  <div class="companion-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span>' + escapeHtml(companionNoteText()) + '</span></div>';
    }
    html += '</div>';

    html += renderStageScript(c);
    wrap.innerHTML = html;
    document.getElementById("reset-btn").addEventListener("click", resetWizard);
    bindStageInteractions(c);
    wrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function resetWizard() {
    // Q1 ("나는 어느 쪽인가요?") was folded into the 참여자 정보 section's "나" gender toggle,
    // so "다시 선택" should not forget it -- only the questions still asked below it reset.
    state = { speaker: peopleState.me.gender, listener_gender: null, rel: null, region: null };
    currentStageIdx = 0;
    document.querySelectorAll("#panel-wizard .choice-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
    document.getElementById("region-note").textContent = "";
    document.getElementById("result-wrap").innerHTML = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderCurrTalks();
    renderCurrLpd();
    savePeopleState();
  }

  function renderStageScript(c) {
    var stageNames = Object.keys(c.stages);
    if (currentStageIdx >= stageNames.length) currentStageIdx = 0;
    var html = '<div class="practice-toggle"><span class="lbl">' + TU("한국어 뜻 가리고 연습하기") + '</span><label class="switch"><input type="checkbox" id="practice-switch" ' + (practiceMode ? "checked" : "") + '><span class="track"></span><span class="thumb"></span></label></div>';
    html += '<div class="stage-nav" id="stage-nav">';
    stageNames.forEach(function (name, i) {
      var short = TU(displayStageName(name, c.id));
      html += '<button class="stage-pill subtab-btn" data-idx="' + i + '" aria-selected="' + (i === currentStageIdx) + '">' + (i + 1) + '. ' + short + '</button>';
    });
    html += '</div>';
    html += '<div id="stage-body"></div>';
    html += '<div class="stage-foot-nav">';
    html += '  <button class="foot-btn" id="stage-prev" ' + (currentStageIdx === 0 ? "disabled" : "") + '>← ' + TU("이전 단계") + '</button>';
    html += '  <button class="foot-btn primary" id="stage-next" ' + (currentStageIdx === stageNames.length - 1 ? "disabled" : "") + '>' + TU("다음 단계") + ' →</button>';
    html += '</div>';
    return html;
  }

  function renderStageBody(c) {
    var stageNames = Object.keys(c.stages);
    var name = stageNames[currentStageIdx];
    var items = c.stages[name];
    var body = document.getElementById("stage-body");
    var shortTitle = TU(displayStageName(name, c.id));
    var stageTexts = [];
    var turnsHtml = '<div class="turns">';
    items.forEach(function (it) {
      var viet = applyCompanionText(applyNameText(applyRegionText(it.viet, c, state.region), true), true, c.id);
      viet = applyChungTa(viet, c, state.region);
      if (state.region === "south") viet = stripA(viet);
      var translation = applyCompanionText(applyNameText(T(it.translation), false), false, c.id);
      var meaningBtnHtml = function (txt) {
        return '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(txt) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>';
      };
      stageTexts.push([viet, translation]);
      turnsHtml += '<div class="turn">';
      turnsHtml += '  <div class="me-label">' + TU("나") + '</div>';
      turnsHtml += '  <div class="viet vn">' + escapeHtml(viet) + '<button class="speak-btn" data-speak="' + escapeAttr(viet) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      turnsHtml += '  <div class="gloss">' + escapeHtml(applyCompanionText(applyNameText(T(it.gloss), false), false, c.id).replace(/\s{2,}/g, " · ")) + '</div>';
      turnsHtml += '  <div class="kr' + (practiceMode ? " hidden-mode" : "") + '" data-full="' + escapeAttr(translation) + '">' +
        (practiceMode ? '<span class="peek">' + TU("눌러서 뜻 보기") + '</span>' : '<span class="kr-text">' + escapeHtml(translation) + '</span>' + meaningBtnHtml(translation)) + '</div>';
      turnsHtml += '</div>';
      if (it.reply) {
        var rname = it.reply.name, rviet = applyCompanionText(applyNameText(applyRegionText(it.reply.viet, c, state.region), true), true, c.id), rkr = applyCompanionText(applyNameText(T(it.reply.translation), false), false, c.id);
        if (rname) {
          rviet = applyChungTa(rviet, c, state.region);
          if (state.region === "south") rviet = stripA(rviet);
          stageTexts.push([rviet, rkr]);
          turnsHtml += '<div class="turn reply-turn">';
          turnsHtml += '  <div class="me-label">' + escapeHtml(rname) + ' (' + TU("상대") + ')</div>';
          turnsHtml += '  <div class="viet vn">' + escapeHtml(rviet) + '<button class="speak-btn" data-speak="' + escapeAttr(rviet) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
          turnsHtml += '  <div class="kr' + (practiceMode ? " hidden-mode" : "") + '" data-full="' + escapeAttr(rkr) + '">' +
            (practiceMode ? '<span class="peek">' + TU("눌러서 뜻 보기") + '</span>' : '<span class="kr-text">' + escapeHtml(rkr) + '</span>' + meaningBtnHtml(rkr)) + '</div>';
          turnsHtml += '</div>';
        }
      }
    });
    turnsHtml += '</div>';
    var html = '<div class="stage-title" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><span>' +
      (currentStageIdx + 1) + '. ' + escapeHtml(shortTitle) + '</span>' + readAllButtonHtml(stageTexts) + '</div>' + turnsHtml;
    body.innerHTML = html;

    body.querySelectorAll(".speak-btn").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        if (b.dataset.speakMeaning) speakMeaning(b.dataset.speakMeaning);
        else speak(b.dataset.speak);
      });
    });
    body.querySelectorAll(".kr").forEach(function (k) {
      k.addEventListener("click", function () {
        if (!practiceMode || !k.classList.contains("hidden-mode")) return;
        k.classList.remove("hidden-mode");
        var full = k.dataset.full;
        k.innerHTML = '<span class="kr-text">' + escapeHtml(full) + '</span>' + meaningBtnHtml(full);
        var mb = k.querySelector(".speak-meaning-btn");
        if (mb) mb.addEventListener("click", function (e) { e.stopPropagation(); speakMeaning(mb.dataset.speakMeaning); });
      });
    });
  }

  function bindStageInteractions(c) {
    renderStageBody(c);
    document.getElementById("stage-nav").querySelectorAll(".stage-pill").forEach(function (p) {
      p.addEventListener("click", function () {
        currentStageIdx = parseInt(p.dataset.idx, 10);
        document.querySelectorAll("#stage-nav .stage-pill").forEach(function (x) { x.setAttribute("aria-selected", "false"); });
        p.setAttribute("aria-selected", "true");
        renderStageBody(c);
        updateStageFootNav(c);
      });
    });
    document.getElementById("stage-prev").addEventListener("click", function () {
      if (currentStageIdx > 0) { currentStageIdx--; refreshStageNav(c); }
    });
    document.getElementById("stage-next").addEventListener("click", function () {
      var stageNames = Object.keys(c.stages);
      if (currentStageIdx < stageNames.length - 1) { currentStageIdx++; refreshStageNav(c); }
    });
    document.getElementById("practice-switch").addEventListener("change", function (e) {
      practiceMode = e.target.checked;
      renderStageBody(c);
    });
  }

  function refreshStageNav(c) {
    document.querySelectorAll("#stage-nav .stage-pill").forEach(function (x) {
      x.setAttribute("aria-selected", parseInt(x.dataset.idx, 10) === currentStageIdx ? "true" : "false");
    });
    renderStageBody(c);
    updateStageFootNav(c);
  }
  function updateStageFootNav(c) {
    var stageNames = Object.keys(c.stages);
    document.getElementById("stage-prev").disabled = currentStageIdx === 0;
    document.getElementById("stage-next").disabled = currentStageIdx === stageNames.length - 1;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
  }

  // Vietnamese dictionary-order sort (base letter, then diacritic, then tone), used wherever a
  // word list should read in the order a Vietnamese dictionary would print it (성조-중국어 성조
  // 대응, 성조 조합 연습 word lists, 한자음 소분류). Intl.Collator("vi") already implements this
  // ordering correctly (đ sorts after d, tone marks sort ngang→huyền→sắc→hỏi→ngã→nặng), so this
  // just wraps it with a plain-localeCompare fallback for engines without Vietnamese collation
  // data, and never mutates the array passed in.
  var VI_COLLATOR = (typeof Intl !== "undefined" && Intl.Collator) ? new Intl.Collator("vi", { sensitivity: "variant", numeric: true }) : null;
  function viSort(arr, keyFn) {
    var out = (arr || []).slice();
    out.sort(function (a, b) {
      var ka = keyFn ? keyFn(a) : a, kb = keyFn ? keyFn(b) : b;
      return VI_COLLATOR ? VI_COLLATOR.compare(ka, kb) : String(ka).localeCompare(String(kb));
    });
    return out;
  }

  /* ================= REFERENCE TABLE ================= */
  function renderRefTable() {
    var root = document.getElementById("ref-table-root");
    if (!root) return;
    var html = "";
    REF_TABLE.forEach(function (sec) {
      var secTexts = [];
      sec.rows.forEach(function (r) {
        var listenerMean = TU(TERM_MEAN[r.listener] || ''), selfMean = TU(TERM_MEAN[r.self] || '');
        secTexts.push([r.listener, listenerMean], [r.self, selfMean]);
        if (r.listenerSouth) secTexts.push([r.listenerSouth, listenerMean]);
        if (r.selfSouth) secTexts.push([r.selfSouth, selfMean]);
      });
      html += '<div class="ref-section-title" style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap">' +
        '<span>' + TU(sec.title) + '</span>' + readAllButtonHtml(secTexts) + '</div><div class="ref-table">';
      sec.rows.forEach(function (r) {
        html += '<div class="ref-row"><div><div class="rel-label">' + TU(r.cond) + '</div>' +
          '<div class="rel-sub">' + TU(TERM_MEAN[r.listener] || '') + ' → ' + TU(TERM_MEAN[r.self] || '') + '</div></div>' +
          '<div class="ref-terms"><span>' + r.listener + '</span><button class="speak-btn" data-speak="' + escapeAttr(r.listener) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          (r.listenerSouth ? ' <span class="alt">/ ' + r.listenerSouth + ' ' + TU("(남)") + '</span><button class="speak-btn" data-speak="' + escapeAttr(r.listenerSouth) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' : '') +
          '<span class="sep">↔</span><span>' + r.self + '</span><button class="speak-btn" data-speak="' + escapeAttr(r.self) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          (r.selfSouth ? ' <span class="alt">/ ' + r.selfSouth + ' ' + TU("(남)") + '</span><button class="speak-btn" data-speak="' + escapeAttr(r.selfSouth) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' : '') + '</div></div>';
      });
      html += '</div>';
    });
    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
  }
  renderRefTable();

  /* ================= FAMILY TREE (가족 호칭 가계도) ================= */
  function ftMemberHtml(m) {
    if (m.me) {
      return '<div class="ft-member ft-me"><div class="ft-member-ko">' + TU(m.ko) + '</div></div>';
    }
    var html = '<div class="ft-member"><div class="ft-member-ko">' + TU(m.ko) + '</div>';
    if (m.forms) {
      // Two or more DIFFERENT wordings for the same relation (e.g. "ông thông gia" when
      // mentioning them to someone else vs "anh sui" used to address them directly) rather than
      // a north/south regional pair -- each gets its own labeled line instead of the "/ ...(남)"
      // alt-style suffix used for regional variants below.
      m.forms.forEach(function (f) {
        html += '<div class="ft-member-vi"><span class="ft-form-label">' + TU(f.label) + '</span><span>' + f.vi + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(f.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      });
    } else {
      html += '<div class="ft-member-vi"><span>' + m.vi + '</span>' +
        '<button class="speak-btn" data-speak="' + escapeAttr(m.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>';
      if (m.viSouth) {
        html += ' <span class="alt">/ ' + m.viSouth + ' ' + TU("(남)") + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(m.viSouth) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }
  function ftGroupTexts(group) {
    var out = [];
    group.members.forEach(function (m) {
      if (m.forms) {
        m.forms.forEach(function (f) { if (f.vi) out.push([f.vi, TU(f.label)]); });
      } else {
        var mean = TU(m.ko);
        if (m.vi) out.push([m.vi, mean]);
        if (m.viSouth) out.push([m.viSouth, mean]);
      }
    });
    return out;
  }
  function renderFamilyTreeGens(gens) {
    var html = "";
    gens.forEach(function (gen, gi) {
      var genTexts = [];
      gen.groups.forEach(function (g) { genTexts = genTexts.concat(ftGroupTexts(g)); });
      html += '<div class="ft-gen"><div class="ft-gen-head"><span class="ft-gen-label">' + TU(gen.label) + '</span>' +
        readAllButtonHtml(genTexts) + '</div><div class="ft-groups">';
      gen.groups.forEach(function (g) {
        html += '<div class="ft-group' + (g.isMe ? ' ft-group-me' : '') + '"><div class="ft-group-head">' + TU(g.label) + '</div><div class="ft-group-members">';
        g.members.forEach(function (m) { html += ftMemberHtml(m); });
        html += '</div></div>';
      });
      html += '</div></div>';
      if (gi < gens.length - 1) html += '<div class="ft-connector" aria-hidden="true"></div>';
    });
    return html;
  }
  function renderFamilyTree() {
    var root = document.getElementById("family-tree-root");
    if (!root) return;
    var allTexts = [];
    FAMILY_TREE.forEach(function (gen) { gen.groups.forEach(function (g) { allTexts = allTexts.concat(ftGroupTexts(g)); }); });
    FAMILY_INLAW.forEach(function (gen) { gen.groups.forEach(function (g) { allTexts = allTexts.concat(ftGroupTexts(g)); }); });

    var html = '<div class="ref-section-title" style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap">' +
      '<span>' + TU("가족 호칭 가계도") + '</span>' + readAllButtonHtml(allTexts) + '</div>';
    html += '<div class="chain-note">' + TU("직계 4대(증조부모~증손주)와 혼인으로 맺어지는 사돈 쪽 호칭을 하나의 가계도로 정리했어요.") + '</div>';
    html += '<div class="family-tree">';
    html += renderFamilyTreeGens(FAMILY_TREE);
    html += '<div class="ft-connector ft-connector-branch" aria-hidden="true"></div>';
    html += '<div class="ft-inlaw-title">' + TU("혼인으로 맺어지는 사돈 쪽 호칭") + '</div>';
    html += renderFamilyTreeGens(FAMILY_INLAW);
    html += '</div>';

    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
  }
  renderFamilyTree();

  /* ================= VOCAB (단어 통합 + 전문 메뉴) ================= */
  var vocabMode = "words";
  var activeWordTag = "all";
  var wordsDisplayLimit = 80;
  // Set by goToTab() when a 16주 과정 / 주간 수행 과제 어휘 바로가기 targets a specific slice of a
  // vocab subtab's own natural item order (see VOCAB_PLAN / applyVocabFocus()) -- {mode, start, end}.
  // Cleared on any ordinary subtab click or search so a stale focus never silently narrows the list.
  var vocabFocus = null;
  var VOCAB_SUBTAB_LABEL_KEY = {
    words: "단어", rhyme: "한자음", orderrev: "어순반대", groups: "동일음", basic: "기본", antonym: "반의",
    freq: "상용", theo: "신권", names: "인명", chain: "끝말", dialect: "남북 단어", wt: "파수대"
  };
  function applyVocabFocus(mode, arr) {
    if (!vocabFocus || vocabFocus.mode !== mode) return arr;
    return arr.slice(vocabFocus.start, vocabFocus.end);
  }
  function vocabFocusBannerHtml(mode) {
    if (!vocabFocus || vocabFocus.mode !== mode) return "";
    return '<div class="vocab-focus-banner"><span>' + TU("오늘 학습할 범위") + ' — ' + TU(VOCAB_SUBTAB_LABEL_KEY[mode]) +
      ' ' + (vocabFocus.start + 1) + '~' + vocabFocus.end + '</span>' +
      '<div class="vocab-focus-banner-btns">' +
      '<button class="vocab-focus-scoped-review">' + TU("학습 범위내 복습 게임") + '</button>' +
      '<button class="vocab-focus-clear">' + TU("전체 보기") + '</button></div></div>';
  }
  // renderFn (optional): which render function "전체 보기" should call after clearing the focus
  // -- defaults to renderVocab() for every ordinary vocab subtab, but 파수대 moved to its own
  // 문장 tab (see renderCurrWt()) and passes that instead so clearing its focus re-renders the
  // right pane.
  function bindVocabFocusClear(root, renderFn) {
    renderFn = renderFn || renderVocab;
    var b = root.querySelector(".vocab-focus-clear");
    if (b) b.addEventListener("click", function () { vocabFocus = null; renderFn(); });
    var sr = root.querySelector(".vocab-focus-scoped-review");
    if (sr) sr.addEventListener("click", function () {
      if (typeof window.__goToScopedVocabReview === "function") window.__goToScopedVocabReview();
    });
  }
  document.querySelectorAll(".subtab-btn[data-vocab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".subtab-btn[data-vocab]").forEach(function (b) { b.setAttribute("aria-selected", "false"); });
      btn.setAttribute("aria-selected", "true");
      vocabFocus = null;
      vocabMode = btn.dataset.vocab;
      if (vocabMode === "words") {
        wordsDisplayLimit = 80;
      }
      renderVocab();
    });
  });
  document.getElementById("vocab-search").addEventListener("input", function () { vocabFocus = null; renderVocab(); });

  function renderTheoList(root, q) {
    var base = applyVocabFocus("theo", VOCAB_THEO);
    var items = base.filter(function (it) {
      if (!q) return true;
      return it.word.toLowerCase().indexOf(q) >= 0 || T(it.meaning).toLowerCase().indexOf(q) >= 0;
    });
    if (!items.length) { root.innerHTML = vocabFocusBannerHtml("theo") + '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>'; bindVocabFocusClear(root); return; }
    var html = vocabFocusBannerHtml("theo") + '<div class="chain-note" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><span>' + TU("사전어순(베트남어 알파벳순)으로 정리했어요. 한자어에서 온 단어는 괄호 안에 한자를 표시했습니다.") + '</span>' +
      readAllButtonHtml(items.map(function (it) { return [it.word, T(it.meaning)]; })) + '</div><div class="theo-list">';
    items.forEach(function (it) {
      html += '<div class="theo-item"><div class="theo-body">' +
        '<div class="theo-word vn">' + escapeHtml(it.word) + (it.hanja ? ' <span class="chain-meta">(' + escapeHtml(it.hanja) + ')</span>' : '') + '</div>' +
        '<div class="theo-mean">' + escapeHtml(T(it.meaning)) + '</div></div>' +
        '<button class="speak-btn" data-speak="' + escapeAttr(it.word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
    });
    html += '</div>';
    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
    bindVocabFocusClear(root);
  }

  function renderFreqList(root, q) {
    var base = applyVocabFocus("freq", FREQ_VOCAB);
    var items = base.filter(function (it) {
      if (!q) return true;
      return it.vi.toLowerCase().indexOf(q) >= 0 || T(it.kr).toLowerCase().indexOf(q) >= 0;
    });
    if (!items.length) { root.innerHTML = vocabFocusBannerHtml("freq") + '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>'; bindVocabFocusClear(root); return; }
    var html = vocabFocusBannerHtml("freq") + '<div class="chain-note" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><span>' + TU("총 ") + FREQ_VOCAB.length + TU("개 단어 중 ") + items.length + TU("개 검색됨") + '</span>' +
      readAllButtonHtml(items.map(function (it) { return [it.vi, T(it.kr)]; })) + '</div><div class="theo-list">';
    items.forEach(function (it) {
      html += '<div class="theo-item"><div class="theo-body">' +
        '<div class="theo-word vn">' + escapeHtml(it.vi) + '</div>' +
        '<div class="theo-mean">' + escapeHtml(T(it.kr)) + '</div></div>' +
        '<button class="speak-btn" data-speak="' + escapeAttr(it.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
    });
    html += '</div>';
    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
    bindVocabFocusClear(root);
  }

  var wordsSortByFrequency = false;
  var WORD_TAG_CLASS = { "상용": "tag-freq", "한자음": "tag-sino", "신권": "tag-theo", "어순반대": "tag-reversed", "동일음": "tag-homo" };
  function renderVocabWords(root, q) {
    var words = (typeof UNIFIED_WORDS !== "undefined" && UNIFIED_WORDS) || [];
    var filterEl = document.getElementById("vocab-tag-filters");
    if (filterEl) {
      filterEl.style.display = "";
      var allTags = ["all"];
      var knownTags = ["기본", "상용", "신권", "인명", "한자음", "어순반대", "동일음", "반의", "PDF"];
      var presentTags = {};
      words.forEach(function (w) {
        if (w.tags) w.tags.forEach(function (t) { presentTags[t] = true; });
      });
      knownTags.forEach(function (t) {
        if (presentTags[t]) allTags.push(t);
      });
      var filterHtml = '';
      allTags.forEach(function (t) {
        var label = t === "all" ? TU("전체") : TU(t);
        var isActive = activeWordTag === t;
        filterHtml += '<button type="button" class="tag-filter-btn' + (isActive ? ' active' : '') + '" data-tag="' + escapeAttr(t) + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' + escapeHtml(label) + '</button>';
      });
      filterHtml += '<button type="button" class="tag-filter-btn word-sort-btn" data-sort="frequency" aria-pressed="' + (wordsSortByFrequency ? 'true' : 'false') + '">' + escapeHtml(TU("빈도가 많은 순")) + '</button>';
      filterEl.innerHTML = filterHtml;
      var sortBtn = filterEl.querySelector(".word-sort-btn");
      sortBtn.addEventListener("click", function () {
        wordsSortByFrequency = !wordsSortByFrequency;
        wordsDisplayLimit = 80;
        renderVocabWords(root, document.getElementById("vocab-search").value.trim().toLowerCase());
      });
      filterEl.querySelectorAll(".tag-filter-btn[data-tag]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          activeWordTag = btn.dataset.tag;
          wordsDisplayLimit = 80;
          renderVocabWords(root, document.getElementById("vocab-search").value.trim().toLowerCase());
        });
      });
    }

    // Meanings are looked up by the canonical language key only. A language the record has no meaning for shows the
    // existing "unavailable" marker -- never the Korean (or any other language's) meaning in its place.
    function getWordMeaning(w) {
      if (!w) return "";
      var m = w.kr || w.meanings;
      if (typeof m === "string") m = { ko: m };
      var v = m && typeof m === "object" ? m[currentLang] : null;
      if (v) return v;
      return "";
    }
    function getAntonymMeaning(w) {
      if (!w || !w.antonymMeaning) return "";
      var m = w.antonymMeaning;
      if (typeof m === "string") m = { ko: m };
      return (m && typeof m === "object" && m[currentLang]) || "";
    }

    var filtered = words.filter(function (w) {
      if (activeWordTag !== "all" && (!w.tags || w.tags.indexOf(activeWordTag) < 0)) return false;
      if (!q) return true;
      var meaningStr = getWordMeaning(w);
      return (w.vi && w.vi.toLowerCase().indexOf(q) >= 0) || meaningStr.toLowerCase().indexOf(q) >= 0;
    });

    if (wordsSortByFrequency) {
      // Authoritative field: UNIFIED_WORDS[].frequency (set by unified_words_builder.py). 0/missing = no frequency data,
      // listed after every word that has one. Ties keep the source order (stable, deterministic).
      var sourceIndex = new Map();
      words.forEach(function (w, i) { sourceIndex.set(w, i); });
      var freqOf = function (w) { return typeof w.frequency === "number" && w.frequency > 0 ? w.frequency : -1; };
      filtered = filtered.slice().sort(function (a, b) { return (freqOf(b) - freqOf(a)) || (sourceIndex.get(a) - sourceIndex.get(b)); });
    }

    if (!filtered.length) {
      root.innerHTML = '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
      return;
    }

    var slice = filtered.slice(0, wordsDisplayLimit);
    var html = '<div class="chain-note" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">' +
      '<span>' + TU("총 ") + filtered.length + TU("개 단어") + (activeWordTag !== "all" ? ' (' + TU(activeWordTag) + ')' : '') + '</span>' +
      readAllButtonHtml(slice.map(function (w) { return [w.vi, getWordMeaning(w)]; })) +
      '</div>';

    html += '<div class="theo-list">';
    slice.forEach(function (w) {
      var mean = getWordMeaning(w);
        var jwFreqHtml = '';
        if (typeof JW_EXTRACTION_DATA !== "undefined" && JW_EXTRACTION_DATA && JW_EXTRACTION_DATA.vocabFrequencies) {
          var jf = JW_EXTRACTION_DATA.vocabFrequencies[w.vi.toLowerCase()] || JW_EXTRACTION_DATA.vocabFrequencies[w.vi];
          if (jf && jf.totalOccurrences > 0) {
            jwFreqHtml += '<span class="jw-freq-badge" title="' + TU("JW 출처 빈도") + '">JW ' + jf.totalOccurrences + '회</span>';
            if (jf.bySourceType) {
              if (jf.bySourceType.watchtower) jwFreqHtml += '<span class="source-pill source-pill-wt" title="' + TU("파수대") + '">WT ' + jf.bySourceType.watchtower + '</span>';
              if (jf.bySourceType.songs) jwFreqHtml += '<span class="source-pill source-pill-song" title="' + TU("노래") + '">노래 ' + jf.bySourceType.songs + '</span>';
              if (jf.bySourceType.enjoyLifeForever) jwFreqHtml += '<span class="source-pill source-pill-elf" title="' + TU("영원히") + '">영원히 ' + jf.bySourceType.enjoyLifeForever + '</span>';
            }
          }
        }
        html += '<div class="bible-item"' + (w.pdf_id ? ' data-pdf-id="' + escapeAttr(w.pdf_id) + '"' : '') + '><div class="bible-body">' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<span class="bible-word vn font-bold">' + escapeHtml(w.vi) + '</span>' +
          (typeof w.frequency === "number" && w.frequency > 0 ? '<span class="word-freq-badge" title="' + TU("등장 빈도") + '">' + TU("빈도: ") + w.frequency + '</span>' : '') +
          jwFreqHtml +
          '<div style="display:inline-flex;gap:4px;flex-wrap:wrap">' +
          (w.tags || []).map(function (t) { return '<span class="word-tag-pill' + (WORD_TAG_CLASS[t] ? ' ' + WORD_TAG_CLASS[t] : '') + '">' + escapeHtml(TU(t)) + '</span>'; }).join('') +
          '</div></div>' +
          (mean ? '<div class="bible-mean">' + escapeHtml(mean) + '</div>' : '');

      if (w.antonym) {
        var antMean = getAntonymMeaning(w);
        html += '<div class="word-antonym-box">' +
          '<span class="ant-label">' + TU("반의어:") + '</span>' +
          '<span class="vn font-bold">' + escapeHtml(w.antonym) + '</span>' +
          (antMean ? ' <span class="ant-mean">(' + escapeHtml(antMean) + ')</span>' : '') +
          '</div>';
      }

      html += '</div>' +
        '<button class="speak-btn" data-speak="' + escapeAttr(w.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
        '</div>';
    });
    html += '</div>';

    if (filtered.length > wordsDisplayLimit) {
      html += '<div style="text-align:center;padding:16px 0;">' +
        '<button id="vocab-words-more-btn" class="foot-btn secondary" style="min-width:180px;">' +
        TU("더 보기") + ' (' + slice.length + ' / ' + filtered.length + ')' +
        '</button></div>';
    }

    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) {
      b.addEventListener("click", function () { speak(b.dataset.speak); });
    });
    var moreBtn = document.getElementById("vocab-words-more-btn");
    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        wordsDisplayLimit += 80;
        renderVocabWords(root, q);
      });
    }
  }

  function renderVocab() {
    var q = document.getElementById("vocab-search").value.trim().toLowerCase();
    var root = document.getElementById("vocab-root");
    var filterEl = document.getElementById("vocab-tag-filters");
    if (filterEl) {
      filterEl.style.display = (vocabMode === "words") ? "" : "none";
    }
    if (vocabMode === "words") {
      renderVocabWords(root, q);
      return;
    }
    if (vocabMode === "rhyme") {
      renderRhyme(root, q);
      return;
    }
    if (vocabMode === "theo") {
      renderTheoList(root, q);
      return;
    }
    if (vocabMode === "freq") {
      renderFreqList(root, q);
      return;
    }
    if (vocabMode === "names") {
      renderVocabNames(root, q);
      return;
    }
    if (vocabMode === "basic") {
      renderVocabBasic(root, q);
      return;
    }
    if (vocabMode === "antonym") {
      renderVocabAntonym(root, q);
      return;
    }
    if (vocabMode === "dialect") {
      renderVocabDialect(root, q);
      return;
    }
    if (vocabMode === "orderrev") {
      renderVocabOrderReversed(root, q);
      return;
    }
    if (vocabMode === "chain") {
      var base = applyVocabFocus("chain", VOCAB_CHAIN);
      var items = base.filter(function (it) {
        if (!q) return true;
        return it.word.toLowerCase().indexOf(q) >= 0 || T(it.meaning).toLowerCase().indexOf(q) >= 0;
      });
      if (!items.length) { root.innerHTML = vocabFocusBannerHtml("chain") + '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>'; bindVocabFocusClear(root); return; }
      var html = vocabFocusBannerHtml("chain") + '<div class="chain-note" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><span>' + TU("4음절 이상 결합어는 그것을 이루는 기본 단어를 먼저 보여준 뒤에 나옵니다.") + '</span>' +
        readAllButtonHtml(items.map(function (it) { return [it.word, T(it.meaning)]; })) + '</div>';
      html += '<div class="chain-list">';
      items.forEach(function (it) {
        var tag = "";
        if (it.kind === "base") tag = '<span class="chain-tag base">' + TU("기본") + '</span>';
        else if (it.kind === "compound") tag = '<span class="chain-tag compound">' + TU("결합어") + '</span>';
        var partsLine = (it.kind === "compound" && it.parts && it.parts.length)
          ? '<div class="chain-parts">= ' + it.parts.map(escapeHtml).join(' + ') + '</div>' : '';
        html += '<div class="chain-item"><span class="chain-n tabular">' + it.display_n + '</span><div class="chain-body">' +
          '<div class="chain-word vn">' + escapeHtml(it.word) + (it.hanja ? ' <span class="chain-meta">(' + it.hanja + ')</span>' : '') + tag + '</div>' +
          '<div class="chain-meta">' + escapeHtml(T(it.meaning)) + '</div>' + partsLine + '</div>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(it.word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      });
      html += '</div>';
      root.innerHTML = html;
      root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
      bindVocabFocusClear(root);
    } else {
      var focusGroups = VOCAB_GROUPS;
      if (vocabFocus && vocabFocus.mode === "groups") {
        var fullFlat = [];
        VOCAB_GROUPS.forEach(function (g) { g.words.forEach(function (w) { fullFlat.push({ g: g, w: w }); }); });
        var flatSlice = fullFlat.slice(vocabFocus.start, vocabFocus.end);
        var order = [], map = {};
        flatSlice.forEach(function (item) {
          var key = item.g.syllable;
          if (!map[key]) { map[key] = { g: item.g, words: [] }; order.push(key); }
          map[key].words.push(item.w);
        });
        focusGroups = order.map(function (key) { return Object.assign({}, map[key].g, { words: map[key].words }); });
      }
      var groups = focusGroups.map(function (g) {
        if (!q) return g;
        var words = g.words.filter(function (w) { return w.word.toLowerCase().indexOf(q) >= 0 || T(w.meaning).toLowerCase().indexOf(q) >= 0; });
        if (g.syllable.toLowerCase().indexOf(q) >= 0) return g;
        return words.length ? Object.assign({}, g, { words: words }) : null;
      }).filter(Boolean);
      if (!groups.length) { root.innerHTML = vocabFocusBannerHtml("groups") + '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>'; bindVocabFocusClear(root); return; }
      var openAll = !!q || (vocabFocus && vocabFocus.mode === "groups");
      var html = vocabFocusBannerHtml("groups");
      groups.forEach(function (g) {
        html += '<div class="group-card" data-open="' + openAll + '" data-syl="' + g.syllable + '">' +
          '<div class="group-head-row"><button class="group-head"><span><span class="syl">' + g.syllable + '</span> <span class="cnt">' + g.words.length + TU("개 단어") + '</span></span>' +
          '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
          readAllButtonHtml(g.words.map(function (w) { return [w.word, T(w.meaning)]; })) + '</div>' +
          '<div class="group-body">';
        g.words.forEach(function (w) {
          html += '<div class="word-row"><span><span class="w">' + escapeHtml(w.word) + '</span>' + (w.hanja ? '<span class="h">(' + w.hanja + ')</span>' : '') +
            '<button class="speak-btn" data-speak="' + escapeAttr(w.word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></span><span class="m">' + escapeHtml(T(w.meaning)) + '</span></div>';
        });
        html += '</div></div>';
      });
      root.innerHTML = html;
      root.querySelectorAll(".group-card").forEach(function (card) {
        card.querySelector(".group-head").addEventListener("click", function () {
          card.dataset.open = card.dataset.open === "true" ? "false" : "true";
        });
      });
      root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); speak(b.dataset.speak); }); });
      bindVocabFocusClear(root);
    }
  }
  renderVocab();

  function rwKrText(wd) {
    if (currentLang === "ko") return wd.kr;
    if (currentLang === "zh") return wd.bopomofo + " " + wd.pinyin;
    return wd.pinyin;
  }

  // Chinese-mode 전체 듣기 helper for 한자음/어순반대: a Chinese-literate learner wants to hear the
  // EXACT hanja shown on screen for each syllable (wd.hanja/wd.second_hanja) after the Vietnamese,
  // not a translated Chinese meaning phrase (T(wd.gloss)) that often doesn't match those
  // characters at all (e.g. gloss.zh "證據" vs the single hanja "證" actually printed next to the
  // word). For the combined example word -- which has no dedicated "second hanja" field on plain
  // 한자음(RHYME_GROUPS) entries -- the combined hanja is pulled out of the data's existing
  // "reading(漢字)" example_kr string (e.g. "가수(歌手)" -> "歌手"), the same hanja a Korean-mode
  // reader sees in that field's parentheses.
  function trailingParenHanja(s) {
    if (!s) return null;
    var m = String(s).match(/\(([^()]+)\)\s*$/);
    return m ? m[1] : null;
  }

  function renderRhyme(root, q) {
    var sourceGroups = RHYME_GROUPS;
    if (vocabFocus && vocabFocus.mode === "rhyme") {
      var fullFlat = [];
      RHYME_GROUPS.forEach(function (g) { g.families.forEach(function (fam) { fam.words.forEach(function (wd) { fullFlat.push({ g: g, fam: fam, wd: wd }); }); }); });
      var flatSlice = fullFlat.slice(vocabFocus.start, vocabFocus.end);
      var gOrder = [], gMap = {};
      flatSlice.forEach(function (item) {
        var gKey = item.g.final_class ? T(item.g.final_class) : String(RHYME_GROUPS.indexOf(item.g));
        if (!gMap[gKey]) { gMap[gKey] = { g: item.g, famOrder: [], famMap: {} }; gOrder.push(gKey); }
        var famKey = typeof item.fam.final === "string" ? item.fam.final : T(item.fam.final);
        var famBucket = gMap[gKey];
        if (!famBucket.famMap[famKey]) { famBucket.famMap[famKey] = { fam: item.fam, words: [] }; famBucket.famOrder.push(famKey); }
        famBucket.famMap[famKey].words.push(item.wd);
      });
      sourceGroups = gOrder.map(function (gKey) {
        var gBucket = gMap[gKey];
        var families = gBucket.famOrder.map(function (famKey) {
          var fb = gBucket.famMap[famKey];
          return Object.assign({}, fb.fam, { words: fb.words });
        });
        return Object.assign({}, gBucket.g, { families: families });
      });
    }
    var groups = sourceGroups.map(function (g) {
      var families = g.families.map(function (fam) {
        var words = fam.words.filter(function (wd) {
          if (!q) return true;
          return wd.word.toLowerCase().indexOf(q) >= 0 || wd.kr.indexOf(q) >= 0 ||
            T(wd.gloss).toLowerCase().indexOf(q) >= 0 || wd.example.toLowerCase().indexOf(q) >= 0 ||
            T(wd.example_mean).toLowerCase().indexOf(q) >= 0 ||
            (wd.alt_order_word ? wd.alt_order_word.toLowerCase().indexOf(q) >= 0 : false);
        });
        if (!q) return fam;
        if (T(fam.final).toLowerCase().indexOf(q) >= 0) return fam;
        return words.length ? Object.assign({}, fam, { words: words }) : null;
      }).filter(Boolean);
      if (!families.length) return null;
      return Object.assign({}, g, { families: families });
    }).filter(Boolean);

    if (!groups.length) { root.innerHTML = vocabFocusBannerHtml("rhyme") + '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>'; bindVocabFocusClear(root); return; }

    var openAll = !!q || (vocabFocus && vocabFocus.mode === "rhyme");
    var html = vocabFocusBannerHtml("rhyme") + '<div class="chain-note">' + TU("베트남어 한자어 음절을 받침(끝소리)별로 묶고, 그 받침이 한국 한자음의 어떤 받침과 대응하는지 보여줘요. 안에서 다시 모음별(운) 그룹으로 나누어, 하나의 기본 단어에서 여러 파생 단어의 한국 한자음을 함께 익힐 수 있어요.") + '</div>';
    groups.forEach(function (g, gi) {
      html += '<div class="group-card" data-open="' + openAll + '" data-syl="rhyme' + gi + '">' +
        '<button class="group-head"><span><span class="syl">' + escapeHtml(T(g.final_class)) + '</span></span>' +
        '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
        '<div class="group-body">';
      html += '<div class="rhyme-class-note">' + escapeHtml(T(g.note)) + '</div>';
      g.families.forEach(function (fam) {
        html += '<div class="rhyme-family">';
        var famReadTexts = [];
        fam.words.forEach(function (wd) {
          if (currentLang === "zh") {
            famReadTexts.push([wd.word, wd.hanja], [wd.example, trailingParenHanja(wd.example_kr) || T(wd.example_mean)]);
          } else {
            famReadTexts.push([wd.word, T(wd.gloss)], [wd.example, T(wd.example_mean)]);
          }
        });
        html += '<div class="rhyme-family-head"><span class="rhyme-final' + (typeof fam.final === "string" ? ' vn' : '') + '">' + escapeHtml(T(fam.final)) + '</span>' +
          readAllButtonHtml(famReadTexts) + '</div>';
        if (fam.kr_note) html += '<div class="rhyme-family-note">' + escapeHtml(T(fam.kr_note)) + '</div>';
        html += '<div class="rhyme-word-list">';
        fam.words.forEach(function (wd) {
          // Chinese mode: the hanja itself already IS the answer for a Chinese-literate reader,
          // so the "→ bopomofo pinyin(gloss)" trailer (e.g. "→ ㄐㄧㄚ jiā(家)") is redundant --
          // keep only the hanja there. Other languages still show the full breakdown.
          var rwTrailer = currentLang === "zh" ? "" :
            '<span class="rw-kr">→ ' + escapeHtml(rwKrText(wd)) + '</span>' +
            '<span class="rw-gloss">(' + escapeHtml(T(wd.gloss)) + ')</span>';
          html += '<div class="rhyme-word-row">' +
            '<div class="rhyme-word-main"><span class="rw-word vn">' + escapeHtml(wd.word) + '</span>' +
            '<button class="speak-btn" data-speak="' + escapeAttr(wd.word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '<span class="rw-hanja">' + escapeHtml(wd.hanja) + '</span>' +
            rwTrailer + '</div>' +
            '<div class="rhyme-word-ex"><span class="vn">' + escapeHtml(wd.example) + '</span>' +
            (wd.word_order_reversed ? '<span class="rw-order-flag">' + TU("[어순반대]") + '</span>' : '') +
            '<button class="speak-btn" data-speak="' + escapeAttr(wd.example) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '<span class="rw-ex-kr">' + (currentLang === "ko" ? escapeHtml(wd.example_kr) + ' — ' : '') + escapeHtml(T(wd.example_mean)) +
            (wd.alt_order_word ? ' (' + escapeHtml(altOrderNoteText(wd.alt_order_word)) + ')' : '') + '</span></div></div>';
        });
        html += '</div></div>';
      });
      html += '</div></div>';
    });
    root.innerHTML = html;
    root.querySelectorAll(".group-card").forEach(function (card) {
      card.querySelector(".group-head").addEventListener("click", function () {
        card.dataset.open = card.dataset.open === "true" ? "false" : "true";
      });
    });
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); speak(b.dataset.speak); }); });
    bindVocabFocusClear(root);
  }

  // Vietnamese-tone <-> Mandarin-tone correspondence, computed ahead of time in rhyme_data.py
  // (TONE_ZH_CORR) from the full 한자음 vocabulary corpus. Lives under 발음 탭 > 성조 탭 (rendered
  // by renderPron() below) rather than the 어휘 탭 > 한자음 탭 it was originally added under,
  // since it's fundamentally a tone-pronunciation reference, not a per-word vocab entry. Each of
  // the 9 categories is its own collapsible .group-card (same pattern as the 성조 조합 연습
  // groups just above it in that same subtab) so the long word lists don't have to all be open
  // at once.
  function renderToneZhCorr() {
    if (typeof TONE_ZH_CORR === "undefined" || !TONE_ZH_CORR.length) return "";
    var html = '<div class="p-section"><h3>' + TU("베트남어 성조 ↔ 중국어(표준중국어) 성조 대응") + '</h3>' +
      '<p class="p-desc">' + TU("위의 한자음 전체 어휘에서, 베트남어 성조와 그에 대응하는 한자의 표준중국어(보통화) 성조 조합을 추출해 분류했어요. 같은 베트남어 성조라도 한자의 옛 중국어 성모(자음의 청탁)에 따라 표준중국어 성조가 갈리는 경우가 있어요.") + '</p>';
    TONE_ZH_CORR.forEach(function (cat, ci) {
      var sortedWords = viSort(cat.words, function (wd) { return wd.word; });
      html += '<div class="group-card" data-open="false" data-tonezh="' + ci + '">' +
        '<div class="group-head-row"><button class="group-head"><span><span class="syl">' + escapeHtml(toneNameWithVi(cat.vn_tone)) + ' ↔ ' + escapeHtml(T(cat.zh_tone_label)) + '</span>' +
        '<span class="rhyme-family-note" style="margin-left:8px">(' + cat.words.length + TU("개") + ')</span></span>' +
        '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
        readAllButtonHtml(sortedWords.map(function (wd) { return [wd.word, T(wd.gloss)]; })) + '</div>' +
        '<div class="group-body">';
      if (!cat.words.length) {
        html += '<div class="rhyme-family-note">' + TU("이 어휘 목록에는 해당하는 사례가 아직 없어요.") + '</div>';
      } else {
        html += '<div class="rhyme-word-list">';
        sortedWords.forEach(function (wd) {
          html += '<div class="rhyme-word-row">' +
            '<div class="rhyme-word-main"><span class="rw-word vn">' + escapeHtml(wd.word) + '</span>' +
            '<button class="speak-btn" data-speak="' + escapeAttr(wd.word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '<span class="rw-hanja">' + escapeHtml(wd.hanja) + '</span>' +
            '<span class="rw-kr">→ ' + escapeHtml(rwKrText(wd)) + '</span>' +
            '<span class="rw-gloss">(' + escapeHtml(T(wd.gloss)) + ')</span></div></div>';
        });
        html += '</div>';
      }
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  }

  /* ================= BIBLE BOOKS & NUMBERS (성경 / 숫자 하위 탭) ================= */
  var bibleSearchEl = document.getElementById("bible-search");
  if (bibleSearchEl) bibleSearchEl.addEventListener("input", renderBibleBooks);

  function formatNum(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function bibleBookRow(bk) {
    return '<div class="bible-item"><div class="bible-body">' +
      '<div class="bible-word vn big-letters">' + escapeHtml(bk.vi) + '</div>' +
      '<div class="bible-mean">' + escapeHtml(T(bk.kr)) + '</div></div>' +
      '<button class="speak-btn" data-speak="' + escapeAttr(bk.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
  }

  function numRow(it) {
    return '<div class="num-row"><div class="num-figure tabular">' + formatNum(it.num) + '</div>' +
      '<div class="num-body"><div class="num-reading vn big-letters">' + escapeHtml(it.reading) + '</div>' +
      (it.note ? '<div class="num-note">' + escapeHtml(T(it.note)) + '</div>' : '') + '</div>' +
      '<button class="speak-btn" data-speak="' + escapeAttr(it.reading) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
  }

  function renderBibleBooks() {
    var root = document.getElementById("bible-root");
    if (!root) return;
    var q = (bibleSearchEl ? bibleSearchEl.value : "").trim().toLowerCase();
    var ot = BIBLE_OT.filter(function (bk) { return !q || bk.vi.toLowerCase().indexOf(q) >= 0 || T(bk.kr).indexOf(q) >= 0; });
    var nt = BIBLE_NT.filter(function (bk) { return !q || bk.vi.toLowerCase().indexOf(q) >= 0 || T(bk.kr).indexOf(q) >= 0; });

    var html = "";
    if (!q || ot.length || nt.length) {
      html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("구약 (39권)") + '</h3>' + readAllButtonHtml(ot.map(function (bk) { return [bk.vi, T(bk.kr)]; })) + '</div><div class="theo-list">';
      ot.forEach(function (bk) { html += bibleBookRow(bk); });
      html += '</div></div>';
      html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("신약 (27권)") + '</h3>' + readAllButtonHtml(nt.map(function (bk) { return [bk.vi, T(bk.kr)]; })) + '</div><div class="theo-list">';
      nt.forEach(function (bk) { html += bibleBookRow(bk); });
      html += '</div></div>';
    }
    if (!ot.length && !nt.length && q) {
      html += '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    }

    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
  }
  renderBibleBooks();

  function renderBibleNumbers() {
    var root = document.getElementById("bible-numbers-root");
    if (!root) return;
    var html = "";
    html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("숫자 읽기 — 1~10") + '</h3>' + readAllButtonHtml(NUM_BASIC.map(function (it) { return it.reading; })) + '</div><div class="num-table">';
    NUM_BASIC.forEach(function (it) { html += numRow(it); });
    html += '</div></div>';

    html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("숫자 읽기 — 11~19") + '</h3>' + readAllButtonHtml(NUM_TEEN.map(function (it) { return it.reading; })) + '</div><div class="num-table">';
    NUM_TEEN.forEach(function (it) { html += numRow(it); });
    html += '</div></div>';

    html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("숫자 읽기 — 20~100") + '</h3>' + readAllButtonHtml(NUM_TENS.map(function (it) { return it.reading; })) + '</div><p class="p-desc">' + escapeHtml(T(NUM_TENS_NOTE)) + '</p><div class="num-table">';
    NUM_TENS.forEach(function (it) { html += numRow(it); });
    html += '</div></div>';

    html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("숫자 읽기 — 200~900") + '</h3>' + readAllButtonHtml(NUM_HUNDREDS.map(function (it) { return it.reading; })) + '</div><div class="num-table">';
    NUM_HUNDREDS.forEach(function (it) { html += numRow(it); });
    html += '</div></div>';

    html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("숫자 읽기 — 1,000 ~ 10억") + '</h3>' + readAllButtonHtml(NUM_LARGE.concat(NUM_SPECIAL).map(function (it) { return it.reading; })) + '</div><div class="num-table">';
    NUM_LARGE.forEach(function (it) { html += numRow(it); });
    NUM_SPECIAL.forEach(function (it) { html += numRow(it); });
    html += '</div></div>';

    html += '<div class="p-section"><h3>' + TU("숫자 표기법 — 마침표와 쉼표") + '</h3><p class="p-desc">' + escapeHtml(T(NUM_FORMAT_NOTE)) + '</p><div class="num-table">' +
      '<div class="num-row"><div class="num-figure tabular">' + escapeHtml(NUM_DECIMAL_EXAMPLE.display) + ' <span style="font-weight:600;color:var(--ink-faint);font-size:0.72rem">(' + escapeHtml(T(NUM_DECIMAL_EXAMPLE.label)) + ')</span></div>' +
      '<div class="num-body"><div class="num-reading vn big-letters">' + escapeHtml(NUM_DECIMAL_EXAMPLE.reading) + '</div>' +
      '<div class="num-note">' + escapeHtml(T(NUM_DECIMAL_EXAMPLE.note)) + '</div></div>' +
      '<button class="speak-btn" data-speak="' + escapeAttr(NUM_DECIMAL_EXAMPLE.reading) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
      '</div></div>';

    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
  }
  renderBibleNumbers();

  function calList(root, title, items) {
    var html = '<div class="p-section"><div class="p-section-head"><h3>' + escapeHtml(title) + '</h3>' + readAllButtonHtml(items.map(function (it) { return [it.vi, T(it.kr)]; })) + '</div><div class="theo-list">';
    items.forEach(function (it) {
      html += '<div class="bible-item"><div class="bible-body"><div class="bible-word vn big-letters">' + escapeHtml(it.vi) + '</div>' +
        '<div class="bible-mean">' + escapeHtml(T(it.kr)) + '</div>' +
        (it.alt && it.alt.length ? '<div class="bible-alt">= ' + it.alt.map(function (a) { return escapeHtml(a); }).join(' = ') + '</div>' : '') +
        '</div>' +
        '<button class="speak-btn" data-speak="' + escapeAttr(it.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
    });
    html += '</div></div>';
    return html;
  }

  function renderBibleTime() {
    var root = document.getElementById("bible-time-root");
    if (!root) return;
    var html = '<div class="p-section"><p class="p-desc">' + escapeHtml(T(TIME_ORDER_NOTE)) + '</p></div>';
    html += calList(root, TU("시"), TIME_HOURS);
    html += '<div class="p-section"><p class="p-desc">' + escapeHtml(T(TIME_RUOI_KEM_NOTE)) + '</p></div>';
    html += calList(root, TU("시간대"), TIME_PERIODS);
    html += calList(root, TU("시간 표현 예시"), TIME_EXAMPLES);
    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
  }
  renderBibleTime();

  function renderBibleDays() {
    var root = document.getElementById("bible-days-root");
    if (!root) return;
    var html = '<div class="p-section"><p class="p-desc">' + escapeHtml(T(CAL_DATE_ORDER_NOTE)) + '</p></div>';
    html += calList(root, TU("요일"), CAL_DAYS);
    html += '<div class="p-section"><p class="p-desc">' + escapeHtml(T(CAL_DATE_MONG_NOTE)) + '</p></div>';
    html += calList(root, TU("날짜"), CAL_DATES);
    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
  }
  renderBibleDays();

  function renderBibleMonths() {
    var root = document.getElementById("bible-months-root");
    if (!root) return;
    var html = calList(root, TU("월 (달)"), CAL_MONTHS);
    html += '<div class="p-section"><h3>' + TU("연도 읽는 법 — lẻ와 không trăm") + '</h3><p class="p-desc">' + escapeHtml(T(CAL_YEAR_LE_NOTE)) + '</p></div>';
    html += calList(root, TU("계절"), CAL_SEASONS);
    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
  }
  renderBibleMonths();

  (function () {
    var subBtns = document.querySelectorAll('.subtab-btn[data-bible]');
    var panes = {
      books: document.getElementById("bible-books-pane"),
      numbers: document.getElementById("bible-numbers-pane"),
      time: document.getElementById("bible-time-pane"),
      days: document.getElementById("bible-days-pane"),
      months: document.getElementById("bible-months-pane")
    };
    if (!subBtns.length) return;
    subBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        subBtns.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");
        Object.keys(panes).forEach(function (key) {
          if (panes[key]) panes[key].style.display = (key === btn.dataset.bible) ? "" : "none";
        });
      });
    });
  })();

  /* ================= GRAMMAR & COMPOSITION ================= */
  function renderGrammar() {
    var introRoot = document.getElementById("grammar-intro-root");
    var unitsRoot = document.getElementById("grammar-units-root");
    if (!introRoot || !unitsRoot) return;

    function alignedRow(pairs) {
      var html = '<div class="gr-align-row">';
      pairs.forEach(function (p) {
        html += '<div class="gr-align-col"><div class="gr-align-vi vn">' + escapeHtml(p[0]) + '</div>' +
          '<div class="gr-align-kr">' + escapeHtml(T(p[1])) + '</div></div>';
      });
      html += '</div>';
      return html;
    }

    var introHtml = '<div class="gr-intro-list">';
    GRAMMAR_INTRO.forEach(function (sec) {
      introHtml += '<div class="gr-intro-card"><div class="gr-intro-title" style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap"><span>' + escapeHtml(T(sec.title)) + '</span>' +
        readAllButtonHtml(sec.examples.map(function (ex) { return [ex.vi, T(ex.kr)]; })) + '</div>' +
        '<div class="gr-intro-desc">' + escapeHtml(T(sec.desc)) + '</div>';
      sec.examples.forEach(function (ex) {
        introHtml += '<div class="gr-ex">' +
          '<div class="gr-ex-row"><span class="gr-ex-kr">' + escapeHtml(T(ex.kr)) +
          '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(T(ex.kr)) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(ex.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          alignedRow(ex.pairs) +
          (ex.note ? '<div class="gr-ex-note">' + escapeHtml(T(ex.note)) + '</div>' : '') +
          '</div>';
      });
      introHtml += '</div>';
    });
    introHtml += '</div>';
    introRoot.innerHTML = introHtml;

    var unitsHtml = '<div class="gr-unit-list">';
    GRAMMAR_UNITS.forEach(function (u, ui) {
      unitsHtml += '<div class="group-card" data-open="' + (ui === 0 ? "true" : "false") + '" data-syl="gru' + ui + '">' +
        '<div class="group-head-row"><button class="group-head"><span><span class="syl">' + escapeHtml(T(u.title)) + '</span></span>' +
        '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
        readAllButtonHtml(u.steps.map(function (s) { return [s.vi, T(s.kr)]; })) + '</div>' +
        '<div class="group-body">';
      unitsHtml += '<div class="gr-unit-note">' + escapeHtml(T(u.note)) + '</div><div class="gr-step-list">';
      u.steps.forEach(function (s) {
        unitsHtml += '<div class="gr-step">' +
          '<div class="gr-step-head">' + alignedRow(s.pairs) +
          '<button class="speak-btn" data-speak="' + escapeAttr(s.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          (s.kr ? '<div class="gr-step-kr"><span>' + escapeHtml(T(s.kr)) + '</span>' +
            '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(T(s.kr)) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '</div>' : '') + '</div>';
      });
      unitsHtml += '</div></div></div>';
    });
    unitsHtml += '</div>';
    unitsRoot.innerHTML = unitsHtml;

    var a1a2Root = document.getElementById("grammar-a1a2-root");
    if (a1a2Root && typeof GRAMMAR_A1_A2_PATTERNS !== "undefined" && GRAMMAR_A1_A2_PATTERNS.length) {
      var a1a2Html = '<div class="gr-a1a2-section"><div class="p-section-head"><h3>' + TU("기초 핵심 문형 (A1/A2)") + '</h3></div>';
      a1a2Html += '<div class="gr-a1a2-list">';
      GRAMMAR_A1_A2_PATTERNS.forEach(function (pat, pi) {
        a1a2Html += '<div class="group-card" data-open="false" data-syl="gra1a2_' + pi + '">' +
          '<div class="group-head-row"><button class="group-head"><span><span class="syl vn font-bold">' + escapeHtml(pat.pattern) + '</span> <span class="badge">' + escapeHtml(pat.level) + '</span> - ' + escapeHtml(pat.meaningKo) + '</span>' +
          '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
          readAllButtonHtml(pat.examples.map(function (ex) { return [ex.vi, ex.ko]; })) + '</div>' +
          '<div class="group-body"><div class="gr-step-list">';
        pat.examples.forEach(function (ex) {
          a1a2Html += '<div class="gr-step">' +
            '<div class="gr-step-head"><div class="gr-align-vi vn">' + escapeHtml(ex.vi) + '</div>' +
            '<button class="speak-btn" data-speak="' + escapeAttr(ex.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
            '<div class="gr-step-kr"><span>' + escapeHtml(ex.ko) + '</span>' +
            '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(ex.ko) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '</div></div>';
        });
        if (pat.source) {
          a1a2Html += '<div class="culture-source" style="margin-top:6px;font-size:0.78rem;color:var(--ink-muted);">' + escapeHtml(pat.source.file) + ' p.' + pat.source.page + '</div>';
        }
        if (typeof JW_EXTRACTION_DATA !== "undefined" && JW_EXTRACTION_DATA && JW_EXTRACTION_DATA.grammarExamples) {
          var jwExs = JW_EXTRACTION_DATA.grammarExamples[pat.pattern] || (pat.id && JW_EXTRACTION_DATA.grammarExamples[pat.id]);
          if (jwExs && jwExs.length) {
            a1a2Html += '<div class="jw-grammar-ex-section"><div class="jw-grammar-ex-title">' +
              '<span class="source-pill source-pill-wt">JW</span> ' + TU("실제 출처 예문") + ' (' + jwExs.length + ')' +
              '</div>';
            jwExs.slice(0, 3).forEach(function (jwe) {
              var trText = jwe.translations ? (jwe.translations[currentLang] || jwe.translations.ko || jwe.translations.en || '') : '';
              var srcLabel = jwe.sourceLabel || jwe.sourceType || '';
              a1a2Html += '<div class="jw-grammar-ex-row">' +
                '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">' +
                '<span class="jw-grammar-ex-vi vn font-bold">' + escapeHtml(jwe.vi) + '</span>' +
                '<span class="source-pill" style="font-size:0.65rem;">' + escapeHtml(srcLabel) + '</span>' +
                '</div>' +
                (trText ? '<div class="jw-grammar-ex-trans">' + escapeHtml(trText) + '</div>' : '') +
                '</div>';
            });
            a1a2Html += '</div>';
          }
        }
        a1a2Html += '</div></div></div>';
      });
      a1a2Html += '</div></div>';
      a1a2Root.innerHTML = a1a2Html;
    }

    // Scoped to introRoot/unitsRoot/a1a2Root specifically (not the whole #panel-grammar panel), since
    // renderGrammar() re-runs on every language switch (see onLangChange registration below) --
    // a broader #panel-grammar query would re-bind duplicate listeners onto the 특강/범용 언어
    // 생성표/문장 생성기 subtabs' own elements, which live in the same panel but are rendered
    // (and listener-bound) by their own functions.
    [introRoot, unitsRoot, a1a2Root].forEach(function (scopeEl) {
      if (!scopeEl) return;
      scopeEl.querySelectorAll(".group-card").forEach(function (card) {
        card.querySelector(".group-head").addEventListener("click", function () {
          card.dataset.open = card.dataset.open === "true" ? "false" : "true";
        });
      });
      scopeEl.querySelectorAll(".speak-btn").forEach(function (b) {
        b.addEventListener("click", function (e) {
          e.stopPropagation();
          if (b.dataset.speakMeaning) speakMeaning(b.dataset.speakMeaning);
          else speak(b.dataset.speak);
        });
      });
    });
  }
  renderGrammar();

  /* ================= PRONUNCIATION ================= */
  // Stable pane element references, built once. Both the re-runnable content-builder
  // (renderPron, re-registered on language switch) and the one-time subtab-button click
  // wiring below need long-term access to the same DOM nodes -- renderPron rebuilds a
  // fresh HTML-string map on every call, so button wiring reads visibility off this
  // stable object instead.
  var PRON_PANE_ELS = {
    settings: document.getElementById("pron-settings-pane"),
    jamo: document.getElementById("pron-jamo-pane"),
    tones: document.getElementById("pron-tones-pane"),
    nsdiff: document.getElementById("pron-nsdiff-pane")
  };
  function renderPron() {
    if (!PRON_PANE_ELS.settings) return;

    /* -- 설정 (own subtab): voice picker + per-device TTS 설치 안내 -- */
    function ttsCard(id, title, bodyHtml) {
      return '<div class="group-card" data-open="false" data-tts="' + id + '">' +
        '<button class="group-head"><span class="syl">' + escapeHtml(title) + '</span>' +
        '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
        '<div class="group-body tts-guide-section">' + bodyHtml + '</div></div>';
    }

    var iosBody = TU(
      '<p class="p-desc">iOS/iPadOS의 내장 기능을 사용하면 별도의 앱 설치 없이 베트남어 텍스트를 읽게 할 수 있어요.</p>' +
      '<h4>1단계: 베트남어 TTS 음성 다운로드하기</h4>' +
      '<ol>' +
      '<li>설정 앱을 엽니다.</li>' +
      '<li><b>손쉬운 사용</b> 메뉴로 이동합니다.</li>' +
      '<li><b>읽기 및 말하기</b>(또는 iOS 버전에 따라 <b>콘텐츠 말하기</b>)를 선택합니다.</li>' +
      '<li><b>음성</b>을 탭합니다.</li>' +
      '<li>스크롤을 내려 <b>베트남어</b>를 선택합니다.</li>' +
      '<li>원하는 목소리(예: Linh) 옆의 구름 모양(다운로드) 아이콘을 눌러 음성 데이터를 다운로드합니다. ‘고품질’ 버전을 다운로드하면 훨씬 자연스러운 AI 음성으로 들을 수 있어요.</li>' +
      '</ol>' +
      '<h4>2단계: 화면의 베트남어 텍스트 읽히기 (사용 방법)</h4>' +
      '<p class="p-desc">다운로드가 완료되면 다음 두 가지 방법으로 베트남어를 읽게 만들 수 있어요. 동일하게 설정 &gt; 손쉬운 사용 &gt; 콘텐츠 말하기 메뉴에서 활성화할 수 있습니다.</p>' +
      '<h4>방법 A: 선택 항목 말하기 (추천)</h4>' +
      '<ol>' +
      '<li>설정 방법: ‘선택 항목 말하기’ 기능을 켭니다.</li>' +
      '<li>사용 방법: 웹서핑이나 텍스트 앱에서 베트남어 단어·문장을 길게 눌러 블록을 지정한 후, 팝업 메뉴에서 ‘말하기’를 누르면 베트남어로 읽어줘요.</li>' +
      '</ol>' +
      '<h4>방법 B: 화면 말하기</h4>' +
      '<ol>' +
      '<li>설정 방법: ‘화면 말하기’ 기능을 켭니다.</li>' +
      '<li>사용 방법: 베트남어로 된 뉴스나 전자책 화면에서 두 손가락으로 화면 상단에서 아래로 쓸어내리면 화면 전체의 텍스트를 자동으로 인식해 처음부터 끝까지 읽어줘요.</li>' +
      '</ol>');

    var androidBody = TU(
      '<h4>1. Google 음성 엔진에서 베트남어 추가 (공통)</h4>' +
      '<p class="p-desc">대부분의 안드로이드 기기에 내장된 구글 엔진에 베트남어 음성 팩을 다운로드하는 방법이에요.</p>' +
      '<ol>' +
      '<li>스마트폰 <b>설정</b> 앱을 엽니다.</li>' +
      '<li><b>접근성</b> ➡️ <b>텍스트 음성 변환 출력</b>(또는 ‘글자 읽어주기’) 메뉴로 이동합니다.</li>' +
      '<li>기본 엔진이 <b>Google 음성 인식 및 합성</b>(또는 Speech Services by Google)으로 선택되어 있는지 확인합니다.</li>' +
      '<li>기본 엔진 옆에 있는 <b>설정(톱니바퀴 아이콘)</b>을 누릅니다.</li>' +
      '<li><b>음성 데이터 설치</b>를 선택합니다.</li>' +
      '<li>목록에서 <b>베트남어</b>(또는 Vietnamese)를 찾아 다운로드 버튼을 누릅니다.</li>' +
      '<li>다운로드가 완료되면 뒤로 돌아와 <b>언어</b>를 <b>베트남어</b>로 지정합니다.</li>' +
      '</ol>' +
      '<h4>2. 삼성 갤럭시 기기에서 베트남어 추가</h4>' +
      '<p class="p-desc">삼성 갤럭시 스마트폰을 사용 중이라면 삼성 전용 고품질 베트남어 TTS를 추가할 수 있어요.</p>' +
      '<ol>' +
      '<li>스마트폰 <b>설정</b> 앱을 엽니다.</li>' +
      '<li><b>일반</b> ➡️ <b>글자 읽어주기</b>(또는 텍스트 음성 변환) 메뉴로 이동합니다.</li>' +
      '<li>기본 엔진을 <b>삼성 TTS 엔진</b>으로 설정합니다.</li>' +
      '<li>엔진 옆의 <b>설정(톱니바퀴 아이콘)</b>을 누릅니다.</li>' +
      '<li><b>음성 데이터 설치</b>를 누르고 목록에서 <b>베트남어</b>를 찾아 다운로드합니다.</li>' +
      '</ol>' +
      '<div class="tts-tip">※ 갤럭시 스토어에서 직접 Samsung TTS Vietnamese Voice 팩을 검색해 설치할 수도 있어요.</div>');

    var macBody = TU(
      '<p class="p-desc">별도의 프로그램 설치 없이 Mac 시스템 설정에서 바로 다운로드할 수 있어요.</p>' +
      '<h4>1단계: 베트남어 TTS 음성 추가하기</h4>' +
      '<ol>' +
      '<li>Mac 화면 왼쪽 상단의 Apple 메뉴( ) &gt; <b>시스템 설정</b>을 선택합니다.</li>' +
      '<li>사이드바에서 <b>손쉬운 사용</b>을 클릭한 뒤, <b>읽기 및 말하기</b>(또는 macOS 버전에 따라 <b>콘텐츠 말하기</b>)를 선택합니다.</li>' +
      '<li>‘시스템 음성’ 오른쪽에 있는 ⓘ(정보) 버튼 또는 팝업 메뉴를 클릭합니다.</li>' +
      '<li>왼쪽 언어 목록에서 <b>베트남어(Vietnamese)</b>를 찾아 선택합니다.</li>' +
      '<li>원하는 음성(예: Linh 등) 옆의 구름 모양 다운로드 아이콘을 클릭하여 설치합니다.</li>' +
      '<li>다운로드가 완료되면 <b>완료</b>(또는 승인)를 누릅니다.</li>' +
      '</ol>' +
      '<h4>2단계: 시스템 말하기 언어 변경하기</h4>' +
      '<ol>' +
      '<li>‘읽기 및 말하기’ 설정 화면으로 돌아와 ‘시스템 말하기 언어’ 팝업 메뉴를 베트남어로 변경합니다.</li>' +
      '<li>‘시스템 음성’ 메뉴에서 방금 다운로드한 베트남어 음성을 지정합니다.</li>' +
      '<li>아래의 ‘선택 항목 말하기’ 토글을 켜서 활성화합니다.</li>' +
      '</ol>' +
      '<h4>3단계: 단축키로 베트남어 텍스트 읽기</h4>' +
      '<ol>' +
      '<li>웹페이지나 문서에서 베트남어 텍스트를 마우스로 드래그하여 블록 지정(선택)합니다.</li>' +
      '<li>키보드 단축키인 <b>Option + Esc</b>를 동시에 누르면 선택한 베트남어가 원어민 발음으로 재생돼요. (중단하고 싶을 때 다시 누르면 멈춰요.)</li>' +
      '</ol>');

    var winBody = TU(
      '<h4>⚙️ Windows 11에서 베트남어 TTS 추가하기</h4>' +
      '<ol>' +
      '<li>설정 열기: 키보드에서 <b>Win + I</b> 단축키를 누릅니다.</li>' +
      '<li>음성 메뉴 이동: 왼쪽 메뉴에서 <b>시간 및 언어</b> ➔ 오른쪽에서 <b>음성</b>을 클릭합니다.</li>' +
      '<li>음성 추가: ‘음성 관리’ 항목에 있는 <b>음성 추가</b> 버튼을 누릅니다.</li>' +
      '<li>베트남어 설치: 검색창에 베트남어를 검색해 선택한 후, <b>추가</b>(또는 설치) 버튼을 누르면 다운로드가 시작돼요.</li>' +
      '<li>기본 음성 설정: 다운로드가 끝나면 상단의 ‘음성 선택’ 드롭다운 메뉴에서 설치된 베트남어 음성을 기본값으로 지정할 수 있어요.</li>' +
      '</ol>' +
      '<h4>⚙️ 접근성 &gt; 내레이터에서 고급 음성 데이터 추가하기 (대안)</h4>' +
      '<p class="p-desc">위 방법으로 원하는 음성이 안 보이거나 더 다양한 고급 음성을 설치하고 싶다면, 내레이터 메뉴를 통해서도 같은 음성 데이터를 추가할 수 있어요. 여기서 설치한 음성도 이 화면을 포함해 컴퓨터의 다른 프로그램에서 똑같이 사용할 수 있습니다.</p>' +
      '<ol>' +
      '<li>설정 열기: <b>Win + I</b> 단축키를 누릅니다.</li>' +
      '<li>왼쪽 메뉴에서 <b>접근성</b>을 클릭합니다.</li>' +
      '<li>오른쪽 목록에서 <b>내레이터</b>를 클릭합니다.</li>' +
      '<li>‘내레이터 음성’ 항목에서 <b>음성 추가</b> 버튼을 누릅니다.</li>' +
      '<li><b>추가</b> 버튼을 누른 뒤, 목록에서 원하는 언어(예: 베트남어)를 선택합니다.</li>' +
      '<li>해당 언어로 다운로드할 수 있는 음성 목록이 뜨면 원하는 음성을 선택하고 <b>다운로드 및 설치</b> 버튼을 누릅니다.</li>' +
      '<li>설치가 끝나면 상단의 ‘음성 선택’ 드롭다운 메뉴에서 방금 설치한 음성을 기본값으로 지정할 수 있어요.</li>' +
      '</ol>' +
      '<h4>⚙️ Windows 10에서 베트남어 TTS 추가하기</h4>' +
      '<ol>' +
      '<li>설정 열기: <b>Win + I</b> 단축키를 누릅니다.</li>' +
      '<li>언어 메뉴 이동: <b>시간 및 언어</b> ➔ 왼쪽의 <b>지역 및 언어</b>(또는 언어) 메뉴를 클릭합니다.</li>' +
      '<li>기본 설정 언어 추가: ‘기본 설정 언어’ 아래의 <b>언어 추가</b>를 클릭합니다.</li>' +
      '<li>베트남어 팩 선택: 베트남어(Tiếng Việt)를 검색하여 선택합니다. 이때 반드시 TTS 아이콘(마이크·말풍선 모양)이 포함되어 있는지 확인하고 ‘다음’을 누릅니다.</li>' +
      '<li>TTS 기능 설치: 기본 기능인 ‘텍스트 음성 변환(TTS)’이 체크된 상태로 <b>설치</b>를 누르면 완료돼요.</li>' +
      '</ol>' +
      '<h4>💡 설치 후 팁 및 확인 사항</h4>' +
      '<div class="tts-tip">설정 반영: 음성 팩 설치를 마친 후에는 사용 중이던 텍스트 리더 프로그램이나 설정 앱을 종료 후 다시 실행해야 베트남어 음성이 정상적으로 표시돼요.</div>' +
      '<div class="tts-tip">간편하게 읽기 실행: 윈도우 기본 돋보기 기능(Win + +)을 켜고 Ctrl + Alt + 마우스 좌클릭을 활용하면 원하는 베트남어 텍스트를 바로 TTS 음성으로 들을 수 있어요. 다만 아쉽게도 윈도우에서 지원하는 “자연스러운 음성” 목록에는 베트남어가 없어서, 윈도우를 사용할 경우 베트남어 TTS 음성이 좀 부자연스럽게 느껴질 수 있어요.</div>');

    var settingsHtml =
      '<div class="p-section"><div id="vi-region-settings" hidden><h3>' + TU("발음 듣기 목소리") + '</h3>' +
      '<div class="p-subsection"><h4>' + TU("지금 사용할 지역") + '</h4><div id="dialect-toggle-settings"></div></div>' +
      '<div class="p-subsection"><h4>' + TU("북부") + ' ' + TU("발음 듣기 목소리") + '</h4><div id="voice-picker-north"></div></div>' +
      '<div class="p-subsection"><h4>' + TU("남부") + ' ' + TU("발음 듣기 목소리") + '</h4><div id="voice-picker-south"></div></div></div>' +
      '<div class="p-subsection"><h4>' + TU("베트남어 반복 듣기 횟수") + '</h4>' +
      '<p class="p-desc">' + TU("발음 듣기 버튼을 누르면 베트남어를 몇 번 반복해서 들려줄지 선택하세요.") + '</p>' +
      '<div id="repeat-toggle-settings"></div></div>' +
      '<div class="p-subsection" id="language-voice-settings" hidden><h4>' + TU("언어 모드") + ' TTS (' + TU("뜻·해석 읽기 목소리") + ')</h4>' +
      '<p class="p-desc">' + TU("전체 듣기에서 단어 뜻이나 문장 해석도 함께 읽어드려요. 아래에서 현재 언어 모드(한국어·中文·English·日本語)로 읽어줄 목소리를 선택하세요.") + '</p>' +
      '<div id="voice-picker-lang"></div></div></div>' +
      '<div class="p-section"><h3>' + TU("기기별 베트남어 음성(TTS) 추가 방법") + '</h3>' +
      '<p class="p-desc">' + TU("이 학습반 화면의 발음 듣기 버튼은 기기·브라우저에 이미 설치된 베트남어 음성을 사용해요. 아래 기기별 안내를 따라 베트남어 음성을 미리 설치해 두면, 이 화면뿐 아니라 휴대폰·컴퓨터의 다른 앱에서도 베트남어 텍스트를 원어민 발음으로 들을 수 있어요. 항목을 눌러 펼쳐 보세요.") + '</p>' +
      ttsCard("ios", TU("아이폰 · 아이패드 (iOS/iPadOS)"), iosBody) +
      ttsCard("android", TU("안드로이드 (Android)"), androidBody) +
      ttsCard("mac", "Mac (macOS)", macBody) +
      ttsCard("windows", "Windows", winBody) +
      '</div>';

    /* -- 베트남어 문자의 명칭 (own subtab) -- letter NAMEs (a[1], e.g. "bê", "xê") are read, not
       the bare letters themselves, both for 전체 듣기 and each cell's individual listen button. */
    function alphaNameSpeak(a) { return a[1].replace(/^\[|\]$/g, ""); }
    var alphabetHtml = '<div class="p-section"><div class="p-section-head"><h3>' + TU("베트남어 문자의 명칭") + '</h3>' +
      readAllButtonHtml(ALPHABET.map(function (a) { return alphaNameSpeak(a); })) + '</div><p class="p-desc">' + escapeHtml(T(ALPHABET_NOTE)) + ' ' + TU("글자를 눌러 발음을 들어 보세요.") + '</p><div class="alpha-grid">';
    ALPHABET.forEach(function (a) {
      alphabetHtml += '<button class="alpha-cell" data-speak="' + escapeAttr(alphaNameSpeak(a)) + '"><div class="l vn">' + a[0] + '</div><div class="p">' + a[1] + '</div></button>';
    });
    alphabetHtml += '</div></div>';

    /* -- 모음 -- each row keeps its example-word listen button, and now also gets its own
       individual listen button (reading the vowel sound itself), plus a 전체 듣기 button per
       group (단모음/복모음) that reads through every vowel in that group. */
    function vowelSpeak(r) { return r[0].split(",")[0].trim(); }
    var vowelsHtml = '<div class="p-section"><div class="p-section-head"><h3>' + TU("모음 발음 — 단모음") + '</h3>' +
      readAllButtonHtml(VOW_SIMPLE.map(vowelSpeak)) + '</div><div class="pron-table">';
    VOW_SIMPLE.forEach(function (r) { vowelsHtml += pronRow(r, true, "vowel"); });
    vowelsHtml += '</div></div>';
    vowelsHtml += '<div class="p-section"><div class="p-section-head"><h3>' + TU("모음 발음 — 복모음") + '</h3>' +
      readAllButtonHtml(VOW_COMPLEX.map(vowelSpeak)) + '</div><div class="pron-table">';
    VOW_COMPLEX.forEach(function (r) { vowelsHtml += pronRow(r, true, "vowel"); });
    vowelsHtml += '</div></div>';

    /* -- 자음 -- reads the consonant SOUND (letter + ơ, e.g. "bơ", not the letter's name), same
       개별/전체 듣기 pattern as 모음 above, plus the ơ-reading convention note. */
    function consSpeak(r) { return r[0].split(",")[0].trim() + "ơ"; }
    var consNote = '<p class="p-desc">' + TU("자음을 읽을 때는 보통 자음 뒤에 ơ 모음을 붙여서 읽습니다. (예: b → bơ)") + '</p>';
    var consHtml = consNote + '<div class="p-section"><div class="p-section-head"><h3>' + TU("자음 발음 — 단자음") + '</h3>' +
      readAllButtonHtml(CONS_SIMPLE.map(consSpeak)) + '</div><div class="pron-table">';
    CONS_SIMPLE.forEach(function (r) { consHtml += pronRow(r, true, "consonant"); });
    consHtml += '</div></div>';
    consHtml += '<div class="p-section"><div class="p-section-head"><h3>' + TU("자음 발음 — 복자음") + '</h3>' +
      readAllButtonHtml(CONS_COMPLEX.map(consSpeak)) + '</div><div class="pron-table">';
    CONS_COMPLEX.forEach(function (r) { consHtml += pronRow(r, true, "consonant"); });
    consHtml += '</div></div>';

    /* -- 성조 -- */
    var tonesHtml = '<div class="p-section"><div class="p-section-head"><h3>' + TU("성조 (6개)") + '</h3>' +
      readAllButtonHtml(TONES.map(function (t) { return t.mark; })) + '</div><p class="p-desc">' + TU("베트남어에는 음의 높낮이를 구별하는 6개의 성조가 있어요. 같은 글자라도 성조에 따라 완전히 다른 단어가 됩니다.") + '</p><div class="tone-list">';
    TONES.forEach(function (t) {
      tonesHtml += '<div class="tone-row"><div class="tone-mark"><div class="ch vn">' + t.mark + '<button class="speak-btn" data-speak="' + escapeAttr(t.mark) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div><div class="nm">' + escapeHtml(toneNameWithVi(t.kr)) + '</div></div>' +
        '<div class="tone-info"><div class="kr">' + t.name + ' · ' + escapeHtml(T(t.symbol)) + '</div><div class="d">' + escapeHtml(T(t.desc)) + '</div></div></div>';
    });
    tonesHtml += '</div></div>';
    tonesHtml += renderToneZhCorr();

    /* -- 연속 성조 연습 (36가지) -- */
    var tonePairsHtml = '<div class="p-section"><h3>' + TU("성조 조합 연습 (36가지)") + '</h3><p class="p-desc">' + TU("두 음절의 성조를 조합하면 6×6 = 36가지 경우가 나와요. 앞 음절의 성조별로 묶었으니 눌러서 열어 보고, 실생활에서 자주 쓰는 단어로 성조 조합을 듣고 연습해 보세요.") + '</p><div class="tone-pair-list">';
    for (var tpg = 0; tpg < 6; tpg++) {
      var tpGroup = TONE_PAIRS.slice(tpg * 6, tpg * 6 + 6);
      var tpHead = tpGroup[0];
      tonePairsHtml += '<div class="group-card" data-open="false" data-syl="tp' + tpg + '">' +
        '<button class="group-head"><span><span class="ch vn">' + tpHead.t1_mark + '</span> <span class="syl">' + escapeHtml(toneNameWithVi(tpHead.t1_kr)) + ' + ...</span></span>' +
        '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
        '<div class="group-body">';
      tpGroup.forEach(function (p) {
        var sortedTpWords = viSort(p.words, function (wd) { return wd.vi; });
        tonePairsHtml += '<div class="tone-pair-card">';
        tonePairsHtml += '<div class="tone-pair-head"><span class="tp-mark vn">' + p.t1_mark + ' + ' + p.t2_mark + '</span>' +
          '<span class="tp-label">' + escapeHtml(toneNameWithVi(p.t1_kr)) + ' + ' + escapeHtml(toneNameWithVi(p.t2_kr)) + '</span>' +
          readAllButtonHtml(sortedTpWords.map(function (wd) { return [wd.vi, T(wd.kr)]; })) + '</div>';
        tonePairsHtml += '<div class="tone-pair-words">';
        sortedTpWords.forEach(function (wd) {
          tonePairsHtml += '<div class="tp-word-row"><span class="tp-word vn">' + escapeHtml(wd.vi) + '</span>' +
            '<span class="tp-mean">' + escapeHtml(T(wd.kr)) + '</span>' +
            '<button class="speak-btn" data-speak="' + escapeAttr(wd.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
        });
        tonePairsHtml += '</div></div>';
      });
      tonePairsHtml += '</div></div>';
    }
    tonePairsHtml += '</div></div>';

    /* -- 남북 발음 차이 -- */
    var nsHtml = '<div class="p-section"><h3>' + TU("북부 발음과 남부 발음의 차이") + '</h3><p class="p-desc">' + TU("같은 글자라도 지역에 따라 소리가 달라지는 대표적인 5가지 경우예요. 북부(하노이)와 남부(호찌민)를 비교해 보세요.") + '</p><div class="ns-list">';
    NS_DIFFS.forEach(function (d) {
      nsHtml += '<div class="ns-card"><div class="ns-title vn">' + escapeHtml(T(d.title)) + '</div>';
      nsHtml += '<div class="ns-row"><span class="ns-tag north">' + TU("북부") + '</span><span class="ns-desc">' + escapeHtml(T(d.north)) + '</span></div>';
      nsHtml += '<div class="ns-row"><span class="ns-tag south">' + TU("남부") + '</span><span class="ns-desc">' + escapeHtml(T(d.south)) + '</span></div>';
      nsHtml += '<div class="ns-examples">';
      d.examples.forEach(function (ex) {
        // ex.north/ex.south are literal Korean-Hangul-based phonetic notations (e.g. "자[za]"),
        // a reading aid meaningful only to Korean-script readers -- shown only in Korean.
        nsHtml += '<div class="ns-ex-row"><span class="ns-ex-word vn">' + escapeHtml(ex.word) + '</span><span class="ns-ex-mean">' + escapeHtml(T(ex.mean)) + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(ex.word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          (currentLang === "ko" ? '<span class="ns-ex-pair"><span class="ns-ex-n">' + escapeHtml(ex.north) + '</span><span class="ns-ex-s">' + escapeHtml(ex.south) + '</span></span>' : '') +
          '</div>';
      });
      nsHtml += '</div></div>';
    });
    nsHtml += '</div><p class="p-desc ns-note">' + escapeHtml(T(NS_NOTE)) + '</p>';
    NS_EXTRA_NOTES.forEach(function (note) {
      nsHtml += '<p class="p-desc ns-note">' + escapeHtml(T(note)) + '</p>';
    });
    nsHtml += '</div>';

    function groupSection(id, title, contentHtml, openDefault) {
      return '<div class="group-card" data-open="' + (openDefault ? "true" : "false") + '" data-pron-section="' + id + '" data-anchor="pron-' + id + '">' +
        '<div class="group-head-row"><button class="group-head"><span><span class="syl">' + escapeHtml(title) + '</span></span>' +
        '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button></div>' +
        '<div class="group-body">' + contentHtml + '</div></div>';
    }

    var jamoHtml = '<div class="p-section">' +
      groupSection("alphabet", TU("문자"), alphabetHtml, true) +
      groupSection("vowels", TU("모음"), vowelsHtml, false) +
      groupSection("consonants", TU("자음"), consHtml, false) +
      '</div>';

    var tonesCombinedHtml = '<div class="p-section">' +
      groupSection("tones", TU("성조"), tonesHtml, true) +
      groupSection("tonepairs", TU("연속 성조"), tonePairsHtml, false) +
      '</div>';

    var PRON_PANES_HTML = {
      settings: settingsHtml,
      jamo: jamoHtml,
      tones: tonesCombinedHtml,
      nsdiff: nsHtml
    };
    Object.keys(PRON_PANE_ELS).forEach(function (key) {
      var el = PRON_PANE_ELS[key];
      if (!el) return;
      el.innerHTML = PRON_PANES_HTML[key];
      el.querySelectorAll(".group-card").forEach(function (card) {
        var headBtn = card.querySelector(".group-head");
        if (headBtn) {
          headBtn.addEventListener("click", function () {
            card.dataset.open = card.dataset.open === "true" ? "false" : "true";
          });
        }
      });
      el.querySelectorAll("[data-speak]").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); speak(b.dataset.speak); }); });
    });
    renderVoicePicker();
    renderLangVoicePicker();
    renderAllViRepeatToggles();
    renderCurrGuide();
  }
  renderPron();

  // One-time setup: subtab-button click wiring must NOT be re-run on language switch (that
  // would stack duplicate click handlers on the same buttons each time). It reads visibility
  // off PRON_PANE_ELS -- the stable element references built once above -- so it keeps working
  // correctly no matter how many times renderPron() itself re-renders.
  document.querySelectorAll(".subtab-btn[data-pron]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".subtab-btn[data-pron]").forEach(function (b) { b.setAttribute("aria-selected", "false"); });
      btn.setAttribute("aria-selected", "true");
      Object.keys(PRON_PANE_ELS).forEach(function (key) {
        if (PRON_PANE_ELS[key]) PRON_PANE_ELS[key].style.display = (key === btn.dataset.pron) ? "" : "none";
      });
    });
  });

  // mode: "vowel" reads the bare vowel sound itself; "consonant" reads the letter + ơ (the
  // conventional way to voice a bare consonant aloud, per the note shown above the 자음 tables).
  function pronRow(r, big, mode) {
    var rowCls = "pron-row" + (big ? " big-row" : "");
    var letterCls = "pron-letters vn" + (big ? " big-letters" : "");
    var firstToken = r[0].split(",")[0].trim();
    var letterSpeak = mode === "consonant" ? (firstToken + "ơ") : firstToken;
    return '<div class="' + rowCls + '"><div class="' + letterCls + '">' + escapeHtml(r[0]) +
      '<button class="speak-btn" data-speak="' + escapeAttr(letterSpeak) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
      '<div><div class="pron-desc">' + escapeHtml(T(r[1])) + '</div><div class="pron-ex">' + TU("예: ") + escapeHtml(r[2]) +
      '<button class="speak-btn" data-speak="' + escapeAttr(r[2]) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div></div></div>';
  }

  /* ================= CURRICULUM (교과) ================= */
  function goToTab(tab, subAttr, subVal, talkNums, vocabRange, anchor) {
    if (tab === "curriculum") {
      if (subVal === "culture") { tab = "wizard"; subAttr = "wizard"; subVal = "culture"; }
      else if (subVal === "song") { tab = "sentence"; subAttr = "sentence"; subVal = "song"; }
      else if (subVal === "prayer") { tab = "sentence"; subAttr = "sentence"; subVal = "prayer"; }
      else if (subVal === "guide") { tab = "pron"; subAttr = "pron"; subVal = "settings"; }
    }
    if (tab === "pron") {
      if (subVal === "alphabet") { subVal = "jamo"; anchor = anchor || "pron-alphabet"; }
      else if (subVal === "vowels") { subVal = "jamo"; anchor = anchor || "pron-vowels"; }
      else if (subVal === "consonants") { subVal = "jamo"; anchor = anchor || "pron-consonants"; }
      else if (subVal === "tones") { subVal = "tones"; anchor = anchor || "pron-tones"; }
      else if (subVal === "tonepairs") { subVal = "tones"; anchor = anchor || "pron-tonepairs"; }
    }
    if (tab === "vocab") {
      if (subVal === "basic") { subVal = "words"; activeWordTag = "기본"; }
      else if (subVal === "freq") { subVal = "words"; activeWordTag = "상용"; }
      else if (subVal === "theo") { subVal = "words"; activeWordTag = "신권"; }
      else if (subVal === "names") { subVal = "words"; activeWordTag = "인명"; }
    }
    activateTab(tab, false);
    if (subAttr && subVal) {
      var sb = document.querySelector('.subtab-btn[data-' + subAttr + '="' + subVal + '"]');
      if (sb) sb.click();
    }
    if (anchor && anchor.indexOf('song-') === 0) {
      var snum = parseInt(anchor.replace('song-', ''), 10);
      if (snum && typeof renderCurrSongs === "function") {
        renderCurrSongs(snum);
      }
    }
    // For links that point at one specific sub-section of a subtab's content (e.g. a particular
    // song, or the 기도 준비하기 block, inside 노래·기도) rather than the subtab as a whole --
    // scroll (and, if it's inside a collapsed .group-card, expand) straight to that element
    // instead of leaving the learner at the top of the subtab. Looked up by a data-anchor
    // attribute the render function tags onto the target element.
    if (anchor) {
      setTimeout(function () {
        var target = document.querySelector('[data-anchor="' + anchor.replace(/"/g, '\\"') + '"]');
        if (!target) return;
        var lffPart = target.closest ? target.closest(".lff-part") : null;
        if (lffPart) {
          lffPart.dataset.open = "true";
          var partButton = lffPart.querySelector(".lff-part-head");
          if (partButton) partButton.setAttribute("aria-expanded", "true");
        }
        var card = target.closest ? target.closest(".group-card") : null;
        if (card) card.dataset.open = "true";
        if (target.classList.contains("group-card")) target.dataset.open = "true";
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
    // For 16주 과정 / 주간 수행 과제 어휘 바로가기 links that target a specific slice of a vocab
    // subtab's own natural item order (see VOCAB_PLAN), pin that range so the learner lands on
    // exactly the words they should study today -- must run AFTER the subtab-btn click above,
    // since that click handler unconditionally clears vocabFocus before re-rendering.
    if ((tab === "vocab" || tab === "sentence") && vocabRange && typeof vocabRange.start === "number" && typeof vocabRange.end === "number") {
      vocabFocus = { mode: subVal, start: vocabRange.start, end: vocabRange.end };
      if (tab === "vocab") renderVocab(); else renderCurrWt();
    } else if ((tab === "vocab" || tab === "sentence") && !subAttr) {
      vocabFocus = null;
    }
    // For 교과 → 16주 과정 links that point at a specific 제공 연설 number (or numbers, for a
    // "N,N 복습" item), also expand that talk's card in 호칭·대화 → 제공 연설 and scroll to it,
    // instead of just landing on the top of the subtab.
    if (talkNums && talkNums.length) {
      var talksRoot = document.getElementById("curr-talks-root");
      if (talksRoot) {
        var firstCard = null;
        talkNums.forEach(function (n) {
          var card = talksRoot.querySelector('.group-card[data-syl="talk' + n + '"]');
          if (card) {
            card.dataset.open = "true";
            if (!firstCard) firstCard = card;
          }
        });
        if (firstCard) firstCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }
  function currChev() {
    return '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>';
  }
  // "N주" reads naturally as a trailing unit in Korean/Chinese/Japanese (1주/1週/1週), but English
  // puts the ordinal word first ("Week 1", not "1 Week") -- so this can't just be a suffix string.
  function weekBadge(n) {
    return currentLang === "en" ? TU("주") + " " + n : n + TU("주");
  }
  function currLinkBtn(l) {
    if (!l) return "";
    return '<button class="curr-link-btn" data-goto-tab="' + escapeAttr(l.tab) + '"' +
      (l.subAttr ? ' data-goto-subattr="' + escapeAttr(l.subAttr) + '" data-goto-subval="' + escapeAttr(l.subVal) + '"' : '') +
      (l.talkNums ? ' data-goto-talknums="' + escapeAttr(l.talkNums.join(",")) + '"' : '') +
      (l.vocabRange ? ' data-goto-vr-start="' + escapeAttr(String(l.vocabRange.start)) + '" data-goto-vr-end="' + escapeAttr(String(l.vocabRange.end)) + '"' : '') +
      (l.reviewScope ? ' data-goto-review-scope="' + escapeAttr(l.reviewScope) + '" data-goto-review-mode="' + escapeAttr(l.reviewMode || "order") + '"' : '') +
      (l.anchor ? ' data-goto-anchor="' + escapeAttr(l.anchor) + '"' : '') +
      '>' + TU("바로가기") + '</button>';
  }
  // 2026–27 class calendar. The first 16 study slots correspond to Watchtower vocabulary
  // collections 6–24; the final cumulative-review card deliberately has no new collection.
  var COURSE_SLOT_ORDER = [0, 1, 2, 3, -1.5, 4, 5, 6, 7, -2.5, 8, 9, -3.5, 10, 11, 12, 13, 14, 15, 16];
  var COURSE_DATE_LABELS = (typeof JW_COURSE_DATE_LABELS !== "undefined") ? JW_COURSE_DATE_LABELS : {};
  var COURSE_BREAK_LABELS = (typeof JW_COURSE_BREAK_LABELS !== "undefined") ? JW_COURSE_BREAK_LABELS : {};
  function courseSlotIndex(key) { return COURSE_SLOT_ORDER.indexOf(Number(key)); }
  function courseWatchtowerWeek(key) {
    var index = courseSlotIndex(key);
    return index >= 0 && index < 19 ? index + 6 : null;
  }
  function watchtowerRange(weekNumber) {
    if (!weekNumber || !WATCHTOWER_VOCAB[weekNumber - 1]) return null;
    var start = 0;
    for (var i = 0; i < weekNumber - 1; i++) start += WATCHTOWER_VOCAB[i].words.length;
    return { start: start, end: start + WATCHTOWER_VOCAB[weekNumber - 1].words.length };
  }
  function curriculumLinkForWeek(link, weekKey) {
    if (!link || link.subAttr !== "sentence" || link.subVal !== "wt") return link;
    if (Number(weekKey) === 16) return { tab: "review", reviewScope: "wt", reviewMode: "order" };
    var range = watchtowerRange(courseWatchtowerWeek(weekKey));
    if (!range) return null;
    var adjusted = Object.assign({}, link);
    adjusted.vocabRange = range;
    return adjusted;
  }
  // JW course (non-regional): all COURSE_SLOT_ORDER slots -- the 16 study weeks, the three former break slots and
  // the final review slot, each with its authored content -- are presented as one numbered 20-week course, without dates.
  function courseWeekTitle(w) {
    var index = courseSlotIndex(w.week);
    return index >= 0 ? weekBadge(index + 1) : (w.title ? T(w.title) : weekBadge(w.week));
  }
  function courseStudyNumber(weekKey) {
    return Number(weekKey) >= 0 && Number(weekKey) <= 15 ? Number(weekKey) + 1 : null;
  }
  function curriculumItemText(it, weekKey) {
    var text = T(it.text);
    if (currentLang !== "ko") return text;
    if (/^베트남어 파수대 어휘 50개 학습/.test(text)) {
      if (Number(weekKey) === 16) return "베트남어 파수대 어휘 및 문장 복습";
      var number = courseStudyNumber(weekKey);
      if (number) return "베트남어 파수대 어휘 50개 학습 " + number + "주차";
    }
    return text;
  }
  // Reading practice proceeds through Enjoy Life Forever! (행누) and Love People—Make
  // Disciples (랑제) from Week 5 onward, including the scheduled breaks. Keep these
  // as display-only course items so the authored source curriculum remains intact.
  var COURSE_READING_PLAN = {
    "4": { lff: 1, lpd: 1 }, "5": { lff: 2, lpd: 2 }, "6": { lff: 3, lpd: 3 }, "7": { lff: 4, lpd: 4 },
    "-2.5": { lff: 5, lpd: 5 }, "8": { lff: 6, lpd: 6 }, "9": { lff: 7, lpd: 7 }, "-3.5": { lff: 8, lpd: 8 },
    "10": { lff: 9, lpd: 9 }, "11": { lff: 10, lpd: 10 }, "12": { lff: 11, lpd: 11 }, "13": { lff: 12, lpd: 12 },
    "14": { lffReview: 1, lpdAppendix: "A" }
  };
  function courseReadingText(kind, value) {
    var appendix = kind === "lpdAppendix";
    var partReview = kind === "lffReview";
    if (kind === "lff") return { ko: "행누 " + value + "과 읽기 연습", zh: "「행누」第" + value + "課閱讀練習", en: "행누 Lesson " + value + " Reading Practice", ja: "「행누」レッスン" + value + " 読解練習" };
    if (partReview) return { ko: "행누 1부 복습 읽기 연습", zh: "「행누」第1部分複習閱讀練習", en: "행누 Part 1 Review Reading Practice", ja: "「행누」第1部 復習読解練習" };
    if (appendix) return { ko: "랑제 부록 " + ({ A: "가", B: "나", C: "다" }[value]) + " 읽기 연습", zh: "《用愛心幫助人成為基督徒》附錄" + value + "閱讀練習", en: "Love People—Make Disciples Appendix " + value + " Reading Practice", ja: "「愛を込めて弟子を育てる」付録" + value + " 読解練習" };
    return { ko: "랑제 " + value + "과 읽기 연습", zh: "《用愛心幫助人成為基督徒》第" + value + "課閱讀練習", en: "Love People—Make Disciples Lesson " + value + " Reading Practice", ja: "「愛を込めて弟子を育てる」レッスン" + value + " 読解練習" };
  }
  function courseReadingItems(weekKey) {
    var plan = COURSE_READING_PLAN[String(weekKey)];
    if (!plan) return [];
    var items = [];
    if (plan.lff) items.push({ text: courseReadingText("lff", plan.lff), link: { tab: "sentence", subAttr: "sentence", subVal: "lff", anchor: "lff" + (plan.lff - 1) } });
    if (plan.lffReview) items.push({ text: courseReadingText("lffReview", plan.lffReview), link: { tab: "sentence", subAttr: "sentence", subVal: "lff", anchor: "lff12" } });
    if (plan.lpd) items.push({ text: courseReadingText("lpd", plan.lpd), link: { tab: "sentence", subAttr: "sentence", subVal: "lpd", anchor: "lpd" + (plan.lpd - 1) } });
    if (plan.lpdAppendix) {
      var appendixIndex = { A: 12, B: 13, C: 14 }[plan.lpdAppendix];
      items.push({ text: courseReadingText("lpdAppendix", plan.lpdAppendix), link: { tab: "sentence", subAttr: "sentence", subVal: "lpd", anchor: "lpd" + appendixIndex } });
    }
    return items;
  }
  function curriculumDisplayItems(w) {
    var sourceReadingLabels = ["베트남어 출판물 읽기 연습 (행누, 랑제)", "행누책 읽기", "베트남어 읽기 연습"];
    return w.items.filter(function (it) { return sourceReadingLabels.indexOf((it.text || {}).ko) < 0; }).concat(courseReadingItems(w.week));
  }
  function addCourseReadingAssignments(assign, reviewWeekKeys, previewWeekKey) {
    if (!assign || !assign.days || !assign.days.length) return assign;
    var days = assign.days.map(function (day) {
      var copy = Object.assign({}, day);
      copy.reviews = (day.reviews || []).slice();
      copy.previews = (day.previews || []).slice();
      return copy;
    });
    // Review both the preceding and current course, then preview the following course.
    // The two books are distributed over the week instead of being concentrated on one day.
    var reviewItems = [];
    (Array.isArray(reviewWeekKeys) ? reviewWeekKeys : [reviewWeekKeys]).forEach(function (weekKey) {
      reviewItems = reviewItems.concat(courseReadingItems(weekKey));
    });
    reviewItems.forEach(function (item, index) {
      days[(index * 2) % days.length].reviews.push(item);
    });
    courseReadingItems(previewWeekKey).forEach(function (item, index) {
      days[(index * 2 + 1) % days.length].previews.push(item);
    });
    return Object.assign({}, assign, { days: days });
  }
  function bindCurrGroupCards(root) {
    root.querySelectorAll(".group-card").forEach(function (card) {
      card.querySelector(".group-head").addEventListener("click", function () {
        card.dataset.open = card.dataset.open === "true" ? "false" : "true";
      });
    });
  }
  function bindGotoButtons(root) {
    root.querySelectorAll(".curr-link-btn").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        if (b.dataset.gotoReviewScope) {
          activateTab("review", false);
          var reviewTab = document.querySelector('.subtab-btn[data-review="sentence"]');
          if (reviewTab) reviewTab.click();
          setTimeout(function () {
            var scope = document.querySelector('.subtab-btn[data-review-scope="' + b.dataset.gotoReviewScope + '"]');
            if (scope) scope.click();
            var mode = document.querySelector('.study-mode-btn[data-mode="' + b.dataset.gotoReviewMode + '"]');
            if (mode) mode.click();
          }, 0);
          return;
        }
        var talkNums = b.dataset.gotoTalknums ? b.dataset.gotoTalknums.split(",").map(Number) : null;
        var vocabRange = (b.dataset.gotoVrStart !== undefined && b.dataset.gotoVrEnd !== undefined) ?
          { start: Number(b.dataset.gotoVrStart), end: Number(b.dataset.gotoVrEnd) } : null;
        goToTab(b.dataset.gotoTab, b.dataset.gotoSubattr, b.dataset.gotoSubval, talkNums, vocabRange, b.dataset.gotoAnchor || null);
      });
    });
  }
  function bindCurrSpeakBtns(root) {
    root.querySelectorAll(".speak-btn").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        if (b.dataset.speakMeaning) speakMeaning(b.dataset.speakMeaning);
        else speak(b.dataset.speak);
      });
    });
  }

  /* ================= REGIONAL SCHEDULE + DISTRIBUTION ENGINES ================= */
/* BEGIN SHARED-SCHEDULE-ENGINE (verbatim copy of regional_admin/schedule_engine.js) */
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
/* END SHARED-SCHEDULE-ENGINE */
/* BEGIN SHARED-DISTRIBUTION-ENGINE (verbatim copy of regional_admin/distribution_engine.js) */
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
/* END SHARED-DISTRIBUTION-ENGINE */

  /* ---- Regional course model: source curriculum -> configuration -> sessions -> distribution ----
     SOURCE units come from the static build (CURR_WEEKS / CURR_ASSIGNMENTS) or, after hydration, from the regional
     admin API (merged with the static translations by item uid + unchanged Korean text). The number of sessions is
     derived from the configured dates; the mapping is the applied plan (live) or the deterministic auto distribution. */
  var regionalLive = null;
  var regionalStaticUnitsCache = null;
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function pad3(n) { return (n < 10 ? "00" : n < 100 ? "0" : "") + n; }
  function regionalStaticUnits() {
    if (regionalStaticUnitsCache) return regionalStaticUnitsCache;
    var weeks = (typeof CURR_WEEKS !== "undefined") ? CURR_WEEKS : [];
    var assigns = (typeof CURR_ASSIGNMENTS !== "undefined") ? CURR_ASSIGNMENTS : [];
    var units = [];
    for (var u = 1; u <= 16; u++) {
      var w = weeks.filter(function (x) { return x.week === u; })[0] || {};
      var learning = (w.items || []).map(function (it, i) {
        return { uid: "L" + pad2(u) + "-" + pad3(i), unit: u, kind: "learning", text: it.text, page: it.page || null, link: it.link || null };
      });
      var entry = assigns.filter(function (x) { return x.week === u; })[0];
      var flat = [], seq = 0;
      ((entry && entry.days) || []).forEach(function (d) {
        var day = ((d.day && d.day.ko) || "").replace("요일", "");
        [["review", d.reviews], ["preview", d.previews], ["vocab", d.vocab]].forEach(function (g) {
          (g[1] || []).forEach(function (it, i) {
            flat.push({ uid: "A" + pad2(u) + "-" + pad3(seq++), unit: u, kind: "assignment", day: day, category: g[0], sort_order: i, text: it.text, link: it.link || null });
          });
        });
      });
      units.push({ unit: u, title: w.title || null, note: w.note || null, learning: learning, assignments: orderAssignments(flat) });
    }
    regionalStaticUnitsCache = units;
    return units;
  }
  function regionalMergeLive(data) {
    var staticUnits = regionalStaticUnits();
    var staticByUid = {};
    staticUnits.forEach(function (u) { u.learning.concat(u.assignments).forEach(function (x) { staticByUid[x.uid] = x; }); });
    function sameKo(a, b) { return !!a && !!b && a.ko === b.ko; }
    var units = ((data.source && data.source.units) || []).map(function (u) {
      var su = staticUnits.filter(function (x) { return x.unit === u.unit; })[0] || {};
      function atom(x, kind) {
        var st = staticByUid[x.uid];
        var out = { uid: x.uid, unit: u.unit, kind: kind, text: (st && sameKo(st.text, x.text)) ? st.text : x.text, link: x.link || null };
        if (kind === "learning") out.page = x.page || null; else { out.day = x.day; out.category = x.category; }
        return out;
      }
      return {
        unit: u.unit,
        title: (su.title && sameKo(su.title, u.title)) ? su.title : (u.title || null),
        note: (su.note && sameKo(su.note, u.note)) ? su.note : (u.note || null),
        learning: (u.learning || []).map(function (x) { return atom(x, "learning"); }),
        assignments: (u.assignments || []).map(function (x) { return atom(x, "assignment"); })
      };
    });
    return { config: data.config, plan: data.plan, units: units };
  }
  function regionalConfig() { return regionalLive ? regionalLive.config : REGIONAL_SCHEDULE; }
  function regionalUnits() { return regionalLive ? regionalLive.units : regionalStaticUnits(); }
  // Legacy-shaped views of the (possibly live) source, used by the fixed-layout renderer.
  function regionalCurrWeeks() {
    if (!regionalLive) return CURR_WEEKS;
    var byUnit = {};
    regionalLive.units.forEach(function (u) { byUnit[u.unit] = u; });
    return CURR_WEEKS.map(function (w) {
      var u = byUnit[w.week];
      if (!u) return w;
      return Object.assign({}, w, { title: u.title, note: u.note, items: u.learning.map(function (x) {
        var it = { text: x.text };
        if (x.page) it.page = x.page;
        if (x.link) it.link = x.link;
        return it;
      }) });
    });
  }
  function regionalCurrAssignments() {
    var base = (typeof CURR_ASSIGNMENTS !== "undefined") ? CURR_ASSIGNMENTS : [];
    if (!regionalLive) return base;
    var DAYS = ["월", "화", "수", "목", "금"];
    var rebuilt = regionalLive.units.filter(function (u) { return u.assignments.length; }).map(function (u) {
      var st = base.filter(function (a) { return a.week === u.unit; })[0];
      return { week: u.unit, days: DAYS.map(function (d) {
        var sd = st && st.days.filter(function (x) { return ((x.day && x.day.ko) || "").replace("요일", "") === d; })[0];
        function pick(cat) {
          return u.assignments.filter(function (x) { return x.day === d && x.category === cat; }).map(function (x) {
            var it = { text: x.text };
            if (x.link) it.link = x.link;
            return it;
          });
        }
        return { day: sd ? sd.day : { ko: d + "요일" }, reviews: pick("review"), previews: pick("preview"), vocab: pick("vocab") };
      }) };
    });
    return base.filter(function (a) { return !(a.week >= 1 && a.week <= 16); }).concat(rebuilt);
  }
  // Schedule (dates, session count) + session -> content mapping for the regional site.
  function regionalPlan() {
    var sched = calculateRegionalSchedule(regionalConfig());
    var out = { sched: sched, sessions: [], identity: false };
    if (sched.status !== "configured" || sched.instructionalSessions < 1) return out;
    var units = regionalUnits();
    var live = regionalLive && regionalLive.plan;
    if (live && live.sessions && live.sessions.length === sched.instructionalSessions) {
      var byUid = {};
      units.forEach(function (u) { u.learning.concat(u.assignments).forEach(function (x) { byUid[x.uid] = x; }); });
      out.sessions = live.sessions.map(function (s) {
        var learning = s.learning.map(function (uid) { return byUid[uid]; }).filter(Boolean);
        var assignments = s.assignments.map(function (uid) { return byUid[uid]; }).filter(Boolean);
        var seen = {}, us = [];
        learning.concat(assignments).forEach(function (x) { if (!seen[x.unit]) { seen[x.unit] = true; us.push(x.unit); } });
        return { session: s.session, units: us.sort(function (p, q) { return p - q; }), learning: learning, assignments: assignments };
      });
      out.identity = units.length > 0 && out.sessions.length === units.length && out.sessions.every(function (s, i) {
        var u = units[i];
        return s.learning.length === u.learning.length && s.assignments.length === u.assignments.length &&
          s.learning.every(function (x, k) { return x.uid === u.learning[k].uid; }) &&
          s.assignments.every(function (x, k) { return x.uid === u.assignments[k].uid; });
      });
    } else {
      var dist = distributeCurriculum({ units: units, sessionCount: sched.instructionalSessions });
      out.sessions = dist.sessions;
      out.identity = dist.identity;
    }
    return out;
  }
  // "N회차" -- the ordinal word position differs per language, so this is a per-language format, not a suffix string.
  var SESSION_BADGE = {
    ko: function (n) { return n + "회차"; }, ja: function (n) { return "第" + n + "回"; },
    zh: function (n) { return "第" + n + "次課"; }, zh_cn: function (n) { return "第" + n + "次课"; },
    cs: function (n) { return "Lekce " + n; }, de: function (n) { return "Einheit " + n; },
    en: function (n) { return "Session " + n; }, fr: function (n) { return "Séance " + n; },
    id: function (n) { return "Pertemuan " + n; }, hu: function (n) { return n + ". alkalom"; },
    pl: function (n) { return "Zajęcia " + n; }, vi: function (n) { return "Buổi " + n; }
  };
  function sessionBadge(n) { return (SESSION_BADGE[currentLang] || SESSION_BADGE.ko)(n); }
  function regionalDayLabel(day) {
    var base = (typeof CURR_ASSIGNMENTS !== "undefined") ? CURR_ASSIGNMENTS : [];
    for (var i = 0; i < base.length; i++) {
      var d = (base[i].days || []).filter(function (x) { return ((x.day && x.day.ko) || "").replace("요일", "") === day; })[0];
      if (d) return T(d.day);
    }
    return day + "요일";
  }
  function regionalUnconfiguredCard() {
    return '<div class="group-card" data-open="true" data-syl="unconfigured">' +
      '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(TU("일정 미정")) + '</span></span>' + currChev() + '</button>' +
      '<div class="group-body"><div class="curr-item-list"><div class="curr-item-row"><div class="curr-item-text" style="color:var(--ink-soft); font-style:italic;">' +
      TU("자료 미정") + '</div></div></div></div></div>';
  }
  function regionalLearningRow(it, unit) {
    return '<div class="curr-item-row"><div class="curr-item-text">' + escapeHtml(curriculumItemText(it, unit)) +
      (it.page ? '<span class="curr-item-page">p.' + it.page + '</span>' : '') + '</div>' +
      currLinkBtn(curriculumLinkForWeek(it.link, unit)) + '</div>';
  }
  // Variable-length session cards: one card per generated instructional session (and per cancellation), in date order.
  function regionalSessionCards(rp) {
    var html = "";
    var seenUnit = {};
    var readingLabels = ["베트남어 출판물 읽기 연습 (행누, 랑제)", "행누책 읽기", "베트남어 읽기 연습"];
    var bySession = {};
    rp.sessions.forEach(function (s) { bySession[s.session] = s; });
    var units = regionalUnits();
    rp.sched.slots.forEach(function (slot) {
      if (slot.type === "cancellation") {
        html += '<div class="group-card curr-vacation-card" data-open="false" data-syl="cancel-' + slot.date + '">' +
          '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(slot.calculatedDate + " " + (T(slot.reason) || TU("휴강"))) + '</span></span>' +
          currChev() + '</button>' +
          '<div class="group-body"><div class="curr-item-list">' +
          '<div class="curr-item-row"><div class="curr-item-text" style="color:var(--warm); font-weight:600;">' + TU("휴강") + ': ' + escapeHtml(T(slot.reason)) + '</div></div>' +
          '</div></div></div>';
        return;
      }
      var sess = bySession[slot.session] || { session: slot.session, units: [], learning: [], assignments: [] };
      var notes = [];
      sess.units.forEach(function (n) {
        var u = units.filter(function (x) { return x.unit === n; })[0];
        if (u && u.note && notes.length < 1) notes.push(u.note);
      });
      html += '<div class="group-card" data-open="' + (slot.session === 1 ? "true" : "false") + '" data-syl="s' + slot.session + '">' +
        '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(slot.calculatedDate + " - " + sessionBadge(slot.session)) + '</span>' +
        (notes.length ? '<span class="curr-week-note">' + escapeHtml(T(notes[0])) + '</span>' : '') + '</span>' + currChev() + '</button>' +
        '<div class="group-body"><div class="curr-item-list">';
      var rows = "";
      sess.learning.forEach(function (it) {
        if (readingLabels.indexOf((it.text || {}).ko) >= 0) return;
        rows += regionalLearningRow(it, it.unit);
      });
      // Display-only course reading items belong to the first session that touches their source unit.
      sess.units.forEach(function (n) {
        if (seenUnit[n]) return;
        seenUnit[n] = true;
        courseReadingItems(n).forEach(function (it) { rows += regionalLearningRow(it, n); });
      });
      html += rows || '<div class="curr-item-row"><div class="curr-item-text" style="color:var(--ink-soft); font-style:italic;">' + TU("자료 미정") + '</div></div>';
      html += '</div>';
      if (sess.assignments.length) {
        html += '<div class="curr-assign-card" data-open="false"><button class="curr-assign-toggle" aria-expanded="false"><span class="curr-assign-label">' + TU("주간 수행 과제") + '</span>' + currChev() + '</button><div class="curr-assign-body">';
        ["월", "화", "수", "목", "금"].forEach(function (day) {
          var dayItems = sess.assignments.filter(function (x) { return x.day === day; });
          if (!dayItems.length) return;
          html += '<div class="curr-assign-day-group"><div class="curr-assign-day-label">' + escapeHtml(regionalDayLabel(day)) + '</div>';
          [["review", "복습"], ["preview", "예습"], ["vocab", "어휘"]].forEach(function (g) {
            dayItems.filter(function (x) { return x.category === g[0]; }).forEach(function (it) {
              html += '<div class="curr-assign-row"><span class="curr-assign-kind ' + g[0] + '">' + TU(g[1]) + '</span><span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' +
                currLinkBtn(curriculumLinkForWeek(it.link, it.unit)) + '</div>';
            });
          });
          html += '</div>';
        });
        html += '</div></div>';
      }
      html += '</div></div>';
    });
    if (!rp.sessions.length) {
      html += '<div class="group-card" data-open="true"><button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(TU("일정 미정")) + '</span></span>' + currChev() + '</button><div class="group-body"><div class="curr-item-list"><div class="curr-item-row"><div class="curr-item-text" style="color:var(--ink-soft); font-style:italic;">' + TU("자료 미정") + '</div></div></div></div></div>';
    }
    return html;
  }


  // ---- GENERAL [과정]: lessons of the GENERAL PDF corpus ----
  // Source: GENERAL_PDF (words / sentences / grammar records, each with its source lesson number). Only the book with
  // an explicit lesson structure is used, lessons in source order; records without a lesson number are not placed in the
  // course (they stay in [단어] / [문장] / [문법]). Nothing is invented; book names and pages are not shown.
  var LESSON_BADGE = {
    ko: function (n) { return n + "과"; }, ja: function (n) { return "第" + n + "課"; },
    zh: function (n) { return "第" + n + "課"; }, zh_cn: function (n) { return "第" + n + "课"; },
    cs: function (n) { return "Lekce " + n; }, de: function (n) { return "Lektion " + n; },
    en: function (n) { return "Lesson " + n; }, fr: function (n) { return "Leçon " + n; },
    id: function (n) { return "Pelajaran " + n; }, hu: function (n) { return n + ". lecke"; },
    pl: function (n) { return "Lekcja " + n; }, vi: function (n) { return "Bài " + n; }
  };
  function generalCourseLessons() {
    if (typeof GENERAL_PDF === "undefined" || !GENERAL_PDF) return [];
    var byFile = {};
    ["words", "sentences", "grammar"].forEach(function (kind) {
      (GENERAL_PDF[kind] || []).forEach(function (r) {
        var src = r.sources && r.sources[0];
        if (!src || typeof src.lesson !== "number") return;
        var f = byFile[src.file] || (byFile[src.file] = {});
        var l = f[src.lesson] || (f[src.lesson] = { lesson: src.lesson, words: [], sentences: [], grammar: [] });
        l[kind].push(r);
      });
    });
    var best = null;
    Object.keys(byFile).forEach(function (file) {
      var n = Object.keys(byFile[file]).length;
      if (!best || n > best.n) best = { file: file, n: n };
    });
    if (!best) return [];
    return Object.keys(byFile[best.file]).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return byFile[best.file][k]; });
  }
  function generalCourseHtml() {
    var lessons = generalCourseLessons();
    if (!lessons.length) {
      return '<div class="group-card" data-open="true" data-syl="unconfigured"><button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' +
        escapeHtml(TU("학습 과정")) + '</span></span>' + currChev() + '</button><div class="group-body"><div class="curr-item-list"><div class="curr-item-row">' +
        '<div class="curr-item-text" style="color:var(--ink-soft); font-style:italic;">' + escapeHtml(TU("자료 미정")) + '</div></div></div></div></div>';
    }
    var html = "";
    lessons.forEach(function (l, i) {
      var badge = (LESSON_BADGE[currentLang] || LESSON_BADGE.ko)(l.lesson);
      html += '<div class="group-card" data-open="' + (i === 0 ? "true" : "false") + '" data-syl="lesson' + l.lesson + '">' +
        '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(badge) + '</span></span>' + currChev() + '</button>' +
        '<div class="group-body"><div class="curr-item-list">';
      if (l.words.length) {
        html += '<div class="curr-item-row"><div class="curr-item-text"><strong>' + escapeHtml(TU("단어")) + '</strong> · ' +
          l.words.map(function (w) {
            var m = w.translations && w.translations[currentLang];
            return '<span class="vn">' + escapeHtml(w.vi) + '</span>' + (m && currentLang !== "vi" ? ' (' + escapeHtml(m) + ')' : '');
          }).join(', ') + '</div>' + currLinkBtn({ tab: "vocab", subAttr: "vocab", subVal: "words" }) + '</div>';
      }
      l.sentences.forEach(function (st, si) {
        var tr = st.translations && st.translations[currentLang];
        html += '<div class="curr-item-row"><div class="curr-item-text">' + (si === 0 ? '<strong>' + escapeHtml(TU("문장")) + '</strong> · ' : '') +
          '<span class="vn">' + escapeHtml(st.vi) + '</span>' + (tr && currentLang !== "vi" ? '<br><span style="color:var(--ink-soft)">' + escapeHtml(tr) + '</span>' : '') + '</div>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(st.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      });
      if (l.sentences.length) html += '<div class="curr-item-row"><div class="curr-item-text"></div>' + currLinkBtn({ tab: "sentence", subAttr: "sentence", subVal: "pdf" }) + '</div>';
      if (l.grammar.length) {
        html += '<div class="curr-item-row"><div class="curr-item-text"><strong>' + escapeHtml(TU("문법")) + '</strong> · ' + l.grammar.length + '</div>' +
          currLinkBtn({ tab: "grammar", subAttr: "grammar", subVal: "pdf" }) + '</div>';
      }
      html += '</div></div></div>';
    });
    return html;
  }

  function renderCurrWeek16() {
    var root = document.getElementById("curr-week16-root");
    if (!root) return;
    var html = "";

    var isRegional = (typeof REGIONAL_SCHEDULE !== "undefined");
    var rp = isRegional ? regionalPlan() : null;
    var sched = rp ? rp.sched : null;
    var currAssignments = isRegional ? regionalCurrAssignments() : ((typeof CURR_ASSIGNMENTS !== "undefined") ? CURR_ASSIGNMENTS : []);
    if (rp && rp.identity) {
      // Fixed layout (one session per source unit): attach each unit's content to its slot for the classic card renderer.
      var liveWeeks = regionalCurrWeeks();
      sched.slots.forEach(function (s) {
        if (s.type !== "instructional") return;
        var w = liveWeeks.filter(function (x) { return x.week === s.week; })[0] || {};
        s.items = w.items || [];
        s.note = w.note || null;
        s.title = w.title || null;
      });
    }

    if (!isRegional && !(CURR_WEEKS && CURR_WEEKS.length)) {
      // GENERAL: course data is JW-only (emitted empty). The GENERAL course is built ONLY from GENERAL_PDF (COMMON,
      // extracted from the general Vietnamese PDF corpus), following the source books' own lesson numbering.
      root.innerHTML = generalCourseHtml();
      bindCurrGroupCards(root);
      bindGotoButtons(root);
      bindCurrSpeakBtns(root);
      return;
    }

    // Welcome card
    var welcomeDatePrefix = "";
    if (sched) {
      if (sched.preliminaryMeeting && sched.preliminaryMeeting.calculatedDate) {
        welcomeDatePrefix = sched.preliminaryMeeting.calculatedDate + " ";
      }
    }

    html += '<div class="curr-card curr-welcome-card" data-open="false">' +
      '<button class="curr-welcome-toggle" aria-expanded="false"><h3>' + escapeHtml(welcomeDatePrefix + T(CURR_WELCOME.title)) + '</h3>' + currChev() + '</button>' +
      '<div class="curr-welcome-body">';
    CURR_WELCOME.body.forEach(function (p) { html += '<p>' + escapeHtml(T(p)) + '</p>'; });
    if (CURR_PHASES && CURR_PHASES.length) {
      html += '<div class="curr-phase-grid">';
      CURR_PHASES.forEach(function (ph) {
        html += '<div class="curr-phase-card"><div class="curr-phase-range">' + escapeHtml(T(ph.range)) + '</div>' +
          '<div class="curr-phase-title">' + escapeHtml(T(ph.title)) + '</div>';
        ph.body.forEach(function (p) { html += '<p>' + escapeHtml(T(p)) + '</p>'; });
        html += '</div>';
      });
      html += '</div>';
    }

    // The first week's homework belongs at the bottom of the welcome card (if configured)
    if (!sched || sched.status !== "unconfigured") {
      var welcomeAssign = currAssignments.filter(function (a) { return a.week === 0; })[0] || null;
      welcomeAssign = addCourseReadingAssignments(welcomeAssign, [null, 0], 1);
      if (welcomeAssign) {
        html += '<div class="curr-assign-card" data-open="false"><button class="curr-assign-toggle" aria-expanded="false"><span class="curr-assign-label">' + TU("주간 수행 과제") + '</span>' + currChev() + '</button><div class="curr-assign-body">';
        welcomeAssign.days.forEach(function (d) {
          html += '<div class="curr-assign-day-group"><div class="curr-assign-day-label">' + escapeHtml(T(d.day)) + '</div>';
          [[d.reviews || [], "review", "복습"], [d.previews || [], "preview", "예습"], [d.vocab || [], "vocab", "어휘"]].forEach(function (group) {
            group[0].forEach(function (it) {
              html += '<div class="curr-assign-row"><span class="curr-assign-kind ' + group[1] + '">' + TU(group[2]) + '</span><span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' + currLinkBtn(curriculumLinkForWeek(it.link, 0)) + '</div>';
            });
          });
          html += '</div>';
        });
        html += '</div></div>';
      }
    }
    html += '</div></div>';

    // Weeks Rendering: Regional Engine vs JW Default
    if (sched) {
      if (sched.status !== "configured") {
        // 일정 미정 / 자료 미정: one notice, never a fake 16-row table.
        html += regionalUnconfiguredCard();
      } else if (!rp.identity) {
        html += regionalSessionCards(rp);
      } else {
        // Configured Regional Schedule (e.g. Jeonju)
        var instSlots = sched.slots.filter(function (s) { return s.type === 'instructional'; });
        sched.slots.forEach(function (slot, slotIdx) {
          if (slot.type === 'cancellation') {
            html += '<div class="group-card curr-vacation-card" data-open="false" data-syl="cancel-' + slot.date + '">' +
              '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(slot.calculatedDate + " " + (T(slot.reason) || TU("휴강"))) + '</span></span>' +
              currChev() + '</button>' +
              '<div class="group-body"><div class="curr-item-list">' +
              '<div class="curr-item-row"><div class="curr-item-text" style="color:var(--warm); font-weight:600;">' + TU("휴강") + ': ' + escapeHtml(T(slot.reason)) + '</div></div>' +
              '</div></div></div>';
          } else {
            var badgeText = slot.week === 16 ?
              (slot.calculatedDate + " - " + TU("총복습")) :
              (slot.calculatedDate + " - " + weekBadge(slot.week));
            html += '<div class="group-card" data-open="' + (slot.week === 1 ? "true" : "false") + '" data-syl="wk' + slot.week + '">' +
              '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(badgeText) + '</span>' +
              (slot.note ? '<span class="curr-week-note">' + escapeHtml(T(slot.note)) + '</span>' : '') + '</span>' +
              currChev() + '</button>' +
              '<div class="group-body"><div class="curr-item-list">';
            var displayItems = curriculumDisplayItems({ week: slot.week, items: slot.items || [] });
            if (!displayItems || displayItems.length === 0) {
              html += '<div class="curr-item-row"><div class="curr-item-text" style="color:var(--ink-soft); font-style:italic;">' + TU("자료 미정") + '</div></div>';
            } else {
              displayItems.forEach(function (it) {
                html += '<div class="curr-item-row"><div class="curr-item-text">' + escapeHtml(curriculumItemText(it, slot.week)) +
                  (it.page ? '<span class="curr-item-page">p.' + it.page + '</span>' : '') + '</div>' +
                  currLinkBtn(curriculumLinkForWeek(it.link, slot.week)) + '</div>';
              });
            }
            html += '</div>';

            // Assignments for next instructional week
            var nextInst = instSlots.find(function (s) { return s.week === slot.week + 1; });
            var prevInst = instSlots.find(function (s) { return s.week === slot.week - 1; });
            var assign = nextInst ? currAssignments.filter(function (a) { return a.week === nextInst.week; })[0] : null;
            if (assign) {
              assign = Object.assign({}, assign, { days: assign.days.map(function (d, dayIndex) {
                var copy = Object.assign({}, d);
                copy.reviews = (d.reviews || []).slice();
                copy.previews = (d.previews || []).slice();
                if (!copy.reviews.length && slot.items.length) copy.reviews.push(slot.items[dayIndex % slot.items.length]);
                if (!copy.previews.length && nextInst.items.length) copy.previews.push(nextInst.items[dayIndex % nextInst.items.length]);
                if (!copy.reviews.length) copy.reviews.push({ text: { ko: "이번 주 학습 내용 복습", zh: "複習本週學習內容", en: "Review this week’s study", ja: "今週の学習内容を復習" }, link: { tab: "review" } });
                if (!copy.previews.length) copy.previews.push({ text: { ko: "다음 주 학습 내용 예습", zh: "預習下週學習內容", en: "Preview next week’s study", ja: "来週の学習内容を予習" }, link: { tab: "curriculum" } });
                return copy;
              }) });
              if (slot.week === 15) {
                assign.days.forEach(function (d, dayIndex) {
                  d.reviews = slot.items.filter(function (_, itemIndex) { return itemIndex % assign.days.length === dayIndex; });
                  if (!d.reviews.length && slot.items.length) d.reviews = [slot.items[dayIndex % slot.items.length]];
                });
              }
              assign = addCourseReadingAssignments(assign, [prevInst ? prevInst.week : null, slot.week], nextInst ? nextInst.week : null);
            }
            if (assign) {
              html += '<div class="curr-assign-card" data-open="false">' +
                '<button class="curr-assign-toggle" aria-expanded="false"><span class="curr-assign-label">' + TU("주간 수행 과제") + '</span>' + currChev() + '</button>' +
                '<div class="curr-assign-body">';
              assign.days.forEach(function (d) {
                html += '<div class="curr-assign-day-group"><div class="curr-assign-day-label">' + escapeHtml(T(d.day)) + '</div>';
                (d.reviews || []).forEach(function (it) {
                  html += '<div class="curr-assign-row">' +
                    '<span class="curr-assign-kind review">' + TU("복습") + '</span>' +
                    '<span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' +
                    currLinkBtn(curriculumLinkForWeek(it.link, nextInst.week)) + '</div>';
                });
                (d.previews || []).forEach(function (it) {
                  html += '<div class="curr-assign-row">' +
                    '<span class="curr-assign-kind preview">' + TU("예습") + '</span>' +
                    '<span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' +
                    currLinkBtn(curriculumLinkForWeek(it.link, nextInst.week)) + '</div>';
                });
                (d.vocab || []).forEach(function (it) {
                  html += '<div class="curr-assign-row">' +
                    '<span class="curr-assign-kind vocab">' + TU("어휘") + '</span>' +
                    '<span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' +
                    currLinkBtn(curriculumLinkForWeek(it.link, nextInst.week)) + '</div>';
                });
                html += '</div>';
              });
              html += '</div></div>';
            }
            html += '</div></div>';
          }
        });
      }
    } else {
      // Standard JW course (20 numbered weeks)
      var courseWeeks = CURR_WEEKS.slice().sort(function (a, b) { return courseSlotIndex(a.week) - courseSlotIndex(b.week); });
      courseWeeks.forEach(function (w, wi) {
        html += '<div class="group-card' + (w.vacation ? " curr-vacation-card" : "") + '" data-open="' + (w.week === 0 ? "true" : "false") + '" data-syl="wk' + w.week + '">' +
          '<button class="group-head"><span class="curr-week-head"><span class="curr-week-badge">' + escapeHtml(courseWeekTitle(w)) + '</span>' +
          (w.note ? '<span class="curr-week-note">' + escapeHtml(T(w.note)) + '</span>' : '') + '</span>' +
          currChev() + '</button>' +
          '<div class="group-body"><div class="curr-item-list">';
        curriculumDisplayItems(w).forEach(function (it) {
          html += '<div class="curr-item-row"><div class="curr-item-text">' + escapeHtml(curriculumItemText(it, w.week)) +
            (it.page ? '<span class="curr-item-page">p.' + it.page + '</span>' : '') + '</div>' +
            currLinkBtn(curriculumLinkForWeek(it.link, w.week)) + '</div>';
        });
        html += '</div>';
        var previousSlot = courseWeeks[wi - 1];
        var nextSlot = courseWeeks[wi + 1];
        var assign = (typeof CURR_ASSIGNMENTS !== "undefined" && nextSlot) ? CURR_ASSIGNMENTS.filter(function (a) { return a.week === nextSlot.week; })[0] : null;
        if (assign) {
          assign = Object.assign({}, assign, { days: assign.days.map(function (d, dayIndex) {
            var copy = Object.assign({}, d);
            copy.reviews = (d.reviews || []).slice();
            copy.previews = (d.previews || []).slice();
            if (!copy.reviews.length && w.items.length) copy.reviews.push(w.items[dayIndex % w.items.length]);
            if (!copy.previews.length && nextSlot.items.length) copy.previews.push(nextSlot.items[dayIndex % nextSlot.items.length]);
            if (!copy.reviews.length) copy.reviews.push({ text: { ko: "이번 주 학습 내용 복습", zh: "複習本週學習內容", en: "Review this week’s study", ja: "今週の学習内容を復習" }, link: { tab: "review" } });
            if (!copy.previews.length) copy.previews.push({ text: { ko: "다음 주 학습 내용 예습", zh: "預習下週學習內容", en: "Preview next week’s study", ja: "来週の学習内容を予習" }, link: { tab: "curriculum" } });
            return copy;
          }) });
          if (w.week === 15) {
            assign.days.forEach(function (d, dayIndex) {
              d.reviews = w.items.filter(function (_, itemIndex) { return itemIndex % assign.days.length === dayIndex; });
              if (!d.reviews.length && w.items.length) d.reviews = [w.items[dayIndex % w.items.length]];
            });
          }
          assign = addCourseReadingAssignments(assign, [previousSlot ? previousSlot.week : null, w.week], nextSlot ? nextSlot.week : null);
        }
        if (assign) {
          html += '<div class="curr-assign-card" data-open="false">' +
            '<button class="curr-assign-toggle" aria-expanded="false"><span class="curr-assign-label">' + TU("주간 수행 과제") + '</span>' + currChev() + '</button>' +
            '<div class="curr-assign-body">';
          assign.days.forEach(function (d) {
            html += '<div class="curr-assign-day-group"><div class="curr-assign-day-label">' + escapeHtml(T(d.day)) + '</div>';
            (d.reviews || []).forEach(function (it) {
              html += '<div class="curr-assign-row">' +
                '<span class="curr-assign-kind review">' + TU("복습") + '</span>' +
                '<span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' +
                currLinkBtn(curriculumLinkForWeek(it.link, nextSlot.week)) + '</div>';
            });
            (d.previews || []).forEach(function (it) {
              html += '<div class="curr-assign-row">' +
                '<span class="curr-assign-kind preview">' + TU("예습") + '</span>' +
                '<span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' +
                currLinkBtn(curriculumLinkForWeek(it.link, nextSlot.week)) + '</div>';
            });
            (d.vocab || []).forEach(function (it) {
              html += '<div class="curr-assign-row">' +
                '<span class="curr-assign-kind vocab">' + TU("어휘") + '</span>' +
                '<span class="curr-assign-text">' + escapeHtml(T(it.text)) + '</span>' +
                currLinkBtn(curriculumLinkForWeek(it.link, nextSlot.week)) + '</div>';
            });
            html += '</div>';
          });
          html += '</div></div>';
        }
        html += '</div></div>';
      });
    }

    root.innerHTML = html;
    var welcomeCard = root.querySelector(".curr-welcome-card");
    if (welcomeCard) {
      welcomeCard.querySelector(".curr-welcome-toggle").addEventListener("click", function () {
        var open = welcomeCard.dataset.open === "true";
        welcomeCard.dataset.open = open ? "false" : "true";
        this.setAttribute("aria-expanded", open ? "false" : "true");
      });
    }
    root.querySelectorAll(".curr-assign-card").forEach(function (card) {
      card.querySelector(".curr-assign-toggle").addEventListener("click", function () {
        var open = card.dataset.open === "true";
        card.dataset.open = open ? "false" : "true";
        this.setAttribute("aria-expanded", open ? "false" : "true");
      });
    });
    bindCurrGroupCards(root);
    bindGotoButtons(root);
  }

  function renderCurrCulture() {
    var root = document.getElementById("curr-culture-root");
    if (!root) return;
    var html = "";
    CULTURE_ARTICLES.forEach(function (a) {
      if (a.keywords || a.summaryKo) {
        html += '<div class="curr-card culture-card">';
        if (a.category) {
          html += '<span class="culture-category-badge">' + escapeHtml(a.category) + '</span>';
        }
        html += '<div class="culture-card-title">' +
          '<span class="ko">' + escapeHtml(a.titleKo || "") + '</span> ' +
          (a.titleVi ? '<span class="vi vn">(' + escapeHtml(a.titleVi) + ')</span>' : '') +
          '</div>';
        if (a.summaryKo) {
          html += '<p class="culture-summary">' + escapeHtml(a.summaryKo) + '</p>';
        }
        if (a.learningPoint) {
          html += '<div class="culture-learning-point"><strong>' + TU("핵심 포인트: ") + '</strong>' + escapeHtml(a.learningPoint) + '</div>';
        }
        if (a.keywords && a.keywords.length) {
          html += '<div class="culture-keywords-list">';
          a.keywords.forEach(function (kw) {
            html += '<div class="culture-keyword-chip">' +
              '<span class="vn font-bold">' + escapeHtml(kw.vi) + '</span>' +
              '<button class="speak-btn" data-speak="' + escapeAttr(kw.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
              '<span class="kw-ko">' + escapeHtml(kw.ko) + '</span>' +
              '</div>';
          });
          html += '</div>';
        }
        if (a.source) {
          html += '<div class="culture-source">' + escapeHtml(a.source.file || "") + ' p.' + (a.source.page || "") + '</div>';
        }
        html += '</div>';
      } else {
        html += '<div class="curr-card"><h3>' + escapeHtml(T(a.title)) + '</h3>' +
          '<div class="curr-culture-sub">' + escapeHtml(T(a.subtitle)) + '</div>';
        (a.paragraphs || []).forEach(function (p) { html += '<p>' + escapeHtml(T(p)) + '</p>'; });
        html += '</div>';
      }
    });
    root.innerHTML = html;
    bindCurrSpeakBtns(root);
  }

  function renderCurrTalks() {
    var root = document.getElementById("curr-talks-root");
    if (!root) return;

    // Preserve which talks are currently expanded across re-renders (triggered every time
    // the 나·상대방 관계 selector below changes), defaulting to the first talk open only
    // on the very first render.
    var openSyls = {};
    var existing = root.querySelectorAll('.group-card[data-open="true"]');
    if (existing.length) {
      existing.forEach(function (c) { openSyls[c.dataset.syl] = true; });
    } else if (!root.dataset.rendered) {
      openSyls["talk" + OFFER_TALKS[0].number] = true;
    }
    root.dataset.rendered = "true";

    var talkCase = findCaseForState(state);
    var selfTerm = null, listenerTerm = null;
    if (talkCase) {
      selfTerm = termWord(talkCase.self_term, talkCase.self_term_south, state.region);
      listenerTerm = termWord(talkCase.listener_term, talkCase.listener_term_south, state.region);
    }
    var noteEl = document.getElementById("talk-selection-note");
    if (noteEl) {
      noteEl.textContent = talkCase
        ? (TU("현재 대화문: 상대를 부를 때 “") + listenerTerm + TU("”, 나를 가리킬 때 “") + selfTerm + TU("” 로 표시돼요."))
        : "";
    }

    // Publisher-side lines ("A"/"C", or narration with no "who") use tôi=self / bạn=listener;
    // the householder's own lines ("B") mirror the exact same pair the other way round, since
    // they refer to themselves with the term I call them, and to me with the term I call myself.
    function applyTalkTerms(text, who) {
      if (!talkCase || !text) return text;
      var mySelf = who === "B" ? listenerTerm : selfTerm;
      var myListener = who === "B" ? selfTerm : listenerTerm;
      var out = wordReplace(text, "Tôi", capitalize(mySelf));
      out = wordReplace(out, "tôi", mySelf);
      out = wordReplace(out, "Bạn", capitalize(myListener));
      out = wordReplace(out, "bạn", myListener);
      return out;
    }

    var html = "";
    OFFER_TALKS.forEach(function (t) {
      var talkVis = t.lines.map(function (l) {
        var vi = applyTalkTerms(applyPeopleTalkTokens(l.vi, false), l.who);
        if (talkCase) vi = applyChungTa(vi, talkCase, state.region);
        return vi;
      });
      var talkReadPairs = t.lines.map(function (l, li) {
        return [talkVis[li], applyKoreanRelTerms(applyPeopleTalkTokens(T(l.kr), true))];
      });
      html += '<div class="group-card" data-open="' + (openSyls["talk" + t.number] ? "true" : "false") + '" data-syl="talk' + t.number + '">' +
        '<div class="group-head-row"><button class="group-head"><span><span class="syl">' + TU("제공 연설") + ' ' + t.number + '</span> <span class="cnt">' + escapeHtml(T(t.subtitle)) + '</span></span>' +
        currChev() + '</button>' + readAllButtonHtml(talkReadPairs) + '</div>' +
        '<div class="group-body"><div class="talk-lines">';
      t.lines.forEach(function (l, li) {
        var vi = talkVis[li];
        var kr = applyKoreanRelTerms(applyPeopleTalkTokens(T(l.kr), true));
        html += '<div class="talk-line"><span class="talk-who">' + escapeHtml(l.who || "•") + '</span>' +
          '<div class="talk-body"><div class="talk-vi">' + escapeHtml(vi) +
          '<button class="speak-btn" data-speak="' + escapeAttr(vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(kr) + '</span>' +
          '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(kr) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '</div></div></div>';
      });
      html += '</div></div></div>';
    });
    root.innerHTML = html;
    bindCurrGroupCards(root);
    bindCurrSpeakBtns(root);
    renderPeopleSummary();
  }

  // "이웃 사람과의 대화" -- 11 door-to-door ministry conversations sourced verbatim from wol.jw.org
  // (5 languages), Bible quotations checked against the current NWT and corrected on PUBLISHER
  // lines only. These are conversations with a generic stranger at the door, so (unlike 제공 연설
  // above) no tôi/bạn substitution is applied -- rendered as a static list of collapsible cards,
  // matching the "길찾기 대화문" (GX_DIRECTION_DIALOGUES) card pattern used under 문법.
  function neighborWhoLabel(who) {
    return who === "PUBLISHER" ? TU("전도인") : TU("집주인");
  }

  // Split at the Vietnamese speaker's sentence boundary, not at an arbitrary visual line.
  // This gives every sentence its own play button and lets review modes quiz one utterance at a
  // time.  Translations are normally sentence-for-sentence; where a source language combines
  // sentences differently, its nearest whole sentences are grouped together and distributed in
  // the same order so each Vietnamese sentence still has one matching translation unit.
  //
  // Bible citations get special handling so a plain "."-based split never has to guess at them:
  //  - "(Doc Gie-re-mi 29:11, 12).", "(Cong vu 17:11)" -- a parenthetical citation is one atomic
  //    unit (opening paren to closing paren, plus a trailing period right after it if there is
  //    one); nothing inside it -- including its own commas -- is ever a split point.
  //  - "- 2 Ti-mo-the 3:16.", "- Timothe hau thu 3:16." -- a dash citation with a chapter:verse
  //    number runs from the dash to the next period and is always its own separate sentence,
  //    split out from whatever precedes the dash (never merged into it), matching how these are
  //    laid out one per line in the source. (Requires a chapter:verse digit pattern so an
  //    ordinary emphatic dash elsewhere in a sentence is never mistaken for a citation.)
  //
  // Two independent stash channels (distinct literal marker tags, chosen to never appear in real
  // prose) so a paren-citation placeholder can never collide with -- and get wrongly restored
  // from -- the unrelated ellipsis stash when both land in the same chunk of text.
  function stashPattern(text, re, bag, tag) {
    return text.replace(re, function (m) { bag.push(m); return tag + (bag.length - 1) + tag; });
  }
  function unstashPattern(text, bag, tag) {
    var re = new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\d+)" + tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    return text.replace(re, function (_, i) { return bag[Number(i)] || ""; });
  }
  function splitPlain(text, parenBag) {
    var ellBag = [];
    var decimalBag = [];
    var urlBag = [];
    var stashed = stashPattern(text, /\.{2,}|…/g, ellBag, "");
    // Web addresses / domain names (JW.org, jw.org, donate.jw.org, www.jw.org, wol.jw.org, etc.)
    // contain dots that are NOT sentence boundaries. Stash them before splitting sentences.
    stashed = stashPattern(stashed, /(?:https?:\/\/)?(?:[a-zA-Z0-9_-]+\.)*(?:jw\.org|donate\.jw\.org|wol\.jw\.org|[a-zA-Z0-9_-]+\.(?:org|com|net|gov|edu|io|vn))(?:\/[^\s.,!?。！？．"'’)）\]』」]*)?/gi, urlBag, "");
    // A period between digits is a Vietnamese thousands/decimal separator (2.500, 144.000),
    // never a sentence boundary. Stash the complete number before looking for final periods.
    stashed = stashPattern(stashed, /\d+(?:\.\d+)+/g, decimalBag, "");
    // The trailing closer class also needs 」/』 (Chinese/Japanese closing corner brackets) --
    // without them, "...歡樂。」" split right after the 。 and left the 」 orphaned at the start
    // of the NEXT match, corrupting every sentence boundary downstream of a quoted citation.
    // ．(fullwidth period, U+FF0E) is also a delimiter -- this corpus uses it only as a numbered-
    // heading marker ("1．", "2．"...), never as real prose punctuation, but the OTHER languages'
    // matching heading uses an ASCII "1. " that already splits -- without ．here too, zh/ja stayed
    // one unsplit sentence while vi/ko/en split into two, throwing sentencePairs()'s count-based
    // alignment off by one for every single numbered heading in the source.
    var parts = stashed.match(/[^.!?。！？．]+[.!?。！？．”"'’)）\]』」]+|[^.!?。！？．]+$/g) || [];
    return parts.map(function (p) {
      return unstashPattern(unstashPattern(unstashPattern(unstashPattern(p, urlBag, ""), decimalBag, ""), ellBag, ""), parenBag, "").trim();
    }).filter(Boolean);
  }
  function normalizeJwOrg(s) {
    if (!s) return "";
    return String(s).replace(/(^|[\s(（“"‘'])org(?=[에에서와의를는도로,\s.!?。！？]|$)/gi, "$1JW.org");
  }
  function isIsolatedJw(s) {
    return /^(?:JW|jw)\.?$/i.test(String(s || "").trim());
  }
  // A delimiter run may be followed immediately by closing quote/bracket characters that are
  // part of the SAME sentence-final punctuation (e.g. a quoted question ending in `?".`) -- the
  // regex above consumes those together with the delimiter(s) that end the sentence.
  function splitSentences(text) {
    var s = String(text || "");
    var out = [];
    // Split around dash-citations: even indices are plain text, odd indices are the citations
    // themselves (String.split with a capturing group keeps the matched groups in the result).
    var chunks = s.split(/([​\s]*[—–][^.]*\d+:\d+[^.]*\.)/);
    chunks.forEach(function (chunk, i) {
      if (i % 2 === 1) {
        var citation = chunk.replace(/^[​\s]+/, "").trim();
        if (citation) out.push(citation);
        return;
      }
      // A parenthetical Bible citation -- ASCII "(...)" or the full-width "（...）" Chinese/
      // Japanese text uses -- is always its own atomic sentence, split out explicitly (same
      // technique as the dash-citation split above) BEFORE the generic splitter ever runs.
      // Merely stashing it (as any other non-citation paren still is, just below) isn't enough
      // here: a stashed citation has no delimiter character left on either side of it, so
      // "...hớn hở” (Thi thiên 104:14, 15). Một số..." glued the citation onto whichever
      // neighbor had no punctuation of its own, throwing off every pairing after it -- and
      // Chinese's full-width （） was never even recognized by the old ASCII-only stash, so its
      // citations never lined up with the Vietnamese boundary they were supposed to match
      // either. Requires a chapter:verse digit pattern so an ordinary parenthetical remark is
      // never mistaken for a citation.
      var subchunks = chunk.split(/([(（][^()（）]*\d+:\d+[^()（）]*[)）][.。]?)/);
      subchunks.forEach(function (sub, j) {
        if (j % 2 === 1) {
          var citation = sub.trim();
          if (citation) out.push(citation);
          return;
        }
        var parenBag = [];
        var stashed = stashPattern(sub, /\([^()]*\)\.?/g, parenBag, "");
        splitPlain(stashed, parenBag).forEach(function (p) { if (p) out.push(p); });
      });
    });
    return out
      .filter(function (p) { return !isIsolatedJw(p); })
      .map(function (p) { return normalizeJwOrg(p); });
  }
  function isDashCitation(s) {
    return /^[—–]/.test(s);
  }
  function sentencePairs(vietnamese, meaning) {
    var viParts = splitSentences(vietnamese);
    if (viParts.length < 2) return [{ vi: String(vietnamese || "").trim(), kr: String(meaning || "").trim() }];
    var meaningParts = splitSentences(meaning);

    // A trailing dash-citation is always exactly one sentence in every language (the "— Book
    // ch:vs." shape never itself splits), so peel off any matching citation tail from both sides
    // and pair those 1:1 up front. Otherwise a citation-count mismatch would throw off the
    // proportional alignment of the actual content sentences before it.
    var viCites = [], meaningCites = [];
    while (
      viParts.length && meaningParts.length &&
      isDashCitation(viParts[viParts.length - 1]) && isDashCitation(meaningParts[meaningParts.length - 1])
    ) {
      viCites.unshift(viParts.pop());
      meaningCites.unshift(meaningParts.pop());
    }

    var pairs;
    if (!viParts.length) {
      pairs = [];
    } else if (meaningParts.length === viParts.length) {
      pairs = viParts.map(function (vi, i) { return { vi: vi, kr: meaningParts[i] }; });
    } else {
      // The translation splits/joins sentences differently than the Vietnamese does. Group the
      // translation's OWN sentences proportionally across the Vietnamese sentences, in order --
      // this only ever merges whole translated sentences together, never re-cuts one at a comma,
      // so every group boundary still falls on a real sentence break in the translation rather
      // than a guessed clause split.
      var src = meaningParts.length ? meaningParts : [String(meaning || "").trim()];
      pairs = [];
      var start = 0;
      viParts.forEach(function (vi, i) {
        var end = Math.round((i + 1) * src.length / viParts.length);
        if (end <= start && start < src.length) end = start + 1;
        pairs.push({ vi: vi, kr: src.slice(start, end).join(" ") || String(meaning || "").trim() });
        start = end;
      });
    }
    viCites.forEach(function (c, i) { pairs.push({ vi: c, kr: meaningCites[i] }); });
    pairs = pairs.filter(function (p) {
      return !isIsolatedJw(p.vi) && !isIsolatedJw(p.kr);
    });
    pairs.forEach(function (p) {
      p.vi = normalizeJwOrg(p.vi);
      p.kr = normalizeJwOrg(p.kr);
    });
    return pairs;
  }
  function stripReviewListMarker(value) {
    // Only a leading list label followed by whitespace (or the end) is removed -- "1. "/"A. "/
    // "ㄱ. ", the parenthesized "(A) "/"(ㄱ) " form LFF's lettered sub-questions use, or a
    // full-width-period marker like "2．"/"3。" (Chinese/Japanese numbered questions don't put a
    // space after the marker, so that one doesn't require trailing whitespace -- only the ASCII
    // "." form does, so a decimal number at the very start of a sentence, e.g. "12.5 là...",
    // is never mistaken for marker "12." followed by "5 là...").
    return String(value || "").replace(
      /^\s*(?:(?:[0-9]+|[A-Za-z]|[ㄱ-ㅎㅏ-ㅣᄀ-ᇿ])\.(?:\s+|$)|(?:[0-9]+|[A-Za-z]|[ㄱ-ㅎㅏ-ㅣᄀ-ᇿ])[．。]\s*|\((?:[0-9]+|[A-Za-z]|[ㄱ-ㅎㅏ-ㅣᄀ-ᇿ])\)(?:\s+|$))+/u,
      ""
    ).trim();
  }
  // A bare Bible citation ("— 1 Tê-sa-lô-ni-ca 5:11.", "(Công vụ 17:11)") or a bare "go read/look
  // over there" pointer ("—Xem câu 23.", "23절을 보세요.") is not a sentence to practice --
  // sentencePairs() above peels a trailing dash-citation off into its own pair (to keep the
  // Vietnamese/translation split aligned), and some source lines are nothing but a citation or
  // pointer to begin with. Either way, that fragment shouldn't reach a review pool as its own
  // flashcard/word-order/etc. item, even though it's fine to show inline in the actual reading
  // content (sentencePairs() itself is left alone; only the review-pool path filters this out).
  function isCitationOnlyLine(vi) {
    var s = String(vi || "").trim().replace(/^[—–]\s*/, "");
    var wrapped = s.match(/^\(([^()]*)\)\.?$/);
    if (wrapped) s = wrapped[1].trim();
    // Any fragment that OPENS with a bare "Xem"/"Đọc" reading/viewing directive is navigation,
    // not sentence content, no matter what follows it -- a verse pointer ("Xem câu 23."), a full
    // citation possibly with a "then discuss..." tail ("Đọc Tít 3:1, rồi thảo luận câu hỏi
    // sau:"), a picture/web-article pointer ("Xem hình nơi đầu bài.", "Xem bài trên trang web
    // ..."). isReviewableLffLine() already applies this same blunt "starts with Xem/Đọc" rule to
    // whole source lines; this mirrors it for fragments split off a longer line, which that
    // whole-line check never sees. Checked against every actual "Đọc ...”/"Xem ..." fragment in
    // the LFF corpus (147 of them) with zero false positives -- this corpus never opens a real
    // sentence with a bare "Đọc"/"Xem" the way "Đọc sách là..." (reading books is...) would.
    if (/^(?:Xem|Đọc)\b/i.test(s)) return true;
    s = s.replace(/^Đọc\s+/i, "");
    // "1 Tê-sa-lô-ni-ca 5:11.", "Công vụ 17:11" -- a bare Bible book/chapter:verse citation,
    // optionally followed by a named translation/edition ("—Ma-thi-ơ 5:4, Các Giờ Kinh Phụng
    // Vụ.", "—Matthew 5:5, King James Version.") when a householder cites a Bible other than the
    // New World Translation. That trailing clause must itself start with a capital letter (a
    // proper-noun title) so a real sentence that happens to continue past a citation in lower-
    // case prose -- "Kinh Thánh Thi-thiên 37:29 cho biết như sau." (the Bible, at Psalm 37:29,
    // says the following) -- is never mistaken for one.
    return /^\d{0,2}\s*[A-ZÀ-Ỹ][^".!?“”‘’]*\d+:\d+[\d,;:\-–\s]*(?:,\s*[A-ZÀ-Ỹ][^".!?“”‘’]*)?\.?$/.test(s);
  }
  function addSentencePairs(target, vietnamese, meaning) {
    sentencePairs(stripReviewListMarker(vietnamese), stripReviewListMarker(meaning)).forEach(function (pair) {
      // A "Vietnamese" side that contains Hangul is a mis-split fragment (e.g. "/ quyển vở노트"), not a sentence to order.
      if (pair.vi && /[가-힣]/.test(pair.vi)) return;
      if (pair.vi && pair.kr && pair.kr.trim() && !isIsolatedJw(pair.vi) && !isIsolatedJw(pair.kr) && !isCitationOnlyLine(pair.vi)) {
        pair.vi = normalizeJwOrg(pair.vi);
        pair.kr = normalizeJwOrg(pair.kr);
        target.push(pair);
      }
    });
  }

  function renderCurrNeighbor() {
    var root = document.getElementById("curr-neighbor-root");
    if (!root) return;
    var openSyls = {};
    var existing = root.querySelectorAll('.group-card[data-open="true"]');
    if (existing.length) {
      existing.forEach(function (c) { openSyls[c.dataset.syl] = true; });
    } else if (!root.dataset.rendered && NEIGHBOR_CONVERSATIONS.length) {
      openSyls["nb0"] = true;
    }
    root.dataset.rendered = "true";

    var html = "";
    NEIGHBOR_CONVERSATIONS.forEach(function (conv, ci) {
      var lineUnits = [];
      conv.lines.forEach(function (line) {
        var vi = applyNeighborTermsVi(line.vi);
        var kr = applyNeighborTermsMeaning(T(line), currentLang);
        sentencePairs(vi, kr).forEach(function (pair) {
          lineUnits.push({ who: line.who, vi: pair.vi, kr: pair.kr });
        });
      });
      var readPairs = [[conv.title.vi, T(conv.title)]].concat(lineUnits.map(function (line) { return [line.vi, line.kr]; }));
      html += '<div class="group-card" data-open="' + (openSyls["nb" + ci] ? "true" : "false") + '" data-syl="nb' + ci + '">' +
        '<div class="group-head-row"><button class="group-head"><span><span class="syl">' + (ci + 1) + '.</span> ' +
        '<span class="lff-title"><span class="lff-title-vi">' + escapeHtml(conv.title.vi) + '</span>' + titleTrSpan(conv.title) + '</span></span>' +
        currChev() + '</button>' + readAllButtonHtml(readPairs) + '</div>' +
        '<div class="group-body"><div class="talk-lines">';
      lineUnits.forEach(function (l) {
        html += '<div class="talk-line"><span class="talk-who">' + escapeHtml(neighborWhoLabel(l.who)) + '</span>' +
          '<div class="talk-body"><div class="talk-vi">' + escapeHtml(l.vi) +
          '<button class="speak-btn" data-speak="' + escapeAttr(l.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(l.kr) + '</span>' +
          '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(l.kr) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '</div></div></div>';
      });
      html += '</div></div></div>';
    });
    root.innerHTML = html;
    bindCurrGroupCards(root);
    bindCurrSpeakBtns(root);
  }

  // "대화 > 일상 회화" -- DAILY_CONVERSATIONS holds 21 real dialogues from "베트남어 일상 회화"
  // (lessons 1-13), vi/ko verbatim from the textbook (both languages are printed side by side in
  // the source) with zh/en/ja added as natural conversational translations. Only 5 languages (no
  // de/fr/pl/cs/hu yet).
  //
  // "who" is just another T()-shaped field, no special-casing needed: role titles ("Bác sĩ",
  // "Người phục vụ", ...) have real ko/zh/en/ja translations that a plain lookup returns
  // correctly, and renamed characters (Minh/Tuấn/Lan) were generated with the same Vietnamese
  // spelling already stored under ko/zh/en/ja too, so a plain lookup returns the right name there
  // as well. (A previous version of this function forced "vi" first for every case, which broke
  // role titles -- e.g. "의사"/"醫生"/"Doctor"/"医師" all showing as "Bác sĩ".)
  function dailyWhoLabel(who) {
    return T(who);
  }
  function renderCurrDaily(q) {
    var root = document.getElementById("curr-daily-root");
    if (!root) return;
    var openSyls = {};
    var existing = root.querySelectorAll('.group-card[data-open="true"]');
    if (existing.length) {
      existing.forEach(function (c) { openSyls[c.dataset.syl] = true; });
    } else if (!root.dataset.rendered && DAILY_CONVERSATIONS.length) {
      openSyls["dc0"] = true;
    }
    root.dataset.rendered = "true";

    var ql = q ? q.toLowerCase() : "";
    var html = "";
    DAILY_CONVERSATIONS.forEach(function (conv, ci) {
      var turns = conv.turns.map(function (t) { return { who: t.who, vi: applyDailyPronouns(conv, t), kr: T(t) }; });
      var vocab = (conv.vocab || []).map(function (v) { return { vi: v.vi, kr: T(v) }; });
      if (ql) {
        var hit = conv.title.vi.toLowerCase().indexOf(ql) >= 0 || T(conv.title).toLowerCase().indexOf(ql) >= 0 ||
          turns.some(function (t) {
            return t.vi.toLowerCase().indexOf(ql) >= 0 || t.kr.toLowerCase().indexOf(ql) >= 0 ||
              dailyWhoLabel(t.who).toLowerCase().indexOf(ql) >= 0;
          }) ||
          vocab.some(function (v) { return v.vi.toLowerCase().indexOf(ql) >= 0 || v.kr.toLowerCase().indexOf(ql) >= 0; });
        if (!hit) return;
      }
      var readPairs = [[conv.title.vi, T(conv.title)]].concat(turns.map(function (t) { return [t.vi, t.kr]; }));
      html += '<div class="group-card" data-open="' + (openSyls["dc" + ci] ? "true" : "false") + '" data-syl="dc' + ci + '">' +
        '<div class="group-head-row"><button class="group-head"><span><span class="syl">' + (ci + 1) + '.</span> ' +
        '<span class="lff-title"><span class="lff-title-vi">' + escapeHtml(conv.title.vi) + '</span>' + titleTrSpan(conv.title) + '</span></span>' +
        currChev() + '</button>' + readAllButtonHtml(readPairs) + '</div>' +
        '<div class="group-body"><div class="talk-lines">';
      turns.forEach(function (t) {
        html += '<div class="talk-line"><span class="talk-who">' + escapeHtml(dailyWhoLabel(t.who)) + '</span>' +
          '<div class="talk-body"><div class="talk-vi">' + escapeHtml(t.vi) +
          '<button class="speak-btn" data-speak="' + escapeAttr(t.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(t.kr) + '</span>' +
          '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(t.kr) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '</div></div></div>';
      });
      if (vocab.length) {
        html += '<div class="word-row" style="border-top:none;padding-top:10px"><b>' + TU("단어") + '</b></div>';
        vocab.forEach(function (v) {
          html += '<div class="word-row"><span class="w">' + escapeHtml(v.vi) +
            '<button class="speak-btn" data-speak="' + escapeAttr(v.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></span>' +
            '<span class="m">' + escapeHtml(v.kr) + '</span></div>';
        });
      }
      html += '</div></div>';
    });
    if (q && !html) html = '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    root.innerHTML = html;
    bindCurrGroupCards(root);
    bindCurrSpeakBtns(root);
  }
  (function () {
    var input = document.getElementById("daily-search");
    if (input) input.addEventListener("input", function () { renderCurrDaily(input.value.trim()); });
  })();
  // Re-render on a language change, same fix already applied to LFF/LPD above -- this pane was
  // otherwise only rendered once at startup/subtab-entry, leaving the initial language's
  // speaker names/dialogue/translations on screen after a later language switch.
  onLangChange(function () {
    var input = document.getElementById("daily-search");
    renderCurrDaily(input ? input.value.trim() : "");
  });

  // "문장 > 행복한 삶을 영원히(전체)" (Enjoy Life Forever! -- full Excel source, 72 units x 10
  // languages). Lives alongside, not inside, the "문장" tab's own "행복한 삶을 영원히" subtab
  // (LFF_CONVERSATIONS, 5-language sentence-split body text) -- originally implemented under
  // [대화], moved here so the same feature isn't shown under two different top-level menus. This
  // renders ENJOY_LIFE_FOREVER verbatim at row granularity (no sentence splitting, no reordering --
  // an Excel row's 12 language cells must stay aligned exactly as given) and only ever renders the
  // ONE currently selected unit's rows (up to ~412 for the largest lessons), never all 72 at once,
  // since the underlying JSON is multiple MB. The site-wide currentLang only covers 7 languages
  // (no cs/hu/zh_cn/id), so translation language here is a separate, panel-local selector/localStorage
  // key rather than reusing currentLang -- UI chrome (buttons, empty-state text) still follows the
  // site-wide currentLang via TU(), only the row content follows this local picker.
  var LFF2_LANGS = ["cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"];
  var LFF2_STORAGE_KEY = "vn-app-lff2-v1";
  var lff2State = { lang: null, unitId: null };
  (function loadLff2State() {
    try {
      var raw = window.localStorage && window.localStorage.getItem(LFF2_STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && LFF2_LANGS.indexOf(parsed.lang) >= 0) lff2State.lang = parsed.lang;
        if (parsed && typeof parsed.unitId === "number") lff2State.unitId = parsed.unitId;
      }
    } catch (e) { /* no-op: localStorage unavailable */ }
    if (!lff2State.lang) lff2State.lang = LFF2_LANGS.indexOf(currentLang) >= 0 ? currentLang : "ko";
  })();
  function saveLff2State() {
    try { window.localStorage && window.localStorage.setItem(LFF2_STORAGE_KEY, JSON.stringify(lff2State)); } catch (e) { /* no-op */ }
  }

  // Fixed part boundaries by unit id, exactly matching the course's own Section 1-4 structure
  // (units never get reordered -- see ENJOY_LIFE_FOREVER.units).
  var LFF2_PART_RANGES = [
    { part: 1, startId: 1, endId: 14 },
    { part: 2, startId: 15, endId: 37 },
    { part: 3, startId: 38, endId: 53 },
    { part: 4, startId: 54, endId: 72 }
  ];
  var LFF2_PART_LABEL_FN = {
    vi: function (n) { return "Phần " + n; },
    cs: function (n) { return "Část " + n; },
    zh_cn: function (n) { return "第" + n + "部"; },
    zh: function (n) { return "第" + n + "部"; },
    en: function (n) { return "Part " + n; },
    fr: function (n) { return "Partie " + n; },
    de: function (n) { return "Teil " + n; },
    hu: function (n) { return n + ". rész"; },
    id: function (n) { return "Bagian " + n; },
    ja: function (n) { return "第" + n + "部"; },
    ko: function (n) { return "제" + n + "부"; },
    pl: function (n) { return "Część " + n; }
  };
  function lff2PartLabel(n) {
    return (LFF2_PART_LABEL_FN[lff2State.lang] || LFF2_PART_LABEL_FN.ko)(n);
  }
  function lff2RowText(row, lang) {
    var v = row[lang];
    return typeof v === "string" ? v.trim() : "";
  }
  // Every unit's own row 1 already carries its title in all 10 languages (verbatim, from the
  // source publication) -- reused as-is for menu/header labels instead of writing new translations.
  function lff2UnitLabel(u, lang) {
    var row0 = u && u.rows && u.rows[0];
    if (!row0) return u ? u.labelKo : "";
    return lff2RowText(row0, lang) || lff2RowText(row0, "vi");
  }

  function renderLff2Picker() {
    var root = document.getElementById("lff2-picker-root");
    if (!root || typeof ENJOY_LIFE_FOREVER === "undefined") return;
    var units = ENJOY_LIFE_FOREVER.units;
    var lang = lff2State.lang;
    var openParts = {};
    root.querySelectorAll('.lff2-part[data-open="true"]').forEach(function (p) { openParts[p.dataset.part] = true; });
    var firstRender = !root.dataset.rendered;
    root.dataset.rendered = "true";
    var html = "";
    LFF2_PART_RANGES.forEach(function (range) {
      var partOpen = Object.prototype.hasOwnProperty.call(openParts, String(range.part))
        ? openParts[String(range.part)]
        : (firstRender && range.part === 1);
      html += '<section class="lff2-part" data-part="' + range.part + '" data-open="' + (partOpen ? "true" : "false") + '">' +
        '<button type="button" class="lff2-part-head" aria-expanded="' + (partOpen ? "true" : "false") + '">' +
        '<span>' + escapeHtml(lff2PartLabel(range.part)) + '</span>' + currChev() + '</button><div class="lff2-part-body">';
      var itemsHtml = "";
      for (var id = range.startId; id <= range.endId; id++) {
        var u = units[id - 1];
        if (!u || u.id !== id) u = units.filter(function (x) { return x.id === id; })[0];
        if (!u) continue;
        var isCurrent = lff2State.unitId === u.id;
        var label = lff2UnitLabel(u, lang);
        if (u.type === "lesson") {
          itemsHtml += '<button type="button" class="lff2-unit-btn" data-unit-id="' + u.id + '" aria-current="' + (isCurrent ? "true" : "false") + '" title="' + escapeAttr(label) + '" aria-label="' + escapeAttr(label) + '">' + u.lesson + '</button>';
        } else {
          itemsHtml += '<button type="button" class="lff2-special-btn" data-unit-id="' + u.id + '" aria-current="' + (isCurrent ? "true" : "false") + '">' + escapeHtml(label) + '</button>';
        }
      }
      html += '<div class="lff2-unit-grid">' + itemsHtml + '</div></div></section>';
    });
    root.innerHTML = html;
    root.querySelectorAll(".lff2-part-head").forEach(function (button) {
      button.addEventListener("click", function () {
        var part = button.closest(".lff2-part");
        var willOpen = part.dataset.open !== "true";
        part.dataset.open = willOpen ? "true" : "false";
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
    root.querySelectorAll("[data-unit-id]").forEach(function (btn) {
      btn.addEventListener("click", function () { renderLff2Unit(Number(btn.dataset.unitId)); });
    });
  }

  // Builds only the row-list HTML (not the header/nav around it) so the per-unit search box can
  // refresh just this part without rebuilding prev/next buttons on every keystroke.
  function lff2BuildRowsHtml(unit, lang, query) {
    var q = query ? query.toLowerCase() : "";
    var html = "";
    (unit.rows || []).forEach(function (row) {
      var vi = lff2RowText(row, "vi");
      var tr = lang === "vi" ? "" : lff2RowText(row, lang);
      if (!vi && !tr) return;
      if (q && vi.toLowerCase().indexOf(q) < 0 && (!tr || tr.toLowerCase().indexOf(q) < 0)) return;
      html += '<div class="lff2-row"><span class="lff2-row-num">' + row.row + '</span><div class="lff2-row-body">';
      if (vi) {
        html += '<div class="lff2-row-vi">' + escapeHtml(vi) +
          '<button type="button" class="speak-btn" data-speak="' + escapeAttr(vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      }
      if (tr) html += '<div class="lff2-row-tr">' + escapeHtml(tr) + '</div>';
      html += '</div></div>';
    });
    return html || '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
  }

  function renderLff2Unit(unitId) {
    var pickerRoot = document.getElementById("lff2-picker-root");
    var viewerRoot = document.getElementById("lff2-viewer-root");
    if (!pickerRoot || !viewerRoot || typeof ENJOY_LIFE_FOREVER === "undefined") return;
    var units = ENJOY_LIFE_FOREVER.units;
    var unit = units[unitId - 1] && units[unitId - 1].id === unitId ? units[unitId - 1] : units.filter(function (u) { return u.id === unitId; })[0];
    if (!unit) return;
    var idx = units.indexOf(unit);
    var lang = lff2State.lang;
    lff2State.unitId = unitId;
    saveLff2State();

    pickerRoot.style.display = "none";
    viewerRoot.style.display = "";

    var prevUnit = units[idx - 1] || null;
    var nextUnit = units[idx + 1] || null;
    var titleText = lff2UnitLabel(unit, lang);

    var html = '<div class="lff2-viewer-head">' +
      '<button type="button" class="lff2-back-btn" id="lff2-back-btn">← ' + escapeHtml(TU("목록")) + '</button>' +
      '<div class="lff2-unit-title">' + escapeHtml(titleText) + '</div></div>' +
      '<div class="lff2-nav-row">' +
      '<button type="button" class="lff2-nav-btn" id="lff2-prev-btn"' + (prevUnit ? "" : " disabled") + '>' +
      (prevUnit ? "← " + escapeHtml(lff2UnitLabel(prevUnit, lang)) : escapeHtml(TU("이전"))) + '</button>' +
      '<button type="button" class="lff2-nav-btn" id="lff2-next-btn"' + (nextUnit ? "" : " disabled") + '>' +
      (nextUnit ? escapeHtml(lff2UnitLabel(nextUnit, lang)) + " →" : escapeHtml(TU("다음"))) + '</button>' +
      '</div>' +
      '<div class="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input type="text" id="lff2-search" data-i18n-placeholder="베트남어 문장이나 뜻으로 검색" placeholder="' + escapeAttr(TU("베트남어 문장이나 뜻으로 검색")) + '"></div>' +
      '<div class="lff2-row-list" id="lff2-row-list">' + lff2BuildRowsHtml(unit, lang) + '</div>';

    viewerRoot.innerHTML = html;
    bindCurrSpeakBtns(viewerRoot);

    var backBtn = document.getElementById("lff2-back-btn");
    if (backBtn) backBtn.addEventListener("click", function () {
      viewerRoot.style.display = "none";
      pickerRoot.style.display = "";
      renderLff2Picker();
    });
    var prevBtn = document.getElementById("lff2-prev-btn");
    if (prevBtn && prevUnit) prevBtn.addEventListener("click", function () { renderLff2Unit(prevUnit.id); window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); });
    var nextBtn = document.getElementById("lff2-next-btn");
    if (nextBtn && nextUnit) nextBtn.addEventListener("click", function () { renderLff2Unit(nextUnit.id); window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); });

    var searchInput = document.getElementById("lff2-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var listRoot = document.getElementById("lff2-row-list");
        if (!listRoot) return;
        listRoot.innerHTML = lff2BuildRowsHtml(unit, lang, searchInput.value.trim());
        bindCurrSpeakBtns(listRoot);
      });
    }
  }

  function populateLff2LangSelect() {
    var sel = document.getElementById("lff2-lang-select");
    if (!sel || sel.dataset.populated || typeof ENJOY_LIFE_FOREVER === "undefined") return;
    sel.dataset.populated = "true";
    var names = ENJOY_LIFE_FOREVER.languages || {};
    sel.innerHTML = LFF2_LANGS.map(function (code) {
      return '<option value="' + code + '"' + (code === lff2State.lang ? " selected" : "") + '>' + escapeHtml(names[code] || code) + '</option>';
    }).join("");
    sel.addEventListener("change", function () {
      if (LFF2_LANGS.indexOf(sel.value) < 0) return;
      lff2State.lang = sel.value;
      saveLff2State();
      renderLff2Picker();
      if (lff2State.unitId) renderLff2Unit(lff2State.unitId);
    });
  }

  function initLff2() {
    if (typeof ENJOY_LIFE_FOREVER === "undefined" || document.body.dataset.lff2Init) return;
    document.body.dataset.lff2Init = "true";
    populateLff2LangSelect();
    renderLff2Picker();
    if (lff2State.unitId) {
      renderLff2Unit(lff2State.unitId);
    } else {
      document.getElementById("lff2-picker-root").style.display = "";
      document.getElementById("lff2-viewer-root").style.display = "none";
    }
  }
  // Chrome text (목록/이전/다음/검색 placeholder/발음 듣기 aria-labels, via TU()) follows the
  // site-wide language switch even though the row content's translation language does not.
  onLangChange(function () {
    if (!document.body.dataset.lff2Init) return;
    if (lff2State.unitId) renderLff2Unit(lff2State.unitId);
  });

  // Shared engine behind the two other "(전체)" full-Excel-transcription viewers (Love People,
  // Watchtower Study) -- same verbatim-row-list behavior as LFF2 above (reuses its .lff2-* CSS,
  // since the two are visually identical), just without LFF2's part/section accordion, since
  // both of these datasets are small enough (<=24 items) for one flat grid.
  function createExcelFullViewer(opts) {
    var prefix = opts.prefix;
    var storageKey = "vn-app-" + prefix + "-v1";
    var state = { lang: null, unitId: null };
    (function loadState() {
      try {
        var raw = window.localStorage && window.localStorage.getItem(storageKey);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && LFF2_LANGS.indexOf(parsed.lang) >= 0) state.lang = parsed.lang;
          if (parsed && typeof parsed.unitId === "number") state.unitId = parsed.unitId;
        }
      } catch (e) { /* no-op: localStorage unavailable */ }
      if (!state.lang) state.lang = LFF2_LANGS.indexOf(currentLang) >= 0 ? currentLang : "ko";
    })();
    function saveState() {
      try { window.localStorage && window.localStorage.setItem(storageKey, JSON.stringify(state)); } catch (e) { /* no-op */ }
    }
    function rowText(row, lang) {
      var v = row[lang];
      return typeof v === "string" ? v.trim() : "";
    }
    function unitLabel(u, lang) {
      var row0 = u && u.rows && u.rows[0];
      if (!row0) return u ? u.labelKo : "";
      return rowText(row0, lang) || rowText(row0, "vi");
    }
    function unitButtonText(u) {
      if (u.type === "lesson") return String(u.lesson);
      if (u.type === "week") return String(u.week);
      return null;
    }
    function buildRowsHtml(unit, lang, query) {
      var q = query ? query.toLowerCase() : "";
      var html = "";
      (unit.rows || []).forEach(function (row) {
        var vi = rowText(row, "vi");
        var tr = lang === "vi" ? "" : rowText(row, lang);
        if (!vi && !tr) return;
        if (q && vi.toLowerCase().indexOf(q) < 0 && (!tr || tr.toLowerCase().indexOf(q) < 0)) return;
        html += '<div class="lff2-row"><span class="lff2-row-num">' + row.row + '</span><div class="lff2-row-body">';
        if (vi) {
          html += '<div class="lff2-row-vi">' + escapeHtml(vi) +
            '<button type="button" class="speak-btn" data-speak="' + escapeAttr(vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
        }
        if (tr) html += '<div class="lff2-row-tr">' + escapeHtml(tr) + '</div>';
        html += '</div></div>';
      });
      return html || '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    }
    function renderPicker() {
      var root = document.getElementById(prefix + "-picker-root");
      var data = opts.getData();
      if (!root || !data) return;
      var units = data.units;
      var lang = state.lang;
      var itemsHtml = units.map(function (u) {
        var isCurrent = state.unitId === u.id;
        var label = unitLabel(u, lang);
        var btnText = unitButtonText(u);
        if (btnText !== null) {
          return '<button type="button" class="lff2-unit-btn" data-unit-id="' + u.id + '" aria-current="' + (isCurrent ? "true" : "false") + '" title="' + escapeAttr(label) + '" aria-label="' + escapeAttr(label) + '">' + btnText + '</button>';
        }
        return '<button type="button" class="lff2-special-btn" data-unit-id="' + u.id + '" aria-current="' + (isCurrent ? "true" : "false") + '">' + escapeHtml(label) + '</button>';
      }).join("");
      root.innerHTML = '<div class="lff2-unit-grid">' + itemsHtml + '</div>';
      root.querySelectorAll("[data-unit-id]").forEach(function (btn) {
        btn.addEventListener("click", function () { renderUnit(Number(btn.dataset.unitId)); });
      });
    }
    function renderUnit(unitId) {
      var pickerRoot = document.getElementById(prefix + "-picker-root");
      var viewerRoot = document.getElementById(prefix + "-viewer-root");
      var data = opts.getData();
      if (!pickerRoot || !viewerRoot || !data) return;
      var units = data.units;
      var unit = units[unitId - 1] && units[unitId - 1].id === unitId ? units[unitId - 1] : units.filter(function (u) { return u.id === unitId; })[0];
      if (!unit) return;
      var idx = units.indexOf(unit);
      var lang = state.lang;
      state.unitId = unitId;
      saveState();

      pickerRoot.style.display = "none";
      viewerRoot.style.display = "";

      var prevUnit = units[idx - 1] || null;
      var nextUnit = units[idx + 1] || null;
      var titleText = unitLabel(unit, lang);

      var searchId = prefix + "-search";
      var listId = prefix + "-row-list";
      var html = '<div class="lff2-viewer-head">' +
        '<button type="button" class="lff2-back-btn" id="' + prefix + '-back-btn">← ' + escapeHtml(TU("목록")) + '</button>' +
        '<div class="lff2-unit-title">' + escapeHtml(titleText) + '</div></div>' +
        '<div class="lff2-nav-row">' +
        '<button type="button" class="lff2-nav-btn" id="' + prefix + '-prev-btn"' + (prevUnit ? "" : " disabled") + '>' +
        (prevUnit ? "← " + escapeHtml(unitLabel(prevUnit, lang)) : escapeHtml(TU("이전"))) + '</button>' +
        '<button type="button" class="lff2-nav-btn" id="' + prefix + '-next-btn"' + (nextUnit ? "" : " disabled") + '>' +
        (nextUnit ? escapeHtml(unitLabel(nextUnit, lang)) + " →" : escapeHtml(TU("다음"))) + '</button>' +
        '</div>' +
        '<div class="search-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
        '<input type="text" id="' + searchId + '" data-i18n-placeholder="베트남어 문장이나 뜻으로 검색" placeholder="' + escapeAttr(TU("베트남어 문장이나 뜻으로 검색")) + '"></div>' +
        '<div class="lff2-row-list" id="' + listId + '">' + buildRowsHtml(unit, lang) + '</div>';

      viewerRoot.innerHTML = html;
      bindCurrSpeakBtns(viewerRoot);

      var backBtn = document.getElementById(prefix + "-back-btn");
      if (backBtn) backBtn.addEventListener("click", function () {
        viewerRoot.style.display = "none";
        pickerRoot.style.display = "";
        renderPicker();
      });
      var prevBtn = document.getElementById(prefix + "-prev-btn");
      if (prevBtn && prevUnit) prevBtn.addEventListener("click", function () { renderUnit(prevUnit.id); window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); });
      var nextBtn = document.getElementById(prefix + "-next-btn");
      if (nextBtn && nextUnit) nextBtn.addEventListener("click", function () { renderUnit(nextUnit.id); window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" }); });

      var searchInput = document.getElementById(searchId);
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          var listRoot = document.getElementById(listId);
          if (!listRoot) return;
          listRoot.innerHTML = buildRowsHtml(unit, lang, searchInput.value.trim());
          bindCurrSpeakBtns(listRoot);
        });
      }
    }
    function populateLangSelect() {
      var sel = document.getElementById(prefix + "-lang-select");
      var data = opts.getData();
      if (!sel || sel.dataset.populated || !data) return;
      sel.dataset.populated = "true";
      var names = data.languages || {};
      sel.innerHTML = LFF2_LANGS.map(function (code) {
        return '<option value="' + code + '"' + (code === state.lang ? " selected" : "") + '>' + escapeHtml(names[code] || code) + '</option>';
      }).join("");
      sel.addEventListener("change", function () {
        if (LFF2_LANGS.indexOf(sel.value) < 0) return;
        state.lang = sel.value;
        saveState();
        renderPicker();
        if (state.unitId) renderUnit(state.unitId);
      });
    }
    function init() {
      var data = opts.getData();
      if (!data || document.body.dataset[opts.initFlag]) return;
      document.body.dataset[opts.initFlag] = "true";
      populateLangSelect();
      renderPicker();
      if (state.unitId) {
        renderUnit(state.unitId);
      } else {
        document.getElementById(prefix + "-picker-root").style.display = "";
        document.getElementById(prefix + "-viewer-root").style.display = "none";
      }
    }
    onLangChange(function () {
      if (!document.body.dataset[opts.initFlag]) return;
      if (state.unitId) renderUnit(state.unitId);
    });
    return { init: init };
  }

  var lpd2Viewer = createExcelFullViewer({
    prefix: "lpd2",
    initFlag: "lpd2Init",
    getData: function () { return typeof LOVE_PEOPLE_FULL === "undefined" ? null : LOVE_PEOPLE_FULL; },
  });
  function initLpd2() { lpd2Viewer.init(); }

  var wt2Viewer = createExcelFullViewer({
    prefix: "wt2",
    initFlag: "wt2Init",
    getData: function () { return typeof WATCHTOWER_FULL === "undefined" ? null : WATCHTOWER_FULL; },
  });
  function initWt2() { wt2Viewer.init(); }

  // "행복한 삶을 영원히" (Enjoy Life Forever!) -- LFF_CONVERSATIONS holds the body-text sentences of
  // 5 languages, sourced from wol.jw.org (video call-outs and the trailing "더 찾아보기"/EXPLORE
  // section already excluded during data extraction). No "who" speaker field (unlike 이웃 사람과의
  // 대화) since this is study-course body text, not a two-party dialogue.
  function lffRecordLabel(rec) {
    if (rec.kind === "lesson") return "Bài " + (rec.num < 10 ? "0" + rec.num : String(rec.num));
    if (rec.kind === "review") return TU("복습");
    return "";
  }
  function lffPartLabel(partNumber) {
    if (currentLang === "zh") return "第" + partNumber + "部分";
    if (currentLang === "en") return "Part " + partNumber;
    if (currentLang === "ja") return "第" + partNumber + "部";
    return partNumber + "부";
  }
  // A few source paragraphs contain a Bible-reading cue inside the explanatory paragraph.
  // Keep the cue as its own bilingual line, so the explanation, quotation, reference and the
  // following thought are shown in the intended order in every language mode.
  function lffDisplayLines(rec) {
    var out = [];
    rec.lines.forEach(function (line) {
      if (line.vi.indexOf('Kinh Thánh hứa trong tương lai “sẽ không còn sự chết') === 0) {
        out.push(
          { vi: 'Kinh Thánh hứa trong tương lai “sẽ không còn sự chết, than van, khóc lóc hay đau đớn nữa”.', ko: '성경은 우리의 미래에 대해 이렇게 알려 줍니다. “더 이상 죽음이 없고, 슬픔과 부르짖음과 고통도 더는 없을 것이다.”', zh: '聖經說，將來「不再有死亡，也不再有哀痛、呼號、痛苦」。', en: 'The Bible describes a future time when “death will be no more, neither will mourning nor outcry nor pain be anymore.”', ja: '聖書によると，将来「死はなくなり，悲しみも嘆きも苦痛もなくなります」。' },
          { vi: '(Đọc Khải huyền 21:4).', ko: '(요한 계시록 21:4 을 읽어 보세요.)', zh: '（請讀啟示錄21:4。）', en: '(Read Revelation 21:4.)', ja: '（啓示21:4を読む。）' },
          { vi: 'Những vấn đề khiến cuộc sống có vẻ vô vọng như nghèo đói, bất công, bệnh tật và sự chết sẽ không còn nữa.', ko: '가난, 불공정, 질병, 죽음처럼 우리를 절망하게 만드는 문제들이 더는 없을 것입니다.', zh: '今天，貧窮、疾病、死亡以及各種不公正的事可能使人生看似毫無希望。可是，將來不會再有這些問題。', en: 'The problems that can make life seem hopeless today—such as poverty, injustice, sickness, and death—will no longer exist.', ja: '貧困，不正，病気，死といった問題が全部なくなるということです。' },
          { vi: 'Kinh Thánh hứa trái đất sẽ trở thành địa đàng và con người sẽ được sống mãi mãi trong đó.', ko: '성경은 사람들이 낙원이 된 땅에서 영원히 행복한 삶을 누릴 수 있을 것이라고 약속합니다.', zh: '聖經保證，地球會變成一個樂園，我們能夠在地上永遠過快樂的生活。', en: 'The Bible promises that humans will be able to enjoy life forever in Paradise on earth.', ja: '人間はパラダイスになった地球でいつまでも幸せに暮らせるようになると，聖書に約束されています。' }
        );
      } else if (line.vi.indexOf('Nhiều người hy vọng những điều tốt đẹp sẽ đến') === 0) {
        out.push(
          { vi: 'Nhiều người hy vọng những điều tốt đẹp sẽ đến nhưng không có gì bảo đảm là nó sẽ xảy ra.', ko: '많은 사람은 좋은 일이 있기를 희망하지만, 그 희망이 언젠가 이루어질 것이라고 자신할 수 없습니다.', zh: '很多人心中都有一些美好的希望，不過他們不確定自己的希望是否能實現。', en: 'Many people hope for good things to happen, but they cannot be sure that their hopes will ever be fulfilled.', ja: 'いいことが起こると言われても，なかなか信じられないかもしれません。' },
          { vi: 'Còn những lời hứa trong Kinh Thánh thì khác.', ko: '하지만 성경의 약속은 그와는 다릅니다.', zh: '但聖經給人的希望卻不一樣。', en: 'What the Bible promises is different.', ja: 'でも，聖書の約束は必ずその通りになります。' },
          { vi: 'Chúng ta có thể tin chắc những lời hứa ấy sẽ thành hiện thực khi “cẩn thận tra xem Kinh Thánh”.', ko: '“성경을 주의 깊이 조사” 한다면 성경의 내용을 신뢰하게 될 것입니다.', zh: '如果我們「用心查考聖經」，就能對這本書越來越有信心。', en: 'We can build up our trust in what it says by “carefully examining the Scriptures.”', ja: '「聖書を……注意深く調べ」ると，そのことが分かります。' },
          { vi: '(Công vụ 17:11)', ko: '(사도행전 17:11)', zh: '（使徒行傳17:11）', en: '(Acts 17:11)', ja: '（使徒17:11）' },
          { vi: 'Nhờ tìm hiểu Kinh Thánh, chính bạn sẽ biết những điều Kinh Thánh hứa về tương lai có đáng tin cậy hay không.', ko: '성경을 공부해 보면 미래에 관한 성경의 약속이 믿을 만한지 스스로 판단할 수 있을 것입니다.', zh: '你繼續學習就能看出聖經中的希望是否可信。', en: 'As you study the Bible, you will be able to decide for yourself whether you can believe what it says about the future.', ja: '聖書を学んで，将来について聖書に書かれていることが信じられるかどうかを確かめてください。' }
        );
      } else if (line.vi.indexOf('Kinh Thánh không chỉ giải thích tại sao thế giới') === 0) {
        out.push(
          { vi: 'Kinh Thánh không chỉ giải thích tại sao thế giới tràn ngập vấn đề mà còn cho biết tin mừng là những vấn đề ấy chỉ tạm thời thôi và sẽ sớm chấm dứt.', ko: '성경은 이 세상에 왜 이렇게 문제가 많은지 알려 줍니다. 하지만 그러한 문제들이 일시적이며 머지않아 사라질 것이라는 좋은 소식도 알려 줍니다.', zh: '聖經不但解釋了世界充滿難題的原因，也告訴我們這些難題只是暫時的，很快就會解決。', en: 'The Bible not only explains why the world is full of problems but also gives the good news that these problems are temporary and will soon end.', ja: '聖書は，世の中に問題が多い理由を説明し，そうした問題が一時的で，間もなくなくなるという良い知らせも伝えています。' },
          { vi: 'Tương lai mà Kinh Thánh hứa có thể giúp bạn có hy vọng.', ko: '성경은 밝은 “미래” 를 약속하며 그 약속은 우리에게 “희망” 을 줍니다.', zh: '聖經中提到的「前途」讓我們有「希望」。', en: 'The future that the Bible promises can give you hope.', ja: '聖書が約束している将来は，希望を与えてくれます。' },
          { vi: '(Đọc Giê-rê-mi 29:11, 12).', ko: '(예레미야 29:11, 12 을 읽어 보세요.)', zh: '（請讀耶利米書29:11，12。）', en: '(Read Jeremiah 29:11, 12.)', ja: '（エレミヤ29:11，12を読む。）' },
          { vi: 'Những lời hứa ấy giúp mỗi người trong chúng ta đối phó với vấn đề hiện tại, có quan điểm tích cực và tìm được hạnh phúc lâu dài.', ko: '성경의 약속은 우리가 지금 겪는 문제들을 잘 이겨 내고 긍정적인 태도를 갖는 데 도움이 되며, 영원한 행복의 길을 알려 줍니다.', zh: '知道這一點能幫助我們面對目前的難題，保持積極，也能確信未來有永遠快樂的生活。', en: 'Those promises can help us cope with present problems, stay positive, and find lasting happiness.', ja: 'そうした約束は，今の問題に立ち向かい，前向きな考え方を保ち，永続する幸せを見いだす助けになります。' }
        );
      } else if (line.vi.indexOf('Kinh Thánh khẳng định những gì được ghi') === 0) {
        out.push(
          { vi: 'Kinh Thánh khẳng định những gì được ghi trong đó là “những lời chân thật”.', ko: '성경은 그 안에 담긴 기록이 “진리의 정확한 말씀” 이라고 말합니다.', zh: '聖經說，寫聖經的人「力求用正確的字眼寫下真理」。', en: 'The Bible says that what is written in it is “words of truth.”', ja: '聖書には「真実」が「正確に記録」されています。' },
          { vi: '(Truyền đạo 12:10)', ko: '(전도서 12:10)', zh: '（傳道書12:10）', en: '(Ecclesiastes 12:10)', ja: '（伝道の書12:10）' },
          { vi: 'Kinh Thánh kể lại về người thật việc thật.', ko: '성경에는 실존 인물들과 실제 사건들에 관한 기록이 들어 있습니다.', zh: '聖經記錄了許多真人真事。', en: 'The Bible records real people and real events.', ja: '実在した人たちや実際にあった出来事について書かれています。' },
          { vi: '(Đọc Lu-ca 1:1, 3; 3:1, 2).', ko: '(누가복음 1:3; 3:1, 2 을 읽어 보세요.)', zh: '（請讀路加福音1:1，3；3:1，2。）', en: '(Read Luke 1:1, 3; 3:1, 2.)', ja: '（ルカ1:1，3；3:1，2を読む。）' },
          { vi: 'Nhiều sử gia và nhà khảo cổ đã xác nhận rằng những ngày tháng, nhân vật, nơi chốn và sự kiện quan trọng được ghi lại trong Kinh Thánh là chính xác.', ko: '많은 역사가들과 고고학자들은 성경에 나오는 중요한 날짜, 인물, 장소, 사건이 정확하다는 것을 확증해 줍니다.', zh: '許多歷史家和考古學家都證實，聖經記載的重要年代、人物、地點和事件都很準確。', en: 'Many historians and archaeologists have confirmed that the important dates, people, places, and events recorded in the Bible are accurate.', ja: '聖書に記されている年代，人物，場所，出来事が正確だということを，多くの歴史家や考古学者が認めています。' }
        );
      } else if (line.vi.indexOf('Kinh Thánh có những lời tiên tri báo trước') === 0) {
        out.push(
          { vi: 'Kinh Thánh có những lời tiên tri báo trước “việc chưa làm”, tức việc chưa xảy ra.', ko: '성경에는 “아직 이루어지지 않은 일들” 을 미리 알려 주는 예언들이 들어 있습니다.', zh: '聖經有預言能預先說明「未來還沒有發生的事」。', en: 'The Bible contains prophecies that foretell “things not yet done,” that is, things that have not yet happened.', ja: '聖書には，まだ起きていない「将来の事柄」を前もって伝える預言があります。' },
          { vi: '(Ê-sai 46:10)', ko: '(이사야 46:10)', zh: '（以賽亞書46:10）', en: '(Isaiah 46:10)', ja: '（イザヤ46:10）' },
          { vi: 'Kinh Thánh báo trước chính xác nhiều sự kiện lịch sử mà rất lâu sau mới xảy ra.', ko: '성경은 많은 역사적인 사건을 그 일이 일어나기 오래 전에 정확하게 예언했습니다.', zh: '聖經準確預告了許多很久以後才發生的歷史事件。', en: 'The Bible accurately foretold many historical events long before they happened.', ja: '聖書は，多くの歴史上の出来事を，実際に起きるずっと前に正確に予告していました。' },
          { vi: 'Sách này cũng miêu tả tình trạng thế giới hiện nay với những chi tiết nổi bật.', ko: '또한 성경은 오늘날의 세상 상태를 놀랄 만큼 구체적으로 예언했습니다.', zh: '聖經也詳細描述了今天的世界情況。', en: 'It also describes the condition of today’s world in remarkable detail.', ja: '今の世の中についても前もって詳しく書かれていました。' },
          { vi: 'Trong bài này, chúng ta sẽ xem xét một số lời tiên tri đáng kinh ngạc.', ko: '이 과에서는 성경 예언 몇 가지를 살펴볼 것입니다. 그 예언들은 매우 정확하게 성취되었습니다!', zh: '這一課，我們會看看聖經中的一些預言。', en: 'In this lesson, we will examine some remarkable prophecies.', ja: 'このレッスンでは驚くほど正確な聖書の預言を幾つか調べます。' }
        );
      } else if (line.vi.indexOf('Lịch sử chứng thực rằng vua của Ba Tư') === 0) {
        out.push(
          { vi: 'Hiện nay, hơn 2.500 năm sau, thành Ba-by-lôn xưa chỉ còn là đống hoang tàn.', ko: '2500여 년이 지난 지금까지도 바빌론은 폐허로 남아 있습니다.', zh: '2500多年後，巴比倫城曾經所在的地方如今是一片廢墟。', en: 'Today, more than 2,500 years later, ancient Babylon is still in ruins.', ja: '2500年以上たった今も，バビロンは廃墟のままです。' },
          { vi: 'Hãy xem Kinh Thánh báo trước như thế nào.', ko: '그에 관한 성경 예언에 유의해 보세요.', zh: '這と聖經の預言を比べてみましょう。', en: 'Notice what the Bible foretold.', ja: '聖書がどのように予告していたかを見てみましょう。' }
        );
      } else if (line.vi.indexOf('Kinh Thánh cho biết chúng ta đang sống trong “những ngày sau cùng”') === 0) {
        out.push(
          { vi: 'Kinh Thánh cho biết chúng ta đang sống trong “những ngày sau cùng”.', ko: '성경은 우리가 살고 있는 시대를 “마지막 날”이라고 부릅니다.', zh: '聖經把我們生活的時代稱為「最後的日子」。', en: 'The Bible refers to our time as “the last days.”', ja: '聖書の中で，今は「終わりの時代」と言われています。' },
          { vi: '(2 Ti-mô-thê 3:1)', ko: '(디모데 후서 3:1)', zh: '（提摩太後書3:1）', en: '(2 Timothy 3:1)', ja: '（テモテ第二3:1）' },
          { vi: 'Hãy xem Kinh Thánh báo trước như thế nào về thời kỳ này.', ko: '우리 시대에 관한 성경 예언에 유의해 보세요.', zh: '請看看聖經怎樣預告這段時期會發生的事。', en: 'Notice what the Bible foretold about this time period.', ja: 'この時代についてどんなことが予告されていたでしょうか。' }
        );
      } else if (line.vi.indexOf('Chúng ta có thể “tôn kính Đức Giê-hô-va bằng những điều quý báu của [mình]”') === 0 && line.vi.indexOf('(Châm ngôn 3:9)') >= 0) {
        out.push(
          { vi: 'Chúng ta có thể “tôn kính Đức Giê-hô-va bằng những điều quý báu của [mình]”.', ko: '우리는 ‘우리가 가진 가치 있는 것들로 여호와를 공경’할 수 있습니다.', zh: '我們可以用寶貴的資產尊崇耶和華。', en: 'We can “honor Jehovah with [our] valuable things.”', ja: '自分の 「貴重なもの……を捧げてエホバを敬え」ます。' },
          { vi: '(Châm ngôn 3:9).', ko: '(잠언 3:9)', zh: '（箴言3:9）', en: '(Proverbs 3:9)', ja: '（格言 3:9）' },
          { vi: 'Thật là một đặc ân khi được đóng góp tiền bạc và những thứ khác để ủng hộ hội thánh địa phương và công việc rao giảng toàn cầu!', ko: '우리는 자신의 회중과 세계적인 전파 활동을 지원하기 위해 돈과 그 밖의 자산을 기부하는 일에 기쁘게 참여합니다.', zh: '能用金錢或其他財物支持會眾和全球的傳道工作，這讓我們感到很榮幸。', en: 'We count it a privilege to contribute money and other resources to support the local congregation and the worldwide preaching work.', ja: 'お金や他の資産を寄付することによって，自分の会衆や世界的な伝道活動をサポートできます。' },
          { vi: '(Đọc 2 Cô-rinh-tô 9:7).', ko: '(고린도 후서 9:7 을 읽어 보세요.)', zh: '（請讀 哥林多後書9:7）', en: '(Read 2 Corinthians 9:7.)', ja: '（コリント第二 9:7 を読む。）' },
          { vi: 'Khoản đóng góp của chúng ta cũng được dùng cho công việc cứu trợ.', ko: '우리의 헌금은 재해 구호 활동에도 사용됩니다.', zh: '我們的捐獻也能支援救災工作。', en: 'Our donations also support disaster relief.', ja: '寄付は災害時の救援活動にも使われます。' },
          { vi: 'Nhiều người thường xuyên “dành riêng một số tiền” để đóng góp.', ko: '많은 사람들은 정기적으로 헌금을 하기 위해 “얼마를 따로 모아 둡니다.”', zh: '不少弟兄姐妹都定期「撥出一些錢」作為捐獻。', en: 'Many choose to “set something aside” regularly as a donation.', ja: '多くの人は，寄付するために定期的に「幾らかを取り分けて」おきます。' },
          { vi: '(Đọc 1 Cô-rinh-tô 16:2).', ko: '(고린도 전서 16:2 을 읽어 보세요.)', zh: '（請讀 哥林多前書16:2）', en: '(Read 1 Corinthians 16:2.)', ja: '（コリント第一 16:2 を読む。）' },
          { vi: 'Chúng ta có thể đóng góp bằng cách bỏ tiền vào hộp đóng góp tại những nơi thờ phượng hoặc đóng góp trực tuyến trên trang donate.jw.org.', ko: '우리는 숭배 장소에 있는 헌금함에 헌금할 수도 있고 donate.jw.org 에서 온라인으로 기부할 수도 있습니다.', zh: '我們可以把錢投進崇拜場所裡的捐款箱，或上 donate.jw.org 網站捐款。', en: 'We can donate using contribution boxes at our places of worship or online at donate.jw.org.', ja: '王国会館にある寄付箱に寄付を入れることもできますし， donate.jw.org からオンラインで寄付することもできます。' },
          { vi: 'Đức Giê-hô-va cho chúng ta cơ hội để thể hiện tình yêu thương với ngài qua việc đóng góp.', ko: '여호와께서는 우리가 자신의 자산을 사용해 그분에 대한 사랑을 나타낼 수 있는 기회를 주십니다.', zh: '耶和華讓我們有機會表達對他的愛。我們善用財物就是表明自己愛耶和華了。', en: 'Jehovah gives us the opportunity to show our love for him by the way we choose to use our material things.', ja: '自分のお金や持ち物を差し出すことによってエホバへの愛を表せるのは，うれしいことです。' }
        );
      } else {
        // Put a full stop before a trailing parenthetical Bible citation. This lets the normal
        // sentence splitter present the citation as its own line instead of attaching it to the
        // preceding Vietnamese sentence. The same normalization keeps the translations aligned.
        // Scoped to citation-shaped parens (chapter:verse digit pattern) only -- an ordinary
        // clarifying parenthetical like "(trọn bộ hay một phần)" isn't a citation and shouldn't
        // get a fabricated sentence break in front of it.
        var normalized = {};
        Object.keys(line).forEach(function (key) {
          normalized[key] = typeof line[key] === "string"
            ? line[key].replace(/([^\s.!?…])\s*([（(][^()（）]*\d+:\d+[^()（）]*[)）])/g, "$1. $2")
            : line[key];
        });
        // Parenthetical Bible citations may use ASCII "()" or full-width "（）" (Chinese / Japanese).
        // Chapter:verse digit pattern ensures only scripture citations split, not arbitrary parentheticals.
        var CITATION_PAREN_SPLIT = /([（(][^()（）]*\d+:\d+[^()（）]*[)）][.。]?)/;
        var viSegments = String(normalized.vi || "").split(CITATION_PAREN_SPLIT).map(function (s) { return s.trim(); }).filter(Boolean);
        var hasCitation = viSegments.some(function (part) {
          return /^[（(](?:Đọc\s+|請讀\s+|読む|읽어\s*보세요|Read\s+)?[^()（）]*\d+:\d+[^()（）]*[)）][.。]?$/i.test(part);
        });
        if (hasCitation && viSegments.length > 1) {
          var byLang = {};
          Object.keys(normalized).forEach(function (key) {
            byLang[key] = typeof normalized[key] === "string"
              ? normalized[key].split(CITATION_PAREN_SPLIT).map(function (s) { return s.trim(); }).filter(Boolean)
              : [normalized[key]];
          });
          viSegments.forEach(function (segment, index) {
            var separated = {};
            Object.keys(normalized).forEach(function (key) {
              separated[key] = typeof normalized[key] === "string" ? String(byLang[key][index] || "").trim() : normalized[key];
            });
            out.push(separated);
          });
        } else out.push(normalized);
      }
    });
    // Extraction artifacts occasionally inserted a standalone Latin "a" into CJK/Korean
    // translations. It is not source text, so remove it without touching Vietnamese or English.
    return out.map(function (line) {
      // Vietnamese does not begin a sentence with a standalone Latin "a". This is an
      // extraction artifact, so remove it (and the following space) before display or review.
      if (typeof line.vi === "string") line.vi = line.vi.replace(/^a\s+/, "");
      ["ko", "zh", "ja"].forEach(function (key) {
        if (typeof line[key] === "string") line[key] = line[key].replace(/\s+a\s+/g, " ");
      });
      return line;
    });
  }
  function isReviewableLffLine(line) {
    var vi = String(line.vi || '').trim();
    if (isIsolatedJw(vi) || isIsolatedJw(line.ko) || isIsolatedJw(line.kr)) return false;
    // Reading directions, cross-references, headings and bare numbered prompts are navigation
    // material, not vocabulary/sentence practice. Keep substantive questions and explanations.
    return !!vi && !/^(\(\s*)?(Đọc\b|Xem\b)/i.test(vi) && !/^\([^)]*\d+:\d+[^)]*\)\.?$/.test(vi) && !/^—\s*(Xem\b|\d|[A-ZÀ-Ỹ])/i.test(vi) &&
      !/^(ĐÀO SÂU|ĐIỂM CHÍNH|Ôn lại)$/i.test(vi) && !/^\d+\.$/.test(vi);
  }
  function renderCurrLff(q) {
    var root = document.getElementById("curr-lff-root");
    if (!root) return;
    var openSyls = {};
    var existing = root.querySelectorAll('.group-card[data-open="true"]');
    if (existing.length) {
      existing.forEach(function (c) { openSyls[c.dataset.syl] = true; });
    } else if (!root.dataset.rendered && LFF_CONVERSATIONS.length) {
      openSyls["lff0"] = true;
    }
    var openParts = {};
    root.querySelectorAll('.lff-part[data-open="true"]').forEach(function (part) {
      openParts[part.dataset.part] = true;
    });
    var firstRender = !root.dataset.rendered;
    root.dataset.rendered = "true";

    var recordsByPart = {};
    LFF_CONVERSATIONS.forEach(function (rec, ri) {
      var titleVi = applyLffListenerTerms(rec.title.vi);
      var lineUnits = [];
      lffDisplayLines(rec).forEach(function (line) {
        var vi = applyLffListenerTerms(line.vi);
        sentencePairs(vi, T(line)).forEach(function (pair) {
          lineUnits.push({ vi: pair.vi, kr: pair.kr });
        });
      });
      if (q) {
        var ql = q.toLowerCase();
        lineUnits = lineUnits.filter(function (l) { return l.vi.toLowerCase().indexOf(ql) >= 0 || l.kr.toLowerCase().indexOf(ql) >= 0; });
        if (!lineUnits.length && titleVi.toLowerCase().indexOf(ql) < 0 && T(rec.title).toLowerCase().indexOf(ql) < 0) return;
      }
      if (!recordsByPart[rec.part]) recordsByPart[rec.part] = [];
      recordsByPart[rec.part].push({ rec: rec, ri: ri, lineUnits: lineUnits, titleVi: titleVi });
    });

    var html = "";
    [1, 2, 3, 4].forEach(function (partNumber) {
      var records = recordsByPart[partNumber];
      if (!records || !records.length) return;
      // Part 1 is expanded initially. During a search, each part containing a result expands
      // automatically, so matching lessons are never hidden behind a collapsed section.
      var partOpen = q ? true : (Object.prototype.hasOwnProperty.call(openParts, String(partNumber)) ? openParts[String(partNumber)] : (firstRender && partNumber === 1));
      html += '<section class="lff-part" data-part="' + partNumber + '" data-open="' + (partOpen ? "true" : "false") + '">' +
        '<button type="button" class="lff-part-head" aria-expanded="' + (partOpen ? "true" : "false") + '">' +
        '<span>' + escapeHtml(lffPartLabel(partNumber)) + '</span>' + currChev() + '</button><div class="lff-part-body">';
      records.forEach(function (entry) {
        var rec = entry.rec, ri = entry.ri, lineUnits = entry.lineUnits, titleVi = entry.titleVi;
        // Start every full read with the same bilingual title shown in the card header, then
        // continue with the lesson's Vietnamese sentence and its selected-language translation.
        var readPairs = [[titleVi, T(rec.title)]].concat(lineUnits.map(function (l) { return [l.vi, l.kr]; }));
        var label = lffRecordLabel(rec);
        var recTitleTr = T(rec.title);
        var titleHtml = rec.kind === "lesson"
          ? '<span class="lff-title"><span class="lff-title-vi">' + escapeHtml(titleVi) + '</span>' + titleTrSpan(rec.title) + '</span>'
          : '<span class="cnt">' + escapeHtml(titleVi) + (recTitleTr ? ' · ' + escapeHtml(recTitleTr) : '') + '</span>';
        html += '<div class="group-card" data-open="' + (openSyls["lff" + ri] ? "true" : "false") + '" data-syl="lff' + ri + '" data-anchor="lff' + ri + '">' +
          '<div class="group-head-row"><button class="group-head"><span>' +
          (label ? '<span class="syl">' + escapeHtml(label) + '</span> ' : '') +
          titleHtml + '</span>' + currChev() + '</button>' + readAllButtonHtml(readPairs) + '</div>' +
          '<div class="group-body"><div class="talk-lines">';
        lineUnits.forEach(function (l) {
          html += '<div class="talk-line"><div class="talk-body"><div class="talk-vi">' + escapeHtml(l.vi) +
            '<button class="speak-btn" data-speak="' + escapeAttr(l.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
            '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(l.kr) + '</span>' +
            '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(l.kr) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '</div></div></div>';
        });
        html += '</div></div></div>';
      });
      html += '</div></section>';
    });
    if (q && !html) html = '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    root.innerHTML = html;
    bindCurrGroupCards(root);
    root.querySelectorAll(".lff-part-head").forEach(function (button) {
      button.addEventListener("click", function () {
        var part = button.closest(".lff-part");
        var willOpen = part.dataset.open !== "true";
        part.dataset.open = willOpen ? "true" : "false";
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });
    bindCurrSpeakBtns(root);
  }
  (function () {
    var input = document.getElementById("lff-search");
    if (input) input.addEventListener("input", function () { renderCurrLff(input.value.trim()); });
  })();

  // "사람들을 사랑하고 제자로" (Love People—Make Disciples) -- LPD maps and applyLpdTerms()
  // are declared above near peopleState so they are initialized ahead of subtab setup.

  function renderCurrLpd() {
    var root = document.getElementById("curr-lpd-root");
    if (!root) return;
    var openSyls = {};
    var existing = root.querySelectorAll('.group-card[data-open="true"]');
    if (existing.length) {
      existing.forEach(function (c) { openSyls[c.dataset.syl] = true; });
    } else if (!root.dataset.rendered && LPD_LESSONS.length) {
      openSyls["lpd0"] = true;
    }
    root.dataset.rendered = "true";

    var html = "";
    LPD_LESSONS.forEach(function (rec, ri) {
      var lineUnits = [];
      rec.lines.forEach(function (line) {
        if (rec.kind === "appendix" && rec.num === "A") {
          var item = applyLpdTerms(line);
          lineUnits.push({ vi: item.vi, kr: item.kr });
        } else {
          sentencePairs(line.vi, T(line)).forEach(function (pair) {
            lineUnits.push({ vi: pair.vi, kr: pair.kr });
          });
        }
      });
      var readPairs = [[rec.title.vi, T(rec.title)]].concat(lineUnits.map(function (l) { return [l.vi, l.kr]; }));
      html += '<div class="group-card" data-open="' + (openSyls["lpd" + ri] ? "true" : "false") + '" data-syl="lpd' + ri + '" data-anchor="lpd' + ri + '">' +
        '<div class="group-head-row"><button class="group-head"><span>' +
        '<span class="syl">' + escapeHtml(lpdRecordLabel(rec)) + '</span> ' +
        '<span class="lpd-title' + (rec.kind === "appendix" ? " is-appendix-title" : "") + '"><span class="lpd-title-vi">' + escapeHtml(rec.title.vi) + '</span>' + (T(rec.title) ? ' <span class="lpd-title-translation">· ' + escapeHtml(T(rec.title)) + '</span>' : '') + '</span>' +
        '</span>' + currChev() + '</button>' + readAllButtonHtml(readPairs) + '</div>' +
        '<div class="group-body"><div class="talk-lines">';
      lineUnits.forEach(function (l) {
        html += '<div class="talk-line"><div class="talk-body"><div class="talk-vi">' + escapeHtml(l.vi) +
          '<button class="speak-btn" data-speak="' + escapeAttr(l.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(l.kr) + '</span>' +
          '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(l.kr) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '</div></div></div>';
      });
      html += '</div></div></div>';
    });
    root.innerHTML = html;
    bindCurrGroupCards(root);
    bindCurrSpeakBtns(root);
  }

  // Re-render on a language change. Previously this pane was rendered only once at startup,
  // leaving the initial (for example Japanese) translation on screen in every later mode.
  onLangChange(function () {
    var input = document.getElementById("lff-search");
    renderCurrLff(input ? input.value.trim() : "");
    renderCurrLpd();
  });

  // Compact read-only summary of the shared people-profile, shown at the top of 제공 연설 with
  // a jump-link back to the input form living in 대화's people-section (see bindPeopleSection
  // below) -- kept deliberately lightweight rather than duplicating the full input form here.
  function renderPeopleSummary() {
    var root = document.getElementById("people-summary-root");
    if (!root) return;
    var me = peopleState.me, comp = peopleState.companion;
    var hasAny = userNameByLang[currentLang] || userNameVi || me.gender || me.age != null || me.phone || comp.nameKr || comp.nameVi;
    if (!hasAny) {
      root.innerHTML = '<div>' + TU("아직 참여자 정보가 입력되지 않았어요. 입력하면 위 대화문의 이름·전화번호·나이·호칭이 자동으로 채워져요.") + '</div>' +
        '<button type="button" class="people-summary-jump" id="people-summary-jump-btn">' + TU("대화 탭에서 참여자 정보 입력하기 →") + '</button>';
    } else {
      var meLine = '<b>' + TU("나") + '</b>: ' + escapeHtml((userNameByLang[currentLang] || "") + (userNameVi ? " / " + userNameVi : "") || TU("이름 미입력"));
      if (me.gender) meLine += " · " + TU(me.gender === "brother" ? "형제" : "자매");
      if (me.age != null && !isNaN(me.age)) meLine += " · " + me.age + TU("세");
      if (me.married != null) meLine += " · " + TU(me.married === "1" ? "기혼" : "미혼");
      if (me.phone) meLine += " · " + escapeHtml(me.phone);
      var lines = [meLine];
      if (comp.nameKr || comp.nameVi) {
        var info = computeCompanionTerm();
        var compLine = '<b>' + TU("봉사짝") + '</b>: ' + escapeHtml((comp.nameKr || "") + (comp.nameVi ? " / " + comp.nameVi : ""));
        if (info) compLine += " · " + TU("호칭 ") + escapeHtml(capitalize(info.term));
        lines.push(compLine);
      }
      root.innerHTML = '<div>' + lines.join("<br>") + '</div>' +
        '<button type="button" class="people-summary-jump" id="people-summary-jump-btn">' + TU("대화 탭에서 참여자 정보 수정하기 →") + '</button>';
    }
    var jumpBtn = document.getElementById("people-summary-jump-btn");
    if (jumpBtn) {
      jumpBtn.addEventListener("click", function () {
        var mainBtn = document.querySelector('.subtab-btn[data-wizard="main"]');
        if (mainBtn) mainBtn.click();
        var sectionRoot = document.getElementById("people-section-root");
        if (sectionRoot) setTimeout(function () { sectionRoot.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
      });
    }
  }

  // 성경 인명 사전 -- moved into the 어휘 tab as the "names" vocab mode; reuses the shared
  // #vocab-root / #vocab-search elements (root/q passed in by renderVocab()) instead of the
  // dedicated curr-names-root/-search elements it used while it lived under 교과.
  function renderVocabNames(root, q) {
    var base = applyVocabFocus("names", BIBLE_NAMES);
    var list = base.filter(function (n) { return !q || n.vi.toLowerCase().indexOf(q) >= 0 || T(n.kr).toLowerCase().indexOf(q) >= 0; });
    // Displayed in Vietnamese dictionary order for easy lookup, like a real name dictionary's
    // index. This is a DISPLAY-ONLY sort applied after applyVocabFocus's slice -- BIBLE_NAMES
    // itself keeps its original order (Bible/narrative sequence matching the course booklet's
    // "no" 1~184 numbering) untouched, because 교과 주간 과제 바로가기 links reference specific
    // vocabRange index windows by that "no" number (e.g. "인명 1~38번" for week 14) -- resorting
    // the underlying data would silently point those links at a different set of names.
    list = list.slice().sort(function (a, b) { return viCompare(a.vi, b.vi); });
    var html = vocabFocusBannerHtml("names");
    if (list.length) {
      html += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">' + readAllButtonHtml(list.map(function (n) { return [n.vi, T(n.kr)]; })) + '</div>';
      html += '<div class="theo-list">';
      list.forEach(function (n) {
        html += '<div class="bible-item"><div class="bible-body"><div class="bible-word vn">' + escapeHtml(n.vi) + '</div>' +
          '<div class="bible-mean">' + escapeHtml(T(n.kr)) + '</div></div>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(n.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      });
      html += '</div>';
    } else {
      html += '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    }
    root.innerHTML = html;
    bindCurrSpeakBtns(root);
    bindVocabFocusClear(root);
  }

  // 기본 단어 -- moved into the 어휘 tab as the "basic" vocab mode (split out from the former
  // combined "words" mode into its own subtab); same root/q change as renderVocabNames above.
  function renderVocabBasic(root, q) {
    var words = [];
    BASIC_WORD_GROUPS.forEach(function (g) { words = words.concat(g.words); });
    words = applyVocabFocus("basic", words);
    var filteredWords = words.filter(function (w) { return !q || w.vi.toLowerCase().indexOf(q) >= 0 || T(w.kr).toLowerCase().indexOf(q) >= 0; });
    var html = vocabFocusBannerHtml("basic");
    if (filteredWords.length) {
      html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("모든 대화를 구성하는 기본 단어") + '</h3>' +
        readAllButtonHtml(filteredWords.map(function (w) { return [w.vi, T(w.kr)]; })) + '</div><div class="theo-list">';
      filteredWords.forEach(function (w) {
        html += '<div class="bible-item"><div class="bible-body"><div class="bible-word vn">' + escapeHtml(w.vi) + '</div>' +
          '<div class="bible-mean">' + escapeHtml(T(w.kr)) + '</div></div>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(w.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      });
      html += '</div></div>';
    } else {
      html += '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    }
    root.innerHTML = html;
    bindCurrSpeakBtns(root);
    bindVocabFocusClear(root);
  }

  // 반의어 -- moved into the 어휘 탭 as the "antonym" vocab mode (split out from the former
  // combined "words" mode into its own subtab); same root/q change as renderVocabNames above.
  function renderVocabAntonym(root, q) {
    var base = applyVocabFocus("antonym", ANTONYM_PAIRS);
    var pairs = base.filter(function (p) {
      return !q || p.vi1.toLowerCase().indexOf(q) >= 0 || p.vi2.toLowerCase().indexOf(q) >= 0 || T(p.kr1).toLowerCase().indexOf(q) >= 0 || T(p.kr2).toLowerCase().indexOf(q) >= 0;
    });
    var html = vocabFocusBannerHtml("antonym");
    if (pairs.length) {
      var antonymTexts = [];
      pairs.forEach(function (p) { antonymTexts.push([p.vi1, T(p.kr1)], [p.vi2, T(p.kr2)]); });
      html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("반의어") + '</h3>' +
        readAllButtonHtml(antonymTexts) + '</div><div class="curr-item-list">';
      pairs.forEach(function (p) {
        html += '<div class="curr-antonym-row"><div class="curr-antonym-side"><span class="vi">' + escapeHtml(p.vi1) + '</span><span class="kr">' + escapeHtml(T(p.kr1)) + '</span></div>' +
          '<div class="curr-antonym-vs">↔</div>' +
          '<div class="curr-antonym-side"><span class="vi">' + escapeHtml(p.vi2) + '</span><span class="kr">' + escapeHtml(T(p.kr2)) + '</span></div></div>';
      });
      html += '</div></div>';
    } else {
      html += '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    }
    root.innerHTML = html;
    bindCurrSpeakBtns(root);
    bindVocabFocusClear(root);
  }

  // 남북 단어 -- same-meaning words that differ by region (not the same word pronounced
  // differently, which is what NS_DIFFS / the 발음 tab's 남북 발음 subtab covers).
  function renderVocabDialect(root, q) {
    var base = applyVocabFocus("dialect", DIALECT_WORDS);
    var list = base.filter(function (d) {
      return !q || d.north.toLowerCase().indexOf(q) >= 0 || d.south.toLowerCase().indexOf(q) >= 0 || T(d.mean).toLowerCase().indexOf(q) >= 0;
    });
    var html = vocabFocusBannerHtml("dialect");
    if (list.length) {
      var dialectTexts = [];
      list.forEach(function (d) { var mean = T(d.mean); dialectTexts.push([d.north.replace(/[/].*$/, ""), mean], [d.south.replace(/[/].*$/, ""), mean]); });
      html += '<div style="display:flex;justify-content:flex-end;margin-bottom:10px">' + readAllButtonHtml(dialectTexts) + '</div>';
      html += '<div class="dialect-list">';
      list.forEach(function (d) {
        html += '<div class="dialect-item"><div class="dialect-pair">' +
          '<div class="dialect-side"><span class="ns-tag north">' + TU("북부") + '</span><span class="dialect-word vn">' + escapeHtml(d.north) + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(d.north.replace(/[/].*$/, "")) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          '<div class="dialect-side"><span class="ns-tag south">' + TU("남부") + '</span><span class="dialect-word vn">' + escapeHtml(d.south) + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(d.south.replace(/[/].*$/, "")) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          '</div><div class="dialect-mean">' + escapeHtml(T(d.mean)) + '</div></div>';
      });
      html += '</div>';
    } else {
      html += '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    }
    root.innerHTML = html;
    bindCurrSpeakBtns(root);
    bindVocabFocusClear(root);
  }

  // Same idea as rwKrText() above, but reads the SECOND syllable's kr/pinyin/bopomofo fields
  // (second_kr/second_pinyin/second_bopomofo) instead of the first syllable's -- used only by
  // renderVocabOrderReversed() below, where every item carries both syllables' info.
  function rwKrText2(wd) {
    if (currentLang === "ko") return wd.second_kr;
    if (currentLang === "zh") return wd.second_bopomofo + " " + wd.second_pinyin;
    return wd.second_pinyin;
  }

  // [어순반대] -- collects every 한자음(RHYME_GROUPS) example word flagged word_order_reversed:
  // true (Sino-Vietnamese compounds whose syllable order comes out reversed compared to the
  // Korean/Chinese/Japanese hanja-compound order, e.g. "gia tăng" 加增 vs. standard order being
  // tăng-gia/增加). Every item here (both the RHYME_GROUPS-sourced ones and every
  // WORD_ORDER_REVERSED_EXTRA entry) carries BOTH syllables' word/hanja/kr/gloss, so each card
  // shows all three lines: 1st syllable, 2nd syllable, then the real compound word with its
  // literal syllable-order 한자음 reading and its actual (standard-order) Korean meaning --
  // e.g. "gia 加 → 가(더할 가)" / "tăng 增 → 증(오를 증)" / "gia tăng 가증(加增) — 증가".
  function renderVocabOrderReversed(root, q) {
    var items = [];
    RHYME_GROUPS.forEach(function (g) {
      g.families.forEach(function (fam) {
        fam.words.forEach(function (wd) { if (wd.word_order_reversed) items.push(wd); });
      });
    });
    // WORD_ORDER_REVERSED_EXTRA holds additional confirmed reversed-order words that aren't
    // otherwise part of the 한자음(RHYME_GROUPS) rhyme-family reference table.
    if (typeof WORD_ORDER_REVERSED_EXTRA !== "undefined") items = items.concat(WORD_ORDER_REVERSED_EXTRA);
    items = applyVocabFocus("orderrev", items);
    items = items.filter(function (wd) {
      if (!q) return true;
      return wd.word.toLowerCase().indexOf(q) >= 0 || wd.example.toLowerCase().indexOf(q) >= 0 ||
        (wd.second_word ? wd.second_word.toLowerCase().indexOf(q) >= 0 : false) ||
        T(wd.gloss).toLowerCase().indexOf(q) >= 0 ||
        (wd.second_gloss ? T(wd.second_gloss).toLowerCase().indexOf(q) >= 0 : false) ||
        T(wd.example_mean).toLowerCase().indexOf(q) >= 0 ||
        (wd.alt_order_word ? wd.alt_order_word.toLowerCase().indexOf(q) >= 0 : false);
    });
    if (!items.length) { root.innerHTML = vocabFocusBannerHtml("orderrev") + '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>'; bindVocabFocusClear(root); return; }
    // Read-all order per item: 1st syllable(vi) → its gloss, 2nd syllable(vi) → its gloss, then
    // the real compound word(vi) → its meaning -- e.g. "gia / 더할 가 / tăng / 오를 증 / gia
    // tăng / 증가", matching how the three display lines read top to bottom. In 중국어 mode, the
    // "gloss"/"meaning" slot is replaced with the exact hanja shown on screen for that syllable
    // (wd.hanja/wd.second_hanja), and the compound line reads the STANDARD/real Chinese order
    // (second_hanja + hanja, e.g. "增加" for gia/tăng) -- this tab's whole premise is that
    // Vietnamese word order is reversed from the standard Chinese/Korean/Japanese order, so the
    // compound reading must use the standard order, not the Vietnamese order. wd.example_kr
    // already carries the ground-truth standard-order hanja in trailing parentheses, so prefer
    // extracting it from there and only fall back to reconstructing it if that's unavailable.
    var readTexts = [];
    items.forEach(function (wd) {
      if (currentLang === "zh") {
        readTexts.push([wd.word, wd.hanja]);
        if (wd.second_word) readTexts.push([wd.second_word, wd.second_hanja]);
        var exHanjaZh = trailingParenHanja(wd.example_kr) || (wd.second_hanja ? (wd.second_hanja + wd.hanja) : wd.hanja);
        readTexts.push([wd.example, exHanjaZh]);
      } else {
        readTexts.push([wd.word, T(wd.gloss)]);
        if (wd.second_word) readTexts.push([wd.second_word, T(wd.second_gloss)]);
        readTexts.push([wd.example, T(wd.example_mean)]);
      }
    });
    var html = vocabFocusBannerHtml("orderrev") + '<div class="chain-note" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap"><span>' +
      TU("베트남어 한자어 중, 한국어·중국어·일본어의 한자 어순과 베트남어 어순이 서로 반대인 단어들을 모았어요.") + '</span>' +
      readAllButtonHtml(readTexts) + '</div><div class="rhyme-word-list">';
    items.forEach(function (wd) {
      var hasSecond = !!wd.second_word;
      // The literal syllable-order 한자음 reading, e.g. "가증(加增)" for "gia tăng" -- built from
      // both syllables' own kr+hanja in the SAME order the Vietnamese word actually uses (which is
      // exactly the reverse of the standard/real Korean word order this tab is about). Korean-only,
      // same convention as the old example_kr display.
      var literalKr = hasSecond ? (wd.kr + wd.second_kr + '(' + wd.hanja + wd.second_hanja + ')') : '';
      html += '<div class="rhyme-word-row">' +
        '<div class="rhyme-word-main"><span class="rw-word vn">' + escapeHtml(wd.word) + '</span>' +
        '<button class="speak-btn" data-speak="' + escapeAttr(wd.word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
        '<span class="rw-hanja">' + escapeHtml(wd.hanja) + '</span>' +
        (currentLang === "zh" ? "" :
          '<span class="rw-kr">→ ' + escapeHtml(rwKrText(wd)) + '</span>' +
          '<span class="rw-gloss">(' + escapeHtml(T(wd.gloss)) + ')</span>') + '</div>';
      if (hasSecond) {
        html += '<div class="rhyme-word-main"><span class="rw-word vn">' + escapeHtml(wd.second_word) + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(wd.second_word) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '<span class="rw-hanja">' + escapeHtml(wd.second_hanja) + '</span>' +
          (currentLang === "zh" ? "" :
            '<span class="rw-kr">→ ' + escapeHtml(rwKrText2(wd)) + '</span>' +
            '<span class="rw-gloss">(' + escapeHtml(T(wd.second_gloss)) + ')</span>') + '</div>';
      }
      html += '<div class="rhyme-word-ex"><span class="vn">' + escapeHtml(wd.example) + '</span>' +
        '<button class="speak-btn" data-speak="' + escapeAttr(wd.example) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
        '<span class="rw-ex-kr">' + (currentLang === "ko" && literalKr ? escapeHtml(literalKr) + ' — ' : '') + escapeHtml(T(wd.example_mean)) +
        (wd.alt_order_word ? ' (' + escapeHtml(altOrderNoteText(wd.alt_order_word)) + ')' : '') + '</span></div></div>';
    });
    html += '</div>';
    root.innerHTML = html;
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function () { speak(b.dataset.speak); }); });
    bindVocabFocusClear(root);
  }

  // [파수대] -- 16주치 파수대(Watchtower) 연구 기사 어휘, 주차별 아코디언(그룹 카드)으로 표시.
  // WATCHTOWER_VOCAB은 이미 주차별로 구성되어 있으므로(주차마다 50단어), vocabFocus 적용 시에는
  // rhyme/groups 탭과 같은 방식으로 전체를 한 번 평탄화한 뒤 그 인덱스 범위로 슬라이스하고,
  // 다시 주차별로 묶어 그 주차 카드만 펼쳐서 보여준다(교과/주간 수행 과제 바로가기가
  // vocabRange:{start:(week-1)*50, end:week*50}로 특정 주차를 가리키는 방식과 맞춘 것).
  // [문장] > [파수대] example sentences: the reader-addressing "bạn" follows the [첫만남] partner term (same exclusions
  // as 행누: "bạn bè", "người bạn" ... stay). Unchanged until [첫만남] is configured, and never for the word "bạn" itself.
  function wtExampleVi(w) {
    if (!w || !w.example) return w ? w.example : "";
    if (/(?<![\p{L}])bạn(?![\p{L}])/iu.test(w.vi || "")) return w.example;
    if (!firstMeetingPronouns()) return w.example;
    return applyLffListenerTerms(w.example);
  }
  function renderVocabWatchtower(root, q) {
    // The first five articles predate this class. From source article 6 onward, labels follow
    // the actual class calendar, including the three scheduled breaks.
    function watchtowerDisplayLabel(sourceWeek) {
      if (sourceWeek <= 5) return "";
      var labels = { 6: "1주차", 7: "2주차", 8: "3주차", 9: "4주차", 10: "방학", 11: "5주차", 12: "6주차", 13: "7주차", 14: "방학", 15: "8주차", 16: "9주차", 17: "방학", 18: "10주차", 19: "11주차", 20: "12주차", 21: "13주차", 22: "14주차", 23: "15주차", 24: "16주차" };
      return labels[sourceWeek] || sourceWeek + TU("주차");
    }
    var weeks = WATCHTOWER_VOCAB;
    if (vocabFocus && vocabFocus.mode === "wt") {
      var fullFlat = [];
      WATCHTOWER_VOCAB.forEach(function (wk) { wk.words.forEach(function (w) { fullFlat.push({ wk: wk, w: w }); }); });
      var flatSlice = fullFlat.slice(vocabFocus.start, vocabFocus.end);
      var order = [], map = {};
      flatSlice.forEach(function (item) {
        var key = item.wk.week;
        if (!map[key]) { map[key] = { wk: item.wk, words: [] }; order.push(key); }
        map[key].words.push(item.w);
      });
      weeks = order.map(function (key) { return Object.assign({}, map[key].wk, { words: map[key].words }); });
    }
    var qWeeks = weeks.map(function (wk) {
      if (!q) return wk;
      var words = wk.words.filter(function (w) {
        return w.vi.toLowerCase().indexOf(q) >= 0 || T(w.mean).toLowerCase().indexOf(q) >= 0 || w.example.toLowerCase().indexOf(q) >= 0;
      });
      return words.length ? Object.assign({}, wk, { words: words }) : null;
    }).filter(Boolean);
    if (!qWeeks.length) { root.innerHTML = vocabFocusBannerHtml("wt") + '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>'; bindVocabFocusClear(root, renderCurrWt); return; }
    var openAll = !!q || (vocabFocus && vocabFocus.mode === "wt");
    var html = vocabFocusBannerHtml("wt") + '<div class="chain-note">' + TU("이 주의 파수대 연구 기사에서 뽑은 어휘예요. 예문과 예문의 뜻도 함께 보여줘요.") + '</div>';
    // Read-all order per word: 단어(vi) -> 단어 뜻 -> 예문(vi) -> 예문 뜻, so each word contributes
    // two consecutive [vi, mean] pairs to the shared registry (playReadAllNext plays entries in
    // array order, one at a time), rather than one.
    qWeeks.forEach(function (wk) {
      var readAllEntries = [];
      wk.words.forEach(function (w) {
        readAllEntries.push([w.vi, T(w.mean)]);
        readAllEntries.push([wtExampleVi(w), w.example_mean ? T(w.example_mean) : ""]);
      });
      var weekLabel = watchtowerDisplayLabel(wk.week);
      var dateRangeTr = T(wk.date_range);
      html += '<div class="group-card" data-open="' + openAll + '" data-syl="wt' + wk.week + '">' +
        '<div class="group-head-row"><button class="group-head"><span>' +
        (weekLabel ? '<span class="syl">' + escapeHtml(weekLabel) + '</span> ' : '') +
        '<span class="cnt">' + (dateRangeTr ? escapeHtml(dateRangeTr) + ' · ' : '') + wk.words.length + TU("개 단어") + '</span></span>' +
        '<span class="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span></button>' +
        readAllButtonHtml(readAllEntries) + '</div>' +
        '<div class="group-body"><div class="rhyme-word-list">';
      wk.words.forEach(function (w) {
        html += '<div class="rhyme-word-row">' +
          '<div class="rhyme-word-main"><span class="rw-word vn">' + escapeHtml(w.vi) + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(w.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '<span class="rw-gloss">' + escapeHtml(T(w.mean)) + '</span></div>' +
          '<div class="rhyme-word-ex"><span class="vn">' + escapeHtml(wtExampleVi(w)) + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(wtExampleVi(w)) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
          (w.example_mean ? '<div class="rhyme-word-ex-mean">' + escapeHtml(T(w.example_mean)) + '</div>' : '') +
          '</div>';
      });
      html += '</div></div></div>';
    });
    root.innerHTML = html;
    root.querySelectorAll(".group-card").forEach(function (card) {
      card.querySelector(".group-head").addEventListener("click", function () {
        card.dataset.open = card.dataset.open === "true" ? "false" : "true";
      });
    });
    root.querySelectorAll(".speak-btn").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); speak(b.dataset.speak); }); });
    bindVocabFocusClear(root, renderCurrWt);
  }

  // 파수대 moved from 어휘 into its own 문장 subtab (data-sentence="wt") -- this thin wrapper just
  // supplies renderVocabWatchtower() with the 문장 tab's own mount/search elements instead of
  // 어휘's, so every existing vocabFocus/바로가기 range-banner behavior keeps working unchanged.
  function renderCurrWt(q) {
    var root = document.getElementById("curr-wt-root");
    if (!root) return;
    if (q === undefined) {
      var searchEl = document.getElementById("wt-search");
      q = searchEl ? searchEl.value.trim().toLowerCase() : "";
    }
    renderVocabWatchtower(root, q);
  }
  (function () {
    var wtSearchInput = document.getElementById("wt-search");
    if (wtSearchInput) wtSearchInput.addEventListener("input", function () { vocabFocus = null; renderCurrWt(); });
  })();
  // Same re-render-on-language-change fix as daily/LFF/LPD above -- otherwise this pane also
  // kept showing whichever language was active the first time its subtab was opened.
  onLangChange(function () { renderCurrWt(); });

  function renderCurrSentences() {
    var root = document.getElementById("curr-sentences-root");
    if (!root) return;
    var html = '<div class="curr-card"><p>' + escapeHtml(T(SENT_GEN_INTRO)) + '</p></div>';
    html += '<div class="curr-bank-grid">';
    var cols = [["subjects", TU("주어")], ["modals", TU("조동사 등")], ["verbs", TU("동사")], ["places", TU("장소 (ở ~)")]];
    cols.forEach(function (c) {
      html += '<div><div class="curr-bank-col-title" style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap"><span>' + c[1] + '</span>' +
        readAllButtonHtml(SENT_GEN_BANK[c[0]].map(function (w) { return [w.vi, T(w.kr)]; })) + '</div><div class="curr-bank-list">';
      SENT_GEN_BANK[c[0]].forEach(function (w) {
        html += '<div class="curr-bank-item"><span class="vi">' + escapeHtml(w.vi) + '</span><span class="kr">' + escapeHtml(T(w.kr)) + '</span>' +
          '<button class="speak-btn" data-speak="' + escapeAttr(w.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    root.innerHTML = html;
    bindCurrSpeakBtns(root);
  }

  function renderCurrGrammar() {
    var root = document.getElementById("curr-grammar-root");
    if (!root) return;
    var qEl = document.getElementById("curr-grammar-search");
    var q = (qEl ? qEl.value : "").trim().toLowerCase();

    var html = "";
    if (!q) {
      html += '<div class="p-section"><h3>' + TU("연결사") + '</h3>';
      GX_CONNECTIVES.forEach(function (c) {
        html += '<div class="curr-card"><p style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap"><span><b>' + c.no + '.</b> ' + escapeHtml(T(c.label)) + '</span>' +
          readAllButtonHtml(c.examples.map(function (e) { return [e.vi, T(e.kr)]; })) + '</p><div class="curr-ex-list">';
        c.examples.forEach(function (e) {
          html += '<div class="curr-ex-row"><span class="vi">' + escapeHtml(e.vi) + '</span><span class="kr">' + escapeHtml(T(e.kr)) + '</span></div>';
        });
        html += '</div></div>';
      });
      html += '</div>';

      var motionReadPairs = [];
      GX_MOTION_VERBS.forEach(function (v) { motionReadPairs.push([v.vi, T(v.kr)], [v.ex_vi, T(v.ex_kr)]); });
      html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("움직임을 나타내는 동사") + '</h3>' +
        readAllButtonHtml(motionReadPairs) + '</div><div class="curr-item-list">';
      GX_MOTION_VERBS.forEach(function (v) {
        html += '<div class="curr-item-row" style="display:block"><div class="curr-item-text"><b class="vn">' + escapeHtml(v.vi) + '</b> ' + escapeHtml(T(v.kr)) + '</div>' +
          '<div class="curr-ex-row"><span class="vi">' + escapeHtml(v.ex_vi) + '</span><span class="kr">' + escapeHtml(T(v.ex_kr)) + '</span></div></div>';
      });
      html += '</div></div>';

      html += '<div class="p-section"><div class="p-section-head"><h3>' + TU("위치 전치사") + '</h3>' +
        readAllButtonHtml(GX_POS_PREPS.map(function (p) { return [p.vi, T(p.kr)]; }).concat(GX_POS_EXAMPLES.map(function (e) { return [e.vi, T(e.kr)]; }))) + '</div><div class="curr-bank-list">';
      GX_POS_PREPS.forEach(function (p) {
        html += '<div class="curr-bank-item"><span class="vi">' + escapeHtml(p.vi) + '</span><span class="kr">' + escapeHtml(T(p.kr)) + '</span></div>';
      });
      html += '</div><div class="curr-ex-list">';
      GX_POS_EXAMPLES.forEach(function (e) {
        html += '<div class="curr-ex-row"><span class="vi">' + escapeHtml(e.vi) + '</span><span class="kr">' + escapeHtml(T(e.kr)) + '</span></div>';
      });
      html += '</div></div>';

      html += '<div class="p-section"><h3>' + TU("길찾기 대화문") + '</h3>';
      GX_DIRECTION_DIALOGUES.forEach(function (d) {
        html += '<div class="curr-card"><p style="font-weight:800;color:var(--ink);display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap"><span>' + escapeHtml(T(d.title)) + '</span>' +
          readAllButtonHtml(d.lines.map(function (l) { return [l.vi, T(l.kr)]; })) + '</p><div class="talk-lines">';
        d.lines.forEach(function (l) {
          html += '<div class="talk-line"><span class="talk-who">' + escapeHtml(l.who) + '</span>' +
            '<div class="talk-body"><div class="talk-vi">' + escapeHtml(l.vi) +
            '<button class="speak-btn" data-speak="' + escapeAttr(l.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
            '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(T(l.kr)) + '</span>' +
            '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(T(l.kr)) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
            '</div></div></div>';
        });
        html += '</div></div>';
      });
      html += '</div>';
    }

    var dictSource = GRAMMAR_DICT.concat(typeof GRAMMAR_B1_B2_PATTERNS !== "undefined" ? GRAMMAR_B1_B2_PATTERNS : []);
    var dict = dictSource.filter(function (g) {
      return !q || g.headword.toLowerCase().indexOf(q) >= 0 || T(g.meaning).indexOf(q) >= 0;
    });
    html += '<div class="p-section"><h3>' + TU("A–Z 문법 사전") + '</h3>';
    if (!dict.length) html += '<div class="empty-state">' + TU("검색 결과가 없어요.") + '</div>';
    dict.forEach(function (g) {
      html += '<div class="curr-card"><div class="curr-dict-head"><span class="curr-dict-word">' + escapeHtml(g.headword) + '</span>' +
        (g.pos ? '<span class="curr-dict-pos">' + escapeHtml(T(g.pos)) + '</span>' : '') +
        readAllButtonHtml(g.examples.map(function (e) { return [e.vi, T(e.kr)]; })) + '</div>' +
        '<div class="curr-dict-meaning">' + escapeHtml(T(g.meaning)) + '</div><div class="curr-ex-list">';
      g.examples.forEach(function (e) {
        html += '<div class="curr-ex-row"><span class="vi">' + escapeHtml(e.vi) + '</span><span class="kr">' + escapeHtml(T(e.kr)) + '</span></div>';
      });
      if (typeof JW_EXTRACTION_DATA !== "undefined" && JW_EXTRACTION_DATA && JW_EXTRACTION_DATA.grammarExamples) {
        var jwExs = JW_EXTRACTION_DATA.grammarExamples[g.headword];
        if (jwExs && jwExs.length) {
          html += '<div class="jw-grammar-ex-section"><div class="jw-grammar-ex-title">' +
            '<span class="source-pill source-pill-wt">JW</span> ' + TU("실제 출처 예문") + ' (' + jwExs.length + ')' +
            '</div>';
          jwExs.slice(0, 3).forEach(function (jwe) {
            var trText = jwe.translations ? (jwe.translations[currentLang] || jwe.translations.ko || jwe.translations.en || '') : '';
            var srcLabel = jwe.sourceLabel || jwe.sourceType || '';
            html += '<div class="jw-grammar-ex-row">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">' +
              '<span class="jw-grammar-ex-vi vn font-bold">' + escapeHtml(jwe.vi) + '</span>' +
              '<span class="source-pill" style="font-size:0.65rem;">' + escapeHtml(srcLabel) + '</span>' +
              '</div>' +
              (trText ? '<div class="jw-grammar-ex-trans">' + escapeHtml(trText) + '</div>' : '') +
              '</div>';
          });
          html += '</div>';
        }
      }
      html += '</div></div>';
    });
    html += '</div>';

    root.innerHTML = html;
    bindCurrSpeakBtns(root);
  }

  var currentSelectedSong = 1;
  var songPickerViewMode = "grid"; // "grid" | "list"
  var songPickerActiveRange = "all";
  var songPickerSearchQuery = "";

  function songSanitize(str) {
    if (!str || typeof str !== "string") return str;
    return str.replace(/예수님/g, "예수").replace(/주님/g, "주");
  }

  function isSongSectionMarker(str) {
    if (!str) return false;
    var s = str.trim();
    return s.charAt(0) === "(" || s.charAt(0) === "（";
  }

  function renderCurrSongs(targetSongNum) {
    var root = document.getElementById("curr-songs-root");
    if (!root) return;

    var songs = (typeof SONGS_DATA !== "undefined" && SONGS_DATA) || [];
    if (!songs.length) {
      var htmlFallback = '<div class="p-section"><h3>' + TU("왕국 노래") + '</h3>';
      KINGDOM_SONGS.forEach(function (s) {
        var songLines = [];
        s.verses.forEach(function (verse) { verse.forEach(function (l) { if (l.vi) songLines.push(l.kr ? [l.vi, T(l.kr)] : l.vi); }); });
        htmlFallback += '<div class="curr-card" data-anchor="song-' + s.number + '">' +
          '<div class="curr-dict-head"><h3 style="margin:0">' + s.number + TU("번") + ' — ' + escapeHtml(T(s.title_kr)) + '</h3>' + readAllButtonHtml(songLines) + '</div>' +
          '<div class="curr-culture-sub vn">' + escapeHtml(s.title_vi) + (s.scripture ? ' (' + escapeHtml(s.scripture) + ')' : '') + '</div>';
        s.verses.forEach(function (verse) {
          htmlFallback += '<div class="talk-lines" style="margin-bottom:10px">';
          verse.forEach(function (l) {
            htmlFallback += '<div class="talk-line"><div class="talk-body"><div class="talk-vi">' + escapeHtml(l.vi) +
              '<button class="speak-btn" data-speak="' + escapeAttr(l.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
              (l.kr ? '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(T(l.kr)) + '</span>' +
                '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(T(l.kr)) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
                '</div>' : '') + '</div></div>';
          });
          htmlFallback += '</div>';
        });
        htmlFallback += '</div>';
      });
      htmlFallback += '</div>';
      root.innerHTML = htmlFallback;
      bindCurrSpeakBtns(root);
      return;
    }

    if (typeof targetSongNum === "number") {
      currentSelectedSong = targetSongNum;
    }

    // Find selected song or default to 1st song
    var sel = songs.find(function (s) { return s.number === currentSelectedSong; });
    if (!sel) {
      sel = songs[0];
      currentSelectedSong = sel ? sel.number : 1;
    }

    var sNum = String(sel.number);
    var meaningsMap = (typeof SONG_MEANINGS !== "undefined" && SONG_MEANINGS[sNum]) || {};

    var viTitle = sel.title.vi || "";
    var targetTitle = songSanitize(sel.title[currentLang] || sel.title.ko || "");
    var viScripture = (sel.scripture && sel.scripture.vi) || "";
    var targetScripture = songSanitize((sel.scripture && (sel.scripture[currentLang] || sel.scripture.ko)) || "");

    // Build lyric units and readAll lines
    var songLines = [];
    var readViTitle = "Bài " + sel.number + ". " + viTitle;
    songLines.push(targetTitle ? [readViTitle, targetTitle] : readViTitle);
    if (viScripture) {
      songLines.push(targetScripture ? [viScripture, targetScripture] : viScripture);
    }
    var lyricsHtml = "";
    sel.lines.forEach(function (l, idx) {
      var vi = (l.vi || "").trim();
      if (!vi) return;
      var target = songSanitize((l[currentLang] || l.ko || "").trim());

      // Section marker (Chorus, Ending, Bridge, Pre-chorus) -- still shown as a marker (not a
      // regular lyric line), but a real, existing SONG_MEANINGS entry attached to this index
      // must not become silently unreachable just because its line is a marker.
      if (isSongSectionMarker(vi)) {
        var markerMeaning = songSanitize((meaningsMap[String(idx)] && meaningsMap[String(idx)][currentLang]) || "");
        lyricsHtml += '<div class="lyric-section-marker">' +
          '<div class="lyric-marker-vi vn">' + escapeHtml(vi) + '</div>' +
          (target ? '<div class="lyric-marker-target">' + escapeHtml(target) + '</div>' : '') +
          (markerMeaning ? '<div class="lyric-meaning-row"><div class="lyric-meaning"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(markerMeaning) + '</div></div>' : '') +
          '</div>';
        return;
      }

      var lineMeaning = songSanitize((meaningsMap[String(idx)] && meaningsMap[String(idx)][currentLang]) || "");

      songLines.push(target ? [vi, target] : vi);

      lyricsHtml += '<div class="lyric-unit">';
      // Line 1: Vietnamese Original (Prominent font-weight, largest)
      lyricsHtml += '<div class="lyric-vi-row">' +
        '<div class="lyric-vi vn">' + escapeHtml(vi) + '</div>' +
        '<button type="button" class="speak-btn" data-speak="' + escapeAttr(vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
        '</div>';

      // Line 2: Target official song lyric
      if (target) {
        lyricsHtml += '<div class="lyric-target-row">' +
          '<div class="lyric-target">' + escapeHtml(target) + '</div>' +
          '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(target) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
          '</div>';
      }

      // Line 3: Meaning (conditional, only if semantic divergence exists)
      if (lineMeaning) {
        lyricsHtml += '<div class="lyric-meaning-row">' +
          '<div class="lyric-meaning"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(lineMeaning) + '</div>' +
          '</div>';
      }

      lyricsHtml += '</div>';
    });

    // Reference (if present at the end of the song)
    var viRef = (sel.reference && sel.reference.vi) ? sel.reference.vi.trim() : "";
    var targetRef = (sel.reference && (sel.reference[currentLang] || sel.reference.ko)) ? songSanitize(sel.reference[currentLang] || sel.reference.ko).trim() : "";
    if (viRef || targetRef) {
      lyricsHtml += '<div class="song-reference-card">' +
        (viRef ? '<div class="song-reference-vi vn">' + escapeHtml(viRef) + '</div>' : '') +
        (targetRef ? '<div class="song-reference-target">' + escapeHtml(targetRef) + '</div>' : '') +
        '</div>';
    }

    var maxNum = 0;
    songs.forEach(function (s) { if (s.number > maxNum) maxNum = s.number; });
    if (!maxNum) maxNum = songs.length;

    var html = '<div class="p-section">';

    // 1. Sticky Top Song Control Bar (JW Library style)
    html += '<div class="song-ctrl-bar">' +
      '<button type="button" class="song-ctrl-nav-btn" id="song-bar-prev" aria-label="' + TU("이전 곡") + '">' +
        '<span class="song-ctrl-arrow">◀</span> <span class="song-ctrl-nav-text">' + TU("이전 곡") + '</span>' +
      '</button>' +
      '<button type="button" class="song-ctrl-picker-btn" id="song-picker-open-btn" aria-label="' + TU("노래 선택") + '">' +
        '<div class="song-ctrl-badge">' + sel.number + '</div>' +
        '<div class="song-ctrl-title-wrap">' +
          '<div class="song-ctrl-main-title vn">' + escapeHtml(viTitle) + '</div>' +
          '<div class="song-ctrl-sub-title">' + escapeHtml(targetTitle) + '</div>' +
        '</div>' +
        '<div class="song-ctrl-dropdown-arrow">▾</div>' +
      '</button>' +
      '<button type="button" class="song-ctrl-nav-btn" id="song-bar-next" aria-label="' + TU("다음 곡") + '">' +
        '<span class="song-ctrl-nav-text">' + TU("다음 곡") + '</span> <span class="song-ctrl-arrow">▶</span>' +
      '</button>' +
    '</div>';

    // 2. Selected song lyrics detail view (Required order: number, vi title, target title, vi scripture, target scripture)
    html += '<div class="song-detail-card" id="song-detail-card" data-anchor="song-' + sel.number + '">';
    html += '<div class="song-detail-header">' +
      '<div class="song-detail-title-group">' +
        '<div class="song-detail-number-badge">' + sel.number + TU("번") + '</div>' +
        '<h3 class="song-detail-vi-title vn">' + escapeHtml(viTitle) + '</h3>' +
        '<div class="song-detail-target-title">' + escapeHtml(targetTitle) + '</div>' +
        (viScripture ? '<div class="song-detail-vi-scripture vn">' + escapeHtml(viScripture) + '</div>' : '') +
        (targetScripture ? '<div class="song-detail-target-scripture">' + escapeHtml(targetScripture) + '</div>' : '') +
      '</div>' +
      '<div class="song-detail-nav">' +
        readAllButtonHtml(songLines) +
      '</div>' +
    '</div>';

    html += '<div class="song-lyrics-container">' + lyricsHtml + '</div>';

    // Bottom Navigation
    html += '<div class="song-detail-bottom-nav">' +
      '<button type="button" class="song-nav-btn" id="song-bottom-prev-btn">← ' + TU("이전 곡") + '</button>' +
      '<button type="button" class="song-nav-btn song-nav-center-btn" id="song-bottom-picker-btn">🎵 ' + TU("노래 선택") + '</button>' +
      '<button type="button" class="song-nav-btn" id="song-bottom-next-btn">' + TU("다음 곡") + ' →</button>' +
    '</div>';

    html += '</div>'; // close song-detail-card

    // 3. Song Picker Modal / Bottom Sheet
    html += '<div id="song-picker-modal" class="song-picker-modal" style="display:none;" aria-hidden="true">' +
      '<div class="song-picker-backdrop" id="song-picker-backdrop"></div>' +
      '<div class="song-picker-dialog" role="dialog" aria-modal="true">' +
        // Modal Header
        '<div class="song-picker-header">' +
          '<div class="song-picker-title-group">' +
            '<h3 class="song-picker-title">🎵 ' + TU("노래 선택") + ' <span class="song-picker-count">(1~' + maxNum + TU("번") + ')</span></h3>' +
          '</div>' +
          '<div class="song-picker-header-actions">' +
            '<div class="song-view-toggle-group">' +
              '<button type="button" class="song-view-toggle-btn" id="song-view-grid-btn" data-active="' + (songPickerViewMode === "grid" ? "true" : "false") + '" title="' + TU("바둑판") + '">' +
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/></svg>' +
                '<span>' + TU("바둑판") + '</span>' +
              '</button>' +
              '<button type="button" class="song-view-toggle-btn" id="song-view-list-btn" data-active="' + (songPickerViewMode === "list" ? "true" : "false") + '" title="' + TU("목록") + '">' +
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>' +
                '<span>' + TU("목록") + '</span>' +
              '</button>' +
            '</div>' +
            '<button type="button" class="song-picker-close-btn" id="song-picker-close-btn" aria-label="' + TU("닫기") + '">✕</button>' +
          '</div>' +
        '</div>' +

        // Search Bar
        '<div class="song-picker-search-bar">' +
          '<span class="song-picker-search-icon">🔍</span>' +
          '<input type="search" id="song-picker-search-input" class="song-picker-search-input" placeholder="' + escapeAttr(TU("곡 번호 또는 제목 검색... (예: 12 또는 사랑)")) + '" value="' + escapeAttr(songPickerSearchQuery) + '" autocomplete="off" />' +
          '<button type="button" class="song-picker-search-clear" id="song-picker-search-clear" style="' + (songPickerSearchQuery ? "" : "display:none;") + '" aria-label="' + TU("지우기") + '">✕</button>' +
        '</div>';

    // Range Tabs
    html += '<div class="song-picker-ranges" id="song-picker-ranges">';
    html += '<button type="button" class="song-range-chip" data-range="all" data-active="' + (songPickerActiveRange === "all" ? "true" : "false") + '">' + TU("전체") + '</button>';
    for (var rStart = 1; rStart <= maxNum; rStart += 20) {
      var rEnd = Math.min(rStart + 19, maxNum);
      var rCode = rStart + "-" + rEnd;
      var rLabel = rStart + "~" + rEnd + TU("번");
      if (currentLang === "zh") rLabel = rStart + "-" + rEnd + "首";
      else if (currentLang === "en") rLabel = "Songs " + rStart + "-" + rEnd;
      else if (currentLang === "ja") rLabel = rStart + "-" + rEnd + "番";
      html += '<button type="button" class="song-range-chip" data-range="' + rCode + '" data-active="' + (songPickerActiveRange === rCode ? "true" : "false") + '">' + escapeHtml(rLabel) + '</button>';
    }
    html += '</div>';

    // Picker Body (Grid & List)
    html += '<div class="song-picker-body" id="song-picker-body">';

    // Grid View
    html += '<div class="song-picker-grid" id="song-picker-grid" style="' + (songPickerViewMode === "grid" ? "" : "display:none;") + '">';
    songs.forEach(function (s) {
      var isActive = s.number === sel.number;
      var tTitle = songSanitize(s.title[currentLang] || s.title.ko || "");
      var vTitle = s.title.vi || "";
      var searchTerms = (s.number + " " + vTitle + " " + tTitle + " " + (s.title.ko || "")).toLowerCase();
      html += '<button type="button" class="song-grid-chip" data-song-num="' + s.number + '" data-active="' + (isActive ? "true" : "false") + '" data-search="' + escapeAttr(searchTerms) + '" title="' + s.number + '. ' + escapeAttr(tTitle) + '">' +
        s.number +
      '</button>';
    });
    html += '</div>';

    // List View
    html += '<div class="song-picker-list" id="song-picker-list" style="' + (songPickerViewMode === "list" ? "" : "display:none;") + '">';
    songs.forEach(function (s) {
      var isActive = s.number === sel.number;
      var tTitle = songSanitize(s.title[currentLang] || s.title.ko || "");
      var vTitle = s.title.vi || "";
      var searchTerms = (s.number + " " + vTitle + " " + tTitle + " " + (s.title.ko || "")).toLowerCase();
      html += '<button type="button" class="song-list-row" data-song-num="' + s.number + '" data-active="' + (isActive ? "true" : "false") + '" data-search="' + escapeAttr(searchTerms) + '">' +
        '<div class="song-badge">' + s.number + '</div>' +
        '<div class="song-item-info">' +
          '<div class="song-item-vi vn">' + escapeHtml(vTitle) + '</div>' +
          '<div class="song-item-target">' + escapeHtml(tTitle) + '</div>' +
        '</div>' +
      '</button>';
    });
    html += '</div>';

    html += '<div class="song-picker-empty" id="song-picker-empty" style="display:none;"><p>' + TU("검색 결과가 없습니다.") + '</p></div>';
    html += '</div>'; // close song-picker-body

    html += '</div></div>'; // close dialog & modal
    html += '</div>'; // close p-section

    root.innerHTML = html;
    bindCurrSpeakBtns(root);

    // Filter logic for modal
    function filterSongPicker() {
      var q = songPickerSearchQuery.trim().toLowerCase();
      var range = songPickerActiveRange;
      var rangeStart = 0, rangeEnd = 999999;
      if (range !== "all") {
        var parts = range.split("-");
        rangeStart = parseInt(parts[0], 10) || 0;
        rangeEnd = parseInt(parts[1], 10) || 999999;
      }

      var gridChips = root.querySelectorAll(".song-grid-chip");
      var listRows = root.querySelectorAll(".song-list-row");
      var visibleCount = 0;

      gridChips.forEach(function (chip) {
        var num = parseInt(chip.dataset.songNum, 10);
        var inRange = (range === "all") || (num >= rangeStart && num <= rangeEnd);
        var inSearch = (!q) || (chip.dataset.search.indexOf(q) >= 0);
        var show = inRange && inSearch;
        chip.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });

      listRows.forEach(function (row) {
        var num = parseInt(row.dataset.songNum, 10);
        var inRange = (range === "all") || (num >= rangeStart && num <= rangeEnd);
        var inSearch = (!q) || (row.dataset.search.indexOf(q) >= 0);
        row.style.display = (inRange && inSearch) ? "" : "none";
      });

      var emptyEl = document.getElementById("song-picker-empty");
      if (emptyEl) emptyEl.style.display = (visibleCount === 0) ? "block" : "none";
    }

    function openSongPicker() {
      var modal = document.getElementById("song-picker-modal");
      if (!modal) return;
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      filterSongPicker();
      var activeEl = modal.querySelector('.song-grid-chip[data-active="true"], .song-list-row[data-active="true"]');
      if (activeEl) {
        setTimeout(function () {
          activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }, 80);
      }
    }

    function closeSongPicker() {
      var modal = document.getElementById("song-picker-modal");
      if (!modal) return;
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    // Bind modal trigger & close events
    var pickerOpenBtn = root.querySelector("#song-picker-open-btn");
    var bottomPickerBtn = root.querySelector("#song-bottom-picker-btn");
    var pickerCloseBtn = root.querySelector("#song-picker-close-btn");
    var pickerBackdrop = root.querySelector("#song-picker-backdrop");

    if (pickerOpenBtn) pickerOpenBtn.addEventListener("click", openSongPicker);
    if (bottomPickerBtn) bottomPickerBtn.addEventListener("click", openSongPicker);
    if (pickerCloseBtn) pickerCloseBtn.addEventListener("click", closeSongPicker);
    if (pickerBackdrop) pickerBackdrop.addEventListener("click", closeSongPicker);

    // Escape key closes modal
    function onEscKey(e) {
      if (e.key === "Escape") closeSongPicker();
    }
    window.removeEventListener("keydown", onEscKey);
    window.addEventListener("keydown", onEscKey);

    // Prev / Next button navigation
    function goToPrevSong() {
      var curIdx = songs.findIndex(function (s) { return s.number === currentSelectedSong; });
      var prevIdx = (curIdx - 1 + songs.length) % songs.length;
      renderCurrSongs(songs[prevIdx].number);
      var detailEl = document.getElementById("song-detail-card");
      if (detailEl) detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function goToNextSong() {
      var curIdx = songs.findIndex(function (s) { return s.number === currentSelectedSong; });
      var nextIdx = (curIdx + 1) % songs.length;
      renderCurrSongs(songs[nextIdx].number);
      var detailEl = document.getElementById("song-detail-card");
      if (detailEl) detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    var barPrev = root.querySelector("#song-bar-prev");
    var barNext = root.querySelector("#song-bar-next");
    var bottomPrev = root.querySelector("#song-bottom-prev-btn");
    var bottomNext = root.querySelector("#song-bottom-next-btn");

    if (barPrev) barPrev.addEventListener("click", goToPrevSong);
    if (barNext) barNext.addEventListener("click", goToNextSong);
    if (bottomPrev) bottomPrev.addEventListener("click", goToPrevSong);
    if (bottomNext) bottomNext.addEventListener("click", goToNextSong);

    // View toggle buttons (Grid / List)
    var gridBtn = root.querySelector("#song-view-grid-btn");
    var listBtn = root.querySelector("#song-view-list-btn");
    var gridContainer = root.querySelector("#song-picker-grid");
    var listContainer = root.querySelector("#song-picker-list");

    if (gridBtn && listBtn && gridContainer && listContainer) {
      gridBtn.addEventListener("click", function () {
        songPickerViewMode = "grid";
        gridBtn.dataset.active = "true";
        listBtn.dataset.active = "false";
        gridContainer.style.display = "";
        listContainer.style.display = "none";
      });
      listBtn.addEventListener("click", function () {
        songPickerViewMode = "list";
        gridBtn.dataset.active = "false";
        listBtn.dataset.active = "true";
        gridContainer.style.display = "none";
        listContainer.style.display = "";
      });
    }

    // Search input handling
    var searchInput = root.querySelector("#song-picker-search-input");
    var searchClear = root.querySelector("#song-picker-search-clear");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        songPickerSearchQuery = searchInput.value;
        if (searchClear) searchClear.style.display = songPickerSearchQuery ? "" : "none";
        filterSongPicker();
      });
    }
    if (searchClear) {
      searchClear.addEventListener("click", function () {
        songPickerSearchQuery = "";
        if (searchInput) { searchInput.value = ""; searchInput.focus(); }
        searchClear.style.display = "none";
        filterSongPicker();
      });
    }

    // Range filter chips
    root.querySelectorAll(".song-range-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        root.querySelectorAll(".song-range-chip").forEach(function (c) { c.dataset.active = "false"; });
        chip.dataset.active = "true";
        songPickerActiveRange = chip.dataset.range;
        filterSongPicker();
      });
    });

    // Song items selection (in Grid and List)
    root.querySelectorAll(".song-grid-chip, .song-list-row").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var num = parseInt(btn.dataset.songNum, 10);
        closeSongPicker();
        if (num && num !== currentSelectedSong) {
          renderCurrSongs(num);
          var detailEl = document.getElementById("song-detail-card");
          if (detailEl) detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function renderCurrPrayer() {
    var root = document.getElementById("curr-prayer-root");
    if (!root) return;
    var prayerLines = PRAYER_TEMPLATE.lines.map(function (l) { return [l.vi, T(l.kr)]; });
    var html = '<div class="p-section" data-anchor="prayer-prep"><div class="curr-dict-head"><h3 style="margin:0">' + TU("기도 준비하기") + '</h3>' + readAllButtonHtml(prayerLines) + '</div><div class="curr-card">';
    if (PRAYER_TEMPLATE.note) html += '<p>' + escapeHtml(T(PRAYER_TEMPLATE.note)) + '</p>';
    html += '<div class="talk-lines">';
    PRAYER_TEMPLATE.lines.forEach(function (l) {
      html += '<div class="talk-line"><div class="talk-body"><div class="talk-vi">' + escapeHtml(l.vi) +
        '<button class="speak-btn" data-speak="' + escapeAttr(l.vi) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button></div>' +
        '<div class="talk-kr"><span class="talk-kr-text">' + escapeHtml(T(l.kr)) + '</span>' +
        '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(T(l.kr)) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
        '</div></div></div>';
    });
    html += '</div></div></div>';

    root.innerHTML = html;
    bindCurrSpeakBtns(root);
  }

  // 교과 > 사용설명 -- a from-scratch usage guide (USAGE_GUIDE_COMMON / USAGE_GUIDE_TABS, see
  // usage_guide_data.py) covering every app-wide common feature plus every subtab of every
  // top-level tab. Reuses the same .group-card collapsible pattern as renderCurrWeek16() above
  // (one card per section, all collapsed by default except the 공통 기능 card) via
  // bindCurrGroupCards(); each item inside is a simple name+body pair, no speak/전체 듣기 buttons
  // since this is reference text about the app, not Vietnamese study content.
  function renderCurrGuide() {
    var root = document.getElementById("curr-guide-root");
    if (!root) return;
    function itemsHtml(items) {
      var h = '<div class="curr-guide-item-list">';
      items.forEach(function (it) {
        h += '<div class="curr-guide-item"><h4>' + escapeHtml(T(it.name)) + '</h4><p>' + escapeHtml(T(it.body)) + '</p></div>';
      });
      return h + '</div>';
    }
    var html = '<div class="group-card" data-open="true" data-syl="guide-common">' +
      '<button class="group-head"><span class="curr-week-head"><span class="curr-guide-section-title">' + TU("공통 기능") + '</span></span>' + currChev() + '</button>' +
      '<div class="group-body">' + itemsHtml(USAGE_GUIDE_COMMON) + '</div></div>';
    USAGE_GUIDE_TABS.forEach(function (grp, i) {
      html += '<div class="group-card" data-open="false" data-syl="guide-tab' + i + '">' +
        '<button class="group-head"><span class="curr-week-head"><span class="curr-guide-section-title">' + escapeHtml(T(grp.tab_label)) + '</span></span>' + currChev() + '</button>' +
        '<div class="group-body">' + itemsHtml(grp.items) + '</div></div>';
    });
    root.innerHTML = html;
    bindCurrGroupCards(root);
  }

  (function () {
    renderCurrWeek16();
  })();

  /* ================= STUDY GAMES (복습 게임) ================= */
  (function () {
    var modeTabsEl = document.getElementById("study-mode-tabs");
    var bodyEl = document.getElementById("study-body");
    if (!modeTabsEl || !bodyEl) return;

    // Single-hanja vocab words (한자음/어순반대, from RHYME_GROUPS / WORD_ORDER_REVERSED_EXTRA)
    // carry a 'hanja' field the other vocab sources don't -- on their review flashcards we show
    // the hanja in parens right after the Korean gloss, e.g. "이룰 성(成)".
    function krGlossWithHanja(wd) {
      var g = Tstrict(wd.gloss);
      if (!g) return null;
      return wd.hanja ? (g + "(" + wd.hanja + ")") : g;
    }

    function dedupeByVi(arr) {
      var seen = {}; var out = [];
      arr.forEach(function (it) {
        if (!it || !it.vi || !it.kr) return;
        var k = String(it.vi).trim();
        var m = String(it.kr).trim();
        if (!k || !m || seen[k]) return;
        seen[k] = true;
        out.push({ vi: k, kr: m, meaning: it.meaning || "", songNo: it.songNo });
      });
      return out;
    }

    // Builds a review pool from ONLY the words in the currently-active vocabFocus range (set when
    // a 교과 바로가기 scopes the 어휘 탭 to e.g. "한자음 213~316") -- for the "[학습 범위내 복습
    // 게임]" button on the vocab-focus banner (vocabFocusBannerHtml() in the 어휘 IIFE above; both
    // it and vocabFocus itself live in the single outer app IIFE this file starts with, so they're
    // reachable here via normal closure even though this STUDY GAMES block is a separate IIFE).
    // Mirrors each vocab subtab's own applyVocabFocus() base-array + slice order exactly, so the
    // words tested here are precisely the ones the banner says are "in range".
    function vocabScopedPool() {
      if (!vocabFocus) return [];
      var mode = vocabFocus.mode, out = [];
      function push(vi, kr) { if (vi && kr) out.push({ vi: vi, kr: kr }); }
      if (mode === "theo") {
        applyVocabFocus("theo", VOCAB_THEO).forEach(function (it) { push(it.word, Tstrict(it.meaning)); });
      } else if (mode === "freq") {
        applyVocabFocus("freq", FREQ_VOCAB).forEach(function (it) { push(it.vi, Tstrict(it.kr)); });
      } else if (mode === "chain") {
        applyVocabFocus("chain", VOCAB_CHAIN).forEach(function (it) { push(it.word, Tstrict(it.meaning)); });
      } else if (mode === "names") {
        applyVocabFocus("names", BIBLE_NAMES).forEach(function (n) { push(n.vi, Tstrict(n.kr)); });
      } else if (mode === "basic") {
        var basicWords = [];
        BASIC_WORD_GROUPS.forEach(function (g) { basicWords = basicWords.concat(g.words); });
        applyVocabFocus("basic", basicWords).forEach(function (w) { push(w.vi, Tstrict(w.kr)); });
      } else if (mode === "antonym") {
        applyVocabFocus("antonym", ANTONYM_PAIRS).forEach(function (p) { push(p.vi1, Tstrict(p.kr1)); push(p.vi2, Tstrict(p.kr2)); });
      } else if (mode === "dialect") {
        applyVocabFocus("dialect", DIALECT_WORDS).forEach(function (d) {
          push(d.north.replace(/[/].*$/, ""), Tstrict(d.mean));
          push(d.south.replace(/[/].*$/, ""), Tstrict(d.mean));
        });
      } else if (mode === "rhyme") {
        var rhymeFlat = [];
        RHYME_GROUPS.forEach(function (g) { g.families.forEach(function (fam) { fam.words.forEach(function (wd) { rhymeFlat.push(wd); }); }); });
        rhymeFlat.slice(vocabFocus.start, vocabFocus.end).forEach(function (wd) { push(wd.word, krGlossWithHanja(wd)); });
      } else if (mode === "groups") {
        var groupsFlat = [];
        VOCAB_GROUPS.forEach(function (g) { g.words.forEach(function (w) { groupsFlat.push(w); }); });
        groupsFlat.slice(vocabFocus.start, vocabFocus.end).forEach(function (w) { push(w.word, Tstrict(w.meaning)); });
      } else if (mode === "orderrev") {
        var orItems = [];
        RHYME_GROUPS.forEach(function (g) { g.families.forEach(function (fam) { fam.words.forEach(function (wd) { if (wd.word_order_reversed) orItems.push(wd); }); }); });
        if (typeof WORD_ORDER_REVERSED_EXTRA !== "undefined") orItems = orItems.concat(WORD_ORDER_REVERSED_EXTRA);
        orItems.slice(vocabFocus.start, vocabFocus.end).forEach(function (wd) { push(wd.word, krGlossWithHanja(wd)); });
      } else if (mode === "wt") {
        var wtFlat = [];
        WATCHTOWER_VOCAB.forEach(function (wk) { wk.words.forEach(function (w) { wtFlat.push(w); }); });
        wtFlat.slice(vocabFocus.start, vocabFocus.end).forEach(function (w) { push(w.vi, Tstrict(w.mean)); });
      }
      return dedupeByVi(out);
    }

    var POOL_BUILDERS = {
      wizard: function () {
        var out = [];
        CASES.forEach(function (c) {
          Object.keys(c.stages).forEach(function (sn) {
            c.stages[sn].forEach(function (it) {
              if (it.viet && it.translation) addSentencePairs(out, it.viet, Tstrict(it.translation));
              if (it.reply && it.reply.name) addSentencePairs(out, it.reply.viet, Tstrict(it.reply.translation));
            });
          });
        });
        // 전체 호칭표 (merged into 호칭·대화 as a subtab) contributes to the same pool.
        REF_TABLE.forEach(function (sec) {
          sec.rows.forEach(function (r) {
            if (TERM_MEAN[r.listener]) out.push({ vi: r.listener, kr: TU(TERM_MEAN[r.listener]) });
            if (TERM_MEAN[r.self]) out.push({ vi: r.self, kr: TU(TERM_MEAN[r.self]) });
          });
        });
        // 제공 연설 (moved from 교과 into 호칭·대화 as a subtab) contributes to the same pool.
        OFFER_TALKS.forEach(function (t) {
          t.lines.forEach(function (l) { if (l.vi && l.kr) addSentencePairs(out, l.vi, Tstrict(l.kr)); });
        });
        // 기도 준비하기 (노래·기도) contributes its lines too, so the prayer text can be reviewed.
        PRAYER_TEMPLATE.lines.forEach(function (l) { if (l.vi && l.kr) addSentencePairs(out, l.vi, Tstrict(l.kr)); });
        // 이웃 사람과의 대화 (new 대화 subtab) contributes its 11 conversations' lines too.
        NEIGHBOR_CONVERSATIONS.forEach(function (conv) {
          conv.lines.forEach(function (l) {
            if (l.vi) {
              var vi = applyNeighborTermsVi(l.vi);
              var kr = applyNeighborTermsMeaning(Tstrict(l), currentLang);
              addSentencePairs(out, vi, kr);
            }
          });
        });
        // 일상 회화 (21 general dialogues, shared by all profiles) contributes its lines too.
        DAILY_CONVERSATIONS.forEach(function (conv) {
          conv.turns.forEach(function (t) { if (t.vi) addSentencePairs(out, t.vi, Tstrict(t)); });
        });
        return dedupeByVi(out);
      },
      vocab: function () {
        var out = [];
        RHYME_GROUPS.forEach(function (g) {
          g.families.forEach(function (fam) {
            fam.words.forEach(function (wd) { out.push({ vi: wd.word, kr: krGlossWithHanja(wd) }); });
          });
        });
        VOCAB_GROUPS.forEach(function (g) {
          g.words.forEach(function (w) { out.push({ vi: w.word, kr: Tstrict(w.meaning) }); });
        });
        VOCAB_CHAIN.forEach(function (it) { out.push({ vi: it.word, kr: Tstrict(it.meaning) }); });
        // 신권 어휘 + 자주 사용 어휘 (merged into 어휘 as subtabs) contribute to the same pool.
        VOCAB_THEO.forEach(function (it) { out.push({ vi: it.word, kr: Tstrict(it.meaning) }); });
        FREQ_VOCAB.forEach(function (it) { out.push({ vi: it.vi, kr: Tstrict(it.kr) }); });
        // 성경 인명 사전 + 기본 단어·반의어 (moved from 교과 into 어휘 as subtabs) contribute too.
        BIBLE_NAMES.forEach(function (n) { out.push({ vi: n.vi, kr: Tstrict(n.kr) }); });
        BASIC_WORD_GROUPS.forEach(function (g) {
          g.words.forEach(function (w) { out.push({ vi: w.vi, kr: Tstrict(w.kr) }); });
        });
        ANTONYM_PAIRS.forEach(function (p) {
          out.push({ vi: p.vi1, kr: Tstrict(p.kr1) });
          out.push({ vi: p.vi2, kr: Tstrict(p.kr2) });
        });
        // 남북 단어 (new 어휘 subtab) contributes too.
        DIALECT_WORDS.forEach(function (d) {
          out.push({ vi: d.north.replace(/[/].*$/, ""), kr: Tstrict(d.mean) });
          out.push({ vi: d.south.replace(/[/].*$/, ""), kr: Tstrict(d.mean) });
        });
        return dedupeByVi(out);
      },
      pron: function () {
        var out = [];
        TONE_PAIRS.forEach(function (p) {
          p.words.forEach(function (wd) { out.push({ vi: wd.vi, kr: Tstrict(wd.kr) }); });
        });
        NS_DIFFS.forEach(function (d) {
          d.examples.forEach(function (ex) { out.push({ vi: ex.word, kr: Tstrict(ex.mean) }); });
        });
        return dedupeByVi(out);
      },
      bible: function () {
        var out = [];
        BIBLE_OT.forEach(function (bk) { out.push({ vi: bk.vi, kr: Tstrict(bk.kr) }); });
        BIBLE_NT.forEach(function (bk) { out.push({ vi: bk.vi, kr: Tstrict(bk.kr) }); });
        [NUM_BASIC, NUM_TEEN, NUM_TENS, NUM_HUNDREDS, NUM_LARGE, NUM_SPECIAL].forEach(function (list) {
          list.forEach(function (it) { out.push({ vi: it.reading, kr: formatNum(it.num) }); });
        });
        return dedupeByVi(out);
      },
      grammar: function () {
        var out = [];
        GRAMMAR_INTRO.forEach(function (sec) {
          sec.examples.forEach(function (ex) { if (ex.vi && ex.kr) addSentencePairs(out, ex.vi, Tstrict(ex.kr)); });
        });
        GRAMMAR_UNITS.forEach(function (u) {
          u.steps.forEach(function (s) { if (s.kr) addSentencePairs(out, s.vi, Tstrict(s.kr)); });
        });
        // 범용 언어 생성표 + 문법 특강 (moved from 교과 into 문법·작문 as subtabs) contribute too.
        ["subjects", "modals", "verbs", "places"].forEach(function (k) {
          (SENT_GEN_BANK[k] || []).forEach(function (w) { addSentencePairs(out, w.vi, Tstrict(w.kr)); });
        });
        GX_MOTION_VERBS.forEach(function (v) { addSentencePairs(out, v.vi, Tstrict(v.kr)); });
        GX_POS_EXAMPLES.forEach(function (e) { addSentencePairs(out, e.vi, Tstrict(e.kr)); });
        GRAMMAR_DICT.forEach(function (g) {
          g.examples.forEach(function (e) { if (e.vi && e.kr) addSentencePairs(out, e.vi, Tstrict(e.kr)); });
        });
        if (typeof GRAMMAR_B1_B2_PATTERNS !== "undefined") {
          GRAMMAR_B1_B2_PATTERNS.forEach(function (g) {
            g.examples.forEach(function (e) { if (e.vi && e.kr) addSentencePairs(out, e.vi, Tstrict(e.kr)); });
          });
        }
        if (typeof GRAMMAR_A1_A2_PATTERNS !== "undefined") {
          GRAMMAR_A1_A2_PATTERNS.forEach(function (pat) {
            pat.examples.forEach(function (ex) { if (ex.vi && ex.ko) addSentencePairs(out, ex.vi, ex.ko); });
          });
        }
        return dedupeByVi(out);
      },
      // 문장 탭 (행복한 삶을 영원히 · 사람들을 사랑하고 제자로 · 파수대) -- 문장이 아닌 항목은 모두
      // 제외하므로, 파수대에서는 단어(w.vi/w.mean)가 아니라 예문(w.example/w.example_mean)만 쓴다.
      sentence: function () {
        var out = [];
        LFF_CONVERSATIONS.forEach(function (rec) {
          lffDisplayLines(rec).forEach(function (l) {
            if (isReviewableLffLine(l)) addSentencePairs(out, applyLffListenerTerms(l.vi), Tstrict(l));
          });
        });
        LPD_LESSONS.forEach(function (rec) {
          rec.lines.forEach(function (l) {
            if (l.vi) {
              if (rec.kind === "appendix" && rec.num === "A") {
                var u = applyLpdTerms(l);
                if (u.kr && u.kr.trim()) out.push({ vi: u.vi, kr: u.kr });
              } else {
                addSentencePairs(out, l.vi, Tstrict(l));
              }
            }
          });
        });
        WATCHTOWER_VOCAB.forEach(function (wk) {
          wk.words.forEach(function (w) {
            if (w.example && w.example_mean) addSentencePairs(out, w.example, Tstrict(w.example_mean));
          });
        });
        return dedupeByVi(out);
      },
      song: function () {
        var out = [];
        var data = (typeof SONGS_DATA !== "undefined" && SONGS_DATA) || [];
        data.forEach(function (s) {
          var sNum = String(s.number);
          var mObj = (typeof SONG_MEANINGS !== "undefined" && SONG_MEANINGS[sNum]) || {};
          var buf = [];

          function flushSentence() {
            if (!buf.length) return;
            var viFull = buf.map(function (it) { return stripReviewListMarker(it.vi); }).join(" ").trim();
            var targetFull = buf.map(function (it) { return stripReviewListMarker(it.target); }).join(" ").trim();
            var hasAnyMeaning = buf.some(function (it) { return it.meaning; });
            var meaningFull = "";
            if (hasAnyMeaning) {
              meaningFull = buf.map(function (it) {
                return it.meaning ? stripReviewListMarker(it.meaning) : stripReviewListMarker(it.target);
              }).join(" ").trim();
            }
            if (viFull && targetFull) {
              out.push({
                vi: viFull,
                kr: targetFull,
                meaning: meaningFull,
                songNo: s.number
              });
            }
            buf = [];
          }

          s.lines.forEach(function (l, idx) {
            var vi = (l.vi || "").trim();
            if (!vi) return;
            if (isSongSectionMarker(vi)) {
              flushSentence();
              // A section marker itself carries no reviewable lyric content, but a real,
              // existing SONG_MEANINGS entry attached to its index must still be reachable --
              // same invariant as the viewer (renderCurrSongs) -- so surface it as its own
              // standalone Review unit rather than silently dropping it.
              var markerTarget = songSanitize((l[currentLang] || l.ko || "").trim());
              var markerMeaning = songSanitize((mObj[String(idx)] && mObj[String(idx)][currentLang]) || "");
              if (markerMeaning && markerTarget) {
                out.push({ vi: vi, kr: markerTarget, meaning: markerMeaning, songNo: s.number });
              }
              return;
            }
            var target = songSanitize((l[currentLang] || l.ko || "").trim());
            if (!target || isSongSectionMarker(target)) {
              flushSentence();
              return;
            }
            var mn = songSanitize((mObj[String(idx)] && mObj[String(idx)][currentLang]) || "");
            buf.push({
              vi: vi,
              target: target,
              meaning: mn
            });
            if (/[.!?…]["'”’)]?\s*$/.test(vi)) {
              flushSentence();
            }
          });
          flushSentence();
        });
        return dedupeByVi(out);
      }
    };

    function getSongReviewScopes() {
      var songs = (typeof SONGS_DATA !== "undefined" && SONGS_DATA) || [];
      var maxNum = 0;
      songs.forEach(function (s) { if (s.number > maxNum) maxNum = s.number; });
      if (!maxNum) maxNum = songs.length || 163;
      var scopes = ["all"];
      for (var start = 1; start <= maxNum; start += 20) {
        var end = Math.min(start + 19, maxNum);
        scopes.push(start + "-" + end);
      }
      return scopes;
    }

    // The review panel mirrors the learnable subtabs of each main section.  Utility/settings
    // panes (voice settings and the sentence generator) intentionally aren't listed: they do
    // not contain a fixed set of question-and-answer study items to quiz.
    var REVIEW_SCOPES = {
      pron: ["all", "alphabet", "tones", "tonepairs", "nsdiff"],
      bible: ["all", "books", "numbers", "time", "days", "months"],
      wizard: ["all", "main", "reftable", "talks", "neighbor", "daily"],
      vocab: ["all", "rhyme", "orderrev", "groups", "basic", "antonym", "freq", "theo", "names", "chain", "dialect"],
      sentence: ["all", "lff", "lpd", "wt"],
      grammar: ["all", "lessons", "special", "sentences"],
      song: ["all"]
    };
    var REVIEW_SCOPE_LABELS = {
      all: "전체", alphabet: "문자", tones: "성조", tonepairs: "연속 성조", nsdiff: "남북 발음",
      books: "성경", numbers: "숫자", time: "시간", days: "요일, 날짜", months: "달, 계절",
      main: "첫만남", reftable: "호칭", talks: "제공 연설", neighbor: "이웃 사람과의 대화", daily: "일상 회화", lff: "행복한 삶을 영원히", lpd: "사람들을 사랑하고 제자로",
      rhyme: "한자음", orderrev: "어순반대", groups: "동일음", basic: "기본", antonym: "반의", freq: "상용", theo: "신권", names: "인명", chain: "끝말", dialect: "남북 단어", wt: "파수대",
      lessons: "예문", special: "특강", sentences: "범용 언어 생성표"
    };
    function reviewScopeLabel(scope) {
      var m = scope && scope.match(/^(\d+)-(\d+)$/);
      if (m) {
        var s1 = m[1], s2 = m[2];
        if (currentLang === "zh") return s1 + "-" + s2 + "首";
        if (currentLang === "en") return "Songs " + s1 + "-" + s2;
        if (currentLang === "ja") return s1 + "-" + s2 + "番";
        return s1 + "~" + s2 + "번";
      }
      if (scope !== "all") return TU(REVIEW_SCOPE_LABELS[scope] || scope);
      return currentLang === "zh" ? "全部" : currentLang === "en" ? "All" : currentLang === "ja" ? "すべて" : "전체";
    }
    window.reviewScopedPool = reviewScopedPool; // read-only hook used by tests/test_browser_runtime.js
    function reviewScopedPool(key, scope) {
      if (!scope || scope === "all") return POOL_BUILDERS[key] ? POOL_BUILDERS[key]() : [];
      var out = [];
      function sentence(vi, kr) { if (vi && kr) addSentencePairs(out, vi, kr); }
      if (key === "pron") {
        if (scope === "alphabet") ALPHABET.forEach(function (a) { out.push({ vi: a[1].replace(/^\[|\]$/g, ""), kr: a[0] }); });
        else if (scope === "tones") TONES.forEach(function (t) { out.push({ vi: t.mark, kr: Tstrict(t.kr) }); });
        else if (scope === "tonepairs") TONE_PAIRS.forEach(function (p) { p.words.forEach(function (w) { out.push({ vi: w.vi, kr: Tstrict(w.kr) }); }); });
        else if (scope === "nsdiff") NS_DIFFS.forEach(function (d) { d.examples.forEach(function (e) { out.push({ vi: e.word, kr: Tstrict(e.mean) }); }); });
      } else if (key === "bible") {
        if (scope === "books") BIBLE_OT.concat(BIBLE_NT).forEach(function (b) { out.push({ vi: b.vi, kr: Tstrict(b.kr) }); });
        else if (scope === "numbers") [NUM_BASIC, NUM_TEEN, NUM_TENS, NUM_HUNDREDS, NUM_LARGE, NUM_SPECIAL].forEach(function (list) { list.forEach(function (n) { out.push({ vi: n.reading, kr: formatNum(n.num) }); }); });
        else if (scope === "time") [TIME_HOURS, TIME_PERIODS, TIME_EXAMPLES].forEach(function (list) { list.forEach(function (i) { out.push({ vi: i.vi, kr: Tstrict(i.kr) }); }); });
        else if (scope === "days") [CAL_DAYS, CAL_DATES].forEach(function (list) { list.forEach(function (i) { out.push({ vi: i.vi, kr: Tstrict(i.kr) }); }); });
        else if (scope === "months") [CAL_MONTHS, CAL_SEASONS].forEach(function (list) { list.forEach(function (i) { out.push({ vi: i.vi, kr: Tstrict(i.kr) }); }); });
      } else if (key === "wizard") {
        if (scope === "main") CASES.forEach(function (c) { Object.keys(c.stages).forEach(function (s) { c.stages[s].forEach(function (i) { if (i.viet && i.translation) sentence(i.viet, Tstrict(i.translation)); if (i.reply && i.reply.name) sentence(i.reply.viet, Tstrict(i.reply.translation)); }); }); });
        else if (scope === "reftable") REF_TABLE.forEach(function (sec) { sec.rows.forEach(function (r) { if (TERM_MEAN[r.listener]) out.push({ vi: r.listener, kr: TU(TERM_MEAN[r.listener]) }); if (TERM_MEAN[r.self]) out.push({ vi: r.self, kr: TU(TERM_MEAN[r.self]) }); }); });
        else if (scope === "talks") OFFER_TALKS.forEach(function (t) { t.lines.forEach(function (l) { sentence(l.vi, Tstrict(l.kr)); }); });
        else if (scope === "neighbor") NEIGHBOR_CONVERSATIONS.forEach(function (c) { c.lines.forEach(function (l) { sentence(applyNeighborTermsVi(l.vi), applyNeighborTermsMeaning(Tstrict(l), currentLang)); }); });
        else if (scope === "daily") DAILY_CONVERSATIONS.forEach(function (c) { c.turns.forEach(function (t) { sentence(applyDailyPronouns(c, t), Tstrict(t)); }); });
      } else if (key === "sentence") {
        if (scope === "lff") LFF_CONVERSATIONS.forEach(function (r) { lffDisplayLines(r).forEach(function (l) { if (isReviewableLffLine(l)) sentence(applyLffListenerTerms(l.vi), Tstrict(l)); }); });
        else if (scope === "lpd") LPD_LESSONS.forEach(function (r) {
          r.lines.forEach(function (l) {
            if (r.kind === "appendix" && r.num === "A") {
              var u = applyLpdTerms(l);
              if (u.kr && u.kr.trim()) out.push({ vi: u.vi, kr: u.kr });
            } else {
              sentence(l.vi, Tstrict(l));
            }
          });
        });
        else if (scope === "wt" || (scope && scope.indexOf("wt:") === 0)) {
          var targetWeek = (scope && scope.indexOf("wt:") === 0) ? parseInt(scope.slice(3), 10) : 0;
          WATCHTOWER_VOCAB.forEach(function (wk) {
            if (targetWeek && wk.week !== targetWeek) return;
            wk.words.forEach(function (w) {
              if (w.example && w.example_mean) sentence(w.example, Tstrict(w.example_mean));
            });
          });
        }
      } else if (key === "vocab") {
        if (scope === "rhyme") RHYME_GROUPS.forEach(function (g) { g.families.forEach(function (f) { f.words.forEach(function (w) { out.push({ vi: w.word, kr: krGlossWithHanja(w) }); }); }); });
        else if (scope === "orderrev") { RHYME_GROUPS.forEach(function (g) { g.families.forEach(function (f) { f.words.forEach(function (w) { if (w.word_order_reversed) out.push({ vi: w.word, kr: krGlossWithHanja(w) }); }); }); }); if (typeof WORD_ORDER_REVERSED_EXTRA !== "undefined") WORD_ORDER_REVERSED_EXTRA.forEach(function (w) { out.push({ vi: w.word, kr: krGlossWithHanja(w) }); }); }
        else if (scope === "groups") VOCAB_GROUPS.forEach(function (g) { g.words.forEach(function (w) { out.push({ vi: w.word, kr: Tstrict(w.meaning) }); }); });
        else if (scope === "basic") BASIC_WORD_GROUPS.forEach(function (g) { g.words.forEach(function (w) { out.push({ vi: w.vi, kr: Tstrict(w.kr) }); }); });
        else if (scope === "antonym") ANTONYM_PAIRS.forEach(function (p) { out.push({ vi: p.vi1, kr: Tstrict(p.kr1) }, { vi: p.vi2, kr: Tstrict(p.kr2) }); });
        else if (scope === "freq") FREQ_VOCAB.forEach(function (w) { out.push({ vi: w.vi, kr: Tstrict(w.kr) }); });
        else if (scope === "theo") VOCAB_THEO.forEach(function (w) { out.push({ vi: w.word, kr: Tstrict(w.meaning) }); });
        else if (scope === "names") BIBLE_NAMES.forEach(function (w) { out.push({ vi: w.vi, kr: Tstrict(w.kr) }); });
        else if (scope === "chain") VOCAB_CHAIN.forEach(function (w) { out.push({ vi: w.word, kr: Tstrict(w.meaning) }); });
        else if (scope === "dialect") DIALECT_WORDS.forEach(function (w) { out.push({ vi: w.north.replace(/[/].*$/, ""), kr: Tstrict(w.mean) }, { vi: w.south.replace(/[/].*$/, ""), kr: Tstrict(w.mean) }); });
      } else if (key === "grammar") {
        if (scope === "lessons") {
          GRAMMAR_INTRO.forEach(function (s) { s.examples.forEach(function (e) { sentence(e.vi, Tstrict(e.kr)); }); });
          GRAMMAR_UNITS.forEach(function (u) { u.steps.forEach(function (s) { sentence(s.vi, Tstrict(s.kr)); }); });
          if (typeof GRAMMAR_A1_A2_PATTERNS !== "undefined") {
            GRAMMAR_A1_A2_PATTERNS.forEach(function (p) {
              p.examples.forEach(function (e) { sentence(e.vi, e.ko); });
            });
          }
        }
        else if (scope === "special") { GX_MOTION_VERBS.forEach(function (v) { sentence(v.vi, Tstrict(v.kr)); }); GX_POS_EXAMPLES.forEach(function (e) { sentence(e.vi, Tstrict(e.kr)); }); GRAMMAR_DICT.concat(typeof GRAMMAR_B1_B2_PATTERNS !== "undefined" ? GRAMMAR_B1_B2_PATTERNS : []).forEach(function (g) { g.examples.forEach(function (e) { sentence(e.vi, Tstrict(e.kr)); }); }); }
        else if (scope === "sentences") ["subjects", "modals", "verbs", "places"].forEach(function (k) { (SENT_GEN_BANK[k] || []).forEach(function (w) { sentence(w.vi, Tstrict(w.kr)); }); });
      } else if (key === "song") {
        var allSongs = POOL_BUILDERS.song ? POOL_BUILDERS.song() : [];
        var m = scope ? scope.match(/^(\d+)-(\d+)$/) : null;
        if (m) {
          var startNum = parseInt(m[1], 10);
          var endNum = parseInt(m[2], 10);
          out = allSongs.filter(function (it) { return it.songNo >= startNum && it.songNo <= endNum; });
        } else {
          out = allSongs;
        }
      }
      return dedupeByVi(out);
    }

    var poolCache = {};
    function getPool(key, scope) {
      var cacheKey = key + ":" + (scope || "all");
      if (!poolCache[cacheKey]) poolCache[cacheKey] = reviewScopedPool(key, scope || "all");
      return poolCache[cacheKey];
    }

    function tokenize(vi) { return vi.trim().split(/\s+/).filter(Boolean); }
    function shuffle(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    function chevronIcon(dir) {
      var d = dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6";
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
    }
    function shuffleGlyphIcon() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>';
    }

    var studyState = { tabKey: null, scope: "all", mode: "flash", pool: [], deck: [], idx: 0, score: { correct: 0, total: 0 }, current: null, orderTokens: [], orderBank: [], orderPlaced: [] };
    window.__getPool = getPool;
    window.__studyState = studyState;

    /* ---------- 자동 넘김 (auto-advance) ---------- */
    // A single toggle + interval selector, shared across all 5 study modes. The timer starts only
    // once the question's own read-aloud (speakItemThenArm(), including every 베트남어 반복 듣기
    // 횟수 repeat) has fully finished playing -- see that function's comment. If the learner
    // answers manually before the timer fires, it's cancelled and the mode instead speaks the
    // (already-revealed) answer once and moves on right away. If they don't, the timer itself --
    // after running the FULL autoAdvanceSeconds, uninterrupted -- reveals the correct answer and
    // calls revealFn, which speaks it (again, every repeat) and only THEN moves on. So neither the
    // question's nor the answer's read-aloud time is ever counted against autoAdvanceSeconds: the
    // interval is purely "how long the learner gets to look/think," bracketed on both sides by
    // as-long-as-it-takes audio. Each mode supplies a small "reveal" function (revealFlash/
    // revealLook/revealMcq/revealOrder/revealType) that does that mode's own reveal+speak+advance;
    // armAutoReveal()/speakThenAdvance() below are the shared plumbing every mode calls into.
    var AUTO_ADV_SECONDS_OPTS = [3, 5, 8, 10, 15];
    var autoAdvanceEnabled = false;
    var autoNextOnCorrect = false;
    var autoAdvanceSeconds = 5;
    try {
      var savedAutoAdv = window.localStorage && window.localStorage.getItem("vn-app-auto-adv");
      if (savedAutoAdv) {
        var parsedAutoAdv = JSON.parse(savedAutoAdv);
        if (parsedAutoAdv && typeof parsedAutoAdv.enabled === "boolean") autoAdvanceEnabled = parsedAutoAdv.enabled;
        if (parsedAutoAdv && typeof parsedAutoAdv.nextOnCorrect === "boolean") autoNextOnCorrect = parsedAutoAdv.nextOnCorrect;
        if (parsedAutoAdv && AUTO_ADV_SECONDS_OPTS.indexOf(parsedAutoAdv.seconds) >= 0) autoAdvanceSeconds = parsedAutoAdv.seconds;
      }
    } catch (e0) { /* no-op: localStorage unavailable */ }
    function saveAutoAdvancePref() {
      try { window.localStorage && window.localStorage.setItem("vn-app-auto-adv", JSON.stringify({ enabled: autoAdvanceEnabled, nextOnCorrect: autoNextOnCorrect, seconds: autoAdvanceSeconds })); } catch (e) { /* no-op */ }
    }
    // 묵음(Mute): skips the automatic question-start playback in flash/look/order/type -- every
    // one of those modes already shows the full question as text (the Vietnamese itself, or in
    // order/type's case the meaning prompt), so the audio there is a convenience, not the
    // question. Three sub-scopes let the learner mute just one language or both: 한/베/베한 (ko),
    // 中文/越南語/全部 (zh), EN/VN/All (en), 日本語/ベトナム/全て (ja) -- i.e. "meaning", "vi", or
    // "both". 듣기 4지선다 is special-cased: its Vietnamese audio IS the question, nothing else
    // on screen identifies the item, so that mode only ever offers/honors the meaning-mute
    // option (checking 묵음 there locks to it automatically) -- see isMuted() and the mcq
    // handling in renderAutoAdvanceControls() below. Manual replay buttons (다시 듣기 / the
    // speak-btn) are untouched either way; this only suppresses the automatic auto-play.
    var MUTE_SCOPE_LABELS = {
      meaning: { ko: "한", zh: "中", en: "EN", ja: "日語" },
      vi: { ko: "베", zh: "越", en: "VN", ja: "ベト" },
      both: { ko: "베한", zh: "全", en: "All", ja: "全て" }
    };
    function muteScopeLabel(key) { return (MUTE_SCOPE_LABELS[key] || {})[currentLang] || key; }
    var muteScope = ""; // "" (off) | "meaning" | "vi" | "both"
    try {
      var savedMuteScope = window.localStorage && window.localStorage.getItem("vn-app-mute-scope");
      if (savedMuteScope === "meaning" || savedMuteScope === "vi" || savedMuteScope === "both") {
        muteScope = savedMuteScope;
      } else if (window.localStorage && window.localStorage.getItem("vn-app-mute-autoplay") === "1") {
        muteScope = "both"; // one-time migration from the old plain on/off checkbox
      }
    } catch (eMute) { /* no-op */ }
    function saveMuteScopePref() {
      try { window.localStorage && window.localStorage.setItem("vn-app-mute-scope", muteScope); } catch (e) { /* no-op */ }
    }
    // kind: "vi" or "meaning" -- which language's audio is about to auto-play.
    function isMuted(kind) {
      if (!muteScope) return false;
      if (studyState.mode === "mcq") return kind === "meaning";
      return muteScope === "both" || muteScope === kind;
    }
    var autoAdvanceTimer = null;
    function clearAutoAdvanceTimer() {
      if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
    }
    // Arms the timer -- called only once the question's own read-aloud has finished (see
    // speakItemThenArm()) -- to call revealFn after the FULL autoAdvanceSeconds have passed with
    // no answer. revealFn is responsible for showing the correct answer and calling
    // speakThenAdvance() itself once it's done updating the DOM; that call's own read-aloud time
    // (every repeat) runs entirely after this timer fires, so it's never subtracted from the wait
    // here -- unlike the old "reveal 1s early to leave room to read the answer" scheme, the answer
    // is read AFTER the interval, not squeezed inside the tail end of it. Re-checks the toggle and
    // that 복습 is still the visible tab at fire time, so navigating away (or answering manually,
    // which clears this timer) never fires a reveal into the wrong context.
    function armAutoReveal(revealFn) {
      clearAutoAdvanceTimer();
      if (!autoAdvanceEnabled) return;
      var waitMs = Math.max(200, autoAdvanceSeconds * 1000);
      autoAdvanceTimer = setTimeout(function () {
        autoAdvanceTimer = null;
        if (!autoAdvanceEnabled || !reviewTabIsActive()) return;
        revealFn();
      }, waitMs);
    }
    // Speaks text (Vietnamese via speak() when isVi, otherwise the current UI language's meaning
    // voice via speakMeaning()) and calls advanceFn once the utterance ends -- the shared "read
    // the answer, then move to the next question" tail every mode's auto-advance uses, whether
    // reached via a manual answer or via armAutoReveal's own cold reveal.
    function speakThenAdvance(text, isVi, advanceFn) {
      function go() { if (reviewTabIsActive()) advanceFn(); }
      var kind = isVi ? "vi" : "meaning";
      if (isMuted(kind)) {
        go();
      } else {
        if (isVi) speak(text, go); else speakMeaning(text, go);
      }
    }
    // flash/mcq/look/type all auto-play the item's Vietnamese audio the moment it's shown, and
    // (when 자동 넘김 is on) also start a countdown toward auto-revealing the answer and moving
    // on. Those two used to run as independent, RACING timers: armAutoReveal()'s countdown is a
    // plain setTimeout that knows nothing about how long the audio actually takes, so once
    // "베트남어 반복 듣기 횟수" made that initial playback take 2-5x longer (repsLeft reps back to
    // back), the countdown routinely fired -- and, via revealFn's own speak()/speakMeaning() call,
    // cancelled the still-playing repeat sequence -- well before the audio had finished reading
    // even once. Chaining the countdown to start only once the initial playback's onDone fires
    // (instead of starting it up front, in parallel) keeps that read-aloud time OUT of the
    // autoAdvanceSeconds window entirely: the learner now gets the full playback PLUS a full
    // autoAdvanceSeconds to answer, rather than the two overlapping and the audio losing the race.
    function speakItemThenArm(vi, revealFn) {
      if (reviewTabIsActive() && !isMuted("vi")) {
        if (autoAdvanceEnabled) speak(vi, function () { if (reviewTabIsActive()) armAutoReveal(revealFn); });
        else speak(vi);
      } else if (autoAdvanceEnabled) {
        // Background pre-render (see reviewTabIsActive()'s own comment), or 묵음 is on -- either
        // way no audio plays, so there's nothing to wait on; arm immediately same as before,
        // harmless since the timer's own fire-time reviewTabIsActive() check no-ops it if the
        // tab is still never opened.
        armAutoReveal(revealFn);
      }
    }
    // 어순 배열's prompt is the MEANING (item.kr) -- the Vietnamese is what the learner is
    // arranging, so reading it aloud up front would just hand them the answer. This mirrors
    // speakItemThenArm() above but reads item.kr in the current UI-language voice instead of
    // item.vi in Vietnamese, same background-pre-render guard and same "arm only after the
    // audio finishes" auto-advance chaining.
    function speakPromptThenArm(kr, revealFn) {
      if (reviewTabIsActive() && !isMuted("meaning")) {
        if (autoAdvanceEnabled) speakMeaning(kr, function () { if (reviewTabIsActive()) armAutoReveal(revealFn); });
        else speakMeaning(kr);
      } else if (autoAdvanceEnabled) {
        armAutoReveal(revealFn);
      }
    }
    function currentRevealFn() {
      if (studyState.mode === "flash") return revealFlash;
      if (studyState.mode === "look") return revealLook;
      if (studyState.mode === "mcq") return revealMcq;
      if (studyState.mode === "order") return revealOrder;
      return revealType;
    }
    var autoAdvRoot = document.getElementById("study-auto-row");
    var lastNonMcqScope = (muteScope && muteScope !== "meaning") ? muteScope : "both";
    function renderAutoAdvanceControls() {
      if (!autoAdvRoot) return;
      // 듣기 4지선다's Vietnamese audio IS the question, so only the (functionally silent
      // anyway) meaning-mute sub-option is ever offered there -- checking 묵음 in that mode
      // locks straight to it, with no 베/베한 button rendered to switch away from it.
      var inMcq = studyState.mode === "mcq";
      if (inMcq && muteScope && muteScope !== "meaning") {
        muteScope = "meaning";
        saveMuteScopePref();
      }
      var scopeKeys = inMcq ? ["meaning"] : ["meaning", "vi", "both"];
      var activeScope = inMcq ? "meaning" : (muteScope || lastNonMcqScope || "both");
      var optionsHtml = scopeKeys.map(function (k) {
        return '<option value="' + k + '"' + (activeScope === k ? ' selected' : '') + '>' + escapeHtml(muteScopeLabel(k)) + '</option>';
      }).join('');
      var muteHtml = '<span class="mute-group">' +
        '<label class="mute-autoplay-option"><input type="checkbox" id="mute-autoplay-toggle" ' + (muteScope ? "checked" : "") + '> ' + TU("묵음") + '</label>' +
        '<select id="mute-scope-select" class="mute-scope-select" ' + (muteScope ? "" : "disabled") + (inMcq ? ' aria-readonly="true"' : '') + '>' +
        optionsHtml +
        '</select></span>';
      var html = '<label class="repeat-review-option"><span>' + TU("반복 듣기") + '</span><span id="repeat-toggle-review"></span></label>' +
        muteHtml +
        '<span class="auto-advance-group"><label class="auto-advance-option"><input type="checkbox" id="auto-advance-toggle" ' + (autoAdvanceEnabled ? "checked" : "") + '> ' + TU("자동 넘김") + '</label>' +
        '<select id="auto-advance-seconds" class="auto-seconds-select" ' + (autoAdvanceEnabled ? "" : "disabled") + '>' +
        AUTO_ADV_SECONDS_OPTS.map(function (s) { return '<option value="' + s + '"' + (s === autoAdvanceSeconds ? " selected" : "") + '>' + s + TU("초") + '</option>'; }).join("") +
        '</select></span><label class="auto-correct-option"><input type="checkbox" id="auto-next-correct-toggle" ' + (autoNextOnCorrect ? "checked" : "") + '> ' + TU("정답 시 다음 문제") + '</label>';
      autoAdvRoot.innerHTML = html;
      renderViRepeatToggle(document.getElementById("repeat-toggle-review"));
      var muteToggle = document.getElementById("mute-autoplay-toggle");
      var muteSelect = document.getElementById("mute-scope-select");
      if (muteToggle) {
        muteToggle.addEventListener("change", function (e) {
          if (e.target.checked) {
            muteScope = inMcq ? "meaning" : (lastNonMcqScope || "both");
          } else {
            muteScope = "";
          }
          saveMuteScopePref();
          renderAutoAdvanceControls();
        });
      }
      if (muteSelect) {
        muteSelect.addEventListener("change", function (e) {
          if (inMcq) return;
          muteScope = e.target.value;
          lastNonMcqScope = muteScope;
          saveMuteScopePref();
          renderAutoAdvanceControls();
        });
      }
      document.getElementById("auto-advance-toggle").addEventListener("change", function (e) {
        autoAdvanceEnabled = e.target.checked;
        saveAutoAdvancePref();
        document.getElementById("auto-advance-seconds").disabled = !autoAdvanceEnabled;
        if (!autoAdvanceEnabled) clearAutoAdvanceTimer();
        else if (studyState.current) armAutoReveal(currentRevealFn());
      });
      document.getElementById("auto-advance-seconds").addEventListener("change", function (e) {
        autoAdvanceSeconds = parseInt(e.target.value, 10) || 5;
        saveAutoAdvancePref();
        if (autoAdvanceEnabled && studyState.current) armAutoReveal(currentRevealFn());
      });
      document.getElementById("auto-next-correct-toggle").addEventListener("change", function (e) {
        autoNextOnCorrect = e.target.checked;
        saveAutoAdvancePref();
      });
    }
    renderAutoAdvanceControls();
    onLangChange(renderAutoAdvanceControls);

    // getPool()'s "kr" side is flattened via T() at build time and cached per category key, so a
    // language switch must invalidate that cache; if a category is currently open, rebuild its
    // pool and restart the current mode so the visible game view updates too (not just future
    // category selections).
    onLangChange(function () {
      poolCache = {};
      if (studyState.tabKey) {
        studyState.pool = getPool(studyState.tabKey, studyState.scope);
        renderReviewScopes(studyState.tabKey, studyState.scope);
        startMode();
      }
    });

    // The review panel is fully pre-rendered (with its first flashcard) as soon as the app
    // loads, so that switching to the 복습 tab feels instant -- but that pre-render must stay
    // silent. Without this guard, renderFlash()'s auto-speak fires during that background
    // pre-render, before the user has touched anything, playing Vietnamese TTS unprompted.
    function reviewTabIsActive() {
      var tb = document.querySelector('.tab-btn[data-tab="review"]');
      return !!tb && tb.getAttribute("aria-selected") === "true";
    }

    // Space/Enter = "next" for flashcard, listening 4-choice, and word-order modes -- lets
    // someone review hands-mostly-free without reaching for the mouse each time. Bound once
    // (not per-render) and dispatched dynamically off studyState.mode/the DOM's current "next"
    // button, so it stays correct across re-renders without piling up duplicate listeners.
    // Skipped entirely for 받아쓰기(type) mode, whose own input field needs Space for typing --
    // that mode's Enter-to-advance is wired separately, scoped to its input.
    document.addEventListener("keydown", function (e) {
      if (e.key !== " " && e.key !== "Enter") return;
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (!reviewTabIsActive()) return;
      var tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable)) return;
      var nextBtn = null;
      if (studyState.mode === "flash") nextBtn = document.getElementById("flash-next");
      else if (studyState.mode === "look") nextBtn = document.getElementById("look-next");
      else if (studyState.mode === "mcq") nextBtn = document.getElementById("mcq-next");
      else if (studyState.mode === "order") nextBtn = document.getElementById("order-skip");
      if (nextBtn) {
        e.preventDefault();
        nextBtn.click();
      }
    });

    var reviewBtns = document.querySelectorAll(".subtab-btn[data-review]");
    var reviewScopeEl = document.getElementById("review-scope-tabs");
    var reviewSubscopeEl = document.getElementById("review-subscope-row");

    function renderReviewSubscope(key, selectedScope) {
      if (!reviewSubscopeEl) return;
      var isWt = (key === "sentence" && (selectedScope === "wt" || (selectedScope && selectedScope.indexOf("wt:") === 0)));
      if (!isWt) {
        reviewSubscopeEl.style.display = "none";
        reviewSubscopeEl.innerHTML = "";
        return;
      }
      reviewSubscopeEl.style.display = "flex";
      var activeWeek = (selectedScope && selectedScope.indexOf("wt:") === 0) ? parseInt(selectedScope.slice(3), 10) : 0;
      var totalWeeks = (typeof WATCHTOWER_VOCAB !== "undefined" && WATCHTOWER_VOCAB.length) || 24;

      var allLabel = currentLang === "en" ? "All Weeks (1–" + totalWeeks + ")" :
                     currentLang === "zh" ? "全部週次 (1~" + totalWeeks + "週)" :
                     currentLang === "ja" ? "全週 (1～" + totalWeeks + "週)" :
                     "전체 주차 (1~" + totalWeeks + "주)";

      var optionsHtml = '<option value="wt"' + (activeWeek === 0 ? ' selected' : '') + '>' + escapeHtml(allLabel) + '</option>';
      (WATCHTOWER_VOCAB || []).forEach(function (wk) {
        var wNum = wk.week;
        var dateStr = T(wk.date_range);
        var labelPrefix = currentLang === "en" ? "Week " + wNum :
                          currentLang === "zh" ? "第" + wNum + "週" :
                          currentLang === "ja" ? "第" + wNum + "週" :
                          wNum + "주차";
        var label = labelPrefix + ": " + dateStr;
        optionsHtml += '<option value="wt:' + wNum + '"' + (activeWeek === wNum ? ' selected' : '') + '>' + escapeHtml(label) + '</option>';
      });

      var prevDisabled = activeWeek <= 1 ? (activeWeek === 0 ? ' disabled' : '') : '';
      var nextDisabled = activeWeek >= totalWeeks ? ' disabled' : '';

      reviewSubscopeEl.innerHTML =
        '<button type="button" class="review-subscope-nav-btn" id="review-wt-prev"' + prevDisabled + ' aria-label="' + TU("이전") + '">◀</button>' +
        '<select id="review-wt-week-select" class="review-subscope-select" aria-label="' + TU("파수대 주차 선택") + '">' + optionsHtml + '</select>' +
        '<button type="button" class="review-subscope-nav-btn" id="review-wt-next"' + nextDisabled + ' aria-label="' + TU("다음") + '">▶</button>';

      var sel = document.getElementById("review-wt-week-select");
      if (sel) {
        sel.addEventListener("change", function () {
          selectCategory("sentence", sel.value);
        });
      }
      var prevBtn = document.getElementById("review-wt-prev");
      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          if (activeWeek <= 1) {
            selectCategory("sentence", "wt");
          } else {
            selectCategory("sentence", "wt:" + (activeWeek - 1));
          }
        });
      }
      var nextBtn = document.getElementById("review-wt-next");
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          if (activeWeek === 0) {
            selectCategory("sentence", "wt:1");
          } else if (activeWeek < totalWeeks) {
            selectCategory("sentence", "wt:" + (activeWeek + 1));
          }
        });
      }
    }

    function renderReviewScopes(key, selectedScope) {
      if (!reviewScopeEl) return;
      var scopes = (key === "song" ? getSongReviewScopes() : (REVIEW_SCOPES[key] || ["all"]));
      // REVIEW_SCOPES is a static, profile-independent list; each of its non-"all" entries names
      // exactly one subtab value of this same category's own top-level tab (e.g. "wizard":"talks"
      // <-> that tab's own [data-wizard="talks"] button). GENERAL removes several of those subtab
      // buttons (제공 연설/이웃 사람과의 대화/... under 대화, 신권/인명 under 어휘, 성경 under
      // 숫자, 예문/특강 under 문법) without touching this shared list, so filter here instead of
      // forking REVIEW_SCOPES per profile: a scope only appears if its own subtab button still
      // exists somewhere in the document (or it's the always-present "all").
      scopes = scopes.filter(function (s) {
        return s === "all" || !!document.querySelector('[data-' + key + '="' + s + '"]');
      });
      reviewScopeEl.dataset.scopeCategory = key;
      reviewScopeEl.innerHTML = scopes.map(function (scope) {
        var isSelected = (scope === selectedScope || (scope === "wt" && selectedScope && selectedScope.indexOf("wt:") === 0));
        return '<button type="button" class="subtab-btn" data-review-scope="' + escapeAttr(scope) +
          '" aria-selected="' + (isSelected ? "true" : "false") + '">' +
          escapeHtml(reviewScopeLabel(scope)) + '</button>';
      }).join("");
      reviewScopeEl.querySelectorAll("[data-review-scope]").forEach(function (btn) {
        btn.addEventListener("click", function () { selectCategory(key, btn.dataset.reviewScope); });
      });
      renderReviewSubscope(key, selectedScope);
    }

    // poolOverride (optional) lets a caller supply an already-built pool instead of the full
    // getPool(key) pool -- used by the "[학습 범위내 복습 게임]" vocab-focus-banner button so it
    // can show the "어휘" subtab as selected (key stays "vocab") while only testing the words in
    // the currently-scoped range, without touching/polluting getPool()'s poolCache for "vocab".
    function selectCategory(key, scope, poolOverride) {
      if (Array.isArray(scope)) { poolOverride = scope; scope = "all"; }
      scope = scope || "all";
      // Guards every entry point into this function (button clicks, the boot-time default,
      // window.__goToScopedVocabReview, and any "바로가기" deep-link), not just the visible
      // category row: a profile that doesn't have this category's button at all (e.g. GENERAL
      // has no "sentence" category) must never end up with that key as studyState.tabKey, since
      // callers other than a direct button click don't otherwise check whether the button exists.
      if (!document.querySelector('.subtab-btn[data-review="' + key + '"]')) {
        var sentenceBtn = document.querySelector('.subtab-btn[data-review="sentence"]');
        key = (sentenceBtn || reviewBtns[0]).dataset.review;
      }
      // Re-selecting the already-active category+scope used to still rebuild the pool, restart
      // the mode and speak a freshly-picked random item's prompt -- a no-visible-change action
      // that nonetheless raced a brand-new speechSynthesis call against whatever was already
      // playing. This matters most for the default-landing category: on every page load,
      // restoreLastPlace() below replays a click on the last-visited review category, which (if
      // it happens to be the same one this function's boot-time default call already selected)
      // used to immediately re-trigger a second, competing prompt read-aloud. poolOverride always
      // forces through, since a scoped-review launch needs a fresh pool even when key/scope match.
      if (!poolOverride && studyState.tabKey === key && studyState.scope === scope) return;
      var prevKey = studyState.tabKey;
      studyState.tabKey = key;
      studyState.scope = scope;
      studyState.pool = dedupeByVi((poolOverride || getPool(key, scope)).map(function (item) {
        return { vi: stripReviewListMarker(item.vi), kr: stripReviewListMarker(item.kr), meaning: item.meaning || "", songNo: item.songNo };
      }));
      studyState.score = { correct: 0, total: 0 };
      studyState.current = null;
      reviewBtns.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.review === key ? "true" : "false"); });
      renderReviewScopes(key, scope);
      // 문법·대화·문장 복습은 기본 학습 모드를 "어순 배열"로 시작하되, 같은 카테고리 내 범위 전환 시에는 현재 모드를 유지한다.
      var modeToKeep = (prevKey === key && studyState.mode) ? studyState.mode : ((key === "grammar" || key === "wizard" || key === "sentence") ? "order" : "flash");
      modeTabsEl.querySelectorAll(".study-mode-btn").forEach(function (b) { b.setAttribute("aria-selected", b.dataset.mode === modeToKeep ? "true" : "false"); });
      studyState.mode = modeToKeep;
      startMode();
    }

    function goToReview(key, poolOverride) {
      try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch (e) { /* no-op */ }
      activateTab("review", false);
      selectCategory(key, "all", poolOverride);
    }
    // Exposed so the vocab-focus banner (built in a different IIFE) can launch a review session
    // scoped to just its currently-visible range; see vocabFocusBannerHtml()/bindVocabFocusClear().
    window.__goToScopedVocabReview = function () {
      var key = (vocabFocus && vocabFocus.mode === "wt") ? "sentence" : "vocab";
      goToReview(key, vocabScopedPool());
    };

    reviewBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { selectCategory(btn.dataset.review, "all"); });
    });
    // Prefer "sentence" as the default category (unchanged JW/JEONJU behavior) when that button
    // exists; GENERAL removes it entirely (its [문장] tab is JW-only), so fall back to whichever
    // category button actually exists first in this profile's DOM, instead of a hardcoded
    // "sentence" that used to leave the review pane opening on an empty, unselected pool there.
    var defaultReviewBtn = document.querySelector('.subtab-btn[data-review="sentence"]') || reviewBtns[0];
    if (defaultReviewBtn) selectCategory(defaultReviewBtn.dataset.review, "all");
    modeTabsEl.querySelectorAll(".study-mode-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        // Re-clicking the already-active mode tab used to still restart the question (a fresh
        // random pick + a fresh prompt read-aloud) on top of whatever was already playing --
        // harmless-looking on screen, but it left the previous utterance's speak()/speakMeaning()
        // call racing against the new one, sometimes audible as two sentences overlapping.
        if (btn.dataset.mode === studyState.mode) return;
        modeTabsEl.querySelectorAll(".study-mode-btn").forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");
        var prevMode = studyState.mode;
        studyState.mode = btn.dataset.mode;
        if (prevMode === "mcq" && studyState.mode !== "mcq") {
          if (muteScope === "meaning" && lastNonMcqScope) {
            muteScope = lastNonMcqScope;
            saveMuteScopePref();
          }
        } else if (prevMode !== "mcq" && studyState.mode === "mcq") {
          if (muteScope && muteScope !== "meaning") {
            lastNonMcqScope = muteScope;
            muteScope = "meaning";
            saveMuteScopePref();
          }
        }
        studyState.current = null;
        renderAutoAdvanceControls();
        startMode();
      });
    });

    function startMode() {
      clearAutoAdvanceTimer();
      if (!studyState.pool.length) { bodyEl.innerHTML = '<div class="study-empty">' + TU("이 탭에는 아직 복습할 자료가 없어요.") + '</div>'; return; }
      if (studyState.mode === "flash") startFlash();
      else if (studyState.mode === "look") startLook();
      else if (studyState.mode === "mcq") startMcq();
      else if (studyState.mode === "order") startOrder();
      else startType();
    }

    /* ---------- flashcard ---------- */
    function startFlash() {
      studyState.deck = shuffle(studyState.pool);
      studyState.idx = 0;
      studyState.flashDir = studyState.flashDir || "vi-to-target";
      renderFlash();
    }
    function revealFlash() {
      var item = studyState.current;
      if (!item) return;
      var kr = document.getElementById("flash-kr");
      var hint = document.getElementById("flash-hint");
      if (kr) kr.style.display = "block";
      var isRev = studyState.flashDir === "target-to-vi";
      if (hint) hint.textContent = TU("눌러서 가리기");
      speakThenAdvance(isRev ? item.vi : item.kr, isRev, function () {
        var b = document.getElementById("flash-next"); if (b) b.click();
      });
    }
    function renderFlash() {
      var item = studyState.deck[studyState.idx];
      studyState.current = item;
      var isRev = studyState.flashDir === "target-to-vi";
      var frontText = isRev ? item.kr : item.vi;
      var backText = isRev ? item.vi : item.kr;
      var frontClass = isRev ? "study-flash-vi" : "study-flash-vi vn";
      var backClass = isRev ? "study-flash-kr vn" : "study-flash-kr";
      var flagEmoji = currentLang === "ko" ? "🇰🇷" : currentLang === "zh" ? "🇹🇼" : currentLang === "ja" ? "🇯🇵" : "🇺🇸";
      var dirLabel = isRev ? (flagEmoji + " → 🇻🇳") : ("🇻🇳 → " + flagEmoji);

      var meaningHtml = item.meaning ? '<div class="study-flash-meaning"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning) + '</div>' : '';

      var html = '<div class="study-progress">' + (studyState.idx + 1) + ' / ' + studyState.deck.length + '</div>';
      html += '<div class="study-flash-card" id="flash-card">' +
        '<div class="' + frontClass + '">' + escapeHtml(frontText) + '</div>' +
        '<div class="' + backClass + '" id="flash-kr" style="display:none">' + escapeHtml(backText) + meaningHtml + '</div>' +
        '<div class="study-flash-hint" id="flash-hint">' + (isRev ? TU("눌러서 베트남어 보기") : TU("눌러서 뜻 보기")) + '</div></div>';
      html += '<div class="study-flash-nav">' +
        '<button class="study-nav-btn" id="flash-prev" aria-label="' + TU("이전 카드") + '">' + chevronIcon("left") + '</button>' +
        '<button class="speak-btn" id="flash-replay" aria-label="' + TU("다시 듣기") + '">' + speakIcon() + '</button>' +
        '<button class="study-nav-btn wide" id="flash-shuffle">' + shuffleGlyphIcon() + ' ' + TU("섞기") + '</button>' +
        '<button class="study-nav-btn dir-toggle" id="flash-dir-toggle" title="' + TU("방향 전환") + '">' + dirLabel + '</button>' +
        '<button class="study-nav-btn" id="flash-next" aria-label="' + TU("다음 카드") + '">' + chevronIcon("right") + '</button></div>';
      bodyEl.innerHTML = html;
      document.getElementById("flash-card").addEventListener("click", function () {
        var kr = document.getElementById("flash-kr");
        var hint = document.getElementById("flash-hint");
        var showing = kr.style.display !== "none";
        kr.style.display = showing ? "none" : "block";
        hint.textContent = showing ? (isRev ? TU("눌러서 베트남어 보기") : TU("눌러서 뜻 보기")) : TU("눌러서 가리기");
        if (!showing) {
          if (isRev) {
            if (!isMuted("vi")) speak(item.vi);
          } else {
            if (!isMuted("meaning")) speakMeaning(item.kr);
          }
        }
      });
      document.getElementById("flash-dir-toggle").addEventListener("click", function (e) {
        e.stopPropagation();
        studyState.flashDir = (studyState.flashDir === "target-to-vi") ? "vi-to-target" : "target-to-vi";
        renderFlash();
      });
      document.getElementById("flash-prev").addEventListener("click", function (e) {
        e.stopPropagation();
        studyState.idx = (studyState.idx - 1 + studyState.deck.length) % studyState.deck.length;
        renderFlash();
      });
      document.getElementById("flash-next").addEventListener("click", function (e) {
        e.stopPropagation();
        studyState.idx = (studyState.idx + 1) % studyState.deck.length;
        renderFlash();
      });
      document.getElementById("flash-replay").addEventListener("click", function (e) {
        e.stopPropagation();
        if (isRev) {
          var krEl = document.getElementById("flash-kr");
          if (krEl && krEl.style.display !== "none") speak(item.vi);
          else speakMeaning(item.kr);
        } else {
          speak(item.vi);
        }
      });
      document.getElementById("flash-shuffle").addEventListener("click", function (e) { e.stopPropagation(); startFlash(); });
      if (isRev) {
        speakPromptThenArm(item.kr, revealFlash);
      } else {
        speakItemThenArm(item.vi, revealFlash);
      }
    }

    /* ---------- listening 4-choice quiz ---------- */
    function startMcq() {
      studyState.score = { correct: 0, total: 0 };
      nextMcq();
    }
    function pickRandomDistinctFromCurrent(pool) {
      var item = pool[Math.floor(Math.random() * pool.length)];
      if (studyState.current && pool.length > 1) {
        var tries = 0;
        while (item.vi === studyState.current.vi && tries < 10) {
          item = pool[Math.floor(Math.random() * pool.length)];
          tries++;
        }
      }
      return item;
    }
    function nextMcq() {
      clearAutoAdvanceTimer();
      var pool = studyState.pool;
      var item = pickRandomDistinctFromCurrent(pool);
      studyState.current = item;
      var distractorPool = pool.filter(function (p) { return p.kr !== item.kr; });
      var distractors = shuffle(distractorPool).slice(0, 3).map(function (p) { return p.kr; });
      var choices = shuffle([item.kr].concat(distractors));
      renderMcq(choices);
    }
    function renderMcq(choices) {
      var item = studyState.current;
      var html = '<div class="study-score">' + studyState.score.correct + ' / ' + studyState.score.total + ' ' + TU("맞음") + '</div>';
      html += '<div class="study-mcq-q"><div class="study-mcq-btn-row"><button class="speak-btn" id="mcq-replay" aria-label="' + TU("다시 듣기") + '">' + speakIcon() + '</button>' +
        '<button class="study-mcq-skip" id="mcq-skip" aria-label="' + TU("다음 문제") + '">' + chevronIcon("right") + '</button></div>' +
        '<div class="study-mcq-note">' + TU("듣고 알맞은 뜻을 고르세요") + '</div></div>';
      html += '<div class="study-mcq-choices" id="mcq-choices">';
      choices.forEach(function (c) {
        html += '<button class="study-mcq-choice" data-kr="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>';
      });
      html += '</div>';
      bodyEl.innerHTML = html;
      document.getElementById("mcq-replay").addEventListener("click", function () { speak(item.vi); });
      document.getElementById("mcq-skip").addEventListener("click", nextMcq);
      document.querySelectorAll("#mcq-choices .study-mcq-choice").forEach(function (btn) {
        btn.addEventListener("click", function () { answerMcq(btn); });
      });
      speakItemThenArm(item.vi, revealMcq);
    }
    // Cold reveal -- the learner never answered before the timer ran out. Marks only the correct
    // choice (nothing was "wrong" since nothing was picked), doesn't touch the score, then reads
    // the answer (in the current UI language) and moves on.
    function revealMcq() {
      var item = studyState.current;
      if (!item) return;
      document.querySelectorAll("#mcq-choices .study-mcq-choice").forEach(function (b) {
        b.disabled = true;
        if (b.dataset.kr === item.kr) b.setAttribute("data-state", "correct");
      });
      var extra = document.createElement("div");
      extra.className = "study-mcq-reveal vn";
      extra.textContent = item.vi;
      if (item.meaning) {
        var mn = document.createElement("div");
        mn.className = "study-meaning-sub";
        mn.innerHTML = '<span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning);
        extra.appendChild(mn);
      }
      bodyEl.appendChild(extra);
      speakThenAdvance(item.kr, false, nextMcq);
    }
    function answerMcq(btn) {
      clearAutoAdvanceTimer();
      var item = studyState.current;
      var isCorrect = btn.dataset.kr === item.kr;
      studyState.score.total++;
      if (isCorrect) studyState.score.correct++;
      document.querySelectorAll("#mcq-choices .study-mcq-choice").forEach(function (b) {
        b.disabled = true;
        if (b.dataset.kr === item.kr) b.setAttribute("data-state", "correct");
        else if (b === btn) b.setAttribute("data-state", "wrong");
      });
      var scoreEl = document.querySelector(".study-score");
      if (scoreEl) scoreEl.textContent = studyState.score.correct + ' / ' + studyState.score.total + ' ' + TU("맞음");
      var extra = document.createElement("div");
      extra.className = "study-mcq-reveal vn";
      extra.textContent = item.vi;
      if (item.meaning) {
        var mn = document.createElement("div");
        mn.className = "study-meaning-sub";
        mn.innerHTML = '<span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning);
        extra.appendChild(mn);
      }
      bodyEl.appendChild(extra);
      var actionRow = document.createElement("div");
      actionRow.className = "study-action-row";
      actionRow.innerHTML = '<button class="foot-btn primary" id="mcq-next">' + TU("다음 문제 →") + '</button>';
      bodyEl.appendChild(actionRow);
      document.getElementById("mcq-next").addEventListener("click", nextMcq);
      // The correct answer is always read aloud (in the current UI language) once the learner
      // answers, right or wrong -- when auto-advance is also active it chains straight into the
      // next question; otherwise it's just the spoken confirmation, and "다음 문제" stays manual.
      if (isCorrect && (autoAdvanceEnabled || autoNextOnCorrect)) speakThenAdvance(item.kr, false, nextMcq);
      else if (!isMuted("meaning")) speakMeaning(item.kr);
    }

    /* ---------- reading 4-choice quiz (보기 4지선다) ---------- */
    // Same choose-the-meaning mechanic as the listening quiz above, just reading-first instead
    // of audio-first: the Vietnamese word is shown on screen right away (no hidden/audio-only
    // step), with pronunciation only a tap away on the speaker button for anyone who also wants
    // to hear it. Reuses pickRandomDistinctFromCurrent()/the .study-mcq-* choice styling from
    // the listening quiz, and armAutoReveal()/speakThenAdvance() the same way.
    function startLook() {
      studyState.score = { correct: 0, total: 0 };
      nextLook();
    }
    function nextLook() {
      clearAutoAdvanceTimer();
      var pool = studyState.pool;
      var item = pickRandomDistinctFromCurrent(pool);
      studyState.current = item;
      var distractorPool = pool.filter(function (p) { return p.kr !== item.kr; });
      var distractors = shuffle(distractorPool).slice(0, 3).map(function (p) { return p.kr; });
      var choices = shuffle([item.kr].concat(distractors));
      renderLook(choices);
    }
    function renderLook(choices) {
      var item = studyState.current;
      var html = '<div class="study-score">' + studyState.score.correct + ' / ' + studyState.score.total + ' ' + TU("맞음") + '</div>';
      html += '<div class="study-mcq-q"><div class="study-look-word vn">' + escapeHtml(item.vi) + '</div>' +
        '<div class="study-mcq-btn-row"><button class="speak-btn" id="look-speak" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + '</button>' +
        '<button class="study-mcq-skip" id="look-skip" aria-label="' + TU("다음 문제") + '">' + chevronIcon("right") + '</button></div>' +
        '<div class="study-mcq-note">' + TU("보고 알맞은 뜻을 고르세요") + '</div></div>';
      html += '<div class="study-mcq-choices" id="look-choices">';
      choices.forEach(function (c) {
        html += '<button class="study-mcq-choice" data-kr="' + escapeAttr(c) + '">' + escapeHtml(c) + '</button>';
      });
      html += '</div>';
      bodyEl.innerHTML = html;
      // Unlike the listening quiz, this mode shows the word right away rather than gating on
      // audio -- but it still reads the Vietnamese word aloud automatically as soon as it appears.
      document.getElementById("look-speak").addEventListener("click", function () { speak(item.vi); });
      document.getElementById("look-skip").addEventListener("click", nextLook);
      document.querySelectorAll("#look-choices .study-mcq-choice").forEach(function (btn) {
        btn.addEventListener("click", function () { answerLook(btn); });
      });
      speakItemThenArm(item.vi, revealLook);
    }
    // Cold reveal, same shape as revealMcq() above: only the correct choice gets marked, the
    // score is left untouched, then the answer is spoken (in the current UI language) and the
    // learner moves on -- fires once the full autoAdvanceSeconds have passed with no answer.
    function revealLook() {
      var item = studyState.current;
      if (!item) return;
      document.querySelectorAll("#look-choices .study-mcq-choice").forEach(function (b) {
        b.disabled = true;
        if (b.dataset.kr === item.kr) b.setAttribute("data-state", "correct");
      });
      if (item.meaning) {
        var mn = document.createElement("div");
        mn.className = "study-meaning-sub";
        mn.innerHTML = '<span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning);
        bodyEl.appendChild(mn);
      }
      speakThenAdvance(item.kr, false, nextLook);
    }
    function answerLook(btn) {
      clearAutoAdvanceTimer();
      var item = studyState.current;
      var isCorrect = btn.dataset.kr === item.kr;
      studyState.score.total++;
      if (isCorrect) studyState.score.correct++;
      document.querySelectorAll("#look-choices .study-mcq-choice").forEach(function (b) {
        b.disabled = true;
        if (b.dataset.kr === item.kr) b.setAttribute("data-state", "correct");
        else if (b === btn) b.setAttribute("data-state", "wrong");
      });
      var scoreEl = document.querySelector(".study-score");
      if (scoreEl) scoreEl.textContent = studyState.score.correct + ' / ' + studyState.score.total + ' ' + TU("맞음");
      if (item.meaning) {
        var mn = document.createElement("div");
        mn.className = "study-meaning-sub";
        mn.innerHTML = '<span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning);
        bodyEl.appendChild(mn);
      }
      var actionRow = document.createElement("div");
      actionRow.className = "study-action-row";
      actionRow.innerHTML = '<button class="foot-btn primary" id="look-next">' + TU("다음 문제 →") + '</button>';
      bodyEl.appendChild(actionRow);
      document.getElementById("look-next").addEventListener("click", nextLook);
      // Always read the correct answer aloud once the learner answers -- see the matching
      // comment in answerMcq() above.
      if (isCorrect && (autoAdvanceEnabled || autoNextOnCorrect)) speakThenAdvance(item.kr, false, nextLook);
      else if (!isMuted("meaning")) speakMeaning(item.kr);
    }

    /* ---------- word-order arrangement ---------- */
    function startOrder() { nextOrder(); }
    function nextOrder() {
      clearAutoAdvanceTimer();
      var candidates = studyState.pool.filter(function (p) { return tokenize(p.vi).length >= 2; });
      var pool = candidates.length ? candidates : studyState.pool;
      var item = pickRandomDistinctFromCurrent(pool);
      studyState.current = item;
      studyState.orderTokens = tokenize(item.vi);
      studyState.orderBank = shuffle(studyState.orderTokens.map(function (t, i) { return { t: t, key: i }; }));
      if (studyState.orderBank.length > 1) {
        var same = studyState.orderBank.every(function (x, i) { return x.t === studyState.orderTokens[i]; });
        if (same) { var tmp = studyState.orderBank[0]; studyState.orderBank[0] = studyState.orderBank[1]; studyState.orderBank[1] = tmp; }
      }
      studyState.orderPlaced = [];
      studyState.selectedPlacedIndex = null;
      renderOrder();
    }
    function renderOrder() {
      var item = studyState.current;
      var meaningSub = item.meaning ? '<div class="study-meaning-sub"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning) + '</div>' : '';
      var html = '<div class="study-order-prompt">' + escapeHtml(item.kr) + meaningSub + '</div>';
      html += '<div class="study-order-answer" id="order-answer"></div>';
      html += '<div class="study-order-bank" id="order-bank"></div>';
      html += '<div id="order-feedback"></div>';
      html += '<div class="study-action-row"><button class="foot-btn" id="order-reset">' + TU("다시 담기") + '</button><button class="foot-btn primary" id="order-skip">' + TU("다음 문제 →") + '</button></div>';
      bodyEl.innerHTML = html;
      renderOrderChips();
      document.getElementById("order-reset").addEventListener("click", function () {
        studyState.orderPlaced = [];
        studyState.selectedPlacedIndex = null;
        document.getElementById("order-feedback").innerHTML = "";
        renderOrderChips();
      });
      document.getElementById("order-skip").addEventListener("click", nextOrder);
      speakPromptThenArm(item.kr, revealOrder);
    }
    // Cold reveal -- the learner hasn't finished (or hasn't gotten right) the arrangement by the
    // time the interval nearly runs out. Shows the correct Vietnamese order in the feedback area
    // (leaving whatever chips they'd placed as-is) and reads it in Vietnamese before moving on.
    function revealOrder() {
      var item = studyState.current;
      if (!item) return;
      var fb = document.getElementById("order-feedback");
      var meaningNote = item.meaning ? '<div class="study-meaning-sub"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning) + '</div>' : '';
      if (fb) fb.innerHTML = '<div class="study-order-correct-answer">' + TU("정답: ") + escapeHtml(item.vi) + '</div>' + meaningNote;
      speakThenAdvance(item.vi, true, nextOrder);
    }
    function renderOrderChips() {
      var bankEl = document.getElementById("order-bank");
      var ansEl = document.getElementById("order-answer");
      if (!bankEl || !ansEl) return;
      var placedKeys = studyState.orderPlaced.map(function (p) { return p.key; });
      bankEl.innerHTML = "";
      studyState.orderBank.forEach(function (tok) {
        if (placedKeys.indexOf(tok.key) >= 0) return;
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "study-chip vn";
        chip.textContent = tok.t;
        chip.setAttribute("aria-label", tok.t + " (" + TU("선택하여 문장에 배치") + ")");
        chip.addEventListener("click", function () {
          studyState.orderPlaced.push(tok);
          studyState.selectedPlacedIndex = null;
          renderOrderChips();
          if (studyState.orderPlaced.length === studyState.orderTokens.length) checkOrder();
        });
        bankEl.appendChild(chip);
      });

      ansEl.innerHTML = "";
      studyState.orderPlaced.forEach(function (tok, idx) {
        var chip = document.createElement("button");
        chip.type = "button";
        var isSelected = (studyState.selectedPlacedIndex === idx);
        chip.className = "study-chip placed vn" + (isSelected ? " selected" : "");
        chip.textContent = tok.t;
        chip.setAttribute("data-index", String(idx));
        chip.setAttribute("aria-pressed", isSelected ? "true" : "false");
        chip.setAttribute("aria-label", tok.t + (isSelected ? " (" + TU("선택됨. 다른 단어를 눌러 위치 교환") + ")" : ""));
        chip.setAttribute("draggable", "true");

        // 1. TAP/CLICK TO SWAP
        chip.addEventListener("click", function (e) {
          e.preventDefault();
          var selIdx = studyState.selectedPlacedIndex;
          if (selIdx === null || selIdx === undefined) {
            // First tap: select word
            studyState.selectedPlacedIndex = idx;
            renderOrderChips();
          } else if (selIdx === idx) {
            // Tapping selected word again cancels selection
            studyState.selectedPlacedIndex = null;
            renderOrderChips();
          } else {
            // Tapping another word swaps the two positions
            var tmp = studyState.orderPlaced[selIdx];
            studyState.orderPlaced[selIdx] = studyState.orderPlaced[idx];
            studyState.orderPlaced[idx] = tmp;
            studyState.selectedPlacedIndex = null;
            var fb = document.getElementById("order-feedback");
            if (fb) fb.innerHTML = "";
            renderOrderChips();
            if (studyState.orderPlaced.length === studyState.orderTokens.length) {
              checkOrder();
            }
          }
        });

        // 2. ACCESSIBILITY: Keyboard Enter/Space
        chip.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            chip.click();
          }
        });

        // 3. DESKTOP HTML5 DRAG & DROP
        chip.addEventListener("dragstart", function (e) {
          studyState.selectedPlacedIndex = null;
          e.dataTransfer.setData("text/plain", String(idx));
          e.dataTransfer.effectAllowed = "move";
          chip.classList.add("dragging");
        });

        chip.addEventListener("dragend", function () {
          chip.classList.remove("dragging");
          document.querySelectorAll(".study-chip.placed").forEach(function (c) {
            c.classList.remove("drop-target-before", "drop-target-after");
          });
        });

        chip.addEventListener("dragover", function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          var rect = chip.getBoundingClientRect();
          var midX = rect.left + rect.width / 2;
          chip.classList.remove("drop-target-before", "drop-target-after");
          if (e.clientX < midX) {
            chip.classList.add("drop-target-before");
          } else {
            chip.classList.add("drop-target-after");
          }
        });

        chip.addEventListener("dragleave", function () {
          chip.classList.remove("drop-target-before", "drop-target-after");
        });

        chip.addEventListener("drop", function (e) {
          e.preventDefault();
          var fromIdx = parseInt(e.dataTransfer.getData("text/plain"), 10);
          if (isNaN(fromIdx) || fromIdx === idx) return;
          var rect = chip.getBoundingClientRect();
          var midX = rect.left + rect.width / 2;
          var insertBefore = (e.clientX < midX);

          // Move item to target position (not merely swap)
          var movedItem = studyState.orderPlaced.splice(fromIdx, 1)[0];
          var destIdx = idx;
          if (fromIdx < destIdx) {
            destIdx = insertBefore ? destIdx - 1 : destIdx;
          } else {
            destIdx = insertBefore ? destIdx : destIdx + 1;
          }
          studyState.orderPlaced.splice(destIdx, 0, movedItem);
          studyState.selectedPlacedIndex = null;
          var fb = document.getElementById("order-feedback");
          if (fb) fb.innerHTML = "";
          renderOrderChips();
          if (studyState.orderPlaced.length === studyState.orderTokens.length) {
            checkOrder();
          }
        });

        // 4. TOUCH / MOBILE POINTER DRAG & DROP
        var touchStartX = 0;
        var touchStartY = 0;
        var isDraggingTouch = false;
        var ghostEl = null;

        chip.addEventListener("pointerdown", function (e) {
          if (e.pointerType === "mouse") return;
          touchStartX = e.clientX;
          touchStartY = e.clientY;
          isDraggingTouch = false;

          function onPointerMove(moveEvent) {
            var dx = moveEvent.clientX - touchStartX;
            var dy = moveEvent.clientY - touchStartY;
            if (!isDraggingTouch) {
              if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
                isDraggingTouch = true;
                chip.classList.add("dragging");
                ghostEl = chip.cloneNode(true);
                ghostEl.className = "study-chip placed vn";
                ghostEl.style.position = "fixed";
                ghostEl.style.zIndex = "9999";
                ghostEl.style.pointerEvents = "none";
                ghostEl.style.opacity = "0.85";
                ghostEl.style.transform = "scale(1.05)";
                ghostEl.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
                document.body.appendChild(ghostEl);
                try { chip.setPointerCapture(moveEvent.pointerId); } catch (err) {}
              }
            }
            if (isDraggingTouch && ghostEl) {
              moveEvent.preventDefault();
              ghostEl.style.left = (moveEvent.clientX - 25) + "px";
              ghostEl.style.top = (moveEvent.clientY - 20) + "px";

              var elBelow = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
              var targetChip = elBelow ? elBelow.closest(".study-chip.placed:not([style*='position: fixed'])") : null;
              document.querySelectorAll(".study-chip.placed").forEach(function (c) {
                c.classList.remove("drop-target-before", "drop-target-after");
              });
              if (targetChip && targetChip !== chip) {
                var tRect = targetChip.getBoundingClientRect();
                if (moveEvent.clientX < tRect.left + tRect.width / 2) {
                  targetChip.classList.add("drop-target-before");
                } else {
                  targetChip.classList.add("drop-target-after");
                }
              }
            }
          }

          function onPointerUp(upEvent) {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointercancel", onPointerUp);
            if (ghostEl && ghostEl.parentNode) {
              ghostEl.parentNode.removeChild(ghostEl);
              ghostEl = null;
            }
            chip.classList.remove("dragging");
            if (isDraggingTouch) {
              upEvent.preventDefault();
              var elBelow = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
              var targetChip = elBelow ? elBelow.closest(".study-chip.placed:not([style*='position: fixed'])") : null;
              document.querySelectorAll(".study-chip.placed").forEach(function (c) {
                c.classList.remove("drop-target-before", "drop-target-after");
              });
              if (targetChip && targetChip !== chip) {
                var targetIdx = parseInt(targetChip.getAttribute("data-index"), 10);
                if (!isNaN(targetIdx)) {
                  var tRect = targetChip.getBoundingClientRect();
                  var insertBefore = (upEvent.clientX < tRect.left + tRect.width / 2);
                  var movedItem = studyState.orderPlaced.splice(idx, 1)[0];
                  var destIdx = targetIdx;
                  if (idx < destIdx) {
                    destIdx = insertBefore ? destIdx - 1 : destIdx;
                  } else {
                    destIdx = insertBefore ? destIdx : destIdx + 1;
                  }
                  studyState.orderPlaced.splice(destIdx, 0, movedItem);
                  studyState.selectedPlacedIndex = null;
                  var fb = document.getElementById("order-feedback");
                  if (fb) fb.innerHTML = "";
                  renderOrderChips();
                  if (studyState.orderPlaced.length === studyState.orderTokens.length) {
                    checkOrder();
                  }
                }
              }
            }
          }

          window.addEventListener("pointermove", onPointerMove);
          window.addEventListener("pointerup", onPointerUp);
          window.addEventListener("pointercancel", onPointerUp);
        });

        ansEl.appendChild(chip);
      });
    }
    function checkOrder() {
      var item = studyState.current;
      var userSeq = studyState.orderPlaced.map(function (p) { return p.t; });
      var correct = userSeq.join(" ") === studyState.orderTokens.join(" ");
      var fb = document.getElementById("order-feedback");
      var meaningNote = item.meaning ? '<div class="study-meaning-sub"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning) + '</div>' : '';
      if (correct) {
        fb.innerHTML = '<div class="study-order-feedback ok">' + TU("정답이에요! 🎉") + '</div>' + meaningNote;
        // A correct arrangement always ends the wait early: cancel the cold reveal timer and
        // speak+advance right away instead of leaving the learner staring at a solved card for
        // the rest of the interval.
        clearAutoAdvanceTimer();
        if (autoAdvanceEnabled || autoNextOnCorrect) speakThenAdvance(item.vi, true, nextOrder);
        else if (!isMuted("vi")) speak(item.vi);
      } else {
        fb.innerHTML = '<div class="study-order-feedback no">' + TU("순서가 달라요. 다시 시도해 보세요.") + '</div>' +
          '<div class="study-order-correct-answer">' + TU("정답: ") + escapeHtml(item.vi) + '</div>' + meaningNote;
        // Wrong: leave the chips in place so the person can fix it (via "다시 담기" or by picking
        // chips back off) -- the cold auto-advance timer armed at render time is left running, so
        // an unresolved attempt still reveals the answer and moves on near the end of the interval
        // rather than stalling forever.
        if (!isMuted("vi")) speak(item.vi);
      }
    }

    /* ---------- typing / dictation ---------- */
    function startType() { nextType(); }
    function nextType() {
      clearAutoAdvanceTimer();
      var item = pickRandomDistinctFromCurrent(studyState.pool);
      studyState.current = item;
      renderType();
    }
    function renderType() {
      var item = studyState.current;
      var html = '<div class="study-type-prompt">' + escapeHtml(item.kr) +
        '<button class="speak-btn" id="type-replay" aria-label="' + TU("다시 듣기") + '">' + speakIcon() + '</button></div>';
      html += '<input type="text" class="study-type-input vn" id="type-input" placeholder="' + TU("베트남어로 입력하세요") + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">';
      html += '<div id="type-feedback"></div>';
      html += '<div class="study-action-row"><button class="foot-btn primary" id="type-submit">' + TU("확인") + '</button><button class="foot-btn" id="type-next">' + TU("다음 문제 →") + '</button></div>';
      bodyEl.innerHTML = html;
      document.getElementById("type-replay").addEventListener("click", function () { speak(item.vi); });
      var input = document.getElementById("type-input");
      input.focus();
      var answered = false;
      function submit() {
        clearAutoAdvanceTimer();
        var val = input.value.trim().replace(/\s+/g, " ");
        var target = item.vi.trim().replace(/\s+/g, " ");
        var correct = val.length > 0 && val.toLowerCase() === target.toLowerCase();
        input.classList.remove("correct", "wrong");
        input.classList.add(correct ? "correct" : "wrong");
        var fb = document.getElementById("type-feedback");
        var meaningNote = item.meaning ? '<div class="study-meaning-sub"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning) + '</div>' : '';
        fb.innerHTML = (correct
          ? '<div class="study-type-feedback ok">' + TU("정답이에요! 🎉") + '</div>'
          : '<div class="study-type-feedback no">' + TU("다시 확인해 보세요.") + '</div><div class="study-type-answer vn">' + TU("정답: ") + escapeHtml(item.vi) + '</div>') + meaningNote;
        answered = true;
        if (correct && (autoAdvanceEnabled || autoNextOnCorrect)) speakThenAdvance(item.vi, true, nextType);
        else if (!isMuted("vi")) speak(item.vi);
      }
      document.getElementById("type-submit").addEventListener("click", submit);
      // First Enter checks the answer; once it's been checked, a second Enter (focus still
      // in the input) moves straight to the next question -- same as pressing "다음 문제".
      input.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        if (answered) nextType(); else submit();
      });
      document.getElementById("type-next").addEventListener("click", nextType);
      speakItemThenArm(item.vi, revealType);
    }
    // Cold reveal -- nothing was submitted before the interval nearly ran out. Fills the answer
    // in (marked wrong, since the learner didn't actually answer it), shows the correct Vietnamese
    // text, reads it once more, and moves on.
    function revealType() {
      var item = studyState.current;
      if (!item) return;
      var input = document.getElementById("type-input");
      var fb = document.getElementById("type-feedback");
      if (input) { input.classList.remove("correct"); input.classList.add("wrong"); input.disabled = true; }
      var meaningNote = item.meaning ? '<div class="study-meaning-sub"><span class="lyric-meaning-badge">' + TU("의미") + '</span> ' + escapeHtml(item.meaning) + '</div>' : '';
      if (fb) fb.innerHTML = '<div class="study-type-answer vn">' + TU("정답: ") + escapeHtml(item.vi) + '</div>' + meaningNote;
      speakThenAdvance(item.vi, true, nextType);
    }
  })();

  /* ================= SENTENCE BUILDER (문장 생성기) ================= */
  (function () {
    var formEl = document.getElementById("sb-form");
    if (!formEl) return;
    var resultEl = document.getElementById("sb-result");

    /* ---- Hangul syllable composition (standard Unicode algorithm) ---- */
    var JONG = 0, NIEUN = 4, RIEUL = 8, BIEUP = 17;
    function decomposeHangul(ch) {
      var code = ch.charCodeAt(0) - 0xAC00;
      if (code < 0 || code > 11171) return null;
      return { cho: Math.floor(code / 588), jung: Math.floor((code % 588) / 28), jong: code % 28 };
    }
    function composeHangul(cho, jung, jong) {
      return String.fromCharCode(0xAC00 + (cho * 21 + jung) * 28 + jong);
    }
    function hasBatchimStr(str) {
      var last = str.charAt(str.length - 1);
      var d = decomposeHangul(last);
      return !!(d && d.jong !== 0);
    }
    function addBatchimToLast(str, jongIndex) {
      var chars = str.split("");
      var last = chars[chars.length - 1];
      var d = decomposeHangul(last);
      if (!d || d.jong !== 0) return str;
      chars[chars.length - 1] = composeHangul(d.cho, d.jung, jongIndex);
      return chars.join("");
    }
    function vowelIsAorO(str) {
      var last = str.charAt(str.length - 1);
      var d = decomposeHangul(last);
      if (!d) return false;
      return d.jung === 0 || d.jung === 8; // ㅏ=0, ㅗ=8
    }
    // Regular 아/어 vowel-harmony past tense (stem+았/었) is wrong for the extremely common
    // "-하다" verb/adjective family (공부하다, 요리하다, 조용하다 ...): Korean's "여" irregular
    // conjugation contracts "하" + "였" down to "했", not the regular "하았". Since custom
    // verbs/adjectives typed in by a user are very likely to end in "하다", this is special-cased
    // rather than left to the regular harmony rule.
    function derivePast(stem) {
      if (stem.charAt(stem.length - 1) === "하") return stem.slice(0, -1) + "했";
      return stem + (vowelIsAorO(stem) ? "았" : "었");
    }
    function topicParticle(word) { return hasBatchimStr(word) ? "은" : "는"; }
    function objectParticle(word) { return hasBatchimStr(word) ? "을" : "를"; }
    // Adjective-as-predicate sentences ("날씨가 춥다") read more naturally with the SUBJECT
    // particle (이/가) than the topic particle (은/는) used everywhere else in this engine.
    function subjectParticle(word) { return hasBatchimStr(word) ? "이" : "가"; }

    /* ---- Korean predicate conjugation (formal register: -습니다/-ㅂ니다 family) ---- */
    function buildCompoundStem(verbItem, auxItem) {
      var stem = verbItem.stem;
      if (!auxItem) return stem;
      // For the -(으)ㄹ 수 있/없/것이/필요가 있 family, a ㅂ/ㄷ-irregular stem (e.g. 춥다 -> 추우,
      // 돕다 -> 도우) needs its irregular vowel-suffix form instead of the plain dictionary stem;
      // batchim attachment after that irregular form is otherwise fully regular.
      var rStem = verbItem.rieul || stem;
      switch (auxItem.type) {
        case "want": return stem + "고 싶";
        case "must": return stem + (vowelIsAorO(stem) ? "아야 하" : "어야 하");
        case "can": return (hasBatchimStr(rStem) ? rStem + "을" : addBatchimToLast(rStem, RIEUL)) + " 수 있";
        case "cannot": return (hasBatchimStr(rStem) ? rStem + "을" : addBatchimToLast(rStem, RIEUL)) + " 수 없";
        case "should": return stem + "는 게 좋";
        case "will": return (hasBatchimStr(rStem) ? rStem + "을" : addBatchimToLast(rStem, RIEUL)) + " 것이";
        case "past": return verbItem.past;
        case "ing": return stem + "고 있";
        case "need": return (hasBatchimStr(rStem) ? rStem + "을" : addBatchimToLast(rStem, RIEUL)) + " 필요가 있";
        case "like": return stem + "는 것을 좋아하";
        case "hay": return stem; // "hãy" is a Vietnamese pre-verb command particle with no Korean stem-suffix
        // counterpart -- its meaning is expressed by forcing the imperative ending instead (see applyEnding call site).
        default: return stem;
      }
    }
    function applyEnding(stem, kind) {
      var hb = hasBatchimStr(stem);
      if (kind === "negative") return stem + "지 않습니다";
      if (kind === "statement" || kind === "yesno") {
        var base = hb ? stem + "습니다" : addBatchimToLast(stem, BIEUP) + "니다";
        var q = hb ? stem + "습니까" : addBatchimToLast(stem, BIEUP) + "니까";
        return kind === "yesno" ? q : base;
      }
      if (kind === "imperative") return hb ? stem + "으십시오" : stem + "십시오";
      if (kind === "propositive") return hb ? stem + "읍시다" : addBatchimToLast(stem, BIEUP) + "시다";
      return stem + "습니다";
    }
    function capitalizeFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    // "ở"(있다) supplies its own locative meaning, "đi"(가다) needs "đến"(~로) added before a
    // destination, "đến"(오다)/"về"(돌아가다) already mean "arrive at / return to" so the place
    // noun follows them bare, and every other verb describes an action happening AT a place, so
    // it takes "ở" + 에서. The wh-word "어디(đâu)" is just another place noun, so it goes through
    // the very same function.
    function placeWithVerb(item, verbItem) {
      if (!item) return null;
      var verbVi = verbItem ? verbItem.vi : null;
      if (verbVi === "ở") return { vi: item.vi, kr: T(item.kr) + "에" };
      if (verbVi === "đi") return { vi: "đến " + item.vi, kr: T(item.kr) + "에" };
      if (verbVi === "đến" || verbVi === "về") return { vi: item.vi, kr: T(item.kr) + "에" };
      return { vi: "ở " + item.vi, kr: T(item.kr) + "에서" };
    }

    /* ---- word banks / form ---- */
    function optHtml(items, prefix, selectedIdx) {
      return items.map(function (it, i) {
        return '<option value="' + prefix + i + '"' + (i === selectedIdx ? " selected" : "") + '>' + escapeHtml(it.vi) + " (" + escapeHtml(T(it.kr)) + ")</option>";
      }).join("");
    }
    // "직접 입력" custom-word option -- re-built through TU() on every render so its label
    // tracks the active UI language.
    function customOpt() { return '<option value="custom">✏️ ' + escapeHtml(TU("직접 입력")) + '</option>'; }

    function fieldHtml(id, label, inner, opts) {
      opts = opts || {};
      return '<div class="sb-field' + (opts.hidden ? " sb-hidden" : "") + '" id="sb-field-' + id + '"><label for="sb-' + id + '">' +
        escapeHtml(label) + '</label><select id="sb-' + id + '">' + inner + "</select>" +
        (opts.customRow || "") + (opts.hint ? '<div class="sb-custom-hint">' + escapeHtml(opts.hint) + "</div>" : "") + "</div>";
    }
    // A "simple" custom row: just a word + its meaning in the current UI language -- covers
    // every category whose word-bank items are plain {vi, kr} pairs (connective / object / noun
    // complement / preposition / manner / place / time, and the subject banks). viPh/krPh are the
    // Korean-source placeholder strings and are run through TU() so the placeholder itself tracks
    // the active UI language.
    function simpleCustomRow(id, viPh, krPh) {
      return '<div class="sb-custom-row" id="sb-custom-' + id + '">' +
        '<input type="text" class="vi" id="sb-' + id + '-custom-vi" placeholder="' + escapeAttr(TU(viPh)) + '">' +
        '<input type="text" id="sb-' + id + '-custom-kr" placeholder="' + escapeAttr(TU(krPh)) + '"></div>';
    }
    function toggleCustomRow(selectEl, wrapEl) {
      function refresh() { wrapEl.classList.toggle("sb-custom-active", selectEl.value === "custom"); }
      selectEl.addEventListener("change", refresh);
      refresh();
    }

    function byId(id) { return document.getElementById(id); }

    // Custom verb/adjective/aux input only ever collects a KOREAN dictionary-form word (needed
    // to mechanically derive stems/endings), so it can only feed the Korean engine's conjugation.
    // In zh/en/ja mode a custom entry is still accepted (kept simple, no per-language re-design
    // of this input), but the language-specific assemble* functions fall back to showing it
    // un-conjugated -- the hint below tells the learner that up front.
    var SB_CUSTOM_CONJ_HINT = "직접 입력한 동사·형용사·보조동사는 활용이 적용되지 않고, 입력한 뜻 그대로 문장에 표시돼요.";

    var whFieldEl, stypeEl, verbEl, objectFieldEl, nounFieldEl, WH_TYPE_IDX;

    // Builds (or, on a language switch, rebuilds) the entire form -- every option label and
    // hint is re-derived from the active UI language via T()/TU(), so switching languages
    // re-translates the whole form in place. Element references and every listener that's
    // bound to a specific field element have to be re-acquired/re-wired each time since
    // formEl.innerHTML replaces all of the form's DOM nodes.
    function renderSbForm() {
      var noneOpt = '<option value="">' + escapeHtml(TU("사용 안 함")) + '</option>';
      var html = "";
      html += fieldHtml("stype", TU("문장 종류"), SB_SENTENCE_TYPES.map(function (t, i) {
        return '<option value="' + i + '"' + (i === 0 ? " selected" : "") + ">" + escapeHtml(T(t.label)) + "</option>";
      }).join(""));
      html += fieldHtml("wh", TU("의문사 선택"), SB_WH_WORDS.map(function (t, i) {
        return '<option value="' + i + '">' + escapeHtml(T(t.kr)) + " (" + escapeHtml(t.vi) + ")</option>";
      }).join(""), { hidden: true });
      html += fieldHtml("connective", TU("접속어 (문장 앞에 붙는 연결어)"), noneOpt + optHtml(SB_CONNECTIVES, "") + customOpt(),
        { customRow: simpleCustomRow("connective", "예: Sau khi", "예: 그 후에") });
      html += fieldHtml("subject", TU("주어 (의문사 'ai(누가)'를 쓸 때처럼 주어가 필요 없으면 '사용 안 함')"),
        noneOpt + '<optgroup label="' + escapeAttr(TU("대명사")) + '">' + optHtml(SB_PRONOUNS, "p", 0) + '</optgroup><optgroup label="' + escapeAttr(TU("명사")) + '">' + optHtml(SB_NOUN_SUBJECTS, "n") + "</optgroup>" + customOpt(),
        { customRow: simpleCustomRow("subject", "예: học viên mới", "예: 새 학습자") });
      html += fieldHtml("aux", TU("보조동사"), noneOpt + optHtml(SB_AUX_VERBS, "") + customOpt(),
        { customRow: '<div class="sb-custom-row" id="sb-custom-aux"><input type="text" class="vi" id="sb-aux-custom-vi" placeholder="' + escapeAttr(TU("예: định")) + '">' +
          '<input type="text" id="sb-aux-custom-kr" placeholder="' + escapeAttr(TU("예: ~할 예정이다")) + '">' +
          '<select id="sb-aux-custom-type">' +
          '<option value="want">' + escapeHtml(TU("뜻 패턴: ~하고 싶다")) + '</option><option value="must">' + escapeHtml(TU("~해야 하다")) + '</option><option value="can">' + escapeHtml(TU("~할 수 있다")) + '</option>' +
          '<option value="cannot">' + escapeHtml(TU("~할 수 없다")) + '</option><option value="should">' + escapeHtml(TU("~하는 게 좋다")) + '</option><option value="will">' + escapeHtml(TU("~할 것이다(미래)")) + '</option>' +
          '<option value="past">' + escapeHtml(TU("~했다(과거)")) + '</option><option value="ing">' + escapeHtml(TU("~하는 중이다")) + '</option><option value="need">' + escapeHtml(TU("~할 필요가 있다")) + '</option>' +
          '<option value="like">' + escapeHtml(TU("~하는 것을 좋아하다")) + '</option><option value="hay">' + escapeHtml(TU("~해라(명령)")) + '</option></select></div>',
          hint: currentLang === "ko" ? SB_CUSTOM_CONJ_HINT : TU(SB_CUSTOM_CONJ_HINT) });
      html += fieldHtml("verb", TU("동사 (베트남어는 형용사만으로도 문장이 완성돼요. 예: Trời lạnh. 날씨가 춥다.)"),
        '<option value="">' + escapeHtml(TU("사용 안 함 (형용사만으로 문장 완성)")) + '</option><optgroup label="' + escapeAttr(TU("자동사")) + '">' + optHtml(SB_INTRANS_VERBS, "i", 0) + '</optgroup><optgroup label="' + escapeAttr(TU("타동사")) + '">' + optHtml(SB_TRANS_VERBS, "t") + "</optgroup>" + customOpt(),
        { customRow: '<div class="sb-custom-row" id="sb-custom-verb"><input type="text" class="vi" id="sb-verb-custom-vi" placeholder="' + escapeAttr(TU("예: nấu")) + '">' +
          '<input type="text" id="sb-verb-custom-kr" placeholder="' + escapeAttr(TU("사전형, 예: 요리하다")) + '">' +
          '<select id="sb-verb-custom-trans"><option value="i">' + escapeHtml(TU("자동사 (목적어 없음)")) + '</option><option value="t">' + escapeHtml(TU("타동사 (목적어 있음)")) + '</option></select>' +
          '<input type="text" id="sb-verb-custom-past" placeholder="' + escapeAttr(TU("과거형(선택, 비우면 자동생성) 예: 요리했")) + '"></div>',
          hint: currentLang === "ko" ? "사전형은 '다'로 끝나게 입력해 주세요 (예: 요리하다). 불규칙 동사는 과거형을 직접 입력해야 정확해요." : TU(SB_CUSTOM_CONJ_HINT) });
      html += fieldHtml("object", TU("목적어 (타동사를 골랐을 때만 적용돼요)"), noneOpt + optHtml(SB_OBJECT_NOUNS, "") + customOpt(),
        { customRow: simpleCustomRow("object", "예: bức thư", "예: 편지") });
      html += fieldHtml("noun", TU("명사 (동사로 'là(이다)'를 골랐을 때, 주어를 설명하는 명사예요: 주어+là+명사)"), noneOpt + optHtml(SB_COMPLEMENT_NOUNS, "") + customOpt(),
        { customRow: simpleCustomRow("noun", "예: người tiên phong", "예: 파이오니아") });
      html += fieldHtml("preposition", TU("전치사 (với 등)"), noneOpt + optHtml(SB_PREPOSITIONS, "") + customOpt(),
        { customRow: simpleCustomRow("preposition", "예: với anh trai", "예: 형과") });
      html += fieldHtml("adjective", TU("형용사 (목적어·명사가 있으면 그것을, 없으면 명사 주어를 꾸며요)"), noneOpt + optHtml(SB_ADJECTIVES, "") + customOpt(),
        { customRow: '<div class="sb-custom-row" id="sb-custom-adjective"><input type="text" class="vi" id="sb-adjective-custom-vi" placeholder="' + escapeAttr(TU("예: vui")) + '">' +
          '<input type="text" id="sb-adjective-custom-kr" placeholder="' + escapeAttr(TU("사전형, 예: 기쁘다")) + '">' +
          '<input type="text" id="sb-adjective-custom-attr" placeholder="' + escapeAttr(TU("관형사형(선택) 예: 기쁜")) + '">' +
          '<input type="text" id="sb-adjective-custom-past" placeholder="' + escapeAttr(TU("과거형(선택) 예: 기뻤")) + '"></div>',
          hint: currentLang === "ko" ? "사전형은 '다'로 끝나게 입력해 주세요. 관형사형·과거형을 비워두면 자동 생성하지만, 불규칙 형용사(으 탈락 등)는 직접 입력해야 정확해요." : TU(SB_CUSTOM_CONJ_HINT) });
      html += fieldHtml("manner", TU("상태부사 (어떻게)"), noneOpt + optHtml(SB_MANNER_ADV, "") + customOpt(),
        { customRow: simpleCustomRow("manner", "예: lặng lẽ", "예: 조용히") });
      html += fieldHtml("place", TU("장소부사 (어디에서·어디로) — 장소 명사만 입력하면 동사에 맞는 ở/đến이 자동으로 붙어요"), noneOpt + optHtml(SB_PLACE_ADV, "") + customOpt(),
        { customRow: simpleCustomRow("place", "장소 명사만, 예: thư viện", "예: 도서관") });
      html += fieldHtml("time", TU("시간부사 (언제)"), noneOpt + optHtml(SB_TIME_ADV, "") + customOpt(),
        { customRow: simpleCustomRow("time", "예: tuần sau", "예: 다음 주") });
      formEl.innerHTML = html;

      whFieldEl = byId("sb-field-wh");
      stypeEl = byId("sb-stype");
      verbEl = byId("sb-verb");
      objectFieldEl = byId("sb-field-object");
      nounFieldEl = byId("sb-field-noun");
      WH_TYPE_IDX = SB_SENTENCE_TYPES.map(function (t) { return t.key; }).indexOf("wh");
      stypeEl.addEventListener("change", function () {
        whFieldEl.classList.toggle("sb-hidden", parseInt(stypeEl.value, 10) !== WH_TYPE_IDX);
      });

      // wire every field's custom-row show/hide toggle
      ["connective", "subject", "aux", "verb", "object", "noun", "preposition", "adjective", "manner", "place", "time"].forEach(function (id) {
        toggleCustomRow(byId("sb-" + id), byId("sb-field-" + id));
      });

      verbEl.addEventListener("change", refreshVerbDependentFields);
      byId("sb-verb-custom-trans").addEventListener("change", refreshVerbDependentFields);
      refreshVerbDependentFields();

      restoreSbForm();
    }

    /* ---- resolvers: read the live select + (if "직접 입력") custom inputs into an item ---- */
    function resolveSimple(selectEl, bank, customId) {
      var v = selectEl.value;
      if (v === "") return null;
      if (v === "custom") {
        var vi = (byId("sb-" + customId + "-custom-vi").value || "").trim();
        var kr = (byId("sb-" + customId + "-custom-kr").value || "").trim();
        if (!vi || !kr) return null;
        return { vi: vi, kr: kr };
      }
      return bank[parseInt(v, 10)];
    }
    function resolveSubject() {
      var v = byId("sb-subject").value;
      if (v === "") return { kind: null, item: null };
      if (v === "custom") {
        var vi = (byId("sb-subject-custom-vi").value || "").trim();
        var kr = (byId("sb-subject-custom-kr").value || "").trim();
        if (!vi || !kr) return { kind: null, item: null };
        return { kind: "noun", item: { vi: vi, kr: kr } };
      }
      var kind = v.charAt(0) === "p" ? "pronoun" : "noun";
      var bank = kind === "pronoun" ? SB_PRONOUNS : SB_NOUN_SUBJECTS;
      return { kind: kind, item: bank[parseInt(v.slice(1), 10)] };
    }
    function resolveVerb() {
      var v = byId("sb-verb").value;
      if (v === "") return { kind: null, item: null };
      if (v === "custom") {
        var vi = (byId("sb-verb-custom-vi").value || "").trim();
        var krDict = (byId("sb-verb-custom-kr").value || "").trim();
        var trans = byId("sb-verb-custom-trans").value;
        var pastOverride = (byId("sb-verb-custom-past").value || "").trim();
        // Determine transitivity from the trans <select> alone, independent of whether the
        // learner has typed the verb text yet -- this lets the object-noun field show/hide as
        // soon as they pick "타동사(목적어 있음)", the same way it does for the built-in
        // transitive-verb list, rather than staying hidden until vi/krDict are both filled in.
        var customKind = trans === "t" ? "trans" : "intrans";
        if (!vi || !krDict) return { kind: customKind, item: null };
        var stem = krDict.charAt(krDict.length - 1) === "다" ? krDict.slice(0, -1) : krDict;
        var past = pastOverride || derivePast(stem);
        return { kind: customKind, item: { vi: vi, kr: krDict, stem: stem, past: past } };
      }
      var kind = v.charAt(0) === "i" ? "intrans" : "trans";
      var bank = kind === "intrans" ? SB_INTRANS_VERBS : SB_TRANS_VERBS;
      return { kind: kind, item: bank[parseInt(v.slice(1), 10)] };
    }
    function resolveAdjective() {
      var v = byId("sb-adjective").value;
      if (v === "") return null;
      if (v === "custom") {
        var vi = (byId("sb-adjective-custom-vi").value || "").trim();
        var krDict = (byId("sb-adjective-custom-kr").value || "").trim();
        var attrOverride = (byId("sb-adjective-custom-attr").value || "").trim();
        var pastOverride = (byId("sb-adjective-custom-past").value || "").trim();
        if (!vi || !krDict) return null;
        var stem = krDict.charAt(krDict.length - 1) === "다" ? krDict.slice(0, -1) : krDict;
        var attr = attrOverride || (hasBatchimStr(stem) ? stem + "은" : addBatchimToLast(stem, NIEUN));
        var past = pastOverride || derivePast(stem);
        return { vi: vi, kr: krDict, attr: attr, past: past };
      }
      return SB_ADJECTIVES[parseInt(v, 10)];
    }
    function resolveAux() {
      var v = byId("sb-aux").value;
      if (v === "") return null;
      if (v === "custom") {
        var vi = (byId("sb-aux-custom-vi").value || "").trim();
        var kr = (byId("sb-aux-custom-kr").value || "").trim();
        var type = byId("sb-aux-custom-type").value;
        if (!vi || !kr) return null;
        return { vi: vi, kr: kr, type: type };
      }
      return SB_AUX_VERBS[parseInt(v, 10)];
    }

    function refreshVerbDependentFields() {
      var vr = resolveVerb();
      objectFieldEl.classList.toggle("sb-hidden", vr.kind !== "trans");
      nounFieldEl.classList.toggle("sb-hidden", !(vr.item && vr.item.vi === "là"));
    }

    /* -------- 문장 생성기 입력값 저장 (localStorage) --------
       학습자가 각 항목에서 고른 선택지와, "직접 입력"으로 손수 써 넣은 단어(베트남어/한국어 뜻 등)가
       페이지를 새로고침하거나 다시 방문해도 지워지지 않도록 저장한다. 개별 필드마다 저장 로직을
       거는 대신 폼 전체에 이벤트 위임을 걸어, 앞으로 필드가 추가되어도 자동으로 저장 대상에
       포함되게 했다. */
    var SB_STORAGE_KEY = "vn-app-sb-form-v1";
    function saveSbForm() {
      try {
        if (!window.localStorage) return;
        var data = {};
        formEl.querySelectorAll("select, input").forEach(function (el) {
          if (el.id) data[el.id] = el.value;
        });
        window.localStorage.setItem(SB_STORAGE_KEY, JSON.stringify(data));
      } catch (e) { /* no-op: localStorage unavailable */ }
    }
    formEl.addEventListener("input", saveSbForm);
    formEl.addEventListener("change", saveSbForm);

    renderSbForm();
    // A language switch re-translates every option/label/hint in the form; the field values
    // themselves are preserved via the same localStorage save/restore path used on page load.
    onLangChange(function () { saveSbForm(); renderSbForm(); });

    // Restores previously-saved field values into the (freshly (re)built) form -- called once
    // at startup and again at the end of every renderSbForm() re-render (e.g. after a language
    // switch), so a switch never wipes out what the learner had already picked.
    function restoreSbForm() {
      var raw;
      try { raw = window.localStorage && window.localStorage.getItem(SB_STORAGE_KEY); } catch (e) { raw = null; }
      if (!raw) return;
      var data;
      try { data = JSON.parse(raw); } catch (e) { return; }
      Object.keys(data).forEach(function (id) {
        var el = byId(id);
        if (!el) return;
        if (el.tagName === "SELECT") {
          // word banks are stable across sessions, but guard against a saved option that no
          // longer exists rather than silently leaving the <select> on a blank/invalid value.
          var hasOpt = false;
          for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].value === data[id]) { hasOpt = true; break; }
          }
          if (!hasOpt) return;
        }
        el.value = data[id];
      });
      // Setting .value programmatically fires neither "input" nor "change", so every
      // show/hide toggle that normally reacts to those events has to be re-run by hand here.
      whFieldEl.classList.toggle("sb-hidden", parseInt(stypeEl.value, 10) !== WH_TYPE_IDX);
      ["connective", "subject", "aux", "verb", "object", "noun", "preposition", "adjective", "manner", "place", "time"].forEach(function (id) {
        var selectEl = byId("sb-" + id), wrapEl = byId("sb-field-" + id);
        if (selectEl && wrapEl) wrapEl.classList.toggle("sb-custom-active", selectEl.value === "custom");
      });
      refreshVerbDependentFields();
    }

    function parseSelection() {
      var stypeIdx = parseInt(stypeEl.value, 10);
      var stype = SB_SENTENCE_TYPES[stypeIdx];
      var wh = stype.key === "wh" ? SB_WH_WORDS[parseInt(byId("sb-wh").value, 10)] : null;
      var connective = resolveSimple(byId("sb-connective"), SB_CONNECTIVES, "connective");
      var subj = resolveSubject();
      var vr = resolveVerb();
      var objectItem = vr.kind === "trans" ? resolveSimple(byId("sb-object"), SB_OBJECT_NOUNS, "object") : null;
      var isCopula = !!(vr.item && vr.item.vi === "là");
      var nounItem = isCopula ? resolveSimple(byId("sb-noun"), SB_COMPLEMENT_NOUNS, "noun") : null;
      var prepositionItem = resolveSimple(byId("sb-preposition"), SB_PREPOSITIONS, "preposition");
      var adjectiveItem = resolveAdjective();
      var auxItem = resolveAux();
      var mannerItem = resolveSimple(byId("sb-manner"), SB_MANNER_ADV, "manner");
      var placeItem = resolveSimple(byId("sb-place"), SB_PLACE_ADV, "place");
      var timeItem = resolveSimple(byId("sb-time"), SB_TIME_ADV, "time");
      return {
        stype: stype.key, wh: wh, connective: connective, subjectKind: subj.kind, subjectItem: subj.item,
        adjectiveItem: adjectiveItem, auxItem: auxItem, verbKind: vr.kind, verbItem: vr.item, isCopula: isCopula,
        objectItem: objectItem, nounItem: nounItem, prepositionItem: prepositionItem,
        mannerItem: mannerItem, placeItem: placeItem, timeItem: timeItem
      };
    }

    /* ---- assemble the sentence: Vietnamese tokens (both orders, for the animation) + Korean sentence + notes ---- */
    function assemble(sel) {
      var notes = [];
      var hasObject = sel.verbKind === "trans" && !!sel.objectItem;
      var hasNounComp = sel.isCopula && !!sel.nounItem;
      var whKey = sel.wh ? sel.wh.key : null;
      var hasSubject = whKey === "ai" || !!sel.subjectItem;

      // thế nào / 어때 bypasses the whole predicate
      if (whKey === "thenao") {
        var adjOnSubj = sel.subjectItem && sel.subjectKind === "noun" && sel.adjectiveItem;
        var viTokens0 = [];
        var krSubjDisplay = sel.subjectItem ? T(sel.subjectItem.kr) : "";
        if (sel.connective) viTokens0.push({ key: "connective", vi: sel.connective.vi, kr: T(sel.connective.kr) });
        if (sel.subjectItem) viTokens0.push({ key: "subject", vi: sel.subjectItem.vi, kr: T(sel.subjectItem.kr) });
        if (adjOnSubj) { viTokens0.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) }); krSubjDisplay = sel.adjectiveItem.attr + " " + krSubjDisplay; }
        else if (sel.adjectiveItem) notes.push("이 조합에서는 형용사를 붙일 명사가 없어(주어 없음 또는 대명사 주어 + '어때?') 형용사 선택은 사용되지 않았어요.");
        viTokens0.push({ key: "marker2", vi: "thế nào?", kr: "어때(요)?" });
        var viText0 = capitalizeFirst(viTokens0.map(function (t) { return t.vi; }).join(" "));
        var krText0 = ((sel.connective ? T(sel.connective.kr) + ", " : "") + krSubjDisplay + " 어때요?").replace(/^\s+/, "");
        notes.push("'thế nào(어때)?'는 서술어 자리를 통째로 대신해서, 골라 둔 동사·조동사·목적어·부사는 이 문장에서는 쓰이지 않아요.");
        return { viTokens: viTokens0, viText: viText0, krText: krText0, notes: notes };
      }

      // là(이다) with no noun complement chosen: incomplete, unless the wh-word "gì(무엇)" is
      // standing in for the complement itself ("Đây là gì?" 이것은 무엇입니까?).
      if (sel.isCopula && !sel.nounItem && whKey !== "gi") {
        return {
          viTokens: [], viText: "", krText: "",
          notes: ["'là(이다)' 동사는 뒤에 명사가 와야 완전한 문장이 돼요. '명사' 항목에서 주어를 설명할 명사를 골라 주세요. (예: Tôi là học sinh. → 나는 학생이다.)"],
          incomplete: true
        };
      }

      // No verb selected: in Vietnamese, an adjective can serve as the whole predicate by
      // itself -- "là" (~be) is only used before a NOUN complement (e.g. "Em là ai?" 너는
      // 누구냐?), never before an adjective. "Trời lạnh." (날씨가 춥다.) needs no verb at all.
      if (!sel.verbItem) {
        if (!sel.adjectiveItem) {
          return {
            viTokens: [], viText: "", krText: "",
            notes: ["동사와 형용사를 둘 다 사용하지 않으면 문장을 만들 수 없어요. 형용사를 하나 골라 '주어 + 형용사'만으로 문장을 만들어 보세요. (예: Trời lạnh. → 날씨가 춥다.)"],
            incomplete: true
          };
        }
        var nvNotes = [];
        if (whKey === "gi") nvNotes.push("형용사 문장에는 '무엇(gì)'이 적용될 목적어가 없어서 이 의문사는 사용되지 않았어요.");

        var nvMarkerBefore = null, nvMarkerAfter = null, nvFinalPunct = ".";
        var nvAuxIsHay = !!(sel.auxItem && sel.auxItem.type === "hay");
        if (sel.stype === "negative") { nvMarkerBefore = { key: "neg", vi: "không", kr: "안(부정)" }; }
        else if (sel.stype === "yesno") {
          if (!(sel.auxItem && sel.auxItem.vi.indexOf("có") === 0)) nvMarkerBefore = { key: "q1", vi: "có", kr: "(의문)있다" };
          nvMarkerAfter = { key: "q2", vi: "không", kr: "(의문)없다" }; nvFinalPunct = "?";
        }
        else if (sel.stype === "imperative") {
          if (!nvAuxIsHay) nvMarkerBefore = { key: "imp1", vi: "hãy", kr: "(명령)~해라" };
          nvMarkerAfter = { key: "imp2", vi: "đi", kr: "(명령 강조)" }; nvFinalPunct = "!";
        }
        else if (sel.stype === "propositive") { nvMarkerBefore = { key: "prop1", vi: "hãy cùng", kr: "(청유)같이~하자" }; nvMarkerAfter = { key: "prop2", vi: "nhé", kr: "(청유 어미)" }; nvFinalPunct = "!"; }
        else if (sel.stype === "alternative") { nvMarkerAfter = { key: "alt", vi: "hay không", kr: "아니면 안 함" }; nvFinalPunct = "?"; }
        else if (sel.stype === "wh") { nvFinalPunct = "?"; }

        var nvEffPlace = sel.placeItem ? placeWithVerb(sel.placeItem, null) : null, nvEffTime = sel.timeItem;
        if (whKey === "dau") { nvEffPlace = placeWithVerb({ vi: "đâu", kr: "어디" }, null); if (sel.placeItem) nvNotes.push("'어디에서(ở đâu)' 의문사가 원래 고른 장소부사 대신 쓰였어요."); }
        if (whKey === "khinao") { nvEffTime = { vi: "khi nào", kr: "언제" }; if (sel.timeItem) nvNotes.push("'언제(khi nào)' 의문사가 원래 고른 시간부사 대신 쓰였어요."); }

        var nv = [];
        if (sel.connective) nv.push({ key: "connective", vi: sel.connective.vi, kr: T(sel.connective.kr) });
        if (nvEffTime) nv.push({ key: "time", vi: nvEffTime.vi, kr: T(nvEffTime.kr) });
        if (whKey === "taisao") nv.push({ key: "taisao", vi: "Tại sao", kr: "왜" });
        var nvSubjTok = whKey === "ai" ? { key: "subject", vi: "Ai", kr: "누가" } : (sel.subjectItem ? { key: "subject", vi: sel.subjectItem.vi, kr: T(sel.subjectItem.kr) } : null);
        if (nvSubjTok) nv.push(nvSubjTok);
        if (nvMarkerBefore) nv.push(nvMarkerBefore);
        if (sel.auxItem) nv.push({ key: "aux", vi: sel.auxItem.vi, kr: T(sel.auxItem.kr) });
        nv.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
        if (sel.prepositionItem) nv.push({ key: "preposition", vi: sel.prepositionItem.vi, kr: T(sel.prepositionItem.kr) });
        if (sel.mannerItem) nv.push({ key: "manner", vi: sel.mannerItem.vi, kr: T(sel.mannerItem.kr) });
        if (nvEffPlace) nv.push({ key: "place", vi: nvEffPlace.vi, kr: T(nvEffPlace.kr) });
        if (nvMarkerAfter) nv.push(nvMarkerAfter);

        var nvWords = nv.map(function (t) { return t.vi; });
        if (sel.connective) nvWords[0] = nvWords[0] + ",";
        var nvViText = capitalizeFirst(nvWords.join(" ")) + nvFinalPunct;

        var nvKrParts = [];
        if (sel.connective) nvKrParts.push(T(sel.connective.kr) + ",");
        if (whKey === "taisao") nvKrParts.push("왜");
        if (nvEffTime) nvKrParts.push(T(nvEffTime.kr));
        if (nvEffPlace) nvKrParts.push(T(nvEffPlace.kr));
        if (whKey === "ai") {
          nvKrParts.push("누가");
        } else if (sel.subjectItem) {
          nvKrParts.push(T(sel.subjectItem.kr) + subjectParticle(T(sel.subjectItem.kr)));
        }
        if (sel.prepositionItem) nvKrParts.push(T(sel.prepositionItem.kr));
        var nvPredStem = { stem: T(sel.adjectiveItem.kr).slice(0, -1), past: sel.adjectiveItem.past, rieul: sel.adjectiveItem.rieul };
        var nvCompound = buildCompoundStem(nvPredStem, sel.auxItem);
        var nvEndingKind = nvAuxIsHay ? "imperative" : ((sel.stype === "wh" || sel.stype === "yesno" || sel.stype === "alternative") ? "yesno" : sel.stype);
        var nvEnding = applyEnding(nvCompound, nvEndingKind);
        var nvKrFinalPunct = ".";
        if (nvEndingKind === "yesno" && (sel.stype === "yesno" || sel.stype === "wh")) nvKrFinalPunct = "?";
        else if (sel.stype === "alternative") { nvEnding += " 아니면 안 그런가요"; nvKrFinalPunct = "?"; }
        if (sel.mannerItem) nvKrParts.push(T(sel.mannerItem.kr));
        nvKrParts.push(nvEnding + nvKrFinalPunct);

        return { viTokens: nv, viText: nvViText, krText: nvKrParts.join(" "), notes: nvNotes };
      }

      // 무엇(gì) with no object -> fallback "làm gì?" (trans verbs) or "là gì?" (copula)
      var giFallback = whKey === "gi" && !hasObject && !hasNounComp && !!sel.verbItem && !sel.isCopula;
      var giFallbackCopula = whKey === "gi" && sel.isCopula && !sel.nounItem;

      // adjective attach target
      var attachTarget = null;
      if (sel.adjectiveItem) {
        if (hasObject) attachTarget = "object";
        else if (hasNounComp) attachTarget = "noun";
        else if (sel.subjectItem && sel.subjectKind === "noun" && whKey !== "ai") attachTarget = "subject";
        else notes.push("이 조합에서는 형용사를 붙일 명사(목적어·명사 또는 명사 주어)가 없어서 형용사 선택은 사용되지 않았어요.");
      }
      if ((giFallback || giFallbackCopula) && sel.adjectiveItem) notes.push("'무엇(gì)' 의문사가 목적어/명사 자리를 대신하고 있어 형용사는 사용되지 않았어요.");

      // effective place/time (wh can force these); the place preposition depends on the verb.
      var effPlace = sel.placeItem ? placeWithVerb(sel.placeItem, sel.verbItem) : null;
      var effTime = sel.timeItem;
      if (whKey === "dau") { effPlace = placeWithVerb({ vi: "đâu", kr: "어디" }, sel.verbItem); if (sel.placeItem) notes.push("'어디에서(ở đâu)' 의문사가 원래 고른 장소부사 대신 쓰였어요."); }
      if (whKey === "khinao") { effTime = { vi: "khi nào", kr: "언제" }; if (sel.timeItem) notes.push("'언제(khi nào)' 의문사가 원래 고른 시간부사 대신 쓰였어요."); }

      // "hãy" chosen as the auxiliary already supplies the command word itself, so the
      // imperative sentence-type marker must not also add its own "hãy" (would double up).
      var auxIsHay = !!(sel.auxItem && sel.auxItem.type === "hay");
      // là(이다) is never negated with "không + verb" like every other verb -- Vietnamese uses
      // the fixed phrase "không phải là", and Korean replaces "이다" with "아니다" wholesale
      // rather than just negating it with "-지 않다".
      var copulaNeg = sel.isCopula && sel.stype === "negative" && !auxIsHay;

      // sentence-type markers
      var markerBefore = null, markerAfter = null, finalPunct = ".";
      if (sel.stype === "negative") { markerBefore = { key: "neg", vi: sel.isCopula ? "không phải" : "không", kr: "안(부정)" }; }
      else if (sel.stype === "yesno") {
        // "có thể"(can) already begins with "có", so a yes/no question with that aux only
        // needs the trailing "không?" -- adding another leading "có" would double it up.
        if (!(sel.auxItem && sel.auxItem.vi.indexOf("có") === 0)) markerBefore = { key: "q1", vi: "có", kr: "(의문)있다" };
        markerAfter = { key: "q2", vi: "không", kr: "(의문)없다" }; finalPunct = "?";
      }
      else if (sel.stype === "imperative") {
        if (!auxIsHay) markerBefore = { key: "imp1", vi: "hãy", kr: "(명령)~해라" };
        markerAfter = { key: "imp2", vi: "đi", kr: "(명령 강조)" }; finalPunct = "!";
      }
      else if (sel.stype === "propositive") { markerBefore = { key: "prop1", vi: "hãy cùng", kr: "(청유)같이~하자" }; markerAfter = { key: "prop2", vi: "nhé", kr: "(청유 어미)" }; finalPunct = "!"; }
      else if (sel.stype === "alternative") { markerAfter = { key: "alt", vi: "hay không", kr: "아니면 안 함" }; finalPunct = "?"; }
      else if (sel.stype === "wh") { finalPunct = "?"; }

      // ---- Vietnamese token sequence (final order) ----
      // Time adverbs read most naturally at the very front of a Vietnamese sentence ("Ngày mai
      // tôi..." 내일 나는~), so they're placed right after the connective, ahead of the subject,
      // rather than trailing at the end the way they sit in the Korean gloss's SOV shape.
      var vi = [];
      if (sel.connective) vi.push({ key: "connective", vi: sel.connective.vi, kr: T(sel.connective.kr) });
      if (effTime) vi.push({ key: "time", vi: effTime.vi, kr: T(effTime.kr) });
      if (whKey === "taisao") vi.push({ key: "taisao", vi: "Tại sao", kr: "왜" });
      var subjTok = whKey === "ai" ? { key: "subject", vi: "Ai", kr: "누가" } : (sel.subjectItem ? { key: "subject", vi: sel.subjectItem.vi, kr: T(sel.subjectItem.kr) } : null);
      if (subjTok) vi.push(subjTok);
      if (attachTarget === "subject") vi.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
      if (markerBefore) vi.push(markerBefore);
      if (sel.auxItem && !giFallback && !giFallbackCopula) vi.push({ key: "aux", vi: sel.auxItem.vi, kr: T(sel.auxItem.kr) });
      if (giFallback) {
        vi.push({ key: "verb", vi: "làm", kr: "하다" });
        vi.push({ key: "object", vi: "gì", kr: "무엇" });
      } else if (sel.isCopula) {
        vi.push({ key: "verb", vi: sel.verbItem.vi, kr: T(sel.verbItem.kr) });
        if (giFallbackCopula) {
          vi.push({ key: "noun", vi: "gì", kr: "무엇" });
        } else {
          vi.push({ key: "noun", vi: sel.nounItem.vi, kr: T(sel.nounItem.kr) });
          if (attachTarget === "noun") vi.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
        }
      } else {
        vi.push({ key: "verb", vi: sel.verbItem.vi, kr: T(sel.verbItem.kr) });
        if (hasObject) {
          var objTok = whKey === "gi" ? { key: "object", vi: "gì", kr: "무엇" } : { key: "object", vi: sel.objectItem.vi, kr: T(sel.objectItem.kr) };
          vi.push(objTok);
          if (attachTarget === "object") vi.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
        }
      }
      if (sel.prepositionItem) vi.push({ key: "preposition", vi: sel.prepositionItem.vi, kr: T(sel.prepositionItem.kr) });
      if (sel.mannerItem) vi.push({ key: "manner", vi: sel.mannerItem.vi, kr: T(sel.mannerItem.kr) });
      if (effPlace) vi.push({ key: "place", vi: effPlace.vi, kr: T(effPlace.kr) });
      if (markerAfter) vi.push(markerAfter);

      var words = vi.map(function (t) { return t.vi; });
      if (sel.connective) words[0] = words[0] + ",";
      var viText = capitalizeFirst(words.join(" ")) + finalPunct;

      // ---- Korean sentence (SOV order, mechanically conjugated) ----
      var krParts = [];
      if (sel.connective) krParts.push(T(sel.connective.kr) + ",");
      if (whKey === "taisao") krParts.push("왜");
      if (effTime) krParts.push(T(effTime.kr));
      if (effPlace) krParts.push(T(effPlace.kr));
      if (whKey === "ai") {
        krParts.push("누가");
      } else if (sel.subjectItem) {
        var subjKrWord = T(sel.subjectItem.kr);
        krParts.push((attachTarget === "subject" ? sel.adjectiveItem.attr + " " : "") + subjKrWord + topicParticle(subjKrWord));
      }

      if (giFallback) {
        krParts.push("무엇을 합니까?");
        var krText1 = krParts.join(" ");
        return { viTokens: vi, viText: viText, krText: krText1, notes: notes.concat(["'무엇(gì)'을 물을 목적어가 없는 자동사 조합이라, 대신 '무엇을 합니까?'로 표시했어요."]) };
      }

      // Ending is computed BEFORE the object/noun piece is pushed so that, for the copula
      // ("là/이다"), the "-입니다/-입니까" ending can be glued directly onto the noun with no
      // space (학생입니다, not 학생 입니다) -- unlike a regular verb's ending, which is always
      // its own separate word after the object (밥을 먹습니다), 이다's ending is a suffix that
      // attaches straight onto the noun it follows.
      var ending, endingKind;
      if (copulaNeg) {
        ending = "아닙니다";
        endingKind = "negative-copula";
      } else {
        var compound = buildCompoundStem(sel.verbItem, sel.auxItem);
        // Choosing "hãy" as the aux inherently means "make this a command," regardless of
        // whatever the sentence-type dropdown says, so it forces the Korean imperative ending.
        endingKind = auxIsHay ? "imperative" : ((sel.stype === "wh" || sel.stype === "yesno" || sel.stype === "alternative") ? "yesno" : sel.stype);
        ending = applyEnding(compound, endingKind);
      }
      var krFinalPunct = ".";
      if (endingKind === "yesno" && (sel.stype === "yesno" || sel.stype === "wh")) krFinalPunct = "?";
      else if (sel.stype === "alternative") { ending += " 아니면 안 그런가요"; krFinalPunct = "?"; }

      var negNounParticle = null;
      // true once the "-입니다/-입니까" ending has been glued directly onto the noun (copula,
      // affirmative) -- the later generic "push ending as its own word" step is then skipped.
      var copulaEndingGlued = false;
      if (hasObject) {
        var objKrWord = whKey === "gi" ? "무엇" : T(sel.objectItem.kr);
        var objDisplay = (attachTarget === "object" ? sel.adjectiveItem.attr + " " : "") + objKrWord + objectParticle(objKrWord);
        krParts.push(objDisplay);
      } else if (sel.isCopula) {
        var nounKrWord = giFallbackCopula ? "무엇" : T(sel.nounItem.kr);
        var nounPrefix = (attachTarget === "noun" ? sel.adjectiveItem.attr + " " : "");
        if (copulaNeg) {
          negNounParticle = hasBatchimStr(nounKrWord) ? "이" : "가";
          krParts.push(nounPrefix + nounKrWord + negNounParticle);
        } else {
          krParts.push(nounPrefix + nounKrWord + ending);
          copulaEndingGlued = true;
        }
      }
      if (sel.prepositionItem) krParts.push(T(sel.prepositionItem.kr));
      if (sel.mannerItem) krParts.push(T(sel.mannerItem.kr));
      krParts.push(copulaEndingGlued ? krFinalPunct : ending + krFinalPunct);

      // Punctuation is always pushed as its own trailing array item (simplest for every branch
      // above), so join with spaces first, then strip the space that lands before it -- Korean
      // sentence-final punctuation never has a preceding space, whatever ending produced it.
      var krText = krParts.join(" ").replace(/\s+([.?!])$/, "$1");
      return { viTokens: vi, viText: viText, krText: krText, notes: notes };
    }

    /* ============================================================================
       MULTI-LANGUAGE ENGINES (zh/en/ja) -- assemble()/koreanOrderChips() above stay
       Korean-only and untouched (tested, proven). Everything below is new and
       independent, sharing no code with them, to keep zero regression risk on the
       working Korean feature.

       buildViCore(sel) computes the language-INDEPENDENT half of a sentence: which
       Vietnamese word order slots are filled, wh-word substitutions, the sentence-type
       marker scheme, and where an adjective attaches -- exactly mirroring assemble()'s
       own branch structure, so the Vietnamese sentence itself (viText) can never
       drift between UI languages. Each assembleZh/En/Ja(sel) below calls this ONCE,
       then builds its own natural-order, grammatically-conjugated sentence from the
       same decisions.
       ============================================================================ */
    function placeWithVerbVi(itemVi, verbItem) {
      var verbVi = verbItem ? verbItem.vi : null;
      if (verbVi === "ở") return { vi: itemVi };
      if (verbVi === "đi") return { vi: "đến " + itemVi };
      if (verbVi === "đến" || verbVi === "về") return { vi: itemVi };
      return { vi: "ở " + itemVi };
    }
    function buildViCore(sel) {
      var hasObject = sel.verbKind === "trans" && !!sel.objectItem;
      var hasNounComp = sel.isCopula && !!sel.nounItem;
      var whKey = sel.wh ? sel.wh.key : null;

      if (whKey === "thenao") {
        var adjOnSubj = !!(sel.subjectItem && sel.subjectKind === "noun" && sel.adjectiveItem);
        var t0 = [];
        if (sel.connective) t0.push({ key: "connective", vi: sel.connective.vi });
        if (sel.subjectItem) t0.push({ key: "subject", vi: sel.subjectItem.vi });
        if (adjOnSubj) t0.push({ key: "adjective", vi: sel.adjectiveItem.vi });
        t0.push({ key: "marker2", vi: "thế nào?" });
        var words0 = t0.map(function (t) { return t.vi; });
        if (sel.connective) words0[0] = words0[0] + ",";
        return {
          mode: "thenao", whKey: whKey, tokens: t0, viText: capitalizeFirst(words0.join(" ")),
          adjOnSubj: adjOnSubj, adjUnused: !!(sel.adjectiveItem && !adjOnSubj)
        };
      }

      if (sel.isCopula && !sel.nounItem && whKey !== "gi") return { mode: "incomplete" };

      if (!sel.verbItem) {
        if (!sel.adjectiveItem) return { mode: "no-predicate" };
        var nvMarkerBefore = null, nvMarkerAfter = null, nvFinalPunct = ".";
        var nvAuxIsHay = !!(sel.auxItem && sel.auxItem.type === "hay");
        if (sel.stype === "negative") { nvMarkerBefore = { key: "neg", vi: "không" }; }
        else if (sel.stype === "yesno") {
          if (!(sel.auxItem && sel.auxItem.vi.indexOf("có") === 0)) nvMarkerBefore = { key: "q1", vi: "có" };
          nvMarkerAfter = { key: "q2", vi: "không" }; nvFinalPunct = "?";
        } else if (sel.stype === "imperative") {
          if (!nvAuxIsHay) nvMarkerBefore = { key: "imp1", vi: "hãy" };
          nvMarkerAfter = { key: "imp2", vi: "đi" }; nvFinalPunct = "!";
        } else if (sel.stype === "propositive") { nvMarkerBefore = { key: "prop1", vi: "hãy cùng" }; nvMarkerAfter = { key: "prop2", vi: "nhé" }; nvFinalPunct = "!"; }
        else if (sel.stype === "alternative") { nvMarkerAfter = { key: "alt", vi: "hay không" }; nvFinalPunct = "?"; }
        else if (sel.stype === "wh") { nvFinalPunct = "?"; }

        var nvEffPlace = sel.placeItem ? placeWithVerbVi(sel.placeItem.vi, null) : null, nvEffTime = sel.timeItem;
        var placeOverridden = false, timeOverridden = false;
        if (whKey === "dau") { nvEffPlace = placeWithVerbVi("đâu", null); placeOverridden = !!sel.placeItem; }
        if (whKey === "khinao") { nvEffTime = { vi: "khi nào" }; timeOverridden = !!sel.timeItem; }

        var nv = [];
        if (sel.connective) nv.push({ key: "connective", vi: sel.connective.vi });
        if (nvEffTime) nv.push({ key: "time", vi: nvEffTime.vi });
        if (whKey === "taisao") nv.push({ key: "taisao", vi: "Tại sao" });
        var nvSubjTok = whKey === "ai" ? { key: "subject", vi: "Ai" } : (sel.subjectItem ? { key: "subject", vi: sel.subjectItem.vi } : null);
        if (nvSubjTok) nv.push(nvSubjTok);
        if (nvMarkerBefore) nv.push(nvMarkerBefore);
        if (sel.auxItem) nv.push({ key: "aux", vi: sel.auxItem.vi });
        nv.push({ key: "adjective", vi: sel.adjectiveItem.vi });
        if (sel.prepositionItem) nv.push({ key: "preposition", vi: sel.prepositionItem.vi });
        if (sel.mannerItem) nv.push({ key: "manner", vi: sel.mannerItem.vi });
        if (nvEffPlace) nv.push({ key: "place", vi: nvEffPlace.vi });
        if (nvMarkerAfter) nv.push(nvMarkerAfter);

        var nvWords = nv.map(function (t) { return t.vi; });
        if (sel.connective) nvWords[0] = nvWords[0] + ",";
        return {
          mode: "no-verb", whKey: whKey, tokens: nv, viText: capitalizeFirst(nvWords.join(" ")) + nvFinalPunct,
          auxIsHay: nvAuxIsHay, stype: sel.stype, placeOverridden: placeOverridden, timeOverridden: timeOverridden,
          giUnused: whKey === "gi"
        };
      }

      var giFallback = whKey === "gi" && !hasObject && !hasNounComp && !!sel.verbItem && !sel.isCopula;
      var giFallbackCopula = whKey === "gi" && sel.isCopula && !sel.nounItem;

      var attachTarget = null, adjUnused = false;
      if (sel.adjectiveItem) {
        if (hasObject) attachTarget = "object";
        else if (hasNounComp) attachTarget = "noun";
        else if (sel.subjectItem && sel.subjectKind === "noun" && whKey !== "ai") attachTarget = "subject";
        else adjUnused = true;
      }
      var adjUnusedGi = !!((giFallback || giFallbackCopula) && sel.adjectiveItem);

      var effPlace = sel.placeItem ? placeWithVerbVi(sel.placeItem.vi, sel.verbItem) : null;
      var effTime = sel.timeItem;
      var placeOverridden2 = false, timeOverridden2 = false;
      if (whKey === "dau") { effPlace = placeWithVerbVi("đâu", sel.verbItem); placeOverridden2 = !!sel.placeItem; }
      if (whKey === "khinao") { effTime = { vi: "khi nào" }; timeOverridden2 = !!sel.timeItem; }

      var auxIsHay = !!(sel.auxItem && sel.auxItem.type === "hay");
      var copulaNeg = sel.isCopula && sel.stype === "negative" && !auxIsHay;

      var markerBefore = null, markerAfter = null, finalPunct = ".";
      if (sel.stype === "negative") { markerBefore = { key: "neg", vi: sel.isCopula ? "không phải" : "không" }; }
      else if (sel.stype === "yesno") {
        if (!(sel.auxItem && sel.auxItem.vi.indexOf("có") === 0)) markerBefore = { key: "q1", vi: "có" };
        markerAfter = { key: "q2", vi: "không" }; finalPunct = "?";
      } else if (sel.stype === "imperative") {
        if (!auxIsHay) markerBefore = { key: "imp1", vi: "hãy" };
        markerAfter = { key: "imp2", vi: "đi" }; finalPunct = "!";
      } else if (sel.stype === "propositive") { markerBefore = { key: "prop1", vi: "hãy cùng" }; markerAfter = { key: "prop2", vi: "nhé" }; finalPunct = "!"; }
      else if (sel.stype === "alternative") { markerAfter = { key: "alt", vi: "hay không" }; finalPunct = "?"; }
      else if (sel.stype === "wh") { finalPunct = "?"; }

      var vi = [];
      if (sel.connective) vi.push({ key: "connective", vi: sel.connective.vi });
      if (effTime) vi.push({ key: "time", vi: effTime.vi });
      if (whKey === "taisao") vi.push({ key: "taisao", vi: "Tại sao" });
      var subjTok = whKey === "ai" ? { key: "subject", vi: "Ai" } : (sel.subjectItem ? { key: "subject", vi: sel.subjectItem.vi } : null);
      if (subjTok) vi.push(subjTok);
      if (attachTarget === "subject") vi.push({ key: "adjective", vi: sel.adjectiveItem.vi });
      if (markerBefore) vi.push(markerBefore);
      if (sel.auxItem && !giFallback && !giFallbackCopula) vi.push({ key: "aux", vi: sel.auxItem.vi });
      if (giFallback) {
        vi.push({ key: "verb", vi: "làm" });
        vi.push({ key: "object", vi: "gì" });
      } else if (sel.isCopula) {
        vi.push({ key: "verb", vi: sel.verbItem.vi });
        if (giFallbackCopula) {
          vi.push({ key: "noun", vi: "gì" });
        } else {
          vi.push({ key: "noun", vi: sel.nounItem.vi });
          if (attachTarget === "noun") vi.push({ key: "adjective", vi: sel.adjectiveItem.vi });
        }
      } else {
        vi.push({ key: "verb", vi: sel.verbItem.vi });
        if (hasObject) {
          var objTok = whKey === "gi" ? { key: "object", vi: "gì" } : { key: "object", vi: sel.objectItem.vi };
          vi.push(objTok);
          if (attachTarget === "object") vi.push({ key: "adjective", vi: sel.adjectiveItem.vi });
        }
      }
      if (sel.prepositionItem) vi.push({ key: "preposition", vi: sel.prepositionItem.vi });
      if (sel.mannerItem) vi.push({ key: "manner", vi: sel.mannerItem.vi });
      if (effPlace) vi.push({ key: "place", vi: effPlace.vi });
      if (markerAfter) vi.push(markerAfter);

      var words = vi.map(function (t) { return t.vi; });
      if (sel.connective) words[0] = words[0] + ",";
      var viText = capitalizeFirst(words.join(" ")) + finalPunct;

      return {
        mode: "main", whKey: whKey, hasObject: hasObject, hasNounComp: hasNounComp,
        giFallback: giFallback, giFallbackCopula: giFallbackCopula,
        attachTarget: attachTarget, adjUnused: adjUnused, adjUnusedGi: adjUnusedGi,
        placeOverridden: placeOverridden2, timeOverridden: timeOverridden2,
        auxIsHay: auxIsHay, copulaNeg: copulaNeg, stype: sel.stype,
        tokens: vi, viText: viText
      };
    }
    // key -> Vietnamese word, read back off buildViCore()'s own token list, so every
    // language builder below reuses the exact same Vietnamese wording instead of
    // re-deriving it (and risking it drifting from viText).
    function viMap(core) {
      var m = {};
      core.tokens.forEach(function (t) { m[t.key] = t.vi; });
      return m;
    }
    // Builds the Vietnamese-order word-by-word gloss table (base dictionary meanings only,
    // no conjugation -- exactly what assemble()'s own vi[]/nv[] token building already shows
    // for Korean) for any of the three new languages, given that language's marker-word table M.
    function buildGlossTokens(core, sel, M) {
      if (!core.tokens) return [];
      return core.tokens.map(function (t) {
        var kr;
        switch (t.key) {
          case "connective": kr = T(sel.connective.kr); break;
          case "time": kr = t.vi === "khi nào" ? M.khinao : T(sel.timeItem.kr); break;
          case "taisao": kr = M.taisao; break;
          case "subject": kr = t.vi === "Ai" ? M.ai : T(sel.subjectItem.kr); break;
          case "adjective": kr = T(sel.adjectiveItem.kr); break;
          case "aux": kr = T(sel.auxItem.kr); break;
          case "verb": kr = t.vi === "làm" ? M.giVerb : T(sel.verbItem.kr); break;
          case "object": kr = t.vi === "gì" ? M.gi : T(sel.objectItem.kr); break;
          case "noun": kr = t.vi === "gì" ? M.gi : T(sel.nounItem.kr); break;
          case "preposition": kr = T(sel.prepositionItem.kr); break;
          case "manner": kr = T(sel.mannerItem.kr); break;
          case "place": kr = t.vi.indexOf("đâu") >= 0 ? M.dau : T(sel.placeItem.kr); break;
          case "neg": kr = M.neg; break;
          case "q1": kr = M.q1; break;
          case "q2": kr = M.q2; break;
          case "imp1": kr = M.imp1; break;
          case "imp2": kr = M.imp2; break;
          case "prop1": kr = M.prop1; break;
          case "prop2": kr = M.prop2; break;
          case "alt": kr = M.alt; break;
          case "marker2": kr = M.marker2; break;
          default: kr = t.vi;
        }
        return { key: t.key, vi: t.vi, kr: kr || "" };
      });
    }
    // Chooses the (before/after marker, final punctuation) triple for a sentence type from a
    // language's marker-word table M -- shared by every language whose markers are simple
    // invariant particles glued before/after the predicate (Chinese; Korean/Vietnamese already
    // have their own dedicated logic above and don't use this). A falsy M[key] suppresses that
    // marker entirely (e.g. Chinese has no separate "before" word for yes/no questions).
    function sbMarkers(stype, auxItem, M) {
      function mk(key, vi) { return M[key] ? { key: key, vi: vi, kr: M[key] } : null; }
      var auxIsHay = !!(auxItem && auxItem.type === "hay");
      if (stype === "negative") return { before: mk("neg", "không"), after: null, punct: M.punctStatement };
      if (stype === "yesno") {
        var before = (auxItem && auxItem.vi.indexOf("có") === 0) ? null : mk("q1", "có");
        return { before: before, after: mk("q2", "không"), punct: M.punctQ };
      }
      if (stype === "imperative") return { before: auxIsHay ? null : mk("imp1", "hãy"), after: mk("imp2", "đi"), punct: M.punctExcl };
      if (stype === "propositive") return { before: mk("prop1", "hãy cùng"), after: mk("prop2", "nhé"), punct: M.punctExcl };
      if (stype === "alternative") return { before: null, after: mk("alt", "hay không"), punct: M.punctQ };
      if (stype === "wh") return { before: null, after: null, punct: M.punctQ };
      return { before: null, after: null, punct: M.punctStatement };
    }
    function sbNote(ko) { return TU(ko); }
    var SB_NOTE_ADJ_UNUSED = "이 조합에서는 형용사를 붙일 명사(목적어·명사 또는 명사 주어)가 없어서 형용사 선택은 사용되지 않았어요.";
    var SB_NOTE_ADJ_UNUSED_THENAO = "이 조합에서는 형용사를 붙일 명사가 없어(주어 없음 또는 대명사 주어 + '어때?') 형용사 선택은 사용되지 않았어요.";
    var SB_NOTE_ADJ_UNUSED_GI = "'무엇(gì)' 의문사가 목적어/명사 자리를 대신하고 있어 형용사는 사용되지 않았어요.";
    var SB_NOTE_GI_ADJ_ONLY = "형용사 문장에는 '무엇(gì)'이 적용될 목적어가 없어서 이 의문사는 사용되지 않았어요.";
    var SB_NOTE_DAU_OVERRIDE = "'어디에서(ở đâu)' 의문사가 원래 고른 장소부사 대신 쓰였어요.";
    var SB_NOTE_KHINAO_OVERRIDE = "'언제(khi nào)' 의문사가 원래 고른 시간부사 대신 쓰였어요.";
    var SB_NOTE_THENAO = "'thế nào(어때)?'는 서술어 자리를 통째로 대신해서, 골라 둔 동사·조동사·목적어·부사는 이 문장에서는 쓰이지 않아요.";
    var SB_NOTE_COPULA_INCOMPLETE = "'là(이다)' 동사는 뒤에 명사가 와야 완전한 문장이 돼요. '명사' 항목에서 주어를 설명할 명사를 골라 주세요. (예: Tôi là học sinh. → 나는 학생이다.)";
    var SB_NOTE_NO_PREDICATE = "동사와 형용사를 둘 다 사용하지 않으면 문장을 만들 수 없어요. 형용사를 하나 골라 '주어 + 형용사'만으로 문장을 만들어 보세요. (예: Trời lạnh. → 날씨가 춥다.)";
    function coreNotes(core) {
      var notes = [];
      if (core.mode === "thenao" && core.adjUnused) notes.push(sbNote(SB_NOTE_ADJ_UNUSED_THENAO));
      if (core.mode === "no-verb" && core.giUnused) notes.push(sbNote(SB_NOTE_GI_ADJ_ONLY));
      if (core.mode === "main" && core.adjUnused) notes.push(sbNote(SB_NOTE_ADJ_UNUSED));
      if (core.mode === "main" && core.adjUnusedGi) notes.push(sbNote(SB_NOTE_ADJ_UNUSED_GI));
      if (core.placeOverridden) notes.push(sbNote(SB_NOTE_DAU_OVERRIDE));
      if (core.timeOverridden) notes.push(sbNote(SB_NOTE_KHINAO_OVERRIDE));
      return notes;
    }

    /* ============================== 中文 (Traditional Chinese) ==============================
       No conjugation at all -- tense/aspect/negation/questions are invariant particles
       (了/正在/不/沒/嗎/吧/請 ...), and 是/不是 negates perfectly regularly (unlike Korean's
       irregular 아니다), so this engine only has to choose the right invariant word per slot. */
    var ZH_M = {
      neg: "不", q1: "", q2: "嗎", imp1: "請", imp2: "", prop1: "一起", prop2: "吧", alt: "還是不",
      ai: "誰", gi: "什麼", dau: "哪裡", khinao: "什麼時候", taisao: "為什麼", giVerb: "做", marker2: "怎麼樣？",
      punctStatement: "。", punctQ: "？", punctExcl: "！"
    };
    function zhAuxPre(auxItem) {
      if (!auxItem) return null;
      switch (auxItem.type) {
        case "want": return "想"; case "must": return "必須"; case "can": return "可以";
        case "cannot": return "不能"; case "should": return "應該"; case "will": return "會";
        case "ing": return "正在"; case "need": return "需要"; case "like": return "喜歡";
        default: return null; // "past"/"hay" carry no preverbal word of their own
      }
    }
    function zhPlace(word, verbItem) {
      var verbVi = verbItem ? verbItem.vi : null;
      // "ở"(在) IS the verb itself, and "đi/đến/về"(去/來/回) already mean "go/come/return TO",
      // so the place noun follows the verb directly with no preposition in both cases; every
      // other verb describes an action happening AT a place, so "在+place" goes BEFORE it.
      if (verbVi === "ở" || verbVi === "đi" || verbVi === "đến" || verbVi === "về") return { pos: "post", text: word };
      return { pos: "pre", text: "在" + word };
    }
    function assembleZh(sel) {
      var core = buildViCore(sel);
      if (core.mode === "incomplete") return { viTokens: [], viText: "", krText: "", notes: [sbNote(SB_NOTE_COPULA_INCOMPLETE)], incomplete: true };
      if (core.mode === "no-predicate") return { viTokens: [], viText: "", krText: "", notes: [sbNote(SB_NOTE_NO_PREDICATE)], incomplete: true };
      var viTokens = buildGlossTokens(core, sel, ZH_M);
      var notes = coreNotes(core);
      var V = viMap(core);
      var chips = [];

      if (core.mode === "thenao") {
        var subjZh = sel.subjectItem ? T(sel.subjectItem.kr) : "";
        if (core.adjOnSubj) subjZh = T(sel.adjectiveItem.kr) + "的" + subjZh;
        if (sel.connective) chips.push({ key: "connective", vi: V.connective, kr: T(sel.connective.kr) });
        if (sel.subjectItem) chips.push({ key: "subject", vi: V.subject, kr: subjZh });
        chips.push({ key: "marker2", vi: "thế nào?", kr: ZH_M.marker2 });
        notes.push(sbNote(SB_NOTE_THENAO));
        var krText0 = (sel.connective ? T(sel.connective.kr) + "，" : "") + subjZh + ZH_M.marker2;
        return { viTokens: viTokens, viText: core.viText, krText: krText0, notes: notes, orderChips: chips };
      }

      // Choosing "hãy" as the aux inherently means "make this a command" regardless of the
      // sentence-type dropdown, mirroring assemble()'s own auxIsHay handling for Korean.
      var stype = (sel.auxItem && sel.auxItem.type === "hay") ? "imperative" : sel.stype;
      var pastMark = (sel.auxItem && sel.auxItem.type === "past" && stype !== "negative") ? "了" : "";

      if (core.mode === "no-verb") {
        var adjZh = T(sel.adjectiveItem.kr);
        var auxPre = zhAuxPre(sel.auxItem);
        var adjDisplay = adjZh;
        var mk = sbMarkers(stype, null, ZH_M); // zh's own imperative marker (請) is the only carrier of that meaning, so it must never be suppressed just because the VI aux happens to be "hãy"
        if (stype === "statement" && !sel.auxItem) adjDisplay = "很" + adjZh;
        var effPlace = V.place ? zhPlace(sel.placeItem ? T(sel.placeItem.kr) : "哪裡", null) : null;

        if (sel.connective) chips.push({ key: "connective", vi: V.connective, kr: T(sel.connective.kr) + "，" });
        if (V.time) chips.push({ key: "time", vi: V.time, kr: V.time === "khi nào" ? ZH_M.khinao : T(sel.timeItem.kr) });
        if (core.whKey === "taisao") chips.push({ key: "taisao", vi: V.taisao, kr: ZH_M.taisao });
        if (V.subject) chips.push({ key: "subject", vi: V.subject, kr: core.whKey === "ai" ? ZH_M.ai : T(sel.subjectItem.kr) });
        if (effPlace && effPlace.pos === "pre") chips.push({ key: "place", vi: V.place, kr: effPlace.text });
        if (mk.before) chips.push(mk.before);
        if (auxPre) chips.push({ key: "aux", vi: V.aux, kr: auxPre });
        chips.push({ key: "adjective", vi: V.adjective, kr: adjDisplay + pastMark });
        if (V.preposition) chips.push({ key: "preposition", vi: V.preposition, kr: T(sel.prepositionItem.kr) });
        if (V.manner) chips.push({ key: "manner", vi: V.manner, kr: T(sel.mannerItem.kr) });
        if (effPlace && effPlace.pos === "post") chips.push({ key: "place", vi: V.place, kr: effPlace.text });
        if (mk.after) chips.push(mk.after);

        var krText1 = chips.map(function (c) { return c.kr; }).join("") + mk.punct;
        return { viTokens: viTokens, viText: core.viText, krText: krText1, notes: notes, orderChips: chips };
      }

      // main branch
      var hasObject = core.hasObject, hasNounComp = core.hasNounComp;
      var giFallback = core.giFallback, giFallbackCopula = core.giFallbackCopula;
      var attachTarget = core.attachTarget;
      var mk2 = sbMarkers(stype, null, ZH_M);
      var auxPre2 = (giFallback || giFallbackCopula) ? null : zhAuxPre(sel.auxItem);
      var verbZh = giFallback ? ZH_M.giVerb : (sel.isCopula ? "是" : T(sel.verbItem.kr));
      var effPlace2 = V.place ? zhPlace(core.whKey === "dau" ? ZH_M.dau : T(sel.placeItem.kr), sel.verbItem) : null;

      if (sel.connective) chips.push({ key: "connective", vi: V.connective, kr: T(sel.connective.kr) + "，" });
      if (V.time) chips.push({ key: "time", vi: V.time, kr: V.time === "khi nào" ? ZH_M.khinao : T(sel.timeItem.kr) });
      if (core.whKey === "taisao") chips.push({ key: "taisao", vi: V.taisao, kr: ZH_M.taisao });
      if (V.subject) chips.push({ key: "subject", vi: V.subject, kr: core.whKey === "ai" ? ZH_M.ai : T(sel.subjectItem.kr) });
      if (effPlace2 && effPlace2.pos === "pre") chips.push({ key: "place", vi: V.place, kr: effPlace2.text });
      if (mk2.before) chips.push(mk2.before);
      if (auxPre2) chips.push({ key: "aux", vi: V.aux, kr: auxPre2 });
      chips.push({ key: "verb", vi: V.verb, kr: verbZh + pastMark });
      if (giFallback) {
        chips.push({ key: "object", vi: "gì", kr: ZH_M.gi });
      } else if (sel.isCopula) {
        if (giFallbackCopula) chips.push({ key: "noun", vi: "gì", kr: ZH_M.gi });
        else chips.push({ key: "noun", vi: V.noun, kr: (attachTarget === "noun" ? T(sel.adjectiveItem.kr) + "的" : "") + T(sel.nounItem.kr) });
      } else if (hasObject) {
        var objZh = core.whKey === "gi" ? ZH_M.gi : T(sel.objectItem.kr);
        chips.push({ key: "object", vi: V.object, kr: (attachTarget === "object" ? T(sel.adjectiveItem.kr) + "的" : "") + objZh });
      }
      if (attachTarget === "subject") {
        // (already folded into the subject chip's kr text below via a second pass -- Chinese
        // attributive adjectives sit directly in front of the noun they modify, so the cleanest
        // place to splice it in is the subject chip itself, not a separate chip.)
        chips.forEach(function (c) { if (c.key === "subject") c.kr = T(sel.adjectiveItem.kr) + "的" + c.kr; });
      }
      if (V.preposition) chips.push({ key: "preposition", vi: V.preposition, kr: T(sel.prepositionItem.kr) });
      if (V.manner) chips.push({ key: "manner", vi: V.manner, kr: T(sel.mannerItem.kr) });
      if (effPlace2 && effPlace2.pos === "post") chips.push({ key: "place", vi: V.place, kr: effPlace2.text });
      if (mk2.after) chips.push(mk2.after);

      var krText2 = chips.map(function (c) { return c.kr; }).join("") + mk2.punct;
      return { viTokens: viTokens, viText: core.viText, krText: krText2, notes: notes, orderChips: chips };
    }

    /* ================================== English ==================================
       Subject-verb agreement (3rd-person-singular -s only) and do-support for negation/
       questions on plain verbs; modal auxiliaries (must/can/should/will) don't conjugate
       or need do-support; irregular verb forms are hand-curated in the data. */
    var EN_M = {
      ai: "who", gi: "what", dau: "where", taisao: "why", giVerb: "do",
      punctStatement: ".", punctQ: "?", punctExcl: "!"
    };
    function enBe(person, number, past) {
      if (past) return (number === "pl" || person === 2) ? "were" : "was";
      if (number === "pl" || person === 2) return "are";
      if (person === 1) return "am";
      return "is";
    }
    function enDo(person, number, past) {
      if (past) return "did";
      return (person === 3 && number === "sg") ? "does" : "do";
    }
    function enAgree3sg(word) {
      var last = word.charAt(word.length - 1);
      return (last === "s" || last === "h" || last === "o") ? word + "es" : word + "s";
    }
    function enSubjInfo(sel, whKey) {
      if (whKey === "ai") return { text: "who", person: 3, number: "sg" };
      if (!sel.subjectItem) return { text: null, person: 3, number: "sg" };
      return { text: T(sel.subjectItem.kr), person: sel.subjectItem.person || 3, number: sel.subjectItem.number || "sg" };
    }
    function enPlace(word, verbItem) {
      var verbVi = verbItem ? verbItem.vi : null;
      if (verbVi === "đi" || verbVi === "đến" || verbVi === "về") return "to " + word;
      return "at " + word;
    }
    // Object/complement nouns in the data already carry their article ("a student"), so an
    // attributive adjective has to be spliced in AFTER the article ("a pretty student"), not
    // prepended in front of it ("pretty a student").
    function enInsertAdj(phrase, adj) {
      var m = /^(a|an|the)\s+/i.exec(phrase);
      if (m) return phrase.slice(0, m[0].length) + adj + " " + phrase.slice(m[0].length);
      return adj + " " + phrase;
    }
    function capitalizeWords(arr) {
      if (!arr.length) return arr;
      var out = arr.slice();
      out[0] = capitalizeFirst(out[0]);
      return out;
    }
    function assembleEn(sel) {
      var core = buildViCore(sel);
      if (core.mode === "incomplete") return { viTokens: [], viText: "", krText: "", notes: [sbNote(SB_NOTE_COPULA_INCOMPLETE)], incomplete: true };
      if (core.mode === "no-predicate") return { viTokens: [], viText: "", krText: "", notes: [sbNote(SB_NOTE_NO_PREDICATE)], incomplete: true };
      var viTokens = buildGlossTokens(core, sel, EN_M);
      var notes = coreNotes(core);
      var V = viMap(core);
      var whKey = core.whKey;
      // Choosing "hãy" as the aux inherently means "make this a command" regardless of the
      // sentence-type dropdown, mirroring assemble()'s own auxIsHay handling for Korean.
      var stype = (sel.auxItem && sel.auxItem.type === "hay") ? "imperative" : sel.stype;
      var chips = [];
      function push(key, vi, kr) { if (kr) chips.push({ key: key, vi: vi || "", kr: kr }); }

      if (core.mode === "thenao") {
        var pnT = enSubjInfo(sel, null);
        var subjEn = sel.subjectItem ? T(sel.subjectItem.kr) : "";
        if (core.adjOnSubj) subjEn = T(sel.adjectiveItem.kr) + " " + subjEn;
        if (sel.connective) push("connective", V.connective, T(sel.connective.kr) + ",");
        push("marker2a", "", "how");
        push("marker2b", "", enBe(pnT.person, pnT.number, false));
        if (subjEn) push("subject", V.subject, subjEn);
        var krText0 = capitalizeWords(chips.map(function (c) { return c.kr; })).join(" ") + "?";
        return { viTokens: viTokens, viText: core.viText, krText: krText0, notes: notes.concat([sbNote(SB_NOTE_THENAO)]), orderChips: chips };
      }

      var effTime = whKey === "khinao" ? "when" : (sel.timeItem ? T(sel.timeItem.kr) : null);
      var effPlace = whKey === "dau" ? "where" : (sel.placeItem ? enPlace(T(sel.placeItem.kr), sel.verbItem) : null);

      if (core.mode === "no-verb") {
        var pn = enSubjInfo(sel, whKey);
        var adjEn = T(sel.adjectiveItem.kr);
        var isNegN = stype === "negative";
        var beForm = enBe(pn.person, pn.number, false);
        // Every wh-question (except "ai"/who, which is itself the subject and needs no
        // inversion) fronts the be-verb, same as a plain yes/no question.
        var needsInversion = stype === "yesno" || (stype === "wh" && whKey !== "ai");

        if (sel.connective) push("connective", V.connective, T(sel.connective.kr) + ",");
        if (whKey === "khinao") push("time", "khi nào", "when");
        else if (effTime) push("time", V.time, effTime + ",");

        if (needsInversion) push("be1", "", beForm);
        if (whKey === "dau") push("wh", "đâu", "where");
        else if (whKey === "taisao") push("taisao", V.taisao, "why");
        if (whKey === "ai") push("subject", "Ai", "who");
        else if (pn.text) push("subject", V.subject, pn.text);
        if (!needsInversion) push("be2", "", beForm);
        if (isNegN) push("neg", "không", "not");
        push("adjective", V.adjective, adjEn);
        if (V.preposition) push("preposition", V.preposition, T(sel.prepositionItem.kr));
        if (V.manner) push("manner", V.manner, T(sel.mannerItem.kr));
        if (effPlace && whKey !== "dau") push("place", V.place, effPlace);
        var punctN = (stype === "yesno" || stype === "wh") ? "?" : ".";
        var krTextN = capitalizeWords(chips.map(function (c) { return c.kr; })).join(" ") + punctN;
        return { viTokens: viTokens, viText: core.viText, krText: krTextN, notes: notes, orderChips: chips };
      }

      // main (verb) branch
      var hasObject = core.hasObject, giFallback = core.giFallback, giFallbackCopula = core.giFallbackCopula;
      var attachTarget = core.attachTarget;
      var isCopula = sel.isCopula;
      var auxItem = sel.auxItem, auxType = auxItem ? auxItem.type : null;
      var pn2 = enSubjInfo(sel, whKey);
      var verbItem = sel.verbItem;
      var baseVerb = giFallback ? "do" : (verbItem ? T(verbItem.kr) : "");
      var v3sg = giFallback ? "does" : (verbItem && verbItem.en_3sg ? verbItem.en_3sg : enAgree3sg(baseVerb));
      var vPast = giFallback ? "did" : (verbItem && verbItem.en_past ? verbItem.en_past : baseVerb);
      var vIng = giFallback ? "doing" : (verbItem && verbItem.en_ing ? verbItem.en_ing : baseVerb + "ing");
      var wantLike3sg = auxItem && (auxType === "want" || auxType === "need" || auxType === "like") && pn2.person === 3 && pn2.number === "sg";
      var auxWord = auxItem ? T(auxItem.kr) : null;
      if (wantLike3sg && auxWord) auxWord = auxWord.replace(/^(\S+)/, function (w) { return enAgree3sg(w); });

      // English fronts a "what" wh-word for question inversion, so when the object/noun slot
      // is overridden to "what" it's shown ONCE, fronted -- not also in its normal in-situ slot.
      var objDisplay = null, frontedWhat = null;
      if (isCopula) {
        if (giFallbackCopula) frontedWhat = "what";
        else objDisplay = attachTarget === "noun" ? enInsertAdj(T(sel.nounItem.kr), T(sel.adjectiveItem.kr)) : T(sel.nounItem.kr);
      } else if (giFallback) {
        frontedWhat = "what";
      } else if (hasObject) {
        if (whKey === "gi") frontedWhat = (attachTarget === "object" ? T(sel.adjectiveItem.kr) + " " : "") + "what";
        else objDisplay = attachTarget === "object" ? enInsertAdj(T(sel.objectItem.kr), T(sel.adjectiveItem.kr)) : T(sel.objectItem.kr);
      }
      var subjDisplay = whKey === "ai" ? "who" : (pn2.text ? (attachTarget === "subject" ? enInsertAdj(pn2.text, T(sel.adjectiveItem.kr)) : pn2.text) : null);

      var isQFront = (stype === "yesno") || (stype === "wh" && whKey !== "ai") || (stype === "alternative");
      var isNeg = stype === "negative";
      var punct = (stype === "yesno" || stype === "wh" || stype === "alternative") ? "?" : (stype === "imperative" || stype === "propositive") ? "!" : ".";

      // predicate: [auxWordOrFrontWord, verbForm] decided per aux type / negation / agreement
      var frontWord = null; // for question inversion: do/does/did/modal/be
      var predVerb = null;  // the verb's own form (base, unless copula which uses be directly)
      var predAuxTail = null; // trailing aux word placed right before the verb (modals/want-like), not fronted

      // Every chip's kr text below is deliberately left lowercase (even sentence-initial
      // words like "do"/"what"/"why") -- capitalizeWords() capitalizes only whichever chip
      // ends up first once the full word list is assembled, so nothing here needs to guess.
      if (stype === "imperative" || stype === "propositive") {
        // Auxiliary choice is ignored here (mirrors Japanese/Chinese's same simplification) --
        // these two sentence types are rare in combination with an auxiliary in this generator.
        predVerb = isCopula ? "be" : baseVerb;
        frontWord = stype === "imperative" ? "please" : "let's";
      } else if (isCopula) {
        // "not" attaches directly AFTER the be-verb wherever it lands (fronted into a question,
        // or in its normal predicate position) -- unlike a modal/do-support aux, it never
        // precedes the verb, so this bypasses the generic predAuxTail slot entirely.
        var beP = enBe(pn2.person, pn2.number, false) + (isNeg ? " not" : "");
        if (isQFront) frontWord = beP; else predVerb = beP;
      } else if (auxType === "must" || auxType === "should" || auxType === "will") {
        if (isQFront) frontWord = auxWord; else predAuxTail = auxWord;
        if (isNeg) predAuxTail = auxWord + " not";
        predVerb = baseVerb;
      } else if (auxType === "can" || auxType === "cannot") {
        var canWord = auxType === "cannot" ? "cannot" : "can";
        if (isQFront) frontWord = canWord; else predAuxTail = canWord;
        predVerb = baseVerb;
      } else if (auxType === "want" || auxType === "need" || auxType === "like") {
        if (isQFront) { frontWord = enDo(pn2.person, pn2.number, false) + (isNeg ? " not" : ""); predAuxTail = T(auxItem.kr); }
        else if (isNeg) { predAuxTail = enDo(pn2.person, pn2.number, false) + " not " + T(auxItem.kr); }
        else { predAuxTail = wantLike3sg ? auxWord : T(auxItem.kr); }
        predVerb = baseVerb;
      } else if (auxType === "ing") {
        var beI = enBe(pn2.person, pn2.number, false);
        if (isQFront) frontWord = beI; else predAuxTail = beI;
        if (isNeg) predAuxTail = beI + " not";
        predVerb = vIng;
      } else if (auxType === "past") {
        predVerb = giFallback ? "did" : vPast;
        if (isNeg) { predAuxTail = "did not"; predVerb = baseVerb; }
        if (isQFront) { frontWord = "did" + (isNeg ? " not" : ""); predVerb = baseVerb; predAuxTail = null; }
      } else {
        // no aux at all
        if (isQFront) { frontWord = enDo(pn2.person, pn2.number, false) + (isNeg ? " not" : ""); predVerb = baseVerb; }
        else if (isNeg) { predAuxTail = enDo(pn2.person, pn2.number, false) + " not"; predVerb = baseVerb; }
        else { predVerb = (whKey === "ai" || (pn2.person === 3 && pn2.number === "sg")) ? v3sg : baseVerb; }
      }
      if (giFallback) predVerb = frontWord ? "do" : (predVerb === vPast ? "did" : (predVerb === v3sg ? "does" : "do"));

      // ---- assemble the word list in English natural order ----
      if (sel.connective) push("connective", V.connective, T(sel.connective.kr) + ",");
      if (effTime && whKey !== "khinao") push("time", V.time, effTime + ",");
      if (whKey === "khinao") push("time", "khi nào", "when");
      if (whKey === "taisao") push("taisao", V.taisao, "why");
      if (frontedWhat) push("wh", "gì", frontedWhat);
      if (whKey === "dau") push("wh", "đâu", "where");
      if (frontWord) push("front", "", frontWord);
      if (subjDisplay && stype !== "imperative" && stype !== "propositive") push("subject", V.subject, subjDisplay);
      if (predAuxTail && !frontWord) push("aux", V.aux, predAuxTail);
      else if (predAuxTail && frontWord && (auxType === "want" || auxType === "need" || auxType === "like")) push("aux", V.aux, predAuxTail);
      push("verb", V.verb || "làm", predVerb);
      if (objDisplay) push("object", V.object || V.noun, objDisplay);
      if (V.preposition) push("preposition", V.preposition, T(sel.prepositionItem.kr));
      if (V.manner) push("manner", V.manner, T(sel.mannerItem.kr));
      if (effPlace && whKey !== "dau") push("place", V.place, effPlace);
      if (stype === "alternative") push("alt", "hay không", "or not");

      var krTextM = capitalizeWords(chips.map(function (c) { return c.kr; })).join(" ") + punct;
      return { viTokens: viTokens, viText: core.viText, krText: krTextM, notes: notes, orderChips: chips };
    }

    /* ================================== 日本語 ==================================
       Predicate-final (SOV, closest of the three to Korean); mechanical polite-register
       (です/ます) conjugation built from hand-curated masu/te/nai stems; い/な-adjective
       conjugation; auxiliary meaning expressed as a suffix formula on the verb, same
       "formula on a stem" philosophy as the Korean engine's buildCompoundStem. */
    var JA_M = {
      ai: "誰", gi: "何", dau: "どこ", khinao: "いつ", taisao: "なぜ", giVerb: "する", marker2: "どうですか？",
      punctStatement: "。", punctQ: "か？", punctExcl: "！"
    };
    function jaPlaceParticle(verbItem) {
      var verbVi = verbItem ? verbItem.vi : null;
      if (verbVi === "ở" || verbVi === "đi" || verbVi === "đến" || verbVi === "về") return "に";
      return "で";
    }
    // Polite ます-form tense/negation table shared by the plain (no-aux) case and by every aux
    // whose meaning collapses to "ます-conjugate the base verb" (ing/need/like/must/can layer
    // their own fixed phrase on top instead -- see jaPredicate below).
    function jaMasuForm(masuStem, negate, past) {
      if (negate) return masuStem + (past ? "ませんでした" : "ません");
      return masuStem + (past ? "ました" : "ます");
    }
    // て/で always correspond 1:1 to た/だ in plain-past (standard Japanese conjugation), so
    // the た-form "should" needs (食べたほうがいい, not the て-form 食べて) is derived from the
    // curated te-form rather than needing its own hand-curated field.
    function jaTaForm(te) {
      var last = te.charAt(te.length - 1);
      if (last === "で") return te.slice(0, -1) + "だ";
      if (last === "て") return te.slice(0, -1) + "た";
      return te;
    }
    function jaPredicate(verbItem, auxItem, negate, past) {
      var masu = verbItem.ja_masu, te = verbItem.ja_te, nai = verbItem.ja_nai;
      var hasStems = !!masu; // custom verbs (no ja_masu curated) fall back to an uninflected gloss
      var type = auxItem ? auxItem.type : null;
      if (!hasStems) return T(verbItem.kr) + (negate ? "ではない" : "") + (past ? "（過去）" : "");
      if (!type || type === "past") return jaMasuForm(masu, negate, past || type === "past");
      switch (type) {
        case "want":
          return masu + (negate ? (past ? "たくなかったです" : "たくないです") : (past ? "たかったです" : "たいです"));
        case "must":
          return negate ? (nai + (past ? "なくてもよかったです" : "なくてもいいです")) : (nai + (past ? "なければなりませんでした" : "なければなりません"));
        case "can":
          return jaDictForm(verbItem) + (negate ? (past ? "ことができませんでした" : "ことができません") : (past ? "ことができました" : "ことができます"));
        case "cannot":
          return jaDictForm(verbItem) + (past ? "ことができませんでした" : "ことができません");
        case "should":
          return negate ? (nai + "ほうがいいです") : (jaTaForm(te) + "ほうがいいです");
        case "will":
          return negate ? (nai + "でしょう") : (jaDictForm(verbItem) + "でしょう");
        case "ing":
          return te + (negate ? (past ? "いませんでした" : "いません") : (past ? "いました" : "います"));
        case "need":
          return jaDictForm(verbItem) + (negate ? (past ? "必要はありませんでした" : "必要はありません") : (past ? "必要がありました" : "必要があります"));
        case "like":
          return jaDictForm(verbItem) + (negate ? (past ? "のが好きではありませんでした" : "のが好きではありません") : (past ? "のが好きでした" : "のが好きです"));
        default:
          return jaMasuForm(masu, negate, past);
      }
    }
    // ます-stem + る is only exact for a handful of verbs, so the dictionary form is instead
    // read straight from the "kr"-independent Vietnamese-keyed data via T() against 'ja' --
    // i.e. just the word bank's own ja gloss, which was hand-written as the dictionary form.
    function jaDictForm(verbItem) { return T(verbItem.kr); }
    function jaAdjPredicate(adjItem, negate, past) {
      var kr = T(adjItem.kr);
      if (adjItem.ja_type === "na") {
        var naStem = adjItem.ja_attr ? adjItem.ja_attr.slice(0, -1) : kr; // strip attributive's trailing な
        if (negate) return naStem + (past ? "ではありませんでした" : "ではありません");
        return naStem + (past ? "でした" : "です");
      }
      // i-adjective (kr itself IS the dictionary form, e.g. "おいしい"); irregular いい uses a
      // separate よ- stem (ja_neg_stem) for every conjugated form, per the curated data.
      var stem = adjItem.ja_neg_stem || kr.slice(0, -1);
      if (negate) return stem + (past ? "くなかったです" : "くないです");
      return past ? (stem + "かったです") : (kr + "です");
    }
    function jaAttr(adjItem) { return adjItem.ja_attr || T(adjItem.kr); }
    function assembleJa(sel) {
      var core = buildViCore(sel);
      if (core.mode === "incomplete") return { viTokens: [], viText: "", krText: "", notes: [sbNote(SB_NOTE_COPULA_INCOMPLETE)], incomplete: true };
      if (core.mode === "no-predicate") return { viTokens: [], viText: "", krText: "", notes: [sbNote(SB_NOTE_NO_PREDICATE)], incomplete: true };
      var viTokens = buildGlossTokens(core, sel, JA_M);
      var notes = coreNotes(core);
      var V = viMap(core);
      var whKey = core.whKey;
      // Choosing "hãy" as the aux inherently means "make this a command" regardless of the
      // sentence-type dropdown, mirroring assemble()'s own auxIsHay handling for Korean.
      var stype = (sel.auxItem && sel.auxItem.type === "hay") ? "imperative" : sel.stype;
      var chips = [];

      if (core.mode === "thenao") {
        var subjJa = sel.subjectItem ? T(sel.subjectItem.kr) : "";
        if (core.adjOnSubj) subjJa = jaAttr(sel.adjectiveItem) + subjJa;
        if (sel.connective) chips.push({ key: "connective", vi: V.connective, kr: T(sel.connective.kr) + "、" });
        if (sel.subjectItem) chips.push({ key: "subject", vi: V.subject, kr: subjJa + "は" });
        chips.push({ key: "marker2", vi: "thế nào?", kr: JA_M.marker2 });
        notes.push(sbNote(SB_NOTE_THENAO));
        var krText0 = chips.map(function (c) { return c.kr; }).join("");
        return { viTokens: viTokens, viText: core.viText, krText: krText0, notes: notes, orderChips: chips };
      }

      var effTimeKr = whKey === "khinao" ? JA_M.khinao : (sel.timeItem ? T(sel.timeItem.kr) : null);
      var effPlaceWord = whKey === "dau" ? JA_M.dau : (sel.placeItem ? T(sel.placeItem.kr) : null);

      if (core.mode === "no-verb") {
        var negate = stype === "negative";
        var past = false;
        var pred = jaAdjPredicate(sel.adjectiveItem, negate, past);
        var punctBase = JA_M.punctStatement;
        var extra = "";
        if (stype === "yesno") { punctBase = JA_M.punctQ; }
        else if (stype === "wh") { punctBase = JA_M.punctQ; }
        else if (stype === "imperative") {
          // Adjectives have no real imperative in Japanese ("be delicious!" isn't a command);
          // the nearest natural mechanical equivalent is "make it ADJ" -- く/にしてください.
          pred = sel.adjectiveItem.ja_type === "na"
            ? (sel.adjectiveItem.ja_attr ? sel.adjectiveItem.ja_attr.slice(0, -1) : T(sel.adjectiveItem.kr)) + "にしてください"
            : (sel.adjectiveItem.ja_neg_stem || T(sel.adjectiveItem.kr).slice(0, -1)) + "くしてください";
          punctBase = "。";
        }
        else if (stype === "propositive") { pred = jaAdjPredicate(sel.adjectiveItem, false, false); punctBase = "ね。"; }
        else if (stype === "alternative") { punctBase = "それとも違いますか" + JA_M.punctQ; }
        var placeParticle = jaPlaceParticle(null);

        if (sel.connective) chips.push({ key: "connective", vi: V.connective, kr: T(sel.connective.kr) + "、" });
        if (effTimeKr) chips.push({ key: "time", vi: V.time, kr: effTimeKr });
        if (whKey === "taisao") chips.push({ key: "taisao", vi: V.taisao, kr: JA_M.taisao });
        if (whKey === "ai") chips.push({ key: "subject", vi: "Ai", kr: JA_M.ai + "が" });
        else if (sel.subjectItem) chips.push({ key: "subject", vi: V.subject, kr: T(sel.subjectItem.kr) + "が" });
        if (effPlaceWord) chips.push({ key: "place", vi: V.place, kr: effPlaceWord + placeParticle });
        if (V.preposition) chips.push({ key: "preposition", vi: V.preposition, kr: T(sel.prepositionItem.kr) });
        if (V.manner) chips.push({ key: "manner", vi: V.manner, kr: T(sel.mannerItem.kr) });
        chips.push({ key: "adjective", vi: V.adjective, kr: pred });

        var krText1 = chips.map(function (c) { return c.kr; }).join("") + punctBase;
        return { viTokens: viTokens, viText: core.viText, krText: krText1, notes: notes, orderChips: chips };
      }

      // main branch
      var hasObject = core.hasObject, giFallback = core.giFallback, giFallbackCopula = core.giFallbackCopula;
      var attachTarget = core.attachTarget;
      var isCopula = sel.isCopula;
      var negate = stype === "negative";
      var isQ = stype === "yesno" || stype === "wh" || stype === "alternative";
      var punct = isQ ? JA_M.punctQ : (stype === "imperative" || stype === "propositive") ? "！" : "。";

      var pred;
      if (stype === "imperative") pred = giFallback ? "してください" : (sel.verbItem.ja_te || T(sel.verbItem.kr)) + "ください";
      else if (stype === "propositive") pred = giFallback ? "しましょう" : (sel.verbItem.ja_masu || T(sel.verbItem.kr)) + "ましょう";
      else if (isCopula) pred = negate ? "ではありません" : "です";
      else if (giFallback) pred = jaMasuForm("し", negate, false);
      else pred = jaPredicate(sel.verbItem, sel.auxItem, negate, false);

      var subjDisplay = whKey === "ai" ? JA_M.ai + "が" : (sel.subjectItem ? ((attachTarget === "subject" ? jaAttr(sel.adjectiveItem) : "") + T(sel.subjectItem.kr) + "は") : null);
      var objDisplay = null;
      // "ではありません" already carries its own は (part of the fixed negation phrase) --
      // the noun itself never takes a separate one, so this stays the same for aff/neg.
      if (isCopula && !giFallbackCopula) objDisplay = (attachTarget === "noun" ? jaAttr(sel.adjectiveItem) : "") + T(sel.nounItem.kr);
      else if (hasObject) {
        var objJa = whKey === "gi" ? JA_M.gi : T(sel.objectItem.kr);
        objDisplay = (attachTarget === "object" ? jaAttr(sel.adjectiveItem) : "") + objJa + "を";
      }
      var placeDisplay = effPlaceWord ? effPlaceWord + jaPlaceParticle(sel.verbItem) : null;

      if (sel.connective) chips.push({ key: "connective", vi: V.connective, kr: T(sel.connective.kr) + "、" });
      if (effTimeKr) chips.push({ key: "time", vi: V.time, kr: effTimeKr });
      if (whKey === "taisao") chips.push({ key: "taisao", vi: V.taisao, kr: JA_M.taisao });
      if (subjDisplay) chips.push({ key: "subject", vi: V.subject, kr: subjDisplay });
      if (placeDisplay) chips.push({ key: "place", vi: V.place, kr: placeDisplay });
      if (V.preposition) chips.push({ key: "preposition", vi: V.preposition, kr: T(sel.prepositionItem.kr) });
      if (V.manner) chips.push({ key: "manner", vi: V.manner, kr: T(sel.mannerItem.kr) });
      if (giFallback) chips.push({ key: "object", vi: "gì", kr: JA_M.gi + "を" });
      else if (objDisplay) chips.push({ key: isCopula ? "noun" : "object", vi: V.noun || V.object, kr: objDisplay });
      chips.push({ key: "verb", vi: V.verb, kr: pred });
      // trailing punct below already supplies "か？"; this chip only adds the "or not" phrase.
      if (stype === "alternative") chips.push({ key: "alt", vi: "hay không", kr: "それとも違います" });

      var krText2 = chips.map(function (c) { return c.kr; }).join("") + punct;
      return { viTokens: viTokens, viText: core.viText, krText: krText2, notes: notes, orderChips: chips };
    }

    /* ---- Korean-order chip sequence (for the "before" animation state) ---- */
    function koreanOrderChips(sel, result) {
      var chips = [];
      var whKey = sel.wh ? sel.wh.key : null;
      var hasObject = sel.verbKind === "trans" && !!sel.objectItem && whKey !== "thenao";
      var hasNounComp = sel.isCopula && !!sel.nounItem && whKey !== "thenao";
      var giFallbackCopula = whKey === "gi" && sel.isCopula && !sel.nounItem;
      var effPlace = sel.placeItem ? placeWithVerb(sel.placeItem, sel.verbItem) : null;
      if (sel.connective) chips.push({ key: "connective", vi: sel.connective.vi, kr: T(sel.connective.kr) });
      if (whKey === "taisao") chips.push({ key: "taisao", vi: "Tại sao", kr: "왜" });
      if (whKey === "khinao") chips.push({ key: "time", vi: "khi nào", kr: "언제" });
      else if (sel.timeItem && whKey !== "thenao") chips.push({ key: "time", vi: sel.timeItem.vi, kr: T(sel.timeItem.kr) });
      if (whKey === "dau") chips.push({ key: "place", vi: placeWithVerb({ vi: "đâu", kr: "어디" }, sel.verbItem).vi, kr: placeWithVerb({ vi: "đâu", kr: "어디" }, sel.verbItem).kr });
      else if (effPlace && whKey !== "thenao") chips.push({ key: "place", vi: effPlace.vi, kr: T(effPlace.kr) });
      var subjectOnly = whKey === "ai" ? { vi: "Ai", kr: "누가" } : (sel.subjectItem ? { vi: sel.subjectItem.vi, kr: T(sel.subjectItem.kr) } : null);
      var adjOnSubject = sel.adjectiveItem && !hasObject && !hasNounComp && sel.subjectItem && sel.subjectKind === "noun" && whKey !== "ai" && !!sel.verbItem;
      if (adjOnSubject) chips.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
      if (subjectOnly) chips.push({ key: "subject", vi: subjectOnly.vi, kr: T(subjectOnly.kr) });
      if (whKey === "thenao") { chips.push({ key: "marker2", vi: "thế nào?", kr: "어때(요)?" }); return chips; }
      if (sel.isCopula && !sel.nounItem && whKey !== "gi") return chips; // incomplete -- nothing further to show
      if (!sel.verbItem) {
        // No verb: the adjective itself is the predicate (Vietnamese needs no "be" verb
        // before an adjective), so it takes the "verb" slot at the end of the Korean order.
        if (sel.prepositionItem) chips.push({ key: "preposition", vi: sel.prepositionItem.vi, kr: T(sel.prepositionItem.kr) });
        if (sel.mannerItem) chips.push({ key: "manner", vi: sel.mannerItem.vi, kr: T(sel.mannerItem.kr) });
        if (sel.auxItem) chips.push({ key: "aux", vi: sel.auxItem.vi, kr: T(sel.auxItem.kr) });
        if (sel.adjectiveItem) chips.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
        return chips;
      }
      if (hasObject && whKey !== "gi") {
        if (sel.adjectiveItem) chips.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
        chips.push({ key: "object", vi: sel.objectItem.vi, kr: T(sel.objectItem.kr) });
      } else if (whKey === "gi" && hasObject) {
        chips.push({ key: "object", vi: "gì", kr: "무엇" });
      } else if (hasNounComp) {
        if (sel.adjectiveItem) chips.push({ key: "adjective", vi: sel.adjectiveItem.vi, kr: T(sel.adjectiveItem.kr) });
        chips.push({ key: "noun", vi: sel.nounItem.vi, kr: T(sel.nounItem.kr) });
      } else if (giFallbackCopula) {
        chips.push({ key: "noun", vi: "gì", kr: "무엇" });
      }
      if (sel.prepositionItem && whKey !== "thenao") chips.push({ key: "preposition", vi: sel.prepositionItem.vi, kr: T(sel.prepositionItem.kr) });
      if (sel.mannerItem && whKey !== "thenao") chips.push({ key: "manner", vi: sel.mannerItem.vi, kr: T(sel.mannerItem.kr) });
      if (sel.auxItem && !(whKey === "gi" && !hasObject && !sel.isCopula)) chips.push({ key: "aux", vi: sel.auxItem.vi, kr: T(sel.auxItem.kr) });
      if (whKey === "gi" && !hasObject && !sel.isCopula) {
        chips.push({ key: "object", vi: "gì", kr: "무엇" });
        chips.push({ key: "verb", vi: "làm", kr: "하다" });
      } else {
        chips.push({ key: "verb", vi: sel.verbItem.vi, kr: T(sel.verbItem.kr) });
      }
      return chips;
    }
    function vietnameseOrderChips(result) {
      // reuse the already-computed final token order, minus the sentence-type marker chips
      // (those appear only in the Vietnamese order, so let them fade in rather than fly in)
      return result.viTokens.map(function (t) { return { key: t.key, vi: t.vi, kr: T(t.kr) }; });
    }

    /* ---- FLIP-style reorder animation ---- */
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function renderChips(container, chips) {
      container.innerHTML = "";
      chips.forEach(function (c) {
        var el = document.createElement("div");
        el.className = "sb-chip" + (["neg", "q1", "q2", "imp1", "imp2", "prop1", "prop2", "alt", "marker2"].indexOf(c.key) >= 0 ? " marker" : "");
        el.dataset.key = c.key;
        el.innerHTML = '<div class="sb-chip-vi vn">' + escapeHtml(c.vi) + '</div><div class="sb-chip-kr">' + escapeHtml(T(c.kr)) + "</div>";
        container.appendChild(el);
      });
    }
    function flipToChips(container, newChips) {
      var firstRects = {};
      container.querySelectorAll(".sb-chip").forEach(function (el) { firstRects[el.dataset.key] = el.getBoundingClientRect(); });
      renderChips(container, newChips);
      if (reduceMotion) return;
      container.querySelectorAll(".sb-chip").forEach(function (el) {
        var first = firstRects[el.dataset.key];
        if (!first) {
          el.style.opacity = "0";
          requestAnimationFrame(function () { el.style.transition = "opacity .4s ease"; el.style.opacity = "1"; });
          return;
        }
        var last = el.getBoundingClientRect();
        var dx = first.left - last.left, dy = first.top - last.top;
        el.style.transition = "none";
        el.style.transform = "translate(" + dx + "px," + dy + "px)";
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.transition = "transform .55s cubic-bezier(.22,.85,.25,1)";
            el.style.transform = "translate(0,0)";
          });
        });
      });
    }

    function renderResult(sel, result) {
      var html = '<div class="sb-result-card">';
      html += '<div class="sb-result-vi">' + escapeHtml(result.viText) +
        '<button class="speak-btn" data-speak="' + escapeAttr(result.viText.replace(/[.?!,]/g, "")) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + "</button></div>";
      html += '<div class="sb-gloss-title">' + TU("단어별 뜻") + '</div>';
      var pairs = result.viTokens.map(function (t) { return [t.vi, T(t.kr)]; });
      html += '<div class="gr-align-row">' + pairs.map(function (p) {
        return '<div class="gr-align-col"><div class="gr-align-vi vn">' + escapeHtml(p[0]) + '</div><div class="gr-align-kr">' + escapeHtml(p[1]) + "</div></div>";
      }).join("") + "</div>";
      html += '<div class="sb-result-kr">' + TU("문장 뜻: ") + '<span>' + escapeHtml(result.krText) + '</span>' +
        '<button type="button" class="speak-btn speak-meaning-btn" data-speak-meaning="' + escapeAttr(result.krText) + '" aria-label="' + TU("발음 듣기") + '">' + speakIcon() + "</button></div>";
      if (result.notes.length) html += '<div class="sb-notes">' + result.notes.map(escapeHtml).join("<br>") + "</div>";
      html += "</div>";
      resultEl.innerHTML = html;
      resultEl.querySelectorAll(".speak-btn").forEach(function (b) {
        b.addEventListener("click", function () {
          if (b.dataset.speakMeaning) speakMeaning(b.dataset.speakMeaning);
          else speak(b.dataset.speak);
        });
      });
    }

    document.getElementById("sb-generate").addEventListener("click", function () {
      var sel = parseSelection();
      // assemble()/koreanOrderChips() (Korean grammar engine) stay untouched and only ever run
      // in Korean mode; assembleZh/En/Ja are the new independent engines for the other three.
      var result = currentLang === "zh" ? assembleZh(sel) : currentLang === "en" ? assembleEn(sel) : currentLang === "ja" ? assembleJa(sel) : assemble(sel);

      if (result.incomplete) {
        resultEl.innerHTML = '<div class="sb-result-card"><div class="sb-notes">' + result.notes.map(escapeHtml).join("<br>") + "</div></div>";
        return;
      }

      var krChips = currentLang === "ko" ? koreanOrderChips(sel, result) : result.orderChips;
      var viChips = vietnameseOrderChips(result);

      resultEl.innerHTML = '<div class="sb-stage-label" id="sb-stage-label">1️⃣ ' + TU("한국어라면 이 순서예요") + '</div><div class="sb-assembly" id="sb-assembly"></div>';
      var assemblyEl = document.getElementById("sb-assembly");
      renderChips(assemblyEl, krChips);

      var delay = reduceMotion ? 0 : 900;
      setTimeout(function () {
        var label = document.getElementById("sb-stage-label");
        if (label) label.textContent = "2️⃣ " + TU("베트남어는 이 순서로 이동해요!");
        flipToChips(assemblyEl, viChips);
        setTimeout(function () {
          renderResult(sel, result);
          speak(result.viText.replace(/[.?!,]/g, ""));
        }, reduceMotion ? 0 : 650);
      }, delay);
    });
  })();

  /* ================= GRAMMAR SUBTAB TOGGLE ================= */
  (function () {
    var panes = {
      pdf: document.getElementById("grammar-pdf-panel"),
      lessons: document.getElementById("grammar-lessons-panel"),
      builder: document.getElementById("grammar-builder-panel"),
      sentences: document.getElementById("grammar-sentences-panel"),
      special: document.getElementById("grammar-special-panel"),
    };
    var btns = document.querySelectorAll(".subtab-btn[data-grammar]");
    if (!btns.length) return;
    var activeBtn = Array.from(btns).find(function (b) { return b.getAttribute("aria-selected") === "true"; });
    if (!activeBtn && btns.length) {
      activeBtn = btns[0];
      activeBtn.setAttribute("aria-selected", "true");
    }
    if (activeBtn) {
      Object.keys(panes).forEach(function (k) { if (panes[k]) panes[k].style.display = k === activeBtn.dataset.grammar ? "" : "none"; });
    }
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        btn.setAttribute("aria-selected", "true");
        Object.keys(panes).forEach(function (k) { if (panes[k]) panes[k].style.display = k === btn.dataset.grammar ? "" : "none"; });
        if (btn.dataset.grammar === "pdf") renderGeneralPdf();
      });
    });
    renderCurrSentences();
    renderCurrGrammar();
    var grammarSearch = document.getElementById("curr-grammar-search");
    if (grammarSearch) grammarSearch.addEventListener("input", renderCurrGrammar);
  })();

  // Several panels are built once (or once per state change) into innerHTML rather than
  // re-reading a data-i18n attribute on every render, so a language switch needs to explicitly
  // re-run them or their TU()/T()-wrapped text would keep showing whatever language was active
  // when they last rendered. applyStaticI18n (registered above) only covers template.html's
  // static markup -- this covers every dynamically-built panel whose content is now
  // translated (all of these re-render into an innerHTML root/pane they fully own, so
  // re-running them on language switch is safe -- no duplicate-listener risk).
  onLangChange(function () {
    if (currentCase) renderResult();
    renderPeopleSummary();
    renderRefTable();
    renderFamilyTree();
    renderVocab();
    renderBibleBooks();
    renderBibleNumbers();
    renderBibleTime();
    renderBibleDays();
    renderBibleMonths();
    renderGrammar();
    renderPron();
    renderCurrWeek16();
    renderCurrCulture();
    renderCurrSongs();
    renderCurrPrayer();
    renderCurrGuide();
    renderCurrSentences();
    renderCurrGrammar();
  });

  // Fires the actual re-render for a restored [대화] 탭 state (see restorePeopleState() /
  // hadSavedPeopleState above) only now, at the very end of the script, once every `var` in
  // this file has been assigned its real value -- renderResult() reaches deep into code
  // (chungTaCompound() and friends) that depends on vars declared well after where the restore
  // itself runs.
  if (hadSavedPeopleState) {
    currentStageIdx = 0;
    regionNote();
    renderResult();
    updateCompanionTermNote();
    updateCompanionNoteInPlace();
    renderCurrTalks();
    renderCurrLpd();
    renderCurrNeighbor();
    renderCurrLff();
  }

  /* -------- 마지막 방문 위치 복원 (탭, 서브탭, 스크롤 위치) -------- */
  (function restoreLastPlace() {
    try {
      if (!window.localStorage) return;
      var raw = window.localStorage.getItem(LAST_PLACE_STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (!saved) return;
      if (saved.subtabs) {
        if (saved.subtabs.pron === "alphabet" || saved.subtabs.pron === "vowels" || saved.subtabs.pron === "consonants") {
          saved.subtabs.pron = "jamo";
        }
        if (saved.subtabs.pron === "tonepairs") {
          saved.subtabs.pron = "tones";
        }
        if (saved.subtabs.curriculum === "culture") {
          saved.subtabs.wizard = "culture";
        }
        if (saved.subtabs.curriculum === "song") {
          saved.subtabs.sentence = "song";
        }
        if (saved.subtabs.curriculum === "prayer") {
          saved.subtabs.sentence = "prayer";
        }
        if (saved.subtabs.curriculum === "guide") {
          saved.subtabs.pron = "settings";
        }
        lastPlaceState.subtabs = saved.subtabs;
        ["wizard", "curriculum", "vocab", "sentence", "pron", "bible", "grammar", "review"].forEach(function (group) {
          var val = saved.subtabs[group];
          if (!val) return;
          var btn = document.querySelector('.subtab-btn[data-' + group + '="' + val + '"]');
          if (btn) {
            btn.click();
          }
        });
      }
      if (saved.tab && panels[saved.tab]) {
        activateTab(saved.tab, false);
      }
      if (typeof saved.scrollY === "number" && saved.scrollY > 0) {
        setTimeout(function () {
          window.scrollTo({ top: saved.scrollY, behavior: "instant" in window ? "instant" : "auto" });
        }, 150);
      }
    } catch (e) { /* no-op */ }
  })();

/* BEGIN REGIONAL-HYDRATION (removed from GENERAL/JW builds by assemble_app.py) */
  /* ================= REGIONAL SCHEDULE & CURRICULUM SWR HYDRATION =================
     Static build data renders first; if the regional worker answers, its applied plan (dates, sessions, mapping) and
     the live source curriculum replace it and the section is re-rendered. Failure/absence changes nothing. */
  if (typeof window !== "undefined" && typeof fetch !== "undefined" && typeof REGIONAL_SCHEDULE !== "undefined" &&
      (window.SITE_PROFILE === "jeonju" || window.SITE_PROFILE === "ulsan")) {
    var regionalHost = window.location && window.location.hostname;
    var regionalStaticLocal = regionalHost === "127.0.0.1" || regionalHost === "localhost";
    if (!regionalStaticLocal) {
      fetch("/api/regional/curriculum", { credentials: "omit" })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (data && data.config && data.source && Array.isArray(data.source.units)) {
            regionalLive = regionalMergeLive(data);
            renderCurrWeek16();
          }
        })
        .catch(function () {});
    }
  }
/* END REGIONAL-HYDRATION */

})();
