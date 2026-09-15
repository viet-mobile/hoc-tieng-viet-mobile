import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)
        await page.click('[data-tab="wizard"]')
        await page.click('#q-speaker [data-val="sister"]')
        await page.click('#q-gender [data-val="female"]')
        await page.click('#q-rel [data-val="peer"]')
        await page.click('#q-region [data-val="south"]')
        await page.wait_for_timeout(200)
        pills = await page.locator("#stage-nav .stage-pill").all()
        await pills[len(pills) - 1].click()
        await page.wait_for_timeout(150)
        txt = await page.inner_text("#stage-body")
        print(txt[:800])
        print("mình/bạn present:", "mình" in txt, "bạn" in txt, "| tớ/cậu leaked:", "tớ " in txt or " cậu" in txt)
        print("PAGE ERRORS:", errors)
        await browser.close()

asyncio.run(main())
