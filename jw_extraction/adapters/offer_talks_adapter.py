# -*- coding: utf-8 -*-
"""
Adapter for Offer Talks (제공 연설).
"""

from typing import List
from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.models import SourceDocument, CanonicalSegment

class OfferTalksAdapter(BaseSourceAdapter):
    @property
    def source_type(self) -> str:
        return "offerTalks"

    def extract_documents(self) -> List[SourceDocument]:
        try:
            from offer_talks_data import OFFER_TALKS
        except ImportError:
            return []

        docs = []
        for talk in OFFER_TALKS:
            num = talk.get("number", 0)
            doc_id = f"offer_talk_{num:02d}"

            subtitle = talk.get("subtitle", {})
            title = subtitle if isinstance(subtitle, dict) else {"vi": f"Bài giảng {num}", "ko": f"제공 연설 {num}"}

            segments: List[CanonicalSegment] = []
            lines = talk.get("lines", [])

            for l_idx, line in enumerate(lines):
                vi_text = (line.get("vi") or "").strip()
                if not vi_text:
                    continue

                texts = {"vi": vi_text}
                kr = line.get("kr")
                if isinstance(kr, dict):
                    texts.update(kr)
                elif isinstance(kr, str) and kr:
                    texts["ko"] = kr

                seg = self.build_segment(
                    doc_id=doc_id,
                    order=l_idx + 1,
                    segment_type="dialogue",
                    texts=texts,
                    section_id=line.get("who", f"line_{l_idx + 1}")
                )
                segments.append(seg)

            doc = self.finalize_document(doc_id, title, segments)
            docs.append(doc)

        return docs
