const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const {ctx,songs,read,audit}=require('../scripts/original_segments_audit');
const mark=(s,d,pid)=>({startTime:`00:00:${s.toFixed(3).padStart(6,'0')}`,duration:`00:00:${d.toFixed(3).padStart(6,'0')}`,mepsParagraphId:pid});
// OSG's serialized paragraph order is not chronology. Preserve original API indices.
const ordered=ctx.songSegMarks([mark(12,2,10),mark(2,2,4),mark(5,2,5)],true);
assert.deepEqual(Array.from(ordered.marks,m=>[m.s,m.m]),[[2000,1],[5000,2],[12000,0]]);
assert.equal(ctx.songSegMarks([mark(12,2,10),mark(2,2,4)]).marks,null);
assert.equal(ctx.songSegMarks([mark(2,-1,4)],true).marks,null);
// WebVTT permits both timestamp formats and cue settings.
const vtt='WEBVTT\n\n00:09.525 --> 00:18.350 align:center\nA\n\n00:01:20.000 --> 00:01:24.123\nB\n';
assert.deepEqual(Array.from(ctx.songSegVttCues(vtt),c=>[c.s,c.e]),[[9525,18350],[80000,84123]]);
assert.equal(ctx.songSegVttCues('WEBVTT\n\n00:10.000 --> 00:09.000\nA').length,0);
const cues=[{s:1000,e:2000,lines:['Alpha']},{s:3000,e:4000,lines:['Beta']}];
const sparse=ctx.songSegAlignCues(['Alpha','Unrecorded','Beta'],cues,true);
assert.equal(sparse.marks[1],null);assert.equal(sparse.marks[2].s,3000);
assert.equal(ctx.songSegAlignCues(['Unrelated'],cues,true),null);
// Re-segmentation uses actual own paragraph spans; it never evenly splits a marker.
const own={url:'own.mp3',marks:[{s:1000,e:3000,m:7,pid:4}],paragraphs:{4:'Alpha Beta'}};
const grouped=ctx.songSegOwnParagraphTiming(own,['Alpha','Beta']);
assert.equal(grouped.marks[0].s,1000);assert.equal(grouped.marks[1].e,3000);assert.equal(grouped.marks[1].group,2);
// A reliable MP3 line keeps priority; a long/outro line alone uses its own video cue.
const info={url:'own.mp3',marks:[{s:1000,e:2000,m:0},{s:3000,e:25000,m:1,long:22}],paragraphs:{},video:{url:'own.mp4',cues}};
const mixed=ctx.songSegPickTiming(info,['Alpha','Beta']);
assert.equal(mixed.marks[0].url,undefined);assert.equal(mixed.marks[1].url,'own.mp4');assert.equal(mixed.marks[1].e,4000);
const copy={from:'vi',preferOwnMarkers:true};
const target={url:'ko.mp3',duration:10,marks:[{s:1100,e:2100,m:0},null],video:{url:'ko.mp4',duration:10}};
const reference={marks:[{s:1000,e:2000,m:0},{s:3000,e:4000,m:1,timingSource:'video-cues'}]};
const copied=ctx.songSegCopyTiming(target,reference,2,2,copy);
assert.equal(copied.marks[0].s,1100);assert.equal(copied.marks[1].url,'ko.mp4');assert.equal(copied.marks[1].copiedFrom,'vi');
assert.equal(ctx.songSegCopyTiming({...target,video:{url:'ko.mp4',duration:2}},reference,2,2,copy).marks[1],null);
assert.equal(ctx.songSegCopyTiming(target,reference,2,3,copy),target);
// User times require both recording checksum and the exact lyric occurrence.
ctx.ORIGINAL_SEGMENT_MANUAL['fixture|vi']={mediaKey:'fixture',checksum:'a',lines:[{text:'Alpha',occurrence:2,s:2000,e:3000}]};
const base={mediaKey:'fixture',checksum:'a',duration:5,marks:[null,null]};
assert.equal(ctx.songSegApplyOriginalManual(base,['Alpha','Alpha'],'fixture','vi').marks[0],null);
assert.equal(ctx.songSegApplyOriginalManual(base,['Alpha','Alpha'],'fixture','vi').marks[1].s,2000);
assert.equal(ctx.songSegApplyOriginalManual({...base,checksum:'b'},['Alpha','Alpha'],'fixture','vi').marks[1],null);
const valid={...base,marks:[null,{s:2200,e:3200}]};
assert.equal(ctx.songSegApplyOriginalManual(valid,['Alpha','Alpha'],'fixture','vi').marks[1].s,2200);
const data=songs();
assert.equal(data.find(s=>s.track===9).languages.ko[0],'1.세상 어딜 둘러보아도');
for(const [n,count] of [[31,27],[32,29],[34,20],[39,40]]){
 const s=data.find(s=>s.track===n);assert.equal(s.languages.vi.length,count);assert.equal(s.languages.ko.length,count);
}
assert.equal(data.find(s=>s.track===38).languages.vi.length,26);
const copies=read('song_timing_copy.json');assert.ok(!Object.keys(copies).some(k=>k.startsWith('original|osg-24|')));
if(['other_media_cache.json','video_cues_cache.json'].every(p=>fs.existsSync(path.join(__dirname,'../jw_extraction',p)))){
 const audited=audit(), vi36=audited.find(r=>r.song==='osg-36'&&r.lang==='vi');
 assert.equal(vi36.buttons,59);assert.deepEqual(vi36.disabled.map(d=>d.line),[54]);
 for(const n of [9,13,16,17,18,19,24,27,28,30,31,33,35,37,39,40,41]){
  const row=audited.find(r=>r.song===`osg-${n}`&&r.lang==='ko');assert.equal(row.buttons,row.rows,`Korean ${n}`);
 }
} else {
 console.log('Cached metadata integration assertions skipped; refresh other_media_cache/video_cues_cache to run them.');
}
console.log('Original song repair checks passed (chronology, VTT, paragraph matching, priority, recording identity, duration, user data).');
