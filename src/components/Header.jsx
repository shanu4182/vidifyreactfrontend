import React, { useContext, useState, useEffect } from "react";
import {
  FaSearch,
  FaBell,
  FaBars,
  FaUser,
} from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import Modal from "./Modal";
import SearchComponent from "./SearchComponent";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import userImage from '../images/user.png'; // Default image
import API from '../services/Api'; // Import API for base URL

function Header({ isSideBarOpen, setIsSideBarOpen }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Access user profile and login status from AuthContext
  const { profile, isLoggedIn } = useContext(AuthContext);


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="header">
      {/* Left section: Sidebar toggle */}
      <div className="left" onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
        {isSideBarOpen ? (
          <GrClose className="icon" />
        ) : (
          <FaBars className="icon" />
        )}
        <span className="logo">
          <img src="logo.png" alt="Logo" height={35} />
          VS
        </span>
      </div>

      {/* Right section: Search, Notifications, Profile */}
      <div className="right">
        <FaSearch className="icon" onClick={toggleModal} />
        <FaBell className="icon" onClick={() => navigate('/notifications')} />

        {/* Display profile picture and username if logged in */}
        {isLoggedIn && profile ? (
          <div className="user-profile" onClick={() =>navigate('/profile', { state: { userId : profile._id } })}>
            <img
              src={profile?.profilePicture ? `${API.main}${profile.profilePicture}` : userImage}
              alt="Profile"
              className="profile-picture-small"
              style={{
                width: '25px',
                height: '25px',
                borderRadius: '50%',
                objectFit: 'cover',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            />
           
          </div>
        ) : (
          <FaUser className="icon" onClick={() =>navigate('/profile', { state: { userId : profile._id } })} />
        )}
      </div>

      {/* Modal for Search */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <SearchComponent />
      </Modal>
    </header>
  );
}

export default Header;