import React from 'react';
import { useData } from '../contexts/DataContext';

const Hero: React.FC = () => {
  const { contactInfo, portfolio } = useData();

  // Pegar os primeiros 4 itens do portfólio para a animação
  const displayItems = portfolio?.slice(0, 4) || [];

  return (
    <section className="relative min-h-screen bg-[var(--bg)] flex items-center justify-center overflow-hidden">
      
      {/* Vídeo de Fundo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen"
        >
          <source src="/videos/fundo-orion.MOV" type="video/quicktime" />
          <source src="/videos/fundo-orion.MOV" type="video/mp4" />
        </video>
        {/* Degradê para garantir leitura do texto e fundir suavemente com o fundo da página */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/80 via-[var(--bg)]/50 to-[var(--bg)]" />
        <div className="absolute inset-0 bg-glow-top opacity-60 mix-blend-screen" />
      </div>

      {/* Conteúdo Central */}
      <div className="wrap relative z-10 w-full pt-28 pb-32 text-center flex flex-col items-center">
        
        <span className="t-label fade-up mb-6 inline-block bg-[var(--surface)]/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-[var(--border2)]" style={{ animationDelay: '0.1s' }}>
          Tecnologia Audiovisual
        </span>
        
        <h1 
          className="t-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 mb-6 fade-up drop-shadow-lg"
          style={{ fontSize: 'clamp(42px, 8vw, 110px)', animationDelay: '0.2s' }}
        >
          {contactInfo.heroHeadline1 || 'O ESPETÁCULO'} <br />
          {contactInfo.heroHeadline2 || 'COMEÇA AQUI.'}
        </h1>

        <p 
          className="t-body text-[var(--text)] max-w-2xl text-base md:text-xl fade-up mb-12 drop-shadow-md"
          style={{ animationDelay: '0.3s' }}
        >
          {contactInfo.heroSubheadline || 'Eleve o nível do seu evento com locações premium e uma estrutura que marca presença.'}
        </p>

        {/* Animação dos Equipamentos (Flutuando e Expandindo) */}
        {displayItems.length > 0 && (
          <div 
            className="relative w-full max-w-4xl h-[160px] md:h-[220px] mt-8 mb-16 fade-up flex justify-center items-end"
            style={{ animationDelay: '0.5s' }}
          >
            {displayItems.map((item, i) => {
              // Posicionamento responsivo via CSS calc
              const isCenter = i === 0;
              const zIndex = 40 - i * 10;
              const scale = isCenter ? 1 : 0.85 - (i * 0.1);
              
              // Multiplicador de direção: 0 para o centro, 1 para ímpares (direita), -1 para pares (esquerda)
              const dir = isCenter ? 0 : i % 2 === 0 ? 1 : -1;
              const step = Math.ceil(i / 2);
              
              // No mobile (clamp), os itens ficam mais próximos para não vazar da tela
              const translateX = `calc(${dir} * clamp(50px, 18vw, 150px) * ${step})`;
              const translateY = isCenter ? '0px' : `${30 + (i * 10)}px`;
              
              return (
                <div 
                  key={item.id}
                  // Usamos "group" e alteramos o z-index no hover com !important para que a imagem focada sobreponha as outras
                  className="absolute bottom-0 drop-shadow-2xl group hover:!z-[60]"
                  style={{
                    zIndex,
                    transform: `translateX(${translateX}) translateY(${translateY}) scale(${scale})`,
                  }}
                >
                  {/* Container da animação de float */}
                  <div 
                    // No hover, desativa temporariamente a animação de float e foca na expansão
                    className="transition-all duration-500 ease-[var(--ease-out)] group-hover:-translate-y-12 group-hover:scale-[1.3] group-hover:drop-shadow-[0_20px_40px_rgba(124,58,237,0.4)]"
                    style={{ animation: `floatItem ${4 + i}s ease-in-out infinite alternate` }}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      // Alturas otimizadas para mobile e desktop
                      className="h-[120px] sm:h-[160px] md:h-[280px] w-auto object-contain rounded-2xl"
                      style={{ 
                        maskImage: 'linear-gradient(to top, transparent, black 15%)', 
                        WebkitMaskImage: 'linear-gradient(to top, transparent, black 15%)' 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Indicador de Scroll para a próxima dobra */}
      <a 
        href="#promocoes" 
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[var(--muted)] hover:text-white transition-colors fade-up z-20"
        style={{ animationDelay: '0.7s' }}
        aria-label="Rolar para baixo"
      >
        <span className="t-label text-[9px] tracking-[0.2em] hidden md:block">Scroll</span>
        <div className="w-6 h-10 md:w-8 md:h-12 rounded-full border border-[var(--border2)] flex items-start justify-center p-1.5 md:p-2 bg-[var(--surface)]/80 backdrop-blur-sm">
          <div className="w-1 h-2 md:h-3 rounded-full bg-[var(--purple-m)] animate-bounce" />
        </div>
      </a>

      {/* Keyframes embutidos para o float */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatItem {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-15px); }
        }
      `}} />
    </section>
  );
};

export default Hero;