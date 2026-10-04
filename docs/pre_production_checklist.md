# Pre-production checklist (TTS · 간격 복습 · 노래 탭 · /admin SECTION F 열람 계정)

Nothing in this document has been run against production. Every remote command below is for the operator to run by
hand, in this order, after the deployment is approved.

## 0. Before anything: local verification

```bash
python scripts/preprod_verify.py
```

It builds every site and runs, one at a time and in this order:

1. build all sites (`build_app.py --site all`, `assemble_app.py --site all`)
2. TTS: `tests/test_tts_behavior.js`
3. spaced repetition: `tests/test_srs.js`
4. song tabs: `tests/test_song_tabs.js` (kingdom 1–163, original 1–117, children 0–35, ids unique, nothing missing)
5. song links on jw.org: `tests/check_song_links.py` (needs the network)
6. regional admin: `tests/test_regional_admin.js`
7. regional E2E: `tests/test_regional_e2e.js`
8. SECTION F anonymous exposure and viewer authorization: `tests/test_section_f_viewer.js`
9. every other `tests/test_*.js` / `tests/test_*.py` (run with `PYTHONPATH` = repository root)

The last line it prints is one of:

- `NOT READY`: a step failed (the log path is printed).
- `READY FOR PRODUCTION — DEVICE SMOKE TEST PENDING`: everything passed, but the real-device checks of section 5 have
  not been confirmed.
- `READY FOR PRODUCTION`: everything passed and it was run with `--devices-verified` after section 5 was done.

### Known slow / flaky tests (kept on record)

| test | first full run (2026-10-04) | re-run alone | assessment |
| --- | --- | --- | --- |
| `test_browser_runtime.js` | FAIL: `TIMEOUT waiting for app readiness`, JEONJU `zh`, `document.readyState` still `loading` | PASS (all profiles, 0 errors) | page load did not finish in time while other tests ran in parallel on the same PC; no app error was reported. Re-check with a clean run. |
| `test_regional_admin.js` | killed by the run's own 900 s limit (the empty "seed generation failed" error is its child process being killed) | PASS (28/28) | slow under load, not an assertion failure. Re-check with a clean run. |

`preprod_verify.py` has no per-test timeout and prints each step's duration, so a slow machine shows as a long
duration instead of a failure. A failure there is a real failure.

## 1. /admin production order: migration → account → deploy

> ⚠️ **DEPENDENCY: the new admin code reads `admin_users.role`. If it is deployed before the migration, every admin
> login fails (500). Step 1 MUST succeed before step 3. Never deploy first.**
>
> The jeonju and ulsan sites both get the new worker. If ulsan uses a different D1 database, run step 1 on that
> database too before deploying.

### Step 1 — D1 migration

```bash
npx wrangler d1 execute <JEONJU_DB_NAME> --remote --file regional_admin/migrations/0001_admin_role.sql
```

Confirm it succeeded, then confirm every existing account kept full rights (role `admin`):

```bash
npx wrangler d1 execute <JEONJU_DB_NAME> --remote --command "SELECT username, allowed_region, role, is_active FROM admin_users"
```

Every existing row must show `role = admin`. The migration only adds a column with a default. The worker currently in
production never reads it, so the site keeps working between step 1 and step 3.

### Step 2 — the restricted account (`sectionf.assistant`, jeonju only, SECTION F read-only)

Choose a **new** random password just before this step. The password used earlier in the chat is never used in
production. The password must not be written to Git, JS, HTML, JSON, test fixtures, SQL comments or logs.

```powershell
$env:SF_PW = '<NEW_RANDOM_PASSWORD>'
python scripts/create_admin_user.py `
  --username sectionf.assistant `
  --region jeonju `
  --role section_f_viewer `
  --password-env SF_PW > sf.sql
```

- PowerShell keeps typed lines in its history file (PSReadLine). Either clear that line afterwards or leave out
  `--password-env SF_PW`: the script then asks for the password twice without echoing it, and nothing is stored.
- Review `sf.sql`. It must be one `INSERT INTO admin_users (...)` with `'sectionf.assistant'`, a
  `pbkdf2:sha256:100000:...` hash, `'jeonju'`, `'section_f_viewer'`. It contains no password. It is ignored by Git
  (`.gitignore`).

```bash
npx wrangler d1 execute <JEONJU_DB_NAME> --remote --file sf.sql
```

