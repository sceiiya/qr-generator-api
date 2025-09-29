#!/bin/bash

# QR Code API - Netlify Deployment Script
echo "🚀 Preparing QR Code API for Netlify deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we're on a branch
if [ -z "$(git branch --show-current)" ]; then
    echo "📝 Creating initial commit..."
    git add .
    git commit -m "feat: initial QR Code API setup for Netlify"
fi

# Add all files
echo "📦 Adding all files to git..."
git add .

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Committing changes..."
    git commit -m "feat: add Netlify serverless functions and deployment configuration

- Add netlify.toml configuration file
- Create serverless functions for QR generation
- Add public documentation page
- Configure build settings for Netlify
- Include comprehensive deployment guide"
else
    echo "✅ No changes to commit"
fi

echo ""
echo "🎯 Ready for Netlify deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push to your remote repository:"
echo "   git push origin main"
echo ""
echo "2. Go to https://netlify.com"
echo "3. Click 'New site from Git'"
echo "4. Choose your repository"
echo "5. Configure build settings:"
echo "   - Build command: pnpm run build:netlify"
echo "   - Publish directory: public"
echo "   - Functions directory: netlify/functions"
echo "6. Click 'Deploy site'"
echo ""
echo "🔗 Your API will be available at: https://your-site-name.netlify.app"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
