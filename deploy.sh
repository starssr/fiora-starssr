#!/bin/bash

# Fiora 快速部署脚本
# 此脚本会自动安装依赖、配置环境并启动 Fiora

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查必要的命令
check_dependencies() {
    info "检查依赖..."
    check_command "node"
    check_command "npm"
    check_command "git"
    
    # 检查 Node.js 版本
    NODE_VERSION=$(node -v | cut -d 'v' -f 2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d '.' -f 1)
    
    if [ $NODE_MAJOR -lt 14 ]; then
        error "Node.js 版本过低，需要 v14.0.0 或更高版本"
        exit 1
    fi
    
    success "依赖检查通过"
}

# 克隆仓库
clone_repository() {
    info "克隆 Fiora 仓库..."
    
    if [ -d "fiora" ]; then
        warn "fiora 目录已存在，跳过克隆"
    else
        git clone https://github.com/yinxin630/fiora.git
        if [ $? -ne 0 ]; then
            error "克隆仓库失败"
            exit 1
        fi
        success "仓库克隆成功"
    fi
    
    cd fiora
}

# 安装依赖
install_dependencies() {
    info "安装项目依赖..."
    npm install
    
    if [ $? -ne 0 ]; then
        error "依赖安装失败"
        exit 1
    fi
    
    success "依赖安装成功"
}

# 配置环境变量
configure_environment() {
    info "配置环境变量..."
    
    if [ -f ".env" ]; then
        warn ".env 文件已存在，跳过配置"
    else
        cp .env.example .env
        
        # 生成随机 JWT 密钥
        JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
        sed -i "s/JwtSecret=r5iUOW9RgWXVZQBg/JwtSecret=$JWT_SECRET/" .env
        
        success "环境变量配置完成"
    fi
}

# 构建前端
build_frontend() {
    info "构建前端..."
    npm run build:web
    
    if [ $? -ne 0 ]; then
        error "前端构建失败"
        exit 1
    fi
    
    success "前端构建成功"
}

# 启动服务
start_service() {
    info "启动 Fiora 服务..."
    
    # 检查是否安装了 PM2
    if command -v pm2 &> /dev/null; then
        pm2 start npm --name "fiora" -- run start
        success "Fiora 服务已通过 PM2 启动"
        info "可以通过以下命令查看日志："
        echo "  pm2 logs fiora"
    else
        warn "未检测到 PM2，将直接启动服务"
        npm run start &
        success "Fiora 服务已启动"
    fi
    
    PORT=$(grep "Port=" .env | cut -d '=' -f 2)
    PORT=${PORT:-9200}
    
    success "Fiora 已成功部署！"
    info "现在可以通过 http://$(hostname -I | awk '{print $1}'):$PORT 访问"
}

# 主函数
main() {
    echo "================================================"
    echo "              Fiora 快速部署脚本                "
    echo "================================================"
    
    check_dependencies
    clone_repository
    install_dependencies
    configure_environment
    build_frontend
    start_service
    
    echo "================================================"
    echo "              部署完成                          "
    echo "================================================"
}

# 执行主函数
main