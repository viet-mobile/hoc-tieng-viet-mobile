import argparse
import json
import os
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
from grammar_data import GRAMMAR_INTRO, GRAMMAR_UNITS, GRAMMAR_A1_A2_PATTERNS
from grammar_a1a2_ai_translations import apply_a1a2_ai_translations
GRAMMAR_A1_A2_PATTERNS = apply_a1a2_ai_translations(GRAMMAR_A1_A2_PATTERNS)  # adds meaning/tr; source fields untouched
from grammar_lessons_ai_translations import apply_grammar_lessons_ai_translations
GRAMMAR_INTRO = apply_grammar_lessons_ai_translations(GRAMMAR_INTRO)  # fills cs/zh_cn/hu/id only where missing
GRAMMAR_UNITS = apply_grammar_lessons_ai_translations(GRAMMAR_UNITS)
from user_words_data import USER_NEW_WORDS
from unified_words_builder import gather_learning_corpus, build_unified_words
from sentence_builder_data import (SB_PRONOUNS, SB_NOUN_SUBJECTS, SB_INTRANS_VERBS, SB_TRANS_VERBS,
                                    SB_AUX_VERBS, SB_OBJECT_NOUNS, SB_ADJECTIVES, SB_CONNECTIVES,
                                    SB_TIME_ADV, SB_PLACE_ADV, SB_MANNER_ADV, SB_SENTENCE_TYPES, SB_WH_WORDS,
                                    SB_COMPLEMENT_NOUNS, SB_PREPOSITIONS)
from curriculum_data import WELCOME_TEXT, COURSE_PHASES, WEEK16_TOC
from culture_data import CULTURE_ARTICLES
from culture_ai_translations import apply_culture_ai_translations
CULTURE_ARTICLES = apply_culture_ai_translations(CULTURE_ARTICLES)  # adds *Tr objects; source fields untouched
from offer_talks_data import OFFER_TALKS, KINGDOM_SONGS, PRAYER_TEMPLATE
from neighbor_conversations_data import NEIGHBOR_CONVERSATIONS
from daily_conversations_data import DAILY_CONVERSATIONS
from daily_conversations_i18n import apply_daily_ai_translations
# Source keeps vi/ko/zh/en/ja; cs/zh_cn/fr/de/hu/id/pl come from the separate AI-translation layer
# (each conversation is tagged with the languages it received in `aiLangs`).
DAILY_CONVERSATIONS = apply_daily_ai_translations(DAILY_CONVERSATIONS)

def normalize_korean_text(s):
    if not s or not isinstance(s, str):
        return s
    import re
    s = re.sub(r'나\s*\(\s*형\s*/\s*오빠\s*\)', '형', s)
    s = re.sub(r'나\s*\(\s*오빠\s*/\s*형\s*\)', '형', s)
    s = re.sub(r'나\s*\(\s*누나\s*/\s*언니\s*\)', '언니', s)
    s = re.sub(r'나\s*\(\s*언니\s*/\s*누나\s*\)', '언니', s)
    s = re.sub(r'나\s*\(\s*형\s*\)', '형', s)
    s = re.sub(r'나\s*\(\s*오빠\s*\)', '오빠', s)
    s = re.sub(r'나\s*\(\s*누나\s*\)', '누나', s)
    s = re.sub(r'나\s*\(\s*언니\s*\)', '언니', s)

    s = re.sub(r'저\s*\(\s*동생\s*\)', '저', s)
    s = re.sub(r'너\s*\(\s*동생\s*\)', '너', s)

    s = re.sub(r'형은\s*/\s*오빠는', '형은', s)
    s = re.sub(r'오빠는\s*/\s*형은', '형은', s)
    s = re.sub(r'누나\s*/\s*언니의', '언니의', s)
    s = re.sub(r'누나의\s*/\s*언니의', '언니의', s)
    s = re.sub(r'언니의\s*/\s*누나의', '언니의', s)
    s = re.sub(r'언니\s*/\s*누나의', '언니의', s)

    s = re.sub(r'형([가-힣]*)\s*/\s*오빠([가-힣]*)', lambda m: '형' + (m.group(1) or m.group(2)), s)
    s = re.sub(r'오빠([가-힣]*)\s*/\s*형([가-힣]*)', lambda m: '형' + (m.group(2) or m.group(1)), s)
    s = re.sub(r'누나([가-힣]*)\s*/\s*언니([가-힣]*)', lambda m: '언니' + (m.group(2) or m.group(1)), s)
    s = re.sub(r'언니([가-힣]*)\s*/\s*누나([가-힣]*)', lambda m: '언니' + (m.group(1) or m.group(2)), s)

    s = re.sub(r'\s*\(\s*(?:동생|가지다\s*의미|의문문\s*요소|건강하게)\s*\)', '', s)

    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\s+([?.!,])', r'\1', s).strip()
    return s

