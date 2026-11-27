import json, re, os
from test_ref_parser import parse_scripture_ref

all_refs = []

# Regex to find scripture patterns in text
# e.g. (Thi thiên 37:29) or (시편 37:29) or (Lu 8:18)
pattern = re.compile(r'\b([123]\s+[^\d:()\[\]{}“”"\'.,—\n]+|[^\d:()\[\]{}“”"\'.,—\n]+)\s+(\d+)(?:\s*:\s*([\d\s,–~-]+))?')

def extract_from_text(txt):
    for m in pattern.finditer(txt):
        candidate = m.group(0).strip()
        parsed = parse_scripture_ref(candidate)
        if parsed:
            all_refs.append(parsed)

# 1. Watchtower
if os.path.exists('watchtower_study_data.json'):
    with open('watchtower_study_data.json', 'r', encoding='utf-8') as f:
        wt = json.load(f)
    for s in wt.get('sheets', []):
        for r in s.get('rows', []):
            extract_from_text(r.get('vi', ''))
            extract_from_text(r.get('ko', ''))

# 2. Neighbor
if os.path.exists('neighbor_conversations_data.py'):
    with open('neighbor_conversations_data.py', 'r', encoding='utf-8') as f:
        extract_from_text(f.read())

# 3. Enjoy life forever
if os.path.exists('enjoy_life_forever_data.json'):
    with open('enjoy_life_forever_data.json', 'r', encoding='utf-8') as f:
        elf = json.load(f)
    def scan(o):
        if isinstance(o, str): extract_from_text(o)
        elif isinstance(o, dict):
            for v in o.values(): scan(v)
        elif isinstance(o, list):
            for v in o: scan(v)
    scan(elf)

# 4. Songs
if os.path.exists('songs_data.json'):
    with open('songs_data.json', 'r', encoding='utf-8') as f:
        songs = json.load(f)
    scan(songs)

print(f"Total citations found: {len(all_refs)}")
unique_verses = set()
for r in all_refs:
    b = r['book']
    c = r['chapter']
    for v in r['verses']:
        unique_verses.add((b, c, v))

print(f"Total unique (book, chapter, verse) tuples: {len(unique_verses)}")
sample_sorted = sorted(list(unique_verses))[:20]
print("Sample verses:")
for b, c, v in sample_sorted:
    print(f"  Book {b:2d}, Ch {c:3d}, Vs {v:3d}")
