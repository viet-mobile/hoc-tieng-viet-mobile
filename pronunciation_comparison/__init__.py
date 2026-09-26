# -*- coding: utf-8 -*-
"""[발음] > [차이]: how Vietnamese pronunciation compares with the learner's own language.

General (non-JW) learning content, shipped to every profile as PRON_COMPARISON. One module per
UI language (vi, cs, zh_cn, zh, en, fr, de, hu, id, ja, ko, pl), each defining:

  UI       = {"intro": str, "common": <"Similarities" label>, "diff": <"Differences" label>}
  SECTIONS = {<compared language>: {"title": str, "common": text, "diff": text}, ...}
             "zh" instead has {"title", "note": text, "subsections": {"nan": {...}, "yue": {...}}}
             (Taiwanese Hokkien and Cantonese -- Traditional characters are not a pronunciation).

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
    return data
