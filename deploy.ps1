python build_app.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

python assemble_app.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git add .
git status

$MESSAGE = Read-Host "Commit message"
if ([string]::IsNullOrWhiteSpace($MESSAGE)) {
    $MESSAGE = "update: site content"
}

git commit -m $MESSAGE
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

git push origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "========================================"
Write-Host "Build + Commit + Push completed!"
Write-Host "Cloudflare Pages will deploy automatically."
Write-Host "========================================"