# -*- coding: utf-8 -*-
"""AI-generated translations for GRAMMAR_INTRO / GRAMMAR_UNITS ([문법] > [수업]).

grammar_data.py carries ko/zh/en/ja/de/fr/pl for these lessons; cs, zh_cn, hu and id were never
authored. apply_grammar_lessons_ai_translations() returns a copy in which every multilingual text
object (title / desc / note / kr / pair meanings) that lacks one of those languages gets it from
the table below, matched by the object's English text. Existing text is never overwritten, and
every filled object is listed nowhere else -- the language set itself (GRAMMAR_LESSONS_AI_LANGS)
marks what is generated.

Row order: cs | zh_cn | hu | id
"""

import copy

GRAMMAR_LESSONS_AI_LANGS = ["cs", "zh_cn", "hu", "id"]

_ROWS = """
① Position of the predicate: at the very end in Korean, right after the subject in Vietnamese
① Postavení přísudku: v korejštině úplně na konci, ve vietnamštině hned za podmětem|① 谓语位置：韩语在最后，越南语在主语之后|① Az állítmány helye: a koreaiban a mondat legvégén, a vietnámiban közvetlenül az alany után|① Posisi predikat: dalam bahasa Korea di paling akhir, dalam bahasa Vietnam tepat setelah subjek
Korean follows the order 'subject + object + predicate', with the predicate (verb) coming at the very end of the sentence. Vietnamese follows the order 'subject + predicate + object', with the predicate coming right after the subject. Objects, places, times, etc. all come after the predicate.
Korejština má pořadí „podmět + předmět + přísudek“ a přísudek (sloveso) stojí úplně na konci věty. Vietnamština má pořadí „podmět + přísudek + předmět“ a přísudek stojí hned za podmětem. Předmět, místo, čas apod. se všechny připojují až za přísudek.|韩语的语序是“主语+宾语+谓语”，谓语（动词）位于句子的最后。越南语的语序是“主语+谓语+宾语”，谓语紧跟在主语之后。宾语、地点、时间等都放在谓语之后。|A koreai sorrend „alany + tárgy + állítmány”, az állítmány (ige) a mondat legvégén áll. A vietnámi sorrend „alany + állítmány + tárgy”, az állítmány közvetlenül az alany után jön. A tárgy, a hely, az idő stb. mind az állítmány után következik.|Bahasa Korea berurutan 'subjek + objek + predikat', dengan predikat (kata kerja) di akhir kalimat. Bahasa Vietnam berurutan 'subjek + predikat + objek', dengan predikat tepat setelah subjek. Objek, tempat, waktu, dan lain-lain semuanya diletakkan setelah predikat.
I eat.
Jím.|我吃饭。|Eszem.|Saya makan.
I (subject)
já (podmět)|我（主语）|én (alany)|saya (subjek)
to eat (predicate)
jíst (přísudek)|吃（谓语）|enni (állítmány)|makan (predikat)
rice (object)
rýže (předmět)|饭（宾语）|rizs (tárgy)|nasi (objek)
Korean: predicate at the end; Vietnamese: predicate second
Korejština: přísudek na konci; vietnamština: přísudek na druhém místě|韩语谓语在最后，越南语谓语在第二位|Koreai: az állítmány a végén; vietnámi: az állítmány a második helyen|Bahasa Korea: predikat di akhir; bahasa Vietnam: predikat di posisi kedua
② Position of modifiers: before the noun in Korean, after it in Vietnamese
② Postavení přívlastků: v korejštině před podstatným jménem, ve vietnamštině za ním|② 修饰语位置：韩语在前，越南语在后|② A jelzők helye: a koreaiban a főnév előtt, a vietnámiban utána|② Posisi pewatas: dalam bahasa Korea sebelum kata benda, dalam bahasa Vietnam sesudahnya
In Korean, modifiers (adjectives, possessives like "my") come before the noun they modify. In Vietnamese, it's the opposite — the noun comes first, followed by the modifier.
V korejštině stojí přívlastky (přídavná jména, přivlastňovací výrazy jako „můj“) před podstatným jménem, které rozvíjejí. Ve vietnamštině je to naopak — nejprve podstatné jméno, za ním přívlastek.|韩语中修饰语（形容词、像“我的”这样的所有格）放在被修饰的名词前面。越南语则相反，名词先出现，修饰语跟在其后。|A koreaiban a jelzők (melléknevek, birtokos kifejezések, mint az „enyém”) a jelzett főnév előtt állnak. A vietnámiban fordítva: először a főnév jön, utána a jelző.|Dalam bahasa Korea, pewatas (kata sifat, kepemilikan seperti "milikku") diletakkan sebelum kata benda. Dalam bahasa Vietnam sebaliknya — kata benda di depan, diikuti pewatasnya.
delicious rice/meal
chutná rýže / chutné jídlo|好吃的饭|finom rizs / étel|nasi / makanan yang enak
rice (noun)
rýže (podstatné jméno)|饭（名词）|rizs (főnév)|nasi (kata benda)
delicious (adjective)
chutný (přídavné jméno)|好吃的（形容词）|finom (melléknév)|enak (kata sifat)
Adjective goes after the noun
Přídavné jméno stojí za podstatným jménem|形容词放在名词后面|A melléknév a főnév után áll|Kata sifat diletakkan setelah kata benda
my house / my house
můj dům / můj dům|我的家 / 我家|az én házam / a házam|rumah saya / rumahku
house (noun)
dům (podstatné jméno)|家（名词）|ház (főnév)|rumah (kata benda)
's (possessive case)
(přivlastňovací pád)|的（所有格）|-é (birtokos)|milik (kepemilikan)
I, me
já, mě|我|én, engem|saya, aku
The possessive also comes after the noun
Přivlastnění se také klade za podstatné jméno|所有格也放在名词后面|A birtokos is a főnév után áll|Kepemilikan juga diletakkan setelah kata benda
③ Note: not all modifiers go after the noun
③ Pozor: ne všechny přívlastky se kladou za podstatné jméno|③ 注意：并非所有修饰语都放在后面|③ Figyelem: nem minden bővítmény kerül a főnév után|③ Perhatian: tidak semua pewatas diletakkan di belakang
Adjectives and possessives that modify nouns come after the noun, but frequency adverbs that modify verbs (thường "often", luôn "always") or tense/auxiliary markers (đã "past", đang "in the process of", sẽ "will", phải "must", muốn "want to") come before the verb, just like in Korean. Degree adverbs that modify adjectives (rất "very") also come before the adjective.
Přídavná jména a přivlastnění rozvíjející podstatné jméno stojí za ním, ale příslovce četnosti rozvíjející sloveso (thường „často“, luôn „vždy“) a ukazatele času či pomocná slovesa (đã „minulost“, đang „právě probíhá“, sẽ „budoucnost“, phải „muset“, muốn „chtít“) stojí před slovesem, stejně jako v korejštině. Příslovce míry rozvíjející přídavné jméno (rất „velmi“) stojí také před přídavným jménem.|修饰名词的形容词、所有格放在后面，但修饰动词的频度副词（thường 经常、luôn 总是）或时态·助动词标记（đã 过去、đang 正在、sẽ 将要、phải 必须、muốn 想要）则和韩语一样放在动词前面。修饰形容词的程度副词（rất 非常）也放在形容词前面。|A főnevet bővítő melléknevek és birtokosok a főnév után állnak, de az igét módosító gyakoriságot kifejező határozószók (thường „gyakran”, luôn „mindig”) és az időt jelölő vagy segédigék (đã „múlt”, đang „folyamatban”, sẽ „jövő”, phải „kell”, muốn „akar”) az ige előtt állnak, akárcsak a koreaiban. A melléknevet fokozó határozószók (rất „nagyon”) szintén a melléknév előtt állnak.|Kata sifat dan kepemilikan yang menerangkan kata benda diletakkan setelahnya, tetapi adverbia frekuensi yang menerangkan kata kerja (thường "sering", luôn "selalu") atau penanda kala/kata bantu (đã "lampau", đang "sedang", sẽ "akan", phải "harus", muốn "ingin") diletakkan sebelum kata kerja, sama seperti bahasa Korea. Adverbia derajat yang menerangkan kata sifat (rất "sangat") juga diletakkan sebelum kata sifat.
I eat often.
Často jím.|我经常吃。|Gyakran eszem.|Saya sering makan.
often (adverb)
často (příslovce)|经常（副词）|gyakran (határozószó)|sering (adverbia)
to eat (verb)
jíst (sloveso)|吃（动词）|enni (ige)|makan (kata kerja)
The adverb comes before the verb — the same order as in Korean
Příslovce stojí před slovesem — stejně jako v korejštině|副词在动词前面 — 与韩语语序相同|A határozószó az ige előtt áll — ugyanúgy, mint a koreaiban|Adverbia diletakkan sebelum kata kerja — urutannya sama dengan bahasa Korea
very delicious
velmi chutný|非常好吃的|nagyon finom|sangat enak
very (degree adverb)
velmi (příslovce míry)|非常（程度副词）|nagyon (fokhatározó)|sangat (adverbia derajat)
Degree adverb before adjective — same order as in Korean
Příslovce míry před přídavným jménem — stejně jako v korejštině|程度副词在形容词前——与韩语语序相同|A fokhatározó a melléknév előtt — ugyanúgy, mint a koreaiban|Adverbia derajat sebelum kata sifat — urutannya sama dengan bahasa Korea
1. The shortest sentence — Subject + Predicate
1. Nejkratší věta — podmět + přísudek|1. 最短的句子 — 主语 + 谓语|1. A legrövidebb mondat — alany + állítmány|1. Kalimat terpendek — subjek + predikat
The backbone of a Vietnamese sentence is "subject + predicate." This alone makes a complete sentence. The predicate slot can be filled by a verb, or an adjective can go there as is (adjectives don't need là, which corresponds to "to be"). Only when a noun is used as the predicate is là attached (subject + là + complement).
Kostrou vietnamské věty je „podmět + přísudek“. Už to samo tvoří úplnou větu. Na místě přísudku může stát sloveso, nebo přímo přídavné jméno (přídavná jména nepotřebují là, odpovídající slovesu „být“). Jen když je přísudkem podstatné jméno, přidává se là (podmět + là + doplněk).|越南语句子的骨架是“主语 + 谓语”。仅凭这个就能构成完整的句子。谓语的位置可以是动词，也可以直接是形容词（形容词不需要相当于“是”的 là）。只有当名词被用作谓语时，才加上 là（主语 + là + 补语）。|A vietnámi mondat váza az „alany + állítmány”. Ez már önmagában teljes mondat. Az állítmány helyén állhat ige, vagy változatlanul egy melléknév (a mellékneveknek nincs szükségük a „lenni” jelentésű là szóra). Csak akkor kell là, ha főnév az állítmány (alany + là + kiegészítő).|Kerangka kalimat bahasa Vietnam adalah "subjek + predikat". Itu saja sudah menjadi kalimat lengkap. Posisi predikat dapat diisi kata kerja, atau langsung kata sifat (kata sifat tidak memerlukan là yang berarti "adalah"). Hanya jika kata benda menjadi predikat, là ditambahkan (subjek + là + pelengkap).
to eat
jíst|吃|enni|makan
weather
počasí|天气|időjárás|cuaca
to be cold
být zima, studený|冷|hideg van|dingin
The weather is cold.
Je zima.|天气很冷。|Hideg van.|Cuacanya dingin.
to be
být|是|lenni, van|adalah
student
student|学生|diák|siswa, pelajar
I am a student.
Jsem student.|我是学生。|Diák vagyok.|Saya seorang pelajar.
2. Adding an object — right after the predicate
2. Přidání předmětu — hned za přísudek|2. 添加宾语 — 紧接谓语之后|2. Tárgy hozzáadása — közvetlenül az állítmány után|2. Menambahkan objek — tepat setelah predikat
Korean is '밥을 먹는다' (object-predicate), but Vietnamese follows the order 'eat-rice' (predicate-object).
V korejštině se říká „밥을 먹는다“ (předmět–přísudek), ale vietnamština má pořadí „jíst–rýže“ (přísudek–předmět).|韩语是“吃饭”（宾语-谓语），但越南语的语序是“吃-饭”（谓语-宾语）。|A koreaiban „밥을 먹는다” (tárgy–állítmány), a vietnámiban viszont „eszik–rizs” (állítmány–tárgy) a sorrend.|Dalam bahasa Korea '밥을 먹는다' (objek-predikat), tetapi bahasa Vietnam berurutan 'makan-nasi' (predikat-objek).
rice / meal
rýže / jídlo|饭|rizs / étel|nasi / makanan
3. Adding a place — toward the end of the sentence
3. Přidání místa — ke konci věty|3. 添加地点 — 位于句子后部|3. Hely hozzáadása — a mondat vége felé|3. Menambahkan tempat — di bagian akhir kalimat
ở + place, which corresponds to '~에서', comes after the object, toward the end of the sentence.
ở + místo, odpovídající korejskému „~에서“ („v, na“), stojí za předmětem, ke konci věty.|相当于“~에서”的 ở + 地点，接在宾语之后，位于句子靠后的位置。|Az ở + hely, amely a koreai „~에서” („-ban/-ben”) megfelelője, a tárgy után, a mondat vége felé áll.|ở + tempat, yang setara dengan '~에서' ("di"), diletakkan setelah objek, di bagian akhir kalimat.
at/from ~
v/na ~|在~|-ban/-ben, -on/-en/-ön|di ~
house
dům|家|ház|rumah
I eat at home.
Jím doma.|我在家吃饭。|Otthon eszem.|Saya makan di rumah.
4. Adding time — at the very end of the sentence
4. Přidání času — úplně na konec věty|4. 添加时间 — 位于句子最后|4. Idő hozzáadása — a mondat legvégére|4. Menambahkan waktu — di paling akhir kalimat
vào + time, which corresponds to '~에' (time/hour), usually comes at the very end of the sentence.
vào + čas, odpovídající korejskému „~에“ (čas/hodina), obvykle stojí úplně na konci věty.|相当于“~에”（时刻·时间）的 vào + 时间，通常放在句子的最后。|A vào + időpont, amely a koreai „~에” (idő/óra) megfelelője, általában a mondat legvégén áll.|vào + waktu, yang setara dengan '~에' (waktu/jam), biasanya diletakkan di paling akhir kalimat.
at/in/to ~
v ~ (čas)|在~（时间）|-kor, -ban/-ben (idő)|pada ~ (waktu)
morning
ráno|早上|reggel|pagi
I eat at home in the morning.
Ráno jím doma.|我早上在家吃饭。|Reggel otthon eszem.|Saya makan di rumah pada pagi hari.
5. Modifying a noun with an adjective — after the noun (key contrast)
5. Rozvití podstatného jména přídavným jménem — za podstatné jméno (klíčový rozdíl)|5. 用形容词修饰名词 — 位于名词之后（核心对照）|5. Főnév bővítése melléknévvel — a főnév után (a fő különbség)|5. Menerangkan kata benda dengan kata sifat — setelah kata benda (perbedaan utama)
For 'delicious rice', the adjective comes first in Korean, but in Vietnamese, as in cơm ngon (rice - delicious), the noun comes first.
U „chutné rýže“ je v korejštině přídavné jméno na prvním místě, ale ve vietnamštině, jako v cơm ngon (rýže – chutná), je na prvním místě podstatné jméno.|“好吃的饭”在韩语中形容词在前，但越南语像 cơm ngon（饭 好吃的）一样，名词在前。|A „finom rizs” esetében a koreaiban a melléknév áll elöl, a vietnámiban viszont – mint a cơm ngon (rizs – finom) – a főnév.|Untuk 'nasi yang enak', dalam bahasa Korea kata sifat di depan, tetapi dalam bahasa Vietnam, seperti cơm ngon (nasi - enak), kata benda di depan.
delicious
chutný|好吃的|finom|enak
I eat delicious food at home in the morning.
Ráno doma jím chutné jídlo.|我早上在家吃好吃的饭。|Reggel otthon finom ételt eszem.|Saya makan makanan enak di rumah pada pagi hari.
6. Modifying a noun with a possessive — after the noun
6. Rozvití podstatného jména přivlastněním — za podstatné jméno|6. 用所有格修饰名词 — 位于名词之后|6. Főnév bővítése birtokossal — a főnév után|6. Menerangkan kata benda dengan kepemilikan — setelah kata benda
Likewise for 'my house': as in nhà của tôi (house - of - I), the noun comes first and the possessive comes after.
Stejně tak „můj dům“: jako v nhà của tôi (dům – (něčí) – já) je podstatné jméno na prvním místě a přivlastnění za ním.|“我的家”也一样，像 nhà của tôi（家 的 我）一样，名词在前，所有格在后。|Ugyanígy „az én házam”: mint a nhà của tôi (ház – -é – én), a főnév áll elöl, a birtokos utána.|Begitu pula 'rumah saya': seperti nhà của tôi (rumah - milik - saya), kata benda di depan dan kepemilikan di belakang.
's (possessive particle)
(přivlastňovací částice)|的|-é (birtokos partikula)|milik (partikel kepemilikan)
here
tady, zde|这里|itt|di sini, ini
This is my house.
Tady je můj dům.|这里是我的家。|Ez az én házam.|Ini rumah saya.
7. Adding adverbs of frequency — before the verb (same order as Korean)
7. Přidání příslovcí četnosti — před sloveso (stejně jako v korejštině)|7. 添加频率副词 — 位于动词之前（与韩语语序相同）|7. Gyakoriságot kifejező határozószók — az ige előtt (ugyanúgy, mint a koreaiban)|7. Menambahkan adverbia frekuensi — sebelum kata kerja (urutannya sama dengan bahasa Korea)
Frequency adverbs like thường (usually, often), luôn luôn (always), and cũng (also) come before the verb, just like in Korean.
Příslovce četnosti jako thường (obvykle, často), luôn luôn (vždy) a cũng (také) stojí před slovesem, stejně jako v korejštině.|像 thường（通常·经常）、luôn luôn（总是）、cũng（也）这样的频率副词，和韩语一样放在动词前面。|A gyakoriságot kifejező határozószók, mint a thường (általában, gyakran), a luôn luôn (mindig) és a cũng (is), az ige előtt állnak, akárcsak a koreaiban.|Adverbia frekuensi seperti thường (biasanya, sering), luôn luôn (selalu), dan cũng (juga) diletakkan sebelum kata kerja, sama seperti bahasa Korea.
usually / normal
obvykle / běžný|通常|általában / szokásos|biasanya / biasa
I usually eat at home.
Obvykle jím doma.|我通常在家吃饭。|Általában otthon eszem.|Saya biasanya makan di rumah.
8. Adding an auxiliary verb — before the verb
8. Přidání pomocného slovesa — před sloveso|8. 添加助动词 — 位于动词之前|8. Segédige hozzáadása — az ige előtt|8. Menambahkan kata kerja bantu — sebelum kata kerja
muốn (want to ~), phải (must ~), có thể (can ~) · không thể (cannot ~), nên (should ~), đang (~ing), sẽ (will ~), and đã (~ed) all come right before the verb.
muốn (chtít ~), phải (muset ~), có thể (moci ~) · không thể (nemoci ~), nên (měl by ~), đang (právě ~), sẽ (budu ~) a đã (už ~, minulost) stojí všechny přímo před slovesem.|muốn（想要~）、phải（必须~）、có thể（能~）·không thể（不能~）、nên（最好~）、đang（正在~）、sẽ（将要~）、đã（已经~）都放在动词的正前方。|A muốn (akar ~), phải (kell ~), có thể (tud ~) · không thể (nem tud ~), nên (kellene ~), đang (éppen ~), sẽ (fog ~) és đã (már ~, múlt) mind közvetlenül az ige előtt áll.|muốn (ingin ~), phải (harus ~), có thể (bisa ~) · không thể (tidak bisa ~), nên (sebaiknya ~), đang (sedang ~), sẽ (akan ~), dan đã (sudah ~) semuanya diletakkan tepat sebelum kata kerja.
want to ~
chtít ~|想要~|akar ~|ingin ~
I want to eat.
Chci jíst.|我想吃饭。|Enni akarok.|Saya ingin makan.
must ~
muset ~|必须~|kell ~|harus ~
to go
jít, jet|去|menni|pergi
(to go) study
(jít) studovat|（去）学习|(menni) tanulni|(pergi) belajar
I have to go to school.
Musím jít do školy.|我得去学校。|Iskolába kell mennem.|Saya harus pergi ke sekolah.
can ~
moci ~|能~|tud ~|bisa ~
I can eat.
Můžu jíst.|我能吃饭。|Tudok enni.|Saya bisa makan.
cannot ~
nemoci ~|不能~|nem tud ~|tidak bisa ~
I cannot eat.
Nemůžu jíst.|我不能吃饭。|Nem tudok enni.|Saya tidak bisa makan.
you
ty|你|te|kamu
should ~ / it's better to ~
měl bys ~ / je lepší ~|最好~|kellene ~ / jobb ~|sebaiknya ~
You should eat.
Měl bys jíst.|你最好吃饭。|Enned kellene.|Sebaiknya kamu makan.
in the middle of ~ing
právě ~ (probíhající děj)|正在~|éppen ~ (folyamatban)|sedang ~
I am eating.
Právě jím.|我正在吃饭。|Éppen eszem.|Saya sedang makan.
will ~
budu ~ (budoucnost)|将要~|fog ~ (jövő)|akan ~
I will eat.
Budu jíst.|我将要吃饭。|Enni fogok.|Saya akan makan.
~ed
už ~ (minulost)|~了|már ~ (múlt)|sudah ~
I ate.
Jedl jsem.|我吃了饭。|Ettem.|Saya sudah makan.
9. Degree adverb + adjective — before the adjective
9. Příslovce míry + přídavné jméno — před přídavné jméno|9. 程度副词＋形容词 — 位于形容词之前|9. Fokhatározó + melléknév — a melléknév előtt|9. Adverbia derajat + kata sifat — sebelum kata sifat
Degree adverbs like rất (very) modify adjectives, so they come before the adjective. (The adjective itself comes after the noun, but the degree adverb comes before that adjective!)
Příslovce míry jako rất (velmi) rozvíjejí přídavná jména, proto stojí před přídavným jménem. (Přídavné jméno samo stojí za podstatným jménem, ale příslovce míry stojí před tímto přídavným jménem!)|像 rất（非常）这样的程度副词是用来修饰形容词的，所以放在形容词前面。（形容词本身在名词后面，但程度副词在那个形容词前面！）|Az olyan fokhatározók, mint a rất (nagyon), mellékneveket módosítanak, ezért a melléknév előtt állnak. (Maga a melléknév a főnév után áll, de a fokhatározó ez előtt a melléknév előtt!)|Adverbia derajat seperti rất (sangat) menerangkan kata sifat, sehingga diletakkan sebelum kata sifat. (Kata sifatnya sendiri ada setelah kata benda, tetapi adverbia derajat ada sebelum kata sifat itu!)
very
velmi|非常|nagyon|sangat
very delicious rice/meal
velmi chutná rýže / velmi chutné jídlo|非常好吃的饭|nagyon finom rizs / étel|nasi / makanan yang sangat enak
I eat very delicious food.
Jím velmi chutné jídlo.|我吃非常好吃的饭。|Nagyon finom ételt eszem.|Saya makan makanan yang sangat enak.
10. Negative sentences — put không before the verb (or adjective)
10. Záporné věty — před sloveso (nebo přídavné jméno) dejte không|10. 否定句 — 在动词（或形容词）前加 không|10. Tagadó mondatok — az ige (vagy melléknév) elé kerül a không|10. Kalimat negatif — letakkan không sebelum kata kerja (atau kata sifat)
To make it negative, just put "không" right before the predicate.
Zápor vytvoříte tak, že „không“ dáte přímo před přísudek.|否定只要把 không 放在谓语前面即可。|A tagadáshoz elég a „không” szót közvetlenül az állítmány elé tenni.|Untuk membuat kalimat negatif, cukup letakkan "không" tepat sebelum predikat.
inside
uvnitř|里面|benne, belül|di dalam
I don't eat.
Nejím.|我不吃饭。|Nem eszem.|Saya tidak makan.
to be delicious
být chutný|好吃|finom|enak
The rice isn't tasty.
Rýže není chutná.|饭不好吃。|A rizs nem finom.|Nasinya tidak enak.
11. Yes/No questions (wrapping the sentence with có ... không)
11. Otázky ano/ne (věta sevřená do có ... không)|11. 疑问句 — 是/否（用 có ... không 包裹）|11. Eldöntendő kérdések (a mondat có ... không közé kerül)|11. Pertanyaan ya/tidak (kalimat diapit có ... không)
When asking '~합니까?' (Do you ~?), put có before the predicate and không at the end of the sentence. Literally, it's structured like '~ have ... ~ not have?'
Když se ptáte „Děláš ~?“, dejte có před přísudek a không na konec věty. Doslova má taková věta stavbu „~ má … ~ nemá?“.|问“做~吗？”时，在谓语前加 có，在句末加 không。直译的话是“~有…~没有？”的结构。|Ha azt kérdezzük: „~-sz?” (Csinálod ~?), a có az állítmány elé, a không a mondat végére kerül. Szó szerint olyan a szerkezete, mint „~ van … ~ nincs?”.|Saat bertanya "Apakah kamu ~?", letakkan có sebelum predikat dan không di akhir kalimat. Secara harfiah strukturnya seperti "~ ada ... ~ tidak ada?".
(question) have / there is
(otázka) mít / je|（疑问）有|(kérdés) van|(tanya) ada
(question) not have / there isn't
(otázka) nemít / není|（疑问）没有|(kérdés) nincs|(tanya) tidak ada
Are you eating?
Jíš?|你吃饭吗？|Eszel?|Apakah kamu makan?
12. Questions about completion (~ chưa?)
12. Otázky na dokončení (~ chưa?)|12. 疑问句 — 是否完成（~ chưa？）|12. Befejezettségre vonatkozó kérdések (~ chưa?)|12. Pertanyaan tentang penyelesaian (~ chưa?)
When asking whether something has already been done, like 'Have you ~ yet?', add chưa? at the end of the sentence. The answer is rồi for 'already done' and chưa for 'not yet'. However, in the answer, chưa moves to before the verb.
Když se ptáte, zda už se něco stalo, např. „Už jsi ~?“, přidejte na konec věty chưa?. Odpověď „už ano“ je rồi a „ještě ne“ je chưa. V odpovědi se však chưa přesouvá před sloveso.|像“还~了吗？”一样，问是否已经做了某事时，在句末加 chưa？回答“已经做了”用 rồi，“还没做”用 chưa。不过，回答中的 chưa 要移到动词前面。|Ha azt kérdezzük, megtörtént-e már valami („~-tál már?”), a mondat végére chưa? kerül. A válasz „már igen” esetén rồi, „még nem” esetén chưa. A válaszban azonban a chưa az ige elé kerül.|Saat menanyakan apakah sesuatu sudah dilakukan, seperti "Sudahkah kamu ~?", tambahkan chưa? di akhir kalimat. Jawabannya rồi untuk "sudah" dan chưa untuk "belum". Namun dalam jawaban, chưa berpindah ke depan kata kerja.
(Completed?) Not yet
(Hotovo?) Ještě ne|（完成？）还没|(Kész?) Még nem|(Sudah?) Belum
Did you eat?
Už jsi jedl?|你吃饭了吗？|Ettél már?|Kamu sudah makan?
already (completed)
už (hotovo)|已经（完成）|már (befejezett)|sudah (selesai)
I already ate.
Už jsem jedl.|我（已经）吃过饭了。|Már ettem.|Saya sudah makan.
not yet
ještě ne|还（没）|még nem|belum
I haven't eaten yet.
Ještě jsem nejedl.|我还没吃饭。|Még nem ettem.|Saya belum makan.
13. Question words (who, what, where, when, why, how)
13. Tázací slova (kdo, co, kde, kdy, proč, jak)|13. 疑问句 — 疑问词（谁·什么·哪里·何时·为什么·怎么）|13. Kérdőszavak (ki, mi, hol, mikor, miért, hogyan)|13. Kata tanya (siapa, apa, di mana, kapan, mengapa, bagaimana)
Interrogative words usually go in the same position the corresponding word would normally occupy — ai (who) goes in the subject position, gì (what) in the object position, ở đâu (where) in the place position, khi nào (when) in the time position, and thế nào (how) after the predicate. However, tại sao (why) is an exception and comes at the very beginning of the sentence.
Tázací slova obvykle stojí na místě slova, na které se ptají — ai (kdo) na místě podmětu, gì (co) na místě předmětu, ở đâu (kde) na místě určení místa, khi nào (kdy) na místě určení času a thế nào (jak) za přísudkem. Výjimkou je tại sao (proč), které stojí úplně na začátku věty.|疑问词通常放在原本那个词所在的位置 — ai（谁）放在主语位置，gì（什么）放在宾语位置，ở đâu（哪里）放在地点位置，khi nào（何时）放在时间位置，thế nào（怎么样）放在谓语后面。不过 tại sao（为什么）是例外，放在句子最前面。|A kérdőszavak általában annak a szónak a helyén állnak, amelyre kérdeznek — az ai (ki) az alany helyén, a gì (mi) a tárgy helyén, az ở đâu (hol) a helyhatározó helyén, a khi nào (mikor) az időhatározó helyén, a thế nào (hogyan) pedig az állítmány után. Kivétel a tại sao (miért), amely a mondat legelején áll.|Kata tanya biasanya menempati posisi kata yang ditanyakan — ai (siapa) di posisi subjek, gì (apa) di posisi objek, ở đâu (di mana) di posisi tempat, khi nào (kapan) di posisi waktu, dan thế nào (bagaimana) setelah predikat. Namun tại sao (mengapa) adalah pengecualian dan diletakkan di awal kalimat.
who
kdo|谁|ki|siapa
Who eats rice?
Kdo jí rýži?|谁吃饭？|Ki eszik rizst?|Siapa yang makan nasi?
what
co|什么|mi|apa
What are you eating?
Co jíš?|你吃什么？|Mit eszel?|Kamu makan apa?
where
kde|在哪里|hol|di mana
Where do you eat?
Kde jíš?|你在哪里吃饭？|Hol eszel?|Kamu makan di mana?
when
kdy|什么时候|mikor|kapan
When do you eat?
Kdy jíš?|你什么时候吃饭？|Mikor eszel?|Kapan kamu makan?
why
proč|为什么|miért|mengapa
Why do you eat?
Proč jíš?|你为什么吃饭？|Miért eszel?|Mengapa kamu makan?
How about (it)?
Jak je to s ~? / Co takhle ~?|怎么样|Mi a helyzet ~? / Mit szólsz ~?|Bagaimana dengan ~?
How about rice?
Co takhle rýže?|吃饭怎么样？|Mit szólsz a rizshez?|Bagaimana kalau makan nasi?
14. Alternative questions (A hay B?)
14. Vylučovací otázky (A hay B?)|14. 疑问句 — 选择疑问句（A hay B？）|14. Választó kérdések (A hay B?)|14. Pertanyaan pilihan (A hay B?)
Connecting two options with hay (or) forms an alternative question like 'Do you want A or B?'
Spojením dvou možností pomocí hay (nebo) vznikne vylučovací otázka typu „Chceš A, nebo B?“.|用 hay（或者·或是）连接两个选项，就变成“要A还是要B？”这样的选择疑问句。|Két lehetőséget a hay (vagy) szóval összekötve választó kérdés jön létre, például: „A-t kérsz vagy B-t?”|Menghubungkan dua pilihan dengan hay (atau) membentuk pertanyaan pilihan seperti "Mau A atau B?"
or
nebo|或者|vagy|atau
rice noodles (phở)
rýžové nudle (phở)|河粉|rizstészta (phở)|mi beras (phở)
Do you want to eat rice or pho (rice noodles)?
Chceš jíst rýži, nebo phở (rýžové nudle)?|你要吃饭还是吃河粉？|Rizst szeretnél enni vagy phởt (rizstésztát)?|Kamu mau makan nasi atau phở (mi beras)?
15. Connecting sentences with conjunctions
15. Spojování vět spojkami|15. 用连接词连接句子|15. Mondatok összekapcsolása kötőszókkal|15. Menghubungkan kalimat dengan kata sambung
You can connect two short sentences into a longer one using và (and), nhưng (but), and vì...nên (because ~, so ~).
Pomocí và (a), nhưng (ale) a vì...nên (protože ~, proto ~) můžete spojit dvě krátké věty do jedné delší.|用 và（而且）、nhưng（但是）、vì...nên（因为~所以~）可以把两个短句连接成更长的句子。|A và (és), nhưng (de) és vì...nên (mert ~, ezért ~) segítségével két rövid mondatot hosszabbá kapcsolhatunk össze.|Dengan và (dan), nhưng (tetapi), dan vì...nên (karena ~, maka ~), dua kalimat pendek dapat digabung menjadi kalimat yang lebih panjang.
and
a|而且，和|és|dan
to drink
pít|喝|inni|minum
water
voda|水|víz|air
I eat and drink water.
Jím a piju vodu.|我吃饭然后喝水。|Eszem és vizet iszom.|Saya makan dan minum air.
to like
mít rád|喜欢|szeretni, kedvelni|suka
but, however
ale, však|但是|de, azonban|tetapi, namun
I like rice but I don't like water.
Mám rád rýži, ale nemám rád vodu.|我喜欢饭，但不喜欢水。|Szeretem a rizst, de a vizet nem szeretem.|Saya suka nasi, tetapi tidak suka air.
because of ~
protože ~|因为~|mert ~|karena ~
to be hungry
mít hlad|饿|éhes|lapar
so, therefore
proto, tak|所以|ezért, így|maka, jadi
I eat because I'm hungry.
Jím, protože mám hlad.|我因为肚子饿所以吃饭。|Azért eszem, mert éhes vagyok.|Saya makan karena lapar.
16. Practice with various verbs — đọc sách (reading a book)
16. Procvičování s různými slovesy — đọc sách (číst knihu)|16. 用各种动词练习 — đọc sách（读书）|16. Gyakorlás különféle igékkel — đọc sách (könyvet olvasni)|16. Latihan dengan berbagai kata kerja — đọc sách (membaca buku)
Practice the sentence pattern learned so far with different verbs and objects. đọc (to read) + sách (book).
Procvičte dosud probrané vzorce vět s jinými slovesy a předměty. đọc (číst) + sách (kniha).|用不同的动词·宾语练习到目前为止学过的句型。đọc（读）+ sách（书）。|Gyakorolja az eddig tanult mondatszerkezetet más igékkel és tárgyakkal. đọc (olvasni) + sách (könyv).|Latih pola kalimat yang telah dipelajari dengan kata kerja dan objek lain. đọc (membaca) + sách (buku).
to read
číst|读|olvasni|membaca
I read.
Čtu.|我读。|Olvasok.|Saya membaca.
book
kniha|书|könyv|buku
I read a book.
Čtu knihu.|我读书。|Könyvet olvasok.|Saya membaca buku.
evening
večer|晚上|este|malam
I usually read books at home in the evening.
Večer obvykle čtu doma knihy.|我通常晚上在家看书。|Este általában otthon olvasok könyvet.|Saya biasanya membaca buku di rumah pada malam hari.
17. Practice with various verbs — đi nhóm họp (going to the meeting)
17. Procvičování s různými slovesy — đi nhóm họp (jít na shromáždění)|17. 用各种动词练习 — đi nhóm họp（去聚会）|17. Gyakorlás különféle igékkel — đi nhóm họp (összejövetelre menni)|17. Latihan dengan berbagai kata kerja — đi nhóm họp (pergi ke perhimpunan)
đi (to go) + nhóm họp (meeting).
đi (jít) + nhóm họp (shromáždění).|đi（去）+ nhóm họp（聚会）。|đi (menni) + nhóm họp (összejövetel).|đi (pergi) + nhóm họp (perhimpunan).
I go.
Jdu.|我去。|Megyek.|Saya pergi.
meeting
shromáždění|聚会|összejövetel|perhimpunan
I go to the meeting.
Jdu na shromáždění.|我去聚会。|Összejövetelre megyek.|Saya pergi ke perhimpunan.
I want to go to the meeting in the evening.
Večer chci jít na shromáždění.|我晚上想去聚会。|Este összejövetelre akarok menni.|Saya ingin pergi ke perhimpunan pada malam hari.
Are you going to the meeting?
Jdeš na shromáždění?|你去聚会吗？|Mész az összejövetelre?|Apakah kamu pergi ke perhimpunan?
18. Practice with various verbs — học Kinh Thánh (studying the Bible)
18. Procvičování s různými slovesy — học Kinh Thánh (studovat Bibli)|18. 用各种动词练习 — học Kinh Thánh（学习圣经）|18. Gyakorlás különféle igékkel — học Kinh Thánh (a Bibliát tanulmányozni)|18. Latihan dengan berbagai kata kerja — học Kinh Thánh (belajar Alkitab)
học (to study) + Kinh Thánh (the Bible).
học (studovat) + Kinh Thánh (Bible).|học（学习）+ Kinh Thánh（圣经）。|học (tanulni) + Kinh Thánh (a Biblia).|học (belajar) + Kinh Thánh (Alkitab).
to study
studovat, učit se|学习|tanulni|belajar
I study.
Studuji.|我学习。|Tanulok.|Saya belajar.
the Bible
Bible|圣经|a Biblia|Alkitab
I study the Bible.
Studuji Bibli.|我研读圣经。|Tanulmányozom a Bibliát.|Saya belajar Alkitab.
every day
každý den|每天|minden nap|setiap hari
I want to study the Bible every day.
Chci každý den studovat Bibli.|我想每天研读圣经。|Minden nap tanulmányozni akarom a Bibliát.|Saya ingin belajar Alkitab setiap hari.
19. Practice with various verbs — Bạn đi làm (going to work)
19. Procvičování s různými slovesy — Bạn đi làm (jít do práce)|19. 用各种动词练习 — Bạn đi làm（去工作）|19. Gyakorlás különféle igékkel — Bạn đi làm (dolgozni menni)|19. Latihan dengan berbagai kata kerja — Bạn đi làm (pergi bekerja)
When làm (to work) follows đi, it means 'to go to work (commute)'. Practice using the other person (bạn, you) as the subject.
Když za đi následuje làm (pracovat), znamená to „jít do práce (dojíždět)“. Procvičujte s druhou osobou (bạn, ty) jako podmětem.|làm（工作）放在 đi 后面，就变成“去工作（上班）”的意思。用对方（bạn·你）作主语来练习。|Ha a làm (dolgozni) az đi után áll, jelentése „dolgozni menni (munkába járni)”. Gyakoroljon úgy, hogy a másik személy (bạn, te) az alany.|Jika làm (bekerja) mengikuti đi, artinya "pergi bekerja (berangkat kerja)". Berlatihlah dengan lawan bicara (bạn, kamu) sebagai subjek.
You go.
Jdeš.|你去。|Mész.|Kamu pergi.
work (to do)
pracovat (dělat)|工作（去做）|dolgozni (csinálni)|bekerja (melakukan)
You go to work.
Jdeš do práce.|你去工作。|Dolgozni mész.|Kamu pergi bekerja.
Are you going to work?
Jdeš do práce?|你去上班吗？|Dolgozni mész?|Apakah kamu pergi bekerja?
20. Practice with various verbs — Bạn đi học (going to study)
20. Procvičování s různými slovesy — Bạn đi học (jít se učit)|20. 用各种动词练习 — Bạn đi học（去学习）|20. Gyakorlás különféle igékkel — Bạn đi học (tanulni menni)|20. Latihan dengan berbagai kata kerja — Bạn đi học (pergi belajar)
When học (to study) follows đi, it means 'to go study (at school)'.
Když za đi následuje học (učit se), znamená to „jít se učit (do školy)“.|học（学习）放在 đi 后面，就变成“去学习（上学）”的意思。|Ha a học (tanulni) az đi után áll, jelentése „tanulni menni (iskolába járni)”.|Jika học (belajar) mengikuti đi, artinya "pergi belajar (ke sekolah)".
You go to school.
Jdeš do školy.|你去学校。|Iskolába mész.|Kamu pergi ke sekolah.
Did you go to school?
Šel jsi do školy?|你去学校了吗？|Elmentél az iskolába?|Apakah kamu sudah pergi ke sekolah?
"""


def _table():
    lines = [l for l in _ROWS.strip("\n").split("\n")]
    assert len(lines) % 2 == 0, len(lines)
    out = {}
    for i in range(0, len(lines), 2):
        vals = lines[i + 1].split("|")
        assert len(vals) == len(GRAMMAR_LESSONS_AI_LANGS), lines[i]
        out[lines[i]] = dict(zip(GRAMMAR_LESSONS_AI_LANGS, vals))
    return out


GRAMMAR_LESSONS_AI = _table()


def _walk(o):
    if isinstance(o, dict):
        if "ko" in o and "en" in o and all(isinstance(v, str) for v in o.values()):
            for lang, text in GRAMMAR_LESSONS_AI.get(o["en"], {}).items():
                if not o.get(lang):
                    o[lang] = text
            return
        for v in o.values():
            _walk(v)
    elif isinstance(o, list):
        for v in o:
            _walk(v)


def apply_grammar_lessons_ai_translations(data):
    out = copy.deepcopy(data)
    _walk(out)
    return out
