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

    def test_word_order_only_with_a_safe_tokenizer(self):
        for sid, meta in SITES.items():
            if meta["engine"] == "target":
                safe = TARGET_LANGUAGES[meta["target_language"]]["tokenizer"] != "none"
                self.assertEqual("word_order" in meta["features"], safe and bool(meta["content_sources"]), sid)


if __name__ == "__main__":
    unittest.main()
