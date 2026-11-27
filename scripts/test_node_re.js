const path = require('path');
const BIBLE_CITED_VERSES = require(path.join(__dirname, '../bible_cited_verses.json'));

const ONE_CHAPTER_BOOKS = [31, 57, 63, 64, 65];

function parseScriptureRef(refStr) {
  if (!refStr || typeof refStr !== 'string') return null;
  const s = refStr.trim().replace(/^[\(\[\{\s“"'\.,—]+|[\)\]\}\s“"'\.,—]+$/g, '');
  const m = s.match(/^([123]\s+[^\d:]+|[^\d:]+)\s+(\d+)(?:\s*:\s*(.*))?$/);
  if (!m) return null;
  const bNameRaw = m[1].trim();
  const chNum = parseInt(m[2], 10);
  const vPart = m[3] ? m[3].trim() : '';
  
  const aliases = BIBLE_CITED_VERSES.aliases || {};
  let bNum = aliases[bNameRaw.toLowerCase()];
  if (!bNum) {
    bNum = aliases[bNameRaw.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim()];
  }
  if (!bNum) return null;

  let chapter = chNum;
  let verses = [];
  if (ONE_CHAPTER_BOOKS.indexOf(bNum) >= 0 && !vPart) {
    chapter = 1;
    verses = [chNum];
  } else if (vPart) {
    const parts = vPart.split(/[,;、]/);
    parts.forEach(p => {
      p = p.trim();
      if (!p) return;
      const mRange = p.match(/^(\d+)\s*[-–~]\s*(\d+)$/);
      if (mRange) {
        const start = parseInt(mRange[1], 10), end = parseInt(mRange[2], 10);
        if (start <= end && end - start <= 50) {
          for (let v = start; v <= end; v++) verses.push(v);
        }
      } else {
        const mSingle = p.match(/^(\d+)/);
        if (mSingle) verses.push(parseInt(mSingle[1], 10));
      }
    });
    verses = Array.from(new Set(verses)).sort((a, b) => a - b);
  } else {
    verses = [1];
  }

  return {
    book: bNum,
    chapter: chapter,
    verses: verses,
    raw: refStr
  };
}

const samples = [
  "Thi thiên 37:29",
  "시편 37:29",
  "LU 8:18",
  "1 Ti-mô-thê 4:13-16",
  "Áp-đia 15",
  "Châm ngôn 3:5, 6"
];

for (const s of samples) {
  const p = parseScriptureRef(s);
  console.log(s, '->', p);
  // test verse fetching
  const viBook = BIBLE_CITED_VERSES.books['vi'][String(p.book)];
  const koBook = BIBLE_CITED_VERSES.books['ko'][String(p.book)];
  console.log('  Names:', viBook, '/', koBook);
  for (const v of p.verses) {
    const key = `${p.book}:${p.chapter}:${v}`;
    const vData = BIBLE_CITED_VERSES.verses[key];
    console.log(`  v${v} [vi]:`, vData ? vData.vi : '(not in cache)');
    console.log(`  v${v} [ko]:`, vData ? vData.ko : '(not in cache)');
  }
}
