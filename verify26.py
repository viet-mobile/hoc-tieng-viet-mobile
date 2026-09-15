import asyncio, json
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        page = await browser.new_page(viewport={'width':390,'height':844})
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto('file://' + __import__('os').path.abspath('app.html'))
        await page.wait_for_timeout(400)

        counts = await page.evaluate("""() => ({
            CASES: CASES.length,
            TONE_PAIRS: TONE_PAIRS.length,
            FREQ_VOCAB: FREQ_VOCAB.length,
            RHYME_words: RHYME_GROUPS.reduce((a,g)=>a+g.families.reduce((b,f)=>b+f.words.length,0),0),
            GROUPS_words: VOCAB_GROUPS.reduce((a,g)=>a+g.words.length,0),
            CHAIN_backbone: VOCAB_CHAIN.filter(x=>x.n!=null).length,
            GRAMMAR_UNITS: GRAMMAR_UNITS.length,
            GRAMMAR_STEPS: GRAMMAR_UNITS.reduce((a,u)=>a+u.steps.length,0),
            UNIT8_STEPS: GRAMMAR_UNITS[7].steps.length,
        })""")
        print("COUNTS:", json.dumps(counts, ensure_ascii=False))

        tabs = ["wizard","reftable","vocab","theo","pron","bible","freq","grammar"]
        for tab in tabs:
            await page.click(f'[data-tab="{tab}"]')
            await page.wait_for_timeout(150)
            trigger = page.locator(f'.study-trigger-btn[data-study="{tab}"]')
            await trigger.scroll_into_view_if_needed()
            await trigger.click()
            await page.wait_for_timeout(200)

            overlay_hidden = await page.evaluate("document.getElementById('study-overlay').hidden")
            title = await page.locator('#study-modal-title').inner_text()

            modes_report = {}
            for mode in ["flash","mcq","order","type"]:
                await page.click(f'.study-mode-btn[data-mode="{mode}"]')
                await page.wait_for_timeout(150)
                body_text = await page.locator('#study-body').inner_text()
                is_empty = "복습할 자료가 없어요" in body_text
                modes_report[mode] = "EMPTY" if is_empty else "OK(len=%d)" % len(body_text)

                if mode == "flash" and not is_empty:
                    # test flip, next, replay
                    await page.click('#flash-card')
                    await page.wait_for_timeout(80)
                    await page.click('#flash-next')
                    await page.wait_for_timeout(80)
                elif mode == "mcq" and not is_empty:
                    choice_count = await page.locator('#mcq-choices .study-mcq-choice').count()
                    modes_report["mcq_choices"] = choice_count
                    if choice_count:
                        await page.locator('#mcq-choices .study-mcq-choice').first.click()
                        await page.wait_for_timeout(100)
                        next_btn = page.locator('#mcq-next')
                        if await next_btn.count():
                            await next_btn.click()
                            await page.wait_for_timeout(80)
                elif mode == "order" and not is_empty:
                    chip_count = await page.locator('#order-bank .study-chip').count()
                    modes_report["order_chips"] = chip_count
                    # click all chips in bank order (likely produces wrong order but tests completion path)
                    for _ in range(chip_count):
                        chip = page.locator('#order-bank .study-chip').first
                        if await chip.count():
                            await chip.click()
                            await page.wait_for_timeout(50)
                    await page.wait_for_timeout(100)
                    fb = await page.locator('#order-feedback').inner_text()
                    modes_report["order_feedback"] = fb[:20]
                elif mode == "type" and not is_empty:
                    await page.fill('#type-input', 'test')
                    await page.click('#type-submit')
                    await page.wait_for_timeout(80)
                    fb = await page.locator('#type-feedback').inner_text()
                    modes_report["type_feedback"] = fb[:20]

            print(tab, "title=", title, "overlay_hidden_after_open=", overlay_hidden, modes_report)

            # check no horizontal overflow while modal open
            sw = await page.evaluate("document.documentElement.scrollWidth")
            cw = await page.evaluate("document.documentElement.clientWidth")
            if sw > cw + 2:
                print("  OVERFLOW while modal open on", tab, sw, cw)

            await page.click('#study-close')
            await page.wait_for_timeout(100)
            overlay_hidden2 = await page.evaluate("document.getElementById('study-overlay').hidden")
            if not overlay_hidden2:
                print("  WARNING: overlay did not close for", tab)

        print("CONSOLE/PAGE ERRORS:", [e for e in errors if 'ERR_CONNECTION_RESET' not in e])
        await browser.close()

asyncio.run(main())
