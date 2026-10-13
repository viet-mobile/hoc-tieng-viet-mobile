const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('app_logic.js','utf8');
const data=JSON.parse(fs.readFileSync('regional_admin/teaching_guide.json','utf8')).jeonju;
const guide={instructors:data.instructors,structure:data.classStructure,units:Object.fromEntries(data.units.map(u=>[String(u.unit),{plan:u.timePlan.map(p=>[p[0],p[1],p[2],p[4],data.viText[p[0].replace(/ \(이어서\)$/,'')],p[5]])}]))};
const ctx=vm.createContext({window:{},currentLang:'ko',JEONJU_TEACHING_GUIDE:guide,
 escapeHtml:t=>String(t),escapeAttr:t=>String(t),
 COURSE_VOCAB:{stream:[['hanja',0,146],['reverse',0,15],['same',0,9]],cats:{hanja:{ko:'한자음',vi:'Hán Việt'},reverse:{ko:'어순반대',vi:'đảo trật tự'},same:{ko:'동일음',vi:'đồng âm'}},dayText:{ko:'{c} {a}–{b}',vi:'{c} {a}–{b}'}}});
ctx.TU=()=>ctx.currentLang==='vi'?'Mở':'바로가기';ctx.currLinkBtn=l=>'<button>'+JSON.stringify(l)+'</button>';ctx.coursePlanLocalButton=()=>'<button>바로가기</button>';
ctx.T=o=>o[ctx.currentLang]||o.en||o.ko;
vm.runInContext(source.slice(source.indexOf('  function wtDaySplit('),source.indexOf('  window.__wtDaySplit')),ctx);
vm.runInContext(source.slice(source.indexOf('  var COURSE_VOCAB_ON ='),source.indexOf('  var courseVocabCache =')),ctx);
vm.runInContext(source.slice(source.indexOf('  var COURSE_PLAN_LABELS ='),source.indexOf('  function courseGuideHtml(')),ctx);
ctx.courseVocabPlan=()=>({cls:{1:[0,170]}});ctx.wtWeekRange=()=>({start:245,end:295});
for(const lang of ['ko','vi']){
 ctx.currentLang=lang;const html=ctx.courseClassPlanHtml(guide.units['1'],{sched:{},week:1});
 assert.equal((html.match(/\(34(?:개| từ)\)/g)||[]).length,5);
 assert.equal((html.match(/\(10(?:개| từ)\)/g)||[]).length,5);
 assert.equal((html.match(/data-plan-kind="course-vocab"/g)||[]).length,5);
 assert.equal((html.match(/data-plan-kind="watchtower-vocab"/g)||[]).length,5);
 assert(html.includes('137–146')&&html.includes('1–15')&&html.includes('1–9'),'Final part preserves all three vocabulary categories');
 if(lang==='vi')assert(!/[가-힣]/.test(html));
}
ctx.wtWeekRange=()=>({start:245,end:296});
const odd=ctx.courseClassPlanHtml(guide.units['1'],{sched:{},week:1});
assert.equal((odd.match(/\(11 từ\)/g)||[]).length,1);assert.equal((odd.match(/\(10 từ\)/g)||[]).length,4);
assert.deepEqual(Array.from(ctx.splitVocabRange([0,170],5),r=>Array.from(r)),[[0,34],[34,68],[68,102],[102,136],[136,170]]);
console.log('Timetable uses the exact homework splitters: 34×5, 10×5, category boundaries, and uneven Watchtower collections verified.');
