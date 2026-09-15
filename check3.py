from playwright.sync_api import sync_playwright

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":420,"height":1000})
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.goto("file:///home/claude/work/app.html")
    page.wait_for_timeout(300)

    page.click('#q-speaker [data-val="brother"]')
    page.click('#q-gender [data-val="female"]')
    page.click('#q-rel [data-val="peer"]')
    page.click('#q-region [data-val="south"]')
    page.wait_for_timeout(200)
    title = page.text_content('.stage-nav')
    print("brother/female/peer stage nav:", title[:80])

    # iterate all 20 combos programmatically via JS to check data integrity
    combos_report = page.evaluate("""
    () => {
      const speakers=['brother','sister'], genders=['male','female'],
            rels=['younger_sibling','peer','older_sibling','younger_than_parent','older_than_parent'];
      let out = [];
      for (const sp of speakers) for (const g of genders) for (const r of rels) {
        const c = CASES.find(x=>x.speaker===sp && x.listener_gender===g && x.rel===r);
        if (!c) { out.push(`MISSING ${sp}/${g}/${r}`); continue; }
        const stageNames = Object.keys(c.stages);
        let issue = null;
        for (const sn of stageNames) {
          for (const it of c.stages[sn]) {
            if (!it.viet || !it.translation || !it.gloss) { issue = 'empty field in '+sn; }
            if (it.reply && !/^[^:]+:\\s*.+—.+$/.test(it.reply)) { issue = 'bad reply format in '+sn+': '+it.reply; }
          }
        }
        out.push(`${sp}/${g}/${r}: stages=${stageNames.length} same_sex=${c.same_sex} self=${c.self_term}/${c.self_term_south} listen=${c.listener_term} ${issue?('ISSUE: '+issue):'OK'}`);
      }
      return out;
    }
    """)
    for line in combos_report:
        print(line)
    browser.close()

print("errors:", errors)
