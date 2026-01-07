import React, { useState } from "react";
import "../Styles/components.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // send search text to parent
  };

  return (
    <div className="searchbar-container">
      <h2 className="searchbar-title">
        ابحث عن مدرستك
        <br />
        <span>Trouvez votre école</span>
      </h2>

      <div className="searchbar-box">
        <input
          type="text"
          placeholder="Nom de l’école, ville, spécialité..."
          value={query}
          onChange={handleChange}
        />

        <button className="search-btn">🔍</button>
      </div>

      <div className="searchbar-filters">
        <button>Ville</button>
        <button>Spécialité</button>
        <button>Type</button>
      </div>
    </div>
  );
};

export default SearchBar;
