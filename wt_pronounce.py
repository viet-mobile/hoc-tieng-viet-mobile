# Systematic Vietnamese -> Hangul + IPA "북부/남부 발음" transcriber, used to fill the
# 'north'/'south' fields for every 파수대(Watchtower) vocabulary entry (WATCHTOWER_VOCAB).
#
# This is a pragmatic, whole-corpus tool (not a hand-curated set like NORTH_SOUTH_DIFFS in
# pronunciation_data.py), but it reuses that exact same "한글[ipa]" notation and, for the four
# well-known, high-value initial-consonant contrasts NORTH_SOUTH_DIFFS already documents
# (d-/gi-/r-, s-/x-, ch-/tr-, v-), applies the same north/south split it does, so a learner who
# studied that tab sees consistent notation here. Vowel-nucleus/final-consonant regional
# variation (NORTH_SOUTH_DIFFS' other rows: tones, -ây, -ê, -n, -ên, -t, -anh/-ach, -inh/-ich/
# -ênh/-êch) is real but far more syllable-specific and sub-regionally variable, so it is
# intentionally NOT modeled here at 800-word scale -- north and south differ only by the four
# initial-consonant rules above; the vowel/final reading is shared by both.
#
# Real Hangul syllable blocks are composed via the standard Unicode algorithm (0xAC00 +
# (initial*21+medial)*28+final) wherever the Vietnamese nucleus maps to a single Korean medial
# (plain vowels, and w/glide medials Korean already has: oa->wa(ㅘ), oe->wɛ(ㅙ), uê->we(ㅞ),
# uy->wi(ㅟ)); a nucleus needing an off-glide Korean has no single medial for (e.g. -ây, -oi,
# -ôi, -iu, triphthongs) is rendered as two or three consecutive syllable blocks instead,
# matching how NORTH_SOUTH_DIFFS itself writes e.g. ấy as two blocks "어이", not one.

CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']


def compose(initial, medial, final=''):
    """initial/medial/final are jamo characters (final='' for none). Returns one precomposed
    Hangul syllable character, or a plain-jamo fallback string if any jamo isn't in the tables
    (shouldn't happen given the closed vocabularies below, but never crash on it)."""
    try:
        ci, mi = CHO.index(initial), JUNG.index(medial)
        fi = JONG.index(final) if final else 0
        return chr(0xAC00 + (ci * 21 + mi) * 28 + fi)
    except ValueError:
        return (initial or '') + medial + (final or '')


# -- onset (Vietnamese syllable-initial spelling) -> Korean initial jamo, north reading --
ONSET_NORTH = {
    'b': 'ㅂ', 'c': 'ㄲ', 'k': 'ㄲ', 'q': 'ㄲ',
    'ch': 'ㅉ', 'tr': 'ㅉ',
    'd': 'ㅈ', 'gi': 'ㅈ', 'r': 'ㅈ',
    'đ': 'ㄷ',
    'g': 'ㄱ', 'gh': 'ㄱ',
    'h': 'ㅎ',
    'kh': 'ㅋ',
    'l': 'ㄹ',
    'm': 'ㅁ',
    'n': 'ㄴ',
    'ng': 'ㅇ', 'ngh': 'ㅇ',
    'nh': 'ㄴ',
    'p': 'ㅍ',
    'ph': 'ㅍ',
    's': 'ㅅ', 'x': 'ㅅ',
    't': 'ㄸ',
    'th': 'ㅌ',
    'v': 'ㅂ',
    '': '',
}
ONSET_NORTH_IPA = {
    'b': 'ɓ', 'c': 'k', 'k': 'k', 'q': 'k', 'ch': 'c', 'tr': 'c', 'd': 'z', 'gi': 'z', 'r': 'z',
    'đ': 'ɗ', 'g': 'ɣ', 'gh': 'ɣ', 'h': 'h', 'kh': 'x', 'l': 'l', 'm': 'm', 'n': 'n',
    'ng': 'ŋ', 'ngh': 'ŋ', 'nh': 'ɲ', 'p': 'p', 'ph': 'f', 's': 's', 'x': 's', 't': 't',
    'th': 'tʰ', 'v': 'v', '': '',
}
# Only these onset classes actually diverge in the south -- everything else reuses ONSET_NORTH.
# 'glide' means: drop the onset consonant entirely and turn the first medial into its Korean
# y-glide counterpart instead (야/여/유/예/요 etc.), matching da->자/야, về->베/예 in NORTH_SOUTH_DIFFS.
ONSET_SOUTH = {
    'd': ('glide', 'j'), 'gi': ('glide', 'j'), 'v': ('glide', 'j'),
    'r': ('ㄹ', 'r'),
    's': ('ㅅ', 'ʂ'),   # same Hangul as north (retroflex distinction carried by the IPA bracket only)
    'tr': ('ㅉ', 'ʈʂ'),  # same Hangul as north (retroflex distinction carried by the IPA bracket only)
}
GLIDE = {'ㅏ': 'ㅑ', 'ㅐ': 'ㅒ', 'ㅓ': 'ㅕ', 'ㅔ': 'ㅖ', 'ㅗ': 'ㅛ', 'ㅜ': 'ㅠ', 'ㅣ': 'ㅣ', 'ㅡ': 'ㅡ',
         'ㅘ': 'ㅘ', 'ㅙ': 'ㅙ', 'ㅝ': 'ㅝ', 'ㅞ': 'ㅞ', 'ㅟ': 'ㅟ'}

