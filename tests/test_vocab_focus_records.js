const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('app_logic.js','utf8'),ctx=vm.createContext({});
vm.runInContext(fs.readFileSync('data_block.jeonju.js','utf8'),ctx);
vm.runInContext(`var currentLang='ko',vocabFocus={mode:'rhyme',start:0,end:34};function reviewMeaning(m){return typeof m==='string'?m:m&&m.ko;}function rwExampleKrHtml(k,m){return m;}`,ctx);
vm.runInContext(src.slice(src.indexOf('    function krGlossWithHanja('),src.indexOf('    var POOL_BUILDERS =')),ctx);
let pool=vm.runInContext('vocabScopedPool()',ctx);
assert.equal(pool.length,34);assert.equal(new Set(pool.map(x=>x.vi)).size,31);
for(const word of ['gia','đại','đầu']){const homophones=pool.filter(x=>x.vi===word);assert.equal(homophones.length,2);assert.equal(new Set(homophones.map(x=>x.kr)).size,2);}
// Category selection normalizes the strings, then deduplicates again; identities must survive both steps.
const mapping=src.slice(src.indexOf('      studyState.pool = dedupeByVi('),src.indexOf('      studyState.score =',src.indexOf('      studyState.pool = dedupeByVi(')));
ctx.studyState={};ctx.poolOverride=pool;ctx.stripReviewListMarker=x=>x;vm.runInContext(mapping,ctx);assert.equal(ctx.studyState.pool.length,34);
assert.equal(vm.runInContext(`dedupeByVi([{vi:'gia',kr:'집'},{vi:'gia',kr:'집'}]).length`,ctx),1,'Unscoped review still merges repeated headwords');
const total=vm.runInContext('RHYME_GROUPS.flatMap(g=>g.families.flatMap(f=>f.words)).length',ctx);
for(let start=0;start<total;start+=34){ctx.vocabFocus={mode:'rhyme',start,end:Math.min(start+34,total)};assert.equal(vm.runInContext('vocabScopedPool().length',ctx),Math.min(34,total-start));}
console.log('Scoped review preserves all assigned records, homophone meanings/examples, and category normalization; ordinary review deduplication unchanged.');
