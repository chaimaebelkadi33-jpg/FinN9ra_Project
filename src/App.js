import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Styles/global.css";
// Import Components
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import EcoleDetails from "./Pages/EcoleDetail";
import About from "./Components/About";
// Import Pages
import Accueil from "./Pages/Accueil";
import Ecoles from "./Pages/Ecoles";
import ContactPage from "./Components/ContactPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import PageError from "./Components/PageError";
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/ecoles" element={<Ecoles />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        <Route path="/EcoleDetail/:id" element={<EcoleDetails />} />
        <Route path="/ecole/:id" element={<EcoleDetails />} />
            <Route path="*" element={<PageError/>}/>
            <Route path="/About" element={<About/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
