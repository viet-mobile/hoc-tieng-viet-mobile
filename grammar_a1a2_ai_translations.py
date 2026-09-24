# -*- coding: utf-8 -*-
"""AI-generated translations for GRAMMAR_A1_A2_PATTERNS ([문법] > [수업] 기초 핵심 문형 A1/A2).

grammar_data.py is the source and carries only Vietnamese + Korean (meaningKo / examples[].ko).
This file adds the other 10 languages without touching the source: apply_a1a2_ai_translations()
returns a copy where each pattern gets `meaning` ({"ko": meaningKo, ...generated}) and each example
gets `tr` ({"ko": ex.ko, ...generated}), plus `aiLangs` naming the generated languages.

Order in each row: cs | zh_cn | zh | en | fr | de | hu | id | ja | pl
"""

import copy

A1A2_AI_LANGS = ["cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "pl"]

# pattern index -> meaning; (pattern index, example index) -> example translation
_MEANINGS = [
    "A je B (rovnost, definice, totožnost)|A是B（等同、定义、身份）|A是B（等同、定義、身分）|A is B (equality, definition, identity)|A est B (égalité, définition, identité)|A ist B (Gleichheit, Definition, Identität)|A az B (azonosság, meghatározás, kilét)|A adalah B (kesamaan, definisi, identitas)|AはBだ（同等・定義・身分）|A jest B (równość, definicja, tożsamość)",
    "být v/na ~ / bydlet v ~ (poloha, místo)|在~ / 住在~（位置、地点）|在~ / 住在~（位置、地點）|to be at ~ / to live in ~ (location, place)|être à ~ / habiter à ~ (lieu, position)|in/an ~ sein / in ~ wohnen (Ort, Lage)|valahol lenni / valahol lakni (hely, helyzet)|berada di ~ / tinggal di ~ (lokasi, tempat)|~にいる・ある / ~に住む（位置・場所）|być w ~ / mieszkać w ~ (miejsce, położenie)",
    "už ~ (minulý čas)|已经~了（过去时）|已經~了（過去式）|already did ~ (past tense)|avoir déjà ~ (passé)|schon ~ haben (Vergangenheit)|már ~ (múlt idő)|sudah ~ (kala lampau)|もう~した（過去）|już ~ (czas przeszły)",
    "od ~ do ~ (časový nebo místní rozsah)|从~到~（时间、地点范围）|從~到~（時間、地點範圍）|from ~ to ~ (range of time or place)|de ~ à ~ (durée ou distance)|von ~ bis ~ (Zeit- oder Ortsspanne)|~-tól/-től ~-ig (idő- vagy térbeli tartomány)|dari ~ sampai ~ (rentang waktu atau tempat)|~から~まで（時間・場所の範囲）|od ~ do ~ (zakres czasu lub miejsca)",
    "že? / viď? (ověřovací otázka)|对吧？是不是？（确认疑问句）|對吧？是不是？（確認疑問句）|right? / isn't it? (confirmation question)|n'est-ce pas ? (question de confirmation)|nicht wahr? / oder? (Bestätigungsfrage)|ugye? (megerősítő kérdés)|bukan? / kan? (pertanyaan konfirmasi)|~でしょう？ ~ですよね？（確認の疑問文）|prawda? / nieprawdaż? (pytanie potwierdzające)",
    "potřebovat ~ / muset ~|需要~，应该~|需要~，應該~|to need ~ / to have to ~|avoir besoin de ~ / devoir ~|~ brauchen / ~ müssen|szüksége van ~ra / kell ~|perlu ~ / harus ~|~が必要だ、~しなければならない|potrzebować ~ / musieć ~",
    "muset ~ (povinnost, nutnost)|必须~（义务、应当）|必須~（義務、應當）|must ~ (obligation, duty)|devoir ~ (obligation)|~ müssen (Pflicht, Notwendigkeit)|kell ~ (kötelesség, szükségszerűség)|harus ~ (kewajiban, keharusan)|必ず~しなければならない（義務・当為）|musieć ~ (obowiązek, konieczność)",
    "je nutné ~ / musí se ~ (důraz)|必须要~，有必要~（强调）|必須要~，有必要~（強調）|really must ~ / need to ~ (emphatic)|il faut absolument ~ (insistance)|unbedingt ~ müssen (Betonung)|feltétlenül ~ kell (nyomatékos)|benar-benar harus ~ / perlu ~ (penegasan)|~しなければならない、~する必要がある（強調）|koniecznie trzeba ~ (z naciskiem)",
    "ne~! (zákaz, rada)|别~，不要~（禁止、劝告）|別~，不要~（禁止、勸告）|don't ~ (prohibition, advice)|ne ~ pas ! (interdiction, conseil)|~ nicht! (Verbot, Rat)|ne ~! (tiltás, tanács)|jangan ~ (larangan, nasihat)|~するな、~しないで（禁止・勧告）|nie ~! (zakaz, rada)",
    "nesmí se ~ (zákaz, nepovoleno)|不可以~，不得~（禁止、不允许）|不可以~，不得~（禁止、不允許）|must not ~ / not allowed to ~ (prohibition)|il est interdit de ~ (défense)|~ darf man nicht (Verbot, nicht erlaubt)|nem szabad ~ (tiltás, nem engedélyezett)|tidak boleh ~ (larangan, tidak diizinkan)|~してはいけない（禁止・不許可）|nie wolno ~ (zakaz, brak zgody)",
    "když ~ (časová podmínka)|当~的时候（时间条件）|當~的時候（時間條件）|when ~ (time condition)|quand ~ (condition temporelle)|wenn / als ~ (zeitliche Bedingung)|amikor ~ (időbeli feltétel)|ketika ~ / saat ~ (syarat waktu)|~するとき（時の条件）|kiedy ~ (warunek czasowy)",
    "kdy ~? (tázací slovo)|什么时候~？（疑问词）|什麼時候~？（疑問詞）|when ~? (question word)|quand ~ ? (mot interrogatif)|wann ~? (Fragewort)|mikor ~? (kérdőszó)|kapan ~? (kata tanya)|いつ~しますか？（疑問詞）|kiedy ~? (słowo pytające)",
    "~, prosím / udělej ~ (výzva, rozkaz)|请~，~吧（劝诱、命令）|請~，~吧（勸誘、命令）|please ~ / do ~ (suggestion, command)|~, s'il vous plaît / fais ~ (invitation, ordre)|bitte ~ / mach ~ (Aufforderung, Befehl)|kérem, ~ / ~-j! (felszólítás, parancs)|silakan ~ / ~lah (ajakan, perintah)|~してください、~しなさい（勧誘・命令）|proszę ~ / zrób ~ (zachęta, polecenie)",
    "prosím, buďte tak laskav ~ (zdvořilá žádost)|拜托，请~（礼貌的请求）|拜託，請~（禮貌的請求）|please, kindly ~ (polite request)|s'il vous plaît, veuillez ~ (demande polie)|bitte, seien Sie so freundlich ~ (höfliche Bitte)|kérem, legyen szíves ~ (udvarias kérés)|tolong, mohon ~ (permintaan sopan)|お願いします、どうか~してください（丁寧な依頼）|proszę, bądź tak miły ~ (uprzejma prośba)",
    "jestliže ~, pak ... (podmínková věta)|如果~，就…（条件句）|如果~，就…（條件句）|if ~, then ... (conditional)|si ~, alors ... (proposition conditionnelle)|wenn ~, dann ... (Bedingungssatz)|ha ~, akkor ... (feltételes mondat)|jika ~, maka ... (kalimat bersyarat)|もし~なら…する（条件文）|jeśli ~, to ... (zdanie warunkowe)",
    "~ a zároveň ... (současné děje)|一边~一边…，既~又…（同时动作）|一邊~一邊…，既~又…（同時動作）|both ~ and ... / ~ while ... (simultaneous actions)|à la fois ~ et ... (actions simultanées)|~ und gleichzeitig ... (gleichzeitige Handlungen)|~ is, ... is / miközben ~ (egyidejű cselekvés)|sambil ~ ... / ~ sekaligus ... (tindakan bersamaan)|~しながら…する（同時動作）|~ i jednocześnie ... (czynności równoczesne)",
    "čím více ~, tím více ... (postupná změna)|越~越…（逐渐变化）|越~越…（逐漸變化）|the more ~, the more ... (gradual change)|plus ~, plus ... (changement progressif)|je mehr ~, desto mehr ... (allmähliche Veränderung)|minél inkább ~, annál inkább ... (fokozatos változás)|semakin ~ semakin ... (perubahan bertahap)|~するほど、ますます…（漸進的変化）|im bardziej ~, tym bardziej ... (stopniowa zmiana)",
]

_EXAMPLES = {
    (0, 0): "Toto ovoce je pomeranč.|这个水果是橙子。|這個水果是柳橙。|This fruit is an orange.|Ce fruit est une orange.|Diese Frucht ist eine Orange.|Ez a gyümölcs narancs.|Buah ini adalah jeruk.|この果物はオレンジです。|Ten owoc to pomarańcza.",
    (0, 1): "Jaký máš koníček?|你的爱好是什么？|你的愛好是什麼？|What is your hobby?|Quel est ton passe-temps ?|Was ist dein Hobby?|Mi a hobbid?|Apa hobimu?|君の趣味は何？|Jakie masz hobby?",
    (0, 2): "Bratr Se-ho je Korejec.|世浩哥是韩国人。|世浩哥是韓國人。|Brother Se-ho is Korean.|Se-ho est coréen.|Se-ho ist Koreaner.|Se-ho koreai.|Kak Se-ho adalah orang Korea.|セホさんは韓国人です。|Se-ho jest Koreańczykiem.",
    (1, 0): "Kde bydlíš?|你住在哪里？|你住在哪裡？|Where do you live?|Où habites-tu ?|Wo wohnst du?|Hol laksz?|Kamu tinggal di mana?|どこに住んでいるの？|Gdzie mieszkasz?",
    (1, 1): "Bydlím v ulici Hai Bà Trưng.|我住在二征夫人街。|我住在二徵夫人街。|I live on Hai Ba Trung Street.|J'habite rue Hai Bà Trưng.|Ich wohne in der Hai-Bà-Trưng-Straße.|A Hai Bà Trưng utcában lakom.|Saya tinggal di Jalan Hai Bà Trưng.|ハイバーチュン通りに住んでいます。|Mieszkam przy ulicy Hai Bà Trưng.",
    (2, 0): "Hùng už jedl.|阿雄已经吃过饭了。|阿雄已經吃過飯了。|Hùng has already eaten.|Hùng a déjà mangé.|Hùng hat schon gegessen.|Hùng már evett.|Hùng sudah makan.|フンはもうご飯を食べました。|Hùng już zjadł.",
    (2, 1): "Loni jsem přijel do Vietnamu.|我去年来到了越南。|我去年來到了越南。|I came to Vietnam last year.|Je suis venu au Vietnam l'année dernière.|Ich bin letztes Jahr nach Vietnam gekommen.|Tavaly jöttem Vietnámba.|Saya datang ke Vietnam tahun lalu.|私は去年ベトナムに来ました。|Przyjechałem do Wietnamu w zeszłym roku.",
    (3, 0): "Učím se vietnamsky od 8 do 10 hodin.|我从8点到10点学越南语。|我從8點到10點學越南語。|I study Vietnamese from 8 to 10 o'clock.|J'étudie le vietnamien de 8 h à 10 h.|Ich lerne von 8 bis 10 Uhr Vietnamesisch.|8-tól 10 óráig vietnámiul tanulok.|Saya belajar bahasa Vietnam dari jam 8 sampai jam 10.|私は8時から10時までベトナム語を勉強します。|Uczę się wietnamskiego od 8 do 10.",
    (3, 1): "Z Hanoje do Haiphongu to trvá dvě hodiny.|从河内到海防要两个小时。|從河內到海防要兩個小時。|It takes two hours from Hanoi to Hai Phong.|Il faut deux heures de Hanoï à Hai Phong.|Von Hanoi nach Hai Phong dauert es zwei Stunden.|Hanoiból Hai Phongba két óra az út.|Dari Hanoi ke Hai Phong memakan waktu dua jam.|ハノイからハイフォンまで2時間かかります。|Z Hanoi do Hai Phong jedzie się dwie godziny.",
    (4, 0): "Ty jsi Vietnamec, že?|你是越南人，对吧？|你是越南人，對吧？|You're Vietnamese, aren't you?|Tu es vietnamien, n'est-ce pas ?|Du bist Vietnamese, oder?|Te vietnámi vagy, ugye?|Kakak orang Vietnam, bukan?|あなたはベトナム人ですよね？|Jesteś Wietnamczykiem, prawda?",
    (4, 1): "Bratr Se-ho je Korejec, viď?|世浩哥是韩国人，对吧？|世浩哥是韓國人，對吧？|Brother Se-ho is Korean, right?|Se-ho est coréen, c'est bien ça ?|Se-ho ist Koreaner, stimmt's?|Se-ho koreai, igaz?|Kak Se-ho orang Korea, benar kan?|セホさんは韓国人ですよね？|Se-ho jest Koreańczykiem, zgadza się?",
    (5, 0): "Na co se potřebuješ zeptat?|你需要问什么？|你需要問什麼？|What do you need to ask?|Qu'as-tu besoin de demander ?|Was musst du fragen?|Mit kell megkérdezned?|Apa yang perlu kamu tanyakan?|何を聞く必要があるの？|O co musisz zapytać?",
    (5, 1): "Potřebuji se na tuto věc zeptat.|我需要问一下这件事。|我需要問一下這件事。|I need to ask about this.|J'ai besoin de poser une question à ce sujet.|Ich muss nach dieser Sache fragen.|Erről meg kell kérdeznem valamit.|Aku perlu menanyakan hal ini.|このことを聞く必要があるんだ。|Muszę zapytać o tę sprawę.",
    (6, 0): "Dnes musím do práce.|今天我得去上班。|今天我得去上班。|Today I have to go to work.|Aujourd'hui, je dois aller travailler.|Heute muss ich zur Arbeit gehen.|Ma dolgozni kell mennem.|Hari ini saya harus pergi bekerja.|今日、私は仕事に行かなければなりません。|Dzisiaj muszę iść do pracy.",
    (6, 1): "Musíme dbát na bezpečnost.|我们必须注意安全。|我們必須注意安全。|We must pay attention to safety.|Nous devons faire attention à la sécurité.|Wir müssen auf Sicherheit achten.|Oda kell figyelnünk a biztonságra.|Kita harus memperhatikan keselamatan.|私たちは安全に注意しなければなりません。|Musimy dbać o bezpieczeństwo.",
    (7, 0): "Musíš se připravit předem.|你必须提前准备。|你必須提前準備。|You really need to prepare in advance.|Tu dois absolument te préparer à l'avance.|Du musst dich unbedingt vorher vorbereiten.|Feltétlenül előre fel kell készülnöd.|Kamu harus bersiap lebih dulu.|前もって準備しなければならないよ。|Koniecznie musisz się wcześniej przygotować.",
    (7, 1): "Musíme chránit životní prostředí.|我们必须保护环境。|我們必須保護環境。|We must protect the environment.|Nous devons protéger l'environnement.|Wir müssen die Umwelt schützen.|Védenünk kell a környezetet.|Kita harus melindungi lingkungan.|私たちは環境を守らなければなりません。|Musimy chronić środowisko.",
    (8, 0): "Neboj se.|别担心。|別擔心。|Don't worry.|Ne t'inquiète pas.|Mach dir keine Sorgen.|Ne aggódj.|Jangan khawatir.|心配しないで。|Nie martw się.",
    (8, 1): "Nepijte příliš mnoho studené vody.|别喝太多冷水。|別喝太多冷水。|Don't drink too much cold water.|Ne buvez pas trop d'eau froide.|Trinken Sie nicht zu viel kaltes Wasser.|Ne igyon túl sok hideg vizet.|Jangan minum air dingin terlalu banyak.|冷たい水を飲みすぎないでください。|Nie pij za dużo zimnej wody.",
    (9, 0): "Zde se nesmí kouřit.|这里不可以吸烟。|這裡不可以吸菸。|Smoking is not allowed here.|Il est interdit de fumer ici.|Hier darf man nicht rauchen.|Itt tilos dohányozni.|Dilarang merokok di sini.|ここでたばこを吸ってはいけません。|Tutaj nie wolno palić.",
    (9, 1): "Žáci nesmějí chodit pozdě.|学生不可以迟到。|學生不可以遲到。|Students must not be late.|Les élèves ne doivent pas arriver en retard.|Schüler dürfen nicht zu spät kommen.|A diákok nem késhetnek.|Siswa tidak boleh terlambat.|学生は遅刻してはいけません。|Uczniom nie wolno się spóźniać.",
    (10, 0): "Čím obvykle jezdíš do práce?|你上班的时候通常坐什么去？|你上班的時候通常搭什麼去？|What do you usually take to go to work?|Comment vas-tu d'habitude au travail ?|Womit fährst du normalerweise zur Arbeit?|Mivel jársz általában dolgozni?|Kakak biasanya naik apa kalau pergi bekerja?|仕事に行くとき、普段何で行きますか？|Czym zwykle jeździsz do pracy?",
    (10, 1): "Když mám volno, obvykle čtu knihy.|有空的时候我通常看书。|有空的時候我通常看書。|When I'm free, I usually read books.|Quand je suis libre, je lis souvent.|Wenn ich frei habe, lese ich meistens Bücher.|Amikor ráérek, általában olvasok.|Kalau senggang, saya biasanya membaca buku.|暇なとき、私はたいてい本を読みます。|Kiedy mam wolne, zwykle czytam książki.",
    (11, 0): "Kdy se vracíš domů do své země?|你什么时候回国？|你什麼時候回國？|When are you going back to your country?|Quand rentres-tu dans ton pays ?|Wann kehrst du in dein Land zurück?|Mikor mész haza a hazádba?|Kapan kakak pulang ke negara asal?|いつ帰国しますか？|Kiedy wracasz do kraju?",
    (11, 1): "Kdy jsi začala studovat vietnamštinu?|你什么时候开始学越南语的？|你什麼時候開始學越南語的？|When did you start learning Vietnamese?|Quand as-tu commencé à apprendre le vietnamien ?|Wann hast du angefangen, Vietnamesisch zu lernen?|Mikor kezdtél vietnámiul tanulni?|Kapan kakak mulai belajar bahasa Vietnam?|いつベトナム語の勉強を始めましたか？|Kiedy zaczęłaś uczyć się wietnamskiego?",
    (12, 0): "Pojďte dál do domu.|快请进屋吧。|快請進屋吧。|Please come on into the house.|Entrez donc dans la maison.|Kommen Sie doch herein.|Jöjjön be a házba.|Silakan masuk ke rumah.|さあ、家に入ってください。|Proszę, wejdź do domu.",
    (12, 1): "Snaž se, vydrž!|加油吧！|加油吧！|Hang in there, keep trying!|Courage, fais de ton mieux !|Streng dich an, gib nicht auf!|Hajrá, igyekezz!|Ayo, semangat berusaha!|頑張ってください。|Trzymaj się, staraj się dalej!",
    (13, 0): "Ukažte mi prosím jídelní lístek.|请给我看一下菜单。|請給我看一下菜單。|Please let me see the menu.|Montrez-moi le menu, s'il vous plaît.|Zeigen Sie mir bitte die Speisekarte.|Kérem, mutassa meg az étlapot.|Tolong perlihatkan menunya kepada saya.|メニューを見せてください。|Proszę pokazać mi menu.",
    (13, 1): "Promiňte, mluvte prosím trochu pomaleji.|不好意思，请说慢一点。|不好意思，請說慢一點。|Excuse me, please speak a little more slowly.|Excusez-moi, parlez un peu plus lentement, s'il vous plaît.|Entschuldigung, sprechen Sie bitte etwas langsamer.|Elnézést, kérem, beszéljen egy kicsit lassabban.|Maaf, tolong bicara sedikit lebih pelan.|すみませんが、もう少しゆっくり話してください。|Przepraszam, proszę mówić trochę wolniej.",
    (14, 0): "Když si vezmeš 2 kila, slevím ti 20 tisíc.|如果你买2公斤，我就给你便宜2万。|如果你買2公斤，我就算你便宜2萬。|If you take 2 kilos, I'll give you 20,000 off.|Si tu en prends 2 kilos, je te fais 20 000 de réduction.|Wenn du 2 Kilo nimmst, gebe ich dir 20.000 Rabatt.|Ha 2 kilót veszel, engedek neked 20 ezret.|Kalau kamu ambil 2 kilo, saya kurangi 20 ribu.|2キロ買うなら、2万ドン負けてあげるよ。|Jeśli weźmiesz 2 kilo, opuszczę ci 20 tysięcy.",
    (14, 1): "Jestli zítra bude pršet, zůstaneme doma.|如果明天下雨，我们就待在家里。|如果明天下雨，我們就待在家裡。|If it rains tomorrow, we'll stay home.|S'il pleut demain, nous resterons à la maison.|Wenn es morgen regnet, bleiben wir zu Hause.|Ha holnap esik, otthon maradunk.|Kalau besok hujan, kita di rumah saja.|もし明日雨なら、家にいよう。|Jeśli jutro będzie padać, zostaniemy w domu.",
    (15, 0): "Poslouchá hudbu a zároveň vaří.|他一边听音乐一边做饭。|他一邊聽音樂一邊做飯。|He cooks while listening to music.|Il cuisine tout en écoutant de la musique.|Er kocht und hört dabei Musik.|Zenét hallgat, miközben főz.|Dia memasak sambil mendengarkan musik.|彼は音楽を聴きながら料理をします。|On słucha muzyki i jednocześnie gotuje.",
    (15, 1): "Toto jídlo je chutné a zároveň levné.|这道菜既好吃又便宜。|這道菜既好吃又便宜。|This dish is both tasty and cheap.|Ce plat est à la fois bon et pas cher.|Dieses Gericht ist lecker und zugleich günstig.|Ez az étel finom is, olcsó is.|Makanan ini enak sekaligus murah.|この料理はおいしくて安いです。|To danie jest i smaczne, i tanie.",
    (16, 0): "Mám pocit, že čím víc se učím vietnamsky, tím je to zajímavější.|我觉得越南语越学越有意思。|我覺得越南語越學越有意思。|I find that the more I study Vietnamese, the more interesting it gets.|Je trouve que plus j'apprends le vietnamien, plus c'est intéressant.|Ich finde, je mehr ich Vietnamesisch lerne, desto interessanter wird es.|Úgy érzem, minél többet tanulom a vietnámit, annál érdekesebb.|Saya merasa semakin belajar bahasa Vietnam semakin menarik.|ベトナム語は勉強するほど面白くなると感じます。|Czuję, że im więcej uczę się wietnamskiego, tym jest ciekawszy.",
    (16, 1): "Čím víc se blíží odpoledne, tím je chladněji.|越到下午天越冷。|越到下午天越冷。|The later it gets in the afternoon, the colder it becomes.|Plus l'après-midi avance, plus il fait froid.|Je weiter der Nachmittag voranschreitet, desto kälter wird es.|Minél inkább közeledik a délután, annál hidegebb van.|Semakin sore, udara semakin dingin.|午後になるほど、だんだん寒くなります。|Im bliżej popołudnia, tym robi się zimniej.",
}


def _row(text):
    vals = text.split("|")
    assert len(vals) == len(A1A2_AI_LANGS), text
    return dict(zip(A1A2_AI_LANGS, vals))


def apply_a1a2_ai_translations(patterns):
    out = copy.deepcopy(patterns)
    for pi, pat in enumerate(out):
        pat["meaning"] = dict({"ko": pat.get("meaningKo", "")}, **_row(_MEANINGS[pi]))
        for ei, ex in enumerate(pat.get("examples", [])):
            row = _EXAMPLES.get((pi, ei))
            ex["tr"] = dict({"ko": ex.get("ko", "")}, **(_row(row) if row else {}))
        pat["aiLangs"] = list(A1A2_AI_LANGS)
    return out
