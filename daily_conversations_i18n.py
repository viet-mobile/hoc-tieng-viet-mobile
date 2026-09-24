# -*- coding: utf-8 -*-
"""AI-generated translations for [대화] > [일상 생활] (DAILY_CONVERSATIONS / DAILY_PHRASE_BANK).

daily_conversations_data.py is the source and carries vi/ko/zh/en/ja. This file adds only the
languages it never had (DAILY_AI_LANGS). apply_daily_ai_translations() fills a key only when the
source record lacks it -- existing text is never overwritten -- and tags every conversation with
`aiLangs` so generated text stays distinguishable from the source. Vietnamese is never touched,
so the [첫만남] pronoun adaptation (applyDailyPronouns in app_logic.js) keeps working on `vi`.

Keys: titles by conversation id; turns/vocab by "<conversation id>#<index>"; speakers by who.vi.
"""

import copy

DAILY_AI_LANGS = ["cs", "zh_cn", "fr", "de", "hu", "id", "pl"]

DAILY_AI_TITLES = {
  "daily-01": {
    "cs": "Pozdrav a otázka, jak se máš",
    "zh_cn": "问候与寒暄",
    "fr": "Salutations et prendre des nouvelles",
    "de": "Begrüßung und Nachfragen",
    "hu": "Köszönés és érdeklődés",
    "id": "Salam dan menanyakan kabar",
    "pl": "Powitanie i pytanie o samopoczucie"
  },
  "daily-02": {
    "cs": "Ptát se na jméno a představit se",
    "zh_cn": "询问与介绍名字",
    "fr": "Demander et dire son nom",
    "de": "Nach dem Namen fragen und sich vorstellen",
    "hu": "Név kérdezése és bemutatkozás",
    "id": "Menanyakan dan menyebutkan nama",
    "pl": "Pytanie o imię i przedstawianie się"
  },
  "daily-03": {
    "cs": "Představení mladší sestry a prosba o zopakování",
    "zh_cn": "介绍妹妹与请对方重复",
    "fr": "Présenter sa petite sœur et demander de répéter",
    "de": "Die jüngere Schwester vorstellen und um Wiederholung bitten",
    "hu": "A húg bemutatása és ismétlés kérése",
    "id": "Memperkenalkan adik perempuan dan meminta mengulang",
    "pl": "Przedstawienie młodszej siostry i prośba o powtórzenie"
  },
  "daily-04": {
    "cs": "Otázka na národnost a pochvala",
    "zh_cn": "询问国籍与称赞",
    "fr": "Demander la nationalité et faire un compliment",
    "de": "Nach der Nationalität fragen und loben",
    "hu": "Nemzetiség kérdezése és dicséret",
    "id": "Menanyakan kewarganegaraan dan memuji",
    "pl": "Pytanie o narodowość i komplementy"
  },
  "daily-05": {
    "cs": "Otázka, kde bydlíš",
    "zh_cn": "询问住处与生活情况",
    "fr": "Demander où l'on habite",
    "de": "Fragen, wo man wohnt",
    "hu": "Lakóhely kérdezése",
    "id": "Menanyakan tempat tinggal",
    "pl": "Pytanie, gdzie mieszkasz"
  },
  "daily-06": {
    "cs": "Pochvala vzhledu a otázka na věk",
    "zh_cn": "称赞外貌与询问年龄",
    "fr": "Complimenter et demander l'âge",
    "de": "Aussehen loben und nach dem Alter fragen",
    "hu": "Külső dicsérete és kor kérdezése",
    "id": "Memuji penampilan dan menanyakan umur",
    "pl": "Komplement wyglądu i pytanie o wiek"
  },
  "daily-07": {
    "cs": "Otázka na čas a domluva na kino",
    "zh_cn": "询问时间与约看电影",
    "fr": "Demander l'heure et proposer un film",
    "de": "Nach der Uhrzeit fragen und einen Kinobesuch planen",
    "hu": "Idő kérdezése és mozi megbeszélése",
    "id": "Menanyakan jam dan janji menonton film",
    "pl": "Pytanie o godzinę i umawianie się do kina"
  },
  "daily-08": {
    "cs": "Nákup ovoce a otázka na cenu",
    "zh_cn": "买水果与询问价格",
    "fr": "Acheter des fruits et demander le prix",
    "de": "Obst kaufen und nach dem Preis fragen",
    "hu": "Gyümölcsvásárlás és árérdeklődés",
    "id": "Membeli buah dan menanyakan harga",
    "pl": "Kupowanie owoców i pytanie o cenę"
  },
  "daily-09": {
    "cs": "Nákup klobouku a smlouvání",
    "zh_cn": "买帽子与讨价还价",
    "fr": "Acheter un chapeau et marchander",
    "de": "Einen Hut kaufen und handeln",
    "hu": "Kalapvásárlás és alkudozás",
    "id": "Membeli topi dan menawar",
    "pl": "Kupowanie kapelusza i targowanie się"
  },
  "daily-10": {
    "cs": "Pozvání na pho, když má někdo hlad",
    "zh_cn": "饿了时邀请去吃河粉",
    "fr": "Inviter à manger un pho quand on a faim",
    "de": "Zum Pho-Essen einladen, wenn man Hunger hat",
    "hu": "Meghívás phóra, amikor éhes valaki",
    "id": "Mengajak makan pho saat lapar",
    "pl": "Zaproszenie na pho, gdy ktoś jest głodny"
  },
  "daily-11": {
    "cs": "Prohlížení jídelního lístku a objednávání",
    "zh_cn": "看菜单与点菜",
    "fr": "Consulter le menu et commander",
    "de": "Die Speisekarte ansehen und bestellen",
    "hu": "Az étlap megnézése és rendelés",
    "id": "Melihat menu dan memesan",
    "pl": "Przeglądanie menu i zamawianie"
  },
  "daily-12": {
    "cs": "Každodenní dopravní prostředky do práce",
    "zh_cn": "每天上班的交通工具",
    "fr": "Les moyens de transport quotidiens pour aller au travail",
    "de": "Tägliche Verkehrsmittel zur Arbeit",
    "hu": "Napi közlekedés a munkába",
    "id": "Transportasi harian ke tempat kerja",
    "pl": "Codzienne środki transportu do pracy"
  },
  "daily-13": {
    "cs": "Učení se jezdit na motorce",
    "zh_cn": "学骑摩托车",
    "fr": "Apprendre à conduire un scooter",
    "de": "Motorrollerfahren lernen",
    "hu": "Motorozás tanulása",
    "id": "Belajar mengendarai sepeda motor",
    "pl": "Nauka jazdy na skuterze"
  },
  "daily-14": {
    "cs": "Koníčky a fotbal",
    "zh_cn": "爱好与足球",
    "fr": "Loisirs et football",
    "de": "Hobbys und Fußball",
    "hu": "Hobbik és foci",
    "id": "Hobi dan sepak bola",
    "pl": "Hobby i piłka nożna"
  },
  "daily-15": {
    "cs": "Volný čas a filmy",
    "zh_cn": "空闲时间与电影",
    "fr": "Temps libre et films",
    "de": "Freizeit und Filme",
    "hu": "Szabadidő és filmek",
    "id": "Waktu luang dan film",
    "pl": "Czas wolny i filmy"
  },
  "daily-16": {
    "cs": "Hodina vietnamštiny a otázky k testu",
    "zh_cn": "越南语课与考试问题",
    "fr": "Cours de vietnamien et questions d'examen",
    "de": "Vietnamesischunterricht und Prüfungsfragen",
    "hu": "Vietnámóra és vizsgakérdések",
    "id": "Kelas bahasa Vietnam dan pertanyaan ujian",
    "pl": "Lekcja wietnamskiego i pytania o sprawdzian"
  },
  "daily-17": {
    "cs": "Vysokoškolský obor a dojmy z učení se jazyku",
    "zh_cn": "大学专业与学语言的感受",
    "fr": "Spécialité universitaire et impressions sur l'apprentissage des langues",
    "de": "Studienfach und Eindrücke vom Sprachenlernen",
    "hu": "Egyetemi szak és a nyelvtanulás élményei",
    "id": "Jurusan kuliah dan kesan belajar bahasa",
    "pl": "Kierunek studiów i wrażenia z nauki języka"
  },
  "daily-18": {
    "cs": "Dnešní počasí a oblíbené roční období",
    "zh_cn": "今天的天气与喜欢的季节",
    "fr": "La météo du jour et la saison préférée",
    "de": "Das heutige Wetter und die Lieblingsjahreszeit",
    "hu": "A mai időjárás és a kedvenc évszak",
    "id": "Cuaca hari ini dan musim favorit",
    "pl": "Dzisiejsza pogoda i ulubiona pora roku"
  },
  "daily-19": {
    "cs": "Podnebí v Hanoji a v Ho Či Minově Městě",
    "zh_cn": "河内与胡志明市的气候差异",
    "fr": "Le climat de Hanoï et de Hô Chi Minh-Ville",
    "de": "Das Klima in Hanoi und Ho-Chi-Minh-Stadt",
    "hu": "Hanoi és Ho Si Minh-város éghajlata",
    "id": "Iklim Hanoi dan Kota Ho Chi Minh",
    "pl": "Klimat Hanoi i Ho Chi Minh"
  },
  "daily-20": {
    "cs": "Otázka na zdraví při nachlazení",
    "zh_cn": "感冒时问候身体",
    "fr": "Prendre des nouvelles de quelqu'un d'enrhumé",
    "de": "Nach dem Befinden fragen, wenn jemand erkältet ist",
    "hu": "Érdeklődés az egészség felől megfázáskor",
    "id": "Menanyakan kesehatan saat masuk angin",
    "pl": "Pytanie o zdrowie przy przeziębieniu"
  },
  "daily-21": {
    "cs": "Vyšetření u lékaře",
    "zh_cn": "在诊所看病",
    "fr": "Consultation chez le médecin",
    "de": "Untersuchung in der Arztpraxis",
    "hu": "Orvosi vizsgálat a rendelőben",
    "id": "Pemeriksaan di klinik",
    "pl": "Badanie w przychodni"
  }
}

DAILY_AI_WHO = {
  "Minh": {
    "cs": "Minh",
    "zh_cn": "Minh",
    "fr": "Minh",
    "de": "Minh",
    "hu": "Minh",
    "id": "Minh",
    "pl": "Minh"
  },
  "Tuấn": {
    "cs": "Tuấn",
    "zh_cn": "Tuấn",
    "fr": "Tuấn",
    "de": "Tuấn",
    "hu": "Tuấn",
    "id": "Tuấn",
    "pl": "Tuấn"
  },
  "Trang": {
    "cs": "Trang",
    "zh_cn": "庄",
    "fr": "Trang",
    "de": "Trang",
    "hu": "Trang",
    "id": "Trang",
    "pl": "Trang"
  },
  "Thuý": {
    "cs": "Thuý",
    "zh_cn": "翠",
    "fr": "Thuý",
    "de": "Thuý",
    "hu": "Thuý",
    "id": "Thuý",
    "pl": "Thuý"
  },
  "Mi-na": {
    "cs": "Mina",
    "zh_cn": "美娜",
    "fr": "Mina",
    "de": "Mina",
    "hu": "Mina",
    "id": "Mina",
    "pl": "Mina"
  },
  "Người bán hoa quả": {
    "cs": "Prodejce ovoce",
    "zh_cn": "水果摊贩",
    "fr": "Vendeur de fruits",
    "de": "Obstverkäufer",
    "hu": "Gyümölcsárus",
    "id": "Penjual buah",
    "pl": "Sprzedawca owoców"
  },
  "Chủ cửa hàng": {
    "cs": "Majitel obchodu",
    "zh_cn": "店主",
    "fr": "Propriétaire du magasin",
    "de": "Ladenbesitzer",
    "hu": "Bolttulajdonos",
    "id": "Pemilik toko",
    "pl": "Właściciel sklepu"
  },
  "Người phục vụ": {
    "cs": "Obsluha",
    "zh_cn": "服务生",
    "fr": "Serveur",
    "de": "Bedienung",
    "hu": "Pincér",
    "id": "Pelayan",
    "pl": "Kelner"
  },
  "Lan": {
    "cs": "Lan",
    "zh_cn": "Lan",
    "fr": "Lan",
    "de": "Lan",
    "hu": "Lan",
    "id": "Lan",
    "pl": "Lan"
  },
  "Cô giáo": {
    "cs": "Učitelka",
    "zh_cn": "女老师",
    "fr": "Professeur",
    "de": "Lehrerin",
    "hu": "Tanárnő",
    "id": "Guru",
    "pl": "Nauczycielka"
  },
  "Bác sĩ": {
    "cs": "Lékař",
    "zh_cn": "医生",
    "fr": "Médecin",
    "de": "Arzt",
    "hu": "Orvos",
    "id": "Dokter",
    "pl": "Lekarz"
  }
}

