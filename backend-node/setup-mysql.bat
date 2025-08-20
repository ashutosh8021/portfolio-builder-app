@echo off
echo Setting up MySQL Database for Portfolio Builder...
echo.

REM Check if MySQL is available
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL not found in PATH. Please install MySQL or use Docker option.
    echo.
    echo Option 1: Install MySQL from https://dev.mysql.com/downloads/mysql/
    echo Option 2: Use Docker - run: docker run --name mysql-portfolio -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=portfolio_builder -p 3306:3306 -d mysql:8.0
    echo.
    pause
    exit /b 1
)

REM Prompt for MySQL password
set /p mysql_password=Enter MySQL root password: 

REM Create database and tables
echo Creating database and tables...
mysql -u root -p%mysql_password% < setup-database.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database setup complete!
    echo.
    echo Next steps:
    echo 1. Update .env file with your database credentials
    echo 2. Run: npm start
    echo 3. Test at: http://localhost:8080/api/portfolio/list
) else (
    echo.
    echo ❌ Database setup failed. Please check your MySQL password and try again.
)

echo.
pause
