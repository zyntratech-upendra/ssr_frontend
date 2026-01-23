import React, { useState, useEffect } from 'react';
import { getAllDepartments } from '../services/departmentService';
import Sidebar  from '../components/Sidebar';
import { fetchTeachersandCoordinatorsData,promoteToCoordinatorfromTeacher ,demoteToTeacherfromCoordinator} from '../services/coordinatorService';

const CoordinatorManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);


  useEffect(() => {
    fetchDepartments();
    fetchTeachersAndCoordinators('');
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await(getAllDepartments());
      const data =  response;
      if (data.success) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTeachersAndCoordinators = async (departmentId) => {
    setLoading(true);
    try {
  

      const response = await fetchTeachersandCoordinatorsData(departmentId);
      const data =response;
      console.log(data)
      if (data.success) {
        setTeachers(data.data.teachers || []);
        setCoordinators(data.data.coordinators || []);
      }
    } catch (error) {
      console.error('Error fetching teachers and coordinators:', error);
      setErrorMessage('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    fetchTeachersAndCoordinators(departmentId);
  };

  const promoteToCoordinator = async (teacherId, teacherName) => {
    setActionLoading(teacherId);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      
      const response = await promoteToCoordinatorfromTeacher(teacherId);

      const data =  response;

      if (data.success) {
        setSuccessMessage(`${teacherName} promoted to Coordinator successfully!`);
        fetchTeachersAndCoordinators(selectedDepartment);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(data.error || 'Failed to promote teacher');
      }
    } catch (error) {
      setErrorMessage('Failed to promote teacher');
    } finally {
      setActionLoading(null);
    }
  };

  const demoteToTeacher = async (coordinatorId, coordinatorName) => {
    if (!window.confirm(`Are you sure you want to demote ${coordinatorName} back to Teacher?`)) {
      return;
    }

    setActionLoading(coordinatorId);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await demoteToTeacherfromCoordinator(coordinatorId);

      const data = response;

      if (data.success) {
        setSuccessMessage(`${coordinatorName} demoted to Teacher successfully!`);
        fetchTeachersAndCoordinators(selectedDepartment);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(data.error || 'Failed to demote coordinator');
      }
    } catch (error) {
      console.error('Error demoting coordinator:', error);
      setErrorMessage('Failed to demote coordinator');
    } finally {
      setActionLoading(null);
    }
  };

  return (
     <div style={{ display: "flex", minHeight: "100vh" }}>
    
    {/* ✅ Sidebar ONLY */}
    <Sidebar onToggle={setSidebarOpen} />

    {/* ✅ Your existing page UI */}
    <main
      style={{
        flex: 1,
        marginLeft: sidebarOpen ? "250px" : "80px",
        transition: "margin-left 0.3s ease",
        padding: "20px"
      }}
    >
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Coordinator Management</h1>

      {successMessage && (
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '20px',
          color: '#155724',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>✓ {successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#155724',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '20px',
          color: '#721c24',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>✗ {errorMessage}</span>
          <button
            onClick={() => setErrorMessage('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#721c24',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Filter by Department (Optional)
        </label>
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>
              {dept.departmentName}
            </option>
          ))}
        </select>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          borderLeft: '4px solid #007bff'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
            Total Teachers
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
            {teachers.length}
          </div>
        </div>

        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '20px',
          borderRadius: '8px',
          borderLeft: '4px solid #28a745'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
            Total Coordinators
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
            {coordinators.length}
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          borderLeft: '4px solid #ffc107'
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px', textTransform: 'uppercase' }}>
            Total Staff
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
            {teachers.length + coordinators.length}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
          color: '#666'
        }}>
          <div>Loading staff data...</div>
        </div>
      ) : (
        <>
          {teachers.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px',
                padding: '10px 0',
                borderBottom: '2px solid #007bff',
                color: '#007bff'
              }}>
                Teachers ({teachers.length})
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '15px'
              }}>
                {teachers.map(teacher => (
                  <div
                    key={teacher._id}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                          {teacher.name}
                        </h3>
                        <div style={{
                          display: 'inline-block',
                          backgroundColor: '#e3f2fd',
                          color: '#007bff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          Teacher
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#666',
                      wordBreak: 'break-all'
                    }}>
                      <strong>Email:</strong> {teacher.email}
                    </div>

                    {teacher.phone && (
                      <div style={{
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        <strong>Phone:</strong> {teacher.phone}
                      </div>
                    )}

                    {teacher.department && (
                      <div style={{
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        <strong>Department:</strong> {teacher.department.departmentName}
                      </div>
                    )}

                    <button
                      onClick={() => promoteToCoordinator(teacher._id, teacher.name)}
                      disabled={actionLoading === teacher._id}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: actionLoading === teacher._id ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        opacity: actionLoading === teacher._id ? 0.6 : 1,
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (actionLoading !== teacher._id) {
                          e.target.style.backgroundColor = '#218838';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#28a745';
                      }}
                    >
                      {actionLoading === teacher._id ? 'Promoting...' : '↑ Promote to Coordinator'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {coordinators.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px',
                padding: '10px 0',
                borderBottom: '2px solid #28a745',
                color: '#28a745'
              }}>
                Coordinators ({coordinators.length})
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '15px'
              }}>
                {coordinators.map(coordinator => (
                  <div
                    key={coordinator._id}
                    style={{
                      backgroundColor: '#f0f8f0',
                      border: '2px solid #28a745',
                      borderRadius: '8px',
                      padding: '20px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#155724' }}>
                          {coordinator.name}
                        </h3>
                        <div style={{
                          display: 'inline-block',
                          backgroundColor: '#d4edda',
                          color: '#155724',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          Coordinator ★
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#666',
                      wordBreak: 'break-all'
                    }}>
                      <strong>Email:</strong> {coordinator.email}
                    </div>

                    {coordinator.phone && (
                      <div style={{
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        <strong>Phone:</strong> {coordinator.phone}
                      </div>
                    )}

                    {coordinator.department && (
                      <div style={{
                        fontSize: '13px',
                        color: '#666'
                      }}>
                        <strong>Department:</strong> {coordinator.department.departmentName}
                      </div>
                    )}

                    <button
                      onClick={() => demoteToTeacher(coordinator._id, coordinator.name)}
                      disabled={actionLoading === coordinator._id}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: actionLoading === coordinator._id ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        opacity: actionLoading === coordinator._id ? 0.6 : 1,
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (actionLoading !== coordinator._id) {
                          e.target.style.backgroundColor = '#c82333';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                      }}
                    >
                      {actionLoading === coordinator._id ? 'Demoting...' : '↓ Demote to Teacher'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {teachers.length === 0 && coordinators.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
              <p>No teachers or coordinators found</p>
            </div>
          )}
        </>
      )}
    </div>
    
    </main>
  </div>
  );
};

export default CoordinatorManagement;
