# One shared app/source tree, three build PROFILES (not three separate apps/sources):
#   GENERAL ⊂ JW ⊂ JEONJU  (content-wise)
#   GENERAL  = the slim profile: all shared/general learning data, JW publication data excluded
#   JW       = GENERAL's full data set + JW publication data
#   JEONJU   = JW's full data set (identical content, same source) + its own event layer
#              (JEONJU_INFO/JEONJU_WEEKS, see jeonju_data.py) -- never "general + event".
# No data file is copied per profile; build_app.py reads each source exactly once and either
# includes it as-is (jw/jeonju) or swaps in an empty placeholder / filters it (general only).
#
# JW_ONLY_CONSTS lists every top-level data_block.js constant whose SOURCE is a JW
# publication/ministry-class booklet, or whose actual content is dominated by JW/religious
# material even when the file's stated purpose looks generic (verified by grep-counting
# 여호와/하나님/성경/왕국/전파/Giê-hô-va occurrences in each source file -- see the architecture
# audit report). These are excluded/emptied for the GENERAL profile only; JW and JEONJU both
# include them unmodified, from the same source.
#
# A few GENERAL-classified files (sentence_builder_data.py, sentence_gen_data.py,
# word_order_reversed_data.py) contain a handful of individually embedded religious vocabulary
# items (e.g. "Nhân Chứng Giê-hô-va", "Phòng Nước Trời") inside otherwise-general word/sentence
# banks -- too few to justify excluding the whole tool, but real content that must not leak into
# the GENERAL build specifically. FILTER_TERMS lists the exact substrings used to drop just those
# entries at build time (see strip_religious_entries below); JW/JEONJU are unaffected.
JW_ONLY_CONSTS = {
    "CASES",                    # app_data.json -- 형/동생 address-term practice dialogues; heavily
                                 # religious example content (626 여호와/성경/왕국/Giê-hô-va hits)
    "VOCAB_THEO",                # vocab_theo.json -- "신권" (theocratic) vocabulary
    "BIBLE_OT", "BIBLE_NT",      # bible_numbers_data.py -- 66 Bible book names (the *_NUM_* half
                                 # of that same file is general Vietnamese numbers, kept)
    "GRAMMAR_INTRO", "GRAMMAR_UNITS",  # grammar_data.py -- pervasive religious example sentences
    "CURR_WELCOME", "CURR_PHASES", "CURR_WEEKS",  # curriculum_data.py -- "베트남어 학습반 16주
                                 # 과정" ministry class booklet ("이 학습반은... 전파하기 위해...")
    "CURR_ASSIGNMENTS",          # weekly_assignments_data.py -- tied to that same 16-week class
    "USAGE_GUIDE_COMMON", "USAGE_GUIDE_TABS",  # usage_guide_data.py -- "교과 > 사용설명"
    "OFFER_TALKS", "KINGDOM_SONGS", "PRAYER_TEMPLATE",  # offer_talks_data.py -- ministry talk/
                                 # prayer/song material transcribed from the course booklet
    "NEIGHBOR_CONVERSATIONS",    # door-to-door ministry scripts, verbatim from wol.jw.org
    "LFF_CONVERSATIONS",         # wol.jw.org "Enjoy Life Forever!" (5-lang curated)
    "LPD_LESSONS",               # jw.org "Love People-Make Disciples" (5-lang curated)
    "BIBLE_NAMES",               # Bible personal names dictionary
    "GX_CONNECTIVES", "GX_MOTION_VERBS", "GX_POS_PREPS", "GX_POS_EXAMPLES", "GX_DIRECTION_DIALOGUES",
                                 # grammar_extra_data.py -- "교과 > 문법 특강", course booklet
                                 # pages 94-103; some entries contain religious example content
    "GRAMMAR_DICT",              # grammar_dict_data.py -- ~104-entry legacy dictionary, pervasive
                                 # religious example sentences scattered across entries. The
                                 # newer general-safe B1/B2 additions live in their own COMMON
                                 # constant, GRAMMAR_B1_B2_PATTERNS (not a member of this set).
    "VOCAB_PLAN",                # vocab_study_plan_data.py -- weekly-test partition mechanism
                                 # for the 16-week ministry class (see CURR_ASSIGNMENTS)
    "WATCHTOWER_VOCAB",          # Watchtower Study article vocabulary
    "ENJOY_LIFE_FOREVER", "LOVE_PEOPLE_FULL", "WATCHTOWER_FULL",  # full 12-lang Excel data
    "JW_EXTRACTION_DATA",        # JW learning extraction engine derived data (vocab frequencies, grammar examples, learning sentences)
}

