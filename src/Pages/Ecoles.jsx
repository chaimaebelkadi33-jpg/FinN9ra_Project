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

    results = results.filter(school => {
      const priceStr = school.cout;
      const match = priceStr.match(/\d+/);
      const price = match ? parseInt(match[0]) : 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    results.sort((a, b) => {
      switch (sortBy) {
        case 'note':
          return b.note - a.note;
        case 'nom':
          return a.nom.localeCompare(b.nom);
        case 'price':
          const getPrice = (priceStr) => {
            const match = priceStr.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          };
          return getPrice(a.cout) - getPrice(b.cout);
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

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  if (loading) {
    return (
      <div className="ecoles-page">
        <div className="loading">Chargement des écoles...</div>
      </div>
    );
  }

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
        {/* Centered Filter Component */}
        <div className="centered-filters-container">
          <Filters 
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            filteredCount={filteredSchools.length}
            totalCount={schools.length}
          />
        </div>

        {/* Main Content */}
        <main className="schools-main">
          {/* Schools Grid */}
          {filteredSchools.length > 0 ? (
            <div className="schools-grid">
              {filteredSchools.map(school => (
                <SchoolCard key={school.idEcole} school={school} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <h3>Aucune école ne correspond à vos critères</h3>
                <p>Essayez de modifier vos filtres pour voir plus de résultats.</p>
                <button onClick={resetFilters} className="reset-filters-btn">
                  Réinitialiser tous les filtres
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Ecoles;