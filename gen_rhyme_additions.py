import json

data = json.load(open("hanja_raw.json", encoding="utf-8"))
idx = {}
for d in data:
    idx[(d['한자'], d['베트남어 (Hán-Việt)'])] = d

def info(hanja, vi):
    d = idx[(hanja, vi)]
    kr_ex = [x for x in (d['한국어 예'] or '').split('\n') if x]
    vi_ex = [x for x in (d['베트남어 예'] or '').split('\n') if x]
    return vi_ex[0], kr_ex[0]

def mean_of(kr_ex_item):
    # "국가(國家)" -> "국가"
    return kr_ex_item.split('(')[0]

def W(hanja, vi, kr, gloss, ex_override=None):
    if ex_override:
        ex_vi, ex_kr = ex_override
    else:
        ex_vi, ex_kr = info(hanja, vi)
    return {"word": vi, "hanja": hanja, "kr": kr, "gloss": gloss,
            "example": ex_vi, "example_kr": ex_kr, "example_mean": mean_of(ex_kr)}

out = {}

# ---------- GROUP ㄱ ----------
out["g_c_extend_uc"] = [   # add to existing -ức/-ực/-ặc family
    W("職","chức","직","직분 직"),
    W("食/植","thực","식","밥 식·심을 식"),
]
out["g_c_new1"] = {  # -ốc/-ộc/-ục/-ọc
    "final": "-ốc / -ộc / -ục / -ọc",
    "words": [
        W("國","quốc","국","나라 국"),
        W("木","mộc","목","나무 목"),
        W("目","mục","목","눈 목"),
        W("學","học","학","배울 학"),
        W("福","phúc","복","복 복"),
    ],
}
out["g_c_new2"] = {  # -ắc/-ạc
    "final": "-ắc / -ạc",
    "words": [
        W("北","bắc","북","북녘 북"),
        W("色","sắc","색","빛 색"),
        W("得","đắc","득","얻을 득"),
        W("樂","nhạc","악","풍류 악", ex_override=("âm nhạc","음악(音樂)")),
        W("樂","lạc","락","즐길 락", ex_override=("lạc quan","낙관(樂觀)")),
    ],
}
out["g_c_new3"] = {  # -ước/-ược
    "final": "-ước / -ược",
    "words": [
        W("約","ước","약","맺을 약"),
        W("藥","dược","약","약 약"),
        W("弱","nhược","약","약할 약"),
    ],
}
out["g_c_new4"] = {  # -ạch/-ách
    "final": "-ạch / -ách",
    "words": [
        W("白","bạch","백","흰 백"),
        W("百","bách","백","일백 백"),
        W("客","khách","객","손 객"),
        W("石","thạch","석","돌 석"),
    ],
}
out["g_c_new5"] = {  # -ịch/-ích
    "final": "-ịch / -ích",
    "words": [
        W("敵","địch","적","대적할 적"),
        W("席","tịch","석","자리 석"),
        W("適","thích","적","맞을 적"),
        W("的","đích","적","과녁 적"),
    ],
}

# ---------- GROUP ㄴ ----------
out["g_n_extend_anananan"] = [  # add to existing -an/-ăn/-ân family
    W("民","dân","민","백성 민"),
    W("人","nhân","인","사람 인"),
    W("新","tân","신","새 신"),
    W("身","thân","신","몸 신"),
    W("分","phân","분","나눌 분"),
    W("軍","quân","군","군사 군"),
]
out["g_n_new1"] = {  # -iên/-iến/-iền/-iện
    "final": "-iên / -iến / -iền / -iện",
    "words": [
        W("年","niên","년","해 년"),
        W("天","thiên","천","하늘 천"),
        W("先","tiên","선","먼저 선"),
        W("戰","chiến","전","싸움 전"),
        W("建","kiến","건","세울 건"),
        W("見","kiến","견","볼 견"),
        W("田","điền","전","밭 전"),
        W("電","điện","전","번개 전"),
        W("院","viện","원","집 원"),
        W("善","thiện","선","착할 선"),
    ],
}
out["g_n_new2"] = {  # -ôn/-ơn/-ản/-ần
    "final": "-ôn / -ơn / -ản / -ần",
    "words": [
        W("門","môn","문","문 문"),
        W("山","sơn","산","뫼 산"),
        W("本","bản","본","근본 본"),
        W("神","thần","신","귀신 신"),
    ],
}
out["g_n_new3"] = {  # -oàn/-uyên/-uyến/-uyện/-yền/-ận/-ín
    "final": "-oàn / -uyên / -uyến / -uyện / -yền / -ận / -ín",
    "words": [
        W("全","toàn","전","온전할 전"),
        W("元","nguyên","원","으뜸 원"),
        W("線","tuyến","선","줄 선"),
        W("願","nguyện","원","원할 원"),
        W("權","quyền","권","권세 권"),
        W("運","vận","운","옮길 운"),
        W("信","tín","신","믿을 신"),
    ],
}