# -- Vietnamese vowel nucleus (tone-stripped) -> sequence of (Korean medial jamo, ipa) blocks.
# A 1-tuple composes onto the onset as a single Hangul block; a 2/3-tuple means the onset attaches
# only to the first block, and the rest are their own null-onset (ㅇ) blocks -- the coda always
# attaches to the LAST block.
NUCLEUS = {
    'a': [('ㅏ', 'a')], 'ă': [('ㅏ', 'ă')], 'â': [('ㅓ', 'ɤ̆')],
    'e': [('ㅐ', 'ɛ')], 'ê': [('ㅔ', 'e')],
    'i': [('ㅣ', 'i')], 'y': [('ㅣ', 'i')],
    'o': [('ㅗ', 'ɔ')], 'ô': [('ㅗ', 'o')], 'ơ': [('ㅓ', 'ɤ')],
    'u': [('ㅜ', 'u')], 'ư': [('ㅡ', 'ɯ')],
    'ai': [('ㅏ', 'a'), ('ㅣ', 'j')], 'ao': [('ㅏ', 'a'), ('ㅗ', 'w')], 'au': [('ㅏ', 'a'), ('ㅗ', 'w')],
    'ay': [('ㅏ', 'ă'), ('ㅣ', 'j')], 'ây': [('ㅓ', 'ɤ̆'), ('ㅣ', 'j')],
    'eo': [('ㅐ', 'ɛ'), ('ㅗ', 'w')], 'êu': [('ㅔ', 'e'), ('ㅜ', 'w')],
    'ia': [('ㅣ', 'i'), ('ㅓ', 'ə')], 'iê': [('ㅣ', 'i'), ('ㅔ', 'ə')], 'yê': [('ㅣ', 'i'), ('ㅔ', 'ə')],
    'iu': [('ㅣ', 'i'), ('ㅜ', 'w')],
    'oa': [('ㅘ', 'wa')], 'oă': [('ㅘ', 'wă')], 'oe': [('ㅙ', 'wɛ')],
    'oi': [('ㅗ', 'ɔ'), ('ㅣ', 'j')], 'ôi': [('ㅗ', 'o'), ('ㅣ', 'j')], 'ơi': [('ㅓ', 'ɤ'), ('ㅣ', 'j')],
    'oai': [('ㅘ', 'wa'), ('ㅣ', 'j')], 'oay': [('ㅘ', 'wă'), ('ㅣ', 'j')], 'oeo': [('ㅙ', 'wɛ'), ('ㅗ', 'w')],
    'ua': [('ㅜ', 'u'), ('ㅓ', 'ə')], 'uơ': [('ㅜ', 'u'), ('ㅓ', 'ə')],
    'uê': [('ㅞ', 'we')], 'ui': [('ㅜ', 'u'), ('ㅣ', 'j')], 'uy': [('ㅟ', 'wi')],
    'uya': [('ㅟ', 'wi'), ('ㅓ', 'ə')], 'uyu': [('ㅟ', 'wi'), ('ㅜ', 'w')],
    'uôi': [('ㅜ', 'u'), ('ㅗ', 'o'), ('ㅣ', 'j')], 'uây': [('ㅜ', 'u'), ('ㅓ', 'ɤ̆'), ('ㅣ', 'j')],
    'ươ': [('ㅡ', 'ɯ'), ('ㅓ', 'ə')], 'ươi': [('ㅡ', 'ɯ'), ('ㅓ', 'ə'), ('ㅣ', 'j')],
    'ươu': [('ㅡ', 'ɯ'), ('ㅓ', 'ə'), ('ㅜ', 'w')],
    'ưi': [('ㅡ', 'ɯ'), ('ㅣ', 'j')], 'ưu': [('ㅡ', 'ɯ'), ('ㅜ', 'w')],
    'iêu': [('ㅣ', 'i'), ('ㅔ', 'ə'), ('ㅜ', 'w')], 'yêu': [('ㅣ', 'i'), ('ㅔ', 'ə'), ('ㅜ', 'w')],
}

CODA_JONG = {'': '', 'c': 'ㄱ', 'ch': 'ㄱ', 'm': 'ㅁ', 'n': 'ㄴ', 'ng': 'ㅇ', 'nh': 'ㄴ', 'p': 'ㅂ', 't': 'ㅅ'}
CODA_IPA = {'': '', 'c': 'k̚', 'ch': 'k̚', 'm': 'm', 'n': 'n', 'ng': 'ŋ', 'nh': 'ɲ', 'p': 'p̚', 't': 't̚'}
CODA_KEYS_BY_LEN = sorted([k for k in CODA_JONG if k], key=len, reverse=True)

