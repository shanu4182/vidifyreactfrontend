import React from "react";
import API from "../services/Api";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";
import defaultProfilePicture from "../images/user.png";

export default function ProfileAndName({ creator }) {
  const navigate = useNavigate();

  // Default image URL (you can replace this with the path to your default image)


  return (
    <span className="profileAndName">
      <span
        className="profileAndNameButton"
        onClick={() =>
          navigate('/profile', { state: { userId: creator._id } })
        }
      >
        <img
          className="profilePic"
          src={creator.profilePicture ? API.main + creator.profilePicture : defaultProfilePicture}
          alt="profile"
        />
        <span className="nameAndFollowers">
          <span>@{creator.username}</span>
          <span>{creator.followersCount} followers</span>
        </span>
      </span>

      <FollowButton userId={creator._id} />
    </span>
  );
}
