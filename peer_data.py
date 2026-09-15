# Hand-authored "same age (peer)" scripts, following the exact structural pattern of the
# source pptx materials, since the source materials had no "same age" case.
#
# North-Vietnam canonical peer address terms: cậu (you) / tớ (I).
# South-Vietnam canonical peer address terms: bạn (you) / mình (I) -- applied at render
# time via listener_term_south / self_term_south region substitution (see app_logic.js).
#
# NOTE: "bạn" also appears below as the ordinary noun "friend" (e.g. "is my friend") --
# those instances must NOT be treated as the 2nd-person address term, so they are written
# directly as "bạn" here rather than through the pronoun slot.

def line(viet, gloss, translation, reply=None):
    return {"viet": viet, "gloss": gloss, "translation": translation, "reply": reply}

PEER_SAME_SEX = {
    "1. 첫 만남": [
        line("Chào cậu!", "안녕  너", "안녕하세요!",
             "Nam: Chào cậu!  — 안녕하세요!"),
        line("Cậu khỏe không?", "너  건강하다  ~입니까?", "잘 지내세요?",
             "Nam: Cảm ơn cậu, tớ khỏe.  — 고마워요, 잘 지내요."),
    ],
    "2. 자기소개": [
        line("Tớ tên là {ME_VI}.", "나  이름  이다  {ME_VI}", "제 이름은 {ME_KR}예요."),
        line("Tớ là người Hàn Quốc.", "나  이다  사람  한국", "저는 한국 사람이에요."),
        line("Tớ đang học tiếng Việt.", "나  ~하는 중  배우다  베트남어", "저는 베트남어를 배우고 있어요."),
        line("Tớ là Nhân Chứng Giê-hô-va.", "나  이다  증인  여호와", "저는 여호와의 증인이에요.",
             "Nam: Tớ tên là Nam. Rất vui được gặp cậu.  — 제 이름은 남이에요. 만나서 반가워요."),
        line("Rất vui được gặp cậu.", "아주  기쁘다  ~하게 되다  만나다  너", "만나서 반가워요."),
    ],
    "3. 연락처 교환": [
        line("Cậu có Zalo không?", "너  있다  잘로  ~입니까?", "잘로(Zalo) 있으세요?",
             "Nam: Có, tớ có Zalo.  — 네, 잘로 있어요."),
        line("Cho tớ xin số điện thoại của cậu nhé.", "주다  나  청하다  번호  전화  ~의  너  ~해요", "전화번호 좀 알려 주세요.",
             "Nam: Số của tớ là 010-2345-6789.  — 제 번호는 010-2345-6789이에요."),
        line("Cảm ơn cậu nhiều.", "감사하다  너  많이", "정말 고맙습니다."),
    ],
    "4. 다음 만남 약속": [
        line("Tuần sau, tớ muốn gặp cậu nữa.", "주(週)  다음  나  원하다  만나다  너  또", "다음 주에 또 뵙고 싶어요."),
        line("Cậu có thời gian không?", "너  있다  시간  ~입니까?", "시간 있으세요?",
             "Nam: Chủ nhật tớ được.  — 일요일 괜찮아요."),
        line("Hẹn gặp lại cậu nhé!", "약속하다  만나다  다시  너  ~해요", "그럼 또 만나요!"),
    ],
    "5. 재회": [
        line("Rất vui được gặp lại cậu.", "아주  기쁘다  ~하게 되다  다시  만나다  너", "다시 만나서 반가워요."),
        line("Tớ muốn mời cậu đến Phòng Nước Trời.", "나  원하다  초대하다  너  ~에 오다  회관  왕국", "왕국회관에 초대하고 싶어요."),
        line("Buổi nhóm họp rất thú vị.", "모임  집회  아주  재미있다", "집회는 정말 흥미로워요."),
        line("Cậu đi với tớ nhé?", "너  가다  ~와 함께  나  ~할래요?", "저와 같이 가실래요?",
             "Nam: Được, tớ sẽ đi thử.  — 네, 한번 가 볼게요."),
    ],
    "6. 성서 연구 제안": [
        line("Cậu có muốn tìm hiểu Kinh Thánh không?", "너  있다  원하다  알아보다  성경  ~입니까?", "성경을 알아보고 싶으세요?"),
        line("Học Kinh Thánh miễn phí.", "배우다  성경  무료", "성경 공부는 무료예요."),
        line("Mỗi tuần một lần, khoảng ba mươi phút.", "매  주(週)  한  번  약  삼십  분", "일주일에 한 번, 30분 정도예요.",
             "Nam: Tớ muốn thử.  — 해 보고 싶어요."),
    ],
    "7. 성서 연구 사회": [
        line("Chúng ta bắt đầu nhé.", "우리  시작하다  ~해요", "그럼 시작할까요?"),
        line("Hôm nay, chúng ta học về hạnh phúc.", "오늘  우리  배우다  ~에 대해  행복", "오늘은 행복에 대해 배워요."),
        line("Cậu đọc câu Kinh Thánh này nhé.", "너  읽다  구절  성경  이  ~해요", "이 성경 구절을 읽어 주세요."),
        line("Cậu nghĩ sao?", "너  생각하다  어떻게", "어떻게 생각하세요?",
             "Nam: Hay quá.  — 정말 좋네요."),
        line("Cảm ơn cậu. Tuần sau gặp lại nhé!", "감사하다  너  주(週)  다음  만나다  다시  ~해요", "고맙습니다. 다음 주에 또 만나요!"),
    ],
}

