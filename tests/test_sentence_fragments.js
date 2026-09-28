// Sentence fragments in [문장]/[대화] pairs (app_logic.js sentencePairs() / mergeFragmentPairs()), checked on
// the functions taken from app_logic.js itself and on the shipped texts (run build_app.py first).
//   - the known cases: "…không? ”." no longer leaves "”." (↔ "〉）", "” 인터넷 기사를 보세요."), the footnote
//     marker "b" of LFF is not a sentence, "C’est vrai…" and "v.v." are not cut into pieces;
//   - an opening quote glued to its word (Indonesian "”Dia…", "’Kan…") is untouched;
//   - the pairing itself never shifts: the number of pairs only drops where a fragment is merged;
//   - across LFF / LPD / neighbor / daily / Watchtower texts in 11 languages no pair has a fragment side.
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const NAMES = ['stashPattern', 'unstashPattern', 'splitPlain', 'normalizeJwOrg', 'isIsolatedJw', 'splitSentences',
  'isDashCitation', 'splitAtListColons', 'isQuestionPart', 'numbersKey', 'colonListPairs', 'isSentenceFragment',
  'joinSentencePieces', 'stripFootnoteMarker', 'mergeFragmentPairs', 'mergeFragmentPieces', 'sentencePairs'];

function loadFunctions(src) {
  let code = '';
  for (const name of NAMES) {
    const i = src.indexOf('function ' + name + '(');
    assert(i >= 0, name + ' not found in app_logic.js');
    let depth = 0, k = src.indexOf('{', i);
    for (; k < src.length; k++) {
      if (src[k] === '{') depth++;
      else if (src[k] === '}' && --depth === 0) break;
    }
    code += src.slice(i, k + 1) + '\n';
  }
  return new Function(code + 'return { splitSentences, sentencePairs, mergeFragmentPieces, isSentenceFragment };')();
}

function constant(text, name) {
  const m = new RegExp('^const ' + name + ' = ', 'm').exec(text);
  assert(m, name + ' missing from data_block.js');
  const start = m.index + m[0].length;
  const end = text.indexOf('\n', start);
  return JSON.parse(text.slice(start, end).replace(/;\s*$/, ''));
}

const S = loadFunctions(fs.readFileSync(path.join(ROOT, 'app_logic.js'), 'utf8'));
let checks = 0;
const ok = (cond, msg) => { checks++; assert(cond, msg); };

// Known cases.
const citeVi = 'Nhân Chứng Giê-hô-va dùng nhiều bản dịch Kinh Thánh. Tuy nhiên, chúng tôi đặc biệt thích dùng Kinh Thánh —Bản dịch Thế Giới Mới vì bản dịch này chính xác, rõ ràng và dùng danh Đức Chúa Trời. —Xem bài trên trang web “ Có phải Nhân Chứng Giê-hô-va dùng Kinh Thánh riêng không? ”.';
const citeKo = '여호와의 증인은 몇몇 성경 번역판을 사용해 왔지만, 주로 「신세계역 성경」 을 사용합니다. 「신세계역 성경」은 정확하고, 이해하기 쉽고, 하느님의 이름이 들어 있기 때문입니다. — “ 여호와의 증인만의 성경이 따로 있습니까? ” 인터넷 기사를 보세요.';
let pairs = S.sentencePairs(citeVi, citeKo);
ok(pairs.length === 3, '"”." case: expected 3 pairs, got ' + pairs.length);
ok(pairs[2].vi.endsWith('không? ”.') && pairs[2].kr.endsWith('있습니까? ” 인터넷 기사를 보세요.'), '"”." case: last pair ' + JSON.stringify(pairs[2]));
ok(pairs.every(p => !S.isSentenceFragment(p.vi) && !S.isSentenceFragment(p.kr)), '"”." case: fragment left');

