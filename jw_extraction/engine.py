# -*- coding: utf-8 -*-
"""
JW Learning Extraction Engine - CLI and Pipeline Orchestrator.
Supports --rebuild, --incremental, --dry-run, and --validate.
"""

import os
import sys
import json
import argparse
from typing import Dict, List, Any

from jw_extraction.adapters import get_all_adapters
from jw_extraction.grammar_registry import GrammarRegistry
from jw_extraction.vocab_matcher import VocabMatcher
from jw_extraction.sentence_selector import SentenceSelector
from jw_extraction.frequency_engine import FrequencyEngine
from jw_extraction.manifest import ManifestManager
from jw_extraction.models import SourceDocument, CanonicalSegment

DATA_DIR = "jw_extraction/data"
REVIEW_DIR = "jw_extraction/review"

class ExtractionEngine:
    def __init__(self, data_dir: str = DATA_DIR, review_dir: str = REVIEW_DIR, profile: str = "jw"):
        if profile not in ("jw", "general"):
            raise ValueError("Unknown extraction profile: " + profile)
        self.profile = profile
        if profile == "general" and data_dir == DATA_DIR:
            data_dir = os.path.join(DATA_DIR, "general")
        self.data_dir = data_dir
        self.review_dir = review_dir
        self.manifest_mgr = ManifestManager(data_dir=data_dir)
        self.grammar_registry = GrammarRegistry() if profile == "jw" else None
        self.frequency_engine = FrequencyEngine()

    def get_confirmed_words(self) -> List[Dict]:
        """Loads confirmed words from UNIFIED_WORDS in data_block.js or directly from builder."""
        data_block_path = "data_block.js"
        if os.path.exists(data_block_path):
            import re
            content = open(data_block_path, encoding="utf-8").read()
            m = re.search(r'const UNIFIED_WORDS = (\[.*?\]);\s*\n', content, re.DOTALL)
            if m:
                try:
                    return json.loads(m.group(1))
                except Exception:
                    pass

        # Fallback to direct builder
        from unified_words_builder import build_unified_words
        import build_app
        return build_unified_words(
            "jw", build_app.BASIC_WORD_GROUPS, build_app.freq_vocab,
            build_app.vocab_theo, build_app.BIBLE_NAMES, build_app.RHYME_GROUPS,
            build_app.WORD_ORDER_REVERSED_EXTRA, build_app.vocab_groups,
            build_app.ANTONYM_PAIRS, build_app.USER_NEW_WORDS, ""
        )

    def extract_all_documents(self) -> List[SourceDocument]:
        docs = []
        for adapter in get_all_adapters(self.profile):
            docs.extend(adapter.extract_documents())
        return docs

    def run_pipeline(self, mode: str = "rebuild") -> Dict[str, Any]:
        """Runs the extraction pipeline in 'rebuild', 'incremental', or 'dry-run' mode."""
        if self.profile == "general":
            return self.run_general_pipeline(mode)
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.review_dir, exist_ok=True)

        all_docs = self.extract_all_documents()
        all_segments: List[CanonicalSegment] = []
        for d in all_docs:
            all_segments.extend(d.segments)

        new_docs, changed_docs, unchanged_docs, removed_ids = self.manifest_mgr.diff_documents(all_docs)

        if mode == "dry-run":
            return {
                "mode": "dry-run",
                "totalDocuments": len(all_docs),
                "totalSegments": len(all_segments),
                "newDocuments": [d.id for d in new_docs],
                "changedDocuments": [d.id for d in changed_docs],
                "unchangedDocuments": len(unchanged_docs),
                "removedDocuments": removed_ids,
            }

        # For incremental, if nothing changed, preserve existing derived data
        if mode == "incremental" and not new_docs and not changed_docs and not removed_ids:
            manifest = self.manifest_mgr.load_manifest()
            if manifest:
                print("[JW Engine] Incremental check: All documents are up to date. (0 delta)")
                return manifest

        print(f"[JW Engine] Running {mode}: {len(all_docs)} documents, {len(all_segments)} segments...")

        confirmed_words = self.get_confirmed_words()
        vocab_matcher = VocabMatcher(confirmed_words)

        # 1. Match Vocabulary Occurrences
        all_vocab_occurrences = []
        for seg in all_segments:
            occs = vocab_matcher.match_segment(seg, source_label=seg.sourceId)
            all_vocab_occurrences.extend(occs)

        # 2. Compute Multi-Dimensional Frequencies
        vocab_frequencies = self.frequency_engine.compute_vocab_frequencies(all_vocab_occurrences)

        # 3. Match Grammar Occurrences
        all_grammar_occurrences = []
        for seg in all_segments:
            g_occs = self.grammar_registry.match_segment(seg, source_label=seg.sourceId)
            all_grammar_occurrences.extend(g_occs)

        # Group grammar examples by patternId
        grammar_examples_by_pattern = {}
        for g in all_grammar_occurrences:
            if g.patternId not in grammar_examples_by_pattern:
                grammar_examples_by_pattern[g.patternId] = []
            if len(grammar_examples_by_pattern[g.patternId]) < 10:  # Cap at top 10 examples per pattern
                grammar_examples_by_pattern[g.patternId].append(g.to_dict())

        # Also alias by canonical pattern name for convenient UI lookups
        for p_id, p_obj in self.grammar_registry.patterns.items():
            if p_id in grammar_examples_by_pattern and p_obj.canonical_name:
                grammar_examples_by_pattern[p_obj.canonical_name] = grammar_examples_by_pattern[p_id]

        # 4. Select Curated Learning Sentences
        sentence_selector = SentenceSelector()
        learning_sentences = sentence_selector.select_learning_sentences(all_segments, min_score=25.0, max_sentences=300)

        # 5. Discover Candidates
        word_candidates = vocab_matcher.discover_candidates(all_segments, min_occurrences=6, min_docs=3, max_candidates=300)

        # Save Derived Indexes
        derived_data = {
            "version": "1.0.0",
            "documentCount": len(all_docs),
            "segmentCount": len(all_segments),
            "vocabOccurrenceCount": len(all_vocab_occurrences),
            "grammarOccurrenceCount": len(all_grammar_occurrences),
            "learningSentenceCount": len(learning_sentences),
            "vocabFrequencies": vocab_frequencies,
            "grammarExamples": grammar_examples_by_pattern,
            "learningSentences": [s.to_dict() for s in learning_sentences],
        }

        with open(os.path.join(self.data_dir, "derived_jw_data.json"), "w", encoding="utf-8") as f:
            json.dump(derived_data, f, ensure_ascii=False, indent=2)

        # Save Candidate Queues
        with open(os.path.join(self.review_dir, "pending_word_candidates.json"), "w", encoding="utf-8") as f:
            json.dump([c.to_dict() for c in word_candidates], f, ensure_ascii=False, indent=2)

        with open(os.path.join(self.review_dir, "pending_grammar_candidates.json"), "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)  # Initial queue

        # Save Manifest
        manifest_data = {
            "engineVersion": "1.0.0",
            "documentCount": len(all_docs),
            "segmentCount": len(all_segments),
            "vocabularyOccurrenceCount": len(all_vocab_occurrences),
            "grammarOccurrenceCount": len(all_grammar_occurrences),
            "learningSentenceCount": len(learning_sentences),
            "candidateCounts": {
                "word": len(word_candidates),
                "grammar": 0,
            },
            "documentHashes": {d.id: d.hash for d in all_docs},
        }
        self.manifest_mgr.save_manifest(manifest_data)

        print(f"[JW Engine] Finished {mode}:")
        print(f"  - Documents: {len(all_docs)}")
        print(f"  - Segments: {len(all_segments)}")
        print(f"  - Vocab Occurrences: {len(all_vocab_occurrences)}")
        print(f"  - Grammar Occurrences: {len(all_grammar_occurrences)}")
        print(f"  - Learning Sentences: {len(learning_sentences)}")
        print(f"  - New Word Candidates: {len(word_candidates)}")

        return manifest_data

    def validate(self) -> Dict[str, Any]:
        """Runs validation checks across sources, segments, occurrences, and profiles."""
        if self.profile == "general":
            try:
                with open(os.path.join(self.data_dir, "derived_general_data.json"), encoding="utf-8") as f:
                    output = json.load(f)
                return self.validate_general_output(output)
            except (OSError, ValueError, KeyError, TypeError) as exc:
                return {"isValid": False, "errors": [str(exc)], "warnings": []}
        errors = []
        warnings = []

        all_docs = self.extract_all_documents()
        doc_ids = set()
        seg_ids = set()

        for d in all_docs:
            if d.id in doc_ids:
                errors.append(f"Duplicate document ID: {d.id}")
            doc_ids.add(d.id)

            for s in d.segments:
                if s.id in seg_ids:
                    errors.append(f"Duplicate segment ID: {s.id}")
                seg_ids.add(s.id)

        # Check derived data if exists
        derived_path = os.path.join(self.data_dir, "derived_jw_data.json")
        if os.path.exists(derived_path):
            with open(derived_path, "r", encoding="utf-8") as f:
                derived = json.load(f)

            # Check grammar pattern IDs or canonical names
            valid_pattern_keys = set(self.grammar_registry.patterns.keys()) | {
                p.canonical_name for p in self.grammar_registry.patterns.values() if p.canonical_name
            }
            for p_id in derived.get("grammarExamples", {}):
                if p_id not in valid_pattern_keys:
                    errors.append(f"Unregistered grammar pattern ID in derived data: {p_id}")

            # Check learning sentences
            for s in derived.get("learningSentences", []):
                for prov in s.get("provenance", []):
                    if prov.get("segmentId") not in seg_ids:
                        errors.append(f"Orphan segmentId in sentence provenance: {prov.get('segmentId')}")

        # Check GENERAL profile isolation
        data_block_gen = "data_block.general.js"
        if os.path.exists(data_block_gen):
            gen_content = open(data_block_gen, encoding="utf-8").read()
            if "JW_EXTRACTION_DATA" in gen_content and "JW_EXTRACTION_DATA = null" not in gen_content and "JW_EXTRACTION_DATA = {}" not in gen_content:
                # verify it doesn't contain populated jw extraction data
                import re
                m = re.search(r'const JW_EXTRACTION_DATA = (.*?);\n', gen_content)
                if m and len(m.group(1).strip()) > 10:
                    errors.append("Profile leakage: JW_EXTRACTION_DATA is populated in data_block.general.js")

        is_valid = len(errors) == 0
        return {
            "isValid": is_valid,
            "errors": errors,
            "warnings": warnings,
            "totalDocumentsChecked": len(all_docs),
            "totalSegmentsChecked": len(seg_ids),
        }

    def general_output(self, documents=None):
        from pathlib import Path
        from jw_extraction.general_policy import classify_documents
        from jw_extraction.normalization import compute_hash
        documents = self.extract_all_documents() if documents is None else documents
        if any(d.profile != "general" or d.sourceType != "general_vietnamese_pdf" for d in documents):
            raise ValueError("Non-GENERAL source supplied to GENERAL extraction")
        data, coverage = classify_documents(documents)
        code_files = ["engine.py", "models.py", "normalization.py", "sentence_selector.py", "general_policy.py",
                      "adapters/base.py", "adapters/general_pdf_adapter.py"]
        code = "".join((Path(__file__).parent / name).read_text(encoding="utf-8") for name in code_files)
        return {"version": "general-pdf-1", "profile": "general", "pipelineHash": compute_hash(code),
                "documentHashes": {d.id: d.hash for d in documents},
                "documentCount": len(documents), "segmentCount": sum(len(d.segments) for d in documents),
                "segments": [{"id": s.id, "documentId": d.id, "sourceType": s.sourceType,
                              "sectionId": s.sectionId, "hash": s.hash,
                              "file": s.metadata["file"], "page": s.metadata["page"]}
                             for d in documents for s in d.segments],
                "learningData": data, "coverage": coverage}

    def validate_general_output(self, output, expected=None):
        """Extend the engine validator with source-backed GENERAL record checks.

        Reconstructing deterministic expected output verifies text, IDs, context,
        all provenance references and classification, not just schema presence.
        """
        errors = []
        try:
            expected = self.general_output() if expected is None else expected
            if output != expected:
                errors.append("GENERAL output differs from authoritative sources/current extraction policy")
            if output.get("profile") != "general":
                errors.append("Invalid GENERAL profile")
            data = output.get("learningData", {})
            if set(data) != {"words", "sentences", "grammar"}:
                errors.append("Invalid learning category")
            ids = set()
            segments = {s["id"]: s for s in expected["segments"]}
            from site_profiles import RELIGIOUS_FILTER_TERMS
            for kind, rows in data.items():
                for row in rows:
                    if row.get("id") in ids:
                        errors.append("Duplicate learning ID: " + str(row.get("id")))
                    ids.add(row.get("id"))
                    if row.get("category") != kind or row.get("profile") != "general":
                        errors.append("Invalid record category/profile")
                    if not isinstance(row.get("original" if kind == "grammar" else "vi"), str) or not row.get("original" if kind == "grammar" else "vi", "").strip():
                        errors.append("Empty required learning text")
                    if not row.get("sources"):
                        errors.append("Missing provenance")
                    for source in row.get("sources", []):
                        segment = segments.get(source.get("segmentId"))
                        if not segment or any(source.get(k) != segment.get(k) for k in ("documentId", "sourceType", "file", "page")):
                            errors.append("Invalid source/segment reference")
                    text = json.dumps({k: v for k, v in row.items() if k != "sources"}, ensure_ascii=False).casefold()
                    if any(term.casefold() in text for term in RELIGIOUS_FILTER_TERMS):
                        errors.append("JW_ONLY/religious content in GENERAL record")
        except (KeyError, TypeError, ValueError, AttributeError) as exc:
            errors.append("Malformed GENERAL output: " + str(exc))
        return {"isValid": not errors, "errors": errors, "warnings": [],
                "totalDocumentsChecked": expected["documentCount"] if expected else 0,
                "totalSegmentsChecked": expected["segmentCount"] if expected else 0}

    def load_general_output(self):
        path = os.path.join(self.data_dir, "derived_general_data.json")
        with open(path, encoding="utf-8") as f:
            output = json.load(f)
        result = self.validate_general_output(output)
        if not result["isValid"]:
            raise ValueError("Run python -B -m jw_extraction.engine --profile general --rebuild: " + "; ".join(result["errors"]))
        return output

    def run_general_pipeline(self, mode):
        documents = self.extract_all_documents()
        output = self.general_output(documents)
        result = self.validate_general_output(output, expected=self.general_output(documents))
        if not result["isValid"]:
            raise ValueError("; ".join(result["errors"]))
        new, changed, unchanged, removed = self.manifest_mgr.diff_documents(documents)
        summary = {"profile": "general", "mode": mode, "totalDocuments": len(documents),
                   "totalSegments": output["segmentCount"], "newDocuments": [d.id for d in new],
                   "changedDocuments": [d.id for d in changed], "unchangedDocuments": len(unchanged),
                   "removedDocuments": sorted(removed),
                   "counts": {k: {a: v[a] for a in ("raw", "normalized", "duplicates", "final")} for k, v in output["coverage"].items() if k != "inventory"}}
        path = os.path.join(self.data_dir, "derived_general_data.json")
        serialized = json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        from pathlib import Path
        current = Path(path).read_text(encoding="utf-8") if Path(path).exists() else None
        summary["outputChanged"] = current != serialized
        if mode == "dry-run":
            return summary
        if mode == "incremental" and current == serialized and not new and not changed and not removed:
            return summary
        os.makedirs(self.data_dir, exist_ok=True)
        Path(path).write_text(serialized, encoding="utf-8")
        self.manifest_mgr.save_manifest({"engineVersion": output["version"], "profile": "general",
                                        "pipelineHash": output["pipelineHash"], "documentHashes": output["documentHashes"]})
        print(json.dumps(summary, ensure_ascii=False, indent=2))
        return summary

def main():
    parser = argparse.ArgumentParser(description="JW Learning Extraction Engine CLI")
    parser.add_argument("--profile", choices=["jw", "general"], default="jw", help="Isolated source/output profile (default: jw)")
    parser.add_argument("--rebuild", action="store_true", help="Perform a full rebuild of all derived indexes")
    parser.add_argument("--incremental", action="store_true", help="Incrementally update new or changed sources")
    parser.add_argument("--dry-run", action="store_true", help="Report what would change without modifying derived data")
    parser.add_argument("--validate", action="store_true", help="Run comprehensive data integrity and profile isolation validation")
    args = parser.parse_args()

    engine = ExtractionEngine(profile=args.profile)

    if args.validate:
        res = engine.validate()
        print(json.dumps(res, ensure_ascii=False, indent=2))
        sys.exit(0 if res["isValid"] else 1)

    if args.dry_run:
        res = engine.run_pipeline(mode="dry-run")
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return

    if args.incremental:
        engine.run_pipeline(mode="incremental")
        return

    # Default to rebuild if --rebuild or no args provided
    engine.run_pipeline(mode="rebuild")

if __name__ == "__main__":
    main()