def _peer_opposite(companion_term, companion_name, companion_name_kr, korean_role, contact_name, contact_name_kr):
    # companion_term: Vietnamese honorific for the companion (anh/chị) -- used only inside Vietnamese sentences
    # companion_name / contact_name: Vietnamese spelling -- used only inside Vietnamese sentences
    # companion_name_kr / contact_name_kr: Korean phonetic spelling -- used inside Korean text,
    #              matching the convention in the source materials ("빈 형제 번호 전달", "마이 자매가 연구 사회",
    #              "제 이름은 호아이에요.").
    ct = companion_term.capitalize()
    return {
        "1. 첫 만남": PEER_SAME_SEX["1. 첫 만남"],
        "2. 자기소개": [
            line("Tớ tên là {ME_VI}.", "나  이름  이다  {ME_VI}", "제 이름은 {ME_KR}예요."),
            line("Tớ là người Hàn Quốc.", "나  이다  사람  한국", "저는 한국 사람이에요."),
            line("Tớ đang học tiếng Việt.", "나  ~하는 중  배우다  베트남어", "저는 베트남어를 배우고 있어요."),
            line("Tớ là Nhân Chứng Giê-hô-va.", "나  이다  증인  여호와", "저는 여호와의 증인이에요.",
                 f"{contact_name}: Tớ tên là {contact_name}. Rất vui được gặp cậu.  — 제 이름은 {contact_name_kr}이에요. 만나서 반가워요."),
            line("Rất vui được gặp cậu.", "아주  기쁘다  ~하게 되다  만나다  너", "만나서 반가워요."),
        ],
        f"3. {companion_name_kr} {korean_role} 번호 전달": [
            line(f"Đây là số điện thoại của {companion_term} {companion_name}.",
                 f"여기  이다  번호  전화  ~의  {korean_role}  {companion_name_kr}",
                 f"이건 {companion_name_kr} {korean_role}의 전화번호예요."),
            line(f"{ct} {companion_name} là bạn của tớ.",
                 f"{korean_role}  {companion_name_kr}  이다  친구  ~의  나",
                 f"{companion_name_kr} {korean_role}는 제 친구예요."),
            line(f"{ct} {companion_name} cũng là Nhân Chứng Giê-hô-va.",
                 f"{korean_role}  {companion_name_kr}  ~도  이다  증인  여호와",
                 f"{companion_name_kr} {korean_role}도 여호와의 증인이에요."),
        ],
        "4. 상대방 번호 받기": [
            line("Cho tớ xin số của cậu nhé.", "주다  나  청하다  번호  ~의  너  ~해요", "전화번호 좀 알려 주세요.",
                 f"{contact_name}: Số của tớ là 010-2345-6789.  — 제 번호는 010-2345-6789이에요."),
            line(f"{ct} {companion_name} sẽ liên lạc với cậu.",
                 f"{korean_role}  {companion_name_kr}  ~할 것이다  연락하다  ~와 함께  너",
                 f"{companion_name_kr} {korean_role}가 연락드릴 거예요."),
        ],
        "5. 함께 방문": [
            line(f"Đây là {companion_term} {companion_name}.", f"여기  이다  {korean_role}  {companion_name_kr}",
                 f"이분이 {companion_name_kr} {korean_role}예요."),
            line("Chào cậu! Rất vui được gặp cậu.", "안녕  너  아주  기쁘다  ~하게 되다  만나다  너",
                 "안녕하세요! 만나서 반가워요."),
            line("Chúng tớ muốn mời cậu đến Phòng Nước Trời.", "우리  원하다  초대하다  너  ~에 오다  회관  왕국",
                 "당신을 왕국회관에 초대하고 싶어요."),
            line("Buổi nhóm họp rất thú vị.", "모임  집회  아주  재미있다", "집회는 정말 흥미로워요.",
                 f"{contact_name}: Tớ sẽ đi thử.  — 한번 가 볼게요."),
        ],
        f"6. {companion_name_kr} {korean_role}가 연구 사회": [
            line(f"{ct} {companion_name} sẽ học Kinh Thánh với cậu.",
                 f"{korean_role}  {companion_name_kr}  ~할 것이다  배우다  성경  ~와 함께  너",
                 f"{companion_name_kr} {korean_role}가 함께 성경을 공부할 거예요."),
            line("Mỗi tuần một lần nhé.", "매  주(週)  한  번  ~해요", "일주일에 한 번이에요."),
            line("Chúng ta bắt đầu nhé!", "우리  시작하다  ~해요", "그럼 시작할까요?",
                 f"{contact_name}: Cảm ơn.  — 고맙습니다."),
            line("Hẹn gặp lại cậu nhé!", "약속하다  만나다  다시  너  ~해요", "또 만나요!"),
        ],
    }

PEER_OPPOSITE_MALE = _peer_opposite("anh", "Bình", "빈", "형제", "Nam", "남")     # contact is male -> male companion Bình
PEER_OPPOSITE_FEMALE = _peer_opposite("chị", "Mai", "마이", "자매", "Hoa", "호아")  # contact is female -> female companion Mai
