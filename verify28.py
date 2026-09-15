import asyncio, json
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        page = await browser.new_page(viewport={'width':375,'height':812})
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto('file://' + __import__('os').path.abspath('app.html'))
        await page.wait_for_timeout(300)

        counts = await page.evaluate("""() => ({
            CASES: CASES.length, TONE_PAIRS: TONE_PAIRS.length, FREQ_VOCAB: FREQ_VOCAB.length,
            RHYME_words: RHYME_GROUPS.reduce((a,g)=>a+g.families.reduce((b,f)=>b+f.words.length,0),0),
            GROUPS_words: VOCAB_GROUPS.reduce((a,g)=>a+g.words.length,0),
            CHAIN_backbone: VOCAB_CHAIN.filter(x=>x.n!=null).length,
            GRAMMAR_UNITS: GRAMMAR_UNITS.length, GRAMMAR_STEPS: GRAMMAR_UNITS.reduce((a,u)=>a+u.steps.length,0),
            SB_PRONOUNS: SB_PRONOUNS.length, SB_NOUN_SUBJECTS: SB_NOUN_SUBJECTS.length,
            SB_INTRANS: SB_INTRANS_VERBS.length, SB_TRANS: SB_TRANS_VERBS.length,
            SB_AUX: SB_AUX_VERBS.length, SB_OBJ: SB_OBJECT_NOUNS.length, SB_ADJ: SB_ADJECTIVES.length,
            SB_CONN: SB_CONNECTIVES.length, SB_TIME: SB_TIME_ADV.length, SB_PLACE: SB_PLACE_ADV.length,
            SB_MANNER: SB_MANNER_ADV.length, SB_STYPES: SB_SENTENCE_TYPES.length, SB_WH: SB_WH_WORDS.length,
        })""")
        print("COUNTS:", json.dumps(counts, ensure_ascii=False))

        # grammar tab subtab toggle
        await page.click('[data-tab="grammar"]')
        await page.wait_for_timeout(150)
        lessons_visible_initially = await page.is_visible('#grammar-lessons-root, #grammar-intro-root')
        await page.click('.subtab-btn[data-grammar="builder"]')
        await page.wait_for_timeout(150)
        builder_visible = await page.is_visible('#grammar-builder-panel')
        lessons_hidden = not await page.is_visible('#grammar-lessons-panel')
        print("builder toggle: builder_visible=", builder_visible, "lessons_hidden=", lessons_hidden)

        # default happy-path generate (no changes) -- real animation this time
        await page.click('#sb-generate')
        await page.wait_for_timeout(2200)  # let full animation + speak sequence finish
        result_html = await page.locator('#sb-result').inner_html()
        has_result_card = 'sb-result-card' in result_html
        vi_text = await page.locator('.sb-result-vi').inner_text()
        kr_text = await page.locator('.sb-result-kr').inner_text()
        print("default generate: has_result_card=", has_result_card, "vi=", vi_text.strip(), "kr=", kr_text.strip())

        # overflow check across all 8 tabs (including grammar w/ builder result showing)
        tabs = ["wizard","reftable","vocab","theo","pron","bible","freq","grammar"]
        overflow_issues = []
        for tab in tabs:
            await page.click(f'[data-tab="{tab}"]')
            await page.wait_for_timeout(150)
            sw = await page.evaluate("document.documentElement.scrollWidth")
            cw = await page.evaluate("document.documentElement.clientWidth")
            if sw > cw + 2:
                overflow_issues.append((tab, sw, cw))
        print("Overflow issues:", overflow_issues)

        # narrow viewport (320px) check specifically for the sentence-builder form/result
        await page.set_viewport_size({'width':320,'height':700})
        await page.click('[data-tab="grammar"]')
        await page.wait_for_timeout(150)
        await page.click('.subtab-btn[data-grammar="builder"]')
        await page.wait_for_timeout(150)
        sw2 = await page.evaluate("document.documentElement.scrollWidth")
        cw2 = await page.evaluate("document.documentElement.clientWidth")
        print("320px builder form overflow:", sw2 > cw2 + 2, sw2, cw2)

        # dark mode sanity
        await page.emulate_media(color_scheme="dark")
        await page.wait_for_timeout(150)
        bg = await page.evaluate("getComputedStyle(document.body).backgroundColor")
        print("dark mode body bg:", bg)

        print("CONSOLE/PAGE ERRORS:", [e for e in errors if 'ERR_CONNECTION_RESET' not in e])
        await browser.close()

asyncio.run(main())
