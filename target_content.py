# -*- coding: utf-8 -*-
"""Data for the target-language engine (site_profiles.SITES entries with engine "target").

Every text shipped here is copied from an existing row-aligned source (see
site_profiles.TARGET_CONTENT_SOURCES). Nothing is translated or generated: a row without text in
the target language is dropped, and a row without text in some UI language simply has no
translation in that language (the runtime shows none rather than falling back to another one).

The only new text in this module is UI text (TARGET_UI_TEXT) and the target-language names used
by the voice settings; neither is learning content.
"""
import json

from site_profiles import (SITES, TARGET_LANGUAGES, TARGET_LANGUAGE_NAMES, TARGET_CONTENT_SOURCES,
                           TARGET_SOURCE_REQUIRED, UI_LANGS)

# Rows of each Excel unit shown in the unit's card header (e.g. "LESSON 01" + lesson title, or the
# Watchtower week's date line); the remaining rows are the unit body.
HEADER_ROWS = {"elf": 2, "lpd": 2, "wt": 1}


def _texts(row, langs=UI_LANGS):
    """{lang: text} with only the languages that have text (row alignment is kept by the caller)."""
    out = {}
    for lang in langs:
        value = row.get(lang)
        if isinstance(value, str) and value.strip():
            out[lang] = value.strip()
    return out


def _excel_units(source_id, data, field):
    units = []
    header_n = HEADER_ROWS[source_id]
    for unit in data["units"]:
        rows = [_texts(r) for r in unit["rows"]]
        head = [r for r in rows[:header_n] if r]
        body = [r for r in rows[header_n:] if field in r]
        if not body:
            continue
        units.append({"id": "%s-%s" % (source_id, unit["id"]), "head": head, "rows": body})
    return units


def _song_units(songs, field):
    units = []
    for song in songs:
        rows = [_texts(line) for line in song.get("lines") or []]
        scripture = _texts(song.get("scripture") or {})
        body = ([scripture] if field in scripture else []) + [r for r in rows if field in r]
        if not body:
            continue
        head = [h for h in (_texts(song.get("labels") or {}), _texts(song.get("title") or {})) if h]
        units.append({"id": "songs-%s" % song["number"], "head": head, "rows": body})
    return units


def _neighbor_units(conversations, field):
    units = []
    for conv in conversations:
        body = []
        for line in conv.get("lines") or []:
            texts = _texts(line)
            if field in texts:
                body.append(dict(texts, who=line.get("who")))
        if not body:
            continue
        units.append({"id": "neighbor-%s" % conv["id"], "head": [_texts(conv.get("title") or {})], "rows": body})
    return units


def build_target_corpus(site, sources):
    """sources: {"elf": ENJOY_LIFE_FOREVER-shaped, "lpd": ..., "wt": ..., "songs": [...],
    "neighbor": [...]} -- the same objects the Vietnamese profiles ship."""
    meta = SITES[site]
    field = TARGET_LANGUAGES[meta["target_language"]]["scripts"][meta["target_script"]]["field"]
    corpus = []
    for source_id in meta["content_sources"]:
        if TARGET_CONTENT_SOURCES[source_id]["family"] != meta["family"]:
            raise SystemExit("[%s] source %r belongs to another site family" % (site, source_id))
        if source_id in HEADER_ROWS:
            units = _excel_units(source_id, sources[source_id], field)
        elif source_id == "songs":
            units = _song_units(sources["songs"], field)
        elif source_id == "neighbor":
            units = _neighbor_units(sources["neighbor"], field)
        else:
            raise SystemExit("[%s] no builder for content source %r" % (site, source_id))
        corpus.append({"id": source_id, "provenance": TARGET_CONTENT_SOURCES[source_id]["provenance"],
                       "units": units})
    return corpus


def corpus_counts(corpus):
    return {src["id"]: {"units": len(src["units"]), "rows": sum(len(u["rows"]) for u in src["units"])}
            for src in corpus}


