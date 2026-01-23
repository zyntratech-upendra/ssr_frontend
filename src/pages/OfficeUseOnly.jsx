import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function OfficeUseOnly() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/summary/${applicationId}`
        );
        const result = await response.json();
        if (result.success) {
          setFormData(result.data?.officeUseOnly || {});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/office-use/${applicationId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('Office use data saved successfully');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Office Use Only</h1>
      <div style={styles.appId}>Application ID: {applicationId}</div>

      <div style={styles.formContainer}>
        <div style={styles.formGroup}>
          <label>Application Fee Paid</label>
          <select
            name="applicationFeePaid"
            value={formData.applicationFeePaid || ''}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Student ID Generated</label>
          <input
            type="text"
            name="studentIdGenerated"
            value={formData.studentIdGenerated || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Online Application Password</label>
          <input
            type="text"
            name="onlineApplicationPassword"
            value={formData.onlineApplicationPassword || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Applied Online 1st Part</label>
          <select
            name="appliedOnlinePart1"
            value={formData.appliedOnlinePart1 || ''}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>College Options Entered</label>
          <select
            name="collegeOptionsEntered"
            value={formData.collegeOptionsEntered || ''}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>College Allotment Status</label>
          <input
            type="text"
            name="collegeAllotmentStatus"
            value={formData.collegeAllotmentStatus || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.buttonContainer}>
          <button onClick={() => navigate(-1)} style={styles.buttonSecondary}>
            Cancel
          </button>
          <button onClick={handleSave} style={styles.button} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
  },
  appId: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: '20px',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  },
  formGroup: {
    marginBottom: '20px',
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
    justifyContent: 'flex-end',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '10px 20px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default OfficeUseOnly;