@echo off

REM Portfolio Builder - Windows Deployment Helper

echo 🚀 Portfolio Builder - Quick Deployment Setup
echo =============================================

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing Git repository...
    git init
    git add .
    git commit -m "Portfolio Builder - Ready for deployment"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

echo.
echo 📌 NEXT STEPS:
echo 1. Create a new repository on GitHub
echo 2. Copy the repository URL
echo 3. Run: git remote add origin https://github.com/yourusername/your-repo-name.git
echo 4. Run: git push -u origin main
echo.
echo 🌐 RECOMMENDED DEPLOYMENT: RENDER.COM
echo.
echo ✅ 100%% Free forever
echo ✅ PostgreSQL database included
echo ✅ Auto-deploy on git push
echo ✅ Free SSL certificates
echo ✅ No credit card required
echo.
echo 📖 Full guide: See DEPLOYMENT_GUIDE.md
echo.
echo 🎉 Your Portfolio Builder is ready for deployment!

pause
