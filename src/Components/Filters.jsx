// src/Components/Filters.jsx - UPDATED: Vertical layout with visible price sliders
import React, { useState, useEffect } from 'react';
import { dataService } from '../Services/dataService';
import '../Styles/filters.css';

const Filters = ({ activeFilters, onFilterChange, onReset }) => {
  const [filterOptions, setFilterOptions] = useState({
    villes: [],
    types: [],
    specialites: []
  });
  
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });

  // Fetch filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setLoading(true);
        const options = await dataService.getFilterOptions();
        setFilterOptions({
          villes: options.villes,
          types: options.types,
          specialites: options.specialites
        });

        // Calculate price range
        const allSchools = await dataService.getAllEcoles();
        const prices = allSchools.map(school => {
          const priceStr = school.cout;
          const match = priceStr.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        });
        
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        setPriceRange({ min: minPrice, max: maxPrice });

        // Initialize price filters if not set
        if (!activeFilters.minPrice || !activeFilters.maxPrice) {
          onFilterChange({
            ...activeFilters,
            minPrice: minPrice,
            maxPrice: maxPrice
          });
        }

      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFilterOptions();
  }, []);
// Add this useEffect to close dropdowns when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    // Close dropdown if click is outside filter tag and dropdown
    if (activeDropdown && 
        !event.target.closest('.filter-tag-container') &&
        !event.target.closest('.filter-dropdown')) {
      setActiveDropdown(null);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [activeDropdown]);
  const toggleDropdown = (filterType) => {
    setActiveDropdown(activeDropdown === filterType ? null : filterType);
  };

  const selectFilter = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: activeFilters[filterType] === value ? "" : value
    };
    
    setActiveDropdown(null);
    onFilterChange(newFilters);
  };

  const clearFilter = (filterType) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: ""
    };
    
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...activeFilters,
      [name]: parseInt(value)
    };
    
    onFilterChange(newFilters);
  };

  const clearPriceFilter = () => {
    onFilterChange({
      ...activeFilters,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()} MAD`;
  };

  const hasActiveFilters = 
    activeFilters.ville || 
    activeFilters.type || 
    activeFilters.specialite || 
    (activeFilters.minPrice !== undefined && activeFilters.minPrice !== priceRange.min) || 
    (activeFilters.maxPrice !== undefined && activeFilters.maxPrice !== priceRange.max);

  if (loading) {
    return (
      <div className="filters-container">
        <div className="filters-loading">Chargement des filtres...</div>
      </div>
    );
  }

  return (
    <div className="filters-container vertical-layout">
      <div className="filters-header">
        <h3>Filtres</h3>
        {hasActiveFilters && (
          <button 
            onClick={onReset}
            className="clear-filters-btn"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filters Stacked Vertically */}
      <div className="filters-stack">
        {/* Ville Filter */}
        <div className="filter-item">
          <label className="filter-label">Ville</label>
          <div className="filter-tag-container">
            <div 
              className={`filter-tag ${activeFilters.ville ? 'active' : ''}`}
              onClick={() => toggleDropdown('ville')}
            >
              {activeFilters.ville || 'Toutes les villes'}
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
                      className={`dropdown-option ${activeFilters.ville === ville ? 'selected' : ''}`}
                      onClick={() => selectFilter('ville', ville)}
                    >
                      {ville}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-item">
          <label className="filter-label">Type</label>
          <div className="filter-tag-container">
            <div 
              className={`filter-tag ${activeFilters.type ? 'active' : ''}`}
              onClick={() => toggleDropdown('type')}
            >
              {activeFilters.type || 'Tous les types'}
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
                      className={`dropdown-option ${activeFilters.type === type ? 'selected' : ''}`}
                      onClick={() => selectFilter('type', type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spécialité Filter */}
        <div className="filter-item">
          <label className="filter-label">Spécialité</label>
          <div className="filter-tag-container">
            <div 
              className={`filter-tag ${activeFilters.specialite ? 'active' : ''}`}
              onClick={() => toggleDropdown('specialite')}
            >
              {activeFilters.specialite || 'Toutes les spécialités'}
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
                  {filterOptions.specialites.slice(0, 20).map((specialite, index) => (
                    <div 
                      key={index}
                      className={`dropdown-option ${activeFilters.specialite === specialite ? 'selected' : ''}`}
                      onClick={() => selectFilter('specialite', specialite)}
                    >
                      {specialite}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Filter - ALWAYS VISIBLE with sliders */}
        <div className="filter-item price-filter-item">
          <label className="filter-label">
            Fourchette de prix: {formatPrice(activeFilters.minPrice || priceRange.min)} - {formatPrice(activeFilters.maxPrice || priceRange.max)}
          </label>
          
          <div className="price-filter-content">
            <div className="price-sliders">
              <div className="price-slider-container">
                <span className="price-label">Min: {formatPrice(activeFilters.minPrice || priceRange.min)}</span>
                <input
                  type="range"
                  name="minPrice"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={activeFilters.minPrice || priceRange.min}
                  onChange={handlePriceChange}
                  className="price-slider"
                />
              </div>
              
              <div className="price-slider-container">
                <span className="price-label">Max: {formatPrice(activeFilters.maxPrice || priceRange.max)}</span>
                <input
                  type="range"
                  name="maxPrice"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={activeFilters.maxPrice || priceRange.max}
                  onChange={handlePriceChange}
                  className="price-slider"
                />
              </div>
            </div>
            
            {(activeFilters.minPrice !== priceRange.min || activeFilters.maxPrice !== priceRange.max) && (
              <button 
                onClick={clearPriceFilter}
                className="clear-price-btn"
              >
                Réinitialiser prix
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters-display">
          <h4>Filtres actifs:</h4>
          <div className="active-filter-tags">
            {activeFilters.ville && (
              <span className="active-filter-tag">
                Ville: {activeFilters.ville}
                <button onClick={() => clearFilter('ville')}>✕</button>
              </span>
            )}
            {activeFilters.type && (
              <span className="active-filter-tag">
                Type: {activeFilters.type}
                <button onClick={() => clearFilter('type')}>✕</button>
              </span>
            )}
            {activeFilters.specialite && (
              <span className="active-filter-tag">
                Spécialité: {activeFilters.specialite}
                <button onClick={() => clearFilter('specialite')}>✕</button>
              </span>
            )}
            {(activeFilters.minPrice !== priceRange.min || activeFilters.maxPrice !== priceRange.max) && (
              <span className="active-filter-tag">
                Prix: {formatPrice(activeFilters.minPrice || priceRange.min)} - {formatPrice(activeFilters.maxPrice || priceRange.max)}
                <button onClick={clearPriceFilter}>✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

Filters.defaultProps = {
  activeFilters: {},
  onFilterChange: () => {},
  onReset: () => {}
};

export default Filters;