# GENERAL PDF content audit — 2026-09-24

## Root cause and repair

The current working tree's `site_profiles.py:NON_JW_HTML_REMOVALS` listed
`sentence` in `tabs`. `assemble_app.py:assemble_site` passed this to
`site_html.py:strip_site_html`, physically removing the main sentence button and
entire `panel-sentence`. This was not an empty-data check or a language-index
problem. JW, JEONJU and ULSAN do not apply that removal policy. The existing
sentence renderer also returned unless `panes.lff` existed, coupling initialization
to a JW pane. Both conditions are corrected. Only publication/song/prayer subtabs
are removed from GENERAL; its PDF pane is promoted by the existing default-subtab
logic. JW and regional default publication panes remain unchanged.

## Authoritative artifacts and limitations

The supplied ZIP contains `vietnamese_pdf_corpus.json` (1,702 text pages, six
documents), `grammar_from_pdfs.json` (557 candidate pages),
`daily_conversations.json` (115 candidate pages), `vietnam_culture_from_pdfs.json`
(51 candidate pages), and `manifest.json`. All five files exactly match the ZIP;
the four content SHA-256 values match its manifest. Original PDF binaries and the
upstream PDF-to-JSON extraction program were not found in this checkout. This
change begins at the existing authoritative extraction artifact, not at a new PDF
parser. Speaker-label substitutions already recorded in the supplied manifest are
preserved, not recreated or expanded.

| Source | Corpus pages | Dialogue candidates | Grammar candidates | Culture candidates |
|---|---:|---:|---:|---:|
| 듣기 말하기 | 384 | 80 | 193 | 32 |
| 일상 회화 | 129 | 13 | 81 | 14 |
| 읽기 쓰기 A1 | 288 | 22 | 89 | 0 |
| 읽기 쓰기 A2 | 274 | 0 | 51 | 2 |
| 읽기 쓰기 B1 | 353 | 0 | 74 | 0 |
| 읽기 B2 | 274 | 0 | 69 | 3 |

`grammar_examples_data.py` contains 24 cards / 52 examples and claims an
`examples.items` source structure that the actual grammar JSON does not contain.
It is not imported by the existing build. Its extra translations and explanations
are not used. `pdf_full_text*.txt` and `pdf_layout*.txt` are older ministry-class
curriculum extractions, not this six-book corpus; they are not used to inflate
GENERAL coverage. Culture pages remain outside this change's three learning views.

Before this repair, none of the three PDF JSON artifacts fed the build. Existing
GENERAL words came from `UNIFIED_WORDS` via `unified_words_builder.py`: basic words,
frequency vocabulary, rhyme, reversed-order words, groups, antonyms and user words,
with existing profile filters. GENERAL had no main sentence data route. Its grammar
used the existing COMMON B1/B2 patterns and sentence-generation tools; the lessons
pane, including COMMON A1/A2 patterns mounted within it, was removed by the
GENERAL policy. This change preserves those existing sources and adds the verified
PDF source view rather than reclassifying legacy JW grammar.

Now `general_pdf_data.py:build_general_pdf` reads the corpus and grammar candidate
artifact, validates grammar pages against the corpus, extracts explicitly labelled
inline word glosses and unambiguous inline sentences from `문법·표현` pages, and
retains explicitly headed grammar pages intact. Build output `GENERAL_PDF` is COMMON
in all four physical builds. `merge_pdf_words` integrates words into `UNIFIED_WORDS`
using Vietnamese **and Korean sense**, preserving differing senses and adding PDF
provenance to exact existing matches. Main sentences use `GENERAL_PDF.sentences`;
grammar uses `GENERAL_PDF.grammar`. No review pool was changed: the GENERAL PDF
sentences are currently main learning content only.

Grammar records intentionally remain whole source pages. Pattern, explanation and
example topology is preserved in `original`; no inferred joins or fabricated
pattern summaries are introduced. Some pages contain exercises alongside their
explanations, as in the source. The source page is explicitly labelled `vi / ko`.

## Counts and coverage

Raw counts below are deterministic candidates, not an estimate of every word or
sentence in 1,702 pages. Unlabelled vocabulary, wrapped/multi-column sentences and
non-heading grammar candidate pages are not guessed. Zero coverage is explicit.
The machine-readable `general_pdf_coverage.json` records every rejected candidate's
source/page (and line/quote for word/sentence candidates) and reason.

| Type | Raw | Normalized accepted | Exact duplicates merged | Final | Rejected |
|---|---:|---:|---:|---:|---:|
| Words | 567 | 482 | 135 | 347 | 85 |
| Sentences | 241 | 191 | 3 | 188 | 50 |
| Grammar source pages | 557 | 248 | 39 | 209 | 309 |

