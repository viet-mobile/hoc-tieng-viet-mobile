# Hand-authored dialogue scripts for the "speaker is the elder" categories, which the
# source pptx materials do not cover (the source materials only script the JW learner as
# the younger/junior party). Three new categories, all requested by the user directly:
#
#   elder_uncle_aunt   - "내가 상대방의 삼촌·이모뻘" : self = chú(male speaker)/cô(female speaker),
#                         listener addressed as cháu(north)/con(south).
#   elder_parent_age   - "내가 상대방의 부모보다 나이가 많음" : self = bác (either speaker gender),
#                         listener addressed as cháu(north)/con(south).
#   stranger_polite    - first meeting, listener's exact age/closeness unclear, keep a polite
#                         distance: self = tôi (neutral, no region variant), listener addressed
#                         as chú(male 40s-70s)/cô(female 40s-70s)/bác(80s+, either gender) --
#                         this direction is the SAME as the original pptx situations (junior-ish
#                         speaker addressing a senior-looking stranger), just with "tôi" instead
#                         of "cháu" as self-reference, so it reuses that structure directly.

def line(viet, gloss, translation, reply=None):
    return {"viet": viet, "gloss": gloss, "translation": translation, "reply": reply}


# ---------------------------------------------------------------------------
# elder_uncle_aunt / elder_parent_age: elder speaker addresses a much younger contact.
# self_term is parametrized (chú / cô / bác); listener is always "cháu" (north) / "con" (south).
# ---------------------------------------------------------------------------

def build_elder_same(self_term, contact_name, contact_name_kr, name_vi, name_kr):
    S, Scap = self_term, self_term.capitalize()
    return {
        "1. 첫 만남": [
            line("Chào cháu!", "안녕  너(조카뻘)", "안녕!",
                 f"{contact_name}: Dạ, cháu chào {S} ạ!  — 안녕하세요!"),
            line("Cháu khỏe không?", "너(조카뻘)  건강하다  ~입니까?", "잘 지내니?",
                 f"{contact_name}: Dạ, cháu khỏe. Cảm ơn {S} đã hỏi thăm ạ.  — 네, 잘 지내요. 물어봐 주셔서 감사해요."),
        ],
        "2. 자기소개": [
            line(f"{Scap} tên là {{ME_VI}}.", "나  이름  이다  {ME_VI}", "제 이름은 {ME_KR}예요."),
            line(f"{Scap} là người Hàn Quốc.", "나  이다  사람  한국", "저는 한국 사람이에요."),
            line(f"{Scap} đang học tiếng Việt.", "나  ~하는 중  배우다  베트남어", "저는 베트남어를 배우고 있어요."),
            line(f"{Scap} là Nhân Chứng Giê-hô-va.", "나  이다  증인  여호와", "저는 여호와의 증인이에요.",
                 f"{contact_name}: Dạ, cháu tên là {contact_name}. Cháu rất vui được gặp {S} ạ.  — 제 이름은 {contact_name_kr}예요. 만나서 반가워요."),
            line(f"{Scap} cũng rất vui được gặp cháu.", "나  ~도  아주  기쁘다  ~하게 되다  만나다  너", "나도 만나서 반가워."),
        ],
        "3. 연락처 교환": [
            line("Cháu có Zalo không?", "너  있다  잘로  ~입니까?", "잘로(Zalo) 있니?",
                 f"{contact_name}: Dạ, cháu có ạ.  — 네, 있어요."),
            line(f"Cho {S} xin số điện thoại của cháu nhé.", "주다  나  청하다  번호  전화  ~의  너  ~해요", "전화번호 좀 알려 줄래?",
                 f"{contact_name}: Dạ, số của cháu là 010-2345-6789 ạ.  — 제 번호는 010-2345-6789예요."),
            line("Cảm ơn cháu nhiều.", "감사하다  너  많이", "정말 고마워."),
        ],
        "4. 다음 만남 약속": [
            line(f"Tuần sau, {S} muốn gặp cháu nữa.", "주(週)  다음  나  원하다  만나다  너  또", "다음 주에 또 만나고 싶어."),
            line("Cháu có thời gian không?", "너  있다  시간  ~입니까?", "시간 있니?",
                 f"{contact_name}: Dạ, chủ nhật cháu rảnh ạ.  — 네, 일요일에 시간 있어요."),
            line("Hẹn gặp lại cháu nhé!", "약속하다  만나다  다시  너  ~해요", "그럼 또 보자!"),
        ],
        "5. 재회": [
            line(f"{Scap} rất vui được gặp lại cháu.", "나  아주  기쁘다  ~하게 되다  다시  만나다  너", "다시 만나서 반가워."),
            line(f"{Scap} muốn mời cháu đến Phòng Nước Trời.", "나  원하다  초대하다  너  ~에 오다  회관  왕국", "왕국회관에 초대하고 싶어."),
            line("Buổi nhóm họp rất thú vị.", "모임  집회  아주  재미있다", "집회는 정말 흥미로워."),
            line(f"Cháu đi với {S} nhé?", "너  가다  ~와 함께  나  ~할래?", "나랑 같이 갈래?",
                 f"{contact_name}: Dạ, cháu sẽ đi thử ạ.  — 네, 한번 가 볼게요."),
        ],
        "6. 성서 연구 제안": [
            line("Cháu có muốn tìm hiểu Kinh Thánh không?", "너  있다  원하다  알아보다  성경  ~입니까?", "성경을 알아보고 싶니?"),
            line("Học Kinh Thánh miễn phí.", "배우다  성경  무료", "성경 공부는 무료야."),
            line("Mỗi tuần một lần, khoảng ba mươi phút.", "매  주(週)  한  번  약  삼십  분", "일주일에 한 번, 30분 정도야.",
                 f"{contact_name}: Dạ, cháu muốn thử ạ.  — 해 보고 싶어요."),
        ],
        "7. 성서 연구 사회": [
            line("Chúng ta bắt đầu nhé.", "우리  시작하다  ~해요", "그럼 시작할까?"),
            line("Hôm nay, chúng ta học về hạnh phúc.", "오늘  우리  배우다  ~에 대해  행복", "오늘은 행복에 대해 배워보자."),
            line("Cháu đọc câu Kinh Thánh này nhé.", "너  읽다  구절  성경  이  ~해요", "이 성경 구절을 읽어 줄래?"),
            line("Cháu nghĩ sao?", "너  생각하다  어떻게", "어떻게 생각해?",
                 f"{contact_name}: Dạ, hay quá ạ.  — 정말 좋아요."),
            line("Cảm ơn cháu. Tuần sau gặp lại nhé!", "감사하다  너  주(週)  다음  만나다  다시  ~해요", "고마워. 다음 주에 또 보자!"),
        ],
    }


