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
        await page.wait_for_timeout(400)

        # ---- 교과 tab: should have exactly 3 subtabs ----
        await page.click('.tab-btn[data-tab="curriculum"]')
        await page.wait_for_timeout(200)
        curr_subtabs = await page.eval_on_selector_all('.subtab-btn[data-curriculum]', "els => els.map(e => e.dataset.curriculum)")
        print("curriculum subtabs:", curr_subtabs)
        assert set(curr_subtabs) == {"week16", "culture", "prayer"}, curr_subtabs

        for key in ["week16", "culture", "prayer"]:
            await page.click('.subtab-btn[data-curriculum="' + key + '"]')
            await page.wait_for_timeout(150)
            visible = await page.eval_on_selector("#curr-" + key + "-pane", "el => getComputedStyle(el).display !== 'none'")
            html_len = await page.eval_on_selector("#curr-" + key + "-pane", "el => el.innerHTML.length")
            print("curriculum", key, "visible:", visible, "len:", html_len)
            assert visible
            assert html_len > 50

        # ---- 호칭.대화 (wizard) tab: should have talks subtab now ----
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(200)
        wizard_subtabs = await page.eval_on_selector_all('.subtab-btn[data-wizard]', "els => els.map(e => e.dataset.wizard)")
        print("wizard subtabs:", wizard_subtabs)
        assert "talks" in wizard_subtabs

        await page.click('.subtab-btn[data-wizard="talks"]')
        await page.wait_for_timeout(200)
        talks_visible = await page.eval_on_selector("#wizard-talks-pane", "el => getComputedStyle(el).display !== 'none'")
        talks_root_len = await page.eval_on_selector("#curr-talks-root", "el => el.innerHTML.length")
        print("wizard talks pane visible:", talks_visible, "curr-talks-root len:", talks_root_len)
        assert talks_visible
        assert talks_root_len > 50

        # ---- 어휘 (vocab) tab: should have names + words subtabs ----
        await page.click('.tab-btn[data-tab="vocab"]')
        await page.wait_for_timeout(200)
        vocab_subtabs = await page.eval_on_selector_all('.subtab-btn[data-vocab]', "els => els.map(e => e.dataset.vocab)")
        print("vocab subtabs:", vocab_subtabs)
        assert "names" in vocab_subtabs and "words" in vocab_subtabs

        await page.click('.subtab-btn[data-vocab="names"]')
        await page.wait_for_timeout(200)
        names_len = await page.eval_on_selector("#vocab-root", "el => el.innerHTML.length")
        print("vocab names len:", names_len)
        assert names_len > 50

        # search box works for names
        await page.fill("#vocab-search", "모세")
        await page.wait_for_timeout(200)
        names_search_len = await page.eval_on_selector("#vocab-root", "el => el.innerHTML.length")
        print("vocab names search 'moses' len:", names_search_len)
        await page.fill("#vocab-search", "")
        await page.wait_for_timeout(150)

        await page.click('.subtab-btn[data-vocab="words"]')
        await page.wait_for_timeout(200)
        words_len = await page.eval_on_selector("#vocab-root", "el => el.innerHTML.length")
        print("vocab words len:", words_len)
        assert words_len > 50

        # ---- 문법.작문 (grammar) tab: should have sentences + special subtabs ----
        await page.click('.tab-btn[data-tab="grammar"]')
        await page.wait_for_timeout(200)
        grammar_subtabs = await page.eval_on_selector_all('.subtab-btn[data-grammar]', "els => els.map(e => e.dataset.grammar)")
        print("grammar subtabs:", grammar_subtabs)
        assert "sentences" in grammar_subtabs and "special" in grammar_subtabs

        await page.click('.subtab-btn[data-grammar="sentences"]')
        await page.wait_for_timeout(200)
        sent_visible = await page.eval_on_selector("#grammar-sentences-panel", "el => getComputedStyle(el).display !== 'none'")
        sent_len = await page.eval_on_selector("#curr-sentences-root", "el => el.innerHTML.length")
        print("grammar sentences visible:", sent_visible, "len:", sent_len)
        assert sent_visible
        assert sent_len > 50

        await page.click('.subtab-btn[data-grammar="special"]')
        await page.wait_for_timeout(200)
        special_visible = await page.eval_on_selector("#grammar-special-panel", "el => getComputedStyle(el).display !== 'none'")
        special_len = await page.eval_on_selector("#curr-grammar-root", "el => el.innerHTML.length")
        print("grammar special visible:", special_visible, "len:", special_len)
        assert special_visible
        assert special_len > 50

        # grammar search
        await page.fill("#curr-grammar-search", "은는")
        await page.wait_for_timeout(200)
        gsearch_len = await page.eval_on_selector("#curr-grammar-root", "el => el.innerHTML.length")
        print("grammar special search len:", gsearch_len)
        await page.fill("#curr-grammar-search", "")
        await page.wait_for_timeout(150)

        # ---- pron tab default should now be alphabet ----
        await page.click('.tab-btn[data-tab="pron"]')
        await page.wait_for_timeout(200)
        selected_pron = await page.eval_on_selector('.subtab-btn[data-pron][aria-selected="true"]', "el => el.dataset.pron")
        print("pron default selected subtab:", selected_pron)
        assert selected_pron == "alphabet"

        # nsdiff pane - check for dza / saɪk / english-r absence, and n,en title
        await page.click('.subtab-btn[data-pron="nsdiff"]')
        await page.wait_for_timeout(200)
        nsdiff_html = await page.eval_on_selector("#pron-nsdiff-pane", "el => el.innerHTML")
        print("nsdiff has 'dza':", "dza" in nsdiff_html)
        print("nsdiff has 'saɪk':", "saɪk" in nsdiff_html)
        print("nsdiff has 'sɐjk':", "sɐjk" in nsdiff_html)
        print("nsdiff has '영어 r과 비슷':", "영어 r과 비슷" in nsdiff_html)
        print("nsdiff has '스페인어 r과 비슷':", "스페인어 r과 비슷" in nsdiff_html)
        print("nsdiff has '변하지 않는':", "변하지 않는" in nsdiff_html)
        assert "dza" not in nsdiff_html
        assert "saɪk" not in nsdiff_html
        assert "sɐjk" in nsdiff_html
        assert "영어 r과 비슷" not in nsdiff_html
        assert "스페인어 r과 비슷" in nsdiff_html
        assert "변하지 않는" not in nsdiff_html

        # check tag colors: north uses --sky based class
        north_bg = await page.eval_on_selector(".ns-tag.north", "el => getComputedStyle(el).backgroundColor")
        south_bg = await page.eval_on_selector(".ns-tag.south", "el => getComputedStyle(el).backgroundColor")
        print("north tag bg:", north_bg, "south tag bg:", south_bg)

        # overflow checks
        overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        print("desktop horizontal overflow:", overflow)
        await page.set_viewport_size({"width": 320, "height": 900})
        await page.wait_for_timeout(200)
        overflow_m = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
        print("320px horizontal overflow:", overflow_m)
        await page.set_viewport_size({"width": 1280, "height": 900})

        print("\nERRORS:", errors)
        await browser.close()
        assert not errors, errors

asyncio.run(main())
