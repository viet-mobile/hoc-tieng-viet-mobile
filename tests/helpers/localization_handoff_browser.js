// Focused handoff checks, including deliberately missing learning translations.
module.exports = async function verifyLocalization(cdp, site) {
  for (const language of ['ko', 'en', 'cs', 'hu', 'id', 'vi', 'pl', 'zh_cn']) {
    const result = await cdp.send('Runtime.evaluate', {
      expression: `(() => {
        const errors = [];
        const check = (ok, message) => { if (!ok) errors.push(message); };
        const korean = /[가-힣]/;
        const click = selector => document.querySelector(selector)?.click();
        for (const lang of [${JSON.stringify(language)}]) {
          window.setLang(lang);
          click('[data-tab="wizard"]');
          click('[data-wizard="daily"]');
          const daily = document.querySelector('#curr-daily-root');
          check(daily?.querySelectorAll('.group-card').length === DAILY_CONVERSATIONS.length, lang + ': daily cards');
          check(daily?.querySelectorAll(':scope > .group-card').length === DAILY_CONVERSATIONS.length, lang + ': nested daily cards');
          const meanings = [...daily.querySelectorAll('.talk-kr-text, .word-row .m')].map(e => e.textContent).join(' ');
          check(lang === 'ko' || !korean.test(meanings), lang + ': Korean daily meaning');
          check(lang !== 'vi' || !meanings.trim(), 'vi: duplicate daily meaning');
          for (const [key, scope] of [['grammar','lessons'], ['wizard','daily']]) {
            const pool = window.reviewScopedPool(key, scope);
            check(lang === 'vi' || pool.length > 0, lang + ': empty ' + key + ' pool');
            check(lang === 'ko' || pool.every(p => !korean.test(p.kr)), lang + ': Korean review option ' + key);
          }
          click('[data-tab="grammar"]');
          click('[data-grammar="pdf"]');
          const groups = [...document.querySelectorAll('.pdf-subheading-group')];
          check(groups.length > 0, lang + ': grammar folding');
          check(document.querySelectorAll('.pdf-tr-vi .speak-btn, .pdf-subheading-body .speak-btn').length > 0, lang + ': grammar listening');
          if (lang !== 'ko') {
            const clone = document.querySelector('#pdf-grammar-root')?.cloneNode(true);
            check(!!clone, lang + ': grammar root');
            if (clone) {
              clone.querySelectorAll('.pdf-original-source').forEach(e => e.remove());
              check(!korean.test(clone.textContent), lang + ': Korean grammar fallback');
            }
          }
          click('[data-tab="vocab"]');
          click('[data-vocab="words"]');
          click('[data-vocab="wt"]');
          const weeks = [...document.querySelectorAll('#vocab-root .syl')];
          check(lang === 'ko' || weeks.every(e => !korean.test(e.textContent)), lang + ': Korean week label');
          click('[data-vocab="words"]');
          click('[data-wizard="culture"]');
          const labels = [...document.querySelectorAll('.word-freq-badge, .jw-freq-badge, .source-pill-song, .source-pill-elf, .culture-category-badge, [data-tts="windows"]')];
          check(labels.length > 0, lang + ': UI labels absent');
          check(lang === 'ko' || labels.every(e => !korean.test(e.textContent)), lang + ': Korean UI label');
        }
        if (${JSON.stringify(language)} === 'zh_cn') {
        // Missing en/ja/zh used to fall back to Korean, and zh could borrow zh_cn.
        const conv = DAILY_CONVERSATIONS[0];
        const originalVi = conv.turns[0].vi;
        conv.turns[0].vi = 'Câu kiểm tra bản dịch còn thiếu.';
        for (const lang of ['en', 'ja', 'zh', 'zh_cn']) {
          const fields = [conv.title, conv.turns[0], conv.vocab[0]];
          const saved = fields.map(f => ({present: Object.hasOwn(f, lang), value: f[lang]}));
          try {
            fields.forEach(f => delete f[lang]);
            window.setLang(lang);
            const card = document.querySelector('#curr-daily-root .group-card');
            const title = card.querySelector('.lff-title-translation');
            const turn = card.querySelector('.talk-line')?.querySelector('.talk-kr');
            check(!title, lang + ': missing title fallback: ' + title?.textContent);
            check(!turn, lang + ': missing turn fallback: ' + turn?.textContent);
            check(!window.reviewScopedPool('wizard','daily').some(p => p.vi === conv.turns[0].vi), lang + ': untranslated review turn retained');
          } finally {
            fields.forEach((f,i) => { if (saved[i].present) f[lang] = saved[i].value; else delete f[lang]; });
          }
        }
        conv.turns[0].vi = originalVi;
        window.setLang('ko');
        if (SITE_PROFILE !== 'general') {
          click('#people-me-gender [data-val="brother"]');
          click('#q-gender [data-val="sister"]');
          click('#q-rel [data-val="older_than_parent"]');
          click('#q-region [data-val="north"]');
          const scoped = window.reviewScopedPool('wizard', 'daily');
          const all = window.reviewScopedPool('wizard', 'all');
          const source = new Set(DAILY_CONVERSATIONS.flatMap(c => c.turns.map(t => t.vi)));
          const adapted = scoped.filter(p => !source.has(p.vi));
          check(adapted.length > 0, 'daily pronoun adaptation');
          check(adapted.every(p => all.some(q => q.vi === p.vi)), 'all review loses daily pronoun adaptation');
        }
        }
        check(GENERAL_PDF.sentences.length === 190, 'GENERAL 190 sentences');
        return errors;
      })()`, returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    if (result.result.value.length) throw new Error(JSON.stringify(result.result.value));
    console.log('  [PASS] ' + site + '/' + language + ': review, daily, grammar and UI');
    await cdp.send('HeapProfiler.collectGarbage');
  }
};
