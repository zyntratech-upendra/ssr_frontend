import React, { useState } from 'react';

function StepSeven({ data, onNext, onPrevious }) {
  const [formData, setFormData] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBscChange = (specialization) => {
    const current = formData.bscSpecializations || [];
    const updated = current.includes(specialization)
      ? current.filter((s) => s !== specialization)
      : [...current, specialization];
    setFormData((prev) => ({
      ...prev,
      bscSpecializations: updated,
    }));
  };

  const handleCollegePreference = (index, value) => {
    const preferences = formData.collegePreferences || ['', '', '', '', ''];
    preferences[index] = value;
    setFormData((prev) => ({
      ...prev,
      collegePreferences: preferences,
    }));
  };

  const handleNext = () => {
    onNext({ preferences: formData });
  };

  const bscOptions = [
    'Computer Science',
    'Data Analytics',
    'Electronics',
    'Internet of Things',
    'Statistics',
    'Physics',
  ];

  return (
    <div>
      <h2>Step 7: Preferences</h2>
      
      <div style={styles.section}>
        <h3>Second Language *</h3>
        <div style={styles.radioGroup}>
          {['Sanskrit', 'Telugu', 'Hindi', 'Urdu'].map((lang) => (
            <label key={lang} style={styles.radioLabel}>
              <input
                type="radio"
                name="secondLanguage"
                value={lang}
                checked={formData.secondLanguage === lang}
                onChange={handleChange}
              />
              {lang}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3>Degree Group *</h3>
        <div style={styles.radioGroup}>
          {['BSc', 'BCom'].map((group) => (
            <label key={group} style={styles.radioLabel}>
              <input
                type="radio"
                name="degreeGroup"
                value={group}
                checked={formData.degreeGroup === group}
                onChange={handleChange}
              />
              {group}
            </label>
          ))}
        </div>
      </div>

      {formData.degreeGroup === 'BSc' && (
        <div style={styles.section}>
          <h3>BSc Specializations</h3>
          <div style={styles.checkboxGroup}>
            {bscOptions.map((option) => (
              <label key={option} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={(formData.bscSpecializations || []).includes(option)}
                  onChange={() => handleBscChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h3>College Preferences (1 to 5)</h3>
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} style={styles.formGroup}>
            <label>College Preference {num}</label>
            <input
              type="text"
              value={formData.collegePreferences?.[num - 1] || ''}
              onChange={(e) => handleCollegePreference(num - 1, e.target.value)}
              style={styles.input}
              placeholder="Enter college name or code"
            />
          </div>
        ))}
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={onPrevious} style={styles.buttonSecondary}>← Previous</button>
        <button onClick={handleNext} style={styles.button}>Next →</button>
      </div>
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  formGroup: {
    marginBottom: '15px',
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

export default StepSeven;