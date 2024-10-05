import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";

function MovieFilter({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const { token } = useContext(AuthContext);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API.getCategories, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(API.languages,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLanguages(response.data);
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
    // Note: `onFilterChange` is intentionally left out of the dependency array
  }, [
    selectedCategory,
    selectedLanguage,
    searchTerm,
    sortOption,
    onFilterChange,
  ]);

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
        placeholder="Search by name"
        className="search-bar"
      />

      <div className="dropdown">
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="dropdown-select"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
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
              {language.name}
            </option>
          ))}
        </select>
      </div>

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

export default MovieFilter;
