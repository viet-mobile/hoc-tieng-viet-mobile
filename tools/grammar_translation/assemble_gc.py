# Assemble scratchpad/gc/b*.txt into general_pdf_grammar_ai_translations.json (repo root).
import glob, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gram_sections import all_sections

HERE = os.path.dirname(os.path.abspath(__file__))
ORDER = ["cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "pl"]
ALL = set(ORDER) | {"ko"}
keys = {k: s for k, s in all_sections()}
hangul = re.compile(r"[가-힣]")

out = {}
for path in sorted(glob.glob(os.path.join(HERE, "gc", "b*.txt"))):
    key = lang = None
    for raw in open(path, encoding="utf-8"):
        line = raw.rstrip("\n")
        if line.startswith("@@ "):
            key, lang = line[3:].strip(), None
            assert key in keys, (path, key)
            out.setdefault(key, {})
            continue
        if line.startswith("~tko "):
            out[key].setdefault("ko", {})["t"] = line[5:].strip()
            continue
        if line.startswith("~t "):
            vals = line[3:].split("|")
            assert len(vals) == len(ORDER), (path, key, line)
            for l, v in zip(ORDER, vals):
                out[key].setdefault(l, {})["t"] = v.strip()
            continue
        if line.startswith("=") and line[1:].strip() in ALL:
            lang = line[1:].strip()
            out[key].setdefault(lang, {}).setdefault("b", "")
            continue
        if key and lang:
            out[key][lang]["b"] += (("\n" if out[key][lang]["b"] else "") + line)

problems = []
for key, langs in out.items():
    sec = keys[key]
    has_ko = any(hangul.search(l) for l in sec["lines"])
    need = set(ORDER) | (set() if has_ko else {"ko"})
    missing = sorted(need - {l for l, v in langs.items() if v.get("b")})
    if missing:
        problems.append((key, "missing", missing))
    for l, v in langs.items():
        b = v.get("b", "")
        if l != "ko" and hangul.search(re.sub(r"⟦[^⟧]*⟧", "", b)) and not re.search(r"\[[^\]]*[가-힣][^\]]*\]", b):
            problems.append((key, l, "hangul outside markers"))
        if b.count("⟦") != b.count("⟧"):
            problems.append((key, l, "unbalanced markers"))
        if sec["title"] and hangul.search(sec["title"]) and not v.get("t") and l != "ko":
            problems.append((key, l, "no title"))

dest = os.path.join(os.getcwd(), "general_pdf_grammar_ai_translations.json")
json.dump(out, open(dest, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=0, sort_keys=True)
print("sections translated:", len(out), "of", len(keys))
for p in problems[:40]:
    print("PROBLEM", p)
print("problems:", len(problems))
