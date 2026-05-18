

import React, { Component, useState, useEffect, ReactNode } from 'react';
import DOMPurify from 'dompurify';
import StarField from './components/StarField';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Banners from './components/Banners';
import Footer from './components/Footer';
import Admin from './components/Admin';
import ReelGallery from './components/ReelGallery';
import LinkTree from './components/LinkTree';
import FAQ from './components/FAQ';
import Feedbacks from './components/Feedbacks';
import FloatingContact from './components/FloatingContact';
import { DataProvider, useData } from './contexts/DataContext';
import { Aperture, Rocket } from 'lucide-react';

interface EBProps { children?: ReactNode; }
interface EBState { hasError: boolean; }

class ErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): EBState { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-orion-black flex items-center justify-center p-6 text-center">
          <div className="max-w-md glass-panel p-8 rounded-2xl border-orion-purple/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <h1 className="text-xl font-display font-bold text-orion-accent mb-4 uppercase tracking-widest">Erro de Sistema</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orion-purple text-white text-xs font-bold rounded-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              Reiniciar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainApp = () => {
  const { contactInfo, error } = useData();

  // FIX: Sanitize all HTML coming from DB before injecting (XSS prevention)
  const safeManifestoText = DOMPurify.sanitize(
    contactInfo.manifestoText || "Transformamos tecnologia em emoção pura, criando pontes entre o digital e o inesquecível."
  );

  return (
    <div className="animate-fade-in">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <section id="manifesto" className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="border-l-2 border-orion-purple/50 pl-6 md:pl-16 py-4 max-w-4xl">
              <h3 className="text-orion-accent text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold mb-4">
                {contactInfo.manifestoTitle || "Nossa Missão"}
              </h3>
              <p
                className="text-xl md:text-3xl font-light leading-relaxed text-gray-200"
                dangerouslySetInnerHTML={{ __html: safeManifestoText }}
              />
            </div>
          </div>
        </section>
        <Banners />
        <div className="border-y border-white/5 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Clientes", value: "500+" },
              { label: "Eventos", value: "700" },
              { label: "Sonhos", value: "1250+" },
              { label: "Gravações", value: "300+" }
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-2xl md:text-4xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FIX: Show data load error to user instead of silently showing empty state */}
        {error && (
          <div className="container mx-auto px-6 py-4">
            <p className="text-center text-xs text-red-400 uppercase tracking-widest border border-red-500/20 bg-red-500/5 py-3 rounded">
              {error}
            </p>
          </div>
        )}

        <Portfolio />
        <ReelGallery />
        <FAQ />
        <Feedbacks />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};

const Router = () => {
  const { isLoading } = useData();
  const [view, setView] = useState<'home' | 'admin' | 'links'>('home');

  useEffect(() => {
    const handleHash = (isInitialLoad = false) => {
      const h = window.location.hash;

      if (h === '#admin') {
        if (isInitialLoad) {
          setView('home');
          try {
            if (window.history?.replaceState) {
              window.history.replaceState(null, "", window.location.href.split('#')[0]);
            }
          } catch {
            console.warn("Acesso ao histórico restrito pelo navegador.");
          }
        } else {
          setView('admin');
        }
      } else if (h === '#links') {
        setView('links');
      } else {
        setView('home');
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    handleHash(true);

    const onHashChange = () => handleHash(false);
    window.addEventListener('hashchange', onHashChange);

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (isLoading) return (
    <div className="fixed inset-0 z-[9999] bg-orion-black flex flex-col items-center justify-center">
      <div className="relative mb-6">
        <Rocket className="w-12 h-12 text-orion-accent animate-bounce mb-4" aria-hidden="true" />
        <div className="absolute inset-0 blur-3xl bg-orion-purple/20 opacity-50"></div>
      </div>
      <div className="text-orion-accent font-display tracking-[0.5em] text-[10px] animate-pulse uppercase">Sincronizando Órbita...</div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-orion-black text-white selection:bg-orion-purple selection:text-white overflow-x-hidden">
      <StarField />
      <div className="relative z-10 flex flex-col min-h-screen">
        {view === 'admin' ? (
          <div className="animate-fade-in">
            <Admin onExit={() => {
              window.location.hash = '';
              setView('home');
            }} />
          </div>
        ) : view === 'links' ? (
          <div className="animate-fade-in"><LinkTree /></div>
        ) : (
          <MainApp />
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <Router />
      </DataProvider>
    </ErrorBoundary>
  );
}
