import React, { useState, useEffect } from 'react';

function FolderModal({ folder, onSave, onClose }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (folder) {
      setName(folder.name);
    }
  }, [folder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={titleStyle}>
          {folder ? 'Rename Folder' : 'Create New Folder'}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            style={inputStyle}
            autoFocus
          />
          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={saveButtonStyle}>
              {folder ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '2rem',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '1.5rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  marginBottom: '1.5rem'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end'
};

const cancelButtonStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  backgroundColor: '#ecf0f1',
  color: '#2c3e50',
  borderRadius: '4px'
};

const saveButtonStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  backgroundColor: '#3498db',
  color: 'white',
  borderRadius: '4px'
};

export default FolderModal;
