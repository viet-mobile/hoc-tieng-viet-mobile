# New "성경·숫자" tab: (1) the 66 Bible book names, Vietnamese New World Translation
# ("Kinh Thanh - Ban dich Thế Giới Mới") alongside the standard Korean New World
# Translation names, for listening/repeating practice, and (2) Vietnamese number-reading
# practice from 1-100, the major round numbers from 1,000 to 1 billion, and 144,000
# (Revelation 7:4, a number of particular interest to this study group).
#
# "kr" (book names) and "note" (number-reading notes) are stored as {"ko","zh","en","ja"}
# dicts so js_json() (see build_app.py) serializes them straight into JS objects
# app_logic.js's T() helper can read directly. Book names use the STANDARD/OFFICIAL Bible
# book name in each language (matching New World Translation naming where known), not a
# literal translation of the Korean. "reading" (the Vietnamese number word) is never
# translated.

BIBLE_BOOKS_OT = [{'vi': 'Sáng thế', 'kr': {'ko': '창세기', 'zh': '創世記', 'en': 'Genesis', 'ja': '創世記'}},
 {'vi': 'Xuất Ai Cập', 'kr': {'ko': '출애굽기', 'zh': '出埃及記', 'en': 'Exodus', 'ja': '出エジプト記'}},
 {'vi': 'Lê-vi', 'kr': {'ko': '레위기', 'zh': '利未記', 'en': 'Leviticus', 'ja': 'レビ記'}},
 {'vi': 'Dân số', 'kr': {'ko': '민수기', 'zh': '民數記', 'en': 'Numbers', 'ja': '民数記'}},
 {'vi': 'Phục truyền luật lệ', 'kr': {'ko': '신명기', 'zh': '申命記', 'en': 'Deuteronomy', 'ja': '申命記'}},
 {'vi': 'Giô-suê', 'kr': {'ko': '여호수아', 'zh': '約書亞記', 'en': 'Joshua', 'ja': 'ヨシュア記'}},
 {'vi': 'Các Quan Xét', 'kr': {'ko': '사사기', 'zh': '士師記', 'en': 'Judges', 'ja': '裁き人'}},
 {'vi': 'Ru-tơ', 'kr': {'ko': '룻기', 'zh': '路得記', 'en': 'Ruth', 'ja': 'ルツ記'}},
 {'vi': '1 Sa-mu-ên', 'kr': {'ko': '사무엘 상', 'zh': '撒母耳記上', 'en': '1 Samuel', 'ja': 'サムエル第一'}},
 {'vi': '2 Sa-mu-ên', 'kr': {'ko': '사무엘 하', 'zh': '撒母耳記下', 'en': '2 Samuel', 'ja': 'サムエル第二'}},
 {'vi': '1 Các Vua', 'kr': {'ko': '열왕기 상', 'zh': '列王紀上', 'en': '1 Kings', 'ja': '列王第一'}},
 {'vi': '2 Các Vua', 'kr': {'ko': '열왕기 하', 'zh': '列王紀下', 'en': '2 Kings', 'ja': '列王第二'}},
 {'vi': '1 Sử ký', 'kr': {'ko': '역대 상', 'zh': '歷代志上', 'en': '1 Chronicles', 'ja': '歴代第一'}},
 {'vi': '2 Sử ký', 'kr': {'ko': '역대 하', 'zh': '歷代志下', 'en': '2 Chronicles', 'ja': '歴代第二'}},
 {'vi': 'Ê-xơ-ra', 'kr': {'ko': '에스라', 'zh': '以斯拉記', 'en': 'Ezra', 'ja': 'エズラ'}},
 {'vi': 'Nê-hê-mi', 'kr': {'ko': '느헤미야', 'zh': '尼希米記', 'en': 'Nehemiah', 'ja': 'ネヘミヤ'}},
 {'vi': 'Ê-xơ-tê', 'kr': {'ko': '에스더', 'zh': '以斯帖記', 'en': 'Esther', 'ja': 'エステル'}},
 {'vi': 'Gióp', 'kr': {'ko': '욥기', 'zh': '約伯記', 'en': 'Job', 'ja': 'ヨブ記'}},
 {'vi': 'Thi thiên', 'kr': {'ko': '시편', 'zh': '詩篇', 'en': 'Psalms', 'ja': '詩編'}},
 {'vi': 'Châm ngôn', 'kr': {'ko': '잠언', 'zh': '箴言', 'en': 'Proverbs', 'ja': '箴言'}},
 {'vi': 'Truyền đạo', 'kr': {'ko': '전도서', 'zh': '傳道書', 'en': 'Ecclesiastes', 'ja': '伝道の書'}},
 {'vi': 'Nhã ca', 'kr': {'ko': '아가', 'zh': '雅歌', 'en': 'Song of Solomon', 'ja': '雅歌'}},
 {'vi': 'Ê-sai', 'kr': {'ko': '이사야', 'zh': '以賽亞書', 'en': 'Isaiah', 'ja': 'イザヤ'}},
 {'vi': 'Giê-rê-mi', 'kr': {'ko': '예레미야', 'zh': '耶利米書', 'en': 'Jeremiah', 'ja': 'エレミヤ'}},
 {'vi': 'Ai ca', 'kr': {'ko': '예레미야 애가', 'zh': '耶利米哀歌', 'en': 'Lamentations', 'ja': '哀歌'}},
 {'vi': 'Ê-xê-chi-ên', 'kr': {'ko': '에스겔', 'zh': '以西結書', 'en': 'Ezekiel', 'ja': 'エゼキエル'}},
 {'vi': 'Đa-ni-ên', 'kr': {'ko': '다니엘', 'zh': '但以理書', 'en': 'Daniel', 'ja': 'ダニエル'}},
 {'vi': 'Ô-sê', 'kr': {'ko': '호세아', 'zh': '何西阿書', 'en': 'Hosea', 'ja': 'ホセア'}},
 {'vi': 'Giô-ên', 'kr': {'ko': '요엘', 'zh': '約珥書', 'en': 'Joel', 'ja': 'ヨエル'}},
 {'vi': 'A-mốt', 'kr': {'ko': '아모스', 'zh': '阿摩司書', 'en': 'Amos', 'ja': 'アモス'}},
 {'vi': 'Áp-đia', 'kr': {'ko': '오바댜', 'zh': '俄巴底亞書', 'en': 'Obadiah', 'ja': 'オバデヤ'}},
 {'vi': 'Giô-na', 'kr': {'ko': '요나', 'zh': '約拿書', 'en': 'Jonah', 'ja': 'ヨナ'}},
 {'vi': 'Mi-chê', 'kr': {'ko': '미가', 'zh': '彌迦書', 'en': 'Micah', 'ja': 'ミカ'}},
 {'vi': 'Na-hum', 'kr': {'ko': '나훔', 'zh': '那鴻書', 'en': 'Nahum', 'ja': 'ナホム'}},
 {'vi': 'Ha-ba-cúc', 'kr': {'ko': '하박국', 'zh': '哈巴谷書', 'en': 'Habakkuk', 'ja': 'ハバクク'}},
 {'vi': 'Xô-phô-ni', 'kr': {'ko': '스바냐', 'zh': '西番雅書', 'en': 'Zephaniah', 'ja': 'ゼパニヤ'}},
 {'vi': 'A-ghê', 'kr': {'ko': '학개', 'zh': '哈該書', 'en': 'Haggai', 'ja': 'ハガイ'}},
 {'vi': 'Xa-cha-ri', 'kr': {'ko': '스가랴', 'zh': '撒迦利亞書', 'en': 'Zechariah', 'ja': 'ゼカリヤ'}},
 {'vi': 'Ma-la-chi', 'kr': {'ko': '말라기', 'zh': '瑪拉基書', 'en': 'Malachi', 'ja': 'マラキ'}}]

