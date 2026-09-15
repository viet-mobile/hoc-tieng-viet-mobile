import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width":1280,"height":900})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)

        # wizard label + h2
        h2 = await page.inner_text('#panel-wizard .intro h2')
        subtab_label = await page.inner_text('.subtab-btn[data-wizard="main"]')
        print("wizard h2:", h2)
        print("wizard subtab label:", subtab_label)
        full_text = await page.inner_text('#panel-wizard')
        print("contains 마법사:", "마법사" in full_text)

        # pron subtab position relative to study button
        order = await page.eval_on_selector_all('#panel-pron > *', "els => els.map(e => e.id || e.className)")
        print("pron panel child order:", order)

        # grammar unit 1
        await page.click('.tab-btn[data-tab="grammar"]')
        await page.wait_for_timeout(150)
        unit1_title = await page.inner_text('#grammar-units-root .group-card:first-child .syl')
        print("unit1 title:", unit1_title)
        # open it (should be open by default per data-open=true for ui==0)
        steps_kr = await page.eval_on_selector_all('#grammar-units-root .group-card:first-child .gr-step-kr', "els => els.map(e => e.textContent)")
        print("unit1 example sentences:", steps_kr)

        print("CONSOLE/PAGE ERRORS:", [e for e in errors if 'ERR_CONNECTION_RESET' not in e])
        await browser.close()

asyncio.run(main())
