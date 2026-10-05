# -*- coding: utf-8 -*-
"""The 823 Watchtower study words' cs / hu / id / zh_cn meanings (watchtower_vocab_translations.py), after build_app.py.

  - the module is exactly what the frozen translation set produces (freeze verified: SHA-256 of every deliverable), when
    that set is present (tests/reports/watchtower_vocab_translation/);
  - coverage: each of the 823 words has all four meanings, non-empty, in [단어] (UNIFIED_WORDS) and in the Watchtower list
    (WATCHTOWER_VOCAB, which [복습] > [어휘] > [파수대] reads) of the JW sites; GENERAL has neither;
  - nothing else moved: every meaning the source lists already had is unchanged, Korean meanings, Vietnamese text,
    canonical keys, tags and the order of the existing words are what they were; no duplicate tag, no new canonical-key
    duplicate;
  - script sanity per language (no Hangul / kana / CJK in cs / hu / id; zh_cn is Chinese, never the Korean text).
"""
import collections
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
from unified_words_builder import vocab_key  # noqa: E402
from watchtower_vocab_translations import WT_TRANSLATIONS, WT_TRANSLATION_LANGS  # noqa: E402
from watchtower_vocab_translations_fr_de_pl import WT_TRANSLATIONS_FR_DE_PL, WT_TRANSLATION_FR_DE_PL_LANGS  # noqa: E402
import hashlib  # noqa: E402
import watchtower_vocab_data  # noqa: E402

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
    return json.JSONDecoder().raw_decode(s[m.end():])[0] if m else None


