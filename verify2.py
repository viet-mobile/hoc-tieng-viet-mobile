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

        # fill name inputs
        await page.fill("#input-name-kr", "지훈")
        await page.fill("#input-name-vi", "Ji-hun")

        # choose brother, male listener, stranger_polite, 80+ bracket, north
        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.click('#q-gender .choice-btn[data-val="male"]')
        await page.click('#q-rel .choice-btn[data-val="stranger_polite"]')
        # agebracket group should now be visible
        visible = await page.is_visible("#qgroup-agebracket")
        print("agebracket visible after selecting stranger_polite:", visible)
        await page.click('#q-agebracket .choice-btn[data-val="80+"]')
        await page.click('#q-region .choice-btn[data-val="north"]')
        await page.wait_for_timeout(200)

        result_html = await page.inner_text("#result-wrap")
        print("=== stranger_polite 80+ result snippet ===")
        print(result_html[:400])

        # switch rel to elder_uncle_aunt and confirm agebracket hides, and check name substitution in stage text
        await page.click('#q-rel .choice-btn[data-val="elder_uncle_aunt"]')
        visible2 = await page.is_visible("#qgroup-agebracket")
        print("agebracket visible after selecting elder_uncle_aunt:", visible2)
        await page.click('#q-region .choice-btn[data-val="south"]')
        await page.wait_for_timeout(200)
        stage_text = await page.inner_text("#stage-body")
        print("=== elder_uncle_aunt south stage1 (should show con not cháu, and Ji-hun name in stage2) ===")
        print(stage_text[:300])

        # go to stage 2 for name check
        await page.click('.stage-pill[data-idx="1"]')
        await page.wait_for_timeout(150)
        stage2 = await page.inner_text("#stage-body")
        print("=== stage2 (name substitution check) ===")
        print(stage2[:400])

        print("errors:", errors)
        await browser.close()

asyncio.run(main())
