import React, { useState, useContext, useRef } from "react";
import axios, { CancelToken } from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import ChooseCard from "../../components/ChooseCard";
import { ErrorMessage } from "../../components/StyledComponents";
import ProgressModal from "../../components/ProgressModal";
import { useNavigate } from 'react-router-dom';

const VideoUpload = ({ categories, languages }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");  // New state for tags
  const [duration, setDuration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelToken, setCancelToken] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }
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
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const generateThumbnail = () => {
    if (!file || isGenerating) {
      return;
    }

    setIsGenerating(true);

    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const randomTime = Math.random() * video.duration;
      video.currentTime = randomTime;
    };

    video.onseeked = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const generatedThumbnail = new File([blob], "thumbnail.png", {
          type: "image/png",
        });
        setThumbnail(generatedThumbnail);
        setThumbnailPreview(URL.createObjectURL(generatedThumbnail));
        setIsGenerating(false);
      });
    };

    video.onerror = () => {
      setError("An error occurred while generating the thumbnail.");
      setIsGenerating(false);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file || !thumbnail || !category || !language) {
      setError("Please fill in all required fields and select both video and thumbnail files");
      return;
    }

    const source = CancelToken.source();
    setCancelToken(source);

    setIsModalOpen(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("thumbnail", thumbnail);
      formData.append("categoryName", category);
      formData.append("language", language);
      formData.append("tags", tags);  // Include tags in form data
      formData.append("duration", duration);

      await axios.post(API.addVideo, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
        cancelToken: source.token,
      });

      navigate("/");  // Navigate to the homepage
      setIsModalOpen(false);

      setTitle("");
      setDescription("");
      setFile(null);
      setThumbnail(null);
      setThumbnailPreview(null);
      setCategory("");
      setLanguage("");
      setTags("");  // Reset tags field
      setDuration("");
      setProgress(0);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload cancelled");
      } else {
        console.error("Error adding video:", error);
        setError("Failed to add video.");
      }
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    if (cancelToken) {
      cancelToken.cancel("Upload cancelled by user.");
    }
    setIsModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="uploadForm">
      <div className="uploadFormTitleDescription">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={6}
          required
        />
      </div>
      <div className="uploadFormImageVideo">
        <ChooseCard
          placeholder="Click to select thumbnail"
          onFileSelect={handleThumbnailChange}
          acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
          preview={thumbnailPreview}
        />
        <ChooseCard
          placeholder="Click to select video"
          onFileSelect={handleFileChange}
          acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
        />
      </div>
      <div className="uploadFormDropdown">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
        >
          <option value="">Select a language</option>
          {languages.map((lang) => (
            <option key={lang._id} value={lang._id}>
              {lang.name}
            </option>
          ))}
        </select>

        {/* Add a new input field for tags */}
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags (comma separated)"
        />
        <p className="description"></p>

        {file && (
          <button type="button" onClick={generateThumbnail} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Click Here To Regenerate"}
          </button>
        )}
        <button type="submit">Submit</button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <ProgressModal isOpen={isModalOpen} progress={progress} onClose={handleModalClose} />
    </form>
  );
};

export default VideoUpload;
