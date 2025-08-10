const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 9200;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 所有路由都返回 index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Fiora server is running on http://0.0.0.0:${port}`);
});