DAILY_AI_TURNS = {
  "daily-01#0": {
    "cs": "Dobrý den, bratře.",
    "zh_cn": "你好，哥。",
    "fr": "Bonjour, frère.",
    "de": "Hallo, Bruder.",
    "hu": "Szia, testvér.",
    "id": "Halo, kakak.",
    "pl": "Cześć, bracie."
  },
  "daily-01#1": {
    "cs": "Ahoj. Jak se máš?",
    "zh_cn": "你好。你身体好吗？",
    "fr": "Bonjour. Comment vas-tu ?",
    "de": "Hallo. Wie geht es dir?",
    "hu": "Szia. Hogy vagy?",
    "id": "Halo. Apakah kamu sehat?",
    "pl": "Cześć. Jak się masz?"
  },
  "daily-01#2": {
    "cs": "Ano, mám se dobře. A jak se máš ty, bratře?",
    "zh_cn": "是的，我很好。那哥你身体好吗？",
    "fr": "Oui, je vais bien. Et vous, frère, comment allez-vous ?",
    "de": "Ja, mir geht es gut. Und wie geht es dir, Bruder?",
    "hu": "Igen, jól vagyok. És te hogy vagy, testvér?",
    "id": "Ya, saya sehat. Lalu bagaimana dengan kakak, apakah sehat?",
    "pl": "Tak, mam się dobrze. A jak ty się czujesz, bracie?"
  },
  "daily-01#3": {
    "cs": "Ano, také se mám dobře.",
    "zh_cn": "嗯，我也很好。",
    "fr": "Oui, je vais bien aussi.",
    "de": "Ja, mir geht es auch gut.",
    "hu": "Igen, én is jól vagyok.",
    "id": "Ya, saya juga sehat.",
    "pl": "Tak, ja też czuję się dobrze."
  },
  "daily-02#0": {
    "cs": "Dobrý den.",
    "zh_cn": "你好。",
    "fr": "Bonjour.",
    "de": "Guten Tag.",
    "hu": "Jó napot.",
    "id": "Halo.",
    "pl": "Dzień dobry."
  },
  "daily-02#1": {
    "cs": "Dobrý den. Promiňte, jak se jmenujete, sestro?",
    "zh_cn": "你好。请问你叫什么名字，姐？",
    "fr": "Bonjour. Excusez-moi, comment vous appelez-vous, sœur ?",
    "de": "Guten Tag. Entschuldigung, wie heißt du, Schwester?",
    "hu": "Jó napot. Elnézést, mi a neved, nővér?",
    "id": "Halo. Permisi, siapa nama kakak?",
    "pl": "Dzień dobry. Przepraszam, jak masz na imię, siostro?"
  },
  "daily-02#2": {
    "cs": "Jmenuji se Trang. Velmi ráda tě poznávám. Jak se jmenuješ ty, bratře?",
    "zh_cn": "我的名字是 Trang。很高兴认识你。哥哥叫什么名字？",
    "fr": "Je m'appelle Trang. Très heureuse de vous rencontrer. Quel est votre nom, frère ?",
    "de": "Mein Name ist Trang. Sehr erfreut, dich kennenzulernen. Wie heißt du, Bruder?",
    "hu": "A nevem Trang. Nagyon örülök, hogy megismerhetlek. Hogy hívnak, testvér?",
    "id": "Nama saya Trang. Senang sekali bertemu kakak. Siapa nama kakak?",
    "pl": "Mam na imię Trang. Bardzo miło cię poznać. Jak masz na imię, bracie?"
  },
  "daily-02#3": {
    "cs": "Jmenuji se Tuấn. Také mě velmi těší, sestro.",
    "zh_cn": "我叫 Tuấn。我也很高兴见到你，姐。",
    "fr": "Je m'appelle Tuấn. Moi aussi, je suis très heureux de vous rencontrer, sœur.",
    "de": "Ich heiße Tuấn. Ich freue mich auch sehr, Sie kennenzulernen, Schwester.",
    "hu": "Tuấnnak hívnak. Én is nagyon örülök, hogy találkoztunk, nővér.",
    "id": "Nama saya Tuan. Saya juga sangat senang bertemu dengan kakak.",
    "pl": "Mam na imię Tuấn. Mnie również jest bardzo miło panią poznać, siostro."
  },
  "daily-03#0": {
    "cs": "Bratře Tuáne, tohle je moje mladší sestra.",
    "zh_cn": "Tuấn 哥，这是我的妹妹。",
    "fr": "Frère Tuấn, voici ma petite sœur.",
    "de": "Bruder Tuấn, das ist meine jüngere Schwester.",
    "hu": "Tuấn testvér, ő a húgom.",
    "id": "Kak Tuấn, ini adik perempuan saya.",
    "pl": "Bracie Tuấn, to jest moja młodsza siostra."
  },
  "daily-03#1": {
    "cs": "Ahoj. Já jsem Tuấn.",
    "zh_cn": "你好。我是 Tuấn。",
    "fr": "Bonjour. Je suis Tuấn.",
    "de": "Hallo. Ich bin Tuấn.",
    "hu": "Szia. Én Tuấn vagyok.",
    "id": "Halo. Saya Tuấn.",
    "pl": "Cześć. Jestem Tuấn."
  },
  "daily-03#2": {
    "cs": "Promiňte, zopakujte to prosím.",
    "zh_cn": "不好意思，请再说一遍。",
    "fr": "Excusez-moi, pouvez-vous répéter s'il vous plaît ?",
    "de": "Entschuldigung, bitte wiederholen Sie es.",
    "hu": "Elnézést, kérem ismételje meg.",
    "id": "Maaf, tolong ulangi lagi.",
    "pl": "Przepraszam, proszę powtórzyć."
  },
  "daily-03#3": {
    "cs": "Jmenuji se Tuấn.",
    "zh_cn": "我的名字叫 Tuấn。",
    "fr": "Mon nom est Tuấn.",
    "de": "Mein Name ist Tuấn.",
    "hu": "A nevem Tuấn.",
    "id": "Nama saya Tuấn.",
    "pl": "Mam na imię Tuấn."
  },
  "daily-03#4": {
    "cs": "Aha, děkuji, bratře Tuáne. Jmenuji se Thuy.",
    "zh_cn": "啊，谢谢 Tuấn 哥。我叫 Thuý。",
    "fr": "Ah, merci, frère Tuấn. Je m'appelle Thuý.",
    "de": "Ah, danke, Bruder Tuấn. Mein Name ist Thuý.",
    "hu": "Ó, köszönöm, Tuấn testvér. A nevem Thuý.",
    "id": "Ah, terima kasih, kak Tuấn. Nama saya Thuý.",
    "pl": "Ach, dziękuję, bracie Tuấn. Mam na imię Thuý."
  },
  "daily-04#0": {
    "cs": "Z jaké země pocházíš?",
    "zh_cn": "你是哪国人？",
    "fr": "De quel pays viens-tu ?",
    "de": "Aus welchem Land kommst du?",
    "hu": "Melyik országból származol?",
    "id": "Dari negara mana kamu berasal?",
    "pl": "Z jakiego kraju pochodzisz?"
  },
  "daily-04#1": {
    "cs": "Jsem Vietnamka. Ty jsi také Vietnamec, že ano, bratře?",
    "zh_cn": "我是越南人。哥哥也是越南人，对吗？",
    "fr": "Je suis vietnamienne. Vous êtes aussi vietnamien, n'est-ce pas, frère ?",
    "de": "Ich bin Vietnamesin. Du bist auch Vietnamese, nicht wahr, Bruder?",
    "hu": "Vietnámi vagyok. Te is vietnámi vagy, ugye, testvér?",
    "id": "Saya orang Vietnam. Kakak juga orang Vietnam, kan?",
    "pl": "Jestem Wietnamką. Ty też jesteś Wietnamczykiem, prawda, bracie?"
  },
  "daily-04#2": {
    "cs": "Ne, nejsem. Jsem Korejec.",
    "zh_cn": "不是。我是韩国人。",
    "fr": "Non. Je suis coréen.",
    "de": "Nein. Ich bin Koreaner.",
    "hu": "Nem. Koreai vagyok.",
    "id": "Bukan. Saya orang Korea.",
    "pl": "Nie. Jestem Koreańczykiem."
  },
  "daily-04#3": {
    "cs": "Mluvíš vietnamsky moc dobře, bratře!",
    "zh_cn": "哥哥的越南语说得太好了！",
    "fr": "Vous parlez très bien vietnamien, frère !",
    "de": "Du sprichst sehr gut Vietnamesisch, Bruder!",
    "hu": "Nagyon jól beszélsz vietnámiul, testvér!",
    "id": "Kakak berbicara bahasa Vietnam dengan sangat baik!",
    "pl": "Mówisz po wietnamsku wspaniale, bracie!"
  },
  "daily-04#4": {
    "cs": "Děkuji ti.",
    "zh_cn": "谢谢你。",
    "fr": "Merci.",
    "de": "Danke dir.",
    "hu": "Köszönöm.",
    "id": "Terima kasih.",
    "pl": "Dziękuję ci."
  },
  "daily-05#0": {
    "cs": "Kde bydlíš?",
    "zh_cn": "你住在哪里？",
    "fr": "Où habites-tu ?",
    "de": "Wo wohnst du?",
    "hu": "Hol laksz?",
    "id": "Di mana kamu tinggal?",
    "pl": "Gdzie mieszkasz?"
  },
  "daily-05#1": {
    "cs": "Bydlím v ulici Hai Ba Trung. Kde je tvůj dům v Koreji, bratře?",
    "zh_cn": "我住在二征夫人街。在韩国，哥哥的家在哪里？",
    "fr": "J'habite rue Hai Ba Trung. En Corée, où est votre maison, frère ?",
    "de": "Ich wohne in der Hai-Ba-Trung-Straße. Wo ist dein Haus in Korea, Bruder?",
    "hu": "A Hai Ba Trung utcában élek. Koreában hol van a házad, testvér?",
    "id": "Saya tinggal di jalan Hai Ba Trung. Di Korea, di mana rumah kakak?",
    "pl": "Mieszkam przy ulicy Hai Ba Trung. W Korei gdzie jest twój dom, bracie?"
  },
  "daily-05#2": {
    "cs": "Můj dům je v Soulu. Ale protože pracuji pro korejskou firmu v Hanoji, pronajímám si dům zde.",
    "zh_cn": "我的家在首尔。但因为我在河内的韩国公司工作，所以在这里租了房子。",
    "fr": "Ma maison est à Séoul. Mais comme je travaille dans une entreprise coréenne à Hanoï, je loue une maison ici.",
    "de": "Mein Haus ist in Seoul. Da ich aber in einer koreanischen Firma in Hanoi arbeite, miete ich hier ein Haus.",
    "hu": "Szöulban van a házam. De mivel egy koreai cégnél dolgozom Hanoiban, itt bérelek házat.",
    "id": "Rumah saya di Seoul. Tapi karena saya bekerja di perusahaan Korea di Hanoi, saya menyewa rumah di sini.",
    "pl": "Mój dom jest w Seulu. Ale ponieważ pracuję w koreańskiej firmie w Hanoi, wynajmuję dom tutaj."
  },
  "daily-05#3": {
    "cs": "S kým bydlíš, bratře?",
    "zh_cn": "哥哥和谁住在一起？",
    "fr": "Avec qui habitez-vous, frère ?",
    "de": "Mit wem wohnst du, Bruder?",
    "hu": "Kivel élsz, testvér?",
    "id": "Kakak tinggal bersama siapa?",
    "pl": "Z kim mieszkasz, bracie?"
  },
  "daily-05#4": {
    "cs": "Bydlím se svou ženou, dcerou a synem.",
    "zh_cn": "我和妻子、一个女儿和一个儿子住在一起。",
    "fr": "J'habite avec ma femme, une fille et un fils.",
    "de": "Ich lebe mit meiner Frau, einer Tochter und einem Sohn.",
    "hu": "A feleségemmel, egy lányommal és egy fiammal élek.",
    "id": "Saya tinggal bersama istri, seorang anak perempuan, dan seorang anak laki-laki.",
    "pl": "Mieszkam z żoną, córką i synem."
  },
  "daily-06#0": {
    "cs": "Tohle je moje mladší sestra.",
    "zh_cn": "这是我的妹妹。",
    "fr": "Voici ma petite sœur.",
    "de": "Das ist meine jüngere Schwester.",
    "hu": "Ő a húgom.",
    "id": "Ini adik perempuan saya.",
    "pl": "To jest moja młodsza siostra."
  },
  "daily-06#1": {
    "cs": "Tvoje mladší sestra je opravdu moc hezká.",
    "zh_cn": "你的妹妹真漂亮啊。",
    "fr": "Ta petite sœur est vraiment très jolie.",
    "de": "Deine jüngere Schwester ist wirklich sehr hübsch.",
    "hu": "A húgod nagyon szép.",
    "id": "Adik perempuanmu cantik sekali ya.",
    "pl": "Twoja młodsza siostra jest naprawdę bardzo ładna."
  },
  "daily-06#2": {
    "cs": "Ano. Je krásná a zároveň chytrá.",
    "zh_cn": "是的。她既漂亮又聪明。",
    "fr": "Oui. Elle est à la fois belle et intelligente.",
    "de": "Ja. Sie ist sowohl hübsch als auch klug.",
    "hu": "Igen. Egyszerre szép és okos.",
    "id": "Ya. Dia cantik dan juga pintar.",
    "pl": "Tak. Jest ładna i mądra."
  },
  "daily-06#3": {
    "cs": "Kolik je jí let?",
    "zh_cn": "她多大了？",
    "fr": "Quel âge a-t-elle ?",
    "de": "Wie alt ist sie?",
    "hu": "Hány éves?",
    "id": "Berapa umurnya?",
    "pl": "Ile ona ma lat?"
  },
  "daily-06#4": {
    "cs": "Je jí dvacet let.",
    "zh_cn": "她二十岁。",
    "fr": "Elle a vingt ans.",
    "de": "Sie ist zwanzig Jahre alt.",
    "hu": "Húszéves.",
    "id": "Dia berumur dua puluh tahun.",
    "pl": "Ona ma dwadzieścia lat."
  },
  "daily-07#0": {
    "cs": "Můžeš se mnou jít dnes do kina, sestro?",
    "zh_cn": "今天姐姐能和我一起去看电影吗？",
    "fr": "Peux-tu aller au cinéma avec moi aujourd'hui, sœur ?",
    "de": "Kannst du heute mit mir ins Kino gehen, Schwester?",
    "hu": "Eljössz velem ma moziba, nővér?",
    "id": "Bisakah kakak pergi menonton film bersama saya hari ini?",
    "pl": "Czy możesz pójść ze mną dzisiaj do kina, siostro?"
  },
  "daily-07#1": {
    "cs": "Jistě! V kolik hodin půjdeme?",
    "zh_cn": "当然！我们几点去？",
    "fr": "Bien sûr ! À quelle heure partons-nous ?",
    "de": "Na klar! Um wie viel Uhr gehen wir?",
    "hu": "Persze! Hány órakor menjünk?",
    "id": "Tentu saja! Jam berapa kita pergi?",
    "pl": "Oczywiście! O której godzinie idziemy?"
  },
  "daily-07#2": {
    "cs": "Kolik je teď hodin?",
    "zh_cn": "现在几点？",
    "fr": "Quelle heure est-il maintenant ?",
    "de": "Wie spät ist es jetzt?",
    "hu": "Hány óra van most?",
    "id": "Sekarang jam berapa?",
    "pl": "Która jest teraz godzina?"
  },
  "daily-07#3": {
    "cs": "Teď jsou čtyři hodiny.",
    "zh_cn": "现在四点。",
    "fr": "Il est quatre heures maintenant.",
    "de": "Es ist jetzt vier Uhr.",
    "hu": "Most négy óra van.",
    "id": "Sekarang jam empat.",
    "pl": "Jest teraz czwarta godzina."
  },
  "daily-07#4": {
    "cs": "Pojďme za hodinu.",
    "zh_cn": "一个小时后再去吧。",
    "fr": "Partons dans une heure.",
    "de": "Gehen wir in einer Stunde.",
    "hu": "Menjünk egy óra múlva.",
    "id": "Ayo pergi satu jam lagi.",
    "pl": "Chodźmy za godzinę."
  },
  "daily-07#5": {
    "cs": "Dobře.",
    "zh_cn": "好的。",
    "fr": "D'accord.",
    "de": "In Ordnung.",
    "hu": "Rendben.",
    "id": "Baiklah.",
    "pl": "Dobrze."
  },
  "daily-08#0": {
    "cs": "Pane, co je tohle za ovoce?",
    "zh_cn": "大叔/哥哥，这是什么水果？",
    "fr": "Monsieur, quel fruit est-ce ?",
    "de": "Entschuldigung, was für eine Frucht ist das?",
    "hu": "Uram, ez milyen gyümölcs?",
    "id": "Bang, ini buah apa?",
    "pl": "Proszę pana, co to za owoc?"
  },
  "daily-08#1": {
    "cs": "Tohle je pomeranč.",
    "zh_cn": "这是橙子。",
    "fr": "C'est une orange.",
    "de": "Das ist eine Orange.",
    "hu": "Ez narancs.",
    "id": "Ini buah jeruk.",
    "pl": "To jest pomarańcza."
  },
  "daily-08#2": {
    "cs": "Kolik stojí kilo pomerančů?",
    "zh_cn": "一公斤橙子多少钱？",
    "fr": "Combien coûte un kilo d'oranges ?",
    "de": "Wie viel kostet ein Kilo Orangen?",
    "hu": "Mennyibe kerül egy kiló narancs?",
    "id": "Berapa harga satu kilogram jeruk?",
    "pl": "Ile kosztuje kilogram pomarańczy?"
  },
  "daily-08#3": {
    "cs": "60 tisíc dongů.",
    "zh_cn": "6万盾。",
    "fr": "60 000 dongs.",
    "de": "60.000 Dong.",
    "hu": "60 ezer dong.",
    "id": "60 ribu dong.",
    "pl": "60 tysięcy dongów."
  },
  "daily-08#4": {
    "cs": "Proč je to tak drahé?",
    "zh_cn": "怎么这么贵？",
    "fr": "Pourquoi est-ce si cher ?",
    "de": "Warum so teuer?",
    "hu": "Miért ilyen drága?",
    "id": "Kenapa mahal sekali?",
    "pl": "Dlaczego tak drogo?"
  },
  "daily-08#5": {
    "cs": "Není to drahé. Tyto pomeranče jsou velmi sladké.",
    "zh_cn": "不贵。这橙子很甜呢。",
    "fr": "Ce n'est pas cher. Ces oranges sont très douces.",
    "de": "Nicht teuer. Diese Orangen sind sehr süß.",
    "hu": "Nem drága. Ez a narancs nagyon édes.",
    "id": "Tidak mahal. Jeruk ini sangat manis.",
    "pl": "Niedrogo. Te pomarańcze są bardzo słodkie."
  },
  "daily-09#0": {
    "cs": "Paní, kolik stojí tato modrá čepice?",
    "zh_cn": "大姐，这顶蓝色的帽子多少钱？",
    "fr": "Madame, combien coûte ce chapeau bleu ?",
    "de": "Entschuldigung, wie viel kostet diese blaue Mütze?",
    "hu": "Hölgyem, mennyibe kerül ez a kék sapka?",
    "id": "Mbak, berapa harga topi biru ini?",
    "pl": "Proszę pani, ile kosztuje ta niebieska czapka?"
  },
  "daily-09#1": {
    "cs": "300 tisíc dongů.",
    "zh_cn": "30万盾。",
    "fr": "300 000 dongs.",
    "de": "300.000 Dong.",
    "hu": "300 ezer dong.",
    "id": "300 ribu dong.",
    "pl": "300 tysięcy dongów."
  },
  "daily-09#2": {
    "cs": "A kolik stojí tato černá čepice?",
    "zh_cn": "这顶黑色的帽子多少钱？",
    "fr": "Et ce chapeau noir coûte combien ?",
    "de": "Und wie viel kostet diese schwarze Mütze?",
    "hu": "És ez a fekete sapka mennyibe kerül?",
    "id": "Lalu topi hitam ini berapa harganya?",
    "pl": "A ile kosztuje ta czarna czapka?"
  },
  "daily-09#3": {
    "cs": "Ta také stojí 300 tisíc dongů.",
    "zh_cn": "那个也是30万盾。",
    "fr": "Celui-là coûte aussi 300 000 dongs.",
    "de": "Die kostet auch 300.000 Dong.",
    "hu": "Az is 300 ezer dong.",
    "id": "Yang itu juga 300 ribu dong.",
    "pl": "Ta również kosztuje 300 tysięcy dongów."
  },
  "daily-09#4": {
    "cs": "Koupím obě dvě čepice. Dejte mi prosím malou slevu.",
    "zh_cn": "我要买这两顶帽子。您给我便宜一点吧。",
    "fr": "Je vais acheter ces deux chapeaux. Faites-moi une petite réduction.",
    "de": "Ich nehme diese beiden Mützen. Geben Sie mir bitte etwas Rabatt.",
    "hu": "Megveszem ezt a két sapkát. Adjon egy kis kedvezményt.",
    "id": "Saya akan membeli dua topi ini. Beri sedikit diskon ya.",
    "pl": "Kupię te dwie czapki. Proszę dać mi mały rabat."
  },
  "daily-09#5": {
    "cs": "Ano. Slevím vám 50 tisíc dongů.",
    "zh_cn": "好的。我给你减5万盾吧。",
    "fr": "D'accord. Je vous retire 50 000 dongs.",
    "de": "Ja, ich ziehe Ihnen 50.000 Dong ab.",
    "hu": "Rendben. Elengedek 50 ezer dongot.",
    "id": "Baiklah. Saya kurangi 50 ribu dong untuk Anda.",
    "pl": "Dobrze. Opuszczę panu 50 tysięcy dongów."
  },
  "daily-10#0": {
    "cs": "Už jsi jedla, sestro?",
    "zh_cn": "姐，你吃饭了吗？",
    "fr": "As-tu déjà mangé, sœur ?",
    "de": "Hast du schon gegessen, Schwester?",
    "hu": "Ettél már, nővér?",
    "id": "Kakak sudah makan belum?",
    "pl": "Jadłaś już, siostro?"
  },
  "daily-10#1": {
    "cs": "Ještě ne. Mám takový hlad!",
    "zh_cn": "还没呢。我肚子好饿啊！",
    "fr": "Pas encore. J'ai tellement faim !",
    "de": "Noch nicht. Ich habe solchen Hunger!",
    "hu": "Még nem. Nagyon éhes vagyok!",
    "id": "Belum. Saya lapar sekali!",
    "pl": "Jeszcze nie. Jestem taka głodna!"
  },
  "daily-10#2": {
    "cs": "Já také. Znám jedno výborné bistro s pho. Dnes tě zvu na pho, sestro.",
    "zh_cn": "我也是。我知道一家很好吃的河粉店。今天我请姐姐去吃河粉吧。",
    "fr": "Moi aussi. Je connais un bon restaurant de phở. Aujourd'hui, je t'invite à manger du phở.",
    "de": "Ich auch. Ich kenne ein leckeres Phở-Lokal. Heute lade ich dich zum Phở-Essen ein.",
    "hu": "Én is. Ismerek egy finom phós helyet. Ma meghívlak egy phóra.",
    "id": "Saya juga. Saya tahu kedai pho yang enak. Hari ini saya traktir kakak makan pho ya.",
    "pl": "Ja też. Znam pyszną restaurację z pho. Dziś stawiam ci pho, siostro."
  },
  "daily-10#3": {
    "cs": "Skvělé! Děkuji ti. Pojďme.",
    "zh_cn": "好啊，太棒了！谢谢你。我们走吧。",
    "fr": "Super ! Merci beaucoup. Allons-y.",
    "de": "Klasse, wie schön! Danke dir. Gehen wir.",
    "hu": "Remek, de jó! Köszönöm. Menjünk.",
    "id": "Wah, asyik sekali! Terima kasih. Ayo kita pergi.",
    "pl": "Wspaniale! Dziękuję ci. Chodźmy."
  },
  "daily-11#0": {
    "cs": "Promiňte, ukažte mi prosím menu.",
    "zh_cn": "服务员，请给我看下菜单。",
    "fr": "S'il vous plaît, montrez-moi le menu.",
    "de": "Entschuldigung, zeigen Sie mir bitte die Speisekarte.",
    "hu": "Elnézést, kérem mutassa meg az étlapot.",
    "id": "Permisi, tolong lihat menunya.",
    "pl": "Przepraszam, proszę o menu."
  },
  "daily-11#1": {
    "cs": "Zde je. Prosím, podívejte se na menu.",
    "zh_cn": "给您。请看菜单。",
    "fr": "Le voici. Regardez le menu s'il vous plaît.",
    "de": "Hier bitte. Werfen Sie einen Blick auf die Speisekarte.",
    "hu": "Tessék. Kérem nézze meg az étlapot.",
    "id": "Ini dia. Silakan lihat menunya.",
    "pl": "Proszę bardzo. Oto menu."
  },
  "daily-11#2": {
    "cs": "Děkuji vám.",
    "zh_cn": "谢谢你。",
    "fr": "Merci.",
    "de": "Vielen Dank.",
    "hu": "Köszönöm.",
    "id": "Terima kasih.",
    "pl": "Dziękuję."
  },
  "daily-11#3": {
    "cs": "Co si dáte, pane?",
    "zh_cn": "请问您要用点什么？",
    "fr": "Que désirez-vous commander ?",
    "de": "Was möchten Sie gerne bestellen?",
    "hu": "Mit fogyasztana, uram?",
    "id": "Mau pesan apa, tuan?",
    "pl": "Co pan zamawia?"
  },
  "daily-11#4": {
    "cs": "Dejte mi jednu misku pho a talíř smažených jarních závitků.",
    "zh_cn": "请给我一碗河粉和一盘炸春卷。",
    "fr": "Donnez-moi un bol de phở et une assiette de nems frits.",
    "de": "Geben Sie mir bitte eine Schüssel Phở und einen Teller Frühlingsrollen.",
    "hu": "Kérek egy tál phót és egy tányér sült tavaszi tekercset.",
    "id": "Tolong beri saya semangkuk pho dan sepiring lumpia goreng.",
    "pl": "Poproszę miskę pho i talerz smażonych sajgonek."
  },
  "daily-11#5": {
    "cs": "Dáte si hovězí pho nebo kuřecí pho?",
    "zh_cn": "您要牛肉河粉还是鸡肉河粉？",
    "fr": "Prenez-vous du phở au bœuf ou au poulet ?",
    "de": "Möchten Sie Rindfleisch- oder Hühner-Phở?",
    "hu": "Marhahúsos vagy csirkehúsos phót kér?",
    "id": "Mau pho daging sapi atau pho ayam?",
    "pl": "Pho z wołowiną czy z kurczakiem?"
  },
  "daily-11#6": {
    "cs": "Dejte mi hovězí pho.",
    "zh_cn": "请给我牛肉河粉。",
    "fr": "Donnez-moi du phở au bœuf.",
    "de": "Geben Sie mir Rindfleisch-Phở.",
    "hu": "Marhahúsos phót kérek.",
    "id": "Beri saya pho daging sapi.",
    "pl": "Poproszę pho z wołowiną."
  },
  "daily-11#7": {
    "cs": "Co si dáte k pití?",
    "zh_cn": "您喝点什么？",
    "fr": "Que voulez-vous boire ?",
    "de": "Was möchten Sie trinken?",
    "hu": "Mit szeretne inni?",
    "id": "Mau minum apa?",
    "pl": "Czego chciałby się pan napić?"
  },
  "daily-11#8": {
    "cs": "Dejte mi sklenici ledového čaje.",
    "zh_cn": "请给我一杯冰茶。",
    "fr": "Donnez-moi un verre de thé glacé.",
    "de": "Geben Sie mir ein Glas Eistee.",
    "hu": "Kérek egy pohár jeges teát.",
    "id": "Beri saya segelas es teh.",
    "pl": "Poproszę szklankę mrożonej herbaty."
  },
  "daily-12#0": {
    "cs": "Čím obvykle jezdíte do práce, sestro?",
    "zh_cn": "去上班时，姐姐通常搭乘什么交通工具？",
    "fr": "Comment allez-vous d'habitude au travail, sœur ?",
    "de": "Womit fährst du gewöhnlich zur Arbeit, Schwester?",
    "hu": "Mivel szoktál munkába járni, nővér?",
    "id": "Saat berangkat kerja, biasanya kakak naik apa?",
    "pl": "Czym zazwyczaj dojeżdżasz do pracy, siostro?"
  },
  "daily-12#1": {
    "cs": "Obvykle jezdím na motorce.",
    "zh_cn": "我通常骑摩托车去。",
    "fr": "J'y vais d'habitude à moto.",
    "de": "Ich fahre gewöhnlich mit dem Motorrad.",
    "hu": "Általában motorkerékpárral járok.",
    "id": "Saya biasanya naik sepeda motor.",
    "pl": "Zazwyczaj jeżdżę motocyklem."
  },
  "daily-12#2": {
    "cs": "Nebojíte se jezdit na motorce?",
    "zh_cn": "姐姐骑摩托车不害怕吗？",
    "fr": "Tu n'as pas peur de conduire une moto ?",
    "de": "Hast du keine Angst, Motorrad zu fahren?",
    "hu": "Nem félsz motorkerékpárral járni?",
    "id": "Apakah kakak tidak takut naik sepeda motor?",
    "pl": "Nie boisz się jeździć motocyklem?"
  },
  "daily-12#3": {
    "cs": "Ani moc ne. Ve Vietnamu je motorka nejběžnějším dopravním prostředkem.",
    "zh_cn": "不太害怕。在越南，摩托车是最普及的出行工具。",
    "fr": "Pas tellement. Au Vietnam, la moto est le moyen de transport le plus courant.",
    "de": "Nicht wirklich. In Vietnam ist das Motorrad das beliebteste Fortbewegungsmittel.",
    "hu": "Nem annyira. Vietnámban a motorkerékpár a legelterjedtebb közlekedési eszköz.",
    "id": "Tidak terlalu takut. Di Vietnam sepeda motor adalah alat transportasi paling umum.",
    "pl": "Nieszczególnie. W Wietnamie motocykl to najbardziej popularny środek transportu."
  },
  "daily-13#0": {
    "cs": "Už jsi někdy jel na motorce?",
    "zh_cn": "你曾经骑过摩托车吗？",
    "fr": "Es-tu déjà monté sur une moto ?",
    "de": "Bist du schon mal Motorrad gefahren?",
    "hu": "Ültél már valaha motorkerékpáron?",
    "id": "Pernahkah kamu naik sepeda motor sebelumnya?",
    "pl": "Czy jechałeś kiedyś motocyklem?"
  },
  "daily-13#1": {
    "cs": "Ještě ne. Ale chci se naučit řídit. Je těžké naučit se řídit motorku, sestro?",
    "zh_cn": "还没呢。但我想学开。学骑摩托车难吗，姐姐？",
    "fr": "Pas encore. Mais je veux apprendre à conduire. Est-ce difficile d'apprendre, sœur ?",
    "de": "Noch nicht. Aber ich möchte fahren lernen. Ist es schwer, Motorradfahren zu lernen, Schwester?",
    "hu": "Még nem. De szeretnék megtanulni vezetni. Nehéz megtanulni, nővér?",
    "id": "Belum. Tapi saya ingin belajar mengemudi. Apakah sulit belajar mengendarai motor, kak?",
    "pl": "Jeszcze nie. Ale chcę się nauczyć. Czy trudno jest nauczyć się jeździć motocyklem, siostro?"
  },
  "daily-13#2": {
    "cs": "Není to moc těžké. Neměj obavy. Stačí se učit jeden den a hned budeš umět jezdit.",
    "zh_cn": "不太难。别担心。学一天就能马上骑了。",
    "fr": "Pas très difficile. Ne t'inquiète pas. En apprenant un jour, tu pourras rouler immédiatement.",
    "de": "Nicht besonders schwer. Mach dir keine Sorgen. Nach einem Tag Übung kannst du sofort fahren.",
    "hu": "Nem túl nehéz. Ne aggódj. Egy nap tanulás után már azonnal tudsz majd menni.",
    "id": "Tidak terlalu sulit. Jangan khawatir. Belajar satu hari saja langsung bisa mengendarainya.",
    "pl": "Niezbyt trudno. Nie martw się. Po jednym dniu nauki będziesz mógł od razu jeździć."
  },
  "daily-13#3": {
    "cs": "Tak mě to prosím nauč, sestro.",
    "zh_cn": "那姐姐教教我吧。",
    "fr": "Alors, apprends-moi s'il te plaît, sœur.",
    "de": "Dann bring es mir bitte bei, Schwester.",
    "hu": "Akkor taníts meg engem, kérlek, nővér.",
    "id": "Kalau begitu tolong ajari saya ya, kak.",
    "pl": "W takim razie naucz mnie, siostro."
  },
  "daily-13#4": {
    "cs": "Ano, klidně.",
    "zh_cn": "好啊，也可以。",
    "fr": "Oui, d'accord.",
    "de": "Ja, gerne.",
    "hu": "Igen, miért ne.",
    "id": "Ya, boleh saja.",
    "pl": "Tak, pewnie."
  },
  "daily-14#0": {
    "cs": "Jaký je tvůj koníček?",
    "zh_cn": "你的爱好是什么？",
    "fr": "Quel est ton passe-temps ?",
    "de": "Was ist dein Hobby?",
    "hu": "Mi a hobbid?",
    "id": "Apa hobimu?",
    "pl": "Jakie jest twoje hobby?"
  },
  "daily-14#1": {
    "cs": "Rád hraji fotbal. Ve volných dnech obvykle hraji fotbal s přáteli.",
    "zh_cn": "我喜欢踢足球。在休息日，我经常和朋友们一起踢球。",
    "fr": "J'aime jouer au football. Les jours de congé, je joue souvent au foot avec mes amis.",
    "de": "Ich spiele gerne Fußball. An freien Tagen spiele ich gewöhnlich mit meinen Freunden Fußball.",
    "hu": "Szeretek focizni. Szabadnapokon általában a barátaimmal focizom.",
    "id": "Saya suka bermain sepak bola. Di hari libur, saya biasanya bermain bola bersama teman-teman.",
    "pl": "Lubię grać w piłkę nożną. W dni wolne zazwyczaj gram w piłkę z przyjaciółmi."
  },
  "daily-14#2": {
    "cs": "A znáš korejského fotbalistu Son Heung-mina?",
    "zh_cn": "那你认识韩国足球运动员孙兴慜吗？",
    "fr": "Alors connais-tu le joueur de foot coréen Son Heung-min ?",
    "de": "Kennst du den koreanischen Fußballspieler Son Heung-min?",
    "hu": "És ismered a koreai labdarúgót, Son Heung-mint?",
    "id": "Lalu apakah kamu tahu pemain sepak bola Korea, Son Heung-min?",
    "pl": "A czy znasz koreańskiego piłkarza Son Heung-mina?"
  },
  "daily-14#3": {
    "cs": "Samozřejmě že ano! Jsem jeho velký fanoušek. Hraje opravdu skvěle.",
    "zh_cn": "当然知道了！我是孙兴慜的铁杆球迷。他踢得真棒。",
    "fr": "Bien sûr que oui ! Je suis un fan de Son Heung-min. Il joue vraiment très bien.",
    "de": "Natürlich kenne ich ihn! Ich bin ein großer Fan von Son Heung-min. Er spielt wirklich großartig.",
    "hu": "Persze hogy ismerem! Nagy Son Heung-min rajongó vagyok. Nagyon jól játszik.",
    "id": "Tentu saja tahu! Saya adalah penggemar Son Heung-min. Dia bermain sangat bagus.",
    "pl": "Oczywiście, że tak! Jestem fanem Son Heung-mina. On gra naprawdę świetnie."
  },
  "daily-15#0": {
    "cs": "Co obvykle děláš, když máš volno, bratře?",
    "zh_cn": "哥，有空的时候你通常做什么？",
    "fr": "Que fais-tu d'habitude quand tu as du temps libre, frère ?",
    "de": "Was machst du gewöhnlich in deiner Freizeit, Bruder?",
    "hu": "Mit szoktál csinálni, amikor ráérsz, testvér?",
    "id": "Di waktu luang, biasanya kakak melakukan apa?",
    "pl": "Co zazwyczaj robisz w wolnym czasie, bracie?"
  },
  "daily-15#1": {
    "cs": "Obvykle chodím do kina nebo na nákupy.",
    "zh_cn": "我通常去看电影或去购物。",
    "fr": "Je vais habituellement au cinéma ou faire du shopping.",
    "de": "Ich gehe gewöhnlich ins Kino oder einkaufen.",
    "hu": "Általában moziba járok vagy vásárolni.",
    "id": "Saya biasanya pergi menonton film atau berbelanja.",
    "pl": "Zazwyczaj chodzę do kina albo na zakupy."
  },
  "daily-15#2": {
    "cs": "A jaký žánr filmů máš nejraději, bratře?",
    "zh_cn": "那哥最喜欢哪种类型的电影？",
    "fr": "Alors quel genre de film aimes-tu le plus, frère ?",
    "de": "Welche Art von Filmen magst du denn am liebsten, Bruder?",
    "hu": "És milyen típusú filmeket szeretsz a legjobban, testvér?",
    "id": "Lalu jenis film apa yang paling kakak sukai?",
    "pl": "A jakie filmy lubisz najbardziej, bracie?"
  },
  "daily-15#3": {
    "cs": "Mám nejraději akční filmy. A co ty?",
    "zh_cn": "我最喜欢动作片。你呢？",
    "fr": "Je préfère les films d'action. Et toi ?",
    "de": "Ich mag Actionfilme am liebsten. Und wie steht es mit dir?",
    "hu": "Az akciófilmeket szeretem a legjobban. És te?",
    "id": "Saya paling suka film laga. Kalau kamu bagaimana?",
    "pl": "Najbardziej lubię filmy akcji. A ty?"
  },
  "daily-15#4": {
    "cs": "Já mám raději komedie.",
    "zh_cn": "我更喜欢喜剧片。",
    "fr": "Moi, je préfère les comédies.",
    "de": "Ich mag Komödien lieber.",
    "hu": "Én jobban szeretem a vígjátékokat.",
    "id": "Saya lebih suka film komedi.",
    "pl": "Ja bardziej wolę komedie."
  },
  "daily-16#0": {
    "cs": "Začínáme hodinu. Dnes se budeme učit o vietnamské výslovnosti. Poslouchejte pozorně, jak čtu.",
    "zh_cn": "我们开始上课吧。今天我们将学习越南语发音。请大家听老师读。",
    "fr": "Commençons le cours. Aujourd'hui, nous allons étudier la prononciation vietnamienne. Écoutez bien ma lecture.",
    "de": "Fangen wir mit dem Unterricht an. Heute lernen wir etwas über die vietnamesische Aussprache. Hört gut zu, wie ich vorlese.",
    "hu": "Kezdjük az órát. Ma a vietnámi kiejtésről fogunk tanulni. Figyeljetek jól, hogyan olvasom fel.",
    "id": "Mari kita mulai kelas. Hari ini kita akan belajar pelafalan bahasa Vietnam. Dengarkan ibu membaca ya.",
    "pl": "Zaczynamy lekcję. Dzisiaj nauczymy się wietnamskiej wymowy. Posłuchajcie uważnie, jak czytam."
  },
  "daily-16#1": {
    "cs": "Dnes skončíme zde. Má ještě někdo nějaké otázky?",
    "zh_cn": "今天我们就学到这里。还有谁有问题吗？",
    "fr": "Nous nous arrêtons là pour aujourd'hui. Y a-t-il d'autres questions ?",
    "de": "Heute hören wir hier auf. Hat noch jemand eine Frage?",
    "hu": "Mára ennyi volt. Van még valakinek kérdése?",
    "id": "Hari ini sampai di sini dulu ya. Ada yang mau bertanya lagi?",
    "pl": "Na dzisiaj to wszystko. Czy ktoś ma jeszcze pytania?"
  },
  "daily-16#2": {
    "cs": "Paní učitelko, příští týden máme test, že ano? Je těžký?",
    "zh_cn": "老师，下周有测验，对吗？难不难？",
    "fr": "Professeur, il y a un contrôle la semaine prochaine, n'est-ce pas ? Est-ce difficile ?",
    "de": "Frau Lehrerin, nächste Woche schreiben wir einen Test, stimmt das? Ist er schwer?",
    "hu": "Tanárnő, a jövő héten dolgozat lesz, ugye? Nehéz?",
    "id": "Bu guru, minggu depan ada ujian kan? Apakah sulit?",
    "pl": "Pani profesor, w przyszłym tygodniu jest sprawdzian, prawda? Czy jest trudny?"
  },
  "daily-16#3": {
    "cs": "Není těžký.",
    "zh_cn": "不难。",
    "fr": "Ce n'est pas difficile.",
    "de": "Nicht schwer.",
    "hu": "Nem nehéz.",
    "id": "Tidak sulit.",
    "pl": "Nie jest trudny."
  },
  "daily-17#0": {
    "cs": "Když jsi byla studentkou, jaký předmět jsi měla nejraději, sestro?",
    "zh_cn": "当学生的时候，姐姐最喜欢什么科目？",
    "fr": "Quand tu étais étudiante, quelle matière préférais-tu, sœur ?",
    "de": "Als du Studentin warst, welches Fach mochtest du am liebsten, Schwester?",
    "hu": "Egyetemista korodban melyik tantárgyat szeretted a legjobban, nővér?",
    "id": "Saat masih kuliah, mata kuliah apa yang paling kakak sukai?",
    "pl": "Kiedy byłaś studentką, jaki przedmiot lubiłaś najbardziej, siostro?"
  },
  "daily-17#1": {
    "cs": "Nejraději jsem měla cizí jazyky. Učila jsem se vietnamštinu, čínštinu atd.",
    "zh_cn": "我最喜欢外语课。我学过越南语、汉语等。",
    "fr": "J'aimais le plus les langues étrangères. J'ai appris le vietnamien, le chinois, etc.",
    "de": "Fremdsprachen mochte ich am liebsten. Ich habe Vietnamesisch, Chinesisch usw. gelernt.",
    "hu": "Az idegen nyelveket szerettem a legjobban. Tanultam vietnámiul, kínaiul és így tovább.",
    "id": "Saya paling suka mata kuliah bahasa asing. Saya pernah belajar bahasa Vietnam, bahasa Mandarin, dll.",
    "pl": "Najbardziej lubiłam języki obce. Uczyłam się wietnamskiego, chińskiego itd."
  },
  "daily-17#2": {
    "cs": "Jaký byl tvůj obor, sestro?",
    "zh_cn": "姐姐原本的专业是什么？",
    "fr": "Quelle était ta spécialité à l'origine, sœur ?",
    "de": "Was war eigentlich dein Hauptfach, Schwester?",
    "hu": "Mi volt eredetileg a szakod, nővér?",
    "id": "Sebenarnya apa jurusan kakak dulu?",
    "pl": "Jaki był pierwotnie twój kierunek studiów, siostro?"
  },
  "daily-17#3": {
    "cs": "Mým oborem byl obchod a vietnamština.",
    "zh_cn": "我的专业本来是商务和越南语。",
    "fr": "Ma spécialité était le commerce et le vietnamien.",
    "de": "Mein Fachgebiet war ursprünglich Wirtschaft und Vietnamesisch.",
    "hu": "Eredetileg gazdálkodás és vietnámi szakos voltam.",
    "id": "Jurusan saya awalnya bisnis dan bahasa Vietnam.",
    "pl": "Mój kierunek to był biznes i język wietnamski."
  },
  "daily-17#4": {
    "cs": "Vážně? A jaké to je, když se teď znovu učíš vietnamštinu?",
    "zh_cn": "是吗？现在重新学习越南语觉得怎么样？",
    "fr": "Ah bon ? Qu'est-ce que ça fait d'étudier à nouveau le vietnamien maintenant ?",
    "de": "Wirklich? Wie fühlt es sich an, jetzt wieder Vietnamesisch zu lernen?",
    "hu": "Tényleg? Most, hogy újra tanulod a vietnámit, milyen érzés?",
    "id": "Begitu ya? Sekarang belajar bahasa Vietnam lagi bagaimana rasanya?",
    "pl": "Naprawdę? I jak ci się teraz znów uczy wietnamskiego?"
  },
  "daily-17#5": {
    "cs": "Připadá mi, že čím víc se vietnamštinu učím, tím je zajímavější.",
    "zh_cn": "我觉得越南语越学越有趣。",
    "fr": "Je trouve que plus on apprend le vietnamien, plus il devient passionnant.",
    "de": "Ich finde, je mehr man Vietnamesisch lernt, desto interessanter wird es.",
    "hu": "Úgy látom, minél többet tanulja az ember a vietnámit, annál érdekesebb.",
    "id": "Menurut saya bahasa Vietnam semakin dipelajari semakin menarik.",
    "pl": "Uważam, że im więcej uczy się wietnamskiego, tym ciekawszy się staje."
  },
  "daily-18#0": {
    "cs": "Odkud ses vrátil? Jaké je dnes počasí?",
    "zh_cn": "你去哪里回来了？今天天气怎么样？",
    "fr": "D'où reviens-tu ? Quel temps fait-il aujourd'hui ?",
    "de": "Woher kommst du gerade? Wie ist das Wetter heute?",
    "hu": "Honnan jössz? Milyen ma az időjárás?",
    "id": "Dari mana kamu pulang? Bagaimana cuaca hari ini?",
    "pl": "Skąd wracasz? Jaka jest dzisiaj pogoda?"
  },
  "daily-18#1": {
    "cs": "Vracím se z učení. Dnes svítí slunce a je velké horko.",
    "zh_cn": "我刚放学回来。今天阳光明媚，非常炎热。",
    "fr": "Je reviens de mes cours. Aujourd'hui, il fait très beau et très chaud.",
    "de": "Ich komme aus der Schule zurück. Heute ist es sonnig und sehr heiß.",
    "hu": "Iskolából jövök. Ma süt a nap és nagyon meleg van.",
    "id": "Saya baru pulang belajar. Hari ini cerah dan sangat panas.",
    "pl": "Wracam z nauki. Dzisiaj jest słonecznie i bardzo gorąco."
  },
  "daily-18#2": {
    "cs": "Nemám rád horko. Proto mám nejraději podzim.",
    "zh_cn": "我不喜欢热天。所以我最喜欢秋天。",
    "fr": "Je n'aime pas le temps chaud. C'est pourquoi je préfère l'automne.",
    "de": "Ich mag kein heißes Wetter. Deshalb gefällt mir der Herbst am besten.",
    "hu": "Nem szeretem a hőséget. Ezért az őszt szeretem a legjobban.",
    "id": "Saya tidak suka cuaca panas. Karena itu saya paling suka musim gugur.",
    "pl": "Nie lubię upałów. Dlatego najbardziej lubię jesień."
  },
  "daily-18#3": {
    "cs": "Proč máš podzim nejraději, bratře?",
    "zh_cn": "为什么哥哥最喜欢秋天呢？",
    "fr": "Pourquoi aimes-tu le plus l'automne, frère ?",
    "de": "Warum magst du den Herbst am liebsten, Bruder?",
    "hu": "Miért szereted a legjobban az őszt, testvér?",
    "id": "Mengapa kakak paling suka musim gugur?",
    "pl": "Dlaczego najbardziej lubisz jesień, bracie?"
  },
  "daily-18#4": {
    "cs": "Protože na podzim je obloha jasná, vysoká a chladivá.",
    "zh_cn": "因为秋天的天空晴朗、高远而凉爽。",
    "fr": "Parce qu'en automne, le ciel est clair, haut et agréablement frais.",
    "de": "Weil der Himmel im Herbst klar, hoch und angenehm kühl ist.",
    "hu": "Mert ősszel az ég tiszta, magas és kellemesen hűvös.",
    "id": "Karena pada musim gugur langit cerah, tinggi, dan sejuk.",
    "pl": "Ponieważ jesienią niebo jest czyste, wysokie i przyjemnie chłodne."
  },
  "daily-19#0": {
    "cs": "Trang, chtěla bych cestovat do Ho Či Minova Města, ale nevím, jaké období je nejlepší.",
    "zh_cn": "Trang，我想去胡志明市旅游，但不知道哪个季节最好。",
    "fr": "Trang, j'aimerais voyager à Hô Chi Minh-Ville, mais je ne sais pas quelle saison est la meilleure.",
    "de": "Trang, ich möchte nach Ho-Chi-Minh-Stadt reisen, weiß aber nicht, welche Jahreszeit am besten ist.",
    "hu": "Trang, szeretnék elutazni Ho Si Minh-városba, de nem tudom, melyik évszak a legmegfelelőbb.",
    "id": "Trang, saya ingin jalan-jalan ke Kota Ho Chi Minh tapi tidak tahu musim mana yang terbaik.",
    "pl": "Trang, chciałabym pojechać na wycieczkę do Ho Chi Minh, ale nie wiem, która pora roku jest najlepsza."
  },
  "daily-19#1": {
    "cs": "Ho Či Minovo Město je jiné než Hanoj, po celý rok je tam horko.",
    "zh_cn": "胡志明市和河内不同，一年到头都很热。",
    "fr": "Hô Chi Minh-Ville est différente de Hanoï, il y fait chaud toute l'année.",
    "de": "Ho-Chi-Minh-Stadt unterscheidet sich von Hanoi, es ist das ganze Jahr über heiß.",
    "hu": "Ho Si Minh-város más, mint Hanoi, ott egész évben meleg van.",
    "id": "Kota Ho Chi Minh berbeda dengan Hanoi, sepanjang tahun selalu panas.",
    "pl": "Ho Chi Minh różni się od Hanoi, przez cały rok jest tam gorąco."
  },
  "daily-19#2": {
    "cs": "Vážně? V čem se liší?",
    "zh_cn": "是吗？有什么不同？",
    "fr": "C'est vrai ? En quoi est-ce différent ?",
    "de": "Wirklich? Worin liegt der Unterschied?",
    "hu": "Tényleg? Miben különbözik?",
    "id": "Begitu ya? Berbedanya bagaimana?",
    "pl": "Naprawdę? Czym się różni?"
  },
  "daily-19#3": {
    "cs": "Hanoj má 4 roční období jako Korea, ale Ho Či Minovo Město má jen 2 období: období dešťů a období sucha.",
    "zh_cn": "河内像韩国一样有四季，但胡志明市只有雨季和旱季两个季节。",
    "fr": "Hanoï a quatre saisons comme la Corée, mais Hô Chi Minh-Ville n'a que deux saisons : la saison des pluies et la saison sèche.",
    "de": "Hanoi hat vier Jahreszeiten wie Korea, aber Ho-Chi-Minh-Stadt hat nur zwei Jahreszeiten: die Regenzeit und die Trockenzeit.",
    "hu": "Hanoiban négy évszak van, mint Koreában, de Ho Si Minh-városban csak két évszak létezik: az esős és a száraz évszak.",
    "id": "Hanoi punya 4 musim seperti Korea, tetapi Kota Ho Chi Minh hanya punya 2 musim yaitu musim hujan dan kemarau.",
    "pl": "Hanoi ma 4 pory roku jak Korea, ale Ho Chi Minh ma tylko dwie: porę deszczową i porę suchą."
  },
  "daily-19#4": {
    "cs": "Když pojedu v srpnu, bude období dešťů nebo sucha?",
    "zh_cn": "如果我在8月去，是雨季还是旱季？",
    "fr": "Si j'y vais en août, est-ce la saison des pluies ou la saison sèche ?",
    "de": "Wenn ich im August fahre, ist dann Regenzeit oder Trockenzeit?",
    "hu": "Ha augusztusban megyek, esős vagy száraz évszak lesz?",
    "id": "Kalau saya pergi pada bulan Agustus, apakah itu musim hujan atau kemarau?",
    "pl": "Jeśli pojadę w sierpniu, to będzie pora deszczowa czy sucha?"
  },
  "daily-19#5": {
    "cs": "V srpnu je období dešťů.",
    "zh_cn": "8月的话是雨季。",
    "fr": "Au mois d'août, c'est la saison des pluies.",
    "de": "Im August herrscht die Regenzeit.",
    "hu": "Augusztusban az esős évszak van.",
    "id": "Bulan Agustus adalah musim hujan.",
    "pl": "W sierpniu jest pora deszczowa."
  },
  "daily-20#0": {
    "cs": "Bratře, co se ti stalo?",
    "zh_cn": "哥，你哪里不舒服？",
    "fr": "Frère, qu'est-ce qui ne va pas ?",
    "de": "Bruder, was fehlt dir?",
    "hu": "Testvér, mi a bajod?",
    "id": "Kak, ada apa denganmu?",
    "pl": "Bracie, co ci dolega?"
  },
  "daily-20#1": {
    "cs": "Od včerejšího večera mě bolí v krku a teď mám horečku až 39 °C.",
    "zh_cn": "我从昨晚开始喉咙痛，现在发烧到了39度。",
    "fr": "J'ai mal à la gorge depuis hier soir et maintenant j'ai jusqu'à 39°C de fièvre.",
    "de": "Seit gestern Abend habe ich Halsschmerzen und jetzt habe ich Fieber bis 39 °C.",
    "hu": "Tegnap este óta fáj a torkom, és most 39 fokos lázam van.",
    "id": "Tenggorokan saya sakit sejak kemarin malam dan sekarang demam hingga 39°C.",
    "pl": "Od wczorajszego wieczora boli mnie gardło, a teraz mam gorączkę aż do 39°C."
  },
  "daily-20#2": {
    "cs": "Byl jsi u lékaře?",
    "zh_cn": "你去看医生了吗？",
    "fr": "Es-tu allé voir un médecin ?",
    "de": "Warst du schon beim Arzt?",
    "hu": "Voltál már orvosnál?",
    "id": "Sudah pergi ke dokter belum?",
    "pl": "Byłeś u lekarza?"
  },
  "daily-20#3": {
    "cs": "Ještě ne. Jen jsem si vzal léky. Ale za chvíli půjdu do nemocnice.",
    "zh_cn": "还没呢。我只是吃了药。不过过一会儿我就去医院。",
    "fr": "Pas encore. J'ai seulement pris des médicaments. Mais je vais aller à l'hôpital tout à l'heure.",
    "de": "Noch nicht. Ich habe nur Medizin genommen. Aber gleich gehe ich ins Krankenhaus.",
    "hu": "Még nem. Csak gyógyszert vettem be. De hamarosan elmegyek a kórházba.",
    "id": "Belum. Saya hanya minum obat saja. Tapi sebentar lagi saya akan pergi ke rumah sakit.",
    "pl": "Jeszcze nie. Wziąłem tylko leki. Ale za chwilę pójdę do szpitala."
  },
  "daily-20#4": {
    "cs": "Přeji ti brzké uzdravení.",
    "zh_cn": "祝哥哥早日康复。",
    "fr": "Je te souhaite de guérir rapidement, frère.",
    "de": "Gute Besserung, werde bald gesund.",
    "hu": "Mielőbbi gyógyulást kívánok, testvér.",
    "id": "Semoga kakak lekas sembuh.",
    "pl": "Życzę ci szybkiego powrotu do zdrowia, bracie."
  },
  "daily-20#5": {
    "cs": "Děkuji ti.",
    "zh_cn": "嗯。谢谢你。",
    "fr": "Oui. Merci.",
    "de": "Ja. Danke dir.",
    "hu": "Igen. Köszönöm.",
    "id": "Ya. Terima kasih.",
    "pl": "Tak. Dziękuję."
  },
  "daily-21#0": {
    "cs": "Dobrý den. Bolí vás v krku a máte horečku, je to tak? Pojďte, vyšetřím vás.",
    "zh_cn": "你好。你喉咙痛并且发烧，对吧？让我来为你检查一下。",
    "fr": "Bonjour. Vous avez mal à la gorge et de la fièvre, c'est bien cela ? Laissez-moi vous examiner.",
    "de": "Guten Tag. Sie haben Halsschmerzen und Fieber, nicht wahr? Ich werde Sie untersuchen.",
    "hu": "Jó napot. Fáj a torka és lázas, igaz? Hadd vizsgáljam meg.",
    "id": "Halo. Tenggorokan sakit dan demam, benar kan? Biar saya periksa.",
    "pl": "Dzień dobry. Boli pana gardło i ma pan gorączkę, zgadza się? Zbadam pana."
  },
  "daily-21#1": {
    "cs": "Jak to vypadá? Je to vážné?",
    "zh_cn": "怎么样？严重吗？",
    "fr": "Comment est-ce ? Est-ce grave ?",
    "de": "Wie sieht es aus? Ist es schlimm?",
    "hu": "Milyen a helyzet? Súlyos?",
    "id": "Bagaimana? Apakah parah?",
    "pl": "Jak to wygląda? Czy to coś poważnego?"
  },
  "daily-21#2": {
    "cs": "Máte nachlazení, ale není to příliš vážné. Nemějte obavy. Váš obličej však vypadá velmi unaveně. Měl byste si odpočinout.",
    "zh_cn": "你感冒了，但不太严重。别担心。不过你的脸色看起来太疲惫了，建议好好休息。",
    "fr": "Vous avez attrapé un rhume, mais ce n'est pas très grave. Ne vous inquiétez pas. Mais vous avez l'air très fatigué. Vous devriez vous reposer.",
    "de": "Sie sind erkältet, aber es ist nicht sehr schlimm. Keine Sorge. Aber Sie sehen sehr erschöpft aus. Sie sollten sich ausruhen.",
    "hu": "Megfázott, de nem túl súlyos. Ne aggódjon. Az arca viszont nagyon fáradtnak tűnik. Pihennie kellene.",
    "id": "Anda masuk angin/flu tetapi tidak terlalu parah. Jangan cemas ya. Tapi wajah Anda terlihat sangat lelah. Sebaiknya Anda istirahat.",
    "pl": "Przeziębił się pan, ale to nic groźnego. Proszę się nie martwić. Jednak wygląda pan na bardzo zmęczonego. Powinien pan odpocząć."
  },
  "daily-21#3": {
    "cs": "V poslední době jsem měl hodně práce, takže jsem si nemohl odpočinout.",
    "zh_cn": "最近我有很多工作要做，所以一直没能好好休息。",
    "fr": "Ces derniers temps, j'avais beaucoup de travail donc je n'ai pas pu me reposer.",
    "de": "In letzter Zeit hatte ich viel zu tun, sodass ich mich nicht ausruhen konnte.",
    "hu": "Az utóbbi időben sok munkám volt, így nem tudtam pihenni.",
    "id": "Akhir-akhir ini saya punya banyak pekerjaan sehingga tidak bisa istirahat.",
    "pl": "Ostatnio miałem dużo pracy, więc nie mogłem odpocząć."
  },
  "daily-21#4": {
    "cs": "Užívejte léky 2 až 3 dny. Pijte hodně vody a odpočívejte, pak se uzdravíte.",
    "zh_cn": "请服药2到3天。多喝水、多休息就会好起来的。",
    "fr": "Prenez des médicaments pendant 2 à 3 jours. Buvez beaucoup d'eau et reposez-vous, vous guérirez.",
    "de": "Nehmen Sie die Medikamente 2 bis 3 Tage lang ein. Trinken Sie viel Wasser und ruhen Sie sich aus, dann werden Sie gesund.",
    "hu": "Szedje a gyógyszert 2-3 napig. Igyon sok vizet és pihenjen, akkor meggyógyul.",
    "id": "Minum obat selama 2 sampai 3 hari ya. Minum banyak air dan istirahat maka akan sembuh.",
    "pl": "Proszę brać leki przez 2 do 3 dni. Proszę pić dużo wody i odpoczywać, a poczuje się pan lepiej."
  },
  "daily-21#5": {
    "cs": "Ano, děkuji vám, pane doktore.",
    "zh_cn": "好的，谢谢医生。",
    "fr": "Oui, merci beaucoup, docteur.",
    "de": "Ja, vielen Dank, Herr Doktor.",
    "hu": "Igen, köszönöm szépen, doktor úr.",
    "id": "Ya, terima kasih banyak, dokter.",
    "pl": "Tak, dziękuję bardzo, panie doktorze."
  }
}

