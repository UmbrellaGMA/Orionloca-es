import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';

const TICKERS = [
  'ÁUDIO · SOM · SUBWOOFER',
  'ILUMINAÇÃO · LED · MOVING HEAD',
  'PROJEÇÃO · VÍDEO · LED WALL',
  'ESTRUTURA · PALCO · TRUSS',
  'BAIXADA SANTISTA',
  'EVENTOS CORPORATIVOS',
  'FESTAS · CASAMENTOS · SHOWS',
];

const Banners: React.FC = () => {
  const { banners } = useData();
  const [current, setCurrent] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    timer.current = setInterval(() => setCurrent(p => (p + 1) % banners.length), 6000);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    start();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [banners.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    if (timer.current) clearInterval(timer.current);
    start();
  };

  const tickerItems = [...TICKERS, ...TICKERS];

  return (
    <>
      {/* ── Ticker horizontal ───────────────────────────────── */}
      <div className="marquee-wrap border-t border-b border-[#1E1E1E] bg-[#0A0A0A] py-3.5">
        <div className="marquee-track">
          {tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-5 px-6 shrink-0">
              <span
                className="font-heading text-[10px] font-700 uppercase tracking-[0.28em] text-[#888] whitespace-nowrap"
              >
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#7C3AED]" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Carrossel de banners ────────────────────────────── */}
      {banners && banners.length > 0 && (
        <section className="px-4 md:px-10 py-8 bg-black">
          <div className="max-w-[1440px] mx-auto">

            {/* Label — tipografia, não badge */}
            <p className="font-heading text-[10px] font-700 uppercase tracking-[0.3em] text-[#555] mb-4">
              — Destaques
            </p>

            <div className="relative w-full overflow-hidden bg-[#111]" style={{ aspectRatio: '21/8' }}>
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <picture className="block w-full h-full">
                    <source media="(max-width: 768px)" srcSet={banner.mobileUrl || banner.desktopUrl} />
                    <img src={banner.desktopUrl} alt={banner.title || 'Orion'} className="w-full h-full object-cover" />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
                  {banner.title && (
                    <div className="absolute bottom-6 left-8 md:bottom-10 md:left-12">
                      <h3 className="font-display text-2xl md:text-5xl text-white" style={{ letterSpacing: '0.06em' }}>
                        {banner.title}
                      </h3>
                    </div>
                  )}
                </div>
              ))}

              {/* Dots — mínimos, sem pill ativo */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 right-6 z-20 flex gap-2 items-center">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`rounded-full transition-all duration-400 ${
                        i === current ? 'w-5 h-1 bg-white' : 'w-1 h-1 bg-white/30'
                      }`}
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