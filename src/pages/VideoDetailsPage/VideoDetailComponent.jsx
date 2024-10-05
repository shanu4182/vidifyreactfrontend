import React from "react";
import VideoPlayerController from "../../components/VideoPlayerController";
import ProfileAndName from "./../../components/ProfileAndName";
import VideoActionComponents from "./../../components/VideoActionComponents";

export default function VideoDetailComponent({ video, onVideoClick }) {
  return (
    <div className="VideoDetailComponent">
      <VideoPlayerController onVideoClick={onVideoClick} url={video.url} />
      <VideoActionComponents />
      <ProfileAndName creator={video.creator} />
      <h3 className="videoDetailsTitle">{video.title}</h3>
      <p className="videoDescription">{video.description}</p>
    </div>
  );
}
// className={`VideoDetailComponent ${isVideoExpanded ? 'expanded' : ''}`}
