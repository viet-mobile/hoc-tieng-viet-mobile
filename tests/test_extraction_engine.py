# -*- coding: utf-8 -*-
"""
Comprehensive automated test suite for the JW Learning Extraction Engine v1.
Validates:
1. Baseline Safety (SONG_MEANINGS = {}, 163 songs, WT 1-18 only)
2. Normalization & Segmentation Guardrails
3. Manifest & Idempotency (0 spurious changes on re-run)
4. Derived Data Integrity (vocab frequencies, grammar examples, learning sentences)
5. Review Queue Formatting (PENDING_REVIEW, pruned, deterministic ranking)
6. Zero-leakage into GENERAL Profile (JW_EXTRACTION_DATA = null in general)
7. Incremental Hashing & Change Detection
"""

import os
import sys
import json
import re
import unittest

# Ensure root directory is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from jw_extraction.normalization import normalize_text, compute_hash, build_word_regex
from jw_extraction.segmentation import split_prose_sentences
from jw_extraction.manifest import ManifestManager
from jw_extraction.grammar_registry import GrammarRegistry
from jw_extraction.models import SourceDocument, CanonicalSegment


class TestJWExtractionEngine(unittest.TestCase):

    def test_authoritative_baseline_safety(self):
        """Verifies that authoritative baseline constraints are strictly preserved:
        - SONGS_DATA = 163 songs
        - SONG_MEANINGS = {} (0 restored/invented annotations)
        - WATCHTOWER_FULL contains 18 sheets (1-18 only, 19-24 deferred)
        """
        # 1. Check song_meanings.js
        with open(os.path.join(BASE_DIR, "song_meanings.js"), "r", encoding="utf-8") as f:
            content = f.read().strip()
        self.assertIn("const SONG_MEANINGS = {};", content, "SONG_MEANINGS must remain empty object {}")

        # 2. Check songs_data.js
        with open(os.path.join(BASE_DIR, "songs_data.js"), "r", encoding="utf-8") as f:
            songs_js = f.read()
        match = re.search(r'const\s+SONGS_DATA\s*=\s*(\[.*\]);', songs_js, re.DOTALL)
        self.assertIsNotNone(match, "SONGS_DATA must be defined")
        songs = json.loads(match.group(1))
        self.assertEqual(len(songs), 163, "SONGS_DATA must contain exactly 163 songs")

        # 3. Check watchtower_study_data.json
        wt_path = os.path.join(BASE_DIR, "watchtower_study_data.json")
        self.assertTrue(os.path.exists(wt_path), "watchtower_study_data.json must exist")
        with open(wt_path, "r", encoding="utf-8") as f:
            wt_raw = json.load(f)
        active_sheets = [s for s in wt_raw.get("sheets", []) if s.get("rows")]
        self.assertEqual(len(active_sheets), 18, "WATCHTOWER_FULL must contain active sheets 1-18 only (19-24 deferred)")

    def test_normalization_and_segmentation(self):
        """Tests Vietnamese NFC normalization and sentence boundary rules."""
        raw_vn = "  Đây   là câu nói bằng tiếng Việt...   Nhưng   chưa hết!  "
        normalized = normalize_text(raw_vn)
        self.assertEqual(normalized, "Đây là câu nói bằng tiếng Việt... Nhưng chưa hết!")

        # Sentence segmentation with standard sentences
        text = "Đây là bài học đầu tiên. Bạn có hiểu bài này không? Hãy cố gắng học tập!"
        sentences = split_prose_sentences(text)
        self.assertEqual(len(sentences), 3)
        self.assertEqual(sentences[0], "Đây là bài học đầu tiên.")
        self.assertEqual(sentences[1], "Bạn có hiểu bài này không?")
        self.assertEqual(sentences[2], "Hãy cố gắng học tập!")

        # Word regex boundary
        rx = build_word_regex("nghe")
        self.assertIsNotNone(rx.search("Tôi muốn nghe lời dạy."))
        self.assertIsNone(rx.search("Tôi không nghi ngờ."))

    def test_manifest_and_idempotency(self):
        """Verifies that manifest tracks documents and detects 0 changes when unchanged."""
        manifest_path = os.path.join(BASE_DIR, "jw_extraction", "data", "extraction_manifest.json")
        self.assertTrue(os.path.exists(manifest_path), "Manifest file must exist")
        mgr = ManifestManager(data_dir=os.path.join(BASE_DIR, "jw_extraction", "data"))
        manifest_data = mgr.load_manifest()

        self.assertEqual(manifest_data["engineVersion"], "1.0.0")
        self.assertEqual(manifest_data["documentCount"], 291)
        self.assertEqual(manifest_data["segmentCount"], 11972)

        # Check diffing against real extracted documents from all adapters
        from jw_extraction.adapters import get_all_adapters
        adapters = get_all_adapters()
        extracted_docs = []
        for a in adapters:
            extracted_docs.extend(a.extract_documents())
        self.assertEqual(len(extracted_docs), 291, "Real extraction must yield 291 documents")

        new_docs, changed_docs, unchanged_docs, removed_ids = mgr.diff_documents(extracted_docs)
        self.assertEqual(len(new_docs), 0, "No new documents should be detected on unchanged corpus")
        self.assertEqual(len(changed_docs), 0, "No changed documents should be detected on unchanged corpus")
        self.assertEqual(len(removed_ids), 0, "No removed documents should be detected on unchanged corpus")
        self.assertEqual(len(unchanged_docs), 291, "All 291 real documents must match manifest hashes")

    def test_derived_jw_data_structure(self):
        """Verifies derived_jw_data.json integrity and constraints."""
        derived_path = os.path.join(BASE_DIR, "jw_extraction", "data", "derived_jw_data.json")
        self.assertTrue(os.path.exists(derived_path), "derived_jw_data.json must exist")
        with open(derived_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertIn("vocabFrequencies", data)
        self.assertIn("grammarExamples", data)
        self.assertIn("learningSentences", data)

        # Vocab frequencies
        self.assertGreater(len(data["vocabFrequencies"]), 1000)
        sample_freq = data["vocabFrequencies"].get("nghe")
        self.assertIsNotNone(sample_freq)
        self.assertIn("totalOccurrences", sample_freq)
        self.assertIn("documentCount", sample_freq)
        self.assertIn("bySourceType", sample_freq)

        # Grammar examples
        self.assertGreater(len(data["grammarExamples"]), 20)
        sample_g = data["grammarExamples"].get("da")
        self.assertIsNotNone(sample_g)
        self.assertGreater(len(sample_g), 0)
        self.assertIn("vi", sample_g[0])
        self.assertIn("translations", sample_g[0])
        self.assertIn("sourceType", sample_g[0])

        # Learning sentences
        self.assertEqual(len(data["learningSentences"]), 300)
        first_sent = data["learningSentences"][0]
        self.assertIn("id", first_sent)
        self.assertIn("vi", first_sent)
        self.assertIn("provenance", first_sent)
        self.assertGreater(len(first_sent["provenance"]), 0)
        self.assertGreater(first_sent["score"], 0)

    def test_review_queue_formatting(self):
        """Verifies pending candidates queue format and threshold pruning."""
        review_path = os.path.join(BASE_DIR, "jw_extraction", "review", "pending_word_candidates.json")
        self.assertTrue(os.path.exists(review_path), "pending_word_candidates.json must exist")
        with open(review_path, "r", encoding="utf-8") as f:
            candidates = json.load(f)

        self.assertLessEqual(len(candidates), 300, "Candidates must be pruned to top 300")
        for cand in candidates:
            self.assertEqual(cand["status"], "PENDING_REVIEW")
            self.assertEqual(cand["type"], "word")
            self.assertIn("evidence", cand)
            self.assertGreaterEqual(cand["evidence"]["occurrenceCount"], 6)
            self.assertGreaterEqual(cand["evidence"]["documentCount"], 3)

        # File size must be under 1MB
        size = os.path.getsize(review_path)
        self.assertLess(size, 1024 * 1024, "pending_word_candidates.json must be under 1MB")

    def test_profile_zero_leakage_into_general(self):
        """Verifies that GENERAL profile contains 0 JW extracted data."""
        general_js_path = os.path.join(BASE_DIR, "data_block.general.js")
        self.assertTrue(os.path.exists(general_js_path), "data_block.general.js must exist")
        with open(general_js_path, "r", encoding="utf-8") as f:
            general_content = f.read()

        # JW_EXTRACTION_DATA must be null in general
        self.assertIn("const JW_EXTRACTION_DATA = null;", general_content,
                      "JW_EXTRACTION_DATA must be null in GENERAL profile")

        # SONGS_DATA must be empty array in general
        self.assertIn("const SONGS_DATA = [];", general_content)
        self.assertIn("const SONG_MEANINGS = {};", general_content)

    def test_incremental_change_detection_fixture(self):
        """Creates a simulated test segment, validates that modifying it updates the hash
        and is identified by ManifestManager diff_documents."""
        mgr = ManifestManager(data_dir=os.path.join(BASE_DIR, "jw_extraction", "data"))
        doc1 = SourceDocument(
            id="test_simulated_doc_fixture",
            sourceType="watchtower",
            sourceId="test_article",
            title={"vi": "Test Article"},
            profile="jw",
            hash=compute_hash("ban đầu đức chúa trời dựng nên"),
            languages=["vi"],
            segments=[]
        )

        # Test 1: New document detected
        new_docs, changed_docs, unchanged_docs, removed_ids = mgr.diff_documents([doc1])
        self.assertEqual(len(new_docs), 1)
        self.assertEqual(new_docs[0].id, "test_simulated_doc_fixture")

        # Test 2: Modified document detected against simulated manifest (CHANGED classification)
        doc1_modified = SourceDocument(
            id="test_simulated_doc_fixture",
            sourceType="watchtower",
            sourceId="test_article",
            title={"vi": "Test Article"},
            profile="jw",
            hash=compute_hash("ban đầu đức chúa trời dựng nên trời và đất"),
            languages=["vi"],
            segments=[]
        )
        self.assertNotEqual(doc1.hash, doc1_modified.hash, "Hash must change when document text changes")

        import tempfile
        with tempfile.TemporaryDirectory() as tmpdir:
            test_mgr = ManifestManager(data_dir=tmpdir)
            test_mgr.save_manifest({
                "engineVersion": "1.0.0",
                "documentCount": 1,
                "segmentCount": 1,
                "documentHashes": {doc1.id: doc1.hash}
            })
            new_docs2, changed_docs2, unchanged_docs2, removed_ids2 = test_mgr.diff_documents([doc1_modified])
            self.assertEqual(len(changed_docs2), 1, "Modified document must be classified as CHANGED")
            self.assertEqual(changed_docs2[0].id, "test_simulated_doc_fixture")
            self.assertEqual(len(new_docs2), 0)
            self.assertEqual(len(unchanged_docs2), 0)


if __name__ == "__main__":
    unittest.main()
