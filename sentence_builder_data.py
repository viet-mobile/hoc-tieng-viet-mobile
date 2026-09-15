# "문장 생성기" (Sentence Builder) data for the 문법·작문 탭.
#
# Word banks the learner can mix and match to generate a Vietnamese sentence in correct
# Vietnamese word order, together with a word-by-word gloss and an auto-composed natural
# sentence translation -- one target-language engine per UI language (ko/zh/en/ja), all
# implemented in app_logic.js. Every optional category includes an implicit "사용 안 함" (not
# used) choice in the UI, so the generator covers both filled-in and omitted combinations.
#
# ---- Data shape ----
# "kr" fields below are {"ko","zh","en","ja"} dicts (base dictionary-form meaning only, no
# conjugation) so T() can pull the word-by-word gloss straight out of them in any UI language.
# Fields that feed a MECHANICAL CONJUGATION ENGINE are language-specific and hand-curated
# (never derived at runtime), same philosophy as the original Korean-only version: several verb/
# adjective forms are irregular and safest to just write correctly by hand.
#   - Korean engine:  stem/past (verbs), attr/past/rieul (adjectives)      -- unchanged from before
#   - English engine: en_3sg/en_past/en_ing (verbs)                       -- no adjective conjugation needed
#   - Japanese engine: ja_masu/ja_te/ja_nai (verbs), ja_type ('i'/'na')/ja_attr/ja_neg_stem (adjectives)
#   - Chinese engine: no conjugation at all (Chinese verbs/adjectives don't inflect) -- the "zh"
#     meaning alone is enough; tense/aspect/negation are expressed with invariant particles
#     (了/正在/要/不/沒 etc.) chosen by the engine itself, not stored per-word.
#
# Pronouns/noun-subjects also carry "person" (1/2/3) and "number" ("sg"/"pl") -- needed for
# English subject-verb agreement (3rd-person-singular -s) and, more loosely, for picking natural
# Japanese/Chinese subject wording. Verbs/adjectives carry no such marking; Vietnamese doesn't
# conjugate for person/number and none of the four target languages need person agreement beyond
# English's.

def kdict(ko, zh, en, ja):
    return {"ko": ko, "zh": zh, "en": en, "ja": ja}

def w(vi, ko, zh, en, ja):
    return {"vi": vi, "kr": kdict(ko, zh, en, ja)}

SB_PRONOUNS = [
    dict(w("tôi", "나", "我", "I", "私"), person=1, number="sg"),
    dict(w("bạn", "너", "你", "you", "あなた"), person=2, number="sg"),
    dict(w("anh ấy", "그 남자", "他", "he", "彼"), person=3, number="sg"),
    dict(w("chị ấy", "그 여자", "她", "she", "彼女"), person=3, number="sg"),
    dict(w("chúng tôi", "우리들", "我們", "we", "私たち"), person=1, number="pl"),
    dict(w("chúng ta", "우리", "我們", "we", "私たち"), person=1, number="pl"),
    dict(w("họ", "그들", "他們", "they", "彼ら"), person=3, number="pl"),
    dict(w("ông ấy", "그 할아버지", "那位爺爺", "he", "そのおじいさん"), person=3, number="sg"),
    dict(w("bà ấy", "그 할머니", "那位奶奶", "she", "そのおばあさん"), person=3, number="sg"),
    dict(w("các bạn", "너희들", "你們", "you all", "あなたたち"), person=2, number="pl"),
]

SB_NOUN_SUBJECTS = [
    dict(w("học viên", "학습자", "學習者", "the student", "学習者"), number="sg"),
    dict(w("anh chị em", "형제자매들", "弟兄姐妹們", "the brothers and sisters", "兄弟姉妹たち"), number="pl"),
    dict(w("người này", "이 사람", "這個人", "this person", "この人"), number="sg"),
    dict(w("người đó", "그 사람", "那個人", "that person", "その人"), number="sg"),
    dict(w("gia đình", "가족", "家人", "the family", "家族"), number="sg"),
    dict(w("bạn bè", "친구들", "朋友們", "the friends", "友達"), number="pl"),
    dict(w("người Việt Nam", "베트남 사람", "越南人", "the Vietnamese person", "ベトナム人"), number="sg"),
    dict(w("đứa trẻ", "아이", "孩子", "the child", "子供"), number="sg"),
    dict(w("Nhân Chứng", "증인", "見證人", "the Witness", "証人"), number="sg"),
    dict(w("người hàng xóm", "이웃 사람", "鄰居", "the neighbor", "隣人"), number="sg"),
    dict(w("trời", "날씨", "天氣", "it (the weather)", "天気"), number="sg"),
]

