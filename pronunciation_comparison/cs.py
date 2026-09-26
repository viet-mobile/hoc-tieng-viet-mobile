# -*- coding: utf-8 -*-
"""[발음] > [차이] -- Čeština. Formát: viz pronunciation_comparison/__init__.py."""

UI = {
    "intro": "Vietnamská výslovnost (standardní hanojská, pokud není uvedeno jinak) ve srovnání s jednotlivými jazyky z pohledu jejich mluvčích. Písmo a zvuk rozlišujeme: stejné písmeno ve dvou abecedách neznamená stejný foném. IPA v / / označuje fonémy, v [ ] skutečnou výslovnost.",
    "common": "Shody",
    "diff": "Rozdíly",
}

SECTIONS = {
    "ko": {
        "title": "Korejština a vietnamština",
        "common": """
Oba jazyky zřetelně oddělují slabiky a slabiky zakončují nevypuštěnými souhláskami: korejské 밥 [pap̚] i vietnamské đáp [ɗaːp̚] končí sevřenými rty bez výdechu. Korejští mluvčí tak už ovládají to, co je na vietnamských koncovkách pro většinu studentů nejtěžší.
- Koncovky: sedm korejských koncových hlásek [p̚ t̚ k̚ m n ŋ l] zahrnuje šest vietnamských koncovek /p t k m n ŋ/ (psáno p, t, c/ch, m, n, ng/nh).
- /ŋ/: koncové ㅇ (강) je vietnamské koncové ng; vietnamština ho používá i na začátku slabiky (ngà).
- Přídech: ㅌ /tʰ/ odpovídá vietnamskému th /tʰ/; nepřídechové vietnamské t /t/ má blíž k napjatému ㄸ než k ㄷ.
- Samohlásky: ㅣ[i], ㅔ[e], ㅏ[a], ㅜ[u], ㅗ[o] zhruba odpovídají i, ê, a, u, ô; ㅡ [ɯ] je dobrým výchozím bodem pro ư [ɨ].
- Polosamohláska + samohláska: 와 [wa], 워 [wʌ] se podobají vietnamskému oa [wa], uơ.
- Rytmus: oba jazyky mají slabičný rytmus; každá slabika si zachovává plnou samohlásku bez redukce typické pro angličtinu.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v korejštině
- Lexikální tóny: hanojská vietnamština má šest tónů; průběh výšky a kvalita hlasu každé slabiky mění slovo (ma, mà, má, mả, mã, mạ). Soulská standardní korejština lexikální tóny nemá, výška tvaruje jen fráze.
- Implozivy b [ɓ], đ [ɗ]: znělé, s mírným vtahováním vzduchu. Korejština nemá znělé ražené fonémy (ㅂ, ㄷ znějí jen mezi samohláskami).
- Frikativy /f/ (ph), /v/, /z/ (v Hanoji d, gi, r), /x/ (kh), /ɣ/ (g, gh) nejsou korejské fonémy.
- Samohlásky ơ [əː], krátké â [ə], krátké ă a protiklad e [ɛ] / ê [e] (ㅐ/ㅔ u většiny mluvčích splynuly).
- Palatální koncovky -nh, -ch po i, ê, a a sevření rtů na konci ông [ʔəwŋ͡m], học [hawk͡p].
## B. V korejštině, ale ne ve vietnamštině
- Trojí protiklad lenis/fortis/přídechová (ㄱ/ㄲ/ㅋ, ㅈ/ㅉ/ㅊ); vietnamština má jen dvojí protiklady jako t/th.
- Koncové /l/ (말) a střídání [ɾ]~[l] u ㄹ; žádná vietnamská slabika nekončí na l.
- Hláskové změny mezi slabikami (nazalizace 국물 → [궁물], vázání); ve vietnamštině si každá slabika ponechává svou koncovku.
## C. Snadno zaměnitelné
- Vietnamské t není ㄷ: bez přídechu, jako ㄸ, ale méně napjaté. th se podobá ㅌ a nikdy není anglické „th“.
- ư [ɨ] je centrálnější než ㅡ; ơ [əː] je centrálnější a delší než ㅓ [ʌ].
- Koncové -c po o, ô, u končí sevřenými rty (học ≈ [hawk͡p]), nevyslovuje se jako 학.
## D. Systém
Korejští mluvčí často užívají frázovou intonaci; ve vietnamštině patří výška každé jednotlivé slabice a musí se udržet i v rychlé řeči. Slabiky na p, t, c, ch nesou jen tón sắc nebo nặng.
""",
    },
    "ja": {
        "title": "Japonština a vietnamština",
        "common": """
Japonština a vietnamština mají jasný, rovnoměrný rytmus a mnoho jednoduchých souhlásek, takže japonským mluvčím obvykle nedělají vietnamské počáteční souhlásky velké potíže.
- Souhlásky: /m n p b t d k ɡ s h/ jsou v obou jazycích; ニャ [ɲa] dává vietnamské nh [ɲ] (nhà), ン před k/g ([ŋ]) dává ng.
- Samohlásky: japonské a, i, e, o jsou blízko vietnamským a, i, ê, ô; japonské u je nezaokrouhlené [ɯ] – dobrý krok k vietnamskému ư [ɨ] (vietnamské u je plně zaokrouhlené).
- Rytmus: ani jeden jazyk samohlásky neredukuje; každá jednotka se vyslovuje plně a rovnoměrně.
- Výška je důležitá v obou: japonština rozlišuje 箸/橋 melodickým přízvukem, takže japonští mluvčí jsou zvyklí vnímat výšku.
- Ráz: っ před pauzou i začátek vietnamských slabik začínajících samohláskou (ăn [ʔan]) obsahují uzávěr hlasivek.
- Neznělé ražené: japonské /t k/ jsou jen slabě přídechové, blízko vietnamským t, c.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v japonštině
- Lexikální tóny: šest konturových tónů s odlišnou kvalitou hlasu (skřípavé ngã, glotalizované nặng). Japonský melodický přízvuk je jiný systém: určuje, po které moře ve slově výška klesá, nepokládá konturu na každou slabiku.
- Koncové souhlásky: -p, -t, -c/-ch, -m, -n, -ng/-nh, všechny nevypuštěné. Japonština má jen ン a っ; mluvčí snadno přidají samohlásku (táp → タプ). Po koncovce nechte ústa zavřená a tichá.
- Fonémový protiklad přídechového th [tʰ] a nepřídechového t [t].
- Implozivy b [ɓ], đ [ɗ]; frikativy /f v z x ɣ/ (japonské ふ je [ɸ], ne [f]).
- Jedenáct samohláskových kvalit včetně ơ [əː], â [ə], ă, ư [ɨ], e [ɛ]/ê [e], o [ɔ]/ô [o] a dvojhlásky ia, ưa, ua.
## B. V japonštině, ale ne ve vietnamštině
- Fonémová délka samohlásek (おばさん/おばあさん) a zdvojené souhlásky (きて/きって). Ve vietnamštině je délka vázaná na kvalitu (a/ă, ơ/â), nejde o samostatný protiklad.
- Móra jako časová jednotka, ン podle následující hlásky jako [m n ŋ ɴ], neznělé samohlásky (です [des]).
- /ts/ (つ), [ɕ] (し), [dʑ] (じ).
## C. Snadno zaměnitelné
- Řada ら [ɾ] platí pro l i r; vietnamské l je jasné [l], r je v Hanoji [z] a na jihu [ɹ]~[r].
- ư není ウ: rty roztažené, jazyk uprostřed.
- Koncové -n a -ng rozlišují slova (tan / tang); japonské ン tento rozdíl nedělá.
## D. Systém
Japonské slovo se skládá z mór s jedním přízvukovým vzorcem; ve vietnamštině je každý morfém slabikou s vlastním tónem. Slabiky na -p, -t, -c, -ch nesou jen sắc nebo nặng.
""",
    },
    "zh": {
        "title": "Tchajwanský hokkien, kantonština a vietnamština",
        "note": """
Tradiční znaky jsou písmo, ne výslovnost. Standardním jazykem Tchaj-wanu je mandarínština (國語); srovnáváme zde dva jiné čínské jazyky s velmi odlišnými zvukovými systémy: tchajwanský hokkien (臺灣台語/閩南語) a kantonštinu (粵語) z Hongkongu a Kuang-tungu.
""",
        "subsections": {
            "nan": {
                "title": "Tchajwanský hokkien a vietnamština",
                "common": """
Tchajwanský hokkien zachovává mnoho rysů starší čínštiny, které má i vietnamština, takže jeho mluvčí poznají velkou část vietnamské stavby slabiky.
- Ražené koncovky: slabiky „vstupního tónu“ mají -p, -t, -k a hlasivkové -h [ʔ] (十 tsa̍p, 日 ji̍t, 學 ha̍k), odpovídající vietnamskému -p, -t, -c.
- Nosové koncovky -m, -n, -ng jsou všechny přítomny (心 sim ↔ tâm, 山 san, 東 tang).
- Přídech: p/ph, t/th, k/kh odpovídají vietnamskému t/th; vietnamské c [k] je hokkienské k.
- Znělé b a g (bah, gû) pomáhají se znělými vietnamskými počátečními souhláskami.
- Tóny: mnoho lexikálních tónů a krátké tóny u slabik s raženou koncovkou – jako ve vietnamštině, kde slabiky na -p, -t, -c, -ch nesou jen sắc nebo nặng.
- ng na začátku (雅 ngá) je známé, jako ve vietnamském ngà.
""",
                "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v hokkienu
- Glotalizované tóny ngã a nặng a dyšné nízké huyền.
- Implozivy b [ɓ], đ [ɗ]; frikativy ph [f], v, d/gi [z], kh [x], g [ɣ].
- Samohlásky ư [ɨ], ơ/â [ə], e [ɛ] a protiklad ô [o]/o [ɔ]; dvojhlásky ưa, ươ.
- Palatály ch [c] a nh [ɲ].
## B. V hokkienu, ale ne ve vietnamštině
- Nosové samohlásky (三 sann [sã], 天 thinn): vietnamština je nemá, an končí skutečným [n].
- Rozsáhlý tónový sandhi: téměř každá nekoncová slabika fráze mění tón; vietnamština tón každé slabiky zachovává.
- Slabičné m a ng (毋 m̄, 黃 n̂g) a hlasivková koncovka -h.
- Afrikáty ts, tsh, j [dz].
## C. Snadno zaměnitelné
- Koncové -c po a, ă je [k̚]; po o, ô, u se zavírají i rty (học [hawk͡p]).
- t je nepřídechové, th přídechové – jako v hokkienu –, ale jiná písmena se od Pe̍h-ōe-jī liší (vietnamské ph = [f], ne [pʰ]).
- Návyky sandhi nepřenášejte na vietnamská složená slova.
## D. Systém
Oba jsou tónové jazyky se slabikami s raženou koncovkou, ale vietnamské tóny jsou pevně dané pro každou slabiku a zahrnují kromě výšky i kvalitu hlasu (skřípání, ráz).
""",
            },
            "yue": {
                "title": "Kantonština a vietnamština",
                "common": """
Kantonština je patrně čínský jazyk se stavbou slabiky nejbližší vietnamštině.
- Koncovky: přesně vietnamská řada -p, -t, -k, -m, -n, -ng, všechny nevypuštěné (十 sap6, 日 jat6, 學 hok6).
- Tóny: šest rozlišujících tónů, slabiky s raženou koncovkou ve „vstupním tónu“ – vzorec sắc/nặng na -p, -t, -c, -ch.
- Délka samohlásek: aa [aː] / a [ɐ] (三 saam / 心 sam) připomíná vietnamské a [aː] / ă [a] a ơ [əː] / â [ə].
- Přídech: b/p, d/t, g/k (jyutping) odpovídají vietnamskému t/th.
- Počáteční ng [ŋ] (我 ngo5) existuje jako ve vietnamském ngà.
- Sino-vietnamské shody jsou často průhledné: 國 gwok3 ↔ quốc, 心 sam1 ↔ tâm, 南 naam4 ↔ nam.
""",
                "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v kantonštině
- Glotalizované tóny ngã a nặng; dyšné huyền. Kantonské tóny se liší hlavně výškou a průběhem.
- Implozivy b [ɓ], đ [ɗ]; znělé frikativy v, d/gi [z], g [ɣ]; kh [x] (kantonské h je [h]).
- Palatály ch [c], nh [ɲ]; ư [ɨ]; protiklad e [ɛ]/ê [e].
- Centralizující dvojhlásky ia, ưa, ua.
## B. V kantonštině, ale ne ve vietnamštině
- Zaokrouhlené přední samohlásky yu [y], oe/eo [œ ɵ] (魚 jyu, 靴 hoe).
- Labializované gw, kw (國 gwok, 裙 kwan); v quốc patří [w] k mediále.
- Slabičné m a ng (唔 m4, 五 ng5); tři rovné tóny lišící se jen výškou.
## C. Snadno zaměnitelné
- Vietnamské d je [z] (Hanoj) nebo [j] (jih), nikdy [t]; đ je [ɗ].
- Vietnamské tóny nepřevádějte na kantonská čísla tónů: ngang je středně rovný, sắc vysoký stoupavý, huyền nízký klesavý a dyšný.
- -c, -ng po o, ô, u zavírají rty: học [hawk͡p], ông [ʔəwŋ͡m].
## D. Systém
Oba mají šest tónů a slabiky s raženou koncovkou, ale vietnamština rozlišuje tóny i kvalitou hlasu a nemá tónový sandhi.
""",
            },
        },
    },
    "zh_cn": {
        "title": "Standardní čínština (mandarínština) a vietnamština",
        "common": """
Standardní čínština (putonghua) a vietnamština jsou tónové jazyky s jednoslabičnými morfémy a staletí kontaktu daly vietnamštině rozsáhlou sino-vietnamskou slovní zásobu – mluvčí čínštiny mají skutečné výhody.
- Tóny: každá slabika má lexikální tón. 2. tón (35) se podobá sắc, klesavě-stoupavý 3. tón (214) připomíná hỏi.
- Přídech: d/t [t]/[tʰ] odpovídají vietnamskému t [t] / th [tʰ]; vietnamské c [k] je mandarínské g [k], kh je frikativa [x] mandarínského h.
- Stavba slabiky: (iniciála) + (mediála) + jádro + (finála) s jedním tónem nad celou slabikou – stejný rámec jako v mandarínštině.
- Společné nosové koncovky -n, -ng; ng [ŋ] v hang je vietnamské -ng.
- Sino-vietnamská slova odpovídají znakům systematicky: 學 xué ↔ học, 國 guó ↔ quốc, 心 xīn ↔ tâm.
- Retroflexy: sh [ʂ], r [ʐ] se podobají vietnamskému s a r v pečlivé nebo jižní výslovnosti.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v mandarínštině
- Šest tónů (Hanoj), dva glotalizované: ngã (stoupavý, přerušený rázem) a nặng (krátký, nízký, zakončený rázem). Mandarínština má čtyři tóny a neutrální tón, žádný glotalizovaný; 1. tón (55) je vyšší než středně rovné ngang (33).
- Ražené koncovky -p, -t, -c/-ch a -m: ve střední čínštině existovaly, v mandarínštině zanikly (十 thập, 心 tâm).
- Znělé souhlásky: implozivy b [ɓ], đ [ɗ], frikativy v, d/gi [z], g [ɣ].
- Samohlásky ơ/â [ə], ư [ɨ], protiklady e [ɛ]/ê [e] a o [ɔ]/ô [o]; dvojhlásky ia, ưa, ua.
## B. V mandarínštině, ale ne ve vietnamštině
- Zaokrouhlené ü [y] (绿, 女).
- Alveolopalatály j q x [tɕ tɕʰ ɕ], dentální afrikáty z c [ts tsʰ] a přídechové afrikáty obecně.
- Er-hua (儿化), neutrální tón, tónový sandhi (3. tón před 3. tónem).
## C. Snadno zaměnitelné
- Vietnamské ch [c] je palatální ražená, ne mandarínské ch [tʂʰ] ani q [tɕʰ]; tr je v Hanoji [c], na jihu [ʈ].
- Vietnamské x je [s] (mandarínské s); s je v Hanoji [s], na jihu [ʂ].
- th je přídechové [tʰ] (mandarínské t), ne [θ].
- nặng není 4. tón: začíná nízko a je utnut rázem.
## D. Systém
I podobně vypadající tóny mají jiný průběh: každý vietnamský tón se učte podle výšky, tvaru a kvality hlasu. Slabiky na -p, -t, -c, -ch nesou jen sắc nebo nặng, podobně jako starý „vstupní tón“.
""",
    },
    "cs": {
        "title": "Čeština a vietnamština",
        "common": """
Čeští mluvčí mají náskok u několika vietnamských souhlásek, se kterými má mnoho studentů potíže.
- Nepřídechové ražené: české p, t, k jsou nepřídechové, přesně jako vietnamské p, t, c/k.
- Palatály: ň [ɲ] = vietnamské nh (nhà); ť [c] je velmi blízko vietnamskému ch [c] (cha); užitečnou oporou je i ď [ɟ].
- Velární frikativa: české ch [x] = vietnamské kh (khá).
- Znělé frikativy v, z jsou v obou jazycích (vietnamské v a v Hanoji d/gi/r = [z]).
- Délka samohlásek: české a/á se liší délkou; vietnamské a [aː] / ă [a] a ơ [əː] / â [ə] také tvoří dlouhé a krátké páry, liší se však i kvalitou.
- Samohlásky i, e, a, o, u zhruba odpovídají vietnamským i, ê/e, a, ô/o, u.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v češtině
- Šest lexikálních tónů (Hanoj); česká výška je jen intonace, přízvuk je pevně na první slabice.
- /ŋ/ na začátku slabiky (ngà, nghe); české [ŋ] se vyskytuje jen před k/g (banka).
- Přídechové th [tʰ] v protikladu k t [t]; implozivy b [ɓ], đ [ɗ]; g [ɣ] (jiné než české h [ɦ]).
- Samohlásky ư [ɨ], ơ/â [ə] a protiklady e [ɛ]/ê [e], o [ɔ]/ô [o].
- Nevypuštěné koncovky -p, -t, -c a sevření rtů po o, ô, u.
## B. V češtině, ale ne ve vietnamštině
- Souhláskové skupiny (zmrzlina, čtvrt) a slabičné r, l (vlk).
- ř [r̝], š [ʃ], ž [ʒ], č [tʃ], c [ts]; znělé h [ɦ].
- Neznělost na konci slova a spodoba znělosti (led [let]).
## C. Snadno zaměnitelné
- Vietnamské x je [s], s je [s] (Hanoj) nebo [ʂ] (jih) – ne české š.
- Vietnamské h je neznělé [h], na rozdíl od českého h [ɦ].
- ư není české y: y = [ɪ], ư = [ɨ] (centrální, rty roztažené).
## D. Systém
Čeština klade přízvuk na první slabiku a využívá délku; vietnamština nemá pevný slovní přízvuk, každá slabika nese svůj tón. Slabiky na p, t, c, ch nesou jen sắc nebo nặng.
""",
    },
    "de": {
        "title": "Němčina a vietnamština",
        "common": """
Němčina sdílí s vietnamštinou několik souhláskových a rytmických rysů, které lze přímo využít.
- Rázový začátek: němčina vkládá ráz před samohlásku na začátku slova (ein [ʔaɪn]); vietnamské slabiky bez psané počáteční souhlásky začínají stejně (ăn [ʔan]).
- ch [x]: německý „ach-Laut“ je vietnamské kh (khá).
- Přídech: německé t [tʰ] je blízko vietnamskému th; počáteční d je ve velké části Německa neznělé a nepřídechové, blízko vietnamskému t.
- /ŋ/: německé ng (Ding) je vietnamské koncové ng; vietnamština ho klade i na začátek slabiky (ngà).
- Samohlásky: napjaté a nenapjaté i, e, a, o, u jsou opěrnými body pro vietnamské i, ê/e, a/ă, ô/o, u.
- Znělé frikativy v [v] (německé w) a z [z] (s ve slově Sonne) jsou v obou jazycích.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v němčině
- Šest lexikálních tónů (Hanoj) včetně glotalizovaných ngã a nặng; němčina užívá výšku jen pro intonaci a přízvuk.
- Implozivy b [ɓ], đ [ɗ]; palatály ch [c], nh [ɲ]; g [ɣ].
- ư [ɨ], ơ [əː], â [ə] jako plné, přízvučné samohlásky (německé šva jen v nepřízvučných slabikách).
- Nevypuštěné koncovky: němčina koncovky vypouští nebo desonorizuje; vietnamské -p, -t, -c jsou tiché závěry.
## B. V němčině, ale ne ve vietnamštině
- Zaokrouhlené přední samohlásky ü [y], ö [ø]; rozlišující délka (Staat/Stadt).
- Koncová neznělost (Rad [ʁaːt]) a souhláskové skupiny (Strumpf).
- Čípkové r [ʁ], sch [ʃ], z [ts], pf.
- Lexikální přízvuk a redukované nepřízvučné slabiky.
## C. Snadno zaměnitelné
- Vietnamské d není německé d: v Hanoji [z], na jihu [j]; đ je [ɗ].
- Vietnamské v je [v], ne německé v [f]; [f] se píše ph.
- s je [s]/[ʂ], x je [s] – ani jedno není sch.
- ơ není nepřízvučné německé e, ale plná, dlouhá centrální samohláska.
## D. Systém
Němčina má přízvukový rytmus, vietnamština slabičný a každá slabika si drží tón. Slabiky na -p, -t, -c, -ch nesou jen sắc nebo nặng.
""",
    },
    "en": {
        "title": "Angličtina a vietnamština",
        "common": """
Anglicky mluvící mohou stavět na mnoha společných hláskách, pokud oddělí písmo od zvuku.
- Souhlásky: /m n f v s z h l/ jsou v obou; ph = [f], v = [v], x = [s], v Hanoji d/gi/r = [z].
- /ŋ/: konec slova „sing“ je vietnamské ng; vietnamština jím také začíná slabiky (ngà).
- Přídech: t ve „top“ [tʰ] je vietnamské th; t po s („stop“) je nepřídechové jako vietnamské t.
- Dvojhlásky: „eye“, „cow“, „boy“ jsou blízko ai/ay, ao/au, oi.
- Ráz: ten ve „uh-oh“ začíná vietnamské slabiky na samohlásku a končí tón nặng.
- Nevypuštěné ražené: v hovorové řeči angličtí mluvčí často koncové ražené nevypouštějí („cat“); ve vietnamštině je to pravidlo.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v angličtině
- Šest lexikálních tónů (Hanoj). V angličtině výška značí otázky a důraz; ve vietnamštině mění slovo, takže stoupavá tázací intonace může z jednoho slova udělat jiné.
- Implozivy b [ɓ], đ [ɗ]; palatály ch [c], nh [ɲ]; kh [x], g [ɣ].
- Samohlásky ư [ɨ], ơ [əː], â [ə], ă; e [ɛ] / ê [e]; dvojhlásky ia, ưa, ua.
- Sevření rtů u koncovek po o, ô, u (ông, học).
## B. V angličtině, ale ne ve vietnamštině
- th [θ ð], sh [ʃ], zh [ʒ], ch [tʃ], j [dʒ]; r [ɹ].
- Souhláskové skupiny (strengths) a koncovky -s, -l, -r, -v; vietnamské slabiky končí jen na p, t, c/ch, m, n, ng/nh nebo polosamohlásku.
- Přízvuk a redukce na šva.
## C. Snadno zaměnitelné
- Vietnamské th je [tʰ], nikdy [θ].
- d je [z] (sever) nebo [j] (jih); đ je [ɗ] – žádné není anglické d.
- ch je [c] (hřbet jazyka na patře), ne anglické ch [tʃ].
- Koncové -t, -c jsou tiché závěry: v không phải není slyšet vypuštění ani přidaná samohláska.
## D. Systém
Angličtina má přízvukový rytmus a výšku užívá pro intonaci; vietnamština má slabičný rytmus a každé slabice dává pevný tón. Slabiky na p, t, c, ch nesou jen sắc nebo nặng.
""",
    },
    "fr": {
        "title": "Francouzština a vietnamština",
        "common": """
Francouzština a vietnamština sdílejí několik artikulačních zvyklostí. (Vietnamská abeceda vděčí mnohé evropským misionářům, ta historie však vysvětluje pravopis, ne výslovnost.)
- Nepřídechové ražené: francouzské p, t, k jsou nepřídechové jako vietnamské p, t, c.
- Znělé souhlásky: francouzské b, d, v, z; vietnamština má v [v] a d/gi/r [z] (Hanoj); francouzské b, d jsou přijatelným východiskem pro b [ɓ], đ [ɗ].
- gn [ɲ]: gn ve slově agneau je vietnamské nh (nhà).
- Samohlásky: i, é [e], è [ɛ], a, o [o], ò [ɔ], ou [u] odpovídají i, ê, e, a, ô, o, u – včetně protikladů e/ê a o/ô, obtížných pro mnoho studentů.
- Rytmus: francouzština má slabičný rytmus s plnými samohláskami, jako vietnamština.
- Čípkové r [ʁ] je užitečnou aproximací vietnamského g [ɣ] (gà).
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) ve francouzštině
- Šest lexikálních tónů (Hanoj); francouzská výška označuje jen konec frází a intonaci.
- Přídechové th [tʰ] v protikladu k t; kh [x]; palatální ch [c].
- /ŋ/ na začátku i konci slabiky (ngà, ông).
- Samohlásky ư [ɨ], ơ [əː], â [ə], ă.
- Nevypuštěné koncovky -p, -t, -c; francouzština koncové souhlásky vypouští (cap [kap]).
## B. Ve francouzštině, ale ne ve vietnamštině
- Nosové samohlásky (an [ɑ̃], on [ɔ̃], in [ɛ̃]); vietnamské an, ông jsou ústní samohláska plus skutečná nosová souhláska.
- Zaokrouhlené přední samohlásky u [y], eu [ø œ].
- ch [ʃ], j [ʒ]; liaison a enchaînement: vietnamština nepřipojuje koncovku k následující samohlásce.
## C. Snadno zaměnitelné
- Vietnamské an je [aːn], jazyk se dotýká dásní; nenazalizujte ho jako francouzské an.
- u je [u] (francouzské ou), ư je [ɨ], ne francouzské u [y].
- th je přídechové [tʰ]; th ve slově théâtre je prosté [t].
- r je [z] (Hanoj) nebo [ɹ~r] (jih), ne [ʁ].
## D. Systém
Francouzština zdůrazňuje poslední slabiku fráze; vietnamština dává každé slabice její tón. Slabiky na p, t, c, ch nesou jen sắc nebo nặng.
""",
    },
    "id": {
        "title": "Indonéština a vietnamština",
        "common": """
Indonéský pravopis je téměř fonetický jako vietnamský a oba jazyky sdílejí hlásky v evropských jazycích vzácné.
- ng [ŋ] na začátku slabiky (ngopi, ngantuk) = vietnamské ngà, nghe.
- ny [ɲ] = vietnamské nh (nhà).
- Nepřídechové ražené: indonéské p, t, k jsou nepřídechové jako vietnamské p, t, c.
- Nevypuštěné koncovky: koncové -p, -t (atap, lompat) často nevypouštějí a koncové -k je ráz – blízko vietnamským koncovkám.
- Šva: e pepet [ə] (besar) je blízko vietnamskému â [ə] a ơ [əː].
- Samohlásky a, i, u, e, o se překrývají s a, i, u, ê/e, ô/o; dvojhlásky ai, au, oi se podobají vietnamským ai, ao, oi.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v indonéštině
- Šest lexikálních tónů (Hanoj); indonéština tóny nemá, výška je intonace.
- Přídechové th [tʰ] v protikladu k t [t].
- Implozivy b [ɓ], đ [ɗ]; frikativy kh [x], g [ɣ], d/gi/r [z] (Hanoj), v.
- Samohlásky ư [ɨ], ă, protiklady e [ɛ]/ê [e] a o [ɔ]/ô [o]; dvojhlásky ia, ưa, ua.
- Palatální ch [c] a sevření rtů po o, ô, u (ông, học).
## B. V indonéštině, ale ne ve vietnamštině
- Koncovky -s, -l, -r, -h (bus, jual, pasar, rumah).
- c [tʃ], j [dʒ], sy [ʃ].
- Víceslabičná slova s (slabým) přízvukem na předposlední slabice a afixy.
## C. Snadno zaměnitelné
- Vietnamské c před a, o, u je [k] (cá), ne indonéské c [tʃ].
- ch je [c] (palatální ražená), ne [tʃ].
- x je [s]; s je [s] nebo [ʂ].
- Koncové -c je tichý velární závěr [k̚], ne ráz indonéského -k.
## D. Systém
Indonéská slova jsou víceslabičná a bez tónů; vietnamské morfémy jsou jednoslabičné, každý s tónem. Slabiky na p, t, c, ch nesou jen sắc nebo nặng.
""",
    },
    "hu": {
        "title": "Maďarština a vietnamština",
        "common": """
Maďarští mluvčí se mohou opřít o několik palatál a o cit pro délku samohlásek.
- ny [ɲ] = vietnamské nh (nhà); ty [c] je velmi blízko vietnamskému ch (cha).
- Nepřídechové ražené: maďarské p, t, k jsou nepřídechové jako vietnamské p, t, c.
- Délka samohlásek: maďarština rozlišuje krátké a dlouhé samohlásky; vietnamské páry a [aː] / ă [a] a ơ [əː] / â [ə] fungují podobně (s rozdílem kvality).
- Samohlásky i, é [eː], e [ɛ], o, u se překrývají s i, ê, e, ô/o, u; rozlišení e/é pomáhá u e/ê.
- Znělé frikativy v, z jsou v obou.
- Rytmus: maďarština vyslovuje nepřízvučné samohlásky plně, blízko slabičnému rytmu vietnamštiny.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v maďarštině
- Šest lexikálních tónů (Hanoj); maďarská výška je intonace, přízvuk je na první slabice.
- /ŋ/ na začátku slabiky (ngà); maďarské [ŋ] jen před k, g.
- Přídechové th [tʰ]; implozivy b [ɓ], đ [ɗ]; kh [x], g [ɣ].
- Samohlásky ư [ɨ], ơ/â [ə], ă.
- Nevypuštěné koncovky a sevření rtů po o, ô, u.
## B. V maďarštině, ale ne ve vietnamštině
- Zaokrouhlené přední samohlásky ö, ő, ü, ű a vokálová harmonie.
- Zdvojené souhlásky (tt, ll) a souhláskové skupiny.
- cs [tʃ], s [ʃ], zs [ʒ], c [ts], gy [ɟ].
## C. Snadno zaměnitelné
- Pravopisné pasti: vietnamské s je [s] (Hanoj) nebo [ʂ], ne maďarské s [ʃ]; vietnamské x je [s] (maďarské sz).
- Vietnamské a je [aː], ne maďarské a [ɒ].
- gi je [z] (Hanoj) nebo [j] (jih), ne maďarské gy.
## D. Systém
Maďarština označuje začátek slova přízvukem a využívá délkové protiklady; vietnamština dává tón každé slabice. Slabiky na p, t, c, ch nesou jen sắc nebo nặng.
""",
    },
    "pl": {
        "title": "Polština a vietnamština",
        "common": """
Polština nabízí nečekaně dobré shody pro některé vietnamské hlásky, se kterými mají jiní Evropané potíže.
- y [ɨ]: polské y (my, ryba) je velmi blízko vietnamskému ư [ɨ] (như, từ).
- Retroflexní řada: sz [ʂ] a ż/rz [ʐ] se podobají vietnamskému s a r v pečlivé nebo jižní výslovnosti.
- ń [ɲ] = vietnamské nh; ch/h [x] = kh.
- Nepřídechové ražené: polské p, t, k jsou nepřídechové jako vietnamské p, t, c.
- Znělé frikativy w [v], z [z] = vietnamské v, d/gi/r (Hanoj [z]).
- Samohlásky a, e [ɛ], i, o [ɔ], u odpovídají vietnamským a, e, i, o, u.
""",
        "diff": """
## A. Ve vietnamštině, ale ne (nebo jinak) v polštině
- Šest lexikálních tónů (Hanoj); polština klade přízvuk na předposlední slabiku, výška je intonace.
- /ŋ/ na začátku slabiky (ngà); polské [ŋ] jen před k, g.
- Přídechové th [tʰ]; implozivy b [ɓ], đ [ɗ]; g [ɣ]; palatální ražená ch [c].
- Samohlásky ơ [əː], â [ə], ă a zavřené ê [e], ô [o] v protikladu k e [ɛ], o [ɔ].
- Nevypuštěné koncovky a sevření rtů po o, ô, u.
## B. V polštině, ale ne ve vietnamštině
- Nosové samohlásky ą, ę; souhláskové skupiny (chrząszcz, wzgórze).
- Alveolopalatály ś ź ć dź [ɕ ʑ tɕ dʑ] a afrikáty c, cz, dz, dż.
- Koncová neznělost (chleb [xlɛp]) a spodoba znělosti.
## C. Snadno zaměnitelné
- Vietnamské ch [c] je ražená, ne ć [tɕ] ani cz [tʂ].
- x = [s]; s = [s] (Hanoj) nebo [ʂ] (jako sz, jih).
- Vietnamské e je otevřené [ɛ] jako polské e; ê je zavřené [e], které polština jako samostatnou samohlásku nemá.
## D. Systém
Polská slova mají pevný přízvuk a mnoho souhláskových skupin; vietnamské slabiky jsou jednoduché a každá nese tón. Slabiky na p, t, c, ch nesou jen sắc nebo nặng.
""",
    },
}
