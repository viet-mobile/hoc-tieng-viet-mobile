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
    {"date": "2026-11-07", "reason": "방학"},
    {"date": "2026-12-05", "reason": "천안 베트남어 순회대회 파이오니아 모임"},
    {"date": "2026-12-26", "reason": "군산 한국어 순회대회"},
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

# Regional editing boundary: [교과] / [16주 과정] overrides
# When None, build_app.py inherits the shared JW CURR_WEEKS, CURR_WELCOME, CURR_PHASES, CURR_ASSIGNMENTS.
JEONJU_CURR_WELCOME = None
JEONJU_CURR_PHASES = None
JEONJU_CURR_WEEKS = None
JEONJU_CURR_ASSIGNMENTS = None
