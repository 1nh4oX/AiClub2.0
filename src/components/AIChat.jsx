import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CozeAPI } from '@coze/api';
import { COZE_CONFIG } from '../config/coze';

// 初始化 Coze API 客户端
const apiClient = new CozeAPI({
    token: COZE_CONFIG.token,
    baseURL: COZE_CONFIG.baseURL
});

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: '你好！我是 SAIF 智能助手。关于招生政策、专业课程或实验室项目，请随时提问。' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            // 调用 Coze API 流式聊天
            const stream = await apiClient.chat.stream({
                bot_id: COZE_CONFIG.botId,
                user_id: COZE_CONFIG.userId,
                additional_messages: [
                    {
                        content: userMsg,
                        content_type: 'text',
                        role: 'user',
                        type: 'question'
                    }
                ],
            });

            let fullResponse = '';
            let responseMessageIndex = -1;

            // 处理流式响应
            for await (const chunk of stream) {
                if (chunk.event === 'conversation.message.delta') {
                    const delta = chunk.data?.delta || '';
                    fullResponse += delta;
                    
                    if (responseMessageIndex === -1) {
                        // 首次接收到响应，创建新消息
                        setIsTyping(false);
                        setMessages(prev => {
                            responseMessageIndex = prev.length;
                            return [...prev, { type: 'bot', text: delta }];
                        });
                    } else {
                        // 更新现有消息
                        setMessages(prev => {
                            const newMessages = [...prev];
                            newMessages[responseMessageIndex] = {
                                type: 'bot',
                                text: fullResponse
                            };
                            return newMessages;
                        });
                    }
                }
                
                if (chunk.event === 'conversation.message.completed') {
                    setIsTyping(false);
                }
            }
        } catch (error) {
            console.error('Coze API Error:', error);
            setIsTyping(false);
            
            // 如果 API 调用失败，使用备用回复
            const fallbackResponses = [
                "抱歉，我遇到了一些技术问题。请稍后再试，或者您可以直接联系我们的招生办公室。",
                "系统暂时无法响应，请稍后重试。如需帮助，欢迎通过官方渠道联系我们。"
            ];
            const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            setMessages(prev => [...prev, { type: 'bot', text: fallbackResponse }]);
        }
    };

    return (
        <>
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-10 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] z-50 group hover:bg-white/20 transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 w-full md:w-[420px] h-full z-50 glass-panel border-l border-white/5 flex flex-col shadow-2xl bg-[#0a0a0c]/90"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                                    <span className="font-sans-cn font-bold text-lg text-white">智能助手</span>
                                    <span className="text-xs text-gray-500 font-tech">Powered by Coze</span>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-4 text-sm leading-7 ${
                                            msg.type === 'user' 
                                            ? 'bg-cyan-900/30 border border-cyan-500/20 text-cyan-50' 
                                            : 'bg-white/5 border border-white/5 text-gray-300'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[85%] p-4 text-sm leading-7 bg-white/5 border border-white/5 text-gray-300">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-white/5">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="输入您的问题..."
                                    disabled={isTyping}
                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-colors placeholder-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChat;
