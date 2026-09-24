# -*- coding: utf-8 -*-
"""
Adapter for Neighbor Conversations (이웃 사람과의 대화 11편).
"""

from typing import List
from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.models import SourceDocument, CanonicalSegment

class NeighborDialogueAdapter(BaseSourceAdapter):
    @property
    def source_type(self) -> str:
        return "neighborDialogue"

    def extract_documents(self) -> List[SourceDocument]:
        try:
            from neighbor_conversations_data import NEIGHBOR_CONVERSATIONS
        except ImportError:
            return []

        docs = []
        for idx, conv in enumerate(NEIGHBOR_CONVERSATIONS):
            cid = conv.get("id") or str(idx + 1)
            doc_id = f"neighbor_dialogue_{cid}"

            raw_title = conv.get("title", {})
            title = raw_title if isinstance(raw_title, dict) else {"vi": str(raw_title)}

            segments: List[CanonicalSegment] = []
            lines = conv.get("lines", [])

            for l_idx, line in enumerate(lines):
                vi_text = (line.get("vi") or "").strip()
                if not vi_text:
                    continue

                line_texts = {lang: val for lang, val in line.items() if lang != "who" and isinstance(val, str) and val.strip()}
                seg = self.build_segment(
                    doc_id=doc_id,
                    order=l_idx + 1,
                    segment_type="dialogue",
                    texts=line_texts,
                    section_id=line.get("who", f"turn_{l_idx + 1}")
                )
                segments.append(seg)

            doc = self.finalize_document(doc_id, title, segments)
            docs.append(doc)

        return docs
