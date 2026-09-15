import re, json

lines = open("hanja_words.txt", encoding="utf-8").read().splitlines()
groups = []
cur = None
def parse_word(s):
    m = re.match(r"^(.+?)\s*\(([^)]+)\)\s*(.+)$", s.strip())
    if m:
        return {"word": m.group(1).strip(), "hanja": m.group(2).strip(), "meaning": m.group(3).strip()}
    parts = s.strip().rsplit("  ", 1)
    if len(parts) == 2:
        return {"word": parts[0].strip(), "hanja": "", "meaning": parts[1].strip()}
    return {"word": s.strip(), "hanja": "", "meaning": ""}

for l in lines:
    l = l.strip()
    m = re.match(r"^(\d+)\s*\|\s*([^\|]+?)\s*\|\s*(.+)$", l)
    if m:
        if cur:
            groups.append(cur)
        num = int(m.group(1))
        syllable = m.group(2).strip()
        first_word = m.group(3).strip()
        cur = {"n": num, "syllable": syllable, "words": [parse_word(first_word)]}
    else:
        if cur and l:
            cur["words"].append(parse_word(l))

if cur:
    groups.append(cur)

json.dump(groups, open("vocab_groups.json","w",encoding="utf-8"), ensure_ascii=False)
print("groups:", len(groups))
total_words = sum(len(g["words"]) for g in groups)
print("total words:", total_words)
print(groups[0])
print(groups[-1])
