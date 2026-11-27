import urllib.request, urllib.parse, html, re

urls = {
    "vi_prog": "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-giám-thị-vòng-quanh/Người-tin-cậy-Đức-Giê-hô-va-thật-hạnh-phúc/",
    "vi_q": "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-giám-thị-vòng-quanh/Tìm-lời-giải-đáp-cho-những-câu-hỏi-sau/"
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

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
