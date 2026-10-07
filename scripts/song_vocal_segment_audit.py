# -*- coding: utf-8 -*-
"""Kingdom songs 1-164 x 12 UI languages: which OFFICIAL VOCAL recording of jw.org (and its own markers) can play one lyric line.

    python3 scripts/song_vocal_segment_audit.py            # audit, prints the totals, writes song_vocal_segment_audit_report.json
    python3 scripts/song_vocal_segment_audit.py --cache    # reuse the API answers cached by the previous run (no network)

Source priority per (track, locale), by jw.org's publication identity (the pub code of the media API, never a file name):
    sjjc  "Sing Out Joyfully" -- Vocals (a choir sings the words)      -> selected when it exists
    pksjj "Become Jehovah's Friend" -- Sing With Us (children sing)   -> only when sjjc does not exist
    none                                                               -> no button
    sjjm (Meetings) and sjji (Instrumental) are never a segment source: no one sings the words there.
The markers used are the markers of the selected recording itself (never those of another collection or language).
segment_status: exact (sung markers == singable lines on screen), no_vocal_source, no_markers, mismatch (review).
The page applies the same rules at run time (songSegMarks): pid 99 markers (interlude / outro) are not sung lines; a line far longer than the
others holds an interlude / the outro besides its words -> that line alone gets no button (lines_without_button).
Nothing is guessed: no even split, no copied timing, no trimming "because it is one too many".
"""
import json, os, re, subprocess, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODES = {"vi": "VT", "ko": "KO", "en": "E", "zh": "CH", "ja": "J", "de": "X", "fr": "F", "pl": "P", "cs": "B", "hu": "H", "id": "IN", "zh_cn": "CHS"}
API = "https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&fileformat=MP3&alllangs=0&pub=%s&track=%d&langwritten=%s"
CACHE = os.path.join(ROOT, "jw_extraction", "vocal_media_cache.json")
NON_VOCAL_PID, LONG_X, LONG_MIN_MS = 99, 2.5, 15000
STRUCT = re.compile(r"^\s*(\(.*\)|（.*）|[\[【].*[\]】]|\d+\s*[.．。]?|[※＊*].*)\s*$")


def get(url):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404: return {"status": 404}
            time.sleep(1.5 * (i + 1))
        except Exception:
            time.sleep(1.5 * (i + 1))
    return None


def singable(rows):
    return [r.strip() for r in rows if r and r.strip() and not STRUCT.match(r.strip())]


def kingdom_rows():
    js = subprocess.run(["node", "-e", "const s=require('fs').readFileSync(process.argv[1],'utf8');process.stdout.write(JSON.stringify(new Function(s+';return SONGS_DATA;')()))", os.path.join(ROOT, "songs_data.js")], capture_output=True, text=True, check=True).stdout
    return {x["number"]: {lg: singable([l.get(lg, "") for l in x["lines"]]) for lg in CODES} for x in json.loads(js)}


def ms(t):
    m = re.match(r"^(\d+):(\d+):(\d+(?:\.\d+)?)$", str(t or ""))
    return int(round((int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))) * 1000)) if m else None


def file_of(d, code):
    if not isinstance(d, dict) or "files" not in d: return None
    return (d["files"].get(code, {}).get("MP3") or [None])[0]