for conv in DAILY_CONVERSATIONS:
    for turn in conv.get("turns", []):
        if "ko" in turn and isinstance(turn["ko"], str):
            turn["ko"] = normalize_korean_text(turn["ko"])

from general_pdf_ai_translations import GENERAL_PDF_SENTENCE_AI_TRANSLATIONS
from lff_data import LFF_CONVERSATIONS
from lpd_data import LPD_LESSONS
from bible_names_data import BIBLE_NAMES
from basic_words_list import BASIC_WORD_GROUPS
from antonym_data import ANTONYM_PAIRS
from sentence_gen_data import SENTENCE_GEN_INTRO, SENTENCE_GEN_BANK, SENTENCE_GEN_STAGES
from grammar_extra_data import CONNECTIVES, MOTION_VERBS, POSITION_PREPS, POSITION_EXAMPLES, DIRECTION_DIALOGUES
from grammar_dict_data import GRAMMAR_DICT, GRAMMAR_B1_B2_PATTERNS
from dialect_words_data import DIALECT_WORDS
from calendar_data import MONTHS, DAYS, SEASONS, DATES, DATE_ORDER_NOTE, DATE_MONG_NOTE, YEAR_LE_NOTE
from word_order_reversed_data import WORD_ORDER_REVERSED_EXTRA
from weekly_assignments_data import WEEKLY_ASSIGNMENTS
from time_data import TIME_ORDER_NOTE, TIME_RUOI_KEM_NOTE, TIME_PERIODS, TIME_HOURS, TIME_EXAMPLES
from vocab_study_plan_data import VOCAB_PLAN
from watchtower_vocab_data import WATCHTOWER_VOCAB
from usage_guide_data import USAGE_GUIDE_COMMON, USAGE_GUIDE_TABS
from course_materials import add_general_materials, remove_jw_event_items
from pronunciation_comparison import build_pron_comparison
from tts_guide_data import TTS_GUIDE, TTS_GUIDE_ORDER

app_data = json.load(open("app_data.json", encoding="utf-8"))
vocab_chain = json.load(open("vocab_chain.json", encoding="utf-8"))
vocab_groups = json.load(open("vocab_groups.json", encoding="utf-8"))
vocab_theo = json.load(open("vocab_theo.json", encoding="utf-8"))
freq_vocab = json.load(open("freq_vocab.json", encoding="utf-8"))
enjoy_life_forever_raw = json.load(open("enjoy_life_forever_data.json", encoding="utf-8"))

ELF_LANG_ORDER = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]

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
            "vi": "Tiếng Việt", "cs": "Čeština", "zh_cn": "中文简体", "zh": "中文繁體", "en": "English",
            "fr": "Français", "de": "Deutsch", "hu": "Magyar", "id": "Bahasa Indonesia", "ja": "日本語",
            "ko": "한국어", "pl": "Polski",
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
    "vi": "Tiếng Việt", "cs": "Čeština", "zh_cn": "中文简体", "zh": "中文繁體", "en": "English",
    "fr": "Français", "de": "Deutsch", "hu": "Magyar", "id": "Bahasa Indonesia", "ja": "日本語",
    "ko": "한국어", "pl": "Polski",
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

