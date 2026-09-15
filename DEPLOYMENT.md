# hoc.tieng.viet.mobile deployment

This repository is the independent source for the Vietnamese-learning site at
`hoc.tieng.viet.mobile`. It is not connected to any other project or service.

## Build the deployable site

From the project root, run:

```powershell
python build_app.py
python assemble_app.py
```

The first command regenerates `data_block.js`. The second command assembles
`app.html`, then copies that unchanged generated file to `dist/index.html`.

Only `dist/` is a public deployment output. The source data, raw captures,
verification scripts, and screenshots remain outside that directory.

## Cloudflare Pages (Git integration)

Use a separate GitHub repository and a separate Cloudflare Pages project for
this site. Configure Pages with:

- Build command: `python build_app.py && python assemble_app.py`
- Build output directory: `dist`
- Production branch: `main`

Add `hoc.tieng.viet.mobile` only to this Pages project through **Custom domains**.
Do not add a Worker, Wrangler configuration, or dependencies on another project.