def v(vi, ko, zh, en, ja, stem, past, en_3sg, en_past, en_ing, ja_masu, ja_te, ja_nai):
    d = w(vi, ko, zh, en, ja)
    d.update(stem=stem, past=past, en_3sg=en_3sg, en_past=en_past, en_ing=en_ing,
             ja_masu=ja_masu, ja_te=ja_te, ja_nai=ja_nai)
    return d

SB_INTRANS_VERBS = [
    v("đi", "가다", "去", "go", "行く", "가", "갔", "goes", "went", "going", "行き", "行って", "行か"),
    v("đến", "오다", "來", "come", "来る", "오", "왔", "comes", "came", "coming", "来", "来て", "来"),
    v("về", "돌아가다", "回去", "go back", "帰る", "돌아가", "돌아갔", "goes back", "went back", "going back", "帰り", "帰って", "帰ら"),
    v("ngủ", "자다", "睡覺", "sleep", "寝る", "자", "잤", "sleeps", "slept", "sleeping", "寝", "寝て", "寝"),
    v("dậy", "일어나다", "起床", "get up", "起きる", "일어나", "일어났", "gets up", "got up", "getting up", "起き", "起きて", "起き"),
    v("cười", "웃다", "笑", "laugh", "笑う", "웃", "웃었", "laughs", "laughed", "laughing", "笑い", "笑って", "笑わ"),
    v("chờ", "기다리다", "等", "wait", "待つ", "기다리", "기다렸", "waits", "waited", "waiting", "待ち", "待って", "待た"),
    v("chạy", "뛰다", "跑", "run", "走る", "뛰", "뛰었", "runs", "ran", "running", "走り", "走って", "走ら"),
    v("làm việc", "일하다", "工作", "work", "働く", "일하", "일했", "works", "worked", "working", "働き", "働いて", "働か"),
    v("ở", "있다", "在", "be (at)", "いる", "있", "있었", "is", "was", "being", "い", "いて", "い"),
    # "là" (이다, copula) behaves very differently from every other verb here: it never takes an
    # object, it always needs a NOUN COMPLEMENT (SB_COMPLEMENT_NOUNS, see below) instead, and its
    # negative form is irregular in every language -- app_logic.js special-cases it everywhere by
    # checking `verbItem.vi === "là"` rather than by adding a new verbKind.
    v("là", "이다", "是", "be", "だ", "이", "이었", "is", "was", "being", "", "", ""),
]

SB_TRANS_VERBS = [
    v("ăn", "먹다", "吃", "eat", "食べる", "먹", "먹었", "eats", "ate", "eating", "食べ", "食べて", "食べ"),
    v("uống", "마시다", "喝", "drink", "飲む", "마시", "마셨", "drinks", "drank", "drinking", "飲み", "飲んで", "飲ま"),
    v("đọc", "읽다", "讀", "read", "読む", "읽", "읽었", "reads", "read", "reading", "読み", "読んで", "読ま"),
    v("học", "공부하다", "學習", "study", "勉強する", "공부하", "공부했", "studies", "studied", "studying", "勉強し", "勉強して", "勉強し"),
    v("làm", "하다", "做", "do", "する", "하", "했", "does", "did", "doing", "し", "して", "し"),
    v("viết", "쓰다", "寫", "write", "書く", "쓰", "썼", "writes", "wrote", "writing", "書き", "書いて", "書か"),
    v("xem", "보다", "看", "watch", "見る", "보", "봤", "watches", "watched", "watching", "見", "見て", "見"),
    v("nghe", "듣다", "聽", "listen to", "聞く", "듣", "들었", "listens to", "listened to", "listening to", "聞き", "聞いて", "聞か"),
    v("mua", "사다", "買", "buy", "買う", "사", "샀", "buys", "bought", "buying", "買い", "買って", "買わ"),
    v("giúp", "돕다", "幫助", "help", "手伝う", "돕", "도왔", "helps", "helped", "helping", "手伝い", "手伝って", "手伝わ"),
]

