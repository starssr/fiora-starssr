@echo off
chcp 65001 >nul
echo 修复 Node.js 兼容性问题并构建前端...
echo.

set NODE_OPTIONS=--openssl-legacy-provider
cd packages\web
echo 开始构建前端页面...
call yarn build:web

echo.
echo 构建完成！
pause