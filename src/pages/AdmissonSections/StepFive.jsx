import React, { useState } from 'react';

function StepFive({ data, onNext, onPrevious }) {
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
    onNext({ uploadedFiles: formData });
  };

  const fileFields = [
    'tenthMarksMemo',
    'interMarksTC',
    'studentAadhar',
    'motherAadhar',
    'casteCertificate',
    'rationRiceCard',
    'motherBankPassbook',
    'incomeCertificate',
    'passportSizePhotos',
  ];

  const fileLabels = {
    tenthMarksMemo: '10th Marks Memo',
    interMarksTC: 'Inter Marks + TC',
    studentAadhar: 'Student Aadhar',
    motherAadhar: 'Mother Aadhar',
    casteCertificate: 'Caste Certificate',
    rationRiceCard: 'Ration + Rice Card',
    motherBankPassbook: 'Mother Bank Passbook',
    incomeCertificate: 'Income Certificate',
    passportSizePhotos: 'Passport Size Photos',
  };

  return (
    <div>
      <h2>Step 5: Upload Xerox Copies</h2>
      {fileFields.map((field) => (
        <div key={field} style={styles.formGroup}>
          <label>{fileLabels[field]} *</label>
          <input
            type="file"
            name={field}
            onChange={handleFileChange}
            style={styles.input}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {previews[field] && (
            <div style={styles.preview}>
              {previews[field].startsWith('data:image') ? (
                <img src={previews[field]} alt="preview" style={styles.previewImage} />
              ) : (
                <p>PDF selected</p>
              )}
            </div>
          )}
        </div>
      ))}
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

export default StepFive;