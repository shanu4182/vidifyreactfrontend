import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import API from "../../services/Api";
import VideoCard from "../../components/VideoCards";
import MovieCard from "../../components/MovieCards";
import ShortsCards from "../../components/ShortsCard";
import SeriesCard from "../../components/SeriesCard";
import "../Profile/UserContent.css";
import { AuthContext } from "../../contexts/AuthContext";

function UserContent({ id }) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("normal");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        const response = await axios.get(`${API.getUserContent}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setContents(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchUserContent();
  }, [id]);
console.log(contents);
  if (loading) {
    return <div>Loading user content...</div>;
  }

  if (error) {
    return <div>Error loading user content: {error}</div>;
  }

  const filteredContent =
    activeTab === "series"
      ? contents.filter((content) => content.totalSeasons !== undefined) // Adjusted to filter by totalSeasons
      : contents.filter((content) => content.type === activeTab);

  return (
    <div className="user-content">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content-list">
        {filteredContent.length === 0 ? (
          <div>No content found for this category</div>
        ) : activeTab === "short" ? (
          <ShortsCards  shorts={filteredContent} />
        ) : activeTab === "movie" ? (
          <MovieCard movies={filteredContent} />
        ) : activeTab === "series" ? (
          <SeriesCard series={filteredContent} />
        ) : (
          <VideoCard videos={filteredContent} />
        )}
      </div>
    </div>
  );
}

function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="tab">
      <button
        onClick={() => setActiveTab("normal")}
        className={activeTab === "normal" ? "active" : undefined}
      >
        Normal Videos
      </button>
      <button
        onClick={() => setActiveTab("short")}
        className={activeTab === "short" ? "active" : undefined}
      >
        Shorts
      </button>
      <button
        onClick={() => setActiveTab("movie")}
        className={activeTab === "movie" ? "active" : undefined}
      >
        Movies
      </button>
      <button
        onClick={() => setActiveTab("series")}
        className={activeTab === "series" ? "active" : undefined}
      >
        Series
      </button>
    </div>
  );
}

export default UserContent;
