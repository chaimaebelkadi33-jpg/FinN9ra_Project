import React, { useState } from "react";
import "../Styles/searchBar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    
    if (typeof onSearch === "function") {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Also handle form submit
    if (typeof onSearch === "function") {
      onSearch(query);
    }
  };

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
          placeholder="Nom de l'école, ville, spécialité..."
          value={query}
          onChange={handleChange}
        />
        <button type="submit" className="search-btn">
          🔍
        </button>
      </form>

      <div className="searchbar-filters">
        <button type="button">Ville</button>
        <button type="button">Spécialité</button>
        <button type="button">Type</button>
      </div>
    </div>
  );
};

// Add default prop to prevent errors
SearchBar.defaultProps = {
  onSearch: (query) => {
    console.log("Search query:", query);
  }
};

export default SearchBar;