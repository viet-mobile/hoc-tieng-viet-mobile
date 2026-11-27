import urllib.request, urllib.parse, html, re

urls = {
    "ko_prog": "https://www.jw.org/ko/라이브러리/프로그램/지부-대표자와-함께하는-2026-2027-순회-대회-프로그램/여호와-안에서-더없이-기뻐하십시오/",
    "ko_q": "https://www.jw.org/ko/라이브러리/프로그램/지부-대표자와-함께하는-2026-2027-순회-대회-프로그램/아래-질문에-대한-답을-찾아-보십시오/",
    "vi_prog": "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-anh-đại-diện-chi-nhánh/Hãy-hoan-hỉ-nơi-Đức-Giê-hô-va/",
    "vi_q": "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-anh-đại-diện-chi-nhánh/Tìm-lời-giải-đáp-cho-những-câu-hỏi-sau/"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

for key, u in urls.items():
    # URL encode path properly if needed
    parts = urllib.parse.urlsplit(u)
    encoded_path = urllib.parse.quote(parts.path)
    encoded_url = urllib.parse.urlunsplit((parts.scheme, parts.netloc, encoded_path, parts.query, parts.fragment))
    try:
        req = urllib.request.Request(encoded_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read().decode('utf-8')
            print(f"[{key}] Fetched {len(content)} bytes")
            with open(f"scripts/{key}.html", "w", encoding="utf-8") as f:
                f.write(content)
    except Exception as e:
        print(f"[{key}] Error fetching: {e}")