def a(vi, ko, zh, en, ja, type_):
    d = w(vi, ko, zh, en, ja)
    d.update(type=type_)
    return d

SB_AUX_VERBS = [
    a("muốn", "~하고 싶다", "想~", "want to", "~たい", "want"),
    a("phải", "~해야 하다", "必須~", "must", "~なければならない", "must"),
    a("có thể", "~할 수 있다", "能~", "can", "~ことができる", "can"),
    a("không thể", "~할 수 없다", "不能~", "cannot", "~ことができない", "cannot"),
    a("nên", "~하는 게 좋다", "最好~", "should", "~たほうがいい", "should"),
    a("sẽ", "~할 것이다", "會~", "will", "~でしょう", "will"),
    a("đã", "~했다(과거)", "~了(過去)", "(past)", "~た(過去)", "past"),
    a("đang", "~하는 중이다", "正在~", "be ~ing", "~ている", "ing"),
    a("cần", "~할 필요가 있다", "需要~", "need to", "~必要がある", "need"),
    a("thích", "~하는 것을 좋아하다", "喜歡~", "like to", "~のが好き", "like"),
    a("hãy", "~해라(명령)", "~吧(命令)", "(imperative)", "~てください(命令)", "hay"),
]

SB_OBJECT_NOUNS = [
    w("cơm", "밥", "飯", "rice", "ご飯"), w("nước", "물", "水", "water", "水"),
    w("sách", "책", "書", "a book", "本"), w("Kinh Thánh", "성경", "聖經", "the Bible", "聖書"),
    w("bài giảng", "강연", "演講", "the talk", "話"), w("thư", "편지", "信", "a letter", "手紙"),
    w("phim", "영화", "電影", "a movie", "映画"), w("bài hát", "노래", "歌", "a song", "歌"),
    w("quần áo", "옷", "衣服", "clothes", "服"), w("câu hỏi", "질문", "問題", "a question", "質問"),
]

def adj(vi, ko, zh, en, ja, kr_attr, kr_past, ja_type, ja_attr, ja_neg_stem, rieul=None):
    d = w(vi, ko, zh, en, ja)
    d.update(attr=kr_attr, past=kr_past, ja_type=ja_type, ja_attr=ja_attr, ja_neg_stem=ja_neg_stem)
    if rieul:
        d["rieul"] = rieul  # ㅂ/ㄷ-irregular vowel-suffix-safe stem, Korean -(으)ㄹ 수 있/없/것이/필요가 있 forms
    return d

# ja_type 'i' = い-adjective (polite: 〜いです / 〜くないです / 〜かったです / 〜くなかったです;
#   attributive = dictionary form itself); ja_neg_stem is the negative-forming stem (dict minus
#   final い, EXCEPT いい which irregularly uses よ- for every conjugated form).
# ja_type 'na' = な-adjective (polite: 〜です / 〜ではありません / 〜でした / 〜ではありませんでした;
#   attributive = dict + な); ja_neg_stem unused (na-adjectives conjugate via です, not a stem).
SB_ADJECTIVES = [
    adj("ngon", "맛있다", "好吃", "delicious", "おいしい", "맛있는", "맛있었", "i", "おいしい", "おいし"),
    adj("đẹp", "예쁘다", "漂亮", "pretty", "きれい", "예쁜", "예뻤", "na", "きれいな", ""),
    adj("tốt", "좋다", "好", "good", "いい", "좋은", "좋았", "i", "いい", "よ"),
    adj("lớn", "크다", "大", "big", "大きい", "큰", "컸", "i", "大きい", "大き"),
    adj("nhỏ", "작다", "小", "small", "小さい", "작은", "작았", "i", "小さい", "小さ"),
    adj("mới", "새롭다", "新", "new", "新しい", "새로운", "새로웠", "i", "新しい", "新し"),
    adj("cũ", "오래되다", "舊", "old", "古い", "오래된", "오래됐", "i", "古い", "古"),
    adj("khó", "어렵다", "難", "difficult", "難しい", "어려운", "어려웠", "i", "難しい", "難し"),
    adj("dễ", "쉽다", "簡單", "easy", "簡単", "쉬운", "쉬웠", "na", "簡単な", ""),
    adj("quan trọng", "중요하다", "重要", "important", "重要", "중요한", "중요했", "na", "重要な", ""),
    adj("lạnh", "춥다", "冷", "cold", "寒い", "추운", "추웠", "i", "寒い", "寒", rieul="추우"),
]

