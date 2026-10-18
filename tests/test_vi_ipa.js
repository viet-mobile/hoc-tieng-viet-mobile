// IPA of the lyric word popup (app_logic.js, viIpaSyllable / viIpaWord): Hanoi and Saigon. Runs without a browser.
const fs = require('fs'), path = require('path'), assert = require('assert');
const src = fs.readFileSync(path.resolve(__dirname, '..', 'app_logic.js'), 'utf8');
const cut = (a, b) => src.slice(src.indexOf(a), src.indexOf(b));
const {w, s} = new Function(cut('/* HANOI-KO-BEGIN */', '/* HANOI-KO-END */') + cut('/* VI-IPA-BEGIN */', '/* VI-IPA-END */') + ';return {w:viIpaWord,s:viIpaSyllable};')();
const hanoi = {
  'nguồn': 'ŋuən˨˩', 'ngài': 'ŋaːj˨˩', 'Chúa': 'cuə˧˥', 'tình': 'tiɲ˨˩', 'sách': 'sɛc̚˧˥', 'không': 'xoŋ͡m˧', 'muốn': 'muən˧˥', 'cầu nguyện': 'kə̆w˨˩ ŋwiən˨ˀ˩',
  'Đức': 'ɗɨk̚˧˥', 'yêu thương': 'ʔiəw˧ tʰɨəŋ˧', 'quyền năng': 'kwiən˨˩ năŋ˧', 'uống': 'ʔuəŋ͡m˧˥', 'Giê-hô-va': 'ze˧ ho˧ vaː˧', 'đời': 'ɗəːj˨˩', 'hỏi': 'hɔj˧˩˧', 'ngã': 'ŋaː˧ˀ˥', 'học': 'hɔk͡p̚˨ˀ˩'
};
const saigon = { 'nguồn': 'ŋuəŋ˨˩', 'Chúa': 'cuə˦˥', 'tình': 'tin˨˩', 'sách': 'ʂaːt̚˦˥', 'muốn': 'muəŋ˦˥', 'Giê-hô-va': 'je˧ ho˧ jaː˧', 'hỏi': 'hɔj˨˩˦', 'ngã': 'ŋaː˨˩˦', 'trời': 'ʈəːj˨˩', 'rao': 'raːw˧' };
for (const [vi, ipa] of Object.entries(hanoi)) assert.strictEqual(w(vi, 'hanoi'), ipa, 'Hanoi ' + vi + ' -> ' + w(vi, 'hanoi'));
for (const [vi, ipa] of Object.entries(saigon)) assert.strictEqual(w(vi, 'saigon'), ipa, 'Saigon ' + vi + ' -> ' + w(vi, 'saigon'));
assert.strictEqual(s('xyz', 'hanoi'), '', 'not a Vietnamese syllable');
assert.strictEqual(w('abc xyz', 'hanoi'), '', 'a word with a non-syllable gives nothing');
console.log('vi ipa: ' + Object.keys(hanoi).length + ' Hanoi + ' + Object.keys(saigon).length + ' Saigon words checked');
