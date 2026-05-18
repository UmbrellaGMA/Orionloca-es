import React from 'react';
import { useData } from '../contexts/DataContext';
import { Star } from 'lucide-react';

const Feedbacks: React.FC = () => {
  const { feedbacks } = useData();

  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <section id="feedbacks" className="py-20 md:py-32 relative z-10 bg-orion-surface/30">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-orion-glow" />
          <span className="section-label">Depoimentos</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-[0.9] text-white">
            O QUE NOSSOS<br />
            <span className="text-gradient">CLIENTES DIZEM</span>
          </h2>
          <p className="text-orion-muted text-sm max-w-xs font-light">
            Experiências reais de quem viveu nossos eventos.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map((fb, i) => (
            <div
              key={fb.id}
              className={`surface rounded-sm p-7 flex flex-col gap-4 hover:border-orion-purple/30 transition-all duration-300 ${
                i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: fb.rating || 5 }).map((_, s) => (
                  <Star key={s} size={12} className="fill-orion-glow text-orion-glow" />
                ))}
              </div>

              {/* Quote mark decorative */}
              <div className="font-display font-black text-6xl leading-none text-orion-purple/20 -mb-4 select-none">"</div>

              {/* Content */}
              <p className="text-white/80 text-sm leading-relaxed font-light italic flex-1">
                {fb.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                <div className="w-9 h-9 rounded-full bg-orion-purple/20 border border-orion-purple/30 flex items-center justify-center text-orion-accent font-bold text-sm">
                  {fb.client?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{fb.client}</div>
                  {fb.role && <div className="text-orion-muted text-[10px] uppercase tracking-widest">{fb.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedbacks;