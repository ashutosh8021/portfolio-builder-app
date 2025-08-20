@echo off
REM Portfolio Builder Deployment Script for Windows

echo 🚀 Starting Portfolio Builder Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

if "%1"=="docker" goto deploy_docker
if "%1"=="cleanup" goto cleanup
if "%1"=="help" goto show_help
goto show_help

:deploy_docker
echo 📦 Deploying with Docker Compose...

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down 2>nul

REM Build and start containers
echo 🔨 Building and starting containers...
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo ❌ Failed to start containers
    exit /b 1
)

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🔍 Checking service health...

REM Check backend (using PowerShell)
powershell -Command "try { Invoke-RestMethod -Uri http://localhost:8080/api/portfolio/list -TimeoutSec 5 | Out-Null; exit 0 } catch { exit 1 }"
if %errorlevel% equ 0 (
    echo ✅ Backend is healthy
) else (
    echo ❌ Backend health check failed
    docker-compose logs backend
    exit /b 1
)

REM Check frontend (using PowerShell)
powershell -Command "try { Invoke-WebRequest -Uri http://localhost:4200 -TimeoutSec 5 | Out-Null; exit 0 } catch { exit 1 }"
if %errorlevel% equ 0 (
    echo ✅ Frontend is healthy
) else (
    echo ❌ Frontend health check failed
    docker-compose logs frontend
    exit /b 1
)

echo 🎉 Deployment successful!
echo 🌐 Frontend: http://localhost:4200
echo 🔧 Backend API: http://localhost:8080
echo 🗄️ Database: localhost:3306
echo.
echo 📋 Useful commands:
echo   docker-compose logs          - View all logs
echo   docker-compose logs backend  - View backend logs
echo   docker-compose logs frontend - View frontend logs
echo   docker-compose ps            - View container status
echo   deploy.bat cleanup           - Stop and remove containers
goto end

:cleanup
echo 🧹 Cleaning up...
docker-compose down -v
docker system prune -f
echo ✅ Cleanup completed
goto end

:show_help
echo Usage: deploy.bat [command]
echo.
echo Commands:
echo   docker    - Deploy using Docker Compose (recommended)
echo   cleanup   - Stop and remove all containers
echo   help      - Show this help message
echo.
echo Examples:
echo   deploy.bat docker
echo   deploy.bat cleanup
goto end

:end
