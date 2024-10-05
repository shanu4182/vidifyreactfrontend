import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import API from "../../services/Api";
import SeriesCard from "../../components/SeriesCard";
import { AuthContext } from "../../contexts/AuthContext";
import SeriesFilter from "./SeriesFilter";
import NodataFound from "../../components/NodataFound";
import "./series.css";

function SeriesScreen() {
  const { token } = useContext(AuthContext);
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API.getSeriesVideo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSeries(response.data);
        setFilteredSeries(response.data);
      } catch (err) {
        console.error("Failed to fetch series:", err);
        setFilteredSeries([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [token]);

  // Memoize the handleFilterChange function with useCallback
  const handleFilterChange = useCallback((filters) => {
    let filtered = series;
  
   
    if (filters.category) {
      filtered = filtered.filter((serie) => serie.category === filters.category);
    }
    if (filters.language) {
      filtered = filtered.filter(
        (serie) => serie.language === filters.language // Language is an ID, compare with filters.language
      );
    }
  
    if (filters.searchTerm) {
      filtered = filtered.filter((serie) =>
        serie.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
  
    if (filters.sortOption) {
      filtered = [...filtered].sort((a, b) => {
        if (filters.sortOption === "views") {
          return b.views - a.views;
        } else if (filters.sortOption === "uploaded_date") {
          return new Date(b.uploaded_date) - new Date(a.uploaded_date);
        }
        return 0;
      });
    }
  
    setFilteredSeries(filtered);
  }, [series]);
  
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="SeriesPageScreen">
      
      <SeriesFilter onFilterChange={handleFilterChange} /> {/* Pass the callback here */}
      <section>
        {filteredSeries.length > 0 ? (
          <SeriesCard series={filteredSeries} />
        ) : (
          <NodataFound />
        )}
      </section>
    </div>
  );
}

export default SeriesScreen;
