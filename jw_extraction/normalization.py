# -*- coding: utf-8 -*-
"""
Vietnamese text normalization and regex boundary matching.
"""

import re
import unicodedata
import hashlib

VN_LETTERS = "a-zA-ZàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ"
BOUNDARY_PREFIX = r'(?<![' + VN_LETTERS + r'])'
BOUNDARY_SUFFIX = r'(?![' + VN_LETTERS + r'])'

_COMPILED_WORD_PATTERNS = {}

def normalize_text(text: str) -> str:
    """Normalizes whitespace and Unicode NFC while strictly preserving Vietnamese diacritics.
    Does NOT aggressively strip punctuation so that display text semantics remain."""
    if not text:
        return ""
    # Convert non-breaking space and other unicode spaces to standard space
    s = text.replace('\xa0', ' ').replace('\u202f', ' ').replace('\u200b', '')
    # Normalize Unicode NFC
    s = unicodedata.normalize('NFC', s)
    # Collapse multiple whitespace
    s = re.sub(r'[ \t\r\n]+', ' ', s).strip()
    return s

def normalize_key(text: str) -> str:
    """Lowercases and normalizes text for matching and indexing."""
    return normalize_text(text).lower()

def compute_hash(obj_str: str) -> str:
    """Computes a stable 16-character SHA-256 hash."""
    return hashlib.sha256(obj_str.encode('utf-8')).hexdigest()[:16]

def build_word_regex(word: str) -> re.Pattern:
    """Builds a cached regex pattern that matches a word or multi-word expression
    using proper Vietnamese letter boundary lookarounds."""
    w = normalize_key(word)
    if w in _COMPILED_WORD_PATTERNS:
        return _COMPILED_WORD_PATTERNS[w]
    pat_str = BOUNDARY_PREFIX + re.escape(w) + BOUNDARY_SUFFIX
    pat = re.compile(pat_str, re.IGNORECASE)
    _COMPILED_WORD_PATTERNS[w] = pat
    return pat
