# "문장 생성기" (Sentence Builder) data for the 문법·작문 탭.
#
# Word banks the learner can mix and match to generate a Vietnamese sentence in correct
# Vietnamese word order, together with a word-by-word gloss and an auto-composed natural
# sentence translation -- one target-language engine per UI language (ko/zh/en/ja/de/fr/pl), all
# implemented in app_logic.js. Every optional category includes an implicit "사용 안 함" (not
# used) choice in the UI, so the generator covers both filled-in and omitted combinations.
#
# ---- Data shape ----
# "kr" fields below are {"ko","zh","en","ja","de","fr","pl"} dicts (base dictionary-form meaning only, no
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
# conjugate for person/number and none of the target languages need person agreement beyond
# English's.

def kdict(ko, zh, en, ja, de, fr, pl):
    return {"ko": ko, "zh": zh, "en": en, "ja": ja, "de": de, "fr": fr, "pl": pl}

def w(vi, ko, zh, en, ja, de, fr, pl):
    return {"vi": vi, "kr": kdict(ko, zh, en, ja, de, fr, pl)}

SB_PRONOUNS = [
    dict(w("tôi", "나", "我", "I", "私", "ich", "je", "ja"), person=1, number="sg"),
    dict(w("bạn", "너", "你", "you", "あなた", "du", "tu / vous", "ty / wy"), person=2, number="sg"),
    dict(w("anh ấy", "그 남자", "他", "he", "彼", "er", "il / lui", "on"), person=3, number="sg"),
    dict(w("chị ấy", "그 여자", "她", "she", "彼女", "sie", "elle", "ona"), person=3, number="sg"),
    dict(w("chúng tôi", "우리들", "我們", "we", "私たち", "wir", "nous (excl.)", "my (wykluczające)"), person=1, number="pl"),
    dict(w("chúng ta", "우리", "我們", "we", "私たち", "wir", "nous (incl.)", "my (włączające)"), person=1, number="pl"),
    dict(w("họ", "그들", "他們", "they", "彼ら", "sie", "ils / elles", "oni / one"), person=3, number="pl"),
    dict(w("ông ấy", "그 할아버지", "那位爺爺", "he", "そのおじいさん", "er (jener Herr)", "il (ce monsieur)", "on (ten pan)"), person=3, number="sg"),
    dict(w("bà ấy", "그 할머니", "那位奶奶", "she", "そのおばあさん", "sie (jene Dame)", "elle (cette dame)", "ona (ta pani)"), person=3, number="sg"),
    dict(w("các bạn", "너희들", "你們", "you all", "あなたたち", "ihr", "vous (pluriel)", "wy (liczba mnoga)"), person=2, number="pl"),
]

SB_NOUN_SUBJECTS = [
    dict(w("học viên", "학습자", "學習者", "the student", "学習者", "der Schüler", "l'étudiant", "uczeń / kursant"), number="sg"),
    dict(w("anh chị em", "형제자매들", "弟兄姐妹們", "the brothers and sisters", "兄弟姉妹たち", "die Brüder und Schwestern", "les frères et sœurs", "bracia i siostry"), number="pl"),
    dict(w("người này", "이 사람", "這個人", "this person", "この人", "diese Person", "cette personne", "ta osoba"), number="sg"),
    dict(w("người đó", "그 사람", "那個人", "that person", "その人", "jene Person", "cette personne-là", "tamta osoba"), number="sg"),
    dict(w("gia đình", "가족", "家人", "the family", "家族", "die Familie", "la famille", "rodzina"), number="sg"),
    dict(w("bạn bè", "친구들", "朋友們", "the friends", "友達", "die Freunde", "les amis", "przyjaciele"), number="pl"),
    dict(w("người Việt Nam", "베트남 사람", "越南人", "the Vietnamese person", "ベトナム人", "der Vietnamese", "le Vietnamien", "Wietnamczyk"), number="sg"),
    dict(w("đứa trẻ", "아이", "孩子", "the child", "子供", "das Kind", "l'enfant", "dziecko"), number="sg"),
    dict(w("Nhân Chứng", "증인", "見證人", "the Witness", "証人", "der Zeuge", "le Témoin", "Świadek"), number="sg"),
    dict(w("người hàng xóm", "이웃 사람", "鄰居", "the neighbor", "隣人", "der Nachbar", "le voisin", "sąsiad"), number="sg"),
    dict(w("trời", "날씨", "天氣", "it (the weather)", "天気", "das Wetter", "le temps (météo)", "pogoda / niebo"), number="sg"),
]