BIBLE_BOOKS_NT = [{'vi': 'Ma-thi-ơ', 'kr': {'ko': '마태복음', 'zh': '馬太福音', 'en': 'Matthew', 'ja': 'マタイ'}},
 {'vi': 'Mác', 'kr': {'ko': '마가복음', 'zh': '馬可福音', 'en': 'Mark', 'ja': 'マルコ'}},
 {'vi': 'Lu-ca', 'kr': {'ko': '누가복음', 'zh': '路加福音', 'en': 'Luke', 'ja': 'ルカ'}},
 {'vi': 'Giăng', 'kr': {'ko': '요한복음', 'zh': '約翰福音', 'en': 'John', 'ja': 'ヨハネ'}},
 {'vi': 'Công vụ', 'kr': {'ko': '사도행전', 'zh': '使徒行傳', 'en': 'Acts', 'ja': '使徒たちの活動'}},
 {'vi': 'Rô-ma', 'kr': {'ko': '로마서', 'zh': '羅馬書', 'en': 'Romans', 'ja': 'ローマ'}},
 {'vi': '1 Cô-rinh-tô', 'kr': {'ko': '고린도 전서', 'zh': '哥林多前書', 'en': '1 Corinthians', 'ja': 'コリント第一'}},
 {'vi': '2 Cô-rinh-tô', 'kr': {'ko': '고린도 후서', 'zh': '哥林多後書', 'en': '2 Corinthians', 'ja': 'コリント第二'}},
 {'vi': 'Ga-la-ti', 'kr': {'ko': '갈라디아서', 'zh': '加拉太書', 'en': 'Galatians', 'ja': 'ガラテア'}},
 {'vi': 'Ê-phê-sô', 'kr': {'ko': '에베소서', 'zh': '以弗所書', 'en': 'Ephesians', 'ja': 'エフェソス'}},
 {'vi': 'Phi-líp', 'kr': {'ko': '빌립보서', 'zh': '腓立比書', 'en': 'Philippians', 'ja': 'フィリピ'}},
 {'vi': 'Cô-lô-se', 'kr': {'ko': '골로새서', 'zh': '歌羅西書', 'en': 'Colossians', 'ja': 'コロサイ'}},
 {'vi': '1 Tê-sa-lô-ni-ca',
  'kr': {'ko': '데살로니가 전서', 'zh': '帖撒羅尼迦前書', 'en': '1 Thessalonians', 'ja': 'テサロニケ第一'}},
 {'vi': '2 Tê-sa-lô-ni-ca',
  'kr': {'ko': '데살로니가 후서', 'zh': '帖撒羅尼迦後書', 'en': '2 Thessalonians', 'ja': 'テサロニケ第二'}},
 {'vi': '1 Ti-mô-thê', 'kr': {'ko': '디모데 전서', 'zh': '提摩太前書', 'en': '1 Timothy', 'ja': 'テモテ第一'}},
 {'vi': '2 Ti-mô-thê', 'kr': {'ko': '디모데 후서', 'zh': '提摩太後書', 'en': '2 Timothy', 'ja': 'テモテ第二'}},
 {'vi': 'Tít', 'kr': {'ko': '디도서', 'zh': '提多書', 'en': 'Titus', 'ja': 'テトス'}},
 {'vi': 'Phi-lê-môn', 'kr': {'ko': '빌레몬서', 'zh': '腓利門書', 'en': 'Philemon', 'ja': 'フィレモン'}},
 {'vi': 'Hê-bơ-rơ', 'kr': {'ko': '히브리서', 'zh': '希伯來書', 'en': 'Hebrews', 'ja': 'ヘブライ'}},
 {'vi': 'Gia-cơ', 'kr': {'ko': '야고보서', 'zh': '雅各書', 'en': 'James', 'ja': 'ヤコブ'}},
 {'vi': '1 Phi-e-rơ', 'kr': {'ko': '베드로 전서', 'zh': '彼得前書', 'en': '1 Peter', 'ja': 'ペテロ第一'}},
 {'vi': '2 Phi-e-rơ', 'kr': {'ko': '베드로 후서', 'zh': '彼得後書', 'en': '2 Peter', 'ja': 'ペテロ第二'}},
 {'vi': '1 Giăng', 'kr': {'ko': '요한 1서', 'zh': '約翰一書', 'en': '1 John', 'ja': 'ヨハネ第一'}},
 {'vi': '2 Giăng', 'kr': {'ko': '요한 2서', 'zh': '約翰二書', 'en': '2 John', 'ja': 'ヨハネ第二'}},
 {'vi': '3 Giăng', 'kr': {'ko': '요한 3서', 'zh': '約翰三書', 'en': '3 John', 'ja': 'ヨハネ第三'}},
 {'vi': 'Giu-đe', 'kr': {'ko': '유다서', 'zh': '猶大書', 'en': 'Jude', 'ja': 'ユダ'}},
 {'vi': 'Khải huyền', 'kr': {'ko': '요한계시록', 'zh': '啟示錄', 'en': 'Revelation', 'ja': '啓示'}}]