# JW-only constants that are Python dict/list objects built earlier in build_app.py and always
# have real content in the jw profile; when excluded, they're still emitted (so no other part of
# app_logic.js hits a ReferenceError) but as an empty value of the SAME shape its consumers
# expect. Plain lists/dicts get [] / {}; these three are accessed as {units:[...], languages:{},
# languageOrder:[...]} deeper inside app_logic.js (see initLff2/createExcelFullViewer), so an
# empty {} would itself throw on `.units` -- they need this minimal safe shape instead.
STRUCTURED_EMPTY_SHAPES = {
    "ENJOY_LIFE_FOREVER": {"unitCount": 0, "languageOrder": [], "languages": {}, "units": []},
    "LOVE_PEOPLE_FULL": {"unitCount": 0, "languageOrder": [], "languages": {}, "units": []},
    "WATCHTOWER_FULL": {"unitCount": 0, "languageOrder": [], "languages": {}, "units": [], "skippedEmptySheets": 0},
    "JW_EXTRACTION_DATA": None,
    # PRAYER_TEMPLATE is a dict, not a list, so empty_like()'s generic {} would still crash
    # POOL_BUILDERS.wizard's unconditional `PRAYER_TEMPLATE.lines.forEach(...)` (that pool
    # builder has no DOM-existence guard the way render functions do) -- found via an actual
    # runtime pageerror on GENERAL's review tab, not by inspection alone.
    "PRAYER_TEMPLATE": {"lines": [], "note": None},
    # WELCOME_TEXT (emitted as CURR_WELCOME) is also a dict with a "body" list its renderer
    # accesses unconditionally once past its own DOM-existence guard -- that guard already makes
    # this safe in practice (see renderCurrWeek16, whose curr-week16-root is removed for GENERAL
    # before this data would ever be read), but the same {} would otherwise be just as fragile.
    "CURR_WELCOME": {"title": None, "body": []},
}

# Exact substrings identifying the handful of religious entries embedded in otherwise-general
# word/sentence banks (see module docstring). Matched against each entry's own JSON text.
RELIGIOUS_FILTER_TERMS = [
    "여호와", "Giê-hô-va", "Jehovah", "Jehova", "Jéhovah", "Jehowa",
    "Phòng Nước Trời", "Kingdom Hall", "왕국회관", "Nước Trời",
    "Nhân Chứng", "Jehovah's Witness", "여호와의 증인", "증인",
    "Kinh Thánh", "성경", "Bible",
    "Đức Chúa Trời", "하나님",
    "Giê-su", "예수", "Jesus",
]

# Top-level constant names built as plain Python lists/dicts of individual word/sentence
# entries, filtered for a general/jeonju build by dropping any entry whose own JSON text
# contains one of RELIGIOUS_FILTER_TERMS (see strip_religious_entries in build_app.py).
GENERAL_CONSTS_NEEDING_ENTRY_FILTER = {
    "SB_PRONOUNS", "SB_NOUN_SUBJECTS", "SB_INTRANS_VERBS", "SB_TRANS_VERBS", "SB_AUX_VERBS",
    "SB_OBJECT_NOUNS", "SB_ADJECTIVES", "SB_CONNECTIVES", "SB_TIME_ADV", "SB_PLACE_ADV",
    "SB_MANNER_ADV", "SB_SENTENCE_TYPES", "SB_WH_WORDS", "SB_COMPLEMENT_NOUNS", "SB_PREPOSITIONS",
    "SENT_GEN_INTRO", "SENT_GEN_BANK", "SENT_GEN_STAGES",
    "WORD_ORDER_REVERSED_EXTRA",
    # Found during the JW-data-leak assertion pass (not caught by the initial per-file grep,
    # which only checked Korean-script terms): both contain a "Giê-hô-va"/"Giê-su" or "vương
    # quốc" (Kingdom) example word inside an otherwise general pronunciation/rhyme word list.
    "NS_DIFFS",      # pronunciation_data.py NORTH_SOUTH_DIFFS -- north/south dialect word list
    "RHYME_GROUPS",  # rhyme_data.py -- Sino-Vietnamese reading rhyme groups
}

