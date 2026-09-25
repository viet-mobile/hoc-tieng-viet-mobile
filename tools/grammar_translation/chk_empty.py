import sys,json,re,os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gram_sections import all_sections
d=json.load(open('general_pdf_grammar_ai_translations.json',encoding='utf-8'))
secs=all_sections()
h=re.compile('[가-힣]')
for i,(k,s) in enumerate(secs):
  empty=not any(l.strip() for l in s['lines'])
  hk=any(h.search(l) for l in s['lines'])
  if (empty or not hk): print(i,k,repr(s['title']),'empty' if empty else 'noKo', k in d, list(d.get(k,{}).keys())[:3])
