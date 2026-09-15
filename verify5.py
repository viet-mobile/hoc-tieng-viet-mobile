import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        for vp, cs in [((420,900), "light"), ((1280,900), "light"), ((420,900), "dark")]:
            page = await browser.new_page(viewport={"width":vp[0],"height":vp[1]}, color_scheme=cs)
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type=="error" and "ERR_CONNECTION_RESET" not in m.text and "net::" not in m.text else None)
            await page.goto("file:///home/claude/work/app.html")
            await page.wait_for_timeout(300)
            for tab in ["wizard","reftable","vocab","theo","pron"]:
                await page.click(f'.tab-btn[data-tab="{tab}"]')
                await page.wait_for_timeout(150)
            # exercise vocab subtabs
            await page.click('.tab-btn[data-tab="vocab"]')
            await page.click('.subtab-btn[data-vocab="groups"]')
            await page.wait_for_timeout(150)
            await page.click('.subtab-btn[data-vocab="chain"]')
            await page.wait_for_timeout(150)
            # practice mode + full wizard flow
            await page.click('.tab-btn[data-tab="wizard"]')
            await page.click('#q-speaker .choice-btn[data-val="sister"]')
            await page.click('#q-gender .choice-btn[data-val="female"]')
            await page.click('#q-rel .choice-btn[data-val="peer"]')
            await page.click('#q-region .choice-btn[data-val="south"]')
            await page.wait_for_timeout(150)
            await page.click('#practice-switch')
            await page.wait_for_timeout(100)
            print(f"vp={vp} cs={cs} errors={errors}")
            await page.close()
        await browser.close()

asyncio.run(main())
