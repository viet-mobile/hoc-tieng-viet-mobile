import json, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
from regional_admin.timetable_spaced import reflow

def verify(plan):
    clock=0; general=[]; wt=[]; a=0; rest=0
    for p in plan:
        assert p[1]>0
        if p[2] is None: assert clock==50 and p[1]==10;rest+=p[1]
        else: assert 0<=p[2]<=p[1];a+=p[2]
        if p[3]=='mingle': assert clock==60 and p[1]==10
        if len(p)>5:
            if p[5]['kind']=='course-vocab':general.append((clock,p[1],p[5]['part']))
            else:wt.append((clock,p[1],p[5]['part']))
        clock+=p[1]
    assert clock==120 and a+rest/2==60
    assert general==[(s,7,i)for i,s in enumerate([8,22,36,70,84])]
    assert wt==[(s+7,2,i)for i,s in enumerate([8,22,36,70,84])]
    # The break and mandatory conversation practice pause the retrieval cadence.
    active=[s-(20 if s>=70 else 0)for s,_,_ in general]
    assert all(13<=b-a<=15 for a,b in zip(active,active[1:]))

original=json.loads((ROOT/'tests/fixtures/timetable_week1_before_spacing.json').read_text())
spaced=reflow(original);verify(spaced);assert reflow(spaced)==spaced
fixed={'open','close','homework','mingle','break','vocab','slack'}
topics={p[0].removesuffix(' (이어서)')for p in original if p[3]not in fixed}
assert topics=={p[0].removesuffix(' (이어서)')for p in spaced if p[3]not in fixed}
guide=json.loads((ROOT/'regional_admin/teaching_guide.json').read_text())['jeonju']
for u in guide['units']:
    if u['unit']<=15:verify(u['timePlan'])
    for p in u['timePlan']:assert guide['viText'].get(p[0].removesuffix(' (이어서)'))
assert not any(len(p)>5 for p in guide['units'][-1]['timePlan'])
print('15 class timetables: spaced retrieval, 120 minutes, A/B balance, all topics, and Vietnamese labels verified.')
