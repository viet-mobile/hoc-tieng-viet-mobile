import json
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

def js_json(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

DATA_JS = f"""
const CASES = {js_json(app_data)};
const VOCAB_CHAIN = {js_json(vocab_chain)};
const VOCAB_GROUPS = {js_json(vocab_groups)};
const VOCAB_THEO = {js_json(vocab_theo)};
const FREQ_VOCAB = {js_json(freq_vocab)};
const RHYME_GROUPS = {js_json(RHYME_GROUPS)};
const WORD_ORDER_REVERSED_EXTRA = {js_json(WORD_ORDER_REVERSED_EXTRA)};
const TONE_ZH_CORR = {js_json(TONE_ZH_CORR)};
const TONES = {js_json(TONES)};
const ALPHABET = {js_json(ALPHABET)};
const ALPHABET_NOTE = {js_json(ALPHABET_NOTE)};
const CONS_SIMPLE = {js_json(CONSONANTS_SIMPLE)};
const CONS_COMPLEX = {js_json(CONSONANTS_COMPLEX)};
const VOW_SIMPLE = {js_json(VOWELS_SIMPLE)};
const VOW_COMPLEX = {js_json(VOWELS_COMPLEX)};
const NS_DIFFS = {js_json(NORTH_SOUTH_DIFFS)};
const NS_NOTE = {js_json(NORTH_SOUTH_NOTE)};
const NS_EXTRA_NOTES = {js_json(NORTH_SOUTH_EXTRA_NOTES)};
const BIBLE_OT = {js_json(BIBLE_BOOKS_OT)};
const BIBLE_NT = {js_json(BIBLE_BOOKS_NT)};
const NUM_BASIC = {js_json(NUMBERS_BASIC)};
const NUM_TEEN = {js_json(NUMBERS_TEEN)};
const NUM_TENS = {js_json(NUMBERS_TENS)};
const NUM_TENS_NOTE = {js_json(NUMBERS_TENS_NOTE)};
const NUM_HUNDREDS = {js_json(NUMBERS_HUNDREDS)};
const NUM_LARGE = {js_json(NUMBERS_LARGE)};
const NUM_SPECIAL = {js_json(NUMBERS_SPECIAL)};
const NUM_FORMAT_NOTE = {js_json(NUMBER_FORMAT_NOTE)};
const NUM_DECIMAL_EXAMPLE = {js_json(NUMBER_DECIMAL_EXAMPLE)};
const TONE_PAIRS = {js_json(TONE_PAIRS)};
const GRAMMAR_INTRO = {js_json(GRAMMAR_INTRO)};
const GRAMMAR_UNITS = {js_json(GRAMMAR_UNITS)};
const SB_PRONOUNS = {js_json(SB_PRONOUNS)};
const SB_NOUN_SUBJECTS = {js_json(SB_NOUN_SUBJECTS)};
const SB_INTRANS_VERBS = {js_json(SB_INTRANS_VERBS)};
const SB_TRANS_VERBS = {js_json(SB_TRANS_VERBS)};
const SB_AUX_VERBS = {js_json(SB_AUX_VERBS)};
const SB_OBJECT_NOUNS = {js_json(SB_OBJECT_NOUNS)};
const SB_ADJECTIVES = {js_json(SB_ADJECTIVES)};
const SB_CONNECTIVES = {js_json(SB_CONNECTIVES)};
const SB_TIME_ADV = {js_json(SB_TIME_ADV)};
const SB_PLACE_ADV = {js_json(SB_PLACE_ADV)};
const SB_MANNER_ADV = {js_json(SB_MANNER_ADV)};
const SB_SENTENCE_TYPES = {js_json(SB_SENTENCE_TYPES)};
const SB_WH_WORDS = {js_json(SB_WH_WORDS)};
const SB_COMPLEMENT_NOUNS = {js_json(SB_COMPLEMENT_NOUNS)};
const SB_PREPOSITIONS = {js_json(SB_PREPOSITIONS)};
const CURR_WELCOME = {js_json(WELCOME_TEXT)};
const CURR_PHASES = {js_json(COURSE_PHASES)};
const CURR_WEEKS = {js_json(WEEK16_TOC)};
const CURR_ASSIGNMENTS = {js_json(WEEKLY_ASSIGNMENTS)};
const CULTURE_ARTICLES = {js_json(CULTURE_ARTICLES)};
const USAGE_GUIDE_COMMON = {js_json(USAGE_GUIDE_COMMON)};
const USAGE_GUIDE_TABS = {js_json(USAGE_GUIDE_TABS)};
const OFFER_TALKS = {js_json(OFFER_TALKS)};
const KINGDOM_SONGS = {js_json(KINGDOM_SONGS)};
const PRAYER_TEMPLATE = {js_json(PRAYER_TEMPLATE)};
const NEIGHBOR_CONVERSATIONS = {js_json(NEIGHBOR_CONVERSATIONS)};
const LFF_CONVERSATIONS = {js_json(LFF_CONVERSATIONS)};
const LPD_LESSONS = {js_json(LPD_LESSONS)};
const BIBLE_NAMES = {js_json(BIBLE_NAMES)};
const BASIC_WORD_GROUPS = {js_json(BASIC_WORD_GROUPS)};
const ANTONYM_PAIRS = {js_json(ANTONYM_PAIRS)};
const SENT_GEN_INTRO = {js_json(SENTENCE_GEN_INTRO)};
const SENT_GEN_BANK = {js_json(SENTENCE_GEN_BANK)};
const SENT_GEN_STAGES = {js_json(SENTENCE_GEN_STAGES)};
const GX_CONNECTIVES = {js_json(CONNECTIVES)};
const GX_MOTION_VERBS = {js_json(MOTION_VERBS)};
const GX_POS_PREPS = {js_json(POSITION_PREPS)};
const GX_POS_EXAMPLES = {js_json(POSITION_EXAMPLES)};
const GX_DIRECTION_DIALOGUES = {js_json(DIRECTION_DIALOGUES)};
const GRAMMAR_DICT = {js_json(GRAMMAR_DICT)};
const DIALECT_WORDS = {js_json(DIALECT_WORDS)};
const CAL_MONTHS = {js_json(MONTHS)};
const CAL_DAYS = {js_json(DAYS)};
const CAL_SEASONS = {js_json(SEASONS)};
const CAL_DATES = {js_json(DATES)};
const CAL_DATE_ORDER_NOTE = {js_json(DATE_ORDER_NOTE)};
const CAL_DATE_MONG_NOTE = {js_json(DATE_MONG_NOTE)};
const CAL_YEAR_LE_NOTE = {js_json(YEAR_LE_NOTE)};
const TIME_ORDER_NOTE = {js_json(TIME_ORDER_NOTE)};
const TIME_RUOI_KEM_NOTE = {js_json(TIME_RUOI_KEM_NOTE)};
const TIME_PERIODS = {js_json(TIME_PERIODS)};
const TIME_HOURS = {js_json(TIME_HOURS)};
const TIME_EXAMPLES = {js_json(TIME_EXAMPLES)};
const VOCAB_PLAN = {js_json(VOCAB_PLAN)};
const WATCHTOWER_VOCAB = {js_json(WATCHTOWER_VOCAB)};
"""

open("data_block.js", "w", encoding="utf-8").write(DATA_JS)
print("data block bytes:", len(DATA_JS))
