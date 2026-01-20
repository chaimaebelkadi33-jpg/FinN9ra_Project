import React, { useState } from 'react';
import '../Styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique pour envoyer le formulaire
    console.log('Formulaire soumis:', formData);
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1 className="contact-title">Contactez-nous</h1>
        <p className="contact-subtitle">Nous sommes là pour vous aider à trouver la meilleure école</p>
      </div>

      <div className="contact-container">
        <div className="contact-info-section">
          <div className="contact-info-card">
            <h2 className="info-title">Informations de contact</h2>
            <p className="info-description">
              Pour toute question concernant notre plateforme ou pour obtenir de l'aide dans votre recherche d'école, n'hésitez pas à nous contacter.
            </p>

            <div className="contact-details">
              {/* Équipe Finn9ra */}
              <div className="contact-team">
                <h3 className="team-title">Équipe FinN9ra?</h3>
                
                <div className="team-member">
                  <h4 className="member-name">Widad Barri</h4>
                  <div className="member-links">
                    <a href="https://www.instagram.com/aa.widade?igsh=aWRzY2hxeng3a2hj&utm_source=qr" 
                       className="member-link" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i> Instagram
                    </a>
                    <a href="https://www.facebook.com/share/1D9oeGJ8Jr/?mibextid=wwXIfr" 
                       className="member-link" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <i className="fab fa-facebook-f"></i> Facebook
                    </a>
                    <a href="https://www.linkedin.com/in/widad-barri-aa8b8838a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
                       className="member-link" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <i className="fab fa-linkedin-in"></i> LinkedIn
                    </a>
                  </div>
                </div>

                <div className="team-member">
                  <h4 className="member-name">Chaimae Belkadi</h4>
                  <div className="member-links">
                    <a href="https://www.instagram.com/c.blk0?igsh=MXV6ZnF1aG1kcmVmdA%3D%3D&utm_source=qr" 
                       className="member-link" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <i className="fab fa-instagram"></i> Instagram
                    </a>
                    <a href="https://www.facebook.com/share/188m4ihA69/?mibextid=wwXIfr" 
                       className="member-link" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <i className="fab fa-facebook-f"></i> Facebook
                    </a>
                    <a href="https://www.linkedin.com/in/chaimae-belkadi-2a72ab292?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
                       className="member-link" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      <i className="fab fa-linkedin-in"></i> LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* Email général */}
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <h4>Email</h4>
                  <p>contact@finn9ra.ma</p>
                </div>
              </div>

              {/* Localisation */}
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-text">
                  <h4>Localisation</h4>
                  <p>Maroc</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="contact-form-section">
          <div className="contact-form-card">
            <h2 className="form-title">Envoyez-nous un message</h2>
            <p className="form-subtitle">Remplissez le formulaire ci-dessous et nous vous répondrons rapidement</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nom complet *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="votre@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Sujet *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Objet de votre message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  required
                  rows="6"
                  placeholder="Décrivez-nous votre demande..."
                />
              </div>

              <button type="submit" className="submit-btn">
                Envoyer le message
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;