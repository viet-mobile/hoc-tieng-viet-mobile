# -*- coding: utf-8 -*-
"""
전주 베트남어 학습반 (Jeonju Vietnamese class) -- fixed-term site identity + weekly date
framework only. Per the explicit instruction that created this file: only the schedule
skeleton (date, week number, an empty materials placeholder) is generated here. No lesson
content, assignment, scripture, or publication scope is invented -- JEONJU_WEEKS[i]["material"]
stays None until a real curriculum is supplied by the user; the renderer must display that as an
explicit "not yet set" state, never a fabricated placeholder sentence.
"""
import datetime

JEONJU_START = datetime.date(2026, 10, 3)
JEONJU_END = datetime.date(2027, 2, 13)

JEONJU_PRELIMINARY_DATE = "2026-10-03"
JEONJU_COURSE_START_DATE = "2026-10-10"
# Last possible class opportunity. With weekly classes from 2026-10-10 that is 19 opportunities; the three
# cancellations below leave exactly 16 instructional sessions ending on 2027-02-13 (= the authoritative timeline).
JEONJU_COURSE_END_DATE = JEONJU_END.isoformat()
JEONJU_INTERVAL_DAYS = 7
JEONJU_CANCELLATIONS = [
    {"date": "2026-11-07", "reason": "휴강"},
    {"date": "2026-11-28", "reason": "군산 한국어 순회대회"},
    {"date": "2026-12-05", "reason": "천안 베트남어 순회대회 파이오니아 모임"},
]
# One-off moves of a class to another day, shown on the session card ("2026/11/15 - 5주 (...)"). The schedule
# engine still counts the class on its weekly slot (`date`); only the shown date and the note change. D1 has no
# field for this, so it is site data layered over the static or live configuration (note: all 12 UI languages).
JEONJU_RESCHEDULES = [
    {"date": "2026-11-14", "newDate": "2026-11-15", "note": {
         "ko": "토요일 본부 대표자 특별 방문 집회로 인해 일요일 오후 2시",
         "vi": "Chủ Nhật lúc 2 giờ chiều vì buổi nhóm họp đặc biệt nhân chuyến thăm của đại diện trụ sở trung ương vào thứ Bảy",
         "cs": "V neděli ve 14:00 kvůli sobotnímu zvláštnímu shromáždění při návštěvě zástupce ústředí",
         "zh_cn": "因星期六有总部代表特别探访聚会，改为星期日下午2点",
         "zh": "因星期六有總部代表特別探訪聚會，改為星期日下午2點",
         "en": "Sunday at 2:00 p.m. due to the special meeting for the headquarters representative’s visit on Saturday",
         "fr": "Dimanche à 14 h en raison de la réunion spéciale pour la visite d’un représentant du siège mondial le samedi",
         "de": "Sonntag um 14 Uhr wegen der besonderen Zusammenkunft zum Besuch eines Vertreters der Weltzentrale am Samstag",
         "hu": "Vasárnap 14 órakor a központi képviselő látogatása alkalmából tartott szombati különleges összejövetel miatt",
         "id": "Hari Minggu pukul 14.00 karena ada perhimpunan istimewa kunjungan wakil kantor pusat pada hari Sabtu",
         "ja": "土曜日の本部代表者の特別訪問の集会のため、日曜日午後2時",
         "pl": "W niedzielę o 14:00 z powodu sobotniego specjalnego zebrania z okazji wizyty przedstawiciela Biura Światowego",
     }},
]

JEONJU_INFO = {
    "name": "전주 베트남어 학습반",
    "nameEn": "Jeonju Vietnamese Class",
    "startDate": JEONJU_START.isoformat(),
    "endDate": JEONJU_END.isoformat(),
    "schedule": "매주 토요일",
    "kind": "fixed-term",
}

def _build_weeks():
    weeks = []
    cur = JEONJU_START
    week_num = 1
    while cur <= JEONJU_END:
        weeks.append({
            "week": week_num,
            "date": cur.isoformat(),
            "weekday": "Saturday",
            "material": None,  # intentionally unset -- see module docstring
        })
        cur += datetime.timedelta(days=7)
        week_num += 1
    return weeks

JEONJU_WEEKS = _build_weeks()

