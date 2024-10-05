import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import ProfileCard from "./ProfileCard";
import API from "../../services/Api";
import "./ProfileScreen.css";
import UserContent from "./UserContent";
import { useLocation } from "react-router-dom";

function ProfileScreen() {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const userId = location.state?.userId; 
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${API.getProfile}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    if (userId) {  // Only fetch if userId exists
      fetchProfileData();
    }
  }, [token, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ProfileCard userProfile={profileData} />
      <UserContent id = {profileData._id}/>
    </>
  );
}

export default ProfileScreen;
