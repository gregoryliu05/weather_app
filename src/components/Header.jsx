import React, { useState } from 'react';
import InfoModal from './InfoModal';

function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="header">
      <h1>Weather App</h1>
      <div className="header-content">
        <p className="author">Created by Gregory Liu</p>
        <button 
          className="info-button"
          onClick={() => setShowModal(true)}
        >
          ℹ️ About PM Accelerator
        </button>
      </div>
      
      <InfoModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}

export default Header; 