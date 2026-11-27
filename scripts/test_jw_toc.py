import urllib.request
import re

url = "https://www.jw.org/vi/thu-vien/kinh-thanh/nwt/cac-sach/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode("utf-8")

print("HTML length:", len(html))
links = re.findall(r'href="(/vi/thu-vien/kinh-thanh/nwt/cac-sach/[^"]+/)"', html)
print("Unique book links:", len(set(links)))
for l in sorted(list(set(links)))[:15]:
    print(" ", l)