SB_CONNECTIVES = [
    w("Và", "그리고", "而且", "And", "そして"), w("Nhưng", "그러나", "但是", "But", "しかし"),
    w("Hoặc", "또는", "或者", "Or", "または"), w("Vì vậy", "그래서", "所以", "So", "だから"),
    w("Vì", "왜냐하면", "因為", "Because", "なぜなら"), w("Nếu vậy", "그렇다면", "如果那樣的話", "If so", "それなら"),
    w("Tuy vậy", "그렇지만", "不過", "Even so", "それでも"), w("Sau đó", "그 후에", "之後", "After that", "その後"),
    w("Rồi", "그리고 나서", "然後", "And then", "それから"), w("Cũng", "또한", "也", "Also", "また"),
]

SB_TIME_ADV = [
    w("vào buổi sáng", "아침에", "早上", "in the morning", "朝に"),
    w("vào buổi trưa", "낮에", "中午", "at noon", "昼に"),
    w("vào buổi chiều", "오후에", "下午", "in the afternoon", "午後に"),
    w("vào buổi tối", "저녁에", "晚上", "in the evening", "夕方に"),
    w("vào ban đêm", "밤에", "夜裡", "at night", "夜に"),
    w("hôm nay", "오늘", "今天", "today", "今日"),
    w("ngày mai", "내일", "明天", "tomorrow", "明日"),
    w("hôm qua", "어제", "昨天", "yesterday", "昨日"),
    w("mỗi ngày", "매일", "每天", "every day", "毎日"),
    w("mỗi tuần", "매주", "每週", "every week", "毎週"),
]

# Bare place NOUNS (not pre-formed phrases) -- the preposition/particle (Vietnamese "ở" vs
# "đến"/none; Korean 에서 vs 에; English "at/in" vs "to"; Japanese で vs に) is chosen dynamically
# in app_logic.js based on which verb is selected, since that depends on the verb, not the place
# itself (e.g. "đi đến nhà" go TO home vs. "ăn ở nhà" eat AT home use different prepositions for
# the very same place word).
SB_PLACE_ADV = [
    w("nhà", "집", "家", "home", "家"), w("Phòng Nước Trời", "왕국회관", "王國聚會所", "the Kingdom Hall", "王国会館"),
    w("trường", "학교", "學校", "school", "学校"), w("công ty", "회사", "公司", "the office", "会社"),
    w("ngoài đường", "길거리", "街上", "the street", "道"), w("công viên", "공원", "公園", "the park", "公園"),
    w("nhà thờ", "교회", "教堂", "church", "教会"), w("siêu thị", "마트", "超市", "the supermarket", "スーパー"),
    w("nhà ga", "기차역", "火車站", "the train station", "駅"), w("nhà hàng", "식당", "餐廳", "the restaurant", "レストラン"),
]

# 명사 (noun complement for "là", the copula: "주어 + là + 명사" = "주어 + 명사이다")
SB_COMPLEMENT_NOUNS = [
    w("học sinh", "학생", "學生", "a student", "学生"),
    w("Nhân Chứng Giê-hô-va", "여호와의 증인", "耶和華見證人", "a Jehovah's Witness", "エホバの証人"),
    w("giáo viên", "선생님", "老師", "a teacher", "先生"), w("bác sĩ", "의사", "醫生", "a doctor", "医者"),
    w("bạn thân", "친한 친구", "好朋友", "a close friend", "親友"), w("trưởng lão", "장로", "長老", "an elder", "長老"),
    w("anh trai", "형/오빠", "哥哥", "an older brother", "お兄さん"), w("chị gái", "누나/언니", "姐姐", "an older sister", "お姉さん"),
    w("người Hàn Quốc", "한국 사람", "韓國人", "a Korean person", "韓国人"), w("người mới", "새 신자", "新朋友", "a newly interested person", "新しい人"),
]

