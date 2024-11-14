import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { StoreData } from '../types';

const SPREADSHEET_ID = '1yWXM53omNjeNQaVfb3vyodvTVUOldEhKkcTZrvmlWjM';
const SHEET_NAME = 'Locations';

let cachedData: StoreData[] | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let lastFetchTime = 0;

export async function fetchStoreData(): Promise<StoreData[]> {
  // Return cached data if available and not expired
  if (cachedData && (Date.now() - lastFetchTime) < CACHE_DURATION) {
    return cachedData;
  }

  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    
    // Check if credentials are available
    const clientEmail = import.meta.env.VITE_GOOGLE_CLIENT_EMAIL;
    const privateKey = import.meta.env.VITE_GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.warn('Google Sheets credentials not found, using fallback data');
      return generateFallbackData();
    }

    await doc.useServiceAccountAuth({
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[SHEET_NAME] || doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    if (!rows.length) {
      console.warn('No data found in Google Sheet, using fallback data');
      return generateFallbackData();
    }

    const data = rows.map(row => ({
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

    // Update cache
    cachedData = data;
    lastFetchTime = Date.now();
    
    return data;
  } catch (error) {
    console.warn('Error fetching from Google Sheets:', error);
    return generateFallbackData();
  }
}

function generateFallbackData(): StoreData[] {
  const regions = ['West', 'East', 'Central', 'South'];
  const baseLocations = {
    West: { lat: 37.7749, lng: -122.4194 },
    East: { lat: 40.7128, lng: -74.0060 },
    Central: { lat: 41.8781, lng: -87.6298 },
    South: { lat: 29.7604, lng: -95.3698 }
  };

  return Array.from({ length: 200 }, (_, i) => {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const base = baseLocations[region];
    
    return {
      id: 1001 + i,
      name: `Store ${1001 + i}`,
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