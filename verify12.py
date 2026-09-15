import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" and "net::" not in m.text else None)
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)

        # 1) rhyme correspondence tab
        await page.click('[data-tab="vocab"]')
        await page.click('.subtab-btn[data-vocab="rhyme"]')
        await page.wait_for_timeout(200)
        cards = await page.locator("#vocab-root .group-card").all()
        print("rhyme group cards:", len(cards))
        await cards[0].locator(".group-head").click()
        await page.wait_for_timeout(150)
        txt = await page.inner_text("#vocab-root")
        print("has cường:", "cường" in txt, "| has 中央-style note:", "trung ương" in txt)
        # search
        await page.fill("#vocab-search", "가정")
        await page.wait_for_timeout(150)
        txt2 = await page.inner_text("#vocab-root")
        print("search 'gia đình' hits:", "gia đình" in txt2 or "đình" in txt2)
        await page.fill("#vocab-search", "")

        # 2) pronunciation tab: consonant letter styling + lowercase + examples
        await page.click('[data-tab="pron"]')
        await page.wait_for_timeout(200)
        cons_letter = page.locator(".pron-letters.cons-letters").first
        txt_letter = await cons_letter.inner_text()
        fs = await cons_letter.evaluate("el => getComputedStyle(el).fontSize")
        fw = await cons_letter.evaluate("el => getComputedStyle(el).fontWeight")
        tone_a = page.locator(".tone-mark .ch").first
        tone_fs = await tone_a.evaluate("el => getComputedStyle(el).fontSize")
        tone_fw = await tone_a.evaluate("el => getComputedStyle(el).fontWeight")
        print("cons letter text:", repr(txt_letter), "font-size:", fs, "weight:", fw)
        print("tone a font-size:", tone_fs, "weight:", tone_fw)
        print("match:", fs == tone_fs and fw == tone_fw)
        full_pron_text = await page.inner_text("#pron-root")
        print("has 'bơ':", "bơ" in full_pron_text, "| has 'dơ':", "dơ" in full_pron_text, "| leftover 'bê' as example:", "ba, bê" in full_pron_text)
        print("no uppercase B label:", "B" not in [l.strip() for l in [await x.inner_text() for x in await page.locator('.cons-letters').all()]])

        print("ERRORS:", errs)
        await browser.close()

asyncio.run(main())
