# PowerShell script to normalize line endings to LF
# Usage: Run in PowerShell from the project root directory

Write-Host "Starting line ending normalization process..." -ForegroundColor Cyan

# Get all text files, excluding git and node_modules directories
$files = Get-ChildItem -Path . -Recurse -File | 
         Where-Object { 
           $_.FullName -notlike "*.git*" -and 
           $_.FullName -notlike "*node_modules*" -and
           $_.FullName -notlike "*dist*" -and
           $_.Extension -match "\.(js|ts|vue|json|md|html|css|scss|yml|yaml)$"
         }

$count = 0
foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        if ($content -and $content.Contains("`r`n")) {
            $newContent = $content.Replace("`r`n", "`n")
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Converted: $($file.FullName)" -ForegroundColor Green
            $count++
        }
    } catch {
        Write-Host "Error processing $($file.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "Line ending normalization complete! Converted $count file(s)." -ForegroundColor Cyan
Write-Host "Remember to stage and commit these changes." -ForegroundColor Yellow