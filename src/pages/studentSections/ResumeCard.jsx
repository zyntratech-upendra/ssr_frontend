import React from 'react';

function ResumeCard({ resume, onPreview, onDownload, onReplace, onDelete }) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = () => {
    if (resume.mimeType === 'application/pdf') {
      return (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <rect width="60" height="60" rx="8" fill="#e74c3c" />
          <text x="30" y="38" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold">
            PDF
          </text>
        </svg>
      );
    }
    return (
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <rect width="60" height="60" rx="8" fill="#2980b9" />
        <text x="30" y="38" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">
          DOC
        </text>
      </svg>
    );
  };

  const handleReplaceClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) onReplace(file);
    };
    input.click();
  };

  return (
    <div style={cardStyle}>
      <div style={iconContainerStyle} onClick={onPreview}>
        {getFileIcon()}
      </div>
      <div style={infoStyle}>
        <h3 style={nameStyle} title={resume.originalName}>
          {resume.originalName}
        </h3>
        <p style={sizeStyle}>{formatFileSize(resume.fileSize)}</p>
      </div>
      <div style={actionsStyle}>
        <button onClick={onPreview} style={actionButtonStyle}>
          Preview
        </button>
        <button onClick={onDownload} style={actionButtonStyle}>
          Download
        </button>
        <button onClick={handleReplaceClick} style={actionButtonStyle}>
          Replace
        </button>
        <button onClick={onDelete} style={{ ...actionButtonStyle, color: '#e74c3c' }}>
          Delete
        </button>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const iconContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem',
  cursor: 'pointer'
};

const infoStyle = {
  marginBottom: '1rem'
};

const nameStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#2c3e50',
  marginBottom: '0.5rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const sizeStyle = {
  fontSize: '0.875rem',
  color: '#7f8c8d'
};

const actionsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem'
};

const actionButtonStyle = {
  backgroundColor: 'transparent',
  color: '#3498db',
  padding: '0.5rem',
  borderRadius: '4px',
  fontSize: '0.875rem',
  border: '1px solid currentColor',
  transition: 'background-color 0.2s'
};

export default ResumeCard;
