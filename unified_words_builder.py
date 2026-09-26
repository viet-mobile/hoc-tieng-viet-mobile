# -*- coding: utf-8 -*-
"""
Builder for the unified [단어] vocabulary system with multi-tagging and precomputed word frequency.
"""

import re
import json

VN_LETTERS = "a-zA-ZàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ"
BOUNDARY_PREFIX = r'(?<![' + VN_LETTERS + r'])'
BOUNDARY_SUFFIX = r'(?![' + VN_LETTERS + r'])'

# "<훈> <음>" optionally followed by one parenthetical note, e.g. "밝을 명", "모 방(방향)".
HUN_EUM_RE = re.compile(r'^([가-힣]+(?:\s[가-힣]+)*)\s([가-힣])(\s*\([^()]*\))?$')

# [단어] meanings corrected by hand (merged over whichever source supplied the word first).
WORD_MEANING_OVERRIDES = {
    # anh: both readings -- 英 and 兄 (elder brother) -- in every language.
    "anh": {"ko": "꽃부리 영(英), 맏 형(兄)", "ja": "英, 兄", "zh": "英才；兄", "zh_cn": "英才；兄",
            "en": "flower, hero, England; elder brother", "de": "Blüte, Held, England; älterer Bruder",
            "fr": "fleur, héros, Angleterre ; grand frère", "pl": "bohater, Anglia; starszy brat",
            "cs": "květ, hrdina, Anglie; starší bratr", "hu": "virág, hős, Anglia; báty",
            "id": "bunga, pahlawan, Inggris; kakak laki-laki"},
    "đi": {"ko": "가다", "zh": "去", "en": "to go", "ja": "行く"},
    "có": {"ko": "(가지고) 있다"},
    "thánh": {"ko": "거룩할 성(聖)"},
    "minh": {"ko": "밝은 명(明)"},
}

def vi_sort_key(word):
    # Vietnamese diacritic-aware sort key
    order = "aàáảãạăằắẳẵặâầấẩẫậbcdđeèéẻẽẹêềếểễệghiìíỉĩịklmnoòóỏõọôồốổỗộơờớởỡợpqrstuùúủũụưừứửữựvxyỳýỷỹỵ"
    char_map = {c: i for i, c in enumerate(order)}
    return [char_map.get(c, ord(c) + 1000) for c in word.lower()]

def gather_learning_corpus(site, daily_conversations, offer_talks, neighbor_conversations,
                           lff_conversations, lpd_lessons, watchtower_vocab,
                           grammar_intro, grammar_units, grammar_dict,
                           connectives, motion_verbs, pos_examples, direction_dialogues,
                           grammar_a1_a2, grammar_b1_b2, culture_articles):
    """Builds the plain-text corpus used for UNIFIED_WORDS frequency counting.

    Content-policy split mirrors JW_ONLY_CONSTS / the profile architecture: COMMON sources
    contribute to every profile's corpus; JW_ONLY sources only contribute for jw/jeonju. This
    must stay in sync with which of these same constants build_app.py empties out for GENERAL
    via emit() -- a source excluded from GENERAL's rendered data must also be excluded from
    GENERAL's frequency corpus, or GENERAL's word frequencies get inflated by counting text
    GENERAL never actually shows (statistical contamination without content leakage).
    """
    common_lines = []
    jw_only_lines = []

    # Dialogue -- COMMON
    for card in (daily_conversations or []):
        for turn in card.get("turns", []):
            if turn.get("vi"): common_lines.append(turn["vi"])

    # Dialogue -- JW_ONLY
    for talk in (offer_talks or []):
        for l in talk.get("lines", []):
            if l.get("vi"): jw_only_lines.append(l["vi"])
    for n in (neighbor_conversations or []):
        for turn in n.get("turns", []):
            if turn.get("vi"): jw_only_lines.append(turn["vi"])

    # Sentence -- JW_ONLY
    for conv in (lff_conversations or []):
        for turn in conv.get("turns", []):
            if turn.get("vi"): jw_only_lines.append(turn["vi"])
    for lesson in (lpd_lessons or []):
        for ex in lesson.get("examples", []):
            if ex.get("vi"): jw_only_lines.append(ex["vi"])
    for item in (watchtower_vocab or []):
        if item.get("example"): jw_only_lines.append(item["example"])

    # Grammar -- JW_ONLY (legacy JW_ONLY_CONSTS members: pervasive religious example content)
    for sec in (grammar_intro or []):
        for ex in sec.get("examples", []):
            if ex.get("vi"): jw_only_lines.append(ex["vi"])
    for u in (grammar_units or []):
        for st in u.get("steps", []):
            if st.get("vi"): jw_only_lines.append(st["vi"])
    for g in (grammar_dict or []):
        for ex in g.get("examples", []):
            if ex.get("vi"): jw_only_lines.append(ex["vi"])
    for c in (connectives or []):
        for ex in c.get("examples", []):
            if ex.get("vi"): jw_only_lines.append(ex["vi"])
    for v in (motion_verbs or []):
        if v.get("ex_vi"): jw_only_lines.append(v["ex_vi"])
    for e in (pos_examples or []):
        if e.get("vi"): jw_only_lines.append(e["vi"])
    for d in (direction_dialogues or []):
        for l in d.get("lines", []):
            if l.get("vi"): jw_only_lines.append(l["vi"])

    # Grammar -- COMMON (A1/A2 and B1/B2 pattern sets: general Vietnamese grammar, no
    # religious/ministry content, correctly available to every profile)
    for pat in (grammar_a1_a2 or []):
        for ex in pat.get("examples", []):
            if ex.get("vi"): common_lines.append(ex["vi"])
    for pat in (grammar_b1_b2 or []):
        for ex in pat.get("examples", []):
            if ex.get("vi"): common_lines.append(ex["vi"])

    # Culture -- COMMON
    for a in (culture_articles or []):
        for p in a.get("paragraphs", []):
            # paragraphs can have multi-lang dict
            if isinstance(p, dict) and p.get("vi"):
                common_lines.append(p["vi"])
            elif isinstance(p, str):
                common_lines.append(p)
        for kw in a.get("keywords", []):
            if isinstance(kw, dict) and kw.get("vi"):
                common_lines.append(kw["vi"])

    lines = common_lines if site == "general" else (common_lines + jw_only_lines)
    return " \n ".join(lines).lower()

