@echo off
title Memulai AutoMaster - Perawatan Otomotif TKR
echo ==========================================================
echo       MEMULAI GAME AUTOMASTER OFFLINE FLASH PLAYER
echo ==========================================================
echo.
echo Menyiapkan lingkungan bermain terbaik...
echo.

:: Pengecekan folder aktif (apakah ada index.html di folder saat ini)
if not exist "%~dp0index.html" (
    echo [Pemberitahuan] File JALANKAN_GAME.bat dijalankan dari luar folder game.
    echo Mencari folder game di OneDrive / Documents Anda...
    
    :: Coba beberapa kemungkinan lokasi default secara bertahap
    if exist "c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 20234\GIM\" (
        cd /d "c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 20234\GIM\"
        goto :folder_found
    )
    if exist "c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM\" (
        cd /d "c:\Users\MyBook Hype\OneDrive\Documents\AGEN INFODESK 234\GIM\"
        goto :folder_found
    )
    if exist "%USERPROFILE%\OneDrive\Documents\AGEN INFODESK 20234\GIM\" (
        cd /d "%USERPROFILE%\OneDrive\Documents\AGEN INFODESK 20234\GIM\"
        goto :folder_found
    )
    if exist "%USERPROFILE%\OneDrive\Documents\AGEN INFODESK 234\GIM\" (
        cd /d "%USERPROFILE%\OneDrive\Documents\AGEN INFODESK 234\GIM\"
        goto :folder_found
    )
    if exist "%USERPROFILE%\Documents\AGEN INFODESK 20234\GIM\" (
        cd /d "%USERPROFILE%\Documents\AGEN INFODESK 20234\GIM\"
        goto :folder_found
    )
    if exist "%USERPROFILE%\Documents\AGEN INFODESK 234\GIM\" (
        cd /d "%USERPROFILE%\Documents\AGEN INFODESK 234\GIM\"
        goto :folder_found
    )
    
    :: Jika tidak ditemukan di lokasi default, cari di seluruh Documents / OneDrive
    echo [Pencarian] Mencari folder game bernama "GIM" yang berisi "index.html"...
    for /d /r "%USERPROFILE%\OneDrive\Documents" %%d in (*GIM*) do (
        if exist "%%d\index.html" (
            cd /d "%%d"
            goto :folder_found
        )
    )
    for /d /r "%USERPROFILE%\Documents" %%d in (*GIM*) do (
        if exist "%%d\index.html" (
            cd /d "%%d"
            goto :folder_found
        )
    )
    
    echo [ERROR] Tidak dapat menemukan folder game asli.
    echo Harap salin file JALANKAN_GAME.bat ini dan jalankan langsung dari dalam folder game utama Anda.
    pause
    exit
)

:folder_found
echo [OK] Beralih ke folder game: %CD%
echo.

:: 1. Cek Python
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Server lokal Python terdeteksi.
    echo Membuka game pada http://localhost:8000 ...
    echo (Jangan tutup jendela command prompt ini selama bermain)
    start http://localhost:8000
    python local_server.py
    exit
)

:: 2. Cek Node.js
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Server lokal Node.js terdeteksi.
    echo Membuka game pada http://localhost:8080 ...
    echo (Jangan tutup jendela command prompt ini selama bermain)
    start http://localhost:8080
    npx -y http-server -p 8080
    exit
)

:: 3. Jika tidak ada, jalankan Google Chrome dengan bendera file-access
set CHROME_PATH=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set CHROME_PATH="%LocalAppData%\Google\Chrome\Application\chrome.exe"

if not %CHROME_PATH%=="" (
    echo [OK] Membuka Google Chrome dengan izin file lokal...
    %CHROME_PATH% --allow-file-access-from-files "file:///%CD:\=/%/index.html"
    exit
)

:: 4. Cek Microsoft Edge dengan bendera file-access
set EDGE_PATH=""
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" set EDGE_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" set EDGE_PATH="C:\Program Files\Microsoft\Edge\Application\msedge.exe"

if not %EDGE_PATH%=="" (
    echo [OK] Membuka Microsoft Edge dengan izin file lokal...
    %EDGE_PATH% --allow-file-access-from-files "file:///%CD:\=/%/index.html"
    exit
)

:: 5. Fallback ke default browser
echo [PEMBERITAHUAN] Membuka langsung index.html pada browser default.
echo Jika animasi tidak berputar, disarankan menggunakan browser Firefox
echo atau jalankan perintah local server di folder game ini.
echo.
start "" "%CD%\index.html"
