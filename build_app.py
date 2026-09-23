import argparse
import json
from site_profiles import (JW_ONLY_CONSTS, STRUCTURED_EMPTY_SHAPES, RELIGIOUS_FILTER_TERMS,
                            GENERAL_CONSTS_NEEDING_ENTRY_FILTER)
from pronunciation_data import (TONES, ALPHABET, ALPHABET_NOTE, CONSONANTS_SIMPLE,
                                 CONSONANTS_COMPLEX, VOWELS_SIMPLE, VOWELS_COMPLEX,
                                 NORTH_SOUTH_DIFFS, NORTH_SOUTH_NOTE, NORTH_SOUTH_EXTRA_NOTES)
from rhyme_data import RHYME_GROUPS, TONE_ZH_CORR
from bible_numbers_data import (BIBLE_BOOKS_OT, BIBLE_BOOKS_NT, NUMBERS_BASIC, NUMBERS_TEEN,
                                 NUMBERS_TENS, NUMBERS_TENS_NOTE, NUMBERS_HUNDREDS,
                                 NUMBERS_LARGE, NUMBERS_SPECIAL, NUMBER_FORMAT_NOTE,
                                 NUMBER_DECIMAL_EXAMPLE)
from tone_pairs_data import TONE_PAIRS
from grammar_data import GRAMMAR_INTRO, GRAMMAR_UNITS
from sentence_builder_data import (SB_PRONOUNS, SB_NOUN_SUBJECTS, SB_INTRANS_VERBS, SB_TRANS_VERBS,
                                    SB_AUX_VERBS, SB_OBJECT_NOUNS, SB_ADJECTIVES, SB_CONNECTIVES,
                                    SB_TIME_ADV, SB_PLACE_ADV, SB_MANNER_ADV, SB_SENTENCE_TYPES, SB_WH_WORDS,
                                    SB_COMPLEMENT_NOUNS, SB_PREPOSITIONS)
from curriculum_data import WELCOME_TEXT, COURSE_PHASES, WEEK16_TOC
from culture_data import CULTURE_ARTICLES
from offer_talks_data import OFFER_TALKS, KINGDOM_SONGS, PRAYER_TEMPLATE
from neighbor_conversations_data import NEIGHBOR_CONVERSATIONS
from daily_conversations_data import DAILY_CONVERSATIONS
from lff_data import LFF_CONVERSATIONS
from lpd_data import LPD_LESSONS
from bible_names_data import BIBLE_NAMES
from basic_words_list import BASIC_WORD_GROUPS
from antonym_data import ANTONYM_PAIRS
from sentence_gen_data import SENTENCE_GEN_INTRO, SENTENCE_GEN_BANK, SENTENCE_GEN_STAGES
from grammar_extra_data import CONNECTIVES, MOTION_VERBS, POSITION_PREPS, POSITION_EXAMPLES, DIRECTION_DIALOGUES
from grammar_dict_data import GRAMMAR_DICT
from dialect_words_data import DIALECT_WORDS
from calendar_data import MONTHS, DAYS, SEASONS, DATES, DATE_ORDER_NOTE, DATE_MONG_NOTE, YEAR_LE_NOTE
from word_order_reversed_data import WORD_ORDER_REVERSED_EXTRA
from weekly_assignments_data import WEEKLY_ASSIGNMENTS
from time_data import TIME_ORDER_NOTE, TIME_RUOI_KEM_NOTE, TIME_PERIODS, TIME_HOURS, TIME_EXAMPLES
from vocab_study_plan_data import VOCAB_PLAN
from watchtower_vocab_data import WATCHTOWER_VOCAB
from usage_guide_data import USAGE_GUIDE_COMMON, USAGE_GUIDE_TABS

app_data = json.load(open("app_data.json", encoding="utf-8"))
vocab_chain = json.load(open("vocab_chain.json", encoding="utf-8"))
vocab_groups = json.load(open("vocab_groups.json", encoding="utf-8"))
vocab_theo = json.load(open("vocab_theo.json", encoding="utf-8"))
freq_vocab = json.load(open("freq_vocab.json", encoding="utf-8"))
enjoy_life_forever_raw = json.load(open("enjoy_life_forever_data.json", encoding="utf-8"))

