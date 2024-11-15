export interface SocialMedia {
  facebook: number;
  instagram: number;
  twitter: number;
  tiktok: number;
}

export interface StoreData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  sales: number;
  customers: number;
  region: string;
  trend: number;
  digitalAudience: number;
}

export interface ProductKPI {
  id: string;
  name: string;
  current: number;
  target: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}