# -*- coding: utf-8 -*-
"""[발음] > [차이]: how Vietnamese pronunciation compares with the learner's own language.

General (non-JW) learning content, shipped to every profile as PRON_COMPARISON. One module per
UI language (vi, cs, zh_cn, zh, en, fr, de, hu, id, ja, ko, pl), each defining:

  UI       = {"intro": str, "common": <"Similarities" label>, "diff": <"Differences" label>}
  SECTIONS = {<compared language>: {"title": str, "common": text, "diff": text}, ...}
             "zh" instead has {"title", "note": text, "subsections": {"nan": {...}, "yue": {...}}}
             (Taiwanese Hokkien and Cantonese -- Traditional characters are not a pronunciation).

  CONSONANTS = {"title", "intro": text, "topics": [{"id", "title", "text": text,
                  "cards": [{"title", "rows": [[<"north"|"south">, label, text], ...]}],   (optional)
                  "examples": [{"word": Vietnamese, "mean", "note": IPA by region}],       (optional)
                  "after": text}]}                                                          (optional)
             Korean <-> Vietnamese consonant systems; shown inside the "ko" section in every UI language.

Text format of every part: one block per line -- "## heading", "- bullet", or a paragraph.
"""
import importlib

UI_LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]
# Section order on the Vietnamese UI (and for the sections after the UI language's own one).
SECTION_ORDER = ["ko", "ja", "zh", "zh_cn", "cs", "de", "en", "fr", "id", "hu", "pl"]


def parse_blocks(text):
    blocks = []
    for line in (text or "").strip().splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("## "):
            blocks.append({"h": line[3:].strip()})
        elif line.startswith("- "):
            if blocks and "ul" in blocks[-1]:
                blocks[-1]["ul"].append(line[2:].strip())
            else:
                blocks.append({"ul": [line[2:].strip()]})
        else:
            blocks.append({"p": line})
    return blocks


def _parse_part(part):
    out = {"title": part["title"]}
    if "note" in part:
        out["note"] = parse_blocks(part["note"])
    if "subsections" in part:
        out["subsections"] = [
            dict(_parse_part(sub), id=sub_id) for sub_id, sub in part["subsections"].items()
        ]
    else:
        out["common"] = parse_blocks(part["common"])
        out["diff"] = parse_blocks(part["diff"])
    return out


def _parse_consonants(cons):
    topics = []
    for topic in cons["topics"]:
        out = {"id": topic["id"], "title": topic["title"], "text": parse_blocks(topic["text"])}
        for key in ("cards", "examples"):
            if topic.get(key):
                out[key] = topic[key]
        if topic.get("after"):
            out["after"] = parse_blocks(topic["after"])
        topics.append(out)
    return {"title": cons["title"], "intro": parse_blocks(cons["intro"]), "topics": topics}


def build_pron_comparison():
    data = {"order": SECTION_ORDER, "langs": {}}
    for lang in UI_LANGS:
        try:
            module = importlib.import_module("pronunciation_comparison." + lang)
        except ModuleNotFoundError:
            continue
        missing = [s for s in SECTION_ORDER if s not in module.SECTIONS]
        assert not missing, (lang, missing)
        data["langs"][lang] = {
            "ui": module.UI,
            "sections": {sid: _parse_part(module.SECTIONS[sid]) for sid in SECTION_ORDER},
        }
        data["langs"][lang]["sections"]["ko"]["consonants"] = _parse_consonants(module.CONSONANTS)
    _check_consonants_parallel(data)
    return data


def _check_consonants_parallel(data):
    """Every UI language has the same consonant topics, cards, rows and example words (only the text differs)."""
    def shape(cons):
        return [(t["id"], [len(c["rows"]) for c in t.get("cards", [])], [[r[0] for r in c["rows"]] for c in t.get("cards", [])],
                 [e["word"] for e in t.get("examples", [])], bool(t.get("after"))) for t in cons["topics"]]
    ref = shape(data["langs"]["ko"]["sections"]["ko"]["consonants"])
    for lang, content in data["langs"].items():
        assert shape(content["sections"]["ko"]["consonants"]) == ref, lang
