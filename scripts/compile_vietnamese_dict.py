# -*- coding: utf-8 -*-
"""
Compiles a comprehensive, high-coverage Vietnamese-Korean dictionary for the entire app.
Extracts and normalizes terms from all internal project sources, unpacks compound variants,
and incorporates high-frequency Vietnamese compound words (từ ghép, từ láy, từ phức).
"""

import os
import sys
import json
import re
import unicodedata
from collections import Counter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.dirname(__file__))

ORDER = "aăâbcdđeêghiklmnoôơpqrstuưvxy"
RANK = {ch: i for i, ch in enumerate(ORDER)}

def sort_key(word):
    w = str(word).lower()
    key = []
    for ch in w:
        if ch in RANK:
            key.append((0, RANK[ch]))
            continue
        decomp = unicodedata.normalize("NFD", ch)
        base = "".join(c for c in decomp if unicodedata.category(c) != "Mn")
        if base and base in RANK:
            key.append((0, RANK[base]))
        elif ch.isalpha():
            key.append((1, ord(ch)))
        elif ch.isspace():
            key.append((-1, 0))
        else:
            key.append((2, ord(ch)))
    return key

def clean_key(s):
    if not s:
        return ""
    s = str(s).strip()
    s = re.sub(r"\(.*?\)", "", s)
    s = s.replace("/", " ")
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s

def norm_text(s):
    if not s:
        return ""
    return re.sub(r"\s+", " ", str(s)).strip()

def strip_tone_move(s):
    TONE_MOVE = {
        "oà": "òa", "oá": "óa", "oả": "ỏa", "oã": "õa", "oạ": "ọa",
        "oè": "òe", "oé": "óe", "oẻ": "ỏe", "oẽ": "õe", "oẹ": "ọe",
        "uỳ": "ùy", "uý": "úy", "uỷ": "ủy", "uỹ": "ũy", "uỵ": "ụy"
    }
    s = unicodedata.normalize("NFC", str(s)).lower()
    for k, v in TONE_MOVE.items():
        s = s.replace(k, v)
    return s.strip()

all_dict = {}

def add_entry(vi, ko, src="", hanja="", tags=None):
    if not vi or not ko:
        return
    ko_str = norm_text(ko)
    if not ko_str:
        return
    
    # 1. Expand parentheses
    variants = []
    m = re.search(r"\((.*?)\)", vi)
    if m:
        p_content = m.group(1).strip()
        base = norm_text(re.sub(r"\s*\(.*?\)\s*", " ", vi))
        with_p = norm_text(re.sub(r"[\(\)]", "", vi))
        if base:
            variants.append(base)
        if with_p:
            variants.append(with_p)
        if "ta(tôi)" in vi:
            variants.extend(["chúng ta", "chúng tôi"])
        if "chiên" in vi and "cừu" in vi:
            variants.extend(["con cừu", "con chiên", "cừu", "chiên"])
        if "người (ngươi)" in vi:
            variants.extend(["người", "ngươi"])
        if "mở (đóng)" in vi:
            variants.extend(["mở", "đóng"])
    else:
        variants.append(vi)
        
    for v in variants:
        # Split commas, semicolons, or slashes if they separate multiple words
        parts = re.split(r"[,;/]", v)
        for part in parts:
            p = norm_text(part)
            if not p:
                continue
            k = strip_tone_move(clean_key(p))
            if not k:
                continue
            
            existing = all_dict.get(k)
            if existing is None:
                all_dict[k] = {
                    "vi": p,
                    "ko": ko_str,
                    "hanja": norm_text(hanja),
                    "tags": list(tags) if tags else ([src] if src else []),
                    "sources": [src] if src else []
                }
            else:
                if src and src not in existing["sources"]:
                    existing["sources"].append(src)
                if hanja and not existing["hanja"]:
                    existing["hanja"] = norm_text(hanja)
                if tags:
                    for t in tags:
                        if t not in existing["tags"]:
                            existing["tags"].append(t)
                # If existing is a single Hanja character reading (e.g. '꽃부리 영(英)') and new is contextual translation, keep or supplement
                if len(existing["ko"]) < len(ko_str) and "꽃부리" in existing["ko"]:
                    existing["ko"] = ko_str

