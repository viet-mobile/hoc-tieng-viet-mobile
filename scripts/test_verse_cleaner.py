import zipfile, re, os, html

class BibleEpubParser:
    def __init__(self, epub_path):
        self.epub_path = epub_path
        self.z = zipfile.ZipFile(epub_path, 'r')
        self._init_navigation()

    def _init_navigation(self):
        # Read toc.xhtml to map book 1..66 to chapter nav or direct chapter file
        toc = self.z.read("OEBPS/toc.xhtml").decode('utf-8')
        # Books mapping: 1..66 -> nav file or chapter 1 file
        self.book_nav = {}
        # Matches like: href="biblechapternav19.xhtml" or href="1001061135.xhtml"
        # In toc.xhtml, pattern: <a href="([^"]+)">([^<]+)</a>
        links = re.findall(r'<a[^>]+href=\"([^\"]+)\"[^>]*>([^<]+)</a>', toc)
        
        # We also know the standard 66 book order!
        # Books 1..66 have biblechapternav{n}.xhtml EXCEPT 1-chapter books:
        # Book 31: Obadiah
        # Book 57: Philemon
        # Book 63: 2 John
        # Book 64: 3 John
        # Book 65: Jude
        for b in range(1, 67):
            nav_name = f"biblechapternav{b}.xhtml"
            if f"OEBPS/{nav_name}" in self.z.namelist():
                self.book_nav[b] = nav_name
            else:
                # 1-chapter books: find in links
                # For book 31, 57, 63, 64, 65
                pass

        # Parse each book's chapters
        self.chapter_files = {} # (book, chapter) -> xhtml_filename
        for b in range(1, 67):
            nav_file = f"OEBPS/biblechapternav{b}.xhtml"
            if nav_file in self.z.namelist():
                content = self.z.read(nav_file).decode('utf-8')
                ch_links = re.findall(r'<a[^>]+href=\"([^\"]+)\"[^>]*>(\d+)</a>', content)
                for href, ch in ch_links:
                    clean_href = href.split('#')[0]
                    self.chapter_files[(b, int(ch))] = "OEBPS/" + clean_href
            else:
                # One chapter book: chapter 1
                # Find in toc
                pass

    def get_verse_text(self, book, chapter, verse):
        ch_file = self.chapter_files.get((book, chapter))
        if not ch_file or ch_file not in self.z.namelist():
            return None
        content = self.z.read(ch_file).decode('utf-8')
        
        # Find verse: id="chapter{chapter}_verse{verse}"
        # Text continues until the next <span id="chapter{chapter}_verse... or end of text container
        pat = rf'id=[\"\']chapter{chapter}_verse{verse}[\"\']'
        m = re.search(pat, content)
        if not m:
            return None
        start_idx = m.end()
        # Find next verse
        next_pat = rf'id=[\"\']chapter{chapter}_verse\d+[\"\']'
        m_next = re.search(next_pat, content[start_idx:])
        if m_next:
            verse_raw = content[start_idx:start_idx + m_next.start()]
        else:
            # End of chapter or until end of bibleText
            end_m = re.search(r'</div>\s*</div>|id=[\"\']bibleText[\"\']', content[start_idx:])
            verse_raw = content[start_idx:start_idx + end_m.start()] if end_m else content[start_idx:start_idx + 2000]

        # Clean HTML tags and superscripts
        # Remove footnote markers/links
        v_clean = re.sub(r'<a class=[\"\']xrefLink[^>]*>.*?</a>', '', verse_raw)
        v_clean = re.sub(r'<sup[^>]*>.*?</sup>', '', v_clean)
        v_clean = re.sub(r'<span class=[\"\']style-[a-z][\"\']>[^<]*\[<em>[^<]*</em>\]</span>', '', v_clean) # Hebrew letter markers in Psalms
        v_clean = re.sub(r'<p[^>]*class=[\"\'][^\"\']*ss[^\"\']*[\"\']>[^<]*</p>', '', v_clean) # Hebrew stanza headers
        v_clean = re.sub(r'<[^>]+>', ' ', v_clean)
        v_clean = html.unescape(v_clean)
        # Normalize whitespace
        v_clean = re.sub(r'\s+', ' ', v_clean).strip()
        # Remove leading verse number if still present
        v_clean = re.sub(rf'^{verse}\s*', '', v_clean).strip()
        return v_clean

parser_vt = BibleEpubParser("jw_extraction/bible_epubs/nwt_VT.epub")
parser_ko = BibleEpubParser("jw_extraction/bible_epubs/nwt_KO.epub")
parser_en = BibleEpubParser("jw_extraction/bible_epubs/nwt_E.epub")

print("VT Psalm 37:29:", parser_vt.get_verse_text(19, 37, 29))
print("KO Psalm 37:29:", parser_ko.get_verse_text(19, 37, 29))
print("EN Psalm 37:29:", parser_en.get_verse_text(19, 37, 29))

print("VT Proverbs 3:5:", parser_vt.get_verse_text(20, 3, 5))
print("KO Proverbs 3:5:", parser_ko.get_verse_text(20, 3, 5))
print("EN Proverbs 3:5:", parser_en.get_verse_text(20, 3, 5))
