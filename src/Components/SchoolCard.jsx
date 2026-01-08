// src/Components/SchoolCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/schoolCard.css';
const SchoolCard = ({ school }) => {
  // Get school data from props
  const schoolName = school.nom;
  const city = school.ville;
  const type = school.type;
  const description = school.description;
  const specialties = school.specialites || [];
  const price = school.cout;
  const rating = school.note;
  const id = school.idEcole;
  
  // Use school image or a default one
  const schoolImage = school.image || 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=École';

  // Function to create star rating
  const showStars = () => {
    let stars = [];
    // Create 5 stars
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full star
        stars.push(<span key={i} className="star">★</span>);
      } else {
        // Empty star
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  // Show only first 2 specialties
  const showSpecialties = () => {
    const shortList = specialties.slice(0, 2);
    return shortList.map((item, index) => (
      <span key={index} className="specialty">
        {item}
      </span>
    ));
  };

  // Make description shorter
  const shortDescription = description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;

  return (
    <div className="school-card">
      {/* School image */}
      <div className="card-image">
        <img 
          src={schoolImage} 
          alt={schoolName}
          className="school-img"
        />
      </div>

      {/* Card content */}
      <div className="card-content">
        {/* School name and city */}
        <div className="school-header">
          <h3>{schoolName}</h3>
          <div className="location">
            <span className="city">{city}</span>
          </div>
        </div>

        {/* School type */}
        <div className="school-type">{type}</div>

        {/* Rating */}
        <div className="rating">
          <div className="stars">
            {showStars()}
            <span className="rating-number">{rating}/5</span>
          </div>
        </div>

        {/* Description */}
        <p className="description">{shortDescription}</p>

        {/* Specialties */}
        <div className="specialties">
          {showSpecialties()}
          {specialties.length > 2 && (
            <span className="more">+{specialties.length - 2} plus</span>
          )}
        </div>

        {/* Price and button */}
        <div className="card-footer">
          <div className="price">{price}</div>
          <Link to={`/ecole/${id}`} className="details-btn">
            Voir plus
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchoolCard;