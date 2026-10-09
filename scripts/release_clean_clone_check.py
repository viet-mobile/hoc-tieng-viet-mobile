# -*- coding: utf-8 -*-
"""Release gate (seconds to a few minutes, no browser): the production build must not depend on anything outside git.

    python3 scripts/release_clean_clone_check.py            # profiles jeonju, jw, general
    python3 scripts/release_clean_clone_check.py jeonju     # one profile
    python3 scripts/release_clean_clone_check.py --self-test

1. Clean checkout: `git archive HEAD` into a temp directory (tracked files of the committed HEAD ONLY -- the working tree's untracked and
   modified files are not copied), then the Cloudflare build command of each profile runs there:
       python build_app.py --profile <p> && python assemble_app.py --profile <p>       (DEPLOYMENT.md)
   A build that needs a file only present in the working tree fails here, exactly as it did on Cloudflare.
2. Dependency tracking: the same build runs once in the working tree with an audit hook on open(); every repo file it READS (not the
   outputs it writes first) must be in `git ls-files`. An untracked source/build dependency is named:
       ERROR: build dependency is not tracked: scripts/data/...json
   Caches, review documents and scratch files that the build never reads are NOT checked and never block a release.
Note: step 2 runs the build in the working tree, so dist/ ends up as the LAST profile's artifact (general): run
`python3 build_app.py --site all && python3 assemble_app.py --site all` again before browser tests.
Exit code 0 only if every check passes. Run it BEFORE the commit is pushed (after `git add`/commit, from the repository root).
"""
import os, runpy, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILES = ("jeonju", "jw", "general")


def sh(cmd, cwd, timeout=900):
    return subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), capture_output=True, text=True, timeout=timeout)


def clean_checkout(repo, dest):
    """Tracked files of HEAD only."""
    arch = subprocess.run(["git", "archive", "HEAD"], cwd=repo, capture_output=True, check=True).stdout
    subprocess.run(["tar", "-x", "-C", dest], input=arch, check=True)


def build_commands(profile):
    return [[sys.executable, "build_app.py", "--profile", profile], [sys.executable, "assemble_app.py", "--profile", profile]]


def clean_build(repo, profile, builds=build_commands):
    """Returns '' when the clean checkout builds, else the error text."""
    tmp = tempfile.mkdtemp(prefix="clean-clone-")
    try:
        clean_checkout(repo, tmp)
        for cmd in builds(profile):
            r = sh(cmd, tmp)
            if r.returncode:
                return "clean checkout: `%s` failed (exit %d)\n%s" % (" ".join(os.path.basename(c) if i == 0 else c for i, c in enumerate(cmd)), r.returncode, (r.stderr or r.stdout).strip()[-900:])
        return ""
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def tracked_files(repo):
    out = subprocess.run(["git", "ls-files", "-z"], cwd=repo, capture_output=True, text=True, check=True).stdout
    return set(p for p in out.split("\0") if p)


def untracked_reads(reads, tracked, root):
    """reads: absolute paths the build read. Returns the repo-relative paths that are not tracked."""
    bad = []
    for path in sorted(reads):
        rel = os.path.relpath(path, root)
        if rel.startswith("..") or rel.split(os.sep)[0] in (".git", "__pycache__") or rel.endswith(".pyc"):
            continue
        if rel.replace(os.sep, "/") not in tracked:
            bad.append(rel.replace(os.sep, "/"))
    return bad


