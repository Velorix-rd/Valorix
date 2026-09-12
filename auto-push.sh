#!/bin/bash
# Velorix 1-Click Auto Push Script for Linux / Mac / Git Bash

echo "==================================================="
echo "      VELORIX 1-CLICK AUTO-PUSH TO GITHUB"
echo "==================================================="
echo ""

echo "📦 [1/3] Staging all files..."
git add .

echo "💬 [2/3] Committing updates..."
git commit -m "feat(seo): update Google Search Console verification, meta tags, and Netlify configuration"

echo "🚀 [3/3] Pushing to GitHub (origin main)..."
if git push origin main; then
    echo ""
    echo "==================================================="
    echo "  ✅ SUCCESS: Code pushed to GitHub successfully!"
    echo "  Netlify will auto-deploy in 10 seconds."
    echo "==================================================="
else
    echo "⚠️ main branch failed, trying master..."
    git push origin master
fi