def build_target_site(site, corpus):
    meta = SITES[site]
    lang = TARGET_LANGUAGES[meta["target_language"]]
    script = lang["scripts"][meta["target_script"]]
    return {
        "site": site,
        "family": meta["family"],
        "lang": meta["target_language"],
        "script": meta["target_script"],
        "field": script["field"],
        "tts": script["tts"],
        # Other scripts of the same language (zh: Hans) -- parallel text, shown under the target line
        # only in the UI language that reads that script.
        "altFields": [s["field"] for k, s in lang["scripts"].items() if k != meta["target_script"]],
        "tokenizer": lang["tokenizer"],
        "names": TARGET_LANGUAGE_NAMES[meta["target_language"]],
        "features": meta["features"],
        "sources": [src["id"] for src in corpus],
        "counts": corpus_counts(corpus),
        "sourceRequired": TARGET_SOURCE_REQUIRED + ([] if corpus else ["reader", "review"]),
    }


def build_target_tts_guide(site, tts_guide, order):
    """The device cards of the shared TTS guide, with the language list switched from Vietnamese to
    this site's target language. The Vietnamese-specific intro and the notes that name a Vietnamese
    voice are left out (they would be wrong here); every step text is the verified original."""
    target = SITES[site]["target_language"]
    out = {}
    for ui, guide in tts_guide.items():
        vi_name = guide["names"][0].split("(")[0].split("（")[0].strip()
        ui_name = guide["names"][1] if len(guide["names"]) > 1 else guide["names"][0]
        target_name = TARGET_LANGUAGE_NAMES[target][ui]
        names = [target_name] if ui == target or (target == "zh" and ui in ("zh", "zh_cn")) else [target_name, ui_name]
        cards = {}
        for card_id, card in guide["cards"].items():
            card = dict(card)
            note = card.get("note") or ""
            if vi_name.casefold() in note.casefold() or "Việt" in note or "Microsoft An" in note:
                card.pop("note", None)
            cards[card_id] = card
        out[ui] = {"title": guide["title"], "names": names, "cards": cards}
    return {"order": order, "langs": out}