SITE_TITLES = {
    "jw": {
        "title": "JW 베트남어 학습 · JW越南語學習 · JW Vietnamese Learning · JW ベトナム語学習",
        "h1": "JW 베트남어 학습",
        "host": "jw.hoc.tieng.viet.mobile",
        # h1_by_lang / title_by_lang: consumed by assemble_app.py to inject a small SITE_H1_BY_LANG /
        # SITE_TITLE_BY_LANG script before app_logic.js runs, so the header text and browser-tab
        # title track the user's currently selected UI language (see app_logic.js's TITLE_BY_LANG
        # override and applySiteH1Override) instead of staying fixed in Korean after a language
        # switch. Keys match VALID_LANGS (the 12 supported UI display languages).
        "h1_by_lang": {
            "vi": "JW Học tiếng Việt",
            "cs": "JW Studium vietnamštiny",
            "zh_cn": "JW 越南语学习",
            "zh": "JW 越南語學習",
            "en": "JW Vietnamese Learning",
            "fr": "JW Apprentissage du vietnamien",
            "de": "JW Vietnamesisch lernen",
            "hu": "JW Vietnami nyelvtanulás",
            "id": "JW Belajar Bahasa Vietnam",
            "ja": "JW ベトナム語学習",
            "ko": "JW 베트남어 학습",
            "pl": "JW Nauka wietnamskiego",
        },
        "title_by_lang": {
            "vi": "JW Học tiếng Việt",
            "cs": "JW Studium vietnamštiny",
            "zh_cn": "JW 越南语学习",
            "zh": "JW 越南語學習",
            "en": "JW Vietnamese Learning",
            "fr": "JW Apprentissage du vietnamien",
            "de": "JW Vietnamesisch lernen",
            "hu": "JW Vietnami nyelvtanulás",
            "id": "JW Belajar Bahasa Vietnam",
            "ja": "JW ベトナム語学習",
            "ko": "JW 베트남어 학습",
            "pl": "JW Nauka wietnamskiego",
        },
        "cross_link": {
            "url": "https://jeonju.hoc.tieng.viet.mobile",
            "text": "전주 학습반?",
        },
    },
    "general": {
        "title": "베트남어 학습 · 越南語學習 · Learn Vietnamese · ベトナム語学習",
        "h1": "베트남어 학습",
        "host": "hoc.tieng.viet.mobile",
        "h1_by_lang": {
            "vi": "Học tiếng Việt",
            "cs": "Studium vietnamštiny",
            "zh_cn": "越南语学习",
            "zh": "越南語學習",
            "en": "Vietnamese Learning",
            "fr": "Apprentissage du vietnamien",
            "de": "Vietnamesisch lernen",
            "hu": "Vietnami nyelvtanulás",
            "id": "Belajar Bahasa Vietnam",
            "ja": "ベトナム語学習",
            "ko": "베트남어 학습",
            "pl": "Nauka wietnamskiego",
        },
        "title_by_lang": {
            "vi": "Học tiếng Việt",
            "cs": "Studium vietnamštiny",
            "zh_cn": "越南语学习",
            "zh": "越南語學習",
            "en": "Vietnamese Learning",
            "fr": "Apprentissage du vietnamien",
            "de": "Vietnamesisch lernen",
            "hu": "Vietnami nyelvtanulás",
            "id": "Belajar Bahasa Vietnam",
            "ja": "ベトナム語学習",
            "ko": "베트남어 학습",
            "pl": "Nauka wietnamskiego",
        },
        "cross_link": {
            "url": "https://jw.hoc.tieng.viet.mobile",
            "text": "JW?",
        },
    },
    "jeonju": {
        "title": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
        "h1": "2026-2027 전주 베트남어 학습반",
        "host": "jeonju.hoc.tieng.viet.mobile",
        "h1_by_lang": {
            "vi": "2026-2027 전주 베트남어 학습반",
            "cs": "2026-2027 전주 베트남어 학습반",
            "zh_cn": "2026-2027 전주 베트남어 학습반",
            "zh": "2026-2027 전주 베트남어 학습반",
            "en": "2026-2027 전주 베트남어 학습반",
            "fr": "2026-2027 전주 베트남어 학습반",
            "de": "2026-2027 전주 베트남어 학습반",
            "hu": "2026-2027 전주 베트남어 학습반",
            "id": "2026-2027 전주 베트남어 학습반",
            "ja": "2026-2027 전주 베트남어 학습반",
            "ko": "2026-2027 전주 베트남어 학습반",
            "pl": "2026-2027 전주 베트남어 학습반",
        },
        "title_by_lang": {
            "vi": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "cs": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "zh_cn": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "zh": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "en": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "fr": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "de": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "hu": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "id": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "ja": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "ko": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
            "pl": "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
        },
    },
    "ulsan": {
        "title": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
        "h1": "2026-2027 울산 베트남어 학습반",
        "host": "ulsan.hoc.tieng.viet.mobile",
        "h1_by_lang": {
            "vi": "2026-2027 울산 베트남어 학습반",
            "cs": "2026-2027 울산 베트남어 학습반",
            "zh_cn": "2026-2027 울산 베트남어 학습반",
            "zh": "2026-2027 울산 베트남어 학습반",
            "en": "2026-2027 울산 베트남어 학습반",
            "fr": "2026-2027 울산 베트남어 학습반",
            "de": "2026-2027 울산 베트남어 학습반",
            "hu": "2026-2027 울산 베트남어 학습반",
            "id": "2026-2027 울산 베트남어 학습반",
            "ja": "2026-2027 울산 베트남어 학습반",
            "ko": "2026-2027 울산 베트남어 학습반",
            "pl": "2026-2027 울산 베트남어 학습반",
        },
        "title_by_lang": {
            "vi": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "cs": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "zh_cn": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "zh": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "en": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "fr": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "de": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "hu": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "id": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "ja": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "ko": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
            "pl": "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027",
        },
    },
}

