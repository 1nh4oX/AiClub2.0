import { motion } from 'framer-motion';

const Hero = ({ onStartExplore }) => {
    return (
        <section className="relative h-screen flex items-center z-10 px-6 md:px-16 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="flex flex-col items-start justify-center z-20 text-left pt-20"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="font-tech text-cyan-400 font-bold text-xs md:text-sm uppercase mb-6 tracking-[0.3em]"
                    >
                        Future Finance Institute
                    </motion.div>

                    <h1 className="text-7xl md:text-8xl lg:text-9xl mb-8 leading-[0.9] font-sans-cn font-black text-white tracking-tight">
                        你好，<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                            金科人
                        </span>
                    </h1>

                    <p className="max-w-md text-gray-400 font-sans-cn font-light text-base leading-relaxed tracking-wider mb-12">
                        探索 <span className="text-white font-medium">Web3</span>、
                        <span className="text-white font-medium">DeFi</span> 与
                        <span className="text-white font-medium">量化金融</span>的无限疆域。<br />
                        你的金融科技之旅，从这里开始。
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStartExplore}
                        className="group relative px-10 py-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden flex items-center gap-4 transition-all"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="font-sans-cn font-bold text-lg text-white relative z-10">开始探索</span>
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center relative z-10 group-hover:rotate-45 transition-transform duration-300">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </div>
                    </motion.button>
                </motion.div>
                <div className="hidden md:block"></div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50"
            >
                <span className="font-tech text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                <svg className="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m7 13 5 5 5-5" />
                    <path d="m7 6 5 5 5-5" />
                </svg>
            </motion.div>
        </section>
    );
};

export default Hero;
