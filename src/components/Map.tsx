import React, { useEffect, useRef, useState } from 'react';
import { useStoreSelection } from '../hooks/useStoreSelection';
import { useStoreData } from '../hooks/useStoreData';
import { MapError } from './MapError';
import { loadGoogleMaps } from '../lib/maps';
import { MAPS_CONFIG } from '../lib/maps';

const BATCH_SIZE = 500;
const BATCH_DELAY = 100; // ms between batches

export const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [error, setError] = useState<string>('');
  const { stores } = useStoreData();
  const { selectedStore, setSelectedStore } = useStoreSelection();
  const [visibleMarkers, setVisibleMarkers] = useState<Set<number>>(new Set());
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createMarker = (store: any, map: google.maps.Map) => {
    const isEastRegion = store.region === 'East';
    const isSelected = selectedStore?.id === store.id;

    const marker = new google.maps.Marker({
      position: { lat: store.latitude, lng: store.longitude },
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 4 : 2,
        fillColor: '#00FF9C',
        fillOpacity: isSelected ? 0.9 : 0.4,
        strokeWeight: isEastRegion ? 0.8 : 0.3,
        strokeColor: isEastRegion ? '#ffffff' : '#00FF9C',
        strokeOpacity: isEastRegion ? 0.9 : 0.6
      },
      optimized: true,
      clickable: true,
      zIndex: isSelected ? 2 : 1
    });

    marker.addListener('mouseover', () => {
      marker.setIcon({
        ...marker.getIcon(),
        fillOpacity: 0.9,
        scale: 3,
        zIndex: 3
      });
    });

    marker.addListener('mouseout', () => {
      if (selectedStore?.id !== store.id) {
        marker.setIcon({
          ...marker.getIcon(),
          fillOpacity: 0.4,
          scale: 2,
          zIndex: 1
        });
      }
    });

    marker.addListener('click', () => {
      // Debounce marker clicks
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(async () => {
        setSelectedStore(store);
        map.panTo({ lat: store.latitude, lng: store.longitude });
        map.setZoom(6);
      }, 100);
    });

    return marker;
  };

  const loadMarkerBatch = (
    visibleStores: typeof stores,
    startIndex: number,
    map: google.maps.Map
  ) => {
    if (!map || startIndex >= visibleStores.length) return;

    const endIndex = Math.min(startIndex + BATCH_SIZE, visibleStores.length);
    const batch = visibleStores.slice(startIndex, endIndex);

    const newMarkers = batch.map(store => createMarker(store, map));
    markersRef.current.push(...newMarkers);

    if (endIndex < visibleStores.length) {
      batchTimeoutRef.current = setTimeout(() => {
        loadMarkerBatch(visibleStores, endIndex, map);
      }, BATCH_DELAY);
    }
  };

  const updateVisibleMarkers = () => {
    if (!mapInstanceRef.current) return;

    const bounds = mapInstanceRef.current.getBounds();
    if (!bounds) return;

    const zoom = mapInstanceRef.current.getZoom();
    const newVisibleMarkers = new Set<number>();
    
    if (zoom && zoom > 4) {
      const visibleStores = stores.filter(store => {
        const latLng = new google.maps.LatLng(store.latitude, store.longitude);
        const isVisible = bounds.contains(latLng);
        if (isVisible) {
          newVisibleMarkers.add(store.id);
        }
        return isVisible;
      });

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Clear any pending batch loading
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }

      // Start loading markers in batches
      loadMarkerBatch(visibleStores, 0, mapInstanceRef.current);
    } else {
      // Clear markers if zoom level is too low
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }

    setVisibleMarkers(newVisibleMarkers);
  };

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
            maxZoom: 12,
            minZoom: 3,
          });

          mapInstanceRef.current = map;

          // Add bounds change listener with debounce
          let boundsChangeTimeout: NodeJS.Timeout;
          map.addListener('bounds_changed', () => {
            clearTimeout(boundsChangeTimeout);
            boundsChangeTimeout = setTimeout(() => {
              requestAnimationFrame(updateVisibleMarkers);
            }, 100);
          });

          // Initial markers update
          updateVisibleMarkers();
        }
      } catch (err) {
        setError('Failed to load Google Maps');
        console.error(err);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  // Update markers when stores or selected store changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateVisibleMarkers();
    }
  }, [stores, selectedStore]);

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