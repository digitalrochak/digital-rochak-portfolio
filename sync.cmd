@echo off
echo ================================================
echo Digital Rochak Website - GitHub Automatic Sync
echo ================================================
cd /d "C:\Users\rocha\OneDrive\Documents\Digital Rochak Website"
git add .
git commit -m "Automatic portfolio website update"
git push origin main
echo ================================================
echo GitHub Repository Sync Complete!
echo ================================================
pause
