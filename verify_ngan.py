from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":1280,"height":900})
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto("file:///home/claude/work/app.html")
    page.click('[data-tab="bible"]')
    page.wait_for_timeout(300)
    text = page.inner_text("#bible-root")
    print("Contains 'ngàn':", "ngàn" in text)
    print("Contains 'nghìn' (should only be inside the note):", "nghìn" in text)
    # Find and print the relevant note lines
    for line in text.split("\n"):
        if "ngàn" in line or "nghìn" in line:
            print("LINE:", line.strip())
    print("CONSOLE ERRORS:", [e for e in errors if 'ERR_CONNECTION_RESET' not in e])
    browser.close()
