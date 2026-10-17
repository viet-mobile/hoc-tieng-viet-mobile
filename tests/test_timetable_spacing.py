import json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from regional_admin.timetable_owners import rebuild, owner_of, has_rhyme

OWNERS = {'A', 'B', 'assist', 'group', None}


def verify(plan, unit):
    clock = 0; general = []; wt = []; after_mingle = False; seen_vocab_after = False
    for p in plan:
        assert p[1] > 0 and (p[1] * 2) % 1 == 0
        assert p[2] in OWNERS
        if p[2] is None:
            assert clock == (64 if unit == 16 else 50) and p[1] == 10
        if p[3] == 'mingle':
            assert clock == (74 if unit == 16 else 60) and p[1] == 10 and p[2] == 'group'
            after_mingle = True
        elif len(p) > 5:
            if after_mingle:
                seen_vocab_after = True
            (general if p[5]['kind'] == 'course-vocab' else wt).append((clock, p[1], p[5]['part'], p[2]))
        elif p[2] == 'group':
            # a walk-around activity is one piece, directly after the walk-around practice, never cut by a vocabulary block
            assert after_mingle and not seen_vocab_after and not p[0].endswith(' (이어서)'), p[0]
        clock += p[1]
    assert clock == 120
    assert not any(p[0].endswith(' (이어서)') for p in plan), 'every item is one piece'
    if general:
        block = 6.5 if unit <= 2 else 4.5
        g = sum(p[1] for p in plan if len(p) == 5 and p[2] == 'group' and p[3] != 'mingle')
        ideal = [8, 22, 36, 70 + g, 84 + g]
        owners = ['assist', 'group', 'group', 'group', 'assist']
        assert [(d, i, o) for _, d, i, o in general] == [(block, i, owners[i]) for i in range(5)]
        assert wt == [(s + block, 1.5, i, 'B' if owners[i] == 'assist' else 'group') for i, (s, *_ ) in enumerate(general)]
        starts = [s for s, *_ in general]
        assert all(abs(a - b) <= 9 for a, b in zip(starts, ideal)), starts
        assert starts == sorted(starts) and starts[2] < 50 < starts[3]


guide = json.loads((ROOT / 'regional_admin/teaching_guide.json').read_text())['jeonju']
for u in guide['units']:
    verify(u['timePlan'], u['unit'])
    assert rebuild(u['timePlan'], u['unit']) == u['timePlan']
    for p in u['timePlan']:
        assert guide['viText'].get(p[0].removesuffix(' (이어서)'))
        base = p[0].removesuffix(' (이어서)')
        # user's principles
        if base.startswith('성조연습'):
            assert p[2] == 'B'
        if '성경 책명 읽기 연습' in base:
            assert p[2] == 'assist'
        if any(k in base for k in ('문화', '일반 문법', '과제 확인', '마치는 노래')):
            assert p[2] == 'A', base
        if any(k in base for k in ('제공 연설', '일상 회화', '일상 생활 문장', '이웃 사람과의 대화')):
            assert p[2] == ('B' if u['unit'] >= 4 else 'A'), base
        if p[4] == 'move':
            assert p[2] == 'group', base
    for p in u['timePlan']:
        b = p[0]
        if b.startswith('베트남어 제공 연설 '): assert p[1] == 5, b
        if '성경 책명 읽기 연습' in b: assert p[1] == (7 if b.endswith('복습') else 5), b
        if b.startswith('신권 용어'): assert p[1] == 5, b
        if b == '성조연습, 연속성조': assert p[1] == 8, b
    if u['date'] == '2026-10-17':
        names = [p[0] for p in u['timePlan']]
        assert names[1] == '베트남어 발음 – 자음, 모음 복습' and u['timePlan'][1][1:3] == [5, 'B']
        assert dict((p[0], p[1:3]) for p in u['timePlan'])['베트남어 숫자 복습'] == [7, 'B']
        assert dict((p[0], p[1:3]) for p in u['timePlan'])['베트남어 성경 책명 읽기 연습 1 (창세기-시편) 복습'] == [7, 'assist']
    assert u.get('assistant') == ('Bình' if u['date'] == '2026-11-15' else None)
assert [has_rhyme(1, i) for i in range(5)] == [True] * 5 and [has_rhyme(2, i) for i in range(5)] == [True] * 5
last = guide['units'][-1]['timePlan']
assert next(p for p in last if p[0].startswith('파수대 집회 실연'))[1] == 60
assert [(p[0], p[1], p[2]) for p in last if '격려사' in p[0]] == [('A 강사 격려사', 15, 'A'), ('B 강사 격려사', 15, 'B')]
assert not any(p[3] in ('mingle', 'homework', 'break') or p[0].startswith('졸업') for p in last)
assert [p[0] for p in last if p[0].startswith('학생들 경험담')] == ['학생들 경험담 발표', '학생들 경험담 재연']
assert last[-1][0] == '마치는 노래·기도'
assert not any(has_rhyme(3, i) for i in range(5))
print('16 class timetables: one owner per item, 4 owners, group leaders for blocks 2-4, every item one piece, B takes talks/conversations from 10/31, 6:30 / 4:30 / 1:30 vocabulary blocks, spacing, 120 min, 11/15 Bình verified.')
