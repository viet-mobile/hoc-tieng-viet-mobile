import urllib.request
import re
import json
import os
import sys

class Node:
    def __init__(self, tag, attrs):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def get_text(self):
        parts = []
        for c in self.children:
            if isinstance(c, Node):
                parts.append(c.get_text())
            elif isinstance(c, str):
                parts.append(c)
        return ' '.join(''.join(parts).split())

from html.parser import HTMLParser

class DOMParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = Node('root', [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in ['img', 'br', 'hr', 'meta', 'link', 'input', 'source']:
            self.stack.append(node)

    def handle_data(self, data):
        self.stack[-1].children.append(data)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break

def find_all(node, tag):
    res = []
    if node.tag == tag:
        res.append(node)
    for c in node.children:
        if isinstance(c, Node):
            res.extend(find_all(c, tag))
    return res

WEEKS_DOCIDS = [
    {"startDate": "2026-12-07", "classDate": "2026-12-12", "docid": "202026406"},
    {"startDate": "2026-12-14", "classDate": "2026-12-19", "docid": "202026407"},
    {"startDate": "2026-12-21", "classDate": "2026-12-26", "docid": "202026408"},
    {"startDate": "2026-12-28", "classDate": "2027-01-02", "docid": "202026409"},
    {"startDate": "2027-01-04", "classDate": "2027-01-09", "docid": "202027001"},
    {"startDate": "2027-01-11", "classDate": "2027-01-16", "docid": "202027002"},
    {"startDate": "2027-01-18", "classDate": "2027-01-23", "docid": "202027003"},
    {"startDate": "2027-01-25", "classDate": "2027-01-30", "docid": "202027004"},
    {"startDate": "2027-02-01", "classDate": "2027-02-06", "docid": "202027005"},
    {"startDate": "2027-02-08", "classDate": "2027-02-13", "docid": "202027006"}, # No class on 2027-02-13 due to Kingdom Evangelizer School
    {"startDate": "2027-02-15", "classDate": "2027-02-20", "docid": "202027007"}, # Graduation class
]

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode('utf-8')

def parse_mwb_doc(docid, lang):
    locale = 'lp-vt' if lang == 'vi' else 'lp-ko'
    url = f'https://wol.jw.org/{lang}/wol/d/{"r47" if lang == "vi" else "r8"}/{locale}/{docid}'
    html = fetch(url)
    clean_html = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html, flags=re.DOTALL)
    parser = DOMParser()
    parser.feed(clean_html)

    # h1: week date
    h1 = find_all(parser.root, 'h1')
    date_text = h1[0].get_text() if h1 else ''

    # h2s: [0] reading, [1] Treasures, [2] Ministry, [3] Living
    h2s = [n.get_text() for n in find_all(parser.root, 'h2')]
    reading = h2s[0] if h2s else ''
    
    # h3s:
    # 0: opening song + prayer
    # 1..n: parts
    # middle song
    # parts...
    # closing comments + song + prayer
    h3_nodes = find_all(parser.root, 'h3')
    
    # Also find all p tags to get descriptions / details
    # Let's map each h3 to its subsequent content
    return {
        'url': url,
        'date_text': date_text,
        'reading': reading,
        'sections': h2s[1:],
        'h3s': [n.get_text() for n in h3_nodes]
    }

parsed_all = []
for entry in WEEKS_DOCIDS:
    docid = entry['docid']
    vi_data = parse_mwb_doc(docid, 'vi')
    ko_data = parse_mwb_doc(docid, 'ko')
    print(f"=== {entry['startDate']} ({docid}) ===")
    print(f"  VI Date: {vi_data['date_text']} | Reading: {vi_data['reading']}")
    print(f"  KO Date: {ko_data['date_text']} | Reading: {ko_data['reading']}")
    print(f"  VI H3 count: {len(vi_data['h3s'])} | KO H3 count: {len(ko_data['h3s'])}")
    parsed_all.append({
        'meta': entry,
        'vi': vi_data,
        'ko': ko_data
    })

with open('scripts/parsed_mwb_raw.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_all, f, ensure_ascii=False, indent=2)
print("Saved raw output to scripts/parsed_mwb_raw.json")
