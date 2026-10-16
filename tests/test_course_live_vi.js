const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const s=fs.readFileSync('app_logic.js','utf8');
const ctx=vm.createContext({CURR_WEEKS:[{week:1,title:{ko:'1주',vi:'Tuần 1'},items:[{text:{ko:'기존 수업',vi:'Bản dịch đã biên soạn'},link:null}]}],CURR_ASSIGNMENTS:[],
 LIVE_COURSE_I18N:JSON.parse(fs.readFileSync('regional_admin/course_live_i18n.json')),LIVE_COURSE_VI:JSON.parse(fs.readFileSync('regional_admin/course_vi.json')).jeonju,
 COURSE_READING_LANGS:['vi','cs','zh_cn','zh','en','fr','de','hu','id','ja','ko','pl'],orderAssignments:x=>x});
vm.runInContext(s.slice(s.indexOf('  var regionalLive = null;'),s.indexOf('  function regionalConfig()')),ctx);
const sources=['일반 문법 1~7번','일반 문법 197~201번','오늘의 어휘 학습 (한자음 1~34번)','오늘의 어휘 학습 (남북 단어 11~48번)',
 '오늘의 어휘 학습 (단어 597~630번) · 4주 뒤 복습','행누 1과: 성경이 당신에게 어떻게 도움이 됩니까? (읽기 연습)',
 '랑제 부록 가: 우리가 사람들에게 알려 주고 싶은 진리 (읽기 연습)','베트남어 어휘 학습 10주차 (단어 837~1077번)'];
const input={config:{},plan:null,source:{units:[{unit:1,title:{ko:'1주',en:'Week 1'},learning:[{uid:'L01-000',text:{ko:'기존 수업',en:'Existing class'}}],
 assignments:sources.map((ko,i)=>({uid:'live-'+i,day:'월',category:'preview',text:{ko,en:null},link:{tab:'curriculum',anchor:'item-'+i}}))}]}};
const output=ctx.regionalMergeLive(input).units[0];assert.equal(output.learning[0].text.vi,'Bản dịch đã biên soạn');
for(let i=0;i<sources.length;i++){const row=output.assignments[i];assert(row.text.vi&&!/[가-힣]/.test(row.text.vi),sources[i]);assert.equal(row.text.ko,sources[i]);assert.equal(row.link.anchor,'item-'+i);}
assert.equal(output.assignments[0].text.vi,'Ngữ pháp tổng quát 1–7');assert(output.assignments[4].text.vi.endsWith('ôn sau 4 tuần'));
const rules=ctx.LIVE_COURSE_I18N.map(r=>new RegExp(r[0]));assert(!rules.some(r=>r.test('일반 문법 1~7번 — 임의로 수정한 과제')),'Do not translate a partial match on a rewritten task');
console.log('Live course Vietnamese repair: new number ranges, exact reading titles, review suffixes, and source/link preservation passed.');

// A previously published admin course can keep a full 1–15 range after static data expands to 22.
const legacy={config:{},plan:null,source:{units:[{unit:2,learning:[{uid:'old-class',text:{ko:'베트남어 어휘 학습 2주차 (어순반대 1~15번)',vi:'đảo trật tự 1–15',en:'Word order 1–15'},link:{tab:'vocab',subAttr:'vocab',subVal:'orderrev',vocabRange:{start:0,end:15}}}],assignments:[{uid:'old-daily',text:{ko:'오늘의 어휘 학습 (어순반대 1~15번)'},link:{tab:'vocab',subAttr:'vocab',subVal:'orderrev',vocabRange:{start:0,end:15}}},{uid:'partial',text:{ko:'어순반대 1~5번'},link:{subVal:'orderrev',vocabRange:{start:0,end:5}}},{uid:'other',text:{ko:'한자음 1~15번'},link:{subVal:'rhyme',vocabRange:{start:0,end:15}}}]}]}};
const repaired=ctx.regionalMergeLive(legacy).units[0];
for(const x of [repaired.learning[0],repaired.assignments[0]]){assert.equal(x.link.vocabRange.end,22);assert(x.text.ko.includes('1~22'));assert(x.text.vi.includes('1–22'));}
assert.equal(repaired.learning[0].text.en,'Word order 1–22');
assert.equal(repaired.assignments[1].link.vocabRange.end,5);assert.equal(repaired.assignments[2].link.vocabRange.end,15);
assert.equal(legacy.source.units[0].learning[0].link.vocabRange.end,15,'Do not mutate the stored source');
console.log('Legacy full order-reversal scope upgraded to 22; partial scopes, other categories and stored source preserved.');
