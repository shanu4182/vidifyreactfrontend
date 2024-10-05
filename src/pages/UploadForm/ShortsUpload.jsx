import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import API from "../../services/Api"; // Adjust the import according to your project structure
import { AuthContext } from "../../contexts/AuthContext";
import ChooseCard from "../../components/ChooseCard"; // Adjust the import according to your project structure
import ProgressModal from "../../components/ProgressModal"; // Adjust the import according to your project structure
import { ErrorMessage } from "../../components/StyledComponents";
import { useNavigate } from "react-router-dom";

function ShortsUpload({ categories, languages }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState(null); // For storing the generated thumbnail
  const [video, setVideo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null); // Track if thumbnail is being generated
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [isUploading, setIsUploading] = useState(false); // Track if video is uploading
  const canvasRef = useRef(null);
  const cancelTokenSource = useRef(null); // Ref to store the cancel token source

  const handleVideoUpload = (file) => {
    if (video) {
      URL.revokeObjectURL(video); // Clean up the previous video URL
    }

    const url = URL.createObjectURL(file);
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = url;

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      setVideoDuration(duration);
      if (duration <= 60) {
        setVideo(file);
      } else {
        setError(
          "Video exceeds the maximum allowed duration of 60 seconds. Please trim your video before uploading."
        );
        setVideo(null);
      }
    };
  };

  const generateThumbnail = () => {
    if (!video || isGenerating) {
      return;
    }

    setIsGenerating(true);

    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(video);

    videoElement.onloadedmetadata = () => {
      const randomTime = Math.random() * videoElement.duration;
      videoElement.currentTime = randomTime;
    };

    videoElement.onseeked = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const generatedThumbnail = new File([blob], "thumbnail.png", {
          type: "image/png",
        });
        setThumbnail(generatedThumbnail);
        setGeneratedThumbnail(URL.createObjectURL(generatedThumbnail)); // Set the preview
        setIsGenerating(false);
      });
    };

    videoElement.onerror = () => {
      setError("An error occurred while generating the thumbnail.");
      setIsGenerating(false);
    };
  };

  const uploadVideo = () => {
    if (
      !title ||
      !description ||
      !category ||
      !language ||
      !video ||
      !thumbnail
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryName", category);
    formData.append("language", language);
    formData.append("duration", videoDuration);
    formData.append("thumbnail", thumbnail);
    formData.append("file", video);

    setIsUploading(true);

    // Create a cancel token source
    cancelTokenSource.current = axios.CancelToken.source();

    axios
      .post(API.addShorts, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        cancelToken: cancelTokenSource.current.token, // Pass the cancel token
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then((response) => {
        navigate("/")
        resetFields();
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          setError("Upload canceled.");
        } else {
          console.error("Error:", error);
          setError("Upload failed: " + error.message);
        }
      })
      .finally(() => {
        setIsUploading(false);
        setUploadProgress(0);
        cancelTokenSource.current = null; // Reset the cancel token source
      });
  };

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setThumbnail(null);
    setGeneratedThumbnail(null); // Reset the generated thumbnail URL
    setVideo(null);
    setVideoDuration(0);
    setCategory("");
    setLanguage("");
  };

  const handleCloseModal = () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel("Upload canceled by the user.");
    }
    setIsUploading(false);
  };

  return (
    <div>
      <h2>Upload Shorts</h2>

      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Category:</label>
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
      </div>
      <div>
        <label>Language:</label>
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
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
        <div>
          <label>Upload Thumbnail</label>
          <ChooseCard
            placeholder="Click to select thumbnail"
            onFileSelect={setThumbnail}
            acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
            preview={generatedThumbnail} // Pass the generated thumbnail preview
          />
        </div>

        <div>
          <label>Upload Video</label>
          <ChooseCard
            placeholder="Click to select video"
            onFileSelect={handleVideoUpload}
            acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
          />
        </div>
      </div>
      {error && <ErrorMessage >{error}</ErrorMessage>}

      {video && (
        <button style={{ width: "100%" }} onClick={generateThumbnail} className="buttonUpload">
          Generate Thumbnail
        </button>
      )}
      
      <button style={{ width: "100%" }} className="buttonUpload" onClick={uploadVideo}>
        Upload
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <ProgressModal 
        isOpen={isUploading} 
        progress={uploadProgress} 
        onClose={handleCloseModal} // Handle modal close event
      />
    </div>
  );
}

export default ShortsUpload;
