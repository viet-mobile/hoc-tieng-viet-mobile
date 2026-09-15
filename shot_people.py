import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # light, mobile width
        page = await browser.new_page(viewport={"width": 390, "height": 900})
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(300)
        el = await page.query_selector("#people-section-root")
        await el.screenshot(path="shot_people_light_mobile.png")
        await page.close()

        # dark, desktop width
        page = await browser.new_page(viewport={"width": 1280, "height": 1000}, color_scheme="dark")
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(300)
        el = await page.query_selector("#people-section-root")
        await el.screenshot(path="shot_people_dark_desktop.png")

        # companion term note visible state
        await page.click('#people-me-gender .mini-btn[data-val="brother"]')
        await page.fill("#people-me-age", "30")
        await page.fill("#people-comp-namekr", "지현")
        await page.fill("#people-comp-namevi", "Trang")
        await page.click('#people-comp-gender .mini-btn[data-val="sister"]')
        await page.fill("#people-comp-age", "8")
        await page.click('#people-comp-region .mini-btn[data-val="south"]')
        await page.wait_for_timeout(200)
        el = await page.query_selector("#people-section-root")
        await el.screenshot(path="shot_people_dark_filled.png")

        # talks tab summary card
        await page.click('.subtab-btn[data-wizard="talks"]')
        await page.wait_for_timeout(300)
        el2 = await page.query_selector("#people-summary-root")
        await el2.screenshot(path="shot_people_summary.png")

        await browser.close()

asyncio.run(main())
