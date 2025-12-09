# Coze AI 接入指南

## 当前配置

项目已完成 Coze AI 的集成，配置文件位于 `src/config/coze.js`。

### 配置内容

```javascript
export const COZE_CONFIG = {
  token: 'cztei_hg4LwuOfildAJWejG0La830tIh909AAImfEkg66iFPjyDcYLr8O3w1RAtsUHw7f09',
  baseURL: 'https://api.coze.cn',
  botId: '7527930097362911232',
  userId: '123456789'
};
```

## 功能特性

### ✅ 已实现功能

1. **流式对话** - 使用 `apiClient.chat.stream()` 实现实时响应
2. **实时显示** - AI 回复逐字显示，用户体验流畅
3. **打字状态** - 显示"正在输入"动画
4. **错误处理** - API 失败时自动降级到备用回复
5. **消息历史** - 保存对话记录

### 🎯 AI 聊天流程

```
用户输入 → 发送到 Coze API → 接收流式响应 → 实时更新界面
```

### 📝 代码结构

```javascript
// 1. 初始化客户端
const apiClient = new CozeAPI({
    token: COZE_CONFIG.token,
    baseURL: COZE_CONFIG.baseURL
});

// 2. 发送消息
const stream = await apiClient.chat.stream({
    bot_id: COZE_CONFIG.botId,
    user_id: COZE_CONFIG.userId,
    additional_messages: [{
        content: userMsg,
        content_type: 'text',
        role: 'user',
        type: 'question'
    }]
});

// 3. 处理流式响应
for await (const chunk of stream) {
    if (chunk.event === 'conversation.message.delta') {
        // 更新消息内容
    }
}
```

## 使用说明

### 1. 安装依赖

```bash
npm install
```

这将自动安装 `@coze/api` SDK。

### 2. 启动项目

```bash
npm run dev
```

### 3. 测试 AI 聊天

1. 打开浏览器访问 `http://localhost:5173`
2. 点击右下角的圆形聊天按钮
3. 输入问题，AI 将实时回复

## 自定义配置

### 修改 Bot ID 或 Token

编辑 `src/config/coze.js` 文件：

```javascript
export const COZE_CONFIG = {
  token: '你的新token',
  baseURL: 'https://api.coze.cn',
  botId: '你的新bot_id',
  userId: '自定义用户ID'
};
```

### 使用环境变量（推荐）

1. 创建 `.env` 文件：

```env
VITE_COZE_TOKEN=你的token
VITE_COZE_BOT_ID=你的bot_id
```

2. 修改 `src/config/coze.js`：

```javascript
export const COZE_CONFIG = {
  token: import.meta.env.VITE_COZE_TOKEN || '默认token',
  baseURL: import.meta.env.VITE_COZE_BASE_URL || 'https://api.coze.cn',
  botId: import.meta.env.VITE_COZE_BOT_ID || '默认bot_id',
  userId: import.meta.env.VITE_COZE_USER_ID || '123456789'
};
```

## API 响应事件

### 主要事件类型

- `conversation.message.delta` - 消息增量更新
- `conversation.message.completed` - 消息完成
- `conversation.chat.completed` - 对话完成
- `conversation.chat.failed` - 对话失败

### 示例响应结构

```javascript
{
  event: 'conversation.message.delta',
  data: {
    delta: '这是',  // 增量文本
    ...
  }
}
```

## 界面优化

### 打字动画

```jsx
{isTyping && (
    <div className="flex gap-1">
        <span className="animate-bounce">•</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
    </div>
)}
```

### 流式更新逻辑

```javascript
let fullResponse = '';
for await (const chunk of stream) {
    fullResponse += chunk.data?.delta || '';
    // 实时更新界面
    setMessages(prev => {
        const newMessages = [...prev];
        newMessages[lastIndex].text = fullResponse;
        return newMessages;
    });
}
```

## 常见问题

### Q: AI 不回复？
**A:** 检查：
- Token 是否有效
- Bot ID 是否正确
- 网络是否能访问 api.coze.cn
- 浏览器控制台是否有错误

### Q: 回复很慢？
**A:** 
- 这是正常的，AI 生成需要时间
- 流式响应会逐步显示，不需等待全部完成

### Q: 如何查看详细日志？
**A:** 
```javascript
console.log('Chunk:', chunk);  // 在循环中添加日志
```

### Q: 如何修改欢迎语？
**A:** 
编辑 `AIChat.jsx` 的初始消息：
```javascript
const [messages, setMessages] = useState([
    { type: 'bot', text: '你的自定义欢迎语' }
]);
```

## 安全建议

⚠️ **重要安全提示**

1. **不要提交敏感信息**
   - Token 应存储在环境变量或服务器端
   - 不要将真实 Token 提交到 Git

2. **使用服务器代理（生产环境推荐）**
   ```
   前端 → 你的后端 API → Coze API
   ```

3. **限流控制**
   - 添加请求频率限制
   - 防止恶意用户滥用

4. **用户身份验证**
   - 为每个真实用户生成唯一的 user_id
   - 便于追踪和管理对话

## 扩展功能

### 添加对话历史持久化

```javascript
// 使用 localStorage 保存对话
localStorage.setItem('chat_history', JSON.stringify(messages));

// 加载时恢复
const savedMessages = JSON.parse(localStorage.getItem('chat_history') || '[]');
```

### 添加多轮对话上下文

```javascript
// 将整个对话历史发送给 AI
const allMessages = messages.map(msg => ({
    content: msg.text,
    content_type: 'text',
    role: msg.type === 'user' ? 'user' : 'assistant',
    type: msg.type === 'user' ? 'question' : 'answer'
}));
```

### 添加文件上传功能

参考 Coze API 文档，支持图片、文档等多模态输入。

## 参考资源

- [Coze 官方文档](https://www.coze.cn/docs)
- [Coze JS SDK GitHub](https://github.com/coze-dev/coze-js)
- [Coze API 参考](https://www.coze.cn/docs/developer_guides/api_reference)

## 技术支持

如遇到问题，可以：
1. 查看浏览器控制台错误信息
2. 参考 Coze 官方文档
3. 检查网络请求状态
4. 验证 API 配置是否正确



