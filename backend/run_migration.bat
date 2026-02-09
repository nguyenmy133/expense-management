@echo off
REM =====================================================
REM Quick Fix Script for Google OAuth Database Migration
REM =====================================================

echo.
echo ========================================
echo Google OAuth Database Migration
echo ========================================
echo.
echo This script will update the database schema to support Google OAuth login.
echo.
echo Changes:
echo   1. Make password column NULLABLE
echo   2. Add auth_provider column
echo   3. Add google_id column
echo   4. Add performance indexes
echo.
echo ========================================
echo.

set /p confirm="Do you want to continue? (Y/N): "
if /i not "%confirm%"=="Y" (
    echo Migration cancelled.
    pause
    exit /b
)

echo.
echo Running migration...
echo.

REM Update these credentials if needed
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=expense_management
set DB_USER=root
set DB_PASS=123456

REM Run the SQL file
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASS% %DB_NAME% < QUICK_FIX_GOOGLE_OAUTH.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration completed successfully!
    echo ========================================
    echo.
    echo You can now restart your backend server.
    echo.
) else (
    echo.
    echo ========================================
    echo Migration failed!
    echo ========================================
    echo.
    echo Please check:
    echo   1. MySQL is running
    echo   2. Database credentials are correct
    echo   3. Database 'expense_management' exists
    echo.
)

pause
