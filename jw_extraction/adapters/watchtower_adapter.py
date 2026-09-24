# -*- coding: utf-8 -*-
"""
Adapter for Watchtower Study articles (Watchtower 1–18).
"""

import json
import os
from typing import List
from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.models import SourceDocument, CanonicalSegment

class WatchtowerAdapter(BaseSourceAdapter):
    def __init__(self, json_path: str = "watchtower_study_data.json"):
        self.json_path = json_path

    @property
    def source_type(self) -> str:
        return "watchtower"

    def extract_documents(self) -> List[SourceDocument]:
        if not os.path.exists(self.json_path):
            return []

        with open(self.json_path, "r", encoding="utf-8") as f:
            raw = json.load(f)

        docs = []
        for sheet in raw.get("sheets", []):
            rows = sheet.get("rows", [])
            if not rows:
                continue

            sheet_id = str(sheet.get("sheet", ""))
            try:
                week_num = int(sheet_id)
            except ValueError:
                week_num = 0

            # Document ID
            doc_id = f"wt_week_{week_num:02d}"

            # Extract title from row 3 if present, else row 1
            title_row = rows[2] if len(rows) > 2 else rows[0]
            title = {
                "vi": title_row.get("vi") or f"Tuần {week_num}",
                "ko": title_row.get("ko") or f"{week_num}주",
                "en": title_row.get("en") or f"Week {week_num}",
            }

            segments: List[CanonicalSegment] = []
            for idx, r in enumerate(rows):
                vi_text = (r.get("vi") or "").strip()
                if not vi_text:
                    continue

                # Classify segment type
                seg_type = "sentence"
                if vi_text.isupper() or len(vi_text) < 40 and not vi_text.endswith("."):
                    seg_type = "heading"
                elif vi_text.endswith("?"):
                    seg_type = "question"
                elif len(vi_text) > 150:
                    seg_type = "paragraph"

                row_texts = {lang: val for lang, val in r.items() if lang != "row" and isinstance(val, str) and val.strip()}
                seg = self.build_segment(
                    doc_id=doc_id,
                    order=idx + 1,
                    segment_type=seg_type,
                    texts=row_texts,
                    section_id=str(r.get("row", idx + 1))
                )
                segments.append(seg)

            doc = self.finalize_document(doc_id, title, segments)
            docs.append(doc)

        return docs
