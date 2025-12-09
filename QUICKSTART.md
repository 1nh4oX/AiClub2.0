# 🚀 快速启动指南

## ✅ 已完成的集成

您的 React 项目已经成功接入 Coze AI！

### 📦 安装的依赖

- ✅ React 18
- ✅ Vite 
- ✅ Tailwind CSS
- ✅ Framer Motion
- ✅ **@coze/api** (刚刚安装完成)

### 🎯 Coze 配置

配置文件：`src/config/coze.js`

```javascript
export const COZE_CONFIG = {
  token: 'cztei_hg4LwuOfildAJWejG0La830tIh909AAImfEkg66iFPjyDcYLr8O3w1RAtsUHw7f09',
  baseURL: 'https://api.coze.cn',
  botId: '7527930097362911232',
  userId: '123456789'
};
```

## 🏃 立即运行

开发服务器已在运行：

**访问地址：** http://localhost:5173/

### 测试 AI 聊天

1. 打开浏览器访问上述地址
2. 点击右下角的 **圆形蓝色按钮** 💬
3. 输入任何问题，比如：
   - "学院有哪些专业？"
   - "如何申请入学？"
   - "师资力量如何？"
4. 观察 AI 实时流式回复

## 📋 常用命令

```bash
# 如果服务器未运行，启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 重新安装所有依赖
npm install
```

## 🎨 项目结构

```
AiClub2.0/
├── src/
│   ├── components/
│   │   ├── AIChat.jsx          ⭐ AI 聊天组件（已接入 Coze）
│   │   ├── ParticleNetwork.jsx  # 粒子背景
│   │   ├── Navbar.jsx          # 导航栏
│   │   ├── Hero.jsx            # 首屏
│   │   ├── InfoSection.jsx     # 信息区块
│   │   └── Footer.jsx          # 页脚
│   ├── config/
│   │   └── coze.js             ⭐ Coze API 配置
│   ├── App.jsx                 # 主应用
│   ├── main.jsx                # 入口
│   └── index.css               # 全局样式
├── package.json                # 依赖配置
└── vite.config.js              # Vite 配置
```

## 🔥 核心功能

### 1. AI 智能助手 (AIChat.jsx)

**特性：**
- ✨ **实时流式响应** - AI 回复逐字显示
- 💬 **对话历史** - 自动保存聊天记录
- ⚡ **打字动画** - 智能"正在输入"效果
- 🛡️ **错误处理** - API 失败自动降级
- 🎨 **现代 UI** - 玻璃态设计，侧边栏交互

**代码亮点：**
```javascript
// 流式处理
for await (const chunk of stream) {
    if (chunk.event === 'conversation.message.delta') {
        fullResponse += chunk.data?.delta || '';
        // 实时更新 UI
    }
}
```

### 2. 粒子网络背景

基于 Canvas 的动态粒子连接动画，随滚动淡出。

### 3. 滚动动画

使用 Framer Motion 实现平滑过渡效果。

### 4. 响应式设计

完美适配移动端和桌面端。

## 🔧 自定义配置

### 修改 AI 欢迎语

编辑 `src/components/AIChat.jsx`：

```javascript
const [messages, setMessages] = useState([
    { type: 'bot', text: '你好！我是...' }  // ← 修改这里
]);
```

### 更换 Coze Bot

编辑 `src/config/coze.js`：

```javascript
export const COZE_CONFIG = {
  token: '你的新token',      // ← 修改
  botId: '你的新bot_id',     // ← 修改
  // ...
};
```

### 调整聊天按钮位置

编辑 `src/components/AIChat.jsx`：

```javascript
className="fixed bottom-10 right-10"  // ← 修改位置
```

## 🐛 故障排除

### 问题：AI 不回复

**解决方案：**
1. 检查浏览器控制台是否有错误
2. 确认 Coze Token 有效
3. 测试网络连接：`curl https://api.coze.cn`
4. 查看 `src/config/coze.js` 配置是否正确

### 问题：页面空白

**解决方案：**
1. 清空浏览器缓存
2. 重启开发服务器：
   ```bash
   # 按 Ctrl+C 停止
   npm run dev
   ```

### 问题：样式错误

**解决方案：**
```bash
# 重新构建 Tailwind
npm run build
```

## 📚 相关文档

- `README.md` - 项目完整文档
- `COZE_SETUP.md` - Coze 接入详细指南
- `package.json` - 依赖清单

## 🎉 下一步

### 推荐优化

1. **添加用户认证**
   ```javascript
   userId: generateUniqueUserId()  // 为每个用户生成唯一 ID
   ```

2. **保存聊天历史**
   ```javascript
   localStorage.setItem('chatHistory', JSON.stringify(messages));
   ```

3. **多轮对话优化**
   - 发送完整对话历史给 AI
   - 支持上下文理解

4. **添加语音输入**
   - 集成 Web Speech API
   - 支持语音转文字

5. **安全增强**
   - 使用环境变量管理 Token
   - 后端代理 API 请求

## 💡 提示

- 开发服务器支持热更新（HMR），修改代码会自动刷新
- AI 回复速度取决于 Coze API 响应时间
- 首次加载可能较慢，后续会很快

## 🎊 完成！

恭喜！您的 AI 驱动的学院网站已经准备就绪。

**立即体验：** http://localhost:5173/

---

**问题反馈：** 查看浏览器控制台或 Coze 官方文档



