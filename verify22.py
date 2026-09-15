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

        n_intro = await page.evaluate("GRAMMAR_INTRO.length")
        n_units = await page.evaluate("GRAMMAR_UNITS.length")
        print("GRAMMAR_INTRO:", n_intro, "GRAMMAR_UNITS:", n_units)

        await page.click('[data-tab="grammar"]')
        await page.wait_for_timeout(400)
        intro_cards = await page.locator("#grammar-intro-root .gr-intro-card").count()
        unit_cards = await page.locator("#grammar-units-root .group-card").count()
        print("intro cards rendered:", intro_cards, "unit cards rendered:", unit_cards)

        # open all unit cards, count steps
        cards = await page.locator("#grammar-units-root .group-card").all()
        for c in cards:
            await c.locator(".group-head").click()
        await page.wait_for_timeout(300)
        steps = await page.locator("#grammar-units-root .gr-step").count()
        print("total steps rendered:", steps)

        # try a speak button click (won't actually speak in headless but check no crash)
        btns = await page.locator("#panel-grammar .speak-btn").count()
        print("speak buttons:", btns)

        # mobile overflow check
        await page.set_viewport_size({"width": 360, "height": 800})
        overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        print("grammar tab mobile overflow:", overflow)

        print("PAGE ERRORS:", page_errors)
        print("CONSOLE ERRORS:", [e for e in console_errors if "ERR_CONNECTION_RESET" not in e])
        await browser.close()

asyncio.run(main())
