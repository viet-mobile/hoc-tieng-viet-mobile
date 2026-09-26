# -*- coding: utf-8 -*-
"""Completes the [과정] course texts to all 12 UI languages.

curriculum_data.py (WEEK16_TOC / WELCOME_TEXT / COURSE_PHASES), weekly_assignments_data.py
(WEEKLY_ASSIGNMENTS) and ulsan_data.py were written when the site had ko/zh/en/ja (+ de/fr/pl
added later); cs, zh_cn, hu, id and vi were never added to them, so every one of those course
texts rendered blank in those five languages. These texts are the site's own course wording
(study plans, vocabulary ranges, talk numbers, schedule notes) -- not publication text -- so the
missing languages are filled here at build time, never by copying another language:

  * numbered patterns ("오늘의 어휘 학습 (상용 1~40번)") through COURSE_TEMPLATES, whose names of
    site sections reuse the site's own UI labels for them (I18N_UI in app_logic.js);
  * every other sentence through COURSE_TEXT (Korean source text -> the five languages).

Existing languages are never overwritten. complete_course_texts() raises on any course text that
would still miss a language, so a new untranslated course line fails the build instead of showing
up blank.
"""
import re

HANGUL = re.compile(r"[가-힣]")

ALL_LANGS = ["vi", "cs", "zh_cn", "zh", "en", "fr", "de", "hu", "id", "ja", "ko", "pl"]
ADDED_LANGS = ["vi", "cs", "zh_cn", "hu", "id"]

# Vocabulary category names used inside the course lines (site labels, as in the [어휘] menus).
VOCAB_CATEGORY = {
    "상용": {"vi": "thông dụng", "cs": "běžná slova", "zh_cn": "常用", "hu": "gyakori szavak", "id": "kata umum"},
    "동일음": {"vi": "đồng âm", "cs": "stejně znějící", "zh_cn": "同音", "hu": "azonos hangzás", "id": "homofon"},
    "한자음": {"vi": "Hán Việt", "cs": "sino-vietnamská", "zh_cn": "汉字音", "hu": "sino-vietnámi", "id": "Sino-Vietnam"},
    "신권": {"vi": "thần quyền", "cs": "teokratická", "zh_cn": "神治", "hu": "teokratikus", "id": "teokratis"},
    "인명": {"vi": "tên riêng", "cs": "jména", "zh_cn": "人名", "hu": "nevek", "id": "nama"},
    "반의": {"vi": "trái nghĩa", "cs": "antonyma", "zh_cn": "反义", "hu": "ellentétek", "id": "antonim"},
    "기본": {"vi": "cơ bản", "cs": "základní", "zh_cn": "基本", "hu": "alapszavak", "id": "dasar"},
    "끝말": {"vi": "nối từ", "cs": "slovní řetězec", "zh_cn": "接龙", "hu": "szólánc", "id": "rantai kata"},
    "어순반대": {"vi": "đảo trật tự", "cs": "obrácený slovosled", "zh_cn": "语序相反", "hu": "fordított szórend", "id": "urutan terbalik"},
    "남북 단어": {"vi": "từ Bắc/Nam", "cs": "severní/jižní slova", "zh_cn": "南北词汇", "hu": "északi/déli szavak", "id": "kata Utara/Selatan"},
}

# Publication / section names as the site already labels them ([문장] > [파수대], [대화] > [제공 연설]).
WATCHTOWER = {"vi": "Tháp Canh", "cs": "Strážná věž", "zh_cn": "守望台", "hu": "Őrtorony", "id": "Menara Pengawal"}
OFFER_TALK = {"vi": "Bài giảng mẫu", "cs": "Vzorový rozhovor", "zh_cn": "传道示范", "hu": "Beszédminta", "id": "Khotbah Contoh"}


def _range(a, b, lang):
    return "%s~%s" % (a, b) if lang == "zh_cn" else "%s–%s" % (a, b)


COURSE_TEMPLATES = [
    (re.compile(r"^오늘의 어휘 학습 \((.+?) (\d+)~(\d+)번\)$"), lambda m, l: {
        "vi": "Học từ vựng hôm nay ({c} {r})", "cs": "Dnešní slovíčka ({c} {r})", "zh_cn": "今日词汇学习（{c} {r}）",
        "hu": "Mai szókincs ({c} {r}.)", "id": "Belajar kosakata hari ini ({c} {r})"}[l].format(
        c=VOCAB_CATEGORY[m.group(1)][l], r=_range(m.group(2), m.group(3), l))),
    (re.compile(r"^베트남어 어휘 학습 (\d+)주차 \((.+?) (\d+)~(\d+)번\)$"), lambda m, l: {
        "vi": "Học từ vựng tiếng Việt tuần {w} ({c} {r})", "cs": "Vietnamská slovní zásoba – {w}. týden ({c} {r})",
        "zh_cn": "越南语词汇学习 第{w}周（{c} {r}）", "hu": "Vietnami szókincs – {w}. hét ({c} {r}.)",
        "id": "Kosakata bahasa Vietnam minggu ke-{w} ({c} {r})"}[l].format(
        w=m.group(1), c=VOCAB_CATEGORY[m.group(2)][l], r=_range(m.group(3), m.group(4), l))),
    (re.compile(r"^베트남어 파수대 어휘 (\d+)개 학습 (\d+)주차$"), lambda m, l: {
        "vi": "Học {n} từ vựng {t} tiếng Việt – tuần {w}", "cs": "{n} slovíček ze {t2} – {w}. týden",
        "zh_cn": "越南语《{t}》词汇 {n} 个 第{w}周", "hu": "{n} vietnami {t}-szó – {w}. hét",
        "id": "{n} kosakata {t} bahasa Vietnam minggu ke-{w}"}[l].format(
        n=m.group(1), w=m.group(2), t=WATCHTOWER[l], t2="Strážné věže")),
    (re.compile(r"^베트남어 파수대 어휘 (\d+)개 학습$"), lambda m, l: {
        "vi": "Học {n} từ vựng {t} tiếng Việt", "cs": "{n} slovíček ze Strážné věže",
        "zh_cn": "越南语《{t}》词汇 {n} 个", "hu": "{n} vietnami {t}-szó", "id": "{n} kosakata {t} bahasa Vietnam"}[l].format(
        n=m.group(1), t=WATCHTOWER[l])),
    (re.compile(r"^오늘의 파수대 어휘 (\d+)개 학습$"), lambda m, l: {
        "vi": "Học {n} từ vựng {t} hôm nay", "cs": "Dnešních {n} slovíček ze Strážné věže",
        "zh_cn": "今日《{t}》词汇 {n} 个", "hu": "Mai {n} {t}-szó", "id": "{n} kosakata {t} hari ini"}[l].format(
        n=m.group(1), t=WATCHTOWER[l])),
    (re.compile(r"^베트남어 제공 연설 (\d+) \(집회 초대\)$"), lambda m, l: {
        "vi": "{t} tiếng Việt {n} (mời dự buổi nhóm họp)", "cs": "{t} ve vietnamštině č. {n} (pozvání na shromáždění)",
        "zh_cn": "越南语{t} {n}（邀请参加聚会）", "hu": "Vietnami {t} {n}. (meghívás az összejövetelre)",
        "id": "{t} bahasa Vietnam {n} (undangan ke perhimpunan)"}[l].format(n=m.group(1), t=OFFER_TALK[l])),
    (re.compile(r"^베트남어 제공 연설 (\d+)$"), lambda m, l: {
        "vi": "{t} tiếng Việt {n}", "cs": "{t} ve vietnamštině č. {n}", "zh_cn": "越南语{t} {n}",
        "hu": "Vietnami {t} {n}.", "id": "{t} bahasa Vietnam {n}"}[l].format(n=m.group(1), t=OFFER_TALK[l])),
    (re.compile(r"^제공 연설 ([\d,]+) 복습$"), lambda m, l: {
        "vi": "Ôn {t} {n}", "cs": "Opakování: {t} {n}", "zh_cn": "复习{t} {n}", "hu": "Ismétlés: {t} {n}.",
        "id": "Ulasan {t} {n}"}[l].format(n=m.group(1).replace(",", ", "), t=OFFER_TALK[l])),
    (re.compile(r"^베트남어 노래 \((\d+)번\)$"), lambda m, l: {
        "vi": "Bài hát tiếng Việt (số {n})", "cs": "Vietnamská píseň č. {n}", "zh_cn": "越南语诗歌（第{n}首）",
        "hu": "Vietnami ének ({n}.)", "id": "Lagu bahasa Vietnam (no. {n})"}[l].format(n=m.group(1))),
    (re.compile(r"^베트남어 성경 책명 읽기 연습 (\d+)$"), lambda m, l: {
        "vi": "Luyện đọc tên các sách Kinh Thánh tiếng Việt {n}", "cs": "Čtení názvů biblických knih ve vietnamštině {n}",
        "zh_cn": "越南语圣经书名朗读练习 {n}", "hu": "Vietnami bibliai könyvnevek olvasása {n}.",
        "id": "Latihan membaca nama kitab Alkitab bahasa Vietnam {n}"}[l].format(n=m.group(1))),
    (re.compile(r"^(\d+)-(\d+)주$"), lambda m, l: {
        "vi": "Tuần {a}–{b}", "cs": "{a}.–{b}. týden", "zh_cn": "第{a}–{b}周", "hu": "{a}–{b}. hét",
        "id": "Minggu {a}–{b}"}[l].format(a=m.group(1), b=m.group(2))),
]

