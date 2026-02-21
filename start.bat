@echo off
title Lara Kaplan Nursing — Patient Management
echo.
echo  =========================================
echo   Lara Kaplan Private Nursing Care
echo   Patient Management System
echo  =========================================
echo.
echo  Starting server...
echo  Open your browser at: http://localhost:3000
echo.
cd /d "%~dp0"
npm run build 2>nul
if errorlevel 1 (
  echo  [!] Build failed. Trying dev mode instead...
  npm run dev
) else (
  npm run start
)
pause
