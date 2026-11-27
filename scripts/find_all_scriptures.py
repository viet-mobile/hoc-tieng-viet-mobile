import os, json, re

books_pattern = (
    r'(?:[123]\s+)?(?:'
    r'Sáng thế|Xuất Ai Cập|Xuất ê-díp-tô|Lê-vi|Dân số|Phục truyền luật lệ|Phục truyền|'
    r'Giô-suê|Quan xét|Ru-tơ|Sa-mu-ên|Các vua|Sử lược|Sử ký|Sử|'
    r'Ê-xơ-ra|Nê-hê-mi|Ê-xơ-tê|Gióp|Thi thiên|Thi-thiên|Thi|Châm ngôn|Truyền đạo|Nhã ca|'
    r'Ê-sai|Giê-rê-mi|Ca thương|Ê-xê-chi-ên|Đa-ni-ên|Ô-sê|Giô-ên|A-mốt|Áp-đia|Giô-na|Mi-chê|Na-hum|Ha-ba-cúc|Xô-phô-ni|A-ghê|Xa-cha-ri|Ma-la-chi|'
    r'Ma-thi-ơ|Mat|Mác|Lu-ca|Lu|LU|Giăng|Công vụ|'
    r'Rô-ma|Ro|Cô-rinh-tô|Cô|Ga-la-ti|Ê-phê-sô|Ê-phê|Phi-líp|Cô-lô-se|'
    r'Tê-sa-lô-ni-ca|Tê|Ti-mô-thê|Ti|Tít|Phi-lê-môn|'
    r'Hê-bơ-rơ|Hê|Gia-cơ|Gc|Phi-e-rơ|Phi|Giu-đe|Khải huyền|Khải|Kh'
    r')'
)

scripture_re = re.compile(
    r'\b(' + books_pattern + r')\s+(\d+)(?:\s*:\s*([\d\s,–~-]+))?',
    re.IGNORECASE
)

all_found = []

# 1. Watchtower
if os.path.exists('watchtower_study_data.json'):
    with open('watchtower_study_data.json', 'r', encoding='utf-8') as f:
        wt = json.load(f)
    wt_count = 0
    for s in wt.get('sheets', []):
        for r in s.get('rows', []):
            vi = r.get('vi', '')
            for m in scripture_re.finditer(vi):
                all_found.append(('WT', m.group(0).strip()))
                wt_count += 1
    print(f'Watchtower scriptures: {wt_count}')

# 2. Neighbor conversations
if os.path.exists('neighbor_conversations_data.py'):
    with open('neighbor_conversations_data.py', 'r', encoding='utf-8') as f:
        txt = f.read()
    nb_count = 0
    for m in scripture_re.finditer(txt):
        all_found.append(('Neighbor', m.group(0).strip()))
        nb_count += 1
    print(f'Neighbor scriptures: {nb_count}')

# 3. Enjoy life forever
if os.path.exists('enjoy_life_forever_data.json'):
    with open('enjoy_life_forever_data.json', 'r', encoding='utf-8') as f:
        elf = json.load(f)
    elf_count = 0
    # recursively find strings
    def scan_obj(o):
        global elf_count
        if isinstance(o, str):
            for m in scripture_re.finditer(o):
                all_found.append(('ELF', m.group(0).strip()))
                elf_count += 1
        elif isinstance(o, dict):
            for v in o.values(): scan_obj(v)
        elif isinstance(o, list):
            for v in o: scan_obj(v)
    scan_obj(elf)
    print(f'ELF scriptures: {elf_count}')

# 4. Songs
if os.path.exists('jw_kingdom_songs_1_164.json'):
    with open('jw_kingdom_songs_1_164.json', 'r', encoding='utf-8') as f:
        songs = json.load(f)
    s_count = 0
    scan_obj(songs)
    print(f'Song scriptures: {s_count}')

print(f'Total citations found: {len(all_found)}')
unique_refs = set([ref[1] for ref in all_found])
print(f'Unique scripture references: {len(unique_refs)}')
print('Sample unique references:')
for u in sorted(list(unique_refs))[:30]:
    print('  ', u)
