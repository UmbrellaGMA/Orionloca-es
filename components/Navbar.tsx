import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { contactInfo } = useData();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl transition-all duration-500 rounded-full border ${
        scrolled 
          ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl py-3 px-6 md:px-8' 
          : 'bg-transparent border-transparent py-4 px-4 md:px-6'
      }`}
    >
      <div className="flex items-center justify-between">

        {/* Logo / Wordmark */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="hover:scale-105 transition-transform"
          aria-label="Orion Locações"
        >
          {contactInfo.logoUrl ? (
            <img src={contactInfo.logoUrl} alt="Orion Locações" className="h-8 md:h-12 object-contain" />
          ) : (
            <span className="font-display text-xl tracking-[0.2em] text-white">ORION</span>
          )}
        </a>

        {/* Links — clean, sem ícones */}
        <nav className="hidden md:flex items-center gap-10" role="navigation">
          {[
            ['Catálogo', '#catalogo'],
            ['Eventos',  '#reels'],
            ['Dúvidas',  '#faq'],
            ['Contato',  '#contato'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="t-label text-[10px] text-[var(--muted)] hover:text-white transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank')}
            className="btn btn-primary text-[10px] md:text-xs px-5 py-2.5 md:px-7 md:py-3 !rounded-full shadow-lg shadow-[var(--purple)]/20"
          >
            Orçamento
          </button>

          {/* Acesso admin totalmente invisível */}
          <span
            onClick={() => { window.location.hash = 'admin'; }}
            className="w-4 h-4 rounded-full bg-transparent cursor-default select-none"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;