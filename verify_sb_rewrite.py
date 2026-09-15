import json, re
from playwright.sync_api import sync_playwright

def set_select(page, sel, value):
    page.eval_on_selector(sel, "(el, v) => { el.value = v; el.dispatchEvent(new Event('change', {bubbles:true})); }", value)

def set_text(page, sel, value):
    page.eval_on_selector(sel, "(el, v) => { el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); }", value)

def get_result_text(page):
    page.wait_for_timeout(1700)
    vi = page.locator('.sb-result-vi').first
    kr = page.locator('.sb-result-kr').first
    notes = page.locator('.sb-notes').first
    vi_txt = vi.inner_text() if vi.count() else None
    kr_txt = kr.inner_text() if kr.count() else None
    notes_txt = notes.inner_text() if notes.count() else None
    return vi_txt, kr_txt, notes_txt

def reset_form(page):
    for sid in ["stype","wh","connective","subject","aux","verb","object","noun","preposition","adjective","manner","place","time"]:
        el = page.locator("#sb-" + sid)
        if el.count():
            tag = el.evaluate("el => el.tagName")
            if tag == "SELECT":
                # set to first option (usually 사용 안 함 or 0)
                pass
    set_select(page, "#sb-stype", "0")
    set_select(page, "#sb-connective", "")
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-aux", "")
    set_select(page, "#sb-verb", "")
    set_select(page, "#sb-object", "")
    set_select(page, "#sb-noun", "")
    set_select(page, "#sb-preposition", "")
    set_select(page, "#sb-adjective", "")
    set_select(page, "#sb-manner", "")
    set_select(page, "#sb-place", "")
    set_select(page, "#sb-time", "")

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

    # ---- Field order check ----
    order = page.eval_on_selector_all("#sb-form > .sb-field", "els => els.map(e => e.id)")
    results.append(("FIELD ORDER", order))

    # ---- Test: user's exact example ----
    # subject=tôi(p0), aux=muốn(0), verb=đi(i0), manner=nhanh(0), place=Phòng Nước Trời(idx1), time=ngày mai(idx6)
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-aux", "0")   # muốn
    set_select(page, "#sb-verb", "i0")  # đi
    set_select(page, "#sb-manner", "0")  # nhanh
    set_select(page, "#sb-place", "1")  # Phòng Nước Trời
    set_select(page, "#sb-time", "6")  # ngày mai
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("USER EXAMPLE (đi + place + time)", vi, kr))

    # ---- Test: ở + place (no double ở) ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "i9")  # ở (idx9 in SB_INTRANS_VERBS: đi,đến,về,ngủ,dậy,cười,chờ,chạy,làm việc,ở,là -> index 9)
    set_select(page, "#sb-place", "0")  # nhà
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("verb=ở + place=nhà", vi, kr))

    # ---- Test: về + place ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "i2")  # về
    set_select(page, "#sb-place", "0")  # nhà
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("verb=về + place=nhà", vi, kr))

    # ---- Test: đến + place ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "i1")  # đến
    set_select(page, "#sb-place", "2")  # trường
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("verb=đến + place=trường", vi, kr))

    # ---- Test: non-motion verb (ăn, trans) + place -> ở + noun ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "t0")  # ăn
    set_select(page, "#sb-object", "0")  # cơm
    set_select(page, "#sb-place", "0")  # nhà
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("verb=ăn(trans) + place=nhà", vi, kr))

    # ---- Test: là copula statement ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")  # tôi
    set_select(page, "#sb-verb", "i10")  # là (idx10)
    set_select(page, "#sb-noun", "0")  # học sinh
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("là statement (tôi là học sinh)", vi, kr))

    # ---- Test: là copula negative ----
    set_select(page, "#sb-stype", "1")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("là negative", vi, kr))

    # ---- Test: là copula yesno ----
    set_select(page, "#sb-stype", "2")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("là yesno", vi, kr))

    # ---- Test: là without noun -> incomplete guard ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "i10")  # là
    set_select(page, "#sb-noun", "")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("là without noun (guard)", vi, kr, notes))

    # ---- Test: noun field visibility ----
    reset_form(page)
    set_select(page, "#sb-verb", "i0")  # đi
    noun_hidden_for_di = page.eval_on_selector("#sb-field-noun", "el => el.classList.contains('sb-hidden')")
    set_select(page, "#sb-verb", "i10")  # là
    noun_visible_for_la = page.eval_on_selector("#sb-field-noun", "el => !el.classList.contains('sb-hidden')")
    results.append(("noun field: hidden for đi, visible for là", noun_hidden_for_di, noun_visible_for_la))

    # NOTE: current design shows/hides #sb-field-noun via JS on verb change (not pure CSS-driven)
    # print raw classlist too
    cls_after_la = page.eval_on_selector("#sb-field-noun", "el => el.className")
    results.append(("noun field classlist after selecting là", cls_after_la))

    # ---- Test: preposition field always usable ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "t3")  # học
    set_select(page, "#sb-object", "3")  # Kinh Thánh (idx3 in object nouns: cơm,nước,sách,Kinh Thánh)
    set_select(page, "#sb-preposition", "0")  # với bạn
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("preposition test (học + Kinh Thánh + với bạn)", vi, kr))

    # ---- Test: custom simple field (connective) ----
    reset_form(page)
    set_select(page, "#sb-connective", "custom")
    set_text(page, "#sb-connective-custom-vi", "Sau khi đó")
    set_text(page, "#sb-connective-custom-kr", "그 다음에")
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "i0")  # đi
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("custom connective", vi, kr))

    # ---- Test: custom verb (intrans, auto-derive past) ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-verb", "custom")
    set_text(page, "#sb-verb-custom-vi", "nấu ăn")
    set_text(page, "#sb-verb-custom-kr", "요리하다")
    set_select(page, "#sb-verb-custom-trans", "i")
    page.wait_for_timeout(100)
    set_select(page, "#sb-aux", "6")  # đã / past
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("custom verb (nấu ăn/요리하다) + past aux", vi, kr))

    # ---- Test: custom adjective (auto-derive attr/past) ----
    reset_form(page)
    set_select(page, "#sb-subject", "n10")  # trời
    set_select(page, "#sb-verb", "")
    set_select(page, "#sb-adjective", "custom")
    set_text(page, "#sb-adjective-custom-vi", "vui")
    set_text(page, "#sb-adjective-custom-kr", "기쁘다")
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("custom adjective (vui/기쁘다) auto-derive", vi, kr))

    # ---- Test: custom aux ----
    reset_form(page)
    set_select(page, "#sb-subject", "p0")
    set_select(page, "#sb-aux", "custom")
    set_text(page, "#sb-aux-custom-vi", "định")
    set_text(page, "#sb-aux-custom-kr", "~할 예정이다")
    set_select(page, "#sb-aux-custom-type", "will")
    set_select(page, "#sb-verb", "i0")  # đi
    page.click("#sb-generate")
    vi, kr, notes = get_result_text(page)
    results.append(("custom aux (định/will pattern) + đi", vi, kr))

    # ---- overflow checks ----
    overflow_desktop = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    page.set_viewport_size({"width": 320, "height": 900})
    page.wait_for_timeout(200)
    overflow_320 = page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth + 1")
    page.set_viewport_size({"width": 1280, "height": 900})

    # dark mode check
    page.emulate_media(color_scheme="dark")
    page.wait_for_timeout(150)
    page.click("#sb-generate")
    page.wait_for_timeout(300)
    page.emulate_media(color_scheme="light")

    for r in results:
        print(r)
        print()

    print("overflow desktop:", overflow_desktop, "overflow 320px:", overflow_320)
    print("CONSOLE ERRORS:", errors)
    browser.close()
