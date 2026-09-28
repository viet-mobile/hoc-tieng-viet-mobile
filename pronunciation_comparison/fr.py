# -*- coding: utf-8 -*-
"""[발음] > [차이] -- Français. Format : voir pronunciation_comparison/__init__.py."""

UI = {
    "intro": "La prononciation vietnamienne (prononciation standard de Hanoï, sauf mention contraire) comparée à chaque langue, du point de vue de ses locuteurs. L'écriture et le son sont distingués : une même lettre dans deux alphabets ne correspond pas forcément au même phonème. L'API entre / / note les phonèmes, entre [ ] la prononciation réelle.",
    "common": "Points communs",
    "diff": "Différences",
}

SECTIONS = {
    "ko": {
        "title": "Le coréen et le vietnamien",
        "common": """
Les deux langues découpent nettement les syllabes et terminent les syllabes par des consonnes non relâchées : le coréen 밥 [pap̚] et le vietnamien đáp [ɗaːp̚] se ferment de la même façon, lèvres closes, sans souffle. Les coréanophones maîtrisent donc déjà ce qui est le plus difficile dans les finales vietnamiennes.
- Finales : les sept sons de fin de syllabe du coréen [p̚ t̚ k̚ m n ŋ l] comprennent six finales vietnamiennes /p t k m n ŋ/ (écrites p, t, c/ch, m, n, ng/nh).
- /ŋ/ : le ㅇ final (강) est le ng final vietnamien ; le vietnamien l'emploie aussi en début de syllabe (ngà).
- Aspiration : ㅌ /tʰ/ est proche du th /tʰ/ vietnamien ; le t /t/ vietnamien, non aspiré, est plus proche du ㄸ tendu que du ㄷ.
- Voyelles : ㅣ[i], ㅔ[e], ㅏ[a], ㅜ[u], ㅗ[o] correspondent à peu près à i, ê, a, u, ô ; ㅡ [ɯ] est un bon point de départ pour ư [ɨ].
- Semi-voyelle + voyelle : 와 [wa], 워 [wʌ] ressemblent aux oa [wa], uơ vietnamiens.
- Rythme : les deux langues sont syllabiques ; chaque syllabe garde une voyelle pleine, sans la réduction vocalique de l'anglais.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en coréen
- Tons lexicaux : six tons à Hanoï ; la courbe mélodique et la qualité de voix de chaque syllabe changent le mot (ma, mà, má, mả, mã, mạ). Le coréen standard de Séoul n'a pas de ton lexical ; la hauteur ne sert qu'à l'intonation.
- Implosives b [ɓ], đ [ɗ] : voisées, avec un léger flux d'air vers l'intérieur. Le coréen n'a pas de phonèmes occlusifs voisés (ㅂ, ㄷ ne sont voisés qu'entre voyelles).
- Les fricatives /f/ (ph), /v/, /z/ (d, gi, r à Hanoï), /x/ (kh), /ɣ/ (g, gh) ne sont pas des phonèmes coréens.
- Les voyelles ơ [əː], â [ə] bref, ă bref, et l'opposition e [ɛ] / ê [e] (ㅐ/ㅔ se sont confondus chez la plupart des locuteurs).
- Finales palatales -nh, -ch après i, ê, a, et fermeture des lèvres à la fin de ông [ʔəwŋ͡m], học [hawk͡p].
## B. En coréen mais pas en vietnamien
- L'opposition à trois termes douce/tendue/aspirée (ㄱ/ㄲ/ㅋ, ㅈ/ㅉ/ㅊ) ; le vietnamien n'a que des oppositions à deux termes comme t/th.
- Le /l/ final (말) et l'alternance [ɾ]~[l] de ㄹ ; aucune syllabe vietnamienne ne se termine par l.
- Les changements phonétiques entre syllabes (nasalisation 국물 → [궁물], enchaînement) ; en vietnamien, chaque syllabe garde sa finale.
## C. Faciles à confondre
- Le t vietnamien n'est pas ㄷ : sans aspiration, comme ㄸ mais moins tendu. th ressemble à ㅌ et n'est jamais le « th » anglais.
- ư [ɨ] est plus central que ㅡ ; ơ [əː] est plus central et plus long que ㅓ [ʌ].
- Le -c final après o, ô, u se termine lèvres fermées (học ≈ [hawk͡p]) ; ce n'est pas 학.
## D. Système
Les coréanophones utilisent volontiers une intonation de groupe ; en vietnamien, la hauteur appartient à chaque syllabe et doit être conservée même en parlant vite. Les syllabes finissant par p, t, c, ch ne portent que le ton sắc ou nặng.
""",
    },
    "ja": {
        "title": "Le japonais et le vietnamien",
        "common": """
Le japonais et le vietnamien partagent un rythme régulier et net et beaucoup de consonnes simples ; les japonophones abordent donc assez facilement les attaques vietnamiennes.
- Consonnes : /m n p b t d k ɡ s h/ existent dans les deux langues ; ニャ [ɲa] donne le nh [ɲ] vietnamien (nhà), ン devant k/g ([ŋ]) donne ng.
- Voyelles : a, i, e, o japonais sont proches de a, i, ê, ô ; le u japonais est non arrondi [ɯ], une bonne étape vers le ư [ɨ] vietnamien (le u vietnamien, lui, est bien arrondi).
- Rythme : aucune des deux langues ne réduit les voyelles ; chaque unité est prononcée pleinement et régulièrement.
- La hauteur compte dans les deux : le japonais distingue 箸/橋 par l'accent de hauteur, les japonophones sont donc déjà attentifs à la hauteur.
- Coup de glotte : っ devant une pause et le début des syllabes vietnamiennes commençant par une voyelle (ăn [ʔan]) comportent une fermeture glottale.
- Occlusives sourdes : /t k/ japonais ne sont que faiblement aspirés, proches de t, c vietnamiens.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en japonais
- Tons lexicaux : six tons mélodiques avec des qualités de voix différentes (ngã craqué, nặng glottalisé). L'accent de hauteur japonais est un autre système : il indique après quelle more la hauteur chute dans le mot ; il ne place pas une courbe sur chaque syllabe.
- Consonnes finales : -p, -t, -c/-ch, -m, -n, -ng/-nh, toutes non relâchées. Le japonais n'a que ン et っ ; ses locuteurs ajoutent volontiers une voyelle (táp → タプ). Après la finale, garder la bouche fermée et silencieuse.
- L'opposition phonémique th [tʰ] aspiré / t [t] non aspiré.
- Implosives b [ɓ], đ [ɗ] ; fricatives /f v z x ɣ/ (le ふ japonais est [ɸ], pas [f]).
- Onze qualités vocaliques, dont ơ [əː], â [ə], ă, ư [ɨ], e [ɛ]/ê [e], o [ɔ]/ô [o], plus les diphtongues ia, ưa, ua.
## B. En japonais mais pas en vietnamien
- La longueur vocalique phonémique (おばさん/おばあさん) et les géminées (きて/きって). En vietnamien, la durée est liée à la qualité vocalique (a/ă, ơ/â), ce n'est pas une opposition distincte.
- La more comme unité de temps, ン réalisé [m n ŋ ɴ] selon le son suivant, les voyelles dévoisées (です [des]).
- /ts/ (つ), [ɕ] (し), [dʑ] (じ).
## C. Faciles à confondre
- La série ら [ɾ] vaut pour l et r ; en vietnamien l est un [l] net, r est [z] à Hanoï et [ɹ]~[r] au Sud.
- ư n'est pas ウ : lèvres étirées, langue au centre.
- Les finales -n et -ng distinguent des mots (tan / tang) ; le ン japonais ne fait pas cette distinction.
## D. Système
Le mot japonais se compose de mores avec un schéma accentuel ; en vietnamien, chaque morphème est une syllabe portant son propre ton. Les syllabes en -p, -t, -c, -ch ne portent que sắc ou nặng.
""",
    },
    "zh": {
        "title": "Le hokkien taïwanais, le cantonais et le vietnamien",
        "note": """
Les caractères traditionnels sont un système d'écriture, pas une prononciation. La langue standard de Taïwan est le mandarin (國語) ; on compare ici deux autres langues chinoises aux systèmes phonologiques très différents du mandarin : le hokkien taïwanais (臺灣台語/閩南語) et le cantonais (粵語) de Hong Kong et du Guangdong.
""",
        "subsections": {
            "nan": {
                "title": "Le hokkien taïwanais et le vietnamien",
                "common": """
Le hokkien taïwanais conserve de nombreux traits du chinois ancien que le vietnamien possède aussi ; ses locuteurs reconnaissent donc une bonne part de la structure syllabique vietnamienne.
- Finales occlusives : -p, -t, -k et un -h glottal [ʔ] dans les syllabes du « ton rentrant » (十 tsa̍p, 日 ji̍t, 學 ha̍k), correspondant aux -p, -t, -c vietnamiens.
- Les finales nasales -m, -n, -ng existent toutes (心 sim ↔ tâm, 山 san, 東 tang).
- Aspiration : p/ph, t/th, k/kh correspondent au t/th vietnamien ; le c [k] vietnamien est le k hokkien.
- Les voisées b et g (bah, gû) aident pour les attaques voisées vietnamiennes.
- Tons : de nombreux tons lexicaux et des tons brefs sur les syllabes à finale occlusive — comme en vietnamien, où les syllabes en -p, -t, -c, -ch ne portent que sắc ou nặng.
- ng à l'initiale (雅 ngá) est familier, comme dans le vietnamien ngà.
""",
                "diff": """
## A. En vietnamien mais pas (ou autrement) en hokkien
- Les tons glottalisés ngã et nặng, et le huyền grave soufflé.
- Implosives b [ɓ], đ [ɗ] ; fricatives ph [f], v, d/gi [z], kh [x], g [ɣ].
- Voyelles ư [ɨ], ơ/â [ə], e [ɛ] et l'opposition ô [o]/o [ɔ] ; diphtongues ưa, ươ.
- Palatales ch [c] et nh [ɲ].
## B. En hokkien mais pas en vietnamien
- Les voyelles nasalisées (三 sann [sã], 天 thinn) : le vietnamien n'en a pas, an se termine par un vrai [n].
- Un sandhi tonal très étendu : presque toute syllabe non finale d'un groupe change de ton ; le vietnamien garde le ton de chaque syllabe.
- m et ng syllabiques (毋 m̄, 黃 n̂g) et la finale glottale -h.
- Affriquées ts, tsh, j [dz].
## C. Faciles à confondre
- Le -c final après a, ă est [k̚] ; après o, ô, u les lèvres se ferment aussi (học [hawk͡p]).
- t non aspiré et th aspiré, comme en hokkien, mais d'autres lettres diffèrent du Pe̍h-ōe-jī (le ph vietnamien = [f], pas [pʰ]).
- Ne pas appliquer les habitudes de sandhi aux mots composés vietnamiens.
## D. Système
Les deux sont des langues à tons avec syllabes à finale occlusive, mais les tons vietnamiens sont fixes par syllabe et incluent la qualité de voix (craquement, coup de glotte), pas seulement la hauteur.
""",
            },
            "yue": {
                "title": "Le cantonais et le vietnamien",
                "common": """
Le cantonais est sans doute la langue chinoise dont la structure syllabique est la plus proche du vietnamien.
- Finales : exactement la série vietnamienne -p, -t, -k, -m, -n, -ng, toutes non relâchées (十 sap6, 日 jat6, 學 hok6).
- Tons : six tons distinctifs, avec des syllabes « rentrantes » sur les finales occlusives — le schéma de sắc/nặng sur -p, -t, -c, -ch.
- Longueur vocalique : aa [aː] / a [ɐ] (三 saam / 心 sam) ressemble au vietnamien a [aː] / ă [a] et ơ [əː] / â [ə].
- Aspiration : les oppositions b/p, d/t, g/k (jyutping) correspondent au t/th vietnamien.
- ng [ŋ] initial (我 ngo5) existe, comme dans ngà.
- Les correspondances sino-vietnamiennes sont souvent transparentes : 國 gwok3 ↔ quốc, 心 sam1 ↔ tâm, 南 naam4 ↔ nam.
""",
                "diff": """
## A. En vietnamien mais pas (ou autrement) en cantonais
- Les tons glottalisés ngã et nặng ; huyền soufflé. Les tons cantonais se distinguent surtout par la hauteur et le contour.
- Implosives b [ɓ], đ [ɗ] ; fricatives voisées v, d/gi [z], g [ɣ] ; kh [x] (le h cantonais est [h]).
- Palatales ch [c], nh [ɲ] ; ư [ɨ] ; l'opposition e [ɛ]/ê [e].
- Diphtongues centralisantes ia, ưa, ua.
## B. En cantonais mais pas en vietnamien
- Voyelles antérieures arrondies yu [y], oe/eo [œ ɵ] (魚 jyu, 靴 hoe).
- gw, kw labialisés (國 gwok, 裙 kwan) ; dans quốc, [w] appartient à la médiane.
- m et ng syllabiques (唔 m4, 五 ng5) ; trois tons plats distingués seulement par la hauteur.
## C. Faciles à confondre
- Le d vietnamien est [z] (Hanoï) ou [j] (Sud), jamais [t] ; đ est [ɗ].
- Ne pas traduire les tons vietnamiens en numéros de tons cantonais : ngang est moyen et plat, sắc haut montant, huyền bas descendant et soufflé.
- -c, -ng après o, ô, u ferment les lèvres : học [hawk͡p], ông [ʔəwŋ͡m].
## D. Système
Les deux ont six tons et des syllabes à finale occlusive, mais le vietnamien distingue aussi les tons par la qualité de voix et n'a pas de sandhi tonal.
""",
            },
        },
    },
    "zh_cn": {
        "title": "Le mandarin standard et le vietnamien",
        "common": """
Le mandarin standard (putonghua) et le vietnamien sont des langues à tons aux morphèmes monosyllabiques, et des siècles de contact ont donné au vietnamien un vaste vocabulaire sino-vietnamien : les sinophones ont de vrais atouts.
- Tons : chaque syllabe a un ton lexical. Le 2e ton (35) ressemble à sắc, le 3e ton descendant-montant (214) rappelle hỏi.
- Aspiration : d/t [t]/[tʰ] du mandarin correspondent à t [t] / th [tʰ] ; le c [k] vietnamien est le g [k] du mandarin, et kh est la fricative [x] du h mandarin.
- Structure syllabique : (initiale) + (médiane) + noyau + (finale), avec un ton sur toute la syllabe — le même cadre qu'en mandarin.
- Finales nasales -n, -ng communes ; le ng [ŋ] de hang est le -ng vietnamien.
- Les mots sino-vietnamiens correspondent systématiquement aux caractères : 學 xué ↔ học, 國 guó ↔ quốc, 心 xīn ↔ tâm.
- Rétroflexes : sh [ʂ], r [ʐ] du mandarin ressemblent aux s et r vietnamiens en prononciation soignée ou méridionale.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en mandarin
- Six tons (Hanoï), dont deux glottalisés : ngã (montant, interrompu par une occlusion glottale) et nặng (bref, bas, finissant par un coup de glotte). Le mandarin a quatre tons et un ton neutre, aucun glottalisé ; le 1er ton (55) est plus haut que le ngang moyen (33).
- Finales occlusives -p, -t, -c/-ch et -m : présentes en chinois moyen, disparues en mandarin (十 thập, 心 tâm).
- Consonnes voisées : implosives b [ɓ], đ [ɗ], fricatives v, d/gi [z], g [ɣ].
- Voyelles ơ/â [ə], ư [ɨ], oppositions e [ɛ]/ê [e] et o [ɔ]/ô [o] ; diphtongues ia, ưa, ua.
## B. En mandarin mais pas en vietnamien
- Le ü arrondi [y] (绿, 女).
- Alvéolo-palatales j q x [tɕ tɕʰ ɕ], affriquées dentales z c [ts tsʰ] et affriquées aspirées en général.
- Le suffixe -r (儿化), le ton neutre, le sandhi (3e ton devant 3e ton).
## C. Faciles à confondre
- Le ch vietnamien [c] est une occlusive palatale, pas ch [tʂʰ] ni q [tɕʰ] ; tr vaut [c] à Hanoï, [ʈ] au Sud.
- Le x vietnamien est [s] (le s mandarin) ; s vaut [s] à Hanoï et [ʂ] au Sud.
- th est un [tʰ] aspiré (le t mandarin), pas [θ].
- nặng n'est pas le 4e ton : il commence bas et s'interrompt par un coup de glotte.
## D. Système
Même des tons qui se ressemblent ont des contours différents : apprendre chaque ton vietnamien par sa hauteur, sa forme et sa qualité de voix. Les syllabes en -p, -t, -c, -ch ne portent que sắc ou nặng, comme l'ancien « ton rentrant ».
""",
    },
    "cs": {
        "title": "Le tchèque et le vietnamien",
        "common": """
Les tchécophones partent avec une longueur d'avance sur plusieurs consonnes vietnamiennes difficiles pour beaucoup d'apprenants.
- Occlusives non aspirées : p, t, k tchèques sont non aspirés, exactement comme p, t, c/k vietnamiens.
- Palatales : ň [ɲ] = nh (nhà) ; ť [c] est très proche du ch [c] vietnamien (cha) ; ď [ɟ] est aussi un repère utile.
- Fricative vélaire : le ch tchèque [x] = kh vietnamien (khá).
- Les fricatives voisées v, z existent dans les deux (v, et d/gi/r = [z] à Hanoï).
- Longueur vocalique : a/á tchèques s'opposent par la durée ; a [aː] / ă [a] et ơ [əː] / â [ə] vietnamiens forment aussi des paires longues/brèves, mais avec une différence de timbre.
- i, e, a, o, u correspondent à peu près à i, ê/e, a, ô/o, u.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en tchèque
- Six tons lexicaux (Hanoï) ; la hauteur tchèque n'est qu'intonation, l'accent est fixé sur la première syllabe.
- /ŋ/ à l'initiale (ngà, nghe) ; le [ŋ] tchèque n'apparaît que devant k/g (banka).
- th [tʰ] aspiré opposé à t [t] ; implosives b [ɓ], đ [ɗ] ; g [ɣ] (différent du h tchèque [ɦ]).
- Voyelles ư [ɨ], ơ/â [ə], oppositions e [ɛ]/ê [e], o [ɔ]/ô [o].
- Finales -p, -t, -c non relâchées et fermeture des lèvres après o, ô, u.
## B. En tchèque mais pas en vietnamien
- Groupes consonantiques (zmrzlina, čtvrt) et r, l syllabiques (vlk).
- ř [r̝], š [ʃ], ž [ʒ], č [tʃ], c [ts] ; h voisé [ɦ].
- Dévoisement final et assimilation de voisement (led [let]).
## C. Faciles à confondre
- Le x vietnamien est [s], s vaut [s] (Hanoï) ou [ʂ] (Sud) — pas le š tchèque.
- Le h vietnamien est sourd [h], contrairement au h tchèque [ɦ].
- ư n'est pas le y tchèque : y = [ɪ], ư = [ɨ] (central, lèvres étirées).
## D. Système
Le tchèque accentue la première syllabe et utilise la durée ; le vietnamien n'a pas d'accent de mot fixe, chaque syllabe porte son ton. Les syllabes en p, t, c, ch ne portent que sắc ou nặng.
""",
    },
    "de": {
        "title": "L'allemand et le vietnamien",
        "common": """
L'allemand partage avec le vietnamien plusieurs traits consonantiques et rythmiques directement utilisables.
- Attaque glottale : l'allemand place un coup de glotte devant une voyelle initiale (ein [ʔaɪn]) ; les syllabes vietnamiennes sans consonne écrite commencent de même (ăn [ʔan]).
- ch [x] : le « ach-Laut » allemand est le kh vietnamien (khá).
- Aspiration : le t allemand [tʰ] est proche du th vietnamien ; le d initial, sourd et non aspiré dans une grande partie de l'Allemagne, est proche du t vietnamien.
- /ŋ/ : le ng allemand (Ding) est le ng final ; le vietnamien l'utilise aussi à l'initiale (ngà).
- Voyelles : i, e, a, o, u tendus et relâchés servent de repères pour i, ê/e, a/ă, ô/o, u.
- Les fricatives voisées v [v] (w allemand) et z [z] (s de Sonne) existent dans les deux langues.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en allemand
- Six tons lexicaux (Hanoï), dont ngã et nặng glottalisés ; l'allemand n'utilise la hauteur que pour l'intonation et l'accent.
- Implosives b [ɓ], đ [ɗ] ; palatales ch [c], nh [ɲ] ; g [ɣ].
- ư [ɨ], ơ [əː], â [ə] comme voyelles pleines et accentuables (le schwa allemand n'apparaît qu'en syllabe inaccentuée).
- Finales non relâchées : l'allemand relâche ou assourdit les finales ; -p, -t, -c vietnamiens sont des fermetures silencieuses.
## B. En allemand mais pas en vietnamien
- Voyelles antérieures arrondies ü [y], ö [ø] ; longueur vocalique distinctive (Staat/Stadt).
- Dévoisement final (Rad [ʁaːt]) et groupes consonantiques (Strumpf).
- r uvulaire [ʁ], sch [ʃ], z [ts], pf.
- Accent de mot lexical et syllabes inaccentuées réduites.
## C. Faciles à confondre
- Le d vietnamien n'est pas le d allemand : [z] à Hanoï, [j] au Sud ; đ est [ɗ].
- Le v vietnamien est [v], pas le v allemand [f] ; [f] s'écrit ph.
- s vietnamien = [s]/[ʂ], x = [s] ; aucun n'est sch.
- ơ n'est pas le e inaccentué allemand, mais une voyelle centrale pleine et longue.
## D. Système
L'allemand a un rythme accentuel ; le vietnamien est syllabique et chaque syllabe garde son ton. Les syllabes en -p, -t, -c, -ch ne portent que sắc ou nặng.
""",
    },
    "en": {
        "title": "L'anglais et le vietnamien",
        "common": """
Les anglophones peuvent s'appuyer sur de nombreux sons communs, à condition de séparer l'écriture du son.
- Consonnes : /m n f v s z h l/ existent dans les deux ; ph = [f], v = [v], x = [s], à Hanoï d/gi/r = [z].
- /ŋ/ : la fin de « sing » est le ng vietnamien ; le vietnamien s'en sert aussi à l'initiale (ngà).
- Aspiration : le t de « top » [tʰ] est le th vietnamien ; le t après s (« stop ») est non aspiré, comme le t vietnamien.
- Diphtongues : « eye », « cow », « boy » sont proches de ai/ay, ao/au, oi.
- Coup de glotte : celui de « uh-oh » ouvre les syllabes vietnamiennes à initiale vocalique et termine le ton nặng.
- Occlusives non relâchées : en parole familière, les anglophones ne relâchent souvent pas les occlusives finales (« cat ») ; en vietnamien, c'est la règle.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en anglais
- Six tons lexicaux (Hanoï). En anglais, la hauteur marque questions et emphase ; en vietnamien, elle change le mot : une intonation montante de question peut transformer un mot en un autre.
- Implosives b [ɓ], đ [ɗ] ; palatales ch [c], nh [ɲ] ; kh [x], g [ɣ].
- Voyelles ư [ɨ], ơ [əː], â [ə], ă ; e [ɛ] / ê [e] ; diphtongues ia, ưa, ua.
- Fermeture des lèvres sur les finales après o, ô, u (ông, học).
## B. En anglais mais pas en vietnamien
- th [θ ð], sh [ʃ], zh [ʒ], ch [tʃ], j [dʒ] ; r [ɹ].
- Groupes consonantiques (strengths) et finales -s, -l, -r, -v ; les syllabes vietnamiennes ne finissent que par p, t, c/ch, m, n, ng/nh ou une semi-voyelle.
- Accent et réduction vocalique en schwa.
## C. Faciles à confondre
- Le th vietnamien est [tʰ], jamais [θ].
- d vaut [z] (Nord) ou [j] (Sud) ; đ est [ɗ] — aucun n'est le d anglais.
- ch est [c] (dos de la langue contre le palais), pas le ch anglais [tʃ].
- -t, -c finaux sont des fermetures silencieuses : dans không phải, ni relâchement audible ni voyelle ajoutée.
## D. Système
L'anglais a un rythme accentuel et utilise la hauteur pour l'intonation ; le vietnamien est syllabique et fixe un ton par syllabe. Les syllabes en p, t, c, ch ne portent que sắc ou nặng.
""",
    },
    "fr": {
        "title": "Le français et le vietnamien",
        "common": """
Le français et le vietnamien partagent plusieurs habitudes articulatoires. (L'alphabet vietnamien doit beaucoup aux missionnaires européens, mais cette histoire explique l'orthographe, pas la prononciation.)
- Occlusives non aspirées : p, t, k français sont non aspirés, comme p, t, c vietnamiens.
- Consonnes voisées : b, d, v, z français ; le vietnamien a v [v] et d/gi/r [z] (Hanoï) ; b, d français sont un point de départ acceptable pour b [ɓ], đ [ɗ].
- gn [ɲ] : le gn d'agneau est le nh vietnamien (nhà).
- Voyelles : i, é [e], è [ɛ], a, o [o], ò [ɔ], ou [u] correspondent à i, ê, e, a, ô, o, u — y compris les oppositions e/ê et o/ô, difficiles pour beaucoup d'apprenants.
- Rythme : le français est syllabique, avec des voyelles pleines, comme le vietnamien.
- Le r uvulaire [ʁ] est une approximation utile du g vietnamien [ɣ] (gà).
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en français
- Six tons lexicaux (Hanoï) ; la hauteur française ne marque que la fin des groupes et l'intonation.
- th [tʰ] aspiré opposé à t ; kh [x] ; ch palatal [c].
- /ŋ/ au début et à la fin des syllabes (ngà, ông).
- Voyelles ư [ɨ], ơ [əː], â [ə], ă.
- Finales -p, -t, -c non relâchées ; le français relâche les consonnes finales (cap [kap]).
## B. En français mais pas en vietnamien
- Voyelles nasales (an [ɑ̃], on [ɔ̃], in [ɛ̃]) ; an, ông vietnamiens sont une voyelle orale suivie d'une vraie consonne nasale.
- Voyelles antérieures arrondies u [y], eu [ø œ].
- ch [ʃ], j [ʒ] ; liaison et enchaînement : le vietnamien ne lie jamais une finale à la voyelle suivante.
## C. Faciles à confondre
- an vietnamien se prononce [aːn], la langue touchant les alvéoles ; ne pas le nasaliser comme an français.
- u vietnamien est [u] (ou français), ư est [ɨ], pas le u français [y].
- th vietnamien est aspiré [tʰ] ; th de théâtre est un simple [t].
- r vietnamien est [z] (Hanoï) ou [ɹ~r] (Sud), pas [ʁ].
## D. Système
Le français met en relief la dernière syllabe du groupe ; le vietnamien donne à chaque syllabe son propre ton. Les syllabes en p, t, c, ch ne portent que sắc ou nặng.
""",
    },
    "id": {
        "title": "L'indonésien et le vietnamien",
        "common": """
L'orthographe indonésienne est presque phonémique, comme celle du vietnamien, et les deux langues partagent plusieurs sons rares dans les langues européennes.
- ng [ŋ] à l'initiale (ngopi, ngantuk) = ngà, nghe.
- ny [ɲ] = nh (nhà).
- Occlusives non aspirées : p, t, k indonésiens sont non aspirés, comme p, t, c vietnamiens.
- Finales non relâchées : -p, -t finaux (atap, lompat) sont souvent non relâchés, et -k final est un coup de glotte — proches des finales vietnamiennes.
- Schwa : le e pepet [ə] (besar) est proche de â [ə] et ơ [əː].
- Les voyelles a, i, u, e, o recoupent a, i, u, ê/e, ô/o ; les diphtongues ai, au, oi ressemblent à ai, ao, oi.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en indonésien
- Six tons lexicaux (Hanoï) ; l'indonésien n'a pas de ton, la hauteur est de l'intonation.
- th [tʰ] aspiré opposé à t [t].
- Implosives b [ɓ], đ [ɗ] ; fricatives kh [x], g [ɣ], d/gi/r [z] (Hanoï), v.
- Voyelles ư [ɨ], ă, oppositions e [ɛ]/ê [e] et o [ɔ]/ô [o] ; diphtongues ia, ưa, ua.
- ch palatal [c] et fermeture des lèvres après o, ô, u (ông, học).
## B. En indonésien mais pas en vietnamien
- Finales -s, -l, -r, -h (bus, jual, pasar, rumah).
- c [tʃ], j [dʒ], sy [ʃ].
- Mots polysyllabiques avec accent (faible) sur la pénultième, et affixes.
## C. Faciles à confondre
- c vietnamien devant a, o, u = [k] (cá), pas le c indonésien [tʃ].
- ch est [c] (occlusive palatale), pas [tʃ].
- x = [s] ; s = [s] ou [ʂ].
- -c final est une fermeture vélaire silencieuse [k̚], pas le coup de glotte du -k indonésien.
## D. Système
Les mots indonésiens sont polysyllabiques et sans ton ; les morphèmes vietnamiens sont monosyllabiques, chacun avec un ton. Les syllabes en p, t, c, ch ne portent que sắc ou nặng.
""",
    },
    "hu": {
        "title": "Le hongrois et le vietnamien",
        "common": """
Les hongrophones peuvent s'appuyer sur plusieurs palatales et sur leur sens de la durée vocalique.
- ny [ɲ] = nh (nhà) ; ty [c] est très proche de ch (cha).
- Occlusives non aspirées : p, t, k hongrois sont non aspirés, comme p, t, c vietnamiens.
- Durée vocalique : le hongrois oppose voyelles brèves et longues ; les paires vietnamiennes a [aː] / ă [a] et ơ [əː] / â [ə] fonctionnent de manière voisine (avec une différence de timbre).
- Les voyelles i, é [eː], e [ɛ], o, u recoupent i, ê, e, ô/o, u ; la distinction e/é aide pour e/ê.
- Les fricatives voisées v, z existent dans les deux.
- Rythme : le hongrois prononce pleinement les voyelles inaccentuées, proche du rythme syllabique vietnamien.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en hongrois
- Six tons lexicaux (Hanoï) ; la hauteur hongroise est de l'intonation, l'accent tombe sur la première syllabe.
- /ŋ/ à l'initiale (ngà) ; le [ŋ] hongrois n'apparaît que devant k, g.
- th [tʰ] aspiré ; implosives b [ɓ], đ [ɗ] ; kh [x], g [ɣ].
- Voyelles ư [ɨ], ơ/â [ə], ă.
- Finales non relâchées et fermeture des lèvres après o, ô, u.
## B. En hongrois mais pas en vietnamien
- Voyelles antérieures arrondies ö, ő, ü, ű et harmonie vocalique.
- Consonnes géminées (tt, ll) et groupes consonantiques.
- cs [tʃ], s [ʃ], zs [ʒ], c [ts], gy [ɟ].
## C. Faciles à confondre
- Pièges d'orthographe : s vietnamien = [s] (Hanoï) ou [ʂ], pas le s hongrois [ʃ] ; x vietnamien = [s] (sz hongrois).
- a vietnamien est [aː], pas le a hongrois [ɒ].
- gi vaut [z] (Hanoï) ou [j] (Sud), pas gy.
## D. Système
Le hongrois marque le début du mot par l'accent et utilise des oppositions de durée ; le vietnamien donne un ton à chaque syllabe. Les syllabes en p, t, c, ch ne portent que sắc ou nặng.
""",
    },
    "pl": {
        "title": "Le polonais et le vietnamien",
        "common": """
Le polonais offre des correspondances remarquables pour certains sons vietnamiens difficiles pour d'autres Européens.
- y [ɨ] : le y polonais (my, ryba) est très proche du ư vietnamien [ɨ] (như, từ).
- Série rétroflexe : sz [ʂ] et ż/rz [ʐ] ressemblent aux s et r vietnamiens en prononciation soignée ou méridionale.
- ń [ɲ] = nh ; ch/h [x] = kh.
- Occlusives non aspirées : p, t, k polonais sont non aspirés, comme p, t, c vietnamiens.
- Fricatives voisées w [v], z [z] = v, d/gi/r vietnamiens (Hanoï [z]).
- Les voyelles a, e [ɛ], i, o [ɔ], u correspondent à a, e, i, o, u.
""",
        "diff": """
## A. En vietnamien mais pas (ou autrement) en polonais
- Six tons lexicaux (Hanoï) ; le polonais accentue la pénultième, la hauteur est de l'intonation.
- /ŋ/ à l'initiale (ngà) ; le [ŋ] polonais n'apparaît que devant k, g.
- th [tʰ] aspiré ; implosives b [ɓ], đ [ɗ] ; g [ɣ] ; occlusive palatale ch [c].
- Voyelles ơ [əː], â [ə], ă, et ê [e], ô [o] fermés opposés à e [ɛ], o [ɔ].
- Finales non relâchées et fermeture des lèvres après o, ô, u.
## B. En polonais mais pas en vietnamien
- Voyelles nasales ą, ę ; groupes consonantiques (chrząszcz, wzgórze).
- Alvéolo-palatales ś ź ć dź [ɕ ʑ tɕ dʑ] et affriquées c, cz, dz, dż.
- Dévoisement final (chleb [xlɛp]) et assimilation de voisement.
## C. Faciles à confondre
- ch vietnamien [c] est une occlusive, pas ć [tɕ] ni cz [tʂ].
- x = [s] ; s = [s] (Hanoï) ou [ʂ] (comme sz, Sud).
- e vietnamien est un [ɛ] ouvert comme le e polonais ; ê est un [e] fermé, que le polonais n'a pas comme voyelle distincte.
## D. Système
Les mots polonais ont un accent fixe et de nombreux groupes consonantiques ; les syllabes vietnamiennes sont simples et portent chacune un ton. Les syllabes en p, t, c, ch ne portent que sắc ou nặng.
""",
    },
}


