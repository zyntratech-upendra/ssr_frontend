// src/pages/SemesterManagement.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchAllSemsters, updateSemester, createSemester, setCurrentSemester, deleteSemester } from "../services/semesterService.jsx";
import { fetchDepartment } from "../services/attendanceService.jsx";

const SemesterManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);

  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterAcademicYear, setFilterAcademicYear] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    semesterName: "",
    semesterNumber: 1,
    academicYear: "",
    department: "",
    year: 1,
    startDate: "",
    endDate: "",
    isActive: true,
    isCurrent: false,
  });

  useEffect(() => {
    fetchDepartments();
    fetchSemesters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [semesters, filterDepartment, filterAcademicYear]);

  // ✅ FIXED: Same department fix as SubjectManagement
  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const data = await fetchAllSemsters();
      if (data.success) {
        setSemesters(data.data);
      }
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...semesters];

    if (filterDepartment) {
      filtered = filtered.filter((s) => s.department?._id === filterDepartment);
    }
    if (filterAcademicYear) {
      filtered = filtered.filter((s) => s.academicYear === filterAcademicYear);
    }

    setFilteredSemesters(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemester) {
        const data = await updateSemester(editingSemester._id, formData);
        if (data.success) {
          alert("Semester updated successfully!");
        }
      } else {
        const data = await createSemester(formData);
        if (data.success) {
          alert("Semester created successfully!");
        }
      }
      resetForm();
      fetchSemesters();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleSetCurrent = async (id) => {
    if (!window.confirm("Are you sure you want to set this as the current semester? This will change the active semester for all related operations.")) return;

    try {
      const data = await setCurrentSemester(id);
      if (data.success) {
        alert("Current semester updated successfully!");
        fetchSemesters();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setFormData({
      semesterName: semester.semesterName,
      semesterNumber: semester.semesterNumber,
      academicYear: semester.academicYear,
      department: semester.department._id,
      year: semester.year,
      startDate: new Date(semester.startDate).toISOString().split("T")[0],
      endDate: new Date(semester.endDate).toISOString().split("T")[0],
      isActive: semester.isActive,
      isCurrent: semester.isCurrent,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this semester? This action cannot be undone.")) return;

    try {
      const data = await deleteSemester(id);
      if (data.success) {
        alert("Semester deleted successfully");
        fetchSemesters();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      semesterName: "",
      semesterNumber: 1,
      academicYear: "",
      department: "",
      year: 1,
      startDate: "",
      endDate: "",
      isActive: true,
      isCurrent: false,
    });
    setEditingSemester(null);
    setShowForm(false);
  };

  const getUniqueAcademicYears = () => {
    const years = [...new Set(semesters.map((s) => s.academicYear))];
    return years.sort().reverse();
  };

  return (
    <>
      {/* ================= STYLES (EXACT SAME AS SUBJECT MANAGEMENT) ================= */}
      <style>{`
        :root {
          --primary: #ad8ff8;
          --primary-dark: #8b6fe6;
          --soft: #f5f1ff;
          --text: #1e293b;
          --muted: #64748b;
        }

        body {
          background: linear-gradient(135deg,#f7f4ff,#eef2ff);
        }

        .admin-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          padding: clamp(14px, 2vw, 32px);
          transition: margin-left .35s ease;
          overflow-y: auto;
        }

        .page-title {
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 700;
          color: var(--primary-dark);
        }

        .card-ui {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 28px rgba(0,0,0,.08);
          margin-bottom: 22px;
        }

        .btn-main {
          background: linear-gradient(135deg,var(--primary-dark),var(--primary));
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 10px 18px;
          font-weight: 600;
        }

        .btn-danger-soft {
          background: #dc3545;
          color: #fff;
          border-radius: 12px;
          border: none;
          padding: 10px 18px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 16px;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
          gap: 16px;
        }

        .table-wrapper {
          max-height: 420px;
          overflow: auto;
        }

        .table thead th {
          position: sticky;
          top: 0;
          background: linear-gradient(135deg,var(--primary),var(--primary-dark));
          color: #fff;
          white-space: nowrap;
          z-index: 2;
        }

        .status-pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          color: #fff;
          font-weight: 600;
        }

        .form-label-strong {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          font-size: 14px;
          color: var(--text);
        }

        @media (max-width: 768px) {
          .page-title { text-align: center; }
          .header-flex { justify-content: center; }
          .form-grid, .filter-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="admin-layout">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "250px" : "80px",
          }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3 header-flex flex-wrap gap-2">
            <div>
              <h1 className="page-title">Semester Management</h1>
              <small className="text-muted">
                Create, update and manage semesters across departments
              </small>
            </div>

            <button
              className={showForm ? "btn-danger-soft" : "btn-main"}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Create Semester"}
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <section className="card-ui">
              <h5 className="mb-3">
                {editingSemester ? "Edit Semester" : "Create New Semester"}
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label className="form-label-strong">
                      Semester Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.semesterName}
                      onChange={(e) =>
                        setFormData({ ...formData, semesterName: e.target.value })
                      }
                      required
                      placeholder="e.g., Fall Semester 2025"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Department/Branch <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      required
                      className="form-control"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Semester Number <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.semesterNumber}
                      onChange={(e) => {
                        const semNum = parseInt(e.target.value);
                        setFormData({
                          ...formData,
                          semesterNumber: semNum,
                          year: Math.ceil(semNum / 2),
                        });
                      }}
                      required
                      className="form-control"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Year <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      required
                      disabled
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Academic Year <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) =>
                        setFormData({ ...formData, academicYear: e.target.value })
                      }
                      required
                      placeholder="e.g., 2025-2026"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Start Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      End Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                      className="form-control"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label-strong">Status</label>
                    <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                      <label style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.checked })
                          }
                          style={{ marginRight: "8px" }}
                        />
                        Active Semester
                      </label>
                      <label style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={formData.isCurrent}
                          onChange={(e) =>
                            setFormData({ ...formData, isCurrent: e.target.checked })
                          }
                          style={{ marginRight: "8px" }}
                        />
                        Current Semester
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <button
                    type="submit"
                    className="btn-main"
                    style={{ padding: "10px 24px" }}
                  >
                    {editingSemester ? "Update Semester" : "Create Semester"}
                  </button>
                  {editingSemester && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn"
                      style={{
                        padding: "10px 24px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {/* FILTERS */}
          <section className="card-ui">
            <h5 className="mb-3">Filter Semesters</h5>
            <div className="filter-grid">
              <div>
                <label className="form-label-strong">Filter by Department</label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-strong">Filter by Academic Year</label>
                <select
                  value={filterAcademicYear}
                  onChange={(e) => setFilterAcademicYear(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Academic Years</option>
                  {getUniqueAcademicYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="card-ui">
            <h5 className="mb-3">
              All Semesters ({filteredSemesters.length})
            </h5>

            <div className="table-wrapper">
              <table className="table table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th>Semester Name</th>
                    <th>Department</th>
                    <th className="text-center">Semester</th>
                    <th className="text-center">Year</th>
                    <th className="text-center">Academic Year</th>
                    <th className="text-center">Duration</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSemesters.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">
                        No semesters found
                      </td>
                    </tr>
                  ) : (
                    filteredSemesters.map((semester) => (
                      <tr key={semester._id}>
                        <td><strong>{semester.semesterName}</strong></td>
                        <td>{semester.department?.departmentName || "N/A"}</td>
                        <td className="text-center">{semester.semesterNumber}</td>
                        <td className="text-center">{semester.year}</td>
                        <td className="text-center">{semester.academicYear}</td>
                        <td className="text-center">
                          {new Date(semester.startDate).toLocaleDateString()} - 
                          {new Date(semester.endDate).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          <span
                            className="status-pill"
                            style={{
                              backgroundColor: semester.isCurrent 
                                ? "#10b981" 
                                : semester.isActive 
                                ? "#3b82f6" 
                                : "#6b7280"
                            }}
                          >
                            {semester.isCurrent ? "CURRENT" : semester.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-center">
                          <div style={{ display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap" }}>
                            {!semester.isCurrent && (
                              <button
                                onClick={() => handleSetCurrent(semester._id)}
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                  fontSize: "12px"
                                }}
                              >
                                Set Current
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(semester)}
                              className="btn btn-sm btn-success me-1"
                              style={{ borderRadius: "6px" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(semester._id)}
                              className="btn btn-sm btn-danger"
                              style={{ borderRadius: "6px" }}
                              disabled={semester.isCurrent}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SemesterManagement;