DAILY_AI_VOCAB = {
  "daily-01#0": {
    "cs": "pozdravit, ahoj",
    "zh_cn": "问候，你好",
    "fr": "saluer, bonjour",
    "de": "grüßen, hallo",
    "hu": "köszönni, szia",
    "id": "menyapa, halo",
    "pl": "witać, cześć"
  },
  "daily-01#1": {
    "cs": "starší bratr / ty",
    "zh_cn": "哥哥，兄长 / 你",
    "fr": "grand frère / tu",
    "de": "älterer Bruder / du",
    "hu": "báty / te",
    "id": "kakak laki-laki / kamu",
    "pl": "starszy brat / ty"
  },
  "daily-01#2": {
    "cs": "mladší sourozenec / ty",
    "zh_cn": "弟弟妹妹 / 你",
    "fr": "cadet(te) / tu",
    "de": "jüngeres Geschwister / du",
    "hu": "kisebb testvér / te",
    "id": "adik / kamu",
    "pl": "młodsze rodzeństwo / ty"
  },
  "daily-01#3": {
    "cs": "zdravý, v pořádku",
    "zh_cn": "健康，安好",
    "fr": "en bonne santé, bien",
    "de": "gesund, wohlauf",
    "hu": "egészséges, jól van",
    "id": "sehat, baik",
    "pl": "zdrowy, dobrze"
  },
  "daily-01#4": {
    "cs": "tázací částice",
    "zh_cn": "吗（疑问词）",
    "fr": "particule interrogative",
    "de": "Fragepartikel",
    "hu": "kérdő partikula",
    "id": "partikel tanya",
    "pl": "partykuła pytająca"
  },
  "daily-01#5": {
    "cs": "ano (zdvořile)",
    "zh_cn": "是的（礼貌）",
    "fr": "oui (poli)",
    "de": "ja (höflich)",
    "hu": "igen (udvarias)",
    "id": "ya (sopan)",
    "pl": "tak (grzecznie)"
  },
  "daily-01#6": {
    "cs": "a co, a (ty)",
    "zh_cn": "至于，那",
    "fr": "et, quant à",
    "de": "und, was ist mit",
    "hu": "és, hát",
    "id": "dan, bagaimana dengan",
    "pl": "a, co z"
  },
  "daily-01#7": {
    "cs": "jo, dobře",
    "zh_cn": "嗯，是的",
    "fr": "ouais, d'accord",
    "de": "ja, okay",
    "hu": "aha, jó",
    "id": "ya, oke",
    "pl": "no, dobrze"
  },
  "daily-01#8": {
    "cs": "také, taky",
    "zh_cn": "也，同样",
    "fr": "aussi, également",
    "de": "auch, ebenfalls",
    "hu": "is, szintén",
    "id": "juga",
    "pl": "też, także"
  },
  "daily-02#0": {
    "cs": "promiňte / omlouvám se",
    "zh_cn": "抱歉，对不起",
    "fr": "excusez-moi / pardon",
    "de": "Entschuldigung",
    "hu": "elnézést / bocsánat",
    "id": "permisi / maaf",
    "pl": "przepraszam"
  },
  "daily-02#1": {
    "cs": "jméno",
    "zh_cn": "名字",
    "fr": "nom",
    "de": "Name",
    "hu": "név",
    "id": "nama",
    "pl": "imię"
  },
  "daily-02#2": {
    "cs": "(něčí), z",
    "zh_cn": "的（所属）",
    "fr": "de (possessif)",
    "de": "von (Besitz)",
    "hu": "-é, valakié",
    "id": "milik, dari",
    "pl": "(czyjś), od"
  },
  "daily-02#3": {
    "cs": "být",
    "zh_cn": "是",
    "fr": "être",
    "de": "sein",
    "hu": "van, -e (lenni)",
    "id": "adalah",
    "pl": "być"
  },
  "daily-02#4": {
    "cs": "co",
    "zh_cn": "什么",
    "fr": "quoi",
    "de": "was",
    "hu": "mi",
    "id": "apa",
    "pl": "co"
  },
  "daily-02#5": {
    "cs": "velmi",
    "zh_cn": "非常，很",
    "fr": "très",
    "de": "sehr",
    "hu": "nagyon",
    "id": "sangat",
    "pl": "bardzo"
  },
  "daily-02#6": {
    "cs": "radostný, rád",
    "zh_cn": "高兴，快乐",
    "fr": "content, heureux",
    "de": "froh, erfreut",
    "hu": "örül, vidám",
    "id": "senang, gembira",
    "pl": "zadowolony, rad"
  },
  "daily-02#7": {
    "cs": "moci / mít možnost",
    "zh_cn": "得以，获得",
    "fr": "pouvoir / avoir l'occasion de",
    "de": "können / die Gelegenheit haben",
    "hu": "tud, lehetősége van",
    "id": "bisa, mendapat kesempatan",
    "pl": "móc / mieć okazję"
  },
  "daily-02#8": {
    "cs": "potkat, setkat se",
    "zh_cn": "遇见，见面",
    "fr": "rencontrer",
    "de": "treffen",
    "hu": "találkozni",
    "id": "bertemu",
    "pl": "spotkać"
  },
  "daily-03#0": {
    "cs": "tady / toto",
    "zh_cn": "这里，这位",
    "fr": "ici / voici",
    "de": "hier / dies",
    "hu": "itt / ez",
    "id": "di sini / ini",
    "pl": "tu / to"
  },
  "daily-03#1": {
    "cs": "ženský / dívka",
    "zh_cn": "女性",
    "fr": "féminin / fille",
    "de": "weiblich / Mädchen",
    "hu": "női / lány",
    "id": "perempuan",
    "pl": "żeński / dziewczyna"
  },
  "daily-03#2": {
    "cs": "mladší sestra",
    "zh_cn": "妹妹",
    "fr": "petite sœur",
    "de": "jüngere Schwester",
    "hu": "húg",
    "id": "adik perempuan",
    "pl": "młodsza siostra"
  },
  "daily-03#3": {
    "cs": "prosit / prosím",
    "zh_cn": "请，请求",
    "fr": "s'il vous plaît / demander",
    "de": "bitte / bitten",
    "hu": "kérem / kérni",
    "id": "mohon / tolong",
    "pl": "proszę / prosić"
  },
  "daily-03#4": {
    "cs": "připomenout / zopakovat",
    "zh_cn": "提醒，重复",
    "fr": "rappeler / répéter",
    "de": "erinnern / wiederholen",
    "hu": "emlékeztet / megismétel",
    "id": "mengingatkan / mengulang",
    "pl": "przypomnieć / powtórzyć"
  },
  "daily-03#5": {
    "cs": "znovu",
    "zh_cn": "再，又",
    "fr": "de nouveau",
    "de": "wieder, noch einmal",
    "hu": "újra",
    "id": "lagi",
    "pl": "znowu"
  },
  "daily-04#0": {
    "cs": "člověk, lidé",
    "zh_cn": "人",
    "fr": "personne, gens",
    "de": "Mensch, Leute",
    "hu": "ember, emberek",
    "id": "orang",
    "pl": "człowiek, ludzie"
  },
  "daily-04#1": {
    "cs": "země / voda",
    "zh_cn": "国家，水",
    "fr": "pays / eau",
    "de": "Land / Wasser",
    "hu": "ország / víz",
    "id": "negara / air",
    "pl": "kraj / woda"
  },
  "daily-04#2": {
    "cs": "který",
    "zh_cn": "哪，哪个",
    "fr": "quel",
    "de": "welcher",
    "hu": "melyik",
    "id": "yang mana",
    "pl": "który"
  },
  "daily-04#3": {
    "cs": "Vietnam",
    "zh_cn": "越南",
    "fr": "Viêt Nam",
    "de": "Vietnam",
    "hu": "Vietnám",
    "id": "Vietnam",
    "pl": "Wietnam"
  },
  "daily-04#4": {
    "cs": "že? / viď?",
    "zh_cn": "对吗，是不是",
    "fr": "n'est-ce pas ?",
    "de": "nicht wahr?",
    "hu": "ugye?",
    "id": "bukan?",
    "pl": "prawda?"
  },
  "daily-04#5": {
    "cs": "není / ne",
    "zh_cn": "不是",
    "fr": "ce n'est pas / non",
    "de": "ist nicht / nein",
    "hu": "nem (az)",
    "id": "bukan",
    "pl": "nie jest / nie"
  },
  "daily-04#6": {
    "cs": "Korea",
    "zh_cn": "韩国",
    "fr": "Corée",
    "de": "Korea",
    "hu": "Korea",
    "id": "Korea",
    "pl": "Korea"
  },
  "daily-04#7": {
    "cs": "mluvit",
    "zh_cn": "说，讲",
    "fr": "parler",
    "de": "sprechen",
    "hu": "beszélni",
    "id": "berbicara",
    "pl": "mówić"
  },
  "daily-04#8": {
    "cs": "vietnamština",
    "zh_cn": "越南语",
    "fr": "langue vietnamienne",
    "de": "Vietnamesisch",
    "hu": "vietnámi nyelv",
    "id": "bahasa Vietnam",
    "pl": "język wietnamski"
  },
  "daily-04#9": {
    "cs": "šikovný, zdatný",
    "zh_cn": "厉害，优秀",
    "fr": "doué, habile",
    "de": "gut in, geschickt",
    "hu": "ügyes, jó valamiben",
    "id": "pandai, mahir",
    "pl": "zdolny, dobry w"
  },
  "daily-04#10": {
    "cs": "příliš, velmi",
    "zh_cn": "太，真",
    "fr": "trop, très",
    "de": "zu, sehr",
    "hu": "túl, nagyon",
    "id": "terlalu, sangat",
    "pl": "bardzo, zbyt"
  },
  "daily-05#0": {
    "cs": "žít, bydlet",
    "zh_cn": "生活，居住",
    "fr": "vivre, habiter",
    "de": "leben, wohnen",
    "hu": "élni, lakni",
    "id": "tinggal, hidup",
    "pl": "żyć, mieszkać"
  },
  "daily-05#1": {
    "cs": "kde",
    "zh_cn": "在哪里",
    "fr": "où",
    "de": "wo",
    "hu": "hol",
    "id": "di mana",
    "pl": "gdzie"
  },
  "daily-05#2": {
    "cs": "ulice, cesta",
    "zh_cn": "道路，街",
    "fr": "rue, route",
    "de": "Straße, Weg",
    "hu": "utca, út",
    "id": "jalan",
    "pl": "ulica, droga"
  },
  "daily-05#3": {
    "cs": "dům, domov",
    "zh_cn": "家，房子",
    "fr": "maison, foyer",
    "de": "Haus, Zuhause",
    "hu": "ház, otthon",
    "id": "rumah",
    "pl": "dom"
  },
  "daily-05#4": {
    "cs": "pracovat",
    "zh_cn": "工作",
    "fr": "travailler",
    "de": "arbeiten",
    "hu": "dolgozni",
    "id": "bekerja",
    "pl": "pracować"
  },
  "daily-05#5": {
    "cs": "firma, společnost",
    "zh_cn": "公司",
    "fr": "entreprise",
    "de": "Firma",
    "hu": "cég",
    "id": "perusahaan",
    "pl": "firma"
  },
  "daily-05#6": {
    "cs": "pronajmout si",
    "zh_cn": "租赁",
    "fr": "louer",
    "de": "mieten",
    "hu": "bérelni",
    "id": "menyewa",
    "pl": "wynajmować"
  },
  "daily-05#7": {
    "cs": "s",
    "zh_cn": "和，跟",
    "fr": "avec",
    "de": "mit",
    "hu": "-val/-vel, együtt",
    "id": "dengan",
    "pl": "z"
  },
  "daily-05#8": {
    "cs": "manželka",
    "zh_cn": "妻子",
    "fr": "épouse",
    "de": "Ehefrau",
    "hu": "feleség",
    "id": "istri",
    "pl": "żona"
  },
  "daily-05#9": {
    "cs": "dcera",
    "zh_cn": "女儿",
    "fr": "fille",
    "de": "Tochter",
    "hu": "lánya (valakinek)",
    "id": "anak perempuan",
    "pl": "córka"
  },
  "daily-05#10": {
    "cs": "syn",
    "zh_cn": "儿子",
    "fr": "fils",
    "de": "Sohn",
    "hu": "fia (valakinek)",
    "id": "anak laki-laki",
    "pl": "syn"
  },
  "daily-06#0": {
    "cs": "zdůrazňovací částice",
    "zh_cn": "呢，吧（语气词）",
    "fr": "particule d'insistance",
    "de": "Betonungspartikel",
    "hu": "nyomatékosító partikula",
    "id": "partikel penegas",
    "pl": "partykuła wzmacniająca"
  },
  "daily-06#1": {
    "cs": "hezký, krásný",
    "zh_cn": "漂亮，美丽",
    "fr": "joli, beau",
    "de": "hübsch, schön",
    "hu": "csinos, szép",
    "id": "cantik, indah",
    "pl": "ładny, piękny"
  },
  "daily-06#2": {
    "cs": "jak ... tak ...",
    "zh_cn": "既…又…",
    "fr": "à la fois ... et ...",
    "de": "sowohl ... als auch ...",
    "hu": "is ... is ...",
    "id": "sekaligus ... dan ...",
    "pl": "zarówno ... jak i ..."
  },
  "daily-06#3": {
    "cs": "chytrý, inteligentní",
    "zh_cn": "聪明",
    "fr": "intelligent",
    "de": "klug, intelligent",
    "hu": "okos, intelligens",
    "id": "pintar, cerdas",
    "pl": "mądry, inteligentny"
  },
  "daily-06#4": {
    "cs": "kolik let",
    "zh_cn": "几岁",
    "fr": "quel âge",
    "de": "wie alt",
    "hu": "hány éves",
    "id": "berapa umur",
    "pl": "ile lat"
  },
  "daily-06#5": {
    "cs": "dvacet",
    "zh_cn": "二十",
    "fr": "vingt",
    "de": "zwanzig",
    "hu": "húsz",
    "id": "dua puluh",
    "pl": "dwadzieścia"
  },
  "daily-07#0": {
    "cs": "dnes",
    "zh_cn": "今天",
    "fr": "aujourd'hui",
    "de": "heute",
    "hu": "ma",
    "id": "hari ini",
    "pl": "dzisiaj"
  },
  "daily-07#1": {
    "cs": "dívat se na film",
    "zh_cn": "看电影",
    "fr": "regarder un film",
    "de": "einen Film ansehen",
    "hu": "filmet nézni",
    "id": "menonton film",
    "pl": "oglądać film"
  },
  "daily-07#2": {
    "cs": "samozřejmě / jistě",
    "zh_cn": "当然可以",
    "fr": "bien sûr",
    "de": "natürlich / klar",
    "hu": "persze / hogyne",
    "id": "tentu saja",
    "pl": "oczywiście"
  },
  "daily-07#3": {
    "cs": "kolik hodin",
    "zh_cn": "几点",
    "fr": "quelle heure",
    "de": "wie spät",
    "hu": "hány óra",
    "id": "jam berapa",
    "pl": "która godzina"
  },
  "daily-07#4": {
    "cs": "teď",
    "zh_cn": "现在",
    "fr": "maintenant",
    "de": "jetzt",
    "hu": "most",
    "id": "sekarang",
    "pl": "teraz"
  },
  "daily-07#5": {
    "cs": "hodina (doba trvání)",
    "zh_cn": "小时（时长）",
    "fr": "heure (durée)",
    "de": "Stunde (Dauer)",
    "hu": "óra (időtartam)",
    "id": "jam (durasi)",
    "pl": "godzina (czas trwania)"
  },
  "daily-07#6": {
    "cs": "po, později",
    "zh_cn": "之后",
    "fr": "après, plus tard",
    "de": "nach, später",
    "hu": "után, később",
    "id": "setelah, nanti",
    "pl": "po, później"
  },
  "daily-08#0": {
    "cs": "ovoce",
    "zh_cn": "水果",
    "fr": "fruit",
    "de": "Obst",
    "hu": "gyümölcs",
    "id": "buah",
    "pl": "owoce"
  },
  "daily-08#1": {
    "cs": "pomeranč",
    "zh_cn": "橙子，橘子",
    "fr": "orange",
    "de": "Orange",
    "hu": "narancs",
    "id": "jeruk",
    "pl": "pomarańcza"
  },
  "daily-08#2": {
    "cs": "kilogram",
    "zh_cn": "公斤",
    "fr": "kilogramme",
    "de": "Kilogramm",
    "hu": "kilogramm",
    "id": "kilogram",
    "pl": "kilogram"
  },
  "daily-08#3": {
    "cs": "kolik to stojí",
    "zh_cn": "多少钱",
    "fr": "combien (d'argent)",
    "de": "wie viel (Geld)",
    "hu": "mennyibe kerül",
    "id": "berapa harganya",
    "pl": "ile kosztuje"
  },
  "daily-08#4": {
    "cs": "tisíc",
    "zh_cn": "千",
    "fr": "mille",
    "de": "tausend",
    "hu": "ezer",
    "id": "ribu",
    "pl": "tysiąc"
  },
  "daily-08#5": {
    "cs": "proč, jak to",
    "zh_cn": "怎么，为何",
    "fr": "pourquoi, comment se fait-il",
    "de": "warum, wieso",
    "hu": "miért, hogyhogy",
    "id": "kenapa, mengapa",
    "pl": "dlaczego, jak to"
  },
  "daily-08#6": {
    "cs": "drahý",
    "zh_cn": "贵",
    "fr": "cher",
    "de": "teuer",
    "hu": "drága",
    "id": "mahal",
    "pl": "drogi"
  },
  "daily-08#7": {
    "cs": "sladký",
    "zh_cn": "甜",
    "fr": "sucré",
    "de": "süß",
    "hu": "édes",
    "id": "manis",
    "pl": "słodki"
  },
  "daily-09#0": {
    "cs": "klobouk, čepice",
    "zh_cn": "帽子",
    "fr": "chapeau",
    "de": "Hut, Mütze",
    "hu": "kalap, sapka",
    "id": "topi",
    "pl": "kapelusz, czapka"
  },
  "daily-09#1": {
    "cs": "modrá / zelená",
    "zh_cn": "蓝色/绿色",
    "fr": "bleu / vert",
    "de": "blau / grün",
    "hu": "kék / zöld",
    "id": "biru / hijau",
    "pl": "niebieski / zielony"
  },
  "daily-09#2": {
    "cs": "černá",
    "zh_cn": "黑色",
    "fr": "noir",
    "de": "schwarz",
    "hu": "fekete",
    "id": "hitam",
    "pl": "czarny"
  },
  "daily-09#3": {
    "cs": "zlevnit, sleva",
    "zh_cn": "打折，减价",
    "fr": "faire une réduction",
    "de": "einen Rabatt geben",
    "hu": "árengedményt adni",
    "id": "memberi diskon",
    "pl": "obniżyć cenę, rabat"
  },
  "daily-09#4": {
    "cs": "trochu",
    "zh_cn": "一点点",
    "fr": "un peu",
    "de": "ein bisschen",
    "hu": "egy kicsit",
    "id": "sedikit",
    "pl": "trochę"
  },
  "daily-09#5": {
    "cs": "snížit (cenu), slevit",
    "zh_cn": "减价，少收",
    "fr": "baisser (le prix)",
    "de": "(den Preis) senken",
    "hu": "lealkudni, engedni (az árból)",
    "id": "mengurangi (harga)",
    "pl": "opuścić (cenę)"
  },
  "daily-10#0": {
    "cs": "už ... ? (ještě ne)",
    "zh_cn": "已经…了吗",
    "fr": "déjà ... ? (pas encore)",
    "de": "schon ... ? (noch nicht)",
    "hu": "már ...? (még nem)",
    "id": "sudah ... belum?",
    "pl": "już ...? (jeszcze nie)"
  },
  "daily-10#1": {
    "cs": "mít hlad",
    "zh_cn": "肚子饿",
    "fr": "avoir faim",
    "de": "hungrig",
    "hu": "éhes",
    "id": "lapar",
    "pl": "głodny"
  },
  "daily-10#2": {
    "cs": "restaurace s pho",
    "zh_cn": "河粉店",
    "fr": "restaurant de pho",
    "de": "Pho-Lokal",
    "hu": "phó-étkezde",
    "id": "kedai pho",
    "pl": "bar z pho"
  },
  "daily-10#3": {
    "cs": "chutný, dobrý",
    "zh_cn": "美味，好吃",
    "fr": "délicieux",
    "de": "lecker",
    "hu": "finom",
    "id": "enak, lezat",
    "pl": "smaczny"
  },
  "daily-10#4": {
    "cs": "pozvat, pohostit",
    "zh_cn": "邀请，请客",
    "fr": "inviter, offrir",
    "de": "einladen",
    "hu": "meghívni",
    "id": "mengundang, mentraktir",
    "pl": "zaprosić, poczęstować"
  },
  "daily-10#5": {
    "cs": "mít rád",
    "zh_cn": "喜欢",
    "fr": "aimer",
    "de": "mögen",
    "hu": "szeretni, kedvelni",
    "id": "suka",
    "pl": "lubić"
  },
  "daily-11#0": {
    "cs": "jídelní lístek",
    "zh_cn": "菜单",
    "fr": "menu",
    "de": "Speisekarte",
    "hu": "étlap",
    "id": "menu",
    "pl": "menu, karta dań"
  },
  "daily-11#1": {
    "cs": "jíst, použít (zdvořile)",
    "zh_cn": "用，享用",
    "fr": "prendre, utiliser (poli)",
    "de": "essen, nehmen (höflich)",
    "hu": "fogyasztani, használni (udvarias)",
    "id": "makan, menggunakan (sopan)",
    "pl": "jeść, używać (grzecznie)"
  },
  "daily-11#2": {
    "cs": "miska",
    "zh_cn": "碗",
    "fr": "bol",
    "de": "Schüssel",
    "hu": "tál",
    "id": "mangkuk",
    "pl": "miska"
  },
  "daily-11#3": {
    "cs": "talíř",
    "zh_cn": "盘子",
    "fr": "assiette",
    "de": "Teller",
    "hu": "tányér",
    "id": "piring",
    "pl": "talerz"
  },
  "daily-11#4": {
    "cs": "smažené jarní závitky",
    "zh_cn": "炸春卷",
    "fr": "nems (rouleaux frits)",
    "de": "frittierte Frühlingsrollen",
    "hu": "sült tavaszi tekercs",
    "id": "lumpia goreng",
    "pl": "smażone sajgonki"
  },
  "daily-11#5": {
    "cs": "hovězí pho",
    "zh_cn": "牛肉河粉",
    "fr": "pho au bœuf",
    "de": "Rindfleisch-Pho",
    "hu": "marhahúsos phó",
    "id": "pho sapi",
    "pl": "pho z wołowiną"
  },
  "daily-11#6": {
    "cs": "kuřecí pho",
    "zh_cn": "鸡肉河粉",
    "fr": "pho au poulet",
    "de": "Hühnchen-Pho",
    "hu": "csirkés phó",
    "id": "pho ayam",
    "pl": "pho z kurczakiem"
  },
  "daily-11#7": {
    "cs": "ledový čaj",
    "zh_cn": "冰茶",
    "fr": "thé glacé",
    "de": "Eistee",
    "hu": "jeges tea",
    "id": "es teh",
    "pl": "mrożona herbata"
  },
  "daily-12#0": {
    "cs": "když, kdy",
    "zh_cn": "当…时",
    "fr": "quand",
    "de": "wenn, als",
    "hu": "amikor",
    "id": "ketika, saat",
    "pl": "kiedy, gdy"
  },
  "daily-12#1": {
    "cs": "(čím), pomocí",
    "zh_cn": "搭乘，以",
    "fr": "en, par, avec",
    "de": "mit, per",
    "hu": "-val/-vel (eszközzel)",
    "id": "dengan, naik",
    "pl": "czymś, za pomocą"
  },
  "daily-12#2": {
    "cs": "motorka",
    "zh_cn": "摩托车",
    "fr": "moto, scooter",
    "de": "Motorroller",
    "hu": "motor, robogó",
    "id": "sepeda motor",
    "pl": "motocykl, skuter"
  },
  "daily-12#3": {
    "cs": "bát se",
    "zh_cn": "害怕",
    "fr": "avoir peur",
    "de": "Angst haben",
    "hu": "félni",
    "id": "takut",
    "pl": "bać się"
  },
  "daily-12#4": {
    "cs": "prostředek, dopravní prostředek",
    "zh_cn": "工具，手段",
    "fr": "moyen, moyen de transport",
    "de": "Mittel, Verkehrsmittel",
    "hu": "eszköz, közlekedési eszköz",
    "id": "sarana, alat transportasi",
    "pl": "środek, środek transportu"
  },
  "daily-12#5": {
    "cs": "běžný, rozšířený",
    "zh_cn": "普遍的",
    "fr": "courant, répandu",
    "de": "verbreitet, üblich",
    "hu": "elterjedt, gyakori",
    "id": "umum, populer",
    "pl": "powszechny, popularny"
  },
  "daily-12#6": {
    "cs": "nejvíce, nej-",
    "zh_cn": "最",
    "fr": "le plus",
    "de": "am meisten, am besten",
    "hu": "leg-, legjobban",
    "id": "paling",
    "pl": "najbardziej, naj-"
  },
  "daily-13#0": {
    "cs": "už jsi někdy ...?",
    "zh_cn": "曾经…过吗",
    "fr": "as-tu déjà ... ?",
    "de": "hast du schon einmal ...?",
    "hu": "...-tál már valaha?",
    "id": "pernahkah ...?",
    "pl": "czy kiedyś ...?"
  },
  "daily-13#1": {
    "cs": "řídit, jezdit",
    "zh_cn": "驾驶，骑",
    "fr": "conduire",
    "de": "fahren, lenken",
    "hu": "vezetni",
    "id": "mengemudikan, mengendarai",
    "pl": "prowadzić, jeździć"
  },
  "daily-13#2": {
    "cs": "ne- (zákaz), nedělej",
    "zh_cn": "不要，别",
    "fr": "ne ... pas (défense)",
    "de": "nicht (Verbot)",
    "hu": "ne (tiltás)",
    "id": "jangan",
    "pl": "nie (zakaz)"
  },
  "daily-13#3": {
    "cs": "dělat si starosti",
    "zh_cn": "担心",
    "fr": "s'inquiéter",
    "de": "sich Sorgen machen",
    "hu": "aggódni",
    "id": "khawatir",
    "pl": "martwić się"
  },
  "daily-13#4": {
    "cs": "hned, okamžitě",
    "zh_cn": "马上",
    "fr": "tout de suite",
    "de": "sofort",
    "hu": "azonnal",
    "id": "segera",
    "pl": "od razu, natychmiast"
  },
  "daily-13#5": {
    "cs": "učit",
    "zh_cn": "教导",
    "fr": "enseigner",
    "de": "unterrichten, beibringen",
    "hu": "tanítani",
    "id": "mengajar",
    "pl": "uczyć"
  },
  "daily-13#6": {
    "cs": "to je v pořádku, dobře",
    "zh_cn": "也可以，行",
    "fr": "ça va, d'accord",
    "de": "auch gut, in Ordnung",
    "hu": "az is jó, rendben",
    "id": "boleh juga",
    "pl": "może być, w porządku"
  },
  "daily-14#0": {
    "cs": "koníček",
    "zh_cn": "爱好",
    "fr": "loisir, passe-temps",
    "de": "Hobby",
    "hu": "hobbi",
    "id": "hobi",
    "pl": "hobby"
  },
  "daily-14#1": {
    "cs": "fotbal",
    "zh_cn": "足球",
    "fr": "football",
    "de": "Fußball",
    "hu": "foci, labdarúgás",
    "id": "sepak bola",
    "pl": "piłka nożna"
  },
  "daily-14#2": {
    "cs": "volný den, dovolená",
    "zh_cn": "假日，休假",
    "fr": "jour de congé",
    "de": "freier Tag, Feiertag",
    "hu": "szabadnap",
    "id": "hari libur",
    "pl": "dzień wolny"
  },
  "daily-14#3": {
    "cs": "hráč",
    "zh_cn": "选手，球员",
    "fr": "joueur",
    "de": "Spieler",
    "hu": "játékos",
    "id": "pemain",
    "pl": "zawodnik"
  },
  "daily-14#4": {
    "cs": "fanoušek",
    "zh_cn": "粉丝，球迷",
    "fr": "fan, supporter",
    "de": "Fan",
    "hu": "rajongó, szurkoló",
    "id": "penggemar",
    "pl": "fan, kibic"
  },
  "daily-14#5": {
    "cs": "dobře hrát",
    "zh_cn": "玩得好，踢得棒",
    "fr": "bien jouer",
    "de": "gut spielen",
    "hu": "jól játszik",
    "id": "bermain dengan baik",
    "pl": "dobrze grać"
  },
  "daily-15#0": {
    "cs": "volný (čas)",
    "zh_cn": "有空，闲暇",
    "fr": "libre (temps)",
    "de": "frei (Zeit)",
    "hu": "szabad (idő)",
    "id": "luang, senggang",
    "pl": "wolny (czas)"
  },
  "daily-15#1": {
    "cs": "nebo",
    "zh_cn": "或者",
    "fr": "ou",
    "de": "oder",
    "hu": "vagy",
    "id": "atau",
    "pl": "lub, albo"
  },
  "daily-15#2": {
    "cs": "nakupovat",
    "zh_cn": "购物",
    "fr": "faire du shopping",
    "de": "einkaufen",
    "hu": "vásárolni",
    "id": "berbelanja",
    "pl": "robić zakupy"
  },
  "daily-15#3": {
    "cs": "akční film",
    "zh_cn": "动作片",
    "fr": "film d'action",
    "de": "Actionfilm",
    "hu": "akciófilm",
    "id": "film aksi",
    "pl": "film akcji"
  },
  "daily-15#4": {
    "cs": "komedie",
    "zh_cn": "喜剧片",
    "fr": "comédie",
    "de": "Komödie",
    "hu": "vígjáték",
    "id": "film komedi",
    "pl": "komedia"
  },
  "daily-15#5": {
    "cs": "více než, raději",
    "zh_cn": "更，比起",
    "fr": "plus que",
    "de": "mehr als, lieber",
    "hu": "jobban, inkább",
    "id": "lebih (dari)",
    "pl": "bardziej niż"
  },
  "daily-16#0": {
    "cs": "začít",
    "zh_cn": "开始",
    "fr": "commencer",
    "de": "beginnen",
    "hu": "kezdeni, elkezdeni",
    "id": "mulai",
    "pl": "zaczynać"
  },
  "daily-16#1": {
    "cs": "výslovnost",
    "zh_cn": "发音",
    "fr": "prononciation",
    "de": "Aussprache",
    "hu": "kiejtés",
    "id": "pelafalan",
    "pl": "wymowa"
  },
  "daily-16#2": {
    "cs": "prosím (výzva), -me",
    "zh_cn": "请，请务必",
    "fr": "veuillez (impératif)",
    "de": "bitte (Aufforderung)",
    "hu": "kérem (felszólítás)",
    "id": "silakan, mari (perintah)",
    "pl": "proszę (tryb rozkazujący)"
  },
  "daily-16#3": {
    "cs": "až sem, do tohoto místa",
    "zh_cn": "到这里",
    "fr": "jusqu'ici",
    "de": "bis hierher",
    "hu": "eddig",
    "id": "sampai di sini",
    "pl": "do tego miejsca"
  },
  "daily-16#4": {
    "cs": "test, zkouška",
    "zh_cn": "测验，考试",
    "fr": "test, examen",
    "de": "Test, Prüfung",
    "hu": "dolgozat, vizsga",
    "id": "tes, ujian",
    "pl": "sprawdzian, test"
  },
  "daily-16#5": {
    "cs": "těžký, obtížný",
    "zh_cn": "困难，难",
    "fr": "difficile",
    "de": "schwierig, schwer",
    "hu": "nehéz",
    "id": "sulit",
    "pl": "trudny"
  },
  "daily-17#0": {
    "cs": "vysokoškolský student",
    "zh_cn": "大学生",
    "fr": "étudiant",
    "de": "Student",
    "hu": "egyetemi hallgató",
    "id": "mahasiswa",
    "pl": "student"
  },
  "daily-17#1": {
    "cs": "cizí jazyk",
    "zh_cn": "外语",
    "fr": "langue étrangère",
    "de": "Fremdsprache",
    "hu": "idegen nyelv",
    "id": "bahasa asing",
    "pl": "język obcy"
  },
  "daily-17#2": {
    "cs": "už někdy, kdysi",
    "zh_cn": "曾经",
    "fr": "avoir déjà (fait)",
    "de": "schon einmal",
    "hu": "valaha, egykor",
    "id": "pernah",
    "pl": "kiedyś, już (zrobić)"
  },
  "daily-17#3": {
    "cs": "obor, specializace",
    "zh_cn": "专业，专长",
    "fr": "spécialité",
    "de": "Fachgebiet, Hauptfach",
    "hu": "szak, szakterület",
    "id": "jurusan, keahlian",
    "pl": "specjalność, kierunek"
  },
  "daily-17#4": {
    "cs": "obchod, podnikání",
    "zh_cn": "经营，商业",
    "fr": "commerce, affaires",
    "de": "Wirtschaft, Handel",
    "hu": "üzlet, kereskedelem",
    "id": "bisnis, perdagangan",
    "pl": "biznes, handel"
  },
  "daily-17#5": {
    "cs": "čím více ..., tím více ...",
    "zh_cn": "越…越…",
    "fr": "plus ... plus ...",
    "de": "je ... desto ...",
    "hu": "minél ..., annál ...",
    "id": "semakin ... semakin ...",
    "pl": "im ..., tym ..."
  },
  "daily-17#6": {
    "cs": "zajímavý, zábavný",
    "zh_cn": "有趣",
    "fr": "intéressant, amusant",
    "de": "interessant, spannend",
    "hu": "érdekes, élvezetes",
    "id": "menarik",
    "pl": "ciekawy, interesujący"
  },
  "daily-18#0": {
    "cs": "počasí",
    "zh_cn": "天气",
    "fr": "temps, météo",
    "de": "Wetter",
    "hu": "időjárás",
    "id": "cuaca",
    "pl": "pogoda"
  },
  "daily-18#1": {
    "cs": "slunečno",
    "zh_cn": "晴天，出太阳",
    "fr": "ensoleillé",
    "de": "sonnig",
    "hu": "napos",
    "id": "cerah, terik",
    "pl": "słonecznie"
  },
  "daily-18#2": {
    "cs": "horký, horko",
    "zh_cn": "热",
    "fr": "chaud",
    "de": "heiß",
    "hu": "meleg, forró",
    "id": "panas",
    "pl": "gorąco"
  },
  "daily-18#3": {
    "cs": "podzim",
    "zh_cn": "秋天",
    "fr": "automne",
    "de": "Herbst",
    "hu": "ősz",
    "id": "musim gugur",
    "pl": "jesień"
  },
  "daily-18#4": {
    "cs": "jasný, čistý",
    "zh_cn": "清澈，晴朗",
    "fr": "clair, dégagé",
    "de": "klar, hell",
    "hu": "tiszta, derült",
    "id": "jernih, cerah",
    "pl": "czysty, pogodny"
  },
  "daily-18#5": {
    "cs": "chladivý, osvěžující",
    "zh_cn": "凉爽",
    "fr": "frais",
    "de": "kühl, erfrischend",
    "hu": "hűvös, kellemes",
    "id": "sejuk",
    "pl": "chłodny, orzeźwiający"
  },
  "daily-19#0": {
    "cs": "cestovat",
    "zh_cn": "旅游",
    "fr": "voyager",
    "de": "reisen",
    "hu": "utazni",
    "id": "berwisata",
    "pl": "podróżować"
  },
  "daily-19#1": {
    "cs": "odlišný od",
    "zh_cn": "与…不同",
    "fr": "différent de",
    "de": "anders als",
    "hu": "különbözik valamitől",
    "id": "berbeda dengan",
    "pl": "różny od"
  },
  "daily-19#2": {
    "cs": "celý rok",
    "zh_cn": "整年，全年",
    "fr": "toute l'année",
    "de": "das ganze Jahr",
    "hu": "egész évben",
    "id": "sepanjang tahun",
    "pl": "przez cały rok"
  },
  "daily-19#3": {
    "cs": "období dešťů",
    "zh_cn": "雨季",
    "fr": "saison des pluies",
    "de": "Regenzeit",
    "hu": "esős évszak",
    "id": "musim hujan",
    "pl": "pora deszczowa"
  },
  "daily-19#4": {
    "cs": "období sucha",
    "zh_cn": "旱季",
    "fr": "saison sèche",
    "de": "Trockenzeit",
    "hu": "száraz évszak",
    "id": "musim kemarau",
    "pl": "pora sucha"
  },
  "daily-19#5": {
    "cs": "jestli, pokud",
    "zh_cn": "如果",
    "fr": "si",
    "de": "wenn, falls",
    "hu": "ha",
    "id": "jika, kalau",
    "pl": "jeśli"
  },
  "daily-20#0": {
    "cs": "co se děje, co ti je",
    "zh_cn": "怎么了，哪里不舒服",
    "fr": "qu'est-ce qui ne va pas",
    "de": "was ist los",
    "hu": "mi a baj",
    "id": "ada apa, kenapa",
    "pl": "co się stało"
  },
  "daily-20#1": {
    "cs": "bolest v krku",
    "zh_cn": "喉咙痛",
    "fr": "mal de gorge",
    "de": "Halsschmerzen",
    "hu": "torokfájás",
    "id": "sakit tenggorokan",
    "pl": "ból gardła"
  },
  "daily-20#2": {
    "cs": "horečka",
    "zh_cn": "发烧",
    "fr": "fièvre",
    "de": "Fieber",
    "hu": "láz",
    "id": "demam",
    "pl": "gorączka"
  },
  "daily-20#3": {
    "cs": "lékař",
    "zh_cn": "医生",
    "fr": "médecin",
    "de": "Arzt",
    "hu": "orvos",
    "id": "dokter",
    "pl": "lekarz"
  },
  "daily-20#4": {
    "cs": "vzít si lék",
    "zh_cn": "吃药",
    "fr": "prendre un médicament",
    "de": "Medizin einnehmen",
    "hu": "gyógyszert bevenni",
    "id": "minum obat",
    "pl": "brać lekarstwo"
  },
  "daily-20#5": {
    "cs": "nemocnice",
    "zh_cn": "医院",
    "fr": "hôpital",
    "de": "Krankenhaus",
    "hu": "kórház",
    "id": "rumah sakit",
    "pl": "szpital"
  },
  "daily-20#6": {
    "cs": "uzdravit se",
    "zh_cn": "痊愈，病好",
    "fr": "guérir",
    "de": "gesund werden",
    "hu": "meggyógyulni",
    "id": "sembuh",
    "pl": "wyzdrowieć"
  },
  "daily-21#0": {
    "cs": "vyšetřit (pacienta), jít k lékaři",
    "zh_cn": "看诊，诊察",
    "fr": "examiner, consulter",
    "de": "untersuchen, zum Arzt gehen",
    "hu": "megvizsgálni, orvoshoz menni",
    "id": "memeriksa, berobat",
    "pl": "zbadać, iść do lekarza"
  },
  "daily-21#1": {
    "cs": "nachlazení, chřipka",
    "zh_cn": "感冒",
    "fr": "rhume, grippe",
    "de": "Erkältung, Grippe",
    "hu": "megfázás, influenza",
    "id": "masuk angin, flu",
    "pl": "przeziębienie, grypa"
  },
  "daily-21#2": {
    "cs": "vážný, těžký",
    "zh_cn": "严重，重",
    "fr": "grave, lourd",
    "de": "schwer, ernst",
    "hu": "súlyos, nehéz",
    "id": "parah, berat",
    "pl": "poważny, ciężki"
  },
  "daily-21#3": {
    "cs": "unavený",
    "zh_cn": "疲惫，累",
    "fr": "fatigué",
    "de": "müde",
    "hu": "fáradt",
    "id": "lelah, capek",
    "pl": "zmęczony"
  },
  "daily-21#4": {
    "cs": "odpočívat",
    "zh_cn": "休息",
    "fr": "se reposer",
    "de": "sich ausruhen",
    "hu": "pihenni",
    "id": "beristirahat",
    "pl": "odpoczywać"
  },
  "daily-21#5": {
    "cs": "hodně práce",
    "zh_cn": "很多事，忙碌",
    "fr": "beaucoup de travail",
    "de": "viel Arbeit",
    "hu": "sok munka",
    "id": "banyak pekerjaan",
    "pl": "dużo pracy"
  }
}

