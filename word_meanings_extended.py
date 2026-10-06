"""Curated [어휘] meanings for zh_cn / cs / hu / id (word_meanings_extended.json).

Build-time data layer, not a runtime fallback. Entries are keyed by "vi|ko" so every sense of a
homonym keeps its own meaning. Each language value is [meaning, method, basis]; the methods are
listed in the JSON. Entries in "review_required" are deliberately left without a meaning.

Only languages that a word does not have yet are filled: existing meanings (Excel/PDF/JW sources,
WORD_MEANING_OVERRIDES) are never replaced, and the source datasets are not modified -- the [어휘]
source lists get the meanings on a copy made for emitting.
"""
import copy
import json
import os

EXTENDED_LANGS = ("zh_cn", "cs", "hu", "id")
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "word_meanings_extended.json")

_DATA = None


def load_extended_meanings(path=DATA_FILE):
    global _DATA
    if path != DATA_FILE:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    if _DATA is None:
        with open(path, encoding="utf-8") as f:
            _DATA = json.load(f)
    return _DATA


def sense_key(vi, meaning):
    return f'{vi}|{(meaning or {}).get("ko", "")}'


def _missing_meanings(vi, meaning, data):
    """Meanings to add to one {"ko": ...} dict: cs/hu/id by the exact "vi|ko" sense, zh_cn from its own zh."""
    if not isinstance(meaning, dict):
        return {}
    entry = data["entries"].get(sense_key(vi, meaning))
    add = {}
    for lang in ("cs", "hu", "id"):
        value = entry and entry["m"].get(lang)
        if value and value[0] and not meaning.get(lang):
            add[lang] = value[0]
    if not meaning.get("zh_cn") and meaning.get("zh"):
        zh_cn = data["zh_cn_by_zh"].get(meaning["zh"])
        if zh_cn is None and entry and entry["m"].get("zh_cn"):
            zh_cn = entry["m"]["zh_cn"][0]
        if zh_cn:
            add["zh_cn"] = zh_cn
    return add


def apply_extended_meanings(words, data=None):
    """Fill missing zh_cn/cs/hu/id meanings in UNIFIED_WORDS from the curated layer; returns the count filled."""
    data = data or load_extended_meanings()
    entries = data["entries"]
    filled = 0
    for word in words:
        entry = entries.get(sense_key(word["vi"], word.get("kr")))
        if not entry:
            continue
        missing = {lang: value[0] for lang, value in entry["m"].items()
                   if lang in EXTENDED_LANGS and value[0] and not word.get("kr", {}).get(lang)}
        if missing:
            # Copy the kr dict first: it can be shared with a source dataset whose own tabs must stay unchanged.
            word["kr"] = dict(word.get("kr", {}), **missing)
            filled += len(missing)
    return filled


# Where each [어휘] source list keeps its Vietnamese word and meaning dict(s).
DATASET_FIELDS = {
    "VOCAB_GROUPS": ("groups", [("word", "meaning")]),
    "VOCAB_CHAIN": ("items", [("word", "meaning")]),
    "VOCAB_THEO": ("items", [("word", "meaning")]),
    "FREQ_VOCAB": ("items", [("vi", "kr")]),
    "BIBLE_NAMES": ("items", [("vi", "kr")]),
    "BASIC_WORD_GROUPS": ("groups", [("vi", "kr")]),
    "ANTONYM_PAIRS": ("items", [("vi1", "kr1"), ("vi2", "kr2")]),
    "DIALECT_WORDS": ("dialect", None),
    # 한자음 lists: each word's reading gloss ("세울 건") is one sense of that word + hanja.
    "RHYME_GROUPS": ("rhyme_groups", None),
    "WORD_ORDER_REVERSED_EXTRA": ("rhyme_words", None),
}


def _hanja_gloss_keys(word):
    """Sense keys of a 한자음 word: "kiến|세울 건(建)", as UNIFIED_WORDS shows the reading with its hanja."""
    ko = word["gloss"].get("ko", "")
    hanja = word.get("hanja") or ""
    keys = [f'{word["word"]}|{ko}({hanja})'] if hanja else []
    if hanja and ko.endswith(")") and "(" in ko:
        # "모 방(방향)" is shown as "모 방(方, 방향)".
        head, note = ko[:-1].split("(", 1)
        keys.append(f'{word["word"]}|{head}({hanja}, {note})')
    if not hanja:
        keys.append(f'{word["word"]}|{ko}')
    return keys


