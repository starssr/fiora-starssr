@echo off
chcp 65001 >nul
echo Starting Fiora Chat Application...
echo.

echo 1. Starting database services (MongoDB + Redis)
docker-compose up -d mongodb redis

echo.
echo 2. Waiting for database services to start...
timeout /t 10 /nobreak > nul

echo.
echo 3. Building and starting Fiora application
docker-compose up --build fiora

echo.
echo Application started, visit: http://localhost:9200
pause
