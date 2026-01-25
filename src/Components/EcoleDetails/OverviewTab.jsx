import React from 'react';

function OverviewTab({ school }) {
  return (
    <div className="overview-tab">
      <div className="description-section">
        <h3>Présentation</h3>
        <p className="school-description">
          {school.presentation || school.description}
        </p>
      </div>

      {school.missions && school.missions.length > 0 && (
        <div className="mission-section overview-section">
          <h3>Mission & Vision</h3>
          <div className="mission-content">
            <ul className="mission-list">
              {school.missions.map((mission, index) => (
                <li key={index} className="mission-item">
                  <span className="mission-icon">🎯</span>
                  <span className="mission-text">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
  );
}

export default OverviewTab;