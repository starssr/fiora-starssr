@echo off
chcp 65001 >nul
echo Starting Fiora in development mode...
echo.

echo Starting MongoDB service...
net start MongoDB

echo.
echo Starting development server (without build)...
yarn dev:server

echo.
echo Application will be available at: http://localhost:9200
pause