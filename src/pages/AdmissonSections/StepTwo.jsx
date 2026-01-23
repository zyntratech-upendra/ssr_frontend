import React, { useState } from 'react';

function StepTwo({ data, onNext, onPrevious }) {
  const [formData, setFormData] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    onNext({ addressDetails: formData });
  };

  return (
    <div>
      <h2>Step 2: Address Details</h2>
      <div style={styles.formGroup}>
        <label>House No *</label>
        <input
          type="text"
          name="houseNo"
          value={formData.houseNo || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Street *</label>
        <input
          type="text"
          name="street"
          value={formData.street || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Village *</label>
        <input
          type="text"
          name="village"
          value={formData.village || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Mandal *</label>
        <input
          type="text"
          name="mandal"
          value={formData.mandal || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>District *</label>
        <input
          type="text"
          name="district"
          value={formData.district || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Secretariat / Sachivalayam</label>
        <input
          type="text"
          name="secretariatSachivalayam"
          value={formData.secretariatSachivalayam || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Pin Code *</label>
        <input
          type="text"
          name="pinCode"
          value={formData.pinCode || ''}
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

export default StepTwo;