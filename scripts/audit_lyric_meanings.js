// Run from repository root after build_app.py --profile jeonju. Mirrors the popup's longest-word selection.
const fs=require('fs'),vm=require('vm');const s=fs.readFileSync('app_logic.js','utf8'),c=vm.createContext({koreanNotationRegion:'hanoi'});
let data = fs.readFileSync('data_block.jeonju.js','utf8');
if (process.argv.includes('--without-supplement')) data = data.replace(/^const LYRIC_MEANINGS_KO = .*;\n/m, '');
vm.runInContext(data,c);
vm.runInContext(s.slice(s.indexOf('  /* HANOI-KO-BEGIN */'),s.indexOf('  /* HANOI-KO-END */')),c);
vm.runInContext(s.slice(s.indexOf('  var lyricWordDict = null'),s.indexOf('  // The tapped word of a lyric element')),c);
vm.runInContext(`var dictionary=lyricWordDictionary();var lyricLines=[];SONGS_DATA.forEach(s=>s.lines.forEach(l=>{if(l.vi)lyricLines.push({song:'kingdom-'+s.number,text:l.vi});}));[ORIGINAL_SONGS,CHILDREN_SONGS].forEach(a=>a.forEach(s=>{let d=s.languages?.vi;if(d?.available){let lines=d.lines||d.sections.flatMap(x=>x.lines);lines.forEach(text=>lyricLines.push({song:s.id,text}));}}));`,c);
const missing={},all=new Set();let hits=0,blank=0;
for(const line of c.lyricLines){const text=line.text;if(/^\s*\([^()]*\)\s*$/.test(text))continue;const toks=[...text.matchAll(/[\p{L}\p{M}]+(?:[-'’][\p{L}\p{M}]+)*/gu)].map(m=>({s:m.index,e:m.index+m[0].length,t:m[0]}));
for(let hit=0;hit<toks.length;hit++){let word=toks[hit].t;outer:for(let n=3;n>=2;n--)for(let a=Math.max(0,hit-n+1);a<=hit&&a+n<=toks.length;a++){let b=a+n-1;if(toks.slice(a,b+1).reduce((n,t)=>n+t.t.split('-').length,0)>3)continue;let valid=true;for(let k=a;k<b;k++)if(!/^\s+$/.test(text.slice(toks[k].e,toks[k+1].s)))valid=false;let key=c.lyricWordKey(text.slice(toks[a].s,toks[b].e));if(valid&&(c.dictionary.meaning[key]||c.dictionary.pron[key])){word=key;break outer;}}
const k=c.lyricWordKey(word);all.add(k);hits++;if(!c.dictionary.meaning[k]){blank++;missing[k]??={word:k,count:0,examples:[]};missing[k].count++;if(missing[k].examples.length<2)missing[k].examples.push(line);}}
}
const rows=Object.values(missing).sort((a,b)=>b.count-a.count);
console.log(JSON.stringify({lines:c.lyricLines.length,unique:all.size,hits,blank,missing:rows.map(({word,count})=>({word,count}))},null,2));
