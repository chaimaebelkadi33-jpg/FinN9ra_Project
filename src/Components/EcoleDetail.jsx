import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import schoolsData from "../Data/ecoles.json";
import OpenStreetMap from "../Components/OpenStreetMap";
import "../Styles/ecoleDetail.css";
import "../Styles/OpenStreetMap.css";

function EcoleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    author: "",
  });

  useEffect(() => {
    // Find school by ID
    const foundSchool = schoolsData.find((s) => s.idEcole === parseInt(id));

    if (foundSchool) {
      setSchool(foundSchool);
    }
    setLoading(false);
  }, [id]);

  // Function to render star rating
  const renderStars = (rating, clickable = false, onStarClick = null) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span
            key={i}
            className={`star full ${clickable ? "clickable" : ""}`}
            onClick={() => clickable && onStarClick && onStarClick(i)}
          >
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span
            key={i}
            className={`star half ${clickable ? "clickable" : ""}`}
            onClick={() => clickable && onStarClick && onStarClick(i)}
          >
            ★
          </span>
        );
      } else {
        stars.push(
          <span
            key={i}
            className={`star empty ${clickable ? "clickable" : ""}`}
            onClick={() => clickable && onStarClick && onStarClick(i)}
          >
            ☆
          </span>
        );
      }
    }

    return stars;
  };

  // Function to get region from city
  const getRegion = (city) => {
    const regions = {
      Rabat: "Rabat-Salé-Kénitra",
      Salé: "Rabat-Salé-Kénitra",
      Kénitra: "Rabat-Salé-Kénitra",
      Casablanca: "Casablanca-Settat",
      Marrakech: "Marrakech-Safi",
      Fès: "Fès-Meknès",
      Meknès: "Fès-Meknès",
      Tanger: "Tanger-Tétouan-Al Hoceïma",
      Tétouan: "Tanger-Tétouan-Al Hoceïma",
      Agadir: "Souss-Massa",
      Oujda: "Oriental",
    };
    return regions[city] || "Maroc";
  };

  // Function to handle star rating click
  const handleStarClick = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  // Function to handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReview.comment.trim() || !newReview.author.trim()) {
      alert("Veuillez remplir tous les champs requis");
      return;
    }

    const reviewToAdd = {
      id: `rev-${Date.now()}`,
      rating: newReview.rating,
      comment: newReview.comment,
      author: newReview.author,
      date: new Date().toISOString().split("T")[0],
      verified: false,
    };

    setSchool((prev) => ({
      ...prev,
      reviews: [...prev.reviews, reviewToAdd],
    }));

    // Reset form
    setNewReview({
      rating: 5,
      comment: "",
      author: "",
    });

    alert("Merci pour votre avis! Il sera publié après modération.");
  };

  // Function to calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  // Function to count reviews by rating
  const countReviewsByRating = (reviews) => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const roundedRating = Math.round(review.rating);
      if (counts[roundedRating] !== undefined) {
        counts[roundedRating]++;
      }
    });
    return counts;
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

  const reviews = school.reviews || [];
  const averageRating = calculateAverageRating(reviews);
  const ratingCounts = countReviewsByRating(reviews);
  const totalReviews = reviews.length;

  return (
    <div className="ecole-details-container">
      {/* Back Navigation */}
      <div className="back-navigation">
        <button onClick={() => navigate("/ecoles")} className="back-button">
          ← Retour à la liste
        </button>
      </div>

      {/* Main Header Section */}
      <div className="header-section">
        <div className="school-header">
          <h1 className="school-title">{school.nom}</h1>
          <div className="school-info-row">
            <span className="school-type">{school.type}</span>
            <div className="school-rating">
              {renderStars(school.note)}
              <span className="rating-number">{school.note}/5</span>
            </div>
          </div>
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
              e.target.src =
                "https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=École+Image";
            }}
          />
          <div className="image-overlay">
            <span className="price-tag">{school.cout}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - ADDED REVIEWS TAB */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Aperçu
        </button>
        <button
          className={`tab-button ${
            activeTab === "specialties" ? "active" : ""
          }`}
          onClick={() => setActiveTab("specialties")}
        >
          Spécialités
        </button>
        <button
          className={`tab-button ${activeTab === "admission" ? "active" : ""}`}
          onClick={() => setActiveTab("admission")}
        >
          Admission & Débouchés
        </button>
        <button
          className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ Avis ({totalReviews})
        </button>
        <button
          className={`tab-button ${activeTab === "maps" ? "active" : ""}`}
          onClick={() => setActiveTab("maps")}
        >
          🗺️ Carte
        </button>
        <button
          className={`tab-button ${activeTab === "contact" ? "active" : ""}`}
          onClick={() => setActiveTab("contact")}
        >
          Contact
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="description-section">
              <h3>Présentation</h3>
              <p className="school-description">
                {school.presentation || school.description}
              </p>
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
        {activeTab === "specialties" && (
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
        {activeTab === "admission" && (
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
                {school.debouches &&
                  school.debouches.map((debouché, index) => (
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
                <p className="cost-note">
                  *Frais d'inscription supplémentaires peuvent s'appliquer
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NEW: Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="reviews-tab">
            {/* Ratings Overview */}
            <div className="ratings-overview">
              <div className="overall-rating">
                <div className="rating-number-large">{averageRating}</div>
                <div className="rating-stars-large">
                  {renderStars(averageRating)}
                </div>
                <div className="rating-count">{totalReviews} avis</div>
              </div>

              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-row">
                    <span className="star-label">{star} étoiles</span>
                    <div className="rating-bar-container">
                      <div
                        className="rating-bar"
                        style={{
                          width:
                            totalReviews > 0
                              ? `${(ratingCounts[star] / totalReviews) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <span className="rating-count-small">
                      {ratingCounts[star]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Review Form */}
            <div className="add-review-section">
              <h3>Donner votre avis</h3>
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label>Votre note :</label>
                  <div className="rating-input">
                    {renderStars(newReview.rating, true, handleStarClick)}
                    <span className="rating-value">{newReview.rating}/5</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="author">Votre nom :</label>
                  <input
                    type="text"
                    id="author"
                    value={newReview.author}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Votre avis :</label>
                  <textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Partagez votre expérience avec cette école..."
                    rows="4"
                    required
                  />
                </div>

                <button type="submit" className="submit-review-btn">
                  Publier votre avis
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
              <h3>Avis des étudiants</h3>
              {reviews.length === 0 ? (
                <div className="no-reviews">
                  <p>
                    Aucun avis pour le moment. Soyez le premier à donner votre
                    avis !
                  </p>
                </div>
              ) : (
                <div className="reviews-grid">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-avatar">
                            {review.author.charAt(0)}
                          </span>
                          <div className="reviewer-name-container">
                            <span className="reviewer-name">
                              {review.author}
                            </span>
                            {review.verified && (
                              <span className="verified-badge">✓</span>
                            )}
                          </div>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      <div className="review-content">
                        <p>{review.comment}</p>
                      </div>

                      {/* Add the date under the comment */}
                      <div className="review-footer">
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Maps Tab */}
        {activeTab === "maps" && (
          <div className="maps-tab">
            <div className="maps-header">
              <h2>🗺️ Localisation de {school.nom}</h2>
              <p className="maps-subtitle">
                Trouvez l'établissement sur la carte interactive
              </p>
            </div>

            <OpenStreetMap
              city={school.ville}
              schoolName={school.nom}
              type={school.type}
            />

            <h3 className="location-info-title">Informations Géographiques</h3>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Ville :</span>
                <span className="info-value">{school.ville}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Région :</span>
                <span className="info-value">{getRegion(school.ville)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Type :</span>
                <span className="info-value">{school.type}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="action-btn"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/${school.nom}+${school.ville}+Maroc`,
                    "_blank"
                  )
                }
              >
                <span>📍</span> Ouvrir dans Google Maps
              </button>
              <button
                className="action-btn"
                onClick={() =>
                  window.open(
                    `https://waze.com/ul?q=${school.nom}+${school.ville}+Maroc`,
                    "_blank"
                  )
                }
              >
                <span>🚗</span> Itinéraire Waze
              </button>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
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
                  <a href={`mailto:${school.contact}`} className="contact-link">
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
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="floating-action">
        <button
          className="floating-action-btn"
          onClick={() => window.open(school.siteWeb, "_blank")}
        >
          Site Web
        </button>
      </div>
    </div>
  );
}

export default EcoleDetails;
