import React from 'react';
import '../Styles/footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        
        <div className="footer-section">
          <div className="footer-logo">
            <h2 className="footer-title">Fin N9ra?</h2>
            <p className="footer-tagline">Plateforme intelligente pour aider les parents et étudiants à trouver la meilleure école au Maroc.</p>
          </div>
        </div>

    
        <div className="footer-sections">
          
       
          <div className="footer-section">
            <h3 className="section-title">Plateforme</h3>
            <ul className="footer-links">
              <li><a href="/" className="footer-link">Accueil</a></li>
              <li><a href="/ecoles" className="footer-link">Liste des écoles</a></li>
            </ul>
          </div>

 
          <div className="footer-section">
            <h3 className="section-title">À propos</h3>
            <ul className="footer-links">
              <li><a href="/about" className="footer-link">Qui sommes-nous</a></li>
              <li><a href="/contact" className="footer-link">Contact</a></li>
            </ul>
          </div>

     
          <div className="footer-section">
            <h3 className="section-title">Réseaux sociaux</h3>
            <div className="social-icons">
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>


        <div className="footer-bottom">
          <p className="copyright">
            © 2026 Fin N9ra? — Tous droits réservés
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;