ELF_LANG_ORDER = ["vi", "ko", "zh", "en", "ja", "de", "fr", "pl", "cs", "hu", "zh_cn", "id"]

def build_enjoy_life_forever(raw):
    """Converts the raw Excel-derived {sheet, rows} list into the richer
    {id, sheet, type, lesson, part, labelKo, rowCount, rows} unit shape the
    LFF2 renderer in app_logic.js expects. type/lesson/part/labelKo are derived
    purely from each sheet's position/name -- the publication's own fixed
    Section 1-4 structure -- never hand-copied from a prior data file, so a
    revised Excel (different row counts, expanded language columns) converts
    correctly without any manual bookkeeping."""
    special_labels = {
        "Ready": "나는 준비가 되었는가?",
        "Endnotes": "참조 자료",
        "Start Read the Bible": "성경 읽기를 시작해 보세요",
        "Track Your Bible Reading": "성경을 얼마나 읽었는지 표시해 보세요",
    }

    def classify(sheet_id):
        if sheet_id.isdigit():
            return {"type": "lesson", "lesson": int(sheet_id), "labelKo": sheet_id + "과"}
        if len(sheet_id) >= 2 and sheet_id[0] == "R" and sheet_id[1:].isdigit():
            part = int(sheet_id[1:])
            return {"type": "review", "part": part, "labelKo": "제" + str(part) + "부 복습"}
        if len(sheet_id) >= 2 and sheet_id[0] == "M" and sheet_id[1:].isdigit():
            part = int(sheet_id[1:])
            return {"type": "media", "part": part, "labelKo": "제" + str(part) + "부 미디어 자료"}
        if sheet_id in special_labels:
            return {"type": "special", "labelKo": special_labels[sheet_id]}
        raise ValueError("unrecognized Enjoy Life Forever sheet id: " + repr(sheet_id))

    units = []
    for i, sheet in enumerate(raw["sheets"]):
        sheet_id = str(sheet["sheet"])
        meta = classify(sheet_id)
        unit = {"id": i + 1, "sheet": sheet_id, "type": meta["type"]}
        if "lesson" in meta:
            unit["lesson"] = meta["lesson"]
        if "part" in meta:
            unit["part"] = meta["part"]
        unit["labelKo"] = meta["labelKo"]
        unit["rowCount"] = len(sheet["rows"])
        unit["rows"] = [
            {"row": row["row"], **{lang: row.get(lang) or "" for lang in ELF_LANG_ORDER}}
            for row in sheet["rows"]
        ]
        units.append(unit)

    return {
        "schemaVersion": 1,
        "source": raw.get("source_excel", "Enjoy Life Forever(4).xlsx"),
        "target": "[문장] > [행복한 삶을 영원히]",
        "languageOrder": ELF_LANG_ORDER,
        "languages": {
            "vi": "Tiếng Việt", "ko": "한국어", "zh": "中文繁體", "en": "English", "ja": "日本語",
            "de": "Deutsch", "fr": "Français", "pl": "Polski", "cs": "Čeština", "hu": "Magyar",
            "zh_cn": "中文简体", "id": "Bahasa Indonesia",
        },
        "unitCount": len(units),
        "alignmentRule": "Excel의 동일 행을 12개 언어의 대응 행으로 그대로 보존합니다. 번역/재작성/외부 자료 추가 없음.",
        "units": units,
    }

enjoy_life_forever_data = build_enjoy_life_forever(enjoy_life_forever_raw)

love_people_raw = json.load(open("love_people_data.json", encoding="utf-8"))
watchtower_study_raw = json.load(open("watchtower_study_data.json", encoding="utf-8"))

ELF_LANGUAGE_NAMES = {
    "vi": "Tiếng Việt", "ko": "한국어", "zh": "中文繁體", "en": "English", "ja": "日本語",
    "de": "Deutsch", "fr": "Français", "pl": "Polski", "cs": "Čeština", "hu": "Magyar",
    "zh_cn": "中文简体", "id": "Bahasa Indonesia",
}

