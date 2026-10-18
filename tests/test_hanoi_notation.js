// The Korean notation closest to the Hanoi pronunciation (app_logic.js, hanoiKoreanSyllable / hanoiKoreanWord) follows the [발음][자모] chart
// (pronunciation_data.HANOI_CHART). Runs without a browser: the converter block is cut out of app_logic.js between its markers.
const fs = require('fs'), path = require('path'), assert = require('assert');
const src = fs.readFileSync(path.resolve(__dirname, '..', 'app_logic.js'), 'utf8');
const block = src.slice(src.indexOf('/* HANOI-KO-BEGIN */'), src.indexOf('/* HANOI-KO-END */'));
assert(block.length > 500, 'converter block found');
const {w, s} = new Function(block + ';return {w:hanoiKoreanWord,s:hanoiKoreanSyllable};')();
const rules = {
  // the chart's own examples that follow its rules (final -nh = 인ㅇ, -c / -ng after o, ô, u = ㅂ / ㅁ tails: the updated chart)
  'Tháp Canh': '탑 까인ㅇ', 'Nhân Chứng': '년 쯩', 'Đức Giê-hô-va': '득 제호ㅸㅏ', 'Kinh Thánh': '낀ㅇ 타인ㅇ', 'hội thánh': '호이 타인ㅇ', 'nhóm họp': '뇸 홉',
  'bài hát': '바이 핫', 'cầu nguyện': '꺼우 응우옌', 'tiếng Việt': '띠엥 ㅸㅣ엣', 'học hỏi': '혹ㅂ 호이', 'chúng ta': '쭝ㅁ 따', 'anh chị': '아인ㅇ 찌',
  'quan trọng': '꽌 쫑ㅁ', 'tin mừng': '띤 믕', 'Nước Trời': '느억 쩌이', 'Đức Chúa Trời': '득 쭈어 쩌이', 'bạn của ngài': '반 꾸어 응아이',
  'người Hàn': '응어이 한', 'thần khí thánh': '턴 키 타인ㅇ', 'không': '컴',
  // uy = ㅟ, uyê = ㅜ예, yê = ㅖ (the chart, 2026-10-18)
  'huy': '휘', 'quy': '뀌', 'nguy': '응위', 'tuy': '뛰', 'uy': '위', 'yêu': '예우', 'yên': '옌', 'yết': '옛', 'tuyệt': '뚜옛', 'quyền': '뀌에 ㄴ'.replace(' ㄴ', 'ㄴ'),
  // uô = ㅜ오 (not ㅜ어): -uôn = 우온, Hanoi
  'nguồn': '응우온', 'muốn': '무온', 'luôn': '루온', 'muôn': '무온', 'buồn': '부온', 'uốn': '우온', 'ôn': '온', 'cuộc': '꾸옥ㅂ', 'uống': '우옹ㅁ', 'suối': '수오이', 'tuổi': '뚜오이',
  // oa = ㅘ
  'ngoan': '응완', 'hoa': '화', 'toán': '똰', 'loài': '롸이',
  // s- = ㅅ (x- stays ㅆ), Hanoi and Saigon
  'ánh sáng': '아인ㅇ 상', 'sao': '사오', 'xin': '씬',
  'nguyện': '응우옌', 'khuyên': '쿠옌', 'chuyện': '쭈옌'
};
// 'quyền' = qu + yê + n: ㄲ+ㅟ then ㅖ? -> the qu block takes the first vowel of the nucleus, which is ㅖ alone (no merge) -> 꾸 + 옌
for (const [vi, ko] of Object.entries(rules)) {
  if (vi === 'quyền') continue;
  assert.strictEqual(w(vi), ko, vi + ' -> ' + w(vi) + ' (want ' + ko + ')');
}
assert.strictEqual(w('quyền'), '꾸옌', 'quyền');
assert.strictEqual(w('sáng', 'saigon'), '상', 'Saigon s- = ㅅ');
assert.strictEqual(w('sao', 'saigon'), '사오');
assert.strictEqual(w('hoa', 'saigon'), '화', 'Saigon oa = ㅘ');
for (const word of ['nguồn', 'muốn', 'luôn', 'muôn', 'buồn', 'uốn', 'ôn', 'khuôn', 'tuôn']) assert.strictEqual(w(word, 'saigon'), w(word, 'hanoi'), 'Saigon -ôn is 온 as in Hanoi: ' + word);
assert.strictEqual(w('nguồn', 'saigon'), '응우온', 'nguồn');
assert.strictEqual(w('ngoan', 'saigon'), '응왕ㄴ', 'Saigon oa = ㅘ (final -n is ㅇㄴ there)');
assert.strictEqual(w('xin', 'saigon'), '씽ㄴ', 'Saigon x- = ㅆ (final -n is ㅇㄴ there)');
assert.strictEqual(s('xyz'), '', 'not a Vietnamese syllable');
// the meanings set for lyric words
const m = /var LYRIC_WORD_MEANINGS = \{([\s\S]*?)\n  \};/.exec(src);
assert(m, 'LYRIC_WORD_MEANINGS found');
const table = new Function('return {' + m[1] + '}')();
assert.strictEqual(Object.keys(table).length, 80, 'all 80 words');
assert.strictEqual(table['phán quyết'], '판결');
assert.strictEqual(table['phán'], '(높은 분이) 말씀하시다');
assert.strictEqual(table['làn gió'], '돌풍');
assert.strictEqual(table['quy'], '(공이나 영광을 -에게) 돌리다');
assert.strictEqual(table['giê-ru-sa-lem'], '예루살렘');
assert.strictEqual(table['cố'], '애쓰다');
assert.strictEqual(table['rõ'], '명확하다');
assert.strictEqual(table['ngài'], '당신(2인칭 존칭), 그분(3인칭 존칭)');
assert.strictEqual(table['chúng con'], '저희들');
assert.strictEqual(table['ta'], '나');
assert.strictEqual(table['tuyệt vời'], '훌륭한, 대단히');
assert(table['thỏa tâm'] && table['thỏa nguyện'] && !table['thoả tâm']);
assert.strictEqual(table['cố gắng'], '노력하다');
assert(table['mối'].endsWith('종별사(種別詞)'));
// hoà / hòa, thoả / thỏa: one key
const keyFn = new Function(src.slice(src.indexOf('var LYRIC_TONE_MOVE'), src.indexOf('function lyricWordMeaning')) + ';return lyricWordKey;')();
assert.strictEqual(keyFn('Thoả Nguyện'), keyFn('thỏa nguyện'));
assert.strictEqual(keyFn('khiêm hoà'), keyFn('Khiêm Hòa'));
assert.strictEqual(keyFn('thuý'), keyFn('thúy'));
assert.notStrictEqual(keyFn('hoa'), keyFn('hòa'));
console.log('hanoi notation: ' + Object.keys(rules).length + ' words, 80 lyric meanings checked');
