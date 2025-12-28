// Coze API Configuration
// 配置已切换到使用本地 Token Server，不再直接连接 Coze API

export const COZE_CONFIG = {
  // Token Server 地址（本地开发）
  serverURL: 'http://localhost:3001',

  // Bot ID（与 server/auth.js 中的配置保持一致）
  botId: '7527930097362911232',

  // 用户 ID（可以为每个用户生成唯一 ID）
  userId: '123456789'
};

/**
 * 【配置说明】
 * 
 * 旧方式（已弃用）:
 *   前端 → 直接调用 Coze API（需要暴露 Token）
 * 
 * 新方式（当前）:
 *   前端 → 本地 Token Server → Coze API
 *   Token Server 自动管理 OAuth 鉴权
 * 
 * 【部署到服务器时】
 * 修改 serverURL 为服务器地址，例如:
 *   serverURL: 'https://your-domain.com'
 * 
 * 或使用环境变量:
 *   serverURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
 */
