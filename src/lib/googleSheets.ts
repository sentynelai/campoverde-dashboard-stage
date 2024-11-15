import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { StoreData } from '../types';

const SPREADSHEET_ID = '1yWXM53omNjeNQaVfb3vyodvTVUOldEhKkcTZrvmlWjM';
const SHEET_ID = '0'; // Updated to the correct sheet ID

let cachedData: StoreData[] | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let lastFetchTime = 0;

function generateFallbackData(): StoreData[] {
  const regions = ['West', 'East', 'Central', 'South'];
  const baseLocations = {
    West: { lat: 37.7749, lng: -122.4194 },
    East: { lat: 40.7128, lng: -74.0060 },
    Central: { lat: 41.8781, lng: -87.6298 },
    South: { lat: 29.7604, lng: -95.3698 }
  };

  return Array.from({ length: 4328 }, (_, i) => {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const base = baseLocations[region];
    const storeId = 1001 + i;
    
    return {
      id: storeId,
      name: `Store ${storeId}`,
      lat: base.lat + (Math.random() - 0.5) * 10,
      lng: base.lng + (Math.random() - 0.5) * 10,
      sales: 2000000 + Math.random() * 3000000,
      customers: 15000 + Math.random() * 15000,
      region,
      trend: -5 + Math.random() * 20,
      socialMedia: {
        facebook: 50000 + Math.random() * 100000,
        instagram: 40000 + Math.random() * 80000,
        twitter: 20000 + Math.random() * 50000,
        tiktok: 60000 + Math.random() * 120000
      },
      products: {
        energize: 100000 + Math.random() * 200000,
        wellness: 80000 + Math.random() * 150000,
        boost: 60000 + Math.random() * 100000,
        bliss: 40000 + Math.random() * 80000
      }
    };
  });
}

export async function fetchStoreData(): Promise<StoreData[]> {
  try {
    // Return cached data if available and not expired
    if (cachedData && (Date.now() - lastFetchTime) < CACHE_DURATION) {
      return cachedData;
    }

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    
    try {
      await doc.useServiceAccountAuth({
        client_email: import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
        private_key: (import.meta.env.VITE_GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      });

      await doc.loadInfo();
      const sheet = doc.sheetsById[SHEET_ID];
      
      if (!sheet) {
        throw new Error('Sheet not found');
      }

      const rows = await sheet.getRows();
      
      if (!rows.length) {
        throw new Error('No data found in sheet');
      }

      const data: StoreData[] = rows.map(row => ({
        id: parseInt(row.get('Store ID')) || 0,
        name: row.get('Store Name') || '',
        lat: parseFloat(row.get('Latitude')) || 0,
        lng: parseFloat(row.get('Longitude')) || 0,
        sales: parseInt(row.get('Monthly Sales')) || 0,
        customers: parseInt(row.get('Monthly Customers')) || 0,
        region: row.get('Region') || 'Unknown',
        trend: parseFloat(row.get('Growth Trend')) || 0,
        socialMedia: {
          facebook: parseInt(row.get('Facebook Followers')) || 0,
          instagram: parseInt(row.get('Instagram Followers')) || 0,
          twitter: parseInt(row.get('Twitter Followers')) || 0,
          tiktok: parseInt(row.get('TikTok Followers')) || 0
        },
        products: {
          energize: parseInt(row.get('CV ACAI ENERGIZE PWR')) || 0,
          wellness: parseInt(row.get('CV FIT & WELLNESS')) || 0,
          boost: parseInt(row.get('CV ENERGY BOOST')) || 0,
          bliss: parseInt(row.get('CV PASSION BLISS')) || 0
        }
      }));

      cachedData = data;
      lastFetchTime = Date.now();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch data from Google Sheets');
    }
  } catch (error) {
    console.warn('Error fetching data:', error);
    const fallbackData = generateFallbackData();
    cachedData = fallbackData;
    lastFetchTime = Date.now();
    return fallbackData;
  }
}