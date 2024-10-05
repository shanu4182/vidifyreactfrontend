import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TiEyeOutline } from "react-icons/ti";
import API from "../services/Api";
import userImage from "../images/user.png"; // Default user image for missing profiles

function VideoCard({ videos }) {
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = (index) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredVideo(index);
    }, 3000); // 3 seconds delay
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredVideo(null);
  };

  const handleClick = (video) => {
    if (video && video._id) {
      navigate(`/videos/${video._id}`);
    } else {
      console.error("Error: video or video._id is undefined", video);
    }
  };

  return (
    <div className="VideoCards">
      {videos.map((video, index) => (
        <div
          key={video._id}
          className="videoCard"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(video)}
        >
          {hoveredVideo === index ? (
            <video
              src={`${API.main}${video.url}`}
              width="100%"
              height="100%"
              autoPlay
              muted
            />
          ) : (
            <img
              src={`${API.main}${video.thumbnailUrl}`}
              alt={video.title}
              width="100%"
              height="100%"
            />
          )}

          <div className="videoInfo">
            <img
              src={
                video.creator && video.creator.profilePicture
                  ? `${API.main}${video.creator.profilePicture}`
                  : userImage
              }
              alt="Uploader"
              className="profile-picture-small"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "10px",
              }}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop if default image is missing
                e.target.src = userImage; // Fallback to default image
              }}
            />
            {/* Video Title and Duration */}
            <div>
              <span className="videoTitle">{video.title}</span>
              <span className="videoUserName">{video.duration}</span>
              <br />
              {video.creator && (
                <span className="videoUserName">{video.creator.username}</span>
              )}
            </div>
          </div>

          <span className="upperSection">
            <TiEyeOutline size={20} />
            {video.viewCount}
          </span>
        </div>
      ))}
    </div>
  );
}

export default VideoCard;
