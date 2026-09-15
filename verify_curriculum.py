import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))
        def on_console(m):
            if m.type == "error" and "ERR_CONNECTION_RESET" not in m.text and "net::" not in m.text:
                errors.append("CONSOLE: " + m.text)
        page.on("console", on_console)
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(400)

        # default tab should still be wizard (호칭·대화)
        active_tab = await page.eval_on_selector(".app", "el => el.dataset.activeTab")
        print("default active tab:", active_tab)
        assert active_tab == "wizard"

        # click 교과 tab
        await page.click('.tab-btn[data-tab="curriculum"]')
        await page.wait_for_timeout(200)
        active_tab = await page.eval_on_selector(".app", "el => el.dataset.activeTab")
        print("after click:", active_tab)
        assert active_tab == "curriculum"

        subtabs = ["week16", "culture", "talks", "names", "words", "sentences", "grammar", "prayer"]
        for st in subtabs:
            await page.click('#panel-curriculum .subtab-btn[data-curriculum="' + st + '"]')
            await page.wait_for_timeout(150)
            pane_id = "#curr-" + st + "-pane"
            visible = await page.eval_on_selector(pane_id, "el => getComputedStyle(el).display !== 'none'")
            root_id = "#curr-" + st + "-root"
            html_len = await page.eval_on_selector(root_id, "el => el.innerHTML.length")
            print(st, "visible:", visible, "content length:", html_len)
            assert visible, st + " pane not visible"
            assert html_len > 50, st + " pane looks empty"

        # week16: check week count and a link button works
        await page.click('#panel-curriculum .subtab-btn[data-curriculum="week16"]')
        await page.wait_for_timeout(150)
        week_cards = await page.eval_on_selector_all("#curr-week16-root .group-card", "els => els.length")
        print("week cards:", week_cards)
        assert week_cards == 16

        # test a cross-link: click first link button, should jump to pron/tones
        await page.click("#curr-week16-root .curr-link-btn")
        await page.wait_for_timeout(250)
        active_tab2 = await page.eval_on_selector(".app", "el => el.dataset.activeTab")
        print("after cross-link click, active tab:", active_tab2)
        assert active_tab2 == "pron"
        pron_selected = await page.eval_on_selector('.subtab-btn[data-pron="tones"]', "el => el.getAttribute('aria-selected')")
        print("pron tones subtab selected:", pron_selected)
        assert pron_selected == "true"

        # go back to curriculum > names, test search
        await page.click('.tab-btn[data-tab="curriculum"]')
        await page.wait_for_timeout(150)
        await page.click('#panel-curriculum .subtab-btn[data-curriculum="names"]')
        await page.wait_for_timeout(150)
        names_before = await page.eval_on_selector_all("#curr-names-root .bible-item", "els => els.length")
        await page.fill("#curr-names-search", "여호와")
        await page.wait_for_timeout(150)
        names_after = await page.eval_on_selector_all("#curr-names-root .bible-item", "els => els.length")
        print("names before/after search:", names_before, names_after)
        assert names_after < names_before

        # grammar dict search
        await page.click('#panel-curriculum .subtab-btn[data-curriculum="grammar"]')
        await page.wait_for_timeout(150)
        await page.fill("#curr-grammar-search", "à")
        await page.wait_for_timeout(150)
        dict_count = await page.eval_on_selector_all("#curr-grammar-root .curr-dict-head", "els => els.length")
        print("grammar dict filtered count for 'à':", dict_count)
        assert dict_count >= 1

        # purple color check
        accent = await page.eval_on_selector(".app", "el => getComputedStyle(el).getPropertyValue('--accent').trim()")
        print("curriculum accent color:", accent)
        assert accent.lower() == "#8763ad"

        # dark mode check
        await page.emulate_media(color_scheme="dark")
        await page.wait_for_timeout(150)
        accent_dark = await page.eval_on_selector(".app", "el => getComputedStyle(el).getPropertyValue('--accent').trim()")
        print("curriculum accent color (dark):", accent_dark)
        assert accent_dark.lower() == "#c9ace0"
        await page.emulate_media(color_scheme="light")

        # overflow check desktop
        overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        print("desktop horizontal overflow:", overflow)

        # 320px mobile check
        await page.set_viewport_size({"width": 320, "height": 800})
        await page.wait_for_timeout(200)
        overflow_m = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        print("320px horizontal overflow:", overflow_m)
        await page.set_viewport_size({"width": 1280, "height": 900})

        print("\nERRORS:", errors)
        await browser.close()

asyncio.run(main())
