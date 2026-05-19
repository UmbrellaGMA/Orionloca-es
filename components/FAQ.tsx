import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const FAQ: React.FC = () => {
  const { faqs } = useData();
  const [open, setOpen] = useState<number | null>(null);

  if (!faqs?.length) return null;

  return (
    <section id="faq" className="bg-black py-20 md:py-28">
      <div className="container-xl">
        <div className="rule mb-10" />

        <div className="grid md:grid-cols-[280px_1fr] gap-12 md:gap-20">

          {/* Esquerda — label fixo */}
          <div className="md:sticky md:top-28 self-start">
            <p className="font-heading text-[10px] font-700 uppercase tracking-[0.3em] text-[#555] mb-4">— FAQ</p>
            <h2 className="font-display text-5xl md:text-6xl text-white leading-none" style={{ letterSpacing: '0.04em' }}>
              SUAS<br />DÚVIDAS
            </h2>
          </div>

          {/* Direita — accordion sem background */}
          <div>
            {faqs.map((faq, i) => (
              <div key={faq.id} className="border-t border-[#1E1E1E]">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full py-6 flex items-start justify-between text-left gap-8 group"
                  aria-expanded={open === i}
                >
                  <span className={`font-heading font-600 text-base md:text-lg transition-colors duration-200 ${
                    open === i ? 'text-white' : 'text-[#666] group-hover:text-[#aaa]'
                  }`}>
                    {faq.question}
                  </span>
                  {/* Ícone — só traço e cruz, sem background */}
                  <span className={`font-display text-xl shrink-0 mt-0.5 transition-all duration-300 ${
                    open === i ? 'text-[#7C3AED] rotate-45' : 'text-[#444] group-hover:text-[#888]'
                  }`}>
                    +
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-80 pb-6' : 'max-h-0'}`}>
                  <p className="font-body text-[#666] text-sm leading-relaxed pr-12">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
            <div className="border-t border-[#1E1E1E]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;