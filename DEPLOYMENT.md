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
