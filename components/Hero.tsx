import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const { contactInfo, portfolio } = useData();

  // Pegar os primeiros 3 ou 4 itens do portfólio para a animação
  const displayItems = portfolio?.slice(0, 4) || [];

  return (
    <section className="relative min-h-screen bg-[var(--bg)] flex items-center justify-center overflow-hidden">
      
      {/* Glow de fundo */}
      <div className="absolute inset-0 bg-glow-top opacity-60 pointer-events-none" />

      {/* Conteúdo Central */}
      <div className="wrap relative z-10 w-full pt-20 pb-32 text-center flex flex-col items-center">
        
        <span className="t-label fade-up mb-6 inline-block" style={{ animationDelay: '0.1s' }}>
          Tecnologia Audiovisual
        </span>
        
        <h1 
          className="t-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8 fade-up"
          style={{ fontSize: 'clamp(48px, 8vw, 110px)', animationDelay: '0.2s' }}
        >
          {contactInfo.heroHeadline1 || 'O ESPETÁCULO'} <br />
          {contactInfo.heroHeadline2 || 'COMEÇA AQUI.'}
        </h1>

        <p 
          className="t-body text-[var(--muted)] max-w-2xl text-lg md:text-xl fade-up mb-12"
          style={{ animationDelay: '0.3s' }}
        >
          {contactInfo.heroSubheadline || 'Eleve o nível do seu evento com locações premium e uma estrutura que marca presença.'}
        </p>

        {/* Animação dos Equipamentos (Flutuando) */}
        {displayItems.length > 0 && (
          <div 
            className="relative w-full max-w-4xl h-[120px] md:h-[200px] mt-8 mb-16 fade-up flex justify-center items-end"
            style={{ animationDelay: '0.5s' }}
          >
            {displayItems.map((item, i) => {
              // Posicionamento escalonado
              const isCenter = i === 0;
              const zIndex = 40 - i * 10;
              const scale = isCenter ? 1 : 0.8 - (i * 0.1);
              const translateX = isCenter ? 0 : i % 2 === 0 ? 120 + (i*20) : -120 - (i*20);
              const translateY = isCenter ? 0 : 30 + (i * 10);
              
              return (
                <div 
                  key={item.id}
                  className="absolute bottom-0 drop-shadow-2xl transition-transform duration-1000 ease-out hover:-translate-y-4"
                  style={{
                    zIndex,
                    transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                    animation: `float ${4 + i}s ease-in-out infinite alternate`
                  }}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="h-[150px] md:h-[280px] w-auto object-contain rounded-2xl"
                    style={{ maskImage: 'linear-gradient(to top, transparent, black 15%)', WebkitMaskImage: 'linear-gradient(to top, transparent, black 15%)' }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Indicador de Scroll para a próxima dobra */}
      <a 
        href="#promocoes" 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[var(--muted)] hover:text-white transition-colors fade-up"
        style={{ animationDelay: '0.7s' }}
        aria-label="Rolar para baixo"
      >
        <span className="t-label text-[9px] tracking-[0.2em]">Scroll</span>
        <div className="w-8 h-12 rounded-full border border-[var(--border2)] flex items-start justify-center p-2 bg-[var(--surface)]">
          <div className="w-1 h-3 rounded-full bg-[var(--purple-m)] animate-bounce" />
        </div>
      </a>

      {/* Keyframes embutidos para o float */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) translateX(var(--tw-translate-x)) scale(var(--tw-scale-x)); }
          100% { transform: translateY(-15px) translateX(var(--tw-translate-x)) scale(var(--tw-scale-x)); }
        }
      `}} />
    </section>
  );
};

export default Hero;