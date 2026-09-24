# -*- coding: utf-8 -*-
"""
Adapter for Kingdom Songs (Songs 1–163).
Consumes authoritative lyric lines directly without prose segmentation.
"""

import json
import re
import os
from typing import List
from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.models import SourceDocument, CanonicalSegment

class SongsAdapter(BaseSourceAdapter):
    def __init__(self, js_path: str = "songs_data.js"):
        self.js_path = js_path

    @property
    def source_type(self) -> str:
        return "songs"

    def extract_documents(self) -> List[SourceDocument]:
        if not os.path.exists(self.js_path):
            return []

        content = open(self.js_path, "r", encoding="utf-8").read()
        m = re.search(r'const SONGS_DATA = (\[.*?\]);\s*\n', content, re.DOTALL)
        if not m:
            return []

        songs_raw = json.loads(m.group(1))
        docs = []

        for song in songs_raw:
            s_num = song.get("number", 0)
            doc_id = f"song_{s_num:03d}"

            title = song.get("title", {})
            if isinstance(title, str):
                title = {"vi": title}

            segments: List[CanonicalSegment] = []
            lines = song.get("lines", [])

            for idx, line in enumerate(lines):
                vi_text = (line.get("vi") or "").strip()
                if not vi_text:
                    continue

                line_texts = {lang: val for lang, val in line.items() if isinstance(val, str) and val.strip()}
                seg = self.build_segment(
                    doc_id=doc_id,
                    order=idx + 1,
                    segment_type="lyric",
                    texts=line_texts,
                    section_id=f"line_{idx + 1}"
                )
                segments.append(seg)

            doc = self.finalize_document(doc_id, title, segments)
            docs.append(doc)

        return docs
