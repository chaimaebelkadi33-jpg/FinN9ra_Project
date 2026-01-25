import React from 'react';

function FormationsTab({ school, expandedSections, toggleSection }) {
  return (
    <div className="formations-tab">
      {school.filiereGestion && school.filiereGestion.length > 0 && (
        <div className="filiere-section">
          <h3>Filières de Gestion ({school.filiereGestion.length})</h3>
          <div className="specialties-grid">
            {school.filiereGestion
              .slice(0, expandedSections.filiereGestion ? undefined : 6)
              .map((filiere, index) => (
                <div key={index} className="specialty-card">
                  <span className="specialty-icon">📊</span>
                  <span className="specialty-name">{filiere}</span>
                </div>
              ))}
          </div>
          {school.filiereGestion.length > 6 && (
            <button 
              className="show-more-btn"
              onClick={() => toggleSection('filiereGestion')}
            >
              {expandedSections.filiereGestion ? 'Voir moins' : `Voir les ${school.filiereGestion.length - 6} autres`}
            </button>
          )}
        </div>
      )}

      {school.filiereCommerce && school.filiereCommerce.length > 0 && (
        <div className="filiere-section">
          <h3>Filières de Commerce ({school.filiereCommerce.length})</h3>
          <div className="specialties-grid">
            {school.filiereCommerce
              .slice(0, expandedSections.filiereCommerce ? undefined : 6)
              .map((filiere, index) => (
                <div key={index} className="specialty-card">
                  <span className="specialty-icon">💼</span>
                  <span className="specialty-name">{filiere}</span>
                </div>
              ))}
          </div>
          {school.filiereCommerce.length > 6 && (
            <button 
              className="show-more-btn"
              onClick={() => toggleSection('filiereCommerce')}
            >
              {expandedSections.filiereCommerce ? 'Voir moins' : `Voir les ${school.filiereCommerce.length - 6} autres`}
            </button>
          )}
        </div>
      )}

      {(!school.filiereGestion || school.filiereGestion.length === 0) &&
        (!school.filiereCommerce || school.filiereCommerce.length === 0) &&
        school.formationsOffertes &&
        school.formationsOffertes.length > 0 && (
          <div className="filiere-section">
            <h3>Formations Offertes ({school.formationsOffertes.length})</h3>
            <div className="specialties-grid">
              {school.formationsOffertes
                .slice(0, expandedSections.formationsOffertes ? undefined : 8)
                .map((formation, index) => (
                  <div key={index} className="specialty-card">
                    <span className="specialty-icon">📚</span>
                    <span className="specialty-name">{formation}</span>
                  </div>
                ))}
            </div>
            {school.formationsOffertes.length > 8 && (
              <button 
                className="show-more-btn"
                onClick={() => toggleSection('formationsOffertes')}
              >
                {expandedSections.formationsOffertes ? 'Voir moins' : `Voir les ${school.formationsOffertes.length - 8} autres`}
              </button>
            )}
          </div>
        )}
    </div>
  );
}

export default FormationsTab;