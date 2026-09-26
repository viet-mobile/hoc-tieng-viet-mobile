# -*- coding: utf-8 -*-
"""Sentence-level records for the target-language sites (ELF / LPD / WT).

A source row is one paragraph in 12 row-aligned languages. It becomes one record per sentence of the
target language, and a UI language's text is attached to a sentence only when that correspondence is
certain:

  * the row's target text is a single sentence -> the other language's whole row is its counterpart;
  * otherwise both texts are segmented and paired by position ONLY when they have the same number of
    sentences and every pair agrees on the checks in _pair_ok (question vs statement, the same numbers /
    verse references, a similar share of the paragraph's length);
  * anything else -> no text for that language (the site shows "translation unavailable"). Never another
    sentence's text, another language, or the whole paragraph for one of several sentences.

A leading paragraph/question number ("9 ", "2. ", "2．") is dropped only when every language of the row
starts with that same number. The source data is not modified; this runs at build time and is
deterministic.
"""
import re

CJK_LANGS = {"zh", "zh_cn", "ja"}
CLOSERS = "\"'”’»›」』）)]】〉》"
OPENERS = "\"'“‘«‹「『（([【〈《"
LATIN_TERMINALS = ".?!"
CJK_TERMINALS = "。？！?!"
# Tokens ending in "." that do not end a sentence (compared in lower case, without the final ".").
ABBREVIATIONS = {
    "mr", "mrs", "ms", "dr", "st", "jr", "sr", "vs", "etc", "e.g", "i.e", "no", "nos", "p", "pp", "vol", "ch", "chap",
    "ver", "vers", "ft", "a.m", "p.m", "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
    "gen", "ex", "lev", "num", "deut", "matt", "rom", "cor", "gal", "eph", "phil", "col", "thess", "tim", "heb", "jas",
    "pet", "rev", "ps", "prov", "eccl", "isa", "jer", "ezek", "dan", "hos", "mic", "zech", "mal", "lu", "joh", "apg",
    # de / fr / cs / pl / hu / id / vi
    "z", "b", "d", "h", "usw", "bzw", "vgl", "s", "nr", "ca", "ggf", "evtl", "u.a", "z.b", "d.h", "m", "mme", "cf", "av",
    "tzv", "tj", "např", "atd", "apod", "np", "tzn", "itd", "itp", "m.in", "r", "pl", "stb", "ún", "dll", "dsb", "tn",
    "ny", "hlm", "sdr", "v.v", "tr", "ô", "bà",
}
# Abbreviations only before a number ("No. 5", "p. 12"); elsewhere "No." is an answer ("No. Paul's letter ...").
BEFORE_NUMBER = {"no", "nos", "p", "pp", "vol", "ch", "chap", "ver", "vers", "nr", "s", "r"}
# Languages that write ordinals as "1." (German "1. Mose", Hungarian "21. század"): a 1-2 digit number with a
# period is not a sentence end there.
ORDINAL_LANGS = {"de", "cs", "hu", "pl"}


def _paren_end(text, i):
    """Index just past the parenthetical starting at text[i] ("(" or "（"), or -1 (at most 80 chars)."""
    close = ")" if text[i] == "(" else "）"
    j = text.find(close, i + 1, i + 81)
    return j + 1 if j >= 0 else -1


def _skip_closers(text, i):
    while i < len(text) and text[i] in CLOSERS:
        i += 1
    return i


