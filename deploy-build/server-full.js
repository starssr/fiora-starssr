const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT || 9200;

// 内存存储（生产环境应使用数据库）
const users = new Map();
const groups = new Map();
const messages = new Map();

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API 路由
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
  }
  
  // 检查用户是否已存在
  for (let user of users.values()) {
    if (user.username === username) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }
  }
  
  const userId = uuidv4();
  const user = {
    _id: userId,
    username,
    password, // 实际应用中应该加密
    avatar: `/avatar/${Math.floor(Math.random() * 15)}.jpg`,
    createTime: new Date(),
    lastLoginTime: new Date()
  };
  
  users.set(userId, user);
  
  res.json({
    success: true,
    data: {
      _id: userId,
      username: user.username,
      avatar: user.avatar,
      token: userId // 简化的token
    }
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  let foundUser = null;
  for (let user of users.values()) {
    if (user.username === username && user.password === password) {
      foundUser = user;
      break;
    }
  }
  
  if (!foundUser) {
    return res.status(400).json({ success: false, message: '用户名或密码错误' });
  }
  
  foundUser.lastLoginTime = new Date();
  
  res.json({
    success: true,
    data: {
      _id: foundUser._id,
      username: foundUser.username,
      avatar: foundUser.avatar,
      token: foundUser._id
    }
  });
});

app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  res.json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      avatar: user.avatar
    }
  });
});

app.get('/api/groups', (req, res) => {
  // 创建默认群组
  if (groups.size === 0) {
    const defaultGroup = {
      _id: 'default',
      name: '默认群组',
      avatar: '/images/0.jpg',
      createTime: new Date(),
      creator: 'system',
      members: []
    };
    groups.set('default', defaultGroup);
  }
  
  res.json({
    success: true,
    data: Array.from(groups.values())
  });
});

// 获取用户ID的API
app.get('/api/getUserId/:username', (req, res) => {
  const { username } = req.params;
  
  let foundUser = null;
  for (let user of users.values()) {
    if (user.username === username) {
      foundUser = user;
      break;
    }
  }
  
  if (!foundUser) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  res.json({
    success: true,
    data: {
      userId: foundUser._id,
      username: foundUser.username
    }
  });
});

// SPA 路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Fiora server with API is running on http://0.0.0.0:${port}`);
  console.log('Available APIs:');
  console.log('- POST /api/register - 用户注册');
  console.log('- POST /api/login - 用户登录');
  console.log('- GET /api/user/:userId - 获取用户信息');
  console.log('- GET /api/getUserId/:username - 根据用户名获取用户ID');
  console.log('- GET /api/groups - 获取群组列表');
});