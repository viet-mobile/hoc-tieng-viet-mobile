import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":900})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)
        await page.screenshot(path="shot_names_v2.png", clip={"x":0,"y":0,"width":420,"height":500})
        print("errors:", errors)
        await browser.close()

asyncio.run(main())
