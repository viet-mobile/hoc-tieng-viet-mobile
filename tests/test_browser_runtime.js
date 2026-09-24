// Automated Mobile Browser Verification via Chrome DevTools Protocol (CDP)
// Tests: GENERAL, JW, and JEONJU profiles at 390px mobile viewport.
// Verifies:
// 1. All 12 canonical languages (vi, cs, zh_cn, zh, en, fr, de, hu, id, ja, ko, pl)
// 2. Profile titles/H1:
//    - GENERAL: switches across all 12 languages
//    - JW: switches across all 12 languages with "JW " prefix
//    - JEONJU: remains fixed Korean "2026-2027 전주 베트남어 학습반" across all 12 languages
// 3. Persistence: localStorage "vn-app-lang" survives reload for zh_cn and id
// 4. Tab clicking: vocab, sentence, grammar, review, wizard
// 5. Zero console.error, zero pageerror, zero 404, zero horizontal overflow at 390px.

const { spawn } = require('child_process');
const http = require('http');

const PORT = 8089;
const CDP_PORT = 9223;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const CANONICAL_LANGS = ['vi', 'cs', 'zh_cn', 'zh', 'en', 'fr', 'de', 'hu', 'id', 'ja', 'ko', 'pl'];

const EXPECTED_H1 = {
  general: {
    vi: "Học tiếng Việt",
    cs: "Studium vietnamštiny",
    zh_cn: "越南语学习",
    zh: "越南語學習",
    en: "Vietnamese Learning",
    fr: "Apprentissage du vietnamien",
    de: "Vietnamesisch lernen",
    hu: "Vietnami nyelvtanulás",
    id: "Belajar Bahasa Vietnam",
    ja: "ベトナム語学習",
    ko: "베트남어 학습",
    pl: "Nauka wietnamskiego",
  },
  jw: {
    vi: "JW Học tiếng Việt",
    cs: "JW Studium vietnamštiny",
    zh_cn: "JW 越南语学习",
    zh: "JW學習越南語",
    en: "JW Vietnamese Learning",
    fr: "JW Apprentissage du vietnamien",
    de: "JW Vietnamesisch lernen",
    hu: "JW Vietnami nyelvtanulás",
    id: "JW Belajar Bahasa Vietnam",
    ja: "JW ベトナム語学習",
    ko: "JW 베트남어 학습",
    pl: "JW Nauka wietnamskiego",
  },
  jeonju: "2026-2027 전주 베트남어 학습반",
  ulsan: "2026-2027 울산 베트남어 학습반"
};

const EXPECTED_TITLE = {
  general: {
    vi: "Học tiếng Việt",
    cs: "Studium vietnamštiny",
    zh_cn: "越南语学习",
    zh: "越南語學習",
    en: "Vietnamese Learning",
    fr: "Apprentissage du vietnamien",
    de: "Vietnamesisch lernen",
    hu: "Vietnami nyelvtanulás",
    id: "Belajar Bahasa Vietnam",
    ja: "ベトナム語学習",
    ko: "베트남어 학습",
    pl: "Nauka wietnamskiego",
  },
  jw: {
    vi: "JW Học tiếng Việt",
    cs: "JW Studium vietnamštiny",
    zh_cn: "JW 越南语学习",
    zh: "JW學習越南語",
    en: "JW Vietnamese Learning",
    fr: "JW Apprentissage du vietnamien",
    de: "JW Vietnamesisch lernen",
    hu: "JW Vietnami nyelvtanulás",
    id: "JW Belajar Bahasa Vietnam",
    ja: "JW ベトナム語学習",
    ko: "JW 베트남어 학습",
    pl: "JW Nauka wietnamskiego",
  },
  jeonju: "2026-2027 전주 베트남어 학습반 · Jeonju Vietnamese Class 2026-2027",
  ulsan: "2026-2027 울산 베트남어 학습반 · Ulsan Vietnamese Class 2026-2027"
};

const EXPECTED_BCP47 = {
  vi: "vi",
  cs: "cs",
  zh_cn: "zh-Hans",
  zh: "zh-Hant",
  en: "en",
  fr: "fr",
  de: "de",
  hu: "hu",
  id: "id",
  ja: "ja",
  ko: "ko",
  pl: "pl"
};

