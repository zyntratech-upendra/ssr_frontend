import { useState } from 'react';
import './FormSection.css';

const StudyDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [studyDetails, setStudyDetails] = useState(data);

  const handleChange = (index, field, value) => {
    const updatedDetails = [...studyDetails];
    updatedDetails[index][field] = value;
    setStudyDetails(updatedDetails);
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData(studyDetails);
    nextStep();
  };

  return (
    <form className="form-section study-details-section" onSubmit={handleNext}>
      <h2 className="section-title">Last 7 Years Study Details</h2>

      <div className="study-table-container">
        <table className="study-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name of the College/School</th>
              <th>Academic Year</th>
              <th>Class</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            {studyDetails.map((detail, index) => (
              <tr key={index}>
                <td>{detail.sno}</td>
                <td>
                  <input
                    type="text"
                    value={detail.collegeName}
                    onChange={(e) => handleChange(index, 'collegeName', e.target.value)}
                    placeholder="Enter college/school name"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={detail.academicYear}
                    onChange={(e) => handleChange(index, 'academicYear', e.target.value)}
                    placeholder="e.g., 2023-2024"
                  />
                </td>
                <td className="class-fixed">{detail.class}</td>
                <td>
                  <input
                    type="text"
                    value={detail.place}
                    onChange={(e) => handleChange(index, 'place', e.target.value)}
                    placeholder="Enter place"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default StudyDetails;
