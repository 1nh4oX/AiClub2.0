/**
 * auth.js - Coze OAuth JWT 鉴权模块
 * 
 * 【工作原理】
 * 1. 使用 RSA 私钥生成 JWT（JSON Web Token）
 * 2. 将 JWT 发送到 Coze OAuth 服务器换取 Access Token
 * 3. 缓存 Token 直到过期前5分钟，自动刷新
 * 
 * JWT 结构:
 * - Header: { alg: "RS256", typ: "JWT" }
 * - Payload: { iss: 应用ID, iat: 签发时间, exp: 过期时间, jti: 唯一ID, aud: "api.coze.cn" }
 * - Signature: 使用私钥对 header.payload 进行 RSA-SHA256 签名
 */

import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ 配置区域 ============
// 这些值来自你的 env.md 文件
const CONFIG = {
    // OAuth 应用 ID
    appId: '1138125611088',

    // 公钥 ID（用于 JWT header 的 kid 字段）
    publicKey: 'XPwrX5pDMYhf2odJ1TV6JFvFyLLBblud9xOwk7n5DMY',

    // 私钥文件路径（相对于项目根目录）
    privateKeyPath: path.join(__dirname, '..', 'private_key.pem'),

    // Coze API 基础地址
    baseURL: 'https://api.coze.cn',

    // Token 有效期（秒），最长 24 小时 = 86400 秒
    tokenDuration: 86400,

    // Bot ID（工作流/Agent ID）
    botId: '7527930097362911232'
};

// ============ Token 缓存 ============
// 缓存当前有效的 Token，避免重复请求
let tokenCache = {
    accessToken: null,      // Access Token 字符串
    expiresAt: null,        // 过期时间戳（毫秒）
    refreshBuffer: 5 * 60 * 1000  // 提前5分钟刷新
};

/**
 * 读取 RSA 私钥
 * 私钥用于签名 JWT，证明请求来自合法的 OAuth 应用
 */
function getPrivateKey() {
    try {
        const keyPath = CONFIG.privateKeyPath;
        console.log(`📁 读取私钥: ${keyPath}`);
        const privateKey = fs.readFileSync(keyPath, 'utf8');
        return privateKey;
    } catch (error) {
        console.error('❌ 读取私钥失败:', error.message);
        throw new Error(`无法读取私钥文件: ${CONFIG.privateKeyPath}`);
    }
}

/**
 * 生成 JWT (JSON Web Token)
 * 
 * JWT 是一种紧凑的、URL安全的方式，用于在各方之间传递声明
 * 格式: xxxxx.yyyyy.zzzzz (header.payload.signature)
 * 
 * @returns {string} 签名后的 JWT 字符串
 */
function generateJWT() {
    const privateKey = getPrivateKey();
    const now = Math.floor(Date.now() / 1000);  // 当前时间（秒）

    // JWT Payload（载荷）
    const payload = {
        iss: CONFIG.appId,           // Issuer: 签发者（OAuth 应用 ID）
        iat: now,                    // Issued At: 签发时间
        exp: now + 3600,             // Expiration: 过期时间（JWT本身1小时有效）
        jti: uuidv4(),               // JWT ID: 唯一标识符，防止重放攻击
        aud: 'api.coze.cn'           // Audience: 接收方（Coze API）
    };

    console.log('🔐 生成 JWT，载荷:', JSON.stringify(payload, null, 2));

    // 使用 RS256 算法签名（RSA + SHA256）
    // 注意：header 中必须包含 kid（公钥ID）
    const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        header: {
            alg: 'RS256',
            typ: 'JWT',
            kid: CONFIG.publicKey  // Key ID：公钥标识符，Coze 用它来验证签名
        }
    });

    return token;
}

/**
 * 获取 Access Token
 * 
 * 流程:
 * 1. 检查缓存中是否有有效 Token
 * 2. 如果没有或即将过期，生成新的 JWT
 * 3. 用 JWT 向 Coze OAuth 服务器换取 Access Token
 * 4. 缓存新 Token
 * 
 * @returns {Promise<string>} Access Token
 */
async function getAccessToken() {
    const now = Date.now();

    // 检查缓存是否有效（未过期且距离过期时间超过5分钟）
    if (tokenCache.accessToken && tokenCache.expiresAt) {
        const timeUntilExpiry = tokenCache.expiresAt - now;
        if (timeUntilExpiry > tokenCache.refreshBuffer) {
            console.log(`✅ 使用缓存 Token（剩余 ${Math.floor(timeUntilExpiry / 1000 / 60)} 分钟）`);
            return tokenCache.accessToken;
        }
        console.log('⏰ Token 即将过期，刷新中...');
    }

    // 生成新的 JWT
    const jwtToken = generateJWT();

    // 构造请求体
    const requestBody = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',  // OAuth 2.0 JWT Bearer 授权类型
        duration_seconds: CONFIG.tokenDuration,                      // Token 有效期
        jwt: jwtToken                                                // 签名后的 JWT
    };

    console.log('📤 请求新的 Access Token...');
    console.log('   URL:', `${CONFIG.baseURL}/api/permission/oauth2/token`);

    try {
        // 发送请求到 Coze OAuth 服务器
        const response = await fetch(`${CONFIG.baseURL}/api/permission/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`  // JWT 放在 Authorization 头
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ 获取 Token 失败:', data);
            throw new Error(data.error_message || data.message || 'Token 请求失败');
        }

        // 缓存新 Token
        tokenCache.accessToken = data.access_token;
        tokenCache.expiresAt = now + (data.expires_in * 1000);  // 转换为毫秒

        console.log('✅ 成功获取新 Token');
        console.log(`   有效期: ${data.expires_in} 秒 (${Math.floor(data.expires_in / 3600)} 小时)`);

        return data.access_token;

    } catch (error) {
        console.error('❌ Token 请求出错:', error.message);
        throw error;
    }
}

/**
 * 获取 Token 状态信息（用于调试）
 */
function getTokenStatus() {
    if (!tokenCache.accessToken) {
        return { valid: false, message: '尚未获取 Token' };
    }

    const now = Date.now();
    const timeUntilExpiry = tokenCache.expiresAt - now;

    if (timeUntilExpiry <= 0) {
        return { valid: false, message: 'Token 已过期' };
    }

    return {
        valid: true,
        expiresIn: Math.floor(timeUntilExpiry / 1000),
        expiresInMinutes: Math.floor(timeUntilExpiry / 1000 / 60),
        message: `Token 有效，剩余 ${Math.floor(timeUntilExpiry / 1000 / 60)} 分钟`
    };
}

// 导出配置和函数
export { CONFIG, generateJWT, getAccessToken, getTokenStatus };
