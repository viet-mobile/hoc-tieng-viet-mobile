import json

with open("bible_cited_verses.json", "r", encoding="utf-8") as f:
    d = json.load(f)

needed = [
    (20, 16, 20),
    (20, 3, 5),
    (20, 3, 6),
    (42, 16, 10),
    (19, 50, 15),
    (19, 119, 112),
    (46, 9, 19),
    (46, 9, 20),
    (46, 9, 21),
    (46, 9, 22),
    (46, 9, 23),
    (20, 3, 13),
    (20, 3, 18),
    (20, 16, 3),
    (20, 22, 6),
    (46, 10, 13)
]

missing = []
for b, c, v in needed:
    key = f"{b}:{c}:{v}"
    if key not in d['verses']:
        missing.append((b, c, v))
    else:
        print(f"Found {key}: {d['verses'][key].get('ko', '')[:30]}...")

print(f"Total needed: {len(needed)}, Missing: {len(missing)}")
if missing:
    print("Missing:", missing)
