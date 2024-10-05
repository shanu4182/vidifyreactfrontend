import React, { useRef, useState } from "react";
import API from "./../../services/Api";
import "./MovieDetailsPage.css"; // Ensure you are importing the CSS file
import HoverButton from "../../components/HoverButton";

export default function MovieDetails({ movie }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true); // State to track mute status

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted; // Toggle mute
      setIsMuted(!isMuted); // Update state
    }
  };

  return (
    <div className="MovieDetailsPage">
      <div className="MovieDetails">
        <video
          ref={videoRef}
          className="MovieDetailsVideo"
          src={API.main + movie.trailerUrl}
          autoPlay
          muted={isMuted}
        >
          Your browser does not support the video tag.
        </video>

        <span className="MovieDetailsInfo">
            <span className="MovieDetailsInfoButtons">
            <HoverButton title={"Play Now"}/>
            <HoverButton title={isMuted ? "🔇" : "🔊"} onClick={toggleMute}/>
            </span>
          
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>

        </span>



        <div className="vignette"></div>
      </div>
    </div>
  );
}
