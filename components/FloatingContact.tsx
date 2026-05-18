import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const FloatingContact: React.FC = () => {
  const { contactInfo } = useData();

  const handleClick = () => {
    const msg = encodeURIComponent('Olá Orion! Gostaria de solicitar um orçamento.');
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contato via WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 bg-[#25D366] text-white font-bold text-[11px] uppercase tracking-widest rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 group"
    >
      <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
      <span className="hidden md:inline">WhatsApp</span>
    </button>
  );
};

export default FloatingContact;