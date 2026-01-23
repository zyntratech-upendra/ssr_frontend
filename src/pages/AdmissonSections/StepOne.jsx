import React, { useState } from 'react';

function StepOne({ data, onNext }) {
  const [formData, setFormData] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    onNext({ studentDetails: formData });
  };

  return (
    <div>
      <h2>Step 1: Student Details</h2>
      <div style={styles.formGroup}>
        <label>Student Name *</label>
        <input
          type="text"
          name="studentName"
          value={formData.studentName || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Father's Name *</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Mother's Name *</label>
        <input
          type="text"
          name="motherName"
          value={formData.motherName || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Date of Birth *</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth || ''}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Gender *</label>
        <select
          name="gender"
          value={formData.gender || ''}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label>Aadhar Number *</label>
        <input
          type="text"
          name="aadharNumber"
          value={formData.aadharNumber || ''}
          onChange={handleChange}
          style={styles.input}
          placeholder="12-digit Aadhar"
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label>Blood Group</label>
        <select
          name="bloodGroup"
          value={formData.bloodGroup || ''}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Blood Group</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label>Intermediate Hall Ticket No</label>
        <input
          type="text"
          name="interHallTicketNo"
          value={formData.interHallTicketNo || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label>Inter Group</label>
        <select
          name="interGroup"
          value={formData.interGroup || ''}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Group</option>
          <option value="MPC">MPC</option>
          <option value="BiPC">BiPC</option>
          <option value="HEC">HEC</option>
        </select>
      </div>
      <div style={styles.formGroup}>
        <label>10th Hall Ticket No</label>
        <input
          type="text"
          name="tenthHallTicketNo"
          value={formData.tenthHallTicketNo || ''}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={styles.buttonContainer}>
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
    justifyContent: 'flex-end',
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
};

export default StepOne;