def build_love_people_full(raw):
    """Full row-by-row transcription of Love people(3).xlsx (15 sheets: lessons 1-12 +
    appendices A-C), independent of the hand-curated LPD_LESSONS excerpts already used by
    [사람들을 사랑하고 제자로] -- that curated selection is untouched; this is a separate,
    complete-original-text view, mirroring how ENJOY_LIFE_FOREVER coexists with LFF_CONVERSATIONS."""
    appendix_labels = {"Appendix A": "부록 가", "Appendix B": "부록 나", "Appendix C": "부록 다"}
    units = []
    for i, sheet in enumerate(raw["sheets"]):
        sheet_id = str(sheet["sheet"])
        if sheet_id.isdigit():
            unit = {"id": i + 1, "sheet": sheet_id, "type": "lesson", "lesson": int(sheet_id), "labelKo": sheet_id + "과"}
        elif sheet_id in appendix_labels:
            unit = {"id": i + 1, "sheet": sheet_id, "type": "special", "labelKo": appendix_labels[sheet_id]}
        else:
            raise ValueError("unrecognized Love People sheet id: " + repr(sheet_id))
        unit["rowCount"] = len(sheet["rows"])
        unit["rows"] = [
            {"row": row["row"], **{lang: row.get(lang) or "" for lang in ELF_LANG_ORDER}}
            for row in sheet["rows"]
        ]
        units.append(unit)
    return {
        "schemaVersion": 1,
        "source": raw.get("source_excel", "Love people(3).xlsx"),
        "target": "[문장] > [사람들을 사랑하고 제자로(전체)]",
        "languageOrder": ELF_LANG_ORDER,
        "languages": ELF_LANGUAGE_NAMES,
        "unitCount": len(units),
        "alignmentRule": "Excel의 동일 행을 12개 언어의 대응 행으로 그대로 보존합니다. 번역/재작성/외부 자료 추가 없음.",
        "units": units,
    }

def build_watchtower_full(raw):
    """Full row-by-row transcription of Watchtower Study(3).xlsx (24 weekly sheets). Sheets
    with zero rows are future weeks the corrected Excel has not filled in yet -- per the rule
    that new-Excel blank cells/sheets are not errors to paper over, they are simply skipped
    rather than rendered as empty or backfilled from any other source."""
    units = []
    for sheet in raw["sheets"]:
        if not sheet["rows"]:
            continue
        sheet_id = str(sheet["sheet"])
        unit = {
            "id": len(units) + 1,
            "sheet": sheet_id,
            "type": "week",
            "week": int(sheet_id) if sheet_id.isdigit() else None,
        }
        unit["rowCount"] = len(sheet["rows"])
        unit["rows"] = [
            {"row": row["row"], **{lang: row.get(lang) or "" for lang in ELF_LANG_ORDER}}
            for row in sheet["rows"]
        ]
        units.append(unit)
    return {
        "schemaVersion": 1,
        "source": raw.get("source_excel", "Watchtower Study(3).xlsx"),
        "target": "[문장] > [파수대(전체)]",
        "languageOrder": ELF_LANG_ORDER,
        "languages": ELF_LANGUAGE_NAMES,
        "unitCount": len(units),
        "skippedEmptySheets": raw["sheet_count"] - len(units),
        "alignmentRule": "Excel의 동일 행을 12개 언어의 대응 행으로 그대로 보존합니다. 번역/재작성/외부 자료 추가 없음.",
        "units": units,
    }

love_people_full_data = build_love_people_full(love_people_raw)
watchtower_full_data = build_watchtower_full(watchtower_study_raw)

