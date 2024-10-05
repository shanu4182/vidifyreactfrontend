import React, { useState, useEffect } from "react";

const ChooseCard = ({ placeholder, onFileSelect, acceptedTypes, preview }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (preview) {
      setSelectedFile(preview);
    }
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (acceptedTypes && !acceptedTypes.includes(file.type)) {
      alert(`Please select a valid file of type: ${acceptedTypes.join(", ")}`);
      return;
    }

    const objectURL = URL.createObjectURL(file);
    setSelectedFile(objectURL);
    onFileSelect(file);
  };

  const renderPreview = () => {
    if (!selectedFile) return <span>{placeholder}</span>;

    if (selectedFile.startsWith("blob:") || selectedFile.startsWith("http")) {
      if (acceptedTypes.some(type => type.startsWith("image/"))) {
        return (
          <img
            src={selectedFile}
            alt="Selected"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: "8px",
            }}
          />
        );
      } else if (acceptedTypes.some(type => type.startsWith("video/"))) {
        return (
          <video
            src={selectedFile}
            controls
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              borderRadius: "8px",
            }}
          >
            Your browser does not support the video tag.
          </video>
        );
      }
    } else {
      return <span>Unsupported file type</span>;
    }
  };

  return (
    <div
      className="chooseCard"
      style={{
        border: "2px dashed #ccc",
        borderRadius: "8px",
        padding: "16px",
        cursor: "pointer",
        textAlign: "center",
        position: "relative",
      }}
      onClick={() => document.getElementById(placeholder).click()}
    >
      {renderPreview()}
      <input
        id={placeholder}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept={acceptedTypes?.join(",")}
      />
    </div>
  );
};

export default ChooseCard;
