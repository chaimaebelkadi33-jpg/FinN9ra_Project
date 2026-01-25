import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import schoolsData from "../Data/ecoles.json";
import OpenStreetMap from "../Components/OpenStreetMap";
import "../Styles/ecoleDetail.css";
import "../Styles/OpenStreetMap.css";

// Import tab components
import OverviewTab from "../Components/EcoleDetails/OverviewTab";
import AcademiqueTab from "../Components/EcoleDetails/AcademiqueTab";
import FormationsTab from "../Components/EcoleDetails/FormationsTab";
import AdmissionTab from "../Components/EcoleDetails/AdmissionTab";
import ReviewsTab from "../Components/EcoleDetails/ReviewsTab";
import ContactTab from "../Components/EcoleDetails/ContactTab";
import MapsTab from "../Components/EcoleDetails/MapsTab";

function EcoleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const foundSchool = schoolsData.find((s) => s.idEcole === parseInt(id));
    if (foundSchool) {
      setSchool(foundSchool);
    }
    setLoading(false);
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="star full">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="star half">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addReview = (review) => {
    const reviewToAdd = {
      id: `rev-${Date.now()}`,
      ...review,
      date: new Date().toISOString().split("T")[0],
      verified: false,
    };

    setSchool((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), reviewToAdd],
    }));
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
        <button onClick={() => navigate("/ecoles")} className="back-button">
          ← Retour à la liste des écoles
        </button>
      </div>
    );
  }

  const shouldShowFormationsTab =
    (school.filiereGestion && school.filiereGestion.length > 0) ||
    (school.filiereCommerce && school.filiereCommerce.length > 0);

  const shouldShowAcademiqueTab =
    (school.specialites && school.specialites.length > 0) ||
    (school.mastersSpecialisesInitiale &&
      school.mastersSpecialisesInitiale.length > 0) ||
    (school.mastersSpecialisesUniversite &&
      school.mastersSpecialisesUniversite.length > 0) ||
    (school.licencesProfessionnelles &&
      school.licencesProfessionnelles.length > 0) ||
    (school.equipements && school.equipements.length > 0);

  const shouldShowContactInfoTab =
    school.siteWeb ||
    school.contact ||
    school.telephone ||
    school.universiteAffiliation ||
    school.anneeCreation;

  const shouldShowAdmissionTab =
    school.admission || school.debouches || school.cout;

  return (
    <div className="ecole-details-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate("/ecoles")} className="back-button">
          ← Retour à la liste
        </button>
      </div>

      {/* School Header Info */}
      <div className="header-section">
        <div className="school-header">
          <h1 className="school-title">{school.nom}</h1>
          <div className="school-info-row"></div>
        </div>

        {/* School Image with Price */}
        <div className="main-image-container">
          <img
            src={school.image}
            alt={school.nom}
            className="main-image"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=École+Image";
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
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Aperçu
        </button>

        {shouldShowAcademiqueTab && (
          <button
            className={`tab-button ${
              activeTab === "academique" ? "active" : ""
            }`}
            onClick={() => setActiveTab("academique")}
          >
            Académique
          </button>
        )}

        {shouldShowFormationsTab && (
          <button
            className={`tab-button ${
              activeTab === "formations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("formations")}
          >
            Formations
          </button>
        )}

        {shouldShowAdmissionTab && (
          <button
            className={`tab-button ${
              activeTab === "admission" ? "active" : ""
            }`}
            onClick={() => setActiveTab("admission")}
          >
            Admission & Débouchés
          </button>
        )}

        <button
          className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ Avis ({school.reviews?.length || 0})
        </button>

        {shouldShowContactInfoTab && (
          <button
            className={`tab-button ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact & Infos
          </button>
        )}

        <button
          className={`tab-button ${activeTab === "maps" ? "active" : ""}`}
          onClick={() => setActiveTab("maps")}
        >
          🗺️ Carte
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && <OverviewTab school={school} />}
        {activeTab === "academique" && (
          <AcademiqueTab
            school={school}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
        {activeTab === "formations" && (
          <FormationsTab
            school={school}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
        {activeTab === "admission" && (
          <AdmissionTab
            school={school}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
        {activeTab === "reviews" && (
          <ReviewsTab
            school={school}
            addReview={addReview}
            renderStars={renderStars}
          />
        )}
        {activeTab === "contact" && <ContactTab school={school} />}
        {activeTab === "maps" && <MapsTab school={school} />}
      </div>

      {/* Floating Action Button */}
      {school.siteWeb && (
        <div className="floating-action">
          <button
            className="floating-action-btn"
            onClick={() => window.open(school.siteWeb, "_blank")}
          >
            Site Web
          </button>
        </div>
      )}
    </div>
  );
}

export default EcoleDetails;
