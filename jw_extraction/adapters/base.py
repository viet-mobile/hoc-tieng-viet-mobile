# -*- coding: utf-8 -*-
"""
Base adapter interface for JW source materials.
"""

from abc import ABC, abstractmethod
from typing import List, Dict
from jw_extraction.models import SourceDocument, CanonicalSegment
from jw_extraction.normalization import compute_hash, normalize_text

class BaseSourceAdapter(ABC):
    @property
    @abstractmethod
    def source_type(self) -> str:
        """Returns the identifier for this source type."""
        pass

    @abstractmethod
    def extract_documents(self) -> List[SourceDocument]:
        """Extracts and normalizes all available documents of this source type."""
        pass

    def build_segment(self, doc_id: str, order: int, segment_type: str,
                      texts: Dict[str, str], section_id: str = "") -> CanonicalSegment:
        """Helper to create a CanonicalSegment with deterministic ID and hash."""
        seg_id = f"{doc_id}_s{order:04d}"
        clean_texts = {k: normalize_text(v) for k, v in texts.items() if v and normalize_text(v)}
        vi_text = clean_texts.get("vi", "")
        seg_hash = compute_hash(vi_text) if vi_text else ""
        return CanonicalSegment(
            id=seg_id,
            sourceType=self.source_type,
            sourceId=doc_id,
            documentId=doc_id,
            sectionId=section_id,
            order=order,
            segmentType=segment_type,
            texts=clean_texts,
            hash=seg_hash,
        )

    def finalize_document(self, doc_id: str, title: Dict[str, str],
                          segments: List[CanonicalSegment],
                          languages: List[str] = None, profile: str = "jw") -> SourceDocument:
        """Helper to create a SourceDocument with hash computed over its segments."""
        if languages is None:
            languages = sorted(list({lang for seg in segments for lang in seg.texts.keys()}))

        # Deterministic document hash over its Vietnamese segment texts
        joined_vi = "\n".join(s.texts.get("vi", "") for s in segments)
        doc_hash = compute_hash(f"{doc_id}:{joined_vi}")

        return SourceDocument(
            id=doc_id,
            sourceType=self.source_type,
            sourceId=doc_id,
            title={k: normalize_text(v) for k, v in title.items()},
            profile=profile,
            hash=doc_hash,
            languages=languages,
            segments=segments,
        )
