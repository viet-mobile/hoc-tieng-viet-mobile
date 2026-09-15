import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(400)
        txt = await page.inner_text("#q-speaker")
        print("q-speaker text:", repr(txt))
        assert "전도인" not in txt, "leftover text found"
        print("OK - no leftover text")

        # full mobile overflow across all 8 tabs
        await page.set_viewport_size({"width": 360, "height": 800})
        tabs = ["wizard","reftable","vocab","theo","pron","bible","freq","grammar"]
        for t in tabs:
            await page.click(f'[data-tab="{t}"]')
            await page.wait_for_timeout(250)
            overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            print(f"tab {t} overflow:", overflow)
        await browser.close()

asyncio.run(main())
