import React from 'react';
import { useData } from '../contexts/DataContext';

const Feedbacks: React.FC = () => {
  const { feedbacks } = useData();
  if (!feedbacks?.length) return null;

  return (
    <section id="feedbacks" className="bg-[#0A0A0A] py-20 md:py-28 border-t border-[#1E1E1E]">
      <div className="container-xl">

        <p className="font-heading text-[10px] font-700 uppercase tracking-[0.3em] text-[#555] mb-3">— Depoimentos</p>
        <div className="flex justify-between items-end mb-14">
          <h2 className="font-display text-5xl md:text-7xl text-white leading-none" style={{ letterSpacing: '0.04em' }}>
            O QUE DIZEM
          </h2>
          <span className="font-heading text-[10px] text-[#444] uppercase tracking-widest hidden md:block">
            {feedbacks.length} avaliações
          </span>
        </div>

        {/* Layout: coluna única com borda divisória */}
        <div className="space-y-0">
          {feedbacks.map((fb, i) => (
            <div key={fb.id} className="border-t border-[#1E1E1E] py-8 grid md:grid-cols-[1fr_2fr_120px] gap-6 items-start">

              {/* Autor */}
              <div>
                <div className="font-heading font-700 text-white text-sm mb-1">{fb.client}</div>
                {fb.role && (
                  <div className="font-heading text-[10px] uppercase tracking-[0.2em] text-[#444]">{fb.role}</div>
                )}
                {/* Rating — traços ao invés de estrelas */}
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: fb.rating || 5 }).map((_, s) => (
                    <div key={s} className="w-4 h-[2px] bg-[#7C3AED]" />
                  ))}
                </div>
              </div>

              {/* Citação */}
              <p className="font-body text-[#888] text-sm md:text-base leading-relaxed italic">
                "{fb.content}"
              </p>

              {/* Número do depoimento */}
              <div className="font-display text-right text-[#1E1E1E] text-5xl leading-none hidden md:block" style={{ letterSpacing: '0.02em' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
          <div className="border-t border-[#1E1E1E]" />
        </div>
      </div>
    </section>
  );
};

export default Feedbacks;