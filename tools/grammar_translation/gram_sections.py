# Python port of app_logic.js renderGeneralPdf() cleanPdfLines/parseSubsections (keys must match the JS).
import json, re, sys, os
sys.path.insert(0, os.getcwd())
from general_pdf_data import build_general_pdf

CTRL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def clean_lines(raw):
    if not raw:
        return []
    text = CTRL.sub("", raw)
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    out = []
    for line in lines:
        s = line.strip()
        if not s:
            continue
        if re.match(r"^문법·표현\s*\d+", s): continue
        if re.match(r"^핵심\s*표현\s*\d+.*?\d+\s*-\s*\d+", s): continue
        if re.match(r"^말하기\s*\d+.*?\d+\s*-\s*\d+", s): continue
        if re.match(r"^\d{2}\s*-\s*\d{2}$", s): continue
        if re.search(r"Bài\s+\d+.*?\d+$", s) or re.search(r"\|\s*\d+\s*\|\s*·", s): continue
        if re.search(r"베트남어\s+(?:읽기|가르치기와\s*배우기).*?·\s*\d+$", s): continue
        if re.match(r"^\d{1,3}$", s): continue
        if re.search(r"\|\s*\d{1,3}\s*$", s): continue
        out.append(re.sub(r"[ \t]{4,}", "   ", line).rstrip())
    while out and not out[-1].strip():
        out.pop()
    return out


SUBHEAD = re.compile(r"^\s*(\d+)[\.\s]+([가-힣A-Za-z].*)$")


def sections_of(lines):
    secs = []
    cur = {"title": None, "lines": []}
    for l in lines:
        s = l.strip()
        m = SUBHEAD.match(s)
        if m and len(s) < 60 and not re.match(r"^[A-Z]\s+", s) and not s.startswith("19") and not s.startswith("20"):
            if cur["title"] or any(x.strip() for x in cur["lines"]):
                secs.append(cur)
            cur = {"title": m.group(1) + ". " + m.group(2).strip(), "lines": []}
        else:
            cur["lines"].append(l)
    if cur["title"] or any(x.strip() for x in cur["lines"]):
        secs.append(cur)
    return secs


def all_sections():
    d, _ = build_general_pdf()
    out = []
    for row in d["grammar"]:
        for si, sec in enumerate(sections_of(clean_lines(row["original"]))):
            out.append((row["id"] + "#" + str(si), sec))
    return out


if __name__ == "__main__":
    secs = all_sections()
    hangul = re.compile(r"[가-힣]")
    n_ko = [k for k, s in secs if any(hangul.search(l) for l in s["lines"]) or (s["title"] and hangul.search(s["title"]))]
    chars = sum(sum(len(l.strip()) for l in s["lines"]) for k, s in secs)
    print("sections", len(secs), "with korean", len(n_ko), "chars", chars)
    uniq = {}
    for k, s in secs:
        body = "\n".join(l.strip() for l in s["lines"])
        uniq.setdefault((s["title"], body), []).append(k)
    print("unique sections", len(uniq))
