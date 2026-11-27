# -*- coding: utf-8 -*-
"""
MWB Auto Assigner for Jeonju Vietnamese Class
"""
import json

MEMBERS = [
    # [ko, vi, title_vi, gender ('M'/'F'), spouse_ko, [children_ko], [parents_ko]]
    {"ko": "김재윤", "vi": "Thành Tín", "call": "anh Tín", "gender": "M", "spouse": "오호경", "children": [], "parents": []},
    {"ko": "오호경", "vi": "Hồ Khánh", "call": "chị Khánh", "gender": "F", "spouse": "김재윤", "children": [], "parents": []},
    {"ko": "김종배", "vi": "Pháp", "call": "anh Pháp", "gender": "M", "spouse": "최미순", "children": [], "parents": []},
    {"ko": "최미순", "vi": "Mỹ Xuân", "call": "chị Xuân", "gender": "F", "spouse": "김종배", "children": [], "parents": []},
    {"ko": "박정환", "vi": "Hiếu", "call": "anh Hiếu", "gender": "M", "spouse": "원혜진", "children": ["박준우", "박유나"], "parents": []},
    {"ko": "원혜진", "vi": "Hiền", "call": "chị Hiền", "gender": "F", "spouse": "박정환", "children": ["박준우", "박유나"], "parents": []},
    {"ko": "박유나", "vi": "Na", "call": "em Na", "gender": "F", "spouse": None, "children": [], "parents": ["박정환", "원혜진"]},
    {"ko": "박철현", "vi": "Trung Dũng", "call": "anh Dũng", "gender": "M", "spouse": None, "children": [], "parents": []},
    {"ko": "송제홍", "vi": "Lý", "call": "anh Lý", "gender": "M", "spouse": "이서희", "children": [], "parents": []},
    {"ko": "이서희", "vi": "Thụy Vy", "call": "chị Vy", "gender": "F", "spouse": "송제홍", "children": [], "parents": []},
    {"ko": "이수연", "vi": "Xuyến", "call": "chị Xuyến", "gender": "F", "spouse": None, "children": [], "parents": []},
    {"ko": "이종명", "vi": "Minh", "call": "anh Minh", "gender": "M", "spouse": "이주옥", "children": ["이제희", "이제아"], "parents": []},
    {"ko": "이주옥", "vi": "Ngọc", "call": "chị Ngọc", "gender": "F", "spouse": "이종명", "children": ["이제희", "이제아"], "parents": []},
    {"ko": "이제희", "vi": "Thiên Vui", "call": "em Vui", "gender": "F", "spouse": None, "children": [], "parents": ["이종명", "이주옥"]},
    {"ko": "이제아", "vi": "Thiên Nga", "call": "em Nga", "gender": "F", "spouse": None, "children": [], "parents": ["이종명", "이주옥"]},
    {"ko": "최영주", "vi": "Ánh Châu", "call": "chị Châu", "gender": "F", "spouse": None, "children": [], "parents": []},
    {"ko": "한상현", "vi": "Huy", "call": "anh Huy", "gender": "M", "spouse": None, "children": [], "parents": []},
    {"ko": "한도희", "vi": "Đạo", "call": "anh Đạo", "gender": "M", "spouse": "서주연", "children": ["한정우"], "parents": []},
    {"ko": "서주연", "vi": "Quyên", "call": "chị Quyên", "gender": "F", "spouse": "한도희", "children": ["한정우"], "parents": []},
    {"ko": "한정우", "vi": "Chinh Du", "call": "em Du", "gender": "M", "spouse": None, "children": [], "parents": ["한도희", "서주연"]},
    {"ko": "유계화", "vi": "Hoa", "call": "chị Hoa", "gender": "F", "spouse": None, "children": [], "parents": []},
    {"ko": "최찬호", "vi": "Lam Phong", "call": "anh Phong", "gender": "M", "spouse": "이재순", "children": [], "parents": []},
    {"ko": "이재순", "vi": "Mỹ Duyên", "call": "chị Duyên", "gender": "F", "spouse": "최찬호", "children": [], "parents": []},
    {"ko": "김한빈", "vi": "Dương Bình", "call": "anh Bình", "gender": "M", "spouse": "김수민", "children": ["김예나"], "parents": []},
    {"ko": "김수민", "vi": "Ngọc Bích", "call": "chị Bích", "gender": "F", "spouse": "김한빈", "children": ["김예나"], "parents": []},
    {"ko": "김예나", "vi": "Trang Thanh", "call": "em Thanh", "gender": "F", "spouse": None, "children": [], "parents": ["김한빈", "김수민"]},
    {"ko": "김동주", "vi": "Minh Phước", "call": "anh Phước", "gender": "M", "spouse": None, "children": [], "parents": []},
    {"ko": "쩐응옥마이", "vi": "Ngọc Mai", "call": "chị Mai", "gender": "F", "spouse": None, "children": [], "parents": []},
    {"ko": "김소영", "vi": "Mỹ Tâm", "call": "chị Tâm", "gender": "F", "spouse": None, "children": [], "parents": []},
    {"ko": "김종현", "vi": "Minh Trường", "call": "anh Trường", "gender": "M", "spouse": None, "children": [], "parents": []},
    {"ko": "김영임", "vi": "Minh Thương", "call": "chị Thương", "gender": "F", "spouse": None, "children": [], "parents": []},
    {"ko": "김대훈", "vi": "Huấn", "call": "anh Huấn", "gender": "M", "spouse": None, "children": [], "parents": []},
    {"ko": "박준우", "vi": "Duy", "call": "anh Duy", "gender": "M", "spouse": None, "children": [], "parents": ["박정환", "원혜진"]},
]

MEMBER_BY_KO = {m["ko"]: m for m in MEMBERS}

# Roles qualification lists
CHAIRMAN_CANDIDATES = ["김대훈", "김한빈", "김종현", "박준우", "최찬호"]
PRAYER_CANDIDATES = ["최찬호", "김대훈", "김한빈", "김종현", "박준우", "한도희", "김종배", "김재윤", "박정환", "박철현", "한상현", "이종명", "김동주", "송제홍"]
TALK10_CANDIDATES = ["김대훈", "김한빈", "김종현", "박준우", "최찬호"]
GEMS_CANDIDATES = ["김대훈", "김한빈", "김종현", "박준우", "최찬호", "한도희", "김종배", "김재윤", "박정환", "박철현", "한상현", "이종명", "김동주", "송제홍"]
READING_CANDIDATES = ["김대훈", "김한빈", "김종현", "박준우", "최찬호", "한도희", "김종배", "김재윤", "박정환", "박철현", "한상현", "이종명", "김동주", "송제홍"]
CBS_CONDUCTOR_CANDIDATES = ["김대훈", "김한빈", "김종현", "박준우", "최찬호"]
CBS_READER_CANDIDATES = ["김대훈", "김한빈", "김종현", "박준우", "최찬호"]

def can_pair(p1_ko, p2_ko):
    if p1_ko == p2_ko:
        return False
    m1 = MEMBER_BY_KO[p1_ko]
    m2 = MEMBER_BY_KO[p2_ko]
    # Couple check
    if m1["spouse"] == p2_ko:
        return True
    # Parent-child check
    if p2_ko in m1["children"] or p2_ko in m1["parents"]:
        return True
    # Otherwise same gender
    return m1["gender"] == m2["gender"]

print(f"Total members: {len(MEMBERS)}")
print(f"Brothers: {len([m for m in MEMBERS if m['gender'] == 'M'])}")
print(f"Sisters: {len([m for m in MEMBERS if m['gender'] == 'F'])}")
