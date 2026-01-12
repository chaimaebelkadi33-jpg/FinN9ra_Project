import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Styles/global.css';

// Import Components
import Header from './Components/Header';
import Footer from './Components/Footer';

// Import Pages
import Accueil from './Pages/Accueil';
// import Ecoles from './Pages/Ecoles';
// import EcoleDetail from './Pages/EcoleDetail';
import Avis from './Pages/Avis';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import PageError from './Components/PageError';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Accueil />} />
            {/* <Route path="/ecoles" element={<Ecoles />} /> */}
            {/* <Route path="/ecole/:id" element={<EcoleDetail />} /> */}
            <Route path="/avis" element={<Avis />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<PageError/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
