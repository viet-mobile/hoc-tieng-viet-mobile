# -*- coding: utf-8 -*-
"""
Adapter for 'Love People-Make Disciples' (사람들을 사랑하고 제자로).
Ingests love_people_data.json full 12-language rows.
"""

import json
import os
from typing import List
from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.models import SourceDocument, CanonicalSegment

class LovePeopleAdapter(BaseSourceAdapter):
    def __init__(self, json_path: str = "love_people_data.json"):
        self.json_path = json_path

    @property
    def source_type(self) -> str:
        return "lovePeople"

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

            sheet_name = str(sheet.get("sheet", "")).strip()
            safe_id = sheet_name.lower().replace(" ", "_")
            doc_id = f"lpd_sheet_{safe_id}"

            title = {
                "vi": f"Bài {sheet_name}" if sheet_name.isdigit() else sheet_name,
                "ko": f"{sheet_name}과" if sheet_name.isdigit() else sheet_name,
            }

            segments: List[CanonicalSegment] = []
            for idx, r in enumerate(rows):
                vi_text = (r.get("vi") or "").strip()
                if not vi_text:
                    continue

                seg_type = "sentence"
                if vi_text.isupper() or len(vi_text) < 30 and not vi_text.endswith("."):
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
