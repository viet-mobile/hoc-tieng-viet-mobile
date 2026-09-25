# [일반 문법] 해설 번역 — 인수인계 (2026-09-25)

## 현재 상태
- 완료: 번역 대상 236개 섹션 전부 (2026-09-25, 빈 섹션 10개 제외)
- 남은 작업: 없음 (선택: 빈 섹션 제목 번역)
- 빈 섹션(번역 불필요): 19–22, 25, 27, 28, 30, 32, 116

## 작업 방법 (저장소 루트에서 실행)
```
PYTHONIOENCODING=utf-8 python tools/grammar_translation/dump_sections.py 228 246   # 원문 확인 (반열림 구간 [a,b))
# gc/b100.txt, b101.txt ... 작성 (섹션 2개씩)
PYTHONIOENCODING=utf-8 python tools/grammar_translation/assemble_gc.py            # JSON 재생성, "problems: 0" 확인
PYTHONIOENCODING=utf-8 python -m unittest tests.test_general_pdf
git add general_pdf_grammar_ai_translations.json tools/grammar_translation && git commit && git push origin multi-cs-hu
```

## 배치 파일 형식 (gc/bNNN.txt) — 기존 b099.txt 참고
```
@@ <섹션 키>            ← dump 출력의 "pdf-grammar-xxxx#n"
=cs                     ← 언어 순서: cs, zh_cn, zh, en, fr, de, hu, id, ja, pl (10개 모두 필수)
Gramatický výklad       ← 첫 줄: "문법해설" 제목 번역
⟦표현⟧: 설명
⟦베트남어 예문⟧ → 번역 · ⟦예문⟧ → 번역
```
- 베트남어는 반드시 ⟦ ⟧ 로 감싸고 **원문 그대로** 둔다 (수정 금지). ⟦⟧ 밖에 한글이 있으면 assemble 에러.
- 섹션 제목(TITLE)에 한글이 있으면 `~t 제목cs|zh_cn|zh|en|fr|de|hu|id|ja|pl` 한 줄 필요.
- 한국어가 없는 섹션(베트남어만)은 `=ko` 블록(+ 제목이 있으면 `~tko`)도 추가.
- 한국어 해설이 틀린 경우(오역·복붙 오류)는 베트남어 원문 의미를 기준으로 번역.
- 섹션 213~245처럼 예문에 한국어 번역이 없으면 베트남어에서 직접 번역.

## 남은 섹션 목록
| idx | 키 | 표현 |
|---|---|---|
| 228 | pdf-grammar-ac736eaf898e9c06#0 | có thể nói / từ ... cho đến / với + (C-V) |
| 229 | pdf-grammar-ab2efd956a848023#0 | giúp / qua + (C-V) / nhận ra rằng |
| 230 | pdf-grammar-ee518cd96eccf23f#0 | cho thấy / có khi / kể cả / chưa hẳn |
| 231 | pdf-grammar-0c1cd51bcc5aa321#0 | trước kia / theo / đòi / cho |
| 232 | pdf-grammar-e51b78e8b091e5d9#0 | với, cùng với / gần như / bởi / phổ biến nhất |
| 233 | pdf-grammar-c9a698105e95cb2a#0 | lắm + N / làm gì mà / nhẵn túi / nói gì thì nói |
| 234 | pdf-grammar-475996212a7c04f7#0 | vẫn / có lẽ vì thế / chẳng có lấy / vinh danh là |
| 235 | pdf-grammar-528eccf07ef879a6#0 | ngay / hàng trăm hàng nghìn / vào, về + (C-V) |
| 236 | pdf-grammar-d3809f353345b484#0 | bao nhiêu năm / vì...nên / dù...nhưng / V + (C-V) |
| 237 | pdf-grammar-674f6e030e2b14b6#0 | như ... đã biết / phải có / sao cho / về |
| 238 | pdf-grammar-9b331c267db2362b#0 | cho / đứng đầu / số từ + (A, V) |
| 239 | pdf-grammar-06b1362c226a55a5#0 | dạo này / thì sao / nghe người ta nói / quả là |
| 240 | pdf-grammar-fe15689521673e22#0 | nhằm / dù...nhưng / V + vào / không phải lúc nào cũng |
| 241 | pdf-grammar-3fcf8ff4579a8eab#0 | tự mình / duy nhất / bộ phận giải thích |
| 242 | pdf-grammar-229c2dccf5401a69#0 | nhiều...nhất / A1 + nhưng + A2 / không chỉ là...mà còn là |
| 243 | pdf-grammar-41d6470b697f7dd9#0 | tính từ tuyệt đối / A + (C-V) / toàn |
| 244 | pdf-grammar-d0a5fcf6bf0b09a0#0 | mỗi khi...thì / có khi...có khi / (C-V) + vì |
| 245 | pdf-grammar-4353bfc953ed5661#0 | mới nói / nào là / thế này nữa chứ / chỉ...mà |

## 마무리 체크리스트 (전부 끝난 뒤)
1. `assemble_gc.py` → "sections translated: 236 of 246" (빈 섹션 10개 제외), problems 0
2. `python build_app.py --profile general|jw|jeonju|ulsan` 로컬 빌드 확인
3. `python -m unittest tests.test_general_pdf`
4. commit & push `origin multi-cs-hu` → Cloudflare Pages 4개(GENERAL, JW, JEONJU, ULSAN) 배포 확인
5. 선택: 빈 섹션 제목만 있는 경우 11개 언어 제목 번역 추가
