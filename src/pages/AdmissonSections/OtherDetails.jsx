import { useState } from 'react';
import './FormSection.css';

const OtherDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [formValues, setFormValues] = useState(data);

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
      <h2 className="section-title">Other Details</h2>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="religion">Religion</label>
          <input
            type="text"
            id="religion"
            name="religion"
            value={formValues.religion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formValues.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="OC">OC</option>
            <option value="BC-A">BC-A</option>
            <option value="BC-B">BC-B</option>
            <option value="BC-C">BC-C</option>
            <option value="BC-D">BC-D</option>
            <option value="BC-E">BC-E</option>
            <option value="BC-F">BC-F</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="caste">Caste</label>
          <input
            type="text"
            id="caste"
            name="caste"
            value={formValues.caste}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="physicallyChallenged">Physically Challenged</label>
          <select
            id="physicallyChallenged"
            name="physicallyChallenged"
            value={formValues.physicallyChallenged}
            onChange={handleChange}
          >
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="casteCertificateMeeSeva">Caste Certificate Details Mee Seva No</label>
          <input
            type="text"
            id="casteCertificateMeeSeva"
            name="casteCertificateMeeSeva"
            value={formValues.casteCertificateMeeSeva}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="incomeCertificateMeeSeva">Income Certificate Details Mee Seva No</label>
          <input
            type="text"
            id="incomeCertificateMeeSeva"
            name="incomeCertificateMeeSeva"
            value={formValues.incomeCertificateMeeSeva}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="ewsCertificateMeeSeva">In case of OC Caste EWS Certificate Details Mee Seva No</label>
          <input
            type="text"
            id="ewsCertificateMeeSeva"
            name="ewsCertificateMeeSeva"
            value={formValues.ewsCertificateMeeSeva}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rationCardNo">Ration Card No</label>
          <input
            type="text"
            id="rationCardNo"
            name="rationCardNo"
            value={formValues.rationCardNo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="riceCardNo">Rice Card No</label>
          <input
            type="text"
            id="riceCardNo"
            name="riceCardNo"
            value={formValues.riceCardNo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="motherAadhar">Mother Aadhar No</label>
          <input
            type="text"
            id="motherAadhar"
            name="motherAadhar"
            value={formValues.motherAadhar}
            onChange={handleChange}
            maxLength="12"
            pattern="[0-9]{12}"
            placeholder="12 digit Aadhar number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankName">Bank Name</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formValues.bankName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bankIFSC">Bank IFSC Code</label>
          <input
            type="text"
            id="bankIFSC"
            name="bankIFSC"
            value={formValues.bankIFSC}
            onChange={handleChange}
            maxLength="11"
            placeholder="e.g., SBIN0001234"
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountNo">Account No</label>
          <input
            type="text"
            id="accountNo"
            name="accountNo"
            value={formValues.accountNo}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="documents-info">
        <h3>Xerox Copies to Submit</h3>
        <div className="documents-list">
          <div className="doc-item">1. 10th Marks List</div>
          <div className="doc-item">2. Inter Marks List & T. C</div>
          <div className="doc-item">3. Student Aadhar</div>
          <div className="doc-item">4. Mother Aadhar</div>
          <div className="doc-item">5. Caste Certificate</div>
          <div className="doc-item">6. Ration Card & Rice Card</div>
          <div className="doc-item">7. Mother Bank Passbook</div>
          <div className="doc-item">8. Income Certificate</div>
          <div className="doc-item">9. Passport Size photos-2</div>
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

export default OtherDetails;
