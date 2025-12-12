# PowerShell Script to Prepare Brochure for Deployment
# Run this script to prepare files for GitHub + Vercel deployment

Write-Host "🚀 Preparing NAS Brochure for Deployment..." -ForegroundColor Cyan

# Create deployment folder
$deployFolder = "nas-brochure-deploy"
if (Test-Path $deployFolder) {
    Write-Host "⚠️  Folder $deployFolder already exists. Removing..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $deployFolder
}

New-Item -ItemType Directory -Path $deployFolder | Out-Null
New-Item -ItemType Directory -Path "$deployFolder\assets" | Out-Null
New-Item -ItemType Directory -Path "$deployFolder\screenshots" | Out-Null

Write-Host "✅ Created folder structure" -ForegroundColor Green

# Copy and rename HTML file
$sourceHtml = "docs\NAS_BROCHURE.html"
$destHtml = "$deployFolder\index.html"

if (Test-Path $sourceHtml) {
    Copy-Item $sourceHtml $destHtml
    Write-Host "✅ Copied HTML file (renamed to index.html)" -ForegroundColor Green
    
    # Update logo path in HTML
    $content = Get-Content $destHtml -Raw
    $content = $content -replace '../src/assets/NASlogonew.png', 'assets/NASlogonew.png'
    Set-Content $destHtml $content
    Write-Host "✅ Updated logo path in HTML" -ForegroundColor Green
} else {
    Write-Host "❌ Error: $sourceHtml not found!" -ForegroundColor Red
    exit 1
}

# Copy logo
$sourceLogo = "src\assets\NASlogonew.png"
$destLogo = "$deployFolder\assets\NASlogonew.png"

if (Test-Path $sourceLogo) {
    Copy-Item $sourceLogo $destLogo
    Write-Host "✅ Copied logo" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Logo not found at $sourceLogo" -ForegroundColor Yellow
}

# Copy screenshots
$sourceScreenshots = "docs\screenshots"
$destScreenshots = "$deployFolder\screenshots"

if (Test-Path $sourceScreenshots) {
    Copy-Item -Path "$sourceScreenshots\*" -Destination $destScreenshots -Recurse
    $screenshotCount = (Get-ChildItem $destScreenshots).Count
    Write-Host "✅ Copied $screenshotCount screenshot(s)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Screenshots folder not found at $sourceScreenshots" -ForegroundColor Yellow
}

# Create README
$readmeContent = @"
# NAS Brochure

Neeraj's AI Software - Company Brochure

Deployed to: https://nasneeraj.com

## Files

- \`index.html\` - Main brochure page
- \`assets/\` - Logo and assets
- \`screenshots/\` - SISLMS screenshots

## Deployment

This site is automatically deployed via Vercel when changes are pushed to GitHub.
"@

Set-Content -Path "$deployFolder\README.md" -Value $readmeContent
Write-Host "✅ Created README.md" -ForegroundColor Green

Write-Host "`n✨ Preparation Complete!" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. cd $deployFolder" -ForegroundColor White
Write-Host "2. git init" -ForegroundColor White
Write-Host "3. git add ." -ForegroundColor White
Write-Host "4. git commit -m 'Initial commit: NAS brochure'" -ForegroundColor White
Write-Host "5. Create GitHub repo and push" -ForegroundColor White
Write-Host "6. Deploy to Vercel" -ForegroundColor White
Write-Host "`nSee DEPLOY_GITHUB_VERCEL_GUIDE.md for detailed instructions" -ForegroundColor Cyan

