# SAIF AI Club 官网 - Lytes 智能助理

> 深圳大学南特金融科技学院（SAIF）AI 社团官方网站，集成 Lytes 智能助理

## 项目概述

本项目是 SAIF AI Club 的官方网站，采用现代化的 React + Vite 技术栈，集成了基于 Coze API 的 AI 智能助理 **Lytes**（Lychee + Nantes 的组合，寓意荔枝与南特的融合）。

### 技术栈

- **前端**: React 18 + Vite + TailwindCSS + Framer Motion
- **后端**: Node.js + Express（OAuth Token Server）
- **AI**: Coze API（流式响应 SSE）
- **认证**: OAuth 2.0 JWT 认证

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境

确保以下文件存在：
- `env.md` - 包含 OAuth App ID、Public Key、Agent ID
- `private_key.pem` - RSA 私钥文件

### 3. 启动项目

```bash
npm start
```

这会同时启动：
- 前端开发服务器：http://localhost:5173
- Token Server：http://localhost:3001

## 项目结构

```
├── src/
│   ├── components/
│   │   ├── AIChat.jsx      # Lytes 聊天界面
│   │   ├── LytesLogo.jsx   # Lytes Logo 组件
│   │   ├── HeroSection.jsx # 首页英雄区
│   │   └── ...
│   ├── config/
│   │   └── coze.js         # API 配置
│   └── App.jsx             # 主应用
├── server/
│   ├── index.js            # Express 服务器入口
│   ├── auth.js             # JWT 认证模块
│   └── proxy.js            # API 代理路由
├── env.md                  # 环境变量（敏感，勿提交）
├── private_key.pem         # RSA 私钥（敏感，勿提交）
└── feedback.json           # 用户反馈存储
```

## Lytes 智能助理

### 功能特点

- 🎨 **现代 UI**: 仿 Gemini 风格的简洁界面
- ⚡ **流式响应**: SSE 实时展示 AI 回复
- 💬 **交互按钮**: 点赞/踩、重新回答、复制
- 🔮 **六边形 Logo**: 动态光效的数字晶体设计

### API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/chat` | POST | 流式聊天接口 |
| `/api/feedback` | POST | 用户反馈接口 |
| `/api/token/status` | GET | Token 状态查询 |
| `/health` | GET | 健康检查 |

## 开发指南

### 添加新组件

组件放在 `src/components/` 目录下，使用 Framer Motion 实现动画效果。

### 修改 AI 配置

编辑 `src/config/coze.js` 修改 Bot ID 或服务器地址。

### 部署注意事项

1. 生产环境需更新 `coze.js` 中的 `serverURL`
2. 确保 Token Server 可被前端访问
3. `env.md` 和 `private_key.pem` 不应提交到公开仓库

## 贡献者

- SAIF AI Club 技术团队

## 许可证

MIT License © 2025 SAIF AI Club