# Every other course sentence: Korean source text -> the five languages.
KOREAN_LEAK_FIX = {
    "“행누” 베트남어를 주 교재로 해서 베트남어 읽기 연습을 합니다.": {"zh": "以越南語版《永遠享受美好的生命》為主要教材，進行越南語閱讀練習。", "en": "You will practice reading Vietnamese using the Vietnamese edition of Enjoy Life Forever as the main textbook.", "ja": "ベトナム語版「いつまでも幸せに暮らせます」を主な教材として、ベトナム語の読解練習を行います。", "de": "Anhand der vietnamesischen Ausgabe von „Glücklich – für immer“ als Hauptlehrbuch üben wir das Lesen auf Vietnamesisch.", "fr": "Nous nous exercerons à la lecture en vietnamien avec pour manuel principal l’édition vietnamienne de « Vivez pour toujours ! ».", "pl": "Będziemy ćwiczyć czytanie po wietnamsku, opierając się głównie na wietnamskim wydaniu książki „Już zawsze ciesz się życiem!”."},
    "신권 용어, 주요 인물 발음 연습(훈책)": {"en": "Theocratic terms, pronunciation practice for key Bible characters (course handbook)", "ja": "神権用語、主要人物の発音練習（訓練冊子）", "zh": "神權用語、重要人物發音練習（訓練手冊）"},
    "베트남어 출판물 읽기 연습 (행누, 랑제)": {"en": "Vietnamese Publication Reading Practice (Enjoy Life Forever, Love People—Make Disciples)", "ja": "ベトナム語出版物の読解練習（いつまでも幸せに暮らせます、愛を込めて弟子を育てる）", "zh": "越南語出版物閱讀練習（《永遠享受美好的生命》、《用愛心幫助人成為基督徒》）", "de": "Leseübung mit vietnamesischen Publikationen (Glücklich – für immer, Menschen lieben – Jünger machen)", "fr": "Entraînement à la lecture de publications en vietnamien (Vivez pour toujours !, Aimez les gens, faites des disciples)", "pl": "Ćwiczenie czytania publikacji wietnamskich (Już zawsze ciesz się życiem!, Kochaj ludzi — pozyskuj uczniów)"},
    "행누책 읽기": {"en": "Reading Enjoy Life Forever", "ja": "「いつまでも幸せに暮らせます」を読む", "zh": "閱讀《永遠享受美好的生命》", "de": "Lesen im Buch „Glücklich – für immer“", "fr": "Lecture du livre « Vivez pour toujours ! »", "pl": "Czytanie książki „Już zawsze ciesz się życiem!”"},
}

