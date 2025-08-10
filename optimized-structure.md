# Fiora 优化后的项目结构

```
fiora/
├── packages/                      # 项目包
│   ├── server/                    # 服务端
│   │   ├── src/                   # 源代码
│   │   │   ├── middlewares/       # 中间件
│   │   │   ├── routes/            # API 路由
│   │   │   ├── socket/            # Socket.io 处理
│   │   │   ├── app.ts             # 应用入口
│   │   │   └── main.ts            # 主程序
│   │   └── public/                # 静态资源
│   ├── web/                       # Web 客户端
│   │   ├── src/                   # 源代码
│   │   │   ├── components/        # 通用组件
│   │   │   ├── hooks/             # React Hooks
│   │   │   ├── modules/           # 功能模块
│   │   │   ├── state/             # 状态管理
│   │   │   ├── styles/            # 样式文件
│   │   │   ├── types/             # TypeScript 类型
│   │   │   └── utils/             # 工具函数
│   │   └── build/                 # 构建配置
│   ├── database/                  # 数据库模块
│   │   └── mongoose/              # MongoDB 连接和模型
│   ├── config/                    # 配置模块
│   ├── utils/                     # 通用工具
│   └── assets/                    # 共享资源
├── scripts/                       # 脚本工具
│   ├── deploy.sh                  # 部署脚本
│   ├── get-user-id.js             # 获取用户ID
│   └── register-user.js           # 注册用户
├── docker/                        # Docker 配置
│   └── docker-compose.yml         # Docker Compose 配置
├── .env                           # 环境变量
├── .env.example                   # 环境变量示例
├── package.json                   # 项目配置
├── README.md                      # 项目说明
├── installation-guide.md          # 安装指南
└── feature-modifications.md       # 功能修改文档
```

## 优化后的核心文件

### 服务端核心文件

1. **app.ts**
   - 精简的 Koa 应用配置
   - 优化的中间件加载
   - 更清晰的路由结构

2. **socket/index.ts**
   - 重构的 Socket.io 连接管理
   - 优化的事件处理
   - 实现连接池管理

3. **routes/index.ts**
   - 模块化的 API 路由
   - 统一的响应格式
   - 完善的错误处理

4. **middlewares/auth.ts**
   - 优化的身份验证
   - 基于角色的权限控制
   - JWT 令牌管理

### Web 客户端核心文件

1. **modules/Chat/index.tsx**
   - 重构的聊天界面
   - 优化的消息渲染
   - 实现虚拟滚动

2. **state/reducer.ts**
   - 优化的 Redux 状态管理
   - 减少不必要的状态更新
   - 实现状态持久化

3. **utils/socket.ts**
   - 优化的 Socket.io 客户端
   - 实现自动重连
   - 消息队列管理

4. **components/Message/index.tsx**
   - 统一的消息组件
   - 支持多种消息类型
   - 优化的渲染性能

### 数据库模型

1. **mongoose/models/user.ts**
   - 优化的用户模型
   - 实现密码加密
   - 添加必要的索引

2. **mongoose/models/message.ts**
   - 优化的消息模型
   - 实现消息分页
   - 支持消息搜索

3. **mongoose/models/group.ts**
   - 优化的群组模型
   - 实现成员管理
   - 支持群组设置