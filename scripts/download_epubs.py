import os, urllib.request, json, time

cache_dir = os.path.join("jw_extraction", "bible_epubs")
os.makedirs(cache_dir, exist_ok=True)

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
    dest = os.path.join(cache_dir, f"nwt_{wt_code}.epub")
    if os.path.exists(dest) and os.path.getsize(dest) > 1000000:
        print(f"[{app_lang}] {wt_code}: Already cached ({os.path.getsize(dest)/(1024*1024):.1f} MB)")
        continue
    
    # Query API for url
    url = f'https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?pub=nwt&output=json&fileformat=EPUB&langwritten={wt_code}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            files = data.get('files', {}).get(wt_code, {}).get('EPUB', [])
            if files:
                epub_url = files[0].get('file', {}).get('url')
                print(f"[{app_lang}] Downloading {wt_code} from {epub_url}...")
                req_file = urllib.request.Request(epub_url, headers={'User-Agent': 'Mozilla/5.0'})
                t0 = time.time()
                with urllib.request.urlopen(req_file) as r, open(dest, "wb") as f_out:
                    f_out.write(r.read())
                dt = time.time() - t0
                print(f"  -> Saved {dest} ({os.path.getsize(dest)/(1024*1024):.1f} MB in {dt:.1f}s)")
    except Exception as e:
        print(f"[{app_lang}] Error downloading {wt_code}:", e)