# JW-only top-level UI to remove from the template for the GENERAL (slim) profile only --
# JW, JEONJU, and ULSAN keep the full JW-profile HTML unchanged (regional profiles = JW's complete
# feature set + their own event layer, not general + event). Described declaratively so
# assemble_app.py's HTML stripper doesn't need any site-specific logic of its own.
#   tabs: top-level <button class="tab-btn" data-tab="..."> + its <section id="panel-...">, both
#         removed whole.
#   subtabs: {attr: e.g. "data-wizard", values: [...]} -- just those subtab-btn buttons, plus any
#         element whose id looks like "<panel-prefix>-<value>-pane" / "curr-<value>-root" pattern
#         is left alone (most subtab content mounts into one shared root the JS re-renders, so
#         removing the button is what actually removes the feature from the UI + nav + search).
#   review_categories: data-review values to drop from the review panel's own category row.
NON_JW_HTML_REMOVALS = {
    # GENERAL retains the COMMON PDF sentence pane; only publication panes are removed.
    # Culture has been relocated to [대화] > [문화] (a COMMON subtab under wizard).
    # Songs and Prayer have been relocated to [문장] (JW/JEONJU only).
    # Usage Guide has been merged into [발음] > [설정].
    # [문법] > [특강] ("data-grammar":"special") is NOT removed for GENERAL: it now also holds
    # GRAMMAR_B1_B2_PATTERNS (COMMON), alongside its legacy JW-only content (GX_*, the original
    # GRAMMAR_DICT entries), which is already emptied at the data level for GENERAL via
    # JW_ONLY_CONSTS -- whole-removing this pane would also hide the COMMON B1/B2 material.
    # [과정] (curriculum) is kept for GENERAL as its first tab; its course data is JW-only and emitted empty, so
    # GENERAL shows the "자료 미정" state (app_logic.js renderCurrWeek16).
    "tabs": [],
    "subtabs": [
        {"attr": "data-sentence", "values": ["lff", "lpd", "wt", "song", "prayer", "lff2", "lpd2", "wt2"]},
        {"attr": "data-wizard", "values": ["main", "talks", "neighbor"]},
        {"attr": "data-vocab", "values": ["theo", "names"]},
        {"attr": "data-bible", "values": ["books"]},
        {"attr": "data-grammar", "values": ["lessons"]},
    ],
    "review_categories": ["song", "sentence"],
}

