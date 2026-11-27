import urllib.request, json

lang_codes = [
    ("vi", "VT"),
    ("cs", "B"),
    ("zh_cn", "CHS"),
    ("zh", "CH"),
    ("en", "E"),
    ("fr", "F"),
    ("de", "X"),
    ("hu", "H"),
    ("id", "IN"),
    ("ja", "J"),
    ("ko", "KO"),
    ("pl", "P"),
]

for app_lang, wt_code in lang_codes:
    found = False
    for pub in ['nwt', 'bi12']:
        url = f'https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?pub={pub}&output=json&fileformat=EPUB&langwritten={wt_code}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                files = data.get('files', {}).get(wt_code, {}).get('EPUB', [])
                if files:
                    file_info = files[0].get('file', {})
                    print(f"[{app_lang}] wt={wt_code} pub={pub}: {file_info.get('url')} ({file_info.get('filesize', 0)/(1024*1024):.1f} MB)")
                    found = True
                    break
        except Exception as e:
            pass
    if not found:
        print(f"[{app_lang}] wt={wt_code}: NOT FOUND")
