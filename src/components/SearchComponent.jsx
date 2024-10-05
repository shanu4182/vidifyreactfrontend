import React from 'react';
import { FaSearch as FaSearchIcon } from 'react-icons/fa';

 function SearchComponent() {
  return (
    <div className="search-container">
      <input type="text" placeholder="Search..." className="search-input" />
      <div className="search-icon" onClick={() => {alert('search')}}>
        <FaSearchIcon />
      </div>
          </div>
  );
}
export default SearchComponent;