# UI text of the target engine, key -> 12 languages ("{lang}" = the target language name in the UI
# language). Existing app keys (TU) are reused where one fits; these are the new ones.
TARGET_UI_TEXT = {
    "reveal": {"vi": "Xem nghĩa", "cs": "Zobrazit význam", "zh_cn": "显示意思", "zh": "顯示意思", "en": "Show meaning",
               "fr": "Voir le sens", "de": "Bedeutung zeigen", "hu": "Jelentés mutatása", "id": "Lihat arti",
               "ja": "意味を見る", "ko": "뜻 보기", "pl": "Pokaż znaczenie"},
    "reveal_target": {"vi": "Xem câu gốc", "cs": "Zobrazit originál", "zh_cn": "显示原文", "zh": "顯示原文",
                      "en": "Show original", "fr": "Voir l'original", "de": "Original zeigen", "hu": "Eredeti mutatása",
                      "id": "Lihat teks asli", "ja": "原文を見る", "ko": "원문 보기", "pl": "Pokaż oryginał"},
    "mode_listen": {"vi": "Nghe câu gốc", "cs": "Poslech originálu", "zh_cn": "听原文", "zh": "聽原文",
                    "en": "Listen to original", "fr": "Écouter l'original", "de": "Original hören", "hu": "Eredeti meghallgatása",
                    "id": "Dengar teks asli", "ja": "原文を聞く", "ko": "원문 듣기", "pl": "Słuchaj oryginału"},
    "mode_recall": {"vi": "Nhớ lại câu gốc", "cs": "Vybavit originál", "zh_cn": "回想原文", "zh": "回想原文",
                    "en": "Recall original", "fr": "Retrouver l'original", "de": "Original abrufen", "hu": "Eredeti felidézése",
                    "id": "Ingat teks asli", "ja": "原文を思い出す", "ko": "원문 떠올리기", "pl": "Przypomnij oryginał"},
    "same_lang": {"vi": "Chế độ ngôn ngữ trùng với ngôn ngữ đang học nên không hiển thị bản dịch.",
                  "cs": "Jazyk rozhraní je stejný jako studovaný jazyk, proto se překlad nezobrazuje.",
                  "zh_cn": "界面语言与学习语言相同，因此不显示译文。", "zh": "介面語言與學習語言相同，因此不顯示譯文。",
                  "en": "The display language is the language you are studying, so no translation is shown.",
                  "fr": "La langue d'affichage est la langue étudiée : aucune traduction n'est affichée.",
                  "de": "Die Anzeigesprache ist die Lernsprache, daher wird keine Übersetzung angezeigt.",
                  "hu": "A megjelenítési nyelv megegyezik a tanult nyelvvel, ezért nincs fordítás.",
                  "id": "Bahasa tampilan sama dengan bahasa yang dipelajari, jadi terjemahan tidak ditampilkan.",
                  "ja": "表示言語が学習中の言語と同じため、訳は表示しません。",
                  "ko": "표시 언어가 학습 언어와 같아서 번역을 표시하지 않아요.",
                  "pl": "Język interfejsu jest taki sam jak język nauki, więc tłumaczenie nie jest wyświetlane."},
    "no_translation": {"vi": "Nguồn không có câu này bằng ngôn ngữ hiện tại.", "cs": "Zdroj tuto větu v aktuálním jazyce nemá.",
                       "zh_cn": "原始资料中没有这句的当前语言版本。", "zh": "原始資料中沒有這句的目前語言版本。",
                       "en": "The source has no text for this line in the current language.",
                       "fr": "La source n'a pas ce passage dans la langue actuelle.",
                       "de": "Die Quelle enthält diese Zeile nicht in der aktuellen Sprache.",
                       "hu": "A forrásban ez a sor nincs meg az aktuális nyelven.",
                       "id": "Sumber tidak memiliki baris ini dalam bahasa saat ini.",
                       "ja": "この行は元資料に現在の言語の版がありません。", "ko": "원본 자료에 이 문장의 현재 언어 번역이 없어요.",
                       "pl": "Źródło nie ma tego wiersza w bieżącym języku."},
    "source_required": {"vi": "Cần tài liệu gốc", "cs": "Chybí zdrojový materiál", "zh_cn": "需要原始资料", "zh": "需要原始資料",
                        "en": "Source required", "fr": "Source nécessaire", "de": "Quelle erforderlich", "hu": "Forrás szükséges",
                        "id": "Perlu sumber", "ja": "元資料が必要", "ko": "원본 자료 필요", "pl": "Wymagane źródło"},
    "source_required_body": {
        "vi": "Trang này chưa có tài liệu học gốc bằng {lang} cho các mục dưới đây. Chúng tôi không dịch hoặc tự động tạo nội dung từ ngôn ngữ khác để lấp chỗ trống.",
        "cs": "Pro níže uvedené části zatím nemá tento web původní studijní materiál v jazyce {lang}. Nepřekládáme ani automaticky nevytváříme obsah z jiných jazyků.",
        "zh_cn": "本网站尚无以下项目的{lang}原始学习资料。我们不会用其他语言翻译或自动生成内容来填补。",
        "zh": "本網站尚無以下項目的{lang}原始學習資料。我們不會用其他語言翻譯或自動產生內容來填補。",
        "en": "This site does not have original {lang} study material for the items below yet. Nothing is translated or generated from another language to fill them.",
        "fr": "Ce site n'a pas encore de matériel d'étude original en {lang} pour les éléments ci-dessous. Rien n'est traduit ni généré à partir d'une autre langue pour les combler.",
        "de": "Für die folgenden Bereiche gibt es auf dieser Seite noch kein Original-Lernmaterial auf {lang}. Es wird nichts aus einer anderen Sprache übersetzt oder erzeugt, um sie zu füllen.",
        "hu": "Az alábbi részekhez ezen az oldalon még nincs eredeti {lang} tananyag. Nem fordítunk és nem generálunk tartalmat más nyelvből a pótlásukra.",
        "id": "Situs ini belum memiliki materi belajar asli dalam {lang} untuk bagian di bawah. Tidak ada yang diterjemahkan atau dibuat otomatis dari bahasa lain untuk mengisinya.",
        "ja": "以下の項目には、まだ{lang}の元の学習資料がありません。他の言語から翻訳したり自動生成したりして埋めることはしません。",
        "ko": "아래 항목은 아직 {lang} 원본 학습 자료가 없어요. 다른 언어 자료를 번역하거나 자동 생성해서 채우지 않아요.",
        "pl": "Ta strona nie ma jeszcze oryginalnych materiałów w języku: {lang} dla poniższych części. Niczego nie tłumaczymy ani nie generujemy z innego języka, aby je uzupełnić.",
    },
    "reader": {"vi": "Đọc", "cs": "Čtení", "zh_cn": "阅读", "zh": "閱讀", "en": "Reading", "fr": "Lecture", "de": "Lesen",
               "hu": "Olvasás", "id": "Bacaan", "ja": "読む", "ko": "읽기", "pl": "Czytanie"},
    "review": {"vi": "Ôn tập", "cs": "Opakování", "zh_cn": "复习", "zh": "複習", "en": "Review", "fr": "Révision",
               "de": "Wiederholen", "hu": "Ismétlés", "id": "Ulangan", "ja": "復習", "ko": "복습", "pl": "Powtórka"},
    "target_voice": {"vi": "Giọng {lang}", "cs": "Hlas: {lang}", "zh_cn": "{lang}语音", "zh": "{lang}語音", "en": "{lang} voice",
                     "fr": "Voix : {lang}", "de": "Stimme: {lang}", "hu": "Hang: {lang}", "id": "Suara {lang}",
                     "ja": "{lang}の音声", "ko": "{lang} 목소리", "pl": "Głos: {lang}"},
    "no_voice": {"vi": "Thiết bị này chưa có giọng {lang}. Hãy thêm theo hướng dẫn bên dưới.",
                 "cs": "Toto zařízení nemá hlas pro jazyk {lang}. Přidejte ho podle návodu níže.",
                 "zh_cn": "此设备没有{lang}语音。请按照下方说明添加。", "zh": "此裝置沒有{lang}語音。請依照下方說明新增。",
                 "en": "This device has no {lang} voice. Add one with the steps below.",
                 "fr": "Cet appareil n'a pas de voix {lang}. Ajoutez-en une en suivant les étapes ci-dessous.",
                 "de": "Dieses Gerät hat keine Stimme für {lang}. Füge eine mit den Schritten unten hinzu.",
                 "hu": "Ezen az eszközön nincs {lang} hang. Adj hozzá egyet az alábbi lépésekkel.",
                 "id": "Perangkat ini belum memiliki suara {lang}. Tambahkan dengan langkah di bawah.",
                 "ja": "この端末には{lang}の音声がありません。下の手順で追加してください。",
                 "ko": "이 기기에 {lang} 음성이 없어요. 아래 방법으로 추가하세요.",
                 "pl": "To urządzenie nie ma głosu: {lang}. Dodaj go, korzystając z instrukcji poniżej."},
    "auto_voice": {"vi": "Tự động", "cs": "Automaticky", "zh_cn": "自动", "zh": "自動", "en": "Automatic", "fr": "Automatique",
                   "de": "Automatisch", "hu": "Automatikus", "id": "Otomatis", "ja": "自動", "ko": "자동", "pl": "Automatycznie"},
    "word_order_off": {
        "vi": "{lang} không tách từ bằng dấu cách, nên phần sắp xếp từ không được cung cấp.",
        "cs": "{lang} neodděluje slova mezerami, proto cvičení slovosledu není k dispozici.",
        "zh_cn": "{lang}不以空格分词，因此不提供语序排列练习。", "zh": "{lang}不以空格分詞，因此不提供語序排列練習。",
        "en": "{lang} does not separate words with spaces, so word-order practice is not offered.",
        "fr": "Le {lang} ne sépare pas les mots par des espaces : l'exercice d'ordre des mots n'est pas proposé.",
        "de": "{lang} trennt Wörter nicht durch Leerzeichen, daher gibt es keine Wortstellungsübung.",
        "hu": "A(z) {lang} nem választja el szóközzel a szavakat, ezért nincs szórendgyakorlat.",
        "id": "{lang} tidak memisahkan kata dengan spasi, jadi latihan urutan kata tidak tersedia.",
        "ja": "{lang}は空白で単語を区切らないため、語順並べ替えは提供していません。",
        "ko": "{lang}는 띄어쓰기로 단어를 나누지 않아서 어순 배열을 제공하지 않아요.",
        "pl": "Język {lang} nie oddziela słów spacjami, więc ćwiczenie szyku wyrazów nie jest dostępne.",
    },
    "check": {"vi": "Kiểm tra", "cs": "Zkontrolovat", "zh_cn": "检查", "zh": "檢查", "en": "Check", "fr": "Vérifier",
              "de": "Prüfen", "hu": "Ellenőrzés", "id": "Periksa", "ja": "確認", "ko": "확인", "pl": "Sprawdź"},
    "correct": {"vi": "Đúng rồi!", "cs": "Správně!", "zh_cn": "正确！", "zh": "正確！", "en": "Correct!", "fr": "Correct !",
                "de": "Richtig!", "hu": "Helyes!", "id": "Benar!", "ja": "正解！", "ko": "정답!", "pl": "Dobrze!"},
    "wrong": {"vi": "Chưa đúng, thử lại.", "cs": "Není to správně, zkuste znovu.", "zh_cn": "不对，再试一次。", "zh": "不對，再試一次。",
              "en": "Not yet — try again.", "fr": "Pas encore, réessayez.", "de": "Noch nicht – versuch es erneut.",
              "hu": "Még nem jó, próbáld újra.", "id": "Belum benar, coba lagi.", "ja": "違います。もう一度。",
              "ko": "틀렸어요. 다시 해 보세요.", "pl": "Jeszcze nie, spróbuj ponownie."},
    "all": {"vi": "Tất cả", "cs": "Vše", "zh_cn": "全部", "zh": "全部", "en": "All", "fr": "Tout", "de": "Alle", "hu": "Összes",
            "id": "Semua", "ja": "すべて", "ko": "전체", "pl": "Wszystko"},
    "search": {"vi": "Tìm kiếm", "cs": "Hledat", "zh_cn": "搜索", "zh": "搜尋", "en": "Search", "fr": "Rechercher", "de": "Suchen",
               "hu": "Keresés", "id": "Cari", "ja": "検索", "ko": "검색", "pl": "Szukaj"},
    "no_results": {"vi": "Không có kết quả.", "cs": "Žádné výsledky.", "zh_cn": "没有结果。", "zh": "沒有結果。", "en": "No results.",
                   "fr": "Aucun résultat.", "de": "Keine Ergebnisse.", "hu": "Nincs találat.", "id": "Tidak ada hasil.",
                   "ja": "結果がありません。", "ko": "결과가 없어요.", "pl": "Brak wyników."},
    "feat_reader": {"vi": "Đọc song ngữ", "cs": "Paralelní čtení", "zh_cn": "对照阅读", "zh": "對照閱讀", "en": "Parallel reading",
                    "fr": "Lecture bilingue", "de": "Paralleltext", "hu": "Párhuzamos olvasás", "id": "Bacaan paralel",
                    "ja": "対訳リーディング", "ko": "대역 읽기", "pl": "Czytanie równoległe"},
}


def target_ui_text_check():
    missing = [(k, l) for k, v in TARGET_UI_TEXT.items() for l in UI_LANGS if not v.get(l)]
    if missing:
        raise SystemExit("TARGET_UI_TEXT missing translations: %r" % missing[:10])


def js(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
