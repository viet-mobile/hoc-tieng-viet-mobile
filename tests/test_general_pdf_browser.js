const {spawn} = require('child_process');
const path = require('path');
const assert = require('assert');
const {CDPClient} = require('./test_browser_runtime');
const verify = require('./helpers/general_pdf_browser');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const server = spawn('python', ['-m', 'http.server', '8093', '--directory', 'dist'], {stdio: 'ignore'});
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', '--remote-debugging-port=9227', '--no-first-run',
    '--user-data-dir=' + path.resolve('scratch', 'pdf-focused-' + process.pid),
  ], {stdio: 'ignore'});
  let cdp;
  try {
    let targets;
    for (let i = 0; i < 40; i++) {
      try { targets = await (await fetch('http://127.0.0.1:9227/json/list')).json(); break; }
      catch { await sleep(250); }
    }
    assert(targets, 'Chrome DevTools unavailable');
    cdp = new CDPClient(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
    const errors = [];
    cdp.on('Runtime.exceptionThrown', e => errors.push(e.exceptionDetails.text));
    cdp.on('Runtime.consoleAPICalled', e => {
      if (e.type === 'error') errors.push(e.args.map(a => a.value || a.description).join(' '));
    });
    for (const site of ['general', 'jw', 'jeonju', 'ulsan']) {
      await cdp.send('Page.navigate', {url: 'http://127.0.0.1:8093/' + (site === 'general' ? '' : site + '/') + 'index.html'});
      let ready = false;
      for (let i = 0; i < 120; i++) {
        const r = await cdp.send('Runtime.evaluate', {expression: `document.readyState === 'complete' && typeof SITE_PROFILE !== 'undefined' && SITE_PROFILE === '${site}' && !!document.querySelector('[data-pdf-id]')`, returnByValue: true});
        if (r.result.value) { ready = true; break; }
        await sleep(250);
      }
      assert(ready, site + ': page did not initialize');
      console.log(site);
      await verify(cdp, site);
      await require('./helpers/localization_handoff_browser')(cdp, site);
    }
    assert.deepStrictEqual(errors, []);
  } finally {
    if (cdp) cdp.close();
    chrome.kill();
    server.kill();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
