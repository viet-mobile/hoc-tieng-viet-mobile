import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(500)

        # go to bible tab, numbers subtab
        await page.click('.tabs button[data-tab="bible"]')
        await page.wait_for_timeout(200)
        await page.click('#panel-bible .subtab-btn[data-bible="numbers"]')
        await page.wait_for_timeout(200)

        figures = await page.eval_on_selector_all(
            '#bible-numbers-root .num-figure',
            'els => els.map(e => e.textContent.trim())'
        )
        print("All number figures in order:")
        print(figures)

        # check ordering around 20s/30s and hundreds
        idx20 = figures.index('20')
        print("sequence after 20:", figures[idx20:idx20+5])
        idx90 = figures.index('90')
        print("sequence after 90:", figures[idx90:idx90+5])
        assert '200' in figures and '900' in figures, "hundreds missing"
        idx100 = figures.index('100')
        idx200 = figures.index('200')
        print("100 idx", idx100, "200 idx", idx200)

        print("console/page errors:", errors)
        await browser.close()

asyncio.run(main())
