// Updated store data with real information from spreadsheet
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

// Example store data
export const STORE_DATA: StoreData[] = [
  {
    url: "https://www.walmart.com/store/890/orlando-fl/details",
    city: "Orlando",
    name: "Orlando Supercenter",
    index: 854,
    state: "FL",
    country: "US",
    reviews: 780,
    latitude: 28.5659,
    negative: 212,
    positive: 568,
    zip_code: 32817,
    longitude: -81.217771,
    total_sales: 3177950,
    phone_number_1: "407-281-8941",
    poblacion_10km: 147475,
    street_address: "11250 E Colonial Dr",
    campoverde_sales: 23428074,
    digital_audience: 112741,
    digital_audience_twitter: 33919,
    digital_audience_facebook: 56630,
    digital_audience_linkedin: 41293,
    digital_audience_instagram: 37754
  },
  {
    url: "https://www.walmart.com/store/891/miami-fl/details",
    city: "Miami",
    name: "Miami Downtown",
    index: 855,
    state: "FL",
    country: "US",
    reviews: 650,
    latitude: 25.7617,
    negative: 180,
    positive: 470,
    zip_code: 33131,
    longitude: -80.1918,
    total_sales: 4215680,
    phone_number_1: "305-358-7940",
    poblacion_10km: 198650,
    street_address: "1601 Biscayne Blvd",
    campoverde_sales: 28945610,
    digital_audience: 134890,
    digital_audience_twitter: 40467,
    digital_audience_facebook: 67445,
    digital_audience_linkedin: 49308,
    digital_audience_instagram: 45023
  },
  {
    url: "https://www.walmart.com/store/892/atlanta-ga/details",
    city: "Atlanta",
    name: "Atlanta Midtown",
    index: 856,
    state: "GA",
    country: "US",
    reviews: 820,
    latitude: 33.7490,
    negative: 246,
    positive: 574,
    zip_code: 30308,
    longitude: -84.3880,
    total_sales: 3890420,
    phone_number_1: "404-892-5252",
    poblacion_10km: 178340,
    street_address: "725 Ponce De Leon Ave NE",
    campoverde_sales: 25987430,
    digital_audience: 128760,
    digital_audience_twitter: 38628,
    digital_audience_facebook: 64380,
    digital_audience_linkedin: 47041,
    digital_audience_instagram: 42987
  }
];

// Calculate total social media reach
export const getTotalSocialMedia = () => {
  return STORE_DATA.reduce((acc, store) => ({
    facebook: acc.facebook + store.digital_audience_facebook,
    instagram: acc.instagram + store.digital_audience_instagram,
    twitter: acc.twitter + store.digital_audience_twitter,
    linkedin: acc.linkedin + store.digital_audience_linkedin
  }), {
    facebook: 0,
    instagram: 0,
    twitter: 0,
    linkedin: 0
  });
};