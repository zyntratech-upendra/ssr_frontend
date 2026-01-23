import { useState } from 'react';
import './FormSection.css';

const ContactDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [formValues, setFormValues] = useState({
    mobile: data.mobile || '',
    parentsContact: data.parentsContact || '',
    guardianContact: data.guardianContact || '',
    email: data.email || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData(formValues);
    nextStep();
  };

  return (
    <form className="form-section" onSubmit={handleNext}>
      <h2 className="section-title">Contact Details</h2>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="mobile">Mobile No *</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formValues.mobile}
            onChange={handleChange}
            required
            maxLength="10"
            pattern="[0-9]{10}"
            placeholder="10 digit mobile number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="parentsContact">Parents Contact No</label>
          <input
            type="tel"
            id="parentsContact"
            name="parentsContact"
            value={formValues.parentsContact}
            onChange={handleChange}
            maxLength="10"
            pattern="[0-9]{10}"
            placeholder="10 digit mobile number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="guardianContact">Guardian Contact No</label>
          <input
            type="tel"
            id="guardianContact"
            name="guardianContact"
            value={formValues.guardianContact}
            onChange={handleChange}
            maxLength="10"
            pattern="[0-9]{10}"
            placeholder="10 digit mobile number"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
          />
        </div>
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

export default ContactDetails;
