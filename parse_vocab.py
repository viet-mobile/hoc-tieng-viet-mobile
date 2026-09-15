import re, json

# endless (word chain) list
lines = open("hanja_endless.txt", encoding="utf-8").read().splitlines()
chain = []
for l in lines:
    m = re.match(r"^(\d+)\s*\|\s*(.+)$", l.strip())
    if not m: continue
    num = int(m.group(1))
    rest = m.group(2)
    # rest like: "đầu hàng (投降)  항복"  or without hanja: "word  뜻"
    m2 = re.match(r"^(.+?)\s*\(([^)]+)\)\s*(.+)$", rest)
    if m2:
        word, hanja, meaning = m2.group(1).strip(), m2.group(2).strip(), m2.group(3).strip()
    else:
        parts = rest.rsplit("  ", 1)
        if len(parts) == 2:
            word, meaning = parts
            hanja = ""
        else:
            word, meaning, hanja = rest, "", ""
    chain.append({"n": num, "word": word.strip(), "hanja": hanja, "meaning": meaning.strip()})

json.dump(chain, open("vocab_chain.json","w",encoding="utf-8"), ensure_ascii=False)
print("chain items:", len(chain))
print(chain[:3])
print(chain[-3:])
