import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # This suite's assertions are written against the Korean UI strings, so force a
        # Korean browser locale -- otherwise the app's system-language auto-detection would
        # start the page in whatever locale the test runner's browser defaults to.
        page = await browser.new_page(viewport={"width": 1280, "height": 900}, locale="ko-KR")
        errors = []
        page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))
        def on_console(m):
            if m.type == "error" and "ERR_CONNECTION_RESET" not in m.text and "net::" not in m.text:
                errors.append("CONSOLE: " + m.text)
        page.on("console", on_console)
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(400)

        # ---- top tab labels ----
        labels = await page.eval_on_selector_all(".tab-btn", "els => els.map(e => e.textContent.trim())")
        print("top tab labels:", labels)
        assert labels == ["교과", "발음", "성경", "대화", "어휘", "문법", "복습"], labels

        default_tab = await page.eval_on_selector('.tab-btn[aria-selected="true"]', "el => el.dataset.tab")
        print("default top tab selected:", default_tab)
        assert default_tab == "curriculum", default_tab
        active_panel = await page.eval_on_selector(".panel.active", "el => el.id")
        print("default active panel:", active_panel)
        assert active_panel == "panel-curriculum", active_panel

        # ---- bookmark shape (small radius, not pill) ----
        tab_radius = await page.eval_on_selector(".tab-btn", "el => getComputedStyle(el).borderRadius")
        print("tab-btn border-radius:", tab_radius)
        assert tab_radius == "8px", tab_radius

        await page.click('.tab-btn[data-tab="vocab"]')
        await page.wait_for_timeout(150)
        sub_radius = await page.eval_on_selector(".subtab-btn", "el => getComputedStyle(el).borderRadius")
        sub_padding = await page.eval_on_selector(".subtab-btn", "el => getComputedStyle(el).padding")
        tab_padding = await page.eval_on_selector(".tab-btn", "el => getComputedStyle(el).padding")
        print("subtab-btn border-radius:", sub_radius, "padding:", sub_padding, "| tab-btn padding:", tab_padding)
        assert sub_radius == "8px"
        assert sub_padding == tab_padding

        # ---- vocab: 8 subtabs, basic/antonym split ----
        vocab_subtabs = await page.eval_on_selector_all(".subtab-btn[data-vocab]", "els => els.map(e => [e.dataset.vocab, e.textContent.trim()])")
        print("vocab subtabs:", vocab_subtabs)
        expect_vocab = [["rhyme","한자음"],["orderrev","어순반대"],["groups","동일음"],["basic","기본"],["antonym","반의"],["freq","상용"],["theo","신권"],["names","인명"],["chain","끝말"],["dialect","남북 단어"],["wt","파수대"]]
        assert vocab_subtabs == expect_vocab, vocab_subtabs

        await page.click('.subtab-btn[data-vocab="basic"]')
        await page.wait_for_timeout(150)
        basic_html = await page.eval_on_selector("#vocab-root", "el => el.innerHTML")
        print("basic pane has '기본 단어':", "기본 단어" in basic_html, "| has '반의어':", "반의어" in basic_html)
        assert "기본 단어" in basic_html
        assert "반의어" not in basic_html

        await page.click('.subtab-btn[data-vocab="antonym"]')
        await page.wait_for_timeout(150)
        antonym_html = await page.eval_on_selector("#vocab-root", "el => el.innerHTML")
        print("antonym pane has '반의어':", "반의어" in antonym_html, "| has '기본 단어':", "기본 단어" in antonym_html)
        assert "반의어" in antonym_html
        assert "기본 단어" not in antonym_html

        # ---- grammar: reordered, relabeled ----
        grammar_subtabs = await page.eval_on_selector_all(".subtab-btn[data-grammar]", "els => els.map(e => [e.dataset.grammar, e.textContent.trim()])")
        print("grammar subtabs:", grammar_subtabs)
        expect_grammar = [["lessons","예문"],["special","특강"],["sentences","범용 언어 생성표"],["builder","문장 생성기"]]
        assert grammar_subtabs == expect_grammar, grammar_subtabs

        # ---- review: reordered, relabeled, default = pron ----
        await page.click('.tab-btn[data-tab="review"]')
        await page.wait_for_timeout(200)
        review_subtabs = await page.eval_on_selector_all(".subtab-btn[data-review]", "els => els.map(e => [e.dataset.review, e.textContent.trim()])")
        print("review subtabs:", review_subtabs)
        expect_review = [["pron","발음"],["bible","성경"],["wizard","대화"],["vocab","어휘"],["grammar","문법"]]
        assert review_subtabs == expect_review, review_subtabs
        selected = await page.eval_on_selector('.subtab-btn[data-review][aria-selected="true"]', "el => el.dataset.review")
        print("review default selected:", selected)
        assert selected == "grammar"
        selected_mode = await page.eval_on_selector('.study-mode-btn[aria-selected="true"]', "el => el.dataset.mode")
        print("review default mode:", selected_mode)
        assert selected_mode == "order"
        body_len = await page.eval_on_selector("#study-body", "el => el.innerHTML.length")
        assert body_len > 50

        # spin through all review categories/modes once more for regression
        for cat in ["pron", "bible", "wizard", "vocab", "grammar"]:
            await page.click('.subtab-btn[data-review="' + cat + '"]')
            await page.wait_for_timeout(120)
            for mode in ["flash", "mcq", "order", "type"]:
                await page.click('.study-mode-btn[data-mode="' + mode + '"]')
                await page.wait_for_timeout(120)
                blen = await page.eval_on_selector("#study-body", "el => el.innerHTML.length")
                assert blen > 20, (cat, mode, blen)
        print("review categories/modes regression: ok")

        # ---- curriculum / pron / wizard relabels ----
        curr_labels = await page.eval_on_selector_all(".subtab-btn[data-curriculum]", "els => els.map(e => e.textContent.trim())")
        pron_labels = await page.eval_on_selector_all(".subtab-btn[data-pron]", "els => els.map(e => e.textContent.trim())")
        wizard_labels = await page.eval_on_selector_all(".subtab-btn[data-wizard]", "els => els.map(e => e.textContent.trim())")
        print("curriculum labels:", curr_labels)
        print("pron labels:", pron_labels)
        print("wizard labels:", wizard_labels)
        assert curr_labels == ["학습 과정", "문화", "노래·기도", "사용설명"]
        assert pron_labels == ["설정", "문자", "모음", "자음", "성조", "연속 성조", "남북 발음"]
        assert wizard_labels == ["대화", "호칭", "제공 연설", "이웃 사람과의 대화"]

        # ---- 이웃 사람과의 대화: new subtab renders 11 conversation cards with content ----
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(150)
        await page.click('.subtab-btn[data-wizard="neighbor"]')
        await page.wait_for_timeout(200)
        nb_cards = await page.eval_on_selector_all("#curr-neighbor-root .group-card", "els => els.length")
        print("neighbor conversation cards:", nb_cards)
        assert nb_cards == 11, nb_cards
        nb_lines = await page.eval_on_selector_all("#curr-neighbor-root .talk-line", "els => els.length")
        print("neighbor total dialogue lines rendered:", nb_lines)
        assert nb_lines > 500, nb_lines
        first_title = await page.eval_on_selector("#curr-neighbor-root .group-card .cnt", "el => el.textContent.trim()")
        print("first neighbor conversation title:", first_title)
        assert first_title, first_title

        # ---- numbers: 144,000 folded into the 1,000~10억 section, right after 100,000 ----
        await page.click('.tab-btn[data-tab="bible"]')
        await page.wait_for_timeout(150)
        await page.click('.subtab-btn[data-bible="numbers"]')
        await page.wait_for_timeout(200)
        section_titles = await page.eval_on_selector_all("#panel-bible .p-section h3", "els => els.map(e => e.textContent.trim())")
        print("number section titles:", section_titles)
        assert "144,000" not in section_titles
        figures = await page.eval_on_selector_all("#panel-bible .num-table .num-figure, #panel-bible .num-table .tabular", "els => els.map(e => e.textContent.trim())")
        print("figures around 100,000/144,000:", [f for f in figures if "100,000" in f or "144,000" in f or f in ("1,000,000",)])
        idx100k = figures.index("100,000") if "100,000" in figures else -1
        idx144k = figures.index("144,000") if "144,000" in figures else -1
        print("idx 100,000:", idx100k, "idx 144,000:", idx144k)
        assert idx100k >= 0 and idx144k == idx100k + 1, (idx100k, idx144k, figures)

        # ---- overflow checks across widths (desktop + mobile) ----
        for w in [320, 360, 375, 414, 1280]:
            await page.set_viewport_size({"width": w, "height": 900})
            await page.wait_for_timeout(150)
            overflow = await page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
            print("width", w, "overflow:", overflow)
            assert not overflow, w

        print("\nERRORS:", errors)
        await browser.close()
        assert not errors, errors

asyncio.run(main())
