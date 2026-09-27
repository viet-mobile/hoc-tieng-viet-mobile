# -*- coding: utf-8 -*-
"""Recovering sentence translations the paragraph pairing left empty (target_segment.sentence_records),
from the SAME source row only, and only where independent evidence fixes the correspondence.

A paragraph whose target text and other-language text split into different numbers of sentences
("count"), or into the same number but with a pair failing a check ("check"), is not paired by position.
Here each language is examined again:

  anchors -- sentence pairs fixed by evidence of their own:
    NUMBER_ANCHORED          the two sentences carry the same numbers / verse references, and no other
                             sentence of either paragraph carries that same set; they also agree on
                             question vs statement and on their share of the paragraph's length
    UNIQUE_STRUCTURAL_MATCH  the paragraph's only question is its first (or last) sentence in both
                             languages, with a consistent share of the paragraph's length
    Anchors must keep the same order in both languages; otherwise the paragraph is left alone.
  BETWEEN_CONFIRMED_ANCHORS -- between two consecutive anchors (or an anchor and the paragraph's start or
    end) exactly one sentence remains on each side: that span can only be those two sentences. Used only
    when they also agree on question vs statement, numbers and share of length (within 0.15, and fitting one
    sentence to one sentence better than any join or split with a neighbour).
  Boundaries -- an anchor proves shared content, not shared sentence boundaries: a translation may join
    the anchored sentence with a neighbour or split it (simulated on correctly paired paragraphs, number
    anchors alone were wrong in 23% of such joins). So a pair is filled only when both its boundaries are
    confirmed: the paragraph's start (end) in both languages, or an adjacent pair on the same diagonal.

Nothing else is filled: no position-only pairing, no length-only pairing, no pivot through a third
language, no text from another row or paragraph, no conversion between scripts. Rows whose languages
hold different source rows ("label" / "row_check" outcomes) are never used, nor pieces the segmentation cut
out of a Bible citation ("24:42-44; Rev. 1:3."), nor sentences carrying a list or question label, nor any
paragraph in which an independent detector finds a sentence end the segmentation missed. A paragraph whose anchors cross (evidence contradicting
itself) is left empty and reported as a conflict.

Not used, found unsafe on audit: AUTHORITATIVE_DUPLICATE -- reusing the translation of the identical target
sentence from elsewhere. The publications word the same sentence differently in different places, and the
source's own one-sentence rows sometimes pair instructions of different content ("Then discuss the questions
that follow." / "Játsszátok le a VIDEÓT, és beszéljétek meg ..."), so reuse spread such pairs.
"""
import re

from target_segment import segment, _numbers, _is_question

RECOVERABLE = {"count", "check"}
SHARE_TOLERANCE = 0.25
BETWEEN_TOLERANCE = 0.15      # the paragraph pairing's own limit (target_segment._pair_ok)
RATIO_MIN = 0.7
CODES = {"N": "NUMBER_ANCHORED", "U": "UNIQUE_STRUCTURAL_MATCH", "B": "BETWEEN_CONFIRMED_ANCHORS"}


def _shares(parts):
    total = sum(len(p) for p in parts) or 1
    return [len(p) / total for p in parts]


def citation_fragment(s):
    """A piece the segmentation cut out of a Bible citation ("24:42-44; Rev. 1:3."): never paired here."""
    return bool(re.match(r"^\s*\d+[:：]\d+", s))


def list_label(s):
    """A list or question label in the sentence -- leading ("2) Bądź ...", "4. Podívej ...", "b. Jesus ...",
    "(a) Kim ..."), trailing ("... light meal. (2)", "...でしたか。（イ）") or inside ("... zuzuhören: 1. Wenn ...",
    "Lies Jesaja 48:17, 18. Dazu ..."). The segmentation leaves a label with its own item in some languages and
    with the previous item in others, so a label proves nothing about which item a sentence is: never paired
    here (German ordinals "2. Korinther" are refused with them)."""
    label = r"[（(](?:\d{1,2}|[a-hA-H]|[ア-オ]|[ㄱ-ㅎ가-하])[)）]"
    return bool(re.search(label, s) or
                re.match(r"\s*(?:\d{1,2}|[a-hA-H])[.)．]\s*(?=\S)", s) or
                re.search(r"(?<=\S)\s+\d{1,2}(?:\.\s+(?=[A-ZÀ-Ỹ])|\)\s+(?=\S))", s) or
                re.search(r"[。？！：]\s*\d{1,2}[．.]\s*(?=\S)", s))


def same_shape(ts, ls):
    """Question vs statement and the numbers written agree."""
    return _is_question(ts) == _is_question(ls) and _numbers(ts) == _numbers(ls)


_LATIN_END = re.compile(r"(?<!\b[A-Za-z])(?<!\bMr)(?<!\bMrs)(?<!\bDr)(?<!\bSt)(?<!\bvs)(?<!\bdll)[.?!][\"”’“»)\]]*\s+[\"“‘„«]?(?=[A-ZÀ-Ỹ])")
_HANGUL_END = re.compile(r"(?<![ㄱ-ㅎA-Za-z])[.?!][\"”’“)\]]*\s+[\"“‘]?(?=[가-힣])")
_CJK_END = re.compile(r"[。？！][」』”’]*(?=[^」』”’\s_]*[^\W\d_])")


