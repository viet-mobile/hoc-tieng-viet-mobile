import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":1100})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)

        result = await page.evaluate("""
        () => {
          const speakers = ['brother','sister'];
          const genders = ['male','female'];
          const brackets = ['2030','4070','80+'];
          let missing = [];
          let found = 0;
          for (const sp of speakers) for (const g of genders) for (const b of brackets) {
            const c = CASES.find(c => c.speaker===sp && c.listener_gender===g && c.rel==='stranger_polite' && c.age_bracket===b);
            if (!c) missing.push([sp,g,b]); else found++;
          }
          return {missing, found, total: CASES.length};
        }
        """)
        print("coverage:", result)

        await page.click('#q-speaker .choice-btn[data-val="brother"]')
        await page.click('#q-gender .choice-btn[data-val="female"]')
        await page.click('#q-rel .choice-btn[data-val="stranger_polite"]')
        await page.wait_for_timeout(150)
        await page.screenshot(path="shot_agebracket2.png", clip={"x":0,"y":300,"width":420,"height":700})

        await page.click('#q-agebracket .choice-btn[data-val="2030"]')
        await page.click('#q-region .choice-btn[data-val="north"]')
        await page.wait_for_timeout(150)
        txt = await page.inner_text("#result-wrap")
        print(txt[:300])

        print("errors:", errors)
        await browser.close()

asyncio.run(main())
