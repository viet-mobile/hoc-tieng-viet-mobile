# -*- coding: utf-8 -*-
"""Second source of sentence correspondences for the target-language sites: the sentence data the
Vietnamese JW site shows in [문장] (LFF_CONVERSATIONS, LPD_LESSONS and the WATCHTOWER_VOCAB example
sentences). Those units come from wol.jw.org paragraphs and single example sentences, so a sentence
whose Excel row could not be paired (different sentence counts, a check failed) is often a whole unit
there, or part of a unit that does split evenly.

lookup() returns another language's text for a target sentence only when it is certain:
  * the target sentence equals a reference unit's text exactly (after normalising spaces, quotes and
    list markers), that unit is exactly one sentence in BOTH languages, and its numbers are consistent
    (target_segment._row_ok) -> the unit's sentence in the other language;
  * only the languages the JW site's units carry from their own sources count (CURATED_LANGS: the
    wol.jw.org / example-sentence text). Their other languages were copied in from the same Excel
    rows the target sites already use, so they are no new evidence;
  * every matching unit gives the same answer (units that disagree -> nothing).
Positions inside a multi-sentence unit are never used: a short common sentence ("Why?") occurs in many
units, and position alone paired it with unrelated sentences. Nothing is translated or guessed.
"""
import re
import unicodedata

from target_segment import segment, strip_paragraph_number, _row_ok

SPACES = re.compile(r"[\s  　]+")
LIST_MARKER = re.compile(r"^(?:[•·\-–—*]\s*|\(?[0-9a-zA-Zㄱ-ㅎア-ン]{1,3}[.)．）]\s*)")


def norm(text):
    t = unicodedata.normalize("NFC", str(text or ""))
    t = SPACES.sub(" ", t).strip()
    t = t.replace("‘", "'").replace("’", "'").replace("“", '"').replace("”", '"')
    for _ in range(2):
        t = LIST_MARKER.sub("", t).strip()
    return t


CURATED_LANGS = {"vi", "en", "zh", "ja", "ko"}


class Reference:
    def __init__(self, units):
        self.units = []
        self.index = {}
        for unit in units:
            unit = strip_paragraph_number({k: v.strip() for k, v in unit.items()
                                           if k in CURATED_LANGS and isinstance(v, str) and v.strip()})
            segs = {lang: segment(text, lang) for lang, text in unit.items()}
            u = len(self.units)
            self.units.append((unit, segs))
            for lang, parts in segs.items():
                if len(parts) == 1:
                    self.index.setdefault(lang, {}).setdefault(norm(parts[0]), []).append(u)

    def lookup(self, text, target, lang):
        """(answer or None, number of distinct answers found)."""
        answers = set()
        if target not in CURATED_LANGS or lang not in CURATED_LANGS:
            return None, 0
        for u in self.index.get(target, {}).get(norm(text), []):
            unit, segs = self.units[u]
            if lang in unit and len(segs[lang]) == 1 and _row_ok(unit[target], unit[lang]):
                answers.add(unit[lang])
        if len(answers) == 1:
            return next(iter(answers)), 1
        return None, len(answers)


def jw_sentence_units(lff, lpd, wt_vocab):
    """The Vietnamese JW site's [문장] sentence data as plain {lang: text} units."""
    units = []
    for rec in lff:
        for line in rec.get("lines") or []:
            units.append({k: v for k, v in line.items() if isinstance(v, str)})
    for rec in lpd:
        for line in rec.get("lines") or []:
            units.append({k: v for k, v in line.items() if isinstance(v, str)})
    for week in wt_vocab:
        for w in week.get("words") or []:
            unit = dict(w.get("example_mean") or {})
            if w.get("example"):
                unit["vi"] = w["example"]
            units.append(unit)
    return units
