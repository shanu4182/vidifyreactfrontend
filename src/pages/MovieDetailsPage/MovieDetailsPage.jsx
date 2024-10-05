import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import "./MovieDetailsPage.css";
import MovieDetails from "./MovieDetails";

function MovieDetailsPage() {
  const { movieId } = useParams(); // Get movieId from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext); // Authorization token from context

  // Fetch movie details by ID when component mounts or movieId changes
  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      try {
        axios
          .get(`${API.getMovieById}/${movieId}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Send token for auth
            },
          })
          .then((response) => {
            setMovie(response.data);
          })
          .catch((error) => {
            console.error("Error fetching movie:", error);
          }).finally(() => {
            setLoading(false);
          })
      } catch (error) {
        console.error("Error fetching movie:", error); // Handle fetch error
      } finally {
        setLoading(false); // Stop loading spinner
      }
    }

    fetchMovie();
  }, [movieId, token]);

  // Loading state
  if (loading) {
    return <div>Loading movie details...</div>;
  }

  // If no movie is found
  if (!movie) {
    return <div>Movie not found. Please try again later.</div>;
  }

  // Ensure video URL updates properly

  return (
    <div className="MovieDetailsPage">
      <MovieDetails movie={movie} />
    </div>
  );
}

export default MovieDetailsPage;
