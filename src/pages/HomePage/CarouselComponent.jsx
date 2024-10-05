import React, { useContext, useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios"; // Import axios
import "./carousel.css"; // Custom CSS
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import HoverButton from "../../components/HoverButton";

const CarouselComponent = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  // Fetch random movies using axios
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API.randomCarousel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Replace with your actual API endpoint
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="carousel-container">
      <Carousel responsive={responsive} infinite={true} autoPlay={true}>
        {movies.map((movie) => (
          <div key={movie._id} className="carousel-card">
            {/* Blurred background image */}
            <img
              src={`${API.main}${movie.thumbnailUrl}`} // Same source
              alt={movie.title} // Provide alt text for accessibility
              className="carousel-card-bg" // Apply CSS class for background
            />
            {/* Main image */}
            <img
              src={`${API.main}${movie.thumbnailUrl}`} // Use img tag
              alt={movie.title} // Provide alt text for accessibility
              className="carousel-card-img" // Apply CSS class
            />
            <div className="carousel-card-overlay"></div>
            <div className="carousel-card-info">
              <h3 className="carousel-card-title">{movie.title}</h3>
              <HoverButton title={"Play Now"}/>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
