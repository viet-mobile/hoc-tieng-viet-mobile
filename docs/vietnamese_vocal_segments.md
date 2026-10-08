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

54 songs were analyzed; 50 have enabled Vietnamese lines (1022 total). Entirely
held: 28,80,93,152. Thus this does not claim all 54 songs'
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

## User-supplied song 67 children times (2026-10-08)

All 36 sung occurrences use the supplied intervals, including each of the three
choruses. Vietnamese pub-pksjj_67_VIDEO is bound to checksum
a56f40d4dd684a1fd2889f85c0ab2ee6. The 11 learner locales each have their own
checksum-bound children video and 36 book lines. Identical intervals are reused
under the user's standing authorization for children choir timing tables.
Titles, scripture and chorus headings receive no buttons. Inter-stanza gaps
are excluded by the supplied boundaries. These are user annotations, not new
official markers, listening verification or independently aligned learner vocals.

## User-supplied song 89 children times (2026-10-08)

The supplied 24 intervals cover three verses and three chorus occurrences.
Vietnamese pub-pksjj_89_VIDEO is bound to checksum
8c435816181a2b3d71c66c965fa7ce33. Learner locales use their own identified
children choir videos with the same user-authorized times. The 02:07–02:29
interlude is outside every interval. Titles, scripture and chorus labels get
no buttons. Timings are user annotations, not official marker data or an
independent cross-language vocal alignment.

## Song 140 and alternate children lyrics (2026-10-08)

Song 140 uses the user's 24 intervals, bound to Vietnamese children video
pub-pksjj_140_VIDEO checksum 8cd2953b6e71ddbf4cebf64776db06a1. Each learner
locale uses its own children recording with the user-authorized same intervals.

Optional manual line vocalText and vocalTextSource hold confirmed alternate
Vietnamese sung words. They remain separate from book text, TTS and row matching.
The runtime displays differing words in parentheses below the Vietnamese book
row only for a checksum-validated children recording. Punctuation-only differences
do not create duplicate lyrics. Unconfirmed words are never inferred from forced
alignment. Current supplied tables contain no alternate words; examples requested.

## Explicit song 141 children selection (2026-10-08)

The user's Korean pksjj_141 AUDIO/VIDEO links and 16 intervals explicitly
select children choir, overriding the existing jwbon_201511_2 general video.
Vietnamese uses its own pksjj_141_VIDEO checksum
72cd81bcc46e28b172b5f998a0b9de3b; Korean and other learner locales keep their
own checksum-bound children videos. selectedRecording/replacesMediaKey persist
the explicit transition when rebuilding old general-video candidates. A changed
children recording still fails identity validation. All 12 locales have 16 book
lines and use the user-authorized same times. No subtitles, acoustic analysis
or independent learner-language listening verification is claimed for this table.

## User-supplied song 144 children times (2026-10-08)

All 16 sung lines use the supplied bounds, including both chorus occurrences.
Each of the 12 locales uses its own identified pksjj_144_VIDEO children recording
with the user-authorized same times. The 01:04–01:08 interlude is excluded.
Recording checksum, exact book row count and total duration remain mandatory.

## User-supplied song 2 children times (2026-10-08)

All 32 sung occurrences use the supplied intervals, including both complete
choruses. Vietnamese pksjj_2_VIDEO checksum d600878667c8c9129f346df2967f2293
and the other 11 locales each bind their own children recording. Identical times
are user-authorized, not independent cross-language vocal alignment. The intro,
01:29–01:31 inter-stanza gap and outro stay outside the supplied segments.

## Standing shared children policy (2026-10-08)

The user explicitly expanded shared children selection to all Vietnamese pksjj
Kingdom songs (including 1, 2 and 5), regardless of whether times came from a
manual table, official captions or gated same-recording analysis. For all 37
children selections, each learner locale uses its own identified pksjj video.
The s/e times and enabled flags are identical to Vietnamese; unverified
Vietnamese occurrences remain disabled. Missing recordings or different book
line counts hide learner buttons without falling back to general choir.
This standing instruction supersedes earlier general-choir priority and the
legacy Vietnamese-only song 41 annotation for these learner rows. It is user-
authorized timing reuse, not independent cross-language vocal alignment.
