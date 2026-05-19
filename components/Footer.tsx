import React from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowRight, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  const { contactInfo } = useData();

  return (
    <footer id="contact" className="bg-black border-t border-[#1E1E1E]">

      {/* Bloco CTA — tipografia que faz o trabalho */}
      <div className="container-xl py-20 md:py-32 border-b border-[#1E1E1E]">
        <p className="font-heading text-[10px] font-700 uppercase tracking-[0.3em] text-[#555] mb-8">— Vamos trabalhar juntos</p>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 md:gap-16">
          <h2
            className="font-display text-white leading-[0.88]"
            style={{ fontSize: 'clamp(48px, 9vw, 140px)', letterSpacing: '0.03em' }}
          >
            SEU EVENTO<br />
            <span style={{ color: '#A78BFA' }}>COMEÇA</span><br />
            AQUI
          </h2>

          <div className="flex flex-col gap-4 min-w-[220px]">
            <a
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-fill justify-between"
            >
              WhatsApp
              <ArrowRight size={13} />
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="btn btn-ghost justify-between"
            >
              {contactInfo.email}
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Info row */}
      <div className="container-xl py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <span className="font-heading text-[11px] text-[#444] uppercase tracking-[0.2em]">
              {contactInfo.whatsappDisplay}
            </span>
            <span className="font-heading text-[11px] text-[#444] uppercase tracking-[0.2em]">
              {contactInfo.email}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-heading text-[10px] text-[#333] uppercase tracking-widest">
              © {new Date().getFullYear()} Orion Locações · Baixada Santista
            </span>
            <button
              onClick={() => { window.location.hash = 'admin'; }}
              aria-label="Admin"
              className="text-[#222] hover:text-[#444] transition-colors"
            >
              <Lock size={10} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
