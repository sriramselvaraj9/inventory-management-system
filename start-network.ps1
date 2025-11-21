# Inventory Management System
# Network Deployment Script

Write-Host "🚀 Starting Inventory Management System for Network Access..." -ForegroundColor Green
Write-Host ""

# Get local IP address
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"})[0].IPAddress

if (-not $ipAddress) {
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*" | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"})[0].IPAddress
}

if ($ipAddress) {
    Write-Host "📡 Your IP Address: $ipAddress" -ForegroundColor Cyan
    Write-Host "📱 Access from any device: http://$ipAddress:3001" -ForegroundColor Yellow
    Write-Host "🔗 Backend API: http://$ipAddress:5000" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Could not detect IP address. Check network connection." -ForegroundColor Red
}

Write-Host ""
Write-Host "🔥 Configuring Windows Firewall..." -ForegroundColor Green

# Add firewall rules for Node.js
try {
    New-NetFirewallRule -DisplayName "Node.js Frontend" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -ErrorAction SilentlyContinue
    New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow -ErrorAction SilentlyContinue
    Write-Host "✅ Firewall rules added successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not add firewall rules. You may need to run as Administrator." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Green

# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\srira\inventory-management-app\backend'; node server.js" -WindowStyle Normal

Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Green

# Start frontend server with network access
$env:HOST = '0.0.0.0'
$env:PORT = '3001'
Set-Location "C:\Users\srira\inventory-management-app\frontend"

Write-Host ""
Write-Host "🎉 System Starting..." -ForegroundColor Green
Write-Host "📋 Instructions:" -ForegroundColor White
Write-Host "   1. Wait for both servers to fully start" -ForegroundColor Gray
Write-Host "   2. Open browser to: http://$ipAddress:3001" -ForegroundColor Gray
Write-Host "   3. Share the URL with other devices on your network" -ForegroundColor Gray
Write-Host ""

npm start