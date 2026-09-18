# Project Guidelines

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