DAILY_AI_PHRASES = {
  "phrase-01": {
    "cs": "Dobrý den.",
    "zh_cn": "你好。",
    "fr": "Bonjour.",
    "de": "Guten Tag.",
    "hu": "Jó napot.",
    "id": "Halo.",
    "pl": "Dzień dobry."
  },
  "phrase-02": {
    "cs": "Jak se máš?",
    "zh_cn": "你好吗？",
    "fr": "Comment vas-tu ?",
    "de": "Wie geht es dir?",
    "hu": "Hogy vagy?",
    "id": "Bagaimana kabarmu?",
    "pl": "Jak się masz?"
  },
  "phrase-03": {
    "cs": "Velmi rád tě poznávám.",
    "zh_cn": "很高兴认识你。",
    "fr": "Je suis très heureux de vous rencontrer.",
    "de": "Sehr erfreut, Sie kennenzulernen.",
    "hu": "Nagyon örülök a találkozásnak.",
    "id": "Saya sangat senang bertemu dengan Anda.",
    "pl": "Bardzo miło mi cię poznać."
  },
  "phrase-04": {
    "cs": "Promiňte, zopakujte to prosím.",
    "zh_cn": "不好意思，请再说一遍。",
    "fr": "Excusez-moi, répétez s'il vous plaît.",
    "de": "Entschuldigung, bitte wiederholen Sie es.",
    "hu": "Elnézést, kérem ismételje meg.",
    "id": "Maaf, tolong ulangi lagi.",
    "pl": "Przepraszam, proszę powtórzyć."
  },
  "phrase-05": {
    "cs": "Z jaké země pocházíš?",
    "zh_cn": "你是哪国人？",
    "fr": "De quel pays viens-tu ?",
    "de": "Aus welchem Land kommst du?",
    "hu": "Melyik országból származol?",
    "id": "Dari negara mana kamu berasal?",
    "pl": "Z jakiego kraju pochodzisz?"
  },
  "phrase-06": {
    "cs": "Mluvíš vietnamsky opravdu dobře!",
    "zh_cn": "你的越南语说得真好！",
    "fr": "Vous parlez vraiment très bien vietnamien !",
    "de": "Du sprichst wirklich sehr gut Vietnamesisch!",
    "hu": "Nagyon jól beszélsz vietnámiul!",
    "id": "Bahasa Vietnammu bagus sekali!",
    "pl": "Naprawdę świetnie mówisz po wietnamsku!"
  },
  "phrase-07": {
    "cs": "Kde bydlíš?",
    "zh_cn": "你住在哪里？",
    "fr": "Où habites-tu ?",
    "de": "Wo wohnst du?",
    "hu": "Hol laksz?",
    "id": "Di mana kamu tinggal?",
    "pl": "Gdzie mieszkasz?"
  },
  "phrase-08": {
    "cs": "S kým bydlíš?",
    "zh_cn": "你和谁住在一起？",
    "fr": "Avec qui habitez-vous ?",
    "de": "Mit wem wohnst du zusammen?",
    "hu": "Kivel laksz?",
    "id": "Kamu tinggal dengan siapa?",
    "pl": "Z kim mieszkasz?"
  },
  "phrase-09": {
    "cs": "Kolik je teď hodin?",
    "zh_cn": "现在几点？",
    "fr": "Quelle heure est-il maintenant ?",
    "de": "Wie spät ist es jetzt?",
    "hu": "Hány óra van most?",
    "id": "Sekarang jam berapa?",
    "pl": "Która jest teraz godzina?"
  },
  "phrase-10": {
    "cs": "Pojďme za hodinu.",
    "zh_cn": "一个小时后再去吧。",
    "fr": "Partons dans une heure.",
    "de": "Gehen wir in einer Stunde.",
    "hu": "Menjünk egy óra múlva.",
    "id": "Ayo pergi satu jam lagi.",
    "pl": "Chodźmy za godzinę."
  },
  "phrase-11": {
    "cs": "Co je tohle za ovoce?",
    "zh_cn": "这是什么水果？",
    "fr": "Quel fruit est-ce ?",
    "de": "Was für eine Frucht ist das?",
    "hu": "Ez milyen gyümölcs?",
    "id": "Ini buah apa?",
    "pl": "Co to za owoc?"
  },
  "phrase-12": {
    "cs": "Kolik stojí kilo pomerančů?",
    "zh_cn": "一公斤橙子多少钱？",
    "fr": "Combien coûte un kilo d'oranges ?",
    "de": "Wie viel kostet ein Kilo Orangen?",
    "hu": "Mennyibe kerül egy kiló narancs?",
    "id": "Berapa harga 1 kg jeruk?",
    "pl": "Ile kosztuje kilogram pomarańczy?"
  },
  "phrase-13": {
    "cs": "Proč je to tak drahé?",
    "zh_cn": "为什么这么贵？",
    "fr": "Pourquoi est-ce si cher ?",
    "de": "Warum so teuer?",
    "hu": "Miért ilyen drága?",
    "id": "Mengapa begitu mahal?",
    "pl": "Dlaczego to takie drogie?"
  },
  "phrase-14": {
    "cs": "Slevte mi prosím trochu.",
    "zh_cn": "请给我便宜一点吧。",
    "fr": "Faites-moi une petite réduction s'il vous plaît.",
    "de": "Geben Sie mir bitte etwas Rabatt.",
    "hu": "Engedjen el egy kicsit az árból.",
    "id": "Tolong beri sedikit diskon.",
    "pl": "Proszę opuścić trochę z ceny."
  },
  "phrase-15": {
    "cs": "Už jste jedl(a)?",
    "zh_cn": "你吃饭了吗？",
    "fr": "Avez-vous déjà mangé ?",
    "de": "Haben Sie schon gegessen?",
    "hu": "Ettél már?",
    "id": "Apakah Anda sudah makan?",
    "pl": "Czy już pan/pani jadł(a)?"
  },
  "phrase-16": {
    "cs": "Promiňte, ukažte mi prosím menu.",
    "zh_cn": "请给我看一下菜单。",
    "fr": "S'il vous plaît, montrez-moi le menu.",
    "de": "Entschuldigung, zeigen Sie mir bitte die Speisekarte.",
    "hu": "Elnézést, kérem mutassa meg az étlapot.",
    "id": "Permisi, tolong perlihatkan menunya.",
    "pl": "Przepraszam, proszę mi pokazać menu."
  },
  "phrase-17": {
    "cs": "Dejte mi prosím jednu misku hovězího pho.",
    "zh_cn": "请给我一碗牛肉河粉。",
    "fr": "Donnez-moi un bol de phở au bœuf s'il vous plaît.",
    "de": "Geben Sie mir bitte eine Schüssel Rindfleisch-Phở.",
    "hu": "Kérek egy tál marhahúsos phót.",
    "id": "Tolong beri saya semangkuk pho daging sapi.",
    "pl": "Poproszę miskę pho z wołowiną."
  },
  "phrase-18": {
    "cs": "Čím obvykle jezdíte do práce?",
    "zh_cn": "上班时通常搭乘什么交通工具？",
    "fr": "Comment allez-vous d'habitude au travail ?",
    "de": "Womit fahren Sie gewöhnlich zur Arbeit?",
    "hu": "Mivel szoktál munkába járni?",
    "id": "Saat bekerja biasanya naik apa?",
    "pl": "Czym zazwyczaj dojeżdża pan/pani do pracy?"
  },
  "phrase-19": {
    "cs": "Je těžké naučit se jezdit na motorce?",
    "zh_cn": "学骑摩托车难吗？",
    "fr": "Est-ce difficile d'apprendre à conduire une moto ?",
    "de": "Ist es schwer, Motorradfahren zu lernen?",
    "hu": "Nehéz megtanulni motorkerékpárt vezetni?",
    "id": "Apakah sulit belajar mengendarai sepeda motor?",
    "pl": "Czy trudno jest nauczyć się jeździć motocyklem?"
  },
  "phrase-20": {
    "cs": "Jaký je tvůj koníček?",
    "zh_cn": "你的爱好是什么？",
    "fr": "Quel est ton loisir ?",
    "de": "Was ist dein Hobby?",
    "hu": "Mi a hobbid?",
    "id": "Apa hobimu?",
    "pl": "Jakie masz hobby?"
  },
  "phrase-21": {
    "cs": "Co obvykle děláte ve volném čase?",
    "zh_cn": "有空的时候通常做什么？",
    "fr": "Que faites-vous d'habitude pendant votre temps libre ?",
    "de": "Was machen Sie gewöhnlich in Ihrer Freizeit?",
    "hu": "Mit szoktál csinálni a szabadidődben?",
    "id": "Di waktu luang biasanya melakukan apa?",
    "pl": "Co zazwyczaj pan/pani robi w wolnym czasie?"
  },
  "phrase-22": {
    "cs": "Má ještě někdo nějaké otázky?",
    "zh_cn": "还有谁要提问吗？",
    "fr": "Y a-t-il d'autres questions ?",
    "de": "Gibt es noch weitere Fragen?",
    "hu": "Van még valakinek kérdése?",
    "id": "Ada yang ingin bertanya lagi?",
    "pl": "Czy ktoś ma jeszcze pytania?"
  },
  "phrase-23": {
    "cs": "Jaké je dnes počasí?",
    "zh_cn": "今天天气怎么样？",
    "fr": "Quel temps fait-il aujourd'hui ?",
    "de": "Wie ist das Wetter heute?",
    "hu": "Milyen ma az időjárás?",
    "id": "Bagaimana cuaca hari ini?",
    "pl": "Jaka jest dzisiaj pogoda?"
  },
  "phrase-24": {
    "cs": "Bratře, co se ti stalo?",
    "zh_cn": "哥，你哪里不舒服？",
    "fr": "Frère, qu'est-ce qui ne va pas ?",
    "de": "Bruder, was fehlt dir?",
    "hu": "Testvér, mi a bajod?",
    "id": "Kak, ada apa denganmu?",
    "pl": "Bracie, co ci dolega?"
  },
  "phrase-25": {
    "cs": "Přeji ti brzké uzdravení.",
    "zh_cn": "祝你早日康复。",
    "fr": "Je vous souhaite un prompt rétablissement.",
    "de": "Gute Besserung, werden Sie bald gesund.",
    "hu": "Mielőbbi felépülést kívánok.",
    "id": "Semoga lekas sembuh.",
    "pl": "Życzę szybkiego powrotu do zdrowia."
  },
  "phrase-26": {
    "cs": "Pijte hodně vody a odpočívejte, pak se uzdravíte.",
    "zh_cn": "多喝水、多休息就会好起来的。",
    "fr": "Buvez beaucoup d'eau et reposez-vous, vous guérirez.",
    "de": "Trinken Sie viel Wasser und ruhen Sie sich aus, dann erholen Sie sich.",
    "hu": "Igyon sok vizet és pihenjen, akkor meggyógyul.",
    "id": "Minum banyak air dan istirahatlah maka akan sembuh.",
    "pl": "Pij dużo wody i odpoczywaj, a wyzdrowiejesz."
  }
}


