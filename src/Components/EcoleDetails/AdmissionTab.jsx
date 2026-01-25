import React from 'react';

function AdmissionTab({ school, expandedSections, toggleSection }) {
  return (
    <div className="admission-tab">
      {school.admission && (
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
      )}

      {school.debouches && school.debouches.length > 0 && (
        <div className="debouchés-section">
          <h3>Débouchés professionnels ({school.debouches.length})</h3>
          <div className="debouchés-grid">
            {school.debouches
              .slice(0, expandedSections.debouches ? undefined : 6)
              .map((debouché, index) => (
                <div key={index} className="debouché-card">
                  <span className="debouché-icon">💼</span>
                  <span className="debouché-name">{debouché}</span>
                </div>
              ))}
          </div>
          {school.debouches.length > 6 && (
            <button 
              className="show-more-btn"
              onClick={() => toggleSection('debouches')}
            >
              {expandedSections.debouches ? 'Voir moins' : `Voir les ${school.debouches.length - 6} autres`}
            </button>
          )}
        </div>
      )}

      {school.cout &&
        school.cout !== "Information non spécifiée sur la page" && (
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
        )}
    </div>
  );
}

export default AdmissionTab;