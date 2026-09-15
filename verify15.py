import asyncio
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(500)

        # Go to freq vocab tab
        await page.click('[data-tab="freq"]')
        await page.wait_for_timeout(300)
        count_text = await page.inner_text("#freq-root .chain-note")
        print("freq note:", count_text)
        items = await page.locator("#freq-root .theo-item").count()
        print("freq items shown:", items)
        await page.fill("#freq-search", "học")
        await page.wait_for_timeout(200)
        note_el = page.locator("#freq-root .chain-note")
        if await note_el.count():
            print("freq search note:", await note_el.inner_text())
        else:
            print("freq search note: (empty-state)", await page.inner_text("#freq-root"))
        await page.fill("#freq-search", "")
        await page.wait_for_timeout(200)

        # Bible tab color check
        await page.click('[data-tab="bible"]')
        await page.wait_for_timeout(300)
        color = await page.eval_on_selector(".bible-word", "el => getComputedStyle(el).color")
        print("bible-word color:", color)
        accent_color = await page.eval_on_selector(":root", "el => getComputedStyle(el).getPropertyValue('--accent')")
        print("--accent:", accent_color)

        # Pron tab tone-pairs check
        await page.click('[data-tab="pron"]')
        await page.wait_for_timeout(300)
        cards = await page.locator("#pron-root .tone-pair-list .group-card").count()
        print("tone-pair group cards:", cards)
        # open first card
        await page.click("#pron-root .tone-pair-list .group-card:first-child .group-head")
        await page.wait_for_timeout(200)
        subcards = await page.locator("#pron-root .tone-pair-list .group-card:first-child .tone-pair-card").count()
        print("subcards in first group:", subcards)
        words_in_first = await page.locator("#pron-root .tone-pair-list .group-card:first-child .tp-word-row").count()
        print("word rows in first group (should be 6*4=24):", words_in_first)
        total_words = await page.locator("#pron-root .tone-pair-list .tp-word-row").count()
        # need to open all groups to count total; open all
        cards_all = await page.locator("#pron-root .tone-pair-list .group-card").all()
        for c in cards_all:
            await c.locator(".group-head").click()
        await page.wait_for_timeout(200)
        total_words = await page.locator("#pron-root .tone-pair-list .tp-word-row").count()
        print("total tone-pair words (should be 144):", total_words)

        # mobile viewport overflow check across all 7 tabs
        await page.set_viewport_size({"width": 360, "height": 800})
        tabs = ["wizard", "reftable", "vocab", "theo", "pron", "bible", "freq"]
        for t in tabs:
            await page.click(f'[data-tab="{t}"]')
            await page.wait_for_timeout(300)
            overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
            print(f"tab {t} horizontal overflow:", overflow)

        print("ERRORS:", errors)
        await browser.close()

asyncio.run(main())