def v(vi, ko, zh, en, ja, de, fr, pl, stem, past, en_3sg, en_past, en_ing, ja_masu, ja_te, ja_nai):
    d = w(vi, ko, zh, en, ja, de, fr, pl)
    d.update(stem=stem, past=past, en_3sg=en_3sg, en_past=en_past, en_ing=en_ing,
             ja_masu=ja_masu, ja_te=ja_te, ja_nai=ja_nai)
    return d

SB_INTRANS_VERBS = [
    v("đi", "가다", "去", "go", "行く", "gehen", "aller", "iść", "가", "갔", "goes", "went", "going", "行き", "行って", "行か"),
    v("đến", "오다", "來", "come", "来る", "kommen", "venir / arriver", "przychodzić / przybywać", "오", "왔", "comes", "came", "coming", "来", "来て", "来"),
    v("về", "돌아가다", "回去", "go back", "帰る", "zurückgehen", "rentrer / retourner", "wracać", "돌아가", "돌아갔", "goes back", "went back", "going back", "帰り", "帰って", "帰ら"),
    v("ngủ", "자다", "睡覺", "sleep", "寝る", "schlafen", "dormir", "spać", "자", "잤", "sleeps", "slept", "sleeping", "寝", "寝て", "寝"),
    v("dậy", "일어나다", "起床", "get up", "起きる", "aufstehen", "se lever", "wstawać", "일어나", "일어났", "gets up", "got up", "getting up", "起き", "起きて", "起き"),
    v("cười", "웃다", "笑", "laugh", "笑う", "lachen", "rire", "śmiać się", "웃", "웃었", "laughs", "laughed", "laughing", "笑い", "笑って", "笑わ"),
    v("chờ", "기다리다", "等", "wait", "待つ", "warten", "attendre", "czekać", "기다리", "기다렸", "waits", "waited", "waiting", "待ち", "待って", "待た"),
    v("chạy", "뛰다", "跑", "run", "走る", "laufen", "courir", "biegać", "뛰", "뛰었", "runs", "ran", "running", "走り", "走って", "走ら"),
    v("làm việc", "일하다", "工作", "work", "働く", "arbeiten", "travailler", "pracować", "일하", "일했", "works", "worked", "working", "働き", "働いて", "働か"),
    v("ở", "있다", "在", "be (at)", "いる", "sein (in/an)", "être (à/dans)", "być (w/na)", "있", "있었", "is", "was", "being", "い", "いて", "い"),
    # "là" (이다, copula) behaves very differently from every other verb here: it never takes an
    # object, it always needs a NOUN COMPLEMENT (SB_COMPLEMENT_NOUNS, see below) instead, and its
    # negative form is irregular in every language -- app_logic.js special-cases it everywhere by
    # checking `verbItem.vi === "là"` rather than by adding a new verbKind.
    v("là", "이다", "是", "be", "だ", "sein", "être", "być", "이", "이었", "is", "was", "being", "", "", ""),
]

SB_TRANS_VERBS = [
    v("ăn", "먹다", "吃", "eat", "食べる", "essen", "manger", "jeść", "먹", "먹었", "eats", "ate", "eating", "食べ", "食べて", "食べ"),
    v("uống", "마시다", "喝", "drink", "飲む", "trinken", "boire", "pić", "마시", "마셨", "drinks", "drank", "drinking", "飲み", "飲んで", "飲ま"),
    v("đọc", "읽다", "讀", "read", "読む", "lesen", "lire", "czytać", "읽", "읽었", "reads", "read", "reading", "読み", "読んで", "読ま"),
    v("học", "공부하다", "學習", "study", "勉強する", "lernen", "apprendre", "uczyć się", "공부하", "공부했", "studies", "studied", "studying", "勉強し", "勉強して", "勉強し"),
    v("làm", "하다", "做", "do", "する", "machen", "faire", "robić", "하", "했", "does", "did", "doing", "し", "して", "し"),
    v("viết", "쓰다", "寫", "write", "書く", "schreiben", "écrire", "pisać", "쓰", "썼", "writes", "wrote", "writing", "書き", "書いて", "書か"),
    v("xem", "보다", "看", "watch", "見る", "sehen", "regarder", "oglądać", "보", "봤", "watches", "watched", "watching", "見", "見て", "見"),
    v("nghe", "듣다", "聽", "listen to", "聞く", "hören", "écouter", "słuchać", "듣", "들었", "listens to", "listened to", "listening to", "聞き", "聞いて", "聞か"),
    v("mua", "사다", "買", "buy", "買う", "kaufen", "acheter", "kupować", "사", "샀", "buys", "bought", "buying", "買い", "買って", "買わ"),
    v("giúp", "돕다", "幫助", "help", "手伝う", "helfen", "aider", "pomagać", "돕", "도왔", "helps", "helped", "helping", "手伝い", "手伝って", "手伝わ"),
]