Normalization uses Unicode NFC and whitespace only for extracted fields. Case,
diacritics, punctuation and distinct meanings are retained. Grammar page text is
unchanged. Stable IDs hash complete learning content, excluding provenance; exact
duplicates accumulate all distinct source locations. No fuzzy deduplication occurs.

| Source | Word raw/final | Sentence raw/final | Grammar raw/final |
|---|---:|---:|---:|
| 베트남어 듣기 말하기.pdf | 477 / 347 | 204 / 188 | 193 / 82 |
| 베트남어 일상 회화.pdf | 90 / 70 | 0 / 0 | 81 / 39 |
| 베트남어 읽기 쓰기 A1.pdf | 0 / 0 | 0 / 0 | 89 / 1 |
| 베트남어 읽기 쓰기 A2.pdf | 0 / 0 | 0 / 0 | 51 / 40 |
| 베트남어 읽기 쓰기 B1.pdf | 0 / 0 | 37 / 0 | 74 / 44 |
| 베트남어 읽기 B2.pdf | 0 / 0 | 0 / 0 | 69 / 42 |

Final source-column totals overlap because shared records retain multiple sources.
The GENERAL unified vocabulary now has 2,765 records: 2,509 existing records plus
256 new PDF senses. Another 91 PDF senses exactly match existing senses and receive
provenance. All 347 PDF senses are discoverable using the PDF tag. No exact
Vietnamese/meaning-object duplicates were found in the resulting unified list.

Rejections: words 77 ambiguous/wrapped glosses and 8 embedded extraction control
characters; sentences 37 parallel-column explanations that cannot safely be treated
as translations and 13 ambiguous parallel columns/incomplete exercises; grammar
307 pages without an explicit opening grammar heading and 2 pages caught by the
existing religious-content filter. Broad keyword-classified artifacts include
contents, introductions, culture and exercises, so their page totals are not
normalized learning-record totals.

## Language and isolation behavior

PDF sentence/word translations contain only source-backed Korean. No missing
language is filled with another language. The renderer accesses language keys, not
dropdown indexes. Missing translations display `Translation unavailable · <code>`;
Vietnamese displays the original without a redundant translation. Existing exact
word matches retain their existing language fields. Grammar source pages are
explicit originals, collapsed for languages other than vi/ko, not fallback
translations. Canonical and UI language ordering are unchanged; `zh` and `zh_cn`
remain separate keys and are independently exercised.

GENERAL still emits empty/null JW-only datasets, removes all JW sentence panes,
contains no regional constants or worker, and receives no regional curriculum or
events. PDF extraction is COMMON across profiles; it never reads JW source files.

## Changed files and coexistence

Overlaps with pre-existing uncommitted work: `app_logic.js`, `build_app.py`,
`site_profiles.py`, `template.html`, `tests/test_browser_runtime.js`. Edits are
additive/local: a PDF renderer and source metadata, build hook, sentence removal
policy, PDF mount points, and regression hook/browser profile setup. Existing
regional scheduling, admin, resource merges, review UX and translation work are
preserved. `assemble_app.py` was inspected but not edited by this task.

New files: `general_pdf_data.py`, `tests/test_general_pdf.py`,
`tests/test_general_pdf_browser.js`, `tests/helpers/general_pdf_browser.js`,
`docs/general_pdf_coverage.json`, and this report. Ignored generated artifacts were
rebuilt: all four `data_block*.js`, `app*.html`, and `dist` profile outputs.

No commits, pushes or deployment were performed. ZERO learning content or learning
translations were AI-generated. UI code/status labels and deterministic extraction
rules were written; all displayed learning text comes from existing source records.

## Validation

`node tests/test_general_pdf_browser.js` exited 0: GENERAL, JW, JEONJU and ULSAN
each rendered real PDF word/sentence/grammar records correctly in all 12 languages,
including source metadata and missing-translation behavior, at a 390px viewport.
No application page exceptions occurred. The Python tests also verify every
generated PDF record in all four physical HTML builds equals the current source
builder output, and every GENERAL JW-only constant has its prescribed empty value.

The existing full browser suite has a separate pre-existing test-harness defect:
its review regression calls `window.setLang` and `window.reviewScopedPool`, but both
functions are private in the app. The former throws before the review assertions
run; the latter would also prevent pool inspection. The new PDF regression uses
the actual language dropdown/change event instead. Review assertions have not been
removed or weakened to make the suite green. Consequently its review coverage is
**not verified**, even though the new PDF-focused checks pass.

