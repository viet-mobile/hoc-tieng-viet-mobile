# Vietnamese Kingdom vocal segments

The user-supplied 54-track list (including song 163 jwbcov26 video) is preserved in
scripts/data/kingdom_vi_vocal_sources.txt and parsed JSON. Song 164 uses osg126;
141 uses jwbon201511_2. sjjc audio or a general-choir video blocks children.
Children are eligible only if both general audio and video are absent. Network
errors never prove absence. sjjm/sjji are excluded.

Each proof binds the exact media key, Vietnamese locale, format and checksum.
Video cue times play that video's own MP4 audio; they never transfer to MP3.
Source-backed lyric spelling fixes apply before display/TTS/text comparison.
For other locales the official marker hash, document paragraph and exact lyric
text must agree. All 164 x 12 track/locale pairs are in the audit report.

## Analysis and limits

Official same-recording VTT cues anchor lyrics. For missing or grouped cues,
CTC alignment analyzes the selected recording, using Vietnamese Wav2Vec2
nguyenvulebinh/wav2vec2-base-vietnamese-250h at revision
69e9000591623e5a4fc2f502407860bcdc0de0b2 (CC-BY-NC, model authors credited).
https://huggingface.co/nguyenvulebinh/wav2vec2-base-vietnamese-250h
The model and recordings are not shipped or rehosted. Six-second cores with
one-second context per side use 16 kHz mono. Monotonic CTC aligns each occurrence;
caption bounds constrain matching characters. The acoustic confidence is a
heuristic, not a calibrated probability or a human listening verification.

Exact official cue groups may be enabled; CTC-only candidates require mean
character support >= .65, or .55 with a caption anchor, and <=12 seconds.
Uncertain spans are disabled. Song 26/76 omitted chorus occurrences stay disabled
instead of borrowing a different occurrence. Consecutive overlapping caption
ends stop at the next lyric start. Interlude/outro official paragraphs are held
when voice end is unproven. Enabled clips can retain ordinary pauses within a
sung line; no acoustic separation model or listening review is claimed.

54 songs were analyzed; 45 have enabled Vietnamese lines (877 total). Entirely
held: 28,67,80,89,93,140,141,144,152. Thus this does not claim all 54 songs'
lines are verified. Additional review is needed before enabling held candidates.

Reproduction: set VOCAL_WORK (selected-source JSON and local media), VOCAL_MODEL
(pinned local model), run scripts/align_vietnamese_vocals.py then
scripts/package_vietnamese_vocals.py. Run song_vocal_segment_audit.py afterward;
--cache explicitly reuses recorded network evidence. Packaging is conservative
and does not turn an alignment failure into guessed timestamps.

Player: source/load -> metadata -> full clip seekable -> seek -> seeked ->
landing within 100 ms -> play. Same file and repeats do not reload. Run tokens
invalidate pending events, promises, frame callbacks and timers. Same repeat
button, another line, TTS, tab/song changes and hidden stop playback. Returning
to foreground never auto-starts. Headless position tests verify mechanics, not
actual audible vocal identity or physical iPhone/iPad behavior.

## User-supplied song 41/46 boundaries (2026-10-08)

All 12 sung lines of each song use the supplied second-resolution intervals.
They are bound to pub-pksjj_41_VIDEO and pub-pksjj_46_VIDEO and their current
360p file checksums. These are user-supplied timings, not official markers or
model-confidence approvals. Titles, scriptures and chorus headings get no clips.
Manual overrides survive candidate repackaging and audit regeneration. Changed
recordings or lyrics require review before these intervals can be reused.

## Revised song 46 and shared children times (2026-10-08)

Song 46 line 4 ends at 00:57, line 5 starts at 01:04, and line 8 ends
at 01:46. The user explicitly authorized identical intervals in every learner
language's own pksjj children choir, overriding general-choir priority for this
manual annotation. All 12 locales have checksum-bound 360p children videos and
12 matching book lines. This reuse is user-authorized, not independently
measured cross-language vocal alignment. Missing/changed recordings, mismatched
line counts or intervals beyond duration hide buttons without choir fallback.

Future pksjj manual tables opt in by default through applyLearnerChildren;
legacy song 41 remains Vietnamese-only until requested. The audit regenerates
each locale's identity and labels; the runtime checks locale and checksum.
