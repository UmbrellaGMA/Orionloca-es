import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';

const ReelGallery: React.FC = () => {
  const { reels } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !reels || reels.length === 0) return;

    let animationFrameId: number;
    const speed = 0.5; // Pixels per frame - adjust for speed

    const step = () => {
      if (!isPaused && scrollContainer) {
        // Increment scroll
        scrollContainer.scrollLeft += speed;

        // Reset if reached the end (approximate check to avoid float precision issues)
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [reels, isPaused]);

  if (!reels || reels.length === 0) return null;

  return (
    <section className="py-12 relative z-10 border-b border-white/5 bg-black/30">
        <div className="container mx-auto px-6 mb-8 text-center">
             <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase mb-2">
                 Galeria <span className="text-orion-glow">Ao Vivo</span>
             </h2>
             <p className="text-xs text-gray-500 uppercase tracking-widest">Registros reais de eventos estelares</p>
        </div>

        {/* 
            Removed 'snap-x' and 'snap-center' to allow smooth continuous Javascript scrolling.
            Added event listeners to pause on interaction.
        */}
        <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-8 px-6 scrollbar-hide"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {reels.map((reel) => (
                <div 
                    key={reel.id} 
                    className="flex-shrink-0 relative w-[240px] md:w-[280px] aspect-[9/16] rounded-xl overflow-hidden border border-white/10 group bg-black/50"
                >
                    <video 
                        src={reel.videoUrl}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    
                    {/* Decorative Border Glow */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-orion-purple/50 rounded-xl transition-colors pointer-events-none"></div>
                    
                    {/* Title (Optional) */}
                    {reel.title && (
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                            <p className="text-white text-sm font-bold shadow-black drop-shadow-md">{reel.title}</p>
                        </div>
                    )}
                </div>
            ))}
            
            {/* Duplicate content visually if list is short to ensure scrolling effect works better (Optional, logic handles reset) */}
            {reels.length < 5 && reels.map((reel) => (
                <div 
                    key={`dup-${reel.id}`} 
                    className="flex-shrink-0 relative w-[240px] md:w-[280px] aspect-[9/16] rounded-xl overflow-hidden border border-white/10 group bg-black/50 opacity-50 grayscale"
                >
                     <video 
                        src={reel.videoUrl}
                        className="w-full h-full object-cover"
                        muted 
                        playsInline
                    />
                </div>
            ))}
        </div>
    </section>
  );
};

export default ReelGallery;