# 전치사 (preposition phrases -- kept as fixed prep+companion phrases, like SB_MANNER_ADV, rather
# than a fully compositional "preposition + noun" pair)
SB_PREPOSITIONS = [
    w("với bạn", "친구와", "跟朋友", "with a friend", "友達と"),
    w("với gia đình", "가족과", "跟家人", "with family", "家族と"),
    w("với anh chị em", "형제자매와", "跟弟兄姐妹", "with brothers and sisters", "兄弟姉妹と"),
    w("với tôi", "나와", "跟我", "with me", "私と"),
    w("với Nhân Chứng", "증인과", "跟見證人", "with a Witness", "証人と"),
    w("với người Việt Nam", "베트남 사람과", "跟越南人", "with a Vietnamese person", "ベトナム人と"),
    w("cho gia đình", "가족을 위해", "為了家人", "for family", "家族のために"),
    w("cho anh chị em", "형제자매를 위해", "為了弟兄姐妹", "for the brothers and sisters", "兄弟姉妹のために"),
    w("vì công việc", "일 때문에", "因為工作", "because of work", "仕事のために"),
    w("thay cho tôi", "나 대신", "代替我", "instead of me", "私の代わりに"),
]

SB_MANNER_ADV = [
    w("nhanh", "빨리", "快", "quickly", "速く"), w("chậm", "천천히", "慢慢地", "slowly", "ゆっくり"),
    w("kỹ", "꼼꼼히", "仔細地", "carefully", "念入りに"), w("chăm chỉ", "열심히", "努力地", "diligently", "熱心に"),
    w("cẩn thận", "조심스럽게", "小心地", "cautiously", "注意深く"), w("vui vẻ", "즐겁게", "愉快地", "happily", "楽しく"),
    w("nghiêm túc", "진지하게", "認真地", "seriously", "真剣に"), w("dễ dàng", "쉽게", "輕易地", "easily", "簡単に"),
    w("thật lòng", "진심으로", "真心地", "sincerely", "心から"), w("đều đặn", "꾸준히", "持續地", "steadily", "着実に"),
]

SB_SENTENCE_TYPES = [
    {"key": "statement", "label": kdict("긍정문", "肯定句", "Statement", "肯定文")},
    {"key": "negative", "label": kdict("부정문", "否定句", "Negative", "否定文")},
    {"key": "yesno", "label": kdict("예/아니오 의문문", "是非問句", "Yes/No question", "はい・いいえ疑問文")},
    {"key": "imperative", "label": kdict("명령문", "命令句", "Imperative", "命令文")},
    {"key": "propositive", "label": kdict("청유문", "建議句", "Let's-suggestion", "勧誘文")},
    {"key": "alternative", "label": kdict("선택 의문문", "選擇疑問句", "Alternative question", "選択疑問文")},
    {"key": "wh", "label": kdict("의문사 의문문", "疑問詞疑問句", "Wh-question", "疑問詞疑問文")},
]

SB_WH_WORDS = [
    {"key": "ai", "vi": "ai", "kr": kdict("누가", "誰", "who", "誰")},
    {"key": "gi", "vi": "gì", "kr": kdict("무엇", "什麼", "what", "何")},
    {"key": "dau", "vi": "ở đâu", "kr": kdict("어디에서", "在哪裡", "where", "どこで")},
    {"key": "khinao", "vi": "khi nào", "kr": kdict("언제", "什麼時候", "when", "いつ")},
    {"key": "taisao", "vi": "tại sao", "kr": kdict("왜", "為什麼", "why", "なぜ")},
    {"key": "thenao", "vi": "thế nào", "kr": kdict("어때", "怎麼樣", "how", "どう")},
]
