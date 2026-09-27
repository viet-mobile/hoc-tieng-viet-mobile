# -*- coding: utf-8 -*-
"""Lists every ELF/LPD/WT sentence of the target-language sites that still has no translation in some UI
language after the Excel pairing and the JW [문장] reference (target_segment.py, target_reference.py).

    python target_gap_report.py            # writes translation_gaps/<site>.csv + translation_gaps/summary.csv

One row per sentence with at least one missing language (UTF-8 with BOM, opens in Excel):
  key                site|unit|paragraph|sentence -- stable id of the sentence record
  source, unit, unit_title, paragraph, sentence, target_sentence
  missing            the UI languages without a translation
  <lang>             the current translation, or empty = to be filled
  <lang>_paragraph   for a missing language: the source row's whole text in that language (context for
                     finding the matching sentence)
Deterministic: the same source and code give the same files.
"""
import csv
import json
from pathlib import Path

import build_app as B
from site_profiles import SITES, UI_LANGS
from target_content import build_target_corpus

OUT = Path(__file__).resolve().parent / "translation_gaps"


def _sources():
    songs_js = open("songs_data.js", encoding="utf-8").read()
    marker = "const SONGS_DATA = "
    songs, _ = json.JSONDecoder().raw_decode(songs_js[songs_js.index(marker) + len(marker):])
    return {"elf": B.enjoy_life_forever_data, "lpd": B.love_people_full_data, "wt": B.watchtower_full_data,
            "songs": songs, "neighbor": B.NEIGHBOR_CONVERSATIONS}


def main():
    OUT.mkdir(exist_ok=True)
    sources = _sources()
    reference = B.jw_sentence_reference()
    summary = []
    for site, meta in SITES.items():
        if meta["engine"] != "target" or not meta["content_sources"]:
            continue
        field = meta["target_language"]
        others = [l for l in UI_LANGS if l != field]
        stats = {}
        corpus = build_target_corpus(site, sources, stats, reference)
        titles = {u["id"]: " · ".join(h.get(field, "") for h in u["head"] if h.get(field))
                  for src in corpus for u in src["units"]}
        header = ["key", "source", "unit", "unit_title", "paragraph", "sentence", "target_sentence", "missing"]
        for l in others:
            header += [l, l + "_paragraph"]
        rows, cells = [], {l: 0 for l in others}
        per_source = {}
        for source_id in ("elf", "lpd", "wt"):
            for para in stats.get(source_id, []):
                if "records" not in para:
                    continue
                for s, rec in enumerate(para["records"]):
                    missing = [l for l in others if l not in rec]
                    if not missing:
                        continue
                    per_source[source_id] = per_source.get(source_id, 0) + 1
                    line = ["%s|%s|%d|%d" % (site, para["unit"], para["p"], s), source_id, para["unit"],
                            titles.get(para["unit"], ""), para["p"] + 1, s + 1, rec[field], " ".join(missing)]
                    for l in others:
                        cells[l] += l in missing
                        line += [rec.get(l, ""), para["row"].get(l, "") if l in missing else ""]
                    rows.append(line)
        with open(OUT / (site + ".csv"), "w", encoding="utf-8-sig", newline="") as f:
            w = csv.writer(f)
            w.writerow(header)
            w.writerows(rows)
        summary.append([site, len(rows), per_source.get("elf", 0), per_source.get("lpd", 0), per_source.get("wt", 0)] +
                       [cells.get(l, "") for l in UI_LANGS])
        print(site, "sentences with a missing language:", len(rows))
    with open(OUT / "summary.csv", "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["site", "sentences_with_gaps", "elf", "lpd", "wt"] + ["missing_" + l for l in UI_LANGS])
        w.writerows(summary)


if __name__ == "__main__":
    main()
