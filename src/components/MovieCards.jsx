import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api";
import { TiEyeOutline } from "react-icons/ti";

function MovieCard({ movies }) {
  const navigate = useNavigate();

  const handleClick = (movie) => {
    if (movie._id) {
      navigate(`/movie/${movie._id}`); // Use _id instead of movie_id
    } else {
      console.error("_id is missing from the movie object:", movie);
    }
  };

  return (
    <div className="MovieCards">
      {movies.map((movie, index) => (
        <div
          key={index}
          className="movieCard"
          onClick={() => handleClick(movie)}
        >
          <img
            src={API.main + movie.thumbnailUrl}
            alt={movie.title}
            className="movieImage"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />

          <div className="movieInfo">
            <span className="movieTitle">{movie.title}</span>
            <span className="movieDuration">{movie.duration}</span>
          </div>
          <span className="upperSection">
            <TiEyeOutline size={20} />
            {movie.viewCount}
          </span>
        </div>
      ))}
    </div>
  );
}

export default MovieCard;

