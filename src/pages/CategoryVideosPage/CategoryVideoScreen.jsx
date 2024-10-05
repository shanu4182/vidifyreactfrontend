import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/Api";
import VideoCards from "../../components/VideoCards";
import MovieCard from "../../components/MovieCards";
import SearchFilter from "./SearchFilter";
import { Skeleton } from "primereact/skeleton";
import { AuthContext } from "../../contexts/AuthContext";
import NodataFound from "../../components/NodataFound";



function CategoryVideoScreen() {
  const { token } = useContext(AuthContext); // Fetch token from AuthContext
  const { category } = useParams(); // Get category from URL params
  const [normalVideos, setNormalVideos] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  // Fetch category videos by category name
  useEffect(() => {
    const fetchCategoryVideos = async () => {
      setLoading(true);  // Set loading to true on each fetch
      try {
        const response = await axios.get(`${API.getCategoryByName}/${category}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const normal = response.data.filter(video => video.type === 'normal');
        const movieList = response.data.filter(video => video.type === 'movie');
  
        setNormalVideos(normal);
        setMovies(movieList);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No videos found for this category");
        } else {
          setError("Failed to fetch category videos");
        }
        setLoading(false);
      }
    };
  
    fetchCategoryVideos();
  }, [category, token]);
  

  // Filter logic
  const filteredVideos = normalVideos.filter((video) => {
    const matchesSearch =
      !searchFilter || video.title.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesType =
      !typeFilter ||
      (typeFilter === "mostViewed" && video.views > 0) ||
      (typeFilter === "Latest" && video.uploaded_date);
    const matchesLanguage =
      !languageFilter || video.language === languageFilter;  // Ensure `video.language` matches the filter

    return matchesSearch && matchesType && matchesLanguage;
  });


  if (typeFilter === "mostViewed") {
    filteredVideos.sort((a, b) => b.views - a.views);
  } else if (typeFilter === "Latest") {
    filteredVideos.sort(
      (a, b) => new Date(b.uploaded_date) - new Date(a.uploaded_date)
    );
  }

  // Handling the loading state
  if (loading) {
    return (
      <div>
        <Skeleton width="100%" height="4rem" />
      </div>
    );
  }

  // Handling error state
  if (error) return <div>{error}</div>;

  const noData =
    normalVideos.length === 0 && movies.length === 0;

  return (
    <div className="CategoryVideoScreen">
      <SearchFilter
        setSearchFilter={setSearchFilter}
        setTypeFilter={setTypeFilter}
        setLanguageFilter={setLanguageFilter}
        searchFilter={searchFilter}
        typeFilter={typeFilter}
        languageFilter={languageFilter}
      />
      <section>
        {noData ? (
          <NodataFound />
        ) : (
          <>
            {/* Normal Videos Section */}
            {filteredVideos.length > 0 ? (
              <>
                <h2>Normal Videos</h2>
                <VideoCards videos={filteredVideos} />
              </>
            ) : (
              <p>No normal videos available</p>
            )}

            {/* Movies Section */}
            {movies.length > 0 ? (
              <>
                <h2>Movies</h2>
                <MovieCard movies={movies} />
              </>
            ) : (
              <p>No movies available</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default CategoryVideoScreen;