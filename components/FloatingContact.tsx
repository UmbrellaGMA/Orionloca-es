import React, { useState } from 'react';
import { MessageCircle, Instagram, X, MessageSquare } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { contactInfo } = useData();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      
      {/* Menu Options */}
      <div className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Instagram */}
        <a 
          href={contactInfo.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-orion-purple hover:border-orion-accent transition-all group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-white px-2">Instagram</span>
          <div className="bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-orion-purple transition-colors">
            <Instagram size={20} />
          </div>
        </a>

        {/* WhatsApp */}
        <a 
          href={`https://wa.me/${contactInfo.whatsapp}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-green-600 hover:border-green-400 transition-all group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <span className="text-xs font-bold uppercase tracking-wider text-white px-2">WhatsApp</span>
          <div className="bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-green-600 transition-colors">
            <MessageCircle size={20} />
          </div>
        </a>

      </div>

      {/* Main Button */}
      <button 
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 ${
            isOpen ? 'bg-gray-800 rotate-90 text-gray-400' : 'bg-orion-purple text-white animate-pulse-slow hover:bg-orion-glow'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

    </div>
  );
};

export default FloatingContact;