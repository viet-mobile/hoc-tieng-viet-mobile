import time
from test_verse_cleaner import BibleEpubParser

t0 = time.time()
parser = BibleEpubParser("jw_extraction/bible_epubs/nwt_VT.epub")
dt1 = time.time() - t0
print(f"Parser init took {dt1:.2f}s. Total chapters mapped: {len(parser.chapter_files)}")

# Test extracting 100 verses
t0 = time.time()
verses = []
for vs in range(1, 41):
    verses.append(parser.get_verse_text(19, 37, vs))
dt2 = time.time() - t0
print(f"Extracting 40 verses of Psalm 37 took {dt2:.3f}s. Sample verse 1: {verses[0][:50]}")
