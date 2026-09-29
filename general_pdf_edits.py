# -*- coding: utf-8 -*-
"""Display-only corrections of [문법] > [일반 문법] lines, requested by the course owner.

The extracted records (GENERAL_PDF, jw_extraction/data/general/derived_general_data.json) stay exactly as extracted;
the page swaps a line for its corrected text when it renders the record. Each entry is
    <grammar record id>: [[<line as shown before (control characters removed, wrapped lines rejoined,
                           whitespace collapsed)>, <line to show>], ...]
build_app.py checks that every listed line still exists in its record, so a changed source cannot silently drop an
edit. The other UI languages read general_pdf_grammar_ai_translations.json (their own wording of the section).
"""
import re

GENERAL_PDF_GRAMMAR_EDITS = {
    # 1. 인사 표현: Korean greetings in natural order ("형/오빠, 안녕하세요."), each Chào chị. meaning on its own line,
    # and a word box with all four words of the section.
    "pdf-grammar-5fe43f5b82a00ffc": [
        ["A Chào anh. 안녕하세요, 형/오빠.", "A   Chào anh. 형/오빠, 안녕하세요."],
        ["B Chào em. 안녕, 동생", "B   Chào em. 동생, 안녕."],
        ["안녕하세요, 누나/언니.", "Chào chị.   누나/언니, 안녕하세요."],
        ["Chào chị. 안녕히 가세요, 누나/언니.", "Chào chị.   누나/언니, 안녕히 가세요."],
        ["안녕히 계세요, 누나/언니.", "Chào chị.   누나/언니, 안녕히 계세요."],
        ["단어 chị 누나/언니", "단어     chào 인사하다 anh 형/오빠 chị 누나/언니 em 동생"],
        ["A Chào bố. 안녕하세요, 아빠. A Chào chị. 안녕하세요, 누나/언니.",
         "A:   Chào bố. 아빠, 안녕하세요.   A:   Chào chị. 누나/언니, 안녕하세요."],
        ["B Chào con. 안녕, 자녀. B Chào em. 안녕, 동생.", "B:   Chào con. 얘야, 안녕.   B:   Chào em. 동생, 안녕."],
        ["A Chào chị. 안녕하세요, 누나/언니.", "A   Chào chị. 누나/언니, 안녕하세요."],
        ["B Chào em. 안녕, 동생.", "B   Chào em. 동생, 안녕."],
        ["‘안녕하세요.’와 ‘안녕하세요, 형. 안녕하세요, 오빠’는 어감이 다르지요. 베트남 사람들은 이러한 호칭을 가정에서만이 아니라 학교와 직장에서도 폭넓게 사용하여 정감을 표현해요.",
         "‘안녕하세요.’와 ‘형, 안녕하세요. 오빠, 안녕하세요.’는 어감이 다르지요. 베트남 사람들은 이러한 호칭을 가정에서만이 아니라 학교와 직장에서도 폭넓게 사용하여 정감을 표현해요."],
    ],
    # 84. cần phải / đừng: the last two cần phải examples, the đừng explanation and a missing space.
    "pdf-grammar-6fe0211e2e1d3823": [
        ["phải mua nhà : mua nhà (집을 사다) → 집을 살 필요가 있다.",
         " cần phải mua nhà :        mua nhà (집을 사다)         →   집을 살 필요가 있다."],
        ["phải đi thư viện : đi thư viện (도서관에 가다) → 도서관에 가야 한다.",
         " cần phải đi thư viện :    đi thư viện (도서관에 가다)   →   도서관에 가야 한다."],
        ["đừng + 동사의 형태로 ‘동사하지 마라’ 또는 ‘동사해서는 안된다’라는 의미로 사용된다.",
         "đừng + (동사) ~의 형태로 ‘(동사) ~하지 마라’라는 의미로 사용된다."],
        ["đừngcười đùa : cười đùa (웃다) → 웃어서는 안된다.", " đừng cười đùa :         cười đùa (웃다)             → 웃어서는 안된다."],
    ],
}


