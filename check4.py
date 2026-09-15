from playwright.sync_api import sync_playwright

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":420,"height":1000})
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.on("console", lambda msg: errors.append((msg.type, msg.text)) if msg.type == "error" else None)
    page.goto("file:///home/claude/work/app.html")
    page.wait_for_timeout(300)
    print("title:", page.title())
    print("h1 text:", page.text_content(".brand h1"))

    page.click('.tab-btn[data-tab="vocab"]')
    page.wait_for_timeout(200)
    print("subtab label:", page.text_content('.subtab-btn[data-vocab="groups"]'))
    page.screenshot(path="shot2_chain.png", full_page=False)
    page.screenshot(path="shot2_chain_top.png", clip={"x":0,"y":0,"width":420,"height":900})

    # scroll to check a compound entry - search for "hàng không dân dụng"
    page.fill('#vocab-search', 'dân dụng')
    page.wait_for_timeout(200)
    page.screenshot(path="shot2_chain_search.png")
    page.fill('#vocab-search', '')

    page.click('.subtab-btn[data-vocab="groups"]')
    page.wait_for_timeout(200)
    page.click('.group-card:nth-child(1) .group-head')
    page.wait_for_timeout(200)
    page.screenshot(path="shot2_groups.png")

    page.click('.tab-btn[data-tab="reftable"]')
    page.wait_for_timeout(200)
    page.screenshot(path="shot2_reftable.png", full_page=True)

    page.click('.tab-btn[data-tab="pron"]')
    page.wait_for_timeout(200)
    page.screenshot(path="shot2_pron_top.png", clip={"x":0,"y":0,"width":420,"height":900})

    # click an alpha cell and a tone speak button to ensure no crash
    page.click('.alpha-cell >> nth=0')
    page.click('.tone-row .speak-btn >> nth=0')
    page.wait_for_timeout(100)

    browser.close()

print("errors:", errors)