def build_unified_words(site, basic_word_groups, freq_vocab, vocab_theo, bible_names,
                        rhyme_groups, word_order_reversed, vocab_groups, antonym_pairs,
                        user_new_words, corpus_text, religious_filter_terms=None,
                        dialect_words=None):
    words_map = {}

    def get_or_create(vi, kr=None, hanja=None):
        if not vi or not isinstance(vi, str):
            return None
        vi_clean = vi.strip()
        if not vi_clean:
            return None
        key = vi_clean.lower()
        if key not in words_map:
            words_map[key] = {
                "vi": vi_clean,
                "kr": kr if isinstance(kr, dict) else ({"ko": kr} if kr else {}),
                "tags": set(),
                "hanja": hanja or "",
                "antonym": None,
                "antonymMeaning": None,
                "frequency": 0
            }
        rec = words_map[key]
        if kr:
            if isinstance(kr, dict):
                for lang, val in kr.items():
                    if val and not rec["kr"].get(lang):
                        rec["kr"][lang] = val
            elif isinstance(kr, str) and kr:
                if not rec["kr"].get("ko"):
                    rec["kr"]["ko"] = kr
        if hanja and not rec["hanja"]:
            rec["hanja"] = hanja
        return rec

    # 1. 기본 (basic)
    for grp in (basic_word_groups or []):
        for w in grp.get("words", []):
            r = get_or_create(w["vi"], w.get("kr"))
            if r: r["tags"].add("기본")

    # 2. 상용 (freq)
    for w in (freq_vocab or []):
        r = get_or_create(w.get("vi"), w.get("kr"), w.get("hanja"))
        if r: r["tags"].add("상용")

    # 3. 신권 (theo)
    for w in (vocab_theo or []):
        word_text = w.get("word") or w.get("vi")
        meaning = w.get("meaning") or w.get("kr")
        r = get_or_create(word_text, meaning, w.get("hanja"))
        if r: r["tags"].add("신권")

    # 4. 인명 (names)
    for w in (bible_names or []):
        r = get_or_create(w.get("vi"), w.get("kr"))
        if r: r["tags"].add("인명")

    # 5. 한자음 (rhyme)
    for rg in (rhyme_groups or []):
        for fam in rg.get("families", []):
            for w in fam.get("words", []):
                ex = w.get("example")
                if ex:
                    r = get_or_create(ex, w.get("example_mean"), w.get("example_kr"))
                    if r: r["tags"].add("한자음")
                syll = w.get("word")
                if syll:
                    r2 = get_or_create(syll, w.get("gloss"), w.get("hanja"))
                    if r2: r2["tags"].add("한자음")

    # 6. 어순반대 (orderrev)
    for w in (word_order_reversed or []):
        ex = w.get("example")
        if ex:
            r = get_or_create(ex, w.get("example_mean"), w.get("example_kr"))
            if r: r["tags"].add("어순반대")

    # 7. 동일음 (groups)
    for grp in (vocab_groups or []):
        for w in grp.get("words", []):
            r = get_or_create(w.get("word"), w.get("meaning"), w.get("hanja"))
            if r: r["tags"].add("동일음")

    # 8. 반의 (antonym)
    for p in (antonym_pairs or []):
        r1 = get_or_create(p.get("vi1"), p.get("kr1"))
        r2 = get_or_create(p.get("vi2"), p.get("kr2"))
        if r1 and r2:
            r1["tags"].add("반의")
            r2["tags"].add("반의")
            r1["antonym"] = p.get("vi2")
            r1["antonymMeaning"] = p.get("kr2")
            r2["antonym"] = p.get("vi1")
            r2["antonymMeaning"] = p.get("kr1")

    # 8b. 남북 ([어휘] > [남북 단어]): every northern and southern form listed there ("ba/cha",
    # "giỡn, nói chơi" -> one word each). dialectNo is the entry's own number in that list.
    for i, d in enumerate(dialect_words or []):
        for form_field in ("north", "south"):
            for form in re.split(r"[/,]", d.get(form_field) or ""):
                r = get_or_create(form, d.get("mean"))
                if r:
                    r["tags"].add("남북")
                    r.setdefault("dialectNo", i + 1)

    # 9. User additions
    for w in (user_new_words or []):
        r = get_or_create(w.get("vi"), w.get("kr"), w.get("hanja"))
        if r:
            for t in w.get("tags", []):
                r["tags"].add(t)

    # 10. [단어] meaning fixes. Copy the kr dict first: get_or_create shares it with the source dataset
    # (e.g. a RHYME_GROUPS gloss), whose own tabs must stay unchanged.
    for vi, fix in WORD_MEANING_OVERRIDES.items():
        rec = words_map.get(vi)
        if rec:
            rec["kr"] = dict(rec["kr"], **fix)

    # 11. Hanja-reading meanings ("꽃부리 영", "모 방(방향)") always show their hanja: "꽃부리 영(英)", "모 방(方, 방향)".
    # Only when the reading syllable is confirmed by the 한자음 source for that exact word + hanja.
    rhyme_readings = set()
    for rg in (rhyme_groups or []):
        for fam in rg.get("families", []):
            for w in fam.get("words", []):
                if w.get("word") and w.get("hanja") and isinstance(w.get("kr"), str):
                    rhyme_readings.add((w["word"].strip().lower(), w["hanja"], w["kr"]))
    for key, rec in words_map.items():
        ko = rec["kr"].get("ko")
        m = isinstance(ko, str) and HUN_EUM_RE.match(ko)
        if not m or not rec["hanja"] or (key, rec["hanja"], m.group(2)) not in rhyme_readings:
            continue
        rest = m.group(3)
        if rest and re.search(r'[㐀-鿿]', rest):
            continue
        suffix = "(" + rec["hanja"] + (", " + rest.strip()[1:-1] if rest else "") + ")"
        rec["kr"] = dict(rec["kr"], ko=m.group(1) + " " + m.group(2) + suffix)

    # Compile word records
    result = []
    rel_terms = religious_filter_terms or []

    for key, rec in words_map.items():
        # Profile filtering for GENERAL
        if site == "general":
            # If word is strictly JW-only (신권 and/or 인명 only), skip
            non_jw_tags = rec["tags"] - {"신권", "인명"}
            if not non_jw_tags:
                continue
            # Remove JW-only tags from remaining words
            rec["tags"] = non_jw_tags

            # Strip if matching religious filter terms
            rec_str = rec["vi"] + " " + json.dumps(rec["kr"], ensure_ascii=False) + " " + rec["hanja"]
            if any(term in rec_str for term in rel_terms):
                continue

        # Calculate frequency
        w_vi = rec["vi"].lower()
        pat = BOUNDARY_PREFIX + re.escape(w_vi) + BOUNDARY_SUFFIX
        try:
            rec["frequency"] = len(re.findall(pat, corpus_text))
        except Exception:
            rec["frequency"] = 0

        # Convert tags set to sorted list
        tag_order = ["기본", "상용", "신권", "인명", "한자음", "어순반대", "동일음", "반의", "PDF", "남북"]
        rec["tags"] = sorted(list(rec["tags"]), key=lambda t: tag_order.index(t) if t in tag_order else 99)
        result.append(rec)

    # Sort deterministically
    result.sort(key=lambda r: vi_sort_key(r["vi"]))
    return result
