import React from 'react';

function StepNine({ formData, onPrevious, onSubmit }) {
  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div>
      <h2>Step 9: Submit Application</h2>
      <div style={styles.summaryBox}>
        <h3>Review Your Application</h3>
        <div style={styles.summaryItem}>
          <strong>Student Name:</strong> {formData.studentDetails?.studentName}
        </div>
        <div style={styles.summaryItem}>
          <strong>Email:</strong> {formData.contactDetails?.email}
        </div>
        <div style={styles.summaryItem}>
          <strong>Mobile:</strong> {formData.contactDetails?.mobileNo}
        </div>
        <div style={styles.summaryItem}>
          <strong>Gender:</strong> {formData.studentDetails?.gender}
        </div>
        <div style={styles.summaryItem}>
          <strong>Degree Group:</strong> {formData.preferences?.degreeGroup}
        </div>
        <p style={styles.note}>
          ✓ Please review all your details before submitting. Your application will generate a unique Application ID after submission.
        </p>
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={onPrevious} style={styles.buttonSecondary}>← Previous</button>
        <button onClick={handleSubmit} style={styles.submitButton}>Submit Application</button>
      </div>
    </div>
  );
}

const styles = {
  summaryBox: {
    backgroundColor: '#f0f8f0',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #4CAF50',
    marginBottom: '20px',
  },
  summaryItem: {
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  note: {
    marginTop: '15px',
    color: '#2e7d32',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: '30px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'space-between',
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
  submitButton: {
    padding: '10px 30px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default StepNine;