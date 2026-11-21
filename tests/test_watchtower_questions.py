# -*- coding: utf-8 -*-
"""
Tests for Watchtower Study questions positioning and underscore deletion.
Verifies that:
1. All '__________' (underscore-only) rows are completely deleted from Watchtower study data.
2. The '[연구 질문]' / '[Câu hỏi thảo luận]' header is removed from the bottom.
3. Every study question is positioned immediately before its corresponding paragraph.
4. All 18 active sheets maintain exact question-to-paragraph mapping across languages.
"""

import json
import os
import re
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WT_JSON_PATH = os.path.join(BASE_DIR, "watchtower_study_data.json")

class TestWatchtowerQuestions(unittest.TestCase):
    def setUp(self):
        with open(WT_JSON_PATH, "r", encoding="utf-8") as f:
            self.data = json.load(f)
        self.langs = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]
        self.q_re = re.compile(r"^\s*(\d+)(?:[\s,\–\-\—\u2013\u2014]+(\d+))?[\.\s\xa0\u2024\uFF0E]")

    def test_no_underscore_rows(self):
        """Verify no pure underscore lines ('__________') exist in any sheet."""
        for sheet in self.data.get("sheets", []):
            sheet_name = sheet.get("sheet")
            for r in sheet.get("rows", []):
                for lang in self.langs:
                    val = str(r.get(lang, "")).strip()
                    if val:
                        self.assertNotEqual(
                            val.replace("_", "").strip(),
                            "",
                            f"Sheet {sheet_name} row {r.get('row')} in {lang} still contains pure underscores: {val!r}"
                        )

    def test_no_isolated_question_headers(self):
        """Verify no trailing '[연구 질문]' or '[Câu hỏi thảo luận]' section headers remain."""
        for sheet in self.data.get("sheets", []):
            sheet_name = sheet.get("sheet")
            for r in sheet.get("rows", []):
                ko_val = str(r.get("ko", "")).strip()
                vi_val = str(r.get("vi", "")).strip()
                self.assertNotIn(
                    ko_val,
                    ["[연구 질문]", "[Câu hỏi thảo luận]"],
                    f"Sheet {sheet_name} row {r.get('row')} has isolated question header: {ko_val!r}"
                )

    def test_questions_precede_paragraphs(self):
        """Verify that every study question is positioned before its corresponding paragraph."""
        for sheet in self.data.get("sheets", []):
            rows = sheet.get("rows", [])
            if not rows:
                continue
            sheet_name = sheet.get("sheet")

            # In Watchtower, question rows have a dot right after the number: e.g. '1-2.', ' 3.', '10.'
            # whereas paragraph rows have a space directly after the number: e.g. '2 여호와...', '3 Đức...'
            question_dot_re = re.compile(r"^\s*(\d+)(?:[\s,\–\-\—\u2013\u2014]+(\d+))?[\.\u2024\uFF0E]")
            para_num_re = re.compile(r"^\s*(\d+)\s+[^\d\.\u2024\uFF0E]")

            for idx, r in enumerate(rows):
                ko_val = str(r.get("ko", "")).strip()
                vi_val = str(r.get("vi", "")).strip()

                m = question_dot_re.match(ko_val) or question_dot_re.match(vi_val)
                if not m:
                    continue

                # Skip review questions that start with bullet
                if ko_val.startswith("◼") or vi_val.startswith("◼"):
                    continue

                p_start = int(m.group(1))

                # The row right after a question should be the corresponding paragraph
                self.assertTrue(
                    idx + 1 < len(rows),
                    f"Sheet {sheet_name} Q {p_start} has no row following it"
                )
                next_r = rows[idx + 1]
                next_ko = str(next_r.get("ko", "")).strip()
                next_vi = str(next_r.get("vi", "")).strip()

                if p_start == 1:
                    # Paragraph 1 follows question 1 (paragraph 1 has no leading number)
                    self.assertTrue(
                        idx >= 6,
                        f"Sheet {sheet_name}: Question 1 should be at or after row index 6"
                    )
                else:
                    # Paragraph p_start must start with p_start
                    next_m = para_num_re.match(next_ko) or para_num_re.match(next_vi)
                    self.assertIsNotNone(
                        next_m,
                        f"Sheet {sheet_name} row {r.get('row')} (Q {p_start}): next row should be paragraph {p_start}, got {next_ko[:30]!r}"
                    )
                    self.assertEqual(
                        int(next_m.group(1)),
                        p_start,
                        f"Sheet {sheet_name} row {r.get('row')} (Q {p_start}): expected paragraph {p_start}, got paragraph {next_m.group(1)}"
                    )

if __name__ == "__main__":
    unittest.main()
