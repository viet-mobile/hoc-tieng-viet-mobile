const fs = require('fs');
const assert = require('assert');

// 1. Check data_block.js
console.log('1. Checking data_block.js...');
const dataBlockContent = fs.readFileSync('data_block.js', 'utf8');
assert(dataBlockContent.includes('const BIBLE_CITED_VERSES ='), 'BIBLE_CITED_VERSES missing in data_block.js');
console.log('   ✓ BIBLE_CITED_VERSES present in data_block.js');

// 2. Load bible_cited_verses.json directly to check data integrity
console.log('2. Checking bible_cited_verses.json content...');
const bibleData = JSON.parse(fs.readFileSync('bible_cited_verses.json', 'utf8'));
assert(bibleData.langs.length === 12, 'Must have 12 languages');
assert(bibleData.verses['19:37:29'], 'Psalm 37:29 must be present');
assert(bibleData.verses['19:37:29'].vi.includes('Người công chính sẽ hưởng trái đất'), 'Vietnamese Psalm 37:29 translation mismatch');
assert(bibleData.verses['19:37:29'].ko.includes('의로운 자들은 땅을 차지하고'), 'Korean Psalm 37:29 translation mismatch');
console.log('   ✓ All 12 languages present, Psalm 37:29 verified');

// 3. Test formatScriptureHtml and parseScriptureRef from app_logic.js
console.log('3. Testing logic functions...');
const appLogic = fs.readFileSync('app_logic.js', 'utf8');
assert(appLogic.includes('function formatScriptureHtml('), 'formatScriptureHtml missing');
assert(appLogic.includes('function openScripturePopup('), 'openScripturePopup missing');
assert(appLogic.includes('function parseScriptureRef('), 'parseScriptureRef missing');
assert(appLogic.includes('SCRIPTURE_STD_LANGS = ['), 'SCRIPTURE_STD_LANGS missing');
assert(appLogic.includes('isLyricOrScripture'), 'isLyricOrScripture missing in click handler');
console.log('   ✓ Key functions present in app_logic.js');

// Mock window and environment to test parser & formatter
global.BIBLE_CITED_VERSES = bibleData;
global.escapeHtml = s => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
global.escapeAttr = s => String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Extract the scripture funcs to test in isolation
const evalScope = {};
const funcCode = appLogic.slice(
  appLogic.indexOf('// --- Scripture Citations and Mini Popup Modal ---'),
  appLogic.indexOf('// What a badge is for')
);
eval(funcCode);

// Test formatScriptureHtml
const testViText = 'Đức Giê-hô-va (Thi thiên 37:29) và (Châm ngôn 3:5, 6) nói về điều này.';
const formattedVi = formatScriptureHtml(testViText);
assert(formattedVi.includes('class="scripture-badge" data-scripture-ref="Thi thiên 37:29"'), 'Failed to badge Thi thiên 37:29');
assert(formattedVi.includes('class="scripture-badge" data-scripture-ref="Châm ngôn 3:5, 6"'), 'Failed to badge Châm ngôn 3:5, 6');
console.log('   ✓ formatScriptureHtml successfully badged Vietnamese citations:');
console.log('     ', formattedVi);

const testKoText = '의로운 자들은 땅을 차지하고 (시편 37:29) 거기서 영원히 살 것이다.';
const formattedKo = formatScriptureHtml(testKoText);
assert(formattedKo.includes('class="scripture-badge" data-scripture-ref="시편 37:29"'), 'Failed to badge 시편 37:29');
console.log('   ✓ formatScriptureHtml successfully badged Korean citations:');
console.log('     ', formattedKo);

// Test parseScriptureRef
const parsedVi = parseScriptureRef('Thi thiên 37:29');
assert.strictEqual(parsedVi.book, 19);
assert.strictEqual(parsedVi.chapter, 37);
assert.deepStrictEqual(parsedVi.verses, [29]);
console.log('   ✓ parseScriptureRef correctly parsed Thi thiên 37:29 ->', parsedVi);

const parsedKo = parseScriptureRef('시편 37:29');
assert.strictEqual(parsedKo.book, 19);
assert.strictEqual(parsedKo.chapter, 37);
assert.deepStrictEqual(parsedKo.verses, [29]);
console.log('   ✓ parseScriptureRef correctly parsed 시편 37:29 ->', parsedKo);

const parsedMultiple = parseScriptureRef('1 Ti-mô-thê 4:13-16');
assert.strictEqual(parsedMultiple.book, 54);
assert.strictEqual(parsedMultiple.chapter, 4);
assert.deepStrictEqual(parsedMultiple.verses, [13, 14, 15, 16]);
console.log('   ✓ parseScriptureRef correctly parsed 1 Ti-mô-thê 4:13-16 ->', parsedMultiple);

console.log('\nAll scripture feature tests PASSED successfully!');
