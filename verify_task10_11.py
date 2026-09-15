import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        errors = []
        page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))
        def on_console(m):
            if m.type == "error" and "ERR_CONNECTION_RESET" not in m.text and "net::" not in m.text:
                errors.append("CONSOLE: " + m.text)
        page.on("console", on_console)
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(500)

        # ---- 7 tabs present in one row ----
        tabs = await page.eval_on_selector_all(".tab-btn", "els => els.map(e => e.dataset.tab)")
        print("tabs:", tabs)
        assert tabs == ["curriculum", "pron", "bible", "wizard", "vocab", "grammar", "review"], tabs

        tabs_wrap = await page.eval_on_selector(".tabs", "el => getComputedStyle(el).flexWrap")
        print("tabs flex-wrap:", tabs_wrap)
        assert tabs_wrap == "nowrap"

        # all tab-btn on same row (same offsetTop)
        tops = await page.eval_on_selector_all(".tab-btn", "els => els.map(e => e.offsetTop)")
        print("tab-btn offsetTops:", tops)
        assert len(set(tops)) == 1

        # ---- click review tab, check red theme ----
        await page.click('.tab-btn[data-tab="review"]')
        await page.wait_for_timeout(200)
        active_tab = await page.eval_on_selector(".app", "el => el.dataset.activeTab")
        print("active tab after clicking review:", active_tab)
        assert active_tab == "review"
        accent = await page.evaluate("getComputedStyle(document.querySelector('.app')).getPropertyValue('--accent').trim()")
        print("review accent color:", accent)
        assert accent.lower() == "#b5342b"

        review_visible = await page.eval_on_selector("#panel-review", "el => getComputedStyle(el).display !== 'none'")
        assert review_visible

        # review subtabs
        review_subtabs = await page.eval_on_selector_all('.subtab-btn[data-review]', "els => els.map(e => e.dataset.review)")
        print("review subtabs:", review_subtabs)
        assert review_subtabs == ["wizard", "vocab", "pron", "bible", "grammar"]

        # study body has content by default (first category auto-selected)
        study_body_len = await page.eval_on_selector("#study-body", "el => el.innerHTML.length")
        print("study-body initial content len:", study_body_len)
        assert study_body_len > 50

        # click each review category + each mode, verify content renders w/o errors
        for cat in ["wizard", "vocab", "pron", "bible", "grammar"]:
            await page.click('.subtab-btn[data-review="' + cat + '"]')
            await page.wait_for_timeout(150)
            for mode in ["flash", "mcq", "order", "type"]:
                await page.click('.study-mode-btn[data-mode="' + mode + '"]')
                await page.wait_for_timeout(150)
                body_len = await page.eval_on_selector("#study-body", "el => el.innerHTML.length")
                print("review", cat, mode, "body len:", body_len)
                assert body_len > 20

        # ---- study-trigger-btn on another panel routes to review tab + correct category ----
        await page.click('.tab-btn[data-tab="vocab"]')
        await page.wait_for_timeout(200)
        await page.click('.study-trigger-btn[data-study="vocab"]')
        await page.wait_for_timeout(250)
        active_tab2 = await page.eval_on_selector(".app", "el => el.dataset.activeTab")
        selected_review_cat = await page.eval_on_selector('.subtab-btn[data-review][aria-selected="true"]', "el => el.dataset.review")
        print("after trigger click -> active tab:", active_tab2, "selected review category:", selected_review_cat)
        assert active_tab2 == "review"
        assert selected_review_cat == "vocab"

        # ---- study-overlay / study-modal / study-close no longer exist ----
        overlay_count = await page.eval_on_selector_all(".study-overlay, .study-modal, #study-close, #study-modal-title", "els => els.length")
        print("leftover modal elements:", overlay_count)
        assert overlay_count == 0

        # ---- sticky header behavior ----
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(200)
        tabbar_pos = await page.eval_on_selector(".tabbar", "el => getComputedStyle(el).position")
        topbar_pos = await page.eval_on_selector(".topbar", "el => getComputedStyle(el).position")
        print("tabbar position:", tabbar_pos, "topbar position:", topbar_pos)
        assert tabbar_pos == "sticky"
        assert topbar_pos != "sticky"

        tabbar_h_before = await page.eval_on_selector(".tabbar", "el => el.getBoundingClientRect().height")
        subtab_top_before = await page.eval_on_selector(".subtab-row", "el => el.getBoundingClientRect().top")
        print("tabbar height:", tabbar_h_before, "subtab-row top (before scroll):", subtab_top_before)

        # scroll down, check topbar (brand) scrolls away but tabbar + subtab-row stick near top
        await page.evaluate("window.scrollTo(0, 600)")
        await page.wait_for_timeout(200)
        tabbar_rect = await page.evaluate("document.querySelector('.tabbar').getBoundingClientRect()")
        subtab_rect = await page.evaluate("document.querySelector('#panel-wizard .subtab-row').getBoundingClientRect()")
        brand_rect = await page.evaluate("document.querySelector('.brand').getBoundingClientRect()")
        print("after scroll(600): tabbar.top =", tabbar_rect["top"], "subtab.top =", subtab_rect["top"], "brand.top =", brand_rect["top"])
        assert abs(tabbar_rect["top"]) < 1, tabbar_rect
        assert abs(subtab_rect["top"] - tabbar_rect["height"]) < 2, (subtab_rect, tabbar_rect)
        assert brand_rect["top"] < -50, brand_rect  # scrolled well out of view

        # measure total sticky header height (tabbar + subtab row) -- should be compact
        total_sticky_h = tabbar_rect["height"] + subtab_rect["height"]
        print("total sticky header height:", total_sticky_h)
        assert total_sticky_h < 110, total_sticky_h

        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(150)

        # ---- overflow checks desktop + 320px, all 7 tabs still reachable at 320 (scrollable) ----
        overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        print("desktop horizontal overflow:", overflow)
        assert not overflow

        await page.set_viewport_size({"width": 320, "height": 900})
        await page.wait_for_timeout(200)
        overflow_m = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        print("320px horizontal overflow:", overflow_m)
        assert not overflow_m
        tabs_scrollwidth = await page.eval_on_selector(".tabs", "el => el.scrollWidth")
        tabs_clientwidth = await page.eval_on_selector(".tabs", "el => el.clientWidth")
        print("320px .tabs scrollWidth:", tabs_scrollwidth, "clientWidth:", tabs_clientwidth, "(scrollable row OK if scrollWidth > clientWidth)")
        await page.set_viewport_size({"width": 1280, "height": 900})

        # ---- dark mode sanity ----
        await page.emulate_media(color_scheme="dark")
        await page.wait_for_timeout(150)
        await page.click('.tab-btn[data-tab="review"]')
        await page.wait_for_timeout(150)
        accent_dark = await page.evaluate("getComputedStyle(document.querySelector('.app')).getPropertyValue('--accent').trim()")
        print("review accent color (dark):", accent_dark)
        await page.emulate_media(color_scheme="light")

        print("\nERRORS:", errors)
        await browser.close()
        assert not errors, errors

asyncio.run(main())