# Consonnes coréennes et vietnamiennes comparées (carte repliable dans la section « Le coréen et le vietnamien »). Format : __init__.py.
CONSONANTS = {
    "title": "Consonnes coréennes et vietnamiennes comparées",
    "intro": """
Les lettres coréennes indiquées à côté (ㄱ, ㄲ, ㅋ, etc.) sont des repères d’apprentissage qui aident les locuteurs coréens à situer le son. Elles ne signifient pas qu’une consonne vietnamienne est phonétiquement identique à une consonne coréenne. La référence est la prononciation de Hanoï ; les différences régionales sont signalées à part. L’API est entre [ ].
""",
    "topics": [
        {
            "id": "laryngeal",
            "title": "Comparaison avec les consonnes coréennes douces, fortes et aspirées",
            "text": """
Les occlusives et affriquées coréennes forment une triple opposition : douces (lenis), fortes (tendues) et aspirées (ㄱ/ㄲ/ㅋ, ㄷ/ㄸ/ㅌ, ㅂ/ㅃ/ㅍ, ㅈ/ㅉ/ㅊ). Les douces sont sourdes avec une légère aspiration en début de mot et deviennent sonores entre voyelles ; les fortes sont non aspirées, avec un larynx tendu ; les aspirées ont une forte aspiration.
Le vietnamien n’a pas de triple opposition de ce type. Ses occlusives se distinguent par l’aspiration (t / th) et par le voisement (đ, b). Les comparaisons ci-dessous servent seulement à percevoir ces oppositions.
## đ / t / th et ㄷ / ㄸ / ㅌ
- t [t] : sourde et non aspirée, elle paraît proche de ㄸ aux locuteurs coréens, sans être aussi tendue que ㄸ.
- th [tʰ] : sourde et aspirée, proche de ㅌ. Ce n’est pas le th anglais [θ].
- đ [ɗ] : une implosive sonore, avec vibration des cordes vocales. Le ㄷ coréen est sourd en début de mot ; prononcer đ comme ㄷ donne un autre son.
## g / c·k·q / kh et ㄱ / ㄲ / ㅋ
- c·k·q [k] : une occlusive sourde non aspirée, qui paraît donc proche de ㄲ.
- kh [x] : non pas une occlusive mais une fricative sourde, produite avec le dos de la langue près du voile du palais. Elle n’explose pas comme ㅋ [kʰ].
- g·gh [ɣ] : une fricative sonore. Son mode d’articulation diffère du ㄱ coréen.
g / c / kh ne sont donc pas trois occlusives produites de la même façon comme ㄱ/ㄲ/ㅋ, mais une fricative sonore, une occlusive non aspirée et une fricative sourde.
## b / p et ㅂ / ㅃ / ㅍ
- b [ɓ] : une implosive sonore, comme đ.
- p [p] : non aspirée, donc proche de ㅃ, mais surtout en fin de syllabe (đáp) ; à l’initiale, seulement rarement dans des emprunts (pin « pile »). Beaucoup de locuteurs prononcent ce p comme [b].
- Un [pʰ] fortement aspiré comme ㅍ n’existe pas en vietnamien moderne. La graphie ph se lit [f] (voir « ph, hier et aujourd’hui » ci-dessous).
""",
        },
        {
            "id": "ph",
            "title": "ph, hier et aujourd’hui",
            "text": """
En vietnamien moderne, ph se prononce [f] : comme le f français, une fricative labiodentale sourde, les dents du haut touchant légèrement la lèvre inférieure (pha [fa] « infuser », phở).
Ne pas faire exploser ph comme le ㅍ coréen. ㅍ est une occlusive aspirée [pʰ] où les lèvres se ferment puis s’ouvrent ; ph [f] se produit par friction, sans fermer les lèvres.
## D’où vient la graphie ph
Lorsque les missionnaires ont noté le vietnamien en alphabet latin au XVIIe siècle, ils ont employé ph, graphie du φ grec, pour une occlusive aspirée vietnamienne (de même pour th). Le ph de l’époque est donc interprété comme un son de type [pʰ], comparable au ㅍ coréen.
Ce son est ensuite devenu la fricative [f]. th, noté de la même manière, est resté jusqu’à aujourd’hui l’occlusive aspirée [tʰ].
Plus loin encore, les sons qui ont abouti à ph n’ont pas une seule origine : d’anciennes aspirées des mots natifs et des labiales des mots sino-vietnamiens seraient parvenues au [f] actuel par des chemins différents. On ne peut pas affirmer que l’ancienne valeur était exactement celle du ㅍ coréen.
- ph autrefois : de type [pʰ], comparable au ㅍ coréen.
- ph aujourd’hui : [f], pas le ㅍ coréen.
""",
        },
        {
            "id": "palatal",
            "title": "ㅈ / ㅉ / ㅊ et les consonnes vietnamiennes",
            "text": """
Les ㅈ/ㅉ/ㅊ coréens [tɕ t͈ɕ tɕʰ] sont des affriquées opposées en douce, forte et aspirée. En vietnamien, les graphies à comparer sont ch, tr, d et gi, mais leurs oppositions fonctionnent autrement.
- ch [c]~[tɕ] : non aspiré, il paraît donc proche de ㅉ aux locuteurs coréens. Beaucoup de locuteurs de Hanoï le prononcent comme l’affriquée [tɕ] ; les descriptions traditionnelles notent l’occlusive palatale [c].
- tr : à Hanoï, le même son que ch ; dans la prononciation traditionnelle du Centre et du Sud, [ʈ], la langue étant relevée plus en arrière (voir « ch et tr selon les régions » ci-dessous).
- d·gi : la fricative sonore [z] à Hanoï, la semi-voyelle [j] (proche du y de « yeux ») dans le Sud. Ce ne sont pas des affriquées ; leur mode d’articulation diffère donc du ㅈ coréen.
Les ch et tr vietnamiens sont décrits comme fondamentalement non aspirés, et il n’existe pas d’affriquée aspirée qui leur serait associée. Il n’y a donc pas de série distincte correspondant exactement au ㅊ coréen [tɕʰ]. Apprendre d·gi comme ㅈ et ch comme ㅉ fait aussi facilement perdre de vue les différences de voisement et de mode d’articulation.
""",
        },
        {
            "id": "sx",
            "title": "s et x selon les régions",
            "text": """
Les graphies s et x correspondaient à des sons différents dans le système traditionnel ; aujourd’hui, elles sont distinguées dans certaines régions et confondues dans d’autres.
""",
            "cards": [
                {"title": "Nord — région de Hanoï", "rows": [
                    ["north", "Opposition", "Largement confondues (neutralisées) dans la langue parlée actuelle."],
                    ["north", "Prononciation", "s et x se prononcent tous deux [s]. Ils s’écrivent différemment mais sonnent pareil ou presque. Certains locuteurs les distinguent en lisant soigneusement d’après l’orthographe ; on ne peut donc pas dire que tout le monde les prononce toujours de façon identique."],
                ]},
                {"title": "Centre et Sud", "rows": [
                    ["south", "Opposition", "Maintenue dans de nombreuses régions."],
                    ["south", "Prononciation", "x est [s], s est [ʂ], la langue plus en arrière (certaines sources notent [ʃ]). Beaucoup de locuteurs, comme les jeunes de Hô Chi Minh-Ville, prononcent toutefois aussi s comme [s], ce qui confond les deux ; il existe aussi des différences à l’intérieur des régions."],
                ]},
            ],
            "examples": [
                {"word": "sinh", "mean": "naître", "note": "Hanoï [s] · Huế, Saïgon [ʂ]~[s]"},
                {"word": "xinh", "mean": "joli", "note": "Hanoï [s] · Huế, Saïgon [s]"},
            ],
            "after": """
## Comparaison avec ㅅ / ㅆ coréens
- Les ㅅ/ㅆ coréens sont deux fricatives opposées en douce et forte. Les s/x vietnamiens sont eux aussi distingués dans l’orthographe et dans le système traditionnel ; l’habitude d’apprendre deux sons séparés peut donc servir de la même manière.
- Mais ne pas les apprendre terme à terme comme « s = ㅆ, x = ㅅ ». Là où s et x sont distingués, la différence ne tient pas à la tension comme en coréen, mais à la position de la langue ([ʂ] contre [s]).
- À Hanoï, s et x sont tous deux [s] ; pour les locuteurs coréens, ils peuvent donc sonner comme un ㅅ appuyé, proche de ㅆ. Ce n’est qu’un repère d’écoute.
- Au Centre et dans le Sud, ils peuvent être distingués : ne pas croire que s et x vietnamiens sont toujours le même son.
""",
        },
        {
            "id": "chtr",
            "title": "ch et tr selon les régions",
            "text": """
Les graphies ch et tr correspondaient traditionnellement à des sons différents ; selon les régions, ils se sont confondus ou restent distincts.
## Nord — région de Hanoï
Dans le parler actuel de Hanoï, ch et tr sont décrits comme entièrement confondus. Les descriptions traditionnelles notent ce son comme l’occlusive palatale [c], produite avec l’avant du dos de la langue contre le palais ; beaucoup de jeunes locuteurs le prononcent comme l’affriquée [tɕ]. Il est non aspiré.
Ainsi trà « thé » et chà « frotter », qui ont aussi le même ton huyền, sonnent pareil à Hanoï : tous deux [tɕaː]. Pour les locuteurs coréens, ils peuvent paraître proches de ㅉ, mais ce n’est pas le même son.
## Sud — région de Hô Chi Minh-Ville
La prononciation traditionnelle du Sud distingue ch et tr. ch est [c], la langue relativement en avant (il peut sonner légèrement affriqué, proche de [tɕ]) ; tr est la rétroflexe [ʈ], la pointe de la langue relevée derrière les alvéoles, et sonne souvent légèrement affriquée, comme [ʈʂ].
Dans le Sud, trà [ʈaː] et chà [caː] sonnent donc différemment. Pour les locuteurs coréens, ch paraît proche de ㅉ, tandis que tr, avec la langue plus en arrière, peut sembler un peu plus lourd et plus sourd.
Cependant, beaucoup de locuteurs, dont les jeunes de Hô Chi Minh-Ville, prononcent tr comme ch, [c], et un affaiblissement de l’opposition est aussi signalé dans le Sud. La prononciation traditionnelle du Centre (Huế et ailleurs) distingue elle aussi les deux sons.
## Récapitulatif
""",
            "cards": [
                {"title": "ch", "rows": [
                    ["north", "Nord (région de Hanoï)", "[c]~[tɕ], non aspiré. Même son que tr."],
                    ["south", "Sud (région de Hô Chi Minh-Ville)", "[c] (peut sonner légèrement affriqué). Langue relativement en avant."],
                ]},
                {"title": "tr", "rows": [
                    ["north", "Nord (région de Hanoï)", "Confondu avec ch, prononcé [c]~[tɕ]."],
                    ["south", "Sud (région de Hô Chi Minh-Ville)", "[ʈ] (sonne souvent comme [ʈʂ]). Rétroflexe, pointe de la langue relevée plus en arrière. Certains locuteurs le prononcent comme ch, [c]."],
                ]},
            ],
            "examples": [
                {"word": "trà", "mean": "thé", "note": "Hanoï [tɕaː] · Saïgon [ʈaː]"},
                {"word": "chà", "mean": "frotter", "note": "Hanoï [tɕaː] · Saïgon [caː]"},
            ],
            "after": """
## À noter pour les locuteurs coréens
- Ne pas apprendre ch comme le ㅉ coréen ni tr comme le ㅊ coréen. Les deux sont fondamentalement non aspirés.
- Les ㅈ/ㅉ/ㅊ coréens s’opposent en douce, forte et aspirée, alors que les ch/tr vietnamiens diffèrent par la position de la langue (lieu d’articulation) dans le Sud et sont confondus dans le Nord : ce sont deux systèmes différents.
- Dans le Nord, ch et tr sont le même son ; l’orthographe de chaque mot est donc à apprendre séparément.
- Pour la prononciation du Sud, faire attention à la différence de lieu d’articulation : pour tr, la langue est relevée plus en arrière.
""",
        },
    ],
}
