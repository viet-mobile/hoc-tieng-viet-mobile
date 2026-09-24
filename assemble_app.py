import argparse
import json
from pathlib import Path
import shutil

from site_html import strip_site_html
from site_profiles import SITE_TITLES, NON_JW_HTML_REMOVALS


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
            f'</div>'
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
    return json.dumps(base, ensure_ascii=False, indent=2)


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
    ]
    if info.get("h1_by_lang"):
        parts.append(f"var SITE_H1_BY_LANG = {json.dumps(info['h1_by_lang'], ensure_ascii=False)};")
    if info.get("title_by_lang"):
        parts.append(f"var SITE_TITLE_BY_LANG = {json.dumps(info['title_by_lang'], ensure_ascii=False)};")
    if info.get("cross_link"):
        parts.append(f"var SITE_CROSS_LINK = {json.dumps(info['cross_link'], ensure_ascii=False)};")
    return "\n".join(parts)


def assemble_site(site):
    tpl = open("template.html", encoding="utf-8").read()
    data_js_path = "data_block.js" if site == "jw" else f"data_block.{site}.js"
    data_js = open(data_js_path, encoding="utf-8").read()
    app_js = open("app_logic.js", encoding="utf-8").read()

    out = tpl.replace("__DATA_JS__", data_js, 1)
    out = out.replace("__APP_JS__", build_site_identity_prelude(site) + "\n" + app_js, 1)

    # GENERAL is the only slim profile -- JW and JEONJU both keep the full JW-profile HTML
    # (JEONJU = JW's complete feature set + its own event layer, not general + event).
    removal_counts = {}
    if site == "general":
        out, removal_counts = strip_site_html(out, NON_JW_HTML_REMOVALS)
        out = apply_general_label_overrides(out)

    out = apply_site_identity(out, site)

    out_html_name = "app.html" if site == "jw" else f"app.{site}.html"
    open(out_html_name, "w", encoding="utf-8").write(out)

    # dist/ layout follows DOMAIN_MAP's meaning, not build-CLI legacy defaults: GENERAL is
    # hoc.tieng.viet.mobile's own content (bare dist/), JW and JEONJU are the two subdomains
    # (dist/jw/, dist/jeonju/). Source/data are never duplicated per profile -- only this
    # deployment-artifact directory differs; see site_profiles.DOMAIN_MAP.
    dist_dir = Path("dist") if site == "general" else Path("dist") / site
    dist_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(out_html_name, dist_dir / "index.html")
    shutil.copytree("assets", dist_dir / "assets", dirs_exist_ok=True)
    open(dist_dir / "manifest.webmanifest", "w", encoding="utf-8").write(build_manifest(site))
    shutil.copyfile("_redirects", dist_dir / "_redirects")

    print(f"[{site}] app html bytes:", len(out))
    if removal_counts:
        print(f"[{site}] html removals:", removal_counts)
    print(f"[{site}] deployment artifact:", dist_dir / "index.html")


def main():
    from site_profiles import PRODUCTS

    parser = argparse.ArgumentParser()
    parser.add_argument("--product", choices=list(PRODUCTS.keys()), default="vietnamese",
                         help="Learning-content language/product (only 'vietnamese' is implemented).")
    parser.add_argument("--site", "--profile", dest="site", choices=["jw", "general", "jeonju", "all"], default="all",
                         help="Content profile to assemble: general | jw | jeonju | all (default: all). --site is kept "
                              "as an alias for --profile for backward compatibility.")
    args = parser.parse_args()
    if args.product != "vietnamese":
        raise SystemExit(f"--product {args.product!r} is architecture-ready only; no data/content "
                          f"exists for it in this repo (see site_profiles.PRODUCTS).")

    sites = ["general", "jw", "jeonju"] if args.site == "all" else [args.site]
    for s in sites:
        assemble_site(s)


if __name__ == "__main__":
    main()
