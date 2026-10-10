@echo off
echo ================================================
echo Digital Rochak Website - Sync to GitHub
echo ================================================
cd /d "C:\Users\rocha\OneDrive\Documents\Digital Rochak Website"
git add .
git commit -m "Auto-update website code"
git push -u origin main
echo ================================================
echo Sync Complete!
pause
