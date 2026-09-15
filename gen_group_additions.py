import json
groups = json.load(open("vocab_groups.json", encoding="utf-8"))
by_syl = {g['syllable']: g for g in groups}

# (syllable, hanja, kr, gloss, batchim_group)
DEFS = [
    ("bảo","保","보","지킬 보","none"),
    ("chi","支","지","지탱할 지","none"),
    ("chân","真","진","참 진","n"),
    ("cơ","機","기","틀 기","none"),
    ("cải","改","개","고칠 개","none"),
    ("du","遊","유","놀 유","none"),
    ("dịch","役","역","부릴 역","g"),
    ("dự","預","예","미리 예","none"),
    ("giáo","教","교","가르칠 교","none"),
    ("giới","介","개","낄 개","none"),
    ("hiện","現","현","나타날 현","n"),
    ("hoàn","完","완","완전할 완","n"),
    ("hàng","行","항","항렬 항·줄 항","ng"),
    ("hôn","婚","혼","혼인할 혼","n"),
    ("hạn","限","한","한계 한","n"),
    ("hội","會","회","모일 회","none"),
    ("khí","氣","기","기운 기","none"),
    ("kế","計","계","셀 계","none"),
    ("kỹ","技","기","재주 기","none"),
    ("liên","聯","련","잇닿을 련","n"),
    ("lễ","禮","례","예도 례","none"),
    ("lịch","歷","력","지날 력","g"),
    ("mỹ","美","미","아름다울 미","none"),
    ("ngoại","外","외","바깥 외","none"),
    ("ngân","銀","은","은 은","n"),
    ("phong","風","풍","바람 풍","ng"),
    ("sáng","創","창","비롯할 창","ng"),
    ("thu","收","수","거둘 수","none"),
    ("thông","通","통","통할 통","ng"),
    ("thế","世","세","인간 세","none"),
    ("thể","體","체","몸 체","none"),
    ("thủ","手","수","손 수","none"),
    ("tiến","進","진","나아갈 진","n"),
    ("trang","裝","장","꾸밀 장","ng"),
    ("truyền","傳","전","전할 전","n"),
    ("trình","程","정","한도 정","ng"),
    ("trí","智","지","지혜 지","none"),
    ("tài","財","재","재물 재","none"),
    ("tác","作","작","지을 작","g"),
    ("tôn","宗","종","마루 종","n"),
    ("tổng","總","총","다 총","ng"),
    ("từ","辭","사","말씀 사","none"),
    ("đơn","單","단","홑 단","n"),
    ("đạo","道","도","길 도","none"),
    ("đầu","投","투","던질 투","none"),
]
# bonus dual-reading entry
BONUS = [("đầu","頭","두","머리 두","none", ("đầu tiên","첫 번째(頭先)"))]

def build(syl, hanja, kr, gloss, ex_override=None):
    g = by_syl[syl]
    w0 = g["words"][0]
    ex_vi = w0["word"]
    ex_kr = w0["meaning"] + "(" + w0["hanja"] + ")"
    ex_mean = w0["meaning"]
    if ex_override:
        ex_vi, ex_kr = ex_override
        ex_mean = ex_kr.split("(")[0]
    return {"word": syl, "hanja": hanja, "kr": kr, "gloss": gloss,
            "example": ex_vi, "example_kr": ex_kr, "example_mean": ex_mean}

by_batchim = {"none": [], "n": [], "ng": [], "g": []}
for syl, hanja, kr, gloss, bc in DEFS:
    by_batchim[bc].append(build(syl, hanja, kr, gloss))

for syl, hanja, kr, gloss, bc, ex_ov in BONUS:
    by_batchim[bc].append(build(syl, hanja, kr, gloss, ex_override=ex_ov))

for k, v in by_batchim.items():
    print(k, len(v))

json.dump(by_batchim, open("group_additions.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
