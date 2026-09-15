import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        for w in [360, 375, 320]:
            page = await browser.new_page(viewport={"width":w,"height":700})
            await page.goto("file:///home/claude/work/app.html")
            await page.wait_for_timeout(250)
            overflow = await page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
            input_rect = await page.evaluate("""
              () => {
                const kr = document.getElementById('input-name-kr').getBoundingClientRect();
                const vi = document.getElementById('input-name-vi').getBoundingClientRect();
                return {kr: [kr.x, kr.width, kr.right], vi: [vi.x, vi.width, vi.right], vw: window.innerWidth};
              }
            """)
            print(f"width={w} horizontal_overflow_px={overflow} rects={input_rect}")
            await page.screenshot(path=f"shot_names_w{w}.png", clip={"x":0,"y":380,"width":w,"height":140})
            await page.close()
        await browser.close()

asyncio.run(main())