ONSETS_3 = ["ngh"]
ONSETS_2 = ["ng", "nh", "ph", "th", "tr", "ch", "kh", "gi", "qu", "gh"]
ONSETS_1 = ["b", "c", "d", "đ", "g", "h", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "x"]

TONE_STRIP = {
    'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ắ': 'ă', 'ằ': 'ă', 'ẳ': 'ă', 'ẵ': 'ă', 'ặ': 'ă',
    'ấ': 'â', 'ầ': 'â', 'ẩ': 'â', 'ẫ': 'â', 'ậ': 'â',
    'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ế': 'ê', 'ề': 'ê', 'ể': 'ê', 'ễ': 'ê', 'ệ': 'ê',
    'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ố': 'ô', 'ồ': 'ô', 'ổ': 'ô', 'ỗ': 'ô', 'ộ': 'ô',
    'ớ': 'ơ', 'ờ': 'ơ', 'ở': 'ơ', 'ỡ': 'ơ', 'ợ': 'ơ',
    'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ứ': 'ư', 'ừ': 'ư', 'ử': 'ư', 'ữ': 'ư', 'ự': 'ư',
    'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
}
VOWEL_LETTERS = set('aăâeêioôơuưy') | set(TONE_STRIP.keys())


def strip_tone(s):
    return ''.join(TONE_STRIP.get(ch, ch) for ch in s)


def _split_onset(syll):
    for group in (ONSETS_3, ONSETS_2, ONSETS_1):
        for o in group:
            if syll.startswith(o) and len(syll) > len(o) and syll[len(o)] in VOWEL_LETTERS:
                return o, syll[len(o):]
    return '', syll


def _split_coda(rime_notone):
    for c in CODA_KEYS_BY_LEN:
        if rime_notone.endswith(c) and len(rime_notone) > len(c):
            return rime_notone[:-len(c)], c
    return rime_notone, ''


def _syllable(syll, dialect):
    onset_raw, rime = _split_onset(syll.lower())
    rime_notone = strip_tone(rime)
    nucleus_key, coda = _split_coda(rime_notone)

    blocks = NUCLEUS.get(nucleus_key)
    if blocks is None:
        # Unmapped nucleus (shouldn't come up often at this corpus's vocabulary level) --
        # fall back to reading each vowel letter as its own block rather than crashing.
        blocks = [NUCLEUS.get(ch, [('ㅣ', ch)])[0] for ch in nucleus_key] or [('ㅣ', nucleus_key)]

    onset_jamo = ONSET_NORTH.get(onset_raw, '')
    onset_ipa = ONSET_NORTH_IPA.get(onset_raw, onset_raw)
    if dialect == 'south' and onset_raw in ONSET_SOUTH:
        south_jamo, south_ipa = ONSET_SOUTH[onset_raw]
        onset_ipa = south_ipa
        if south_jamo == 'glide':
            onset_jamo = 'ㅇ'
            first_medial, first_ipa = blocks[0]
            blocks = [(GLIDE.get(first_medial, first_medial), first_ipa)] + blocks[1:]
        else:
            onset_jamo = south_jamo

    coda_jong = CODA_JONG.get(coda, '')
    coda_ipa = CODA_IPA.get(coda, coda)
    if not onset_jamo:
        onset_jamo = 'ㅇ'  # Hangul composition always needs an explicit (silent) initial

    hg = ''
    ipa = onset_ipa
    for i, (medial, m_ipa) in enumerate(blocks):
        is_last = (i == len(blocks) - 1)
        initial = onset_jamo if i == 0 else 'ㅇ'
        final = coda_jong if is_last else ''
        hg += compose(initial, medial, final)
        ipa += m_ipa
    ipa += coda_ipa
    return hg, ipa


def transcribe(word, dialect):
    """Returns a NORTH_SOUTH_DIFFS-style 'Hangul[ipa]' pronunciation string for a (possibly
    multi-syllable, possibly hyphenated) Vietnamese word. dialect in ('north', 'south')."""
    hg_parts, ipa_parts = [], []
    for syll in word.strip().split():
        for sub in syll.split('-'):
            if not sub:
                continue
            hg, ipa = _syllable(sub, dialect)
            hg_parts.append(hg)
            ipa_parts.append(ipa)
    return ''.join(hg_parts) + '[' + ''.join(ipa_parts) + ']'


def ns_pair(word):
    """Returns (north_str, south_str) for a word/short phrase."""
    return transcribe(word, 'north'), transcribe(word, 'south')


if __name__ == '__main__':
    tests = ['da', 'gia', 'ra', 'sa', 'xa', 'cha', 'tra', 'về', 'Việt Nam', 'Giê-hô-va', 'Giê-su',
             'ăn', 'bốn', 'một', 'kẹt', 'ấy', 'vậy']
    for w in tests:
        n, s = ns_pair(w)
        print(f'{w:15s} north={n:20s} south={s}')