# Item titles ([일반 문법] "N. title"), requested by the course owner: the grammar points of the item in order,
# each as [<Vietnamese pattern>, <short Korean meaning>], joined with " | ". The Korean view shows both; the other
# UI languages show the Vietnamese patterns. They replace the titles derived from the section headings.
GENERAL_PDF_GRAMMAR_TITLES = {
    "pdf-grammar-b43eda6e50d23953": [  # 43
        ["để", "~하기 위해서"], ["", "~에 두다"], ["", "~하게 두다"],
    ],
    "pdf-grammar-6fe0211e2e1d3823": [  # 84
        ["cần phải", "~ 해야 한다"], ["đừng", "~ 하지 마라"],
    ],
    "pdf-grammar-6ce281dae680fddf": [  # 85
        ["cấm", "~ 금지(하다)"], ["không được", "~해서는 안 된다"],
    ],
    "pdf-grammar-cac335335d611b1b": [  # 86
        ["khi A thì B", "A할 때 B하다"], ["khi nào thì", "언제 ~하나?"],
    ],
    "pdf-grammar-2d80d70912c65ca4": [  # 87
        ["dù A thì B", "비록 A라도 B하다"], ["định", "~할 예정이다"],
    ],
    "pdf-grammar-60ac5bf82b2e79ad": [  # 88
        ["là", "~이다"], ["chính là", "바로 ~이다"],
    ],
    "pdf-grammar-17d2ec614fb5225d": [  # 89
        ["xin ... làm ơn", "~해 주세요 (정중한 부탁)"], ["hãy ... đi", "~하시죠"], ["giá A thì B", "만일 A했다면 B했을 것이다"],
    ],
    "pdf-grammar-e192071b9ae0b908": [  # 90
        ["đông / vắng", "붐비다 / 한산하다"], ["luôn luôn", "항상"], ["chỉ khi A thì B", "A할 때만 B하다"],
    ],
    "pdf-grammar-2245b4d7f29bbaf6": [  # 91
        ["giống như, như, giống", "~와 같다, ~와 비슷하다"], ["cái gì cũng", "무엇이든 다"], ["nếu A thì B", "만일 A하면 B하다"],
    ],
    "pdf-grammar-70c62129312905f3": [  # 92
        ["tùy thuộc (vào)", "~에 따라 달라지다"], ["có A có B", "A도 있고 B도 있다"], ["có thể A (cũng) có thể B", "A일 수도 B일 수도 있다"],
    ],
    "pdf-grammar-6e38b40c6ed914a4": [  # 93
        ["tuy A nhưng B", "비록 A지만 B하다"], ["không những A mà còn B", "A뿐만 아니라 B도"], ["so (với) A thì B", "A와 비교하면 B하다"],
    ],
    "pdf-grammar-2fd6d91b05562d1e": [  # 94
        ["~ nào cũng", "어느 ~나 모두"], ["vì A nên B", "A 때문에 B하다"],
    ],
    "pdf-grammar-a42a0c1ebe06d9fb": [  # 95
        ["... bao giờ chưa?", "~한 적이 있어요?"], ["chắc là A", "아마 A일 것이다"],
    ],
    "pdf-grammar-35d92ef380e611bf": [  # 96
        ["mấy, vài", "몇몇"], ["phần lớn là A, phần nhiều là A", "대부분 A이다"], ["ngoài A (ra) B", "A 이외에(도) B"],
    ],
    "pdf-grammar-7f5cd0815ca01067": [  # 97
        ["A là một trong những B", "A는 B 중 하나이다"], ["toàn bộ", "전체, 모두"], ["A bao nhiêu thì B bấy nhiêu", "A한 만큼 B도 그만큼"],
    ],
    "pdf-grammar-21e3d692d0ed53d1": [  # 98
        ["từ A đến / tới B", "A에서 B까지"], ["bởi", "~ 때문에"],
    ],
    "pdf-grammar-c9a4238bbe6f0933": [  # 99
        ["khoảng", "약, 대략"], ["vừa A vừa B", "A하면서 B하다"], ["càng A càng B", "A할수록 B하다"],
    ],
    "pdf-grammar-cfd03c8c6afdd07c": [  # 100
        ["hình như A thì phải", "아마 A인 것 같다"], ["không phải (là) A mà là B", "A가 아니라 B이다"],
    ],
    "pdf-grammar-61b80adb89a99021": [  # 101
        ["nhau", "서로"], ["mời", "권하다, 초대하다"], ["đi", "(문장 끝) ~하자, ~해라"],
    ],
    "pdf-grammar-ead905dfc9d23f28": [  # 102
        ["trở thành", "~이 되다"], ["nhất", "가장 ~한"],
    ],
    "pdf-grammar-5e01ce148b12258b": [  # 103
        ["ra", "나가다"], ["vào", "들어가다"], ["lên", "올라가다"], ["xuống", "내려가다"],
    ],
    "pdf-grammar-5da7f279160f59ac": [  # 104
        ["đã", "(문장 끝) 먼저 ~하다"], ["nào", "(문장 끝) 자, ~하자"],
    ],
    "pdf-grammar-64a3bdff11ec88f0": [  # 105
        ["mà", "그러나, 그리고"], ["nhưng", "그러나"], ["từng", "각각의"],
    ],
    "pdf-grammar-e559565668b6e8cb": [  # 106
        ["vì vậy", "그 때문에"], ["hễ A là B", "A하기만 하면 B하다"],
    ],
    "pdf-grammar-61e6271d9ac9e2b3": [  # 107
        ["cái, con", "분류사 (무생물 / 생물)"], ["~ nào cũng", "어느 ~나 모두"],
    ],
    "pdf-grammar-3fbfd0d095259a1a": [  # 108
        ["có A không?", "A해요? (의문문)"],
    ],
    "pdf-grammar-41da38231488b4d5": [  # 109
        ["không những A mà còn B", "A뿐만 아니라 B도"], ["cả A lẫn B", "A와 B 모두"], ["trước, sau", "~ 이전에, ~ 이후에"],
    ],
    "pdf-grammar-31a85a1483e2be74": [  # 110
        ["trước khi A", "A하기 전에"], ["sau khi A", "A한 후에"],
    ],
    "pdf-grammar-78e9a3e5484eebb1": [  # 111
        ["thứ nhất, thứ hai, ... cuối cùng", "첫째, 둘째, … 마지막으로"], ["có", "있다"], ["còn", "남아 있다"],
    ],
    "pdf-grammar-7a2884c209322462": [  # 112
        ["nếu A thì B", "만일 A하면 B하다"], ["~ giùm A", "A를 위해 ~해 주다"],
    ],
    "pdf-grammar-c9ba6b7dc4ab1263": [  # 113
        ["A kẻo B", "B하지 않도록 A하다"], ["không thì", "그렇지 않으면"],
    ],
    "pdf-grammar-5fb08b6649d90164": [  # 114
        ["mỗi, từng", "각각의, ~마다"], ["có A mới B", "A하고 나서야 B하다"],
    ],
    "pdf-grammar-852d4766741cde3a": [  # 115
        ["gửi lời A đến B", "A라는 말을 B에게 전하다"], ["thế nào cũng", "어떻게든, 틀림없이"], ["hoặc, hay", "또는"], ["xin phép", "허락을 구하다"],
    ],
    "pdf-grammar-d31e6abd452b45cf": [  # 116
        ["không gì / không ai / không đâu ... bằng A", "A만큼 ~한 것(사람, 곳)은 없다"], ["nhân dịp", "~를 맞아"],
    ],
    "pdf-grammar-4000cee0aaf1f1b1": [  # 117
        ["tiếc là", "~해서 유감이다"], ["nghe nói", "~라고 들었다"],
    ],
    "pdf-grammar-ee57d90cc71cb280": [  # 118
        ["bị", "(불리한 일을) 당하다"], ["được", "(좋은 일을) 받다, 얻다"],
    ],
    "pdf-grammar-133c5593b2baf58e": [  # 119
        ["tất cả (mọi)", "모두, 전체"], ["cả", "모두, 전체"], ["hãy", "~하세요"],
    ],
    "pdf-grammar-ad0fd8ce3f9ef214": [  # 120
        ["trông", "~처럼 보이다"], ["thấy", "보다, 느끼다"], ["càng A càng B", "A할수록 B하다"], ["càng ngày càng A", "날이 갈수록 A하다"],
    ],
    "pdf-grammar-41d10342b3b10402": [  # 121
        ["~ ngay", "즉시 ~하다"],
    ],
    "pdf-grammar-27286f9e1f1c796a": [  # 122
        ["không A cũng không B", "A도 아니고 B도 아니다"], ["~ xong", "~을 마치다"],
    ],
    "pdf-grammar-9aea88abd2574c75": [  # 123
        ["không ai", "아무도 ~하지 않다"],
    ],
    "pdf-grammar-59a6b930410b7b1b": [  # 124
        ["nhé, nhỉ", "~하자, ~지요? (동의 유도)"], ["cũng được, cũng được thôi", "괜찮다, 그래도 된다"],
    ],
    "pdf-grammar-921c05195be2b8d1": [  # 125
        ["thì", "~(이)라면, ~(으)면 (강조)"],
    ],
    "pdf-grammar-3fed7ecf06129300": [  # 126
        ["tự + động từ", "스스로 ~하다"], ["làm sao mà", "어떻게 ~할 수 있겠어"],
    ],
    "pdf-grammar-dc861fc2858a1e2c": [  # 127
        ["cùng", "함께"], ["đều", "모두"], ["cho", "~하도록"],
    ],
    "pdf-grammar-d8971fb36a79ee62": [  # 128
        ["tính từ + ra / lên", "점점 더 ~해지다"], ["tính từ + đi", "점점 덜 ~해지다"],
    ],
    "pdf-grammar-af94959701782f77": [  # 129
        ["qua", "~을 통해"],
    ],
    "pdf-grammar-ef6f0fccea760112": [  # 130
        ["động từ + được / thấy / ra", "~해 내다 (결과 강조)"], ["động từ + tận", "끝까지 ~하다"],
    ],
    "pdf-grammar-65e309d236ec1661": [  # 131
        ["gọi là", "명색뿐인, 약간의"], ["càng ngày càng", "날이 갈수록"],
    ],
    "pdf-grammar-d4e3657181d34332": [  # 132
        ["dù cho", "~라 할지라도"], ["không bao giờ", "결코 ~하지 않다"],
    ],
    "pdf-grammar-f92231d9e8b7c12f": [  # 133
        ["vì ... nên", "~ 때문에 그래서"], ["mới", "막, 비로소"],
    ],
    "pdf-grammar-9e90b4ff72fa12a5": [  # 134
        ["ai cũng", "누구나"], ["là do", "~ 때문이다"],
    ],
    "pdf-grammar-c4e8fd897c4dd309": [  # 135
        ["nào là ... nào là", "~며 ~며 (열거)"], ["tin, tin rằng, tin là", "~라고 믿다"],
    ],
    "pdf-grammar-3c938958a56fba92": [  # 136
        ["rằng", "~라고"], ["không phải chỉ (là) ... mà còn (là)", "~뿐만 아니라 ~이기도 하다"],
    ],
    "pdf-grammar-f53d9eb3a9bcce79": [  # 137
        ["hóa ra", "알고 보니"], ["nghe nói", "듣자 하니"],
    ],
    "pdf-grammar-5b3f1fbcd4ef6c3e": [  # 138
        ["dăm ba, mấy, vài", "몇몇의"], ["mà", "~인데도, ~지만"],
    ],
    "pdf-grammar-ac22ac651fa4c353": [  # 139
        ["từ ... đến", "~부터 ~까지"], ["tùy, tùy thuộc", "~에 따라"],
    ],
    "pdf-grammar-efd18f785d98045d": [  # 140
        ["vì thế", "그래서"], ["thôi", "그만, 됐다"],
    ],
    "pdf-grammar-5ed4c11b7856407b": [  # 141
        ["thuộc", "~에 속하다"], ["không ai không", "~하지 않는 사람이 없다"],
    ],
    "pdf-grammar-455f3873d2e25150": [  # 142
        ["theo", "~에 따르면"], ["mỗi", "각각의"],
    ],
    "pdf-grammar-64e7239c6c4e6099": [  # 143
        ["vì sao", "왜"], ["trước khi", "~하기 전에"],
    ],
    "pdf-grammar-72829f8493d688c3": [  # 144
        ["này, kia, đó, đây, ấy", "이, 저, 그, 여기, 그 (대신하는 말)"], ["chỉ", "단지, 다만"],
    ],
    "pdf-grammar-e3ec6171ffc295ac": [  # 145
        ["không (có) ... thì không (có)", "~이 없으면 ~도 없다"], ["càng ... thì càng", "~할수록 더 ~하다"],
    ],
    "pdf-grammar-60bd8e0e1bd31b1a": [  # 146
        ["coi ... như (là)", "~처럼 여기다"], ["nào", "(문장 끝) 강조"],
    ],
    "pdf-grammar-557ecb2ff9a39786": [  # 147
        ["chừng nào ... thì", "~해야 그때 ~하다"], ["mới có thể", "~하고서야 비로소 ~할 수 있다"],
    ],
    "pdf-grammar-87d012b6230de5e5": [  # 148
        ["do", "~가 ~한"], ["không nổi", "(힘에 부쳐) ~할 수 없다"],
    ],
    "pdf-grammar-ddb22f958a24d376": [  # 149
        ["định", "~할 예정이다"], ["có (đủ) cả", "빠짐없이 다 있다"],
    ],
    "pdf-grammar-b2b587d0bf942dce": [  # 150
        ["mới chỉ", "이제 겨우"], ["sao mà", "어쩜 그렇게, 왜 (감탄)"],
    ],
    "pdf-grammar-b881ab4f774b28e9": [  # 151
        ["ngoài", "~이 넘은"], ["còn", "아직, 여전히"],
    ],
    "pdf-grammar-5222f48fd285161a": [  # 152
        ["chắc hẳn, hẳn là, chắc là", "분명히, 틀림없이"], ["cả hai", "둘 다"],
    ],
    "pdf-grammar-37fc468126f59a9f": [  # 153
        ["ai (cũng)", "누구나, 모두"], ["không chỉ là ... mà còn là", "~뿐만 아니라 ~도"],
    ],
    "pdf-grammar-a8daf1d06313c55b": [  # 154
        ["muôn vàn", "무수한"], ["với", "~에게, ~으로"],
    ],
    "pdf-grammar-223f7f2da9455129": [  # 155
        ["cơ mà", "~잖아요 (강조)"], ["ngót", "거의, 약"],
    ],
    "pdf-grammar-c2251af628bc3df3": [  # 156
        ["hàng", "매~ (매일, 매주…)"], ["nói riêng ... nói chung", "특히 ~, 전반적으로 ~"],
    ],
    "pdf-grammar-dd6c4a9a9b93e0d3": [  # 157
        ["không hề", "전혀 ~하지 않다"], ["chắc hẳn", "확실히"],
    ],
    "pdf-grammar-b954c03712df2f7d": [  # 158
        ["mà lại ... nữa chứ", "게다가 ~까지"],
    ],
    "pdf-grammar-cf670c183a0f83a4": [  # 159
        ["dành cho", "~를 위한"], ["phần nào", "어느 정도, 일부"],
    ],
    "pdf-grammar-7e611de27b330563": [  # 160
        ["xem là", "~로 여기다"], ["là một phần", "~의 일부분이다"],
    ],
    "pdf-grammar-b3476581defe9921": [  # 161
        ["này ... này", "~며 ~며 (열거)"], ["(C-V) nên", "그래서"],
    ],
    "pdf-grammar-f015999b5d86b5e3": [  # 162
        ["như", "~와 같은, ~처럼"], ["mọi", "모든"],
    ],
    "pdf-grammar-8dbfa5430f72cb88": [  # 163
        ["cách đọc phần trăm", "퍼센트 읽는 법"], ["để", "~하기 위해서"],
    ],
    "pdf-grammar-a895a68143aa9f28": [  # 164
        ["cả buổi", "내내"], ["bữa qua, bữa nay", "어제, 오늘"],
    ],
    "pdf-grammar-d86cd61575fadf02": [  # 165
        ["cảm thấy", "느끼다"], ["dám", "감히 ~하다"],
    ],
    "pdf-grammar-1be0dfe2408698d0": [  # 166
        ["vào vị trí", "~ 직책을 맡다"], ["tin", "믿다"],
    ],
    "pdf-grammar-51e60a9a28942ea7": [  # 167
        ["ngay", "즉시, 곧장"], ["vui quá mà", "~해서 (감정 강조)"],
    ],
    "pdf-grammar-fd32ff0c6ed3222c": [  # 168
        ["trái lại", "반대로"], ["đi kèm", "동반하다"], ["đã A thì phải B", "A했다면 반드시 B해야 한다"],
    ],
    "pdf-grammar-54a37e8959668976": [  # 169
        ["hơn nữa", "게다가"], ["(có) một lần", "한 번은"], ["ấy, vậy", "그것, 그렇게 (앞 내용 지칭)"],
    ],
    "pdf-grammar-21ad4f27a843bf3b": [  # 170
        ["dù ... hay", "~이든 ~이든"], ["bất kể", "~에 상관없이"], ["có lần, có buổi, có một buổi", "한 번은, 어느 날은"],
    ],
    "pdf-grammar-a491c2f2018080d7": [  # 171
        ["bao giờ cũng", "항상"], ["nhường A cho B", "A를 B에게 양보하다"], ["với nhau", "서로"],
    ],
    "pdf-grammar-5e4cc8b1c93bc981": [  # 172
        ["được + động từ", "~하게 되다 (이로운 일)"], ["nếu ... thì", "만약 ~하면"], ["từ ... đến", "~에서 ~까지"],
    ],
    "pdf-grammar-6f426440a36f3575": [  # 173
        ["tính từ + dần", "점차 ~해지다"], ["tính từ + hơn", "점점 더 ~해지다"], ["không chỉ ... mà còn", "~뿐만 아니라 ~도"],
    ],
    "pdf-grammar-4c63ccab467f29fa": [  # 174
        ["xem như", "~로 볼 수 있다"], ["vốn là", "원래 ~이다"], ["chính là", "바로 ~이다"],
    ],
    "pdf-grammar-b7c402bb47445202": [  # 175
        ["vậy mà", "그런데도"], ["phát + động từ / tính từ", "~이 나다, 드러나다"], ["mỗi ... một", "~마다 하나씩"],
    ],
    "pdf-grammar-5abaefc72fa2ba51": [  # 176
        ["thấy + động từ chỉ trạng thái", "~하게 느끼다"], ["được làm từ", "~로 만들어지다"], ["đã từng (là)", "~한 적이 있다"],
    ],
    "pdf-grammar-ea0fccbc5343cfee": [  # 177
        ["không xem là ... mà là ...", "~가 아니라 ~로 여기다"], ["ngoài A còn (có) B", "A 외에 B도"], ["người ta", "사람들"],
    ],
    "pdf-grammar-992cc282c7dd4f99": [  # 178
        ["từng", "하나씩, 각각"], ["tuyệt đối không, không bao giờ", "절대 ~하지 않다"], ["để", "~하기 위해서"],
    ],
    "pdf-grammar-a66773d17713045e": [  # 179
        ["đủ cả", "모두 갖춘"], ["A là có B", "A이면 B라 할 수 있다"], ["sau (khi)", "~한 후에"],
    ],
    "pdf-grammar-93a4d13d638f6ca0": [  # 180
        ["như, như là", "~처럼"], ["sao mà ... thế", "어쩜 이렇게 ~한지"], ["(ở đâu) có A là (ở đó) có B", "A가 있는 곳엔 B가 있다"],
    ],
    "pdf-grammar-191b1175da0820e3": [  # 181
        ["có + (C-V)", "~이 있다 (존재 강조)"], ["từ bao giờ, từ khi nào", "언제부터"], ["ngay cả", "~조차, ~까지"],
    ],
    "pdf-grammar-48e5ef3f703c32e7": [  # 182
        ["khoảng", "약, 대략"], ["từ những ... cho phép", "~에 근거하면 ~할 수 있다"], ["chỉ biết rằng", "아는 것은 ~뿐이다"],
    ],
    "pdf-grammar-dcaf4f697ed15fb3": [  # 183
        ["mới A (mà) đã B", "겨우 A인데 벌써 B하다"], ["cho nên", "그래서"], ["ai cũng + động từ", "누구나 ~하다"],
    ],
    "pdf-grammar-aa277c1e9fd50caa": [  # 184
        ["chính là", "바로 ~이다"], ["hơn bao giờ hết", "어느 때보다 더"], ["cùng (nhau) + động từ", "함께 ~하다"], ["mang (đem) ... tới (đến) ...", "~을 ~로 가져가다"],
    ],
    "pdf-grammar-14ac9e2144d0d8b5": [  # 185
        ["còn gì", "~잖아"], ["sao mà + tính từ", "어찌나 ~한지"], ["~ cũng nên", "아마 ~일지도 모른다"], ["động từ + mất", "~해 버리다"],
    ],
    "pdf-grammar-737da42fe4ac72e3": [  # 186
        ["đâu đâu", "곳곳에"], ["nơi", "~하는 곳"], ["khi, lúc + (C-V)", "~할 때"],
    ],
    "pdf-grammar-e0880ccd76d16c7c": [  # 187
        ["chỉ ... mà không ...", "~만 하고 ~하지 못하다"], ["người bắc kẻ nam", "뿔뿔이 흩어져"], ["động từ + đâu", "어디로 ~하든"], ["chẳng có nơi nào như", "~ 같은 곳은 어디에도 없다"],
    ],
    "pdf-grammar-be3f9f7192059fbf": [  # 188
        ["bằng", "~으로, ~을 타고"], ["mỗi khi", "~할 때마다"], ["cũng là, cũng chính là", "~이기도 하다"],
    ],
    "pdf-grammar-d8e7131457228c60": [  # 189
        ["gắn liền, gắn với, gắn liền với", "~와 밀접하게 이어지다"], ["gọi ... là", "~을 ~라고 부르다"], ["vì thế", "그래서"],
    ],
    "pdf-grammar-8ed322294bbe6dd7": [  # 190
        ["thuộc, thuộc về", "~에 속하다"], ["tính từ, động từ + gì", "~하기는 무슨 (부정)"], ["khiến", "~하게 만들다"], ["chính ... là", "바로 ~가 ~이다"],
    ],
    "pdf-grammar-332ea38723f2535a": [  # 191
        ["nào mà chẳng + động từ, tính từ", "~하지 않는 ~가 어디 있나"], ["động từ + được", "~할 수 있다"], ["động từ, tính từ + sao được", "어떻게 ~할 수 있겠나"], ["động từ, tính từ + là chính", "주로 ~하다"],
    ],
    "pdf-grammar-ac736eaf898e9c06": [  # 192
        ["có thể nói", "~라고 할 수 있다"], ["từ ... cho đến", "~부터 ~까지"], ["với + (C-V)", "~으로, ~ 덕분에"],
    ],
    "pdf-grammar-ab2efd956a848023": [  # 193
        ["giúp", "~가 ~하도록 돕다"], ["qua + (C-V)", "~을 통해"], ["nhận ra rằng + (C-V)", "~임을 깨닫다"],
    ],
    "pdf-grammar-ee518cd96eccf23f": [  # 194
        ["cho thấy", "~을 보여 주다"], ["có khi", "어쩌면"], ["kể cả", "~까지 포함하여"], ["chưa hẳn", "꼭 ~인 것은 아니다"],
    ],
    "pdf-grammar-0c1cd51bcc5aa321": [  # 195
        ["trước kia", "예전에"], ["theo + (C-V)", "~에 따르면"], ["đòi", "~을 요구하다"], ["cho", "~에게 주다"],
    ],
    "pdf-grammar-e51b78e8b091e5d9": [  # 196
        ["với, cùng với", "~와 함께, ~으로"], ["gần như", "거의"], ["bởi", "~ 때문에"], ["phổ biến nhất", "가장 흔한"],
    ],
    "pdf-grammar-c9a698105e95cb2a": [  # 197
        ["lắm + danh từ", "많은 ~"], ["làm gì mà", "뭘 그렇게 ~ (반문)"], ["nhẵn túi", "빈털터리"], ["nói gì thì nói", "어쨌든"],
    ],
    "pdf-grammar-475996212a7c04f7": [  # 198
        ["vẫn", "여전히"], ["có lẽ vì thế", "아마 그래서"], ["chẳng có lấy", "하나도 없다"], ["vinh danh là", "~로 영예를 얻다"],
    ],
    "pdf-grammar-528eccf07ef879a6": [  # 199
        ["ngay", "바로 (강조)"], ["hàng trăm hàng nghìn", "수백 수천의"], ["vào, về + (C-V)", "~ 때에"],
    ],
    "pdf-grammar-d3809f353345b484": [  # 200
        ["bao nhiêu năm", "수많은 해"], ["vì ... nên", "~ 때문에 그래서"], ["dù ... nhưng", "비록 ~지만"], ["động từ + (C-V)", "보조 동사 + 주어 · 서술어"],
    ],
    "pdf-grammar-674f6e030e2b14b6": [  # 201
        ["như ... đã (đều) biết", "~가 (다) 알다시피"], ["phải có", "반드시 ~이 있어야 한다"], ["sao cho", "~하도록"], ["về", "~에 관해서"],
    ],
    "pdf-grammar-9b331c267db2362b": [  # 202
        ["cho", "~에게, ~을 위해"], ["đứng đầu", "1위를 차지하다"], ["số từ + tính từ, động từ", "숫자 + ~ (구호 표현)"],
    ],
    "pdf-grammar-06b1362c226a55a5": [  # 203
        ["dạo này", "요즘"], ["thì sao", "~은 어때?"], ["nghe người ta nói", "사람들 말로는"], ["quả là", "과연, 정말"],
    ],
    "pdf-grammar-fe15689521673e22": [  # 204
        ["nhằm", "~을 목적으로"], ["dù ... nhưng", "비록 ~지만"], ["động từ + vào", "~에 (동작의 대상)"], ["không phải lúc nào cũng", "항상 ~인 것은 아니다"],
    ],
    "pdf-grammar-3fcf8ff4579a8eab": [  # 205
        ["tự mình, tự ... mình", "스스로"], ["duy nhất", "유일한"], ["bộ phận giải thích", "설명 부분 (삽입구)"],
    ],
    "pdf-grammar-229c2dccf5401a69": [  # 206
        ["nhiều ... nhất", "가장 많이"], ["tính từ 1 + nhưng + tính từ 2", "~하지만 ~하다 (반대 형용사)"], ["không chỉ là ... mà còn là", "~뿐만 아니라 ~도"],
    ],
    "pdf-grammar-41d6470b697f7dd9": [  # 207
        ["tính từ tuyệt đối", "절대 형용사"], ["tính từ + (C-V)", "문장 앞 형용사"], ["toàn + danh từ", "온통, 전부"],
    ],
    "pdf-grammar-d0a5fcf6bf0b09a0": [  # 208
        ["mỗi khi ... thì", "~할 때마다"], ["có khi ... (cũng) có khi", "어떤 때는 ~, 어떤 때는 ~"], ["(C-V) + vì", "~는 ~ 때문이다"],
    ],
    "pdf-grammar-4353bfc953ed5661": [  # 209
        ["mới nói", "그래서 ~라고 하는 것이다"], ["nào là", "~며 ~며 (열거)"], ["thế này nữa chứ", "또 이런 것도"], ["chỉ ... mà", "~할 뿐인데"],
    ],
}

