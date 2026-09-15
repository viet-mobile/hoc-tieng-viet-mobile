import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(400)
        await page.click('[data-tab="vocab"]')
        await page.wait_for_timeout(200)
        await page.locator('.subtab-btn[data-vocab="rhyme"]').click()
        await page.wait_for_timeout(300)
        cards = await page.locator("#vocab-root .group-card").all()
        for c in cards:
            await c.locator(".group-head").click()
        await page.wait_for_timeout(300)
        rows = await page.locator("#vocab-root .rhyme-word-row").count()
        print("total rhyme word rows visible:", rows)
        # check families count per group
        families = await page.locator("#vocab-root .rhyme-family").count()
        print("total families:", families)

        # mobile overflow check across vocab subtabs
        await page.set_viewport_size({"width": 360, "height": 800})
        for sub in ["rhyme","groups","chain"]:
            await page.locator(f'.subtab-btn[data-vocab="{sub}"]').click()
            await page.wait_for_timeout(300)
            overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            print(f"subtab {sub} overflow:", overflow)
        await browser.close()

asyncio.run(main())
