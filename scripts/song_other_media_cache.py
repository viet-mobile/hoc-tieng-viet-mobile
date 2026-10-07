# -*- coding: utf-8 -*-
"""Caches jw.org's media API answers for 오리지널 송 (osg) and 어린이 노래 (pkon, pk) x 12 languages into jw_extraction/other_media_cache.json
and prints, per collection, how many (song, language) pairs get line buttons under: the OLD rule (raw marker count == lines), the rule
of this release (exact AND no non-vocal marker: held back otherwise), and the 왕국 노래 rule (sung markers == lines, long lines withheld).
    python3 scripts/song_other_media_cache.py [--cache]
"""
import json, os, re, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
CODES = {"vi": "VT", "ko": "KO", "en": "E", "zh": "CH", "ja": "J", "de": "X", "fr": "F", "pl": "P", "cs": "B", "hu": "H", "id": "IN", "zh_cn": "CHS"}
API = "https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&fileformat=MP3&alllangs=0&pub=%s&track=%d&langwritten=%s"
CACHE = os.path.join(ROOT, "jw_extraction", "other_media_cache.json")
STRUCT = re.compile(r"^\s*(\(.*\)|（.*）|[\[【].*[\]】]|\d+\s*[.．。]?|[※＊*].*)\s*$")

def get(url):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=40) as r: return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404: return {"status": 404}
            time.sleep(1.5 * (i + 1))
        except Exception: time.sleep(1.5 * (i + 1))
    return None

def singable(rows): return [r.strip() for r in rows if r and r.strip() and not STRUCT.match(r.strip())]
def ms(t):
    m = re.match(r"^(\d+):(\d+):(\d+(?:\.\d+)?)$", str(t or "")); return int(round((int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))) * 1000)) if m else None

def rows_of(coll):
    i18n = json.load(open(os.path.join(ROOT, "jw_songs_i18n.json"), encoding="utf-8"))["songs"]
    base = json.load(open(os.path.join(ROOT, "jw_original_songs_ko_vi.json" if coll == "osg" else "jw_childrens_songs_ko_vi.json"), encoding="utf-8"))
    res = {}
    for k, v in i18n.items():
        pre, _, n = k.partition("-")
        if pre != coll: continue
        for lg in CODES:
            if lg in v and v[lg].get("available"): res.setdefault(k, {})[lg] = singable([l for s in v[lg].get("sections", []) for l in s.get("lines", [])])
    for s in base["songs"]:
        if not str(s["id"]).startswith(coll + "-"): continue
        for lg in ("vi", "ko"):
            if isinstance(s.get(lg), dict): res.setdefault(s["id"], {})[lg] = singable(re.split(r"\n+", s[lg].get("lyrics") or ""))
    return res

def main():
    cache = json.load(open(CACHE, encoding="utf-8")) if "--cache" in sys.argv and os.path.exists(CACHE) else {}
    plan = {"original": [("osg", k, int(k.split("-")[1]), v) for k, v in rows_of("osg").items()],
            "children": [("pkon", k, int(k.split("-")[1]), v) for k, v in rows_of("pkon").items()] + [("pk", k, 0, v) for k, v in rows_of("pk").items()]}
    jobs = [(pub, k, t, lg) for coll in plan for pub, k, t, rows in plan[coll] for lg in rows]
    def one(j):
        pub, k, t, lg = j; key = "%s:%d:%s" % (pub, t, CODES[lg])
        if key not in cache: cache[key] = get(API % (pub, t, CODES[lg]))
        return j, cache[key]
    with ThreadPoolExecutor(5) as ex: res = dict(ex.map(one, jobs))
    os.makedirs(os.path.dirname(CACHE), exist_ok=True); json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
    for coll in plan:
        c = {"pairs": 0, "old_rule_ok": 0, "this_release_ok": 0, "kingdom_rule_ok": 0, "old_ok_but_wrong(pid99 inside the count)": 0, "no_audio": 0, "no_markers": 0}
        for pub, k, t, rows in plan[coll]:
            for lg, lines in rows.items():
                c["pairs"] += 1
                d = res[(pub, k, t, lg)]; f = (d.get("files", {}).get(CODES[lg], {}).get("MP3") or [None])[0] if isinstance(d, dict) else None
                if not f: c["no_audio"] += 1; continue
                mk = (f.get("markers") or {}).get("markers") or []
                if not mk: c["no_markers"] += 1; continue
                sung = [m for m in mk if int(m.get("mepsParagraphId") or 0) != 99]
                old = len(mk) == len(lines); new = old and len(sung) == len(mk); king = len(sung) == len(lines)
                c["old_rule_ok"] += old; c["this_release_ok"] += new; c["kingdom_rule_ok"] += king
                if old and not new: c["old_ok_but_wrong(pid99 inside the count)"] += 1
        print(coll, json.dumps(c))
main()
