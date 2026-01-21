// src/Components/Header.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../Styles/header.css';
import logo from '../Assets/logo/logo.jpg';

const Header = () => {
  const [isFrench, setIsFrench] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        
        {/* Logo et Titre à GAUCHE (côte à côte) */}
        <div className="brand-section">
          <NavLink to="/" className="brand-link" onClick={closeMobileMenu}>
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
              <h1 className="brand-title">FinN9ra?</h1>
              <p className="brand-subtitle">اختيار واضح... مستقبل أوضح</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation à DROITE */}
        <nav className="main-navigation">
          <ul className="nav-items">
            <li className="nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-text">Accueil</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/ecoles" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-text">Écoles</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-text">Contact</span>
              </NavLink>
            </li>
            {/* Login Button */}
            <li className="nav-item login-item">
              <NavLink to="/login" className="login-button" onClick={closeMobileMenu}>
                <span className="login-text">Connexion</span>
              </NavLink>
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
          </div>

          <ul className="mobile-nav-items">
            <li className="mobile-nav-item">
              <NavLink 
                to="/" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-home"></i>
                <span>Accueil</span>
              </NavLink>
            </li>
            <li className="mobile-nav-item">
              <NavLink 
                to="/ecoles" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-school"></i>
                <span>Écoles</span>
              </NavLink>
            </li>
            <li className="mobile-nav-item">
              <NavLink 
                to="/avis" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-comment-dots"></i>
                <span>Avis</span>
              </NavLink>
            </li>
            <li className="mobile-nav-item">
              <NavLink 
                to="/contact" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-envelope"></i>
                <span>Contact</span>
              </NavLink>
            </li>
            <li className="mobile-nav-item">
              <NavLink 
                to="/login" 
                className="mobile-login-btn"
                onClick={closeMobileMenu}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Connexion</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;