def build_elder_opposite(self_term, companion_term, companion_name, companion_name_kr, korean_role,
                          contact_name, contact_name_kr, name_vi, name_kr):
    S, Scap = self_term, self_term.capitalize()
    ct = companion_term.capitalize()
    base = build_elder_same(self_term, contact_name, contact_name_kr, name_vi, name_kr)
    return {
        "1. 첫 만남": base["1. 첫 만남"],
        "2. 자기소개": base["2. 자기소개"],
        f"3. {companion_name_kr} {korean_role} 번호 전달": [
            line(f"Đây là số điện thoại của {companion_term} {companion_name}.",
                 f"여기  이다  번호  전화  ~의  {korean_role}  {companion_name_kr}",
                 f"이건 {companion_name_kr} {korean_role}의 전화번호야."),
            line(f"{ct} {companion_name} là bạn của {S}.",
                 f"{korean_role}  {companion_name_kr}  이다  친구  ~의  나",
                 f"{companion_name_kr} {korean_role}는 내 친구야."),
            line(f"{ct} {companion_name} cũng là Nhân Chứng Giê-hô-va.",
                 f"{korean_role}  {companion_name_kr}  ~도  이다  증인  여호와",
                 f"{companion_name_kr} {korean_role}도 여호와의 증인이야."),
        ],
        "4. 상대방 번호 받기": [
            line(f"Cho {S} xin số của cháu nhé.", "주다  나  청하다  번호  ~의  너  ~해요", "전화번호 좀 알려 줄래?",
                 f"{contact_name}: Dạ, số của cháu là 010-2345-6789 ạ.  — 제 번호는 010-2345-6789예요."),
            line(f"{ct} {companion_name} sẽ liên lạc với cháu.",
                 f"{korean_role}  {companion_name_kr}  ~할 것이다  연락하다  ~와 함께  너",
                 f"{companion_name_kr} {korean_role}가 연락할 거야."),
        ],
        "5. 함께 방문": [
            line(f"Đây là {companion_term} {companion_name}.", f"여기  이다  {korean_role}  {companion_name_kr}",
                 f"이분이 {companion_name_kr} {korean_role}야."),
            line("Chào cháu! Rất vui được gặp lại cháu.", "안녕  너  아주  기쁘다  ~하게 되다  다시  만나다  너",
                 "안녕! 다시 만나서 반가워."),
            line(f"{Scap} và {companion_term} {companion_name} muốn mời cháu đến Phòng Nước Trời.",
                 f"나  그리고  {korean_role}  {companion_name_kr}  원하다  초대하다  너  ~에 오다  회관  왕국",
                 f"나랑 {companion_name_kr} {korean_role}가 왕국회관에 초대하고 싶어."),
            line("Buổi nhóm họp rất thú vị.", "모임  집회  아주  재미있다", "집회는 정말 흥미로워.",
                 f"{contact_name}: Dạ, cháu sẽ đi thử ạ.  — 한번 가 볼게요."),
        ],
        f"6. {companion_name_kr} {korean_role}가 연구 사회": [
            line(f"{ct} {companion_name} sẽ học Kinh Thánh với cháu.",
                 f"{korean_role}  {companion_name_kr}  ~할 것이다  배우다  성경  ~와 함께  너",
                 f"{companion_name_kr} {korean_role}가 함께 성경을 공부할 거야."),
            line("Mỗi tuần một lần nhé.", "매  주(週)  한  번  ~해요", "일주일에 한 번이야."),
            line("Chúng ta bắt đầu nhé!", "우리  시작하다  ~해요", "그럼 시작할까?",
                 f"{contact_name}: Dạ, cảm ơn ạ.  — 감사합니다."),
            line("Hẹn gặp lại cháu nhé!", "약속하다  만나다  다시  너  ~해요", "또 보자!"),
        ],
    }