def a(vi, ko, zh, en, ja, de, fr, pl, type_):
    d = w(vi, ko, zh, en, ja, de, fr, pl)
    d.update(type=type_)
    return d

SB_AUX_VERBS = [
    a("muốn", "~하고 싶다", "想~", "want to", "~たい", "möchten", "vouloir", "chcieć", "want"),
    a("phải", "~해야 하다", "必須~", "must", "~なければならない", "müssen", "devoir", "musieć", "must"),
    a("có thể", "~할 수 있다", "能~", "can", "~ことができる", "können", "pouvoir", "móc / potrafić", "can"),
    a("không thể", "~할 수 없다", "不能~", "cannot", "~ことができない", "nicht können", "ne pas pouvoir", "nie móc", "cannot"),
    a("nên", "~하는 게 좋다", "最好~", "should", "~たほうがいい", "sollte", "devrait", "powinien", "should"),
    a("sẽ", "~할 것이다", "會~", "will", "~でしょう", "werden", "futur (va ~)", "będzie (czas przyszły)", "will"),
    a("đã", "~했다(과거)", "~了(過去)", "(past)", "~た(過去)", "(Vergangenheit)", "(passé)", "(czas przeszły)", "past"),
    a("đang", "~하는 중이다", "正在~", "be ~ing", "~ている", "gerade dabei sein", "en train de", "w trakcie / właśnie", "ing"),
    a("cần", "~할 필요가 있다", "需要~", "need to", "~必要がある", "brauchen", "avoir besoin de", "potrzebować", "need"),
    a("thích", "~하는 것을 좋아하다", "喜歡~", "like to", "~のが好き", "gern tun", "aimer", "lubić", "like"),
    a("hãy", "~해라(명령)", "~吧(命令)", "(imperative)", "~てください(命令)", "(Aufforderung)", "(impératif)", "(tryb rozkazujący)", "hay"),
]

SB_OBJECT_NOUNS = [
    w("cơm", "밥", "飯", "rice", "ご飯", "Reis / Essen", "du riz / le repas", "ryż / posiłek"),
    w("nước", "물", "水", "water", "水", "Wasser", "de l'eau", "woda"),
    w("sách", "책", "書", "a book", "本", "ein Buch", "un livre", "książka"),
    w("Kinh Thánh", "성경", "聖經", "the Bible", "聖書", "die Bibel", "la Bible", "Biblia"),
    w("bài giảng", "강연", "演講", "the talk", "話", "den Vortrag", "le discours", "przemówienie"),
    w("thư", "편지", "信", "a letter", "手紙", "einen Brief", "une lettre", "list"),
    w("phim", "영화", "電影", "a movie", "映画", "einen Film", "un film", "film"),
    w("bài hát", "노래", "歌", "a song", "歌", "ein Lied", "une chanson", "pieśń / piosenka"),
    w("quần áo", "옷", "衣服", "clothes", "服", "Kleidung", "des vêtements", "ubrania"),
    w("câu hỏi", "질문", "問題", "a question", "質問", "eine Frage", "une question", "pytanie"),
]