NUMBERS_BASIC = [{'num': 0, 'reading': 'không', 'note': None},
 {'num': 1, 'reading': 'một', 'note': None},
 {'num': 2, 'reading': 'hai', 'note': None},
 {'num': 3, 'reading': 'ba', 'note': None},
 {'num': 4, 'reading': 'bốn', 'note': None},
 {'num': 5, 'reading': 'năm', 'note': None},
 {'num': 6, 'reading': 'sáu', 'note': None},
 {'num': 7, 'reading': 'bảy', 'note': None},
 {'num': 8, 'reading': 'tám', 'note': None},
 {'num': 9, 'reading': 'chín', 'note': None},
 {'num': 10, 'reading': 'mười', 'note': None}]

NUMBERS_TEEN = [{'num': 11, 'reading': 'mười một', 'note': None},
 {'num': 12, 'reading': 'mười hai', 'note': None},
 {'num': 13, 'reading': 'mười ba', 'note': None},
 {'num': 14, 'reading': 'mười bốn', 'note': None},
 {'num': 15,
  'reading': 'mười lăm',
  'note': {'ko': '10(mười)+5 결합에서만 năm이 아니라 lăm으로 바뀌어요.',
           'zh': '只有在 10（mười）+ 5 結合時，năm 才會變成 lăm。',
           'en': 'Only in the combination 10 (mười) + 5 does năm change to lăm.',
           'ja': '10（mười）+5 の結合のときだけ、năm ではなく lăm に変わります。'}},
 {'num': 16, 'reading': 'mười sáu', 'note': None},
 {'num': 17, 'reading': 'mười bảy', 'note': None},
 {'num': 18, 'reading': 'mười tám', 'note': None},
 {'num': 19, 'reading': 'mười chín', 'note': None}]

