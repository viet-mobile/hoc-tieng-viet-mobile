# -*- coding: utf-8 -*-
"""Production smoke test of the read-only SECTION F account (run by the operator, by hand).

    $env:SF_PW = '<the account password>'          (PowerShell; the password is read from the environment only)
    python scripts/smoke_section_f_login.py [--site https://jeonju.hoc.tieng.viet.mobile] [--user sectionf.assistant]

Checks, in order (the password is never printed or written):
  1. the page of a signed-out visitor has no guide text;
  2. login works (no HTTP 500) and the account's role is section_f_viewer;
  3. the signed-in /admin page carries SECTION F (guide + Korean and Vietnamese course texts) for this role;
  4. every section A-E API answers 403, every write API answers 403 (with a valid CSRF token: the role check, not the
     body, is what refuses -- the bodies are ones the server would reject anyway);
  5. logout works and the session is gone afterwards.
Exit code 0 only when every check passed.
"""
import argparse
import http.cookiejar
import json
import os
import sys
import urllib.error
import urllib.request

GUIDE_ONLY_TEXTS = ("Accelerated Language Learning", "한 시간에 2–4가지 방법")   # texts only the teacher's guide has


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", default="https://jeonju.hoc.tieng.viet.mobile")
    ap.add_argument("--user", default="sectionf.assistant")
    ap.add_argument("--password-env", default="SF_PW")
    args = ap.parse_args()
    password = os.environ.get(args.password_env)
    if not password:
        print("error: set the password in the environment variable %s first" % args.password_env)
        return 2
    site = args.site.rstrip("/")
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar), NoRedirect())
    results = []

    def check(ok, msg):
        results.append(ok)
        print(("PASS  " if ok else "FAIL  ") + msg)

    def call(method, path, body=None, csrf=None):
        headers = {"User-Agent": "Mozilla/5.0 (section-f smoke test)", "Origin": site}
        data = None
        if body is not None:
            data = json.dumps(body).encode("utf-8")
            headers["Content-Type"] = "application/json"
        if csrf:
            headers["X-CSRF-Token"] = csrf
        req = urllib.request.Request(site + path, data=data, method=method, headers=headers)
        try:
            r = opener.open(req, timeout=30)
            return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode("utf-8", "replace")

    # 1. signed out: no guide in the page
    st, html = call("GET", "/admin")
    check(st == 200 and not any(t in html for t in GUIDE_ONLY_TEXTS), "signed-out /admin: HTTP %s, no guide text" % st)

    # 2. login
    st, body = call("POST", "/api/auth/login", {"username": args.user, "password": password})
    check(st == 200, "login: HTTP %s%s" % (st, "" if st == 200 else " (500 = the role migration is missing; 401 = wrong user or password)"))
    if st != 200:
        return 1
    csrf = (json.loads(body) or {}).get("csrfToken", "")
    st, body = call("GET", "/api/auth/me")
    me = json.loads(body).get("user", {}) if st == 200 else {}
    check(st == 200 and me.get("role") == "section_f_viewer" and me.get("username") == args.user, "session: role=%s, region=%s" % (me.get("role"), me.get("allowed_region")))

    # 3. the signed-in page: SECTION F only
    st, html = call("GET", "/admin")
    check(st == 200 and '"role":"section_f_viewer"' in html.replace(" ", ""), "signed-in /admin carries the section_f_viewer role (HTTP %s)" % st)
    check(any(t in html for t in GUIDE_ONLY_TEXTS), "signed-in /admin has the teacher's guide (SECTION F)")
    check('"courseVi":{}' not in html.replace(" ", "") and "Tiếng Việt" in html, "Korean and Vietnamese texts are in the page")

    # 4. every other API refuses
    for path in ("/api/admin/schedule", "/api/admin/cancellations", "/api/admin/curriculum", "/api/admin/plan", "/api/admin/audit"):
        st, _ = call("GET", path, csrf=csrf)
        check(st == 403, "GET %s -> %s (A-E must be 403)" % (path, st))
    for method, path, body in (("PUT", "/api/admin/settings", {"courseStartDate": "invalid"}),
                               ("POST", "/api/admin/cancellations", {"date": "invalid", "reason": ""}),
                               ("POST", "/api/admin/plan/apply", {"token": "invalid"}),
                               ("PUT", "/api/admin/plan/pin", {})):
        st, _ = call(method, path, body, csrf=csrf)
        check(st == 403, "%s %s -> %s (write must be 403)" % (method, path, st))

    # 5. logout
    st, _ = call("POST", "/api/auth/logout", {}, csrf=csrf)
    check(st == 200, "logout -> %s" % st)
    st, _ = call("GET", "/api/auth/me")
    check(st == 401, "after logout /api/auth/me -> %s (expected 401)" % st)

    print("\n%d/%d checks passed" % (sum(results), len(results)))
    if all(results):
        print("SECTION F VIEWER PRODUCTION LOGIN COMPLETE (this part: the account and the server side; open /admin once in a "
              "browser to see the Korean / Vietnamese switch)")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
