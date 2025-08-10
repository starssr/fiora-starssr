# Fiora 聊天应用

Fiora是一个有趣的开源聊天应用。它基于[Node.js](https://nodejs.org/)、[React](https://reactjs.org/)和[Socket.io](https://socket.io/)技术开发。

## 特点

- **丰富性:** Fiora包含后端、前端、Android和iOS应用
- **跨平台:** Fiora使用Node.js开发，支持Windows/Linux/macOS系统
- **开源:** Fiora遵循MIT开源许可证

## 快速开始

### 环境要求

- Node.js 14.x 或更高版本
- MongoDB 4.x 或更高版本
- Redis 5.x 或更高版本 (可选，用于提高性能)

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/fiora.git
cd fiora
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

```bash
cp .env.example .env
```

然后编辑`.env`文件，根据需要修改配置。

4. **构建前端**

```bash
npm run build:web
```

5. **启动服务**

```bash
npm run start
```

### 使用Docker部署

1. **使用Docker Compose**

```bash
docker-compose up -d
```

## 管理员设置

1. 注册一个普通账号
2. 获取用户ID:

```bash
node get-user-id.js 用户名
```

3. 将获取到的用户ID添加到`.env`文件的`Administrator`配置项中
4. 重启服务

## 文档

- [安装指南](installation-guide.md)
- [功能修改文档](feature-modifications.md)
- [优化方案](optimization-plan.md)
- [项目结构](optimized-structure.md)

## 脚本工具

- `get-user-id.js`: 获取用户ID
- `register-user.js`: 注册新用户
- `deploy.sh`: 快速部署脚本

## 贡献

欢迎提交Pull Request。对于重大更改，请先开Issue讨论您想要更改的内容。请确保适当更新测试。

## 许可证

Fiora遵循[MIT许可证](./LICENSE)