# Members' Korean name, Vietnamese name and Vietnamese form of address, shown in the [과정] welcome card
# (supplied by the user as a table). The Vietnamese name and the form of address each have a listen button.
JEONJU_CLASS_ROSTER = [
    {"title": {"ko": "2026–2027 전주 베트남어 학습반 성원", "vi": "Thành viên lớp học tiếng Việt Jeonju năm 2026–2027"},
     "members": [
         ["김동주", "Minh Phước", "anh Phước"], ["김영임", "Minh Thương", "chị Thương"], ["김재윤", "Tài Duẫn", "anh Duẫn"],
         ["오호경", "Hồ Khánh", "chị Khánh"], ["김종배", "Pháp", "anh Pháp"], ["최미순", "Mỹ Xuân", "chị Xuân"],
         ["박정환", "Chinh Hoan", "anh Hoan"], ["원혜진", "Huệ Trân", "chị Trân"], ["박유나", "Na", "em Na"],
         ["박철현", "Triết Hiền", "anh Hiền"], ["송제홍", "Lý", "anh Lý"], ["이서희", "Thụy Vy", "chị Vy"],
         ["이수연", "Xuyến", "chị Xuyến"], ["이종명", "Minh", "anh Minh"], ["이주옥", "Ngọc", "chị Ngọc"],
         ["이제희", "Thiên Hy", "em Hy"], ["이제아", "Thiên Nga", "em Nga"], ["최영주", "Châu", "chị Châu"],
         ["한상현", "Huyền", "anh Huyền"], ["한도희", "Đạo", "anh Đạo"], ["서주연", "Quyên", "chị Quyên"],
         ["한정우", "Chinh Du", "em Du"],
     ]},
    {"title": {"ko": "전주 베트남어 집단 성원", "vi": "Thành viên nhóm tiếng Việt Jeonju"},
     "members": [
         ["최찬호", "Lam Phong", "anh Phong"], ["이재순", "Mỹ Duyên", "chị Duyên"], ["김한빈", "Dương Bình", "anh Bình"],
         ["김수민", "Ngọc Bích", "chị Bích"], ["김예나", "Trang Thanh", "em Thanh"], ["쩐응옥마이", "Ngọc Mai", "chị Mai"],
         ["김소영", "Mỹ Tâm", "chị Tâm"], ["김종현", "Minh Trường", "anh Trường"], ["김대훈", "Huấn", "anh Huấn"],
         ["박준우", "Duy", "anh Duy"],
     ]},
    {"title": {"ko": "강사", "vi": "Giảng viên"},
     "members": [["이주복", "Thành Trung", "anh Trung"]]},
]

# Every class, from the preliminary meeting to graduation, opens and closes with a Vietnamese song and prayer.
# Prayer assignments per class ("prelim" = 2026-10-03, then source week 1-16): [opening, closing], each
# [Korean name, prayer language "ko"/"vi"]. 김한빈 always prays in Vietnamese. 한정우 (unbaptized publisher) is not assigned.
_P = lambda name, lang=None: [name, lang]
JEONJU_PRAYERS = {
    "prelim": [_P("최찬호", "ko"), _P("이주복", "ko")],
    "1": [_P("김동주", "ko"), _P("김종현", "ko")],
    "2": [_P("김재윤", "ko"), _P("김한빈", "vi")],
    "3": [_P("김종배", "ko"), _P("김대훈", "ko")],
    "4": [_P("박정환", "ko"), _P("박준우", "ko")],
    "5": [_P("박철현", "ko"), _P("최찬호", "ko")],
    "6": [_P("송제홍", "ko"), _P("김한빈", "vi")],
    "7": [_P("이종명", "ko"), _P("김종현", "ko")],
    "8": [_P("한상현", "ko"), _P("김대훈", "ko")],
    "9": [_P("한도희", "ko"), _P("박준우", "ko")],
    "10": [_P("이주복", "ko"), _P("김한빈", "vi")],
    "11": [_P("김동주", "vi"), _P("김재윤", "vi")],
    "12": [_P("김종배", "vi"), _P("박정환", "vi")],
    "13": [_P("박철현", "vi"), _P("송제홍", "vi")],
    "14": [_P("이종명", "vi"), _P("한상현", "vi")],
    "15": [_P("한도희", "vi"), _P("김동주", "vi")],
    "16": [_P("이주복", "ko"), _P("김한빈", "vi")],
}

