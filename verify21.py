import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page_errors = []
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(400)
        syls = await page.evaluate("VOCAB_GROUPS.map(g=>g.syllable)")
        print("first 15:", syls[:15])
        print("last 10:", syls[-10:])
        print("count:", len(syls))
        print("PAGE ERRORS:", page_errors)
        await browser.close()

asyncio.run(main())
