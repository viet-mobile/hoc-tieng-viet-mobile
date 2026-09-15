from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":420,"height":1000})
    page.goto("file:///home/claude/work/app.html")
    page.click('.tab-btn[data-tab="pron"]')
    page.wait_for_timeout(200)
    page.evaluate("document.querySelector('.p-section:nth-of-type(3)').scrollIntoView()")
    page.wait_for_timeout(100)
    page.screenshot(path="shot2_pron_cons.png", clip={"x":0,"y":0,"width":420,"height":700})
    browser.close()
