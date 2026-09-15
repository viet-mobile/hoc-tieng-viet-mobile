import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":1200})
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)
        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.click('#q-gender .choice-btn[data-val="female"]')
        await page.click('#q-rel .choice-btn[data-val="stranger_polite"]')
        await page.wait_for_timeout(150)
        el = await page.query_selector('#qgroup-agebracket')
        await el.scroll_into_view_if_needed()
        await page.wait_for_timeout(100)
        await el.screenshot(path="shot_culture_note3.png")
        await browser.close()

asyncio.run(main())
