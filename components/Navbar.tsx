import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { contactInfo } = useData();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-[#1E1E1E]' : 'bg-transparent'
      }`}
    >
      <div className="container-xl h-16 md:h-18 flex items-center justify-between">

        {/* Logo / Wordmark */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-display text-xl md:text-2xl tracking-widest text-white hover:text-[#A78BFA] transition-colors"
          style={{ letterSpacing: '0.15em' }}
          aria-label="Orion Locações"
        >
          {contactInfo.logoUrl ? (
            <img src={contactInfo.logoUrl} alt="Orion Locações" className="h-7 md:h-8 object-contain" />
          ) : (
            'ORION'
          )}
        </a>

        {/* Links — clean, sem ícones */}
        <nav className="hidden md:flex items-center gap-10" role="navigation">
          {[
            ['Coleção', '#collection'],
            ['Galeria',  '#reels'],
            ['FAQ',      '#faq'],
            ['Contato',  '#contact'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-heading text-[11px] font-600 uppercase tracking-[0.18em] text-[#555] hover:text-white transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA — só um, direto */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open(`https://wa.me/${contactInfo.whatsapp}`, '_blank')}
            className="btn btn-fill text-[10px] px-5 py-2.5 md:px-6 md:py-3"
          >
            Orçamento
          </button>

          {/* Acesso admin totalmente invisível */}
          <span
            onClick={() => { window.location.hash = 'admin'; }}
            className="w-1 h-1 rounded-full bg-transparent cursor-default select-none"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;