import argparse
import os
import stat
import sys
import hashlib
import json
import re
from pathlib import Path
import shutil

from site_html import strip_site_html, remove_elements, empty_elements
from site_profiles import (SITE_TITLES, NON_JW_HTML_REMOVALS, SITES, SITE_IDS, TARGET_ENGINE_HTML, data_block_name,
                           BRAND_ICON_FILES)


def apply_general_label_overrides(html_text):
    """GENERAL-only top-level tab label fixes, applied after strip_site_html has trimmed each
    tab's subtabs down to its general-only content. JW and JEONJU keep the original labels (and
    their existing I18N_UI translations) completely untouched; only these specific buttons are
    rewritten, reusing an already-translated I18N_UI key rather than the tab's old one:
      - [성경](bible tab): its "성경"(book names) subtab is removed, leaving only
        numbers/time/days/months -- relabeled to "숫자" (reuses the data-bible="numbers" subtab's
        own already-translated I18N_UI key; the user's final, explicit choice over an earlier
        "숫자·시간" attempt).
      - [교과](curriculum tab): trimmed down to its "문화"(Culture) subtab only (the other 4 --
        16-week course/song/prayer/guide -- are JW-only) -- relabeled to "문화", reusing that
        subtab's own already-translated key so no new translations are needed.
    """
    out = html_text.replace(
        '<button class="tab-btn" role="tab" data-tab="bible" aria-selected="false" data-i18n="성경">성경</button>',
        '<button class="tab-btn" role="tab" data-tab="bible" aria-selected="false" data-i18n="숫자">숫자</button>',
        1,
    )
    # The review panel's own category row has its own separate "성경" button (data-review="bible")
    # -- same relabel, since its pool is also numbers/time/days/months only in GENERAL.
    out = out.replace(
        '<button class="subtab-btn" data-review="bible" aria-selected="false" data-i18n="성경">성경</button>',
        '<button class="subtab-btn" data-review="bible" aria-selected="false" data-i18n="숫자">숫자</button>',
        1,
    )
    return out


def apply_site_identity(html_text, site):
    info = SITE_TITLES[site]
    out = html_text.replace(
        "<title>베트남어 학습반 · 越南語學習班 · Vietnamese Language Course · ベトナム語訓練コース</title>",
        f"<title>{info['title']}</title>",
        1,
    )
    out = out.replace(
        '<h1 id="app-title" data-i18n="베트남어 학습반">베트남어 학습반</h1>',
        f'<h1 id="app-title" data-i18n="{info["h1"]}">{info["h1"]}</h1>',
        1,
    )
    # The static <meta ...content="..."> variants share the same baseline placeholder text as
    # <title> in the template; keep them in sync with this site's own title instead of leaving
    # every profile showing the generic (JW-baseline) description.
    baseline_meta = "베트남어 학습반 · 越南語學習班 · Vietnamese Language Course · ベトナム語訓練コース"
    for meta_tag in (
        f'<meta name="description" content="{baseline_meta}">',
        f'<meta property="og:description" content="{baseline_meta}">',
        f'<meta name="twitter:description" content="{baseline_meta}">',
    ):
        out = out.replace(meta_tag, meta_tag.replace(baseline_meta, info["title"]), 1)
    # Cross-site profile link (GENERAL -> JW, JW -> JEONJU; omitted for JEONJU)
    if info.get("cross_link"):
        link_info = info["cross_link"]
        url = link_info["url"]
        initial_text = link_info["text_by_lang"]["ko"] if "text_by_lang" in link_info else link_info["text"]
        cross_link_markup = (
            f'<div class="site-cross-link-wrap">'
            f'<a id="site-cross-link" class="site-cross-link" href="{url}">{initial_text}</a>'
            + "".join(
                f'<a class="site-cross-link" href="{extra["url"]}">{extra["text"]}</a>'
                for extra in link_info.get("extra_links", [])
            )
            + f'</div>'
        )
        out = out.replace("<!-- __SITE_CROSS_LINK__ -->", cross_link_markup, 1)
    else:
        out = out.replace("<!-- __SITE_CROSS_LINK__ -->", "", 1)
    return out



