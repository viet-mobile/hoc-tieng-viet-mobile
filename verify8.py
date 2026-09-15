import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":1000})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)

        # younger_than_parent, north -> should have a + no alt-parenthetical
        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.click('#q-gender .choice-btn[data-val="male"]')
        await page.click('#q-rel .choice-btn[data-val="younger_than_parent"]')
        await page.click('#q-region .choice-btn[data-val="north"]')
        await page.wait_for_timeout(150)
        txt_n = await page.inner_text("#result-wrap")
        print("=== younger_than_parent NORTH ===")
        print(txt_n[:400])

        await page.click('#q-region .choice-btn[data-val="south"]')
        await page.wait_for_timeout(150)
        txt_s = await page.inner_text("#result-wrap")
        print("=== younger_than_parent SOUTH ===")
        print(txt_s[:400])

        print("errors:", errors)
        await browser.close()

asyncio.run(main())
