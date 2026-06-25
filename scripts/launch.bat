@echo off
REM ============================================================
REM  Fountain of Knowledge - launcher
REM  Starts the local dev server (if needed) and opens the app
REM  in a clean, app-style browser window.
REM  Run via "Fountain of Knowledge.vbs" so this stays hidden.
REM ============================================================
setlocal EnableExtensions
cd /d "%~dp0.."

set "URL=http://localhost:5173"

REM ---- First run: install dependencies in a visible window ----
if not exist "node_modules" goto firstrun

REM ---- Is the server already listening on 5173? ----
powershell -NoProfile -Command "try{$c=New-Object Net.Sockets.TcpClient;$c.Connect('127.0.0.1',5173);$c.Close();exit 0}catch{exit 1}" >nul 2>&1
if %errorlevel%==0 goto open

REM ---- Start the dev server in its own minimized window ----
start "Fountain of Knowledge (server) - close to quit" /min cmd /c "npm run dev"
goto wait

:firstrun
echo Setting up Fountain of Knowledge for the first time...
start "Fountain of Knowledge - first run setup" cmd /k "npm install && npm run dev"
goto wait

:wait
REM ---- Wait (up to ~60s) for the server to respond ----
powershell -NoProfile -Command "for($i=0;$i -lt 120;$i++){try{Invoke-WebRequest -UseBasicParsing '%URL%' -TimeoutSec 2 | Out-Null; exit 0}catch{Start-Sleep -Milliseconds 500}}; exit 1" >nul 2>&1

:open
REM ---- Find Chrome, then Edge, for app-window mode ----
set "BROWSER="
for %%P in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do if exist "%%~P" set "BROWSER=%%~P"

if not defined BROWSER for %%P in (
  "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
  "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
) do if exist "%%~P" set "BROWSER=%%~P"

if defined BROWSER (
  start "" "%BROWSER%" --app=%URL% --window-size=1200,840
) else (
  REM No Chromium browser found: fall back to the default browser.
  start "" "%URL%"
)

endlocal
