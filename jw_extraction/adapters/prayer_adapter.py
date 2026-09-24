# -*- coding: utf-8 -*-
"""
Adapter for Prayer template.
"""

from typing import List
from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.models import SourceDocument, CanonicalSegment

class PrayerAdapter(BaseSourceAdapter):
    @property
    def source_type(self) -> str:
        return "prayer"

    def extract_documents(self) -> List[SourceDocument]:
        try:
            from offer_talks_data import PRAYER_TEMPLATE
        except ImportError:
            return []

        if not PRAYER_TEMPLATE or not isinstance(PRAYER_TEMPLATE, dict):
            return []

        doc_id = "prayer_template"
        title = {
            "vi": "Lời cầu nguyện mẫu",
            "ko": "기도 템플릿",
            "en": "Sample Prayer",
        }

        segments: List[CanonicalSegment] = []
        lines = PRAYER_TEMPLATE.get("lines", [])

        for idx, line in enumerate(lines):
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
                order=idx + 1,
                segment_type="sentence",
                texts=texts,
                section_id=f"p_{idx + 1}"
            )
            segments.append(seg)

        doc = self.finalize_document(doc_id, title, segments)
        return [doc]
