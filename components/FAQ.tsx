import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus } from 'lucide-react';

const FAQ: React.FC = () => {
  const { faqs } = useData();
  const [open, setOpen] = useState<number | null>(null);

  if (!faqs?.length) return null;

  return (
    <section id="faq" className="py-24 md:py-32 bg-[var(--surface2)]">
      <div className="wrap max-w-4xl mx-auto">
        
        {/* Cabeçalho Centralizado */}
        <div className="text-center mb-16">
          <span className="t-label mb-4 inline-block">Dúvidas Frequentes</span>
          <h2 className="t-heading text-4xl md:text-5xl">Como Funciona?</h2>
        </div>

        {/* Lista de Accordions */}
        <div className="border-t border-[var(--border2)]">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="border-b border-[var(--border2)]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full py-8 flex items-center justify-between text-left gap-6 group"
                aria-expanded={open === i}
              >
                <span className={`t-heading text-lg md:text-xl transition-colors duration-300 ${
                  open === i ? 'text-white' : 'text-[var(--muted)] group-hover:text-white'
                }`}>
                  {faq.question}
                </span>
                
                {/* Ícone Animado */}
                <div className={`w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center shrink-0 transition-all duration-300 ${
                  open === i ? 'bg-[var(--purple)] border-[var(--purple)] rotate-45 text-white' : 'text-[var(--muted)] group-hover:border-white/30'
                }`}>
                  <Plus size={16} />
                </div>
              </button>

              {/* Corpo do Accordion */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="t-body text-[var(--muted)] md:text-lg leading-relaxed pr-12">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;