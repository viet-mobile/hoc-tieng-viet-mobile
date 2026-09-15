from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()

    # test accordion toggle
    page = browser.new_page(viewport={"width":420,"height":1000})
    page.goto("file:///home/claude/work/app.html")
    page.wait_for_timeout(400)
    page.click('.tab-btn[data-tab="vocab"]')
    page.click('.subtab-btn[data-vocab="groups"]')
    page.wait_for_timeout(400)
    page.click('.group-card:nth-child(1) .group-head')
    page.wait_for_timeout(300)
    page.screenshot(path="shot_accordion.png")
    print("first group open attr:", page.eval_on_selector('.group-card:nth-child(1)', 'el => el.dataset.open'))

    # dark mode test
    page2 = browser.new_page(viewport={"width":420,"height":900}, color_scheme="dark")
    page2.goto("file:///home/claude/work/app.html")
    page2.wait_for_timeout(400)
    page2.click('#q-speaker [data-val="brother"]')
    page2.click('#q-gender [data-val="female"]')
    page2.click('#q-rel [data-val="peer"]')
    page2.click('#q-region [data-val="north"]')
    page2.wait_for_timeout(300)
    page2.screenshot(path="shot_dark.png", full_page=True)

    # desktop width test
    page3 = browser.new_page(viewport={"width":1280,"height":900})
    page3.goto("file:///home/claude/work/app.html")
    page3.wait_for_timeout(400)
    page3.screenshot(path="shot_desktop.png")

    browser.close()
