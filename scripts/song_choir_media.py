# -*- coding: utf-8 -*-
"""JW choir recordings of 왕국 노래 (jw.org "Original Songs", pub-osg): which song has one, and in which UI languages.

    python scripts/song_choir_media.py            # print the mapping and the CHOIR_OSG block
    python scripts/song_choir_media.py --write    # rewrite that block in song_media_data.py (nothing else in the file)
    python scripts/song_choir_media.py --check    # compare with song_media_data.CHOIR_OSG (exit 1 on a difference)

The osg track number of a song is NOT computed from the song number (no formula of any kind): it is read
from jw.org's own media metadata. For every UI language, jw.org's pub-media API lists the titles of the osg tracks; a
왕국 노래 is mapped to an osg track only when its title in the UI language is the title of exactly that one track in at
least MIN_LOCALES of the 12 languages (so a coincidence of one language -- a different song with the same title in one
language -- is never a mapping). The result is written out as an explicit table (CHOIR_OSG["tracks"]).

Availability is judged like SONG_MEDIA["full"] (scripts/song_full_media.py): by the jw.org finder link
https://www.jw.org/finder?srcid=jwlshare&wtlocale=<code>&lank=pub-osg_<track>_AUDIO|VIDEO. A redirect to the home page or
a 404 means "not published"; a timeout, 5xx or network failure is retried and then aborts the run (never recorded as missing).
"""
import json
import os
import re
import sys
import unicodedata
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from song_full_media import LANG_ORDER, finder_state, locales, ranges  # noqa: E402

MIN_LOCALES = 10
BEGIN = "# BEGIN CHOIR_OSG (scripts/song_choir_media.py --write)\n"
END = "# END CHOIR_OSG\n"


def songs_data():
    src = open(os.path.join(ROOT, "songs_data.js"), encoding="utf-8").read()
    marker = "const SONGS_DATA = "
    return json.JSONDecoder().raw_decode(src[src.index(marker) + len(marker):])[0]


def api_titles(code):
    """{osg track: {"title": ..., "fmts": {"MP3", "MP4"}}} of one language, from jw.org's pub-media API."""
    url = ("https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?output=json&pub=osg&fileformat=MP3,MP4&alllangs=0"
           "&langwritten=%s&txtCMSLang=E" % code)
    last = None
    for _ in range(4):
        try:
            data = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=60))
            break
        except OSError as e:
            last = e
    else:
        raise SystemExit("network problem (%r): nothing was recorded" % (last,))
    out = {}
    for fmt, files in (data.get("files", {}).get(code, {}) or {}).items():
        for f in files:
            rec = out.setdefault(int(f["track"]), {"title": f.get("title") or "", "fmts": set()})
            rec["fmts"].add(fmt)
    return out


def norm(title):
    s = unicodedata.normalize("NFKC", title or "").lower()
    s = re.sub(r"^\s*\d+\s*[.．]\s*", "", s)
    return re.sub(r"[\W_]+", "", s)


def derive(listing, songs):
    """{song number: osg track} -- only titles that agree in at least MIN_LOCALES languages on one single track."""
    votes = defaultdict(lambda: defaultdict(set))
    for lang, tracks in listing.items():
        index = defaultdict(list)
        for t, rec in tracks.items():
            index[norm(rec["title"])].append(t)
        for s in songs:
            key = norm(s["title"].get(lang, ""))
            if key and len(index.get(key, [])) == 1:
                votes[s["number"]][index[key][0]].add(lang)
    return {n: next(iter(v)) for n, v in sorted(votes.items()) if len(v) == 1 and len(next(iter(v.values()))) >= MIN_LOCALES}


def finder_url(track, code, kind):
    return "https://www.jw.org/finder?srcid=jwlshare&wtlocale=%s&lank=pub-osg_%d_%s" % (code, track, kind)


def fetch():
    loc = locales()
    listing = {lang: api_titles(code) for lang, code in loc.items()}
    mapping = derive(listing, songs_data())
    jobs = [(lang, n, kind) for lang in loc for n in mapping for kind in ("AUDIO", "VIDEO")]

    def one(j):
        lang, n, kind = j
        try:
            return finder_state(finder_url(mapping[n], loc[lang], kind)) == "ok"
        except OSError as e:
            raise SystemExit("network problem (%s): nothing was recorded" % e)
    with ThreadPoolExecutor(4) as pool:
        res = list(pool.map(one, jobs))
    found = {"AUDIO": {l: [] for l in loc}, "VIDEO": {l: [] for l in loc}}
    for (lang, n, kind), ok in zip(jobs, res):
        if ok:
            found[kind][lang].append(n)
    return {"tracks": mapping, "audio": {l: ranges(v) for l, v in found["AUDIO"].items()},
            "video": {l: ranges(v) for l, v in found["VIDEO"].items()}}


def block(got):
    order = lambda d: sorted(d, key=lambda l: (LANG_ORDER.index(l) if l in LANG_ORDER else 99, l))
    lines = [BEGIN.rstrip("\n"),
             '"""CHOIR_OSG: JW choir recordings (jw.org Original Songs, pub-osg) of 왕국 노래, from jw.org media metadata -- never computed',
             'from the song number. tracks[song number] = osg track (titles agree in >= %d of 12 languages); audio / video[lang] =' % MIN_LOCALES,
             'song numbers whose finder link pub-osg_<track>_AUDIO / _VIDEO opens in that UI language."""',
             "CHOIR_OSG = {", '    "tracks": {']
    lines += ['        %d: %d,' % (n, t) for n, t in sorted(got["tracks"].items())]
    lines.append("    },")
    for kind in ("audio", "video"):
        lines.append('    "%s": {' % kind)
        lines += ['        "%s": "%s",' % (l, got[kind][l]) for l in order(got[kind])]
        lines.append("    },")
    lines.append("}")
    lines.append(END.rstrip("\n"))
    return "\n".join(lines) + "\n"


def write(got):
    path = os.path.join(ROOT, "song_media_data.py")
    text = open(path, encoding="utf-8", newline="").read()
    nl = "\r\n" if "\r\n" in text else "\n"
    text = text.replace("\r\n", "\n")
    if BEGIN in text:
        a, b = text.index(BEGIN), text.index(END) + len(END)
        text = text[:a] + block(got) + text[b:]
    else:
        text = text.rstrip("\n") + "\n\n\n" + block(got)
    open(path, "w", encoding="utf-8", newline="").write(text.replace("\n", nl))


def main():
    got = fetch()
    if "--check" in sys.argv:
        from song_media_data import CHOIR_OSG
        diff = {k: (CHOIR_OSG.get(k), got[k]) for k in got if CHOIR_OSG.get(k) != got[k]}
        if diff:
            for k, (a, b) in diff.items():
                print("differs:", k, "\n  file:", a, "\n  jw.org:", b)
            return 1
        print("OK: CHOIR_OSG matches jw.org (%d songs)" % len(got["tracks"]))
        return 0
    if "--write" in sys.argv:
        write(got)
        print("song_media_data.py: CHOIR_OSG rewritten (%d songs)" % len(got["tracks"]))
    else:
        print(block(got))
    return 0


if __name__ == "__main__":
    sys.exit(main())
