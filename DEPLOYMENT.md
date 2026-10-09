# hoc.tieng.viet.mobile / jw.hoc.tieng.viet.mobile / jeonju.hoc.tieng.viet.mobile deployment

This repository is the independent source for one Vietnamese-learning application
shared by three domains, each showing a different content PROFILE built from the
same source data (see `site_profiles.py` PRODUCTS/DOMAIN_MAP; no data is duplicated
per profile):

| domain | profile | build output |
|---|---|---|
| `hoc.tieng.viet.mobile` | general (slim, no JW publication content) | `dist/` |
| `jw.hoc.tieng.viet.mobile` | jw (general + JW publication content) | `dist/jw/` |
| `jeonju.hoc.tieng.viet.mobile` | jeonju (jw + the Jeonju class event layer) | `dist/jeonju/` |

It is not connected to any other project or service.

## Build the deployable site

From the project root, run each profile you need:

```powershell
python build_app.py --profile general
python assemble_app.py --profile general

python build_app.py --profile jw
python assemble_app.py --profile jw

python build_app.py --profile jeonju
python assemble_app.py --profile jeonju
```

`build_app.py` regenerates that profile's `data_block*.js`. `assemble_app.py`
assembles `app*.html`, then copies that unchanged generated file to the matching
`dist/` path from the table above. `--site` also works as an alias for `--profile`.

Only `dist/` (all three subpaths) is a public deployment output. The source data,
raw captures, verification scripts, and screenshots remain outside that directory.

## Cloudflare Pages (Git integration)

Use a separate GitHub repository and a separate Cloudflare Pages project per domain
(or three Pages projects against the same repo, one per profile). Configure each
Pages project with:

| domain | Build command | Build output directory |
|---|---|---|
| `hoc.tieng.viet.mobile` | `python build_app.py --profile general && python assemble_app.py --profile general` | `dist` |
| `jw.hoc.tieng.viet.mobile` | `python build_app.py --profile jw && python assemble_app.py --profile jw` | `dist/jw` |
| `jeonju.hoc.tieng.viet.mobile` | `python build_app.py --profile jeonju && python assemble_app.py --profile jeonju` | `dist/jeonju` |

Production branch: `main` for all three. Add each domain only to its own Pages
project through **Custom domains**. Do not add a Worker, Wrangler configuration,
hostname-based runtime routing, or dependencies on another project -- domain-to-
profile mapping is a deployment-config concern (this table / `DOMAIN_MAP`), not
application logic.

## Before every production push: the clean-clone gate

```
targeted tests -> python3 scripts/release_clean_clone_check.py -> git status / staged file review -> commit
  -> fast-forward push to multi-cs-hu -> short production smoke
```

`scripts/release_clean_clone_check.py` (about a minute, no browser) checks out the committed HEAD alone (`git archive`, no untracked or
modified files) and runs the Cloudflare build of the jeonju, jw and general profiles there; then it runs the build once in the working
tree with an audit hook and fails with `ERROR: build dependency is not tracked: <path>` for every repo file the build READS that is not
in `git ls-files`. Caches, review documents and scratch files the build never reads (`jw_extraction/`, `docs/*review*`,
`song_audio_ok.json` ...) neither block a release nor need to be tracked. `--self-test` proves the gate fails on an untracked build
dependency. (2026-10-09: a push whose build read three untracked `scripts/data/original_segment_*.json` made the Cloudflare build fail;
the previous deployment kept serving, so there was no outage. This gate reproduces that failure.) Never force-push `multi-cs-hu`.

## Song editor (admin SECTION G) -- database migration

The /admin tab **SECTION G -- 노래 편집·게시** (jeonju and ulsan only) stores song edits in D1 (`song_edits`, `song_history`,
`song_site_state`; `regional_admin/schema.sql`, `regional_admin/migrations/0002_song_edits.sql`). A production D1 that was created
before this feature needs the migration ONCE per region database:

```
npx wrangler d1 execute <DB_NAME> --remote --file regional_admin/migrations/0002_song_edits.sql
```

The migration only creates tables (`CREATE TABLE IF NOT EXISTS`), so it is safe to run twice and before or after the deploy. Until it
has run, the public site simply shows the build's songs (`/api/regional/songs` answers "nothing published") and the song tab of /admin
reports an error; nothing else is affected. Published edits are applied by the public page at run time (no redeploy); the build's own
song data (`songs_data.js`, the `jw_*_songs_ko_vi.json` files) is never modified by the editor. `songs_baseline.json` (what the editor
starts from) is generated into `dist/jeonju` and `dist/ulsan` by `assemble_app.py`; GENERAL and JW carry no editor, no baseline and no
song-edit code.

## Release tooling prerequisites

- **Node >= 22.14** for `scripts/release_smoke.py`, `scripts/preprod_verify.py` and the `tests/*.js` browser tests
  (`tests/helpers/d1_sqlite.js` uses `node:sqlite`). `release_smoke.py` stops at once with
  `Node 22.14+ required for release smoke` on an older Node; it never installs or changes the system Node.
- Python 3.9+, Google Chrome (or `CHROME_PATH`).
- Official song lyrics of the other UI languages are imported with `python scripts/import_song_languages.py`
  (jw.org finder pages -> `jw_songs_i18n.json`); the build reads that file, nothing is generated or translated.
