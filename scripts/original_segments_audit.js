// Uses the application's timing functions, not a second implementation of its rules.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const source = fs.readFileSync(path.join(ROOT,'app_logic.js'),'utf8');
function between(a,b) { return source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a))); }
const ctx = vm.createContext({});
ctx.ORIGINAL_SEGMENT_MANUAL = fs.existsSync(path.join(ROOT,'scripts/data/original_segment_manual.json')) ? read('scripts/data/original_segment_manual.json') : {};
ctx.ORIGINAL_SEGMENT_CUE_BINDINGS = read('scripts/data/original_segment_cue_bindings.json');
const paragraphs=fs.existsSync(path.join(ROOT,'scripts/data/original_segment_paragraphs.json')) ? read('scripts/data/original_segment_paragraphs.json') : {};
vm.runInContext(between('  var SONG_SEG_API =','  var songSegInfo =') +
  between('  function songSegVttCues(', '  function songSegCuesOf(') +
  between('  function songSegCuesAgree(', '  // Vietnamese source-backed') +
  between('  var SONG_SEG_ALIGN_TOL =','  // Adds ▶'),ctx);
const codes = {vi:'VT',ko:'KO',en:'E',zh:'CH',zh_cn:'CHS',ja:'J',de:'X',fr:'F',pl:'P',cs:'B',hu:'H',id:'IN'};
function songs() {
 const imported=read('jw_songs_i18n.json').songs;
 return read('jw_original_songs_ko_vi.json').songs.map(s=>{
  const languages={};
  for(const lang of ['vi','ko']) {const d=s[lang]; if(d && d.available!==false) languages[lang]=(d.displayLines||d.lines||[]).filter(ctx.songSegSingable);}
  for(const [lang,d] of Object.entries(imported[s.id]||{})) if(!(lang in languages)&&!['vi','ko'].includes(lang)&&d.available) languages[lang]=d.sections.flatMap(x=>x.lines).filter(ctx.songSegSingable);
  return {...s,languages};
 });
}
function audit() {
 const audio=read('jw_extraction/other_media_cache.json'), video=read('jw_extraction/video_cues_cache.json');
 const result=[], copies=read('song_timing_copy.json');
 for(const song of songs()) {
  const infos={};
  for(const [lang,rows] of Object.entries(song.languages)) {
   if(!rows.length) continue;
   const code=codes[lang], d=audio[`osg:${song.track}:${code}`];
   const file=d?.files?.[code]?.MP3?.find(f=>f.pub==='osg'&&f.track===song.track);
   const mk=file?.markers?.markers, parsed=mk?.length?ctx.songSegMarks(mk,true):{marks:null,reason:'no markers'};
   const v=video[`pub-osg_${song.track}_VIDEO|${code}`];
   const proof=paragraphs[`${song.id}|${lang}`];
   const meta=file?.markers;
   const bound=proof&&proof.checksum===file?.file?.checksum&&proof.markerHash===meta?.hash&&proof.documentId===meta?.documentId&&meta.mepsLanguageSpoken===code&&meta.mepsLanguageWritten===code&&JSON.stringify(proof.signature)===JSON.stringify((mk||[]).map(m=>[m.startTime,m.duration,m.mepsParagraphId]));
   const info={...parsed,src:'osg',url:file?.file?.url,mp3Url:file?.file?.url,mediaKey:`pub-osg_${song.track}_AUDIO`,duration:file?.duration,mp3Duration:file?.duration,checksum:file?.file?.checksum,paragraphs:bound?proof.paragraphs:null,
    video:v?.media?{...v,key:`pub-osg_${song.track}_VIDEO`,cues:ctx.songSegVttCues(v.vtt||'')}:null};
   infos[lang]=ctx.songSegPickTiming(info,rows,'original',song.id,lang);
  }
  for(const [lang,info] of Object.entries(infos)) {
   const rows=song.languages[lang],ref=lang==='vi'?'ko':'vi';let picked=info;
   const copy=copies[`original|${song.id}|${lang}`];
   if(copy && infos[ref]) picked=ctx.songSegCopyTiming(picked,infos[ref],rows.length,song.languages[ref].length,copy);
   if(info.marks && info.marks.length!==rows.length && infos[ref]&&!infos[ref].timing) {
    const al=ctx.songSegAlignByParagraph(infos[ref],song.languages[ref].length,info,rows.length);if(al) picked={...info,marks:al.marks,alignedBy:'paragraph-id'};
   }
   const marks=picked.marks?.length===rows.length?picked.marks:rows.map(()=>null);
   const disabled=rows.flatMap((text,i)=>!marks[i]||marks[i].long?[{line:i+1,text,reason:marks[i]?.long?'interlude_or_outro':picked.reason==='no markers'?'official_timing_unavailable':picked.reason||'line_count_or_alignment',s:marks[i]?.s,e:marks[i]?.e}]:[]);
   const intervals=new Map();marks.forEach((m,i)=>{if(m&&!m.long){const key=`${m.url||picked.url}|${m.s}|${m.e}`,entry=intervals.get(key)||{s:m.s,e:m.e,lines:[]};entry.lines.push(i+1);intervals.set(key,entry);}});
   const shared=Array.from(intervals.values()).filter(g=>g.lines.length>1);
   result.push({song:song.id,lang,rows:rows.length,buttons:rows.length-disabled.length,timing:picked.timing||picked.alignedBy||'mp3-markers',mediaKey:picked.mediaKey,checksum:picked.checksum,shared,disabled});
  }
 }
 return result;
}
if(require.main===module){const report=audit();const dest=process.argv[2];if(dest)fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pairs:report.length,complete:report.filter(r=>r.buttons===r.rows).length,partial:report.filter(r=>r.buttons&&r.buttons<r.rows).length,none:report.filter(r=>!r.buttons).length}));for(const r of report.filter(r=>['vi','ko'].includes(r.lang)&&r.buttons<r.rows))console.log(r.song,r.lang,`${r.buttons}/${r.rows}`,r.disabled.map(d=>d.line+':'+d.reason).join(','));}
module.exports={ctx,songs,audit,codes,ROOT,read};
