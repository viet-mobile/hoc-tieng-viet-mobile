# -*- coding: utf-8 -*-
"""
Grammar pattern registry and matching engine.
Registered patterns are based strictly on authoritative project grammar data.
"""

import re
from typing import List, Dict, Optional, Any
from jw_extraction.models import CanonicalSegment, GrammarOccurrence, Candidate
from jw_extraction.normalization import VN_LETTERS, BOUNDARY_PREFIX, BOUNDARY_SUFFIX


class RegisteredPattern:
    def __init__(self, pattern_id: str, canonical_name: str, level: str,
                 meaning: Dict[str, str], regex_pattern: str):
        self.pattern_id = pattern_id
        self.canonical_name = canonical_name
        self.level = level
        self.meaning = meaning
        self.regex = re.compile(regex_pattern, re.IGNORECASE)

class GrammarRegistry:
    def __init__(self):
        self.patterns: Dict[str, RegisteredPattern] = {}
        self._init_confirmed_patterns()

    def _init_confirmed_patterns(self):
        """Initializes the confirmed A1/A2 and B1/B2 grammar patterns from
        grammar_data.py and grammar_dict_data.py."""
        raw_defs = [
            # A1 / A2 Patterns
            ("la", "là", "A1", {"ko": "~이다 (동등·정의·신분)", "en": "to be"},
             BOUNDARY_PREFIX + r'là' + BOUNDARY_SUFFIX),
            ("o", "ở", "A1", {"ko": "~에 있다 / ~에서 살다 (위치)", "en": "at, in"},
             BOUNDARY_PREFIX + r'ở' + BOUNDARY_SUFFIX),
            ("da", "đã", "A1", {"ko": "이미 ~했다 (과거 시제)", "en": "already / past marker"},
             BOUNDARY_PREFIX + r'đã' + BOUNDARY_SUFFIX),
            ("tu_den", "từ ... đến ...", "A1", {"ko": "~부터 ~까지", "en": "from ... to ..."},
             BOUNDARY_PREFIX + r'từ\s+[^.?!,;:]+\s+đến' + BOUNDARY_SUFFIX),
            ("phai_khong", "phải không", "A1", {"ko": "그렇지요?, 맞지요?", "en": "is that right?"},
             BOUNDARY_PREFIX + r'(?:có\s+)?phải\s+không' + BOUNDARY_SUFFIX),
            ("can", "cần", "A2", {"ko": "~가 필요하다, ~해야 한다", "en": "need to"},
             BOUNDARY_PREFIX + r'cần' + BOUNDARY_SUFFIX),
            ("phai", "phải", "A1", {"ko": "반드시 ~해야 한다", "en": "must, have to"},
             BOUNDARY_PREFIX + r'phải' + BOUNDARY_SUFFIX),
            ("can_phai", "cần phải", "A2", {"ko": "~해야만 한다 (강조)", "en": "need and must"},
             BOUNDARY_PREFIX + r'cần\s+phải' + BOUNDARY_SUFFIX),
            ("dung", "đừng", "A1", {"ko": "~하지 마라", "en": "do not"},
             BOUNDARY_PREFIX + r'đừng' + BOUNDARY_SUFFIX),
            ("khong_duoc", "không được", "A2", {"ko": "~해서는 안 된다", "en": "must not"},
             BOUNDARY_PREFIX + r'không\s+được' + BOUNDARY_SUFFIX),
            ("khi_thi", "khi ... thì ...", "A2", {"ko": "~할 때", "en": "when ... then ..."},
             BOUNDARY_PREFIX + r'khi\s+[^.?!,;:]+\s+(?:thì\s+)?' + BOUNDARY_SUFFIX),
            ("khi_nao", "khi nào", "A1", {"ko": "언제 ~합니까?", "en": "when?"},
             BOUNDARY_PREFIX + r'khi\s+nào' + BOUNDARY_SUFFIX),
            ("hay_di", "hãy ... đi", "A1", {"ko": "~하세요, ~해라", "en": "please do"},
             BOUNDARY_PREFIX + r'hãy\s+[^.?!,;:]+\s+đi' + BOUNDARY_SUFFIX),
            ("xin_lam_on", "xin ... làm ơn", "A1", {"ko": "부탁드립니다, 제발 ~해주세요", "en": "please"},
             BOUNDARY_PREFIX + r'(?:xin\s+lỗi,\s*)?(?:xin\s+|làm\s+ơn\s+)' + BOUNDARY_SUFFIX),
            ("neu_thi", "nếu ... thì ...", "A2", {"ko": "만약 ~라면 ...하다", "en": "if ... then ..."},
             BOUNDARY_PREFIX + r'nếu\s+[^.?!,;:]+\s+thì' + BOUNDARY_SUFFIX),
            ("vua_vua", "vừa ... vừa ...", "A2", {"ko": "~하면서 동시에 ...하다", "en": "both ... and ..."},
             BOUNDARY_PREFIX + r'vừa\s+[^.?!,;:]+\s+vừa' + BOUNDARY_SUFFIX),
            ("cang_cang", "càng ... càng ...", "A2", {"ko": "~할수록 더욱 ...하다", "en": "the more ... the more ..."},
             BOUNDARY_PREFIX + r'càng\s+[^.?!,;:]+\s+càng' + BOUNDARY_SUFFIX),

            # B1 / B2 Patterns
            ("nhi_nhe", "nhỉ / nhé", "B1", {"ko": "친근한 확인·동의 구함 또는 권유", "en": "right? / let's"},
             BOUNDARY_PREFIX + r'(?:nhỉ|nhé)[?!.]*' + BOUNDARY_SUFFIX),
            ("cung_duoc", "cũng được", "B1", {"ko": "~도 괜찮다, 그래도 무방하다", "en": "also fine"},
             BOUNDARY_PREFIX + r'cũng\s+được' + BOUNDARY_SUFFIX),
            ("tu_v", "tự + động từ", "B1", {"ko": "스스로 ~하다", "en": "do by oneself"},
             BOUNDARY_PREFIX + r'tự\s+[' + VN_LETTERS + r']+' + BOUNDARY_SUFFIX),
            ("lam_sao_ma", "làm sao mà", "B2", {"ko": "어떻게 ~할 수 있겠는가?", "en": "how could one possibly"},
             BOUNDARY_PREFIX + r'làm\s+sao\s+mà' + BOUNDARY_SUFFIX),
            ("cang_ngay_cang", "càng ngày càng", "B1", {"ko": "날이 갈수록 더욱 ~하다", "en": "more and more day by day"},
             BOUNDARY_PREFIX + r'càng\s+ngày\s+càng' + BOUNDARY_SUFFIX),
            ("khong_bao_gio", "không bao giờ", "B1", {"ko": "결코 ~하지 않다", "en": "never"},
             BOUNDARY_PREFIX + r'không\s+bao\s+giờ' + BOUNDARY_SUFFIX),
            ("vi_nen", "vì ... nên ...", "B1", {"ko": "~때문에 그래서 ...하다", "en": "because ... therefore ..."},
             BOUNDARY_PREFIX + r'vì\s+[^.?!,;:]+\s+nên' + BOUNDARY_SUFFIX),
            ("cho_du", "cho dù / dù cho", "B2", {"ko": "비록 ~일지라도", "en": "even if / although"},
             BOUNDARY_PREFIX + r'(?:cho\s+dù|dù\s+cho|dù)' + BOUNDARY_SUFFIX),
            ("hoa_ra_la", "hóa ra là", "B2", {"ko": "알고 보니 ~이다", "en": "it turns out that"},
             BOUNDARY_PREFIX + r'hóa\s+ra\s+(?:là\s+)?' + BOUNDARY_SUFFIX),
            ("nghe_noi", "nghe nói", "B1", {"ko": "듣자하니 ~라더라", "en": "I heard that"},
             BOUNDARY_PREFIX + r'nghe\s+nói' + BOUNDARY_SUFFIX),
            ("tin_rang", "tin rằng / tin là", "B1", {"ko": "~라고 믿다", "en": "believe that"},
             BOUNDARY_PREFIX + r'tin\s+(?:rằng|là)' + BOUNDARY_SUFFIX),
            ("khong_chi_ma_con", "không chỉ ... mà còn ...", "B2", {"ko": "~뿐만 아니라 ...도", "en": "not only ... but also"},
             BOUNDARY_PREFIX + r'không\s+(?:những|chỉ)\s+[^.?!,;:]+\s+mà\s+còn' + BOUNDARY_SUFFIX),
            ("ngoai_con", "ngoài ... còn ...", "B2", {"ko": "~외에도 여전히 ...하다", "en": "besides ... also"},
             BOUNDARY_PREFIX + r'ngoài\s+[^.?!,;:]+\s+còn' + BOUNDARY_SUFFIX),
            ("bao_gio_cung", "bao giờ cũng", "B1", {"ko": "언제나, 항상 예외 없이", "en": "always, invariably"},
             BOUNDARY_PREFIX + r'bao\s+giờ\s+cũng' + BOUNDARY_SUFFIX),
            ("duoc_v", "được + động từ", "B1", {"ko": "~하게 되다, (혜택으로) ~받다", "en": "receive / have the benefit of"},
             BOUNDARY_PREFIX + r'được\s+[' + VN_LETTERS + r']+' + BOUNDARY_SUFFIX),
            ("tung", "từng", "B1", {"ko": "일찍이 ~한 적이 있다 (경험)", "en": "have ever / once in past"},
             BOUNDARY_PREFIX + r'từng\s+[' + VN_LETTERS + r']+' + BOUNDARY_SUFFIX),
            ("sau_khi", "sau khi", "B1", {"ko": "~한 후에, ~하고 나서", "en": "after"},
             BOUNDARY_PREFIX + r'sau\s+khi' + BOUNDARY_SUFFIX),
            ("de_purpose", "để + purpose", "B1", {"ko": "~하기 위하여, ~하도록 (목적)", "en": "in order to, so that"},
             BOUNDARY_PREFIX + r'để\s+[' + VN_LETTERS + r']+' + BOUNDARY_SUFFIX),
            ("adj_ra_len_di", "Tính từ + ra / lên / đi", "B1",
             {"ko": "형용사 뒤에서 상태의 변화 추이를 표현 (밝아지다, 좋아지다, 나빠지다)", "en": "Indicates direction of change after an adjective"},
             BOUNDARY_PREFIX + r'(?:gầy|béo|mập|sáng|tối|tốt|xấu|đẹp|nhiều|ít|nhanh|chậm|già|trẻ|lớn|nhỏ|cao|thấp|khó|dễ|ấm|lạnh|nặng|nhẹ|rõ|khá|mạnh|yếu|đỏ|xanh|vàng|trắng|đen|dài|ngắn|rộng|hẹp|vui|buồn|xa|gần|dày|mỏng|sâu|cạn|nóng|nguội|tăng|giảm|tiến\s+bộ)\s+(?:ra|lên|đi)' + BOUNDARY_SUFFIX),
            ("v_ra_duoc_thay", "Động từ + ra / được / thấy", "B1",
             {"ko": "동사 뒤에서 동작의 결과 달성이나 인지를 표현 (알아내다, 찾아내다, 보이다)", "en": "Expresses completion or perception after a verb"},
             BOUNDARY_PREFIX + r'(?:tìm|nhận|nghĩ|chỉ|nhìn|trông|nghe|cảm|làm|hiểu|biết|đạt|thấy|học|nhớ|viết|nói|đọc|giải\s+thích|phân\s+biệt|nhận\s+biết|nhận\s+thức|phát\s+hiện|rút|đưa)\s+(?:ra|được|thấy)' + BOUNDARY_SUFFIX),
        ]

        for p_id, c_name, lvl, mean, pat in raw_defs:
            self.patterns[p_id] = RegisteredPattern(p_id, c_name, lvl, mean, pat)

    def match_segment(self, segment: CanonicalSegment, source_label: str) -> List[GrammarOccurrence]:
        vi_text = segment.texts.get("vi", "")
        if not vi_text or len(vi_text) < 10:
            return []

        results = []
        for p_id, p in self.patterns.items():
            match = p.regex.search(vi_text)
            if match:
                matched_span = match.group(0).strip()
                results.append(GrammarOccurrence(
                    patternId=p_id,
                    segmentId=segment.id,
                    documentId=segment.documentId,
                    sourceType=segment.sourceType,
                    sourceLabel=source_label,
                    vi=vi_text,
                    translations=segment.texts,
                    matchedText=matched_span,
                ))
        return results
