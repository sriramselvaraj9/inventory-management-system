@echo off
title Inventory Management - Network Deployment

echo.
echo 🚀 Starting Inventory Management System for Network Access...
echo.

REM Get IP Address
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set "ip=%%i"
    set "ip=!ip: =!"
    if not "!ip!"=="" (
        if not "!ip:~0,3!"=="127" (
            set "network_ip=!ip!"
            goto :ip_found
        )
    )
)

:ip_found
echo 📡 Your IP Address: %network_ip%
echo 📱 Access from any device: http://%network_ip%:3001
echo 🔗 Backend API: http://%network_ip%:5000
echo.

echo 🔧 Adding Windows Firewall Rules...
netsh advfirewall firewall add rule name="Node.js Frontend" dir=in action=allow protocol=TCP localport=3001 > nul 2>&1
netsh advfirewall firewall add rule name="Node.js Backend" dir=in action=allow protocol=TCP localport=5000 > nul 2>&1
echo ✅ Firewall rules configured

echo.
echo 🔧 Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\srira\inventory-management-app\backend && node server.js"

echo ⏳ Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Server...
cd /d "C:\Users\srira\inventory-management-app\frontend"

echo.
echo 🎉 System Starting...
echo 📋 Instructions:
echo    1. Wait for both servers to fully start
echo    2. Open browser to: http://%network_ip%:3001  
echo    3. Share the URL with other devices on your network
echo.

set HOST=0.0.0.0
set PORT=3001
npm start