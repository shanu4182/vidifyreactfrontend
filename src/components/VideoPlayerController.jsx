import React, { useState, useRef, useEffect } from "react";
import API from "./../services/Api";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  FastForward,
  AspectRatio,
} from "@mui/icons-material"; // Keep the icons but replace MUI components with HTML

import "./VideoPlayerController.css"; // Import the custom CSS file

export default function VideoPlayerController({ onVideoClick, url }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isStretched, setIsStretched] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [lastClickTime, setLastClickTime] = useState({ left: 0, right: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true); // New state to control visibility

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  // Show controls on mouse move and hide them after a delay
  useEffect(() => {
    let hideTimeout;

    const handleMouseMove = () => {
      setControlsVisible(true);

      // Clear any existing timeout
      clearTimeout(hideTimeout);

      // Hide controls after 3 seconds of inactivity
      hideTimeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(hideTimeout);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event) => {
    const newValue = event.target.value;
    if (videoRef.current) {
      videoRef.current.volume = newValue;
      setVolume(newValue);
    }
  };

  const handleProgressChange = (event) => {
    const newValue = event.target.value;
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const toggleStretch = () => {
    setIsStretched(!isStretched);
    onVideoClick();
  };

  const handlePlaybackRateChange = (newRate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
    }
    setIsMenuOpen(false);
  };

  const handleClick = (section) => {
    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 300;

    if (section === "middle") {
      togglePlay();
    } else if (now - lastClickTime[section] < DOUBLE_CLICK_DELAY) {
      if (videoRef.current) {
        if (section === "left") {
          videoRef.current.currentTime -= 10;
        } else if (section === "right") {
          videoRef.current.currentTime += 10;
        }
      }
      setLastClickTime((prev) => ({ ...prev, [section]: 0 }));
    } else {
      setLastClickTime((prev) => ({ ...prev, [section]: now }));
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      className={`video-container `} 
    >
      {/* ${isStretched ? "stretched" : ""} */}
      <video
        ref={videoRef}
        src={API.main + url}
        className="video-player"
        height={"100%"}
        width={"100%"}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="video-overlay" onClick={(e) => e.stopPropagation()}>
        <div
          className="clickable-area"
          onClick={() => handleClick("left")}
        ></div>
        <div
          className="clickable-area"
          onClick={() => handleClick("middle")}
        ></div>
        <div
          className="clickable-area"
          onClick={() => handleClick("right")}
        ></div>
      </div>
      {controlsVisible && ( // Conditionally render the controls
        <div className="video-controls">
          <div className="progress-bar">
            <span className="time">{formatTime(currentTime)}</span>
            <input
              type="range"
              value={currentTime}
              max={duration}
              onChange={handleProgressChange}
              className="progress-slider"
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
          <div className="control-buttons">
            <button className="control-button" onClick={togglePlay}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </button>
            <div className="volume-control">
              <button
                className="control-button"
                onClick={() =>
                  handleVolumeChange({
                    target: { value: volume === 0 ? 1 : 0 },
                  })
                }
              >
                {volume === 0 ? (
                  <VolumeOff />
                ) : volume < 0.5 ? (
                  <VolumeDown />
                ) : (
                  <VolumeUp />
                )}
              </button>
              <input
                type="range"
                value={volume}
                max="1"
                step="0.1"
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
            <button
              className="control-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FastForward />
            </button>
            {isMenuOpen && (
              <div className="playback-rate-menu">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className="playback-rate-option"
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}

            <button className="control-button" onClick={toggleStretch}>
              <AspectRatio />
            </button>
            <button className="control-button" onClick={toggleFullScreen}>
              {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
