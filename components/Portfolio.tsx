import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../contexts/DataContext';
import { Equipment } from '../types';
import { ChevronRight, X, ChevronLeft } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { portfolio, contactInfo } = useData();
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      setCurrentImg(0);
    }
    // FIX: Always restore overflow on cleanup (handles unmount with modal open)
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(portfolio.map(i => i.category)));
    return ['TODOS', ...cats.sort()];
  }, [portfolio]);

  const items = activeCategory === 'TODOS' ? portfolio : portfolio.filter(i => i.category === activeCategory);
  const images = selectedItem ? [selectedItem.imageUrl, ...(selectedItem.images || [])] : [];

  const closeModal = () => setSelectedItem(null);

  return (
    <section id="collection" className="py-20 relative z-10 px-4 md:px-0">
      <div className="container mx-auto px-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-3 text-white">COLEÇÃO <span className="text-orion-glow">ORION</span></h2>
            <p className="text-gray-500 text-sm max-w-sm font-light">Equipamentos de alta fidelidade para eventos de outro mundo.</p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 text-[9px] md:text-xs uppercase tracking-widest border transition-all ${activeCategory === c ? 'border-orion-accent text-white bg-orion-purple/20' : 'border-white/10 text-gray-500'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative aspect-[4/5] bg-orion-dark border border-white/5 overflow-hidden rounded-sm cursor-pointer"
            >
              {/* FIX: Added descriptive alt text */}
              <img src={item.imageUrl} alt={`${item.name} — ${item.category}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-orion-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <span className="text-orion-accent text-[10px] font-bold uppercase tracking-widest block mb-1">{item.category}</span>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-orion-glow transition-colors">{item.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Detalhes <ChevronRight size={12} aria-hidden="true" /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label={selectedItem.name}>
          <div className="absolute inset-0 bg-orion-black/95 backdrop-blur-xl" onClick={closeModal}></div>

          <div className="relative w-full h-full md:h-auto md:max-w-5xl md:aspect-[16/9] bg-orion-dark flex flex-col md:flex-row overflow-hidden md:rounded-lg border-y md:border border-white/10">
            <button onClick={closeModal} className="absolute top-4 right-4 z-[110] p-2 bg-black/40 rounded-full text-white" aria-label="Fechar">
              <X size={24} />
            </button>

            <div className="flex-1 relative bg-black flex items-center justify-center">
              {/* FIX: Added alt text */}
              <img
                src={images[currentImg]}
                alt={`${selectedItem.name} — foto ${currentImg + 1} de ${images.length}`}
                className="w-full h-full object-contain md:object-cover"
              />
              {images.length > 1 && (
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-20">
                  {images.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentImg ? 'bg-orion-accent' : 'bg-white/30'}`} />
                  ))}
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentImg((currentImg - 1 + images.length) % images.length); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentImg((currentImg + 1) % images.length); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>

            <div className="w-full md:w-[400px] p-8 flex flex-col bg-orion-dark/80 backdrop-blur-md overflow-y-auto custom-scrollbar">
              <span className="text-orion-accent text-[10px] font-bold tracking-widest mb-2">{selectedItem.category}</span>
              <h3 className="text-2xl font-display font-bold text-white mb-4">{selectedItem.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">{selectedItem.description}</p>

              <div className="space-y-3 mb-8">
                {selectedItem.specs.map((s, i) => (
                  <div key={i} className="text-xs text-gray-300 flex items-center gap-2">
                    <div className="w-1 h-1 bg-orion-purple rounded-full" aria-hidden="true"></div>
                    {s}
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(`Interesse em ${selectedItem.name}`)}`, '_blank')}
                className="w-full py-4 bg-orion-purple text-white font-bold text-xs uppercase tracking-widest mt-auto rounded-sm hover:bg-orion-glow transition-all"
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