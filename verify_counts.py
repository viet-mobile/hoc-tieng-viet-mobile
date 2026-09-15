import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("file:///home/claude/work/app.html")
        counts = await page.evaluate("""() => ({
            CASES: CASES.length, VOCAB_THEO: VOCAB_THEO.length, FREQ_VOCAB: FREQ_VOCAB.length,
            RHYME_GROUPS: RHYME_GROUPS.length, VOCAB_GROUPS: VOCAB_GROUPS.length, VOCAB_CHAIN: VOCAB_CHAIN.length,
            BIBLE_OT: BIBLE_OT.length, BIBLE_NT: BIBLE_NT.length, TONE_PAIRS: TONE_PAIRS.length,
            GRAMMAR_UNITS: GRAMMAR_UNITS.length,
        })""")
        print(counts)
        await browser.close()

asyncio.run(main())
