import { useState } from 'react';
import './FormSection.css';

const AddressDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [formValues, setFormValues] = useState({
    houseNo: data.houseNo || '',
    street: data.street || '',
    mandal: data.mandal || '',
    pinCode: data.pinCode || '',
    district: data.district || '',
    secretariat: data.secretariat || '',
    village: data.village || ''
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
      <h2 className="section-title">Address Details</h2>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="houseNo">House No</label>
          <input
            type="text"
            id="houseNo"
            name="houseNo"
            value={formValues.houseNo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="district">District</label>
          <input
            type="text"
            id="district"
            name="district"
            value={formValues.district}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formValues.street}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="secretariat">Secretariat/Sachivalayam</label>
          <input
            type="text"
            id="secretariat"
            name="secretariat"
            value={formValues.secretariat}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="mandal">Mandal</label>
          <input
            type="text"
            id="mandal"
            name="mandal"
            value={formValues.mandal}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="village">Village</label>
          <input
            type="text"
            id="village"
            name="village"
            value={formValues.village}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pinCode">Pin Code</label>
          <input
            type="text"
            id="pinCode"
            name="pinCode"
            value={formValues.pinCode}
            onChange={handleChange}
            maxLength="6"
            pattern="[0-9]{6}"
            placeholder="6 digit pin code"
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

export default AddressDetails;
