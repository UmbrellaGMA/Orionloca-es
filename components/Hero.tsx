import React from 'react';
import DOMPurify from 'dompurify';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const { contactInfo } = useData();

  const handleCTA = () => {
    const msg = encodeURIComponent('Olá Orion! Gostaria de iniciar um projeto.');
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${msg}`, '_blank');
  };

  const safeSubheadline = DOMPurify.sanitize(
    contactInfo.heroSubheadline || 'Locação de equipamentos audiovisuais para eventos de alto padrão na Baixada Santista.'
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-orion-black">

      {/* Full-bleed background with purple radial */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_40%,rgba(109,40,217,0.18)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-orion-black to-transparent z-10" />
      </div>

      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Corner number — Lando-style detail */}
      <div className="absolute top-24 right-8 md:right-16 z-20 text-right hidden md:block">
        <span className="font-display text-[80px] font-black text-white/[0.04] leading-none select-none">04</span>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 pb-16 md:pb-24 w-full">

        {/* Label */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-8 h-[1px] bg-orion-glow" />
          <span className="section-label">Baixada Santista · Desde 2020</span>
        </div>

        {/* Headline — ultra bold, left-aligned, massive */}
        <h1 className="font-display font-black uppercase leading-[0.9] tracking-tight mb-6 md:mb-10">
          <div className="text-[clamp(52px,10vw,130px)] text-white">
            {contactInfo.heroHeadline1 || 'EVENTOS'}
          </div>
          <div className="text-[clamp(52px,10vw,130px)] text-gradient">
            {contactInfo.heroHeadline2 || 'QUE FICAM'}
          </div>
          <div className="text-[clamp(52px,10vw,130px)] text-white/15">
            {contactInfo.heroHeadline3 || 'NA MEMÓRIA'}
          </div>
        </h1>

        {/* Bottom row — description + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-16 pt-6 border-t border-white/8">
          <p
            className="max-w-md text-orion-muted text-sm md:text-base leading-relaxed font-light"
            dangerouslySetInnerHTML={{ __html: safeSubheadline }}
          />

          <div className="flex items-center gap-4 shrink-0">
            <button onClick={handleCTA} className="btn-primary">
              Iniciar Projeto
              <ArrowRight size={14} />
            </button>
            <a
              href="#collection"
              className="btn-outline hidden md:inline-flex"
            >
              Ver Coleção
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="hidden md:grid grid-cols-4 gap-0 mt-16 pt-8 border-t border-white/6">
          {[
            { n: '500+', label: 'Clientes' },
            { n: '700',  label: 'Eventos' },
            { n: '300+', label: 'Gravações' },
            { n: '4',    label: 'Anos de mercado' },
          ].map((s, i) => (
            <div key={i} className={`py-4 ${i > 0 ? 'pl-8 border-l border-white/6' : ''}`}>
              <div className="font-display font-black text-3xl text-white mb-1">{s.n}</div>
              <div className="text-[10px] uppercase tracking-widest text-orion-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1 opacity-40">
        <span className="text-[9px] uppercase tracking-[0.3em] text-orion-muted">Scroll</span>
        <ChevronDown size={14} className="text-orion-glow animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;