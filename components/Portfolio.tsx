import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../contexts/DataContext';
import { Equipment } from '../types';
import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

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
    <section id="catalogo" className="py-24 md:py-32 bg-[var(--surface2)]">
      <div className="wrap">

        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="t-label mb-4 inline-block">Catálogo</span>
          <h2 className="t-heading text-4xl md:text-5xl mb-6">Nossos Equipamentos</h2>
          <p className="t-body text-[var(--muted)]">
            Soluções audiovisuais de alta performance para o seu evento.
          </p>
        </div>

        {/* Filtros Premium */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-6 py-3 rounded-full t-display text-sm font-semibold transition-all duration-300 ${
                cat === c 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border2)] hover:text-white hover:border-white/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid Espaçado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {items.map(item => (
            <div 
              key={item.id}
              onClick={() => { setSel(item); setImgIdx(0); }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] mb-5 aspect-[4/3]">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                
                {/* Botão flutuante sutil de visualizar */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  <Plus size={18} className="text-white" />
                </div>
              </div>

              <div>
                <span className="t-label text-[9px] mb-2 block">{item.category}</span>
                <h3 className="t-heading text-xl text-white mb-2 group-hover:text-[var(--purple-l)] transition-colors">
                  {item.name}
                </h3>
                <p className="t-body text-sm text-[var(--muted)] line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Premium (Estilo Apple/Vercel) */}
      {sel && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal>
          {/* Fundo de Blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity" 
            onClick={() => setSel(null)} 
          />

          {/* Modal Body */}
          <div className="relative w-full max-w-6xl bg-[var(--surface)] border border-[var(--border2)] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in max-h-full">
            
            <button
              onClick={() => setSel(null)}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Galeria de Fotos */}
            <div className="relative w-full md:w-3/5 bg-black min-h-[300px] md:min-h-[600px]">
              <img 
                src={imgs[imgIdx]} 
                alt={sel.name} 
                className="w-full h-full object-cover" 
              />
              
              {imgs.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setImgIdx((i) => (i - 1 + imgs.length) % imgs.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10"><ChevronLeft size={20} /></button>
                  <button onClick={e => { e.stopPropagation(); setImgIdx((i) => (i + 1) % imgs.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10"><ChevronRight size={20} /></button>
                  
                  {/* Dots Modernos */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {imgs.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)} className={`h-2 rounded-full transition-all ${i === imgIdx ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Informações */}
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col overflow-y-auto slim-scroll">
              <span className="t-label mb-4 inline-block">{sel.category}</span>
              <h3 className="t-heading text-3xl md:text-4xl text-white mb-6">{sel.name}</h3>
              <p className="t-body text-[var(--muted)] leading-relaxed mb-8">{sel.description}</p>
              
              {sel.specs && sel.specs.length > 0 && (
                <div className="mb-12">
                  <h4 className="t-display text-sm font-semibold text-white mb-4">Especificações</h4>
                  <ul className="space-y-3">
                    {sel.specs.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--purple)] mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no equipamento: ${sel.name}`)}`, '_blank')}
                className="btn btn-primary mt-auto w-full py-4 text-sm"
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