// Alternate sung words appear separately: book matching and TTS retain the original row.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('app_logic.js','utf8');
const ctx=vm.createContext({escapeHtml:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')});
vm.runInContext(src.slice(src.indexOf('  function songSegText('),src.indexOf('  function songSegVideo('))+src.slice(src.indexOf('  function songChildrenLyricHtml('),src.indexOf('  // Adds ▶ ↻')),ctx);
const mark={text:'Lời trong sách.',vocalText:'Lời trẻ em <hát>.',vocalTextSource:'User-reviewed same recording'};
assert.match(ctx.songChildrenLyricHtml('kingdom','vi',{src:'pksjj'},mark),/\(Lời trẻ em &lt;hát&gt;\.\)/);
assert.equal(mark.text,'Lời trong sách.');
for(const [kind,lang,source,m] of [['kingdom','ko','pksjj',mark],['kingdom','vi','sjjc',mark],['original','vi','pksjj',mark],['kingdom','vi','pksjj',{...mark,vocalTextSource:''}],['kingdom','vi','pksjj',{...mark,vocalText:'LỜI TRONG SÁCH!'}]]) assert.equal(ctx.songChildrenLyricHtml(kind,lang,{src:source},m),'');
console.log('7 alternate children lyric display / provenance checks passed');
