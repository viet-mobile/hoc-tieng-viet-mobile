# -*- coding: utf-8 -*-
"""오리지널 송 / 어린이 노래: where the official video subtitle (the WebVTT of the song's own Vietnamese video) sings other words than the
book text, the Vietnamese lyric line of the page becomes the sung words (the user: the words in parentheses are the more exact ones).
Same alignment as the page's songSegAlignCues(): a page line = 1-3 cue lines, a cue line = 2-3 page lines, a line whose words differ is
accepted only between exact matches; a page line spanning several cue lines gets those cue lines joined by a space.
    python3 scripts/apply_cue_lyrics.py [--write]
Reads jw_extraction/video_cues_cache.json (python3 scripts/song_video_cues_audit.py fills it), edits jw_original_songs_ko_vi.json and
jw_childrens_songs_ko_vi.json (Vietnamese `lines` / `lyrics` only). Structure rows ((ĐIỆP KHÚC) ...) are kept.
"""
import json, os, re, sys, unicodedata
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STRUCT = re.compile(r"^\s*(\(.*\)|（.*）|[\[【].*[\]】]|\d+\s*[.．。]?|[※＊*].*)\s*$")
def fix(t): return t.replace("\u00d0", "\u0110").replace("\u00f0", "\u0111")   # the subtitles write Đ / đ as Ð / ð (Icelandic eth)
def norm(t): return "".join(ch for ch in re.sub(r"^\s*\d+[.．。]\s*", "", unicodedata.normalize("NFC", t).lower()) if ch.isalnum())
def dice(a, b):
    if not a or not b: return 0
    if a == b: return 1
    bag = {}; n = 0; hit = 0
    for i in range(len(a) - 1): bag[a[i:i+2]] = bag.get(a[i:i+2], 0) + 1; n += 1
    for i in range(len(b) - 1):
        k = b[i:i+2]
        if bag.get(k): bag[k] -= 1; hit += 1
    d = n + max(len(b) - 1, 0)
    return 2 * hit / d if d else 0
def cues(vtt):
    out = []
    for blk in vtt.replace("\r", "").split("\n\n"):
        ls = blk.split("\n")
        t = next((i for i, l in enumerate(ls) if re.match(r"^\d{2}:\d{2}:\d{2}\.\d{3}\s*-->", l)), None)
        if t is None: continue
        texts = [fix(re.sub(r"<[^>]*>", "", x).strip()) for x in ls[t+1:]]; texts = [x for x in texts if x]
        if texts and not any("\u266a" in x for x in texts): out.append(texts)   # ♪ lines are the subtitle's music marks, not words
    return out
def align(rows, cl):
    R = [norm(r) for r in rows]; C = [norm(c) for c in cl]; n, m = len(R), len(C); NEG = -10**9
    best = [[NEG]*(m+1) for _ in range(n+1)]; back = [[None]*(m+1) for _ in range(n+1)]; best[0][0] = 0
    for i in range(n+1):
        for j in range(m+1):
            b = best[i][j]
            if b == NEG: continue
            for k in (1, 2, 3):
                if i < n and j + k <= m:
                    cat = "".join(C[j:j+k])
                    if cat and cat == R[i]:
                        if b + 2 > best[i+1][j+k]: best[i+1][j+k] = b + 2; back[i+1][j+k] = ("M", i, j, k)
                    elif k > 1 and cat and dice(cat, R[i]) >= 0.6 and b - 1 > best[i+1][j+k]: best[i+1][j+k] = b - 1; back[i+1][j+k] = ("S", i, j, k)
            for k in (2, 3):
                if i + k <= n and j < m:
                    cat = "".join(R[i:i+k])
                    if cat and cat == C[j] and b + 1 > best[i+k][j+1]: best[i+k][j+1] = b + 1; back[i+k][j+1] = ("G", i, j, k)
            if i < n and j < m and R[i] != C[j] and b - 1 > best[i+1][j+1]: best[i+1][j+1] = b - 1; back[i+1][j+1] = ("S", i, j, 1)
    if best[n][m] == NEG: return None
    kind = [""] * n; text = [None] * n; i, j = n, m
    while i > 0 or j > 0:
        typ, pi, pj, kk = back[i][j]
        if typ == "M": kind[pi] = "ok"
        elif typ == "G":
            for q in range(kk): kind[pi+q] = "grouped"
        else: kind[pi] = "sub"; text[pi] = " ".join(cl[pj:pj+kk])
        i, j = pi, pj
    for x in range(n):
        if kind[x] == "sub" and not ((x == 0 or kind[x-1] == "ok") and (x == n-1 or kind[x+1] == "ok")): kind[x] = "unsure"; text[x] = None
    return kind, text
# a subtitle typo that would make the line worse (checked by eye): "thoái chi" for "thoái chí"
SKIP = {("osg-99", 14)}
def main():
    cache = json.load(open(os.path.join(ROOT, "jw_extraction", "video_cues_cache.json"), encoding="utf-8"))
    total = 0
    for path, pub in (("jw_original_songs_ko_vi.json", "osg"), ("jw_childrens_songs_ko_vi.json", "pkon")):
        p = os.path.join(ROOT, path); d = json.load(open(p, encoding="utf-8")); changed = 0
        for s in d["songs"]:
            vi = s.get("vi")
            if not isinstance(vi, dict) or not vi.get("lines"): continue
            m = re.search(r"lank=(pub-[a-z]+_\d+_VIDEO)", vi.get("jwOrgUrl") or "")
            key = m.group(1) if m else None
            if not key: continue
            ent = cache.get(key + "|VT")
            if not ent or not ent.get("vtt"): continue
            cs = cues(ent["vtt"]); cl = [t for c in cs for t in c]
            idx = [i for i, l in enumerate(vi["lines"]) if l.strip() and not STRUCT.match(l.strip())]
            rows = [vi["lines"][i] for i in idx]
            r = align(rows, cl)
            if not r: continue
            kind, text = r; lines = list(vi["lines"]); n = 0
            for q, i in enumerate(idx):
                if kind[q] == "sub" and text[q] and norm(text[q]) != norm(rows[q]) and dice(norm(text[q]), norm(rows[q])) >= 0.6 and (s["id"], q + 1) not in SKIP:
                    lead = re.match(r"^\s*\d+[.．。]\s*", rows[q]); new = (lead.group(0) if lead else "") + text[q]
                    print("%-14s %2d  %s\n%s-> %s" % (s["id"], q + 1, rows[q], " " * 18, new)); lines[i] = new; n += 1
            if n:
                changed += n
                if "--write" in sys.argv: vi["lines"] = lines; vi["lyrics"] = "\n".join(lines)
                if "--write" in sys.argv and "displayLines" in vi: vi["displayLines"] = lines
        total += changed
        if "--write" in sys.argv and changed:
            json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2); open(p, "a").write("\n")
    print("lines replaced:", total)
main()
