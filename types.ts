export interface Equipment {
  id: number;
  name: string;
  category: string;
  description: string;
  specs: string[];
  imageUrl: string;
  images?: string[];
}

export interface Feedback {
  id: number;
  client: string;
  role: string;
  content: string;
  rating: number;
}

export interface Banner {
  id: number;
  desktopUrl: string;
  mobileUrl: string;
  title?: string;
  order?: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface Reel {
  id: number;
  videoUrl: string;
  title?: string;
}

export interface LinkTreeLink {
  id: number;
  label: string;
  url: string;
  emoji: string;
  order: number;
}

export interface ContactInfo {
  id?: number;
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  linkedin: string;
  siteTitle?: string;
  siteDescription?: string;
  logoUrl?: string;
  // LinkTree specific
  profilePicUrl?: string;
  linktreeVideoUrl?: string;
  bio?: string;
  // Text Content Fields
  manifestoTitle?: string;
  manifestoText?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  footerHeadline?: string;
  footerSubheadline?: string;
}

export interface NavItem {
  label: string;
  href: string;
}