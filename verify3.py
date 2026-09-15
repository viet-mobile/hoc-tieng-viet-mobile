import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":1000})
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(200)
        await page.fill("#input-name-kr", "지훈")
        await page.fill("#input-name-vi", "Ji-hun")
        val = await page.evaluate("() => ({krInput: document.getElementById('input-name-kr').value})")
        print("input value:", val)
        # can't access userNameKr directly (closure), test via wordReplace behavior indirectly using window hack not available.
        # Instead just re-render and check translation text now.
        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.click('#q-gender .choice-btn[data-val="male"]')
        await page.click('#q-rel .choice-btn[data-val="elder_uncle_aunt"]')
        await page.click('#q-region .choice-btn[data-val="north"]')
        await page.click('.stage-pill[data-idx="1"]')
        await page.wait_for_timeout(200)
        txt = await page.inner_text("#stage-body")
        print(txt[:300])
        await browser.close()

asyncio.run(main())
