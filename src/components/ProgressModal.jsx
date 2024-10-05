// ProgressModal.js
import React from 'react';
import './ProgressModal.css'; // Add your styles here

const ProgressModal = ({ isOpen, progress, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="progress-modal">
      <div className="progress-modal-content">
        <h2 style={{color:"blue"}}>{progress}%</h2>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <button className='buttonUpload' onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ProgressModal;
