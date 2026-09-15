import json

chain = json.load(open("vocab_chain.json", encoding="utf-8"))
by_n = {c["n"]: c for c in chain}

# For each compound (3-4 syllable) entry, list its base component words in left-to-right
# order. A component already present as its own standalone entry earlier in the chain is
# marked with already_at=<n> instead of full hanja/meaning (we just reference it).
INSERTIONS = {
    2: [("hàng không", "航空", "항공"), ("dân dụng", "民用", "민간(용)")],
    6: [("nghiệp vụ", "業務", "업무"), ("ngân hàng", "銀行", "은행")],
    29: [("thức tỉnh", "識醒", "일깨움·각성"), ("lương tâm", "良心", "양심")],
    50: [],  # "tâm lý" already stands alone earlier at #44
    56: [("sư phạm", "師範", "사범"), ("kỹ thuật", "技術", "기술")],
    57: [("thuật toán", "術算", "알고리즘"), ("máy tính", "", "컴퓨터")],
    60: [("mạng", "", "망·네트워크"), ("xã hội", "社會", "사회")],
    81: [("độ tuổi", "度", "연령(대)"), ("lao động", "勞動", "노동")],
    91: [("kỳ thi", "期試", "시험"), ("tốt nghiệp", "卒業", "졸업")],
    94: [("án mạng", "案命", "살인사건"), ("nghiêm trọng", "嚴重", "중대한·심각한")],
    116: [("sức khỏe", "", "건강"), ("cộng đồng", "共同", "공동체·지역사회")],
    118: [("dược phẩm", "藥品", "의약품")],  # "bào chế" already stands alone earlier at #39
    131: [("hệ thống", "系統", "체계·시스템"), ("thông tin", "通信", "정보·통신")],
    143: [("tự động", "自動", "자동적")],
    155: [("sinh vật", "生物", "생물")],
    158: [("phòng khám", "房勘", "진료실·클리닉"), ("đa khoa", "多科", "다과·종합진료")],
    159: [("khoa học", "科學", "과학")],  # "xã hội" already introduced before #60
    168: [("chính sách", "政策", "정책"), ("đối ngoại", "對外", "대외")],
    186: [("đại học", "大學", "대학")],  # "quốc gia" already stands alone earlier at #170
    198: [("vật lý", "物理", "물리")],
}

merged = []
for c in chain:
    n = c["n"]
    if n in INSERTIONS:
        for word, hanja, meaning in INSERTIONS[n]:
            merged.append({
                "word": word, "hanja": hanja, "meaning": meaning,
                "kind": "base"
            })
        parts = [w for (w, h, m) in INSERTIONS[n]]
        # also credit any component that was already standalone earlier, for the subtitle
        entry = dict(c)
        entry["kind"] = "compound" if len(c["word"].split()) > 2 else "normal"
        if entry["kind"] == "compound":
            entry["parts"] = parts if parts else None
        merged.append(entry)
    else:
        entry = dict(c)
        entry["kind"] = "normal"
        merged.append(entry)

for i, e in enumerate(merged, start=1):
    e["display_n"] = i

print("total merged items:", len(merged))
print("base items added:", sum(1 for e in merged if e["kind"] == "base"))
print("compound items:", sum(1 for e in merged if e["kind"] == "compound"))

json.dump(merged, open("vocab_chain.json", "w", encoding="utf-8"), ensure_ascii=False)
