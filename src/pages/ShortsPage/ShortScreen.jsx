import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import "./ShortsScreen.css"; // Import the CSS file
import ProfileAndName from "../../components/ProfileAndName";

const ShortScreen = () => {
  const { token } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideo = async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API.getShorts}?page=${page}&limit=2`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setVideos((prev) => [...prev, ...response.data]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchVideo(page);
    }
  }, [page, hasMore, token]);

  const loadVideoWithRetry = (videoElement, retries = 3) => {
    const attemptLoad = () => {
      videoElement.load();
      videoElement.onerror = () => {
        if (retries > 0) {
          setTimeout(attemptLoad, 2000); // Retry after a delay
          retries -= 1;
        } else {
          console.error("Video failed to load after multiple attempts");
          videoElement.poster = "/path/to/fallback-image.jpg"; // Show fallback image
        }
      };
    };

    attemptLoad();
  };

  useEffect(() => {
    const videoElements = document.querySelectorAll("video");
    videoElements.forEach((video) => {
      loadVideoWithRetry(video);
    });
  }, [videos]);

  const lastVideoElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="short-screen-container">
      {videos.length === 0 && !loading && <p>No videos found</p>}
      {videos.map((video, index) => (
        <div
          className="video-container"
          key={index}
          ref={videos.length === index + 1 ? lastVideoElementRef : null}
        >
          <video  autoPlay muted preload="metadata">
            <source src={`${API.main}${video.url}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay">
            <div className="video-overlay-container">
              <p className="video-text">{video.title || "Video Title"}</p>
              <ProfileAndName creator={video.creator} />
            </div>
          </div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ShortScreen;
