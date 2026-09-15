import asyncio, json
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        page = await browser.new_page(viewport={'width':1280,'height':900})
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto('file://' + __import__('os').path.abspath('app.html'))
        await page.wait_for_timeout(500)

        # Data sanity checks
        counts = await page.evaluate("""() => ({
            CASES: CASES.length,
            TONE_PAIRS: TONE_PAIRS.length,
            FREQ_VOCAB: FREQ_VOCAB.length,
            RHYME_words: RHYME_GROUPS.reduce((a,g)=>a+g.families.reduce((b,f)=>b+f.words.length,0),0),
            GROUPS_words: VOCAB_GROUPS.reduce((a,g)=>a+g.words.length,0),
            GROUPS_count: VOCAB_GROUPS.length,
            CHAIN_backbone: VOCAB_CHAIN.filter(x=>x.n!=null).length,
            GRAMMAR_UNITS: GRAMMAR_UNITS.length,
            GRAMMAR_STEPS: GRAMMAR_UNITS.reduce((a,u)=>a+u.steps.length,0),
        })""")
        print("COUNTS:", json.dumps(counts, ensure_ascii=False))

        # Check chain ordering integrity
        chain_ok = await page.evaluate("""() => {
            const chain = VOCAB_CHAIN.filter(x=>x.n!=null).sort((a,b)=>a.n-b.n);
            let breaks = 0;
            for (let i=0;i<chain.length-1;i++){
                const cur = chain[i].word.trim();
                const next = chain[i+1].word.trim();
                const curSyllables = cur.split(/\\s+/);
                const nextSyllables = next.split(/\\s+/);
                const lastSyl = curSyllables[curSyllables.length-1];
                const firstSyl = nextSyllables[0];
                if (lastSyl.normalize('NFC') !== firstSyl.normalize('NFC')) breaks++;
            }
            return breaks;
        }""")
        print("CHAIN_BREAKS:", chain_ok)

        # Navigate to grammar tab
        await page.click('[data-tab="grammar"]')
        await page.wait_for_timeout(300)
        unit_cards = await page.locator('#panel-grammar .group-card').count()
        print("GRAMMAR unit cards rendered:", unit_cards)

        # Get unit titles
        titles = await page.locator('#panel-grammar .group-card .syl').all_inner_texts()
        for t in titles:
            print(" -", t)

        # Open each unit and check for alignment + no overflow issues
        for i in range(unit_cards):
            card = page.locator('#panel-grammar .group-card').nth(i)
            await card.locator('.group-head').click()
            await page.wait_for_timeout(50)

        await page.wait_for_timeout(200)
        # check gr-align-row col counts match pairs (spot check via DOM)
        align_rows = await page.locator('#panel-grammar .gr-align-row').count()
        print("Total gr-align-row elements:", align_rows)

        # Mobile viewport overflow check across all 8 tabs
        await page.set_viewport_size({'width':360,'height':800})
        tabs = await page.locator('.tab-btn').all()
        tab_data_attrs = []
        for t in tabs:
            attr = await t.get_attribute('data-tab')
            tab_data_attrs.append(attr)
        print("Tabs found:", tab_data_attrs)
        overflow_issues = []
        for attr in tab_data_attrs:
            await page.click(f'[data-tab="{attr}"]')
            await page.wait_for_timeout(200)
            sw = await page.evaluate("document.documentElement.scrollWidth")
            cw = await page.evaluate("document.documentElement.clientWidth")
            if sw > cw + 2:
                overflow_issues.append((attr, sw, cw))
        print("Overflow issues:", overflow_issues)

        print("CONSOLE/PAGE ERRORS:", errors)
        await browser.close()

asyncio.run(main())