def main():
    # ---- the module versus the frozen set ----
    frozen_dir = os.path.join(ROOT, "tests", "reports", "watchtower_vocab_translation")
    if os.path.exists(os.path.join(frozen_dir, "freeze_manifest.json")):
        r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "import_wt_translations.py"), "--check"], capture_output=True, text=True, cwd=ROOT)
        ok(r.returncode == 0, "frozen set / module: " + (r.stdout + r.stderr).strip()[:200])
    ok(len(WT_TRANSLATIONS) == 823, "823 words in the module: %d" % len(WT_TRANSLATIONS))
    cjk = re.compile(r"[぀-ヿ㐀-鿿가-힯]")
    for key, cells in WT_TRANSLATIONS.items():
        ok(set(cells) == set(WT_TRANSLATION_LANGS) and all(cells[l].strip() for l in WT_TRANSLATION_LANGS), "cells of %s" % key)
        ok(not any(cjk.search(cells[l]) for l in ("cs", "hu", "id")), "%s: CJK / Hangul in a Latin-script cell: %s" % (key, cells))
        ok(re.search(r"[一-鿿]", cells["zh_cn"]) and not re.search(r"[぀-ヿ가-힯]", cells["zh_cn"]), "%s: zh_cn is not Chinese: %r" % (key, cells["zh_cn"]))

    before = json.load(open(os.path.join(ROOT, "tests", "fixtures", "unified_words_before_wt_backfill.json"), encoding="utf-8"))
    src_words = {}
    for wk in watchtower_vocab_data.WATCHTOWER_VOCAB:
        for w in wk["words"]:
            src_words.setdefault(vocab_key(w["vi"]), []).append(w)

    for site, path in (("jw", "data_block.js"), ("jeonju", "data_block.jeonju.js")):
        U = const(path, "UNIFIED_WORDS")
        V = const(path, "WATCHTOWER_VOCAB")
        old_keys = {k for k, _, _ in before[site]["words"]}
        by_key = collections.defaultdict(list)
        for w in U:
            by_key[vocab_key(w["vi"])].append(w)
        v_by_key = collections.defaultdict(list)
        for wk in V:
            for w in wk["words"]:
                v_by_key[vocab_key(w["vi"])].append(w)
        langs_ok = collections.Counter()
        for key, cells in WT_TRANSLATIONS.items():
            ok(key not in old_keys, "%s: %s is a word that was already registered" % (site, key))
            recs = by_key.get(key, [])
            ok(len(recs) == 1, "%s: %s has %d entries in [단어]" % (site, key, len(recs)))
            if recs:
                for l in WT_TRANSLATION_LANGS:
                    if recs[0]["kr"].get(l) == cells[l]:
                        langs_ok[l] += 1
                    else:
                        failures.append("%s: [단어] %s %s = %r expected %r" % (site, key, l, recs[0]["kr"].get(l), cells[l]))
                ok(recs[0]["kr"].get("ko") == src_words[key][0]["mean"]["ko"], "%s: %s Korean meaning changed" % (site, key))
                ok(recs[0]["tags"] in (["WT"], ["WT", "행누"]), "%s: %s tags %s" % (site, key, recs[0]["tags"]))
            for w in v_by_key.get(key, []):
                for l in WT_TRANSLATION_LANGS:
                    ok(w["mean"].get(l) == cells[l], "%s: Watchtower list %s %s" % (site, key, l))
        ok(all(langs_ok[l] == 823 for l in WT_TRANSLATION_LANGS), "%s: [단어] coverage per language %s" % (site, dict(langs_ok)))

        # the source lists' own meanings are untouched (the built list = the source list + only the four languages)
        changed = 0
        for wk_built, wk_src in zip(V, watchtower_vocab_data.WATCHTOWER_VOCAB):
            for wb, ws in zip(wk_built["words"], wk_src["words"]):
                if wb["vi"] != ws["vi"] or any(wb["mean"].get(l) != v for l, v in ws["mean"].items()):
                    changed += 1
        ok(changed == 0, "%s: %d Watchtower words whose own text / meanings changed" % (site, changed))
        # identities, tags, order of everything that existed before
        old = before[site]["words"]
        pos = iter(vocab_key(w["vi"]) + "|" + __import__("hashlib").sha1(json.dumps(w["kr"], ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:12] for w in U)
        old_pairs = [k + "|" + h for k, h, _ in old]
        ok(all(any(x == p for x in pos) for p in old_pairs), "%s: existing words moved or changed" % site)
        ok(all(len(w["tags"]) == len(set(w["tags"])) for w in U), "%s: a duplicate tag" % site)
        cnt = collections.Counter(vocab_key(w["vi"]) for w in U)
        ok(sorted(k for k, v in cnt.items() if v > 1) == before[site]["dupKeys"], "%s: canonical-key duplicates changed" % site)
        ok(len(U) == before[site]["count"] + 824, "%s: %d words (expected %d)" % (site, len(U), before[site]["count"] + 824))

    # ---- fr / de / pl (second frozen set): the target words are whatever the set holds, no fixed count ----
    frozen2 = os.path.join(ROOT, "tests", "reports", "watchtower_vocab_translation_fr_de_pl")
    if os.path.exists(os.path.join(frozen2, "freeze_manifest.json")):
        r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "import_wt_translations_fr_de_pl.py"), "--check"], capture_output=True, text=True, cwd=ROOT)
        ok(r.returncode == 0, "fr/de/pl frozen set / module: " + (r.stdout + r.stderr).strip()[:200])
    cjk2 = re.compile(r"[぀-ヿ㐀-鿿가-힯]")
    for key, cells in WT_TRANSLATIONS_FR_DE_PL.items():
        ok(set(cells) == set(WT_TRANSLATION_FR_DE_PL_LANGS) and all(cells[l].strip() for l in cells), "fr/de/pl cells of %s" % key)
        ok(not any(cjk2.search(cells[l]) or "<" in cells[l] for l in cells), "%s: CJK / Hangul / markup in a fr/de/pl cell: %s" % (key, cells))
    for site, path in (("jw", "data_block.js"), ("jeonju", "data_block.jeonju.js")):
        U = const(path, "UNIFIED_WORDS")
        V = const(path, "WATCHTOWER_VOCAB")
        old = {k: h for k, h, _ in before[site]["words"]}
        old_keys = set(old)
        curated = {vocab_key(w["vi"]) for wk in watchtower_vocab_data.WATCHTOWER_VOCAB for w in wk["words"]}
        new_keys = curated - old_keys
        keys2 = set(WT_TRANSLATIONS_FR_DE_PL)
        ok(new_keys <= keys2, "%s: %d new Watchtower words without fr/de/pl" % (site, len(new_keys - keys2)))
        ok((keys2 - new_keys) <= (curated & old_keys), "%s: fr/de/pl for words that are not Watchtower words" % site)
        by_key = collections.defaultdict(list)
        for w in U:
            by_key[vocab_key(w["vi"])].append(w)
        cover = collections.Counter()
        for key in new_keys:
            rec = by_key[key][0]
            for l in WT_TRANSLATION_FR_DE_PL_LANGS:
                if rec["kr"].get(l) == WT_TRANSLATIONS_FR_DE_PL[key][l]:
                    cover[l] += 1
                else:
                    failures.append("%s: [단어] %s %s = %r expected %r" % (site, key, l, rec["kr"].get(l), WT_TRANSLATIONS_FR_DE_PL[key][l]))
            # the four languages of the first set and Korean are still what they were
            for l in WT_TRANSLATION_LANGS:
                if key in WT_TRANSLATIONS:
                    ok(rec["kr"].get(l) == WT_TRANSLATIONS[key][l], "%s: %s %s changed by the fr/de/pl merge" % (site, key, l))
        ok(all(cover[l] == len(new_keys) for l in WT_TRANSLATION_FR_DE_PL_LANGS), "%s: [단어] fr/de/pl coverage of the %d new words: %s" % (site, len(new_keys), dict(cover)))
        # words that were already registered: their [단어] records are exactly what they were (only the Watchtower list gains meanings)
        reg = keys2 & old_keys
        now_h = {vocab_key(w["vi"]): hashlib.sha1(json.dumps(w["kr"], ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:12] for w in U}
        ok(all(now_h.get(k) in {h for kk, h, _ in before[site]["words"] if kk == k} for k in reg), "%s: a registered word's [단어] meanings changed by the fr/de/pl merge" % site)
        # the Watchtower list: every target word of it has all three; every earlier meaning is untouched
        v_by = collections.defaultdict(list)
        for wk in V:
            for w in wk["words"]:
                v_by[vocab_key(w["vi"])].append(w)
        for key, cells in WT_TRANSLATIONS_FR_DE_PL.items():
            for w in v_by.get(key, []):
                for l in WT_TRANSLATION_FR_DE_PL_LANGS:
                    ok(w["mean"].get(l) == cells[l], "%s: Watchtower list %s %s" % (site, key, l))

    ug = const("data_block.general.js", "UNIFIED_WORDS")
    ok(len(ug) == before["general"]["count"] and not any(vocab_key(w["vi"]) in WT_TRANSLATIONS for w in ug if "WT" in w["tags"]), "GENERAL [단어] unchanged")
    ok((const("data_block.general.js", "WATCHTOWER_VOCAB") or []) == [], "GENERAL has no Watchtower list")

    print("checks run: %d" % checks)
    if failures:
        for f in failures[:40]:
            print("  [FAIL] " + f)
        print("--- WT TRANSLATIONS TEST FAILED (%d) ---" % len(failures))
        return 1
    print("--- WT TRANSLATIONS TEST PASSED ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
