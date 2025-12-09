import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center z-10 px-4 overflow-hidden perspective-1000">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                className="text-center relative z-20 flex flex-col items-center"
            >
                {/* 1. Top Label - 与背景同步淡入 */}
                <motion.div 
                    initial={{ letterSpacing: "1.2em", opacity: 0, y: 10 }}
                    animate={{ letterSpacing: "0.3em", opacity: 1, y: 0 }}
                    transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
                    className="font-tech text-cyan-400 font-bold text-xs md:text-sm uppercase mb-16"
                >
                    Future Finance Institute
                </motion.div>
                
                {/* 2. Main Title - 更流畅的动画 */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
                    className="text-6xl md:text-8xl lg:text-9xl mb-16 leading-none font-sans-cn font-black text-white tracking-tight"
                >
                    你好<br/>
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
                        className="text-gradient-cyber relative inline-block mt-4"
                    >
                        金科人
                    </motion.span>
                </motion.h1>
                
                {/* 3. Description - 最后出现 */}
                <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 1.1 }}
                    className="max-w-xl mx-auto text-gray-400 font-sans-cn font-light text-sm md:text-base leading-loose tracking-wider"
                >
                    在这里，金融的严谨遇见算法的灵动。<br/>
                    探索 <span className="text-white font-medium">Web3</span>、<span className="text-white font-medium">DeFi</span> 与<span className="text-white font-medium">量化金融</span>的无限疆域。
                </motion.p>
            </motion.div>

            {/* Scroll Indicator - 更自然的出现 */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute bottom-10 z-20"
            >
                <div className="flex flex-col items-center gap-2 opacity-60 animate-bounce-slow">
                    <span className="font-tech text-[10px] tracking-[0.3em] uppercase text-gray-500">Scroll</span>
                    {/* Chevron Down Icon instead of line */}
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="m7 13 5 5 5-5"/>
                        <path d="m7 6 5 5 5-5"/>
                    </svg>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;

