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
    assert {row[0]: row[2] for row in chart["vowels"]}["oa"] == [["(뒤에 받침이나 모음이 있으면)", 1], ["ㅗ아", 0], ["(ng가 앞에 오거나 뒤에 받침이나 모음이 없으면)", 1], ["ㅘ", 0]]
    assert {row[0]: row[2] for row in chart["vowels"]}["oă"] == [["ㅘ", 0], ["(뒤에 반드시 받침)", 1]]
print("hanoi / saigon chart: oa = ㅗ아 / ㅘ (ng 앞), oă = ㅘ")
for chart in (HANOI_CHART, SAIGON_CHART):
    assert {row[0]: row[2] for row in chart["vowels"]}["uô"] == [["ㅜ오", 0]]
print("hanoi / saigon chart: uô = ㅜ오")
ê = {row[0]: row[2] for row in SAIGON_CHART["vowels"]}["ê"]
assert ["ㅔ이", 0] in ê and any("외국어 인명" in part[0] and "Giê-hô-va 예호야" in part[0] for part in ê), ê
print("saigon chart: open ê = ㅔ이, foreign names ㅔ (summary on the ê row)")
