"""Adapter for the existing six-book PDF text-layer extraction, never JW inputs.

Page topology is kept in metadata; shared canonical normalization is used for
indexing. No PDF binaries/parser or inferred bilingual alignment is introduced.
"""
import json
from pathlib import Path
from jw_extraction.adapters.base import BaseSourceAdapter
from jw_extraction.normalization import compute_hash

ROOT = Path(__file__).resolve().parents[2]


class GeneralPdfAdapter(BaseSourceAdapter):
    source_type = "general_vietnamese_pdf"

    def __init__(self, root=ROOT):
        self.root = Path(root)

    def extract_documents(self):
        corpus = json.loads((self.root / "vietnamese_pdf_corpus.json").read_text(encoding="utf-8"))
        sources = corpus["metadata"]["sources"]
        if len(sources) != len(set(sources)):
            raise ValueError("Duplicate PDF source declaration")
        pages = {}
        for page in corpus["pages"]:
            key = (page["source"], page["page"])
            if page["source"] not in sources or key in pages or not isinstance(page["page"], int) or page["page"] < 1 or not page["text"].strip():
                raise ValueError("Invalid/duplicate corpus page: " + str(key))
            pages[key] = page
        category_pages = {}
        for kind, filename in [("grammar", "grammar_from_pdfs.json"), ("dialogue", "daily_conversations.json"), ("culture", "vietnam_culture_from_pdfs.json")]:
            records = json.loads((self.root / filename).read_text(encoding="utf-8"))["items"]
            candidates = {(p["source"], p["page"]): p for p in records}
            if len(candidates) != len(records) or any(k not in pages or p["text"] != pages[k]["text"] for k, p in candidates.items()):
                raise ValueError(kind + " candidate references do not match authoritative corpus")
            category_pages[kind] = candidates
        documents = []
        for source in sources:
            doc_id = "general_pdf_" + compute_hash(source)
            segments = []
            for page in sorted((p for p in pages.values() if p["source"] == source), key=lambda p: p["page"]):
                seg = self.build_segment(doc_id, page["page"], "page", {"original": page["text"]}, "page:" + str(page["page"]))
                seg.metadata = {"file": source, "page": page["page"], "original": page["text"],
                                **{kind + "Candidate": (source, page["page"]) in candidates for kind, candidates in category_pages.items()}}
                if "lesson" in page:
                    seg.metadata["lesson"] = page["lesson"]
                seg.hash = compute_hash(json.dumps(seg.to_dict(), ensure_ascii=False, sort_keys=True))
                segments.append(seg)
            doc = self.finalize_document(doc_id, {"original": source}, segments, ["vi", "ko"], profile="general")
            # Unlike a monolingual JW index, raw layout, glosses and category signals
            # all affect this adapter's output and therefore its incremental hash.
            doc.hash = compute_hash(json.dumps([s.to_dict() for s in segments], ensure_ascii=False, sort_keys=True))
            documents.append(doc)
        return documents
