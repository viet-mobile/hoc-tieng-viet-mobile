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
    "CURR_WELCOME", "CURR_PHASES", "CURR_WEEKS",  # curriculum_data.py -- JW course source;
                                 # GENERAL receives a filtered language-learning subset
    "CURR_ASSIGNMENTS",          # weekly_assignments_data.py -- JW-only weekly tasks; removed from GENERAL
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
        "title": "JW 베트남어 학습 · JW學習越南語 · JW Vietnamese Learning · JW ベトナム語学習",
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
            "zh_cn": "JW 学习越南语",
            "zh": "JW學習越南語",
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
            "zh_cn": "JW 学习越南语",
            "zh": "JW學習越南語",
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
            # The regional-class links are for Korean-speaking learners only.
            "ko_only": True,
            "extra_links": [
                {"url": "https://ulsan.hoc.tieng.viet.mobile", "text": "울산 학습반?"},
            ],
        },
    },
    "general": {
        "title": "베트남어 학습 · 學習越南語 · Learn Vietnamese · ベトナム語学習",
        "h1": "베트남어 학습",
        "host": "hoc.tieng.viet.mobile",
        "h1_by_lang": {
            "vi": "Học tiếng Việt",
            "cs": "Studium vietnamštiny",
            "zh_cn": "学习越南语",
            "zh": "學習越南語",
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
            "zh_cn": "学习越南语",
            "zh": "學習越南語",
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
        "cross_link": {
            "url": "https://jeonju.hoc.tieng.viet.mobile/admin",
            "text": "관리자?",
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
        "cross_link": {
            "url": "https://ulsan.hoc.tieng.viet.mobile/admin",
            "text": "관리자?",
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
    # [과정] (curriculum) is kept for GENERAL as its first tab; build_app.py supplies a filtered
    # language-learning subset while removing JW publication, meeting, ministry, and graduation items.
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


# ============================================================================================
# SITE FAMILY x TARGET LANGUAGE x UI LANGUAGE
#
# Every deployable site is one SITES entry: a family (general | jw | regional), the language being
# learned (target_language + target_script), its domain and dist/ output directory, the features it
# ships and the content sources those features may read. The 12 UI languages are orthogonal to
# this: every site runs in all of them. Nothing in the build or the runtime branches on a site id;
# they read these fields.
#
#   engine "vietnamese": the existing Vietnamese learning app (all of its tabs and data). The four
#                        original profile ids are unchanged.
#   engine "target":     the target-language engine (app_logic.js TARGET ENGINE section): a
#                        parallel reader, a target-centred review and target/UI voice settings,
#                        built only from content sources that really exist in the target language.
# ============================================================================================

# The 12 UI languages, in the canonical order (never re-ordered).
UI_LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]

# Per target language: which record field holds each script, the TTS locale per script, and how
# text may be split into words. tokenizer "whitespace" = words are space-separated (safe for
# word-order exercises); "eojeol" = Korean space-separated eojeol units (safe at eojeol level, no
# morpheme analysis); "none" = no safe word boundary without a dictionary segmenter, so word-level
# features (word order) are not shipped.
TARGET_LANGUAGES = {
    "vi": {"scripts": {"Latn": {"field": "vi", "tts": "vi-VN"}}, "primary_script": "Latn",
           "tokenizer": "whitespace"},
    "en": {"scripts": {"Latn": {"field": "en", "tts": "en-US"}}, "primary_script": "Latn",
           "tokenizer": "whitespace"},
    "id": {"scripts": {"Latn": {"field": "id", "tts": "id-ID"}}, "primary_script": "Latn",
           "tokenizer": "whitespace"},
    "ko": {"scripts": {"Kore": {"field": "ko", "tts": "ko-KR"}}, "primary_script": "Kore",
           "tokenizer": "eojeol"},
    "ja": {"scripts": {"Jpan": {"field": "ja", "tts": "ja-JP"}}, "primary_script": "Jpan",
           "tokenizer": "none"},
    # Traditional is primary: every JW source has at least as many Traditional rows as Simplified
    # (ELF 5071 vs 4714, LFF 2296 vs 2235, LPD excerpts 164 vs 39; WT/songs/neighbor equal).
    "zh": {"scripts": {"Hant": {"field": "zh", "tts": "zh-TW"}, "Hans": {"field": "zh_cn", "tts": "zh-CN"}},
           "primary_script": "Hant", "tokenizer": "none"},
}

# Target-language names in each UI language (UI text only: voice settings, notices).
TARGET_LANGUAGE_NAMES = {
    "en": {"vi": "tiếng Anh", "cs": "angličtina", "zh_cn": "英语", "zh": "英語", "en": "English",
           "fr": "anglais", "de": "Englisch", "hu": "angol", "id": "Bahasa Inggris", "ja": "英語",
           "ko": "영어", "pl": "angielski"},
    "zh": {"vi": "tiếng Trung", "cs": "čínština", "zh_cn": "中文", "zh": "中文", "en": "Chinese",
           "fr": "chinois", "de": "Chinesisch", "hu": "kínai", "id": "Bahasa Mandarin", "ja": "中国語",
           "ko": "중국어", "pl": "chiński"},
    "id": {"vi": "tiếng Indonesia", "cs": "indonéština", "zh_cn": "印尼语", "zh": "印尼語", "en": "Indonesian",
           "fr": "indonésien", "de": "Indonesisch", "hu": "indonéz", "id": "Bahasa Indonesia", "ja": "インドネシア語",
           "ko": "인도네시아어", "pl": "indonezyjski"},
    "ja": {"vi": "tiếng Nhật", "cs": "japonština", "zh_cn": "日语", "zh": "日語", "en": "Japanese",
           "fr": "japonais", "de": "Japanisch", "hu": "japán", "id": "Bahasa Jepang", "ja": "日本語",
           "ko": "일본어", "pl": "japoński"},
    "ko": {"vi": "tiếng Hàn", "cs": "korejština", "zh_cn": "韩语", "zh": "韓語", "en": "Korean",
           "fr": "coréen", "de": "Koreanisch", "hu": "koreai", "id": "Bahasa Korea", "ja": "韓国語",
           "ko": "한국어", "pl": "koreański"},
}

# "Study <language>" site names per UI language (the GENERAL family title; JW prefixes "JW").
TARGET_SITE_NAMES = {
    "en": {"vi": "Học tiếng Anh", "cs": "Studium angličtiny", "zh_cn": "学习英语", "zh": "學習英語",
           "en": "Study English", "fr": "Apprentissage de l'anglais", "de": "Englisch lernen",
           "hu": "Angol nyelvtanulás", "id": "Belajar Bahasa Inggris", "ja": "英語学習", "ko": "영어 학습",
           "pl": "Nauka angielskiego"},
    "zh": {"vi": "Học tiếng Trung", "cs": "Studium čínštiny", "zh_cn": "学习中文", "zh": "學習中文",
           "en": "Study Chinese", "fr": "Apprentissage du chinois", "de": "Chinesisch lernen",
           "hu": "Kínai nyelvtanulás", "id": "Belajar Bahasa Mandarin", "ja": "中国語学習", "ko": "중국어 학습",
           "pl": "Nauka chińskiego"},
    "id": {"vi": "Học tiếng Indonesia", "cs": "Studium indonéštiny", "zh_cn": "学习印尼语", "zh": "學習印尼語",
           "en": "Study Indonesian", "fr": "Apprentissage de l'indonésien", "de": "Indonesisch lernen",
           "hu": "Indonéz nyelvtanulás", "id": "Belajar Bahasa Indonesia", "ja": "インドネシア語学習",
           "ko": "인도네시아어 학습", "pl": "Nauka indonezyjskiego"},
    "ja": {"vi": "Học tiếng Nhật", "cs": "Studium japonštiny", "zh_cn": "学习日语", "zh": "學習日語",
           "en": "Study Japanese", "fr": "Apprentissage du japonais", "de": "Japanisch lernen",
           "hu": "Japán nyelvtanulás", "id": "Belajar Bahasa Jepang", "ja": "日本語学習", "ko": "일본어 학습",
           "pl": "Nauka japońskiego"},
    "ko": {"vi": "Học tiếng Hàn", "cs": "Studium korejštiny", "zh_cn": "学习韩语", "zh": "學習韓語",
           "en": "Study Korean", "fr": "Apprentissage du coréen", "de": "Koreanisch lernen",
           "hu": "Koreai nyelvtanulás", "id": "Belajar Bahasa Korea", "ja": "韓国語学習", "ko": "한국어 학습",
           "pl": "Nauka koreańskiego"},
}

# Content sources the target engine can read. Each is a real 12-language row-aligned source; the
# builder (target_content.py) never translates or generates text. family = which site family may
# ship it (a JW source is never shipped to a GENERAL site).
TARGET_CONTENT_SOURCES = {
    "elf": {"family": "jw", "provenance": "Enjoy Life Forever(4).xlsx, 12 languages row-aligned"},
    "lpd": {"family": "jw", "provenance": "Love people(3).xlsx, 12 languages row-aligned"},
    "wt": {"family": "jw", "provenance": "Watchtower Study(3).xlsx, 12 languages row-aligned"},
    "songs": {"family": "jw", "provenance": "songs_data.js from Songs(7).xlsx, Japanese lines post-processed"},
    "neighbor": {"family": "jw", "provenance": "wol.jw.org conversation articles, 12 languages"},
}

# Target-language capabilities with no source in this repository yet: not shipped, reported as
# SOURCE REQUIRED, never filled from another language.
TARGET_SOURCE_REQUIRED = ["words", "pronunciation", "difference", "grammar", "course", "culture"]

_VIET_SITES = {
    "general": {"family": "general", "domain": "hoc.tieng.viet.mobile", "output_dir": "dist"},
    "jw": {"family": "jw", "domain": "jw.hoc.tieng.viet.mobile", "output_dir": "dist/jw"},
    "jeonju": {"family": "regional", "domain": "jeonju.hoc.tieng.viet.mobile", "output_dir": "dist/jeonju"},
    "ulsan": {"family": "regional", "domain": "ulsan.hoc.tieng.viet.mobile", "output_dir": "dist/ulsan"},
}
_TARGET_SITE_DEFS = [
    # (target, slug, GENERAL domain, JW domain)
    ("en", "english", "study.english.viet.mobile", "jw.study.english.viet.mobile"),
    ("zh", "chinese", "zhong.wen.viet.mobile", "jw.zhong.wen.viet.mobile"),
    ("id", "indonesian", "bahasa.indonesia.viet.mobile", "jw.bahasa.indonesia.viet.mobile"),
    ("ja", "japanese", "study.japanese.viet.mobile", "jw.study.japanese.viet.mobile"),
    ("ko", "korean", "study.korean.viet.mobile", "jw.study.korean.viet.mobile"),
]


def _target_features(target, sources):
    features = ["voice_settings"]
    if sources:
        features += ["reader", "review"]
        if TARGET_LANGUAGES[target]["tokenizer"] != "none":
            features.append("word_order")
    return features


SITES = {}
for _sid, _meta in _VIET_SITES.items():
    SITES[_sid] = dict(_meta, site_id=_sid, engine="vietnamese", target_language="vi", target_script="Latn",
                       title=SITE_TITLES[_sid]["h1"], features=["vietnamese_app"], content_sources=[])
for _target, _slug, _gdomain, _jdomain in _TARGET_SITE_DEFS:
    for _family, _domain in (("general", _gdomain), ("jw", _jdomain)):
        _sid = ("jw_study_" if _family == "jw" else "study_") + _slug
        _sources = [k for k, v in TARGET_CONTENT_SOURCES.items() if v["family"] == _family]
        SITES[_sid] = {
            "site_id": _sid,
            "family": _family,
            "engine": "target",
            "target_language": _target,
            "target_script": TARGET_LANGUAGES[_target]["primary_script"],
            "title": ("JW " if _family == "jw" else "") + TARGET_SITE_NAMES[_target]["en"],
            "domain": _domain,
            "output_dir": "dist/" + _sid.replace("_", "-"),
            "features": _target_features(_target, _sources),
            "content_sources": _sources,
        }
        _by_lang = {}
        for _ui in UI_LANGS:
            _n = TARGET_SITE_NAMES[_target][_ui]
            _by_lang[_ui] = _n if _family == "general" else ("JW" + _n if _ui == "zh" else "JW " + _n)
        SITE_TITLES[_sid] = {
            "title": SITES[_sid]["title"],
            "h1": SITES[_sid]["title"],
            "host": _domain,
            "h1_by_lang": _by_lang,
            "title_by_lang": dict(_by_lang),
        }
        DOMAIN_MAP[_domain] = {"product": _target, "profile": _sid}

SITE_IDS = list(SITES)


def data_block_name(site):
    """build_app.py output for a site (the JW profile keeps its historical file name)."""
    return "data_block.js" if site == "jw" else f"data_block.{site}.js"

# Template trimming for engine "target" sites (assemble_app.py): the Vietnamese app's own tabs are
# removed whole, and the panels the target engine renders into are kept but emptied.
TARGET_ENGINE_HTML = {
    "tabs": ["curriculum", "wizard", "vocab", "bible", "grammar"],
    "empty_panels": ["sentence", "review", "pron"],
    # The header logo reads "học tiếng Việt"; it is not shown on another language's site.
    "remove": [("img", "class", "brand-logo")],
}
