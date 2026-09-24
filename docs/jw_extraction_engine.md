# JW Learning Extraction Engine v1 Architecture & User Guide

## 1. Overview & Architecture

The **JW Learning Extraction Engine** is an internal, reproducible build-time data extraction system for the Vietnamese learning site.
It analyzes existing and future authoritative JW Vietnamese learning materials and derives structured learning information for:
- **[단어]**: Vocabulary occurrences, multi-dimensional frequencies (`totalOccurrences`, `documentCount`, `bySourceType`), and candidate multi-syllable expressions.
- **[문법]**: Real contextual example sentences matched to registered A1/A2 and B1/B2 grammar patterns.
- **[문장]**: High-quality, curated, deduplicated learning sentences with complete multi-source provenance.
- **[복습 큐]**: Human-reviewable candidate queues (`PENDING_REVIEW`) for unknown recurring vocabulary and expressions.

### Data Flow Pipeline

```
AUTHORITATIVE SOURCES
(Watchtower 1-18, Songs 1-163, Enjoy Life Forever, Love People, Neighbor Conversations, Prayer, Talks)
        ↓
SOURCE ADAPTERS & NORMALIZATION (Unicode NFC, Vietnamese letter lookarounds)
        ↓
CANONICAL SEGMENTS & DOCUMENT HASHING (16-char SHA-256)
        ↓
EXTRACTION ENGINES:
├─ Vocab Matcher (against UNIFIED_WORDS) & Candidate Discovery
├─ Grammar Registry & Pattern Matcher (37 confirmed patterns)
└─ Sentence Selector & Scorer (deduplication & provenance merging)
        ↓
MANIFEST MANAGER & INCREMENTAL STATE (extraction_manifest.json)
        ↓
DERIVED ARTIFACTS:
├─ jw_extraction/data/derived_jw_data.json
└─ jw_extraction/review/pending_word_candidates.json
        ↓
PROFILE-AWARE BUILD EMISSION (build_app.py):
├─ GENERAL: const JW_EXTRACTION_DATA = null;  (0 bytes JW leakage)
└─ JW / JEONJU: const JW_EXTRACTION_DATA = { ... };
```

---

## 2. Ingested JW Corpus (Baseline v1)

| Source Corpus | Documents | Segments | Reason Included |
| :--- | :---: | :---: | :--- |
| **Watchtower Study** (1–18) | 18 | 1,429 | Authoritative 12-language study articles. (WT 19–24 are intentionally deferred). |
| **Songs** (1–163) | 163 | 4,059 | Authoritative Vietnamese Kingdom Song lyrics. (`SONG_MEANINGS = {}` preserved). |
| **Enjoy Life Forever!** | 72 | 5,427 | 12-language publication corpus with parallel sentences across 72 units. |
| **Love People** | 15 | 349 | 12-language disciple-making booklet corpus across 15 lessons. |
| **Neighbor Conversations** | 11 | 615 | 11 situational ministry dialogues with authentic colloquial Vietnamese. |
| **Prayer Template** | 1 | 14 | Model prayer structure transcribed from the Vietnamese course booklet. |
| **Offer Talks** | 11 | 79 | Presentation talk samples from the course booklet. |
| **Total** | **291** | **11,972** | **100% authoritative baseline coverage** |

---

## 3. Strict Profile Isolation (Zero-Leakage Policy)

The conceptual profile hierarchy is:
- **GENERAL** = `COMMON`
- **JW** = `COMMON` + `JW_ONLY`
- **JEONJU** = `COMMON` + `JW_ONLY` + `JEONJU_EVENT`

### Enforcement Mechanism
1. In `site_profiles.py`, `"JW_EXTRACTION_DATA"` is registered in `JW_ONLY_CONSTS` and `STRUCTURED_EMPTY_SHAPES["JW_EXTRACTION_DATA"] = None`.
2. In `build_app.py`, when `--site general` is built, `emit("JW_EXTRACTION_DATA", ...)` outputs:
   ```javascript
   const JW_EXTRACTION_DATA = null;
   ```
3. In `data_block.general.js`, exactly 0 bytes of JW extraction data are emitted.
4. In `app_logic.js`, all UI enhancements check:
   ```javascript
   if (typeof JW_EXTRACTION_DATA !== "undefined" && JW_EXTRACTION_DATA) { ... }
   ```
   Ensuring GENERAL remains completely unmodified in UI, performance, and data footprint.

