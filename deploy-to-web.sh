#!/bin/bash

echo "🚀 Deploying Inventory Management System to Public Web..."
echo ""

# Build the frontend
echo "🎨 Building frontend for production..."
cd frontend
npm run build
cd ..

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
echo ""
echo "📋 Instructions:"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Run: vercel --prod"
echo "3. Follow the prompts"
echo "4. Get your public URL!"
echo ""
echo "🔗 Your site will be available at: https://[project-name].vercel.app"
echo "🌐 This URL will be indexable by Google!"
echo ""
echo "📱 To make it searchable on Google:"
echo "1. Submit to Google Search Console"
echo "2. Add meta tags (already included)"
echo "3. Create quality content"
echo "4. Share on social media"
echo ""
echo "✅ Files ready for deployment!"

# Create a simple deployment script
echo "Creating deployment helper..."
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "🚀 Quick Deploy Script"
echo "1. Make sure you have Vercel CLI: npm install -g vercel"
echo "2. Run: vercel --prod"
echo "3. Your app will be live at: https://[random-name].vercel.app"
echo ""
echo "To get a custom domain:"
echo "1. Buy a domain (e.g., yourbusiness.com)"
echo "2. In Vercel dashboard, add custom domain"
echo "3. Update DNS settings"
echo "4. Your app will be at: https://yourbusiness.com"
EOF

chmod +x deploy.sh
echo "✅ Run './deploy.sh' for deployment instructions!"