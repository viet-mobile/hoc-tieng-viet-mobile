# -*- coding: utf-8 -*-
"""Short release gate (minutes, not hours) for ordinary UI / content / data / link changes.

    python scripts/release_smoke.py               # build + the short checks below
    python scripts/release_smoke.py --no-build    # reuse the current dist/

It runs: the build (build_app.py + assemble_app.py, all sites), a JS syntax check, and a handful of browser / data checks
that together walk the core navigation of the built sites with fake speech engines and fail on any browser exception or
console error: 왕국 노래 164, the JW.ORG badges of every publication view, the Watchtower read-all (title first), and the
regional admin basics. The full pre-production run (scripts/preprod_verify.py, 1-2 hours) is for high-risk changes only:
DB schema / migrations, authentication / authorization, admin security, SRS storage, a large TTS engine change, the i18n
structure, build / runtime architecture, a mass regeneration of canonical data.

Exit code 0 only when every step passes; the first failure stops the run.
"""
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PY = sys.executable

STEPS = [
    ("build (all sites)", [[PY, "build_app.py", "--site", "all"], [PY, "assemble_app.py", "--site", "all"]]),
    ("JS syntax", [["node", "--check", "app_logic.js"]]),
    ("왕국 노래 164 data", [[PY, "tests/test_kingdom_song_164.py"]]),
    ("JW.ORG badges, publication views, console errors", [["node", "tests/test_jw_org_badges.js"]]),
    ("Original / children's songs: bilingual rows, read-all, OSG 1 audio (jeonju)", [["node", "tests/test_song_bilingual_reading.js", "--sites=jeonju/"]]),
    ("daily course landing: injected Tuesday 2026-10-06 -> week 2026/10/03", [["node", "tests/test_course_ux.js", "--smoke"]]),
    ("Watchtower read-all, title first", [["node", "tests/test_wt_listen_title.js"]]),
    ("regional admin basics", [["node", "tests/test_regional_admin.js"]]),
]


def main():
    steps = STEPS[1:] if "--no-build" in sys.argv else STEPS
    t0 = time.time()
    for i, (name, cmds) in enumerate(steps, 1):
        t = time.time()
        for cmd in cmds:
            res = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
            if res.returncode != 0:
                print("[FAIL] %d. %s: %s (exit %d)" % (i, name, " ".join(cmd), res.returncode))
                print((res.stdout + res.stderr)[-3000:])
                print("--- RELEASE SMOKE FAILED ---")
                return 1
        print("[PASS] %d. %s (%.0f s)" % (i, name, time.time() - t))
    print("--- RELEASE SMOKE PASSED (%d steps, %.0f s) ---" % (len(steps), time.time() - t0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
