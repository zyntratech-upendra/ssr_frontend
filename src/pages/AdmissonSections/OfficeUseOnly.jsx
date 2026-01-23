import { useState } from 'react';
import './FormSection.css';

const OfficeUseOnly = ({ data, updateData, prevStep, handleSubmit }) => {
  const [formValues, setFormValues] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    updateData(formValues);
    handleSubmit();
  };

  return (
    <form className="form-section office-section" onSubmit={handleFinalSubmit}>
      <div className="office-header">
        <h2 className="section-title">For Office Use Only</h2>
        <p className="office-note">This section should be filled by administrative staff only</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="applicationFeePaid">Application Fee Paid</label>
          <select
            id="applicationFeePaid"
            name="applicationFeePaid"
            value={formValues.applicationFeePaid}
            onChange={handleChange}
          >
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="studentIdGenerated">Student Id Generated</label>
          <input
            type="text"
            id="studentIdGenerated"
            name="studentIdGenerated"
            value={formValues.studentIdGenerated}
            onChange={handleChange}
            placeholder="Enter student ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="onlinePassword">Online Application Password</label>
          <input
            type="text"
            id="onlinePassword"
            name="onlinePassword"
            value={formValues.onlinePassword}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="appliedOnlineFirstPart">Whether applied online 1st part</label>
          <select
            id="appliedOnlineFirstPart"
            name="appliedOnlineFirstPart"
            value={formValues.appliedOnlineFirstPart}
            onChange={handleChange}
          >
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="collegeOptionsEntered">College Options Entered</label>
          <select
            id="collegeOptionsEntered"
            name="collegeOptionsEntered"
            value={formValues.collegeOptionsEntered}
            onChange={handleChange}
          >
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="collegeAllotmentStatus">College Allotment Status</label>
          <textarea
            id="collegeAllotmentStatus"
            name="collegeAllotmentStatus"
            value={formValues.collegeAllotmentStatus}
            onChange={handleChange}
            rows="3"
            placeholder="Enter allotment status details"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={prevStep} className="btn btn-prev">
          <span className="btn-icon">←</span>
          Previous
        </button>
        <button type="submit" className="btn btn-submit">
          Submit Application
          <span className="btn-icon">✓</span>
        </button>
      </div>
    </form>
  );
};

export default OfficeUseOnly;
