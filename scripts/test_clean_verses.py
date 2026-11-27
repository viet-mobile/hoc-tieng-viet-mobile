import json, re

with open('bible_cited_verses.json', encoding='utf-8') as f:
    d = json.load(f)

count_caret = 0
for k, vdict in d['verses'].items():
    for lang, text in vdict.items():
        if ' ^ ' in text:
            count_caret += 1

print(f"Total verse instances with ' ^ ': {count_caret}")

# Let's clean them and update bible_cited_verses.json
hebrew_pat = re.compile(r'[\u0590-\u05FF]\s*(?:\[[^\]]+\]|\([^\)]+\))')

cleaned_count = 0
for k, vdict in d['verses'].items():
    for lang, text in list(vdict.items()):
        new_text = text
        if ' ^ ' in new_text:
            new_text = re.split(r'\s+\^\s+', new_text)[0].strip()
        new_text = hebrew_pat.sub('', new_text).strip()
        # Clean extra spaces
        new_text = re.sub(r'\s+', ' ', new_text).strip()
        if new_text != text:
            vdict[lang] = new_text
            cleaned_count += 1

print(f"Cleaned {cleaned_count} verse entries.")

with open('bible_cited_verses.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print("Saved cleaned bible_cited_verses.json")
