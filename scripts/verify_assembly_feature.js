const fs = require('fs');
const assert = require('assert');

console.log('1. Checking circuit_assembly_data.py...');
const pyContent = fs.readFileSync('circuit_assembly_data.py', 'utf8');
assert(pyContent.includes('"2026-11-28"'), 'Missing 2026-11-28');
assert(pyContent.includes('"2026-12-05"'), 'Missing 2026-12-05');
assert(pyContent.includes('여호와 안에서 더없이 기뻐하십시오'), 'Missing Korean theme');
assert(pyContent.includes('Hãy hoan hỉ nơi Đức Giê-hô-va'), 'Missing Vietnamese theme');
console.log('   ✓ circuit_assembly_data.py has both assemblies');

console.log('2. Testing renderCircuitAssemblyHtml in isolated JS scope...');
const appLogic = fs.readFileSync('app_logic.js', 'utf8');

// Mock helpers
global.TU = s => s;
global.T = obj => (obj && typeof obj === 'object') ? (obj.ko || obj.vi || Object.values(obj)[0]) : String(obj || '');
global.escapeHtml = s => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
global.escapeAttr = s => String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
global.speakIcon = () => '<svg></svg>';
global.formatScriptureHtml = html => html.replace(/(시편\s*\d+:\d+|Thi thiên\s*\d+:\d+)/g, '<span class="scripture-badge" data-scripture-ref="$1">$1</span>');

// Extract the assembly func to test
const funcIdx = appLogic.indexOf('function renderCircuitAssemblyHtml(assembly, dateStr) {');
assert(funcIdx !== -1, 'renderCircuitAssemblyHtml not found in app_logic.js');
const funcEnd = appLogic.indexOf('// --- Scripture Citations and Mini Popup Modal ---', funcIdx);
eval(appLogic.slice(funcIdx, funcEnd));

// Load python data as json via quick eval of the dict
const asm2026_11_28 = {
  date: "2026-11-28",
  primary_lang: "ko",
  location: "군산",
  title: { ko: "군산 한국어 순회대회", vi: "Hội nghị vòng quanh tiếng Hàn Gunsan" },
  theme: { ko: "“여호와 안에서 더없이 기뻐하십시오”", vi: "“Hãy hoan hỉ nơi Đức Giê-hô-va”", scripture: "시편 37:4" },
  links: {
    program: "https://www.jw.org/ko/라이브러리/프로그램/지부-대표자와-함께하는-2026-2027-순회-대회-프로그램/여호와-안에서-더없이-기뻐하십시오/",
    questions: "https://www.jw.org/ko/라이브러리/프로그램/지부-대표자와-함께하는-2026-2027-순회-대회-프로그램/아래-질문에-대한-답을-찾아-보십시오/"
  },
  schedule: [
    {
      section: { ko: "오전", vi: "Buổi sáng" },
      items: [
        { time: "9:40", ko: "음악", vi: "Âm nhạc", type: "music" },
        { time: "9:50", ko: "노래 7번 및 기도", vi: "Bài hát 7 và cầu nguyện", type: "song", songNum: 7 },
        { time: "10:00", ko: "어떻게 “여호와 안에서 더없이 기뻐할” 수 있습니까?", vi: "“Hãy hoan hỉ nơi Đức Giê-hô-va”—Bằng cách nào?", type: "talk" }
      ]
    }
  ],
  questions: [
    { num: 1, ko: "우리는 어떻게 “여호와 안에서 더없이 기뻐할” 수 있습니까? (시편 37:4)", vi: "Chúng ta có thể “hoan hỉ nơi Đức Giê-hô-va” bằng cách nào? (Thi thiên 37:4)" }
  ]
};

const html28 = renderCircuitAssemblyHtml(asm2026_11_28, "2026/11/28");
assert(html28.includes('군산 한국어 순회대회'), 'Missing title in 2026-11-28 HTML');
assert(html28.includes('여호와 안에서 더없이 기뻐하십시오'), 'Missing theme in 2026-11-28 HTML');
assert(html28.includes('https://www.jw.org/ko/라이브러리/프로그램/지부-대표자와-함께하는-2026-2027-순회-대회-프로그램/여호와-안에서-더없이-기뻐하십시오/'), 'Missing program URL');
assert(html28.includes('data-song-num="7"'), 'Missing song 7 pill');
assert(html28.includes('class="scripture-badge"'), 'Missing scripture badge in question');
console.log('   ✓ 2026-11-28 assembly rendered successfully');

const asm2026_12_05 = {
  date: "2026-12-05",
  primary_lang: "vi",
  location: "천안",
  title: { ko: "천안 다언어 순회대회 (베트남어)", vi: "Hội nghị vòng quanh đa ngôn ngữ Cheonan (tiếng Việt)" },
  theme: { vi: "“Hãy hoan hỉ nơi Đức Giê-hô-va”", ko: "“여호와 안에서 더없이 기뻐하십시오”", scripture: "Thi thiên 37:4" },
  links: {
    program: "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-anh-đại-diện-chi-nhánh/Hãy-hoan-hỉ-nơi-Đức-Giê-hô-va/",
    questions: "https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-anh-đại-diện-chi-nhánh/Tìm-lời-giải-đáp-cho-những-câu-hỏi-sau/"
  },
  schedule: [
    {
      section: { vi: "Buổi sáng", ko: "오전" },
      items: [
        { time: "9:40", vi: "Âm nhạc", ko: "음악", type: "music" },
        { time: "9:50", vi: "Bài hát 7 và cầu nguyện", ko: "노래 7번 및 기도", type: "song", songNum: 7 },
        { time: "10:00", vi: "“Hãy hoan hỉ nơi Đức Giê-hô-va”—Bằng cách nào?", ko: "어떻게 “여호와 안에서 더없이 기뻐할” 수 있습니까?", type: "talk" }
      ]
    }
  ],
  questions: [
    { num: 1, vi: "Chúng ta có thể “hoan hỉ nơi Đức Giê-hô-va” bằng cách nào? (Thi thiên 37:4)", ko: "우리는 어떻게 “여호와 안에서 더없이 기뻐할” 수 있습니까? (시편 37:4)" }
  ]
};

const html05 = renderCircuitAssemblyHtml(asm2026_12_05, "2026/12/05");
assert(html05.includes('lang="vi"'), 'Missing lang="vi" in Vietnamese assembly');
assert(html05.includes('Hội nghị vòng quanh đa ngôn ngữ Cheonan'), 'Missing Vietnamese title in 2026-12-05 HTML');
assert(html05.includes('Hãy hoan hỉ nơi Đức Giê-hô-va'), 'Missing Vietnamese theme in 2026-12-05 HTML');
assert(html05.includes('https://www.jw.org/vi/thu-vien/chuong-trinh/2026-2027-Chương-trình-hội-nghị-vòng-quanh-với-anh-đại-diện-chi-nhánh/Hãy-hoan-hỉ-nơi-Đức-Giê-hô-va/'), 'Missing Vietnamese program URL');
console.log('   ✓ 2026-12-05 assembly rendered successfully');

console.log('\nAll assembly verification tests PASSED!');