print("Loading sources...")

# 1. Curated high-frequency compounds
try:
    from viet_compounds_data import VIET_COMPOUNDS
    for vi, ko in VIET_COMPOUNDS.items():
        add_entry(vi, ko, src="compounds")
    print("Added VIET_COMPOUNDS:", len(VIET_COMPOUNDS))
except Exception as e:
    print("VIET_COMPOUNDS err:", e)

# 2. Existing vietnamese_terminology_dict.json
try:
    with open(os.path.join(ROOT, "vietnamese_terminology_dict.json"), encoding="utf-8") as f:
        td = json.load(f)
        for e in td.get("entries", []):
            add_entry(e.get("vi"), e.get("ko"), src="term_dict", hanja=e.get("hanja", ""), tags=e.get("tags"))
    print("Processed existing term_dict")
except Exception as e:
    print("term_dict err:", e)

# 3. word_meanings_extended.json
try:
    with open(os.path.join(ROOT, "word_meanings_extended.json"), encoding="utf-8") as f:
        wme = json.load(f)
        for k, v in wme.get("entries", {}).items():
            add_entry(v.get("vi"), v.get("ko"), src="extended", hanja=v.get("hanja", ""))
    print("Processed word_meanings_extended")
except Exception as e:
    print("wme err:", e)

# 4. watchtower_vocab_data.py
try:
    import watchtower_vocab_data
    for wk in watchtower_vocab_data.WATCHTOWER_VOCAB:
        for w in wk.get("words", []):
            vi = w.get("vi")
            ko = w.get("mean", {}).get("ko")
            add_entry(vi, ko, src="watchtower")
    print("Processed watchtower_vocab_data")
except Exception as e:
    print("wt err:", e)

# 5. watchtower_vocab_supplement.json
try:
    with open(os.path.join(ROOT, "watchtower_vocab_supplement.json"), encoding="utf-8") as f:
        wvs = json.load(f)
        for wk, words in wvs.items():
            if isinstance(words, list):
                for w in words:
                    vi = w.get("vi")
                    ko = w.get("mean", {}).get("ko")
                    add_entry(vi, ko, src="watchtower_supp")
    print("Processed watchtower_vocab_supplement")
except Exception as e:
    print("wvs err:", e)

# 6. lyric meanings: approved, general, predicate
for fname, src in [("lyric_meanings_approved_ko.json", "lyric_approved"),
                   ("lyric_meanings_ko.json", "lyric_ko"),
                   ("lyric_meanings_predicate_ko.json", "lyric_predicate")]:
    try:
        with open(os.path.join(ROOT, fname), encoding="utf-8") as f:
            d = json.load(f)
            for e in d.get("entries", []):
                add_entry(e.get("vi"), e.get("ko"), src=src)
        print(f"Processed {fname}")
    except Exception as e:
        print(f"{fname} err:", e)

# 7. vocab_groups.json & vocab_chain.json
for fname, src in [("vocab_groups.json", "vocab_groups"), ("vocab_chain.json", "vocab_chain")]:
    try:
        with open(os.path.join(ROOT, fname), encoding="utf-8") as f:
            d = json.load(f)
            if isinstance(d, list):
                for item in d:
                    if "words" in item:
                        for w in item["words"]:
                            add_entry(w.get("word"), w.get("meaning"), src=src, hanja=w.get("hanja", ""))
                    elif "word" in item:
                        add_entry(item.get("word"), item.get("meaning"), src=src, hanja=item.get("hanja", ""))
        print(f"Processed {fname}")
    except Exception as e:
        print(f"{fname} err:", e)

