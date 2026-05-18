
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Equipment, Feedback, ContactInfo, Banner, FAQItem, Reel, LinkTreeLink } from '../types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  portfolio: Equipment[];
  feedbacks: Feedback[];
  banners: Banner[];
  faqs: FAQItem[];
  reels: Reel[];
  links: LinkTreeLink[];
  contactInfo: ContactInfo;
  isLoading: boolean;
  // FIX: Added error state so UI can react to failures
  error: string | null;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
  addPortfolioItem: (item: Omit<Equipment, 'id'>) => Promise<void>;
  updatePortfolioItem: (item: Equipment) => Promise<void>;
  deletePortfolioItem: (id: number) => Promise<void>;
  addFeedbackItem: (item: Omit<Feedback, 'id'>) => Promise<void>;
  updateFeedbackItem: (item: Feedback) => Promise<void>;
  deleteFeedbackItem: (id: number) => Promise<void>;
  addBannerItem: (item: Omit<Banner, 'id'>) => Promise<void>;
  deleteBannerItem: (id: number) => Promise<void>;
  addFAQItem: (item: Omit<FAQItem, 'id'>) => Promise<void>;
  updateFAQItem: (item: FAQItem) => Promise<void>;
  deleteFAQItem: (id: number) => Promise<void>;
  addReelItem: (item: Omit<Reel, 'id'>) => Promise<void>;
  deleteReelItem: (id: number) => Promise<void>;
  addLinkItem: (item: Omit<LinkTreeLink, 'id'>) => Promise<void>;
  updateLinkItem: (item: LinkTreeLink) => Promise<void>;
  deleteLinkItem: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const defaultContact: ContactInfo = {
  email: "contato@orionlocacoes.com",
  whatsapp: "5513996010650",
  whatsappDisplay: "13 99601-0650",
  instagram: "#",
  linkedin: "#",
  siteTitle: "Orion Locações",
  bio: "Experiências Digitais & Engenharia de Emoções"
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Equipment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [links, setLinks] = useState<LinkTreeLink[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContact);
  const [isLoading, setIsLoading] = useState(true);
  // FIX: Error state for user-visible feedback
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        { data: portfolioData, error: e1 },
        { data: feedbacksData, error: e2 },
        { data: bannersData, error: e3 },
        { data: faqData, error: e4 },
        { data: reelsData, error: e5 },
        { data: linksData, error: e6 },
        { data: contactData, error: e7 }
      ] = await Promise.all([
        supabase.from('portfolio').select('*').order('id'),
        supabase.from('feedbacks').select('*').order('id'),
        supabase.from('banners').select('*').order('id'),
        supabase.from('faq').select('*').order('id'),
        supabase.from('reels').select('id, videoUrl:video_url, title').order('created_at', { ascending: false }),
        supabase.from('linktree_links').select('*').order('order', { ascending: true }),
        supabase.from('contact_info').select('*').eq('id', 1).single()
      ]);

      // FIX: Check individual query errors and surface them
      const firstError = e1 || e2 || e3 || e4 || e5 || e6;
      if (firstError) {
        console.error('[DataContext] Query error:', firstError.message);
        setError('Falha ao carregar dados. Tente novamente.');
      }

      if (portfolioData) setPortfolio(portfolioData);
      if (feedbacksData) setFeedbacks(feedbacksData);
      if (bannersData) setBanners(bannersData);
      if (faqData) setFaqs(faqData);
      if (reelsData) setReels(reelsData);
      if (linksData) setLinks(linksData);
      // contact_info returns PGRST116 when row doesn't exist — use default silently
      if (contactData && !e7) setContactInfo({ ...defaultContact, ...contactData });

    } catch (err) {
      console.error('[DataContext] Unexpected error:', err);
      setError('Erro inesperado ao conectar com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FIX: All CRUD operations now check for errors before updating local state
  const addPortfolioItem = async (item: Omit<Equipment, 'id'>) => {
    const { data, error } = await supabase.from('portfolio').insert([item]).select();
    if (error) throw error;
    if (data) setPortfolio(prev => [...prev, data[0] as Equipment]);
  };

  const updatePortfolioItem = async (item: Equipment) => {
    const { error } = await supabase.from('portfolio').update(item).eq('id', item.id);
    if (error) throw error;
    setPortfolio(prev => prev.map(p => p.id === item.id ? item : p));
  };

  const deletePortfolioItem = async (id: number) => {
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (error) throw error;
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  const addFeedbackItem = async (item: Omit<Feedback, 'id'>) => {
    const { data, error } = await supabase.from('feedbacks').insert([item]).select();
    if (error) throw error;
    if (data) setFeedbacks(prev => [...prev, data[0] as Feedback]);
  };

  const updateFeedbackItem = async (item: Feedback) => {
    const { error } = await supabase.from('feedbacks').update(item).eq('id', item.id);
    if (error) throw error;
    setFeedbacks(prev => prev.map(f => f.id === item.id ? item : f));
  };

  const deleteFeedbackItem = async (id: number) => {
    const { error } = await supabase.from('feedbacks').delete().eq('id', id);
    if (error) throw error;
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const addBannerItem = async (item: Omit<Banner, 'id'>) => {
    const { data, error } = await supabase.from('banners').insert([item]).select();
    if (error) throw error;
    if (data) setBanners(prev => [...prev, data[0] as Banner]);
  };

  const deleteBannerItem = async (id: number) => {
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (error) throw error;
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const addFAQItem = async (item: Omit<FAQItem, 'id'>) => {
    const { data, error } = await supabase.from('faq').insert([item]).select();
    if (error) throw error;
    if (data) setFaqs(prev => [...prev, data[0] as FAQItem]);
  };

  const updateFAQItem = async (item: FAQItem) => {
    const { error } = await supabase.from('faq').update(item).eq('id', item.id);
    if (error) throw error;
    setFaqs(prev => prev.map(f => f.id === item.id ? item : f));
  };

  const deleteFAQItem = async (id: number) => {
    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (error) throw error;
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const addReelItem = async (item: Omit<Reel, 'id'>) => {
    const dbItem = { video_url: item.videoUrl, title: item.title };
    const { data, error } = await supabase.from('reels').insert([dbItem]).select('id, videoUrl:video_url, title');
    if (error) throw error;
    if (data) setReels(prev => [data[0] as Reel, ...prev]);
  };

  const deleteReelItem = async (id: number) => {
    const { error } = await supabase.from('reels').delete().eq('id', id);
    if (error) throw error;
    setReels(prev => prev.filter(r => r.id !== id));
  };

  const addLinkItem = async (item: Omit<LinkTreeLink, 'id'>) => {
    const { data, error } = await supabase.from('linktree_links').insert([item]).select();
    if (error) throw error;
    if (data) setLinks(prev => [...prev, data[0] as LinkTreeLink]);
  };

  const updateLinkItem = async (item: LinkTreeLink) => {
    const { error } = await supabase.from('linktree_links').update(item).eq('id', item.id);
    if (error) throw error;
    setLinks(prev => prev.map(l => l.id === item.id ? item : l));
  };

  const deleteLinkItem = async (id: number) => {
    const { error } = await supabase.from('linktree_links').delete().eq('id', id);
    if (error) throw error;
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const updateContactInfo = async (info: ContactInfo) => {
    const { error } = await supabase.from('contact_info').upsert({ ...info, id: 1 });
    if (error) throw error;
    setContactInfo(info);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-z0-9]/gi, '_')}`;
      const { error } = await supabase.storage.from('uploads').upload(fileName, file);
      if (error) {
        console.error('[uploadImage] Storage error:', error.message);
        return null;
      }
      const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.error('[uploadImage] Unexpected error:', err);
      return null;
    }
  };

  return (
    <DataContext.Provider value={{
      portfolio, feedbacks, banners, faqs, reels, links, contactInfo, isLoading, error,
      updateContactInfo, uploadImage, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
      addFeedbackItem, updateFeedbackItem, deleteFeedbackItem,
      addBannerItem, deleteBannerItem, addFAQItem, updateFAQItem, deleteFAQItem,
      addReelItem, deleteReelItem, addLinkItem, updateLinkItem, deleteLinkItem,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
