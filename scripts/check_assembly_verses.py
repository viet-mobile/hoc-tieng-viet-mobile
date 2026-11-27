import json

with open("bible_cited_verses.json", "r", encoding="utf-8") as f:
    d = json.load(f)

needed_verses = [
    (19, 37, 4),   # Ps 37:4
    (19, 32, 1),   # Ps 32:1
    (19, 32, 2),   # Ps 32:2
    (19, 84, 4),   # Ps 84:4
    (19, 84, 10),  # Ps 84:10
    (19, 34, 8),   # Ps 34:8
    (19, 18, 25),  # Ps 18:25
    (54, 6, 7),    # 1 Ti 6:7
    (54, 6, 8),    # 1 Ti 6:8
    (20, 18, 24),  # Pr 18:24
    (19, 127, 1),  # Ps 127:1
    (19, 127, 2),  # Ps 127:2
    (33, 2, 12),   # Mic 2:12
    (59, 3, 17),   # Jas 3:17
    (60, 5, 8),    # 1 Pe 5:8
]

missing = []
for b, c, v in needed_verses:
    key = f"{b}:{c}:{v}"
    if key not in d['verses']:
        missing.append((b, c, v))
    else:
        print(f"Found {key}: {d['verses'][key].get('ko', '')[:30]}...")

print(f"Total needed: {len(needed_verses)}, Missing: {len(missing)}")
if missing:
    print("Missing:", missing)
