import React from 'react';

function AcademiqueTab({ school, expandedSections, toggleSection }) {
  return (
    <div className="academique-tab">
      {school.specialites && school.specialites.length > 0 && (
        <div className="academique-section">
          <h3>Spécialités Principales ({school.specialites.length})</h3>
          <div className="specialties-grid">
            {school.specialites
              .slice(0, expandedSections.specialites ? undefined : 8)
              .map((specialty, index) => (
                <div key={index} className="specialty-card">
                  <span className="specialty-icon">📚</span>
                  <span className="specialty-name">{specialty}</span>
                </div>
              ))}
          </div>
          {school.specialites.length > 8 && (
            <button 
              className="show-more-btn"
              onClick={() => toggleSection('specialites')}
            >
              {expandedSections.specialites ? 'Voir moins' : `Voir les ${school.specialites.length - 8} autres`}
            </button>
          )}
        </div>
      )}

      {(school.mastersSpecialisesInitiale && school.mastersSpecialisesInitiale.length > 0) ||
      (school.mastersSpecialisesUniversite && school.mastersSpecialisesUniversite.length > 0) ? (
        <div className="academique-section">
          <h3>Masters Spécialisés</h3>
          
          {school.mastersSpecialisesInitiale && school.mastersSpecialisesInitiale.length > 0 && (
            <div className="programme-group">
              <h4>Formation Initiale ({school.mastersSpecialisesInitiale.length})</h4>
              <div className="specialties-grid compact">
                {school.mastersSpecialisesInitiale
                  .slice(0, expandedSections.mastersInitiale ? undefined : 5)
                  .map((master, index) => (
                    <div key={index} className="specialty-card small">
                      <span className="specialty-icon">🎓</span>
                      <span className="specialty-name">{master}</span>
                    </div>
                  ))}
              </div>
              {school.mastersSpecialisesInitiale.length > 5 && (
                <button 
                  className="show-more-btn"
                  onClick={() => toggleSection('mastersInitiale')}
                >
                  {expandedSections.mastersInitiale ? 'Voir moins' : `Voir ${school.mastersSpecialisesInitiale.length - 5} autres`}
                </button>
              )}
            </div>
          )}

          {school.mastersSpecialisesUniversite && school.mastersSpecialisesUniversite.length > 0 && (
            <div className="programme-group">
              <h4>Université ({school.mastersSpecialisesUniversite.length})</h4>
              <div className="specialties-grid compact">
                {school.mastersSpecialisesUniversite
                  .slice(0, expandedSections.mastersUniversite ? undefined : 5)
                  .map((master, index) => (
                    <div key={index} className="specialty-card small">
                      <span className="specialty-icon">🏛️</span>
                      <span className="specialty-name">{master}</span>
                    </div>
                  ))}
              </div>
              {school.mastersSpecialisesUniversite.length > 5 && (
                <button 
                  className="show-more-btn"
                  onClick={() => toggleSection('mastersUniversite')}
                >
                  {expandedSections.mastersUniversite ? 'Voir moins' : `Voir ${school.mastersSpecialisesUniversite.length - 5} autres`}
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}

      {school.licencesProfessionnelles && school.licencesProfessionnelles.length > 0 && (
        <div className="academique-section">
          <h3>Licences Professionnelles ({school.licencesProfessionnelles.length})</h3>
          <div className="specialties-grid compact">
            {school.licencesProfessionnelles
              .slice(0, expandedSections.licences ? undefined : 6)
              .map((licence, index) => (
                <div key={index} className="specialty-card small">
                  <span className="specialty-icon">📜</span>
                  <span className="specialty-name">{licence}</span>
                </div>
              ))}
          </div>
          {school.licencesProfessionnelles.length > 6 && (
            <button 
              className="show-more-btn"
              onClick={() => toggleSection('licences')}
            >
              {expandedSections.licences ? 'Voir moins' : `Voir les ${school.licencesProfessionnelles.length - 6} autres`}
            </button>
          )}
        </div>
      )}

      {school.equipements && school.equipements.length > 0 && (
        <div className="academique-section">
          <h3>Équipements & Installations ({school.equipements.length})</h3>
          <div className="specialties-grid compact">
            {school.equipements
              .slice(0, expandedSections.equipements ? undefined : 4)
              .map((equipement, index) => (
                <div key={index} className="specialty-card small">
                  <span className="specialty-icon">🏢</span>
                  <span className="specialty-name">{equipement}</span>
                </div>
              ))}
          </div>
          {school.equipements.length > 4 && (
            <button 
              className="show-more-btn"
              onClick={() => toggleSection('equipements')}
            >
              {expandedSections.equipements ? 'Voir moins' : `Voir les ${school.equipements.length - 4} autres`}
            </button>
          )}
        </div>
      )}

      {school.laboratoiresRecherche && school.laboratoiresRecherche.length > 0 && (
        <div className="academique-section">
          <h3>Laboratoires de Recherche ({school.laboratoiresRecherche.length})</h3>
          <div className="specialties-grid compact">
            {school.laboratoiresRecherche
              .slice(0, expandedSections.laboratoires ? undefined : 4)
              .map((labo, index) => (
                <div key={index} className="specialty-card small">
                  <span className="specialty-icon">🔬</span>
                  <span className="specialty-name">{labo}</span>
                </div>
              ))}
          </div>
          {school.laboratoiresRecherche.length > 4 && (
            <button 
              className="show-more-btn"
              onClick={() => toggleSection('laboratoires')}
            >
              {expandedSections.laboratoires ? 'Voir moins' : `Voir les ${school.laboratoiresRecherche.length - 4} autres`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AcademiqueTab;