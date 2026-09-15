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
        await page.click('[data-tab="pron"]')
        await page.wait_for_timeout(200)

        txt = await page.inner_text("#pron-root")
        print("has NS section:", "북부 발음과 남부 발음의 차이" in txt)
        print("has d,gi,r card:", "d, gi, r" in txt)
        print("no leftover uppercase in alphabet note:", "F, J, W, Z" not in txt)

        vow_letters = await page.locator(".pron-letters.big-letters").all()
        print("big-letters count (cons+vowels):", len(vow_letters))
        texts = [await x.inner_text() for x in vow_letters]
        print("any uppercase leaked among vowel/cons letters:", any(t != t.lower() for t in texts))

        # check a vowel letter styling matches tone 'a'
        vow_el = page.locator(".pron-letters.big-letters").nth(len(vow_letters)-3)
        fs = await vow_el.evaluate("el => getComputedStyle(el).fontSize")
        fw = await vow_el.evaluate("el => getComputedStyle(el).fontWeight")
        tone_a = page.locator(".tone-mark .ch").first
        tone_fs = await tone_a.evaluate("el => getComputedStyle(el).fontSize")
        tone_fw = await tone_a.evaluate("el => getComputedStyle(el).fontWeight")
        print("vowel letter font matches tone a:", fs == tone_fs and fw == tone_fw, fs, fw)

        print("ERRORS:", errs)
        await browser.close()

asyncio.run(main())
