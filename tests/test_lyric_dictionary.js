// Build first: python3 build_app.py --profile jeonju
const assert = require('assert/strict');
const fs = require('fs'), vm = require('vm');
const data = fs.readFileSync('data_block.jeonju.js', 'utf8');
const logic = fs.readFileSync('app_logic.js', 'utf8');
const supplement = JSON.parse(fs.readFileSync('lyric_meanings_ko.json', 'utf8'));
function dictionary(withSupplement) {
  const context = vm.createContext({koreanNotationRegion:'hanoi'});
  vm.runInContext(withSupplement ? data : data.replace(/^const LYRIC_MEANINGS_KO = .*;\n/m, ''), context);
  vm.runInContext(logic.slice(logic.indexOf('  /* HANOI-KO-BEGIN */'), logic.indexOf('  /* HANOI-KO-END */')), context);
  vm.runInContext(logic.slice(logic.indexOf('  var lyricWordDict = null'), logic.indexOf('  // The tapped word of a lyric element')), context);
  return vm.runInContext('lyricWordDictionary()', context);
}
const before = dictionary(false), after = dictionary(true);
for (const [word, meaning] of Object.entries(before.meaning)) assert.equal(after.meaning[word], meaning, 'Existing meaning preserved: '+word);
assert.equal(JSON.stringify(after.pron), JSON.stringify(before.pron), 'Meanings do not alter pronunciation');
const seen = new Set();
for (const entry of supplement.entries) {
  assert.equal(entry.vi, entry.vi.normalize('NFC').toLowerCase().trim());
  assert(!seen.has(entry.vi), 'Unique headword: '+entry.vi); seen.add(entry.vi);
  assert(entry.ko && entry.ko.length <= 40);
  assert.match(entry.source, /^https:\/\/dict\.naver\.com\/vikodict\/#\/entry\/(?:viko|kovi)\/[a-f0-9]+$/);
  assert.equal(after.meaning[entry.vi], before.meaning[entry.vi] || entry.ko);
}
for (const badSpelling of ['noài','caol','nơời','fphans']) assert(!after.meaning[badSpelling]);
assert.equal(after.meaning['mãi'],'계속');
assert.equal(after.meaning['lệ'],'눈물');
assert.equal(after.meaning['reo'],'환호하다, 울리다');
assert.equal(after.meaning['dần'],'점차, 서서히');
console.log(`Lyric dictionary: ${supplement.entries.length} sourced entries; ${Object.keys(before.meaning).length} existing meanings preserved.`);
