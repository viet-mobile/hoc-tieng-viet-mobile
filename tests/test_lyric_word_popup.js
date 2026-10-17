// [노래] lyric words (Korean UI only): tapping a syllable of a Vietnamese lyric line shows a small popup with the Hanoi Korean notation
// (rules of the [발음][자모] chart; the chart's own examples win for their exact words) and, below it, the meaning of the 1-3 syllable word.
// Run build_app.py / assemble_app.py first (--profile jeonju).
const {spawn} = require('child_process');
const path = require('path'), fs = require('fs'), http = require('http');
const PLATFORM = require('./helpers/platform');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8794;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const failures = []; let checks = 0;
const ok = (c, m) => { checks++; if (!c) failures.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b));
(async () => {
  const server = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(ROOT, 'dist', u); if (f.endsWith('/')) f += 'index.html';
    fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, {'content-type': {'.html': 'text/html;charset=utf-8', '.js': 'text/javascript', '.json': 'application/json'}[path.extname(f)] || 'application/octet-stream'}); r.end(d); } }); }).listen(PORT);
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'lyricpop-' + process.pid)], {stdio: 'ignore'});
  try {
    let targets; for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl); await cdp.connect();
    await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    const errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push((e.exceptionDetails.exception || {}).description || e.exceptionDetails.text));
    const E = async expr => { const r = await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true, userGesture: true}); if (r.exceptionDetails) throw new Error(((r.exceptionDetails.exception || {}).description) || r.exceptionDetails.text); return r.result.value; };
    await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html`});
    for (let i = 0; i < 240; i++) { if (await E("document.readyState==='complete'&&typeof window.setLang==='function'&&!!window.__hanoiKo")) break; await sleep(250); }
    await sleep(600);
    // ---- the chart's rules (examples that follow them exactly) ----
    const rules = await E(`(()=>{const w=window.__hanoiKo.word;return ['Tháp Canh','Nhân Chứng','Đức Giê-hô-va','Kinh Thánh','hội thánh','nhóm họp','bài hát','cầu nguyện','tiếng Việt','học hỏi','chúng ta','anh chị','quan trọng','tin mừng','Nước Trời','Đức Chúa Trời','bạn của ngài','người Hàn','thần khí thánh','không'].map(x=>w(x));})()`);
    eq(rules, ['탑 까인ㅇ', '년 쯩', '득 제호ㅸㅏ', '낀ㅇ 타인ㅇ', '호이 타인ㅇ', '뇸 홉', '바이 핫', '꺼우 응우옌', '띠엥 ㅸㅣ엣', '혹ㅂ 호이', '쭝ㅁ 따', '아인ㅇ 찌', '꽌 쫑ㅁ', '띤 믕', '느억 쩌이', '득 쭈어 쩌이', '반 꾸어 응아이', '응어이 한', '턴 키 타인ㅇ', '컴'], 'chart rules');
    // ---- a lyric line in the page ----
    await E(`(()=>{const d=document.createElement('div');d.id='lyr';d.className='lyric-vi vn';d.lang='vi';d.style.cssText='position:fixed;left:20px;top:200px;font-size:22px;white-space:nowrap;background:#fff;z-index:1';d.textContent='Đọc sách, Kinh Thánh và Giê-hô-va, xin cầu nguyện';document.body.appendChild(d);})()`);
    const tap = async word => E(`(async()=>{const el=document.getElementById('lyr'),tn=el.firstChild,i=tn.data.indexOf(${JSON.stringify(word)});const r=document.createRange();r.setStart(tn,i);r.setEnd(tn,i+${JSON.stringify(word)}.length);const b=r.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:b.left+b.width/2,clientY:b.top+b.height/2}));
      const p=document.querySelector('.lyric-word-pop');return p?{ko:p.querySelector('.lyric-word-ko').textContent,mean:(p.querySelector('.lyric-word-mean')||{}).textContent||'',n:document.querySelectorAll('.lyric-word-pop').length,top:p.getBoundingClientRect().top,bottom:p.getBoundingClientRect().bottom}:null;})()`);
    await E("window.setLang('ko')"); await sleep(200);
    let r = await tap('Kinh');
    ok(r && r.ko === '낀ㅇ 타인ㅇ' && r.mean && r.n === 1, 'Kinh -> the 2-syllable word Kinh Thánh: ' + JSON.stringify(r));
    r = await tap('Thánh'); ok(r && r.ko === '낀ㅇ 타인ㅇ' && r.n === 1, 'tapping the second syllable gives the same word, one popup: ' + JSON.stringify(r));
    r = await tap('sách'); ok(r && r.ko === '독ㅂ 사익', 'updated lip closure and preserved sách exception: ' + JSON.stringify(r));
    r = await tap('Giê-hô-va'); ok(r && r.ko === '제호ㅸㅏ' && /여호와/.test(r.mean), 'hyphenated name: ' + JSON.stringify(r));
    r = await tap('xin'); ok(r && r.ko === '씬', 'one syllable: ' + JSON.stringify(r));
    ok(r && r.top >= 0 && r.bottom <= await E('window.innerHeight'), 'popup inside the viewport');
    await E(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`);
    ok(await E("!document.querySelector('.lyric-word-pop')"), 'Escape closes the popup');
    await tap('xin'); await E(`document.body.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:5,clientY:5}))`);
    ok(await E("!document.querySelector('.lyric-word-pop')"), 'a tap elsewhere closes the popup');
    // a tap on blank space beside the text does nothing
    ok(await E(`(()=>{const el=document.getElementById('lyr'),b=el.getBoundingClientRect();el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:b.right+40,clientY:b.top+5}));return !document.querySelector('.lyric-word-pop');})()`), 'blank space gives no popup');
    // other UI languages: no popup
    await E("window.setLang('en')"); await sleep(200);
    ok((await tap('Kinh')) === null, 'English UI: no popup');
    await E("window.setLang('ko')"); await sleep(200);
    // Requested song-context overrides, with complete punctuation and longer-word priority.
    const overrides = {"hãy": "-하라", "luôn": "항상", "ân huệ": "은혜(恩惠)", "cho": "-에게", "bao": "얼마나; 불특정다수의", "thờ": "숭배하다", "vậy": "그러므로", "ta": "나", "giao": "사귈 교(交)", "ngài": "당신(2, 3인칭 존칭), -님", "náu": "피하다", "cầu": "구하다, 간구하다, 청하다; 다리", "điều": "것", "đã": "과거 시제를 나타내는 조동사", "ban": "주시다, 베푸시다", "cúi": "몸을 굽히다", "tha": "용서하다, 사하다", "vô tình": "무심코", "xưng tội": "죄를 고백하다", "nhớ": "기억하다", "chi": "무엇, -한 것", "khó khăn": "어려운", "lìa": "버리고 떠나다", "đoái": "돌아보다, 보살피다", "lo": "걱정하다, 염려하다", "vì": "때문에, 이니까", "Chúa": "주(主)"};
    for (const [word, meaning] of Object.entries(overrides)) {
      await E(`document.getElementById('lyr').textContent=${JSON.stringify(word)}`);
      const result=await tap(word);eq(result&&result.mean,meaning,'song meaning '+word);
    }
    for (const [word, pron] of [['luôn','루온'],['quyền năng','꾸옌 낭']]) {
      await E(`document.getElementById('lyr').textContent=${JSON.stringify(word)}`);
      const result=await tap(word);eq(result&&result.ko,pron,'song pronunciation '+word);
    }
    for (const phrase of ['ân huệ','vô tình','xưng tội','khó khăn']) {
      await E(`document.getElementById('lyr').textContent=${JSON.stringify(phrase)}`);
      for(const syllable of phrase.split(' ')){const result=await tap(syllable);eq(result&&result.mean,overrides[phrase],'compound syllable '+syllable);}
    }
    await E("document.getElementById('lyr').textContent='cầu nguyện'");
    const longer=await tap('cầu');ok(longer&&longer.mean&&longer.mean!==overrides['cầu'],'longer existing cầu nguyện wins over cầu: '+JSON.stringify(longer));
    await E("document.getElementById('lyr').textContent='chúng ta'");
    const longerTa=await tap('ta');ok(longerTa&&longerTa.mean&&longerTa.mean!==overrides['ta'],'longer chúng ta wins over ta: '+JSON.stringify(longerTa));
    const addedMeanings = {"nẻo": "길, 방법, 방향", "đường": "길", "dù": "비록 -하더라도", "dò": "살피다", "tư tưởng": "생각, 사상", "đang": "-(하)고 있다", "làm": "하다, 만들다", "ngay": "곧, -하자마자", "đếm": "세다", "cả": "다, 모두", "tôn vinh": "영광을 돌리다", "ôi": "(감탄사) 오!", "siêu phàm": "평범함을 아득히 벗어나는, 초월하는", "thay": "대단히, 너무나", "muôn dân": "만민, 모든 사람", "kinh hãi": "두려워하다", "tăm tối": "깜깜하다", "đêm đen": "어두운 밤", "vây phủ": "덮다", "vững": "굳건하다", "soi": "비추다", "lối": "길, 방향", "khuất": "숨다", "khỏi": "-로부터", "vùng": "지역, 장소", "kín": "은밀한", "khiến": "-로 하여금 -하게 하다", "chẳng hề": "전혀 (부정어)", "được": "-할 수 있다, 되다", "thật": "참으로; 참된", "chẳng": "결코 (부정어)", "tận": "(심지어) -까지도", "mênh mông": "광대한", "lòng": "마음, 속", "mộ": "무덤", "âm u": "캄캄한, 어두운, 암울한"};
    for(const [word,meaning] of Object.entries(addedMeanings)){
      await E(`document.getElementById('lyr').textContent=${JSON.stringify(word)}`);
      const result=await tap(word);eq(result&&result.mean,meaning,'new meaning '+word);
    }
    await E("document.getElementById('lyr').textContent='muôn dân'");
    const muonDan=await tap('muôn');ok(muonDan&&muonDan.ko.startsWith('무온 ')&&muonDan.mean==='만민, 모든 사람','curated syllable pronunciation inside longer compound');
    // Three separate folding cards, with the examples moved rather than copied.
    ok(await E("!!document.querySelector('[data-anchor=\"pron-saigon\"]')&&!!document.querySelector('[data-anchor=\"pron-notation-examples\"]')&&!document.querySelector('[data-anchor=\"pron-hanoi\"] .hanoi-examples')&&document.querySelectorAll('[data-anchor=\"pron-notation-examples\"] .hanoi-examples tbody tr').length===22"),'separate Hanoi/Saigon/example folding cards');
    eq(await E("document.getElementById('korean-notation-region').value"),'hanoi','default Hanoi');
    for(const [word,pron] of [['lúc','룩ㅂ'],['khuynh hướng','쿠인 흐엉'],['gì','지'],['muôn','무온']]){
      await E(`document.getElementById('lyr').textContent=${JSON.stringify(word)}`);eq((await tap(word))?.ko,pron,'explicit pronunciation '+word);
    }
    await E("const select=document.getElementById('korean-notation-region');select.value='saigon';select.dispatchEvent(new Event('change'))");
    for(const [word,pron] of [['dân','영ㄴ'],['về','예이'],['trời','ㅉ러이'],['sông','송ㅁ'],['sách','삿'],['chia','찌아'],['chết','쩍']]){
      await E(`document.getElementById('lyr').textContent=${JSON.stringify(word)}`);eq((await tap(word))?.ko,pron,'Saigon popup '+word);
    }
    eq(await E("localStorage.getItem('vi-korean-notation-region')"),'saigon','selection saved');
    await E("window.setLang('en');window.setLang('ko')");eq(await E("document.getElementById('korean-notation-region').value"),'saigon','selection survives rerender');
    await E("document.getElementById('korean-notation-region').value='hanoi';document.getElementById('korean-notation-region').dispatchEvent(new Event('change'))");
    // the real [노래] lyrics
    await E("document.getElementById('lyr').remove()");
    await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(400);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(800);})()`);
    const real = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const el=document.querySelector('.lyric-vi');if(!el)return null;el.scrollIntoView({block:'center'});await sleep(100);
      const tn=el.firstChild,m=/[\\p{L}\\p{M}]+/u.exec(tn.data);const r=document.createRange();r.setStart(tn,m.index);r.setEnd(tn,m.index+m[0].length);const b=r.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:b.left+b.width/2,clientY:b.top+b.height/2}));
      const p=document.querySelector('.lyric-word-pop');return p?p.querySelector('.lyric-word-ko').textContent:'';})()`);
    ok(real && /[가-힣ㅸㆄ]/.test(real), 'a real song lyric word opens the popup: ' + real);
    // The delegated popup covers all song collections and both notation settings.
    for(const region of ['hanoi','saigon'])for(const kind of ['original','kids']){
      await E(`(()=>{const select=document.getElementById('korean-notation-region');select.value='${region}';select.dispatchEvent(new Event('change'));document.querySelector('[data-songkind="${kind}"]').click();const root=[...document.querySelectorAll('.song-kind-list')].find(e=>e.offsetParent);const songs='${kind}'==='original'?ORIGINAL_SONGS:CHILDREN_SONGS;const song=songs.find(s=>s.languages?.vi?.available&&(s.languages.vi.lines?.length||s.languages.vi.sections?.length));window.__lyricTestSongId=song.id;root.querySelector('[data-song-id=\"'+song.id+'\"] .song-acc-head').click();})()`);await sleep(150);
      const popup=await E(`(async()=>{const el=[...document.querySelectorAll('.song-acc .lyric-vi')].find(e=>e.offsetParent);if(!el)return null;el.scrollIntoView({block:'center'});await new Promise(r=>setTimeout(r,80));const tn=el.firstChild,m=/[\\p{L}\\p{M}]+/u.exec(tn.data),r=document.createRange();r.setStart(tn,m.index);r.setEnd(tn,m.index+m[0].length);const b=r.getBoundingClientRect();el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:b.left+b.width/2,clientY:b.top+b.height/2}));return document.querySelector('.lyric-word-ko')?.textContent;})()`);
      ok(!!popup,region+' '+kind+' real lyric popup');
      // Close the card before checking the next region so the same first card opens again.
      await E("document.querySelector('[data-song-id=\"'+window.__lyricTestSongId+'\"] .song-acc-head').click()");
    }
    await cdp.send('Page.reload');await sleep(600);
    for(let i=0;i<240;i++){if(await E("document.readyState==='complete'&&typeof window.setLang==='function'&&!!window.__hanoiKo"))break;await sleep(100);}
    await E("window.setLang('ko')");eq(await E("document.getElementById('korean-notation-region').value"),'saigon','selection survives reload');
    await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await E("document.querySelector('[data-tab=\"pron\"]').click();document.querySelector('[data-pron=\"jamo\"]').click();const card=document.querySelector('[data-anchor=\"pron-saigon\"]');card.dataset.open='true';card.scrollIntoView({block:'start'})");await sleep(200);
    ok(await E('document.documentElement.scrollWidth<=window.innerWidth+1'),'phone layout fits the viewport');
    ok(errs.length === 0, 'no runtime errors: ' + errs.join(' | '));
  } finally { chrome.kill(); server.close(); }
  console.log('lyric word popup: ' + checks + ' checks, ' + failures.length + ' failures');
  failures.forEach(f => console.log('FAIL ' + f));
  process.exit(failures.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
