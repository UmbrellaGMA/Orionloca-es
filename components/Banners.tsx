import React, { useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const Banners: React.FC = () => {
  const { banners } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!banners || banners.length === 0) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="promocoes" className="py-24 md:py-32 relative">
      <div className="wrap">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="t-heading text-4xl md:text-5xl mb-4">Em Destaque</h2>
            <p className="t-body text-[var(--muted)] max-w-md">
              Aproveite nossas soluções completas e pacotes exclusivos para transformar seu evento.
            </p>
          </div>

          {/* Navegação Manual */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-[var(--border2)] flex items-center justify-center text-white hover:bg-[var(--surface)] transition-colors"
              aria-label="Anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-[var(--border2)] flex items-center justify-center text-white hover:bg-[var(--surface)] transition-colors"
              aria-label="Próximo"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Lista Horizontal de Promoções */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto hide-scroll gap-6 md:gap-8 pb-8 snap-x snap-mandatory"
        >
          {banners.map((banner, i) => (
            <div 
              key={banner.id || i}
              className="min-w-[85vw] md:min-w-[600px] shrink-0 snap-center relative rounded-3xl overflow-hidden group"
              style={{ aspectRatio: '16/9' }}
            >
              <picture className="block w-full h-full">
                <source media="(max-width: 768px)" srcSet={banner.mobileUrl || banner.desktopUrl} />
                <img 
                  src={banner.desktopUrl} 
                  alt={banner.title || 'Promoção'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </picture>
              
              {/* Overlay Glass */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/90 via-[#080810]/20 to-transparent opacity-90" />
              
              {banner.title && (
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 right-8">
                  <span className="t-label text-[var(--purple-l)] mb-3 block">Oferta Especial</span>
                  <h3 className="t-display text-3xl md:text-4xl text-white mb-6">
                    {banner.title}
                  </h3>
                  
                  <button 
                    onClick={() => window.open('https://wa.me/5513999999999', '_blank')} // Será substituído pelo link real ou WhatsApp
                    className="btn btn-secondary bg-white/10 backdrop-blur-md"
                  >
                    Saiba Mais
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Banners;