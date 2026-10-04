# -*- coding: utf-8 -*-
"""Network check (not part of the offline test run): opens every jw.org link of jw_original_songs_ko_vi.json and
jw_childrens_songs_ko_vi.json and compares the ones that fall back to the jw.org home page with
song_tab_links.SONG_LINKS_NOT_ON_JWORG. Run it when jw.org may have added languages:  python tests/check_song_links.py
"""
import json
import os
import sys
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


def main():
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
