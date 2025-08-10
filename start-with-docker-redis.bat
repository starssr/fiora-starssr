@echo off
chcp 65001 >nul
echo ========================================
echo     Fiora 聊天室启动脚本 (Docker Redis)
echo ========================================
echo.

echo 启动 Redis 容器...
docker run -d --name fiora-redis -p 6379:6379 redis:alpine
if %errorlevel% equ 0 (
    echo ✓ Redis 容器启动成功
) else (
    echo Redis 容器可能已存在，尝试启动现有容器...
    docker start fiora-redis
)

echo.
echo 检查并启动 MongoDB 服务...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB 启动成功
) else (
    echo ✓ MongoDB 已在运行或需要手动启动
)

echo.
echo 等待服务启动...
timeout /t 5 >nul

echo.
echo 启动开发服务器...
cd packages\server
call yarn dev:server

pause