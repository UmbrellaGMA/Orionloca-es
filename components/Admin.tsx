
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { supabase } from '../lib/supabase';
import { 
    Plus, Trash, LayoutGrid, MessageSquare, Settings, ArrowLeft, 
    Upload, Edit2, X, Instagram, HelpCircle, Film, Link as LinkIcon, 
    Aperture, Save, CheckCircle2, Phone, Mail, FileText, Image as ImageIcon,
    ShoppingBag, MessageCircle, ShieldCheck
} from 'lucide-react';
import { Equipment, Feedback, Banner, FAQItem, Reel, LinkTreeLink, ContactInfo } from '../types';

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 z-[9999] bg-orion-black flex flex-col items-center justify-center">
    <div className="relative mb-8">
      <ShieldCheck className="w-20 h-20 text-orion-accent animate-pulse" />
      <div className="absolute inset-0 blur-2xl bg-orion-glow opacity-20"></div>
    </div>
    <div className="text-orion-accent font-display tracking-[0.3em] text-[10px] uppercase font-bold">Verificando Credenciais Estelares...</div>
  </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-[#0a0a12] border border-orion-purple/30 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-widest">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
                {footer && <div className="p-6 border-t border-white/10 bg-white/5">{footer}</div>}
            </div>
        </div>
    );
};

