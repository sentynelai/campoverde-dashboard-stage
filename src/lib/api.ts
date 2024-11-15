import type { StoreData, ProductKPI } from '../types';

const API_ENDPOINT = 'https://hook.us2.make.com/sogcju234vk0s6qvbnkq3x88t18o7vn4';

interface APIResponse {
  locations: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    total_sales: number;
    customers: number;
    region: string;
    trend: number;
    digital_audience: number;
  }>;
  kpis: Array<{
    id: string;
    description: string;
    SALES_52W: number;
    SALES_52W_PY: number;
    SALES_MIX: number;
  }>;
}

let cachedData: {
  stores: StoreData[];
  products: ProductKPI[];
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let lastFetchTime = 0;

function validateCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export async function fetchStoreData(): Promise<{ data: StoreData[]; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    let data: APIResponse;
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    if (!data.locations || !Array.isArray(data.locations)) {
      throw new Error('Invalid data format: missing or invalid locations array');
    }

    const stores = data.locations
      .filter(location => validateCoordinates(location.latitude, location.longitude))
      .map(location => ({
        id: location.id,
        name: location.name || `Store ${location.id}`,
        latitude: location.latitude,
        longitude: location.longitude,
        sales: location.total_sales || 0,
        customers: location.customers || 0,
        region: location.region || 'Unknown',
        trend: location.trend || 0,
        digitalAudience: location.digital_audience || 0
      }));

    const products = (data.kpis || []).map(kpi => ({
      id: kpi.id,
      name: kpi.description,
      current: kpi.SALES_52W,
      target: kpi.SALES_52W_PY
    }));

    cachedData = { stores, products };
    lastFetchTime = Date.now();
    
    return { data: stores };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.warn('Error fetching data:', errorMessage);
    
    // Return cached data if available
    if (cachedData?.stores) {
      return { 
        data: cachedData.stores,
        error: `Failed to fetch live data: ${errorMessage}. Using cached data.`
      };
    }
    
    // Generate fallback data if no cache available
    const fallbackStores = generateFallbackStores();
    cachedData = {
      stores: fallbackStores,
      products: []
    };
    
    return { 
      data: fallbackStores,
      error: `Failed to fetch live data: ${errorMessage}. Using fallback data.`
    };
  }
}

function generateFallbackStores(): StoreData[] {
  const regions = ['West', 'East', 'Central', 'South'];
  const baseLocations = {
    West: { latitude: 37.7749, longitude: -122.4194 },
    East: { latitude: 40.7128, longitude: -74.0060 },
    Central: { latitude: 41.8781, longitude: -87.6298 },
    South: { latitude: 29.7604, longitude: -95.3698 }
  };

  return Array.from({ length: 4328 }, (_, i) => {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const base = baseLocations[region];
    const storeId = 1001 + i;
    const offset = (Math.random() - 0.5) * 10;
    
    return {
      id: storeId,
      name: `Store ${storeId}`,
      latitude: base.latitude + offset,
      longitude: base.longitude + offset,
      sales: 2000000 + Math.random() * 3000000,
      customers: 15000 + Math.random() * 15000,
      region,
      trend: -5 + Math.random() * 20,
      digitalAudience: Math.floor(50000 + Math.random() * 100000)
    };
  });
}

export async function fetchProductKPIs(): Promise<{ data: ProductKPI[]; error?: string }> {
  try {
    // Return cached data if available and not expired
    if (cachedData?.products && (Date.now() - lastFetchTime) < CACHE_DURATION) {
      return { data: cachedData.products };
    }

    // If no cache, trigger a new fetch
    const result = await fetchStoreData();
    return { 
      data: cachedData?.products || [],
      error: result.error
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.warn('Error fetching product KPIs:', errorMessage);
    return { 
      data: cachedData?.products || [],
      error: `Failed to fetch KPI data: ${errorMessage}`
    };
  }
}