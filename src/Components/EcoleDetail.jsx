import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import schoolsData from '../Data/ecoles.json'; 
import OpenStreetMap from '../Components/OpenStreetMap';
import '../Styles/ecoleDetail.css';

function EcoleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Find school by ID
    const foundSchool = schoolsData.find(s => s.idEcole === parseInt(id));
    
    if (foundSchool) {
      setSchool(foundSchool);
    }
    setLoading(false);
  }, [id]);

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  // Function to get region from city
  const getRegion = (city) => {
    const regions = {
      'Rabat': 'Rabat-Salé-Kénitra',
      'Salé': 'Rabat-Salé-Kénitra',
      'Kénitra': 'Rabat-Salé-Kénitra',
      'Casablanca': 'Casablanca-Settat',
      'Marrakech': 'Marrakech-Safi',
      'Fès': 'Fès-Meknès',
      'Meknès': 'Fès-Meknès',
      'Tanger': 'Tanger-Tétouan-Al Hoceïma',
      'Tétouan': 'Tanger-Tétouan-Al Hoceïma',
      'Agadir': 'Souss-Massa',
      'Oujda': 'Oriental'
    };
    return regions[city] || 'Maroc';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des informations de l'école...</p>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="not-found-container">
        <h2>École non trouvée</h2>
        <p>L'école que vous recherchez n'existe pas ou a été déplacée.</p>
        <button onClick={() => navigate('/ecoles')} className="back-button">
          ← Retour à la liste des écoles
        </button>
      </div>
    );
  }

  return (
    <div className="ecole-details-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate('/ecoles')} className="back-button">
          ← Retour à la liste
        </button>
      </div>

      {/* Main Header Section */}
      <div className="header-section">
        <div className="school-header">
          <div className="school-badge">
            <span className="school-type">{school.type}</span>
            <div className="school-rating">
              {renderStars(school.note)}
              <span className="rating-number">{school.note}/5</span>
            </div>
          </div>
          
          <h1 className="school-title">{school.nom}</h1>
          
          <div className="school-location">
            <span className="location-icon">📍</span>
            <span className="location-text">{school.ville}, Maroc</span>
          </div>
        </div>

        {/* Main Image */}
        <div className="main-image-container">
          <img 
            src={school.image} 
            alt={school.nom} 
            className="main-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=École+Image';
            }}
          />
          <div className="image-overlay">
            <span className="price-tag">{school.cout}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Aperçu
        </button>
        <button 
          className={`tab-button ${activeTab === 'specialties' ? 'active' : ''}`}
          onClick={() => setActiveTab('specialties')}
        >
          Spécialités
        </button>
        <button 
          className={`tab-button ${activeTab === 'admission' ? 'active' : ''}`}
          onClick={() => setActiveTab('admission')}
        >
          Admission & Débouchés
        </button>
        <button 
          className={`tab-button ${activeTab === 'maps' ? 'active' : ''}`}
          onClick={() => setActiveTab('maps')}
        >
          🗺️ Carte
        </button>
        <button 
          className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="description-section">
              <h3>Présentation</h3>
              <p className="school-description">{school.presentation || school.description}</p>
            </div>

            <div className="quick-info-grid">
              <div className="info-card">
                <span className="info-icon">🏫</span>
                <div className="info-content">
                  <h4>Type d'établissement</h4>
                  <p>{school.type}</p>
                </div>
              </div>
              
              <div className="info-card">
                <span className="info-icon">⏱️</span>
                <div className="info-content">
                  <h4>Durée des études</h4>
                  <p>{school.dureeEtudes}</p>
                </div>
              </div>
              
              <div className="info-card">
                <span className="info-icon">🎓</span>
                <div className="info-content">
                  <h4>Diplôme délivré</h4>
                  <p>{school.diplome}</p>
                </div>
              </div>
              
              <div className="info-card">
                <span className="info-icon">⭐</span>
                <div className="info-content">
                  <h4>Note moyenne</h4>
                  <p>{school.note}/5</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specialties Tab */}
        {activeTab === 'specialties' && (
          <div className="specialties-tab">
            <h3>Spécialités offertes</h3>
            <div className="specialties-grid">
              {school.specialites.map((specialty, index) => (
                <div key={index} className="specialty-card">
                  <span className="specialty-icon">📚</span>
                  <span className="specialty-name">{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admission & Débouchés Tab */}
        {activeTab === 'admission' && (
          <div className="admission-tab">
            <div className="admission-section">
              <h3>Conditions d'admission</h3>
              <div className="info-box">
                <div className="info-row">
                  <span className="info-label">Processus :</span>
                  <span className="info-value">{school.admission}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Durée :</span>
                  <span className="info-value">{school.dureeEtudes}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Diplôme :</span>
                  <span className="info-value">{school.diplome}</span>
                </div>
              </div>
            </div>

            <div className="debouchés-section">
              <h3>Débouchés professionnels</h3>
              <div className="debouchés-grid">
                {school.debouches && school.debouches.map((debouché, index) => (
                  <div key={index} className="debouché-card">
                    <span className="debouché-icon">💼</span>
                    <span className="debouché-name">{debouché}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cost-section">
              <h3>Coûts</h3>
              <div className="cost-card">
                <div className="cost-main">
                  <span className="cost-icon">💰</span>
                  <div className="cost-details">
                    <h4>Frais de scolarité annuels</h4>
                    <p className="cost-amount">{school.cout}</p>
                  </div>
                </div>
                <p className="cost-note">*Frais d'inscription supplémentaires peuvent s'appliquer</p>
              </div>
            </div>
          </div>
        )}

        {/* Maps Tab - NOUVELLE SECTION */}
        {activeTab === 'maps' && (
          <div className="maps-tab">
            <div className="maps-header">
              <h2>
                <span className="map-icon">🗺️</span>
                Localisation de {school.nom}
              </h2>
              <p className="maps-subtitle">
                Trouvez l'établissement sur la carte interactive
              </p>
            </div>

            {/* Carte interactive */}
            <div className="map-wrapper">
              <OpenStreetMap 
                city={school.ville}
                schoolName={school.nom}
                type={school.type}
              />
            </div>

            {/* Informations de localisation */}
            <div className="location-info-section">
              <div className="location-card">
                <h3 className="location-title">
                  <span className="icon">📍</span>
                  Information Géographique
                </h3>
                
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Ville :</span>
                    <span className="info-value city-badge">{school.ville}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Région :</span>
                    <span className="info-value">{getRegion(school.ville)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Type :</span>
                    <span className="info-value type-badge">{school.type}</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="maps-action-buttons">
                  <button 
                    className="action-btn primary-action"
                    onClick={() => window.open(`https://www.google.com/maps/search/${school.nom}+${school.ville}+Maroc`, '_blank')}
                  >
                    <span className="btn-icon">🗺️</span>
                    Ouvrir dans Google Maps
                  </button>
                  <button 
                    className="action-btn secondary-action"
                    onClick={() => window.open(`https://www.waze.com/ul?q=${school.nom}+${school.ville}+Maroc`, '_blank')}
                  >
                    <span className="btn-icon">🚗</span>
                    Itinéraire Waze
                  </button>
                  <button 
                    className="action-btn tertiary-action"
                    onClick={() => window.open(school.siteWeb, '_blank')}
                  >
                    <span className="btn-icon">🌐</span>
                    Site Officiel
                  </button>
                </div>

                {/* Transport et accès */}
                <div className="transport-section">
                  <h4 className="transport-title">
                    <span className="icon">🚌</span>
                    Accès & Transport
                  </h4>
                  <div className="transport-options">
                    <span className="transport-option" title="Bus">🚌</span>
                    <span className="transport-option" title="Taxi">🚕</span>
                    <span className="transport-option" title="Train">🚆</span>
                    <span className="transport-option" title="Voiture">🚗</span>
                  </div>
                  <p className="transport-note">
                    Consultez le site officiel pour les informations précises d'accès
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="contact-tab">
            <div className="contact-grid">
              <div className="contact-card">
                <span className="contact-icon">🌐</span>
                <div className="contact-content">
                  <h4>Site Web</h4>
                  <a 
                    href={school.siteWeb} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    {school.siteWeb}
                  </a>
                </div>
              </div>
              
              <div className="contact-card">
                <span className="contact-icon">📧</span>
                <div className="contact-content">
                  <h4>Email</h4>
                  <a 
                    href={`mailto:${school.contact}`}
                    className="contact-link"
                  >
                    {school.contact}
                  </a>
                </div>
              </div>
              
              <div className="contact-card">
                <span className="contact-icon">📍</span>
                <div className="contact-content">
                  <h4>Localisation</h4>
                  <p>{school.ville}, Maroc</p>
                </div>
              </div>
              
              <div className="contact-card">
                <span className="contact-icon">📞</span>
                <div className="contact-content">
                  <h4>Contact</h4>
                  <p>Voir site web pour les numéros de téléphone</p>
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="primary-action-btn"
                onClick={() => window.open(school.siteWeb, '_blank')}
              >
                Visiter le site officiel
              </button>
              <button 
                className="secondary-action-btn"
                onClick={() => window.location.href = `mailto:${school.contact}`}
              >
                Contacter l'école
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="floating-action">
        <button 
          className="floating-action-btn"
          onClick={() => window.open(school.siteWeb, '_blank')}
        >
          Site Web
        </button>
      </div>
    </div>
  );
}

export default EcoleDetails;