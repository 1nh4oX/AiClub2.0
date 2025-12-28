import { motion } from 'framer-motion';

/**
 * LytesLogo - 正六边形数字晶体 Logo
 * 
 * Lytes = Lychee + Nantes
 * 使用数学计算的正六边形坐标，确保完全均匀
 */

const LytesLogo = ({
    size = 40,
    isThinking = false,
    isStreaming = false,
    showGlow = true
}) => {
    const isActive = isThinking || isStreaming;

    // 正六边形的顶点计算（等边）
    // 中心点 (50, 50)，半径 38
    const r = 38;  // 外圈半径
    const r2 = 26; // 中圈半径
    const r3 = 14; // 内圈半径
    const cx = 50, cy = 50;

    // 生成正六边形顶点（从顶部开始，顺时针）
    const hexPoints = (radius) => {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 2) + (i * Math.PI / 3); // 从顶部开始
            const x = cx + radius * Math.cos(angle);
            const y = cy - radius * Math.sin(angle);
            points.push([x, y]);
        }
        return points;
    };

    const outer = hexPoints(r);
    const middle = hexPoints(r2);
    const inner = hexPoints(r3);

    const pointsToString = (pts) => pts.map(p => p.join(',')).join(' ');

    return (
        <div
            className="relative flex-shrink-0 flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* 思考时的旋转光环 */}
            {isActive && (
                <motion.div
                    className="absolute rounded-full"
                    style={{
                        inset: -3,
                        background: 'conic-gradient(from 0deg, transparent 0%, #00E5FF 30%, #A855F7 50%, #00E5FF 70%, transparent 100%)',
                        opacity: 0.9,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
            )}

            {/* 外发光 */}
            {showGlow && (
                <div
                    className="absolute rounded-full transition-all duration-300"
                    style={{
                        inset: isActive ? -6 : -3,
                        background: `radial-gradient(circle, rgba(0, 229, 255, ${isActive ? 0.5 : 0.25}) 0%, transparent 70%)`,
                        filter: 'blur(3px)',
                    }}
                />
            )}

            {/* SVG - 正六边形设计 */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                className="relative z-10 w-full h-full"
                style={{
                    filter: `drop-shadow(0 0 ${isActive ? 8 : 4}px rgba(0, 229, 255, ${isActive ? 0.8 : 0.5}))`,
                    transition: 'filter 0.3s ease',
                }}
            >
                <defs>
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9" />
                    </linearGradient>

                    <linearGradient id="hexStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
                    </linearGradient>
                </defs>

                {/* 外层正六边形 */}
                <motion.polygon
                    points={pointsToString(outer)}
                    fill="url(#hexGradient)"
                    stroke="url(#hexStroke)"
                    strokeWidth="1.5"
                    animate={isActive ? { fillOpacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* 中层正六边形 */}
                <polygon
                    points={pointsToString(middle)}
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="0.8"
                />

                {/* 内层正六边形 */}
                <polygon
                    points={pointsToString(inner)}
                    fill="rgba(255,255,255,0.1)"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="0.5"
                />

                {/* 中心点 */}
                <circle cx={cx} cy={cy} r="3" fill="white" opacity="0.95" />

                {/* 从中心到中层顶点的连接线 */}
                <g stroke="rgba(255,255,255,0.25)" strokeWidth="0.5">
                    {middle.map(([x, y], i) => (
                        <line key={i} x1={cx} y1={cy} x2={x} y2={y} />
                    ))}
                </g>

                {/* 中层六个顶点的光点 */}
                <g>
                    {middle.map(([x, y], i) => (
                        <motion.circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="2"
                            fill="#00E5FF"
                            opacity={0.85}
                            animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default LytesLogo;
