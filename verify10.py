import asyncio, re
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(500)

        combos = [
            ("brother", "male", "younger_sibling", None),
            ("sister", "female", "peer", None),
            ("brother", "female", "older_sibling", None),
            ("sister", "male", "younger_than_parent", None),
            ("brother", "male", "elder_uncle_aunt", None),
            ("sister", "female", "elder_parent_age", None),
            ("brother", "male", "stranger_polite", "2030"),
            ("sister", "female", "stranger_polite", "80+"),
        ]

        for speaker, lgender, rel, bracket in combos:
            await page.click(f'[data-tab="wizard"]')
            await page.click(f'#q-speaker [data-val="{speaker}"]')
            await page.click(f'#q-gender [data-val="{lgender}"]')
            await page.click(f'#q-rel [data-val="{rel}"]')
            if bracket:
                await page.click(f'#q-agebracket [data-val="{bracket}"]')
            await page.click(f'#q-region [data-val="north"]')
            await page.wait_for_timeout(200)
            pills = await page.locator("#stage-nav .stage-pill").all()
            n = len(pills)
            # second-to-last stage = original final stage (should now have lamp illustration)
            await pills[n - 2].click()
            await page.wait_for_timeout(150)
            lamp_txt = await page.inner_text("#stage-body")
            has_lamp = "손전등" in lamp_txt or "등불" in lamp_txt
            # last stage = new bonus stage
            await pills[n - 1].click()
            await page.wait_for_timeout(150)
            extra_txt = await page.inner_text("#stage-body")
            has_extra = "여호와" in extra_txt and "4" in extra_txt
            print(speaker, lgender, rel, bracket, "| stages:", n, "| lamp_in_prev_final:", has_lamp, "| extra_ok:", has_extra)
            if not has_extra:
                print("  EXTRA TEXT:", extra_txt[:300])

        print("CONSOLE/PAGE ERRORS:", errors)
        await browser.close()

asyncio.run(main())
