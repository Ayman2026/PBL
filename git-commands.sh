#!/bin/bash

# Git commands to push to GitHub
# Repository: https://github.com/Ayman2026/PBL.git

echo "🚀 Initializing Git repository..."
git init

echo "📦 Adding all files..."
git add .

echo "💾 Creating first commit..."
git commit -m "Initial commit: PBL Program Intelligence & Grant Reporting Assistant - Production ready"

echo "🌿 Setting main branch..."
git branch -M main

echo "🔗 Adding remote origin..."
git remote add origin https://github.com/Ayman2026/PBL.git

echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo "✅ Done! Your code is now on GitHub at: https://github.com/Ayman2026/PBL"
echo ""
echo "🎯 Next step: Deploy to Vercel"
echo "   1. Go to https://vercel.com"
echo "   2. Import your repository: Ayman2026/PBL"
echo "   3. Add environment variables (see START_HERE.txt)"
echo "   4. Click Deploy!"
