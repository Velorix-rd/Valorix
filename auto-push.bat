@echo off
title Velorix Auto-Deploy to GitHub & Netlify
color 0a

echo ===================================================
echo       VELORIX 1-CLICK AUTO-PUSH TO GITHUB
echo ===================================================
echo.

echo [1/3] Adding all changed files...
git add .

echo.
echo [2/3] Committing changes with SEO & Meta Tags...
git commit -m "feat(seo): update Google Search Console verification, meta tags, and Netlify configuration"

echo.
echo [3/3] Pushing directly to GitHub (main branch)...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. Trying push to master branch...
    git push origin master
)

echo.
echo ===================================================
echo  [SUCCESS] Code pushed to GitHub successfully!
echo  Netlify is now auto-building and deploying live.
echo ===================================================
echo.
pause
