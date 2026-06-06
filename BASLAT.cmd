@echo off
if not "%__MANEVI_CMD_OPEN%"=="1" (
  set "__MANEVI_CMD_OPEN=1"
  cmd /k ""%~f0""
  exit /b
)

chcp 65001 >nul
title Manevi Rehber - Expo Go
setlocal
cd /d "%~dp0"

set "PATH=C:\Program Files\nodejs;%~dp0node_modules\.bin;%PATH%"

rem Expo Go QR icin ADB gerekmez. Windows'ta ADB izin hatasi QR cikmadan Expo'yu kapatabiliyor.
set "ANDROID_HOME=%~dp0.no-adb-for-qr"
set "ANDROID_SDK_ROOT=%~dp0.no-adb-for-qr"
set "EXPO_NO_DOTENV=1"
set "EXPO_NO_TELEMETRY=1"

:menu
cls
echo ========================================
echo   MANEVI REHBER - TEK BASLATMA DOSYASI
echo ========================================
echo.
echo Telefon: Samsung A25 + Expo Go
echo PC: Windows 10 + CMD
echo.
echo Once telefon ve PC ayni Wi-Fi aginda olsun.
echo Telefonda mobil veri, VPN ve Ozel DNS kapali olsun.
echo.
echo  1 = Wi-Fi QR ile baslat       ^(onerilen^)
echo  2 = Tunnel ile baslat         ^(Wi-Fi olmazsa, internet ister^)
echo  3 = Firewall izni ekle        ^(Wi-Fi icin bir kez, yonetici gerekir^)
echo  4 = Kontrol et
echo  5 = Bagimliliklari yukle      ^(npm install^)
echo  6 = PC'de tarayicida test et  ^(web^)
echo  0 = Cikis
echo.
set /p SEC="Secim (Enter=1): "
if "%SEC%"=="" set "SEC=1"
if "%SEC%"=="1" goto :wifi
if "%SEC%"=="2" goto :tunnel
if "%SEC%"=="3" goto :firewall
if "%SEC%"=="4" goto :kontrol
if "%SEC%"=="5" goto :install
if "%SEC%"=="6" goto :web
if "%SEC%"=="0" exit /b 0
goto :menu

:check_node
where node >nul 2>&1
if errorlevel 1 (
  echo [HATA] Node.js bulunamadi.
  echo Kurulmasi gereken uygulama: Node.js LTS
  echo Indirme: https://nodejs.org
  echo.
  pause
  goto :menu
)
where npx.cmd >nul 2>&1
if errorlevel 1 (
  echo [HATA] npx bulunamadi. Node.js LTS'i yeniden kurun.
  echo.
  pause
  goto :menu
)
exit /b 0

:check_modules
if not exist "node_modules\expo" (
  echo [HATA] Proje paketleri eksik.
  echo Once menuden 5 secin: Bagimliliklari yukle.
  echo.
  pause
  goto :menu
)
exit /b 0

:clean_ports
echo Eski Expo portlari kapatiliyor...
for %%P in (8081 8082 8083 8084 8085 8086 8087 8088 8089) do (
  for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%%P" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
  )
)
timeout /t 2 /nobreak >nul
exit /b 0

:wifi
call :check_node
call :check_modules
call :clean_ports
cls
echo ========================================
echo   Wi-Fi QR BASLATILIYOR
echo ========================================
echo.
for /f "delims=" %%i in ('node "%~dp0scripts\get-lan-ip.js" 2^>nul') do set "REACT_NATIVE_PACKAGER_HOSTNAME=%%i"
if not defined REACT_NATIVE_PACKAGER_HOSTNAME (
  echo [HATA] PC IP adresi bulunamadi.
  echo Wi-Fi acik mi kontrol edin veya menuden 2 Tunnel deneyin.
  echo.
  pause
  goto :menu
)
echo PC IP: %REACT_NATIVE_PACKAGER_HOSTNAME%
echo.
echo Expo Go'da QR okutun.
echo QR cikmazsa Expo Go icinde manuel URL girin:
echo.
echo   exp://%REACT_NATIVE_PACKAGER_HOSTNAME%:8081
echo.
echo Bu pencereyi kapatmayin.
echo.
npx.cmd expo start --go --lan --clear --port 8081
echo.
echo Expo kapandi veya hata verdi. Yukaridaki mesaji okuyun.
pause
goto :menu