def build_manifest(site):
    info = SITE_TITLES[site]
    base = json.loads(open("manifest.webmanifest", encoding="utf-8").read())
    base["name"] = info["h1"]
    base["short_name"] = info["h1"][:12]
    base["description"] = info["title"]
    brand = SITES[site].get("brand")
    if brand:
        # A target-language site installs as its own app: its short name, colour and icons (never
        # the Vietnamese sites' logo).
        base["short_name"] = brand["short_name"]
        base["theme_color"] = brand["color"]
        base["background_color"] = "#FFFFFF"
        base["icons"] = [
            {"src": "brand/" + BRAND_ICON_FILES["png192"], "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
            {"src": "brand/" + BRAND_ICON_FILES["png512"], "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
            {"src": "brand/" + BRAND_ICON_FILES["svg"], "sizes": "any", "type": "image/svg+xml", "purpose": "any"},
        ]
    return json.dumps(base, ensure_ascii=False, indent=2)


def _remove_tree(path):
    """rmtree that also clears a read-only flag (Windows marks copied directories read-only)."""
    def retry(func, p, _exc):
        os.chmod(p, stat.S_IWRITE)
        func(p)
    if Path(path).exists():
        shutil.rmtree(path, onexc=retry) if sys.version_info >= (3, 12) else shutil.rmtree(path, onerror=retry)


VIETNAMESE_ICON_LINKS = ('<link rel="icon" type="image/png" href="assets/hoc-tieng-viet-logo.png">\n'
                         '<link rel="apple-touch-icon" href="assets/hoc-tieng-viet-logo.png">')
VIETNAMESE_THEME_META = '<meta name="theme-color" content="#00613F">'


def apply_brand(html_text, site):
    """Target-language sites: their own favicon/apple-touch icon and theme colour in place of the
    Vietnamese sites' logo (files copied from brand/<target>/ into the site's brand/ directory)."""
    brand = SITES[site]["brand"]
    for needle in (VIETNAMESE_ICON_LINKS, VIETNAMESE_THEME_META):
        if needle not in html_text:
            raise SystemExit(f"[{site}] template.html: {needle[:40]!r}... not found for branding")
    links = (f'<link rel="icon" type="image/svg+xml" href="brand/{BRAND_ICON_FILES["svg"]}">\n'
             f'<link rel="icon" type="image/png" sizes="32x32" href="brand/{BRAND_ICON_FILES["png32"]}">\n'
             f'<link rel="apple-touch-icon" sizes="180x180" href="brand/{BRAND_ICON_FILES["apple"]}">')
    html_text = html_text.replace(VIETNAMESE_ICON_LINKS, links, 1)
    return html_text.replace(VIETNAMESE_THEME_META, f'<meta name="theme-color" content="{brand["color"]}">', 1)


def build_site_identity_prelude(site):
    """Small standalone script inserted right before app_logic.js runs (inside the same <script>
    tag as __APP_JS__, so it executes first), exposing this site's own per-language header/title
    text -- if any -- as SITE_H1_BY_LANG / SITE_TITLE_BY_LANG globals. app_logic.js's TITLE_BY_LANG
    and applySiteH1Override() prefer these when present and fall back to their own built-in
    defaults otherwise (e.g. jeonju, which has no per-language variant and keeps a fixed header),
    so the header and browser-tab title track the user's current UI language instead of reverting
    to Korean after a language switch."""
    info = SITE_TITLES[site]
    parts = [
        f'window.SITE_PROFILE = "{site}";',
        f'window.SITE_HOST = "{info["host"]}";',
        f'document.documentElement.setAttribute("data-site", "{site}");',
    ]
    if info.get("h1_by_lang"):
        parts.append(f"var SITE_H1_BY_LANG = {json.dumps(info['h1_by_lang'], ensure_ascii=False)};")
    if info.get("title_by_lang"):
        parts.append(f"var SITE_TITLE_BY_LANG = {json.dumps(info['title_by_lang'], ensure_ascii=False)};")
    if info.get("cross_link"):
        parts.append(f"var SITE_CROSS_LINK = {json.dumps(info['cross_link'], ensure_ascii=False)};")
    return "\n".join(parts)


# Cloudflare Pages rejects any single deployed file over 25 MiB. The JW/JEONJU/ULSAN data payload alone is
# ~27 MiB, so each profile's own data block is published as separate classic scripts, each at most this size.
DATA_CHUNK_LIMIT = 20 * 1024 * 1024
DATA_PLACEHOLDER = "__DATA_SCRIPTS__"
# Every site other than GENERAL publishes into its own directory under dist/ (site_profiles.SITES).
PROFILE_SUBDIRS = tuple(SITES[s]["output_dir"][len("dist/"):] for s in SITE_IDS if SITES[s]["output_dir"] != "dist")


def split_data_js(data_js, limit=DATA_CHUNK_LIMIT):
    """Split a data block into chunks of whole top-level declarations (`const NAME = ...;`).

    Classic <script> files share one global lexical scope, so the constants stay visible to app_logic.js
    exactly as when inlined. A chunk boundary is only ever placed before a column-0 declaration.
    """
    statements = [st for st in re.split(r"(?m)^(?=(?:const|let|var) [A-Za-z_$][\w$]* = )", data_js) if st]
    chunks, current, size = [], [], 0
    for st in statements:
        n = len(st.encode("utf-8"))
        if n > limit:
            raise SystemExit(f"single data declaration is {n} bytes, over the {limit}-byte chunk limit: {st[:60]!r}")
        if current and size + n > limit:
            chunks.append("".join(current))
            current, size = [], 0
        current.append(st)
        size += n
    if current:
        chunks.append("".join(current))
    return chunks


def write_data_scripts(dist_dir, data_js):
    """Write this profile's data chunks next to its index.html; return the <script src> tags (content-hashed names)."""
    for old in dist_dir.glob("data.*.js"):
        old.unlink()
    tags = []
    for i, chunk in enumerate(split_data_js(data_js), 1):
        digest = hashlib.sha256(chunk.encode("utf-8")).hexdigest()[:10]
        name = f"data.{i}.{digest}.js"
        with open(dist_dir / name, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(chunk)
        tags.append(f'<script src="{name}"></script>')
    return "\n".join(tags)


def strip_marked_block(text, name):
    """Remove `/* BEGIN <name> ... */ ... /* END <name> */` (both marker lines and everything between)."""
    begin = text.index(f"/* BEGIN {name}")
    end_marker = f"/* END {name} */"
    end = text.index(end_marker, begin) + len(end_marker)
    return text[:begin] + text[end:]


def assemble_site(site):
    tpl = open("template.html", encoding="utf-8").read()
    meta = SITES[site]
    data_js = open(data_block_name(site), encoding="utf-8").read()
    app_js = open("app_logic.js", encoding="utf-8").read()

    if meta["family"] != "regional":
        # The regional public site's live-data client (its only network call) exists only in regional builds.
        app_js = strip_marked_block(app_js, "REGIONAL-HYDRATION")

    # The data block is published as separate files (see write_data_scripts); keep a placeholder until the end.
    out, n = re.subn(r"<script>\s*__DATA_JS__\s*</script>", DATA_PLACEHOLDER, tpl, count=1)
    if n != 1:
        raise SystemExit("template.html: <script>__DATA_JS__</script> slot not found")
    out = out.replace("__APP_JS__", build_site_identity_prelude(site) + "\n" + app_js, 1)

    # GENERAL is the only slim profile -- JW and JEONJU both keep the full JW-profile HTML
    # (JEONJU = JW's complete feature set + its own event layer, not general + event).
    removal_counts = {}
    if meta["engine"] == "vietnamese" and meta["family"] == "general":
        out, removal_counts = strip_site_html(out, NON_JW_HTML_REMOVALS)
        out = apply_general_label_overrides(out)
    elif meta["engine"] == "target":
        # The target engine renders into the kept panels; none of the Vietnamese app's markup ships.
        out, removal_counts = strip_site_html(out, {"tabs": TARGET_ENGINE_HTML["tabs"]})
        out, removal_counts["emptied_panels"] = empty_elements(
            out, [("section", "id", "panel-" + p) for p in TARGET_ENGINE_HTML["empty_panels"]])
        out, removal_counts["removed"] = remove_elements(out, TARGET_ENGINE_HTML["remove"])
    if meta.get("brand"):
        out = apply_brand(out, site)

    out = apply_site_identity(out, site)

    # Local single-file copy (not deployed) keeps the data inline.
    out_html_name = "app.html" if site == "jw" else f"app.{site}.html"  # local only, git-ignored
    open(out_html_name, "w", encoding="utf-8").write(out.replace(DATA_PLACEHOLDER, "<script>\n" + data_js + "\n</script>", 1))

    # dist/ layout follows DOMAIN_MAP's meaning, not build-CLI legacy defaults: GENERAL is
    # hoc.tieng.viet.mobile's own content (bare dist/), JW and JEONJU are the two subdomains
    # (dist/jw/, dist/jeonju/). Source/data are never duplicated per profile -- only this
    # deployment-artifact directory differs; see site_profiles.DOMAIN_MAP.
    dist_dir = Path(meta["output_dir"])
    dist_dir.mkdir(parents=True, exist_ok=True)
    if dist_dir == Path("dist"):
        # GENERAL's Pages output is dist/ itself: it must not also publish the other profiles' artifacts.
        for sub in PROFILE_SUBDIRS:
            try:
                shutil.rmtree(dist_dir / sub)
            except FileNotFoundError:
                pass
            except OSError as exc:  # e.g. a local server holding the directory open on Windows
                print(f"[general] WARNING: could not remove dist/{sub} ({exc}); do not deploy this local dist/ as GENERAL")
    data_tags = write_data_scripts(dist_dir, data_js)
    open(dist_dir / "index.html", "w", encoding="utf-8").write(out.replace(DATA_PLACEHOLDER, data_tags, 1))
    if meta.get("brand"):
        # Only this site's own icons; the Vietnamese sites' logo (assets/) is not published here.
        _remove_tree(dist_dir / "assets")
        (dist_dir / "brand").mkdir(exist_ok=True)
        for name in BRAND_ICON_FILES.values():
            shutil.copyfile(Path(meta["brand"]["dir"]) / name, dist_dir / "brand" / name)
    else:
        shutil.copytree("assets", dist_dir / "assets", dirs_exist_ok=True)
    open(dist_dir / "manifest.webmanifest", "w", encoding="utf-8").write(build_manifest(site))
    shutil.copyfile("_redirects", dist_dir / "_redirects")

    # Physical build isolation: _worker.js is generated ONLY for regional sites (jeonju, ulsan).
    # general and jw are 100% static sites with 0 admin UI bytes, 0 API routes, and NO _worker.js.
    worker_path = dist_dir / "_worker.js"
    if meta["family"] == "regional":
        from regional_admin.bundle_worker import bundle_regional_worker
        worker_code = bundle_regional_worker(site)
        with open(worker_path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(worker_code)
        print(f"[{site}] regional worker artifact:", worker_path, f"({len(worker_code)} bytes)")
    else:
        if worker_path.exists():
            worker_path.unlink()

    for f in sorted(dist_dir.glob("*")):
        if f.is_file():
            print(f"[{site}] {f.name}: {f.stat().st_size / 1048576:.2f} MiB")
    if removal_counts:
        print(f"[{site}] html removals:", removal_counts)
    print(f"[{site}] deployment artifact:", dist_dir / "index.html")


def main():
    from site_profiles import PRODUCTS

    parser = argparse.ArgumentParser()
    parser.add_argument("--product", choices=list(PRODUCTS.keys()), default="vietnamese",
                         help="Deprecated: the learning language comes from site_profiles.SITES; kept for old commands.")
    parser.add_argument("--site", "--profile", dest="site", choices=SITE_IDS + ["all", "all-vietnamese"], default="general",
                         help="Site to assemble (site_profiles.SITES), 'all-vietnamese' (general, jw, jeonju, ulsan) or "
                              "'all' (default: general, which is what the GENERAL Pages project deploys from dist/). "
                              "--site is kept as an alias for --profile for backward compatibility.")
    args = parser.parse_args()
    if args.product != "vietnamese":
        raise SystemExit(f"--product {args.product!r}: choose a site with --profile instead (site_profiles.SITES).")

    # "all" builds general first (it clears the other sites' dist/ subdirectories), then each site into its own.
    if args.site == "all":
        sites = SITE_IDS
    elif args.site == "all-vietnamese":
        sites = [s for s in SITE_IDS if SITES[s]["engine"] == "vietnamese"]
    else:
        sites = [args.site]
    for s in sites:
        assemble_site(s)


if __name__ == "__main__":
    main()
