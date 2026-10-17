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
    eq(rules, ['탑 까인', '년 쯩', '득 제호ㅸㅏ', '낀 타인', '호이 타인', '뇸 홉', '바이 핫', '꺼우 응우옌', '띠엥 ㅸㅣ엣', '홉 호이', '쭘 따', '아인 찌', '꽌 쫌', '띤 믕', '느억 쩌이', '득 쭈어 쩌이', '반 꾸어 응아이', '응어이 한', '턴 키 타인', '컴'], 'chart rules');
    // ---- a lyric line in the page ----
    await E(`(()=>{const d=document.createElement('div');d.id='lyr';d.className='lyric-vi vn';d.lang='vi';d.style.cssText='position:fixed;left:20px;top:200px;font-size:22px;white-space:nowrap;background:#fff;z-index:1';d.textContent='Đọc sách, Kinh Thánh và Giê-hô-va, xin cầu nguyện';document.body.appendChild(d);})()`);
    const tap = async word => E(`(async()=>{const el=document.getElementById('lyr'),tn=el.firstChild,i=tn.data.indexOf(${JSON.stringify(word)});const r=document.createRange();r.setStart(tn,i);r.setEnd(tn,i+${JSON.stringify(word)}.length);const b=r.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:b.left+b.width/2,clientY:b.top+b.height/2}));
      const p=document.querySelector('.lyric-word-pop');return p?{ko:p.querySelector('.lyric-word-ko').textContent,mean:(p.querySelector('.lyric-word-mean')||{}).textContent||'',n:document.querySelectorAll('.lyric-word-pop').length,top:p.getBoundingClientRect().top,bottom:p.getBoundingClientRect().bottom}:null;})()`);
    await E("window.setLang('ko')"); await sleep(200);
    let r = await tap('Kinh');
    ok(r && r.ko === '낀 타인' && r.mean && r.n === 1, 'Kinh -> the 2-syllable word Kinh Thánh: ' + JSON.stringify(r));
    r = await tap('Thánh'); ok(r && r.ko === '낀 타인' && r.n === 1, 'tapping the second syllable gives the same word, one popup: ' + JSON.stringify(r));
    r = await tap('sách'); ok(r && r.ko === '돕 사익', 'chart example wins for its exact word (đọc sách): ' + JSON.stringify(r));
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
    // the real [노래] lyrics
    await E("document.getElementById('lyr').remove()");
    await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));document.querySelector('.tab-btn[data-tab="sentence"]').click();await sleep(400);document.querySelector('.subtab-btn[data-sentence="song"]').click();await sleep(800);})()`);
    const real = await E(`(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const el=document.querySelector('.lyric-vi');if(!el)return null;el.scrollIntoView({block:'center'});await sleep(100);
      const tn=el.firstChild,m=/[\\p{L}\\p{M}]+/u.exec(tn.data);const r=document.createRange();r.setStart(tn,m.index);r.setEnd(tn,m.index+m[0].length);const b=r.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:b.left+b.width/2,clientY:b.top+b.height/2}));
      const p=document.querySelector('.lyric-word-pop');return p?p.querySelector('.lyric-word-ko').textContent:'';})()`);
    ok(real && /[가-힣ㅸㆄ]/.test(real), 'a real song lyric word opens the popup: ' + real);
    ok(errs.length === 0, 'no runtime errors: ' + errs.join(' | '));
  } finally { chrome.kill(); server.close(); }
  console.log('lyric word popup: ' + checks + ' checks, ' + failures.length + ' failures');
  failures.forEach(f => console.log('FAIL ' + f));
  process.exit(failures.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