An initial sandboxed Python test run exited 1 (temporary-directory PermissionError,
plus an extraction-control-character issue detected by the new provenance test).
The extraction issue was fixed by rejecting corrupted candidates. Retrying with a
workspace TEMP directory still exited 1 on Windows permissions. The approved
unsandboxed full suite then passed. An initial Chrome run exited 1 because its CDP
endpoint could not be opened; a dedicated browser profile and approved execution
resolved launch. The first complete run additionally captured an early version of
the new helper using the same nonexistent language API; that helper was corrected
and independently passed all four profiles before the final full-suite rerun.

| Command | Exit | Result |
|---|---:|---|
| `python -B general_pdf_data.py` | 0 | Deterministic counts and rejection report generated |
| `python -B build_app.py --site all` | 0 | All four data blocks rebuilt |
| `python -B assemble_app.py --site all` | 0 | All four local physical artifacts rebuilt; no deployment |
| `python -m unittest discover tests` | 0 | Final 28 tests passed, including physical-build equality |
| `python -m unittest discover -s tests -p test_general_pdf.py` | 0 | Final five focused tests passed |
| `node --check app_logic.js` | 0 | Syntax valid |
| `node --check tests/test_browser_runtime.js` | 0 | Syntax valid |
| `node --check tests/test_general_pdf_browser.js` | 0 | Syntax valid |
| `python -B -m jw_extraction.engine --dry-run` | 0 | Passed |
| `python -B -m jw_extraction.engine --validate` | 0 | Passed |
| `node tests/test_general_pdf_browser.js` | 0 | Four profiles × 12 languages, actual content/provenance checks |
| `node tests/test_word_order_ux.js` | 0 | Existing word-order UX regression passed |
| `node tests/test_schedule_engine.js` | 0 | Existing scheduling regression passed |
| `node tests/test_regional_admin.js` | 1 | Restore snapshot equality failure at test_regional_admin.js:715; regional implementation left untouched |
| `node tests/test_browser_runtime.js` | 1 | Final run: PDF checks pass on all profiles; private review API calls fail; ULSAN/en reload readiness timeout |
| `git -c safe.directory=C:/Users/leetr/Documents/viet-project/hoc-tieng-viet-mobile diff --check` | 0 | No whitespace errors |

The per-command `safe.directory` option was necessary for Git's repository ownership
check; no global Git configuration was changed. The branch is `multi-cs-hu`.
Detailed execution logs are in `scratch/general_pdf_*.log`.

| Profile | Focused PDF browser result | Full existing browser result |
|---|---|---|
| GENERAL | PASS, all 12 languages | PASS, navigation/reload/PDF/isolation |
| JW | PASS, all 12 languages | Review harness fails in all 11 non-Vietnamese languages; other recorded checks pass |
| JEONJU | PASS, all 12 languages | Same private review API failure; other recorded checks pass |
| ULSAN | PASS, all 12 languages | Same review failure plus English reload readiness timeout |

The final full browser run records zero console errors, page errors and failed
network requests for all four profiles, and PDF checks pass within that run too.
The ULSAN reload timeout remains unresolved; a successful focused PDF test is not
evidence that the complete reload suite passed. The regional admin test fails with
`restore must bring back configuration and distribution exactly`; earlier auth,
isolation, scheduling and apply/reorder atomicity checks pass, but later tests after
the restore failure do not execute. That separate agent's regional subsystem was
not modified to mask the failure. No claim is made that all existing regressions
are green.

`git status --short` below includes all other agents' pre-existing/concurrent work;
it is not a list of edits attributed to this task. In particular,
`tests/test_distribution_engine.js` appeared during this audit and was not created
or edited by this task.

```text
 M .gitignore
 M _redirects
 M app_logic.js
 M assemble_app.py
 M build_app.py
 M jeonju_data.py
 M site_profiles.py
 M template.html
 M tests/test_browser_runtime.js
 M tests/test_profile_crosslinks.py
 M usage_guide_data.py
 M verify_relabel.py
?? conversation_with_neighbor_json_2026-09-23.zip
?? daily_conversations.json
?? docs/general_pdf_audit.md
?? docs/general_pdf_coverage.json
?? general_pdf_data.py
?? grammar_examples_data.py
?? grammar_from_pdfs.json
?? hoc_tieng_viet_mobile_excel_json_2026-09-23.zip
?? hoc_tieng_viet_mobile_pdf_json_names_changed.zip
?? manifest.json
?? regional_admin/
?? scripts/
?? songs_data.json
?? tests/helpers/
?? tests/test_distribution_engine.js
?? tests/test_general_pdf.py
?? tests/test_general_pdf_browser.js
?? tests/test_regional_admin.js
?? tests/test_schedule_engine.js
?? tests/test_word_order_ux.js
?? ulsan_data.py
?? vietnam_culture_from_pdfs.json
?? vietnamese_pdf_corpus.json
```
