export const MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  defaultCenter: { lat: 39.8283, lng: -98.5795 },
  defaultZoom: 4,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#121212" }]
    },
    {
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        { "color": "#ffffff" },
        { "weight": 0.1 }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#040404" }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
        { "color": "#ffffff" },
        { "weight": 0.2 }
      ]
    }
  ]
} as const;