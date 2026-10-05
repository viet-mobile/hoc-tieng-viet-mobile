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
4. song tabs: `tests/test_song_tabs.js` (kingdom 1–164, original 1–117, children 0–35, ids unique, nothing missing)
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
- [ ] `tests/test_song_tabs.js` passes: kingdom 164 (1–164), original songs 117 (1–117), children's songs 36
      (0–35, including 0 and 35), no duplicate or missing number

### 왕국 노래 164 and the 전체 듣기 links — known state (2026-10-04)

- Source: `songs_data.js` (164 songs). `tests/test_kingdom_song_164.py` checks 1–163 are unchanged (sha256), 164 against
  `tests/fixtures/kingdom_song_164_update.json` (11 non-Japanese languages) and Japanese 164 against
  `tests/fixtures/kingdom_song_164_ja_update.json` (Songs(9).xlsx, Japanese-only update: title, scripture, 36 lines, reference,
  exact; 1–163 and the other 11 languages of 164 untouched; no Korean fallback).
- `songs_data.json` (163 songs, untracked Excel conversion) is not read by any build or runtime code; it may stay at 163.
- Full-listen links: `https://www.jw.org/finder?srcid=jwlshare&wtlocale=<code>&lank=pub-sjjm_<n>_VIDEO` (codes from
  `songJwLocale` in `app_logic.js`). Buttons come from `SONG_MEDIA["full"]` in `song_media_data.py`, judged by the finder
  (home-page redirect or 404 = hidden). Current gaps: Vietnamese 164 (not published yet), Simplified Chinese 162–163
  (finder goes to the home page although the media API lists a file). Japanese 164 has a video link and (since 2026-10-05) its official lyrics.
  - check: `python tests/check_song_links.py --kingdom 164` (or `--kingdom all`); exit 2 = network problem, not "missing"
  - refresh: `python scripts/song_full_media.py --write`, then `--check`; then update the expected gaps in
    `tests/test_song_tabs.js` and `tests/test_kingdom_song_164.py` if jw.org changed.
- No jw.org document link (docid) for 164: the docid rule is only verified for 1–163 and is not guessed.
- Extraction: `jw_extraction/data/extraction_manifest.json` still records 291 documents; `song_164` is the one expected
  new document (`tests/test_extraction_engine.py`, transition state). Not regenerated on purpose: a rebuild does not
  reproduce the committed derived data even from 163 songs, so it would ship unrelated changes.

### Watchtower study words in [단어] / [복습] — known state (2026-10-05)

- `unified_words_builder.add_source_words` (after the PDF merge): every Watchtower study word is a [단어] entry tagged WT
  (824 added, the rest only gained the tag); WT / 행누 are stored on every entry whose word occurs in the Watchtower
  material / Enjoy Life Forever. Existing meanings, ids and order are untouched (`tests/test_vocab_backfill.py`).
- The words that only the Watchtower list has are NOT in [복습] > [어휘] > 전체 (they are reviewed in [복습] > [어휘] >
  [파수대]); a due spaced-review word of that kind shows the current language's meaning (`tests/test_wt_review_isolation.js`).
- cs / hu / id / zh_cn meanings of those 823 words: `watchtower_vocab_translations.py`, generated by
  `scripts/import_wt_translations.py` from the frozen set `tests/reports/watchtower_vocab_translation/` (SHA-256 of every
  file verified against `freeze_manifest.json` first; the 2 MEDIUM words reviewed by hand, 4 cells changed, listed in the
  script). `tests/test_wt_translations.py` checks coverage per language and that nothing else moved. fr / de / pl have
  no meaning for these words yet (the page shows its "not available" marker, never another language).
- Words found only in Enjoy Life Forever / Love People / the bilingual reader have no word-level meaning source: none were
  added (`tests/reports/vocab_unresolved_candidates.tsv`, regenerated by `tests/test_vocab_backfill.py`).

## 4. TTS / spaced repetition

Automated (fake speech engines with iOS / Android / Windows / macOS user agents): `test_tts_behavior.js`, `test_srs.js`.
They do not replace the real-device checks below.

## 5. Real-device checks — 실기기 확인 필요 (not done yet)

Automated: `tests/test_tts_behavior.js` and `tests/test_tts_sequence.js` (fake Web Speech engines with the user agents of
Windows Chrome / Edge, Android Chrome, macOS / iPhone / iPad Safari, including a lost onend, a speak() dropped without a
trace, no voices at first then `voiceschanged`, no Korean voice, late events of cancelled utterances). They are NOT Safari:
the checks below stay open until someone runs them on the devices. Status until then: **CODE READY — APPLE DEVICE SMOKE
TEST REQUIRED**.

