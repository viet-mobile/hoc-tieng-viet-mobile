import json

ids_order = ["2012569","2010734","2014325","2012249","2012726","2014005","2013492","2014726","2014805","2015084","2015247"]

convs = []
total_lines = 0
total_corrections = 0
for i in ids_order:
    d = json.load(open(f"neighbor_conv_raw/conv_{i}.json", encoding="utf-8"))
    lines = d["lines"]
    total_lines += len(lines)
    total_corrections += len(d.get("corrections", []))
    clean_lines = []
    for ln in lines:
        clean_lines.append({
            "who": ln["who"],
            "vi": ln.get("vi", ""),
            "ko": ln.get("ko", ""),
            "zh": ln.get("zh", ""),
            "en": ln.get("en", ""),
            "ja": ln.get("ja", ""),
        })
    convs.append({
        "id": d["id"],
        "title": {k: d["title"].get(k, "") for k in ["ko", "zh", "en", "ja", "vi"]},
        "lines": clean_lines,
    })

print("conversations:", len(convs), "total lines:", total_lines, "total corrections:", total_corrections)

with open("neighbor_conversations_data.py", "w", encoding="utf-8") as f:
    f.write("# -*- coding: utf-8 -*-\n")
    f.write('"""\n')
    f.write("11 door-to-door ministry conversation-with-a-neighbor scripts, sourced verbatim from\n")
    f.write("wol.jw.org in ko/vi/zh(Traditional)/en/ja. Bible quotations were checked against the\n")
    f.write("current (Revised Edition) New World Translation in each language; wording updates were\n")
    f.write("applied ONLY to PUBLISHER lines, never to HOUSEHOLDER lines.\n")
    f.write('"""\n\n')
    f.write("NEIGHBOR_CONVERSATIONS = ")
    f.write(json.dumps(convs, ensure_ascii=False, indent=2))
    f.write("\n")

print("wrote neighbor_conversations_data.py")
