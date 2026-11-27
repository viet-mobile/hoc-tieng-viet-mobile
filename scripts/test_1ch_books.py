import zipfile, re

z = zipfile.ZipFile("jw_extraction/bible_epubs/nwt_VT.epub", 'r')
toc = z.read("OEBPS/toc.xhtml").decode('utf-8')

for name in ['Áp-đia', 'Phi-lê-môn', '2 Giăng', '3 Giăng', 'Giu-đe']:
    m = re.search(r'<a[^>]+href=\"([^\"]+)\"[^>]*>' + re.escape(name) + r'</a>', toc)
    if m:
        print(f"{name} -> {m.group(1)}")
