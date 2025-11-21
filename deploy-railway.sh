#!/bin/bash

# Railway Deployment Script for Inventory Management System
echo "🚂 RAILWAY DEPLOYMENT GUIDE"
echo "================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    echo ""
    echo "📥 Please install Railway CLI first:"
    echo "   npm install -g @railway/cli"
    echo ""
    echo "   Or visit: https://railway.app/cli"
    echo ""
    read -p "Press Enter after installing Railway CLI..."
fi

echo "🔐 Login to Railway..."
railway login

echo ""
echo "📁 Initialize Railway project..."
railway init

echo ""
echo "🔧 Set environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=5000

echo ""
echo "🚀 Deploy to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app will be available at:"
echo "   https://[your-project-name].railway.app"
echo ""
echo "📋 Next steps:"
echo "1. Visit Railway dashboard: https://railway.app/dashboard"
echo "2. Configure custom domain (optional)"
echo "3. Monitor logs and metrics"
echo ""
echo "🔍 For Google Search visibility:"
echo "1. Submit to Google Search Console"
echo "2. Create sitemap at: /sitemap.xml"
echo "3. Check robots.txt at: /robots.txt"