import urllib.request
import re
import json

docids = [
    {"startDate": "2026-12-07", "endDate": "2026-12-13", "classDate": "2026-12-12", "weekNum": 7, "docid": "202026406"},
    {"startDate": "2026-12-14", "endDate": "2026-12-20", "classDate": "2026-12-19", "weekNum": 8, "docid": "202026407"},
    {"startDate": "2026-12-21", "endDate": "2026-12-27", "classDate": "2026-12-26", "weekNum": 9, "docid": "202026408"},
    {"startDate": "2026-12-28", "endDate": "2027-01-03", "classDate": "2027-01-02", "weekNum": 10, "docid": "202026409"},
    {"startDate": "2027-01-04", "endDate": "2027-01-10", "classDate": "2027-01-09", "weekNum": 11, "docid": "202027001"},
    {"startDate": "2027-01-11", "endDate": "2027-01-17", "classDate": "2027-01-16", "weekNum": 12, "docid": "202027002"},
    {"startDate": "2027-01-18", "endDate": "2027-01-24", "classDate": "2027-01-23", "weekNum": 13, "docid": "202027003"},
    {"startDate": "2027-01-25", "endDate": "2027-01-31", "classDate": "2027-01-30", "weekNum": 14, "docid": "202027004"},
    {"startDate": "2027-02-01", "endDate": "2027-02-07", "classDate": "2027-02-06", "weekNum": 15, "docid": "202027005"},
    {"startDate": "2027-02-08", "endDate": "2027-02-14", "classDate": "2027-02-13", "weekNum": None, "docid": "202027006", "note": "2027-02-13 휴강 (왕국전도학교)"},
    {"startDate": "2027-02-15", "endDate": "2027-02-21", "classDate": "2027-02-20", "weekNum": 16, "docid": "202027007", "note": "2027-02-20 졸업식"},
]

def clean_txt(html_snip):
    t = re.sub(r'<[^>]+>', ' ', html_snip)
    return ' '.join(t.split())

def parse_week(meta):
    docid = meta['docid']
    url_vi = f'https://wol.jw.org/vi/wol/d/r47/lp-vt/{docid}'
    url_ko = f'https://wol.jw.org/ko/wol/d/r8/lp-ko/{docid}'
    req_vi = urllib.request.Request(url_vi, headers={'User-Agent': 'Mozilla/5.0'})
    req_ko = urllib.request.Request(url_ko, headers={'User-Agent': 'Mozilla/5.0'})
    html_vi = urllib.request.urlopen(req_vi).read().decode('utf-8')
    html_ko = urllib.request.urlopen(req_ko).read().decode('utf-8')
    
    songs_vi = [int(s) for s in re.findall(r'Bài hát\s+(\d+)', html_vi)[:3]]
    songs_ko = [int(s) for s in re.findall(r'노래\s+(\d+)', html_ko)[:3]]
    
    h1_vi = clean_txt(re.search(r'<h1[^>]*>(.*?)</h1>', html_vi).group(1))
    h1_ko = clean_txt(re.search(r'<h1[^>]*>(.*?)</h1>', html_ko).group(1))
    
    h2s_vi = [clean_txt(x) for x in re.findall(r'<h2[^>]*>(.*?)</h2>', html_vi)]
    h2s_ko = [clean_txt(x) for x in re.findall(r'<h2[^>]*>(.*?)</h2>', html_ko)]
    reading_vi = h2s_vi[0] if h2s_vi else ""
    reading_ko = h2s_ko[0] if h2s_ko else ""
    
    def extract_h3_blocks(html):
        matches = list(re.finditer(r'<h3[^>]*>(.*?)</h3>', html, re.DOTALL))
        blocks = []
        for i, m in enumerate(matches):
            title = clean_txt(m.group(1))
            start = m.end()
            end = matches[i+1].start() if i+1 < len(matches) else len(html)
            content = html[start:end]
            paras = [clean_txt(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL)]
            paras = [p for p in paras if p]
            blocks.append({'title': title, 'paras': paras})
        return blocks

    b_vi = extract_h3_blocks(html_vi)
    b_ko = extract_h3_blocks(html_ko)
    
    num_vi = [b for b in b_vi if re.match(r'^\s*\d+\.', b['title'])]
    num_ko = [b for b in b_ko if re.match(r'^\s*\d+\.', b['title'])]
    
    items = []
    total = len(num_vi)
    for vi_item, ko_item in zip(num_vi, num_ko):
        m_num = re.match(r'^\s*(\d+)\.\s*(.*)', vi_item['title'])
        num = int(m_num.group(1)) if m_num else len(items) + 1
        title_vi = m_num.group(2) if m_num else vi_item['title']
        
        m_num_ko = re.match(r'^\s*(\d+)\.\s*(.*)', ko_item['title'])
        title_ko = m_num_ko.group(2) if m_num_ko else ko_item['title']
        
        is_student = False
        is_cbs = False
        section_idx = 1
        
        if num == 3:
            is_student = True
            section_idx = 1
        elif 4 <= num <= (total - 2):
            is_student = True
            section_idx = 2
        elif num == total:
            is_cbs = True
            section_idx = 3
        elif num == total - 1:
            section_idx = 3
        else:
            section_idx = 1
            
        items.append({
            'num': num,
            'section': section_idx,
            'title': {'vi': title_vi, 'ko': title_ko},
            'details_vi': vi_item['paras'],
            'details_ko': ko_item['paras'],
            'isStudent': is_student,
            'isCbs': is_cbs,
            # Assignee slot placeholder for student assignments
            'assignee': None if is_student else None,
            'assistant': None if is_student and section_idx == 2 else None,
            'conductor': None if is_cbs else None,
            'reader': None if is_cbs else None,
        })
        
    return {
        'meta': meta,
        'docid': docid,
        'url_vi': url_vi,
        'url_ko': url_ko,
        'date': {'vi': h1_vi, 'ko': h1_ko},
        'reading': {'vi': reading_vi, 'ko': reading_ko},
        'songs': songs_vi,
        'items': items
    }

all_weeks = []
for entry in docids:
    w = parse_week(entry)
    print(f"Parsed {w['meta']['startDate']} | Items: {len(w['items'])} | Songs: {w['songs']}")
    all_weeks.append(w)

py_content = "# -*- coding: utf-8 -*-\n"
py_content += '"""\n'
py_content += '전주 학습반을 위한 2026년 12월 7일주 ~ 2027년 2월 15일주 (11주간)\n'
py_content += '그리스도인 생활과 봉사—집회 교재 (Lối sống và thánh chức—Chương trình nhóm họp)\n'
py_content += '베트남어-한국어 대조 데이터 및 학생 과제 배정 슬롯 구조 정의\n'
py_content += '"""\n'
py_content += 'import json\n\n'
py_content += "JEONJU_MWB_PROGRAMS = json.loads('''" + json.dumps(all_weeks, ensure_ascii=False) + "''')\n"

with open('jeonju_mwb_data.py', 'w', encoding='utf-8') as f:
    f.write(py_content)

print("Saved to jeonju_mwb_data.py successfully!")
