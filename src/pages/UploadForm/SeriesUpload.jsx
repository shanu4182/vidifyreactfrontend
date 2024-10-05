import React, { useState, useContext } from "react";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import ChooseCard from "../../components/ChooseCard";
import { useNavigate } from "react-router-dom";
import "./upload.css";

function SeriesUpload({ categories, languages }) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    language: "",
    thumbnail: null,
    trailer: null,
    category: "",
    is_subscription: false,
  });
  const [releaseDate, setReleaseDate] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [episodes, setEpisodes] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileSelect = (file, type) => {
    if (type === "thumbnail") {
      setFormData({ ...formData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
    } else if (type === "trailer") {
      setFormData({ ...formData, trailer: file });
    }
  };

  const handleEpisodeChange = (index, e) => {
    const { name, value } = e.target;
    setEpisodes((prevEpisodes) => {
      const updatedEpisodes = [...prevEpisodes];
      updatedEpisodes[index] = {
        ...updatedEpisodes[index],
        [name]: value,
      };
      return updatedEpisodes;
    });
  };

  const handleEpisodeFileSelect = (index, file, type) => {
    setEpisodes((prevEpisodes) => {
      const updatedEpisodes = [...prevEpisodes];
      updatedEpisodes[index] = {
        ...updatedEpisodes[index],
        [type]: file,
      };
      return updatedEpisodes;
    });
  };

  const addEpisode = () => {
    setEpisodes((prevEpisodes) => [
      ...prevEpisodes,
      {
        title: "",
        description: "",
        video: null,
        thumbnail: null,
        seasonNumber: "", // Added season number
        episodeNumber: "", // Added episode number
      },
    ]);
  };

  const removeEpisode = (index) => {
    setEpisodes((prevEpisodes) => prevEpisodes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.thumbnail || !formData.trailer) {
      alert("Please upload both a thumbnail and a trailer.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("tags", formData.tags);
    formDataToSend.append("language", formData.language);
    formDataToSend.append("releaseDate", releaseDate);
    formDataToSend.append("thumbnail", formData.thumbnail);
    formDataToSend.append("trailer", formData.trailer);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("is_subscription", formData.is_subscription);

    try {
      setIsUploading(true);
      const response = await axios.post(`${API.addSeries}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const seriesId = response.data.series?._id || response.data._id;

      if (!seriesId) {
        alert("Failed to retrieve the series ID. Please try again.");
        return;
      }

      for (let i = 0; i < episodes.length; i++) {
        const episodeData = new FormData();
        episodeData.append("title", episodes[i].title);
        episodeData.append("description", episodes[i].description);
        episodeData.append("language", formData.language);
        episodeData.append("category", formData.category);
        episodeData.append("thumbnail", episodes[i].thumbnail);
        episodeData.append("file", episodes[i].file);
        episodeData.append("contentType", "episode");
        episodeData.append("seasonNumber", episodes[i].seasonNumber); // Include season number
        episodeData.append("episodeNumber", episodes[i].episodeNumber); // Include episode number

        await axios.post(`${API.addEpisode.replace(':seriesId', seriesId)}`, episodeData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Series and episodes uploaded successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error uploading series or episodes:", error);
      alert("Error uploading series or episodes");
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <div>
      <h1>Upload New Series</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., adventure, mystery"
          />
        </div>
        <div>
          <label>Language:</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
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

        <div>
          <label>Thumbnail</label>
          <ChooseCard
            placeholder="Click to select thumbnail"
            onFileSelect={(file) => handleFileSelect(file, "thumbnail")}
            acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
            preview={thumbnailPreview}
          />
        </div>

        <div>
          <label>Trailer</label>
          <ChooseCard
            placeholder="Click to select trailer"
            onFileSelect={(file) => handleFileSelect(file, "trailer")}
            acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
          />
        </div>

        <div>
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label>Release Date:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>

        {episodes.map((episode, index) => (
          <div key={index}>
            <h3>Episode {index + 1}</h3>
            <div>
              <label>Season Number:</label>
              <input
                type="number"
                name="seasonNumber"
                value={episode.seasonNumber}
                onChange={(e) => handleEpisodeChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Episode Number:</label>
              <input
                type="number"
                name="episodeNumber"
                value={episode.episodeNumber}
                onChange={(e) => handleEpisodeChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={episode.title}
                onChange={(e) => handleEpisodeChange(index, e)}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                value={episode.description}
                onChange={(e) => handleEpisodeChange(index, e)}
              />
            </div>
            <div>
              <label>Thumbnail</label>
              <ChooseCard
                placeholder="Click to select episode thumbnail"
                onFileSelect={(file) =>
                  handleEpisodeFileSelect(index, file, "thumbnail")
                }
                acceptedTypes={["image/jpeg", "image/png", "image/gif"]}
              />
            </div>
            <div>
              <label>Video</label>
              <ChooseCard
                placeholder="Click to select episode video"
                onFileSelect={(file) =>
                  handleEpisodeFileSelect(index, file, "file")
                }
                acceptedTypes={["video/mp4", "video/mov", "video/avi"]}
              />
            </div>
            <button type="button" onClick={() => removeEpisode(index)}>
              Remove Episode
            </button>
          </div>
        ))}
        <button type="button" onClick={addEpisode}>
          Add Episode
        </button>

        <button type="submit" disabled={isUploading}>
          {isUploading
            ? `Uploading... (${uploadProgress}%)`
            : "Upload Series and Episodes"}
        </button>
      </form>
    </div>
  );
}

export default SeriesUpload;