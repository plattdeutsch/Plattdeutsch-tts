@echo off
REM Plattdeutsch TTS - Setup Script for Windows
REM This script sets up both backend and frontend

echo.
echo ============================================================
echo Plattdeutsch TTS - Complete Setup
echo ============================================================
echo.

REM Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.8+ first.
    exit /b 1
)

echo [1/4] Setting up backend...
cd backend
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    exit /b 1
)

cd ..

REM Check Node.js
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm not found. Please install Node.js 16+ first.
    exit /b 1
)

echo.
echo [2/4] Setting up frontend...
cd frontend
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    exit /b 1
)

cd ..

echo.
echo [3/4] Verifying model files...
if not exist "model\best_model.pth" (
    echo WARNING: model\best_model.pth not found
)
if not exist "model\config.json" (
    echo WARNING: model\config.json not found
)

echo.
echo ============================================================
echo Setup Complete!
echo ============================================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   .venv\Scripts\activate.bat
echo   python app.py
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open your browser to: http://127.0.0.1:3002
echo.
