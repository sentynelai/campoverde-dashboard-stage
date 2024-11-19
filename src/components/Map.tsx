import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useStoreSelection } from '../hooks/useStoreSelection';
import { useStoreData } from '../hooks/useStoreData';
import { MapError } from './MapError';
import { loadGoogleMaps } from '../lib/maps';
import { MAPS_CONFIG } from '../lib/maps';
import type { StoreData } from '../types';

const BATCH_SIZE = 500;
const BATCH_DELAY = 100; // ms between batches
const MIN_ZOOM_FOR_MARKERS = 6; // Minimum zoom level to show markers

export const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [markerData, setMarkerData] = useState<{ [key: number]: google.maps.Marker }>({});
  const [error, setError] = useState<string>('');
  const { stores } = useStoreData();
  const { selectedStore, setSelectedStore } = useStoreSelection();
  const [visibleMarkers, setVisibleMarkers] = useState<Set<number>>(new Set());
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(MAPS_CONFIG.defaultZoom);

  const createMarker = useMemo(() => (store: StoreData, map: google.maps.Map) => {
    if (markerData[store.index]) {
      const existingMarker = markerData[store.index];
      existingMarker.setMap(map);
      return existingMarker;
    }

    const isEastRegion = store.state === 'FL' || store.state === 'GA' || store.state === 'SC' || 
                        store.state === 'NC' || store.state === 'VA' || store.state === 'MD' || 
                        store.state === 'DE' || store.state === 'NJ' || store.state === 'NY' || 
                        store.state === 'CT' || store.state === 'RI' || store.state === 'MA' || 
                        store.state === 'NH' || store.state === 'VT' || store.state === 'ME';
    const isSelected = selectedStore?.index === store.index;

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
      if (selectedStore?.index !== store.index) {
        marker.setIcon({
          ...marker.getIcon(),
          fillOpacity: 0.4,
          scale: 2,
          zIndex: 1
        });
      }
    });

    marker.addListener('click', () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(async () => {
        setSelectedStore(store);
        map.panTo({ lat: store.latitude, lng: store.longitude });
      }, 100);
    });

    setMarkerData(prev => ({ ...prev, [store.index]: marker }));
    return marker;
  }, [selectedStore, setSelectedStore, markerData]);

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
    setCurrentZoom(zoom || MAPS_CONFIG.defaultZoom);
    const newVisibleMarkers = new Set<number>();
    
    if (zoom && zoom >= MIN_ZOOM_FOR_MARKERS) {
      const visibleStores = stores.filter(store => {
        const latLng = new google.maps.LatLng(store.latitude, store.longitude);
        const isVisible = bounds.contains(latLng);
        if (isVisible) {
          newVisibleMarkers.add(store.index);
        }
        return isVisible;
      });

      // Hide all markers first
      Object.values(markerData).forEach(marker => marker.setMap(null));

      // Clear any pending batch loading
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }

      // Start loading markers in batches
      loadMarkerBatch(visibleStores, 0, mapInstanceRef.current);
    } else {
      // Hide all markers if zoom level is too low
      Object.values(markerData).forEach(marker => marker.setMap(null));
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
      Object.values(markerData).forEach(marker => marker.setMap(null));
      setMarkerData({});
      markersRef.current = [];
    };
  }, []);

  // Update markers when stores or selected store changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateVisibleMarkers();
    }
  }, [stores, selectedStore]);

  if (error) {
    return <MapError message={error} />;
  }

  return (
    <>
      <div ref={mapRef} className="w-full h-full opacity-90" />
      {currentZoom < MIN_ZOOM_FOR_MARKERS && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-950/90 backdrop-blur-sm px-6 py-3 rounded-lg border border-dark-800/50 text-sm">
          Zoom in to load map markers
        </div>
      )}
    </>
  );
};