def traced_reads(repo, profile, builds=build_commands):
    """Runs the build of one profile inside this process (working tree) and returns the files it read but did not write."""
    reads, writes = set(), set()

    def hook(event, args):
        if event == "open" and isinstance(args[0], str):
            mode = args[1] if isinstance(args[1], str) else "r"
            p = os.path.realpath(args[0] if os.path.isabs(args[0]) else os.path.join(os.getcwd(), args[0]))
            if not p.startswith(repo + os.sep): return
            if any(c in (mode or "r") for c in "wax+"): writes.add(p)
            elif os.path.isfile(p): reads.add(p)

    old_cwd, old_argv, old_path = os.getcwd(), list(sys.argv), list(sys.path)
    os.chdir(repo); sys.path.insert(0, repo)
    sys.addaudithook(hook)
    try:
        for cmd in builds(profile):
            sys.argv = [cmd[1]] + cmd[2:]
            try: runpy.run_path(os.path.join(repo, cmd[1]), run_name="__main__")
            except SystemExit as e:
                if e.code not in (0, None): raise RuntimeError("working-tree build exited with %r" % (e.code,))
    finally:
        os.chdir(old_cwd); sys.argv = old_argv; sys.path[:] = old_path
        for name in [m for m, mod in list(sys.modules.items()) if getattr(mod, "__file__", None) and os.path.abspath(mod.__file__).startswith(repo + os.sep)]:
            sys.modules.pop(name, None)   # the next profile imports the data modules afresh
    return reads - writes


def run(repo, profiles, builds=build_commands):
    repo = os.path.realpath(repo)
    errors = []
    for p in profiles:
        e = clean_build(repo, p, builds)
        print("[%s] clean checkout build: %s" % (p, "OK" if not e else "FAILED"))
        if e: errors.append("[%s] %s" % (p, e))
    tracked = tracked_files(repo)
    seen = set()
    for p in profiles:
        try: reads = traced_reads(repo, p, builds)
        except Exception as ex: errors.append("[%s] working-tree build could not be traced: %s" % (p, ex)); continue
        bad = [b for b in untracked_reads(reads, tracked, repo) if b not in seen]; seen.update(bad)
        print("[%s] build read %d repo files, untracked: %d" % (p, len(reads), len(bad)))
        for b in bad: errors.append("ERROR: build dependency is not tracked: %s" % b)
    return errors


def self_test():
    """A fixture repository whose build reads an untracked file passes in the working tree and must FAIL here."""
    repo = tempfile.mkdtemp(prefix="gate-selftest-")
    try:
        def w(name, text):
            os.makedirs(os.path.dirname(os.path.join(repo, name)) or repo, exist_ok=True)
            open(os.path.join(repo, name), "w").write(text)
        w("build_app.py", "import json\nd = json.load(open('data/tracked.json')); e = json.load(open('data/needed_but_untracked.json'))\nopen('out.txt','w').write(str(d) + str(e))\n")
        w("assemble_app.py", "print(open('out.txt').read())\n")
        w("data/tracked.json", "{}"); w("data/needed_but_untracked.json", "{}"); w("docs/scratch_cache.json", "{}")
        for c in (["git", "init", "-q"], ["git", "config", "user.email", "t@t"], ["git", "config", "user.name", "t"], ["git", "add", "build_app.py", "assemble_app.py", "data/tracked.json"], ["git", "commit", "-q", "-m", "x"]):
            subprocess.run(c, cwd=repo, check=True)
        builds = lambda p: [[sys.executable, "build_app.py"], [sys.executable, "assemble_app.py"]]
        errs = run(repo, ["fixture"], builds)
        assert any("clean checkout" in e for e in errs), errs                      # the clean checkout cannot build
        assert "ERROR: build dependency is not tracked: data/needed_but_untracked.json" in errs, errs
        assert not any("scratch_cache" in e for e in errs), errs                    # a file the build never reads does not block
        subprocess.run(["git", "add", "data/needed_but_untracked.json"], cwd=repo, check=True); subprocess.run(["git", "commit", "-q", "-m", "y"], cwd=repo, check=True)
        assert run(repo, ["fixture"], builds) == [], "tracked fixture must pass"
        print("self-test OK: untracked build dependency fails, a tracked one and an unread scratch file pass")
        return 0
    finally:
        shutil.rmtree(repo, ignore_errors=True)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--self-test" in sys.argv: return self_test()
    profiles = args or PROFILES
    errors = run(ROOT, profiles)
    if errors:
        print("\nRELEASE GATE FAILED:")
        for e in errors: print(" -", e)
        return 1
    print("\nCLEAN-CLONE RELEASE GATE OK (%s)" % ", ".join(profiles))
    return 0


if __name__ == "__main__":
    sys.exit(main())
