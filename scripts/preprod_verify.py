# -*- coding: utf-8 -*-
"""Pre-production verification: build every site, then run the checks in a fixed order (docs/pre_production_checklist.md).

    python scripts/preprod_verify.py                       # everything (step 5 needs the network)
    python scripts/preprod_verify.py --devices-verified    # only after the real-device TTS smoke test is done

Read-only towards production: nothing is committed, pushed, deployed, and no remote D1 is touched. One test at a time,
no per-test timeout (a slow machine shows up as a long duration, not as a failure). Each step's output goes to a log
file in the system temp folder; the summary lists the result and duration of every step.

The last line is READY FOR PRODUCTION only when every step passed AND --devices-verified was given; otherwise
READY FOR PRODUCTION — DEVICE SMOKE TEST PENDING (all passed) or NOT READY (a step failed).
"""
import argparse
import glob
import os
import subprocess
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ORDERED = [
    ("1. build all sites", [["python", "build_app.py", "--site", "all"], ["python", "assemble_app.py", "--site", "all"]]),
    ("2. TTS behaviour", [["node", "tests/test_tts_behavior.js"]]),
    ("3. spaced repetition (SRS)", [["node", "tests/test_srs.js"]]),
    ("4. song tabs (164 / 117 / 36)", [["node", "tests/test_song_tabs.js"]]),
    ("5. song links on jw.org (network)", [["python", "tests/check_song_links.py"], ["python", "tests/check_song_links.py", "--kingdom", "all"]]),
    ("6. regional admin", [["node", "tests/test_regional_admin.js"]]),
    ("7. regional E2E (browser)", [["node", "tests/test_regional_e2e.js"]]),
    ("8. SECTION F: anonymous exposure + viewer authorization", [["node", "tests/test_section_f_viewer.js"]]),
]


def remaining_tests():
    done = {c[1] for _, cmds in ORDERED for c in cmds if len(c) > 1 and c[1].startswith("tests/")}
    files = sorted(glob.glob(os.path.join(ROOT, "tests", "test_*.js")) + glob.glob(os.path.join(ROOT, "tests", "test_*.py")))
    out = []
    for f in files:
        rel = "tests/" + os.path.basename(f)
        if rel not in done:
            out.append(("9. " + os.path.basename(f), [["node" if f.endswith(".js") else "python", rel]]))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--devices-verified", action="store_true", help="the real-device TTS smoke test has been done")
    args = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    logdir = tempfile.mkdtemp(prefix="preprod_verify_")
    env = dict(os.environ, PYTHONPATH=ROOT + os.pathsep + os.environ.get("PYTHONPATH", ""))
    results = []
    for name, cmds in ORDERED + remaining_tests():
        log = os.path.join(logdir, name.split(" ", 1)[1].replace("/", "_").replace(" ", "_")[:60] + ".log")
        t0 = time.time()
        ok = True
        with open(log, "w", encoding="utf-8", errors="replace") as fh:
            for cmd in cmds:
                fh.write("$ " + " ".join(cmd) + "\n")
                fh.flush()
                rc = subprocess.call(cmd, cwd=ROOT, env=env, stdout=fh, stderr=subprocess.STDOUT)
                if rc != 0:
                    fh.write("exit code %d\n" % rc)
                    ok = False
                    break
        secs = time.time() - t0
        results.append((name, ok, secs, log))
        print("%-4s %-58s %6.0fs" % ("OK" if ok else "FAIL", name, secs), flush=True)
        if not ok and name.startswith("1."):
            break  # nothing else is meaningful without a build
    print("logs:", logdir)
    failed = [r for r in results if not r[1]]
    for name, _, _, log in failed:
        print("  failed:", name, "->", log)
    if failed:
        print("NOT READY")
        return 1
    print("READY FOR PRODUCTION" if args.devices_verified else "READY FOR PRODUCTION — DEVICE SMOKE TEST PENDING")
    return 0


if __name__ == "__main__":
    sys.exit(main())
