import asyncio, json
from playwright.async_api import async_playwright

async def set_select(page, sel_id, value):
    await page.eval_on_selector(f'#{sel_id}', "(el, v) => { el.value = v; el.dispatchEvent(new Event('change', {bubbles:true})); }", value)

async def generate_and_read(page):
    await page.click('#sb-generate')
    await page.wait_for_timeout(150)  # reduced-motion skips animation delays
    vi = await page.locator('.sb-result-vi').inner_text()
    kr = await page.locator('.sb-result-kr').inner_text()
    return vi.replace('발음 듣기','').strip(), kr.replace('문장 뜻: ', '').strip()

async def main():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium')
        page = await browser.new_page(viewport={'width':390,'height':844})
        await page.emulate_media(reduced_motion="reduce")
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: errors.append(str(exc)))
        await page.goto('file://' + __import__('os').path.abspath('app.html'))
        await page.wait_for_timeout(300)
        await page.click('[data-tab="grammar"]')
        await page.wait_for_timeout(150)
        await page.click('.subtab-btn[data-grammar="builder"]')
        await page.wait_for_timeout(150)

        async def reset():
            # reload fresh state by re-selecting defaults each time explicitly per test
            pass

        tests = []

        # 1. simple statement: toi + di (intrans)
        await set_select(page, 'sb-stype', '0')
        await set_select(page, 'sb-connective', '')
        await set_select(page, 'sb-subject', 'p0')  # tôi
        await set_select(page, 'sb-adjective', '')
        await set_select(page, 'sb-aux', '')
        await set_select(page, 'sb-verb', 'i0')  # đi
        await set_select(page, 'sb-manner', '')
        await set_select(page, 'sb-place', '')
        await set_select(page, 'sb-time', '')
        vi, kr = await generate_and_read(page)
        tests.append(('1 simple statement', vi, kr, 'Tôi đi.', '나는 갑니다.'))

        # 2. full combo
        await set_select(page, 'sb-subject', 'p0')  # tôi
        await set_select(page, 'sb-aux', '0')  # muốn
        await set_select(page, 'sb-verb', 't0')  # ăn
        await page.wait_for_timeout(50)
        await set_select(page, 'sb-object', '0')  # cơm
        await set_select(page, 'sb-adjective', '0')  # ngon
        await set_select(page, 'sb-manner', '0')  # nhanh
        await set_select(page, 'sb-place', '0')  # o nha
        await set_select(page, 'sb-time', '0')  # vao buoi sang
        vi, kr = await generate_and_read(page)
        tests.append(('2 full combo', vi, kr,
                       'Tôi muốn ăn cơm ngon nhanh ở nhà vào buổi sáng.',
                       '아침에 집에서 나는 맛있는 밥을 빨리 먹고 싶습니다.'))

        # 3. negative
        await set_select(page, 'sb-aux', '')
        await set_select(page, 'sb-adjective', '')
        await set_select(page, 'sb-manner', '')
        await set_select(page, 'sb-place', '')
        await set_select(page, 'sb-time', '')
        await set_select(page, 'sb-subject', 'p1')  # ban
        await set_select(page, 'sb-verb', 't2')  # doc
        await set_select(page, 'sb-object', '2')  # sach
        await set_select(page, 'sb-stype', '1')  # negative
        vi, kr = await generate_and_read(page)
        tests.append(('3 negative', vi, kr, 'Bạn không đọc sách.', '너는 책을 읽지 않습니다.'))

        # 4. yesno with co the (can) + vowel-final stem
        await set_select(page, 'sb-subject', 'p0')  # toi
        await set_select(page, 'sb-aux', '2')  # co the
        await set_select(page, 'sb-verb', 't6')  # xem
        await set_select(page, 'sb-object', '6')  # phim
        await set_select(page, 'sb-stype', '2')  # yesno
        vi, kr = await generate_and_read(page)
        tests.append(('4 yesno can', vi, kr, 'Tôi có thể xem phim không?', '나는 영화를 볼 수 있습니까?'))

        # 5. imperative
        await set_select(page, 'sb-subject', 'p1')  # ban
        await set_select(page, 'sb-aux', '')
        await set_select(page, 'sb-verb', 'i0')  # di
        await set_select(page, 'sb-object', '')
        await set_select(page, 'sb-stype', '3')  # imperative
        vi, kr = await generate_and_read(page)
        tests.append(('5 imperative', vi, kr, 'Bạn hãy đi đi!', '너는 가십시오.'))

        # 6. propositive
        await set_select(page, 'sb-subject', 'p5')  # chung ta
        await set_select(page, 'sb-verb', 't3')  # hoc
        await set_select(page, 'sb-object', '3')  # kinh thanh
        await set_select(page, 'sb-stype', '4')  # propositive
        vi, kr = await generate_and_read(page)
        tests.append(('6 propositive', vi, kr, 'Chúng ta hãy cùng học Kinh Thánh nhé!', '우리는 성경을 공부합시다.'))

        # 7. alternative
        await set_select(page, 'sb-subject', 'p0')
        await set_select(page, 'sb-verb', 't1')  # uong
        await set_select(page, 'sb-object', '1')  # nuoc
        await set_select(page, 'sb-stype', '5')  # alternative
        vi, kr = await generate_and_read(page)
        tests.append(('7 alternative', vi, kr, 'Tôi uống nước hay không?', '나는 물을 마십니까 아니면 안 그런가요?'))

        # 8. wh = ai
        await set_select(page, 'sb-verb', 'i3')  # ngu
        await set_select(page, 'sb-object', '')
        await set_select(page, 'sb-stype', '6')  # wh
        await page.wait_for_timeout(50)
        await set_select(page, 'sb-wh', '0')  # ai
        vi, kr = await generate_and_read(page)
        tests.append(('8 wh=ai', vi, kr, 'Ai ngủ?', '누가 잡니까?'))

        # 9. wh = gi with object
        await set_select(page, 'sb-subject', 'p1')  # ban
        await set_select(page, 'sb-verb', 't0')  # an
        await set_select(page, 'sb-object', '0')  # com
        await set_select(page, 'sb-wh', '1')  # gi
        vi, kr = await generate_and_read(page)
        tests.append(('9 wh=gi with obj', vi, kr, 'Bạn ăn gì?', '너는 무엇을 먹습니까?'))

        # 10. wh = gi without object (fallback)
        await set_select(page, 'sb-verb', 'i0')  # di
        await set_select(page, 'sb-object', '')
        vi, kr = await generate_and_read(page)
        tests.append(('10 wh=gi no obj', vi, kr, 'Bạn làm gì?', '너는 무엇을 합니까?'))

        # 11. wh = dau
        await set_select(page, 'sb-subject', 'p0')  # toi
        await set_select(page, 'sb-wh', '2')  # dau
        vi, kr = await generate_and_read(page)
        tests.append(('11 wh=dau', vi, kr, 'Tôi đi ở đâu?', '어디에서 나는 갑니까?'))

        # 12. wh = tai sao
        await set_select(page, 'sb-verb', 'i2')  # ve
        await set_select(page, 'sb-wh', '4')  # tai sao
        vi, kr = await generate_and_read(page)
        tests.append(('12 wh=taisao', vi, kr, 'Tại sao tôi về?', '왜 나는 돌아갑니까?'))

        # 13. wh = the nao
        await set_select(page, 'sb-subject', 'n0')  # hoc vien
        await set_select(page, 'sb-adjective', '2')  # tot
        await set_select(page, 'sb-wh', '5')  # the nao
        vi, kr = await generate_and_read(page)
        tests.append(('13 wh=thenao', vi, kr, 'Học viên tốt thế nào?', '좋은 학습자 어때요?'))

        # 14. connective + adjective on subject (intransitive, no object)
        await set_select(page, 'sb-stype', '0')  # statement
        await set_select(page, 'sb-wh', '0')
        await set_select(page, 'sb-connective', '0')  # Va
        await set_select(page, 'sb-subject', 'n0')  # hoc vien
        await set_select(page, 'sb-adjective', '0')  # ngon
        await set_select(page, 'sb-aux', '')
        await set_select(page, 'sb-verb', 'i0')  # di
        vi, kr = await generate_and_read(page)
        tests.append(('14 connective+adj-on-subject', vi, kr, 'Và, học viên ngon đi.', '그리고, 맛있는 학습자는 갑니다.'))

        # 15. yesno + co-the aux should NOT double "co"
        await set_select(page, 'sb-connective', '')
        await set_select(page, 'sb-subject', 'p0')
        await set_select(page, 'sb-adjective', '')
        await set_select(page, 'sb-aux', '2')  # co the
        await set_select(page, 'sb-verb', 't6')  # xem
        await set_select(page, 'sb-object', '6')  # phim
        await set_select(page, 'sb-stype', '2')  # yesno
        vi, kr = await generate_and_read(page)
        tests.append(('15 yesno+cothe no dup', vi, kr, 'Tôi có thể xem phim không?', '나는 영화를 볼 수 있습니까?'))

        # 16. subject "not used" + wh=ai (no more conflict/leftover selection)
        await set_select(page, 'sb-subject', '')  # not used
        await set_select(page, 'sb-aux', '')
        await set_select(page, 'sb-verb', 'i3')  # ngu
        await set_select(page, 'sb-object', '')
        await set_select(page, 'sb-stype', '6')  # wh
        await set_select(page, 'sb-wh', '0')  # ai
        vi, kr = await generate_and_read(page)
        tests.append(('16 subject-none + wh=ai', vi, kr, 'Ai ngủ?', '누가 잡니까?'))

        # 17. subject "not used" + imperative, no hay aux selected -> auto hãy still inserted
        await set_select(page, 'sb-stype', '3')  # imperative
        await set_select(page, 'sb-wh', '0')
        await set_select(page, 'sb-verb', 'i0')  # di
        vi, kr = await generate_and_read(page)
        tests.append(('17 subject-none imperative auto-hay', vi, kr, 'Hãy đi đi!', '가십시오.'))

        # 18. explicit "hãy" aux selected for imperative -> no duplicate hãy
        await set_select(page, 'sb-subject', 'p1')  # ban
        await set_select(page, 'sb-aux', '10')  # hay (11th item, index 10)
        await set_select(page, 'sb-verb', 't0')  # an
        await set_select(page, 'sb-object', '0')  # com
        vi, kr = await generate_and_read(page)
        tests.append(('18 explicit hay aux no dup', vi, kr, 'Bạn hãy ăn cơm đi!', '너는 밥을 먹으십시오.'))

        # 19. "hãy" aux forces Korean imperative ending even under statement sentence type
        await set_select(page, 'sb-stype', '0')  # statement
        await set_select(page, 'sb-subject', 'p0')  # toi
        await set_select(page, 'sb-aux', '10')  # hay
        await set_select(page, 'sb-verb', 'i0')  # di
        await set_select(page, 'sb-object', '')
        vi, kr = await generate_and_read(page)
        tests.append(('19 hay aux forces imperative kr', vi, kr, 'Tôi hãy đi.', '나는 가십시오.'))

        print("=== RESULTS ===")
        all_pass = True
        for name, vi, kr, exp_vi, exp_kr in tests:
            vi_ok = vi == exp_vi
            kr_ok = kr == exp_kr
            if not (vi_ok and kr_ok): all_pass = False
            print(f"{name}: {'OK' if vi_ok and kr_ok else 'FAIL'}")
            if not vi_ok: print(f"   VI got={vi!r} exp={exp_vi!r}")
            if not kr_ok: print(f"   KR got={kr!r} exp={exp_kr!r}")

        print("ALL PASS:", all_pass)
        print("CONSOLE/PAGE ERRORS:", [e for e in errors if 'ERR_CONNECTION_RESET' not in e])
        await browser.close()

asyncio.run(main())
