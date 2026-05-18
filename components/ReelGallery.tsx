import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';

const ReelGallery: React.FC = () => {
  const { reels } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // FIX: Early return BEFORE useEffect hooks would violate rules-of-hooks.
  // Instead, guard the effect body with the condition check.
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    // Guard: don't run if no container or no reels
    if (!scrollContainer || !reels || reels.length === 0) return;

    let animationFrameId: number;
    const speed = 0.5;

    const step = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += speed;
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [reels, isPaused]);

  // Correct placement: after hooks, before render
  if (!reels || reels.length === 0) return null;

  return (
    <section className="py-12 relative z-10 border-b border-white/5 bg-black/30">
      <div className="container mx-auto px-6 mb-8 text-center">
        <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase mb-2">
          Galeria <span className="text-orion-glow">Ao Vivo</span>
        </h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Registros reais de eventos estelares</p>
      </div>

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
            {/* FIX: preload="none" prevents downloading all videos on page load */}
            <video
              src={reel.videoUrl}
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-orion-purple/50 rounded-xl transition-colors pointer-events-none"></div>
            {reel.title && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <p className="text-white text-sm font-bold shadow-black drop-shadow-md">{reel.title}</p>
              </div>
            )}
          </div>
        ))}

        {/* Duplicate visually for seamless loop when list is short */}
        {reels.length < 5 && reels.map((reel) => (
          <div
            key={`dup-${reel.id}`}
            className="flex-shrink-0 relative w-[240px] md:w-[280px] aspect-[9/16] rounded-xl overflow-hidden border border-white/10 group bg-black/50 opacity-50 grayscale"
            aria-hidden="true"
          >
            <video
              src={reel.videoUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="none"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReelGallery;