import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":1000})
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)
        await page.click('#q-speaker .choice-btn[data-val="sister"]')
        await page.click('#q-gender .choice-btn[data-val="female"]')
        await page.click('#q-rel .choice-btn[data-val="peer"]')
        await page.click('#q-region .choice-btn[data-val="south"]')
        await page.wait_for_timeout(150)
        txt = await page.inner_text("#result-wrap")
        print("=== peer south (sister/female) ===")
        print(txt[:500])
        await page.click('#q-region .choice-btn[data-val="north"]')
        await page.wait_for_timeout(150)
        txt2 = await page.inner_text("#result-wrap")
        print("=== peer north ===")
        print(txt2[:500])
        await browser.close()

asyncio.run(main())
