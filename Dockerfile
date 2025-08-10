FROM node:14-alpine

WORKDIR /app

# 复制package.json和lerna.json
COPY package.json lerna.json ./

# 复制所有packages目录
COPY packages ./packages/

# 复制环境变量示例文件
COPY .env.example ./.env

# 安装依赖
RUN npm install

# 构建前端
RUN npm run build:web

# 暴露端口
EXPOSE 9200

# 启动服务
CMD ["npm", "run", "start"]