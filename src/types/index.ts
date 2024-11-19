export interface StoreData {
  url: string;
  city: string;
  name: string;
  index: number;
  state: string;
  country: string;
  reviews: number;
  latitude: number;
  negative: number;
  positive: number;
  zip_code: number;
  longitude: number;
  total_sales: number;
  phone_number_1: string;
  poblacion_10km: number;
  street_address: string;
  campoverde_sales: number;
  digital_audience: number;
  digital_audience_twitter: number;
  digital_audience_facebook: number;
  digital_audience_linkedin: number;
  digital_audience_instagram: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}