def _fill_hanja_gloss(word, data):
    gloss = word.get("gloss")
    if not isinstance(gloss, dict):
        return
    entry = next((data["entries"][k] for k in _hanja_gloss_keys(word) if k in data["entries"]), None)
    if entry is None and word.get("hanja"):
        # A reading gloss listed without its hanja ("밥 식·심을 식" for 食/植): the same sense only when that
        # entry has the same hanja.
        plain = data["entries"].get(f'{word["word"]}|{word["gloss"].get("ko", "")}')
        entry = plain if plain and plain.get("hanja") == word["hanja"] else None
    add = {}
    for lang in ("cs", "hu", "id"):
        value = entry and entry["m"].get(lang)
        if value and value[0] and not gloss.get(lang):
            add[lang] = value[0]
    if not gloss.get("zh_cn") and gloss.get("zh") and data["zh_cn_by_zh"].get(gloss["zh"]):
        add["zh_cn"] = data["zh_cn_by_zh"][gloss["zh"]]
    if add:
        word["gloss"] = dict(gloss, **add)


EXAMPLE_EXTRA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rhyme_example_meanings_extra.json")
_EXTRA = None


def _example_extra():
    global _EXTRA
    if _EXTRA is None:
        with open(EXAMPLE_EXTRA_FILE, encoding="utf-8") as f:
            _EXTRA = json.load(f)
    return _EXTRA


def _fill_example_mean(word, data):
    """The missing zh_cn / cs / hu / id meanings of a 한자음 word's EXAMPLE (example_mean), from the curated sense of that
    example word ("ca sĩ|가수"), then from rhyme_example_meanings_extra.json; zh_cn from the example's own zh. Existing
    meanings are never replaced; an example without a sense stays without the language (the page reads no other language)."""
    em = word.get("example_mean")
    if not isinstance(em, dict) or not word.get("example") or not em.get("ko"):
        return
    key = f'{word["example"]}|{em["ko"]}'
    extra = _example_extra()
    entry = data["entries"].get(key)
    add = {}
    for lang in ("cs", "hu", "id"):
        value = (entry and entry["m"].get(lang) and entry["m"][lang][0]) or extra["entries"].get(key, {}).get(lang)
        if value and not em.get(lang):
            add[lang] = value
    if not em.get("zh_cn") and em.get("zh"):
        zh_cn = data["zh_cn_by_zh"].get(em["zh"]) or extra["zh_cn_by_zh"].get(em["zh"]) or \
            (entry and entry["m"].get("zh_cn") and entry["m"]["zh_cn"][0])
        if zh_cn:
            add["zh_cn"] = zh_cn
    if add:
        word["example_mean"] = dict(em, **add)


def with_extended_meanings(name, dataset, data=None):
    """A copy of an [어휘] source list with missing zh_cn/cs/hu/id meanings filled (the original is untouched)."""
    data = data or load_extended_meanings()
    shape, pairs = DATASET_FIELDS[name]
    out = copy.deepcopy(dataset)
    if shape in ("rhyme_groups", "rhyme_words"):
        words = [w for g in out for f in g["families"] for w in f["words"]] if shape == "rhyme_groups" else out
        for word in words:
            _fill_hanja_gloss(word, data)
            _fill_example_mean(word, data)
        return out
    if shape == "groups":
        records = [w for g in out for w in g["words"]]
    else:
        records = out
    for rec in records:
        if shape == "dialect":
            # One meaning shared by the northern and southern word: the northern sense decides, else the southern.
            meaning = rec.get("mean")
            add = {}
            for form in (rec.get("north", ""), rec.get("south", "")):
                add = _missing_meanings(form.split("/")[0], meaning, data)
                if any(lang in add for lang in ("cs", "hu", "id")):
                    break
            if add:
                rec["mean"] = dict(meaning, **add)
            continue
        for vi_field, meaning_field in pairs:
            add = _missing_meanings(rec.get(vi_field, ""), rec.get(meaning_field), data)
            if add:
                rec[meaning_field] = dict(rec[meaning_field], **add)
    return out