def js_json(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

def empty_like(value):
    """Same-shape empty placeholder for a JW-only constant excluded from a build, so every
    render function that reads it (most have no typeof-undefined guard) sees a real, harmless
    empty value instead of a ReferenceError. See site_profiles.STRUCTURED_EMPTY_SHAPES for the
    3 nested-object constants that need more than a bare [] / {}."""
    if isinstance(value, list):
        return []
    if isinstance(value, dict):
        return {}
    return value

def contains_religious_term(entry):
    text = json.dumps(entry, ensure_ascii=False)
    return any(term in text for term in RELIGIOUS_FILTER_TERMS)

def strip_religious_entries(value):
    """For the handful of otherwise-general word/sentence banks that have a few individually
    embedded religious vocabulary items mixed in (see site_profiles.py docstring), drops just
    those entries rather than excluding the whole constant -- even when they sit several levels
    deep (e.g. RHYME_GROUPS[i]['families'][j]['words'][k], NORTH_SOUTH_DIFFS[i]['examples'][j]).
    Recurses bottom-up: children are cleaned first, then a list drops any item whose (already-
    cleaned) content still contains a banned term. This means only the exact leaf entry with
    religious content is removed, never its unrelated siblings or parent group."""
    if isinstance(value, dict):
        return {k: strip_religious_entries(v) for k, v in value.items()}
    if isinstance(value, list):
        cleaned = [strip_religious_entries(item) for item in value]
        return [item for item in cleaned if not contains_religious_term(item)]
    return value

def scrub_note_fields(value):
    """NUM_LARGE's otherwise-general Vietnamese-number reading list has exactly one entry
    (num=1000) whose supplementary 'note' field references the JW "New World Translation"
    Bible/"our publications" by name -- unlike the word-bank leaks above, dropping the whole
    entry would lose a common, useful number ("1,000") from a general build for one incidental
    sentence. Null out just a contaminated 'note' value; keep num/reading/every other field."""
    if isinstance(value, list):
        return [scrub_note_fields(item) for item in value]
    if isinstance(value, dict):
        out = {}
        for k, v in value.items():
            if k == "note" and v is not None and contains_religious_term(v):
                out[k] = None
            else:
                out[k] = scrub_note_fields(v)
        return out
    return value

def build_data_js(site):
    # One source of truth for all three profiles: GENERAL is the slim profile (JW publication
    # data excluded/filtered); JW gets everything; JEONJU = JW's full data set + its own event
    # layer appended below (GENERAL subset ⊂ JW profile ⊂ JEONJU profile -- jeonju is not
    # "general + event", it inherits the full JW content set unchanged).
    exclude = JW_ONLY_CONSTS if site == "general" else set()
    filter_general = site == "general"

    def emit(name, value):
        if name in exclude:
            value = STRUCTURED_EMPTY_SHAPES.get(name, empty_like(value))
        elif filter_general and name in GENERAL_CONSTS_NEEDING_ENTRY_FILTER:
            value = strip_religious_entries(value)
        return f"const {name} = {js_json(value)};\n"

    parts = ["\n"]
    parts.append(emit("CASES", app_data))
    parts.append(emit("VOCAB_CHAIN", vocab_chain))
    parts.append(emit("VOCAB_GROUPS", vocab_groups))
    parts.append(emit("VOCAB_THEO", vocab_theo))
    parts.append(emit("FREQ_VOCAB", freq_vocab))
    parts.append(emit("RHYME_GROUPS", RHYME_GROUPS))
    parts.append(emit("WORD_ORDER_REVERSED_EXTRA", WORD_ORDER_REVERSED_EXTRA))
    parts.append(emit("TONE_ZH_CORR", TONE_ZH_CORR))
    parts.append(emit("TONES", TONES))
    parts.append(emit("ALPHABET", ALPHABET))
    parts.append(emit("ALPHABET_NOTE", ALPHABET_NOTE))
    parts.append(emit("CONS_SIMPLE", CONSONANTS_SIMPLE))
    parts.append(emit("CONS_COMPLEX", CONSONANTS_COMPLEX))
    parts.append(emit("VOW_SIMPLE", VOWELS_SIMPLE))
    parts.append(emit("VOW_COMPLEX", VOWELS_COMPLEX))
    parts.append(emit("NS_DIFFS", NORTH_SOUTH_DIFFS))
    parts.append(emit("NS_NOTE", NORTH_SOUTH_NOTE))
    parts.append(emit("NS_EXTRA_NOTES", NORTH_SOUTH_EXTRA_NOTES))
    parts.append(emit("BIBLE_OT", BIBLE_BOOKS_OT))
    parts.append(emit("BIBLE_NT", BIBLE_BOOKS_NT))
    parts.append(emit("NUM_BASIC", NUMBERS_BASIC))
    parts.append(emit("NUM_TEEN", NUMBERS_TEEN))
    parts.append(emit("NUM_TENS", NUMBERS_TENS))
    parts.append(emit("NUM_TENS_NOTE", NUMBERS_TENS_NOTE))
    parts.append(emit("NUM_HUNDREDS", NUMBERS_HUNDREDS))
    parts.append(emit("NUM_LARGE", scrub_note_fields(NUMBERS_LARGE) if filter_general else NUMBERS_LARGE))
    parts.append(emit("NUM_SPECIAL", NUMBERS_SPECIAL))
    parts.append(emit("NUM_FORMAT_NOTE", NUMBER_FORMAT_NOTE))
    parts.append(emit("NUM_DECIMAL_EXAMPLE", NUMBER_DECIMAL_EXAMPLE))
    parts.append(emit("TONE_PAIRS", TONE_PAIRS))
    parts.append(emit("GRAMMAR_INTRO", GRAMMAR_INTRO))
    parts.append(emit("GRAMMAR_UNITS", GRAMMAR_UNITS))
    parts.append(emit("SB_PRONOUNS", SB_PRONOUNS))
    parts.append(emit("SB_NOUN_SUBJECTS", SB_NOUN_SUBJECTS))
    parts.append(emit("SB_INTRANS_VERBS", SB_INTRANS_VERBS))
    parts.append(emit("SB_TRANS_VERBS", SB_TRANS_VERBS))
    parts.append(emit("SB_AUX_VERBS", SB_AUX_VERBS))
    parts.append(emit("SB_OBJECT_NOUNS", SB_OBJECT_NOUNS))
    parts.append(emit("SB_ADJECTIVES", SB_ADJECTIVES))
    parts.append(emit("SB_CONNECTIVES", SB_CONNECTIVES))
    parts.append(emit("SB_TIME_ADV", SB_TIME_ADV))
    parts.append(emit("SB_PLACE_ADV", SB_PLACE_ADV))
    parts.append(emit("SB_MANNER_ADV", SB_MANNER_ADV))
    parts.append(emit("SB_SENTENCE_TYPES", SB_SENTENCE_TYPES))
    parts.append(emit("SB_WH_WORDS", SB_WH_WORDS))
    parts.append(emit("SB_COMPLEMENT_NOUNS", SB_COMPLEMENT_NOUNS))
    parts.append(emit("SB_PREPOSITIONS", SB_PREPOSITIONS))
    parts.append(emit("CURR_WELCOME", WELCOME_TEXT))
    parts.append(emit("CURR_PHASES", COURSE_PHASES))
    parts.append(emit("CURR_WEEKS", WEEK16_TOC))
    parts.append(emit("CURR_ASSIGNMENTS", WEEKLY_ASSIGNMENTS))
    parts.append(emit("CULTURE_ARTICLES", CULTURE_ARTICLES))
    parts.append(emit("USAGE_GUIDE_COMMON", USAGE_GUIDE_COMMON))
    parts.append(emit("USAGE_GUIDE_TABS", USAGE_GUIDE_TABS))
    parts.append(emit("OFFER_TALKS", OFFER_TALKS))
    parts.append(emit("KINGDOM_SONGS", KINGDOM_SONGS))
    parts.append(emit("PRAYER_TEMPLATE", PRAYER_TEMPLATE))
    parts.append(emit("NEIGHBOR_CONVERSATIONS", NEIGHBOR_CONVERSATIONS))
    parts.append(emit("DAILY_CONVERSATIONS", DAILY_CONVERSATIONS))
    parts.append(emit("LFF_CONVERSATIONS", LFF_CONVERSATIONS))
    parts.append(emit("LPD_LESSONS", LPD_LESSONS))
    parts.append(emit("BIBLE_NAMES", BIBLE_NAMES))
    parts.append(emit("BASIC_WORD_GROUPS", BASIC_WORD_GROUPS))
    parts.append(emit("ANTONYM_PAIRS", ANTONYM_PAIRS))
    parts.append(emit("SENT_GEN_INTRO", SENTENCE_GEN_INTRO))
    parts.append(emit("SENT_GEN_BANK", SENTENCE_GEN_BANK))
    parts.append(emit("SENT_GEN_STAGES", SENTENCE_GEN_STAGES))
    parts.append(emit("GX_CONNECTIVES", CONNECTIVES))
    parts.append(emit("GX_MOTION_VERBS", MOTION_VERBS))
    parts.append(emit("GX_POS_PREPS", POSITION_PREPS))
    parts.append(emit("GX_POS_EXAMPLES", POSITION_EXAMPLES))
    parts.append(emit("GX_DIRECTION_DIALOGUES", DIRECTION_DIALOGUES))
    parts.append(emit("GRAMMAR_DICT", GRAMMAR_DICT))
    parts.append(emit("DIALECT_WORDS", DIALECT_WORDS))
    parts.append(emit("CAL_MONTHS", MONTHS))
    parts.append(emit("CAL_DAYS", DAYS))
    parts.append(emit("CAL_SEASONS", SEASONS))
    parts.append(emit("CAL_DATES", DATES))
    parts.append(emit("CAL_DATE_ORDER_NOTE", DATE_ORDER_NOTE))
    parts.append(emit("CAL_DATE_MONG_NOTE", DATE_MONG_NOTE))
    parts.append(emit("CAL_YEAR_LE_NOTE", YEAR_LE_NOTE))
    parts.append(emit("TIME_ORDER_NOTE", TIME_ORDER_NOTE))
    parts.append(emit("TIME_RUOI_KEM_NOTE", TIME_RUOI_KEM_NOTE))
    parts.append(emit("TIME_PERIODS", TIME_PERIODS))
    parts.append(emit("TIME_HOURS", TIME_HOURS))
    parts.append(emit("TIME_EXAMPLES", TIME_EXAMPLES))
    parts.append(emit("VOCAB_PLAN", VOCAB_PLAN))
    parts.append(emit("WATCHTOWER_VOCAB", WATCHTOWER_VOCAB))
    parts.append(emit("ENJOY_LIFE_FOREVER", enjoy_life_forever_data))
    parts.append(emit("LOVE_PEOPLE_FULL", love_people_full_data))
    parts.append(emit("WATCHTOWER_FULL", watchtower_full_data))

    if site == "jeonju":
        from jeonju_data import JEONJU_INFO, JEONJU_WEEKS
        parts.append(emit("JEONJU_INFO", JEONJU_INFO))
        parts.append(emit("JEONJU_WEEKS", JEONJU_WEEKS))

    data_js = "".join(parts)

    if site == "general":
        data_js += "const SONGS_DATA = [];\nconst SONG_MEANINGS = {};\n"
    else:
        # jw and jeonju both get the full, identical Kingdom Songs source (same file, same
        # content) -- jeonju is JW's full data set plus its own event layer, not general+songs.
        songs_data_js = open("songs_data.js", encoding="utf-8").read()
        song_meanings_js = open("song_meanings.js", encoding="utf-8").read()
        data_js += "\n" + songs_data_js + "\n" + song_meanings_js + "\n"

    return data_js

if __name__ == "__main__":
    from site_profiles import PRODUCTS

    parser = argparse.ArgumentParser()
    parser.add_argument("--product", choices=list(PRODUCTS.keys()), default="vietnamese",
                         help="Learning-content language/product (only 'vietnamese' is implemented; "
                              "see site_profiles.PRODUCTS for architecture-ready placeholders).")
    parser.add_argument("--site", "--profile", dest="site", choices=["jw", "general", "jeonju"], default="jw",
                         help="Content profile to build: general | jw | jeonju (the vietnamese "
                              "product's event profile). --site is kept as an alias for --profile "
                              "for backward compatibility; default jw preserves prior behavior.")
    args = parser.parse_args()

    if args.product != "vietnamese":
        raise SystemExit(f"--product {args.product!r} is architecture-ready only; no data/content "
                          f"exists for it in this repo (see site_profiles.PRODUCTS).")

    data_js = build_data_js(args.site)
    out_name = "data_block.js" if args.site == "jw" else f"data_block.{args.site}.js"
    open(out_name, "w", encoding="utf-8").write(data_js)
    print(f"[{args.product}/{args.site}] data block bytes:", len(data_js), "->", out_name)