# ============================================================================================
# PLATFORM MODEL: ONE SOURCE OF TRUTH -> PRODUCT (learning-content language) -> PROFILE (content
# policy) -> DOMAIN (deployment hostname). This app is the first PRODUCT ("vietnamese"); the
# same profile architecture is meant to carry over to future products (Chinese, Indonesian, ...)
# without hostname/product strings spreading through the application logic. Everything above
# this comment is "vietnamese"'s own content-layer data (its JW_ONLY_CONSTS, entry filters, HTML
# removals, titles) -- PRODUCTS below just names and groups it; it is not duplicated.
#
# PROFILE is a content policy, independent of product:
#   general        = COMMON only
#   jw             = COMMON + JW_CONTENT
#   <event>_event  = COMMON + JW_CONTENT + EVENT_CONTENT[event]
# (Vietnamese's event profiles are internally keyed "jeonju" and "ulsan" to match build/dist
# conventions.)
PRODUCTS = {
    "vietnamese": {
        "jw_content_consts": JW_ONLY_CONSTS,
        "entry_filter_consts": GENERAL_CONSTS_NEEDING_ENTRY_FILTER,
        "religious_filter_terms": RELIGIOUS_FILTER_TERMS,
        "structured_empty_shapes": STRUCTURED_EMPTY_SHAPES,
        "html_removals": NON_JW_HTML_REMOVALS,
        "titles": SITE_TITLES,
        "events": {
            "jeonju": {"data_module": "jeonju_data", "consts": ["JEONJU_INFO", "JEONJU_WEEKS"]},
            "ulsan": {"data_module": "ulsan_data", "consts": ["ULSAN_INFO", "ULSAN_WEEKS"]},
        },
    },
    # Architecture-ready placeholders only -- NOT implemented this pass. No Chinese/Indonesian
    # content, translation, or data file exists anywhere in this repo; adding a real entry here
    # means pointing "jw_content_consts" etc. at that product's OWN data_block.js constants
    # (never vietnamese's), built the same way JW_ONLY_CONSTS was: audit each source file's
    # actual content, not its filename. See [FUTURE EXTENSIBILITY] in the architecture report.
    # "chinese": {
    #     "jw_content_consts": set(),       # would be CHINESE_JW_CONTENT, audited from scratch
    #     "entry_filter_consts": set(),
    #     "religious_filter_terms": [],
    #     "structured_empty_shapes": {},
    #     "html_removals": {"tabs": [], "subtabs": [], "review_categories": []},
    #     "titles": {},
    #     "events": {},
    # },
    # "indonesian": {
    #     "jw_content_consts": set(),
    #     "entry_filter_consts": set(),
    #     "religious_filter_terms": [],
    #     "structured_empty_shapes": {},
    #     "html_removals": {"tabs": [], "subtabs": [], "review_categories": []},
    #     "titles": {},
    #     "events": {},
    # },
}

# DOMAIN is deployment/profile MAPPING, not content logic -- nothing in build_app.py,
# assemble_app.py, or app_logic.js branches on a hostname string; a hostname only ever resolves
# to (product, profile) here, and that pair drives everything else. No hostname routing is
# implemented at runtime (see the architecture report's build-profile vs. hostname-profile
# comparison) -- this map exists purely as the deployment-side reference for which Cloudflare
# Pages project/custom-domain should point at which build's dist/ output.
DOMAIN_MAP = {
    "hoc.tieng.viet.mobile": {"product": "vietnamese", "profile": "general"},
    "jw.hoc.tieng.viet.mobile": {"product": "vietnamese", "profile": "jw"},
    "jeonju.hoc.tieng.viet.mobile": {"product": "vietnamese", "profile": "jeonju"},
    "ulsan.hoc.tieng.viet.mobile": {"product": "vietnamese", "profile": "ulsan"},
    # Future domains (architecture-ready only -- these products don't exist yet, see PRODUCTS):
    # "zhong.wen.viet.mobile": {"product": "chinese", "profile": "general"},
    # "jw.zhong.wen.viet.mobile": {"product": "chinese", "profile": "jw"},
    # "bahasa.indonesia.viet.mobile": {"product": "indonesian", "profile": "general"},
    # "jw.bahasa.indonesia.viet.mobile": {"product": "indonesian", "profile": "jw"},
}
