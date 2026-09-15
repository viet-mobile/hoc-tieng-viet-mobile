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
        n_rhyme = await page.evaluate("RHYME_GROUPS.reduce((s,g)=>s+g.families.reduce((s2,f)=>s2+f.words.length,0),0)")
        n_chain = await page.evaluate("VOCAB_CHAIN.filter(x=>x.n).length")
        n_groups_w = await page.evaluate("VOCAB_GROUPS.reduce((s,g)=>s+g.words.length,0)")
        n_freq = await page.evaluate("FREQ_VOCAB.length")
        print("CASES:", n_cases, "RHYME words:", n_rhyme, "CHAIN backbone:", n_chain, "GROUPS words:", n_groups_w, "FREQ:", n_freq)

        await page.click('[data-tab="vocab"]')
        await page.wait_for_timeout(300)
        # subtab order check
        labels = await page.locator(".subtab-btn").all_inner_texts()
        print("subtab order:", labels)

        # click groups
        await page.locator('.subtab-btn[data-vocab="groups"]').click()
        await page.wait_for_timeout(300)
        gcards = await page.locator("#vocab-root .group-card").count()
        print("groups cards:", gcards)

        # click chain
        await page.locator('.subtab-btn[data-vocab="chain"]').click()
        await page.wait_for_timeout(300)
        chain_items = await page.locator("#vocab-root .chain-item").count()
        print("chain items rendered:", chain_items)

        # click rhyme
        await page.locator('.subtab-btn[data-vocab="rhyme"]').click()
        await page.wait_for_timeout(300)
        rcards = await page.locator("#vocab-root .group-card").count()
        print("rhyme cards:", rcards)

        print("PAGE ERRORS:", page_errors)
        print("CONSOLE ERRORS:", [e for e in console_errors if "ERR_CONNECTION_RESET" not in e])
        await browser.close()

asyncio.run(main())
