import asyncio
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" and "ERR_CONNECTION_RESET" not in msg.text else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(300)
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(200)

        # No people info filled at all -- default fallback behavior for cross-gender case
        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.click('#q-gender .choice-btn[data-val="female"]')
        await page.click('#q-rel .choice-btn[data-val="peer"]')
        await page.click('#q-region .choice-btn[data-val="south"]')
        await page.wait_for_timeout(200)
        note = await page.text_content(".companion-note span")
        print("default companion-note (no data):", note)
        assert "여성 자매" in note

        # peer rel + south region: Chung ta should remain unchanged (no compound for peer)
        pills = await page.query_selector_all("#stage-nav .stage-pill")
        found_raw_chungta = False
        for i in range(len(pills)):
            pills = await page.query_selector_all("#stage-nav .stage-pill")
            await pills[i].click()
            await page.wait_for_timeout(80)
            t = await page.text_content("#stage-body")
            if "úng ta" in t or "húng ta" in t:
                found_raw_chungta = True
        print("peer rel keeps raw Chung ta somewhere (expected True if used at all):", found_raw_chungta)

        # South region + elder_uncle_aunt rel (has region diff) to confirm compound uses south term variant
        await page.click('#q-rel .choice-btn[data-val="elder_uncle_aunt"]')
        await page.wait_for_timeout(150)
        pills = await page.query_selector_all("#stage-nav .stage-pill")
        compound_found = None
        for i in range(len(pills)):
            pills = await page.query_selector_all("#stage-nav .stage-pill")
            await pills[i].click()
            await page.wait_for_timeout(80)
            t = await page.text_content("#stage-body")
            if "mình" in t:
                compound_found = t
        print("south elder_uncle_aunt compound sample present:", compound_found is not None)

        print("errors:", errors)
        assert not errors
        await browser.close()
        print("ALL OK 2")

asyncio.run(main())
