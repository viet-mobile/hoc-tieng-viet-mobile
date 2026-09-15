from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # desktop light, wizard tab, top of page
    page = browser.new_page(viewport={"width": 480, "height": 800})
    page.goto("file:///home/claude/work/app.html")
    page.wait_for_timeout(400)
    page.screenshot(path="shot_final_top.png")

    # scrolled down -> sticky tabbar + subtab row, brand scrolled away
    page.evaluate("window.scrollTo(0, 500)")
    page.wait_for_timeout(200)
    page.screenshot(path="shot_final_scrolled.png")

    # review tab (red theme)
    page.evaluate("window.scrollTo(0,0)")
    page.click('.tab-btn[data-tab="review"]')
    page.wait_for_timeout(300)
    page.screenshot(path="shot_final_review.png")

    # 320px mobile, vocab tab (7 subtabs, scrollable)
    page.set_viewport_size({"width": 320, "height": 800})
    page.click('.tab-btn[data-tab="vocab"]')
    page.wait_for_timeout(300)
    page.screenshot(path="shot_final_320_vocab.png")

    # dark mode, curriculum tab
    page.emulate_media(color_scheme="dark")
    page.click('.tab-btn[data-tab="curriculum"]')
    page.wait_for_timeout(300)
    page.set_viewport_size({"width": 480, "height": 800})
    page.screenshot(path="shot_final_dark.png")

    browser.close()
    print("done")
