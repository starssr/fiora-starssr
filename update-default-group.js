#!/usr/bin/env node

/**
 * 更新默认群组名称
 * 使用方法: node update-default-group.js "新群组名称"
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

// 定义群组模型
const GroupSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createTime: { type: Date, default: Date.now },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    isDefault: {
        type: Boolean,
        default: false,
    },
});

const Group = mongoose.model('Group', GroupSchema);

// 主函数
async function main() {
    const newGroupName = process.argv[2];
    
    if (!newGroupName) {
        console.error('错误: 请提供新的群组名称');
        console.log('使用方法: node update-default-group.js "新群组名称"');
        process.exit(1);
    }
    
    await connectDatabase();
    
    try {
        // 查找默认群组
        const defaultGroup = await Group.findOne({ isDefault: true });
        
        if (!defaultGroup) {
            console.error('错误: 未找到默认群组');
            process.exit(1);
        }
        
        // 更新群组名称
        const oldName = defaultGroup.name;
        defaultGroup.name = newGroupName;
        await defaultGroup.save();
        
        console.log('默认群组名称更新成功:');
        console.log(`旧名称: ${oldName}`);
        console.log(`新名称: ${newGroupName}`);
    } catch (err) {
        console.error('更新群组名称失败:', err.message);
    } finally {
        mongoose.disconnect();
    }
}

main();