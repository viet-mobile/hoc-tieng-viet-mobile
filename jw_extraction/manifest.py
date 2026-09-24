# -*- coding: utf-8 -*-
"""
Extraction manifest and incremental state manager.
Tracks document content hashes to support deterministic incremental updates.
"""

import json
import os
from typing import Dict, List, Tuple
from jw_extraction.models import SourceDocument

MANIFEST_FILENAME = "extraction_manifest.json"

class ManifestManager:
    def __init__(self, data_dir: str = "jw_extraction/data"):
        self.data_dir = data_dir
        self.manifest_path = os.path.join(data_dir, MANIFEST_FILENAME)

    def load_manifest(self) -> Dict:
        if not os.path.exists(self.manifest_path):
            return {}
        try:
            with open(self.manifest_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def save_manifest(self, manifest_data: Dict):
        os.makedirs(self.data_dir, exist_ok=True)
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest_data, f, ensure_ascii=False, indent=2)

    def diff_documents(self, current_docs: List[SourceDocument]) -> Tuple[List[SourceDocument], List[SourceDocument], List[SourceDocument], List[str]]:
        """Compares current documents with the saved manifest hashes.
        Returns:
            (new_docs, changed_docs, unchanged_docs, removed_doc_ids)
        """
        manifest = self.load_manifest()
        old_hashes = manifest.get("documentHashes", {})

        current_doc_ids = {d.id for d in current_docs}
        old_doc_ids = set(old_hashes.keys())

        new_docs = []
        changed_docs = []
        unchanged_docs = []

        for d in current_docs:
            if d.id not in old_hashes:
                new_docs.append(d)
            elif old_hashes[d.id] != d.hash:
                changed_docs.append(d)
            else:
                unchanged_docs.append(d)

        removed_doc_ids = list(old_doc_ids - current_doc_ids)

        return new_docs, changed_docs, unchanged_docs, removed_doc_ids
