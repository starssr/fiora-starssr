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
git clone https://github.com/yinxin630/fiora.git
cd fiora
```

2. **安装依赖**

```bash
yarn
```

3。 **构建前端**

```bash
yarn build:web
```

4。 **配置环境变量**

编辑`.env`文件，根据需要修改配置。


5. **启动服务**

```bash
yarn start
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

注意：虽然项目使用 yarn 作为包管理器，但部分脚本工具可能使用 node 直接执行。

## 文档

- [Fiora 综合指南](fiora-综合指南.md) - 包含安装指南、功能修改、项目结构等完整文档

## 脚本工具

- `get-user-id.js`: 获取用户ID
- `register-user.js`: 注册新用户
- `deploy.sh`: 快速部署脚本

## 贡献

欢迎提交Pull Request。对于重大更改，请先开Issue讨论您想要更改的内容。请确保适当更新测试。

## 许可证

Fiora遵循[MIT许可证](./LICENSE)
