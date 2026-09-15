import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")

        # mobile light
        page = await browser.new_page(viewport={"width":420,"height":1100})
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)
        await page.screenshot(path="shot_wizard_mobile.png", full_page=True)

        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.wait_for_timeout(150)
        await page.screenshot(path="shot_choicebtn_spacing.png", clip={"x":0,"y":0,"width":420,"height":700})

        await page.click('#q-gender .choice-btn[data-val="male"]')
        await page.click('#q-rel .choice-btn[data-val="stranger_polite"]')
        await page.wait_for_timeout(150)
        await page.screenshot(path="shot_agebracket.png", full_page=True)

        # dark mode
        page2 = await browser.new_page(viewport={"width":420,"height":1100}, color_scheme="dark")
        await page2.goto("file:///home/claude/work/app.html")
        await page2.wait_for_timeout(300)
        await page2.click('.tab-btn[data-tab="theo"]')
        await page2.wait_for_timeout(200)
        await page2.screenshot(path="shot_theo_dark.png", full_page=True)

        await browser.close()

asyncio.run(main())
