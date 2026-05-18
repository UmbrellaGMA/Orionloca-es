import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../contexts/DataContext';
import { Equipment } from '../types';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { portfolio, contactInfo } = useData();
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(portfolio.map(i => i.category)));
    return ['TODOS', ...cats.sort()];
  }, [portfolio]);

  const items = activeCategory === 'TODOS' ? portfolio : portfolio.filter(i => i.category === activeCategory);
  const images = selected ? [selected.imageUrl, ...(selected.images || [])] : [];

  if (!portfolio || portfolio.length === 0) return null;

  return (
    <section id="collection" className="py-20 md:py-32 relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-orion-glow" />
              <span className="section-label">Coleção</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-6xl uppercase leading-[0.9] text-white">
              NOSSOS<br />
              <span className="text-gradient">EQUIPAMENTOS</span>
            </h2>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border transition-all duration-300 rounded-full ${
                  activeCategory === cat
                    ? 'border-orion-glow bg-orion-glow/10 text-white glow-border'
                    : 'border-white/10 text-orion-muted hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric grid — Lando-style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              onClick={() => { setSelected(item); setImgIdx(0); }}
              className={`group relative overflow-hidden cursor-pointer bg-orion-dark border border-white/5 hover:border-orion-purple/40 transition-all duration-500 rounded-sm ${
                i === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-[4/5]'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={`${item.name} — ${item.category}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orion-black via-orion-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Hover reveal */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
                {/* Category tag */}
                <span className="self-start px-3 py-1 border border-orion-purple/30 bg-orion-black/50 backdrop-blur-sm text-orion-accent text-[9px] font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                  {item.category}
                </span>

                {/* Name + arrow */}
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-bold text-white text-sm md:text-lg leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-orion-purple/0 group-hover:bg-orion-purple group-hover:border-orion-purple transition-all duration-300 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shrink-0">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelected(null)} />

          <div className="relative w-full max-w-5xl mx-4 bg-orion-dark border border-white/10 rounded-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <div className="relative flex-1 aspect-square md:aspect-auto bg-black">
              <img
                src={images[imgIdx]}
                alt={`${selected.name} — foto ${imgIdx + 1}`}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + images.length) % images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                        className={`h-[2px] rounded-full transition-all ${i === imgIdx ? 'w-6 bg-orion-glow' : 'w-3 bg-white/30'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className="w-full md:w-[380px] p-7 flex flex-col overflow-y-auto custom-scrollbar shrink-0">
              <span className="section-label mb-1">{selected.category}</span>
              <div className="divider-purple" />
              <h3 className="font-display font-black text-2xl text-white uppercase mb-4">{selected.name}</h3>
              <p className="text-orion-muted text-sm leading-relaxed mb-6 font-light">{selected.description}</p>

              {selected.specs && selected.specs.length > 0 && (
                <div className="space-y-2 mb-8">
                  {selected.specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs text-white/70">
                      <div className="w-1 h-1 rounded-full bg-orion-glow shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(`Interesse em ${selected.name}`)}`, '_blank')}
                className="btn-primary mt-auto justify-center"
              >
                Solicitar Orçamento
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Portfolio;