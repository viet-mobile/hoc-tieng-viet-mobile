import re
from bible_lookup_def import LOOKUP

ONE_CHAPTER_BOOKS = {31, 57, 63, 64, 65}

def parse_verses_part(v_str):
    if not v_str:
        return []
    verses = []
    # e.g. "1, 2, 5" or "13-16" or "1-3, 5, 7-9"
    parts = re.split(r'[,;、]', v_str)
    for p in parts:
        p = p.strip()
        if not p:
            continue
        # check range
        m_range = re.match(r'^(\d+)\s*[-–~]\s*(\d+)$', p)
        if m_range:
            start, end = int(m_range.group(1)), int(m_range.group(2))
            if start <= end and end - start <= 50:
                verses.extend(range(start, end + 1))
        else:
            m_single = re.match(r'^(\d+)', p)
            if m_single:
                verses.append(int(m_single.group(1)))
    return sorted(list(set(verses)))

def parse_scripture_ref(ref_str):
    # clean string
    s = ref_str.strip().strip('()[]{}“”"\'.,—')
    # Match: Book Chapter:Verses or Book Chapter
    m = re.match(r'^([123]\s+[^\d:]+|[^\d:]+)\s+(\d+)(?:\s*:\s*(.*))?$', s)
    if not m:
        return None
    b_name = m.group(1).strip().lower()
    ch_num = int(m.group(2))
    v_part = m.group(3)
    
    b_num = LOOKUP.get(b_name)
    if not b_num:
        b_name_clean = b_name.replace('-', ' ').strip()
        b_num = LOOKUP.get(b_name_clean)
    if not b_num:
        return None
    
    # If it's a 1-chapter book and no colon was used (e.g. "Áp-đia 15" = Obadiah verse 15)
    if b_num in ONE_CHAPTER_BOOKS and not v_part:
        chapter = 1
        verses = [ch_num]
    else:
        chapter = ch_num
        verses = parse_verses_part(v_part) if v_part else [1]
        
    return {
        "book": b_num,
        "chapter": chapter,
        "verses": verses,
        "raw": ref_str
    }

# Test cases
test_cases = [
    "Thi thiên 37:29",
    "시편 37:29",
    "LU 8:18",
    "2 Ti 3:16, 17",
    "1 Ti-mô-thê 4:13-16",
    "Châm ngôn 3:5, 6",
    "Áp-đia 15",
    "Gia-cơ 1:5",
    "Rô-ma 12:2",
    "Khải huyền 21:3, 4",
    "Ma-thi-ơ 24:14",
    "1 Cô 13:4-8",
    "Giăng 17:3"
]

for t in test_cases:
    res = parse_scripture_ref(t)
    print(f"{t:22} -> Book {res['book']:2d}, Ch {res['chapter']:3d}, Verses: {res['verses']}")
