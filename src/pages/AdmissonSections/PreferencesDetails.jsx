import { useState } from 'react';
import './FormSection.css';

const PreferencesDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [formValues, setFormValues] = useState({
    secondLanguage: data.secondLanguage || '',
    degreeGroup: data.degreeGroup || '',
    referenceLectureName: data.referenceLectureName || '',
    referenceLectureContact: data.referenceLectureContact || '',
    collegePreferences: data.collegePreferences || ['', '', '', '', '']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handlePreferenceChange = (index, value) => {
    const updatedPreferences = [...formValues.collegePreferences];
    updatedPreferences[index] = value;
    setFormValues({
      ...formValues,
      collegePreferences: updatedPreferences
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData('secondLanguage', formValues.secondLanguage);
    updateData('degreeGroup', formValues.degreeGroup);
    updateData('referenceLectureName', formValues.referenceLectureName);
    updateData('referenceLectureContact', formValues.referenceLectureContact);
    updateData('collegePreferences', formValues.collegePreferences);
    nextStep();
  };

  return (
    <form className="form-section" onSubmit={handleNext}>
      <h2 className="section-title">Preferences & Course Selection</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="secondLanguage">Second Language Preferred *</label>
          <select
            id="secondLanguage"
            name="secondLanguage"
            value={formValues.secondLanguage}
            onChange={handleChange}
            required
          >
            <option value="">Select Language</option>
            <option value="SANSKRIT">SANSKRIT</option>
            <option value="TELUGU">TELUGU</option>
            <option value="HINDI">HINDI</option>
            <option value="URDU">URDU</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="degreeGroup">Degree Group Chosen *</label>
          <select
            id="degreeGroup"
            name="degreeGroup"
            value={formValues.degreeGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Degree Group</option>
            <optgroup label="B.Sc">
              <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
              <option value="DATA ANALYTICS">DATA ANALYTICS</option>
              <option value="ELECTRONICS">ELECTRONICS</option>
              <option value="INTERNET OF THINGS">INTERNET OF THINGS</option>
              <option value="STATISTICS">STATISTICS</option>
              <option value="PHYSICS">PHYSICS</option>
            </optgroup>
            <optgroup label="B.Com">
              <option value="B.COM (COMPUTERS)">B.COM (COMPUTERS)</option>
            </optgroup>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="referenceLectureName">Reference Lecture Name</label>
          <input
            type="text"
            id="referenceLectureName"
            name="referenceLectureName"
            value={formValues.referenceLectureName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="referenceLectureContact">Reference Lecture Contact No</label>
          <input
            type="tel"
            id="referenceLectureContact"
            name="referenceLectureContact"
            value={formValues.referenceLectureContact}
            onChange={handleChange}
            maxLength="10"
            pattern="[0-9]{10}"
            placeholder="10 digit mobile number"
          />
        </div>
      </div>

      <div className="college-preferences">
        <h3>College Wise Preferences</h3>
        <p className="preference-note">List your preferred colleges in order of preference (1 being most preferred)</p>
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="form-group">
            <label htmlFor={`college${num}`}>College Preference {num}</label>
            <input
              type="text"
              id={`college${num}`}
              value={formValues.collegePreferences[num - 1]}
              onChange={(e) => handlePreferenceChange(num - 1, e.target.value)}
              placeholder={`Enter ${num}${num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th'} preference college name`}
            />
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" onClick={prevStep} className="btn btn-prev">
          <span className="btn-icon">←</span>
          Previous
        </button>
        <button type="submit" className="btn btn-next">
          Next Step
          <span className="btn-icon">→</span>
        </button>
      </div>
    </form>
  );
};

export default PreferencesDetails;
