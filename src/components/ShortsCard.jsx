import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api";
import { TiEyeOutline } from "react-icons/ti";

function ShortsCard({  shorts = [] }) {
  const navigate = useNavigate();

  // Function to handle click events and navigate to the correct page
  const handleClick = (shortItem) => {
    if (shortItem && shortItem._id) {
      navigate(`/short/${shortItem._id}`); // Navigate to the ShortScreen with ID
    } else {
      console.error("_id is missing from the short object:", shortItem);
    }
  };

  // Render a single short
 

  // Render an array of shorts
  return (
    <div className="ShortsCards">
      {shorts.length > 0 ? (
        shorts.map((shortItem, index) => (
          <div
            key={index}
            className="shortCard"
            onClick={() => handleClick(shortItem)}
          >
            <img
              src={API.main + shortItem.thumbnailUrl}
              alt={shortItem.title}
              className="shortImage"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <div className="shortInfo">
              <span className="shortTitle">{shortItem.title}</span>
              <span className="shortDuration">{shortItem.duration}</span>
            </div>
            <span className="upperSection">
              <TiEyeOutline size={20} />
              {shortItem.viewCount}
            </span>
          </div>
        ))
      ) : (
        <p>No shorts available.</p>
      )}
    </div>
  );
}

export default ShortsCard;
