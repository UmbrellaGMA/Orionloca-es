import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, X } from 'lucide-react';

const FAQ: React.FC = () => {
  const { faqs } = useData();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 md:py-32 relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">

          {/* Left — sticky label */}
          <div className="md:sticky md:top-32 self-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-orion-glow" />
              <span className="section-label">FAQ</span>
            </div>
            <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-[0.9] text-white mb-6">
              SUAS<br />
              <span className="text-gradient">DÚVIDAS</span>
            </h2>
            <p className="text-orion-muted text-sm leading-relaxed font-light max-w-xs">
              Respostas para as perguntas mais frequentes sobre nossos serviços e equipamentos.
            </p>
          </div>

          {/* Right — accordion */}
          <div className="divide-y divide-white/6">
            {faqs.map((faq, idx) => (
              <div key={faq.id}>
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                  aria-expanded={openIdx === idx}
                >
                  <span className={`font-bold text-base md:text-lg transition-colors duration-300 pr-4 ${
                    openIdx === idx ? 'text-white' : 'text-white/60 group-hover:text-white'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    openIdx === idx
                      ? 'border-orion-glow bg-orion-glow/10 text-orion-glow rotate-45'
                      : 'border-white/15 text-white/40 group-hover:border-white/40'
                  }`}>
                    {openIdx === idx ? <X size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  openIdx === idx ? 'max-h-96 pb-6' : 'max-h-0'
                }`}>
                  <p className="text-orion-muted text-sm leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;