_CONTROLS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def _norm(line):
    return re.sub(r"\s+", " ", line).strip()


def shown_lines(original, joins):
    """The record's lines as the page shows them before any edit (app_logic.js cleanPdfLines/joinWrappedLines)."""
    lines = _CONTROLS.sub("", original or "").replace("\r\n", "\n").replace("\r", "\n").split("\n")
    join_at = {j[0]: j[1] for j in (joins or [])}
    out = []
    for i, line in enumerate(lines):
        if i > 0 and (i - 1) in join_at and out:
            out[-1] = out[-1].rstrip() + join_at[i - 1] + line.strip()
        else:
            out.append(line)
    return [_norm(l) for l in out if l.strip()]


def check_general_pdf_edits(grammar_records, joins):
    by_id = {rec["id"]: rec for rec in grammar_records}
    for rid, edits in GENERAL_PDF_GRAMMAR_EDITS.items():
        assert rid in by_id, "general_pdf_edits: unknown grammar record " + rid
        lines = shown_lines(by_id[rid].get("original"), joins.get(rid))
        for old, _new in edits:
            assert _norm(old) in lines, "general_pdf_edits: %s no longer shows the line %r" % (rid, old)
    return GENERAL_PDF_GRAMMAR_EDITS


def check_general_pdf_titles(grammar_records):
    ids = {rec["id"] for rec in grammar_records}
    for rid, parts in GENERAL_PDF_GRAMMAR_TITLES.items():
        assert rid in ids, "general_pdf_edits: unknown grammar record " + rid
        assert parts and all(len(p) == 2 and (p[0] or p[1]) for p in parts), rid
    return GENERAL_PDF_GRAMMAR_TITLES
