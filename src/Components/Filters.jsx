// src/Components/Filters.jsx - CORRECTED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { dataService } from '../Services/dataService';
import '../Styles/filters.css';

const Filters = ({ 
  activeFilters, 
  onFilterChange, 
  onApply,
  onReset,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount 
}) => {
  const [filterOptions, setFilterOptions] = useState({
    villes: [],
    types: [],
    specialites: []
  });
  
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

        const allSchools = await dataService.getAllEcoles();
        const prices = allSchools.map(school => {
          const priceStr = school.cout;
          const match = priceStr.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        });
        
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        setPriceRange({ min: minPrice, max: maxPrice });

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && 
          !event.target.closest('.filter-select') &&
          !event.target.closest('.options-dropdown')) {
        setActiveDropdown(null);
      }
      
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveDropdown(null);
  };

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

  const handleApplyFilters = () => {
    if (onApply) {
      onApply();
    }
    setMenuOpen(false);
  };

  const handleResetFilters = () => {
    if (onReset) {
      onReset();
    }
  };

  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.ville) count++;
    if (activeFilters.type) count++;
    if (activeFilters.specialite) count++;
    if (activeFilters.minPrice !== priceRange.min || activeFilters.maxPrice !== priceRange.max) count++;
    return count;
  };

  const hasActiveFilters = 
    activeFilters.ville || 
    activeFilters.type || 
    activeFilters.specialite || 
    (activeFilters.minPrice !== undefined && activeFilters.minPrice !== priceRange.min) || 
    (activeFilters.maxPrice !== undefined && activeFilters.maxPrice !== priceRange.max);

  if (loading) {
    return (
      <div className="filters-main-container">
        <div className="filters-loading">Chargement des filtres...</div>
      </div>
    );
  }

  return (
    <div className="filters-main-container" ref={menuRef}>
      {/* Centered Toggle Bar */}
      <div className="filter-toggle-bar">
        <button 
          className={`filter-toggle-btn ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="filter-icon">⚙️</span>
          <span className="filter-text">Filtres & Tri</span>
          {hasActiveFilters && (
            <span className="active-badge">{getActiveFiltersCount()}</span>
          )}
        </button>
        
        <div className="filter-info">
          <div className="results-count">
            <span className="count-number">{filteredCount}</span>
            <span className="count-text">école{filteredCount !== 1 ? 's' : ''}</span>
            {filteredCount !== totalCount && (
              <span className="total-count">sur {totalCount}</span>
            )}
          </div>
          
          {hasActiveFilters && (
            <button 
              onClick={handleResetFilters}
              className="clear-all-btn-small"
              title="Réinitialiser tous les filtres"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      <div className={`filter-overlay-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Filtres & Options de tri</h3>
          <button 
            onClick={() => setMenuOpen(false)}
            className="close-menu-btn"
          >
            ✕
          </button>
        </div>

        {/* Sort Options Section */}
        <div className="sort-section">
          <label className="sort-label">Trier par:</label>
          <div className="sort-buttons">
            <button 
              className={`sort-btn ${sortBy === 'note' ? 'active' : ''}`}
              onClick={() => onSortChange('note')}
            >
              ⭐ Meilleures notes
            </button>
            <button 
              className={`sort-btn ${sortBy === 'nom' ? 'active' : ''}`}
              onClick={() => onSortChange('nom')}
            >
              🔤 Nom (A-Z)
            </button>
            <button 
              className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
              onClick={() => onSortChange('price')}
            >
              💰 Prix (croissant)
            </button>
          </div>
        </div>

        <div className="filters-grid">
          {/* Ville Filter */}
          <div className="filter-group">
            <label className="filter-group-label">
              Ville
              {activeFilters.ville && (
                <span className="filter-value">{activeFilters.ville}</span>
              )}
            </label>
            <div className="filter-tag-container">
              <div 
                className={`filter-select ${activeFilters.ville ? 'active' : ''}`}
                onClick={() => toggleDropdown('ville')}
              >
                {activeFilters.ville || 'Toutes les villes'}
                <span className="select-arrow">▼</span>
              </div>
              
              {activeDropdown === 'ville' && (
                <div className="options-dropdown">
                  <div className="dropdown-scroll">
                    {filterOptions.villes.map((ville, index) => (
                      <div 
                        key={index}
                        className={`dropdown-item ${activeFilters.ville === ville ? 'selected' : ''}`}
                        onClick={() => selectFilter('ville', ville)}
                      >
                        {ville}
                        {activeFilters.ville === ville && <span className="check">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Type Filter */}
          <div className="filter-group">
            <label className="filter-group-label">
              Type d'établissement
              {activeFilters.type && (
                <span className="filter-value">{activeFilters.type}</span>
              )}
            </label>
            <div className="filter-tag-container">
              <div 
                className={`filter-select ${activeFilters.type ? 'active' : ''}`}
                onClick={() => toggleDropdown('type')}
              >
                {activeFilters.type || 'Tous les types'}
                <span className="select-arrow">▼</span>
              </div>
              
              {activeDropdown === 'type' && (
                <div className="options-dropdown">
                  <div className="dropdown-scroll">
                    {filterOptions.types.map((type, index) => (
                      <div 
                        key={index}
                        className={`dropdown-item ${activeFilters.type === type ? 'selected' : ''}`}
                        onClick={() => selectFilter('type', type)}
                      >
                        {type}
                        {activeFilters.type === type && <span className="check">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spécialité Filter */}
          <div className="filter-group">
            <label className="filter-group-label">
              Spécialité
              {activeFilters.specialite && (
                <span className="filter-value">{activeFilters.specialite}</span>
              )}
            </label>
            <div className="filter-tag-container">
              <div 
                className={`filter-select ${activeFilters.specialite ? 'active' : ''}`}
                onClick={() => toggleDropdown('specialite')}
              >
                {activeFilters.specialite || 'Toutes les spécialités'}
                <span className="select-arrow">▼</span>
              </div>
              
              {activeDropdown === 'specialite' && (
                <div className="options-dropdown">
                  <div className="dropdown-scroll">
                    {filterOptions.specialites.slice(0, 15).map((specialite, index) => (
                      <div 
                        key={index}
                        className={`dropdown-item ${activeFilters.specialite === specialite ? 'selected' : ''}`}
                        onClick={() => selectFilter('specialite', specialite)}
                      >
                        {specialite}
                        {activeFilters.specialite === specialite && <span className="check">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price Filter Section */}
<div className="filter-group price-group">
  <label className="filter-group-label">
    Fourchette de prix
    <span className="filter-value">
      {formatPrice(activeFilters.minPrice || priceRange.min)} - {formatPrice(activeFilters.maxPrice || priceRange.max)}
    </span>
  </label>
  
  <div className="price-slider-container">
  <div className="slider-wrapper">
    {/* Active range track */}
    <div 
      className="active-range-track"
      style={{
        left: `${((activeFilters.minPrice || priceRange.min) - priceRange.min) / (priceRange.max - priceRange.min) * 100}%`,
        right: `${100 - ((activeFilters.maxPrice || priceRange.max) - priceRange.min) / (priceRange.max - priceRange.min) * 100}%`
      }}
    ></div>
    
    {/* Min price slider */}
    <input
      type="range"
      name="minPrice"
      min={priceRange.min}
      max={priceRange.max}
      value={activeFilters.minPrice || priceRange.min}
      onChange={handlePriceChange}
      className="price-range-slider"
    />
    
    {/* Max price slider */}
    <input
      type="range"
      name="maxPrice"
      min={priceRange.min}
      max={priceRange.max}
      value={activeFilters.maxPrice || priceRange.max}
      onChange={handlePriceChange}
      className="price-range-slider"
    />
  </div>
  
  <div className="slider-labels">
    <span>{formatPrice(priceRange.min)}</span>
    <span>{formatPrice(priceRange.max)}</span>
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

        <div className="menu-actions">
          <div className="active-filters-count">
            <strong>{getActiveFiltersCount()}</strong> filtre{getActiveFiltersCount() !== 1 ? 's' : ''} sélectionné{getActiveFiltersCount() !== 1 ? 's' : ''}
          </div>
          
          <div className="action-buttons">
            {hasActiveFilters && (
              <button 
                onClick={handleResetFilters}
                className="reset-all-btn"
              >
                Tout réinitialiser
              </button>
            )}
            <button 
              onClick={handleApplyFilters}
              className="apply-filters-btn"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Filters.defaultProps = {
  activeFilters: {},
  onFilterChange: () => {},
  onApply: () => {},
  onReset: () => {},
  sortBy: 'note',
  onSortChange: () => {},
  filteredCount: 0,
  totalCount: 0
};

export default Filters;