import urllib.request, zipfile, io, re

url = "https://cfp2.jw-cdn.org/a/2e6ccc/5/o/nwt_VT.epub"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    data = resp.read()

with zipfile.ZipFile(io.BytesIO(data)) as z:
    toc = z.read("OEBPS/toc.xhtml").decode('utf-8')
    links = re.findall(r'<a[^>]+href=\"([^\"]+)\"[^>]*>([^<]+)</a>', toc)
    print("Total links in toc.xhtml:", len(links))
    # Filter out intro/appendix links
    for href, text in links:
        if any(w in href for w in ['nav', '100106']):
            print(f"  {text} -> {href}")
