[어휘] meaning data for zh_cn / cs / hu / id  (report, 2026-09-28)
=====================================================================

What was built
--------------
word_meanings_extended.json (data) + word_meanings_extended.py (loader) are a curated, build-time data
layer. build_app.py fills ONLY the languages a word does not have yet:
  - UNIFIED_WORDS (apply_extended_meanings), by the exact sense key "vi|ko";
  - the [어휘] source lists (with_extended_meanings, on a copy made for emitting): VOCAB_GROUPS, VOCAB_CHAIN,
    VOCAB_THEO, FREQ_VOCAB, BIBLE_NAMES, BASIC_WORD_GROUPS, ANTONYM_PAIRS, DIALECT_WORDS, RHYME_GROUPS and
    WORD_ORDER_REVERSED_EXTRA (한자음 glosses, keyed "word|gloss(hanja)").
No runtime fallback is involved: the app still shows a word's meaning only in the UI language
(cs/hu/id never fall back to ko/en, zh_cn never to zh). Original Excel / PDF / JW sources are unchanged.
Existing meanings are never replaced (EXISTING_VERIFIED: "anh", identical to the new output -> 0 conflicts).

Entries (3,578 senses)
  UNIFIED        3,270  the UNIFIED_WORDS senses (3,169 spellings, 88 with several senses)
  DATASET          219  senses only an [어휘] list has (GROUPS 77, CHAIN 88, THEO 3, FREQ 3, NAMES 1,
                        ANTONYM 42, DIALECT 21 -- a sense can be in several lists)
  HANJA_READING     89  한자음 reading glosses without a UNIFIED sense (RHYME 79 + ORDERREV_EXTRA 13, 3 shared)

Methods
  ZH_TRAD_TO_SIMP            OpenCC 1.4.2 "t2s" on the verified zh (Traditional) text; build-time only.
                             Hand fix: 著 -> 着 where it is the aspect particle (附著, 活著, 活著的, 意味著);
                             著作權 keeps 著. Checked: idempotent, no Traditional residue, same length.
                             打破・打壞 -> 打破・打坏 (t2s would map 坏 again to 坯; 坏 is correct).
                             Dataset records get the conversion of their OWN zh (zh_cn_by_zh), because 8
                             records share a sense key with UNIFIED but word their zh differently.
  AI_VI_KO_CROSSCHECK_CS/HU/ID  gloss made from the Vietnamese headword + the Korean meaning of that sense,
                             cross-checked with en/zh/ja/de/fr/pl; concise dictionary style; ";" senses kept;
                             NWT forms for Bible names and JW terms (sbor/gyülekezet/sidang, zvěstovatel/
                             hírnök/penyiar, průkopník/úttörő/perintis, ...). Where the cross-check languages
                             mistranslate an ambiguous Korean word (병 bottle, 눈 snow/eye, 양 sheep, 이상
                             abnormal, ...) the Vietnamese sense decides (notes.csv, CROSSCHECK_ERROR).
                             PDF-only senses (no cross-check source) are made from vi + ko.
  EXISTING_VERIFIED          value already present (WORD_MEANING_OVERRIDES), kept.

Coverage (A = UNIFIED_WORDS jw, 3,270 senses)
            existing  generated  conflict  review_required  missing  usable
  cs            1       3,267        0            2             0     3,268
  hu            1       3,267        0            2             0     3,268
  id            1       3,267        0            2             0     3,268
  zh_cn         1       2,998        0            0           271     2,999  (271 = no zh source: ko-only PDF senses)
  (general profile: 2,828 senses; cs/hu/id 2,826, zh_cn 2,559)

Coverage (B = [복습] > [어휘] > 전체 pool, jw / jeonju / ulsan: 3,238 items; general: 2,795)
            before  after   missing
  cs          1     3,237      1   (mặt; kiến is asked with its 한자음 sense 建, which the pool lists first)
  hu          1     3,237      1
  id          1     3,237      1
  zh_cn       1     3,068    170   (= zh: 3,068; the 170 have no zh meaning anywhere)
  Every other [어휘] scope (한자음, 어순반대, 그룹, 기본, 반의어, 신권, 인명, 연결, 남북): 100% for all four;
  상용(freq) 1,474/1,476 for cs/hu/id (kiến, mặt).
  Runtime fallback: cs/hu/id -> ko/en = 0, zh_cn -> zh = 0 (browser-measured on all 4 Vietnamese profiles).
  ko/en/zh/ja/de/fr/pl counts and texts unchanged; vi meaning = 0 (unchanged design).

REVIEW_REQUIRED (left empty on purpose)
  kiến|벌다   FREQ_VOCAB: KO/EN/ZH/JA say "earn" (= kiếm), DE/FR/PL say "ant" (= kiến).
  mặt|옷입다  FREQ_VOCAB: KO/EN/ZH/JA/PL say "get dressed" (= mặc), FR/DE also give "face" (= mặt).
  Resolved: không phải|맞지 -- the PDF glossary line reads "không phải 맞지 / 않다"; the extractor cut the
  Korean at a line wrap. Meaning "is not" confirmed by the same PDF; generated.

Known source issues that zh_cn inherits (zh_cn keeps zh's wording by design)
  mắt / tuyết "眼睛；雪", con ngựa "話語・馬", sưng lên "倒（水）；腫脹", làm chứng bán chính thức "非正式證據"
  (see notes.csv). Fixing them means fixing zh in the source first.

Validation (17 checks, validate step; results in generated_*.csv "validation")
  empty / whitespace / Hangul / CJK in cs-hu-id / foreign letters / same as en / same as vi / same as ko /
  numbers / punctuation / ";" senses / length / existing-value conflict / zh_cn Traditional residue /
  zh_cn = OpenCC / zh_cn without zh / gloss shared by different words (info).
  Result: 0 errors; 9 "number written as a word" warnings (12사도 -> dvanáct apoštolů, 1월 -> leden, ...).

Audits
  audit_random_110.csv  110 random senses (seeded) read with basis + cross-check + all four meanings.
  audit_risk_groups.csv every sense of the risk groups read: homonym/polysemy 627, hanja 1,273, JW/WT 285,
                        names 233, north-south 117, semicolon 69, kinship 38, numbers 10.
  Fixes from the audits (and the same pattern searched everywhere): 2695 (publication title -> plain meaning),
  2709 (languages disagreed -> aligned), 2005, 2411 (JW wording), 1834 nhan sắc (KO 안색 literal -> Vietnamese
  sense "beauty").

Files
  summary_before.csv / summary_after.csv  coverage per profile, per source list and per review scope, per language
  generated_cs.csv / generated_zh_cn.csv / generated_hu.csv / generated_id.csv
        stable key, scope, sources, vi, hanja, ko basis, en/zh/ja/de/fr/pl cross-check, meaning, method,
        basis, validation, notes, audit flags
  conflicts.csv        existing vs newly generated (4 rows, all identical)
  review_required.csv  the 2 open senses (+ the resolved one)
  notes.csv            every CROSSCHECK_ERROR / KO_MISMATCH / SOURCE_TYPO / AUDIT_FIX note
  audit_random_110.csv, audit_risk_groups.csv
