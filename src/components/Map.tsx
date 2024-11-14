import React, { useEffect, useRef, useState } from 'react';
import { useStoreSelection } from '../hooks/useStoreSelection';
import { useStoreData } from '../hooks/useStoreData';
import { MapError } from './MapError';
import { loadGoogleMaps } from '../lib/maps';
import { MAPS_CONFIG } from '../lib/maps';

export const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [error, setError] = useState<string>('');
  const { stores } = useStoreData();
  const { selectedStore, setSelectedStore } = useStoreSelection();

  useEffect(() => {
    const initMap = async () => {
      if (!MAPS_CONFIG.apiKey) {
        setError('Google Maps API key is missing');
        return;
      }

      try {
        const google = await loadGoogleMaps();
        
        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: MAPS_CONFIG.defaultCenter,
            zoom: MAPS_CONFIG.defaultZoom,
            styles: MAPS_CONFIG.styles,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          mapInstanceRef.current = map;

          // Clear existing markers
          markersRef.current.forEach(marker => marker.setMap(null));
          markersRef.current = [];

          // Create markers for each store
          stores.forEach((store) => {
            const isEastRegion = store.region === 'East';
            const isSelected = selectedStore?.id === store.id;

            const marker = new google.maps.Marker({
              position: { lat: store.lat, lng: store.lng },
              map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: isSelected ? 12 : 8,
                fillColor: '#00FF9C',
                fillOpacity: isSelected ? 0.8 : 0.3,
                strokeWeight: isEastRegion ? 2 : 1,
                strokeColor: isEastRegion ? '#ffffff' : '#00FF9C',
                strokeOpacity: isEastRegion ? 0.8 : 0.5
              }
            });

            // Add hover effect
            marker.addListener('mouseover', () => {
              marker.setIcon({
                ...marker.getIcon(),
                fillOpacity: 0.8,
                scale: 10
              });
            });

            marker.addListener('mouseout', () => {
              if (selectedStore?.id !== store.id) {
                marker.setIcon({
                  ...marker.getIcon(),
                  fillOpacity: 0.3,
                  scale: 8
                });
              }
            });

            marker.addListener('click', () => {
              setSelectedStore(store);
              map.panTo({ lat: store.lat, lng: store.lng });
              map.setZoom(6);
            });

            markersRef.current.push(marker);
          });
        }
      } catch (err) {
        setError('Failed to load Google Maps');
        console.error(err);
      }
    };

    initMap();
  }, [stores, selectedStore, setSelectedStore]);

  // Reset map view when store is deselected
  useEffect(() => {
    if (!selectedStore && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(MAPS_CONFIG.defaultCenter);
      mapInstanceRef.current.setZoom(MAPS_CONFIG.defaultZoom);
    }
  }, [selectedStore]);

  if (error) {
    return <MapError message={error} />;
  }

  return <div ref={mapRef} className="w-full h-full opacity-90" />;
};