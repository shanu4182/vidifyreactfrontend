import React, { useState, useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { TbUserEdit } from "react-icons/tb";
import axios from "axios";
import API from "../../services/Api";
import userImage from "../../images/user.png";
import FollowButton from "../../components/FollowButton";

const ProfileCard = ({ userProfile }) => {
  const { token, logout, profile } = useContext(AuthContext);

  // Hooks should always be called unconditionally at the top level
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(userProfile?.username || ""); // Set default if undefined
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    userProfile?.profilePicture ? API.main + userProfile.profilePicture : userImage
  );
  const [newAbout, setNewAbout] = useState(userProfile?.about || "");
  const [tempUsername, setTempUsername] = useState(userProfile?.username || "");
  const [tempImagePreviewUrl, setTempImagePreviewUrl] = useState(imagePreviewUrl);
  const [tempAbout, setTempAbout] = useState(userProfile?.about || "");

  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTempUsername(newUsername);
    setTempImagePreviewUrl(imagePreviewUrl);
    setTempAbout(newAbout);
    setNewProfileImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setTempImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUsernameChange = (e) => {
    setTempUsername(e.target.value);
  };

  const handleAboutChange = (e) => {
    setTempAbout(e.target.value);
  };
  const isThisUser = userProfile?._id === profile?._id;
  

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userId", userProfile._id);
    formData.append("username", tempUsername);
    formData.append("about", tempAbout);
    if (newProfileImage) {
      formData.append("profilePicture", newProfileImage);
    }

    try {
      const { data } = await axios.put(API.updateProfile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setNewUsername(tempUsername);
      setNewAbout(tempAbout);
      setImagePreviewUrl(tempImagePreviewUrl);
      setIsModalOpen(false);
    } catch (error) {
      alert("Error updating profile");
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      await axios.delete(API.deleteProfileImage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Profile image deleted successfully");
      setImagePreviewUrl(userImage);
    } catch (error) {
      console.error("Error deleting profile image:", error);
      alert("Error deleting profile image");
    }
  };

  // Render loading state if userProfile data is not available
  return (
    <div className="profile-card">
      {!userProfile ? (
        <div>Loading...</div>
      ) : (
        <>
          <img
            src={imagePreviewUrl}
            alt="Profile"
            className="profile-picture"
            style={{ cursor: "pointer" }}
          />
          <div className="profile-details">
            <h2 className="profile-username" style={{ cursor: "pointer" }}>
              {newUsername}
            </h2>
            {isThisUser && <p className="profile-email">{userProfile.email}</p>}
            
            <p className="profile-email">{newAbout || "No bio available"}</p>
            {isThisUser ?             <><button className="editProfile" title="Edit profile" onClick={handleEditProfile}>
                <TbUserEdit size={15} />
              </button><button onClick={handleLogout} className="logout-button">
                  Logout
                </button></>
            : <FollowButton userId={userProfile._id} />}

          </div>
  
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-body">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <div className="image-preview">
                    <img
                      src={tempImagePreviewUrl || userImage}
                      alt="New Profile Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        marginTop: "10px",
                        objectFit: "cover",
                      }}
                      onClick={() => fileInputRef.current.click()}
                    />
                  </div>
                  <input
                    type="text"
                    className="profile-username-input"
                    value={tempUsername}
                    onChange={handleUsernameChange}
                  />
                  <textarea
                    className="profile-about-input"
                    value={tempAbout}
                    onChange={handleAboutChange}
                    placeholder="Tell something about yourself"
                  />
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={handleDeleteProfileImage}>
                    Remove Image
                  </button>
                  <button onClick={handleSubmit} className="update-button">
                    Submit
                  </button>
                  <button onClick={handleCloseModal} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileCard;
