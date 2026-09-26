# -*- coding: utf-8 -*-
"""[발음] > [차이] -- Tiếng Việt. Định dạng: xem pronunciation_comparison/__init__.py."""

UI = {
    "intro": "So sánh phát âm tiếng Việt (giọng Hà Nội chuẩn, trừ khi có ghi chú) với từng ngôn ngữ, từ góc nhìn của người nói ngôn ngữ đó. Chữ viết và âm thanh được tách biệt: cùng một chữ cái trong hai bảng chữ cái không có nghĩa là cùng một âm vị. Ký hiệu IPA trong / / là âm vị, trong [ ] là cách phát âm thực tế.",
    "common": "Điểm giống nhau",
    "diff": "Điểm khác nhau",
}

SECTIONS = {
    "ko": {
        "title": "Tiếng Hàn và tiếng Việt",
        "common": """
Cả hai ngôn ngữ đều có âm tiết tách bạch rõ ràng và kết thúc âm tiết bằng phụ âm không bật hơi ra: 밥 [pap̚] của tiếng Hàn và đáp [ɗaːp̚] của tiếng Việt khép môi rồi dừng, không có luồng hơi thoát ra. Vì vậy người Hàn đã quen với phần khó nhất của phụ âm cuối tiếng Việt.
- Phụ âm cuối: bảy âm cuối tiếng Hàn [p̚ t̚ k̚ m n ŋ l] có sáu âm trùng với âm cuối tiếng Việt /p t k m n ŋ/ (viết là p, t, c/ch, m, n, ng/nh).
- /ŋ/: ㅇ ở cuối âm tiết (강) chính là ng cuối của tiếng Việt; tiếng Việt còn dùng âm này ở đầu âm tiết (ngà).
- Bật hơi: ㅌ /tʰ/ gần với th /tʰ/ của tiếng Việt; t /t/ không bật hơi của tiếng Việt gần với ㄸ hơn là ㄷ.
- Nguyên âm: ㅣ[i], ㅔ[e], ㅏ[a], ㅜ[u], ㅗ[o] gần với i, ê, a, u, ô; ㅡ [ɯ] là điểm xuất phát tốt để học ư [ɨ].
- Bán nguyên âm + nguyên âm: 와 [wa], 워 [wʌ] giống oa [wa], uơ của tiếng Việt.
- Nhịp: cả hai đều nói theo nhịp âm tiết, mọi nguyên âm được phát âm đầy đủ, không bị rút gọn như tiếng Anh.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Hàn
- Thanh điệu từ vựng: giọng Hà Nội có sáu thanh; đường nét cao độ và chất giọng của từng âm tiết làm đổi nghĩa từ (ma, mà, má, mả, mã, mạ). Tiếng Hàn chuẩn Seoul không có thanh điệu từ vựng, cao độ chỉ tạo ngữ điệu cụm từ.
- Âm hút vào b [ɓ], đ [ɗ]: hữu thanh, có luồng khí hơi hút vào. Tiếng Hàn không có âm tắc hữu thanh là âm vị (ㅂ, ㄷ chỉ hữu thanh giữa hai nguyên âm).
- Các âm xát /f/ (ph), /v/, /z/ (d, gi, r ở Hà Nội), /x/ (kh), /ɣ/ (g, gh) không phải âm vị tiếng Hàn.
- Nguyên âm ơ [əː], â [ə] ngắn, ă ngắn, và sự đối lập e [ɛ] / ê [e] (ㅐ/ㅔ đã nhập làm một ở phần lớn người nói).
- Âm cuối ngạc -nh, -ch sau i, ê, a, và khép môi ở cuối ông [ʔəwŋ͡m], học [hawk͡p].
## B. Có trong tiếng Hàn nhưng không có trong tiếng Việt
- Đối lập ba chiều thường/căng/bật hơi (ㄱ/ㄲ/ㅋ, ㅈ/ㅉ/ㅊ); tiếng Việt chỉ có đối lập hai chiều như t/th.
- Âm cuối /l/ (말) và ㄹ luân phiên [ɾ]~[l]; không âm tiết tiếng Việt nào kết thúc bằng l.
- Biến đổi âm giữa các âm tiết (mũi hóa 국물 → [궁물], nối âm); trong tiếng Việt mỗi âm tiết giữ nguyên âm cuối của mình.
## C. Dễ nhầm lẫn
- t tiếng Việt không phải ㄷ: không bật hơi, giống ㄸ nhưng ít căng hơn; th gần với ㅌ, không phải "th" tiếng Anh.
- ư [ɨ] ở giữa miệng hơn ㅡ; ơ [əː] ở giữa và dài hơn ㅓ [ʌ].
- -c sau o, ô, u kết thúc bằng khép môi (học ≈ [hawk͡p]), không đọc thành 학.
## D. Khác biệt hệ thống
Người Hàn quen dùng cao độ theo cụm từ; trong tiếng Việt cao độ thuộc về từng âm tiết và phải giữ cả khi nói nhanh. Âm tiết kết thúc bằng p, t, c, ch chỉ mang thanh sắc hoặc nặng.
""",
    },
    "ja": {
        "title": "Tiếng Nhật và tiếng Việt",
        "common": """
Tiếng Nhật và tiếng Việt đều có nhịp đều, rõ và nhiều phụ âm đơn giản, nên người Nhật thường bắt đầu với phụ âm đầu tiếng Việt khá dễ dàng.
- Phụ âm: /m n p b t d k ɡ s h/ có ở cả hai; ニャ [ɲa] cho âm nh [ɲ] (nhà), ン trước k/g ([ŋ]) cho âm ng.
- Nguyên âm: a, i, e, o của tiếng Nhật gần với a, i, ê, ô; u tiếng Nhật không tròn môi [ɯ], là bước đệm tốt cho ư [ɨ] (u tiếng Việt tròn môi hoàn toàn).
- Nhịp: không ngôn ngữ nào rút gọn nguyên âm; mỗi đơn vị được phát âm đầy đủ, đều đặn.
- Cao độ quan trọng ở cả hai: tiếng Nhật phân biệt 箸/橋 bằng trọng âm cao độ, nên người Nhật đã quen lắng nghe cao độ.
- Tắc thanh hầu: っ trước chỗ ngừng và đầu âm tiết bắt đầu bằng nguyên âm của tiếng Việt (ăn [ʔan]) đều có động tác đóng thanh hầu.
- Âm tắc vô thanh: /t k/ tiếng Nhật chỉ bật hơi nhẹ, gần với t, c tiếng Việt.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Nhật
- Thanh điệu từ vựng: sáu thanh có đường nét và chất giọng khác nhau (ngã có ngắt thanh hầu, nặng có tắc thanh hầu). Trọng âm cao độ tiếng Nhật là hệ thống khác: nó cho biết cao độ hạ xuống ở mora nào trong từ, không phải một đường nét trên mỗi âm tiết.
- Phụ âm cuối: -p, -t, -c/-ch, -m, -n, -ng/-nh, đều không bật ra. Tiếng Nhật chỉ có ン và っ, nên người Nhật hay thêm nguyên âm (táp → タプ). Hãy khép miệng và im lặng sau âm cuối.
- Đối lập âm vị giữa th [tʰ] bật hơi và t [t] không bật hơi.
- Âm hút vào b [ɓ], đ [ɗ]; âm xát /f v z x ɣ/ (ふ tiếng Nhật là [ɸ], không phải [f]).
- Mười một chất lượng nguyên âm gồm ơ [əː], â [ə], ă, ư [ɨ], e [ɛ]/ê [e], o [ɔ]/ô [o], cùng nguyên âm đôi ia, ưa, ua.
## B. Có trong tiếng Nhật nhưng không có trong tiếng Việt
- Nguyên âm dài là âm vị (おばさん/おばあさん) và phụ âm kép (きて/きって). Độ dài trong tiếng Việt gắn với chất lượng nguyên âm (a/ă, ơ/â), không phải một đối lập riêng.
- Mora là đơn vị nhịp, ン đổi thành [m n ŋ ɴ] theo âm sau, nguyên âm vô thanh hóa (です [des]).
- /ts/ (つ), [ɕ] (し), [dʑ] (じ).
## C. Dễ nhầm lẫn
- Hàng ら [ɾ] của tiếng Nhật dùng cho cả l và r; trong tiếng Việt l là [l] rõ, r là [z] ở Hà Nội và [ɹ]~[r] ở miền Nam.
- ư không phải ウ: giữ môi dẹt, lưỡi ở giữa.
- -n và -ng cuối tạo ra từ khác nhau (tan / tang); ン của tiếng Nhật không phân biệt điều này.
## D. Khác biệt hệ thống
Từ tiếng Nhật gồm nhiều mora với một kiểu trọng âm; tiếng Việt mỗi hình vị là một âm tiết mang thanh riêng. Âm tiết kết thúc bằng -p, -t, -c, -ch chỉ mang thanh sắc hoặc nặng.
""",
    },
    "zh": {
        "title": "Tiếng Mân Nam Đài Loan, tiếng Quảng Đông và tiếng Việt",
        "note": """
Chữ Hán phồn thể là hệ chữ viết, không phải một cách phát âm. Ngôn ngữ chuẩn ở Đài Loan là tiếng Quan Thoại (國語); phần dưới đây so sánh hai ngôn ngữ Hán khác có hệ thống âm rất khác tiếng Quan Thoại: tiếng Mân Nam Đài Loan (臺灣台語/閩南語) và tiếng Quảng Đông (粵語) ở Hồng Kông và Quảng Đông.
""",
        "subsections": {
            "nan": {
                "title": "Tiếng Mân Nam Đài Loan và tiếng Việt",
                "common": """
Tiếng Mân Nam Đài Loan giữ nhiều đặc điểm của tiếng Hán cổ mà tiếng Việt cũng có, nên người nói tiếng Mân Nam nhận ra phần lớn cấu trúc âm tiết tiếng Việt.
- Âm cuối tắc: âm tiết nhập thanh có -p, -t, -k và tắc thanh hầu -h [ʔ] (十 tsa̍p, 日 ji̍t, 學 ha̍k), tương ứng với -p, -t, -c tiếng Việt.
- Có đủ âm cuối mũi -m, -n, -ng (心 sim ↔ tâm, 山 san, 東 tang).
- Bật hơi: p/ph, t/th, k/kh song song với t/th tiếng Việt; c [k] tiếng Việt giống k tiếng Mân Nam.
- Có b, g hữu thanh (bah, gû), giúp học các phụ âm đầu hữu thanh của tiếng Việt.
- Thanh điệu: nhiều thanh từ vựng, thanh ngắn trên âm tiết có âm cuối tắc — giống quy tắc tiếng Việt chỉ cho sắc và nặng trên âm tiết kết thúc bằng -p, -t, -c, -ch.
- ng ở đầu âm tiết (雅 ngá) cũng quen thuộc như ngà trong tiếng Việt.
""",
                "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Mân Nam
- Thanh có thanh hầu hóa ngã, nặng, và thanh huyền thấp có hơi thở.
- Âm hút vào b [ɓ], đ [ɗ]; âm xát ph [f], v, d/gi [z], kh [x], g [ɣ].
- Nguyên âm ư [ɨ], ơ/â [ə], e [ɛ], đối lập ô [o]/o [ɔ]; nguyên âm đôi ưa, ươ.
- Âm ngạc ch [c], nh [ɲ].
## B. Có trong tiếng Mân Nam nhưng không có trong tiếng Việt
- Nguyên âm mũi hóa (三 sann [sã], 天 thinn): tiếng Việt không có nguyên âm mũi; an phải kết thúc bằng [n] thật.
- Biến điệu rộng rãi: gần như mọi âm tiết không ở cuối cụm đều đổi thanh; tiếng Việt giữ nguyên thanh của từng âm tiết.
- m, ng tự thành âm tiết (毋 m̄, 黃 n̂g) và âm cuối thanh hầu -h.
- Âm tắc xát ts, tsh, j [dz].
## C. Dễ nhầm lẫn
- -c sau a, ă là [k̚]; sau o, ô, u còn khép môi (học [hawk͡p]).
- t không bật hơi, th bật hơi như tiếng Mân Nam, nhưng chữ viết khác Bạch thoại tự (Pe̍h-ōe-jī): ph tiếng Việt = [f], không phải [pʰ].
- Đừng áp dụng thói quen biến điệu của tiếng Mân Nam vào từ ghép tiếng Việt.
## D. Khác biệt hệ thống
Cả hai đều có thanh điệu và âm tiết nhập thanh, nhưng thanh tiếng Việt cố định trên từng âm tiết và gồm cả chất giọng (thanh quản rung kẹt, tắc thanh hầu), không chỉ cao độ.
""",
            },
            "yue": {
                "title": "Tiếng Quảng Đông và tiếng Việt",
                "common": """
Tiếng Quảng Đông có lẽ là ngôn ngữ Hán có cấu trúc âm tiết gần tiếng Việt nhất.
- Âm cuối: đúng bộ -p, -t, -k, -m, -n, -ng như tiếng Việt, đều không bật ra (十 sap6, 日 jat6, 學 hok6).
- Thanh điệu: sáu thanh đối lập, âm tiết có âm cuối tắc mang nhập thanh — giống sắc/nặng trên -p, -t, -c, -ch.
- Độ dài nguyên âm: aa [aː] / a [ɐ] (三 saam / 心 sam) giống a [aː] / ă [a] và ơ [əː] / â [ə].
- Bật hơi: đối lập b/p, d/t, g/k (Việt bính) giống t/th tiếng Việt.
- Có ng [ŋ] đầu âm tiết (我 ngo5) như ngà.
- Tương ứng Hán Việt thường rõ ràng: 國 gwok3 ↔ quốc, 心 sam1 ↔ tâm, 南 naam4 ↔ nam.
""",
                "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Quảng Đông
- Thanh ngã, nặng có thanh hầu hóa; huyền có hơi thở. Thanh tiếng Quảng Đông chủ yếu khác nhau về độ cao và đường nét.
- Âm hút vào b [ɓ], đ [ɗ]; âm xát hữu thanh v, d/gi [z], g [ɣ]; kh [x] (h tiếng Quảng Đông là [h]).
- Âm ngạc ch [c], nh [ɲ]; ư [ɨ]; đối lập e [ɛ]/ê [e].
- Nguyên âm đôi hướng giữa ia, ưa, ua.
## B. Có trong tiếng Quảng Đông nhưng không có trong tiếng Việt
- Nguyên âm trước tròn môi yu [y], oe/eo [œ ɵ] (魚 jyu, 靴 hoe).
- gw, kw môi hóa (國 gwok, 裙 kwan); trong quốc, [w] thuộc về âm đệm.
- m, ng tự thành âm tiết (唔 m4, 五 ng5); ba thanh bằng chỉ khác nhau về độ cao.
## C. Dễ nhầm lẫn
- d tiếng Việt là [z] (Hà Nội) hoặc [j] (miền Nam), không phải [t]; đ là [ɗ].
- Đừng chuyển thanh tiếng Việt thành số thanh tiếng Quảng Đông: ngang là ngang giữa, sắc là lên cao, huyền là xuống thấp có hơi thở.
- -c, -ng sau o, ô, u khép môi: học [hawk͡p], ông [ʔəwŋ͡m].
## D. Khác biệt hệ thống
Cả hai đều có sáu thanh và âm tiết nhập thanh, nhưng tiếng Việt phân biệt thanh bằng cả chất giọng lẫn cao độ, và không có biến điệu.
""",
            },
        },
    },
    "zh_cn": {
        "title": "Tiếng Trung phổ thông và tiếng Việt",
        "common": """
Tiếng Trung phổ thông (Putonghua) và tiếng Việt đều là ngôn ngữ có thanh điệu với hình vị một âm tiết, và qua nhiều thế kỷ tiếp xúc, tiếng Việt có kho từ Hán Việt lớn, nên người nói tiếng Trung có nhiều lợi thế thực sự.
- Thanh điệu: mỗi âm tiết có thanh từ vựng. Thanh 2 (35) giống sắc; thanh 3 lượn (214) gần với hỏi.
- Bật hơi: d/t [t]/[tʰ] của tiếng Trung tương ứng t [t] / th [tʰ]; c [k] tiếng Việt là g [k] tiếng Trung, còn kh là âm xát [x] như h tiếng Trung.
- Cấu trúc âm tiết: (thanh mẫu) + (âm đệm) + âm chính + (âm cuối), một thanh phủ cả âm tiết — cùng khuôn với tiếng Trung.
- Có chung âm cuối mũi -n, -ng; ng [ŋ] trong hang chính là -ng tiếng Việt.
- Từ Hán Việt tương ứng có quy luật với chữ Hán: 學 xué ↔ học, 國 guó ↔ quốc, 心 xīn ↔ tâm.
- Âm uốn lưỡi: sh [ʂ], r [ʐ] tiếng Trung giống s, r tiếng Việt khi nói rõ hoặc theo giọng miền Nam.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Trung
- Sáu thanh (Hà Nội), hai thanh có thanh hầu hóa: ngã (đi lên, bị ngắt quãng bởi thanh hầu) và nặng (ngắn, thấp, kết thúc bằng tắc thanh hầu). Tiếng Trung có bốn thanh và thanh nhẹ, không thanh hầu hóa; thanh 1 (55) cao hơn thanh ngang (33).
- Âm cuối tắc -p, -t, -c/-ch và -m: tiếng Trung phổ thông đã mất, dù chữ Hán từng có trong tiếng Hán trung cổ (十 thập, 心 tâm).
- Phụ âm hữu thanh: âm hút vào b [ɓ], đ [ɗ]; âm xát v, d/gi [z], g [ɣ].
- Nguyên âm ơ/â [ə], ư [ɨ], đối lập e [ɛ]/ê [e] và o [ɔ]/ô [o]; nguyên âm đôi ia, ưa, ua.
## B. Có trong tiếng Trung nhưng không có trong tiếng Việt
- Nguyên âm trước tròn môi ü [y] (绿, 女).
- Âm lợi-ngạc j q x [tɕ tɕʰ ɕ], âm tắc xát z c [ts tsʰ] và nói chung các âm tắc xát bật hơi.
- Nhi hóa (儿化), thanh nhẹ, biến điệu (thanh 3 trước thanh 3).
## C. Dễ nhầm lẫn
- ch tiếng Việt [c] là âm tắc ngạc, không phải ch [tʂʰ] hay q [tɕʰ] tiếng Trung; tr là [c] ở Hà Nội, [ʈ] ở miền Nam.
- x tiếng Việt là [s] (như s tiếng Trung); s tiếng Việt là [s] ở Hà Nội, [ʂ] ở miền Nam.
- th là [tʰ] bật hơi (t tiếng Trung), không phải [θ].
- Thanh nặng không phải thanh 4 tiếng Trung: bắt đầu thấp và bị cắt bằng tắc thanh hầu.
## D. Khác biệt hệ thống
Dù trông giống nhau, đường nét thanh vẫn khác: hãy học từng thanh tiếng Việt theo độ cao, hình dạng và chất giọng. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng, giống "nhập thanh" ngày xưa.
""",
    },
    "cs": {
        "title": "Tiếng Séc và tiếng Việt",
        "common": """
Người nói tiếng Séc có lợi thế ở một số phụ âm tiếng Việt mà nhiều người học thấy khó.
- Âm tắc không bật hơi: p, t, k tiếng Séc không bật hơi, giống hệt p, t, c/k tiếng Việt.
- Âm ngạc: ň [ɲ] = nh (nhà); ť [c] rất gần ch [c] (cha); ď [ɟ] cũng là điểm tham chiếu hữu ích.
- Âm xát ngạc mềm: ch [x] tiếng Séc = kh (khá).
- Âm xát hữu thanh v, z có ở cả hai (v, và d/gi/r = [z] ở Hà Nội).
- Độ dài nguyên âm: a/á tiếng Séc đối lập độ dài; a [aː] / ă [a] và ơ [əː] / â [ə] tiếng Việt cũng ghép cặp dài – ngắn, nhưng khác cả chất lượng.
- i, e, a, o, u gần với i, ê/e, a, ô/o, u.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Séc
- Sáu thanh từ vựng (Hà Nội). Cao độ tiếng Séc chỉ là ngữ điệu, trọng âm cố định ở âm tiết đầu.
- /ŋ/ đầu âm tiết (ngà, nghe); [ŋ] tiếng Séc chỉ xuất hiện trước k/g (banka).
- th [tʰ] bật hơi đối lập với t [t]; âm hút vào b [ɓ], đ [ɗ]; g [ɣ] (khác h [ɦ] tiếng Séc).
- Nguyên âm ư [ɨ], ơ/â [ə], đối lập e [ɛ]/ê [e], o [ɔ]/ô [o].
- Âm cuối -p, -t, -c không bật ra, khép môi sau o, ô, u.
## B. Có trong tiếng Séc nhưng không có trong tiếng Việt
- Cụm phụ âm (zmrzlina, čtvrt) và r, l tự thành âm tiết (vlk).
- ř [r̝], š [ʃ], ž [ʒ], č [tʃ], c [ts]; h hữu thanh [ɦ].
- Vô thanh hóa cuối từ và đồng hóa hữu thanh (led [let]).
## C. Dễ nhầm lẫn
- x tiếng Việt là [s], s là [s] (Hà Nội) hoặc [ʂ] (miền Nam), không phải š.
- h tiếng Việt vô thanh [h], khác h [ɦ] tiếng Séc.
- ư không phải y tiếng Séc: y = [ɪ], ư = [ɨ] (giữa lưỡi, môi dẹt).
## D. Khác biệt hệ thống
Tiếng Séc nhấn âm tiết đầu và dùng độ dài; tiếng Việt không có trọng âm từ cố định, mỗi âm tiết có thanh riêng. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng.
""",
    },
    "de": {
        "title": "Tiếng Đức và tiếng Việt",
        "common": """
Tiếng Đức có một số chi tiết phụ âm và nhịp điệu dùng được ngay cho tiếng Việt.
- Tắc thanh hầu đầu từ: tiếng Đức chèn tắc thanh hầu trước nguyên âm đầu từ (ein [ʔaɪn]); âm tiết tiếng Việt không có phụ âm đầu cũng bắt đầu như vậy (ăn [ʔan]).
- ch [x]: "ach-Laut" tiếng Đức chính là kh (khá).
- Bật hơi: t tiếng Đức [tʰ] gần th; d đầu từ ở nhiều vùng nước Đức vô thanh, không bật hơi, gần t tiếng Việt.
- /ŋ/: ng tiếng Đức (Ding) là ng cuối; tiếng Việt còn dùng ở đầu âm tiết (ngà).
- Nguyên âm i, e, a, o, u dạng căng và lỏng là mốc cho i, ê/e, a/ă, ô/o, u.
- Âm xát hữu thanh v [v] (w tiếng Đức) và z [z] (s trong Sonne) có ở cả hai.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Đức
- Sáu thanh từ vựng (Hà Nội), gồm ngã và nặng có thanh hầu hóa; tiếng Đức dùng cao độ cho ngữ điệu và trọng âm.
- Âm hút vào b [ɓ], đ [ɗ]; âm ngạc ch [c], nh [ɲ]; g [ɣ].
- ư [ɨ], ơ [əː], â [ə] là nguyên âm đầy đủ (âm schwa tiếng Đức chỉ ở âm tiết không nhấn).
- Âm cuối không bật: tiếng Đức bật hoặc vô thanh hóa âm cuối; -p, -t, -c tiếng Việt chỉ khép lại, im lặng.
## B. Có trong tiếng Đức nhưng không có trong tiếng Việt
- Nguyên âm trước tròn môi ü [y], ö [ø]; độ dài nguyên âm đối lập (Staat/Stadt).
- Vô thanh hóa cuối từ (Rad [ʁaːt]) và cụm phụ âm (Strumpf).
- r lưỡi gà [ʁ], sch [ʃ], z [ts], pf.
- Trọng âm từ và âm tiết không nhấn bị rút gọn.
## C. Dễ nhầm lẫn
- d tiếng Việt không phải d tiếng Đức: [z] ở Hà Nội, [j] ở miền Nam; đ mới là [ɗ].
- v tiếng Việt là [v], không phải v [f] tiếng Đức; [f] viết là ph.
- s tiếng Việt là [s]/[ʂ], x là [s]; không cái nào là sch.
- ơ không phải e không nhấn của tiếng Đức, mà là nguyên âm giữa đầy đủ, dài.
## D. Khác biệt hệ thống
Nhịp tiếng Đức theo trọng âm; tiếng Việt theo âm tiết và mỗi âm tiết giữ thanh riêng. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng.
""",
    },
    "en": {
        "title": "Tiếng Anh và tiếng Việt",
        "common": """
Người nói tiếng Anh có thể tận dụng nhiều âm chung, miễn là tách chữ viết khỏi âm thanh.
- Phụ âm: /m n f v s z h l/ có ở cả hai; ph = [f], v = [v], x = [s], ở Hà Nội d/gi/r = [z].
- /ŋ/: âm cuối của "sing" chính là ng; tiếng Việt còn dùng ng ở đầu âm tiết (ngà).
- Bật hơi: t trong "top" [tʰ] là th tiếng Việt; t sau s ("stop") không bật hơi, giống t tiếng Việt.
- Nguyên âm đôi: "eye", "cow", "boy" gần với ai/ay, ao/au, oi.
- Tắc thanh hầu: có trong "uh-oh"; tiếng Việt dùng ở đầu âm tiết bắt đầu bằng nguyên âm và cuối thanh nặng.
- Âm tắc không bật: người nói tiếng Anh thường không bật âm cuối khi nói nhanh ("cat"), đó là chuẩn trong tiếng Việt.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Anh
- Sáu thanh từ vựng (Hà Nội). Trong tiếng Anh cao độ báo hiệu câu hỏi, nhấn mạnh; trong tiếng Việt nó đổi nghĩa từ, nên lên giọng như câu hỏi có thể biến từ này thành từ khác.
- Âm hút vào b [ɓ], đ [ɗ]; âm ngạc ch [c], nh [ɲ]; kh [x], g [ɣ].
- Nguyên âm ư [ɨ], ơ [əː], â [ə], ă; e [ɛ] / ê [e]; nguyên âm đôi ia, ưa, ua.
- Khép môi ở âm cuối sau o, ô, u (ông, học).
## B. Có trong tiếng Anh nhưng không có trong tiếng Việt
- th [θ ð], sh [ʃ], zh [ʒ], ch [tʃ], j [dʒ]; r [ɹ].
- Cụm phụ âm (strengths) và âm cuối như -s, -l, -r, -v; âm tiết tiếng Việt chỉ kết thúc bằng p, t, c/ch, m, n, ng/nh hoặc bán nguyên âm.
- Trọng âm và rút gọn nguyên âm thành schwa.
## C. Dễ nhầm lẫn
- th tiếng Việt là [tʰ], không bao giờ là [θ].
- d là [z] (Bắc) hoặc [j] (Nam); đ là [ɗ] — không cái nào là d tiếng Anh.
- ch là [c] (mặt lưỡi chạm ngạc), không phải ch [tʃ] tiếng Anh.
- -t, -c cuối là động tác khép im lặng: "không phải" không có tiếng bật hay nguyên âm thêm vào.
## D. Khác biệt hệ thống
Tiếng Anh nhịp theo trọng âm và dùng cao độ cho ngữ điệu; tiếng Việt nhịp theo âm tiết, mỗi âm tiết một thanh cố định. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng.
""",
    },
    "fr": {
        "title": "Tiếng Pháp và tiếng Việt",
        "common": """
Tiếng Pháp và tiếng Việt có chung một số thói quen cấu âm. (Chữ Quốc ngữ chịu ảnh hưởng nhiều từ các giáo sĩ châu Âu, nhưng lịch sử đó chỉ giải thích chữ viết, không có nghĩa là phát âm giống nhau.)
- Âm tắc không bật hơi: p, t, k tiếng Pháp giống p, t, c tiếng Việt.
- Phụ âm hữu thanh: b, d, v, z tiếng Pháp; tiếng Việt có v [v] và d/gi/r [z] (Hà Nội); b, d tiếng Pháp là điểm xuất phát tạm được cho b [ɓ], đ [ɗ].
- gn [ɲ]: gn trong agneau là nh (nhà).
- Nguyên âm: i, é [e], è [ɛ], a, o [o], ò [ɔ], ou [u] tương ứng i, ê, e, a, ô, o, u — kể cả đối lập e/ê, o/ô mà nhiều người học thấy khó.
- Nhịp: tiếng Pháp theo âm tiết, nguyên âm đầy đủ, như tiếng Việt.
- r lưỡi gà [ʁ] là âm gần đúng hữu ích cho g [ɣ] (gà).
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Pháp
- Sáu thanh từ vựng (Hà Nội); cao độ tiếng Pháp chỉ đánh dấu cuối cụm và ngữ điệu.
- th [tʰ] bật hơi đối lập với t; kh [x]; âm ngạc ch [c].
- /ŋ/ ở đầu và cuối âm tiết (ngà, ông).
- Nguyên âm ư [ɨ], ơ [əː], â [ə], ă.
- Âm cuối -p, -t, -c không bật; tiếng Pháp bật âm cuối (cap [kap]).
## B. Có trong tiếng Pháp nhưng không có trong tiếng Việt
- Nguyên âm mũi (an [ɑ̃], on [ɔ̃], in [ɛ̃]); an, ông tiếng Việt là nguyên âm miệng + phụ âm mũi thật.
- Nguyên âm trước tròn môi u [y], eu [ø œ].
- ch [ʃ], j [ʒ]; nối âm (liaison, enchaînement): tiếng Việt không nối âm cuối sang nguyên âm sau.
## C. Dễ nhầm lẫn
- an tiếng Việt là [aːn], đầu lưỡi chạm lợi; đừng mũi hóa như an tiếng Pháp.
- u tiếng Việt là [u] (ou tiếng Pháp), ư là [ɨ], không phải u [y] tiếng Pháp.
- th tiếng Việt bật hơi [tʰ]; th trong théâtre chỉ là [t].
- r tiếng Việt là [z] (Hà Nội) hoặc [ɹ~r] (miền Nam), không phải [ʁ].
## D. Khác biệt hệ thống
Tiếng Pháp nhấn âm tiết cuối cụm; tiếng Việt mỗi âm tiết một thanh. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng.
""",
    },
    "id": {
        "title": "Tiếng Indonesia và tiếng Việt",
        "common": """
Chữ viết tiếng Indonesia gần như ghi âm, giống tiếng Việt, và hai ngôn ngữ có chung vài âm hiếm gặp ở các ngôn ngữ châu Âu.
- ng [ŋ] đầu âm tiết (ngopi, ngantuk) = ngà, nghe.
- ny [ɲ] = nh (nhà).
- Âm tắc không bật hơi: p, t, k tiếng Indonesia giống p, t, c tiếng Việt.
- Âm cuối không bật: -p, -t cuối (atap, lompat) thường không bật, -k cuối là tắc thanh hầu, gần với âm cuối tiếng Việt.
- Schwa: e pepet [ə] (besar) gần với â [ə] và ơ [əː].
- Nguyên âm a, i, u, e, o trùng với a, i, u, ê/e, ô/o; nguyên âm đôi ai, au, oi giống ai, ao, oi.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Indonesia
- Sáu thanh từ vựng (Hà Nội); tiếng Indonesia không có thanh, cao độ là ngữ điệu.
- th [tʰ] bật hơi đối lập với t [t].
- Âm hút vào b [ɓ], đ [ɗ]; âm xát kh [x], g [ɣ], d/gi/r [z] (Hà Nội), v.
- Nguyên âm ư [ɨ], ă, đối lập e [ɛ]/ê [e] và o [ɔ]/ô [o]; nguyên âm đôi ia, ưa, ua.
- Âm ngạc ch [c] và khép môi sau o, ô, u (ông, học).
## B. Có trong tiếng Indonesia nhưng không có trong tiếng Việt
- Âm cuối -s, -l, -r, -h (bus, jual, pasar, rumah).
- c [tʃ], j [dʒ], sy [ʃ].
- Từ nhiều âm tiết với trọng âm (yếu) ở âm tiết áp chót, và phụ tố.
## C. Dễ nhầm lẫn
- c trước a, o, u là [k] (cá), không phải c [tʃ] tiếng Indonesia.
- ch là [c] (âm tắc ngạc), không phải [tʃ].
- x là [s]; s là [s] hoặc [ʂ].
- -c cuối là động tác khép im lặng ở ngạc mềm [k̚], không phải tắc thanh hầu của -k tiếng Indonesia.
## D. Khác biệt hệ thống
Từ tiếng Indonesia nhiều âm tiết, không thanh; hình vị tiếng Việt một âm tiết, mỗi âm tiết một thanh. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng.
""",
    },
    "hu": {
        "title": "Tiếng Hungary và tiếng Việt",
        "common": """
Người nói tiếng Hungary có thể dựa vào các phụ âm ngạc và cảm nhận về độ dài nguyên âm.
- ny [ɲ] = nh (nhà); ty [c] rất gần ch (cha).
- Âm tắc không bật hơi: p, t, k tiếng Hungary giống p, t, c tiếng Việt.
- Độ dài nguyên âm: tiếng Hungary đối lập ngắn – dài; cặp a [aː] / ă [a], ơ [əː] / â [ə] của tiếng Việt hoạt động tương tự (kèm khác biệt chất lượng).
- Nguyên âm i, é [eː], e [ɛ], o, u trùng với i, ê, e, ô/o, u; phân biệt e/é giúp phân biệt e/ê.
- Âm xát hữu thanh v, z có ở cả hai.
- Nhịp: tiếng Hungary giữ nguyên âm không nhấn đầy đủ, gần với nhịp âm tiết của tiếng Việt.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Hungary
- Sáu thanh từ vựng (Hà Nội); cao độ tiếng Hungary là ngữ điệu, trọng âm ở âm tiết đầu.
- /ŋ/ đầu âm tiết (ngà); [ŋ] tiếng Hungary chỉ có trước k, g.
- th [tʰ] bật hơi; âm hút vào b [ɓ], đ [ɗ]; kh [x], g [ɣ].
- Nguyên âm ư [ɨ], ơ/â [ə], ă.
- Âm cuối không bật và khép môi sau o, ô, u.
## B. Có trong tiếng Hungary nhưng không có trong tiếng Việt
- Nguyên âm trước tròn môi ö, ő, ü, ű và hài hòa nguyên âm.
- Phụ âm kép (tt, ll) và cụm phụ âm.
- cs [tʃ], s [ʃ], zs [ʒ], c [ts], gy [ɟ].
## C. Dễ nhầm lẫn
- Bẫy chính tả: s tiếng Việt là [s] (Hà Nội) hoặc [ʂ], không phải s [ʃ] tiếng Hungary; x tiếng Việt là [s] (sz tiếng Hungary).
- a tiếng Việt là [aː], không phải a [ɒ] tiếng Hungary.
- gi tiếng Việt là [z] (Hà Nội) hoặc [j] (miền Nam), không phải gy.
## D. Khác biệt hệ thống
Tiếng Hungary đánh dấu đầu từ bằng trọng âm và dùng đối lập độ dài; tiếng Việt mỗi âm tiết một thanh. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng.
""",
    },
    "pl": {
        "title": "Tiếng Ba Lan và tiếng Việt",
        "common": """
Tiếng Ba Lan có những âm khớp rất tốt với các âm tiếng Việt mà người châu Âu khác thấy khó.
- y [ɨ]: y tiếng Ba Lan (my, ryba) rất gần ư [ɨ] (như, từ).
- Dãy uốn lưỡi: sz [ʂ], ż/rz [ʐ] gần với s, r tiếng Việt khi nói rõ hoặc theo giọng miền Nam.
- ń [ɲ] = nh; ch/h [x] = kh.
- Âm tắc không bật hơi: p, t, k tiếng Ba Lan giống p, t, c tiếng Việt.
- Âm xát hữu thanh w [v], z [z] = v, d/gi/r (Hà Nội [z]).
- Nguyên âm a, e [ɛ], i, o [ɔ], u tương ứng a, e, i, o, u.
""",
        "diff": """
## A. Có trong tiếng Việt nhưng không có (hoặc khác) trong tiếng Ba Lan
- Sáu thanh từ vựng (Hà Nội); tiếng Ba Lan nhấn âm tiết áp chót, cao độ là ngữ điệu.
- /ŋ/ đầu âm tiết (ngà); [ŋ] tiếng Ba Lan chỉ có trước k, g.
- th [tʰ] bật hơi; âm hút vào b [ɓ], đ [ɗ]; g [ɣ]; âm tắc ngạc ch [c].
- Nguyên âm ơ [əː], â [ə], ă, và ê [e], ô [o] khép đối lập với e [ɛ], o [ɔ].
- Âm cuối không bật và khép môi sau o, ô, u.
## B. Có trong tiếng Ba Lan nhưng không có trong tiếng Việt
- Nguyên âm mũi ą, ę; cụm phụ âm (chrząszcz, wzgórze).
- Âm lợi-ngạc ś ź ć dź [ɕ ʑ tɕ dʑ] và âm tắc xát c, cz, dz, dż.
- Vô thanh hóa cuối từ (chleb [xlɛp]) và đồng hóa hữu thanh.
## C. Dễ nhầm lẫn
- ch tiếng Việt [c] là âm tắc, không phải ć [tɕ] hay cz [tʂ].
- x = [s]; s = [s] (Hà Nội) hoặc [ʂ] (như sz, miền Nam).
- e tiếng Việt là [ɛ] mở như e tiếng Ba Lan; ê là [e] khép, tiếng Ba Lan không có như một nguyên âm riêng.
## D. Khác biệt hệ thống
Từ tiếng Ba Lan có trọng âm cố định và nhiều cụm phụ âm; âm tiết tiếng Việt đơn giản và mỗi âm tiết mang một thanh. Âm tiết -p, -t, -c, -ch chỉ mang sắc hoặc nặng.
""",
    },
}