def enrich_curated_datasets(lff, lpd, wt, elf_raw, lpd_raw, wt_raw):
    """Enriches curated publications (LFF_CONVERSATIONS, LPD_LESSONS, WATCHTOWER_VOCAB)
    with authoritative translations from the Excel raw sources (Enjoy Life Forever(4).xlsx,
    Love people(3).xlsx, Watchtower Study(3).xlsx) across all 11 target languages:
    cs, zh_cn, zh, en, fr, de, hu, id, ja, ko, pl.
    No translations are fabricated, AI-generated, or backfilled from unrelated sources.
    Only authentic cells from the authoritative publications are attached."""
    import re
    target_langs = ["cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]

    def clean_key(s):
        if not s:
            return ""
        s = s.replace('\xa0', ' ').replace('®', '')
        s = re.sub(r'^\s*\(?\s*(?:[0-9]+|[a-zA-Z])\s*[\.\)]\s*', '', s)
        s = re.sub(r'^[•\-\–—\*\s\d\.\,\(\)]+\s*', '', s)
        s = re.sub(r'\b[a-zA-Z]\b', '', s)
        s = re.sub(r'[\s\.\?!,;:\"\'“”‘’\(\)\[\]\—\-\–]+', ' ', s)
        return s.strip().lower()

    # A curated line is usually ONE sentence, while an Excel row is a whole numbered paragraph
    # ("9 Unser interaktiver Bibelkurs ... (Lies Jakobus 5:11.)"). Copying a row's cell into a
    # curated line is only correct when the row IS that line; when the line is just part of a
    # longer row, only the matching sentence(s) may be taken -- and only when the row splits
    # into the same number of sentences in both languages, so the positions line up. Anything
    # else stays blank rather than attaching the whole paragraph.
    para_num_re = re.compile(r'^\s*\d{1,3}\s+(?=\S)')
    sentence_end_re = re.compile(r'(?<=[.!?…。！？])[”’"」』)]*\s+(?=\S)|(?<=[。！？])(?=\S)')

    def split_row_sentences(text):
        text = para_num_re.sub('', (text or '').replace('\xa0', ' ')).strip()
        return [part.strip() for part in sentence_end_re.split(text) if part and part.strip()]

    def row_translation(vi, row, lang):
        """row[lang] if the row is exactly `vi`; the aligned sentence(s) if `vi` is a run of
        whole sentences inside the row; otherwise None."""
        target = row.get(lang)
        if not target:
            return None
        ck = clean_key(vi)
        row_vi = row.get("vi") or ""
        if clean_key(row_vi) == ck or clean_key(para_num_re.sub('', row_vi)) == ck:
            return para_num_re.sub('', target).strip() if para_num_re.match(row_vi) else target
        vi_parts = split_row_sentences(row_vi)
        tr_parts = split_row_sentences(target)
        if len(vi_parts) < 2 or len(vi_parts) != len(tr_parts):
            return None
        keys = [clean_key(part) for part in vi_parts]
        for i in range(len(keys)):
            for j in range(i, len(keys)):
                if " ".join(k for k in keys[i:j + 1] if k) == ck:
                    return " ".join(tr_parts[i:j + 1])
        return None

    def find_rows(vi, sheet_map, global_map):
        """Candidate rows for `vi`: exact matches first (sheet, then whole book), then rows
        that contain it (a longer paragraph). Rows SHORTER than `vi` are never used."""
        ck = clean_key(vi)
        raw_k = re.sub(r'\s+', ' ', (vi or '').replace('\xa0', ' ')).strip().lower()
        rows = []
        for m in (sheet_map, global_map):
            for key in (raw_k, ck):
                if key and m.get(key) is not None:
                    rows.append(m[key])
        if len(ck) > 10:
            for m in (sheet_map, global_map):
                for k, r in m.items():
                    if len(k) > len(ck) and ck in k:
                        rows.append(r)
        return rows

    def fill_from_rows(field, vi, rows):
        for lang in target_langs:
            if field.get(lang):
                continue
            for r in rows:
                tr = row_translation(vi, r, lang)
                if tr:
                    field[lang] = tr
                    break

    # 1. Enjoy Life Forever -> LFF_CONVERSATIONS
    elf_by_sheet = {}
    elf_global = {}
    for s in elf_raw.get("sheets", []):
        sid = str(s.get("sheet", "")).strip()
        elf_by_sheet[sid] = s.get("rows", [])
        for r in s.get("rows", []):
            vi = r.get("vi") or ""
            ck = clean_key(vi)
            raw_k = re.sub(r'\s+', ' ', vi.replace('\xa0', ' ')).strip().lower()
            if ck and ck not in elf_global:
                elf_global[ck] = r
            if raw_k and raw_k not in elf_global:
                elf_global[raw_k] = r

    for conv in lff:
        sheet_num = str(conv.get("num", "") or "").strip()
        if conv.get("kind") == "review" and conv.get("part"):
            sheet_num = "R" + str(conv.get("part"))
        elif conv.get("kind") == "ready":
            sheet_num = "Ready"
        sheet_rows = elf_by_sheet.get(sheet_num, [])
        sm = {}
        for r in sheet_rows:
            vi = r.get("vi") or ""
            ck = clean_key(vi)
            raw_k = re.sub(r'\s+', ' ', vi.replace('\xa0', ' ')).strip().lower()
            if ck:
                sm[ck] = r
            if raw_k:
                sm[raw_k] = r

        # Title
        if "title" in conv and isinstance(conv["title"], dict):
            t_vi = clean_key(conv["title"].get("vi", ""))
            for r in sheet_rows[:6]:
                if clean_key(r.get("vi", "")) == t_vi:
                    for lang in target_langs:
                        if (lang not in conv["title"] or not conv["title"][lang]) and r.get(lang):
                            conv["title"][lang] = r[lang]
                    break

        # Lines
        for line in conv.get("lines", []):
            vi = line.get("vi") or ""
            if vi:
                fill_from_rows(line, vi, find_rows(vi, sm, elf_global))

    # 2. Love People -> LPD_LESSONS
    lpd_by_sheet = {}
    lpd_global = {}
    for s in lpd_raw.get("sheets", []):
        sid = str(s.get("sheet", "")).strip()
        lpd_by_sheet[sid] = s.get("rows", [])
        for r in s.get("rows", []):
            vi = r.get("vi") or ""
            ck = clean_key(vi)
            raw_k = re.sub(r'\s+', ' ', vi.replace('\xa0', ' ')).strip().lower()
            if ck and ck not in lpd_global:
                lpd_global[ck] = r
            if raw_k and raw_k not in lpd_global:
                lpd_global[raw_k] = r

    for conv in lpd:
        sheet_num = str(conv.get("num", "") or "").strip()
        if conv.get("kind") == "appendix":
            sheet_num = "Appendix " + sheet_num
        sheet_rows = lpd_by_sheet.get(sheet_num, [])
        sm = {}
        for r in sheet_rows:
            vi = r.get("vi") or ""
            ck = clean_key(vi)
            raw_k = re.sub(r'\s+', ' ', vi.replace('\xa0', ' ')).strip().lower()
            if ck:
                sm[ck] = r
            if raw_k:
                sm[raw_k] = r

        # Title
        if "title" in conv and isinstance(conv["title"], dict):
            t_vi = clean_key(conv["title"].get("vi", ""))
            for r in sheet_rows[:6]:
                if clean_key(r.get("vi", "")) == t_vi:
                    for lang in target_langs:
                        if (lang not in conv["title"] or not conv["title"][lang]) and r.get(lang):
                            conv["title"][lang] = r[lang]
                    break

        # Lines
        for line in conv.get("lines", []):
            vi = line.get("vi") or ""
            if vi:
                fill_from_rows(line, vi, find_rows(vi, sm, lpd_global))

    # 3. Watchtower Study -> WATCHTOWER_VOCAB
    wt_global = {}
    wt_by_week = {}
    for s in wt_raw.get("sheets", []):
        sid = str(s.get("sheet", "")).strip()
        wt_by_week[sid] = s.get("rows", [])
        for r in s.get("rows", []):
            vi = r.get("vi") or ""
            ck = clean_key(vi)
            raw_k = re.sub(r'\s+', ' ', vi.replace('\xa0', ' ')).strip().lower()
            if ck and ck not in wt_global:
                wt_global[ck] = r
            if raw_k and raw_k not in wt_global:
                wt_global[raw_k] = r

    for wk in wt:
        week_num = str(wk.get("week", "") or "").strip()
        sheet_rows = wt_by_week.get(week_num, [])

        # Date range
        if "date_range" in wk and isinstance(wk["date_range"], dict) and sheet_rows:
            r0 = sheet_rows[0]
            for lang in target_langs:
                if (lang not in wk["date_range"] or not wk["date_range"][lang]) and r0.get(lang):
                    wk["date_range"][lang] = r0[lang]

        # Article title: each weekly sheet opens with the date line, the "BÀI HÁT <n> ..." song
        # line, then the article title -- only attached when that layout is actually present.
        if len(sheet_rows) >= 3 and (sheet_rows[1].get("vi") or "").startswith("BÀI HÁT"):
            title_row = sheet_rows[2]
            wk["article_title"] = {lang: title_row[lang] for lang in ["vi"] + target_langs if title_row.get(lang)}

        # Word example sentences
        for word in wk.get("words", []):
            ex = word.get("example") or ""
            if ex:
                week_map = {}
                for r in sheet_rows:
                    rv = r.get("vi") or ""
                    for key in (clean_key(rv), re.sub(r'\s+', ' ', rv.replace('\xa0', ' ')).strip().lower()):
                        if key:
                            week_map.setdefault(key, r)
                rows = find_rows(ex, week_map, wt_global)
                if rows:
                    fill_from_rows(word.setdefault("example_mean", {}), ex, rows)

# Enrich curated publications with 12-language authoritative Excel translations
enrich_curated_datasets(
    LFF_CONVERSATIONS, LPD_LESSONS, WATCHTOWER_VOCAB,
    enjoy_life_forever_raw, love_people_raw, watchtower_study_raw
)

jw_extraction_data_path = os.path.join(os.path.dirname(__file__), "jw_extraction", "data", "derived_jw_data.json")
if os.path.exists(jw_extraction_data_path):
    with open(jw_extraction_data_path, "r", encoding="utf-8") as f:
        jw_extraction_data = json.load(f)
else:
    jw_extraction_data = None

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

def filter_general_curriculum(welcome, phases, weeks):
    """Keep the language-learning course in GENERAL while removing JW-only study items."""
    blocked_terms = (
        "행누", "랑제", "졸업", "집회", "봉사", "회중", "성서 연구", "파수대", "연설",
        "제공", "성경 책명", "성서 책명", "성경 찾기", "성경구절", "노래", "신권", "인명", "기도 준비",
    )
    blocked_links = {
        ("sentence", "wt"),
        ("wizard", "talks"),
        ("vocab", "theo"),
        ("vocab", "names"),
        ("bible", "books"),
        ("curriculum", "song"),
        ("curriculum", "prayer"),
    }

    # Every subtab GENERAL's HTML drops (site_profiles.NON_JW_HTML_REMOVALS) is also a dead
    # course shortcut target there.
    from site_profiles import NON_JW_HTML_REMOVALS
    for removal in NON_JW_HTML_REMOVALS["subtabs"]:
        for value in removal["values"]:
            blocked_links.add((removal["attr"][len("data-"):], value))

    def is_blocked(item):
        link = item.get("link") or {}
        if (link.get("subAttr"), link.get("subVal")) in blocked_links:
            return True
        return any(term in json.dumps(item, ensure_ascii=False) for term in blocked_terms)

    filtered_welcome = dict(welcome)
    filtered_welcome["body"] = [
        body for body in welcome.get("body", [])
        if not any(term in json.dumps(body, ensure_ascii=False) for term in blocked_terms)
    ]
    filtered_phases = []
    for phase in phases:
        filtered_body = [
            body for body in phase.get("body", [])
            if not any(term in json.dumps(body, ensure_ascii=False) for term in blocked_terms)
        ]
        if filtered_body:
            kept_phase = dict(phase)
            kept_phase["body"] = filtered_body
            filtered_phases.append(kept_phase)
    filtered_weeks = []
    for week in weeks:
        kept_week = dict(week)
        for field in ("title", "note"):
            if field in kept_week and any(term in json.dumps(kept_week[field], ensure_ascii=False) for term in blocked_terms):
                kept_week.pop(field)
        kept_week["items"] = [item for item in week.get("items", []) if not is_blocked(item)]
        filtered_weeks.append(kept_week)
    return filtered_welcome, filtered_phases, filtered_weeks

def build_data_js(site):
    # One source of truth for all three profiles: GENERAL is the slim profile (JW publication
    # data excluded/filtered); JW gets everything; JEONJU = JW's full data set + its own event
    # layer appended below (GENERAL subset ⊂ JW profile ⊂ JEONJU profile -- jeonju is not
    # "general + event", it inherits the full JW content set unchanged).
    exclude = JW_ONLY_CONSTS if site == "general" else set()
    filter_general = site == "general"
    general_curriculum_names = {"CURR_WELCOME", "CURR_PHASES", "CURR_WEEKS", "CURR_ASSIGNMENTS"}

    def emit(name, value):
        if name in exclude and not (filter_general and name in general_curriculum_names):
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
    parts.append(emit("PRON_COMPARISON", build_pron_comparison()))
    parts.append(emit("TTS_GUIDE", {"order": TTS_GUIDE_ORDER, "langs": TTS_GUIDE}))
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
    curr_welcome = WELCOME_TEXT
    curr_phases = COURSE_PHASES
    curr_weeks = WEEK16_TOC
    curr_assignments = WEEKLY_ASSIGNMENTS

    if site == "jeonju":
        import jeonju_data
        if getattr(jeonju_data, "JEONJU_CURR_WELCOME", None) is not None:
            curr_welcome = jeonju_data.JEONJU_CURR_WELCOME
        if getattr(jeonju_data, "JEONJU_CURR_PHASES", None) is not None:
            curr_phases = jeonju_data.JEONJU_CURR_PHASES
        if getattr(jeonju_data, "JEONJU_CURR_WEEKS", None) is not None:
            curr_weeks = jeonju_data.JEONJU_CURR_WEEKS
        if getattr(jeonju_data, "JEONJU_CURR_ASSIGNMENTS", None) is not None:
            curr_assignments = jeonju_data.JEONJU_CURR_ASSIGNMENTS
    elif site == "ulsan":
        import ulsan_data
        if getattr(ulsan_data, "ULSAN_CURR_WELCOME", None) is not None:
            curr_welcome = ulsan_data.ULSAN_CURR_WELCOME
        if getattr(ulsan_data, "ULSAN_CURR_PHASES", None) is not None:
            curr_phases = ulsan_data.ULSAN_CURR_PHASES
        if getattr(ulsan_data, "ULSAN_CURR_WEEKS", None) is not None:
            curr_weeks = ulsan_data.ULSAN_CURR_WEEKS
        if getattr(ulsan_data, "ULSAN_CURR_ASSIGNMENTS", None) is not None:
            curr_assignments = ulsan_data.ULSAN_CURR_ASSIGNMENTS

    if filter_general:
        curr_welcome, curr_phases, curr_weeks = filter_general_curriculum(
            curr_welcome, curr_phases, curr_weeks
        )
        curr_assignments = []
        # GENERAL shows no class welcome ("...학습반에 오신 여러분을 환영합니다") at all.
        curr_welcome, curr_phases = {"title": None, "body": []}, []
        curr_weeks = [dict(w, title=None) if w.get("week") == 0 else w for w in curr_weeks]

    # General materials spread over the 16 course weeks (see course_materials.py). ULSAN's static
    # weeks are intentionally empty (its course is configured through the regional admin), so it
    # is left alone; GENERAL gets no neighbor dialogues (JW content).
    if site != "ulsan":
        from jw_extraction.engine import ExtractionEngine as GeneralPdfEngine
        general_pdf_rows = GeneralPdfEngine(profile="general").load_general_output()["learningData"]
        material_counts = {
            "daily": len(DAILY_CONVERSATIONS),
            "culture": len(CULTURE_ARTICLES),
            "pdf_sentence": len(general_pdf_rows.get("sentences") or []),
            "pdf_grammar": len(general_pdf_rows.get("grammar") or []),
        }
        if site != "general":
            material_counts["neighbor"] = len(NEIGHBOR_CONVERSATIONS)
        curr_weeks, curr_assignments = add_general_materials(curr_weeks, curr_assignments, material_counts)
    if site == "jw":
        curr_weeks, curr_assignments = remove_jw_event_items(curr_weeks, curr_assignments)

    parts.append(emit("CURR_WELCOME", curr_welcome))
    parts.append(emit("CURR_PHASES", curr_phases))
    parts.append(emit("CURR_WEEKS", curr_weeks))
    parts.append(emit("CURR_ASSIGNMENTS", curr_assignments))
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

    corpus_text = gather_learning_corpus(
        site, DAILY_CONVERSATIONS, OFFER_TALKS, NEIGHBOR_CONVERSATIONS,
        LFF_CONVERSATIONS, LPD_LESSONS, WATCHTOWER_VOCAB,
        GRAMMAR_INTRO, GRAMMAR_UNITS, GRAMMAR_DICT,
        CONNECTIVES, MOTION_VERBS, POSITION_EXAMPLES, DIRECTION_DIALOGUES,
        GRAMMAR_A1_A2_PATTERNS, GRAMMAR_B1_B2_PATTERNS, CULTURE_ARTICLES
    )
    unified_words = build_unified_words(
        site, BASIC_WORD_GROUPS, freq_vocab, vocab_theo, BIBLE_NAMES,
        RHYME_GROUPS, WORD_ORDER_REVERSED_EXTRA, vocab_groups, ANTONYM_PAIRS,
        USER_NEW_WORDS, corpus_text, RELIGIOUS_FILTER_TERMS,
        dialect_words=DIALECT_WORDS
    )
    from jw_extraction.engine import ExtractionEngine
    from general_pdf_data import merge_pdf_words
    pdf_learning = ExtractionEngine(profile="general").load_general_output()["learningData"]
    unified_words = merge_pdf_words(unified_words, pdf_learning["words"])
    parts.append(emit("GENERAL_PDF", pdf_learning))
    # The PDF source only has vi/ko; GENERAL_PDF stays exactly as extracted. Machine translations of its
    # sentences (keyed by sentence id, never "ko"/"vi") are a separate constant.
    parts.append(emit("GENERAL_PDF_AI_TRANSLATIONS", GENERAL_PDF_SENTENCE_AI_TRANSLATIONS))
    # Machine translations of the [일반 문법] sections ("<grammar id>#<section index>" -> lang -> {t, b}); the
    # Vietnamese inside each text is marked with ⟦ ⟧. Source grammar records stay as extracted.
    with open("general_pdf_grammar_ai_translations.json", encoding="utf-8") as f:
        parts.append(emit("GENERAL_PDF_GRAMMAR_AI", json.load(f)))
    parts.append(emit("UNIFIED_WORDS", unified_words))
    parts.append(emit("GRAMMAR_A1_A2_PATTERNS", GRAMMAR_A1_A2_PATTERNS))
    parts.append(emit("GRAMMAR_B1_B2_PATTERNS", GRAMMAR_B1_B2_PATTERNS))
    parts.append(emit("JW_EXTRACTION_DATA", jw_extraction_data))

    if site == "jw":
        # JW shows the course content without calendar dates (dates belong to the regional sites).
        parts.append(emit("JW_COURSE_DATE_LABELS", {k: f"{k + 1}주" for k in range(16)}))
        parts.append(emit("JW_COURSE_BREAK_LABELS", {
            "-1.5": "방학",
            "-2.5": "천안 베트남어 순회대회 파이오니아 모임",
            "-3.5": "군산 한국어 순회대회"
        }))
    elif site == "jeonju":
        import jeonju_data
        parts.append(emit("JEONJU_INFO", jeonju_data.JEONJU_INFO))
        parts.append(emit("JEONJU_WEEKS", getattr(jeonju_data, "JEONJU_WEEKS", [])))
        parts.append(emit("REGIONAL_SCHEDULE", {
            "preliminaryMeetingDate": jeonju_data.JEONJU_PRELIMINARY_DATE,
            "courseStartDate": jeonju_data.JEONJU_COURSE_START_DATE,
            "courseEndDate": jeonju_data.JEONJU_COURSE_END_DATE,
            "intervalDays": jeonju_data.JEONJU_INTERVAL_DAYS,
            "cancellations": jeonju_data.JEONJU_CANCELLATIONS,
        }))
    elif site == "ulsan":
        import ulsan_data
        parts.append(emit("ULSAN_INFO", ulsan_data.ULSAN_INFO))
        parts.append(emit("ULSAN_WEEKS", getattr(ulsan_data, "ULSAN_WEEKS", [])))
        parts.append(emit("REGIONAL_SCHEDULE", {
            "preliminaryMeetingDate": ulsan_data.ULSAN_PRELIMINARY_DATE,
            "courseStartDate": ulsan_data.ULSAN_COURSE_START_DATE,
            "courseEndDate": ulsan_data.ULSAN_COURSE_END_DATE,
            "intervalDays": ulsan_data.ULSAN_INTERVAL_DAYS,
            "cancellations": ulsan_data.ULSAN_CANCELLATIONS,
        }))

    data_js = "".join(parts)

    if site == "general":
        data_js += "const SONGS_DATA = [];\nconst SONG_MEANINGS = {};\n"
    else:
        # jw, jeonju, and ulsan get the full, identical Kingdom Songs source (same file, same
        # content) -- regional profiles are JW's full data set plus their own event layer.
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
    parser.add_argument("--site", "--profile", dest="site", choices=["jw", "general", "jeonju", "ulsan", "all"], default="general",
                         help="Content profile to build: general | jw | jeonju | ulsan | all. "
                              "--site is kept as an alias for --profile for backward compatibility; "
                              "default general (the GENERAL Pages project's build); use --profile all locally.")
    args = parser.parse_args()

    if args.product != "vietnamese":
        raise SystemExit(f"--product {args.product!r} is architecture-ready only; no data/content "
                          f"exists for it in this repo (see site_profiles.PRODUCTS).")

    sites = ["general", "jw", "jeonju", "ulsan"] if args.site == "all" else [args.site]
    for s in sites:
        data_js = build_data_js(s)
        out_name = "data_block.js" if s == "jw" else f"data_block.{s}.js"
        open(out_name, "w", encoding="utf-8").write(data_js)
        print(f"[{args.product}/{s}] data block bytes:", len(data_js), "->", out_name)
