import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import API from "../services/Api";


const FollowButton = ({ userId }) => {
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token,profile } = useContext(AuthContext);

  

  useEffect(() => {
    // Check if the current user is already following the user
    const checkIfFollowing = async () => {
      try {
        const response = await axios.get(API.getFollow.replace(':userId', userId), {
          headers: {
            Authorization: `Bearer ${token}`, // JWT token
          },
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
        // Optionally set an error state or notify the user
      }
    };

    if (token) {
      checkIfFollowing();
    }
  }, [token, userId]);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow the user
        await axios.post(API.unfollow, { userId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowing(false);
      } else {
        // Follow the user
        await axios.post(API.follow, { userId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      // Optionally set an error state or notify the user
    } finally {
      setLoading(false); // Ensure loading is false regardless of success/failure
    }
  };

  if (profile && profile._id === userId) {
    return null; 
    
  }

  return (

    <button className="FollowButton" onClick={toggleFollow} disabled={loading}>
      {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
