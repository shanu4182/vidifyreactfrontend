import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../services/Api";

function SeriesFilter({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API.getCategories);
        setCategories(response.data); // Assuming this contains category data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(API.languages);
        setLanguages(response.data); // Assuming this contains language data
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchCategories();
    fetchLanguages();
  }, []);

  useEffect(() => {
    const filters = {
      category: selectedCategory,
      language: selectedLanguage,
      searchTerm,
      sortOption,
    };

    onFilterChange(filters);
  }, [selectedCategory, selectedLanguage, searchTerm, sortOption, onFilterChange]);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedLanguage("");
    setSearchTerm("");
    setSortOption("");
    onFilterChange({
      category: "",
      language: "",
      searchTerm: "",
      sortOption: "",
    });
  };

  const isFilterActive =
    selectedCategory || selectedLanguage || searchTerm || sortOption;

  return (
    <div className="search-filter">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title"
        className="search-bar"
      />

      {/* Category Filter */}
      <div className="dropdown">
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="dropdown-select"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._name}> {/* Use _name to filter */}
              {category.name}
            </option>
          ))}
        </select>

      </div>




      <div className="dropdown">
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="dropdown-select"
        >
          <option value="">Select Language</option>
          {languages.map((language) => (
            <option key={language._id} value={language._id}>
              {language.name} {/* Correct the field name based on API response */}
            </option>
          ))}
        </select>
      </div>


      {/* Sort Options */}
      <div className="dropdown">
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="dropdown-select"
        >
          <option value="">Sort By</option>
          <option value="views">Most Viewed</option>
          <option value="uploaded_date">Newly Uploaded</option>
        </select>
      </div>

      {isFilterActive && (
        <div>
          <button className="dropdown-select" onClick={handleClearFilters}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default SeriesFilter;
