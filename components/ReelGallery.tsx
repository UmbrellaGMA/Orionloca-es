import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, VolumeX, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';

const REELS = [
  { id: '1', url: '/videos/dj_1.mp4', label: 'Festival Stage' },
  { id: '2', url: '/videos/video_3.mp4', label: 'Corporate Event' },
  { id: '3', url: '/videos/video_2.mp4', label: 'Wedding Party' },
];

const ReelGallery: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Intercept intersection to auto-pause when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && entry.target instanceof HTMLVideoElement) {
            entry.target.pause();
            if (playing === entry.target.id) setPlaying(null);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(videoRefs.current).forEach((v: HTMLVideoElement | null) => {
      if (v) observer.observe(v);
    });

    return () => observer.disconnect();
  }, [playing]);

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playing === id) {
      video.pause();
      setPlaying(null);
    } else {
      // Pause others
      Object.values(videoRefs.current).forEach((v: HTMLVideoElement | null) => {
        if (v && v.id !== id) {
          v.pause();
        }
      });
      video.play();
      setPlaying(id);
    }
  };

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="reels" className="py-24 md:py-32 relative bg-[var(--bg)]">
      
      {/* Background glow sutil */}
      <div className="absolute inset-0 bg-glow-right opacity-40 pointer-events-none" />

      <div className="wrap">
        
        {/* Cabeçalho */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="t-label mb-4 inline-block">Galeria</span>
            <h2 className="t-heading text-4xl md:text-5xl">Eventos Reais</h2>
          </div>
          
          {/* Navegação Manual */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-[var(--border2)] flex items-center justify-center text-white hover:bg-[var(--surface)] transition-colors"
              aria-label="Anterior"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-[var(--border2)] flex items-center justify-center text-white hover:bg-[var(--surface)] transition-colors"
              aria-label="Próximo"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Carrossel de Reels */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto hide-scroll gap-6 pb-8 snap-x snap-mandatory"
        >
          {REELS.map((reel) => (
            <div 
              key={reel.id} 
              className="relative shrink-0 w-[280px] md:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden bg-[var(--surface)] snap-center group border border-[var(--border2)]"
            >
              <video
                id={reel.id}
                ref={(el) => { videoRefs.current[reel.id] = el; }}
                src={reel.url}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={muted}
                playsInline
              />

              {/* Controles Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10 transition-opacity">
                
                <button
                  onClick={() => togglePlay(reel.id)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                  <div className={`w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 ${playing === reel.id ? 'opacity-0 scale-90' : 'opacity-100 scale-100 group-hover:bg-[var(--purple)]'}`}>
                    <Play fill="currentColor" size={24} className="ml-1" />
                  </div>
                </button>

                {/* Footer do Card */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <span className="t-display text-white font-semibold">{reel.label}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelGallery;