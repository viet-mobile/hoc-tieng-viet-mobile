import urllib.request, urllib.parse, html, re

urls = {
    "gunsan_prog": "https://www.jw.org/ko/라이브러리/프로그램/순회-감독자와-함께하는-2026-2027-순회-대회-프로그램/여호와를-신뢰하는-자는-행복합니다/",
    "gunsan_q": "https://www.jw.org/ko/라이브러리/프로그램/순회-감독자와-함께하는-2026-2027-순회-대회-프로그램/아래-질문에-대한-답을-찾아-보십시오/"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

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

for key, u in urls.items():
    parts = urllib.parse.urlsplit(u)
    encoded_path = urllib.parse.quote(parts.path)
    encoded_url = urllib.parse.urlunsplit((parts.scheme, parts.netloc, encoded_path, parts.query, parts.fragment))
    try:
        req = urllib.request.Request(encoded_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode('utf-8')
            lines = clean_html(content)
            print(f"=== {key} ({len(lines)} lines) ===")
            for l in lines:
                print(l)
            print()
    except Exception as e:
        print(f"[{key}] Error fetching: {e}")
