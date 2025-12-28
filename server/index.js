/**
 * index.js - Token Server 入口文件
 * 
 * 【功能概述】
 * 这是一个轻量级的 Express 服务器，作为前端与 Coze API 之间的桥梁
 * 
 * 【启动方式】
 * node server/index.js
 * 
 * 【端口】
 * 默认 3001，可通过环境变量 PORT 修改
 * 
 * 【API 端点】
 * - GET  /api/token/status  - 查看 Token 状态
 * - POST /api/chat          - 流式聊天（SSE）
 * - POST /api/chat/simple   - 非流式聊天
 * - GET  /health            - 健康检查
 */

import express from 'express';
import cors from 'cors';
import proxyRouter from './proxy.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ============ 中间件配置 ============

/**
 * CORS（跨源资源共享）配置
 * 
 * 允许前端（运行在 localhost:5173）访问本服务器（localhost:3001）
 * 如果不配置 CORS，浏览器会阻止跨域请求
 */
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],  // 允许的前端地址
    methods: ['GET', 'POST', 'OPTIONS'],                          // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'],            // 允许的请求头
    credentials: true                                             // 允许携带凭证（cookies）
}));

/**
 * JSON 请求体解析
 * 将 POST 请求的 JSON body 解析为 JavaScript 对象
 */
app.use(express.json());

/**
 * 请求日志中间件
 * 打印每个请求的方法、路径和时间
 */
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN');
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ============ 路由配置 ============

/**
 * 健康检查端点
 * 用于监控服务器是否正常运行
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        server: 'Coze OAuth Token Server',
        timestamp: new Date().toISOString()
    });
});

/**
 * API 路由
 * 所有 /api/* 的请求都由 proxyRouter 处理
 */
app.use('/api', proxyRouter);

/**
 * 404 处理
 * 未匹配到的路由返回 404
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `路径 ${req.path} 不存在`,
        availableEndpoints: [
            'GET  /health',
            'GET  /api/token/status',
            'POST /api/chat',
            'POST /api/chat/simple'
        ]
    });
});

/**
 * 全局错误处理
 * 捕获未处理的错误，返回友好的错误信息
 */
app.use((err, req, res, next) => {
    console.error('❌ 服务器错误:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// ============ 启动服务器 ============

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Coze OAuth Token Server 已启动');
    console.log('='.repeat(50));
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
    console.log(`📊 Token状态: http://localhost:${PORT}/api/token/status`);
    console.log(`💬 聊天接口: POST http://localhost:${PORT}/api/chat`);
    console.log('='.repeat(50) + '\n');
});
