"""OSG 23 (user listened, 2026-10-09): sung line 21 plays 1:43-1:49; the official Korean marker (1:42.4-1:56.4) holds an interlude.
The Korean entry carries the correction (force), the Vietnamese recording plays the same times through the Korean->Vietnamese timing copy."""
import json
m = json.load(open("scripts/data/original_segment_manual.json", encoding="utf-8"))["osg-23|ko"]
c = json.load(open("song_timing_copy.json", encoding="utf-8"))
line = m["lines"][0]
assert (line["s"], line["e"], line.get("force"), line["occurrence"]) == (103000, 109000, True, 1), line
assert len(m["lines"]) == 1 and m["mediaKey"] == "pub-osg_23_AUDIO", m
assert c["original|osg-23|vi"] == {"from": "ko"}, c["original|osg-23|vi"]
print("checks run: 4\n--- OSG 23 LINE 21 TEST PASSED ---")