def adj(vi, ko, zh, en, ja, de, fr, pl, kr_attr, kr_past, ja_type, ja_attr, ja_neg_stem, rieul=None):
    d = w(vi, ko, zh, en, ja, de, fr, pl)
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
    adj("ngon", "맛있다", "好吃", "delicious", "おいしい", "lecker", "délicieux", "smaczny", "맛있는", "맛있었", "i", "おいしい", "おいし"),
    adj("đẹp", "예쁘다", "漂亮", "pretty", "きれい", "schön", "beau / joli", "piękny / ładny", "예쁜", "예뻤", "na", "きれいな", ""),
    adj("tốt", "좋다", "好", "good", "いい", "gut", "bon", "dobry", "좋은", "좋았", "i", "いい", "よ"),
    adj("lớn", "크다", "大", "big", "大きい", "groß", "grand", "duży", "큰", "컸", "i", "大きい", "大き"),
    adj("nhỏ", "작다", "小", "small", "小さい", "klein", "petit", "mały", "작은", "작았", "i", "小さい", "小さ"),
    adj("mới", "새롭다", "新", "new", "新しい", "neu", "nouveau", "nowy", "새로운", "새로웠", "i", "新しい", "新し"),
    adj("cũ", "오래되다", "舊", "old", "古い", "alt", "vieux / ancien", "stary", "오래된", "오래됐", "i", "古い", "古"),
    adj("khó", "어렵다", "難", "difficult", "難しい", "schwierig", "difficile", "trudny", "어려운", "어려웠", "i", "難しい", "難し"),
    adj("dễ", "쉽다", "簡單", "easy", "簡単", "einfach", "facile", "łatwy", "쉬운", "쉬웠", "na", "簡単な", ""),
    adj("quan trọng", "중요하다", "重要", "important", "重要", "wichtig", "important", "ważny", "중요한", "중요했", "na", "重要な", ""),
    adj("lạnh", "춥다", "冷", "cold", "寒い", "kalt", "froid", "zimny", "추운", "추웠", "i", "寒い", "寒", rieul="추우"),
]

SB_CONNECTIVES = [
    w("Và", "그리고", "而且", "And", "そして", "Und", "Et", "I / oraz"),
    w("Nhưng", "그러나", "但是", "But", "しかし", "Aber", "Mais", "Ale"),
    w("Hoặc", "또는", "或者", "Or", "または", "Oder", "Ou", "Albo / lub"),
    w("Vì vậy", "그래서", "所以", "So", "だから", "Deshalb", "Donc / C'est pourquoi", "Dlatego"),
    w("Vì", "왜냐하면", "因為", "Because", "なぜなら", "Weil", "Parce que", "Ponieważ / bo"),
    w("Nếu vậy", "그렇다면", "如果那樣的話", "If so", "それなら", "Wenn dem so ist", "Si c'est le cas / Alors", "W takim razie"),
    w("Tuy vậy", "그렇지만", "不過", "Even so", "それでも", "Trotzdem", "Pourtant / Malgré tout", "Jednakże / mimo to"),
    w("Sau đó", "그 후에", "之後", "After that", "その後", "Danach", "Après cela", "Potem / następnie"),
    w("Rồi", "그리고 나서", "然後", "And then", "それから", "Und dann", "Et puis", "I potem"),
    w("Cũng", "또한", "也", "Also", "また", "Auch", "Aussi", "Również / także"),
]

SB_TIME_ADV = [
    w("vào buổi sáng", "아침에", "早上", "in the morning", "朝に", "am Morgen", "le matin", "rano"),
    w("vào buổi trưa", "낮에", "中午", "at noon", "昼に", "am Mittag", "à midi", "w południe"),
    w("vào buổi chiều", "오후에", "下午", "in the afternoon", "午後に", "am Nachmittag", "l'après-midi", "po południu"),
    w("vào buổi tối", "저녁에", "晚上", "in the evening", "夕方に", "am Abend", "le soir", "wieczorem"),
    w("vào ban đêm", "밤에", "夜裡", "at night", "夜に", "in der Nacht", "la nuit", "w nocy"),
    w("hôm nay", "오늘", "今天", "today", "今日", "heute", "aujourd'hui", "dzisiaj"),
    w("ngày mai", "내일", "明天", "tomorrow", "明日", "morgen", "demain", "jutro"),
    w("hôm qua", "어제", "昨天", "yesterday", "昨日", "gestern", "hier", "wczoraj"),
    w("mỗi ngày", "매일", "每天", "every day", "毎日", "jeden Tag", "chaque jour", "każdego dnia"),
    w("mỗi tuần", "매주", "每週", "every week", "毎週", "jede Woche", "chaque semaine", "każdego tygodnia"),
]