---

## 4. Engine CLI Commands

Run the engine module from the repository root:

### Full Rebuild
Re-analyzes all 291 documents from scratch, re-extracts all occurrences and frequencies, re-scores learning sentences, and regenerates `extraction_manifest.json` and `derived_jw_data.json`:
```powershell
python -m jw_extraction.engine --rebuild
```

### Incremental Run
Inspects source documents against hashes stored in `extraction_manifest.json`. If no files changed, it exits immediately with `0 delta`. If new or changed documents are found, it updates only those documents:
```powershell
python -m jw_extraction.engine --incremental
```

### Dry Run
Audits what would change without modifying any files on disk:
```powershell
python -m jw_extraction.engine --dry-run
```

### Validation Suite
Runs internal structural checks, ensuring no orphan segments, no duplicate document IDs, valid grammar patterns, and verifies GENERAL profile isolation:
```powershell
python -m jw_extraction.engine --validate
```

---

## 5. Review Candidate Queue (`PENDING_REVIEW`)

When the engine processes text, it identifies unknown recurring multi-syllable collocations (2–3 syllables) that appear across at least 3 documents with at least 6 occurrences.
- Saved in `jw_extraction/review/pending_word_candidates.json`.
- Pruned to the top 300 candidates ranked deterministically by frequency.
- File size is maintained under 500 KB.
- Each entry contains:
  ```json
  {
    "id": "cand_word_82c5fba60f06aefd",
    "type": "word",
    "vi": "lời đức chúa trời",
    "translations": { "ko": "...", "en": "..." },
    "occurrences": [ ... ],
    "evidence": {
      "occurrenceCount": 42,
      "documentCount": 28,
      "sampleSources": [ "wt_01", "elf_unit_05" ]
    },
    "status": "PENDING_REVIEW"
  }
  ```
- **Rule**: Items in this queue NEVER enter `UNIFIED_WORDS` automatically. A human reviewer must inspect and promote them.

---

## 6. Guide: Ingesting Future Content (e.g. Watchtower 19–24)

When the authoritative 12-language source for Watchtower 19–24 is provided:

1. **Update `watchtower_study_data.json`**:
   Add rows for weeks 19–24 under the corresponding sheets in `watchtower_study_data.json`.
2. **Run Dry Run to Verify Delta**:
   ```powershell
   python -m jw_extraction.engine --dry-run
   ```
   The engine will report `newDocuments: ["wt_19", "wt_20", "wt_21", "wt_22", "wt_23", "wt_24"]`.
3. **Execute Incremental or Rebuild**:
   ```powershell
   python -m jw_extraction.engine --incremental
   ```
   The manifest will incorporate the new sheets and incrementally update frequencies and grammar examples.
4. **Re-build & Assemble the App**:
   ```powershell
   python build_app.py --site jw
   python build_app.py --site jeonju
   python assemble_app.py --site jw
   python assemble_app.py --site jeonju
   ```
5. **Run Automated Tests**:
   ```powershell
   python -m unittest tests/test_extraction_engine.py
   node tests/test_browser_runtime.js
   ```

---

## 7. Automated Testing Suite

Two test suites provide end-to-end verification:

1. **Unit & Engine Tests** (`tests/test_extraction_engine.py`):
   - `test_authoritative_baseline_safety`: Verifies `SONGS_DATA = 163`, `SONG_MEANINGS = {}`, WT 1-18 active.
   - `test_normalization_and_segmentation`: Verifies NFC normalization, regex word boundaries, and sentence segmentation.
   - `test_manifest_and_idempotency`: Verifies manifest tracking and 0 spurious changes.
   - `test_derived_jw_data_structure`: Verifies vocabulary frequencies, grammar examples, and learning sentences.
   - `test_review_queue_formatting`: Verifies candidate queue size (<1MB) and structure.
   - `test_profile_zero_leakage_into_general`: Verifies `JW_EXTRACTION_DATA = null` in GENERAL.
   - `test_incremental_change_detection_fixture`: Verifies hashing and change detection.

2. **Mobile Browser Runtime Tests** (`tests/test_browser_runtime.js`):
   - Uses Chrome DevTools Protocol (CDP) at 390px mobile viewport over HTTP.
   - Confirms `console.error = 0`, `pageerror = 0`, `404 = 0`, `requestfailed = 0` across GENERAL, JW, and JEONJU profiles.
