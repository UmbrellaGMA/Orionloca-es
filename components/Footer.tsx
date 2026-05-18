import React from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowRight, Mail, MessageCircle, Lock } from 'lucide-react';
import DOMPurify from 'dompurify';

const Footer: React.FC = () => {
  const { contactInfo } = useData();

  const safeFooterHeadline = DOMPurify.sanitize(
    contactInfo.footerHeadline || 'SEU EVENTO COMEÇA AQUI'
  );

  return (
    <footer id="contact" className="relative z-10 bg-orion-black border-t border-white/5">

      {/* Hero CTA block */}
      <div className="border-b border-white/5 py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-orion-glow" />
            <span className="section-label">Contato</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <h2
              className="font-display font-black text-[clamp(36px,7vw,96px)] uppercase leading-[0.9] text-white"
              dangerouslySetInnerHTML={{ __html: safeFooterHeadline }}
            />

            <div className="flex flex-col gap-4 shrink-0 lg:max-w-xs w-full">
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center"
              >
                WhatsApp
                <ArrowRight size={14} />
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="btn-outline justify-center"
              >
                E-mail
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact info row */}
      <div className="py-10 px-6 md:px-12 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-orion-purple/10 border border-orion-purple/20 flex items-center justify-center group-hover:bg-orion-purple/20 transition-colors">
              <Mail size={16} className="text-orion-accent" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-orion-muted mb-0.5">E-mail</p>
              <a href={`mailto:${contactInfo.email}`} className="text-white text-sm hover:text-orion-accent transition-colors">
                {contactInfo.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-green-900/20 border border-green-500/20 flex items-center justify-center group-hover:bg-green-900/30 transition-colors">
              <MessageCircle size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-orion-muted mb-0.5">WhatsApp</p>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm hover:text-green-400 transition-colors"
              >
                {contactInfo.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-6 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-orion-muted uppercase tracking-widest">
            © {new Date().getFullYear()} Orion Locações. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-orion-muted uppercase tracking-widest">
              Baixada Santista · SP · Brasil
            </span>
            <button
              onClick={() => { window.location.hash = 'admin'; }}
              aria-label="Área administrativa"
              className="text-orion-muted/20 hover:text-orion-muted transition-colors"
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