NUMBERS_TENS = [{'num': 20, 'reading': 'hai mươi', 'note': None},
 {'num': 21, 'reading': 'hai mươi mốt', 'note': None},
 {'num': 24, 'reading': 'hai mươi tư', 'note': None},
 {'num': 25, 'reading': 'hai mươi lăm', 'note': None},
 {'num': 30, 'reading': 'ba mươi', 'note': None},
 {'num': 31, 'reading': 'ba mươi mốt', 'note': None},
 {'num': 34, 'reading': 'ba mươi tư', 'note': None},
 {'num': 35, 'reading': 'ba mươi lăm', 'note': None},
 {'num': 40, 'reading': 'bốn mươi', 'note': None},
 {'num': 41, 'reading': 'bốn mươi mốt', 'note': None},
 {'num': 44, 'reading': 'bốn mươi tư', 'note': None},
 {'num': 45, 'reading': 'bốn mươi lăm', 'note': None},
 {'num': 50, 'reading': 'năm mươi', 'note': None},
 {'num': 51, 'reading': 'năm mươi mốt', 'note': None},
 {'num': 54, 'reading': 'năm mươi tư', 'note': None},
 {'num': 55, 'reading': 'năm mươi lăm', 'note': None},
 {'num': 60, 'reading': 'sáu mươi', 'note': None},
 {'num': 61, 'reading': 'sáu mươi mốt', 'note': None},
 {'num': 64, 'reading': 'sáu mươi tư', 'note': None},
 {'num': 65, 'reading': 'sáu mươi lăm', 'note': None},
 {'num': 70, 'reading': 'bảy mươi', 'note': None},
 {'num': 71, 'reading': 'bảy mươi mốt', 'note': None},
 {'num': 74, 'reading': 'bảy mươi tư', 'note': None},
 {'num': 75, 'reading': 'bảy mươi lăm', 'note': None},
 {'num': 80, 'reading': 'tám mươi', 'note': None},
 {'num': 81, 'reading': 'tám mươi mốt', 'note': None},
 {'num': 84, 'reading': 'tám mươi tư', 'note': None},
 {'num': 85, 'reading': 'tám mươi lăm', 'note': None},
 {'num': 90, 'reading': 'chín mươi', 'note': None},
 {'num': 91, 'reading': 'chín mươi mốt', 'note': None},
 {'num': 94, 'reading': 'chín mươi tư', 'note': None},
 {'num': 95, 'reading': 'chín mươi lăm', 'note': None},
 {'num': 99, 'reading': 'chín mươi chín', 'note': None},
 {'num': 100, 'reading': 'một trăm', 'note': None}]