def hidden_boundary(s):
    """A sentence end the segmentation did not split at, found by a detector independent of it -- e.g. after
    the Czech/German closing quote: "… rozumět.“ A dodává: „…“" is two sentences held as one. Such a
    'sentence' may carry a neighbour's text, so it is never paired here (and never serves as an anchor)."""
    t = s
    for _ in range(3):
        t = re.sub(r"[（(《〈【][^()（）《》〈〉【】]{0,80}[)）》〉】][。.]?", "", t)
    return bool(_LATIN_END.search(t) or _HANGUL_END.search(t) or _CJK_END.search(t))


def _agree(ts, ls, t_share, l_share):
    return (same_shape(ts, ls) and abs(t_share - l_share) <= SHARE_TOLERANCE and any(ch.isalpha() for ch in ls)
            and not citation_fragment(ts) and not citation_fragment(ls)
            and not list_label(ts) and not list_label(ls)
            and not hidden_boundary(ts) and not hidden_boundary(ls))


def _one_to_one(i, j, ts_share, ls_share):
    """An anchor's shared numbers or question do not show that the other language's sentence is the target
    sentence ALONE: a translation may join it with a neighbour ("A (John 3:16). B." -> "A, B (John 3:16).")
    or split it. The pair is kept only when its length shares fit one sentence to one sentence clearly
    better than any join or split with a neighbour on either side."""
    t, l = ts_share[i], ls_share[j]
    if not (RATIO_MIN <= l / t <= 1 / RATIO_MIN if t else False):
        return False
    alternatives = []
    for k in (i - 1, i + 1):
        if 0 <= k < len(ts_share):
            alternatives.append(abs(l - (t + ts_share[k])))
    for k in (j - 1, j + 1):
        if 0 <= k < len(ls_share):
            alternatives.append(abs(t - (l + ls_share[k])))
    return all(abs(t - l) * 2 < alt for alt in alternatives)


def recover_language(t_sents, l_text, lang, conflicts=None):
    """{target index: (sentence, code)} for one language of one paragraph (see module docstring); crossing
    anchors are appended to `conflicts` as (target index, other-language sentence, code) pairs."""
    l_sents = segment(l_text, lang)
    if not l_sents or len(t_sents) < 2:
        return {}
    # A missed sentence end anywhere makes the paragraph's sentence counts, and so every span, unreliable.
    if any(hidden_boundary(x) for x in list(t_sents) + l_sents):
        return {}
    ts_share, ls_share = _shares(t_sents), _shares(l_sents)
    anchors = []
    # NUMBER_ANCHORED: a numbers set that occurs in exactly one sentence on each side.
    t_nums = [tuple(_numbers(s)) for s in t_sents]
    l_nums = [tuple(_numbers(s)) for s in l_sents]
    for i, key in enumerate(t_nums):
        if not key or t_nums.count(key) != 1:
            continue
        js = [j for j, k in enumerate(l_nums) if k == key]
        if len(js) == 1:
            j = js[0]
            if _agree(t_sents[i], l_sents[j], ts_share[i], ls_share[j]) and _one_to_one(i, j, ts_share, ls_share):
                anchors.append((i, j, "N"))
    # UNIQUE_STRUCTURAL_MATCH: the only question, at the same edge of both paragraphs.
    tq = [i for i, s in enumerate(t_sents) if _is_question(s)]
    lq = [j for j, s in enumerate(l_sents) if _is_question(s)]
    if len(tq) == 1 and len(lq) == 1:
        i, j = tq[0], lq[0]
        same_edge = (i == 0 and j == 0) or (i == len(t_sents) - 1 and j == len(l_sents) - 1)
        if (same_edge and not any(a[0] == i for a in anchors) and _agree(t_sents[i], l_sents[j], ts_share[i], ls_share[j])
                and _one_to_one(i, j, ts_share, ls_share)):
            anchors.append((i, j, "U"))
    anchors.sort()
    # Anchors must be strictly increasing in both languages.
    for (a, b) in zip(anchors, anchors[1:]):
        if not (a[0] < b[0] and a[1] < b[1]):
            if conflicts is not None:
                conflicts.append([(i, l_sents[j], code) for i, j, code in anchors])
            return {}
    cells = {(i, j): code for i, j, code in anchors}
    bounds = [(-1, -1)] + [(i, j) for i, j, _ in anchors] + [(len(t_sents), len(l_sents))]
    for (ai, aj), (bi, bj) in zip(bounds, bounds[1:]):
        if bi - ai == 2 and bj - aj == 2:          # exactly one sentence left on each side
            i, j = ai + 1, aj + 1
            if (_agree(t_sents[i], l_sents[j], ts_share[i], ls_share[j])
                    and abs(ts_share[i] - ls_share[j]) <= BETWEEN_TOLERANCE and _one_to_one(i, j, ts_share, ls_share)):
                cells[(i, j)] = "B"
    # An anchor shows that two sentences share content, not that they begin and end at the same place (a
    # translation may join the anchored sentence with a neighbour or split it). A pair is kept only when both
    # of its boundaries are confirmed: the paragraph's start / end in both languages, or an adjacent pair.
    last = (len(t_sents) - 1, len(l_sents) - 1)
    found = {}
    for (i, j), code in cells.items():
        left = (i, j) == (0, 0) or (i - 1, j - 1) in cells
        right = (i, j) == last or (i + 1, j + 1) in cells
        if left and right:
            found[i] = (l_sents[j], code)
    return found
