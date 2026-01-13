// src/Pages/Ecoles.jsx
import React, { useState, useEffect } from 'react';
import { dataService } from '../Services/dataService';
import Filters from '../Components/Filters';
import SchoolCard from '../Components/SchoolCard';
import '../Styles/ecoles.css';

function Ecoles() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ville: '',
    type: '',
    specialite: '',
    minPrice: 0,
    maxPrice: 20000
  });
  const [sortBy, setSortBy] = useState('note');

  // Fetch all schools on component mount
  useEffect(() => {
    loadSchools();
  }, []);

  // Apply filters when filters or sort changes
  useEffect(() => {
    applyFilters();
  }, [filters, sortBy, schools]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const allSchools = await dataService.getAllEcoles();
      setSchools(allSchools);
      setFilteredSchools(allSchools);
      
      // Calculate initial price range
      const prices = allSchools.map(school => {
        const priceStr = school.cout;
        const match = priceStr.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      });
      
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      setFilters(prev => ({
        ...prev,
        minPrice: minPrice,
        maxPrice: maxPrice
      }));
      
    } catch (error) {
      console.error('Error loading schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...schools];

    // Apply filters
    if (filters.ville) {
      results = results.filter(school => 
        school.ville.toLowerCase() === filters.ville.toLowerCase()
      );
    }

    if (filters.type) {
      results = results.filter(school => 
        school.type === filters.type
      );
    }

    if (filters.specialite) {
      results = results.filter(school => 
        school.specialites && 
        school.specialites.includes(filters.specialite)
      );
    }

    // Apply price filter
    results = results.filter(school => {
      const priceStr = school.cout;
      const match = priceStr.match(/\d+/);
      const price = match ? parseInt(match[0]) : 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'note':
          return b.note - a.note; // Highest rating first
        case 'nom':
          return a.nom.localeCompare(b.nom); // Alphabetical
        case 'price':
          // Extract number from string like "15000 MAD/an"
          const getPrice = (priceStr) => {
            const match = priceStr.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getPrice(a.cout) - getPrice(b.cout); // Cheapest first
        default:
          return 0;
      }
    });

    setFilteredSchools(results);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    const prices = schools.map(school => {
      const priceStr = school.cout;
      const match = priceStr.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    setFilters({
      ville: '',
      type: '',
      specialite: '',
      minPrice: minPrice,
      maxPrice: maxPrice
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <div className="ecoles-page">
        <div className="loading">Chargement des écoles...</div>
      </div>
    );
  }

 // Update the return structure in Ecoles.jsx
return (
  <div className="ecoles-page">
    {/* Page Header */}
    <div className="page-header">
      <h1>Liste des Écoles</h1>
      <p className="page-subtitle">
        Découvrez toutes les écoles disponibles. Filtrez par ville, type, spécialité ou prix.
      </p>
    </div>

    <div className="ecoles-container">
      {/* Filters Sidebar - Now sticky/fixed */}
      <aside className="filters-sidebar">
        <Filters 
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
      </aside>

      {/* Main Content */}
      <main className="schools-main">
        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <h2>{filteredSchools.length} école{filteredSchools.length !== 1 ? 's' : ''} trouvée{filteredSchools.length !== 1 ? 's' : ''}</h2>
            {filteredSchools.length !== schools.length && (
              <p className="filtered-count">
                (sur {schools.length} au total)
              </p>
            )}
          </div>

          {/* Sort Options */}
          <div className="sort-options">
            <label htmlFor="sortBy">Trier par:</label>
            <select 
              id="sortBy" 
              value={sortBy}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="note">Meilleures notes</option>
              <option value="nom">Nom (A-Z)</option>
              <option value="price">Prix (croissant)</option>
            </select>
          </div>
        </div>

        {/* Schools Grid */}
        {filteredSchools.length > 0 ? (
          <div className="schools-grid">
            {filteredSchools.map(school => (
              <SchoolCard key={school.idEcole} school={school} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            {/* ... */}
          </div>
        )}
      </main>
    </div>
  </div>
);
}
export default Ecoles;