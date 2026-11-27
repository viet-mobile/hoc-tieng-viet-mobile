import re, html

def clean_html(raw):
    m = re.search(r'<article[^>]*>(.*?)</article>', raw, re.DOTALL)
    if not m:
        m = re.search(r'<div[^>]+id=[\"\']article[\"\'][^>]*>(.*?)</div>\s*</div>', raw, re.DOTALL)
    body = m.group(1) if m else raw
    body = re.sub(r'<(?:h[1-6]|p|li|div|header)[^>]*>', '\n', body)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = html.unescape(body)
    lines = [re.sub(r'\s+', ' ', l).strip() for l in body.split('\n')]
    lines = [l for l in lines if l and l not in ['재생', 'MỞ', '답을 적는 칸', 'Câu trả lời của bạn', '이전', '다음', 'Trước', 'Tiếp theo']]
    return lines

for k in ['ko_prog', 'ko_q', 'vi_prog', 'vi_q']:
    with open(f"scripts/{k}.html", "r", encoding="utf-8") as f:
        lines = clean_html(f.read())
    print(f"=== {k} ===")
    for l in lines:
        print(l)
    print()
