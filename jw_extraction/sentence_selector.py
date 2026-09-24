# -*- coding: utf-8 -*-
"""
Learning sentence evaluator, scorer, and selector.
Separates raw corpus segments from high-value learning sentences and merges duplicates.
"""

from typing import List, Dict, Any
import json
from jw_extraction.models import CanonicalSegment, LearningSentence
from jw_extraction.normalization import normalize_text, normalize_key, compute_hash

class SentenceSelector:
    @staticmethod
    def consolidate_exact(records, prefix):
        """Source-backed GENERAL policy: full content AND context identity.

        JW's historical vi-only scoring/deduplication below remains unchanged.
        This policy also supports explicitly defined words and grammar records;
        no translation from a different sense/context can supplement a record.
        """
        grouped = {}
        for value, source in records:
            key = json.dumps(value, ensure_ascii=False, sort_keys=True)
            if key not in grouped:
                grouped[key] = dict(value, id=prefix + compute_hash(key), sources=[])
            if source not in grouped[key]["sources"]:
                grouped[key]["sources"].append(source)
        return list(grouped.values())

    def __init__(self, confirmed_word_keys: set = None, grammar_patterns: dict = None):
        self.confirmed_word_keys = confirmed_word_keys or set()
        self.grammar_patterns = grammar_patterns or {}

    def score_segment(self, segment: CanonicalSegment) -> float:
        vi = segment.texts.get("vi", "")
        if not vi:
            return -100.0

        words = vi.split()
        word_count = len(words)

        # Disqualify extremes
        if word_count < 4 or word_count > 45:
            return -50.0

        # Disqualify pure headings or metadata
        if segment.segmentType == "heading" or vi.isupper():
            return -30.0

        # Disqualify if no Korean or English translation available
        has_ko = bool(segment.texts.get("ko"))
        has_en = bool(segment.texts.get("en"))
        if not has_ko and not has_en:
            return -40.0

        score = 0.0

        # Optimal learning length: 7 to 25 words
        if 7 <= word_count <= 25:
            score += 20.0
        elif 5 <= word_count <= 35:
            score += 10.0

        # Complete sentence ending
        if vi.endswith(".") or vi.endswith("?") or vi.endswith("!"):
            score += 15.0

        # Dialogue bonus: practical conversational usefulness
        if segment.segmentType in ("dialogue", "sentence"):
            score += 10.0

        # Translation completeness bonus
        score += min(len(segment.texts) * 2.0, 16.0)

        return score

    def select_learning_sentences(self, segments: List[CanonicalSegment],
                                 min_score: float = 25.0,
                                 max_sentences: int = 500) -> List[LearningSentence]:
        """Evaluates segments and deduplicates identical Vietnamese sentences,
        merging their provenance references."""
        grouped: Dict[str, Dict[str, Any]] = {}

        for seg in segments:
            score = self.score_segment(seg)
            if score < min_score:
                continue

            vi_clean = normalize_text(seg.texts.get("vi", ""))
            vi_key = normalize_key(vi_clean)

            prov_item = {
                "documentId": seg.documentId,
                "segmentId": seg.id,
                "sourceType": seg.sourceType,
                "sectionId": seg.sectionId,
            }

            if vi_key not in grouped:
                grouped[vi_key] = {
                    "vi": vi_clean,
                    "translations": dict(seg.texts),
                    "provenance": [prov_item],
                    "score": score,
                    "segmentType": seg.segmentType,
                }
            else:
                # Merge provenance
                grouped[vi_key]["provenance"].append(prov_item)
                # Boost score for cross-source recurrence
                grouped[vi_key]["score"] += 15.0
                # Supplement any missing translations
                for lang, val in seg.texts.items():
                    if lang not in grouped[vi_key]["translations"]:
                        grouped[vi_key]["translations"][lang] = val

        result: List[LearningSentence] = []
        for vi_key, item in grouped.items():
            sid = f"sent_{compute_hash(item['vi'])}"
            ls = LearningSentence(
                id=sid,
                vi=item["vi"],
                translations=item["translations"],
                provenance=item["provenance"],
                vocabHits=[],
                grammarHits=[],
                score=item["score"],
            )
            result.append(ls)

        # Sort deterministically by score descending
        result.sort(key=lambda s: -s.score)
        return result[:max_sentences]