# Bare place NOUNS (not pre-formed phrases) -- the preposition/particle (Vietnamese "ở" vs
# "đến"/none; Korean 에서 vs 에; English "at/in" vs "to"; Japanese で vs に) is chosen dynamically
# in app_logic.js based on which verb is selected, since that depends on the verb, not the place
# itself (e.g. "đi đến nhà" go TO home vs. "ăn ở nhà" eat AT home use different prepositions for
# the very same place word).
SB_PLACE_ADV = [
    w("nhà", "집", "家", "home", "家", "Zuhause", "à la maison", "w domu"),
    w("Phòng Nước Trời", "왕국회관", "王國聚會所", "the Kingdom Hall", "王国会館", "der Königreichssaal", "la Salle du Royaume", "Sala Królestwa"),
    w("trường", "학교", "學校", "school", "学校", "die Schule", "l'école", "szkoła"),
    w("công ty", "회사", "公司", "the office", "会社", "das Büro / die Firma", "l'entreprise / le bureau", "firma / biuro"),
    w("ngoài đường", "길거리", "街上", "the street", "道", "die Straße", "dans la rue", "na ulicy"),
    w("công viên", "공원", "公園", "the park", "公園", "der Park", "le parc", "park"),
    w("nhà thờ", "교회", "教堂", "church", "教会", "die Kirche", "l'église", "kościół"),
    w("siêu thị", "마트", "超市", "the supermarket", "スーパー", "der Supermarkt", "le supermarché", "supermarket"),
    w("nhà ga", "기차역", "火車站", "the train station", "駅", "der Bahnhof", "la gare", "stacja kolejowa"),
    w("nhà hàng", "식당", "餐廳", "the restaurant", "レストラン", "das Restaurant", "le restaurant", "restauracja"),
]

# 명사 (noun complement for "là", the copula: "주어 + là + 명사" = "주어 + 명사이다")
SB_COMPLEMENT_NOUNS = [
    w("học sinh", "학생", "學生", "a student", "学生", "ein Schüler", "un élève", "uczeń"),
    w("Nhân Chứng Giê-hô-va", "여호와의 증인", "耶和華見證人", "a Jehovah's Witness", "エホバの証人", "ein Zeuge Jehovas", "un Témoin de Jéhovah", "Świadek Jehowy"),
    w("giáo viên", "선생님", "老師", "a teacher", "先生", "ein Lehrer", "un enseignant", "nauczyciel"),
    w("bác sĩ", "의사", "醫生", "a doctor", "医者", "ein Arzt", "un médecin", "lekarz"),
    w("bạn thân", "친한 친구", "好朋友", "a close friend", "親友", "ein enger Freund", "un ami proche", "bliski przyjaciel"),
    w("trưởng lão", "장로", "長老", "an elder", "長老", "ein Ältester", "un ancien", "starszy"),
    w("anh trai", "형/오빠", "哥哥", "an older brother", "お兄さん", "ein älterer Bruder", "un frère aîné", "starszy brat"),
    w("chị gái", "누나/언니", "姐姐", "an older sister", "お姉さん", "eine ältere Schwester", "une sœur aînée", "starsza siostra"),
    w("người Hàn Quốc", "한국 사람", "韓國人", "a Korean person", "韓国人", "ein Koreaner", "un Coréen", "Koreańczyk"),
    w("người mới", "새 신자", "新朋友", "a newly interested person", "新しい人", "eine interessierte Person", "un nouveau", "nowo zainteresowany"),
]

# 전치사 (preposition phrases -- kept as fixed prep+companion phrases, like SB_MANNER_ADV, rather
# than a fully compositional "preposition + noun" pair)
SB_PREPOSITIONS = [
    w("với bạn", "친구와", "跟朋友", "with a friend", "友達と", "mit einem Freund", "avec un ami", "z przyjacielem"),
    w("với gia đình", "가족과", "跟家人", "with family", "家族と", "mit der Familie", "avec la famille", "z rodziną"),
    w("với anh chị em", "형제자매와", "跟弟兄姐妹", "with brothers and sisters", "兄弟姉妹と", "mit den Brüdern und Schwestern", "avec les frères et sœurs", "z braćmi i siostrami"),
    w("với tôi", "나와", "跟我", "with me", "私と", "mit mir", "avec moi", "ze mną"),
    w("với Nhân Chứng", "증인과", "跟見證人", "with a Witness", "証人と", "mit einem Zeugen", "avec un Témoin", "ze Świadkiem"),
    w("với người Việt Nam", "베트남 사람과", "跟越南人", "with a Vietnamese person", "ベトナム人と", "mit einem Vietnamesen", "avec un Vietnamien", "z Wietnamczykiem"),
    w("cho gia đình", "가족을 위해", "為了家人", "for family", "家族のために", "für die Familie", "pour la famille", "dla rodziny"),
    w("cho anh chị em", "형제자매를 위해", "為了弟兄姐妹", "for the brothers and sisters", "兄弟姉妹のために", "für die Brüder und Schwestern", "pour les frères et sœurs", "dla braci i sióstr"),
    w("vì công việc", "일 때문에", "因為工作", "because of work", "仕事のために", "wegen der Arbeit", "à cause du travail", "z powodu pracy"),
    w("thay cho tôi", "나 대신", "代替我", "instead of me", "私の代わりに", "anstatt meiner", "à ma place", "zamiast mnie"),
]

