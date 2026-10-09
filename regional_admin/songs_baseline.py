# -*- coding: utf-8 -*-
"""
songs_baseline.json for the regional sites (jeonju / ulsan): what the BUILD shows for every song, in the shape of a song edit, so the
/admin song editor starts from exactly the text and links the public page shows today (before any published edit is applied).

  { "v": 1, "songs": [ { "kind", "key", "number", "titles": {lang: str}, "scripture": {lang: str},
                         "lines": {lang: [str, ...]}, "media": {lang: {"kind", "mediaKey"}} }, ... ] }

Kingdom rows are row-aligned across the 12 languages and carry the Vietnamese corrections of KINGDOM_VI_LYRIC_FIXES (the page applies them
at render time); original / children lines are the flat lines of each language (a section label is a line of its own).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]


def _js_value(path: Path, name: str):
    text = path.read_text(encoding="utf-8")
    m = re.search(r"(?:const|var|let)\s+" + re.escape(name) + r"\s*=\s*", text)
    if not m:
        raise RuntimeError(f"{name} not found in {path}")
    value, _ = json.JSONDecoder().raw_decode(text[m.end():])
    return value


def kingdom_songs():
    songs = _js_value(ROOT / "songs_data.js", "SONGS_DATA")
    fixes = _js_value(ROOT / "song_vocal_segments.js", "KINGDOM_VI_LYRIC_FIXES")
    out = []
    for song in songs:
        number = song["number"]
        rows = []
        for row in song["lines"]:
            vi = (row.get("vi") or "").strip()
            for old, new in fixes.get(str(number), []):
                vi = vi.replace(old, new)
            if vi:   # the page skips a row without Vietnamese
                rows.append(row | {"vi": vi})
        out.append({
            "kind": "kingdom", "key": str(number), "number": number,
            "titles": {lg: (song.get("title") or {}).get(lg, "") for lg in LANGS if (song.get("title") or {}).get(lg)},
            "scripture": {lg: (song.get("scripture") or {}).get(lg, "") for lg in LANGS if (song.get("scripture") or {}).get(lg)},
            "lines": {lg: [(r.get(lg) or "").strip() for r in rows] for lg in LANGS if any((r.get(lg) or "").strip() for r in rows)},
            "media": {},
        })
    return out


def _flat(language):
    if language.get("lines"):
        return list(language["lines"])
    lines = []
    for sec in language.get("sections") or []:
        if sec.get("label"):
            lines.append(sec["label"])
        lines.extend(sec.get("lines") or [])
    return lines


def collection_songs(kind, songs):
    out = []
    for song in songs:
        languages = song.get("languages") or {}
        out.append({
            "kind": kind, "key": song["id"], "number": song["track"],
            "titles": {lg: d.get("title") for lg, d in languages.items() if d.get("available") and d.get("title")},
            "scripture": {},
            "lines": {lg: _flat(d) for lg, d in languages.items() if d.get("available") and _flat(d)},
            "media": song.get("media") or {},
        })
    return out


def build_songs_baseline():
    import build_app
    original = build_app.song_collection("jw_original_songs_ko_vi.json", range(1, 118))
    children = build_app.song_collection("jw_childrens_songs_ko_vi.json", range(0, 36))
    return {"v": 1, "songs": kingdom_songs() + collection_songs("original", original) + collection_songs("children", children)}


def write_songs_baseline(dist_dir: Path):
    data = build_songs_baseline()
    with open(Path(dist_dir) / "songs_baseline.json", "w", encoding="utf-8", newline="\n") as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(",", ":"))
    return len(data["songs"])
