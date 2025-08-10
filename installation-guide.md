# Fiora 安装指南

## 环境要求

- Node.js 14.x 或更高版本
- MongoDB 4.x 或更高版本
- Redis 5.x 或更高版本 (可选，用于提高性能)
- Git

## 方法一：源码安装

### 1. 克隆仓库

```bash
git clone https://github.com/yinxin630/fiora.git
cd fiora
```

### 2. 安装依赖

```bash
# 安装项目依赖
npm install

# 或使用 yarn
yarn
```

### 3. 配置环境变量

复制 `.env.example` 文件为 `.env`，并根据需要修改配置：

```bash
cp .env.example .env
```

主要配置项：
- `Database`: MongoDB 连接地址，默认为 `mongodb://localhost:27017/fiora`
- `JwtSecret`: JWT 密钥，建议修改为随机字符串
- `Administrator`: 管理员用户 ID，可在用户注册后通过命令获取
- `Port`: 服务器端口，默认为 9200

### 4. 启动开发环境

```bash
# 启动服务端
npm run dev:server

# 启动前端
npm run dev:web
```

### 5. 构建生产环境

```bash
# 构建前端
npm run build:web

# 启动服务
npm run start
```

## 方法二：Docker 安装

### 1. 使用 Docker Compose

创建 `docker-compose.yml` 文件：

```yaml
version: '3'
services:
  mongodb:
    image: mongo:4
    container_name: fiora-mongodb
    restart: always
    volumes:
      - ./data/db:/data/db
    networks:
      - fiora-network

  redis:
    image: redis:5
    container_name: fiora-redis
    restart: always
    networks:
      - fiora-network

  fiora:
    image: suisuijiang/fiora
    container_name: fiora
    restart: always
    ports:
      - 9200:9200
    environment:
      - Database=mongodb://mongodb:27017/fiora
      - RedisHost=redis
      - JwtSecret=your_jwt_secret
      - Administrator=your_administrator_id
    networks:
      - fiora-network
    depends_on:
      - mongodb
      - redis

networks:
  fiora-network:
```

### 2. 启动容器

```bash
docker-compose up -d
```

## 方法三：使用脚本快速部署

我们提供了一个简化的部署脚本，可以快速在服务器上部署 Fiora：

```bash
# 下载部署脚本
curl -O https://raw.githubusercontent.com/yinxin630/fiora/master/deploy.sh

# 赋予执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

## 注册管理员账号

1. 首先注册一个普通账号
2. 获取用户 ID：

```bash
# 使用脚本获取用户 ID
node get-user-id.js 用户名
```

3. 将获取到的用户 ID 添加到 `.env` 文件的 `Administrator` 配置项中
4. 重启服务

## 常见问题

1. **无法连接到数据库**
   - 检查 MongoDB 服务是否正常运行
   - 验证数据库连接字符串是否正确

2. **注册功能不可用**
   - 检查 `.env` 文件中的 `DisableRegister` 是否设置为 `false`

3. **上传文件失败**
   - 检查文件大小是否超过限制
   - 验证服务器存储权限是否正确

4. **消息推送不工作**
   - 检查浏览器通知权限设置
   - 验证服务器是否能够发送通知

5. **性能问题**
   - 考虑启用 Redis 缓存
   - 优化数据库索引
   - 增加服务器资源