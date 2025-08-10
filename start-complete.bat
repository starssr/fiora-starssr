@echo off
chcp 65001 >nul
echo ========================================
echo          Fiora 聊天室启动脚本
echo ========================================
echo.

echo 检查并启动 MongoDB 服务...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB 服务已安装，正在启动...
    net start MongoDB >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ MongoDB 启动成功
    ) else (
        echo ✓ MongoDB 已在运行
    )
) else (
    echo ✗ MongoDB 服务未安装，请先安装 MongoDB
    echo   下载地址: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo.
echo 检查并启动 Redis 服务...
redis-server --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Redis 已安装
    echo 启动 Redis 服务器...
    start "Redis Server" redis-server
    timeout /t 3 >nul
) else (
    echo ✗ Redis 未安装
    echo   Windows 用户可以下载: https://github.com/microsoftarchive/redis/releases
    echo   或使用 WSL/Docker 运行 Redis
    pause
    exit /b 1
)

echo.
echo 安装项目依赖...
call yarn install

echo.
echo 启动开发服务器...
cd packages\server
call yarn dev:server

pause