# ---------- GROUP ㄹ ----------
out["g_t_extend"] = [  # add to existing -ất/-uất family
    W("室","thất","실","집 실"),
    W("質","chất","질","바탕 질"),
    W("必","tất","필","반드시 필"),
    W("日","nhật","일","날 일"),
    W("物","vật","물","물건 물"),
]
out["g_t_new1"] = {  # -iết/-iệt/-uyết/-yết/-ết
    "final": "-iết / -iệt / -uyết / -yết / -ết",
    "words": [
        W("節","tiết","절","마디 절"),
        W("設","thiết","설","베풀 설"),
        W("列","liệt","렬","벌일 렬"),
        W("烈","liệt","렬","매울 렬"),
        W("熱","nhiệt","열","더울 열"),
        W("別","biệt","별","다를 별"),
        W("說","thuyết","설","말씀 설"),
        W("雪","tuyết","설","눈 설"),
        W("決","quyết","결","결단할 결"),
        W("結","kết","결","맺을 결"),
        W("月","nguyệt","월","달 월"),
    ],
}
out["g_t_new2"] = {  # -oạt/-uật/-át/-út/-ốt
    "final": "-oạt / -uật / -át / -út / -ốt",
    "words": [
        W("活","hoạt","활","살 활"),
        W("術","thuật","술","재주 술"),
        W("吉","cát","길","길할 길"),
        W("筆","bút","필","붓 필"),
        W("骨","cốt","골","뼈 골"),
        W("發","phát","발","필 발"),
    ],
}
out["g_t_exception"] = {  # 實 exception: KR batchim ㄹ but VN final -c
    "final": "-ực (예외: 한국 받침 ㄹ ↔ 베트남 -c)",
    "kr_note": "實(실)처럼 한국 한자음은 받침 'ㄹ'인데 베트남어는 -t가 아니라 -c로 끝나는 예외적인 경우도 있어요.",
    "words": [
        W("實","thực","실","열매 실"),
    ],
}

# ---------- GROUP ㅂ ----------
out["g_p_extend"] = [  # add to existing -iệp/-ập/-ợp family
    W("十","thập","십","열 십"),
    W("入","nhập","입","들 입"),
    W("立","lập","립","설 립"),
    W("接","tiếp","접","이을 접"),
    W("集","tập","집","모을 집"),
]
out["g_p_new1"] = {  # -áp/-ạp/-ấp
    "final": "-áp / -ạp / -ấp",
    "words": [
        W("法","pháp","법","법 법"),
        W("答","đáp","답","대답 답"),
        W("雜","tạp","잡","섞일 잡"),
        W("急","cấp","급","급할 급"),
        W("級","cấp","급","등급 급"),
        W("給","cấp","급","줄 급"),
    ],
}

# ---------- GROUP ㅁ ----------
out["g_m_extend"] = [  # add to existing -âm/-am family
    W("三","tam","삼","석 삼"),
    W("男","nam","남","사내 남"),
    W("音","âm","음","소리 음"),
    W("飲","ẩm","음","마실 음"),
    W("品","phẩm","품","물건 품"),
    W("林","lâm","림","수풀 림"),
]
out["g_m_new1"] = {  # -im/-iệm
    "final": "-im / -iệm",
    "words": [
        W("金","kim","금","쇠 금"),
        W("念","niệm","념","생각 념"),
        W("任","nhiệm","임","맡길 임"),
    ],
}

