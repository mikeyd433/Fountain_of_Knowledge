# Creates a "Fountain of Knowledge" shortcut on your Desktop that opens the
# reader in an app-style window. Run it once via install-shortcut.bat.
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo      = Split-Path -Parent $scriptDir
$vbs       = Join-Path $scriptDir 'Fountain of Knowledge.vbs'
$ico       = Join-Path $scriptDir 'fountain.ico'
$desktop   = [Environment]::GetFolderPath('Desktop')
$lnkPath   = Join-Path $desktop 'Fountain of Knowledge.lnk'

$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($lnkPath)
$sc.TargetPath        = Join-Path $env:SystemRoot 'System32\wscript.exe'
$sc.Arguments         = '"' + $vbs + '"'
$sc.WorkingDirectory  = $repo
$sc.Description        = 'Open Fountain of Knowledge'
if (Test-Path $ico) { $sc.IconLocation = "$ico,0" }
$sc.Save()

Write-Host ""
Write-Host "  Done. 'Fountain of Knowledge' is now on your Desktop." -ForegroundColor Green
Write-Host "  Double-click it to open the reader." -ForegroundColor Green
Write-Host ""
