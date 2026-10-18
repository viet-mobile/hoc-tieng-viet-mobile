"""[발음][자모] chart (pronunciation_data.HANOI_CHART): uy = ㅟ, uyê = ㅜ예, yê = ㅖ (2026-10-18); the other vowel rows stay."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pronunciation_data import HANOI_CHART, SAIGON_CHART
v = {row[0]: row[2] for row in HANOI_CHART["vowels"]}
assert v["uy"] == [["ㅟ", 0]], v["uy"]
assert v["uyê"] == [["ㅜ예", 0]], v["uyê"]
assert v["yê"] == [["ㅖ", 0], ["(뒤에 반드시 받침)", 1]], v["yê"]
assert v["iê"] == [["ㅣ에", 0], ["(뒤에 반드시 받침)", 1]] and v["ia"][0] == ["ㅣ어", 0]
print("hanoi chart: uy, uyê, yê checked")
for chart in (HANOI_CHART, SAIGON_CHART):
    ini = {g["letters"][0][0]: g["ko"] for g in chart["initials"]}
    assert ini["s-"] == "ㅅ-" and ini["x-"] == "ㅆ-", (ini["s-"], ini["x-"])
print("hanoi / saigon chart: s- = ㅅ-, x- = ㅆ-")
for chart in (HANOI_CHART, SAIGON_CHART):
    assert {row[0]: row[2] for row in chart["vowels"]}["oa"] == [["ㅘ", 0]]
print("hanoi / saigon chart: oa = ㅘ")
for chart in (HANOI_CHART, SAIGON_CHART):
    assert {row[0]: row[2] for row in chart["vowels"]}["uô"] == [["ㅜ오", 0]]
print("hanoi / saigon chart: uô = ㅜ오")