const EXPECTED_DROPDOWN_ORDER = [
  ['ko', '한국어'],
  ['ja', '日本語'],
  ['zh', '繁體中文'],
  ['zh_cn', '简体中文'],
  ['cs', 'Čeština'],
  ['de', 'Deutsch'],
  ['en', 'English'],
  ['fr', 'Français'],
  ['id', 'Indonesia'],
  ['hu', 'Magyar'],
  ['pl', 'Polski'],
  ['vi', 'Tiếng Việt'],
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method && this.eventListeners.has(msg.method)) {
        this.eventListeners.get(msg.method).forEach(fn => fn(msg.params));
      }
    };
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(event, fn) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(fn);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTest() {
  console.log('[Browser Test] Starting HTTP server on port ' + PORT + '...');
  const serverProc = spawn('python', ['-m', 'http.server', String(PORT), '--directory', 'dist'], { stdio: 'ignore' });

  console.log('[Browser Test] Launching Chrome Headless on CDP port ' + CDP_PORT + '...');
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + CDP_PORT,
    '--remote-allow-origins=*',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + require('path').resolve('scratch', 'pdf-browser-profile-' + process.pid),
    '--window-size=390,844',
  ], { stdio: 'ignore' });

  // Wait for Chrome CDP to be available
  let version = null;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      version = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/version`);
      if (version && version.webSocketDebuggerUrl) break;
    } catch (e) {}
  }

  if (!version || !version.webSocketDebuggerUrl) {
    serverProc.kill();
    chromeProc.kill();
    throw new Error('Failed to connect to Chrome DevTools Protocol');
  }

  console.log('[Browser Test] Connected to Chrome DevTools Protocol.');

  const profilesToTest = [
    { name: 'GENERAL', path: '/index.html', site: 'general', expectExtractionNull: true },
    { name: 'JW', path: '/jw/index.html', site: 'jw', expectExtractionNull: false },
    { name: 'JEONJU', path: '/jeonju/index.html', site: 'jeonju', expectExtractionNull: false },
    { name: 'ULSAN', path: '/ulsan/index.html', site: 'ulsan', expectExtractionNull: false },
  ];

  let allPassed = true;

  const list = await fetchJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
  let target = list.find(t => t.type === 'page') || list[0];
  const cdp = new CDPClient(target.webSocketDebuggerUrl);
  await cdp.connect();

  const consoleErrors = [];
  const pageErrors = [];
  const networkFailures = [];

  cdp.on('Runtime.consoleAPICalled', (params) => {
    if (params.type === 'error') {
      const text = params.args.map(a => a.value || a.description || '').join(' ');
      consoleErrors.push(text);
    }
  });

  cdp.on('Runtime.exceptionThrown', (params) => {
    const desc = params.exceptionDetails.exception ? params.exceptionDetails.exception.description : params.exceptionDetails.text;
    pageErrors.push(desc);
  });

  cdp.on('Network.responseReceived', (params) => {
    if (params.response.status >= 400) {
      networkFailures.push(`${params.response.status} on ${params.response.url}`);
    }
  });

  cdp.on('Network.loadingFailed', (params) => {
    networkFailures.push(`FAILED: ${params.errorText} on ${params.requestId}`);
  });

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');

  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  for (const prof of profilesToTest) {
    console.log(`\n========================================`);
    console.log(`[Browser Test] Testing Profile: ${prof.name} (${prof.path})`);
    console.log(`========================================`);

    consoleErrors.length = 0;
    pageErrors.length = 0;
    networkFailures.length = 0;

    // Reset language to default ko before loading
    const targetUrl = `http://127.0.0.1:${PORT}${prof.path}`;
    await cdp.send('Page.navigate', { url: targetUrl });
    for (let i = 0; i < 60; i++) {
      await sleep(50);
      try {
        const readyRes = await cdp.send('Runtime.evaluate', {
          expression: 'document.readyState === "complete" && !!document.querySelector("#app-title")'
        });
        if (readyRes && readyRes.result && readyRes.result.value) break;
      } catch (e) {}
    }
    await sleep(200);


    // Initial page inspection
    const evalRes = await cdp.send('Runtime.evaluate', {
      expression: `
        ({
          title: document.title,
          h1: document.querySelector('#app-title') ? document.querySelector('#app-title').textContent : null,
          tabCount: document.querySelectorAll('.tab-btn').length,
          siteProfile: window.SITE_PROFILE,
          hasExtractionData: typeof JW_EXTRACTION_DATA !== 'undefined' && JW_EXTRACTION_DATA !== null,
          vocabFreqCount: (typeof JW_EXTRACTION_DATA !== 'undefined' && JW_EXTRACTION_DATA && JW_EXTRACTION_DATA.vocabFrequencies) ? Object.keys(JW_EXTRACTION_DATA.vocabFrequencies).length : 0,
          grammarExCount: (typeof JW_EXTRACTION_DATA !== 'undefined' && JW_EXTRACTION_DATA && JW_EXTRACTION_DATA.grammarExamples) ? Object.keys(JW_EXTRACTION_DATA.grammarExamples).length : 0,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth,
        })
      `,
      returnByValue: true,
    });

    const pageInfo = evalRes.result.value;
    console.log(`  Page Title: "${pageInfo.title}"`);
    console.log(`  H1: "${pageInfo.h1}"`);
    console.log(`  Tabs Visible: ${pageInfo.tabCount}`);
    console.log(`  SITE_PROFILE: "${pageInfo.siteProfile}"`);
    console.log(`  Horizontal Overflow: ${pageInfo.hasHorizontalOverflow ? "YES (FAIL)" : "NO (PASS)"}`);
    console.log(`  JW_EXTRACTION_DATA present: ${pageInfo.hasExtractionData}`);

    let pass = true;

    if (pageInfo.hasHorizontalOverflow) {
      console.error(`  [FAIL] Horizontal overflow detected at 390px viewport!`);
      pass = false;
    } else {
      console.log(`  [PASS] Horizontal overflow = 0 (fits 390px mobile viewport)`);
    }

    if (prof.expectExtractionNull && pageInfo.hasExtractionData) {
      console.error(`  [FAIL] GENERAL profile leaked JW_EXTRACTION_DATA!`);
      pass = false;
    } else if (!prof.expectExtractionNull && !pageInfo.hasExtractionData) {
      console.error(`  [FAIL] ${prof.name} profile is missing JW_EXTRACTION_DATA!`);
      pass = false;
    } else {
      console.log(`  [PASS] Profile isolation verified (expect null = ${prof.expectExtractionNull})`);
    }

    // Verify dropdown display order matches EXPECTED_DROPDOWN_ORDER
    const dropdownOrderRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (function() {
          var sel = document.querySelector('#lang-select');
          if (!sel) return { ok: false, error: 'lang_select_missing' };
          var options = Array.from(sel.options).map(function(o) { return [o.value, o.textContent.trim()]; });
          return { ok: true, options: options };
        })()
      `,
      returnByValue: true,
    });
    const orderData = dropdownOrderRes.result.value;
    if (!orderData || !orderData.ok) {
      console.error(`  [FAIL] ${prof.name}: #lang-select is missing!`);
      pass = false;
      allPassed = false;
    } else {
      const isOrderMatch = JSON.stringify(orderData.options) === JSON.stringify(EXPECTED_DROPDOWN_ORDER);
      if (!isOrderMatch) {
        console.error(`  [FAIL] ${prof.name}: Dropdown options display order mismatch!`, orderData.options);
        pass = false;
        allPassed = false;
      } else {
        console.log(`  [PASS] Language dropdown display order exactly matches 12-language requirement`);
      }
    }

    // 1 & 2. Comprehensive 12-language Cycle: Select -> Assert -> Reload -> Assert (all 12 languages)
    console.log(`  --- Testing Complete 12-Language Selection & Reload Cycle ---`);
    for (const lang of CANONICAL_LANGS) {
      const expectedH1 = typeof EXPECTED_H1[prof.site] === 'string' ? EXPECTED_H1[prof.site] : EXPECTED_H1[prof.site][lang];
      const expectedTitle = typeof EXPECTED_TITLE[prof.site] === 'string' ? EXPECTED_TITLE[prof.site] : EXPECTED_TITLE[prof.site][lang];
      const expectedHtmlLang = EXPECTED_BCP47[lang];

      // 1. Select language via single dropdown
      const switchRes = await cdp.send('Runtime.evaluate', {
        expression: `
          (function() {
            var sel = document.querySelector('#lang-select');
            if (sel && sel.value !== '${lang}') {
              sel.value = '${lang}';
              sel.dispatchEvent(new Event('change'));
            }
            var dropdownCount = document.querySelectorAll('#lang-select').length;
            var langBtnCount = document.querySelectorAll('.lang-btn').length;
            var langSwitchBtnCount = document.querySelectorAll('.lang-switch-buttons').length;
            var h1 = document.querySelector('#app-title') ? document.querySelector('#app-title').textContent.trim() : null;
            var title = document.title;
            var htmlLang = document.documentElement.getAttribute('lang');
            var overflow = document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth;
            var isSelActive = sel ? sel.value === '${lang}' : false;
            var topbarCrossLink = document.querySelector('.topbar #site-cross-link');
            var oldFooterPresent = document.body.innerText.includes('Built by combining') || document.body.innerText.includes('형제·자매 베트남어 대화 확장훈련');
            return {
              h1: h1,
              title: title,
              htmlLang: htmlLang,
              overflow: overflow,
              dropdownCount: dropdownCount,
              langBtnCount: langBtnCount,
              langSwitchBtnCount: langSwitchBtnCount,
              selActive: isSelActive,
              topbarCrossLink: !!topbarCrossLink,
              oldFooterPresent: oldFooterPresent
            };
          })()
        `,
        returnByValue: true,
      });

      const before = switchRes.result.value;

      // Assertions before reload
      if (before.dropdownCount !== 1) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (before reload): Expected exactly 1 #lang-select, got ${before.dropdownCount}`);
        pass = false;
        allPassed = false;
      }
      if (before.langBtnCount !== 0 || before.langSwitchBtnCount !== 0) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (before reload): Stale language button elements found! btns=${before.langBtnCount}, row=${before.langSwitchBtnCount}`);
        pass = false;
        allPassed = false;
      }
      if (!before.selActive) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (before reload): Language dropdown active mismatch!`);
        pass = false;
        allPassed = false;
      }
      if (before.topbarCrossLink) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (before reload): Topbar still contains cross-link!`);
        pass = false;
        allPassed = false;
      }
      if (before.oldFooterPresent) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (before reload): Old footer text still present!`);
        pass = false;
        allPassed = false;
      }
      if (before.h1 !== expectedH1) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (before reload): H1 mismatch! Got "${before.h1}", expected "${expectedH1}"`);
        pass = false;
        allPassed = false;
      }
      if (before.title !== expectedTitle) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (before reload): Title mismatch! Got "${before.title}", expected "${expectedTitle}"`);
        pass = false;
        allPassed = false;
      }
      if (before.overflow) {
        console.error(`  [FAIL] ${prof.name} lang=${lang}: horizontal overflow at 390px!`);
        pass = false;
        allPassed = false;
      }

      // 4. Capture pre-reload document identity markers
      const preReloadRes = await cdp.send('Runtime.evaluate', {
        expression: `
          (function() {
            window.__PRE_RELOAD_DOC_MARKER = Date.now() + Math.random();
            return {
              marker: window.__PRE_RELOAD_DOC_MARKER,
              timeOrigin: (typeof performance !== 'undefined' && performance.timeOrigin) ? performance.timeOrigin : 0
            };
          })()
        `,
        returnByValue: true,
      });
      const oldTimeOrigin = preReloadRes.result.value.timeOrigin;

      // 5. Trigger reload
      await cdp.send('Page.reload');

      // 6. Deterministic wait for NEW document and app readiness (10-second timeout)
      const timeoutMs = 10000;
      const pollIntervalMs = 50;
      const startTime = Date.now();
      let ready = false;
      let lastReason = 'never_polled';

      while (Date.now() - startTime < timeoutMs) {
        await sleep(pollIntervalMs);
        try {
          const pollRes = await cdp.send('Runtime.evaluate', {
            expression: `
              (function() {
                // Must not be the old document
                if (typeof window.__PRE_RELOAD_DOC_MARKER !== 'undefined') {
                  return { ready: false, reason: 'old_document_marker_present' };
                }
                if (typeof performance === 'undefined' || !performance.timeOrigin) {
                  return { ready: false, reason: 'performance_timeOrigin_unavailable' };
                }
                if (performance.timeOrigin === ${oldTimeOrigin}) {
                  return { ready: false, reason: 'timeOrigin_not_updated' };
                }
                // New document must be completely parsed and loaded
                if (document.readyState !== 'complete') {
                  return { ready: false, reason: 'document_readyState_not_complete (' + document.readyState + ')' };
                }
                // Expected localStorage language must be restored
                var savedLang = localStorage.getItem('vn-app-lang');
                if (savedLang !== '${lang}') {
                  return { ready: false, reason: 'localStorage_lang_mismatch (got ' + savedLang + ', expected ${lang})' };
                }
                // Expected <html lang> must be set
                var htmlLang = document.documentElement.getAttribute('lang');
                if (htmlLang !== '${expectedHtmlLang}') {
                  return { ready: false, reason: 'html_lang_mismatch (got ' + htmlLang + ', expected ${expectedHtmlLang})' };
                }
                // Exactly one language dropdown matching ${lang}
                var sel = document.querySelector('#lang-select');
                if (!sel) {
                  return { ready: false, reason: 'lang_select_missing' };
                }
                if (sel.value !== '${lang}') {
                  return { ready: false, reason: 'lang_select_mismatch (got ' + sel.value + ', expected ${lang})' };
                }
                if (document.querySelectorAll('.lang-btn').length !== 0) {
                  return { ready: false, reason: 'stale_lang_btns_present' };
                }
                // Expected H1 text must be rendered
                var h1El = document.querySelector('#app-title');
                if (!h1El || !h1El.textContent) {
                  return { ready: false, reason: 'h1_missing_or_empty' };
                }
                if (h1El.textContent.trim() !== ${JSON.stringify(expectedH1)}) {
                  return { ready: false, reason: 'h1_text_mismatch (got "' + h1El.textContent.trim() + '", expected ' + ${JSON.stringify(expectedH1)} + ')' };
                }
                // Expected document title must be set
                if (document.title !== ${JSON.stringify(expectedTitle)}) {
                  return { ready: false, reason: 'title_mismatch (got "' + document.title + '", expected ' + ${JSON.stringify(expectedTitle)} + ')' };
                }
                return { ready: true };
              })()
            `,
            returnByValue: true,
          });
          if (pollRes && pollRes.result && pollRes.result.value) {
            if (pollRes.result.value.ready) {
              ready = true;
              break;
            } else {
              lastReason = pollRes.result.value.reason;
            }
          }
        } catch (e) {
          lastReason = 'context_destroyed_or_navigating (' + e.message + ')';
        }
      }

      if (!ready) {
        console.error(`  [FAIL] TIMEOUT waiting for app readiness! Profile: ${prof.name}, Lang: ${lang}, Reason: ${lastReason}`);
        pass = false;
        allPassed = false;
        continue;
      }

      // 7. Formal post-reload state assertions
      const reloadRes = await cdp.send('Runtime.evaluate', {
        expression: `
          (function() {
            var savedLang = localStorage.getItem('vn-app-lang');
            var dropdownCount = document.querySelectorAll('#lang-select').length;
            var langBtnCount = document.querySelectorAll('.lang-btn').length;
            var sel = document.querySelector('#lang-select');
            var isSelActive = sel ? sel.value === '${lang}' : false;
            var htmlLang = document.documentElement.getAttribute('lang');
            var h1 = document.querySelector('#app-title') ? document.querySelector('#app-title').textContent.trim() : null;
            var title = document.title;
            var crossLink = document.querySelector('#site-cross-link');
            var crossLinkWrap = document.querySelector('.site-cross-link-wrap');
            var crossLinkHref = crossLink ? crossLink.getAttribute('href') : null;
            var crossLinkText = crossLink ? crossLink.textContent.trim() : null;
            var topbarCrossLink = document.querySelector('.topbar #site-cross-link');
            var oldFooterPresent = document.body.innerText.includes('Built by combining') || document.body.innerText.includes('형제·자매 베트남어 대화 확장훈련');
            var overflow = document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth;
            return {
              savedLang: savedLang,
              dropdownCount: dropdownCount,
              langBtnCount: langBtnCount,
              selActive: isSelActive,
              htmlLang: htmlLang,
              h1: h1,
              title: title,
              hasCrossLinkWrap: !!crossLinkWrap,
              crossLinkHref: crossLinkHref,
              crossLinkText: crossLinkText,
              topbarCrossLink: !!topbarCrossLink,
              oldFooterPresent: oldFooterPresent,
              overflow: overflow
            };
          })()
        `,
        returnByValue: true,
      });

      const after = reloadRes.result.value;

      // Assert localStorage has the selected language
      if (after.savedLang !== lang) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): localStorage mismatch! Got "${after.savedLang}", expected "${lang}"`);
        pass = false;
        allPassed = false;
      }

      // Assert exactly one dropdown and zero buttons
      if (after.dropdownCount !== 1) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Expected 1 #lang-select, got ${after.dropdownCount}`);
        pass = false;
        allPassed = false;
      }
      if (after.langBtnCount !== 0) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Stale lang buttons found! count=${after.langBtnCount}`);
        pass = false;
        allPassed = false;
      }
      if (!after.selActive) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Language select mismatch!`);
        pass = false;
        allPassed = false;
      }

      // Assert topbar does NOT have cross-link
      if (after.topbarCrossLink) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Topbar still contains cross-link!`);
        pass = false;
        allPassed = false;
      }

      // Assert old footer sentence is absent
      if (after.oldFooterPresent) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Old footer text still present!`);
        pass = false;
        allPassed = false;
      }

      // Assert horizontal overflow
      if (after.overflow) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Horizontal overflow at 390px!`);
        pass = false;
        allPassed = false;
      }

      // Assert <html lang="..."> has the expected BCP-47 tag
      if (after.htmlLang !== expectedHtmlLang) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): html lang mismatch! Got "${after.htmlLang}", expected "${expectedHtmlLang}"`);
        pass = false;
        allPassed = false;
      }

      // Assert H1 text STILL matches expected profile H1 after reload
      if (after.h1 !== expectedH1) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): H1 mismatch! Got "${after.h1}", expected "${expectedH1}"`);
        pass = false;
        allPassed = false;
      }

      // Assert document.title STILL matches expected profile title after reload
      if (after.title !== expectedTitle) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Title mismatch! Got "${after.title}", expected "${expectedTitle}"`);
        pass = false;
        allPassed = false;
      }

      // Assert profile cross-links in footer
      if (prof.site === 'general') {
        if (!after.hasCrossLinkWrap || after.crossLinkHref !== 'https://jw.hoc.tieng.viet.mobile' || after.crossLinkText !== 'JW?') {
          console.error(`  [FAIL] GENERAL lang=${lang} (after reload): Cross-link mismatch! Got href="${after.crossLinkHref}", text="${after.crossLinkText}", hasWrap=${after.hasCrossLinkWrap}`);
          pass = false;
          allPassed = false;
        }
      } else if (prof.site === 'jw') {
        if (!after.hasCrossLinkWrap || after.crossLinkHref !== 'https://jeonju.hoc.tieng.viet.mobile' || after.crossLinkText !== '전주 학습반?') {
          console.error(`  [FAIL] JW lang=${lang} (after reload): Cross-link mismatch! Got href="${after.crossLinkHref}", text="${after.crossLinkText}", hasWrap=${after.hasCrossLinkWrap}`);
          pass = false;
          allPassed = false;
        }
      } else if (prof.site === 'jeonju' || prof.site === 'ulsan') {
        // Regional sites link only to their OWN admin page.
        const expectedAdmin = `https://${prof.site}.hoc.tieng.viet.mobile/admin`;
        if (!after.hasCrossLinkWrap || after.crossLinkHref !== expectedAdmin || after.crossLinkText !== '관리자?') {
          console.error(`  [FAIL] ${prof.name} lang=${lang} (after reload): Admin footer link mismatch! Got href="${after.crossLinkHref}", text="${after.crossLinkText}", hasWrap=${after.hasCrossLinkWrap}; expected "${expectedAdmin}" / "관리자?"`);
          pass = false;
          allPassed = false;
        }
      }

      // 8. Delayed stability assertion (1 second) to ensure no late overwrite
      await sleep(1000);
      const stabilityRes = await cdp.send('Runtime.evaluate', {
        expression: `
          (function() {
            var h1 = document.querySelector('#app-title') ? document.querySelector('#app-title').textContent.trim() : null;
            var title = document.title;
            var htmlLang = document.documentElement.getAttribute('lang');
            var savedLang = localStorage.getItem('vn-app-lang');
            var sel = document.querySelector('#lang-select');
            var isSelActive = sel ? sel.value === '${lang}' : false;
            var langBtnCount = document.querySelectorAll('.lang-btn').length;
            return {
              h1: h1,
              title: title,
              htmlLang: htmlLang,
              savedLang: savedLang,
              selActive: isSelActive,
              langBtnCount: langBtnCount
            };
          })()
        `,
        returnByValue: true,
      });

      const stable = stabilityRes.result.value;
      if (stable.h1 !== expectedH1) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (delayed stability): H1 changed after 1s! Got "${stable.h1}", expected "${expectedH1}"`);
        pass = false;
        allPassed = false;
      }
      if (stable.title !== expectedTitle) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (delayed stability): Title changed after 1s! Got "${stable.title}", expected "${expectedTitle}"`);
        pass = false;
        allPassed = false;
      }
      if (stable.htmlLang !== expectedHtmlLang) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (delayed stability): html lang changed after 1s! Got "${stable.htmlLang}", expected "${expectedHtmlLang}"`);
        pass = false;
        allPassed = false;
      }
      if (stable.savedLang !== lang) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (delayed stability): localStorage changed after 1s! Got "${stable.savedLang}", expected "${lang}"`);
        pass = false;
        allPassed = false;
      }
      if (!stable.selActive || stable.langBtnCount !== 0) {
        console.error(`  [FAIL] ${prof.name} lang=${lang} (delayed stability): Language select state changed after 1s! selActive=${stable.selActive}, langBtnCount=${stable.langBtnCount}`);
        pass = false;
        allPassed = false;
      }
    }

    if (pass) {
      console.log(`  [PASS] All 12 languages completed full select->assert->reload->assert cycle on ${prof.name}`);
    } else {
      console.error(`  [FAIL] One or more languages failed verification cycle on ${prof.name}`);
    }

    // Reset to ko
    await cdp.send('Runtime.evaluate', {
      expression: `
        (function() {
          var sel = document.querySelector('#lang-select');
          if (sel) { sel.value = 'ko'; sel.dispatchEvent(new Event('change')); }
        })()
      `,
    });
    await sleep(200);

    // 3. Tab Clicking & Navigation Verification
    console.log(`  --- Testing Major Tabs Navigation ---`);
    const tabsRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (function() {
          var tabs = Array.from(document.querySelectorAll('.tab-btn'));
          var visited = [];
          for (var i = 0; i < tabs.length; i++) {
            tabs[i].click();
            visited.push(tabs[i].getAttribute('data-tab') || tabs[i].textContent.trim());
          }
          return visited;
        })()
      `,
      returnByValue: true,
    });
    console.log(`  Clicked tabs: ${tabsRes.result.value.join(', ')}`);

    if (prof.name === 'JW' || prof.name === 'JEONJU' || prof.name === 'ULSAN') {
      const neighborRes = await cdp.send('Runtime.evaluate', {
        expression: `
          (function() {
            var tabs = Array.from(document.querySelectorAll('.tab-btn'));
            var talkTab = tabs.find(t => t.textContent.includes('대화') || t.getAttribute('data-tab') === 'wizard');
            if (talkTab) talkTab.click();

            var subtabs = Array.from(document.querySelectorAll('.subtab-btn, button[data-wizard]'));
            var nbSubtab = subtabs.find(s => s.getAttribute('data-wizard') === 'neighbor' || s.textContent.includes('이웃 사람'));
            if (nbSubtab) nbSubtab.click();

            var cardCount = document.querySelectorAll('#curr-neighbor-root .group-card').length;
            return { talkClicked: !!talkTab, nbClicked: !!nbSubtab, cardCount: cardCount };
          })()
        `,
        returnByValue: true,
      });
      console.log(`  Neighbor Dialogue: cards rendered = ${neighborRes.result.value.cardCount}`);
      if (neighborRes.result.value.cardCount !== 11) {
        console.error(`  [FAIL] Expected 11 Neighbor conversation cards, found ${neighborRes.result.value.cardCount}`);
        pass = false;
      } else {
        console.log(`  [PASS] Exactly 11 Neighbor conversation cards rendered`);
      }
    }

    // 4. Word Order [어순 배열] Interaction Verification
    console.log(`  --- Testing Word Order [어순 배열] Tap-to-Swap & Zero Move Buttons ---`);
    const wordOrderRes = await cdp.send('Runtime.evaluate', {
      expression: `
        (function() {
          var reviewTab = document.querySelector('.tab-btn[data-tab="review"]');
          if (!reviewTab) return { ok: true, skipped: 'no review tab' };
          reviewTab.click();

          var orderModeBtn = document.querySelector('.study-mode-btn[data-mode="order"]');
          if (orderModeBtn) orderModeBtn.click();

          var moveBtnCount = document.querySelectorAll('.study-chip-move').length;
          var moveSlotCount = document.querySelectorAll('.study-chip-slot').length;

          // Place two chips from bank into answer area
          var bankChips = Array.from(document.querySelectorAll('#order-bank .study-chip'));
          if (bankChips.length >= 2) {
            bankChips[0].click();
            var bankChips2 = Array.from(document.querySelectorAll('#order-bank .study-chip'));
            if (bankChips2.length) bankChips2[0].click();
          }

          var placedChips = Array.from(document.querySelectorAll('#order-answer .study-chip.placed'));
          if (placedChips.length < 2) {
            return { ok: false, error: 'Could not place two chips from bank' };
          }

          var w0Before = placedChips[0].textContent.trim();
          var w1Before = placedChips[1].textContent.trim();

          // 1. Click first chip -> must become selected
          placedChips[0].click();
          var placedAfterFirst = Array.from(document.querySelectorAll('#order-answer .study-chip.placed'));
          var isSelected = placedAfterFirst[0].classList.contains('selected');
          var ariaPressed = placedAfterFirst[0].getAttribute('aria-pressed');

          // 2. Click second chip -> must swap positions and clear selection
          placedAfterFirst[1].click();

          var placedAfterSwap = Array.from(document.querySelectorAll('#order-answer .study-chip.placed'));
          var w0After = placedAfterSwap[0].textContent.trim();
          var w1After = placedAfterSwap[1].textContent.trim();
          var anySelectedAfter = document.querySelectorAll('#order-answer .study-chip.selected').length;

          var swapped = (w0After === w1Before && w1After === w0Before);

          // 3. Click first chip again and then click itself -> the word goes back out to the bank
          var placedCountBefore = placedAfterSwap.length;
          var returnedWord = placedAfterSwap[0].textContent.trim();
          placedAfterSwap[0].click();
          var placedReselected = Array.from(document.querySelectorAll('#order-answer .study-chip.placed'));
          var reselected = placedReselected[0].classList.contains('selected');
          placedReselected[0].click();
          var placedAfterReturn = document.querySelectorAll('#order-answer .study-chip.placed').length;
          var bankWords = Array.from(document.querySelectorAll('#order-bank .study-chip')).map(function (c) { return c.textContent.trim(); });
          var cancelled = placedAfterReturn === placedCountBefore - 1 && bankWords.indexOf(returnedWord) >= 0 &&
            document.querySelectorAll('#order-answer .study-chip.selected').length === 0;

          // 4. Test Reset
          var resetBtn = document.querySelector('#order-reset');
          if (resetBtn) resetBtn.click();
          var placedAfterReset = document.querySelectorAll('#order-answer .study-chip').length;

          // 5. Overflow check
          var overflow = document.documentElement.scrollWidth > window.innerWidth || document.body.scrollWidth > window.innerWidth;

          return {
            ok: true,
            moveBtnCount: moveBtnCount,
            moveSlotCount: moveSlotCount,
            isSelected: isSelected,
            ariaPressed: ariaPressed,
            swapped: swapped,
            anySelectedAfter: anySelectedAfter,
            reselected: reselected,
            cancelled: cancelled,
            placedAfterReset: placedAfterReset,
            overflow: overflow
          };
        })()
      `,
      returnByValue: true,
    });

    const wo = wordOrderRes.result.value;
    if (wo && wo.ok && !wo.skipped) {
      if (wo.moveBtnCount !== 0 || wo.moveSlotCount !== 0) {
        console.error(`  [FAIL] Expected 0 move buttons, found ${wo.moveBtnCount} buttons and ${wo.moveSlotCount} slots`);
        pass = false;
      } else {
        console.log(`  [PASS] Zero move buttons verified in [어순 배열]`);
      }
      if (!wo.isSelected || wo.ariaPressed !== 'true') {
        console.error(`  [FAIL] First tap did not enter selected state`);
        pass = false;
      } else {
        console.log(`  [PASS] Tap selects word with subtle visual selected state`);
      }
      if (!wo.swapped || wo.anySelectedAfter !== 0) {
        console.error(`  [FAIL] Second tap did not swap words`);
        pass = false;
      } else {
        console.log(`  [PASS] Second tap swaps word positions and clears selection`);
      }
      if (!wo.reselected || !wo.cancelled) {
        console.error(`  [FAIL] Tapping selected word again did not return it to the word bank`);
        pass = false;
      } else {
        console.log(`  [PASS] Tapping selected word again returns it to the word bank`);
      }
      if (wo.placedAfterReset !== 0) {
        console.error(`  [FAIL] Reset button did not clear placed chips`);
        pass = false;
      } else {
        console.log(`  [PASS] Reset clears placed chips and restores word bank`);
      }
      if (wo.overflow) {
        console.error(`  [FAIL] Horizontal overflow detected in [어순 배열] at 390px`);
        pass = false;
      }
    }

    // 5. [복습] > [문장] 12-Language Regression Verification
    if (prof.name === 'JW' || prof.name === 'JEONJU' || prof.name === 'ULSAN') {
      console.log(`  --- Testing [복습] > [문장] Across All 11 Non-VI Languages ---`);
      const NON_VI_LANGS = ['cs', 'zh_cn', 'zh', 'en', 'fr', 'de', 'hu', 'id', 'ja', 'ko', 'pl'];
      for (const lang of NON_VI_LANGS) {
        const sentenceRevRes = await cdp.send('Runtime.evaluate', {
          expression: `
            (function() {
              window.setLang('${lang}');
              var reviewTab = document.querySelector('.tab-btn[data-tab="review"]');
              if (reviewTab) reviewTab.click();

              var sentCatBtn = document.querySelector('.subtab-btn[data-review="sentence"]');
              if (sentCatBtn) sentCatBtn.click();

              var pool = window.reviewScopedPool ? window.reviewScopedPool("sentence", "all") : [];
              if (!pool || !pool.length) {
                return { ok: false, error: 'Empty sentence review pool for lang ' + '${lang}' };
              }

              // Check if any pool items have empty kr
              var emptyKr = pool.filter(function(it) { return !it.kr || !it.kr.trim(); });
              if (emptyKr.length > 0) {
                return { ok: false, error: 'Found ' + emptyKr.length + ' items with empty translation in pool for ' + '${lang}' };
              }

              // Test Order Mode rendering
              var orderBtn = document.querySelector('.study-mode-btn[data-mode="order"]');
              if (orderBtn) orderBtn.click();

              var promptEl = document.querySelector('.study-order-prompt');
              var promptText = promptEl ? promptEl.textContent.trim() : '';
              var bankChips = Array.from(document.querySelectorAll('#order-bank .study-chip'));
              var viTokens = bankChips.map(function(c) { return c.textContent.trim(); }).filter(Boolean);

              // Test Flashcard Mode rendering
              var flashBtn = document.querySelector('.study-mode-btn[data-mode="flash"]');
              if (flashBtn) flashBtn.click();

              var flashCard = document.querySelector('#study-body');
              var flashText = flashCard ? flashCard.textContent.trim() : '';

              return {
                ok: true,
                lang: '${lang}',
                poolSize: pool.length,
                promptText: promptText,
                promptNonEmpty: !!promptText,
                viTokenCount: viTokens.length,
                viTokensNonEmpty: viTokens.length > 0,
                flashTextNonEmpty: !!flashText,
                sampleVi: pool[0].vi,
                sampleTrans: pool[0].kr
              };
            })()
          `,
          returnByValue: true,
        });

        const sr = sentenceRevRes.result.value;
        if (!sr || !sr.ok) {
          console.error(`  [FAIL] [복습] > [문장] error in ${lang}:`, sr ? sr.error : 'evaluation failed');
          pass = false;
        } else {
          if (!sr.promptNonEmpty) {
            console.error(`  [FAIL] ${lang}: Order prompt translation is EMPTY!`);
            pass = false;
          } else if (!sr.viTokensNonEmpty) {
            console.error(`  [FAIL] ${lang}: Vietnamese tokens in bank are EMPTY!`);
            pass = false;
          } else {
            console.log(`  [PASS] [복습] > [문장] ${lang}: pool=${sr.poolSize}, prompt="${sr.promptText.slice(0, 35)}...", sampleTrans="${sr.sampleTrans.slice(0, 30)}..."`);
          }
        }
      }
      // Restore default language to ko
      await cdp.send('Runtime.evaluate', { expression: `window.setLang('ko')` });
    }

    try {
      await require('./helpers/general_pdf_browser')(cdp, prof.site);
    } catch (error) {
      console.error('  [FAIL] PDF content regression:', error.message);
      pass = false;
    }

    if (consoleErrors.length > 0) {
      console.error(`  [FAIL] console.error count = ${consoleErrors.length}:`, consoleErrors);
      pass = false;
    } else {
      console.log(`  [PASS] console.error = 0`);
    }

    if (pageErrors.length > 0) {
      console.error(`  [FAIL] pageerror count = ${pageErrors.length}:`, pageErrors);
      pass = false;
    } else {
      console.log(`  [PASS] pageerror = 0`);
    }

    if (networkFailures.length > 0) {
      console.error(`  [FAIL] network failures count = ${networkFailures.length}:`, networkFailures);
      pass = false;
    } else {
      console.log(`  [PASS] 404 / failed requests = 0`);
    }

    if (!pass) allPassed = false;
  }

  cdp.close();

  console.log('\n[Browser Test] Stopping Chrome and HTTP server...');
  chromeProc.kill();
  serverProc.kill();

  if (allPassed) {
    console.log('\n[Browser Test] ALL PROFILES PASSED! (console.error=0, pageerror=0, 404=0, requestfailed=0, all 12 languages verified)\n');
    process.exit(0);
  } else {
    console.error('\n[Browser Test] ONE OR MORE TESTS FAILED.\n');
    process.exit(1);
  }
}

module.exports = { CDPClient };
if (require.main === module) runTest().catch((err) => {
  console.error('[Browser Test Error]', err);
  process.exit(1);
});
