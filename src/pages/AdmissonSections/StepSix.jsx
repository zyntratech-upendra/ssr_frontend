import React, { useState } from 'react';

function StepSix({ data, onNext, onPrevious }) {
  const [studyDetails, setStudyDetails] = useState(data || Array(7).fill({}));

  const handleChange = (index, field, value) => {
    const newData = [...studyDetails];
    newData[index] = {
      ...newData[index],
      [field]: value,
    };
    setStudyDetails(newData);
  };

  const handleNext = () => {
    onNext({ studyDetails });
  };

  const classNames = [
    '2nd Inter',
    '1st Inter',
    '10th Class',
    '9th Class',
    '8th Class',
    '7th Class',
    '6th Class',
  ];

  return (
    <div>
      <h2>Step 6: Last 7 Years Study Details</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th>S.No</th>
              <th>School/College Name</th>
              <th>Academic Year</th>
              <th>Class</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            {classNames.map((className, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>
                  <input
                    type="text"
                    value={studyDetails[index]?.schoolCollegeName || ''}
                    onChange={(e) =>
                      handleChange(index, 'schoolCollegeName', e.target.value)
                    }
                    style={styles.tableInput}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="text"
                    value={studyDetails[index]?.academicYear || ''}
                    onChange={(e) =>
                      handleChange(index, 'academicYear', e.target.value)
                    }
                    style={styles.tableInput}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="text"
                    value={className}
                    disabled
                    style={{ ...styles.tableInput, backgroundColor: '#f5f5f5' }}
                  />
                </td>
                <td style={styles.tableCell}>
                  <input
                    type="text"
                    value={studyDetails[index]?.place || ''}
                    onChange={(e) => handleChange(index, 'place', e.target.value)}
                    style={styles.tableInput}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={onPrevious} style={styles.buttonSecondary}>← Previous</button>
        <button onClick={handleNext} style={styles.button}>Next →</button>
      </div>
    </div>
  );
}

const styles = {
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  tableInput: {
    width: '100%',
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '3px',
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

export default StepSix;