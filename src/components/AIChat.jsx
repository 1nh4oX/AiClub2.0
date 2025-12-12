import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChat = ({ onBack }) => {
    const [messages, setMessages] = useState([
        { type: 'bot', text: '你好，我是金科院智能学术助理。无论是课程体系、深大南特合作细节，还是DeFi实验室的研究方向，我都能为你解答。' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, { type: 'user', text: input }]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            const responses = [
                "根据培养方案，大三学年你将有机会前往法国南特高等商学院交换，体验国际化的金融教育环境。",
                "我们的金融科技实验室配备了彭博终端和高频交易模拟系统，让你能够在真实的市场环境中实践所学。",
                "是的，所有的核心课程都采用全英或双语教学，以适应国际化需求。这将大大提升你的professional English能力。"
            ];
            setMessages(prev => [...prev, { type: 'bot', text: responses[Math.floor(Math.random() * responses.length)] }]);
            setIsTyping(false);
        }, 1500);
    };

    // 生成装饰性粒子
    const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
            {/* Animated background with gradient */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-black/80 via-indigo-950/40 to-black/80 backdrop-blur-2xl"
            />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-3xl"
                />

                {/* 左侧装饰粒子 */}
                {particles.slice(0, 20).map((particle) => (
                    <motion.div
                        key={`left-${particle.id}`}
                        className="absolute rounded-full bg-cyan-400/30"
                        style={{
                            left: `${particle.x * 0.15}%`,
                            top: `${particle.y}%`,
                            width: particle.size,
                            height: particle.size,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* 右侧装饰粒子 */}
                {particles.slice(20, 40).map((particle) => (
                    <motion.div
                        key={`right-${particle.id}`}
                        className="absolute rounded-full bg-indigo-400/30"
                        style={{
                            right: `${particle.x * 0.15}%`,
                            top: `${particle.y}%`,
                            width: particle.size,
                            height: particle.size,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="w-full max-w-6xl h-full md:h-[90vh] glass-panel rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl relative z-10">
                {/* Header with enhanced styling */}
                <div className="relative flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5">
                    {/* Animated header accent line */}
                    <motion.div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.3 }}
                    />

                    <div className="flex items-center gap-4">
                        {/* Enhanced AI avatar with pulse animation */}
                        <motion.div
                            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                            animate={{
                                boxShadow: [
                                    "0 0 20px rgba(6,182,212,0.3)",
                                    "0 0 30px rgba(6,182,212,0.5)",
                                    "0 0 20px rgba(6,182,212,0.3)",
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                            </svg>
                            {/* Pulse ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-cyan-400"
                                animate={{
                                    scale: [1, 1.5],
                                    opacity: [0.5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            />
                        </motion.div>

                        <div>
                            <h2 className="font-sans-cn font-bold text-xl text-white tracking-wide">SAIF Intelligence</h2>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-green-400"
                                    animate={{
                                        opacity: [1, 0.5, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <p className="text-xs text-cyan-400/90 font-tech tracking-wider uppercase">Online • AI Ready</p>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        onClick={onBack}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors group border border-white/10"
                    >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </motion.button>
                </div>

                {/* Messages area with enhanced styling */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-transparent via-black/5 to-black/20" ref={scrollRef}>
                    <AnimatePresence>
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                key={i}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`group relative max-w-[75%] ${msg.type === 'user' ? 'order-1' : 'order-2'}`}>
                                    {/* Message bubble with enhanced design */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`relative p-6 rounded-2xl text-base leading-7 font-light tracking-wide shadow-xl backdrop-blur-md overflow-hidden ${msg.type === 'user'
                                                ? 'bg-gradient-to-br from-indigo-600/30 via-indigo-600/20 to-purple-600/30 border border-indigo-400/40 text-white rounded-tr-sm'
                                                : 'bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/10 text-gray-100 rounded-tl-sm'
                                            }`}
                                    >
                                        {/* Shine effect on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                        <p className="relative z-10 font-sans-cn">{msg.text}</p>

                                        {/* Timestamp */}
                                        <div className={`mt-2 text-[10px] font-tech tracking-wider opacity-50 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                            {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </motion.div>

                                    {/* Avatar indicator */}
                                    {msg.type === 'bot' && (
                                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 border-2 border-black/50 flex items-center justify-center">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Enhanced typing indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex justify-start"
                        >
                            <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/10 px-6 py-4 rounded-2xl rounded-tl-sm flex gap-3 items-center backdrop-blur-md shadow-lg">
                                <span className="text-xs text-gray-400 font-tech uppercase tracking-wider">AI 正在思考</span>
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full"
                                            animate={{
                                                y: [-3, 0, -3],
                                                opacity: [1, 0.5, 1],
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Enhanced input area */}
                <div className="relative p-6 border-t border-white/10 bg-gradient-to-b from-black/20 to-black/40">
                    {/* Decorative top line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                    <div className="relative max-w-4xl mx-auto">
                        {/* Input wrapper with glow effect */}
                        <motion.div
                            className="relative rounded-full"
                            whileFocus={{
                                boxShadow: "0 0 0 3px rgba(6,182,212,0.2)",
                            }}
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="输入您想了解的问题..."
                                className="w-full bg-white/5 border border-white/20 rounded-full px-8 py-5 pr-16 text-base text-white focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 transition-all placeholder-gray-500 shadow-inner font-sans-cn"
                            />

                            {/* Send button with fixed animation */}
                            <motion.button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-3.5 rounded-full text-white transition-all ${input.trim()
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] cursor-pointer'
                                        : 'bg-gray-700/50 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </motion.button>
                        </motion.div>

                        {/* Quick suggestions */}
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {['课程设置', 'DeFi实验室', '交换项目'].map((suggestion, i) => (
                                <motion.button
                                    key={suggestion}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setInput(suggestion)}
                                    className="px-4 py-2 text-xs font-tech text-cyan-400/80 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 rounded-full transition-all backdrop-blur-sm"
                                >
                                    {suggestion}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Footer text with enhanced styling */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-center mt-4"
                    >
                        <p className="text-[10px] text-gray-600 font-tech uppercase tracking-widest">
                            Powered by
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 font-bold mx-1">
                                Coze
                            </span>
                            & LLM Architecture
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default AIChat;
