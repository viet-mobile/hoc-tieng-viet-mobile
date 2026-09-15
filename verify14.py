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

        # tab bar layout check: 6 buttons visible, no overflow
        tabs = await page.locator(".tab-btn").all()
        print("tab count:", len(tabs))

        await page.click('[data-tab="bible"]')
        await page.wait_for_timeout(200)
        txt = await page.inner_text("#bible-root")
        print("has Sáng thế ký:", "Sáng thế ký" in txt, "| has 창세기:", "창세기" in txt)
        print("has Khải huyền:", "Khải huyền" in txt, "| has 요한계시록:", "요한계시록" in txt)
        print("has 144,000:", "144,000" in txt)
        print("has 1,000,000,000:", "1,000,000,000" in txt)
        print("has mười lăm exception note:", "lăm" in txt)

        await page.fill("#bible-search", "창세기")
        await page.wait_for_timeout(150)
        txt2 = await page.inner_text("#bible-root")
        print("search 'Genesis' isolates:", "Sáng thế ký" in txt2 and "Khải huyền" not in txt2)
        await page.fill("#bible-search", "")

        # NS diffs additions
        await page.click('[data-tab="pron"]')
        await page.wait_for_timeout(200)
        ptxt = await page.inner_text("#pron-root")
        print("has anh/ach card:", "anh, ach" in ptxt)
        print("has inh/ich card:", "inh, ich" in ptxt)
        print("has n/ên card:", "n, ên" in ptxt)

        # overflow check
        overflow = await page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        print("desktop overflow:", overflow)

        print("ERRORS:", errs)
        await browser.close()

asyncio.run(main())
