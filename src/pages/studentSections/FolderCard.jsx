import React from 'react';

function FolderCard({ folder, onOpen, onRename, onDelete }) {
  return (
    <div style={cardStyle}>
      <div style={folderIconStyle} onClick={onOpen}>
        <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
          <path
            d="M0 8C0 3.58172 3.58172 0 8 0H32L40 8H72C76.4183 8 80 11.5817 80 16V56C80 60.4183 76.4183 64 72 64H8C3.58172 64 0 60.4183 0 56V8Z"
            fill="#f39c12"
          />
        </svg>
      </div>
      <div style={infoStyle}>
        <h3 style={nameStyle} onClick={onOpen}>{folder.name}</h3>
        <div style={actionsStyle}>
          <button onClick={onRename} style={actionButtonStyle}>Rename</button>
          <button onClick={onDelete} style={{ ...actionButtonStyle, color: '#e74c3c' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer'
};

const folderIconStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem'
};

const infoStyle = {
  textAlign: 'center'
};

const nameStyle = {
  fontSize: '1.1rem',
  fontWeight: '500',
  color: '#2c3e50',
  marginBottom: '1rem',
  wordBreak: 'break-word'
};

const actionsStyle = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center'
};

const actionButtonStyle = {
  backgroundColor: 'transparent',
  color: '#3498db',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  fontSize: '0.9rem',
  border: '1px solid currentColor',
  transition: 'background-color 0.2s'
};

export default FolderCard;