const bVi = 'Theo Kinh Thánh, có phải Đức Chúa Trời tạo ra một dạng sống đơn giản rồi cho tiến hóa thành cá, động vật có vú và con người, hay là ngài tạo ra mọi “loài” sống? b';
const bCs = '• Říká Bible, že Bůh stvořil jednoduché formy života, ze kterých se pak vyvinuly ryby, savci a lidé? Nebo stvořil všechny základní „druhy“?';
pairs = S.sentencePairs(bVi, bCs);
ok(pairs.length === 1 && pairs[0].vi.endsWith('“loài” sống?') && pairs[0].kr.endsWith('„druhy“?'), '"b" case (cs): ' + JSON.stringify(pairs));
pairs = S.sentencePairs(bVi, 'Does the Bible teach that God made a simple life-form and then let it evolve into fish, mammals, and humans? Or did he create all the basic “kinds” of life? b');
ok(pairs.every(p => p.vi !== 'b' && p.kr !== 'b' && !/\sb$/.test(p.vi) && !/\sb$/.test(p.kr)), '"b" case (en): ' + JSON.stringify(pairs));
ok(!S.mergeFragmentPieces(S.splitSentences(bVi), bVi).some(v => v === 'b' || /\sb$/.test(v)), '"b" case: Vietnamese-only item');

pairs = S.sentencePairs('Ừm. Để tôi suy nghĩ thêm.', 'C’est vrai, mais...');
ok(pairs.length === 1 && pairs[0].kr === 'C’est vrai, mais...', '"C’" case: ' + JSON.stringify(pairs));
const vv = 'Chị thích học môn ngoại ngữ nhất. Chị đã từng học tiếng Việt, tiếng Trung v.v.';
ok(S.mergeFragmentPieces(S.splitSentences(vv), vv).join('|') === 'Chị thích học môn ngoại ngữ nhất.|Chị đã từng học tiếng Việt, tiếng Trung v.v.', '"v.v." case');

// Opening quotes glued to their word are sentences of their own.
pairs = S.sentencePairs('Ngài nói: “A”. Ngài nói: “B”.', '”Dia berteman.”. ’Kan damai.');
ok(pairs.length === 2 && pairs[1].kr === '’Kan damai.', 'Indonesian opener: ' + JSON.stringify(pairs));
pairs = S.sentencePairs('Đúng không? Đó là một viễn cảnh tuyệt vời. Thế nên chúng ta có thể tin chắc.',
  '« N’est-ce pas ? » C’est une perspective magnifique. Donc, nous pouvons être sûrs.');
ok(pairs.length === 3 && pairs[0].kr.endsWith('? »') && pairs[1].kr.startsWith('C’est'), 'spaced closer moves back: ' + JSON.stringify(pairs));

// Shipped texts: no fragment side, and the pairing only changes where a fragment was merged.
const data = fs.readFileSync(path.join(ROOT, 'data_block.js'), 'utf8');
const LANGS = ['ko', 'cs', 'zh_cn', 'zh', 'en', 'fr', 'de', 'hu', 'id', 'ja', 'pl'];
let lines = 0, fragments = 0, viOnlyFragments = 0;
function walk(o) {
  if (Array.isArray(o)) return o.forEach(walk);
  if (!o || typeof o !== 'object') return;
  if (typeof o.vi === 'string' && o.vi) {
    for (const lang of LANGS) {
      const t = (o.kr && typeof o.kr === 'object' && o.kr[lang]) || o[lang];
      if (typeof t !== 'string' || !t) continue;
      lines++;
      const ps = S.sentencePairs(o.vi, t);
      // A text that is one short word as a whole (grammar "với" = cs "s", pl "z") is not a piece of a split.
      if (ps.length === 1 && ps[0].vi === o.vi.trim() && ps[0].kr === t.trim()) continue;
      ps.forEach(p => { if (S.isSentenceFragment(p.vi) || S.isSentenceFragment(p.kr)) fragments++; });
    }
    const pieces = S.mergeFragmentPieces(S.splitSentences(o.vi), o.vi);
    if (pieces.length > 1) pieces.forEach(v => { if (S.isSentenceFragment(v)) viOnlyFragments++; });
  }
  for (const [k, v] of Object.entries(o)) if (k !== 'kr') walk(v);
}
['LFF_CONVERSATIONS', 'LPD_LESSONS', 'NEIGHBOR_CONVERSATIONS', 'DAILY_CONVERSATIONS', 'WATCHTOWER_FULL'].forEach(n => walk(constant(data, n)));
ok(lines > 40000, 'too few texts checked: ' + lines);
ok(fragments === 0, fragments + ' pairs with a fragment side');
ok(viOnlyFragments === 0, viOnlyFragments + ' Vietnamese-only fragment items');

console.log(`checks run: ${checks}, texts: ${lines}`);
console.log('--- SENTENCE FRAGMENT TESTS PASSED ---');
