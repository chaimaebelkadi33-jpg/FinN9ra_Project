import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    city: '',
    cost: '',
    description: '',
    schoolType: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Options pour les types d'école
  const schoolTypeOptions = [
    { value: '', label: 'اختر نوع المؤسسة / Choisir le type d\'établissement' },
    { value: 'public', label: 'مدرسة عمومية / École publique' },
    { value: 'private', label: 'مدرسة خاصة / École privée' },
    { value: 'international', label: 'مدرسة دولية / École internationale' },
    { value: 'professional', label: 'مؤسسة تكوين مهني / Centre de formation professionnelle' },
    { value: 'language', label: 'معهد لغة / Institut de langue' },
    { value: 'university', label: 'جامعة / Université' },
    { value: 'other', label: 'أخرى / Autre' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة / Les mots de passe ne correspondent pas');
      return;
    }

    // Validation du type d'école
    if (!formData.schoolType) {
      alert('الرجاء اختيار نوع المؤسسة / Veuillez choisir le type d\'établissement');
      return;
    }

    console.log('Registration Data:', formData);
    // Logique d'inscription de l'école ici
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1 className="project-title">?FinN9ra</h1>
        <h2 className="register-title">تسجيل مؤسسة تعليمية / Inscription d'établissement</h2>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        {/* Nom de l'école */}
        <div className="input-group">
          <label htmlFor="schoolName">
            اسم المؤسسة / Nom de l'établissement
          </label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            placeholder="ادخل اسم المؤسسة / Entrez le nom de l'établissement"
            required
          />
        </div>

        {/* Ville */}
        <div className="input-group">
          <label htmlFor="city">
            المدينة / Ville
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="ادخل المدينة / Entrez la ville"
            required
          />
        </div>

        {/* Coût */}
        <div className="input-group">
          <label htmlFor="cost">
            التكلفة الشهرية  / Coût mensuel 
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder=" التكلفة الشهرية /  le coût mensuel"
            min="0"
            step="100000"
            required
          />
        </div>

        {/* Type d'école */}
        <div className="input-group">
          <label htmlFor="schoolType">
            نوع المؤسسة / Type d'établissement
          </label>
          <select
            id="schoolType"
            name="schoolType"
            value={formData.schoolType}
            onChange={handleChange}
            required
          >
            {schoolTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="input-group">
          <label htmlFor="description">
            وصف المؤسسة / Description 
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="ادخل وصفًا للمؤسسة  "
            rows="4"
            required
          />
        </div>

        {/* Email */}
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
            placeholder="ادخل بريد المؤسسة الإلكتروني / Entrez l'email de l'établissement"
            required
          />
        </div>

        {/* Mot de passe */}
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
            minLength="6"
            required
          />
        </div>

        {/* Confirmation du mot de passe */}
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
            minLength="6"
            required
          />
        </div>

        {/* Bouton d'inscription */}
        <button type="submit" className="register-button">
          تسجيل المؤسسة / Enregistrer l'établissement
        </button>
      </form>

      <div className="login-section">
        <p className="login-text">
          لديك حساب بالفعل؟<br />
          ?Vous avez déjà un compte
        </p>
        <Link to="/login" className="login-link">
          تسجيل الدخول / Se connecter
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;