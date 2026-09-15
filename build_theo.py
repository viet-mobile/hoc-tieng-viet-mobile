import json, unicodedata
from theocratic_vocab import VOCAB

# Vietnamese alphabetical order (dictionary order / 사전어순) for base letters, tone-insensitive.
ORDER = "aăâbcdđeêghiklmnoôơpqrstuưvxy"
RANK = {ch: i for i, ch in enumerate(ORDER)}


def sort_key(word):
    w = word.lower()
    key = []
    for ch in w:
        if ch in RANK:
            key.append((0, RANK[ch]))
            continue
        # strip a tone-mark accent to find the base Vietnamese letter (NFD splits tone
        # diacritics from the base letter, but leaves ă/â/ê/ô/ơ/ư/đ intact as single codepoints)
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


rows = []
for viet, hanja, kr in VOCAB:
    rows.append({"word": viet, "hanja": hanja, "meaning": kr})

rows.sort(key=lambda r: sort_key(r["word"]))

json.dump(rows, open("vocab_theo.json", "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print("total theocratic vocab entries:", len(rows))
print("with hanja:", sum(1 for r in rows if r["hanja"]))
print(rows[0], rows[1], rows[-1])
