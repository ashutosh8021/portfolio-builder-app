@echo off

echo 🚀 Portfolio Builder - Netlify Deployment Setup
echo ===============================================

echo.
echo ✅ Your code is ready for Netlify + Supabase deployment!
echo.
echo 📋 DEPLOYMENT CHECKLIST:
echo.
echo 1. ✅ Netlify Functions created (5 endpoints)
echo 2. ✅ Supabase database schema ready
echo 3. ✅ Frontend configured for Netlify
echo 4. ✅ Build configuration (netlify.toml)
echo 5. ✅ Environment variables configured
echo.
echo 🌐 NEXT STEPS:
echo.
echo 1. 📊 SETUP SUPABASE:
echo    → Go to https://supabase.com
echo    → Create new project: portfolio-builder
echo    → Run SQL from supabase-schema.sql
echo    → Copy URL and anon key
echo.
echo 2. 📝 PUSH TO GITHUB:
echo    → git init
echo    → git add .
echo    → git commit -m "Ready for Netlify deployment"
echo    → Create GitHub repo and push
echo.
echo 3. 🚀 DEPLOY ON NETLIFY:
echo    → Go to https://netlify.com
echo    → Import from GitHub
echo    → Add environment variables:
echo      SUPABASE_URL=your-url
echo      SUPABASE_ANON_KEY=your-key
echo    → Deploy!
echo.
echo 📖 Full guide: deployment/netlify-supabase-deploy.md
echo.
echo 🎉 Total cost: $0.00 forever!

pause
