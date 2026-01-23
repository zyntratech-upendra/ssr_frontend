import React, { useState } from 'react';

function StepThree({ data, onNext, onPrevious }) {
  const [formData, setFormData] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    onNext({ contactDetails: formData });
  };

  return (
    <div>
      <h2>Step 3: Contact Details</h2>
      <div style={styles.formGroup}>
        <label>Mobile No *</label>
        <input
          type="tel"
          name="mobileNo"
          value={formData.mobileNo || ''}
          onChange={handleChange}
          style={styles.input}
          placeholder="10-digit mobile number"
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Parents Contact No</label>
        <input
          type="tel"
          name="parentsContactNo"
          value={formData.parentsContactNo || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Guardian Contact No</label>
        <input
          type="tel"
          name="guardianContactNo"
          value={formData.guardianContactNo || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
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

export default StepThree;