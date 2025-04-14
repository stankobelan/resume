# PowerShell script to run ESLint auto-fix on all files
# This will automatically fix all fixable problems

Write-Host "Starting ESLint auto-fix for all files..." -ForegroundColor Cyan

# Run ESLint with the --fix flag on all relevant directories
npx eslint --ext .js,.ts,.vue src tests --fix

Write-Host "ESLint auto-fix complete!" -ForegroundColor Green