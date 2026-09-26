# -*- coding: utf-8 -*-
"""Spreads the general learning materials over the 16 course weeks of [과정].

The materials are the ones every profile already shows in its own tabs -- nothing is created
here, only week-by-week pointers into them:

  [대화] > [일상 회화]            DAILY_CONVERSATIONS     front-loaded (more in the early weeks)
  [대화] > [이웃 사람과의 대화]    NEIGHBOR_CONVERSATIONS  back-loaded (JW profiles only)
  [대화] > [문화]                 CULTURE_ARTICLES        evenly
  [문장] > [일상 생활]            GENERAL_PDF sentences   evenly
  [문법] > [일반 문법]            GENERAL_PDF grammar     evenly

Every item of every material lands in exactly one week, in source order, split deterministically
from the actual item counts (largest-remainder allocation over per-week weights). Each week gets
one course item per material (a range such as "일상 회화 4~6번"), and the same range is added to
that week's assignments as a review task, one material per weekday. Links open the material's
subtab and scroll to the range's first item (data-anchor="<prefix>-<n>" in app_logic.js).
"""

COURSE_WEEKS = list(range(1, 17))

# Label per material, in the canonical language order.
MATERIAL_LABELS = {
    "daily": {"vi": "Hội thoại hằng ngày", "cs": "Každodenní konverzace", "zh_cn": "日常会话", "zh": "日常會話", "en": "Everyday Conversation", "fr": "Conversations quotidiennes", "de": "Alltagsgespräche", "hu": "Mindennapi beszélgetések", "id": "Percakapan Sehari-hari", "ja": "日常会話", "ko": "일상 회화", "pl": "Rozmowy codzienne"},
    "neighbor": {"vi": "Trò chuyện với người láng giềng", "cs": "Rozhovory se sousedy", "zh_cn": "与邻居的对话", "zh": "與鄰居的對話", "en": "Conversations with Neighbors", "fr": "Conversations avec les voisins", "de": "Gespräche mit Nachbarn", "hu": "Beszélgetések a szomszédokkal", "id": "Percakapan dengan Tetangga", "ja": "近所の人との会話", "ko": "이웃 사람과의 대화", "pl": "Rozmowy z sąsiadami"},
    "culture": {"vi": "Văn hóa", "cs": "Kultura", "zh_cn": "文化", "zh": "文化", "en": "Culture", "fr": "Culture", "de": "Kultur", "hu": "Kultúra", "id": "Budaya", "ja": "文化", "ko": "문화", "pl": "Kultura"},
    "pdf_sentence": {"vi": "Câu trong đời sống hằng ngày", "cs": "Věty z každodenního života", "zh_cn": "日常生活句子", "zh": "日常生活句子", "en": "Everyday Life Sentences", "fr": "Phrases de la vie quotidienne", "de": "Sätze aus dem Alltag", "hu": "Mondatok a mindennapi életből", "id": "Kalimat Kehidupan Sehari-hari", "ja": "日常生活の文", "ko": "일상 생활 문장", "pl": "Zdania z życia codziennego"},
    "pdf_grammar": {"vi": "Ngữ pháp tổng quát", "cs": "Obecná gramatika", "zh_cn": "一般语法", "zh": "一般語法", "en": "General Grammar", "fr": "Grammaire générale", "de": "Allgemeine Grammatik", "hu": "Általános nyelvtan", "id": "Tata Bahasa Umum", "ja": "一般文法", "ko": "일반 문법", "pl": "Gramatyka ogólna"},
}
LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]

MATERIAL_LINKS = {
    "daily": ("wizard", "wizard", "daily", "daily"),
    "neighbor": ("wizard", "wizard", "neighbor", "neighbor"),
    "culture": ("wizard", "wizard", "culture", "culture"),
    "pdf_sentence": ("sentence", "sentence", "pdf", "pdf-sentence"),
    "pdf_grammar": ("grammar", "grammar", "pdf", "pdf-grammar"),
}
# Weekday (index into a week's Mon..Fri assignment days) that reviews each material.
MATERIAL_WEEKDAY = {"daily": 0, "culture": 1, "pdf_sentence": 2, "pdf_grammar": 3, "neighbor": 4}


def allocate(count, weights):
    """Largest-remainder split of `count` items over len(weights) weeks, proportional to weights."""
    total = float(sum(weights))
    exact = [count * w / total for w in weights]
    sizes = [int(x) for x in exact]
    order = sorted(range(len(weights)), key=lambda i: (-(exact[i] - sizes[i]), i))
    for i in order[:count - sum(sizes)]:
        sizes[i] += 1
    return sizes


