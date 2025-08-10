#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Fiora CLI 工具
const FIORA_API_BASE = 'http://403a244748364c3fb4d9b62e8e953e7d.ap-singapore.myide.io/api';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function getUserId(username) {
  try {
    console.log(`正在查询用户: ${username}`);
    const url = `${FIORA_API_BASE}/getUserId/${encodeURIComponent(username)}`;
    console.log(`请求地址: ${url}`);
    
    const result = await makeRequest(url);
    
    if (result.success) {
      console.log('✅ 查询成功!');
      console.log(`用户名: ${result.data.username}`);
      console.log(`用户ID: ${result.data.userId}`);
    } else {
      console.log('❌ 查询失败:', result.message);
    }
  } catch (error) {
    console.log('❌ 请求错误:', error.message);
    console.log('💡 提示: 请确保 Fiora 服务正在运行');
  }
}

// 解析命令行参数
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Fiora CLI 工具');
  console.log('');
  console.log('用法:');
  console.log('  node fiora-cli.js getUserId <用户名>');
  console.log('');
  console.log('示例:');
  console.log('  node fiora-cli.js getUserId 云云星羽');
  process.exit(0);
}

const command = args[0];
const param = args[1];

switch (command) {
  case 'getUserId':
    if (!param) {
      console.log('❌ 错误: 请提供用户名');
      console.log('用法: node fiora-cli.js getUserId <用户名>');
      process.exit(1);
    }
    getUserId(param);
    break;
    
  default:
    console.log(`❌ 未知命令: ${command}`);
    console.log('支持的命令: getUserId');
    process.exit(1);
}