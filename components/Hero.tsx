import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useData } from '../contexts/DataContext.tsx';

const Hero: React.FC = () => {
  const { contactInfo } = useData();

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-orion-purple/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      <div className="container mx-auto relative z-10 text-center">
        <div className="inline-block mb-6 px-4 py-1 border border-orion-purple/20 rounded-full bg-orion-purple/5 backdrop-blur-md">
          <span className="text-orion-accent text-[9px] md:text-xs tracking-[0.3em] uppercase font-bold animate-pulse">
            Engenharia de Emoções
          </span>
        </div>

        <h1 
          className="text-4xl md:text-7xl lg:text-9xl font-black font-display text-white mb-6 leading-[1.1] tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] px-2"
          dangerouslySetInnerHTML={{
            __html: contactInfo.heroHeadline || "CRIAMOS O <br /><span class='text-orion-glow'>INESQUECÍVEL</span>"
          }}
        />

        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-xl leading-relaxed mb-10 font-light px-4">
          {contactInfo.heroSubheadline || "Transformamos fótons e frequências em memórias eternas para seu evento."}
        </p>

        <button 
          onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank')}
          className="px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-orion-accent hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] rounded-sm"
        >
          Planejar Experiência
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30 hidden md:block">
        <ArrowDown className="w-5 h-5 text-orion-accent" />
      </div>
    </section>
  );
};

export default Hero;