// Updated SearchBar.jsx - Using tags instead of dropdowns
import React, { useState, useEffect } from "react";
import { dataService } from '../Services/dataService';
import "../Styles/searchBar.css";

const SearchBar = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState("");
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
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);
        const options = await dataService.getFilterOptions();
        setFilterOptions({
          villes: options.villes,
          specialites: options.specialites,
          types: options.types
        });
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFilterOptions();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (typeof onSearch === "function") {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  };

  const toggleDropdown = (filterType) => {
    setActiveDropdown(activeDropdown === filterType ? null : filterType);
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

  const hasActiveFilters = activeFilters.ville || activeFilters.specialite || activeFilters.type;

  return (
    <div className="searchbar-container">
      <h2 className="searchbar-title">
        ابحث عن مدرستك
        <br />
        <span>Trouvez votre école</span>
      </h2>

      <form className="searchbar-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="بحث في مدرستك..."
          value={query}
          onChange={handleSearch}
        />
        <button type="submit" className="search-btn">
          بحث
        </button>
      </form>

      <div className="searchbar-filters">
        {/* Ville Filter Tag */}
        <div className="filter-tag-container" style={{ position: 'relative' }}>
          <div 
            className={`filter-tag ${activeFilters.ville ? 'active' : ''}`}
            onClick={() => toggleDropdown('ville')}
          >
            {activeFilters.ville || 'Ville'}
            {activeFilters.ville && (
              <span 
                className="remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter('ville');
                }}
              >
                ✕
              </span>
            )}
          </div>
          
          {activeDropdown === 'ville' && (
            <div className="filter-dropdown active">
              <div className="dropdown-options">
                {filterOptions.villes.map((ville, index) => (
                  <div 
                    key={index}
                    className="dropdown-option"
                    onClick={() => selectFilter('ville', ville)}
                  >
                    {ville}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spécialité Filter Tag */}
        <div className="filter-tag-container" style={{ position: 'relative' }}>
          <div 
            className={`filter-tag ${activeFilters.specialite ? 'active' : ''}`}
            onClick={() => toggleDropdown('specialite')}
          >
            {activeFilters.specialite || 'Spécialité'}
            {activeFilters.specialite && (
              <span 
                className="remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter('specialite');
                }}
              >
                ✕
              </span>
            )}
          </div>
          
          {activeDropdown === 'specialite' && (
            <div className="filter-dropdown active">
              <div className="dropdown-options">
                {filterOptions.specialites.map((specialite, index) => (
                  <div 
                    key={index}
                    className="dropdown-option"
                    onClick={() => selectFilter('specialite', specialite)}
                  >
                    {specialite}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Type Filter Tag */}
        <div className="filter-tag-container" style={{ position: 'relative' }}>
          <div 
            className={`filter-tag ${activeFilters.type ? 'active' : ''}`}
            onClick={() => toggleDropdown('type')}
          >
            {activeFilters.type || 'Type'}
            {activeFilters.type && (
              <span 
                className="remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter('type');
                }}
              >
                ✕
              </span>
            )}
          </div>
          
          {activeDropdown === 'type' && (
            <div className="filter-dropdown active">
              <div className="dropdown-options">
                {filterOptions.types.map((type, index) => (
                  <div 
                    key={index}
                    className="dropdown-option"
                    onClick={() => selectFilter('type', type)}
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
            className="clear-filters-btn"
          >
            Effacer tous
          </button>
        )}
      </div>

      {loading && (
        <div className="filters-loading">
          Chargement des options...
        </div>
      )}
    </div>
  );
};

SearchBar.defaultProps = {
  onSearch: (query) => console.log("Search:", query),
  onFilter: (filters) => console.log("Filters:", filters)
};

export default SearchBar;