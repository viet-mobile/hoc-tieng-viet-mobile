"""Manual annotation persistence and changed-recording fail-closed regression."""
import copy
import json
import pathlib
import sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from apply_vocal_manual_segments import apply_manual
proofs = json.load(open(ROOT/'scripts/data/vi_vocal_segments.json', encoding='utf-8'))
overrides = json.load(open(ROOT/'scripts/data/vi_vocal_manual_segments.json', encoding='utf-8'))
checks = 0
for key in ('41','46'):
    assert len(proofs[key]['lines']) == 12
    assert [(l['s'],l['e'],l['text']) for l in proofs[key]['lines']] == [(l['s'],l['e'],l['text']) for l in overrides[key]['lines']]
    assert all(l['enabled'] for l in proofs[key]['lines'])
    checks += 12
    for field in ('checksum','mediaKey','format'):
        changed = copy.deepcopy(proofs); changed[key][field] = 'changed'
        try: apply_manual(changed, str(ROOT))
        except ValueError: checks += 1
        else: raise AssertionError('changed recording accepted')
    changed = copy.deepcopy(proofs); changed[key]['lines'][0]['text'] = 'wrong lyric'
    try: apply_manual(changed, str(ROOT))
    except ValueError: checks += 1
    else: raise AssertionError('changed lyric accepted')
# Simulate repackaging model candidates: manual intervals must win again.
changed = copy.deepcopy(proofs)
for key in ('41','46'):
    for line in changed[key]['lines']: line.update(s=0,e=0,enabled=False)
apply_manual(changed, str(ROOT))
for key in ('41','46'): assert changed[key]['lines'] == proofs[key]['lines']
print(f'{checks} manual timing / recording identity checks passed')
