import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../contexts/DataContext';
import { Equipment } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { portfolio, contactInfo } = useData();
  const [cat, setCat] = useState('TODOS');
  const [sel, setSel] = useState<Equipment | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = sel ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sel]);

  const categories = useMemo(
    () => ['TODOS', ...Array.from(new Set(portfolio.map(i => i.category))).sort()],
    [portfolio]
  );

  const items = cat === 'TODOS' ? portfolio : portfolio.filter(i => i.category === cat);
  const imgs = sel ? [sel.imageUrl, ...(sel.images || [])] : [];

  if (!portfolio.length) return null;

  return (
    <section id="collection" className="bg-black">

      {/* Cabeçalho da seção */}
      <div className="container-xl pt-20 md:pt-28 pb-10">
        <div className="rule mb-10" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-heading text-[10px] font-700 uppercase tracking-[0.3em] text-[#555] mb-3">— Coleção</p>
            <h2 className="font-display text-6xl md:text-8xl text-white" style={{ letterSpacing: '0.04em', lineHeight: 0.9 }}>
              NOSSOS<br />EQUIPAMENTOS
            </h2>
          </div>

          {/* Filtros — texto simples, sem pill */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`font-heading text-[11px] font-700 uppercase tracking-[0.18em] transition-colors duration-200 ${
                  cat === c ? 'text-white border-b border-white pb-0.5' : 'text-[#444] hover:text-[#888]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid assimétrico */}
      <div className="container-xl pb-20 md:pb-28">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3">
          {items.map((item, i) => {
            // Padrão: 1º item grande, depois alternado
            const isLarge = i === 0;
            const isMedium = !isLarge && i % 5 === 3;
            const colSpan = isLarge ? 'md:col-span-7' : isMedium ? 'md:col-span-5' : 'md:col-span-4';
            const aspect = isLarge ? 'aspect-[4/3]' : isMedium ? 'aspect-[3/4]' : 'aspect-[3/4]';

            return (
              <div
                key={item.id}
                onClick={() => { setSel(item); setImgIdx(0); }}
                className={`relative overflow-hidden cursor-pointer group bg-[#111] ${colSpan} ${aspect}`}
              >
                <img
                  src={item.imageUrl}
                  alt={`${item.name} — ${item.category}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Overlay — aparece só no hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-400" />

                {/* Info — aparece no hover, não antes */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                  <span className="font-heading text-[9px] font-700 uppercase tracking-[0.25em] text-[#A78BFA] mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl text-white" style={{ letterSpacing: '0.05em' }}>
                    {item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {sel && createPortal(
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal aria-label={sel.name}>
          <div className="absolute inset-0 bg-black/97" onClick={() => setSel(null)} />

          <div className="relative w-full max-w-5xl mx-auto mt-10 md:mt-16 bg-[#0A0A0A] border border-[#1E1E1E] flex flex-col md:flex-row overflow-hidden max-h-[88vh]">

            <button
              onClick={() => setSel(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#888] hover:text-white border border-[#2A2A2A] hover:border-[#555] transition-colors"
              aria-label="Fechar"
            >
              <X size={14} />
            </button>

            {/* Imagem */}
            <div className="relative flex-1 bg-black min-h-[280px]">
              <img src={imgs[imgIdx]} alt={`${sel.name} ${imgIdx + 1}`} className="w-full h-full object-cover" />
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx((imgIdx - 1 + imgs.length) % imgs.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 flex items-center justify-center text-white hover:bg-black transition-colors"
                    aria-label="Anterior"
                  ><ChevronLeft size={16} /></button>
                  <button
                    onClick={e => { e.stopPropagation(); setImgIdx((imgIdx + 1) % imgs.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 flex items-center justify-center text-white hover:bg-black transition-colors"
                    aria-label="Próxima"
                  ><ChevronRight size={16} /></button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imgs.map((_, i) => (
                      <button key={i} onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                        className={`h-[1px] transition-all rounded-none ${i === imgIdx ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className="w-full md:w-[340px] shrink-0 flex flex-col p-8 overflow-y-auto slim-scrollbar">
              <span className="font-heading text-[9px] font-700 uppercase tracking-[0.3em] text-[#7C3AED] mb-2">{sel.category}</span>
              <div className="rule mb-6" />
              <h3 className="font-display text-3xl md:text-4xl text-white mb-4" style={{ letterSpacing: '0.04em' }}>{sel.name}</h3>
              <p className="font-body text-[#888] text-sm leading-relaxed mb-8">{sel.description}</p>

              {sel.specs?.length > 0 && (
                <div className="space-y-2.5 mb-8">
                  {sel.specs.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-[#666]">
                      <span className="text-[#7C3AED] mt-0.5 shrink-0">—</span>
                      {s}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(`Interesse em ${sel.name}`)}`, '_blank')}
                className="btn btn-fill mt-auto w-full justify-center"
              >
                Solicitar Orçamento
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