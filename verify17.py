import asyncio
from playwright.async_api import async_playwright

async def main():
    page_errors = []
    console_errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(500)

        n_cases = await page.evaluate("CASES.length")
        n_freq = await page.evaluate("FREQ_VOCAB.length")
        n_rhyme_words = await page.evaluate("RHYME_GROUPS.reduce((s,g)=>s+g.families.reduce((s2,f)=>s2+f.words.length,0),0)")
        n_tone_pairs = await page.evaluate("TONE_PAIRS.length")
        print("CASES:", n_cases, "FREQ_VOCAB:", n_freq, "RHYME words:", n_rhyme_words, "TONE_PAIRS:", n_tone_pairs)

        # freq tab full render count
        await page.click('[data-tab="freq"]')
        await page.wait_for_timeout(500)
        items = await page.locator("#freq-root .theo-item").count()
        note = await page.inner_text("#freq-root .chain-note")
        print("freq items rendered:", items, "| note:", note)

        # vocab tab -> rhyme subtab render check
        await page.click('[data-tab="vocab"]')
        await page.wait_for_timeout(300)
        rhyme_btn = page.locator('.subtab-btn[data-vocab="rhyme"]')
        if await rhyme_btn.count():
            await rhyme_btn.click()
            await page.wait_for_timeout(300)
        cards = await page.locator("#vocab-root .group-card").count()
        print("rhyme group-cards (should be 7):", cards)

        # bible tab -> numbers 10-oku overlap check
        await page.click('[data-tab="bible"]')
        await page.wait_for_timeout(300)
        rows = await page.locator(".num-row").all()
        overlap_found = False
        for r in rows:
            fig = r.locator(".num-figure")
            body = r.locator(".num-body")
            fb = await fig.bounding_box()
            bb = await body.bounding_box()
            if fb and bb and fb["x"] + fb["width"] > bb["x"] + 2:
                overlap_found = True
                txt = await fig.inner_text()
                print("OVERLAP at figure:", txt, fb, bb)
        print("num-row overlap found:", overlap_found)

        print("PAGE ERRORS:", page_errors)
        print("CONSOLE ERRORS:", console_errors)
        await browser.close()

asyncio.run(main())
