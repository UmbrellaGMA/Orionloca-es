import React from 'react';
import { useData } from '../contexts/DataContext';
import { Quote, Star } from 'lucide-react';

const Feedbacks: React.FC = () => {
  const { feedbacks } = useData();

  return (
    <section className="py-24 relative z-10">
       <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
              FEEDBACKS
            </h2>
            <p className="text-gray-400">O impacto causado em quem já viajou conosco.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbacks.map((item) => (
              <div key={item.id} className="relative p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-sm hover:border-orion-purple/50 transition-colors duration-500 group">
                 {/* Decorative corners */}
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-orion-accent/30 group-hover:border-orion-accent transition-colors duration-500"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orion-accent/30 group-hover:border-orion-accent transition-colors duration-500"></div>

                 <Quote className="w-8 h-8 text-orion-purple mb-6 opacity-50" />
                 
                 <p className="text-gray-300 mb-8 leading-relaxed font-light italic min-h-[80px]">
                   "{item.content}"
                 </p>
                 
                 <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div>
                      <h4 className="font-bold text-white font-display text-sm tracking-wider">{item.client}</h4>
                      <span className="text-xs text-orion-glow uppercase tracking-widest">{item.role}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-orion-accent fill-orion-accent" />
                      ))}
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