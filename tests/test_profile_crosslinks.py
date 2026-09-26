# -*- coding: utf-8 -*-
"""
Automated unit tests for Profile Cross-Links and LFF Regression Criteria.
Verifies:
1. site_profiles.py configuration (exact URLs and cross_link text).
2. Profile isolation across GENERAL, JW, and JEONJU builds.
3. LFF defect regression criteria (0 ' a ' defects, 8/8 lookup strings matched, etc.).
"""

import unittest
import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from site_profiles import SITE_TITLES
import lff_data


class TestProfileCrossLinks(unittest.TestCase):
    def test_general_cross_link_config(self):
        general_title = SITE_TITLES["general"]
        self.assertIn("cross_link", general_title)
        cross_link = general_title["cross_link"]
        self.assertEqual(cross_link["url"], "https://jw.hoc.tieng.viet.mobile")
        self.assertEqual(cross_link.get("text"), "JW?")

    def test_jw_cross_link_config(self):
        jw_title = SITE_TITLES["jw"]
        self.assertIn("cross_link", jw_title)
        cross_link = jw_title["cross_link"]
        self.assertEqual(cross_link["url"], "https://jeonju.hoc.tieng.viet.mobile")
        self.assertEqual(cross_link.get("text"), "전주 학습반?")
        self.assertTrue(cross_link.get("ko_only"))
        self.assertEqual(cross_link["extra_links"], [{"url": "https://ulsan.hoc.tieng.viet.mobile", "text": "울산 학습반?"}])

    def test_jeonju_cross_link_config(self):
        jeonju_title = SITE_TITLES["jeonju"]
        self.assertIn("cross_link", jeonju_title)
        cross_link = jeonju_title["cross_link"]
        self.assertEqual(cross_link["url"], "https://jeonju.hoc.tieng.viet.mobile/admin")
        self.assertEqual(cross_link.get("text"), "관리자?")
        self.assertEqual(jeonju_title["h1"], "2026-2027 전주 베트남어 학습반")

    def test_ulsan_cross_link_config(self):
        ulsan_title = SITE_TITLES["ulsan"]
        self.assertIn("cross_link", ulsan_title)
        cross_link = ulsan_title["cross_link"]
        self.assertEqual(cross_link["url"], "https://ulsan.hoc.tieng.viet.mobile/admin")
        self.assertEqual(cross_link.get("text"), "관리자?")
        self.assertEqual(ulsan_title["h1"], "2026-2027 울산 베트남어 학습반")
        self.assertEqual(ulsan_title["title"], "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027")
        self.assertEqual(ulsan_title["host"], "ulsan.hoc.tieng.viet.mobile")
        canonical_langs = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]
        for lang in canonical_langs:
            self.assertEqual(ulsan_title["h1_by_lang"][lang], "2026-2027 울산 베트남어 학습반")
            self.assertEqual(ulsan_title["title_by_lang"][lang], "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027")

    def test_built_dist_files_isolation(self):
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        from tests.site_bundle import read_site_bundle
        general_html = read_site_bundle("general")
        jw_html = read_site_bundle("jw")
        jeonju_html = read_site_bundle("jeonju")
        ulsan_html = read_site_bundle("ulsan")

        for html_text, name in [(general_html, "general"), (jw_html, "jw"), (jeonju_html, "jeonju"), (ulsan_html, "ulsan")]:
            # Old footer text must be completely absent in all profiles
            self.assertNotIn("Built by combining extended Vietnamese-dialogue training", html_text)
            self.assertNotIn("형제·자매 베트남어 대화 확장훈련", html_text)
            # Topbar must NOT contain the cross-link
            topbar_chunk = html_text[html_text.find('<div class="topbar">'):html_text.find('<div class="tabbar">')]
            self.assertNotIn("site-cross-link", topbar_chunk, f"{name} topbar contains site-cross-link")
            # Exactly one language dropdown, no 12-button row
            self.assertEqual(html_text.count('id="lang-select"'), 1, f"{name} does not have exactly 1 #lang-select")
            self.assertNotIn('class="lang-btn"', html_text, f"{name} contains .lang-btn")
            self.assertNotIn('class="lang-switch-buttons"', html_text, f"{name} contains .lang-switch-buttons")

        # GENERAL check: has cross link to jw with text "JW?", does NOT have link to jeonju or ulsan
        self.assertIn('id="site-cross-link"', general_html)
        self.assertIn('href="https://jw.hoc.tieng.viet.mobile"', general_html)
        self.assertIn('>JW?</a>', general_html)
        self.assertNotIn('href="https://jeonju.hoc.tieng.viet.mobile"', general_html)
        self.assertNotIn('href="https://ulsan.hoc.tieng.viet.mobile"', general_html)
        self.assertNotIn("JEONJU_INFO", general_html)
        self.assertNotIn("JEONJU_WEEKS", general_html)
        self.assertNotIn("ULSAN_INFO", general_html)
        self.assertNotIn("ULSAN_WEEKS", general_html)

        # JW check: Korean-only footer links to the jeonju and ulsan class sites
        self.assertIn('id="site-cross-link"', jw_html)
        self.assertIn('href="https://jeonju.hoc.tieng.viet.mobile"', jw_html)
        self.assertIn('전주 학습반?', jw_html)
        self.assertIn('href="https://ulsan.hoc.tieng.viet.mobile"', jw_html)
        self.assertIn('울산 학습반?', jw_html)
        self.assertNotIn("JEONJU_INFO", jw_html)
        self.assertNotIn("JEONJU_WEEKS", jw_html)
        self.assertNotIn("ULSAN_INFO", jw_html)
        self.assertNotIn("ULSAN_WEEKS", jw_html)

        # JEONJU check: has cross link to jeonju admin with text "관리자?"
        self.assertIn('id="site-cross-link"', jeonju_html)
        self.assertIn('href="https://jeonju.hoc.tieng.viet.mobile/admin"', jeonju_html)
        self.assertIn('관리자?', jeonju_html)
        self.assertIn('2026-2027 전주 베트남어 학습반', jeonju_html)
        self.assertIn("JEONJU_INFO", jeonju_html)
        self.assertIn("JEONJU_WEEKS", jeonju_html)
        self.assertNotIn("ULSAN_INFO", jeonju_html)
        self.assertNotIn("ULSAN_WEEKS", jeonju_html)

        # ULSAN check: has cross link to ulsan admin with text "관리자?"
        self.assertIn('id="site-cross-link"', ulsan_html)
        self.assertIn('href="https://ulsan.hoc.tieng.viet.mobile/admin"', ulsan_html)
        self.assertIn('관리자?', ulsan_html)
        self.assertIn('2026-2027 울산 베트남어 학습반', ulsan_html)
        self.assertIn("ULSAN_INFO", ulsan_html)
        self.assertIn("ULSAN_WEEKS", ulsan_html)
        self.assertNotIn("JEONJU_INFO", ulsan_html)
        self.assertNotIn("JEONJU_WEEKS", ulsan_html)

    def test_language_dropdown_display_order(self):
        import re
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        expected_order = [
            ("ko", "한국어"),
            ("ja", "日本語"),
            ("zh", "繁體中文"),
            ("zh_cn", "简体中文"),
            ("cs", "Čeština"),
            ("de", "Deutsch"),
            ("en", "English"),
            ("fr", "Français"),
            ("id", "Indonesia"),
            ("hu", "Magyar"),
            ("pl", "Polski"),
            ("vi", "Tiếng Việt"),
        ]
        files_to_check = [
            os.path.join(root_dir, "template.html"),
            os.path.join(root_dir, "dist", "index.html"),
            os.path.join(root_dir, "dist", "jw", "index.html"),
            os.path.join(root_dir, "dist", "jeonju", "index.html"),
            os.path.join(root_dir, "dist", "ulsan", "index.html"),
        ]
        for fpath in files_to_check:
            with open(fpath, encoding="utf-8") as f:
                content = f.read()
            m = re.search(r'<select id="lang-select"[^>]*>(.*?)</select>', content, re.DOTALL)
            self.assertIsNotNone(m, f"Could not find #lang-select in {fpath}")
            opts = re.findall(r'<option value="([^"]+)"[^>]*>([^<]+)</option>', m.group(1))
            self.assertEqual(opts, expected_order, f"Language dropdown options mismatch in {fpath}")

    def test_lff_regression_integrity(self):
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        with open(os.path.join(root_dir, "app_logic.js"), encoding="utf-8") as f:
            app_js = f.read()

        # 1. 'tiên tri báo trước' in app_logic.js, not 'tiên tri a báo trước'
        self.assertIn("tiên tri báo trước", app_js)
        self.assertNotIn("tiên tri a báo trước", app_js)

        # 2. All 8 lffDisplayLines lookup conditions match lff_data.py
        keys = [
            "Kinh Thánh hứa trong tương lai “sẽ không còn sự chết",
            "Nhiều người hy vọng những điều tốt đẹp sẽ đến",
            "Kinh Thánh không chỉ giải thích tại sao thế giới",
            "Kinh Thánh khẳng định những gì được ghi",
            "Kinh Thánh có những lời tiên tri báo trước",
            "Lịch sử chứng thực rằng vua của Ba Tư",
            "Kinh Thánh cho biết chúng ta đang sống trong “những ngày sau cùng”",
            "Chúng ta có thể “tôn kính Đức Giê-hô-va bằng những điều quý báu của [mình]”"
        ]
        all_lff_vi_lines = [line["vi"] for conv in lff_data.LFF_CONVERSATIONS for line in conv["lines"]]
        matches = 0
        for k in keys:
            found = any(k in line for line in all_lff_vi_lines)
            if found:
                matches += 1
            self.assertTrue(found, f"Key '{k}' not found in lff_data.py")
        self.assertEqual(matches, 8, "Expected all 8 lffDisplayLines keys to match lff_data.py")

        # 3. Full Excel-derived dataset [행복한 삶을 영원히(전체)] NOT modified
        lff_json_path = os.path.join(root_dir, "enjoy_life_forever_data.json")
        self.assertTrue(os.path.exists(lff_json_path))
        with open(lff_json_path, encoding="utf-8") as f:
            data = json.load(f)
            self.assertEqual(data.get("sheet_count"), 72)
            self.assertEqual(data.get("source_excel"), "Enjoy Life Forever(4).xlsx")

    def test_language_columns_canonical_metadata(self):
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        expected_cols = {
            "A": "vi",
            "B": "cs",
            "C": "zh_cn",
            "D": "zh",
            "E": "en",
            "F": "fr",
            "G": "de",
            "H": "hu",
            "I": "id",
            "J": "ja",
            "K": "ko",
            "L": "pl"
        }
        for fname in ["enjoy_life_forever_data.json", "love_people_data.json", "watchtower_study_data.json"]:
            path = os.path.join(root_dir, fname)
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            self.assertEqual(data.get("language_columns"), expected_cols, f"{fname} language_columns mismatch")

    def test_zh_cn_traditional_character_cleanup(self):
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        with open(os.path.join(root_dir, "app_logic.js"), encoding="utf-8") as f:
            lines = f.readlines()

        for line_no, line in enumerate(lines, 1):
            if line_no > 850:
                break
            if '"zh_cn":' in line or '"zh_cn" :' in line:
                idx_start = line.find('"zh_cn":')
                if idx_start == -1:
                    idx_start = line.find('"zh_cn" :')
                idx_zh = line.find('"zh":', idx_start)
                if idx_zh == -1:
                    idx_zh = line.find('"zh" :', idx_start)
                segment = line[idx_start:idx_zh] if idx_zh != -1 else line[idx_start:]
                self.assertNotIn("時", segment, f"Found traditional '時' in zh_cn at L{line_no}")
                self.assertNotIn("著", segment, f"Found traditional particle '著' in zh_cn at L{line_no}")

    def test_lff_footnote_markers_stripped(self):
        target_ids = {
            "1102021214", "1102021219", "1102021221", "1102021223", "1102021232",
            "1102021243", "1102021244", "1102021250", "1102021256"
        }
        for conv in lff_data.LFF_CONVERSATIONS:
            cid = str(conv.get("id"))
            if cid in target_ids:
                for idx, line in enumerate(conv.get("lines", [])):
                    vi = line.get("vi", "")
                    self.assertFalse(
                        vi.endswith(" a") or vi.endswith(" a.") or vi.endswith(" a?") or vi.endswith(" a!"),
                        f"Found trailing footnote marker ' a' in ID {cid} line {idx}: {vi}"
                    )


if __name__ == "__main__":
    unittest.main()
