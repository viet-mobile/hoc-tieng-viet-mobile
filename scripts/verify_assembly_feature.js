const fs = require('fs');
const assert = require('assert');
const { execSync } = require('child_process');

console.log('1. Exporting CIRCUIT_ASSEMBLIES from circuit_assembly_data.py to JSON...');
const jsonStr = execSync('python -c "import json, circuit_assembly_data; print(json.dumps(circuit_assembly_data.CIRCUIT_ASSEMBLIES, ensure_ascii=False))"').toString();
const assemblies = JSON.parse(jsonStr);

assert(assemblies["2026-11-28"], 'Missing 2026-11-28 assembly');
assert(assemblies["2026-12-05"], 'Missing 2026-12-05 assembly');

console.log('2. Checking 2026-11-28 Gunsan Circuit Overseer Assembly...');
const gunsan = assemblies["2026-11-28"];
assert.strictEqual(gunsan.location, '군산');
assert.strictEqual(gunsan.theme.ko, '“여호와를 신뢰하는 자는 행복합니다”');
assert.strictEqual(gunsan.theme.scripture, '잠언 16:20');
assert(gunsan.links.program.includes('여호와를-신뢰하는-자는-행복합니다'));
assert(gunsan.links.questions.includes('아래-질문에-대한-답을-찾아-보십시오'));
assert.strictEqual(gunsan.questions.length, 5);
console.log('   ✓ Gunsan data verified (theme, links, 5 questions)');

console.log('3. Checking 2026-12-05 Cheonan Bilingual Circuit Assembly...');
const cheonan = assemblies["2026-12-05"];
assert.strictEqual(cheonan.location, '천안');
assert.strictEqual(cheonan.theme.vi, '“Hãy hoan hỉ nơi Đức Giê-hô-va”');
assert.strictEqual(cheonan.theme.ko, '“여호와 안에서 더없이 기뻐하십시오”');
assert(cheonan.links.program_vi && cheonan.links.program_vi.includes('Hãy-hoan-hỉ-nơi-Đức-Giê-hô-va'));
assert(cheonan.links.questions_vi && cheonan.links.questions_vi.includes('Tìm-lời-giải-đáp-cho-những-câu-hỏi-sau'));
assert(cheonan.links.program_ko && cheonan.links.program_ko.includes('여호와-안에서-더없이-기뻐하십시오'));
assert(cheonan.links.questions_ko && cheonan.links.questions_ko.includes('아래-질문에-대한-답을-찾아-보십시오'));
assert.strictEqual(cheonan.questions.length, 6);
console.log('   ✓ Cheonan data verified (VI/KO theme, dual links, 6 questions)');

console.log('4. Testing renderCircuitAssemblyHtml in app_logic.js...');
const appLogic = fs.readFileSync('app_logic.js', 'utf8');
const cited = JSON.parse(fs.readFileSync('bible_cited_verses.json', 'utf8'));

global.BIBLE_CITED_VERSES = cited;
global.TU = s => s;
global.T = obj => (obj && typeof obj === 'object') ? (obj.ko || obj.vi || Object.values(obj)[0]) : String(obj || '');
global.escapeHtml = s => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
global.escapeAttr = s => String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
global.speakIcon = () => '<svg></svg>';

// Extract renderCircuitAssemblyHtml & scripture helpers
const fIdx = appLogic.indexOf('function renderCircuitAssemblyHtml(assembly, dateStr) {');
const fEnd = appLogic.indexOf('var SCRIPTURE_STD_LANGS = [', fIdx);
eval(appLogic.slice(fIdx, fEnd));

const gunsanHtml = renderCircuitAssemblyHtml(gunsan, "2026/11/28");
assert(gunsanHtml.includes('군산 한국어 순회대회'), 'Missing Gunsan title in HTML');
assert(gunsanHtml.includes('여호와를 신뢰하는 자는 행복합니다'), 'Missing Gunsan theme in HTML');
assert(gunsanHtml.includes('data-scripture-ref="잠언 16:20"'), 'Missing 잠언 16:20 badge');
assert(gunsanHtml.includes('data-song-num="31"'), 'Missing song 31 pill');
assert(gunsanHtml.includes('data-song-num="54"'), 'Missing song 54 pill');
assert(gunsanHtml.includes('data-scripture-ref="고린도 전서 9:19-23"'), 'Missing 고전 9:19-23 badge');
console.log('   ✓ Gunsan assembly rendered correctly');

const cheonanHtml = renderCircuitAssemblyHtml(cheonan, "2026/12/05");
assert(cheonanHtml.includes('Hội nghị vòng quanh đa ngôn ngữ Cheonan'), 'Missing Cheonan VI title in HTML');
assert(cheonanHtml.includes('Hãy hoan hỉ nơi Đức Giê-hô-va'), 'Missing Cheonan VI theme');
assert(cheonanHtml.includes('여호와 안에서 더없이 기뻐하십시오'), 'Missing Cheonan KO subtheme');
assert(cheonanHtml.includes('(VI) ↗'), 'Missing VI link badge');
assert(cheonanHtml.includes('(KO) ↗'), 'Missing KO link badge');
assert(cheonanHtml.includes('data-scripture-ref="Thi thiên 37:4"'), 'Missing Thi thiên 37:4 badge');
assert(cheonanHtml.includes('data-scripture-ref="시편 37:4"'), 'Missing 시편 37:4 badge in KO sub');
console.log('   ✓ Cheonan assembly rendered correctly with bilingual text and dual links');

console.log('\nAll assembly verification tests PASSED successfully!');
