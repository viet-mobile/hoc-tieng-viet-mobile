import re, html

def clean_verse_text(raw, verse_num):
    s = raw
    # Remove footnotes, references, superscripts
    s = re.sub(r'<a class=[\"\']xrefLink[^>]*>.*?</a>', '', s)
    s = re.sub(r'<a[^>]+epub:type=[\"\']noteref[\"\'][^>]*>.*?</a>', '', s)
    s = re.sub(r'<sup[^>]*>.*?</sup>', '', s)
    s = re.sub(r'<span class=[\"\']style-[a-z][\"\']>[^<]*\[<em>[^<]*</em>\]</span>', '', s)
    s = re.sub(r'<p[^>]*class=[\"\'][^\"\']*ss[^\"\']*[\"\']>[^<]*</p>', '', s)
    # Remove Hebrew letters with brackets, e.g. פ [ Pê ] or ש [ Sin / Sin ]
    s = re.sub(r'[\u0590-\u05FF]\s*\[[^\]]+\]', '', s)
    # Japanese ruby: remove rt and rp
    s = re.sub(r'<rt>.*?</rt>', '', s)
    s = re.sub(r'<rp>.*?</rp>', '', s)
    # Block tags to space, inline tags to empty
    s = re.sub(r'</?(?:p|div|br|h\d|li|ul|ol)[^>]*>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    # Remove incomplete tags at start/end
    s = re.sub(r'<\s*span\s*$', '', s)
    s = html.unescape(s)
    # Remove footnote markers * +
    s = re.sub(r'[\*\+]', '', s)
    # Normalize whitespace
    s = re.sub(r'[ \t\r\f\v]+', ' ', s)
    s = re.sub(r'\n\s*\n', '\n', s).strip()
    s = re.sub(r'\s+', ' ', s).strip()
    # Remove leading verse number or quotes/symbols
    s = re.sub(rf'^[>»\s]*{verse_num}\s*', '', s).strip()
    s = re.sub(r'^[>»\s]+', '', s).strip()
    # Final cleanup of any remaining Hebrew letters or stray tags
    s = re.sub(r'[\u0590-\u05FF]\s*\[[^\]]*\]?', '', s).strip()
    s = re.sub(r'<\s*span\s*$', '', s).strip()
    return s

test_samples = [
    ("Người công chính sẽ hưởng trái đất Và được sống trên đó mãi mãi. פ [ Pê ] <span", 29),
    ("<strong><sup>29</sup></strong> <ruby><rb>正</rb><rt>ただ</rt></ruby>しい<ruby><rb>人</rb><rt>ひと</rt></ruby>は<ruby><rb>地</rb><rt>ち</rt></ruby><ruby><rb>上</rb><rt>じょう</rt></ruby>に<ruby><rb>住</rb><rt>す</rt></ruby>み<ruby><rb>続</rb><rt>つづ</rt></ruby>け<span id=\"footnotesource180\"></span><a epub:type=\"noteref\" href=\"#footnote180\">*</a>，</p><p data-pid=\"641\" class=\"p641 sz\">そこで<ruby><rb>永</rb><rt>えい</rt></ruby><ruby><rb>遠</rb><rt>えん</rt></ruby>に<ruby><rb>暮</rb><rt>く</rt></ruby>らす。", 29),
    ("<strong><sup>5</sup></strong> 마음을 다해 여호와를 신뢰하고 자신의 이해에 의존하지 * 마라. <span", 5),
]

for raw, num in test_samples:
    print("Cleaned:", clean_verse_text(raw, num))
