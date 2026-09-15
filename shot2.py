import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":900}, color_scheme="dark")
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)
        await page.click('.tab-btn[data-tab="theo"]')
        await page.wait_for_timeout(200)
        await page.screenshot(path="shot_theo_dark2.png")  # viewport only

        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(150)
        await page.screenshot(path="shot_wizard_dark2.png")
        await browser.close()

asyncio.run(main())
