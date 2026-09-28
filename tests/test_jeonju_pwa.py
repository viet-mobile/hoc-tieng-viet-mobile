# -*- coding: utf-8 -*-
"""JEONJU home-screen identity (site_profiles SITES["jeonju"]["pwa"], jeonju_icons.py, assemble_app.py) -- run
assemble_app.py --site all first:

- dist/jeonju/manifest.webmanifest: full name, a short launcher name, start_url / display / colours, and exactly
  the 192 + 512 "any" and 192 + 512 "maskable" icons, each an existing PNG of the declared pixel size;
- the maskable and apple-touch icons are opaque; the maskable icon keeps the logo inside the safe zone (80% circle);
- brand/jeonju/ is what jeonju_icons.py draws from the shared logo (no hand-edited or stale icon);
- dist/jeonju/index.html links the 180px apple-touch icon and names the iOS home-screen title;
- no other site picks any of this up: their manifests keep the shared 1254px logo or their own brand icons, and
  their heads carry no apple-mobile-web-app-title.
"""
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
os.chdir(ROOT)

from site_profiles import SITES, SITE_TITLES, PWA_ICON_FILES  # noqa: E402
import jeonju_icons  # noqa: E402

errors = []
checks = 0


def ok(cond, msg):
    global checks
    checks += 1
    if not cond:
        errors.append(msg)


pwa = SITES["jeonju"]["pwa"]
manifest = json.load(open("dist/jeonju/manifest.webmanifest", encoding="utf-8"))
ok(manifest["name"] == SITE_TITLES["jeonju"]["h1"], "name: %r" % manifest["name"])
ok(manifest["short_name"] == pwa["short_name"] and len(manifest["short_name"]) <= 8, "short_name: %r" % manifest["short_name"])
ok(manifest["start_url"] == "/" and manifest["display"] == "standalone", "start_url/display")
ok(manifest["theme_color"] == "#00613F" and manifest["background_color"] == "#F1F4EC", "colours unchanged")
want = [("brand/icon-192.png", "192x192", "any"), ("brand/icon-512.png", "512x512", "any"),
        ("brand/icon-maskable-192.png", "192x192", "maskable"), ("brand/icon-maskable-512.png", "512x512", "maskable")]
ok([(i["src"], i["sizes"], i["purpose"]) for i in manifest["icons"]] == want, "icons: %r" % manifest["icons"])
for icon in manifest["icons"]:
    path = os.path.join("dist/jeonju", icon["src"])
    ok(os.path.exists(path), "missing " + path)
    if os.path.exists(path):
        im = Image.open(path)
        ok(im.format == "PNG" and icon["type"] == "image/png", path + ": not a PNG")
        ok("%dx%d" % im.size == icon["sizes"], "%s: %dx%d, declared %s" % (path, im.size[0], im.size[1], icon["sizes"]))
        if icon["purpose"] == "maskable":
            ok(im.mode == "RGB", path + ": maskable icon must be opaque")

apple = Image.open("dist/jeonju/brand/" + PWA_ICON_FILES["apple"])
ok(apple.size == (180, 180) and apple.mode == "RGB", "apple-touch icon: %r %s" % (apple.size, apple.mode))

# Safe zone: the logo occupies MASKABLE_SCALE of the canvas; its drawing (text, hat, lotus, boat) lies within 40% of
# the logo size from the centre, so it stays inside the 80% circle as long as the scale is at most 1.
ok(jeonju_icons.MASKABLE_SCALE <= 0.8, "maskable scale %s" % jeonju_icons.MASKABLE_SCALE)
mask = Image.open("dist/jeonju/brand/" + PWA_ICON_FILES["maskable512"]).convert("RGB")
bg = tuple(int(jeonju_icons.BACKGROUND[i:i + 2], 16) for i in (1, 3, 5))
for x, y in ((0, 0), (511, 0), (0, 511), (511, 511), (255, 5), (5, 255)):
    ok(mask.getpixel((x, y)) == bg, "maskable edge pixel (%d,%d) is not the background" % (x, y))

# brand/jeonju is exactly what the generator draws from the current logo
before = {n: open(os.path.join("brand/jeonju", n), "rb").read() for n in PWA_ICON_FILES.values()}
jeonju_icons.build()
for name, data in before.items():
    ok(open(os.path.join("brand/jeonju", name), "rb").read() == data, "brand/jeonju/%s differs from jeonju_icons.py output" % name)

head = open("dist/jeonju/index.html", encoding="utf-8").read()[:4000]
ok('<link rel="apple-touch-icon" sizes="180x180" href="brand/icon-180.png">' in head, "jeonju apple-touch icon link")
ok('<meta name="apple-mobile-web-app-title" content="%s">' % pwa["apple_title"] in head, "jeonju apple-mobile-web-app-title")
ok('<link rel="manifest" href="manifest.webmanifest">' in head, "jeonju manifest link")

# Only JEONJU
for site, meta in SITES.items():
    if site == "jeonju" or not os.path.exists(os.path.join(meta["output_dir"], "manifest.webmanifest")):
        continue
    m = json.load(open(os.path.join(meta["output_dir"], "manifest.webmanifest"), encoding="utf-8"))
    h = open(os.path.join(meta["output_dir"], "index.html"), encoding="utf-8").read()[:4000]
    srcs = [i["src"] for i in m["icons"]]
    if meta.get("brand"):
        ok(srcs == ["brand/icon-192.png", "brand/icon-512.png", "brand/icon.svg"], site + ": brand icons changed %r" % srcs)
    else:
        ok(srcs == ["assets/hoc-tieng-viet-logo.png"], site + ": icons changed %r" % srcs)
        ok(m["short_name"] == SITE_TITLES[site]["h1"][:12], site + ": short_name changed %r" % m["short_name"])
        ok('<link rel="apple-touch-icon" href="assets/hoc-tieng-viet-logo.png">' in h, site + ": apple-touch link changed")
    ok("apple-mobile-web-app-title" not in h, site + ": has apple-mobile-web-app-title")
    ok(not os.path.exists(os.path.join(meta["output_dir"], "brand", "icon-maskable-512.png")), site + ": JEONJU icons copied")

print("checks run: %d" % checks)
if errors:
    print("\n".join("FAIL: " + e for e in errors))
    sys.exit(1)
print("--- JEONJU PWA TESTS PASSED ---")
