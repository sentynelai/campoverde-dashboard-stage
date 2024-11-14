export interface SocialMedia {
  facebook: number;
  instagram: number;
  twitter: number;
  tiktok: number;
}

export interface Products {
  energize: number;
  wellness: number;
  boost: number;
  bliss: number;
}

export interface StoreData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  sales: number;
  customers: number;
  region: string;
  trend: number;
  socialMedia: SocialMedia;
  products: Products;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}