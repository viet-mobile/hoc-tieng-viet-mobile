import urllib.request
import re

url = "https://www.jw.org/vi/thu-vien/kinh-thanh/nwt/cac-sach/thi-thien/37/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode("utf-8")

# Find occurrences of 19037029 in the second half
matches = [m.start() for m in re.finditer("19037029", html)]
print("Matches for 19037029:", matches)
for pos in matches:
    print("--- POS:", pos)
    print(html[pos-100:pos+300])
