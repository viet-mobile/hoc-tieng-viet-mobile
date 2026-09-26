# -*- coding: utf-8 -*-
"""[발음] > [차이] -- English. Text format: see pronunciation_comparison/__init__.py."""

UI = {
    "intro": "How Vietnamese pronunciation (standard Hanoi speech unless noted) compares with each language, seen from its speakers' side. Spelling and sound are kept apart: the same letter in two alphabets does not mean the same phoneme. IPA in slashes / / marks phonemes, in brackets [ ] actual pronunciations.",
    "common": "Similarities",
    "diff": "Differences",
}

SECTIONS = {
    "ko": {
        "title": "Korean and Vietnamese",
        "common": """
Both languages build words from clearly separated syllables, and both end syllables with unreleased consonants: Korean 밥 [pap̚] and Vietnamese đáp [ɗaːp̚] close the same way, lips shut, no puff of air. Korean speakers therefore already control what is hardest about Vietnamese finals for most learners.
- Finals: Korean's seven coda sounds [p̚ t̚ k̚ m n ŋ l] include six of the Vietnamese finals /p t k m n ŋ/ (written p, t, c/ch, m, n, ng/nh).
- /ŋ/: Korean final ㅇ (강) is Vietnamese final ng. Vietnamese also puts it at the start of a syllable (ngà); the articulation is the same, only the position is new.
- Aspiration: Korean ㅌ /tʰ/ is close to Vietnamese th /tʰ/, and Vietnamese t /t/ (no aspiration) is closer to tense ㄸ than to lax ㄷ.
- Vowels: ㅣ[i], ㅔ[e], ㅏ[a], ㅜ[u], ㅗ[o] have near equivalents in i, ê, a, u, ô; ㅡ [ɯ] is a good starting point for ư [ɨ].
- Glide + vowel sequences such as 와 [wa] and 워 [wʌ] resemble Vietnamese oa [wa] and uơ.
- Rhythm: both are syllable-timed; every syllable keeps a full vowel, with none of the vowel reduction found in English.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in Korean
- Lexical tone: six tones in Hanoi speech; pitch contour and voice quality of each syllable change the word (ma, mà, má, mả, mã, mạ). Standard Seoul Korean has no lexical tone; pitch only shapes phrases.
- Implosive voiced b [ɓ] and đ [ɗ]: voiced, with a slight inward airflow. Korean has no voiced stop phonemes (ㅂ, ㄷ are only voiced between vowels).
- Fricatives /f/ (ph), /v/, /z/ (d, gi, r in Hanoi), /x/ (kh) and /ɣ/ (g, gh) are not Korean phonemes.
- Vowels ơ [əː] and short â [ə], short ă, and the e [ɛ] / ê [e] contrast (Korean ㅐ/ㅔ have merged for most speakers).
- Palatal finals -nh, -ch after i, ê, a, and lip closure at the end of ông [ʔəwŋ͡m], học [hawk͡p].
## B. In Korean but not in Vietnamese
- The three-way lax/tense/aspirated contrast (ㄱ/ㄲ/ㅋ, ㅈ/ㅉ/ㅊ); Vietnamese has two-way contrasts such as t/th.
- Final /l/ (말) and ㄹ alternating [ɾ]~[l]; no Vietnamese syllable ends in l.
- Sound changes between syllables (nasalization 국물 → [궁물], linking of a final into the next syllable) do not happen in Vietnamese: each syllable keeps its own final.
## C. Easily confused
- Vietnamese t is not ㄷ: no aspiration, like ㄸ but less tense. Vietnamese th is like ㅌ and never English "th".
- ư [ɨ] is more central than ㅡ; ơ [əː] is more central and longer than ㅓ [ʌ].
- Final -c after o, ô, u ends with the lips closed (học ≈ [hawk͡p]); it is not 학.
## D. System
Korean speakers tend to use phrase-level pitch; in Vietnamese the pitch shape belongs to each syllable and must survive in fast speech. Syllables ending in p, t, c, ch take only the sắc or nặng tone.
""",
    },
    "ja": {
        "title": "Japanese and Vietnamese",
        "common": """
Japanese and Vietnamese share a clear, even rhythm and many simple consonants, so Japanese speakers usually find Vietnamese onsets easy to start with.
- Consonants: /m n p b t d k ɡ s h/ exist in both; Japanese ニャ [ɲa] gives the Vietnamese nh [ɲ] (nhà), and ン before k/g ([ŋ]) gives ng.
- Vowels: Japanese a, i, e, o are close to Vietnamese a, i, ê, ô; Japanese u is unrounded [ɯ], a useful step toward Vietnamese ư [ɨ] (Vietnamese u itself is fully rounded).
- Rhythm: neither language reduces unstressed vowels; each unit is pronounced fully and evenly.
- Pitch matters in both: Japanese distinguishes 箸 はし and 橋 はし by pitch accent, so Japanese speakers already listen to pitch.
- Glottal stop: Japanese っ before a pause and the Vietnamese onset before a vowel-initial syllable (ăn [ʔan]) both involve a glottal closure.
- Voiceless stops: Japanese /t k/ are only lightly aspirated, close to Vietnamese t, c.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in Japanese
- Lexical tone: six contour tones with voice-quality differences (creaky ngã, glottalized nặng). Japanese pitch accent is a different system: it marks where pitch falls within a word, measured in morae; it is not a contour on every syllable.
- Final consonants: -p, -t, -c/-ch, -m, -n, -ng/-nh, all unreleased. Japanese has only the moraic ン and っ; speakers tend to add a vowel (táp → タプ). Keep the mouth closed and silent after the final.
- Aspirated th [tʰ] versus unaspirated t [t] is a phonemic contrast.
- Implosive b [ɓ], đ [ɗ]; fricatives /f v z x ɣ/ (Japanese ふ is [ɸ], not [f]).
- Eleven vowel qualities including ơ [əː], â [ə], ă, ư [ɨ], e [ɛ] vs ê [e], o [ɔ] vs ô [o], plus diphthongs ia, ưa, ua.
## B. In Japanese but not in Vietnamese
- Phonemic vowel length (おばさん/おばあさん) and geminate consonants (きて/きって). Vietnamese length is tied to vowel quality (a/ă, ơ/â), not a separate contrast.
- The mora as timing unit, moraic ン [m n ŋ ɴ] adapting to the next sound, devoiced vowels (です [des]).
- /ts/ (つ), [ɕ] (し), [dʑ] (じ).
## C. Easily confused
- Japanese ら行 [ɾ] for both l and r: Vietnamese l is a clear [l], r is [z] in Hanoi and [ɹ]~[r] in the South.
- ư is not ウ: keep the lips spread and the tongue central.
- Final -n and -ng are distinct words (tan / tang); Japanese ン does not make this contrast.
## D. System
Japanese words are made of morae with one pitch accent pattern; Vietnamese is monosyllabic per morpheme, each syllable carrying its own tone. Checked syllables (-p, -t, -c, -ch) take only sắc or nặng.
""",
    },
    "zh_cn": {
        "title": "Standard Mandarin and Vietnamese",
        "common": """
Standard Mandarin (Putonghua) and Vietnamese are both tone languages with monosyllabic morphemes, and centuries of contact left Vietnamese with a large Sino-Vietnamese vocabulary, so Mandarin speakers start with real advantages.
- Tone: every syllable has a lexical tone. Mandarin 2nd tone (35) is similar to sắc; the dipping 3rd tone (214) resembles hỏi.
- Aspiration: Mandarin d/t [t]/[tʰ] match Vietnamese t [t] / th [tʰ]; Vietnamese c [k] is Mandarin g [k], and Vietnamese kh is the fricative [x] of Mandarin h.
- Syllable shape: (initial) + (medial) + nucleus + (final), with one tone over the whole syllable, as in Mandarin.
- Nasal finals -n and -ng are shared, and Mandarin ng [ŋ] in hang matches Vietnamese -ng.
- Sino-Vietnamese words correspond systematically to Chinese characters: 學 xué ↔ học, 國 guó ↔ quốc, 心 xīn ↔ tâm.
- Retroflex sounds: Mandarin sh [ʂ], r [ʐ] resemble Vietnamese s and r in careful or Southern speech.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in Mandarin
- Six tones (Hanoi), two with glottalization: ngã (rising, broken by a glottal catch) and nặng (short, low, ending in a glottal stop). Mandarin has four tones plus a neutral tone, none glottalized; Mandarin 1st tone (55) is higher than the mid-level ngang (33).
- Stop finals -p, -t, -c/-ch, and -m: Mandarin lost these, although the characters had them in Middle Chinese (十 thập, 心 tâm).
- Voiced consonants: implosive b [ɓ], đ [ɗ], fricatives v, d/gi [z], g [ɣ].
- Vowels ơ/â [ə], ư [ɨ], and the e [ɛ] / ê [e] and o [ɔ] / ô [o] contrasts; diphthongs ia, ưa, ua.
## B. In Mandarin but not in Vietnamese
- Front rounded ü [y] (绿, 女); Vietnamese has no front rounded vowels.
- Alveolo-palatals j q x [tɕ tɕʰ ɕ] and dental affricates z c [ts tsʰ]; aspirated affricates in general.
- The r-final (儿化) and the neutral tone; tone sandhi (3rd tone before 3rd tone).
## C. Easily confused
- Vietnamese ch [c] is a palatal stop, not Mandarin ch [tʂʰ] or q [tɕʰ]; Vietnamese tr is [c] in Hanoi, [ʈ] in the South.
- Vietnamese x is [s] (like Mandarin s), while Vietnamese s is [s] in Hanoi and [ʂ] in the South.
- Vietnamese th is aspirated [tʰ] (Mandarin t), not [θ].
- nặng is not the Mandarin 4th tone: it starts low and is cut off by a glottal stop.
## D. System
Tone contours differ even when they look similar: learn each Vietnamese tone by pitch height, shape and voice quality. Checked syllables (-p, -t, -c, -ch) take only sắc or nặng, much like the old "entering tone".
""",
    },
    "zh": {
        "title": "Taiwanese Hokkien, Cantonese and Vietnamese",
        "note": """
Traditional characters are a writing system, not a pronunciation. Taiwan uses Mandarin (國語) as its standard language; the comparisons below cover two other Chinese languages whose sound systems are very different from Mandarin: Taiwanese Hokkien (臺灣台語 / 閩南語) and Cantonese (粵語), as spoken in Hong Kong and Guangdong.
""",
        "subsections": {
            "nan": {
                "title": "Taiwanese Hokkien and Vietnamese",
                "common": """
Taiwanese Hokkien preserves many features of older Chinese that Vietnamese also has, so Hokkien speakers recognize much of the Vietnamese syllable structure.
- Stop finals: Hokkien has -p, -t, -k and a glottal -h [ʔ] in "entering tone" syllables (十 tsa̍p, 日 ji̍t, 學 ha̍k), matching Vietnamese -p, -t, -c.
- Nasal finals -m, -n, -ng are all present (心 sim ↔ tâm, 山 san, 東 tang).
- Aspiration: Hokkien p/ph, t/th, k/kh parallel Vietnamese t/th; Vietnamese c [k] is like Hokkien k.
- Voiced b and g exist in Hokkien (bah, gû), which helps with Vietnamese voiced onsets.
- Tone: many lexical tones, with short checked tones on stop-final syllables, just as Vietnamese restricts syllables ending in -p, -t, -c, -ch to sắc and nặng.
- ng as an initial (雅 ngá) is familiar, as in Vietnamese ngà.
""",
                "diff": """
## A. In Vietnamese but not (or differently) in Hokkien
- Glottalized tones ngã and nặng, and the breathy low huyền.
- Implosive b [ɓ], đ [ɗ]; fricatives ph [f], v, d/gi [z], kh [x], g [ɣ].
- Vowels ư [ɨ], ơ/â [ə], e [ɛ], and the ô [o] / o [ɔ] contrast in the same position; diphthongs ưa, ươ.
- Palatal ch [c] and nh [ɲ].
## B. In Hokkien but not in Vietnamese
- Nasalized vowels (三 sann [sã], 天 thinn): Vietnamese has no nasal vowels; an must end in a real [n].
- Extensive tone sandhi: in Hokkien nearly every non-final syllable of a phrase changes tone. Vietnamese keeps each syllable's tone.
- Syllabic m and ng (毋 m̄, 黃 n̂g), and the glottal final -h.
- Affricates ts, tsh, j [dz].
## C. Easily confused
- Vietnamese -c final after a, ă is [k̚]; after o, ô, u the lips also close (học [hawk͡p]).
- Vietnamese t is unaspirated, th aspirated — same contrast as Hokkien, but different letters from Pe̍h-ōe-jī for other sounds (Vietnamese ph = [f], not [pʰ]).
- Do not apply Hokkien sandhi habits to Vietnamese compounds.
## D. System
Both are tonal with checked syllables, but Vietnamese tone values are fixed per syllable and include voice quality (creak, glottal stop), not just pitch.
""",
            },
            "yue": {
                "title": "Cantonese and Vietnamese",
                "common": """
Cantonese is probably the Chinese language whose syllable structure is closest to Vietnamese.
- Finals: Cantonese has exactly the Vietnamese set -p, -t, -k, -m, -n, -ng, all unreleased (十 sap6, 日 jat6, 學 hok6).
- Tones: six contrastive tones, with checked (entering) syllables on stop finals — the Vietnamese pattern of sắc/nặng on -p, -t, -c, -ch.
- Vowel length: Cantonese aa [aː] / a [ɐ] (三 saam / 心 sam) resembles Vietnamese a [aː] / ă [a] and ơ [əː] / â [ə].
- Aspiration: p/ph, t/th, k/kh contrasts (Jyutping b/p, d/t, g/k) match Vietnamese t/th.
- Initial ng [ŋ] (我 ngo5) exists, as in Vietnamese ngà.
- Sino-Vietnamese correspondences are often transparent: 國 gwok3 ↔ quốc, 心 sam1 ↔ tâm, 南 naam4 ↔ nam.
""",
                "diff": """
## A. In Vietnamese but not (or differently) in Cantonese
- Glottalized tones ngã and nặng; breathy huyền. Cantonese tones differ mainly in pitch level and contour.
- Implosive b [ɓ], đ [ɗ]; voiced fricatives v, d/gi [z], g [ɣ]; kh [x] (Cantonese h is [h]).
- Palatal ch [c] and nh [ɲ]; ư [ɨ]; the e [ɛ] / ê [e] contrast.
- Diphthongs ia, ưa, ua with a centering glide.
## B. In Cantonese but not in Vietnamese
- Front rounded vowels yu [y] and oe/eo [œ ɵ] (魚 jyu, 靴 hoe).
- Labialized gw, kw (國 gwok, 裙 kwan); in Vietnamese quốc the [w] belongs to the medial.
- Syllabic m and ng (唔 m4, 五 ng5); three level tones distinguished only by height.
## C. Easily confused
- Vietnamese d is [z] (Hanoi) or [j] (South), never [t]; đ is [ɗ].
- Vietnamese tones are not Cantonese tone numbers: ngang is mid-level, sắc high rising, huyền low falling (breathy).
- Final -c/-ng after o, ô, u close the lips: học [hawk͡p], ông [ʔəwŋ͡m].
## D. System
Both have six tones and checked syllables, but Vietnamese distinguishes tones by voice quality as well as pitch, and has no tone sandhi.
""",
            },
        },
    },
    "cs": {
        "title": "Czech and Vietnamese",
        "common": """
Czech speakers have a head start on several Vietnamese consonants that many learners find difficult.
- Unaspirated stops: Czech p, t, k are unaspirated, exactly like Vietnamese p, t, c/k.
- Palatals: Czech ň [ɲ] = Vietnamese nh (nhà); Czech ť [c] is very close to Vietnamese ch [c] (cha); ď [ɟ] is a useful reference too.
- Velar fricative: Czech ch [x] = Vietnamese kh (khá).
- Voiced fricatives v, z exist in both (Vietnamese v, and d/gi/r = [z] in Hanoi).
- Vowel length: Czech a/á contrasts length; Vietnamese a [aː] / ă [a] and ơ [əː] / â [ə] also pair long and short vowels, though differing in quality as well.
- Many vowels match: i, e, a, o, u ≈ Vietnamese i, ê/e, a, ô/o, u.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in Czech
- Lexical tone: six tones (Hanoi). Czech pitch only carries intonation; stress is fixed on the first syllable.
- /ŋ/ at the start of a syllable (ngà, nghe). Czech [ŋ] only occurs before k/g (banka).
- Aspirated th [tʰ] contrasting with t [t]; implosive b [ɓ], đ [ɗ]; g [ɣ] (voiced fricative, unlike Czech h [ɦ]).
- Vowels ư [ɨ], ơ/â [ə], and the e [ɛ] / ê [e], o [ɔ] / ô [o] contrasts.
- Unreleased finals -p, -t, -c, and lip closure after o, ô, u.
## B. In Czech but not in Vietnamese
- Consonant clusters (zmrzlina, čtvrt) and syllabic r, l (vlk): Vietnamese allows no clusters.
- ř [r̝], š [ʃ], ž [ʒ], č [tʃ], c [ts]; voiced h [ɦ].
- Final devoicing and voicing assimilation (led [let]); Vietnamese has no such alternations.
## C. Easily confused
- Vietnamese x is [s], s is [s] (Hanoi) or [ʂ] (South) — not Czech š.
- Vietnamese h is voiceless [h], unlike Czech h [ɦ].
- ư is not Czech y: y = [ɪ], ư = [ɨ] (central, lips spread).
## D. System
Czech stresses the first syllable and uses length; Vietnamese gives every syllable its own tone, with no fixed word stress. Syllables ending in p, t, c, ch take only sắc or nặng.
""",
    },
    "de": {
        "title": "German and Vietnamese",
        "common": """
German shares several consonant and rhythm details with Vietnamese that can be used directly.
- Glottal onset: German inserts a glottal stop before a word-initial vowel (ein [ʔaɪn]); Vietnamese syllables without a written consonant start the same way (ăn [ʔan]).
- ch [x]: the German ach-Laut is Vietnamese kh (khá).
- Aspiration: German t [tʰ] is close to Vietnamese th; German d at the start of a word is voiceless and unaspirated in much of Germany, close to Vietnamese t.
- /ŋ/: German ng (Ding) is Vietnamese final ng; Vietnamese adds it at the start of syllables (ngà).
- Vowels: German i, e, a, o, u in tense and lax forms provide references for Vietnamese i, ê/e, a/ă, ô/o, u.
- Voiced fricatives v [v] (German w) and z [z] (German s in Sonne) exist in both.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in German
- Lexical tone: six tones (Hanoi), including glottalized ngã and nặng; German uses pitch only for intonation and stress.
- Implosive b [ɓ], đ [ɗ]; palatal ch [c], nh [ɲ]; g [ɣ].
- Vowels ư [ɨ], ơ [əː], â [ə] as full stressed vowels (German schwa only appears unstressed).
- Unreleased finals: German releases or devoices finals; Vietnamese -p, -t, -c are silent closures.
## B. In German but not in Vietnamese
- Front rounded ü [y], ö [ø]; contrastive vowel length (Staat/Stadt).
- Final obstruent devoicing (Rad [ʁaːt]) and consonant clusters (Strumpf).
- Uvular r [ʁ], sch [ʃ], z [ts], pf.
- Lexical word stress with reduced unstressed syllables.
## C. Easily confused
- Vietnamese d is not German d: it is [z] in Hanoi and [j] in the South; đ is [ɗ].
- Vietnamese v is [v], not German v [f]; ph is [f].
- Vietnamese s is [s]/[ʂ], x is [s]; neither is German sch.
- ơ is not German unstressed e: it is a full, long central vowel.
## D. System
German rhythm is stress-timed; Vietnamese is syllable-timed and each syllable keeps its tone. Checked syllables (-p, -t, -c, -ch) take only sắc or nặng.
""",
    },
    "en": {
        "title": "English and Vietnamese",
        "common": """
English speakers can build on a number of shared sounds, as long as spelling is kept apart from sound.
- Consonants: /m n f v s z h l/ exist in both; ph = [f], v = [v], x = [s], and in Hanoi d/gi/r = [z].
- /ŋ/: English sing ends in Vietnamese ng; Vietnamese also starts syllables with it (ngà).
- Aspiration: English t in "top" [tʰ] is Vietnamese th; English t after s ("stop") is unaspirated, like Vietnamese t.
- Diphthongs: English "eye", "cow", "boy" are close to Vietnamese ai/ay, ao/au, oi.
- Glottal stop: English "uh-oh" contains the glottal stop that begins Vietnamese vowel-initial syllables and ends the nặng tone.
- Unreleased stops: English speakers often leave final stops unreleased ("cat" in casual speech), which is the Vietnamese norm.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in English
- Lexical tone: six tones (Hanoi). In English, pitch signals questions and emphasis; in Vietnamese it changes the word, so a rising question intonation can turn one word into another.
- Implosive b [ɓ], đ [ɗ]; palatal ch [c], nh [ɲ]; kh [x], g [ɣ].
- Vowels ư [ɨ], ơ [əː], â [ə], ă; e [ɛ] vs ê [e]; diphthongs ia, ưa, ua.
- Lip closure on finals after o, ô, u (ông, học).
## B. In English but not in Vietnamese
- th [θ ð], sh [ʃ], zh [ʒ], ch [tʃ], j [dʒ]; retroflex-like r [ɹ].
- Consonant clusters (strengths) and final consonants such as -s, -l, -r, -v: Vietnamese syllables end only in p, t, c/ch, m, n, ng/nh or a glide.
- Stress and vowel reduction to schwa.
## C. Easily confused
- Vietnamese th is [tʰ], never [θ].
- Vietnamese d is [z] (North) or [j] (South); đ is [ɗ] — neither is English d.
- Vietnamese ch is [c] (tongue body on the palate), not English ch [tʃ].
- Final -t, -c are silent closures: không phải → no audible release, no added vowel.
## D. System
English is stress-timed and uses pitch for intonation; Vietnamese is syllable-timed and fixes a tone on each syllable. Syllables ending in p, t, c, ch take only sắc or nặng.
""",
    },
    "fr": {
        "title": "French and Vietnamese",
        "common": """
French and Vietnamese share several articulatory habits. (The Vietnamese alphabet owes much to European missionaries, but that history explains spelling, not pronunciation.)
- Unaspirated stops: French p, t, k are unaspirated, like Vietnamese p, t, c.
- Voiced consonants: French b, d, v, z; Vietnamese has v [v] and d/gi/r [z] (Hanoi); French b, d are a fair starting point for b [ɓ], đ [ɗ].
- gn [ɲ]: French agneau gives Vietnamese nh (nhà).
- Vowels: French i, é [e], è [ɛ], a, o [o], ô/au, ò [ɔ], ou [u] match Vietnamese i, ê, e, a, ô, o, u — including the e/ê and o/ô contrasts that many learners find hard.
- Rhythm: French is syllable-timed with full vowels, like Vietnamese.
- Uvular r [ʁ] is a useful approximation of Vietnamese g [ɣ] (gà).
""",
        "diff": """
## A. In Vietnamese but not (or differently) in French
- Lexical tone: six tones (Hanoi); French pitch only marks phrase-final prominence and intonation.
- Aspirated th [tʰ] contrasting with t; kh [x]; palatal ch [c].
- /ŋ/ at the start and end of syllables (ngà, ông).
- Vowels ư [ɨ], ơ [əː], â [ə], ă.
- Unreleased finals -p, -t, -c: French releases final consonants (cap [kap]).
## B. In French but not in Vietnamese
- Nasal vowels (an [ɑ̃], on [ɔ̃], in [ɛ̃]): Vietnamese an, ông are oral vowels followed by a real nasal consonant.
- Front rounded vowels u [y], eu [ø œ].
- ch [ʃ], j [ʒ]; liaison and enchaînement: Vietnamese syllables never link a final into the next vowel.
## C. Easily confused
- Vietnamese an is [aːn] with the tongue touching the ridge; do not nasalize it as French an.
- Vietnamese u is [u] (French ou), ư is [ɨ], not French u [y].
- Vietnamese th is aspirated [tʰ]; French th in théâtre is plain [t].
- Vietnamese r is [z] (Hanoi) or [ɹ~r] (South), not the French [ʁ].
## D. System
French stresses the last syllable of a phrase; Vietnamese gives every syllable its own tone. Syllables ending in p, t, c, ch take only sắc or nặng.
""",
    },
    "id": {
        "title": "Indonesian and Vietnamese",
        "common": """
Indonesian spelling is almost phonemic, like Vietnamese, and the two share several sounds that are rare in European languages.
- ng [ŋ] at the start of a syllable (ngopi, ngantuk) = Vietnamese ngà, nghe.
- ny [ɲ] = Vietnamese nh (nhà).
- Unaspirated stops: Indonesian p, t, k are unaspirated, like Vietnamese p, t, c.
- Unreleased finals: Indonesian final -p, -t (atap, lompat) are often unreleased, and final -k is a glottal stop, close to Vietnamese finals.
- Schwa: Indonesian e pepet [ə] (besar) is close to Vietnamese â [ə] and ơ [əː].
- Vowels a, i, u, e, o overlap with Vietnamese a, i, u, ê/e, ô/o; diphthongs ai, au, oi resemble Vietnamese ai, ao, oi.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in Indonesian
- Lexical tone: six tones (Hanoi). Indonesian has no tone; pitch is intonation.
- Aspirated th [tʰ] contrasting with t [t].
- Implosive b [ɓ], đ [ɗ]; fricatives kh [x], g [ɣ], d/gi/r [z] (Hanoi), v.
- Vowels ư [ɨ], ă, the e [ɛ] / ê [e] and o [ɔ] / ô [o] contrasts; diphthongs ia, ưa, ua.
- Palatal ch [c] and lip closure after o, ô, u (ông, học).
## B. In Indonesian but not in Vietnamese
- Finals -s, -l, -r, -h (bus, jual, pasar, rumah): Vietnamese never ends a syllable in these.
- c [tʃ], j [dʒ], sy [ʃ].
- Multi-syllable words with (weak) penultimate stress and prefixes/suffixes.
## C. Easily confused
- Vietnamese c before a, o, u is [k] (cá), not Indonesian c [tʃ].
- Vietnamese ch is [c] (palatal stop), not [tʃ].
- Vietnamese x is [s]; Vietnamese s is [s] or [ʂ].
- Final -c is a silent velar closure [k̚] (the back of the tongue touches the soft palate), not the glottal stop of Indonesian final -k.
## D. System
Indonesian words are polysyllabic without tone; Vietnamese morphemes are single syllables, each with a tone. Syllables ending in p, t, c, ch take only sắc or nặng.
""",
    },
    "hu": {
        "title": "Hungarian and Vietnamese",
        "common": """
Hungarian speakers can rely on several palatal consonants and on their feel for vowel length.
- ny [ɲ] = Vietnamese nh (nhà); ty [c] is very close to Vietnamese ch (cha).
- Unaspirated stops: Hungarian p, t, k are unaspirated, like Vietnamese p, t, c.
- Vowel length: Hungarian contrasts short and long vowels; Vietnamese pairs a [aː] / ă [a] and ơ [əː] / â [ə] work in a related way (with quality differences).
- Vowels i, é [eː], e [ɛ], o, u overlap with Vietnamese i, ê, e, ô/o, u — the e/é distinction helps with e/ê.
- Voiced fricatives v, z exist in both.
- Syllable-timed rhythm: Hungarian keeps unstressed vowels full, as Vietnamese does.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in Hungarian
- Lexical tone: six tones (Hanoi); Hungarian pitch is intonation only, stress falls on the first syllable.
- /ŋ/ at the start of a syllable (ngà); Hungarian [ŋ] appears only before k, g.
- Aspirated th [tʰ]; implosive b [ɓ], đ [ɗ]; kh [x], g [ɣ].
- Vowels ư [ɨ], ơ/â [ə], ă.
- Unreleased finals and lip closure after o, ô, u.
## B. In Hungarian but not in Vietnamese
- Front rounded ö, ő, ü, ű and vowel harmony.
- Geminate consonants (tt, ll) and consonant clusters.
- cs [tʃ], s [ʃ], zs [ʒ], c [ts], gy [ɟ].
## C. Easily confused
- Spelling traps: Vietnamese s is [s] (Hanoi) or [ʂ], not Hungarian s [ʃ]; Vietnamese x is [s] (Hungarian sz).
- Vietnamese a is [aː], not Hungarian a [ɒ].
- Vietnamese gi is [z] (Hanoi) or [j] (South), not Hungarian gy.
## D. System
Hungarian marks word beginnings with stress and uses length contrasts; Vietnamese gives each syllable its own tone. Syllables ending in p, t, c, ch take only sắc or nặng.
""",
    },
    "pl": {
        "title": "Polish and Vietnamese",
        "common": """
Polish has an unusually good match for some Vietnamese sounds that other Europeans find hard.
- y [ɨ]: Polish y (my, ryba) is very close to Vietnamese ư [ɨ] (như, từ).
- Retroflex series: Polish sz [ʂ] and ż/rz [ʐ] are close to Vietnamese s and r in careful or Southern speech.
- ń [ɲ] = Vietnamese nh; ch/h [x] = Vietnamese kh.
- Unaspirated stops: Polish p, t, k are unaspirated, like Vietnamese p, t, c.
- Voiced fricatives w [v], z [z] = Vietnamese v, d/gi/r (Hanoi [z]).
- Vowels a, e [ɛ], i, o [ɔ], u match Vietnamese a, e, i, o, u.
""",
        "diff": """
## A. In Vietnamese but not (or differently) in Polish
- Lexical tone: six tones (Hanoi); Polish stress falls on the penultimate syllable and pitch is intonation.
- /ŋ/ at the start of a syllable (ngà); Polish [ŋ] only before k, g.
- Aspirated th [tʰ]; implosive b [ɓ], đ [ɗ]; g [ɣ]; palatal stop ch [c].
- Vowels ơ [əː], â [ə], ă, and closed ê [e], ô [o] contrasting with e [ɛ], o [ɔ].
- Unreleased finals and lip closure after o, ô, u.
## B. In Polish but not in Vietnamese
- Nasal vowels ą, ę; consonant clusters (chrząszcz, wzgórze).
- Alveolo-palatals ś ź ć dź [ɕ ʑ tɕ dʑ] and affricates c, cz, dz, dż.
- Final devoicing (chleb [xlɛp]) and voicing assimilation.
## C. Easily confused
- Vietnamese ch [c] is a stop, not Polish ć [tɕ] or cz [tʂ].
- Vietnamese x = [s]; Vietnamese s = [s] (Hanoi) or [ʂ] (like sz, South).
- Vietnamese e is open [ɛ] like Polish e; ê is closed [e], which Polish lacks as a separate vowel.
## D. System
Polish words have fixed stress and many clusters; Vietnamese syllables are simple and each carries a tone. Syllables ending in p, t, c, ch take only sắc or nặng.
""",
    },
}
