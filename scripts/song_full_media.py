# -*- coding: utf-8 -*-
"""Which 「기쁨으로 노래하라」 videos (finder lank pub-sjjm_<n>_VIDEO) the jw.org finder opens, per UI language.
(The finder, not the pub-media API, decides: for zh_cn 162-163 the API lists a file but the finder link goes to the
jw.org home page, so no button is shown for them.)

    python scripts/song_full_media.py            # print the SONG_MEDIA["full"] block
    python scripts/song_full_media.py --write    # rewrite that block in song_media_data.py (nothing else in the file)
    python scripts/song_full_media.py --check    # compare with song_media_data.SONG_MEDIA["full"] (exit 1 on a difference)

The output is deterministic: languages in the order of song_media_data.SONG_MEDIA["full"], numbers sorted, merged into
ranges, no duplicates. Re-running with the same jw.org state rewrites an identical file. After jw.org publishes more
(e.g. the Vietnamese 164): run --write, then tests/test_kingdom_song_164.py and tests/test_song_tabs.js, whose
expected gaps (vi 164, zh_cn 162-163) are the current jw.org state.

The language -> wtlocale table is the one of app_logic.js (songJwLocale), read from there, never copied. A redirect to the jw.org home page or a 404 means "not published"; a timeout, 5xx or
network failure is retried and then aborts the run (never recorded as missing).
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

MAX_TRACK = 164  # one past the last song in SONGS_DATA is probed too, so a newly published song shows up in --check


def locales():
    src = open(os.path.join(ROOT, "app_logic.js"), encoding="utf-8").read()
    body = re.search(r"function songJwLocale\(lang\) \{\s*return \{(.*?)\}\[lang\]", src, re.S).group(1)
    return {k: v for k, v in re.findall(r'(\w+): \["([A-Z]+)"', body)}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def finder_url(track, code):
    return "https://www.jw.org/finder?srcid=jwlshare&wtlocale=%s&lank=pub-sjjm_%d_VIDEO" % (code, track)


def finder_state(url):
    """'ok' (the finder opens the song's media), 'missing' (redirect to the jw.org home page, or 404) or OSError
    (timeout, 5xx, network failure: retried, then raised, never treated as 'missing')."""
    opener = urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    err = ""
    for attempt in range(4):
        try:
            opener.open(req, timeout=30)
            return "ok"
        except urllib.error.HTTPError as e:
            loc = e.headers.get("Location")
            if e.code in (301, 302, 303, 307, 308) and loc:
                return "missing" if urllib.parse.urlparse(loc).path in ("", "/") else "ok"
            if e.code in (404, 410):
                return "missing"
            err = "HTTP %d" % e.code
        except OSError as e:
            err = repr(e)
        time.sleep(2 * (attempt + 1))
    raise OSError("%s: %s" % (err, url))


def exists(track, code):
    try:
        return finder_state(finder_url(track, code)) == "ok"
    except OSError as e:
        raise SystemExit("network problem (%s): nothing was recorded" % e)


def ranges(nums):
    out, i = [], 0
    nums = sorted(nums)
    while i < len(nums):
        j = i
        while j + 1 < len(nums) and nums[j + 1] == nums[j] + 1:
            j += 1
        out.append(str(nums[i]) if i == j else "%d-%d" % (nums[i], nums[j]))
        i = j + 1
    return ",".join(out)


def fetch():
    loc = locales()
    jobs = [(lang, n) for lang in loc for n in range(1, MAX_TRACK + 1)]
    with ThreadPoolExecutor(4) as pool:
        res = list(pool.map(lambda j: exists(j[1], loc[j[0]]), jobs))
    found = {lang: [] for lang in loc}
    for (lang, n), ok in zip(jobs, res):
        if ok:
            found[lang].append(n)
    return {lang: ranges(v) for lang, v in found.items()}


LANG_ORDER = ["vi", "ko", "en", "ja", "zh", "zh_cn", "de", "fr", "pl", "cs", "hu", "id"]


def block(got):
    lines = ['    "full": {']
    for lang in sorted(got, key=lambda l: (LANG_ORDER.index(l) if l in LANG_ORDER else 99, l)):
        lines.append('        "%s": "%s",' % (lang, got[lang]))
    lines.append("    },")
    return "\n".join(lines) + "\n"


def write(got):
    """Rewrite only the "full" block of song_media_data.py (line endings kept)."""
    path = os.path.join(ROOT, "song_media_data.py")
    text = open(path, encoding="utf-8", newline="").read()
    nl = "\r\n" if "\r\n" in text else "\n"
    text = text.replace("\r\n", "\n")
    start = text.index('    "full": {')
    end = text.index("    },\n", start) + len("    },\n")
    out = text[:start] + block(got) + text[end:]
    open(path, "w", encoding="utf-8", newline="").write(out.replace("\n", nl))


def main():
    got = fetch()
    if "--check" in sys.argv:
        from song_media_data import SONG_MEDIA
        want = SONG_MEDIA.get("full", {})
        diff = {l: (want.get(l), got[l]) for l in got if want.get(l) != got[l]}
        if diff:
            for l, (a, b) in diff.items():
                print("differs:", l, "\n  file:", a, "\n  jw.org:", b)
            return 1
        print("OK: SONG_MEDIA['full'] matches jw.org")
        return 0
    if "--write" in sys.argv:
        write(got)
        print("song_media_data.py: SONG_MEDIA['full'] rewritten")
        return 0
    sys.stdout.write(block(got))
    return 0


if __name__ == "__main__":
    sys.exit(main())
