# -*- coding: utf-8 -*-
"""Audit of the OFFICIAL timed metadata of jw.org's song audio (pub-media API `markers`) against the lyric rows of the site.

    python3 scripts/song_audio_audit.py [--collection kingdom|original|children] [--write]

For each song and language the API (GETPUBMEDIALINKS, MP3) gives the audio file and `markers` = [{startTime, duration, mepsParagraphId}]:
one marker per sung line (the intro is the `introduction`, not a marker). The site plays a line's real music by seeking to its marker.
A (song, language) is ALLOWED only when the number of markers equals the number of singable lyric rows of that language (structure rows such
as "(ĐIỆP KHÚC)" / verse numbers alone do not count); anything else is reported as review-needed and gets no button. Nothing is guessed:
no equal split of the duration, no timing copied from another language.
--write stores song_audio_ok.json (the allow-list: collection -> song -> {lang: marker count}); no audio is stored in the repository.
"""
import json, os, re, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODES = {"vi": "VT", "ko": "KO", "en": "E", "zh": "CH", "ja": "J", "de": "X", "fr": "F", "pl": "P", "cs": "B", "hu": "H", "id": "IN", "zh_cn": "CHS"}
API = "https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&fileformat=MP3&alllangs=0&pub=%s"

def get(url):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=40) as r:
                return json.load(r)
        except Exception as e:
            err = e; time.sleep(1.5 * (i + 1))
    return None

STRUCT = re.compile(r"^\s*(\(.*\)|（.*）|[\[【].*[\]】]|\d+\s*[.．。]?|[※＊*].*)\s*$")
def singable(rows):
    out = []
    for r in rows:
        r = (r or "").strip()
        if not r or STRUCT.match(r): continue
        out.append(r)
    return out

def kingdom_rows():
    s = open(os.path.join(ROOT, "songs_data.js"), encoding="utf-8").read()
    js = subprocess.run(["node", "-e", "const s=require('fs').readFileSync(process.argv[1],'utf8');process.stdout.write(JSON.stringify(new Function(s+';return SONGS_DATA;')()))", os.path.join(ROOT, "songs_data.js")], capture_output=True, text=True, check=True).stdout
    res = {}
    for x in json.loads(js):
        res[x["number"]] = {lg: singable([l.get(lg, "") for l in x["lines"]]) for lg in CODES}
    return res

def sect_rows(entry):
    return singable([l for s in entry.get("sections", []) for l in s.get("lines", [])])
def lyr_rows(txt):
    return singable(re.split(r"\n+", txt or ""))

def other_rows(coll):
    i18n = json.load(open(os.path.join(ROOT, "jw_songs_i18n.json"), encoding="utf-8"))["songs"]
    base = json.load(open(os.path.join(ROOT, "jw_original_songs_ko_vi.json" if coll == "osg" else "jw_childrens_songs_ko_vi.json"), encoding="utf-8"))
    res = {}
    for k, v in i18n.items():
        pre, _, n = k.partition("-")
        if pre != coll: continue
        res.setdefault(n, {})
        for lg in CODES:
            if lg in v and v[lg].get("available"): res[n][lg] = sect_rows(v[lg])
    for s in base["songs"]:
        pre, _, n = str(s["id"]).partition("-")
        if pre != coll: continue
        for lg in ("vi", "ko"):
            if lg in s: res.setdefault(n, {})[lg] = lyr_rows(s[lg].get("lyrics"))
    return res

def title_ko(entry_ko):
    return re.sub(r"^\s*\d+\s*[.．]\s*", "", entry_ko or "").strip()

