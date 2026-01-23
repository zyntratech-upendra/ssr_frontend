import React, { useState } from 'react';

function StepFour({ data, onNext, onPrevious }) {
  const [formData, setFormData] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    onNext({ otherDetails: formData });
  };

  return (
    <div>
      <h2>Step 4: Other Details</h2>
      <div style={styles.formGroup}>
        <label>Religion</label>
        <select
          name="religion"
          value={formData.religion || ''}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Religion</option>
          <option value="Hindu">Hindu</option>
          <option value="Muslim">Muslim</option>
          <option value="Christian">Christian</option>
          <option value="Sikh">Sikh</option>
          <option value="Buddhist">Buddhist</option>
          <option value="Jain">Jain</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label>Category *</label>
        <select
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Category</option>
          <option value="OC">OC (Open Category)</option>
          <option value="BC-A">BC-A</option>
          <option value="BC-B">BC-B</option>
          <option value="BC-C">BC-C</option>
          <option value="BC-D">BC-D</option>
          <option value="BC-E">BC-E</option>
          <option value="ST">ST (Scheduled Tribe)</option>
          <option value="SC">SC (Scheduled Caste)</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label>Caste</label>
        <input
          type="text"
          name="caste"
          value={formData.caste || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Physically Challenged</label>
        <select
          name="physicallyChallenged"
          value={formData.physicallyChallenged || ''}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label>Caste Certificate Mee Seva No</label>
        <input
          type="text"
          name="casteCertificateMeeSevaNa"
          value={formData.casteCertificateMeeSevaNa || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Income Certificate Mee Seva No</label>
        <input
          type="text"
          name="incomeCertificateMeeSevaNa"
          value={formData.incomeCertificateMeeSevaNa || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>EWS Mee Seva No (if OC)</label>
        <input
          type="text"
          name="ewsMeeSevaNa"
          value={formData.ewsMeeSevaNa || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Ration Card No</label>
        <input
          type="text"
          name="rationCardNo"
          value={formData.rationCardNo || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Rice Card No</label>
        <input
          type="text"
          name="riceCardNo"
          value={formData.riceCardNo || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Mother Aadhar</label>
        <input
          type="text"
          name="motherAadhar"
          value={formData.motherAadhar || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Bank Name</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Bank IFSC</label>
        <input
          type="text"
          name="bankIFSC"
          value={formData.bankIFSC || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Bank Account No</label>
        <input
          type="text"
          name="bankAccountNo"
          value={formData.bankAccountNo || ''}
          onChange={handleChange}
          style={styles.input}
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

export default StepFour;