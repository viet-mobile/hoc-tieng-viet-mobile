# -*- coding: utf-8 -*-
"""Network check (not part of the offline test run): opens every jw.org link of jw_original_songs_ko_vi.json and
jw_childrens_songs_ko_vi.json and compares the ones that fall back to the jw.org home page with
song_tab_links.SONG_LINKS_NOT_ON_JWORG. Run it when jw.org may have added languages:  python tests/check_song_links.py

    python tests/check_song_links.py --kingdom 164        # only 왕국 노래 164: every UI language's finder link
    python tests/check_song_links.py --kingdom all        # every track of SONGS_DATA (+ the one after)

--kingdom opens https://www.jw.org/finder?...&lank=pub-sjjm_<n>_VIDEO in each UI language (wtlocale table read from
app_logic.js songJwLocale) and compares the result with song_media_data.SONG_MEDIA["full"], the list the page uses to
decide which 전체 듣기 buttons to show. A redirect to the jw.org home page or a 404 = not published; a timeout, 5xx or
network failure is a test error (exit 2), never "not published".
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
from song_tab_links import SONG_LINKS_NOT_ON_JWORG  # noqa: E402


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def target(url):
    opener = urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        opener.open(req, timeout=30)
        return url
    except urllib.error.HTTPError as e:
        return e.headers.get("Location") or ""


def check_kingdom(arg):
    from scripts.song_full_media import locales, MAX_TRACK, finder_url, finder_state
    from song_media_data import SONG_MEDIA
    tracks = list(range(1, MAX_TRACK + 1)) if arg == "all" else [int(arg)]
    loc = locales()
    jobs = [(lang, n) for lang in loc for n in tracks]
    try:
        with ThreadPoolExecutor(4) as pool:
            states = list(pool.map(lambda j: finder_state(finder_url(j[1], loc[j[0]])), jobs))
    except OSError as e:
        print("TEST ERROR (network, nothing concluded):", e)
        return 2
    bad = []
    for (lang, n), st in zip(jobs, states):
        listed = n in _numbers(SONG_MEDIA["full"].get(lang, ""))
        if (st == "ok") != listed:
            bad.append((lang, n, "jw.org " + st, "listed" if listed else "not listed"))
        if len(tracks) == 1:
            print("%-6s %-4s %s%s" % (lang, loc[lang], st, "" if st == "ok" else "  -> button hidden"))
    if bad:
        print("DIFFERS from song_media_data.SONG_MEDIA['full']:", bad[:20])
        return 1
    print("OK: SONG_MEDIA['full'] matches jw.org for %s" % ("tracks 1-%d" % tracks[-1] if arg == "all" else "track " + arg))
    return 0


def _numbers(spec):
    out = set()
    for part in filter(None, spec.split(",")):
        a, _, b = part.partition("-")
        out.update(range(int(a), int(b or a) + 1))
    return out


def main():
    if "--kingdom" in sys.argv:
        sys.exit(check_kingdom(sys.argv[sys.argv.index("--kingdom") + 1]))
    links = []
    for name in ("jw_original_songs_ko_vi.json", "jw_childrens_songs_ko_vi.json"):
        with open(os.path.join(ROOT, name), encoding="utf-8") as fh:
            for song in json.load(fh)["songs"]:
                for lang in ("vi", "ko"):
                    d = song.get(lang) or {}
                    if d.get("jwOrgUrl") and d.get("available") is not False:
                        links.append((song["id"], lang, d["jwOrgUrl"]))
    with ThreadPoolExecutor(16) as pool:
        found = list(pool.map(lambda x: target(x[2]), links))
    home = {(i, l) for (i, l, _), loc in zip(links, found) if loc.rstrip("/").count("/") < 5}
    print("links:", len(links), "not on jw.org:", len(home))
    if home != set(SONG_LINKS_NOT_ON_JWORG):
        print("now missing:", sorted(home - set(SONG_LINKS_NOT_ON_JWORG)))
        print("now available:", sorted(set(SONG_LINKS_NOT_ON_JWORG) - home))
        sys.exit(1)
    print("OK: song_tab_links.py matches jw.org")


if __name__ == "__main__":
    main()
