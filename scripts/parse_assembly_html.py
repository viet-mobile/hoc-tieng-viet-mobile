import re, html

def clean_html(raw):
    # Extract article or main body
    m = re.search(r'<article[^>]*>(.*?)</article>', raw, re.DOTALL)
    if not m:
        m = re.search(r'<div[^>]+id=[\"\']article[\"\'][^>]*>(.*?)</div>\s*</div>', raw, re.DOTALL)
    body = m.group(1) if m else raw
    
    # replace headings and paragraphs with newlines
    body = re.sub(r'<(?:h[1-6]|p|li|div|header)[^>]*>', '\n', body)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = html.unescape(body)
    lines = [re.sub(r'\s+', ' ', l).strip() for l in body.split('\n')]
    lines = [l for l in lines if l]
    return lines

for k in ['ko_prog', 'ko_q', 'vi_prog', 'vi_q']:
    with open(f"scripts/{k}.html", "r", encoding="utf-8") as f:
        lines = clean_html(f.read())
    print(f"=== {k} ({len(lines)} lines) ===")
    for l in lines[:25]:
        print("  ", l)
    print("...")
