# 深圳大学南特金融科技学院官网 (SAIF)

这是一个使用 React + Vite + Tailwind CSS + Framer Motion + Coze AI 构建的现代化学院官网。

## 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库
- **Coze AI** - 智能聊天助手

## 项目结构

```
├── index.html              # HTML 入口文件
├── package.json            # 项目依赖配置
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
├── .env.example            # 环境变量示例
└── src/
    ├── main.jsx            # React 应用入口
    ├── App.jsx             # 主应用组件
    ├── index.css           # 全局样式
    ├── config/
    │   └── coze.js         # Coze AI 配置
    └── components/         # 组件目录
        ├── ParticleNetwork.jsx  # 粒子背景动画
        ├── Navbar.jsx           # 导航栏
        ├── Hero.jsx             # 首屏 Banner
        ├── InfoSection.jsx      # 信息展示区块
        ├── AIChat.jsx           # AI 聊天助手 (接入 Coze)
        └── Footer.jsx           # 页脚
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Coze AI（可选）

如果您想使用环境变量管理 Coze 配置（推荐用于生产环境）：

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，填入您的 Coze API 配置
# VITE_COZE_TOKEN=你的token
# VITE_COZE_BOT_ID=你的bot_id
```

**注意：** 当前配置已在 `src/config/coze.js` 中硬编码，可直接使用。如需更安全的管理方式，请使用环境变量。

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 5. 预览生产版本

```bash
npm run preview
```

## 主要功能

1. **粒子网络背景** - 基于 Canvas 的动态粒子连接动画
2. **滚动动画** - 使用 Framer Motion 实现的平滑滚动动画效果
3. **玻璃态设计** - 现代化的 Glassmorphism 设计风格
4. **AI 智能助手** - 接入 Coze AI，支持流式对话响应
5. **响应式布局** - 完美适配各种屏幕尺寸

## AI 聊天助手特性

- ✨ **流式响应** - 实时显示 AI 回复，体验更流畅
- 🤖 **Coze 驱动** - 使用 Coze AI 大模型，回答更智能
- 💬 **对话历史** - 保存聊天记录，上下文连贯
- 🎯 **智能提示** - 输入时显示"正在输入"状态
- 🔄 **错误处理** - API 失败时自动切换备用回复

## Coze AI 配置说明

AI 聊天助手使用 Coze AI 提供智能对话能力。配置位于 `src/config/coze.js`：

```javascript
export const COZE_CONFIG = {
  token: 'your_coze_token',        // Coze API Token
  baseURL: 'https://api.coze.cn',  // API 地址
  botId: 'your_bot_id',            // Bot ID
  userId: '123456789'              // 用户 ID
};
```

**获取 Coze API 配置：**
1. 访问 [Coze 官网](https://www.coze.cn/)
2. 创建或选择一个 Bot
3. 在开发者设置中获取 Token 和 Bot ID
4. 更新 `src/config/coze.js` 中的配置

## 组件说明

- **ParticleNetwork**: 动态粒子背景，会随滚动逐渐淡出
- **Navbar**: 固定顶部导航栏，带玻璃态效果
- **Hero**: 首屏大标题区域，包含渐变文字和滚动指示器
- **InfoSection**: 可复用的信息展示区块，支持左右布局切换
- **AIChat**: 接入 Coze AI 的智能聊天助手，支持流式响应
- **Footer**: 页脚信息

## 开发说明

- 本项目完全保留了原 HTML 版本的结构和样式
- 使用 Vite 进行快速开发和热更新
- 所有组件都采用函数式组件和 React Hooks
- 动画效果使用 Framer Motion 实现，性能优异
- AI 对话使用 Coze SDK，支持流式响应

## 安全提示

⚠️ **重要：** 
- 不要将包含真实 API Token 的配置文件提交到公开仓库
- 生产环境建议使用环境变量管理敏感信息
- 可以使用 `.env` 文件存储配置，该文件已添加到 `.gitignore`

## 注意事项

- 确保 Node.js 版本 >= 16
- 首次运行需要安装依赖，可能需要几分钟时间
- 开发环境下会看到 React StrictMode 的提示，这是正常的
- AI 聊天功能需要有效的 Coze API 配置才能正常工作

## 故障排除

### AI 聊天无响应
- 检查 `src/config/coze.js` 中的 Token 和 Bot ID 是否正确
- 确认网络连接正常，能访问 Coze API
- 查看浏览器控制台是否有错误信息

### 依赖安装失败
- 尝试清理缓存：`npm cache clean --force`
- 删除 `node_modules` 和 `package-lock.json`，重新运行 `npm install`

## License

© 2025 SAIF. All Rights Reserved.
