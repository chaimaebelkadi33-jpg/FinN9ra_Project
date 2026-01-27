// src/Components/SchoolCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../Styles/schoolCard.css";

function SchoolCard({ school }) {
  // Get school data from props
  const schoolName = school.nom;
  const city = school.ville;
  const type = school.type;
  const description = school.description;
  const specialties = school.specialites || [];
  const price = school.cout;
  const rating = school.note;
  const id = school.idEcole;

  const schoolImage =
    school.logo ||
    "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=École";

  return (
    <div className="school-card">
      {/* School image */}
      <div className="card-image">
        <img src={schoolImage} alt={schoolName} className="school-img" />
      </div>

      {/* Card content - Simplified layout */}
      <div className="card-content">
        {/* School name - Top and larger */}
        <h3 className="school-name">{schoolName}</h3>

        {/* School type badge */}
        <div className="type-badge">{type}</div>

        {/* City/Location */}
        <div className="school-location">
          <span className="city-icon">📍</span>
          <span className="city-name">{city}</span>
        </div>

        {/* "Voir plus" button */}
        <Link to={`/ecole/${id}`} className="voir-plus-btn">
          Voir plus →
        </Link>
      </div>
    </div>
  );
}

export default SchoolCard;
