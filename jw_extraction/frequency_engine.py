# -*- coding: utf-8 -*-
"""
Multi-dimensional, profile-aware frequency calculation engine.
Computes total occurrences, document counts, and by-source-type breakdowns.
"""

from typing import List, Dict, Any, Set
from collections import defaultdict
from jw_extraction.models import CanonicalSegment, VocabularyOccurrence
from jw_extraction.normalization import normalize_key

class FrequencyEngine:
    def __init__(self):
        pass

    def compute_vocab_frequencies(self, occurrences: List[VocabularyOccurrence]) -> Dict[str, Dict[str, Any]]:
        """Computes multi-dimensional frequency stats for each word:
        - totalOccurrences
        - documentCount
        - bySourceType: { 'watchtower': int, 'songs': int, ... }
        """
        stats: Dict[str, Dict[str, Any]] = {}
        doc_sets: Dict[str, Set[str]] = defaultdict(set)

        for occ in occurrences:
            key = normalize_key(occ.wordVi)
            if key not in stats:
                stats[key] = {
                    "totalOccurrences": 0,
                    "documentCount": 0,
                    "bySourceType": defaultdict(int),
                }

            stats[key]["totalOccurrences"] += 1
            doc_sets[key].add(occ.documentId)
            stats[key]["bySourceType"][occ.sourceType] += 1

        for key, s in stats.items():
            s["documentCount"] = len(doc_sets[key])
            s["bySourceType"] = dict(s["bySourceType"])

        return stats
