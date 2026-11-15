// Tests for internal Vietnamese terminology dictionary and word popup in [문장] and [파수대]
// Run: node tests/test_viet_word_popup.js
const {spawn} = require('child_process');
const path = require('path'), fs = require('fs'), http = require('http');
const PLATFORM = require('./helpers/platform');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8795;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const failures = []; let checks = 0;
const ok = (c, m) => { checks++; if (!c) failures.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m + ': ' + JSON.stringify(a) + ' != ' + JSON.stringify(b));

(async () => {
  const server = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    let f = path.join(ROOT, 'dist', u);
    if (f.endsWith('/')) f += 'index.html';
    fs.readFile(f, (e, d) => {
      if (e) { r.writeHead(404); r.end(); }
      else {
        r.writeHead(200, {
          'content-type': {
            '.html': 'text/html;charset=utf-8',
            '.js': 'text/javascript',
            '.json': 'application/json'
          }[path.extname(f)] || 'application/octet-stream'
        });
        r.end(d);
      }
    });
  }).listen(PORT);

  const chrome = spawn(PLATFORM.CHROME, [
    '--headless=new',
    '--remote-debugging-port=' + (PORT + 1000),
    '--no-first-run',
    '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'vietpop-' + process.pid)
  ], {stdio: 'ignore'});

  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) {
      try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); }
      catch { await sleep(250); }
    }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    const errs = [];
    cdp.on('Runtime.exceptionThrown', e => errs.push(e));

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/jeonju/index.html` });
    await sleep(2500);

    const E = async expr => {
      const res = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
      return res.result ? res.result.value : undefined;
    };

    // 1. Verify internal dictionary API and ra = 밖으로
    const raMean = await E("window.getVietMeaning('ra')");
    eq(raMean, '밖으로', 'window.getVietMeaning(ra) is 밖으로');

    const dictHasRa = await E("(() => { const d = window.vietWordDictionary(); return d && d.meaning && d.meaning['ra']; })()");
    eq(dictHasRa, '밖으로', 'vietWordDictionary has ra = 밖으로');

    await E("window.setLang('ko')");
    await sleep(200);

    // Generic tap function for any element ID and target word
    const tapWordInElem = async (elemId, word) => E(`(async () => {
      const el = document.getElementById(${JSON.stringify(elemId)});
      if (!el) return null;
      let targetNode = null, offset = -1;
      const walk = (node) => {
        if (node.nodeType === 3) {
          const idx = node.data.indexOf(${JSON.stringify(word)});
          if (idx >= 0 && !targetNode) {
            targetNode = node;
            offset = idx;
          }
        } else {
          for (const child of node.childNodes) walk(child);
        }
      };
      walk(el);
      if (!targetNode) return null;
      const r = document.createRange();
      r.setStart(targetNode, offset);
      r.setEnd(targetNode, offset + ${JSON.stringify(word)}.length);
      const b = r.getBoundingClientRect();
      const clickX = b.left + b.width / 2;
      const clickY = b.top + b.height / 2;
      document.elementFromPoint(clickX, clickY).dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: clickX, clientY: clickY }));
      const p = document.querySelector('.lyric-word-pop');
      return p ? {
        ko: p.querySelector('.lyric-word-ko')?.textContent || '',
        mean: (p.querySelector('.lyric-word-mean') || {}).textContent || '',
        n: document.querySelectorAll('.lyric-word-pop').length
      } : null;
    })()`);

    // 2. Test in [문장] > [행복한 삶을 영원히] / [기도] (.talk-vi)
    await E(`(() => {
      const d = document.createElement('div');
      d.id = 'test-talk-vi';
      d.className = 'talk-vi';
      d.style.cssText = 'position:fixed;left:20px;top:100px;font-size:16px;background:#fff;z-index:99999;';
      d.innerHTML = 'Tôi đi ra ngoài <button class="speak-btn">🔊</button>';
      document.body.appendChild(d);
    })()`);

    let res = await tapWordInElem('test-talk-vi', 'ra');
    ok(res && res.ko === '자' && res.mean === '밖으로' && res.n === 1, 'talk-vi tap ra -> {ko: "자", mean: "밖으로"}: ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
    ok(await E("!document.querySelector('.lyric-word-pop')"), 'Escape closes popup from talk-vi');

    // 3. Test in [파수대] (.rhyme-word-ex)
    await E(`(() => {
      const d = document.createElement('div');
      d.id = 'test-rhyme-ex';
      d.className = 'rhyme-word-ex';
      d.style.cssText = 'position:fixed;left:20px;top:150px;font-size:16px;background:#fff;z-index:99999;';
      d.innerHTML = '<span class="vn">Người bước ra khỏi phòng</span><button class="speak-btn">🔊</button>';
      document.body.appendChild(d);
    })()`);

    res = await tapWordInElem('test-rhyme-ex', 'ra');
    ok(res && res.ko === '자' && res.mean === '밖으로' && res.n === 1, 'rhyme-word-ex tap ra -> {ko: "자", mean: "밖으로"}: ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    // 4. Test in [대역 읽기] (.reader-vi)
    await E(`(() => {
      const d = document.createElement('div');
      d.id = 'test-reader-vi';
      d.className = 'vn reader-vi';
      d.style.cssText = 'position:fixed;left:20px;top:200px;font-size:16px;background:#fff;z-index:99999;';
      d.textContent = 'Chúng ta cùng đi ra';
      document.body.appendChild(d);
    })()`);

    res = await tapWordInElem('test-reader-vi', 'ra');
    ok(res && res.ko === '자' && res.mean === '밖으로' && res.n === 1, 'reader-vi tap ra -> {ko: "자", mean: "밖으로"}: ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    // 5. Test in [일상 생활] (.pdf-sent-head .vn)
    await E(`(() => {
      const head = document.createElement('div');
      head.id = 'test-pdf-sent';
      head.className = 'pdf-sent-head';
      head.style.cssText = 'position:fixed;left:20px;top:250px;font-size:16px;background:#fff;z-index:99999;';
      head.innerHTML = '<span class="pdf-sent-num">1</span><div class="vn font-bold">Hãy bước ra đây</div><button class="speak-btn">🔊</button>';
      document.body.appendChild(head);
    })()`);

    res = await tapWordInElem('test-pdf-sent', 'ra');
    ok(res && res.ko === '자' && res.mean === '밖으로' && res.n === 1, 'pdf-sent-head tap ra -> {ko: "자", mean: "밖으로"}: ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    // 6. Test 2-syllable compound words (từ ghép): "chúng ta" -> "우리 (화자+청자 포함)"
    res = await tapWordInElem('test-reader-vi', 'Chúng');
    ok(res && res.ko.includes('쭝ㅁ 따') && res.mean.includes('우리'), 'reader-vi tap "Chúng" in "Chúng ta" matches 2-syllable compound "chúng ta": ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    res = await tapWordInElem('test-reader-vi', 'ta');
    ok(res && res.ko.includes('쭝ㅁ 따') && res.mean.includes('우리'), 'reader-vi tap "ta" in "Chúng ta" matches 2-syllable compound "chúng ta": ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    // 7. Test Site-wide popup in [과정] (Curriculum: .curr-item-vi)
    await E(`(() => {
      const d = document.createElement('div');
      d.id = 'test-curr-vi';
      d.className = 'curr-item-vi';
      d.style.cssText = 'position:fixed;left:20px;top:300px;font-size:16px;background:#fff;z-index:99999;';
      d.textContent = 'Đức Giê-hô-va luôn yêu thương chúng ta';
      document.body.appendChild(d);
    })()`);

    res = await tapWordInElem('test-curr-vi', 'Giê-hô-va');
    ok(res && res.mean.includes('여호와 하느님'), 'curr-item-vi tap "Giê-hô-va" -> "여호와 하느님": ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    // 8. Test Site-wide popup in [단어] (Vocabulary: .vocab-vi)
    await E(`(() => {
      const d = document.createElement('div');
      d.id = 'test-vocab-vi';
      d.className = 'vocab-vi';
      d.style.cssText = 'position:fixed;left:20px;top:350px;font-size:16px;background:#fff;z-index:99999;';
      d.textContent = 'Gia đình là điều quan trọng';
      document.body.appendChild(d);
    })()`);

    res = await tapWordInElem('test-vocab-vi', 'Gia');
    ok(res && res.mean.includes('가족'), 'vocab-vi tap "Gia đình" -> "가족, 가정": ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    res = await tapWordInElem('test-vocab-vi', 'quan');
    ok(res && res.mean.includes('중요한'), 'vocab-vi tap "quan trọng" -> "중요한": ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    // 9. Test Site-wide popup in [문법] (Grammar: .grammar-vi)
    await E(`(() => {
      const d = document.createElement('div');
      d.id = 'test-grammar-vi';
      d.className = 'grammar-vi';
      d.style.cssText = 'position:fixed;left:20px;top:400px;font-size:16px;background:#fff;z-index:99999;';
      d.textContent = 'Tôi bắt đầu học tập';
      document.body.appendChild(d);
    })()`);

    res = await tapWordInElem('test-grammar-vi', 'bắt');
    ok(res && res.mean.includes('시작하다'), 'grammar-vi tap "bắt đầu" -> "시작하다": ' + JSON.stringify(res));

    await E(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);

    // 10. Test that clicking buttons does NOT open popup
    const btnClicked = await E(`(() => {
      const btn = document.querySelector('#test-talk-vi .speak-btn');
      const b = btn.getBoundingClientRect();
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: b.left + b.width / 2, clientY: b.top + b.height / 2 }));
      return !document.querySelector('.lyric-word-pop');
    })()`);
    ok(btnClicked, 'clicking speak button does not open word popup');

    // 7. Test in English UI: no popup
    await E("window.setLang('en')");
    await sleep(200);
    res = await tapWordInElem('test-talk-vi', 'ra');
    ok(res === null, 'English UI: no popup');

    console.log(`Vietnamese word popup test: ${checks} checks, ${failures.length} failures`);
    if (failures.length) {
      console.error(failures.join('\n'));
      process.exit(1);
    }
  } finally {
    try { chrome.kill(); } catch {}
    try { server.close(); } catch {}
  }
})();
