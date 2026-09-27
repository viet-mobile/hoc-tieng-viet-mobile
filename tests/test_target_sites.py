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
                        self.assertLessEqual(set(row) - {"who", "p", "s", "r"}, set(UI_LANGS))
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

    def test_sentence_level_records(self):
        from target_reference import CURATED_LANGS
        from target_content import BIBLE_BOOK_NAMES, _book_key
        """ELF/LPD/WT: one target sentence per record, checked by a detector independent of
        target_segment.py; a paragraph's translation is attached to all of its sentences or to none."""
        import re
        latin = re.compile(r"(?<!\b[A-Za-z])(?<!\bMr)(?<!\bMrs)(?<!\bDr)(?<!\bSt)(?<!\bvs)(?<!\bdll)[.?!][\"”’)\]]*\s+[\"“‘]?(?=[A-ZÀ-Ỹ])")
        # "ㄱ. …" / "a. …" list labels are not sentence ends.
        hangul = re.compile(r"(?<![ㄱ-ㅎA-Za-z])[.?!][\"”’)\]]*\s+[\"“‘]?(?=[가-힣])")
        cjk = re.compile(r"[。？！][」』”’]*(?=[^」』”’\s_]*[^\W\d_])")

        def boundaries(text, lang):
            # A leading question/paragraph label ("1. ", "6-7. ") is not a sentence end.
            t = re.sub(r"^\s*\d{1,3}(?:[-–]\d{1,3}|\.?,\s?\d{1,3})?[.．]\s*", "", text)
            for _ in range(3):
                t = re.sub(r"[（(《〈【][^()（）《》〈〉【】]{0,80}[)）》〉】][。.]?", "", t)
            if lang in ("zh", "ja"):
                return len(cjk.findall(t))
            return len(latin.findall(t)) + (len(hangul.findall(t)) if lang == "ko" else 0)

        for sid, meta in SITES.items():
            if meta["engine"] != "target" or not meta["content_sources"]:
                continue
            c = consts(sid)
            field = json.loads(c["TARGET_SITE"])["field"]
            for source_id in ("elf", "lpd", "wt"):
                corpus = json.loads(c["TARGET_CORPUS_" + source_id.upper()])
                multi = []
                for unit in corpus["units"]:
                    paragraphs = {}
                    for row in unit["rows"]:
                        self.assertIn("p", row)
                        self.assertIn("s", row)
                        # Reference-filled languages (target_reference.py) are curated ones and are present.
                        for lang in row.get("r", []):
                            self.assertIn(lang, CURATED_LANGS, (sid, unit["id"]))
                            self.assertIn(lang, row, (sid, unit["id"]))
                        # Rows that were only numbers or a Bible book name alone are gone.
                        self.assertTrue(any(ch.isalpha() for ch in row[field]), (sid, unit["id"], row[field]))
                        self.assertNotIn(_book_key(row[field]), BIBLE_BOOK_NAMES, (sid, unit["id"], row[field]))
                        if boundaries(row[field], field):
                            multi.append(row[field][:60])
                        paragraphs.setdefault(row["p"], []).append(row)
                    for rows in paragraphs.values():
                        self.assertEqual([r["s"] for r in rows], list(range(len(rows))), (sid, unit["id"]))
                        if len(rows) > 1:
                            # From the Excel pairing a paragraph's language is on all its sentences or on none;
                            # only reference-filled sentences ("r") may add it to single sentences.
                            for lang in UI_LANGS:
                                have = [lang in r and lang not in r.get("r", []) for r in rows]
                                self.assertIn(set(have), ({True}, {False}), (sid, unit["id"], lang))
                self.assertEqual(multi, [], (sid, source_id, multi[:3]))
            for source_id in ("songs", "neighbor"):
                corpus = json.loads(c["TARGET_CORPUS_" + source_id.upper()])
                self.assertFalse(any("p" in r for u in corpus["units"] for r in u["rows"]), (sid, source_id))

    def test_word_order_only_with_a_safe_tokenizer(self):
        for sid, meta in SITES.items():
            if meta["engine"] == "target":
                safe = TARGET_LANGUAGES[meta["target_language"]]["tokenizer"] != "none"
                self.assertEqual("word_order" in meta["features"], safe and bool(meta["content_sources"]), sid)


if __name__ == "__main__":
    unittest.main()
