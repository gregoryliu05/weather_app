import React from 'react';

function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>About PM Accelerator</h2>
        
        <div className="modal-body">
          <h3>Overview</h3>
          <p>
            The Product Manager Accelerator Program is designed to support PM professionals 
            through every stage of their careers. From students looking for entry-level jobs 
            to Directors looking to take on a leadership role, our program has helped over 
            hundreds of students fulfill their career aspirations.
          </p>
          
          <p>
            Our Product Manager Accelerator community are ambitious and committed. Through 
            our program they have learnt, honed and developed new PM and leadership skills, 
            giving them a strong foundation for their future endeavors.
          </p>
          
          <div className="social-link">
            <a 
              href="https://www.linkedin.com/company/pmaccelerator/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Visit our LinkedIn Page →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal; 