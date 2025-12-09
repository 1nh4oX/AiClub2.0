import ParticleNetwork from './components/ParticleNetwork';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InfoSection from './components/InfoSection';
import AIChat from './components/AIChat';
import Footer from './components/Footer';

const App = () => {
    return (
        <div className="relative w-full text-white bg-brand-black min-h-screen">
            <div className="bg-noise"></div>
            <ParticleNetwork />
            <Navbar />
            
            <main>
                <Hero />
                
                <div className="space-y-0 pb-24 relative z-10">
                    <InfoSection 
                        id="about"
                        title="中外融合，精英教育"
                        subtitle="Overview"
                        content="我们不只是教授金融，我们定义未来的金融。依托深圳大学与法国南特高等商学院的深厚底蕴，将计算机科学、大数据分析与现代金融理论深度融合。"
                        align="left"
                        color="cyan"
                    />
                    
                    <InfoSection 
                        id="academics"
                        title="全球视野，顶尖师资"
                        subtitle="Faculty"
                        content="我们的教授来自全球排名前100的名校，拥有丰富的华尔街与伦敦金融城实战经验。从量化交易模型到区块链底层架构，你将直接对话行业前沿。"
                        align="right"
                        color="purple"
                    />

                    <InfoSection 
                        id="faculty"
                        title="DeFi 与未来金融"
                        subtitle="Innovation"
                        content="Web3 正在重塑价值流动的规则。在我们的区块链金融实验室，学生不仅是学习者，更是构建者。我们鼓励使用去中心化思维解决现实金融痛点。"
                        align="left"
                        color="cyan"
                    />
                </div>
            </main>

            <AIChat />
            <Footer />
        </div>
    );
};

export default App;



