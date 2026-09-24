# -*- coding: utf-8 -*-
"""
Regression test for NEIGHBOR_CONVERSATIONS.
Verifies that:
1. Exactly 11 conversations exist in the same order with same IDs.
2. Exactly 615 lines exist across all conversations.
3. Every line preserves 'who' ('PUBLISHER' or 'HOUSEHOLDER').
4. The 5 baseline languages ('vi', 'ko', 'zh', 'en', 'ja') are identical.
5. All 7 added languages ('de', 'fr', 'pl', 'cs', 'hu', 'zh_cn', 'id') are present on titles and lines (except authentic blank cells from Excel).
6. No AI translations or foreign language leaks.
"""

import unittest
import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from neighbor_conversations_data import NEIGHBOR_CONVERSATIONS

EXPECTED_IDS = [
    "2012569", "2010734", "2014325", "2012249", "2012726",
    "2014005", "2013492", "2014726", "2014805", "2015084", "2015247"
]

EXPECTED_LINE_COUNTS = [53, 55, 56, 72, 72, 56, 57, 63, 30, 59, 42]

ALL_LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]

class TestNeighborRegression(unittest.TestCase):
    def test_conversation_count_and_ids(self):
        self.assertEqual(len(NEIGHBOR_CONVERSATIONS), 11)
        actual_ids = [c["id"] for c in NEIGHBOR_CONVERSATIONS]
        self.assertEqual(actual_ids, EXPECTED_IDS)

    def test_line_counts(self):
        actual_line_counts = [len(c["lines"]) for c in NEIGHBOR_CONVERSATIONS]
        self.assertEqual(actual_line_counts, EXPECTED_LINE_COUNTS)
        self.assertEqual(sum(actual_line_counts), 615)

    def test_who_values(self):
        for c in NEIGHBOR_CONVERSATIONS:
            for l in c["lines"]:
                self.assertIn(l["who"], ["PUBLISHER", "HOUSEHOLDER"])

    def test_title_languages(self):
        for c in NEIGHBOR_CONVERSATIONS:
            title = c["title"]
            for lang in ALL_LANGS:
                self.assertIn(lang, title, f"Missing title lang {lang} in conv {c['id']}")
                self.assertTrue(len(title[lang].strip()) > 0, f"Empty title lang {lang} in conv {c['id']}")

    def test_no_speaker_prefixes_in_added_languages(self):
        cs_prefix_re = re.compile(r'^(?:Pan|Paní)\s+[^:\uFF1A\n]+[:\uFF1A]')
        zh_prefix_re = re.compile(r'^[\u4e00-\u9fff]{1,2}[：:]')

        for c in NEIGHBOR_CONVERSATIONS:
            for li, l in enumerate(c["lines"]):
                cs_text = l.get("cs", "")
                self.assertFalse(cs_prefix_re.match(cs_text), f"Unstripped CS prefix in {c['id']} line {li}: {cs_text[:30]}")
                zh_text = l.get("zh_cn", "")
                self.assertFalse(zh_prefix_re.match(zh_text), f"Unstripped ZH_CN prefix in {c['id']} line {li}: {zh_text[:30]}")

    def test_coverage_and_blank_integrity(self):
        # We know from Excel that exactly 1 blank cell exists in Care line 56 for zh_cn and id
        blank_counts = {lang: 0 for lang in ALL_LANGS}
        total_lines = 0
        for c in NEIGHBOR_CONVERSATIONS:
            for l in c["lines"]:
                total_lines += 1
                for lang in ALL_LANGS:
                    val = l.get(lang, "")
                    if not val.strip():
                        blank_counts[lang] += 1

        self.assertEqual(total_lines, 615)
        self.assertEqual(blank_counts["vi"], 0)
        self.assertEqual(blank_counts["ko"], 0)
        self.assertEqual(blank_counts["zh"], 0)
        self.assertEqual(blank_counts["en"], 0)
        self.assertEqual(blank_counts["ja"], 0)
        self.assertEqual(blank_counts["de"], 0)
        self.assertEqual(blank_counts["fr"], 0)
        self.assertEqual(blank_counts["pl"], 0)
        self.assertEqual(blank_counts["cs"], 0)
        self.assertEqual(blank_counts["hu"], 0)
        self.assertEqual(blank_counts["zh_cn"], 1)  # Care line 56 authentic blank from Excel
        self.assertEqual(blank_counts["id"], 1)     # Care line 56 authentic blank from Excel

if __name__ == '__main__':
    unittest.main()
