import { Loader } from '@googlemaps/js-api-loader';
import { MAPS_CONFIG } from './config';

export async function loadGoogleMaps(): Promise<typeof google> {
  if (!MAPS_CONFIG.apiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  const loader = new Loader({
    apiKey: MAPS_CONFIG.apiKey,
    version: 'weekly',
    libraries: ['places']
  });

  return await loader.load();
}