def material_weights(kind):
    n = len(COURSE_WEEKS)
    if kind == "daily":        # front-loaded: 16, 15, ..., 1
        return [n - i for i in range(n)]
    if kind == "neighbor":     # back-loaded: 1, 2, ..., 16
        return [i + 1 for i in range(n)]
    return [1] * n             # evenly


def range_text(kind, start, end):
    """"<label> 4~6번" (ko) / "<label> 4–6" -- 1-based, inclusive."""
    label = MATERIAL_LABELS[kind]
    span_ko = str(start) if start == end else "%d~%d" % (start, end)
    span = str(start) if start == end else "%d–%d" % (start, end)
    text = {}
    for lang in LANGS:
        text[lang] = label[lang] + " " + (span_ko + "번" if lang == "ko" else span)
    return text


def week_items(counts):
    """{week: [(kind, start, end), ...]} for the materials in `counts` ({kind: item count})."""
    out = {w: [] for w in COURSE_WEEKS}
    for kind in ("daily", "neighbor", "culture", "pdf_sentence", "pdf_grammar"):
        count = counts.get(kind) or 0
        if not count:
            continue
        cursor = 1
        for week, size in zip(COURSE_WEEKS, allocate(count, material_weights(kind))):
            if size:
                out[week].append((kind, cursor, cursor + size - 1))
                cursor += size
        assert cursor - 1 == count, (kind, cursor, count)
    return out


def course_item(kind, start, end):
    tab, sub_attr, sub_val, anchor_prefix = MATERIAL_LINKS[kind]
    return {
        "link": {"tab": tab, "subAttr": sub_attr, "subVal": sub_val, "anchor": "%s-%d" % (anchor_prefix, start)},
        "page": None,
        "text": range_text(kind, start, end),
    }


def add_general_materials(weeks, assignments, counts):
    """Returns new (weeks, assignments) lists with this plan's items appended; inputs untouched."""
    plan = week_items(counts)
    new_weeks = []
    for week in weeks:
        w = dict(week)
        if w.get("week") in plan:
            w["items"] = list(w.get("items") or []) + [course_item(*entry) for entry in plan[w["week"]]]
        new_weeks.append(w)
    new_assignments = []
    for entry in assignments or []:
        e = dict(entry)
        if e.get("week") in plan and e.get("days"):
            days = [dict(d) for d in e["days"]]
            for kind, start, end in plan[e["week"]]:
                day = days[MATERIAL_WEEKDAY[kind] % len(days)]
                day["reviews"] = list(day.get("reviews") or []) + [{k: v for k, v in course_item(kind, start, end).items() if k != "page"}]
            e["days"] = days
        new_assignments.append(e)
    return new_weeks, new_assignments


# [과정] items and week subtitles the JW profile does not show (class-event logistics rather than
# learning content). A week whose subtitle (note) named one of them gets one of the week's own
# remaining learning items as its subtitle instead.
JW_REMOVED_ITEM_TERMS = ("졸업식 노래", "집회 리허설", "졸업식 준비", "파수대 집회 실연")
JW_REMOVED_ITEM_EXACT = ("졸업",)
JW_REMOVED_NOTE_TERMS = ("졸업", "리허설", "집회 실연")


def _is_removed_item(item):
    ko = ((item.get("text") or {}).get("ko") or "").strip()
    return ko in JW_REMOVED_ITEM_EXACT or any(term in ko for term in JW_REMOVED_ITEM_TERMS)


def _representative_note(items):
    """The week's last topical item (a subtab link without a per-week range or talk numbers --
    e.g. "베트남어 끝말잇기"), else its first item."""
    for item in reversed(items):
        link = item.get("link") or {}
        if link and not link.get("vocabRange") and not link.get("talkNums") and not link.get("anchor"):
            return dict(item["text"])
    return dict(items[0]["text"]) if items else None


def remove_jw_event_items(weeks, assignments):
    new_weeks = []
    for week in weeks:
        w = dict(week)
        w["items"] = [it for it in (w.get("items") or []) if not _is_removed_item(it)]
        note_ko = ((w.get("note") or {}).get("ko") or "") if isinstance(w.get("note"), dict) else ""
        if note_ko and any(term in note_ko for term in JW_REMOVED_NOTE_TERMS):
            w["note"] = _representative_note(w["items"])
        new_weeks.append(w)
    new_assignments = []
    for entry in assignments or []:
        e = dict(entry)
        days = []
        for d in e.get("days") or []:
            day = dict(d)
            for group in ("reviews", "previews", "vocab"):
                if day.get(group):
                    day[group] = [it for it in day[group] if not _is_removed_item(it)]
            days.append(day)
        e["days"] = days
        new_assignments.append(e)
    return new_weeks, new_assignments
