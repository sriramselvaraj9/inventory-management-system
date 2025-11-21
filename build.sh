#!/bin/bash

echo "🚀 RAILWAY DEPLOYMENT - Starting Build Process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build frontend
echo "🎨 Building React frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to backend public directory
echo "📁 Copying frontend build files..."
mkdir -p backend/public
cp -r frontend/build/* backend/public/

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
npm install

echo "✅ Build completed successfully!"
echo "🌐 Backend will serve frontend from /public directory"