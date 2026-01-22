import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banners: React.FC = () => {
  const { banners } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    return null; // Don't render if no banners
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="py-8 bg-transparent">
        <div className="container mx-auto px-6">
            {/* 
                AspectRatio Changes:
                Mobile: 1080/1350 is approx 0.8. Using standard vertical aspect.
                Desktop: 1920/800 is approx 2.4. 
                Using tailwind aspect utilities or arbitrary values to match exact suggestions.
            */}
            <div className="relative w-full aspect-[1080/1350] md:aspect-[1920/800] overflow-hidden rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-black/50 transition-all duration-300">
                {banners.map((banner, index) => (
                    <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    >
                    {/* Picture tag for Responsive Images */}
                    <picture className="w-full h-full block">
                        <source media="(max-width: 768px)" srcSet={banner.mobileUrl || banner.desktopUrl} />
                        <source media="(min-width: 769px)" srcSet={banner.desktopUrl} />
                        <img
                        src={banner.desktopUrl}
                        alt={banner.title || 'Banner'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                        />
                    </picture>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {banner.title && (
                        <div className="absolute bottom-8 left-0 w-full text-center px-4">
                            <h3 className="text-xl md:text-3xl font-display font-bold text-white tracking-widest uppercase drop-shadow-lg">
                                {banner.title}
                            </h3>
                        </div>
                    )}
                    </div>
                ))}

                {/* Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors border border-white/10 backdrop-blur-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors border border-white/10 backdrop-blur-sm"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'bg-orion-accent w-6' : 'bg-white/30'
                            }`}
                        />
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>
    </section>
  );
};

export default Banners;