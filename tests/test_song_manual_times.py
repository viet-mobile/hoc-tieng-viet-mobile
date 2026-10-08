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
for key in overrides:
    assert len(proofs[key]['lines']) == len(overrides[key]['lines'])
    assert [(l['s'],l['e'],l['text']) for l in proofs[key]['lines']] == [(l['s'],l['e'],l['text']) for l in overrides[key]['lines']]
    assert all(l['enabled'] for l in proofs[key]['lines'])
    checks += len(overrides[key]['lines'])
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
for key in overrides:
    for line in changed[key]['lines']: line.update(s=0,e=0,enabled=False)
apply_manual(changed, str(ROOT))
for key in overrides: assert changed[key]['lines'] == proofs[key]['lines']
print(f'{checks} manual timing / recording identity checks passed')
# Explicit children selection survives rebuilding candidates from the previous general video.
for key, override in overrides.items():
    if not override.get('selectedRecording'): continue
    changed=copy.deepcopy(proofs);changed[key]['mediaKey']=override['replacesMediaKey'];changed[key]['src']='jwbon'
    apply_manual(changed,str(ROOT))
    assert changed[key]['mediaKey']==override['mediaKey'] and changed[key]['src']=='pksjj'
    assert changed[key]['lines']==proofs[key]['lines']
# Confirmed sung variants remain separate from book text and survive regeneration.
import tempfile
with tempfile.TemporaryDirectory() as folder:
    root=pathlib.Path(folder);(root/'scripts/data').mkdir(parents=True)
    altered=copy.deepcopy(overrides);line=altered['46']['lines'][0]
    line.update(vocalText='Lời khác do người dùng xác nhận.',vocalTextSource='User-reviewed children recording')
    path=root/'scripts/data/vi_vocal_manual_segments.json';path.write_text(json.dumps(altered),encoding='utf-8')
    changed=copy.deepcopy(proofs);apply_manual(changed,folder)
    assert changed['46']['lines'][0]['text']==proofs['46']['lines'][0]['text']
    assert changed['46']['lines'][0]['vocalText']==line['vocalText']
    del line['vocalTextSource'];path.write_text(json.dumps(altered),encoding='utf-8')
    try:apply_manual(copy.deepcopy(proofs),folder)
    except ValueError:pass
    else:raise AssertionError('Unsourced alternate lyric accepted')
print('Explicit children source transition and sourced alternate lyric persistence passed')