NUMBERS_TENS_NOTE = {'ko': '10을 뜻하는 mười는 20부터 90까지(hai mươi, ba mươi...)는 성조가 없는 mươi로 형태가 바뀌어요. (10 자체만 mười를 그대로 씁니다.) 그리고 이 '
       'mươi 뒤에 1, 4, 5가 붙으면 một→mốt, bốn→tư, năm→lăm으로 다시 형태가 바뀌어요. (11~19는 예외로, mười 뒤에서는 5만 lăm으로 바뀌고 1과 '
       '4는 그대로예요.)',
 'zh': '表示10的 mười，在20到90（hai mươi、ba mươi……）中會變成沒有聲調的 mươi。（只有10本身仍用 mười。）而且在這個 mươi 後面接1、4、5時，又會變成 một→mốt、bốn→tư、năm→lăm。（11~19是例外，在 mười 後面只有5會變成 lăm，1和4保持不變。）',
 'en': 'mười, meaning 10, changes to the tone-less form mươi in 20 through 90 (hai mươi, ba mươi...). (Only '
       '10 itself keeps mười as is.) And when 1, 4, or 5 follows this mươi, they change again: một→mốt, '
       'bốn→tư, năm→lăm. (11-19 are an exception: after mười, only 5 changes to lăm, while 1 and 4 stay the '
       'same.)',
 'ja': '10を意味する mười は、20から90まで（hai mươi、ba mươi…）では声調のない mươi という形に変わります。（10自体だけは mười のまま使います。）そして、この mươi '
       'の後に1、4、5が付くと、một→mốt、bốn→tư、năm→lăm と再び形が変わります。（11~19は例外で、mười の後では5だけが lăm に変わり、1と4はそのままです。）'}

NUMBERS_HUNDREDS = [{'num': 200, 'reading': 'hai trăm', 'note': None},
 {'num': 300, 'reading': 'ba trăm', 'note': None},
 {'num': 400, 'reading': 'bốn trăm', 'note': None},
 {'num': 500, 'reading': 'năm trăm', 'note': None},
 {'num': 600, 'reading': 'sáu trăm', 'note': None},
 {'num': 700, 'reading': 'bảy trăm', 'note': None},
 {'num': 800, 'reading': 'tám trăm', 'note': None},
 {'num': 900, 'reading': 'chín trăm', 'note': None}]

NUMBERS_LARGE = [{'num': 1000,
  'reading': 'một ngàn',
  'note': {'ko': "북부에서는 ngàn 대신 nghìn을 써서 'một nghìn'이라고 해요. 하지만 베트남어 신세계역 성경과 우리 출판물 녹음에서는 모두 ngàn을 사용해요.",
           'zh': '在越南北部，人們用 nghìn 代替 ngàn，說成「một nghìn」。不過，越南語《新世界譯本》聖經和我們出版物的錄音都使用 ngàn。',
           'en': 'In the North, "nghìn" is used instead of "ngàn," as in "một nghìn." However, both the '
                 'Vietnamese New World Translation of the Bible and our publication recordings use "ngàn."',
           'ja': '北部では ngàn の代わりに nghìn を使い、「một nghìn」と言います。しかし、ベトナム語の新世界訳聖書や当協会出版物の録音では、いずれも ngàn '
                 'が使われています。'}},
 {'num': 10000, 'reading': 'mười ngàn', 'note': None},
 {'num': 100000, 'reading': 'một trăm ngàn', 'note': None},
 {'num': 144000,
  'reading': 'một trăm bốn mươi bốn ngàn',
  'note': {'ko': '144(một trăm bốn mươi bốn) + ngàn(천)을 그대로 이어 읽으면 돼요. 계시록 7:4, 14:1, 3에 나오는 숫자예요.',
           'zh': '144（một trăm bốn mươi bốn）+ ngàn（千）直接連讀即可。這是啟示錄7:4、14:1、3中出現的數字。',
           'en': 'Just read 144 (một trăm bốn mươi bốn) + ngàn (thousand) straight through. This is the '
                 'number that appears in Revelation 7:4 and 14:1, 3.',
           'ja': '144（một trăm bốn mươi bốn）+ ngàn（千）をそのまま続けて読めば大丈夫です。啓示7:4、14:1、3に出てくる数字です。'}},
 {'num': 1000000, 'reading': 'một triệu', 'note': None},
 {'num': 10000000, 'reading': 'mười triệu', 'note': None},
 {'num': 100000000, 'reading': 'một trăm triệu', 'note': None},
 {'num': 1000000000, 'reading': 'một tỷ', 'note': None}]

