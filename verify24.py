import asyncio
from playwright.async_api import async_playwright

async def main():
    page_errors = []
    console_errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(500)
        await page.click('[data-tab="grammar"]')
        await page.wait_for_timeout(400)

        # check column alignment: each gr-align-col should have vi on top, kr below, horizontally centered
        cols = await page.locator(".gr-align-col").all()
        print("total align cols:", len(cols))
        bad = 0
        for c in cols[:8]:
            vi_box = await c.locator(".gr-align-vi").bounding_box()
            kr_box = await c.locator(".gr-align-kr").bounding_box()
            vi_center = vi_box["x"] + vi_box["width"]/2
            kr_center = kr_box["x"] + kr_box["width"]/2
            if abs(vi_center - kr_center) > 2:
                bad += 1
        print("misaligned among first 8:", bad)

        txt = await page.locator(".gr-align-row").first.inner_text()
        print("first row text:", repr(txt))

        # open all unit cards
        cards = await page.locator("#grammar-units-root .group-card").all()
        for c in cards:
            await c.locator(".group-head").click()
        await page.wait_for_timeout(300)
        steps = await page.locator("#grammar-units-root .gr-step").count()
        print("total steps:", steps)

        await page.set_viewport_size({"width": 360, "height": 800})
        overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        print("mobile overflow:", overflow)

        print("PAGE ERRORS:", page_errors)
        print("CONSOLE ERRORS:", [e for e in console_errors if "ERR_CONNECTION_RESET" not in e])
        await browser.close()

asyncio.run(main())
