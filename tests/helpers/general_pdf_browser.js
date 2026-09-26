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
        check(card?.querySelector('.vn')?.textContent === sentence.vi, lang + ': sentence source mismatch');
        if (sentence.translations[lang]) {
          check(card?.querySelector('.card-translation')?.textContent === sentence.translations[lang], lang + ': sentence translation mismatch');
        }
        check(!card?.querySelector('.pdf-source'), lang + ': sentence pdf-source must not be visible');
        check(!card?.innerText.includes('Translation unavailable'), lang + ': sentence Translation unavailable label visible');

        click('[data-tab="grammar"]');
        click('[data-grammar="pdf"]');
        const grammar = GENERAL_PDF.grammar[0];
        card = document.querySelector('[data-pdf-id="' + grammar.id + '"]');
        check(visible(card), lang + ': grammar not visible');
        check(!card?.querySelector('.pdf-source'), lang + ': grammar pdf-source must not be visible');
        check(!card?.innerText.includes('Translation unavailable'), lang + ': grammar Translation unavailable label visible');
        check(!card?.innerText.includes('PDF original'), lang + ': grammar PDF original label visible');

        click('[data-tab="vocab"]');
        click('[data-vocab="words"]');
        click('[data-tag="daily"]'); // the [일상] filter (words from the everyday-conversation PDF books)
        card = document.querySelector('#vocab-root [data-pdf-id]');
        const word = GENERAL_PDF.words.find(w => w.id === card?.dataset.pdfId);
        check(visible(card) && !!word, lang + ': PDF word not visible');
        check(card?.querySelector('.bible-word')?.textContent === word?.vi, lang + ': word source mismatch');
        check(!card?.querySelector('.pdf-source'), lang + ': word pdf-source must not be visible');
        const merged = UNIFIED_WORDS.find(w => w.pdf_id === word?.id);
        const expectedMean = (merged && merged.kr && merged.kr[lang]) || '';
        const actualMean = card?.querySelector('.bible-mean')?.textContent || '';
        check(actualMean === expectedMean, lang + ': word meaning mismatch');
        check(!card?.innerText.includes('Translation unavailable'), lang + ': word Translation unavailable label visible');
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
