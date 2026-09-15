import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width":1280,"height":900})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(300)

        # 1. tab order & labels
        tab_labels = await page.eval_on_selector_all(".tab-btn", "els => els.map(e => e.textContent.trim())")
        print("Tab order:", tab_labels)
        tab_keys = await page.eval_on_selector_all(".tab-btn", "els => els.map(e => e.dataset.tab)")
        print("Tab keys:", tab_keys)

        # 2. default active tab + color
        active_tab_attr = await page.eval_on_selector(".app", "el => el.dataset.activeTab")
        print("Default active tab:", active_tab_attr)
        accent = await page.evaluate("getComputedStyle(document.querySelector('.app')).getPropertyValue('--accent').trim()")
        print("Default accent (wizard/blue expected):", accent)

        # 3. click through each tab, check color changes + no console errors
        colors = {}
        for key in ["pron","bible","wizard","vocab","grammar"]:
            await page.click(f'.tab-btn[data-tab="{key}"]')
            await page.wait_for_timeout(150)
            c = await page.evaluate("getComputedStyle(document.querySelector('.app')).getPropertyValue('--accent').trim()")
            colors[key] = c
            active = await page.evaluate("document.querySelector('.panel.active').id")
            print(f"tab={key} accent={c} active_panel={active}")
        print("All distinct colors:", len(set(colors.values())) == 5)

        # 4. wizard subtab: reftable text should NOT contain the removed phrase
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(150)
        await page.click('.subtab-btn[data-wizard="reftable"]')
        await page.wait_for_timeout(200)
        reftable_text = await page.inner_text("#wizard-reftable-pane")
        print("reftable pane contains removed phrase:", "마법사를 거치지 않고도" in reftable_text)
        print("reftable pane has content:", len(reftable_text) > 100)
        # switch back to main
        await page.click('.subtab-btn[data-wizard="main"]')
        await page.wait_for_timeout(150)
        main_visible = await page.is_visible("#wizard-main-pane")
        reftable_hidden = not await page.is_visible("#wizard-reftable-pane")
        print("wizard main visible:", main_visible, "reftable hidden:", reftable_hidden)

        # 5. vocab tab merged subtabs
        await page.click('.tab-btn[data-tab="vocab"]')
        await page.wait_for_timeout(150)
        vocab_subtabs = await page.eval_on_selector_all(".subtab-btn[data-vocab]", "els => els.map(e => [e.dataset.vocab, e.textContent.trim()])")
        print("Vocab subtabs:", vocab_subtabs)
        for mode in ["rhyme","groups","chain","theo","freq"]:
            await page.click(f'.subtab-btn[data-vocab="{mode}"]')
            await page.wait_for_timeout(150)
            txt = await page.inner_text("#vocab-root")
            print(f"vocab mode={mode} content_len={len(txt)}")
        # search across a mode
        await page.click('.subtab-btn[data-vocab="freq"]')
        await page.fill("#vocab-search", "")
        await page.wait_for_timeout(100)

        # 6. pron tab subtabs
        await page.click('.tab-btn[data-tab="pron"]')
        await page.wait_for_timeout(150)
        pron_subtabs = await page.eval_on_selector_all(".subtab-btn[data-pron]", "els => els.map(e => [e.dataset.pron, e.textContent.trim()])")
        print("Pron subtabs:", pron_subtabs)
        for mode in ["vowels","consonants","tones","tonepairs","nsdiff"]:
            await page.click(f'.subtab-btn[data-pron="{mode}"]')
            await page.wait_for_timeout(150)
            pane_id = f"pron-{mode}-pane"
            txt = await page.inner_text(f"#{pane_id}")
            visible = await page.is_visible(f"#{pane_id}")
            print(f"pron mode={mode} visible={visible} content_len={len(txt)}")
        intro_txt = await page.inner_text("#pron-intro-root")
        print("pron intro (voice+alphabet) content_len:", len(intro_txt))

        # 7. bible tab subtabs
        await page.click('.tab-btn[data-tab="bible"]')
        await page.wait_for_timeout(150)
        bible_subtabs = await page.eval_on_selector_all(".subtab-btn[data-bible]", "els => els.map(e => [e.dataset.bible, e.textContent.trim()])")
        print("Bible subtabs:", bible_subtabs)
        books_txt = await page.inner_text("#bible-books-pane")
        print("bible books content_len:", len(books_txt))
        await page.click('.subtab-btn[data-bible="numbers"]')
        await page.wait_for_timeout(150)
        numbers_txt = await page.inner_text("#bible-numbers-pane")
        print("bible numbers content_len:", len(numbers_txt), "contains ngan:", "ngàn" in numbers_txt)
        numbers_visible = await page.is_visible("#bible-numbers-pane")
        books_hidden = not await page.is_visible("#bible-books-pane")
        print("numbers visible:", numbers_visible, "books hidden:", books_hidden)

        # 8. grammar tab still works
        await page.click('.tab-btn[data-tab="grammar"]')
        await page.wait_for_timeout(150)
        grammar_subtabs = await page.eval_on_selector_all(".subtab-btn[data-grammar]", "els => els.map(e => e.dataset.grammar)")
        print("Grammar subtabs (unaffected):", grammar_subtabs)

        # 9. study games for merged pools
        for key in ["wizard","vocab","pron","bible","grammar"]:
            await page.click(f'.tab-btn[data-tab="{key}"]')
            await page.wait_for_timeout(150)
            await page.click('.panel.active .study-trigger-btn')
            await page.wait_for_timeout(200)
            body_txt = await page.inner_text("#study-body")
            empty = "아직 복습할 자료가 없어요" in body_txt
            print(f"study key={key} empty_pool={empty}")
            await page.click("#study-close")
            await page.wait_for_timeout(100)

        # study-trigger-btn count should be exactly 5
        trigger_count = await page.eval_on_selector_all(".study-trigger-btn", "els => els.length")
        print("study-trigger-btn count (expect 5):", trigger_count)

        # 10. overflow check across tabs
        overflow_issues = []
        for key in ["pron","bible","wizard","vocab","grammar"]:
            await page.click(f'.tab-btn[data-tab="{key}"]')
            await page.wait_for_timeout(150)
            sw = await page.evaluate("document.documentElement.scrollWidth")
            cw = await page.evaluate("document.documentElement.clientWidth")
            if sw > cw + 2:
                overflow_issues.append((key, sw, cw))
        print("Overflow issues (desktop):", overflow_issues)

        # 320px mobile check
        await page.set_viewport_size({"width":320,"height":700})
        overflow_issues_m = []
        for key in ["pron","bible","wizard","vocab","grammar"]:
            await page.click(f'.tab-btn[data-tab="{key}"]')
            await page.wait_for_timeout(150)
            sw = await page.evaluate("document.documentElement.scrollWidth")
            cw = await page.evaluate("document.documentElement.clientWidth")
            if sw > cw + 2:
                overflow_issues_m.append((key, sw, cw))
        print("Overflow issues (320px):", overflow_issues_m)
        await page.set_viewport_size({"width":1280,"height":900})

        # 11. dark mode + tab color sanity
        await page.emulate_media(color_scheme="dark")
        await page.click('.tab-btn[data-tab="grammar"]')
        await page.wait_for_timeout(150)
        dark_accent = await page.evaluate("getComputedStyle(document.querySelector('.app')).getPropertyValue('--accent').trim()")
        dark_bg = await page.evaluate("getComputedStyle(document.body).backgroundColor")
        print("dark mode grammar accent:", dark_accent, "body bg:", dark_bg)

        print("CONSOLE/PAGE ERRORS:", [e for e in errors if 'ERR_CONNECTION_RESET' not in e])
        await browser.close()

asyncio.run(main())
