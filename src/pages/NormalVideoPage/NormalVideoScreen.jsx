import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import API from "../../services/Api";
import VideoCard from "../../components/VideoCards";
import VideoFilter from "./VideoFilter"; // Assume you have a filter component for videos
import NodataFound from "../../components/NodataFound";
import { AuthContext } from "../../contexts/AuthContext"; // Import AuthContext to get token

export default function NormalVideoScreen() {
  const { token } = useContext(AuthContext); // Retrieve token from AuthContext
  const [normalVideos, setNormalVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch normal videos from the backend
    const fetchNormalVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API.getNormalVideos, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        setNormalVideos(response.data);
        setFilteredVideos(response.data); // Initialize with all videos
      } catch (err) {
        console.error("Error fetching normal videos:", err);
        setError("Failed to load normal videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchNormalVideos();
  }, [token]);

  const handleFilterChange = useCallback(
    (filters) => {
      let filtered = normalVideos;

      if (filters.category) {
        filtered = filtered.filter((video) => video.category === filters.category);
      }
      if (filters.language) {
        filtered = filtered.filter((video) => video.language === filters.language);
      }
      if (filters.searchTerm) {
        filtered = filtered.filter((video) =>
          video.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      if (filters.sortOption) {
        filtered = [...filtered].sort((a, b) => {
          if (filters.sortOption === "views") {
            return b.viewCount - a.viewCount;
          } else if (filters.sortOption === "uploaded_date") {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
      }

      setFilteredVideos(filtered);
    },
    [normalVideos]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="NormalVideoPageScreen">
      <VideoFilter onFilterChange={handleFilterChange} />

      <section>
        {filteredVideos.length > 0 ? (
          <VideoCard videos={filteredVideos} />
        ) : (
          <NodataFound />
        )}
      </section>
    </div>
  );
}