def _fill(target, extra):
    added = []
    for lang, text in (extra or {}).items():
        if text and not target.get(lang):
            target[lang] = text
            added.append(lang)
    return added


def apply_daily_ai_translations(conversations):
    """Return a copy of DAILY_CONVERSATIONS with the missing languages filled in."""
    out = copy.deepcopy(conversations)
    for conv in out:
        cid = conv["id"]
        added = set(_fill(conv["title"], DAILY_AI_TITLES.get(cid)))
        for i, turn in enumerate(conv["turns"]):
            added.update(_fill(turn, DAILY_AI_TURNS.get(cid + "#" + str(i))))
            added.update(_fill(turn["who"], DAILY_AI_WHO.get(turn["who"].get("vi"))))
        for i, word in enumerate(conv.get("vocab", [])):
            added.update(_fill(word, DAILY_AI_VOCAB.get(cid + "#" + str(i))))
        conv["aiLangs"] = [lang for lang in DAILY_AI_LANGS if lang in added]
    return out


def apply_daily_phrase_ai_translations(phrases):
    out = copy.deepcopy(phrases)
    for p in out:
        added = _fill(p, DAILY_AI_PHRASES.get(p["id"]))
        p["aiLangs"] = [lang for lang in DAILY_AI_LANGS if lang in added]
    return out
