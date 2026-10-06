// What the Vietnamese voice is given (prepareSpeechText) for words the engines mispronounce -- the screen text is never changed:
//   "gian" -> "zan": between two syllables the voices make the "gi" of "gian" a weak glide ("thời gian" heard as "thời lan");
//   only the whole syllable, so "giang", "giàn", "giảng" ... stay; capital kept.
const PLATFORM = require('./helpers/platform');
const {spawn} = require('child_process');
const path = require('path');
const {CDPClient} = require('./test_browser_runtime');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8961;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CASES = [
  ['thời gian', 'thời zan'], ['Thời gian', 'Thời zan'], ['không gian', 'không zan'], ['trung gian', 'trung zan'], ['nhân gian', 'nhân zan'],
  ['gian', 'zan'], ['Gian', 'Zan'], ['thời gian, không gian.', 'thời zan, không zan.'], ['“gian”', '“zan”'],
  ['giang', 'giang'], ['giảng dạy', 'giảng dạy'], ['giàn', 'giàn'], ['gia đình', 'gia đình'], ['giờ', 'giờ'], ['thời gian trôi qua', 'thời zan trôi qua'],
  ['ngân hàng', 'Ngân hàng'], ['y tế', 'i tế'],   // the older respellings still apply
];
(async () => {
  const server = spawn(PLATFORM.PYTHON, ['-m', 'http.server', String(PORT), '--directory', path.join(ROOT, 'dist')], {stdio: 'ignore'});
  const chrome = spawn(PLATFORM.CHROME, ['--headless=new', '--remote-debugging-port=' + (PORT + 1000), '--no-first-run', '--user-data-dir=' + path.resolve(PLATFORM.TMP, 'respell-' + process.pid)], {stdio: 'ignore'});
  let failed = 0, checks = 0;
  try {
    let targets;
    for (let i = 0; i < 40 && !targets; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT + 1000}/json/list`)).json(); } catch { await sleep(250); } }
    const cdp = new CDPClient(targets.find(x => x.type === 'page').webSocketDebuggerUrl);
    await cdp.connect(); await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Page.navigate', {url: `http://127.0.0.1:${PORT}/jeonju/index.html?fresh=1`});
    const E = async expr => (await cdp.send('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true})).result.value;
    for (let i = 0; i < 240; i++) { if (await E("typeof window.__prepareSpeechText==='function'")) break; await sleep(250); }
    for (const [input, want] of CASES) {
      const got = await E(`window.__prepareSpeechText(${JSON.stringify(input)})`);
      checks++;
      if (got !== want) { failed++; console.error(`  [FAIL] "${input}" -> "${got}" (want "${want}")`); }
    }
  } finally { chrome.kill(); server.kill(); }
  console.log(`checks run: ${checks}`);
  if (failed) { console.error('--- SPEECH RESPELL TEST FAILED ---'); process.exit(1); }
  console.log('--- SPEECH RESPELL TEST PASSED ---');
})();
