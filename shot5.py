import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":1200})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)
        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.click('#q-gender .choice-btn[data-val="female"]')
        await page.click('#q-rel .choice-btn[data-val="stranger_polite"]')
        await page.wait_for_timeout(150)
        await page.screenshot(path="shot_culture_note.png", clip={"x":0,"y":600,"width":420,"height":300})

        for tab in ["reftable","vocab","theo","pron"]:
            await page.click(f'.tab-btn[data-tab="{tab}"]')
            await page.wait_for_timeout(150)
        print("errors:", errors)
        await browser.close()

asyncio.run(main())
