
import React from 'react';
import { useData } from '../contexts/DataContext';
import { Mail, MessageCircle, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  const { contactInfo } = useData();

  const openAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = 'admin';
  };

  return (
    <footer id="contact" className="relative z-10 pt-24 pb-12 border-t border-white/5 bg-black/90 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-display font-bold mb-6"
            dangerouslySetInnerHTML={{
               __html: contactInfo.footerHeadline || "INICIE A <span class='text-orion-glow'>TRANSMISSÃO</span>"
            }}
          />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            {contactInfo.footerSubheadline || "Estamos prontos para dimensionar seu projeto. Entre em contato para consultar disponibilidade e engenharia técnica."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-3xl mx-auto">
          
          {/* Email */}
          <div className="group p-8 border border-white/5 bg-white/5 rounded-sm hover:border-orion-purple/30 transition-all duration-300 text-center">
            <div className="w-12 h-12 bg-orion-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-orion-accent" />
            </div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-2 text-white">Frequência Digital</h4>
            <a href={`mailto:${contactInfo.email}`} className="text-lg font-light text-gray-400 hover:text-white transition-colors">
              {contactInfo.email}
            </a>
          </div>

          {/* WhatsApp */}
          <div className="group p-8 border border-white/5 bg-white/5 bg-green-900/10 rounded-sm hover:border-green-500/30 transition-all duration-300 text-center">
             <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-green-500/20">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-2 text-white">WhatsApp</h4>
            <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-lg font-light text-gray-400 hover:text-white transition-colors">
              {contactInfo.whatsappDisplay}
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
             <p className="text-xs text-gray-600 uppercase tracking-widest">
                © 2025 Orion Locações. Desenvolvido por Orion Studio
             </p>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={openAdmin} 
              className="text-gray-800 hover:text-orion-accent transition-all p-2 rounded-full hover:bg-white/5" 
              title="Área Administrativa"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
