# -*- coding: utf-8 -*-
"""Imports the official lyrics of [노래] > [오리지널 송] / [여호와의 친구가 되세요] in the other UI languages from jw.org.

    python scripts/import_song_languages.py                  # all songs, all languages, writes jw_songs_i18n.json
    python scripts/import_song_languages.py --langs en ja --limit 5 --out /tmp/x.json
    python scripts/import_song_languages.py --selftest       # re-reads vi / ko with this parser and compares with the
                                                              # canonical jw_*_songs_ko_vi.json (the parser's own check)

Source: the finder page of each song (https://www.jw.org/finder?wtlocale=<JW code>&lank=<pub-osg_N_VIDEO | pub-pkon_N_VIDEO>,
the lank is read from the canonical file), i.e. the official lyrics page of that language. Only what that page prints is
imported (title; verses, "(CHORUS)"-like labels and their lines as printed); a song that jw.org does not publish in a
language (the finder lands on the jw.org home page, or the page has no lyrics) is recorded as available=false. Nothing is
translated or generated. vi and ko stay as the canonical *_ko_vi.json files give them (never re-written here).

Output (jw_songs_i18n.json): {"schemaVersion": 1, "fetched": <date>, "songs": {<song id>: {<lang>: {"available": bool,
"title", "sections": [{"kind": "verse"|"chorus"|"bridge"|..., "label": "(CHORUS)" or "", "lines": [...]}], "media":
{"kind": "VIDEO"|"AUDIO", "mediaKey": "pub-osg_N_VIDEO"}}}}}. The kind of a section is the class jw.org gives its block, so
the same in every language (the page aligns the languages by it).
"""
import argparse
import concurrent.futures
import datetime
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
# the JW code of each UI language: the table of app_logic.js songJwLocale (read from it, never typed twice)
LANGS = ["cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "pl"]


def jw_codes():
    js = open(os.path.join(ROOT, "app_logic.js"), encoding="utf-8").read()
    body = js[js.index("function songJwLocale(lang)"):]
    body = body[:body.index("}[lang]")]
    return {m.group(1): m.group(2) for m in re.finditer(r'(\w+):\s*\["(\w+)",', body)}


class LyricsParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_ol = False
        self.ol_depth = 0
        self.sect = []
        self.div_seq = 0
        self.div_ids = []
        self.cur = None
        self.items = []
        self.title = ""
        self.in_h1 = False
        self.in_bullet = False
        self.in_strong = False
        self.skip = 0
        self.done = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = (a.get("class") or "").split()
        if tag == "h1":
            self.in_h1 = True
        if tag == "ol" and "source" in cls and not self.in_ol and not self.done:
            self.in_ol, self.ol_depth = True, 1
            return
        if not self.in_ol:
            return
        if tag == "ol":
            self.ol_depth += 1
        elif tag == "div":
            self.sect.append(cls[0] if cls else "")
            self.div_seq += 1
            self.div_ids.append(self.div_seq)
        elif tag == "p":
            self.cur = {"text": "", "bullet": "", "strong": "", "sect": [s for s in self.sect if s], "div": self.div_ids[-1] if self.div_ids else 0}
        elif tag == "span" and "txtSrcBullet" in cls:
            self.in_bullet = True
        elif tag == "strong":
            self.in_strong = True
        elif tag == "br" and self.cur is not None:
            self.cur["text"] += " "
        elif tag in ("rt", "rp"):          # furigana: the base text only
            self.skip += 1

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_h1 = False
        if not self.in_ol:
            return
        if tag == "ol":
            self.ol_depth -= 1
            if self.ol_depth == 0:
                self.in_ol, self.done = False, True
        elif tag == "div" and self.sect:
            self.sect.pop()
            self.div_ids.pop()
        elif tag == "span":
            self.in_bullet = False
        elif tag == "strong":
            self.in_strong = False
        elif tag in ("rt", "rp") and self.skip:
            self.skip -= 1
        elif tag == "p" and self.cur is not None:
            self.items.append(self.cur)
            self.cur = None

    def handle_data(self, data):
        if self.in_h1 and not self.title:
            self.title = data.strip()
        if self.in_ol and self.cur is not None and not self.skip:
            if self.in_bullet:
                self.cur["bullet"] += data
            else:
                self.cur["text"] += data
                if self.in_strong:
                    self.cur["strong"] += data


def parse_page(html):
    p = LyricsParser()
    p.feed(html)
    sections, cur, last_key = [], None, None
    for it in p.items:
        text = re.sub(r"[ \t\r\n]+", " ", it["text"]).strip()
        bullet = it["bullet"].strip()
        kind = it["sect"][-1] if it["sect"] else "verse"
        key = it["div"]      # one block of the page = one section (a bridge is a block of the same class as a chorus)
        if bullet or cur is None or key != last_key:
            cur = {"kind": kind, "label": "", "lines": []}
            sections.append(cur)
            last_key = key
        if kind != "verse" and not cur["lines"] and not cur["label"] and it["strong"] and re.sub(r"\s+", " ", it["strong"]).strip() == text:
            cur["label"] = text           # "(CHORUS)": a label, not a lyric line
            continue
        if not text:
            continue
        cur["lines"].append((bullet + " " + text) if bullet else text)
    sections = [s for s in sections if s["lines"] or s["label"]]
    return p.title, sections


CACHE = None


def fetch(url):
    if CACHE:
        import hashlib
        path = os.path.join(CACHE, hashlib.md5(url.encode()).hexdigest())
        if os.path.exists(path):
            raw = open(path, encoding="utf-8").read()
            final, _, body = raw.partition("\n")
            return final, body
        final, body = _fetch(url)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(final + "\n" + body)
        return final, body
    return _fetch(url)


def _fetch(url):
    last = None
    for attempt in range(8):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            r = urllib.request.urlopen(req, timeout=45)
            return r.geturl(), r.read().decode("utf-8", "replace")
        except Exception as e:
            last = e
            code = getattr(e, "code", 0)
            if code == 404:        # an answer: not published
                return url, ""
            # 403 / 429: jw.org's rate limit after many pages -- wait it out; timeouts / 5xx: a shorter wait
            time.sleep(60 * (attempt + 1) if code in (403, 429) else 2 + attempt * 3)
    raise last


def finder(code, lank):
    return "https://www.jw.org/finder?wtlocale=%s&lank=%s" % (code, lank)


def is_home(url):
    path = urllib.parse.urlparse(url).path.strip("/")
    return len(path.split("/")) <= 1


def import_one(code, lanks):
    """-> {"available", "title", "sections", "media"} for the first lank whose page has lyrics."""
    for lank in lanks:
        final, html = fetch(finder(code, lank))
        if not html or is_home(final):
            continue
        title, sections = parse_page(html)
        if sum(len(s["lines"]) for s in sections) >= 3:
            kind = "AUDIO" if lank.endswith("_AUDIO") else "VIDEO"
            return {"available": True, "title": title, "sections": sections, "media": {"kind": kind, "mediaKey": lank}}
    return {"available": False}


def song_lanks(song):
    """The media key of a song: the lank of its canonical jw.org link; the video first, then the audio of the same track.
    A song whose official media is fixed (song_tab_links.SONG_MEDIA_KEYS: OSG 1 is an AUDIO) uses exactly that key."""
    sys.path.insert(0, ROOT)
    from song_tab_links import SONG_MEDIA_KEYS
    if song["id"] in SONG_MEDIA_KEYS:
        return [SONG_MEDIA_KEYS[song["id"]]["mediaKey"]]
    for l in ("ko", "vi"):
        m = re.search(r"lank=(pub-[a-z]+_\d+)_(?:VIDEO|AUDIO)", (song.get(l) or {}).get("jwOrgUrl") or "")
        if m:
            return [m.group(1) + "_VIDEO", m.group(1) + "_AUDIO"]
    m = re.match(r"(osg|pkon)-(\d+)$", song["id"])
    return ["pub-%s_%s_VIDEO" % (m.group(1), m.group(2)), "pub-%s_%s_AUDIO" % (m.group(1), m.group(2))] if m else []


def load_songs():
    out = []
    for f in ("jw_original_songs_ko_vi.json", "jw_childrens_songs_ko_vi.json"):
        out += json.load(open(os.path.join(ROOT, f), encoding="utf-8"))["songs"]
    return out


def selftest(codes):
    """vi / ko read with this parser == the canonical file's lines (verse numbers aside)."""
    songs = {s["id"]: s for s in load_songs()}
    bad = checked = 0
    for sid in ("osg-116", "osg-40", "osg-80", "pkon-17", "pkon-35"):
        for l in ("ko", "vi"):
            r = import_one(codes[l], song_lanks(songs[sid]))
            canon = [x for x in (songs[sid][l].get("lines") or [])]
            if not r["available"] or not canon:
                print("skip", sid, l, r["available"], len(canon))
                continue
            norm = lambda L: [re.sub(r"^\d+\s*[.)]\s*", "", x).strip() for x in L if x.strip()]
            got = []
            for s in r["sections"]:
                got += ([s["label"]] if s["label"] else []) + s["lines"]
            checked += 1
            same = norm(got) == norm(canon)
            if not same:
                bad += 1
                a, b = norm(got), norm(canon)
                print("DIFF", sid, l, len(a), len(b), [x for x in a if x not in b][:3], [x for x in b if x not in a][:3])
            else:
                print("same", sid, l, len(got))
    print("selftest: %d checked, %d different" % (checked, bad))
    return 1 if bad or not checked else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--langs", nargs="*", default=LANGS)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--out", default=os.path.join(ROOT, "jw_songs_i18n.json"))
    ap.add_argument("--workers", type=int, default=5)
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--cache", default="")
    ap.add_argument("--only", nargs="*", default=[], help="song ids: re-import just these into the existing --out file")
    args = ap.parse_args()
    global CACHE
    if args.cache:
        os.makedirs(args.cache, exist_ok=True)
        CACHE = args.cache
    codes = jw_codes()
    if args.selftest:
        return selftest(codes)
    songs = load_songs()
    if args.limit:
        songs = songs[:args.limit]
    prior = {}
    if args.only:
        songs = [x for x in songs if x["id"] in args.only]
        prior = json.load(open(args.out, encoding="utf-8"))["songs"]
    jobs = [(s["id"], l, codes[l], song_lanks(s)) for s in songs for l in args.langs]
    result = {sid: dict(v) for sid, v in prior.items()}
    t0 = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futs = {ex.submit(import_one, code, lanks): (sid, l) for sid, l, code, lanks in jobs}
        for n, fut in enumerate(concurrent.futures.as_completed(futs), 1):
            sid, l = futs[fut]
            result.setdefault(sid, {})[l] = fut.result()
            if n % 50 == 0:
                print("%d/%d (%.0f s)" % (n, len(jobs), time.time() - t0), flush=True)
    doc = {"schemaVersion": 1, "fetched": datetime.date.today().isoformat(),
           "source": "jw.org finder pages (https://www.jw.org/finder?wtlocale=<JW code>&lank=<media key>)",
           "songs": {sid: {l: result[sid][l] for l in sorted(result[sid])} for sid in sorted(result)}}
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1)
    avail = {l: sum(1 for sid in result if result[sid].get(l, {}).get("available")) for l in args.langs}
    print("available per language:", avail, "of", len(songs))
    return 0


if __name__ == "__main__":
    sys.exit(main())
