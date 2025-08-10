# Fiora 聊天应用综合指南

## 目录

1. [环境要求](#环境要求)
2. [安装方法](#安装方法)
   - [源码安装](#方法一源码安装推荐)
   - [Docker 安装](#方法二docker-安装)
   - [脚本快速部署](#方法三使用脚本快速部署)
3. [运行指南](#运行指南)
4. [管理员设置](#管理员设置)
5. [功能修改](#功能修改)
   - [用户系统](#用户系统)
   - [消息系统](#消息系统)
   - [群组系统](#群组系统)
   - [通知系统](#通知系统)
   - [主题系统](#主题系统)
   - [性能优化](#性能优化)
   - [API 限流](#api-限流)
   - [移动应用](#移动应用)
   - [国际化](#国际化)
6. [项目结构](#项目结构)
7. [故障排除](#故障排除)

## 环境要求

- Node.js 14.x 或更高版本
- MongoDB 4.x 或更高版本
- Redis 5.x 或更高版本 (可选，用于提高性能)
- Git

## 安装方法

### 方法一：源码安装（推荐）

#### 1. 克隆仓库

```bash
git clone https://github.com/yinxin630/fiora.git
cd fiora
```

#### 2. 安装依赖

```bash
# 使用 yarn 安装依赖
yarn
```

#### 3. 配置环境变量

复制 `.env.example` 文件为 `.env`，并根据需要修改配置：

```bash
cp .env.example .env
```

主要配置项：
- `Database`: MongoDB 连接地址，默认为 `mongodb://localhost:27017/fiora`
- `JwtSecret`: JWT 密钥，建议修改为随机字符串
- `Administrator`: 管理员用户 ID，可在用户注册后通过命令获取
- `Port`: 服务器端口，默认为 9200

#### 4. 启动开发环境

```bash
# 启动服务端
yarn dev:server

# 启动前端（在另一个终端中）
yarn dev:web
```

#### 5. 构建生产环境

```bash
# 构建前端
yarn build:web

# 启动服务
yarn start
```

### 方法二：Docker 安装

#### 使用 Docker Compose

创建或使用项目中的 `docker-compose.yml` 文件：

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

启动容器：

```bash
docker-compose up -d
```

### 方法三：使用脚本快速部署

我们提供了一个简化的部署脚本，可以快速在 Linux 服务器上部署 Fiora：

```bash
# 下载部署脚本
curl -O https://raw.githubusercontent.com/yinxin630/fiora/master/deploy.sh

# 赋予执行权限
chmod +x deploy.sh

# 执行部署
./deploy.sh
```

或者使用项目中的 `server-deploy.sh` 脚本进行部署。

## 运行指南

### 开发环境

```bash
# 启动服务端
yarn dev:server

# 启动前端（在另一个终端中）
yarn dev:web
```

### 生产环境

```bash
# 构建前端
yarn build:web

# 启动服务
yarn start
```

### 使用 PM2 管理进程

```bash
# 安装 PM2
yarn global add pm2

# 使用 PM2 启动服务
pm2 start ecosystem.config.js
```

### 访问地址

- 应用地址: http://localhost:9200

## 管理员设置

### 注册管理员账号

1. 首先注册一个普通账号
2. 获取用户 ID：

```bash
# 使用脚本获取用户 ID
node get-user-id.js 用户名
```

3. 将获取到的用户 ID 添加到 `.env` 文件的 `Administrator` 配置项中
4. 重启服务

### 创建用户（禁用注册时）

如果禁用了注册功能（在 `.env` 中设置 `DisableRegister=true`），可以通过管理员命令创建新用户：

```bash
node register-user.js 用户名 密码
```

## 功能修改

### 用户系统

#### 用户注册

默认情况下，Fiora 允许任何人注册账号。如果需要禁用注册功能，可以在 `.env` 文件中设置：

```
DisableRegister=true
```

#### 用户认证

Fiora 使用 JWT 进行用户认证，token 默认有效期为 30 天。可以通过修改 `.env` 文件中的 `tokenExpiresTime` 来调整有效期：

```
tokenExpiresTime=7d  # 7天
```

#### 用户权限

Fiora 有两种用户角色：普通用户和管理员。

管理员可以：
- 封禁/解封用户
- 删除任何消息
- 获取所有用户信息
- 发送全局通知

要设置管理员，在 `.env` 文件中添加用户 ID：

```
Administrator=userId1,userId2
```

### 消息系统

#### 消息类型

Fiora 支持以下消息类型：
- 文本消息
- 图片消息
- 代码消息
- 文件消息
- 表情消息
- 命令消息

可以通过修改 `packages/server/src/routes/message.ts` 来添加新的消息类型。

#### 消息存储

默认情况下，消息存储在 MongoDB 中。可以配置消息保存天数：

```
messageSaveDays=30  # 保存30天消息
```

设置为 0 表示永久保存。

#### 文件上传

Fiora 支持本地存储和阿里云 OSS 两种文件存储方式。

启用阿里云 OSS：

```
ALIYUN_OSS=true
ACCESS_KEY_ID=your_key_id
ACCESS_KEY_SECRET=your_key_secret
ROLE_ARN=your_role_arn
REGION=oss-cn-hangzhou
BUCKET=your_bucket_name
ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
```

### 群组系统

#### 创建群组

默认情况下，用户可以创建群组。如果需要禁用群组创建功能，可以在 `.env` 文件中设置：

```
DisableCreateGroup=true
```

#### 默认群组

Fiora 会自动创建一个默认群组。默认群组名称在 `packages/server/src/main.ts` 文件中设置，初始值为 "fiora"。

有两种方式修改默认群组名称：

1. **使用脚本修改已创建的默认群组名称**：
   ```bash
   node update-default-group.js "新群组名称"
   ```

2. **修改源代码中的默认值**：
   - 打开 `packages/server/src/main.ts` 文件
   - 找到创建默认群组的代码（约在第18行）
   - 修改 `name: 'fiora'` 为 `name: '你想要的群组名'`
   - 重启服务器使更改生效

### 通知系统

#### 桌面通知

Fiora 支持桌面通知功能，用户可以在设置中开启或关闭。

#### 声音通知

用户可以选择不同的通知声音，或者上传自定义声音。

### 主题系统

#### 默认主题

可以在 `.env` 文件中设置默认主题：

```
DefaultTheme=cool  # 可选值: default, cool, green, blue, 等
```

#### 自定义主题

用户可以自定义主题颜色和背景图片。

### 性能优化

#### Redis 缓存

启用 Redis 可以提高性能：

```
RedisHost=localhost
RedisPort=6379
```

#### 连接限制

可以限制同时在线的用户数量：

```
DisableLimitOnlineUser=false
OnlineUserLimit=100
```

### API 限流

Fiora 实现了 API 请求频率限制，可以在 `packages/server/src/middlewares/frequency.ts` 中进行配置。

默认配置为：
- 注册: 1次/分钟
- 登录: 5次/分钟
- 发送消息: 20次/分钟
- 其他操作: 30次/分钟

### 移动应用

Fiora 提供了基于 React Native 的移动应用。

构建 Android 应用：

```bash
yarn build:android
```

构建 iOS 应用：

```bash
yarn build:ios
```

### 国际化

Fiora 支持多语言，语言文件位于 `packages/i18n` 目录。

目前支持的语言：
- 简体中文
- 英文
- 繁体中文
- 日文
- 德文

添加新语言需要创建对应的语言文件并在 `packages/i18n/languages` 目录中注册。

## 项目结构

Fiora 使用 Lerna 管理多包项目结构：

- `packages/app`: React Native 移动应用
- `packages/server`: 后端服务器
- `packages/web`: 前端网页应用
- `packages/utils`: 通用工具函数
- `packages/database`: 数据库模型和操作
- `packages/config`: 共享配置
- `packages/i18n`: 国际化支持

## 故障排除

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

6. **端口被占用**
   - 检查其他应用是否使用了9200端口
   - 在 `.env` 文件中修改 `Port` 配置项