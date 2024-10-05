import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../../services/Api";
import MovieCards from "../../components/MovieCards";
import { AuthContext } from "../../contexts/AuthContext";
import MovieFilter from "./MovieFilter";
import NodataFound from "../../components/NodataFound";

function MovieScreen() {
  const { token } = useContext(AuthContext);
  const { category } = useParams();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryMovies() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API.getMovies}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMovies(response.data);
        setFilteredMovies(response.data); // Initialize filteredMovies with all movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryMovies();
  }, [token, category]);

  const handleFilterChange = useCallback((filters) => {
    let filtered = movies;

    if (filters.category) {
      filtered = filtered.filter(movie => movie.category === filters.category);
    }
    if (filters.language) {
      filtered = filtered.filter(movie => movie.language === filters.language);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(movie => movie.name.toLowerCase().includes(filters.searchTerm.toLowerCase()));
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

    setFilteredMovies(filtered);
  }, [movies]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="MoviePageScreen">
      <MovieFilter onFilterChange={handleFilterChange} />

      <section>
        {filteredMovies.length > 0 ? (
          <MovieCards movies={filteredMovies} />
        ) : (
          <NodataFound />
        )}
      </section>
    </div>
  );
}

export default MovieScreen;
