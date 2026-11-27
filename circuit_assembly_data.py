# -*- coding: utf-8 -*-
"""
Circuit Assembly Programs and Review Questions:
- 2026/11/28 Gunsan Korean Circuit Assembly (Circuit Overseer: “여호와를 신뢰하는 자는 행복합니다”)
- 2026/12/05 Cheonan Multilingual Circuit Assembly (Branch Representative: “Hãy hoan hỉ nơi Đức Giê-hô-va” / “여호와 안에서 더없이 기뻐하십시오”)

Standard Language Ordering (12 languages):
A: vi, B: cs, C: zh_cn, D: zh, E: en, F: fr, G: de, H: hu, I: id, J: ja, K: ko, L: pl
"""

CIRCUIT_ASSEMBLIES = {
    "2026-11-28": {
        "date": "2026-11-28",
        "primary_lang": "ko",
        "location": "군산",
        "title": {
            "vi": "Hội nghị vòng quanh tiếng Hàn Gunsan",
            "cs": "Korejský krajský sjezd v Kunsanu",
            "zh_cn": "群山韩语分区大会",
            "zh": "群山韓語分區大會",
            "en": "Gunsan Korean Circuit Assembly",
            "fr": "Assemblée de circonscription en coréen de Gunsan",
            "de": "Koreanischer Kreiskongress Gunsan",
            "hu": "Kunszani koreai körzetkongresszus",
            "id": "Kebaktian wilayah bahasa Korea Gunsan",
            "ja": "群山韓国語巡回大会",
            "ko": "군산 한국어 순회대회",
            "pl": "Koreańskie zgromadzenie obwodowe w Kunsan"
        },
        "theme": {
            "ko": "“여호와를 신뢰하는 자는 행복합니다”",
            "vi": "“Người tin cậy Đức Giê-hô-va thật hạnh phúc!”",
            "en": "“Happy Is the One Who Trusts in Jehovah”",
            "scripture": "잠언 16:20",
            "scripture_vi": "Châm ngôn 16:20"
        },
        "links": {
            "program": "https://www.jw.org/ko/라이브러리/프로그램/순회-감독자와-함께하는-2026-2027-순회-대회-프로그램/여호와를-신뢰하는-자는-행복합니다/",
            "questions": "https://www.jw.org/ko/라이브러리/프로그램/순회-감독자와-함께하는-2026-2027-순회-대회-프로그램/아래-질문에-대한-답을-찾아-보십시오/"
        },
        "schedule": [
            {
                "section": {
                    "ko": "오전",
                    "vi": "Buổi sáng",
                    "en": "Morning"
                },
                "items": [
                    {"time": "9:40", "ko": "음악", "vi": "Âm nhạc", "type": "music"},
                    {"time": "9:50", "ko": "노래 31번 및 기도", "vi": "Bài hát 31 và cầu nguyện", "type": "song", "songNum": 31},
                    {"time": "10:00", "ko": "왜 “마음을 다해 여호와를 신뢰”해야 합니까?", "vi": "Tại sao nên “hết lòng tin cậy Đức Giê-hô-va”?", "type": "talk"},
                    {
                        "time": "10:15",
                        "ko": "심포지엄: 여호와를 신뢰한 사람들을 본받으십시오!",
                        "vi": "Thuyết trình phối hợp: Noi gương những người tin cậy Đức Giê-hô-va!",
                        "type": "symposium",
                        "parts": [
                            {"ko": "바락", "vi": "Ba-rác"},
                            {"ko": "수넴 여자", "vi": "Người đàn bà Su-nem"},
                            {"ko": "다니엘, 하나냐, 미사엘, 아사랴", "vi": "Đa-ni-ên, Ha-na-nia, Mi-sa-ên và A-xa-ria"}
                        ]
                    },
                    {"time": "11:05", "ko": "노래 57번 및 광고", "vi": "Bài hát 57 và thông báo", "type": "song", "songNum": 57},
                    {"time": "11:15", "ko": "“살아 계신 참하느님”을 신뢰하도록 사람들을 도우십시오", "vi": "Giúp người khác tin cậy “Đức Chúa Trời thật và hằng sống”", "type": "talk"},
                    {"time": "11:35", "ko": "침례 연설: “보이지 않는 곳에서 보고 계시는 아버지께서 갚아 주실 것입니다”", "vi": "Báp-têm: ‘Cha trên trời, là đấng nhìn từ nơi kín đáo, sẽ thưởng cho anh em’", "type": "baptism"},
                    {"time": "12:05", "ko": "노래 29번", "vi": "Bài hát 29", "type": "song", "songNum": 29}
                ]
            },
            {
                "section": {
                    "ko": "오후",
                    "vi": "Buổi chiều",
                    "en": "Afternoon"
                },
                "items": [
                    {"time": "1:20", "ko": "음악", "vi": "Âm nhạc", "type": "music"},
                    {"time": "1:30", "ko": "노래 8번 및 기도", "vi": "Bài hát 8 và cầu nguyện", "type": "song", "songNum": 8},
                    {"time": "1:35", "ko": "성경 공개 강연: 누구를 정말 신뢰할 수 있습니까?", "vi": "Diễn văn công cộng: Ai thật sự đáng tin cậy?", "type": "talk"},
                    {"time": "2:05", "ko": "「파수대」 요약", "vi": "Tóm lược bài học Tháp Canh", "type": "watchtower"},
                    {"time": "2:35", "ko": "노래 135번 및 광고", "vi": "Bài hát 135 và thông báo", "type": "song", "songNum": 135},
                    {
                        "time": "2:45",
                        "ko": "심포지엄: 여호와의 지혜를 신뢰하십시오",
                        "vi": "Thuyết trình phối hợp: Tin cậy nơi sự khôn ngoan của Đức Giê-hô-va",
                        "type": "symposium",
                        "parts": [
                            {"ko": "자녀를 지도할 때", "vi": "Khi hướng dẫn con cái"},
                            {"ko": "미래를 계획할 때", "vi": "Khi lên kế hoạch cho tương lai"},
                            {"ko": "유혹에 직면할 때", "vi": "Khi đối mặt với cám dỗ"}
                        ]
                    },
                    {"time": "3:30", "ko": "“여호와를 신뢰하는 자는 행복합니다”", "vi": "“Người tin cậy Đức Giê-hô-va thật hạnh phúc!”", "type": "talk"},
                    {"time": "4:00", "ko": "노래 54번 및 기도", "vi": "Bài hát 54 và cầu nguyện", "type": "song", "songNum": 54}
                ]
            }
        ],
        "questions": [
            {
                "num": 1,
                "ko": "우리는 어떻게 “마음을 다해 여호와를 신뢰”한다는 것을 나타낼 수 있습니까? (잠언 3:5, 6)",
                "vi": "Làm thế nào để cho thấy mình hết lòng tin cậy Đức Giê-hô-va? (Châm ngôn 3:5, 6)"
            },
            {
                "num": 2,
                "ko": "우리는 어떻게 바락, 수넴 여자, 다니엘, 하나냐, 미사엘, 아사랴를 본받을 수 있습니까? (누가 16:10; 시편 50:15; 시편 119:112)",
                "vi": "Chúng ta có thể noi gương Ba-rác, người đàn bà Su-nem, Đa-ni-ên, Ha-na-nia, Mi-sa-ên và A-xa-ria như thế nào? (Lu-ca 16:10; Thi thiên 50:15; Thi thiên 119:112)"
            },
            {
                "num": 3,
                "ko": "우리와 배경이나 생각이 아주 다른 사람들과 어떻게 대화를 시작할 수 있습니까? (고린도 전서 9:19-23)",
                "vi": "Làm sao để bắt đầu cuộc trò chuyện với những người có gốc gác hay lối suy nghĩ rất khác với chúng ta? (1 Cô-rinh-tô 9:19-23)"
            },
            {
                "num": 4,
                "ko": "왜 여호와의 지혜를 신뢰할 수 있습니까? (잠언 3:13, 18; 잠언 16:3; 잠언 22:6; 고린도 전서 10:13)",
                "vi": "Tại sao có thể tin cậy nơi sự khôn ngoan của Đức Giê-hô-va? (Châm ngôn 3:13, 18; Châm ngôn 16:3; Châm ngôn 22:6; 1 Cô-rinh-tô 10:13)"
            },
            {
                "num": 5,
                "ko": "왜 여호와를 언제나 신뢰해야 합니까? (잠언 16:20)",
                "vi": "Tại sao chúng ta nên luôn tin cậy Đức Giê-hô-va? (Châm ngôn 16:20)"
            }
        ]
    },
    "2026-12-05": {
        "date": "2026-12-05",
        "primary_lang": "vi",
        "location": "천안",
        "title": {
            "vi": "Hội nghị vòng quanh đa ngôn ngữ Cheonan (tiếng Việt)",
            "cs": "Vícejazyčný krajský sjezd v Čchonanu (vietnamština)",
            "zh_cn": "天安多语种分区大会（越南语）",
            "zh": "天安多語種分區大會（越南語）",
            "en": "Cheonan Multilingual Circuit Assembly (Vietnamese)",
            "fr": "Assemblée de circonscription multilingue de Cheonan (vietnamien)",
            "de": "Mehrsprachiger Kreiskongress Cheonan (Vietnamesisch)",
            "hu": "Cshonani többnyelvű körzetkongresszus (vietnámi)",
            "id": "Kebaktian wilayah multibahasa Cheonan (bahasa Vietnam)",
            "ja": "天安多言語巡回大会（ベトナム語）",
            "ko": "천안 다언어 순회대회 (베트남어)",
            "pl": "Wielojęzyczne zgromadzenie obwodowe w Cheonan (wietnamski)"
        },
        "theme": {
            "vi": "“Hãy hoan hỉ nơi Đức Giê-hô-va”",
            "ko": "“여호와 안에서 더없이 기뻐하십시오”",
            "en": "“Find Exquisite Delight in Jehovah”",
            "scripture": "Thi thiên 37:4",
            "scripture_ko": "시편 37:4"
        },
        "links": {
            "program_vi": "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-anh-đại-diện-chi-nhánh/Hãy-hoan-hỉ-nơi-Đức-Giê-hô-va/",
            "questions_vi": "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-anh-đại-diện-chi-nhánh/Tìm-lời-giải-đáp-cho-những-câu-hỏi-sau/",
            "program_ko": "https://www.jw.org/ko/라이브러리/프로그램/지부-대표자와-함께하는-2026-2027-순회-대회-프로그램/여호와-안에서-더없이-기뻐하십시오/",
            "questions_ko": "https://www.jw.org/ko/라이브러리/프로그램/지부-대표자와-함께하는-2026-2027-순회-대회-프로그램/아래-질문에-대한-답을-찾아-보십시오/"
        },
        "schedule": [
            {
                "section": {
                    "vi": "Buổi sáng",
                    "ko": "오전",
                    "en": "Morning"
                },
                "items": [
                    {"time": "9:40", "vi": "Âm nhạc", "ko": "음악", "type": "music"},
                    {"time": "9:50", "vi": "Bài hát 7 và cầu nguyện", "ko": "노래 7번 및 기도", "type": "song", "songNum": 7},
                    {"time": "10:00", "vi": "“Hãy hoan hỉ nơi Đức Giê-hô-va”—Bằng cách nào?", "ko": "어떻게 “여호와 안에서 더없이 기뻐할” 수 있습니까?", "type": "talk"},
                    {"time": "10:15", "vi": "“Hạnh phúc cho người. . . được tha tội”", "ko": "‘죄를 용서받은 사람은 행복합니다’", "type": "talk"},
                    {"time": "10:30", "vi": "“Hạnh phúc cho người ngụ trong nhà ngài!”", "ko": "“당신의 집에 머무르는 이들은 행복합니다!”", "type": "talk"},
                    {"time": "10:55", "vi": "Bài hát 37 và thông báo", "ko": "노래 37번 및 광고", "type": "song", "songNum": 37},
                    {"time": "11:05", "vi": "‘Người nào náu thân nơi Đức Giê-hô-va hạnh phúc biết bao!’", "ko": "‘여호와께 도피하는 사람은 행복합니다’", "type": "talk"},
                    {"time": "11:35", "vi": "Báp-têm: ‘Cha trên trời, là đấng nhìn từ nơi kín đáo, sẽ thưởng cho anh em’", "ko": "침례 연설: “보이지 않는 곳에서 보고 계시는 아버지께서 갚아 주실 것입니다”", "type": "baptism"},
                    {"time": "12:05", "vi": "Bài hát 38", "ko": "노래 38번", "type": "song", "songNum": 38}
                ]
            },
            {
                "section": {
                    "vi": "Buổi chiều",
                    "ko": "오후",
                    "en": "Afternoon"
                },
                "items": [
                    {"time": "1:20", "vi": "Âm nhạc", "ko": "음악", "type": "music"},
                    {"time": "1:30", "vi": "Bài hát 111", "ko": "노래 111번", "type": "song", "songNum": 111},
                    {"time": "1:35", "vi": "Kinh nghiệm", "ko": "경험담", "type": "experience"},
                    {"time": "1:45", "vi": "Tóm lược bài học Tháp Canh", "ko": "「파수대」 요약", "type": "watchtower"},
                    {
                        "time": "2:15",
                        "vi": "Thuyết trình phối hợp: Theo đuổi những điều mang lại hạnh phúc thật",
                        "ko": "심포지엄: 진정한 행복을 가져오는 것들을 추구하십시오",
                        "type": "symposium",
                        "parts": [
                            {"vi": "Đời sống đơn giản", "ko": "단순한 생활"},
                            {"vi": "Bạn tốt", "ko": "좋은 친구"},
                            {"vi": "Gia đình hợp nhất", "ko": "가족의 연합"}
                        ]
                    },
                    {"time": "3:00", "vi": "Bài hát 88 và thông báo", "ko": "노래 88번 및 광고", "type": "song", "songNum": 88},
                    {"time": "3:10", "vi": "“Hạnh phúc thay dân nào có Đức Giê-hô-va làm Đức Chúa Trời!”", "ko": "“여호와를 하느님으로 모시는 백성은 행복합니다!”", "type": "talk"},
                    {"time": "3:55", "vi": "Bài hát 161 và cầu nguyện", "ko": "노래 161번 및 기도", "type": "song", "songNum": 161}
                ]
            }
        ],
        "questions": [
            {
                "num": 1,
                "vi": "Chúng ta có thể “hoan hỉ nơi Đức Giê-hô-va” bằng cách nào? (Thi thiên 37:4)",
                "ko": "우리는 어떻게 “여호와 안에서 더없이 기뻐할” 수 있습니까? (시편 37:4)"
            },
            {
                "num": 2,
                "vi": "Làm thế nào chúng ta có thể hạnh phúc dù đã phạm tội? (Thi thiên 32:1, 2)",
                "ko": "죄를 짓는다 하더라도 어떻게 행복할 수 있습니까? (시편 32:1, 2)"
            },
            {
                "num": 3,
                "vi": "Tại sao nên đặt việc phụng sự Đức Giê-hô-va lên hàng đầu trong đời sống? (Thi thiên 84:4, 10)",
                "ko": "왜 여호와를 섬기는 일을 삶의 첫째 자리에 두어야 합니까? (시편 84:4, 10)"
            },
            {
                "num": 4,
                "vi": "Làm thế nào chúng ta có thể hạnh phúc dù gặp thử thách trong đời sống? (Thi thiên 34:8; Thi thiên 18:25)",
                "ko": "살면서 어려움을 겪더라도 어떻게 행복할 수 있습니까? (시편 34:8; 시편 18:25)"
            },
            {
                "num": 5,
                "vi": "Làm thế nào chúng ta có thể tránh để hạnh phúc giả tạo đánh lừa? (1 Ti-mô-thê 6:7, 8; Châm ngôn 18:24; Thi thiên 127:1, 2)",
                "ko": "우리는 어떻게 가짜 행복을 피할 수 있습니까? (디모데 전서 6:7, 8; 잠언 18:24; 시편 127:1, 2)"
            },
            {
                "num": 6,
                "vi": "Làm thế nào Đức Giê-hô-va giúp các tôi tớ của ngài có được hạnh phúc thật? (Mi-chê 2:12; Gia-cơ 3:17; 1 Phi-e-rơ 5:8)",
                "ko": "여호와께서는 자신의 종들이 진정으로 행복할 수 있도록 어떻게 도우십니까? (미가 2:12; 야고보 3:17; 베드로 전서 5:8)"
            }
        ]
    }
}
