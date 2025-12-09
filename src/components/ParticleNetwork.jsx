import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ParticleNetwork = () => {
    const canvasRef = useRef(null);
    const { scrollYProgress } = useScroll();
    
    // 滚动时保留一些背景，不完全消失（从1到0.25），并增加模糊
    const rawOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.25]);
    const rawScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]); 
    const rawFilter = useTransform(scrollYProgress, [0, 0.5], ["blur(0px)", "blur(8px)"]);
    
    const opacity = useSpring(rawOpacity, { stiffness: 60, damping: 20 });
    const scale = useSpring(rawScale, { stiffness: 60, damping: 20 });
    
    // 添加初始淡入动画状态
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationFrameId;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4; // 减慢速度，更稳定
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2.5 + 1.5; // 稍大的粒子
                this.id = Math.random(); // 固定ID，用于颜色判断
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = `rgba(165, 180, 252, 0.7)`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            // 增加粒子数量，让几何图形更密集
            const count = Math.min(Math.floor(window.innerWidth / 6), 180); 
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // 存储所有三角形
            const triangles = [];
            
            // --- 核心算法：三角网格构建 ---
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // 1. 增大连接距离，让几何图形更大
                    if (dist < 200) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 - dist/1200})`; 
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();

                        // 2. 增大三角形形成距离
                        if (dist < 180) {
                            for (let k = j + 1; k < particles.length; k++) {
                                const dx2 = particles[j].x - particles[k].x;
                                const dy2 = particles[j].y - particles[k].y;
                                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                                
                                const dx3 = particles[i].x - particles[k].x;
                                const dy3 = particles[i].y - particles[k].y;
                                const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

                                if (dist2 < 180 && dist3 < 180) {
                                    // 计算三角形面积
                                    const area = Math.abs(
                                        (particles[j].x - particles[i].x) * (particles[k].y - particles[i].y) -
                                        (particles[k].x - particles[i].x) * (particles[j].y - particles[i].y)
                                    ) / 2;
                                    
                                    // 使用粒子ID的组合作为固定种子，避免频闪
                                    const seed = particles[i].id + particles[j].id + particles[k].id;
                                    
                                    triangles.push({
                                        points: [particles[i], particles[j], particles[k]],
                                        area: area,
                                        avgDist: (dist + dist2 + dist3) / 3,
                                        seed: seed
                                    });
                                }
                            }
                        }
                    }
                }
            }
            
            // 按面积排序，大的先画
            triangles.sort((a, b) => b.area - a.area);
            
            // 绘制三角形
            triangles.forEach((tri) => {
                const intensity = 1 - (tri.avgDist / 180);
                
                // 使用固定的seed来决定三角形类型，避免频闪
                const seedInt = Math.floor(tri.seed * 1000);
                const isDark = seedInt % 7 === 0;
                const isBright = seedInt % 11 === 0;
                
                if (isDark) {
                    // 深色三角形（类似图片中的深青色区域）
                    ctx.fillStyle = `rgba(6, 182, 212, ${0.12 * intensity})`;
                    ctx.strokeStyle = `rgba(34, 211, 238, ${0.35 * intensity})`;
                    ctx.lineWidth = 1.5;
                } else if (isBright) {
                    // 亮色三角形（类似图片中的亮青色区域）
                    ctx.fillStyle = `rgba(56, 189, 248, ${0.09 * intensity})`;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 * intensity})`;
                    ctx.lineWidth = 1.2;
                } else {
                    // 普通三角形
                    ctx.fillStyle = `rgba(34, 211, 238, ${0.04 * intensity})`;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * intensity})`;
                    ctx.lineWidth = 0.6;
                }
                
                ctx.beginPath();
                ctx.moveTo(tri.points[0].x, tri.points[0].y);
                ctx.lineTo(tri.points[1].x, tri.points[1].y);
                ctx.lineTo(tri.points[2].x, tri.points[2].y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });
        
        resize();
        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none"
        >
            <motion.canvas 
                ref={canvasRef} 
                style={{ 
                    opacity,
                    scale, 
                    filter: rawFilter 
                }}
                className="w-full h-full origin-center" 
            />
        </motion.div>
    );
};

export default ParticleNetwork;

