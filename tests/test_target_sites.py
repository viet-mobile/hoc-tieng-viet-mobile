"""Target-language sites (site_profiles.SITES engine "target"): metadata, content isolation and
row provenance, checked on the built data blocks (run build_app.py --profile all first)."""
import json
import re
import unittest
from pathlib import Path

from site_profiles import SITES, TARGET_LANGUAGES, TARGET_CONTENT_SOURCES, UI_LANGS, data_block_name

ROOT = Path(__file__).resolve().parents[1]


def consts(site):
    text = (ROOT / data_block_name(site)).read_text(encoding="utf-8")
    return {m[1]: m[2] for m in re.finditer(r"^const ([A-Za-z_$][\w$]*) = (.*);$", text, re.MULTILINE)}


class TargetSiteTests(unittest.TestCase):
    def test_registry(self):
        self.assertEqual(len(SITES), 14)
        for sid in ("general", "jw", "jeonju", "ulsan"):
            self.assertEqual(SITES[sid]["engine"], "vietnamese")
            self.assertEqual(SITES[sid]["target_language"], "vi")
        dirs = [m["output_dir"] for m in SITES.values()]
        domains = [m["domain"] for m in SITES.values()]
        self.assertEqual(len(dirs), len(set(dirs)))
        self.assertEqual(len(domains), len(set(domains)))

    def test_vietnamese_blocks_have_no_target_engine_data(self):
        for sid, meta in SITES.items():
            if meta["engine"] == "vietnamese":
                self.assertNotIn("TARGET_SITE", consts(sid), sid)

    def test_target_blocks(self):
        for sid, meta in SITES.items():
            if meta["engine"] != "target":
                continue
            c = consts(sid)
            # Only target-engine constants: none of the Vietnamese app's data ships.
            self.assertTrue(all(name.startswith("TARGET_") for name in c), (sid, sorted(c)))
            site = json.loads(c["TARGET_SITE"])
            field = TARGET_LANGUAGES[meta["target_language"]]["scripts"][meta["target_script"]]["field"]
            self.assertEqual(site["field"], field)
            for source_id in meta["content_sources"]:
                self.assertEqual(TARGET_CONTENT_SOURCES[source_id]["family"], meta["family"], sid)
            if meta["family"] == "general":
                # No GENERAL-family source exists in the target languages: nothing ships, all is SOURCE REQUIRED.
                self.assertEqual(c["TARGET_CORPUS"], "[]", sid)
                self.assertIn("reader", site["sourceRequired"])
                continue
            for source_id in meta["content_sources"]:
                corpus = json.loads(c["TARGET_CORPUS_" + source_id.upper()])
                self.assertTrue(corpus["units"], (sid, source_id))
                for unit in corpus["units"]:
                    for row in unit["rows"]:
                        self.assertTrue(row.get(field), (sid, source_id, unit["id"]))
                        self.assertLessEqual(set(row) - {"who"}, set(UI_LANGS))
            ui = json.loads(c["TARGET_UI_TEXT"])
            for key, texts in ui.items():
                self.assertEqual(set(texts), set(UI_LANGS), key)

    def test_source_meta_is_complete_and_separate(self):
        from target_sources import TARGET_SOURCE_META
        for sid, meta in TARGET_SOURCE_META.items():
            labels = meta["label"] or meta["official"]
            self.assertEqual(set(labels), set(UI_LANGS), sid)
            self.assertTrue(all(v.strip() for v in labels.values()), sid)
            self.assertTrue(set(meta["official"]) <= set(UI_LANGS), sid)
        for sid, meta in SITES.items():
            if meta["engine"] != "target" or not meta["content_sources"]:
                continue
            c = consts(sid)
            shipped = json.loads(c["TARGET_SOURCE_META"])
            self.assertEqual(list(shipped), meta["content_sources"], sid)
            for source_id in meta["content_sources"]:
                corpus = json.loads(c["TARGET_CORPUS_" + source_id.upper()])
                # Source names live only in TARGET_SOURCE_META: the content constant carries no name/label
                # field (an article's own title in its "head" rows is source text, not a source name).
                self.assertEqual(set(corpus), {"id", "provenance", "units"})
                for unit in corpus["units"]:
                    self.assertEqual(set(unit), {"id", "head", "rows"}, (sid, source_id))

    def test_branding(self):
        from site_profiles import BRAND_ICON_FILES
        for sid, meta in SITES.items():
            out = ROOT / meta["output_dir"]
            html = (out / "index.html").read_text(encoding="utf-8")
            manifest = json.loads((out / "manifest.webmanifest").read_text(encoding="utf-8"))
            if meta["engine"] == "vietnamese":
                # The Vietnamese sites keep their own logo, theme and manifest icon.
                self.assertIn('href="assets/hoc-tieng-viet-logo.png"', html, sid)
                self.assertIn('<meta name="theme-color" content="#00613F">', html, sid)
                self.assertEqual(manifest["icons"][0]["src"], "assets/hoc-tieng-viet-logo.png", sid)
                self.assertFalse((out / "brand").exists(), sid)
                continue
            brand = meta["brand"]
            self.assertNotIn("hoc-tieng-viet-logo", html, sid)
            # Branding remnants of the Vietnamese sites (the shared UI-text table may still hold the words
            # "học tiếng Việt" inside ordinary Vietnamese sentences, which is not branding).
            self.assertNotIn('alt="học tiếng Việt"', html, sid)
            self.assertNotIn('class="brand-logo"', html, sid)
            self.assertFalse((out / "assets" / "hoc-tieng-viet-logo.png").exists(), sid)
            self.assertIn("<title>%s</title>" % meta["title"], html)
            self.assertIn('<link rel="icon" type="image/svg+xml" href="brand/%s">' % BRAND_ICON_FILES["svg"], html)
            self.assertIn('<link rel="apple-touch-icon" sizes="180x180" href="brand/%s">' % BRAND_ICON_FILES["apple"], html)
            self.assertIn('<meta name="theme-color" content="%s">' % brand["color"], html)
            self.assertEqual(manifest["name"], meta["title"])
            self.assertEqual(manifest["short_name"], brand["short_name"])
            self.assertEqual(manifest["theme_color"], brand["color"])
            self.assertEqual(manifest["start_url"], "/")
            for icon in manifest["icons"]:
                self.assertTrue((out / icon["src"]).exists(), (sid, icon["src"]))
            for name in BRAND_ICON_FILES.values():
                self.assertEqual((out / "brand" / name).read_bytes(), (ROOT / brand["dir"] / name).read_bytes(), (sid, name))
            # No Worker, no D1 client on a target site.
            self.assertFalse((out / "_worker.js").exists(), sid)
            self.assertNotIn("/api/regional/", html, sid)

    def test_word_order_only_with_a_safe_tokenizer(self):
        for sid, meta in SITES.items():
            if meta["engine"] == "target":
                safe = TARGET_LANGUAGES[meta["target_language"]]["tokenizer"] != "none"
                self.assertEqual("word_order" in meta["features"], safe and bool(meta["content_sources"]), sid)


if __name__ == "__main__":
    unittest.main()
