import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getApplicationSummary} from '../services/admissonService';


function ApplicationSummary() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApplicationSummary(applicationId);
        console.log(response)
        const result =  response;
          setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.successBox}>
        <h2 style={styles.successTitle}>Application Submitted Successfully!</h2>
        <div style={styles.appIdBox}>
          <p style={styles.label}>Application ID:</p>
          <p style={styles.appId}>{data?.applicationId}</p>
        </div>
        
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Student Name:</span>
            <span>{data?.studentName}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Phone No:</span>
            <span>{data?.mobileNo}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Gender:</span>
            <span>{data?.gender}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Status:</span>
            <span>{data?.status}</span>
          </div>
        </div>

        <p style={styles.note}>
          Please save your Application ID for future reference. You will need it for admission tracking.
        </p>

        <div style={styles.buttonContainer}>
          <button
            onClick={() => navigate(`/applications/${applicationId}`)}
            style={styles.button}
          >
            View Full Details
          </button>
          <button
            onClick={() => navigate('/applications')}
            style={styles.buttonSecondary}
          >
            View All Applications
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
  successBox: {
    backgroundColor: '#f0f8f0',
    border: '2px solid #4CAF50',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
  },
  successTitle: {
    color: '#2e7d32',
    marginBottom: '20px',
  },
  appIdBox: {
    backgroundColor: 'white',
    border: '1px solid #4CAF50',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '20px',
  },
  label: {
    margin: '0 0 10px 0',
    color: '#666',
  },
  appId: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2e7d32',
    margin: '0',
  },
  details: {
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  note: {
    color: '#2e7d32',
    fontStyle: 'italic',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  buttonSecondary: {
    padding: '10px 20px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default ApplicationSummary;