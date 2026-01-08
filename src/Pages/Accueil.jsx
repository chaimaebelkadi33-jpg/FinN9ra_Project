// src/Pages/Accueil.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';
import SchoolCard from '../Components/SchoolCard';
import { dataService } from '../Services/dataService';
import '../Styles/accueil.css';
function Accueil() {
  const [featuredSchools, setFeaturedSchools] = useState([]);
  const [rabatSchools, setRabatSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      
      // Get ALL schools first
      const allSchools = await dataService.getAllEcoles();
      
      // Get top rated schools (sort by note and take first 6)
      const topRated = [...allSchools]
        .sort((a, b) => b.note - a.note)
        .slice(0, 6);
      
      // Get schools from Rabat
      const rabat = allSchools
        .filter(school => school.ville === 'Rabat')
        .slice(0, 4);
      
      setFeaturedSchools(topRated);
      setRabatSchools(rabat);
      
    } catch (error) {
      console.error('Error loading schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      // If search is empty, show featured schools
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Use the dataService to search
      const results = await dataService.searchEcoles(searchTerm);
      setSearchResults(results.slice(0, 8)); // Show first 8 results
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  if (loading) {
    return (
      <div className="accueil-page">
        <div className="loading">Chargement des écoles...</div>
      </div>
    );
  }

  return (
    <div className="accueil-page">
      {/* Section 1: Hero with SearchBar */}
      <section className="hero-section">
        {/* SearchBar Component */}
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Section 2: Search Results OR Featured Schools */}
      <section className="results-section">
        {isSearching ? (
          <>
            <h2 className="section-title">Résultats de recherche</h2>
            {searchResults.length > 0 ? (
              <div className="schools-grid">
                {searchResults.map(school => (
                  <SchoolCard key={school.idEcole} school={school} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>Aucune école trouvée. Essayez avec d'autres mots-clés.</p>
                <button 
                  onClick={() => setIsSearching(false)} 
                  className="back-btn"
                >
                  Retour aux écoles recommandées
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="section-title">Écoles recommandées</h2>
            <div className="schools-grid">
              {featuredSchools.map(school => (
                <SchoolCard key={school.idEcole} school={school} />
              ))}
            </div>
            
            <div className="view-all-container">
              <Link to="/ecoles" className="view-all-btn">
                Voir toutes les écoles →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Section 3: Rabat Schools (only show when not searching) */}
      {!isSearching && (
        <section className="city-section">
          <div className="section-header">
            <h2 className="section-title">Écoles à Rabat</h2>
            <Link to="/ecoles?ville=Rabat" className="city-link">
              Voir toutes les écoles à Rabat →
            </Link>
          </div>
          
          <div className="schools-grid">
            {rabatSchools.map(school => (
              <SchoolCard key={school.idEcole} school={school} />
            ))}
          </div>
        </section>
      )}
</div>
  );
}

export default Accueil;