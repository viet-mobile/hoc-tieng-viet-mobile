# -*- coding: utf-8 -*-
"""Source metadata of the target-language sites (site_profiles.TARGET_CONTENT_SOURCES): what each
content source is called in the 12 UI languages. Kept apart from the source content
(target_content.py, TARGET_CORPUS_*), so renaming a source never touches the content rows.

  label     -- the source button text. For the publications it is the official title (its main
               title where the full one carries a subtitle); for songs and the neighbor
               conversations, which are read as collections, it is the app's existing UI label.
  official  -- the official full title, shown as the heading of the selected source. Missing where
               the language has no such title (Polish prints the neighbor articles without a
               series name), never filled from another language.

Official titles were copied from jw.org on 2026-09-26, per language (wtlocale codes in
REFERENCE_LOCALES):
  lff, lmd, sjj   https://www.jw.org/finder?wtlocale=<loc>&pub=<symbol>  (page title before " | ";
                  Chinese and Japanese pages print pinyin/ruby inside the <h1>, so the <title> is used)
  wt              https://www.jw.org/finder?wtlocale=<loc>&pub=w&issue=202606  (page title; Japanese
                  from the page's context title, which has no stray space)
  neighbor        https://www.jw.org/finder?wtlocale=<loc>&docid=2012569  (series name before the dash
                  in the first article heading)
"""

REFERENCE_LOCALES = {"vi": "VT", "cs": "B", "zh_cn": "CHS", "zh": "CH", "en": "E", "fr": "F", "de": "X",
                     "hu": "H", "id": "IN", "ja": "J", "ko": "KO", "pl": "P"}

