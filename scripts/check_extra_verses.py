import json, re, os
from bible_lookup_def import LOOKUP

ONE_CHAPTER_BOOKS = {31, 57, 63, 64, 65}
extra_verses = set()

def parse_verses_part(v_str):
    if not v_str: return []
    verses = []
    parts = re.split(r'[,;、]', v_str)
    for p in parts:
        p = p.strip()
        if not p: continue
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

def extract_from_text(text):
    if not text or not isinstance(text, str): return
    keys = sorted(LOOKUP.keys(), key=lambda x: len(x), reverse=True)
    esc = '|'.join(re.escape(k) for k in keys)
    pat = re.compile(rf'(?:^|[^\w])({esc})\s+(\d+)(?:\s*:\s*([\d\s,–~-]+))?', re.IGNORECASE)
    for m in pat.finditer(text):
        b_name = m.group(1).lower().strip()
        ch_num = int(m.group(2))
        v_part = m.group(3)
        b_num = LOOKUP.get(b_name)
        if not b_num:
            b_name = b_name.replace('-', ' ')
            b_num = LOOKUP.get(b_name)
        if not b_num: continue
        if b_num in ONE_CHAPTER_BOOKS and not v_part:
            ch = 1
            vs = [ch_num]
        else:
            ch = ch_num
            vs = parse_verses_part(v_part) if v_part else [1]
        for v in vs:
            extra_verses.add((b_num, ch, v))

def scan_file(fn):
    if not os.path.exists(fn): return
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    extract_from_text(content)

for fn in ['love_people_data.json', 'lpd_data.py', 'curriculum_data.py', 'offer_talks_data.py', 'elder_data.py', 'weekly_assignments_data.py']:
    scan_file(fn)

with open('bible_cited_verses.json', encoding='utf-8') as f:
    cur = json.load(f)

cur_verses = set()
for k in cur['verses'].keys():
    b, c, v = map(int, k.split(':'))
    cur_verses.add((b, c, v))

new_verses = extra_verses - cur_verses
print(f"Total scanned in extra files: {len(extra_verses)}, new verses needed: {len(new_verses)}")
if new_verses:
    print("Sample new verses:", list(new_verses)[:10])
