import React from 'react';
import DOMPurify from 'dompurify';
import { ArrowRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const { contactInfo } = useData();

  const handleCTA = () => {
    const msg = encodeURIComponent('Olá! Gostaria de solicitar um orçamento.');
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <section className="relative min-h-screen bg-black flex flex-col justify-between pt-16 overflow-hidden">

      {/* Grid de fundo — sutil, não decorativo demais */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          opacity: 0.35,
        }}
      />
      {/* Fade nas bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_40%,#000_100%)] pointer-events-none" />

      {/* Número decorativo — Lando-style, mas sóbrio */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display select-none pointer-events-none leading-none text-[#F0EEE9]/[0.03]"
        style={{ fontSize: 'clamp(200px, 35vw, 500px)' }}
      >
        OR
      </div>

      {/* Conteúdo principal */}
      <div className="container-xl relative z-10 flex-1 flex flex-col justify-end pb-14 md:pb-20 pt-32 md:pt-40">

        {/* Linha superior — localização + ano */}
        <div className="flex items-center gap-6 mb-10 md:mb-14">
          <div className="rule-accent" />
          <span className="font-heading text-[10px] font-600 uppercase tracking-[0.35em] text-[#555]">
            Baixada Santista · SP · Est. 2020
          </span>
        </div>

        {/* Headline — Bebas Neue, brutal, sem gradient */}
        <h1
          className="font-display leading-[0.88] mb-10 md:mb-14"
          style={{ fontSize: 'clamp(72px, 13vw, 200px)' }}
        >
          <div className="text-white">
            {contactInfo.heroHeadline1 || 'EVENTOS'}
          </div>
          <div className="text-white">
            {contactInfo.heroHeadline2 || 'QUE FICAM'}
          </div>
          {/* Terceira linha em itálico — tipografia como design */}
          <div
            className="text-[#A78BFA]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(24px, 3.5vw, 52px)', letterSpacing: '-0.01em', lineHeight: 1.3, marginTop: '0.15em' }}
          >
            {contactInfo.heroSubheadline || 'Experiências audiovisuais de alto padrão para eventos memoráveis'}
          </div>
        </h1>

        {/* Rodapé do hero — divide e conquista */}
        <div className="rule mb-8" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          {/* Stats — sem caixas, só números e texto */}
          <div className="flex items-center gap-8 md:gap-12">
            {[
              { n: '500+', l: 'Clientes' },
              { n: '700',  l: 'Eventos' },
              { n: '300+', l: 'Gravações' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display text-2xl md:text-3xl text-white" style={{ letterSpacing: '0.02em' }}>{s.n}</div>
                <div className="font-heading text-[10px] font-600 uppercase tracking-[0.2em] text-[#555] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button onClick={handleCTA} className="btn btn-fill">
              Iniciar Projeto
              <ArrowRight size={13} />
            </button>
            <a href="#collection" className="btn btn-ghost hidden md:inline-flex">
              Ver Coleção
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;