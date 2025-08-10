#!/usr/bin/env node

const https = require('https');
const http = require('http');

const FIORA_API_BASE = 'http://403a244748364c3fb4d9b62e8e953e7d.ap-singapore.myide.io/api';

function makePostRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = url.startsWith('https') ? https : http;
    
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          resolve(result);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

async function registerUser(username, password) {
  try {
    console.log(`正在注册用户: ${username}`);
    const url = `${FIORA_API_BASE}/register`;
    
    const result = await makePostRequest(url, { username, password });
    
    if (result.success) {
      console.log('✅ 注册成功!');
      console.log(`用户名: ${result.data.username}`);
      console.log(`用户ID: ${result.data._id}`);
      console.log(`头像: ${result.data.avatar}`);
    } else {
      console.log('❌ 注册失败:', result.message);
    }
  } catch (error) {
    console.log('❌ 请求错误:', error.message);
  }
}

// 解析命令行参数
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('用户注册工具');
  console.log('');
  console.log('用法:');
  console.log('  node register-user.js <用户名> <密码>');
  console.log('');
  console.log('示例:');
  console.log('  node register-user.js 云云星羽 123456');
  process.exit(0);
}

const username = args[0];
const password = args[1];

registerUser(username, password);