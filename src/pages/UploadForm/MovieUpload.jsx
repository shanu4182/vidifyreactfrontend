import React, { useState, useContext } from "react";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import ChooseCard from "../../components/ChooseCard"; // Adjust the import path as needed
import { ErrorMessage } from "../../components/StyledComponents";
import ProgressModal from "../../components/ProgressModal";
import { useNavigate } from "react-router-dom";

const MovieUpload = ({ categories, languages }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [abortController, setAbortController] = useState(null); // State to keep track of the AbortController instance

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("video/")) {
      setErrorMessage("Please select a valid video file");
      return;
    }
    setErrorMessage("");
    setFile(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const videoDuration = Math.floor(video.duration);
      const hours = Math.floor(videoDuration / 3600);
      const minutes = Math.floor((videoDuration % 3600) / 60);
      const seconds = videoDuration % 60;
      setDuration(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };
    video.src = URL.createObjectURL(file);
  };

  const handleThumbnailChange = (file) => {
    setThumbnail(file);
  };

  const handleTrailerChange = (file) => {
    setTrailer(file);
  };

  const validateInputs = () => {
    let isValid = true;

    if (!name.trim()) {
      setErrorMessage("Name is required");
      isValid = false;
    }
    if (!description.trim()) {
      setErrorMessage("Description is required");
      isValid = false;
    }
    if (!file) {
      setErrorMessage("Video file is required");
      isValid = false;
    }
    if (!thumbnail) {
      setErrorMessage("Thumbnail is required");
      isValid = false;
    }
    if (!trailer) {
      setErrorMessage("Trailer file is required");
      isValid = false;
    }
    if (!category) {
      setErrorMessage("Category is required");
      isValid = false;
    }
    if (!language) {
      setErrorMessage("Language is required");
      isValid = false;
    }
    if (!releaseDate) {
      setErrorMessage("Release date is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("thumbnail", thumbnail);
    formData.append("trailer", trailer);
    formData.append("categoryName", category);
    formData.append("releaseDate", releaseDate);
    formData.append("language", language);
    formData.append("duration", duration);

    const controller = new AbortController();
    setAbortController(controller); // Save the controller instance

    try {
      setIsUploading(true);
      await axios.post(API.addMovie, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
        signal: controller.signal, // Pass the signal to the request
      });

      setErrorMessage("");
      navigate("/");
      setProgress(100);
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        setErrorMessage(
          `Failed to add movie: ${
            error.response.data.message || error.response.data
          }`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        setErrorMessage("Upload canceled by user.");
      } else if (error.message === 'canceled') {
        setErrorMessage("Upload canceled by user.");
      } else {
        console.error("Error message:", error.message);
        setErrorMessage(`Failed to add movie: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    if (abortController) {
      abortController.abort(); // Abort the request
    }
    setIsUploading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="movieImageVideoUpload">
          <div>
            <label>Video File:</label>
            <ChooseCard
              placeholder="Click to select video"
              onFileSelect={handleFileChange}
              acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
            />
          </div>
          <div>
            <label>Thumbnail:</label>
            <ChooseCard
              placeholder="Click to select thumbnail"
              onFileSelect={handleThumbnailChange}
              acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
            />
          </div>
          <div>
            <label>Trailer:</label>
            <ChooseCard
              placeholder="Click to select trailer"
              onFileSelect={handleTrailerChange}
              acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
            />
          </div>
        </div>

        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select a language</option>
            {languages.map((lang) => (
              <option key={lang._id} value={lang._id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Release Date:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <button type="submit">Submit</button>
      </form>
      <ProgressModal
        isOpen={isUploading}
        progress={progress}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MovieUpload;
