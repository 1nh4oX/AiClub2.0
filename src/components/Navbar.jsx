import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-5 flex justify-between items-center nav-glass"
        >
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 tracking-wider relative select-none">
                    <span className="font-sans-cn font-bold text-white text-lg tracking-widest">南特金科</span>
                    <span className="w-px h-5 bg-white/20"></span>
                    <span className="font-tech font-medium text-cyan-400 text-sm tracking-widest">SAIF</span>
                </div>
            </div>
            
            <div className="hidden md:flex space-x-12 text-sm font-sans-cn font-medium text-gray-400">
                {[
                    {id: 'about', text: '学院概况'},
                    {id: 'academics', text: '学术科研'},
                    {id: 'faculty', text: '师资队伍'},
                    {id: 'contact', text: '招生申请'}
                ].map((item, index) => (
                    <a 
                        key={index}
                        href={`#${item.id}`} 
                        className="relative hover:text-white transition-colors duration-300 py-2 cursor-pointer"
                    >
                        {item.text}
                    </a>
                ))}
            </div>
        </motion.nav>
    );
};

export default Navbar;

