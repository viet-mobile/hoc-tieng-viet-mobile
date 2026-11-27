import json
from daily_conversations_data import DAILY_CONVERSATIONS

for c in DAILY_CONVERSATIONS:
    cid = c['id']
    for idx, t in enumerate(c.get('turns', [])):
        ko = t.get('ko', '')
        vi = t.get('vi', '')
        who = t.get('who', {}).get('vi', '')
        if any(w in ko for w in ['형', '오빠', '동생', '누나', '언니', '삼촌', '이모', '조카', '어르신', '당신', '그대', '그녀', '친구']):
            print(f'{cid}[{idx}] ({who}): VI={vi} | KO={ko}')
