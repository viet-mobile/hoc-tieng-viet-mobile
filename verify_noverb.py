import json, re
from playwright.sync_api import sync_playwright

def set_select(page, sel, value):
    page.eval_on_selector(sel, "(el, v) => { el.value = v; el.dispatchEvent(new Event('change', {bubbles:true})); }", value)

def get_result_text(page):
    page.wait_for_timeout(1700)
    vi = page.locator('.sb-result-vi').first
    kr = page.locator('.sb-result-kr').first
    notes = page.locator('.sb-notes').first
    vi_txt = vi.inner_text() if vi.count() else None
    kr_txt = kr.inner_text() if kr.count() else None
    notes_txt = notes.inner_text() if notes.count() else None
    return vi_txt, kr_txt, notes_txt

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":1280,"height":900})
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto("file:///home/claude/work/app.html")
    page.click('[data-tab="grammar"]')
    page.click('.subtab-btn[data-grammar="builder"]')
    page.wait_for_timeout(300)

    results = []

    # Test 1: Trời lạnh (statement, no verb, subject=trời(idx10 in SB_NOUN_SUBJECTS), adjective=lạnh(idx10))
    set_select(page, "#sb-subject", "n10")
    set_select(page, "#sb-verb", "")
    set_select(page, "#sb-adjective", "10")
    set_select(page, "#sb-stype", "0")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("statement Trời lạnh", vi, kr, notes))

    # Test 2: negative
    set_select(page, "#sb-stype", "1")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("negative", vi, kr, notes))

    # Test 3: yesno
    set_select(page, "#sb-stype", "2")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("yesno", vi, kr, notes))

    # Test 4: imperative
    set_select(page, "#sb-stype", "3")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("imperative", vi, kr, notes))

    # Test 5: propositive
    set_select(page, "#sb-stype", "4")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("propositive", vi, kr, notes))

    # Test 6: alternative
    set_select(page, "#sb-stype", "5")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("alternative", vi, kr, notes))

    # Test 7: wh (thenao would bypass predicate entirely -- use taisao instead since that's compatible)
    set_select(page, "#sb-stype", "6")
    set_select(page, "#sb-wh", "4")  # taisao
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("wh-taisao", vi, kr, notes))

    # Test 8: aux + adjective (e.g. "sẽ lạnh" -- will be cold)
    set_select(page, "#sb-stype", "0")
    set_select(page, "#sb-wh", "0")
    page.click("#sb-generate")  # reset wh not used since stype!=wh but leave as is
    set_select(page, "#sb-aux", "5")  # sẽ / will
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("aux+adjective (se/will)", vi, kr, notes))

    # Test 9: guard case -- both verb and adjective unset
    set_select(page, "#sb-aux", "")
    set_select(page, "#sb-adjective", "")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("guard: no verb no adjective", vi, kr, notes))

    for r in results:
        print(r)

    print("CONSOLE ERRORS:", errors)
    browser.close()
