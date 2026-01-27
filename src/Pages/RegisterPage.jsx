import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    city: "",
    cost: "",
    description: "",
    schoolType: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // School type options with French and Arabic labels
  const schoolTypeOptions = [
    { value: "", label: "Type d'établissement / نوع المؤسسة" },
    { value: "public", label: "École publique / مدرسة عمومية" },
    { value: "private", label: "École privée / مدرسة خاصة" },
    { value: "international", label: "École internationale / مدرسة دولية" },
    {
      value: "professional",
      label: "Centre de formation professionnelle / مؤسسة تكوين مهني",
    },
    { value: "language", label: "Institut de langue / معهد لغة" },
    { value: "university", label: "Université / جامعة" },
    { value: "other", label: "Autre / أخرى" },
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

    if (formData.password !== formData.confirmPassword) {
      alert(
        "Les mots de passe ne correspondent pas / كلمات المرور غير متطابقة"
      );
      return;
    }

    if (!formData.schoolType) {
      alert("Type d'établissement / نوع المؤسسة");
      return;
    }

    console.log("Registration Data:", formData);
  };

  return (
    <div className="register-container">
      {/* HEADER: FRANÇAIS À GAUCHE, ARABE À DROITE */}
      <div className="register-header">
        <h1 className="project-title">?FinN9ra</h1>
        <div className="register-subtitle">
          <span className="register-french">Inscription</span>
          <span className="register-separator">/</span>
          <span className="register-arabic">تسجيل</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email / البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez l'email de l'établissement / ادخل بريد المؤسسة الإلكتروني"
            required
          />
        </div>
        {/* Nom de l'école */}
        <div className="input-group">
          <label htmlFor="schoolName">
            Nom de l'établissement / اسم المؤسسة
          </label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            placeholder="Entrez le nom de l'établissement / ادخل اسم المؤسسة"
            required
          />
        </div>

        {/* Ville */}
        <div className="input-group">
          <label htmlFor="city">Ville / المدينة</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Entrez la ville / ادخل المدينة"
            required
          />
        </div>

        {/* Type d'école */}
        <div className="input-group">
          <label htmlFor="schoolType">Type d'établissement / نوع المؤسسة</label>
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
          <label htmlFor="description">Description / وصف المؤسسة</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Entrez une description de l'établissement / ادخل وصفًا للمؤسسة"
            rows="4"
            required
          />
        </div>
        {/* Mot de passe */}
        <div className="input-group">
          <label htmlFor="password">Mot de passe / كلمة المرور</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe / ادخل كلمة المرور"
            minLength="6"
            required
          />
        </div>

        {/* Confirmation mot de passe */}
        <div className="input-group">
          <label htmlFor="confirmPassword">
            Confirmer le mot de passe / تأكيد كلمة المرور
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmez votre mot de passe / أعد إدخال كلمة المرور"
            minLength="6"
            required
          />
        </div>

        {/* Bouton */}
        <button type="submit" className="register-button">
          Enregistrer l'établissement / تسجيل المؤسسة
        </button>
      </form>

      {/* Section Login */}
      <div className="login-section">
        <p className="login-text">
          Vous avez déjà un compte ?<br />
          لديك حساب بالفعل؟
        </p>
        <Link to="/login" className="login-link">
          Se connecter / تسجيل الدخول
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
