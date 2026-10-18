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
  vm.runInContext(logic.slice(logic.indexOf('  // Meanings set for lyric words'), logic.indexOf('  // The tapped word of a lyric element')), context);
  const dict = vm.runInContext('lyricWordDictionary()', context);
  dict.context = context;
  dict.key = vm.runInContext('lyricWordKey', context);   // headwords are looked up by key (tone mark of oa / oe / uy on the first vowel)
  return dict;
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
  assert.equal(after.meaning[after.key(entry.vi)], before.meaning[before.key(entry.vi)] || entry.ko);
}
for (const badSpelling of ['noài','caol','nơời','fphans']) assert(!after.meaning[badSpelling]);
// The approved word list (lyric_meanings_approved_ko.json, approved by the user 2026-10-18) replaces the dictionary supplement; the meanings the
// user entered by hand (LYRIC_WORD_KO_MEANINGS, LYRIC_WORD_MEANINGS) come after it.
const approved = JSON.parse(fs.readFileSync('lyric_meanings_approved_ko.json', 'utf8'));
const typed = vm.runInContext('(function(){var o={};[LYRIC_WORD_KO_MEANINGS, LYRIC_WORD_MEANINGS].forEach(function(m){Object.keys(m).forEach(function(k){o[lyricWordKey(k)]=m[k];});});return o;})()', after.context);
for (const entry of approved.entries) {
  const key = after.key(entry.vi);
  assert.equal(after.meaning[key], typed[key] || entry.ko, 'Approved meaning: ' + entry.vi);
}
assert.equal(approved.entries.length, 963);
assert.equal(after.meaning['mãi'],'계속, 영원히');
assert.equal(after.meaning['lệ'],'눈물, 규칙');
assert.equal(after.meaning['reo'],'환호하다(reo hò)');
assert.equal(after.meaning['dần'],'점점(dần dần)');
console.log(`Lyric dictionary: ${supplement.entries.length} sourced entries; ${Object.keys(before.meaning).length} existing meanings preserved.`);
