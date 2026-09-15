import json
chain = json.load(open("vocab_chain.json", encoding="utf-8"))
by_first = {}
for it in chain:
    fs = it["word"].split()[0]
    by_first.setdefault(fs, it)  # first occurrence

DEFS = [
    ("biểu","表","표","겉 표","none"),
    ("bào","炮","포","대포 포","none"),
    ("chế","製","제","지을 제","none"),
    ("cách","革","혁","가죽 혁","g"),
    ("cộng","共","공","함께 공","ng"),
    ("diễn","演","연","펼 연","none"),
    ("dụng","用","용","쓸 용","none"),
    ("gian","奸","간","간사할 간","n"),
    ("hình","刑","형","형벌 형","ng"),
    ("hệ","系","계","맬 계","none"),
    ("khoa","科","과","과목 과","none"),
    ("kỳ","期","기","기약할 기","none"),
    ("lao","勞","노","일할 노","none"),
    ("liệu","療","료","병 고칠 료","none"),
    ("luận","論","론","논할 론","n"),
    ("luật","律","률","법률 률","t"),
    ("nghiêm","嚴","엄","엄할 엄","m"),
    ("năng","能","능","능할 능","ng"),
    ("phí","費","비","쓸 비","none"),
    ("phòng","防","방","막을 방","ng"),
    ("phạm","犯","범","범할 범","m"),
    ("sĩ","士","사","선비 사","none"),
    ("triết","哲","철","밝을 철","t"),
    ("trị","治","치","다스릴 치","none"),
    ("trợ","助","조","도울 조","none"),
    ("tạo","造","조","지을 조","none"),
    ("tế","細","세","가늘 세","none"),
    ("tốt","卒","졸","마칠 졸","t"),
    ("viên","員","원","인원 원","n"),
    ("án","案","안","책상 안","n"),
    ("đa","多","다","많을 다","none"),
    ("điểm","點","점","점 점","m"),
    ("điển","典","전","법 전","n"),
    ("đô","都","도","도읍 도","none"),
    ("độ","度","도","법도 도","none"),
]

def build(syl, hanja, kr, gloss):
    it = by_first[syl]
    return {"word": syl, "hanja": hanja, "kr": kr, "gloss": gloss,
            "example": it["word"], "example_kr": it["meaning"] + "(" + it["hanja"] + ")",
            "example_mean": it["meaning"]}

by_batchim = {"none": [], "n": [], "ng": [], "g": [], "t": [], "m": []}
for syl, hanja, kr, gloss, bc in DEFS:
    by_batchim[bc].append(build(syl, hanja, kr, gloss))

for k,v in by_batchim.items():
    print(k, len(v))
json.dump(by_batchim, open("chain_additions.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
