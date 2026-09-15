import asyncio
from playwright.async_api import async_playwright

async def main():
    page_errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(500)
        n_cases = await page.evaluate("CASES.length")
        print("CASES length:", n_cases)
        n_tone_pairs = await page.evaluate("TONE_PAIRS.length")
        print("TONE_PAIRS length (embedded):", n_tone_pairs)
        n_freq = await page.evaluate("FREQ_VOCAB.length")
        print("FREQ_VOCAB length (embedded):", n_freq)
        print("PAGE ERRORS:", page_errors)
        await browser.close()

asyncio.run(main())
