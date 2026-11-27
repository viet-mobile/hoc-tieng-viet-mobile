import os, json, re, zipfile, html, time
from bible_lookup_def import LOOKUP

ONE_CHAPTER_BOOKS = {31, 57, 63, 64, 65}

LANG_CONFIGS = [
    ("vi", "VT", "Tiếng Việt"),
    ("cs", "B", "Čeština"),
    ("zh_cn", "CHS", "简体中文"),
    ("zh", "CH", "繁體中文"),
    ("en", "E", "English"),
    ("fr", "F", "Français"),
    ("de", "X", "Deutsch"),
    ("hu", "H", "Magyar"),
    ("id", "IN", "Bahasa Indonesia"),
    ("ja", "J", "日本語"),
    ("ko", "KO", "한국어"),
    ("pl", "P", "Polski"),
]

def parse_verses_part(v_str):
    if not v_str:
        return []
    verses = []
    parts = re.split(r'[,;、]', v_str)
    for p in parts:
        p = p.strip()
        if not p:
            continue
        m_range = re.match(r'^(\d+)\s*[-–~]\s*(\d+)$', p)
        if m_range:
            start, end = int(m_range.group(1)), int(m_range.group(2))
            if start <= end and end - start <= 50:
                verses.extend(range(start, end + 1))
        else:
            m_single = re.match(r'^(\d+)', p)
            if m_single:
                verses.append(int(m_single.group(1)))
    return sorted(list(set(verses)))

def parse_scripture_ref(ref_str):
    s = ref_str.strip().strip('()[]{}“”"\'.,—')
    m = re.match(r'^([123]\s+[^\d:]+|[^\d:]+)\s+(\d+)(?:\s*:\s*(.*))?$', s)
    if not m:
        return None
    b_name = m.group(1).strip().lower()
    ch_num = int(m.group(2))
    v_part = m.group(3)
    b_num = LOOKUP.get(b_name) or LOOKUP.get(b_name.replace('-', ' ').strip())
    if not b_num:
        return None
    if b_num in ONE_CHAPTER_BOOKS and not v_part:
        chapter = 1
        verses = [ch_num]
    else:
        chapter = ch_num
        verses = parse_verses_part(v_part) if v_part else [1]
    return {"book": b_num, "chapter": chapter, "verses": verses, "raw": ref_str}

print("Collecting all scripture citations from codebase...")
all_target_verses = set()
pattern = re.compile(r'\b([123]\s+[^\d:()\[\]{}“”"\'.,—\n]+|[^\d:()\[\]{}“”"\'.,—\n]+)\s+(\d+)(?:\s*:\s*([\d\s,–~-]+))?')

def extract_from_text(txt):
    if not txt:
        return
    for m in pattern.finditer(txt):
        parsed = parse_scripture_ref(m.group(0).strip())
        if parsed:
            b, c = parsed['book'], parsed['chapter']
            for v in parsed['verses']:
                all_target_verses.add((b, c, v))

# Scan files
if os.path.exists('watchtower_study_data.json'):
    with open('watchtower_study_data.json', 'r', encoding='utf-8') as f:
        wt = json.load(f)
    for s in wt.get('sheets', []):
        for r in s.get('rows', []):
            extract_from_text(r.get('vi', ''))
            extract_from_text(r.get('ko', ''))

if os.path.exists('neighbor_conversations_data.py'):
    with open('neighbor_conversations_data.py', 'r', encoding='utf-8') as f:
        extract_from_text(f.read())

if os.path.exists('enjoy_life_forever_data.json'):
    with open('enjoy_life_forever_data.json', 'r', encoding='utf-8') as f:
        elf = json.load(f)
    def scan_any(o):
        if isinstance(o, str): extract_from_text(o)
        elif isinstance(o, dict):
            for val in o.values(): scan_any(val)
        elif isinstance(o, list):
            for val in o: scan_any(val)
    scan_any(elf)

if os.path.exists('songs_data.json'):
    with open('songs_data.json', 'r', encoding='utf-8') as f:
        songs = json.load(f)
    scan_any(songs)

