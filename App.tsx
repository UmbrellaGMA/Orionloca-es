

import React, { Component, useState, useEffect, ReactNode } from 'react';
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
import { DataProvider, useData } from './contexts/DataContext';
import { Rocket } from 'lucide-react';

interface EBProps { children?: ReactNode; }
interface EBState { hasError: boolean; }

class ErrorBoundary extends Component<EBProps, EBState> {
  declare state: EBState;
  declare props: EBProps;

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
  const { error } = useData();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Dobra 1: Hero Animado */}
        <Hero />
        
        {/* Dobra 2: Promoções / Banners */}
        <Banners />

        {/* Notificação de Erro Elegante */}
        {error && (
          <div className="wrap py-8">
            <div className="border border-red-500/20 bg-red-500/5 text-red-400 p-4 rounded-xl text-center text-sm">
              <span className="t-label text-red-500 block mb-1">Aviso do Sistema</span>
              {error}
            </div>
          </div>
        )}

        {/* Dobra 3: Equipamentos / Catálogo */}
        <Portfolio />
        
        {/* Dobra 4: Carrossel (Reel Gallery) */}
        <ReelGallery />
        
        {/* Dobra 5: FAQ */}
        <FAQ />
      </main>
      
      {/* Dobra 6: Rodapé */}
      <Footer />
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
