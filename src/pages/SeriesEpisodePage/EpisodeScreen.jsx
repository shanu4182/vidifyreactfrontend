
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/Api"; // Ensure the path is correct
import { AuthContext } from "../../contexts/AuthContext"; // Ensure the path is correct
import axios from "axios"; // Import axios for HTTP requests
import "./episode.css"; // Assuming you have a CSS file for styles

function EpisodeScreen() {
  const { seriesId } = useParams(); // Get the seriesId from the URL
  const [episodes, setEpisodes] = useState([]);
  const { token } = useContext(AuthContext); // Get the token from AuthContext

  // Fetch episodes for the selected series
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(`${API.getSeriesSeasons}/${seriesId}/episodes`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setEpisodes(response.data);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    fetchEpisodes();
  }, [seriesId, token]);

  // Group episodes by season
  const groupedBySeason = episodes.reduce((acc, episode) => {
    const { seasonNumber } = episode;
    if (!acc[seasonNumber]) {
      acc[seasonNumber] = [];
    }
    acc[seasonNumber].push(episode);
    return acc;
  }, {});

  return (
    <div className="series-details">
      {Object.keys(groupedBySeason).map((season) => (
        <div key={season} className="season-container">
          <h2>Season {season}</h2>
          <div className="episodes-grid">
            {groupedBySeason[season].map((episode) => (
              <div key={episode._id} className="episode-card">
                <img
                  src={`${API.main}${episode.thumbnailUrl}`} // Ensure this forms the correct path
                  alt={episode.title}
                  className="episode-thumbnail"
                />
                <div className="episode-info">
                  <h3>{episode.title}</h3>
                  <p>{episode.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default EpisodeScreen;
