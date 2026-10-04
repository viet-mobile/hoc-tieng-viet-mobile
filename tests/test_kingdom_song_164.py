# -*- coding: utf-8 -*-
"""왕국 노래 164 in songs_data.js (SONGS_DATA): 164 songs, 1-163 byte-for-byte what they were, 164 as given.

  - SONGS_DATA has tracks 1..164 once each; the ids of the shipped songs are the numbers themselves.
  - Songs 1-163 are unchanged: sha256 of their canonical JSON (sorted keys) equals the one taken before 164 was added
    (this also protects the Japanese line breaks and the Chinese / Indonesian post-processing of 1-163).
  - 164 equals tests/fixtures/kingdom_song_164_update.json (the 164-only update file made from Songs(8).xlsx; the only
    fixture, tracked), language by language; Japanese is empty (title, scripture, reference, every line) and its header
    is the workbook's "164番". Nothing is translated or copied into Japanese.
  - songs_data.json (the 163-song Excel conversion of 2026-09-23, untracked) is not a source of anything: no build or
    runtime code opens it, so it may stay at 163. songs_data.js is the one source of SONGS_DATA.
  - Vietnamese, Korean and English titles; Korean / Vietnamese / the other nine languages have lyrics.
"""
import hashlib
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHA_1_163 = "f85352bc24b0f656a34dad49f0d62ec5d91436d9b0a50b1a68bf518eb5023dd2"
SITE_KEY = {"zh_tw": "zh"}  # the workbook's Traditional Chinese key -> the site's key

failures = []
checks = 0


def ok(cond, msg):
    global checks
    checks += 1
    if not cond:
        failures.append(msg)


def songs():
    src = open(os.path.join(ROOT, "songs_data.js"), encoding="utf-8").read()
    marker = "const SONGS_DATA = "
    return json.JSONDecoder().raw_decode(src[src.index(marker) + len(marker):])[0]


def main():
    data = songs()
    nums = [s["number"] for s in data]
    ok(nums == list(range(1, 165)), "tracks are exactly 1..164, once each: %s...%s (%d)" % (nums[:2], nums[-2:], len(nums)))
    ok(len({s["sourceSheet"] for s in data}) == 164, "sourceSheet unique")
    digest = hashlib.sha256(json.dumps(data[:163], ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()
    ok(digest == SHA_1_163, "songs 1-163 changed (sha256 %s)" % digest)

    rec = data[163]
    ok(rec["number"] == 164 and rec["sourceSheet"] == "164", "record 164 header")
    ok(list(rec) == list(data[162]), "164 has the same keys, in the same order, as 163: %s" % list(rec))
    ok(list(rec["labels"]) == list(data[162]["labels"]), "164 language order is that of 163")
    ok((rec["title"]["ko"], rec["title"]["vi"], rec["title"]["en"]) == ("당신을 신뢰합니다", "Con tin cậy ngài", "I Trust In You"), "164 titles")

    upd = json.load(open(os.path.join(ROOT, "tests", "fixtures", "kingdom_song_164_update.json"), encoding="utf-8"))
    ok(upd["track"] == 164 and upd["expectedPreviousMaxTrack"] == 163 and upd["song"]["track"] == 164, "fixture is the 164 update")
    for name, src in (("update", upd["song"]["languages"]),):
        for k, v in src.items():
            lang = SITE_KEY.get(k, k)
            if lang == "ja":
                ok(not (v["title"] or v["reference"] or v["lyrics"] or v["lines"] or v["displayLines"]) and v["available"] is False and v["header"] == "164番",
                   name + ": ja is empty in the source")
                continue
            lines = v["lines"]
            ok(lines and lines == v["displayLines"], "%s %s: lines" % (name, lang))
            ok(rec["labels"][lang] == v["header"] and rec["title"][lang] == v["title"] and rec["scripture"][lang] == v["reference"], "%s %s: header / title / scripture" % (name, lang))
            ok([l[lang] for l in rec["lines"]] == lines[:-1] and rec["reference"][lang] == lines[-1], "%s %s: lines and closing reference" % (name, lang))
    ok({SITE_KEY.get(k, k) for k in upd["song"]["languages"]} == set(rec["labels"]), "the fixture carries exactly the 12 site languages")

    # songs_data.json is not read by any build / runtime / script (comments in the generated files mention it, that is all)
    readers = []
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d not in (".git", "dist", "node_modules", "__pycache__", "scratch", "tests")]
        for f in files:
            if f.endswith((".py", ".js")) and not f.startswith(("scratch_", "data_block", "app.")):
                text = open(os.path.join(base, f), encoding="utf-8", errors="replace").read()
                if any(("%s%s%s" % (q, "songs_data.json", q)) in text for q in ('"', "'")):
                    readers.append(os.path.relpath(os.path.join(base, f), ROOT))
    ok(not readers, "songs_data.json is opened by: %s" % readers)

    ja = "ja"
    ok(rec["labels"][ja] == "164番" and rec["title"][ja] == "" and rec["scripture"][ja] == "" and rec["reference"][ja] == "", "164 Japanese header only")
    ok(len(rec["lines"]) == 36 and all(l[ja] == "" for l in rec["lines"]), "164 Japanese: 36 empty cells, no text")
    ok(not any(l[ja] for l in rec["lines"]) and sum(1 for l in rec["lines"] if l[ja]) == 0, "164 Japanese lyrics: 0 lines")
    for lang in rec["labels"]:
        if lang == ja:
            continue
        ok(rec["title"][lang] and rec["scripture"][lang] and rec["reference"][lang] and all(l[lang] for l in rec["lines"]), "164 %s has title, scripture, lyrics and reference" % lang)
    ok(all(isinstance(l, dict) and set(l) == set(rec["labels"]) for l in rec["lines"]), "every 164 line has all 12 languages")

    # SONG_MEDIA["full"] (which 전체 듣기 buttons exist): canonical, 1..164 only, and the known jw.org state
    sys.path.insert(0, ROOT)
    from song_media_data import SONG_MEDIA
    from scripts.song_full_media import ranges, locales
    full = SONG_MEDIA["full"]
    ok(set(full) == set(locales()), "SONG_MEDIA['full'] has exactly the UI languages of app_logic.js songJwLocale")
    sets = {}
    for lang, spec in full.items():
        nums_l = []
        for part in spec.split(","):
            a, _, b = part.partition("-")
            nums_l.extend(range(int(a), int(b or a) + 1))
        sets[lang] = set(nums_l)
        ok(len(nums_l) == len(set(nums_l)) and nums_l == sorted(nums_l), "full %s: sorted, no duplicates" % lang)
        ok(ranges(nums_l) == spec, "full %s: canonical range string (what scripts/song_full_media.py --write produces)" % lang)
        ok(nums_l and 1 <= nums_l[0] and nums_l[-1] <= 164, "full %s within 1..164" % lang)
    gaps = {l: sorted(set(range(1, 165)) - v) for l, v in sets.items() if set(range(1, 165)) - v}
    ok(gaps == {"vi": [164], "zh_cn": [162, 163]},
       "known jw.org state: Vietnamese 164 not published (finder -> home page), zh_cn 162-163 finder -> home page: %s" % gaps)
    ok("ja" in sets and 164 in sets["ja"], "164 has a Japanese video link even though it has no Japanese lyrics")

    print("checks run: %d" % checks)
    if failures:
        for f in failures:
            print("  [FAIL] " + f)
        print("--- KINGDOM SONG 164 TEST FAILED ---")
        return 1
    print("--- KINGDOM SONG 164 TEST PASSED ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
