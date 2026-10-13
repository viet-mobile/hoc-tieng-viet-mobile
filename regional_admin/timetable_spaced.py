"""Reflow a 120-minute class around five spaced vocabulary retrieval blocks."""
import math

STARTS = (8, 22, 36, 70, 84)
DAYS = ('월요일', '화요일', '수요일', '목요일', '금요일')
VI_DAYS = ('thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu')

def apportion(weights, total, minimum=0):
    if minimum * len(weights) > total:
        raise ValueError('Too many teaching items for the available minutes')
    remaining = total - minimum * len(weights)
    distributable = [max(0,w-minimum) for w in weights]
    raw = [remaining * w / sum(distributable) for w in distributable]
    out = [minimum + math.floor(v) for v in raw]
    for i in sorted(range(len(out)), key=lambda i: (-(raw[i] % 1), i))[:total-sum(out)]:
        out[i] += 1
    return out

def reflow(plan):
    if any(len(p)>5 and p[5].get('kind')=='course-vocab' for p in plan):
        return plan
    fixed = {reason: next(p[:] for p in plan if p[3]==reason) for reason in ('open','close','homework','mingle','break')}
    if [fixed[k][1] for k in ('open','close','homework','mingle','break')] != [4,4,5,10,10]:
        raise ValueError('Unexpected class structure; review timetable before reflow')
    core = [p[:] for p in plan if p[3] not in ('open','close','homework','mingle','break','vocab','slack')]
    durations = apportion([p[1] for p in core], 42, 1)
    ideal = [d*p[2]/p[1] for p,d in zip(core,durations)]
    assigned = [min(d,round(a)) for d,a in zip(durations,ideal)]
    while sum(assigned)!=21:
        direction=1 if sum(assigned)<21 else -1
        eligible=[i for i,d in enumerate(durations) if (assigned[i]<d if direction>0 else assigned[i]>0)]
        i=max(eligible,key=lambda j: (ideal[j]-assigned[j])*direction)
        assigned[i]+=direction
    for p,d,a in zip(core,durations,assigned):p[1:3]=[d,a]
    output=[fixed['open']]; index=0; offset=0; used_a=0
    def fill(minutes):
        nonlocal index,offset,used_a
        while minutes:
            p=core[index]; take=min(minutes,p[1]-offset)
            end_a=round(p[2]*(offset+take)/p[1]); a=end_a-used_a
            name=p[0].removesuffix(' (이어서)')+(' (이어서)' if offset or p[0].endswith(' (이어서)') else '')
            output.append([name,take,a,p[3],p[4]])
            minutes-=take;offset+=take;used_a=end_a
            if offset==p[1]:index+=1;offset=0;used_a=0
    clock=4
    for part,start in enumerate(STARTS):
        if part==3:
            fill(50-clock);output.extend([fixed['break'],fixed['mingle']]);clock=70
        fill(start-clock)
        output.extend([
            [f'베트남어 어휘 학습 · {DAYS[part]} 과제 묶음 ({part+1}/5)',7,3,'vocab','stand',{'kind':'course-vocab','part':part}],
            [f'파수대 어휘 학습 · {DAYS[part]} 과제 묶음 ({part+1}/5)',2,1,'vocab','stand',{'kind':'watchtower-vocab','part':part}],
        ])
        clock=start+9
    fill(111-clock);output.extend([fixed['homework'],fixed['close']])
    assert index==len(core) and not offset
    assert sum(p[1] for p in output)==120
    assert sum(p[2] or 0 for p in output)+5==60
    return output