# 8. docx1000_parsed.json
try:
    with open(os.path.join(ROOT, "docx1000_parsed.json"), encoding="utf-8") as f:
        d = json.load(f)
        for e in d:
            add_entry(e.get("vi"), e.get("kr"), src="docx1000")
    print("Processed docx1000_parsed")
except Exception as e:
    print("docx1000 err:", e)

# 9. freq_vocab.json
try:
    with open(os.path.join(ROOT, "freq_vocab.json"), encoding="utf-8") as f:
        d = json.load(f)
        for e in d:
            ko = e.get("kr", {}).get("ko")
            add_entry(e.get("vi"), ko, src="freq_vocab")
    print("Processed freq_vocab")
except Exception as e:
    print("freq_vocab err:", e)

# 10. vocab_theo.json & theocratic_vocab.py
try:
    with open(os.path.join(ROOT, "vocab_theo.json"), encoding="utf-8") as f:
        d = json.load(f)
        for e in d:
            add_entry(e.get("word"), e.get("meaning"), src="vocab_theo", hanja=e.get("hanja", ""))
    import theocratic_vocab
    for viet, hanja, kr in theocratic_vocab.VOCAB:
        add_entry(viet, kr, src="theocratic", hanja=hanja)
    print("Processed theocratic vocab")
except Exception as e:
    print("theo err:", e)

# 11. bible_names_data.py
try:
    import bible_names_data
    for e in bible_names_data.BIBLE_NAMES:
        add_entry(e.get("viet"), e.get("kr"), src="bible_names")
    print("Processed bible_names")
except Exception as e:
    print("bible_names err:", e)

# 12. basic_words_list.py
try:
    import basic_words_list
    for g in basic_words_list.BASIC_WORD_GROUPS:
        for w in g.get("words", []):
            ko = w.get("kr", {}).get("ko")
            add_entry(w.get("vi"), ko, src="basic_words")
    print("Processed basic_words")
except Exception as e:
    print("basic_words err:", e)

# 13. antonym_data.py
try:
    import antonym_data
    for p in antonym_data.ANTONYM_PAIRS:
        add_entry(p.get("vi1"), p.get("kr1", {}).get("ko"), src="antonym")
        add_entry(p.get("vi2"), p.get("kr2", {}).get("ko"), src="antonym")
    print("Processed antonym_data")
except Exception as e:
    print("antonym err:", e)

# 14. dialect_words_data.py
try:
    import dialect_words_data
    for d in dialect_words_data.DIALECT_WORDS:
        ko = d.get("mean", {}).get("ko")
        add_entry(d.get("north"), ko, src="dialect")
        add_entry(d.get("south"), ko, src="dialect")
    print("Processed dialect_words")
except Exception as e:
    print("dialect err:", e)

# 15. grammar_dict_data.py
try:
    import grammar_dict_data
    for g in grammar_dict_data.GRAMMAR_DICT:
        add_entry(g.get("viet"), g.get("meaning"), src="grammar", hanja=g.get("hanja", ""))
    print("Processed grammar_dict")
except Exception as e:
    print("grammar_dict err:", e)

# 16. user_words_data.py
try:
    import user_words_data
    for u in user_words_data.USER_NEW_WORDS:
        add_entry(u.get("vi"), u.get("kr", {}).get("ko"), src="user_words")
    print("Processed user_words")
except Exception as e:
    print("user_words err:", e)

# Explicit user requirement override
all_dict["ra"] = {
    "vi": "ra",
    "ko": "밖으로",
    "hanja": "",
    "tags": ["기본", "방향"],
    "sources": ["user_override"]
}