# Extra common study scriptures
all_target_verses.add((19, 37, 29))
all_target_verses.add((20, 3, 5))
all_target_verses.add((20, 3, 6))
all_target_verses.add((43, 3, 16))
all_target_verses.add((40, 24, 14))
all_target_verses.add((66, 21, 3))
all_target_verses.add((66, 21, 4))

print(f"Total target verses to extract: {len(all_target_verses)}")

class EpubExtractor:
    def __init__(self, epub_path):
        self.z = zipfile.ZipFile(epub_path, 'r')
        self.namelist = set(self.z.namelist())
        self.chapter_files = {} # (book, chapter) -> xhtml_filename
        self.book_names = {}    # book -> localized book name
        self._init_files()

    def _init_files(self):
        toc = self.z.read("OEBPS/toc.xhtml").decode('utf-8')
        for b in range(1, 67):
            m = re.search(r'<a[^>]+href=[\"\']biblechapternav' + str(b) + r'\.xhtml[\"\'][^>]*>([^<]+)</a>', toc)
            if m:
                self.book_names[b] = m.group(1).strip()
            
            nav_file = f"OEBPS/biblechapternav{b}.xhtml"
            if nav_file in self.namelist:
                content = self.z.read(nav_file).decode('utf-8')
                ch_links = re.findall(r'<a[^>]+href=[\"\']([^\"]+)[\"\'][^>]*>(\d+)</a>', content)
                for href, ch in ch_links:
                    self.chapter_files[(b, int(ch))] = "OEBPS/" + href.split('#')[0]

        one_ch_ids = {
            31: "1001061135.xhtml",
            57: "1001061161.xhtml",
            63: "1001061167.xhtml",
            64: "1001061168.xhtml",
            65: "1001061169.xhtml"
        }
        for b, fname in one_ch_ids.items():
            if f"OEBPS/{fname}" in self.namelist:
                self.chapter_files[(b, 1)] = f"OEBPS/{fname}"
                m = re.search(r'<a[^>]+href=[\"\']' + re.escape(fname) + r'[\"\'][^>]*>([^<]+)</a>', toc)
                if m:
                    self.book_names[b] = m.group(1).strip()

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
        s = re.sub(r'[\u0590-\u05FF]\s*\[[^\]]*\]?', '', s).strip()
        s = re.sub(r'<\s*span\s*$', '', s).strip()
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

verses_by_ref = {}
book_names_by_lang = {}
wtlocales = {}
lang_names = {}

for app_lang, wt_code, display_name in LANG_CONFIGS:
    wtlocales[app_lang] = wt_code
    lang_names[app_lang] = display_name
    epub_path = f"jw_extraction/bible_epubs/nwt_{wt_code}.epub"
    if not os.path.exists(epub_path):
        print(f"WARNING: Missing EPUB for {app_lang}: {epub_path}")
        continue
    t0 = time.time()
    print(f"[{app_lang}] Parsing nwt_{wt_code}.epub...")
    extractor = EpubExtractor(epub_path)
    book_names_by_lang[app_lang] = extractor.book_names
    
    needed_chapters = set((b, c) for b, c, v in all_target_verses)
    extracted_count = 0
    for b, c in needed_chapters:
        ch_verses = extractor.extract_chapter_verses(b, c)
        for vs_num, txt in ch_verses.items():
            key = f"{b}:{c}:{vs_num}"
            if (b, c, vs_num) in all_target_verses:
                if key not in verses_by_ref:
                    verses_by_ref[key] = {}
                verses_by_ref[key][app_lang] = txt
                extracted_count += 1
    dt = time.time() - t0
    print(f"  -> Extracted {extracted_count} verses for {app_lang} in {dt:.2f}s")

output_data = {
    "langs": [cfg[0] for cfg in LANG_CONFIGS],
    "lang_names": lang_names,
    "wtlocales": wtlocales,
    "aliases": LOOKUP,
    "books": book_names_by_lang,
    "verses": verses_by_ref
}

out_json = "bible_cited_verses.json"
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False)

print(f"Saved {out_json} ({os.path.getsize(out_json)/(1024*1024):.2f} MB, {len(verses_by_ref)} verses)")