def audit(pubtrack, rows, label, ko_titles):
    """pubtrack: key -> (pub, track); rows: key -> {lang: singable rows}; ko_titles: key -> the site's Korean title (a track whose Korean
    audio carries another title is a wrong track: no button for any language)."""
    keys = sorted(rows, key=lambda k: (len(str(k)), str(k)))
    jobs = [(k, lg) for k in keys for lg in CODES if rows[k].get(lg) is not None]
    def one(job):
        k, lg = job
        pub, t = pubtrack[k]
        return job, get(API % pub + "&track=%s&langwritten=%s" % (t, CODES[lg]))
    out, rep = {}, {"songs": len(keys), "pairs": len(jobs), "ok": 0, "noMarkers": 0, "mismatch": 0, "noAudio": 0, "wrongTrack": 0, "review": []}
    res = {}
    with ThreadPoolExecutor(4) as ex:
        for (k, lg), d in ex.map(one, jobs):
            files = d.get("files", {}) if isinstance(d, dict) else {}
            res[(k, lg)] = (files.get(CODES[lg], {}).get("MP3") or [None])[0]
    wrong = set()
    for (k, lg), f in res.items():
        if lg == "ko" and f and ko_titles.get(k) and title_ko(f.get("title")) != title_ko(ko_titles[k]): wrong.add(k)
    for (k, lg), f in res.items():
        if k in wrong: rep["wrongTrack"] += 1; rep["review"].append("%s %s wrong track (ko title %r != %r)" % (label, k, title_ko(res[(k, "ko")]["title"]), ko_titles[k])) if lg == "ko" else None; continue
        if not f: rep["noAudio"] += 1; continue
        m = (f.get("markers") or {}).get("markers")
        if not m: rep["noMarkers"] += 1; continue
        if len(m) == len(rows[k][lg]): rep["ok"] += 1; out.setdefault(str(k), {})[lg] = len(m)
        else: rep["mismatch"] += 1; rep["review"].append("%s %s %s markers=%d rows=%d" % (label, k, lg, len(m), len(rows[k][lg])))
    return out, rep

def titles(path):
    return {str(x["id"]): (x.get("ko") or {}).get("title") for x in json.load(open(os.path.join(ROOT, path), encoding="utf-8"))["songs"]}

def main():
    only = sys.argv[sys.argv.index("--collection") + 1] if "--collection" in sys.argv else None
    allow, reports = {}, {}
    if only in (None, "kingdom"):
        rows = kingdom_rows()
        kt = {}
        for x in json.loads(subprocess.run(["node", "-e", "const s=require('fs').readFileSync(process.argv[1],'utf8');process.stdout.write(JSON.stringify(new Function(s+';return SONGS_DATA;')().map(x=>[x.number,x.title.ko])))", os.path.join(ROOT, "songs_data.js")], capture_output=True, text=True, check=True).stdout): kt[x[0]] = x[1]
        allow["kingdom"], reports["kingdom"] = audit({k: ("sjjm", k) for k in rows}, rows, "kingdom", kt)
    if only in (None, "original"):
        rows = other_rows("osg")
        kt = titles("jw_original_songs_ko_vi.json")
        rows = {"osg-" + k: v for k, v in rows.items()}
        allow["original"], reports["original"] = audit({k: ("osg", int(k.split("-")[1])) for k in rows}, rows, "original", kt)
        allow["original"] = {k.split("-")[1]: v for k, v in allow["original"].items()}
    if only in (None, "children"):
        rows = other_rows("pkon")
        rows = {("pkon-" + k): v for k, v in rows.items()}
        # the special song 0 of the children's songs is pk-special-0 (pub pk)
        sp = other_rows("pk")
        for k, v in sp.items(): rows["pk-" + k] = v
        kt = titles("jw_childrens_songs_ko_vi.json")
        pt = {k: (("pk", 0) if k.startswith("pk-") else ("pkon", int(k.split("-")[1]))) for k in rows}
        allow["children"], reports["children"] = audit(pt, rows, "children", kt)
    for k, r in reports.items():
        print(k, {a: b for a, b in r.items() if a != "review"}); [print("  review:", x) for x in r["review"][:10]]
    if "--write" in sys.argv:
        old = {}
        if os.path.exists(os.path.join(ROOT, "song_audio_ok.json")) and only: old = json.load(open(os.path.join(ROOT, "song_audio_ok.json")))
        old.update(allow)
        json.dump(old, open(os.path.join(ROOT, "song_audio_ok.json"), "w"), ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    json.dump({k: v for k, v in reports.items()}, open(os.path.join(ROOT, "song_audio_audit_report.json"), "w") if "--write" in sys.argv else open(os.devnull, "w"), ensure_ascii=False, indent=1)
main()
