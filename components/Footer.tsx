import React from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowUpRight, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  const { contactInfo } = useData();

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank');
  };

  return (
    <footer id="contato" className="bg-[var(--bg)] border-t border-[var(--border2)] pt-24 md:pt-32 pb-12">
      <div className="wrap">
        
        {/* Bloco Central de Chamada (CTA) */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-32">
          <span className="t-label mb-6">Próximo Passo</span>
          
          <h2 className="t-heading text-5xl md:text-7xl mb-10 leading-tight">
            Pronto para fazer <br /> 
            seu evento <span className="text-[var(--purple-l)]">acontecer?</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <button 
              onClick={handleWhatsApp}
              className="btn btn-primary h-14 px-8 text-base rounded-full"
            >
              Falar com um Consultor
            </button>
            
            <a 
              href={`mailto:${contactInfo.email}`}
              className="btn btn-secondary h-14 px-8 text-base rounded-full"
            >
              Enviar Email
            </a>
          </div>
        </div>

        {/* Linha Inferior do Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-[var(--border2)]">
          
          {/* Copyright e Infos */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-sm text-[var(--muted)]">
            <p>© {new Date().getFullYear()} Orion Locações. Todos os direitos reservados.</p>
            <span className="hidden md:block w-1 h-1 rounded-full bg-[var(--dim)]" />
            <p>Baixada Santista, SP</p>
          </div>

          {/* Socials / Links Extras */}
          <div className="flex items-center gap-6">
            <a 
              href={contactInfo.instagramUrl || '#'} 
              target="_blank" 
              rel="noreferrer"
              className="text-[var(--muted)] hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
            >
              Instagram <ArrowUpRight size={14} />
            </a>
            
            {/* Acesso Admin Discreto */}
            <button
              onClick={() => { window.location.hash = 'admin'; }}
              aria-label="Área Restrita"
              className="text-[var(--dim)] hover:text-[var(--muted)] transition-colors ml-4"
            >
              <Lock size={12} />
            </button>
          </div>
          
        </div>

      </div>
    </footer>
  );
};

export default Footer;
