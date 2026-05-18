import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';

const TICKER_ITEMS = [
  'ÁUDIO & SOM',
  'ILUMINAÇÃO LED',
  'PROJEÇÃO & VÍDEO',
  'ESTRUTURA & PALCO',
  'EXPERIÊNCIAS IMERSIVAS',
  'BAIXADA SANTISTA',
  'EVENTOS CORPORATIVOS',
  'FESTAS PREMIUM',
];

const Marquee: React.FC = () => (
  <div className="overflow-hidden py-4 border-y border-white/6 bg-orion-surface/40">
    <div className="flex w-max marquee-track">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <span key={i} className="flex items-center gap-6 px-8 shrink-0">
          <span className="font-display font-black text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/70 whitespace-nowrap">
            {item}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orion-glow shrink-0" aria-hidden="true" />
        </span>
      ))}
    </div>
  </div>
);

const Banners: React.FC = () => {
  const { banners } = useData();
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % banners.length), 6000);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [banners.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  return (
    <>
      <Marquee />

      {banners && banners.length > 0 && (
        <section className="relative z-10 px-4 md:px-10 py-8">
          <div className="max-w-[1400px] mx-auto">

            {/* Section label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-orion-glow" />
              <span className="section-label">Destaques</span>
            </div>

            {/* Carousel */}
            <div className="relative w-full aspect-[16/7] md:aspect-[21/8] overflow-hidden rounded-lg bg-orion-dark">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <picture className="block w-full h-full">
                    <source media="(max-width: 768px)" srcSet={banner.mobileUrl || banner.desktopUrl} />
                    <source media="(min-width: 769px)" srcSet={banner.desktopUrl} />
                    <img
                      src={banner.desktopUrl}
                      alt={banner.title || 'Banner Orion'}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                  {banner.title && (
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                      <h3 className="font-display font-black text-xl md:text-4xl text-white uppercase tracking-widest drop-shadow-lg">
                        {banner.title}
                      </h3>
                    </div>
                  )}
                </div>
              ))}

              {/* Dots */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 right-6 z-20 flex gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      aria-label={`Banner ${idx + 1}`}
                      className={`h-[2px] transition-all duration-500 rounded-full ${idx === current ? 'w-8 bg-orion-glow' : 'w-3 bg-white/30'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Banners;