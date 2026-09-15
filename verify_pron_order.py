from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":1280,"height":900})
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto("file:///home/claude/work/app.html")
    page.click('[data-tab="pron"]')
    page.wait_for_timeout(300)
    titles = page.eval_on_selector_all("#pron-root .p-section h3", "els => els.map(e => e.textContent)")
    print("Section order:", titles)
    tone_pair_count = page.eval_on_selector_all("#pron-root .tone-pair-list .group-card", "els => els.length")
    print("Tone-pair groups:", tone_pair_count)
    print("CONSOLE ERRORS:", [e for e in errors if 'ERR_CONNECTION_RESET' not in e])
    browser.close()
