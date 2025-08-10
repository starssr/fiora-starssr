#!/usr/bin/env node

/**
 * 注册新用户
 * 使用方法: node register-user.js 用户名 密码
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 连接数据库
async function connectDatabase() {
    const databaseUrl = process.env.Database || 'mongodb://localhost:27017/fiora';
    console.log(`正在连接数据库: ${databaseUrl}`);
    
    try {
        await mongoose.connect(databaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('数据库连接成功');
    } catch (err) {
        console.error('数据库连接失败:', err.message);
        process.exit(1);
    }
}

// 定义用户模型
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        index: true,
    },
    password: String,
    avatar: String,
    createTime: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// 生成随机头像
function getRandomAvatar() {
    const avatarColors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
        '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
        '#ff5722', '#795548', '#9e9e9e', '#607d8b'
    ];
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
}

// 主函数
async function main() {
    const username = process.argv[2];
    const password = process.argv[3];
    
    if (!username || !password) {
        console.error('错误: 请提供用户名和密码');
        console.log('使用方法: node register-user.js 用户名 密码');
        process.exit(1);
    }
    
    await connectDatabase();
    
    try {
        // 检查用户是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.error(`错误: 用户 "${username}" 已存在`);
            process.exit(1);
        }
        
        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        // 创建用户
        const user = await User.create({
            username,
            password: hash,
            avatar: getRandomAvatar()
        });
        
        console.log('用户注册成功:');
        console.log(`ID: ${user._id}`);
        console.log(`用户名: ${user.username}`);
        console.log(`创建时间: ${user.createTime}`);
        console.log('\n要将此用户设为管理员，请在 .env 文件中添加或修改:');
        console.log(`Administrator=${user._id}`);
    } catch (err) {
        console.error('用户注册失败:', err.message);
    } finally {
        mongoose.disconnect();
    }
}

main();