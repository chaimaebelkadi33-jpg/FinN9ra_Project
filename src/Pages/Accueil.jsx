// src/Pages/Accueil.jsx - UPDATED with accent-insensitive search
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../Components/SearchBar';
import SchoolCard from '../Components/SchoolCard';
import { dataService } from '../Services/dataService';
import '../Styles/accueil.css';

// Helper function to remove accents
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Memoized SchoolCard for better performance
const MemoizedSchoolCard = React.memo(SchoolCard);

function Accueil() {
  const [featuredSchools, setFeaturedSchools] = useState([]);
  const [rabatSchools, setRabatSchools] = useState([]);
  const [allSchools, setAllSchools] = useState([]); // Store all schools for local filtering
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      
      const schools = await dataService.getAllEcoles();
      setAllSchools(schools); // Store all schools
      
      const topRated = [...schools]
        .sort((a, b) => b.note - a.note)
        .slice(0, 6);
      
      const rabat = schools
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

  // Local search function for accent-insensitive search
  const performLocalSearch = useCallback((searchTerm, currentFilters) => {
    if (!searchTerm.trim() && !currentFilters.ville && !currentFilters.specialite && !currentFilters.type) {
      setIsSearching(false);
      return [];
    }

    let results = [...allSchools];

    // Apply text search
    if (searchTerm.trim()) {
      const normalizedQuery = removeAccents(searchTerm.toLowerCase());
      results = results.filter(school => {
        const schoolName = removeAccents(school.nom?.toLowerCase() || '');
        const schoolCity = removeAccents(school.ville?.toLowerCase() || '');
        const schoolType = removeAccents(school.type?.toLowerCase() || '');
        
        return (
          schoolName.includes(normalizedQuery) ||
          schoolCity.includes(normalizedQuery) ||
          schoolType.includes(normalizedQuery)
        );
      });
    }

    // Apply filters with accent-insensitive matching
    if (currentFilters.ville) {
      const normalizedVille = removeAccents(currentFilters.ville.toLowerCase());
      results = results.filter(school => {
        const schoolVille = removeAccents(school.ville?.toLowerCase() || '');
        return schoolVille === normalizedVille;
      });
    }

    if (currentFilters.type) {
      const normalizedType = removeAccents(currentFilters.type.toLowerCase());
      results = results.filter(school => {
        const schoolType = removeAccents(school.type?.toLowerCase() || '');
        return schoolType === normalizedType;
      });
    }

    if (currentFilters.specialite) {
      const normalizedSpecialite = removeAccents(currentFilters.specialite.toLowerCase());
      results = results.filter(school => {
        if (!school.specialites || !Array.isArray(school.specialites)) return false;
        
        return school.specialites.some(specialite => {
          const normalizedSchoolSpecialite = removeAccents(specialite.toLowerCase());
          return normalizedSchoolSpecialite === normalizedSpecialite;
        });
      });
    }

    return results.slice(0, 8);
  }, [allSchools]);

  const handleSearch = useCallback((normalizedQuery, originalQuery) => {
    setSearchQuery(normalizedQuery);
    
    if (!normalizedQuery.trim() && !filters.ville && !filters.specialite && !filters.type) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Perform local search with accent-insensitive matching
    const results = performLocalSearch(normalizedQuery, filters);
    setSearchResults(results);
  }, [filters, performLocalSearch]);

  const handleFilter = useCallback((newFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    
    if (!searchQuery.trim() && !newFilters.ville && !newFilters.specialite && !newFilters.type) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Perform local search with new filters
    const results = performLocalSearch(searchQuery, newFilters);
    setSearchResults(results);
  }, [searchQuery, performLocalSearch]);

  const clearFilter = useCallback((filterType) => {
    const updatedFilters = { ...filters, [filterType]: '' };
    setFilters(updatedFilters);
    
    if (!searchQuery.trim() && !updatedFilters.ville && !updatedFilters.specialite && !updatedFilters.type) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    const results = performLocalSearch(searchQuery, updatedFilters);
    setSearchResults(results);
  }, [filters, searchQuery, performLocalSearch]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  }, []);

  const getDisplayedResults = () => {
    if (isSearching && searchResults.length > 0) {
      return searchResults;
    }
    return [];
  };

  if (loading) {
    return (
      <div className="accueil-page">
        <div className="accueil-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des écoles...</p>
        </div>
      </div>
    );
  }

  const displayedResults = getDisplayedResults();
  const hasActiveFilters = filters.ville || filters.specialite || filters.type;
  const hasActiveSearch = isSearching && (searchQuery.trim() || hasActiveFilters);

  return (
    <div className="accueil-page">
      {/* Hero Section with Search */}
      <section className="accueil-hero">
        <div className="accueil-search-container">
          <SearchBar 
            onSearch={handleSearch} 
            onFilter={handleFilter} 
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="accueil-results">
        {hasActiveSearch ? (
          <>
            <h2 className="accueil-title">
              {displayedResults.length > 0 
                ? `Résultats (${displayedResults.length})` 
                : 'Résultats de recherche'
              }
            </h2>
            
            {displayedResults.length > 0 ? (
              <div className="accueil-schools-grid">
                {displayedResults.map(school => (
                  <MemoizedSchoolCard key={school.idEcole} school={school} />
                ))}
              </div>
            ) : (
              <div className="accueil-no-results">
                <p>Aucune école trouvée. Essayez avec d'autres mots-clés ou filtres.</p>
                <button 
                  onClick={clearAllFilters}
                  className="accueil-back-btn"
                >
                  Retour aux écoles recommandées
                </button>
              </div>
            )}
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="accueil-active-filters">
                <p>Filtres actifs:</p>
                <div className="accueil-filter-tags">
                  {filters.ville && (
                    <span className="accueil-filter-tag">
                      Ville: {filters.ville} 
                      <button 
                        onClick={() => clearFilter('ville')}
                        className="accueil-remove-filter"
                        aria-label="Supprimer le filtre ville"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {filters.specialite && (
                    <span className="accueil-filter-tag">
                      Spécialité: {filters.specialite}
                      <button 
                        onClick={() => clearFilter('specialite')}
                        className="accueil-remove-filter"
                        aria-label="Supprimer le filtre spécialité"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {filters.type && (
                    <span className="accueil-filter-tag">
                      Type: {filters.type}
                      <button 
                        onClick={() => clearFilter('type')}
                        className="accueil-remove-filter"
                        aria-label="Supprimer le filtre type"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {(filters.ville || filters.specialite || filters.type) && (
                    <button 
                      onClick={clearAllFilters}
                      className="accueil-clear-all-filters"
                    >
                      Effacer tous
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="accueil-title">Écoles recommandées</h2>
            <div className="accueil-schools-grid">
              {featuredSchools.map(school => (
                <MemoizedSchoolCard key={school.idEcole} school={school} />
              ))}
            </div>
            
            <div className="accueil-view-all">
              <Link to="/ecoles" className="accueil-view-all-btn">
                Voir toutes les écoles →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Rabat Schools Section (only show when not searching) */}
      {!hasActiveSearch && (
        <section className="accueil-city-section">
          <div className="accueil-section-header">
            <h2 className="accueil-title">Écoles à Rabat</h2>
            <Link to="/ecoles?ville=Rabat" className="accueil-city-link">
              Voir toutes les écoles à Rabat →
            </Link>
          </div>
          
          <div className="accueil-schools-grid">
            {rabatSchools.map(school => (
              <MemoizedSchoolCard key={school.idEcole} school={school} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default React.memo(Accueil);