COURSE_TEXT = {
    "베트남어 학습반에 오신 여러분을 환영합니다!!": {"vi": "Chào mừng các bạn đến với lớp học tiếng Việt!!", "cs": "Vítejte v kurzu vietnamštiny!!", "zh_cn": "欢迎各位来到越南语学习班！！", "hu": "Üdvözöljük a vietnami nyelvtanfolyamon!!", "id": "Selamat datang di kelas bahasa Vietnam!!"},
    "이 학습반은 베트남어로 좋은 소식을 전파하기 위해 마련된 것입니다.": {"vi": "Lớp học này được tổ chức để giúp rao truyền tin mừng bằng tiếng Việt.", "cs": "Tento kurz byl připraven jako pomoc při kázání dobré zprávy ve vietnamštině.", "zh_cn": "这个学习班是为了用越南语传讲好消息而设立的。", "hu": "Ez a tanfolyam azért jött létre, hogy segítsen a jó hír vietnami nyelven történő prédikálásában.", "id": "Kelas ini diadakan untuk membantu memberitakan kabar baik dalam bahasa Vietnam."},
    "이 과정은 베트남어에 대해 철저히 연구하기 위한 것이 아니라 형제 자매들이 베트남어의 기초를 배우도록 도움을 주기 위한 것입니다.": {"vi": "Khóa học này không nhằm nghiên cứu sâu về tiếng Việt, mà để giúp các anh chị em học những điều cơ bản của tiếng Việt.", "cs": "Cílem kurzu není důkladné studium vietnamštiny, ale pomoci bratrům a sestrám naučit se její základy.", "zh_cn": "这个课程并非要对越南语进行深入研究，而是要帮助弟兄姊妹学习越南语的基础。", "hu": "A tanfolyam célja nem a vietnami nyelv alapos tanulmányozása, hanem az, hogy a testvérek elsajátítsák az alapjait.", "id": "Kursus ini bukan untuk mempelajari bahasa Vietnam secara mendalam, melainkan untuk membantu saudara-saudari mempelajari dasar-dasarnya."},
    "형제 자매들은 이 학습반이 끝난 후 야외 봉사에서 정기적으로 베트남어를 사용하고 베트남어 회중이나 집단의 활동에 참여함으로 계속 발전하게 될 것입니다.": {"vi": "Sau khóa học, các anh chị em sẽ tiếp tục tiến bộ bằng cách thường xuyên dùng tiếng Việt trong thánh chức và tham gia các hoạt động của hội thánh hoặc nhóm tiếng Việt.", "cs": "Po skončení kurzu budou bratři a sestry dál pokračovat v pokroku tím, že budou vietnamštinu pravidelně používat ve službě a zapojí se do činnosti vietnamského sboru nebo skupiny.", "zh_cn": "学习班结束后，弟兄姊妹会在传道工作中经常使用越南语，并参加越南语会众或小组的活动，从而继续进步。", "hu": "A tanfolyam után a testvérek tovább fejlődnek, ha rendszeresen használják a vietnami nyelvet a szolgálatban, és részt vesznek egy vietnami gyülekezet vagy csoport tevékenységében.", "id": "Setelah kelas ini, saudara-saudari akan terus maju dengan rutin menggunakan bahasa Vietnam dalam pelayanan dan ikut dalam kegiatan sidang atau kelompok bahasa Vietnam."},
    "이 학습반은 16주간 운영되며 교과 과정은 아래와 같습니다.": {"vi": "Lớp học kéo dài 16 tuần với chương trình như sau.", "cs": "Kurz trvá 16 týdnů a jeho osnova je následující.", "zh_cn": "本学习班为期16周，课程安排如下。", "hu": "A tanfolyam 16 hétig tart, tanterve a következő.", "id": "Kelas ini berlangsung 16 minggu dengan kurikulum sebagai berikut."},
    "베트남어의 기초": {"vi": "Nền tảng tiếng Việt", "cs": "Základy vietnamštiny", "zh_cn": "越南语基础", "hu": "A vietnami nyelv alapjai", "id": "Dasar-dasar bahasa Vietnam"},
    "베트남어의 자음과 모음 발음법, 성서 책명, 인명 등을 함께 공부합니다. 베트남어의 가장 큰 특징인 성조를 익히고 계속 연습합니다. 성조는 학습반 기간 동안 계속 반복적으로 학습해서 익혀 나가도록 합니다.": {"vi": "Chúng ta học cách phát âm phụ âm và nguyên âm, tên các sách Kinh Thánh, tên người, v.v. Chúng ta học và luyện tập thanh điệu, đặc điểm nổi bật nhất của tiếng Việt, và tiếp tục ôn luyện suốt khóa học.", "cs": "Společně se učíme výslovnost vietnamských souhlásek a samohlásek, názvy biblických knih, jména osob a další. Osvojujeme si tóny, nejvýraznější rys vietnamštiny, a procvičujeme je po celou dobu kurzu.", "zh_cn": "一起学习越南语辅音和元音的发音、圣经书名、人名等。学习并持续练习越南语最大的特点——声调，在整个学习班期间反复练习，逐步掌握。", "hu": "Együtt tanuljuk a vietnami mássalhangzók és magánhangzók kiejtését, a bibliai könyvek neveit, személyneveket stb. Elsajátítjuk és folyamatosan gyakoroljuk a tónusokat, a vietnami nyelv legfőbb jellemzőjét, a tanfolyam egész ideje alatt.", "id": "Kita bersama-sama mempelajari cara melafalkan konsonan dan vokal, nama kitab Alkitab, nama tokoh, dan lainnya. Kita mempelajari nada, ciri paling khas bahasa Vietnam, dan terus melatihnya selama kelas berlangsung."},
    "봉사의 직무에서 바로 활용할 수 있는 기본적인 제공 연설을 공부하고 훈련합니다.": {"vi": "Học và luyện tập các bài giảng mẫu cơ bản có thể dùng ngay trong thánh chức.", "cs": "Studujeme a nacvičujeme základní vzorové rozhovory, které lze hned použít ve službě.", "zh_cn": "学习并练习可以直接用于传道工作的基本传道示范。", "hu": "Tanulmányozzuk és gyakoroljuk azokat az alapvető beszédmintákat, amelyeket azonnal használhatunk a szolgálatban.", "id": "Mempelajari dan melatih khotbah contoh dasar yang bisa langsung digunakan dalam pelayanan."},
    "첫 한 달 수업 과정이 끝난 후 베트남어 집회에 참석하신다면 유익할 것입니다.": {"vi": "Sau tháng học đầu tiên, việc tham dự các buổi nhóm họp tiếng Việt sẽ có ích cho anh chị.", "cs": "Po prvním měsíci kurzu vám prospěje, když začnete navštěvovat vietnamská shromáždění.", "zh_cn": "第一个月的课程结束后，参加越南语聚会会很有益处。", "hu": "Az első hónap után hasznos lesz, ha részt vesz a vietnami nyelvű összejöveteleken.", "id": "Setelah bulan pertama kelas, akan bermanfaat bila Anda menghadiri perhimpunan berbahasa Vietnam."},
    "베트남어 단어와 작문 수업, 베트남어 출판물 읽기 연습": {"vi": "Học từ vựng và tập viết câu tiếng Việt, luyện đọc ấn phẩm tiếng Việt", "cs": "Vietnamská slovní zásoba a skládání vět, čtení vietnamských publikací", "zh_cn": "越南语词汇与写作课程、越南语出版物阅读练习", "hu": "Vietnami szókincs és mondatalkotás, vietnami kiadványok olvasása", "id": "Kosakata dan menyusun kalimat bahasa Vietnam, latihan membaca publikasi bahasa Vietnam"},
    "기본 단어 800개를 익히고 범용언어 생성법을 통한 베트남어 문장 만들기를 연습합니다.": {"vi": "Học 800 từ cơ bản và luyện đặt câu tiếng Việt bằng bảng tạo câu tổng quát.", "cs": "Naučíme se 800 základních slov a procvičujeme skládání vietnamských vět pomocí univerzální tabulky vět.", "zh_cn": "掌握800个基本单词，并用通用造句法练习造越南语句子。", "hu": "Elsajátítunk 800 alapszót, és az általános mondatalkotó táblázattal gyakoroljuk a vietnami mondatok alkotását.", "id": "Menguasai 800 kata dasar dan berlatih menyusun kalimat bahasa Vietnam dengan tabel pembentukan kalimat."},
    "“행누” 베트남어를 주 교재로 해서 베트남어 읽기 연습을 합니다.": {"vi": "Luyện đọc tiếng Việt với sách “Vui sống mãi mãi” làm tài liệu chính.", "cs": "Čtení ve vietnamštině procvičujeme hlavně z knihy „Radujte se ze života navždy!“.", "zh_cn": "以越南语版《永远享受美好的生命》为主要教材练习越南语阅读。", "hu": "A vietnami olvasást főleg a „Boldog élet most és mindörökké!” könyv vietnami kiadásából gyakoroljuk.", "id": "Latihan membaca bahasa Vietnam dengan buku “Hidup Bahagia Selamanya!” sebagai bahan utama."},
    "이 기간에도 변함없이 베트남어 성조를 연습하고 베트남어 기본 표현들을 계속 익혀 나갑니다.": {"vi": "Trong giai đoạn này, chúng ta vẫn tiếp tục luyện thanh điệu và các cách diễn đạt cơ bản.", "cs": "I v tomto období dál procvičujeme tóny a základní vietnamské obraty.", "zh_cn": "这段时间也要继续练习越南语声调，继续学习越南语的基本表达。", "hu": "Ebben az időszakban is folyamatosan gyakoroljuk a tónusokat és az alapvető kifejezéseket.", "id": "Selama periode ini, kita tetap berlatih nada dan terus mempelajari ungkapan dasar bahasa Vietnam."},
    "베트남어로 연설을 준비하거나 베트남어로 성서 연구 사회 준비": {"vi": "Chuẩn bị bài giảng hoặc chuẩn bị điều khiển học hỏi Kinh Thánh bằng tiếng Việt", "cs": "Příprava proslovu nebo vedení biblického studia ve vietnamštině", "zh_cn": "用越南语准备演讲或准备主持圣经研究", "hu": "Beszéd vagy bibliatanulmányozás vezetésének előkészítése vietnamiul", "id": "Menyiapkan khotbah atau memimpin pelajaran Alkitab dalam bahasa Vietnam"},
    "한 가지 주제로 베트남어 연설을 준비하거나 해당 주 생활과 봉사 집회 과제를 준비해 봅니다.": {"vi": "Chuẩn bị một bài giảng tiếng Việt về một chủ đề, hoặc chuẩn bị bài giao trong buổi nhóm họp Đời sống và thánh chức của tuần đó.", "cs": "Připravte si vietnamský proslov na jedno téma nebo úkol na shromáždění Život a služba v daném týdnu.", "zh_cn": "就一个主题准备越南语演讲，或准备当周“生活与传道”聚会的节目。", "hu": "Készítsen vietnami beszédet egy témáról, vagy a heti Élet és szolgálat összejövetel feladatát.", "id": "Siapkan khotbah bahasa Vietnam dengan satu topik atau tugas Perhimpunan Kehidupan dan Pelayanan minggu itu."},
    "회중 성서 연구 혹은 파수대 집회에서 베트남어로 발표해 봅니다.": {"vi": "Thử bình luận bằng tiếng Việt trong buổi học Kinh Thánh của hội thánh hoặc buổi học Tháp Canh.", "cs": "Zkuste se vyjádřit vietnamsky při sborovém studiu Bible nebo při studiu Strážné věže.", "zh_cn": "尝试在会众研经班或《守望台》研究班上用越南语评论。", "hu": "Próbáljon vietnamiul hozzászólni a gyülekezeti bibliatanulmányozáson vagy az Őrtorony-tanulmányozáson.", "id": "Cobalah berkomentar dalam bahasa Vietnam di Pelajaran Alkitab Sidang atau Pelajaran Menara Pengawal."},
    "베트남어로 성서 연구 사회를 해 봅니다.": {"vi": "Thử điều khiển một buổi học hỏi Kinh Thánh bằng tiếng Việt.", "cs": "Zkuste vést biblické studium ve vietnamštině.", "zh_cn": "尝试用越南语主持圣经研究。", "hu": "Próbáljon vietnamiul bibliatanulmányozást vezetni.", "id": "Cobalah memimpin pelajaran Alkitab dalam bahasa Vietnam."},
    "베트남어 발음 설정": {"vi": "Cài đặt phát âm tiếng Việt", "cs": "Nastavení vietnamské výslovnosti", "zh_cn": "越南语发音设置", "hu": "Vietnami kiejtés beállításai", "id": "Pengaturan pelafalan bahasa Vietnam"},
    "베트남어 문자": {"vi": "Chữ cái tiếng Việt", "cs": "Vietnamská abeceda", "zh_cn": "越南语字母", "hu": "A vietnami ábécé", "id": "Huruf bahasa Vietnam"},
    "베트남어 발음 – 모음": {"vi": "Phát âm tiếng Việt – nguyên âm", "cs": "Vietnamská výslovnost – samohlásky", "zh_cn": "越南语发音 – 元音", "hu": "Vietnami kiejtés – magánhangzók", "id": "Pelafalan bahasa Vietnam – vokal"},
    "베트남어 발음 – 자음": {"vi": "Phát âm tiếng Việt – phụ âm", "cs": "Vietnamská výslovnost – souhlásky", "zh_cn": "越南语发音 – 辅音", "hu": "Vietnami kiejtés – mássalhangzók", "id": "Pelafalan bahasa Vietnam – konsonan"},
    "성조연습": {"vi": "Luyện thanh điệu", "cs": "Procvičování tónů", "zh_cn": "声调练习", "hu": "Tónusgyakorlás", "id": "Latihan nada"},
    "베트남어 어휘 학습 (한자음 1~212번)": {"vi": "Học từ vựng tiếng Việt (Hán Việt 1–212)", "cs": "Vietnamská slovní zásoba (sino-vietnamská 1–212)", "zh_cn": "越南语词汇学习（汉字音 1~212）", "hu": "Vietnami szókincs (sino-vietnámi 1–212.)", "id": "Kosakata bahasa Vietnam (Sino-Vietnam 1–212)"},
    "베트남어 문자와 발음 기초 배우기": {"vi": "Học chữ cái và phát âm cơ bản", "cs": "Základy vietnamské abecedy a výslovnosti", "zh_cn": "学习越南语字母和发音基础", "hu": "A vietnami ábécé és kiejtés alapjai", "id": "Belajar dasar huruf dan pelafalan bahasa Vietnam"},
    "2026/10/3 베트남어 학습반에 오신 여러분을 환영합니다": {"vi": "3/10/2026 Chào mừng các bạn đến với lớp học tiếng Việt", "cs": "3. 10. 2026 Vítejte v kurzu vietnamštiny", "zh_cn": "2026/10/3 欢迎各位来到越南语学习班", "hu": "2026. 10. 3. Üdvözöljük a vietnami nyelvtanfolyamon", "id": "3/10/2026 Selamat datang di kelas bahasa Vietnam"},
    "베트남어 발음 – 자음, 모음 복습": {"vi": "Phát âm tiếng Việt – ôn phụ âm và nguyên âm", "cs": "Vietnamská výslovnost – opakování souhlásek a samohlásek", "zh_cn": "越南语发音 – 复习辅音和元音", "hu": "Vietnami kiejtés – mássalhangzók és magánhangzók ismétlése", "id": "Pelafalan bahasa Vietnam – ulasan konsonan dan vokal"},
    "베트남어 숫자 1–9": {"vi": "Số đếm tiếng Việt 1–9", "cs": "Vietnamské číslovky 1–9", "zh_cn": "越南语数字 1–9", "hu": "Vietnami számok 1–9", "id": "Angka bahasa Vietnam 1–9"},
    "베트남어 성경 책명과 숫자 배우기 (풍선 준비)": {"vi": "Học tên các sách Kinh Thánh và số đếm tiếng Việt (chuẩn bị bóng bay)", "cs": "Názvy biblických knih a číslovky ve vietnamštině (připravte balonky)", "zh_cn": "学习越南语圣经书名和数字（准备气球）", "hu": "Bibliai könyvnevek és számok vietnamiul (lufik előkészítése)", "id": "Belajar nama kitab Alkitab dan angka bahasa Vietnam (siapkan balon)"},
    "성조연습, 연속성조": {"vi": "Luyện thanh điệu, thanh điệu liên tiếp", "cs": "Procvičování tónů, tóny za sebou", "zh_cn": "声调练习、连续声调", "hu": "Tónusgyakorlás, egymást követő tónusok", "id": "Latihan nada, nada berurutan"},
    "신권 용어, 주요 인물 발음 연습(훈책)": {"vi": "Luyện phát âm từ ngữ thần quyền và tên nhân vật chính (sách hướng dẫn)", "cs": "Výslovnost teokratických výrazů a hlavních postav (příručka)", "zh_cn": "神治用语、主要人物发音练习（训练手册）", "hu": "Teokratikus kifejezések és fő szereplők kiejtése (kézikönyv)", "id": "Latihan pelafalan istilah teokratis dan tokoh utama (buku panduan)"},
    "베트남어로 성경구절 찾아보기": {"vi": "Tìm câu Kinh Thánh bằng tiếng Việt", "cs": "Vyhledávání biblických veršů ve vietnamštině", "zh_cn": "用越南语查找圣经经文", "hu": "Bibliaversek keresése vietnamiul", "id": "Mencari ayat Alkitab dalam bahasa Vietnam"},
    "베트남어 숫자": {"vi": "Số đếm tiếng Việt", "cs": "Vietnamské číslovky", "zh_cn": "越南语数字", "hu": "Vietnami számok", "id": "Angka bahasa Vietnam"},
    "베트남어 요일, 날짜": {"vi": "Thứ trong tuần và ngày tháng tiếng Việt", "cs": "Vietnamské dny v týdnu a data", "zh_cn": "越南语星期、日期", "hu": "Vietnami napok és dátumok", "id": "Hari dan tanggal dalam bahasa Vietnam"},
    "베트남어 대화 연습 (자기소개, 연락처 교환)": {"vi": "Luyện hội thoại tiếng Việt (giới thiệu bản thân, trao đổi liên lạc)", "cs": "Konverzace ve vietnamštině (představení, výměna kontaktů)", "zh_cn": "越南语对话练习（自我介绍、交换联系方式）", "hu": "Vietnami beszélgetés (bemutatkozás, elérhetőség cseréje)", "id": "Latihan percakapan bahasa Vietnam (perkenalan diri, bertukar kontak)"},
    "성경 복습": {"vi": "Ôn tập Kinh Thánh", "cs": "Opakování – Bible", "zh_cn": "圣经复习", "hu": "Biblia – ismétlés", "id": "Ulasan Alkitab"},
    "베트남 사람에게 신상정보 물어보기": {"vi": "Hỏi thông tin cá nhân của người Việt", "cs": "Ptát se Vietnamců na osobní údaje", "zh_cn": "询问越南人的个人信息", "hu": "Személyes adatok kérdezése vietnamiaktól", "id": "Menanyakan data pribadi kepada orang Vietnam"},
    "베트남어 호칭": {"vi": "Cách xưng hô tiếng Việt", "cs": "Vietnamské oslovení", "zh_cn": "越南语称呼", "hu": "Vietnami megszólítások", "id": "Sapaan dalam bahasa Vietnam"},
    "베트남어 시간": {"vi": "Giờ giấc tiếng Việt", "cs": "Čas ve vietnamštině", "zh_cn": "越南语时间", "hu": "Idő vietnamiul", "id": "Waktu dalam bahasa Vietnam"},
    "베트남어 출판물 읽기 연습 (행누, 랑제)": {"vi": "Luyện đọc ấn phẩm tiếng Việt (Vui sống mãi mãi, Yêu thương người khác)", "cs": "Čtení vietnamských publikací (Radujte se ze života navždy!, Mějte rádi lidi)", "zh_cn": "越南语出版物阅读练习（《永远享受美好的生命》《用爱心帮助人成为基督徒》）", "hu": "Vietnami kiadványok olvasása (Boldog élet most és mindörökké!, Szeressük az embereket)", "id": "Latihan membaca publikasi bahasa Vietnam (Hidup Bahagia Selamanya!, Kasihi Orang)"},
    "숫자 복습 (3,6,9 게임)": {"vi": "Ôn số đếm (trò chơi 3, 6, 9)", "cs": "Opakování číslovek (hra 3, 6, 9)", "zh_cn": "数字复习（3、6、9 游戏）", "hu": "Számok ismétlése (3-6-9 játék)", "id": "Ulasan angka (permainan 3, 6, 9)"},
    "베트남어 남북 발음 차이": {"vi": "Khác biệt phát âm Bắc – Nam", "cs": "Rozdíly mezi severní a jižní výslovností", "zh_cn": "越南语南北发音差异", "hu": "Az északi és déli kiejtés különbségei", "id": "Perbedaan pelafalan Utara dan Selatan"},
    "베트남어 호칭 배우기": {"vi": "Học cách xưng hô tiếng Việt", "cs": "Vietnamské oslovení", "zh_cn": "学习越南语称呼", "hu": "Vietnami megszólítások tanulása", "id": "Belajar sapaan bahasa Vietnam"},
    "새 어휘 진도는 쉬고, 파수대 어휘 10개 학습은 계속합니다.": {"vi": "Tạm nghỉ phần từ vựng mới, nhưng vẫn học tiếp 10 từ vựng Tháp Canh.", "cs": "Nová slovní zásoba má pauzu, 10 slovíček ze Strážné věže pokračuje.", "zh_cn": "暂停新词汇进度，但继续学习《守望台》词汇10个。", "hu": "Új szókincs most nincs, de a 10 Őrtorony-szó tanulása folytatódik.", "id": "Kosakata baru diliburkan, tetapi 10 kosakata Menara Pengawal tetap dipelajari."},
    "방학(2026/11/7)": {"vi": "Nghỉ (7/11/2026)", "cs": "Přestávka (7. 11. 2026)", "zh_cn": "休假（2026/11/7）", "hu": "Szünet (2026. 11. 7.)", "id": "Libur (7/11/2026)"},
    "베트남어 성경 찾기 시험": {"vi": "Kiểm tra tìm câu Kinh Thánh tiếng Việt", "cs": "Test ve vyhledávání v Bibli ve vietnamštině", "zh_cn": "越南语圣经查找测验", "hu": "Bibliakeresési teszt vietnamiul", "id": "Tes mencari ayat Alkitab bahasa Vietnam"},
    "행누책 읽기": {"vi": "Đọc sách Vui sống mãi mãi", "cs": "Čtení knihy Radujte se ze života navždy!", "zh_cn": "阅读《永远享受美好的生命》", "hu": "A Boldog élet most és mindörökké! könyv olvasása", "id": "Membaca buku Hidup Bahagia Selamanya!"},
    "베트남어 노래(12번)와 성경 찾기 연습": {"vi": "Bài hát tiếng Việt (số 12) và luyện tìm câu Kinh Thánh", "cs": "Vietnamská píseň č. 12 a vyhledávání v Bibli", "zh_cn": "越南语诗歌（第12首）和查找经文练习", "hu": "Vietnami ének (12.) és bibliakeresés", "id": "Lagu bahasa Vietnam (no. 12) dan latihan mencari ayat"},
    "베트남어 읽기 연습": {"vi": "Luyện đọc tiếng Việt", "cs": "Čtení ve vietnamštině", "zh_cn": "越南语阅读练习", "hu": "Olvasás vietnamiul", "id": "Latihan membaca bahasa Vietnam"},
    "범용언어 생성법 소개": {"vi": "Giới thiệu bảng tạo câu tổng quát", "cs": "Úvod do univerzální tabulky vět", "zh_cn": "通用造句法介绍", "hu": "Az általános mondatalkotó táblázat bemutatása", "id": "Pengenalan tabel pembentukan kalimat"},
    "베트남어 문법 예문": {"vi": "Câu ví dụ ngữ pháp tiếng Việt", "cs": "Příkladové věty z vietnamské gramatiky", "zh_cn": "越南语语法例句", "hu": "Vietnami nyelvtani példamondatok", "id": "Contoh kalimat tata bahasa Vietnam"},
    "범용언어 생성법으로 문장 만들기 시작": {"vi": "Bắt đầu đặt câu bằng bảng tạo câu tổng quát", "cs": "Začínáme skládat věty s univerzální tabulkou vět", "zh_cn": "开始用通用造句法造句", "hu": "Mondatalkotás kezdése az általános táblázattal", "id": "Mulai menyusun kalimat dengan tabel pembentukan kalimat"},
    "범용언어 생성법을 통한 베트남어 문장 만들기": {"vi": "Đặt câu tiếng Việt bằng bảng tạo câu tổng quát", "cs": "Skládání vietnamských vět s univerzální tabulkou vět", "zh_cn": "用通用造句法造越南语句子", "hu": "Vietnami mondatok alkotása az általános táblázattal", "id": "Menyusun kalimat bahasa Vietnam dengan tabel pembentukan kalimat"},
    "베트남어로 일기쓰고 발표": {"vi": "Viết nhật ký bằng tiếng Việt và trình bày", "cs": "Psaní deníku ve vietnamštině a jeho přednesení", "zh_cn": "用越南语写日记并发表", "hu": "Naplóírás vietnamiul és felolvasása", "id": "Menulis buku harian dalam bahasa Vietnam dan membacakannya"},
    "문장 생성기로 문장 만들기 연습": {"vi": "Luyện đặt câu với công cụ tạo câu", "cs": "Skládání vět s generátorem vět", "zh_cn": "用造句工具练习造句", "hu": "Mondatalkotás gyakorlása a mondatgenerátorral", "id": "Latihan menyusun kalimat dengan pembuat kalimat"},
    "베트남어로 일기 쓰고 발표하기": {"vi": "Viết nhật ký bằng tiếng Việt và trình bày", "cs": "Psaní deníku ve vietnamštině a jeho přednesení", "zh_cn": "用越南语写日记并发表", "hu": "Naplóírás vietnamiul és felolvasása", "id": "Menulis buku harian dalam bahasa Vietnam dan membacakannya"},
    "방학(베트남어 순회대회 2026/12/5)": {"vi": "Nghỉ (hội nghị vòng quanh tiếng Việt 5/12/2026)", "cs": "Přestávka (vietnamský krajský sjezd 5. 12. 2026)", "zh_cn": "休假（越南语分区大会 2026/12/5）", "hu": "Szünet (vietnami körzetkongresszus, 2026. 12. 5.)", "id": "Libur (kebaktian wilayah bahasa Vietnam 5/12/2026)"},
    "제공 연설과 문장 만들기 연습 심화": {"vi": "Luyện sâu hơn bài giảng mẫu và đặt câu", "cs": "Pokročilé procvičování vzorových rozhovorů a skládání vět", "zh_cn": "深入练习传道示范与造句", "hu": "Beszédminták és mondatalkotás haladó gyakorlása", "id": "Latihan lanjutan khotbah contoh dan menyusun kalimat"},
    "베트남어 노래(18번) 배우기": {"vi": "Học bài hát tiếng Việt (số 18)", "cs": "Nácvik vietnamské písně č. 18", "zh_cn": "学习越南语诗歌（第18首）", "hu": "Vietnami ének tanulása (18.)", "id": "Belajar lagu bahasa Vietnam (no. 18)"},
    "방학(한국어 순회대회 2026/12/26)": {"vi": "Nghỉ (hội nghị vòng quanh tiếng Hàn 26/12/2026)", "cs": "Přestávka (korejský krajský sjezd 26. 12. 2026)", "zh_cn": "休假（韩语分区大会 2026/12/26）", "hu": "Szünet (koreai körzetkongresszus, 2026. 12. 26.)", "id": "Libur (kebaktian wilayah bahasa Korea 26/12/2026)"},
    "베트남어 연구용 파수대 읽기 연습": {"vi": "Luyện đọc Tháp Canh ấn bản học hỏi tiếng Việt", "cs": "Čtení vietnamské Strážné věže (studijní vydání)", "zh_cn": "越南语研读版《守望台》阅读练习", "hu": "A vietnami Őrtorony tanulmányi kiadásának olvasása", "id": "Latihan membaca Menara Pengawal edisi pelajaran bahasa Vietnam"},
    "베트남어로 기도 준비하기": {"vi": "Chuẩn bị lời cầu nguyện bằng tiếng Việt", "cs": "Příprava modlitby ve vietnamštině", "zh_cn": "用越南语准备祷告", "hu": "Ima előkészítése vietnamiul", "id": "Menyiapkan doa dalam bahasa Vietnam"},
    "집회 사회 표현 연습 (형제)": {"vi": "Luyện cách diễn đạt khi điều khiển buổi nhóm họp (anh em)", "cs": "Obraty pro vedení shromáždění (bratři)", "zh_cn": "聚会主持用语练习（弟兄）", "hu": "Összejövetel levezetésének kifejezései (testvérek – férfiak)", "id": "Latihan ungkapan memimpin perhimpunan (saudara)"},
    "파수대 발표 준비 (형제, 자매)": {"vi": "Chuẩn bị bình luận Tháp Canh (anh chị em)", "cs": "Příprava komentářů ke Strážné věži (bratři, sestry)", "zh_cn": "准备《守望台》评论（弟兄、姊妹）", "hu": "Őrtorony-hozzászólás előkészítése (testvérek)", "id": "Menyiapkan komentar Menara Pengawal (saudara, saudari)"},
    "집회 사회·파수대 발표 준비": {"vi": "Chuẩn bị điều khiển buổi nhóm họp và bình luận Tháp Canh", "cs": "Příprava vedení shromáždění a komentářů ke Strážné věži", "zh_cn": "准备主持聚会和《守望台》评论", "hu": "Összejövetel levezetésének és Őrtorony-hozzászólásoknak az előkészítése", "id": "Menyiapkan pimpinan perhimpunan dan komentar Menara Pengawal"},
    "베트남어 문법 특강": {"vi": "Bài giảng đặc biệt về ngữ pháp tiếng Việt", "cs": "Zvláštní lekce vietnamské gramatiky", "zh_cn": "越南语语法专题讲座", "hu": "Vietnami nyelvtani különóra", "id": "Kuliah khusus tata bahasa Vietnam"},
    "상황별 실연 준비": {"vi": "Chuẩn bị trình diễn theo tình huống", "cs": "Příprava ukázek pro různé situace", "zh_cn": "准备情景示范", "hu": "Helyzetgyakorlatok előkészítése", "id": "Menyiapkan peragaan sesuai situasi"},
    "베트남어 남북 단어 차이": {"vi": "Khác biệt từ vựng Bắc – Nam", "cs": "Rozdíly mezi severními a jižními slovy", "zh_cn": "越南语南北词汇差异", "hu": "Az északi és déli szavak különbségei", "id": "Perbedaan kata Utara dan Selatan"},
    "베트남어 남북 단어 차이 배우기": {"vi": "Học khác biệt từ vựng Bắc – Nam", "cs": "Rozdíly mezi severními a jižními slovy", "zh_cn": "学习越南语南北词汇差异", "hu": "Az északi és déli szavak különbségeinek tanulása", "id": "Belajar perbedaan kata Utara dan Selatan"},
    "베트남어 어순반대 한자어": {"vi": "Từ Hán Việt đảo trật tự", "cs": "Sino-vietnamská slova s obráceným slovosledem", "zh_cn": "越南语语序相反的汉字词", "hu": "Fordított szórendű sino-vietnámi szavak", "id": "Kata Sino-Vietnam berurutan terbalik"},
    "베트남어 끝말잇기": {"vi": "Trò chơi nối từ tiếng Việt", "cs": "Vietnamský slovní řetězec", "zh_cn": "越南语词语接龙", "hu": "Vietnami szólánc", "id": "Permainan sambung kata bahasa Vietnam"},
    "16주간 배운 발음·성조 총복습": {"vi": "Tổng ôn phát âm và thanh điệu đã học trong 16 tuần", "cs": "Celkové opakování výslovnosti a tónů z 16 týdnů", "zh_cn": "总复习16周所学的发音与声调", "hu": "A 16 hét alatt tanult kiejtés és tónusok átfogó ismétlése", "id": "Ulasan menyeluruh pelafalan dan nada selama 16 minggu"},
    "배운 어휘 전체 복습 게임": {"vi": "Trò chơi ôn toàn bộ từ vựng đã học", "cs": "Hra na opakování veškeré naučené slovní zásoby", "zh_cn": "所学词汇总复习游戏", "hu": "Játék az összes tanult szó ismétlésére", "id": "Permainan ulasan semua kosakata yang dipelajari"},
    "제공 연설 전체 복습": {"vi": "Ôn tất cả bài giảng mẫu", "cs": "Opakování všech vzorových rozhovorů", "zh_cn": "复习全部传道示范", "hu": "Az összes beszédminta ismétlése", "id": "Ulasan semua khotbah contoh"},
    "지금까지 배운 발음, 어휘, 제공 연설, 성서 지식을 총정리하며 복습합니다.": {"vi": "Tổng kết và ôn lại phát âm, từ vựng, bài giảng mẫu và kiến thức Kinh Thánh đã học.", "cs": "Shrnujeme a opakujeme výslovnost, slovní zásobu, vzorové rozhovory a biblické znalosti, které jsme se naučili.", "zh_cn": "总结并复习至今所学的发音、词汇、传道示范和圣经知识。", "hu": "Összefoglaljuk és ismételjük az eddig tanult kiejtést, szókincset, beszédmintákat és bibliai ismereteket.", "id": "Merangkum dan mengulas pelafalan, kosakata, khotbah contoh, dan pengetahuan Alkitab yang sudah dipelajari."},
    "16주 (총복습)": {"vi": "Tuần 16 (tổng ôn)", "cs": "16. týden (celkové opakování)", "zh_cn": "第16周（总复习）", "hu": "16. hét (átfogó ismétlés)", "id": "Minggu 16 (ulasan menyeluruh)"},
    "월요일": {"vi": "Thứ Hai", "cs": "Pondělí", "zh_cn": "星期一", "hu": "Hétfő", "id": "Senin"},
    "화요일": {"vi": "Thứ Ba", "cs": "Úterý", "zh_cn": "星期二", "hu": "Kedd", "id": "Selasa"},
    "수요일": {"vi": "Thứ Tư", "cs": "Středa", "zh_cn": "星期三", "hu": "Szerda", "id": "Rabu"},
    "목요일": {"vi": "Thứ Năm", "cs": "Čtvrtek", "zh_cn": "星期四", "hu": "Csütörtök", "id": "Kamis"},
    "금요일": {"vi": "Thứ Sáu", "cs": "Pátek", "zh_cn": "星期五", "hu": "Péntek", "id": "Jumat"},
    "15주차 내용 복습": {"vi": "Ôn nội dung tuần 15", "cs": "Opakování 15. týdne", "zh_cn": "复习第15周内容", "hu": "A 15. hét ismétlése", "id": "Ulasan materi minggu 15"},
    "베트남어 노래 (46번, 졸업식 노래) 준비": {"vi": "Chuẩn bị bài hát tiếng Việt (số 46, bài hát lễ tốt nghiệp)", "cs": "Příprava vietnamské písně č. 46 (píseň k zakončení kurzu)", "zh_cn": "准备越南语诗歌（第46首，毕业典礼诗歌）", "hu": "Vietnami ének előkészítése (46., a záróünnepség éneke)", "id": "Menyiapkan lagu bahasa Vietnam (no. 46, lagu wisuda)"},
    "베트남어 집회 리허설": {"vi": "Tập dượt buổi nhóm họp tiếng Việt", "cs": "Zkouška vietnamského shromáždění", "zh_cn": "越南语聚会彩排", "hu": "A vietnami összejövetel próbája", "id": "Gladi perhimpunan bahasa Vietnam"},
    "졸업식 노래(46번)와 집회 리허설 준비": {"vi": "Chuẩn bị bài hát lễ tốt nghiệp (số 46) và tập dượt buổi nhóm họp", "cs": "Příprava písně k zakončení (č. 46) a zkoušky shromáždění", "zh_cn": "准备毕业典礼诗歌（第46首）和聚会彩排", "hu": "A záróünnepség énekének (46.) és az összejövetel próbájának előkészítése", "id": "Menyiapkan lagu wisuda (no. 46) dan gladi perhimpunan"},
    "졸업식 준비 (임명)": {"vi": "Chuẩn bị lễ tốt nghiệp (giao nhiệm vụ)", "cs": "Příprava zakončení kurzu (úkoly)", "zh_cn": "准备毕业典礼（分派任务）", "hu": "A záróünnepség előkészítése (feladatok kiosztása)", "id": "Persiapan wisuda (penugasan)"},
    "졸업식 준비 및 임명": {"vi": "Chuẩn bị lễ tốt nghiệp và giao nhiệm vụ", "cs": "Příprava zakončení kurzu a rozdělení úkolů", "zh_cn": "准备毕业典礼和分派任务", "hu": "A záróünnepség előkészítése és a feladatok kiosztása", "id": "Persiapan wisuda dan penugasan"},
    "파수대 집회 실연 (사회, 낭독, 발표)": {"vi": "Trình diễn buổi học Tháp Canh (điều khiển, đọc, bình luận)", "cs": "Ukázka studia Strážné věže (vedení, čtení, komentáře)", "zh_cn": "《守望台》研究班示范（主持、朗读、评论）", "hu": "Őrtorony-tanulmányozás bemutatása (levezetés, felolvasás, hozzászólás)", "id": "Peragaan Pelajaran Menara Pengawal (memimpin, membaca, berkomentar)"},
    "졸업": {"vi": "Tốt nghiệp", "cs": "Zakončení kurzu", "zh_cn": "毕业", "hu": "Tanfolyamzárás", "id": "Wisuda"},
    "파수대 집회 실연과 졸업": {"vi": "Trình diễn buổi học Tháp Canh và lễ tốt nghiệp", "cs": "Ukázka studia Strážné věže a zakončení kurzu", "zh_cn": "《守望台》研究班示范与毕业", "hu": "Őrtorony-tanulmányozás bemutatása és tanfolyamzárás", "id": "Peragaan Pelajaran Menara Pengawal dan wisuda"},
    # ULSAN welcome texts (ulsan_data.py has only ko/en)
    "2026-2027 울산 베트남어 학습반": {"vi": "Lớp học tiếng Việt Ulsan 2026-2027", "cs": "Kurz vietnamštiny Ulsan 2026–2027", "zh_cn": "2026-2027 蔚山越南语学习班", "zh": "2026-2027 蔚山越南語學習班", "fr": "Cours de vietnamien d'Ulsan 2026-2027", "de": "Vietnamesischkurs Ulsan 2026–2027", "hu": "Ulszani vietnami nyelvtanfolyam 2026–2027", "id": "Kelas Bahasa Vietnam Ulsan 2026-2027", "ja": "2026-2027 蔚山ベトナム語学習クラス", "pl": "Kurs wietnamskiego w Ulsan 2026–2027"},
    "학습반 일정이 아직 정해지지 않았습니다 (일정 미정).": {"vi": "Lịch học chưa được xác định (chưa có lịch).", "cs": "Rozvrh kurzu zatím nebyl stanoven.", "zh_cn": "学习班日程尚未确定（日程待定）。", "zh": "學習班日程尚未確定（日程待定）。", "fr": "Le calendrier du cours n'a pas encore été fixé.", "de": "Der Kursplan steht noch nicht fest.", "hu": "A tanfolyam időbeosztása még nincs meghatározva.", "id": "Jadwal kelas belum ditentukan.", "ja": "クラスの日程はまだ決まっていません（日程未定）。", "pl": "Harmonogram kursu nie został jeszcze ustalony."},
}


def translate_missing(ko, lang):
    entry = COURSE_TEXT.get(ko)
    if entry and entry.get(lang):
        return entry[lang]
    if lang in ADDED_LANGS:
        for pattern, render in COURSE_TEMPLATES:
            m = pattern.match(ko)
            if m:
                return render(m, lang)
    return None


def _is_text(o):
    return isinstance(o, dict) and isinstance(o.get("ko"), str) and set(o) <= set(ALL_LANGS)


def complete_course_texts(value, missing=None):
    """Returns a copy of `value` with every course text dict completed to the 12 languages."""
    if _is_text(value):
        out = dict(value)
        for lang in ALL_LANGS:
            fix = KOREAN_LEAK_FIX.get(value["ko"], {}).get(lang)
            if fix and lang != "ko" and HANGUL.search(out.get(lang) or ""):
                out[lang] = fix
            if not out.get(lang):
                tr = translate_missing(value["ko"], lang)
                if tr:
                    out[lang] = tr
                elif missing is not None:
                    missing.add((value["ko"], lang))
        return out
    if isinstance(value, dict):
        return {k: complete_course_texts(v, missing) for k, v in value.items()}
    if isinstance(value, list):
        return [complete_course_texts(v, missing) for v in value]
    return value
