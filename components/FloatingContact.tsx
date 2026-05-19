import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const FloatingContact: React.FC = () => {
  const { contactInfo } = useData();
  return (
    <button
      onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank')}
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all duration-200"
    >
      <MessageCircle size={20} />
    </button>
  );
};

export default FloatingContact;