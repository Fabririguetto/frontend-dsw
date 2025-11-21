import React from 'react';
import './ModalSucursal.css'; 

function ModalSucursal({ showModal, onClose, children }) {
  if (!showModal) return null;

  return (
    <div className="modal">
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button id="close-modal-btn" className="close-btn" onClick={onClose}>x</button>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalSucursal;