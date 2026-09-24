# -*- coding: utf-8 -*-
"""
Data models for the JW Learning Extraction Engine.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any

@dataclass
class CanonicalSegment:
    id: str
    sourceType: str
    sourceId: str
    documentId: str
    sectionId: str
    order: int
    segmentType: str  # 'sentence', 'dialogue', 'lyric', 'heading'
    texts: Dict[str, str] = field(default_factory=dict)
    hash: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        result = {
            "id": self.id,
            "sourceType": self.sourceType,
            "sourceId": self.sourceId,
            "documentId": self.documentId,
            "sectionId": self.sectionId,
            "order": self.order,
            "segmentType": self.segmentType,
            "texts": self.texts,
            "hash": self.hash,
        }
        if self.metadata:
            result["metadata"] = self.metadata
        return result

@dataclass
class SourceDocument:
    id: str
    sourceType: str
    sourceId: str
    title: Dict[str, str]
    profile: str
    hash: str
    languages: List[str]
    segments: List[CanonicalSegment] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sourceType": self.sourceType,
            "sourceId": self.sourceId,
            "title": self.title,
            "profile": self.profile,
            "hash": self.hash,
            "languages": self.languages,
            "segmentCount": len(self.segments),
            "segments": [s.to_dict() for s in self.segments],
        }

@dataclass
class VocabularyOccurrence:
    wordVi: str
    segmentId: str
    documentId: str
    sourceType: str
    sourceLabel: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "wordVi": self.wordVi,
            "segmentId": self.segmentId,
            "documentId": self.documentId,
            "sourceType": self.sourceType,
            "sourceLabel": self.sourceLabel,
        }

@dataclass
class GrammarOccurrence:
    patternId: str
    segmentId: str
    documentId: str
    sourceType: str
    sourceLabel: str
    vi: str
    translations: Dict[str, str]
    matchedText: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "patternId": self.patternId,
            "segmentId": self.segmentId,
            "documentId": self.documentId,
            "sourceType": self.sourceType,
            "sourceLabel": self.sourceLabel,
            "vi": self.vi,
            "translations": self.translations,
            "matchedText": self.matchedText,
        }

@dataclass
class LearningSentence:
    id: str
    vi: str
    translations: Dict[str, str]
    provenance: List[Dict[str, Any]]
    vocabHits: List[str]
    grammarHits: List[str]
    score: float

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "vi": self.vi,
            "translations": self.translations,
            "provenance": self.provenance,
            "vocabHits": self.vocabHits,
            "grammarHits": self.grammarHits,
            "score": round(self.score, 3),
        }

@dataclass
class Candidate:
    id: str
    type: str  # 'word', 'grammar', 'alignment'
    vi: str
    translations: Dict[str, str]
    occurrences: List[Dict[str, Any]]
    evidence: Dict[str, Any]
    status: str = "PENDING_REVIEW"
    sampleContext: Optional[Dict[str, str]] = None

    def to_dict(self) -> Dict[str, Any]:
        d = {
            "id": self.id,
            "type": self.type,
            "vi": self.vi,
            "translations": self.translations,
            "occurrences": self.occurrences,
            "evidence": self.evidence,
            "status": self.status,
        }
        if self.sampleContext is not None:
            d["sampleContext"] = self.sampleContext
        return d
