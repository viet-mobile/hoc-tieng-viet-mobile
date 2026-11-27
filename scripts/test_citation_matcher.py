import re
from bible_lookup_def import LOOKUP

# Build a comprehensive regex for scripture citations in text
# Books in Vietnamese, Korean, English, abbreviations:
# e.g.:
# Thi thiên 37:29
# Châm ngôn 3:5, 6
# 1 Ti-mô-thê 4:13-16
# 2 Ti 3:16, 17
# LU 8:18
# Mat 22:37
# Giăng 4:23, 24
# 1 Giăng 5:3
# 시편 37:29
# 잠언 3:5, 6
# 누가 8:18
# 디모데전서 4:13-16
# 디모데후서 3:16, 17

# Sort aliases by length descending so longer aliases match first (e.g. "1 ti-mô-thê" before "1 ti")
sorted_aliases = sorted(LOOKUP.keys(), key=lambda x: len(x), reverse=True)
# Escape for regex
alias_pattern = '|'.join(re.escape(a) for a in sorted_aliases)

# Regex to find scripture citation in text
# Matches: Book + Chapter[:Verses]
citation_re = re.compile(
    rf'\b({alias_pattern})\s+(\d+)(?:\s*:\s*([\d\s,–~-]+(?:\b|\d)))?',
    re.IGNORECASE
)

sample_texts = [
    "“Hãy để ý đến cách anh em nghe”.—LU 8:18.",
    "1, 2. (a) Đức Giê-hô-va làm gì cho dân ngài ngày nay? (Thi thiên 23:1, 2, 5) (b)",
    "3 Đức Giê-hô-va nói với chúng ta qua Lời ngài là Kinh Thánh (2 Ti 3:16, 17). Chúa Giê-su hiểu rõ điều đó. (Giăng 7:15). Khi ngài giải thích Kinh Thánh cho hai môn đồ, lòng họ “bừng cháy” (Lu 24:32)...",
    "5 Chúng ta lắng nghe tại buổi nhóm họp vì yêu thương Đức Giê-hô-va (Mat 22:37).",
    "11. Tại sao đưa ra những gợi ý thực tế và cụ thể trong bài giảng là điều hữu ích? (1 Ti-mô-thê 4:13-16)",
    "Người công chính sẽ hưởng trái đất Và được sống trên đó mãi mãi. (Thi thiên 37:29)",
    "“여러분이 어떻게 듣는가에 주의를 기울이십시오.”—누가 8:18.",
    "여호와께서는 오늘날 우리를 위해 어떤 일을 하고 계십니까? (시편 23:1, 2, 5)",
    "의로운 자들은 땅을 차지하고 거기서 영원히 살 것이다. (시편 37:29)",
    "마음을 다해 여호와를 신뢰하고 자신의 이해에 의존하지 마라. (잠언 3:5, 6)"
]

for txt in sample_texts:
    matches = list(citation_re.finditer(txt))
    print(f"Text: {txt[:60]}...")
    for m in matches:
        print(f"   -> Match: '{m.group(0)}' (Book alias: '{m.group(1)}', Ch: {m.group(2)}, Vs: {m.group(3)})")
