import React, { useContext, useEffect, useState } from "react";
import "./upload.css";
import VideoUpload from "./Videoupload";
import MovieUpload from "./MovieUpload";
import SeriesUpload from "./SeriesUpload";
import ShortsUpload from "./ShortsUpload";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";

function UploadScreen() {
  const {token} = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(1);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
      const response = await axios.get(API.getCategories, { headers: { Authorization: `Bearer ${token}` } });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(API.languages, { headers: { Authorization: `Bearer ${token}` } });
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };
    console.log("check categories and languages");
    fetchCategories();
    fetchLanguages();
  }, []);

  return (
    <div className="UploadScreen">
      <div className="tab">
        <button
          onClick={() => setActiveTab(1)}
          className={activeTab === 1 ? "active" : undefined}
        >
          Add Video
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={activeTab === 2 ? "active" : undefined}
        >
          Add Movies
        </button>
        <button
          onClick={() => setActiveTab(3)}
          className={activeTab === 3 ? "active" : undefined}
        >
          Add Playlist or Series
        </button>
        <button
          onClick={() => setActiveTab(4)}
          className={activeTab === 4 ? "active" : undefined}
        >
          Add Shorts
        </button>
      </div>
      {activeTab === 1 ? (
        <VideoUpload  categories={categories} languages={languages}/>
      ) : activeTab === 2 ? (
        <MovieUpload  categories={categories} languages={languages}/>
      ) : activeTab === 3 ? (
        <SeriesUpload  categories={categories} languages={languages}/>
      ) : (
        <ShortsUpload  categories={categories} languages={languages}/>
      )}
    </div>
  );
}

export default UploadScreen;
