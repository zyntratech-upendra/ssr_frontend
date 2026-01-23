import React, { useState } from 'react';

function StepEight({ data, onNext, onPrevious }) {
  const [formData, setFormData] = useState(data || {});
  const [previews, setPreviews] = useState({});

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [name]: event.target.result,
        }));
        setPreviews((prev) => ({
          ...prev,
          [name]: event.target.result,
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    onNext({ signatureUpload: formData });
  };

  return (
    <div>
      <h2>Step 8: Signature & Photo Upload</h2>
      
      <div style={styles.formGroup}>
        <label>Student Signature *</label>
        <input
          type="file"
          name="studentSignature"
          onChange={handleFileChange}
          style={styles.input}
          accept=".jpg,.jpeg,.png,.pdf"
          required
        />
        {previews.studentSignature && (
          <div style={styles.preview}>
            {previews.studentSignature.startsWith('data:image') ? (
              <img src={previews.studentSignature} alt="signature" style={styles.previewImage} />
            ) : (
              <p>PDF selected</p>
            )}
          </div>
        )}
      </div>

      <div style={styles.formGroup}>
        <label>Passport Size Photo *</label>
        <input
          type="file"
          name="passportSizePhoto"
          onChange={handleFileChange}
          style={styles.input}
          accept=".jpg,.jpeg,.png"
          required
        />
        {previews.passportSizePhoto && (
          <div style={styles.preview}>
            <img src={previews.passportSizePhoto} alt="photo" style={styles.previewImage} />
          </div>
        )}
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={onPrevious} style={styles.buttonSecondary}>← Previous</button>
        <button onClick={handleNext} style={styles.button}>Next →</button>
      </div>
    </div>
  );
}

const styles = {
  formGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  preview: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '4px',
  },
  buttonContainer: {
    marginTop: '30px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 30px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  buttonSecondary: {
    padding: '10px 30px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default StepEight;