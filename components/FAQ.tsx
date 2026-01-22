import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const { faqs } = useData();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative z-10 bg-black/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
           <div className="w-16 h-16 bg-orion-purple/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orion-purple/30">
               <HelpCircle className="w-8 h-8 text-orion-accent" />
           </div>
           <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
             PERGUNTAS <span className="text-orion-glow">FREQUENTES</span>
           </h2>
           <p className="text-gray-400">Respostas para as dúvidas mais comuns sobre nossos serviços.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={faq.id} 
              className={`border border-white/10 rounded-sm overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'bg-white/5 border-orion-purple/30' : 'bg-transparent hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 flex items-center justify-between text-left group"
              >
                <span className={`font-bold text-lg transition-colors ${openIndex === index ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                  {faq.question}
                </span>
                <span className={`p-2 rounded-full transition-all ${openIndex === index ? 'bg-orion-purple text-white rotate-180' : 'bg-white/5 text-gray-400 group-hover:bg-white/10'}`}>
                   {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-400 leading-relaxed font-light border-t border-white/5 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;