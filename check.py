from playwright.sync_api import sync_playwright
import sys

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path="/opt/pw-browsers/chromium/chrome-linux/chrome" if False else None)
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width":420,"height":900})
    page.on("console", lambda msg: errors.append((msg.type, msg.text)) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: errors.append(("pageerror", str(exc))))
    page.goto("file:///home/claude/work/app.html")
    page.wait_for_timeout(600)
    page.screenshot(path="shot_wizard.png")
    # click through wizard
    page.click('#q-speaker [data-val="sister"]')
    page.click('#q-gender [data-val="male"]')
    page.click('#q-rel [data-val="younger_than_parent"]')
    page.click('#q-region [data-val="south"]')
    page.wait_for_timeout(300)
    page.screenshot(path="shot_result.png", full_page=True)
    # go to reftable tab
    page.click('.tab-btn[data-tab="reftable"]')
    page.wait_for_timeout(200)
    page.screenshot(path="shot_reftable.png", full_page=True)
    # vocab tab
    page.click('.tab-btn[data-tab="vocab"]')
    page.wait_for_timeout(200)
    page.screenshot(path="shot_vocab.png", full_page=True)
    page.click('.subtab-btn[data-vocab="groups"]')
    page.wait_for_timeout(200)
    page.click('.group-card .group-head')
    page.wait_for_timeout(200)
    page.screenshot(path="shot_vocab_groups.png", full_page=True)
    # pron tab
    page.click('.tab-btn[data-tab="pron"]')
    page.wait_for_timeout(200)
    page.screenshot(path="shot_pron.png", full_page=True)
    browser.close()

print("console/page errors:", errors)
