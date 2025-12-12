import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ParticleNetwork = ({ viewMode }) => {
    const canvasRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.1]);
    const springOpacity = useSpring(opacity, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationFrameId;
        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        const startTime = Date.now();

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        class Node {
            constructor() {
                this.theta = Math.random() * Math.PI * 2;
                this.phi = Math.acos((Math.random() * 2) - 1);

                this.currentRadius = Math.random() * 2000 + 1000;
                this.targetBaseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.38;

                this.x = 0;
                this.y = 0;
                this.z = 0;

                this.baseSize = Math.random() * 2.0 + 0.5;

                // Random offset for warp speed effect
                this.warpFactor = Math.random() * 0.5 + 0.5;
            }

            update(rotationX, rotationY, viewMode, timeElapsed) {
                let targetRadius = this.targetBaseRadius;

                if (viewMode === 'chat') {
                    // WARP MODE: Rapid expansion with slight randomness
                    targetRadius = Math.min(width, height) * 4.0;
                    this.currentRadius += (targetRadius - this.currentRadius) * (0.1 * this.warpFactor);
                } else {
                    // HOME MODE: Stable
                    this.currentRadius += (targetRadius - this.currentRadius) * 0.05;
                }

                let tx = this.currentRadius * Math.sin(this.phi) * Math.cos(this.theta);
                let ty = this.currentRadius * Math.sin(this.phi) * Math.sin(this.theta);
                let tz = this.currentRadius * Math.cos(this.phi);

                // Rotation
                let rotY_Actual = rotationY;
                if (viewMode === 'chat') {
                    // Add extra spin during warp
                    rotY_Actual += timeElapsed * 0.002;
                }

                let x1 = tx * Math.cos(rotY_Actual) - tz * Math.sin(rotY_Actual);
                let z1 = tx * Math.sin(rotY_Actual) + tz * Math.cos(rotY_Actual);

                let y2 = ty * Math.cos(rotationX) - z1 * Math.sin(rotationX);
                let z2 = ty * Math.sin(rotationX) + z1 * Math.cos(rotationX);

                let cx = width * 0.7;
                let cy = height * 0.5;

                if (viewMode === 'chat') {
                    const targetCx = width * 0.5;
                    cx += (targetCx - cx) * 0.1;
                }

                this.x = cx + x1;
                this.y = cy + y2;
                this.z = z2;
            }

            draw(ctx, viewMode) {
                const scale = (this.z + this.currentRadius * 2) / (this.currentRadius * 3);
                const alphaBase = Math.max(0.1, (this.z + this.currentRadius) / (this.currentRadius * 2));

                // In chat mode, don't fade out completely, keep them as background stars
                const finalAlpha = viewMode === 'chat' ? alphaBase * 0.5 : alphaBase;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.baseSize * scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 240, 255, ${finalAlpha})`;
                ctx.fill();

                if (finalAlpha > 0.6) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.baseSize * scale * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(34, 211, 238, ${finalAlpha * 0.4})`;
                    ctx.fill();
                }
            }
        }

        const initParticles = () => {
            particles = [];
            const count = 280;
            for (let i = 0; i < count; i++) {
                particles.push(new Node());
            }
        };

        const onMouseMove = (e) => {
            mouseX = (e.clientX - width / 2) * 0.0005;
            mouseY = (e.clientY - height / 2) * 0.0005;
        };

        let autoRotate = 0;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            const timeElapsed = Date.now() - startTime;

            targetRotationY += (mouseX - targetRotationY) * 0.05;
            targetRotationX += (mouseY - targetRotationX) * 0.05;

            // Base rotation speed
            let rotationSpeed = 0.0015;

            // Entrance effect
            if (timeElapsed < 2000) {
                rotationSpeed = 0.02 * (1 - timeElapsed / 2000) + 0.0015;
            }

            autoRotate += rotationSpeed;

            const finalRotY = autoRotate + targetRotationY;
            const finalRotX = targetRotationX;

            particles.forEach(p => p.update(finalRotX, finalRotY, viewMode, timeElapsed));

            // Draw Network Lines (Only visible when particles are close, i.e., Home mode)
            if (viewMode === 'home') {
                ctx.lineWidth = 0.8;

                for (let i = 0; i < particles.length; i++) {
                    const p1 = particles[i];
                    if (p1.z < -p1.currentRadius * 0.5) continue;

                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        if (p2.z < -p2.currentRadius * 0.5) continue;

                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const distSq = dx * dx + dy * dy;

                        const maxDist = 130 * 130;

                        if (distSq < maxDist) {
                            const alpha = (1 - distSq / maxDist);

                            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.5})`;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();

                            if (distSq < maxDist * 0.6) {
                                for (let k = j + 1; k < Math.min(particles.length, j + 5); k++) {
                                    const p3 = particles[k];
                                    const d2 = (p2.x - p3.x) ** 2 + (p2.y - p3.y) ** 2;
                                    const d3 = (p1.x - p3.x) ** 2 + (p1.y - p3.y) ** 2;

                                    if (d2 < maxDist * 0.6 && d3 < maxDist * 0.6) {
                                        ctx.fillStyle = `rgba(34, 211, 238, ${alpha * 0.08})`;
                                        ctx.beginPath();
                                        ctx.moveTo(p1.x, p1.y);
                                        ctx.lineTo(p2.x, p2.y);
                                        ctx.lineTo(p3.x, p3.y);
                                        ctx.closePath();
                                        ctx.fill();
                                    }
                                }
                            }
                        }
                    }
                }
            }

            particles.forEach(p => p.draw(ctx, viewMode));

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });
        window.addEventListener('mousemove', onMouseMove);

        resize();
        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [viewMode]);

    return (
        <motion.canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none"
            style={{ opacity: viewMode === 'chat' ? 1 : springOpacity }}
        />
    );
};

export default ParticleNetwork;
