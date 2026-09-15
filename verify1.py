import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        page = await browser.new_page(viewport={"width":420,"height":900})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(f"[console {m.type}] {m.text}") if m.type == "error" else None)
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(500)

        # check all CASES render without JS errors by iterating findCase-equivalent combos
        result = await page.evaluate("""
        () => {
          const speakers = ['brother','sister'];
          const genders = ['male','female'];
          const rels = ['younger_sibling','peer','older_sibling','younger_than_parent','older_than_parent',
                         'elder_uncle_aunt','elder_parent_age','stranger_polite'];
          const brackets = ['4070','80+'];
          const regions = ['north','south'];
          let missing = [];
          let found = 0;
          for (const sp of speakers) for (const g of genders) for (const rel of rels) {
            if (rel === 'stranger_polite') {
              for (const b of brackets) {
                const c = CASES.find(c => c.speaker===sp && c.listener_gender===g && c.rel===rel && c.age_bracket===b);
                if (!c) missing.push([sp,g,rel,b]); else found++;
              }
            } else {
              const c = CASES.find(c => c.speaker===sp && c.listener_gender===g && c.rel===rel);
              if (!c) missing.push([sp,g,rel]); else found++;
            }
          }
          return {missing, found, total: CASES.length};
        }
        """)
        print("case coverage:", result)

        print("console/page errors so far:", errors)
        await browser.close()

asyncio.run(main())
