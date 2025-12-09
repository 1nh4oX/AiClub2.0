const Footer = () => (
    <footer className="py-20 border-t border-white/5 relative bg-black z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
            <div className="font-sans-cn font-bold text-2xl mb-8 text-white/80 tracking-widest">深圳大学南特金融科技学院</div>
            <div className="flex space-x-8 mb-8 text-xs font-tech tracking-widest text-gray-500 uppercase">
                <a href="#" className="hover:text-cyan-400 transition-colors">WeChat</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Weibo</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
            </div>
            <p className="text-gray-600 text-xs font-light tracking-wide">&copy; 2025 SAIF. All Rights Reserved.</p>
        </div>
    </footer>
);

export default Footer;



