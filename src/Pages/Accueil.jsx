
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
  const [filters, setFilters] = useState({}); 

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      
     
      const allSchools = await dataService.getAllEcoles();
      
     
      const topRated = [...allSchools]
        .sort((a, b) => b.note - a.note)
        .slice(0, 6);
      
     
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
      
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      
      const results = await dataService.searchEcoles(searchTerm);
      setSearchResults(results.slice(0, 8)); 
    } catch (error) {
      console.error('Search error:', error);
    }
  };

 
  const handleFilter = async (newFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    
    try {
    
      const filteredResults = await dataService.filterEcoles(newFilters);
      setSearchResults(filteredResults.slice(0, 8));
      
      
      if (newFilters.ville || newFilters.specialite || newFilters.type) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Filter error:', error);
    }
  };


  const getDisplayedResults = () => {
    if (isSearching && searchResults.length > 0) {
      return searchResults;
    }
    return [];
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
     
      <section className="hero-section">
       
        <div className="search-container">
          <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        </div>
      </section>

     
      <section className="results-section">
        {isSearching ? (
          <>
            <h2 className="section-title">
              {searchResults.length > 0 
                ? `Résultats (${searchResults.length})` 
                : 'Résultats de recherche'
              }
            </h2>
            
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
                  onClick={() => {
                    setIsSearching(false);
                    handleFilter({}); 
                  }} 
                  className="back-btn"
                >
                  Retour aux écoles recommandées
                </button>
              </div>
            )}
            
          
            {(filters.ville || filters.specialite || filters.type) && (
              <div className="active-filters">
                <p>Filtres actifs:</p>
                <div className="filter-tags">
                  {filters.ville && (
                    <span className="filter-tag">
                      Ville: {filters.ville} 
                      <button 
                        onClick={() => handleFilter({...filters, ville: ''})}
                        className="remove-filter"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {filters.specialite && (
                    <span className="filter-tag">
                      Spécialité: {filters.specialite}
                      <button 
                        onClick={() => handleFilter({...filters, specialite: ''})}
                        className="remove-filter"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {filters.type && (
                    <span className="filter-tag">
                      Type: {filters.type}
                      <button 
                        onClick={() => handleFilter({...filters, type: ''})}
                        className="remove-filter"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
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
