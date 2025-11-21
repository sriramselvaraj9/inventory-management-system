@echo off
echo 🚀 RAILWAY DEPLOYMENT - Starting Build Process...

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Build frontend
echo 🎨 Building React frontend...
cd frontend
call npm install
call npm run build
cd ..

REM Copy frontend build to backend public directory
echo 📁 Copying frontend build files...
if not exist "backend\public" mkdir "backend\public"
xcopy "frontend\build\*" "backend\public\" /E /I /Y

REM Install backend dependencies
echo 🔧 Installing backend dependencies...
cd backend
call npm install

echo ✅ Build completed successfully!
echo 🌐 Backend will serve frontend from /public directory