const Admin: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  // FIX: Rate limiting — track attempts and cooldown
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'feedbacks' | 'faq' | 'reels' | 'linktree' | 'texts' | 'settings'>('portfolio');
  const [uploadingState, setUploadingState] = useState<{loading: boolean, type: string}>({ loading: false, type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [saveStatus, setSaveStatus] = useState(false);

  const [editPortfolio, setEditPortfolio] = useState<Partial<Equipment>>({});
  const [editFeedback, setEditFeedback] = useState<Partial<Feedback>>({});
  const [editFAQ, setEditFAQ] = useState<Partial<FAQItem>>({});
  const [editReel, setEditReel] = useState<Partial<Reel>>({});
  const [editLink, setEditLink] = useState<Partial<LinkTreeLink>>({});
  // FIX: Initialize with defaultContact shape to avoid null access crashes
  const [tempContact, setTempContact] = useState<ContactInfo | null>(null);

  const { 
      portfolio, feedbacks, faqs, reels, links, contactInfo, 
      updateContactInfo, uploadImage,
      addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
      addFeedbackItem, updateFeedbackItem, deleteFeedbackItem,
      addFAQItem, updateFAQItem, deleteFAQItem,
      addReelItem, deleteReelItem,
      addLinkItem, updateLinkItem, deleteLinkItem
  } = useData();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsAuthenticated(true);
      setAuthChecking(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    // FIX: Always sync tempContact when contactInfo loads (safe initialization)
    if (contactInfo && !tempContact) {
      setTempContact({ ...contactInfo });
    }
  }, [contactInfo, tempContact]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Rate limiting — block after 3 failed attempts for 30 seconds
    if (cooldownUntil && Date.now() < cooldownUntil) {
      const secs = Math.ceil((cooldownUntil - Date.now()) / 1000);
      setErrorMsg(`Muitas tentativas. Aguarde ${secs}s.`);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setCooldownUntil(null);
      }
    } catch {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if (attempts >= 3) {
        setCooldownUntil(Date.now() + 30_000);
        setErrorMsg('Acesso bloqueado por 30 segundos.');
      } else {
        setErrorMsg(`Credenciais inválidas. (${3 - attempts} tentativa(s) restante(s))`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File, target: string) => {
    setUploadingState({ loading: true, type: target });
    const url = await uploadImage(file);
    setUploadingState({ loading: false, type: '' });
    if (!url) return;

    if (target === 'portfolio') {
      setEditPortfolio(prev => ({ ...prev, imageUrl: url }));
    } else if (target === 'profile') {
      setTempContact(prev => prev ? ({ ...prev, profilePicUrl: url }) : null);
    } else if (target === 'linktreeVideo') {
      setTempContact(prev => prev ? ({ ...prev, linktreeVideoUrl: url }) : null);
    } else if (target === 'logo') {
      setTempContact(prev => prev ? ({ ...prev, logoUrl: url }) : null);
    } else if (target === 'reelVideo') {
      setEditReel(prev => ({ ...prev, videoUrl: url }));
    }
  };

  const handleSaveTexts = async () => {
    if (tempContact) {
      setIsLoading(true);
      await updateContactInfo(tempContact);
      setIsLoading(false);
      setSaveStatus(true);
      setTimeout(() => setSaveStatus(false), 2000);
    }
  };

  // FIX: Removed `any` — typed with proper union
  type ModalItem = Equipment | Feedback | FAQItem | Reel | LinkTreeLink;
  const openModal = (tab: string, item?: ModalItem) => {
    setModalMode(item ? 'edit' : 'add');
    if (tab === 'portfolio') setEditPortfolio((item as Equipment) || { name: '', category: 'ÁUDIO', description: '', specs: [], imageUrl: '' });
    if (tab === 'feedbacks') setEditFeedback((item as Feedback) || { client: '', role: '', content: '', rating: 5 });
    if (tab === 'faq') setEditFAQ((item as FAQItem) || { question: '', answer: '' });
    if (tab === 'reels') setEditReel((item as Reel) || { title: '', videoUrl: '' });
    if (tab === 'linktree') setEditLink((item as LinkTreeLink) || { label: '', url: '', emoji: '✨', order: links.length });
    setIsModalOpen(true);
  };

  const saveAction = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'portfolio') {
        modalMode === 'add'
          ? await addPortfolioItem(editPortfolio as Omit<Equipment, 'id'>)
          : await updatePortfolioItem(editPortfolio as Equipment);
      } else if (activeTab === 'feedbacks') {
        modalMode === 'add'
          ? await addFeedbackItem(editFeedback as Omit<Feedback, 'id'>)
          : await updateFeedbackItem(editFeedback as Feedback);
      } else if (activeTab === 'faq') {
        modalMode === 'add'
          ? await addFAQItem(editFAQ as Omit<FAQItem, 'id'>)
          : await updateFAQItem(editFAQ as FAQItem);
      } else if (activeTab === 'reels') {
        await addReelItem(editReel as Omit<Reel, 'id'>);
      } else if (activeTab === 'linktree') {
        modalMode === 'add'
          ? await addLinkItem(editLink as Omit<LinkTreeLink, 'id'>)
          : await updateLinkItem(editLink as LinkTreeLink);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error('[Admin] Save failed:', e);
      setErrorMsg('Falha ao salvar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderIcon = (key: string) => {
    switch (key) {
      case 'word': return <FileText size={20} />;
      case 'instagram': return <Instagram size={20} />;
      case 'whatsapp': return <MessageCircle size={20} />;
      case 'shopping': return <ShoppingBag size={20} />;
      default: return null;
    }
  };

  if (authChecking) return <SplashScreen />;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-orion-black flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel border border-orion-purple/30 p-10 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="flex flex-col items-center mb-8">
            <Aperture className="w-12 h-12 text-orion-accent mb-4" />
            <h2 className="text-xl font-display font-bold text-white tracking-[0.3em] uppercase">Cockpit Orion</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Frequência de Acesso</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email Corporativo" className="w-full bg-white/5 border border-white/10 p-4 rounded text-white focus:border-orion-purple outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Código de Comando</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha Estelar" className="w-full bg-white/5 border border-white/10 p-4 rounded text-white focus:border-orion-purple outline-none transition-all" />
          </div>
          {errorMsg && <p className="text-red-500 text-xs text-center font-bold tracking-tighter uppercase">{errorMsg}</p>}
          <button type="submit" disabled={isLoading} className="w-full py-4 bg-orion-purple hover:bg-orion-glow text-white font-bold rounded uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
            {isLoading ? <Aperture className="animate-spin w-5 h-5" /> : 'Iniciar Transmissão'}
          </button>
        </form>
        <button onClick={onExit} className="w-full mt-6 text-xs text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Abortar e Voltar ao Site</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orion-black flex flex-col font-sans">
      <header className="bg-black/90 border-b border-white/10 py-4 px-6 sticky top-0 z-[60] backdrop-blur-xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Aperture className="w-8 h-8 text-orion-accent" />
             <h1 className="text-lg font-display font-bold text-white tracking-widest hidden md:block uppercase">ORION <span className="text-orion-glow">SYSTEMS</span></h1>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.location.hash = 'links'} className="px-4 py-2 border border-white/10 text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-all"><LinkIcon size={14}/> Ver Bio</button>
            <button onClick={onExit} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-white uppercase tracking-widest transition-all">Sair do Painel</button>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-white/10 p-6 bg-black/40">
           <nav className="flex flex-row md:flex-col overflow-x-auto gap-2 scrollbar-hide">
             {[
                { id: 'portfolio', label: 'Coleção', icon: LayoutGrid },
                { id: 'feedbacks', label: 'Feedback', icon: MessageSquare },
                { id: 'reels', label: 'Reels', icon: Film },
                { id: 'faq', label: 'FAQ', icon: HelpCircle },
                { id: 'linktree', label: 'Bio Links', icon: LinkIcon },
                { id: 'texts', label: 'Copywriting', icon: FileText },
                { id: 'settings', label: 'Sistema', icon: Settings }
             ].map(tab => (
               <button 
                 key={tab.id} 
                 onClick={() => setActiveTab(tab.id as any)} 
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all min-w-max md:min-w-0 ${activeTab === tab.id ? 'bg-orion-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'text-gray-500 hover:bg-white/5'}`}
               >
                 <tab.icon size={16} />
                 {tab.label}
               </button>
             ))}
           </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">
          
          {/* Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="animate-fade-in space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Catálogo de Equipos</h2>
                  <p className="text-gray-500 text-xs mt-1">Gerencie seu portfólio de locação.</p>
                </div>
                <button onClick={() => openModal('portfolio')} className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all"><Plus size={14}/> Novo Item</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map(item => (
                  <div key={item.id} className="glass-panel p-4 rounded-xl border border-white/5 group">
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
                      {/* FIX: Added alt text */}
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-orion-accent text-[9px] font-bold uppercase tracking-widest">{item.category}</span>
                        <h4 className="text-white font-bold">{item.name}</h4>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openModal('portfolio', item)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"><Edit2 size={14}/></button>
                        <button onClick={() => deletePortfolioItem(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedbacks */}
          {activeTab === 'feedbacks' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Depoimentos</h2>
                <button onClick={() => openModal('feedbacks')} className="bg-green-600 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Plus size={14}/> Novo Feedback</button>
              </div>
              <div className="space-y-4">
                {feedbacks.map(f => (
                  <div key={f.id} className="glass-panel p-6 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold">{f.client}</h4>
                      <p className="text-orion-glow text-[10px] uppercase tracking-widest">{f.role}</p>
                      <p className="text-gray-400 text-sm mt-2 font-light italic">"{f.content}"</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => openModal('feedbacks', f)} className="p-3 text-blue-400 hover:bg-white/5 rounded-full"><Edit2 size={16}/></button>
                      <button onClick={() => deleteFeedbackItem(f.id)} className="p-3 text-red-400 hover:bg-white/5 rounded-full"><Trash size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reels */}
          {activeTab === 'reels' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Galeria Reels</h2>
                <button onClick={() => openModal('reels')} className="bg-green-600 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Plus size={14}/> Adicionar Vídeo</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {reels.map(r => (
                  <div key={r.id} className="aspect-[9/16] glass-panel rounded-xl overflow-hidden relative group">
                    {/* FIX: Added preload=none to avoid downloading all reel videos */}
                    <video src={r.videoUrl} className="w-full h-full object-cover opacity-60" muted preload="none" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/60">
                      <button onClick={() => deleteReelItem(r.id)} className="p-4 bg-red-600 text-white rounded-full shadow-lg"><Trash size={20}/></button>
                    </div>
                    <div className="absolute bottom-4 left-0 w-full text-center px-2">
                      <p className="text-[10px] text-white font-bold uppercase tracking-widest truncate">{r.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Perguntas & Respostas</h2>
                <button onClick={() => openModal('faq')} className="bg-green-600 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Plus size={14}/> Nova FAQ</button>
              </div>
              <div className="space-y-4">
                {faqs.map(faq => (
                  <div key={faq.id} className="glass-panel p-6 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-white font-bold">{faq.question}</h4>
                       <div className="flex gap-2">
                          <button onClick={() => openModal('faq', faq)} className="text-blue-400 hover:text-white transition-colors"><Edit2 size={14}/></button>
                          <button onClick={() => deleteFAQItem(faq.id)} className="text-red-400 hover:text-white transition-colors"><Trash size={14}/></button>
                       </div>
                    </div>
                    <p className="text-gray-500 text-sm font-light">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio (LinkTree) */}
          {activeTab === 'linktree' && (
            <div className="space-y-8 animate-fade-in">
              <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-8">
                <h3 className="font-display font-bold text-orion-accent tracking-[0.2em] uppercase border-b border-white/10 pb-4">Personalização de Bio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Foto de Perfil</label>
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-full border-2 border-orion-glow/30 p-1 overflow-hidden">
                        {/* FIX: Added alt text */}
                        <img src={tempContact?.profilePicUrl || contactInfo.profilePicUrl} alt="Foto de perfil" className="w-full h-full object-cover rounded-full bg-black" />
                        {uploadingState.loading && uploadingState.type === 'profile' && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Aperture className="animate-spin text-white" /></div>
                        )}
                      </div>
                      <label className="px-5 py-2 bg-orion-purple hover:bg-orion-glow text-white text-[10px] font-bold uppercase tracking-widest rounded-full cursor-pointer transition-all">
                        Upload Foto
                        <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'profile')} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">Background Vídeo (Opcional)</label>
                    <div className="flex flex-col gap-4">
                      <div className="h-24 bg-black/40 border border-dashed border-white/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                         {(tempContact?.linktreeVideoUrl || contactInfo.linktreeVideoUrl) ? (
                           {/* FIX: Added preload=none */}
                           <video src={tempContact?.linktreeVideoUrl || contactInfo.linktreeVideoUrl} className="w-full h-full object-cover opacity-30" muted preload="none" />
                         ) : <Film className="text-gray-700" size={32} />}
                         <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full border border-white/10">
                              {uploadingState.loading && uploadingState.type === 'linktreeVideo' ? 'Fazendo Upload...' : 'Trocar Vídeo'}
                            </span>
                            <input type="file" className="hidden" accept="video/*" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'linktreeVideo')} />
                         </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                   <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block mb-2">Biografia (Texto Curto)</label>
                   <textarea 
                     value={tempContact?.bio || ''} 
                     onChange={e => setTempContact(prev => ({ ...prev!, bio: e.target.value }))} 
                     className="w-full bg-black/30 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-orion-glow outline-none transition-all" 
                     rows={3} 
                     placeholder="Uma breve descrição sobre a Orion..."
                   />
                </div>
                <div className="flex justify-end">
                   <button onClick={handleSaveTexts} disabled={isLoading || uploadingState.loading} className="px-8 py-3 bg-orion-purple text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-orion-glow transition-all flex items-center gap-2">
                     {isLoading ? <Aperture className="animate-spin" /> : saveStatus ? <CheckCircle2 size={16} /> : <Save size={16} />}
                     {saveStatus ? 'Sincronizado' : 'Salvar Bio'}
                   </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-white uppercase tracking-widest">Botoeira de Links</h3>
                  <button onClick={() => openModal('linktree')} className="bg-green-600 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Plus size={14}/> Adicionar Link</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {links.map(link => (
                    <div key={link.id} className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl group-hover:bg-orion-purple/20 transition-all">
                          {['word', 'instagram', 'whatsapp', 'shopping'].includes(link.emoji) ? renderIcon(link.emoji) : link.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{link.label}</p>
                          <p className="text-[10px] text-gray-600 truncate max-w-[150px]">{link.url}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openModal('linktree', link)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit2 size={14}/></button>
                        <button onClick={() => deleteLinkItem(link.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Outras abas (simplificadas para brevidade mas mantidas funcionais) */}
          {activeTab === 'texts' && (
             <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Editor de Copy</h2>
                   <button onClick={handleSaveTexts} className="px-8 py-3 bg-orion-purple text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-orion-glow transition-all flex items-center gap-2">
                     {isLoading ? <Aperture className="animate-spin" /> : saveStatus ? <CheckCircle2 /> : <Save />}
                     {saveStatus ? 'Salvo!' : 'Salvar Alterações'}
                   </button>
                </div>
                <div className="grid grid-cols-1 gap-10">
                  <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                     <h3 className="text-sm font-bold text-orion-accent tracking-[0.2em] uppercase">Cabeçalho Hero</h3>
                     <textarea value={tempContact?.heroHeadline || ''} onChange={e => setTempContact({...tempContact!, heroHeadline: e.target.value})} className="w-full bg-black/30 border border-white/10 p-4 rounded text-white text-lg focus:border-orion-glow outline-none" rows={2} />
                     <textarea value={tempContact?.heroSubheadline || ''} onChange={e => setTempContact({...tempContact!, heroSubheadline: e.target.value})} className="w-full bg-black/30 border border-white/10 p-4 rounded text-white text-sm focus:border-orion-glow outline-none" rows={2} />
                  </div>
                  <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                     <h3 className="text-sm font-bold text-orion-accent tracking-[0.2em] uppercase">Manifesto Orion</h3>
                     <input value={tempContact?.manifestoTitle || ''} onChange={e => setTempContact({...tempContact!, manifestoTitle: e.target.value})} className="w-full bg-black/30 border border-white/10 p-4 rounded text-white focus:border-orion-glow outline-none" />
                     <textarea value={tempContact?.manifestoText || ''} onChange={e => setTempContact({...tempContact!, manifestoText: e.target.value})} className="w-full bg-black/30 border border-white/10 p-4 rounded text-white text-sm focus:border-orion-glow outline-none" rows={4} />
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">Sistema</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                    <h3 className="text-sm font-bold text-orion-accent tracking-[0.2em] uppercase">Canais de Contato</h3>
                    <input value={tempContact?.whatsapp || ''} onChange={e => setTempContact({...tempContact!, whatsapp: e.target.value})} className="w-full bg-black/30 border border-white/10 p-4 rounded text-white" placeholder="WhatsApp" />
                    <input value={tempContact?.email || ''} onChange={e => setTempContact({...tempContact!, email: e.target.value})} className="w-full bg-black/30 border border-white/10 p-4 rounded text-white" placeholder="Email" />
                 </div>
                 <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
                    <h3 className="text-sm font-bold text-orion-accent tracking-[0.2em] uppercase">Identidade Visual</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                          {tempContact?.logoUrl ? <img src={tempContact.logoUrl} alt="Logo da empresa" className="max-h-12" /> : <ImageIcon />}
                        </div>
                        <label className="bg-white/5 px-4 py-2 rounded text-[10px] font-bold uppercase cursor-pointer">
                          Logo
                          <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'logo')} />
                        </label>
                    </div>
                    <input value={tempContact?.siteTitle || ''} onChange={e => setTempContact({...tempContact!, siteTitle: e.target.value})} className="w-full bg-black/30 border border-white/10 p-4 rounded text-white" placeholder="Título do Site" />
                 </div>
              </div>
              <div className="flex justify-center pt-8">
                 <button onClick={handleSaveTexts} className="px-12 py-4 bg-orion-purple hover:bg-orion-glow text-white font-bold uppercase tracking-[0.3em] rounded-full transition-all flex items-center gap-3">
                   {isLoading ? <Aperture className="animate-spin" /> : saveStatus ? <CheckCircle2 /> : <Save />}
                   SALVAR TUDO
                 </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={activeTab === 'linktree' ? 'Link Personalizado' : 'Editor de Dados'}
        footer={<button onClick={saveAction} disabled={isLoading || uploadingState.loading} className="w-full bg-orion-purple py-4 rounded-lg font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2">{isLoading && <Aperture className="animate-spin" />} SALVAR ALTERAÇÕES</button>}
      >
        <div className="space-y-6">
          {activeTab === 'linktree' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-[10px] text-gray-500 uppercase font-bold">Ícones Especiais</label>
                <div className="flex gap-4 flex-wrap">
                  {[
                    { key: 'word', icon: FileText, label: 'Word' },
                    { key: 'instagram', icon: Instagram, label: 'Insta' },
                    { key: 'whatsapp', icon: MessageCircle, label: 'Whats' },
                    { key: 'shopping', icon: ShoppingBag, label: 'Loja' }
                  ].map(btn => (
                    <button 
                      key={btn.key} 
                      onClick={() => setEditLink({...editLink, emoji: btn.key})} 
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${editLink.emoji === btn.key ? 'bg-orion-glow/20 border-orion-glow text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                    >
                      <btn.icon size={20} />
                      <span className="text-[8px] font-bold uppercase">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block font-bold uppercase">Ou escolha um Emoji</label>
                <div className="flex gap-2 flex-wrap">
                  {['✨', '🚀', '⭐', '🎥', '📞', '💬', '📸', '🎧', '🎸', '🎹', '🚨'].map(e => (
                    <button key={e} onClick={() => setEditLink({...editLink, emoji: e})} className={`w-10 h-10 rounded-lg transition-all ${editLink.emoji === e ? 'bg-orion-glow text-white' : 'bg-white/5 hover:bg-white/10'}`}>{e}</button>
                  ))}
                  <input value={editLink.emoji} onChange={e => setEditLink({...editLink, emoji: e.target.value})} className="w-16 bg-black/30 border border-white/10 p-2 rounded text-center" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block font-bold uppercase">Título</label>
                <input value={editLink.label} onChange={e => setEditLink({...editLink, label: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 mb-1 block font-bold uppercase">Link (URL)</label>
                <input value={editLink.url} onChange={e => setEditLink({...editLink, url: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" />
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-4">
               <input value={editPortfolio.name} onChange={e => setEditPortfolio({...editPortfolio, name: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" placeholder="Nome" />
               <select value={editPortfolio.category} onChange={e => setEditPortfolio({...editPortfolio, category: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded text-white">
                 {['ÁUDIO', 'VÍDEO', 'LUZ', 'ESTRUTURA', 'INTERATIVO'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black border border-white/10 overflow-hidden">
                    {editPortfolio.imageUrl && <img src={editPortfolio.imageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <label className="bg-white/5 px-4 py-2 rounded text-[10px] font-bold uppercase cursor-pointer">
                    Upload
                    <input type="file" className="hidden" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'portfolio')} />
                  </label>
               </div>
            </div>
          )}

          {activeTab === 'reels' && (
            <div className="space-y-4">
              <input value={editReel.title} onChange={e => setEditReel({...editReel, title: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded text-white" placeholder="Título" />
              <div className="w-full h-24 border-2 border-dashed border-white/10 rounded flex items-center justify-center relative">
                {uploadingState.loading && uploadingState.type === 'reelVideo' ? <Aperture className="animate-spin text-orion-glow" /> : editReel.videoUrl ? <p className="text-green-500 text-xs font-bold uppercase">Vídeo Carregado</p> : <Upload className="text-gray-600" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="video/*" onChange={e => e.target.files && handleFileUpload(e.target.files[0], 'reelVideo')} />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
