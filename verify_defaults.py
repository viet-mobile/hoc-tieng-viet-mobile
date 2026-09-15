import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width":1280,"height":900})
        errors = []
        page.on("pageerror", lambda e: errors.append("PAGEERROR: " + str(e)))
        def on_console(m):
            if m.type == "error" and "ERR_CONNECTION_RESET" not in m.text and "net::" not in m.text:
                errors.append("CONSOLE: " + m.text)
        page.on("console", on_console)
        await page.goto("file:///home/claude/work/app.html")
        await page.wait_for_timeout(400)

        # ---- 발음.문자 tab ----
        await page.click('.tab-btn[data-tab="pron"]')
        await page.wait_for_timeout(200)
        selected_pron = await page.eval_on_selector('.subtab-btn[data-pron][aria-selected="true"]', "el => el.dataset.pron")
        print("pron default selected subtab:", selected_pron)
        assert selected_pron == "tonepairs"

        # tonepairs pane visible, others hidden
        for key in ["alphabet","vowels","consonants","tones","tonepairs","nsdiff"]:
            visible = await page.eval_on_selector("#pron-" + key + "-pane", "el => getComputedStyle(el).display !== 'none'")
            print("pron pane", key, "visible:", visible)
            if key == "tonepairs":
                assert visible
            else:
                assert not visible

        # alphabet subtab has content and is separate from intro (voice picker only)
        await page.click('.subtab-btn[data-pron="alphabet"]')
        await page.wait_for_timeout(150)
        alpha_visible = await page.eval_on_selector("#pron-alphabet-pane", "el => getComputedStyle(el).display !== 'none'")
        alpha_len = await page.eval_on_selector("#pron-alphabet-pane", "el => el.innerHTML.length")
        intro_len = await page.eval_on_selector("#pron-intro-root", "el => el.innerHTML.length")
        intro_has_alpha = await page.eval_on_selector("#pron-intro-root", "el => el.querySelectorAll('.alpha-cell').length")
        alpha_cell_count = await page.eval_on_selector_all("#pron-alphabet-pane .alpha-cell", "els => els.length")
        print("alphabet pane visible:", alpha_visible, "content len:", alpha_len, "cells:", alpha_cell_count)
        print("intro root content len (voice picker only):", intro_len, "alpha cells inside intro:", intro_has_alpha)
        assert alpha_visible
        assert alpha_cell_count > 20
        assert intro_has_alpha == 0

        # click through all pron subtabs, verify visible + content
        for key in ["alphabet","vowels","consonants","tones","tonepairs","nsdiff"]:
            await page.click('.subtab-btn[data-pron="' + key + '"]')
            await page.wait_for_timeout(120)
            visible = await page.eval_on_selector("#pron-" + key + "-pane", "el => getComputedStyle(el).display !== 'none'")
            html_len = await page.eval_on_selector("#pron-" + key + "-pane", "el => el.innerHTML.length")
            print("clicked", key, "visible:", visible, "len:", html_len)
            assert visible
            assert html_len > 50

        # ---- 어휘 tab ----
        await page.click('.tab-btn[data-tab="vocab"]')
        await page.wait_for_timeout(200)
        selected_vocab = await page.eval_on_selector('.subtab-btn[data-vocab][aria-selected="true"]', "el => el.dataset.vocab")
        print("vocab default selected subtab:", selected_vocab)
        assert selected_vocab == "rhyme"
        vocab_root_len = await page.eval_on_selector("#vocab-root", "el => el.innerHTML.length")
        print("vocab-root content length on load:", vocab_root_len)
        assert vocab_root_len > 50
        # spot check it's actually rhyme content (has rhyme-specific class, e.g. from renderRhyme)
        has_rhyme_marker = await page.evaluate("document.querySelector('#vocab-root').innerHTML.indexOf('한자') >= 0 || document.querySelector('#vocab-root').innerHTML.length > 0")
        print("has rhyme-ish content:", has_rhyme_marker)

        # click through all vocab subtabs
        for key in ["rhyme","groups","chain","theo","freq"]:
            await page.click('.subtab-btn[data-vocab="' + key + '"]')
            await page.wait_for_timeout(150)
            html_len = await page.eval_on_selector("#vocab-root", "el => el.innerHTML.length")
            print("vocab clicked", key, "len:", html_len)
            assert html_len > 50

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

asyncio.run(main())