:tunnel
call :check_node
call :check_modules
call :clean_ports
cls
echo ========================================
echo   TUNNEL QR BASLATILIYOR
echo ========================================
echo.
echo Internet gerekir. Ilk acilis 2-3 dakika surebilir.
echo Windows izin/antivirus engellerse Wi-Fi modunu kullanin.
echo.
npx.cmd expo start --go --tunnel --clear --port 8081
echo.
echo Expo kapandi veya hata verdi. Yukaridaki mesaji okuyun.
pause
goto :menu

:firewall
cls
echo ========================================
echo   FIREWALL IZNI
echo ========================================
echo.
net session >nul 2>&1
if errorlevel 1 (
  echo Bu islem icin yonetici izni gerekiyor.
  echo.
  echo Simdi bu pencereyi kapatin.
  echo BASLAT.cmd dosyasina SAG TIK yapin.
  echo "Yonetici olarak calistir" secin.
  echo Sonra menuden 3 secin.
  echo.
  pause
  goto :menu
)
netsh advfirewall firewall delete rule name="Manevi Rehber Expo" >nul 2>&1
netsh advfirewall firewall add rule name="Manevi Rehber Expo" dir=in action=allow protocol=TCP localport=8081-8089
netsh advfirewall firewall delete rule name="Manevi Rehber Expo UDP" >nul 2>&1
netsh advfirewall firewall add rule name="Manevi Rehber Expo UDP" dir=in action=allow protocol=UDP localport=8081-8089
if exist "C:\Program Files\nodejs\node.exe" (
  netsh advfirewall firewall delete rule name="Manevi Rehber Node.js" >nul 2>&1
  netsh advfirewall firewall add rule name="Manevi Rehber Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
)
echo.
echo [OK] Firewall izni eklendi. Simdi menuden 1 ile Wi-Fi QR deneyin.
echo.
pause
goto :menu

:kontrol
cls
echo ========================================
echo   SISTEM KONTROL
echo ========================================
echo.
where node >nul 2>&1
if errorlevel 1 (
  echo [X] Node.js yok
) else (
  for /f "delims=" %%v in ('node -v') do echo [OK] Node.js %%v
)
where npm.cmd >nul 2>&1
if errorlevel 1 (echo [X] npm yok) else (echo [OK] npm hazir)
where npx.cmd >nul 2>&1
if errorlevel 1 (echo [X] npx yok) else (echo [OK] npx hazir)
if exist "node_modules\expo" (echo [OK] Proje paketleri yuklu) else (echo [X] node_modules eksik)
echo.
echo PC IP:
node "%~dp0scripts\get-lan-ip.js" 2>nul
echo.
echo.
echo Telefon testi:
echo 1. Menuden 1 ile Expo'yu baslatin.
echo 2. Telefonda Chrome'a su adresi yazin:
echo    http://PC_IP:8081
echo Acilmiyorsa sorun firewall/modem/ayni Wi-Fi tarafindadir.
echo.
pause
goto :menu

:install
call :check_node
cls
echo ========================================
echo   BAGIMLILIKLAR YUKLENIYOR
echo ========================================
echo.
echo Internet gerekir. Bu islem birkac dakika surebilir.
echo.
npm install
echo.
echo Islem bitti. Menuden 1 ile baslatabilirsiniz.
pause
goto :menu

:web
call :check_node
call :check_modules
call :clean_ports
cls
echo ========================================
echo   PC TARAYICI TESTI
echo ========================================
echo.
if not exist "node_modules\react-native-web" (
  echo [HATA] Web test paketleri eksik.
  echo.
  echo Once internet acikken menuden 5 secin.
  echo Ya da CMD'de sunu calistirin:
  echo.
  echo   npm install
  echo.
  pause
  goto :menu
)
echo Tarayicida acilacak adres:
echo.
echo   http://localhost:8082
echo.
echo Bu pencereyi kapatmayin.
echo.
npx.cmd expo start --web --clear --port 8082
echo.
echo Web sunucusu kapandi veya hata verdi. Yukaridaki mesaji okuyun.
pause
goto :menu
