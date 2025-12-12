import { motion } from 'framer-motion';

const Navbar = ({ onViewChange }) => {
    const handleNavClick = (id) => {
        onViewChange('home');
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-5 flex justify-between items-center nav-glass">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onViewChange('home')}>
                <div className="flex items-center space-x-3 tracking-wider relative select-none">
                    <span className="font-sans-cn font-bold text-white text-lg tracking-widest">南特金科</span>
                    <span className="w-px h-5 bg-white/20"></span>
                    <span className="font-tech font-medium text-cyan-400 text-sm tracking-widest">SAIF</span>
                </div>
            </div>

            <div className="hidden md:flex space-x-12 text-sm font-sans-cn font-medium text-gray-400">
                {[
                    { name: '学院概况', id: 'section-0' },
                    { name: '学术科研', id: 'section-1' },
                    { name: '师资队伍', id: 'section-2' },
                    { name: '招生申请', id: 'contact' }
                ].map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleNavClick(item.id)}
                        className="relative hover:text-white transition-colors duration-300 py-2 cursor-pointer focus:outline-none"
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