def _latin_boundary(text, i, lang):
    """text[i] is a Latin terminal. Returns the end index of the sentence, or -1 if it is not a boundary."""
    end = _skip_closers(text, i + 1)
    if end >= len(text) or not text[end].isspace():
        return -1
    if text[i] == ".":
        token = text[:i].split()[-1] if text[:i].split() else ""
        word = token.lstrip(OPENERS).lower()
        nxt_char = text[end:].lstrip()[:1]
        # A single letter before "." is an initial or a list label ("J. Smith", "a.", "ㄱ."), but a one-syllable
        # Korean word ends a sentence ("…사용하는 일. 그런 다음 …", "…받을 때. 간단히 …").
        initial = len(word) == 1 and word.isalpha() and not ("가" <= word <= "힣")
        if (word in ABBREVIATIONS and (word not in BEFORE_NUMBER or nxt_char.isdigit())) or initial:
            return -1
        if lang in ORDINAL_LANGS and re.fullmatch(r"\d{1,2}", word):
            return -1
        if text[max(0, i - 2):i + 1] == ". ." or text[i + 1:i + 3] == " .":   # ". . ." ellipsis
            return -1
    nxt = end
    while nxt < len(text) and text[nxt].isspace():
        nxt += 1
    if nxt >= len(text):
        return -1
    # A citation right after the sentence belongs to it: "... hope. (Jeremiah 29:11)" / "(Read Rev. 21:4.)"
    if text[nxt] in "(（":
        pe = _paren_end(text, nxt)
        if pe > 0:
            after = pe
            while after < len(text) and text[after] in ".。":
                after += 1
            rest = text[after:].lstrip()
            if not rest:
                return -1
            if rest[0].isupper() or rest[0] in OPENERS or "가" <= rest[0] <= "힣":
                return after
        return -1
    c = text[nxt]
    if c.isupper() or c.isdigit() or (c in OPENERS and nxt + 1 < len(text) and (text[nxt + 1].isupper() or text[nxt + 1].isdigit())):
        return end
    if lang == "ko":
        # Korean has no capitals: a Hangul syllable, or an opening quote before one ("…줍니다. “더 이상 …"),
        # starts the next sentence.
        first = text[nxt + 1] if c in OPENERS and nxt + 1 < len(text) else c
        if "가" <= first <= "힣":
            return end
    return -1


PAREN_OPEN, PAREN_CLOSE = "（(《〈【", "）)》〉】"


def _cjk_boundary(text, i, paren_depth):
    """text[i] is a CJK terminal. Inside a quotation 「…。…」 each sentence is its own item (as in the Latin
    languages); inside parentheses or a title （…！）《…！》 nothing is split."""
    end = i + 1
    closed = 0
    while end < len(text) and text[end] in CLOSERS:
        if text[end] in PAREN_CLOSE:
            closed += 1
        end += 1
    if paren_depth - closed > 0:
        return -1
    while end < len(text) and text[end] in " \u3000":
        end += 1
    if end >= len(text):
        return -1
    if text[end] in "（(":
        pe = _paren_end(text, end)
        if pe > 0:
            after = pe
            while after < len(text) and text[after] in "。.":
                after += 1
            return after if after < len(text) else -1
        return -1
    return end


def segment(text, lang):
    """Sentences of one language's text (whitespace-trimmed, nothing dropped or reordered)."""
    text = text.strip()
    if not text:
        return []
    cuts = []
    if lang in CJK_LANGS:
        depth = 0
        for i, ch in enumerate(text):
            if ch in PAREN_OPEN:
                depth += 1
            elif ch in PAREN_CLOSE:
                depth = max(0, depth - 1)
            elif ch in CJK_TERMINALS:
                b = _cjk_boundary(text, i, depth)
                if b > 0:
                    cuts.append(b)
    else:
        for i, ch in enumerate(text):
            if ch in LATIN_TERMINALS:
                b = _latin_boundary(text, i, lang)
                if b > 0:
                    cuts.append(b)
    out, start = [], 0
    for c in sorted(set(cuts)):
        if c > start:
            out.append(text[start:c].strip())
            start = c
    out.append(text[start:].strip())
    # A piece with no letters (a stray "." or ")") joins the sentence before it.
    merged = []
    for s in out:
        if merged and not any(ch.isalpha() for ch in s):
            merged[-1] = merged[-1] + s
        elif s:
            merged.append(s)
    return merged


