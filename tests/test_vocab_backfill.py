# -*- coding: utf-8 -*-
"""[어휘] > [단어] after the Watchtower / Enjoy Life Forever backfill (run build_app.py first: reads the built data blocks).

Sources and rules (unified_words_builder.build_unified_words):
  - every word of WATCHTOWER_VOCAB (the curated Watchtower study words, 4-language meanings) is a [단어] entry tagged WT;
    one that was not registered is added with the list's own meanings, a registered one keeps its record (only the tag);
  - an entry whose word occurs in the Watchtower study material / in Enjoy Life Forever gets the stored tag WT / 행누;
  - JW sites only: GENERAL's [단어] list is byte-for-byte what it was;
  - nothing else about an existing word changes (meaning, identity); the course's [단어] stream (기본/상용/신권/인명) is
    the same list of words, so the course schedule does not move.
tests/fixtures/unified_words_before_wt_backfill.json is the UNIFIED_WORDS of the three data blocks before the backfill.
Writes a human-readable summary to tests/reports/vocab_backfill_report.txt.
"""
import collections
import hashlib
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
from unified_words_builder import occurrence_index, vocab_key  # noqa: E402
from course_vocab_plan import WORD_TAG_ORDER  # noqa: E402

failures = []
checks = 0


def ok(cond, msg):
    global checks
    checks += 1
    if not cond:
        failures.append(msg)


def const(path, name):
    s = open(os.path.join(ROOT, path), encoding="utf-8").read()
    m = re.search(r"const " + name + r" = ", s)
    return json.JSONDecoder().raw_decode(s[m.end():])[0]


