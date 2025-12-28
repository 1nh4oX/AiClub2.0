import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COZE_CONFIG } from '../config/coze.js';
import LytesLogo from './LytesLogo.jsx';

/**
 * AIChat - Lytes 智能助理界面
 * 
 * Lytes = Lychee + Nantes（荔枝 + 南特）
 * 设计风格：仿 Gemini 现代简约风格
 */
const AIChat = ({ onBack }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);  // 防止欢迎界面闪现
    const [showToast, setShowToast] = useState('');
    const [moreMenuIndex, setMoreMenuIndex] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isThinking]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = () => setMoreMenuIndex(null);
        if (moreMenuIndex !== null) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [moreMenuIndex]);

    // Toast 提示
    const showToastMessage = (msg) => {
        setShowToast(msg);
        setTimeout(() => setShowToast(''), 2000);
    };

    // 发送消息
    const handleSend = async (customMessage = null) => {
        const messageToSend = customMessage || input.trim();
        if (!messageToSend || isThinking) return;

        const userMessage = messageToSend;
        const currentMsgCount = messages.length;

        setMessages(prev => [
            ...prev,
            { type: 'user', text: userMessage },
            { type: 'bot', text: '', isStreaming: true }
        ]);
        setInput('');
        setIsThinking(true);

        const botMessageIndex = currentMsgCount + 1;
        let fullResponse = '';

        try {
            const response = await fetch(`${COZE_CONFIG.serverURL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    userId: COZE_CONFIG.userId
                })
            });

            if (!response.ok) throw new Error(`请求失败: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const eventBlocks = buffer.split('\n\n');
                buffer = eventBlocks.pop() || '';

                for (const block of eventBlocks) {
                    if (!block.trim()) continue;

                    const lines = block.split('\n');
                    let eventType = '', eventData = '';

                    for (const line of lines) {
                        if (line.startsWith('event:')) eventType = line.slice(6).trim();
                        else if (line.startsWith('data:')) eventData = line.slice(5).trim();
                    }

                    if (!eventData || eventData === '[DONE]') continue;

                    try {
                        const data = JSON.parse(eventData);

                        if (eventType === 'conversation.message.delta' && data.content) {
                            fullResponse += data.content;
                            setIsThinking(false);
                            setMessages(prev => {
                                const newMessages = [...prev];
                                newMessages[botMessageIndex] = { type: 'bot', text: fullResponse, isStreaming: true };
                                return newMessages;
                            });
                        } else if (eventType === 'conversation.message.completed' &&
                            data.role === 'assistant' && data.type === 'answer' && data.content) {
                            fullResponse = data.content;
                            setMessages(prev => {
                                const newMessages = [...prev];
                                newMessages[botMessageIndex] = { type: 'bot', text: fullResponse, isStreaming: false };
                                return newMessages;
                            });
                        }
                    } catch (e) { }
                }
            }

            // 标记流式结束
            setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages[botMessageIndex]) {
                    newMessages[botMessageIndex].isStreaming = false;
                }
                return newMessages;
            });

            if (!fullResponse) {
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[botMessageIndex] = { type: 'bot', text: '抱歉，我暂时无法回答这个问题。', isStreaming: false };
                    return newMessages;
                });
            }

        } catch (error) {
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[botMessageIndex] = { type: 'bot', text: `连接出现问题: ${error.message}`, isStreaming: false };
                return newMessages;
            });
        } finally {
            setIsThinking(false);
        }
    };

    // 反馈处理
    const handleFeedback = async (type, msgIndex) => {
        const userMsg = messages[msgIndex - 1]?.text || '';
        const aiMsg = messages[msgIndex]?.text || '';

        try {
            await fetch(`${COZE_CONFIG.serverURL}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, userMessage: userMsg, aiResponse: aiMsg })
            });
            showToastMessage('感谢您的反馈！');
        } catch (e) {
            showToastMessage('反馈发送失败');
        }
    };

    // 重新回答 - 删除上一轮对话，重新发送同一个问题
    const handleRetry = (msgIndex) => {
        if (isThinking || isRetrying) return; // 防止重复点击

        const userMsgIndex = msgIndex - 1;
        if (userMsgIndex < 0) return;

        const userMsg = messages[userMsgIndex];
        if (!userMsg || userMsg.type !== 'user' || !userMsg.text) return;

        const questionToRetry = userMsg.text;
        console.log('🔄 重新回答:', questionToRetry);

        // 设置重试状态
        setIsRetrying(true);

        // 使用 callback 形式确保获取最新状态并删除问答
        setMessages(prevMessages => {
            const newMessages = prevMessages.slice(0, userMsgIndex);
            console.log('📝 删除后消息数:', newMessages.length);
            return newMessages;
        });

        // 延迟后重新发送
        setTimeout(() => {
            setIsRetrying(false);
            console.log('📤 重新发送问题');
            handleSend(questionToRetry);
        }, 100);
    };

    // 复制到剪贴板
    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showToastMessage('已复制到剪贴板');
        } catch (e) {
            showToastMessage('复制失败');
        }
    };

    // 互动按钮组件 - 始终显示，起到分割线作用
    const ActionButtons = ({ msgIndex, text }) => (
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-white/5">
            {/* 点赞 */}
            <button
                onClick={() => handleFeedback('like', msgIndex)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                title="有帮助"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
            </button>

            {/* 踩 */}
            <button
                onClick={() => handleFeedback('dislike', msgIndex)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                title="没帮助"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                </svg>
            </button>

            {/* 重新回答 */}
            <button
                onClick={() => handleRetry(msgIndex)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                title="重新回答"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 4v6h6M23 20v-6h-6" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
            </button>

            {/* 复制 */}
            <button
                onClick={() => handleCopy(text)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                title="复制"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            </button>

            {/* 更多选项 */}
            <div className="relative">
                <button
                    onClick={(e) => { e.stopPropagation(); setMoreMenuIndex(moreMenuIndex === msgIndex ? null : msgIndex); }}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
                    title="更多"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                    </svg>
                </button>

                {/* 弹出菜单 */}
                <AnimatePresence>
                    {moreMenuIndex === msgIndex && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full right-0 mb-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                        >
                            {['核查回答', '听回复', '导出为文档', '报告问题'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => { showToastMessage('功能暂未开发'); setMoreMenuIndex(null); }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                                >
                                    <span className="text-gray-500">•</span>
                                    {item}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f]"
        >
            {/* Toast 提示 */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-white z-[100]"
                    >
                        {showToast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 顶部导航 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <LytesLogo size={32} isThinking={false} />
                    <div>
                        <span className="text-white font-medium tracking-wide">Lytes</span>
                        <span className="text-gray-500 text-xs ml-2">SAIF Intelligence</span>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* 欢迎界面 - 仅在无消息且非重试状态时显示 */}
                    {messages.length === 0 && !isThinking && !isRetrying && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <LytesLogo size={80} isThinking={false} showGlow={true} />
                            <h1 className="text-2xl font-light text-white mt-6 mb-2">你好，我是 Lytes</h1>
                            <p className="text-gray-500 text-sm">金融科技学院智能助理，有什么可以帮助你的？</p>

                            {/* 快捷提示 */}
                            <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-md mx-auto">
                                {['课程设置', 'DeFi实验室', '南特交换项目', '就业前景'].map((hint) => (
                                    <button
                                        key={hint}
                                        onClick={() => setInput(hint)}
                                        className="px-4 py-2 text-sm text-gray-400 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        {hint}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 消息列表 */}
                    <div className="space-y-6">
                        <AnimatePresence>
                            {messages.filter(msg => msg && (msg.text || msg.type === 'user')).map((msg, i) => {
                                const actualIndex = messages.indexOf(msg);
                                return (
                                    <motion.div
                                        key={actualIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="group"
                                    >
                                        {msg.type === 'user' ? (
                                            /* 用户消息 */
                                            <div className="flex justify-end">
                                                <div className="max-w-[80%] px-4 py-2.5 bg-white/10 rounded-2xl rounded-br-md text-white text-[15px]">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ) : msg.text ? (
                                            /* AI 消息 */
                                            <div className="flex gap-3">
                                                <LytesLogo size={32} isThinking={false} isStreaming={msg.isStreaming} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                                                        {msg.text}
                                                        {msg.isStreaming && (
                                                            <span className="inline-block w-0.5 h-4 ml-0.5 bg-cyan-400 animate-pulse align-middle" />
                                                        )}
                                                    </div>
                                                    {/* 互动按钮 - 仅在非流式时显示 */}
                                                    {!msg.isStreaming && <ActionButtons msgIndex={actualIndex} text={msg.text} />}
                                                </div>
                                            </div>
                                        ) : null}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* 思考状态 */}
                        {isThinking && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3"
                            >
                                <LytesLogo size={32} isThinking={true} />
                                <div className="flex items-center gap-2 text-gray-400 text-sm pt-2">
                                    <span>思考中</span>
                                    <div className="flex gap-1">
                                        {[0, 1, 2].map((i) => (
                                            <motion.span
                                                key={i}
                                                className="w-1 h-1 bg-cyan-400 rounded-full"
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* 底部输入区 */}
            <div className="border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="relative flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="向 Lytes 提问..."
                            disabled={isThinking}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 pr-14 text-white text-[15px] focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all placeholder-gray-500 disabled:opacity-50"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isThinking}
                            className={`absolute right-2 w-10 h-10 flex items-center justify-center rounded-xl transition-all ${input.trim() && !isThinking
                                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                                : 'bg-white/5 text-gray-500'
                                }`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-3">
                        © 2025 Lytes | Powered by SAIF & Coze
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default AIChat;
