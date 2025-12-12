import { motion } from 'framer-motion';

const InfoSection = ({ id, title, subtitle, content, align = "left", color = "cyan" }) => {
    const isRight = align === "right";

    return (
        <section id={id} className="min-h-[80vh] flex items-center justify-center py-24 px-6 z-10 relative border-t border-white/5 scroll-mt-24">
            <div className={`max-w-7xl w-full grid md:grid-cols-2 gap-24 items-center ${isRight ? "md:grid-flow-col-dense" : ""}`}>
                <motion.div
                    initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={`flex flex-col ${isRight ? "md:order-2 md:items-end md:text-right" : "md:items-start"}`}
                >
                    <span className={`font-tech text-${color}-400 font-bold text-xs tracking-[0.3em] uppercase mb-6 flex items-center gap-4 ${isRight ? "flex-row-reverse" : ""}`}>
                        {subtitle}
                        <span className={`h-0.5 w-8 bg-${color}-500`}></span>
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-white leading-tight font-sans-cn font-bold">{title}</h2>
                    <p className="text-gray-400 leading-8 font-sans-cn font-light text-base md:text-lg max-w-xl mb-10 text-justify">{content}</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-8 py-3 border border-white/10 bg-white/5 hover:bg-${color}-500/10 hover:border-${color}-500/50 transition-all duration-300 rounded-full`}
                    >
                        <span className="font-sans-cn text-sm font-medium text-white tracking-widest uppercase">了解更多</span>
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`relative aspect-[4/3] w-full bg-black/40 border border-white/10 overflow-hidden rounded-2xl group ${isRight ? "md:order-1" : ""}`}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-30 transition-opacity duration-1000 ${color === 'purple' ? 'from-purple-900/40 via-transparent to-transparent' :
                            color === 'emerald' ? 'from-emerald-900/40 via-transparent to-transparent' :
                                'from-cyan-900/40 via-transparent to-transparent'
                        }`}></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div className="font-tech text-xs text-white/40 tracking-widest">
                            {subtitle === 'Faculty' ? '02 // FACULTY' : subtitle === 'Innovation' ? '03 // INNOVATION' : '01 // OVERVIEW'}
                        </div>
                        <div className={`w-2 h-2 bg-${color}-400`}></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default InfoSection;
