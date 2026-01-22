import React from 'react';
import { useData } from '../contexts/DataContext.tsx';
import { 
  Instagram, Send, MessageCircle, ExternalLink, ArrowLeft, 
  FileText, ShoppingBag 
} from 'lucide-react';

const LinkTree: React.FC = () => {
  const { links, contactInfo } = useData();

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const goBackToHome = () => {
    window.location.hash = '';
  };

  const renderIcon = (key: string) => {
    switch (key) {
      case 'word': return <FileText size={20} className="text-blue-400" />;
      case 'instagram': return <Instagram size={20} className="text-pink-400" />;
      case 'whatsapp': return <MessageCircle size={20} className="text-green-400" />;
      case 'shopping': return <ShoppingBag size={20} className="text-orion-accent" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-orion-black relative flex flex-col items-center pt-24 pb-20 px-6">
      
      {/* Back Button */}
      <button 
        onClick={goBackToHome}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2 glass-panel border border-orion-purple/30 text-orion-accent rounded-full text-[10px] uppercase tracking-widest hover:bg-orion-purple/20 hover:scale-105 active:scale-95 transition-all shadow-lg"
      >
        <ArrowLeft size={14} />
        Início
      </button>

      {/* Background Video Header */}
      <div className="absolute top-0 left-0 w-full h-[40vh] overflow-hidden pointer-events-none">
        {contactInfo.linktreeVideoUrl ? (
          <video 
            src={contactInfo.linktreeVideoUrl} 
            className="w-full h-full object-cover opacity-60" 
            autoPlay muted loop playsInline 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-orion-purple/30 via-orion-purple/5 to-transparent"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-orion-black via-orion-black/40 to-transparent"></div>
      </div>

      {/* Profile Section */}
      <div className="relative z-10 flex flex-col items-center mb-10 text-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-orion-glow/50 p-1 bg-orion-black shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-6 overflow-hidden animate-float">
          <img 
            src={contactInfo.profilePicUrl || contactInfo.logoUrl || 'https://via.placeholder.com/150'} 
            className="w-full h-full object-cover rounded-full" 
            alt="Profile"
          />
        </div>
        <h1 className="text-xl md:text-2xl font-display font-bold text-white mb-3 tracking-[0.2em] uppercase">{contactInfo.siteTitle}</h1>
        <p className="text-gray-400 max-w-xs text-xs md:text-sm font-light leading-relaxed px-4">{contactInfo.bio || "Experiências Digitais & Engenharia de Emoções"}</p>
      </div>

      {/* Links List */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
        {links.length > 0 ? links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleLinkClick(link.url)}
            className="group relative w-full flex items-center justify-between p-4 glass-panel border border-white/10 rounded-xl hover:border-orion-glow/50 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="text-xl w-10 h-10 min-w-[40px] flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-orion-purple/30 transition-colors">
                {['word', 'instagram', 'whatsapp', 'shopping'].includes(link.emoji) ? renderIcon(link.emoji) : (link.emoji || "✨")}
              </div>
              <span className="font-bold text-white text-sm tracking-wide leading-snug">{link.label}</span>
            </div>
            <div className="text-gray-600 group-hover:text-orion-glow opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <ExternalLink size={16} />
            </div>
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-orion-glow/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </button>
        )) : (
          <div className="text-center py-10 glass-panel rounded-xl border-dashed border-white/10">
            <p className="text-gray-600 italic text-xs uppercase tracking-widest">Nenhum link orbitando...</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-16 relative z-10 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
        {contactInfo.logoUrl ? (
          <img src={contactInfo.logoUrl} className="h-6 grayscale hover:grayscale-0 transition-all mb-4" />
        ) : (
          <div className="text-orion-accent font-display text-[8px] tracking-[0.5em] mb-4">ORION SYSTEMS</div>
        )}
        <p className="text-[9px] tracking-[0.4em] uppercase text-gray-600 font-bold">© 2025 Orion Locações</p>
      </div>
    </div>
  );
};

export default LinkTree;