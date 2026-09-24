"""GENERAL classification policy inside the existing extraction engine.

Rules migrated from the previous standalone builder; source ingestion, models,
normalization, IDs, deduplication, manifest and validation belong to the engine.
"""
import json
import re
from collections import Counter
from jw_extraction.normalization import normalize_text as normalize, compute_hash
from jw_extraction.sentence_selector import SentenceSelector
from site_profiles import RELIGIOUS_FILTER_TERMS

def classify_documents(documents):
    pages = [dict(s.metadata, source=s.metadata['file'], text=s.metadata['original'],
                  segmentId=s.id, documentId=d.id) for d in documents for s in d.segments]
    grammar = [p for p in pages if p['grammarCandidate']]
    page_map = {(p["source"], p["page"]): p for p in pages}
    data = {k: [] for k in ("words", "sentences", "grammar")}
    report = {k: {"raw": 0, "normalized": 0, "duplicates": 0, "rejected": [], "documents": {}, "document_raw": {}} for k in data}
    accepted = {k: [] for k in data}

    def add(kind, value, source, reason=None):
        stats = report[kind]
        stats["raw"] += 1
        document = source["file"]
        stats["document_raw"][document] = stats["document_raw"].get(document, 0) + 1
        if any(t.casefold() in json.dumps(value, ensure_ascii=False).casefold() for t in RELIGIOUS_FILTER_TERMS):
            reason = "profile content filter"
        if reason:
            stats["rejected"].append({"source": source, "reason": reason})
            return
        stats["normalized"] += 1
        value = dict(value, category=kind, profile='general')
        page = page_map[source['file'], source['page']]
        source = dict(source, documentId=page['documentId'], segmentId=page['segmentId'], sourceType='general_vietnamese_pdf')
        if 'lesson' in page:
            source['lesson'] = page['lesson']
        if kind == 'sentences':
            value['context'] = compute_hash(page['text'])
        accepted[kind].append((value, source))

    for page in pages:
        for number, line in enumerate(page["text"].splitlines(), 1):
            # Only explicitly labelled, inline Vietnamese/Korean vocabulary glosses.
            match = re.match(r"^\s*단어\s+(.+)$", line)
            if not match:
                continue
            for fragment in match[1].split("|"):
                source = {"file": page["source"], "page": page["page"], "line": number, "quote": line}
                fragment = re.sub(r"^[\s\x00-\x1f]+", "", fragment)
                if re.search(r"[\x00-\x1f]", fragment):
                    add("words", {}, source, "embedded extraction control character")
                    continue
                fragment = fragment.strip()
                pair = re.fullmatch(r"([A-Za-zÀ-ỹĐđ][A-Za-zÀ-ỹĐđ /'-]*?)\s+([가-힣(].*)", fragment)
                if not pair or re.search(r"[A-Za-zÀ-ỹĐđ]", pair[2]) or pair[2].rstrip().endswith((",", "/", "(")):
                    add("words", {}, source, "ambiguous or wrapped inline gloss")
                    continue
                add("words", {"vi": normalize(pair[1]), "translations": {"ko": normalize(pair[2])}}, source)

    for page in grammar:
        source = {"file": page["source"], "page": page["page"]}
        text = page["text"]
        authoritative = page_map.get((page["source"], page["page"]))
        if not authoritative or authoritative["text"] != text:
            add("grammar", {}, source, "page does not match corpus")
            continue
        # Category JSON is keyword-selected and includes contents/exercises. Require
        # an explicit grammar heading at the beginning, retaining full page topology.
        if not re.match(r"^\s*(?:BÀI ĐỌC\s+\d+\s*)?(?:\d+\s*)?(?:문법[·ㆍ\s]*표현|문법|NGỮ PHÁP|Ngữ pháp|HƯỚNG DẪN CÁCH DÙNG|핵심 표현)", text):
            add("grammar", {}, source, "no explicit opening grammar heading")
            continue
        add("grammar", {"title": text.splitlines()[0].strip(), "original": text, "original_languages": ["vi", "ko"]}, source)
        for number, line in enumerate(text.splitlines(), 1):
            clean = re.sub(r"^[\s\x00-\x1f•]+", "", line)
            clean = re.sub(r"^[AB]\s{2,}", "", clean)
            pair = re.fullmatch(r"([A-ZÀ-ỸĐ][A-Za-zÀ-ỹĐđ ,’'()/-]*[.!?])\s+([가-힣].*)", clean)
            if not pair:
                continue
            loc = dict(source, line=number, quote=line)
            if not re.match(r"^\s*문법[·ㆍ]표현", text):
                add("sentences", {}, loc, "parallel-column explanation is not an authoritative sentence translation")
                continue
            if re.search(r"[A-Za-zÀ-ỹĐđ]|\.{2,}|_{2,}", pair[2]):
                add("sentences", {}, loc, "ambiguous parallel columns or incomplete exercise")
                continue
            add("sentences", {"vi": normalize(pair[1]), "translations": {"ko": normalize(pair[2])}}, loc)

    for kind in data:
        data[kind] = SentenceSelector.consolidate_exact(accepted[kind], 'pdf-' + kind + '-')
        report[kind]['duplicates'] = len(accepted[kind]) - len(data[kind])
    for row in data['grammar']:
        row['examples'] = [s['id'] for s in data['sentences'] if s['context'] == compute_hash(row['original'])]
    for kind, rows in data.items():
        report[kind]["final"] = len(rows)
        report[kind]['missingTranslation'] = sum(not r.get('translations') for r in rows)
        report[kind]['missingExamples'] = sum(not r.get('examples') for r in rows)
        report[kind]['provenanceCoverage'] = sum(bool(r['sources']) for r in rows)
        for document in sorted({p["source"] for p in pages}):
            report[kind]["documents"][document] = sum(any(s["file"] == document for s in r["sources"]) for r in rows)
    report["inventory"] = {}
    for label, records in [
        ("corpus_pages", pages), ("grammar_candidate_pages", grammar),
        ("dialogue_candidate_pages", [p for p in pages if p['dialogueCandidate']]),
        ("culture_candidate_pages", [p for p in pages if p['cultureCandidate']]),
    ]:
        report["inventory"][label] = {"count": len(records), "documents": dict(Counter(p["source"] for p in records))}
    return data, report

