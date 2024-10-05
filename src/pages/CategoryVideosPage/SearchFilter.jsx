import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../services/Api';

function SearchFilter({ setSearchFilter, setTypeFilter, setLanguageFilter, searchFilter, typeFilter, languageFilter }) {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(languageFilter || '');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(API.languages); // Replace with your actual API endpoint
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setLanguageFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchFilter('');
    setTypeFilter('');
    setSelectedLanguage('');
    setLanguageFilter('');
  };

  const isClearButtonVisible = searchFilter || typeFilter || selectedLanguage;

  return (
    <div className="search-filter">
      <input 
        type="text" 
        placeholder="Search videos" 
        className="search-bar" 
        value={searchFilter} 
        onChange={handleSearchChange} 
      />
      <div className="dropdowns">
        <div className="dropdown">
          <select
            id="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="dropdown-select"
          >
            <option value="">Select Language</option>
            {languages.map((language) => (
              <option key={language._id} value={language._id}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown">
          <select 
            id="sort" 
            name="sort" 
            className="dropdown-select" 
            value={typeFilter} 
            onChange={handleTypeChange}
          >
            <option value="">All</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="Latest">Latest</option>
          </select>
        </div>
        {isClearButtonVisible && (
          <button className="dropdown-select" onClick={handleClearFilters}>
            Clear 
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;