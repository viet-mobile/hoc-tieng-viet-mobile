"""Compatibility/build projection only. Extraction lives in jw_extraction.engine.

No parser, normalization, classification, or output-writing CLI is maintained here.
"""
from jw_extraction.adapters.general_pdf_adapter import ROOT
from jw_extraction.normalization import normalize_text as normalize


def build_general_pdf():
    from jw_extraction.engine import ExtractionEngine
    output = ExtractionEngine(profile="general").load_general_output()
    return output["learningData"], output["coverage"]


def merge_pdf_words(words, pdf_words):
    """Merge only identical Vietnamese + Korean senses; retain distinct glosses.

    Never backfill PDF meanings with translations of a merely similar existing word.
    Existing records and translations remain intact when an exact sense is shared.
    """
    index = {(normalize(w["vi"]), normalize(w.get("kr", {}).get("ko", ""))): w for w in words}
    for record in pdf_words:
        key = (record["vi"], record["translations"]["ko"])
        word = index.get(key)
        if word is None:
            word = {"vi": record["vi"], "kr": dict(record["translations"]), "tags": [], "frequency": 0}
            words.append(word)
            index[key] = word
        word["pdf_id"] = record["id"]
        word["pdf_sources"] = record["sources"]
        if "PDF" not in word["tags"]:
            word["tags"].append("PDF")
    return words

