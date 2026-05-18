import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const { contactInfo } = useData();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setVisible(y < lastY || y < 80);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  const handleContact = () => {
    const msg = encodeURIComponent('Olá Orion! Gostaria de solicitar um orçamento.');
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      visible ? 'translate-y-0' : '-translate-y-full'
    } ${
      scrolled
        ? 'bg-orion-black/90 backdrop-blur-xl border-b border-white/5'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">

        {/* Logo */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 group"
          aria-label="Orion Locações — início"
        >
          {contactInfo.logoUrl ? (
            <img
              src={contactInfo.logoUrl}
              alt="Orion Locações"
              className="h-8 md:h-10 object-contain"
            />
          ) : (
            <span className="font-display font-black text-base md:text-lg tracking-[0.2em] text-white uppercase">
              ORION<span className="text-orion-glow">.</span>
            </span>
          )}
        </a>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Coleção', href: '#collection' },
            { label: 'Galeria', href: '#reels' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Contato', href: '#contact' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] font-bold uppercase tracking-[0.25em] text-orion-muted hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleContact}
            className="btn-primary text-[10px] px-5 py-2.5 md:px-7 md:py-3"
          >
            Orçamento
          </button>
          {/* Hidden admin access */}
          <button
            onClick={() => { window.location.hash = 'admin'; }}
            className="w-2 h-2 rounded-full bg-orion-purple/20 hover:bg-orion-purple/60 transition-colors"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;