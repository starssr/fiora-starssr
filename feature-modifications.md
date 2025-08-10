# Fiora 功能修改文档

## 用户系统

### 用户注册

默认情况下，Fiora 允许任何人注册账号。如果需要禁用注册功能，可以在 `.env` 文件中设置：

```
DisableRegister=true
```

禁用注册后，可以通过管理员命令创建新用户：

```bash
node register-user.js 用户名 密码
```

### 用户认证

Fiora 使用 JWT 进行用户认证，token 默认有效期为 30 天。可以通过修改 `.env` 文件中的 `tokenExpiresTime` 来调整有效期：

```
tokenExpiresTime=7d  # 7天
```

### 用户权限

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

## 消息系统

### 消息类型

Fiora 支持以下消息类型：
- 文本消息
- 图片消息
- 代码消息
- 文件消息
- 表情消息
- 命令消息

可以通过修改 `packages/server/src/routes/message.ts` 来添加新的消息类型。

### 消息存储

默认情况下，消息存储在 MongoDB 中。可以配置消息保存天数：

```
messageSaveDays=30  # 保存30天消息
```

设置为 0 表示永久保存。

### 文件上传

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

## 群组系统

### 创建群组

默认情况下，用户可以创建群组。如果需要禁用群组创建功能，可以在 `.env` 文件中设置：

```
DisableCreateGroup=true
```

### 默认群组

Fiora 会自动创建一个默认群组。可以通过以下命令修改默认群组名称：

```bash
node fiora-cli.js updateDefaultGroupName "新群组名称"
```

## 通知系统

### 桌面通知

Fiora 支持桌面通知功能，用户可以在设置中开启或关闭。

### 声音通知

用户可以选择不同的通知声音，或者上传自定义声音。

## 主题系统

### 默认主题

可以在 `.env` 文件中设置默认主题：

```
DefaultTheme=cool  # 可选值: default, cool, green, blue, 等
```

### 自定义主题

用户可以自定义主题颜色和背景图片。

## 性能优化

### Redis 缓存

启用 Redis 可以提高性能：

```
RedisHost=localhost
RedisPort=6379
```

### 连接限制

可以限制同时在线的用户数量：

```
DisableLimitOnlineUser=false
OnlineUserLimit=100
```

## API 限流

Fiora 实现了 API 请求频率限制，可以在 `packages/server/src/middlewares/frequency.ts` 中进行配置。

默认配置为：
- 注册: 1次/分钟
- 登录: 5次/分钟
- 发送消息: 20次/分钟
- 其他操作: 30次/分钟

## 移动应用

Fiora 提供了基于 React Native 的移动应用。

构建 Android 应用：

```bash
npm run build:android
```

构建 iOS 应用：

```bash
npm run build:ios
```

## 国际化

Fiora 支持多语言，语言文件位于 `packages/i18n` 目录。

目前支持的语言：
- 简体中文
- 英文
- 繁体中文
- 日文
- 德文

添加新语言需要创建对应的语言文件并在 `packages/i18n/languages` 目录中注册。