SB_MANNER_ADV = [
    w("nhanh", "빨리", "快", "quickly", "速く", "schnell", "vite / rapidement", "szybko"),
    w("chậm", "천천히", "慢慢地", "slowly", "ゆっくり", "langsam", "lentement", "powoli"),
    w("kỹ", "꼼꼼히", "仔細地", "carefully", "念入りに", "gründlich", "soigneusement", "starannie / dokładnie"),
    w("chăm chỉ", "열심히", "努力地", "diligently", "熱心に", "fleißig", "assidûment", "pilnie"),
    w("cẩn thận", "조심스럽게", "小心地", "cautiously", "注意深く", "vorsichtig", "prudemment", "ostrożnie"),
    w("vui vẻ", "즐겁게", "愉快地", "happily", "楽しく", "fröhlich", "joyeusement", "radośnie"),
    w("nghiêm túc", "진지하게", "認真地", "seriously", "真剣に", "ernsthaft", "sérieusement", "poważnie"),
    w("dễ dàng", "쉽게", "輕易地", "easily", "簡単に", "leicht", "facilement", "łatwo"),
    w("thật lòng", "진심으로", "真心地", "sincerely", "心から", "aufrichtig", "sincèrement", "szczerze"),
    w("đều đặn", "꾸준히", "持續地", "steadily", "着実に", "regelmäßig", "régulièrement", "regularnie"),
]

SB_SENTENCE_TYPES = [
    {"key": "statement", "label": kdict("긍정문", "肯定句", "Statement", "肯定文", "Aussagesatz", "Phrase affirmative", "Zdanie twierdzące")},
    {"key": "negative", "label": kdict("부정문", "否定句", "Negative", "否定文", "Verneinungssatz", "Phrase négative", "Zdanie przeczące")},
    {"key": "yesno", "label": kdict("예/아니오 의문문", "是非問句", "Yes/No question", "はい・いいえ疑問文", "Ja/Nein-Frage", "Question fermée (Oui/Non)", "Pytanie o rozstrzygnięcie (Tak/Nie)")},
    {"key": "imperative", "label": kdict("명령문", "命令句", "Imperative", "命令文", "Aufforderungssatz / Imperativ", "Phrase impérative", "Zdanie rozkazujące")},
    {"key": "propositive", "label": kdict("청유문", "建議句", "Let's-suggestion", "勧誘文", "Vorschlagssatz", "Proposition (suggestion)", "Zdanie zachęcające (propozycja)")},
    {"key": "alternative", "label": kdict("선택 의문문", "選擇疑問句", "Alternative question", "選択疑問文", "Alternativfrage", "Question alternative", "Pytanie alternatywne")},
    {"key": "wh", "label": kdict("의문사 의문문", "疑問詞疑問句", "Wh-question", "疑問詞疑問文", "W-Frage", "Question ouverte (en Wh-)", "Pytanie szczegółowe (z zaimkiem pytajnym)")},
]

SB_WH_WORDS = [
    {"key": "ai", "vi": "ai", "kr": kdict("누가", "誰", "who", "誰", "wer", "qui", "kto")},
    {"key": "gi", "vi": "gì", "kr": kdict("무엇", "什麼", "what", "何", "was", "quoi / que", "co")},
    {"key": "dau", "vi": "ở đâu", "kr": kdict("어디에서", "在哪裡", "where", "どこで", "wo", "où", "gdzie")},
    {"key": "khinao", "vi": "khi nào", "kr": kdict("언제", "什麼時候", "when", "いつ", "wann", "quand", "kiedy")},
    {"key": "taisao", "vi": "tại sao", "kr": kdict("왜", "為什麼", "why", "なぜ", "warum", "pourquoi", "dlaczego")},
    {"key": "thenao", "vi": "thế nào", "kr": kdict("어때", "怎麼樣", "how", "どう", "wie", "comment", "jak")},
]
