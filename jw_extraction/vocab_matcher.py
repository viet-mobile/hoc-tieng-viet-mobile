# -*- coding: utf-8 -*-
"""
Vocabulary expression matcher and candidate discoverer.
Matches segments against existing UNIFIED_WORDS and queues recurring unknown expressions.
"""

import re
from typing import List, Dict, Set, Tuple
from collections import Counter
from jw_extraction.models import CanonicalSegment, VocabularyOccurrence, Candidate
from jw_extraction.normalization import normalize_key, build_word_regex, VN_LETTERS, compute_hash

STOP_SYLLABLES = {
    "và", "của", "có", "trong", "các", "những", "cho", "với", "để", "không", "một", "người",
    "được", "là", "đã", "khi", "thì", "sẽ", "đang", "về", "như", "ra", "vào", "ở", "lại",
    "này", "đó", "kia", "gì", "ai", "sao", "nào", "rồi", "lên", "đi", "đến", "từ"
}

class VocabMatcher:
    def __init__(self, confirmed_words: List[Dict]):
        # confirmed_words: list of dicts from UNIFIED_WORDS
        self.confirmed_words_map = {normalize_key(w["vi"]): w for w in confirmed_words if w.get("vi")}
        # Precompile patterns for all confirmed words
        self.word_patterns = [
            (w_key, build_word_regex(w_key), w_obj)
            for w_key, w_obj in sorted(self.confirmed_words_map.items(), key=lambda x: -len(x[0]))
        ]

    def match_segment(self, segment: CanonicalSegment, source_label: str) -> List[VocabularyOccurrence]:
        vi_text = segment.texts.get("vi", "")
        if not vi_text:
            return []

        occurrences = []
        vi_lower = vi_text.lower()

        # Match against confirmed words
        for w_key, pat, w_obj in self.word_patterns:
            if w_key in vi_lower:
                match = pat.search(vi_text)
                if match:
                    occurrences.append(VocabularyOccurrence(
                        wordVi=w_obj["vi"],
                        segmentId=segment.id,
                        documentId=segment.documentId,
                        sourceType=segment.sourceType,
                        sourceLabel=source_label,
                    ))

        return occurrences

    def discover_candidates(self, segments: List[CanonicalSegment],
                            min_occurrences: int = 6,
                            min_docs: int = 3,
                            max_candidates: int = 300) -> List[Candidate]:
        """Discovers unknown recurring multi-syllable collocations (2-3 syllables)
        that appear across multiple documents and queues them as PENDING_REVIEW.
        Prunes to top recurring candidates to keep review queue manageable and compact."""
        ngram_occurrences: Dict[str, List[Tuple[CanonicalSegment, str]]] = {}

        token_re = re.compile(r'[' + VN_LETTERS + r']+(?:-[' + VN_LETTERS + r']+)*')

        for seg in segments:
            vi = seg.texts.get("vi", "")
            if not vi:
                continue

            tokens = token_re.findall(vi)
            tokens_lower = [t.lower() for t in tokens]

            # Generate 2-gram and 3-gram candidate expressions
            for n in [2, 3]:
                for i in range(len(tokens_lower) - n + 1):
                    gram_tokens = tokens_lower[i:i + n]

                    # Skip if all tokens are stop words
                    if all(t in STOP_SYLLABLES for t in gram_tokens):
                        continue
                    # Skip if starts or ends with stop words
                    if gram_tokens[0] in STOP_SYLLABLES and gram_tokens[-1] in STOP_SYLLABLES:
                        continue

                    phrase = " ".join(gram_tokens)
                    # Skip if already a confirmed word
                    if phrase in self.confirmed_words_map:
                        continue

                    if phrase not in ngram_occurrences:
                        ngram_occurrences[phrase] = []
                    ngram_occurrences[phrase].append((seg, vi))

        candidates = []
        for phrase, occ_list in ngram_occurrences.items():
            doc_ids = {s.documentId for s, _ in occ_list}
            if len(occ_list) >= min_occurrences and len(doc_ids) >= min_docs:
                cid = f"cand_word_{compute_hash(phrase)}"
                first_seg, first_vi = occ_list[0]

                # Sample occurrences (up to 3 compact samples)
                sample_occs = [
                    {
                        "documentId": s.documentId,
                        "segmentId": s.id,
                        "sourceType": s.sourceType,
                        "sampleVi": text[:90].strip(),
                    }
                    for s, text in occ_list[:3]
                ]

                # Sample contextual snippets from first segment if available
                sample_context = {
                    lang: val[:80].strip()
                    for lang, val in first_seg.texts.items()
                    if lang in ("ko", "en", "zh") and val
                }

                cand = Candidate(
                    id=cid,
                    type="word",
                    vi=phrase,
                    translations={},
                    sampleContext=sample_context,
                    occurrences=sample_occs,
                    evidence={
                        "occurrenceCount": len(occ_list),
                        "documentCount": len(doc_ids),
                        "sampleSources": sorted(list(doc_ids))[:3],
                    },
                    status="PENDING_REVIEW"
                )
                candidates.append(cand)

        # Sort candidates deterministically by occurrence count descending, then alphabetical
        candidates.sort(key=lambda c: (-c.evidence["occurrenceCount"], -c.evidence["documentCount"], c.vi))
        if max_candidates and len(candidates) > max_candidates:
            candidates = candidates[:max_candidates]
        return candidates
