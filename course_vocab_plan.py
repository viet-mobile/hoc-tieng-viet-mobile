# -*- coding: utf-8 -*-
"""
[과정] vocabulary schedule for a fixed-term regional course (JEONJU).

The whole [어휘] tab (vocab_study_plan_data.VOCAB_PLAN, 10 subtabs, in its study order) is one stream of words.
app_logic.js cuts that stream against the real class calendar:

- Homework: every homework week (Mon-Fri), cancelled weeks included, previews the next slice of the stream in
  five equal daily parts and reviews the slice previewed the week before -- the same amount every day.
- Classes: the first `early_classes` classes each learn `early_quota` words (the amount previewed before them);
  the later classes share the rest equally, so the words previewed during a break are absorbed over the
  following classes instead of all at once. The last vocabulary class finishes the stream.

This module only supplies the stream and the 12-language item texts (derived from the course's existing
"베트남어 어휘 학습 N주차 (…)" / "오늘의 어휘 학습 (…)" lines, so wording stays identical).
"""
import re

from vocab_study_plan_data import VOCAB_PLAN

LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]
_CAT = re.compile(r"[(（]\s*(.+?)\s+\d")


def vocab_stream():
    """[[subVal, start, end], ...] in study order, adjacent pieces of one subtab merged (0-based, end exclusive)."""
    out = []
    for week in VOCAB_PLAN:
        for seg in week["segments"]:
            if out and out[-1][0] == seg["subVal"] and out[-1][2] == seg["start"]:
                out[-1][2] = seg["end"]
            else:
                out.append([seg["subVal"], seg["start"], seg["end"]])
    return out


def _template(text, cat, numbers):
    """A sample line -> template: its category name -> {c}, then the given numbers (in order) -> placeholders."""
    t = text.replace(cat, "{c}", 1)
    for value, name in numbers:
        t, n = re.subn(r"(?<!\d)%s(?!\d)" % value, "{%s}" % name, t, count=1)
        if not n:
            raise ValueError("no %s in %r" % (value, text))
    return t


def course_vocab(course_values, early_classes=4, early_quota=170, last_class=15):
    """COURSE_VOCAB for app_logic.js, from the course's (12-language completed) weeks/assignments."""
    class_samples, day_samples = {}, {}

    def walk(v):
        if isinstance(v, dict):
            link, text = v.get("link") or {}, v.get("text")
            if isinstance(text, dict) and link.get("tab") == "vocab" and link.get("vocabRange"):
                ko = text.get("ko") or ""
                if re.match(r"^베트남어 어휘 학습 \d+주차 \(", ko):
                    class_samples.setdefault(link["subVal"], text)
                elif ko.startswith("오늘의 어휘 학습 ("):
                    day_samples.setdefault(link["subVal"], text)
            for x in v.values():
                walk(x)
        elif isinstance(v, list):
            for x in v:
                walk(x)
    walk(course_values)

    stream = vocab_stream()
    subvals = sorted({s[0] for s in stream})
    missing = [s for s in subvals if s not in class_samples]
    if missing or "rhyme" not in day_samples:
        raise SystemExit("course_vocab: no sample course line for %r" % (missing or ["rhyme (daily)"]))
    cats = {sv: {} for sv in subvals}
    for sv in subvals:
        for lang in LANGS:
            m = _CAT.search(class_samples[sv][lang])
            if not m:
                raise SystemExit("course_vocab: no category in %r" % class_samples[sv][lang])
            cats[sv][lang] = m.group(1)

    def sample_numbers(ko):
        week = re.search(r"(\d+)주차", ko)
        a, b = re.search(r"(\d+)~(\d+)번", ko).groups()
        return (week.group(1) if week else None), a, b

    cw, ca, cb = sample_numbers(class_samples["rhyme"]["ko"])
    _, da, db = sample_numbers(day_samples["rhyme"]["ko"])
    class_text, day_text = {}, {}
    for lang in LANGS:
        class_text[lang] = _template(class_samples["rhyme"][lang], cats["rhyme"][lang], [(cb, "b"), (ca, "a"), (cw, "w")])
        day_text[lang] = _template(day_samples["rhyme"][lang], _CAT.search(day_samples["rhyme"][lang]).group(1), [(db, "b"), (da, "a")])
    return {
        "stream": stream,
        "total": sum(e - s for _, s, e in stream),
        "cats": cats,
        "classText": class_text,
        "dayText": day_text,
        "earlyClasses": early_classes,
        "earlyQuota": early_quota,
        "lastClass": last_class,
    }
