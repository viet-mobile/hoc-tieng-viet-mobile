# -*- coding: utf-8 -*-
"""Report of the sentence translations recovered by target_recover.py for the JW target-language sites.

    python target_recover_report.py        # writes translation_gaps_recovered/ (translation_gaps/ is not touched)

  summary_before.csv / summary_after.csv   empty cells per site x source x language, without / with recovery
  recovery_audit.csv                       every recovered cell: key, site, source, target sentence, language,
                                           recovered translation, rule, context (the source row's text in that
                                           language)
  <site>_recovered.csv                     the same, one file per site
  conflicts.csv                            paragraphs whose anchors contradict each other (left empty)
  <site>_remaining.csv                     sentences still missing a language (same columns as translation_gaps/)
Deterministic: the same source and code give the same files.
"""
import csv
from pathlib import Path

import build_app as B
from site_profiles import SITES, UI_LANGS
from target_content import build_target_corpus
from target_gap_report import _sources
from target_recover import CODES

OUT = Path(__file__).resolve().parent / "translation_gaps_recovered"
SOURCES = ("elf", "lpd", "wt")


def _write(name, header, rows):
    with open(OUT / name, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


def _missing(corpus, field):
    counts = {}
    for src in corpus:
        if src["id"] not in SOURCES:
            continue
        for unit in src["units"]:
            for rec in unit["rows"]:
                for lang in UI_LANGS:
                    if lang != field and lang not in rec:
                        counts[(src["id"], lang)] = counts.get((src["id"], lang), 0) + 1
    return counts


def main():
    OUT.mkdir(exist_ok=True)
    sources = _sources()
    reference = B.jw_sentence_reference()
    before_rows, after_rows, audit_all, conflicts_all = [], [], [], []
    header_counts = ["site", "source", "total"] + ["missing_" + l for l in UI_LANGS]
    for site, meta in SITES.items():
        if meta["engine"] != "target" or not meta["content_sources"]:
            continue
        field = meta["target_language"]
        others = [l for l in UI_LANGS if l != field]
        before = _missing(build_target_corpus(site, sources, None, reference, recover=False), field)
        stats = {}
        corpus = build_target_corpus(site, sources, stats, reference)
        after = _missing(corpus, field)
        for rows, counts in ((before_rows, before), (after_rows, after)):
            for sid in SOURCES:
                cells = [counts.get((sid, l), 0) if l != field else "" for l in UI_LANGS]
                rows.append([site, sid, sum(c for c in cells if c != "")] + cells)
        titles = {u["id"]: " · ".join(h.get(field, "") for h in u["head"] if h.get(field))
                  for src in corpus for u in src["units"]}
        audit, remaining = [], []
        for sid in SOURCES:
            for para in stats.get(sid, []):
                if "records" not in para:
                    continue
                for i, lang, code, text in para["recovered"]:
                    key = "%s|%s|%d|%d" % (site, para["unit"], para["p"], i)
                    audit.append([key, site, sid, para["records"][i][field], lang, text, CODES[code],
                                  "same row, %s paragraph: %s" % (lang, para["row"].get(lang, ""))])
                for lang, anchors in para["recover_conflicts"]:
                    for i, text, code in anchors:
                        conflicts_all.append(["%s|%s|%d|%d" % (site, para["unit"], para["p"], i), site, sid,
                                              para["records"][i][field], lang,
                                              "ANCHOR_ORDER: anchors cross, paragraph left empty",
                                              "%s -> %s" % (CODES[code], text)])
        audit.sort(key=lambda r: (r[0], r[4]))
        header = ["key", "site", "source", "target_sentence", "language", "recovered_translation", "rule", "context"]
        _write(site + "_recovered.csv", header, audit)
        audit_all += audit
        # Remaining gaps, in the translation_gaps/ layout.
        gap_header = ["key", "source", "unit", "unit_title", "paragraph", "sentence", "target_sentence", "missing"]
        for l in others:
            gap_header += [l, l + "_paragraph"]
        for sid in SOURCES:
            for para in stats.get(sid, []):
                if "records" not in para:
                    continue
                for s, rec in enumerate(para["records"]):
                    missing = [l for l in others if l not in rec]
                    if not missing:
                        continue
                    line = ["%s|%s|%d|%d" % (site, para["unit"], para["p"], s), sid, para["unit"],
                            titles.get(para["unit"], ""), para["p"] + 1, s + 1, rec[field], " ".join(missing)]
                    for l in others:
                        line += [rec.get(l, ""), para["row"].get(l, "") if l in missing else ""]
                    remaining.append(line)
        _write(site + "_remaining.csv", gap_header, remaining)
        print(site, "recovered:", len(audit), "remaining sentences with a gap:", len(remaining))
    _write("summary_before.csv", header_counts, before_rows)
    _write("summary_after.csv", header_counts, after_rows)
    _write("recovery_audit.csv", ["key", "site", "source", "target_sentence", "language", "recovered_translation",
                                  "rule", "context"], audit_all)
    _write("conflicts.csv", ["key", "site", "source", "target_sentence", "language", "type", "candidates"],
           conflicts_all)


if __name__ == "__main__":
    main()
