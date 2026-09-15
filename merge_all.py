import json

files = {
    ("brother","north"): "brother_north.json",
    ("brother","south"): "brother_south.json",
    ("sister","north"): "sister_north.json",
    ("sister","south"): "sister_south.json",
}
data = {k: json.load(open(v, encoding="utf-8")) for k,v in files.items()}

# situation metadata
meta = {
 1:  dict(speaker="brother", listener_gender="male",   rel="younger_sibling", self_term="anh", listener_term="em", same_sex=True),
 2:  dict(speaker="brother", listener_gender="female", rel="younger_sibling", self_term="anh", listener_term="em", same_sex=False),
 3:  dict(speaker="sister",  listener_gender="male",   rel="younger_sibling", self_term="chị", listener_term="em", same_sex=False),
 4:  dict(speaker="sister",  listener_gender="female", rel="younger_sibling", self_term="chị", listener_term="em", same_sex=True),
 5:  dict(speaker="brother", listener_gender="male",   rel="older_sibling",   self_term="em", listener_term="anh", same_sex=True),
 6:  dict(speaker="brother", listener_gender="female", rel="older_sibling",   self_term="em", listener_term="chị", same_sex=False),
 7:  dict(speaker="sister",  listener_gender="male",   rel="older_sibling",   self_term="em", listener_term="anh", same_sex=False),
 8:  dict(speaker="sister",  listener_gender="female", rel="older_sibling",   self_term="em", listener_term="chị", same_sex=True),
 9:  dict(speaker="brother", listener_gender="male",   rel="younger_than_parent", self_term="cháu", self_term_south="con", listener_term="chú", same_sex=True),
 10: dict(speaker="brother", listener_gender="female", rel="younger_than_parent", self_term="cháu", self_term_south="con", listener_term="cô", same_sex=False),
 11: dict(speaker="sister",  listener_gender="male",   rel="younger_than_parent", self_term="cháu", self_term_south="con", listener_term="chú", same_sex=False),
 12: dict(speaker="sister",  listener_gender="female", rel="younger_than_parent", self_term="cháu", self_term_south="con", listener_term="cô", same_sex=True),
 13: dict(speaker="brother", listener_gender="male",   rel="older_than_parent", self_term="cháu", self_term_south="con", listener_term="bác", same_sex=True),
 14: dict(speaker="brother", listener_gender="female", rel="older_than_parent", self_term="cháu", self_term_south="con", listener_term="bác", same_sex=False),
 15: dict(speaker="sister",  listener_gender="male",   rel="older_than_parent", self_term="cháu", self_term_south="con", listener_term="bác", same_sex=False),
 16: dict(speaker="sister",  listener_gender="female", rel="older_than_parent", self_term="cháu", self_term_south="con", listener_term="bác", same_sex=True),
}

out = {}
for sitnum, m in meta.items():
    speaker = m["speaker"]
    north = data[(speaker,"north")].get(str(sitnum))
    south = data[(speaker,"south")].get(str(sitnum))
    entry = dict(m)
    entry["stages_north"] = north
    entry["stages_south"] = south
    out[str(sitnum)] = entry

json.dump(out, open("master_situations.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("done", len(out))
# sanity check counts
for k,v in out.items():
    n = sum(len(x) for x in v["stages_north"].values())
    s = sum(len(x) for x in v["stages_south"].values())
    print(k, v["rel"], v["same_sex"], "north_lines", n, "south_lines", s, "stages", len(v["stages_north"]))
