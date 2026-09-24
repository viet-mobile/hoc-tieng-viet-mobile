// Executed in the real browser by the existing four-profile CDP regression suite.
module.exports = async function verifyPdf(cdp, site) {
  const result = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const errors = [];
      const check = (ok, msg) => { if (!ok) errors.push(msg); };
      const click = selector => {
        const el = document.querySelector(selector);
        check(!!el, 'missing ' + selector);
        if (el) el.click();
      };
      const visible = el => !!el && el.getClientRects().length > 0;
      const setLanguage = lang => {
        const select = document.getElementById('lang-select');
        select.value = lang;
        select.dispatchEvent(new Event('change', {bubbles: true}));
      };
      for (const lang of ['vi','cs','zh_cn','zh','en','fr','de','hu','id','ja','ko','pl']) {
        setLanguage(lang);
        click('[data-tab="sentence"]');
        click('[data-sentence="pdf"]');
        const sentence = GENERAL_PDF.sentences[0];
        let card = document.querySelector('[data-pdf-id="' + sentence.id + '"]');
        check(visible(card), lang + ': sentence not visible');
        check(card?.querySelector('.pdf-original').textContent === sentence.vi, lang + ': sentence source mismatch');
        check(card?.querySelector('.pdf-translation').textContent === (sentence.translations[lang] || (lang === 'vi' ? '' : 'Translation unavailable · ' + lang)), lang + ': translation fallback');
        check(card?.querySelector('.pdf-source').textContent.includes(sentence.sources[0].file), lang + ': source missing');
        click('[data-tab="grammar"]');
        const grammar = GENERAL_PDF.grammar[0];
        card = document.querySelector('[data-pdf-id="' + grammar.id + '"]');
        const original = card?.querySelector('details');
        if (original) original.open = true;
        check(visible(card?.querySelector('.pdf-original')), lang + ': grammar not visible');
        check(card?.querySelector('.pdf-original').textContent === grammar.original, lang + ': grammar source mismatch');
        click('[data-tab="vocab"]');
        click('[data-vocab="words"]');
        click('[data-tag="PDF"]');
        card = document.querySelector('#vocab-root [data-pdf-id]');
        const word = GENERAL_PDF.words.find(w => w.id === card?.dataset.pdfId);
        check(visible(card) && !!word, lang + ': PDF word not visible');
        check(card?.querySelector('.bible-word').textContent === word?.vi, lang + ': word source mismatch');
        const merged = UNIFIED_WORDS.find(w => w.pdf_id === word?.id);
        check(card?.querySelector('.bible-mean').textContent === (merged?.kr[lang] || (lang === 'vi' ? '' : 'Translation unavailable · ' + lang)), lang + ': word fallback');
      }
      setLanguage('ko');
      if ('${site}' === 'general') {
        check(JW_EXTRACTION_DATA === null, 'JW data leaked');
        check(!document.querySelector('[data-sentence="lff"]'), 'JW pane leaked');
        check(typeof JEONJU_INFO === 'undefined' && typeof ULSAN_INFO === 'undefined', 'regional data leaked');
      }
      return {errors, counts: Object.fromEntries(Object.entries(GENERAL_PDF).map(([k,v]) => [k,v.length]))};
    })()`,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  const value = result.result.value;
  if (value.errors.length) throw new Error(JSON.stringify(value.errors));
  console.log('  [PASS] PDF real content, provenance, 12 languages: ' + JSON.stringify(value.counts));
};
