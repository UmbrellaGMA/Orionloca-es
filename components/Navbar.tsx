import React, { useState, useEffect } from 'react';
import { Aperture, User } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { contactInfo } = useData();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Olá Orion! Gostaria de iniciar um projeto.");
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
      isScrolled ? 'glass-panel border-orion-purple/20 py-2 md:py-3 shadow-lg' : 'bg-transparent border-transparent py-4 md:py-6'
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <a href="#" className="flex items-center group transition-transform hover:scale-105 active:scale-95" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }}>
          {contactInfo.logoUrl ? (
            <img 
              src={contactInfo.logoUrl} 
              alt="Orion" 
              className="h-10 md:h-16 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
            />
          ) : (
            <div className="relative">
              <Aperture className="w-8 h-8 md:w-12 md:h-12 text-orion-accent group-hover:rotate-180 transition-transform duration-1000" />
              <div className="absolute inset-0 blur-md bg-orion-glow opacity-40"></div>
            </div>
          )}
        </a>

        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => window.location.hash = 'admin'}
            className="p-2 text-gray-500 hover:text-orion-accent hover:scale-125 active:scale-90 transition-all duration-300"
            title="Admin"
          >
            <User className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          <button 
            onClick={handleWhatsApp}
            className="px-4 py-2 md:px-6 md:py-3 border border-orion-purple/40 text-orion-accent bg-orion-purple/5 hover:bg-orion-purple/30 hover:scale-105 active:scale-95 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Projeto
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;