// src/Components/OpenStreetMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction des icônes Leaflet (nécessaire avec React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const OpenStreetMap = ({ city, schoolName, type }) => {
  // Coordonnées exactes pour les villes marocaines (centres-villes)
  const cityCoordinates = {
    'Rabat': { lat: 34.020882, lng: -6.841650 },
    'Casablanca': { lat: 33.573110, lng: -7.589843 },
    'Marrakech': { lat: 31.629472, lng: -7.981084 },
    'Fès': { lat: 34.018125, lng: -5.007845 },
    'Meknès': { lat: 33.877620, lng: -5.538886 },
    'Salé': { lat: 34.041430, lng: -6.807482 },
    'Kénitra': { lat: 34.261010, lng: -6.579830 },
    'Tétouan': { lat: 35.588900, lng: -5.362550 },
    'Tanger': { lat: 35.759465, lng: -5.833954 },
    'Agadir': { lat: 30.427755, lng: -9.598107 },
    'Oujda': { lat: 34.681390, lng: -1.900155 }
  };

  // Récupérer les coordonnées ou utiliser Rabat par défaut
  const position = cityCoordinates[city] || { lat: 34.020882, lng: -6.841650 };
  
  // Icône personnalisée selon le type d'école
  const customIcon = new L.Icon({
    iconUrl: getIconByType(type),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: 'custom-marker'
  });

  function getIconByType(type) {
    if (type.includes('Ingénieur')) return '🎓';
    if (type.includes('Médecine')) return '🏥';
    if (type.includes('Commerce')) return '💼';
    if (type.includes('Architecture')) return '🏛️';
    if (type.includes('Agriculture')) return '🌱';
    return '🏫';
  }

  return (
    <div className="finn9ra-map-container">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: '450px', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
        className="finn9ra-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Fin N9ra?'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[position.lat, position.lng]} 
          icon={customIcon}
        >
          <Popup className="finn9ra-popup">
            <div className="popup-content">
              <h4 className="popup-title">{schoolName}</h4>
              <p className="popup-type">{type}</p>
              <p className="popup-location">
                <span className="location-icon">📍</span> {city}, Maroc
              </p>
              <div className="popup-actions">
                <button 
                  className="popup-btn"
                  onClick={() => window.open(`https://www.google.com/maps/search/${schoolName}+${city}+Maroc`, '_blank')}
                >
                  Itinéraire
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;