One serial speech engine serves every platform (app_logic.js "speech manager"): one utterance at a time, a run per tap,
a watchdog per utterance. To see where Safari stops, open the site with `?ttsdebug=1` (or set localStorage
`vn-app-tts-debug` = `1`): `window.__ttsDebug` lists `run=… item=… event=start|end|error|watchdog|retry` (no text).

### iPhone Safari / home-screen PWA
- [ ] the first tap plays (nothing plays before a tap)
- [ ] [전체 듣기] with one tap: at least 10 utterances in a row, Vietnamese AND Korean, no silence after the first sentence
- [ ] [복습] flashcard: 반복 듣기 1 / 2 / 3, 자동 넘김 1초 (the default), 10 cards in a row; with 묵음 한 / 베 / 베한
- [ ] [대역 읽기]: 반복 듣기 2, 묵음 한 / 베, [전체 듣기]
- [ ] Korean UI, Korean not muted: Korean is heard on every card
- [ ] changing the flashcard stops the previous card's audio
- [ ] lock the screen, come back: no stuck or doubled audio, nothing starts by itself (a new tap is needed)

### iPadOS Safari
- [ ] the same core scenarios as the iPhone

### Android Chrome
- [ ] a long sentence plays to the end
- [ ] [전체 듣기] and the flashcard scenarios above (no regression)
- [ ] switch to another app and back
- [ ] fast repeated taps: one sentence at a time, no old sentence coming back

### macOS Safari
- [ ] Korean UI, Korean not muted, 반복 2+, 자동 넘김 1초: VI VI KO per card
- [ ] no vi-VN voice installed: safe fallback (no wrong-language reading, no error)

### Windows Edge
- [ ] Natural (online) voices
- [ ] a long sentence is read in chunks without being cut off
- [ ] [전체 듣기], flashcards, 반복 듣기, 자동 넘김, 묵음 as before (no regression)

When all of section 5 is confirmed, run `python scripts/preprod_verify.py --devices-verified`.

### JW.ORG links — strict share-link policy (2026-10-05)

- Every jw.org publication / media link a screen shows must pass `isAllowedJwOrgShareUrl()` in `app_logic.js`: `https://www.jw.org/finder?srcid=jwlshare&wtlocale=<code>&lank=<media key>` (media) or `...&prefer=lang&docid=<id>` (a publication page; a docid takes the place of the lank). Article / locale-path / CDN / redirect addresses and finder addresses without `srcid=jwlshare` or `wtlocale` are rejected; `jwOrgBadgeHtml()` fails closed. Visible badge text is always `JW.ORG`; aria-label / title / `data-media-kind` tell the kinds apart.
- JW choir (osg) recordings: `song_media_data.CHOIR_OSG` (explicit table song -> osg track, from jw.org media metadata: titles must agree in >= 10 of 12 languages; never `number - 38` or any formula) + finder-verified languages. Maintain with `python scripts/song_choir_media.py [--check|--write]` (network; preprod step 5 runs `--check`).
- `kid_songs_data.json`'s article-page addresses (`url`, `collectionUrl`) are provenance only and are not shipped in the page.
- Test: `node tests/test_jw_org_badges.js`.

### Release gate (from 2026-10-05)

- Ordinary UI / wording / single-song or material additions / verified translations / link display: run the tests of the changed feature, then `python scripts/release_smoke.py` (build, JS syntax, 164, JW.ORG badges + publication views + console errors, WT title-first, regional admin), secret scan, selective staging, commit, push to `multi-cs-hu`, and a production smoke (HTTP, feature fingerprint, console, real UI, key links). Fix or roll back quickly if production shows a problem.
- `python scripts/preprod_verify.py` (1–2 h) is the default only for high-risk changes: DB schema / migrations, authentication / authorization, admin security, payment / provider, SRS storage, a large TTS engine change, the i18n structure, build / runtime architecture, mass regeneration of canonical data. A skipped full preprod is not by itself a release failure.
- JW.ORG badges in card headers: `title [JW.ORG]` — the title `<button>` and the badge `<a>` are siblings in `.group-head-row.has-jw-badges` / `.song-acc-headrow.has-jw-badges` (never a link inside a button); the empty part of such a row also toggles the card.
