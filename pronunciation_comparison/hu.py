# -*- coding: utf-8 -*-
"""[발음] > [차이] -- Magyar. Formátum: lásd pronunciation_comparison/__init__.py."""

UI = {
    "intro": "A vietnami kiejtés (ha nincs másképp jelölve, a hanoi standard kiejtés) összevetése az egyes nyelvekkel, azok beszélőinek szemszögéből. Az írást és a hangot külön kezeljük: ugyanaz a betű két ábécében nem jelent ugyanolyan fonémát. Az IPA / / között fonémát, [ ] között tényleges kiejtést jelöl.",
    "common": "Hasonlóságok",
    "diff": "Különbségek",
}

SECTIONS = {
    "ko": {
        "title": "A koreai és a vietnami",
        "common": """
Mindkét nyelv élesen elválasztja a szótagokat, és a szótagot felpattanás nélküli mássalhangzóval zárja: a koreai 밥 [pap̚] és a vietnami đáp [ɗaːp̚] ugyanúgy végződik – zárt ajakkal, kiáramló levegő nélkül. A koreaiak tehát már uralják azt, ami a vietnami szótagvégekben a legtöbb tanulónak a legnehezebb.
- Szótagvégek: a hét koreai szótagvégi hang [p̚ t̚ k̚ m n ŋ l] közül hat megegyezik a vietnami /p t k m n ŋ/ szótagvégekkel (írásban p, t, c/ch, m, n, ng/nh).
- /ŋ/: a szótagvégi ㅇ (강) a vietnami szótagvégi ng; a vietnami a szótag elején is használja (ngà).
- Hehezet: a ㅌ /tʰ/ közel áll a vietnami th /tʰ/-hoz; a hehezet nélküli vietnami t /t/ a feszes ㄸ-hez közelebb áll, mint a ㄷ-hez.
- Magánhangzók: ㅣ[i], ㅔ[e], ㅏ[a], ㅜ[u], ㅗ[o] nagyjából az i, ê, a, u, ô megfelelői; a ㅡ [ɯ] jó kiindulópont az ư [ɨ]-hez.
- Félhangzó + magánhangzó: a 와 [wa], 워 [wʌ] hasonlít a vietnami oa [wa], uơ hangsorra.
- Ritmus: mindkét nyelv szótagidőzítésű; minden szótag megtartja teljes magánhangzóját, az angolra jellemző redukció nélkül.
""",
        "diff": """
## A. A vietnamiban megvan, a koreaiban nincs (vagy másképp van)
- Lexikai hangok: a hanoi kiejtésben hat hang van; minden szótag hangmagasság-görbéje és hangminősége más szót jelent (ma, mà, má, mả, mã, mạ). A szöuli standard koreaiban nincs lexikai hang, a hangmagasság csak a frázist formálja.
- Implozív b [ɓ], đ [ɗ]: zöngés, enyhén befelé irányuló légárammal. A koreaiban nincs zöngés zárhang-fonéma (a ㅂ, ㄷ csak magánhangzók között zöngésedik).
- Az /f/ (ph), /v/, /z/ (Hanoiban d, gi, r), /x/ (kh), /ɣ/ (g, gh) réshangok nem koreai fonémák.
- Az ơ [əː], a rövid â [ə], a rövid ă és az e [ɛ] / ê [e] szembenállás (a ㅐ/ㅔ a legtöbb beszélőnél egybeesett).
- Az i, ê, a utáni palatális -nh, -ch szótagvég és az ajakzárás az ông [ʔəwŋ͡m], học [hawk͡p] végén.
## B. A koreaiban megvan, a vietnamiban nincs
- A laza/feszes/hehezetes hármas szembenállás (ㄱ/ㄲ/ㅋ, ㅈ/ㅉ/ㅊ); a vietnamiban csak kettős szembenállás van, mint a t/th.
- A szótagvégi /l/ (말) és a ㄹ [ɾ]~[l] váltakozása; vietnami szótag nem végződik l-re.
- A szótagok közötti hangváltozások (orrhangúsodás 국물 → [궁물], átkötés); a vietnamiban minden szótag megtartja saját szótagvégét.
## C. Könnyen összetéveszthető
- A vietnami t nem ㄷ: hehezet nélkül, mint a ㄸ, de kevésbé feszesen. A th a ㅌ-hez hasonlít, és sosem angol „th”.
- Az ư [ɨ] centrálisabb a ㅡ-nál; az ơ [əː] centrálisabb és hosszabb a ㅓ [ʌ]-nál.
- Az o, ô, u utáni -c zárt ajakkal végződik (học ≈ [hawk͡p]), nem 학.
## D. Rendszer
A koreai beszélők gyakran frázisintonációt használnak; a vietnamiban a hangmagasság minden egyes szótaghoz tartozik, és gyors beszédben is meg kell őrizni. A p, t, c, ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "ja": {
        "title": "A japán és a vietnami",
        "common": """
A japán és a vietnami ritmusa tiszta és egyenletes, sok az egyszerű mássalhangzó, ezért a japánok általában könnyen megbirkóznak a vietnami szókezdő hangokkal.
- Mássalhangzók: a /m n p b t d k ɡ s h/ mindkét nyelvben megvan; a ニャ [ɲa] adja a vietnami nh [ɲ]-t (nhà), a k/g előtti ン ([ŋ]) az ng-t.
- Magánhangzók: a japán a, i, e, o közel áll a vietnami a, i, ê, ô-hoz; a japán u ajakkerekítés nélküli [ɯ] – jó lépés a vietnami ư [ɨ] felé (a vietnami u teljesen kerekített).
- Ritmus: egyik nyelv sem redukálja a magánhangzókat; minden egység teljesen és egyenletesen szól.
- A hangmagasság mindkettőben számít: a japán a 箸/橋 szópárt hangmagasság-hangsúllyal különbözteti meg, így a japánok már figyelnek a hangmagasságra.
- Gégezár: a szünet előtti っ és a magánhangzóval kezdődő vietnami szótagok eleje (ăn [ʔan]) egyaránt gégezárat tartalmaz.
- Zöngétlen zárhangok: a japán /t k/ csak gyengén hehezetes, közel áll a vietnami t, c-hez.
""",
        "diff": """
## A. A vietnamiban megvan, a japánban nincs (vagy másképp van)
- Lexikai hangok: hat dallamhang eltérő hangminőséggel (recsegő ngã, gégezáras nặng). A japán hangmagasság-hangsúly más rendszer: azt jelöli, melyik mora után esik a hangmagasság a szóban, nem minden szótagra tesz dallamot.
- Szótagvégi mássalhangzók: -p, -t, -c/-ch, -m, -n, -ng/-nh, mind felpattanás nélkül. A japánban csak ン és っ van, ezért a beszélők könnyen magánhangzót tesznek utánuk (táp → タプ). A szótagvég után maradjon zárva és néma a száj.
- A hehezetes th [tʰ] és a hehezet nélküli t [t] fonémikus szembenállása.
- Implozív b [ɓ], đ [ɗ]; /f v z x ɣ/ réshangok (a japán ふ [ɸ], nem [f]).
- Tizenegy magánhangzó-minőség, köztük ơ [əː], â [ə], ă, ư [ɨ], e [ɛ]/ê [e], o [ɔ]/ô [o], valamint az ia, ưa, ua kettőshangzók.
## B. A japánban megvan, a vietnamiban nincs
- Fonémikus magánhangzó-hosszúság (おばさん/おばあさん) és hosszú mássalhangzók (きて/きって). A vietnamiban a hosszúság a hangminőséghez kötött (a/ă, ơ/â), nem külön szembenállás.
- A mora mint időegység, a következő hangtól függően [m n ŋ ɴ]-ként ejtett ン, a zöngétlenedő magánhangzók (です [des]).
- /ts/ (つ), [ɕ] (し), [dʑ] (じ).
## C. Könnyen összetéveszthető
- A ら-sor [ɾ] az l-t és az r-t is jelöli; a vietnami l tiszta [l], az r Hanoiban [z], délen [ɹ]~[r].
- Az ư nem ウ: az ajak széthúzva, a nyelv középen.
- A szótagvégi -n és -ng szavakat különböztet meg (tan / tang); a japán ン ezt nem teszi.
## D. Rendszer
A japán szó morákból áll egyetlen hangsúlymintával; a vietnamiban minden morféma egy szótag saját hanggal. A -p, -t, -c, -ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "zh": {
        "title": "A tajvani hokkien, a kantoni és a vietnami",
        "note": """
A hagyományos írásjegyek írásrendszert jelentenek, nem kiejtést. Tajvan standard nyelve a mandarin (國語); itt két másik kínai nyelvet vetünk össze, amelyek hangrendszere nagyon eltér a mandarinétól: a tajvani hokkient (臺灣台語/閩南語) és a hongkongi, kantoni (Kuangtung) kantonit (粵語).
""",
        "subsections": {
            "nan": {
                "title": "A tajvani hokkien és a vietnami",
                "common": """
A tajvani hokkien a régebbi kínai sok olyan vonását őrzi, amely a vietnamiban is megvan, így beszélői a vietnami szótagszerkezet nagy részét felismerik.
- Zárhangos szótagvégek: a „belépő hangú” szótagokban -p, -t, -k és gégezáras -h [ʔ] áll (十 tsa̍p, 日 ji̍t, 學 ha̍k), a vietnami -p, -t, -c megfelelőiként.
- Az orrhangú szótagvégek -m, -n, -ng mind megvannak (心 sim ↔ tâm, 山 san, 東 tang).
- Hehezet: a p/ph, t/th, k/kh a vietnami t/th-nak felel meg; a vietnami c [k] a hokkien k.
- A zöngés b és g (bah, gû) segít a vietnami zöngés szókezdőknél.
- Hangok: sok lexikai hang és rövid hangok a zárhangos végű szótagokban – ahogy a vietnamiban is a -p, -t, -c, -ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
- A szókezdő ng (雅 ngá) ismerős, mint a vietnami ngà-ban.
""",
                "diff": """
## A. A vietnamiban megvan, a hokkienben nincs (vagy másképp van)
- A gégezáras ngã és nặng hang, valamint a lehelletes, mély huyền.
- Implozív b [ɓ], đ [ɗ]; ph [f], v, d/gi [z], kh [x], g [ɣ] réshangok.
- Az ư [ɨ], ơ/â [ə], e [ɛ] magánhangzók és az ô [o]/o [ɔ] szembenállás; az ưa, ươ kettőshangzók.
- A palatális ch [c] és nh [ɲ].
## B. A hokkienben megvan, a vietnamiban nincs
- Orrhangú magánhangzók (三 sann [sã], 天 thinn): a vietnamiban nincsenek, az an valódi [n]-nel végződik.
- Kiterjedt hangsandhi: a frázis szinte minden nem utolsó szótagja hangot vált; a vietnami minden szótag hangját megőrzi.
- Szótagalkotó m és ng (毋 m̄, 黃 n̂g), valamint a gégezáras -h szótagvég.
- A ts, tsh, j [dz] affrikáták.
## C. Könnyen összetéveszthető
- Az a, ă utáni szótagvégi -c [k̚]; o, ô, u után az ajak is zárul (học [hawk͡p]).
- A t hehezet nélküli, a th hehezetes – mint a hokkienben –, de más betűk eltérnek a Pe̍h-ōe-jī-től (a vietnami ph = [f], nem [pʰ]).
- A sandhi szokásait ne vigyük át a vietnami összetett szavakra.
## D. Rendszer
Mindkettő hangnyelv zárhangos végű szótagokkal, de a vietnami hangok szótagonként rögzítettek, és a hangmagasságon túl hangminőséget (recsegés, gégezár) is magukban foglalnak.
""",
            },
            "yue": {
                "title": "A kantoni és a vietnami",
                "common": """
A kantoni valószínűleg az a kínai nyelv, amelynek szótagszerkezete a legközelebb áll a vietnamihoz.
- Szótagvégek: pontosan a vietnami -p, -t, -k, -m, -n, -ng sor, mind felpattanás nélkül (十 sap6, 日 jat6, 學 hok6).
- Hangok: hat megkülönböztető hang, a zárhangos végű szótagok „belépő hanggal” – a -p, -t, -c, -ch szótagok sắc/nặng mintázata.
- Magánhangzó-hosszúság: az aa [aː] / a [ɐ] (三 saam / 心 sam) a vietnami a [aː] / ă [a] és ơ [əː] / â [ə] párra emlékeztet.
- Hehezet: a b/p, d/t, g/k (jyutping) a vietnami t/th-nak felel meg.
- Szókezdő ng [ŋ] (我 ngo5) is van, mint a vietnami ngà-ban.
- A kínai–vietnami megfelelések gyakran átláthatók: 國 gwok3 ↔ quốc, 心 sam1 ↔ tâm, 南 naam4 ↔ nam.
""",
                "diff": """
## A. A vietnamiban megvan, a kantoniban nincs (vagy másképp van)
- A gégezáras ngã és nặng hang; a lehelletes huyền. A kantoni hangok főként magasságban és dallamban különböznek.
- Implozív b [ɓ], đ [ɗ]; zöngés v, d/gi [z], g [ɣ] réshangok; kh [x] (a kantoni h [h]).
- Palatális ch [c], nh [ɲ]; ư [ɨ]; az e [ɛ]/ê [e] szembenállás.
- A középre tartó ia, ưa, ua kettőshangzók.
## B. A kantoniban megvan, a vietnamiban nincs
- Kerekített elöl képzett magánhangzók: yu [y], oe/eo [œ ɵ] (魚 jyu, 靴 hoe).
- Labializált gw, kw (國 gwok, 裙 kwan); a quốc-ban a [w] a mediális része.
- Szótagalkotó m és ng (唔 m4, 五 ng5); három, csak magasságban eltérő egyenletes hang.
## C. Könnyen összetéveszthető
- A vietnami d [z] (Hanoi) vagy [j] (dél), sosem [t]; a đ [ɗ].
- A vietnami hangokat ne fordítsuk kantoni hangszámokra: a ngang középmagas egyenletes, a sắc magas emelkedő, a huyền mély eső és lehelletes.
- Az o, ô, u utáni -c, -ng ajakzárással végződik: học [hawk͡p], ông [ʔəwŋ͡m].
## D. Rendszer
Mindkettőben hat hang és zárhangos végű szótag van, de a vietnami a hangokat hangminőséggel is megkülönbözteti, és nincs hangsandhija.
""",
            },
        },
    },
    "zh_cn": {
        "title": "A standard kínai (mandarin) és a vietnami",
        "common": """
A standard kínai (putonghua) és a vietnami egyszótagú morfémákból álló hangnyelv, és az évszázados kapcsolat nagy kínai eredetű szókincset adott a vietnaminak – a mandarinul beszélőknek valódi előnyeik vannak.
- Hangok: minden szótagnak lexikai hangja van. A 2. hang (35) a sắc-ra, az eső-emelkedő 3. hang (214) a hỏi-ra emlékeztet.
- Hehezet: a d/t [t]/[tʰ] a vietnami t [t] / th [tʰ] megfelelője; a vietnami c [k] a mandarin g [k], a kh pedig a mandarin h [x] réshangja.
- Szótagszerkezet: (szókezdő) + (mediális) + mag + (szótagvég), egy hanggal az egész szótagon – ugyanaz a keret, mint a mandarinban.
- Közös orrhangú szótagvégek -n, -ng; a hang szó ng [ŋ]-je a vietnami -ng.
- A kínai–vietnami szavak rendszeresen megfelelnek az írásjegyeknek: 學 xué ↔ học, 國 guó ↔ quốc, 心 xīn ↔ tâm.
- Retroflex hangok: a mandarin sh [ʂ], r [ʐ] a gondos vagy déli kiejtésű vietnami s-re és r-re hasonlít.
""",
        "diff": """
## A. A vietnamiban megvan, a mandarinban nincs (vagy másképp van)
- Hat hang (Hanoi), kettő gégezáras: ngã (emelkedő, gégezárral megszakítva) és nặng (rövid, mély, gégezárral végződik). A mandarinban négy hang és semleges hang van, egyik sem gégezáras; az 1. hang (55) magasabb a középmagas ngang-nál (33).
- A -p, -t, -c/-ch és -m szótagvég: a középkori kínaiban megvolt, a mandarinban eltűnt (十 thập, 心 tâm).
- Zöngés mássalhangzók: implozív b [ɓ], đ [ɗ], v, d/gi [z], g [ɣ] réshangok.
- Az ơ/â [ə], ư [ɨ] magánhangzók, az e [ɛ]/ê [e] és o [ɔ]/ô [o] szembenállás; az ia, ưa, ua kettőshangzók.
## B. A mandarinban megvan, a vietnamiban nincs
- A kerekített ü [y] (绿, 女).
- Az alveopalatális j q x [tɕ tɕʰ ɕ], a dentális z c [ts tsʰ] affrikáták és általában a hehezetes affrikáták.
- Az er-hua (儿化), a semleges hang, a hangsandhi (3. hang 3. hang előtt).
## C. Könnyen összetéveszthető
- A vietnami ch [c] palatális zárhang, nem a mandarin ch [tʂʰ] vagy q [tɕʰ]; a tr Hanoiban [c], délen [ʈ].
- A vietnami x [s] (a mandarin s), az s Hanoiban [s], délen [ʂ].
- A th hehezetes [tʰ] (a mandarin t), nem [θ].
- A nặng nem a 4. hang: mélyen kezdődik és gégezár vágja el.
## D. Rendszer
A hasonlónak látszó hangok dallama is eltér: minden vietnami hangot magasság, forma és hangminőség szerint tanuljunk meg. A -p, -t, -c, -ch végű szótagok csak sắc vagy nặng hangot kaphatnak, a régi „belépő hanghoz” hasonlóan.
""",
    },
    "cs": {
        "title": "A cseh és a vietnami",
        "common": """
A csehül beszélők előnyben vannak néhány vietnami mássalhangzónál, amely sok tanulónak nehézséget okoz.
- Hehezet nélküli zárhangok: a cseh p, t, k hehezet nélküli, pontosan mint a vietnami p, t, c/k.
- Palatálisok: ň [ɲ] = vietnami nh (nhà); a ť [c] nagyon közel áll a vietnami ch [c]-hez (cha); a ď [ɟ] is hasznos viszonyítási pont.
- Veláris réshang: a cseh ch [x] = vietnami kh (khá).
- A zöngés v, z réshang mindkét nyelvben megvan (vietnami v, valamint Hanoiban d/gi/r = [z]).
- Magánhangzó-hosszúság: a cseh a/á hosszúságban különbözik; a vietnami a [aː] / ă [a] és ơ [əː] / â [ə] is hosszú–rövid párt alkot, de hangszínben is eltér.
- Az i, e, a, o, u nagyjából a vietnami i, ê/e, a, ô/o, u megfelelője.
""",
        "diff": """
## A. A vietnamiban megvan, a csehben nincs (vagy másképp van)
- Hat lexikai hang (Hanoi); a cseh hangmagasság csak intonáció, a hangsúly rögzítetten az első szótagon van.
- Szótag eleji /ŋ/ (ngà, nghe); a cseh [ŋ] csak k/g előtt fordul elő (banka).
- A t [t]-vel szembenálló hehezetes th [tʰ]; implozív b [ɓ], đ [ɗ]; g [ɣ] (más, mint a cseh h [ɦ]).
- Az ư [ɨ], ơ/â [ə] magánhangzók és az e [ɛ]/ê [e], o [ɔ]/ô [o] szembenállás.
- Felpattanás nélküli -p, -t, -c és ajakzárás o, ô, u után.
## B. A csehben megvan, a vietnamiban nincs
- Mássalhangzó-torlódások (zmrzlina, čtvrt) és szótagalkotó r, l (vlk).
- ř [r̝], š [ʃ], ž [ʒ], č [tʃ], c [ts]; zöngés h [ɦ].
- Szóvégi zöngétlenedés és zöngésségi hasonulás (led [let]).
## C. Könnyen összetéveszthető
- A vietnami x [s], az s [s] (Hanoi) vagy [ʂ] (dél) – nem a cseh š.
- A vietnami h zöngétlen [h], a cseh h [ɦ]-vel szemben.
- Az ư nem a cseh y: y = [ɪ], ư = [ɨ] (központi, széthúzott ajak).
## D. Rendszer
A cseh az első szótagot hangsúlyozza és a hosszúságot használja; a vietnaminak nincs rögzített szóhangsúlya, minden szótag saját hangot visel. A p, t, c, ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "de": {
        "title": "A német és a vietnami",
        "common": """
A németnek több olyan mássalhangzó- és ritmusjellemzője van, amely közvetlenül hasznosítható a vietnamiban.
- Gégezáras kezdet: a német a szókezdő magánhangzó elé gégezárat tesz (ein [ʔaɪn]); az írásban mássalhangzó nélküli vietnami szótagok ugyanígy kezdődnek (ăn [ʔan]).
- ch [x]: a német „ach-Laut” a vietnami kh (khá).
- Hehezet: a német t [tʰ] közel áll a vietnami th-hoz; a szókezdő d Németország nagy részén zöngétlen és hehezet nélküli, közel a vietnami t-hez.
- /ŋ/: a német ng (Ding) a vietnami szótagvégi ng; a vietnami a szótag elején is használja (ngà).
- Magánhangzók: a feszes és laza i, e, a, o, u viszonyítási pont a vietnami i, ê/e, a/ă, ô/o, u-hoz.
- A zöngés v [v] (német w) és z [z] (a Sonne s-e) mindkét nyelvben megvan.
""",
        "diff": """
## A. A vietnamiban megvan, a németben nincs (vagy másképp van)
- Hat lexikai hang (Hanoi), köztük a gégezáras ngã és nặng; a német a hangmagasságot csak intonációra és hangsúlyra használja.
- Implozív b [ɓ], đ [ɗ]; palatális ch [c], nh [ɲ]; g [ɣ].
- Az ư [ɨ], ơ [əː], â [ə] mint teljes, hangsúlyozható magánhangzók (a német svá csak hangsúlytalan szótagban áll).
- Felpattanás nélküli szótagvégek: a német a szótagvéget felpattantja vagy zöngétleníti; a vietnami -p, -t, -c néma zár.
## B. A németben megvan, a vietnamiban nincs
- Kerekített elöl képzett ü [y], ö [ø]; megkülönböztető hosszúság (Staat/Stadt).
- Szóvégi zöngétlenedés (Rad [ʁaːt]) és mássalhangzó-torlódás (Strumpf).
- Uvuláris r [ʁ], sch [ʃ], z [ts], pf.
- Lexikai szóhangsúly és redukált hangsúlytalan szótagok.
## C. Könnyen összetéveszthető
- A vietnami d nem a német d: Hanoiban [z], délen [j]; a đ [ɗ].
- A vietnami v [v], nem a német v [f]; az [f]-et ph jelöli.
- Az s [s]/[ʂ], az x [s] – egyik sem sch.
- Az ơ nem hangsúlytalan német e, hanem teljes, hosszú középső magánhangzó.
## D. Rendszer
A német hangsúlyidőzítésű, a vietnami szótagidőzítésű, és minden szótag megtartja hangját. A -p, -t, -c, -ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "en": {
        "title": "Az angol és a vietnami",
        "common": """
Az angolul beszélők sok közös hangra építhetnek, ha az írást elválasztják a hangtól.
- Mássalhangzók: /m n f v s z h l/ mindkettőben megvan; ph = [f], v = [v], x = [s], Hanoiban d/gi/r = [z].
- /ŋ/: a „sing” vége a vietnami ng; a vietnami szótagot is kezd vele (ngà).
- Hehezet: a „top” t-je [tʰ] a vietnami th; az s utáni t („stop”) hehezet nélküli, mint a vietnami t.
- Kettőshangzók: az „eye”, „cow”, „boy” közel áll az ai/ay, ao/au, oi-hoz.
- Gégezár: az „uh-oh”-ban hallható gégezár nyitja a magánhangzóval kezdődő vietnami szótagokat és zárja a nặng hangot.
- Felpattanás nélküli zárhangok: laza beszédben az angolok gyakran nem pattantják fel a szóvégi zárhangot („cat”); a vietnamiban ez a szabály.
""",
        "diff": """
## A. A vietnamiban megvan, az angolban nincs (vagy másképp van)
- Hat lexikai hang (Hanoi). Az angolban a hangmagasság kérdést és nyomatékot jelez; a vietnamiban a szót változtatja meg, így az emelkedő kérdő intonáció egy szót másikká tehet.
- Implozív b [ɓ], đ [ɗ]; palatális ch [c], nh [ɲ]; kh [x], g [ɣ].
- Az ư [ɨ], ơ [əː], â [ə], ă magánhangzók; e [ɛ] / ê [e]; az ia, ưa, ua kettőshangzók.
- Ajakzárás a szótagvégen o, ô, u után (ông, học).
## B. Az angolban megvan, a vietnamiban nincs
- th [θ ð], sh [ʃ], zh [ʒ], ch [tʃ], j [dʒ]; r [ɹ].
- Mássalhangzó-torlódás (strengths) és -s, -l, -r, -v szótagvég; a vietnami szótag csak p, t, c/ch, m, n, ng/nh vagy félhangzó végű lehet.
- Hangsúly és svává redukálódás.
## C. Könnyen összetéveszthető
- A vietnami th [tʰ], sosem [θ].
- A d [z] (észak) vagy [j] (dél); a đ [ɗ] – egyik sem angol d.
- A ch [c] (a nyelvhát a szájpadláson), nem az angol ch [tʃ].
- A szótagvégi -t, -c néma zár: a không phải-ban nincs hallható felpattanás, sem hozzáadott magánhangzó.
## D. Rendszer
Az angol hangsúlyidőzítésű és a hangmagasságot intonációra használja; a vietnami szótagidőzítésű, és minden szótagra rögzített hangot tesz. A p, t, c, ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "fr": {
        "title": "A francia és a vietnami",
        "common": """
A franciának és a vietnaminak több közös képzési szokása van. (A vietnami ábécé sokat köszönhet az európai misszionáriusoknak, de ez a történet a helyesírást magyarázza, nem a kiejtést.)
- Hehezet nélküli zárhangok: a francia p, t, k hehezet nélküli, mint a vietnami p, t, c.
- Zöngés mássalhangzók: francia b, d, v, z; a vietnamiban v [v] és d/gi/r [z] (Hanoi) van; a francia b, d elfogadható kiindulópont a b [ɓ], đ [ɗ]-hez.
- gn [ɲ]: az agneau gn-je a vietnami nh (nhà).
- Magánhangzók: az i, é [e], è [ɛ], a, o [o], ò [ɔ], ou [u] az i, ê, e, a, ô, o, u megfelelője – beleértve a sokaknak nehéz e/ê és o/ô szembenállást.
- Ritmus: a francia szótagidőzítésű, teljes magánhangzókkal, mint a vietnami.
- Az uvuláris r [ʁ] a vietnami g [ɣ] (gà) hasznos közelítése.
""",
        "diff": """
## A. A vietnamiban megvan, a franciában nincs (vagy másképp van)
- Hat lexikai hang (Hanoi); a francia hangmagasság csak a frázis végét és az intonációt jelzi.
- A t-vel szembenálló hehezetes th [tʰ]; kh [x]; palatális ch [c].
- /ŋ/ a szótag elején és végén (ngà, ông).
- Az ư [ɨ], ơ [əː], â [ə], ă magánhangzók.
- Felpattanás nélküli -p, -t, -c; a francia felpattantja a szóvégi mássalhangzót (cap [kap]).
## B. A franciában megvan, a vietnamiban nincs
- Orrhangú magánhangzók (an [ɑ̃], on [ɔ̃], in [ɛ̃]); a vietnami an, ông szájhangú magánhangzó + valódi orrhangú mássalhangzó.
- Kerekített elöl képzett u [y], eu [ø œ].
- ch [ʃ], j [ʒ]; liaison és enchaînement: a vietnami nem köti a szótagvéget a következő magánhangzóhoz.
## C. Könnyen összetéveszthető
- A vietnami an [aːn], a nyelv az ínyhez ér; ne ejtsük orrhangúan, mint a francia an-t.
- Az u [u] (francia ou), az ư [ɨ], nem a francia u [y].
- A th hehezetes [tʰ]; a théâtre th-je egyszerű [t].
- Az r [z] (Hanoi) vagy [ɹ~r] (dél), nem [ʁ].
## D. Rendszer
A francia a frázis utolsó szótagját emeli ki; a vietnami minden szótagnak saját hangot ad. A p, t, c, ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "id": {
        "title": "Az indonéz és a vietnami",
        "common": """
Az indonéz helyesírás a vietnamihoz hasonlóan szinte fonetikus, és a két nyelvnek vannak az európai nyelvekben ritka közös hangjai.
- Szótag eleji ng [ŋ] (ngopi, ngantuk) = vietnami ngà, nghe.
- ny [ɲ] = vietnami nh (nhà).
- Hehezet nélküli zárhangok: az indonéz p, t, k hehezet nélküli, mint a vietnami p, t, c.
- Felpattanás nélküli szótagvégek: a szóvégi -p, -t (atap, lompat) gyakran nem pattan fel, a szóvégi -k gégezár – közel a vietnami szótagvégekhez.
- Svá: az e pepet [ə] (besar) közel áll a vietnami â [ə]-hez és ơ [əː]-hez.
- Az a, i, u, e, o magánhangzók fedik az a, i, u, ê/e, ô/o-t; az ai, au, oi kettőshangzók a vietnami ai, ao, oi-ra hasonlítanak.
""",
        "diff": """
## A. A vietnamiban megvan, az indonézben nincs (vagy másképp van)
- Hat lexikai hang (Hanoi); az indonézben nincs hang, a hangmagasság intonáció.
- A t [t]-vel szembenálló hehezetes th [tʰ].
- Implozív b [ɓ], đ [ɗ]; kh [x], g [ɣ], d/gi/r [z] (Hanoi), v réshangok.
- Az ư [ɨ], ă magánhangzók, az e [ɛ]/ê [e] és o [ɔ]/ô [o] szembenállás; az ia, ưa, ua kettőshangzók.
- Palatális ch [c] és ajakzárás o, ô, u után (ông, học).
## B. Az indonézben megvan, a vietnamiban nincs
- -s, -l, -r, -h szótagvégek (bus, jual, pasar, rumah).
- c [tʃ], j [dʒ], sy [ʃ].
- Többszótagú szavak (gyenge) utolsó előtti szótagi hangsúllyal, és toldalékok.
## C. Könnyen összetéveszthető
- A vietnami c a, o, u előtt [k] (cá), nem az indonéz c [tʃ].
- A ch [c] (palatális zárhang), nem [tʃ].
- Az x [s]; az s [s] vagy [ʂ].
- A szótagvégi -c néma veláris zár [k̚], nem az indonéz -k gégezára.
## D. Rendszer
Az indonéz szavak többszótagúak és hang nélküliek; a vietnami morfémák egyszótagúak, mindegyik saját hanggal. A p, t, c, ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "hu": {
        "title": "A magyar és a vietnami",
        "common": """
A magyarok több palatális mássalhangzóra és a magánhangzó-hosszúság érzékelésére támaszkodhatnak.
- ny [ɲ] = vietnami nh (nhà); a ty [c] nagyon közel áll a vietnami ch-hoz (cha).
- Hehezet nélküli zárhangok: a magyar p, t, k hehezet nélküli, mint a vietnami p, t, c.
- Magánhangzó-hosszúság: a magyar megkülönbözteti a rövid és hosszú magánhangzókat; a vietnami a [aː] / ă [a] és ơ [əː] / â [ə] pár hasonlóan működik (hangszínbeli különbséggel).
- Az i, é [eː], e [ɛ], o, u magánhangzók fedik az i, ê, e, ô/o, u-t; az e/é megkülönböztetése segít az e/ê-nél.
- A zöngés v, z mindkét nyelvben megvan.
- Ritmus: a magyar a hangsúlytalan magánhangzókat is teljesen ejti, ami közel áll a vietnami szótagidőzítéshez.
""",
        "diff": """
## A. A vietnamiban megvan, a magyarban nincs (vagy másképp van)
- Hat lexikai hang (Hanoi); a magyar hangmagasság intonáció, a hangsúly az első szótagra esik.
- Szótag eleji /ŋ/ (ngà); a magyar [ŋ] csak k, g előtt fordul elő.
- Hehezetes th [tʰ]; implozív b [ɓ], đ [ɗ]; kh [x], g [ɣ].
- Az ư [ɨ], ơ/â [ə], ă magánhangzók.
- Felpattanás nélküli szótagvégek és ajakzárás o, ô, u után.
## B. A magyarban megvan, a vietnamiban nincs
- Az ö, ő, ü, ű kerekített elöl képzett magánhangzók és a magánhangzó-harmónia.
- Hosszú mássalhangzók (tt, ll) és mássalhangzó-torlódás.
- cs [tʃ], s [ʃ], zs [ʒ], c [ts], gy [ɟ].
## C. Könnyen összetéveszthető
- Helyesírási csapdák: a vietnami s [s] (Hanoi) vagy [ʂ], nem a magyar s [ʃ]; a vietnami x [s] (magyar sz).
- A vietnami a [aː], nem a magyar a [ɒ].
- A gi [z] (Hanoi) vagy [j] (dél), nem a magyar gy.
## D. Rendszer
A magyar a szó elejét hangsúllyal jelöli és hosszúsági szembenállásokat használ; a vietnami minden szótagnak hangot ad. A p, t, c, ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
    "pl": {
        "title": "A lengyel és a vietnami",
        "common": """
A lengyelben meglepően jó megfelelői vannak néhány vietnami hangnak, amelyekkel más európaiaknak gondjuk van.
- y [ɨ]: a lengyel y (my, ryba) nagyon közel áll a vietnami ư [ɨ]-hoz (như, từ).
- Retroflex sor: az sz [ʂ] és ż/rz [ʐ] a gondos vagy déli kiejtésű vietnami s-re és r-re hasonlít.
- ń [ɲ] = vietnami nh; ch/h [x] = kh.
- Hehezet nélküli zárhangok: a lengyel p, t, k hehezet nélküli, mint a vietnami p, t, c.
- A zöngés w [v], z [z] = vietnami v, d/gi/r (Hanoi [z]).
- Az a, e [ɛ], i, o [ɔ], u magánhangzók a vietnami a, e, i, o, u megfelelői.
""",
        "diff": """
## A. A vietnamiban megvan, a lengyelben nincs (vagy másképp van)
- Hat lexikai hang (Hanoi); a lengyel az utolsó előtti szótagot hangsúlyozza, a hangmagasság intonáció.
- Szótag eleji /ŋ/ (ngà); a lengyel [ŋ] csak k, g előtt.
- Hehezetes th [tʰ]; implozív b [ɓ], đ [ɗ]; g [ɣ]; palatális zárhang ch [c].
- Az ơ [əː], â [ə], ă magánhangzók, valamint az e [ɛ], o [ɔ]-val szembenálló zárt ê [e], ô [o].
- Felpattanás nélküli szótagvégek és ajakzárás o, ô, u után.
## B. A lengyelben megvan, a vietnamiban nincs
- Az ą, ę orrhangú magánhangzók; mássalhangzó-torlódás (chrząszcz, wzgórze).
- Az ś ź ć dź [ɕ ʑ tɕ dʑ] alveopalatálisok és a c, cz, dz, dż affrikáták.
- Szóvégi zöngétlenedés (chleb [xlɛp]) és zöngésségi hasonulás.
## C. Könnyen összetéveszthető
- A vietnami ch [c] zárhang, nem ć [tɕ] vagy cz [tʂ].
- x = [s]; s = [s] (Hanoi) vagy [ʂ] (mint az sz, dél).
- A vietnami e nyílt [ɛ], mint a lengyel e; az ê zárt [e], amely a lengyelben nem önálló magánhangzó.
## D. Rendszer
A lengyel szavaknak rögzített hangsúlyuk és sok mássalhangzó-torlódásuk van; a vietnami szótagok egyszerűek és mindegyik hangot visel. A p, t, c, ch végű szótagok csak sắc vagy nặng hangot kaphatnak.
""",
    },
}