def strip_paragraph_number(row):
    """Row with a shared leading paragraph/question number removed from every language, or the row as is."""
    # "9 ", "2. ", and the Chinese/Japanese full-width "2．" (written without a following space).
    number = re.compile(r"^\s*(\d{1,3})(?:[.．](?!\d)[\s\u3000]*|[\s\u3000]+)(?=\S)")
    found = {}
    for lang, text in row.items():
        m = number.match(text) if isinstance(text, str) else None
        # A row that is only numbers (ELF's "29 30 31 32" lesson grid) keeps them all.
        if m and any(ch.isalpha() for ch in text[m.end():]):
            found[lang] = m.group(1)
    if not found:
        return row
    common = max(set(found.values()), key=lambda n: sum(1 for v in found.values() if v == n))
    agree = [lang for lang, n in found.items() if n == common]
    # The same number at the start of at least two thirds of the row's languages is the source's paragraph /
    # question number (a language may print a blank "__________" or no number there); it is removed only
    # from the languages that carry it.
    if len(agree) * 3 < len(row) * 2:
        return row
    return {lang: (number.sub("", text, count=1) if lang in agree else text) for lang, text in row.items()}


def _numbers(s):
    """The integers written in a text, as a sorted list: "2,500"/"2.500"/"2 500" -> 2500, "3:14" and
    "3分14秒" -> 3, 14, "2:05" -> 2, 5."""
    s = re.sub(r"(?<=\d)[.,\u00a0\u202f' ](?=\d{3}(?!\d))", "", s)
    return sorted(int(n) for n in re.findall(r"\d+", s))


def _is_question(s):
    s = s.rstrip(CLOSERS + " ").rstrip("）)")
    # Japanese often ends a question with "か。" instead of "？".
    return s.endswith(("?", "？")) or s.endswith(("か。", "か"))


def _pair_ok(t_sents, l_sents):
    """Positional pairing of a paragraph's sentences: every pair must agree."""
    total_t = sum(len(s) for s in t_sents) or 1
    total_l = sum(len(s) for s in l_sents) or 1
    for ts, ls in zip(t_sents, l_sents):
        if _is_question(ts) != _is_question(ls):
            return False
        if _numbers(ts) != _numbers(ls):
            return False
        # Each sentence's share of its paragraph must match closely (0.15 was chosen on a hand-checked
        # sample: 0.3 let reordered translations through).
        if len(t_sents) > 1 and abs(len(ts) / total_t - len(ls) / total_l) > 0.15:
            return False
    return True


def _row_ok(target, other):
    """A one-sentence row and the other language's whole row: they are the same source row, so only a row
    whose languages do not match is refused -- recognised by different numbers when both sides have numbers
    ("3．涉及血的醫療措施" / "Return to lesson 15 point 5", "（1分24秒）" / "26 Mengapa …")."""
    a, b = _numbers(target), _numbers(other)
    if not a or not b:
        return True
    # One side may spell a number out ("February 2015" / "2015年2月", "1 Corinthians" / "コリント第一"): refused
    # only when neither side's numbers are contained in the other's ("62 weeks (434 years)" / "483年").
    def within(x, y):
        rest = list(y)
        for n in x:
            if n not in rest:
                return False
            rest.remove(n)
        return True
    return within(a, b) or within(b, a)


def sentence_records(row, field, langs):
    """Sentence records of one source row: [{lang: text, ...}, ...] for the target `field`, plus the
    alignment outcome per language ({"lang": "row" | "sentence" | "count" | "check"} for the stats)."""
    row = strip_paragraph_number(row)
    target = segment(row[field], field)
    records = [{field: s} for s in target]
    outcome = {}
    for lang in langs:
        if lang == field or lang not in row:
            continue
        if len(target) == 1:
            # The other language's whole row is the counterpart of a one-sentence row -- when it passes the
            # same checks (the source has a few rows whose languages do not match, e.g. a Chinese row
            # "涉及血的醫療措施" beside "Return to lesson 15 point 5").
            if _row_ok(target[0], row[lang].strip()):
                records[0][lang] = row[lang].strip()
                outcome[lang] = "row"
            else:
                outcome[lang] = "row_check"
            continue
        other = segment(row[lang], lang)
        if len(other) != len(target):
            outcome[lang] = "count"
            continue
        if not _pair_ok(target, other):
            outcome[lang] = "check"
            continue
        for rec, s in zip(records, other):
            rec[lang] = s
        outcome[lang] = "sentence"
    return records, outcome


def boundary_count(text, lang):
    """Independent check used by the tests: sentence boundaries left inside one item (should be 0)."""
    return len(segment(text, lang)) - 1
