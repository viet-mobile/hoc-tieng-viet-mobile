const fs = require('fs');
const appLogic = fs.readFileSync('app_logic.js', 'utf8');
const cited = JSON.parse(fs.readFileSync('bible_cited_verses.json', 'utf8'));

global.BIBLE_CITED_VERSES = cited;
global.escapeHtml = s => String(s || "");
global.escapeAttr = s => String(s || "");

const idx1 = appLogic.indexOf('var cachedBibleCitationRegex = null;');
const idx2 = appLogic.indexOf('var SCRIPTURE_STD_LANGS = [');
eval(appLogic.slice(idx1, idx2));

const tests = [
  '잠언 16:20',
  '우리는 어떻게 “마음을 다해 여호와를 신뢰”한다는 것을 나타낼 수 있습니까? (잠언 3:5, 6)',
  '우리는 어떻게 바락, 수넴 여자, 다니엘, 하나냐, 미사엘, 아사랴를 본받을 수 있습니까? (누가 16:10; 시편 50:15; 119:112)',
  '우리와 배경이나 생각이 아주 다른 사람들과 어떻게 대화를 시작할 수 있습니까? (고린도 전서 9:19-23)',
  '왜 여호와의 지혜를 신뢰할 수 있습니까? (잠언 3:13, 18; 16:3; 22:6; 고린도 전서 10:13)',
  '왜 여호와를 언제나 신뢰해야 합니까? (잠언 16:20)',
  'Châm ngôn 16:20',
  'Làm thế nào để cho thấy mình hết lòng tin cậy Đức Giê-hô-va? (Châm ngôn 3:5, 6)',
  'Chúng ta có thể noi gương Ba-rác, người đàn bà Su-nem, Đa-ni-ên, Ha-na-nia, Mi-sa-ên và A-xa-ria như thế nào? (Lu-ca 16:10; Thi thiên 50:15; 119:112)',
  'Làm sao để bắt đầu cuộc trò chuyện với những người có gốc gác hay lối suy nghĩ rất khác với chúng ta? (1 Cô-rinh-tô 9:19-23)',
  'Tại sao có thể tin cậy nơi sự khôn ngoan của Đức Giê-hô-va? (Châm ngôn 3:13, 18; 16:3; 22:6; 1 Cô-rinh-tô 10:13)',
  'Tại sao chúng ta nên luôn tin cậy Đức Giê-hô-va? (Châm ngôn 16:20)'
];

tests.forEach(t => {
  const formatted = formatScriptureHtml(t);
  console.log('---');
  console.log('Orig:', t);
  console.log('Form:', formatted);
  const matches = [...formatted.matchAll(/data-scripture-ref="([^"]+)"/g)].map(m => m[1]);
  matches.forEach(ref => {
    const parsed = parseScriptureRef(ref);
    console.log('   ref:', ref, '-> parsed:', parsed);
    if (parsed) {
      const vKey = `${parsed.book}_${parsed.chapter}_${parsed.verses[0]}`;
      console.log('      has in json:', !!cited.verses[vKey]);
    }
  });
});
