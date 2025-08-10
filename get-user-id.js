#!/usr/bin/env node

/**
 * 获取指定用户名的用户ID
 * 使用方法: node get-user-id.js 用户名
 */

const mongoose = require('mongoose');
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

// 主函数
async function main() {
    const username = process.argv[2];
    
    if (!username) {
        console.error('错误: 请提供用户名');
        console.log('使用方法: node get-user-id.js 用户名');
        process.exit(1);
    }
    
    await connectDatabase();
    
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            console.error(`错误: 未找到用户 "${username}"`);
            process.exit(1);
        }
        
        console.log('用户信息:');
        console.log(`ID: ${user._id}`);
        console.log(`用户名: ${user.username}`);
        console.log(`创建时间: ${user.createTime}`);
        console.log('\n要将此用户设为管理员，请在 .env 文件中添加或修改:');
        console.log(`Administrator=${user._id}`);
    } catch (err) {
        console.error('查询用户失败:', err.message);
    } finally {
        mongoose.disconnect();
    }
}

main();