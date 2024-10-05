import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../services/Api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setIsLoggedIn(true);
        await fetchUserProfile(storedToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (authToken) => {
    try {
      const response = await axios.get(API.getMyProfile, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If profile fetch fails, we should probably log out the user
      logout();
    }
  };

  const login = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
    await fetchUserProfile(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, token, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};