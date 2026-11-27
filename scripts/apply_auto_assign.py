# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.abspath('.'))
import json
import re
from collections import defaultdict

from scripts.mwb_assigner import (
    MEMBERS, MEMBER_BY_KO, can_pair,
    CHAIRMAN_CANDIDATES, PRAYER_CANDIDATES, TALK10_CANDIDATES,
    GEMS_CANDIDATES, READING_CANDIDATES, CBS_CONDUCTOR_CANDIDATES, CBS_READER_CANDIDATES
)

with open('jeonju_mwb_data.py', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'json\.loads\(\'\'\'(.*?)\'\'\'\)', text, re.DOTALL)
weeks_data = json.loads(m.group(1))

def format_person(ko):
    m = MEMBER_BY_KO[ko]
    return f"{m['ko']} ({m['vi']}, {m['call']})"

def generate_assigned_weeks():
    counts = defaultdict(int)
    role_counts = defaultdict(lambda: defaultdict(int))
    used_pairs = set()

    updated_weeks = []

    for w_idx, week in enumerate(weeks_data):
        meta = week['meta']
        w = json.loads(json.dumps(week)) # deep copy
        week_assigned = set()

        def pick_candidate(candidate_list, role_name=None):
            available = [c for c in candidate_list if c not in week_assigned]
            if not available:
                available = candidate_list
            available.sort(key=lambda c: (counts[c], role_counts[role_name][c] if role_name else 0))
            chosen = available[0]
            week_assigned.add(chosen)
            counts[chosen] += 1
            if role_name:
                role_counts[role_name][chosen] += 1
            return chosen

        # 1. Chairman
        c_chair = pick_candidate(CHAIRMAN_CANDIDATES, 'chairman')
        w['chairman'] = format_person(c_chair)

        # 2. 10-min Talk (Item 1)
        c_talk = pick_candidate(TALK10_CANDIDATES, 'talk10')
        w['items'][0]['speaker'] = format_person(c_talk)

        # 3. CBS Conductor
        c_cbs_cond = pick_candidate(CBS_CONDUCTOR_CANDIDATES, 'cbs_cond')

        # 4. CBS Reader
        c_cbs_read = pick_candidate(CBS_READER_CANDIDATES, 'cbs_read')

        # 5. Spiritual gems (Item 2)
        c_gems = pick_candidate(GEMS_CANDIDATES, 'gems')
        w['items'][1]['speaker'] = format_person(c_gems)

        # 6. Bible reading (Item 3)
        c_read = pick_candidate(READING_CANDIDATES, 'reading')
        w['items'][2]['assignee'] = format_person(c_read)

        # 7. Ministry items
        for it in w['items']:
            if it['section'] == 2:
                title_ko = (it.get('title') or {}).get('ko', '')
                title_vi = (it.get('title') or {}).get('vi', '')
                is_talk = '연설' in title_ko or 'Bài giảng' in title_vi

                if is_talk:
                    brother_cands = [m['ko'] for m in MEMBERS if m['gender'] == 'M']
                    assignee = pick_candidate(brother_cands, 'ministry_talk')
                    it['assignee'] = format_person(assignee)
                    it['assistant'] = None
                else:
                    all_cands = [m['ko'] for m in MEMBERS if m['ko'] not in week_assigned]
                    all_cands.sort(key=lambda c: (counts[c], role_counts['ministry'][c]))
                    assignee = all_cands[0]
                    week_assigned.add(assignee)
                    counts[assignee] += 1
                    role_counts['ministry'][assignee] += 1

                    avail_assistants = [m['ko'] for m in MEMBERS if m['ko'] not in week_assigned and can_pair(assignee, m['ko'])]
                    if not avail_assistants:
                        avail_assistants = [m['ko'] for m in MEMBERS if m['ko'] != assignee and can_pair(assignee, m['ko'])]

                    def pair_score(asst):
                        p_key = tuple(sorted([assignee, asst]))
                        used = 1 if p_key in used_pairs else 0
                        return (used, counts[asst], role_counts['ministry'][asst])

                    avail_assistants.sort(key=pair_score)
                    assistant = avail_assistants[0]
                    week_assigned.add(assistant)
                    counts[assistant] += 1
                    role_counts['ministry'][assistant] += 1
                    used_pairs.add(tuple(sorted([assignee, assistant])))

                    it['assignee'] = format_person(assignee)
                    it['assistant'] = format_person(assistant)

        # CBS in section 3
        for it in w['items']:
            if it.get('isCbs'):
                it['conductor'] = format_person(c_cbs_cond)
                it['reader'] = format_person(c_cbs_read)

        # 8. Opening prayer
        c_open_pr = pick_candidate(PRAYER_CANDIDATES, 'prayer')
        w['opening_prayer'] = format_person(c_open_pr)

        # 9. Closing prayer
        c_close_pr = pick_candidate(PRAYER_CANDIDATES, 'prayer')
        w['closing_prayer'] = format_person(c_close_pr)

        updated_weeks.append(w)

    return updated_weeks

assigned_weeks = generate_assigned_weeks()

# Save to jeonju_mwb_data.py
py_content = "# -*- coding: utf-8 -*-\n"
py_content += '"""\n'
py_content += '전주 학습반을 위한 2026년 12월 7일주 ~ 2027년 2월 15일주 (11주간)\n'
py_content += '그리스도인 생활과 봉사—집회 교재 (Lối sống và thánh chức—Chương trình nhóm họp)\n'
py_content += '베트남어-한국어 대조 데이터 및 자동 배정된 학생/사회자/낭독자/기도 임명 명단\n'
py_content += '"""\n'
py_content += 'import json\n\n'
py_content += "JEONJU_MWB_PROGRAMS = json.loads('''" + json.dumps(assigned_weeks, ensure_ascii=False) + "''')\n"

with open('jeonju_mwb_data.py', 'w', encoding='utf-8') as f:
    f.write(py_content)

print("Saved assigned weeks to jeonju_mwb_data.py successfully!")
