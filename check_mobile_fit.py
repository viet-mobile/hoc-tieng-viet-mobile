from playwright.sync_api import sync_playwright

WIDTHS = [320, 360, 375, 390, 414]
TABS = ["curriculum", "pron", "bible", "wizard", "vocab", "grammar", "review"]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for w in WIDTHS:
        page = browser.new_page(viewport={"width": w, "height": 800})
        page.goto("file:///home/claude/work/app.html")
        page.wait_for_timeout(200)
        tabs_scroll = page.eval_on_selector(".tabs", "el => el.scrollWidth")
        tabs_client = page.eval_on_selector(".tabs", "el => el.clientWidth")
        print("width", w, "| .tabs scrollWidth", tabs_scroll, "clientWidth", tabs_client, "OVERFLOW" if tabs_scroll > tabs_client + 1 else "ok")
        for t in TABS:
            page.click('.tab-btn[data-tab="' + t + '"]')
            page.wait_for_timeout(120)
            sel = "#panel-" + t + " .subtab-row"
            exists = page.eval_on_selector_all(sel, "els => els.length")
            if not exists:
                continue
            sw = page.eval_on_selector(sel, "el => el.scrollWidth")
            cw = page.eval_on_selector(sel, "el => el.clientWidth")
            flag = "OVERFLOW" if sw > cw + 1 else "ok"
            print("  ", t, "subtab-row scrollWidth", sw, "clientWidth", cw, flag)
        page.close()
    browser.close()