# ---------- GROUP ㅇ ----------
out["g_ng_extend_uong"] = [  # add to existing -ương family
    W("香","hương","향","향기 향"),
    W("鄕","hương","향","고향 향"),
    W("向","hướng","향","향할 향"),
    W("響","hưởng","향","울릴 향"),
    W("享","hưởng","향","누릴 향"),
    W("王","vương","왕","임금 왕"),
    W("强","cường","강","강할 강"),
    W("長","trường","장","길 장", ex_override=("hiệu trưởng","교장(校長)")),
    W("長","trưởng","장","어른 장", ex_override=("trưởng lão","장로(長老)")),
    W("商","thương","상","장사 상"),
    W("想","tưởng","상","생각 상"),
    W("上","thượng","상","위 상"),
]
out["g_ng_extend_inh"] = [  # add to existing -inh family
    W("成","thành","성","이룰 성"),
    W("性","tính","성","성품 성"),
    W("京","kinh","경","서울 경"),
    W("敬","kính","경","공경 경"),
    W("平","bình","평","평평할 평"),
    W("情","tình","정","뜻 정"),
    W("定","định","정","정할 정"),
]
out["g_ng_new1"] = {  # -ông/-ung/-ọng/-ồng/-ộng/-ưng/-ứng
    "final": "-ông / -ung / -ọng / -ồng / -ộng / -ưng / -ứng",
    "words": [
        W("東","đông","동","동녘 동"),
        W("工","công","공","장인 공"),
        W("空","không","공","빌 공"),
        W("公","công","공","공평할 공"),
        W("中","trung","중","가운데 중"),
        W("重","trọng","중","무거울 중"),
        W("同","đồng","동","한가지 동"),
        W("動","động","동","움직일 동"),
        W("興","hưng","흥","일 흥"),
        W("應","ứng","응","응할 응"),
    ],
}
out["g_ng_new2"] = {  # -ang/-ảng/-ảnh/-ệnh/-ịnh
    "final": "-ang / -ảng / -ảnh / -ệnh / -ịnh",
    "words": [
        W("江","giang","강","강 강"),
        W("光","quang","광","빛 광"),
        W("廣","quảng","광","넓을 광"),
        W("景","cảnh","경","볕 경"),
        W("命","mệnh","명","목숨 명"),
        W("病","bệnh","병","병 병"),
    ],
}
out["g_ng_new3"] = {  # -anh remainder (danh), -inh remainder(sinh,tinh,minh,binh)
    "final": "-anh / -inh (그 외)",
    "words": [
        W("名","danh","명","이름 명"),
        W("生","sinh","생","날 생"),
        W("星","tinh","성","별 성"),
        W("明","minh","명","밝을 명"),
        W("兵","binh","병","병사 병"),
        W("正","chính","정","바를 정"),
        W("政","chính","정","정사 정"),
        W("精","tinh","정","정할 정"),
    ],
}

# ---------- GROUP 받침없음 ----------
out["g_none_extend"] = [  # add to existing -a/-oa family
    W("加","gia","가","더할 가"),
    W("花","hoa","화","꽃 화"),
]
out["g_none_new1"] = {  # a-vowel wide family
    "final": "-a / -á / -ã / -ây / -ại / -ải / -òa / -ỏa / -ô / -ối",
    "words": [
        W("歌","ca","가","노래 가"),
        W("價","giá","가","값 가"),
        W("馬","mã","마","말 마"),
        W("西","tây","서","서녘 서"),
        W("大","đại","대","큰 대"),
        W("代","đại","대","대신할 대"),
        W("海","hải","해","바다 해"),
        W("解","giải","해","풀 해"),
        W("和","hòa","화","화할 화"),
        W("火","hỏa","화","불 화"),
        W("無","vô","무","없을 무"),
        W("對","đối","대","대할 대"),
    ],
}
out["g_none_new2"] = {  # u/ư vowel family
    "final": "-ư / -ũ / -ụ / -ủ / -ữ / -ự / -ú / -ẫu",
    "words": [
        W("師","sư","사","스승 사"),
        W("思","tư","사","생각 사"),
        W("書","thư","서","글 서"),
        W("武","vũ","무","호반 무"),
        W("務","vụ","무","힘쓸 무"),
        W("主","chủ","주","주인 주"),
        W("女","nữ","녀","여자 녀"),
        W("自","tự","자","스스로 자"),
        W("字","tự","자","글자 자"),
        W("事","sự","사","일 사"),
        W("注","chú","주","부을 주"),
        W("母","mẫu","모","어미 모"),
    ],
}
out["g_none_new3"] = {  # i/y vowel family
    "final": "-i / -ý / -ĩa / -ị / -ịa / -ời / -ợi / -ứ / -ử",
    "words": [
        W("詩","thi","시","시 시"),
        W("知","tri","지","알 지"),
        W("理","lý","리","다스릴 리"),
        W("意","ý","의","뜻 의"),
        W("義","nghĩa","의","옳을 의"),
        W("市","thị","시","저자 시"),
        W("議","nghị","의","의논할 의"),
        W("地","địa","지","땅 지"),
        W("時","thời","시","때 시"),
        W("利","lợi","리","이로울 리"),
        W("四","tứ","사","넉 사"),
        W("史","sử","사","역사 사"),
    ],
}
out["g_none_new4"] = {  # y (醫)
    "final": "-y (단독)",
    "words": [
        W("醫","y","의","의원 의"),
    ],
}

json.dump({k: v for k, v in out.items()}, open("rhyme_additions.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
tot = 0
for k, v in out.items():
    if isinstance(v, list):
        tot += len(v)
    else:
        tot += len(v["words"])
print("total new word entries:", tot)
