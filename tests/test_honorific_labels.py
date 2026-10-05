# -*- coding: utf-8 -*-
"""[문법] > [범용 언어 생성표]: the learner-facing Korean labels say 형제 / 자매, not 형제님 / 자매님 (run build_app.py first).

  - canonical source sentence_gen_data.py: the three rows (Anh, Chị, Các anh chị) carry the new Korean text and nothing
    else of the table changed against the committed version (same rows, same order, same languages, same other texts);
  - no generated runtime output of any site (data blocks, assembled app html, dist) holds 자매님 / 형제님 any more;
  - no learner-facing source file of the repository holds them either (tracked sources, tests excluded).
"""
import ast
import glob
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
failures = []
checks = 0


def ok(cond, msg):
    global checks
    checks += 1
    if not cond:
        failures.append(msg)


def load_bank(text):
    tree = ast.parse(text)
    for node in tree.body:
        if isinstance(node, ast.Assign) and getattr(node.targets[0], "id", "") == "SENTENCE_GEN_BANK":
            return ast.literal_eval(node.value)
    raise SystemExit("SENTENCE_GEN_BANK not found")


def main():
    now = load_bank(open(os.path.join(ROOT, "sentence_gen_data.py"), encoding="utf-8").read())
    try:
        old_text = subprocess.check_output(["git", "show", "HEAD:sentence_gen_data.py"], cwd=ROOT).decode("utf-8")
        old = load_bank(old_text)
    except Exception as e:  # no git history (a copy of the folder): the structure check is skipped
        old = None
        print("note: no committed version to compare with (%s)" % type(e).__name__)
    want = {("Anh", "형제/당신(남성)"), ("Chị", "자매/당신(여성)"), ("Các anh chị", "형제자매들")}
    found = {(w["vi"], w["kr"]["ko"]) for rows in now.values() for w in rows}
    ok(want <= found, "the three rows are not in the table with the new text: %s" % (want - found))
    ok(not any("자매님" in w["kr"]["ko"] or "형제님" in w["kr"]["ko"] for rows in now.values() for w in rows), "an honorific is still in the table")
    if old is not None:
        ok(list(old) == list(now), "the columns of the table changed")
        for col in old:
            ok(len(old[col]) == len(now[col]), "%s: row count %d -> %d" % (col, len(old[col]), len(now[col])))
            for a, b in zip(old[col], now[col]):
                ok(a["vi"] == b["vi"] and list(a["kr"]) == list(b["kr"]), "%s / %s: row or language keys changed" % (col, a["vi"]))
                same_other = all(a["kr"][k] == b["kr"][k] for k in a["kr"] if k != "ko")
                ok(same_other, "%s / %s: a language other than Korean changed" % (col, a["vi"]))
                if a["kr"]["ko"] != b["kr"]["ko"]:
                    ok((a["vi"], b["kr"]["ko"]) in want, "%s: an unexpected Korean text change: %r -> %r" % (a["vi"], a["kr"]["ko"], b["kr"]["ko"]))

    # generated output of every site
    targets = glob.glob(os.path.join(ROOT, "data_block*.js")) + glob.glob(os.path.join(ROOT, "app*.html"))
    for base, dirs, files in os.walk(os.path.join(ROOT, "dist")):
        for f in files:
            if f.endswith((".html", ".js", ".json", ".webmanifest")):
                targets.append(os.path.join(base, f))
    ok(len(targets) >= 20, "generated files found: %d (run build_app.py / assemble_app.py first)" % len(targets))
    hits = []
    for t in targets:
        data = open(t, encoding="utf-8", errors="replace").read()
        if "자매님" in data or "형제님" in data:
            hits.append(os.path.relpath(t, ROOT))
    ok(not hits, "자매님 / 형제님 in generated output: %s" % hits[:8])

    # tracked learner-facing sources (the tests that name the old words are not learner-facing)
    files = subprocess.check_output(["git", "ls-files"], cwd=ROOT).decode("utf-8").split("\n")
    src_hits = []
    for f in files:
        if not f or f.startswith(("tests/", "docs/")) or not f.endswith((".py", ".js", ".html", ".json", ".csv", ".txt", ".md")):
            continue
        p = os.path.join(ROOT, f)
        if os.path.isfile(p) and os.path.getsize(p) < 80 * 1024 * 1024:
            data = open(p, encoding="utf-8", errors="replace").read()
            if "자매님" in data or "형제님" in data:
                src_hits.append(f)
    ok(not src_hits, "자매님 / 형제님 in tracked sources: %s" % src_hits[:8])

    print("checks run: %d" % checks)
    if failures:
        for f in failures:
            print("  [FAIL] " + f)
        print("--- HONORIFIC LABELS TEST FAILED ---")
        return 1
    print("--- HONORIFIC LABELS TEST PASSED ---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
