import React from "react";

function ContactTab({ school }) {
  return (
    <div className="contact-tab">
      {(school.universiteAffiliation || school.anneeCreation) && (
  <div className="contact-info-summary">
    <h3 className="contact-section-title">
      <span className="contact-title-icon">🏫</span>
      Informations Générales
    </h3>
    <div className="contact-summary-grid">
      {school.universiteAffiliation && (
        <div className="contact-summary-card">
          <h4 className="contact-summary-title">Université d'Affiliation</h4>
          <div className="contact-summary-content">
            <span className="contact-summary-icon">🏛️</span>
            <p className="contact-summary-value">{school.universiteAffiliation}</p>
          </div>
        </div>
      )}

      {school.anneeCreation && (
        <div className="contact-summary-card">
          <h4 className="contact-summary-title">Année de Création</h4>
          <div className="contact-summary-content">
            <span className="contact-summary-icon">📅</span>
            <p className="contact-summary-value">{school.anneeCreation}</p>
          </div>
        </div>
      )}
    </div>
  </div>
)}

      <div className="contact-grid">
        {school.telephone && (
          <div className="contact-card">
            <span className="contact-icon">📞</span>
            <div className="contact-content">
              <h4>Téléphone</h4>
              <a href={`tel:${school.telephone}`} className="contact-link">
                {school.telephone}
              </a>
            </div>
          </div>
        )}

        {school.siteWeb && (
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
        )}

        {school.contact &&
          school.contact !== "Information non spécifiée sur la page" && (
            <div className="contact-card">
              <span className="contact-icon">📧</span>
              <div className="contact-content">
                <h4>Email</h4>
                <a href={`mailto:${school.contact}`} className="contact-link">
                  {school.contact}
                </a>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default ContactTab;
