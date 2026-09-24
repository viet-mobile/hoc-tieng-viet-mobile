# -*- coding: utf-8 -*-
"""
울산 베트남어 학습반 (Ulsan Vietnamese class) -- regional class data.
Per user instruction: ULSAN schedule is currently unknown.
ULSAN dates must NOT be fabricated from Jeonju.
preliminary_meeting_date = None
course_start_date = None
course_end_date = None
cancellations = []
Public site displays a clean Korean "일정 미정" state until an administrator enters dates.
"""

ULSAN_PRELIMINARY_DATE = None
ULSAN_COURSE_START_DATE = None
ULSAN_COURSE_END_DATE = None
ULSAN_INTERVAL_DAYS = 7
ULSAN_CANCELLATIONS = []

ULSAN_INFO = {
    "name": "울산 베트남어 학습반",
    "nameEn": "Ulsan Vietnamese Class",
    "startDate": None,
    "endDate": None,
    "schedule": "매주 토요일",
    "kind": "fixed-term",
    "status": "unconfigured",  # 일정 미정
}

# Regional editing boundary: [교과] / [16주 과정] unconfigured initial state
# Displays clean "일정 미정" and "자료 미정" without fabricated dates or Jeonju curriculum.
ULSAN_CURR_WELCOME = {
    "title": {"ko": "2026-2027 울산 베트남어 학습반", "en": "Ulsan Vietnamese Class 2026-2027"},
    "body": [{"ko": "학습반 일정이 아직 정해지지 않았습니다 (일정 미정).", "en": "Class schedule has not been set yet (Schedule TBD)."}],
}
ULSAN_CURR_PHASES = []
ULSAN_CURR_WEEKS = [{"week": i, "items": [], "title": None, "note": None} for i in range(1, 17)]
ULSAN_CURR_ASSIGNMENTS = []
ULSAN_WEEKS = []