def main():
    rows = kingdom_rows()
    cache = {}
    if "--cache" in sys.argv and os.path.exists(CACHE):
        cache = json.load(open(CACHE, encoding="utf-8"))
    jobs = [(pub, t, lg) for t in sorted(rows) for lg in CODES for pub in ("sjjc", "pksjj", "sjjm")]

    def one(job):
        pub, t, lg = job
        key = "%s:%d:%s" % (pub, t, CODES[lg])
        if key not in cache:
            cache[key] = get(API % (pub, t, CODES[lg]))
        return job, cache[key]

    with ThreadPoolExecutor(5) as ex:
        res = dict(ex.map(one, jobs))
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    json.dump(cache, open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)

    out, tot = [], {"pairs": 0, "sjjc_available": 0, "pksjj_fallback_used": 0, "pksjj_available": 0, "no_vocal_source": 0, "no_markers": 0,
                    "exact": 0, "mismatch": 0, "pairs_with_a_withheld_line": 0, "lines_withheld": 0, "lines_with_button": 0, "buttons_enabled": 0, "sjjm_only_before": 0}
    per_locale = {lg: {"sjjc": 0, "pksjj": 0, "none": 0, "exact": 0} for lg in CODES}
    for t in sorted(rows):
        for lg in CODES:
            code = CODES[lg]
            fc, fk, fm = (file_of(res[(p, t, lg)], code) for p in ("sjjc", "pksjj", "sjjm"))
            sel = "sjjc" if fc else ("pksjj" if fk else "none")
            f = fc or fk
            mk = (f.get("markers") or {}).get("markers") if f else None
            marks = [{"i": i, "pid": m.get("mepsParagraphId"), "s": ms(m.get("startTime")), "d": ms(m.get("duration"))} for i, m in enumerate(mk or [])]
            # the same rules as the page (songSegMarks): pid 99 = interlude / outro, not sung; a "line" far longer than the others holds an interlude
            sung = [m for m in marks if m["pid"] != NON_VOCAL_PID]
            durs = sorted(m["d"] for m in sung)
            med = durs[len(durs) // 2] if durs else 0
            long_lines = [i for i, m in enumerate(sung) if m["d"] > LONG_MIN_MS and m["d"] > med * LONG_X]   # no button for these lines
            n_lines = len(rows[t][lg])
            if sel == "none": status = "no_vocal_source"
            elif not marks: status = "no_markers"
            elif len(sung) == n_lines: status = "exact"
            else: status = "mismatch"
            row = {"track": t, "locale": lg, "jw": code, "sjjc_available": bool(fc), "pksjj_available": bool(fk), "selected_source": sel,
                   "audio_url_available": bool(f and f.get("file", {}).get("url")), "markers_available": bool(marks), "marker_count": len(marks), "sung_marker_count": len(sung), "non_vocal_marker_count": len(marks) - len(sung),
                   "singable_line_count": n_lines, "segment_status": status, "lines_without_button": long_lines, "buttons": (n_lines - len(long_lines)) if status == "exact" else 0,
                   "mediaKey": "pub-%s_%d_AUDIO" % (sel, t) if sel != "none" else "", "url": (f or {}).get("file", {}).get("url", ""),
                   "duration_s": (f or {}).get("duration"), "markers": marks,
                   "intro": (f or {}).get("markers", {}).get("introduction") if f and f.get("markers") else None,
                   "sjjm_marker_count": len(((fm or {}).get("markers") or {}).get("markers") or []) if fm else None,
                   "sjjm_duration_s": (fm or {}).get("duration")}
            out.append(row)
            tot["pairs"] += 1
            if fc: tot["sjjc_available"] += 1
            if fk: tot["pksjj_available"] += 1
            if sel == "pksjj": tot["pksjj_fallback_used"] += 1
            if sel == "none": tot["no_vocal_source"] += 1
            if status == "no_markers": tot["no_markers"] += 1
            if status == "exact":
                tot["exact"] += 1; tot["buttons_enabled"] += 1; tot["lines_with_button"] += n_lines - len(long_lines); tot["lines_withheld"] += len(long_lines)
                if long_lines: tot["pairs_with_a_withheld_line"] += 1
            if status == "mismatch": tot["mismatch"] += 1
            if fm and not fc and not fk: tot["sjjm_only_before"] += 1
            per_locale[lg][sel] += 1
            if status == "exact": per_locale[lg]["exact"] += 1
    rep = {"generated": time.strftime("%Y-%m-%d"), "source_priority": ["sjjc", "pksjj"], "never": ["sjjm", "sjji"], "totals": tot, "per_locale": per_locale, "rows": out}
    json.dump(rep, open(os.path.join(ROOT, "song_vocal_segment_audit_report.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(json.dumps(tot, ensure_ascii=False))
    for lg, v in per_locale.items(): print(lg, v)


main()
