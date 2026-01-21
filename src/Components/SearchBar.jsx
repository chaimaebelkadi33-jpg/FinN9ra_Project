// src/Components/SearchBar.jsx - COMPLETE VERSION
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { dataService } from '../Services/dataService';
import "../Styles/searchBar.css";

// Helper function to remove accents for accent-insensitive search
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Debounce function for search performance
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const SearchBar = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    ville: "",
    specialite: "",
    type: ""
  });
  
  const [filterOptions, setFilterOptions] = useState({
    villes: [],
    specialites: [],
    types: []
  });
  
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const searchbarRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load all schools data for suggestions (optimized)
  const [allSchools, setAllSchools] = useState([]);
  
  // Fetch filter options with loading states
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoadingFilters(true);
        const options = await dataService.getFilterOptions();
        setFilterOptions({
          villes: options.villes,
          specialites: options.specialites,
          types: options.types
        });
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setLoadingFilters(false);
      }
    };
    
    loadFilterOptions();
  }, []);

  // Load schools data for suggestions (optimized - only once)
  useEffect(() => {
    const loadSchoolsForSuggestions = async () => {
      try {
        // If you have a method to get all schools
        const schools = await dataService.getAllEcoles();
        setAllSchools(schools || []);
        setLoading(false);
      } catch (error) {
        console.error("Error loading schools for suggestions:", error);
        setAllSchools([]);
        setLoading(false);
      }
    };
    
    loadSchoolsForSuggestions();
  }, []);

  // Generate suggestions based on query
  const generateSuggestions = useCallback((searchQuery) => {
    if (!searchQuery.trim() || !allSchools.length) {
      setSuggestions([]);
      return;
    }

    const queryLower = removeAccents(searchQuery.toLowerCase());
    
    const matchedSuggestions = allSchools
      .filter(school => {
        if (!school.nom || !school.ville || !school.type) return false;
        
        const schoolName = removeAccents(school.nom.toLowerCase());
        const schoolCity = removeAccents(school.ville.toLowerCase());
        const schoolType = removeAccents(school.type.toLowerCase());
        
        return (
          schoolName.includes(queryLower) ||
          schoolCity.includes(queryLower) ||
          schoolType.includes(queryLower)
        );
      })
      .slice(0, 5) // Limit to 5 suggestions
      .map(school => ({
        id: school.idEcole || school.id,
        name: school.nom,
        type: school.type,
        city: school.ville,
        matchType: removeAccents(school.nom.toLowerCase()).includes(queryLower) ? 'name' :
                  removeAccents(school.ville.toLowerCase()).includes(queryLower) ? 'city' : 'type'
      }));
    
    setSuggestions(matchedSuggestions);
  }, [allSchools]);

  // Debounced search handler for better performance
  const debouncedSearch = useMemo(
    () => debounce((searchQuery) => {
      if (typeof onSearch === "function") {
        // Remove accents before sending to parent
        const normalizedQuery = removeAccents(searchQuery);
        onSearch(normalizedQuery, searchQuery);
      }
    }, 300),
    [onSearch]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Generate suggestions
    generateSuggestions(value);
    
    // Debounced search
    debouncedSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (typeof onSearch === "function") {
      onSearch(removeAccents(query), query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    
    if (typeof onSearch === "function") {
      onSearch(removeAccents(suggestion.name), suggestion.name);
    }
  };

  const toggleDropdown = (filterType) => {
    if (window.innerWidth <= 768) {
      if (activeDropdown === filterType) {
        document.body.classList.remove('sb-dropdown-open');
        setActiveDropdown(null);
      } else {
        document.body.classList.add('sb-dropdown-open');
        setActiveDropdown(filterType);
      }
    } else {
      setActiveDropdown(activeDropdown === filterType ? null : filterType);
    }
  };

  const selectFilter = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: activeFilters[filterType] === value ? "" : value
    };
    
    setActiveFilters(newFilters);
    setActiveDropdown(null);
    
    if (typeof onFilter === "function") {
      onFilter(newFilters);
    }
  };

  const clearFilter = (filterType) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: ""
    };
    
    setActiveFilters(newFilters);
    
    if (typeof onFilter === "function") {
      onFilter(newFilters);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({ ville: "", specialite: "", type: "" });
    setActiveDropdown(null);
    
    if (typeof onFilter === "function") {
      onFilter({});
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 768 && activeDropdown && 
          !e.target.closest('.sb-filter-tag-container') &&
          !e.target.closest('.sb-filter-dropdown')) {
        document.body.classList.remove('sb-dropdown-open');
        setActiveDropdown(null);
      }
      
      // Close suggestions when clicking outside
      if (showSuggestions && suggestionsRef.current && 
          !suggestionsRef.current.contains(e.target) &&
          searchbarRef.current && 
          !searchbarRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown, showSuggestions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('sb-dropdown-open');
      // Clear any pending debounced calls
      debouncedSearch.cancel?.();
    };
  }, []);

  const hasActiveFilters = activeFilters.ville || activeFilters.specialite || activeFilters.type;

  return (
    <div className="searchbar-container" ref={searchbarRef}>
      <h2 className="searchbar-title">
        ابحث عن مدرستك
        <br />
        <span>Trouvez votre école</span>
      </h2>

      <form className="searchbar-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="...بحث عن مدرستك / Rechercher une école..."
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowSuggestions(true)}
          aria-label="Rechercher une école"
        />
        <button type="submit" className="search-btn">
          بحث
        </button>
        
        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions" ref={suggestionsRef}>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div 
                  key={`${suggestion.id}-${index}`}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-name">{suggestion.name}</div>
                  <div className="suggestion-details">
                    <span className="suggestion-type">{suggestion.type}</span>
                    <span className="suggestion-city"> - {suggestion.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      <div className="searchbar-filters">
        {/* Ville Filter Tag */}
        <div className="sb-filter-tag-container">
          <div 
            className={`sb-filter-tag ${activeFilters.ville ? 'active' : ''}`}
            onClick={() => toggleDropdown('ville')}
            role="button"
            tabIndex={0}
          >
            {activeFilters.ville || 'Ville'}
            {activeFilters.ville && (
              <span 
                className="sb-remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter('ville');
                }}
                aria-label="Effacer le filtre ville"
              >
                ✕
              </span>
            )}
          </div>
          
          {activeDropdown === 'ville' && (
            <div className="sb-filter-dropdown active">
              <div className="sb-dropdown-options">
                {filterOptions.villes.map((ville, index) => (
                  <div 
                    key={index}
                    className={`sb-dropdown-option ${activeFilters.ville === ville ? 'selected' : ''}`}
                    onClick={() => selectFilter('ville', ville)}
                    role="button"
                    tabIndex={0}
                  >
                    {ville}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spécialité Filter Tag */}
        <div className="sb-filter-tag-container">
          <div 
            className={`sb-filter-tag ${activeFilters.specialite ? 'active' : ''}`}
            onClick={() => toggleDropdown('specialite')}
            role="button"
            tabIndex={0}
          >
            {activeFilters.specialite || 'Spécialité'}
            {activeFilters.specialite && (
              <span 
                className="sb-remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter('specialite');
                }}
                aria-label="Effacer le filtre spécialité"
              >
                ✕
              </span>
            )}
          </div>
          
          {activeDropdown === 'specialite' && (
            <div className="sb-filter-dropdown active">
              <div className="sb-dropdown-options">
                {filterOptions.specialites.map((specialite, index) => (
                  <div 
                    key={index}
                    className={`sb-dropdown-option ${activeFilters.specialite === specialite ? 'selected' : ''}`}
                    onClick={() => selectFilter('specialite', specialite)}
                    role="button"
                    tabIndex={0}
                  >
                    {specialite}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Type Filter Tag */}
        <div className="sb-filter-tag-container">
          <div 
            className={`sb-filter-tag ${activeFilters.type ? 'active' : ''}`}
            onClick={() => toggleDropdown('type')}
            role="button"
            tabIndex={0}
          >
            {activeFilters.type || 'Type'}
            {activeFilters.type && (
              <span 
                className="sb-remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter('type');
                }}
                aria-label="Effacer le filtre type"
              >
                ✕
              </span>
            )}
          </div>
          
          {activeDropdown === 'type' && (
            <div className="sb-filter-dropdown active">
              <div className="sb-dropdown-options">
                {filterOptions.types.map((type, index) => (
                  <div 
                    key={index}
                    className={`sb-dropdown-option ${activeFilters.type === type ? 'selected' : ''}`}
                    onClick={() => selectFilter('type', type)}
                    role="button"
                    tabIndex={0}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button 
            type="button" 
            onClick={clearAllFilters}
            className="sb-clear-filters-btn"
            aria-label="Effacer tous les filtres"
          >
            Effacer tous
          </button>
        )}
      </div>

      {loadingFilters && (
        <div className="sb-filters-loading">
          Chargement des options...
        </div>
      )}
    </div>
  );
};

SearchBar.defaultProps = {
  onSearch: (query, originalQuery) => console.log("Search:", query, "Original:", originalQuery),
  onFilter: (filters) => console.log("Filters:", filters)
};

export default React.memo(SearchBar);