# ---------------------------------------------------------------------------
# stranger_polite: keeps the ORIGINAL pptx direction (speaker addresses a senior-looking
# stranger) but with the neutral self-reference "tôi" instead of "cháu" -- used when the
# speaker has just met the person and doesn't yet know them well enough for the warmer
# cháu/con self-reference. listener_term is parametrized (chú / cô / bác); no south variant
# for either side (tôi and chú/cô/bác do not change by region).
# ---------------------------------------------------------------------------

def build_stranger(listener_term, contact_name, contact_name_kr, name_vi, name_kr):
    L = listener_term
    return {
        "1. 첫 만남": [
            line(f"Chào {L} ạ!", f"안녕  {L}  (높임)", "안녕하세요!",
                 f"{contact_name}: Chào bạn!  — 안녕하세요!"),
            line(f"{L.capitalize()} khỏe không ạ?", f"{L}  건강하다  ~입니까?  (높임)", "잘 지내세요?",
                 f"{contact_name}: Cảm ơn, {L} khỏe.  — 고마워요, 잘 지내요."),
        ],
        "2. 자기소개": [
            line("Tôi tên là {ME_VI} ạ.", "저  이름  이다  {ME_VI}  (높임)", "제 이름은 {ME_KR}예요."),
            line("Tôi là người Hàn Quốc ạ.", "저  이다  사람  한국  (높임)", "저는 한국 사람이에요."),
            line("Tôi đang học tiếng Việt ạ.", "저  ~하는 중  배우다  베트남어  (높임)", "저는 베트남어를 배우고 있어요."),
            line("Tôi là Nhân Chứng Giê-hô-va ạ.", "저  이다  증인  여호와  (높임)", "저는 여호와의 증인이에요.",
                 f"{contact_name}: {L.capitalize()} tên là {contact_name}. Rất vui được gặp bạn.  — 제 이름은 {contact_name_kr}예요. 만나서 반가워요."),
            line(f"Rất vui được gặp {L} ạ.", f"아주  기쁘다  ~하게 되다  만나다  {L}  (높임)", "만나서 반갑습니다."),
        ],
        "3. 연락처 교환": [
            line(f"{L.capitalize()} có Zalo không ạ?", f"{L}  있다  잘로  ~입니까?  (높임)", "잘로(Zalo) 있으세요?",
                 f"{contact_name}: Có.  — 있어요."),
            line("Cho tôi xin số điện thoại ạ.", "주다  저  청하다  번호  전화  (높임)", "전화번호 좀 알려 주시겠어요?",
                 f"{contact_name}: Số của {L} là 010-2345-6789.  — 제 번호는 010-2345-6789예요."),
            line(f"Cảm ơn {L} nhiều ạ.", f"감사하다  {L}  많이  (높임)", "정말 고맙습니다."),
        ],
        "4. 다음 만남 약속": [
            line(f"Tuần sau, tôi muốn gặp {L} nữa ạ.", f"주(週)  다음  저  원하다  만나다  {L}  또  (높임)", "다음 주에 또 뵙고 싶어요."),
            line(f"{L.capitalize()} có thời gian không ạ?", f"{L}  있다  시간  ~입니까?  (높임)", "시간 있으세요?",
                 f"{contact_name}: Ừ, chủ nhật được.  — 네, 일요일 괜찮아요."),
            line(f"Hẹn gặp lại {L} ạ!", f"약속하다  만나다  다시  {L}  (높임)", "그럼 또 뵙겠습니다!"),
        ],
        "5. 재회": [
            line(f"Rất vui được gặp lại {L} ạ.", f"아주  기쁘다  ~하게 되다  다시  만나다  {L}  (높임)", "다시 만나서 반갑습니다."),
            line(f"Tôi muốn mời {L} đến Phòng Nước Trời ạ.", f"저  원하다  초대하다  {L}  ~에 오다  회관  왕국  (높임)", "왕국회관에 초대하고 싶어요."),
            line("Buổi nhóm họp rất thú vị ạ.", "모임  집회  아주  재미있다  (높임)", "집회는 정말 흥미로워요."),
            line(f"{L.capitalize()} đi với tôi ạ?", f"{L}  가다  ~와 함께  저  (높임)", "저와 같이 가실래요?",
                 f"{contact_name}: Ừ, {L} sẽ đi thử.  — 네, 한번 가 볼게요."),
        ],
        "6. 성서 연구 제안": [
            line(f"{L.capitalize()} có muốn tìm hiểu Kinh Thánh không ạ?", f"{L}  있다  원하다  알아보다  성경  ~입니까?  (높임)", "성경을 알아보고 싶으세요?"),
            line("Học Kinh Thánh miễn phí ạ.", "배우다  성경  무료  (높임)", "성경 공부는 무료예요."),
            line("Mỗi tuần một lần, khoảng ba mươi phút ạ.", "매  주(週)  한  번  약  삼십  분  (높임)", "일주일에 한 번, 30분 정도예요.",
                 f"{contact_name}: Ừ, {L} muốn thử.  — 네, 해 보고 싶어요."),
        ],
        "7. 성서 연구 사회": [
            line("Chúng ta bắt đầu ạ.", "우리  시작하다  (높임)", "그럼 시작할까요?"),
            line("Hôm nay, chúng ta học về hạnh phúc ạ.", "오늘  우리  배우다  ~에 대해  행복  (높임)", "오늘은 행복에 대해 배워요."),
            line(f"{L.capitalize()} đọc câu Kinh Thánh này ạ.", f"{L}  읽다  구절  성경  이  (높임)", "이 성경 구절을 읽어 주세요."),
            line(f"{L.capitalize()} nghĩ sao ạ?", f"{L}  생각하다  어떻게  (높임)", "어떻게 생각하세요?",
                 f"{contact_name}: Hay quá.  — 정말 좋네요."),
            line(f"Cảm ơn {L}. Tuần sau gặp lại ạ!", f"감사하다  {L}  주(週)  다음  만나다  다시  (높임)", "고맙습니다. 다음 주에 또 만나요!"),
        ],
    }
