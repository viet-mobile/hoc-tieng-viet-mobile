import asyncio
from playwright.async_api import async_playwright

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto("file://" + __import__("os").path.abspath("app.html"))
        await page.wait_for_timeout(500)

        # go to wizard tab
        await page.click('.tab-btn[data-tab="wizard"]')
        await page.wait_for_timeout(200)

        # scroll to people section, check it exists
        people_root = await page.query_selector("#people-section-root")
        assert people_root, "people-section-root missing"

        # fill my name
        await page.fill("#input-name-kr", "예나")
        await page.fill("#input-name-vi", "Trang")

        # fill "me" fields
        await page.click('#people-me-gender .mini-btn[data-val="sister"]')
        await page.fill("#people-me-age", "25")
        await page.fill("#people-me-phone", "010-1111-2222")
        await page.click('#people-me-married .mini-btn[data-val="0"]')

        # fill companion fields (opposite gender: brother)
        await page.fill("#people-comp-namekr", "민수")
        await page.fill("#people-comp-namevi", "Minh")
        await page.click('#people-comp-gender .mini-btn[data-val="brother"]')
        await page.fill("#people-comp-age", "45")
        await page.fill("#people-comp-phone", "010-3333-4444")
        await page.click('#people-comp-married .mini-btn[data-val="1"]')
        await page.click('#people-comp-region .mini-btn[data-val="north"]')
        await page.wait_for_timeout(200)

        term_note = await page.text_content("#people-comp-term-note")
        print("companion term note:", term_note)
        # age diff = 20 -> band 16-31, companion older than me -> younger_than_parent -> listener term = chú
        assert "chú" in term_note.lower() or "Chú" in term_note, f"unexpected term note: {term_note}"

        # now select wizard Q1-Q5 to get a cross-gender case (I'm sister, listener male)
        await page.click('#q-speaker .choice-btn[data-val="sister"]')
        await page.click('#q-gender .choice-btn[data-val="male"]')
        await page.click('#q-rel .choice-btn[data-val="younger_than_parent"]')
        await page.click('#q-region .choice-btn[data-val="north"]')
        await page.wait_for_timeout(200)

        note = await page.text_content(".companion-note span")
        print("companion-note (handoff):", note)
        assert "Minh" in note or "민수" in note, f"companion handoff not reflected: {note}"
        assert "010-3333-4444" in note, f"phone not reflected: {note}"

        # check Chung ta compound rendered somewhere in stage body (search across stages)
        found_chung_ta_compound = False
        stage_pills = await page.query_selector_all("#stage-nav .stage-pill")
        for i in range(len(stage_pills)):
            pills = await page.query_selector_all("#stage-nav .stage-pill")
            await pills[i].click()
            await page.wait_for_timeout(100)
            body_text = await page.text_content("#stage-body")
            if "mình" in body_text and ("anh" in body_text or "chú" in body_text or "bác" in body_text):
                found_chung_ta_compound = True
        print("found chung ta compound somewhere:", found_chung_ta_compound)

        # go to 제공 연설 tab
        await page.click('.subtab-btn[data-wizard="talks"]')
        await page.wait_for_timeout(300)
        summary = await page.text_content("#people-summary-root")
        print("people summary:", summary)
        assert "Minh" in summary or "민수" in summary

        # select relationship for talks (same as main for simplicity: sister/male/younger_than_parent/2030/north)
        await page.click('#q-talk-speaker .choice-btn[data-val="sister"]')
        await page.click('#q-talk-gender .choice-btn[data-val="male"]')
        await page.click('#q-talk-rel .choice-btn[data-val="younger_than_parent"]')
        await page.click('#q-talk-region .choice-btn[data-val="north"]')
        await page.wait_for_timeout(300)

        talks_text = await page.text_content("#curr-talks-root")
        print("MY_NAME present (Trang):", "Trang" in talks_text)
        print("MY_PHONE present:", "010-1111-2222" in talks_text)
        assert "Trang" in talks_text
        assert "010-1111-2222" in talks_text

        # expand talk 1 group to check the __ blank got replaced, and talk 3
        heads = await page.query_selector_all("#curr-talks-root .group-head")
        await heads[0].click()
        await page.wait_for_timeout(150)
        talk1_text = await page.text_content("#curr-talks-root")
        talk1_section = talk1_text.split("제공 연설 2")[0] if "제공 연설 2" in talk1_text else talk1_text
        print("talk1 has Trang:", "Trang" in talk1_section)
        assert "Trang" in talk1_section
        assert "Chú Minh" in talk1_section or "Minh" in talk1_section

        heads = await page.query_selector_all("#curr-talks-root .group-head")
        await heads[2].click()
        await page.wait_for_timeout(150)
        full_text = await page.text_content("#curr-talks-root")
        print("has MY_AGE (25):", "25" in full_text)
        assert "25" in full_text

        print("console/page errors:", errors)
        assert not errors, f"JS errors: {errors}"
        await browser.close()
        print("ALL OK")

asyncio.run(main())
