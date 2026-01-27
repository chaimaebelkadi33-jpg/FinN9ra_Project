import React, { useState, useEffect, useMemo } from "react";
import { dataService } from "../Services/dataService";
import Filters from "../Components/Filters";
import SchoolCard from "../Components/SchoolCard";
import "../Styles/ecoles.css";

// Helper function to remove accents for accent-insensitive search
const normalizeString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

// Memoized SchoolCard component for better performance
const MemoizedSchoolCard = React.memo(SchoolCard);

function Ecoles() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // LOCAL filters - for UI changes only
  const [localFilters, setLocalFilters] = useState({
    ville: "",
    type: "",
    specialite: "",
    minPrice: 0,
    maxPrice: 20000,
  });

  // APPLIED filters - actual filters that affect results
  const [appliedFilters, setAppliedFilters] = useState({
    ville: "",
    type: "",
    specialite: "",
    minPrice: 0,
    maxPrice: 20000,
  });

  const [sortBy, setSortBy] = useState("note");

  // Fetch all schools on component mount
  useEffect(() => {
    loadSchools();
  }, []);

  // Apply filters ONLY when appliedFilters, sort, or search changes
  useEffect(() => {
    applyFilters();
  }, [appliedFilters, sortBy, schools, searchQuery]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const allSchools = await dataService.getAllEcoles();
      setSchools(allSchools);
      setFilteredSchools(allSchools);

      // Calculate price range
      const prices = allSchools
        .map((school) => {
          const priceStr = school.cout || "0";
          const match = priceStr.match(/\d+/g);
          return match ? parseInt(match.join("")) : 0;
        })
        .filter((price) => !isNaN(price));

      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 20000;

      // Initialize both filter states
      const initialFilters = {
        ville: "",
        type: "",
        specialite: "",
        minPrice: minPrice,
        maxPrice: maxPrice,
      };

      setLocalFilters(initialFilters);
      setAppliedFilters(initialFilters);
    } catch (error) {
      console.error("Error loading schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...schools];

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const normalizedQuery = normalizeString(searchQuery);
      results = results.filter((school) => {
        const schoolName = normalizeString(school.nom);
        const schoolCity = normalizeString(school.ville);
        const schoolType = normalizeString(school.type);

        return (
          schoolName.includes(normalizedQuery) ||
          schoolCity.includes(normalizedQuery) ||
          schoolType.includes(normalizedQuery)
        );
      });
    }

    // Use APPLIED filters (not local filters)
    if (appliedFilters.ville) {
      const normalizedVille = normalizeString(appliedFilters.ville);
      results = results.filter((school) => {
        const schoolVille = normalizeString(school.ville);
        return schoolVille === normalizedVille;
      });
    }

    if (appliedFilters.type) {
      const normalizedType = normalizeString(appliedFilters.type);
      results = results.filter((school) => {
        const schoolType = normalizeString(school.type);
        return schoolType === normalizedType;
      });
    }

    if (appliedFilters.specialite) {
      const normalizedSpecialite = normalizeString(appliedFilters.specialite);
      results = results.filter((school) => {
        if (!school.specialites || !Array.isArray(school.specialites))
          return false;

        return school.specialites.some((specialite) => {
          const normalizedSchoolSpecialite = normalizeString(specialite);
          return normalizedSchoolSpecialite === normalizedSpecialite;
        });
      });
    }

    // Apply price filter using APPLIED filters
    results = results.filter((school) => {
      const priceStr = school.cout || "0";
      const match = priceStr.match(/\d+/g);
      const price = match ? parseInt(match.join("")) : 0;
      return (
        price >= appliedFilters.minPrice && price <= appliedFilters.maxPrice
      );
    });

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case "note":
          return (b.note || 0) - (a.note || 0);
        case "nom":
          return (a.nom || "").localeCompare(b.nom || "", "fr", {
            sensitivity: "base",
          });
        case "price":
          const getPrice = (priceStr) => {
            const match = (priceStr || "0").match(/\d+/g);
            return match ? parseInt(match.join("")) : 0;
          };
          return getPrice(a.cout) - getPrice(b.cout);
        default:
          return 0;
      }
    });

    setFilteredSchools(results);
  };

  // Handle search from SearchBar or local search
  const handleSearch = (normalizedQuery, originalQuery) => {
    setSearchQuery(normalizedQuery);
  };

  // Update LOCAL filters when user changes them in UI
  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
  };

  // Apply LOCAL filters to APPLIED filters when user clicks "Apply"
  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
  };

  // Reset both filter states
  const resetFilters = () => {
    const prices = schools
      .map((school) => {
        const priceStr = school.cout || "0";
        const match = priceStr.match(/\d+/g);
        return match ? parseInt(match.join("")) : 0;
      })
      .filter((price) => !isNaN(price));

    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 20000;

    const resetFiltersState = {
      ville: "",
      type: "",
      specialite: "",
      minPrice: minPrice,
      maxPrice: maxPrice,
    };

    setLocalFilters(resetFiltersState);
    setAppliedFilters(resetFiltersState);
    setSearchQuery("");
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  // Memoize expensive calculations
  const schoolStats = useMemo(() => {
    return {
      total: schools.length,
      filtered: filteredSchools.length,
      hasResults: filteredSchools.length > 0,
    };
  }, [schools.length, filteredSchools.length]);

  if (loading) {
    return (
      <div className="ecoles-page loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des écoles...</p>
      </div>
    );
  }

  return (
    <div className="ecoles-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Liste des Écoles</h1>
        <p className="page-subtitle">
          Découvrez toutes les écoles disponibles. Filtrez par ville, type,
          spécialité ou prix.
        </p>
      </div>

      <div className="ecoles-container">
        {/* Centered Filter Component */}
        <div className="centered-filters-container">
          <Filters
            activeFilters={localFilters}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            onReset={resetFilters}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            filteredCount={schoolStats.filtered}
            totalCount={schoolStats.total}
          />
        </div>

        {/* Main Content */}
        <main className="schools-main">
          {/* Schools Grid */}
          {schoolStats.hasResults ? (
            <div className="schools-grid">
              {filteredSchools.map((school) => (
                <MemoizedSchoolCard
                  key={school.idEcole || school.id}
                  school={school}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <h3>Aucune école ne correspond à vos critères</h3>
                <p>
                  Essayez de modifier vos filtres ou votre recherche pour voir
                  plus de résultats.
                </p>
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

export default React.memo(Ecoles);
