# 베트남어 학습반 — 소스 코드

이 zip 파일은 현재 게시된 Artifact(`https://claude.ai/code/artifact/5bef8935-50dc-4ba2-a84b-5661043c73d0`)를 만드는 데 쓰인 전체 소스 코드입니다. VS Code 등 원하는 에디터로 열어서 자유롭게 수정할 수 있습니다.

## 폴더 구조 / 핵심 파일

- `template.html` — 앱의 HTML 뼈대(마크업, 구조, 스타일).
- `app_logic.js` — 앱의 모든 JavaScript 동작 로직(탭 전환, TTS, 퀴즈, 복습 등).
- `*_data.py` — 각 학습 콘텐츠(문법, 어휘, 성경, 발음 등)를 담은 Python 데이터 모듈들. 예: `grammar_data.py`, `curriculum_data.py`, `bible_names_data.py`, `pronunciation_data.py` 등.
- `app_data.json`, `vocab_chain.json`, `vocab_groups.json`, `vocab_theo.json`, `freq_vocab.json` — JSON 형태로 저장된 대용량 데이터.
- `build_app.py` — 위의 모든 `*_data.py`/`*.json` 데이터를 읽어 하나의 `data_block.js`(브라우저에서 쓰는 JS 상수 모음)로 합쳐주는 빌드 스크립트.
- `assemble_app.py` — `template.html` + `app_logic.js` + `data_block.js`를 합쳐 최종 결과물인 `app.html`(배포되는 단일 HTML 파일)을 생성하는 스크립트.
- `verify_relabel.py` 및 각종 `verify_*.py` — 빌드 후 데이터 무결성/라벨링을 점검하는 검증 스크립트들.
- `app.html` — 마지막으로 빌드된 최종 결과물(참고용으로 포함되어 있으며, 실제로는 위 파이프라인으로 재생성됨).

## 다시 빌드하는 방법

```bash
python3 build_app.py       # *_data.py + json → data_block.js 생성
python3 assemble_app.py     # template.html + app_logic.js + data_block.js → app.html 생성
python3 verify_relabel.py   # (선택) 데이터 검증
```

Python 3와 표준 라이브러리만 있으면 됩니다(별도 pip 설치 불필요).

## 수정 시 유의사항

- 실제 콘텐츠를 고치려면 해당 `*_data.py`(또는 `*.json`) 파일을, UI 동작을 고치려면 `app_logic.js`를, 레이아웃/마크업을 고치려면 `template.html`을 수정한 뒤 위 빌드 3단계를 다시 실행하세요.
- `app.html`을 직접 수정하지 마세요 — 다음 빌드 시 덮어씌워집니다.
- 이 zip에는 그동안 작업 중 생성된 스크래치/체크용 스크립트(`check*.py`, `verify_wt*.py` 등)도 함께 포함되어 있습니다. 실제 빌드에 필요한 것은 위에 정리된 핵심 파일들뿐입니다.
