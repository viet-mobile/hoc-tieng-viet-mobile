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
