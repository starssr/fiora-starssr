@echo off
chcp 65001 >nul
echo ========================================
echo        Fiora 聊天室简化启动脚本
echo ========================================
echo.

echo 检查并启动 MongoDB 服务...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB 启动成功
) else (
    echo ✓ MongoDB 已在运行
)

echo.
echo 设置环境变量...
set NODE_ENV=development
set DOTENV_CONFIG_PATH=../../.env

echo.
echo 启动服务器 (无 Redis 版本)...
cd packages\server
npx ts-node -r dotenv/config --transpile-only src/main.ts

pause