NUMBERS_SPECIAL = []

# 베트남어 숫자 표기법: 1,000의 자리는 쉼표(,)가 아니라 마침표(.)로, 소수점은 오히려 쉼표(,)로
# 표기한다 -- 한국어·영어와 정반대. (이 표에서 수치를 100,000처럼 쉼표로 표시하는 것은 이 학습
# 앱이 한국어 화자를 위해 쓰는 표기일 뿐, 베트남어 자체의 표기 관례는 아니다.)
NUMBER_FORMAT_NOTE = {
    'ko': '베트남어에서는 숫자를 표기할 때 1,000의 자리마다 쉼표(,)가 아니라 마침표(.)를 찍어요. 반대로 '
          '소수점에는 쉼표(,)를 사용해요 — 한국어·영어와 정반대예요. 예를 들어 백만은 한국어로 '
          '1,000,000이라고 쓰지만 베트남어로는 1.000.000이라고 써요. (이 앱의 표에서 100,000처럼 '
          '쉼표로 보여 주는 것은 한국어 화자를 위한 표기이고, 실제 베트남어 표기와는 달라요.) 아래는 '
          '소수점이 있는 숫자를 읽는 예시예요.',
    'zh': '越南語書寫數字時，每隔千位使用句點(.)而不是逗號(,)來分隔，小數點則相反地使用逗號(,)——正好與'
          '韓文、英文相反。例如一百萬在韓文寫作1,000,000，但在越南語中寫作1.000.000。（這個表格中用'
          '100,000這種逗號來顯示，只是為了方便韓語使用者，並非越南語本身的書寫方式。）以下是帶有小數點的'
          '數字讀法範例。',
    'en': 'In Vietnamese writing, a period (.) — not a comma (,) — marks every thousands place, while a '
          'comma (,) is used for the decimal point instead — the exact opposite of Korean and English. For '
          'example, one million is written 1,000,000 in Korean but 1.000.000 in Vietnamese. (Numbers shown '
          'with commas like 100,000 in this app\'s tables are formatted for Korean-speaking readers, not '
          'the actual Vietnamese convention.) Below is an example of reading a number with a decimal point.',
    'ja': 'ベトナム語で数字を書くときは、1,000の位ごとにコンマ(,)ではなくピリオド(.)を打ちます。逆に'
          '小数点にはコンマ(,)を使います — 韓国語・英語とはちょうど反対です。例えば百万は韓国語で'
          '1,000,000と書きますが、ベトナム語では1.000.000と書きます。（この表で100,000のようにコンマで'
          '表示しているのは韓国語話者向けの表記であり、実際のベトナム語の表記とは異なります。）以下は'
          '小数点のある数字の読み方の例です。'
}

# 원주율(π) 3,14 -- 베트남어 표기(쉼표)를 그대로 보여주고, 쉼표는 phẩy(퍼이)라고 읽는다.
NUMBER_DECIMAL_EXAMPLE = {
    'display': '3,14',
    'reading': 'ba phẩy mười bốn',
    'label': {'ko': '원주율(π)', 'zh': '圓周率(π)', 'en': 'pi (π)', 'ja': '円周率(π)'},
    'note': {
        'ko': '쉼표(,)는 phẩy라고 읽어요. 소수점 뒤 두 자리는 하나의 숫자처럼 이어서 읽어요 (mười bốn = '
              '14, 일의 자리씩 따로 읽지 않아요).',
        'zh': '逗號(,)讀作phẩy。小數點後的兩位數會像一個完整的數字一樣連著唸(mười bốn = 14，不會一個位數'
              '一個位數分開唸)。',
        'en': 'The comma (,) is read as phẩy. The two digits after it are read together as a single number '
              '(mười bốn = 14), not digit by digit.',
        'ja': 'コンマ(,)はphẩyと読みます。小数点以下の2桁はmười bốn(=14)のように1つの数としてまとめて'
              '読み、1桁ずつ個別には読みません。'
    }
}
