@echo off
chcp 65001 >nul
echo Starting Fiora locally...
echo.

echo Checking if yarn install is complete...
if not exist "node_modules" (
    echo Installing dependencies...
    yarn install
)

echo.
echo Starting MongoDB service...
net start MongoDB

echo.
echo Starting development server...
yarn dev:server

echo.
echo Application will be available at: http://localhost:9200
pause