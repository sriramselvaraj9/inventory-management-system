@echo off
title Deploy Inventory Management to Public Web

echo.
echo 🚀 DEPLOY INVENTORY MANAGEMENT SYSTEM TO PUBLIC WEB
echo ================================================
echo.

echo 🎯 This will make your app accessible worldwide with a Google-searchable URL!
echo.

echo 📋 DEPLOYMENT OPTIONS:
echo.
echo 1. 🆓 VERCEL (Recommended - FREE)
echo    - Instant deployment
echo    - Free HTTPS
echo    - URL: https://your-app-name.vercel.app
echo    - Google indexable: YES
echo.
echo 2. 🌐 NETLIFY (Alternative - FREE)  
echo    - Easy deployment
echo    - Free SSL
echo    - URL: https://your-app-name.netlify.app
echo    - Google indexable: YES
echo.
echo 3. 🚂 RAILWAY (Full-stack - FREE tier)
echo    - Backend + Frontend
echo    - URL: https://your-app-name.up.railway.app  
echo    - Google indexable: YES
echo.

echo 🔧 QUICK DEPLOY STEPS:
echo =====================
echo.
echo Option 1 - VERCEL (Easiest):
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub/Google (free)
echo 3. Click "New Project"
echo 4. Import this folder
echo 5. Deploy with one click!
echo 6. Get URL: https://inventory-[random].vercel.app
echo.

echo Option 2 - Manual Upload:
echo 1. Run: npm run build (in frontend folder)
echo 2. Upload 'build' folder to any web host
echo 3. Configure backend API separately
echo.

echo 📱 AFTER DEPLOYMENT:
echo ==================
echo ✅ Your app will have a permanent URL
echo ✅ Accessible from anywhere in the world  
echo ✅ Google will index it (searchable)
echo ✅ Mobile responsive design
echo ✅ Professional appearance
echo ✅ Share the URL with anyone!
echo.

echo 🔍 MAKE IT SEARCHABLE ON GOOGLE:
echo ================================
echo 1. Submit URL to Google Search Console
echo 2. Share on social media
echo 3. Add to business directories
echo 4. Include in email signatures
echo.

echo 🎉 Sample URLs you'll get:
echo - https://inventory-management-pro.vercel.app
echo - https://stocktracker-business.netlify.app  
echo - https://warehouse-manager.up.railway.app
echo.

pause

echo.
echo 🚀 Building production version...
cd frontend
call npm run build
cd ..

echo.
echo ✅ Production build complete!
echo 📁 Files ready in 'frontend/build' folder
echo.
echo 🌐 NEXT STEPS:
echo 1. Go to https://vercel.com
echo 2. Create free account
echo 3. Import this project
echo 4. Deploy instantly!
echo.
echo 🎯 Your public URL will be: https://[your-project-name].vercel.app
echo.

pause