import initMongoDB from './packages/database/mongoose/initMongoDB';
import User from './packages/database/mongoose/models/user';

(async () => {
    try {
        await initMongoDB();
        
        const username = process.argv[2] || '云云星羽';
        console.log(`正在查询用户: ${username}`);
        
        const user = await User.findOne({ username: username });
        
        if (user) {
            console.log(`用户 "${username}" 的信息:`);
            console.log(`- 用户ID: ${user._id}`);
            console.log(`- 用户名: ${user.username}`);
            console.log(`- 头像: ${user.avatar}`);
            console.log(`- 标签: ${user.tag}`);
            console.log(`- 创建时间: ${user.createTime}`);
            console.log(`- 最后登录: ${user.lastLoginTime}`);
            console.log(`\n✅ 用户ID: ${user._id}`);
        } else {
            console.log(`未找到用户 "${username}"`);
            
            // 列出所有用户供参考
            const allUsers = await User.find({}, 'username _id').limit(10);
            console.log('\n现有用户列表（前10个）:');
            allUsers.forEach(u => {
                console.log(`- ${u.username} (ID: ${u._id})`);
            });
            
            console.log('\n❌ 未找到指定用户');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('查询用户失败:', error);
        process.exit(1);
    }
})();