Afterwards:

```powershell
Remove-Item sf.sql
Remove-Item Env:SF_PW
```

`--region jeonju` is deliberate. Widening the account to ulsan needs a separate approval.

### Step 3 — application deploy

Only after steps 1 and 2 succeeded: deploy the new Pages/Worker build (production branch `multi-cs-hu`). Then run the
smoke test in section 2 straight away.

Rollback: redeploy the previous build. The `role` column stays and is harmless to the old code.

## 2. Admin smoke test (production, right after step 3)

### Existing admin

- [ ] login succeeds
- [ ] SECTION A–F are all shown
- [ ] reads work (A schedule, B cancellations, C curriculum, D plan, E history)
- [ ] a write works. Use a harmless one: in SECTION A, save the current values unchanged (it adds one history entry).
- [ ] logout works

### sectionf.assistant

- [ ] login succeeds
- [ ] SECTION F opens by itself
- [ ] SECTION A–E are not shown
- [ ] SECTION F in Korean
- [ ] SECTION F in Vietnamese (language select → Tiếng Việt)
- [ ] switching the language back and forth works
- [ ] no edit buttons
- [ ] no save / delete / upload controls
- [ ] the header shows "SECTION F 읽기 전용"

### Direct-access attack test (signed in as sectionf.assistant)

Run these in the browser console on `https://<jeonju site>/admin`. The session cookie is HttpOnly, so the page's own
origin has to send them. Every write uses a body the server would reject anyway. If the role check were ever missing,
the answer would be 400 / 409 (checked locally with a full admin: nothing is written), never a change.

```js
const csrf = window.__ADMIN_BOOT.csrfToken;
const call = (m, p, b) => fetch(p, { method: m, credentials: 'same-origin',
  headers: Object.assign({ 'X-CSRF-Token': csrf }, b ? { 'Content-Type': 'application/json' } : {}),
  body: b ? JSON.stringify(b) : undefined }).then(r => m + ' ' + p + ' -> ' + r.status);
Promise.all([
  call('GET', '/api/admin/schedule'),        // A
  call('GET', '/api/admin/cancellations'),   // B
  call('GET', '/api/admin/curriculum'),      // C
  call('GET', '/api/admin/plan'),            // D
  call('GET', '/api/admin/audit'),           // E
  call('PUT', '/api/admin/settings', { courseStartDate: 'invalid' }),
  call('POST', '/api/admin/cancellations', { date: 'invalid', reason: '' }),
  call('POST', '/api/admin/plan/apply', { token: 'invalid' }),
]).then(r => console.log(r.join('\n')));
```

- [ ] every line ends in `403` (the writes carry a valid CSRF token and are still 403)
- [ ] SECTION F is still readable afterwards
- [ ] signed out: `view-source:` of `/admin` contains no guide text. Search for "Accelerated Language Learning" or
      "한 시간에 2–4가지 방법" (guide-only texts; the page's own labels such as "주별 지도 계획" are always there).

## 3. Song data (before deploying)

- [ ] `python tests/check_song_links.py` prints `OK: song_tab_links.py matches jw.org`
- [ ] `tests/test_song_tabs.js` passes: kingdom 163 (1–163), original songs 117 (1–117), children's songs 36
      (0–35, including 0 and 35), no duplicate or missing number

## 4. TTS / spaced repetition

Automated (fake speech engines with iOS / Android / Windows / macOS user agents): `test_tts_behavior.js`, `test_srs.js`.
They do not replace the real-device checks below.

## 5. Real-device checks — 실기기 확인 필요 (not done yet)

### iPhone Safari / home-screen PWA
- [ ] the first tap plays (nothing plays before a tap)
- [ ] 전체 듣기 reads to the end
- [ ] changing the flashcard stops the previous card's audio
- [ ] lock the screen, come back: no stuck or doubled audio

### Android Chrome
- [ ] a long sentence plays to the end
- [ ] 전체 듣기
- [ ] switch to another app and back
- [ ] fast repeated taps: one sentence at a time, no old sentence coming back

### macOS Safari
- [ ] no vi-VN voice installed: safe fallback (no wrong-language reading, no error)

### Windows Edge
- [ ] Natural (online) voices
- [ ] a long sentence is read in chunks without being cut off

When all of section 5 is confirmed, run `python scripts/preprod_verify.py --devices-verified`.
