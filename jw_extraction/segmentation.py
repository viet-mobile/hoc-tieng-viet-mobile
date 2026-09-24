# -*- coding: utf-8 -*-
"""
Deterministic sentence segmentation for Vietnamese learning prose and dialogue.
"""

import re
from typing import List
from jw_extraction.normalization import normalize_text

# Common Vietnamese / JW citation abbreviations that shouldn't trigger a sentence break
ABBREVIATIONS = {
    "v.v.", "v.d.", "tp.", "th.", "tr.", "đ.", "số", "câu", "đoạn",
    "st", "lu", "mt", "mác", "giăng", "cv", "rm", "1ct", "2ct", "gl",
    "êp", "pl", "cl", "1ts", "2ts", "1tm", "2tm", "tít", "plm", "hbr",
    "gc", "1pr", "2pr", "1gn", "2gn", "3gn", "gđ", "kh", "kn"
}

_SENTENCE_END_RE = re.compile(r'([.?!]+["\'”’\)\]]*\s+)')

def split_prose_sentences(text: str) -> List[str]:
    """Splits a prose paragraph into individual sentences while respecting
    abbreviations, numbers, Bible citations, and trailing quotation marks."""
    clean = normalize_text(text)
    if not clean:
        return []

    # Strip paragraph leading numbers like "1 ", "2 ", "14 "
    clean = re.sub(r'^\d+\s+', '', clean)

    # Check if text is short and doesn't need splitting
    if len(clean) < 80 and not any(p in clean for p in ['. ', '? ', '! ']):
        return [clean]

    tokens = _SENTENCE_END_RE.split(clean)
    sentences = []
    current = ""

    for i in range(0, len(tokens) - 1, 2):
        chunk = tokens[i]
        delim = tokens[i + 1]

        # Check if the chunk ends with an abbreviation
        last_word = chunk.strip().split()[-1].lower() if chunk.strip() else ""
        if last_word in ABBREVIATIONS or re.search(r'\b[A-ZĐÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝ][a-zàáâãèéêìíòóôõùúý]*\.$', chunk.strip()):
            current += chunk + delim
            continue

        # Check if delimiter is following a single digit (like list numbering or Bible chapter:verse)
        if re.search(r'\b\d+$', chunk.strip()):
            current += chunk + delim
            continue

        current += chunk + delim.strip()
        if current.strip():
            sentences.append(current.strip())
        current = ""

    if len(tokens) % 2 == 1:
        current += tokens[-1]
        if current.strip():
            sentences.append(current.strip())

    return sentences if sentences else [clean]
