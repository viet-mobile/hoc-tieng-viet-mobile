const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('app_logic.js','utf8');
const player = source.slice(source.indexOf('  var songSeg ='),source.indexOf('  // Adds ▶ ↻'));
function setup({range=[0,100],syncMetadata=true}={}) {
 let now=0,next=0;const tasks=new Map(),events={},log=[];
 const audio={paused:true,readyState:0,seeking:false,ended:false,currentTime:0,
  seekable:{length:1,start:()=>range[0],end:()=>range[1]},
  addEventListener:(name,fn)=>{(events[name] ||= new Set()).add(fn);},removeEventListener:(name,fn)=>events[name]?.delete(fn),
  load(){log.push('load');if(syncMetadata){this.readyState=1;emit('loadedmetadata');}},
  pause(){this.paused=true;log.push('pause');},play(){this.paused=false;log.push(['play',this.currentTime]);return Promise.resolve();}};
 let position=0;
 Object.defineProperty(audio,'currentTime',{get:()=>position,set:value=>{position=value;log.push(['seek',value]);}});
 function emit(name){log.push(name);for(const callback of [...(events[name]||[])])callback();}
 function setTimer(fn,delay){const id=++next;tasks.set(id,{fn,due:now+delay});return id;}
 function tick(ms){now+=ms;for(const [id,t] of [...tasks])if(t.due<=now){tasks.delete(id);t.fn();}}
 const context=vm.createContext({Audio:function(){return audio;},SONG_SEG_PRE_MS:0,SONG_SEG_SEEK_TOL_MS:100,SONG_SEG_GAP_MS:250,songSegInfo:{test:{src:'sjjc',mediaKey:'pub-sjjc_1_AUDIO',url:'https://cfp2.jw-cdn.org/test.mp3',marks:[{s:10000,e:13000,m:0},{s:20000,e:23000,m:1}]}},speechDebugOn:false,stopAllSpeech(){},ensurePlaybackSession(){},TU:x=>x,setTimeout:setTimer,clearTimeout:id=>tasks.delete(id),requestAnimationFrame:fn=>setTimer(fn,16),cancelAnimationFrame:id=>tasks.delete(id)});
 vm.runInContext(player,context);
 const button=(i=0,loop=false)=>({isConnected:true,getAttribute:key=>({'data-seg':loop?'loop':'play','data-seg-id':'test','data-seg-i':String(i)})[key],setAttribute(){},closest:()=>null,classList:{toggle(){}}});
 return {context,audio,emit,log,tick,button,events};
}
let checks=0;
(async()=>{
 let s=setup();s.context.songSegPlay(s.button());assert.equal(s.log.filter(x=>Array.isArray(x)&&x[0]==='play').length,0);s.emit('seeked');await Promise.resolve();assert.deepEqual(s.log.filter(Array.isArray),[['seek',10],['play',10]]);checks++;
 s.context.songSegPlay(s.button(1));s.emit('seeked');assert.equal(s.log.filter(x=>x==='load').length,1);assert.equal(s.audio.currentTime,20);checks++;
 s=setup();s.context.songSegPlay(s.button());s.tick(2000);assert.ok(!s.log.some(x=>Array.isArray(x)&&x[0]==='play'));assert.equal(s.context.songSeg.btn,null);checks++;
 s=setup({range:[15,100]});s.context.songSegPlay(s.button());for(let i=0;i<11;i++)s.tick(1000);assert.ok(!s.log.some(Array.isArray));checks++;
 s=setup({range:[0,12]});s.context.songSegPlay(s.button());for(let i=0;i<11;i++)s.tick(1000);assert.ok(!s.log.some(Array.isArray));checks++;
 s=setup();s.context.songSegPlay(s.button());s.audio.currentTime=0;s.emit('seeked');s.audio.currentTime=0;s.emit('seeked');assert.ok(!s.log.some(x=>Array.isArray(x)&&x[0]==='play'));checks++;
 s=setup({syncMetadata:false});s.context.songSegPlay(s.button());s.context.songSegPlay(s.button(1));assert.equal(s.log.filter(x=>x==='load').length,1);s.audio.readyState=1;s.emit('loadedmetadata');s.emit('seeked');assert.deepEqual(s.log.filter(Array.isArray),[['seek',20],['play',20]]);checks++;
 s=setup();s.context.songSegPlay(s.button());s.context.songSegStop();s.emit('seeked');assert.ok(!s.log.some(x=>Array.isArray(x)&&x[0]==='play'));assert.equal(s.events.seeked.size,0);checks++;
 s=setup();const b=s.button(0,true);s.context.songSegPlay(b);s.emit('seeked');await Promise.resolve();s.audio.currentTime=13;s.tick(16);s.tick(250);assert.equal(s.log.filter(x=>Array.isArray(x)&&x[0]==='play').length,1);s.emit('seeked');assert.equal(s.log.filter(x=>Array.isArray(x)&&x[0]==='play').length,2);s.context.songSegPlay(b);assert.equal(s.context.songSeg.btn,null);checks++;
 console.log(`${checks} segment seek lifecycle checks passed`);
})().catch(error=>{console.error(error);process.exitCode=1;});