# Ensure all critical high-frequency compound keys exist cleanly
critical_compounds = {
    "chúng ta": ("chúng ta", "우리 (화자+청자 포함)", ""),
    "chúng tôi": ("chúng tôi", "우리 (청자 제외)", ""),
    "đức giê-hô-va": ("Đức Giê-hô-va", "여호와 하느님", ""),
    "chúa giê-su": ("Chúa Giê-su", "예수 그리스도", ""),
    "đức chúa trời": ("Đức Chúa Trời", "하느님, 하나님", ""),
    "kinh thánh": ("Kinh Thánh", "성경", ""),
    "tháp canh": ("Tháp Canh", "파수대", ""),
    "thầy tế lễ": ("thầy tế lễ", "제사장", ""),
    "thầy tế lễ thượng phẩm": ("thầy tế lễ thượng phẩm", "대제사장", ""),
    "thức ăn thiêng liêng": ("thức ăn thiêng liêng", "영적 양식", ""),
    "tình yêu thương": ("tình yêu thương", "사랑", ""),
    "nhân chứng giê-hô-va": ("Nhân Chứng Giê-hô-va", "여호와의 증인", ""),
    "người khác": ("người khác", "다른 사람, 남", ""),
    "mọi người": ("mọi người", "모든 사람, 여러분", ""),
    "tất cả": ("tất cả", "모두, 전부", ""),
    "thế nào": ("thế nào", "어떻게, 어떠한가", ""),
    "như thế nào": ("như thế nào", "어떻게, 어떠한 방식으로", ""),
    "tại sao": ("tại sao", "왜, 어째서", ""),
    "làm sao": ("làm sao", "어떻게, 어째서", ""),
    "câu hỏi": ("câu hỏi", "질문", ""),
    "thảo luận": ("thảo luận", "토론하다, 토의하다", "討論"),
    "yêu thương": ("yêu thương", "사랑하다, 사랑", ""),
    "bắt đầu": ("bắt đầu", "시작하다", ""),
    "kết thúc": ("kết thúc", "끝나다, 마치다", "結束"),
    "giúp đỡ": ("giúp đỡ", "돕다, 도와주다", ""),
    "suy nghĩ": ("suy nghĩ", "생각하다, 사고", ""),
    "thực hiện": ("thực hiện", "실행하다, 행하다", "實現"),
    "đưa ra": ("đưa ra", "제시하다, 내놓다", ""),
    "cho thấy": ("cho thấy", "보여주다, 나타내다", ""),
    "cuộc sống": ("cuộc sống", "삶, 생활", ""),
    "thời gian": ("thời gian", "시간", "時間"),
    "công việc": ("công việc", "일, 직업, 업무", ""),
    "gia đình": ("gia đình", "가족, 가정", "家庭"),
    "quan trọng": ("quan trọng", "중요한", "關重"),
    "cần thiết": ("cần thiết", "필요한", ""),
    "hạnh phúc": ("hạnh phúc", "행복, 행복한", "幸福"),
    "sức khỏe": ("sức khỏe", "건강", ""),
    "buổi nhóm": ("buổi nhóm", "집회, 모임", ""),
    "buổi nhóm họp": ("buổi nhóm họp", "집회", "")
}

for k, (vi, ko, hanja) in critical_compounds.items():
    all_dict[k] = {
        "vi": vi,
        "ko": ko,
        "hanja": hanja,
        "tags": ["핵심", "복합어"],
        "sources": ["critical_compounds"]
    }

# Convert to list and sort
entries = list(all_dict.values())
entries.sort(key=lambda r: sort_key(r["vi"]))

out_data = {
    "version": "2.0.0",
    "description": "Comprehensive Vietnamese-Korean Terminology & Compound Dictionary",
    "total_entries": len(entries),
    "entries": entries
}

out_path = os.path.join(ROOT, "vietnamese_terminology_dict.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(out_data, f, ensure_ascii=False, indent=1)

print(f"Successfully compiled {len(entries)} entries into {out_path}")

# Print syllable count distribution
sylls = Counter(len(r["vi"].split(" ")) for r in entries)
print("Syllable distribution:")
for n_syll in sorted(sylls.keys())[:5]:
    print(f"  {n_syll}-syllable: {sylls[n_syll]} ({sylls[n_syll]/len(entries)*100:.1f}%)")
