# -*- coding: utf-8 -*-
"""Official video lyric cues (the WebVTT subtitles of jw.org's song VIDEOS) for 오리지널 송 / 어린이 노래, per language: do they exist, and do
their lines (a cue may hold two lines) add up to the singable lines of the page? Caches the mediator answers and the VTT texts in
jw_extraction/video_cues_cache.json.    python3 scripts/song_video_cues_audit.py [--cache]
"""
import json, os, re, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODES = {"vi": "VT", "ko": "KO", "en": "E", "zh": "CH", "ja": "J", "de": "X", "fr": "F", "pl": "P", "cs": "B", "hu": "H", "id": "IN", "zh_cn": "CHS"}
CACHE = os.path.join(ROOT, "jw_extraction", "video_cues_cache.json")
STRUCT = re.compile(r"^\s*(\(.*\)|（.*）|[\[【].*[\]】]|\d+\s*[.．。]?|[※＊*].*)\s*$")
def singable(rows): return [r.strip() for r in rows if r and r.strip() and not STRUCT.match(r.strip())]
def get(url, js=True):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=40) as r:
                return json.load(r) if js else r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            time.sleep(1 + i)
        except Exception: time.sleep(1 + i)
    return "ERR"
def cues(vtt):
    out = []
    for a, b, t in re.findall(r"(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})[^\n]*\n((?:(?!\n\n).)*)", vtt.replace("\r", ""), re.S):
        lines = [x.strip() for x in t.strip().split("\n") if x.strip()]
        if lines: out.append((a, b, lines))
    return out
def rows_of(coll):
    i18n = json.load(open(os.path.join(ROOT, "jw_songs_i18n.json"), encoding="utf-8"))["songs"]
    base = json.load(open(os.path.join(ROOT, "jw_original_songs_ko_vi.json" if coll == "osg" else "jw_childrens_songs_ko_vi.json"), encoding="utf-8"))
    res, media = {}, {}
    for s in base["songs"]:
        k = s["id"]
        for lg in ("vi", "ko"):
            if isinstance(s.get(lg), dict):
                res.setdefault(k, {})[lg] = singable(re.split(r"\n+", s[lg].get("lyrics") or ""))
                m = re.search(r"lank=(pub-[a-z]+_\d+_VIDEO)", s[lg].get("jwOrgUrl") or "")
                if m: media.setdefault(k, {})[lg] = m.group(1)
    for k, v in i18n.items():
        if k not in res: continue
        for lg in CODES:
            if lg in v and v[lg].get("available"): res.setdefault(k, {})[lg] = singable([l for sec in v[lg].get("sections", []) for l in sec.get("lines", [])])
            if lg in v and (v[lg].get("media") or {}).get("kind") == "VIDEO": media.setdefault(k, {})[lg] = v[lg]["media"]["mediaKey"]
    return res, media
def main():
    cache = json.load(open(CACHE, encoding="utf-8")) if "--cache" in sys.argv and os.path.exists(CACHE) else {}
    jobs = []
    for coll in ("osg", "pkon"):
        rows, media = rows_of(coll)
        for k, langs in rows.items():
            pub = "pk" if k == "pk-special-0" else coll
            for lg, lines in langs.items():
                key = media.get(k, {}).get(lg) or media.get(k, {}).get("vi") or media.get(k, {}).get("ko") or ("pub-%s_%s_VIDEO" % (pub, k.split("-")[-1]))
                jobs.append((coll, k, lg, key, lines))
    def one(j):
        coll, k, lg, key, lines = j; code = CODES[lg]; ck = key + "|" + code
        if ck not in cache:
            d = get("https://b.jw-cdn.org/apis/mediator/v1/media-items/%s/%s?clientType=www" % (code, key))
            ent = {"media": False}
            if isinstance(d, dict) and d.get("media"):
                m = d["media"][0]; f = [x for x in m.get("files", []) if x.get("label") == "360p"]
                ent = {"media": True, "duration": m.get("duration"), "checksum": f[0].get("checksum") if f else None, "url": f[0].get("progressiveDownloadURL") if f else None, "vtt": None}
                sub = f and (f[0].get("subtitles") or {}).get("url")
                if sub:
                    v = get(sub, js=False); ent["vtt"] = v if isinstance(v, str) and v.startswith("WEBVTT") else None
            cache[ck] = ent
        return j, cache[ck]
    with ThreadPoolExecutor(5) as ex: res = list(ex.map(one, jobs))
    os.makedirs(os.path.dirname(CACHE), exist_ok=True); json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
    import collections
    tot = collections.defaultdict(collections.Counter)
    for (coll, k, lg, key, lines), ent in res:
        c = tot[coll + " " + lg]
        if not ent["media"]: c["no video"] += 1; continue
        if not ent.get("vtt"): c["video, no subtitles"] += 1; continue
        cs = cues(ent["vtt"]); n = sum(len(x[2]) for x in cs); single = sum(1 for x in cs if len(x[2]) == 1)
        if n == len(lines): c["cue lines == page lines"] += 1; c["  single-line cues (buttons)"] += single; c["  lines in grouped cues"] += n - single
        else: c["cue lines %d != page lines %d" % (n, len(lines)) if abs(n - len(lines)) <= 0 else "count differs"] += 1
    for k in sorted(tot): print(k, dict(tot[k]))
main()