def kr_hash(w):
    return hashlib.sha1(json.dumps(w["kr"], ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:12]


def unit_rows_vi(pub):
    return [r.get("vi") for u in pub.get("units", []) for r in u.get("rows", []) if r.get("vi")]


def main():
    before = json.load(open(os.path.join(ROOT, "tests", "fixtures", "unified_words_before_wt_backfill.json"), encoding="utf-8"))
    report = []

    # ---- GENERAL: unchanged ----
    ug = const("data_block.general.js", "UNIFIED_WORDS")
    now_g = [[vocab_key(w["vi"]), kr_hash(w), w["tags"]] for w in ug]
    ok(now_g == before["general"]["words"], "GENERAL [단어] changed (%d -> %d words)" % (before["general"]["count"], len(ug)))

    for site, path in (("jw", "data_block.js"), ("jeonju", "data_block.jeonju.js")):
        U = const(path, "UNIFIED_WORDS")
        old = before[site]["words"]
        wt_vocab = const(path, "WATCHTOWER_VOCAB")
        wt_curated = {vocab_key(w["vi"]) for wk in wt_vocab for w in wk["words"]}

        # existing entries: same words, same meanings, tags only extended with WT / 행누
        old_by = collections.defaultdict(list)
        for k, h, t in old:
            old_by[(k, h)].append(t)
        now_by = collections.defaultdict(list)
        for w in U:
            now_by[(vocab_key(w["vi"]), kr_hash(w))].append(w)
        lost = [kh for kh in old_by if kh not in now_by]
        ok(not lost, "%s: %d existing words lost or with a changed meaning: %s" % (site, len(lost), lost[:5]))
        bad_tags = 0
        for kh, tag_lists in old_by.items():
            for w in now_by.get(kh, []):
                if not any(set(t) <= set(w["tags"]) and set(w["tags"]) - set(t) <= {"WT", "행누"} for t in tag_lists):
                    bad_tags += 1
        ok(bad_tags == 0, "%s: %d existing words changed tags other than adding WT / 행누" % (site, bad_tags))

        # the existing entries keep their relative order (new words are slotted in, nothing is moved)
        pos = iter(vocab_key(w["vi"]) + "|" + kr_hash(w) for w in U)
        ok(all(any(x == (k + "|" + h) for x in pos) for k, h, _ in old), "%s: the order of the existing words changed" % site)

        # new entries
        old_keys = {k for k, _, _ in old}
        new = [w for w in U if vocab_key(w["vi"]) not in old_keys]
        ok(len(U) == len(old) + len(new), "%s: count" % site)
        ok(all("WT" in w["tags"] for w in new), "%s: every new word is a WT word" % site)
        ok(all(isinstance(w["kr"], dict) and w["kr"].get("ko") for w in new), "%s: every new word has its Korean meaning (no invented one)" % site)
        ok({vocab_key(w["vi"]) for w in new} == wt_curated - old_keys, "%s: the new words are exactly the Watchtower words not registered before" % site)
        # identities: no new duplicate canonical key (the earlier ones are PDF-source senses of the same spelling)
        cnt = collections.Counter(vocab_key(w["vi"]) for w in U)
        dups = sorted(k for k, v in cnt.items() if v > 1)
        ok(dups == before[site]["dupKeys"], "%s: canonical-key duplicates changed (%d -> %d)" % (site, len(before[site]["dupKeys"]), len(dups)))
        ok(all(len(w["tags"]) == len(set(w["tags"])) for w in U), "%s: a tag twice in one entry" % site)

        # WT: every curated word has the tag; the tag is stored exactly where the word occurs
        by_key = collections.defaultdict(list)
        for w in U:
            by_key[vocab_key(w["vi"])].append(w)
        ok(all(any("WT" in w["tags"] for w in by_key[k]) for k in wt_curated), "%s: a curated Watchtower word without WT" % site)
        wt_texts = unit_rows_vi(const(path, "WATCHTOWER_FULL")) + [x for wk in wt_vocab for w in wk["words"] for x in (w["vi"], w.get("example"))]
        elf_texts = unit_rows_vi(const(path, "ENJOY_LIFE_FOREVER"))
        wt_idx, elf_idx = occurrence_index(wt_texts), occurrence_index(elf_texts)
        miss_wt = [k for k in by_key if (k in wt_idx or k in wt_curated) and not any("WT" in w["tags"] for w in by_key[k])]
        extra_wt = [k for k in by_key if k not in wt_idx and k not in wt_curated and any("WT" in w["tags"] for w in by_key[k])]
        miss_elf = [k for k in by_key if k in elf_idx and not any("행누" in w["tags"] for w in by_key[k])]
        extra_elf = [k for k in by_key if k not in elf_idx and any("행누" in w["tags"] for w in by_key[k])]
        ok(not miss_wt and not extra_wt, "%s: WT tag mismatch: missing %s extra %s" % (site, miss_wt[:5], extra_wt[:5]))
        ok(not miss_elf and not extra_elf, "%s: 행누 tag mismatch: missing %s extra %s" % (site, miss_elf[:5], extra_elf[:5]))
        # a word in both sources carries both tags in ONE entry
        both = [k for k in by_key if k in elf_idx and (k in wt_idx or k in wt_curated)]
        ok(both and all(any({"WT", "행누"} <= set(w["tags"]) for w in by_key[k]) for k in both), "%s: WT + 행누 in one entry" % site)

        # the course's [단어] stream: the same words in the same order as before
        def course_keys(words):
            out = []
            for tag in WORD_TAG_ORDER:
                for w in words:
                    tags = w["tags"]
                    if tag in tags and not any(t in tags for t in WORD_TAG_ORDER[:WORD_TAG_ORDER.index(tag)]):
                        out.append(vocab_key(w["vi"]))
            return out
        old_words = [{"vi": k, "tags": t} for k, _, t in old]
        ok(course_keys(U) == course_keys(old_words), "%s: the course's [단어] stream changed" % site)
        if site == "jeonju":   # only the regional course has COURSE_VOCAB
            cv = const(path, "COURSE_VOCAB")
            ok([vocab_key(U[i]["vi"]) for i in cv["words"]] == course_keys(old_words), "%s: COURSE_VOCAB.words changed" % site)

        # source-specific counts for the report
        wt_tagged = sum(1 for w in U if "WT" in w["tags"])
        elf_tagged = sum(1 for w in U if "행누" in w["tags"])
        both_n = sum(1 for w in U if {"WT", "행누"} <= set(w["tags"]))
        report.append("== %s ==" % site)
        report.append("words before %d, after %d (new %d, all Watchtower study words)" % (len(old), len(U), len(new)))
        report.append("Watchtower curated words (unique): %d, of them already registered: %d" % (len(wt_curated), len(wt_curated & old_keys)))
        report.append("entries tagged WT: %d, tagged 행누: %d, both: %d" % (wt_tagged, elf_tagged, both_n))
        newly = collections.Counter()
        old_tag_lookup = {}
        for k, h, t in old:
            old_tag_lookup.setdefault((k, h), set(t))
        for w in U:
            o = old_tag_lookup.get((vocab_key(w["vi"]), kr_hash(w)))
            if o is None:
                continue
            for t in ("WT", "행누"):
                if t in w["tags"] and t not in o:
                    newly[t] += 1
        report.append("existing entries that gained WT: %d, gained 행누: %d" % (newly["WT"], newly["행누"]))
        report.append("canonical-key duplicates: %d (the same as before: PDF-source senses of one spelling)" % len(dups))

    # ---- text-only candidates that stay unregistered (no word-level meaning source: nothing is invented) ----
    cand = json.load(open(os.path.join(ROOT, "jw_extraction", "review", "pending_word_candidates.json"), encoding="utf-8"))
    U = const("data_block.jeonju.js", "UNIFIED_WORDS")
    reg = {vocab_key(w["vi"]) for w in U}
    by_src = collections.Counter()
    open_c = [c for c in cand if vocab_key(c["vi"]) not in reg]
    for c in open_c:
        for st in {o["sourceType"] for o in c.get("occurrences", [])}:
            by_src[st] += 1
    report.append("== unresolved (text candidates of jw_extraction without a meaning source; not registered) ==")
    report.append("extraction candidates: %d, not registered: %d, by source: %s" % (len(cand), len(open_c), dict(by_src)))
    report.append("Enjoy Life Forever / Love People / bilingual reader: no word-level meaning data exists for words found only there:"
                  " none were added (no invented meanings, no 신권 additions, so the course word stream is untouched)")
    os.makedirs(os.path.join(ROOT, "tests", "reports"), exist_ok=True)
    # the list itself, for a human to review: word, sources, occurrences (no meaning is available for any of them)
    lines = ["# jw_extraction word candidates that are not [단어] entries and have no meaning source (not registered)", "vi	sources	occurrences"]
    for c in sorted(open_c, key=lambda c: -len(c.get("occurrences", []))):
        lines.append("%s	%s	%d" % (c["vi"], ",".join(sorted({o["sourceType"] for o in c.get("occurrences", [])})), len(c.get("occurrences", []))))
    open(os.path.join(ROOT, "tests", "reports", "vocab_unresolved_candidates.tsv"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    open(os.path.join(ROOT, "tests", "reports", "vocab_backfill_report.txt"), "w", encoding="utf-8").write("\n".join(report) + "\n")

    print("\n".join(report))
    print("checks run: %d" % checks)
    if failures:
        for f in failures:
            print("  [FAIL] " + f)
        print("--- VOCAB BACKFILL TEST FAILED ---")
        return 1
    print("--- VOCAB BACKFILL TEST PASSED ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
