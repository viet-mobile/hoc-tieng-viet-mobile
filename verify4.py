import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":1000})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)

        # theo tab
        await page.click('.tab-btn[data-tab="theo"]')
        await page.wait_for_timeout(200)
        theo_text = await page.inner_text("#theo-root")
        print("=== theo tab (first 400 chars) ===")
        print(theo_text[:400])
        count_items = await page.eval_on_selector_all(".theo-item", "els => els.length")
        print("theo item count (unfiltered):", count_items)

        await page.fill("#theo-search", "왕국")
        await page.wait_for_timeout(150)
        filtered = await page.eval_on_selector_all(".theo-item", "els => els.length")
        print("theo item count (search '왕국'):", filtered)

        # ref table check for new sections
        await page.click('.tab-btn[data-tab="reftable"]')
        await page.wait_for_timeout(150)
        ref_text = await page.inner_text("#ref-table-root")
        print("has elder sections:", "내가 상대방보다 훨씬 연장자" in ref_text, "초면" in ref_text)

        # voice picker (pron tab)
        await page.click('.tab-btn[data-tab="pron"]')
        await page.wait_for_timeout(200)
        voice_text = await page.inner_text("#voice-picker")
        print("=== voice picker ===")
        print(voice_text[:200])

        print("errors:", errors)
        await browser.close()

asyncio.run(main())
