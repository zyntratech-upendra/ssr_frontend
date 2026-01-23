import { useState } from 'react';
import './FormSection.css';

const PersonalDetails = ({ data, updateData, nextStep }) => {
  const [formValues, setFormValues] = useState({
    studentName: data.studentName || '',
    fatherName: data.fatherName || '',
    motherName: data.motherName || '',
    dateOfBirth: data.dateOfBirth || '',
    gender: data.gender || '',
    studentAadhar: data.studentAadhar || '',
    bloodGroup: data.bloodGroup || '',
    interHallTicketNo: data.interHallTicketNo || '',
    interGroup: data.interGroup || '',
    tenthHallTicketNo: data.tenthHallTicketNo || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const upperValue = ['studentName', 'fatherName', 'motherName', 'interGroup'].includes(name)
      ? value.toUpperCase()
      : value;

    setFormValues({
      ...formValues,
      [name]: upperValue
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData('', { ...data, ...formValues });
    nextStep();
  };

  return (
    <form className="form-section" onSubmit={handleNext}>
      <h2 className="section-title">Personal Details</h2>

      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="studentName">Student Name *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formValues.studentName}
            onChange={handleChange}
            required
            placeholder="ENTER IN CAPITAL LETTERS"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="fatherName">Father's Name *</label>
          <input
            type="text"
            id="fatherName"
            name="fatherName"
            value={formValues.fatherName}
            onChange={handleChange}
            required
            placeholder="ENTER IN CAPITAL LETTERS"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="motherName">Mother's Name *</label>
          <input
            type="text"
            id="motherName"
            name="motherName"
            value={formValues.motherName}
            onChange={handleChange}
            required
            placeholder="ENTER IN CAPITAL LETTERS"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formValues.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={formValues.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="studentAadhar">Student Aadhar Number *</label>
          <input
            type="text"
            id="studentAadhar"
            name="studentAadhar"
            value={formValues.studentAadhar}
            onChange={handleChange}
            required
            maxLength="12"
            pattern="[0-9]{12}"
            placeholder="12 digit Aadhar number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group</label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formValues.bloodGroup}
            onChange={handleChange}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="interHallTicketNo">Intermediate/Equivalent Hall Ticket No *</label>
          <input
            type="text"
            id="interHallTicketNo"
            name="interHallTicketNo"
            value={formValues.interHallTicketNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="interGroup">Inter Group *</label>
          <input
            type="text"
            id="interGroup"
            name="interGroup"
            value={formValues.interGroup}
            onChange={handleChange}
            required
            placeholder="e.g., MPC, BIPC, CEC"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tenthHallTicketNo">10th Hall Ticket No *</label>
          <input
            type="text"
            id="tenthHallTicketNo"
            name="tenthHallTicketNo"
            value={formValues.tenthHallTicketNo}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-next">
          Next Step
          <span className="btn-icon">→</span>
        </button>
      </div>
    </form>
  );
};

export default PersonalDetails;
