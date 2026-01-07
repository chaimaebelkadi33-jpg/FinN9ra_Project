// src/Components/Header.jsx
import React, { useState } from 'react';
import '../Styles/header.css';
// Import du logo depuis assets
import logo from '../Assets/logo/logo.jpg';

const Header = () => {
  const [isFrench, setIsFrench] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setIsFrench(!isFrench);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        
        {/* Logo et Titre à GAUCHE (côte à côte) */}
        <div className="brand-section">
          <a href="/" className="brand-link">
            {/* Logo image */}
            <div className="logo-container">
              <img 
                src={logo} 
                alt="Fin N9ra? Logo" 
                className="logo-image"
                onError={(e) => {
                  console.log("Logo non chargé, utilisation du fallback");
                  e.target.style.display = 'none';
                  const fallback = document.querySelector('.logo-fallback');
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback si l'image ne charge pas */}
              <div className="logo-fallback">FN</div>
            </div>
            
            {/* Texte "Fin N9ra?" à côté du logo */}
            <div className="brand-text">
              <h1 className="brand-title">Fin N9ra?</h1>
              <p className="brand-subtitle">اختيار واضح... مستقبل أوضح</p>
            </div>
          </a>
        </div>

        {/* Navigation à DROITE */}
        <nav className="main-navigation">
          <ul className="nav-items">
            <li className="nav-item">
              <a href="/" className="nav-link active">
                <span className="nav-text">Accueil</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/ecoles" className="nav-link">
                <span className="nav-text">Écoles</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/avis" className="nav-link">
                <span className="nav-text">Avis</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">
                <span className="nav-text">Contact</span>
              </a>
            </li>
            
            {/* Language Toggle */}
            <li className="nav-item language-item">
              <button 
                onClick={toggleLanguage} 
                className="language-toggle"
                aria-label="Toggle language"
              >
                <span className="language-code">{isFrench ? 'AR' : 'FR'}</span>
              </button>
            </li>

            {/* Login Button */}
            <li className="nav-item login-item">
              <a href="/login" className="login-button">
                <span className="login-text">Connexion</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            {/* Logo et texte dans mobile */}
            <div className="mobile-brand-section">
              <div className="mobile-logo-container">
                <img 
                  src={logo} 
                  alt="Fin N9ra? Logo" 
                  className="mobile-logo-image"
                />
                <div className="mobile-logo-fallback">FN</div>
              </div>
              <div className="mobile-brand-text">
                <h2>Fin N9ra?</h2>
              </div>
            </div>
            <button className="mobile-close" onClick={toggleMenu}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <ul className="mobile-nav-items">
            <li className="mobile-nav-item">
              <a href="/" className="mobile-nav-link active" onClick={toggleMenu}>
                <i className="fas fa-home"></i>
                <span>Accueil</span>
              </a>
            </li>
            <li className="mobile-nav-item">
              <a href="/ecoles" className="mobile-nav-link" onClick={toggleMenu}>
                <i className="fas fa-school"></i>
                <span>Écoles</span>
              </a>
            </li>
            <li className="mobile-nav-item">
              <a href="/avis" className="mobile-nav-link" onClick={toggleMenu}>
                <i className="fas fa-comment-dots"></i>
                <span>Avis</span>
              </a>
            </li>
            <li className="mobile-nav-item">
              <a href="/contact" className="mobile-nav-link" onClick={toggleMenu}>
                <i className="fas fa-envelope"></i>
                <span>Contact</span>
              </a>
            </li>
            
            <li className="mobile-nav-item">
              <button 
                onClick={() => {
                  toggleLanguage();
                }} 
                className="mobile-language-btn"
              >
                <i className="fas fa-language"></i>
                <span>Langue</span>
                <span className="mobile-language-code">{isFrench ? 'MA_AR' : 'FR'}</span>
              </button>
            </li>

            <li className="mobile-nav-item">
              <a href="/login" className="mobile-login-btn" onClick={toggleMenu}>
                <i className="fas fa-sign-in-alt"></i>
                <span>Connexion</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;