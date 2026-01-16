import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة / Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Registration Data:', formData);
    // Logique d'inscription ici
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1 className="project-title">Fin N9ra?</h1>
        <h2 className="register-title">تسجيل / S'inscrire</h2>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <label htmlFor="firstName">
            الاسم الأول / Prénom
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="ادخل اسمك الأول / Entrez votre prénom"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="lastName">
            اسم العائلة / Nom
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="ادخل اسم عائلتك / Entrez votre nom"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">
            البريد الإلكتروني / Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ادخل بريدك الإلكتروني / Entrez votre email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">
            كلمة المرور / Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="ادخل كلمة المرور / Entrez votre mot de passe"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">
            تأكيد كلمة المرور / Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="أعد إدخال كلمة المرور / Confirmez votre mot de passe"
            required
          />
        </div>

        <button type="submit" className="register-button">
          إنشاء حساب / Créer un compte
        </button>
      </form>

      <div className="login-section">
        <p className="login-text">
          لديك حساب بالفعل؟<br />
          Vous avez déjà un compte?
        </p>
        <a href="/login" className="login-link">
          تسجيل الدخول / Se connecter
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
