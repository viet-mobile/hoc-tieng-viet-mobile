import json, re, os, zipfile, html

with open('bible_cited_verses.json', encoding='utf-8') as f:
    cur_data = json.load(f)

new_verses = [(20, 16, 20), (19, 50, 15), (46, 9, 19), (20, 16, 3), (20, 22, 6)]

LANG_CONFIGS = [
    ('vi', 'VT', '베트남어'),
    ('cs', 'B', '체코어'),
    ('zh_cn', 'CHS', '중국어(간체)'),
    ('zh', 'CH', '중국어(번체)'),
    ('en', 'E', '영어'),
    ('fr', 'F', '프랑스어'),
    ('de', 'X', '독일어'),
    ('hu', 'H', '헝가리어'),
    ('id', 'IN', '인도네시아어'),
    ('ja', 'J', '일본어'),
    ('ko', 'KO', '한국어'),
    ('pl', 'P', '폴란드어'),
]

class EpubExtractor:
    def __init__(self, epub_path):
        self.z = zipfile.ZipFile(epub_path, 'r')
        self.namelist = set(self.z.namelist())
        self.chapter_files = {}
        self.book_names = {}
        self._init_files()

    def _init_files(self):
        toc = self.z.read("OEBPS/toc.xhtml").decode('utf-8')
        for b in range(1, 67):
            m = re.search(r'<a[^>]+href=[\"\']biblechapternav' + str(b) + r'\.xhtml[\"\'][^>]*>([^<]+)</a>', toc)
            if m: self.book_names[b] = m.group(1).strip()
            nav_file = f"OEBPS/biblechapternav{b}.xhtml"
            if nav_file in self.namelist:
                content = self.z.read(nav_file).decode('utf-8')
                ch_links = re.findall(r'<a[^>]+href=[\"\']([^\"]+)[\"\'][^>]*>(\d+)</a>', content)
                for href, ch in ch_links:
                    self.chapter_files[(b, int(ch))] = "OEBPS/" + href.split('#')[0]

    def clean_text(self, raw, verse):
        s = raw
        s = re.sub(r'<a class=[\"\']xrefLink[^>]*>.*?</a>', '', s)
        s = re.sub(r'<a[^>]+epub:type=[\"\']noteref[\"\'][^>]*>.*?</a>', '', s)
        s = re.sub(r'<sup[^>]*>.*?</sup>', '', s)
        s = re.sub(r'<span class=[\"\']style-[a-z][\"\']>[^<]*\[<em>[^<]*</em>\]</span>', '', s)
        s = re.sub(r'<p[^>]*class=[\"\'][^\"\']*ss[^\"\']*[\"\']>[^<]*</p>', '', s)
        s = re.sub(r'[\u0590-\u05FF]\s*\[[^\]]+\]', '', s)
        s = re.sub(r'<rt>.*?</rt>', '', s)
        s = re.sub(r'<rp>.*?</rp>', '', s)
        s = re.sub(r'</?(?:p|div|br|h\d|li|ul|ol)[^>]*>', ' ', s)
        s = re.sub(r'<[^>]+>', '', s)
        s = re.sub(r'<\s*span\s*$', '', s)
        s = html.unescape(s)
        s = re.sub(r'[\*\+]', '', s)
        s = re.sub(r'[ \t\r\f\v]+', ' ', s)
        s = re.sub(r'\n\s*\n', '\n', s).strip()
        s = re.sub(r'\s+', ' ', s).strip()
        s = re.sub(rf'^[>»\s]*{verse}\s*', '', s).strip()
        s = re.sub(r'^[>»\s]+', '', s).strip()
        s = re.sub(r'[\u0590-\u05FF]\s*(?:\[[^\]]*\]|\([^\)]*\))?', '', s).strip()
        if ' ^ ' in s:
            s = re.split(r'\s+\^\s+', s)[0].strip()
        s = re.sub(r'\s+', ' ', s).strip()
        return s

    def extract_chapter_verses(self, book, chapter):
        ch_file = self.chapter_files.get((book, chapter))
        if not ch_file or ch_file not in self.namelist:
            return {}
        content = self.z.read(ch_file).decode('utf-8')
        pat = rf'id=[\"\']chapter{chapter}_verse(\d+)[\"\']'
        matches = list(re.finditer(pat, content))
        res = {}
        for i, m in enumerate(matches):
            vs_num = int(m.group(1))
            start_pos = m.end()
            if i + 1 < len(matches):
                end_pos = matches[i + 1].start()
            else:
                end_m = re.search(r'</div>\s*</div>|id=[\"\']bibleText[\"\']', content[start_pos:])
                end_pos = start_pos + end_m.start() if end_m else start_pos + 3000
            verse_raw = content[start_pos:end_pos]
            res[vs_num] = self.clean_text(verse_raw, vs_num)
        return res

chapters_needed = {(20, 16), (19, 50), (46, 9), (20, 22)}

for app_lang, wt_code, display_name in LANG_CONFIGS:
    epub_path = f"jw_extraction/bible_epubs/nwt_{wt_code}.epub"
    if not os.path.exists(epub_path):
        continue
    extractor = EpubExtractor(epub_path)
    for b, c in chapters_needed:
        verses_in_ch = extractor.extract_chapter_verses(b, c)
        for (vb, vc, vv) in new_verses:
            if vb == b and vc == c:
                key = f"{b}:{c}:{vv}"
                if key not in cur_data['verses']:
                    cur_data['verses'][key] = {}
                if vv in verses_in_ch:
                    cur_data['verses'][key][app_lang] = verses_in_ch[vv]

with open('bible_cited_verses.json', 'w', encoding='utf-8') as f:
    json.dump(cur_data, f, ensure_ascii=False, indent=2)

print("Saved updated bible_cited_verses.json with all Gunsan assembly verses!")