# Opening / closing Vietnamese song of each class (supplied by the user), keyed like JEONJU_PRAYERS.
JEONJU_SONGS = {
    "prelim": ['BÀI HÁT 133 Thờ phượng Đức Giê-hô-va trong thời thanh xuân', 'BÀI HÁT 46 Cảm tạ Cha Giê-hô-va'],
    "1": ['BÀI HÁT 41 Xin nghe lời cầu nguyện của con', 'BÀI HÁT 80 “Nếm thử và nghiệm thấy Đức Giê-hô-va tốt thay!”'],
    "2": ['BÀI HÁT 93 Xin Cha ban phước cho buổi nhóm họp', 'BÀI HÁT 17 “Tôi muốn”'],
    "3": ['BÀI HÁT 47 Hãy cầu nguyện với Cha Giê-hô-va hằng ngày', 'BÀI HÁT 5 Các công việc kỳ diệu của Đức Chúa Trời'],
    "4": ['BÀI HÁT 51 Chúng ta dâng mình cho Đức Chúa Trời!', 'BÀI HÁT 100 Hãy bày tỏ lòng hiếu khách'],
    "5": ['BÀI HÁT 135 Đức Giê-hô-va mến gọi: ‘Hỡi con, hãy khôn ngoan!’', 'BÀI HÁT 67 “Hãy rao giảng lời Đức Chúa Trời”'],
    "6": ['BÀI HÁT 54 “Đây là đường”', 'BÀI HÁT 73 Xin giúp chúng con dạn dĩ'],
    "7": ['BÀI HÁT 70 Tìm kiếm những người xứng đáng', 'BÀI HÁT 59 Hãy cùng tôi ngợi khen Đức Giê-hô-va'],
    "8": ['BÀI HÁT 96 Cuốn sách của Đức Chúa Trời—Kho tàng vô giá', 'BÀI HÁT 11 Công trình sáng tạo ngợi khen Đức Chúa Trời'],
    "9": ['BÀI HÁT 41 Xin nghe lời cầu nguyện của con', 'BÀI HÁT 80 “Nếm thử và nghiệm thấy Đức Giê-hô-va tốt thay!”'],
    "10": ['BÀI HÁT 93 Xin Cha ban phước cho buổi nhóm họp', 'BÀI HÁT 17 “Tôi muốn”'],
    "11": ['BÀI HÁT 47 Hãy cầu nguyện với Cha Giê-hô-va hằng ngày', 'BÀI HÁT 5 Các công việc kỳ diệu của Đức Chúa Trời'],
    "12": ['BÀI HÁT 51 Chúng ta dâng mình cho Đức Chúa Trời!', 'BÀI HÁT 100 Hãy bày tỏ lòng hiếu khách'],
    "13": ['BÀI HÁT 135 Đức Giê-hô-va mến gọi: ‘Hỡi con, hãy khôn ngoan!’', 'BÀI HÁT 67 “Hãy rao giảng lời Đức Chúa Trời”'],
    "14": ['BÀI HÁT 54 “Đây là đường”', 'BÀI HÁT 73 Xin giúp chúng con dạn dĩ'],
    "15": ['BÀI HÁT 70 Tìm kiếm những người xứng đáng', 'BÀI HÁT 59 Hãy cùng tôi ngợi khen Đức Giê-hô-va'],
    "16": ['BÀI HÁT 133 Thờ phượng Đức Giê-hô-va trong thời thanh xuân', 'BÀI HÁT 46 Cảm tạ Cha Giê-hô-va'],
}

# Homework for the weeks without class (keyed by the cancelled date): review the named source weeks'
# study items and preview the next class's items, spread over Monday-Friday.
JEONJU_BREAK_ASSIGNMENTS = {
    "2026-11-07": {"review": [1, 2], "preview": 5},
    "2026-11-28": {"review": [1, 2, 3, 4]},
    "2026-12-05": {"review": [5, 6], "preview": 7},
}

# 2026-10-03 is a preliminary meeting without lessons: its study items are taught at the first class (10-10).
# Its homework (10/5-9) stays in the welcome card.
JEONJU_PRELIM_ITEMS_TO_WEEK1 = True

# The last class (2027-02-13) has only these; every other item of that week is done at the class before it.
JEONJU_LAST_WEEK_ONLY = ["파수대 집회 실연 (사회, 낭독, 발표)", "졸업", "베트남어 노래 (46번) 합창"]

# Regional editing boundary: [교과] / [16주 과정] overrides
# When None, build_app.py inherits the shared JW CURR_WEEKS, CURR_WELCOME, CURR_PHASES, CURR_ASSIGNMENTS.
JEONJU_CURR_WELCOME = None
JEONJU_CURR_PHASES = None
JEONJU_CURR_WEEKS = None
JEONJU_CURR_ASSIGNMENTS = None
