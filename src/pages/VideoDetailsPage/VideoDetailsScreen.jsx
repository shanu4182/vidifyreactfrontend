import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import VideoDetailComponent from "./VideoDetailComponent";
import VideoDetailsRelatedComponents from "./VideoDetailsRelatedComponents";
import "./VideoDetailsScreen.css";

function VideoDetailsScreen() {
  const { token } = useContext(AuthContext);
  const { video_id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false); // State to manage video expansion

  useEffect(() => {
    async function fetchVideo() {
      if (!video_id) {
        setError("Invalid video ID");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API.main}videos/${video_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setVideo(data);
      } catch (error) {
        setError(`Failed to fetch video: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [token, video_id]);

  if (loading) {
    return <div>Loading video...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!video) {
    return <div>No video found.</div>;
  }

  return (
    <div className={`VideoDetailsScreen ${isVideoExpanded ? "expanded" : ""}`}>
      <VideoDetailComponent
        video={video}
        onVideoClick={() => setIsVideoExpanded(!isVideoExpanded)}
      />
      <VideoDetailsRelatedComponents />
    </div>
  );
}

export default VideoDetailsScreen;
