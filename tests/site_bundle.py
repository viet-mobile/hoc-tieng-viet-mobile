# -*- coding: utf-8 -*-
"""Read a deployed profile the way a browser gets it: index.html plus the data scripts it loads.

assemble_app.py publishes each profile's data block as separate `data.<n>.<hash>.js` files (Cloudflare Pages
rejects files over 25 MiB), so content checks must look at the whole deployed bundle, not index.html alone.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def site_dir(site):
    return ROOT / "dist" if site == "general" else ROOT / "dist" / site


def read_site_bundle(site):
    """index.html with each <script src="data.*.js"> tag replaced by that file's content (load order kept)."""
    base = site_dir(site)
    html = (base / "index.html").read_text(encoding="utf-8")

    def inline(match):
        return "<script>\n" + (base / match.group(1)).read_text(encoding="utf-8") + "\n</script>"

    return re.sub(r'<script src="(data\.[^"]+\.js)"></script>', inline, html)