TARGET_SOURCE_META = {
    "elf": {
        "symbol": "lff",
        "label": {
            "vi": "Vui sống mãi mãi!", "cs": "Radujte se ze života navždy!", "zh_cn": "永远享受美好的生命",
            "zh": "永遠享受美好的生命", "en": "Enjoy Life Forever!", "fr": "Vivez pour toujours !",
            "de": "Glücklich – für immer", "hu": "Boldogan élhetsz örökké!", "id": "Hidup Bahagia Selamanya!",
            "ja": "いつまでも幸せに暮らせます", "ko": "행복한 삶을 영원히 누리십시오!", "pl": "Już zawsze ciesz się życiem!",
        },
        "official": {
            "vi": "Vui sống mãi mãi!—Bí quyết từ Kinh Thánh",
            "cs": "Radujte se ze života navždy! (interaktivní biblický kurz)",
            "zh_cn": "永远享受美好的生命——互动式圣经课程",
            "zh": "永遠享受美好的生命——互動式聖經課程",
            "en": "Enjoy Life Forever!—An Interactive Bible Course",
            "fr": "Vivez pour toujours ! (cours biblique interactif)",
            "de": "Glücklich – für immer. Ein interaktiver Bibelkurs",
            "hu": "Boldogan élhetsz örökké! – Bibliatanfolyam",
            "id": "Hidup Bahagia Selamanya!—Pelajari Caranya dari Alkitab",
            "ja": "いつまでも幸せに暮らせます 楽しく学べる聖書レッスン",
            "ko": "행복한 삶을 영원히 누리십시오!—당신을 위한 성경 공부 과정",
            "pl": "Już zawsze ciesz się życiem! — interaktywny kurs biblijny",
        },
    },
    "lpd": {
        "symbol": "lmd",
        "label": None,  # the official title is already short: same as "official"
        "official": {
            "vi": "Tình yêu thương giúp đào tạo môn đồ",
            "cs": "Měj rád lidi – pomáhej jim stát se učedníky",
            "zh_cn": "用爱心帮助人成为基督徒",
            "zh": "用愛心幫助人成為基督徒",
            "en": "Love People—Make Disciples",
            "fr": "Aime les gens, fais des disciples",
            "de": "Liebt Menschen, macht sie zu Jüngern",
            "hu": "Szeresd az embereket – Képezz tanítványokat",
            "id": "Kasihi Semua Orang—Jadikan Murid",
            "ja": "愛を込めて弟子を育てる",
            "ko": "사람들을 사랑하고 제자로 삼으십시오",
            "pl": "Kochaj ludzi — pozyskuj uczniów",
        },
    },
    "wt": {
        "symbol": "w",
        "label": None,
        "official": {
            "vi": "Tháp Canh (Học hỏi)", "cs": "Strážná věž (studijní vydání)", "zh_cn": "《守望台》（研读版）",
            "zh": "《守望台》（研讀版）", "en": "Watchtower (Study)", "fr": "La Tour de Garde (édition d’étude)",
            "de": "Wachtturm (Studienausgabe)", "hu": "Őrtorony (tanulmányozásra szánt kiadás)",
            "id": "Menara Pengawal (Pelajaran)", "ja": "「ものみの塔」（研究用）", "ko": "파수대 (연구용)",
            "pl": "Strażnica (wydanie do studium)",
        },
    },
    "songs": {
        "symbol": "sjj",
        # The app's existing [노래] label (app_logic.js I18N_UI "노래").
        "label": {
            "vi": "Bài hát", "cs": "Písně", "zh_cn": "诗歌", "zh": "詩歌", "en": "Songs", "fr": "Chants",
            "de": "Lieder", "hu": "Énekek", "id": "Lagu", "ja": "歌", "ko": "노래", "pl": "Pieśni",
        },
        "official": {
            "vi": "Vui mừng ca hát cho Đức Giê-hô-va", "cs": "Radostně zpívejme Jehovovi",
            "zh_cn": "向耶和华高声欢唱", "zh": "向耶和華高聲歡唱", "en": "“Sing Out Joyfully” to Jehovah",
            "fr": "Chantons joyeusement pour Jéhovah !", "de": "Singt voller Freude für Jehova",
            "hu": "Énekeljünk örömmel Jehovának!", "id": "Bernyanyi Sepenuh Hati bagi Yehuwa",
            "ja": "喜びにあふれてエホバに歌う", "ko": "‘기쁨으로 여호와께 노래하라’", "pl": "‛Radośnie śpiewajmy Jehowie’",
        },
    },
    "neighbor": {
        "symbol": None,
        # The app's existing [이웃 사람과의 대화] label (app_logic.js I18N_UI).
        "label": {
            "vi": "Trò chuyện với người lân cận", "cs": "Rozhovor se sousedem", "zh_cn": "耶和华见证人是怎样跟人讨论圣经的",
            "zh": "耶和華見證人是怎樣跟人討論聖經的", "en": "Conversation with a neighbor", "fr": "Conversations avec le prochain",
            "de": "Gespräche über die Bibel", "hu": "Beszélgetés a felebaráttal", "id": "Percakapan dengan Tetangga",
            "ja": "聖書についての話し合い", "ko": "이웃 사람과의 대화", "pl": "Rozmowy o Biblii z ludźmi",
        },
        # Series name printed before each article title; Polish prints none.
        "official": {
            "vi": "Nói chuyện với chủ nhà", "cs": "Rozhovor o biblickém námětu",
            "zh_cn": "耶和华见证人是怎样跟人讨论圣经的", "zh": "耶和華見證人是怎樣跟人討論聖經的",
            "en": "A Conversation With a Neighbor", "fr": "Conversation avec un Témoin de Jéhovah",
            "de": "Gespräch von Mensch zu Mensch", "hu": "Beszélgetés egy bibliai témáról",
            "id": "Sebuah Percakapan", "ja": "聖書についての話し合い", "ko": "이웃 사람과의 대화",
        },
    },
}


def source_meta_for(source_ids):
    """{source id: {"label": {lang: text}, "official": {lang: text}}} for the given sources, with the
    label defaulting to the official title where the source has no separate label."""
    out = {}
    for sid in source_ids:
        meta = TARGET_SOURCE_META[sid]
        out[sid] = {"label": dict(meta["label"] or meta["official"]), "official": dict(meta["official"])}
    return out
