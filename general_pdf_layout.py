# -*- coding: utf-8 -*-
"""Display layout for [문법] > [일반 문법]: which wrapped Korean prose lines of each grammar page are one
sentence broken by the PDF's line wrap, and whether the join needs a space.

GENERAL_PDF grammar records keep the page text exactly as extracted (tests/test_general_pdf.py), so
the fix is display-only: GENERAL_PDF_GRAMMAR_JOINS = {record id: [[line index, joiner], ...]}, where
line `index` (0-based, in record["original"].split("\\n")) continues on line index+1 and `joiner` is
"" (the wrap split a word, e.g. 인|사입니다) or " " (it wrapped at a space, e.g. sao를|활용하여).

The page wraps both ways, so the joiner is decided per join (see _joiner) from Korean word
statistics: whole eojeols of Korean text that has no line wrap of its own (the interior words of the
PDF corpus lines, plus the Korean sentences of the other sources passed in).
"""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HANGUL = re.compile(r"[가-힣]")
EDGE_PUNCT = "\"'‘’“”()[]{}<>.,!?:;·…~-–—/|「」『』《》〈〉"
# A line ending like this closes its sentence (or is a caption/label), so it is never joined on.
SENTENCE_END = re.compile(r"[.!?。…:：)\]’”'\"]$")
# Lines that are examples, word boxes, answers or list items rather than wrapped prose.
NOT_PROSE_START = re.compile(r"^(?:[A-Z](?:\s|$)|[A-Z][.:)]|단어|→|=|\d+[.)\s]|[①-⑳❶-❿Ⓐ-Ⓩ•·\-*>])")
HEADING = re.compile(r"^\s*\d+[\.\s]+[가-힣A-Za-z]")
COLUMN_GAP = re.compile(r"\S\s{3,}\S")  # a table or two-column example row
# A Korean particle/ending that begins the next line (and is not the start of a longer word there)
# belongs to the word before it: 안타까움|을, 입니|다., 가지|고.
PARTICLE_START = re.compile(r"^(?:으로써|으로|에서|에게|까지|부터|만큼|처럼|이라는|라는|이다|입니다|이며|이고|이나|"
                            r"을|를|이|가|은|는|의|에|와|과|도|로|만|다|요|고|며|면|서|지|나|야)(?![가-힣])")
# A 하다/되다 form after a bare noun: 표현|할, 상반|되는, 사용|되기도.
VERB_START = re.compile(r"^(?:하|할|한|함|해|했|되|된|될|됨|됩|돼|시키|시켜)")
PARTICLE_END = re.compile(r"[을를이가은는의에와과도로서며고면만]$")


def _word(token):
    return token.strip(EDGE_PUNCT)


def eojeol_counts(texts, wrapped_pages=()):
    """Counts of whole words. `texts` have no line wrap; in `wrapped_pages` only the interior words of
    each line count (a line's first and last word may be halves of a wrapped word)."""
    counts = Counter()
    for text in texts:
        for token in str(text).split():
            w = _word(token)
            if HANGUL.search(w):
                counts[w] += 1
    for page in wrapped_pages:
        for line in str(page).split("\n"):
            for token in line.split()[1:-1]:
                w = _word(token)
                if HANGUL.search(w):
                    counts[w] += 1
    return counts


def _indent(line):
    return len(line) - len(line.lstrip(" \t"))


def _is_prose(line):
    s = line.strip()
    return len(s) >= 18 and bool(HANGUL.search(s)) and not NOT_PROSE_START.match(s) and not COLUMN_GAP.search(s)


def _joiner(wa, wb, counts, prefixes):
    """"" when the last word of a line (wa) and the first of the next (wb) are one word, else " "."""
    if not HANGUL.match(wb[:1] or ""):
        return " "
    if re.search(r"(?:^|[^A-Za-z])[A-Z]$", wa):      # ‘A|만큼’, ‘B|이다’
        return ""
    if not HANGUL.search(wa[-1:] or ""):
        return " "
    head_run = re.match(r"[가-힣]+", wb).group(0)          # 숫|자’를 -> 숫자, 요|일)로 -> 요일
    joined_head = counts[_word(wa) + head_run]
    # The joined head must be a real word, not a stray typo of it ("할때" beside hundreds of "때").
    if counts[_word(wa + wb)] > 0 or (joined_head >= 2 and joined_head * 10 >= counts[head_run]) or PARTICLE_START.match(wb):
        return ""
    if VERB_START.match(wb) and not PARTICLE_END.search(wa):
        return ""
    head = re.match(r"[가-힣]+", wb).group(0)[:2]
    # 사|용한다: no word starts with 용한, so 용한다 is the tail of a split word.
    return " " if len(head) < 2 or head in prefixes else ""


def grammar_joins(original, counts, prefixes):
    lines = original.split("\n")
    joins = []
    for i in range(len(lines) - 1):
        a, b = lines[i], lines[i + 1]
        sa, sb = a.strip(), b.strip()
        # An example's Korean translation ("→ …어머니는 이제 50세" | "에 가까우시다.") continues only when the
        # next line begins with the particle/ending the wrap cut off.
        if sa.startswith("→") and not SENTENCE_END.search(sa) and HANGUL.search(sa[-1:]) and PARTICLE_START.match(sb):
            joins.append([i, ""])
            continue
        # A lone syllable on the next line ("출", "베") is an extraction fragment, not a continuation.
        if not sa or len(sb) < 2 or not _is_prose(a) or SENTENCE_END.search(sa) or HEADING.match(b):
            continue
        if NOT_PROSE_START.match(sb) or COLUMN_GAP.search(sb) or _indent(b) > _indent(a) + 1:
            continue
        last, first = sa.split()[-1], sb.split()[0]
        # A Vietnamese word whose Korean particle wrapped to the next line: từng|은, thì|에는.
        if re.search(r"[0-9a-zA-ZÀ-ɏḀ-ỿ]$", last) and re.fullmatch(
                r"(?:에는|에서|으로|로|은|는|을|를|이|가|의|에|와|과|도|만)[.,]?", first):
            joins.append([i, ""])
            continue
        # Punctuation right at the break ("‘반대로’," | "‘~와") means the wrap fell between two words.
        if not (HANGUL.search(last[-1]) or re.search(r"(?:^|[^A-Za-z])[A-Z]$", last)) or not HANGUL.match(first[0]):
            joins.append([i, " "])
            continue
        joins.append([i, _joiner(last, first.rstrip(EDGE_PUNCT), counts, prefixes)])
    return joins


def build_grammar_joins(grammar_rows, korean_texts):
    pages = [r["text"] for r in json.loads((ROOT / "vietnamese_pdf_corpus.json").read_text(encoding="utf-8"))["pages"]]
    counts = eojeol_counts(korean_texts, pages)
    prefixes = {w[:2] for w in counts if len(w) >= 2}
    out = {}
    for row in grammar_rows:
        joins = grammar_joins(row.get("original") or "", counts, prefixes)
        if joins:
            out[row["id"]] = joins
    return out
