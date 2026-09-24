# Project Guidelines

## Standard Language Ordering (12개 언어 표준 순서 체계)
본 프로젝트의 모든 다국어 처리, UI 표시, 데이터 정의, 테스트 및 명령문(프롬프트) 작성 시 반드시 아래 12개 언어 순서 체계를 준수합니다:
- **A: 베트남어** (`vi`)
- **B: 체코어** (`cs`)
- **C: 중국어(간체)** (`zh_cn`)
- **D: 중국어(번체)** (`zh`)
- **E: 영어** (`en`)
- **F: 프랑스어** (`fr`)
- **G: 독일어** (`de`)
- **H: 헝가리어** (`hu`)
- **I: 인도네시아어** (`id`)
- **J: 일본어** (`ja`)
- **K: 한국어** (`ko`)
- **L: 폴란드어** (`pl`)

앞으로 모든 작업 명령문 및 지침 작성 시 반드시 이 순서(A~L)를 적용하여 작성합니다.

## Auto-Publish on Task Completion (작업 완료 시 자동 퍼블리쉬)
사용자의 요청에 따라 작업이 완료될 때마다 반드시 아래 퍼블리쉬 절차를 자동으로 수행합니다:
1. 앱 빌드 및 어셈블:
   ```powershell
   python build_app.py
   python assemble_app.py
   ```
2. Git 커밋 및 푸시 (Cloudflare Pages 자동 배포 트리거):
   ```powershell
   git add .
   git commit -m "<작업 내용을 명확히 기술한 커밋 메시지>"
   git push origin main
   ```
3. 푸시 완료 후 배포 상태 확인 및 보고.

