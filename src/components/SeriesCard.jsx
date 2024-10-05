import React from "react";
import { useNavigate } from "react-router-dom"; // React Router v6
import API from "../services/Api";
import { TiEyeOutline } from "react-icons/ti";


function SeriesCard({ series }) {
  const navigate = useNavigate();

  // Function to handle navigation when a series is clicked
  const handleSeriesClick = (seriesId) => {
    // Navigate to the episodes page for the clicked series
    navigate(`/series/${seriesId}`);
  };

  return (
    <div className="SeriesCards">
      {series.map((item) => (
        <div
          key={item._id || item.id} // Use _id as fallback if id is undefined
          className="seriesCard"
          onClick={() => handleSeriesClick(item._id || item.id)} // Use _id for MongoDB or id
          style={{ cursor: "pointer" }} // Show pointer cursor to indicate clickable
        >
          {/* Thumbnail */}
          <img
            src={API.main + item.thumbnailUrl}
            alt={item.title}
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />
          
          {/* Series information */}
          <div className="seriesInfo">
            <span className="seriesTitle">{item.title}</span>
            <span className="seriesDuration">{item.duration}</span>
          </div>

          {/* Views section */}
          <span className="upperSection">
            <TiEyeOutline size={10} /> {item.views}
          </span>
        </div>
      ))}
    </div>
  );
}

export default SeriesCard;
